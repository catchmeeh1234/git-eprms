import { Component, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PrEditComponent } from '../modals/pr-edit/pr-edit.component';
import { SessionStorageService } from '../../services/session-storage.service';
import { ConfirmationComponent } from '../modals/confirmation/confirmation.component';
import { PrUpdateStatusService } from '../../services/pr-update-status.service';

@Component({
  selector: 'app-items-view',
  templateUrl: './items-view.component.html',
  styleUrls: ['./items-view.component.scss']
})

export class ItemsViewComponent implements OnInit, OnChanges {
  public dataSource:any;
  public dataSource1:any;
  //public displayedColumns = ['PRNo', 'PRItems', 'PRQuantity', 'PRUnit', 'PRCost', 'TotalCost', 'Actions'];
  public displayedColumns = ['PRItems', 'PRQuantity', 'PRUnit', 'PRCost', 'TotalCost'];
  public result:any;
  public arrayOfYears:any;
  public selectedYear:string;
  public yearButton:string;
  public remarks:string;
  public prnumber:string;

  public prequeststatus:string;
  public prequestdivision:string;
  public purpose:string;
  public isBtnApproval:boolean = false;

  //logged in user's details
  public username = this.sessionStorageService.getSession('fullname');
  public access = this.sessionStorageService.getSession('access');
  public division = this.sessionStorageService.getSession('division').toUpperCase();
  public isShowApproveDisapprove: boolean = false;
  public isShowCancelled: boolean = false;

  public statusColor:string;


  public disDate:string;
  public disStatus:string;
  public disBy:string;

  public StatusResult:any;
  public ResStatus:string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private document:PrService,
              private router:Router,
              public dialog: MatDialog,
              private sessionStorageService:SessionStorageService,
              private prUpdateStatus:PrUpdateStatusService,
  ) {
    this.arrayOfYears = [];
    this.selectedYear = new Date().getFullYear().toString();
    this.yearButton = this.selectedYear;
  }

  ngOnInit(): void {
    const url = new URL(window.location.href);
    const prnum = url.searchParams.get("prnum");

    this.loadPRDetails(prnum);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.prnumber) {
      // Perform actions when myVariable changes
      console.log('myVariable changed:');
    }
  }

  cancelPR(prno) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '500px',
        headerText: 'Confirmation',
        message: 'Are you sure you want to cancel this pr?',
        isRemarksVisible: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      } else {

        if (result.confirm === 'yes') {

        } else {
          return;
        }

        this.loadPRDetails(prno);

      }
    });


  }

  checkApproveDisapproveButton() {
    if (this.access === 'Encoder') {
      console.log(1);
      return this.isShowApproveDisapprove = false;
    }
    if(this.access === 'Approver' && this.division == this.prequestdivision && this.prequeststatus === 'For DM Approval') {
      console.log(3);
      return this.isShowApproveDisapprove = true;
    }
    if(this.access === 'Budget' && this.prequeststatus === 'For Budget Checking') {
      console.log(4);
      return this.isShowApproveDisapprove = true;
    }
    if(this.access === 'Cash' && this.prequeststatus === 'For Cash Allocation') {
      console.log(5);
      return this.isShowApproveDisapprove = true;
    }
    if(this.prequeststatus === 'Disapprove') {
      console.log(6);
      return this.isShowApproveDisapprove = false;
    }
    if(this.prequeststatus === 'Cancelled') {
      console.log(7);
      return this.isShowApproveDisapprove = false;
    }
  }

  checkCancelButton() {
    if (this.access === 'Encoder' && this.division === this.prequestdivision && this.prequeststatus !== 'Cancelled' && this.prequeststatus !== 'For Printing' && !this.prequeststatus.includes("Disapprove")) {
      return this.isShowCancelled = true;
    } else {
      return this.isShowCancelled = false;
    }
  }

  loadPRDetails(prnum) {
    this.prnumber = prnum;
    this.document.loadItems(prnum)
    .subscribe(data => {
      this.result = data;
      this.dataSource = new MatTableDataSource(this.result);

      this.dataSource.paginator = this.paginator;
    });

    this.document.getPurpose(prnum)
    .subscribe(data => {
      let result:any = data;
      this.prequeststatus = result[0].pr_status;
      this.prequestdivision = result[0].pr_division;
      this.purpose = result[0].pr_purpose;
      this.remarks = result[0].remarks;
      //console.log(this.prequeststatus);
    });
    
    this.document.telLDisapprove(prnum)
    .subscribe(data => {
      let result:any = data;
      this.StatusResult = result;
      this.ResStatus = result.pr_status;
      this.disDate = result[0].pr_datetime;
      this.disBy = result[0].pr_updatedBy;
    });

    this.document.prHistory(prnum)
    .subscribe(data => {
      let result:any = data;
      this.StatusResult = result;
      //console.log(this.StatusResult);
    });

      setTimeout(() => {
        this.checkApproveDisapproveButton();
        this.checkCancelButton();
      }, 0);
    
  }

  PRBack() {
    this.router.navigate(['/auth/pages/viewPR']);
  }

  editPR() {
    if (this.prnumber === null || this.prnumber === "") {
      return;
    }

    const dialogRef = this.dialog.open(PrEditComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '1000px',
        headerText: 'Edit Purchase Request',
        number: this.prnumber
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      } else {

        this.loadPRDetails(result);
        console.log('closed' + result);

      }
    });


  }

  onPrintPr() {
    window.open(`http://192.168.10.32:81/eprms/print2.php?prno=${this.prnumber}`, '_blank')
  }

  onUpdateApproveStatus(stat:string) {
    if (this.prnumber == null) {
      return;
    }

    let is_remarks_visible:boolean;

    if (stat === "Approve") {
      is_remarks_visible = false;
    } else if(stat === "Disapprove") {
      is_remarks_visible = true;
    } else if(stat === "Cancelled"){
      is_remarks_visible = true;
    } else {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '500px',
        headerText: 'Confirmation',
        message: `Are you sure you want to ${stat}?`,
        isRemarksVisible: is_remarks_visible,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      // Handle the result if needed
      if (result.confirm === 'yes') {
        this.isBtnApproval = true;
        this.prUpdateStatus.updatePrRequest(this.prnumber, this.prequeststatus, stat, result.remarks);

      } else {
        return;
      }
    });
  }
}
