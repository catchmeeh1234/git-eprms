import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PrService } from '../../../services/pr.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeService } from '../../../services/employee.service';
import {map, startWith} from 'rxjs/operators';
import { ConfirmationGenericComponent } from '../confirmation-generic/confirmation-generic.component';

@Component({
  selector: 'app-pr-edit',
  templateUrl: './pr-edit.component.html',
  styleUrls: ['./pr-edit.component.scss']
})
export class PrEditComponent implements OnInit {
  public editForm: FormGroup;
  filteredOptions: any;
  options: any;

  public divisions:any;
  public units:any;
  public pr_items:any;

  public control_name_item;
  public control_name_qty;
  public control_name_unit;
  public control_name_cost;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pr: PrService,
    private formBuilder:FormBuilder,
    private dialogRef:MatDialogRef<PrEditComponent>,
    private employee:EmployeeService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      pr_no_hidden: new FormControl('', [Validators.required]),
      pr_number: new FormControl('',[Validators.required]),
      requestor: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      division: new FormControl('', [Validators.required]),
      purpose: new FormControl('', [Validators.required]),
      cancel_remarks: new FormControl('', [Validators.required]),
    });

    this.editForm.get('designation')?.disable();
    this.editForm.get('division')?.disable();

    this.displayDivisions();
    this.displayUnits();
    this.displayPrAndItems();
    this.getAllData();
  }

  displayPrAndItems() {

    this.pr.loadPrAndItems(this.data.number)
    .subscribe(res => {
      let result:any = res;

      this.editForm.setValue({
        pr_no_hidden: result[0].pr_no,
        pr_number: result[0].pr_no,
        requestor: result[0].pr_requestor,
        designation: result[0].pr_designation,
        division: result[0].pr_division,
        purpose: result[0].pr_purpose,
        cancel_remarks: result[0].remarks,
      });
      this.pr_items = result;

      this.displayPRItems(this.pr_items);
    });
  }

  displayPRItems(pritems_param) {
    const controlNames: string[] = Object.keys(this.editForm.controls);
    // Remove each control from the form group
    controlNames.forEach((controlName: string) => {
      if(controlName === "pr_number" || controlName === "requestor" || controlName === "designation"|| controlName === "division" || controlName === "purpose" || controlName === "cancel_remarks" || controlName === "pr_no_hidden") {
      } else {
        this.editForm.removeControl(controlName);
      }
    });
    for (const [index, pr_item] of pritems_param.entries()) {

      //add item
      this.control_name_item = `item_${index}`;
      const item = new FormControl(null, [Validators.required]);
      item.setValue(pr_item.pr_items);
      this.editForm.addControl(this.control_name_item, item);

      //add qty
      this.control_name_qty = `qty_${index}`;
      const qty = new FormControl(null, [Validators.required]);
      qty.setValue(pr_item.pr_quantity);
      this.editForm.addControl(this.control_name_qty, qty);

      //add unit
      this.control_name_unit = `unit_${index}`;
      const unit = new FormControl(null, [Validators.required]);
      unit.setValue(pr_item.pr_unit);
      this.editForm.addControl(this.control_name_unit, unit);

      //add cost
      this.control_name_cost = `cost_${index}`;
      const cost = new FormControl(null, [Validators.required]);
      cost.setValue(pr_item.pr_cost);
      this.editForm.addControl(this.control_name_cost, cost);

    }
    console.log(this.editForm.value);
  }


  displayDivisions() {
    this.pr.getDivisions()
    .subscribe(res => {
      let result:any = res;
      console.log(result);

      this.divisions = result;
    });
  }

  displayUnits() {
    this.pr.getUnitMeasurements()
    .subscribe( res => {
      let result:any = res;
      this.units = result;
    });
  }

  addQuantity() {
    //this.quantities().push(this.newQuantity());
    const newRow = { pr_items: "", pr_quantity: "", pr_cost: "", pr_unit: "" };
    this.pr_items.push(newRow);

    this.displayPRItems(this.pr_items);
  }

  removeQuantity(row) {

    const dialogRef = this.dialog.open(ConfirmationGenericComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '500px',
        headerText: 'Confirmation',
        message: 'Are you sure you want to remove this item?',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result if needed
      if (result.confirm === 'yes') {
        const index = this.pr_items.indexOf(row);
        if (index > -1) {
          this.pr_items.splice(index, 1);

          setTimeout(() => {
            this.displayPRItems(this.pr_items);
          }, 0);
        }
      }
    });
  }


  onOptionSelected(event: any) {

    const selectedValue = event.option.value;

    this.employee.selectEmployee(selectedValue)
    .subscribe(data => {
      let result:any = data;
      this.editForm.get('division').setValue(result[0].division);
      this.editForm.get('designation').setValue(result[0].designation);
      //this.designation.setValue(result[0].designation);
    });
    // Update the other field with the selected value
    // this.otherControl.setValue(selectedValue);
  }

  onSavePR() {
    // console.log(this.editForm.value);
    // console.log(this.pr_items.length);
    this.editForm.get('designation')?.enable();
    this.editForm.get('division')?.enable();
    this.pr.editPR(this.editForm.value, this.pr_items.length)
    .subscribe(data => {
      //console.log(data);
      this.pr.loadPR()
      .subscribe(data => {
        let res:any = data;
        if (this.pr.dataSourcePRTable !== undefined && this.pr.dataSourcePRTable !== null) {
          this.pr.dataSourcePRTable.data = res;
        }

        this.editForm.get('designation')?.disable();
        this.editForm.get('division')?.disable();

        setTimeout(() => {
          this.dialogRef.close(this.editForm.get('pr_number')?.value);
        }, 1000);
      });


    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.full_name.toLowerCase().includes(filterValue));
  }

  async getAllData() {
    try {
      await this.employee.getEmp().toPromise().then((res:any) => {
        this.options = res;

        this.filteredOptions = this.editForm.get("requestor").valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
      });

    } catch (error) {
      console.error(error);
    }
}

}
