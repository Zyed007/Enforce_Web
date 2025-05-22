import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ChartComponent } from '@syncfusion/ej2-angular-charts';
import moment = require('moment');
import { DataManager } from '@syncfusion/ej2-data';
//services
import { LeaveService } from '../../services/leave.service';
import { TimeSheetService } from '../../services/timesheet.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-approve-attendance',
  templateUrl: './approve-attendance.component.html',
  styleUrls: ['./approve-attendance.component.scss']
})
export class ApproveAttendanceComponent implements OnInit {

  showCheckinSpinner: boolean;
  pendingCheckin: any[];
  appovedCheckin: any[];
  declinedCheckin: any[];
  leaveID;
  checkinOutOverwrite;
  checkinData;
  showApproveBtn;
  approverForm: FormGroup;
  //commentsValue: boolean;
  //declineformSubmitted: boolean;
  leaveStatusName;
  statusDiv = false;
  checkinStatus;
  //table variables
  orgleaveHistory: Object[];
  toolbar: string[];
  activeTabID;

  constructor(
    private leaveService : LeaveService,
    public timesheetService : TimeSheetService,
    private spinner : NgxSpinnerService,
    private toastr: ToastrService,
    private empService:EmployeeService
  ) { }

  ngOnInit() {
    if(localStorage.getItem('overwrite-Details')){
      let getobject = JSON.parse(localStorage.getItem('overwrite-Details'));
      console.log(getobject.id)
      this.leaveDetails(getobject.id, getobject.type, getobject.btnVal)

      localStorage.removeItem('overwrite-Details');
    }

    this.getCheckinList();
    this.findEmpOrgLeaveHistory();



    this.approverForm= new FormGroup({
      desc: new FormControl(''),
    });
  }

  getCheckinList(){
    this.showCheckinSpinner = true;
    this.leaveService.FetchEmployeeLeaveHistoryApproverID().subscribe((data:any) => {
      this.pendingCheckin = data.filter((elm) => {
        return elm.leave_name === 'Checkin/Checkout Overwrite' && elm.leave_status_name === 'Pending'
      });
      this.appovedCheckin = data.filter((elm) => {
        return elm.leave_name === 'Checkin/Checkout Overwrite' && elm.leave_status_name === 'Approved'
      });
      this.declinedCheckin = data.filter((elm) => {
        return elm.leave_name === 'Checkin/Checkout Overwrite' && elm.leave_status_name === 'Declined'
      });
      this.showCheckinSpinner = false;
    });
  }

  leaveDetails(id, checkStat, approveType){
    if(approveType === 'toApprove'){
      this.showApproveBtn = true;
    } else {
      this.showApproveBtn = false;
    }

    this.activeTabID = id

    this.statusDiv = true;
    this.checkinStatus = checkStat;

    this.leaveID=id;
    let postData={
      id:id
    }
    this.spinner.show();
    console.log(postData)
    this.timesheetService.GetTimesheetOverrideDetailsByTimesheetID(postData).subscribe((data:any) => {
      console.log(data)
      this.checkinOutOverwrite = data;
      let sendData = {
        'id': this.checkinOutOverwrite.timesheet_id
      }
      this.timesheetService.GetApproveTimesheetByID(sendData).subscribe((data) => {
        this.checkinData = data;
        console.log(this.checkinData)
        this.spinner.hide();
      })
    });
  }

  commentsEntry(e){
    /* if(e.value!=''){
    this.commentsValue=false;

    }else{
    this.commentsValue=true;
    } */
  }

  approveNotification(id){
    let user_info= JSON.parse(localStorage.getItem('user_info'));
    this.spinner.show();
    let postData={
      timesheetID: id,
      approverID: user_info['id'],
    }
    console.log('postData',postData);
    this.leaveService.ApproveByCheckinOverwriteIDAndApproverID(postData).subscribe((data:any)  => {
      console.log(data)
      if(data.status=='200'){
        this.getCheckinList();
        this.spinner.hide();
        this.toastr.success(data['desc'], undefined,{
          positionClass: 'toast-top-center'
        });
      }
    },error  => {
        this.spinner.hide();
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then((result)=> { })
    })

  }

  declineNotification(id){
    //this.declineformSubmitted = true;
    //this.commentsValue = true;
    let  user_info= JSON.parse(localStorage.getItem('user_info'));
    let postData={
      timesheetID: id,
      approverID: user_info['id']
    }
    this.leaveService.DeclineByTimesheetIDAndApproverID(postData).subscribe((data:any) => {
      if(data.status=200){
        this.getCheckinList();
        this.spinner.hide();
        this.toastr.success(data['desc'], undefined,{
          positionClass: 'toast-top-center'
        });
      }
    },error  => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then((result)=> { })
    })
  }

  findEmpOrgLeaveHistory() {
    let postData={
      "id":localStorage.getItem('org_id')
    }
    this.leaveService.FetchEmployeeLeaveHistoryOrgID(postData).subscribe((data:any)  => {
      if(data){
        let datas = new DataManager(data);
        this.orgleaveHistory=datas.dataSource['json'];
        this.toolbar = ['Search' ];
      }else{ }
    },error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then((result)=> { })
    })
  }


}
