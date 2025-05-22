import { Component, OnInit } from '@angular/core';
import moment = require('moment');
import { LeaveService } from '../../services/leave.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emp-notification',
  templateUrl: './emp-notification.component.html',
  styleUrls: ['./emp-notification.component.scss']
})
export class EmpNotificationComponent implements OnInit {

  headerValue;
  pendingDiv = true;
  approvedDiv = false;
  declinedDiv = false;
  FetchEmpLeaveHistoryData = [];
  pendingLeaves;
  pendingLeavesSearchText;
  pendingTable = true;
  noPendingDiv = false;
  approvedLeaves;
  approvedTable = true;
  noApprovedDiv = false
  approvedLeavesSearchText;
  declinedLeaves;
  declinedTable = true;
  noDeclinedDiv = false;
  declinedLeavesSearchText;

  constructor(
    private leaveService:LeaveService,
    private router: Router
    ) { }

  ngOnInit() {
    this.getLeaveSetup();
  }

  tabevent(event){
    if(event.target.outerText === 'Pending'){
      this.headerValue = event.target.outerText;
      this.pendingDiv = true;
      this.approvedDiv = false;
      this.declinedDiv = false;
    }else if(event.target.outerText === 'Approved'){
      this.headerValue = event.target.outerText;
      this.pendingDiv = false;
      this.approvedDiv = true;
      this.declinedDiv = false;
    }else if(event.target.outerText === 'Declined'){
      this.headerValue = event.target.outerText;
      this.pendingDiv = false;
      this.approvedDiv = false;
      this.declinedDiv = true;
    }
  }

  getLeaveSetup(){
    this.leaveService.FetchEmployeeLeaveHistoryApproverID().subscribe((data: any) => {
      //console.log(data)
      this.FetchEmpLeaveHistoryData = data;
      this.pendingLeaves = this.FetchEmpLeaveHistoryData.filter((elm) => elm.leave_status_name === 'Pending');
      this.approvedLeaves = this.FetchEmpLeaveHistoryData.filter((elm) => elm.leave_status_name === 'Approved');
      this.declinedLeaves = this.FetchEmpLeaveHistoryData.filter((elm) => elm.leave_status_name === 'Declined');

      if(this.pendingLeaves.length === 0){
        this.pendingTable = false;
        this.noPendingDiv = true;
      }

      if(this.approvedLeaves.length === 0){
        this.approvedTable = false;
        this.noApprovedDiv = true;
      }

      if(this.declinedLeaves.length === 0){
        this.declinedTable = false;
        this.noDeclinedDiv = true;
      }
      //console.log(this.pendingLeaves)
    });
  }

  public requestTypePending(id, type){
    if(type === 'Annual Leave' || type === 'Sick Leave'){
      this.leaveDetails(id)
    }else if(type === 'Checkin'){
      let type = 'Pending';
      let btnDisp = 'toApprove';
      this.checkinDetails(id, type, btnDisp)
    }else if(type === 'Checkin/Checkout Overwrite'){
      let type = 'Pending';
      let btnDisp = 'toApprove';
      this.inOutOverwrite(id, type, btnDisp)
    }
  }

  public requestTypeApproved(id, type){
    if(type === 'Annual Leave' || type === 'Sick Leave'){
      this.leaveDetails(id)
    }else if(type === 'Checkin'){
      let type = 'Approved';
      let btnDisp = 'done';
      this.checkinDetails(id, type, btnDisp)
    }else if(type === 'Checkin/Checkout Overwrite'){
      let type = 'Approved';
      let btnDisp = 'done';
      this.inOutOverwrite(id, type, btnDisp)
    }
  }

  public requestTypeDeclined(id, type){
    if(type === 'Annual Leave' || type === 'Sick Leave'){
      this.leaveDetails(id)
    }else if(type === 'Checkin'){
      let type = 'Declined';
      let btnDisp = 'cancel';
      this.checkinDetails(id, type, btnDisp)
    }else if(type === 'Checkin/Checkout Overwrite'){
      let type = 'Declined';
      let btnDisp = 'cancel';
      this.inOutOverwrite(id, type, btnDisp)
    }
  }

  public leaveDetails(id){
    localStorage.setItem('leaveId',id);
    this.router.navigate(['/leave-approve']);
  }

  public checkinDetails(id, type, btnDisp){
    let obj = {
      "id":id,
      "type":type,
      "btnVal":btnDisp
    }
    localStorage.setItem('checkin-Details', JSON.stringify(obj));
    this.router.navigate(['/checkin-approve']);
  }

  public inOutOverwrite(id, type, btnDisp){
    let obj = {
      "id":id,
      "type":type,
      "btnVal":btnDisp
    }
    localStorage.setItem('overwrite-Details', JSON.stringify(obj));
    this.router.navigate(['/attendance-approve']);
  }









}
