import { Component,ViewContainerRef,ViewEncapsulation, OnInit,ViewChildren, AfterViewInit,ElementRef, Input, Output, ViewChild, NgZone, Inject, Renderer2 } from '@angular/core';
import { countUpTimerConfigModel, timerTexts, CountupTimerService } from 'ngx-timer';
//import { ClockPickerDialogService, ClockPickerConfig } from 'ng-clock-picker-lib';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { ClockPickerDialogService, ClockPickerConfig } from 'ng-clock-picker-lib';
 import * as moment from 'moment';
// import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
// import * as _swal from 'sweetalert';
// import { SweetAlert } from 'sweetalert/typings/core';
import  Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { Select2OptionData, Select2TemplateFunction } from 'ng2-select2';
 import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
 import { ResizeService } from '@syncfusion/ej2-angular-grids';
 import {Location, Appearance, GermanAddress} from '@angular-material-extensions/google-maps-autocomplete';
 import { DataManager, Query, UrlAdaptor, WebApiAdaptor, ODataAdaptor } from '@syncfusion/ej2-data';
import { GridComponent,GroupService, EditService, ToolbarService, PageService, ColumnChooserService, EditSettingsModel, ToolbarItems, GridLine,SearchSettingsModel, Column, valueAccessor, ValueAccessor,SortService  } from '@syncfusion/ej2-angular-grids';
import { EventArgs } from '@syncfusion/ej2-navigations';
import { Slider } from '@syncfusion/ej2-inputs';
//  import {} from '@types/googlemaps';

  import PlaceResult = google.maps.places.PlaceResult;

//import { orderData } from './data';
// { EditService, ToolbarService, PageService } from '@syncfusion/ej2-angular-grids';
//import { ClockPickerDirective } from './clock-picker.directive';

//  import {Directive, ElementRef} from "@angular/core";

declare var $: any;
//  import * as $ from 'jquery';
let pos;
    let map;
    let bounds;
    let infoWindow;
    let currentInfoWindow;
    let service;
    let infoPane
// CommonJS
import 'sweetalert2/src/sweetalert2.scss'
import { TimeSheetService } from '../../services/timesheet.service';
import { TaskService } from '../../services/task.service';
import { MatTableDataSource } from '@angular/material';
import { TeamService } from '../../services/team.service';
import { EmployeeService } from '../../services/employee.service';
import { DesignationService } from '../../services/designation.service';
import { DepartmentService } from '../../services/department.service';
import { UserService } from '../../services/user.service';
import { AdministrativeService } from '../../services/administrative.service';
import { GoogleMap } from '@agm/core/services/google-maps-types';
import { ActivityService } from '../../services/activity.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectService } from '../../services/project.service';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { OrganizationService } from '../../services/organization.service';
import { LeaveService } from '../../services/leave.service';
import { LeadService } from '../../services/lead.service';
import { QuotationService } from '../../services/quotation.service';
import { CostService } from '../../services/cost.service';
import { NotificationService } from '../../services/notification.service';
import { HistoryService } from '../../services/history.service';
import {verifyDelegateUserControl} from '../../shared/services/index'
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

declare let google: any;
const url = '../../assets/js/audioTimer.js';
let user_info:object;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));

}
let start = document.getElementById('start');

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.scss'],
  providers: [],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*', display: 'block' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
      encapsulation: ViewEncapsulation.None,
})
export class DashboardUserComponent implements  AfterViewInit, OnInit  {
  //@ViewChildren(ClockPickerDirective)
  @ViewChild('closeBtn',{static:false}) closeBtn: ElementRef;
  @ViewChild('taskCloseBtn',{static:false}) taskCloseBtn: ElementRef;
  @ViewChild('actCloseBtn',{static:false}) actCloseBtn: ElementRef;
  @ViewChild('timeLogBtn',{static:false}) timeLogBtn: ElementRef;
  @ViewChild('detailCloseBtn',{static:false}) detailCloseBtn: ElementRef;

  errorTimeExcced = false;
  radioOptionTime = [
    {
      id: 15,
      value:"15 minutes"
    },
    {
      id: 30,
      value:"30 minutes"
    },
    {
      id: 60,
      value:"60 minutes"
    },
    {
      id: 90,
      value:"90 minutes"
    }
  ]

  errorTimeExccedOne = false;
  radioOptionTimeOne = [
    {
      id: 15,
      value:"15 minutes"
    },
    {
      id: 30,
      value:"30 minutes"
    },
    {
      id: 60,
      value:"60 minutes"
    },
    {
      id: 90,
      value:"90 minutes"
    }
  ]

  loadAPI: Promise<any>;
  public min: number = 0;
  public max: number = 100;
  public slidervalue: number = 30;
  public searchText:string ='';
  filterValue:string = 'some';
  lowercase:boolean = false;
  public setDragRadius=200;
  // public ticks: Object =  { placement: 'After', largeStep: 20, smallStep: 10, showSmallTicks: true };
  // public tooltip: Object = { placement: 'Before', isVisible: true, showOn: 'Always' };
  public tooltipData: Object = { placement: 'Before', isVisible: true, showOn: 'Always', format: 'P0' };
  public ticksData: Object = { placement: 'After', largeStep: .2, smallStep: .1, showSmallTicks: true, format: 'P0' };
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  public appearance = Appearance;
  public circleRadius=100;
  displayedColumns = ['Employees','Job', 'CheckIn', 'CheckOut','Hours','Action'];

  displayedEmpColumns= ['index','Job', 'CheckIn', 'CheckOut','Action'];
  displayedActivityColumns= ['index','Task', 'StartTime', 'EndTime','Billable'];
  dataSource :any;
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  @ViewChild('search',{ read: ElementRef , static: false })
   searchElementRef: ElementRef;
   @ViewChild(AgmMap, { static: true })
   map: GoogleMap;
   public selectedAddress: PlaceResult;
   public dateValue: Date = new Date();
   public format: string =  'dd-MMM-yy';
   showProjDesc=false;
   public checkin=true;
   public breakin=false;
   public breakout=false;
   public checkout=false;
   datePickerSpan = false;
   toolbarbottom;

   //clock variable
   clockTimerDiv = false;
   noClockTimerDiv = true;
   timerSecondsValue = 0;
   timerSecondsFinalValue = 0;
   @ViewChild('timerReference', { static: false }) public timerReference;

  panels = [
    {
    title: 'panel 1',
    content: 'content 1'
  },
  {
    title: 'panel 2',
    content: 'content 2'
  },
  ]

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  displayedColumns2 = ['position', 'name', 'weight'];
  // dataSource2 = new ExampleDataSource();

  form: FormGroup = this.formBuilder.group({ time: [''] });


  public date=moment().format('dddd, D MMM YYYY');
        public time=localStorage.getItem( 'currentTime');
  public paused=false;
  public selectedText="Select";
  public showDetails=false;
  public showModals=false;
  public isChecked=false;
  public showAdminTasks=false;
  public editTeam=false;
  public onTrack=false;
  private el: ElementRef;
  // time = {hour: 13, minute: 30};
  public id:number;
  public startValue: string;
  public selectedPurpose: string;
  public selectedProject: string;
  public selectedTask: string;
  public selectedActivity:string;
  public teamValue:any;
  public teamAddSubmit:any;
  public soloSubmit:any;

  public showPurpose=false;
  public showProjects=false;
  public showTask=false;
  public showActivities=false;
  public showTeamSelect=false;
  public showComments=false;

  public projectData: Array<Select2OptionData>;
  public taskData: Array<Select2OptionData>;
  public activityData: Array<Select2OptionData>;
  public teamData:Array<Select2OptionData>;
  public teamMembersData:Array<Select2OptionData>;
  public tasksList:Array<Select2OptionData>;
  public projTaskData:Array<Select2OptionData>;


  public employeeData:Array<Select2OptionData>;
  public othersData:Array<Select2OptionData>;
  // public officeData:Array<Select2OptionData>;
  public options: Select2Options;
  public otherOptions: Select2Options;
  public teamOptions:Select2Options;
  public activityOptions: Select2Options;
  public jobOptions: Select2Options;
  public deptOptions: Select2Options;
  public taskDescOptions: Select2Options;
  public deptData: Array<Select2OptionData>;
  public desgnData: Array<Select2OptionData>;
  public selectedCategData: Array<Select2OptionData>;
  public selectedSubTaskData: Array<Select2OptionData>;





  public purposeValue:any;
  public projectValue:any;
  public taskValue:any;
  public othersDataValue:any;
  public officeDataValue='';
  public activityValue:any;
  public employeeValue:any;
  public dataSync: Object[];
  public editData: Object[];

  public filterSettings: Object;
  public editSettings: Object;
  public toolbar: string[];
  public orderidrules: Object;
  public requiredField: Object;

  public customeridrules: Object;
  public freightrules: Object;
  public editparams: Object;
  public pageSettings: Object;
 public keyword = 'name';
 public checkIn='';
 public checkOut='';
 public expandRow=false;
 public taskCompletedList;
 public taskOpenList;
 public taskInProgressList;
 public checkInTime;
 public checkOutTime;
 public systemidText;
 public showMap=true;
 searchField;
 public showprojTask=false;
 public startValChange=false;
 public endValChange=false;

 public teamMembers=[];
 public teamMemFetchData=[];
 public teams=[];

  public teamsValFetchData=[];
 public teamEmpName;
 public filterEmpByDesgn=false;
 public filterEmpByDept=false;
 public filterEmpByFreeLanc=false;
 public filterEmpByOutsource=false;
 public group_id;
 public teamCheckIn=false;

 public formatted_address;
public lat;
public lang;
public street_number;
public route;
public locality;
public administrative_area_level_2;
public administrative_area_level_1;
public postal_code;
public country;


public current_formatted_address;
public current_street_number;
public current_route;
public current_locality;
public current_administrative_area_level_2;
public current_administrative_area_level_1;
public current_postal_code;
public current_country;

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
public chosenTime='';
public disableEndTime=true;
public xpandStatus=true;
public disableAddLog=true;
public disableAddTask=true;


public groupOptions: Object;
// public pageSettings: Object;
public refresh: Boolean;
@ViewChild('grid', {static: false})
public grid: GridComponent;
// @ViewChild('alertDialog')
// public alertDialog: DialogComponent;
public alertHeader: string = 'Grouping';
public hidden: Boolean = false;
public target: string = '.control-section';
public alertWidth: string = '300px';
public alertContent: string = 'Grouping is disabled for this column';
public showCloseIcon: Boolean = false;
public animationSettings: Object = { effect: 'None' };

 public empList=[ {name: 'Sazid'},
 {name: 'Hifza K'},
 {name: 'Jacob'},
 {name: 'Nick'}
]
meetingTaskData=[ {
  id: '',
  text: 'Select'
},  {
  id: 1,
  text: 'Meeting'
},
{
  id: 2,
  text: 'Call'
}
]
relatedToData=[ {
  id: '',
  text: 'Select'
},  {
  id: 1,
  text: 'Lead'
},
{
  id: 2,
  text: 'Estimation'
},

{
  id: 3,
  text: 'Quotation'
},
{
  id: 4,
  text: 'Project'
},{
  id:'NA',
  text: 'NA'
}
]
public categData=[ {
  id: '',
  text: 'Select'
},  {
  id: 1,
  text: 'Projects'
},
{
  id: 2,
  text: 'Complain'
},

{
  id: 3,
  text: 'Location'
},
]
public officeData = [
  {
    id: '1',
    text: 'Interfuture'
  },
  {
    id: '2',
    text: 'BinSalem'
  },


];
 public data = [
     {
       id: '1',
       text: 'J/988 E1'
     },
     {
       id: '2',
       text: 'J/987 E2'
     },
     {
       id: '3',
       text: 'J/989 E3'
     },
     {
      id: '4',
      text: 'J/985 E4'
    },

  ];
  complainData= [
    {
      id: '1',

      prfix: 'COM/19/12/006',
      text: 'Case'
    },
    {
      id: '2',
      prfix: 'COM/20/12/007',
      text: 'Case'
    },
    {
      id: '3',
      prfix: 'COM/21/12/008',
      text: 'Case'
    },
    {
      id: '4',
      prfix: 'COM/22/12/010',
      text: 'Case'
    },

    ];
    tasks= [
   ]
   assignedData= [
    {
      id: '1',
      text: 'Assignee 1'
    },
    {
      id: '2',
      text: 'Assignee 2'
    },
    {
      id: '3',
      text: 'Assignee 3'
    },
    ]
  // configA: ClockPickerConfig = { initialValue:this.time};
  // configB: ClockPickerConfig = { };

  public timeLogForm: FormGroup;
  editable: boolean;
  editDeptId: any;
  isCheckout=false;
  isCheckIn=false;
  desgnEmpValue: any;
  deptEmpValue: any;
  deptValue: any;
  teamMemberValue: any;
  public maxCurrentTime=moment().add(2,'minutes').format('hh:mm a');

  public today: Date = new Date(new Date().toDateString());
  public maxRangeDate: Date = this.today;
  newdateRangeForm: FormGroup;
  public monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
  public monthEnd: Date = this.today;
  public lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
  public lastEnd: Date = this.today;
  public yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
  public yearEnd: Date = this.today;

  empDataSource: any;
  activityDataSource: MatTableDataSource<any>;
  teamCount: any;
  selectedCategText='empty';
  currentCheckin: any;
  diffTime: any;
  selectedGroupVal= 'empty';
  teamAdd: boolean;
  administrativeCateg: any;
  allTimeLog: any;
  selectedTaskText: any;
  selecteSubTaskValue: any;
  activityLogForm: FormGroup;
  selectedActivVal: any;
  taskCategValue: any;
  taskListValue: any;
  selectedVal: string;
  selectedDeptVal: string;
  matButtonToggleGroup: any;
  groupModel: any;
  locationModel: any;
  geoCodeData: any;
  cgeoCodeData: any;
  changed_address: string;
  activityGroupID: any;
  officeInput: boolean;
  manualInput: boolean;
  teamLocAdd: boolean;
  manualInputValue="";
  teamEmpId=[];
  selecteOptionValue="";
  nearbyPlaces: { id: string; text: string; }[];
  nearbyAddress="";
  showPurposeTasks: boolean;
  act_proj_name: any;
  act_sys_name: any;
  showPurposeToggle: boolean;
  act_formatted_address: any;
  act_purposeValue: any;
  startTime: string;
  endTime: string;
  billable=false;
  searchLocVal: any;
  AdminTaskValue="";
  ActTaskValue: any;
  orgList: any;
  selectedValue="";
  checkOptionValue: boolean;
  OrgId: string;
  taskStatusData: { id: string; text: string; }[];
  taskStatus: any;
  tasktobeUpdated: any;
  assignedToList: any;
  employeeTasksList=[];
  adminData: { id: string; text: string; children: any[]; }[];
  showActivityTasks=false;
  geo_address: any;
  public selectedActivGroupVal='empty';
  selectedActivCategData: { id: string; text: string; }[];
  activModel:any;
  systemid: any;
  activtasksList: { id: string; text: string; }[];
  acttaskListValue='';
  projTaskDataValue='';
  projTaskDataText: any;
  officeActListValue: any='';
  ActTaskLogForm: FormGroup;
  officetaskListValue='';
  officetaskText: any;
  selectedJobData: { id: string; text: string; }[];
  selecteJobOptionValue: any='';
  officegroupID: any;
  actTextInputValue='';
  remarksInputValue='';
  minStartTime: any;
  maxEndTime: string;
  data12: Object[];
  public officeActInputValue='';
  maxAddLogEndTime: string;
  minOfficeActInputTime: string;
  showTimeLogSpinner:boolean;
  addLogSpinner: boolean;
  minEndTime: any;
  OfficeLogForm: FormGroup;
  public project_start_date: any;
  public project_end_date: any;
  public project_desc: any;
  customerName: any;
  customerPhone: any;
  planType: string;
  activityDataText: any;
  public officeactText='';
  projectId: void;
  startOfficTime: string;
  endOfficTime: string;
  projDesc: boolean=false;
  selectedentitiyLoc: any;
  currentPoslng: number;
  currentPoslat: number;
  projectPoslat: any;
  projectPoslng: any;
  drag: boolean=false;
  boundryContain: any;
  selectedOfficeId: any;
  routerSubscription: any;
  addOfficAdminAct: boolean=false;
  viewProjType: any;
  viewProjName: any;
  viewProjCheckin: any;
  viewProjCheckout: any;
  addformSubmitted: any;
  adminSel: boolean;
  taskSel: boolean;
  actTxt: boolean;
  showerrorMsg: boolean;
  adminformSubmitted: boolean;
  addActformSubmitted: any=false;
  recentTaskSel: boolean=false;
  recentAdminSel: boolean;
  recentActtxtSel: boolean=false;
  recentActSel: boolean;
  checkoutByEmpId: boolean=false;
  recentActAdminSel: boolean=false;
  recentActTaskSel: boolean=false;
  @ViewChild('empgrid',{   static: false })
  @ViewChild('nearbyContainer',{   static: false }) nearbyContainer: ElementRef;

  empgrid;
  breakInTime: string;
  breakOutTime: string;
  testConfig: countUpTimerConfigModel;
  taskWithDesc: Array<Select2OptionData>;
  overDueList: any;
  enableTaskStatus: boolean=false;
  enableActTaskStatus: boolean=false;
  actTaskStatusValue: any='';
  dateRangeForm: FormGroup;
  leaveForm: FormGroup;
  leaveStatusData: any;
  leaveSetupid: any;
  leaveSetupData: any;
  leaveSpan: any;
  approverTaskValue: any;
  addleaveformSubmitted: boolean;
  approverData: { id: string; text: string; }[];
  sick_used_leaves: number=0;
  earned_used_leaves: number=0;
  earned_remaining: number=0;
  sick_remaining: number=0;
  earnedLeaves: number=0;
  casualLeaves: number=0;
  earnedTimeOff: any;
  sickTimeOff: any;
  leavesEntitled: number=0;
  showLeaveLogSpinner: boolean=true;
  empValue: any;
  empSelDisabled: boolean=false;
  approvedLeaves: any[];
  empjoinedDate: any;
  used_leaves: number;
  availableLeaves: number;
  showLeavesSpin: boolean=true;
  showLeaveInfo: boolean;
  leaveHistory: Object[];
  showSlider: boolean=false;
  sliderForm: FormGroup;
  meetingTaskValue: any='';
  meetingTaskValueTxt: any;
  relatedValue: any='';
  typeData: { id: string; text: string; }[];
  typeName: string;
  typeValue='';
  showMeetingAct: boolean=false;
  subtxtSel: boolean;
  subTextInputValue: any;
  milestone_Name: boolean;
  taskProjectId='';
  leadSourceData: any;
  relatedSearchToolbar: string[];
  initialSort: { columns: { field: string; direction: string; }[]; };
  estSourceData: any;
  projSourceData: any;
  qtnSourceData: any;
  closeActLog: boolean=true;
  officeSubtaskListValue: any;
  projSubTaskData=[]
  officeSubtaskText: any;
  projSubtaskListValue: any;
  projSubtaskText: any;
  recentSubTaskSel: boolean=false;
  sub_taskId='';
  showProjBasedTasks: boolean=false;
  inProgressStatID: any;
  allowUpdateStatus: boolean=false;
  openStatID: any;
  homeInput: boolean;
  homeInputValue: string;
  allowOfficUpdateStat: boolean;
  completedStatID: any;
  completedList: any[];
  timeinrange: boolean=true;
  selectedJobFilterData: { id: string; text: string; additional: { teamBy: string; }; }[];
  jobFilterValue: any='';
  jobFilterOptions: { placeholder: string; width: string; };
  activityFilterOptions: { placeholder: string; width: string; };
  taskFilterOptions: { placeholder: string; width: string; };
  milestFilterList: { id: string; text: string; }[];
  activityFilterValue: any='';
  taskFilterValue: any='';
  projectFilterListByEmp: { id: string; text: string; additional: { teamBy: string; }; }[];
  offcboundryContain: any;
  typeOfCheckin: any;
  offcMeetingTaskValue: any='';
  addteamMem: boolean;
  adjustedBalance: number;
  startEqualEnd: boolean;
  offcStartEqualEnd: boolean;
  isDisableTask: boolean=false;
  //datepick
  /* const today = new Date()
  const yesterday = new Date(today)

yesterday.setDate(yesterday.getDate() - 1)


console.log(yesterday) */
  datePickerForm: FormGroup;
  public maxRangeDateNew: Date;
  employeeID;
  public dateValueNew = moment().format('ddd, D MMM YYYY');
  public constantDate = moment().format('L');
  public dateTextNew;
  employeePreviousDayActivitiesData;
  employeePreviousDayActivitiesProjectData:any = [];
  total_hrs_spent;
  empCheckIn;
  empLeftTime;
  empLateArrival;
  empLeaveEarly;
  empProductiveTime;
  empProductivity;
  empActivetyTime;
  empTimeSpend;
  current_address: any;
  allowDrag: boolean=false;


  dataBound() {
    if(this.refresh){
        this.grid.groupColumn('dep_name');
        this.refresh =false;
    }
}
changedSliderValue(e){

}
load() {
    this.refresh = (<any>this.grid).refreshing;
}
created() {
    // this.grid.on("columnDragStart", this.columnDragStart, this);
}
// public columnDragStart(args: any) {
//     if(args.column.field === "Mainfieldsofinvention"){
//         this.alertDialog.show();
//    }
// }

