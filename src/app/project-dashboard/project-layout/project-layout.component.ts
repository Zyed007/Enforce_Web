import { Component, OnInit, ViewEncapsulation, NgZone, ViewChild, ElementRef, AfterViewInit, AfterContentInit, AfterViewChecked, Output, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../services/employee.service';
import { Select2OptionData, Select2TemplateFunction } from 'ng2-select2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment = require('moment');
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import { MatTableDataSource } from '@angular/material';
import { DesignationService } from '../../services/designation.service';
import { DepartmentService } from '../../services/department.service';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import { NgxSpinnerService } from 'ngx-spinner';
import { TeamService } from '../../services/team.service';
import { DataManager } from '@syncfusion/ej2-data';
import { TemplateService } from '../../services/template.service';
import { Browser } from '@syncfusion/ej2-base';
import { orderDetails } from './data';
import { EditService, ToolbarService, PageService, DialogEditEventArgs, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { DataUtil,Predicate  } from '@syncfusion/ej2-data';
import {  AbstractControl } from '@angular/forms';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { MultiSelectComponent, SelectEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import {FormBuilder, FormArray} from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { QuotationService } from '../../services/quotation.service';
import { NotificationComponent } from './components';
import { ActivityService } from '../../services/activity.service';
import { patternValidator } from '../../shared/services';
import { TimeSheetService } from '../../services/timesheet.service';
import { CountryISO, SearchCountryField, TooltipLabel } from 'ngx-intl-tel-input';
import { UserService } from '../../services/user.service';
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import { CostService } from '../../services/cost.service';

import { HistoryService } from '../../services/history.service';


// import * as $ from 'jquery';
 declare var $: any;
 function am4themes_myTheme(target) {
  if (target instanceof am4core.ColorSet) {
    target.list = [
      am4core.color("#1dc9b7"),
      am4core.color("#2c77f4"),
      am4core.color("red"),

    ];
  }
}
//  am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_myTheme);

let chart;
let taskchart;
let studychart;
let designchart;
let shopDrawngchart;
let extraSchart;
let projRelatedchart;
let projCompareChart;
let milestCompareChart;

let budegetdHrschart;
let budegetdHrschartData=[]
let projCompareChartData = [{
  "name": '2005',
  "income": 23.5,
  "expenses": 18.1
},{
  "name": '2006',
  "income": 26.2,
  "expenses": 22.8
},{
  "name": '2007',
  "income": 30.1,
  "expenses": 23.9
}];

// let budegetdHrschartData = [{
//   "date": "2013-01-16",
//   "market1": 71,
//   "market2": 75,
//   "sales1": 5.3,
//   "sales2":6.8
// }, {
//   "date": "2013-01-17",
//   "market1": 74,
//   "market2": 78,
//   "sales1": 4,
//   "sales2": 6
// }, {
//   "date": "2013-01-18",
//   "market1": 78,
//   "market2": 88,
//   "sales1": 5,
//   "sales2": 2
// }, {
//   "date": "2013-01-19",
//   "market1": 85,
//   "market2": 89,
//   "sales1": 8,
//   "sales2": 9
// }, {
//   "date": "2013-01-20",
//   "market1": 82,
//   "market2": 89,
//   "sales1": 9,
//   "sales2": 6
// }, {
//   "date": "2013-01-21",
//   "market1": 83,
//   "market2": 85,
//   "sales1": 3,
//   "sales2": 5
// }, {
//   "date": "2013-01-22",
//   "market1": 88,
//   "market2": 92,
//   "sales1": 5,
//   "sales2": 7
// }, {
//   "date": "2013-01-23",
//   "market1": 85,
//   "market2": 90,
//   "sales1": 7,
//   "sales2": 6
// }, {
//   "date": "2013-01-24",
//   "market1": 85,
//   "market2": 91,
//   "sales1": 9,
//   "sales2": 5
// }, {
//   "date": "2013-01-25",
//   "market1": 80,
//   "market2": 84,
//   "sales1": 5,
//   "sales2": 8
// }, {
//   "date": "2013-01-26",
//   "market1": 87,
//   "market2": 92,
//   "sales1": 4,
//   "sales2": 8
// }, {
//   "date": "2013-01-27",
//   "market1": 84,
//   "market2": 87,
//   "sales1": 3,
//   "sales2": 4
// }, {
//   "date": "2013-01-28",
//   "market1": 83,
//   "market2": 88,
//   "sales1": 5,
//   "sales2": 7
// }, {
//   "date": "2013-01-29",
//   "market1": 84,
//   "market2": 87,
//   "sales1": 5,
//   "sales2": 8
// }, {
//   "date": "2013-01-30",
//   "market1": 81,
//   "market2": 85,
//   "sales1": 4,
//   "sales2": 7
// }];
@Component({
  selector: 'app-project-layout',
  templateUrl: './project-layout.component.html',
  styleUrls: ['./project-layout.component.scss'],
  providers: [ToolbarService, EditService, PageService],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectLayoutComponent implements OnInit   {

  historyData;
  noHistoryDataDiv;
  historyDataDiv;

  errorTimeExcced = false;
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

  @Output() onChanged : EventEmitter<any> = new EventEmitter(false);
  public paramId=this.route.snapshot.params.id;
  public disableModify=false;
  public options: Select2Options;
  public teamoptions: Select2Options;
  public assigneeOptions: Select2Options;
  public approverData: Array<Select2OptionData>;
  public activList: Array<Select2OptionData>;
  private chart: am4charts.XYChart;
  public full_name:any;
  public emailForm: FormGroup;
  public emailLabels = ['Home', 'Work', 'Other'];
  public today: Date = new Date(new Date().toDateString());
  public maxRangeDate: Date = this.today;
  public weekEnd =moment().subtract(7,'d').format('YYYY-MM-DD');
  public  weekStart: Date =new Date(new Date().toDateString());
  public searchText:string ='';
//  public x=     new Date(new Date().toDateString())
//  dateFrom =
public monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
public monthEnd: Date = this.today;
public lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
public lastEnd: Date = this.today;
public yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
public yearEnd: Date = this.today;
public
  public validationMsgs = {
    'emailAddress': [{ type: 'email', message: 'Enter a valid email' }]
  }
  public fields: Object = { groupBy: 'category', text: 'text', value: 'id' };
  // Set the popup list height
  public height: string = '200px';
  // set the placeholder to the MultiSelect input
  public placeholder: string = 'Select participants';

  public isApprove=false;
  @ViewChild('listviewInstance',{static:false})
  public listviewInstance: any;
  @ViewChild('chartElement',{static:false}) chartElement: ElementRef<HTMLElement>;
  @ViewChild('assignee',{static:false})
     countryObj: MultiSelectComponent;
@ViewChild('qtnCloseBtn',{static:false}) qtnCloseBtn: ElementRef;

@ViewChild('taskCloseBtn',{static:false}) taskCloseBtn: ElementRef;
@ViewChild('meetCloseBtn',{static:false}) meetCloseBtn: ElementRef;
@ViewChild('callCloseBtn',{static:false}) callCloseBtn: ElementRef;
@ViewChild('closeActBtn',{static:false}) closeActBtn: ElementRef;
@ViewChild('contactCloseBtn',{static:false}) contactCloseBtn: ElementRef;
@ViewChild('mapCloseBtn',{static:false}) mapCloseBtn: ElementRef;
@ViewChild('actRemarksCloseBtn',{static:false}) actRemarksCloseBtn: ElementRef;
@ViewChild('projRemarksCloseBtn',{static:false}) projRemarksCloseBtn: ElementRef;
@ViewChild('projTaskCloseBtn',{static:false}) projTaskCloseBtn: ElementRef;
@ViewChild('locBtnClose',{static:false}) locBtnClose: ElementRef;
@ViewChild('checkinClose',{static:false}) checkinClose: ElementRef;

  projectName: any;
  approverValue: any;
  showApprover=false;
  activityLogForm: FormGroup;
  taskLogForm: FormGroup;
  startdateValue;
  enddateValue: any;
  projActivityCount: any;
  addApprover: any;
  activListValue: any;
  disableAddAct:boolean;
  public taskPriority:string;
  public dateValue;
  public taskStatus:string;
  public taskPriorData: Array<Select2OptionData>;
  public taskStatusData: Array<Select2OptionData>;
  public assigneeData: Array<Select2OptionData>;
  public customerData: Array<Select2OptionData>;
  public projStatusData: Array<Select2OptionData>;
// public People;


  public filterEmpByDesgn=false;
  public filterEmpByDept=false;
  public filterEmpByFreeLanc=false;
  public filterEmpByOutsource=false;
  empDataSource: any;

  // public date=moment().format('dddd, D MMM YYYY');
  public dueDate;
  public teamMembers=[];
  public teamMemFetchData=[];
  public teams=[];

   public teamsValFetchData=[];

   displayedEmpColumns= ['index','Job', 'CheckIn', 'CheckOut','Action'];
   public desgnData: Array<Select2OptionData>;
   public deptData: Array<Select2OptionData>;
   public milestoneTempData: Array<Select2OptionData>;
   public taskTempData: Array<Select2OptionData>;

   searchField: string;
   teamAdd: boolean;
   teamValue: any;
   teamMembersData: { id: string; text: string; }[];
   desgnEmpValue: any;
   deptEmpValue: any;
   teamEmpName: string;
   teamMemberValue: any;
   approver: boolean
  assigneeStatus: any;
  teamData: any[];
  ejsDueDate: string;

  nearbyAddress="";
  nearbyPlaces: google.maps.places.PlaceResult[];
  changed_address: string;

  public formatted_address;
  //  public lat;
  //  public lang;
   lat= 25.2748983;
  lng= 55.37456589999999;
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
   public editableLoc;
   public piedata: Object[];
   public tooltip: Object;
   geoCodeData: any;
   public showAssigneeLead=false;
   public headerTitle: string = 'Milestones';
    public cssClass: string = 'e-list-template';
   disableLocationAdd=true;
  newAttribute: any = {};

  firstField = true;
  firstFieldName = 'First Item name';
  isEditItems: boolean;

   title: string = 'AGM project';
   latitude: number;
   longitude: number;
   zoom: number;
   address: string;
   private geoCoder;
   @ViewChild('search',{ read: ElementRef , static: false })
    searchElementRef: ElementRef;
  project_start_date: any;
  project_end_date: any;
  project_desc: any='';
  customerForm: FormGroup;
  customerVal='';
  editCustomer: boolean;
  customerId: any;
  projTaskCount=0;
  planType: string;
  dataSource: any;

  taskDataSource: any;
  editActivityId: any;
  editTaskId: any;
  project_activity_id: any;
  editable=false;
  activityEditable=false;
  activityChartData: any;
  projStatusValue: any;
  projectProgress: any;
  approveChecked: any;
  taskApprove: any;
  disableEndDate=true;
  minEndDate: any;
  startValChange: boolean;
  disableAddTask:boolean;
  approverTaskValue='';
  user_info: any;
  addformSubmitted: any;
  editformSubmitted: any;
  public selectedISO = CountryISO.UnitedArabEmirates;
  public box : string = 'Box';
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  relationData=[{
    id:'',
    text:'Select'
  },{
    id:'1',
    text:'Owner'
  },{
    id:'2',
    text:'Consultant'
  },{
    id:'3',
    text:'Personal Advisor'
  },{
    id:'4',
    text:'Office Manager'
  }
  ]

  timeTrackData=[
  //   {
  //   id:'',
  //   subtask:'Main living',
  //   task:'3D Perspective',
  //   project:'Demo Projec',
  //   milestone:'3D Layout',
  //   'start':'6:30pm',
  //   'end':'6:30pm',
  //   'total_time':'00:00:01',
  //   'assignee':'Sazid',
  // },{
  //   id:'1',
  //   subtask:'Bedroom',
  //   task:'3D Perspective',
  //   project:'Demo Projec',
  //   milestone:'3D Layout',
  //   'start':'6:30pm',
  //   'end':'6:30pm',
  //   'total_time':'00:00:01',
  //   'assignee':'Sazid',

  // }
  ]
  projSiteTrackData=[]
  @ViewChild('empgrid',{   static: false })

  empgrid;
  activityCompletedList=[];
  activityOpenList=[];
  taskCompletedList=[];
  taskOpenList=[];
  public templateAdd=false;
  disableTaskStatus: boolean=false;
  milestoneTempValue: any;
  taskTemplateAdd: boolean=false;
  taskTempValue: any;
  leadValue: any;
  showAssigneeApprove: boolean=false;
  allActCount: any;
  completedActCount: number;
  public headerText: Object = [{ text: "Single Task", 'iconCss': 'e-twitter' },
  { text: "Multiple Task", 'iconCss': 'e-facebook' }];

public taskData: Object[] = [
  ]

  public data: Object[];
    public editSettings: Object;
    public toolbar: string[];
    public orderForm: FormGroup;
    public pageSettings: Object;
    public shipCityDistinctData: Object[];
    public shipCountryDistinctData: Object[];
    public submitClicked: boolean = false;
  ejsTaskData: { id: string; text: string; }[];
  ejsactivList: { id: string; text: string; }[];
  ejstaskPriorData: { id: string; text: string; }[];
  ejsassigneeData: { id: any; text: string; }[];
  currentUser: any;
  choseTaskTemplate: boolean=false;
  choseMilestTemplate: boolean=false;
  singleTask: boolean=true;
  multiTask: boolean=false;
  projectData=[];
  xpandStatus: boolean=false;
  selectedProjectId: any;
  selectedValue: any;
  projectId: string;
  projectPrefix: any;
  cstName='';
  city='';
  email='';
  phoneNo='';
  primaryName: any;
  showTextArea4: boolean=false;
  contactData=[{
    "id": '1',
    "text": 'Select'
  }, {
    "id": '2',
    "text": 'Contact'
  } ,{
    "id": '3',
    "text": 'Lead'
  }]
  purposeData=[{
    "id": '1',
    "text": 'Select'
  }, {
    "id": '2',
    "text": 'None'
  } ,{
    "id": '3',
    "text": 'Administrative'
  },{
    "id": '4',
    "text": 'Negotiation'
  }]
  callResultData=[{
    "id": '1',
    "text": 'Select'
  }, {
    "id": '2',
    "text": 'None'
  } ,{
    "id": '3',
    "text": 'Interested'
  },{
    "id": '4',
    "text": 'Not Interested'
  }]
  contactVal: any;
  meetingForm: FormGroup;
  minEndTime: any;
  empData: { id: string; text: string; }[];
  empVal: any;
  startmeetTime: string;
  endmeetTime: string;
  endValChange: boolean=false;
  meetingFormSubmit: boolean=false;
  empGroup: any[];
  disableEndTime: boolean;
  notesForm: FormGroup;
  notesEditable: boolean=false;
  editnotesId: any;
  notesData: Object[];
  meetingData: Object[];
  meetingEditable: boolean;
  editMeetId: any;
  meetingToolbar: string[];
  callForm: FormGroup;
  callFormSubmit: boolean=false;
  purposeVal='';
  purposeValTxt: any;
  callresVal='';
  callresValTxt: any;
  entityContactData: { id: string; text: string; }[];
  entityContactVal='';
  openActData: Object[];
  openActToolbar: string[];
  callEditable: boolean;
  editCallId: any;
  closeData: Object[];
  closeToolbar: string[];
  mode: string;
  taskOptions: { placeholder: string; width: string; };
  public currentTime=moment().add(1,'minutes').format('hh:mm a')
  public currentVal=moment().add(1,'minutes').format('hh:mm a')
  public disableTaskName=false

  showValidTimeError: boolean=false;
  closeActData={
    subject:'',
    start_time:'',
    end_time:'',
    entity_type:'',
    remarks:'',
    status:'',
    activity_owner:'',
    due_date:''

  };
  customerContactForm: FormGroup;
  disableSaveBranch: boolean=true;
  cstRelationValue: any;
  cstRelationValueTxt: any;
  closeContactLog: boolean;
  closeActLog: boolean=false;
  callCstId: any='';
  showBranchList: boolean=false;
  branchDataSource=[];
  primaryContact={
name:'empty',
email:'empty',
phone:'empty'
  };
  public dateRangeValue;

  typeOfModal: string;
  dateRangeForm: FormGroup;
  fromDateValue: string;
  toDateValue: string;
  projAccomplishedTask: any;
  dateRangeText: string;
  total_hrs_spent: any;
  dateRangeSiteText: string;
  proj_hrs_spent: string;
  projRemarksData: any;
  accomplishedRemarksData={
    project_name:'',
    start_time:'',
    end_time:'',
    milestone_name:'',
    remarks:'',
    status_name:'',
    full_name:'',
    main_name:'',
    task_name:'',
    ondate:''

  };
  projectAttribute={
    total_hours:'',
    total_amount:'',
    net_total_amount:'',
    profit_margin_amount:'',
    gross_total_amount:'',
    vat_amount:'',
    modified_value:'',
    modified_hrs:'',
    discount_amount:''
  };
  subTaskList: { id: string; text: string; }[];
  subtaskListValue: any;
  subtaskListValueTxt: any;
  taskListByAct=[];
  showSubtaskText: boolean=false;
  arrayContains: boolean=false;
  multiArrayContains: boolean=false;
  showMultiSubtaskText: boolean=false;
  taskType: string;
  selectedCheckInGroupVal: string;
  checkOutLang: any;
  checkOutLat: any='';
  checkInModel: string="Checkin";
  checkInMarkers: any[];
  checkOutMarkers: any[];
  projectProperty: any={
    "milestoneCount": "0",
  "taskCount": "0",
  "overDueCount": "0",
  "dueTodayCount": "0",
  "openTaskCount": "0",
  "inProgressCount": "0",
  "completedTaskCount": "0",
  "assignedCount": "0",
  "unAssignedCount": "0",
  projectBugetedHours: "0",
  projectProgressPercent: "0",
  projectWorkedHours: "0"

  };
  showAssgnTask: boolean;
  showKanbanBtn: boolean;
  showCostDetails: boolean;
  savedContactPh: boolean;
  showPurposeToggle: boolean;
  maxAddLogEndTime: string;
  allowUpdateStatus: boolean;
  sub_taskId: string;
  showActivityTasks: boolean;
  showPurposeTasks: boolean;
  projTaskDataValue: any;
  projTaskDataText: any;
  actTaskStatusValue: any;
  acttaskListValue: any;
  activityDataText: any;
  enableActTaskStatus: boolean;
  projSubTaskData: { id: string; text: string; additional: { assigned_empid: string; status_id: string; }; }[];
  projSubtaskListValue: string;
  projSubtaskText: string;
  officeSubtaskListValue: string;
  officeSubtaskText: string;
  addActformSubmitted: any;
  showerrorMsg: boolean;
  checkinLogForm: FormGroup;
  sliderForm: FormGroup;
  deptOptions: { placeholder: { id: string; text: string; }; allowClear: boolean; width: string; };
  taskDescOptions: { placeholder: string; width: string; templateResult: any; templateSelection: any; };
  recentActTaskSel: boolean;
  taskSel: boolean;
  officeActListValue: any;
  officeactText: any;
  activityOptions: { placeholder: string; width: string; };
  openStatID: any;
  inProgressStatID: any;
  completedStatID: any;
  showEditTask: boolean;
  showDeleteTask: boolean;
  recentTaskSel: boolean;
  projTaskData: { id: string; text: string; additional: { assigned_empid: string; status_id: string; }; }[];
  taskWithDesc: { id: string; text: string; additional: { assigned_empid: string; status_id: string; }; }[];
  timesheetForm: FormGroup;
  allTimeLog: any;
  recentSubTaskSel: boolean;
  public tooltipData: Object = { placement: 'Before', isVisible: true, showOn: 'Always', format: 'P0' };
  public ticksData: Object = { placement: 'After', largeStep: .2, smallStep: .1, showSmallTicks: true, format: 'P0' };
  selectedGroupId: any;
  minStartTime: any;
  maxCurrentTime: any;
  checkinstartTime: string;
  checkinendTime: string;
  timeinrange: boolean;
  billable: boolean=false;
  checkinAddActformSubmitted: any;
  taskActivityId: any;
  checkinBillable: boolean=false;
  // color: ThemePalette = 'primary';
  public selectedTaskText;
  showProjBasedTasks: boolean=false;
  allTaskList: any[];
  contactForm: FormGroup;
  contactEditable: boolean=false;
  is_cont_primary: any;
  contactEditId: any;
  estimation_id: any;
  removedTaskList: any=[];
  modified_cost: any;
  modified_hrs: string;
  deletedTaskList: any[];
  addedTaskList: any[];
  modifiedProject: any;
  mainUnitForm: FormGroup;
  extraUnitForm: FormGroup;
  milestTaskForm: FormGroup;
  totalHrs: any;
  MilestHrs: string;
  profit_margin: number;
  profit_value: number;
  total_value: any;
  net_total: any;
  vat_total: number;
  discount_amount: any;
  totalCostStudy: any;
  totalCostDesign: any;
  totalCostDrawing: any;
  totalCostService: any;
  milestoneData=[];
  CURRENCY: string;
  costProjectDetails: any;
  perunitCostHrs: number;
  showModifyBtn: boolean;
  project_status_name: any;
  isDisableTask: boolean=false;
  projectModifyTxt: string='';
  public createProjCompSeries(field, name) {
    let series = projCompareChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = field;
    series.dataFields.categoryY = "project_name";
    series.dataFields.url = "project_id";
    series.name = name;
    series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
    series.columns.template.height = am4core.percent(100);
    series.sequencedInterpolation = true;

    let valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "{valueX}";
    valueLabel.label.horizontalCenter = "left";
    valueLabel.label.dx = 10;
    valueLabel.label.hideOversized = false;
    valueLabel.label.truncate = false;

    let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
    categoryLabel.label.text = "{name}";
    categoryLabel.label.horizontalCenter = "right";
    categoryLabel.label.dx = -10;
    categoryLabel.label.fill = am4core.color("#fff");
    categoryLabel.label.hideOversized = false;
    categoryLabel.label.truncate = false;
  }
  public createMilestCompSeries(field, name) {
    let series = milestCompareChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = field;
    series.dataFields.categoryY = "activity_name";
    series.columns.template.propertyFields.dummyData = "project_activity_id";
    series.name = name;
    series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
    series.columns.template.height = am4core.percent(100);
    series.sequencedInterpolation = true;

    let valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "{valueX}";
    valueLabel.label.horizontalCenter = "left";
    valueLabel.label.dx = 10;
    valueLabel.label.hideOversized = false;
    valueLabel.label.truncate = false;

    let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
    categoryLabel.label.text = "{name}";
    categoryLabel.label.horizontalCenter = "right";
    categoryLabel.label.dx = -10;
    categoryLabel.label.fill = am4core.color("#fff");
    categoryLabel.label.hideOversized = false;
    categoryLabel.label.truncate = false;
  }

  constructor(@Inject(FormBuilder)  public fb: FormBuilder,public route:ActivatedRoute,private timesheetService:TimeSheetService,private activityService:ActivityService, private quotationService:QuotationService, public router:Router, private zone: NgZone,private projectService:ProjectService,private toastr: ToastrService,
    private empService:EmployeeService,private taskService:TaskService,private desgnService:DesignationService,
    private deptService:DepartmentService,private mapsAPILoader: MapsAPILoader,private spinner:NgxSpinnerService,private teamService:TeamService,
    private ngZone: NgZone,private templateService:TemplateService,private formBuilder: FormBuilder,private userService:UserService,private timeService:TimeSheetService,private costService:CostService, public histSer :HistoryService) {
    this.options={
    placeholder: { id: '', text: 'Select' },
    width:'100%'
  }
  this.taskOptions = {
    placeholder: 'Select',
    width: '100%'
  }
  this.deptOptions={
    placeholder: { id: '  ', text: 'Select' },  allowClear: true,
    width:'100%'
  }
  this.activityOptions={
    placeholder:"Select",
    width: "100%",
  }
  this.assigneeOptions={
    multiple: true,

    placeholder: { id: '', text: 'Select' },
    width:'100%'
  }
  this.taskDescOptions={
    placeholder:"Select",
    width: "100%",
    templateResult: this.taskDescResult,
    templateSelection: this.taskDescSelection,

  }
  this.teamoptions = {
    multiple: true,
    placeholder: "Select",
    // allowClear: true,
    width: "100%",
    templateResult: this.templateResult,
    templateSelection: this.templateSelection


  }
}

public taskDescResult: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }



  return jQuery('<div><b>' + state.text+ '</b> ' + '<span> '+ state.additional.assignee + '</span>' +
   '<div> '+ state.additional.taskDesc + '</div>' +'<div> '+ state.additional.milestone +'<div> '+ state.additional.dueDate + '</div>' +'</div>');
}

public taskDescSelection: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }

  return jQuery('<span><b>' + state.text + '</b> ' + state.additional.assignee + '</span>');
  //return jQuery('<div><b>' + state.text+ '</b></div> ' + '<div>'+ state.additional.teamBy + '</div>');

}
public templateResult: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }



  return jQuery('<div><b>' + state.text+ '</b> ' + '<span> '+ state.additional.teamBy + '</span></div>');
}

