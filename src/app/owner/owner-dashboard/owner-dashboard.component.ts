import { Component, OnInit } from '@angular/core';
import { AdministrativeService } from '../../services/administrative.service';

import moment = require('moment');
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss']
})
export class OwnerDashboardComponent implements OnInit {

  orgCount

  today: Date = new Date(new Date().toDateString());
  maxRangeDate: Date = this.today;
  //last7days=new Date(new Date(new Date().setDate(new Date().getDate() - 7)).toDateString());
  dateRangeValue: Date[] = [this.today, this.today];
  startDate;
  endDate;

  constructor(
    public administrativeService: AdministrativeService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.startDate = moment(this.today).format('L')
    this.endDate = moment(this.today).format('L')
    this.getAllOrganization();
  }

  getAllOrganization(){
    let postData = {
      startDate: this.startDate,
      endDate: this.endDate
    }
    console.log(postData)
    this.administrativeService.GetEventTotalByOrgId(postData).subscribe((data: any) => {
      console.log(data)
      this.orgCount = data.length;
      this.spinner.hide();
    });
  }

  changeDate(event){
    //console.log(event)
    this.spinner.show();
    this.startDate = moment(event.startDate).format('L')
    this.endDate = moment(event.endDate).format('L')
    this.getAllOrganization();
  }

}
