import {
  Component,
  ViewContainerRef,
  ViewEncapsulation,
  OnInit,
  ViewChildren,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  ViewChild,
  NgZone,
  Inject,
  Renderer2,
} from "@angular/core";
import {
  countUpTimerConfigModel,
  timerTexts,
  CountupTimerService,
} from "ngx-timer";
//import { ClockPickerDialogService, ClockPickerConfig } from 'ng-clock-picker-lib';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
// import { ClockPickerDialogService, ClockPickerConfig } from 'ng-clock-picker-lib';
import * as moment from "moment";
import * as _ from "lodash";
// import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from "rxjs";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
// import * as _swal from 'sweetalert';
// import { SweetAlert } from 'sweetalert/typings/core';
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { Router, NavigationEnd } from "@angular/router";
import { Select2OptionData, Select2TemplateFunction } from "ng2-select2";
import { MapsAPILoader, MouseEvent, AgmMap } from "@agm/core";
import { ResizeService } from "@syncfusion/ej2-angular-grids";
import {
  Location,
  Appearance,
  GermanAddress,
} from "@angular-material-extensions/google-maps-autocomplete";
import {
  DataManager,
  Query,
  UrlAdaptor,
  WebApiAdaptor,
  ODataAdaptor,
} from "@syncfusion/ej2-data";
import {
  GridComponent,
  GroupService,
  EditService,
  ToolbarService,
  PageService,
  ColumnChooserService,
  EditSettingsModel,
  ToolbarItems,
  GridLine,
  SearchSettingsModel,
  Column,
  valueAccessor,
  ValueAccessor,
  SortService,
} from "@syncfusion/ej2-angular-grids";
import { EventArgs } from "@syncfusion/ej2-navigations";
import { Slider } from "@syncfusion/ej2-inputs";
import {verifyDelegateUserControl} from '../../shared/services/index'
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
let infoPane;
// CommonJS
import "sweetalert2/src/sweetalert2.scss";
import { TimeSheetService } from "../../services/timesheet.service";
import { TaskService } from "../../services/task.service";
import { MatTableDataSource } from "@angular/material";
import { TeamService } from "../../services/team.service";
import { EmployeeService } from "../../services/employee.service";
import { DesignationService } from "../../services/designation.service";
import { DepartmentService } from "../../services/department.service";
import { UserService } from "../../services/user.service";
import { AdministrativeService } from "../../services/administrative.service";
import { GoogleMap } from "@agm/core/services/google-maps-types";
import { ActivityService } from "../../services/activity.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ProjectService } from "../../services/project.service";
import { ThemePalette } from "@angular/material/core";
import { ProgressSpinnerMode } from "@angular/material/progress-spinner";
import { OrganizationService } from "../../services/organization.service";
import { LeaveService } from "../../services/leave.service";
import { LeadService } from "../../services/lead.service";
import { QuotationService } from "../../services/quotation.service";
import { CostService } from "../../services/cost.service";
import { NotificationService } from "../../services/notification.service";
import { HistoryService } from "../../services/history.service";

import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";
import { PlatformDetectionService } from "../../platform-detection.service";
import { getDeviceId } from "../../shared/services";

declare let google: any;
let user_info: object;
if (localStorage.getItem("user_info")) {
  user_info = JSON.parse(localStorage.getItem("user_info"));
}
let start = document.getElementById("start");
interface EntityLocation {
  latitude: string | null;
  longitude: string | null;
}

interface EntityCustomer {
  id: string;
  org_id: string;
  cst_name: string;
  cst_type: string | null;
  first_name: string;
  last_name: string;
  is_company: boolean;
  company_name: string | null;
  annual_revenue: number | null;
  no_of_emp: number | null;
  industry_id: string;
  website: string;
  email: string;
  phone_iso_name: string;
  phone: string;
  adr: string;
  street: string;
  country: string;
  city: string;
  created_date: string;
  createdby: string;
  modified_date: string | null;
  modifiedby: string | null;
  is_deleted: boolean;
  entityContact: any; // Assuming entityContact exists as well
}

