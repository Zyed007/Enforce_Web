import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import moment = require('moment');
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../services/employee.service';
import { DataManager } from '@syncfusion/ej2-data';
import { array } from '@amcharts/amcharts4/core';
import { ChartComponent } from '@syncfusion/ej2-angular-charts';


@Component({
  selector: 'app-approve-empleave',
  templateUrl: './approve-empleave.component.html',
  styleUrls: ['./approve-empleave.component.scss']
})
export class ApproveEmpleaveComponent implements OnInit {
  activeTabID;
  leaveForm: FormGroup;
  public today: Date = new Date(new Date().toDateString());
public approvalvalue;
@ViewChild('chart',{static:true})
public chart: ChartComponent;
  approvalSpan: any;
  leaveData: any;
  leaveEndDate: any;
  leaveStartDate: any;
  appliedBy: any;
  leaveSpan: any;
  appliedOn: any;
  notes: any='';
  leaveId: any;
  emp_id: any;
  leave_setup_id: any;
  minDate: any;
  maxDate: any;
  addformSubmitted: boolean;
  leaveStatusData: any;
  declineformSubmitted: boolean=false;
  commentsValue=true;
  leaveName: any;
  pendingLeaves: any[];
  appovedLeaves: any;
  declinedLeaves: any[];
  leaveStatusName="Pending";
  showLeaveLogSpinner: boolean;
  public primaryXAxis: Object;
  public title: string;
  public data1: Object[];
  public data2: Object[];
  public chartArea: Object = {
    border: {
        width: 0
    }
};
  primaryYAxis: {};
  showLeaveInfo: boolean;
  empjoinedDate: string;
  sick_used_leaves: number;
  earned_used_leaves: number;
  earned_remaining: number;
  sick_remaining: number;
  earnedLeaves: number;
  casualLeaves: number;
  leaveHistory: Object[];
  toolbar: string[];
  orgleaveHistory: Object[];
  chartHistory: any;
  public legend: Object = {
    visible: false
}
  palette: string[];
  showChartSpinner: boolean=true;
  leaveLog: Object[];
  tooltip: { enable: boolean; };
  marker: { visible: boolean; width: number; height: number; };
approveRange(e){

  this.approvalSpan=e.daySpan;

}

commentsEntry(e){
  if(e.value!=''){
  this.commentsValue=false;

  }else{
  this.commentsValue=true;

  }
}
  constructor(private leaveService:LeaveService,private empService:EmployeeService, private spinner:NgxSpinnerService,private toastr:ToastrService) { }
  public  getLeaveSetup(){
    this.spinner.show();
    this.showLeaveLogSpinner=true;
    this.leaveService.FetchEmployeeLeaveOrgID().subscribe(

      (data:any) => {
    this.showLeaveLogSpinner=false;

if(data.length!=0){
this.leaveData=data;
let pending=[]
let approved=[]
let declined=[]
this.spinner.hide();

  // let dataObj = JSON.parse(data['token']);
//

  for (var i = 0; i < data.length; i++) {
    // logik to create new items

    if(data[i].leave_status_name=="Pending"){

  pending.push(data[i]);
    }
    else if(data[i].leave_status_name=="Approved"){
      approved.push(data[i]);

    }else{
      declined.push(data[i]);
    }


}
this.pendingLeaves=pending;
this.appovedLeaves=approved;
this.declinedLeaves=declined;

if(localStorage.getItem('leaveId')!=''){
  const leaveId=localStorage.getItem('leaveId')
  this.leaveDetails(leaveId);

}


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
      leaveDetails(id){
        this.leaveId=id;
        let postData={
          id:id
        }

        this.activeTabID = id
        // this.leaveForm.reset();
        this.spinner.show();
        this.leaveService.FindEmployeeLeaveByID(postData).subscribe(

          (data:any) => {
    if(data){
      this.spinner.hide();

    this.leaveEndDate=data[0].leave_end_date;
    this.leaveStartDate=data[0].leave_start_date;
    this.appliedBy=data[0].full_name;
    this.leaveSpan=data[0].leave_days;
    this.appliedOn=data[0].ondate_applied;
    this.notes=data[0].emp_notes;
    this.emp_id=data[0].emp_id;
    this.leave_setup_id=data[0].leave_setup_id;
    this.minDate=data[0].leave_start_date;
    this.maxDate=data[0].leave_end_date;
    this.leaveName=data[0].leave_name;
    this.leaveStatusName=data[0].leave_status_name;

     this.approvalvalue= [new Date(data.leave_start_date), new Date(data.leave_end_date)]
     this.leaveForm.patchValue({
      approvalrange:[new Date(data[0].leave_start_date), new Date(data[0].leave_end_date)]
    })
    this.findJoiningDate(data[0].emp_id);
    this.fetchEmpLeave(data[0].emp_id);
    this.findEmpLeaveHistory(data[0].emp_id);
    this.findEmpLeaveLog(data[0].emp_id);
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
      findJoiningDate(id) {
         let postData={
          "id": id
              }
        let joinedDate='';

        this.empService.getByEmployeeID(postData).subscribe(
          (data:any)  => {


    if(data){
      if(data.joined_date==null || data.joined_date==''){
        this.showLeaveInfo=false;
      }else{
        this.showLeaveInfo=true;
        let joinedDate=moment(data['joined_date']).format('L');
        let currentDate=moment().format('L');
        var diff = moment(currentDate).diff(moment(joinedDate), "month")
        this.earnedLeaves=diff*(2.5);
        this.casualLeaves=((1.25)*moment().month() + 1);

      }
       this.empjoinedDate=data.joined_date!=null?moment(data.joined_date).format('L'):null;


    }else{
      this.empjoinedDate=null;

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
      // if(user_info['id']!=data[i].id){

        let postData={
    "id": id,


        }
        return this.leaveService.FetchEmployeeLeaveEmpID(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);

          if(data.length!=0){

           let approved=[]
           let used_leaves=0;
           let earned_used_leaves=0;
             // let dataObj = JSON.parse(data['token']);
           //

             for (var i = 0; i < data.length; i++) {
               // logik to create new items

               if(data[i].leave_status_name=="Approved"){
                 approved.push(data[i]);

               }


           }
           used_leaves= approved.reduce(function(sum, record){
            if(record.leave_days != '' && record.leave_name=="Sick Leave") return sum +parseInt(record.leave_days) ;
            else return sum;
          }, 0);
          earned_used_leaves= approved.reduce(function(sum, record){
            if(record.leave_days != '' && record.leave_name!="Sick Leave") return sum +parseInt(record.leave_days) ;
            else return sum;
          }, 0);
          this.sick_used_leaves=used_leaves;
          this.earned_used_leaves=earned_used_leaves;
          this.earned_remaining=this.earnedLeaves-earned_used_leaves;
          this.sick_remaining=this.casualLeaves-used_leaves;


                    }
          // this.router.navigate(["/organizations"]);

          },
          error  => {
            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              //used Arrow function here
              (result)=> {

                //  this.router.navigate(['/dashboard']);
              })


          }

          )

      }
      public approveLeave(){
        let user_info= JSON.parse(localStorage.getItem('user_info'));
        let approvalPeriod=this.leaveForm.get('approvalrange').value;
        this.addformSubmitted=true;
        let leave_status_id;
        for(var i=0;i<this.leaveStatusData.length;i++){
          if(this.leaveStatusData[i].leave_status_name=="Approved"){
            leave_status_id=this.leaveStatusData[i].id;

          }
        }

      let postData=  {
          "leave_id": this.leaveId,
          "aprover_id": user_info['id'],
          // "leave_setup_id": this.leave_setup_id,
          // "leave_start_date": this.leaveStartDate,
          // "leave_end_date": this.leaveEndDate,
          // "leave_days": this.leaveSpan,
          // "ondate_applied": this.appliedOn,
          // "approver_emp_id": user_info['id'],
          // "is_approved": true,
          // "emp_notes": this.notes,
          "approve_start_date": moment(approvalPeriod[0]).format('L'),
          "approve_end_date": moment(approvalPeriod[1]).format('L'),
          "approved_days": this.approvalSpan,
          "ondate_approved": moment().format('L'),
          "approver_notes": this.leaveForm.get('desc').value,
          // "leave_status_id":leave_status_id

        }

       if(this.leaveForm.status=="VALID"){
        return this.leaveService.UpdateApprovedByID(postData).subscribe(
          (data:any)  => {

          if(data.status==200){
        this.addformSubmitted=false;
        this.leaveForm.reset();

        this.getLeaveSetup();
            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });


                    }

          },
          error  => {
            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              //used Arrow function here
              (result)=> {

                //  this.router.navigate(['/dashboard']);
              })


          }

          )

       }

      }
      public declineLeave(){
        let user_info= JSON.parse(localStorage.getItem('user_info'));
        let approvalPeriod=this.leaveForm.get('approvalrange').value;
        this.declineformSubmitted=true;
        let leave_status_id;
        for(var i=0;i<this.leaveStatusData.length;i++){
          if(this.leaveStatusData[i].leave_status_name=="Declined"){
            leave_status_id=this.leaveStatusData[i].id;

          }
        }
        let postData=  {
          "timesheetID": this.leaveId,
          "approverID": user_info['id'],


        }
      // let postData=  {
      //     "id": this.leaveId,
      //     "emp_id": this.emp_id,
      //     "leave_setup_id": this.leave_setup_id,
      //     "leave_start_date": this.leaveStartDate,
      //     "leave_end_date": this.leaveEndDate,
      //     "leave_days": this.leaveSpan,
      //     "ondate_applied": this.appliedOn,
      //     "approver_emp_id": user_info['id'],
      //     "is_approved": false,
      //     "emp_notes": this.notes,
      //     "approve_start_date":null,
      //     "approve_end_date": null,
      //     "approved_days": null,
      //     "ondate_approved": moment().format('L'),
      //     "approver_notes": this.leaveForm.get('desc').value,
      //     "leave_status_id":leave_status_id

      //   }
       if(this.leaveForm.get('desc').value!="" && this.leaveForm.get('desc').value!=null  ){


        return this.leaveService.DeclineByLeaveIDAndApproverID(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);

          if(data.status==200){
        this.declineformSubmitted=false;
        this.leaveForm.reset();

        this.getLeaveSetup();
            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });


                    }
          // this.router.navigate(["/organizations"]);

          },
          error  => {
            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              (result)=> {

              })


          }

          )

       }

      }
      public  FetchLeaveStatusOrgID(){
        this.leaveService.FetchLeaveStatusOrgID().subscribe(

          (data:any) => {


        this.leaveStatusData=data;



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
          findEmpLeaveHistory(id) {
            let postData={
              "id":id
            }
        this.showChartSpinner=true;
            this.leaveService.FetchEmployeeLeaveHistoryEmpID(postData).subscribe(
              (data:any)  => {


        if(data){

          this.showChartSpinner=false;

          let datas = new DataManager(data);
      this.leaveHistory=datas.dataSource['json'];
      this.toolbar = ['Search' ];
      this.chartHistory=data;
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

          }
          else{
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

          findEmpLeaveLog(id) {
            let postData={
              "id":id
            }

            this.leaveService.FetchEmployeeLeaveLogEmpID(postData).subscribe(
              (data:any)  => {


        if(data){


          let datas = new DataManager(data);
      this.leaveLog=datas.dataSource['json'];
      this.toolbar = ['Search' ];


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
          findEmpOrgLeaveHistory() {
            let postData={
              "id":localStorage.getItem('org_id')
            }

            this.leaveService.FetchEmployeeLeaveHistoryOrgID(postData).subscribe(
              (data:any)  => {


        if(data){


          let datas = new DataManager(data);
      this.orgleaveHistory=datas.dataSource['json'];
      this.toolbar = ['Search' ];


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
  ngOnInit() {
    $.getScript('assets/js/pages/custom/user/profile.js')
this.getLeaveSetup();
this.FetchLeaveStatusOrgID();
this.findEmpOrgLeaveHistory();
this.tooltip = { enable: true };
        this.marker = { visible: true, width: 10, height: 10 }
this.palette = [ "#F6B53F", "#E94649","#6FAAB0", "#C4C24A"];
this.primaryXAxis = {
  // title: 'Month',
  valueType: 'Category', labelFormat: 'yMMM', majorGridLines : {
    color : 'blue',
    width : 0
 },

      //  labelStyle: { color: '#ffffff' },
 minorGridLines : {
    color : 'red',
    width : 0
 }
};
 this.primaryYAxis = {
  // minimum: 0, maximum: 30,
  // interval: 5,

  majorGridLines : {
    color : 'blue',
    width : 0
 },
 majorTickLines: { width: 0 }, lineStyle: { width: 0 },
 minorGridLines : {
    color : 'red',
    width : 0
 }
 }

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

this.title = 'Timeoff Trend';
    this.leaveForm = new FormGroup({
      desc:new FormControl(''),
      leaveType:new FormControl(''),
      approvalrange:new FormControl('', [Validators.required]),





    });
  }

}
