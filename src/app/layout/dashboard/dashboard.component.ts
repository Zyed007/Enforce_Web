
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import * as moment from 'moment';
import { TimeSheetService } from '../../services/timesheet.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import { AdminSettingService } from './../../services/admin-setting.service';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart

} from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { DataManager, Query, UrlAdaptor, WebApiAdaptor, ODataAdaptor } from '@syncfusion/ej2-data';
import { LeaveService } from '../../services/leave.service';
import * as _ from "lodash";

declare var $:any;
// import {NTPClient} from 'ntpclient';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()],
    encapsulation: ViewEncapsulation.None,


})
export class DashboardComponent implements OnInit {

  public date=moment().format('dddd, D MMM YYYY');
  public dateValue=moment().format('ddd, D MMM YYYY');
  public dateText=moment().format('ddd, D MMM YYYY');
  public pageSettings;
  public minDate: any;
  public maxDate: any;
  dateRangeForm: FormGroup;

  commonModuleName;

  freeLanceCount=0;
  outSourceCount=0;
  permanentCount=0;
  totalEmp=0;
  attendedEmp=0;
  timeSheetFreeLanceCount=0;
  timeSheetOutSourceCount=0;
  timeSheetPermanentCount=0;
  absentMem=0;
  // lat;
  // lng;
  lat= 25.2748983;
  lng= 55.37456589999999;
  zoom=10;
  markers = [

  ]

  //notification
  newNotificationData = [];
  readNotificationData = [];
  NewNotificationDiv = true;
  ReadNotificationDiv = false;

  public today: Date = new Date(new Date().toDateString());
    public weekStart=new Date(new Date().toDateString());
     public  weekEnd=new Date().setDate(new Date().getDate() - 7);

    public monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
    public monthEnd: Date = this.today;
    public lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
    public lastEnd: Date = this.today;
    public yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
    public yearEnd: Date = this.today;
    public maxRangeDate: Date = this.today;
      weekattendedEmp: number=0;
  weekabsentMem: number=0;
  showweeksData: boolean;
  showtodaysData: boolean;
  weekoutSourceCount=0;
  fromDateValue: string;
  toDateValue: string;
  datePickerForm: FormGroup;

  isTodayActive;
  isWeekActive;
  isMonthActive;
  isRangeActive;
  projData: any=[];

 public taskCompletedList;
 public taskOpenList;
 public taskInProgressList;
 public activityOptions: Select2Options;
 public totalOverTimeCount=0;
public approvalvalue;
public approveformSubmitted=false;
public leaveStatusName;
  tasksList: { id: string; text: string; }[];
  employeeTasksList: any;
  assignedToList: any;
  tasks: { id: string; text: string; }[];
  allTimeLog: any;
  showTimeLogSpinner: boolean;
  showExcpCountSpinner: boolean;
  showOvtCountSpinner: boolean;
  viewProjType: any;
  viewProjName: any;
  viewProjCheckin: any;
  viewProjCheckout: any;
  data12: Object[];
  taskStatus: any;
  tasktobeUpdated: any;
  taskStatusData: { id: string; text: string; }[];
  dashboardCheckOutExceptionData=0;
  dashboardCheckInExceptionData=0;
  dashboardLessHoursData=0;
  exceptionCount=0;
  overDueList: any;
  leaveData: any;
  pendingLeaves: any[];
  appovedLeaves: any[];
  declinedLeaves: any[];
  showLeaveLogSpinner: boolean;
@ViewChild('mapCloseBtn',{static:false}) mapCloseBtn: ElementRef;
@ViewChild('statusCloseBtn',{static:false}) statusCloseBtn: ElementRef;
@ViewChild('notifyCloseBtn',{static:false}) notifyCloseBtn: ElementRef;

  viewDashboard = false;
  leaveForm: FormGroup;
  declineformSubmitted: boolean;
  commentsValue: boolean;
  approvalSpan: any;
  approveStartTime: any;
  approveEndTime: any;
  leaveSpan: any;
  appliedBy: any;
  leaveName: any;
  appliedOn: any;
  leaveId: any;
  reason_desc: any;
  appliedFor: any;
  checkinType: any;
  checkinPlace: any;
  total_hrs: any;
  approver1_empid: any;
  approver2_empid: any;
  reason_id: any;
  approverId: any;
  approverForm: FormGroup;
  showApproveBtn: boolean=false;