interface ProjectData {
  entityLocation: EntityLocation | null;
  entityCustomer: EntityCustomer;
}
@Component({
  selector: "app-dashboard-user-new",
  templateUrl: "./dashboard-user-new.component.html",
  styleUrls: ["./dashboard-user-new.component.scss"],
  providers: [],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*", display: "block" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardUserNewComponent implements AfterViewInit, OnInit {
  //@ViewChildren(ClockPickerDirective)
  @ViewChild("closeBtn", { static: false }) closeBtn: ElementRef;
  @ViewChild("taskCloseBtn", { static: false }) taskCloseBtn: ElementRef;
  @ViewChild("actCloseBtn", { static: false }) actCloseBtn: ElementRef;
  @ViewChild("timeLogBtn", { static: false }) timeLogBtn: ElementRef;
  @ViewChild("detailCloseBtn", { static: false }) detailCloseBtn: ElementRef;

  //leave var
  probationperiodOver = false;
  probationperiodOverDate;
  probationperiodRunning = true;
  noLvprfAssign = false;
  assignedLeavesDataLength;
  assignedLeavesData: any;
  //leave var

  preRevisionCount = 0;
  currrentTaskText;

  errorTimeExcced = false;
  isProjectLoading = false;
  isProjectWithinRadius = false;
  radioOptionTime = [
    {
      id: 15,
      value: "15 minutes",
    },
    {
      id: 30,
      value: "30 minutes",
    },
    {
      id: 60,
      value: "60 minutes",
    },
    {
      id: 90,
      value: "90 minutes",
    },
  ];
  headerText = [{ text: "ATTENDENCE" }, { text: "ABSENT" }];
  errorTimeExccedOne = false;
  checkIfProjectTask = false;
  radioOptionTimeOne = [
    {
      id: 15,
      value: "15 minutes",
    },
    {
      id: 30,
      value: "30 minutes",
    },
    {
      id: 60,
      value: "60 minutes",
    },
    {
      id: 90,
      value: "90 minutes",
    },
  ];

  loadAPI: Promise<any>;
  public min: number = 0;
  public max: number = 100;
  public slidervalue: number = 30;
  public searchText: string = "";
  filterValue: string = "some";
  lowercase: boolean = false;
  // public ticks: Object =  { placement: 'After', largeStep: 20, smallStep: 10, showSmallTicks: true };
  // public tooltip: Object = { placement: 'Before', isVisible: true, showOn: 'Always' };
  public tooltipData: Object = {
    placement: "Before",
    isVisible: true,
    showOn: "Always",
    format: "P0",
  };
  public ticksData: Object = {
    placement: "After",
    largeStep: 0.2,
    smallStep: 0.1,
    showSmallTicks: true,
    format: "P0",
  };

  color: ThemePalette = "primary";
  mode: ProgressSpinnerMode = "determinate";
  value = 50;
  public appearance = Appearance;
  public circleRadius = 100;
  displayedColumns = [
    "Employees",
    "Job",
    "CheckIn",
    "CheckOut",
    "Hours",
    "Action",
  ];
  displayedEmpColumns = ["index", "Job", "CheckIn", "CheckOut", "Action"];
  displayedActivityColumns = [
    "index",
    "Task",
    "StartTime",
    "EndTime",
    "Billable",
  ];
  dataSource: any;
  title: string = "AGM project";
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  @ViewChild("search", { read: ElementRef, static: false })
  searchElementRef: ElementRef;
  @ViewChild(AgmMap, { static: true })
  map: GoogleMap;
  public selectedAddress: PlaceResult;
  public dateValue: Date = new Date();
  public format: string = "dd-MMM-yy";
  showProjDesc = false;
  public checkin = true;
  public breakin = false;
  public breakout = false;
  public checkout = false;
  datePickerSpan = false;
  toolbarbottom;
  addressFromMpbox = "";

  //clock variable
  clockTimerDiv = false;
  noClockTimerDiv = true;
  timerSecondsValue = 0;
  timerSecondsFinalValue = 0;
  //  Leave Management

  commonDateRangeForm: FormGroup;
  public today: Date = new Date(new Date().toDateString());
  public maxRangeDate: Date = this.today;
  public monthStart: Date = new Date(
    new Date(new Date().setDate(1)).toDateString()
  );
  public monthEnd: Date = this.today;
  public lastStart: Date = new Date(
    new Date(
      new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)
    ).toDateString()
  );
  public lastEnd: Date = this.today;
  public yearStart: Date = new Date(
    new Date(new Date().setDate(new Date().getDate() - 365)).toDateString()
  );
  public yearEnd: Date = this.today;

  getHeaderValue = "ATTENDENCE";
  startDateSend = moment().format("L");
  endDateSend = moment().format("L");

  //attendance
  attendanceOverwriteReasonIDYesNO = false;
  attendanceReasonOtherValue = false;
  public attendanceData: object[];
  public absentData: object[];

  public absentDataCloud: object[];

  @ViewChild("timerReference", { static: false }) public timerReference;

  panels = [
    {
      title: "panel 1",
      content: "content 1",
    },
    {
      title: "panel 2",
      content: "content 2",
    },
  ];

  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty("detailRow");
  expandedElement: any;
  displayedColumns2 = ["position", "name", "weight"];
  // dataSource2 = new ExampleDataSource();

  form: FormGroup = this.formBuilder.group({ time: [""] });

  public date = moment().format("dddd, D MMM YYYY");
  public currentDestTime;
  public paused = false;
  public selectedText = "Select";
  public showDetails = false;
  public showModals = false;
  public isChecked = false;
  public showAdminTasks = false;
  public editTeam = false;
  private el: ElementRef;
  // time = {hour: 13, minute: 30};
  public id: number;
  public startValue: string;
  public selectedPurpose: string;
  public selectedProject: string;
  public selectedTask: string;
  public selectedActivity: string;
  public teamValue: any;
  public teamAddSubmit: any;
  public soloSubmit: any;

  public showPurpose = false;
  public showTask = false;
  public showActivities = false;
  public showTeamSelect = false;
  public showComments = false;

  public projectData: Array<Select2OptionData>;
  public taskData: Array<Select2OptionData>;
  public activityData: Array<Select2OptionData>;
  public teamData: Array<Select2OptionData>;
  public teamMembersData: Array<Select2OptionData>;
  public tasksList: Array<Select2OptionData>;
  public projTaskData: Array<Select2OptionData>;

  public employeeData: Array<Select2OptionData>;
  public othersData: Array<Select2OptionData>;
  public options: Select2Options;
  public otherOptions: Select2Options;
  public teamOptions: Select2Options;
  public activityOptions: Select2Options;
  public jobOptions: Select2Options;
  public deptOptions: Select2Options;
  public taskDescOptions: Select2Options;
  public deptData: Array<Select2OptionData>;
  public desgnData: Array<Select2OptionData>;
  public selectedCategData: Array<Select2OptionData>;
  public selectedSubTaskData: Array<Select2OptionData>;

  public purposeValue: any;
  public projectValue: any;
  public taskValue: any;
  public othersDataValue: any;
  public officeDataValue = "";
  public activityValue: any;
  public employeeValue: any;
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
  public keyword = "name";
  public checkIn = "";
  public checkOut = "";
  public expandRow = false;
  public taskCompletedList;
  public taskOpenList;
  public taskInProgressList;
  public checkInTime;
  public checkOutTime;
  public systemidText;
  public showMap = true;
  searchField;
  public showprojTask = false;
  public startValChange = false;
  public endValChange = false;

  public teamMembers = [];
  public teamMemFetchData = [];
  public teams = [];

  public teamsValFetchData = [];
  public teamEmpName;
  public filterEmpByDesgn = false;
  public filterEmpByDept = false;
  public filterEmpByFreeLanc = false;
  public filterEmpByOutsource = false;
  public group_id;
  public teamCheckIn = false;

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
  public showNearbyPlaces = false;
  public chosenTime = "";
  public disableEndTime = true;
  public xpandStatus = true;
  public disableAddLog = true;
  public disableAddTask = true;

  public placeDiv;
  public officeHomeDiv;
  public addTeamDiv = true;

  public groupOptions: Object;
  // public pageSettings: Object;
  public refresh: Boolean;
  @ViewChild("grid", { static: false })
  public grid: GridComponent;
  // @ViewChild('alertDialog')
  // public alertDialog: DialogComponent;
  public alertHeader: string = "Grouping";
  public hidden: Boolean = false;
  public target: string = ".control-section";
  public alertWidth: string = "300px";
  public alertContent: string = "Grouping is disabled for this column";
  public showCloseIcon: Boolean = false;
  public animationSettings: Object = { effect: "None" };

  public empList = [
    { name: "Sazid" },
    { name: "Hifza K" },
    { name: "Jacob" },
    { name: "Nick" },
  ];
  meetingTaskData = [
    {
      id: "",
      text: "Select",
    },
    {
      id: 1,
      text: "Meeting",
    },
    {
      id: 2,
      text: "Call",
    },
  ];
  relatedToData = [
    {
      id: "",
      text: "Select",
    },
    {
      id: 1,
      text: "Lead",
    },
    {
      id: 2,
      text: "Estimation",
    },

    {
      id: 3,
      text: "Quotation",
    },
    {
      id: 4,
      text: "Project",
    },
    {
      id: "NA",
      text: "NA",
    },
  ];
  public categData = [
    {
      id: "",
      text: "Select",
    },
    {
      id: 1,
      text: "Projects",
    },
    {
      id: 2,
      text: "Complain",
    },

    {
      id: 3,
      text: "Location",
    },
  ];
  /* public officeData = [
  {
    id: '1',
    text: 'Interfuture'
  },
  {
    id: '2',
    text: 'BinSalem'
  },


]; */
  public officeData = [];
  public data = [
    {
      id: "1",
      text: "J/988 E1",
    },
    {
      id: "2",
      text: "J/987 E2",
    },
    {
      id: "3",
      text: "J/989 E3",
    },
    {
      id: "4",
      text: "J/985 E4",
    },
  ];
  complainData = [
    {
      id: "1",

      prfix: "COM/19/12/006",
      text: "Case",
    },
    {
      id: "2",
      prfix: "COM/20/12/007",
      text: "Case",
    },
    {
      id: "3",
      prfix: "COM/21/12/008",
      text: "Case",
    },
    {
      id: "4",
      prfix: "COM/22/12/010",
      text: "Case",
    },
  ];
  tasks = [];
  assignedData = [
    {
      id: "1",
      text: "Assignee 1",
    },
    {
      id: "2",
      text: "Assignee 2",
    },
    {
      id: "3",
      text: "Assignee 3",
    },
  ];
  // configA: ClockPickerConfig = { initialValue:this.time};
  // configB: ClockPickerConfig = { };

  public timeLogForm: FormGroup;
  editable: boolean;
  editDeptId: any;
  isCheckout = false;
  isCheckIn = false;
  desgnEmpValue: any;
  deptEmpValue: any;
  deptValue: any;
  teamMemberValue: any;

  empDataSource: any;
  activityDataSource: MatTableDataSource<any>;
  teamCount: any;
  selectedCategText = "empty";
  currentCheckin: any;
  diffTime: any;
  selectedGroupVal = "empty";
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
  changed_address: string;
  activityGroupID: any;
  officeInput: boolean;
  manualInput: boolean;
  teamLocAdd: boolean;
  manualInputValue = "";
  teamEmpId = [];
  selecteOptionValue = "";
  /* nearbyPlaces: { id: string; text: string; }[]; */
  nearbyPlaces = [];
  nearbyAddress = "";
  showPurposeTasks: boolean;
  act_proj_name: any;
  act_sys_name: any;
  showPurposeToggle: boolean;
  act_formatted_address: any;
  act_purposeValue: any;
  startTime: string;
  endTime: string;
  billable = false;
  searchLocVal: any;
  AdminTaskValue = "";
  ActTaskValue: any;
  orgList: any;
  selectedValue = "";
  checkOptionValue: boolean;
  OrgId: string;
  taskStatusData: { id: string; text: string }[];
  taskStatus: any;
  tasktobeUpdated: any;
  assignedToList: any;
  employeeTasksList = [];
  adminData: { id: string; text: string; children: any[] }[];
  showActivityTasks = false;
  geo_address: any;
  public selectedActivGroupVal = "empty";
  selectedActivCategData: { id: string; text: string }[];
  activModel: any;
  systemid: any;
  activtasksList: { id: string; text: string }[];
  acttaskListValue = "";
  projTaskDataValue = "";
  projTaskDataText: any;
  officeActListValue: any = "";
  ActTaskLogForm: FormGroup;
  officetaskListValue = "";
  officetaskText: any;
  selectedJobData: { id: string; text: string }[];
  selecteJobOptionValue: any = "";
  officegroupID: any;
  actTextInputValue = "";
  remarksInputValue = "";
  minStartTime: any;
  maxEndTime: string;
  data12: Object[];
  public officeActInputValue = "";
  maxAddLogEndTime: string;
  minOfficeActInputTime: string;
  showTimeLogSpinner: boolean;
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
  public officeactText = "";
  projectId: void;
  startOfficTime: string;
  endOfficTime: string;
  projDesc: boolean = false;
  selectedentitiyLoc: any;
  currentPoslng: number;
  currentPoslat: number;
  projectPoslat: any;
  projectPoslng: any;
  drag: boolean = false;
  boundryContain: any;
  projectBorderContain: boolean = false;
  selectedOfficeId: any;
  routerSubscription: any;
  addOfficAdminAct: boolean = false;
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
  addActformSubmitted: any = false;
  recentTaskSel: boolean = false;
  recentAdminSel: boolean;
  recentActtxtSel: boolean = false;
  recentActSel: boolean;
  checkoutByEmpId: boolean = false;
  recentActAdminSel: boolean = false;
  recentActTaskSel: boolean = false;
  @ViewChild("empgrid", { static: false })
  @ViewChild("nearbyContainer", { static: false })
  nearbyContainer: ElementRef;

  empgrid;
  breakInTime: string;
  breakOutTime: string;
  testConfig: countUpTimerConfigModel;
  taskWithDesc: Array<Select2OptionData>;
  overDueList: any;
  enableTaskStatus: boolean = false;
  enableActTaskStatus: boolean = false;
  actTaskStatusValue: any = "";
  dateRangeForm: FormGroup;
  newdateRangeForm: FormGroup;
  leaveForm: FormGroup;
  leaveStatusData: any;
  leaveSetupid: any;
  leaveSetupData: any;
  leaveSpan: any;
  approverTaskValue: any;
  delegateControl: boolean=false;
  addleaveformSubmitted: boolean;
  approverData: { id: string; text: string }[];
  sick_used_leaves: number = 0;
  earned_used_leaves: number = 0;
  earned_remaining: number = 0;
  sick_remaining: number = 0;
  earnedLeaves: number = 0;
  casualLeaves: number = 0;
  earnedTimeOff: any;
  sickTimeOff: any;
  leavesEntitled: number = 0;
  showLeaveLogSpinner: boolean = true;
  empValue: any;
  empSelDisabled: boolean = false;
  approvedLeaves: any[];
  empjoinedDate: any;
  used_leaves: number;
  availableLeaves: number;
  showLeavesSpin: boolean = true;
  showLeaveInfo: boolean;
  leaveHistory: Object[];
  showSlider: boolean = false;
  sliderForm: FormGroup;
  meetingTaskValue: any = "";
  meetingTaskValueTxt: any;
  relatedValue: any = "";
  typeData: { id: string; text: string }[];
  typeName: string;
  typeValue = "";
  showMeetingAct: boolean = false;
  subtxtSel: boolean;
  subTextInputValue: any;
  milestone_Name: boolean;
  taskProjectId = "";
  leadSourceData: any;
  relatedSearchToolbar: string[];
  initialSort: { columns: { field: string; direction: string }[] };
  estSourceData: any;
  projSourceData: any;
  qtnSourceData: any;
  closeActLog: boolean = true;
  officeSubtaskListValue: any;
  projSubTaskData = [];
  officeSubtaskText: any;
  projSubtaskListValue: any;
  projSubtaskText: any;
  recentSubTaskSel: boolean = false;
  sub_taskId = "";
  showProjBasedTasks: boolean = false;
  inProgressStatID: any;
  underReviewStatID: any;
  allowUpdateStatus: boolean = false;
  openStatID: any;
  homeInput: boolean;
  homeInputValue: string;
  allowOfficUpdateStat: boolean;
  completedStatID: any;
  completedList: any[];
  timeinrange: boolean = true;
  selectedJobFilterData: {
    id: string;
    text: string;
    additional: { teamBy: string };
  }[];
  jobFilterValue: any = "";
  jobFilterOptions: { placeholder: string; width: string };
  activityFilterOptions: { placeholder: string; width: string };
  taskFilterOptions: { placeholder: string; width: string };
  milestFilterList: { id: string; text: string }[];
  activityFilterValue: any = "";
  taskFilterValue: any = "";
  projectFilterListByEmp: {
    id: string;
    text: string;
    additional: { teamBy: string };
  }[];
  offcboundryContain: any;
  typeOfCheckin: any;
  offcMeetingTaskValue: any = "";
  addteamMem: boolean;
  adjustedBalance: number;
  startEqualEnd: boolean;
  offcStartEqualEnd: boolean;
  isDisableTask: boolean = false;
  //datepick
  /* const today = new Date()
  const yesterday = new Date(today)

yesterday.setDate(yesterday.getDate() - 1)


console.log(yesterday) */

  //task histroy var
  taskHistoryData = [];
  showRemarkError = false;

  //checkin model variable
  userlatitudelongitude;
  tabValueSelected = "";

  casetabValueSelected = "";
  selectedCase: any;

  //project checkin
  projectListing;
  projectCheckinDiv = false;
  showProjDetails = false;
  projectDataToBeDisplayed = {} as ProjectData;
  selectedPojectDetails;
  tag_id = "";
  //team
  showTeamMainDiv = false;

  //place
  placeCheckinDiv = false;
  caseCheckinDiv = false;
  officeWFHdiv = true;
  placediv = false;

  officeSelected = false;
  wfhSelected = false;

  typeText = true;

  caseTypes = [];
  caseAssigned = [];
  availCase = [];
  caseActivties = [];

  datePickerForm: FormGroup;
  public maxRangeDateNew: Date;
  employeeID;
  public dateValueNew = moment().format("ddd, D MMM YYYY");
  public constantDate = moment().format("L");
  public dateTextNew;
  employeePreviousDayActivitiesData;
  employeePreviousDayActivitiesProjectData: any = [];
  total_hrs_spent;
  empCheckIn;
  empLeftTime;
  empLateArrival;
  empLeaveEarly;
  empProductiveTime;
  empProductivity;
  empActivetyTime;
  empTimeSpend;

  allTaskList = [];
  allOpenTaskList = [];
  allOverDueTaskList = [];
  allAssignedTaskList = [];
  allCompletedTaskList = [];

  cgeoCodeData: any;
  public current_formatted_address;
  public current_street_number;
  public current_route;
  public current_locality;
  public current_administrative_area_level_2;
  public current_administrative_area_level_1;
  public current_postal_code;
  public current_country;
  current_address: any;
  allowDrag = true;

  dataBound() {
    if (this.refresh) {
      this.grid.groupColumn("dep_name");
      this.refresh = false;
    }
  }
  changedSliderValue(e) {}
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

  //leave functions

  getEmpLeaveAvailableByOrgId(emp_id) {
    return new Promise((resolve, reject) => {
      this.leaveService
        .getEmpLeaveAvailableByOrgId(emp_id)
        .subscribe((res: any) => {
          if (res != null) {
            resolve(res);
          } else {
            reject(false);
          }
        });
    });
  }

  checkforProbationPeriod() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let result = this.getEmpLeaveAvailableByOrgId(user_info.id);
    result
      .then((value: any) => {
        if (value.length < 0) {
          return;
        }
        // Get Leave Profile Details
        this.leaveService
          .getLeaveProfileSetupByOrgIDandId(value[0].leave_profile_setup_id)
          .subscribe((res: any) => {
            if (res != null) {
              this.checkUserCanApplyForleave(
                value[0].profile_effective_from_date,
                res[0].is_leave_on_probation
              );
            } else {
              console.log("Invalid Proile Id");
            }
          });
      })
      .catch((error) => {
        this.noLvprfAssign = true;
        this.probationperiodRunning = this.probationperiodRunning
          ? false
          : this.probationperiodRunning;
        console.log("No Setup For Selected Employee");
      });
  }

  checkUserCanApplyForleave(profileStartDate, canUserApplyLeaveOnProb) {
    let userInfo = JSON.parse(localStorage.getItem("user_info"));
    let DateToConsider =
      profileStartDate !== null ? userInfo.joined_date : profileStartDate;
    this.leaveService
      .getEmpLeaveAvailableByOrgId(userInfo.id)
      .subscribe((data: any) => {
        console.log("gstshhshshshsh", data);
        let toCall = data[0].is_modified;
        if (!canUserApplyLeaveOnProb) {
          let DateToConsiderProcess = new Date(DateToConsider);
          let currentDate = new Date();
          DateToConsiderProcess.setMonth(DateToConsiderProcess.getMonth() + 6);
          let applyDate = DateToConsiderProcess;
          console.log("gstshhshshshsh", applyDate, currentDate);
          if (applyDate >= currentDate) {
            console.log("no");
            this.probationperiodRunning = true;
            this.probationperiodOver = false;
            this.probationperiodOverDate = applyDate;
          } else {
            console.log("yes");
            this.probationperiodRunning = false;
            this.probationperiodOver = true;
            if (toCall === true) {
              this.fetchEmployeeLeaveEmpID();
            } else {
              this.UpdateAvailableLeaves(userInfo.id);
            }
          }
        } else {
          console.log("can apply");
          this.probationperiodRunning = false;
          this.probationperiodOver = true;
          console.log(toCall);
          if (toCall === true) {
            this.fetchEmployeeLeaveEmpID();
          } else {
            this.UpdateAvailableLeaves(userInfo.id);
          }
        }
      });
  }

  fetchEmployeeLeaveEmpID() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    this.leaveService
      .getEmpLeaveAvailableByOrgId(user_info.id)
      .subscribe((data: any) => {
        let annualLeave = [];
        data.map((elm) => {
          if (elm.leave_name === "Annual leave") {
            annualLeave.push(elm);
          }
        });
        let availableLeaveDays = Number(annualLeave[0].available_leave_days);
        this.assignedLeavesDataLength = data;
        if (this.assignedLeavesDataLength !== 0) {
          let avaDaysDefault = availableLeaveDays;
          let avaDaysPrv = Math.trunc(avaDaysDefault);
          //console.log(avaDaysPrv)
          if (avaDaysDefault < 0) {
            this.assignedLeavesData = annualLeave[0];
            annualLeave[0]["available_leave_days_new"] =
              annualLeave[0].available_leave_days;
          } else {
            let avaDaysNex = availableLeaveDays % 1;
            let newValue;
            if (avaDaysNex > 0.5) {
              newValue = avaDaysPrv + 1;
              annualLeave[0]["available_leave_days_new"] = newValue;
              this.assignedLeavesData = annualLeave[0];
            } else if (avaDaysNex === 0) {
              newValue = avaDaysPrv;
              annualLeave[0]["available_leave_days_new"] = newValue;
              this.assignedLeavesData = annualLeave[0];
            } else {
              newValue = avaDaysPrv + 0.5;
              annualLeave[0]["available_leave_days_new"] = newValue;
              this.assignedLeavesData = annualLeave[0];
            }
          }
        }
      });
  }

  UpdateAvailableLeaves(userID) {
    console.log("call", userID);
    let reqbody = {
      id: userID,
    };
    this.leaveService.UpdateAvailableLeaves(reqbody).subscribe((data: any) => {
      //console.log(data)
      if (data.status === "200") {
        this.fetchEmployeeLeaveEmpID();
      }
    });
  }

  //leave functions

  public getAllEmployeeList() {
    this.empService.getEmployeeByOrgId().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];
        var empresults = [{ id: "", text: "Select" }];

        // let dataObj = JSON.parse(data['token']);
        //
        let user_info = JSON.parse(localStorage.getItem("user_info"));

        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          if (user_info["id"] != data[i].id) {
            results.push({
              id: data[i].id,
              text: data[i].first_name,
            });
          }
        }
        this.empValue = user_info["id"];
        if (user_info["is_superadmin"] == true) {
          this.empSelDisabled = false;
        }
        if (
          user_info["is_admin"] == true &&
          user_info["is_superadmin"] == false
        ) {
          this.empSelDisabled = false;
        }
        if (
          user_info["is_admin"] == false &&
          user_info["is_superadmin"] == false
        ) {
          this.empSelDisabled = true;
        }
        for (var i = 0; i < data.length; i++) {
          empresults.push({
            id: data[i].id,
            text: data[i].first_name,
          });
        }

        this.employeeData = empresults;
        this.approverData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  findEmpLeaveHistory(postData) {
    this.leaveService.FetchEmployeeLeaveHistoryEmpID(postData).subscribe(
      (data: any) => {
        if (data) {
          let datas = new DataManager(data);
          this.leaveHistory = datas.dataSource["json"];
          this.toolbar = ["Search"];
        } else {
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  findJoiningDate(postData) {
    let joinedDate = "";
    this.showLeavesSpin = true;
    this.empService.getByEmployeeID(postData).subscribe(
      (data: any) => {
        if (data) {
          this.showLeavesSpin = false;

          if (data.joined_date == null || data.joined_date == "") {
            this.showLeaveInfo = false;
          } else {
            this.showLeaveInfo = true;
          }
          this.empjoinedDate =
            data.joined_date != null
              ? moment(data.joined_date).format("L")
              : null;
        } else {
          this.empjoinedDate = null;
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public changedEmp(e) {
    this.empValue = e.value;
    if (e.value != "") {
      let postData = {
        id: e.value,
      };
      this.findJoiningDate(postData);

      this.findEmpLeaveHistory(postData);
      this.showLeavesSpin = true;
      setTimeout(() => {
        /** spinner ends after 5 seconds */

        return this.leaveService.FetchEmployeeLeaveEmpID(postData).subscribe(
          (data: any) => {
            // let dataObj = JSON.parse(data['token']);

            let used_leaves = 0;

            if (data) {
              let approved = [];
              // let dataObj = JSON.parse(data['token']);
              //

              for (var i = 0; i < data.length; i++) {
                // logik to create new items

                if (data[i].leave_status_name == "Approved") {
                  approved.push(data[i]);
                }
              }
              this.approvedLeaves = approved;
              used_leaves = approved.reduce(function (sum, record) {
                if (record.leave_days != "")
                  return sum + parseInt(record.leave_days);
                else return sum;
              }, 0);
            } else {
              used_leaves = 0;
            }

            this.used_leaves = used_leaves;
            if (this.empjoinedDate !== null && this.empjoinedDate !== "") {
              let joinedDate = this.empjoinedDate;
              let currentDate = moment().format("L");
              var diff = moment(currentDate).diff(moment(joinedDate), "month");
              let earnedLeaves = diff * this.earnedTimeOff;
              let casualLeaves = this.sickTimeOff * moment().month() + 1;

              this.leavesEntitled = earnedLeaves;

              this.availableLeaves = this.leavesEntitled - this.used_leaves;
              this.showLeavesSpin = false;
            }
            // this.router.navigate(["/organizations"]);
            this.FetchEmployeeLeaveAdjustmentEmpID();
          },
          (error) => {
            Swal.fire("Error!", "Error.", "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        );
      }, 500);
    }
  }
  public FetchGridDataByDepartmentOrgID() {
    this.deptService.fetchGridDataByDepartmentOrgID().subscribe(
      (data: any) => {
        //  let dataObj = JSON.parse(data['token']);

        let datas = new DataManager(data);
        this.data12 = datas.dataSource["json"];
        this.groupOptions = {
          showGroupedColumn: false,
          showDropArea: false,
          columns: ["dep_name", "alias"],
        };
        this.pageSettings = { pageSizes: true, pageCount: 5 };
        this.toolbar = ["Search"];
        //  this.searchOptions = { fields: ['dep_name'], operator: 'contains', key: 'Ha', ignoreCase: true };
        this.dataSource = new MatTableDataSource(data);
        //  this.compData = data;
        //  this.gridComp.dataSource = data;
        //  this.gridComp.allowPaging = false;
        //  this.gridComp.pageSettings = { pageSize: this.compData.length };
        //  this.gridComp.columns = this.displayedColumns;
        // this.dataSource.paginator = this.paginator;
        //  this.dataSource.sort = this.sort;

        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;

        this.getGeoLocation(this.latitude, this.longitude);
      });
    }
  }

  getCasesTypesByOrgId() {
    this.empService.getCaseTypeByOrgId().subscribe((res: any) => {
      let result = [];
      res.map((elm) => {
        if (elm.is_checkIn_required) {
          result.push(elm);
        }
      });
      this.caseTypes = result;
    });

    this.empService.getCaseAssignedByEmpId().subscribe((resNum: any) => {
      console.log("Justin", resNum);
      this.caseAssigned = resNum;
    });
  }

  getPreviousCaseActivity(id) {
    console.log("id--->", id);

    this.empService.getCaseActivityHistoryById(id).subscribe((res: any) => {
      this.caseActivties = res;
    });
  }

  onCaseValueChange(caseSel) {
    this.casetabValueSelected = caseSel;

    let assignedCase = this.caseAssigned.filter(
      (itm) => itm.case_name === caseSel
    );
    if (assignedCase) {
      this.selectedCase = this.caseAssigned[0];
      this.getPreviousCaseActivity(this.selectedCase["id"]);
    }

    let results = [];

    assignedCase.map((elm) => {
      results.push({
        id: elm.id,
        text: elm.case_description,
        additional: {
          teamBy: elm.reported_by,
        },
      });
    });
    this.availCase = results;
    // console.log(" this.caseAssigned--->", assignedCase);
  }

  caseSelectChang(event) {
    let selectedVal = this.caseAssigned.filter((itm) => itm.id === event.value);
    if (selectedVal) {
      this.selectedCase = selectedVal[0];
      this.getPreviousCaseActivity(this.selectedCase["id"]);
    }
  }

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
  public onAutocompleteSelected(result: PlaceResult) {}

  public onLocationSelected(location: Location) {
    this.latitude = location.latitude;
    this.longitude = location.longitude;
  }

  public onGermanAddressMapped($event: GermanAddress) {}

  // markerDragEnd($event: MouseEvent) {

  //   this.latitude = $event.coords.lat;
  //   this.longitude = $event.coords.lng;
  //   if (navigator)
  //   {
  //   navigator.geolocation.getCurrentPosition( pos => {
  //     this.currentPoslng = +pos.coords.longitude;
  //     this.currentPoslat = +pos.coords.latitude;
  //     });

  //   }
  //   this.drag=true

  //   this.projectPoslat =  $event.coords.lat;
  //   this.projectPoslng = $event.coords.lng ;
  //   this.SetPosition( $event.coords.lat, $event.coords.lng);
  //   this.getAddress(this.latitude, this.longitude);

  // }

  public getChangedMatchedTypes() {
    let address_components;
    if (this.changedLocationData.length != 0) {
      address_components = this.changedLocationData["address_components"];
    }

    let i, j, types;
    let address_component;
    // Loop through the Geocoder result set. Note that the results
    // array will change as this loop can self iterate.
    for (i = 0; i < address_components.length; i++) {
      types = address_components[i]["types"];

      for (j = 0; j < types.length; j++) {
        if (types[j] == "street_number") {
          this.changed_street_number = address_components[i]["short_name"];
        }
        if (types[j] === "route") {
          this.changed_route = address_components[i]["long_name"];
        }
        // if (types[j] === 'formatted_address') {
        //   this.formatted_address =  address_components[i]['long_name'];
        // }
        // if (types[j] === 'neighborhood') {
        //   this.changed_street_number =  address_components[i]['long_name'];
        // }
        if (types[j] === "locality") {
          this.changed_locality = address_components[i]["long_name"];
        }
        if (types[j] === "administrative_area_level_1") {
          this.changed_administrative_area_level_1 =
            address_components[i]["long_name"];
        }
        if (types[j] === "administrative_area_level_2") {
          this.changed_administrative_area_level_2 =
            address_components[i]["long_name"];
        }
        if (types[j] === "postal_code") {
          this.changed_postal_code = address_components[i]["long_name"];
        }
        if (types[j] === "country") {
          this.changed_country = address_components[i]["long_name"];
        }
      }
    }

    // address_component = address_components[element];
  }
  public FetchTimeOffSetupOrgID() {
    this.leaveService.FetchTimeOffSetupOrgID().subscribe(
      (data: any) => {
        if (data.length != 0) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].timeoff_type_name == "Earned") {
              this.earnedTimeOff = data[i].timeoff_type_earned;
            } else {
              this.sickTimeOff = data[i].timeoff_type_earned;
            }
          }
          let user_info = JSON.parse(localStorage.getItem("user_info"));
          if (user_info["joined_date"] != null) {
            let joinedDate = moment(user_info["joined_date"]).format("L");
            let currentDate = moment().format("L");
            var diff = moment(currentDate).diff(moment(joinedDate), "month");
            this.earnedLeaves = diff * this.earnedTimeOff;
            this.casualLeaves = this.sickTimeOff * moment().month() + 1;

            this.leavesEntitled = this.earnedLeaves;
            setTimeout(() => {
              this.fetchEmpLeave();
            }, 500);
          }
        } else {
          this.showLeaveLogSpinner = false;
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public fetchEmpLeave() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    // if(user_info['id']!=data[i].id){

    let postData = {
      id: user_info["id"],
    };
    return this.leaveService.FetchEmployeeLeaveEmpID(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        this.showLeaveLogSpinner = true;
        if (data.length != 0) {
          let approved = [];
          let used_leaves = 0;
          let earned_used_leaves = 0;
          // let dataObj = JSON.parse(data['token']);
          //

          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            if (data[i].leave_status_name == "Approved") {
              approved.push(data[i]);
            }
          }
          used_leaves = approved.reduce(function (sum, record) {
            if (record.leave_days != "" && record.leave_name == "Sick Leave")
              return sum + parseInt(record.leave_days);
            else return sum;
          }, 0);
          earned_used_leaves = approved.reduce(function (sum, record) {
            if (record.leave_days != "" && record.leave_name != "Sick Leave")
              return sum + parseInt(record.leave_days);
            else return sum;
          }, 0);
          this.sick_used_leaves = used_leaves;
          this.earned_used_leaves = earned_used_leaves;
          this.earned_remaining = this.earnedLeaves - earned_used_leaves;
          this.sick_remaining = this.casualLeaves - used_leaves;

          this.showLeaveLogSpinner = false;
          this.FetchEmployeeLeaveAdjustmentEmpID();
        } else {
          this.showLeaveLogSpinner = false;
        }
        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", "Error.", "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public openStatusModal(item) {
    this.taskStatus = item.status_id;
    console.log("status_name", item.status_name);

    let user = JSON.parse(localStorage.getItem("user_info"));

    if (item.assigned_to == user["id"] || item.assigned_to == "Anyone") {
      this.enableTaskStatus = false;
    } else {
      this.enableTaskStatus = true;
    }
    $("#task_status_modal").modal("show");
    this.tasktobeUpdated = item;
    this.getAllStatus();
  }
  public changedStatus(e: any): void {
    this.taskStatus = e.value;
  }
  public AddTeamMembers() {
    this.addteamMem = true;
    console.log("teamMemberValue", this.teamMemberValue);
    if (this.teamMembers.length == 0) {
      if (this.teamMemberValue != "" && this.teamMemberValue != undefined) {
        this.teamMembers.push(this.teamMemberValue);

        let teamEmpId = {
          ID: this.teamMemberValue,
        };
        this.empService
          .empDepartDesignByEmpID(teamEmpId)
          .subscribe((data: any) => {
            this.teamMemFetchData.push({ data });

            this.checkedValues();
          });
      }
    } else {
      if (this.teamMemberValue != "") {
        if (
          !this.teamMembers.includes(
            this.teamMemberValue && this.teamMemberValue != undefined
          )
        ) {
          this.teamMembers.push(this.teamMemberValue);

          // logik to create new items
          let teamEmpId = {
            ID: this.teamMemberValue,
          };

          this.empService
            .empDepartDesignByEmpID(teamEmpId)
            .subscribe((data: any) => {
              // this.teamMemFetchData.push(data[0]);
              this.teamMemFetchData.push({ data });

              // this.empDataSource=new MatTableDataSource(data);

              this.checkedValues();
            });
        }
      } else if (this.teamMemberValue != "") {
        Swal.fire(
          "Error!",
          this.teamEmpName + "has already been added.Please add other employee",
          "error"
        ).then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    }
  }
  public AddTeams() {
    let teamsValFetchData = [];
    if (this.teams.length == 0) {
      this.teams.push(this.teamValue[0]);

      let teamEmpId = {
        ID: this.teamValue[0],
      };
      this.empService
        .FindEmpDepartDesignByTeamID(teamEmpId)
        .subscribe((data: any) => {
          data.forEach((element) => {
            this.teamsValFetchData.push(element);
            teamsValFetchData = this.teamsValFetchData;
            this.teamMemFetchData.push(element);
          });

          this.checkedValues();
        });
    } else {
      let teamsValFetchData = [];
      this.teamValue.forEach((element) => {
        if (!this.teams.includes(element)) {
          this.teams.push(element);

          let teamEmpId = {
            ID: element,
          };
          this.empService
            .FindEmpDepartDesignByTeamID(teamEmpId)
            .subscribe((data: any) => {
              data.forEach((element) => {
                this.teamsValFetchData.push(element);
                teamsValFetchData = this.teamsValFetchData;
                // this.teamMemFetchData.push(element);
              });

              const result = [];
              const map = new Map();
              for (const item of this.teamsValFetchData) {
                if (!map.has(item.id)) {
                  map.set(item.id, true); // set any value to Map
                  result.push({
                    id: item.id,
                    full_name: item.full_name,
                    employee_type_name: item.employee_type_name,
                    designation_name: item.designation_name,
                  });
                } else {
                  Swal.fire(
                    "Error!",
                    item.full_name +
                      "has already been added.Please add other employee",
                    "error"
                  ).then(
                    //used Arrow function here
                    (result) => {
                      //  this.router.navigate(['/dashboard']);
                    }
                  );
                }
              }

              this.teamMemFetchData = result;

              this.checkedValues();
            });
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
  public teamDelete(id) {
    for (var i = 0; i < this.teamMemFetchData.length; i++) {
      if (
        (this.teamMemFetchData[i].data
          ? this.teamMemFetchData[i].data.id
          : this.teamMemFetchData[i].id) == id
      ) {
        this.teamMemFetchData.splice(i, 1);
        this.teamMembers.splice(id, 1);
        //

        this.teams.splice(id, 1);
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
  public changedEmpCateg(e) {
    this.selectedCategText = e.value;
    if (this.selectedCategText == "1") {
    } else if (this.selectedCategText == "2") {
    } else {
    }
  }
  public changedEmpTask(e) {
    this.selectedTaskText = e.value;
    this.taskCategValue = e.data[0].text;
    if (this.selectedTaskText == "1") {
      this.selectedSubTaskData = this.data;
    } else if (this.selectedTaskText == "2") {
      this.selectedSubTaskData = this.complainData;
    } else {
      this.selectedSubTaskData = this.data;
    }
  }

  public changedSubTask(e: any) {
    // this.selecteSubTaskValue='value';
    this.selecteSubTaskValue = e.data[0].text;
    // this.showAdminTasks=true;
  }
  public changedOption(e: any) {
    console.log("changedOption", e);
    this.selectedText = "value";
    this.systemidText = e.data[0].text;
    this.systemid = e.value;
    this.selecteOptionValue = e.value;
    this.projDesc = false;
    if (navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.currentPoslng = +pos.coords.longitude;
        this.currentPoslat = +pos.coords.latitude;
      });
    }
    if (this.selectedGroupVal == "Job" && e.value) {
      this.FindByProjectID(e.value);
    } else {
      this.showProjDesc = false;
    }
    // this.showAdminTasks=true;
  }

  public FindLocationByEntityID(val) {
    //   this.AddNewSubmit=false;
    //   this.editable=true;
    // this.editTaskId=dept_id;
    // this.showTaskList=false;
    // this.showAddForm=true;
    let postData = {
      ID: val,
    };
    this.timeService.FindLocationByEntityID(postData).subscribe(
      (data: any) => {
        if (data) {
          this.getCurrentPoslatlng();
          this.SetPosition(data.lat, data.lang);
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
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public FindByProjectID(val) {
    //   this.AddNewSubmit=false;
    //   this.editable=true;
    // this.editTaskId=dept_id;
    // this.showTaskList=false;
    // this.showAddForm=true;
    let postData = {
      id: val,
    };
    this.projectService.FindByProjectID(postData).subscribe(
      (data: any) => {
        console.log("this->", data);
        this.showProjDesc = true;
        this.project_start_date = data.start_date ? data.start_date : "";
        this.project_end_date = data.end_date ? data.end_date : "";
        this.project_desc = data.project_desc ? data.project_desc : "";
        this.customerName = data.entityCustomer
          ? data.entityCustomer.cst_name
          : "";
        this.customerPhone = data.entityCustomer
          ? data.entityCustomer.phone
          : "";
        this.projectPoslat = data.entityLocation ? data.entityLocation.lat : "";
        this.projectPoslng = data.entityLocation
          ? data.entityLocation.lang
          : "";
        console.log(
          " this.projectPoslat",
          this.projectPoslat,
          this.projectPoslng
        );
        this.SetPosition(
          data.entityLocation ? data.entityLocation.lat : "",
          data.entityLocation ? data.entityLocation.lang : ""
        );
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
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public OffcSetPosition(projectPoslat, projectPoslang, eradius) {
    var contentCenter = '<span class="infowin">Center Marker </span>',
      contentA = '<span class="infowin">Marker A </span>';
    console.log("OffcSetPosition", projectPoslat, projectPoslang);
    console.log("currentLatitutude", this.latitude);
    var latLngCenter = new google.maps.LatLng(this.latitude, this.longitude),
      latLngCMarker = new google.maps.LatLng(this.latitude, this.longitude),
      latLngA = new google.maps.LatLng(projectPoslat, projectPoslang), //project loaction
      mapOptions = {
        center: latLngCenter,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      },
      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 19,
        center: latLngCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
      }),
      markerCenter = new google.maps.Marker({
        position: latLngCMarker,
        title: "Location",
        map: map,
        draggable: false,
      }),
      infoCenter = new google.maps.InfoWindow({
        content: contentCenter,
      }),
      markerA = new google.maps.Marker({
        position: latLngA,
        title: "Location",
        map: map,
        draggable: true,
      }),
      infoA = new google.maps.InfoWindow({
        content: contentA,
      }),
      circle = new google.maps.Circle({
        map: map,
        clickable: false,
        radius: eradius == null ? 200 : parseInt(eradius["radius"]),
        fillColor: "#fff",
        fillOpacity: 0.6,
        strokeColor: "#313131",
        strokeOpacity: 0.4,
        strokeWeight: 2,
        center: latLngCenter,
      });
    console.log("latLngA", latLngA);

    // circle.bindTo('center', markerCenter, 'position');

    const nyc = new google.maps.LatLng(this.latitude, this.longitude);
    const london = new google.maps.LatLng(projectPoslat, projectPoslang);
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      nyc,
      london
    );
    console.log(
      "distance",
      distance,
      eradius != null ? eradius["radius"] : eradius
    );
    var bounds = circle.getBounds();
    //noteA = jQuery('.bool#a');
    // noteA.text(bounds.contains(latLngA));
    if (eradius == null) {
      this.offcboundryContain = true;
    } else if (eradius != null && eradius["is_allowed"] == false) {
      this.offcboundryContain = true;
    } else if (eradius != null && eradius["is_allowed"] == true) {
      this.offcboundryContain = bounds.contains(latLngA);
    }
    console.log("offcboundryContain", this.offcboundryContain, eradius);
    //alert($(".bool#a").html());
  }

  public SetPosition(projectPoslat, projectPoslang) {
    var contentCenter = '<span class="infowin">Center Marker </span>',
      contentA = '<span class="infowin">Marker A </span>';

    var latLngCenter = new google.maps.LatLng(
        this.currentPoslat,
        this.currentPoslng
      ),
      latLngCMarker = new google.maps.LatLng(
        this.currentPoslat,
        this.currentPoslng
      ),
      latLngA = new google.maps.LatLng(projectPoslat, projectPoslang), //project loaction
      mapOptions = {
        center: latLngCenter,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      },
      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 19,
        center: latLngCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
      }),
      markerCenter = new google.maps.Marker({
        position: latLngCMarker,
        title: "Location",
        map: map,
        draggable: false,
      }),
      infoCenter = new google.maps.InfoWindow({
        content: contentCenter,
      }),
      markerA = new google.maps.Marker({
        position: latLngA,
        title: "Location",
        map: map,
        draggable: true,
      }),
      infoA = new google.maps.InfoWindow({
        content: contentA,
      }),
      circle = new google.maps.Circle({
        map: map,
        clickable: false,
        radius: 200,
        fillColor: "#fff",
        fillOpacity: 0.6,
        strokeColor: "#313131",
        strokeOpacity: 0.4,
        strokeWeight: 2,
      });

    circle.bindTo("center", markerCenter, "position");

    var bounds = circle.getBounds();
    //noteA = jQuery('.bool#a');
    // noteA.text(bounds.contains(latLngA));
    this.boundryContain = bounds.contains(latLngA);
    console.log("boundryContain", this.boundryContain);
    //alert($(".bool#a").html());
  }

  public changedOfficeSubTask(e: any): void {
    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    this.officeSubtaskListValue = e.value;
    console.log("officeSubtaskListValue", this.officeSubtaskListValue);
    if (
      this.officeSubtaskListValue != "" &&
      this.officeSubtaskListValue != "Select" &&
      this.officeSubtaskListValue != "null"
    ) {
      this.officeSubtaskText = e.data[0].text;
      let postData = {
        ID: this.officeSubtaskListValue,
      };
      this.projectService.FindBySubTaskssId(postData).subscribe((data: any) => {
        if (data) {
          console.log("FindBySubTaskssId", data);
          this.actTaskStatusValue = data.subTasks.status_id;
          if (data.subTasks.lead_id == user["id"]) {
            this.enableActTaskStatus = false;
          } else {
            this.enableActTaskStatus = true;
          }
          if (data.subTasks.status_id == this.openStatID) {
            this.allowOfficUpdateStat = true;
          } else {
            this.allowOfficUpdateStat = false;
          }
        }
      });
    }
  }
  public changedProjSubTask(e: any): void {
    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    this.projSubtaskListValue = e.value;
    this.projSubtaskText = e.data.length != 0 ? e.data[0].text : "";
    if (e.value != "") {
      this.recentSubTaskSel = false;
      // this.GetTop10TimesheetActivityOnTaskID(e.value);
    } else {
      this.recentSubTaskSel = true;
    }
    if (
      this.projSubtaskListValue != "" &&
      this.projSubtaskListValue != "Select" &&
      this.projSubtaskListValue != "null"
    ) {
      let postData = {
        ID: this.projSubtaskListValue,
      };
      this.projectService.FindBySubTaskssId(postData).subscribe((data: any) => {
        if (data) {
          console.log("FindBySubTaskssId", data);
          this.actTaskStatusValue = data.subTasks.status_id;
          if (data.subTasks.lead_id == user["id"]) {
            this.enableActTaskStatus = false;
          } else {
            this.enableActTaskStatus = true;
          }
          if (data.subTasks.status_id == this.openStatID) {
            this.allowUpdateStatus = true;
          } else {
            this.allowUpdateStatus = false;
          }
        }
      });
    }
  }
  public getAllDept() {
    this.deptService.getAllDept().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            results.push({
              id: data[i].id,
              text: data[i].dep_name,
            });
          }
        }

        this.deptData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public GetTop10TimesheetActivityOnTaskID(taskId) {
    let task = {
      ID: taskId,
    };
    return this.activityService
      .GetTop10TimesheetActivityOnTaskID(task)
      .subscribe((data: any) => {
        if (data) {
          this.selectedActivVal = "Activity";
        }

        this.activityDataSource = new MatTableDataSource(data);
        this.activityDataSource.connect().next(data);
      });
  }
  public GetTop10TimesheetAdminActivityOnGroupIDAndAdminID(groupId, adminId) {
    let task = {
      GroupID: groupId,
      AdministrativeID: adminId,
    };
    return this.activityService
      .GetTop10TimesheetAdminActivityOnGroupIDAndAdminID(task)
      .subscribe((data: any) => {
        if (data) {
          this.selectedActivVal = "Activity";
        }

        this.activityDataSource = new MatTableDataSource(data);
        this.activityDataSource.connect().next(data);
      });
  }

  //get All Admin
  public GetAllAdministrative() {
    var results = [];
    var results12 = [];
    var adminDeptTask = [];

    this.adminService.GetAdministrativeByOrgID().subscribe(
      (data: any) => {
        if (data.rootDepartmentObjects) {
          for (var i = 0; i < data.rootDepartmentObjects.length; i++) {
            if (data.rootDepartmentObjects[i].administratives.length != 0) {
              results.push({
                id: data.rootDepartmentObjects[i].id,
                text: data.rootDepartmentObjects[i].dept_name,
                children: data.rootDepartmentObjects[i].administratives,
              });
            }
          }
        }
        this.adminData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  public checkedValues() {
    const result = [];
    const map = new Map();
    for (const item of this.teamMemFetchData) {
      if (!map.has(item.id) && !map.has(item.data && item.data.id)) {
        map.set(item.id || (item.data && item.data.id), true); // set any value to Map
        result.push({
          id: item.data ? item.data.id : item.id,
          full_name: item.data ? item.data.full_name : item.full_name,
          employee_type_name: item.data
            ? item.data.employee_type_name
            : item.employee_type_name,
          designation_name: item.data
            ? item.data.designation_name
            : item.designation_name,
        });
      } else {
        Swal.fire(
          "Error!",
          item.data
            ? item.data.full_name +
                "has already been added.Please add other employee"
            : item.full_name +
                "has already been added.Please add other employee",
          "error"
        ).then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    }

    this.teamMemFetchData = result;

    // this.empDataSource=new MatTableDataSource(this.teamMemFetchData)
    // this.empDataSource.connect().next(this.teamMemFetchData);
    //
    if (this.teamValue.length != 0 || this.teamMembers.length != 0) {
      //this.empgrid.refresh();
      let datas = new DataManager(this.teamMemFetchData);
      this.empDataSource = datas.dataSource["json"];
    }
  }
  selectEvent(item) {
    // do something with selected item
    this.selectedText = item.name;
    let options = $(".options");
    options.hide();
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onChangeTaskSearch(val: string) {}
  selectNearBy(nearbyPlace) {
    this.nearbyAddress = nearbyPlace.name;
    this.searchLocVal = nearbyPlace.name;
    this.address = nearbyPlace.name;
    this.changed_address = nearbyPlace.name;

    this.getCurrentPoslatlng();

    // this.web_site = place.website;
    // this.name = place.name;

    // this.getChangedMatchedTypes()
    this.ngZone.run(() => {
      this.latitude = nearbyPlace.geometry.location.lat();
      this.longitude = nearbyPlace.geometry.location.lng();
      this.showNearbyPlaces = false;

      //set latitude, longitude and zoom

      this.projectPoslat = parseFloat(nearbyPlace.geometry.location.lat());
      this.projectPoslng = parseFloat(nearbyPlace.geometry.location.lng());
      this.SetPosition(
        parseFloat(nearbyPlace.geometry.location.lat()),
        parseFloat(nearbyPlace.geometry.location.lng())
      );
      this.zoom = 15;
    });

    //set latitude, longitude and zoom
  }
  public onActiveValChange(val) {
    this.selectedActivGroupVal = val;
    this.typeValue = "";
    this.relatedValue = "";
    // this.geoCoder = new google.maps.Geocoder;
    //this.setCurrentLocation();
    if (this.selectedActivGroupVal == "Jobs") {
      this.teamLocAdd = false;
      this.FetchAllProjectByOrgID();
      this.projTaskDataValue = "";
    } else if (this.selectedActivGroupVal == "Cases") {
      this.teamLocAdd = false;

      var results = [{ id: "", text: "Select" }];
      // let dataObj = JSON.parse(data['token']);
      //
      if (this.complainData) {
        for (var i = 0; i < this.complainData.length; i++) {
          // logik to create new items

          results.push({
            id: this.complainData[i].id,
            text: this.complainData[i].text,
          });
        }
      }
      this.selectedActivCategData = results;
    } else if (this.selectedGroupVal == "Office") {
      this.fetchDataGrid();
    } else if (this.selectedGroupVal == "Location") {
      this.teamCheckIn = false;
      //     this.searchElementRef.nativeElement.value=this.formatted_address;
      // console.log('formatted_address',this.formatted_address);
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
        let autocomplete = new google.maps.places.Autocomplete(
          this.searchElementRef.nativeElement
        );

        autocomplete.addListener("place_changed", () => {
          this.showMap = true;
          this.ngZone.run(() => {
            //get the place result

            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.address = place.formatted_address;
            this.changedLocationData = place;
            this.changed_address = place.formatted_address;
            this.searchLocVal = place.formatted_address;
            this.geo_address = place.name;

            // this.web_site = place.website;
            // this.name = place.name;
            this.getCurrentPoslatlng();

            this.getChangedMatchedTypes();

            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();

            this.projectPoslat = place.geometry.location.lat();
            this.projectPoslng = place.geometry.location.lng();
            this.SetPosition(
              place.geometry.location.lat(),
              place.geometry.location.lng()
            );
            this.zoom = 15;
            this.showNearbyPlaces = false;

            if (this.searchElementRef.nativeElement == "") {
              this.showNearbyPlaces = true;
            }
          });
        });
      });
    } else if (this.selectedGroupVal == "Activity") {
      if (this.addformSubmitted && this.offcMeetingTaskValue == "") {
        this.actTxt = true;
      } else {
        this.actTxt = false;
      }
    }
  }

  public nearByPlaces() {
    // this.setCurrentLocation();
    // let nearbyplaces= new google.maps.places.PlacesService(map);
    this.geoCoder = new google.maps.Geocoder();
    let nearby = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    nearby.nearbySearch(
      {
        location: { lat: this.latitude, lng: this.longitude },
        radius: 5000,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            // this.createMarker(results[i]);
          }
        }
        this.nearbyPlaces = results;
      }
    );
  }
  public onSearchChange() {}
  focusFunction() {
    if (this.searchElementRef.nativeElement.value == "") {
      this.showNearbyPlaces = true;
    } else {
      this.showNearbyPlaces = false;
    }
    this.mapsAPILoader.load().then(() => {
      this.nearByPlaces();
    });
  }
  keyup(event) {
    this.showNearbyPlaces = false;

    if (event.keyCode == 8 && this.searchElementRef.nativeElement.value == "")
      this.showNearbyPlaces = true;
    this.searchLocVal = "";

    this.mapsAPILoader.load().then(() => {
      this.nearByPlaces();
    });
  }

  manualInputChange(event) {
    this.manualInputValue = event.target.value;
  }

  clickFunction() {
    if (this.searchElementRef.nativeElement.value == "") {
      this.showNearbyPlaces = true;
    } else {
      this.showNearbyPlaces = false;
    }
    this.mapsAPILoader.load().then(() => {
      this.nearByPlaces();
    });
  }
  public checkIsTeam(e: any) {
    if (e.srcElement.checked) {
      this.teamAdd = true;
      this.EmpList();
    } else {
      this.teamAdd = false;
    }
  }

  public getNearbyPlaces(position) {
    let request = {
      location: position,
      rankBy: google.maps.places.RankBy.DISTANCE,
      keyword: "sushi",
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {});
  }

  // Handle the results (up to 20) of the Nearby Search
  public nearbyCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      // createMarkers(results);
    }
  }
  public checkIsLocationTeam() {
    this.teamLocAdd = !this.teamLocAdd;
    if (this.teamLocAdd) {
      this.EmpList();
    }
  }
  onFocused(e) {
    // do something when input is focused
  }

  public showRow() {
    this.expandRow = true;
  }
  public changedTeamMember(e: any): void {
    this.teamMemberValue = e.value;
    console.log("e", e.data);
    if (e.value != "" && e.data.length != 0) {
      this.teamEmpName = e.data[0].text;
    }
  }
  public FetchEmployeeLeaveAdjustmentEmpID() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      id: user_info["id"],
    };

    return this.leaveService
      .FetchEmployeeLeaveAdjustmentEmpID(postData)
      .subscribe(
        (data: any) => {
          if (data != null) {
            //  this.adjustedBalance=data.adjustment;

            this.adjustedBalance = data.adjustment;
            this.earned_remaining =
              this.earnedLeaves - data.adjustment - this.earned_used_leaves;
          } else {
            this.adjustedBalance = 0;
          }
        },
        (error) => {
          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
  }

  constructor(
    @Inject(FormBuilder) public fb: FormBuilder,
    private leadService: LeadService,
    private countupTimerService: CountupTimerService,
    private spinner: NgxSpinnerService,
    private leaveService: LeaveService,
    private adminService: AdministrativeService,
    private mapsAPILoader: MapsAPILoader,
    private activityService: ActivityService,
    private ngZone: NgZone,
    private orgService: OrganizationService,
    private qtnService: QuotationService,
    private costService: CostService,
    private userService: UserService,
    private empService: EmployeeService,
    private projectService: ProjectService,
    private deptService: DepartmentService,
    private desgnService: DesignationService,
    private vcr: ViewContainerRef,
    private teamService: TeamService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private timeService: TimeSheetService,
    public taskService: TaskService,
    public router: Router,
    private renderer: Renderer2,
    private notifyService: NotificationService,
    public histSer: HistoryService,
    public platformDetectionService: PlatformDetectionService,
    private timesheetService: TimeSheetService
  ) {
    this.sliderForm = this.fb.group({
      slider: [0, Validators.min(10)],
    });

    // let cdate = new Date();
    // cdate.setHours(cdate.getHours() - 2);
    // this.countupTimerService.startTimer(cdate);
    this.loadscript();
    this.renderer.listen("window", "click", (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if (
        this.selectedGroupVal == "Location" &&
        this.showNearbyPlaces &&
        e.target !== this.searchElementRef.nativeElement &&
        e.target !== this.nearbyContainer.nativeElement
      ) {
        this.showNearbyPlaces = false;
      }
    });
  }

  public checkIsDept() {
    this.filterEmpByDept = !this.filterEmpByDept;
    if (this.filterEmpByDept) {
      this.getAllDept();

      $("#toggleDesgnCheck").attr("disabled", "disabled");
      $("#toggleCheckinDesgnCheck").attr("disabled", "disabled");
      $("#toggleFreeLanCheck").attr("disabled", "disabled");
      $("#toggleCheckinFreeLanCheck").attr("disabled", "disabled");
      $("#toggleOutSourceCheck").attr("disabled", "disabled");
      $("#toggleCheckinOutSourceCheck").attr("disabled", "disabled");
    } else {
      this.EmpList();
      $("#toggleDesgnCheck").removeAttr("disabled");
      $("#toggleCheckinDesgnCheck").removeAttr("disabled");
      $("#toggleFreeLanCheck").removeAttr("disabled");
      $("#toggleCheckinFreeLanCheck").removeAttr("disabled");
      $("#toggleOutSourceCheck").removeAttr("disabled");
      $("#toggleCheckinOutSourceCheck").removeAttr("disabled");
    }
  }
  public checkIsDesgn() {
    this.filterEmpByDesgn = !this.filterEmpByDesgn;

    if (this.filterEmpByDesgn) {
      this.getAllDesignationByOrgID();
      $("#toggleDeptCheck").attr("disabled", "disabled");
      $("#toggleCheckinDeptCheck").attr("disabled", "disabled");
      $("#toggleFreeLanCheck").attr("disabled", "disabled");
      $("#toggleCheckinFreeLanCheck").attr("disabled", "disabled");
      $("#toggleOutSourceCheck").attr("disabled", "disabled");
      $("#toggleCheckinOutSourceCheck").attr("disabled", "disabled");
    } else {
      this.EmpList();

      $("#toggleDeptCheck").removeAttr("disabled");
      $("#toggleCheckinDeptCheck").removeAttr("disabled");
      $("#toggleFreeLanCheck").removeAttr("disabled");
      $("#toggleCheckinFreeLanCheck").removeAttr("disabled");
      $("#toggleOutSourceCheck").removeAttr("disabled");
      $("#toggleCheckinOutSourceCheck").removeAttr("disabled");
    }
  }
  public checkIsFreeLan() {
    this.filterEmpByFreeLanc = !this.filterEmpByFreeLanc;
    if (this.filterEmpByFreeLanc) {
      this.EmpList();

      $("#toggleDeptCheck").attr("disabled", "disabled");
      $("#toggleCheckinDeptCheck").attr("disabled", "disabled");
      $("#toggleDesgnCheck").attr("disabled", "disabled");
      $("#toggleCheckinDesgnCheck").attr("disabled", "disabled");
      $("#toggleOutSourceCheck").attr("disabled", "disabled");
      $("#toggleCheckinOutSourceCheck").attr("disabled", "disabled");
    } else {
      this.EmpList();

      $("#toggleDeptCheck").removeAttr("disabled");
      $("#toggleCheckinDeptCheck").removeAttr("disabled");
      $("#toggleDesgnCheck").removeAttr("disabled");
      $("#toggleCheckinDesgnCheck").removeAttr("disabled");
      $("#toggleOutSourceCheck").removeAttr("disabled");
      $("#toggleCheckinOutSourceCheck").removeAttr("disabled");
    }
  }
  public checkIsOutsource() {
    this.filterEmpByOutsource = !this.filterEmpByOutsource;
    if (this.filterEmpByOutsource) {
      this.EmpList();

      $("#toggleDeptCheck").attr("disabled", "disabled");
      $("#toggleCheckinDeptCheck").attr("disabled", "disabled");
      $("#toggleFreeLanCheck").attr("disabled", "disabled");
      $("#toggleCheckinFreeLanCheck").attr("disabled", "disabled");
      $("#toggleDesgnCheck").attr("disabled", "disabled");
      $("#toggleCheckinDesgnCheck").attr("disabled", "disabled");
    } else {
      this.EmpList();

      $("#toggleDeptCheck").removeAttr("disabled");
      $("#toggleCheckinDeptCheck").removeAttr("disabled");
      $("#toggleFreeLanCheck").removeAttr("disabled");
      $("#toggleCheckinFreeLanCheck").removeAttr("disabled");
      $("#toggleDesgnCheck").removeAttr("disabled");
      $("#toggleCheckinDesgnCheck").removeAttr("disabled");
    }
  }
  public onEmpListByChange(val) {
    this.deptEmpValue = "";
    this.desgnEmpValue = "";
    this.teamMembersData = [];
    if (val == "Department") {
      this.filterEmpByDept = true;
      this.filterEmpByDesgn = false;
      this.filterEmpByFreeLanc = false;
      this.filterEmpByOutsource = false;
      this.teamMemberValue = "";
      this.getAllDept();
    } else if (val == "Designation") {
      this.filterEmpByDesgn = true;
      this.filterEmpByDept = false;
      this.filterEmpByFreeLanc = false;
      this.filterEmpByOutsource = false;
      this.getAllDesignationByOrgID();
      this.teamMemberValue = "";
    } else if (val == "Freelance") {
      this.filterEmpByDesgn = false;
      this.filterEmpByDept = false;
      this.filterEmpByFreeLanc = true;
      this.filterEmpByOutsource = false;
      this.teamMemberValue = "";

      this.EmpList();
    } else {
      this.filterEmpByDesgn = false;
      this.filterEmpByDept = false;
      this.filterEmpByFreeLanc = false;
      this.filterEmpByOutsource = true;
      this.teamMemberValue = "";

      this.EmpList();
    }
  }

  public changedDept(e: any): void {
    this.deptValue = e.value;
  }
  changedRelatedData(e: any): void {
    this.relatedValue = e.value;
    console.log("relatedValue", this.relatedValue);
    this.spinner.show();
    if (e.data[0].text == "Lead") {
      this.leadService.GetAllLeadByOrgID().subscribe(
        (data: any) => {
          this.spinner.hide();

          this.typeName = "Lead";
          //  let dataObj = JSON.parse(data['token']);
          let leadStatus = [{ id: "", text: "Select" }];

          for (var i = 0; i < data.length; i++) {
            if (data[i].lead_status != "Lost Lead") {
              leadStatus.push({
                id: data[i].id,
                text: data[i].lead_name,
              });
            }
          }

          this.typeData = leadStatus;
          this.leadSourceData = data;
          this.relatedSearchToolbar = ["Search"];
          this.initialSort = {
            columns: [
              { field: "deal_name", direction: "Ascending" },
              { field: "email", direction: "Descending" },
            ],
          };
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    } else if (e.data[0].text == "Estimation") {
      this.costService.FetchAllCostProjectByOrgID().subscribe(
        (data: any) => {
          this.spinner.hide();

          this.typeName = "Estimation";
          //  let dataObj = JSON.parse(data['token']);
          let leadStatus = [{ id: "", text: "Select" }];

          for (var i = 0; i < data.length; i++) {
            leadStatus.push({
              id: data[i].project_id,
              text: data[i].project_name,
            });
          }

          this.typeData = leadStatus;
          this.estSourceData = data;
          this.relatedSearchToolbar = ["Search"];

          this.initialSort = {
            columns: [{ field: "project_name", direction: "Ascending" }],
          };
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    } else if (e.data[0].text == "Quotation") {
      this.qtnService.GetAllQuotationByOrgID().subscribe(
        (data: any) => {
          this.spinner.hide();

          this.typeName = "Quotation";
          //  let dataObj = JSON.parse(data['token']);
          let leadStatus = [{ id: "", text: "Select" }];

          for (var i = 0; i < data.length; i++) {
            leadStatus.push({
              id: data[i].id,
              text: data[i].project_name,
            });
          }

          this.typeData = leadStatus;
          this.qtnSourceData = data;
          this.relatedSearchToolbar = ["Search"];

          this.initialSort = {
            columns: [{ field: "project_name", direction: "Ascending" }],
          };
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    } else if (e.data[0].text == "Project") {
      if (localStorage.getItem("user_info")) {
        let user_info = JSON.parse(localStorage.getItem("user_info"));
        if (
          (user_info["is_admin"] == true &&
            user_info["is_superadmin"] == false) ||
          user_info["is_superadmin"] == true
        ) {
          this.projectService.FetchAllProjectByOrgID().subscribe(
            (data: any) => {
              console.log("admin projects", data);
              this.spinner.hide();
              this.typeName = "Project";
              let leadStatus = [{ id: "", text: "Select" }];
              for (var i = 0; i < data.length; i++) {
                leadStatus.push({
                  id: data[i].project_id,
                  text: data[i].project_name,
                });
              }

              this.typeData = leadStatus;
              this.projSourceData = data;
              this.relatedSearchToolbar = ["Search"];

              this.initialSort = {
                columns: [
                  { field: "project_name", direction: "Ascending" },
                  { field: "project_status_name", direction: "Descending" },
                ],
              };
            },
            (error) => {
              Swal.fire("Error!", error, "error").then((result) => {});
            }
          );
        } else if (
          user_info["is_admin"] == false &&
          user_info["is_superadmin"] == false
        ) {
          this.projectService.FetchAllEmployeeProjectByEmpID().subscribe(
            (data: any) => {
              this.spinner.hide();
              this.typeName = "Project";
              let leadStatus = [{ id: "", text: "Select" }];
              for (var i = 0; i < data.length; i++) {
                leadStatus.push({
                  id: data[i].ProjectId,
                  text: data[i].ProjectName,
                });
              }

              this.typeData = leadStatus;
              this.projSourceData = data;
              this.relatedSearchToolbar = ["Search"];

              this.initialSort = {
                columns: [
                  { field: "project_name", direction: "Ascending" },
                  { field: "project_status_name", direction: "Descending" },
                ],
              };
            },
            (error) => {
              Swal.fire("Error!", error, "error").then((result) => {});
            }
          );
        }
      }
    } else {
      this.spinner.hide();
    }
  }

  changedType(e) {
    this.typeValue = e.value;
    this.projectId = e.value;
  }
  public getAllDesignationByOrgID() {
    this.desgnService.getAllDesignationByOrgID().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            results.push({
              id: data[i].id,
              text: data[i].designation_name,
            });
          }
        }

        this.desgnData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public changedEmpDept(e: any): void {
    this.deptEmpValue = e.value;

    if (e.value) {
      this.EmpList();
    }
  }
  public changedEmpDesgn(e: any): void {
    this.desgnEmpValue = e.value;
    if (e.value) {
      this.EmpList();
    }
  }
  public EmpList() {
    if (this.filterEmpByDept) {
      let deptId = {
        ID: this.deptEmpValue,
      };
      this.empService.getEmpByDeptID(deptId).subscribe(
        (data: any) => {
          var results = [{ id: "", text: "Select" }];
          if (data) {
            for (var i = 0; i < data.length; i++) {
              results.push({
                id: data[i].id,
                text: data[i].full_name,
              });
            }
          }

          this.teamMembersData = results;
          // this.teamLeadData=results;
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    } else if (this.filterEmpByDesgn) {
      let desgnId = {
        ID: this.desgnEmpValue,
      };
      this.empService.getEmpByDesgnID(desgnId).subscribe(
        (data: any) => {
          var results = [{ id: "", text: "Select" }];
          if (data) {
            for (var i = 0; i < data.length; i++) {
              results.push({
                id: data[i].id,
                text: data[i].full_name,
              });
            }
          }

          this.teamMembersData = results;
          // this.teamLeadData=results;
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    } else if (this.filterEmpByFreeLanc) {
      this.empService.getAllFreelancerEmpByOrgID().subscribe(
        (data: any) => {
          var results = [{ id: "", text: "Select" }];
          if (data) {
            for (var i = 0; i < data.length; i++) {
              results.push({
                id: data[i].id,
                text: data[i].full_name,
              });
            }
          }

          this.teamMembersData = results;
          // this.teamLeadData=results;
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    } else if (this.filterEmpByOutsource) {
      this.empService.getAllOutsourcedEmpByOrgID().subscribe(
        (data: any) => {
          var results = [{ id: "", text: "Select" }];
          if (data) {
            for (var i = 0; i < data.length; i++) {
              results.push({
                id: data[i].id,
                text: data[i].full_name,
              });
            }
          }

          this.teamMembersData = results;
          // this.teamLeadData=results;
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    } else {
      this.empService.getEmployeeByOrgId().subscribe(
        (data: any) => {
          var results = [{ id: "", text: "Select" }];
          if (data) {
            for (var i = 0; i < data.length; i++) {
              results.push({
                id: data[i].id,
                text: data[i].full_name,
              });
            }
          }

          this.teamMembersData = results;
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    }
  }
  public AllActivities() {
    sessionStorage.removeItem("workforceDate");
    localStorage.removeItem("ActivityEmpID");
    this.router.navigate(["/activities-emp"]);
    //  this.router.navigate(['/activities']);
  }
  public openViewModal(element) {
    //this.FetchGridDataByDepartmentOrgID();
    if (element.timesheetProjectCategoryDataModel != null) {
      this.viewProjType =
        element.timesheetProjectCategoryDataModel.project_type;
      this.viewProjName =
        element.timesheetProjectCategoryDataModel.project_or_comp_name;

      this.GetTimesheetActivityByGroupAndProjectID(element);
    }
    if (element.timesheetDataModels != null) {
      this.viewProjCheckin = element.timesheetDataModels[0].check_in;
      this.viewProjCheckout = element.timesheetDataModels[0].check_out;
    }

    $("#activity_view_modal").modal("show");
  }

  public GetTimesheetActivityByGroupAndProjectID(element) {
    let postData = {
      GroupID: element.timesheetProjectCategoryDataModel.groupid,
      ProjectID: element.timesheetProjectCategoryDataModel.project_or_comp_id,
      Date: element.timesheetDataModels[0].ondate,
    };
    this.timeService
      .GetTimesheetActivityByGroupAndProjectID(postData)
      .subscribe(
        (data: any) => {
          let datas = new DataManager(data);
          this.data12 = datas.dataSource["json"];
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
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
  }
  public closeViewModal() {
    $("#activity_view_modal").modal("hide");
  }
  public getAllTimeLog() {
    this.timeService.getAllTimeLog().subscribe(
      (data: any) => {
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
          element["names"] = [
            { name: "Sazid" },
            { name: "Hifza K" },
            { name: "Jacob" },
            { name: "Nick" },
            { name: "Sazid" },
            { name: "Hifza K" },
            { name: "Jacob" },
            { name: "Nick" },
          ];
        });

        const rows = [];
        if (this.dataSource.length != 0) {
          this.dataSource.forEach((element) =>
            rows.push(element, { detailRow: true, element })
          );
        }

        return of(rows);

        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public resetAddedTeams() {
    this.teamValue = [];
    this.showProjDesc = false;

    this.filterEmpByDept = false;
    this.filterEmpByDesgn = false;
    this.teamMemberValue = "";
    this.teamMembers = [];
    this.selectedDeptVal = "";
    this.nearbyAddress = "";
    this.teamMemFetchData = [];
    this.teams = [];
    // this.empDataSource=new MatTableDataSource(this.teamMemFetchData)
    // this.empDataSource.connect().next(this.teamMemFetchData);
    if (this.teamMembers.length != 0 || this.teamValue.length != 0) {
      //this.empgrid.refresh();
      let datas = new DataManager(this.teamMemFetchData);
      this.empDataSource = datas.dataSource["json"];
    }
  }
  public OnTimeLogClose() {
    this.activModel = null;
    this.showSlider = false;
    this.selectedActivGroupVal = "empty";
    this.selecteOptionValue = "";
    $("#activityInput").value = "";
    this.OfficeLogForm.reset();
    this.OfficeLogForm.patchValue({
      startTime: null,
      endTime: null,
    });
    this.addformSubmitted = false;
    this.AdminTaskValue = "";
    this.projTaskDataValue = "";
    this.selecteJobOptionValue = "";
    this.officeActListValue = "";
    this.meetingTaskValue = "";
    this.officeSubtaskListValue = "";
    this.relatedValue = "";
    $("#officeActivityInput").val("");
    $("#time_log_modal").modal("hide");
    this.offcStartEqualEnd = false;
    this.showPurposeTasks = false;
    this.showActivityTasks = false;
    $("#adminActivity").removeAttr("disabled");
    $("#taskField").removeAttr("disabled");

    $("#adminActivity").prop("checked", false);
    $("#taskField").prop("checked", false);

    this.timeLogForm.reset();
    this.sliderForm.reset();
    this.sub_taskId = "";
    this.typeValue = "";
    this.timeLogBtn.nativeElement.click();

    this.errorTimeExccedOne = false;
    this.OfficeLogForm.get("radioOption").disable();
  }
  public OnCloseStatusModal() {
    $("#task_status_modal").modal("hide");
  }

  public toggleTeamSwitch() {
    $("#toggleCheck").prop("checked", false);
    $("#toggleCheck").attr("checked", false);
    // $('#myCheckbox').prop('checked', false);
  }

  public oldGetAllStatus() {
    this.taskService.GetStatusByOrgID().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select an option" }];
        // let dataObj = JSON.parse(data['token']);
        //
        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          // if(data[i].status_name!=item.status){
          results.push({
            id: data[i].id,
            text: data[i].status_name,
          });

          if (data[i].status_name == "In Progress") {
            this.inProgressStatID = data[i].id;
          }

          if (data[i].status_name == "Open") {
            this.openStatID = data[i].id;
          }

          if (data[i].status_name == "Completed") {
            this.completedStatID = data[i].id;
          }

          if (data[i].status_name == "Submitted for review") {
            this.underReviewStatID = data[i].id;
          }

          //}
          //     else{

          //
          //     }
        }

        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  getAllStatus() {
    let results = [];
    this.taskService.GetStatusByOrgID().subscribe((data: any) => {
      data.map((elm, i) => {
        if (elm.status_name === "Open") {
          results.push({
            id: elm.id,
            text: elm.status_name,
          });
          this.openStatID = elm.id;
        }
        if (data.length === i + 1) {
          data.map((elm, j) => {
            if (elm.status_name === "In Progress") {
              results.push({
                id: elm.id,
                text: elm.status_name,
              });
              this.inProgressStatID = elm.id;
            }
            if (data.length === j + 1) {
              data.map((elm, k) => {
                if (elm.status_name === "Submitted for review") {
                  results.push({
                    id: elm.id,
                    text: elm.status_name,
                  });
                  this.underReviewStatID = elm.id;
                }
                if (data.length === k + 1) {
                  data.map((elm, l) => {
                    if (elm.status_name === "Completed") {
                      results.push({
                        id: elm.id,
                        text: elm.status_name,
                      });
                      this.completedStatID = elm.id;
                    }

                    if (data.length === l + 1) {
                      console.log("Justin", this.taskStatusData);
                      if (this.checkIfProjectTask) {
                        this.taskStatusData = results;
                      } else {
                        let filteredArray = results.filter(
                          (obj) => obj.text !== "Submitted for review"
                        );
                        this.taskStatusData = filteredArray;
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  }

  public checkIsAdmin(e: any) {
    if (e.srcElement.checked) {
      // this.selectedCategText="empty"
      this.showAdminTasks = true;

      this.selectedVal = "";
      this.selectedGroupVal = "empty";
      this.systemidText = "";
      this.othersDataValue = "";
      $("#isTeam").prop("checked", false);
    } else {
      this.showAdminTasks = false;
    }
  }

  public checkIsTask(e: any) {
    if (e.srcElement.checked) {
      this.actTxt = false;
      this.showActivityTasks = true;
      $("#adminActivity").prop("disabled", true);
      let slider: Slider = new Slider();
      slider.appendTo("#slider1");
      this.relatedValue = "";
      this.typeValue = "";
    } else {
      this.showActivityTasks = false;
      $("#adminActivity").removeAttr("disabled");
      if (this.addformSubmitted && this.officeActInputValue == "") {
        this.actTxt = true;
      } else {
        this.actTxt = false;
      }
    }
  }

  public onTaskStatusSubmit() {
    this.spinner.show();
    let postData = {
      id: this.tasktobeUpdated.id,

      status_id: this.taskStatus,
    };

    this.taskService.UpdateTaskStatus(postData).subscribe(
      (data: any) => {
        if (data) {
          this.spinner.hide();

          // this.toastr.success(data.desc);
          this.toastr.success(data["desc"], undefined, {
            positionClass: "toast-top-center",
          });
          // this.GetAllTaskByEmpID();
          if (this.jobFilterValue != "") {
            this.getalltaskbyJob(this.jobFilterValue);
          } else {
            this.GetAllTaskByEmpID();
          }
          $("#task_status_modal").modal("hide");
        }
      },
      (error) => {
        this.spinner.hide();

        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public checkIsPurpose(e: any) {
    if (e.srcElement.checked) {
      // this.selectedCategText="empty"
      this.addOfficAdminAct = true;
      this.showPurposeTasks = true;
      // this.GetAllAdministrative();
      $("#taskField").prop("disabled", true);
    } else {
      this.addOfficAdminAct = false;

      this.showPurposeTasks = false;
      $("#taskField").removeAttr("disabled");
    }
  }
  checkIsMeetingActivity(e: any) {
    if (e.srcElement.checked) {
      // this.selectedCategText="empty"

      this.showMeetingAct = true;
    } else {
      this.showMeetingAct = false;
    }
  }
  onSearchBlur() {
    this.showNearbyPlaces = false;
  }
  public checkIsManual(e: any) {
    // this.manualInput=!this.manualInput
    if (e.srcElement.checked) {
      this.manualInput = true;
      this.nearbyAddress = "";

      $("#OfficeCheck").prop("disabled", true);
      $("#homeCheck").prop("disabled", true);
    } else {
      this.manualInput = false;

      $("#OfficeCheck").removeAttr("disabled");
      $("#homeCheck").removeAttr("disabled");
      this.manualInputValue = "";
      this.nearbyAddress = this.formatted_address;
      this.searchLocVal = this.formatted_address;
      this.searchElementRef.nativeElement.value = this.formatted_address;
    }
  }

  public closeMap() {
    this.showMap = !this.showMap;
  }

  public openModal() {
    this.FindTeamsByOrgID();
    this.getAllDesignationByOrgID();
    this.getAllOutsourcedEmpByOrgID();
    this.EmpList();
  }
  public fetchDataGrid() {
    this.taskService.fetchGridDataByTaskEmpID().subscribe((data: any) => {
      let completedTasks = [];
      let openTasks = [];
      let inProgrssTasks = [];

      var results = [{ id: "", text: "Select" }];
      // let dataObj = JSON.parse(data['token']);
      //
      if (data) {
        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          results.push({
            id: data[i].id,
            text: data[i].task_name,
          });
          if (data[i].status_name == "Completed") {
            completedTasks.push(data[i]);
          } else if (data[i].status_name == "Open") {
            openTasks.push(data[i]);
          } else {
            inProgrssTasks.push(data[i]);
          }
          this.taskCompletedList = completedTasks;
          this.taskOpenList = openTasks;

          this.taskInProgressList = inProgrssTasks;
          this.tasksList = results;
        }
      }

      var results = [{ id: "", text: "Select" }];
      if (data) {
        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            id: data[i].id,
            text: data[i].task_name,
          });
        }
      }

      this.tasks = results;
      this.selectedCategData = results;
    });
  }

  public GetAllTaskByEmpID() {
    this.spinner.show();
    this.taskService.GetAllTaskByEmpID().subscribe((data: any) => {
      let completedTasks = [];
      let openTasks = [];
      let inProgrssTasks = [];

      var results = [{ id: "", text: "Select" }];
      // let dataObj = JSON.parse(data['token']);
      //
      if (data) {
        this.spinner.hide();

        for (var i = 0; i < data.employeeTasks.length; i++) {
          // logik to create new items
          results.push({
            id: data.employeeTasks[i].id,
            text: data.employeeTasks[i].task_name,
          });
          if (data.employeeTasks[i].status_name == "Completed") {
            completedTasks.push(data.employeeTasks[i]);
          } else if (data.employeeTasks[i].status_name == "Open") {
            openTasks.push(data.employeeTasks[i]);
          } else {
            inProgrssTasks.push(data.employeeTasks[i]);
          }
        }

        this.taskCompletedList = completedTasks;
        // this.taskOpenList=openTasks;
        this.taskInProgressList = inProgrssTasks;
        this.tasksList = results;
        let localemployeeTasks = [];
        let localassignedEmployeeTasks = [];
        let localoverDueTasks = [];
        let localOpenTasks = [];
        let localCompletedTasks = [];
        let projemployeeTasks = [];
        let projassignedEmployeeTasks = [];
        let projoverDueTasks = [];
        let projOpenTasks = [];
        let projCompletedTasks = [];

        for (var i = 0; i < data.employeeTasks.length; i++) {
          if (data["employeeTasks"][i]["is_local_activity"] == "True") {
            if (data["employeeTasks"][i].status_name != "Completed") {
              localemployeeTasks.push(data["employeeTasks"][i]);
            }
          } else {
            if (data["employeeTasks"][i].status_name != "Completed") {
              projemployeeTasks.push(data["employeeTasks"][i]);
            }
          }
          //  if(data['employeeTasks'][i].status_name=="Open" && data['employeeTasks'][i]['is_local_activity']=='True'){
          //   localOpenTasks.push(data['employeeTasks'][i]);
          // }else{
          //   projOpenTasks.push(data['employeeTasks'][i]);

          // }
        }

        for (var i = 0; i < data.assignedEmployeeTasks.length; i++) {
          if (data["assignedEmployeeTasks"][i]["is_local_activity"] == "True") {
            if (data["assignedEmployeeTasks"][i].status_name != "Completed") {
              localassignedEmployeeTasks.push(data["assignedEmployeeTasks"][i]);
            }
          } else {
            if (data["assignedEmployeeTasks"][i].status_name != "Completed") {
              projassignedEmployeeTasks.push(data["assignedEmployeeTasks"][i]);
            }
          }
        }
        for (var i = 0; i < data.overDueTasks.length; i++) {
          if (data["overDueTasks"][i]["is_local_activity"] == "True") {
            if (data["overDueTasks"][i].status_name != "Completed") {
              localoverDueTasks.push(data["overDueTasks"][i]);
            }
          } else {
            if (data["overDueTasks"][i].status_name != "Completed") {
              projoverDueTasks.push(data["overDueTasks"][i]);
            }
          }
        }
        for (var i = 0; i < this.taskCompletedList.length; i++) {
          if (this.taskCompletedList[i]["is_local_activity"] == "True") {
            localCompletedTasks.push(this.taskCompletedList[i]);
          } else {
            projCompletedTasks.push(this.taskCompletedList[i]);
          }
        }
        for (var i = 0; i < openTasks.length; i++) {
          if (openTasks[i]["is_local_activity"] == "True") {
            localOpenTasks.push(openTasks[i]);
          } else {
            projOpenTasks.push(openTasks[i]);
          }
        }

        if (this.showProjBasedTasks) {
          this.employeeTasksList = projemployeeTasks;
          this.assignedToList = projassignedEmployeeTasks;
          this.overDueList = projoverDueTasks;
          this.taskOpenList = projOpenTasks;
          this.completedList = projCompletedTasks;
        } else {
          this.employeeTasksList = localemployeeTasks;
          this.assignedToList = localassignedEmployeeTasks;
          this.overDueList = localoverDueTasks;
          this.taskOpenList = localOpenTasks;
          this.completedList = localCompletedTasks;
        }
      }

      var results = [{ id: "", text: "Select" }];
      if (data) {
        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            id: data[i].id,
            text: data[i].task_name,
          });
        }
      }

      this.tasks = results;
      this.selectedCategData = results;

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
    });
  }

  //old function
  public GetAllTaskDescByEmpID() {
    this.spinner.show();
    this.taskService.GetAllTaskByEmpID().subscribe((data: any) => {
      var taskwithDesc = [
        {
          id: "",
          text: "Select",
          additional: {
            assignee: "",
            taskDesc: "",
            milestone: "",
            dueDate: "",
            assigne_id: "",
            status_id: "",
            project_id: "",
            milestone_id: "",
          },
        },
      ];

      if (data) {
        for (var i = 0; i < data.employeeTasks.length; i++) {
          if (data["employeeTasks"][i].status_name != "Completed") {
            taskwithDesc.push({
              id: data.employeeTasks[i].id,
              text: data.employeeTasks[i].task_name,
              additional: {
                assignee: data.employeeTasks[i].assigned_name,
                taskDesc: data.employeeTasks[i].project_name,
                milestone: data.employeeTasks[i].milestone_name,
                dueDate: data.employeeTasks[i].due_date,
                assigne_id: data.employeeTasks[i].assigned_empid,
                status_id: data.employeeTasks[i].status_id,
                project_id: data.employeeTasks[i].project_id,
                milestone_id: data.employeeTasks[i].milestone_id,
              },
            });
          }
        }
        this.taskWithDesc = taskwithDesc;
        console.log("data", this.taskWithDesc);
      }
    });
  }

  GetAllTaskDescByEmpIDList() {
    this.spinner.show();
    var taskwithDesc = [
      {
        id: "",
        text: "Select",
        additional: {
          assignee: "",
          taskDesc: "",
          milestone: "",
          dueDate: "",
          assigne_id: "",
          status_id: "",
          project_id: "",
          milestone_id: "",
        },
      },
    ];
    this.taskService
      .GetAllMainandLocalTaskListByEmpId()
      .subscribe((recData: any) => {
        recData.map((elm) => {
          if (elm.statusName != "Completed") {
            taskwithDesc.push({
              id: elm.taskId,
              text: elm.taskName,
              additional: {
                assignee: elm.leadName ? elm.leadName : elm.employeeName,
                taskDesc: elm.projectName ? elm.projectName : "NA",
                milestone: elm.milestoneName ? elm.milestoneName : "NA",
                dueDate: elm.dueDate ? elm.dueDate : "NA",
                assigne_id: elm.employeeId,
                status_id: elm.statusId,
                project_id: elm.projectId,
                milestone_id: elm.milestoneId,
              },
            });
          }
        });
        this.taskWithDesc = taskwithDesc;
      });
  }

  public GetAllTaskByJobEmpID() {
    this.spinner.show();
    this.taskService.GetAllTaskByEmpID().subscribe((data: any) => {
      let completedTasks = [];
      let openTasks = [];
      let inProgrssTasks = [];

      var results = [{ id: "", text: "Select" }];
      // let dataObj = JSON.parse(data['token']);
      //
      if (data) {
        this.spinner.hide();
      }

      var taskwithDesc = [
        {
          id: "",
          text: "Select",
          additional: {
            assignee: "",
            taskDesc: "",
            milestone: "",
            dueDate: "",
            assigne_id: "",
            status_id: "",
            project_id: "",
            milestone_id: "",
          },
        },
      ];

      if (data) {
        for (var i = 0; i < data.employeeTasks.length; i++) {
          // logik to create new items
          if (data["employeeTasks"][i].status_name != "Completed") {
            taskwithDesc.push({
              id: data.employeeTasks[i].id,
              text: data.employeeTasks[i].task_name,
              additional: {
                assignee: data.employeeTasks[i].assigned_name,
                taskDesc: data.employeeTasks[i].project_name,
                milestone: data.employeeTasks[i].milestone_name,
                dueDate: data.employeeTasks[i].due_date,
                assigne_id: data.employeeTasks[i].assigned_empid,
                status_id: data.employeeTasks[i].status_id,
                project_id: data.employeeTasks[i].project_id,
                milestone_id: data.employeeTasks[i].milestone_id,
              },
            });
          }
        }
        this.taskWithDesc = taskwithDesc;
      }
    });
    //this.getalltaskbyJob(this.jobFilterValue,'job');
  }

  public taskDelete(deptId) {
    let postData = {
      ID: deptId,
    };
    this.taskService.delTask(postData).subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.GetAllTaskByEmpID();

          this.toastr.error(data["desc"], undefined, {
            positionClass: "toast-top-center",
          });
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {}
        );
      }
    );
  }
  public getUsersInfo() {
    this.showTimeLogSpinner = true;
    let userId = {
      ID: localStorage.getItem("user_id"),
    };
    this.userService.getByUserID(userId).subscribe(
      (data) => {
        // let dataObj = JSON.parse(data['token']);
        // this.orgListArr=data

        if (data) {
          this.orgList = data["organization"];
        }
        if (data["timesheet"].length == 0) {
          //localStorage.setItem('is_checkout',JSON.stringify(true))
        }
        if (data["timesheet"]) {
          this.teamEmpId = [];
          this.showTimeLogSpinner = false;

          this.allTimeLog = data["timesheet"];

          data["timesheet"].forEach((elementAB) => {
            if (elementAB.timesheetDataModels) {
              elementAB.timesheetDataModels.forEach((element) => {
                if (element.is_checkout == false) {
                  localStorage.setItem("is_checkout", JSON.stringify(false));

                  this.checkin = false;
                  this.breakin = true;
                  this.breakout = false;
                  this.checkout = true;
                  this.teamEmpId.push(element.emp_id);
                  this.group_id = element.groupid;
                  if (
                    elementAB.timesheetProjectCategoryDataModel.project_type ==
                    "Job"
                  ) {
                    this.FindLocationByEntityID(
                      elementAB.timesheetProjectCategoryDataModel
                        .project_or_comp_id
                    );
                  } else if (
                    elementAB.timesheetProjectCategoryDataModel.project_type ==
                    "Office"
                  ) {
                    this.FindLocationByEntityID(
                      elementAB.timesheetProjectCategoryDataModel
                        .project_or_comp_id
                    );
                  } else if (
                    elementAB.timesheetProjectCategoryDataModel.project_type ==
                    "Place"
                  ) {
                    this.getCurrentPoslatlng();
                    this.SetPosition(
                      elementAB.timesheetSearchLocationViewModel.lat,
                      elementAB.timesheetSearchLocationViewModel.lang
                    );
                  } else if (
                    elementAB.timesheetProjectCategoryDataModel.project_type ==
                    "Manual"
                  ) {
                    this.boundryContain = true;
                  }

                  //
                  if (
                    elementAB.timesheetSearchLocationViewModel != null &&
                    elementAB.timesheetSearchLocationViewModel.is_office == true
                  ) {
                    this.disableAddLog = false;
                    this.addLogSpinner = false;

                    let minTime = elementAB.timesheetDataModels[0].check_in;
                    this.minOfficeActInputTime =
                      moment(minTime).format("hh:mm a");
                    this.officegroupID =
                      elementAB.timesheetSearchLocationViewModel.groupid;
                  }
                  let minTime = elementAB.timesheetDataModels[0].check_in;
                  this.minOfficeActInputTime =
                    moment(minTime).format("hh:mm a");
                }
              });
            }

            //  timesheetDataModels.forEach(element => {
            //    if(!element.is_checkout){
            //     this.group_id=element.groupid;

            //     return;

            //    }
          });

          // this.group_id=data['timesheet'].groupid;

          this.currentCheckin = data["timesheet"].check_in;
          var ms = moment(localStorage.getItem("currentTime"), "hh:mm a").diff(
            moment(data["timesheet"].check_in, "hh:mm a")
          );
          var d = moment.duration(ms, "milliseconds");
          var hours = Math.floor(d.asHours());
          var mins = Math.floor(d.asMinutes()) - hours * 60;

          let sec: any = hours * 3600 + mins * 60;

          // localStorage.setItem('timeLeft',sec);
        }

        //this.OrgList(data['employee'].id);
      },
      (error) => {
        Swal.fire("Error!", "Org List Error.", "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public LastCheckinByEmpID() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let empId = {
      ID: user_info["id"],
    };

    this.userService.LastCheckinByEmpID(empId).subscribe(
      (data: any) => {
        console.log("this main", data);
        if (data.length != 0) {
          if (data[0].is_checkout == false) {
            this.checkin = false;
            this.breakin = true;
            this.breakout = false;
            this.checkout = true;

            localStorage.setItem("is_checkout", JSON.stringify(false));
            let checkin = moment(data[0].check_in).format("hh:mm a");
            let currentTime = moment().format("hh:mm a");

            var now = moment(checkin, "hh:mm:ss a");
            var prev = moment(currentTime, "hh:mm:ss a");
            let diff = JSON.stringify(prev.diff(now, "seconds"));
            localStorage.setItem("timeLeft", diff);

            //clock timer start
            var previousVal = moment(checkin, "hh:mm:ss a");
            var currentVal = moment(currentTime, "hh:mm:ss a");
            this.clockTimerDiv = true;
            this.noClockTimerDiv = false;
            this.timerSecondsValue = currentVal.diff(previousVal, "seconds");
            if (this.timerSecondsValue > 0) {
              this.timerSecondsFinalValue = this.timerSecondsValue;
            } else {
              this.timerSecondsFinalValue = 0;
            }
            //clock timer end
          } else {
          }
        } else {
          this.checkin = true;
          this.breakin = false;
          this.breakout = false;
          this.checkout = false;
          localStorage.setItem("is_checkout", JSON.stringify(true));
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  LastAddedTimesheetActivityByEmpID() {
    if (this.checkIfProjectTask) {
      if (this.currrentTaskText === "Submitted for review") {
        this.preRevisionCount = ++this.preRevisionCount;
      }
    } else {
      this.preRevisionCount = 0;
    }

    console.log("Justin", this.preRevisionCount);
    this.addActformSubmitted = true;
    this.isRecentActFieldValid();
    if (this.activityLogForm.get("startTime").value) {
      let startTime = this.activityLogForm.get("startTime").value;
      let endTime = this.activityLogForm.get("endTime").value;
      let date = moment().format("MM/DD/YYYY");
      this.startTime = date.concat(" " + startTime);
      this.endTime = date.concat(" " + endTime);
    }

    if (!this.checkIfProjectTask) {
      console.log("2");
      if (
        this.activityLogForm.get("remarks").value === "" ||
        this.activityLogForm.get("remarks").value === null
      ) {
        this.showRemarkError = true;
        console.log("3");
      } else {
        this.runConfirmationforTask();
        console.log("4");
      }
    } else {
      this.runConfirmationforTask();
      console.log("5");
    }
  }

  runConfirmationforTask() {
    if (
      this.activityLogForm.get("startTime").value != "" &&
      this.activityLogForm.get("endTime").value != "" &&
      this.activityLogForm.get("startTime").value != null &&
      this.activityLogForm.get("endTime").value != null
    ) {
      let user_info = JSON.parse(localStorage.getItem("user_info"));
      let empId = {
        empid: user_info["id"],
        start_time: this.startTime,
        end_time: this.endTime,
      };
      this.timeService.LastAddedTimesheetActivityLogByEmpID(empId).subscribe(
        (data: any) => {
          if (data.status == "201") {
            this.timeinrange = false;
            Swal.fire("Error!", data["desc"], "error");
          } else {
            let testToDisplay =
              this.currrentTaskText !== "Submitted for review"
                ? "Do you want to change the status of the task ?"
                : "Do you want to Submit this task for review ?";
            Swal.fire({
              title: "Are you sure ?",
              text: testToDisplay,
              showCloseButton: true,
              showCancelButton: true,
              focusConfirm: false,
              confirmButtonText: " Confirm",
              cancelButtonText: "Cancel",
            }).then((result) => {
              console.log(result);
              if (result.value === true) {
                this.timeinrange = true;
                this.onAddTimesheetActivity();
              } else {
                if (
                  this.currrentTaskText !=
                    "Do you want to change the status of the task ?" &&
                  this.preRevisionCount > 0
                ) {
                  this.preRevisionCount = --this.preRevisionCount;
                  //console.log(" this.preRevisionCount ---.", this.preRevisionCount);
                }
              }
            });
          }
          this.showRemarkError = false;
        },
        (error) => {
          Swal.fire("Error!", error, "error");
        }
      );
    }
  }

  LastAddedOffcTimesheetActivityByEmpID() {
    this.addformSubmitted = true;
    this.isOfficeFieldValid();
    let postData;
    if (this.OfficeLogForm.get("startTime").value) {
      let startTime = this.OfficeLogForm.get("startTime").value;
      let endTime = this.OfficeLogForm.get("endTime").value;
      let date = moment().format("MM/DD/YYYY");
      this.startOfficTime = date.concat(" " + startTime);
      this.endOfficTime = date.concat(" " + endTime);
    }
    console.log(
      "LastAddedTimesheetActivityByEmpID",
      this.OfficeLogForm.get("startTime").value
    );
    if (
      this.OfficeLogForm.get("startTime").value != "" &&
      this.OfficeLogForm.get("endTime").value != "" &&
      this.OfficeLogForm.get("startTime").value != null &&
      this.OfficeLogForm.get("endTime").value != null
    ) {
      let user_info = JSON.parse(localStorage.getItem("user_info"));

      let empId = {
        empid: user_info["id"],
        start_time: this.startOfficTime,
        end_time: this.endOfficTime,
      };
      /* this.timeService.LastAddedTimesheetActivityByEmpID(empId).subscribe( */
      this.timeService.LastAddedTimesheetActivityLogByEmpID(empId).subscribe(
        (data: any) => {
          if (data.status == "201") {
            this.timeinrange = false;
            Swal.fire("Error!", data["desc"], "error").then((result) => {});
          } else {
            this.timeinrange = true;
            this.onAddOfficeTimesheetActivity();
          }
        },
        (error) => {
          Swal.fire("Error!", error, "error").then((result) => {});
        }
      );
    }
  }
  public getTimesheetByEmpId() {
    this.showTimeLogSpinner = true;
    // this.teamEmpId=[];
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let empId = { ID: user_info["id"] };
    //this.userService.GetAllTimesheetByEmpID(empId).subscribe(
    this.userService.GetAllTimesheetListByEmployeeID(empId).subscribe(
      (data: any) => {
        console.log("new Data timesheet", data);
        if (data.length == 0) {
          localStorage.setItem("is_checkout", JSON.stringify(true));
          this.checkin = true;
          this.breakin = false;
          this.breakout = false;
          this.checkout = false;
        }

        if (data) {
          this.showTimeLogSpinner = false;
          this.allTimeLog = data;
          data.forEach((elementAB) => {
            if (elementAB.timesheetDataModels) {
              elementAB.timesheetDataModels.forEach((element) => {
                if (element.is_checkout == false) {
                  let minsTime = elementAB.timesheetDataModels[0].check_in;
                  this.minStartTime = moment(minsTime).format("hh:mm a");
                  if (this.checkoutByEmpId == false) {
                    localStorage.setItem("is_checkout", JSON.stringify(false));
                    this.disableAddTask = false;
                    this.findLastBreakIn(element.groupid);
                  }
                  if (!this.teamEmpId.includes(element.emp_id)) {
                    this.teamEmpId.push(element.emp_id);
                  }
                  this.group_id = element.groupid;
                  if (
                    elementAB.timesheetProjectCategoryDataModel.project_type ==
                    "Job"
                  ) {
                    this.FindLocationByEntityID(
                      elementAB.timesheetProjectCategoryDataModel
                        .project_or_comp_id
                    );
                  } else if (
                    elementAB.timesheetProjectCategoryDataModel.project_type ==
                    "Office"
                  ) {
                    this.FindLocationByEntityID(
                      elementAB.timesheetProjectCategoryDataModel
                        .project_or_comp_id
                    );
                    this.act_formatted_address =
                      elementAB.timesheetSearchLocationViewModel.geo_address;
                  } else if (
                    elementAB.timesheetProjectCategoryDataModel.project_type ==
                    "Place"
                  ) {
                    this.getCurrentPoslatlng();
                    if (elementAB.timesheetSearchLocationViewModel.is_manual) {
                      this.act_formatted_address =
                        elementAB.timesheetSearchLocationViewModel.manual_address;
                    } else {
                      this.act_formatted_address =
                        elementAB.timesheetSearchLocationViewModel.geo_address;
                    }
                    this.SetPosition(
                      elementAB.timesheetSearchLocationViewModel.lat,
                      elementAB.timesheetSearchLocationViewModel.lang
                    );
                  } else if (
                    elementAB.timesheetProjectCategoryDataModel.project_type ==
                    "Manual"
                  ) {
                    this.boundryContain = true;
                  }

                  if (
                    elementAB.timesheetSearchLocationViewModel != null &&
                    elementAB.timesheetSearchLocationViewModel.is_office == true
                  ) {
                    this.disableAddLog = false;
                    this.addLogSpinner = false;

                    let minTime = elementAB.timesheetDataModels[0].check_in;
                    this.minOfficeActInputTime =
                      moment(minTime).format("hh:mm a");
                    this.officegroupID =
                      elementAB.timesheetSearchLocationViewModel.groupid;
                  }
                }
              });
            }
            this.checkoutByEmpId = false;
          });

          /* if(this.showProjBasedTasks){
          this.getalltaskbyJob(this.jobFilterValue);
        }else {
          console.log('call1')
          this.getAllTaskbyLocalJoB(this.jobFilterValue);
        } */
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  public showDetailsRow() {
    this.showDetails = !this.showDetails;
  }
  public isCheckedIn() {
    if (this.isCheckIn) {
      $("#toggleCheck").removeAttr("disabled");
    }
  }

  //edited function calls

  public startToast(id: any) {
    if(!this.delegateControl){
      if (id == "start") {
        /* this.getCurrentPoslatlng();
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    }) */
        this.isCheckout = false;
        this.isCheckIn = true;
        this.projectBorderContain = false;
        this.FindTeamsByOrgID();
        this.EmpList();
        if (this.teamCount != 0) {
          $("#isTeam").prop("checked", true);
        }
        this.teamAdd = false;
        //this.FetchAllProjectByOrgID();
        //$('#checkin_log_modal').modal('show');
        this.callCheckinModel();
      } else if (id == "pause") {
        this.toastr.success("Break Timer Starts", undefined, {
          positionClass: "toast-top-center",
        });
      } else if (id == "reset") {
        this.toastr.error("Break Timer Stops", undefined, {
          positionClass: "toast-top-center",
        });
      } else {
        console.log("Nothing");
      }
    }else{
      // this.toastr.warning("Delegate control is active");
      Swal.fire({
        type: 'warning',
        title: 'Delegate User',
        text: 'You are a delegate user in this organization. As a delegate, you do not have permission to perform employee-specific tasks.'
      });
      
    }
   
  }

  public onValChange(val) {
    this.showProjDesc = false;
    this.selectedGroupVal = val;
    this.selecteOptionValue = "";
    //this.selectedValue='';
    this.manualInput = false;
    this.xpandStatus = true;
    this.homeInput = false;
    this.showMap = true;
    if (this.selectedGroupVal == "Job") {
      this.teamLocAdd = false;
      this.addTeamDiv = true;
      this.FetchAllProjectByOrgID();
      this.getCurrentPoslatlng();
    } else if (this.selectedGroupVal == "Case") {
      this.teamLocAdd = false;
    } else if (this.selectedGroupVal == "Office") {
      //this.fetchDataGrid();
    } else if (this.selectedGroupVal == "Location") {
      this.placeDiv = false;
      this.officeHomeDiv = true;
      this.officeInput = true;
      this.xpandStatus = false;
      this.FindAllOrgByHeadOrgID();

      this.teamCheckIn = false;
      this.addTeamDiv = true;
    }
  }

  /* get user location */
  getCurrentPoslatlng(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          (this.currentPoslng = resp.coords.longitude),
            (this.currentPoslat = resp.coords.latitude);
        },
        (err) => {
          this.callLocationError(err);
          console.log(err.message);
        }
      );
    });
  }

  /* get location for default map */
  setCurrentLocation(): Promise<any> {
    var options = {
      enableHighAccuracy: true,
      maximumAge: 15000,
      timeout: 60000,
    };
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.currentPoslng = position.coords.longitude;
            this.currentPoslat = position.coords.latitude;
            this.zoom = 15;
            console.log("checkout value", this.latitude, this.longitude);
            this.getAddress(this.latitude, this.longitude);
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            resolve(true);
          },
          (error) => {
            this.callLocationError(error);
            reject();
          },
          options
        );
      }
    });
  }

  callLocationError(err) {
    console.log(err.message);
    Swal.fire({
      title: "Location Access Denied",
      text: "Unable to get location because " + err.message,
      type: "error",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.value === true) {
        $("#checkin_log_modal").modal("hide");
      }
    });
  }

  /* get formatted address */
  getAddress(latitude, longitude) {
    var addr = new google.maps.Geocoder();
    addr.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (results) {
          this.geoCodeData = results[2];
        }
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 15;
            this.getMatchedTypes();
            if (this.drag == true) {
              if (this.homeInput) {
                this.formatted_address = results[0].formatted_address;
              }
            }
            this.address = results[0].formatted_address;
            this.formatted_address = results[2].formatted_address;
          } else {
            Swal.fire("Please try again!", "Location not found", "error").then(
              (result) => {
                if (result.value === true) {
                  $("#checkin_log_modal").modal("hide");
                }
              }
            );
          }
        } else if (status === "ERROR") {
          Swal.fire(
            "Please try again!",
            "Please check the internet connection",
            "error"
          ).then((result) => {
            if (result.value === true) {
              $("#checkin_log_modal").modal("hide");
            }
          });
        } else if (status === "REQUEST_DENIED") {
          Swal.fire(
            "Please try again!",
            "Please allow location access",
            "error"
          ).then((result) => {
            if (result.value === true) {
              $("#checkin_log_modal").modal("hide");
            }
          });
        } else if (status === "OVER_QUERY_LIMIT") {
          Swal.fire(
            "Please try again!",
            "Subscription exceeded. Please contact Admin",
            "error"
          ).then((result) => {
            if (result.value === true) {
              $("#checkin_log_modal").modal("hide");
            }
          });
        } else {
          Swal.fire("Please try again!", status, "error").then((result) => {
            if (result.value === true) {
              $("#checkin_log_modal").modal("hide");
            }
          });
        }
      }
    );
  }

  public getMatchedTypes() {
    let address_components;
    if (this.geoCodeData.length != 0) {
      address_components = this.geoCodeData["address_components"];
    }
    console.log("address_components", address_components);
    let i, j, types;
    for (i = 0; i < address_components.length; i++) {
      types = address_components[i]["types"];
      for (j = 0; j < types.length; j++) {
        if (types[j] == "street_number") {
          this.street_number = address_components[i]["short_name"];
        }
        if (types[j] === "route") {
          this.route = address_components[i]["long_name"];
        }
        if (types[j] === "neighborhood") {
          this.street_number = address_components[i]["long_name"];
        }
        if (types[j] === "locality") {
          this.locality = address_components[i]["long_name"];
        }
        if (types[j] === "administrative_area_level_1") {
          this.administrative_area_level_1 = address_components[i]["long_name"];
        }
        if (types[j] === "administrative_area_level_2") {
          this.administrative_area_level_2 = address_components[i]["long_name"];
        }
        if (types[j] === "postal_code") {
          this.postal_code = address_components[i]["long_name"];
        }
        if (types[j] === "country") {
          this.country = address_components[i]["long_name"];
        }
      }
    }
  }

  checkIsPlaceOrOffice(e: any) {
    if (e.srcElement.checked) {
      this.placeDiv = true;
      this.officeHomeDiv = false;
      this.officeInput = false;
    } else {
      this.placeDiv = false;
      this.officeHomeDiv = true;
      this.officeInput = true;
      this.xpandStatus = false;
      this.FindAllOrgByHeadOrgID();
      this.homeInput = false;
    }
  }

  /* checkOfficeOrWFH(e){
  if(e.srcElement.checked){
    this.homeInput = true;
    this.officeInput = false;
    this.getCurrentPoslatlng();
    this.boundryContain = true;
    this.nearbyAddress = this.formatted_address;
    this.addTeamDiv = false;
  }else{
    this.officeHomeDiv = true;
    this.officeInput=true;
    this.xpandStatus=false;
    this.FindAllOrgByHeadOrgID();
    this.homeInput = false;
    this.addTeamDiv = true;
  }
} */

  ShowHideDiv(e) {
    console.log(e);
    if (e.srcElement.id === "Office") {
      this.officeHomeDiv = true;
      this.officeInput = true;
      this.xpandStatus = false;
      this.FindAllOrgByHeadOrgID();
      this.homeInput = false;
      this.addTeamDiv = true;
      $("#PlaceOrOfficeCheck").attr("disabled", false);
    } else if (e.srcElement.id === "WFH") {
      this.homeInput = true;
      this.officeInput = false;
      this.getCurrentPoslatlng();
      this.boundryContain = true;
      this.nearbyAddress = this.formatted_address;
      this.addTeamDiv = false;
      $("#PlaceOrOfficeCheck").prop("disabled", true);
    }
  }

  OnClose() {
    this.closeBtn.nativeElement.click();
    this.getAllTimeLog();
    this.selectedVal = "";
    this.projDesc = false;
    this.showProjDesc = false;
    this.selectedGroupVal = "empty";
    this.setCurrentLocation();
    this.systemidText = "";
    this.othersDataValue = "";
    this.showAdminTasks = false;
    this.groupModel = null;
    this.locationModel = null;
    $("#toggleAdminCheck").prop("checked", false);
    $("#isTeam").prop("checked", false);
    $("#homeCheck").prop("checked", false);
    if (this.teamAdd) {
      this.resetAddedTeams();
    }
    this.placeDiv = false;
    this.officeHomeDiv = true;
    this.officeInput = true;

    /* this.xpandStatus = false;
this.FindAllOrgByHeadOrgID(); */
  }

  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    if (navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.currentPoslng = +pos.coords.longitude;
        this.currentPoslat = +pos.coords.latitude;
      });
    }
    this.drag = true;
    this.projectPoslat = $event.coords.lat;
    this.projectPoslng = $event.coords.lng;
    this.SetPosition($event.coords.lat, $event.coords.lng);
    this.getAddress(this.latitude, this.longitude);
    this.getCurrentAddress(this.currentPoslat, this.currentPoslng);
    var contentCenter = '<span class="infowin">Center Marker </span>',
      contentA = '<span class="infowin">Marker A </span>';

    var latLngCenter = new google.maps.LatLng(
        this.currentPoslat,
        this.currentPoslng
      ),
      latLngCMarker = new google.maps.LatLng(
        this.currentPoslat,
        this.currentPoslng
      ),
      latLngA = new google.maps.LatLng($event.coords.lat, $event.coords.lng), //project loaction
      mapOptions = {
        center: latLngCenter,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      },
      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 19,
        center: latLngCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
      }),
      markerCenter = new google.maps.Marker({
        position: latLngCMarker,
        title: "Location",
        map: map,
        draggable: false,
      }),
      infoCenter = new google.maps.InfoWindow({
        content: contentCenter,
      }),
      markerA = new google.maps.Marker({
        position: latLngA,
        title: "Location",
        map: map,
        draggable: true,
      }),
      infoA = new google.maps.InfoWindow({
        content: contentA,
      }),
      circle = new google.maps.Circle({
        map: map,
        clickable: false,
        radius: 500,
        fillColor: "#fff",
        fillOpacity: 0.6,
        strokeColor: "#313131",
        strokeOpacity: 0.4,
        strokeWeight: 2,
        center: latLngCenter,
      });
    var bounds = circle.getBounds();
    let bound = bounds.contains(latLngA);
    if (bound == false) {
      Swal.fire({
        title: "Dragging the marker outside radius isn't allowed",
        text: "Please select precise location",
        type: "error",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.value === true) {
          this.setCurrentLocation();
        }
      });
    }
  }

  getCurrentAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (results) {
          this.cgeoCodeData = results[2];
        }
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 15;
            this.cgetMatchedTypes();
            if (this.drag == true) {
              this.cgetMatchedTypes();
            }
            this.current_address = results[0].formatted_address;
            this.current_formatted_address = results[2].formatted_address;
          } else {
            Swal.fire("Please try again!", "Location not found", "error").then(
              (result) => {}
            );
          }
        } else if (status === "ERROR") {
          Swal.fire(
            "Please try again!",
            "Please check the internet connection",
            "error"
          ).then((result) => {});
        } else if (status === "REQUEST_DENIED") {
          Swal.fire(
            "Please try again!",
            "Please allow location access",
            "error"
          ).then((result) => {});
        } else if (status === "OVER_QUERY_LIMIT") {
          Swal.fire(
            "Please try again!",
            "Subscription exceeded.Please contact Admin",
            "error"
          ).then((result) => {});
        } else {
          Swal.fire("Please try again!", status, "error").then((result) => {});
        }
      }
    );
  }

  public cgetMatchedTypes() {
    let address_components;
    if (this.cgeoCodeData.length != 0) {
      address_components = this.cgeoCodeData["address_components"];
    }
    console.log("address_components", address_components);
    let i, j, types;
    let address_component;
    for (i = 0; i < address_components.length; i++) {
      types = address_components[i]["types"];
      for (j = 0; j < types.length; j++) {
        if (types[j] == "street_number") {
          this.current_street_number = address_components[i]["short_name"];
        }
        if (types[j] === "route") {
          this.current_route = address_components[i]["long_name"];
        }
        if (types[j] === "neighborhood") {
          this.current_street_number = address_components[i]["long_name"];
        }
        if (types[j] === "locality") {
          this.current_locality = address_components[i]["long_name"];
        }
        if (types[j] === "administrative_area_level_1") {
          this.current_administrative_area_level_1 =
            address_components[i]["long_name"];
        }
        if (types[j] === "administrative_area_level_2") {
          this.current_administrative_area_level_2 =
            address_components[i]["long_name"];
        }
        if (types[j] === "postal_code") {
          this.current_postal_code = address_components[i]["long_name"];
        }
        if (types[j] === "country") {
          this.current_country = address_components[i]["long_name"];
        }
      }
    }
  }

  /* public getCurrentPoslatlng(){
  if(navigator){
  navigator.geolocation.getCurrentPosition(pos => {
    this.currentPoslng = +pos.coords.longitude;
    this.currentPoslat = +pos.coords.latitude;
    });
  }else{
    this.currentPoslng = undefined;
    this.currentPoslat = undefined;
  }
} */

  /* private setCurrentLocation() {
  var options = {
    enableHighAccuracy: true, maximumAge:15000, timeout:60000
  };
  if('geolocation' in navigator){
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
    },function(error){
        Swal.fire(
        'Something went wrong',
        'Unable to get location because ' + error.message,
        'error'
        ).then((result)=> {})
    }, options);
  }
} */

  public selectedContent(text: any) {
    this.selectedText = text;
  }

  public changedProject(e: any): void {
    this.selectedProject = e.value;

    this.projectValue = e.value;

    if (this.projectValue == 2) {
      this.showTask = true;
    } else {
      this.showTask = false;
    }
  }

  changedMeetingTask(e) {
    this.meetingTaskValue = e.value;
    this.actTextInputValue = e.value;
    if (e.value != "") {
      this.meetingTaskValueTxt = e.data[0].text;
      this.recentActtxtSel = false;
      this.recentTaskSel = false;
      this.recentActTaskSel = false;
    }
    this.ValidateProjectTask(e.value);
  }

  public getAllActivity() {
    this.qtnService.FetchLocalActivityOrgID().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];
        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            id: data[i].id,
            text: data[i].activity_name,
          });
        }

        this.meetingTaskData = results;
        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public changedTask(e: any): void {
    this.selectedTask = e.value;

    this.taskValue = e.value;
    if (this.taskValue == 2) {
      this.showActivities = true;
    } else {
      this.showActivities = false;
    }
  }

  public changedActivity(e: any): void {
    this.activityValue = e.value;
  }

  public changedActTaskStatus(e: any): void {
    console.log("Justin", e);
    this.currrentTaskText = e.data[0].text;
    this.actTaskStatusValue = e.value;
    if (e.value != "" && e.value != "Select") {
      if (e.data[0].text == "Completed") {
        //this.showSlider=true;
        this.sliderForm.patchValue({
          slider: 1,
        });
        this.sliderForm.get("slider").disable();
      } else {
        // this.showSlider=false;
        this.sliderForm.patchValue({
          slider: 0,
        });
        this.sliderForm.get("slider").enable();
      }
    }

    if (this.checkIfProjectTask && e.value === this.underReviewStatID) {
      console.log("Justin", "run");
      this.sliderForm.patchValue({
        slider: 0.95,
      });
      this.sliderForm.get("slider").enable();
    }
  }

  //get current task histry
  GetTaskHistoryByTskId(subTaskId) {
    let userInfo = JSON.parse(localStorage.getItem("user_info"));
    let taskData = { orgID: userInfo.org_id, id: subTaskId };
    this.timeService.GetTaskHistoryByTskId(taskData).subscribe((data: any) => {
      console.log("Justin", data);
      if (data.length !== 0) {
        this.taskHistoryData = data;
        if (data[0].StatusName === "Submitted for review") {
          this.preRevisionCount = Number(data[0].RevisionCount);
        }
      } else {
        this.preRevisionCount = 0;
      }
    });
  }

  public openDetailedView(type) {
    //$('#details_view_modal').modal('show')
    //  $('#activity_log_modal').modal('hide')
    console.log("openDetailedView", type);
    if (type == "activityLog") {
      $("#activity_log_modal").removeClass("fade").modal("hide");

      this.closeActLog = true;
      console.log("if", type);
    } else if (type == "timeLog") {
      $("#time_log_modal").removeClass("fade").modal("hide");
      // this.timeLogBtn.nativeElement.click();

      this.closeActLog = false;
      console.log("else", type);
    }

    $("#details_view_modal").modal("show").addClass("fade");
  }

  closeDetailsViewModal() {
    // $('#details_view_modal').modal('hide')
    // $('.modal-backdrop').remove();
    //  $('#activity_log_modal').modal('show')
    $("#details_view_modal").removeClass("fade").modal("hide");
    this.detailCloseBtn.nativeElement.click();

    if (this.closeActLog == true) {
      $("#activity_log_modal").modal("show").addClass("fade");
    } else {
      $("#time_log_modal").modal("show").addClass("fade");
    }
  }
  selectedLead(id) {
    // $('#details_view_modal').modal('hide')
    // $('.modal-backdrop').remove();
    //  $('#activity_log_modal').modal('show')
    this.typeValue = id;
    this.closeDetailsViewModal();
  }
  public changedTeam(e: any): void {
    this.teamValue = e.value;
    if (this.teamValue.length == 0) {
      //console.log('this.empDataSource--->',this.empDataSource);
      //console.log('Re-setting the Employee Array--->',this.teamValue.length);
      this.empDataSource = [];
      this.teamMemFetchData = [];
      this.teamsValFetchData = [];
      this.teams = [];
    }
  }

  public changedEmployee(e: any): void {
    this.employeeValue = e.value;
  }

  public addLeave() {
    // $('#addLeave').show();
    $("#leave_modal").modal("show");
    this.FetchLeaveStatusOrgID();
    this.getLeaveSetup();
    this.getAllEmployee();
    this.getAllEmployeeList();
  }
  public OnLeaveClose() {
    // $('#addLeave').show();
    $("#leave_modal").modal("hide");
  }
  public customRadioChange() {
    //
    // if(this.projectForm.get('prefixVal').value=='is_custom'){
    //   this.showPrefixText=true;
    // }else{
    //   this.showPrefixText=false;
    //  // this.FindAutoProjectPrefixByOrgID();
    // }
  }
  public onApply(e) {}
  public showOptions() {
    var sel = $(".sel"),
      txt = $(".txt"),
      options = $(".options");

    sel.click(function (e) {
      e.stopPropagation();
      options.show();
    });

    $("body").click(function (e) {
      options.hide();
    });

    options.children("div").click(function (e) {
      e.stopPropagation();

      $(this).addClass("selected").siblings("div").removeClass("selected");
    });
  }
  public showtimer() {
    $(".clockpicker").clockpicker({
      autoclose: false,
      placement: "bottom",
      align: "left",
      donetext: "Done",
      afterDone: () => {},
    });
  }
  public changedOthersData(e: any): void {
    this.othersDataValue = e.value;
    if (e.value == 5) {
      this.showComments = true;
    } else {
      this.showComments = false;
    }
  }
  public changedOfficeData(e: any): void {
    this.officeDataValue = e.value;
  }
  public changedAdminTask(e: any): void {
    this.AdminTaskValue = e.value;
    if (e.value) {
      this.adminSel = false;
      this.recentActAdminSel = false;
      this.GetTop10TimesheetAdminActivityOnGroupIDAndAdminID(
        this.activityGroupID,
        e.value
      );
    } else {
      this.adminSel = true;
      this.recentActAdminSel = true;

      this.AdminTaskValue = "";
    }
  }
  public selectedOption(e): void {
    this.xpandStatus = false;
    this.selectedValue = e.org_name;
    this.selectedOfficeId = e.org_id;
    this.selectedentitiyLoc = e.entityLocation;
    this.drag = true;
    this.projectPoslat = e.entityLocation ? e.entityLocation.lat : "";
    this.projectPoslng = e.entityLocation ? e.entityLocation.lang : "";
    this.OffcSetPosition(
      e.entityLocation.lat,
      e.entityLocation.lang,
      e.entityLocationRadius
    );
  }
  public changedActTask(e: any): void {
    console.log("this value", e);
    // this.ActTaskValue=e.value;
    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    if (e.value) {
      this.projTaskDataValue = e.value;
      this.projTaskDataText = e.data[0].text;
      this.activityDataText = e.data[0].additional.milestone;

      this.acttaskListValue = e.data[0].additional.milestone_id;

      //  this.officeActInputValue=e.data[0].additional.milestone;
      if (this.showActivityTasks) {
        this.officeActListValue = e.data[0].additional.milestone_id;
        this.officeactText = e.data[0].additional.milestone;
      } else {
        this.officeActListValue = "";
        this.officeactText = "";
      }
      this.taskSel = false;
      this.recentActTaskSel = false;
      this.actTaskStatusValue = e.data[0].additional.status_id;
      if (e.data[0].additional.status_id == this.openStatID) {
        this.allowUpdateStatus = true;
      } else {
        this.allowUpdateStatus = false;
      }
      this.projectId = e.data[0].additional.project_id;
      //this.GetProjSubTaskonTaskID(e.value);
      this.GetAllMainandLocalSubTaskListByEmployeeId(e.value);
      if (
        e.data[0].additional.assigne_id == user["id"] ||
        e.data[0].additional.assigne_id == "Anyone"
      ) {
        this.enableActTaskStatus = false;
      } else {
        this.enableActTaskStatus = true;
      }
      this.GetTop10TimesheetActivityOnTaskID(e.value);
    } else {
      this.recentActTaskSel = true;

      this.taskSel = true;

      this.projTaskDataValue = "";
      this.activityDataText = "";
    }
  }
  actTextInputChange(event) {
    this.actTextInputValue = event.target.value;

    if (event.target.value != "") {
      this.recentActtxtSel = false;
    }
  }
  subTextInputChange(event) {
    this.subTextInputValue = event.target.value;

    if (event.target.value != "") {
      this.subtxtSel = false;
    } else {
      this.subtxtSel = true;
    }
  }

  officactTextInputChange(event) {
    this.officeActInputValue = event.target.value;

    if (event.target.value != "") {
      this.actTxt = false;
    } else {
      this.actTxt = true;
    }
  }
  changedOffcMeetingTask(event) {
    if (event.data) {
      this.officeActInputValue = event.data[0].text;
    }
    this.offcMeetingTaskValue = event.value;
    if (event.value != "" || event.value != "Select") {
      this.actTxt = false;
    } else {
      this.actTxt = true;
    }
  }

  remarksInputChange(event) {
    this.remarksInputValue = event.target.value;
  }

  public changedProjTask(e: any): void {
    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }

    if (e.value != "") {
      this.recentTaskSel = false;
      this.projTaskDataValue = e.value;
      this.projTaskDataText = e.data[0].text;
      this.actTaskStatusValue = e.data[0].additional.status_id;
      if (e.data[0].additional.status_id == this.openStatID) {
        this.allowUpdateStatus = true;
      } else {
        this.allowUpdateStatus = false;
      }
      this.GetProjSubTaskonTaskID(e.value);
      // this.projectId=e.data[0].additional.project_id;
      if (e.data[0].additional.assigned_empid == user["id"]) {
        this.enableActTaskStatus = false;
      } else {
        this.enableActTaskStatus = true;
      }
      this.GetTop10TimesheetActivityOnTaskID(e.value);
    } else {
      this.recentTaskSel = true;

      this.projTaskDataValue = "";
    }
  }
  public changedProjAct(e: any): void {
    this.acttaskListValue = e.value;
    if (e.value) {
      this.showprojTask = true;
      this.activityDataText = e.data.length != 0 ? e.data[0].text : "";
      this.recentActSel = false;
      this.recentTaskSel = false;
      this.recentTaskSel = false;
      this.recentActtxtSel = false;
      this.GetProjTaskonActID(e.value);
    } else {
      this.recentActSel = true;

      this.showprojTask = false;
    }
  }

  //old Function
  public GetProjSubTaskonTaskID(id): void {
    let postData = { id: id };

    this.projectService.GetAllSubTaskByTaskID(postData).subscribe(
      (data: any) => {
        console.log("Sub Task", data);

        var results = [
          {
            id: "",
            text: "Select",
            additional: {
              assigned_empid: "",
              status_id: "",
            },
          },
        ];
        // let dataObj = JSON.parse(data['token']);

        if (data.length != 0 && data != null) {
          for (var i = 0; i < data.length; i++) {
            // logik to create new items
            if (data[i].status_name != "Completed") {
              results.push({
                id: data[i].id,
                text: data[i].sub_task_name,
                additional: {
                  assigned_empid: data[i].assigned_empid,
                  status_id: data[i].status_id,
                },
              });
            }
          }
          this.projSubTaskData = results;
          if (this.sub_taskId != "") {
            let taskId = this.sub_taskId.split("/");
            console.log("taskId", taskId);
            this.projSubtaskListValue = taskId[0];
            this.projSubtaskText = taskId[1];
          }
        } else {
          this.projSubTaskData = [];
          this.officeSubtaskListValue = "";
          this.officeSubtaskText = "";
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  //new Function
  public GetAllMainandLocalSubTaskListByEmployeeId(id): void {
    let postData = { taskID: id };
    console.log(postData);
    this.projectService.GetAllSubtaskListByTaskEmpId(postData).subscribe(
      (data: any) => {
        console.log("Sub Task", data);
        var results = [
          {
            id: "",
            text: "Select",
            additional: {
              assigned_empid: "",
              status_id: "",
            },
          },
        ];

        if (data.length != 0 && data != null) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].statusName != "Completed") {
              results.push({
                id: data[i].subtaskId,
                text: data[i].subtaskName,
                additional: {
                  assigned_empid: data[i].employeeId,
                  status_id: data[i].statusId,
                },
              });
            }
          }
          this.projSubTaskData = results;
          console.log("this", this.projSubTaskData);
          console.log("this", this.projSubTaskData.length);
          if (this.sub_taskId != "") {
            let taskId = this.sub_taskId.split("/");
            console.log("taskId", taskId);
            this.projSubtaskListValue = taskId[0];
            this.projSubtaskText = taskId[1];
          }
        } else {
          console.log("this", this.projSubTaskData.length);
          this.projTaskDataValue = id;
          this.projSubTaskData = [];
          this.officeSubtaskListValue = "";
          this.officeSubtaskText = "";
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  public changedPurposeData(e: any): void {
    this.act_purposeValue = e.value;
  }
  public projectsView() {
    $("#complain_content").hide();
    $("#project_content").show();
    $("#task_content").hide();
    $("#assignee_content").hide();
  }
  public complainView() {
    $("#complain_content").show();
    $("#project_content").hide();
    $("#task_content").hide();
    $("#assignee_content").hide();
  }
  public taskView() {
    $("#complain_content").hide();
    $("#project_content").hide();
    $("#task_content").show();
    $("#assignee_content").hide();
  }
  public assignedView() {
    $("#complain_content").hide();
    $("#project_content").hide();
    $("#task_content").hide();
    $("#assignee_content").show();
  }

  public checkValue(e: any): void {
    // this.teamValue= e.value;
    this.showTeamSelect = !this.showTeamSelect;

    if (e.srcElement.checked) {
      $("#team_modal").modal("show");
      this.FindTeamsByOrgID();
      this.getAllDesignationByOrgID();
      this.getAllOutsourcedEmpByOrgID();
      this.EmpList();
      // this.openModal();
    }
  }

  public open_team_modal() {
    $("#team_modal").modal("show");
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

  public templateResult: Select2TemplateFunction = (
    state: Select2OptionData
  ): JQuery | string => {
    if (!state.id) {
      return state.text;
    }

    return jQuery(
      "<div><b>" +
        state.text +
        "</b> " +
        "<span> " +
        state.additional.teamBy +
        "</span></div>"
    );
  };
  public taskDescResult: Select2TemplateFunction = (
    state: Select2OptionData
  ): JQuery | string => {
    if (!state.id) {
      return state.text;
    }

    return jQuery(
      "<div><b>" +
        state.text +
        "</b> " +
        "<span> " +
        state.additional.assignee +
        "</span>" +
        "<div> " +
        state.additional.taskDesc +
        "</div>" +
        "<div> " +
        state.additional.milestone +
        "<div> " +
        state.additional.dueDate +
        "</div>" +
        "</div>"
    );
  };
  // function for selection template
  public templateSelection: Select2TemplateFunction = (
    state: Select2OptionData
  ): JQuery | string => {
    if (!state.id) {
      return state.text;
    }

    return jQuery(
      "<span><b>" + state.text + "</b> " + state.additional.teamBy + "</span>"
    );
    //return jQuery('<div><b>' + state.text+ '</b></div> ' + '<div>'+ state.additional.teamBy + '</div>');
  };
  public taskDescSelection: Select2TemplateFunction = (
    state: Select2OptionData
  ): JQuery | string => {
    if (!state.id) {
      return state.text;
    }

    return jQuery(
      "<span><b>" + state.text + "</b> " + state.additional.assignee + "</span>"
    );
    //return jQuery('<div><b>' + state.text+ '</b></div> ' + '<div>'+ state.additional.teamBy + '</div>');
  };
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public clearSearchField() {
    this.searchField = "";
    this.fetchDataGrid();
  }
  public onAddTimeSheet() {
    //  this.getUsersInfo();
    this.getTimesheetByEmpId();
    // this.spinner.show();
    this.setCurrentLocation();
    if (localStorage.getItem("currentTime")) {
      let checkINtIME = localStorage.getItem("currentTime");
      let date = moment().format("MM/DD/YYYY");
      this.checkInTime = date.concat(" " + checkINtIME);
    }
    this.teamCheckIn = false;
    //  let date=document.getElementById('ntpDate').innerText;
    //

    let groupid = this.group_id ? this.group_id : "";

    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }

    let postData = {
      team_member_empid: [user["id"]],
      teamid: null,
      check_in: this.checkInTime,
      createdby: user_info["full_name"],
      is_inrange: this.boundryContain,

      // ...this.othersDataValue.length!=0?{"TimesheetAdministrativeViewModel": {
      //   "administrative_id":this.othersDataValue
      // }}:{"TimesheetAdministrativeViewModel":null},
      ...(this.selectedGroupVal != "empty"
        ? {
            TimesheetCategoryViewModel: {
              project_category_type: this.selectedGroupVal,
              project_or_comp_id: this.systemid,
              project_or_comp_name: this.systemidText,
              project_or_comp_type: "",
            },
          }
        : { TimesheetCategoryViewModel: null }),

      TimesheetSearchLocationViewModel: null,

      TimesheetCurrentLocationViewModel: {
        formatted_address: this.formatted_address ? this.formatted_address : "",
        lat: this.latitude ? JSON.stringify(this.latitude) : "",
        lang: this.longitude ? JSON.stringify(this.longitude) : "",
        street_number: this.street_number ? this.street_number : "",
        route: this.route ? this.route : "",
        locality: this.locality ? this.locality : "",
        administrative_area_level_2: this.administrative_area_level_2
          ? this.administrative_area_level_2
          : "",
        administrative_area_level_1: this.administrative_area_level_1
          ? this.administrative_area_level_1
          : "",
        postal_code: "",
        country: this.country ? this.country : "",
      },

      //  ...this.othersDataValue.length!=0? {"timesheet_administrative":this.othersDataValue}:{"timesheet_administrative":[
      //   ""
      // ]}
    };
    console.log("onAddTimeSheetpostData", postData);
    if (this.selectedGroupVal != "Office") {
      return this.timeService.AddTimeLog(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            console.log("placecheckin");

            this.spinner.hide();
            // this.disableAddLog=false;
            this.checkin = false;
            this.breakin = true;
            this.breakout = false;
            this.checkout = true;
            if (this.jobFilterValue != "") {
              this.getalltaskbyJob(this.jobFilterValue);
            }
            // $("#checkin_log_modal").modal('hide');
            this.closeBtn.nativeElement.click();

            this.LastCheckinByEmpID();

            this.getTimesheetByEmpId();
            this.selectedVal = "";
            this.selectedGroupVal = "empty";
            this.systemidText = "";
            this.othersDataValue = "";
            this.showAdminTasks = false;
            this.groupModel = null;
            this.locationModel = null;
            this.showProjDesc = false;

            $("#toggleAdminCheck").prop("checked", false);
            $("#isTeam").prop("checked", false);
            this.selectedDeptVal = "";
            this.toastr.success(data.desc);
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
    if (this.selectedGroupVal == "Office" && this.boundryContain == true) {
      return this.timeService.AddTimeLog(postData).subscribe(
        (data: any) => {
          console.log("Officecheckin");
          if (data.status == 200) {
            this.spinner.hide();
            // this.disableAddLog=false;
            this.checkin = false;
            this.breakin = true;
            this.breakout = false;
            this.checkout = true;
            if (this.jobFilterValue != "") {
              this.getalltaskbyJob(this.jobFilterValue);
            }
            // $("#checkin_log_modal").modal('hide');
            this.closeBtn.nativeElement.click();

            this.LastCheckinByEmpID();

            this.getTimesheetByEmpId();
            this.selectedVal = "";
            this.selectedGroupVal = "empty";
            this.systemidText = "";
            this.othersDataValue = "";
            this.showAdminTasks = false;
            this.groupModel = null;
            this.locationModel = null;
            this.showProjDesc = false;

            $("#toggleAdminCheck").prop("checked", false);
            $("#isTeam").prop("checked", false);
            this.selectedDeptVal = "";
            this.toastr.success(data.desc);
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    } else if (
      this.selectedGroupVal == "Office" &&
      this.boundryContain == false
    ) {
      console.log("Officecheckinfalse");

      Swal.fire(
        "Oops!",
        "Your current location isn't matched with the office location",
        "error"
      ).then((result) => {});
    }
  }
  public onTeamAdd() {
    this.teamCount = this.teamValue.concat(this.teamMembers);
    let teamMembers = this.teamCount;
    $("#team_modal").modal("hide");

    teamMembers.push(user_info["id"]);

    $("#toggleCheck").prop("checked", false);
    $("#toggleCheck").attr("checked", false);
    // $('#toggleCheck').attr('disabled', 'disabled')

    //   this.editTeam=true;
    //   $('#toggleCheck').prop('disabled',true);
    // $('#toggleCheck').attr('disabled', true);

    //  let groupid=this.group_id ? this.group_id:'string';
    let checkinIME = localStorage.getItem("currentTime");
    let date = moment().format("MM/DD/YYYY");
    this.checkInTime = date.concat(" " + checkinIME);
  }

  //noCall
  public openCheckout() {
    if (this.currentPoslat == undefined) {
      Swal.fire({
        title: "Location Access Denied",
        text: "Please turn on the location access for checkin",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "CANCEL!",
      }).then((result) => {
        //       if (result.value) {
        // }
      }); //         this.spinner.show();
    } else {
      //$("#checkout_modal").modal('show');
    }
  }
  public showDesc() {
    this.projDesc = true;
  }

  //remove
  GetProjectListByEmpID() {
    console.log("by employee");
    this.projectService.FetchAllProjectByEmpID().subscribe(
      (projectData: any) => {
        var results = [{ id: "", text: "Select", additional: { teamBy: "" } }];
        if (projectData) {
          for (var i = 0; i < projectData.length; i++) {
            results.push({
              id: projectData[i].project_id,
              text: projectData[i].project_name,
              additional: {
                teamBy: projectData[i].project_prefix,
              },
            });
          }
        }
        this.projectFilterListByEmp = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  //remove
  FetchAllProjectByEmpID() {
    this.projectService.FetchAllProjectByEmpID().subscribe(
      (projectData: any) => {
        var results = [{ id: "", text: "Select", additional: { teamBy: "" } }];
        if (projectData) {
          for (var i = 0; i < projectData.length; i++) {
            results.push({
              id: projectData[i].project_id,
              text: projectData[i].project_name,
              additional: {
                teamBy: projectData[i].project_prefix,
              },
            });
          }
        }
        this.selectedCategData = results;
        this.selectedJobData = results;
        this.projectFilterListByEmp = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  public FindAllOrgByHeadOrgID() {
    console.log("this api");
    this.orgService.FindAllOrgByHeadOrgID().subscribe(
      (orgData: any) => {
        console.log("this api 2", orgData);
        if (orgData) {
          for (var i = 0; i < orgData.length; i++) {
            // logik to create new items
            if (orgData[i].org_id == localStorage.getItem("org_id")) {
              this.selecteOptionValue = orgData[i].org_name;
              // this.selectedValue=orgData[i].org_name;
              this.selectedOfficeId = orgData[i].org_id;

              this.selectedentitiyLoc = orgData[i].entityLocation;
              this.checkOptionValue = true;
              this.selectedOption(orgData[i]);
            }

            //  this.getCurrentPoslatlng();

            this.projectPoslat = this.latitude;
            this.projectPoslng = this.longitude;
            //this.SetPosition(orgData[i].entityLocation.lat,orgData[i].entityLocation.lang);
          }

          this.officeData = orgData;
          console.log(this.officeData);
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public onSubmitTeam() {
    this.setCurrentLocation();
    this.spinner.show();
    this.teamCount = this.teamMemFetchData.length;
    let teamMembers = this.teamMembers;
    teamMembers.push(user_info["id"]);

    $("#toggleCheck").prop("checked", true);
    $("#toggleCheck").attr("checked", true);
    $("#toggleCheck").attr("disabled", "disabled");
    let team_member_empid = [];

    if (this.teamMemFetchData) {
      for (var i = 0; i < this.teamMemFetchData.length; i++) {
        team_member_empid.push(this.teamMemFetchData[i].id);
      }
    }
    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    team_member_empid.push(user["id"]);

    //   this.editTeam=true;
    //   $('#toggleCheck').prop('disabled',true);
    // $('#toggleCheck').attr('disabled', true);
    $("#team_modal").modal("hide");

    let groupid = this.group_id ? this.group_id : "";
    let checkinIME = localStorage.getItem("currentTime");
    let date = moment().format("MM/DD/YYYY");
    this.checkInTime = date.concat(" " + checkinIME);

    let postData = {
      team_member_empid: team_member_empid,

      teamid: this.teamValue,

      check_in: this.checkInTime,

      createdby: user["full_name"],

      TimesheetAdministrativeViewModel: {
        ...(this.othersDataValue.length != 0
          ? { administrative_id: this.othersDataValue }
          : { administrative_id: [""] }),
      },
      TimesheetCategoryViewModel: {
        ...(this.selectedGroupVal != "empty"
          ? { project_category_type: this.selectedGroupVal }
          : { project_category_type: "" }),
        project_or_comp_id: this.systemid,
        project_or_comp_name: this.systemidText,
        project_or_comp_type: "",
      },
      TimesheetSearchLocationViewModel: null,
      TimesheetCurrentLocationViewModel: {
        formatted_address: this.formatted_address ? this.formatted_address : "",
        lat: this.latitude ? JSON.stringify(this.latitude) : "",
        lang: this.longitude ? JSON.stringify(this.longitude) : "",
        street_number: this.street_number ? this.street_number : "",
        route: this.route ? this.route : "",
        locality: this.locality ? this.locality : "",
        administrative_area_level_2: this.administrative_area_level_2
          ? this.administrative_area_level_2
          : "",
        administrative_area_level_1: this.administrative_area_level_1
          ? this.administrative_area_level_1
          : "",
        postal_code: "",
        country: this.country ? this.country : "",
      },
    };

    return this.timeService.AddTimeLog(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        if (data.status == 200) {
          this.checkin = false;
          this.breakin = true;
          this.breakout = false;
          this.checkout = true;
          //  localStorage.setItem('is_checkout',JSON.stringify(false));

          // $("#checkin_log_modal").modal('hide');
          this.closeBtn.nativeElement.click();

          this.spinner.hide();
          if (this.teamAdd) {
            this.resetAddedTeams();
          }
          this.LastCheckinByEmpID();

          this.getTimesheetByEmpId();

          // this.getUsersInfo();
          this.toastr.success(data.desc);
          this.teamCheckIn = true;
          this.selectedVal = "";
          this.selectedGroupVal = "empty";
          this.systemidText = "";
          this.othersDataValue = "";
          this.showAdminTasks = false;
          this.groupModel = null;
          this.locationModel = null;
          $("#toggleAdminCheck").prop("checked", false);
          $("#isTeam").prop("checked", false);
          this.teamValue = "";
          this.filterEmpByDept = false;
          this.filterEmpByDesgn = false;
          this.teamMemberValue = "";
          this.teamMembers = [];
          this.selectedDeptVal = "";
          this.teamAdd = false;
        }
        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        this.spinner.hide();

        Swal.fire("Error!", "Error.", "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public onCheckChange() {
    this.billable = !this.billable;
  }
  public AddTimesheetBreakIn() {
    //  localStorage.setItem('is_checkout',JSON.stringify(true))

    // this.editable=true;
    // this.editDeptId=dept_id;
    //   let postData={
    //     id:dept_id
    //   }
    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    // teamMembers.push(user_info['id'])
    if (localStorage.getItem("currentTime")) {
      let breakTime = localStorage.getItem("currentTime");
      let date = moment().format("MM/DD/YYYY");
      this.breakInTime = date.concat(" " + breakTime);
    }

    let groupid = this.group_id ? this.group_id : "";
    let postData = {
      id: null,
      team_member_empid: this.teamEmpId,

      groupid: groupid,
      break_in: this.breakInTime,
      break_out: null,
      //"is_inrange": this.boundryContain,

      createdby: user["full_name"],
      TimesheetCurrentLocationViewModel: {
        geo_address: this.formatted_address ? this.formatted_address : "",
        formatted_address: this.formatted_address ? this.formatted_address : "",
        lat: this.latitude ? JSON.stringify(this.latitude) : "",
        lang: this.longitude ? JSON.stringify(this.longitude) : "",
        street_number: this.street_number ? this.street_number : "",
        route: this.route ? this.route : "",
        locality: this.locality ? this.locality : "",
        administrative_area_level_2: this.administrative_area_level_2
          ? this.administrative_area_level_2
          : "",
        administrative_area_level_1: this.administrative_area_level_1
          ? this.administrative_area_level_1
          : "",
        postal_code: "",
        country: this.country ? this.country : "",
      },
    };
    // this.checkin=false;
    // this.breakin=false;
    // this.breakout=true;
    // this.checkout=false;
    //  this.countupTimerService.startTimer();

    this.timeService.AddTimesheetBreak(postData).subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.spinner.hide();
          this.countupTimerService.startTimer();

          this.checkin = false;
          this.breakin = false;
          this.breakout = true;
          this.checkout = false;

          this.toastr.success("Break Timer Starts", undefined, {
            positionClass: "toast-top-center",
          });
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  public findLastBreakIn(grpid) {
    this.spinner.show();
    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    // teamMembers.push(user_info['id'])

    let groupid = this.group_id ? this.group_id : "";
    let postData = {
      EmpID: user["id"],

      GrpID: grpid,
    };
    // this.checkin=false;
    // this.breakin=false;
    // this.breakout=true;
    // this.checkout=false;
    //  this.countupTimerService.startTimer();

    this.timeService.FindLastTimeSheetBreakByEmpIDAndGrpID(postData).subscribe(
      (data: any) => {
        if (data.length != 0) {
          if (data[0].is_breakout == false) this.spinner.hide();
          this.countupTimerService.startTimer();

          this.checkin = false;
          this.breakin = false;
          this.breakout = true;
          this.checkout = false;

          //   this.toastr.success('Break Timer Starts', undefined,{
          //     positionClass: 'toast-top-center'
          // });
        } else {
          this.spinner.hide();
          this.countupTimerService.stopTimer();

          this.checkin = false;
          this.breakin = true;
          this.breakout = false;
          this.checkout = true;
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }
  public AddTimesheetBreakOut() {
    //  localStorage.setItem('is_checkout',JSON.stringify(true))

    // this.editable=true;
    // this.editDeptId=dept_id;
    //   let postData={
    //     id:dept_id
    //   }
    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    // teamMembers.push(user_info['id'])
    if (localStorage.getItem("currentTime")) {
      let breakTime = localStorage.getItem("currentTime");
      let date = moment().format("MM/DD/YYYY");
      this.breakOutTime = date.concat(" " + breakTime);
    }

    let groupid = this.group_id ? this.group_id : "";
    let postData = {
      team_member_empid: this.teamEmpId,

      groupid: groupid,

      break_out: this.breakOutTime,
      is_inrange: this.boundryContain,

      createdby: user["full_name"],
      TimesheetCurrentLocationViewModel: {
        geo_address: this.formatted_address ? this.formatted_address : "",
        formatted_address: this.formatted_address ? this.formatted_address : "",
        lat: this.latitude ? JSON.stringify(this.latitude) : "",
        lang: this.longitude ? JSON.stringify(this.longitude) : "",
        street_number: this.street_number ? this.street_number : "",
        route: this.route ? this.route : "",
        locality: this.locality ? this.locality : "",
        administrative_area_level_2: this.administrative_area_level_2
          ? this.administrative_area_level_2
          : "",
        administrative_area_level_1: this.administrative_area_level_1
          ? this.administrative_area_level_1
          : "",
        postal_code: "",
        country: this.country ? this.country : "",
      },
    };
    // this.checkin=false;
    // this.breakin=true;
    // this.breakout=false;
    // this.checkout=true;
    // this.countupTimerService.stopTimer();

    this.timeService.BreakOutByEmpID(postData).subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.spinner.hide();
          this.countupTimerService.stopTimer();

          this.checkin = false;
          this.breakin = true;
          this.breakout = false;
          this.checkout = true;

          this.toastr.success("Break Timer Ends", undefined, {
            positionClass: "toast-top-center",
          });
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  //location type checkin fun = place, office and wfh
  public onLocationSubmit() {
    this.setCurrentLocation();
    let team_member_empid = [];
    let groupid = this.group_id ? this.group_id : "";
    this.teamCount = this.teamMemFetchData.length;
    let typeOfCheckin;
    let typeOfCheckinValue;
    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }

    if (this.officeInput) {
      (typeOfCheckin = "Office"),
        (typeOfCheckinValue = this.selectedValue),
        (this.boundryContain = this.offcboundryContain);
    } else {
      (typeOfCheckin = "Place"),
        (typeOfCheckinValue = this.manualInputValue
          ? this.manualInputValue
          : this.formatted_address);
    }

    if (this.teamMemFetchData && this.teamAdd) {
      for (var i = 0; i < this.teamMemFetchData.length; i++) {
        team_member_empid.push(this.teamMemFetchData[i].id);
      }
    }

    team_member_empid.push(user["id"]);

    let teamMembers = this.teamMembers;
    teamMembers.push(user["id"]);
    let checkinIME = localStorage.getItem("currentTime");
    let date = moment().format("MM/DD/YYYY");
    this.checkInTime = date.concat(" " + checkinIME);

    let postData = {
      ...(!this.teamAdd
        ? { team_member_empid: [user["id"]] }
        : { team_member_empid: team_member_empid }),
      teamid:
        this.teamMemFetchData.length != 0 && this.teamValue != ""
          ? this.teamValue
          : null,
      check_in: this.checkInTime,
      createdby: user["full_name"],
      is_inrange: typeOfCheckin == "Manual" ? true : this.boundryContain,

      // "TimesheetCategoryViewModel": null,

      TimesheetCategoryViewModel: {
        project_category_type: typeOfCheckin,
        project_or_comp_id:
          typeOfCheckin == "Office" ? this.selectedOfficeId : null,
        project_or_comp_name: typeOfCheckinValue,
        project_or_comp_type: null,
      },
      TimesheetSearchLocationViewModel: {
        manual_address: this.manualInputValue ? this.manualInputValue : "",
        ...(!this.officeInput
          ? {
              geo_address:
                this.changed_address && !this.officeInput && !this.manualInput
                  ? this.changed_address
                  : this.formatted_address,

              formatted_address:
                this.changed_address && !this.officeInput && !this.manualInput
                  ? this.changed_address
                  : this.formatted_address,
              lat: this.latitude ? JSON.stringify(this.latitude) : "",
              lang: this.longitude ? JSON.stringify(this.longitude) : "",
              street_number: this.changed_street_number
                ? this.changed_street_number
                : this.street_number,
              route: this.changed_route ? this.changed_route : this.route,
              locality: this.changed_locality
                ? this.changed_locality
                : this.locality,
              administrative_area_level_2: this
                .changed_administrative_area_level_2
                ? this.changed_administrative_area_level_2
                : this.administrative_area_level_2,
              administrative_area_level_1: this
                .changed_administrative_area_level_1
                ? this.changed_administrative_area_level_1
                : this.administrative_area_level_1,
              postal_code: "",
              country: this.changed_country
                ? this.changed_country
                : this.country,
            }
          : {
              geo_address: this.selectedentitiyLoc
                ? this.selectedentitiyLoc.geo_address
                : "",

              formatted_address: this.selectedentitiyLoc
                ? this.selectedentitiyLoc.formatted_address
                : "",
              lat: this.selectedentitiyLoc ? this.selectedentitiyLoc.lat : "",
              lang: this.selectedentitiyLoc ? this.selectedentitiyLoc.lang : "",
              street_number: this.selectedentitiyLoc
                ? this.selectedentitiyLoc.street_number
                : "",
              route: this.selectedentitiyLoc
                ? this.selectedentitiyLoc.route
                : "",
              locality: this.selectedentitiyLoc
                ? this.selectedentitiyLoc.locality
                : "",
              administrative_area_level_2: this.selectedentitiyLoc
                ? this.selectedentitiyLoc.administrative_area_level_2
                : "",
              administrative_area_level_1: this.selectedentitiyLoc
                ? this.selectedentitiyLoc.administrative_area_level_1
                : "",
              postal_code: "",
              country: this.selectedentitiyLoc
                ? this.selectedentitiyLoc.country
                : "",
            }),
        is_office: this.officeInput ? true : false,
        is_manual: this.placeDiv ? true : false,
        is_wfh: this.homeInput ? true : false,
      },
      TimesheetCurrentLocationViewModel: {
        formatted_address: this.formatted_address ? this.formatted_address : "",
        lat: this.latitude ? JSON.stringify(this.latitude) : "",
        lang: this.longitude ? JSON.stringify(this.longitude) : "",
        street_number: this.street_number ? this.street_number : "",
        route: this.route ? this.route : "",
        locality: this.locality ? this.locality : "",
        administrative_area_level_2: this.administrative_area_level_2
          ? this.administrative_area_level_2
          : "",
        administrative_area_level_1: this.administrative_area_level_1
          ? this.administrative_area_level_1
          : "",
        postal_code: "",
        country: this.country ? this.country : "",
      },
    };
    if (this.teamAdd) {
      this.teamCheckIn = true;
    }

    console.log("onLocationSubmit", postData);
    this.spinner.show();
    this.typeOfCheckin = typeOfCheckin;

    if (this.latitude === undefined) {
      Swal.fire({
        title: "Oops can't get the Location",
        text: "Please check for Internet speed or location access and try again",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
      });
    } else {
      //excute if other than office checkin
      if (typeOfCheckin != "Office") {
        return this.timeService.AddTimeLog(postData).subscribe(
          (data: any) => {
            //console.log('type1',postData);
            if (data.status == 200) {
              this.closeBtn.nativeElement.click();
              this.showProjDesc = false;
              this.spinner.hide();
              if (this.teamAdd) {
                this.resetAddedTeams();
              }
              this.LastCheckinByEmpID();
              this.getTimesheetByEmpId();
              // this.getUsersInfo();
              this.toastr.success(data.desc);
              this.officeInput = false;
              this.manualInput = false;
              this.homeInput = false;
              this.showMap = true;
              this.selectedVal = "";
              this.selectedGroupVal = "empty";
              this.systemidText = "";
              this.othersDataValue = "";
              this.showAdminTasks = false;
              this.groupModel = null;
              this.locationModel = null;
              this.manualInputValue = $("#manualInput").val();
              $("#toggleAdminCheck").prop("checked", false);
              $("#isTeam").prop("checked", false);
              this.teamValue = "";
              this.filterEmpByDept = false;
              this.filterEmpByDesgn = false;
              this.teamMemberValue = "";
              this.teamMembers = [];
              this.selectedDeptVal = "";
              this.teamAdd = false;
              this.nearbyAddress = "";
            }
          },
          (error) => {
            this.spinner.hide();
            Swal.fire("Error!", "Error.", "error").then((result) => {});
          }
        );
      }

      //excute if office checkin
      if (typeOfCheckin == "Office" && this.boundryContain) {
        return this.timeService.AddTimeLog(postData).subscribe(
          (data: any) => {
            //console.log('type2',postData)
            if (data.status == 200) {
              this.closeBtn.nativeElement.click();
              this.showProjDesc = false;
              this.spinner.hide();
              if (this.teamAdd) {
                this.resetAddedTeams();
              }
              //this.searchElementRef.nativeElement='';
              this.LastCheckinByEmpID();
              this.getTimesheetByEmpId();
              // this.getUsersInfo();
              this.toastr.success(data.desc);
              this.officeInput = false;
              this.manualInput = false;
              this.homeInput = false;
              this.showMap = true;
              this.selectedVal = "";
              this.selectedGroupVal = "empty";
              this.systemidText = "";
              this.othersDataValue = "";
              this.showAdminTasks = false;
              this.groupModel = null;
              this.locationModel = null;
              this.manualInputValue = $("#manualInput").val();
              $("#toggleAdminCheck").prop("checked", false);
              $("#isTeam").prop("checked", false);
              this.teamValue = "";
              this.filterEmpByDept = false;
              this.filterEmpByDesgn = false;
              this.teamMemberValue = "";
              this.teamMembers = [];
              this.selectedDeptVal = "";
              this.teamAdd = false;
              this.nearbyAddress = "";
            }
          },
          (error) => {
            this.spinner.hide();
            Swal.fire("Error!", "Error.", "error").then((result) => {});
          }
        );
      } else if (typeOfCheckin == "Office" && this.boundryContain == false) {
        console.log("Officecheckinfalse");
        this.spinner.hide();
        Swal.fire(
          "Oops!",
          "Your current location isn't matched with the office location",
          "error"
        ).then((result) => {});
      }
    }
  }

  public FindTeamsByOrgID() {
    this.teamService.FindTeamsByOrgID().subscribe(
      (data: any) => {
        var results = [];
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            results.push({
              id: data[i].id,
              text: data[i].team_name,
              additional: {
                teamBy: data[i].team_by,
              },
            });
          }
        }

        this.teamData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public onEditSubmit() {
    // this.timeLogForm.get('deptName').valueChanges
    // .subscribe((mode: string) => {
    //   if (mode) {
    //
    //   }
    // });
    // let date=document.getElementById('ntpDate').innerText;
    this.spinner.show();

    let postData = {
      id: this.editDeptId,
      // ondate:moment(date).format('L'),
      check_in: this.timeLogForm.get("checkIn").value,
      check_out: this.timeLogForm.get("checkOut").value,
    };

    if (this.timeLogForm.get("checkIn").value !== "") {
      return this.timeService.updateTimeLog(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {
            // this.toastr.success(data.desc);
            this.spinner.hide();

            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          }
          // this.router.navigate(["/organizations"]);
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    }
  }
  // showModal(): void {
  //   this.clockPickerDialogService.showClockPickerDialog(this.config).subscribe((time: string) =>
  // }
  public addLog() {
    // this.fetchDataGrid();

    this.FetchAllProjectByOrgID();

    $("#time_log_modal").modal("show");

    // #myModal (id of modal box)
    this.maxAddLogEndTime = localStorage.getItem("currentTime");
    this.editable = false;
    //console.log('minOfficeActInputTime',this.minOfficeActInputTime);
    //  function show_popup() {
    //   $('#clockP').clockpicker({

    //   }),
    // clockpicker js
    //}
    // window.setTimeout(show_popup, 1000);
  }

  public openActivityLog(element, isDisableTask) {
    console.log(element);
    this.ValidateProjectTask(element.subTaskId);
    if (isDisableTask) {
      this.isDisableTask = true;
    }
    this.act_proj_name = "";
    this.act_sys_name = "";
    this.act_formatted_address = "";
    //this.GetAllAdministrative();
    this.GetAllTaskByEmpID();
    this.getTimesheetByEmpId();
    this.showPurposeToggle = true;
    this.maxAddLogEndTime = localStorage.getItem("currentTime");
    if (element.statusName == "Open") {
      this.allowUpdateStatus = true;
    } else {
      this.allowUpdateStatus = false;
    }
    this.minStartTime = this.minOfficeActInputTime;

    $("#activity_log_modal").modal("show");
    //this.GetProjSubTaskonTaskID(element.id)
    this.GetAllMainandLocalSubTaskListByEmployeeId(element.taskId);
    if (element.subTaskId != null) {
      this.sub_taskId = element.subTaskId + "/" + element.subTaskName;
    } else {
      this.sub_taskId = "";
    }
    setTimeout(() => {
      $("#taskField").prop("checked", true),
        (this.showActivityTasks = true),
        (this.showPurposeTasks = false),
        (this.projTaskDataValue = element.taskId),
        (this.projTaskDataText = element.taskName);
      console.log(
        "projTaskDataValue",
        this.projTaskDataValue,
        this.taskWithDesc
      );

      if (element.subTaskId != null) {
        this.sub_taskId = element.subTaskId + "/" + element.subTaskName;
      } else {
        this.sub_taskId = "";
      }
    }, 500);

    console.log("sub task id", element.subTaskId);
    this.activityLogForm.patchValue({
      endTime: moment().format("hh:mm a"),
    });
    this.activityLogForm.get("endTime").enable();
    this.actTaskStatusValue = element.statusId;

    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }

    if (element.employeeId !== null) {
      if (
        element.employeeId == user["id"] ||
        element.assigned_empid == "Anyone"
      ) {
        this.enableActTaskStatus = false;
      } else {
        this.enableActTaskStatus = true;
      }
    } else if (element.leadId !== null) {
      if (element.leadId == user["id"] || element.assigned_empid == "Anyone") {
        this.enableActTaskStatus = false;
      } else {
        this.enableActTaskStatus = true;
      }
    }

    if (element.projectId != null) {
      this.projectId = element.projectId;
      this.acttaskListValue = element.milestoneId;
      this.activityDataText = element.milestoneName;
    }

    this.GetTaskHistoryByTskId(element.subTaskId);
  }

  ValidateProjectTask(subTaskId) {
    let taskData = {
      id: subTaskId,
    };
    this.timeService.ValidateProjectTask(taskData).subscribe((data: any) => {
      if (data.length === 0) {
        this.checkIfProjectTask = false;
      } else {
        this.checkIfProjectTask = true;
      }
      this.getAllStatus();
    });
  }

  public addActivity(element) {
    let slider: Slider = new Slider({ value: 30 });
    this.isDisableTask = false;
    // Render initialized Slider
    slider.appendTo("#slider");

    this.act_proj_name = "";
    this.act_sys_name = "";
    this.act_formatted_address = "";
    //this.GetAllAdministrative();
    this.GetAllTaskByEmpID();
    if (element.timesheetDataModels.length != 0) {
      let minTime = element.timesheetDataModels[0].check_in;
      this.minStartTime = moment(minTime).format("hh:mm a");
      let maxTime = element.timesheetDataModels[0].check_out;
      if (maxTime != null) {
        this.maxEndTime = moment(maxTime).format("hh:mm a");
      } else {
        this.maxEndTime = localStorage.getItem("currentTime");
      }
    }
    if (element.timesheetProjectCategoryDataModel != null) {
      if (
        element.timesheetProjectCategoryDataModel.project_or_comp_id != null
      ) {
        this.projectId =
          element.timesheetProjectCategoryDataModel.project_or_comp_id;
        this.fetchActByProjectID(
          element.timesheetProjectCategoryDataModel.project_or_comp_id
        );
      }
    }
    //  this.GetAllTimesheetActivitys();
    this.activityGroupID = element.timesheetDataModels[0].groupid;
    // this.fetchDataGrid();
    if (element.timesheetProjectCategoryDataModel != null) {
      if (
        element.timesheetProjectCategoryDataModel.project_type == "Office" ||
        element.timesheetProjectCategoryDataModel.project_type == "Manual" ||
        element.timesheetProjectCategoryDataModel.project_type == "Place"
      ) {
        this.showPurposeToggle = true;
        if (element.timesheetSearchLocationViewModel.is_manual) {
          this.act_formatted_address =
            element.timesheetSearchLocationViewModel.manual_address;
        } else {
          this.act_formatted_address =
            element.timesheetSearchLocationViewModel.geo_address;
        }
        // this.act_formatted_address=element.timesheetSearchLocationViewModel.geo_address
      } else if (
        element.timesheetProjectCategoryDataModel.project_type == "Job" ||
        element.timesheetProjectCategoryDataModel.project_type == "Case"
      ) {
        this.act_proj_name =
          element.timesheetProjectCategoryDataModel.project_type;
        this.act_sys_name =
          element.timesheetProjectCategoryDataModel.project_or_comp_name;
        this.showPurposeToggle = false;
      }
    } else if (element.timesheetSearchLocationViewModel != null) {
      this.showPurposeToggle = true;

      // if(element.timesheetSearchLocationViewModel.is_manual){
      //   this.act_formatted_address=element.timesheetSearchLocationViewModel.manual_address

      // }else{
      //   this.act_formatted_address=element.timesheetSearchLocationViewModel.geo_address

      // }
    } else {
    }
    $("#activity_log_modal").modal("show");

    // #myModal (id of modal box)
    //  function show_popup() {
    //   $('#clockP').clockpicker({

    //   }),
    // clockpicker js
    //}
    // window.setTimeout(show_popup, 1000);
  }

  RemoveTimesheetActivity(timesheetActID) {
    Swal.fire({
      title: "Delete this Activity ?",
      text: "Please Note you won't be able to revert this",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        console.log(timesheetActID);
        let project_id = {
          id: timesheetActID,
        };
        this.timeService.RemoveEmployeeTimesheetActivity(project_id).subscribe(
          (data: any) => {
            if (data.status === "200") {
              this.getTimesheetByEmpId();
              if (this.showProjBasedTasks) {
                this.getalltaskbyJob(this.jobFilterValue);
              } else {
                this.getAllTaskbyLocalJoB(this.jobFilterValue);
              }
            } else {
              console.log(data);
            }
          },
          (error) => {
            Swal.fire("Error!", error, "error").then((result) => {});
          }
        );
      }
    });
  }

  public getAllOutsourcedEmpByOrgID() {
    this.empService.getAllOutsourcedEmpByOrgID().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          for (var i = 0; i < data && data.length; i++) {
            // logik to create new items

            results.push({
              id: data[i].id,
              text: data[i].full_name,
            });
          }
        }

        this.employeeData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public onActivType(val) {
    this.selectedActivVal = val;
    if ((this.selectedActivVal = "Activity")) {
      this.GetAllTimesheetActivitys();
    }
  }

  public onAddTimesheetActivity() {
    // this.spinner.show();
    this.checkIfProjectTask = false;
    this.addActformSubmitted = true;
    this.isRecentActFieldValid();

    let postData;
    if (this.activityLogForm.get("startTime").value) {
      let startTime = this.activityLogForm.get("startTime").value;
      let endTime = this.activityLogForm.get("endTime").value;
      let date = moment().format("MM/DD/YYYY");
      this.startTime = date.concat(" " + startTime);
      this.endTime = date.concat(" " + endTime);
    }
    // this.LastAddedTimesheetActivityByEmpID(this.startTime,this.endTime)
    let sliderValue = this.sliderForm.get("slider").value * 100;
    console.log("sliderValue", sliderValue);
    let taskValue = "";
    let projtaskText = "";
    if (this.projSubTaskData.length != 0) {
      taskValue = this.projSubtaskListValue;
      projtaskText = this.projSubtaskText;
    } else {
      taskValue = this.projTaskDataValue;
      projtaskText = this.projTaskDataText;
    }

    let statusID =
      this.currrentTaskText === "Submitted for review"
        ? this.underReviewStatID
        : sliderValue == 100
        ? this.completedStatID
        : this.projTaskDataValue && this.allowUpdateStatus && sliderValue != 100
        ? this.inProgressStatID
        : this.inProgressStatID;

    if (this.planType == "Basic") {
      postData = {
        id: null,
        groupid: this.activityGroupID ? this.activityGroupID : this.group_id,
        org_id: localStorage.getItem("org_id"),
        project_id: this.projectId,
        //"project_id":(!this.showPurposeTasks && !this.showActivityTasks && !this.showPurposeToggle && !this.showMeetingAct)?this.taskProjectId:this.projectId,

        milestone_id: this.acttaskListValue ? this.acttaskListValue : null,
        // "milestone_name":this.activityDataText?this.activityDataText:$("#activty_text").val(),
        milestone_name: this.activityDataText
          ? this.activityDataText
          : this.meetingTaskValueTxt,

        task_id: this.projTaskDataValue ? taskValue : null,
        task_name:
          this.projTaskDataValue && !this.showMeetingAct
            ? projtaskText
            : this.showPurposeToggle &&
              !this.showPurposeTasks &&
              !this.showActivityTasks
            ? $("#actSubject_text").val()
            : $("#subject_text").val(),

        // "task_name":(this.projTaskDataValue && !this.showMeetingAct)?(this.activityDataText?$("#actSubject_text").val():this.projTaskDataText):(this.activityDataText?$("#actSubject_text").val():$("#subject_text").val()),
        //"status_id":sliderValue==100?this.completedStatID:(this.actTaskStatusValue!=''?this.actTaskStatusValue:null),
        status_id: statusID,
        // "subtask_id": this.selecteSubTaskValue?this.selecteSubTaskValue:null,
        RevisionCount: this.preRevisionCount,
        remarks: this.activityLogForm.get("remarks").value,
        ondate: "",
        start_time: this.startTime,
        end_time: this.endTime,
        is_billable: this.billable,
        worked_percent:
          (this.showActivityTasks &&
            !this.showPurposeTasks &&
            this.projTaskDataValue != "") ||
          (!this.showPurposeTasks &&
            !this.showActivityTasks &&
            !this.showPurposeToggle &&
            this.showprojTask &&
            !this.showMeetingAct)
            ? sliderValue
            : null,
      };
    } else {
      postData = {
        id: null,
        groupid: this.activityGroupID ? this.activityGroupID : this.group_id,
        org_id: localStorage.getItem("org_id"),

        // "project_id":(!this.showPurposeTasks && !this.showActivityTasks && !this.showPurposeToggle && !this.showMeetingAct)?this.taskProjectId:this.projectId,
        project_id: this.projectId,

        //"project_id":this.activityDataText?this.projectId:this.typeValue,

        milestone_id: this.acttaskListValue ? this.acttaskListValue : null,
        // "milestone_name":this.activityDataText?this.activityDataText:$("#activty_text").val(),
        milestone_name: this.activityDataText
          ? this.activityDataText
          : this.meetingTaskValueTxt,
        task_id: this.projTaskDataValue ? taskValue : null,
        task_name:
          this.projTaskDataValue && !this.showMeetingAct
            ? projtaskText
            : this.showPurposeToggle &&
              !this.showPurposeTasks &&
              !this.showActivityTasks
            ? $("#actSubject_text").val()
            : $("#subject_text").val(),

        // "task_name":this.projTaskDataValue?this.projTaskDataText:null,
        // "task_name":(this.projTaskDataValue && !this.showMeetingAct)?this.projTaskDataText:$("#subject_text").val(),

        //"status_id":sliderValue==100?this.completedStatID:(this.actTaskStatusValue!=''?this.actTaskStatusValue:null),
        status_id: statusID,

        // "subtask_id": this.selecteSubTaskValue?this.selecteSubTaskValue:null,
        remarks: this.activityLogForm.get("remarks").value,
        RevisionCount: this.preRevisionCount,
        ondate: null,
        start_time: this.startTime,
        end_time: this.endTime,
        is_billable: this.billable,
        worked_percent:
          (this.showActivityTasks &&
            !this.showPurposeTasks &&
            this.projTaskDataValue != "") ||
          (!this.showPurposeTasks &&
            !this.showActivityTasks &&
            !this.showPurposeToggle &&
            this.showprojTask &&
            !this.showMeetingAct)
            ? sliderValue
            : null,
      };
    }

    console.log("Justin", postData);
    let sendData = {
      entity_id: this.projectId,
      event_type: "Added Activitie",
      event_desc: "Successfully lead Activitie Added",
    };
    this.histSer.AddEntityHistoryLog(sendData).subscribe((data) => {
      console.log(data);
    });
    if (
      this.projTaskDataValue &&
      this.allowUpdateStatus &&
      sliderValue != 100
    ) {
      let postData = {
        id: taskValue,

        status_id: this.inProgressStatID,
      };
      console.log("allowUpdateStatus", postData);
    }

    if (
      this.activityLogForm.get("startTime").status == "VALID" &&
      this.activityLogForm.get("endTime").status == "VALID" &&
      !this.recentTaskSel &&
      !this.recentActtxtSel &&
      !this.recentActTaskSel &&
      this.timeinrange &&
      (this.relatedValue != "" &&
      this.relatedValue != "Select" &&
      this.relatedValue != "NA"
        ? this.typeValue != ""
        : true) &&
      !this.startEqualEnd
    ) {
      console.log("AddTimesheetActivityvalid");
      this.spinner.show();
      console.log("time sheet data", postData);
      /* return this.activityService.AddTimesheetActivity(postData).subscribe( */
      return this.activityService.AddTimesheetActivityLog(postData).subscribe(
        (data: any) => {
          console.log("line number ready", data);
          if (data.status == 200) {
            let userData = {
              orgID: localStorage.getItem("org_id"),
              id: this.projectId,
            };
            this.activityService
              .UpdateAdvancetoRevenue(userData)
              .subscribe((data: any) => {
                console.log(data);
              });

            if (
              this.projTaskDataValue &&
              this.allowUpdateStatus &&
              sliderValue != 100
            ) {
              console.log("allowUpdateStatusSucees", postData);

              let statusData = {
                id: taskValue,

                status_id: this.inProgressStatID,
              };

              this.taskService.UpdateTaskStatus(statusData).subscribe(
                (data: any) => {
                  if (data) {
                    this.allowUpdateStatus = false;
                  }
                },
                (error) => {
                  this.spinner.hide();

                  Swal.fire("Error!", error, "error").then(
                    //used Arrow function here
                    (result) => {
                      //  this.router.navigate(['/dashboard']);
                    }
                  );
                }
              );
            }
            this.spinner.hide();
            this.sliderForm.reset();
            $("#activity_log_modal").modal("hide");
            this.actCloseBtn.nativeElement.click();

            this.getTimesheetByEmpId();
            this.showMeetingAct = false;

            $("#adminActivity").prop("checked", false);
            $("#meetingAct").prop("checked", false);
            $("#subject_text").value = "";
            $("#actSubject_text").value = "";

            $("#meetingAct").prop("checked", false);
            this.showPurposeTasks = false;
            this.showPurposeToggle = false;
            this.projTaskDataValue = "";
            this.projTaskDataText = "";
            this.acttaskListValue = "";
            this.activityDataText = "";
            this.actTextInputValue = "";
            this.meetingTaskValue = "";
            this.sub_taskId = "";
            this.projSubtaskListValue = "";
            this.projSubtaskText = "";
            this.projSubTaskData = [];
            this.relatedValue = "";
            this.typeValue = "";
            this.projectId = null;
            this.recentTaskSel = false;
            this.recentActtxtSel = false;
            this.recentActTaskSel = false;
            this.recentSubTaskSel = false;

            this.activityLogForm.reset();
            this.activityLogForm.patchValue({
              startTime: null,
              endTime: null,
            });
            this.selectedActivVal = "";
            this.actTaskStatusValue = "";
            // this.GetAllTaskByEmpID();

            if (this.jobFilterValue != "") {
              this.getalltaskbyJob(this.jobFilterValue);
            } else {
              this.GetAllTaskByEmpID();
            }

            if (this.showProjBasedTasks) {
              this.getalltaskbyJob(this.jobFilterValue);
            } else {
              this.getAllTaskbyLocalJoB(this.jobFilterValue);
            }

            this.addActformSubmitted = false;
            this.showActivityTasks = false;
            this.sliderForm.get("slider").enable();
            this.enableActTaskStatus = false;
            $("#billable").prop("checked", false);
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          } else {
            this.spinner.hide();
            this.sliderForm.reset();
            $("#activity_log_modal").modal("hide");
            Swal.fire("Error!", data["desc"], "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        },
        (error) => {
          this.spinner.hide();
          this.addActformSubmitted = false;

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }
  public ActInputChange(event) {
    this.officeActInputValue = event.target.value;
  }
  public onAddOfficeTimesheetActivity() {
    this.addformSubmitted = true;
    this.isOfficeFieldValid();
    let postData;
    if (this.OfficeLogForm.get("startTime").value) {
      let startTime = this.OfficeLogForm.get("startTime").value;
      let endTime = this.OfficeLogForm.get("endTime").value;
      let date = moment().format("MM/DD/YYYY");
      this.startOfficTime = date.concat(" " + startTime);
      this.endOfficTime = date.concat(" " + endTime);
    }
    let sliderValue = this.sliderForm.get("slider").value * 100;
    // if(this.showPurposeTasks){
    //   this.activityReq
    // }
    let taskValue = "";
    let officetaskText = "";
    if (this.projSubTaskData.length != 0) {
      taskValue = this.officeSubtaskListValue;
      officetaskText = this.officeSubtaskText;
    } else {
      taskValue =
        this.selectedActivGroupVal == "Activity"
          ? this.showActivityTasks && !this.showPurposeTasks
            ? this.projTaskDataValue
            : this.officetaskListValue
          : this.projTaskDataValue;
      officetaskText =
        this.selectedActivGroupVal == "Activity"
          ? this.showActivityTasks && !this.showPurposeTasks
            ? this.projTaskDataText
            : this.officetaskText
          : this.projTaskDataText;
    }
    console.log("required", taskValue, officetaskText);
    console.log(
      "projSubTaskData",
      this.projSubTaskData,
      this.projTaskDataValue
    );

    if (this.planType == "Basic") {
      postData = {
        id: null,
        groupid: this.officegroupID ? this.officegroupID : "",
        org_id: localStorage.getItem("org_id"),

        project_id:
          this.selectedActivGroupVal == "Activity"
            ? !this.showPurposeTasks && !this.showActivityTasks
              ? this.typeValue
              : this.projectId
            : this.selecteJobOptionValue,
        milestone_id: this.officeActListValue ? this.officeActListValue : null,
        milestone_name:
          this.selectedActivGroupVal == "Activity"
            ? !this.showPurposeTasks && !this.showActivityTasks
              ? this.officeActInputValue
              : this.officeactText != ""
              ? this.officeactText
              : null
            : this.officeactText != ""
            ? this.officeactText
            : null,
        task_id:
          this.selectedActivGroupVal != "Activity"
            ? this.officetaskListValue
              ? taskValue
              : null
            : this.projTaskDataValue
            ? taskValue
            : null,
        task_name:
          this.selectedActivGroupVal != "Activity"
            ? this.officetaskListValue
              ? officetaskText
              : null
            : !this.showPurposeTasks && !this.showActivityTasks
            ? $("#offactSubject_text").val()
            : this.projTaskDataValue
            ? officetaskText
            : null,
        // "milestone_name":this.activityDataText?this.activityDataText:$("#activty_text").val(),
        //"status_id":sliderValue==100?this.completedStatID:(this.actTaskStatusValue!=''?this.actTaskStatusValue:null),
        status_id:
          sliderValue == 100
            ? this.completedStatID
            : this.projTaskDataValue &&
              this.allowUpdateStatus &&
              sliderValue != 100
            ? this.inProgressStatID
            : this.inProgressStatID,

        // "subtask_id": this.selecteSubTaskValue?this.selecteSubTaskValue:null,
        remarks: this.OfficeLogForm.get("remarks").value,
        ondate: null,
        start_time: this.startOfficTime,
        end_time: this.endOfficTime,

        is_billable: this.billable,
        worked_percent:
          (this.showActivityTasks &&
            !this.showPurposeTasks &&
            this.projTaskDataValue != "") ||
          (!this.showPurposeTasks &&
            !this.showActivityTasks &&
            !this.showPurposeToggle &&
            this.showprojTask &&
            !this.showMeetingAct)
            ? sliderValue
            : null,
      };
    } else {
      postData = {
        id: null,
        groupid: this.officegroupID ? this.officegroupID : "",
        org_id: localStorage.getItem("org_id"),

        project_id:
          this.selectedActivGroupVal == "Activity"
            ? !this.showPurposeTasks && !this.showActivityTasks
              ? this.typeValue
              : this.projectId
            : this.selecteJobOptionValue,
        milestone_id: this.officeActListValue ? this.officeActListValue : null,
        milestone_name:
          this.selectedActivGroupVal == "Activity"
            ? !this.showPurposeTasks && !this.showActivityTasks
              ? this.officeActInputValue
              : this.officeactText != ""
              ? this.officeactText
              : null
            : this.officeactText != ""
            ? this.officeactText
            : null,
        //  "task_id": this.selectedActivGroupVal!='Activity' ? (this.officetaskListValue?taskValue:null):(this.projTaskDataValue?(this.projTaskDataValue ):null),
        //  "task_name":this.selectedActivGroupVal!='Activity' ? (this.officetaskListValue?officetaskText:null):((!this.showPurposeTasks && !this.showActivityTasks)?$("#offactSubject_text").val():(this.projTaskDataValue?this.projTaskDataText:null)),
        task_id:
          this.selectedActivGroupVal != "Activity"
            ? this.officetaskListValue
              ? taskValue
              : null
            : this.projTaskDataValue
            ? taskValue
            : null,
        task_name:
          this.selectedActivGroupVal != "Activity"
            ? this.officetaskListValue
              ? officetaskText
              : null
            : !this.showPurposeTasks && !this.showActivityTasks
            ? $("#offactSubject_text").val()
            : this.projTaskDataValue
            ? officetaskText
            : null,
        // "subtask_id": this.selecteSubTaskValue?this.selecteSubTaskValue:null,
        //"status_id":sliderValue==100?this.completedStatID:(this.actTaskStatusValue!=''?this.actTaskStatusValue:null),
        status_id:
          sliderValue == 100
            ? this.completedStatID
            : this.projTaskDataValue &&
              this.allowUpdateStatus &&
              sliderValue != 100
            ? this.inProgressStatID
            : this.inProgressStatID,

        remarks: this.OfficeLogForm.get("remarks").value,
        ondate: null,
        start_time: this.startOfficTime,
        end_time: this.endOfficTime,
        is_billable: this.billable,
        worked_percent:
          (this.showActivityTasks &&
            !this.showPurposeTasks &&
            this.projTaskDataValue != "") ||
          (!this.showPurposeTasks &&
            !this.showActivityTasks &&
            !this.showPurposeToggle &&
            this.showprojTask &&
            !this.showMeetingAct)
            ? sliderValue
            : null,
      };
    }
    let typeValid = true;
    if (
      this.relatedValue != "" &&
      this.relatedValue != "Select" &&
      this.relatedValue != "NA" &&
      this.typeValue != ""
    ) {
      typeValid = true;
      console.log("typeValid");
    } else if (
      this.relatedValue != "" &&
      this.relatedValue != "Select" &&
      this.relatedValue != "NA" &&
      this.typeValue == ""
    ) {
      typeValid = false;
      console.log("typeINValid");
    }
    //  if(this.officeSubtaskListValue && this.allowOfficUpdateStat && sliderValue!=100 ){
    //   let postData={
    //     id: taskValue,
    //     status_id: this.inProgressStatID,
    //   }
    //   console.log('allowOfficUpdateStat',postData)
    // }
    console.log("typeValid", typeValid);
    if (
      this.OfficeLogForm.get("startTime").status == "VALID" &&
      this.OfficeLogForm.get("endTime").status == "VALID" &&
      typeValid === true &&
      this.selectedActivGroupVal == "Activity"
        ? !this.showActivityTasks
          ? this.officeActInputValue != ""
          : !this.taskSel
        : this.officeActListValue != "" &&
          this.timeinrange &&
          !this.offcStartEqualEnd
    ) {
      console.log("offcvalid", this.typeValue, this.relatedValue);
      typeValid = true;
      this.spinner.show();

      /* return this.activityService.AddTimesheetActivity(postData).subscribe( */
      return this.activityService.AddTimesheetActivityLog(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            if (this.jobFilterValue != "") {
              this.getalltaskbyJob(this.jobFilterValue);
            } else {
              this.GetAllTaskByEmpID();
            }
            if (
              this.officeSubtaskListValue &&
              this.allowOfficUpdateStat &&
              sliderValue != 100
            ) {
              let statusData = {
                id: taskValue,

                status_id: this.inProgressStatID,
              };

              this.taskService.UpdateTaskStatus(statusData).subscribe(
                (data: any) => {
                  if (data) {
                    this.allowOfficUpdateStat = false;
                  }
                },
                (error) => {
                  this.spinner.hide();

                  Swal.fire("Error!", error, "error").then(
                    //used Arrow function here
                    (result) => {
                      //  this.router.navigate(['/dashboard']);
                    }
                  );
                }
              );
            }
            this.timeLogBtn.nativeElement.click();

            $("#time_log_modal").modal("hide");
            this.getTimesheetByEmpId();
            this.sliderForm.reset();
            $("#subject_text").value = "";

            this.spinner.hide();
            this.addformSubmitted = false;

            $("#officeActivityInput").val("");
            this.showPurposeTasks = false;
            this.showPurposeToggle = false;
            this.selectedActivGroupVal = "empty";
            this.selecteJobOptionValue = "";
            $("#activityInput").value = "";
            this.OfficeLogForm.reset();
            this.OfficeLogForm.patchValue({
              startTime: "",
              endTime: moment().format("L"),
            });
            this.AdminTaskValue = "";
            this.projTaskDataValue = "";
            this.selecteJobOptionValue = "";
            this.officeActListValue = "";
            this.officeActInputValue = "";
            this.officeactText = "";
            this.sub_taskId = "";

            this.addOfficAdminAct = false;

            this.projTaskDataValue = "";
            this.projTaskDataText = "";
            this.meetingTaskValue = "";
            this.relatedValue = "";
            this.typeValue = "";
            this.projSubTaskData = [];
            this.officetaskListValue = "";
            this.projSubtaskListValue = "";
            this.projSubtaskText = "";
            (this.showActivityTasks = false), this.activityLogForm.reset();
            this.sliderForm.get("slider").enable();
            $("#billable").prop("checked", false);
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["desc"], "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        },
        (error) => {
          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }
  isOfficeFieldValid() {
    if (this.addformSubmitted) {
      if (
        this.selectedActivGroupVal == "Activity" &&
        this.addOfficAdminAct &&
        this.showPurposeTasks &&
        this.AdminTaskValue == ""
      ) {
        this.adminSel = true;
      } else if (
        this.selectedActivGroupVal != "Activity" &&
        this.showActivityTasks &&
        !this.showPurposeTasks &&
        this.projTaskDataValue == ""
      ) {
        this.taskSel = true;
      } else if (
        this.selectedActivGroupVal == "Activity" &&
        this.officeActInputValue == "" &&
        !this.showActivityTasks
      ) {
        this.actTxt = true;
      } else {
        this.adminSel = false;
        this.taskSel = false;
      }
    } else {
      return (
        // this.showerrorMsg=false,

        false
      );
    }
  }
  isRecentActFieldValid() {
    if (this.addActformSubmitted) {
      if (
        !this.showPurposeTasks &&
        !this.showActivityTasks &&
        !this.showPurposeToggle &&
        this.acttaskListValue == ""
      ) {
        this.recentActSel = true;
      } else if (
        !this.showPurposeTasks &&
        !this.showActivityTasks &&
        !this.showPurposeToggle &&
        this.showprojTask &&
        this.projTaskDataValue == ""
      ) {
        this.recentTaskSel = true;
      } else if (
        this.showPurposeToggle &&
        !this.showPurposeTasks &&
        !this.showActivityTasks &&
        this.actTextInputValue == ""
      ) {
        this.recentActtxtSel = true;
      } else if (this.showPurposeTasks && this.AdminTaskValue == "") {
        this.recentActAdminSel = true;
      } else if (
        !this.showPurposeTasks &&
        this.showActivityTasks &&
        this.projTaskDataValue == ""
      ) {
        this.recentActTaskSel = true;
      } else if (this.officeActInputValue == "" && !this.showActivityTasks) {
        this.actTxt = true;
      } else {
        this.adminSel = false;
        this.taskSel = false;
      }
    } else {
      return (
        // this.showerrorMsg=false,

        false
      );
    }
  }
  isFieldValid(field: string) {
    if (this.addformSubmitted) {
      return (
        (this.showerrorMsg = true),
        (this.OfficeLogForm.get(field).errors &&
          this.OfficeLogForm.get(field).touched) ||
          (this.OfficeLogForm.get(field).untouched && this.addformSubmitted)
      );
    } else {
      return (this.showerrorMsg = false), false;
    }
    // return (
    //   this.projectForm.get(field).errors && this.projectForm.get(field).touched ||
    //   this.projectForm.get(field).untouched &&
    //   this.formSubmitted && this.projectForm.get(field).errors  && this.projectForm.get(field).errors.patternValidator

    // );
  }

  isActivityLogFieldValid(field: string) {
    if (this.addActformSubmitted) {
      return (
        (this.showerrorMsg = true),
        (this.activityLogForm.get(field).errors &&
          this.activityLogForm.get(field).touched) ||
          (this.activityLogForm.get(field).untouched &&
            this.addActformSubmitted)
      );
    } else {
      return (this.showerrorMsg = false), false;
    }
  }

  public onAddTimesheetAdminActivity() {
    this.addActformSubmitted = true;
    this.isRecentActFieldValid();
    if (this.activityLogForm.get("startTime").value) {
      let startTime = this.activityLogForm.get("startTime").value;
      let endTime = this.activityLogForm.get("endTime").value;
      let date = moment().format("MM/DD/YYYY");
      this.startTime = date.concat(" " + startTime);
      this.endTime = date.concat(" " + endTime);
    }
    let postData = {
      id: null,
      administrative_id:
        this.planType == "Basic" ? this.AdminTaskValue : this.AdminTaskValue,
      groupid: this.activityGroupID ? this.activityGroupID : "",
      purpose: this.activityLogForm.get("purpose").value,
      remarks: this.activityLogForm.get("remarks").value,
      ondate: "",
      start_time: this.startTime,
      end_time: this.endTime,

      is_deleted: true,
    };
    if (
      this.activityLogForm.get("startTime").value !== "" &&
      this.activityLogForm.get("endTime").value !== "" &&
      !this.recentActAdminSel
    ) {
      this.spinner.show();

      return this.activityService.AddTimesheetAdminActivity(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            $("#activity_log_modal").modal("hide");
            this.actCloseBtn.nativeElement.click();

            this.getTimesheetByEmpId();

            // this.getUsersInfo();
            this.spinner.hide();

            this.showPurposeToggle = false;
            this.showActivityTasks = false;
            this.showPurposeTasks = false;
            this.OfficeLogForm.reset();
            this.selectedActivVal = "";
            this.addActformSubmitted = false;

            this.AdminTaskValue = "";
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }

  public onAddOfficeTimesheetAdminActivity() {
    this.addformSubmitted = true;
    this.isOfficeFieldValid();

    if (this.OfficeLogForm.get("startTime").value) {
      let startTime = this.OfficeLogForm.get("startTime").value;
      let endTime = this.OfficeLogForm.get("endTime").value;
      let date = moment().format("MM/DD/YYYY");
      this.startTime = date.concat(" " + startTime);
      this.endTime = date.concat(" " + endTime);
    }
    let postData = {
      id: null,
      administrative_id:
        this.planType == "Basic" ? this.AdminTaskValue : this.AdminTaskValue,
      groupid: this.officegroupID ? this.officegroupID : "",

      purpose: this.OfficeLogForm.get("purpose").value,
      remarks: this.OfficeLogForm.get("remarks").value,
      ondate: "",
      start_time: this.startTime,
      end_time: this.endTime,

      is_deleted: true,
    };
    //
    if (
      this.OfficeLogForm.get("startTime").value != "" &&
      this.OfficeLogForm.get("endTime").value != "" &&
      this.OfficeLogForm.get("purpose").value != "" &&
      this.selectedActivGroupVal == "Activity"
        ? !this.adminSel
        : ""
    ) {
      this.spinner.show();

      return this.activityService.AddTimesheetAdminActivity(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            $("#time_log_modal").modal("hide");
            this.getTimesheetByEmpId();
            this.timeLogBtn.nativeElement.click();

            this.showPurposeToggle = false;
            this.showActivityTasks = false;
            this.showPurposeTasks = false;
            this.spinner.hide();
            this.selectedActivVal = "";
            this.addformSubmitted = false;

            this.OfficeLogForm.reset();
            this.selectedActivVal = "";
            this.selectedActivGroupVal = "Jobs";
            this.actTxt = false;
            this.AdminTaskValue = "";
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          }
        },
        (error) => {
          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }

  public GetAllTimesheetActivitys() {
    return this.activityService.GetAllTimesheetActivitys().subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        if (data.status == 200) {
        }
      },
      (error) => {
        Swal.fire("Error!", "Error.", "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public OnActivityClose() {
    $("#adminActivity").prop("checked", false);
    $("#taskField").prop("checked", false);
    $("#meetingAct").prop("checked", false);
    this.showMeetingAct = false;

    this.taskHistoryData = [];
    this.showRemarkError = false;
    this.checkIfProjectTask = false;

    this.showPurposeTasks = false;
    this.showActivityTasks = false;
    this.taskListValue = "";
    this.meetingTaskValue = "";

    this.activityLogForm.reset();
    $("#billable").prop("checked", false);
    $("#activity_log_modal").modal("hide");
    this.actCloseBtn.nativeElement.click();
    console.log("actfILETR", this.activityFilterValue);
    this.projTaskDataValue = "";
    this.showprojTask = false;
    this.acttaskListValue = "";
    this.activityDataText = "";
    this.projectId = null;
    this.projSubtaskListValue = "";

    this.selectedActivVal = "";
    this.AdminTaskValue = "";
    this.recentActTaskSel = false;
    this.startEqualEnd = false;
    this.addActformSubmitted = false;
    this.sliderForm.reset();
    this.sub_taskId = "";
    this.relatedValue = "";
    this.typeValue = "";

    if (this.jobFilterValue != "") {
      this.getalltaskbyJob(this.jobFilterValue);
    }

    this.activityLogForm.get("timeRadio").disable();
    this.errorTimeExcced = false;

    this.projSubTaskData = [];
  }
  getChangeList(): Select2OptionData[] {
    return [
      {
        id: "0",
        text: "Cars",
        children: [
          {
            id: "car1",
            text: "Car 1",
          },
          {
            id: "car2",
            text: "Car 2",
          },
          {
            id: "car3",
            text: "Car 3",
          },
        ],
      },
      {
        id: "0",
        text: "Planes",
        children: [
          {
            id: "plane1",
            text: "Plane 1",
          },
          {
            id: "plane2",
            text: "Plane 2",
          },
          {
            id: "plane3",
            text: "Plane 3",
          },
        ],
      },
    ];
  }
  public startTimeChanged() {
    this.disableEndTime = false;

    this.activityLogForm.get("startTime").valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      if (this.activityLogForm.get("startTime").value != "") {
        this.startValChange = true;
      }
      let startTime = this.activityLogForm.get("startTime").value;
      this.minEndTime = startTime;

      this.activityLogForm.get("endTime").enable();
      this.activityLogForm.get("timeRadio").enable();
      this.activityLogForm.patchValue({
        endTime: "",
      });
    });
    /**
     * name
     */
  }

  radioCahnge(value) {
    let startTime = this.activityLogForm.get("startTime").value;
    let CurrentTime = moment().format("hh:mm a");
    if (value === 15) {
      this.activityLogForm.patchValue({
        endTime: moment(startTime, "hh:mm a")
          .add(15, "minutes")
          .format("hh:mm a"),
      });

      if (
        new Date(
          moment().format("YYYY-MM-DD") +
            " " +
            this.activityLogForm.get("endTime").value
        ) > new Date(moment().format("YYYY-MM-DD") + " " + CurrentTime)
      ) {
        this.activityLogForm.patchValue({
          endTime: moment().format("hh:mm a"),
        });
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.activityLogForm.get("startTime").value,
          ", end Time",
          this.activityLogForm.get("endTime").value
        );
        this.errorTimeExcced = true;
      } else {
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.activityLogForm.get("startTime").value,
          ", end Time",
          this.activityLogForm.get("endTime").value
        );
        this.errorTimeExcced = false;
      }
    } else if (value === 30) {
      this.activityLogForm.patchValue({
        endTime: moment(startTime, "hh:mm a")
          .add(30, "minutes")
          .format("hh:mm a"),
      });

      if (
        new Date(
          moment().format("YYYY-MM-DD") +
            " " +
            this.activityLogForm.get("endTime").value
        ) > new Date(moment().format("YYYY-MM-DD") + " " + CurrentTime)
      ) {
        this.activityLogForm.patchValue({
          endTime: moment().format("hh:mm a"),
        });
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.activityLogForm.get("startTime").value,
          ", end Time",
          this.activityLogForm.get("endTime").value
        );
        this.errorTimeExcced = true;
      } else {
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.activityLogForm.get("startTime").value,
          ", end Time",
          this.activityLogForm.get("endTime").value
        );
        this.errorTimeExcced = false;
      }
    } else if (value === 60) {
      this.activityLogForm.patchValue({
        endTime: moment(startTime, "hh:mm a")
          .add(60, "minutes")
          .format("hh:mm a"),
      });

      if (
        new Date(
          moment().format("YYYY-MM-DD") +
            " " +
            this.activityLogForm.get("endTime").value
        ) > new Date(moment().format("YYYY-MM-DD") + " " + CurrentTime)
      ) {
        this.activityLogForm.patchValue({
          endTime: moment().format("hh:mm a"),
        });
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.activityLogForm.get("startTime").value,
          ", end Time",
          this.activityLogForm.get("endTime").value
        );
        this.errorTimeExcced = true;
      } else {
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.activityLogForm.get("startTime").value,
          ", end Time",
          this.activityLogForm.get("endTime").value
        );
        this.errorTimeExcced = false;
      }
    } else if (value === 90) {
      this.activityLogForm.patchValue({
        endTime: moment(startTime, "hh:mm a")
          .add(90, "minutes")
          .format("hh:mm a"),
      });

      if (
        new Date(
          moment().format("YYYY-MM-DD") +
            " " +
            this.activityLogForm.get("endTime").value
        ) > new Date(moment().format("YYYY-MM-DD") + " " + CurrentTime)
      ) {
        this.activityLogForm.patchValue({
          endTime: moment().format("hh:mm a"),
        });
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.activityLogForm.get("startTime").value,
          ", end Time",
          this.activityLogForm.get("endTime").value
        );
        this.errorTimeExcced = true;
      } else {
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.activityLogForm.get("startTime").value,
          ", end Time",
          this.activityLogForm.get("endTime").value
        );
        this.errorTimeExcced = false;
      }
    }
  }

  radioCahngeOne(value) {
    let startTime = this.OfficeLogForm.get("startTime").value;
    let CurrentTime = moment().format("hh:mm a");
    if (value === 15) {
      this.OfficeLogForm.patchValue({
        endTime: moment(startTime, "hh:mm a")
          .add(15, "minutes")
          .format("hh:mm a"),
      });

      if (
        new Date(
          moment().format("YYYY-MM-DD") +
            " " +
            this.OfficeLogForm.get("endTime").value
        ) > new Date(moment().format("YYYY-MM-DD") + " " + CurrentTime)
      ) {
        this.OfficeLogForm.patchValue({
          endTime: moment().format("hh:mm a"),
        });
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.OfficeLogForm.get("startTime").value,
          ", end Time",
          this.OfficeLogForm.get("endTime").value
        );
        this.errorTimeExccedOne = true;
      } else {
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.OfficeLogForm.get("startTime").value,
          ", end Time",
          this.OfficeLogForm.get("endTime").value
        );
        this.errorTimeExccedOne = false;
      }
    } else if (value === 30) {
      this.OfficeLogForm.patchValue({
        endTime: moment(startTime, "hh:mm a")
          .add(30, "minutes")
          .format("hh:mm a"),
      });

      if (
        new Date(
          moment().format("YYYY-MM-DD") +
            " " +
            this.OfficeLogForm.get("endTime").value
        ) > new Date(moment().format("YYYY-MM-DD") + " " + CurrentTime)
      ) {
        this.OfficeLogForm.patchValue({
          endTime: moment().format("hh:mm a"),
        });
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.OfficeLogForm.get("startTime").value,
          ", end Time",
          this.OfficeLogForm.get("endTime").value
        );
        this.errorTimeExccedOne = true;
      } else {
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.OfficeLogForm.get("startTime").value,
          ", end Time",
          this.OfficeLogForm.get("endTime").value
        );
        this.errorTimeExccedOne = false;
      }
    } else if (value === 60) {
      this.OfficeLogForm.patchValue({
        endTime: moment(startTime, "hh:mm a")
          .add(60, "minutes")
          .format("hh:mm a"),
      });

      if (
        new Date(
          moment().format("YYYY-MM-DD") +
            " " +
            this.OfficeLogForm.get("endTime").value
        ) > new Date(moment().format("YYYY-MM-DD") + " " + CurrentTime)
      ) {
        this.OfficeLogForm.patchValue({
          endTime: moment().format("hh:mm a"),
        });
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.OfficeLogForm.get("startTime").value,
          ", end Time",
          this.OfficeLogForm.get("endTime").value
        );
        this.errorTimeExccedOne = true;
      } else {
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.OfficeLogForm.get("startTime").value,
          ", end Time",
          this.OfficeLogForm.get("endTime").value
        );
        this.errorTimeExccedOne = false;
      }
    } else if (value === 90) {
      this.OfficeLogForm.patchValue({
        endTime: moment(startTime, "hh:mm a")
          .add(90, "minutes")
          .format("hh:mm a"),
      });

      if (
        new Date(
          moment().format("YYYY-MM-DD") +
            " " +
            this.OfficeLogForm.get("endTime").value
        ) > new Date(moment().format("YYYY-MM-DD") + " " + CurrentTime)
      ) {
        this.OfficeLogForm.patchValue({
          endTime: moment().format("hh:mm a"),
        });
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.OfficeLogForm.get("startTime").value,
          ", end Time",
          this.OfficeLogForm.get("endTime").value
        );
        this.errorTimeExccedOne = true;
      } else {
        console.log(
          "current Time",
          CurrentTime,
          ", Start Time",
          this.OfficeLogForm.get("startTime").value,
          ", end Time",
          this.OfficeLogForm.get("endTime").value
        );
        this.errorTimeExccedOne = false;
      }
    }
  }

  public endTimeChanged() {
    this.activityLogForm.get("endTime").valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      if (
        this.activityLogForm.get("startTime").value ==
        this.activityLogForm.get("endTime").value
      ) {
        this.startEqualEnd = true;
      } else {
        this.startEqualEnd = false;
      }
    });
    /**
     * name
     */
  }
  endOfficeTimeChanged() {
    this.OfficeLogForm.get("endTime").valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      if (
        this.OfficeLogForm.get("startTime").value ==
        this.OfficeLogForm.get("endTime").value
      ) {
        this.offcStartEqualEnd = true;
      } else {
        this.offcStartEqualEnd = false;
      }
    });
    /**
     * name
     */
  }

  public startOfficeTimeChanged() {
    this.OfficeLogForm.get("startTime").valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      let startTime = this.OfficeLogForm.get("startTime").value;
      this.minEndTime = startTime;

      this.OfficeLogForm.get("endTime").enable();
      this.OfficeLogForm.get("radioOption").enable();

      this.OfficeLogForm.patchValue({
        endTime: "",
      });
    });
  }
  /**
   *  RemoveTimesheet
   */
  public RemoveTimesheet(element) {
    let value = JSON.parse(localStorage.getItem("is_checkout"));
    if (value === true) {
      console.log("delete");
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: " Confirm",
        // confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText: "Cancel",
        // cancelButtonAriaLabel: 'Thumbs down'
      }).then((result) => {
        if (result.value) {
          let postData = {
            ID: element.timesheetDataModels[0].id,
          };
          this.timeService.RemoveTimesheet(postData).subscribe(
            (data: any) => {
              if (data.status == 200) {
                this.getTimesheetByEmpId();
                // this.getUsersInfo();
                this.toastr.error(data["desc"], undefined, {
                  positionClass: "toast-top-center",
                });
              }
            },
            (error) => {
              Swal.fire("Error!", error, "error").then((result) => {});
            }
          );
        } else {
        }
      });
    } else {
      console.log("No delete");
      Swal.fire(
        "Cannot Delete",
        "You have to checkout in order to delete",
        "error"
      );
    }
  }

  //checkout Model
  public closeMdModal() {
    this.getTimesheetByEmpId();
    this.spinner.show();
    this.showPurpose = false;
    this.showTask = false;
    this.showActivities = false;
    this.isCheckout = true;
    if (localStorage.getItem("currentTime")) {
      let checkoutIME = localStorage.getItem("currentTime");
      let date = moment().format("MM/DD/YYYY");
      this.checkOutTime = date.concat(" " + checkoutIME);
    }
    this.getPreciseLocation()
      .then((locValue) => {
        this.userlatitudelongitude = locValue;
        this.getByCheckOutID();
        console.log("user Lat long", locValue);
      })
      .catch((error) => {
        Swal.fire({
          title: "Oops can't get the Location",
          text: "Please check for location access or Internet speed and try again",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
        }).then((result) => {
          if (result.value === true) {
            $("#checkout_modal").removeClass("md-show");
          }
        });
      });
  }

  public getByCheckOutID() {
    console.log(this.latitude, "one");
    this.getAddressFromGoogle(
      this.userlatitudelongitude[0],
      this.userlatitudelongitude[1]
    );
    /* this.mapsAPILoader.load().then(() => {
    this.setCurrentLocation();
    this.geoCoder = new google.maps.Geocoder;
  }) */
    //console.log('checkoutoffc',this.offcboundryContain);
    this.checkoutByEmpId = true;
    let teamMembers = [];
    if (this.teamAdd) {
      this.teamCount = this.teamValue.concat(this.teamMembers);
      teamMembers = this.teamMembers;
    }

    let groupid = this.group_id ? this.group_id : "";
    let postData = {
      team_member_empid: this.teamEmpId,
      groupid: groupid,
      check_out: this.checkOutTime,
      is_inrange: this.boundryContain,
      modifiedby: user_info["full_name"],
      TimesheetCurrentLocationViewModel: {
        formatted_address: this.formatted_address ? this.formatted_address : "",
        lat: this.userlatitudelongitude[0],
        lang: this.userlatitudelongitude[1],
        street_number: this.street_number,
        route: this.route,
        locality: this.locality,
        administrative_area_level_2: this.administrative_area_level_1,
        administrative_area_level_1: this.administrative_area_level_2,
        postal_code: this.postal_code,
        country: this.country,
      },
    };
    if (this.userlatitudelongitude[0] == undefined) {
      setTimeout(() => {
        if (this.userlatitudelongitude[0] == undefined) {
          Swal.fire({
            title: "Location Access Denied",
            text: "Please turn on the location access for checkout",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "CANCEL!",
          }).then((result) => {});
        }
        this.spinner.hide();
      }, 100);
    } else {
      let GroupID = {
        id: groupid,
      };
      this.spinner.hide();
      this.timeService.GetTimesheetByGroupID(GroupID).subscribe((data: any) => {
        if (data.length != 0) {
          if (
            data["entityLocationRadius"] != null &&
            data["timesheetCategoryViewModel"]["project_category_type"] ==
              "Office"
          ) {
            console.log("Officecheckin");
            if (data["entityLocationRadius"]["is_allowed"] == true) {
              this.getOfficeRadus(
                data["entityLocation"]["lat"],
                data["entityLocation"]["lang"],
                data["entityLocationRadius"]
              );
              if (this.boundryContain) {
                this.checkoutLocation(postData);
              } else {
                Swal.fire(
                  "Oops!",
                  "You are check out location is not matched with office location.",
                  "error"
                ).then((result) => {
                  $("#toggleCheck").prop("checked", false);
                  this.disableAddLog = true;
                  $("#toggleCheck").removeAttr("disabled");
                  this.teamCount = [];
                });
              }
            } else {
              this.checkoutLocation(postData);
            }
          } else {
            this.checkoutLocation(postData);
          }
        }
      });
    }
  }

  invocationCount = 0;
  checkoutLocation(postData) {
    console.log("main data", postData);
    this.timeService.getByCheckOutID(postData).subscribe(
      async (data: any) => {
        if (data.status == 200) {
          localStorage.setItem("is_checkout", JSON.stringify(true));
          localStorage.removeItem("timeLeft");
          //clock
          this.clockTimerDiv = false;
          this.noClockTimerDiv = true;
          this.timerReference.stop();
          //clock ends
          this.teamCount = "";
          this.checkin = true;
          this.breakin = false;
          this.breakout = false;
          this.checkout = false;
          await this.getTimesheetByEmpId();
          this.checkin = true;
          this.breakin = false;
          this.breakout = false;
          this.checkout = false;
          this.disableAddTask = true;
          this.disableAddLog = true;
          // this.getUsersInfo();
          $("#toggleCheck").prop("checked", false);
          $("#toggleCheck").attr("checked", false);
          Swal.fire(
            "CheckedOut!",
            "You are checked out successfully.",
            "success"
          ).then((result) => {
            $("#toggleCheck").prop("checked", false);
            // this.getUsersInfo();
            this.disableAddLog = true;
            $("#toggleCheck").removeAttr("disabled");
            this.teamCount = [];
          });

          $("#checkout_modal").removeClass("md-show");
          this.toastr.success(data["desc"]);
        } else {
          if (data.result.status == 201) {
            console.log("data is not", data);
            this.invocationCount++;
            console.log("Function invoked", this.invocationCount, "times");
            if (this.invocationCount < 3) {
              Swal.fire({
                title: "Error!",
                text: "It seems your Checkout location is not the same as of the Check-in",
                confirmButtonText: "Try Again",
              }).then((result) => {
                $("#checkout_modal").removeClass("md-show");
              });
            } else {
              Swal.fire({
                title: "Do You Want Force Checkout?",
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: " Confirm",
                cancelButtonText: "Cancel",
              }).then((result) => {
                if (result.value == true) {
                  this.spinner.show();
                  postData.forceCheckout = true;
                  this.timeService
                    .getByCheckOutID(postData)
                    .subscribe((data1: any) => {
                      if (data1.status == 200) {
                        let user_info = JSON.parse(
                          localStorage.getItem("user_info")
                        );
                        let empId = { ID: user_info["id"] };
                        this.userService
                          .GetAllTimesheetListByEmployeeID(empId)
                          .subscribe((data2: any) => {
                            if (data2) {
                              const lastest_time =
                                data2[0]["timesheetDataModels"][0]["id"];
                              let params3 = {
                                org_id: user_info.org_id,
                                type: "checkout",
                                empid: user_info.id,
                                timesheet_id: lastest_time,
                                ondate: moment(new Date())
                                  .utc(true)
                                  .format("DD/MM/YYYY hh:mm A"),
                                check_in: null,
                                checkin_lat: null,
                                checkin_lang: null,
                                check_out: moment(new Date())
                                  .utc(true)
                                  .format("DD/MM/YYYY hh:mm A"),
                                checkout_lat: this.userlatitudelongitude[0],
                                checkout_lang: this.userlatitudelongitude[1],
                                isapproved_levelone: true,
                                isapproved_leveltwo: true,
                                reason_name:
                                  "Technical Error Location Fetching in website",
                                status: "approved",
                                created_date: moment(new Date())
                                  .utc(true)
                                  .format("DD/MM/YYYY hh:mm A"),
                                createdby: user_info.id,
                                modified_date: moment(new Date())
                                  .utc(true)
                                  .format("DD/MM/YYYY hh:mm A"),
                                modifiedby: user_info.id,
                                is_deleted: false,
                                is_app_check_In: false,
                              };
                              this.timeService
                                .AddForceCheckInRequest(params3)
                                .subscribe((forcedata: any) => {
                                  if (forcedata) {
                                    localStorage.setItem(
                                      "is_checkout",
                                      JSON.stringify(true)
                                    );
                                    localStorage.removeItem("timeLeft");
                                    //clock
                                    this.clockTimerDiv = false;
                                    this.noClockTimerDiv = true;
                                    this.timerReference.stop();
                                    //clock ends
                                    this.teamCount = "";
                                    this.checkin = true;
                                    this.breakin = false;
                                    this.breakout = false;
                                    this.checkout = false;
                                    this.getTimesheetByEmpId();
                                    this.checkin = true;
                                    this.breakin = false;
                                    this.breakout = false;
                                    this.checkout = false;
                                    this.disableAddTask = true;
                                    this.disableAddLog = true;
                                    let empId = { ID: user_info["id"] };

                                    Swal.fire(
                                      "CheckedOut!",
                                      "You are Force checked out successfully.",
                                      "success"
                                    ).then((results) => {
                                      $("#toggleCheck").prop("checked", false);
                                      // this.getUsersInfo();
                                      this.disableAddLog = true;
                                      $("#toggleCheck").removeAttr("disabled");
                                      this.teamCount = [];
                                    });

                                    $("#checkout_modal").removeClass("md-show");
                                    this.toastr.success(forcedata["desc"]);
                                  }
                                  this.spinner.hide();
                                });
                            }
                          });
                      }
                    });
                  $("#toggleCheck").prop("checked", false);
                  $("#toggleCheck").attr("checked", false);
                } else {
                  $("#checkout_modal").removeClass("md-show");
                }
              });
            }
          } else {
            Swal.fire("Error!", data["desc"], "error").then((result) => {});
          }
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
        this.spinner.hide();
      }
    );
  }

  addTask() {
    $("#task_log_modal").modal("show");
  }
  OnTaskClose() {
    $("#task_log_modal").modal("hide");
    this.taskCloseBtn.nativeElement.click();
  }
  loadscript() {
    // window.location.reload();
    this.loadAPI = new Promise((resolve) => {
      // this.loadScript();
      let node = document.createElement("script");
      node.type = "text/javascript";
      node.async = true;
      node.charset = "utf-8";
      document.getElementsByTagName("head")[0].appendChild(node);
    });
  }
  public FetchLeaveStatusOrgID() {
    this.leaveService.FetchLeaveStatusOrgID().subscribe(
      (data: any) => {
        this.leaveStatusData = data;
        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public getLeaveSetup() {
    this.leaveService.FetchLeaveSetupOrgID().subscribe(
      (data: any) => {
        if (data.length != 0) {
          this.leaveSetupData = data;
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public leavesetupChange(id) {
    this.leaveSetupid = id;

    //
    // if(this.projectForm.get('prefixVal').value=='is_custom'){
    //   this.showPrefixText=true;

    // }else{
    //   this.showPrefixText=false;
    //  // this.FindAutoProjectPrefixByOrgID();

    // }
  }
  public getAllEmployee() {
    this.empService.getEmployeeByOrgId().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];

        // let dataObj = JSON.parse(data['token']);
        //
        let user_info = JSON.parse(localStorage.getItem("user_info"));

        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          if (user_info["id"] != data[i].id) {
            results.push({
              id: data[i].id,
              text: data[i].first_name,
            });
          }
        }

        this.approverData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public ApplyLeave() {
    this.router.navigate(["/leave-details"]);
  }
  public PushNotifyByEmpID() {
    this.notifyService.PushNotifyByEmpID().subscribe(
      (data: any) => {
        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public onAddEmpLeave() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    // if(user_info['id']!=data[i].id){
    let leavePeriod = this.dateRangeForm.get("daterangeAtt").value;

    this.addleaveformSubmitted = true;
    let leave_id;
    for (var i = 0; i < this.leaveStatusData.length; i++) {
      if (this.leaveStatusData[i].leave_status_name == "Pending") {
        leave_id = this.leaveStatusData[i].id;
      }
    }

    // let leave_status_id=this.leaveStatusData.map(function (leave) {
    //   if(leave.leave_status_name=="Pending"){
    //     return leave.id

    //   }
    // })

    let postData = {
      org_id: localStorage.getItem("org_id"),
      emp_id: user_info["id"],
      leave_setup_id: this.leaveSetupid,
      leave_start_date: moment(leavePeriod[0]).format("L"),
      leave_end_date: moment(leavePeriod[1]).format("L"),
      leave_days: this.leaveSpan,
      ondate_applied: moment().format("L"),
      approver_emp_id: this.approverTaskValue,
      leave_status_id: leave_id,
      is_approved: false,
      approve_start_date: null,
      approve_end_date: null,
      approved_days: null,
      ondate_approved: null,
      emp_notes: this.leaveForm.get("desc").value,
      createdby: user_info["full_name"],
    };

    if (
      this.leaveForm.status == "VALID" &&
      this.dateRangeForm.status == "VALID"
    ) {
      this.spinner.show();
      return this.leaveService.AddEmployeeLeave(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {
            this.spinner.hide();
            this.addleaveformSubmitted = false;
            this.approverTaskValue = "";
            this.leaveForm.reset();
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });

            $("#leave_modal").modal("hide");
          }
          // this.router.navigate(["/organizations"]);
        },
        (error) => {
          Swal.fire("Error!", "Error.", "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    }
  }
  changedTaskApprover(e) {
    this.approverTaskValue = e.value;
  }

  AddFullPaymentInClaim() {
    this.projectService.AddFullPaymentInClaim().subscribe((data) => {
      console.log(data);
    });

    this.projectService.AddCommisiontoClaim().subscribe((data) => {
      console.log(data);
    });
  }
  handleDelegateControl(){
    this.delegateControl=verifyDelegateUserControl();
  }
  ngOnInit() {
    this.handleDelegateControl();
    this.handlePlatform();
    this.AddFullPaymentInClaim();
    //this.getAllStatus();
    this.FetchTimeOffSetupOrgID();
    this.getAllActivity();
    this.checkforProbationPeriod();
    /* this.GetProjByOrgID();
  this.GetProjectListByEmpID(); */
    this.FetchAllProjectByOrgID(); /* Fetch project by Emp_ID */
    this.GetAllTaskDescByEmpIDList();
    this.getCasesTypesByOrgId();
    //this.GetAllTaskDescByEmpID();
    this.maxAddLogEndTime = localStorage.getItem("currentTime");
    // this.sliderForm = this.fb.group({
    //   'slider': [0, Validators.min(10)]
    // });
    //   let cdate = new Date();
    // cdate.setHours(cdate.getHours()-2);
    // this.countupTimerService.startTimer(cdate);
    this.testConfig = new countUpTimerConfigModel();
    this.tag_id = getDeviceId();
    console.log(this.tag_id, "this.tag_id");

    //custom class
    this.testConfig.timerClass = "test_Timer_class";

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

    this.loadscript();
    if (localStorage.getItem("planType") == "winter") {
      this.planType = "Basic";
    }

    $.getScript("assets/modaljs/modernizr.custom.js");
    $.getScript("assets/modaljs/classie.js");
    $.getScript("assets/modaljs/modalEffects.js");
    this.showPurposeTasks = false;
    this.OrgId = localStorage.getItem("org_id");

    /* var s1 = document.createElement("script");
  s1.type = "text/javascript"; */
    this.EmpList();

    // this.getUsersInfo();
    this.getTimesheetByEmpId();

    this.LastCheckinByEmpID();

    // this.GetAllTaskByEmpID();
    //this.getalltaskbyJob('','')

    //  this.EmpList();
    this.timeLogForm = new FormGroup({
      checkIn: new FormControl("", [Validators.required]),
      checkOut: new FormControl(""),
      // email: new FormControl('', [Validators.required]),
    });
    this.ActTaskLogForm = new FormGroup({
      startTime: new FormControl("", [Validators.required]),
      endTime: new FormControl(""),
      remarks: new FormControl(""),
      // email: new FormControl('', [Validators.required]),
    });

    this.dateRangeForm = new FormGroup({
      daterangeAtt: new FormControl("", [Validators.required]),
    });
    this.leaveForm = new FormGroup({
      desc: new FormControl("", [Validators.required]),
      leaveType: new FormControl("", [Validators.required]),
    });
    this.activityLogForm = new FormGroup({
      startTime: new FormControl("", [Validators.required]),
      endTime: new FormControl("", [Validators.required]),
      remarks: new FormControl(""),
      purpose: new FormControl(""),
      timeRadio: new FormControl(""),
      // email: new FormControl('', [Validators.required]),
    });
    //call for Manage Leave and Attendance
    this.callCommonDareRangeForm();
    this.commonDateRangeForm.patchValue({
      dateRangeCom: [this.startDateSend, this.endDateSend],
    });
    this.checkTabApiCall();

    this.commonDateRangeForm
      .get("dateRangeCom")
      .valueChanges.subscribe((data: any) => {
        this.spinner.show();
        this.startDateSend = moment(data[0]).format("L");
        this.endDateSend = moment(data[1]).format("L");
        this.checkTabApiCall();
      });

    this.activityLogForm.get("endTime").valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      if (this.activityLogForm.get("endTime").value != "") {
        this.endValChange = true;
      } else {
        this.endValChange = false;
      }
    });

    this.OfficeLogForm = new FormGroup({
      startTime: new FormControl("", [Validators.required]),
      endTime: new FormControl("", [Validators.required]),
      remarks: new FormControl(""),
      purpose: new FormControl(""),
      radioOption: new FormControl(""),

      // email: new FormControl('', [Validators.required]),
    });
    this.OfficeLogForm.get("endTime").disable();
    this.OfficeLogForm.get("radioOption").disable();

    this.OfficeLogForm.get("startTime").valueChanges.subscribe(() => {
      this.OfficeLogForm.get("endTime").enable();

      // fires when the input value has actually changed
      if (this.OfficeLogForm.get("endTime").value != "") {
        this.endValChange = true;
      } else {
        this.endValChange = false;
      }
    });

    this.activityLogForm.get("endTime").disable();
    this.activityLogForm.get("timeRadio").disable();
    $("#time_log_modal").on("shown.bs.modal", function () {
      $("#editTeamModal").click(function () {
        $("#team_modal").modal("show");
      });
      $.getScript("assets/js/teamPanel.js");

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
    });

    // $('#toggleCheck').on('change', function() {
    //   if ($(this).is(':checked')) {

    //     $("#team_modal").modal('show');

    //   }
    // });

    // $('#toggleCheck').prop('checked',true);
    // $('#toggleCheck').attr('checked', true);
    // $('#myCheckbox').prop('checked', false);

    $("#kt_modal_2").on("hide", function () {
      //actions you want to perform after modal is closed.
    });

    this.teamOptions = {
      templateResult: this.templateResult,
      templateSelection: this.templateSelection,
    };
    this.jobOptions = {
      placeholder: "Select",
      width: "100%",
      templateResult: this.templateResult,
      templateSelection: this.templateSelection,
    };
    this.taskDescOptions = {
      placeholder: "Select",
      width: "100%",
      templateResult: this.taskDescResult,
      templateSelection: this.taskDescSelection,
    };

    this.options = {
      multiple: true,
      placeholder: "Select",
      // allowClear: true,
      width: "100%",
      templateResult: this.templateResult,
      templateSelection: this.templateSelection,
    };
    this.teamOptions = {
      multiple: true,
      placeholder: "Select Team",
      width: "100%",
      templateResult: this.templateResult,
      templateSelection: this.templateSelection,
    };
    this.otherOptions = {
      multiple: true,
      placeholder: "Select",
      width: "100%",
    };
    this.deptOptions = {
      placeholder: { id: "  ", text: "Select" },
      allowClear: true,
      width: "100%",
    };
    this.activityOptions = {
      placeholder: "Select",
      width: "100%",
    };
    this.jobFilterOptions = {
      placeholder: "Job",
      width: "100%",
    };
    this.activityFilterOptions = {
      placeholder: "Milestone",
      width: "100%",
    };
    this.taskFilterOptions = {
      placeholder: "Task",
      width: "100%",
    };
    this.filterSettings = { type: "Menu" };

    //this.editData=orderData;
    this.editSettings = {
      allowEditing: true,
      allowSorting: true,
      allowAdding: true,
      allowDeleting: true,
      mode: "Batch",
    };
    this.toolbar = ["Add", "Delete", "Update", "Cancel"];
    this.orderidrules = { required: true, number: true };
    this.requiredField = { required: true };

    this.customeridrules = { required: true };
    this.freightrules = { required: true };
    this.editparams = { params: { popupHeight: "300px" } };
    this.pageSettings = { pageCount: 5 };
    //  $.getScript("assets/js/toDo.js");
    //    $.getScript("assets/js/pages/custom/contacts/list-datatable.js");
    // $.getScript('assets/js/activities-datatable.js');
    $.getScript("assets/js/checkInOut.js");

    if (localStorage.getItem("itemLeft")) {
      this.showModals = true;
    }

    //countUpTimerConfigModel
    this.startValue = "0";
    this.selectedPurpose = "";
    this.selectedProject = "";
    this.selectedTask = "";
    this.teamValue = [];
    this.othersDataValue = "";
    this.activityValue = "";
    this.employeeValue = "";
    this.teamCount = "";

    this.projectData = [
      { id: "0", text: "Select" },
      { id: "1", text: "P/162" },
      { id: "2", text: "P/163" },
      { id: "3", text: "P/164" },
      { id: "4", text: "P/166" },
    ];
    this.taskData = [];
    this.activityData = [
      { id: "0", text: "Installation" },
      { id: "2", text: "Inspection" },
      { id: "3", text: "Handover" },
      { id: "4", text: "Others" },
    ];
    this.employeeData = [];

    this.othersData = [];
    // $.getScript('assets/js/pages/chosen/chosen.jquery.min.js')
    // $.getScript('https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.js')

    // $('.modal').on('hide.bs.modal', function (e) {
    //   $('.modal .modal-dialog').attr('class', 'modal-dialog  slideOutLeft  animated');
    // })
    //   $('#addLog').click(function () {

    //     $('#time_log_modal').modal('show');
    //     this.editable=false;

    // });

    $.getScript("assets/js/pages/crud/forms/widgets/select2.js");
    $.getScript("assets/js/pages/components/extended/toastr.js");
    $.getScript("assets/js/pages/crud/forms/widgets/bootstrap-datepicker.js");

    $.getScript("assets/js/teamPanel.js");
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
      empDate: new FormControl(""),
    });

    const todayDate = new Date();
    const yesterdayDate = new Date(todayDate);
    let yestData = yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    let sendDate = moment(yestData).format("MM/DD/YYYY");
    yesterdayDate.toDateString();
    this.maxRangeDateNew = yesterdayDate;

    /* let user_info= JSON.parse(localStorage.getItem('user_info'));
this.employeeID = user_info.id
if(user_info){
  let postData = {
    "empID": this.employeeID,
    "startDate": sendDate,
    "endDate":sendDate
  }newdateRangeForm
  this.employeePreDayAct(postData);
  this.employeePreDayProj(postData);
} */

    //date_range
    this.newdateRangeForm = new FormGroup({
      daterangeAtt: new FormControl("", [Validators.required]),
    });

    if (user_info) {
      let fromDate = moment().subtract(7, "day").format("L");
      let endDate = moment().format("L");
      let attPostData = {
        startDate: fromDate,
        endDate: endDate,
      };
      console.log(attPostData);
      this.newdateRangeForm.patchValue({
        daterangeAtt: [fromDate, endDate],
      });
      this.dateTextNew = endDate;
      this.employeePreDayAct(attPostData);
      this.employeePreDayProj(attPostData);
    }

    this.newdateRangeForm
      .get("daterangeAtt")
      .valueChanges.subscribe((data: any) => {
        this.spinner.show();
        let startDate = moment(data[0]).format("L");
        let endDate = moment(data[1]).format("L");
        let attPostData = {
          startDate: startDate,
          endDate: endDate,
        };
        this.dateTextNew = endDate;
        this.employeePreDayAct(attPostData);
        this.employeePreDayProj(attPostData);
      });

    this.toolbarbottom = ["ExcelExport", "PdfExport"];

    setInterval(() => {
      this.currentDestTime = moment().format("hh:mm a");
      localStorage.setItem("currentTime", this.currentDestTime);
    }, 2000);

    this.GetAllTaskListByEmployeeID(this.jobFilterValue);
  }
  callCommonDareRangeForm() {
    this.commonDateRangeForm = new FormGroup({
      dateRangeCom: new FormControl("", [Validators.required]),
    });
  }

  checkTabApiCall() {
    this.spinner.show();
    console.log(this.getHeaderValue, "this.getHeaderValue");
    if (this.getHeaderValue === "ATTENDENCE") {
      this.GetAttendaceDataByEmpIDAndDate();
    } else if (this.getHeaderValue === "ABSENT") {
      this.GetAbsentDataByEmpIDAndDate();
    }
  }

  //attendance function start
  public GetAttendaceDataByEmpIDAndDate() {
    let postData = {
      startDate: this.startDateSend,
      endDate: this.endDateSend,
    };
    this.timesheetService
      .GetAttendaceDataByEmpIDAndDate(postData)
      .subscribe((data: any) => {
        data.map((elem, i) => {
          let checkIfExist = data.filter(
            (itm) => itm.timesheet_id === elem.timesheet_id
          );
          if (checkIfExist.length == 2) {
            if (checkIfExist[0].leave_status === null) {
              data.splice(i, 1);
            }
          }
        });
        this.attendanceData = data;
        this.spinner.hide();
      });
  }

  //absent function start
  public GetAbsentDataByEmpIDAndDate() {
    console.log("CALLED ABS");
    let postData = {
      startDate: this.startDateSend,
      endDate: this.endDateSend,
    };
    this.timesheetService
      .GetAbsentDataByEmpIDAndDate(postData)
      .subscribe((data: any) => {
        if (data) {
          this.absentDataCloud = data;
          let toDate = moment().subtract(7, "day").format("L");
          console.log(toDate);
          this.absentDataCloud.map((elm: any) => {
            if (elm.ondate <= toDate) {
              elm.Can_Apply = "no";
            } else {
              elm.Can_Apply = "yes";
            }
          });
          let datass = new DataManager(this.absentDataCloud);
          this.absentData = datass.dataSource["json"];
          console.log(this.absentData);
        }
        this.spinner.hide();
      });
  }

  toolbarClick(args: ClickEventArgs): void {
    switch (args.item.text) {
      case "PDF Export":
        this.grid.pdfExport();
        break;
      case "Excel Export":
        this.grid.excelExport();
        break;
      case "CSV Export":
        this.grid.csvExport();
        break;
    }
  }

  handlePlatform() {
    const systemInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      availableScreenSize: `${window.screen.availWidth}x${window.screen.availHeight}`,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
      onlineStatus: navigator.onLine,
      // connectionType: (navigator.connection || navigator.mozConnection || navigator.webkitConnection)?.effectiveType || 'Not available',
      // deviceMemory: navigator.deviceMemory || 'Not available',
      hardwareConcurrency: navigator.hardwareConcurrency,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      localTime: new Date().toLocaleString(),
      doNotTrack: navigator.doNotTrack,
    };

    console.log(systemInfo, "userAgent");
  }

  public checkedCompleted(e: any) {
    this.spinner.show();
    if (e.srcElement.checked) {
      let dateValue = this.newdateRangeForm.get("daterangeAtt").value;
      let fromDate = moment(dateValue[0]).format("L");
      let endDate = moment(dateValue[1]).format("L");
      let attPostData = {
        startDate: fromDate,
        endDate: endDate,
      };
      this.projectService
        .getEmployeePreviousDayActivitiesProjectsDashboard(attPostData)
        .subscribe((data: any) => {
          if (data) {
            this.employeePreviousDayActivitiesProjectData = data.filter(
              (elm) => {
                return elm.status_name === "Completed";
              }
            );
            const sum = this.employeePreviousDayActivitiesProjectData.reduce(
              (acc, time) => acc.add(moment.duration(time.total_hrs)),
              moment.duration()
            );
            this.total_hrs_spent = [
              Math.floor(sum.asHours()).toString().length == 1
                ? ("0" + Math.floor(sum.asHours())).slice(-2)
                : Math.floor(sum.asHours()),
              Math.floor(sum.minutes()).toString().length == 1
                ? ("0" + Math.floor(sum.minutes())).slice(-2)
                : sum.minutes(),
            ].join(":");
            console.log(this.total_hrs_spent);
            this.spinner.hide();
          }
        });
    } else {
      this.spinner.show();
      let dateValue = this.newdateRangeForm.get("daterangeAtt").value;
      let fromDate = moment(dateValue[0]).format("L");
      let endDate = moment(dateValue[1]).format("L");
      this.newdateRangeForm.patchValue({
        daterangeAtt: [fromDate, endDate],
      });
    }
  }

  prevday() {
    this.spinner.show();
    let dateValue = this.newdateRangeForm.get("daterangeAtt").value;
    let fromDate = moment(dateValue[0]).subtract(7, "day").format("L");
    let endDate = moment(dateValue[1]).subtract(1, "day").format("L");
    this.newdateRangeForm.patchValue({
      daterangeAtt: [fromDate, endDate],
    });
    this.dateTextNew = endDate;
  }

  nextday() {
    this.spinner.show();
    let dateValue = this.newdateRangeForm.get("daterangeAtt").value;
    let fromDate = moment(dateValue[0]).add(7, "day").format("L");
    let endDate = moment(dateValue[1]).add(1, "day").format("L");
    this.dateTextNew = endDate;
    console.log(fromDate, endDate);
    this.newdateRangeForm.patchValue({
      daterangeAtt: [fromDate, endDate],
    });
  }

  employeePreDayAct(postData) {
    this.projectService
      .getEmployeePreviousDayActivitiesDashboard(postData)
      .subscribe((data) => {
        console.log(data);
        this.employeePreviousDayActivitiesData = data;
        this.empCheckIn =
          this.employeePreviousDayActivitiesData.check_in === null
            ? "-"
            : this.employeePreviousDayActivitiesData.check_in;
        this.empLeftTime =
          this.employeePreviousDayActivitiesData.check_out === null
            ? "-"
            : this.employeePreviousDayActivitiesData.check_out;
        this.empLateArrival =
          this.employeePreviousDayActivitiesData.late_checkin === null
            ? "-"
            : this.employeePreviousDayActivitiesData.late_checkin;
        this.empLeaveEarly =
          this.employeePreviousDayActivitiesData.early_checkout === null
            ? "-"
            : this.employeePreviousDayActivitiesData.early_checkout;
        this.empProductiveTime =
          this.employeePreviousDayActivitiesData.time_spend_activity === null
            ? "-"
            : this.employeePreviousDayActivitiesData.time_spend_activity;
        this.empProductivity =
          this.employeePreviousDayActivitiesData.productivity_ratio === null
            ? "-"
            : this.employeePreviousDayActivitiesData.productivity_ratio;
        this.empActivetyTime =
          this.employeePreviousDayActivitiesData.activity_count === null
            ? "-"
            : this.employeePreviousDayActivitiesData.activity_count;
        this.empTimeSpend =
          this.employeePreviousDayActivitiesData.time_spend_activity === null
            ? "-"
            : this.employeePreviousDayActivitiesData.time_spend_activity;

        this.spinner.hide();
      });
  }

  employeePreDayProj(postData) {
    this.projectService
      .getEmployeePreviousDayActivitiesProjectsDashboard(postData)
      .subscribe((data) => {
        //console.log('main log justin', data)
        this.employeePreviousDayActivitiesProjectData = data;
        const sum = this.employeePreviousDayActivitiesProjectData.reduce(
          (acc, time) => acc.add(moment.duration(time.total_hrs)),
          moment.duration()
        );
        this.total_hrs_spent = [
          Math.floor(sum.asHours()).toString().length == 1
            ? ("0" + Math.floor(sum.asHours())).slice(-2)
            : Math.floor(sum.asHours()),
          Math.floor(sum.minutes()).toString().length == 1
            ? ("0" + Math.floor(sum.minutes())).slice(-2)
            : sum.minutes(),
        ].join(":");
        console.log(this.total_hrs_spent);

        this.spinner.hide();
      });
  }

  ngAfterViewInit() {
    //We loading the player script on after view is loaded
    // $.getScript('assets/js/teamPanel.js');
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
  leaveRange(e) {
    this.leaveSpan = e.daySpan;
  }

  //local task and project task toggle
  public showProjTask(e: any) {
    if (e.srcElement.checked) {
      this.showProjBasedTasks = true;
      this.GetAllProjectTaskListByEmployeeID(this.jobFilterValue);
    } else {
      this.showProjBasedTasks = false;
      this.GetAllTaskListByEmployeeID(this.jobFilterValue);
    }
  }

  //listing Functions

  //listing of task and Local added project related task
  GetAllTaskListByEmployeeID(id) {
    if (id === "") {
      this.taskService.GetAllTaskListByEmployeeID().subscribe((data: any) => {
        if (data.length != 0) {
          console.log("Local List null", data);
          this.allTaskList = [];
          data.employeeTasks.map((elm) => {
            if (elm.statusName !== "Completed") {
              this.allTaskList.push(elm);
            }
          });
          console.log("main", this.allTaskList, this.allTaskList.length);
          this.allOverDueTaskList = data.overDueTasks;
          this.allAssignedTaskList = data.assignedEmployeeTasks;
          this.allOpenTaskList = [];
          this.allCompletedTaskList = [];
          data.employeeTasks.map((elm) => {
            if (elm.statusName === "Open") {
              this.allOpenTaskList.push(elm);
            } else if (elm.statusName === "Completed") {
              this.allCompletedTaskList.push(elm);
            }
          });
          this.spinner.hide();
        }
      });
    } else {
      this.getAllTaskbyLocalJoB(this.jobFilterValue);
    }
  }

  //listing of project related task
  GetAllProjectTaskListByEmployeeID(id) {
    if (id === "") {
      this.taskService
        .GetAllProjectTaskListByEmployeeID()
        .subscribe((data: any) => {
          if (data.length != 0) {
            console.log("project List null", data);
            this.allTaskList = [];
            data.employeeTasks.map((elm) => {
              if (elm.statusName !== "Completed") {
                this.allTaskList.push(elm);
              }
            });
            this.allOverDueTaskList = data.overDueTasks;
            this.allAssignedTaskList = data.assignedEmployeeTasks;
            this.allOpenTaskList = [];
            this.allCompletedTaskList = [];
            data.employeeTasks.map((elm) => {
              if (elm.statusName === "Open") {
                this.allOpenTaskList.push(elm);
              } else if (elm.statusName === "Completed") {
                this.allCompletedTaskList.push(elm);
              }
            });
            console.log("Local List", this.allOpenTaskList);
            this.spinner.hide();
          }
        });
    } else {
      this.getalltaskbyJob(this.jobFilterValue);
    }
  }

  //on Job Change
  changedJobFilter(e: { value: "" }): void {
    if (e.value !== "") {
      console.log("run1", e);
      this.jobFilterValue = e.value;
      this.taskFilterValue = "";
      this.activityFilterValue = "";
      if (this.showProjBasedTasks) {
        this.getalltaskbyJob(e.value);
      } else {
        this.getAllTaskbyLocalJoB(e.value);
      }
      this.fetchMilestActByProjectID(e.value);
    }
  }

  //list Milestone based on projectID
  public fetchMilestActByProjectID(projectId) {
    let project_id = {
      id: projectId,
    };
    this.projectService.GetMilestoneByProjectID(project_id).subscribe(
      (data: any) => {
        var actFilter = [{ id: "", text: "Milestone" }];
        if (data) {
          for (var i = 0; i < data.length; i++) {
            actFilter.push({
              id: data[i].milestoneId,
              text: data[i].milestoneName,
            });
          }
        }
        this.milestFilterList = actFilter;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  //on Milestone Change
  changedMilestFilter(e: { value: "" }): void {
    if (e.value !== "") {
      console.log("run2", e);
      this.activityFilterValue = e.value;
      this.taskFilterValue = "";
      if (this.showProjBasedTasks) {
        this.getalltaskbyJob(e.value);
      } else {
        this.getAllTaskbyLocalJoB(e.value);
      }
      this.getTaskByMilestoneID(e.value);
    }
  }

  //list task based on Milestone - projectID
  public getTaskByMilestoneID(id) {
    let sendData = {
      id,
    };
    this.projectService.GetTaskByMilestoneID(sendData).subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];
        if (data) {
          for (var i = 0; i < data.length; i++) {
            results.push({
              id: data[i].taskId,
              text: data[i].taskName,
            });
          }
        }
        this.projTaskData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  //Task Filter
  changedTaskFilter(e: { value: "" }): void {
    if (e.value !== "") {
      console.log("run3", e);
      this.taskFilterValue = e.value;
      if (this.showProjBasedTasks) {
        this.getalltaskbyJob(e.value);
      } else {
        this.getAllTaskbyLocalJoB(e.value);
      }
    }
  }

  //clear filter
  clearAllFilters() {
    (this.jobFilterValue = ""),
      (this.activityFilterValue = ""),
      (this.taskFilterValue = "");
    this.searchText = "";
    if (this.showProjBasedTasks) {
      this.GetAllProjectTaskListByEmployeeID(this.jobFilterValue);
    } else {
      this.GetAllTaskListByEmployeeID(this.jobFilterValue);
    }
  }

  //filtered list for project based task
  getalltaskbyJob(id) {
    this.spinner.show();
    let postData = {
      projectID: this.jobFilterValue != "" ? this.jobFilterValue : null,
      milestoneID:
        this.activityFilterValue != "" ? this.activityFilterValue : null,
      taskID: this.taskFilterValue != "" ? this.taskFilterValue : null,
    };
    console.log(postData);
    this.taskService
      .GetAllProjectTaskListByEmpIDAndProjectIDAndMilestoneIDAndTaskID(postData)
      .subscribe((data: any) => {
        console.log("project List value", data);
        console.log(data);
        if (data.length != 0) {
          this.allTaskList = [];
          data.employeeTasks.map((elm) => {
            if (elm.statusName !== "Completed") {
              this.allTaskList.push(elm);
            }
          });
          this.allOverDueTaskList = data.overDueTasks;
          this.allAssignedTaskList = data.assignedEmployeeTasks;
          this.allOpenTaskList = [];
          this.allCompletedTaskList = [];
          data.employeeTasks.map((elm) => {
            if (elm.statusName === "Open") {
              this.allOpenTaskList.push(elm);
            } else if (elm.statusName === "Completed") {
              this.allCompletedTaskList.push(elm);
            }
          });
          this.spinner.hide();
        }
      });
  }

  //filtered list for project based local task
  getAllTaskbyLocalJoB(id) {
    this.spinner.show();
    let postData = {
      projectID: this.jobFilterValue != "" ? this.jobFilterValue : null,
      milestoneID:
        this.activityFilterValue != "" ? this.activityFilterValue : null,
      taskID: this.taskFilterValue != "" ? this.taskFilterValue : null,
    };
    console.log(postData);
    this.taskService
      .GetAllFilterLocalTaskListByEmpIDAndProjectIDAndMilestoneIDAndTaskID(
        postData
      )
      .subscribe((data: any) => {
        console.log("local List value", data);
        if (data.length != 0) {
          this.allTaskList = [];
          data.employeeTasks.map((elm) => {
            if (elm.statusName !== "Completed") {
              this.allTaskList.push(elm);
            }
          });
          console.log("main2", this.allTaskList, this.allTaskList.length);
          this.allOverDueTaskList = data.overDueTasks;
          this.allAssignedTaskList = data.assignedEmployeeTasks;
          this.allOpenTaskList = [];
          this.allCompletedTaskList = [];
          data.employeeTasks.map((elm) => {
            if (elm.statusName === "Open") {
              this.allOpenTaskList.push(elm);
            } else if (elm.statusName === "Completed") {
              this.allCompletedTaskList.push(elm);
            }
          });
          this.spinner.hide();
        }
      });
  }

  //list project based on empID start
  public FetchAllProjectByOrgID() {
    if (localStorage.getItem("user_info")) {
      let user_info = JSON.parse(localStorage.getItem("user_info"));
      if (user_info["is_superadmin"] == true) {
        this.GetProjByOrgID();
      } else if (
        user_info["is_admin"] == true &&
        user_info["is_superadmin"] == false
      ) {
        console.log("admin");
        this.GetProjByOrgID();
      } else if (
        user_info["is_admin"] == false &&
        user_info["is_superadmin"] == false
      ) {
        console.log("employee");
        //this.FetchAllProjectByEmpID();
        this.FetchAllEmployeeProjectByEmpID();
      }
    }
    //this.FetchAllEmployeeProjectByEmpID();
  }

  //project for admin
  GetProjByOrgID() {
    this.projectService.FetchAllProjectByOrgID().subscribe(
      (projectData: any) => {
        var results = [{ id: "", text: "Select", additional: { teamBy: "" } }];
        var jobFilter = [
          { id: "", text: "Project", additional: { teamBy: "" } },
        ];
        if (projectData) {
          for (var i = 0; i < projectData.length; i++) {
            results.push({
              id: projectData[i].project_id,
              text: projectData[i].project_name,
              additional: {
                teamBy: projectData[i].project_prefix,
              },
            });
            jobFilter.push({
              id: projectData[i].project_id,
              text: projectData[i].project_name,
              additional: {
                teamBy: projectData[i].project_prefix,
              },
            });
          }
        }
        this.selectedCategData = results;
        this.selectedJobData = results;
        this.selectedJobFilterData = jobFilter;
        this.projectFilterListByEmp = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  //project for employee
  /* FetchAllEmployeeProjectByEmpID(){
  this.projectService.FetchAllEmployeeProjectByEmpID().subscribe((projectData:any) => {
    var finalResult = [{ id: '', text: 'Select',additional:{teamBy:''} }];
    projectData.map((elm) => {
      finalResult.push({
          id: elm.ProjectId,
          text: elm.ProjectName,
          additional:{
            teamBy: elm.ProjectPrefix
          }
        })
    })
    this.selectedCategData = finalResult;
    this.selectedJobData = finalResult;
    this.projectFilterListByEmp=finalResult;
  },error => {
    Swal.fire(
      'Error!',
      error,
      'error'
    ).then((result)=> {})
  })
} */

  FetchAllEmployeeProjectByEmpID() {
    this.projectService.FetchAllEmployeeProjectByEmpID().subscribe(
      (projectData: any) => {
        let projestAssign = [
          { id: "", text: "Select", additional: { teamBy: "" } },
        ];
        let projestAssignLocal = [];
        let finalResult = [];
        this.projectService
          .FetchAllEmployeeLocalTasks()
          .subscribe((data: any) => {
            projectData.map((elm) => {
              projestAssign.push({
                id: elm.ProjectId,
                text: elm.ProjectName,
                additional: {
                  teamBy: elm.ProjectPrefix,
                },
              });
            });

            data.map((elm) => {
              projestAssignLocal.push({
                id: elm.ProjectId,
                text: elm.ProjectName,
                additional: {
                  teamBy: elm.ProjectPrefix,
                },
              });
            });

            let localData = [...projestAssign, ...projestAssignLocal];
            finalResult = _.uniqBy(localData, "id");
            this.selectedCategData = finalResult;
            this.selectedJobData = finalResult;
            this.projectFilterListByEmp = finalResult;
          });
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  //list project based on empID end

  //Add log Functions start

  //list milestone on project based start
  public onChangeJob(e: any) {
    this.selecteJobOptionValue = e.value;
    this.fetchActByProjectID(e.value);
    this.officetaskListValue = "";
  }

  public fetchActByProjectID(projectId) {
    let project_id = {
      ID: projectId,
    };
    this.projectService.GetMilestoneByProjectID(project_id).subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];
        data.map((elm) => {
          results.push({
            id: elm.milestoneId,
            text: elm.milestoneName,
          });
        });
        this.activtasksList = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }
  //list milestone on project based ends

  //list task on milestone based starts
  public onChangeMilestone(e: any): void {
    this.officeActListValue = e.value;
    this.officeactText = e.data[0].text;
    if (e.value) {
      this.showprojTask = true;
      this.GetProjTaskonActID(e.value);
    } else {
      this.showprojTask = false;
    }
  }

  //add log get task based on milestone
  public GetProjTaskonActID(id): void {
    let actID = {
      milestoneID: id,
    };
    this.projectService.GetAllEmployeeTasksByMilestoneId(actID).subscribe(
      (data: any) => {
        this.projTaskData = [];
        var results = [
          { id: "", text: "Select", additional: { assigned_empid: "" } },
        ];
        if (data.length !== 0) {
          data.map((elm) => {
            results.push({
              id: elm.TaskId,
              text: elm.TaskName,
              additional: {
                assigned_empid: elm.EmployeeId,
              },
            });
          });
          this.projTaskData = results;
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then((result) => {});
      }
    );
  }

  public changedOfficeTask(e: any): void {
    console.log(e);
    this.officetaskListValue = e.value;
    this.officetaskText = e.data[0].text;
    let user: object = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    if (e.value != "") {
      this.GetAllMainandLocalSubTaskListByEmployeeId(e.value);
    } else {
      this.recentTaskSel = true;
      this.projTaskDataValue = "";
    }
  }

  //Add log Functions ends

  //call from parent comp
  getParentApi(): ParentComponentApi {
    return {
      callParentMethod: () => {
        this.OnTaskClose();
        /* if(this.jobFilterValue!=''){
          console.log(this.jobFilterValue,'condition 1')
          this.getAllTaskbyLocalJoB(this.jobFilterValue);
        }else{
          console.log(this.jobFilterValue,'condition 2')
          this.GetAllTaskListByEmployeeID(this.jobFilterValue);
        }
        this.GetAllTaskDescByEmpIDList();
        this.GetAllTaskListByEmployeeID(this.jobFilterValue); */
        if (this.showProjBasedTasks) {
          this.getalltaskbyJob(this.jobFilterValue);
        } else {
          this.getAllTaskbyLocalJoB(this.jobFilterValue);
        }
        this.GetAllTaskDescByEmpIDList();
      },
    };
  }

  //checkin new
  callCheckinModel() {
    $("#checkinActivityModal").modal("show");
    this.getUserLatLong();
  }

  getUserLatLong() {
    this.getPreciseLocation()
      .then((locValue) => {
        this.userlatitudelongitude = locValue;
        console.log("user Lat long", locValue);
      })
      .catch((error) => {
        this.userLocationError(error);
      });
  }

  //get user lat long from browser
  getPreciseLocation() {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          if (
            position.coords.latitude !== null &&
            position.coords.longitude !== null
          ) {
            resolve([position.coords.latitude, position.coords.longitude]);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  userLocationError(err) {
    Swal.fire({
      title: "Location Access Denied",
      text: "Unable to get location because " + err.message,
      type: "error",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.value === true) {
        $("#checkinActivityModal").modal("hide");
      }
    });
  }

  onTabValueChange(value) {
    this.tabValueSelected = value;

    if (this.tabValueSelected === "projectCheckin") {
      this.getUserType();
      this.projectCheckinDiv = true;
      this.placeCheckinDiv = false;
      this.caseCheckinDiv = false;
      this.officeWFHdiv = false;
      this.officeSelected = false;
      this.wfhSelected = false;
      this.showTeamMainDiv = true;
      this.placediv = false;
    } else if (this.tabValueSelected === "Case") {
      this.projectCheckinDiv = false;
      this.placeCheckinDiv = false;
      this.caseCheckinDiv = true;
      this.showTeamMainDiv = false;
    } else if (this.tabValueSelected === "placeCheckin") {
      this.projectCheckinDiv = false;
      this.placeCheckinDiv = true;
      this.caseCheckinDiv = false;

      this.officeWFHdiv = true;
      this.officeSelected = true;
      this.wfhSelected = false;
      this.xpandStatus = false;
      this.selectOfficeData();

      this.projectDataToBeDisplayed = {} as ProjectData;
      this.showProjDetails = false;
      this.showTeamMainDiv = true;
    }
  }

  //project checkin start
  getUserType() {
    let userInfo = JSON.parse(localStorage.getItem("user_info"));
    if (userInfo.is_superadmin === true || userInfo.is_admin === true) {
      this.nGetProjByOrgID();
    } else {
      this.nFetchAllEmployeeProjectByEmpID();
    }
  }

  //all project for admin
  async nGetProjByOrgID() {
    try {
      this.isProjectLoading = true;
      const projectData: any = await this.projectService
        .FetchAllProjectByOrgID()
        .toPromise();

      let results = [{ id: "", text: "Select", additional: { teamBy: "" } }];
      if (projectData) {
        projectData.forEach((elm) => {
          results.push({
            id: elm.project_id,
            text: elm.project_name,
            additional: {
              teamBy: elm.project_prefix,
            },
          });
        });
        this.isProjectLoading = false;
        this.projectListing = results;
      }
    } catch (error) {
      Swal.fire("Error!", error.message || "An error occurred", "error");
    }
  }
  //project for employee
  // nFetchAllEmployeeProjectByEmpID() {
  //   this.projectService.FetchAllEmployeeProjectByEmpID().subscribe(
  //     (projectData: any) => {
  //       let finalResult = [
  //         { id: "", text: "Select", additional: { teamBy: "" } },
  //       ];
  //       projectData.map((elm) => {
  //         finalResult.push({
  //           id: elm.ProjectId,
  //           text: elm.ProjectName,
  //           additional: {
  //             teamBy: elm.ProjectPrefix,
  //           },
  //         });
  //       });
  //       this.projectListing = finalResult;
  //     },
  //     (error) => {
  //       Swal.fire("Error!", error, "error");
  //     }
  //   );
  // }

  async nFetchAllEmployeeProjectByEmpID() {
    try {
      this.isProjectLoading = true;
      const projectData: any = await this.projectService
        .FetchAllEmployeeProjectByEmpID()
        .toPromise();

      let finalResult = [
        { id: "", text: "Select", additional: { teamBy: "" } },
      ];
      if (projectData) {
        projectData.forEach((elm) => {
          finalResult.push({
            id: elm.ProjectId,
            text: elm.ProjectName,
            additional: {
              teamBy: elm.ProjectPrefix,
            },
          });
        });

        this.projectListing = finalResult;
        this.isProjectLoading = false;
      }
    } catch (error) {
      Swal.fire("Error!", error.message || "An error occurred", "error");
    }
  }

  async nFindByProjectID(val: number) {
    const postData = { id: val };

    try {
      const data: any = await this.projectService
        .FindByProjectID(postData)
        .toPromise();
      console.log(data, "PROJECT DATA!!!");

      if (data) {
        if (data.entityCustomer) {
          this.projectDataToBeDisplayed = data;
          this.showProjDetails = true;
        } else {
          this.showProjDetails = false;
          this.toastr.warning("No customer details found for this project");
        }

        // if(data.entityLocation){
        //   let projectLat= data.entityLocation ? data.entityLocation.lat : "";
        //  let projectLong=data.entityLocation ? data.entityLocation.lang : "";
        //  console.log(data.entityLocation,"*****")
        //  this.getProjectRadius(projectLat,projectLong,data);
        //  }
      }
    } catch (error) {
      Swal.fire("Error!", error.message || "An error occurred", "error");
    }
  }
  async nChangedOption(event) {
    console.log(event);
    this.showProjDetails = false;
    this.projectBorderContain = false;
    this.projectDataToBeDisplayed = {} as ProjectData;
    if (event.value !== "") {
      await this.nFindByProjectID(event.value);
      this.selectedPojectDetails = {
        id: event.value,
        name: event.data[0].text,
      };
      console.log(this.selectedPojectDetails, "selectedPojectDetails");
    }
  }
  //project checkin end

  //place checkin start
  checkIfOfficeOrPlace(e: any) {
    if (e.srcElement.checked) {
      //place checkin
      this.placediv = true;
      this.officeWFHdiv = false;
      this.officeSelected = false;
      this.wfhSelected = false;
    } else {
      //office or wfh
      this.placediv = false;
      this.officeWFHdiv = true;
      this.officeSelected = true;
      this.wfhSelected = false;
      this.xpandStatus = false;
      this.selectOfficeData();
    }

    this.showTeamMainDiv = true;
  }

  selectOfficeOrWFH(e) {
    console.log(e);
    if (e.srcElement.id === "Office") {
      this.officeSelected = true;
      this.wfhSelected = false;
      this.xpandStatus = false;
      this.selectOfficeData();
      $("#PlaceOrOfficeCheck").attr("disabled", false);

      this.showTeamMainDiv = true;
    } else if (e.srcElement.id === "WFH") {
      this.wfhSelected = true;
      this.officeSelected = false;
      this.callLocationForWFH();
      this.nearbyAddress = this.formatted_address;
      $("#PlaceOrOfficeCheck").prop("disabled", true);

      this.showTeamMainDiv = false;
    }
  }

  /* callMapFunctionForPlace(){
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
    })
    this.zoom = 15;
  }
 */
  callLocationForWFH() {
    console.log(this.userlatitudelongitude);
    if (this.userlatitudelongitude.length !== 0) {
      if (
        this.userlatitudelongitude[0] !== null &&
        this.userlatitudelongitude[1]
      ) {
        this.timeService
          .getAddressFromMapBox(
            this.userlatitudelongitude[1],
            this.userlatitudelongitude[0]
          )
          .subscribe((data: any) => {
            console.log(
              "data.features[0].place_name",
              data.features[0].place_name
            );
            this.addressFromMpbox = data.features[0].place_name;
          });

        this.getAddressFromGoogle(
          this.userlatitudelongitude[0],
          this.userlatitudelongitude[1]
        );
      } else {
        this.wfhNoLOcation();
      }
    } else {
      this.wfhNoLOcation();
    }
  }

  wfhNoLOcation() {
    Swal.fire(
      "Please try again!",
      "Location not fetched due to low internet speed",
      "error"
    ).then((result) => {
      if (result.value === true) {
        $("#checkinActivityModal").modal("hide");
        this.getUserLatLong();
      }
    });
  }

  selectOfficeData() {
    this.orgService.FindAllOrgByHeadOrgID().subscribe(
      (orgData: any) => {
        console.log("this api 2", orgData);
        orgData.map((elm) => {
          if (elm.org_id === localStorage.getItem("org_id")) {
            this.selecteOptionValue = elm.org_name;
            this.selectedOfficeId = elm.org_id;
            this.selectedentitiyLoc = elm.entityLocation;
            this.checkOptionValue = true;
            this.selectedOrgOption(elm);
          }
        });
        this.officeData = orgData;
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );
  }

  selectedOrgOption(e): void {
    this.xpandStatus = false;
    this.selectedValue = e.org_name;
    this.selectedOfficeId = e.org_id;
    this.selectedentitiyLoc = e.entityLocation;
    this.getOfficeRadus(
      e.entityLocation.lat,
      e.entityLocation.lang,
      e.entityLocationRadius
    );
  }

  getOfficeRadus(officeLat, officeLong, company) {
    var latLngCenter = new google.maps.LatLng(
        this.userlatitudelongitude[0],
        this.userlatitudelongitude[1]
      ),
      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 19,
        center: latLngCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
      }),
      latLngA = new google.maps.LatLng(officeLat, officeLong),
      circle = new google.maps.Circle({
        map: map,
        clickable: false,
        radius: company.radius === null ? 200 : Number(company.radius),
        fillColor: "#fff",
        fillOpacity: 0.6,
        strokeColor: "#313131",
        strokeOpacity: 0.4,
        strokeWeight: 2,
        center: latLngCenter,
      });
    var bounds = circle.getBounds();
    this.boundryContain = bounds.contains(latLngA);
    console.log(this.boundryContain);
  }

  //Comparing User Location with Project Location
  getProjectRadius(projectLat: number, projectLong: number, project: any) {
    console.log(projectLat, projectLong, project, "getProjectRadius");
    let formattedRadius = 0;
    if (project.radius && project.radius !== null) {
      let radius = project.radius;
      formattedRadius = parseFloat(radius.toString());
    }
    console.log(formattedRadius, project.radius, "RADIUS");
    const latLngCenter = new google.maps.LatLng(
      this.userlatitudelongitude[0],
      this.userlatitudelongitude[1]
    );
    console.log(
      this.userlatitudelongitude[0],
      this.userlatitudelongitude[1],
      "CHECK USER"
    );
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 19,
      center: latLngCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
    });

    const latLngProject = new google.maps.LatLng(projectLat, projectLong);
    // console.log(project.radius === null ? 1000 : Number(project.radius),"RADIUS")
    const circle = new google.maps.Circle({
      map: map,
      clickable: false,
      radius: formattedRadius,
      fillColor: "#fff",
      fillOpacity: 0.6,
      strokeColor: "#313131",
      strokeOpacity: 0.4,
      strokeWeight: 2,
      center: latLngCenter,
    });

    const bounds = circle.getBounds();

    // this.boundryContain = bounds.contains(latLngProject);

    let value = bounds.contains(latLngProject);
    this.projectBorderContain = value;
    console.log(this.projectBorderContain, "this.projectBorderContain");
    return value;
  }

  //google Api call
  async getAddressFromGoogle(latitude: number, longitude: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const addr = new google.maps.Geocoder();
  
      addr.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
        if (status === "OK") {
          if (results.length !== 0) {
            this.geoCodeData = results[0];
            this.formatted_address = results[0].formatted_address;
            this.getAddressMatchedTypes();
            this.AddEmpGecoCodEvent();
            resolve(); // Resolve the promise if successful
          } else {
            Swal.fire("Please try again!", "Location not found", "error").then((result) => {
              if (result.value === true) {
                $("#checkinActivityModal").modal("hide");
              }
              reject(new Error("Location not found")); // Reject the promise
            });
          }
        } else if (status === "ERROR") {
          Swal.fire("Please try again!", "Please check the internet connection", "error").then((result) => {
            if (result.value === true) {
              $("#checkinActivityModal").modal("hide");
            }
            reject(new Error("Internet connection error")); // Reject the promise
          });
        } else if (status === "REQUEST_DENIED") {
          Swal.fire("Please try again!", "Please allow location access", "error").then((result) => {
            if (result.value === true) {
              $("#checkinActivityModal").modal("hide");
            }
            reject(new Error("Location access denied")); // Reject the promise
          });
        } else if (status === "OVER_QUERY_LIMIT") {
          Swal.fire("Please try again!", "Subscription exceeded. Please contact Admin", "error").then((result) => {
            if (result.value === true) {
              $("#checkinActivityModal").modal("hide");
            }
            reject(new Error("Query limit exceeded")); // Reject the promise
          });
        } else {
          Swal.fire("Please try again!", status, "error").then((result) => {
            if (result.value === true) {
              $("#checkinActivityModal").modal("hide");
            }
            reject(new Error(`Geocode error: ${status}`)); // Reject the promise
          });
        }
      });
    });
  }
  

  getAddressMatchedTypes() {
    let address_components;
    if (this.geoCodeData.length !== 0) {
      address_components = this.geoCodeData["address_components"];
      let i, j, types;
      for (i = 0; i < address_components.length; i++) {
        types = address_components[i]["types"];
        for (j = 0; j < types.length; j++) {
          if (types[j] == "street_number") {
            this.street_number = address_components[i]["short_name"];
          }
          if (types[j] === "route") {
            this.route = address_components[i]["long_name"];
          }
          if (types[j] === "neighborhood") {
            this.street_number = address_components[i]["long_name"];
          }
          if (types[j] === "locality") {
            this.locality = address_components[i]["long_name"];
          }
          if (types[j] === "administrative_area_level_1") {
            this.administrative_area_level_1 =
              address_components[i]["long_name"];
          }
          if (types[j] === "administrative_area_level_2") {
            this.administrative_area_level_2 =
              address_components[i]["long_name"];
          }
          if (types[j] === "postal_code") {
            this.postal_code = address_components[i]["long_name"];
          }
          if (types[j] === "country") {
            this.country = address_components[i]["long_name"];
          }
        }
      }
    }

    if (this.officeSelected) {
      this.callOfficeCheckin();
    } else if (this.projectCheckinDiv) {
      this.callProjectCheckin();
    } else if (this.placediv) {
      this.callPlaceCheckin();
    } else if (this.caseCheckinDiv) {
      this.callCaseCheckin();
    } else {
      console.log("Nothing");
    }
  }

  AddEmpGecoCodEvent() {
    let userInfo = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      emp_id: userInfo.id,
      org_id: userInfo.org_id,
      team_id: userInfo.team_id,
    };
    this.empService.AddEmpGecoCodEvent(postData).subscribe((data: any) => {
      console.log(data);
    });
    console.log("call 1");
  }

  AddEmpMapViewEvent() {
    let userInfo = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      emp_id: userInfo.id,
      org_id: userInfo.org_id,
      team_id: userInfo.team_id,
    };
    this.empService.AddEmpMapViewEvent(postData).subscribe((data: any) => {
      console.log(data);
    });
    console.log("call 1");
  }

  placeInputValue(event) {
    this.manualInputValue = event.target.value;
    this.typeText = false;
  }

  onCheckinSubmit() {
    this.getUserLatLong();
    this.spinner.show();
    if (this.userlatitudelongitude.length !== 0) {
      if (
        this.userlatitudelongitude[0] !== null &&
        this.userlatitudelongitude[1]
      ) {
        if (this.officeSelected) {
          if (this.boundryContain) {
            //Wrap this in if condition
            this.timeService
              .getAddressFromMapBox(
                this.userlatitudelongitude[1],
                this.userlatitudelongitude[0]
              )
              .subscribe((data: any) => {
                console.log(
                  "data.features[0].place_name",
                  data.features[0].place_name
                );
                this.addressFromMpbox = data.features[0].place_name;
              });

            this.getAddressFromGoogle(
              this.userlatitudelongitude[0],
              this.userlatitudelongitude[1]
            );
          } else {
            Swal.fire(
              "Oops!",
              "Your current location isn't matched with the office location",
              "error"
            ).then((result) => {
              if (result.value === true) {
                $("#checkinActivityModal").modal("hide");
              }
            });
            this.spinner.hide();
          }
        } else if (this.wfhSelected) {
          this.callWorkFromHome();
        } else if (this.placediv) {
          //Wrap this in if condition
          this.timeService
            .getAddressFromMapBox(
              this.userlatitudelongitude[1],
              this.userlatitudelongitude[0]
            )
            .subscribe((data: any) => {
              console.log(
                "data.features[0].place_name",
                data.features[0].place_name
              );
              this.addressFromMpbox = data.features[0].place_name;
            });
          this.getAddressFromGoogle(
            this.userlatitudelongitude[0],
            this.userlatitudelongitude[1]
          );
        } else if (this.projectCheckinDiv) {
          console.log(
            this.projectDataToBeDisplayed,
            this.projectDataToBeDisplayed.entityLocation,
            "this.projectDataToBeDisplayed"
          );
          let data: any = this.projectDataToBeDisplayed.entityLocation;
          if (data) {
            let projectLat = data.lat ? data.lat : "";
            let projectLong = data.lang ? data.lang : "";
            // console.log(data, "*****");
            let value = this.getProjectRadius(projectLat, projectLong, data);
            // console.log(value,"PROJECT BORDER")
            if (value) {
              this.timeService
                .getAddressFromMapBox(
                  this.userlatitudelongitude[1],
                  this.userlatitudelongitude[0]
                )
                .subscribe((data: any) => {
                  console.log(
                    "data.features[0].place_name",
                    data.features[0].place_name
                  );
                  this.addressFromMpbox = data.features[0].place_name;
                });
              this.getAddressFromGoogle(
                this.userlatitudelongitude[0],
                this.userlatitudelongitude[1]
              );
            } else {
              Swal.fire(
                "Oops!",
                "Your current location isn't matched with the project location",
                "error"
              ).then((result) => {
                if (result.value === true) {
                  $("#checkinActivityModal").modal("hide");
                }
              });
              this.spinner.hide();
            }
          } else {
            this.spinner.hide();
            Swal.fire({
              title:
                "Project Location not found, Do you want to set your current location as project location?",
              showCancelButton: true,
              confirmButtonText: "Confirm",
              cancelButtonText: "Cancel",
              allowOutsideClick: false,
            }).then((result) => {
              console.log(result, "CHECK");
              if (result.value) {
                // const reason = result.value;
                let data = {
                  lat: this.userlatitudelongitude[0],
                  lang: this.userlatitudelongitude[1],
                  // project_id: this.projectDataToBeDisplayed.id,
                };
                this.handleInitialProjectCheckin();
              }
            });
          }
        } else if (this.caseCheckinDiv) {
          //Wrap this in if condition
          this.timeService
            .getAddressFromMapBox(
              this.userlatitudelongitude[1],
              this.userlatitudelongitude[0]
            )
            .subscribe((data: any) => {
              this.addressFromMpbox = data.features[0].place_name;
            });
          this.getAddressFromGoogle(
            this.userlatitudelongitude[0],
            this.userlatitudelongitude[1]
          );
        }
      } else {
        console.log("again lat long");
        this.getUserLatLong();
        this.latLongNotReceived();
      }
    } else {
      console.log("again lat long");
      this.getUserLatLong();
      this.latLongNotReceived();
    }
  }
  async handleInitialProjectCheckin() {
    try {
      const mapBoxData: any = await this.timeService
        .getAddressFromMapBox(this.userlatitudelongitude[1], this.userlatitudelongitude[0])
        .toPromise();
  
      console.log(
        "data.features[0].place_name- handleInitialProjectCheckin",
        mapBoxData.features[0].place_name
      );
  
      this.addressFromMpbox = mapBoxData.features[0].place_name;
  
      await this.getAddressFromGoogle(this.userlatitudelongitude[0], this.userlatitudelongitude[1]);
  
      const postData = {
        entity_id: this.selectedPojectDetails.id,
        geo_address: this.formatted_address,
        formatted_address: this.formatted_address,
        lat: this.userlatitudelongitude[0] ? JSON.stringify(this.userlatitudelongitude[0]) : "",
        lang: this.userlatitudelongitude[1] ? JSON.stringify(this.userlatitudelongitude[1]) : "",
        street_number: this.street_number,
        route: this.route,
        locality: this.locality,
        administrative_area_level_2: this.administrative_area_level_2,
        administrative_area_level_1: this.administrative_area_level_1,
        postal_code: "",
        country: this.country,
        city: this.administrative_area_level_1,
        radius:300
      };
  
      const res: any = await this.projectService.AddEntityLocation(postData).toPromise();
  
      if (res.status === "200") {
        console.log(res);
        this.toastr.success(res.desc)
      } else {
        console.error('Failed to add entity location', res);
      }
    } catch (error) {
      console.error('An error occurred while handling initial project check-in', error);
    }
  }
  
  latLongNotReceived() {
    Swal.fire(
      "Oops!",
      "Location not been able to fetch. please try again",
      "error"
    ).then((result) => {
      if (result.value === true) {
        $("#checkinActivityModal").modal("hide");
        this.spinner.hide();
      }
    });
  }

  callOfficeCheckin() {
    let team_member_empid = [];
    let userData = JSON.parse(localStorage.getItem("user_info"));
    if (this.teamMemFetchData && this.teamAdd) {
      for (var i = 0; i < this.teamMemFetchData.length; i++) {
        team_member_empid.push(this.teamMemFetchData[i].id);
      }
    }

    let checkinTime = localStorage.getItem("currentTime");
    let date = moment().format("MM/DD/YYYY");
    this.checkInTime = date.concat(" " + checkinTime);

    let checkinType = "Office";
    let typeOfCheckinValue = this.selectedValue;
    let postData = {
      team_member_empid: !this.teamAdd ? [userData.id] : team_member_empid,
      teamid: null,
      is_app_check_In: false,
      check_in: this.checkInTime,
      createdby: userData.full_name,
      is_inrange: true,
      checkin_user_empid: userData.id,
    };

    postData["timesheetCategoryViewModel"] = {
      project_category_type: checkinType,
      project_or_comp_id:
        checkinType === "Office" ? this.selectedOfficeId : null,
      project_or_comp_name: typeOfCheckinValue,
      project_or_comp_type: null,
    };

    postData["timesheetSearchLocationViewModel"] = {
      manual_address: null,
      geo_address: this.formatted_address,
      formatted_address: this.formatted_address,
      formatted_address_map_box:
        this.addressFromMpbox.length > 0 ? this.addressFromMpbox : null,
      lat: this.userlatitudelongitude[0],
      lang: this.userlatitudelongitude[1],
      street_number: this.street_number,
      route: this.route,
      locality: this.locality,
      administrative_area_level_2: this.administrative_area_level_1,
      administrative_area_level_1: this.administrative_area_level_2,
      postal_code: this.postal_code,
      country: this.country,
      is_office: true,
      is_manual: false,
      is_wfh: false,
    };

    postData["timesheetCurrentLocationViewModel"] = {
      formatted_address: this.formatted_address ? this.formatted_address : "",
      lat: this.userlatitudelongitude[0],
      lang: this.userlatitudelongitude[1],
      street_number: this.street_number,
      route: this.route,
      locality: this.locality,
      administrative_area_level_2: this.administrative_area_level_1,
      administrative_area_level_1: this.administrative_area_level_2,
      postal_code: this.postal_code,
      country: this.country,
    };

    this.timeService.AddTimeLog(postData).subscribe(
      (data: any) => {
        $("#checkinActivityModal").modal("hide");
        if (data.status == 200) {
          this.onCheckinclose();
          this.LastCheckinByEmpID();
          this.getTimesheetByEmpId();
        } else {
          this.serverError();
        }
        this.spinner.hide();
      },
      (error) => {
        $("#checkinActivityModal").modal("hide");
        Swal.fire("Error!", error, "error");
        this.spinner.hide();
      }
    );
  }

  callWorkFromHome() {
    let userData = JSON.parse(localStorage.getItem("user_info"));
    let checkinTime = localStorage.getItem("currentTime");
    let date = moment().format("MM/DD/YYYY");
    this.checkInTime = date.concat(" " + checkinTime);

    let postData = {
      team_member_empid: [userData.id],
      teamid: null,
      is_app_check_In: false,
      check_in: this.checkInTime,
      createdby: userData.full_name,
      is_inrange: false,
      checkin_user_empid: userData.id,
    };
    postData["timesheetCategoryViewModel"] = {
      project_category_type: "Place",
      project_or_comp_id: null,
      project_or_comp_name: this.formatted_address,
      project_or_comp_type: null,
    };

    postData["timesheetSearchLocationViewModel"] = {
      manual_address: null,
      geo_address: this.formatted_address,
      formatted_address: this.formatted_address,
      formatted_address_map_box:
        this.addressFromMpbox.length > 0 ? this.addressFromMpbox : null,
      lat: this.userlatitudelongitude[0],
      lang: this.userlatitudelongitude[1],
      street_number: this.street_number,
      route: this.route,
      locality: this.locality,
      administrative_area_level_2: this.administrative_area_level_1,
      administrative_area_level_1: this.administrative_area_level_2,
      postal_code: this.postal_code,
      country: this.country,
      is_office: false,
      is_manual: false,
      is_wfh: true,
    };

    postData["timesheetCurrentLocationViewModel"] = {
      formatted_address: this.formatted_address ? this.formatted_address : "",
      lat: this.userlatitudelongitude[0],
      lang: this.userlatitudelongitude[1],
      street_number: this.street_number,
      route: this.route,
      locality: this.locality,
      administrative_area_level_2: this.administrative_area_level_1,
      administrative_area_level_1: this.administrative_area_level_2,
      postal_code: this.postal_code,
      country: this.country,
    };

    this.timeService.AddTimeLog(postData).subscribe(
      (data: any) => {
        console.log(postData, data);
        $("#checkinActivityModal").modal("hide");
        if (data.status == 200) {
          this.onCheckinclose();
          this.LastCheckinByEmpID();
          this.getTimesheetByEmpId();
        } else {
          this.serverError();
        }
        this.spinner.hide();
      },
      (error) => {
        $("#checkinActivityModal").modal("hide");
        Swal.fire("Error!", error, "error");
        this.spinner.hide();
      }
    );
  }

  remarksInputEvent(event) {
    this.remarksInputValue = event.target.value;
  }

  callCaseCheckin() {
    let userData = JSON.parse(localStorage.getItem("user_info"));
    let checkinTime = localStorage.getItem("currentTime");
    let date = moment().format("MM/DD/YYYY");
    this.checkInTime = date.concat(" " + checkinTime);
    let checkinType = "Case";

    let postData = {
      team_member_empid: [userData.id],
      teamid: null,
      is_app_check_In: false,
      check_in: this.checkInTime,
      createdby: userData.full_name,
      is_inrange: false,
      checkin_user_empid: userData.id,
    };
    postData["timesheetCategoryViewModel"] = {
      project_category_type: checkinType,
      project_or_comp_id: JSON.parse(localStorage.getItem("user_info")).org_id,
      project_or_comp_name: this.selectedCase
        ? this.selectedCase["case_name"]
        : null,
      project_or_comp_type: null,
    };

    postData["timesheetSearchLocationViewModel"] = {
      manual_address: this.manualInputValue,
      geo_address: this.formatted_address,
      formatted_address: this.formatted_address,
      formatted_address_map_box:
        this.addressFromMpbox.length > 0 ? this.addressFromMpbox : null,
      lat: this.userlatitudelongitude[0],
      lang: this.userlatitudelongitude[1],
      street_number: this.street_number,
      route: this.route,
      locality: this.locality,
      administrative_area_level_2: this.administrative_area_level_1,
      administrative_area_level_1: this.administrative_area_level_2,
      postal_code: this.postal_code,
      country: this.country,
      is_office: false,
      is_manual: true,
      is_wfh: false,
    };

    postData["timesheetCurrentLocationViewModel"] = {
      formatted_address: this.formatted_address ? this.formatted_address : "",
      lat: this.userlatitudelongitude[0],
      lang: this.userlatitudelongitude[1],
      street_number: this.street_number,
      route: this.route,
      locality: this.locality,
      administrative_area_level_2: this.administrative_area_level_1,
      administrative_area_level_1: this.administrative_area_level_2,
      postal_code: this.postal_code,
      country: this.country,
    };

    postData["caseActivityViewModel"] = {
      case_type_id: this.selectedCase
        ? this.selectedCase["case_type_id"]
        : null,
      case_history_id: this.selectedCase ? this.selectedCase["id"] : null,
      org_id: JSON.parse(localStorage.getItem("user_info")).org_id,
      emp_id: JSON.parse(localStorage.getItem("user_info")).id,
      activity: this.selectedCase ? this.selectedCase["case_name"] : null,
      activity_description: this.remarksInputValue,
      activity_status: "Open",
      created_date: date,
      created_by: JSON.parse(localStorage.getItem("user_info")).id,
      modified_date: date,
      modified_by: JSON.parse(localStorage.getItem("user_info")).id,
    };

    this.timeService.AddTimeLog(postData).subscribe(
      (data: any) => {
        console.log(postData, data);
        $("#checkinActivityModal").modal("hide");
        if (data.status == 200) {
          this.onCheckinclose();
          this.LastCheckinByEmpID();
          this.getTimesheetByEmpId();
        } else {
          this.serverError();
        }
        this.spinner.hide();
      },
      (error) => {
        $("#checkinActivityModal").modal("hide");
        Swal.fire("Error!", error, "error");
        this.spinner.hide();
      }
    );
  }

  callPlaceCheckin() {
    let userData = JSON.parse(localStorage.getItem("user_info"));
    let checkinTime = localStorage.getItem("currentTime");
    let date = moment().format("MM/DD/YYYY");
    this.checkInTime = date.concat(" " + checkinTime);
    let checkinType = "Place";

    let postData = {
      team_member_empid: [userData.id],
      teamid: null,
      is_app_check_In: false,
      check_in: this.checkInTime,
      createdby: userData.full_name,
      is_inrange: false,
      checkin_user_empid: userData.id,
    };
    postData["timesheetCategoryViewModel"] = {
      project_category_type: checkinType,
      project_or_comp_id: null,
      project_or_comp_name: this.manualInputValue,
      project_or_comp_type: null,
    };

    postData["timesheetSearchLocationViewModel"] = {
      manual_address: this.manualInputValue,
      geo_address: this.formatted_address,
      formatted_address: this.formatted_address,
      formatted_address_map_box:
        this.addressFromMpbox.length > 0 ? this.addressFromMpbox : null,
      lat: this.userlatitudelongitude[0],
      lang: this.userlatitudelongitude[1],
      street_number: this.street_number,
      route: this.route,
      locality: this.locality,
      administrative_area_level_2: this.administrative_area_level_1,
      administrative_area_level_1: this.administrative_area_level_2,
      postal_code: this.postal_code,
      country: this.country,
      is_office: false,
      is_manual: true,
      is_wfh: false,
    };

    postData["timesheetCurrentLocationViewModel"] = {
      formatted_address: this.formatted_address ? this.formatted_address : "",
      lat: this.userlatitudelongitude[0],
      lang: this.userlatitudelongitude[1],
      street_number: this.street_number,
      route: this.route,
      locality: this.locality,
      administrative_area_level_2: this.administrative_area_level_1,
      administrative_area_level_1: this.administrative_area_level_2,
      postal_code: this.postal_code,
      country: this.country,
    };

    this.timeService.AddTimeLog(postData).subscribe(
      (data: any) => {
        console.log(postData, data);
        $("#checkinActivityModal").modal("hide");
        if (data.status == 200) {
          this.onCheckinclose();
          this.LastCheckinByEmpID();
          this.getTimesheetByEmpId();
        } else {
          this.serverError();
        }
        this.spinner.hide();
      },
      (error) => {
        $("#checkinActivityModal").modal("hide");
        Swal.fire("Error!", error, "error");
        this.spinner.hide();
      }
    );
  }

  callProjectCheckin() {
    let team_member_empid = [];
    let userData = JSON.parse(localStorage.getItem("user_info"));
    if (this.teamMemFetchData && this.teamAdd) {
      for (var i = 0; i < this.teamMemFetchData.length; i++) {
        team_member_empid.push(this.teamMemFetchData[i].id);
      }
    }

    let checkinTime = localStorage.getItem("currentTime");
    let date = moment().format("MM/DD/YYYY");
    this.checkInTime = date.concat(" " + checkinTime);

    let checkinType = "Job";
    let postData = {
      team_member_empid: !this.teamAdd ? [userData.id] : team_member_empid,
      teamid: null,
      is_app_check_In: false,
      check_in: this.checkInTime,
      createdby: userData.full_name,
      is_inrange: false,
      checkin_user_empid: userData.id,
    };

    postData["timesheetCategoryViewModel"] = {
      project_category_type: checkinType,
      project_or_comp_id: this.selectedPojectDetails.id,
      project_or_comp_name: this.selectedPojectDetails.name,
      project_or_comp_type: null,
    };

    postData["timesheetSearchLocationViewModel"] = {
      formatted_address_map_box:
        this.addressFromMpbox.length > 0 ? this.addressFromMpbox : null,
    };

    postData["timesheetCurrentLocationViewModel"] = {
      formatted_address: this.formatted_address ? this.formatted_address : "",
      lat: this.userlatitudelongitude[0],
      lang: this.userlatitudelongitude[1],
      street_number: this.street_number,
      route: this.route,
      locality: this.locality,
      administrative_area_level_2: this.administrative_area_level_1,
      administrative_area_level_1: this.administrative_area_level_2,
      postal_code: this.postal_code,
      country: this.country,
    };

    console.log("postData --->", postData);

    this.timeService.AddTimeLog(postData).subscribe(
      (data: any) => {
        console.log(postData, data);
        $("#checkinActivityModal").modal("hide");
        if (data.status == 200) {
          this.selectedPojectDetails = "";
          this.onCheckinclose();
          this.LastCheckinByEmpID();
          this.getTimesheetByEmpId();
        } else {
          this.serverError();
        }
        this.spinner.hide();
      },
      (error) => {
        $("#checkinActivityModal").modal("hide");
        Swal.fire("Error!", error, "error");
        this.spinner.hide();
      }
    );
  }
  // Manage leave
  tabSelected(event) {
    console.log(event, "EVENT");
    this.getHeaderValue = event.selectedItem.outerText;
    console.log(this.getHeaderValue);
    this.checkTabApiCall();
  }
  attendanceOverwriteCellCustomise(args: any) {
    if (args.data["leave_status"] == "Checkin/Checkout Overwrite Pending") {
      args.cell.classList.add("background-inPending");
    } else if (
      args.data["leave_status"] == "Checkin/Checkout Overwrite Approved"
    ) {
      args.cell.classList.add("background-inApproved");
    }
  }
  customiseCell(args: any) {
    if (args.data["leave_status"] == "Checkin Pending") {
      args.cell.classList.add("background-green");
    } else if (args.data["leave_status"] == "Leave Approved") {
      args.cell.classList.add("background-yellow");
    } else if (args.data["leave_status"] == "Leave Declined") {
      args.cell.classList.add("background-red");
    } else if (args.data["leave_status"] == "Leave Pending") {
      args.cell.classList.add("background-green");
    } else if (args.data["leave_status"] == "Checkin Approved") {
      args.cell.classList.add("background-yellow");
    } else if (args.data["leave_status"] == "Checkin Declined") {
      args.cell.classList.add("background-red");
    }
    // }
  }

  onCheckinclose() {
    this.showTeamMainDiv = false;
    this.projectCheckinDiv = false;
    this.showProjDetails = false;
    this.placeCheckinDiv = false;
    this.officeWFHdiv = true;
    this.placediv = false;
    this.officeSelected = false;
    this.wfhSelected = false;
    this.typeText = true;
    this.tabValueSelected = "";
    this.casetabValueSelected = "";
  }

  serverError() {
    $("#checkinActivityModal").modal("hide");
    Swal.fire(
      "Error!",
      "Something went wrong : Server not responding",
      "error"
    );
  }
}

export interface ParentComponentApi {
  callParentMethod: () => void;
  // taskParentMethod: () => void
}

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