// function for selection template
public templateSelection: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }

  return jQuery('<span><b>' + state.text + '</b> ' + state.additional.teamBy + '</span>');
  //return jQuery('<div><b>' + state.text+ '</b></div> ' + '<div>'+ state.additional.teamBy + '</div>');

}
public FindByEntityContactOrgID() {
  // this.countryData = []
  // this.countryValue=''
let entityId={
entityID:localStorage.getItem('project_id'),
// cstID:localStorage.getItem('project_id')
cstID:this.callCstId
}

  return this.quotationService.GetAllEntityContactByEntityIDAndCstID(entityId).subscribe(
    (data: any) => {
      // let dataObj = JSON.parse(data['token']);


      var results = [{ id: '  ', text: 'Select' }]

      // let dataObj = JSON.parse(data['token']);
      //

      for (var i = 0; i < data.length; i++) {
        // logik to create new items

        results.push({
          "id": data[i].id,
          "text": data[i].name
        });
        if(data[i]['is_primary']==true){
          this.entityContactVal=data[i].id
        }

      }


      this.entityContactData = results;

    },
    error => {
      Swal.fire(
        'Error!',
        'Error.',
        'error'
      ).then(
        //used Arrow function here
        (result) => {

          //  this.router.navigate(['/dashboard']);
        })


    }

  )
}
modifyProj(){

  Swal.fire({

    title: 'Are you sure?',
    text: "Modifying project will be created with a new reference number while replacing the existing project",
    type: 'warning',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'MODIFY!',
cancelButtonText: 'CANCEL!',
}).then(
  (result) => {
      if (result.value) {
     this.UpdateCostProjectIsQuotationByID();



}
})


}
UpdateCostProjectIsQuotationByID(){
  let postData={
    id:this.estimation_id
  }
  this.spinner.show()
  console.log('modifyProj',postData)
  this.projectService.UpdateCostProjectIsQuotationByID(postData).subscribe(

    (data:any) => {
    if(data.status=="200"){
  this.SetProjectModificationByProjectID()
  this.spinner.hide()

  this.router.navigate(['/cost-estimate'])
  sessionStorage.setItem('modify','true')
  sessionStorage.setItem('costId',this.estimation_id)
  sessionStorage.setItem('modifyProjId',localStorage.getItem('project_id'))

    }else{
  this.spinner.hide()

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

SetProjectModificationByProjectID(){


  let postData={
    id:localStorage.getItem('project_id')
  }
  this.projectService.SetProjectModificationByProjectID(postData).subscribe(

    (data:any) => {
    if(data.status=="200"){


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

public openContactModal(type){
  //$('#details_view_modal').modal('show')
  //  $('#activity_log_modal').modal('hide')
  console.log('openDetailedView',type)
  this.selectedISO = CountryISO.UnitedArabEmirates;

  if(type=='meeting'){
    $("#meeting_modal").removeClass("fade").modal("hide");
    this.closeActLog=true
    this.typeOfModal='meeting'
  }else if(type=='call'){
    $("#call_modal").removeClass("fade").modal("hide");
    this.typeOfModal='call'
    this.closeActLog=false


  }else if(type=='layout'){
    this.customerContactForm.reset();
    this.cstRelationValue='';
    this.typeOfModal='layout'
    this.contactEditable=false;
    if( this.contactEditable == false) {
      this.customerContactForm.get('fname').enable()
      this.customerContactForm.get('lname').enable()
    }


  }

  $("#contact_modal").modal("show").addClass("fade");
}
public setPrimary(index){
  let user_info= JSON.parse(localStorage.getItem('user_info'));
  for(var i=0;i<this.branchDataSource.length;i++){
    if(i==index){
      this.branchDataSource[i]['is_primary']=true
      this.branchDataSource[i]['modifiedby']=user_info['full_name']

    }else{
      // emails.at(i).patchValue({primaryAccValue:'no' })
      this.branchDataSource[i]['is_primary']=false


    }

  }



  console.log('this.branchDataSource',this.branchDataSource);


  this.projectService.UpdateEntityContactList(this.branchDataSource).subscribe(

    (data:any) => {
    if(data.status=="200"){
      this.toastr.success(data['desc'], undefined, {
        positionClass: 'toast-top-center'
      });
      this.getContactList('');

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
closeContactModal(){
  // $('#details_view_modal').modal('hide')
  // $('.modal-backdrop').remove();
  //  $('#activity_log_modal').modal('show')
  $("#contact_modal").removeClass("fade").modal("hide");
  this.contactCloseBtn.nativeElement.click();

if(this.closeActLog==true){
  $("#meeting_modal").modal("show").addClass("fade");

}else if(this.typeOfModal!='layout' &&  this.closeActLog==false ){
  $("#call_modal").modal("show").addClass("fade");

}
}
saveContact(e){
  this.savedContactPh=true;

    let postData={

      "id":null,
      "entity_id":localStorage.getItem("project_id"),
      "first_name":this.customerContactForm.get('fname').value,
      "last_name": this.customerContactForm.get('lname').value,
      "name":this.customerContactForm.get('fname').value+' '+ this.customerContactForm.get('lname').value,
      "phone":(this.customerContactForm.get('mobile').value!=null && this.customerContactForm.get('mobile').value!='')? this.customerContactForm.get('mobile').value.internationalNumber.replace(/ /g, ""):null,
      "phone_iso_name":(this.customerContactForm.get('mobile').value!=null && this.customerContactForm.get('mobile').value!='')?this.customerContactForm.get('mobile').value.countryCode:null,
      "email": this.customerContactForm.get('email').value,
      "note": this.customerContactForm.get('note').value,
      "department": null,
      "relationship": this.cstRelationValueTxt,
      "designation": this.customerContactForm.get('designation').value,
      "is_primary":false

    }

   console.log('saveContactAddress',postData)
   if(this.customerContactForm.get('mobile').status=='VALID'){

   this.spinner.show();
    this.savedContactPh=false;

     return this.quotationService.AddEntityContact(postData).subscribe(
      (data: any) => {
if(data.status=='200'){

          this.spinner.hide();
        this.customerContactForm.reset();
        this.cstRelationValue='';
        this.closeContactModal();
        this.getContactList(data.code);

        if(this.typeOfModal=='meeting'){
          this.getAllEmployeeList(data.code);

          }else if(this.typeOfModal=='call'){
            this.getContactList(data.code);


            }
         this.disableSaveBranch=true;
         this.toastr.success(data['desc'], undefined, {
            positionClass: 'toast-top-center'
          });

          if(data){
            let postData = {
            entity_id: localStorage.getItem("project_id"),
            event_type: "Project contact added",
            event_desc: "Project contact added successfully",
           };
           this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                console.log(data)
            });
           }

}
else{
this.spinner.hide();
this.toastr.error('Something went wrong,Please try again later', undefined, {
  positionClass: 'toast-top-center'
});

}

      },
      error => {
        this.spinner.hide();

        Swal.fire(
          'Error!',
          'Error.',
          'error'
        ).then(
          (result) => {

          })


      }

    )
    }

    }
    editContSubmit(e){
      this.savedContactPh=true;

        let postData={

          "id":this.contactEditId,
          "entity_id":localStorage.getItem("project_id"),
          "first_name":this.customerContactForm.get('fname').value,
          "last_name": this.customerContactForm.get('lname').value,
          "name":this.customerContactForm.get('fname').value+' '+ this.customerContactForm.get('lname').value,
          "phone":(this.customerContactForm.get('mobile').value!=null && this.customerContactForm.get('mobile').value!='')? this.customerContactForm.get('mobile').value.internationalNumber.replace(/ /g, ""):null,
          "phone_iso_name":(this.customerContactForm.get('mobile').value!=null && this.customerContactForm.get('mobile').value!='')?this.customerContactForm.get('mobile').value.countryCode:null,
          "email": this.customerContactForm.get('email').value,
          "note": this.customerContactForm.get('note').value,
          "department": null,
          "relationship": this.cstRelationValueTxt,
          "designation": this.customerContactForm.get('designation').value,
          "is_primary":this.is_cont_primary

        }

       console.log('saveContactAddress',postData)
       if(this.customerContactForm.get('mobile').status=='VALID'){

       this.spinner.show();
        this.savedContactPh=false;

         return this.quotationService.UpdateEntityContact(postData).subscribe(
          (data: any) => {
    if(data.status=='200'){

              this.spinner.hide();
            this.customerContactForm.reset();
            this.cstRelationValue='';
            this.closeContactModal();
            this.getContactList(data.code);

            this.selectedISO = CountryISO.UnitedArabEmirates;

             this.disableSaveBranch=true;
             this.toastr.success(data['desc'], undefined, {
                positionClass: 'toast-top-center'
              });

              if(data){
                let postData = {
                entity_id: localStorage.getItem("project_id"),
                event_type: "Project contact edited",
                event_desc: "Project contact edited successfully",
               };
               this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                    console.log(data)
                });
               }

    }
    else{
    this.spinner.hide();
    this.toastr.error('Something went wrong,Please try again later', undefined, {
      positionClass: 'toast-top-center'
    });

    }

          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              (result) => {

              })


          }

        )
        }

        }
saveContactAddress(e){

    let postData={

      "id":null,
      "entity_id":sessionStorage.getItem("qtnId"),
      "first_name":this.customerContactForm.get('fname').value,
      "last_name": this.customerContactForm.get('lname').value,
      "phone":this.customerContactForm.get('mobile').value ,
      "email": this.customerContactForm.get('email').value,
      "note": this.customerContactForm.get('note').value,
      "department": null,
      "relationship": this.cstRelationValueTxt,
      "designation": this.customerContactForm.get('designation').value,
      "is_primary":false

    }

   console.log('saveContactAddress',postData)

     return this.quotationService.AddEntityContact(postData).subscribe(
      (data: any) => {
if(data.status=='200'){

          this.spinner.hide();
        this.customerContactForm.reset();
        this.cstRelationValue='';
        this.closeContactModal();
         this.disableSaveBranch=true;
         this.toastr.success(data['desc'], undefined, {
            positionClass: 'toast-top-center'
          });
          this.entityContactVal=data.code;
}
else{
this.spinner.hide();
this.toastr.error(data['desc'], undefined, {
  positionClass: 'toast-top-center'
});

}

      },
      error => {
        this.spinner.hide();

        Swal.fire(
          'Error!',
          'Error.',
          'error'
        ).then(
          (result) => {

          })


      }

    )


    }

    public changedCstRelation(e: any): void {
      this.cstRelationValue= e.value;
      // this.countryValueTxt= e.data[0].text;
      if(e.data[0]){
        this.cstRelationValueTxt= e.data[0].text;

      }
    }
public addActivity(){
  this.getAllEmployee();
  this.FindMilestoneTemplatesByOrgID();
  this.activityEditable=false;
  this.disableAddAct=true;
  this.editable=false;
  this.approveChecked=false;
  this.approverValue=false;
this.showApprover=false;
  $("#activity_log_modal").modal('show');

}
viewQtn(){
  $("#qtn_modal").modal('show');
  this.FindModifiedSubTaskByProjectID(this.estimation_id,this.projectId)

}
OnQtnClose(){
  $("#qtn_modal").modal('hide');
  this.qtnCloseBtn.nativeElement.click();

}
public FindModifiedSubTaskByProjectID(lead_id,projid){
  let modifyPostData={
    "estID": lead_id,
    "projectID": projid
   }

   this.projectService.FindModifiedSubTaskByProjectID(modifyPostData).subscribe(
    (data: any) => {

      if (data.length!=0) {


        this.removedTaskList=data;
        this.modified_cost=data.map(item =>parseFloat(item.amount!=null?item.amount:0)).reduce((prev, next) => prev + next);
         let decimalValues=[];
         for(var i=0;i<data.length;i++){
           let t = data[i].worked_hrs.split(':');
           var dec = parseInt(t[0], 10)*1 + parseInt(t[1], 10)/60;
         decimalValues.push(dec)
         }
        let modified_hrs=decimalValues.map(item =>parseFloat(item!=null?item:0)).reduce((prev, next) => prev + next);
        var sign = modified_hrs < 0 ? "-" : "";
        var min = Math.floor(Math.abs(modified_hrs));
        var sec = Math.floor((Math.abs(modified_hrs) * 60) % 60);
        this.modified_hrs=sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec
        let addedTaskList=[]
        let deletedTaskList=[]
     for(var i=0;i<data.length;i++){
       if(data[i].is_added==1){
        addedTaskList.push(data[i])
       }else{
        deletedTaskList.push(data[i])


       }
     }
     this.deletedTaskList=deletedTaskList;
     this.addedTaskList=addedTaskList;
         //this.modified_cost=data.map(item =>parseFloat(item.amount)).reduce((prev, next) => prev + next);
console.log('modified_cost',this.modified_cost)

      }else{
        this.modified_cost=0

      }

    },
    error => {
      this.spinner.hide();

      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        (result) => {

        })


    }

  )

}
public addTask(){
  this.GetProjectActivityByProjectID();
  this.getAllPriority();
  this.getAllStatus();
  this.getEmployeeByOrgId();
  this.getAllEmployee();
  this.FindTeamsByOrgID();
  this.FindTaskTemplatesByOrgID();
  this.editable=false;
  $("#task_log_modal").modal('show');
  console.log('taskLogFormVal',this.taskLogForm.get('taskName').value);
  this.taskLogForm.get('taskName').valueChanges.subscribe(() => {

    const array =  this.taskListByAct;
    if(this.taskListByAct.length!=0){
      if(array.some(code => code.value === (this.taskLogForm.get('taskName').value!=''&& this.taskLogForm.get('taskName').value!=null &&this.taskLogForm.get('taskName').value[0]['value']))){
        this.arrayContains=true;
        }else{
        this.arrayContains=false;

        }
    }



  });

  this.taskLogForm.patchValue({
    date:moment().format('L')
  })

}

public addCustomer(){
  this.GetAllCustomer();
  this.FindByProjectID();
  $("#customer_modal").modal('show');

}
public OnCustomerClose(){

  $("#customer_modal").modal('hide');

}
public addLocation(){
  this.locationSetUp();

  $("#location_setup_modal").modal('show');

}
public OnLocationClose(){
  this.resetLocationAdded();
}
isFieldValid(field: string) {
  if(this.addformSubmitted){
    return (
      this.activityLogForm.get(field).errors && this.activityLogForm.get(field).touched ||
      this.activityLogForm.get(field).untouched &&
      this.addformSubmitted
    );
  }
  else if(this.editformSubmitted){
    return (

      this.activityLogForm.get(field).errors &&
      this.editformSubmitted
    );
  }
  else{

    return (
   // this.showerrorMsg=false,

      false
    );
  }

}
public activityEdit(id){

  this.editActivityId=id;
  this.activityEditable=true;
  this.editable=true;
  this.getAllEmployee();
//this.getAllStatus();
   this.GetAllProjectStatus();
  this.FindByProjectActivityID();
$('#activity_log_modal').modal('show');
}
public changedSubTask(e: any): void {
  this.subtaskListValue= e.value;
  if(e.value!='' && e.data[0]){
    this.subtaskListValueTxt=e.data[0].text;
    // this.FindByProjectSubTaskID(e.value);

  }

}
public taskEdit(id,projectId,taskType,sub_task_id){
  console.log('taskEdit',taskType,sub_task_id)
  this.editable=true;
  if(this.user_info['is_admin']==false && this.user_info['is_superadmin']==false){
    //this.showEditTask=true;
    this.disableTaskName=true;
  }else{
    this.disableTaskName=false;

  }
  if(taskType=='subtask'){
    this.editTaskId=sub_task_id;
    this.taskType='subtask';
   this.FindByProjectSubTaskID(sub_task_id);



  }else{
   this.editTaskId=id;
   this.FindByProjectSubTaskID(id);
   this.showSubtaskText=false;
   this.taskType='task';



  }
   this.project_activity_id=projectId;
  this.getEmployeeByOrgId();
this.getAllEmployee();
   this.GetProjectActivityByProjectID();
  this.getAllPriority();
  this.getAllStatus();
  this.FindTaskTemplatesByOrgID();

  this.GetAllCloseActivitiesEntityID();
  this.GetAllOpenActivitiesEntityID();
  this.FetchEntityNotesEntityID();
  this.GetAllSubTaskByTaskID(id)

$('#task_log_modal').modal('show');
}
public GetAllSubTaskByTaskID(id){
  let postData={
    id:this.editable?this.editTaskId:id
  }
  this.projectService.GetAllSubTaskByTaskID(postData).subscribe(

    (data:any) => {
      console.log('GetAllSubTaskByTaskID',data);
      this.spinner.hide();
      //let results=[{'id':'','text':'Select'}]
// //       for(var i=0;i<data.length;i++){
// // results.push({
// //   'id':data[i].id,'text':data[i].sub_task_name
// // })
//       }
if(data!=null  && data.length!=0){
  var results=[]
      // let dataObj = JSON.parse(data['token']);
    //

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
    "value": data[i].id,
    "display": data[i].sub_task_name
});

}


this.subTaskList =results;
    // this.router.navigate(["/organizations"]);
}

    }
  )
}
public taskDelete(id){

  // this.editActivityId=id;
  // this.RemoveProjectTaskID(id);
}
public activityDelete(){

}
public FindMilestoneTemplatesByOrgID(){


      return this.templateService.FindMilestoneTemplatesByOrgID().subscribe(
        (data:any)  => {
          if(data){

  var results=[{'id':'',text:'Select'}]
  // let dataObj = JSON.parse(data['token']);
//

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
"id": data[i].id,
"text": data[i].template_name
});

}


this.milestoneTempData =results

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
public FindTaskTemplatesByOrgID(){


  return this.templateService.FindTaskTemplatesByOrgID().subscribe(
    (data:any)  => {
      if(data){

var results=[{'id':'',text:'Select'}]
// let dataObj = JSON.parse(data['token']);
//

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
"id": data[i].id,
"text": data[i].template_name
});

}


this.taskTempData =results
this.ejsTaskData=results

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
public FindTaskTemplatesByTemplateID(id){

 let postData= {
    "ID": id
  }


      return this.templateService.FindTaskTemplatesByTemplateID(postData).subscribe(
        (data:any)  => {
          if(data){

           this.taskLogForm.patchValue({
            taskName: data.task_name,
             desc: data.task_desc,
             date: moment(data.due_date).format('L'),

          //   remarks: new FormControl(''),
          //  // startDate: new FormControl(''),
           // endDate: new FormControl(''),
            // email: new FormControl('', [Validators.required]),



         });
        this.activListValue=data.milestone_id,
       this.taskPriority=data.priority_id,
       this.assigneeStatus=data.assignee_emp_id;

       let user_info= JSON.parse(localStorage.getItem('user_info'));

       if(data.assignee_emp_id=='Anyone' || data.assignee_emp_id==user_info['id']){
        this.disableTaskStatus=false;
       }else{
        this.disableTaskStatus=true;

       }
   setTimeout(() => this.assigneeStatus=data.assignee_emp_id, 2000);

       this.isApprove=data.is_approve_req;
       if(this.isApprove==true){
        this.isApprove=true;

       }else{
        this.isApprove=false;
       }
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
public FindByProjectSubTaskID(id){

  let postData= {
     "id": id
   }


       return this.projectService.FindBySubTaskssId(postData).subscribe(
         (data:any)  => {
           let date=''
           if(data){
            if(data.subTasks!=null){
              if(data.subTasks.due_date==null){
                date=null

              }else{
                date=moment(data.subTasks.due_date).format('L')

              }
            }else{
              if(data.tasks.due_date==null){
                date=null

              }else{
                date=moment(data.tasks.due_date).format('L')

              }
            }
            this.taskLogForm.patchValue({
            //  taskName: data.task_name,
            //   desc: data.task_desc,
              date: date,
              taskName: [{'display':data.tasks.task_name,'value':data.tasks.id}],
              subtaskName: data.subTasks!=null?[{'display':data.subTasks.sub_task_name,'value':data.subTasks.id}]:'',

           //   remarks: new FormControl(''),
           //  // startDate: new FormControl(''),
            // endDate: new FormControl(''),
             // email: new FormControl('', [Validators.required]),



          });
          if(data.subTasks==null){
            this.showSubtaskText=false;

          }else{
            this.showSubtaskText=true;

          }

         this.activListValue= data.tasks.activtity_id;


         let user_info= JSON.parse(localStorage.getItem('user_info'));

        // if(data.subTasks==null?data.subTasks.lead_id:data.subTasks.lead_id=='Anyone' || data.subTasks==null?data.tasks.assigned_empid:data.tasks.assigned_empid==user_info['id']){
        //  this.disableTaskStatus=false;
        // }else{
        //  this.disableTaskStatus=true;

        // }
        if(data.subTasks!=null){
          if(data.subTasks.lead_id=='Anyone' || data.subTasks.lead_id==user_info['id'] ){
            this.disableTaskStatus=false;
          }else{
            this.disableTaskStatus=true;
          }
        }else{
          if(data.tasks.assigned_empid=='Anyone' || data.tasks.assigned_empid==user_info['id'] ){
            this.disableTaskStatus=false;
          }else{
            this.disableTaskStatus=true;
          }
        }


        let teamMembers=[]
        if(data.subTasks==null){
          for(var i=0;i<data.tasks.employees.length;i++){
            teamMembers.push(data.tasks.employees[i].empid)
          }
        }else{
          for(var i=0;i<data.subTasks.employees.length;i++){
            teamMembers.push(data.subTasks.employees[i].empid)
          }
        }



     setTimeout(() =>{ this.assigneeStatus=teamMembers;

    }, 1500);
    setTimeout(()=>{
      this.taskPriority=data.subTasks==null?data.tasks.priority_id:data.subTasks.priority_id,

        this.leadValue=data.subTasks==null?data.tasks.assigned_empid:data.subTasks.lead_id,
        this.taskStatus=data.subTasks==null?data.tasks.status_id:data.subTasks.status_id

        if(this.leadValue==null){

          this.leadValue=user_info['id']
        }


      },1000)
        this.isApprove=data.subTasks==null?data.tasks.is_approver:data.subTasks.is_approver;
        if(this.isApprove==true){
         this.isApprove=true;
         this.approverTaskValue=data.subTasks==null?data.tasks.is_approver_id:data.subTasks.is_approver_id

        }else{
         this.isApprove=false;
        }
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
public FindByProjectTaskID(){

 let postData= {
    "ID": this.editTaskId
  }


      return this.projectService.FindByProjectTasksId(postData).subscribe(
        (data:any)  => {
          if(data){

           this.taskLogForm.patchValue({
            //taskName: data.task_name,
             desc: data.task_desc,
             date: moment(data.due_date).format('L'),

          //   remarks: new FormControl(''),
          //  // startDate: new FormControl(''),
           // endDate: new FormControl(''),
            // email: new FormControl('', [Validators.required]),



         });
        this.activListValue=this.project_activity_id,
       this.taskPriority=data.priority_id,

       this.leadValue=data.assigned_empid,
       this.taskStatus=data.status_id;

       let user_info= JSON.parse(localStorage.getItem('user_info'));

       if(data.assigned_empid=='Anyone' || data.assigned_empid==user_info['id']){
        this.disableTaskStatus=false;
       }else{
        this.disableTaskStatus=true;

       }
       let teamMembers=[]
       for(var i=0;i<data.employees.length;i++){
         teamMembers.push(data.employees[i].empid)
       }


    setTimeout(() => this.assigneeStatus=teamMembers, 1500);
       this.isApprove=data.is_approver;
       if(this.isApprove==true){
        this.isApprove=true;
        this.approverTaskValue=data.is_approver_id

       }else{
        this.isApprove=false;
       }
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
public resetLocationAdded(){
   this.searchElementRef.nativeElement.value='';
  this.nearbyAddress='';
this.disableLocationAdd=true;
this.FindByProjectID();
  $("#location_setup_modal").modal('hide');
 this.locBtnClose.nativeElement.click();


}
public resetCustomerAdded(){
  this.customerVal='';

 $("#customer_modal").modal('hide');

}
public selectedOption(e): void {


this.xpandStatus=false;
this.selectedValue=e.project_name;
this.selectedProjectId=e.project_id;
localStorage.setItem('project_id',e.project_id);
this.FindByProjectID();
this.ProjectTaskCountByProjectID();
    this.GetProjectActivityByProjectID();
    this.GetAllTaskByProjectID();
    this.FindAllProjectActivityByProjectID();

}
showRows4(){
  this.showTextArea4=true;
}
 scroll(el: HTMLElement) {
    // el.scrollIntoView();
    el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}
public  GetPriorityByOrgID(){
  this.projectService.FetchAllProjectByOrgID().subscribe(

    (data:any) => {

    if(data){
      this.projectData=data;

    }



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
public onAddProjLocation(){
  this.spinner.show();

let postData={
     "entity_id": localStorage.getItem('project_id'),
     "geo_address":this.searchElementRef.nativeElement.value,

    "formatted_address": this.changed_address?this.changed_address:this.formatted_address,
        "lat": this.latitude?JSON.stringify(this.latitude):"",
        "lang": this.longitude?JSON.stringify(this.longitude):"",
        "street_number": this.changed_street_number,
        "route": this.changed_route,
        "locality": this.changed_locality,
        "administrative_area_level_2": this.changed_administrative_area_level_2,
        "administrative_area_level_1": this.changed_administrative_area_level_1,
        "postal_code": "",
        "country":  this.changed_country,
      "city": this.changed_administrative_area_level_1


}


      return this.projectService.AddEntityLocation(postData).subscribe(
        (data:any)  => {
          if(data.status==200){
           this.resetLocationAdded();

           this.spinner.hide();


            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });
          }
          else{

            this.spinner.hide();

            Swal.fire(
              'Error!',
              data['result'].desc,
              'error'
            ).then(
              (result)=> {

              })



          }


        },
        error  => {
          this.spinner.hide();

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
public onAddCustomer(){

  this.spinner.show();

let postData={


  "project_id": localStorage.getItem('project_id'),
  "cst_id": this.customerVal
  // "createdby": "string"
}


      return this.projectService.AddProjectCustomer(postData).subscribe(
        (data:any)  => {
          if(data.status==200){
           this.resetCustomerAdded();

this.spinner.hide();
this.FindByProjectID();
          //  this.editableLoc=true;

            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });
          }else{

            this.spinner.hide();

            Swal.fire(
              'Error!',
              data['result'].desc,
              'error'
            ).then(
              (result)=> {

              })



          }


        },
        error  => {
          this.spinner.hide();

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
public GetProjectActivityTaskRatioByProjectID(){
  let postData={
    id:localStorage.getItem('project_id')
  }
  this.projectService.GetProjectActivityTaskRatioByProjectID(postData).subscribe(

    (data:any) => {
      taskchart.data=data;
      // studychart.data=data;
      // designchart.data=data;
      // shopDrawngchart.data=data;
      // extraSchart.data=data;
      //projRelatedchart.data=data;
      // let dataObj = JSON.parse(data['token']);
    //






    }
  )}
  public GetProjectMilestRatioByProjectID(){
    let postData={
      id:localStorage.getItem('project_id')
    }
    this.projectService.GetMilestoneWorkedRatioByProjectID(postData).subscribe(

      (data:any) => {
        if(data){
        for(var i=0;i<data.length;i++){
          if(data[i].activity_name=='Study'){
            studychart.data=data[i].projectMilestoneProperties;

          }else if(data[i].activity_name=='Design'){
            designchart.data=data[i].projectMilestoneProperties;


          }else if(data[i].activity_name=='Extra Services'){
            extraSchart.data=data[i].projectMilestoneProperties;


          }else  if(data[i].activity_name=='Shop Drawing'){
            shopDrawngchart.data=data[i].projectMilestoneProperties;


          }
        }

        // projRelatedchart.data=data;
        // let dataObj = JSON.parse(data['token']);
      //

        }




      }
    )}
    public ProductivityMilestoneProgressByProjectID(){
      let postData={
        id:localStorage.getItem('project_id')
      }
      this.projectService.ProductivityMilestoneProgressByProjectID(postData).subscribe(

        (data:any) => {
          if(data){

         milestCompareChart.data=data;
          // projRelatedchart.data=data;
          // let dataObj = JSON.parse(data['token']);
        //

          }




        }
      )}
      public ProductivityProjectProgressByProjectID(){
        let postData={
          id:localStorage.getItem('project_id')
        }
        this.projectService.ProductivityProjectProgressByProjectID(postData).subscribe(

          (data:any) => {
            if(data){
           projCompareChart.data=[data];

            // projRelatedchart.data=data;
            // let dataObj = JSON.parse(data['token']);
          //

            }




          }
        )}
public GetProjectActivityRatioByProjectID(){
  let postData={
    id:localStorage.getItem('project_id')
  }
  this.projectService.GetProjectActivityRatioByProjectID(postData).subscribe(

    (data:any) => {
      chart.data=data;
        for(var i=0;i<data.length;i++){
      if(data[i].project_status_name=="Completed"){
      this.projectProgress=data[i].ratio;

        }
      }


      // let dataObj = JSON.parse(data['token']);
    //





    }
  )}
  GetAllAccomplishedTaskByProjectIDAndDate(fromDate,toDate){
    let postData={
      "projectID":localStorage.getItem('project_id'),
      "startDate": fromDate,
      "endDate": toDate
    }
    this.projectService.GetAllAccomplishedTaskByProjectIDAndDate(postData).subscribe(

      (data:any) => {


           this.spinner.hide();

        // let dataObj = JSON.parse(data['token']);
      //
      this.timeTrackData=data;

      const sum = this.timeTrackData.reduce((acc, time) => acc.add(moment.duration(time.total_hrs)), moment.duration());
this.total_hrs_spent=[Math.floor(sum.asHours()).toString().length==1?(('0'+Math.floor(sum.asHours())).slice(-2)):Math.floor(sum.asHours()), Math.floor(sum.minutes()).toString().length==1?(('0'+Math.floor(sum.minutes())).slice(-2)):sum.minutes()].join(':');


      }
    )}
    OnRemarksModalClose(){
      $("#proj_remarks_modal").modal('hide');
      this.projRemarksCloseBtn.nativeElement.click();
    }
    onActRemarksClose(){
      $("#act_remarks_modal").modal('hide');
      this.actRemarksCloseBtn.nativeElement.click();
    }

    GetAccomplishedTaskByActivityID(id){
      $("#act_remarks_modal").modal('show');
      let postData={
        "id":id

      }
      this.projectService.GetAccomplishedTaskByActivityID(postData).subscribe(

        (data:any) => {

          this.accomplishedRemarksData=data[0];


        }
      )
    }
    GetAllProjectRemarksByGroupID(id){
  $("#proj_remarks_modal").modal('show');

      let postData={
        "id":id

      }
      this.projectService.GetAllProjectRemarksByGroupID(postData).subscribe(

        (data:any) => {

          this.projRemarksData=data;


        }
      )}
    GetAllProjectCheckInByProjectIDAndDate(fromDate,toDate){
      let postData={
        "projectID":localStorage.getItem('project_id'),
        "startDate": fromDate,
        "endDate": toDate

      }
      //let posData={"projectID":"18317196-5496-472f-afd3-d8b804031176","startDate":"10/24/2020","endDate":"10/24/2020"}
      this.projectService.GetAllProjectCheckInByProjectIDAndDate(postData).subscribe(

        (data:any) => {


             this.spinner.hide();


        this.projSiteTrackData=data;

        const sum = this.projSiteTrackData.reduce((acc, time) => acc.add(moment.duration(time.total_hrs)), moment.duration());
        this.proj_hrs_spent=[Math.floor(sum.asHours()).toString().length==1?(('0'+Math.floor(sum.asHours())).slice(-2)):Math.floor(sum.asHours()), Math.floor(sum.minutes()).toString().length==1?(('0'+Math.floor(sum.minutes())).slice(-2)):sum.minutes()].join(':');


        }
      )}

  public FindMilestoneTemplatesByTemplateID(id){

   let postData= {
      "ID": id
    }


        return this.templateService.FindMilestoneTemplatesByTemplateID(postData).subscribe(
          (data:any)  => {
            if(data){


             this.activityLogForm.patchValue({
              activName:data.milestone_name,
              remarks:data.milestone_desc,
              startDate: moment(data.start_date).format('L'),
              endDate: moment(data.end_date).format('L'),
              // email: new FormControl('', [Validators.required]),



           });
      this.disableAddAct=false;

        //  this.projStatusValue=data.status_id

         this.approveChecked=data.is_approve_req;
         if(this.approveChecked==true){
          this.showApprover=true;
         this.approverValue=data.approve_emp_id;

          // this.isApprove=true;

         }else{
          this.showApprover=false;
          // this.isApprove=false;
          this.approveChecked=false;
         }

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
public FindByProjectActivityID(){

 let postData= {
    "ID": this.editActivityId
  }


      return this.projectService.FindByProjectActivityID(postData).subscribe(
        (data:any)  => {
          if(data){


           this.activityLogForm.patchValue({
            activName:data[0].activity_name,
            remarks:data[0].activity_desc,
            startDate: moment(data[0].start_date).format('L'),
            endDate: moment(data[0].end_date).format('L'),
            // email: new FormControl('', [Validators.required]),



         });
    this.disableAddAct=false;

       this.projStatusValue=data[0].status_id

       this.approveChecked=data[0].is_approve_req;
       if(this.approveChecked==true){
        this.showApprover=true;
        // this.isApprove=true;

       }else{
        this.showApprover=false;
        // this.isApprove=false;
        this.approveChecked=false;
       }
       this.approverValue=data[0].approved_id;

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
public onEditCustomer(){

  this.spinner.show();
let postData={


  "project_id": localStorage.getItem('project_id'),
  "cst_id": this.customerId
  // "createdby": "string"
}


      return this.projectService.AddProjectCustomer(postData).subscribe(
        (data:any)  => {
          if(data.status==200){
           this.resetLocationAdded();

           this.spinner.hide();

          //  this.editableLoc=true;

            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });
          }else{

            this.spinner.hide();

            Swal.fire(
              'Error!',
              data['result'].desc,
              'error'
            ).then(
              (result)=> {

              })



          }


        },
        error  => {
          this.spinner.hide();

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
getContactList(id) {
  // this.countryData = []
  // this.countryValue=''
let entityId={
entityID:localStorage.getItem('project_id'),
// cstID:localStorage.getItem('project_id')
cstID:this.callCstId
}

  return this.quotationService.GetAllEntityContactByEntityIDAndCstID(entityId).subscribe(
    (data: any) => {
      // let dataObj = JSON.parse(data['token']);


      var results = [{ id: '  ', text: 'Select' }]

      // let dataObj = JSON.parse(data['token']);
      //

      for (var i = 0; i < data.length; i++) {
        // logik to create new items

        results.push({
          "id": data[i].id,
          "text": data[i].name
        });


      }


      this.entityContactData = results;
      this.entityContactVal=id;
      this.showBranchList=true;

      this.branchDataSource=data;
      for(var i=0;i<data.length;i++){
        if(data[i]['is_primary']==true){
          this.primaryContact=data[i]
        }
      }
    },
    error => {
      Swal.fire(
        'Error!',
        'Error.',
        'error'
      ).then(
        //used Arrow function here
        (result) => {

          //  this.router.navigate(['/dashboard']);
        })


    }

  )
}
onMouseOver(infoWindow, $event: MouseEvent) {
  infoWindow.open();
}

onMouseOut(infoWindow, $event: MouseEvent) {
  infoWindow.close();
}
public openDialog(checkinData){
  $('#map_modal').modal('show');
  this.selectedCheckInGroupVal="Checkin";
  this.checkInMarkers=[]
  // this.checkOutLat=parseFloat(lat);
  // this.checkOutLang=parseFloat(lang);
  this.latitude=parseFloat(checkinData.checkin_lat),
  this.longitude=parseFloat(checkinData.checkin_lang),
  this.projectName=checkinData.project_or_comp_name;
  let data=[{
    lat:checkinData.checkin_lat,
    lng:checkinData.checkin_lang,
    label:'C',
    draggable:false,
    jobName:checkinData.project_or_comp_name,
    empname:checkinData.full_name,
    address:checkinData.checkin_formatted_address,

  },{
    lat:checkinData.project_lat,
    lng:checkinData.project_lang,
    label:'P',
    draggable:false,
    jobName:checkinData.project_or_comp_name,
    empname:checkinData.full_name,
    address:checkinData.project_formatted_address,

  }]
  this.checkInMarkers=data;
  this.mapsAPILoader.load().then(() => {
    this.geoCoder = new google.maps.Geocoder;

    // this.setCurrentLocation();
    this.getAddress(parseFloat(checkinData.checkin_lat), parseFloat(checkinData.checkin_lang));




});
if(checkinData.excp_checkout_lat!=null){
  this.checkOutLat=parseFloat(checkinData.excp_checkout_lat)
  this.checkOutLang=parseFloat(checkinData.excp_checkout_lang)
  let data=[{
    lat:checkinData.excp_checkout_lat,
    lng:checkinData.excp_checkout_lang,
    label:'C',
    draggable:false,
    jobName:checkinData.project_or_comp_name,
    empname:checkinData.full_name,
    address:checkinData.checkout_formatted_address,
  },{
    lat:checkinData.project_lat,
    lng:checkinData.project_lang,
    label:'P',
    draggable:false,
    jobName:checkinData.project_or_comp_name,
    empname:checkinData.full_name,
    address:checkinData.project_formatted_address,
  }]
  this.checkOutMarkers=data;
  this.getAddress(parseFloat(checkinData.excp_checkout_lat), parseFloat(checkinData.excp_checkout_lang));

}

// let postData={
//   "ID": groupid
// }

// this.timesheetService.GetCheckOutLocationByGroupID(postData).subscribe(
// (data:any)  => {


// if(data.length!=0){
//   this.checkOutLat=parseFloat(data[0].lat)
//   this.checkOutLang=parseFloat(data[0].lang)
// }else{
//   this.checkOutLat='';
//   this.checkOutLang='';

// }



// },
// error  => {
// Swal.fire(
//   'Error!',
//   error,
//   'error'
// ).then(
//   //used Arrow function here
//   (result)=> {


//     //  this.router.navigate(['/dashboard']);
//   })


// })


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

getAddress(latitude, longitude) {
  this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {

    this.geoCodeData=results[2];

    if (status === 'OK') {
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
public OnClose(){
  $("#map_modal").modal('hide');
  $("#act_remarks_modal").modal('hide');
  this.mapCloseBtn.nativeElement.click();
  // this.selectedCheckInGroupVal="CheckIn";
  // this.checkInModel="Checkin";
  // $('#map_modal').modal('hide');
  // $('.modal-backdrop').hide();


}
public changedCustomer(e){

  this.customerVal=e.value;
  let postData={
    id:this.customerVal
  }
  this.projectService.FindByCustomerId(postData).subscribe(
    (data:any)  => {

    //   this.projectForm.patchValue({
    //     // customer_Name:new FormControl(''),
    //     // contact_name:new FormControl(''),
    //     // customer_type:new FormControl(''),
    //     // customer_email:new FormControl(''),
    //     // customer_phone:new FormControl(''),
    //     // city:new FormControl(''),
    //     // customer_Name: data.cst_name,
    //     // customer_type:data.cst_type,
    //     // customer_phone:data.phone,

    //     // street_1:data.adr,
    //     // street_2:data.street,
    //        city:data.city,








    //  name: data.entityContact.name,
    // //  position: data.entityContact.position,
    //  phone: data.entityContact.phone,
    // //  mobile: data.entityContact.mobile,
    //  email: data.entityContact.email



    //   })
    //   setTimeout(()=>{

    //     this.projcountryValue=data.country

    //         }, 500);
    // this.countryValue=data.country

    // this.router.navigate(["/organizations"]);



//        if( data!=null && data.entityContact!=null && data.entityContact.length!=0){
//          let entityContact;
//         this.showBranchList=true;

//         entityContact={
//           "id":null,
//           "entity_id":null,
//           "first_name":data.entityContact.first_name,
//           "last_name": data.entityContact.last_name,
//           "phone":data.entityContact.phone ,
//           "email": data.entityContact.email,
//           "note": data.entityContact.note,
//           // "deptid": this.deptValue,
//           "department": data.entityContact.department,
//           "relationship": data.entityContact.relationship,
//           // "desgnid": this.desgnValue,
//           "designation": data.entityContact.designation,
//           "is_primary":true
//         }

//         this.branchDataSource=[entityContact];

// // for(var i=0<i<data.entityContact.length;i++;){

// //   entityContact.push({

// //     "first_name":data.entityContact[i].first_name,
// //     "last_name": data.entityContact[i].last_name,
// //     "phone_no":data.entityContact[i].phone ,
// //     "email": data.entityContact[i].email,
// //     "is_primary": data.entityContact[i].is_primary
// //   })


// // }
// // this.branchDataSource=entityContact;
//       }

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
  //  this.FindCustomProjectPrefixByOrgIDAndPrefix(this.customPrefix)
      }
 public changedMilestoneTemp(e){
        this.milestoneTempValue=e.value;
          this.FindMilestoneTemplatesByTemplateID(e.value)
            }

            public changedTaskTemp(e){
              this.taskTempValue=e.value;
                this.FindTaskTemplatesByTemplateID(e.value)
                  }

public  GetAllCustomer() {
  this.projectService.GetAllCustomerByOrgID().subscribe(
    (data:any) => {
      var results=[{'id':'',text:'Select'}]
      // let dataObj = JSON.parse(data['token']);
    //

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
    "id": data[i].id,
    "text": data[i].cst_name
});

}


this.customerData =results
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

public onEditProjLocation(){

  this.spinner.show();

  let postData={
       "entity_id": localStorage.getItem('project_id'),
       "geo_address":this.searchElementRef.nativeElement.value,
      "formatted_address": this.changed_address?this.changed_address:this.formatted_address,
          "lat": this.latitude?JSON.stringify(this.latitude):"",
          "lang": this.longitude?JSON.stringify(this.longitude):"",
          "street_number": this.changed_street_number,
          "route": this.changed_route,
          "locality": this.changed_locality,
          "administrative_area_level_2": this.changed_administrative_area_level_2,
          "administrative_area_level_1": this.changed_administrative_area_level_1,
          "postal_code": "",
          "country":  this.changed_country,

  }


        return this.projectService.UpdateEntityLocation(postData).subscribe(
          (data:any)  => {
            if(data.status==200){
              this.resetLocationAdded();
           //this.FindByProjectID();
           this.spinner.hide();

             this.editableLoc=true;

              this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
           });
            }else{

              this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result)=> {

                })



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
public nearByPlaces(){
if(this.editableLoc==false){
  this.setCurrentLocation();

}
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

  if(event.keyCode == 8 && this.searchElementRef.nativeElement.value=='' ){
    this.showNearbyPlaces=true;
    // this.searchLocVal='';
    this.disableLocationAdd=true;

    this.mapsAPILoader.load().then(() => {
      this.nearByPlaces();
     });
  }else{
    this.disableLocationAdd=false;

  }


}

clickFunction (){
   if(this.searchElementRef.nativeElement.value==''){
    this.showNearbyPlaces=true;
    this.disableLocationAdd=true;


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
  this.disableLocationAdd=false;
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

public locationSetUp(){

  $('#kt_user_edit_tab_3').trigger('click')
  this.mapsAPILoader.load().then(() => {
    //this.nearByPlaces();
   this.geoCoder = new google.maps.Geocoder;
 if(this.editableLoc==false){
  this.setCurrentLocation();

 }
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
private setCurrentLocation() {
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.zoom = 8;

    this.getAddress(this.latitude, this.longitude);


  });
}
}
public onSearchChange(){

}

markerDragEnd($event: MouseEvent) {

  this.latitude = $event.coords.lat;
  this.longitude = $event.coords.lng;
  this.getAddress(this.latitude, this.longitude);
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


public onChange(e){
  this.ejsDueDate=moment(e.value).format('L');


}
public addMultiTask(){
  const emails = this.emailForm.get('emails') as FormArray
  let postData=[];
  let user:object;
  if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));

  }
  for(var i=0;i<emails.value.length;i++){
    if(emails.value[i].OrderID!=''){
      let empdata=[];

if(emails.value[i].Assignee && emails.value[i].Assignee.length!=0){
for(var j=0;j<emails.value[i].Assignee.length;j++){
        empdata.push({

          "id": null,
          "task_id": null,
          "empid": emails.value[i].Assignee[j],


      });
      }
}

      let object={
        "id": emails.value[i].taskId,
        "project_id": localStorage.getItem('project_id'),
        "activtity_id": emails.value[i].MilestoneName,
        "empid": user['id'],
        "task_name": emails.value[i].OrderID[0].display,
        "sub_task_name": emails.value[i].SubtaskName,
        "task_desc": emails.value[i].taskDesc,
        "priority_id": emails.value[i].Priority,
        "status_id":null,
        "assigned_empid": emails.value[i].Lead!=''?emails.value[i].Lead:user['id'],
        "due_date": moment(emails.value[i].DueDate).format('L'),
        "createdby": user['full_name'],
        "is_approver": emails.value[i].ApproverCheck!=''?emails.value[i].ApproverCheck:false,
        "is_approver_id": emails.value[i].ApproverCheck!=''?emails.value[i].Approver:null,
        "employees":empdata

        }
    postData.push(object)

    }

  }
  console.log('postData',postData);
  if(this.emailForm.get('emails').status=='VALID'){
    return this.projectService.AddMultipleTask(postData).subscribe(
      (data:any)  => {
      if(data.status==200){
      $("#task_log_modal").modal('hide');
  this.taskCloseBtn.nativeElement.click();

      this.GetAllTaskByProjectID();
      this.ProjectTaskCountByProjectID();

        this.resetMultiTaskForm()
        this.spinner.hide();

        this.toastr.success(data['desc'], undefined,{
          positionClass: 'toast-top-center'
     });

     if(data){
      let postData = {
      entity_id: localStorage.getItem('project_id'),
      event_type: "Project Multiple Task added",
      event_desc: "Project Multiple task added successfully",
     };
     this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
          console.log('History Added',data)
      });
     }

      }else{

        this.spinner.hide();

        Swal.fire(
          'Error!',
          data['result'].desc,
          'error'
        ).then(
          (result)=> {

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
public viewCloseAct(id){
  $("#close_act_modal").modal('show');
  this.GetLocalActivitieEntityID(id)

}
GetLocalActivitieEntityID(id) {
  this.spinner.show();
  let postData={
    "id": id
  }
  this.quotationService.GetLocalActivitieEntityID(postData).subscribe(
    (data: any) => {
      this.spinner.hide();

      // let dataObj = JSON.parse(data['token']);
      //
      if(data.length!=0){
        this.closeActData=data[0];
      }




    },
    error => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        //used Arrow function here
        (result) => {

          //  this.router.navigate(['/dashboard']);
        })


    }

  )
}
onCloseActClose(){
  $("#close_act_modal").modal('hide');
  this.closeActBtn.nativeElement.click();

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
isCheckinActivityLogFieldValid(field: string) {
  if(this.checkinAddActformSubmitted){

    return (
    this.showerrorMsg=true,
      this.checkinLogForm.get(field).errors && this.checkinLogForm.get(field).touched ||
      this.checkinLogForm.get(field).untouched &&
      this.checkinAddActformSubmitted
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
public openActivityLog  (element) {
  this.isDisableTask=true;
  // this.act_proj_name='';
  // this.act_sys_name='';
  // this.act_formatted_address='';
  //this.GetAllAdministrative();
  this.GetAllTaskByEmpID();
  console.log('openActivityLog',element);
  this.GetProjTaskonActID(element.project_activity_id);
   this.getTimesheetByEmpId();
  this.showPurposeToggle=true;

  //this.maxAddLogEndTime=localStorage.getItem('currentTime');
  if(element.status_name=='Open'){
    this.allowUpdateStatus=true
  }else{
    this.allowUpdateStatus=false

  }

  $('#checkin_log_modal').modal('show');
  this.checkinBillable=false;
this.GetProjSubTaskonTaskID(element.task_id)
if(element.sub_task_id!=null){
  this.sub_taskId=element.sub_task_id+'/'+element.subtask_name

}else{
  this.sub_taskId=''
}
  setTimeout(() => {$('#taskField').prop('checked', true),
  this.showActivityTasks=true,
  this.showPurposeTasks=false,
this.projTaskDataValue=element.task_id,
this.projTaskDataText=element.task_name
if(element.sub_task_id!=null){
  this.sub_taskId=element.sub_task_id+'/'+element.subtask_name

}else{
  this.sub_taskId=''
}
}, 500);


console.log('sub_task_id',element.sub_task_id);
// this.checkinLogForm.patchValue({
//   endTime:moment().format("hh:mm a")
// });
// this.checkinLogForm.get('endTime').enable();

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
this.taskActivityId=element.project_activity_id;
this.activityDataText=element.activity_name;




};
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
public showProjTask(e:any){
  if(e.srcElement.checked) {
  this.showProjBasedTasks=true;
  this.GetAllTaskByProjectID();

  }else{
    this.showProjBasedTasks=false;
    this.GetAllTaskByProjectID();
  }


}
public onAddProjTask(){

  let team_member_empid=[]

 if(this.teamMemFetchData){
  for(var i=0;i<this.teamMemFetchData.length;i++){
    team_member_empid.push(this.teamMemFetchData[i].id)

  }
}
let employee={
  "empid": team_member_empid
}
let user:object;
  if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));

  }
  let empdata=[];
  for(var i=0;i<this.assigneeStatus.length;i++){
    empdata.push({

      "id": null,
      "task_id": null,
      "empid": this.assigneeStatus[i],


  });
  }

  console.log('arrayContains',this.arrayContains,this.taskLogForm.get('subtaskName').value);
  let postData={
    id:this.arrayContains?this.taskLogForm.get('taskName').value[0]['value']:null,
    project_id: localStorage.getItem('project_id'),
    activtity_id: this.activListValue,
    "is_local_activity": true,
    // sub_task_id:null,

    // task_name: this.taskLogForm.get('taskName').value,
  task_name:(this.taskLogForm.get('taskName').value!='' && this.taskLogForm.get('taskName').value!=null)?this.taskLogForm.get('taskName').value[0]['display']:null,
  sub_task_name:(this.taskLogForm.get('subtaskName').value!='' && this.taskLogForm.get('subtaskName').value!=null)?this.taskLogForm.get('subtaskName').value[0]['display']:null,

    task_desc: this.taskLogForm.get('desc').value,
    priority_id:this.taskPriority,
    status_id:null,
    assigned_empid:this.leadValue,
    // dep_id: this.departmentLeadValue
      due_date: this.ejsDueDate,
      "employees": empdata,
      is_approver:this.isApprove,
      is_approver_id:(this.isApprove?this.approverTaskValue:null),


  }

  console.log('postData',postData);
 $('#toggleCheck').prop('checked',true);

//  $('#toggleCheck').attr('checked', true);
 $('#toggleCheck').attr('disabled', 'disabled')


// team_member_empid.push(user_info['id'])
let sendData = {
  entity_id: localStorage.getItem('project_id'),
  event_type: "Project Single Task",
  event_desc: "Successfully added Project Single Task",
};
console.log(sendData)
this.histSer.AddEntityHistoryLog(sendData).subscribe((data)=> {
  console.log(data)
  this.getLeadHistory(localStorage.getItem('project_id'));
});


if(this.taskTemplateAdd){
  let data={
    "id": null,
    "template_name": this.taskLogForm.get('taskTemplateName').value,
    "milestone_id": this.activListValue,
    task_name: this.taskLogForm.get('taskName').value  ,
    task_desc: this.taskLogForm.get('desc').value,
    priority_id:this.taskPriority,
    assigned_empid:this.leadValue,
    // dep_id: this.departmentLeadValue
      due_date: this.ejsDueDate,
     // employees:team_member_empid.length==0?null:employee,
      is_approve_req:this.isApprove,
      approve_emp_id:(this.isApprove?this.approverTaskValue:null),

  }
   this.templateService.AddTaskTemplate(data).subscribe(
    (data:any)  => {
      // let dataObj = JSON.parse(data['token']);
    if(data.status==200){
      //this.TaskView();
   $('#taskTemp').prop('checked',false)
     this.taskTemplateAdd=false;
      this.toastr.success(data['desc'], undefined,{
        positionClass: 'toast-top-center'
   });

    }else{

      this.spinner.hide();

      Swal.fire(
        'Error!',
        data['result'].desc,
        'error'
      ).then(
        (result)=> {

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
 this.spinner.show();

        return this.projectService.AddProjTask(postData).subscribe(
          (data:any)  => {
          if(data.status==200){

          this.GetAllTaskByProjectID();
    this.ProjectTaskCountByProjectID();

            this.resetForm()
            this.spinner.hide();

            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });

          }else{

            this.spinner.hide();

            Swal.fire(
              'Error!',
              data['result'].desc,
              'error'
            ).then(
              (result)=> {

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
// public onUpdateProjSubTask(){
//   this.spinner.show();
//   let team_member_empid=[]

//  if(this.teamMemFetchData){
//   for(var i=0;i<this.teamMemFetchData.length;i++){
//     team_member_empid.push(this.teamMemFetchData[i].id)

//   }
// }


// let employee={
//   "empid": team_member_empid
// }
// let empdata=[];
//   for(var i=0;i<this.assigneeStatus.length;i++){
//     empdata.push({

//       "id": null,
//       "task_id": null,
//       "empid": this.assigneeStatus[i],


//   });
//   }
//   let postData={
//     id:this.subtaskListValue,
//     project_id: localStorage.getItem('project_id'),
//     activtity_id: this.activListValue,

//     task_name: this.subtaskListValueTxt  ,
//     task_desc: this.taskLogForm.get('desc').value,
//     priority_id:this.taskPriority,
//     status_id:this.taskStatus,
//     assigned_empid:this.leadValue,
//     // dep_id: this.departmentLeadValue
//       due_date: this.ejsDueDate,
//       employees:empdata,
//       is_approver:this.isApprove,
//       is_approver_id:(this.isApprove?this.approverTaskValue:null),

//   }


//  $('#toggleCheck').prop('checked',true);
// //  $('#toggleCheck').attr('checked', true);
//  $('#toggleCheck').attr('disabled', 'disabled')
// console.log('UpdateTask',postData)

// // team_member_empid.push(user_info['id'])





//         return this.projectService.UpdateSubTasks(postData).subscribe(
//           (data:any)  => {
//             // let dataObj = JSON.parse(data['token']);
//           if(data.status==200){
//             //this.TaskView();
//   this.spinner.hide();
// this.subtaskListValue='';

//           this.GetAllTaskByProjectID();
//           this.GetProjectActivityTaskRatioByProjectID();
//             this.resetForm();

//             this.toastr.success(data['desc'], undefined,{
//               positionClass: 'toast-top-center'
//          });

//           }else{

//             this.spinner.hide();

//             Swal.fire(
//               'Error!',
//               data['result'].desc,
//               'error'
//             ).then(
//               (result)=> {

//               })



//           }
//           // this.router.navigate(["/organizations"]);

//           },
//           error  => {
//             Swal.fire(
//               'Error!',
//               'Error.',
//               'error'
//             ).then(
//               //used Arrow function here
//               (result)=> {

//                 //  this.router.navigate(['/dashboard']);
//               })


//           }

//           )
// }
public onUpdateProjTask(){
  this.spinner.show();
  let team_member_empid=[]

 if(this.teamMemFetchData){
  for(var i=0;i<this.teamMemFetchData.length;i++){
    team_member_empid.push(this.teamMemFetchData[i].id)

  }
}


let employee={
  "empid": team_member_empid
}
let empdata=[];
  for(var i=0;i<this.assigneeStatus.length;i++){
    empdata.push({

      "id": null,
      "task_id": null,
      "empid": this.assigneeStatus[i],


  });
  }
  let postData={
    id:this.editTaskId,
    project_id: localStorage.getItem('project_id'),
    activtity_id: this.activListValue,
    // sub_task_id:null,
    "is_local_activity": true,
    // task_name: this.taskLogForm.get('taskName').value,
  task_name:this.taskLogForm.get('taskName').value[0]['display'],
  sub_task_name:this.taskLogForm.get('subtaskName').value!=''?this.taskLogForm.get('subtaskName').value[0]['display']:null,

    task_desc: this.taskLogForm.get('desc').value,
    priority_id:this.taskPriority,
    status_id:this.taskStatus,
    assigned_empid:this.leadValue,
    // dep_id: this.departmentLeadValue
      due_date: this.ejsDueDate,
      "employees": empdata,
      is_approver:this.isApprove,
      is_approver_id:(this.isApprove?this.approverTaskValue:null),


  }



 $('#toggleCheck').prop('checked',true);
//  $('#toggleCheck').attr('checked', true);
 $('#toggleCheck').attr('disabled', 'disabled')
console.log('onUpdateProjTask',postData)

// team_member_empid.push(user_info['id'])
if(this.taskLogForm.get('date').value!=null){

        return this.projectService.UpdateTask(postData).subscribe(
          (data:any)  => {
          if(data.status==200){
  this.spinner.hide();
this.subtaskListValue='';

          this.GetAllTaskByProjectID();
          this.GetProjectActivityTaskRatioByProjectID();
            this.resetForm();
this.disableTaskName=false
            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });

         if(data){
          let postData = {
          entity_id: localStorage.getItem('project_id'),
          event_type: "Project Single Task updated",
          event_desc: "Successfully updated Project Single Task",
         };
         this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
          this.getLeadHistory(localStorage.getItem('project_id'));
          });
         }


          }else{

            this.spinner.hide();

            Swal.fire(
              'Error!',
              data['result'].desc,
              'error'
            ).then(
              (result)=> {

              })



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

onOpen(args) {
  console.log('args',args);
  // args.popup.position = { X: "left", Y: "top" }; // changing popup position
  // args.popup.position = { X: "top", Y: "top" };
  args.popup.offsetX=0; // changing the popup position with set any number value
  args.popup.offsetY=-420;
}

public onUpdateProjSubTask(){
  let team_member_empid=[]

 if(this.teamMemFetchData){
  for(var i=0;i<this.teamMemFetchData.length;i++){
    team_member_empid.push(this.teamMemFetchData[i].id)

  }
}


let employee={
  "empid": team_member_empid
}
let empdata=[];
  for(var i=0;i<this.assigneeStatus.length;i++){
    empdata.push({

      "id": null,
      "task_id": null,
      "empid": this.assigneeStatus[i],


  });
  }
  let postData={
    id:this.editTaskId,
    project_id: localStorage.getItem('project_id'),
    activtity_id: this.activListValue,
    // sub_task_id:null,

    // task_name: this.taskLogForm.get('taskName').value,
  // task_name:this.taskLogForm.get('taskName').value[0]['display'],
  sub_task_name:this.taskLogForm.get('subtaskName').value!=''?this.taskLogForm.get('subtaskName').value[0]['display']:null,

  sub_task_desc: this.taskLogForm.get('desc').value,
    priority_id:this.taskPriority,
    status_id:this.taskStatus,
    lead_id :this.leadValue,
    // dep_id: this.departmentLeadValue
      due_date: this.ejsDueDate,
      "employees": empdata,
      is_approver:this.isApprove,
      is_approver_id:(this.isApprove?this.approverTaskValue:null),


  }



 $('#toggleCheck').prop('checked',true);
//  $('#toggleCheck').attr('checked', true);
 $('#toggleCheck').attr('disabled', 'disabled')
console.log('onUpdateProjSubTask',postData)

// team_member_empid.push(user_info['id'])
if(this.taskLogForm.get('date').value!=null){
  this.spinner.show();

        return this.projectService.UpdateSubTaskExceptUnitQty(postData).subscribe(
          (data:any)  => {
          if(data.status==200){
  this.spinner.hide();
this.subtaskListValue='';

          this.GetAllTaskByProjectID();
          this.GetProjectActivityTaskRatioByProjectID();
            this.resetForm();

            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });

         if(data){
          let postData = {
          entity_id: localStorage.getItem('project_id'),
          event_type: "Project Single Task updated",
          event_desc: "Project Single Task updated successfully",
         };
         this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
          this.getLeadHistory(localStorage.getItem('project_id'));
          });
         }

          }else{

            this.spinner.hide();

            Swal.fire(
              'Error!',
              data['result'].desc,
              'error'
            ).then(
              (result)=> {

              })



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
public resetForm(){
  this.taskLogForm.reset();
  this.taskPriority='';
  this.assigneeStatus='';
  this.approverValue='';
  this.editable=false;
  this.activListValue='';
  this.dateValue=null;
  this.isApprove=false;
  this.showSubtaskText=false;
  this.taskListByAct=[];


   $("#task_log_modal").modal('hide');
   $("#chosetaskTemp").prop('checked',false);
   this.choseTaskTemplate=false;
   this.taskCloseBtn.nativeElement.click();



}
public resetMultiTaskForm(){
  // let arr = <FormArray>this.emailForm.controls['emails'];
  // arr.clear();
  const emails = this.emailForm.get('emails') as FormArray
  if (emails.length > 1) {
    //emails.removeAt(i)
    for (var i = 0; i < emails.length; i++) {
      // logik to create new items

      emails.removeAt(i)

      }

  } else {
// emails.controls.forEach(pair => pair.patchValue({ Assignee: '' }));

    emails.reset()
  }
  emails.controls.forEach(pair => pair.patchValue({ Assignee: '' }));

// Iterates the Pairs' FormArray controls and use patchValue if you want to reset or assign a new value to a particular property
  // this.emailForm.controls['email'].reset();
this.submitClicked=false;
}
public tab1(){
  this.singleTask=true;
  this.multiTask=false;
}
public tab2(){
  this.singleTask=false;
  this.multiTask=true;
}
public resetActivityForm(){
  this.activityLogForm.reset();
  this.taskPriority='';
  this.assigneeStatus='';
  this.approverValue='';
  this.activityEditable=false;
this.editformSubmitted=false;
this.addformSubmitted=false;
this.disableAddAct=true;
this.approveChecked=null;


  $("#activity_log_modal").modal('hide');


}
public OnTaskClose(){
  this.resetForm();
  this.resetMultiTaskForm();
}
public enableAddAct(){
  // if(this.activityLogForm.get('activName').value!=''){
  //   this.disableAddAct=false;

  // }else{
  //   this.disableAddAct=true;

  // }
}
public changedPriority(e: any): void {
  this.taskPriority= e.value;

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
public checkIsTeam(e:any){

  if(e.srcElement.checked) {
    this.teamAdd=true;
    this.EmpList();

  }else{
    this.teamAdd=false;

  }

}
public checkIsTemplate(e:any){

  if(e.srcElement.checked) {
    this.templateAdd=true;

  }else{
    this.templateAdd=false;

  }

}
public changedActTaskStatus(e: any): void {
  this.actTaskStatusValue= e.value;
  if(e.value!='' && e.value!='Select' && e.data[0]!='' ){

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
public GetProjTaskonActID(id): void {
  let actID={
    "ID": id
  }
  this.projectService.GetAllTaskByActivityID(actID).subscribe(

    (data:any) => {


var results=[{ id: '', text: 'Select' , additional:{
  assigned_empid:'',
  status_id:'',
  assignee:'',
  taskDesc:'',
  milestone:'',
  dueDate:'',
  assigne_id:'',
  project_id:'',
  milestone_id:'',
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
               assignee:'',
             //  assignee:data[i].assigned_name,
              taskDesc:'',
             // taskDesc:data.project_name,
              milestone:data[i].activity_name,
              dueDate:data[i].due_date,
              assigne_id:data[i].assigned_empid,
              status_id:data[i].status_id,
              project_id:data[i].assigned_empid,
              milestone_id:data[i].assigned_empid,
            }
        });

        }
    }

this.projTaskData =results;
this.taskWithDesc=results;
console.log('taskWithDesc',this.taskWithDesc);

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

  }else{
     this.recentTaskSel=true;

    this.projTaskDataValue='';

  }



}
public checkIsTaskTemplate(e:any){

  if(e.srcElement.checked) {
    this.taskTemplateAdd=true;

  }else{
    this.taskTemplateAdd=false;

  }

}
public checkIsChooseTaskTemplate(e:any){

  if(e.srcElement.checked) {
    this.choseTaskTemplate=true;

  }else{
    this.choseTaskTemplate=false;

  }

}
public checkIsChooseMilestTemp(e:any){

  if(e.srcElement.checked) {
    this.choseMilestTemplate=true;

  }else{
    this.choseMilestTemplate=false;

  }

}

public checkIsDept(e: any): void{

  if(e.srcElement.checked) {
    this.filterEmpByDept=true;


  }else{
    this.filterEmpByDept=false;

  }
  // this.filterEmpByDept=!this.filterEmpByDept
  if(this.filterEmpByDept){
    // this.getAllDept();
    this.teamData=[];

    $('#toggleDesgnCheck').attr("disabled","disabled");
    $('#toggleFreeLanCheck').attr("disabled","disabled");
    $('#toggleOutSourceCheck').attr("disabled","disabled");
  }else{
    $('#toggleDesgnCheck').removeAttr('disabled');
    $('#toggleFreeLanCheck').removeAttr('disabled');
    $('#toggleOutSourceCheck').removeAttr('disabled');

  }
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

public RemoveProjectActivity(id){
  let postData={
    "ID": id
  }
  this.projectService.RemoveProjectActivity(postData).subscribe(

    (data:any) => {

      if(data.status==200){
        this.FindAllProjectActivityByProjectID();


       //  this.editableLoc=true;

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

          //  this.router.navigate(['/dashboard']);
        })


    }

    )
}
public RemoveProjectTask(id){
  let postData={
    "ID": id
  }
  this.projectService.RemoveTask(postData).subscribe(

    (data:any) => {

      if(data.status==200){
        this.GetAllTaskByProjectID();


       //  this.editableLoc=true;

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

          //  this.router.navigate(['/dashboard']);
        })


    }

    )
}
public ProjectTaskCountByProjectID(){
  let postData={
    "ID": localStorage.getItem('project_id')
  }
  this.projectService.ProjectTaskCountByProjectID(postData).subscribe(

    (data:any) => {

if(data.length!=0){
  this.projTaskCount=data;

}else{
  this.projTaskCount=0;

}
      // let dataObj = JSON.parse(data['token']);






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

public changedTeamMember(e: any): void {
  this.teamMemberValue=e.value;
  this.teamEmpName=e.data[0].text;

}
public teamDelete(id){

  for(var i = 0;i < this.teamMemFetchData.length; i ++)
{
if((this.teamMemFetchData[i].data?this.teamMemFetchData[i].data.id:this.teamMemFetchData[i].id) ==id)
{
  this.teamMemFetchData.splice(i, 1);
  this.teamMembers.splice(id,1)
  // if(this.teamMemFetchData[i].data){
  //   this.teams.splice(this.teamMemFetchData[i].data.id,1)

  // }else{
  //   this.teamMembers.splice(this.teamMemFetchData[i].id,1)

  // }
}
}
this.checkedValues();
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

  this.empgrid.refresh();
  let datas = new DataManager(this.teamMemFetchData);
  this.empDataSource=datas.dataSource['json']

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
public AddTeamMembers(){

    if(this.teamMembers.length==0){


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
    else{

      if(!this.teamMembers.includes(this.teamMemberValue)){
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

        else{
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

 public checkIsDesgn(e: any): void{
  if(e.srcElement.checked) {
    this.filterEmpByDesgn=true;


  }else{
    this.filterEmpByDesgn=false;

  }
  this.teamData=[];
  if(this.filterEmpByDesgn){
    this.getAllDesignationByOrgID();

    $('#toggleDeptCheck').attr("disabled","disabled");
    $('#toggleFreeLanCheck').attr("disabled","disabled");
    $('#toggleOutSourceCheck').attr("disabled","disabled");
  }else{
    $('#toggleDeptCheck').removeAttr('disabled');
    $('#toggleFreeLanCheck').removeAttr('disabled');
    $('#toggleOutSourceCheck').removeAttr('disabled');

  }
 }
 public checkIsFreeLan(e: any): void{
  if(e.srcElement.checked) {
    this.filterEmpByFreeLanc=true;


  }else{
    this.filterEmpByFreeLanc=false;

  }
  if(this.filterEmpByFreeLanc){
    this.EmpList();

    $('#toggleDeptCheck').attr("disabled","disabled");
    $('#toggleDesgnCheck').attr("disabled","disabled");
    $('#toggleOutSourceCheck').attr("disabled","disabled");
  }else{
    $('#toggleDeptCheck').removeAttr('disabled');
    $('#toggleDesgnCheck').removeAttr('disabled');
    $('#toggleOutSourceCheck').removeAttr('disabled');

  }
 }
 public checkIsOutsource(e: any): void{
  if(e.srcElement.checked) {
    this.filterEmpByOutsource=true;


  }else{
    this.filterEmpByOutsource=false;

  }
  if(this.filterEmpByOutsource){
    this.EmpList();

    $('#toggleDeptCheck').attr("disabled","disabled");
    $('#toggleFreeLanCheck').attr("disabled","disabled");
    $('#toggleDesgnCheck').attr("disabled","disabled");
  }else{
    $('#toggleDeptCheck').removeAttr('disabled');
    $('#toggleFreeLanCheck').removeAttr('disabled');
    $('#toggleDesgnCheck').removeAttr('disabled');

  }
 }
 public changedStatus(e: any): void {
  this.taskStatus= e.value;

}
public changedAssignee(e: any): void {
  let user_info:object;

  if(localStorage.getItem('user_info')){
      user_info= JSON.parse(localStorage.getItem('user_info'));

  }
  this.currentUser=user_info['id'];
  this.assigneeStatus= e.value;

  if(this.assigneeStatus!=null && this.assigneeStatus.length==1){
    if(this.assigneeStatus[0]==user_info['id']){
      this.showAssigneeApprove=false;
      this.showAssigneeLead=false;
    }else{
      this.showAssigneeApprove=true;
      this.showAssigneeLead=true;

    }


  }else{
    this.showAssigneeLead=true;
    this.showAssigneeApprove=true;


  }

}


public changedLeadAssignee(e: any): void {
  this.leadValue= e.value;
  let user_info:object;
  if(localStorage.getItem('user_info')){
      user_info= JSON.parse(localStorage.getItem('user_info'));

  }
  if(this.leadValue==user_info['id']){
    this.disableTaskStatus=false;
   }else{
    this.disableTaskStatus=true;

   }


}
public changedTeam(e: any): void {
  this.teamValue= e.value;

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

changedApprover(e){
this.approverValue=e.value;
this.addformSubmitted=false;

}
changedTaskApprover(e){
  this.approverTaskValue=e.value;
  }
changedProjStatus(e){
  this.projStatusValue=e.value;
  }
GetProjectActivityByProjectID(){
  let postData={
    id:localStorage.getItem('project_id')
  }
  this.projectService.GetProjectActivityByProjectID(postData).subscribe(

    (data:any) => {
      this.projActivityCount=data.length;
      // this.dataSource=data;
      var results=[{ id: '', text: 'Select' }]

      // let dataObj = JSON.parse(data['token']);
    //

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
    "id": data[i].id,
    "text": data[i].activity_name
});

}


this.activList =results;
 this.ejsactivList=results;

    }
  )
    }

    FindAllProjectActivityByProjectID(){
      let postData={
        id:localStorage.getItem('project_id')
      }
      this.projectService.FindAllProjectActivityByProjectID(postData).subscribe(

        (data:any) => {

          // this.dataSource.connect().next(data);
          let completedTasks=[]
          let openTasks=[]
          let inProgrssTasks=[]


          if(data){
            this.dataSource=data;
            this.allActCount=data.length;
            for (var i = 0; i < data.length; i++) {
              // logik to create new items

              if(data[i].status_name=="Completed"){


                completedTasks.push(data[i]);
              }
              else if(data[i].status_name=="Open"){
                openTasks.push(data[i]);


              }else{
                inProgrssTasks.push(data[i]);
              }
            this.activityCompletedList=completedTasks;
            this.activityOpenList=openTasks;
           this.completedActCount=completedTasks.length;




          }
        }


    }



      )
        }

public GetAllTaskByProjectID (){
  let postData={
    id:localStorage.getItem('project_id')
  }
  this.projectService.GetAllTaskByProjectID(postData).subscribe(

    (data:any) => {
     // this.taskDataSource=data;

           let completedTasks=[]
           let openTasks=[]
           let inProgrssTasks=[]


           if(data){
          //    for (var i = 0; i < data.length; i++) {


          //      if(data[i].status_name=="Completed"){


          //        completedTasks.push(data[i]);
          //      }
          //      else if(data[i].status_name=="Open"){
          //        openTasks.push(data[i]);


          //      }else{
          //        inProgrssTasks.push(data[i]);
          //      }
          //    this.taskCompletedList=completedTasks;
          //    this.taskOpenList=openTasks;



          //  }

           let localemployeeTasks=[];

           let localOpenTasks=[];
           let localCompletedTasks=[];
           let projemployeeTasks=[];

           let projOpenTasks=[];
           let projCompletedTasks=[];

                   for(var i=0;i<data.length;i++){
                    if(data[i].is_local_activity==1){
                      if(data[i].status_name!="Completed"){
                       localemployeeTasks.push(data[i])

                      }
                    }else{
                     if(data[i].status_name!="Completed"){
                     projemployeeTasks.push(data[i])
                     }
                    }
                    if(data[i].status_name=="Open" && data[i].is_local_activity==1){
                     localOpenTasks.push(data[i]);
                   }else if(data[i].status_name=="Open" && data[i].is_local_activity==0){
                     projOpenTasks.push(data[i]);

                   }
                   if(data[i].status_name=="Completed" && data[i].is_local_activity==1){
                    localCompletedTasks.push(data[i]);
                  }else if(data[i].status_name=="Completed" && data[i].is_local_activity==0){
                    projCompletedTasks.push(data[i]);

                  }
                 }
                 console.log('projCompletedTasks',projCompletedTasks,this.taskDataSource);
                 console.log('taskDataSource',this.taskDataSource);
                 console.log('projOpenTasks',projOpenTasks);

                 if(this.showProjBasedTasks){

            this.allTaskList=localemployeeTasks;

                  this.taskCompletedList=localCompletedTasks;
                  this.taskOpenList=localOpenTasks;

                }else{

                  this.taskCompletedList=projCompletedTasks;
                  this.taskOpenList=projOpenTasks;
            this.allTaskList=projemployeeTasks;


                }
         }
         console.log('allTaskList',this.allTaskList);

      // let dataObj = JSON.parse(data['token']);
    //






    }
  )
    }

public  getAllEmployee(){
  this.empService.getEmployeeByOrgId().subscribe(

    (data:any) => {
      var results=[{ id: '', text: 'Select' }]

      // let dataObj = JSON.parse(data['token']);
    //

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
    "id": data[i].id,
    "text": data[i].first_name
});

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
    // public onstartDtChange(e){
    //   this.startdateValue=moment(e.value).format('L');
    //

    // }
public dragdrp(){
            this.router.navigate(['/drag-drop']);
        }
        public empdragdrp(){
          this.router.navigate(['/employee-layout']);
      }
    public onstartDtChange(e){
      this.startdateValue=moment(e.value).format('L');

        this.disableEndDate=false;

        this.activityLogForm.get('startDate').valueChanges.subscribe(() => {
          // fires when the input value has actually changed
          if(this.activityLogForm.get('startDate').value!=''){
            this.startValChange=true;
          }
          let startDate=this.activityLogForm.get('startDate').value;
          this.minEndDate=startDate;

          this.activityLogForm.get('endDate').enable()






      });


    }
    public onendDtChange(e){
      this.enddateValue=moment(e.value).format('L');
      this.disableAddAct=false;


    }
    public onCheckChange(e){
      this.addApprover=e.value;
      this.showApprover=!this.showApprover;
      // this.isApprove=true;
    }
    public onTaskCheckChange(e){

      this.taskApprove=e.value;
      if(e.srcElement.checked==true){
        this.isApprove=true
      }else{
        this.isApprove=false

      }

    }
    public onBillableCheckChange(){
      this.billable=!this.billable;


    }
    OnCheckinClose(){
  $('#checkin_log_modal').modal('hide');
  this.checkinClose.nativeElement.click();

  this.errorTimeExcced = false;
    }
    public OnActivityClose(){
      $("#activity_log_modal").modal('hide');
    this.disableAddAct=true;
     this.activityLogForm.reset();
     this.addformSubmitted=false;
     this.editformSubmitted=false;
     this.milestoneTempValue='';
     this.choseMilestTemplate=false;
     $('#milestTemp').prop('checked',false)

  //    this.activityLogForm.patchValue({

  //     startDate: moment().format('L'),
  //     endDate: moment().format('L'),



  //  });
     this.activityEditable=false;
     this.approveChecked=null;


    }

    public  getAllPriority(){
      this.taskService.GetPriorityByOrgID().subscribe(

        (data:any) => {

          var results=[{ id: '', text: 'Select' }]
          // let dataObj = JSON.parse(data['token']);
        //

    for (var i = 0; i < data.length; i++) {
    // logik to create new items

    results.push({
        "id": data[i].id,
        "text": data[i].priority_name
    });
    if(data[i].priority_name=='Low'){
      this.taskPriority=data[i].id;
    }
    }



    this.taskPriorData =results;
    this.ejstaskPriorData =results;
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
  public  GetAllProjectStatus(){
    this.taskService.GetStatusByOrgID().subscribe(

      (data:any) => {

    var results=[{ id: '', text: 'Select an option' }]
        // let dataObj = JSON.parse(data['token']);
      //

  for (var i = 0; i < data.length; i++) {
  // logik to create new items

  results.push({
      "id": data[i].id,
      "text": data[i].status_name
  });

  }


  this.projStatusData =results;
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


    public  getEmployeeByOrgId(){
      let user_info:object;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));

}
      this.empService.getEmployeeByOrgId().subscribe(

        (data:any) => {
          var results=[{ id: user_info['id'], text: 'Me' }]

          // let dataObj = JSON.parse(data['token']);
        //

    for (var i = 0; i < data.length; i++) {
    // logik to create new items
    if(data[i].id!=user_info['id']){

    results.push({
        "id": data[i].id,
        "text": data[i].first_name
    });

    }
  }
  results.splice(data.length+1, 0,{ id: 'Anyone', text: 'Anyone'})

    this.assigneeData =results;
    this.ejsassigneeData =results;
    this.showAssigneeLead=false;
  this.showAssigneeApprove=false;
  if(this.editable==false){
    this.leadValue=user_info['id'];
    this.assigneeStatus=[user_info['id']];
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
    public changedActTask(e){
      this.activListValue=e.value;
      this.GetAllTaskByActivityID(e.value)
    }
    public changedCheckinTask(e: any): void {
        //this.projTaskDataValue=e.value;
        console.log('e',e.value)
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


      }else{

        this.recentActTaskSel=true;

    this.taskSel=true;

        this.projTaskDataValue='';
        this.activityDataText='';

      }



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
    GetAllTaskByActivityID(id){
      let postData={
        id:id
      }
      this.projectService.GetAllTaskByActivityID(postData).subscribe(

        (data:any) => {
    if(data!=null  && data.length!=0){
      var results=[]
          // let dataObj = JSON.parse(data['token']);
        //

    for (var i = 0; i < data.length; i++) {
    // logik to create new items

    results.push({
        "value": data[i].id,
        "display": data[i].task_name
    });

    }


    this.taskListByAct =results;
        // this.router.navigate(["/organizations"]);
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
    tagAdded(e){
      console.log('tagAdded',e);
    }
    contactEdit(id){
      this.openContactModal('layout')
      this.FindByEntityContactID(id)
      this.contactEditId=id
      this.contactEditable=true;
      if( this.contactEditable == true) {
        this.customerContactForm.get('fname').disable()
        this.customerContactForm.get('lname').disable()
      this.disableSaveBranch=false;

      }
      //console.log('customerContactValid',this.customerContactForm.get('fname').status,this.customerContactForm.get('lname').status,this.customerContactForm.get('email').status)



      // $("#contact_modal").modal('show');


    }
    FindByEntityContactID(id){
      let data={
        "id": id,


      };

      this.projectService.FindByEntityContactID(data).subscribe(
        (data:any)  => {
        if(data){
        this.customerContactForm.patchValue({
          fname:data.first_name,
          lname:data.last_name,
          mobile:data.phone,
          email:data.email,
          note:data.note,
        })
        if(data.phone_iso_name!=null){
          this.selectedISO=data.phone_iso_name

        }
      console.log('customerContactValid',this.customerContactForm.get('fname').status,this.customerContactForm.get('lname').status,this.customerContactForm.get('email').status)
       this.disableSaveBranch=false;
this.is_cont_primary=data.is_primary
        if(data.relationship=='Owner'){
        this.cstRelationValue='1'
        }else if(data.relationship=='Consultant'){
        this.cstRelationValue='2'

        }else if(data.relationship=='Personal Advisor'){
        this.cstRelationValue='3'

        }else if(data.relationship=='Office Manager'){
        this.cstRelationValue='4'

        }else{
        this.cstRelationValue=''

        }



        }else{

          this.spinner.hide();

          Swal.fire(
            'Error!',
            data['result'].desc,
            'error'
          ).then(
            (result)=> {

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

    showSubtask(){
      this.showSubtaskText=true;
      // console.log('taskName',this.taskLogForm.get('taskName').value[0]['value']);

      // if(this.taskLogForm.get('taskName').value[0]['value']!=''){
      //   // this.GetAllSubTaskByTaskID(this.taskLogForm.get('taskName').value[0]['value'] )

      // }
    }
    showMultiSubtask(i){
      // this.showMultiSubtaskText=true;
      // console.log('showMultiSubtask')

      const emails = this.emailForm.get('emails') as FormArray
   emails.at(i).patchValue({ showSubTask: true})


      // console.log('taskName',this.taskLogForm.get('taskName').value[0]['value']);

      // if(this.taskLogForm.get('taskName').value[0]['value']!=''){
      //   // this.GetAllSubTaskByTaskID(this.taskLogForm.get('taskName').value[0]['value'] )

      // }
    }
    public onAddProjActivity(){

        let sendData = {
        entity_id: localStorage.getItem('project_id'),
        event_type: "Project milestone added",
        event_desc: "Project milestone added successfully",
       };
       this.histSer.AddEntityHistoryLog(sendData).subscribe((data)=> {
        console.log(data)
        if(data){
          this.getLeadHistory(localStorage.getItem('project_id'));
        }
        });



      this.addformSubmitted=true;
      let postData={

        project_id: localStorage.getItem('project_id'),

        activity_name: this.activityLogForm.get('activName').value  ,
        activity_desc: this.activityLogForm.get('remarks').value,
        unit: null,
        qty: null,

        start_date:moment(this.startdateValue).format('L') ,
        end_date: moment(this.enddateValue).format('L'),
        is_approve_req:this.showApprover,
        approved_id:(this.showApprover?this.approverValue:null),
        // status_id: "a96a57b9-0ad0-4460-8bff-c421af3c5cd3",




      }
      if(this.activityLogForm.get('startDate').value!='' &&
       this.activityLogForm.get('endDate').value!='' &&
       this.activityLogForm.get('activName').value!=''
      && this.showApprover?this.approverValue!='':true ){
        this.spinner.show();
        if(this.templateAdd){
          let data={
            "id": null,
            "template_name": this.activityLogForm.get('templateName').value,
            "milestone_name":this.activityLogForm.get('activName').value ,
            "milestone_desc": this.activityLogForm.get('remarks').value,
            "start_date": moment(this.startdateValue).format('L'),
            "end_date": moment(this.enddateValue).format('L'),

            is_approve_req:this.showApprover,
            approve_emp_id:(this.showApprover?this.approverValue:null),

          };

          this.projectService.AddMilestoneTemplate(data).subscribe(
            (data:any)  => {
            if(data.status==200){

 $('#milestoneTemp').prop('checked',false);
this.templateAdd=false

              this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
           });



            }else{

              this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result)=> {

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
      return this.projectService.AddProjectActivity(postData).subscribe(
        (data:any)  => {
          // let dataObj = JSON.parse(data['token']);

        if(data.status==200){
           this.activityLogForm.reset();
           this.GetProjectActivityByProjectID();
           this.FindAllProjectActivityByProjectID();
          this.spinner.hide();
          $("#activity_log_modal").modal('hide');
          this.addformSubmitted=false;
          this.approveChecked=null;
          this.milestoneTempValue='';
          this.toastr.success(data['desc'], undefined,{
            positionClass: 'toast-top-center'
       });

        }else{

          this.spinner.hide();

          Swal.fire(
            'Error!',
            data['result'].desc,
            'error'
          ).then(
            (result)=> {

            })



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
    public onEditProjActivity(){
     this.editformSubmitted=true;
      let postData={
        id:this.editActivityId,
        project_id: localStorage.getItem('project_id'),

        activity_name: this.activityLogForm.get('activName').value  ,
        activity_desc: this.activityLogForm.get('remarks').value,
        unit: null,
        qty: null,

        start_date:moment(this.startdateValue).format('L') ,
        end_date: moment(this.enddateValue).format('L'),
        is_approve_req:this.showApprover,
        approved_id:this.approverValue,
         status_id: this.projStatusValue,




      }
      if(this.activityLogForm.get('startDate').value!='' && this.activityLogForm.get('endDate').value!='' && this.activityLogForm.get('activName').value!='' && this.showApprover?this.approverValue!='':true ){
        this.spinner.show();

      return this.projectService.UpdateProjectActivity(postData).subscribe(
        (data:any)  => {
          // let dataObj = JSON.parse(data['token']);

        if(data.status==200){
          //  this.activityLogForm.reset();
           this.resetActivityForm();

           this.FindAllProjectActivityByProjectID();
this.GetProjectActivityRatioByProjectID();
          // $("#activity_log_modal").modal('hide');
          this.spinner.hide();

          this.toastr.success(data['desc'], undefined,{
            positionClass: 'toast-top-center'
       });

       if(data){
        let postData = {
        entity_id: localStorage.getItem('project_id'),
        event_type: "Project milestone updated",
        event_desc: "Project milestone updated successfully",
       };
       this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
            console.log('History Added',data)
        });
       }

        }else{
          this.toastr.error(data['desc'], undefined,{
            positionClass: 'toast-top-center'
       });
          this.spinner.hide();

          Swal.fire(
            'Error!',
            data['result'].desc,
            'error'
          ).then(
            (result)=> {

            })



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
    projSiteRowSelected(e){
      this.GetAllProjectRemarksByGroupID(e.data.groupid);

    }
    projActRowSelected(e){
      this.GetAccomplishedTaskByActivityID(e.data.id);

    }
    public goBack(){
      window.history.go(-1);
    }
public FindByProjectID(){
//   this.AddNewSubmit=false;
//   this.editable=true;
// this.editTaskId=dept_id;
// this.showTaskList=false;
// this.showAddForm=true;
this.spinner.show();
  let postData={
    id:localStorage.getItem('project_id')
  }
 this.projectId=localStorage.getItem('project_id');

  this.projectService.FindByProjectID(postData).subscribe(
    (data:any)  => {

    this.GetProjectActivityRatioByProjectID();
    this.GetProjectActivityTaskRatioByProjectID();
    this.spinner.hide();

    this.projectName=data.project_name;
    this.projectPrefix=data.project_prefix;
    this.selectedValue=data.project_name;
this.estimation_id=data.est_id;
this.callCostProj(this.estimation_id);

    this.project_start_date=data.start_date;
    this.project_end_date=data.end_date;
    this.project_desc=data.project_desc;
    this.modifiedProject=data.is_modified;
    this.project_status_name=data.project_status_name;
    this.dateRangeForm.patchValue({
      daterangeAtt:[new Date(moment(this.project_start_date).format('L')), new Date(moment(this.today).format('L'))],
     })
    if(data.is_modification==true){
      this.disableModify=true
      this.projectModifyTxt='Project already in modification stage'
    }else{
      this.disableModify=false
      this.projectModifyTxt='Project modification'


    }
if(data.entityLocation!=null){
  this.editableLoc=true;
  if(data.entityLocation.lat!="" && data.entityLocation.lang!="" ){

    //  this.searchElementRef.nativeElement.value=data.entityLocation.formatted_address;
    this.nearbyAddress=data.entityLocation.formatted_address;
    this.latitude=parseFloat(data.entityLocation.lat);
    this.longitude=parseFloat(data.entityLocation.lang);
  // this.address=data.entityLocation.formatted_address;
  this.changed_street_number=data.entityLocation.street_number;
  this.changed_route=data.entityLocation.route;
  this.changed_locality=data.entityLocation.locality;
  this.changed_administrative_area_level_2=data.entityLocation.changed_administrative_area_level_2;
  this.changed_administrative_area_level_1=data.entityLocation.changed_administrative_area_level_1;
  this.changed_country=data.entityLocation.changed_country;

  this.mapsAPILoader.load().then(() => {
    //this.nearByPlaces();
   this.geoCoder = new google.maps.Geocoder;

    this.setPredefinedLocation(this.latitude,this.longitude);
  })

}


}
else{
  this.editableLoc=false;

}
if(data.projectAttribute!=null){
  this.projectAttribute=data.projectAttribute;
}
if(data.entityCustomer!=null){
  this.GetAllCustomer();

  this.editCustomer=true;
  this.customerId=data.entityCustomer.id;
  this.callCstId=data.entityCustomer.id;
  this.customerVal=data.entityCustomer.id;
  this.cstName=data.entityCustomer.cst_name;
  this.city=data.entityCustomer.city;
  this.country=data.entityCustomer.country;
  this.email=data.entityContact.email;
  this.phoneNo=data.entityContact.phone;
  this.primaryName=data.entityContact.name;
}else{
  this.editCustomer=false;
  this.email='';
  this.phoneNo='';
  this.primaryName='';
  this.cstName='';


}

    this.getContactList('')
      // this.projectForm.patchValue({

      //   project_name: data.project_name,
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
ProductivityProgressByProjectID(){

  this.spinner.show();
    let postData={
      id:localStorage.getItem('project_id')
    }

    this.projectService.ProductivityProgressByProjectID(postData).subscribe(
      (data:any)  => {
        let hrsData=[];
        if(data){
          for(var i=0;i<data.length;i++){
            hrsData.push({
    "x": data[i]['sub_task_name'],
    "y": data[i]['progress_percent'],
  // "market1": 71,
  // "market2": 75,
  "hrs1": data[i]['budget_hours'],
  "hrs2":data[i]['worked_hours'],

  "task_name":data[i]['task_name'],
  "activity_name":data[i]['activity_name'],
  "sub_task_name":data[i]['sub_task_name'],
  "labour_count":data[i]['labour_count']!=null?data[i]['labour_count']:0,

            })
          }
        }
        // budegetdHrschart.data=[{
        //     "date": "2013-01-16",
        //     "market1": 71,
        //     "market2": 75,
        //     "sales1": 5.3,
        //     "sales2":6.8
        //   }, {
        //     "date": "2013-01-17",
        //     "market1": 74,
        //     "market2": 78,
        //     "sales1": 4,
        //     "sales2": 6
        //   }, {
        //     "date": "2013-01-18",
        //     "market1": 78,
        //     "market2": 88,
        //     "sales1": 5,
        //     "sales2": 2
        //   }, {
        //     "date": "2013-01-19",
        //     "market1": 85,
        //     "market2": 89,
        //     "sales1": 8,
        //     "sales2": 9
        //   }, {
        //     "date": "2013-01-20",
        //     "market1": 82,
        //     "market2": 89,
        //     "sales1": 9,
        //     "sales2": 6
        //   }, {
        //     "date": "2013-01-21",
        //     "market1": 83,
        //     "market2": 85,
        //     "sales1": 3,
        //     "sales2": 5
        //   }, {
        //     "date": "2013-01-22",
        //     "market1": 88,
        //     "market2": 92,
        //     "sales1": 5,
        //     "sales2": 7
        //   }, {
        //     "date": "2013-01-23",
        //     "market1": 85,
        //     "market2": 90,
        //     "sales1": 7,
        //     "sales2": 6
        //   }, {
        //     "date": "2013-01-24",
        //     "market1": 85,
        //     "market2": 91,
        //     "sales1": 9,
        //     "sales2": 5
        //   }, {
        //     "date": "2013-01-25",
        //     "market1": 80,
        //     "market2": 84,
        //     "sales1": 5,
        //     "sales2": 8
        //   }, {
        //     "date": "2013-01-26",
        //     "market1": 87,
        //     "market2": 92,
        //     "sales1": 4,
        //     "sales2": 8
        //   }, {
        //     "date": "2013-01-27",
        //     "market1": 84,
        //     "market2": 87,
        //     "sales1": 3,
        //     "sales2": 4
        //   }, {
        //     "date": "2013-01-28",
        //     "market1": 83,
        //     "market2": 88,
        //     "sales1": 5,
        //     "sales2": 7
        //   }, {
        //     "date": "2013-01-29",
        //     "market1": 84,
        //     "market2": 87,
        //     "sales1": 5,
        //     "sales2": 8
        //   }, {
        //     "date": "2013-01-30",
        //     "market1": 81,
        //     "market2": 85,
        //     "sales1": 4,
        //     "sales2": 7
        //   }]
        budegetdHrschart.data=hrsData;
console.log('budegetdHrschartData',budegetdHrschart.data)


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
  ProductivityTaskProgressByProjectID(){

    this.spinner.show();
      let postData={
        id:localStorage.getItem('project_id')
      }

      this.projectService.ProductivityTaskProgressByProjectID(postData).subscribe(
        (data:any)  => {
          let hrsData=[];
          if(data){
            for(var i=0;i<data.length;i++){
              hrsData.push({
      "x": data[i]['sub_task_name'],
    // "market1": 71,
    // "market2": 75,
    "y":data[i]['progress_percent'],
    "hrs1": data[i]['budget_hours'],
    "hrs2":data[i]['worked_hours'],
    "task_name":data[i]['task_name'],
    "activity_name":data[i]['activity_name'],
    "sub_task_name":data[i]['sub_task_name'],
    "labour_count":data[i]['labour_count']!=null?data[i]['labour_count']:0,


              })
            }
          }
          // budegetdHrschart.data=[{
          //     "date": "2013-01-16",
          //     "market1": 71,
          //     "market2": 75,
          //     "sales1": 5.3,
          //     "sales2":6.8
          //   }, {
          //     "date": "2013-01-17",
          //     "market1": 74,
          //     "market2": 78,
          //     "sales1": 4,
          //     "sales2": 6
          //   }, {
          //     "date": "2013-01-18",
          //     "market1": 78,
          //     "market2": 88,
          //     "sales1": 5,
          //     "sales2": 2
          //   }, {
          //     "date": "2013-01-19",
          //     "market1": 85,
          //     "market2": 89,
          //     "sales1": 8,
          //     "sales2": 9
          //   }, {
          //     "date": "2013-01-20",
          //     "market1": 82,
          //     "market2": 89,
          //     "sales1": 9,
          //     "sales2": 6
          //   }, {
          //     "date": "2013-01-21",
          //     "market1": 83,
          //     "market2": 85,
          //     "sales1": 3,
          //     "sales2": 5
          //   }, {
          //     "date": "2013-01-22",
          //     "market1": 88,
          //     "market2": 92,
          //     "sales1": 5,
          //     "sales2": 7
          //   }, {
          //     "date": "2013-01-23",
          //     "market1": 85,
          //     "market2": 90,
          //     "sales1": 7,
          //     "sales2": 6
          //   }, {
          //     "date": "2013-01-24",
          //     "market1": 85,
          //     "market2": 91,
          //     "sales1": 9,
          //     "sales2": 5
          //   }, {
          //     "date": "2013-01-25",
          //     "market1": 80,
          //     "market2": 84,
          //     "sales1": 5,
          //     "sales2": 8
          //   }, {
          //     "date": "2013-01-26",
          //     "market1": 87,
          //     "market2": 92,
          //     "sales1": 4,
          //     "sales2": 8
          //   }, {
          //     "date": "2013-01-27",
          //     "market1": 84,
          //     "market2": 87,
          //     "sales1": 3,
          //     "sales2": 4
          //   }, {
          //     "date": "2013-01-28",
          //     "market1": 83,
          //     "market2": 88,
          //     "sales1": 5,
          //     "sales2": 7
          //   }, {
          //     "date": "2013-01-29",
          //     "market1": 84,
          //     "market2": 87,
          //     "sales1": 5,
          //     "sales2": 8
          //   }, {
          //     "date": "2013-01-30",
          //     "market1": 81,
          //     "market2": 85,
          //     "sales1": 4,
          //     "sales2": 7
          //   }]
          budegetdHrschart.data=hrsData;
  // console.log('budegetdHrschartData',budegetdHrschart.data)


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

ProjectPropertyByProjectID(){
  //   this.AddNewSubmit=false;
  //   this.editable=true;
  // this.editTaskId=dept_id;
  // this.showTaskList=false;
  // this.showAddForm=true;
  this.spinner.show();
    let postData={
      id:localStorage.getItem('project_id')
    }


    this.projectService.ProjectPropertyByProjectID(postData).subscribe(
      (data:any)  => {
         this.projectProperty=data;


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
private setPredefinedLocation(lat,lang) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = lat;
      this.longitude = lang;
      this.zoom = 8;

      this.getAddress(lat,lang);

    });
  }
}

 createFormGroup(data: IOrderModel): FormGroup {
        return new FormGroup({
            OrderID: new FormControl(data.OrderID, Validators.required),
            OrderDate: new FormControl(data.OrderDate, this.dateValidator()),
            // CustomerName: new FormControl(data.CustomerName, Validators.required),
            Freight: new FormControl(data.Freight),
            ShipAddress: new FormControl(data.ShipAddress),
            ShipCity: new FormControl(data.ShipCity),
            ShipCountry: new FormControl(data.ShipCountry),
            TaskTemplate: new FormControl(data.TaskTemplate),
            MilestoneName:new FormControl(data.MilestoneName),
            Priority:new FormControl(data.Priority),
            Assignee:new FormControl(data.Assignee),
            Lead:new FormControl(data.Lead),
            Approver:new FormControl(data.Lead),
            TemplateName:new FormControl(data.TemplateName),

        });
    }

    dateValidator() {
        return (control: FormControl): null | Object  => {
            return control.value && control.value.getFullYear &&
            (1900 <= control.value.getFullYear() && control.value.getFullYear() <=  2099) ? null : { OrderDate: { value : control.value}};
        }
    }

    actionBegin(args: SaveEventArgs): void {
      // $('#ta')
  $("#task_log_modal").modal('hide');

        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            this.submitClicked = false;
            this.orderForm = this.createFormGroup(args.rowData);
            if(args.rowData['Approver']!=null && args.requestType === 'beginEdit'){
this.approveChecked=true
            }else{
this.approveChecked=false

            }
        }
        if (args.requestType === 'save') {
            this.submitClicked = true;
  $("#task_log_modal").modal('show');

            if (this.orderForm.valid) {
                args.data = this.orderForm.value;

            } else {
                args.cancel = true;
            }
        }


    }

    actionComplete(args: DialogEditEventArgs): void {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            if (Browser.isDevice) {
                args.dialog.height = window.innerHeight - 90 + 'px';
                args.dialog.zIndex = 2000;
                (<Dialog>args.dialog).dataBind();
            }
            // Set initail Focus
            if (args.requestType === 'beginEdit') {
                (args.form.elements.namedItem('ShipAddress') as HTMLInputElement).focus();

            } else if (args.requestType === 'add') {
                (args.form.elements.namedItem('OrderID') as HTMLInputElement).focus();
            }
        }
    }

  //   get OrderID(): AbstractControl  { return this.orderForm.get('OrderID'); }
     get Assignee(): AbstractControl { return this.orderForm.get('Assignee'); }
    // get Controls(): AbstractControl { return this.emailForm.get('emails'); }

    get OrderDate(): AbstractControl { return this.orderForm.get('OrderDate'); }
    get TaskTemplate(): AbstractControl { return this.orderForm.get('TaskTemplate'); }
    get MilestoneName(): AbstractControl { return this.orderForm.get('MilestoneName'); }
    get Priority(): AbstractControl { return this.orderForm.get('Priority'); }
    get Lead(): AbstractControl { return this.orderForm.get('Lead'); }
    get Approver(): AbstractControl { return this.orderForm.get('Approver');
  }

    public changedEjsAssignee(e): void {
      let user_info:object;
      if(localStorage.getItem('user_info')){
          user_info= JSON.parse(localStorage.getItem('user_info'));

      }

       let pred:Predicate;

      if(this.countryObj.value)
      if(this.countryObj.value.length==1){
        if(this.countryObj.value[0]==user_info['id']){
          this.showAssigneeApprove=false;
        }else{
          this.showAssigneeApprove=true;

        }
        this.showAssigneeLead=false;

      }else{
        this.showAssigneeLead=true;
        this.showAssigneeApprove=true;



      }




    }
    public changedEjsMilest(e): void {
      this.GetAllTaskByActivityID(e.value);

    }
    public addEmailFormGroup() {
      const emails = this.emailForm.get('emails') as FormArray


      this.showAssigneeApprove=false;
      this.showAssigneeLead=false;
      this.showApprover=false;
      this.submitClicked=true;
      this.taskListByAct=[];
      this.showMultiSubtaskText=false;

      if(this.emailForm.get('emails').status=='VALID'){
        emails.push(this.createEmailFormGroup())
      this.submitClicked=false;


      }
      console.log('addEmailFormGroup',emails.value);
    }

    public removeOrClearEmail(i: number) {
      const emails = this.emailForm.get('emails') as FormArray
      if (emails.length > 1) {
        emails.removeAt(i)
      } else {
        emails.reset()
      }
    }
    tagInputAdded(e,i){

      const emails = this.emailForm.get('emails') as FormArray
   console.log('tagInputAdded',emails.value[i].OrderID[0].value);
      const array =  this.taskListByAct;
      if(array.some(code => code.value === (emails.value[i]!=''&& emails.value[i]!=null && emails.value[i].OrderID[0].value))){
      // this.multiArrayContains=true;
   emails.at(i).patchValue({ isMultiTask: true,'taskId':emails.value[i].OrderID[0].value})

      }else{
      // this.multiArrayContains=false;
   emails.at(i).patchValue({ isMultiTask: false,'taskId':null})


      }


  }

    private createEmailFormGroup(): FormGroup {
      return new FormGroup({
        // 'emailAddress': new FormControl('', Validators.email),
        // 'emailLabel': new FormControl(''),
        'OrderID': new FormControl('',Validators.required),
        'Priority': new FormControl('',Validators.required),
        'SubtaskName': new FormControl(''),
        'taskId': new FormControl(''),
        'taskDesc': new FormControl(''),
        'isMultiTask':new FormControl(''),
        'showSubTask':new FormControl(''),
        'DueDate': new FormControl('',Validators.required),
        'Assignee': new FormControl('',Validators.required),
        'MilestoneName':new FormControl('',Validators.required),
        'Lead':new FormControl(''),
        'Approver':new FormControl(''),
        'ApproverCheck':new FormControl('')


      })


    }
    addProjTask(){
      $("#proj_task_log_modal").modal('show');
    }
    OnProjTaskClose(){
      $("#proj_task_log_modal").modal('hide');
      this.projTaskCloseBtn.nativeElement.click();
   }

    public GetAllTaskByEmpID(){

    }
    getParentApi(): ParentComponentApi  {
      return {
        callParentMethod: () => {
          this.OnProjTaskClose(),
          // this.GetAllTaskByEmpID()
          this.GetAllOpenActivitiesEntityID(),
          this.GetAllCloseActivitiesEntityID()
        }
      }
    }
    public  getAllEmployeeList(id){
      var contactList=[]
      var employeeList=[]


      this.empService.getEmployeeByOrgId().subscribe(

        (data:any) => {
          var results=[{ id: '', text: 'Select' }]

          // let dataObj = JSON.parse(data['token']);
        //
        let user_info= JSON.parse(localStorage.getItem('user_info'));


          for (var i = 0; i < data.length; i++) {
            // logik to create new items
        // if(user_info['id']!=data[i].id){

            results.push({
                "id": data[i].id,
                "text": data[i].first_name
            });
            if(user_info['id']!=data[i].id){

              employeeList.push({
                "id": data[i].id,
                "text": data[i].first_name,
                "category":'Employee'
            });
          }
         if(user_info['id']==data[i].id){

            this.empVal=data[i].id
             }
        }

       this.empData=results
       let entityId={
        entityID:localStorage.getItem('project_id'),
        // cstID:localStorage.getItem('project_id')
        cstID:this.callCstId
      }
       this.quotationService.GetAllEntityContactByEntityIDAndCstID(entityId).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);


          var results = [{ id: '  ', text: 'Select' }]

          // let dataObj = JSON.parse(data['token']);
          //

          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            contactList.push({
              "id": data[i].id,
              "text": data[i].name,
              "category":'Contact'
            });

          }

          this.showBranchList=true;

          this.branchDataSource=data;
          for(var i=0;i<data.length;i++){
            if(data[i]['is_primary']==true){
              this.primaryContact=data[i]
            }
          }

          // this.entityContactData = results;
          this.empGroup=employeeList.concat(contactList)
          if(id!=''){
            this.meetingForm.patchValue({
              participantId:[id]
            })
          }


        },
        error => {
          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(
            //used Arrow function here
            (result) => {

              //  this.router.navigate(['/dashboard']);
            })


        }

      )


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
    changedEmp(e){
      this.empVal=e.value;
    }
    changedCallPurpose(e){
      this.purposeVal=e.value;
      if(e.value!=''){
        this.purposeValTxt=e.data[0].text
      }
    }
    changedCallRes(e){
      this.callresVal=e.value;
      if(e.value!=''){
        this.callresValTxt=e.data[0].text
      }
    }
    public onAddMeeting() {

      let user;
      this.meetingFormSubmit=true;
      if (localStorage.getItem('user_info')) {
        user = JSON.parse(localStorage.getItem('user_info'));

      }
      if(this.meetingForm.get('startTime').value){
        let startTime=this.meetingForm.get('startTime').value;
        let endTime=this.meetingForm.get('endTime').value;
      let date=moment().format('MM/DD/YYYY');
      this.startmeetTime=date.concat(' ' +startTime) ;
      this.endmeetTime=date.concat(' ' +endTime) ;

      }



      let postData = {

        "id": null,
        "entity_id": localStorage.getItem('project_id'),
        "meeting_name": this.meetingForm.get('meeeting_Name').value,
        "location": this.meetingForm.get('meeeting_loc').value,
        "desc": this.meetingForm.get('desc').value,
        "start_time": this.startmeetTime,
        "end_time": this.endmeetTime,
        "host": this.empVal,
        "participant_id": this.meetingForm.get('participantId').value,


      }




      if (this.meetingForm.status=='VALID' ) {
        this.spinner.show();

        return this.quotationService.AddEntityMeeting(postData).subscribe(
          (data: any) => {

             if (data.status == 200) {
              this.spinner.hide();

              $('#meeting_modal').modal('hide');
              this.meetCloseBtn.nativeElement.click();
     this.GetAllOpenActivitiesEntityID();
     this.GetAllCloseActivitiesEntityID();
this.meetingForm.reset();
     this.meetingForm.patchValue({
      startTime:moment().format("hh:mm a")
    });
    this.toastr.success(data['desc'], undefined, {
            positionClass: 'toast-top-center'
          });

          if(data){
            let postData = {
            entity_id: localStorage.getItem('project_id'),
            event_type: "Project added meeting",
            event_desc: "Project added meeting successfully",
           };
           this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
            console.log(data)
            if(data){
              this.getLeadHistory(localStorage.getItem('project_id'));
            }
            });
           }


            }else if (data.status == 205) {
              this.spinner.hide();
              this.toastr.error(data['desc'], undefined, {
                positionClass: 'toast-top-center'
              });
              $('#meeting_modal').modal('hide');
              this.meetCloseBtn.nativeElement.click();


            }
             else {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result) => {
                })
            }
          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              (result) => {

              })


          }

        )

      }








    }


    openAttachModal(){
      $('#attachment_modal').modal('show');

    }
    closeAttachModal(){
      $('#attachment_modal').modal('hide');

    }
    public onUpdateMeeting() {

      let user;
      this.meetingFormSubmit=true;
      if (localStorage.getItem('user_info')) {
        user = JSON.parse(localStorage.getItem('user_info'));

      }
      if(this.meetingForm.get('startTime').value){
        let startTime=this.meetingForm.get('startTime').value;
        let endTime=this.meetingForm.get('endTime').value;
      let date=moment().format('MM/DD/YYYY');
      this.startmeetTime=date.concat(' ' +startTime) ;
      this.endmeetTime=date.concat(' ' +endTime) ;

      }



      let postData = {

        "id": this.editMeetId,
        "entity_id": localStorage.getItem('project_id'),
        "meeting_name": this.meetingForm.get('meeeting_Name').value,
        "location": this.meetingForm.get('meeeting_loc').value,
        "desc": this.meetingForm.get('desc').value,
        "start_time": this.startmeetTime,
        "end_time": this.endmeetTime,
        "host": this.empVal,
        "participant_id": this.meetingForm.get('participantId').value,


      }




      if (this.meetingForm.status=='VALID' ) {
        this.spinner.show();

        return this.quotationService.AddEntityMeeting(postData).subscribe(
          (data: any) => {

             if (data.status == 200) {
              this.spinner.hide();

              $('#meeting_modal').modal('hide');
              this.meetCloseBtn.nativeElement.click();

     this.GetAllOpenActivitiesEntityID();
     this.GetAllCloseActivitiesEntityID();

     this.meetingForm.patchValue({
      startTime:moment().format("hh:mm a")
    });

    this.toastr.success(data['desc'], undefined, {
      positionClass: 'toast-top-center'
    });

    if(data){
      let postData = {
      entity_id: localStorage.getItem('project_id'),
      event_type: "Project updated meeting",
      event_desc: "Project updated meeting successfully",
     };
     this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
      console.log(data)
      if(data){
        this.getLeadHistory(localStorage.getItem('project_id'));
      }
      });
     }

            }
             else {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result) => {
                })
            }
          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              (result) => {

              })


          }

        )

      }








    }
    public addNotes() {



      let postData = {

        "id": null,
        "entity_id": localStorage.getItem('project_id'),
        "notes": this.notesForm.get('notes').value,
        "title": this.notesForm.get('title').value,

      }




      if (this.notesForm.status=='VALID' ) {
        this.spinner.show();

        return this.quotationService.AddEntityNotes(postData).subscribe(
          (data: any) => {

             if (data.status == 200) {
              this.spinner.hide();
              this.notesForm.reset();
              this.showTextArea4=false;
              this.FetchEntityNotesEntityID();
              this.toastr.success(data['desc'], undefined, {
                positionClass: 'toast-top-center'
              });

              if(data){
                let postData = {
                entity_id: localStorage.getItem('project_id'),
                event_type: "Project added notes",
                event_desc: "Project added notes successfully",
               };
               this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                console.log(data)
                if(data){
                  this.getLeadHistory(localStorage.getItem('project_id'));
                }
                });
               }

            }
             else {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result) => {
                })
            }
          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              (result) => {

              })


          }

        )

      }








    }
    public updateNotes() {



      let postData = {

        "id": this.editnotesId,
        "entity_id": localStorage.getItem('project_id'),
        "notes": this.notesForm.get('notes').value,
        "title": this.notesForm.get('title').value,


      }



      if (this.notesForm.status=='VALID' ) {
        this.spinner.show();

        return this.quotationService.UpdateEntityNotes(postData).subscribe(
          (data: any) => {

             if (data.status == 200) {
              this.spinner.hide();
              this.notesForm.reset();
              this.showTextArea4=false;
              this.notesEditable=false;
              this.FetchEntityNotesEntityID();

              if(data){
                let postData = {
                entity_id: localStorage.getItem('project_id'),
                event_type: "Project updated notes",
                event_desc: "Project updated notes successfully",
               };
               this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                    console.log(data)
                    if(data){
                        this.getLeadHistory(localStorage.getItem('project_id'));
                    }
                });
               }

            }
             else {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result) => {
                })
            }
          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              (result) => {

              })


          }

        )

      }








    }
    public notesDelete(id) {



      let postData = {

        "id": id,


      }



      if (true ) {
        this.spinner.show();

        return this.quotationService.RemoveEntityNotes(postData).subscribe(
          (data: any) => {

             if (data.status == 200) {
              this.spinner.hide();

              this.FetchEntityNotesEntityID();

            }
             else {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result) => {
                })
            }
          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              (result) => {

              })


          }

        )

      }








    }
    public onAddCall() {

      let user;
      this.callFormSubmit=true;
      if (localStorage.getItem('user_info')) {
        user = JSON.parse(localStorage.getItem('user_info'));

      }
      let callStartTime='';
      let callEndTime='';
      let scheduleTime='';
      let startTime=this.callForm.get('startTime').value;
      let endTime=this.callForm.get('endTime').value;
    let date=moment().format('MM/DD/YYYY');
    callStartTime=date.concat(' ' +startTime) ;
    callEndTime=date.concat(' ' +endTime) ;
      // if(this.callForm.get('callType').value=='completed' && this.callForm.get('startTime').value){
      //   let startTime=this.callForm.get('startTime').value;
      //   let endTime=this.callForm.get('endTime').value;
      // let date=moment().format('MM/DD/YYYY');
      // callStartTime=date.concat(' ' +startTime) ;
      // callEndTime=date.concat(' ' +endTime) ;

      // }
      // if(this.callForm.get('callType').value=='schedule' && this.callForm.get('scheduleTime').value){
      //   let startTime=this.callForm.get('scheduleTime').value;
      // let date=moment().format('MM/DD/YYYY');
      // callEndTime=date.concat(' ' +startTime) ;
      // callStartTime=moment(this.callForm.get('startDate').value).format('L')

      // }
      // if(this.callForm.get('callType').value=='current' ){

      // callEndTime=null ;
      // callStartTime=null

      // }



      let postData = {

        "id": null,
        "entity_id": localStorage.getItem('project_id'),
        "subject": this.callForm.get('subject').value,
        "contact_id":this.entityContactVal,
        "call_purpose": this.purposeValTxt,
        "is_current_call": true,
        "is_completed_call": false,
        "is_schedule_call": false,
        "start_time": callStartTime,
        "end_time": callEndTime,
        "call_desc": this.callForm.get('desc').value,
        "call_result": this.callresValTxt,
        // "host": this.callForm.get('callType').value=='schedule'?this.empVal:null

      }




      if (this.callForm.status=='VALID' && this.entityContactVal!='' ) {
        this.spinner.show();
        return this.quotationService.AddEntityCall(postData).subscribe(
          (data: any) => {

             if (data.status == 200) {
              this.spinner.hide();

              $('#call_modal').modal('hide');
     this.GetAllOpenActivitiesEntityID();
     this.GetAllCloseActivitiesEntityID();
this.callCloseBtn.nativeElement.click();
     this.callForm.reset();
     this.entityContactVal='';
     this.empVal='';
     this.purposeVal='';
     this.callresVal='';
     this.callForm.patchValue({
      callType:'current',
      startDate:moment().format('L'),
      startTime:null,
      endTime:null
    });
    this.toastr.success(data['desc'], undefined, {
        positionClass: 'toast-top-center'
      });

      if(data){
        let postData = {
        entity_id: localStorage.getItem('project_id'),
        event_type: "Project added call",
        event_desc: "Project added call successfully",
       };
       this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
        console.log(data)
        if(data){
          this.getLeadHistory(localStorage.getItem('project_id'));
        }
        });
       }

            }else if (data.status == 205) {
              this.spinner.hide();
              this.toastr.error(data['desc'], undefined, {
                positionClass: 'toast-top-center'
              });
              $('#call_modal').modal('hide');
this.callCloseBtn.nativeElement.click();


            }
             else {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result) => {
                })
            }
          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              (result) => {

              })


          }

        )

      }








    }
    public onUpdateCall() {

      let user;
      this.callFormSubmit=true;
      if (localStorage.getItem('user_info')) {
        user = JSON.parse(localStorage.getItem('user_info'));

      }
      let callStartTime='';
      let callEndTime='';
      let scheduleTime='';
      let startTime=this.callForm.get('startTime').value;
      let endTime=this.callForm.get('endTime').value;
    let date=moment().format('MM/DD/YYYY');
    callStartTime=date.concat(' ' +startTime) ;
    callEndTime=date.concat(' ' +endTime) ;
      // if(this.callForm.get('callType').value=='completed' && this.callForm.get('startTime').value){
      //   let startTime=this.callForm.get('startTime').value;
      //   let endTime=this.callForm.get('endTime').value;
      // let date=moment().format('MM/DD/YYYY');
      // callStartTime=date.concat(' ' +startTime) ;
      // callEndTime=date.concat(' ' +endTime) ;

      // }
      // if(this.callForm.get('callType').value=='schedule' && this.callForm.get('scheduleTime').value){
      //   let startTime=this.callForm.get('scheduleTime').value;
      // let date=moment().format('MM/DD/YYYY');
      // callEndTime=date.concat(' ' +startTime) ;
      // callStartTime=moment(this.callForm.get('startDate').value).format('L')

      // }
      // if(this.callForm.get('callType').value=='current' ){

      // callEndTime=null ;
      // callStartTime=null

      // }



      let postData = {

        "id": null,
        "entity_id": localStorage.getItem('project_id'),
        "subject": this.callForm.get('subject').value,
        "contact_id":this.entityContactVal,
        "call_purpose": this.purposeValTxt,
        "is_current_call": true,
        "is_completed_call": false,
        "is_schedule_call": false,
        "start_time": callStartTime,
        "end_time": callEndTime,
        "call_desc": this.callForm.get('desc').value,
        "call_result": this.callresValTxt,
        "host": this.callForm.get('callType').value=='schedule'?this.empVal:null

      }




      if (this.callForm.status=='VALID' ) {
        this.spinner.show();

        return this.quotationService.UpdateEntityCall(postData).subscribe(
          (data: any) => {

             if (data.status == 200) {
              this.spinner.hide();

              $('#call_modal').modal('hide');
     this.GetAllOpenActivitiesEntityID();
     this.GetAllCloseActivitiesEntityID();
     this.callCloseBtn.nativeElement.click();

     this.callForm.reset();
     this.entityContactVal='';
     this.empVal='';
     this.purposeVal='';
     this.callresVal='';
     this.callForm.patchValue({
      callType:'current',
      startDate:moment().format('L')
    });
    this.toastr.success(data['desc'], undefined, {
        positionClass: 'toast-top-center'
      });

      if(data){
        let postData = {
        entity_id: localStorage.getItem('project_id'),
        event_type: "Project updated call",
        event_desc: "Project updated call successfully",
       };
       this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
        console.log(data)
        if(data){
          this.getLeadHistory(localStorage.getItem('project_id'));
        }
        });
       }

            }
             else {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result) => {
                })
            }
          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              (result) => {

              })


          }

        )

      }








    }
    callMinsRadioChange() {
       let startTime=this.callForm.get('startTime').value;

          // if (this.projectForm.get('prefixVal').value == 'is_custom' ||this.conversionForm.get('prefixVal').value == 'is_custom' ) {
            if (this.callForm.get('no_mins').value == 5 ) {
            // let fromDate=moment(this.today).add(7, 'day').toDate();
              this.callForm.patchValue({
                endTime:moment(startTime, 'hh:mm a').add(5, 'minutes').format('hh:mm a')
              })

          } else if (this.callForm.get('no_mins').value == 10 ) {

            // let fromDate=moment(this.today).add(14, 'day').toDate();
            this.callForm.patchValue({
              endTime:moment(startTime, 'hh:mm a').add(10, 'minutes').format('hh:mm a')
            })
            // this.FindAutoProjectPrefixByOrgID();

          }else if (this.callForm.get('no_mins').value == 15 ) {

            this.callForm.patchValue({
              endTime:moment(startTime, 'hh:mm a').add(15, 'minutes').format('hh:mm a')
            })
            // this.FindAutoProjectPrefixByOrgID();

          }
        //  console.log('endTime',moment().format('YYYY-MM-DD'),(new Date(moment().format('YYYY-MM-DD')+' '+this.callForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+this.currentTime)))
          if((new Date(moment().format('YYYY-MM-DD')+' '+this.callForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+this.currentTime))){
            this.showValidTimeError=true;
          }else{
            this.showValidTimeError=false;

          }
            // this.FindAutoProjectPrefixByOrgID();


        }
        addCall(){
          $("#call_modal").modal('show');
          this.getAllEmployeeList('');
          this.FindByEntityContactOrgID();
          this.callForm.patchValue({

            startTime:"",
            endTime:""

          })
          this.callForm.get('endTime').enable();
          let startTime=this.callForm.get('startTime').value;
          this.minEndTime=startTime;

        }
        public callStartTimeChanged(){
          this.callForm.get('startTime').valueChanges.subscribe(() => {
            // fires when the input value has actually changed
            if(this.callForm.get('startTime').value!=''){
              this.startValChange=true;
            }
            let startTime=this.callForm.get('startTime').value;
            this.minEndTime=startTime;

            this.callForm.get('endTime').enable()
            this.callForm.patchValue({
              'no_mins':'',
              'endTime':""
            })
            this.showValidTimeError=false;


        });
        /**
         * name
         */




        }
    public meetDelete(id) {



      let postData = {

        "id": id,


      }



      if (true ) {
        this.spinner.show();

        return this.quotationService.RemoveEntityMeeting(postData).subscribe(
          (data: any) => {

             if (data.status == 200) {
              this.spinner.hide();

              this.GetAllOpenActivitiesEntityID();

            }
             else {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result) => {
                })
            }
          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              (result) => {

              })


          }

        )

      }








    }
    public FetchEntityNotesEntityID() {
      let postData={
        "id": localStorage.getItem('project_id')
      }
      this.quotationService.FetchEntityNotesEntityID(postData).subscribe(
        (data: any) => {

          // let dataObj = JSON.parse(data['token']);
          //
          if(data){
            let datas = new DataManager(data);
            this.notesData = datas.dataSource['json'];
          }




        },
        error => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result) => {

              //  this.router.navigate(['/dashboard']);
            })


        }

      )
    }

    public GetAllOpenActivitiesEntityID() {
      let postData={
        "id": localStorage.getItem('project_id')
      }
      this.quotationService.GetAllOpenActivitiesEntityID(postData).subscribe(
        (data: any) => {

          // let dataObj = JSON.parse(data['token']);
          //
          if(data){
            let datas = new DataManager(data);
            this.meetingData = datas.dataSource['json'];
            this.meetingToolbar = ['Search'];

          }




        },
        error => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result) => {

              //  this.router.navigate(['/dashboard']);
            })


        }

      )
    }
    GetAllCloseActivitiesEntityID() {
      let postData={
        "id": localStorage.getItem('project_id')
      }
      this.quotationService.GetAllCloseActivitiesEntityID(postData).subscribe(
        (data: any) => {

          // let dataObj = JSON.parse(data['token']);
          //
          if(data){
            let datas = new DataManager(data);
            this.closeData = datas.dataSource['json'];
            this.closeToolbar = ['Search'];

          }




        },
        error => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result) => {

              //  this.router.navigate(['/dashboard']);
            })


        }

      )
    }

    notesEdit(id){
      let postData={
        id:id
      }
      this.spinner.show();
     this.quotationService.FindByEntityNotesID(postData).subscribe(

       (data: any) => {

 if(data){
  this.showTextArea4=true;
  this.notesEditable=true;
  this.notesForm.patchValue({
    notes:data.notes,
    title:data.title,
  })
  this.editnotesId=id
  this.spinner.hide();

 //this.projectData=ds1.dataSource['json'];
 }
         let datas = new DataManager(data);
          this.projectData = datas.dataSource['json'];

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


         this.pageSettings = { pageSizes: true, pageCount: 5 }
         this.toolbar = ['Search', 'ExcelExport', 'PdfExport',];
         // this.router.navigate(["/organizations"]);

       },
       error => {
         Swal.fire(
           'Error!',
           error,
           'error'
         ).then(
           //used Arrow function here
           (result) => {

             //  this.router.navigate(['/dashboard']);
           })


       }

     )
    }
    meetEdit(id,type){
      if(type=="Meeting"){
        let postData={
          id:id
        }
       this.quotationService.FindByEntityMeetingID(postData).subscribe(

         (data: any) => {

   if(data){
    this.meetingEditable=true;
    this.getAllEmployeeList('');

  this.meetingForm.get('endTime').enable();

  $("#meeting_modal").modal('show');
    this.meetingForm.patchValue({
      meeeting_Name:data.meeting_name,
      meeeting_loc:data.location,
      startTime:moment(data.start_time).format("hh:mm a"),
      endTime:moment(data.end_time).format("hh:mm a"),
      desc:data.desc,
      participantId:data.participant_id

    })

    this.editMeetId=id
 setTimeout(()=>{
 this.empVal=data.host


 },1000)
   }

         },
         error => {
           Swal.fire(
             'Error!',
             error,
             'error'
           ).then(
             //used Arrow function here
             (result) => {

               //  this.router.navigate(['/dashboard']);
             })


         }

       )
      }
      else if(type=="Call"){
      this.FindByEntityContactOrgID();

        let postData={
          id:id
        }
       this.quotationService.FindByEntityCallID(postData).subscribe(

         (data: any) => {

   if(data){
    this.callEditable=true;
    this.getAllEmployeeList('');

this.entityContactVal=data.contact_id;



  $("#call_modal").modal('show');
    this.callForm.patchValue({
      subject:data.subject,



      desc:data.call_desc,

    })


    if(data.is_completed_call==true){
      this.callForm.patchValue({
        callType:'completed',
        showStartEndTime:true,
        showDateEndTime:false,
        startTime:moment(data.start_time).format("hh:mm a"),
        endTime:moment(data.end_time).format("hh:mm a"),

      })
      this.callForm.get('endTime').enable();
    }else if(data.is_current_call==true){
      this.callForm.patchValue({
        callType:'current',
        showStartEndTime:false,
          showDateEndTime:false,
          startTime:moment(data.start_time).format("hh:mm a"),
          endTime:moment(data.end_time).format("hh:mm a"),

      })
    }
    else if(data.is_schedule_call==true){
      this.callForm.patchValue({
        callType:'schedule',
        showStartEndTime:false,
        showDateEndTime:true,
        startDate:moment(data.start_time).format("hh:mm a"),
        scheduleTime:moment(data.end_time).format("hh:mm a"),

      })
      this.callForm.get('scheduleTime').enable();

    }

    this.editCallId=id
 setTimeout(()=>{
 this.empVal=data.host
 if(data.call_purpose=='None'){
  this.purposeVal='2'
}else if(data.call_purpose=='Administrative'){
  this.purposeVal='3'
}else if(data.call_purpose=='Negotiation'){
  this.purposeVal='4'
}
if(data.call_result=='None'){
  this.callresVal='2'
}else if(data.call_result=='Not Interested'){
  this.callresVal='4'
}else if(data.call_result=='Interested'){
  this.callresVal='3'
}

 },1000)
   }

         },
         error => {
           Swal.fire(
             'Error!',
             error,
             'error'
           ).then(
             //used Arrow function here
             (result) => {

               //  this.router.navigate(['/dashboard']);
             })


         }

       )
      }else{
        this.updateTask.taskEdit(id);
      }

   }

  addMeeting(){
    $("#meeting_modal").modal('show');
    this.getAllEmployeeList('');
    this.mode = 'CheckBox';
    // this.callForm.patchValue({

    //   startTime:moment().format('hh:mm a'),

    // })
    // this.callForm.get('endTime').enable();
    // let startTime=this.callForm.get('startTime').value;
    //this.minEndTime=moment().format('hh:mm a');



  }
  @ViewChild('notify',{static:true}) updateTask: NotificationComponent;


  // public FindByEntityContactOrgID() {
  //   // this.countryData = []
  //   // this.countryValue=''

  //   return this.quotationService.FindByEntityContactOrgID().subscribe(
  //     (data: any) => {
  //       // let dataObj = JSON.parse(data['token']);


  //       var results = [{ id: '  ', text: 'Select' }]

  //       // let dataObj = JSON.parse(data['token']);
  //       //

  //       for (var i = 0; i < data.length; i++) {
  //         // logik to create new items

  //         results.push({
  //           "id": data[i].id,
  //           "text": data[i].name
  //         });

  //       }


  //       this.entityContactData = results;

  //     },
  //     error => {
  //       Swal.fire(
  //         'Error!',
  //         'Error.',
  //         'error'
  //       ).then(
  //         //used Arrow function here
  //         (result) => {

  //           //  this.router.navigate(['/dashboard']);
  //         })


  //     }

  //   )
  // }
  OnMeetingModalClose(){
    $("#meeting_modal").modal('hide');
    this.meetCloseBtn.nativeElement.click();

    this.meetingForm.reset();
    this.empVal='';


  }
  OnCallModalClose(){
    $("#call_modal").modal('hide');
this.callCloseBtn.nativeElement.click();

    this.callForm.reset();
    this.contactVal='';
    this.entityContactVal='';

    this.empVal='';
    this.purposeVal='';
    this.callresVal='';
    this.callFormSubmit=false;

  }

  public startTimeChanged(){
    this.disableEndTime=false;

    this.meetingForm.get('startTime').valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      if(this.meetingForm.get('startTime').value!=''){
        this.startValChange=true;
      }
      let startTime=this.meetingForm.get('startTime').value;
      this.minEndTime=startTime;

      this.meetingForm.get('endTime').enable()


  });
  /**
   * name
   */




  }
  checkinStartTimeChanged(){
    this.disableEndTime=false;

    this.checkinLogForm.get('startTime').valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      if(this.checkinLogForm.get('startTime').value!=''){
        this.startValChange=true;
      }
      let startTime=this.checkinLogForm.get('startTime').value;
      this.minEndTime=startTime;

      this.checkinLogForm.get('endTime').enable()
      this.checkinLogForm.patchValue({'endTime':''})
      this.checkinLogForm.get('endTime').enable()


  });
  /**
   * name
   */




  }


  radioCahngeOne(value){
    let startTime=this.checkinLogForm.get('startTime').value;
    let CurrentTime = moment().format('hh:mm a');
    if(value === 15){
      this.checkinLogForm.patchValue({
        endTime:moment(startTime, 'hh:mm a').add(15, 'minutes').format('hh:mm a')
      });

      if((new Date(moment().format('YYYY-MM-DD')+' '+this.checkinLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
        this.checkinLogForm.patchValue({
          endTime:moment().format('hh:mm a')
        });
        this.errorTimeExcced = true;
      }else{
        this.errorTimeExcced = false;
      }

    }else if(value === 30){
      this.checkinLogForm.patchValue({
        endTime:moment(startTime, 'hh:mm a').add(30, 'minutes').format('hh:mm a')
      });

      if((new Date(moment().format('YYYY-MM-DD')+' '+this.checkinLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
        this.checkinLogForm.patchValue({
          endTime:moment().format('hh:mm a')
        });
        this.errorTimeExcced = true;
      }else{
        this.errorTimeExcced = false;
      }

    }else if(value === 60){
      this.checkinLogForm.patchValue({
        endTime:moment(startTime, 'hh:mm a').add(60, 'minutes').format('hh:mm a')
      });

      if((new Date(moment().format('YYYY-MM-DD')+' '+this.checkinLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
        this.checkinLogForm.patchValue({
          endTime:moment().format('hh:mm a')
        });
        this.errorTimeExcced = true;
      }else{
        this.errorTimeExcced = false;
      }

    }else if(value === 90){
      this.checkinLogForm.patchValue({
        endTime:moment(startTime, 'hh:mm a').add(90, 'minutes').format('hh:mm a')
      });

      if((new Date(moment().format('YYYY-MM-DD')+' '+this.checkinLogForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+CurrentTime))){
        this.checkinLogForm.patchValue({
          endTime:moment().format('hh:mm a')
        });
        this.errorTimeExcced = true;
      }else{
        this.errorTimeExcced = false;
      }

    }
  }

  callRadioChange() {
    // if (this.projectForm.get('prefixVal').value == 'is_custom' ||this.conversionForm.get('prefixVal').value == 'is_custom' ) {
      if (this.callForm.get('callType').value == 'current' ) {
      // let fromDate=moment(this.today).add(7, 'day').toDate();

        this.callForm.patchValue({
          showStartEndTime:false,
          showDateEndTime:false,

        })

    } else if (this.callForm.get('callType').value == 'completed' ) {

      // let fromDate=moment(this.today).add(14, 'day').toDate();
      this.callForm.patchValue({
        showStartEndTime:true,
        showDateEndTime:false,

      })
      // this.FindAutoProjectPrefixByOrgID();

    }else if (this.callForm.get('callType').value == 'schedule' ) {

      this.callForm.patchValue({
        showStartEndTime:false,
        showDateEndTime:true,

      })
      // this.FindAutoProjectPrefixByOrgID();

    }
      // this.FindAutoProjectPrefixByOrgID();


  }
  public actList = [
    {display: 'Meeting', value: 1},
    {display: 'Call', value: 2},
  ];
  changedEntityContact(e){
    this.entityContactVal=e.value
  }
  cancelText(){
    this.showTextArea4=false;
    this.notesEditable=false;
    this.notesForm.reset();
  }
  public customRadioChange(groupid,name,check_in,check_out){
     this.selectedGroupId=groupid;
     this.minStartTime=moment(check_in).format("hh:mm a");
     console.log('minStartTime',this.minStartTime);
     console.log('check_in',check_in,check_out);
    // this.checkinLogForm.patchValue({
    //   startTime:moment(check_in).format("hh:mm a")
    // });
    // this.activityLogForm.get('endTime').enable();
   this.maxCurrentTime=check_out!=null?moment(check_out).format("hh:mm a"):moment().format('hh:mm a');

  }
  LastAddedTimesheetActivityByEmpID(){
    this.checkinAddActformSubmitted=true;
    // this.isRecentActFieldValid();
    if(this.checkinLogForm.get('startTime').value){
      let startTime=this.checkinLogForm.get('startTime').value;
      let endTime=this.checkinLogForm.get('endTime').value;
    let date=moment().format('MM/DD/YYYY');
    this.checkinstartTime=date.concat(' ' +startTime) ;
    this.checkinendTime=date.concat(' ' +endTime) ;
    }
    console.log('LastAddedTimesheetActivityByEmpID',this.checkinLogForm.get('startTime').value)
    if(this.checkinLogForm.get('startTime').value!='' && this.checkinLogForm.get('endTime').value!='' && this.checkinLogForm.get('startTime').value!=null && this.checkinLogForm.get('endTime').value!=null){
   let  user_info= JSON.parse(localStorage.getItem('user_info'));

      let empId={
    "empid": user_info['id'],
    "start_time": this.checkinstartTime,
    "end_time": this.checkinendTime
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
    isRecentActFieldValid() {
      if(this.addActformSubmitted){

      }

      else{

        return (

          false
        );
      }

    }
    public onAddTimesheetActivity(){
      // this.spinner.show();
      this.checkinAddActformSubmitted=true;
      //this.isRecentActFieldValid();

      let postData;
      if(this.checkinLogForm.get('startTime').value){
        let startTime=this.checkinLogForm.get('startTime').value;
        let endTime=this.checkinLogForm.get('endTime').value;
      let date=moment().format('MM/DD/YYYY');
      this.checkinstartTime=date.concat(' ' +startTime) ;
      this.checkinendTime=date.concat(' ' +endTime) ;
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


        postData={
          "id": null,
          "groupid": this.selectedGroupId,
          "project_id":localStorage.getItem('project_id'),
      "org_id":localStorage.getItem('org_id'),

          "milestone_id": this.taskActivityId?this.taskActivityId:null,
          // "milestone_name":this.activityDataText?this.activityDataText:$("#activty_text").val(),
          "milestone_name":this.activityDataText?this.activityDataText:null,

          "task_id": this.projTaskDataValue?this.projTaskDataValue:null,
          "task_name":(this.projTaskDataValue)?this.projTaskDataText:null,

          "status_id":sliderValue==100?this.completedStatID:(this.actTaskStatusValue!=''?this.actTaskStatusValue:null),

          "remarks": this.checkinLogForm.get('remarks').value,
          "ondate": null,
          "start_time": this.checkinstartTime,
          "end_time": this.checkinendTime,
          "is_billable": this.billable,
          "worked_percent":sliderValue
        }


      console.log('postData',postData);
      if(this.projTaskDataValue && this.allowUpdateStatus){


        let postData={
          id: taskValue,

          status_id: this.inProgressStatID,


        }
        console.log('allowUpdateStatus',postData)
      }


    if( this.checkinLogForm.get('startTime').status=='VALID' &&
        this.checkinLogForm.get('endTime').status=='VALID'  &&( !this.recentTaskSel  && !this.recentActTaskSel) && this.timeinrange

     )
     {
      console.log('Validtimeline')
     this.spinner.show();
    return this.activityService.AddTimesheetActivity(postData).subscribe(
      (data:any)  => {

      if(data.status==200){


      this.spinner.hide();
    this.sliderForm.reset();
        $("#checkin_log_modal").modal('hide');
       this.GetAllTaskByProjectID();
    if(this.projTaskDataValue && this.allowUpdateStatus && sliderValue!=100){

      console.log('allowUpdateStatus',postData)

      let statusData={
        id: taskValue,

        status_id: this.inProgressStatID,


      }
  this.checkinBillable=false;

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

            })


        }

        )

      }

    this.showPurposeTasks=false;
    this.showPurposeToggle=false;
    this.projTaskDataValue='';
    this.projTaskDataText='';
    this.acttaskListValue='';
    this.activityDataText='';

    this.sub_taskId='';
    this.projSubtaskListValue='';
    this.projSubtaskText='';
    this.projSubTaskData=[];

    this.projectId=null;
    this.recentTaskSel=false;
    this.recentActTaskSel=false;
    this.recentSubTaskSel=false;
    this.checkinLogForm.reset();
    this.checkinLogForm.patchValue({
      startTime:null,
      endTime:null
    });
    this.actTaskStatusValue='';
    // this.GetAllTaskByEmpID();
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


  public getTimesheetByEmpId(){
   // this.teamEmpId=[];
   let  user_info= JSON.parse(localStorage.getItem('user_info'));

      let empId={
       ID:user_info['id']
      }
       this.userService.GetAllTimesheetByEmpID(empId).subscribe(
         (data:any)  => {

         if(data){


          this.allTimeLog=data;
          let timeValue=''
          for(var i=0;i<data.length;i++){
            if(data[i].timesheetDataModels[0].is_checkout==false){
              console.log('AllTimesheet',data[i].timesheetDataModels[0].check_in)
              timeValue=moment(data[i].timesheetDataModels[0].check_in).format('hh:mm a')
              console.log('timeValue', timeValue);

              this.selectedGroupId=data[i].timesheetDataModels[0].groupid
            }
          }

          this.minStartTime=timeValue
          this.maxCurrentTime=moment().format('hh:mm a')




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
       ;


    }

    public GetLastTimesheetByEmpID(){
      // this.teamEmpId=[];


          this.userService.GetLastTimesheetByEmpID().subscribe(
            (data:any)  => {

            if(data){
            let timeValue=''

            timeValue=moment(data.check_in).format('hh:mm a')


            //  let timeValue=''
            //  for(var i=0;i<data.length;i++){
            //    if(data[i].timesheetDataModels[0].is_checkout==false){
            //      console.log('AllTimesheet',data[i].timesheetDataModels[0].check_in)
            //      timeValue=moment(data[i].timesheetDataModels[0].check_in).format('hh:mm a')
            //      console.log('timeValue', timeValue);

            //    }
            //  }

              this.minStartTime=timeValue

       if(data.check_out!=null){
        this.maxCurrentTime=moment(data.check_out).format('hh:mm a')
       }else{
        this.maxCurrentTime=moment().format('hh:mm a')

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
          ;


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
    public am4themes_myTheme(target) {
      if (target instanceof am4core.ColorSet) {
        target.list = [
          am4core.color("green")
        ];
      }
    }
    fillPieSeries(typeOfSeries) {
      typeOfSeries.slices.template.adapter.add("fill", function(fill, target) {
        if (target.dataItem.category=='Open') {

          return am4core.color("#2c77f4");
        }
        else if (target.dataItem.category=='Completed'){
          return am4core.color("#1dc9b7");

        }else  if (target.dataItem.category=='In Progress'){
          return am4core.color("red");

        }else{
          return fill
        }
      });
    }
    public findCostHrs(){
      this.costService.FetchCostPerHourOrgID().subscribe(
        (data:any)  => {
    if(data.length!=0){

    this.perunitCostHrs=parseFloat(data[0].cost_per_hour);

    }
    })
    }
    private createMainUnitFormGroup(): FormGroup {
      return new FormGroup({
        // 'emailAddress': new FormControl('', Validators.email),
        'id': new FormControl(''),

        'Label': new FormControl(''),
        'is_checkbox': new FormControl(''),
        // 'UnitType': new FormControl(''),
        // 'Qty': new FormControl(''),
        'tags': new FormControl('', Validators.required),
        // 'unit_no': new FormControl(''),
        'size': new FormControl(''),
        'notes': new FormControl(''),
        'designType': new FormControl(''),
        'checkbox_value': new FormControl('')



      })
    }
    private createMilesTaskFormGroup(): FormGroup {
      return new FormGroup({
        // 'emailAddress': new FormControl('', Validators.email),
        'id': new FormControl(''),
        'taskid': new FormControl(''),

        'Label': new FormControl(''),
        'is_checkbox': new FormControl(''),
        'UnitType': new FormControl('', Validators.required),
        'Qty': new FormControl('', Validators.required),
        'Unit': new FormControl(''),
        'notes': new FormControl(''),
        'Unithrs': new FormControl(''),
        'total_cost': new FormControl(''),
        'profit': new FormControl(''),
        'perUnit': new FormControl(''),

        'floorUnit': new FormControl(''),




      })
    }
    public callCostProj(xpost) {

         let postData={
          "id": xpost

         }
         this.spinner.show();
      return this.costService.CalculateCostProject(postData).subscribe(
            (data: any) => {
              if (data) {
                this.spinner.hide();

      this.callCstId=data.cst_id;
              //  this.callCostProj(postData,id);
              let milestoneArray=[];

              // this.milestoneData=data['CostProjectMilestone'];
              if(data['CostProjectMilestone']){
              if( data['CostProjectMilestone'].length!=0){
                for (var i = 0; i < data['CostProjectMilestone'].length; i++) {
                  if(data['CostProjectMilestone'][i].milestone_name=='Study'){

                    // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                    milestoneArray[0]=data['CostProjectMilestone'][i]
                     if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){


                      let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseFloat(item.qty)).reduce((prev, next) => prev + next);
                    let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);
                        // let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].length!=0? data['CostProjectMilestone'][i]['CostProjectTask'].reduce(function(sum, record){
                        //   if(record.total_cost_amount != null){
                        //     return sum +parseFloat(record.total_cost_amount) ;

                        //   } else{
                        //     return sum +(parseFloat(record.qty)*(this.perunitCostHrs));
                        //   }

                        // }, 0):0;
                        // parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);



                      // this.design_hrs=total_hrs;
                    milestoneArray[0]['total_hrs']=total_hrs.toFixed(2)
                    milestoneArray[0]['total_cost']=total_cost.toFixed(2)
                    this.totalCostStudy=total_cost;

                     }

                  }
                  if(data['CostProjectMilestone'][i].milestone_name=='Design'){
                    // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                      milestoneArray[1]=data['CostProjectMilestone'][i]
                     if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){

                    let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseFloat(item.qty)).reduce((prev, next) => prev + next);
                    let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);


                    milestoneArray[1]['total_hrs']=total_hrs.toFixed(2)
                    milestoneArray[1]['total_cost']=total_cost.toFixed(2)
                    this.totalCostDesign=total_cost;


                     }
                  }
                  if(data['CostProjectMilestone'][i].milestone_name=='Shop Drawing'){
                    // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                      milestoneArray[2]=data['CostProjectMilestone'][i]
                     if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){

                    let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseFloat(item.qty)).reduce((prev, next) => prev + next);
                    let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);


                    milestoneArray[2]['total_hrs']=total_hrs.toFixed(2)
                    milestoneArray[2]['total_cost']=total_cost.toFixed(2)
                    this.totalCostDrawing=total_cost;


                     }
                  }
                  if(data['CostProjectMilestone'][i].milestone_name=='Extra Services'){
                    // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                      milestoneArray[3]=data['CostProjectMilestone'][i]
                     if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){

                    let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseFloat(item.qty)).reduce((prev, next) => prev + next);
                    let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);


                    milestoneArray[3]['total_hrs']=total_hrs.toFixed(2)
                    milestoneArray[3]['total_cost']=total_cost.toFixed(2)
                    this.totalCostService=total_cost;


                     }
                  }
                          }
              }
              }
              this.milestoneData=milestoneArray;
              this.CURRENCY = 'CURRENCY';
              this.costProjectDetails=data;
      if(data.EntityContact!=null){

              for(var i=0;i<data.EntityContact.length;i++){
                if(data.EntityContact[i]['is_primary']==true){
                  this.primaryContact=data.EntityContact[i]
                }
              }
      }





             var projectUnit = []

             // let dataObj = JSON.parse(data['token']);
             //
      if( data['ProjectUnit']){
             for (var i = 0; i < data['ProjectUnit'].length; i++) {
               // logik to create new items

               projectUnit.push({
                 "id": data['ProjectUnit'][i].unit_id,
                 "text": data['ProjectUnit'][i].unit_name,
                 "is_checkbox": false
               });

             }

             this.createEditList(data['ProjectUnit']);
             this.createExtraEditList(data['ProjectUnitExtra'],data['ProjectUnit'])

              this.createMilestTaskForm(data['CostProjectMilestone'],data.no_of_floors);

          setTimeout(()=>{
          const miles = this.milestTaskForm.get('miles') as FormArray

            let total_hrs=miles.value.map(item =>parseFloat(item.total_cost)).reduce((prev, next) => prev + next);
            this.totalHrs=total_hrs;
            let total_milesthrs=miles.value.map(item =>parseFloat(item.Qty)).reduce((prev, next) => prev + next);
            this.MilestHrs=parseFloat(total_milesthrs).toFixed(2);

            var value=total_hrs*(this.profit_margin/100);
            let result=Math.round(value*100)/100
            if(this.totalHrs!=0){
              this.profit_value=result;

            }

            let net_total=this.profit_value+total_hrs;
            this.total_value=net_total;

            let vat=net_total*(5/100);
            this.vat_total=vat;
            this.net_total=vat+net_total;
            if(data.discount_amount!=null && data.discount_amount!=''){
              this.discount_amount=data.discount_amount;
              this.total_value=this.totalHrs+this.profit_value+parseFloat(data.discount_amount);


            }else{
              this.discount_amount='';
            }

            if(data.discount_amount!=null && data.discount_amount!=''){

                let vat=this.total_value*(5/100);
                this.vat_total=vat;
                this.net_total=vat+this.total_value;

            }

              }, 500);

            }



              } else {
                this.spinner.hide();

                Swal.fire(
                  'Error!',
                  data['result'].desc,
                  'error'
                ).then(
                  (result) => {

                  })
              }
            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result) => {

                })


            }

          )
        }


        getLeadHistory(id){
          this.histSer.getHistory(id).subscribe((data: any) => {
            console.log(data)
            if(data.length !== 0){
              this.historyData = data;
              this.noHistoryDataDiv = false;
              this.historyDataDiv = true;
            } else {
              this.noHistoryDataDiv = true;
              this.historyDataDiv = false;
            }
          });
        }

    public createEditList(list) {
      const emails = this.mainUnitForm.get('emails') as FormArray
      if (emails.length > 1) {
       emails.clear()

      } else {
       emails.clear()

      }
      this.editable=true;
      var results = [];
      for (var i = 0; i < list.length; i++) {
        if(list[i].ProjectTags.length!=0){

        emails.push(this.createMainUnitFormGroup())
        var tags=[]

        for (var j = 0; j < list[i].ProjectTags.length; j++) {

          tags.push(
            list[i].ProjectTags[j].tags,

          );

        }
      }
        results.push({ Label: list[i].unit_name, id: list[i].unit_id,size: list[i].unit_qty, is_checkbox:false,tags:tags,notes:list[i].note })


      }
      emails.patchValue(results);


    }
    public createExtraEditList(list,mainlist) {
      const emails = this.extraUnitForm.get('extras') as FormArray
      const mainunit = this.mainUnitForm.get('emails') as FormArray
      if (emails.length > 1) {
       emails.clear()

      } else {
       emails.clear()

      }
      this.editable=true;
      // const emails = this.emailForm.get('emails') as FormArray
      var results = [];

      let maintagsdata = [];


      for (var i = 0; i < mainlist.length; i++) {


        var tags=[]

        for (var j = 0; j < mainlist[i].ProjectTags.length; j++) {

          maintagsdata.push(
            mainlist[i].ProjectTags[j].tags,

          );

        }



      }


      for (var i = 0; i < list.length; i++) {

        emails.push(this.createMainUnitFormGroup())
        var tags=[]

        for (var j = 0; j < list[i].ProjectTags.length; j++) {

          tags.push(
            list[i].ProjectTags[j].tags,

          );

        }
        if(tags.includes("All")){
          tags=['All']
        }else{
          tags=tags
        }
        results.push({ Label: list[i].unit_name, id: list[i].unit_id,size: list[i].unit_qty, is_checkbox:false,designType:tags,tags: maintagsdata.concat([
          'All'
       ]),notes:list[i].note })


      }
      emails.patchValue(results);


    }
    public createMilestTaskForm(data,floorNo) {
      const miles = this.milestTaskForm.get('miles') as FormArray
      var results = [];

      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i]['CostProjectTask']['length']; j++) {

  if(data[i]['CostProjectTask'].length!=0){
    miles.push(this.createMilesTaskFormGroup())

   let unitQty=(data[i].CostProjectTask[j].qty!='' || data[i].CostProjectTask[j].qty!=null) ?parseFloat(data[i].CostProjectTask[j].qty).toFixed(2):'';
        results.push({ Label: data[i].CostProjectTask[j].task_name,UnitType: '2',Qty: unitQty, id: data[i].CostProjectTask[j].milestone_id, taskid:data[i].CostProjectTask[j].id,is_checkbox:data[i].CostProjectTask[j].is_selected,Unit:data[i].CostProjectTask[j].total_unit,Unithrs:data[i].CostProjectTask[j].default_unit_hours,
        total_cost:(data[i].CostProjectTask[j].total_cost_amount!=null?parseFloat(data[i].CostProjectTask[j].total_cost_amount).toFixed(2):(data[i].CostProjectTask[j].qty*this.perunitCostHrs).toFixed(2)),profit:data[i].CostProjectTask[j].discount_amount!=null?data[i].CostProjectTask[j].discount_amount:'',perUnit:data[i].CostProjectTask[j].unit!=null?data[i].CostProjectTask[j].unit_type:'',
        floorUnit:data[i].CostProjectTask[j].unit_type
      })
        miles.controls.forEach(pair => pair.patchValue({ is_checkbox: 'true'}));
  }

        }


      }
      miles.patchValue(results);



    }
  ngOnInit() {

this.getLeadHistory(localStorage.getItem('project_id'));

  this.getAllStatus();
   this.findCostHrs();

    this.getTimesheetByEmpId();
    this.GetLastTimesheetByEmpID();
    this.emailForm = this.formBuilder.group({
      emails: this.formBuilder.array([this.createEmailFormGroup()])
    });

    this.mainUnitForm = this.formBuilder.group({
      emails: this.formBuilder.array([])
    });
    this.extraUnitForm = this.formBuilder.group({
      extras: this.formBuilder.array([])
    });
    this.milestTaskForm = this.formBuilder.group({
      miles: this.formBuilder.array([])
    });
    if(JSON.parse(localStorage.getItem('userRights')).length!=0){
      console.log('if')
      let userRights= JSON.parse(localStorage.getItem('userRights'));
      for(var i=0;i<userRights.length;i++){
        if(userRights[i].module_name=='Project'  ){
          if(userRights[i].section_name=='Assign Task' && userRights[i].is_allow==true ){
            this.showAssgnTask=true
          }
        else if(userRights[i].section_name=='Assign Task' && userRights[i].is_allow==false ){
          this.showAssgnTask=false

        }
        if(userRights[i].section_name=='Kanban Board' && userRights[i].is_allow==true ){
          this.showKanbanBtn=true
        }
      else if(userRights[i].section_name=='Kanban Board' && userRights[i].is_allow==false ){
        this.showKanbanBtn=false

      }
      if(userRights[i].section_name=='View Cost Details' && userRights[i].is_allow==true ){
        this.showCostDetails=true
      }
    else if(userRights[i].section_name=='View Cost Details' && userRights[i].is_allow==false ){
      this.showCostDetails=false

    }

      }
      console.log('userRights',userRights[i].section_name)

      }

    }else{
      console.log('else')
      this.showAssgnTask=true
      this.showCostDetails=true
      this.showKanbanBtn=true

    }
    if(localStorage.getItem('user_info')){
      this.user_info= JSON.parse(localStorage.getItem('user_info'));

      if(this.user_info['is_superadmin']==true){
       this.showEditTask=true;
       this.showDeleteTask=true;
       this.showModifyBtn=true;
      }
      if(this.user_info['is_admin']==true && this.user_info['is_superadmin']==false){
        this.showEditTask=true;
       this.showDeleteTask=false;
       this.showModifyBtn=true;
      }
      if(this.user_info['is_admin']==false && this.user_info['is_superadmin']==false){
        this.showEditTask=false;
        this.showDeleteTask=false;
        this.showModifyBtn=false;
      }
    }
    this.FindByProjectID();

    this.projectProgress=0;
    chart = am4core.create("chartdiv", am4charts.PieChart);
    taskchart = am4core.create("taskchartdiv", am4charts.PieChart);
    studychart = am4core.create("studychartdiv", am4charts.PieChart);
     designchart = am4core.create("designchartdiv", am4charts.PieChart);
     shopDrawngchart = am4core.create("shopDrawngchartdiv", am4charts.PieChart);
     extraSchart = am4core.create("extraSchartdiv", am4charts.PieChart);
    //  projRelatedchart = am4core.create("projRelatedchartdiv", am4charts.PieChart);

    budegetdHrschart = am4core.create("budegetdHrschartdiv", am4charts.XYChart);
    budegetdHrschart.data = budegetdHrschartData
    //////////////////////////////////////////////////////////////////////
    let dateAxis = budegetdHrschart.xAxes.push(new am4charts.CategoryAxis());
//dateAxis.renderer.grid.template.location = 0;
//dateAxis.renderer.minGridDistance = 30;
let budgetHrslabel = dateAxis.renderer.labels.template;
// budgetHrslabel.wrap = true;
//   budgetHrslabel.maxWidth = 80;
//  budgetHrslabel.rotation = -45;
//  budgetHrslabel.horizontalCenter = "middle";
//  budgetHrslabel.verticalCenter = "middle";
dateAxis.dataFields.category = "x";
let valueAxis1 = budegetdHrschart.yAxes.push(new am4charts.ValueAxis());
valueAxis1.title.text = "Budgeted Hours";
valueAxis1.min=0;

let valueAxis2 = budegetdHrschart.yAxes.push(new am4charts.ValueAxis());
valueAxis2.title.text = "Actual Hours";
valueAxis2.min=0;
valueAxis2.renderer.opposite = true;
valueAxis2.renderer.grid.template.disabled = true;

// Create series
let series1 = budegetdHrschart.series.push(new am4charts.ColumnSeries());
console.log('series1.dataFields',series1.dataFields);

// "hrs1": data[i]['budget_hours'],
// "hrs2":data[i]['worked_hours'],
series1.dataFields.valueY = "hrs1";
series1.dataFields.categoryX = "x";

// valueAxis1.renderer.labels.template.adapter.add("text", function(text) {
//   return text + "%";
// });
series1.yAxis = valueAxis1;


series1.name = "Budgeted Hours";
// series1.tooltipText = "{name}\n[bold font-size: 20]{valueY}Hrs{activity_name}{task_name}[/]";
///series1.tooltipHTML = "<div style='font-size: 20;font-weight:bold'>{valueY} Hrs</div><div style='width:200px;display:flex'><div style='width:50px'>Milestone </div> <div style='font-weight:bold'>- {activity_name}</div></div ><div style='width:200px;display:flex'><div style='width:50px'>Task</div><div style='font-weight:bold'>- {task_name}{labour_count}</div></div>";
//series1.tooltipHTML = "<div style='font-size: 20;font-weight:bold'>{valueY}  Hrs</div><div style='width:200px;display:flex'><div style='width:50px'>Milestone </div> <div style='font-weight:bold'>- {activity_name}</div></div ><div style='width:200px;display:flex'><div style='width:50px'>Task</div><div style='font-weight:bold'>- {task_name}</div></div><div style='width:200px;display:flex'><div style='width:50px'>Subtask </div> <div style='font-weight:bold'>- {sub_task_name}</div></div >";

series1.tooltipHTML = "<div style='font-size:20;font-weight:bold;'> {sub_task_name} <span style='margin-left:4px;'>({task_name})</span></div><div style='font-size: 20;font-weight:bold;margin-bottom:4px;'>Milestone : {activity_name} <span style='margin-left:4px;'></span></div><hr style='border-top: 1px dashed;'/><div style='text-align:center;font-weight:bold;'>Budgeted Hours</div><div style='text-align:center;'>{hrs1} Hrs</div><div style='text-align:center;font-weight:bold;'>Actual Hours</div><div style='text-align:center;'>{hrs2} Hrs</div><div style='text-align:center;font-weight:bold;'>Productive Percentage</div><div style='text-align:center;'>{y} %</div><div style='text-align:center;font-weight:bold;'>Employee Count</div><div style='text-align:center;'>{labour_count}</div>";
// series1.tooltip.background.fill = am4core.color("white");
// series1.tooltip.getFillFromObject = false;
// series1.tooltip.background.fill = am4core.color("white");
// series1.tooltip.getStrokeFromObject = false;

series1.fill = chart.colors.getIndex(0);
series1.strokeWidth = 0;
series1.clustered = false;
series1.columns.template.width = am4core.percent(40);

// let series4 = budegetdHrschart.series.push(new am4charts.LineSeries());
// series4.dataFields.valueY = "hrs2";
// series4.dataFields.categoryX = "x";
// series4.name = "Actual Hours";
// series4.strokeWidth = 2;
// series4.tensionX = 0.7;
// series4.yAxis = valueAxis2;
// let bullet3 = series4.bullets.push(new am4charts.CircleBullet());
// bullet3.circle.radius = 3;
// bullet3.circle.strokeWidth = 2;
// bullet3.circle.fill = am4core.color("#fff");
// let bullet3 = series1.bullets.push(new am4charts.CircleBullet());
// bullet3.circle.radius = 3;
// bullet3.circle.strokeWidth = 2;
// bullet3.circle.fill = am4core.color("#fff");

let series2 = budegetdHrschart.series.push(new am4charts.ColumnSeries());
series2.dataFields.valueY = "hrs2";
series2.dataFields.categoryX = "x";
series2.yAxis = valueAxis1;
series2.name = "Actual Hours";
//series2.tooltipHTML = "<div style='font-size: 20;font-weight:bold'>{valueY} Hrs</div><div style='width:200px;display:flex'><div style='width:50px'>Milestone </div> <div style='font-weight:bold'>- {activity_name}</div></div ><div style='width:200px;display:flex'><div style='width:50px'>Task</div><div style='font-weight:bold'>- {task_name}</div></div>";
 //series2.fill = am4core.color("#ED7B84");
series2.strokeWidth = 0;
series2.clustered = false;
series2.toBack();
series2.stroke = am4core.color("#ff0000");
// series2.heatRules.push({
//   "target": series2.columns.template,
//   "property": "fill",
//   "min": am4core.color("#ED7B84"),
//   "max": am4core.color("#ED7B84"),
//   "dataField": "valueY"
// });

// let series3 = budegetdHrschart.series.push(new am4charts.LineSeries());
// series3.dataFields.valueY = "market1";
// series3.dataFields.dateX = "date";
// series3.name = "Market Days";
// series3.strokeWidth = 2;
// series3.tensionX = 0.7;
// series3.yAxis = valueAxis2;
// series3.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";

// let bullet3 = series3.bullets.push(new am4charts.CircleBullet());
// bullet3.circle.radius = 3;
// bullet3.circle.strokeWidth = 2;
// bullet3.circle.fill = am4core.color("#fff");

// let series4 = budegetdHrschart.series.push(new am4charts.LineSeries());
// series4.dataFields.valueY = "labour_count";
// series4.dataFields.categoryX = "x";
// series4.name = "Employee Count";
// series4.strokeWidth = 2;
// series4.tensionX = 0.7;
// series4.yAxis = valueAxis2;
// series4.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";
//series4.tooltipHTML = "<div style='font-size: 20;font-weight:bold'>{valueY}  Hrs</div><div style='width:200px;display:flex'><div style='width:50px'>Milestone </div> <div style='font-weight:bold'>- {activity_name}</div></div ><div style='width:200px;display:flex'><div style='width:50px'>Task</div><div style='font-weight:bold'>- {task_name}</div></div><div style='width:200px;display:flex'><div style='width:50px'>Subtask </div> <div style='font-weight:bold'>- {sub_task_name}</div></div >";

// series4.stroke = chart.colors.getIndex(0).lighten(0.5);
// series4.strokeDasharray = "3,3";

// let bullet4 = series4.bullets.push(new am4charts.CircleBullet());
// bullet4.circle.radius = 3;
// bullet4.circle.strokeWidth = 2;
// bullet4.circle.fill = am4core.color("#fff");

// Add cursor
budegetdHrschart.cursor = new am4charts.XYCursor();

// Add legend
budegetdHrschart.legend = new am4charts.Legend();
budegetdHrschart.legend.position = "top";

// Add scrollbar
budegetdHrschart.scrollbarX = new am4charts.XYChartScrollbar();
budegetdHrschart.scrollbarX.series.push(series1);
// budegetdHrschart.scrollbarX.series.push(series3);
budegetdHrschart.scrollbarX.parent = budegetdHrschart.bottomAxesContainer;

///////////////////////////////////////////////////////////////
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "ratio";
     pieSeries.dataFields.category = "project_status_name";

    this.fillPieSeries(pieSeries)

    //  chart.innerRadius = am4core.percent(40);
    chart.legend = new am4charts.Legend();
    // Add and configure Series

    let designpieSeries = designchart.series.push(new am4charts.PieSeries());
    designpieSeries.dataFields.value = "ratio";
    designpieSeries.dataFields.category = "status_name";
    // taskchart.innerRadius = am4core.percent(40);

    this.fillPieSeries(designpieSeries)

    designchart.legend = new am4charts.Legend();

    let shopDrawngSeries = shopDrawngchart.series.push(new am4charts.PieSeries());
    shopDrawngSeries.dataFields.value = "ratio";
    shopDrawngSeries.dataFields.category = "status_name";
    // taskchart.innerRadius = am4core.percent(40);
    this.fillPieSeries(shopDrawngSeries)

    shopDrawngchart.legend = new am4charts.Legend();
    let studypieSeries = studychart.series.push(new am4charts.PieSeries());
    studypieSeries.dataFields.value = "ratio";
    studypieSeries.dataFields.category = "status_name";
    this.fillPieSeries(studypieSeries)

    // taskchart.innerRadius = am4core.percent(40);
    studychart.legend = new am4charts.Legend();

    let extraSpieSeries = extraSchart.series.push(new am4charts.PieSeries());
    extraSpieSeries.dataFields.value = "ratio";
    extraSpieSeries.dataFields.category = "status_name";
    this.fillPieSeries(extraSpieSeries)

    // taskchart.innerRadius = am4core.percent(40);
    extraSchart.legend = new am4charts.Legend();

    // Add and configure Series
    // let projRelatedpieSeries = projRelatedchart.series.push(new am4charts.PieSeries());
    // projRelatedpieSeries.dataFields.value = "ratio";
    // projRelatedpieSeries.dataFields.category = "status_name";
    // projRelatedchart.legend = new am4charts.Legend();
    // Add and configure Series
    let taskpieSeries = taskchart.series.push(new am4charts.PieSeries());
    taskpieSeries.dataFields.value = "ratio";
    taskpieSeries.dataFields.category = "status_name";
    this.fillPieSeries(taskpieSeries)

    // taskchart.innerRadius = am4core.percent(40);
    taskchart.legend = new am4charts.Legend();

    projCompareChart = am4core.create("projchartdiv", am4charts.XYChart);
    milestCompareChart = am4core.create("milestchartdiv", am4charts.XYChart);
    milestCompareChart.logo.disabled = true;
    projCompareChart.logo.disabled = true;
    taskchart.logo.disabled = true;
    chart.logo.disabled = true;
    designchart.logo.disabled = true;
    studychart.logo.disabled = true;
    shopDrawngchart.logo.disabled = true;
    extraSchart.logo.disabled = true;
    budegetdHrschart.logo.disabled = true;
    // projCompareChart.data=projCompareChartData;
    var milestcategoryAxis = milestCompareChart.yAxes.push(new am4charts.CategoryAxis());
milestcategoryAxis.dataFields.category = "activity_name";
// milestcategoryAxis.numberFormatter.numberFormat = "#";
milestcategoryAxis.renderer.inversed = true;
milestcategoryAxis.renderer.grid.template.location = 0;
milestcategoryAxis.renderer.cellStartLocation = 0.1;
milestcategoryAxis.renderer.cellEndLocation = 0.9;
let milestlabel = milestcategoryAxis.renderer.labels.template;
milestlabel.wrap = true;
 milestlabel.maxWidth = 100;
milestlabel.rotation = -90;
 milestlabel.horizontalCenter = "middle";
    milestlabel.verticalCenter = "middle";
var  milestvalueAxis = milestCompareChart.xAxes.push(new am4charts.ValueAxis());
milestvalueAxis.renderer.opposite = true;

var categoryAxis = projCompareChart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "project_name";


// categoryAxis.numberFormatter.numberFormat = "#";
categoryAxis.renderer.inversed = true;
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.cellStartLocation = 0.1;
categoryAxis.renderer.cellEndLocation = 0.9;
let label = categoryAxis.renderer.labels.template;
label.wrap = true;
// label.maxWidth = 100;
label.rotation = -90;
label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
var  valueAxis = projCompareChart.xAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.opposite = true;
    this.createProjCompSeries("worked_hours", "Actual Hrs");
    this.createProjCompSeries("budget_hours", "Budgeted Hrs");

    this.createMilestCompSeries("worked_hours", "Actual Hrs");
    this.createMilestCompSeries("budget_hours", "Budgeted Hrs");
  //   milestCompareChart.events.on("hit", (ev) => {
  //     console.log('hit',ev.target);
  //     console.log('tooltipText',ev);
  // $("#task_log_modal").modal('show');

  //  });
    if(localStorage.getItem('planType')){

      this.planType='Basic'
    }
    if(localStorage.getItem('user_info')){
      this.user_info= JSON.parse(localStorage.getItem('user_info'));
      this.full_name=this.user_info['first_name'];

     ;


  }
  this.GetAllCustomer();

    this.GetPriorityByOrgID();
    this.getContactList('');
    this.ProjectPropertyByProjectID();
    this.ProductivityTaskProgressByProjectID();
    this.GetProjectMilestRatioByProjectID();
    this.ProductivityMilestoneProgressByProjectID();
    this.ProductivityProjectProgressByProjectID();
    // this.GetProjectMilestRatioByProjectID();
    this.dateRangeText=moment().format('ddd, D MMM YYYY');
    this.dateRangeSiteText=moment().format('ddd, D MMM YYYY');

    this.GetAllAccomplishedTaskByProjectIDAndDate(moment(this.today).format('L'),moment(this.today).format('L'));
    this.GetAllProjectCheckInByProjectIDAndDate(moment(this.today).format('L'),moment(this.today).format('L'));

    this.piedata = [
      { x: 'Jan', y: 3, text: 'Jan: 3' }, { x: 'Feb', y: 3.5, text: 'Feb: 3.5' },
      { x: 'Mar', y: 7, text: 'Mar: 7' }, { x: 'Apr', y: 13.5, text: 'Apr: 13.5' },
      { x: 'May', y: 19, text: 'May: 19' }, { x: 'Jun', y: 23.5, text: 'Jun: 23.5' },
      { x: 'Jul', y: 26, text: 'Jul: 26' }, { x: 'Aug', y: 25, text: 'Aug: 25' },
      { x: 'Sep', y: 21, text: 'Sep: 21' }, { x: 'Oct', y: 15, text: 'Oct: 15' },
      { x: 'Nov', y: 9, text: 'Nov: 9' }, { x: 'Dec', y: 3.5, text: 'Dec: 3.5' }];
    this.tooltip = {
            enable: true
            }

    this.ProjectTaskCountByProjectID();
    this.GetProjectActivityByProjectID();
    this.GetAllTaskByProjectID();
    this.FindAllProjectActivityByProjectID();
    // this.getAllPriority();
    // this.getAllStatus();
    // this.getEmployeeByOrgId();
    // this.getAllEmployee();
    this.dateRangeForm = new FormGroup({
      daterangeAtt: new FormControl(''),
      daterangeSite: new FormControl('')






   });

console.log('project_start_date',this.project_start_date)

   this.contactForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('')






 });
   this.timesheetForm= new FormGroup({
    checkinType:new FormControl('', [Validators.required]),

 });
   this.dateRangeForm.patchValue({
   // daterangeAtt:[this.today, this.today],
    daterangeSite:[this.today, this.today],


   })

   this.dateRangeForm.get('daterangeAtt').valueChanges.subscribe(() => {
    // fires when the input value has actually changed

    if(this.dateRangeForm.get('daterangeAtt').value!=null){
       this.spinner.show();
      let startTime=this.dateRangeForm.get('daterangeAtt').value;
      this.fromDateValue=moment(startTime[0]).format('L');
      this.toDateValue=moment(startTime[1]).format('L');
      this.GetAllAccomplishedTaskByProjectIDAndDate( this.fromDateValue,this.toDateValue)

    if(startTime[0]==startTime[1]){
      this.dateRangeText=moment(startTime[0]).format('ddd, D MMM YYYY');

    }else{
      this.dateRangeText=moment(startTime[0]).format('ddd, D MMM YYYY')+'-'+moment(startTime[1]).format('ddd, D MMM YYYY');

    }



    }else{

    }

    //







});
this.dateRangeForm.get('daterangeSite').valueChanges.subscribe(() => {
  // fires when the input value has actually changed

  if(this.dateRangeForm.get('daterangeSite').value!=null){
     //this.spinner.show();
    let startTime=this.dateRangeForm.get('daterangeSite').value;
    this.fromDateValue=moment(startTime[0]).format('L');
    this.toDateValue=moment(startTime[1]).format('L');
    // this.GetAllAccomplishedTaskByProjectIDAndDate( this.fromDateValue,this.toDateValue)
    this.GetAllProjectCheckInByProjectIDAndDate( this.fromDateValue,this.toDateValue)

  if(startTime[0]==startTime[1]){
    this.dateRangeSiteText=moment(startTime[0]).format('ddd, D MMM YYYY');

  }else{
    this.dateRangeSiteText=moment(startTime[0]).format('ddd, D MMM YYYY')+'-'+moment(startTime[1]).format('ddd, D MMM YYYY');

  }



  }else{

  }

  //







});


    this.activityLogForm = new FormGroup({
      activName: new FormControl('', [Validators.required]),
      remarks: new FormControl(''),
      startDate: new FormControl('',[Validators.required]),
      endDate: new FormControl('',[Validators.required]),
      templateName: new FormControl('',[Validators.required])



   });
   this.checkinLogForm = new FormGroup({
    startTime: new FormControl(  '', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    remarks:new FormControl(''),
    purpose:new FormControl(''),

    // email: new FormControl('', [Validators.required]),



  });
  this.sliderForm = this.fb.group({
    'slider': [0, Validators.min(10)]
  });
   if(this.activityLogForm.get('startDate').value==''){
    this.disableEndDate=true;
    this.disableAddAct=true
  }

   this.customerForm = new FormGroup({
    customer_Name:new FormControl(''),
     contact_name:new FormControl(''),
     customer_type:new FormControl(''),
     customer_email:new FormControl(''),
     customer_phone:new FormControl(''),
     city:new FormControl(''),


     street_1: new FormControl(''),
     street_2: new FormControl(''),


     country: new FormControl('', [Validators.required]),

     name: new FormControl(''),
     position: new FormControl(''),
     phone: new FormControl(''),
     mobile: new FormControl(''),
     email: new FormControl(''),






  });
   this.taskLogForm= new FormGroup({
    taskName: new FormControl('', [Validators.required]),
    subtaskName: new FormControl('', [Validators.required]),
    desc: new FormControl(''),
    date: new FormControl(''),
    taskTemplateName: new FormControl('')



 });
this.taskLogForm.patchValue({
  date:moment().format('L')
})

   if(this.taskLogForm.get('date').value==''){
    this.disableAddTask=true;
  }else{
   this.disableAddTask=false;

  }
  this.taskLogForm.get('date').valueChanges.subscribe(() => {
    // fires when the input value has actually changed
    this.disableAddTask=false;

  });

  let user_info:object;
  if(localStorage.getItem('user_info')){
      user_info= JSON.parse(localStorage.getItem('user_info'));

  }

  this.meetingForm = new FormGroup({
    meeeting_Name: new FormControl('', [Validators.required]),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    meeeting_loc: new FormControl(''),
    callType: new FormControl(''),
    desc: new FormControl(''),
    participantId: new FormControl('', [Validators.required]),



  });
  this.callForm = new FormGroup({
    subject: new FormControl('', [Validators.required]),
    startDate: new FormControl(''),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    scheduleTime: new FormControl(''),
    callType: new FormControl(''),
    no_mins: new FormControl(''),
    showStartEndTime:new FormControl(''),
    showDateEndTime:new FormControl(''),
    desc: new FormControl(''),

  });


  this.meetingForm.get('endTime').disable();
  // this.callForm.get('endTime').disable();

  this.meetingForm.get('endTime').valueChanges.subscribe(() => {
    if(this.meetingForm.get('endTime').value!=''){
      this.endValChange=true;
    }else
    {
      this.endValChange=false;

    }



  });
  this.notesForm = new FormGroup({
    notes: new FormControl('', [Validators.required]),
    title: new FormControl(''),

  })
    // $.getScript("assets/js/departments-datatable.js")
    this.callForm.patchValue({
       callType: 'current',
      startDate:moment().format('L'),


    })
    this.customerContactForm = new FormGroup({


      fname: new FormControl('', [Validators.required]),
      lname: new FormControl('', [Validators.required]),
      department: new FormControl(''),
      note: new FormControl(''),
      relationship: new FormControl(''),

      designation: new FormControl(''),
      //  phone: new FormControl(''),
      mobile:new FormControl('',[Validators.required]),

      //  mobile: new FormControl('',[patternValidator(/^\+\d{1,3}-\d{9,10}$/)]),
       email: new FormControl('', [
        Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),








    });
      this.customerContactForm.valueChanges.subscribe(
        (selectedValue) => {

         if((this.customerContactForm.get('fname').status=="VALID" || this.customerContactForm.get('fname').status=="DISABLED") && (this.customerContactForm.get('lname').status=="VALID"|| this.customerContactForm.get('lname').status=="DISABLED")&& this.customerContactForm.get('email').status=="VALID"  ){
           this.disableSaveBranch=false;
           console.log('customerContactValid')
         } else{
          this.disableSaveBranch=true;
          console.log('customerContactINValid')

         }
        }
      );
    this.GetAllCloseActivitiesEntityID();
    this.GetAllOpenActivitiesEntityID();
    this.FetchEntityNotesEntityID();
  this.data = this.taskData;
  this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  this.toolbar = ['Add', 'Edit', 'Delete'];
  this.pageSettings = { pageCount: 5};
  this.shipCityDistinctData = DataUtil.distinct(orderDetails, 'ShipCity', true);
  this.shipCountryDistinctData = DataUtil.distinct(orderDetails, 'ShipCountry', true );
//
  }
  hrschange(taskid,e,index,Qty){
    const miles = this.milestTaskForm.get('miles') as FormArray
  let total_cost;

  // this.costText=false;

   if(e.target.value>=-Qty){
    total_cost=parseFloat(e.target.value)*(this.perunitCostHrs);
    miles.at(index).patchValue({total_cost: total_cost })
    //this.UpdateCostProjectHrsTaskID(taskid,e.target.value,total_cost)

   }else{
  miles.at(index).patchValue({total_cost: Qty })
  this.toastr.error('Please enter a valid discount value', undefined, {
    positionClass: 'toast-top-center'
  });
   }






      let hrs= miles.value.reduce(function(sum, record){
        if(record.is_checkbox == true) return sum +parseFloat(record.total_cost) ;
        else return sum;
      }, 0);
      let total_milesthrs=miles.value.map(item =>parseFloat(item.Qty)).reduce((prev, next) => prev + next);



  setTimeout(()=>{
    this.MilestHrs=total_milesthrs;
    this.totalHrs=hrs;
  var value=hrs*(this.profit_margin/100);
  let result=Math.round(value*100)/100
  this.profit_value=result;
  this.total_value=this.profit_value+hrs;

  let vat=this.total_value*(5/100);
  this.vat_total=vat;
  this.net_total=vat+this.total_value;
  },500)


  }
  taskDiscchange(taskid,e,index,Qty){
    const miles = this.milestTaskForm.get('miles') as FormArray
  let total_cost;
 // this.costText=false;


   if(e.value>=-Qty){
    total_cost=parseInt(Qty)+(e.value);
    miles.at(index).patchValue({total_cost: total_cost })
    //this.UpdateCostProjectDiscountAndTotalCostTaskID(taskid,e.value,total_cost)
      this.totalCostStudy=parseInt(this.totalCostStudy)+e.value;

  //
   }else{
  //
  miles.at(index).patchValue({total_cost: Qty })
  this.toastr.error('Please enter a valid discount value', undefined, {
    positionClass: 'toast-top-center'
  });
   }


  // let total_cost=(Qty-(Qty *(e.value/100)))
  // total_cost=Math.round(total_cost*100)/100


   //   miles.at(index).patchValue({total_cost: total_cost })

      let hrs= miles.value.reduce(function(sum, record){
        if(record.is_checkbox == true) return sum +parseInt(record.total_cost) ;
        else return sum;
      }, 0);


  setTimeout(()=>{
    this.totalHrs=hrs;
  var value=hrs*(this.profit_margin/100);
  let result=Math.round(value*100)/100
  this.profit_value=result;
  this.total_value=this.profit_value+hrs;

  let vat=this.total_value*(5/100);
  this.vat_total=vat;
  this.net_total=vat+this.total_value;
  },500)


  }
  // ngAfterViewInit() {
  //   this.zone.runOutsideAngular(() => {
  //     am4core.ready(function() {
  //       setTimeout(() => {
  //         let chart = am4core.create('chartdiv', am4charts.XYChart);

  //         chart.paddingRight = 20;

  //         let data = [];
  //         let visits = 10;
  //         for (let i = 1; i < 366; i++) {
  //           visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
  //           data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
  //         }

  //         chart.data = data;

  //         let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  //         dateAxis.renderer.grid.template.location = 0;

  //         let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //         valueAxis.tooltip.disabled = true;
  //         valueAxis.renderer.minWidth = 35;

  //         let series = chart.series.push(new am4charts.LineSeries());
  //         series.dataFields.dateX = "date";
  //         series.dataFields.valueY = "value";

  //         series.tooltipText = "{valueY.value}";
  //         chart.cursor = new am4charts.XYCursor();

  //         let scrollbarX = new am4charts.XYChartScrollbar();
  //         scrollbarX.series.push(series);
  //         chart.scrollbarX = scrollbarX;

  //         this.chart = chart;


  //       }, 1000);
  //       // chart code

  //     });

  //   });
  // }

  // ngOnDestroy() {
  //   this.zone.runOutsideAngular(() => {
  //     if (this.chart) {
  //       this.chart.dispose();
  //     }
  //   });
  // }

}
export interface IOrderModel {
  OrderID?: string;
  // CustomerName?: string;
  ShipCity?: string;
  OrderDate?: Date;
  Freight?: number;
  ShipCountry?: string;
  ShipAddress?: string;
  TaskTemplate?:string;
  MilestoneName?:string;
  Priority?:string;
  Assignee?:string;
  Lead?:string;
  TemplateName?: string;
  Approver?:string;

}
export interface ParentComponentApi {
  callParentMethod: () => void
  // taskParentMethod: () => void

}
