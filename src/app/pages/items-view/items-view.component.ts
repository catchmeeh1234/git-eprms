import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-items-view',
  templateUrl: './items-view.component.html',
  styleUrls: ['./items-view.component.scss']
})

export class ItemsViewComponent implements OnInit {
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

  public disDate:string;
  public disStatus:string;
  public disBy:string;

  public StatusResult:any;
  public ResStatus:string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private document:PrService, private router:Router) {
    this.arrayOfYears = [];
    this.selectedYear = new Date().getFullYear().toString();
    this.yearButton = this.selectedYear;
  }

  ngOnInit(): void {
    var url = new URL(window.location.href);
    var prnum = url.searchParams.get("prnum");
    this.prnumber = url.searchParams.get("prnum");
    this.remarks = url.searchParams.get("remarks");
    //console.log(prnum);

    this.document.loadItems(prnum)
    .subscribe(data => {
      this.result = data;
      this.dataSource = new MatTableDataSource(this.result);

      //this.dataSource.paginator = this.paginator;
    });

    this.document.getPurpose(prnum)
    .subscribe(data => {
      let result:any = data;
      this.prequeststatus = result[0].pr_status;
      this.prequestdivision = result[0].pr_division;
      this.purpose = result[0].pr_purpose;
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

    const pr_title: any[] = [
      {
        Title: prnum
      }
    ];
  }

  PRBack() {
    this.router.navigate(['/auth/pages/viewPR']);
  }

  onUpdateApproveStatus(pr_status:string) {
    console.log(this.prnumber);
    console.log(this.prequeststatus);
    console.log(this.prequestdivision);
    console.log(pr_status);
  }

}