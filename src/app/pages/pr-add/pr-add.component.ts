import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { SessionStorageService } from '../../services/session-storage.service';
import { NotificationsService } from '../../services/notifications.service';
import { WebSocketService } from '../../services/web-socket.service';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
//import { StatusMessageComponent } from '../status-message/status-message.component';

@Component({
  selector: 'app-pr-add',
  templateUrl: 'pr-add.component.html',
  styleUrls: ['pr-add.component.scss']
})


export class PrAddComponent implements OnInit {
  public dataSource:any;
  //public displayedColumns = ['PRNo','DateCreated','Requestor','Designation','Division','Purpose','PRStatus'];
  public prload;
  public prNumber:any;
  public units:any;
  public divisions:any;
  public selectedDivision:string;
  public selectedDesignation:string;

  public addForm: FormGroup;
  public isAddFormValid: boolean = false;

  posts: any;

  productForm: FormGroup;

  options: any;
  filteredOptions: any;

  constructor(
    private document:PrService,
    private fb:FormBuilder,
    private sessionStorageService: SessionStorageService,
    private notif: NotificationsService,
    public websock: WebSocketService,
    private employee: EmployeeService,
    private snackBar: MatSnackBar,
    private router:Router
  ) {
    this.productForm = this.fb.group({
      quantities: this.fb.array([]) ,
    });
  }

  ngOnInit(): void {
    this.addForm = new FormGroup({
      requestor: new FormControl('',[Validators.required]),
      date1: new FormControl(new Date(), [Validators.required]),
      //name: new FormControl(''),
      division: new FormControl({value: '', disabled: true}, [Validators.required]),
      designation: new FormControl({value: '', disabled: true}, [Validators.required]),
      purpose: new FormControl('', [Validators.required]),
    });

     //listen to any value change on add form
     this.addForm.valueChanges.subscribe(val => {
      if (this.addForm.valid === true) {
        this.isAddFormValid = true;
      } else {
        this.isAddFormValid = false;
      }
    });

    this.document.loadPRNo()
    .subscribe(data => {
      this.websock.response = data;
    });

    this.dataSource = new MatTableDataSource(this.websock.response);

    this.onDisplayUnitMeasurements();
    this.onDisplayDivisions();
    this.getAllData();
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.full_name.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any) {
    const selectedValue = event.option.value;

    this.employee.selectEmployee(selectedValue)
    .subscribe(data => {
      let result:any = data;
      this.addForm.get('division').setValue(result[0].division);
      this.addForm.get('designation').setValue(result[0].designation);
      //this.designation.setValue(result[0].designation);
    });
    // Update the other field with the selected value
    // this.otherControl.setValue(selectedValue);
  }

  onDisplayUnitMeasurements() {
    this.document.getUnitMeasurements()
    .subscribe(data => {
      this.units = data;
    });
  }

  onDisplayDivisions() {
    this.document.getDivisions()
    .subscribe(data => {
      this.divisions = data;
    });
  }

  quantities() : FormArray {
    return this.productForm.get("quantities") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      item: ['', Validators.required],
      qty: ['', [Validators.required,  Validators.pattern('^[0-9]*$')]],
      unit: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],

    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());

    const div = document.querySelector(".pr-items");
    setTimeout(() => {
      div.scrollTop = div.scrollHeight;
    }, 0);
  }

  removeQuantity(i:number) {
    this.quantities().removeAt(i);
  }

  openStatusMessage(message) {
    const config: MatSnackBarConfig = {
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['style-snackbar-error']
    };
    //this.snackBar.openFromComponent(StatusMessageComponent, config);

    this.snackBar.open(message, 'Dismiss', config);
  }

  clearAddPRForm() {
    //let requestor = <HTMLInputElement>document.querySelector('.requestor');
    let designation = <HTMLInputElement>document.querySelector('.designation');
    let purpose = <HTMLInputElement>document.querySelector('.purpose');
    let prno = <HTMLInputElement>document.querySelector('.prno');

    this.productForm.reset();
    //this.requestor.setValue('');
    this.addForm.get('requestor').setValue('');

    designation.value = '';
    purpose.value = '';

    prno.value = this.websock.response;
  }



  addPurchaseRequest() {
    let prno = <HTMLInputElement>document.querySelector('.prno');
    let datecreated = <HTMLInputElement>document.querySelector('.datecreated');
    let requestor = <HTMLInputElement>document.querySelector('.requestor');
    let designation = <HTMLInputElement>document.querySelector('.designation');
    let division = <HTMLInputElement>document.querySelector('.division');
    let purpose = <HTMLInputElement>document.querySelector('.purpose');
    let prstatus = <HTMLInputElement>document.querySelector('.prstatus');

    // let items = <HTMLInputElement>document.querySelector('.items');
    // let quantity = <HTMLInputElement>document.querySelector('.quantity');
    // let unit = <HTMLInputElement>document.querySelector('.unit');
    // let cost = <HTMLInputElement>document.querySelector('.cost');

    if (!this.productForm.valid || prno.value == "" || purpose.value == "" || requestor.value == "" || designation.value == "") {
      this.openStatusMessage('Please Fill up necessary details');
      return;
    }

    var username = localStorage.getItem('fullname')
    // if (prno.value == "" || purpose.value == "" || requestor.value == "" || designation.value == "") {
    //   return;
    // }

    //let x = this.document.addPR(prno.value, datecreated.value, requestor.value, designation.value, division.value, purpose.value, prstatus.value);
    let x = this.document.addPR(prno.value, datecreated.value, requestor.value, designation.value, this.addForm.get('division').value, purpose.value, prstatus.value, this.productForm.value, username);
    //console.log(prno.value, datecreated.value, requestor.value, designation.value, division.value, purpose.value, prstatus.value, this.productForm.value);
    //console.log(prno.value, datecreated.value, requestor.value, designation.value, division.value, purpose.value, prstatus.value)

    x.subscribe(data => {
      let response:any = data;
      if (response === "Inserted Successfully") {
        let title = 'Purchase Request Created';
        let message = `Purchase Request: ${prno.value} has been created by ${this.sessionStorageService.getSession('username')}`;


        this.notif.insertNotification(title, message, this.sessionStorageService.getSession('access'), this.addForm.get('division').value, prstatus.value, prno.value).subscribe(data => {
          //this.websock.status_message = devicedeveui;
          console.log(data);
        });

        this.websock.sendNotif(message);
        this.websock.updateNotification();
        this.clearAddPRForm();
        this.viewpritems(prno.value);
      }
    });

     /* prno.value = "";
      datecreated.value = "";
      requestor.value = "";
      designation.value = "";
      division.value = "Administrative Services";
      purpose.value = "";
      prstatus.value = "For Approve";*/
  }

  viewpritems(selectedPrNO) {
    if (selectedPrNO == null) {
      return;
    }
    this.router.navigate(['/auth/pages/viewItems'], { queryParams: { prnum: selectedPrNO } });
  }

  async getAllData() {
      try {
        await this.employee.getEmp().toPromise().then((res:any) => {
          this.options = res;

          this.filteredOptions = this.addForm.get("requestor").valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
          );
        });

      } catch (error) {
        console.error(error);
      }
  }

}