    constructor(public timesheetService:TimeSheetService,private userService:UserService,private leaveService:LeaveService, private toastr: ToastrService,private router: Router,private spinner:NgxSpinnerService,private projectService:ProjectService,private taskService:TaskService,
      public AdminSettingService: AdminSettingService,) {
      this.activityOptions={
        placeholder:"Select",
        width: "100%",
      }
  //   new NTPClient()
  // .getNetworkTime()
  // .then(date =>
  // .catch(err => console.error('err',err));



    //   function ShowTime() {
    //     var current_time = moment().tz('Asia/Dubai').format('h:mm A');
    //     $('#txtDefaultTime').val(current_time);
    //     $('#txtDefaultCheckoutTime').val(current_time);
    //     window.setTimeout("ShowTime()", 1000);//1000 miliseconds = 1 second
    // }


      $(".date-picker").change(function () {
      //
      //   var input = $("#selectDate").html();
      //   var parts = input.split("/");
      //   var d1 = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      //  this.date=(moment(d1).format('dddd, D MMM YYYY'));

      //   //sessiondate
      //   localStorage.setItem("SessionDate", moment(d1).format('dddd, D MMM YYYY'));

      //   var startdate = moment(d1).format('dddd, D MMM YYYY');
      //   var enddate = null;
        $('.page-header-fixed.page-sidebar-closed-hide-logo').loader({
          image: '../loader.gif'
        });


      });


    }
    public OnCloseStatusModal(){
      $("#task_status_modal").modal("hide");
      this.statusCloseBtn.nativeElement.click();

    }
    approveNotification(){
      $("#notification_modal").modal("hide");
      let  user_info= JSON.parse(localStorage.getItem('user_info'));

this.spinner.show();

      this.statusCloseBtn.nativeElement.click();
      let postData={
        timesheetID:this.approverId,
        approverID:user_info['id'],
      }
      console.log('postData',postData);

      this.leaveService.ApprovalByTimesheetIDAndApproverID(postData).subscribe(
        (data:any)  => {


if(data.status=='200'){
  this.spinner.hide();
  this.getLeaveSetup();
  this.toastr.success(data['desc'], undefined,{
    positionClass: 'toast-top-center'
});

}



// this.GetTimesheetDashboardDataByOrgID(this.weekEnd,this.weekEnd)
//this.GetTimesheetDashboardDataByOrgID(this.today,this.today)



        },
        error  => {
          this.spinner.hide();

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

  tabevent(value){
    if(value === 'newNot'){
      this.NewNotificationDiv = true;
      this.ReadNotificationDiv = false;
    }else{
      this.NewNotificationDiv = false;
      this.ReadNotificationDiv = true;
    }
  }

  getAllNotificationForOrg(){
    let user_info = JSON.parse(localStorage.getItem('user_info'))
    let postData = {
      "orgID": user_info.org_id !== null ? user_info.org_id : localStorage.getItem('org_id'),
      "empID": user_info.id
    }
    this.AdminSettingService.GetLeaveRelatedNotificationsByOrgIDandEmpID(postData).subscribe((data: any) =>{
      console.log(data)
      this.newNotificationData = [];
      this.readNotificationData = [];
      data.map((elm) => {
        if(elm.read_status === false){
          this.newNotificationData.push(elm)
        } else{
          this.readNotificationData.push(elm)
        }
      });
    });
  }

  viewEditNotification(notData, message){
    localStorage.setItem('notData',JSON.stringify(notData))
    localStorage.setItem('message',message)
    if(notData.message === 'Requested Approval for Updating Employee Details' || notData.message === 'Requested Approval for Creating new Employee' || notData.message === 'Requested Approval for Deleting Employee Details' ){
      this.router.navigate(['/settings-new/team-members'])
    }
    else if(notData.message ==="Requested Approval for adding Inventory Item"){
      console.log("HERE")
      this.router.navigate(['/inventory'])
      localStorage.setItem('inventory_id',notData.reference_id)
    }
      else{
      this.router.navigate(['/leave-details'])
    }
  }

  mapClicked($event: MouseEvent) {
    // this.markers.push({
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng,
    //   draggable: true
    // });
  }
    public  TotalEmployeeAbsentDashboardDataByOrgID(fromDate,toDate) {
      let postData={
        "fromDate": moment(fromDate).format('L'),
        "toDate": moment(toDate).format('L')
      }
    let totalEmp=0;
      this.timesheetService.TotalEmployeeAbsentDashboardDataByOrgID(postData).subscribe(
        (data:any)  => {


if(data){

  this.absentMem=data;

}



// this.GetTimesheetDashboardDataByOrgID(this.weekEnd,this.weekEnd)
//this.GetTimesheetDashboardDataByOrgID(this.today,this.today)



        },
        error  => {
          this.spinner.hide();

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
        absentDetails(type){
                     this.router.navigate(['/dashboard-details']);
                     sessionStorage.setItem('attendType',type)

        }
        public getUsersInfo(){
          //  $.getScript('assets/js/audioTimer.js')
          let userId={
           ID:localStorage.getItem('user_id')
          }
           this.userService.getByUserID(userId).subscribe(
             data  => {



             if(data['timesheet']){

              this.allTimeLog=data['timesheet'];



             }


             },
             error  => {
              this.spinner.hide();

               Swal.fire(
                 'Error!',
                 'Org List Error.',
                 'error'
               ).then(
                 //used Arrow function here
                 (result)=> {

                   //  this.router.navigate(['/dashboard']);
                 })


             }

             )
           ;


        }
    public  TotalEmployeeDashboardDataByOrgID(fromDate,toDate) {
 this.spinner.show();
      let postData={
        "fromDate": moment(fromDate).format('L'),
        "toDate": moment(toDate).format('L')
      }
    let totalEmp=0;
      this.timesheetService.TotalEmployeeDashboardDataByOrgID(postData).subscribe(
        (data:any)  => {


if(data){
  data.forEach(element => {
    totalEmp+=element.attandance;
    if(element.employee_type_name=='FREELANCE'){
      this.freeLanceCount=element.attandance;

    }else if(element.employee_type_name=='OUTSOURCED'){
      this.outSourceCount=element.attandance;
    this.weekoutSourceCount=element.attandance;



    }else if(element.employee_type_name=='PERMANENT'){
      this.permanentCount=element.attandance;

    }
  });
}


       this.totalEmp=totalEmp;
// this.GetTimesheetDashboardDataByOrgID(this.weekEnd,this.weekEnd)
//this.GetTimesheetDashboardDataByOrgID(this.today,this.today)



        },
        error  => {
          this.spinner.hide();

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

    public  GetTimesheetDashboardDataByOrgID(fromDate,toDate) {
      this.timeSheetFreeLanceCount=0;
      this.timeSheetOutSourceCount=0;
      this.timeSheetPermanentCount=0;
      let totalEmp=0;
      let totalOutsource=0;

      this.spinner.show();
      let postData={
        "fromDate": moment(fromDate).format('L'),
        "toDate": moment(toDate).format('L')
      }
      this.timesheetService.GetTimesheetDashboardDataByOrgID(postData).subscribe(
        (data:any)  => {
      //this.spinner.hide();


if(data && data.length!=0){

  data.forEach(element => {
  totalEmp+=element.attandance;

    if(element.employee_type_name=='FREELANCE'){
      this.timeSheetFreeLanceCount=element.attandance;

    }else if(element.employee_type_name=='OUTSOURCED'){
      totalOutsource+=element.attandance;
      this.timeSheetOutSourceCount=element.attandance;


    }else if(element.employee_type_name=='PERMANENT'){
      this.timeSheetPermanentCount=element.attandance;
    }

  });
  this.attendedEmp=totalEmp;
  this.timeSheetOutSourceCount=totalOutsource;



}else{

 this.attendedEmp=0;

}
this.weekattendedEmp=totalEmp;



        },
        error  => {
          this.spinner.hide();

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
        public OnClose(){

          $('#map_modal').modal('hide');
          this.mapCloseBtn.nativeElement.click();

        }
        onMouseOver(infoWindow, $event: MouseEvent) {
          infoWindow.open();
      }

  onMouseOut(infoWindow, $event: MouseEvent) {
          infoWindow.close();
      }
        public  GetAllTimesheetByOrgID(fromDate,toDate) {
         this.showTimeLogSpinner=true;
         this.markers=[]
         let projTime=[]
          let postData={
            "fromDate": moment(fromDate).format('L'),
            "toDate": moment(toDate).format('L')
          }
          this.timesheetService.GetAllTimesheetByOrgID(postData).subscribe(
            (data:any)  => {
          this.spinner.hide();


    if(data ){
      this.showTimeLogSpinner=false;
 projTime=data;
      this.allTimeLog=data;
      data.forEach(element => {
        if(element.timesheetSearchLocationViewModel!=null){

          let data={
            lat:element.timesheetSearchLocationViewModel.lat,
            lng:element.timesheetSearchLocationViewModel.lang,
            label:'D',
            draggable:false,
            jobName:element.timesheetProjectCategoryDataModel.project_or_comp_name,
            checkin:element.timesheetDataModels[0].check_in,
            checkout:element.timesheetDataModels[0].check_out,
            empname:element.timesheetDataModels[0].emp_name,
          }
          this.markers.push(data)
        }else{
          let data={
            lat:element.timesheetCurrentLocationViewModels.lat,
            lng:element.timesheetCurrentLocationViewModels.lang,
            label:'E',
            draggable:false
          }
          this.markers.push(data)
        }
      });

      const map = projTime.map((x, index) => {

        if(x.timesheetProjectCategoryDataModel.project_type=='Job'){
          let postData={
            GroupID: x.timesheetProjectCategoryDataModel.groupid,
            ProjectID: x.timesheetProjectCategoryDataModel.project_or_comp_id,
            Date: x.timesheetDataModels[0].ondate

          }

          this.timesheetService.GetTimesheetActivityByGroupAndProjectID(postData).subscribe(
            (data12:any)  => {
              if(data12.length!=0){
                x['proj']=data12
                // projTime.splice(i, 0, data12)
                //  data[i].push('proj',data12)
              }else{
                x['proj']=[]

              }




            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                (result)=> {

                })


            }

            )
        }
        return x ;
      });
      // for(var i=0;i<projTime.length;i++){
      //   if(projTime[i].timesheetProjectCategoryDataModel.project_type=='Job'){
      //     let postData={
      //       GroupID: projTime[i].timesheetProjectCategoryDataModel.groupid,
      //       ProjectID: projTime[i].timesheetProjectCategoryDataModel.project_or_comp_id,
      //       Date: projTime[i].timesheetDataModels[0].ondate

      //     }

      //     this.timesheetService.GetTimesheetActivityByGroupAndProjectID(postData).subscribe(
      //       (data12:any)  => {
      //         if(data12.length!=0){
      //           projTime[i]['proj']=data12
      //           // projTime.splice(i, 0, data12)
      //           //  data[i].push('proj',data12)
      //         }else{
      //           projTime[i]['proj']=[]

      //         }




      //       },
      //       error  => {
      //         Swal.fire(
      //           'Error!',
      //           error,
      //           'error'
      //         ).then(
      //           (result)=> {
      //
      //           })
      //

      //       }

      //       )
      //   }
      // }




    }


            },
            error  => {
              this.spinner.hide();

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
            public markerDragEnd(m,e){

            }
            public  TotalEmpOverTimeCountByOrgIDAndDate(fromDate,toDate) {
             //this.spinner.show();
             this.showOvtCountSpinner=true;
               let postData={
                 "fromDate": moment(toDate).format('L'),
                 "toDate": moment(fromDate).format('L')
               }
               this.timesheetService.TotalEmpOverTimeCountByOrgIDAndDate(postData).subscribe(
                 (data:any)  => {
               //this.spinner.hide();


         if(data ){
           this.totalOverTimeCount=data.length;
           this.showOvtCountSpinner=false;


         }


                 },
                 error  => {
                  this.spinner.hide();

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

                 public  TotalLocationCheckInExceptionByOrgIDAndDate(fromDate,toDate) {
                  //this.spinner.show();
                  this.showExcpCountSpinner=true;
                  let dashboardCheckInExceptionData=0;
                  let dashboardCheckOutExceptionData=0;
                  let dashboardLessHoursData=0;

                    let postData={
                      "fromDate": moment(toDate).format('L'),
                      "toDate": moment(fromDate).format('L')
                    }
                    this.timesheetService.TotalLocationCheckInExceptionByOrgIDAndDate(postData).subscribe(
                      (data:any)  => {


              if(data ){

              //  let dataObj = JSON.parse(data['token']);

            dashboardCheckInExceptionData=data.length;
          //   this.initialSort = {
          //     columns: [{ field: 'dep_name', direction: 'Ascending' },
          //     { field: 'alias', direction: 'Descending' }]
          // };

              }


                      },
                      error  => {
                        this.spinner.hide();
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

                      this.timesheetService.TotalLocationCheckOutExceptionByOrgIDAndDate(postData).subscribe(
                        (data:any)  => {


                if(data ){

                  // this.spinner.hide();
                //  let dataObj = JSON.parse(data['token']);
              dashboardCheckOutExceptionData=data.length;
            //   this.initialSort = {
            //     columns: [{ field: 'dep_name', direction: 'Ascending' },
            //     { field: 'alias', direction: 'Descending' }]
            // };

                }


                        },
                        error  => {
                        this.spinner.hide();

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

                        this.timesheetService.TotalEmpLessHoursByOrgIDAndDate(postData).subscribe(
                          (data:any)  => {


                  if(data ){

                    this.spinner.hide();
                  //  let dataObj = JSON.parse(data['token']);
              this.showExcpCountSpinner=false;

               dashboardLessHoursData=data.length
               this.exceptionCount=dashboardCheckInExceptionData+dashboardCheckOutExceptionData+dashboardLessHoursData


              //   this.initialSort = {
              //     columns: [{ field: 'dep_name', direction: 'Ascending' },
              //     { field: 'alias', direction: 'Descending' }]
              // };

                  }


                          },
                          error  => {
                        this.spinner.hide();

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


        public nextday(){
         let fromDate=moment(JSON.parse(localStorage.getItem('fromDate'))).add(1, 'day').toDate();
         this.dateText=moment(fromDate).format('ddd, D MMM YYYY');
         this.TotalEmployeeDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
         this.TotalEmployeeAbsentDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))

          this.GetTimesheetDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
          this.GetAllTimesheetByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
          this.TotalEmpOverTimeCountByOrgIDAndDate(moment(fromDate).format('L'),moment(fromDate).format('L'));
    this.TotalLocationCheckInExceptionByOrgIDAndDate(moment(fromDate).format('L'),moment(fromDate).format('L'));
         localStorage.setItem('fromDate',JSON.stringify(fromDate));
         localStorage.setItem('toDate',JSON.stringify(fromDate));

        }
        public prevday(){
          let fromDate=moment(JSON.parse(localStorage.getItem('fromDate'))).subtract(1, 'day').toDate();
          this.dateText=moment(fromDate).format('ddd, D MMM YYYY');
          this.TotalEmployeeDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
          this.TotalEmployeeAbsentDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
          this.GetAllTimesheetByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))

           this.GetTimesheetDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
           this.TotalEmpOverTimeCountByOrgIDAndDate(moment(fromDate).format('L'),moment(fromDate).format('L'));
           this.TotalLocationCheckInExceptionByOrgIDAndDate(moment(fromDate).format('L'),moment(fromDate).format('L'));
           localStorage.setItem('fromDate',JSON.stringify(fromDate));
         localStorage.setItem('toDate',JSON.stringify(fromDate));


         }
       public getTodaysData(){
        this.spinner.show();

         this.TotalEmployeeDashboardDataByOrgID(this.today,this.today)
this.TotalEmployeeAbsentDashboardDataByOrgID(this.today,this.today)
this.dateText=moment(this.today).format('ddd, D MMM YYYY');
         this.GetTimesheetDashboardDataByOrgID(this.today,this.today)
    this.GetAllTimesheetByOrgID(this.today,this.today);
    this.TotalEmpOverTimeCountByOrgIDAndDate(this.today,this.today);
    this.TotalLocationCheckInExceptionByOrgIDAndDate(this.today,this.today);


       this.showtodaysData=true
       this.showweeksData=false;
       this.isTodayActive=true;
       this.isWeekActive=false;
       this.isMonthActive=false;
    this.isRangeActive=false;

localStorage.setItem('fromDate',JSON.stringify(this.today));
localStorage.setItem('toDate',JSON.stringify(this.today));

        }
        public getWeeksData(){
          this.spinner.show();
         this.TotalEmployeeDashboardDataByOrgID(this.weekEnd,this.weekStart)
         this.TotalEmployeeAbsentDashboardDataByOrgID(this.weekEnd,this.weekStart)

          this.GetTimesheetDashboardDataByOrgID(this.weekEnd,this.weekStart)
          this.GetAllTimesheetByOrgID(this.weekEnd,this.weekStart);
          this.TotalEmpOverTimeCountByOrgIDAndDate(this.weekEnd,this.weekStart);
this.TotalLocationCheckInExceptionByOrgIDAndDate(this.weekEnd,this.weekStart);

localStorage.setItem('fromDate',JSON.stringify(this.weekEnd));
localStorage.setItem('toDate',JSON.stringify(this.weekStart));
this.dateText=moment(this.weekEnd).format('ddd, D MMM YYYY')+' - '+moment(this.weekStart).format('ddd, D MMM YYYY');
this.isTodayActive=false;
this.isWeekActive=true;
this.isMonthActive=false;
this.isRangeActive=false;

          this.showweeksData=true;
       this.showtodaysData=false;
// this.dateValue=this.weekEnd;
          // this.weekabsentMem=0


         }
         public getMonthsData(){
          this.spinner.show();
          this.GetTimesheetDashboardDataByOrgID(this.monthStart,this.monthEnd)
          this.GetAllTimesheetByOrgID(this.monthStart,this.monthEnd);
          this.TotalEmployeeDashboardDataByOrgID(this.monthStart,this.monthEnd)
          this.TotalEmployeeAbsentDashboardDataByOrgID(this.monthStart,this.monthEnd)
          this.TotalEmpOverTimeCountByOrgIDAndDate(this.monthStart,this.monthEnd);
          this.TotalLocationCheckInExceptionByOrgIDAndDate(this.monthStart,this.monthEnd);

          this.showweeksData=true;
          this.showtodaysData=false;
          this.isTodayActive=false;
          this.isWeekActive=false;
          this.isMonthActive=true;
    this.isRangeActive=false;

          // this.weekabsentMem=0;

localStorage.setItem('fromDate',JSON.stringify(this.monthStart));
localStorage.setItem('toDate',JSON.stringify(this.monthEnd));
this.dateText=moment(this.monthStart).format('ddd, D MMM YYYY')+' - '+moment(this.monthEnd).format('ddd, D MMM YYYY');




         }
         public openStatusModal(item){

          this.taskStatus=item.status_id;

          $('#task_status_modal').modal('show');
          this.tasktobeUpdated=item;
          this.getAllStatus();

        }
        public changedStatus(e: any): void {
          this.taskStatus= e.value;

        }
        public onTaskStatusSubmit(){

          this.spinner.show();
          let postData={
            id: this.tasktobeUpdated.id,

            status_id: this.taskStatus,


          }

          this.taskService.UpdateTaskStatus(postData).subscribe(

            (data:any) => {

          if(data){
          this.spinner.hide();

            // this.toastr.success(data.desc);
            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
          });
            this.GetAllTaskByEmpID();
            $('#task_status_modal').modal('hide');
      this.statusCloseBtn.nativeElement.click();


          }


            },
            error  => {
          this.spinner.hide();

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
        public  getAllStatus(){
          this.taskService.GetStatusByOrgID().subscribe(

            (data:any) => {

          var results=[{ id: '', text: 'Select an option' }]
              // let dataObj = JSON.parse(data['token']);
            //

        for (var i = 0; i < data.length; i++) {
        // logik to create new items
        // if(data[i].status_name!=item.status){
          results.push({
            "id": data[i].id,
            "text": data[i].status_name
        });
    //     }else{

    // //
    //     }


        }


        this.taskStatusData =results;
            // this.router.navigate(["/organizations"]);

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
            public AllActivities(){
              // this.router.navigate(['/activities']);
              // this.router.navigate(['/activities-dashboard']);
              this.router.navigate(['/activities-admin']);


     }
     public goBack(){
      window.history.go(-1);
    }
         public  GetProjByOrgID(){
          this.projectService.FetchAllProjectByOrgID().subscribe(

            (data:any) => {
              // if(data['result'].status!=201){
 if(data.length!=0 ){
  this.projData=data;

}
// }


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
         public toProjList(){
               this.router.navigate(['/projects']);
            }
            public toProjectLayout(id){
              localStorage.setItem('project_id',id);
              this.router.navigate(['/project-layout']);

            }

            public getTimesheetByEmpId(){
              this.showTimeLogSpinner=true;
             let  user_info= JSON.parse(localStorage.getItem('user_info'));

                let empId={
                 ID:user_info['id']
                }
                 this.userService.GetAllTimesheetByEmpID(empId).subscribe(
                   (data:any)  => {
                     // let dataObj = JSON.parse(data['token']);
                   // this.orgListArr=data


                   if(data.length==0){
                    localStorage.setItem('is_checkout',JSON.stringify(true))

                   }
                   if(data){
                    //  this.teamEmpId=[]
                     this.showTimeLogSpinner=false;


                    this.allTimeLog=data;






                   }

                //this.OrgList(data['employee'].id);

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
                 ;


              }

            public GetAllTaskByEmpID(){
              this.taskService.GetAllTaskByOrgAndEmpID().subscribe(
                (data:any)  => {
                  let completedTasks=[]
                  let openTasks=[]
                  let inProgrssTasks=[]

                  var results=[{ id: '', text: 'Select' }]
                    // let dataObj = JSON.parse(data['token']);
                  //
                  if(data){
                    for (var i = 0; i < data.employeeTasks.length; i++) {
                      // logik to create new items
                      results.push({

                        "id": data.employeeTasks[i].id,
                        "text": data.employeeTasks[i].task_name
                    });
                      if(data.employeeTasks[i].status=="Completed"){
                        completedTasks.push(data.employeeTasks[i]);
                      }
                      else if(data.employeeTasks[i].status=="Open"){
                        openTasks.push(data.employeeTasks[i]);
                      }else{
                        inProgrssTasks.push(data.employeeTasks[i]);
                       }

                  }

                  this.taskCompletedList=completedTasks;
                  this.taskOpenList=openTasks;
                  this.taskInProgressList=inProgrssTasks;
                 this.tasksList=results;
                 this.employeeTasksList=data['employeeTasks'];
                 this.assignedToList=data['assignedEmployeeTasks'];
                 this.overDueList=data['overDueTasks'];
                }




                 var results=[{ id: '', text: 'Select' }]
               if(data){
                for (var i = 0; i < data.length; i++) {
                  // logik to create new items

                  results.push({
                     "id": data[i].id,
                     "text": data[i].task_name
                  });

                  }
               }

            this.tasks=results;

                }
                )
            }
            public taskDelete(deptId){
              let postData={
                ID:deptId
              }
              this.taskService.delTask(postData).subscribe(
                (data:any)  => {

                  if(data.status==200){
                    this.GetAllTaskByEmpID();

                              this.toastr.error(data['desc'], undefined,{
                                positionClass: 'toast-top-center'
                           });

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

                    })

                }

                )
              }

              public openViewModal(element){

                //this.FetchGridDataByDepartmentOrgID();
                if(element.timesheetProjectCategoryDataModel!=null){
                  this.viewProjType=element.timesheetProjectCategoryDataModel.project_type;
                  this.viewProjName=element.timesheetProjectCategoryDataModel.project_or_comp_name;


                  this.GetTimesheetActivityByGroupAndProjectID(element);

                }
                if(element.timesheetDataModels!=null){
                  this.viewProjCheckin=element.timesheetDataModels[0].check_in;
                  this.viewProjCheckout=element.timesheetDataModels[0].check_out;



                }

                $('#activity_view_modal').modal('show');

              }
              public closeViewModal(){
                $('#activity_view_modal').modal('hide');

              }
              public  GetProjTimesheetActivityByGroupAndProjectID(element){

                let data12 = [];

                let postData={
                  GroupID: element.timesheetProjectCategoryDataModel.groupid,
                  ProjectID: element.timesheetProjectCategoryDataModel.project_or_comp_id,
                  Date: element.timesheetDataModels[0].ondate

                }

                this.timesheetService.GetTimesheetActivityByGroupAndProjectID(postData).subscribe(
                  (data:any)  => {



                   data12=data


                  },
                  error  => {
                    Swal.fire(
                      'Error!',
                      error,
                      'error'
                    ).then(
                      (result)=> {

                      })


                  }

                  )


                  }
              public  GetTimesheetActivityByGroupAndProjectID(element) {

                let postData={
                  GroupID: element.timesheetProjectCategoryDataModel.groupid,
                  ProjectID: element.timesheetProjectCategoryDataModel.project_or_comp_id,
                  Date: element.timesheetDataModels[0].ondate

                }
                this.timesheetService.GetTimesheetActivityByGroupAndProjectID(postData).subscribe(
                  (data:any)  => {


                   let datas = new DataManager(data);
                   this.data12=datas.dataSource['json']
                 // this.groupOptions = { showGroupedColumn: false,showDropArea: false,  columns: ['timesheet'] };
                // this.pageSettings = {pageSizes: true, pageCount: 5 }
                // this.toolbar = ['Search'];
              //  this.searchOptions = { fields: ['dep_name'], operator: 'contains', key: 'Ha', ignoreCase: true };
                  //  this.dataSource =  new MatTableDataSource(data);
                  //  this.compData = data;
                  //  this.gridComp.dataSource = data;
                  //  this.gridComp.allowPaging = false;
                  //  this.gridComp.pageSettings = { pageSize: this.compData.length };
                  //  this.gridComp.columns = this.displayedColumns;
                   // this.dataSource.paginator = this.paginator;
                  //  this.dataSource.sort = this.sort;

                  // this.router.navigate(["/organizations"]);

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
                  public MapModal(){
                    $('#map_modal').modal("show");
                  }
                  public  getLeaveSetup(){
                    this.spinner.show();
                    this.showLeaveLogSpinner=true;
                    this.leaveService.FetchEmployeeLeaveHistoryApproverID().subscribe(

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
                console.log(this.pendingLeaves)
                this.appovedLeaves=approved;
                this.declinedLeaves=declined;




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

                      public requestType(id, type){
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

  public declineLeave(){
    this.declineformSubmitted=true;
    this.commentsValue=true;
  }
  declineNotification(){
    this.declineformSubmitted=true;
    this.commentsValue=true;
    let  user_info= JSON.parse(localStorage.getItem('user_info'));

    let postData={
      timesheetID:this.approverId,
      approverID:user_info['id']
    }
    this.leaveService.DeclineByTimesheetIDAndApproverID(postData).subscribe(

      (data:any) => {

if(data.status=200){
  this.toastr.success(data['desc'], undefined,{
    positionClass: 'toast-top-center'
});
$("#notification_modal").modal('hide');

this.getLeaveSetup();

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
  commentsEntry(e){
    if(e.value!=''){
    this.commentsValue=false;

    }else{
    this.commentsValue=true;
    }
  }

  approveRange(e){
    this.approvalSpan=e.daySpan;
  }

  OnNotifyClose(){
    $("#notification_modal").modal("hide");
this.notifyCloseBtn.nativeElement.click();
  }
  approvalDetails(id,name,showApproveBtn){
    $("#notification_modal").modal("show");
console.log('approvalDetails',id)
if(showApproveBtn=='showApproveBtn'){
  this.showApproveBtn=true;
}else{
  this.showApproveBtn=false;

}
     this.approverId=id;
    let postData={
      id:id
    }
    // this.leaveForm.reset();
   this.spinner.show();
    this.timesheetService.GetApproveTimesheetByID(postData).subscribe(

      (data:any) => {
if(data.length!=0){
  this.spinner.hide();

this.approveEndTime=data.check_out;
this.approveStartTime=data.check_in;
this.appliedBy=data.onbehalf_empid;
 this.reason_desc=data.reason_desc;
 this.reason_id=data.reason_id;
this.appliedOn=data.ondate;
this.appliedFor=name;
this.total_hrs=data.total_hrs;
this.approver1_empid=data.approver1_empid;
this.approver2_empid=data.approver2_empid;

this.checkinType=data.timesheetCategoryViewModel.project_category_type;
this.checkinPlace=data.timesheetCategoryViewModel.project_or_comp_name;
// this.findJoiningDate(data[0].emp_id);
// this.fetchEmpLeave(data[0].emp_id);
// this.findEmpLeaveHistory(data[0].emp_id);
// this.findEmpLeaveLog(data[0].emp_id);
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
    this.getAllNotificationForOrg();
    this.GetProjByOrgID();
    this.GetAllTaskByEmpID();
    this.getUsersInfo();
    this.getAllStatus();
    this.getLeaveSetup();

    this.GetAccessRightsbyRole();

    //this.getTimesheetByEmpId();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.show();

    }, 1000);
    this.leaveForm = new FormGroup({
      desc:new FormControl(''),
      leaveType:new FormControl(''),
      approvalrange:new FormControl('', [Validators.required]),
    });
  if(localStorage.getItem('fromDate')){
    if((JSON.parse(localStorage.getItem('fromDate')) && JSON.parse(localStorage.getItem('toDate')) ==this.today)){
this.dateText=moment(JSON.parse(localStorage.getItem('fromDate'))).format('ddd, D MMM YYYY');

    }else if(localStorage.getItem('fromDate')!=localStorage.getItem('toDate')){
this.dateText=moment(JSON.parse(localStorage.getItem('fromDate'))).format('ddd, D MMM YYYY')+' - '+moment(JSON.parse(localStorage.getItem('toDate'))).format('ddd, D MMM YYYY');

    }else{

    }



  }


    this.dateRangeForm = new FormGroup({
      daterange: new FormControl(''),




   });
   this.approverForm= new FormGroup({
    desc: new FormControl(''),

 });
   this.datePickerForm = new FormGroup({
    date: new FormControl(''),




 });
 this.datePickerForm.get('date').valueChanges.subscribe(() => {
  // fires when the input value has actually changed
 let dateValue=this.datePickerForm.get('date').value
 this.dateText=moment(this.datePickerForm.get('date').value).format('ddd, D MMM YYYY');


this.spinner.show();
    localStorage.setItem('fromDate',JSON.stringify(dateValue))
    localStorage.setItem('toDate',JSON.stringify(dateValue));// this.GetTimesheetActivityByEmpIDAndDate(this.fromDateValue,this.toDateValue);

    this.TotalEmployeeDashboardDataByOrgID(dateValue,dateValue)
    this.TotalEmployeeAbsentDashboardDataByOrgID(dateValue,dateValue)
    //
    this.GetTimesheetDashboardDataByOrgID(dateValue,dateValue)
    this.GetAllTimesheetByOrgID(dateValue,dateValue);
    this.TotalEmpOverTimeCountByOrgIDAndDate(dateValue,dateValue);
    this.TotalLocationCheckInExceptionByOrgIDAndDate(dateValue,dateValue);
    this.showweeksData=true;
    this.showtodaysData=false;
});
//    var today = new Date();
// // var startDay = 6;
// // var weekStart = new Date(today.getDate() - (7 + today.getDay() - startDay) % 7);
// // var weekEnd = new Date(today.getDate() + (7 - today.getDay() - startDay) % 7);
//
   this.dateRangeForm.get('daterange').valueChanges.subscribe(() => {
    // fires when the input value has actually changed

    let startTime=this.dateRangeForm.get('daterange').value;
    this.fromDateValue=moment(startTime[0]).format('L');
    this.toDateValue=moment(startTime[1]).format('L');
    this.spinner.show();
    localStorage.setItem('fromDate',JSON.stringify(startTime[0]))
    localStorage.setItem('toDate',JSON.stringify(startTime[1]));// this.GetTimesheetActivityByEmpIDAndDate(this.fromDateValue,this.toDateValue);

    this.TotalEmployeeDashboardDataByOrgID(this.fromDateValue,this.toDateValue)
    this.TotalEmployeeAbsentDashboardDataByOrgID(this.fromDateValue,this.toDateValue)
    //
    this.GetTimesheetDashboardDataByOrgID(this.fromDateValue,this.toDateValue)
    this.GetAllTimesheetByOrgID(this.fromDateValue,this.toDateValue);
    this.TotalEmpOverTimeCountByOrgIDAndDate(this.fromDateValue,this.toDateValue);
    this.TotalLocationCheckInExceptionByOrgIDAndDate(this.fromDateValue,this.toDateValue);
    this.showweeksData=true;
    this.showtodaysData=false;

    this.dateText=moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');



});



        if(JSON.parse(localStorage.getItem('fromDate'))!=''){
          this.isTodayActive=true;

        }
      //  this.isWeekActive=false;
      //  this.isMonthActive=false;

      if((JSON.parse(localStorage.getItem('fromDate')) && JSON.parse(localStorage.getItem('toDate')) ==this.today)){
        this.spinner.show();

    this.getTodaysData();
      }else if(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')==moment(this.monthStart).format('L')){
        this.spinner.show();

       this.getMonthsData()
      }else if(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')==moment(this.weekEnd).format('L')){
        this.spinner.show();

        this.getWeeksData()

      }
      else if(JSON.parse(localStorage.getItem('fromDate'))!=JSON.parse(localStorage.getItem('toDate'))){
        this.spinner.show();

        this.showweeksData=true;
    this.showtodaysData=false;
    this.isTodayActive=false;
    this.isWeekActive=false;
    this.isMonthActive=false;
    // this.isRangeActive=true;
     this.TotalEmployeeDashboardDataByOrgID(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L'),moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))
    this.TotalEmployeeAbsentDashboardDataByOrgID(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L'),moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))
    this.GetTimesheetDashboardDataByOrgID(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L'),moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))
    this.GetAllTimesheetByOrgID(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L'),moment(JSON.parse(localStorage.getItem('toDate'))).format('L'));
    this.TotalEmpOverTimeCountByOrgIDAndDate(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L'),moment(JSON.parse(localStorage.getItem('toDate'))).format('L'));
    this.TotalLocationCheckInExceptionByOrgIDAndDate(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L'),moment(JSON.parse(localStorage.getItem('toDate'))).format('L'));


      } else {
        this.spinner.show();

        this.TotalEmployeeDashboardDataByOrgID(this.today,this.today)
this.TotalEmployeeAbsentDashboardDataByOrgID(this.today,this.today)
         this.GetTimesheetDashboardDataByOrgID(this.today,this.today)
    this.GetAllTimesheetByOrgID(this.today,this.today);
    this.TotalEmpOverTimeCountByOrgIDAndDate(this.today,this.today);
    this.TotalLocationCheckInExceptionByOrgIDAndDate(this.today,this.today);

         localStorage.setItem('fromDate',JSON.stringify(this.today));
         localStorage.setItem('toDate',JSON.stringify(this.today));
         this.showtodaysData=true
        this.showweeksData=false;
      }

    $.getScript('assets/js/pages/dashboard.js')
    $.getScript('assets/plugins/custom/fullcalendar/fullcalendar.bundle.js')
    $.getScript('assets/js/pages/crud/forms/widgets/bootstrap-datepicker.js')




  }

  GetAccessRightsbyRole(){
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let postData = {
      id : user_info.role_id
    }
    if(user_info.is_superadmin){
      this.viewDashboard = true;
    }else{
      this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
        data.map((item) => {
          item.module_name = item.module_name.replace(/\s+/g, '');;
          return item;
        });
        this.commonModuleName = _.groupBy(data, 'module_name')
        console.log('Justin', this.commonModuleName)
        if(this.commonModuleName.Dashboard){
          this.commonModuleName.Dashboard.map((elm) => {
            if(elm.section_name === 'View Dashboard' && elm.is_allow === true){
              this.viewDashboard = true;
            }else{
              this.viewDashboard = false;
            }
          });
          console.log('Justin2', this.viewDashboard)
        }else{
          this.viewDashboard = false;
        }
      });
    }
  }



}
