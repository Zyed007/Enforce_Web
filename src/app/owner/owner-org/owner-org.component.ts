import { Component, OnInit, ViewChild } from '@angular/core';
import { AdministrativeService } from '../../services/administrative.service';
import { ToolbarItems, GridComponent  } from '@syncfusion/ej2-angular-grids';
import moment = require('moment');
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-owner-org',
  templateUrl: './owner-org.component.html',
  styleUrls: ['./owner-org.component.scss']
})
export class OwnerOrgComponent implements OnInit {

  @ViewChild('orgGrid', {static:false}) public orgGrid: GridComponent;
  @ViewChild('singleOrgGrid', {static:false}) public singleOrgGrid: GridComponent;

  orgData;
  singleData;
  allOrg = true;
  singleOrg = false;

  today: Date = new Date(new Date().toDateString());
  maxRangeDate: Date = this.today;
  //last7days=new Date(new Date(new Date().setDate(new Date().getDate() - 7)).toDateString());
  dateRangeValue: Date[] = [this.today, this.today];
  startDate;
  endDate;
  currentOrg;


  public toolbarOptions: ToolbarItems[];

  constructor(
    public administrativeService: AdministrativeService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.startDate = moment(this.today).format('L')
    this.endDate = moment(this.today).format('L')
    this.toolbarOptions = ['Search'];
    this.getAllOrganization();
  }

  changeDate(event){
    //console.log(event)
    this.spinner.show();
    this.startDate = moment(event.startDate).format('L')
    this.endDate = moment(event.endDate).format('L')
    if(this.allOrg){
      this.getAllOrganization();
    }else{
      this.singleOrgfun(this.currentOrg)
    }

  }

  getAllOrganization(){
    let postData = {
      startDate: this.startDate,
      endDate: this.endDate
    }
    console.log(postData)
    this.administrativeService.GetEventTotalByOrgId(postData).subscribe((data: any) => {
      console.log(data)
      this.orgData = data;
      this.spinner.hide();
    });
  }

  createdOrg(): void {
    document.getElementById(this.orgGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.orgGrid.search((event.target as HTMLInputElement).value)
    });
  }

  singleOrgfun(data){
    this.currentOrg = data;
    let postData = {
      orgID: this.currentOrg.org_id,
      fromDate: this.startDate,
      toDate: this.endDate
    }
    this.administrativeService.GetEventCountsByOrgId(postData).subscribe((data: any) => {
      this.singleData = data;
      this.spinner.hide();
    });
    this.allOrg = false;
    this.singleOrg = true;
  }

  createdSingleOrg(): void {
    document.getElementById(this.singleOrgGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.singleOrgGrid.search((event.target as HTMLInputElement).value)
    });
  }

  backToMainOrg(){
    this.allOrg = true;
    this.singleOrg = false;
    this.getAllOrganization();
  }

}
