import { Component, OnInit, ViewEncapsulation, NgZone, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { TimeSheetService } from '../../services/timesheet.service';
import { DataManager } from '@syncfusion/ej2-data';
import moment = require('moment');
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';

import { GoogleMap } from '@agm/core/services/google-maps-types';
import { ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import { ClickEventArgs } from '@syncfusion/ej2-navigations'

import PlaceResult = google.maps.places.PlaceResult;
import { GridComponent, PagerComponent, SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from '../../services/employee.service';
import { OrganizationService } from '../../services/organization.service';
import { ToastrService } from 'ngx-toastr';
import { LeaveService } from '../../services/leave.service';
import { ProjectService } from '../../services/project.service';
declare var $: any;
// import * as $ from 'jquery';
@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardDetailsComponent implements OnInit {
  selectedGroupVal: any;
  dashboardData: Object[];
  public dateValue: Date = new Date();
public minDate: Date = new Date('1/15/2017');
public maxDate: Date = new Date('12/20/2017');
public today: Date = new Date(new Date().toDateString());
public maxRangeDate: Date = this.today;
public initialPage: PageSettingsModel;
public newFormatedAddress = '';
public homeInput=false;
@ViewChild("pager",{static:true}) pager: PagerComponent;
@ViewChild('checkoutgrid',{static:true}) public checkoutgrid: GridComponent;
@ViewChild('lessHrsgrid',{static:true}) public lessHrsgrid: GridComponent;
@ViewChild('mapCloseBtn',{static:false}) mapCloseBtn: ElementRef;
@ViewChild('modifyCloseBtn',{static:false}) modifyCloseBtn: ElementRef;
@ViewChild('actCloseBtn',{static:false}) actCloseBtn: ElementRef;
@ViewChild('approveCloseBtn',{static:false}) approveCloseBtn: ElementRef;

@ViewChild('wfhinput',{ read: ElementRef , static: false })
wfhRef: ElementRef;
  pageSize: any = 10;
  currentPage: any = 1;
attendanceData: any;
  pgData: any=[];
  isTodayActive;
  isWeekActive;
  isMonthActive;
  isRangeActive;
  minStartTime='08:00 AM';
  maxCurrentTime='08:00 PM';

    // public weekStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() + 7) % 7)).toDateString());
    // public weekEnd: Date = new Date(new Date(new Date().setDate(new Date(new Date().setDate((new Date().getDate()
    //     - (new Date().getDay() + 7) % 7))).getDate() + 6)).toDateString())
    //     ;

         public weekEnd =moment().subtract(7,'d').format('YYYY-MM-DD');
          public  weekStart: Date =new Date(new Date().toDateString());
    //  public x=     new Date(new Date().toDateString())
    //  dateFrom =
    public monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
    public monthEnd: Date = this.today;
    public lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
    public lastEnd: Date = this.today;
    public yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
    public yearEnd: Date = this.today;


public toolbar: string[];

public initialSort: Object;
public pageSettings: Object;
dateRangeForm: FormGroup;
dateValues: any;
fromDateValue: string;
toDateValue: string;
  dashboardAbsentData: Object[];
  nearbyAddress="";
  nearbyPlaces: google.maps.places.PlaceResult[];
  changed_address: string;

  public formatted_address;
   public lat;
   public lang;
   public street_number;
  //  public route;
   public locality;
   public administrative_area_level_2;
   public administrative_area_level_1;
   public postal_code;
   public country;

   public changed_formatted_address;
   public changed_lat;
   public changed_lang;
   public changed_street_number;
   public changed_route;
   public changed_locality;
   public changed_administrative_area_level_2;
   public changed_administrative_area_level_1;
   public changed_postal_code;
   public changed_country;
   public changedLocationData;
   public showNearbyPlaces=false;
   geoCodeData: any;


   title: string = 'AGM project';
   latitude: number;
   longitude: number;
   zoom: number;
   address: string;
   private geoCoder;
   viewProjType: any;
  viewProjName: any;
  viewProjCheckin: any;
  viewProjCheckout: any;


   @ViewChild('search',{ read: ElementRef , static: false })
    searchElementRef: ElementRef
    @ViewChild(AgmMap, { static: true })
   map;
   defaultCenter = {lat: 55.5815245, lng: 36.8251383};
   currentCenter = Object.assign({}, this.defaultCenter);
   @ViewChild('attendanceGrid',{static:false})
   public grid: GridComponent;
   @ViewChild('absentGrid',{static:false})
   public absentgrid: GridComponent;
   @ViewChild('checkingrid',{static:false})
   public checkingrid: GridComponent;
  route: any;
  geo_address: string;
  searchLocVal: string;
  checkOutLat: any;
  checkOutLang: any;
  selectedCheckInGroupVal: string;
  checkInModel: string;
  projectName: any;
  activityData: Object[];
  groupOptions: { showGroupedColumn: boolean; showDropArea: boolean; columns: string[]; };
  daterangeVal: Date[];
  data12: Object[];
  dashboardOvertimeData: Object[];
  dashboardLessHoursData: Object[];
  dashboardCheckInExceptionData: Object[];
  dashboardCheckOutExceptionData: Object[];
  attendanceCount=0;
  absentCount=0;
  overTimeCount=0;
  checkinExceptionCount: any;
  checkoutExceptionCount: any;
  lessHrExceptionCount: any;
  firstCheckin: boolean=false;
  lastCheckOut: boolean=false;
  showOvtCountSpinner: boolean;
  lessHrsPgData: any=[];
  checkoutExcpPgData: any=[];
  absentPgData: any=[];
  checkinExcpPgData: any=[];
  overtimePgData: any=[];
  nextDayDisabled: boolean;
  checkinForm: FormGroup;
  startEqualEnd: boolean=false;
  showerrorMsg: boolean;
  modifySubmit: boolean;
  selectedModifiedGroupVal: any='Checkin';
  manageDate: any;
  public deptOptions: Select2Options;
  approverData: { id: any; text: string; }[];
  reasonData=[{
    id: '', text: 'Select'
  },{
    id: '1', text: 'Technical Issues'
  },{
    id: '2', text: 'Subscription Expired'
  },
  ];
  approvalValue: any;
  xpandStatus: boolean;
  selectedValue: any;
  selectedOfficeId: any;
  selectedentitiyLoc: any;
  selecteOptionValue: any;
  checkOptionValue: boolean;
  officeData: any;
  OrgId: string;
  officeInput: boolean;
  currentPoslng: number;
  currentPoslat: number;
  currlatitude: number;
  currlongitude: number;
  isDual: boolean;
  approvalValue1: any='';
  approvalValue2: any='';
  sameApprover: boolean=false;
  manageEmpId: any;
  manageEmpName: any;
  leaveForm: FormGroup;
  leaveSetupData: any;
  showLeavesSpin: boolean;
  showLeaveInfo: boolean;
  empjoinedDate: string;
  empValue: any;
  leaveHistory: Object[];
  leaveCountData: any;
  approvedLeaves: any[];
  annualApprovedLeaves: any[];
  sickApprovedLeaves: any[];
  used_leaves: number=0;
  earnedTimeOff: number=0;
  sickTimeOff: number=0;
  leavesEntitled: number=0;
  availableLeaves: number=0;
  leaveSetupid: any;
  adjustedBalance: number=0;
  earnedLeaves: number;
  casualLeaves: number;
  leaveStatusData: any;
  leaveApprovalValue1: any='';
  leaveApprovalValue2: any='';
  leavApprovalValue: any='';
  sameLeavApprover: boolean=false;
  isLeavDual: boolean=false;
  checkInLeavModel: string;
  reasonValue: any='';
  reasonValueTxt: any='';
  onLeavData: Object[];
  onLeavCount=0;
  public searchOptions: SearchSettingsModel;
  jobInput: boolean=false;
  projectFilterList: { id: string; text: string; additional: { teamBy: string; }; }[];

  constructor(private timesheetService:TimeSheetService, private router: Router,private empService:EmployeeService,private toastr: ToastrService,private projectService:ProjectService,
    private mapsAPILoader: MapsAPILoader,private ngZone: NgZone,private spinner:NgxSpinnerService,private orgService:OrganizationService,private leaveService:LeaveService) {
      this.deptOptions={
        placeholder: { id: '  ', text: 'Select' },  allowClear: true,
        width:'100%'
      }
    }
  matButtonToggleGroup: any;
  groupModel: any;
  locationModel: any;
  public getCurrentPoslatlng(){
    if (navigator)
    {
    console.log('navigatorlng',this.currentPoslng)

    navigator.geolocation.getCurrentPosition( pos => {
      this.currentPoslng = +pos.coords.longitude;
      this.currentPoslat = +pos.coords.latitude;
      });

    }else{
    console.log('elsenavigatorlng',this.currentPoslng)

      this.currentPoslng = undefined;
      this.currentPoslat = undefined;
    }

  }
  public onCheckinValChange(val){
    this.selectedCheckInGroupVal = val;
    if(this.selectedCheckInGroupVal=='Checkin')
    {
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder;

        // this.setCurrentLocation();
        this.getAddress(this.latitude, this.longitude);




    });
    }
    else if(this.selectedCheckInGroupVal=='Checkout')

    {

      // this.map.mapReady.subscribe(map => {
      //   this.geocode("New York, USA").then(place => {
      //     this.currentCenter = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
      //   })
      //   .catch(err => {
      //
      //   });
      // });


      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder;

        // this.setCurrentLocation();
        this.getAddress(this.checkOutLat, this.checkOutLang);




    });
    }

  }

  public changedApprover(e: any): void {
    this.approvalValue= e.value;

  }
  changedReason(e: any): void {
    this.reasonValue= e.value;
    if(e.data[0]!=''){
      this.reasonValueTxt=e.data[0].text
    }
  }
  public changedApprover1(e: any): void {
    this.approvalValue1= e.value;
    this.sameApprover=false;


  }
  public changedApprover2(e: any): void {
    this.approvalValue2= e.value;
    this.sameApprover=false;

  }

  public changedLeavApprover(e: any): void {
    this.leavApprovalValue= e.value;


  }
  public changedLeavApprover1(e: any): void {
    this.leaveApprovalValue1= e.value;
    this.sameLeavApprover=false;


  }
  public changedLeavApprover2(e: any): void {
    this.leaveApprovalValue2= e.value;
    this.sameLeavApprover=false;

  }

  public FindAllOrgByHeadOrgID(){
    this.orgService.FindAllOrgByHeadOrgID().subscribe(

      (orgData:any) => {

        // let dataObj = JSON.parse(data['token']);
      //
      if(orgData){
        for (var i = 0; i <orgData.length; i++) {
          // logik to create new items
          if(orgData[i].org_id==localStorage.getItem('org_id')){
            this.selecteOptionValue=orgData[i].org_name;
            // this.selectedValue=orgData[i].org_name;
             this.selectedOfficeId=orgData[i].org_id;

            this.selectedentitiyLoc=orgData[i].entityLocation;
            this.checkOptionValue=true;
            this.selectedOption(orgData[i])

          }


          }

        this.officeData=orgData;

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
  public selectedOption(e): void {


    this.xpandStatus=false;
    this.selectedValue=e.org_name;
    this.selectedOfficeId=e.org_id;
    this.selectedentitiyLoc=e.entityLocation;




    }
  public  getEmployeeByOrgId(empId){
    let user_info:object;
if(localStorage.getItem('user_info')){
  user_info= JSON.parse(localStorage.getItem('user_info'));

}
console.log('getEmployeeempId',empId);
    this.empService.getEmployeeByOrgId().subscribe(
      (data:any) => {
        var results=[{ id: '', text: 'Select' }]
  for (var i = 0; i < data.length; i++) {
  if(data[i].id!=empId && data[i].is_admin==true ){
  results.push({
      "id": data[i].id,
      "text": data[i].first_name
  });
  }
}

  this.approverData =results;

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
  onModifyValChange(val){
    this.selectedModifiedGroupVal = val;
    this.resetCheckin();

  }
  public onValChange(val){
    this.selectedGroupVal = val;

  }
  modification(date,emp_id,emp_name){
console.log('date',date)
this.manageDate=date;
this.manageEmpId=emp_id;
this.manageEmpName=emp_name;
this.FetchTimeOffSetupOrgID();
this.FetchReasonsOrgID();
this.getEmployeeByOrgId(emp_id);
this.FindAllOrgByHeadOrgID();
this.setCurrentLocation();
this.getLeaveSetup();

let postData={
  "id": emp_id
      }
this.findJoiningDate(postData);
this.selectedModifiedGroupVal="Checkin";

    $('#modification_modal').modal('show');
    this.homeInput=false;
    this.officeInput=false;
    this.startEqualEnd=false;
    this.FetchLeaveStatusOrgID();
  }
  public checkIsDual(e:any){

    if(e.srcElement.checked) {
      this.isDual=true;
    }else{
      this.isDual=false;
      this.approvalValue1='';
      this.approvalValue2='';
    }

  }
  public checkLeavIsDual(e:any){

    if(e.srcElement.checked) {
      this.isLeavDual=true;
    }else{
      this.isLeavDual=false;
      this.leaveApprovalValue1='';
      this.leaveApprovalValue2='';
    }

  }
  OnModifyClose(){
    $('#modification_modal').modal('hide');
    this.modifyCloseBtn.nativeElement.click();
    this.resetCheckin();

  }
  toolbarClick(args: ClickEventArgs): void {
    switch (args.item.text) {
        case 'PDF Export':
            this.grid.pdfExport();
            break;
        case 'Excel Export':
            this.grid.excelExport();
            break;
        case 'CSV Export':
            this.grid.csvExport();
            break;
    }
  }
  toolbarAbsentClick(args: ClickEventArgs): void {
    switch (args.item.text) {
        case 'PDF Export':
            this.absentgrid.pdfExport();
            break;
        case 'Excel Export':
            this.absentgrid.excelExport();
            break;
        case 'CSV Export':
            this.absentgrid.csvExport();
            break;
    }
  }
  toolbarCheckinExpClick(args: ClickEventArgs): void {
    switch (args.item.text) {
        case 'PDF Export':
            this.checkingrid.pdfExport();
            break;
        case 'Excel Export':
            this.checkingrid.excelExport();
            break;
        case 'CSV Export':
            this.checkingrid.csvExport();
            break;
    }
  }
  toolbarCheckoutExpClick(args: ClickEventArgs): void {
    switch (args.item.text) {
        case 'PDF Export':
            this.checkoutgrid.pdfExport();
            break;
        case 'Excel Export':
            this.checkoutgrid.excelExport();
            break;
        case 'CSV Export':
            this.checkoutgrid.csvExport();
            break;
    }
  }
  public OnClose(){
    this.newFormatedAddress = '';
    this.selectedCheckInGroupVal="CheckIn";
    this.checkInModel="Checkin";
    $('#map_modal').modal('hide');
    this.mapCloseBtn.nativeElement.click();

  }
  public toDashboard(){
             this.router.navigate(['/dashboard']);

  }
  geocode(address: string): Promise<any> {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        {
          address: address
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            resolve(results[0]);
          } else {
            reject(new Error(status));
          }
        }
      );
    });
  }
  public  GetAllTimesheets() {
    this.timesheetService.GetAllTimesheets().subscribe(
      (data:any)  => {


        //  let dataObj = JSON.parse(data['token']);

      let datas = new DataManager(data);
      this.dashboardData=datas.dataSource['json']
    //   this.initialSort = {
    //     columns: [{ field: 'dep_name', direction: 'Ascending' },
    //     { field: 'alias', direction: 'Descending' }]
    // };
    this.pageSettings = {pageSizes: true, pageCount: 5 }
     this.toolbar = ['Search',];

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

  //get User Attendance
  public GetTimesheetDashboardGridDataByOrgIDAndDate() {
    this.spinner.show();
    let fromDate=JSON.parse(localStorage.getItem('fromDate'))
    let toDate=JSON.parse(localStorage.getItem('toDate'))
    let postData={
      "fromDate": moment(fromDate).format('L'),
      "toDate": moment(toDate).format('L')
    }
    this.timesheetService.GetTimesheetDashboardGridDataByOrgIDAndDate(postData).subscribe((data:any) => {
      //console.log('first', data)
      if(data){
        // for(let i=0; i< data.length; i++){
        //   if(i == data.length - 1){break;}
        //   if(data[i].timesheet_id === data[i + 1].timesheet_id && data[i].check_in  === data[i + 1].check_in){
        //     data.splice(i, 1);
        //   }
        // }

        data.map((elem,i)=>{
          let checkIfExist = data.filter(itm => itm.timesheet_id === elem.timesheet_id )
          if(checkIfExist.length == 2) {
            if(checkIfExist[0].reasons_name === null || checkIfExist[0].lat === null)  {
              if(checkIfExist[0].is_app_check_In = "True") {
                checkIfExist[1].is_app_check_In = "True";
              }
              data.splice(i, 1);
            }  
          }
        });

        //console.log('second', data)
        this.spinner.hide();
        let datas = new DataManager(data);
        this.dashboardData=datas.dataSource['json']
        this.attendanceCount=data.length;
        this.pageSettings = {pageSizes: true, pageCount: 5 }
        this.toolbar = ['Search','ExcelExport', 'PdfExport', ];
        this.pgData=data;
        let ds= data.slice(0, this.pageSize);
        let ds1 = new DataManager(ds);
        this.attendanceData=ds1.dataSource['json'];
      }
    },error  => {
      Swal.fire(
      'Error!',
      error,
      'error'
      ).then((result)=> {})
    });
  }
          public  GetTimesheetDashboardGridOnLeaveDataByOrgIDAndDate() {
            this.spinner.show();

            let fromDate=JSON.parse(localStorage.getItem('fromDate'))
                let toDate=JSON.parse(localStorage.getItem('toDate'))
                let postData={
                  "fromDate": moment(fromDate).format('L'),
                  "toDate": moment(toDate).format('L')
                }

            this.timesheetService.GetTimesheetDashboardGridOnLeaveDataByOrgIDAndDate(postData).subscribe(
              (data:any)  => {
            if(data){



      this.spinner.hide();

                let datas = new DataManager(data);
                this.onLeavData=datas.dataSource['json']
                this.onLeavCount=data.length;
                // this.dateRangeForm.get('daterangeAtt').valueChanges.subscribe(() => {
                //   if(data){
                //     this.spinner.hide();

                //   }

                // })
              //   this.initialSort = {
              //     columns: [{ field: 'dep_name', direction: 'Ascending' },
              //     { field: 'alias', direction: 'Descending' }]
              // };
              this.pageSettings = {pageSizes: true, pageCount: 5 }
              this.toolbar = ['Search','ExcelExport', 'PdfExport', ];



          // data.forEach((data,index)=>{
          //   if(data){
          //    let index12=index+1;
          //
          //     this.projectData['index'].rowValue=index12;
          //          }
          //   });
        //   this.initialSort = {
        //     columns: [{ field: 'dep_name', direction: 'Ascending' },
        //     { field: 'alias', direction: 'Descending' }]
        // };


                  // this.router.navigate(["/organizations"]);
                  this.pgData=data;
                  let ds= data.slice(0, this.pageSize);
                  let ds1 = new DataManager(ds);
          this.attendanceData=ds1.dataSource['json'];

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
          changed(e) {
            this.pageSize = e.pageSize;
            let start = (this.currentPage - 1) * e.pageSize;

            this.attendanceData = this.pgData.slice(start, start + e.pageSize);
          }
            click(args) {
            if (args.currentPage) {
              let start = (args.currentPage - 1) * this.pageSize;
              this.attendanceData = this.pgData.slice(start, start + this.pageSize);
            }
          }

          public onFirstCheckInChange(e){
            if(e.srcElement.checked){
              this.firstCheckin=true;
              this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
            }else{
              this.firstCheckin=false;

              this.GetTimesheetDashboardGridDataByOrgIDAndDate();

            }
            // this.addCurrentUser=!this.addCurrentUser;

          }

          public onLastCheckOutChange(e){
            if(e.srcElement.checked){
              this.lastCheckOut=true;
              this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();
            }else{
              this.lastCheckOut=false;

              this.GetTimesheetDashboardGridDataByOrgIDAndDate();

            }
            // this.addCurrentUser=!this.addCurrentUser;

          }

          public  GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate(){
            this.spinner.show();

            let fromDate=JSON.parse(localStorage.getItem('fromDate'))
                let toDate=JSON.parse(localStorage.getItem('toDate'))
                let postData={
                  "fromDate": moment(fromDate).format('L'),
                  "toDate": moment(toDate).format('L')
                }

            this.timesheetService.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate(postData).subscribe(
              (data:any)  => {


      this.spinner.hide();

                let datas = new DataManager(data);
                this.dashboardData=datas.dataSource['json']
                this.attendanceCount=data.length;
              //   this.initialSort = {
              //     columns: [{ field: 'dep_name', direction: 'Ascending' },
              //     { field: 'alias', direction: 'Descending' }]
              // };
              this.pgData=data;
              let ds= data.slice(0, this.pageSize);
              let ds1 = new DataManager(ds);
      this.attendanceData=ds1.dataSource['json'];


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
          public  GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate(){
            this.spinner.show();

            let fromDate=JSON.parse(localStorage.getItem('fromDate'))
                let toDate=JSON.parse(localStorage.getItem('toDate'))
                let postData={
                  "fromDate": moment(fromDate).format('L'),
                  "toDate": moment(toDate).format('L')
                }

            this.timesheetService.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate(postData).subscribe(
              (data:any)  => {


      this.spinner.hide();

                let datas = new DataManager(data);
                this.dashboardData=datas.dataSource['json']
                this.attendanceCount=data.length;
              //   this.initialSort = {
              //     columns: [{ field: 'dep_name', direction: 'Ascending' },
              //     { field: 'alias', direction: 'Descending' }]
              // };

              this.pgData=data;
              let ds= data.slice(0, this.pageSize);
              let ds1 = new DataManager(ds);
      this.attendanceData=ds1.dataSource['json'];

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

          public  TotalEmpLessHoursByOrgIDAndDate() {
            this.spinner.show();
            this.lessHrExceptionCount=0;
            let fromDate=JSON.parse(localStorage.getItem('fromDate'))
            let toDate=JSON.parse(localStorage.getItem('toDate'))
              let postData={
                "fromDate": moment(toDate).format('L'),
                "toDate": moment(fromDate).format('L')
              }
              this.timesheetService.TotalEmpLessHoursByOrgIDAndDate(postData).subscribe(
                (data:any)  => {


        if(data ){

          this.spinner.hide();
        //  let dataObj = JSON.parse(data['token']);

      let datas = new DataManager(data);
       this.dashboardLessHoursData=datas.dataSource['json']
      this.lessHrExceptionCount=data.length;
      // this.dateRangeForm.get('daterangeExcHrs').valueChanges.subscribe(() => {
      //   if(data){
      //     this.spinner.hide();

      //   }
      this.lessHrsPgData=data;

      let ds= data.slice(0, this.pageSize);
      let ds1 = new DataManager(ds);
//this.dashboardLessHoursData=ds1.dataSource['json'];
// if(this.selectedGroupVal=="Exception"){
//   this.lessHrsgrid.refresh();

// }
      // })
    //   this.initialSort = {
    //     columns: [{ field: 'dep_name', direction: 'Ascending' },
    //     { field: 'alias', direction: 'Descending' }]
    // };
    this.pageSettings = {pageSizes: true, pageCount: 5 }
    //  this.toolbar = ['Search'];
     this.toolbar = ['Search','ExcelExport', 'PdfExport', ];
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
                changedLessHrs(e) {
                  this.pageSize = e.pageSize;
                  let start = (this.currentPage - 1) * e.pageSize;
                  this.dashboardLessHoursData = this.lessHrsPgData.slice(start, start + e.pageSize);
                }
                  clickLessHrs(args) {
                  if (args.currentPage) {
                    let start = (args.currentPage - 1) * this.pageSize;
                    this.dashboardLessHoursData = this.lessHrsPgData.slice(start, start + this.pageSize);
                  }
                }
          public  TotalEmpOverTimeCountByOrgIDAndDate() {
            // this.spinner.show();
            this.showOvtCountSpinner=true;

            let fromDate=JSON.parse(localStorage.getItem('fromDate'))
            let toDate=JSON.parse(localStorage.getItem('toDate'))
              let postData={
                "fromDate": moment(toDate).format('L'),
                "toDate": moment(fromDate).format('L')
              }
              this.timesheetService.TotalEmpOverTimeCountByOrgIDAndDate(postData).subscribe(
                (data:any)  => {


        if(data ){
          this.showOvtCountSpinner=false;

          this.spinner.hide();
        //  let dataObj = JSON.parse(data['token']);

      let datas = new DataManager(data);
       this.dashboardOvertimeData=datas.dataSource['json']
      this.overTimeCount=data.length;
    //   this.initialSort = {
    //     columns: [{ field: 'dep_name', direction: 'Ascending' },
    //     { field: 'alias', direction: 'Descending' }]
    // };
    this.overtimePgData=data;

    let ds= data.slice(0, this.pageSize);
    let ds1 = new DataManager(ds);
//this.dashboardOvertimeData=ds1.dataSource['json'];
    this.pageSettings = {pageSizes: true, pageCount: 5 }
    //  this.toolbar = ['Search'];
     this.toolbar = ['Search','ExcelExport', 'PdfExport', ];
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

                changedOvertime(e) {
                  this.pageSize = e.pageSize;
                  let start = (this.currentPage - 1) * e.pageSize;
                  this.dashboardOvertimeData = this.overtimePgData.slice(start, start + e.pageSize);
                }
                clickOvertime(args) {
                  if (args.currentPage) {
                    let start = (args.currentPage - 1) * this.pageSize;
                    this.dashboardOvertimeData = this.overtimePgData.slice(start, start + this.pageSize);
                  }
                }
                public  TotalLocationCheckInExceptionByOrgIDAndDate() {
                  this.spinner.show();
            this.checkinExceptionCount=0;

                  let fromDate=JSON.parse(localStorage.getItem('fromDate'))
                  let toDate=JSON.parse(localStorage.getItem('toDate'))
                    let postData={
                      "fromDate": moment(toDate).format('L'),
                      "toDate": moment(fromDate).format('L')
                    }
                    this.timesheetService.TotalLocationCheckInExceptionByOrgIDAndDate(postData).subscribe(
                      (data:any)  => {


              if(data ){

                this.spinner.hide();
              //  let dataObj = JSON.parse(data['token']);

             let datas = new DataManager(data);
             this.dashboardCheckInExceptionData=datas.dataSource['json']
            this.checkinExceptionCount=data.length;

            this.checkinExcpPgData=data;

            let ds= data.slice(0, this.pageSize);
            let ds1 = new DataManager(ds);
     // this.dashboardCheckInExceptionData=ds1.dataSource['json'];
            // if(this.selectedGroupVal=="Exception"){
            //   this.checkingrid.refresh();

            // }
            // this.dateRangeForm.get('daterangeExcpLoc').valueChanges.subscribe(() => {
            //   if(data){
            //     this.spinner.hide();

            //   }

            // })
          //   this.initialSort = {
          //     columns: [{ field: 'dep_name', direction: 'Ascending' },
          //     { field: 'alias', direction: 'Descending' }]
          // };
          this.pageSettings = {pageSizes: true, pageCount: 5 }
          //  this.toolbar = ['Search'];
           this.toolbar = ['Search','ExcelExport', 'PdfExport', ];
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
                      changedCheckinExcp(e) {
                        this.pageSize = e.pageSize;
                        let start = (this.currentPage - 1) * e.pageSize;
                        this.dashboardCheckInExceptionData = this.checkinExcpPgData.slice(start, start + e.pageSize);
                      }
                        clickCheckinExcp(args) {
                        if (args.currentPage) {
                          let start = (args.currentPage - 1) * this.pageSize;
                          this.dashboardCheckInExceptionData = this.checkinExcpPgData.slice(start, start + this.pageSize);
                        }
                      }
                public  TotalLocationCheckOutExceptionByOrgIDAndDate() {
                  this.spinner.show();
                  this.checkoutExceptionCount=0;

                  let fromDate=JSON.parse(localStorage.getItem('fromDate'))
                  let toDate=JSON.parse(localStorage.getItem('toDate'))
                    let postData={
                      "fromDate": moment(toDate).format('L'),
                      "toDate": moment(fromDate).format('L')
                    }
                    this.timesheetService.TotalLocationCheckOutExceptionByOrgIDAndDate(postData).subscribe(
                      (data:any)  => {


              if(data ){

              //  this.spinner.hide();
              //  let dataObj = JSON.parse(data['token']);

            let datas = new DataManager(data);
             this.dashboardCheckOutExceptionData=datas.dataSource['json']
            this.checkoutExceptionCount=data.length;
            // this.dateRangeForm.get('daterangeExcpLoc').valueChanges.subscribe(() => {
              // if(this.selectedGroupVal=="Exception"){
              //   this.checkoutgrid.refresh();

              // }

                 this.spinner.hide();

                 this.checkoutExcpPgData=data;

                 let ds= data.slice(0, this.pageSize);
                 let ds1 = new DataManager(ds);
           //this.dashboardCheckOutExceptionData=ds1.dataSource['json'];

            // })
          //   this.initialSort = {
          //     columns: [{ field: 'dep_name', direction: 'Ascending' },
          //     { field: 'alias', direction: 'Descending' }]
          // };
          this.pageSettings = {pageSizes: true, pageCount: 5 }
          //  this.toolbar = ['Search'];
           this.toolbar = ['Search','ExcelExport', 'PdfExport', ];
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

                      changedCheckoutExcp(e) {
                        this.pageSize = e.pageSize;
                        let start = (this.currentPage - 1) * e.pageSize;
                        this.dashboardCheckOutExceptionData = this.checkoutExcpPgData.slice(start, start + e.pageSize);
                      }
                        clickCheckoutExcp(args) {
                        if (args.currentPage) {
                          let start = (args.currentPage - 1) * this.pageSize;
                          this.dashboardCheckOutExceptionData = this.checkoutExcpPgData.slice(start, start + this.pageSize);
                        }
                      }
          public  GetTimesheetDashboardGridAbsentDataByOrgIDAndDate() {
            let fromDate=JSON.parse(localStorage.getItem('fromDate'))
            let toDate=JSON.parse(localStorage.getItem('toDate'))
            let postData={
              "fromDate": moment(fromDate).format('L'),
              "toDate": moment(toDate).format('L')
            }

            this.timesheetService.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate(postData).subscribe(
              (data:any)  => {


  //this.spinner.hide();
        //  let dataObj = JSON.parse(data['token']);

      if(data){

           let datas = new DataManager(data);
           this.dashboardAbsentData=datas.dataSource['json']
          this.absentCount=data.length;
          // if(data){
          //   this.dateRangeForm.get('daterangeAbs').valueChanges.subscribe(() => {

                this.spinner.hide();
                this.absentPgData=data;

          //       let ds= data.slice(0, this.pageSize);
          //       let ds1 = new DataManager(ds);
          // this.dashboardAbsentData=ds1.dataSource['json'];


            // })
          }

        // }})
    //   this.initialSort = {
    //     columns: [{ field: 'dep_name', direction: 'Ascending' },
    //     { field: 'alias', direction: 'Descending' }]
    // };
    this.pageSettings = {pageSizes: true, pageCount: 5 }
    //  this.toolbar = ['Search'];
     this.toolbar = ['Search','ExcelExport', 'PdfExport', ];



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
              changedAbsentGrid(e) {
                this.pageSize = e.pageSize;
                let start = (this.currentPage - 1) * e.pageSize;
                this.dashboardAbsentData = this.absentPgData.slice(start, start + e.pageSize);
              }
              clickAbsentGrid(args) {
                if (args.currentPage) {
                  let start = (args.currentPage - 1) * this.pageSize;
                  this.dashboardAbsentData = this.absentPgData.slice(start, start + this.pageSize);
                }
              }
              public nearByPlaces(){

            // let nearbyplaces= new google.maps.places.PlacesService(map);
              this.geoCoder = new google.maps.Geocoder;
            let nearby=new google.maps.places.PlacesService(document.createElement('div'));
            nearby.nearbySearch({
              location: {lat: this.latitude, lng: this.longitude},
              radius: 100,

            }, (results,status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                  // this.createMarker(results[i]);
                }
              }
              this.nearbyPlaces=results;

            });



            }
              focusFunction (){
                if(this.searchElementRef.nativeElement.value==''){
                  this.showNearbyPlaces=true;

                }else{
                  this.showNearbyPlaces=false;

                }
               this.mapsAPILoader.load().then(() => {
                this.nearByPlaces();
               });
              }
              keyup(event){
                 this.showNearbyPlaces=false;

                if(event.keyCode == 8 && this.searchElementRef.nativeElement.value=='' )
                this.showNearbyPlaces=true;
                // this.searchLocVal='';

                this.mapsAPILoader.load().then(() => {
                  this.nearByPlaces();
                 });

              }

              clickFunction (){
                 if(this.searchElementRef.nativeElement.value==''){
                  this.showNearbyPlaces=true;

                }else{
                  this.showNearbyPlaces=false;

                }
               this.mapsAPILoader.load().then(() => {
                this.nearByPlaces();
               });
              }


              selectNearBy(nearbyPlace){
                this.nearbyAddress=nearbyPlace.name;
                // this.searchLocVal=nearbyPlace.name;
                this.address=nearbyPlace.name;
                // this.changed_address=nearbyPlace.name;
                // this.web_site = place.website;
                // this.name = place.name;

                // this.getChangedMatchedTypes()
                this.ngZone.run(() => {
                  this.latitude = nearbyPlace.geometry.location.lat();
                  this.longitude = nearbyPlace.geometry.location.lng();
                  this.showNearbyPlaces=false;
                  this.zoom=12;
                })


                //set latitude, longitude and zoom


              }

              setFmtAdrss(add) {
                console.log('address--->',add)
                if(add === null) {
                  this.newFormatedAddress = '';
                  return
                }
                this.newFormatedAddress = add;
               }

              public locationSetUp(){

                $('#kt_user_edit_tab_3').trigger('click')
                this.mapsAPILoader.load().then(() => {
                  //this.nearByPlaces();
                 this.geoCoder = new google.maps.Geocoder;
        // if(this.editable==false){
                  this.setCurrentLocation();

        // }

              let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);

                    autocomplete.addListener("place_changed", () => {
                  this.ngZone.run(() => {
                    //get the place result

                     let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    if (place.geometry === undefined || place.geometry === null) {
                      return;
                    }
                    this.address = place.formatted_address;

                     this.changedLocationData=place;
                     this.getChangedMatchedTypes();

                     this.changed_address=place.formatted_address;
                    // this.web_site = place.website;
                    // this.name = place.name;


                    //set latitude, longitude and zoom
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = 12;
                    // this.showNearbyPlaces=false;
                    if(this.searchElementRef.nativeElement==''){
                      // this.showNearbyPlaces=true;

                    }
                  });
                });







              });


               }
              public getChangedMatchedTypes() {
                let address_components
                if(this.changedLocationData.length!=0){
                   address_components=this.changedLocationData['address_components']

                }


                let i,
                    j,
                    types;
                let address_component;
                // Loop through the Geocoder result set. Note that the results
              // array will change as this loop can self iterate.
              for( i=0;i<address_components.length;i++){
                types = address_components[i]['types'];



                for (j = 0; j < types.length; j++) {
                  if (types[j] == 'street_number') {




                 this.changed_street_number = address_components[i]['short_name'];


                  }
                  if (types[j] === 'route') {
                    this.changed_route =  address_components[i]['long_name'];
                  }
                  // if (types[j] === 'formatted_address') {
                  //   this.formatted_address =  address_components[i]['long_name'];
                  // }
                  // if (types[j] === 'neighborhood') {
                  //   this.changed_street_number =  address_components[i]['long_name'];
                  // }
                  if (types[j] === 'locality') {
                    this.changed_locality =  address_components[i]['long_name'];
                  }
                  if (types[j] === 'administrative_area_level_1') {
                    this.changed_administrative_area_level_1 =  address_components[i]['long_name'];
                  }
                  if (types[j] === 'administrative_area_level_2') {
                    this.changed_administrative_area_level_2 =  address_components[i]['long_name'];
                  }
                  if (types[j] === 'postal_code') {
                    this.changed_postal_code =  address_components[i]['long_name'];
                  }
                  if (types[j] === 'country') {
                    this.changed_country =  address_components[i]['long_name'];
                  }

                }
              }


                  // address_component = address_components[element];




            }
            public goBack(){
              window.history.go(-1);
            }
            public openDialog(lat,lang,projectName,groupid){
              $('#map_modal').modal('show');
              this.selectedCheckInGroupVal="Checkin";

              // this.checkOutLat=parseFloat(lat);
              // this.checkOutLang=parseFloat(lang);
              this.latitude=parseFloat(lat),
              this.longitude=parseFloat(lang),
              this.projectName=projectName,
              this.mapsAPILoader.load().then(() => {
                this.geoCoder = new google.maps.Geocoder;

                // this.setCurrentLocation();
                this.getAddress(parseFloat(lat), parseFloat(lang));




            });

            let postData={
              "ID": groupid
            }

        this.timesheetService.GetCheckOutLocationByGroupID(postData).subscribe(
          (data:any)  => {


            if(data.length!=0){
              this.checkOutLat=parseFloat(data[0].lat)
              this.checkOutLang=parseFloat(data[0].lang)
            }else{
              this.checkOutLat='';
              this.checkOutLang='';

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


          })


            }
            openApproverInfo(approver1,approver2,leave_status){
              $('#approve_modal').modal('show');

            }
            OnApproveClose(){
              $('#approve_modal').modal('hide');
              this.approveCloseBtn.nativeElement.click();

            }
            public openActivityDialog(groupid,ondate,projId){
              this.GetTimesheetActivityByGroupAndDate(groupid,ondate);
              this.GetTimesheetActivityByGroupAndProjectID(groupid,ondate,projId);
              //$('#activity_modal').modal('show');


            let postData={
              "ID": groupid
            }

        // this.timesheetService.GetCheckOutLocationByGroupID(postData).subscribe(
        //   (data:any)  => {

        //
        //     if(data.length!=0){
        //       this.checkOutLat=parseFloat(data[0].lat)
        //       this.checkOutLang=parseFloat(data[0].lang)
        //     }



        //   },
        //   error  => {
        //     Swal.fire(
        //       'Error!',
        //       error,
        //       'error'
        //     ).then(
        //       (result)=> {
        //

        //       })
        //

        //   })


            }
            public  GetTimesheetActivityByGroupAndProjectID(groupid,ondate,projId) {
             //
              let postData={
                GroupID: groupid,
                ProjectID: projId,
                Date: ondate

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
            public  GetTimesheetActivityByGroupAndDate(groupid,ondate) {

              let postData={
                ID: groupid,
                Date: ondate
              }
              this.timesheetService.GetTimesheetActivityByGroupAndDate(postData).subscribe(
                (data:any)  => {


                  let datas = new DataManager(data);
                  this.activityData=datas.dataSource['json']
                 this.groupOptions = { showGroupedColumn: false,showDropArea: false,  columns: ['timesheet'] };
               this.pageSettings = {pageSizes: true, pageCount: 5 }


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
            public closeViewModal(){
              $('#activity_modal').modal('hide');
this.actCloseBtn.nativeElement.click();

            }
            private setCurrentLocation() {
              if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                  this.currlatitude = position.coords.latitude;
                  this.currlongitude = position.coords.longitude;
                  this.zoom = 8;
                  console.log('currlatitude',this.currlatitude);
        this.geoCoder = new google.maps.Geocoder;

                  //this.getAddress(this.currlatitude, this.currlongitude);
                  // this.mapsAPILoader.load().then(() => {
                    this.getCurrAddress(this.currlatitude, this.currlongitude)
                  //  });

                });
              }
            }
            public checkIsHome(e:any){
              if(e.srcElement.checked){
                this.homeInput=true;
                $('#OfficeCheck').prop('disabled',true);
                $('#jobInput').prop('disabled',true);

                this.getCurrAddress(this.currlatitude, this.currlongitude)
              }else{
                this.homeInput=false;
                $('#OfficeCheck').prop('disabled',false);
                $('#jobInput').prop('disabled',false);

              }



            }


         

 

            markerDragEnd($event: MouseEvent) {

              this.latitude = $event.coords.lat;
              this.longitude = $event.coords.lng;
              this.getAddress(this.latitude, this.longitude);
            }
              getAddress(latitude, longitude) {
                this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {


                  if (status === 'OK') {
                  this.geoCodeData=results[2];

                    if (results[0]) {
                      this.zoom = 15;
                      var service = new google.maps.places.PlacesService(document.createElement('div'));
                      var request = {
                          placeId: results[0].place_id
                      };
                      service.getDetails(request, function (place, status) {
                          if (status == google.maps.places.PlacesServiceStatus.OK) {
                          }
                      });
                      // this.getMatchedTypes();

                      this.address = results[0].formatted_address;
                      this.formatted_address = results[0].formatted_address;

                    } else {
                      window.alert('No results found');
                    }
                  } else {
                    window.alert('Geocoder failed due to: ' + status);
                  }

                });
              }
              getCurrAddress(latitude, longitude) {
                this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {



                  if (status === 'OK') {
                    this.geoCodeData=results[2];
                    if (results[0]) {
                      this.zoom = 15;
                      var service = new google.maps.places.PlacesService(document.createElement('div'));
                      var request = {
                          placeId: results[0].place_id
                      };
                      service.getDetails(request, function (place, status) {
                          if (status == google.maps.places.PlacesServiceStatus.OK) {
                          }
                      });
                       this.getMatchedTypes();

                      this.address = results[0].formatted_address;
                      this.formatted_address = results[0].formatted_address;
                      console.log('cformatted_address',results[0].formatted_address);
                      if(this.homeInput){
                        this.wfhRef.nativeElement.value= results[0].formatted_address;

                      }

                    } else {
                      window.alert('No results found');
                    }
                  } else {
                    window.alert('Geocoder failed due to: ' + status);
                  }

                });
              }
                public getMatchedTypes() {
                  let address_components
                  if(this.geoCodeData.length!=0){
                     address_components=this.geoCodeData['address_components']

                  }


                  let i,
                      j,
                      types;
                  let address_component;
                  // Loop through the Geocoder result set. Note that the results
                // array will change as this loop can self iterate.
                for( i=0;i<address_components.length;i++){
                  types = address_components[i]['types'];



                  for (j = 0; j < types.length; j++) {
                    if (types[j] == 'street_number') {




                   this.street_number = address_components[i]['short_name'];


                    }
                    if (types[j] === 'route') {
                      this.route =  address_components[i]['long_name'];
                    }
                    // if (types[j] === 'formatted_address') {
                    //   this.formatted_address =  address_components[i]['long_name'];
                    // }
                    if (types[j] === 'neighborhood') {
                      this.street_number =  address_components[i]['long_name'];
                    }
                    if (types[j] === 'locality') {
                      this.locality =  address_components[i]['long_name'];
                    }
                    if (types[j] === 'administrative_area_level_1') {
                      this.administrative_area_level_1 =  address_components[i]['long_name'];
                    }
                    if (types[j] === 'administrative_area_level_2') {
                      this.administrative_area_level_2 =  address_components[i]['long_name'];
                    }
                    if (types[j] === 'postal_code') {
                      this.postal_code =  address_components[i]['long_name'];
                    }
                    if (types[j] === 'country') {
                      this.country =  address_components[i]['long_name'];
                    }

                  }
                }


                    // address_component = address_components[element];




              }
              public getTodaysData(){
        //         this.spinner.show();

        //          this.TotalEmployeeDashboardDataByOrgID(this.today,this.today)
        // this.TotalEmployeeAbsentDashboardDataByOrgID(this.today,this.today)
        // this.dateText=moment(this.today).format('ddd, D MMM YYYY');
        //          this.GetTimesheetDashboardDataByOrgID(this.today,this.today)
        //     this.GetAllTimesheetByOrgID(this.today,this.today);
        //     this.TotalEmpOverTimeCountByOrgIDAndDate(this.today,this.today);
        //     this.TotalLocationCheckInExceptionByOrgIDAndDate(this.today,this.today);


        //        this.showtodaysData=true
        //        this.showweeksData=false;
               this.isTodayActive=true;
               this.isWeekActive=false;
               this.isMonthActive=false;
            this.isRangeActive=false;

        localStorage.setItem('fromDate',JSON.stringify(this.today));
        localStorage.setItem('toDate',JSON.stringify(this.today));
        this.dateRangeForm.patchValue({
          daterangeAtt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
          daterangeAbs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
          daterangeOvt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
          daterangeExcpLoc:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
          daterangeExcHrs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))]
         })
         if(this.firstCheckin==true){
          this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
        }else if(this.lastCheckOut==true){

          this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();

        }else{

          this.GetTimesheetDashboardGridDataByOrgIDAndDate();

        }
         this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();
         this.TotalEmpOverTimeCountByOrgIDAndDate();
         this.TotalLocationCheckInExceptionByOrgIDAndDate();
         this.TotalLocationCheckOutExceptionByOrgIDAndDate();
     this.TotalEmpLessHoursByOrgIDAndDate();
     if(new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')).getTime()==this.today.getTime()){

      this.nextDayDisabled=true;
    }else{
      this.nextDayDisabled=false;

    }

                }
                public getWeeksData(){
                  this.spinner.show();
                  if(new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')).getTime()==this.today.getTime()){

                    this.nextDayDisabled=true;
                  }else{
                    this.nextDayDisabled=false;

                  }

        this.isTodayActive=false;
        this.isWeekActive=true;
        this.isMonthActive=false;
        this.isRangeActive=false;

     localStorage.setItem('fromDate',JSON.stringify(this.weekEnd));
     localStorage.setItem('toDate',JSON.stringify(this.weekStart));
 this.dateRangeForm.patchValue({
   daterangeAtt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
   daterangeAbs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
   daterangeOvt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
   daterangeExcpLoc:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
   daterangeExcHrs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))]
  })
  if(this.firstCheckin==true){
   this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
 }else if(this.lastCheckOut==true){

   this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();

 }else{

   this.GetTimesheetDashboardGridDataByOrgIDAndDate();

 }
  this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();
  this.TotalEmpOverTimeCountByOrgIDAndDate();
  this.TotalLocationCheckInExceptionByOrgIDAndDate();
  this.TotalLocationCheckOutExceptionByOrgIDAndDate();
this.TotalEmpLessHoursByOrgIDAndDate();


                 }
                 public getMonthsData(){
                  this.spinner.show();
                  if(new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')).getTime()==this.today.getTime()){

                    this.nextDayDisabled=true;
                  }else{
                    this.nextDayDisabled=false;

                  }
                  this.isTodayActive=false;
                  this.isWeekActive=false;
                  this.isMonthActive=true;
            this.isRangeActive=false;


            // this.weekabsentMem=0;

  localStorage.setItem('fromDate',JSON.stringify(this.monthStart));
  localStorage.setItem('toDate',JSON.stringify(this.monthEnd));
                  // this.weekabsentMem=0;
                  this.dateRangeForm.patchValue({
                    daterangeAtt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeAbs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeOvt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeExcpLoc:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeExcHrs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))]
                   })
                   if(this.firstCheckin==true){
                    this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
                  }else if(this.lastCheckOut==true){

                    this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();

                  }else{

                    this.GetTimesheetDashboardGridDataByOrgIDAndDate();

                  }
                   this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();
                   this.TotalEmpOverTimeCountByOrgIDAndDate();
                   this.TotalLocationCheckInExceptionByOrgIDAndDate();
                   this.TotalLocationCheckOutExceptionByOrgIDAndDate();
                 this.TotalEmpLessHoursByOrgIDAndDate();



                 }
                 public startTimeChanged(){

                }
                GetProjectListByEmpID(){
                  let postData={
                    id:this.manageEmpId
                  }
                  this.projectService.FetchAllProjectByEmpID().subscribe(

                    (projectData:any) => {

                      var results=[{ id: '', text: 'Select',additional:{teamBy:''} }]
                      // let dataObj = JSON.parse(data['token']);
                    //
                    if(projectData){
                      for (var i = 0; i < projectData.length; i++) {
                        // logik to create new items

                        results.push({

                            id: projectData[i].project_id,
                            text: projectData[i].project_name,
                            additional:{
                              teamBy: projectData[i].project_prefix
                          }



                        });

                        }
                    }






               this.projectFilterList=results



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
                public endTimeChanged(){

                  this.checkinForm.get('endTime').valueChanges.subscribe(() => {
                    if(this.checkinForm.get('startTime').value==this.checkinForm.get('endTime').value){
                      this.startEqualEnd=true;
                    }else{
                      this.startEqualEnd=false;

                    }

                });

                }
                 public nextday(){
                  let fromDate=moment(JSON.parse(localStorage.getItem('fromDate'))).add(1, 'day').toDate();

                  localStorage.setItem('fromDate',JSON.stringify(fromDate));
                  localStorage.setItem('toDate',JSON.stringify(fromDate));
                  if(new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')).getTime()==this.today.getTime()){

                    this.nextDayDisabled=true;
                  }else{
                    this.nextDayDisabled=false;

                  }
                  this.dateRangeForm.patchValue({
                    daterangeAtt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeAbs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeOvt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeExcpLoc:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeExcHrs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))]
                   })
                   if(this.firstCheckin==true){
                    this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
                  }else if(this.lastCheckOut==true){

                    this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();

                  }else{

                    this.GetTimesheetDashboardGridDataByOrgIDAndDate();

                  }
                   this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();
                   this.TotalEmpOverTimeCountByOrgIDAndDate();
                   this.TotalLocationCheckInExceptionByOrgIDAndDate();
                   this.TotalLocationCheckOutExceptionByOrgIDAndDate();
                 this.TotalEmpLessHoursByOrgIDAndDate();

                 }
                 public  FetchLeaveStatusOrgID(){
                  this.leaveService.FetchLeaveStatusOrgID().subscribe(

                    (data:any) => {


                  this.leaveStatusData=data;
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
                 resetCheckin(){
                  this.checkinForm.reset();
                  this.modifySubmit=false;
                  this.approvalValue='';
                  this.approvalValue1='';
                  this.approvalValue2='';
                  $('#OfficeCheck').prop('checked', false);
                  $('#homeCheck').prop('checked', false);
                  $('#isDual').prop('checked', false);
                  $('#isLeavDual').prop('checked', false);
                  $('#OfficeCheck').prop('disabled', false);
                  $('#homeCheck').prop('disabled', false);
                  this.isDual=false;
                  this.isLeavDual=false;
                  this.leaveApprovalValue2='';
                  this.leaveApprovalValue1='';
                  this.leavApprovalValue='';
                  this.leaveForm.reset();

                  // this.checkInLeavModel="Checkin";

                 }
                 customiseCell(args: any) {
                  //if (args.column.field === 'Value') {
                      if (args.data['leave_status'] == ('Checkin Pending')) {
                        args.cell.classList.add('background-green');

                      } else if (args.data['leave_status'] == ('Leave Approved')) {
                        args.cell.classList.add('background-yellow');
                      } else if (args.data['leave_status'] == ('Leave Declined')) {
                        args.cell.classList.add('background-red');
                      }else if (args.data['leave_status'] == ('Leave Pending')) {
                        args.cell.classList.add('background-green');
                      }else if (args.data['leave_status'] == ('Checkin Approved')) {
                        args.cell.classList.add('background-yellow');
                      }else if (args.data['leave_status'] == ('Checkin Declined')) {
                        args.cell.classList.add('background-red');
                      }
                 // }
                }
                customiseLeaveGrid(args: any) {
                  //if (args.column.field === 'Value') {
                      if (args.data['onbehalf_emp_name'] != null) {
                        args.cell.classList.add('background-red');
                      }
                 // }
                }
                 public prevday(){
                   let fromDate=moment(JSON.parse(localStorage.getItem('fromDate'))).subtract(1, 'day').toDate();

                    localStorage.setItem('fromDate',JSON.stringify(fromDate));
                  localStorage.setItem('toDate',JSON.stringify(fromDate));
                  if(new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')).getTime()==this.today.getTime()){
                    console.log('nextDayDisabledtrue')
                    this.nextDayDisabled=true;
                  }else{
                    console.log('nextDayDisabledfalse',new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')),this.today)
                    this.nextDayDisabled=false;

                  }
                  this.dateRangeForm.patchValue({
                    daterangeAtt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeAbs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeOvt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeExcpLoc:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
                    daterangeExcHrs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))]
                   })
                   if(this.firstCheckin==true){
                    this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
                  }else if(this.lastCheckOut==true){

                    this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();

                  }else{

                    this.GetTimesheetDashboardGridDataByOrgIDAndDate();

                  }
                   this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();
                   this.TotalEmpOverTimeCountByOrgIDAndDate();
                   this.TotalLocationCheckInExceptionByOrgIDAndDate();
                   this.TotalLocationCheckOutExceptionByOrgIDAndDate();
                 this.TotalEmpLessHoursByOrgIDAndDate();

                  }
                  onModifySubmit(){
                    this.modifySubmit=true;
                    let user:object={};
                    let startTime=this.checkinForm.get('startTime').value;
                    let endTime=this.checkinForm.get('endTime').value;
                    let date=moment().format('MM/DD/YYYY');
if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));
}
                    if(this.approvalValue1==this.approvalValue2){
                      this.sameApprover=true;
                    }else{
                      this.sameApprover=false;
                    }
                    if(this.leaveApprovalValue1==this.leaveApprovalValue2){
                      this.sameLeavApprover=true;
                    }else{
                      this.sameLeavApprover=false;
                    }
                    let typeOfCheckin;
                    let typeOfCheckinValue;
                    if(this.officeInput){
                     typeOfCheckin='Office',
                     typeOfCheckinValue= this.selectedValue
                    }else if(!this.homeInput && !this.officeInput ){
                      typeOfCheckin='Manual',
                     typeOfCheckinValue=this.checkinForm.get('placeName').value
                    }
                    else if(this.homeInput){
                      typeOfCheckin='Place',
                     typeOfCheckinValue=this.formatted_address
                    }

  let postData={

    "team_member_empid": [
      this.manageEmpId
    ],
    "teamid": null,
    "check_in":date.concat(' ' +startTime),
    "check_out": date.concat(' ' +endTime),
    "groupid": null,
    "ondate":this.manageDate,
    "createdby":user['full_name'],
    "is_inrange": true,
    "is_checkout": true,
    "total_hrs": null,
    // "is_onbehalf":this.isDual?false:(this.approvalValue==user['id']?true:false),
    "is_onbehalf":false,
    "onbehalf_empid": user['id'],
    "approver1_empid": this.isDual?this.approvalValue1:this.approvalValue,
    "approver2_empid": this.isDual?this.approvalValue2:null,
    "reason_id":this.reasonValue,
    "reason_desc":this.reasonValueTxt=='Other'?this.checkinForm.get('reasondesc').value:null,
    "TimesheetCategoryViewModel": {
      "project_category_type":typeOfCheckin,
      "project_or_comp_id": typeOfCheckin=="Office"?this.selectedOfficeId:null,
      "project_or_comp_name": typeOfCheckinValue,
      "project_or_comp_type": null
        },
        "TimesheetCurrentLocationViewModel": {

          "formatted_address": this.formatted_address?this.formatted_address:"",
              "lat": this.currlatitude?JSON.stringify(this.currlatitude):"",
              "lang":  this.currlongitude?JSON.stringify( this.currlongitude):"",
              "street_number": this.street_number?this.street_number:"",
              "route": this.route?this.route:"",
              "locality": this.locality?this.locality:"",
              "administrative_area_level_2": this.administrative_area_level_2?this.administrative_area_level_2:"",
              "administrative_area_level_1": this.administrative_area_level_1?this.administrative_area_level_1:"",
              "postal_code": "",
              "country":  this.country?this.country:""
        },
        "TimesheetSearchLocationViewModel": {
          "manual_address":typeOfCheckin=='Manual'?this.checkinForm.get('placeName').value:"",
          ...!this.officeInput?{"geo_address": this.formatted_address,

          "formatted_address":  !this.officeInput?this.formatted_address:this.formatted_address,
              "lat": this.currlatitude?JSON.stringify(this.currlatitude):"",
              "lang": this.currlongitude?JSON.stringify(this.currlongitude):"",
              "street_number": this.street_number?this.street_number:"",
              "route": this.route?this.route:"",
              "locality": this.locality?this.locality:"",
              "administrative_area_level_2": this.administrative_area_level_2?this.administrative_area_level_2:"",
              "administrative_area_level_1": this.administrative_area_level_1?this.administrative_area_level_1:"",
              "postal_code": "",
              "country":  this.country?this.country:""}:
              {
                "geo_address": this.selectedentitiyLoc?this.selectedentitiyLoc.geo_address:'',

                "formatted_address":this.selectedentitiyLoc?this.selectedentitiyLoc.formatted_address:'',
                    "lat": this.selectedentitiyLoc?this.selectedentitiyLoc.lat:'',
                    "lang": this.selectedentitiyLoc?this.selectedentitiyLoc.lang:'',
                    "street_number": this.selectedentitiyLoc?this.selectedentitiyLoc.street_number:'',
                    "route": this.selectedentitiyLoc?this.selectedentitiyLoc.route:'',
                    "locality": this.selectedentitiyLoc?this.selectedentitiyLoc.locality:'',
                    "administrative_area_level_2": this.selectedentitiyLoc?this.selectedentitiyLoc.administrative_area_level_2:'',
                    "administrative_area_level_1": this.selectedentitiyLoc?this.selectedentitiyLoc.administrative_area_level_1:'',
                    "postal_code": "",
                    "country":  this.selectedentitiyLoc?this.selectedentitiyLoc.country:'',
              },
              "is_office": this.officeInput?true:false,
              "is_manual": typeOfCheckin=='Manual'?true:false,
              "is_wfh": this.homeInput?true:false,
        },






  }
console.log('ApproveTimesheet',postData,this.sameApprover,this.checkinForm.status);
if(this.selectedModifiedGroupVal=='Checkin'){
   if(this.checkinForm.status=='VALID' && (this.isDual?(!this.sameApprover && this.approvalValue1!='' && this.approvalValue2!='' ):this.approvalValue!='')
   && (!this.officeInput && !this.homeInput?this.checkinForm.get('placeName').value!='':true)){
console.log('VALIDcheckin');
this.spinner.show();
         return this.timesheetService.ApproveTimesheet(postData).subscribe(
        (data:any)  => {

        if(data.status==200){
          $('#modification_modal').modal('hide');
        this.resetCheckin();
this.spinner.hide();
this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();

          this.toastr.success('Checkin log has been sent successfully for approval', undefined,{
            positionClass: 'toast-top-center'
       });
        }
        },
        error  => {
          this.spinner.hide();

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
    }else{
      let user_info= JSON.parse(localStorage.getItem('user_info'));
        let leave_id;
        for(var i=0;i<this.leaveStatusData.length;i++){
          if(this.leaveStatusData[i].leave_status_name=="Pending"){
            leave_id=this.leaveStatusData[i].id;
          }
        }
        let leavepostData={
      "org_id": localStorage.getItem('org_id'),
      "emp_id": this.manageEmpId,
      "leave_setup_id":  this.leaveSetupid,
      "leave_start_date": moment(this.manageDate).format('L'),
      "leave_end_date": moment(this.manageDate).format('L'),
      "leave_days": 1,
      "ondate_applied": moment().format('L'),
      "is_onbehalf": false,
      "onbehalf_empid": user_info['id'],
      "approver_emp_id": this.isLeavDual?this.leaveApprovalValue1:this.leavApprovalValue,
      "approver_emp_id2": this.isLeavDual?this.leaveApprovalValue2:null,
      "leave_status_id":leave_id,
      "is_approved": false,
      "approve_start_date": null,
      "approve_end_date": null,
      "approved_days": null,
      "ondate_approved": null,
      "emp_notes": this.leaveForm.get('desc').value,
      "createdby": user_info['full_name'],
        }
console.log('leaveForm',this.leaveForm.status);

      if(this.leaveForm.status=="VALID" &&  (this.isLeavDual?(!this.sameLeavApprover && this.leaveApprovalValue1!='' && this.leaveApprovalValue2!='' ):this.leavApprovalValue!='')){
        console.log('leavepostData',leavepostData);
        this.spinner.show()
      return this.leaveService.AddEmployeeLeave(leavepostData).subscribe(
        (data:any)  => {
        if(data.status==200){
        this.spinner.hide();
        this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();
      this.modifySubmit=false;
      this.leaveApprovalValue2='';
      this.leaveApprovalValue1='';
      this.leavApprovalValue='';
          this.toastr.success(data['desc'], undefined,{
            positionClass: 'toast-top-center'
       });
    $("#modification_modal").modal('hide');

                  }
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

                  }
                  isActivityLogFieldValid(field: string) {
                    if(this.modifySubmit){

                      return (
                      this.showerrorMsg=true,
                        this.checkinForm.get(field).errors && this.checkinForm.get(field).touched ||
                        this.checkinForm.get(field).untouched &&
                        this.modifySubmit
                      );
                    }

                    else{

                      return (
                      this.showerrorMsg=false,

                        false
                      );
                    }

                  }
                  public  FetchTimeOffSetupOrgID(){
                    this.leaveService.FetchTimeOffSetupOrgID().subscribe(

                      (data:any) => {

                    if(data){
                     for(var i=0;i<data.length;i++){
                       if(data[i].timeoff_type_name=="Earned"){
                  this.earnedTimeOff=(data[i].timeoff_type_earned);
                       }else{
                        this.sickTimeOff=(data[i].timeoff_type_earned);

                       }
                     }
                     let user_info= JSON.parse(localStorage.getItem('user_info'));
                     if(user_info['joined_date']!=null){
                     let joinedDate=moment(user_info['joined_date']).format('L');
                     let currentDate=moment().format('L');
                     var diff = moment(currentDate).diff(moment(joinedDate), "month")
                     this.earnedLeaves=diff*(this.earnedTimeOff);
                     this.casualLeaves=((this.sickTimeOff)*moment().month() + 1);
                     this.leavesEntitled= this.earnedLeaves;
                     }
                     //setTimeout(()=>{   this.fetchEmpLeave()  }, 500);
                    //  this.fetchEmpLeave();
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

                      public  FetchReasonsOrgID(){
                        this.leaveService.FetchReasonsOrgID().subscribe(

                          (data:any) => {

                        if(data){
                          var results=[{ id: '', text: 'Select a reason' }]
                          // let dataObj = JSON.parse(data['token']);
                        //

                    for (var i = 0; i < data.length; i++) {
                    // logik to create new items
                   // if(data[i].status_name!=item.status){
                      results.push({
                        "id": data[i].id,
                        "text": data[i].reasons_name
                    });
                    }

this.reasonData=results;
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
                  public checkIsOffice(e:any){
                    if(e.srcElement.checked){
                      this.officeInput=true;
                      $('#homeCheck').prop('disabled',true);
                      $('#jobInput').prop('disabled',true);


                    }else{
                      this.officeInput=false;
                      $('#homeCheck').prop('disabled',false);
                      $('#jobInput').prop('disabled',false);

                    }

                  }
                  public checkIsJob(e:any){
                    if(e.srcElement.checked){
                       this.jobInput=true;
                      $('#homeCheck').prop('disabled',true);
                      $('#OfficeCheck').prop('disabled',true);
                      this.GetProjectListByEmpID();
                    }else{
                       this.jobInput=false;
                      $('#OfficeCheck').prop('disabled',false);
                      $('#homeCheck').prop('disabled',false);

                    }

                  }
                  public  getLeaveSetup(){
                    this.leaveService.FetchLeaveSetupOrgID().subscribe(

                      (data:any) => {
              if(data.length!=0){
                this.leaveSetupData=data;

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
                      public customRadioChange(id,name){
                        this.leaveSetupid=id;

                        if(name=="Sick Leave"){
                          let used_leaves=0;
                          used_leaves= this.approvedLeaves.reduce(function(sum, record){
                            if(record.leave_days != '' && record.leave_name=="Sick Leave") return sum +parseInt(record.leave_days) ;
                            else return sum;
                          }, 0);

                                    this.used_leaves=used_leaves;

                          if(this.empjoinedDate!==null && this.empjoinedDate!==''){

                            let joinedDate=this.empjoinedDate;
                            let currentDate=moment().format('L');
                            // var diff = moment(currentDate).diff(moment(joinedDate), "month")
                            // let earnedLeaves=diff*(this.earnedTimeOff);
                            let casualLeaves=((this.sickTimeOff)*moment().month() + 1);

                            this.leavesEntitled=casualLeaves;

                      this.availableLeaves=this.leavesEntitled-used_leaves;

                            }
                        }else
                        {
                          let used_leaves=0;
                          used_leaves= this.approvedLeaves.reduce(function(sum, record){
                            if(record.leave_days != ''  && record.leave_name=="Annual Leave") return sum +parseInt(record.leave_days) ;
                            else return sum;
                          }, 0);

                                    this.used_leaves=used_leaves;

                          //if(this.empjoinedDate!==null || this.empjoinedDate!==''){

                            let joinedDate=this.empjoinedDate;
                            let currentDate=moment().format('L');
                             var diff = moment(currentDate).diff(moment(joinedDate), "month")
                             let earnedLeaves=diff*(this.earnedTimeOff);
                            let casualLeaves=((this.sickTimeOff)*moment().month() + 1);

                            this.leavesEntitled=earnedLeaves;

                      this.availableLeaves=this.leavesEntitled-used_leaves-this.adjustedBalance;
                        //}
                      }
                        //
                        // if(this.projectForm.get('prefixVal').value=='is_custom'){
                        //   this.showPrefixText=true;

                        // }else{
                        //   this.showPrefixText=false;
                        //  // this.FindAutoProjectPrefixByOrgID();

                        // }
                      }
                      public findLeaveCount(val){
                        this.empValue=val
                        if(val!=''){
                        let postData={
                          "id": val,

                              }
                  //this.findJoiningDate(postData);
                  this.LeaveCountByEmpID(postData);
                  this.findEmpLeaveHistory(postData)
                  this.showLeavesSpin=true;
                  setTimeout(() => {
                    /** spinner ends after 5 seconds */



                    return this.leaveService.FetchEmployeeLeaveEmpID(postData).subscribe(
                      (data:any)  => {
                        // let dataObj = JSON.parse(data['token']);

                      let used_leaves=0;

                      if(data){
                       let approved=[]
                       let annualApproved=[]
                       let sickApproved=[]
                         // let dataObj = JSON.parse(data['token']);
                       //

                         for (var i = 0; i < data.length; i++) {
                           // logik to create new items

                           if(data[i].leave_status_name=="Approved" ){
                             approved.push(data[i]);

                           }
                           if(data[i].leave_status_name=="Approved"  && data[i].leave_name=="Annual Leave"){
                            annualApproved.push(data[i]);

                          }else if(data[i].leave_status_name=="Approved"  && data[i].leave_name=="Sick Leave" ){
                            sickApproved.push(data[i]);

                          }



                       }
                       this.approvedLeaves=approved;
                       this.annualApprovedLeaves=annualApproved;
                       this.sickApprovedLeaves=sickApproved;
                       used_leaves= approved.reduce(function(sum, record){
                        if(record.leave_days != '') return sum +parseInt(record.leave_days) ;
                        else return sum;
                      }, 0);

                                }else{
                                  used_leaves=0;
                                }


                      this.used_leaves=used_leaves;
                      if(this.empjoinedDate!==null && this.empjoinedDate!==''){

                        let joinedDate=this.empjoinedDate;
                        let currentDate=moment().format('L');
                        var diff = moment(currentDate).diff(moment(joinedDate), "month")
                        let earnedLeaves=diff*(this.earnedTimeOff);
                        let casualLeaves=((this.sickTimeOff)*moment().month() + 1);

                        this.leavesEntitled=earnedLeaves;

                  this.availableLeaves=this.leavesEntitled-this.used_leaves;
                  this.showLeavesSpin=false;
                  //this.changedEmployeeLeaveAdjustmentEmpID(postData);

                        }else{
                        this.leavesEntitled=0;
                        this.availableLeaves=0;
                  //this.changedEmployeeLeaveAdjustmentEmpID(postData);


                        }
                        console.log('leavesEntitled',this.leavesEntitled);
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

                  }, 500);
                        }

                      }
                      LeaveCountByEmpID(postData) {
                        let joinedDate='';

                        this.empService.LeaveCountByEmpID(postData).subscribe(
                          (data:any)  => {


                    if(data){

                    this.leaveCountData=data;
                  //     let datas = new DataManager(data);
                  // this.leaveHistory=datas.dataSource['json'];
                  // this.toolbar = ['Search' ];


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
                      findEmpLeaveHistory(postData) {
                        let joinedDate='';

                        this.leaveService.FetchEmployeeLeaveHistoryEmpID(postData).subscribe(
                          (data:any)  => {


                    if(data){


                      let datas = new DataManager(data);
                  this.leaveHistory=datas.dataSource['json'];
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
                      findJoiningDate(postData) {
                        let joinedDate='';
                    this.showLeavesSpin=true;
                        this.empService.getByEmployeeID(postData).subscribe(
                          (data:any)  => {


                    if(data){
                    this.showLeavesSpin=false;

                      if(data.joined_date==null || data.joined_date==''){
                        this.showLeaveInfo=false;
                        this.empjoinedDate='';

                      }else{
                        this.showLeaveInfo=true;

                      }
                       this.empjoinedDate=data.joined_date!=null?moment(data.joined_date).format('L'):'';

                    }else{
                      this.empjoinedDate=null;

                    }
this.findLeaveCount(this.manageEmpId);


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
    this.selectedGroupVal="Attendance";
    this.locationModel="Attendance";
    this.selectedCheckInGroupVal="CheckIn";
    this.checkInModel="Checkin";
    this.checkInLeavModel="Checkin";

    this.OrgId=localStorage.getItem('org_id');
    this.leaveForm = new FormGroup({
      desc:new FormControl('', [Validators.required]),
      leaveType:new FormControl('', [Validators.required]),


    });
    // this.showtodaysData=true
    //    this.showweeksData=false;
       this.isTodayActive=true;
       this.isWeekActive=false;
       this.isMonthActive=false;
    this.isRangeActive=false;
    setTimeout(() => {

      this.spinner.show();

    }, 1000);
    // this.GetAllTimesheets();
    this.dateRangeForm = new FormGroup({
      daterangeAtt: new FormControl(''),
      daterangeAbs: new FormControl(''),
      daterangeOvt: new FormControl(''),
      daterangeExcpLoc: new FormControl(''),
      daterangeExcHrs: new FormControl(''),
      daterangeOnleav: new FormControl(''),



   });
   this.checkinForm= new FormGroup({
    startTime: new FormControl('',[Validators.required]),
    endTime: new FormControl('',[Validators.required]),
    placeName: new FormControl(''),
    reasondesc: new FormControl('')

 });
   this.dateRangeForm.patchValue({
    daterangeAtt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
    daterangeAbs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
    daterangeOvt:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
    daterangeExcpLoc:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
    daterangeExcHrs:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))],
    daterangeOnleav:[new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))]
   })
   this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

   this.dateRangeForm.get('daterangeAtt').valueChanges.subscribe(() => {
    // fires when the input value has actually changed

    if(this.dateRangeForm.get('daterangeAtt').value!=null){
      this.spinner.show();
      let startTime=this.dateRangeForm.get('daterangeAtt').value;
      this.fromDateValue=moment(startTime[0]).format('L');
      this.toDateValue=moment(startTime[1]).format('L');
      this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

      localStorage.setItem('fromDate',JSON.stringify(startTime[0]))
      localStorage.setItem('toDate',JSON.stringify(startTime[1]));// this.GetTimesheetActivityByEmpIDAndDate(this.fromDateValue,this.toDateValue);

     // this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();

      // this.GetTimesheetDashboardGridDataByOrgIDAndDate();
      if(this.firstCheckin==true){
        this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
      }else if(this.lastCheckOut==true){

        this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();

      }else{

        this.GetTimesheetDashboardGridDataByOrgIDAndDate();

      }
      // this.TotalEmpLessHoursByOrgIDAndDate();
      // this.TotalLocationCheckInExceptionByOrgIDAndDate();
      // this.TotalLocationCheckOutExceptionByOrgIDAndDate();
      // this.TotalEmpOverTimeCountByOrgIDAndDate();

    }else{
      this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

    }

    //







});
this.dateRangeForm.get('daterangeAbs').valueChanges.subscribe(() => {
  // fires when the input value has actually changed

  if(this.dateRangeForm.get('daterangeAbs').value!=null){
    this.spinner.show();
    let startTime=this.dateRangeForm.get('daterangeAbs').value;
    this.fromDateValue=moment(startTime[0]).format('L');
    this.toDateValue=moment(startTime[1]).format('L');
    this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

    localStorage.setItem('fromDate',JSON.stringify(startTime[0]))
    localStorage.setItem('toDate',JSON.stringify(startTime[1]));// this.GetTimesheetActivityByEmpIDAndDate(this.fromDateValue,this.toDateValue);

    this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();

    // this.GetTimesheetDashboardGridDataByOrgIDAndDate();
    // if(this.firstCheckin==true){
    //   this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
    // }else if(this.lastCheckOut==true){

    //   this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();

    // }else{

    //   this.GetTimesheetDashboardGridDataByOrgIDAndDate();

    // }
    // this.TotalEmpLessHoursByOrgIDAndDate();
    // this.TotalLocationCheckInExceptionByOrgIDAndDate();
    // this.TotalLocationCheckOutExceptionByOrgIDAndDate();
    // this.TotalEmpOverTimeCountByOrgIDAndDate();

  }else{
    this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

  }

  //







});

this.dateRangeForm.get('daterangeOvt').valueChanges.subscribe(() => {
  // fires when the input value has actually changed

  if(this.dateRangeForm.get('daterangeOvt').value!=null){
    this.spinner.show();
    let startTime=this.dateRangeForm.get('daterangeOvt').value;
    this.fromDateValue=moment(startTime[0]).format('L');
    this.toDateValue=moment(startTime[1]).format('L');
    this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

    localStorage.setItem('fromDate',JSON.stringify(startTime[0]))
    localStorage.setItem('toDate',JSON.stringify(startTime[1]));// this.GetTimesheetActivityByEmpIDAndDate(this.fromDateValue,this.toDateValue);

   // this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();

    // this.GetTimesheetDashboardGridDataByOrgIDAndDate();
    // if(this.firstCheckin==true){
    //   this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
    // }else if(this.lastCheckOut==true){

    //   this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();

    // }else{

    //   this.GetTimesheetDashboardGridDataByOrgIDAndDate();

    // }
    // this.TotalEmpLessHoursByOrgIDAndDate();
    // this.TotalLocationCheckInExceptionByOrgIDAndDate();
    // this.TotalLocationCheckOutExceptionByOrgIDAndDate();
     this.TotalEmpOverTimeCountByOrgIDAndDate();

  }else{
    this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

  }

  //







});
this.dateRangeForm.get('daterangeExcpLoc').valueChanges.subscribe(() => {
  // fires when the input value has actually changed

  if(this.dateRangeForm.get('daterangeExcpLoc').value!=null){
    this.spinner.show();
    let startTime=this.dateRangeForm.get('daterangeExcpLoc').value;
    this.fromDateValue=moment(startTime[0]).format('L');
    this.toDateValue=moment(startTime[1]).format('L');
    this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

    localStorage.setItem('fromDate',JSON.stringify(startTime[0]))
    localStorage.setItem('toDate',JSON.stringify(startTime[1]));// this.GetTimesheetActivityByEmpIDAndDate(this.fromDateValue,this.toDateValue);

   // this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();

    // this.GetTimesheetDashboardGridDataByOrgIDAndDate();
    // if(this.firstCheckin==true){
    //   this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
    // }else if(this.lastCheckOut==true){

    //   this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();

    // }else{

    //   this.GetTimesheetDashboardGridDataByOrgIDAndDate();

    // }
    // this.TotalEmpLessHoursByOrgIDAndDate();
    this.TotalLocationCheckInExceptionByOrgIDAndDate();
    this.TotalLocationCheckOutExceptionByOrgIDAndDate();
    // this.TotalEmpOverTimeCountByOrgIDAndDate();

  }else{
    this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

  }

  //







});
this.dateRangeForm.get('daterangeExcHrs').valueChanges.subscribe(() => {
  // fires when the input value has actually changed

  if(this.dateRangeForm.get('daterangeExcHrs').value!=null){
    this.spinner.show();
    let startTime=this.dateRangeForm.get('daterangeExcHrs').value;
    this.fromDateValue=moment(startTime[0]).format('L');
    this.toDateValue=moment(startTime[1]).format('L');
    this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

    localStorage.setItem('fromDate',JSON.stringify(startTime[0]))
    localStorage.setItem('toDate',JSON.stringify(startTime[1]));// this.GetTimesheetActivityByEmpIDAndDate(this.fromDateValue,this.toDateValue);

   // this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();

    // this.GetTimesheetDashboardGridDataByOrgIDAndDate();
    // if(this.firstCheckin==true){
    //   this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
    // }else if(this.lastCheckOut==true){

    //   this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();

    // }else{

    //   this.GetTimesheetDashboardGridDataByOrgIDAndDate();

    // }
     this.TotalEmpLessHoursByOrgIDAndDate();
    // this.TotalLocationCheckInExceptionByOrgIDAndDate();
    // this.TotalLocationCheckOutExceptionByOrgIDAndDate();
    // this.TotalEmpOverTimeCountByOrgIDAndDate();

  }else{
    this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

  }

  //







});
this.dateRangeForm.get('daterangeOnleav').valueChanges.subscribe(() => {
  // fires when the input value has actually changed

  if(this.dateRangeForm.get('daterangeOnleav').value!=null){
    this.spinner.show();
    let startTime=this.dateRangeForm.get('daterangeOnleav').value;
    this.fromDateValue=moment(startTime[0]).format('L');
    this.toDateValue=moment(startTime[1]).format('L');
    this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

    localStorage.setItem('fromDate',JSON.stringify(startTime[0]))
    localStorage.setItem('toDate',JSON.stringify(startTime[1]));// this.GetTimesheetActivityByEmpIDAndDate(this.fromDateValue,this.toDateValue);

   // this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();

    // this.GetTimesheetDashboardGridDataByOrgIDAndDate();
    // if(this.firstCheckin==true){
    //   this.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
    // }else if(this.lastCheckOut==true){

    //   this.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();

    // }else{

    //   this.GetTimesheetDashboardGridDataByOrgIDAndDate();

    // }
     this.GetTimesheetDashboardGridOnLeaveDataByOrgIDAndDate();
    // this.TotalLocationCheckInExceptionByOrgIDAndDate();
    // this.TotalLocationCheckOutExceptionByOrgIDAndDate();
    // this.TotalEmpOverTimeCountByOrgIDAndDate();

  }else{
    this.daterangeVal = [new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')), new Date(moment(JSON.parse(localStorage.getItem('toDate'))).format('L'))];

  }

  //







});
if(new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')).getTime()==this.today.getTime()){
  console.log('nextDayDisabledtrue')
  this.nextDayDisabled=true;
}else{
  console.log('nextDayDisabledfalse',new Date(moment(JSON.parse(localStorage.getItem('fromDate'))).format('L')),this.today)
  this.nextDayDisabled=false;

}
    // $.getScript("assets/js/departments-datatable.js")

  this.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();
  this.GetTimesheetDashboardGridDataByOrgIDAndDate();
  this.TotalEmpLessHoursByOrgIDAndDate();
  this.TotalLocationCheckInExceptionByOrgIDAndDate();
  this.TotalLocationCheckOutExceptionByOrgIDAndDate();
  this.TotalEmpOverTimeCountByOrgIDAndDate();
  this.GetTimesheetDashboardGridOnLeaveDataByOrgIDAndDate();
  this.initialPage = { pageSize: 10,currentPage:1 };
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
  if(sessionStorage.getItem('attendType')){
    if(sessionStorage.getItem('attendType')=='Absent'){
      this.selectedGroupVal='Absent';
      this.locationModel='Absent';
    }else if(sessionStorage.getItem('attendType')=='Attendance'){
      this.selectedGroupVal='Attendance';
      this.locationModel='Attendance';
    }else if(sessionStorage.getItem('attendType')=='Exception'){
      this.selectedGroupVal='Exception';
      this.locationModel='Exception';
    }else if(sessionStorage.getItem('attendType')=='Overtime'){
      this.selectedGroupVal='Overtime';
      this.locationModel='Overtime';
    }else if(sessionStorage.getItem('attendType')=='Onleave'){
      this.selectedGroupVal='Onleave';
      this.locationModel='Onleave';
    }

  }
// $.getScript('assets/js/pages/custom/projects/list-datatable.js')
// $.getScript('https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js')

  }
}
