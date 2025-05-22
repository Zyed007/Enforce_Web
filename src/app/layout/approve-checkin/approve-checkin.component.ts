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
  selector: 'app-approve-checkin',
  templateUrl: './approve-checkin.component.html',
  styleUrls: ['./approve-checkin.component.scss']
})
export class ApproveCheckinComponent implements OnInit {

  showCheckinSpinner: boolean;
  pendingCheckin: any[];
  appovedCheckin: any[];
  declineCheckin: any[];
  leaveID;
  checkinData;
  showApproveBtn;
  approverForm: FormGroup;
  commentsValue: boolean;
  declineformSubmitted: boolean;
  leaveStatusName;
  statusDiv = false;
  checkinStatus;
  showChartSpinner: boolean=true;
  public chartArea: Object = {
    border: {
        width: 0
    }
  };
  public primaryXAxis: Object;
  primaryYAxis: {};
  public title: string;
  tooltip: { enable: boolean; };
  palette: string[];
  public data1: Object[];
  public data2: Object[];
  public chart: ChartComponent;

  sick_used_leaves: number;
  earned_used_leaves: number;
  earned_remaining: number;
  sick_remaining: number;
  earnedLeaves: number;
  casualLeaves: number;
  showLeaveInfo: boolean;
  empjoinedDate: string;
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
    if(localStorage.getItem('checkin-Details')){
      let getobject = JSON.parse(localStorage.getItem('checkin-Details'));
      console.log(getobject.id)
      this.leaveDetails(getobject.id, getobject.type, getobject.btnVal)

      localStorage.removeItem('checkin-Details');
    }

    this.getCheckinList();
    this.findEmpOrgLeaveHistory();

    this.primaryXAxis = {
      valueType: 'Category', labelFormat: 'yMMM', majorGridLines : {
        color : 'blue',
        width : 0
     },
     minorGridLines : {
        color : 'red',
        width : 0
     }
    };

    this.primaryYAxis = {
      majorGridLines : {
        color : 'blue',
        width : 0
      },
      majorTickLines: { width: 0 }, lineStyle: { width: 0 },
      minorGridLines : {
        color : 'red',
        width : 0
      }
     };

     this.title = 'Time-off Trend';
     this.tooltip = { enable: true };
     this.palette = [ "#F6B53F", "#E94649","#6FAAB0", "#C4C24A"];

     this.data1= [
        { x: 'Jan',  days: 0 },
        { x: 'Feb',  days: 0 }, { x: 'Mar',  days: 0 },
        { x: 'Apr',  days: 0 },
        { x: 'May',  days: 0 }, { x: 'Jun',  days: 0 },
        { x: 'Jul',  days: 0 }, { x: 'Aug',  days: 0 },
        { x: 'Sep',  days: 0 }, { x: 'Oct',  days: 0 },
        { x: 'Nov',  days: 0 }, { x: 'Dec',  days: 0 },
      ];

    this.data2= [
      { x: 'Jan',  days: 0 },
      { x: 'Feb',  days: 0 }, { x: 'Mar',  days: 0 },
      { x: 'Apr',  days: 0 },
      { x: 'May',  days: 0 }, { x: 'Jun',  days: 0 },
      { x: 'Jul',  days: 0 }, { x: 'Aug',  days: 0 },
      { x: 'Sep',  days: 0 }, { x: 'Oct',  days: 0 },
      { x: 'Nov',  days: 0 }, { x: 'Dec',  days: 0 },
    ];