    private setCurrentLocation() {
      var options = {
        enableHighAccuracy: true,maximumAge:15000, timeout:60000
    };
    this.latitude=0;
    this.longitude=0;
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 15;
          console.log('currlatitude',this.latitude)
          this.getAddress(this.latitude, this.longitude);

          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          // map = new google.maps.Map(document.getElementById('map'), {
          //   center: pos,
          //   zoom: 15
          // });

        },function(error) {
         // alert('Unable to get location: ' + error.message);
         this.currentPoslng=undefined;
         this.searchElementRef.nativeElement.value= '';
         Swal.fire(
          'Something went wrong!',
          'Unable to get location:' + error.message,
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })
      }, options);
      }
      setTimeout(() => {
        /** spinner ends after 5 seconds */

        console.log('latitudeValid',this.latitude);

        }, 50);

    }
    public  getAllEmployeeList(){
      this.empService.getEmployeeByOrgId().subscribe(

        (data:any) => {
          var results=[{ id: '', text: 'Select' }]
          var empresults=[{ id: '', text: 'Select' }]

          // let dataObj = JSON.parse(data['token']);
        //
        let user_info= JSON.parse(localStorage.getItem('user_info'));


          for (var i = 0; i < data.length; i++) {
            // logik to create new items
        if(user_info['id']!=data[i].id){

            results.push({
                "id": data[i].id,
                "text": data[i].first_name
            });

            }
        }
        this.empValue=user_info['id'];
        if(user_info['is_superadmin']==true){
         this.empSelDisabled=false;

        }
        if(user_info['is_admin']==true && user_info['is_superadmin']==false){

          this.empSelDisabled=false;

        }
        if(user_info['is_admin']==false && user_info['is_superadmin']==false){
         this.empSelDisabled=true;

        }
        for (var i = 0; i < data.length; i++) {

          empresults.push({
              "id": data[i].id,
              "text": data[i].first_name
          });

      }


    this.employeeData= empresults;
    this.approverData =results;




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
        }else{
          this.showLeaveInfo=true;

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
        public changedEmp(e){
          this.empValue=e.value
          if(e.value!=''){
          let postData={
            "id": e.value,


                }
    this.findJoiningDate(postData);

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
           // let dataObj = JSON.parse(data['token']);
         //

           for (var i = 0; i < data.length; i++) {
             // logik to create new items

             if(data[i].leave_status_name=="Approved"){
               approved.push(data[i]);

             }


         }
         this.approvedLeaves=approved;
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
          }
        // this.router.navigate(["/organizations"]);
        this.FetchEmployeeLeaveAdjustmentEmpID();

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
    public  FetchGridDataByDepartmentOrgID() {
      this.deptService.fetchGridDataByDepartmentOrgID().subscribe(
        (data:any)  => {


          //  let dataObj = JSON.parse(data['token']);

        let datas = new DataManager(data);
        this.data12=datas.dataSource['json']
        this.groupOptions = { showGroupedColumn: false,showDropArea: false,  columns: ['dep_name','alias'] };
      this.pageSettings = {pageSizes: true, pageCount: 5 }
      this.toolbar = ['Search'];
    //  this.searchOptions = { fields: ['dep_name'], operator: 'contains', key: 'Ha', ignoreCase: true };
         this.dataSource =  new MatTableDataSource(data);
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
    private setCurrentPosition() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 15;


          this.getGeoLocation(this.latitude, this.longitude);


        });
      }
    }
    getParentApi(): ParentComponentApi  {
      return {
        callParentMethod: () => {
          this.OnTaskClose();
          if(this.jobFilterValue!='')
{
this.getalltaskbyJob(this.jobFilterValue,'job');
//this.GetAllTaskByJobEmpID()
// this.GetAllTaskByEmpID();

}else{
  this.GetAllTaskByEmpID();
  this.GetAllTaskDescByEmpID();
}
          //this.GetAllTaskByEmpID()
        }
      }
    }
    // getTaskApi(): ParentComponentApi  {
    //   return {
    //     taskParentMethod: () => {
    //       this.GetAllTaskByEmpID()
    //     }
    //   }
    // }
    getGeoLocation(lat: number, lng: number) {
      if (navigator.geolocation) {
          let geocoder = new google.maps.Geocoder();
          let latlng = new google.maps.LatLng(lat, lng);
          let request = { latLng: latlng };

          geocoder.geocode(request, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {

            }
          });
      }
      }
   public onAutocompleteSelected(result: PlaceResult) {

    }

    public  onLocationSelected(location: Location) {

      this.latitude = location.latitude;
      this.longitude = location.longitude;
    }

    public onGermanAddressMapped($event: GermanAddress) {

    }




  markerDragEnd($event: MouseEvent) {

    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    if (navigator)
    {
    navigator.geolocation.getCurrentPosition( pos => {
      this.currentPoslng = +pos.coords.longitude;
      this.currentPoslat = +pos.coords.latitude;
      });

    }
    this.drag=true


    this.projectPoslat =  $event.coords.lat;
    this.projectPoslng = $event.coords.lng ;
    this.SetPosition( $event.coords.lat, $event.coords.lng);
    this.getAddress(this.latitude, this.longitude);
    this.getCurrentAddress(this.currentPoslat, this.currentPoslng);
    var
    contentCenter = '<span class="infowin">Center Marker </span>',
    contentA = '<span class="infowin">Marker A </span>';

    var
    latLngCenter = new google.maps.LatLng(this.currentPoslat, this.currentPoslng),
    latLngCMarker = new google.maps.LatLng(this.currentPoslat, this.currentPoslng),
    latLngA = new google.maps.LatLng($event.coords.lat, $event.coords.lng), //project loaction
    mapOptions = {
       center: latLngCenter,
       zoom: 15,
       mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 19,
        center: latLngCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false
    }),
     markerCenter = new google.maps.Marker({
        position: latLngCMarker,
        title: 'Location',
        map: map,
        draggable: false
    }),
    infoCenter = new google.maps.InfoWindow({
        content: contentCenter
    }),
    markerA = new google.maps.Marker({
        position: latLngA,
        title: 'Location',
        map: map,
        draggable: true
    }),
    infoA = new google.maps.InfoWindow({
        content: contentA
    }),
    circle = new google.maps.Circle({
        map: map,
        clickable: false,
        radius:500,
        fillColor: '#fff',
        fillOpacity: .6,
        strokeColor: '#313131',
        strokeOpacity: .4,
        strokeWeight: 2,
        center:latLngCenter
    });
    console.log('latLngA',latLngA);

     // circle.bindTo('center', markerCenter, 'position');

     const nyc = new google.maps.LatLng(this.latitude, this.longitude);
     const london = new google.maps.LatLng($event.coords.lat, $event.coords.lng);
     const distance = google.maps.geometry.spherical.computeDistanceBetween(nyc, london);
      var bounds = circle.getBounds()
      //noteA = jQuery('.bool#a');
     // noteA.text(bounds.contains(latLngA));

     let bound=bounds.contains(latLngA)
     if(bound==false){
      Swal.fire(
        "Dragging the marker outside radius isn't allowed",
        'Please select precise location',
        'error'
      ).then(
        //used Arrow function here
        (result)=> {

          //  this.router.navigate(['/dashboard']);
        })
     }


      console.log('bound',bound)

  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {

      if(results){
        this.geoCodeData=results[2];

      }

      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 15;
          this.getMatchedTypes();
          if(this.drag==true){
            this.getMatchedTypes();
            this.searchElementRef.nativeElement.value= results[0].formatted_address;
            if(this.homeInput){
              this.searchLocVal=results[0].formatted_address;
              this.formatted_address=results[0].formatted_address;
            }

          }
          this.address = results[0].formatted_address;
          this.formatted_address = results[2].formatted_address;

        } else {
          //window.alert('No results found');
          Swal.fire(
            'Please try again!',
            'Location not found',
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })
        }
      } else if(status === 'ERROR'){
        // window.alert('Geocoder failed due to: ' + status);
        Swal.fire(
          'Please try again!',
          'Please check the internet connection',
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })
      }else if(status === 'REQUEST_DENIED'){
        // window.alert('Geocoder failed due to: ' + status);
        Swal.fire(
          'Please try again!',
          'Please allow location access',
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })
      }else if(status === 'OVER_QUERY_LIMIT'){
        Swal.fire(
          'Please try again!',
          'Subscription exceeded.Please contact Admin',
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })
      }else{
        Swal.fire(
          'Please try again!',
          status,
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })
      }

    });
  }
  getCurrentAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {

      if(results){
        this.cgeoCodeData=results[2];

      }

      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 15;
          this.cgetMatchedTypes();
          if(this.drag==true){
            this.cgetMatchedTypes();

          }
          this.current_address = results[0].formatted_address;
          this.current_formatted_address = results[2].formatted_address;

        }
        else {
          //window.alert('No results found');
          Swal.fire(
            'Please try again!',
            'Location not found',
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })
        }
      } else if(status === 'ERROR'){
        // window.alert('Geocoder failed due to: ' + status);
        Swal.fire(
          'Please try again!',
          'Please check the internet connection',
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })
      }else if(status === 'REQUEST_DENIED'){
        // window.alert('Geocoder failed due to: ' + status);
        Swal.fire(
          'Please try again!',
          'Please allow location access',
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })
      }else if(status === 'OVER_QUERY_LIMIT'){
        Swal.fire(
          'Please try again!',
          'Subscription exceeded.Please contact Admin',
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })
      }else{
        Swal.fire(
          'Please try again!',
          status,
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })
      }

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
public  FetchTimeOffSetupOrgID(){
  this.leaveService.FetchTimeOffSetupOrgID().subscribe(

    (data:any) => {


  if(data.length!=0){
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
   setTimeout(()=>{   this.fetchEmpLeave()  }, 500);


   }
  }else{
    this.showLeaveLogSpinner=false;
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
public fetchEmpLeave(){
  let user_info= JSON.parse(localStorage.getItem('user_info'));
// if(user_info['id']!=data[i].id){

  let postData={
"id": user_info['id'],


  }
  return this.leaveService.FetchEmployeeLeaveEmpID(postData).subscribe(
    (data:any)  => {
      // let dataObj = JSON.parse(data['token']);

    this.showLeaveLogSpinner=true;
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

    this.showLeaveLogSpinner=false;
this.FetchEmployeeLeaveAdjustmentEmpID();
              }
              else{
      this.showLeaveLogSpinner=false;

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
public cgetMatchedTypes() {
  let address_components
  if(this.cgeoCodeData.length!=0){
     address_components=this.cgeoCodeData['address_components']

  }
  console.log('address_components',address_components)


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




   this.current_street_number = address_components[i]['short_name'];


    }
    if (types[j] === 'route') {
      this.current_route =  address_components[i]['long_name'];
    }
    // if (types[j] === 'formatted_address') {
    //   this.formatted_address =  address_components[i]['long_name'];
    // }
    if (types[j] === 'neighborhood') {
      this.current_street_number =  address_components[i]['long_name'];
    }
    if (types[j] === 'locality') {
      this.current_locality =  address_components[i]['long_name'];
    }
    if (types[j] === 'administrative_area_level_1') {
      this.current_administrative_area_level_1 =  address_components[i]['long_name'];
    }
    if (types[j] === 'administrative_area_level_2') {
      this.current_administrative_area_level_2 =  address_components[i]['long_name'];
    }
    if (types[j] === 'postal_code') {
      this.current_postal_code =  address_components[i]['long_name'];
    }
    if (types[j] === 'country') {
      this.current_country =  address_components[i]['long_name'];
    }

  }
}


    // address_component = address_components[element];




}
  public getMatchedTypes() {
    let address_components
    if(this.geoCodeData.length!=0){
       address_components=this.geoCodeData['address_components']

    }
    console.log('address_components',address_components)


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
public openStatusModal(item){

  this.taskStatus=item.status_id;
  console.log('status_name',item.status_name)

  let  user= JSON.parse(localStorage.getItem('user_info'));


    if(item.assigned_to==user['id'] || item.assigned_to=='Anyone' ){
      this.enableTaskStatus=false
    }else{
      this.enableTaskStatus=true

    }
  $('#task_status_modal').modal('show');
  this.tasktobeUpdated=item;
  this.getAllStatus();

}
public changedStatus(e: any): void {
  this.taskStatus= e.value;


}
  public AddTeamMembers(){
  this.addteamMem=true;
  console.log('teamMemberValue',this.teamMemberValue);
    if(this.teamMembers.length==0){

       if(this.teamMemberValue!='' && this.teamMemberValue!=undefined ){

            this.teamMembers.push(this.teamMemberValue)


            let teamEmpId={
              ID: this.teamMemberValue
            }
            this.empService.empDepartDesignByEmpID(teamEmpId).subscribe(

              (data:any) => {




                   this.teamMemFetchData.push({data});



              this.checkedValues()
              }
              )
            }

    }
    else{
      if(this.teamMemberValue!=''){
      if(!this.teamMembers.includes(this.teamMemberValue && this.teamMemberValue!=undefined)){
          this.teamMembers.push(this.teamMemberValue)

              // logik to create new items
              let teamEmpId={
                ID: this.teamMemberValue
              }

              this.empService.empDepartDesignByEmpID(teamEmpId).subscribe(

                (data:any) => {



                  // this.teamMemFetchData.push(data[0]);
                   this.teamMemFetchData.push({data});

                // this.empDataSource=new MatTableDataSource(data);

                 this.checkedValues()
                }
                )
              }

        }

        else if(this.teamMemberValue!=''){
          Swal.fire(
            'Error!',
             this.teamEmpName + 'has already been added.Please add other employee',
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }
    }

  }
  public AddTeams(){
  let teamsValFetchData=[]
    if(this.teams.length==0){


            this.teams.push(this.teamValue[0])


            let teamEmpId={
              ID: this.teamValue[0]
            }
            this.empService.FindEmpDepartDesignByTeamID(teamEmpId).subscribe(

              (data:any) => {

            data.forEach(element => {
              this.teamsValFetchData.push(element)
              teamsValFetchData=this.teamsValFetchData
               this.teamMemFetchData.push( element);

          });



               this.checkedValues()
              }
              )

    }
    else{
      let teamsValFetchData=[]
      this.teamValue.forEach(element => {
        if(!this.teams.includes(element)){
                 this.teams.push(element)

                 let teamEmpId={
                  ID: element
                }
                this.empService.FindEmpDepartDesignByTeamID(teamEmpId).subscribe(

                  (data:any) => {

                data.forEach(element => {
                 this.teamsValFetchData.push(element)
                 teamsValFetchData=this.teamsValFetchData;
                // this.teamMemFetchData.push(element);


              });



            const result = [];
            const map = new Map();
            for (const item of this.teamsValFetchData) {
                if(!map.has(item.id)){
                    map.set(item.id, true);    // set any value to Map
                    result.push({
                        id: item.id,
                        full_name: item.full_name,
                        employee_type_name:item.employee_type_name,
                        designation_name:item.designation_name
                    });
                }else{
                  Swal.fire(
                    'Error!',
                   item.full_name + 'has already been added.Please add other employee',
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                      //  this.router.navigate(['/dashboard']);
                    })
                }
            }

            this.teamMemFetchData=result;





                   this.checkedValues()
                  }
                  )


        }
        //    else{
        //   Swal.fire(
        //     'Error!',
        //      this.teamEmpName + 'has already been added.Please add other employee',
        //     'error'
        //   ).then(
        //     //used Arrow function here
        //     (result)=> {
        //
        //         this.router.navigate(['/dashboard']);
        //     })


        // }



      });



          }


  }
  public teamDelete(id){


    for(var i = 0;i < this.teamMemFetchData.length; i ++)
{
  if((this.teamMemFetchData[i].data?this.teamMemFetchData[i].data.id:this.teamMemFetchData[i].id) ==id)
  {
    this.teamMemFetchData.splice(i, 1);
    this.teamMembers.splice(id,1)
      //

    this.teams.splice(id,1)
//

//     if(this.teamMemFetchData[i]){
//
//       this.teams.splice(this.teamMemFetchData[i].id,1)
//
//     }
    //else{
    //   this.teamMembers.splice(this.teamMemFetchData[i].id,1)

    // }
  }
}
this.checkedValues();
  }
  public getAllCategories(){

    let categData=[
        {
      id: '1',
      text: 'Projects'
    },
    {
      id: '2',
      text: 'Complain'
    },

    {
      id: '3',
      text: 'Tasks'
    },
    {
      id: '4',
      text: 'Others'
    },]

var results=[{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
      //
    if(data){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items

        results.push({

            "id": categData[i].id,
            "text": categData[i].text
        });

      }

    }


this.deptData =results;



  }
  public changedEmpCateg(e){


    this.selectedCategText=e.value;
    if(this.selectedCategText=="1"){


    }else if(this.selectedCategText=="2"){

    }
   else{

    }


  }
  public changedEmpTask(e){
    this.selectedTaskText=e.value;
    this.taskCategValue=e.data[0].text;
    if(this.selectedTaskText=="1"){
this.selectedSubTaskData=this.data;

    }else if(this.selectedTaskText=="2"){
      this.selectedSubTaskData=this.complainData;

    }
   else{
this.selectedSubTaskData=this.data;

    }
  }

  public changedSubTask(e:any){

    // this.selecteSubTaskValue='value';
    this.selecteSubTaskValue=e.data[0].text;
    // this.showAdminTasks=true;

  }
  public changedOption(e:any){

    this.selectedText='value';
    this.systemidText=e.data[0].text;
    this.systemid=e.value;
    this.selecteOptionValue=e.value;
    this.projDesc=false;
    if (navigator)
    {
    navigator.geolocation.getCurrentPosition( pos => {
      this.currentPoslng = +pos.coords.longitude;
      this.currentPoslat = +pos.coords.latitude;
      });

    }    if(this.selectedGroupVal=='Job' && e.value){
      this.FindByProjectID(e.value)
    }else{
      this.showProjDesc=false;

    }
    // this.showAdminTasks=true;

  }
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
  public FindLocationByEntityID(val){
    //   this.AddNewSubmit=false;
    //   this.editable=true;
    // this.editTaskId=dept_id;
    // this.showTaskList=false;
    // this.showAddForm=true;
      let postData={
        ID:val
      }
      this.timeService.FindLocationByEntityID(postData).subscribe(
        (data:any)  => {
         if(data){
          this.getCurrentPoslatlng();

          this.SetPosition(data.lat,data.lang);
         }

          // this.projectForm.patchValue({

          //   project_name: data.project_name,x
          //   desc:data.project_desc,
          //   startDate:moment(data.start_date).format('L'),
          //   endDate:moment(data.end_date).format('L'),
          //   // completeDate:moment(data.completed_date).format('L'),
          //   accessControl:data.is_private==true?'is_private':'is_public'
          //  // accessControl:new FormControl('')


          // })
         // this.EmpList();
          // this.DesgnList();

        //   this.taskPriority=data.priority,
        //  this.taskStatus=data.status,
        //   this.assigneeStatus=data.assigned_empid,

        //   this.projectForm.valueChanges.subscribe(
        //     value=> {
        //
        //     }
        //  );

        //  this.projectForm.get('firstName').valueChanges.subscribe(val=>{
        //    if(data.first_name!=val){
        //

        //    }
        // })
        // this.projectForm.get('firstName')
        // .valueChanges
        // .pipe(pairwise())
        // .subscribe(([prev, next]: [any, any]) => {
        //
        //
        // });
          //this.EmpList();
         // this.departmentLeadValue=data.depart_lead_empid;
          //  let dataObj = JSON.parse(data['token']);



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

  public FindByProjectID(val){
    //   this.AddNewSubmit=false;
    //   this.editable=true;
    // this.editTaskId=dept_id;
    // this.showTaskList=false;
    // this.showAddForm=true;
      let postData={
        id:val
      }
      this.projectService.FindByProjectID(postData).subscribe(
        (data:any)  => {

         this.showProjDesc=true;
        this.project_start_date=data.start_date?data.start_date:"";
        this.project_end_date=data.end_date?data.end_date:'';
        this.project_desc=data.project_desc?data.project_desc:'';
        this.customerName=data.entityCustomer?data.entityCustomer.cst_name:'';
        this.customerPhone=data.entityCustomer?data.entityCustomer.phone:'';
    this.projectPoslat=data.entityLocation?data.entityLocation.lat:'';
    this.projectPoslng=data.entityLocation?data.entityLocation.lang:'';
    console.log(' this.projectPoslat', this.projectPoslat, this.projectPoslng)
        this.SetPosition(data.entityLocation?data.entityLocation.lat:'',data.entityLocation?data.entityLocation.lang:'');
          // this.projectForm.patchValue({

          //   project_name: data.project_name,x
          //   desc:data.project_desc,
          //   startDate:moment(data.start_date).format('L'),
          //   endDate:moment(data.end_date).format('L'),
          //   // completeDate:moment(data.completed_date).format('L'),
          //   accessControl:data.is_private==true?'is_private':'is_public'
          //  // accessControl:new FormControl('')


          // })
         // this.EmpList();
          // this.DesgnList();

        //   this.taskPriority=data.priority,
        //  this.taskStatus=data.status,
        //   this.assigneeStatus=data.assigned_empid,

        //   this.projectForm.valueChanges.subscribe(
        //     value=> {
        //
        //     }
        //  );

        //  this.projectForm.get('firstName').valueChanges.subscribe(val=>{
        //    if(data.first_name!=val){
        //

        //    }
        // })
        // this.projectForm.get('firstName')
        // .valueChanges
        // .pipe(pairwise())
        // .subscribe(([prev, next]: [any, any]) => {
        //
        //
        // });
          //this.EmpList();
         // this.departmentLeadValue=data.depart_lead_empid;
          //  let dataObj = JSON.parse(data['token']);



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
    public OffcSetPosition(projectPoslat,projectPoslang,eradius) {
      var
  contentCenter = '<span class="infowin">Center Marker </span>',
  contentA = '<span class="infowin">Marker A </span>';
console.log('OffcSetPosition',projectPoslat,projectPoslang)
console.log('currentLatitutude',this.latitude)
      var
    latLngCenter = new google.maps.LatLng(this.latitude, this.longitude),
    latLngCMarker = new google.maps.LatLng(this.latitude, this.longitude),
    latLngA = new google.maps.LatLng(projectPoslat,projectPoslang), //project loaction
    mapOptions = {
       center: latLngCenter,
       zoom: 15,
       mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 19,
        center: latLngCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false
    }),
     markerCenter = new google.maps.Marker({
        position: latLngCMarker,
        title: 'Location',
        map: map,
        draggable: false
    }),
    infoCenter = new google.maps.InfoWindow({
        content: contentCenter
    }),
    markerA = new google.maps.Marker({
        position: latLngA,
        title: 'Location',
        map: map,
        draggable: true
    }),
    infoA = new google.maps.InfoWindow({
        content: contentA
    }),
    circle = new google.maps.Circle({
        map: map,
        clickable: false,
        radius: eradius==null?200:parseInt(eradius['radius']),
        fillColor: '#fff',
        fillOpacity: .6,
        strokeColor: '#313131',
        strokeOpacity: .4,
        strokeWeight: 2,
        center:latLngCenter
    });
    console.log('latLngA',latLngA);

     // circle.bindTo('center', markerCenter, 'position');

     const nyc = new google.maps.LatLng(this.latitude, this.longitude);
     const london = new google.maps.LatLng(projectPoslat,projectPoslang);
     const distance = google.maps.geometry.spherical.computeDistanceBetween(nyc, london);
     console.log('distance',distance,eradius!=null?eradius['radius']:eradius)
      var bounds = circle.getBounds()
      //noteA = jQuery('.bool#a');
     // noteA.text(bounds.contains(latLngA));
     if(eradius==null){
       this.offcboundryContain=true;
     }
     else if(eradius!=null && eradius['is_allowed']==false){
      this.offcboundryContain=true;
    }else if(eradius!=null && eradius['is_allowed']==true){
      this.offcboundryContain=bounds.contains(latLngA)

    }
      console.log('offcboundryContain',this.offcboundryContain,eradius)
      //alert($(".bool#a").html());
  }

    public SetPosition(projectPoslat,projectPoslang) {
      var
  contentCenter = '<span class="infowin">Center Marker </span>',
  contentA = '<span class="infowin">Marker A </span>';

      var
    latLngCenter = new google.maps.LatLng(this.currentPoslat,this.currentPoslng),
    latLngCMarker = new google.maps.LatLng(this.currentPoslat,this.currentPoslng),
    latLngA = new google.maps.LatLng(projectPoslat,projectPoslang), //project loaction
    mapOptions = {
       center: latLngCenter,
       zoom: 15,
       mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 19,
        center: latLngCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false
    }),
     markerCenter = new google.maps.Marker({
        position: latLngCMarker,
        title: 'Location',
        map: map,
        draggable: false
    }),
    infoCenter = new google.maps.InfoWindow({
        content: contentCenter
    }),
    markerA = new google.maps.Marker({
        position: latLngA,
        title: 'Location',
        map: map,
        draggable: true
    }),
    infoA = new google.maps.InfoWindow({
        content: contentA
    }),
    circle = new google.maps.Circle({
        map: map,
        clickable: false,
        radius: 200,
        fillColor: '#fff',
        fillOpacity: .6,
        strokeColor: '#313131',
        strokeOpacity: .4,
        strokeWeight: 2
    });

      circle.bindTo('center', markerCenter, 'position');


      var bounds = circle.getBounds()
      //noteA = jQuery('.bool#a');
     // noteA.text(bounds.contains(latLngA));
     this.boundryContain=bounds.contains(latLngA)
     // console.log('offcboundryContain',this.boundryContain)
      //alert($(".bool#a").html());
  }
  public changedJobOption(e:any){

    this.selecteJobOptionValue=e.value;
    this.fetchActByProjectID(e.value);
    this.officetaskListValue='';
    // this.showAdminTasks=true;

  }
  public changedOfficeAct(e: any): void {

    this.officeActListValue=e.value;
    this.officeactText=e.data[0].text;

    if(e.value){
      this.showprojTask=true;

      this.GetProjTaskonActID(e.value);

    }else{
      this.showprojTask=false;

    }



  }
  public changedOfficeTask(e: any): void {

    this.officetaskListValue=e.value;
    this.officetaskText=e.data[0].text;

    let user:object={};
  if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));

  }
    if(e.value!=''){
      this.GetProjSubTaskonTaskID(e.value);

      // if( e.data[0].additional.status_id==this.openStatID){
      //   this.allowUpdateStatus=true
      // }else{
      //   this.allowUpdateStatus=false

      // }
      // if(e.data[0].additional.assigned_empid==user['id']){
      //   this.enableActTaskStatus=false;
      // }else{
      //   this.enableActTaskStatus=true
      // }
      // this.GetTop10TimesheetActivityOnTaskID(e.value);

    }else{
       this.recentTaskSel=true;

      this.projTaskDataValue='';

    }


  }
  public changedOfficeSubTask(e: any): void {
    let user:object={};
    if(localStorage.getItem('user_info')){
        user= JSON.parse(localStorage.getItem('user_info'));

    }
    this.officeSubtaskListValue=e.value;
    console.log('officeSubtaskListValue',this.officeSubtaskListValue);
    if(this.officeSubtaskListValue!='' && this.officeSubtaskListValue!='Select' && this.officeSubtaskListValue!='null'){
      this.officeSubtaskText=e.data[0].text;
      let postData={
        ID:this.officeSubtaskListValue
      }
     this.projectService.FindBySubTaskssId(postData).subscribe(

      (data:any) => {

    if(data){
    console.log('FindBySubTaskssId',data);
    this.actTaskStatusValue=data.subTasks.status_id
    if(data.subTasks.lead_id==user['id']){
      this.enableActTaskStatus=false;
    }else{
      this.enableActTaskStatus=true
    }
    if(data.subTasks.status_id==this.openStatID){
      this.allowOfficUpdateStat=true;
    }else{
      this.allowOfficUpdateStat=false;

    }
    }


      }
      )
    }


  }
  public changedProjSubTask(e: any): void {
    let user:object={};
    if(localStorage.getItem('user_info')){
        user= JSON.parse(localStorage.getItem('user_info'));

    }
    this.projSubtaskListValue=e.value;
    this.projSubtaskText=e.data.length!=0?e.data[0].text:'';
    if(e.value!=''){
     this.recentSubTaskSel=false
      // this.GetTop10TimesheetActivityOnTaskID(e.value);

    }else{
       this.recentSubTaskSel=true;

    }
    if(this.projSubtaskListValue!='' && this.projSubtaskListValue!='Select' && this.projSubtaskListValue!='null'){

    let postData={
      ID:this.projSubtaskListValue
    }
    this.projectService.FindBySubTaskssId(postData).subscribe(

      (data:any) => {

    if(data){
    console.log('FindBySubTaskssId',data);
    this.actTaskStatusValue=data.subTasks.status_id
    if(data.subTasks.lead_id==user['id']){
      this.enableActTaskStatus=false;
    }else{
      this.enableActTaskStatus=true
    }
    if(data.subTasks.status_id==this.openStatID){
      this.allowUpdateStatus=true;
    }else{
      this.allowUpdateStatus=false;

    }
    }


      }
      )
    }
  }
  public getAllDept(){
    this.deptService.getAllDept().subscribe(

      (data:any) => {


var results=[{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
      //
    if(data){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items

        results.push({

            "id": data[i].id,
            "text": data[i].dep_name
        });

      }
    }



this.deptData =results;
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
public GetTop10TimesheetActivityOnTaskID(taskId){
  let task={
    ID:taskId
  }
return this.activityService.GetTop10TimesheetActivityOnTaskID(task).subscribe(

  (data:any) => {

if(data){
this.selectedActivVal='Activity';

}

this.activityDataSource=new MatTableDataSource(data)
    this.activityDataSource.connect().next(data);
  }
  )

}
public GetTop10TimesheetAdminActivityOnGroupIDAndAdminID(groupId,adminId){
  let task={
    "GroupID": groupId ,
  "AdministrativeID":adminId
  }
return this.activityService.GetTop10TimesheetAdminActivityOnGroupIDAndAdminID(task).subscribe(

  (data:any) => {

if(data){
this.selectedActivVal='Activity';

}

this.activityDataSource=new MatTableDataSource(data)
    this.activityDataSource.connect().next(data);
  }
  )

}
  public  GetAllAdministrative() {
    var results=[]
    var results12=[]
    var adminDeptTask=[]

    this.adminService.GetAdministrativeByOrgID().subscribe(
      (data:any)  => {

    if(data.rootDepartmentObjects){

      for (var i = 0; i < data.rootDepartmentObjects.length; i++) {

       if( data.rootDepartmentObjects[i].administratives.length!=0){

        results.push({

          "id": data.rootDepartmentObjects[i].id,
          "text": data.rootDepartmentObjects[i].dept_name,
          "children": data.rootDepartmentObjects[i].administratives,

      });

       }


      }

    //         this.adminData=[{ id: '0',
    //   text: 'Admin Tasks',
    //   children: results},
    //   { id: '1',
    //   text: 'Departments',
    //   children: results12}
    //  ]




    }


this.adminData =results;


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
    //   this.deptService.getAllDept().subscribe(

    //     (data:any) => {


    //   if(data){
    //     for (var i = 0; i < data.length; i++) {
    //       // logik to create new items

    //       results12.push({

    //           "id": data[i].id,
    //           "text": data[i].dep_name
    //       });

    //     }
    //   }


    //   this.adminData=[{ id: '0',
    //   text: 'Admin Tasks',
    //   children: results},
    //   { id: '1',
    //   text: 'Departments',
    //   children: results12}
    //  ]
    //     },
    //     error  => {
    //       Swal.fire(
    //         'Error!',
    //         error,
    //         'error'
    //       ).then(
    //         (result)=> {
    //
    //         })
    //

    //     }

    //     )





      }

  public checkedValues(){
    const result = [];
    const map = new Map();
    for (const item of this.teamMemFetchData) {
        if(((!map.has(item.id)) && (!map.has(item.data && item.data.id)))){
            map.set(((item.id)|| (item.data && item.data.id)), true);    // set any value to Map
            result.push({
                id: item.data?item.data.id:item.id,
                full_name:item.data? item.data.full_name:item.full_name,
                 employee_type_name:item.data?item.data.employee_type_name:item.employee_type_name,
                 designation_name:item.data?item.data.designation_name:item.designation_name
            });
        }else{
          Swal.fire(
            'Error!',
            item.data? item.data.full_name + 'has already been added.Please add other employee':item.full_name + 'has already been added.Please add other employee',
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })
        }
    }

    this.teamMemFetchData=result;



    // this.empDataSource=new MatTableDataSource(this.teamMemFetchData)
    // this.empDataSource.connect().next(this.teamMemFetchData);
    //
if(this.teamValue.length!=0 || this.teamMembers.length!=0){

    //this.empgrid.refresh();
    let datas = new DataManager(this.teamMemFetchData);
    this.empDataSource=datas.dataSource['json']
}

  }
  selectEvent(item) {

    // do something with selected item
    this.selectedText=item.name;
    let options = $('.options');
    options.hide();


  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onChangeTaskSearch(val: string){

  }
  selectNearBy(nearbyPlace){
    this.nearbyAddress=nearbyPlace.name;
    this.searchLocVal=nearbyPlace.name;
    this.address=nearbyPlace.name;
    this.changed_address=nearbyPlace.name;

    this.getCurrentPoslatlng();

    // this.web_site = place.website;
    // this.name = place.name;

    // this.getChangedMatchedTypes()
    this.ngZone.run(() => {
      this.latitude = nearbyPlace.geometry.location.lat();
      this.longitude = nearbyPlace.geometry.location.lng();
      this.showNearbyPlaces=false;



      //set latitude, longitude and zoom


      this.projectPoslat =parseFloat(nearbyPlace.geometry.location.lat());
      this.projectPoslng = parseFloat(nearbyPlace.geometry.location.lng());
      this.SetPosition(parseFloat(nearbyPlace.geometry.location.lat()),parseFloat(nearbyPlace.geometry.location.lng()));
      this.zoom=15;
    })


    //set latitude, longitude and zoom


  }
  public onActiveValChange(val) {

    this.selectedActivGroupVal = val;
   this.typeValue='';
   this.relatedValue='';
    // this.geoCoder = new google.maps.Geocoder;
    //this.setCurrentLocation();
    if(this.selectedActivGroupVal=='Jobs')
    {
  this.teamLocAdd=false;
this.FetchAllProjectByOrgID();
this.projTaskDataValue='';

    }
    else if(this.selectedActivGroupVal=='Cases')

    {
      this.teamLocAdd=false;


      var results=[{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
      //
      if(this.complainData){
        for (var i = 0; i < this.complainData.length; i++) {
          // logik to create new items

          results.push({

              "id":this.complainData[i].id,
              "text": this.complainData[i].text
          });

          }
      }
  this.selectedActivCategData=results;

    }
    else if(this.selectedGroupVal=='Office'){
      this.fetchDataGrid();

    }
    else if(this.selectedGroupVal=='Location'){
        $.getScript('assets/js/audioTimer.js')
      this.teamCheckIn=false;
  //     this.searchElementRef.nativeElement.value=this.formatted_address;
  // console.log('formatted_address',this.formatted_address);
      this.mapsAPILoader.load().then(() => {
        //this.nearByPlaces();
         this.setCurrentLocation();
    //   this.geoCoder = new google.maps.Geocoder;
    // let nearby=new google.maps.places.PlacesService(document.createElement('div'));
    // nearby.nearbySearch({
    //   location: {lat: this.latitude, lng: this.longitude},
    //   radius: 100,

    // }, (results,status) => {
    //   if (status === google.maps.places.PlacesServiceStatus.OK) {
    //     for (var i = 0; i < results.length; i++) {
    //       // this.createMarker(results[i]);
    //
    //     }
    //   }
    //   this.nearbyPlaces=results;

    // });
    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);





      autocomplete.addListener("place_changed", () => {
        this.showMap=true;
        this.ngZone.run(() => {
          //get the place result

           let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.address = place.formatted_address;
          this.changedLocationData=place;
          this.changed_address=place.formatted_address;
          this.searchLocVal=place.formatted_address;
           this.geo_address=place.name;

          // this.web_site = place.website;
          // this.name = place.name;
          this.getCurrentPoslatlng();

          this.getChangedMatchedTypes()

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

          this.projectPoslat = place.geometry.location.lat();
          this.projectPoslng = place.geometry.location.lng();
          this.SetPosition(place.geometry.location.lat(),place.geometry.location.lng());
          this.zoom = 15;
          this.showNearbyPlaces=false;

          if(this.searchElementRef.nativeElement==''){
            this.showNearbyPlaces=true;

          }
        });
      });



    });
    }
    else if(this.selectedGroupVal=='Activity'){
      if(this.addformSubmitted && this.offcMeetingTaskValue==''){
        this.actTxt=true
      }else{
        this.actTxt=false

      }
    }


  }
public onValChange(val) {

  this.selectedGroupVal = val;
  this.selecteOptionValue='';
  this.selectedValue='';
  this.officeInput=false;
  this.manualInput=false;
  this.xpandStatus=true;
  this.homeInput=false;
 this.showMap=true;
  // this.geoCoder = new google.maps.Geocoder;
  //this.setCurrentLocation();
  if(this.selectedGroupVal=='Job')
  {
this.teamLocAdd=false;
this.FetchAllProjectByOrgID();
setTimeout(() => {
  /** spinner ends after 5 seconds */

 if(this.currentPoslat==undefined){
  Swal.fire({

    title: 'Location Access Denied',
    text: "Please turn on the location access for checkin",
    type: 'warning',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
cancelButtonText: 'CANCEL!',
}).then(
  (result) => {
//       if (result.value) {


// }
})  //         this.spinner.show();



  console.log('undefinedLOC',this.searchLocVal)

}
  }, 50);

  }
  else if(this.selectedGroupVal=='Case')

  {
    this.teamLocAdd=false;


    var results=[{ id: '', text: 'Select',additional:{teamBy:''} }]
    //
    // if(this.complainData){
    //   for (var i = 0; i < this.complainData.length; i++) {

    //     results.push({

    //         "id":this.complainData[i].id,
    //         "text": this.complainData[i].text,
    //         additional:{
    //         teamBy:this.complainData[i].prfix
    //         }
    //     });

    //     }
    // }
this.selectedCategData=results;

  }
  else if(this.selectedGroupVal=='Office'){
    this.fetchDataGrid();

  }
  else if(this.selectedGroupVal=='Location'){
      $.getScript('assets/js/audioTimer.js')
    this.teamCheckIn=false;


    this.mapsAPILoader.load().then(() => {
      //this.nearByPlaces();
  //     this.setCurrentLocation();
  //   this.geoCoder = new google.maps.Geocoder;
  // let nearby=new google.maps.places.PlacesService(document.createElement('div'));
  // nearby.nearbySearch({
  //   location: {lat: this.latitude, lng: this.longitude},
  //   radius: 100,

  // }, (results,status) => {
  //   if (status === google.maps.places.PlacesServiceStatus.OK) {
  //     for (var i = 0; i < results.length; i++) {
  //       // this.createMarker(results[i]);
  //
  //     }
  //   }
  //   this.nearbyPlaces=results;

  // });
  this.nearbyAddress=this.formatted_address;
  this.searchLocVal=this.formatted_address;
  this.searchElementRef.nativeElement.value=this.formatted_address;
  console.log('defined',this.searchElementRef.nativeElement.value,this.nearbyAddress,this.formatted_address)
  if(this.searchElementRef.nativeElement.value==='undefined'){
    this.searchLocVal='undefined';
    Swal.fire({

      title: 'Location Access Denied',
      text: "Please turn on the location access for checkin",
      type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  cancelButtonText: 'CANCEL!',
  }).then(
    (result) => {
  //       if (result.value) {


  // }
})  //         this.spinner.show();



    console.log('undefinedLOC',this.searchLocVal)

  }
  let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);





    autocomplete.addListener("place_changed", () => {
      this.showMap=true;
      this.ngZone.run(() => {
        //get the place result

         let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        this.address = place.formatted_address;
        this.changedLocationData=place;
        this.changed_address=place.formatted_address;
        this.searchLocVal=place.formatted_address;
         this.geo_address=place.name;

        // this.web_site = place.website;
        // this.name = place.name;

        this.getChangedMatchedTypes()
        this.getCurrentPoslatlng();



        this.projectPoslat =  this.latitude;
        this.projectPoslng = this.longitude ;
        this.SetPosition(place.geometry.location.lat(),place.geometry.location.lng());
        //set latitude, longitude and zoom
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.zoom = 15;
        this.showNearbyPlaces=false;

        if(this.searchElementRef.nativeElement==''){
          this.showNearbyPlaces=true;

        }

      });
    });



  });
  }


}
public nearByPlaces(){

   // this.setCurrentLocation();
// let nearbyplaces= new google.maps.places.PlacesService(map);
  this.geoCoder = new google.maps.Geocoder;
let nearby=new google.maps.places.PlacesService(document.createElement('div'));
nearby.nearbySearch({
  location: {lat: this.latitude, lng: this.longitude},
  radius: 5000,



}, (results,status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      // this.createMarker(results[i]);
    }
  }
  this.nearbyPlaces=results;

});



}
public onSearchChange(){

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
  this.searchLocVal='';

  this.mapsAPILoader.load().then(() => {
    this.nearByPlaces();
   });

}
manualInputChange(event){

 this.manualInputValue=event.target.value;

//  if( event.target.value=='' ){

//  }


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
public checkIsTeam(e:any){

  if(e.srcElement.checked) {
    this.teamAdd=true;
    this.EmpList();

  }else{
    this.teamAdd=false;

  }

}

public getNearbyPlaces(position) {
  let request = {
  location: position,
  rankBy: google.maps.places.RankBy.DISTANCE,
  keyword: 'sushi'
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {


  });
}

// Handle the results (up to 20) of the Nearby Search
public nearbyCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {

  // createMarkers(results);
  }
}
public checkIsLocationTeam(){
  this.teamLocAdd=!this.teamLocAdd;
  if(this.teamLocAdd){
    this.EmpList();
  }
}
  onFocused(e){
    // do something when input is focused
  }

public showRow(){

  this.expandRow=true;
}
public changedTeamMember(e: any): void {
  this.teamMemberValue=e.value;
  console.log('e',e.data)
  if(e.value!='' && e.data.length!=0){
  this.teamEmpName=e.data[0].text;
  }
}
public FetchEmployeeLeaveAdjustmentEmpID(){
  let user_info= JSON.parse(localStorage.getItem('user_info'));
  let postData={
    id: user_info['id'],

    }

        return this.leaveService.FetchEmployeeLeaveAdjustmentEmpID(postData).subscribe(
          (data:any)  => {

           if(data!=null){
            //  this.adjustedBalance=data.adjustment;

             this.adjustedBalance=data.adjustment;
              this.earned_remaining=this.earnedLeaves-data.adjustment-this.earned_used_leaves;

                     }else{
                      this.adjustedBalance=0;
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


      constructor(@Inject(FormBuilder)  public fb: FormBuilder,private leadService:LeadService,  private countupTimerService: CountupTimerService,private spinner: NgxSpinnerService,private leaveService:LeaveService,
  private adminService:AdministrativeService, private mapsAPILoader: MapsAPILoader,private activityService:ActivityService,
  private ngZone: NgZone,private orgService:OrganizationService,private qtnService:QuotationService,private costService: CostService, private userService:UserService, private empService:EmployeeService,private projectService:ProjectService,private deptService:DepartmentService, private desgnService:DesignationService, private vcr: ViewContainerRef,private teamService:TeamService, private formBuilder: FormBuilder,private toastr: ToastrService,private timeService:TimeSheetService,public taskService:TaskService, public router: Router,
  private renderer: Renderer2,private notifyService:NotificationService, public histSer: HistoryService
 )

 {
  this.sliderForm = this.fb.group({
    'slider': [0, Validators.min(10)]
  });

  // let cdate = new Date();
  // cdate.setHours(cdate.getHours() - 2);
  // this.countupTimerService.startTimer(cdate);
  this.loadscript();
    this.renderer.listen('window', 'click',(e:Event)=>{
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
     if(this.selectedGroupVal=='Location' && this.showNearbyPlaces && e.target !== this.searchElementRef.nativeElement && e.target!==this.nearbyContainer.nativeElement){
         this.showNearbyPlaces=false;
     }
  });





}

public checkIsDept(){
  this.filterEmpByDept=!this.filterEmpByDept
  if(this.filterEmpByDept){
    this.getAllDept();

    $('#toggleDesgnCheck').attr("disabled","disabled");
    $('#toggleCheckinDesgnCheck').attr("disabled","disabled");
    $('#toggleFreeLanCheck').attr("disabled","disabled");
    $('#toggleCheckinFreeLanCheck').attr("disabled","disabled");
    $('#toggleOutSourceCheck').attr("disabled","disabled");
    $('#toggleCheckinOutSourceCheck').attr("disabled","disabled");
  }else{
    this.EmpList();
    $('#toggleDesgnCheck').removeAttr('disabled');
    $('#toggleCheckinDesgnCheck').removeAttr('disabled');
    $('#toggleFreeLanCheck').removeAttr('disabled');
    $('#toggleCheckinFreeLanCheck').removeAttr('disabled');
    $('#toggleOutSourceCheck').removeAttr('disabled');
    $('#toggleCheckinOutSourceCheck').removeAttr('disabled');

  }
 }
 public checkIsDesgn(){
  this.filterEmpByDesgn=!this.filterEmpByDesgn

  if(this.filterEmpByDesgn){
    this.getAllDesignationByOrgID();
    $('#toggleDeptCheck').attr("disabled","disabled");
    $('#toggleCheckinDeptCheck').attr("disabled","disabled");
    $('#toggleFreeLanCheck').attr("disabled","disabled");
    $('#toggleCheckinFreeLanCheck').attr("disabled","disabled");
    $('#toggleOutSourceCheck').attr("disabled","disabled");
    $('#toggleCheckinOutSourceCheck').attr("disabled","disabled");
  }else{
    this.EmpList();

    $('#toggleDeptCheck').removeAttr('disabled');
    $('#toggleCheckinDeptCheck').removeAttr('disabled');
    $('#toggleFreeLanCheck').removeAttr('disabled');
    $('#toggleCheckinFreeLanCheck').removeAttr('disabled');
    $('#toggleOutSourceCheck').removeAttr('disabled');
    $('#toggleCheckinOutSourceCheck').removeAttr('disabled');

  }
 }
 public checkIsFreeLan(){
  this.filterEmpByFreeLanc=!this.filterEmpByFreeLanc
  if(this.filterEmpByFreeLanc){
    this.EmpList();

    $('#toggleDeptCheck').attr("disabled","disabled");
    $('#toggleCheckinDeptCheck').attr("disabled","disabled");
    $('#toggleDesgnCheck').attr("disabled","disabled");
    $('#toggleCheckinDesgnCheck').attr("disabled","disabled");
    $('#toggleOutSourceCheck').attr("disabled","disabled");
    $('#toggleCheckinOutSourceCheck').attr("disabled","disabled");
  }else{
    this.EmpList();

    $('#toggleDeptCheck').removeAttr('disabled');
    $('#toggleCheckinDeptCheck').removeAttr('disabled');
    $('#toggleDesgnCheck').removeAttr('disabled');
    $('#toggleCheckinDesgnCheck').removeAttr('disabled');
    $('#toggleOutSourceCheck').removeAttr('disabled');
    $('#toggleCheckinOutSourceCheck').removeAttr('disabled');

  }
 }
 public checkIsOutsource(){
  this.filterEmpByOutsource=!this.filterEmpByOutsource
  if(this.filterEmpByOutsource){
    this.EmpList();

    $('#toggleDeptCheck').attr("disabled","disabled");
    $('#toggleCheckinDeptCheck').attr("disabled","disabled");
    $('#toggleFreeLanCheck').attr("disabled","disabled");
    $('#toggleCheckinFreeLanCheck').attr("disabled","disabled");
    $('#toggleDesgnCheck').attr("disabled","disabled");
    $('#toggleCheckinDesgnCheck').attr("disabled","disabled");
  }else{
    this.EmpList();

    $('#toggleDeptCheck').removeAttr('disabled');
    $('#toggleCheckinDeptCheck').removeAttr('disabled');
    $('#toggleFreeLanCheck').removeAttr('disabled');
    $('#toggleCheckinFreeLanCheck').removeAttr('disabled');
    $('#toggleDesgnCheck').removeAttr('disabled');
    $('#toggleCheckinDesgnCheck').removeAttr('disabled');

  }
 }
public onEmpListByChange(val){
this.deptEmpValue='';
this.desgnEmpValue='';
this.teamMembersData=[];
  if(val=="Department"){
    this.filterEmpByDept=true
    this.filterEmpByDesgn=false
    this.filterEmpByFreeLanc=false
    this.filterEmpByOutsource=false;
    this.teamMemberValue='';
    this.getAllDept();


  }
  else if (val=="Designation"){
    this.filterEmpByDesgn=true
    this.filterEmpByDept=false;
    this.filterEmpByFreeLanc=false
    this.filterEmpByOutsource=false;
    this.getAllDesignationByOrgID();
    this.teamMemberValue='';


  }
  else if (val=="Freelance"){
    this.filterEmpByDesgn=false
    this.filterEmpByDept=false
this.filterEmpByFreeLanc=true
this.filterEmpByOutsource=false
this.teamMemberValue='';

this.EmpList();

  }
  else{
    this.filterEmpByDesgn=false
    this.filterEmpByDept=false
    this.filterEmpByFreeLanc=false
this.filterEmpByOutsource=true;
this.teamMemberValue='';

this.EmpList();

  }


}

 public changedDept(e: any): void {
  this.deptValue= e.value;



}
changedRelatedData(e: any): void {
  this.relatedValue= e.value;
 console.log('relatedValue',this.relatedValue);
  this.spinner.show();
  if(e.data[0].text=='Lead'){
    this.leadService.GetAllLeadByOrgID().subscribe(
      (data:any)  => {
  this.spinner.hide();

  this.typeName="Lead"
        //  let dataObj = JSON.parse(data['token']);
      let leadStatus=[{"id": '',
      "text": 'Select'}];

      for(var i=0;i<data.length;i++){
        if(data[i].lead_status!='Lost Lead'){
          leadStatus.push({
            "id": data[i].id,
            "text": data[i].lead_name
          })
        }
      }


this.typeData=leadStatus;
this.leadSourceData=data;
this.relatedSearchToolbar = ['Search'];
this.initialSort = {
  columns: [{ field: 'deal_name', direction: 'Ascending' },
  { field: 'email', direction: 'Descending' }]
};


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
  else if(e.data[0].text=='Estimation'){
      this.costService.FetchAllCostProjectByOrgID().subscribe(
        (data:any)  => {
  this.spinner.hide();

    this.typeName="Estimation"
          //  let dataObj = JSON.parse(data['token']);
        let leadStatus=[{"id": '',
        "text": 'Select'}];

        for(var i=0;i<data.length;i++){
            leadStatus.push({
              "id": data[i].project_id,
              "text": data[i].project_name
            })
        }


  this.typeData=leadStatus;
  this.estSourceData=data;
this.relatedSearchToolbar = ['Search'];

  this.initialSort = {
    columns: [{ field: 'project_name', direction: 'Ascending' },
   ]
  };

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
    }else if(e.data[0].text=='Quotation'){
      this.qtnService.GetAllQuotationByOrgID().subscribe(
        (data:any)  => {
  this.spinner.hide();

    this.typeName="Quotation"
          //  let dataObj = JSON.parse(data['token']);
        let leadStatus=[{"id": '',
        "text": 'Select'}];

        for(var i=0;i<data.length;i++){
            leadStatus.push({
              "id": data[i].id,
              "text": data[i].project_name
            })
        }


  this.typeData=leadStatus;
  this.qtnSourceData=data;
  this.relatedSearchToolbar = ['Search'];

    this.initialSort = {
      columns: [{ field: 'project_name', direction: 'Ascending' },
     ]
    };
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
    }else if(e.data[0].text=='Project'){
      this.projectService.FetchAllProjectByEmpID().subscribe(
        (data:any)  => {
  this.spinner.hide();

    this.typeName="Project"
          //  let dataObj = JSON.parse(data['token']);
        let leadStatus=[{"id": '',
        "text": 'Select'}];

        for(var i=0;i<data.length;i++){
            leadStatus.push({
              "id": data[i].project_id,
              "text": data[i].project_name
            })
        }


  this.typeData=leadStatus;
  this.projSourceData=data;
  this.relatedSearchToolbar = ['Search'];

    this.initialSort = {
      columns: [{ field: 'project_name', direction: 'Ascending' },
      { field: 'project_status_name', direction: 'Descending' }]
    };

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
    }else{

      this.spinner.hide();
    }


}

changedType(e){
  this.typeValue=e.value;
  this.projectId=e.value;
}
public getAllDesignationByOrgID(){
  this.desgnService.getAllDesignationByOrgID().subscribe(

    (data:any) => {


var results=[{ id: '', text: 'Select' }]
      // let dataObj = JSON.parse(data['token']);
    //
    if(data){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items

        results.push({

            "id": data[i].id,
            "text": data[i].designation_name
        });

        }
    }

this.desgnData =results;


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

public changedEmpDept(e: any): void {
  this.deptEmpValue=e.value;

  if(e.value){
    this.EmpList();
  }


}
public changedEmpDesgn(e: any): void {
  this.desgnEmpValue=e.value;
  if(e.value){
    this.EmpList();
  }


}
 public  EmpList(){
  if(this.filterEmpByDept){
    let deptId={
      ID:this.deptEmpValue
    }
    this.empService.getEmpByDeptID(deptId).subscribe(

      (data:any) => {


var results=[{ id: '', text: 'Select' }]
  if(data){
    for (var i = 0; i < data.length; i++) {

      results.push({

          "id": data[i].id,
          "text": data[i].full_name
      });

    }
  }



this.teamMembersData =results;
// this.teamLeadData=results;
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
  else if(this.filterEmpByDesgn){
    let desgnId={
      ID:this.desgnEmpValue
    }
    this.empService.getEmpByDesgnID(desgnId).subscribe(

      (data:any) => {


var results=[{ id: '', text: 'Select' }]
  if(data){
    for (var i = 0; i <data.length; i++) {

      results.push({

          "id": data[i].id,
          "text": data[i].full_name
      });

    }
  }



this.teamMembersData =results;
// this.teamLeadData=results;
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
  else if(this.filterEmpByFreeLanc){

    this.empService.getAllFreelancerEmpByOrgID().subscribe(

      (data:any) => {


var results=[{ id: '', text: 'Select' }]
  if(data){
    for (var i = 0; i < data.length; i++) {

      results.push({

          "id": data[i].id,
          "text": data[i].full_name
      });

    }
  }



this.teamMembersData =results;
// this.teamLeadData=results;
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
  else if(this.filterEmpByOutsource){

    this.empService.getAllOutsourcedEmpByOrgID().subscribe(

      (data:any) => {


var results=[{ id: '', text: 'Select' }]
  if(data){
    for (var i = 0; i < data.length; i++) {

      results.push({

          "id": data[i].id,
          "text": data[i].full_name
      });

    }

  }


this.teamMembersData =results;
// this.teamLeadData=results;
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
  else{

    this.empService.getEmployeeByOrgId().subscribe(

      (data:any) => {


var results=[{ id: '', text: 'Select' }]
if(data){
  for (var i = 0; i < data.length; i++) {

    results.push({

        "id": data[i].id,
        "text": data[i].full_name
    });

  }

}



this.teamMembersData =results;
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

      }
      public AllActivities(){
        sessionStorage.removeItem('workforceDate');
        localStorage.removeItem('ActivityEmpID');
        this.router.navigate(['/activities-emp']);
              //  this.router.navigate(['/activities']);

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

      public  GetTimesheetActivityByGroupAndProjectID(element) {

        let postData={
          GroupID: element.timesheetProjectCategoryDataModel.groupid,
          ProjectID: element.timesheetProjectCategoryDataModel.project_or_comp_id,
          Date: element.timesheetDataModels[0].ondate

        }
        this.timeService.GetTimesheetActivityByGroupAndProjectID(postData).subscribe(
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
      public closeViewModal(){
        $('#activity_view_modal').modal('hide');

      }
public getAllTimeLog(){
  this.timeService.getAllTimeLog().subscribe(

    (data:any) => {



      // let dataObj = JSON.parse(data['token']);
    //

// for (var i = 0; i < data.length; i++) {
//     // logik to create new items

//     this.employeeType.push({
//         "id": data[i].id,
//         "text": data[i].first_name
//     });

// }
    // this.employeeList.push(data);
    this.dataSource = data;
    this.dataSource.forEach(function (element) {
      element['names']  =[  {name: 'Sazid'},
      {name: 'Hifza K'},
      {name: 'Jacob'},
      {name: 'Nick'},{name: 'Sazid'},
      {name: 'Hifza K'},
      {name: 'Jacob'},
      {name: 'Nick'}
     ] ;
    });

    const rows = [];
    if(this.dataSource.length!=0){
      this.dataSource.forEach(element => rows.push(element, { detailRow: true, element }));

    }

    return of(rows);

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
    public OnClose(){
      this.closeBtn.nativeElement.click();
      this.getAllTimeLog();
      // $("#checkin_log_modal").reload();
      this.selectedVal='';
      this.projDesc=false;
      this.showProjDesc=false;
      this.selectedGroupVal='empty';
      this.searchElementRef.nativeElement.value='';
      this.setCurrentLocation();
      this.systemidText='';
  this.othersDataValue= '';
  this.showAdminTasks=false;
  this.groupModel=null;
  this.locationModel=null;
  $('#toggleAdminCheck').prop('checked',false);
  $('#isTeam').prop('checked',false);
  $('#homeCheck').prop('checked',false);
  if(this.teamAdd){
    this.resetAddedTeams();

  }
  //  this.teamAdd=false;
  //  $("#checkin_log_modal").addClass('hide_block');
  //  $("#checkin_log_modal").modal("hide");


    }
    public resetAddedTeams(){
      this.teamValue=[];
      this.showProjDesc=false;

      this.filterEmpByDept=false;
      this.filterEmpByDesgn=false;
      this.teamMemberValue='';
    this.teamMembers=[];
    this.selectedDeptVal='';
    this.nearbyAddress='';
    this.teamMemFetchData=[];
    this.teams=[];
    // this.empDataSource=new MatTableDataSource(this.teamMemFetchData)
    // this.empDataSource.connect().next(this.teamMemFetchData);
if(this.teamMembers.length!=0||this.teamValue.length!=0){
    //this.empgrid.refresh();
    let datas = new DataManager(this.teamMemFetchData);
    this.empDataSource=datas.dataSource['json']
}
    }
    public OnTimeLogClose(){
      this.activModel=null;
      this.showSlider=false;
      this.selectedActivGroupVal='empty';
      this.selecteOptionValue='';
      $('#activityInput').value='';
      this.OfficeLogForm.reset();
      this.OfficeLogForm.patchValue({
            startTime:null,
            endTime:null
          });
      this.addformSubmitted=false;
      this.AdminTaskValue='';
      this.projTaskDataValue='';
      this.selecteJobOptionValue='';
      this.officeActListValue='';
      this.meetingTaskValue='';
      this.officeSubtaskListValue='';
this.relatedValue='';
      $("#officeActivityInput").val("");
    $("#time_log_modal").modal('hide');
    this.offcStartEqualEnd=false;
    this.showPurposeTasks=false;
    this.showActivityTasks=false;
    $('#adminActivity').removeAttr('disabled');
    $('#taskField').removeAttr('disabled');

    $('#adminActivity').prop('checked', false);
    $('#taskField').prop('checked', false);

      this.timeLogForm.reset();
      this.sliderForm.reset();
      this.sub_taskId='';
      this.typeValue='';
      this.timeLogBtn.nativeElement.click();

      this.errorTimeExccedOne = false;
      this.OfficeLogForm.get('radioOption').disable()
    }
    public OnCloseStatusModal(){
      $("#task_status_modal").modal("hide");

    }

    public toggleTeamSwitch(){
      $('#toggleCheck').prop('checked',false);
       $('#toggleCheck').attr('checked', false);
      // $('#myCheckbox').prop('checked', false);
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
    if(data[i].status_name=='In Progress'){
      this.inProgressStatID= data[i].id
          }
          if(data[i].status_name=='Open'){
            this.openStatID= data[i].id
                }
                if(data[i].status_name=='Completed'){
                  this.completedStatID= data[i].id
                      }
    //}
//     else{

//
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
public checkIsAdmin(e:any){
  if(e.srcElement.checked) {
  // this.selectedCategText="empty"
  this.showAdminTasks=true;

  this.selectedVal='';
  this.selectedGroupVal='empty';
  this.systemidText='';
  this.othersDataValue= '';
  $('#isTeam').prop('checked',false);



  }else{
    this.showAdminTasks=false;

  }


}


public showProjTask(e:any){
  if(e.srcElement.checked) {
  this.showProjBasedTasks=true;
  // this.GetAllTaskByEmpID();
  this.getalltaskbyJob(this.jobFilterValue,'job');


  }else{
    this.showProjBasedTasks=false;
    // this.GetAllTaskByEmpID();
    this.getalltaskbyJob(this.jobFilterValue,'job');
  }


}
public checkIsTask(e:any){
  if(e.srcElement.checked) {
  // this.selectedCategText="empty"

    this.actTxt=false

  this.showActivityTasks=true;

  // this.selectedVal='';
  // this.selectedGroupVal='empty';
  // this.systemidText='';
  // this.othersDataValue= '';
  $('#adminActivity').prop('disabled',true);

  let slider: Slider = new Slider();

  // Render initialized Slider
  slider.appendTo('#slider1');
  this.relatedValue='';
  this.typeValue='';

  }else{
    this.showActivityTasks=false;
    $('#adminActivity').removeAttr('disabled');
    if(this.addformSubmitted && this.officeActInputValue==''){
      this.actTxt=true
    }else{
      this.actTxt=false

    }
  }


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
  // this.GetAllTaskByEmpID();
  if(this.jobFilterValue!='')
  {
  this.getalltaskbyJob(this.jobFilterValue,'job');
  }else{
    this.GetAllTaskByEmpID();
  }
  $('#task_status_modal').modal('hide');


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
public checkIsOffice(e:any){
  if(e.srcElement.checked){
    this.officeInput=true;
    this.xpandStatus=false;
    var results=[]
    this.FindAllOrgByHeadOrgID();
    // let dataObj = JSON.parse(data['token']);
  //
  // if(this.orgList){
  //   for (var i = 0; i < this.orgList.length; i++) {
  //     // logik to create new items
  //     if(this.orgList[i].org_id==localStorage.getItem('org_id')){
  //       this.selecteOptionValue=this.orgList[i].org_name;
  //        this.selectedValue=this.orgList[i].org_name;

  //       this.checkOptionValue=true;
  //     }



  //     }
  //
  //   this.officeData=this.orgList;

  // }
// this.officeData=results;
    $('#ManualCheck').prop('disabled',true);
    $('#homeCheck').prop('disabled',true);

    this.nearbyAddress= '';

  }else{
    this.officeInput=false;

    $('#ManualCheck').removeAttr('disabled');
    $('#homeCheck').removeAttr('disabled');
    this.nearbyAddress=this.formatted_address;
    this.searchLocVal=this.formatted_address;
    this.searchElementRef.nativeElement.value=this.formatted_address;


  }



}
public checkIsPurpose(e:any){
  if(e.srcElement.checked) {
  // this.selectedCategText="empty"
  this.addOfficAdminAct=true;
  this.showPurposeTasks=true;
// this.GetAllAdministrative();
  $('#taskField').prop('disabled',true);



  }else{
  this.addOfficAdminAct=false;

    this.showPurposeTasks=false;
  $('#taskField').removeAttr('disabled');


  }


}
checkIsMeetingActivity(e:any){
  if(e.srcElement.checked) {
  // this.selectedCategText="empty"

this.showMeetingAct=true;

  }else{

    this.showMeetingAct=false;

  }


}
onSearchBlur(){
  this.showNearbyPlaces=false
}
public checkIsManual(e:any){

  // this.manualInput=!this.manualInput
  if(e.srcElement.checked){
    this.manualInput=true;
    this.nearbyAddress= '';

    $('#OfficeCheck').prop('disabled',true);
    $('#homeCheck').prop('disabled',true);


  }else{
    this.manualInput=false;

    $('#OfficeCheck').removeAttr('disabled');
    $('#homeCheck').removeAttr('disabled');
this.manualInputValue=""
this.nearbyAddress=this.formatted_address;
this.searchLocVal=this.formatted_address;
this.searchElementRef.nativeElement.value=this.formatted_address;

  }



}
public checkIsHome(e:any){

  // this.manualInput=!this.manualInput
  if(e.srcElement.checked){
    this.homeInput=true;
    $('#ManualCheck').prop('disabled',true);
    $('#OfficeCheck').prop('disabled',true);
    this.showMap=false;
    console.log('this.formatted_address',this.formatted_address)


setTimeout(() => {
  /** spinner ends after 5 seconds */
  this.nearbyAddress=this.formatted_address;
  this.searchLocVal=this.formatted_address;
  this.searchElementRef.nativeElement.value=this.formatted_address;
  if(this.searchElementRef.nativeElement.value==='undefined'){
    this.searchLocVal='undefined';
    Swal.fire({

      title: 'Location Access Denied',
      text: "Please turn on the location access for checkin",
      type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  cancelButtonText: 'CANCEL!',
  }).then(
    (result) => {
  //       if (result.value) {
  //         this.spinner.show();



  // }
})

    console.log('undefinedLOC',this.searchLocVal)

  }
}, 500);


this.boundryContain=true;
  }else{
this.boundryContain=false;

    this.homeInput=false;
    this.nearbyAddress= '';
    this.searchLocVal= '';
    this.showMap=true;

    this.searchElementRef.nativeElement.value=''

    $('#ManualCheck').removeAttr('disabled');
    $('#OfficeCheck').removeAttr('disabled');
this.homeInputValue=""
this.nearbyAddress=this.formatted_address;
this.searchLocVal=this.formatted_address;
this.searchElementRef.nativeElement.value=this.formatted_address;
if(this.searchElementRef.nativeElement.value==='undefined'){
  this.searchLocVal='undefined';
  Swal.fire({

    title: 'Location Access Denied',
    text: "Please turn on the location access for checkin",
    type: 'warning',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
cancelButtonText: 'CANCEL!',
}).then(
  (result) => {
//       if (result.value) {
//         this.spinner.show();



// }
})

  console.log('undefinedLOC',this.searchLocVal)

}

  }



}
public closeMap(){
  this.showMap=!this.showMap
}
public checkIsTrack(){
  this.onTrack=!this.onTrack;
}
public openModal(){

  this.FindTeamsByOrgID();
  this.getAllDesignationByOrgID();
  this.getAllOutsourcedEmpByOrgID();
  this.EmpList();

}
public fetchDataGrid(){

  this.taskService.fetchGridDataByTaskEmpID().subscribe(
    (data:any)  => {
      let completedTasks=[]
      let openTasks=[]
      let inProgrssTasks=[]

      var results=[{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
      //
      if(data){
        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          results.push({

            "id": data[i].id,
            "text": data[i].task_name
        });
          if(data[i].status_name=="Completed"){


            completedTasks.push(data[i]);
          }
          else if(data[i].status_name=="Open"){
            openTasks.push(data[i]);


          }else{
            inProgrssTasks.push(data[i]);
          }
        this.taskCompletedList=completedTasks;
        this.taskOpenList=openTasks;

        this.taskInProgressList=inProgrssTasks;
       this.tasksList=results;




      }
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
this.selectedCategData=results;

    }
    )

}
getalltaskbyJob(id,type){
  this.spinner.show();
  let postData={
    "projectID": this.jobFilterValue!=''?this.jobFilterValue:null,
  "milestoneID":  this.activityFilterValue!=''?this.activityFilterValue:null,
  "taskID":  this.taskFilterValue!=''?this.taskFilterValue:null
  }
  this.taskService.GetAllTaskByEmpIDAndProjectIDAndMilestoneIDAndTaskID(postData).subscribe(
    (data:any)  => {
      let completedTasks=[]
      let openTasks=[]
      let inProgrssTasks=[]

      var results=[{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
      //
      if(data){
  this.spinner.hide();

        for (var i = 0; i < data.employeeTasks.length; i++) {
          // logik to create new items
          results.push({

            "id": data.employeeTasks[i].id,
            "text": data.employeeTasks[i].task_name
        });
          if(data.employeeTasks[i].status_name=="Completed"){
            completedTasks.push(data.employeeTasks[i]);
          }
          else if(data.employeeTasks[i].status_name=="Open"){
            openTasks.push(data.employeeTasks[i]);
          }else{
            inProgrssTasks.push(data.employeeTasks[i]);
           }

      }

      this.taskCompletedList=completedTasks;
      // this.taskOpenList=openTasks;
      this.taskInProgressList=inProgrssTasks;
     this.tasksList=results;
     let localemployeeTasks=[];
     let localassignedEmployeeTasks=[];
     let localoverDueTasks=[];
     let localOpenTasks=[];
     let localCompletedTasks=[];
     let projemployeeTasks=[];
     let projassignedEmployeeTasks=[];
     let projoverDueTasks=[];
     let projOpenTasks=[];
     let projCompletedTasks=[];


     for(var i=0;i<data.employeeTasks.length;i++){
       if(data['employeeTasks'][i]['is_local_activity']=='True'){
         if(data['employeeTasks'][i].status_name!="Completed"){
          localemployeeTasks.push(data['employeeTasks'][i])

         }
       }else{
        if(data['employeeTasks'][i].status_name!="Completed"){
        projemployeeTasks.push(data['employeeTasks'][i])
        }
       }
      //  if(data['employeeTasks'][i].status_name=="Open" && data['employeeTasks'][i]['is_local_activity']=='True'){
      //   localOpenTasks.push(data['employeeTasks'][i]);
      // }else{
      //   projOpenTasks.push(data['employeeTasks'][i]);

      // }
    }

     for(var i=0;i<data.assignedEmployeeTasks.length;i++){

       if(data['assignedEmployeeTasks'][i]['is_local_activity']=='True'){
        if(data['assignedEmployeeTasks'][i].status_name!="Completed"){

        localassignedEmployeeTasks.push(data['assignedEmployeeTasks'][i])
        }
       }else{
        if(data['assignedEmployeeTasks'][i].status_name!="Completed"){

        projassignedEmployeeTasks.push(data['assignedEmployeeTasks'][i])
        }
       }
      }
     for(var i=0;i<data.overDueTasks.length;i++){

       if(data['overDueTasks'][i]['is_local_activity']=='True'){
        if(data['overDueTasks'][i].status_name!="Completed"){

        localoverDueTasks.push(data['overDueTasks'][i])
        }
       }else{
        if(data['overDueTasks'][i].status_name!="Completed"){

        projoverDueTasks.push(data['overDueTasks'][i])
        }
       }


     }
     for(var i=0;i<this.taskCompletedList.length;i++){

      if(this.taskCompletedList[i]['is_local_activity']=='True'){
        localCompletedTasks.push(this.taskCompletedList[i])
      }else{
        projCompletedTasks.push(this.taskCompletedList[i])

      }
     }
     for(var i=0;i<openTasks.length;i++){

      if(openTasks[i]['is_local_activity']=='True'){
        localOpenTasks.push(openTasks[i])
      }else{
        projOpenTasks.push(openTasks[i])

      }
     }



    if(this.showProjBasedTasks){
      this.employeeTasksList=projemployeeTasks;
      this.assignedToList=projassignedEmployeeTasks;
      this.overDueList=projoverDueTasks;
      this.taskOpenList=projOpenTasks;
      this.completedList=projCompletedTasks;

    }else{
      this.employeeTasksList=localemployeeTasks;
      this.assignedToList=localassignedEmployeeTasks;
      this.overDueList=localoverDueTasks;
      this.taskOpenList=localOpenTasks;
      this.completedList=localCompletedTasks;

    }

    }




//      var results=[{ id: '', text: 'Select' }]
//    if(data){
//     for (var i = 0; i < data.length; i++) {
//       // logik to create new items

//       results.push({
//          "id": data[i].id,
//          "text": data[i].task_name
//       });

//       }
//    }

// this.tasks=results;
// this.selectedCategData=results;



    }


    )
}
public GetAllTaskByEmpID(){
  this.spinner.show();
  this.taskService.GetAllTaskByEmpID().subscribe(
    (data:any)  => {
      let completedTasks=[]
      let openTasks=[]
      let inProgrssTasks=[]

      var results=[{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
      //
      if(data){
  this.spinner.hide();

        for (var i = 0; i < data.employeeTasks.length; i++) {
          // logik to create new items
          results.push({

            "id": data.employeeTasks[i].id,
            "text": data.employeeTasks[i].task_name
        });
          if(data.employeeTasks[i].status_name=="Completed"){
            completedTasks.push(data.employeeTasks[i]);
          }
          else if(data.employeeTasks[i].status_name=="Open"){
            openTasks.push(data.employeeTasks[i]);
          }else{
            inProgrssTasks.push(data.employeeTasks[i]);
           }

      }

      this.taskCompletedList=completedTasks;
      // this.taskOpenList=openTasks;
      this.taskInProgressList=inProgrssTasks;
     this.tasksList=results;
     let localemployeeTasks=[];
     let localassignedEmployeeTasks=[];
     let localoverDueTasks=[];
     let localOpenTasks=[];
     let localCompletedTasks=[];
     let projemployeeTasks=[];
     let projassignedEmployeeTasks=[];
     let projoverDueTasks=[];
     let projOpenTasks=[];
     let projCompletedTasks=[];


     for(var i=0;i<data.employeeTasks.length;i++){
       if(data['employeeTasks'][i]['is_local_activity']=='True'){
         if(data['employeeTasks'][i].status_name!="Completed"){
          localemployeeTasks.push(data['employeeTasks'][i])

         }
       }else{
        if(data['employeeTasks'][i].status_name!="Completed"){
        projemployeeTasks.push(data['employeeTasks'][i])
        }
       }
      //  if(data['employeeTasks'][i].status_name=="Open" && data['employeeTasks'][i]['is_local_activity']=='True'){
      //   localOpenTasks.push(data['employeeTasks'][i]);
      // }else{
      //   projOpenTasks.push(data['employeeTasks'][i]);

      // }
    }

     for(var i=0;i<data.assignedEmployeeTasks.length;i++){

       if(data['assignedEmployeeTasks'][i]['is_local_activity']=='True'){
        if(data['assignedEmployeeTasks'][i].status_name!="Completed"){

        localassignedEmployeeTasks.push(data['assignedEmployeeTasks'][i])
        }
       }else{
        if(data['assignedEmployeeTasks'][i].status_name!="Completed"){

        projassignedEmployeeTasks.push(data['assignedEmployeeTasks'][i])
        }
       }
      }
     for(var i=0;i<data.overDueTasks.length;i++){

       if(data['overDueTasks'][i]['is_local_activity']=='True'){
        if(data['overDueTasks'][i].status_name!="Completed"){

        localoverDueTasks.push(data['overDueTasks'][i])
        }
       }else{
        if(data['overDueTasks'][i].status_name!="Completed"){

        projoverDueTasks.push(data['overDueTasks'][i])
        }
       }


     }
     for(var i=0;i<this.taskCompletedList.length;i++){

      if(this.taskCompletedList[i]['is_local_activity']=='True'){
        localCompletedTasks.push(this.taskCompletedList[i])
      }else{
        projCompletedTasks.push(this.taskCompletedList[i])

      }
     }
     for(var i=0;i<openTasks.length;i++){

      if(openTasks[i]['is_local_activity']=='True'){
        localOpenTasks.push(openTasks[i])
      }else{
        projOpenTasks.push(openTasks[i])

      }
     }



    if(this.showProjBasedTasks){
      this.employeeTasksList=projemployeeTasks;
      this.assignedToList=projassignedEmployeeTasks;
      this.overDueList=projoverDueTasks;
      this.taskOpenList=projOpenTasks;
      this.completedList=projCompletedTasks;

    }else{
      this.employeeTasksList=localemployeeTasks;
      this.assignedToList=localassignedEmployeeTasks;
      this.overDueList=localoverDueTasks;
      this.taskOpenList=localOpenTasks;
      this.completedList=localCompletedTasks;

    }

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
this.selectedCategData=results;

    //  var taskwithDesc=[{ id: '', text: 'Select',additional:{assignee:'',taskDesc:'',milestone:'',dueDate:'',assigne_id:'',status_id:'',project_id:'',milestone_id:''} }]

    //  if(data){
    //   for (var i = 0; i < data.employeeTasks.length; i++) {
    //     // logik to create new items
    //      if(data['employeeTasks'][i].status_name!="Completed"){
    //     taskwithDesc.push({
    //        "id": data.employeeTasks[i].id,
    //        "text": data.employeeTasks[i].task_name,
    //        additional:{
    //          assignee:data.employeeTasks[i].assigned_name,
    //          taskDesc:data.employeeTasks[i].project_name,
    //          milestone:data.employeeTasks[i].milestone_name,
    //          dueDate:data.employeeTasks[i].due_date,
    //          assigne_id:data.employeeTasks[i].assigned_empid,
    //          status_id:data.employeeTasks[i].status_id,
    //          project_id:data.employeeTasks[i].project_id,
    //          milestone_id:data.employeeTasks[i].milestone_id,

    //         }

    //     });
    //    }
    //     }
    //     this.taskWithDesc=taskwithDesc;

    //  }

    }


    )
}
public GetAllTaskDescByEmpID(){
  this.spinner.show();
  this.taskService.GetAllTaskByEmpID().subscribe(
    (data:any)  => {


     var taskwithDesc=[{ id: '', text: 'Select',additional:{assignee:'',taskDesc:'',milestone:'',dueDate:'',assigne_id:'',status_id:'',project_id:'',milestone_id:''} }]

     if(data){
      for (var i = 0; i < data.employeeTasks.length; i++) {
        // logik to create new items
         if(data['employeeTasks'][i].status_name!="Completed"){
        taskwithDesc.push({
           "id": data.employeeTasks[i].id,
           "text": data.employeeTasks[i].task_name,
           additional:{
             assignee:data.employeeTasks[i].assigned_name,
             taskDesc:data.employeeTasks[i].project_name,
             milestone:data.employeeTasks[i].milestone_name,
             dueDate:data.employeeTasks[i].due_date,
             assigne_id:data.employeeTasks[i].assigned_empid,
             status_id:data.employeeTasks[i].status_id,
             project_id:data.employeeTasks[i].project_id,
             milestone_id:data.employeeTasks[i].milestone_id,

            }

        });
       }
        }
        this.taskWithDesc=taskwithDesc;

     }

    }


    )
}

public GetAllTaskByJobEmpID(){
  this.spinner.show();
  this.taskService.GetAllTaskByEmpID().subscribe(
    (data:any)  => {
      let completedTasks=[]
      let openTasks=[]
      let inProgrssTasks=[]

      var results=[{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
      //
      if(data){
  this.spinner.hide();


    }










     var taskwithDesc=[{ id: '', text: 'Select',additional:{assignee:'',taskDesc:'',milestone:'',dueDate:'',assigne_id:'',status_id:'',project_id:'',milestone_id:''} }]

     if(data){
      for (var i = 0; i < data.employeeTasks.length; i++) {
        // logik to create new items
         if(data['employeeTasks'][i].status_name!="Completed"){
        taskwithDesc.push({
           "id": data.employeeTasks[i].id,
           "text": data.employeeTasks[i].task_name,
           additional:{
             assignee:data.employeeTasks[i].assigned_name,
             taskDesc:data.employeeTasks[i].project_name,
             milestone:data.employeeTasks[i].milestone_name,
             dueDate:data.employeeTasks[i].due_date,
             assigne_id:data.employeeTasks[i].assigned_empid,
             status_id:data.employeeTasks[i].status_id,
             project_id:data.employeeTasks[i].project_id,
             milestone_id:data.employeeTasks[i].milestone_id,

            }

        });
       }
        }
        this.taskWithDesc=taskwithDesc;

     }

    }


    )
    //this.getalltaskbyJob(this.jobFilterValue,'job');

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
public getUsersInfo(){
this.showTimeLogSpinner=true;
  let userId={
   ID:localStorage.getItem('user_id')
  }
   this.userService.getByUserID(userId).subscribe(
     data  => {
       // let dataObj = JSON.parse(data['token']);
     // this.orgListArr=data

     if(data){
       this.orgList=data['organization'];
     }
     if(data['timesheet'].length==0){
      //localStorage.setItem('is_checkout',JSON.stringify(true))

     }
     if(data['timesheet']){
       this.teamEmpId=[]
       this.showTimeLogSpinner=false;


      this.allTimeLog=data['timesheet'];

       data['timesheet'].forEach(elementAB => {
        if(elementAB.timesheetDataModels){
          elementAB.timesheetDataModels.forEach(element => {

            if(element.is_checkout==false){
              localStorage.setItem('is_checkout',JSON.stringify(false))

              this.checkin=false;
              this.breakin=true;
              this.breakout=false;
              this.checkout=true;
              this.teamEmpId.push(element.emp_id)
             this.group_id=element.groupid;
             if(elementAB.timesheetProjectCategoryDataModel.project_type=='Job'){

              this.FindLocationByEntityID(elementAB.timesheetProjectCategoryDataModel.project_or_comp_id)

             }else if(elementAB.timesheetProjectCategoryDataModel.project_type=='Office'){

             this.FindLocationByEntityID(elementAB.timesheetProjectCategoryDataModel.project_or_comp_id)

            }else if(elementAB.timesheetProjectCategoryDataModel.project_type=='Place'){

              this.getCurrentPoslatlng();
              this.SetPosition(elementAB.timesheetSearchLocationViewModel.lat,elementAB.timesheetSearchLocationViewModel.lang);

            }else if(elementAB.timesheetProjectCategoryDataModel.project_type=='Manual'){
             this.boundryContain=true;

            }

            //
if(elementAB.timesheetSearchLocationViewModel!=null && elementAB.timesheetSearchLocationViewModel.is_office==true ){
   this.disableAddLog=false;
   this.addLogSpinner=false;

   let minTime=elementAB.timesheetDataModels[0].check_in;
   this.minOfficeActInputTime=moment(minTime).format("hh:mm a");
   this.officegroupID=elementAB.timesheetSearchLocationViewModel.groupid;

}
let minTime=elementAB.timesheetDataModels[0].check_in;
this.minOfficeActInputTime=moment(minTime).format("hh:mm a");

            }

        })}


      //  timesheetDataModels.forEach(element => {
      //    if(!element.is_checkout){
      //     this.group_id=element.groupid;

      //     return;

      //    }

});





      // this.group_id=data['timesheet'].groupid;


      this.currentCheckin=data['timesheet'].check_in;
       var ms=moment(localStorage.getItem('currentTime'),"hh:mm a").diff(moment(data['timesheet'].check_in,"hh:mm a"));
       var d = moment.duration(ms, 'milliseconds');
       var hours = Math.floor(d.asHours());
       var mins = Math.floor(d.asMinutes()) - hours * 60;

      let sec:any=hours*3600+mins*60;


      // localStorage.setItem('timeLeft',sec);
     }

  //this.OrgList(data['employee'].id);


     },
     error  => {
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
public LastCheckinByEmpID(){
  //this.showTimeLogSpinner=true;

  let  user_info= JSON.parse(localStorage.getItem('user_info'));

    let empId={
     ID:user_info['id']
    }

    this.userService.LastCheckinByEmpID(empId).subscribe(
      (data:any)  => {

      if(data.length!=0){
   //this.teamEmpId=[]

       // this.showTimeLogSpinner=false;





             if(data[0].is_checkout==false){


               this.checkin=false;
               this.breakin=true;
               this.breakout=false;
               this.checkout=true;
              //   this.teamEmpId.push(data[0].empid)
              // this.group_id=data[0].groupid;


              localStorage.setItem('is_checkout',JSON.stringify(false))
 let checkin=moment(data[0].check_in).format('hh:mm a')
 let currentTime=moment().format('hh:mm a')

              var now = moment(checkin,"hh:mm:ss a");
              var prev = moment(currentTime,"hh:mm:ss a");
              // this.time=moment().format('hh:mm a');
              let diff=JSON.stringify(prev.diff(now, 'seconds'));
              localStorage.setItem('timeLeft',diff);

              //clock timer start
              var previousVal = moment(checkin,"hh:mm:ss a");
              var currentVal = moment(currentTime,"hh:mm:ss a");
              this.clockTimerDiv = true;
              this.noClockTimerDiv = false;
              this.timerSecondsValue = currentVal.diff(previousVal, 'seconds');
              if(this.timerSecondsValue > 0)
              {
                this.timerSecondsFinalValue = this.timerSecondsValue;
              }else {
                this.timerSecondsFinalValue = 0;
              }
              //clock timer end


             }else{

              // this.teamEmpId=[]


             }







      }else{
        this.checkin=true;
        this.breakin=false;
        this.breakout=false;
        this.checkout=false;
        localStorage.setItem('is_checkout',JSON.stringify(true))
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
    ;
}
LastAddedTimesheetActivityByEmpID(){
  this.addActformSubmitted=true;
  this.isRecentActFieldValid();
  if(this.activityLogForm.get('startTime').value){
    let startTime=this.activityLogForm.get('startTime').value;
    let endTime=this.activityLogForm.get('endTime').value;
  let date=moment().format('MM/DD/YYYY');
  this.startTime=date.concat(' ' +startTime) ;
  this.endTime=date.concat(' ' +endTime) ;
  }
  console.log('LastAddedTimesheetActivityByEmpID',this.activityLogForm.get('startTime').value)
  if(this.activityLogForm.get('startTime').value!='' && this.activityLogForm.get('endTime').value!='' && this.activityLogForm.get('startTime').value!=null && this.activityLogForm.get('endTime').value!=null){
 let  user_info= JSON.parse(localStorage.getItem('user_info'));

    let empId={
  "empid": user_info['id'],
  "start_time": this.startTime,
  "end_time": this.endTime
    }
     this.timeService.LastAddedTimesheetActivityByEmpID(empId).subscribe(
       (data:any)  => {

  if(data.status=='201'){
this.timeinrange=false;
Swal.fire(
  'Error!',
  data['desc'],
  'error'
).then(
  (result)=> {

  })
  }else{
    this.timeinrange=true;
    this.onAddTimesheetActivity()

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
     ;

      }
  }
  LastAddedOffcTimesheetActivityByEmpID(){
    this.addformSubmitted=true;
    this.isOfficeFieldValid();
    let postData;
    if(this.OfficeLogForm.get('startTime').value){
      let startTime=this.OfficeLogForm.get('startTime').value;
      let endTime=this.OfficeLogForm.get('endTime').value;
    let date=moment().format('MM/DD/YYYY');
    this.startOfficTime=date.concat(' ' +startTime) ;
    this.endOfficTime=date.concat(' ' +endTime) ;

    }
    console.log('LastAddedTimesheetActivityByEmpID',this.OfficeLogForm.get('startTime').value)
    if(this.OfficeLogForm.get('startTime').value!='' && this.OfficeLogForm.get('endTime').value!='' && this.OfficeLogForm.get('startTime').value!=null && this.OfficeLogForm.get('endTime').value!=null){
   let  user_info= JSON.parse(localStorage.getItem('user_info'));

      let empId={
    "empid": user_info['id'],
    "start_time": this.startOfficTime,
    "end_time": this.endOfficTime
      }
       this.timeService.LastAddedTimesheetActivityByEmpID(empId).subscribe(
         (data:any)  => {

    if(data.status=='201'){
  this.timeinrange=false;
  Swal.fire(
    'Error!',
    data['desc'],
    'error'
  ).then(
    (result)=> {

    })
    }else{
      this.timeinrange=true;
      this.onAddOfficeTimesheetActivity()

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
       ;

        }
    }
public getTimesheetByEmpId(){
  this.showTimeLogSpinner=true;
 // this.teamEmpId=[];
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
        this.checkin=true;
        this.breakin=false;
        this.breakout=false;
        this.checkout=false;

       }
       if(data){
        //  this.teamEmpId=[]
         this.showTimeLogSpinner=false;


        this.allTimeLog=data;

         data.forEach(elementAB => {
          if(elementAB.timesheetDataModels){
            elementAB.timesheetDataModels.forEach(element => {

              if(element.is_checkout==false){
                let minsTime=elementAB.timesheetDataModels[0].check_in;
     this.minStartTime=moment(minsTime).format("hh:mm a");
// this.minStartTime=this.minOfficeActInputTime;

                if(this.checkoutByEmpId==false){
                  localStorage.setItem('is_checkout',JSON.stringify(false))
                  this.disableAddTask=false;
                 // this.checkin=false;
                  //this.breakin=true;
                  //this.breakout=false;
                 // this.checkout=true;
                 this.findLastBreakIn(element.groupid);



                }
                // this.teamEmpId.forEach(EMPID => {
                  if(!this.teamEmpId.includes(element.emp_id)){
                           this.teamEmpId.push(element.emp_id)
                  }
                // })
                // this.teamEmpId.push(element.emp_id)
               this.group_id=element.groupid;
               if(elementAB.timesheetProjectCategoryDataModel.project_type=='Job'){

                this.FindLocationByEntityID(elementAB.timesheetProjectCategoryDataModel.project_or_comp_id)

               }else if(elementAB.timesheetProjectCategoryDataModel.project_type=='Office'){

               this.FindLocationByEntityID(elementAB.timesheetProjectCategoryDataModel.project_or_comp_id)

                this.act_formatted_address=elementAB.timesheetSearchLocationViewModel.geo_address



              }else if(elementAB.timesheetProjectCategoryDataModel.project_type=='Place'){

                this.getCurrentPoslatlng();
                if(elementAB.timesheetSearchLocationViewModel.is_manual){
                         this.act_formatted_address=elementAB.timesheetSearchLocationViewModel.manual_address

                       }else{
                         this.act_formatted_address=elementAB.timesheetSearchLocationViewModel.geo_address

                       }
                this.SetPosition(elementAB.timesheetSearchLocationViewModel.lat,elementAB.timesheetSearchLocationViewModel.lang);

              }else if(elementAB.timesheetProjectCategoryDataModel.project_type=='Manual'){
               this.boundryContain=true;

              }

              //
  if(elementAB.timesheetSearchLocationViewModel!=null && elementAB.timesheetSearchLocationViewModel.is_office==true){
     this.disableAddLog=false;
     this.addLogSpinner=false;

     let minTime=elementAB.timesheetDataModels[0].check_in;
     this.minOfficeActInputTime=moment(minTime).format("hh:mm a");
     this.officegroupID=elementAB.timesheetSearchLocationViewModel.groupid;



  }

              }

          })}

          this.checkoutByEmpId=false;



  });




        // this.group_id=data['timesheet'].groupid;


        // this.currentCheckin=data['timesheet'].check_in;
        //  var ms=moment(localStorage.getItem('currentTime'),"hh:mm a").diff(moment(data['timesheet'].check_in,"hh:mm a"));
        //  var d = moment.duration(ms, 'milliseconds');
        //  var hours = Math.floor(d.asHours());
        //  var mins = Math.floor(d.asMinutes()) - hours * 60;

        // let sec:any=hours*3600+mins*60;
        //
        //
        // localStorage.setItem('timeLeft',sec);
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

public showDetailsRow(){
  this.showDetails=!this.showDetails;
}
public isCheckedIn(){
  if(this.isCheckIn){
    $('#toggleCheck').removeAttr('disabled');

  }
}

public startToast  (id:any)  {
  this.mapsAPILoader.load().then(() => {
    this.setCurrentLocation();

  this.geoCoder = new google.maps.Geocoder;
  })

  if (id == "start") {
  // this.toastr.success('Checked-In Successfully');
  // this.showPurpose=true;
  // this.showModals=true;
  //this.getUsersInfo();
  this.getCurrentPoslatlng();
  // this.mapsAPILoader.load().then(() => {
  //   this.setCurrentLocation();

  //  this.geoCoder = new google.maps.Geocoder;
  // })
  // this.setCurrentLocation();

  this.isCheckout=false;
  this.isCheckIn=true;
  //this.GetAllAdministrative();
   this.FindTeamsByOrgID();
  // this.getAllDesignationByOrgID();
  // this.getAllOutsourcedEmpByOrgID();
    this.EmpList();
    if(this.teamCount!=0){
      $('#isTeam').prop('checked',true);

    }
    this.teamAdd=false;
    this.searchLocVal=this.searchElementRef.nativeElement.value;
    this.FetchAllProjectByOrgID();
  $('#checkin_log_modal').modal('show');

  setTimeout(() => {
    /** spinner ends after 5 seconds */

    console.log('logModalLat',this.latitude);

    }, 500);

  this.searchElementRef.nativeElement.value='';
  setTimeout(() => {
    /** spinner ends after 5 seconds */

   if(this.currentPoslat==undefined){
    Swal.fire({

      title: 'Location Access Denied',
      text: "Please turn on the location access for checkin",
      type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  cancelButtonText: 'CANCEL!',
  }).then(
    (result) => {
  //       if (result.value) {


  // }
  })  //         this.spinner.show();


    console.log('undefinedLOC',this.searchLocVal)

  }
    }, 100);

  // Swal.fire({
  //   title: 'Are you sure?',
  //   text: "You want to check-in as",
  //   // html: '<button id="startSession" >Goto</button>',
  //   type: 'warning',
  //   showCancelButton: true,
  //   confirmButtonColor: '#3085d6',
  //   cancelButtonColor: '#d33',
  //   confirmButtonText: 'Individual CheckIn',
  //   cancelButtonText: 'Team CheckIn',

  // }).then((result) => {
  //   $('#toggleCheck').removeAttr('disabled');
  //   this.getUsersInfo();
  //   if (result.value) {
  // //  $('.swal2-confirm').attr('id','btnConfirm');$('.swal2-cancel').attr('id','btnCancel')
  //     if(localStorage.getItem('currentTime')){
  //       let checkINtIME=localStorage.getItem('currentTime');
  //     let date=moment().format('MM/DD/YYYY');
  //     this.checkInTime=date.concat(' ' +checkINtIME) ;
  //     }
  //     this.teamCheckIn=false;
  //     this.onAddTimeSheet();
  //

  //   }else{


  //

  //     this.teamCheckIn=true;

  //
  //     this.openModal();


  //   }
  // })
  $.getScript('assets/js/audioTimer.js')
}
else  if (id == "pause") {
  // this.toastr.success('Break Timer Starts');
  this.toastr.success('Break Timer Starts', undefined,{
    positionClass: 'toast-top-center'
});


}else  if (id == "reset") {
  // this.toastr.error('Break Timer Stops');
  this.toastr.error('Break Timer Stops', undefined,{
    positionClass: 'toast-top-center'
  });


}else  {
  // this.getUsersInfo();
  // // this.geoCoder = new google.maps.Geocoder;
  // this.setCurrentLocation();

  // this.showPurpose=false;
  // this.showTask=false;
  // this.showActivities=false;
  // this.isCheckout=true;
  // if(localStorage.getItem('currentTime')){
  //   let checkoutIME=localStorage.getItem('currentTime');
  //   let date=moment().format('MM/DD/YYYY');
  //   this.checkOutTime=date.concat(' ' +checkoutIME) ;
  // }


  // this.toastr.error('Checked-Out Successfully', '', {
  //   timeOut: 3000
  // });
  // Swal.fire({

  //   title: 'Are you sure?',
  //   text: "You want to check-out",
  //   type: 'warning',
  //   showCancelButton: true,
  //   confirmButtonColor: '#3085d6',
  //   cancelButtonColor: '#d33',
  //   confirmButtonText: 'Checkout!'
  // }).then((result) => {
  //   if (result.value) {
  //        this.getByCheckOutID();
  //     Swal.fire(
  //       'CheckedOut!',
  //       'You are checked out successfully.',
  //       'success'
  //     ).then(
  //       //used Arrow function here
  //       (result)=> {
  //         $('#toggleCheck').prop('checked',false);
  //         // this.getUsersInfo();

  //         $('#toggleCheck').removeAttr('disabled');

  //         this.teamCount=[]
  //         //
  //         //  this.router.navigate(['/dashboard']);
  //       })


  //   }
  // })

}


}
public selectedContent  (text:any)  {


  this.selectedText=text

}


public changedProject(e: any): void {
  this.selectedProject= e.value;

  this.projectValue=e.value;

if(this.projectValue==2){
this.showTask=true;
}else {
this.showTask=false;
}




}
public  changedMeetingTask  (e)  {
  this.meetingTaskValue=e.value
  this.actTextInputValue=e.value
  if (e.value!='') {
    this.meetingTaskValueTxt=e.data[0].text

    this.recentActtxtSel=false
    this.recentTaskSel=false
    this.recentActTaskSel=false

}
}
public  getAllActivity(){
  this.qtnService.FetchLocalActivityOrgID().subscribe(

    (data:any) => {

  var results=[{'id':'','text':'Select'}]
      // let dataObj = JSON.parse(data['token']);
    //

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
    "id": data[i].id,
    "text": data[i].activity_name
});

}


this.meetingTaskData =results;
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
public changedTask(e: any): void {
  this.selectedTask= e.value;

  this.taskValue=e.value;
if(this.taskValue==2){
this.showActivities=true;
}else {
this.showActivities=false;
}

}
public showProject  (id:any)  {

  if (id == "project") {
    this.showProjects=true;

}


// else  if (id == "pause") {
//   this.toastr.success('Break Timer Starts');

// }else  if (id == "reset") {
//   this.toastr.error('Break Timer Stops');

// }else  {

//
// }


}
public changedPurpose(e: any): void {
  this.selectedPurpose= e.value;

  this.purposeValue=e.value;
if(this.purposeValue==2){
this.showProjects=true;
}else {
this.showProjects=false;
}

}
public changedActivity(e: any): void {
  this.activityValue= e.value;

}
changedJobFilter(e: any): void {
  this.jobFilterValue= e.value;
  this.taskFilterValue='';
  this.activityFilterValue='';
  if(e.value!='')
{
  // this.fetchActByProjectID(e.value);
  this.fetchMilestActByProjectID(e.value);
  this.getalltaskbyJob(e.value,'job');
}


}
changedTaskFilter(e: any): void {
  this.taskFilterValue= e.value;
  if(e.value!='')
  {
  this.getalltaskbyJob(e.value,'task');
  }
}
public changedMilestFilter(e: any): void {

  this.activityFilterValue=e.value;
  // this.officeactText=e.data[0].text;
  this.taskFilterValue='';

  if(e.value!=''){
    this.showprojTask=true;
  this.getalltaskbyJob(e.value,'milest');

    this.GetProjTaskonActID(e.value);

  }else{
    this.showprojTask=false;

  }



}
public changedActTaskStatus(e: any): void {
  this.actTaskStatusValue= e.value;
  if(e.value!='' && e.value!='Select' ){

    if(e.data[0].text=='Completed'){
      //this.showSlider=true;
      this.sliderForm.patchValue({
        slider:1
      })
      this.sliderForm.get('slider').disable()
    }else{
     // this.showSlider=false;
      this.sliderForm.patchValue({
        slider:0
      })
      this.sliderForm.get('slider').enable()

    }
  }



}

public openDetailedView(type){
  //$('#details_view_modal').modal('show')
  //  $('#activity_log_modal').modal('hide')
  console.log('openDetailedView',type)
  if(type=='activityLog'){
    $("#activity_log_modal").removeClass("fade").modal("hide");

    this.closeActLog=true;
  console.log('if',type)

  }else if(type=='timeLog'){
    $("#time_log_modal").removeClass("fade").modal("hide");
    // this.timeLogBtn.nativeElement.click();

    this.closeActLog=false;
  console.log('else',type)


  }

  $("#details_view_modal").modal("show").addClass("fade");
}

closeDetailsViewModal(){
  // $('#details_view_modal').modal('hide')
  // $('.modal-backdrop').remove();
  //  $('#activity_log_modal').modal('show')
  $("#details_view_modal").removeClass("fade").modal("hide");
  this.detailCloseBtn.nativeElement.click();

if(this.closeActLog==true){
  $("#activity_log_modal").modal("show").addClass("fade");

}else{
  $("#time_log_modal").modal("show").addClass("fade");

}
}
selectedLead(id){
  // $('#details_view_modal').modal('hide')
  // $('.modal-backdrop').remove();
  //  $('#activity_log_modal').modal('show')
  this.typeValue=id;
 this.closeDetailsViewModal();
}
public changedTeam(e: any): void {
  this.teamValue= e.value;

}
public changedEmployee(e: any): void {
  this.employeeValue= e.value;

}

public addLeave(){
  // $('#addLeave').show();
  $("#leave_modal").modal('show');
  this.FetchLeaveStatusOrgID();
  this.getLeaveSetup();
  this.getAllEmployee();
 this.getAllEmployeeList();
}
public OnLeaveClose(){
// $('#addLeave').show();
$("#leave_modal").modal('hide');

}
public customRadioChange(){
//
// if(this.projectForm.get('prefixVal').value=='is_custom'){
//   this.showPrefixText=true;

// }else{
//   this.showPrefixText=false;
//  // this.FindAutoProjectPrefixByOrgID();

// }
}
public onApply(e){

}
public showOptions(){
  var sel = $('.sel'),
  txt = $('.txt'),
  options = $('.options');

sel.click(function (e) {
  e.stopPropagation();
  options.show();
});

$('body').click(function (e) {
  options.hide();
});

options.children('div').click(function (e) {
  e.stopPropagation();

  $(this).addClass('selected').siblings('div').removeClass('selected');

});
}
public showtimer(){
  $('.clockpicker').clockpicker({
    autoclose: false,
      placement: 'bottom',
      align: 'left',
      donetext: 'Done',
      afterDone: () => {

      }})

}
public changedOthersData(e: any): void {
  this.othersDataValue= e.value;
  if(e.value==5){
    this.showComments=true;
  }else{
    this.showComments=false;

  }

}
public changedOfficeData(e: any): void {

  this.officeDataValue= e.value;


}
public changedAdminTask(e: any): void {

  this.AdminTaskValue= e.value;
  if(e.value){
    this.adminSel=false;
    this.recentActAdminSel=false;
    this.GetTop10TimesheetAdminActivityOnGroupIDAndAdminID(this.activityGroupID,e.value);

  }else{
    this.adminSel=true;
    this.recentActAdminSel=true;

    this.AdminTaskValue= '';

  }


}
public selectedOption(e): void {


this.xpandStatus=false;
this.selectedValue=e.org_name;
this.selectedOfficeId=e.org_id;
this.selectedentitiyLoc=e.entityLocation;
// if (navigator)
// {
// navigator.geolocation.getCurrentPosition( pos => {
//   this.currentPoslng = +pos.coords.longitude;
//   this.currentPoslat = +pos.coords.latitude;
//   });

// }
this.drag=true
console.log('currentPoslng',this.currentPoslng,this.currentPoslat)

this.projectPoslat = e.entityLocation?e.entityLocation.lat:'' ;
this.projectPoslng =e.entityLocation?e.entityLocation.lang:'' ;
this.OffcSetPosition(e.entityLocation.lat,e.entityLocation.lang,e.entityLocationRadius);

}
public changedActTask(e: any): void {

  // this.ActTaskValue=e.value;
  let user:object={};
if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));

}
  if(e.value){
    this.projTaskDataValue=e.value;
    this.projTaskDataText=e.data[0].text;
    this.activityDataText=e.data[0].additional.milestone;

    this.acttaskListValue=e.data[0].additional.milestone_id;


  //  this.officeActInputValue=e.data[0].additional.milestone;
    if(this.showActivityTasks){
    this.officeActListValue=e.data[0].additional.milestone_id;
    this.officeactText=e.data[0].additional.milestone;

    }else{
      this.officeActListValue='';
      this.officeactText='';
    }
this.taskSel=false;
this.recentActTaskSel=false;
this.actTaskStatusValue=e.data[0].additional.status_id;
if( e.data[0].additional.status_id==this.openStatID){
  this.allowUpdateStatus=true
}else{
  this.allowUpdateStatus=false

}
this.projectId=e.data[0].additional.project_id;
this.GetProjSubTaskonTaskID(e.value);
if(e.data[0].additional.assigne_id==user['id'] || e.data[0].additional.assigne_id=='Anyone'){
  this.enableActTaskStatus=false;
}else{
  this.enableActTaskStatus=true
}
    this.GetTop10TimesheetActivityOnTaskID(e.value);

  }else{

    this.recentActTaskSel=true;

this.taskSel=true;

    this.projTaskDataValue='';
    this.activityDataText='';

  }



}
actTextInputChange(event){

  this.actTextInputValue=event.target.value;

  if( event.target.value!='' ){
 this.recentActtxtSel=false
  }


 }
 subTextInputChange(event){

  this.subTextInputValue=event.target.value;

  if( event.target.value!='' ){
 this.subtxtSel=false
  }else{
 this.subtxtSel=true

  }


 }

 officactTextInputChange(event){

  this.officeActInputValue=event.target.value;

  if( event.target.value!='' ){
 this.actTxt=false;
  }else{
    this.actTxt=true;

  }


 }
 changedOffcMeetingTask(event){
  if(event.data){
  this.officeActInputValue=event.data[0].text;
  }
  this.offcMeetingTaskValue=event.value;
  if( event.value!='' || event.value!='Select' ){
 this.actTxt=false;
  }else{
    this.actTxt=true;

  }


 }
 remarksInputChange(event){

  this.remarksInputValue=event.target.value;

 //  if( event.target.value=='' ){

 //  }


 }
public changedProjTask(e: any): void {

  let user:object={};
  if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));

  }

  if(e.value!=''){
    this.recentTaskSel=false;
    this.projTaskDataValue=e.value;
    this.projTaskDataText=e.data[0].text;
    this.actTaskStatusValue=e.data[0].additional.status_id;
    if( e.data[0].additional.status_id==this.openStatID){
  this.allowUpdateStatus=true
}else{
  this.allowUpdateStatus=false

}
    this.GetProjSubTaskonTaskID(e.value)
    // this.projectId=e.data[0].additional.project_id;
    if(e.data[0].additional.assigned_empid==user['id']){
      this.enableActTaskStatus=false;
    }else{
      this.enableActTaskStatus=true
    }
    this.GetTop10TimesheetActivityOnTaskID(e.value);

  }else{
     this.recentTaskSel=true;

    this.projTaskDataValue='';

  }



}
public changedProjAct(e: any): void {
  console.log('asdsa',e)
  this.acttaskListValue=e.value;
  if(e.value){
    this.showprojTask=true;
    this.activityDataText=e.data.length!=0?e.data[0].text:'';
    this.recentActSel=false;
    this.recentTaskSel=false;
    this.recentTaskSel=false;
    this.recentActtxtSel=false
    this.GetProjTaskonActID(e.value);



  }else{
    this.recentActSel=true;

    this.showprojTask=false;

  }



}
public GetProjTaskonActID(id): void {
  let actID={
    "ID": id
  }
  this.projectService.GetAllTaskByActivityID(actID).subscribe(

    (data:any) => {


var results=[{ id: '', text: 'Select' , additional:{
  assigned_empid:'',
  status_id:''
}}]
      // let dataObj = JSON.parse(data['token']);

    if(data){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items

        results.push({

            "id": data[i].id,
            "text": data[i].task_name,
            additional:{
              assigned_empid:data[i].assigned_empid,
              status_id:data[i].status_id
            }
        });

        }
    }

this.projTaskData =results;


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
public GetProjSubTaskonTaskID(id): void {

  let postData={"id":id}

  this.projectService.GetAllSubTaskByTaskID(postData).subscribe(

    (data:any) => {


var results=[{ id: '', text: 'Select' , additional:{
  assigned_empid:'',
  status_id:''
}}]
      // let dataObj = JSON.parse(data['token']);

    if(data.length!=0 && data!=null){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items
        if(data[i].status_name!='Completed'){
          results.push({

            "id": data[i].id,
            "text": data[i].sub_task_name,
            additional:{
              assigned_empid:data[i].assigned_empid,
              status_id:data[i].status_id
            }
        });
        }


        }
this.projSubTaskData =results;
if(this.sub_taskId!=''){
  let taskId=this.sub_taskId.split('/')
  console.log('taskId',taskId);
  this.projSubtaskListValue=taskId[0];
  this.projSubtaskText=taskId[1];


}

    }else{
      this.projSubTaskData=[];
      this.officeSubtaskListValue='';
      this.officeSubtaskText='';

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
public changedPurposeData(e: any): void {
  this.act_purposeValue= e.value;


}
public projectsView(){
  $('#complain_content').hide();
  $('#project_content').show();
  $('#task_content').hide();
  $('#assignee_content').hide();

}
public complainView(){
  $('#complain_content').show();
  $('#project_content').hide();
  $('#task_content').hide();
  $('#assignee_content').hide();

}
public taskView(){
  $('#complain_content').hide();
  $('#project_content').hide();
  $('#task_content').show();
  $('#assignee_content').hide();

}
public assignedView(){
  $('#complain_content').hide();
  $('#project_content').hide();
  $('#task_content').hide();
  $('#assignee_content').show();
}

public checkValue(e: any): void {
  // this.teamValue= e.value;
  this.showTeamSelect=!this.showTeamSelect


  if(e.srcElement.checked) {


    $('#team_modal').modal('show');
    this.FindTeamsByOrgID();
    this.getAllDesignationByOrgID();
    this.getAllOutsourcedEmpByOrgID();
    this.EmpList();
    // this.openModal();
  }




}


public open_team_modal(){

  $("#team_modal").modal('show');
}
public myFunction() {

  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByClassName("li");

  for (i = 0; i < li.length; i++) {

      a = li[i].getElementsByTagName("a")[0];

      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
      } else {
          li[i].style.display = "none";
      }
  }
}


public templateResult: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }



  return jQuery('<div><b>' + state.text+ '</b> ' + '<span> '+ state.additional.teamBy + '</span></div>');
}
public taskDescResult: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }



  return jQuery('<div><b>' + state.text+ '</b> ' + '<span> '+ state.additional.assignee + '</span>' +
   '<div> '+ state.additional.taskDesc + '</div>' +'<div> '+ state.additional.milestone +'<div> '+ state.additional.dueDate + '</div>' +'</div>');
}
// function for selection template
public templateSelection: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }

  return jQuery('<span><b>' + state.text + '</b> ' + state.additional.teamBy + '</span>');
  //return jQuery('<div><b>' + state.text+ '</b></div> ' + '<div>'+ state.additional.teamBy + '</div>');

}
public taskDescSelection: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }

  return jQuery('<span><b>' + state.text + '</b> ' + state.additional.assignee + '</span>');
  //return jQuery('<div><b>' + state.text+ '</b></div> ' + '<div>'+ state.additional.teamBy + '</div>');

}
applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
clearAllFilters(){
  this.jobFilterValue='',
  this.activityFilterValue='',
  this.taskFilterValue=''
  this.GetAllTaskByEmpID();
  this.searchText='';
}
public clearSearchField() {
  this.searchField = '';
  this.fetchDataGrid();

}
public onAddTimeSheet(){

  //  this.getUsersInfo();
   this.getTimesheetByEmpId();
  // this.spinner.show();
  // this.setCurrentLocation();
      if(localStorage.getItem('currentTime')){
        let checkINtIME=localStorage.getItem('currentTime');
       let date=moment().format('MM/DD/YYYY');
      this.checkInTime=date.concat(' ' +checkINtIME) ;
      }
      this.teamCheckIn=false;
  //  let date=document.getElementById('ntpDate').innerText;
  //

let groupid=this.group_id ? this.group_id:'';

let user:object={};
if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));

}

  let postData={

      "team_member_empid": [
        user['id']
      ],
      "teamid": null,
      "check_in":this.checkInTime ,
      "createdby":user_info['full_name'],
      "is_inrange": this.boundryContain,

      // ...this.othersDataValue.length!=0?{"TimesheetAdministrativeViewModel": {
      //   "administrative_id":this.othersDataValue
      // }}:{"TimesheetAdministrativeViewModel":null},
      ...this.selectedGroupVal!='empty'? {"TimesheetCategoryViewModel": {

    "project_category_type": this.selectedGroupVal,
    "project_or_comp_id": this.systemid,
    "project_or_comp_name": this.systemidText,
    "project_or_comp_type": ""
      }}:{"TimesheetCategoryViewModel":null},

      "TimesheetSearchLocationViewModel": null,

      "TimesheetCurrentLocationViewModel": {
        "formatted_address": this.formatted_address?this.formatted_address:"",
            "lat": this.latitude?JSON.stringify(this.latitude):"",
            "lang": this.longitude?JSON.stringify(this.longitude):"",
            "street_number": this.street_number?this.street_number:"",
            "route": this.route?this.route:"",
            "locality": this.locality?this.locality:"",
            "administrative_area_level_2": this.administrative_area_level_2?this.administrative_area_level_2:"",
            "administrative_area_level_1": this.administrative_area_level_1?this.administrative_area_level_1:"",
            "postal_code": "",
            "country":  this.country?this.country:""
      }

    //  ...this.othersDataValue.length!=0? {"timesheet_administrative":this.othersDataValue}:{"timesheet_administrative":[
    //   ""
    // ]}


    }
  console.log('onAddTimeSheetpostData',postData);
     if(this.selectedGroupVal!='Office'){
           return this.timeService.AddTimeLog(postData).subscribe(
          (data:any)  => {

          if(data.status==200){
        console.log('placecheckin')

            this.spinner.hide();
            // this.disableAddLog=false;
            this.checkin=false;
            this.breakin=true;
            this.breakout=false;
            this.checkout=true;
            if(this.jobFilterValue!='')
            {
            this.getalltaskbyJob(this.jobFilterValue,'job');
            }
           // $("#checkin_log_modal").modal('hide');
            this.closeBtn.nativeElement.click();

            this.LastCheckinByEmpID();

            this.getTimesheetByEmpId();
            this.selectedVal='';
            this.selectedGroupVal='empty';
            this.systemidText='';
        this.othersDataValue= '';
        this.showAdminTasks=false;
        this.groupModel=null;
        this.locationModel=null;
      this.showProjDesc=false;

        $('#toggleAdminCheck').prop('checked',false);
        $('#isTeam').prop('checked',false);
      this.selectedDeptVal='';
         this.toastr.success(data.desc);


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
     if(this.selectedGroupVal=='Office' && this.boundryContain==true){
      return this.timeService.AddTimeLog(postData).subscribe(
        (data:any)  => {
        console.log('Officecheckin')
        if(data.status==200){
          this.spinner.hide();
          // this.disableAddLog=false;
          this.checkin=false;
          this.breakin=true;
          this.breakout=false;
          this.checkout=true;
          if(this.jobFilterValue!='')
          {
          this.getalltaskbyJob(this.jobFilterValue,'job');
          }
         // $("#checkin_log_modal").modal('hide');
          this.closeBtn.nativeElement.click();

          this.LastCheckinByEmpID();

          this.getTimesheetByEmpId();
          this.selectedVal='';
          this.selectedGroupVal='empty';
          this.systemidText='';
      this.othersDataValue= '';
      this.showAdminTasks=false;
      this.groupModel=null;
      this.locationModel=null;
    this.showProjDesc=false;

      $('#toggleAdminCheck').prop('checked',false);
      $('#isTeam').prop('checked',false);
    this.selectedDeptVal='';
       this.toastr.success(data.desc);


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
     }else if(this.selectedGroupVal=='Office' && this.boundryContain==false){
      console.log('Officecheckinfalse')

      Swal.fire(
        'Oops!',
        "Your current location isn't matched with the office location",
        'error'
      ).then(
        (result)=> {

        })
     }


}
public onTeamAdd(){

  this.teamCount=this.teamValue.concat(this.teamMembers)
  let teamMembers=this.teamCount;
  $("#team_modal").modal('hide');

  teamMembers.push(user_info['id'])

  $('#toggleCheck').prop('checked',false);
  $('#toggleCheck').attr('checked', false);
  // $('#toggleCheck').attr('disabled', 'disabled')




 //   this.editTeam=true;
 //   $('#toggleCheck').prop('disabled',true);
 // $('#toggleCheck').attr('disabled', true);

  //  let groupid=this.group_id ? this.group_id:'string';
   let checkinIME=localStorage.getItem('currentTime');
     let date=moment().format('MM/DD/YYYY');
     this.checkInTime=date.concat(' ' +checkinIME) ;



}
public openCheckout(){
  if(this.currentPoslat==undefined){
    Swal.fire({

      title: 'Location Access Denied',
      text: "Please turn on the location access for checkin",
      type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  cancelButtonText: 'CANCEL!',
  }).then(
    (result) => {
  //       if (result.value) {


  // }
  })  //         this.spinner.show();



  }else{
    //$("#checkout_modal").modal('show');

  }

}
public showDesc(){
this.projDesc=true
}
public  FetchAllProjectByOrgID(){
  if(localStorage.getItem('user_info')){
    let user_info= JSON.parse(localStorage.getItem('user_info'));


    if(user_info['is_superadmin']==true){

  this.GetProjByOrgID();

    }else
    if(user_info['is_admin']==true && user_info['is_superadmin']==false){
      console.log('admin')


  this.GetProjByOrgID();

    }else
    if(user_info['is_admin']==false && user_info['is_superadmin']==false){
      console.log('employee')


  this.FetchAllProjectByEmpID();

    }

  }

    }
    GetProjByOrgID(){
      this.projectService.FetchAllProjectByOrgID().subscribe(

        (projectData:any) => {

          var results=[{ id: '', text: 'Select',additional:{teamBy:''} }]
          var jobFilter=[{ id: '', text: 'Project',additional:{teamBy:''} }]
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
            jobFilter.push({

              id: projectData[i].project_id,
              text: projectData[i].project_name,
              additional:{
                teamBy: projectData[i].project_prefix
            }



          });

            }
        }






    this.selectedCategData =results;
    this.selectedJobData=results;
    this.selectedJobFilterData=jobFilter;



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
    GetProjectListByEmpID(){
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






   this.projectFilterListByEmp=results



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
    FetchAllProjectByEmpID(){
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






    this.selectedCategData =results;
    this.selectedJobData=results;



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

      //  this.getCurrentPoslatlng();



        this.projectPoslat =  this.latitude;
        this.projectPoslng = this.longitude ;
        //this.SetPosition(orgData[i].entityLocation.lat,orgData[i].entityLocation.lang);

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
public onSubmitTeam(){

  this.setCurrentLocation();
  this.spinner.show();
 this.teamCount=this.teamMemFetchData.length;
  let teamMembers=this.teamMembers;
teamMembers.push(user_info['id'])

 $('#toggleCheck').prop('checked',true);
 $('#toggleCheck').attr('checked', true);
 $('#toggleCheck').attr('disabled', 'disabled')
let team_member_empid=[]

 if(this.teamMemFetchData){
  for(var i=0;i<this.teamMemFetchData.length;i++){
    team_member_empid.push(this.teamMemFetchData[i].id)

  }
}
let user:object={};
if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));

}
team_member_empid.push(user['id'])

//   this.editTeam=true;
//   $('#toggleCheck').prop('disabled',true);
// $('#toggleCheck').attr('disabled', true);
  $("#team_modal").modal('hide');

  let groupid=this.group_id ? this.group_id:'';
  let checkinIME=localStorage.getItem('currentTime');
    let date=moment().format('MM/DD/YYYY');
    this.checkInTime=date.concat(' ' +checkinIME) ;

  let postData={


      "team_member_empid": team_member_empid,

      "teamid":this.teamValue,

    "check_in": this.checkInTime,

      "createdby":user['full_name'],

      "TimesheetAdministrativeViewModel": {


        ...this.othersDataValue.length!=0? {"administrative_id":this.othersDataValue}:{"administrative_id":[
          ""
        ]}
      },
      "TimesheetCategoryViewModel": {
    ...this.selectedGroupVal!='empty'?  {"project_category_type": this.selectedGroupVal}:{"project_category_type": ''},
    "project_or_comp_id": this.systemid,
    "project_or_comp_name": this.systemidText,
    "project_or_comp_type": "",

      },
      "TimesheetSearchLocationViewModel": null,
      "TimesheetCurrentLocationViewModel": {
        "formatted_address": this.formatted_address?this.formatted_address:"",
            "lat": this.latitude?JSON.stringify(this.latitude):"",
            "lang": this.longitude?JSON.stringify(this.longitude):"",
            "street_number": this.street_number?this.street_number:"",
            "route": this.route?this.route:"",
            "locality": this.locality?this.locality:"",
            "administrative_area_level_2": this.administrative_area_level_2?this.administrative_area_level_2:"",
            "administrative_area_level_1": this.administrative_area_level_1?this.administrative_area_level_1:"",
            "postal_code": "",
            "country":  this.country?this.country:""
      }


    }



        return this.timeService.AddTimeLog(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);

          if(data.status==200){
            this.checkin=false;
            this.breakin=true;
            this.breakout=false;
            this.checkout=true;
  //  localStorage.setItem('is_checkout',JSON.stringify(false));

            // $("#checkin_log_modal").modal('hide');
            this.closeBtn.nativeElement.click();

            this.spinner.hide();
            if(this.teamAdd){
              this.resetAddedTeams();

            }
            this.LastCheckinByEmpID();

            this.getTimesheetByEmpId();

            // this.getUsersInfo();
            this.toastr.success(data.desc);
            this.teamCheckIn=true;
            this.selectedVal='';
            this.selectedGroupVal='empty';
            this.systemidText='';
        this.othersDataValue= '';
        this.showAdminTasks=false;
        this.groupModel=null;
        this.locationModel=null;
        $('#toggleAdminCheck').prop('checked',false);
        $('#isTeam').prop('checked',false);
        this.teamValue='';
        this.filterEmpByDept=false;
        this.filterEmpByDesgn=false;
        this.teamMemberValue='';
      this.teamMembers=[];
      this.selectedDeptVal='';
      this.teamAdd=false;

          }
          // this.router.navigate(["/organizations"]);

          },
          error  => {
            this.spinner.hide();

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
public onCheckChange(){
  this.billable=!this.billable;


}
public AddTimesheetBreakIn(){
  //  localStorage.setItem('is_checkout',JSON.stringify(true))

  // this.editable=true;
  // this.editDeptId=dept_id;
  //   let postData={
  //     id:dept_id
  //   }
  let user:object={};
  if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));

  }
  // teamMembers.push(user_info['id'])
  if(localStorage.getItem('currentTime')){
    let breakTime=localStorage.getItem('currentTime');
    let date=moment().format('MM/DD/YYYY');
    this.breakInTime=date.concat(' ' +breakTime) ;
  }

  let groupid=this.group_id ? this.group_id:'';
    let postData={

      "id": null,
"team_member_empid":
 this.teamEmpId,

  "groupid": groupid,
  "break_in": this.breakInTime,
  "break_out": null,
  //"is_inrange": this.boundryContain,

  "createdby": user['full_name'],
  "TimesheetCurrentLocationViewModel": {
    "geo_address":  this.formatted_address?this.formatted_address:"",
    "formatted_address": this.formatted_address?this.formatted_address:"",
    "lat": this.latitude?JSON.stringify(this.latitude):"",
    "lang": this.longitude?JSON.stringify(this.longitude):"",
    "street_number": this.street_number?this.street_number:"",
    "route": this.route?this.route:"",
    "locality": this.locality?this.locality:"",
    "administrative_area_level_2": this.administrative_area_level_2?this.administrative_area_level_2:"",
    "administrative_area_level_1": this.administrative_area_level_1?this.administrative_area_level_1:"",
    "postal_code": "",
    "country":  this.country?this.country:""

  }


}
// this.checkin=false;
// this.breakin=false;
// this.breakout=true;
// this.checkout=false;
//  this.countupTimerService.startTimer();


    this.timeService.AddTimesheetBreak(postData).subscribe(
      (data:any)  => {

       if(data.status==200){
this.spinner.hide();
this.countupTimerService.startTimer();

this.checkin=false;
this.breakin=false;
this.breakout=true;
this.checkout=false;

          this.toastr.success('Break Timer Starts', undefined,{
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
          (result)=> {

          })


      }

      )

}

public findLastBreakIn(grpid){
this.spinner.show();
  let user:object={};
  if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));

  }
  // teamMembers.push(user_info['id'])


  let groupid=this.group_id ? this.group_id:'';
    let postData={

"EmpID": user['id'],

  "GrpID": grpid,


}
// this.checkin=false;
// this.breakin=false;
// this.breakout=true;
// this.checkout=false;
//  this.countupTimerService.startTimer();


    this.timeService.FindLastTimeSheetBreakByEmpIDAndGrpID(postData).subscribe(
      (data:any)  => {

       if(data.length!=0){
         if(data[0].is_breakout==false)
this.spinner.hide();
this.countupTimerService.startTimer();

this.checkin=false;
this.breakin=false;
this.breakout=true;
this.checkout=false;

        //   this.toastr.success('Break Timer Starts', undefined,{
        //     positionClass: 'toast-top-center'
        // });


      }else{
        this.spinner.hide();
this.countupTimerService.stopTimer();

this.checkin=false;
this.breakin=true;
this.breakout=false;
this.checkout=true;
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
public AddTimesheetBreakOut(){
  //  localStorage.setItem('is_checkout',JSON.stringify(true))

  // this.editable=true;
  // this.editDeptId=dept_id;
  //   let postData={
  //     id:dept_id
  //   }
  let user:object={};
  if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));

  }
  // teamMembers.push(user_info['id'])
  if(localStorage.getItem('currentTime')){
    let breakTime=localStorage.getItem('currentTime');
    let date=moment().format('MM/DD/YYYY');
    this.breakOutTime=date.concat(' ' +breakTime) ;
  }

  let groupid=this.group_id ? this.group_id:'';
    let postData={


"team_member_empid":
 this.teamEmpId,

  "groupid": groupid,

  "break_out": this.breakOutTime,
  "is_inrange": this.boundryContain,

  "createdby": user['full_name'],
  "TimesheetCurrentLocationViewModel": {
    "geo_address":  this.formatted_address?this.formatted_address:"",
    "formatted_address": this.formatted_address?this.formatted_address:"",
    "lat": this.latitude?JSON.stringify(this.latitude):"",
    "lang": this.longitude?JSON.stringify(this.longitude):"",
    "street_number": this.street_number?this.street_number:"",
    "route": this.route?this.route:"",
    "locality": this.locality?this.locality:"",
    "administrative_area_level_2": this.administrative_area_level_2?this.administrative_area_level_2:"",
    "administrative_area_level_1": this.administrative_area_level_1?this.administrative_area_level_1:"",
    "postal_code": "",
    "country":  this.country?this.country:""

  }


}
// this.checkin=false;
// this.breakin=true;
// this.breakout=false;
// this.checkout=true;
// this.countupTimerService.stopTimer();

    this.timeService.BreakOutByEmpID(postData).subscribe(
      (data:any)  => {

       if(data.status==200){
this.spinner.hide();
 this.countupTimerService.stopTimer();

   this.checkin=false;
   this.breakin=true;
   this.breakout=false;
   this.checkout=true;

          this.toastr.success('Break Timer Starts', undefined,{
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
          (result)=> {

          })


      }

      )

}
public getByCheckOutID(){
  //  localStorage.setItem('is_checkout',JSON.stringify(true))

  // this.editable=true;
  // this.editDeptId=dept_id;
  //   let postData={
  //     id:dept_id
  //   }
  this.mapsAPILoader.load().then(() => {
    this.setCurrentLocation();

   this.geoCoder = new google.maps.Geocoder;

  })

let postData={

}
  console.log('checkoutoffc',this.offcboundryContain);
this.checkoutByEmpId=true;

  let teamMembers=[];

  if(this.teamAdd){
    this.teamCount=this.teamValue.concat(this.teamMembers)
     teamMembers=this.teamMembers;
  }
  // teamMembers.push(user_info['id'])

  let groupid=this.group_id ? this.group_id:'';

  setTimeout(() => {
      postData={


      "team_member_empid":
       this.teamEmpId,

        "groupid": groupid,
        "check_out": this.checkOutTime,
        "is_inrange": this.boundryContain,

        "modifiedby": user_info['full_name'],
        "TimesheetCurrentLocationViewModel": {
          "formatted_address": this.formatted_address?this.formatted_address:"",
          "lat": this.latitude?JSON.stringify(this.latitude):"",
          "lang": this.longitude?JSON.stringify(this.longitude):"",
          "street_number": this.street_number?this.street_number:"",
          "route": this.route?this.route:"",
          "locality": this.locality?this.locality:"",
          "administrative_area_level_2": this.administrative_area_level_2?this.administrative_area_level_2:"",
          "administrative_area_level_1": this.administrative_area_level_1?this.administrative_area_level_1:"",
          "postal_code": "",
          "country":  this.country?this.country:""

        }


      }
    }, 500);

if(this.currentPoslat==undefined){

setTimeout(() => {
  /** spinner ends after 5 seconds */

 if(this.currentPoslat==undefined){
  Swal.fire({

    title: 'Location Access Denied',
    text: "Please turn on the location access for checkout",
    type: 'warning',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
cancelButtonText: 'CANCEL!',
}).then(
  (result) => {
//       if (result.value) {


// }
})  //         this.spinner.show();



  console.log('undefinedLOC',this.searchLocVal)

}
  }, 100);

}
else{
  setTimeout(() => {
    let GroupID={
      id:groupid
    }
    this.spinner.hide();
this.timeService.GetTimesheetByGroupID(GroupID).subscribe(
  (data:any)  => {
   if(data.length!=0){

if(data['entityLocationRadius']!=null && data['timesheetCategoryViewModel']['project_category_type']=='Office'){
console.log('Officecheckin')
if(data['entityLocationRadius']['is_allowed']==true){
this.OffcSetPosition(data['entityLocation']['lat'],data['entityLocation']['lang'],data['entityLocationRadius']);
if(this.offcboundryContain){
this.checkoutLocation(postData);


}else{
Swal.fire(
  'Oops!',
  'You are check out location is not matched with office location.',
  'error'
).then(
  //used Arrow function here
  (result)=> {
    $('#toggleCheck').prop('checked',false);
    // this.getUsersInfo();
    this.disableAddLog=true;

    $('#toggleCheck').removeAttr('disabled');

    this.teamCount=[]

  })
}


}else{
this.checkoutLocation(postData);

}
}
else{
this.checkoutLocation(postData);
}
   }
  })
  }, 800);



}


}
checkoutLocation(postData){
  this.timeService.getByCheckOutID(postData).subscribe(
    (data:any)  => {

     if(data.status==200){
this.spinner.hide();
 localStorage.setItem('is_checkout',JSON.stringify(true))
      localStorage.removeItem('timeLeft');
      //clock
      this.clockTimerDiv = false;
      this.noClockTimerDiv = true;
      this.timerReference.stop();
      //clock ends
        this.teamCount='';
        this.checkin=true;
        this.breakin=false;
        this.breakout=false;
        this.checkout=false;
  this.getTimesheetByEmpId();
 this.checkin=true;
 this.breakin=false;
 this.breakout=false;
 this.checkout=false;
 this.disableAddTask=true;
 this.disableAddLog=true;

        // this.getUsersInfo();
        $('#toggleCheck').prop('checked',false);
        $('#toggleCheck').attr('checked', false);
        Swal.fire(
          'CheckedOut!',
          'You are checked out successfully.',
          'success'
        ).then(
          //used Arrow function here
          (result)=> {
            $('#toggleCheck').prop('checked',false);
            // this.getUsersInfo();
            this.disableAddLog=true;

            $('#toggleCheck').removeAttr('disabled');

            this.teamCount=[]

          })



         $("#checkout_modal").removeClass("md-show");
      this.toastr.success(data['desc']);



    }else{
      Swal.fire(
        'Error!',
        data['desc'],
        'error'
      ).then(
        (result)=> {

        })
    }

    //  setTimeout((localStorage.setItem('is_checkout',JSON.stringify(true))),5000);


    },
    error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        (result)=> {

        })

        this.spinner.hide();

    }

    )
}
public onLocationSubmit(){
  // this.setCurrentLocation();
  console.log('onLocationSubmit',this.currentPoslat,this.currentPoslng);

  let team_member_empid=[];
  let groupid=this.group_id ? this.group_id:'';
  this.teamCount=this.teamMemFetchData.length;
  let typeOfCheckin;
  let typeOfCheckinValue;
  let user:object={};
if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));

}
  if(this.officeInput){
   typeOfCheckin='Office',
   typeOfCheckinValue= this.selectedValue

  this.boundryContain=this.offcboundryContain;

  }else if(this.manualInput){
    typeOfCheckin='Manual',
   typeOfCheckinValue=$('#manualInput').val()


  }else{
    typeOfCheckin='Place',
   typeOfCheckinValue=this.changed_address?this.changed_address:this.formatted_address


  }

  if(this.teamMemFetchData && this.teamAdd){
    for(var i=0;i<this.teamMemFetchData.length;i++){
      team_member_empid.push(this.teamMemFetchData[i].id)

    }
  }

  team_member_empid.push(user['id'])

  let teamMembers=this.teamMembers;
teamMembers.push(user['id'])
  let checkinIME=localStorage.getItem('currentTime');
    let date=moment().format('MM/DD/YYYY');
    this.checkInTime=date.concat(' ' +checkinIME) ;

let postData={
 ...!this.teamAdd? {"team_member_empid": [
  user['id']
  ]}:{"team_member_empid":
    team_member_empid
  },
  "teamid":this.teamMemFetchData.length!=0 && this.teamValue!=""? this.teamValue:null,
  "check_in": this.checkInTime,
  "createdby": user['full_name'],
  "is_inrange":typeOfCheckin=="Manual"?true:this.boundryContain,

  // "TimesheetCategoryViewModel": null,

  "TimesheetCategoryViewModel": {

    "project_category_type":typeOfCheckin,
    "project_or_comp_id": typeOfCheckin=="Office"?this.selectedOfficeId:null,
    "project_or_comp_name": typeOfCheckinValue,
    "project_or_comp_type": null
      },
  "TimesheetSearchLocationViewModel": {
    "manual_address":this.manualInput?$('#manualInput').val():"",
    ...!this.officeInput?{"geo_address": this.searchElementRef.nativeElement.value,

    "formatted_address": this.changed_address && !this.officeInput && !this.manualInput?this.changed_address:this.formatted_address,
        "lat": this.latitude?JSON.stringify(this.latitude):"",
        "lang": this.longitude?JSON.stringify(this.longitude):"",
        "street_number": this.changed_street_number?this.changed_street_number:this.street_number,
        "route": this.changed_route?this.changed_route:this.route,
        "locality": this.changed_locality?this.changed_locality:this.locality,
        "administrative_area_level_2": this.changed_administrative_area_level_2?this.changed_administrative_area_level_2:this.administrative_area_level_2,
        "administrative_area_level_1": this.changed_administrative_area_level_1?this.changed_administrative_area_level_1:this.administrative_area_level_1,
        "postal_code": "",
        "country":  this.changed_country?this.changed_country:this.country}:
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
        "is_manual": this.manualInput?true:false,
        "is_wfh": this.homeInput?true:false,
  },
  "TimesheetCurrentLocationViewModel": {

    "formatted_address": this.current_formatted_address?this.current_formatted_address:"",
        "lat": this.currentPoslat?JSON.stringify(this.currentPoslat):"",
        "lang": this.currentPoslng?JSON.stringify(this.currentPoslng):"",
        "street_number": this.current_street_number?this.current_street_number:"",
        "route": this.current_route?this.current_route:"",
        "locality": this.current_locality?this.current_locality:"",
        "administrative_area_level_2": this.current_administrative_area_level_2?this.current_administrative_area_level_2:"",
        "administrative_area_level_1": this.current_administrative_area_level_1?this.current_administrative_area_level_1:"",
        "postal_code": "",
        "country":  this.current_country?this.current_country:""
  }
}
if(this.teamAdd){
  this.teamCheckIn=true;
}

console.log('onLocationSubmit',postData);
this.spinner.show();
this.typeOfCheckin=typeOfCheckin;
if(typeOfCheckin!='Office'){
return this.timeService.AddTimeLog(postData).subscribe(
  (data:any)  => {
    // let dataObj = JSON.parse(data['token']);

  if(data.status==200){
    // $("#checkin_log_modal").modal('hide');
    // this.disableAddLog=false;
    this.closeBtn.nativeElement.click();

    this.showProjDesc=false;

    this.spinner.hide();
    if(this.teamAdd){
      this.resetAddedTeams();

    }
    this.searchElementRef.nativeElement='';
   this.LastCheckinByEmpID();

   this.getTimesheetByEmpId();

// this.getUsersInfo();
    this.toastr.success(data.desc);
    this.officeInput=false;
    this.manualInput=false;
    this.homeInput=false;
    this.showMap=true;
    this.selectedVal='';
    this.selectedGroupVal='empty';
    this.systemidText='';
this.othersDataValue= '';
this.showAdminTasks=false;
this.groupModel=null;
this.locationModel=null;
this.manualInputValue=$('#manualInput').val();
$('#toggleAdminCheck').prop('checked',false);
$('#isTeam').prop('checked',false);
this.teamValue='';
this.filterEmpByDept=false;
this.filterEmpByDesgn=false;
this.teamMemberValue='';
this.teamMembers=[];
this.selectedDeptVal='';
this.teamAdd=false;
this.nearbyAddress='';
  }

  },
  error  => {
    this.spinner.hide();

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
if(typeOfCheckin=='Office' && this.boundryContain ){
  return this.timeService.AddTimeLog(postData).subscribe(
    (data:any)  => {
      // let dataObj = JSON.parse(data['token']);

    if(data.status==200){
      // $("#checkin_log_modal").modal('hide');
      // this.disableAddLog=false;
      this.closeBtn.nativeElement.click();

      this.showProjDesc=false;

      this.spinner.hide();
      if(this.teamAdd){
        this.resetAddedTeams();

      }
      this.searchElementRef.nativeElement='';
     this.LastCheckinByEmpID();

     this.getTimesheetByEmpId();

  // this.getUsersInfo();
      this.toastr.success(data.desc);
      this.officeInput=false;
      this.manualInput=false;
      this.homeInput=false;
      this.showMap=true;
      this.selectedVal='';
      this.selectedGroupVal='empty';
      this.systemidText='';
  this.othersDataValue= '';
  this.showAdminTasks=false;
  this.groupModel=null;
  this.locationModel=null;
  this.manualInputValue=$('#manualInput').val();
  $('#toggleAdminCheck').prop('checked',false);
  $('#isTeam').prop('checked',false);
  this.teamValue='';
  this.filterEmpByDept=false;
  this.filterEmpByDesgn=false;
  this.teamMemberValue='';
  this.teamMembers=[];
  this.selectedDeptVal='';
  this.teamAdd=false;
  this.nearbyAddress='';
    }

    },
    error  => {
      this.spinner.hide();

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

}else if(typeOfCheckin=='Office' && this.boundryContain==false ){
  console.log('Officecheckinfalse')
  this.spinner.hide();

  Swal.fire(
    'Oops!',
    "Your current location isn't matched with the office location",
    'error'
  ).then(
    (result)=> {

    })

}
}
public FindTeamsByOrgID(){
  this.teamService.FindTeamsByOrgID().subscribe(

    (data:any) => {


var results=[]
      // let dataObj = JSON.parse(data['token']);
    //
    if(data){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items

        results.push({

            id: data[i].id,
            text: data[i].team_name,
            additional:{
              teamBy: data[i].team_by
          }



        });

        }

    }



this.teamData =results;

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

public onEditSubmit(){
  // this.timeLogForm.get('deptName').valueChanges
  // .subscribe((mode: string) => {
  //   if (mode) {
  //
  //   }
  // });
  // let date=document.getElementById('ntpDate').innerText;
  this.spinner.show();

  let postData={
    id:this.editDeptId,
    // ondate:moment(date).format('L'),
    check_in: this.timeLogForm.get('checkIn').value  ,
    check_out: this.timeLogForm.get('checkOut').value,



    }



      if (this.timeLogForm.get('checkIn').value !== '') {


          return this.timeService.updateTimeLog(postData).subscribe(
            (data:any)  => {
              // let dataObj = JSON.parse(data['token']);


            if(data.status==200){
              // this.toastr.success(data.desc);
this.spinner.hide();

              this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
           });

            }
            // this.router.navigate(["/organizations"]);

            },
            error  => {
this.spinner.hide();

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
// showModal(): void {
//   this.clockPickerDialogService.showClockPickerDialog(this.config).subscribe((time: string) =>
// }
public addLog () {
  // this.fetchDataGrid();

this.FetchAllProjectByOrgID();

  $('#time_log_modal').modal('show');

   // #myModal (id of modal box)
   this.maxAddLogEndTime=localStorage.getItem('currentTime');
  this.editable=false;
  //console.log('minOfficeActInputTime',this.minOfficeActInputTime);
  //  function show_popup() {
  //   $('#clockP').clockpicker({

  //   }),
     // clockpicker js
//}
// window.setTimeout(show_popup, 1000);

};
public openActivityLog  (element,isDisableTask) {
  if(isDisableTask){
    this.isDisableTask=true
  }
  this.act_proj_name='';
  this.act_sys_name='';
  this.act_formatted_address='';
  //this.GetAllAdministrative();
  this.GetAllTaskByEmpID();
  this.getTimesheetByEmpId();
  this.showPurposeToggle=true;
  this.maxAddLogEndTime=localStorage.getItem('currentTime');
  if(element.status_name=='Open'){
    this.allowUpdateStatus=true
  }else{
    this.allowUpdateStatus=false

  }
this.minStartTime=this.minOfficeActInputTime;
//   if(element.timesheetDataModels.length!=0){
//     let minTime=element.timesheetDataModels[0].check_in;
//     this.minStartTime=moment(minTime).format("hh:mm a");
//     let maxTime=element.timesheetDataModels[0].check_out;
//     if(maxTime!=null){
//      this.maxEndTime=moment(maxTime).format("hh:mm a");

//     }else{
//        this.maxEndTime=localStorage.getItem('currentTime');


//     }

//   }
//   if(element.timesheetProjectCategoryDataModel!=null ){
//     if(element.timesheetProjectCategoryDataModel.project_or_comp_id!=null){
//       this.projectId=element.timesheetProjectCategoryDataModel.project_or_comp_id;
//      this.fetchActByProjectID(element.timesheetProjectCategoryDataModel.project_or_comp_id);

//     }

//   }
//   this.activityGroupID=element.timesheetDataModels[0].groupid;
//  if(element.timesheetProjectCategoryDataModel!=null){


//    if(element.timesheetProjectCategoryDataModel.project_type=='Office' || element.timesheetProjectCategoryDataModel.project_type=='Manual' || element.timesheetProjectCategoryDataModel.project_type=='Place' )
//    {
//      this.showPurposeToggle=true;
//      if(element.timesheetSearchLocationViewModel.is_manual){
//        this.act_formatted_address=element.timesheetSearchLocationViewModel.manual_address

//      }else{
//        this.act_formatted_address=element.timesheetSearchLocationViewModel.geo_address

//      }

//    }else if(element.timesheetProjectCategoryDataModel.project_type=='Job' || element.timesheetProjectCategoryDataModel.project_type=='Case'  )
//    {
//      this.act_proj_name=element.timesheetProjectCategoryDataModel.project_type;
//      this.act_sys_name=element.timesheetProjectCategoryDataModel.project_or_comp_name;
//    this.showPurposeToggle=false;

//    }
//  }
//  else if(element.timesheetSearchLocationViewModel!=null) {

//    this.showPurposeToggle=true;


//  }else{

//  }
  $('#activity_log_modal').modal('show');
this.GetProjSubTaskonTaskID(element.id)
if(element.sub_task_id!=null){
  this.sub_taskId=element.sub_task_id+'/'+element.subtask_name

}else{
  this.sub_taskId=''
}
  setTimeout(() => {$('#taskField').prop('checked', true),
  this.showActivityTasks=true,
  this.showPurposeTasks=false,
this.projTaskDataValue=element.id,
this.projTaskDataText=element.task_name
console.log('projTaskDataValue',this.projTaskDataValue,this.taskWithDesc)

if(element.sub_task_id!=null){
  this.sub_taskId=element.sub_task_id+'/'+element.subtask_name

}else{
  this.sub_taskId=''
}
}, 500);


console.log('sub_task_id',element.sub_task_id);
this.activityLogForm.patchValue({
  endTime:moment().format("hh:mm a")
});
this.activityLogForm.get('endTime').enable();

this.actTaskStatusValue=element.status_id;

let user:object={};
if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));

}
if(element.assigned_empid==user['id'] || element.assigned_empid=='Anyone' ){
  this.enableActTaskStatus=false;
}else{
  this.enableActTaskStatus=true
}

if(element.project_id!=null){
  this.projectId=element.project_id;
  this.acttaskListValue=element.milestone_id;
  this.activityDataText=element.milestone_name;


}




};
public addActivity  (element) {
  let slider: Slider = new Slider({value: 30});
  this.isDisableTask=false;
// Render initialized Slider
slider.appendTo('#slider');

   this.act_proj_name='';
   this.act_sys_name='';
   this.act_formatted_address='';
   //this.GetAllAdministrative();
   this.GetAllTaskByEmpID();
   if(element.timesheetDataModels.length!=0){
     let minTime=element.timesheetDataModels[0].check_in;
     this.minStartTime=moment(minTime).format("hh:mm a");
     let maxTime=element.timesheetDataModels[0].check_out;
     if(maxTime!=null){
      this.maxEndTime=moment(maxTime).format("hh:mm a");
      this.maxCurrentTime= this.maxEndTime;

     }else{
        this.maxEndTime=localStorage.getItem('currentTime');
        this.maxCurrentTime= this.maxEndTime;


     }
     console.log('maxEndTime',this.maxEndTime);

   }
   if(element.timesheetProjectCategoryDataModel!=null ){
     if(element.timesheetProjectCategoryDataModel.project_or_comp_id!=null){
       this.projectId=element.timesheetProjectCategoryDataModel.project_or_comp_id;
      this.fetchActByProjectID(element.timesheetProjectCategoryDataModel.project_or_comp_id);

     }

   }
  //  this.GetAllTimesheetActivitys();
   this.activityGroupID=element.timesheetDataModels[0].groupid;
  // this.fetchDataGrid();
  if(element.timesheetProjectCategoryDataModel!=null){


    if(element.timesheetProjectCategoryDataModel.project_type=='Office' || element.timesheetProjectCategoryDataModel.project_type=='Manual' || element.timesheetProjectCategoryDataModel.project_type=='Place' )
    {
      this.showPurposeToggle=true;
      if(element.timesheetSearchLocationViewModel.is_manual){
        this.act_formatted_address=element.timesheetSearchLocationViewModel.manual_address

      }else{
        this.act_formatted_address=element.timesheetSearchLocationViewModel.geo_address

      }
      // this.act_formatted_address=element.timesheetSearchLocationViewModel.geo_address

    }else if(element.timesheetProjectCategoryDataModel.project_type=='Job' || element.timesheetProjectCategoryDataModel.project_type=='Case'  )
    {
      this.act_proj_name=element.timesheetProjectCategoryDataModel.project_type;
      this.act_sys_name=element.timesheetProjectCategoryDataModel.project_or_comp_name;
    this.showPurposeToggle=false;

    }
  }
  else if(element.timesheetSearchLocationViewModel!=null) {

    this.showPurposeToggle=true;

    // if(element.timesheetSearchLocationViewModel.is_manual){
    //   this.act_formatted_address=element.timesheetSearchLocationViewModel.manual_address

    // }else{
    //   this.act_formatted_address=element.timesheetSearchLocationViewModel.geo_address

    // }
  }else{

  }
   $('#activity_log_modal').modal('show');

  // #myModal (id of modal box)
  //  function show_popup() {
  //   $('#clockP').clockpicker({

  //   }),
     // clockpicker js
//}
// window.setTimeout(show_popup, 1000);

};
public fetchActByProjectID(projectId){
  let project_id={

      "ID": projectId

  }

  this.projectService.GetProjectActivityByProjectID(project_id).subscribe(

    (data:any) => {

var results=[{ id: '', text: 'Select' }]
var actFilter=[{ id: '', text: 'Milestone' }]
      // let dataObj = JSON.parse(data['token']);
    //
    if(data){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items

        results.push({

            id: data[i].id,
            text: data[i].activity_name




        });
        actFilter.push({

          id: data[i].id,
          text: data[i].activity_name




      });

        }
    }



this.activtasksList =results;
//this.milestFilterList =actFilter;

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
RemoveTimesheetActivity(projectId){
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:
      ' Confirm',
    cancelButtonText:
      'Cancel',
  }).then((result) => {
    if (result.value) {
      let project_id={
        "ID": projectId
      }
    this.timeService.RemoveTimesheetActivity(project_id).subscribe((data:any) => {
      this.getTimesheetByEmpId();
    },error  => {
    Swal.fire(
      'Error!',
      error,
      'error'
    ).then((result)=> {
            //  this.router.navigate(['/dashboard']);
     })})
    }
  })
}

public fetchMilestActByProjectID(projectId){
  let project_id={

      "ID": projectId

  }

  this.projectService.GetProjectActivityByProjectID(project_id).subscribe(

    (data:any) => {

var results=[{ id: '', text: 'Select' }]
var actFilter=[{ id: '', text: 'Milestone' }]
      // let dataObj = JSON.parse(data['token']);
    //
    if(data){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items


        actFilter.push({

          id: data[i].id,
          text: data[i].activity_name




      });

        }
    }



this.milestFilterList =actFilter;

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
public getAllOutsourcedEmpByOrgID(){
  this.empService.getAllOutsourcedEmpByOrgID().subscribe(

    (data:any) => {


var results=[{ id: '', text: 'Select' }]
      // let dataObj = JSON.parse(data['token']);
    //
    if(data){
      for (var i = 0; i <data && data.length; i++) {
        // logik to create new items

        results.push({

            id: data[i].id,
            text: data[i].full_name




        });

        }
    }



this.employeeData =results;

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
public onActivType(val){
  this.selectedActivVal=val;
  if(this.selectedActivVal='Activity'){
this.GetAllTimesheetActivitys();
  }
}

public onAddTimesheetActivity(){
  // this.spinner.show();
  this.addActformSubmitted=true;
  this.isRecentActFieldValid();

  let postData;
  if(this.activityLogForm.get('startTime').value){
    let startTime=this.activityLogForm.get('startTime').value;
    let endTime=this.activityLogForm.get('endTime').value;
  let date=moment().format('MM/DD/YYYY');
  this.startTime=date.concat(' ' +startTime) ;
  this.endTime=date.concat(' ' +endTime) ;
  }
  // this.LastAddedTimesheetActivityByEmpID(this.startTime,this.endTime)
  let sliderValue=this.sliderForm.get('slider').value*100;
  let taskValue='';
  let projtaskText='';
  if(this.projSubTaskData.length!=0){
    taskValue=this.projSubtaskListValue;
    projtaskText=this.projSubtaskText;
  }else{
    taskValue=this.projTaskDataValue;
    projtaskText=this.projTaskDataText;
  }

  if(this.planType=='Basic'){
     postData={
      "id": null,
      "groupid": this.activityGroupID ? this.activityGroupID:this.group_id,
      "org_id":localStorage.getItem('org_id'),
      "project_id":this.projectId,
     //"project_id":(!this.showPurposeTasks && !this.showActivityTasks && !this.showPurposeToggle && !this.showMeetingAct)?this.taskProjectId:this.projectId,

      "milestone_id": this.acttaskListValue?this.acttaskListValue:null,
      // "milestone_name":this.activityDataText?this.activityDataText:$("#activty_text").val(),
      "milestone_name":this.activityDataText?this.activityDataText:this.meetingTaskValueTxt,

      "task_id": this.projTaskDataValue?taskValue:null,
      "task_name":(this.projTaskDataValue && !this.showMeetingAct)?projtaskText:((this.showPurposeToggle && !this.showPurposeTasks && !this.showActivityTasks)?$("#actSubject_text").val():$("#subject_text").val()),

      // "task_name":(this.projTaskDataValue && !this.showMeetingAct)?(this.activityDataText?$("#actSubject_text").val():this.projTaskDataText):(this.activityDataText?$("#actSubject_text").val():$("#subject_text").val()),
      "status_id":sliderValue==100?this.completedStatID:(this.actTaskStatusValue!=''?this.actTaskStatusValue:null),
      // "subtask_id": this.selecteSubTaskValue?this.selecteSubTaskValue:null,
      "remarks": this.activityLogForm.get('remarks').value,
      "ondate": "",
      "start_time": this.startTime,
      "end_time": this.endTime,

      "is_billable": this.billable,
      "worked_percent":((this.showActivityTasks && !this.showPurposeTasks && this.projTaskDataValue!='') ||(!this.showPurposeTasks && !this.showActivityTasks && !this.showPurposeToggle && this.showprojTask  && !this.showMeetingAct))?sliderValue:null

    }
  }else{
    postData={
      "id": null,
      "groupid": this.activityGroupID ? this.activityGroupID:this.group_id,
      "org_id":localStorage.getItem('org_id'),

      // "project_id":(!this.showPurposeTasks && !this.showActivityTasks && !this.showPurposeToggle && !this.showMeetingAct)?this.taskProjectId:this.projectId,
      "project_id":this.projectId,

      //"project_id":this.activityDataText?this.projectId:this.typeValue,

      "milestone_id": this.acttaskListValue?this.acttaskListValue:null,
      // "milestone_name":this.activityDataText?this.activityDataText:$("#activty_text").val(),
      "milestone_name":this.activityDataText?this.activityDataText:this.meetingTaskValueTxt,
      "task_id": this.projTaskDataValue?taskValue:null,
      "task_name":(this.projTaskDataValue && !this.showMeetingAct)?projtaskText:((this.showPurposeToggle && !this.showPurposeTasks && !this.showActivityTasks)?$("#actSubject_text").val():$("#subject_text").val()),

      // "task_name":this.projTaskDataValue?this.projTaskDataText:null,
      // "task_name":(this.projTaskDataValue && !this.showMeetingAct)?this.projTaskDataText:$("#subject_text").val(),

      "status_id":sliderValue==100?this.completedStatID:(this.actTaskStatusValue!=''?this.actTaskStatusValue:null),


       // "subtask_id": this.selecteSubTaskValue?this.selecteSubTaskValue:null,
      "remarks": this.activityLogForm.get('remarks').value,
      "ondate": null,
      "start_time": this.startTime,
      "end_time": this.endTime,
      "is_billable": this.billable,
      "worked_percent":((this.showActivityTasks && !this.showPurposeTasks && this.projTaskDataValue!='') ||(!this.showPurposeTasks && !this.showActivityTasks && !this.showPurposeToggle && this.showprojTask  && !this.showMeetingAct))?sliderValue:null
    }
  }

  console.log('postData',postData);
  let sendData = {
    entity_id: this.projectId,
    event_type: "Added Activitie",
    event_desc: "Successfully lead Activitie Added",
  };
  this.histSer.AddEntityHistoryLog(sendData).subscribe((data)=> {
    console.log(data)
  });
  if(this.projTaskDataValue && this.allowUpdateStatus && sliderValue!=100){


    let postData={
      id: taskValue,

      status_id: this.inProgressStatID,


    }
    console.log('allowUpdateStatus',postData)

  }


if( this.activityLogForm.get('startTime').status=='VALID' &&
    this.activityLogForm.get('endTime').status=='VALID'  &&( !this.recentTaskSel && !this.recentActtxtSel && !this.recentActTaskSel) && this.timeinrange
&&((this.relatedValue!='' && this.relatedValue!='Select' && this.relatedValue!='NA') ?this.typeValue!='':true) && !this.startEqualEnd)
 {
  console.log('AddTimesheetActivityvalid')
 this.spinner.show();
return this.activityService.AddTimesheetActivity(postData).subscribe(
  (data:any)  => {

  if(data.status==200){

    if(this.projTaskDataValue && this.allowUpdateStatus && sliderValue!=100){

      console.log('allowUpdateStatusSucees',postData)

      let statusData={
        id: taskValue,

        status_id: this.inProgressStatID,


      }

      this.taskService.UpdateTaskStatus(statusData).subscribe(

        (data:any) => {

      if(data){


    this.allowUpdateStatus=false


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
  this.spinner.hide();
this.sliderForm.reset();
    $("#activity_log_modal").modal('hide');
this.maxCurrentTime=moment().add(2,'minutes').format('hh:mm a');

this.actCloseBtn.nativeElement.click();

   this.getTimesheetByEmpId();
this.showMeetingAct=false;

    $('#adminActivity').prop('checked', false);
    $('#meetingAct').prop('checked', false);
    $('#subject_text').value='';
    $('#actSubject_text').value='';

    $('#meetingAct').prop('checked', false);
this.showPurposeTasks=false;
this.showPurposeToggle=false;
this.projTaskDataValue='';
this.projTaskDataText='';
this.acttaskListValue='';
this.activityDataText='';
this.actTextInputValue='';
this.meetingTaskValue='';
this.sub_taskId='';
this.projSubtaskListValue='';
this.projSubtaskText='';
this.projSubTaskData=[];
this.relatedValue='';
this.typeValue='';
this.projectId=null;
this.recentTaskSel=false;
this.recentActtxtSel=false;
this.recentActTaskSel=false;
this.recentSubTaskSel=false;

this.activityLogForm.reset();
this.activityLogForm.patchValue({
  startTime:null,
  endTime:null
});
this.selectedActivVal='';
this.actTaskStatusValue='';
// this.GetAllTaskByEmpID();

if(this.jobFilterValue!='')
{
 this.getalltaskbyJob(this.jobFilterValue,'job');


}
else{
  this.GetAllTaskByEmpID();
 }

this.addActformSubmitted=false;
this.showActivityTasks=false;
this.sliderForm.get('slider').enable();
this.enableActTaskStatus=false;
$('#billable').prop('checked', false);
    this.toastr.success(data['desc'], undefined,{
      positionClass: 'toast-top-center'
 });

  }else{
  this.spinner.hide();

    Swal.fire(
      'Error!',
      data['desc'],
      'error'
    ).then(
      //used Arrow function here
      (result)=> {

        //  this.router.navigate(['/dashboard']);
      })
  }


  },
  error  => {
  this.spinner.hide();
  this.addActformSubmitted=false;

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
public ActInputChange(event){
    this.officeActInputValue=event.target.value;


}
public onAddOfficeTimesheetActivity(){
  this.addformSubmitted=true;
  this.isOfficeFieldValid();
  let postData;
  if(this.OfficeLogForm.get('startTime').value){
    let startTime=this.OfficeLogForm.get('startTime').value;
    let endTime=this.OfficeLogForm.get('endTime').value;
  let date=moment().format('MM/DD/YYYY');
  this.startOfficTime=date.concat(' ' +startTime) ;
  this.endOfficTime=date.concat(' ' +endTime) ;

  }

  let sliderValue=this.sliderForm.get('slider').value*100;

  // if(this.showPurposeTasks){
  //   this.activityReq
  // }
  let taskValue='';
  let officetaskText='';
  if(this.projSubTaskData.length!=0){
    taskValue=this.officeSubtaskListValue;
    officetaskText=this.officeSubtaskText;
  }else{
    taskValue=this.selectedActivGroupVal=='Activity'?(this.showActivityTasks && !this.showPurposeTasks)?this.projTaskDataValue:this.officetaskListValue:this.projTaskDataValue;
    officetaskText=this.selectedActivGroupVal=='Activity'?(this.showActivityTasks && !this.showPurposeTasks)?this.projTaskDataText:this.officetaskText:this.projTaskDataText;
  }
  console.log('projSubTaskData',this.projSubTaskData,this.projTaskDataValue)

  if(this.planType=='Basic'){
    postData={
     "id": null,
     "groupid": this.officegroupID ? this.officegroupID:'',
     "org_id":localStorage.getItem('org_id'),

     "project_id":this.selectedActivGroupVal=='Activity' ?(!this.showPurposeTasks && !this.showActivityTasks?this.typeValue :this.projectId):this.selecteJobOptionValue,
     "milestone_id": this.officeActListValue?this.officeActListValue:null,
     "milestone_name":this.selectedActivGroupVal=='Activity' ? (!this.showPurposeTasks && !this.showActivityTasks?this.officeActInputValue :(this.officeactText!=''?this.officeactText:null)):(this.officeactText!=''?this.officeactText:null),
     "task_id": this.selectedActivGroupVal!='Activity' ? (this.officetaskListValue?taskValue:null):(this.projTaskDataValue?(taskValue ):null),
     "task_name":this.selectedActivGroupVal!='Activity' ? (this.officetaskListValue?officetaskText:null):((!this.showPurposeTasks && !this.showActivityTasks)?$("#offactSubject_text").val():(this.projTaskDataValue?officetaskText:null)),
      // "milestone_name":this.activityDataText?this.activityDataText:$("#activty_text").val(),
      "status_id":sliderValue==100?this.completedStatID:(this.actTaskStatusValue!=''?this.actTaskStatusValue:null),

     // "subtask_id": this.selecteSubTaskValue?this.selecteSubTaskValue:null,
     "remarks": this.OfficeLogForm.get('remarks').value,
     "ondate":null,
     "start_time": this.startOfficTime,
     "end_time": this.endOfficTime,

     "is_billable": this.billable,
     "worked_percent":((this.showActivityTasks && !this.showPurposeTasks && this.projTaskDataValue!='') ||(!this.showPurposeTasks && !this.showActivityTasks && !this.showPurposeToggle && this.showprojTask  && !this.showMeetingAct))?sliderValue:null

   }
 }else{
   postData={
     "id": null,
     "groupid": this.officegroupID ? this.officegroupID:'',
     "org_id":localStorage.getItem('org_id'),

     "project_id":this.selectedActivGroupVal=='Activity' ?(!this.showPurposeTasks && !this.showActivityTasks?this.typeValue  :this.projectId):this.selecteJobOptionValue,
     "milestone_id": this.officeActListValue?this.officeActListValue:null,
     "milestone_name":this.selectedActivGroupVal=='Activity' ? (!this.showPurposeTasks && !this.showActivityTasks?this.officeActInputValue :(this.officeactText!=''?this.officeactText:null)):(this.officeactText!=''?this.officeactText:null),
    //  "task_id": this.selectedActivGroupVal!='Activity' ? (this.officetaskListValue?taskValue:null):(this.projTaskDataValue?(this.projTaskDataValue ):null),
    //  "task_name":this.selectedActivGroupVal!='Activity' ? (this.officetaskListValue?officetaskText:null):((!this.showPurposeTasks && !this.showActivityTasks)?$("#offactSubject_text").val():(this.projTaskDataValue?this.projTaskDataText:null)),
    "task_id": this.selectedActivGroupVal!='Activity' ? (this.officetaskListValue?taskValue:null):(this.projTaskDataValue?(taskValue ):null),
    "task_name":this.selectedActivGroupVal!='Activity' ? (this.officetaskListValue?officetaskText:null):((!this.showPurposeTasks && !this.showActivityTasks)?$("#offactSubject_text").val():(this.projTaskDataValue?officetaskText:null)),
     // "subtask_id": this.selecteSubTaskValue?this.selecteSubTaskValue:null,
     "status_id":sliderValue==100?this.completedStatID:(this.actTaskStatusValue!=''?this.actTaskStatusValue:null),

     "remarks": this.OfficeLogForm.get('remarks').value,
     "ondate": null,
     "start_time": this.startOfficTime,
     "end_time": this.endOfficTime,
     "is_billable": this.billable,
     "worked_percent":((this.showActivityTasks && !this.showPurposeTasks && this.projTaskDataValue!='') ||(!this.showPurposeTasks && !this.showActivityTasks && !this.showPurposeToggle && this.showprojTask  && !this.showMeetingAct))?sliderValue:null

   }
 }
 let typeValid=true
 if(this.relatedValue!='' && this.relatedValue!='Select' && this.relatedValue!='NA' && this.typeValue!='' ){
  typeValid=true
console.log('typeValid')
 }else if(this.relatedValue!='' && this.relatedValue!='Select' && this.relatedValue!='NA' && this.typeValue=='' ){
  typeValid=false
  console.log('typeINValid')

 }
//  if(this.officeSubtaskListValue && this.allowOfficUpdateStat && sliderValue!=100 ){
//   let postData={
//     id: taskValue,
//     status_id: this.inProgressStatID,
//   }
//   console.log('allowOfficUpdateStat',postData)
// }
console.log('typeValid',typeValid)
if( this.OfficeLogForm.get('startTime').status=='VALID' &&
this.OfficeLogForm.get('endTime').status=='VALID' &&  (typeValid===true)  &&
 (this.selectedActivGroupVal=='Activity' )?(!this.showActivityTasks?this.officeActInputValue!='':!this.taskSel):this.officeActListValue!='' && this.timeinrange && !this.offcStartEqualEnd
){
  console.log('offcvalid',this.typeValue,this.relatedValue);
  typeValid=true;
   this.spinner.show();

  return this.activityService.AddTimesheetActivity(postData).subscribe(
    (data:any)  => {

    if(data.status==200){
      if(this.jobFilterValue!='')
{
this.getalltaskbyJob(this.jobFilterValue,'job');
}else{
  this.GetAllTaskByEmpID();
}
      if(this.officeSubtaskListValue && this.allowOfficUpdateStat && sliderValue!=100 ){


        let statusData={
          id: taskValue,

          status_id: this.inProgressStatID,


        }

        this.taskService.UpdateTaskStatus(statusData).subscribe(

          (data:any) => {

        if(data){


     this.allowOfficUpdateStat=false


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
      this.timeLogBtn.nativeElement.click();

      $("#time_log_modal").modal('hide');
     this.getTimesheetByEmpId();
this.sliderForm.reset();
$('#subject_text').value='';

      this.spinner.hide();
     this.addformSubmitted=false;

      $("#officeActivityInput").val("");
  this.showPurposeTasks=false;
  this.showPurposeToggle=false;
  this.selectedActivGroupVal='empty';
  this.selecteJobOptionValue=''
  $('#activityInput').value='';
  this.OfficeLogForm.reset();
  this.OfficeLogForm.patchValue({
    startTime:'',
    endTime:moment().format('L')
  });
  this.AdminTaskValue='';
  this.projTaskDataValue='';
  this.selecteJobOptionValue='';
  this.officeActListValue='';
  this.officeActInputValue='';
  this.officeactText='';
 this.sub_taskId='';

  this.addOfficAdminAct=false;

  this.projTaskDataValue='';
  this.projTaskDataText='';
  this.meetingTaskValue='';
this.relatedValue='';
this.typeValue='';
this.projSubTaskData=[];
this.officetaskListValue='';
this.projSubtaskListValue='';
this.projSubtaskText='';
this.showActivityTasks=false,
  this.activityLogForm.reset();
  this.sliderForm.get('slider').enable()
  $('#billable').prop('checked', false);
      this.toastr.success(data['desc'], undefined,{
        positionClass: 'toast-top-center'
   });

    }else{
      this.spinner.hide();

        Swal.fire(
          'Error!',
          data['desc'],
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })
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
isOfficeFieldValid() {
  if(this.addformSubmitted){
    if(this.selectedActivGroupVal=='Activity' && this.addOfficAdminAct && this.showPurposeTasks && this.AdminTaskValue==''){
this.adminSel=true;
    }else if(this.selectedActivGroupVal!='Activity' && this.showActivityTasks && !this.showPurposeTasks && this.projTaskDataValue=='' ){
      this.taskSel=true;
          }else if(this.selectedActivGroupVal=='Activity' &&  this.officeActInputValue=='' && !this.showActivityTasks){
this.actTxt=true;
          }
          else{
this.adminSel=false;
this.taskSel=false;

          }
  }

  else{

    return (
   // this.showerrorMsg=false,

      false
    );
  }

}
isRecentActFieldValid() {
  if(this.addActformSubmitted){
    if( !this.showPurposeTasks && !this.showActivityTasks && !this.showPurposeToggle && this.acttaskListValue==""){
this.recentActSel=true;
    }
    else if( !this.showPurposeTasks && !this.showActivityTasks && !this.showPurposeToggle && this.showprojTask && this.projTaskDataValue=="" ){
      this.recentTaskSel=true;
          }

    else if( this.showPurposeToggle && !this.showPurposeTasks && !this.showActivityTasks && this.actTextInputValue=='' ){
      this.recentActtxtSel=true;
          }
          else if( this.showPurposeTasks &&  this.AdminTaskValue=='' ){
            this.recentActAdminSel=true;
                }
                else if( !this.showPurposeTasks && this.showActivityTasks && this.projTaskDataValue=='' ){
                  this.recentActTaskSel=true;
                      }
          else if(  this.officeActInputValue=='' && !this.showActivityTasks){
this.actTxt=true;
          }
          else{
this.adminSel=false;
this.taskSel=false;

          }
  }

  else{

    return (
   // this.showerrorMsg=false,

      false
    );
  }

}
isFieldValid(field: string) {
  if(this.addformSubmitted){

    return (
    this.showerrorMsg=true,
      this.OfficeLogForm.get(field).errors && this.OfficeLogForm.get(field).touched ||
      this.OfficeLogForm.get(field).untouched &&
      this.addformSubmitted
    );
  }

  else{

    return (
    this.showerrorMsg=false,

      false
    );
  }
  // return (
  //   this.projectForm.get(field).errors && this.projectForm.get(field).touched ||
  //   this.projectForm.get(field).untouched &&
  //   this.formSubmitted && this.projectForm.get(field).errors  && this.projectForm.get(field).errors.patternValidator

  // );
}
isActivityLogFieldValid(field: string) {
  if(this.addActformSubmitted){

    return (
    this.showerrorMsg=true,
      this.activityLogForm.get(field).errors && this.activityLogForm.get(field).touched ||
      this.activityLogForm.get(field).untouched &&
      this.addActformSubmitted
    );
  }

  else{

    return (
    this.showerrorMsg=false,

      false
    );
  }
  // return (
  //   this.projectForm.get(field).errors && this.projectForm.get(field).touched ||
  //   this.projectForm.get(field).untouched &&
  //   this.formSubmitted && this.projectForm.get(field).errors  && this.projectForm.get(field).errors.patternValidator

  // );
}
public onAddTimesheetAdminActivity(){
this.addActformSubmitted=true;
this.isRecentActFieldValid();
  if(this.activityLogForm.get('startTime').value){
    let startTime=this.activityLogForm.get('startTime').value;
    let endTime=this.activityLogForm.get('endTime').value;
  let date=moment().format('MM/DD/YYYY');
  this.startTime=date.concat(' ' +startTime) ;
  this.endTime=date.concat(' ' +endTime) ;
  }
  let postData={
    "id": null,
    "administrative_id":(this.planType=='Basic'?this.AdminTaskValue:( this.AdminTaskValue)),
    "groupid": this.activityGroupID ? this.activityGroupID:'',
    "purpose": this.activityLogForm.get('purpose').value,
    "remarks": this.activityLogForm.get('remarks').value,
    "ondate": "",
    "start_time": this.startTime,
    "end_time": this.endTime,

    "is_deleted": true
  }
  if( this.activityLogForm.get('startTime').value!=='' &&
    this.activityLogForm.get('endTime').value!==''  &&(  !this.recentActAdminSel)

 ){


  this.spinner.show();

 return this.activityService.AddTimesheetAdminActivity(postData).subscribe(
  (data:any)  => {

  if(data.status==200){
    $("#activity_log_modal").modal('hide');
this.actCloseBtn.nativeElement.click();
this.maxCurrentTime=moment().add(2,'minutes').format('hh:mm a');

   this.getTimesheetByEmpId();

    // this.getUsersInfo();
  this.spinner.hide();

    this.showPurposeToggle=false;
this.showActivityTasks=false;
this.showPurposeTasks=false;
    this.OfficeLogForm.reset();
    this.selectedActivVal='';
this.addActformSubmitted=false;

    this.AdminTaskValue='';
    this.toastr.success(data['desc'], undefined,{
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

}

public onAddOfficeTimesheetAdminActivity(){
this.addformSubmitted=true;
this.isOfficeFieldValid();

  if(this.OfficeLogForm.get('startTime').value){
    let startTime=this.OfficeLogForm.get('startTime').value;
    let endTime=this.OfficeLogForm.get('endTime').value;
  let date=moment().format('MM/DD/YYYY');
  this.startTime=date.concat(' ' +startTime) ;
  this.endTime=date.concat(' ' +endTime) ;
  }
  let postData={
    "id": null,
    "administrative_id":(this.planType=='Basic'?this.AdminTaskValue:( this.AdminTaskValue)),
    "groupid": this.officegroupID ? this.officegroupID:'',

    "purpose": this.OfficeLogForm.get('purpose').value,
    "remarks": this.OfficeLogForm.get('remarks').value,
    "ondate": "",
    "start_time": this.startTime,
    "end_time": this.endTime,

    "is_deleted": true
  }
//
if( this.OfficeLogForm.get('startTime').value!='' &&
this.OfficeLogForm.get('endTime').value!='' && this.OfficeLogForm.get('purpose').value!='' &&
 (this.selectedActivGroupVal=='Activity' )?!this.adminSel:''){

this.spinner.show();

 return this.activityService.AddTimesheetAdminActivity(postData).subscribe(
  (data:any)  => {

  if(data.status==200){
    $("#time_log_modal").modal('hide');
   this.getTimesheetByEmpId();
   this.timeLogBtn.nativeElement.click();

    this.showPurposeToggle=false;
this.showActivityTasks=false;
this.showPurposeTasks=false;
this.spinner.hide();
this.selectedActivVal='';
this.addformSubmitted=false;

    this.OfficeLogForm.reset();
    this.selectedActivVal='';
    this.selectedActivGroupVal='Jobs';
    this.actTxt=false;
    this.AdminTaskValue='';
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
      (result)=> {

      })


  }

  )
}

}

public GetAllTimesheetActivitys(){
  return this.activityService.GetAllTimesheetActivitys().subscribe(
    (data:any)  => {
      // let dataObj = JSON.parse(data['token']);

    if(data.status==200){

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
public OnActivityClose (){
 $('#adminActivity').prop('checked', false);
 $('#taskField').prop('checked', false);
 $('#meetingAct').prop('checked', false);
this.showMeetingAct=false;

this.showPurposeTasks=false;
this.showActivityTasks=false;
this.taskListValue='';
this.meetingTaskValue='';

this.activityLogForm.reset();
$('#billable').prop('checked', false);
$('#activity_log_modal').modal('hide');
this.maxCurrentTime=moment().add(2,'minutes').format('hh:mm a');
this.actCloseBtn.nativeElement.click();
console.log('actfILETR',this.activityFilterValue);
this.projTaskDataValue='';
this.showprojTask=false;
this.acttaskListValue='';
this.activityDataText='';
this.projectId=null;
this.projSubtaskListValue='';

  this.selectedActivVal='';
  this.AdminTaskValue='';
this.recentActTaskSel=false;
  this.startEqualEnd=false;
  this.addActformSubmitted=false;
  this.sliderForm.reset();
  this.sub_taskId='';
this.relatedValue='';
this.typeValue='';


if(this.jobFilterValue!='')
{
this.getalltaskbyJob(this.jobFilterValue,'job');
}

this.activityLogForm.get('timeRadio').disable()
this.errorTimeExcced = false

}
getChangeList(): Select2OptionData[] {
  return [
      {
          id: '0',
          text: 'Cars',
          children: [
              {
                  id: 'car1',
                  text: 'Car 1'
              },
              {
                  id: 'car2',
                  text: 'Car 2'
              },
              {
                  id: 'car3',
                  text: 'Car 3'
              }
          ]
      },
      {
          id: '0',
          text: 'Planes',
          children: [
              {
                  id: 'plane1',
                  text: 'Plane 1'
              },
              {
                  id: 'plane2',
                  text: 'Plane 2'
              },
              {
                  id: 'plane3',
                  text: 'Plane 3'
              }
          ]
      }
  ];
}
public startTimeChanged(){
  this.disableEndTime=false;

  this.activityLogForm.get('startTime').valueChanges.subscribe(() => {
    // fires when the input value has actually changed
    if(this.activityLogForm.get('startTime').value!=''){
      this.startValChange=true;
    }
    let startTime=this.activityLogForm.get('startTime').value;
    this.minEndTime=startTime;

    this.activityLogForm.get('endTime').enable()
    this.activityLogForm.get('timeRadio').enable()
    this.activityLogForm.patchValue({
      endTime:''
    })


});
/**
 * name
 */


}


radioChange(value){
  let startTime=this.activityLogForm.get('startTime').value;
  let CurrentTime = moment().format('hh:mm a');
  if(value === 15){
    this.activityLogForm.patchValue({
      endTime:moment(startTime, 'hh:mm a').add(15, 'minutes').format('hh:mm a')
    })

    if((new Date(moment().format('YYYY-MM-DD')+' '+this.activityLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
      this.activityLogForm.patchValue({
        endTime:moment().format('hh:mm a')
      });
      console.log("current Time", CurrentTime,", Start Time", this.activityLogForm.get('startTime').value, ", end Time", this.activityLogForm.get('endTime').value)
      this.errorTimeExcced = true;
    }else{
      console.log("current Time", CurrentTime,", Start Time", this.activityLogForm.get('startTime').value, ", end Time", this.activityLogForm.get('endTime').value)
      this.errorTimeExcced = false;
    }

  }else if(value === 30){
    this.activityLogForm.patchValue({
      endTime:moment(startTime, 'hh:mm a').add(30, 'minutes').format('hh:mm a')
    })

    if((new Date(moment().format('YYYY-MM-DD')+' '+this.activityLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
      this.activityLogForm.patchValue({
        endTime:moment().format('hh:mm a')
      });
      console.log("current Time", CurrentTime,", Start Time", this.activityLogForm.get('startTime').value, ", end Time", this.activityLogForm.get('endTime').value)
      this.errorTimeExcced = true;
    }else{
      console.log("current Time", CurrentTime,", Start Time", this.activityLogForm.get('startTime').value, ", end Time", this.activityLogForm.get('endTime').value)
      this.errorTimeExcced = false;
    }

  }else if(value === 60){
    this.activityLogForm.patchValue({
      endTime:moment(startTime, 'hh:mm a').add(60, 'minutes').format('hh:mm a')
    })

    if((new Date(moment().format('YYYY-MM-DD')+' '+this.activityLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
      this.activityLogForm.patchValue({
        endTime:moment().format('hh:mm a')
      });
      console.log("current Time", CurrentTime,", Start Time", this.activityLogForm.get('startTime').value, ", end Time", this.activityLogForm.get('endTime').value)
      this.errorTimeExcced = true;
    }else{
      console.log("current Time", CurrentTime,", Start Time", this.activityLogForm.get('startTime').value, ", end Time", this.activityLogForm.get('endTime').value)
      this.errorTimeExcced = false;
    }

  }else if(value === 90){
    this.activityLogForm.patchValue({
      endTime:moment(startTime, 'hh:mm a').add(90, 'minutes').format('hh:mm a')
    })

    if((new Date(moment().format('YYYY-MM-DD')+' '+this.activityLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
      this.activityLogForm.patchValue({
        endTime:moment().format('hh:mm a')
      });
      console.log("current Time", CurrentTime,", Start Time", this.activityLogForm.get('startTime').value, ", end Time", this.activityLogForm.get('endTime').value)
      this.errorTimeExcced = true;
    }else{
      console.log("current Time", CurrentTime,", Start Time", this.activityLogForm.get('startTime').value, ", end Time", this.activityLogForm.get('endTime').value)
      this.errorTimeExcced = false;
    }

  }
}

radioCahngeOne(value){
  let startTime=this.OfficeLogForm.get('startTime').value;
  let CurrentTime = moment().format('hh:mm a');
  if(value === 15){
    this.OfficeLogForm.patchValue({
      endTime:moment(startTime, 'hh:mm a').add(15, 'minutes').format('hh:mm a')
    })

    if((new Date(moment().format('YYYY-MM-DD')+' '+this.OfficeLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
      this.OfficeLogForm.patchValue({
        endTime:moment().format('hh:mm a')
      });
      console.log("current Time", CurrentTime,", Start Time", this.OfficeLogForm.get('startTime').value, ", end Time", this.OfficeLogForm.get('endTime').value)
      this.errorTimeExccedOne = true;
    }else{
      console.log("current Time", CurrentTime,", Start Time", this.OfficeLogForm.get('startTime').value, ", end Time", this.OfficeLogForm.get('endTime').value)
      this.errorTimeExccedOne = false;
    }

  }else if(value === 30){
    this.OfficeLogForm.patchValue({
      endTime:moment(startTime, 'hh:mm a').add(30, 'minutes').format('hh:mm a')
    })

    if((new Date(moment().format('YYYY-MM-DD')+' '+this.OfficeLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
      this.OfficeLogForm.patchValue({
        endTime:moment().format('hh:mm a')
      });
      console.log("current Time", CurrentTime,", Start Time", this.OfficeLogForm.get('startTime').value, ", end Time", this.OfficeLogForm.get('endTime').value)
      this.errorTimeExccedOne = true;
    }else{
      console.log("current Time", CurrentTime,", Start Time", this.OfficeLogForm.get('startTime').value, ", end Time", this.OfficeLogForm.get('endTime').value)
      this.errorTimeExccedOne = false;
    }

  }else if(value === 60){
    this.OfficeLogForm.patchValue({
      endTime:moment(startTime, 'hh:mm a').add(60, 'minutes').format('hh:mm a')
    })

    if((new Date(moment().format('YYYY-MM-DD')+' '+this.OfficeLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
      this.OfficeLogForm.patchValue({
        endTime:moment().format('hh:mm a')
      });
      console.log("current Time", CurrentTime,", Start Time", this.OfficeLogForm.get('startTime').value, ", end Time", this.OfficeLogForm.get('endTime').value)
      this.errorTimeExccedOne = true;
    }else{
      console.log("current Time", CurrentTime,", Start Time", this.OfficeLogForm.get('startTime').value, ", end Time", this.OfficeLogForm.get('endTime').value)
      this.errorTimeExccedOne = false;
    }

  }else if(value === 90){
    this.OfficeLogForm.patchValue({
      endTime:moment(startTime, 'hh:mm a').add(90, 'minutes').format('hh:mm a')
    })

    if((new Date(moment().format('YYYY-MM-DD')+' '+this.OfficeLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
      this.OfficeLogForm.patchValue({
        endTime:moment().format('hh:mm a')
      });
      console.log("current Time", CurrentTime,", Start Time", this.OfficeLogForm.get('startTime').value, ", end Time", this.OfficeLogForm.get('endTime').value)
      this.errorTimeExccedOne = true;
    }else{
      console.log("current Time", CurrentTime,", Start Time", this.OfficeLogForm.get('startTime').value, ", end Time", this.OfficeLogForm.get('endTime').value)
      this.errorTimeExccedOne = false;
    }

  }
}




public endTimeChanged(){


  this.activityLogForm.get('endTime').valueChanges.subscribe(() => {
    // fires when the input value has actually changed
    if(this.activityLogForm.get('startTime').value==this.activityLogForm.get('endTime').value){
      this.startEqualEnd=true;
    }else{
      this.startEqualEnd=false;

    }



});
/**
 * name
 */




}
endOfficeTimeChanged(){


  this.OfficeLogForm.get('endTime').valueChanges.subscribe(() => {
    // fires when the input value has actually changed
    if(this.OfficeLogForm.get('startTime').value==this.OfficeLogForm.get('endTime').value){
      this.offcStartEqualEnd=true;
    }else{
      this.offcStartEqualEnd=false;

    }



});
/**
 * name
 */




}

public startOfficeTimeChanged() {

  this.OfficeLogForm.get('startTime').valueChanges.subscribe(() => {
    // fires when the input value has actually changed
    let startTime=this.OfficeLogForm.get('startTime').value;
    this.minEndTime=startTime;

    this.OfficeLogForm.get('endTime').enable()
    this.OfficeLogForm.get('radioOption').enable()

    this.OfficeLogForm.patchValue({
      endTime:''
    })
  });

}
/**
 *  RemoveTimesheet
 */
 public RemoveTimesheet(element) {
  let value = JSON.parse(localStorage.getItem('is_checkout'))
  if(value === true){
    console.log('delete')
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      // confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText:
        'Cancel',
      // cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
      if (result.value) {

      let postData={
        ID:element.timesheetDataModels[0].id
      }
      this.timeService.RemoveTimesheet(postData).subscribe(
        (data:any)  => {
          if(data.status==200){
            this.getTimesheetByEmpId();
            // this.getUsersInfo();
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
          ).then((result)=> {})
        })
      } else{ }
    })
  }else {
    console.log('No delete')
    Swal.fire(
      'Cannot Delete',
      'You have to checkout in order to delete',
      'error'
    )
  }


}
public closeMdModal(){
  this.getTimesheetByEmpId();

  // this.getUsersInfo();
  // this.geoCoder = new google.maps.Geocoder;
  this.getCurrentPoslatlng();
  this.setCurrentLocation();
this.spinner.show();
  this.showPurpose=false;
  this.showTask=false;
  this.showActivities=false;
  this.isCheckout=true;
  if(localStorage.getItem('currentTime')){
    let checkoutIME=localStorage.getItem('currentTime');
    let date=moment().format('MM/DD/YYYY');
    this.checkOutTime=date.concat(' ' +checkoutIME) ;
  }
  if(this.currentPoslat==undefined){

setTimeout(() => {
  /** spinner ends after 5 seconds */

 if(this.currentPoslat==undefined){
  $("#checkout_modal").removeClass("md-show");
  Swal.fire({

    title: 'Location Access Denied',
    text: "Please turn on the location access for checkout",
    type: 'warning',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
cancelButtonText: 'CANCEL!',
}).then(
  (result) => {
//       if (result.value) {


// }
})  //         this.spinner.show();



  console.log('undefinedLOC',this.searchLocVal)

}
  }, 100);

 }
 else{
    this.getByCheckOutID();

  }

}
addTask(){
  $("#task_log_modal").modal('show');
}
OnTaskClose(){
    $("#task_log_modal").modal('hide');
   this.taskCloseBtn.nativeElement.click();


}
loadscript(){
 // window.location.reload();
 this.loadAPI = new Promise((resolve) => {

  // this.loadScript();
  let node = document.createElement('script');
  node.src = url;
  node.type = 'text/javascript';
  node.async = true;
  node.charset = 'utf-8';
  document.getElementsByTagName('head')[0].appendChild(node);
});

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

    public leavesetupChange(id){
      this.leaveSetupid=id;

      //
      // if(this.projectForm.get('prefixVal').value=='is_custom'){
      //   this.showPrefixText=true;

      // }else{
      //   this.showPrefixText=false;
      //  // this.FindAutoProjectPrefixByOrgID();

      // }
    }
    public  getAllEmployee(){
      this.empService.getEmployeeByOrgId().subscribe(

        (data:any) => {
          var results=[{ id: '', text: 'Select' }]

          // let dataObj = JSON.parse(data['token']);
        //
        let user_info= JSON.parse(localStorage.getItem('user_info'));


          for (var i = 0; i < data.length; i++) {
            // logik to create new items
        if(user_info['id']!=data[i].id){

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
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )
        }
        public ApplyLeave(){
     this.router.navigate(["/leave-details"]);

        }
        public  PushNotifyByEmpID(){

          this.notifyService.PushNotifyByEmpID().subscribe(

            (data:any) => {


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

public onAddEmpLeave(){
  let user_info= JSON.parse(localStorage.getItem('user_info'));
// if(user_info['id']!=data[i].id){
  let leavePeriod=this.dateRangeForm.get('daterangeAtt').value;

  this.addleaveformSubmitted=true;
  let leave_id;
  for(var i=0;i<this.leaveStatusData.length;i++){
    if(this.leaveStatusData[i].leave_status_name=="Pending"){
      leave_id=this.leaveStatusData[i].id;

    }
  }

  // let leave_status_id=this.leaveStatusData.map(function (leave) {
  //   if(leave.leave_status_name=="Pending"){
  //     return leave.id

  //   }
  // })

  let postData={
"org_id": localStorage.getItem('org_id'),
"emp_id": user_info['id'],
"leave_setup_id":  this.leaveSetupid,
"leave_start_date": moment(leavePeriod[0]).format('L'),
"leave_end_date": moment(leavePeriod[1]).format('L'),
"leave_days": this.leaveSpan,
"ondate_applied":  moment().format('L'),
"approver_emp_id": this.approverTaskValue,
"leave_status_id":leave_id,
"is_approved": false,
"approve_start_date": null,
"approve_end_date": null,
"approved_days": null,
"ondate_approved": null,
"emp_notes": this.leaveForm.get('desc').value,
"createdby": user_info['full_name'],
  }

  if(this.leaveForm.status=="VALID" && this.dateRangeForm.status=="VALID"){
this.spinner.show();
  return this.leaveService.AddEmployeeLeave(postData).subscribe(
    (data:any)  => {
      // let dataObj = JSON.parse(data['token']);

    if(data.status==200){
this.spinner.hide();
  this.addleaveformSubmitted=false;
  this.approverTaskValue='';
  this.leaveForm.reset();
      this.toastr.success(data['desc'], undefined,{
        positionClass: 'toast-top-center'
   });

$("#leave_modal").modal('hide');

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
}
changedTaskApprover(e){
  this.approverTaskValue=e.value;
  }
ngOnInit() {
  verifyDelegateUserControl()
  this.getAllStatus();
  this.FetchTimeOffSetupOrgID();
  this.getAllActivity();
  this.GetProjByOrgID();
  this.GetProjectListByEmpID();
  this.GetAllTaskDescByEmpID();
  if(this.setDragRadius==200){
    this.allowDrag=true;
  }else{
    this.allowDrag=false;

  }
  this.maxAddLogEndTime=localStorage.getItem('currentTime');
  // this.sliderForm = this.fb.group({
  //   'slider': [0, Validators.min(10)]
  // });
//   let cdate = new Date();
// cdate.setHours(cdate.getHours()-2);
// this.countupTimerService.startTimer(cdate);
  this.testConfig = new countUpTimerConfigModel();

  //custom class
  this.testConfig.timerClass  = 'test_Timer_class';

  //timer text values
  this.testConfig.timerTexts = new timerTexts();
  this.testConfig.timerTexts.hourText = ":"; //default - hh
  this.testConfig.timerTexts.minuteText = ":"; //default - mm
  this.testConfig.timerTexts.secondsText = " "; //default - ss


  //this.setCurrentPosition();
  // if(localStorage.getItem('timeLeft')){
    //  this.disableAddLog=false;

  // }
  // $('.e-input .e-lib .e-keyboard').attr("disabled","");

  // this.getCurrentPoslatlng();
  this.loadscript();
  if(localStorage.getItem('planType')=='winter'){

    this.planType='Basic'
  }

  $.getScript('assets/modaljs/modernizr.custom.js')
     $.getScript('assets/modaljs/classie.js')
     $.getScript('assets/modaljs/modalEffects.js')
  this.showPurposeTasks=false;
 this.OrgId=localStorage.getItem('org_id');

  // this.mapsAPILoader.load().then(() => {
  //   this.setCurrentLocation();

  // this.geoCoder = new google.maps.Geocoder;
  // })

  var s1 = document.createElement("script");
  s1.type = "text/javascript";
  s1.src = "../../../assets/js/audioTimer.js";
  this.EmpList();


  // this.getUsersInfo();
  this.getTimesheetByEmpId();

  this.LastCheckinByEmpID();

    this.GetAllTaskByEmpID();
//this.getalltaskbyJob('','')

  //  this.EmpList();
  this.timeLogForm = new FormGroup({
    checkIn: new FormControl('', [Validators.required]),
    checkOut: new FormControl(''),
    // email: new FormControl('', [Validators.required]),



 });
 this.ActTaskLogForm = new FormGroup({
  startTime: new FormControl('', [Validators.required]),
  endTime: new FormControl(''),
  remarks:new FormControl('')
  // email: new FormControl('', [Validators.required]),



});

this.dateRangeForm = new FormGroup({
  daterangeAtt: new FormControl('', [Validators.required]),





});
this.leaveForm = new FormGroup({
  desc:new FormControl('', [Validators.required]),
  leaveType:new FormControl('', [Validators.required]),



});
 this.activityLogForm = new FormGroup({
  startTime: new FormControl(  '', [Validators.required]),
  endTime: new FormControl('', [Validators.required]),
  remarks:new FormControl(''),
  purpose:new FormControl(''),
  timeRadio:new FormControl(''),
  // email: new FormControl('', [Validators.required]),



});
this.activityLogForm.get('endTime').valueChanges.subscribe(() => {
  // fires when the input value has actually changed
  if(this.activityLogForm.get('endTime').value!=''){
    this.endValChange=true;
  }else
  {
    this.endValChange=false;

  }



});

this.OfficeLogForm = new FormGroup({
  startTime: new FormControl(  '', [Validators.required]),
  endTime: new FormControl('', [Validators.required]),
  remarks:new FormControl(''),
  purpose:new FormControl(''),
  radioOption:new FormControl(''),

  // email: new FormControl('', [Validators.required]),



});
this.OfficeLogForm.get('endTime').disable();
this.OfficeLogForm.get('radioOption').disable()

this.OfficeLogForm.get('startTime').valueChanges.subscribe(() => {
  this.OfficeLogForm.get('endTime').enable();

    // fires when the input value has actually changed
    if(this.OfficeLogForm.get('endTime').value!=''){
      this.endValChange=true;
    }else
    {
      this.endValChange=false;

    }



  });

this.activityLogForm.get('endTime').disable();
this.activityLogForm.get('timeRadio').disable();
  $('#time_log_modal').on('shown.bs.modal', function() {


  $('#editTeamModal').click(function (){

    $('#team_modal').modal('show');
   });
   $.getScript('assets/js/teamPanel.js')

    // $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js');
    // $.getScript('https://cdnjs.cloudflare.com/ajax/libs/clockpicker/0.0.7/bootstrap-clockpicker.min.js');
    //$.getScript('assets/js/pages/crud/forms/widgets/bootstrap-timepicker.js');

  // $('#clockP').clockpicker({

  //   placement: 'bottom',
  //   align: 'left',
  //   donetext: 'Done',
  //   afterDone: () => {
  //
  //   }})


  })

// $('#toggleCheck').on('change', function() {
//   if ($(this).is(':checked')) {

//     $("#team_modal").modal('show');


//   }
// });




// $('#toggleCheck').prop('checked',true);
// $('#toggleCheck').attr('checked', true);
// $('#myCheckbox').prop('checked', false);

$( '#kt_modal_2' ).on('hide', function () {

  //actions you want to perform after modal is closed.
});

  this.teamOptions={
    templateResult: this.templateResult,
    templateSelection: this.templateSelection
  }
  this.jobOptions={
    placeholder:"Select",
    width: "100%",
    templateResult: this.templateResult,
    templateSelection: this.templateSelection,

  }
  this.taskDescOptions={
    placeholder:"Select",
    width: "100%",
    templateResult: this.taskDescResult,
    templateSelection: this.taskDescSelection,

  }

  this.options = {
    multiple: true,
    placeholder: "Select",
    // allowClear: true,
    width: "100%",
    templateResult: this.templateResult,
    templateSelection: this.templateSelection
  }
  this.teamOptions = {
    multiple: true,
    placeholder: "Select Team",
    width: "100%",
    templateResult: this.templateResult,
    templateSelection: this.templateSelection
  }
  this.otherOptions={
    multiple: true,
    placeholder:"Select",
    width: "100%",
  }
  this.deptOptions={
    placeholder: { id: '  ', text: 'Select' },  allowClear: true,
    width:'100%'
  }
  this.activityOptions={
    placeholder:"Select",
    width: "100%",
  }
  this.jobFilterOptions={
    placeholder:"Job",
    width: "100%",
  }
  this.activityFilterOptions={
    placeholder:"Milestone",
    width: "100%",
  }
  this.taskFilterOptions={
    placeholder:"Task",
    width: "100%",
  }
  this.filterSettings = { type: 'Menu' };


//this.editData=orderData;
this.editSettings = { allowEditing: true,allowSorting:true, allowAdding: true, allowDeleting: true, mode: 'Batch' };
this.toolbar = ['Add', 'Delete', 'Update', 'Cancel'];
this.orderidrules = { required: true, number: true };
this.requiredField = { required: true };



this.customeridrules = { required: true };
this.freightrules =  { required: true };
this.editparams = { params: { popupHeight: '300px' }};
this.pageSettings = {pageCount: 5};
  //  $.getScript("assets/js/toDo.js");
//    $.getScript("assets/js/pages/custom/contacts/list-datatable.js");
// $.getScript('assets/js/activities-datatable.js');
$.getScript('assets/js/checkInOut.js');


if(localStorage.getItem('itemLeft')){
  this.showModals=true;
}













  //countUpTimerConfigModel
  this.startValue = '0';
  this.selectedPurpose = '';
  this.selectedProject='';
  this.selectedTask='';
  this.teamValue=[];
  this.othersDataValue='';
  this.activityValue='';
  this.employeeValue='';
  this.teamCount='';


  this.projectData = [

    { id: '0', text: 'Select' },
{ id: '1', text: 'P/162' },
{ id: '2', text: 'P/163' },
{ id: '3', text: 'P/164' },
{ id: '4', text: 'P/166' },]
this.taskData = [

 ]
this.activityData= [

{ id: '0', text: 'Installation' },
{ id: '2', text: 'Inspection' },
{ id: '3', text: 'Handover' },
{ id: '4', text: 'Others' },
]
this.employeeData= [


  ]


  this.othersData=[


  ]
  // $.getScript('assets/js/pages/chosen/chosen.jquery.min.js')
  // $.getScript('https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.js')

  // $('.modal').on('hide.bs.modal', function (e) {
  //   $('.modal .modal-dialog').attr('class', 'modal-dialog  slideOutLeft  animated');
  // })
//   $('#addLog').click(function () {

//     $('#time_log_modal').modal('show');
//     this.editable=false;


// });


  $.getScript('assets/js/pages/crud/forms/widgets/select2.js')
  $.getScript('assets/js/pages/components/extended/toastr.js')
   $.getScript('assets/js/pages/crud/forms/widgets/bootstrap-datepicker.js')

     $.getScript('assets/js/teamPanel.js')
  // $.getScript('assets/js/dist/bootstrap-clockpicker.min.js')



  // $.getScript('https://code.jquery.com/jquery-3.3.1.js')


  // $.getScript('https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js')
  //  $.getScript('https://cdn.datatables.net/buttons/1.6.1/js/dataTables.buttons.min.js')
  //  $.getScript(' https://cdn.datatables.net/select/1.3.1/js/dataTables.select.min.js')
  // $.getScript('https://editor.datatables.net/extensions/Editor/js/dataTables.editor.min.js')
  // $.getScript('assets/js/dataTables.editor.min.js')

  // $.getScript('assets/js/projectsDatatable.js')



this.PushNotifyByEmpID();

this.datePickerForm = new FormGroup({
  empDate: new FormControl(''),
});

const todayDate = new Date()
const yesterdayDate = new Date(todayDate)
let yestData = yesterdayDate.setDate(yesterdayDate.getDate() - 1)
let sendDate = moment(yestData).format('MM/DD/YYYY')
yesterdayDate.toDateString();
this.maxRangeDateNew = yesterdayDate;

/* let user_info= JSON.parse(localStorage.getItem('user_info'));
this.employeeID = user_info.id
if(user_info){
  let postData = {
    "empID": this.employeeID,
    "startDate": sendDate,
    "endDate":sendDate
  }
  this.employeePreDayAct(postData);
  this.employeePreDayProj(postData);
} */

//date_range
this.newdateRangeForm = new FormGroup({
  daterangeAtt: new FormControl('', [Validators.required]),
});

if(user_info){
  let fromDate = moment().subtract(7, 'day').format('L');
  let endDate = moment().format('L');
  let attPostData={
    "startDate": fromDate,
    "endDate": endDate,
  }
  console.log(attPostData);
  this.newdateRangeForm.patchValue({
    daterangeAtt:[fromDate, endDate],
  })
  this.dateTextNew = endDate;
  this.employeePreDayAct(attPostData);
  this.employeePreDayProj(attPostData);
}


this.newdateRangeForm.get('daterangeAtt').valueChanges.subscribe((data:any) => {
  this.spinner.show();
  let startDate =  moment(data[0]).format('L');
  let endDate = moment(data[1]).format('L');
  let attPostData={
    "startDate": startDate,
    "endDate": endDate
  }
  this.dateTextNew = endDate;
  this.employeePreDayAct(attPostData);
  this.employeePreDayProj(attPostData);
})

this.toolbarbottom = ['ExcelExport', 'PdfExport'];

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

public checkedCompleted(e:any){
  this.spinner.show();
  if(e.srcElement.checked) {
    let dateValue = this.newdateRangeForm.get('daterangeAtt').value;
    let fromDate = moment(dateValue[0]).format('L');
    let endDate = moment(dateValue[1]).format('L');
    let attPostData={
      "startDate": fromDate,
      "endDate": endDate
    }
    this.projectService.getEmployeePreviousDayActivitiesProjectsDashboard(attPostData).subscribe((data: any) => {
      if(data){
        this.employeePreviousDayActivitiesProjectData = data.filter(elm => {
          return elm.status_name === 'Completed'
        })
        const sum = this.employeePreviousDayActivitiesProjectData.reduce((acc, time) => acc.add(moment.duration(time.total_hrs)), moment.duration());
        this.total_hrs_spent=[Math.floor(sum.asHours()).toString().length==1?(('0'+Math.floor(sum.asHours())).slice(-2)):Math.floor(sum.asHours()), Math.floor(sum.minutes()).toString().length==1?(('0'+Math.floor(sum.minutes())).slice(-2)):sum.minutes()].join(':');
        console.log(this.total_hrs_spent)
        this.spinner.hide();
      }

    })
  }else{
    this.spinner.show();
    let dateValue = this.newdateRangeForm.get('daterangeAtt').value;
    let fromDate = moment(dateValue[0]).format('L');
    let endDate = moment(dateValue[1]).format('L');
    this.newdateRangeForm.patchValue({
      daterangeAtt:[fromDate, endDate],
    })
  }
}


prevday(){
  this.spinner.show();
  let dateValue = this.newdateRangeForm.get('daterangeAtt').value;
  let fromDate = moment(dateValue[0]).subtract(7, 'day').format('L');
  let endDate = moment(dateValue[1]).subtract(1, 'day').format('L');
  this.newdateRangeForm.patchValue({
    daterangeAtt:[fromDate, endDate],
  })
  this.dateTextNew = endDate;
}

nextday(){
  this.spinner.show();
  let dateValue = this.newdateRangeForm.get('daterangeAtt').value;
  let fromDate = moment(dateValue[0]).add(7, 'day').format('L');
  let endDate = moment(dateValue[1]).add(1, 'day').format('L');
  this.dateTextNew = endDate;
  console.log(fromDate, endDate)
  this.newdateRangeForm.patchValue({
    daterangeAtt:[fromDate, endDate],
  })
}

employeePreDayAct(postData){
  this.projectService.getEmployeePreviousDayActivitiesDashboard(postData).subscribe((data) => {
    console.log(data);
    this.employeePreviousDayActivitiesData = data;
    this.empCheckIn = this.employeePreviousDayActivitiesData.check_in === null ? '-' : this.employeePreviousDayActivitiesData.check_in;
    this.empLeftTime = this.employeePreviousDayActivitiesData.check_out === null ? '-' : this.employeePreviousDayActivitiesData.check_out;
    this.empLateArrival = this.employeePreviousDayActivitiesData.late_checkin === null ? '-' : this.employeePreviousDayActivitiesData.late_checkin;
    this.empLeaveEarly = this.employeePreviousDayActivitiesData.early_checkout === null ? '-' : this.employeePreviousDayActivitiesData.early_checkout;
    this.empProductiveTime = this.employeePreviousDayActivitiesData.time_spend_activity === null ? '-' : this.employeePreviousDayActivitiesData.time_spend_activity;
    this.empProductivity = this.employeePreviousDayActivitiesData.productivity_ratio === null ? '-' : this.employeePreviousDayActivitiesData.productivity_ratio;
    this.empActivetyTime = this.employeePreviousDayActivitiesData.activity_count === null ? '-' : this.employeePreviousDayActivitiesData.activity_count;
    this.empTimeSpend = this.employeePreviousDayActivitiesData.time_spend_activity === null ? '-' : this.employeePreviousDayActivitiesData.time_spend_activity;

    this.spinner.hide();
  });
}

employeePreDayProj(postData){
  this.projectService.getEmployeePreviousDayActivitiesProjectsDashboard(postData).subscribe((data) => {
    console.log(data);
    this.employeePreviousDayActivitiesProjectData = data
    const sum = this.employeePreviousDayActivitiesProjectData.reduce((acc, time) => acc.add(moment.duration(time.total_hrs)), moment.duration());
    this.total_hrs_spent=[Math.floor(sum.asHours()).toString().length==1?(('0'+Math.floor(sum.asHours())).slice(-2)):Math.floor(sum.asHours()), Math.floor(sum.minutes()).toString().length==1?(('0'+Math.floor(sum.minutes())).slice(-2)):sum.minutes()].join(':');
    console.log(this.total_hrs_spent)

    this.spinner.hide();
  })


}

ngAfterViewInit() {
    //We loading the player script on after view is loaded
  // $.getScript('assets/js/teamPanel.js');
  // $.getScript('assets/js/audioTimer.js');
//  $('#clockP').clockpicker({

//   placement: 'bottom',
//   align: 'left',
//   donetext: 'Done',
//   afterDone: () => {
//
//   }
// });
}
  //
  // (ClockPickerDirective =>
  //   $(ClockPickerDirective.viewContainerRef).clockpicker({

  //     placement: 'bottom',
  //     align: 'left',
  //     donetext: 'Done',
  //     afterDone: () => {
  //
  //     }
  //   }));





  //}
  leaveRange(e){

    this.leaveSpan=e.daySpan;
  }

}
export interface ParentComponentApi {
  callParentMethod: () => void
  // taskParentMethod: () => void

}
export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


const data: Element[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];
// export class ExampleDataSource extends DataSource<any> {
//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<Element[]> {
//     const rows = [];
//     data.forEach(element => rows.push(element, { detailRow: true, element }));
//
//     return of(rows);
//   }

//   disconnect() { }
// }