    this.approverForm= new FormGroup({
      desc: new FormControl(''),
    });
  }

  getCheckinList(){
    this.showCheckinSpinner = true;
    this.leaveService.FetchEmployeeLeaveHistoryApproverID().subscribe((data:any) => {
      console.log(data)
      this.pendingCheckin = data.filter((elm) => {
        return elm.leave_name === 'Checkin' && elm.leave_status_name === 'Pending'
      });
      this.appovedCheckin = data.filter((elm) => {
        return elm.leave_name === 'Checkin' && elm.leave_status_name === 'Approved'
      });
      this.declineCheckin = data.filter((elm) => {
        return elm.leave_name === 'Checkin' && elm.leave_status_name === 'Declined'
      });
      this.showCheckinSpinner = false;
      console.log(this.pendingCheckin)
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
    this.timesheetService.GetApproveTimesheetByID(postData).subscribe((data:any) => {
      console.log(data)
      this.checkinData = data;
      this.findEmpLeaveHistory(this.checkinData.team_member_empid[0]);
      this.fetchEmpLeave(this.checkinData.team_member_empid[0]);
      this.findJoiningDate(this.checkinData.team_member_empid[0]);
      this.spinner.hide();
    });
  }

  commentsEntry(e){
    if(e.value!=''){
    this.commentsValue=false;

    }else{
    this.commentsValue=true;
    }
  }

  declineLeave(){
    this.declineformSubmitted = true;
    this.commentsValue = true;
  }

  approveNotification(id){
    let user_info= JSON.parse(localStorage.getItem('user_info'));
    this.spinner.show();
    let postData={
      timesheetID: id,
      approverID: user_info['id'],
    }
    console.log('postData',postData);
    this.leaveService.ApprovalByTimesheetIDAndApproverID(postData).subscribe((data:any)  => {
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
    this.declineformSubmitted = true;
    this.commentsValue = true;
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

  findEmpLeaveHistory(id) {
    let postData={
      "id":id
    }
    this.showChartSpinner=true;
    this.leaveService.FetchEmployeeLeaveHistoryEmpID(postData).subscribe((data:any)  => {
      if(data){
        this.showChartSpinner=false;
          /* let datas = new DataManager(data);
          this.leaveHistory = datas.dataSource['json'];
          this.toolbar = ['Search' ];
          this.chartHistory=data; */
        for(var i=0;i<data.length;i++){
          if(data[i].leave_status_name=="Approved"){
            if(data[i].month=='January'){
              this.data1[0]['days']=data[i].days
            }
            if(data[i].month=='February'){
              this.data1[1]['days']=data[i].days
            } if(data[i].month=='March'){
              this.data1[2]['days']=data[i].days
            } if(data[i].month=='April'){
              this.data1[3]['days']=data[i].days
            } if(data[i].month=='May'){
              this.data1[4]['days']=data[i].days
            }
            if(data[i].month=='June'){
              this.data1[5]['days']=data[i].days
            }
            if(data[i].month=='July'){
              this.data1[6]['days']=data[i].days
            }
            if(data[i].month=='August'){
              this.data1[7]['days']=data[i].days
            }
            if(data[i].month=='September'){
              this.data1[8]['days']=data[i].days
            }
            if(data[i].month=='October'){
              this.data1[9]['days']=data[i].days
            }
            if(data[i].month=='November'){
              this.data1[10]['days']=data[i].days
            }
            if(data[i].month=='December'){
              this.data1[11]['days']=data[i].days
            }
          } else{
            if(data[i].month=='January'){
              this.data2[0]['days']=data[i].days
            }
            if(data[i].month=='February'){
              this.data2[1]['days']=data[i].days
            } if(data[i].month=='March'){
              this.data2[2]['days']=data[i].days
            } if(data[i].month=='April'){
              this.data2[3]['days']=data[i].days
            } if(data[i].month=='May'){
              this.data2[4]['days']=data[i].days
            }
            if(data[i].month=='June'){
              this.data2[5]['days']=data[i].days
            }
            if(data[i].month=='July'){
              this.data2[6]['days']=data[i].days
            }
            if(data[i].month=='August'){
              this.data2[7]['days']=data[i].days
            }
            if(data[i].month=='September'){
              this.data2[8]['days']=data[i].days
            }
            if(data[i].month=='October'){
              this.data2[9]['days']=data[i].days
            }
            if(data[i].month=='November'){
              this.data2[10]['days']=data[i].days
            }
            if(data[i].month=='December'){
              this.data2[11]['days']=data[i].days
            }
          }
        }
    if(this.chart){
        this.chart.refresh();
    }





}else{

}

      },
      error  => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })


      }

      )
  }

  public fetchEmpLeave(id){
    let user_info= JSON.parse(localStorage.getItem('user_info'));
    let postData={
        "id": id,
    }
    return this.leaveService.FetchEmployeeLeaveEmpID(postData).subscribe(
      (data:any)  => {
      if(data.length!=0){
       let approved=[]
       let used_leaves=0;
       let earned_used_leaves=0;
        for (var i = 0; i < data.length; i++) {
          if(data[i].leave_status_name=="Approved"){
             approved.push(data[i]);
          }
        }
        used_leaves = approved.reduce(function(sum, record){
        if(record.leave_days != '' && record.leave_name=="Sick Leave") return sum +parseInt(record.leave_days) ;
        else return sum;
      }, 0);
      earned_used_leaves = approved.reduce(function(sum, record){
        if(record.leave_days != '' && record.leave_name!="Sick Leave") return sum +parseInt(record.leave_days) ;
        else return sum;
      }, 0);
      this.sick_used_leaves = used_leaves;
      this.earned_used_leaves = earned_used_leaves;
      this.earned_remaining = this.earnedLeaves - earned_used_leaves;
      this.sick_remaining = this.casualLeaves - used_leaves;
      }
      },
      error  => {
        Swal.fire(
          'Error!',
          'Error.',
          'error'
        ).then((result)=> { })
      })
  }

  findJoiningDate(id) {
    let postData={
     "id": id
    }
    let joinedDate='';
    this.empService.getByEmployeeID(postData).subscribe(
     (data:any)  => {
      if(data){
        if(data.joined_date == null || data.joined_date==''){
          this.showLeaveInfo = false;
        }else{
          this.showLeaveInfo = true;
          let joinedDate = moment(data['joined_date']).format('L');
          let currentDate=moment().format('L');
          var diff = moment(currentDate).diff(moment(joinedDate), "month")
          this.earnedLeaves = diff*(2.5);
          this.casualLeaves = ((1.25)*moment().month() + 1);
        }
        this.empjoinedDate = data.joined_date!=null?moment(data.joined_date).format('L'):null;
      }else{
        this.empjoinedDate=null;
      }
     },
     error  => {
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
