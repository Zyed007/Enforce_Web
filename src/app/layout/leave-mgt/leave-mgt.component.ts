import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import Swal from "sweetalert2";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmployeeService } from "../../services/employee.service";
import { LeaveService } from "../../services/leave.service";
import { UserService } from "../../services/user.service";
import moment = require("moment");
import { Toast, ToastrService } from "ngx-toastr";
import { DataManager } from "@syncfusion/ej2-data";
import { NgxSpinnerService } from "ngx-spinner";
import { OrganizationService } from "../../services/organization.service";
import { AdminSettingService } from "./../../services/admin-setting.service";
import { MapsAPILoader, MouseEvent, AgmMap } from "@agm/core";
import { TimeSheetService } from "../../services/timesheet.service";
import {
  DatePickerComponent,
  FocusEventArgs,
  RenderDayCellEventArgs,
} from "@syncfusion/ej2-angular-calendars";
import { AdministrativeService } from "../../services/administrative.service";
import * as _ from "lodash";
import { ModuleSetupService } from "./../../services/moduleSetup.service";
import { GridComponent, ToolbarItems } from "@syncfusion/ej2-angular-grids";
import {
  Tab,
  TabComponent,
  SelectingEventArgs,
  SelectEventArgs,
} from "@syncfusion/ej2-angular-navigations";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";
import { DatePipe } from "@angular/common";
import { settingsService } from "../../services/settings.service";
import { log } from "console";
import { Month } from "@syncfusion/ej2-angular-schedule";
import { is } from "@amcharts/amcharts4/core";
import { AstMemoryEfficientTransformer } from "@angular/compiler";

declare var $: any;

@Component({
  selector: "app-leave-mgt",
  templateUrl: "./leave-mgt.component.html",
  styleUrls: ["./leave-mgt.component.scss"],
  encapsulation: ViewEncapsulation.None,

})
export class LeaveMgtComponent implements OnInit {
  @ViewChild("tabObj", { static: false }) public tabObj: TabComponent;

  onbehalfApplyLeaveRequestAccess = false;
  onbehalfApplyLeaveRequestName;

  UserRights;
  currentModuleID;
  //access
  applyLeaveRequestAccess = false;
  applyLeaveRequestName;
  applyAttendanceOverwriteAccess = false;
  applyAttendanceOverwriteName;
  applyCarryForwardAccess = false;
  applyCarryForwardName;
  showMapLoader = false;
  showLeavePage = false;
  showNotFound = false;
  applyLeaveApprover1Value;
  applyLeaveApprover1Name;
  applyLeaveApprover2Value;
  applyLeaveApprover2Name;
  AttendanceOverwriteApprover1Value;
  AttendanceOverwriteApprover1Name;
  AttendanceOverwriteApprover2Value;
  AttendanceOverwriteApprover2Name;
  dualApprovalDiv = false;
  noApproverAssigned = false;
  approverAssigned = false;
  dualApprovalDivAO = false;
  approverAssignedAO = false;
  probationperiodRunning = true;
  probationperiodOver = false;
  showMap = false;
  probationperiodOverDate;

  @ViewChild(AgmMap, { static: true })
  @ViewChild("closeBtn", { static: false })
  closeBtn: ElementRef;
  @ViewChild("calndrBtn", { static: false }) calndrBtn: ElementRef;
  @ViewChild("default", { static: false })
  public datepickerObj: DatePickerComponent;
  manageEmpId: any;
  manageEmpName: any;
  manageDate: any;
  leaveForm: FormGroup;
  showerrorMsg: boolean;
  editformSubmitted: any;
  dateRangeForm: FormGroup;
  listEmployeeLeaveHistoryData;
  public dateValue: Date = new Date();
  public today: Date = new Date(new Date().toDateString());
  public options: Select2Options;
  isCalanderDays: boolean;
  public leftDays;
  entitiledLeave: any;
  notAllowedToApplyLeave = true;
  noLvprfAssign = false;

  public invoiceToolbar: ToolbarItems[];

  //absent to leave
  absentToLeaveForm: FormGroup;

  leaveCancelData;
  leaveCanModel = false;
  HolidayCancelData;
  HoliadyModelApproveData;
  HolidayCanModel = false;
  HoliadyModelApprove = false;
  userInfoLocal = JSON.parse(localStorage.getItem("user_info"));

  public value;
  public approvalvalue;
  headerText = [{ text: "Attendance" }, { text: "Absent" }];
  attendanceOverwriteReasonData;
  public deptOptions: Select2Options;
  attendanceReasonValue: any = "";
  attendanceReasonValueTxt: any = "";
  attendanceModifySubmit: boolean;

  attendanceApproveForm: FormGroup;
  attendminStartTime = "05:30 AM";
  attendmaxCurrentTime = "11:30 PM";
  minForEndTime;
  attendShowerrorMsg: boolean;

  public attendanceData: object[];
  public absentData: object[];

  taskApprove: any;
  isApprove: boolean = false;
  approverTaskValue: any = "";
  leaveSetupData: any;
  leaveSetupid: any;
  leaveSpan: any;
  approvalSpan: any;
  employeeLeaves: any;
  leaveId: any;
  editable: boolean;
  leaveStatusData = [];
  employeeData: { id: string; text: string }[];
  empValue: any = "";
  earnedLeaves: number = 0;
  casualLeaves: number = 0;
  leavesEntitled: number = 0;
  earnedTimeOff: number = 0;
  sickTimeOff: number = 0;
  empjoinedDate: string;
  showLeaveInfo: boolean = false;
  used_leaves: number = 0;
  availableLeaves: number = 0;
  earned_used_leaves: number = 0;
  sick_used_leaves: number = 0;
  earned_remaining: number = 0;
  sick_remaining: number = 0;
  openbalancedays: Number = 0;
  approvedLeaves: any[];
  showLeaveLogSpinner: boolean = true;
  leaveHistory: Object[];
  toolbar: string[];
  showLeavesSpin: boolean = true;
  upcomingLeaves: any[];
  pastLeaves: any[];
  adjustedBalance: any;
  leavesAdjusted: number;
  leaveCountData: any = [];
  annualApprovedLeaves: any[];
  sickApprovedLeaves: any[];
  selectedLeaveType: string = 'all'; // Default selection


  assignedLeavesDataLength;
  assignedLeavesData: any;

  assignedLeavesToEmpData: any;
  otherAssignedLeavesToEmpData: any;
  employeeLeaveHistory = [];

  checkinForm: FormGroup;
  officeInput: boolean = false;
  selecteOptionValue: any;
  selectedOfficeId: any;
  selectedentitiyLoc: any;
  checkOptionValue: boolean;
  officeData: any;
  xpandStatus: boolean;
  selectedValue: any;
  homeInput: boolean;
  currlatitude: any;
  currlongitude: any;
  address: any;
  formatted_address: any;
  zoom: number;

  street_number: any;
  route: any;
  locality: any;
  administrative_area_level_1: any;
  administrative_area_level_2: any;
  postal_code: any;
  country: any;
  selectedModifiedGroupVal: string;
  reasonData: { id: string; text: string }[];
  approvalValue: any;
  reasonValue: any;
  reasonValueTxt: any;
  approvalValue1: any;
  sameApprover: boolean;
  approvalValue2: any;
  isDual: boolean;
  @ViewChild("modifyCloseBtn", { static: false }) modifyCloseBtn: ElementRef;
  isLeavDual: boolean;
  leaveApprovalValue1: string;
  leaveApprovalValue2: string;
  leavApprovalValue: any;
  sameLeavApprover: boolean;
  OrgId: string;
  startEqualEnd: boolean;
  minStartTime = "08:00 AM";
  maxCurrentTime = "08:00 PM";
  //absent
  attendanceSelectedData;
  absentSelectedData;
  latitude: number;
  longitude: number;
  absentToPresentForm: FormGroup;
  absentReasonValue: any;
  absentReasonValueTxt: any;
  absentShowerrorMsg: boolean;
  absentMinStartTime = "08:00 AM";
  absentMaxCurrentTime = "08:00 PM";
  absentSameApprover: boolean = false;
  absentleaveSetupid: any;
  absent_used_leaves: number = 0;
  absentEmpjoinedDate: string;
  absentSickTimeOff: number = 0;
  absentLeavesEntitled: number = 0;
  absentEarnedTimeOff: number = 0;
  absentAvailableLeaves: number = 0;
  absentAdjustedBalance: number = 0;
  absentShowLeaveInfo: boolean;
  absentEmpValue: any;
  absentAnnualApprovedLeaves: any[];
  absentSickApprovedLeaves: any[];
  absentSameLeavApprover: Boolean;
  absentLeaveStatusData: any;
  public absent_formatted_address;
  leaveToAbsentDate: any;
  mapData = {
    checkinLat: 0,
    checkinLong: 0,
    checkoutLat: 0,
    checkoutLong: 0,
    radius: 0,
    zoom: 0,
    checkinTitle: "",
    checkoutTitle: "",
    distanceBtw: "",
    rangeExceed: false,
    forcecheckoutreson: "",
    workLocation: "",
  };

  selectedLeaveSetup = [];

  selectedLeaveId;
  selectedLeaveName;
  selEntldDays;
  availDays;
  leavePaidUnpaid;

  userIsAdmin = false;
  employeeName = "";

  //tab for history
  requestHeaderText = [];
  commonFilterValue = [
    {
      id: "All",
      text: "All",
    },
    {
      id: "Pending",
      text: "Pending",
    },
    {
      id: "Approved",
      text: "Approved",
    },
    {
      id: "Declined",
      text: "Declined",
    },
  ];
  commonPlaceholder = "Select a Filter";
  commonSelectedValue = "All";

  //leave request
  appDisapproveLeaveRequestsAccess = false;
  showLeaveFilter = true;

  //carry forward
  carryForwardData;
  @ViewChild("carryForwardTableGrid", { static: false })
  carryForwardTableGrid: GridComponent;
  selectedCarryForwardData;
  approverAssignedCF = false;
  dualApprovalDivCF = false;
  carryForwardApprover1Value;
  carryForwardApprover1Name;
  carryForwardApprover2Value;
  carryForwardApprover2Name;
  public carryForwardTableGridToolItems: ToolbarItems[];
  applyCarryForwardProcessForm: FormGroup;
  selectedCarryForwardUserData;
  userCarryForwardApplyDiv = false;
  carryForwardEnCash = false;
  carryForwardBalance = 0;
  balanceZeroError = false;
  listEmployeeCarryForHistoryData;
  radius: 300;
  //holidays
  allowPostingholidaysRequestsAccess = false;
  allowPostingholidaysRequestName;
  listHolidayHistoryData;
  approverAssignedHO = false;
  selfApproverAssignedHO = false;
  dualApprovalDivHO = false;
  holidayApprover1Value;
  holidayApprover1Name;
  holidayApprover2Value;
  holidayApprover2Name;
  holidayProcessForm: FormGroup;
  approveDisapproveholidaysAccess = false;

  //owerwrite
  appDisAttOverRequestsAccess = false;
  appDisAttOverHistoryData;
  aoMonthStart: Date = new Date(2023, 0, 1);
  aoMonthEnd: Date = this.today;
  StartDateAO = this.aoMonthStart;
  endDateAO = this.aoMonthEnd;

  //forceCheckInCheckout
  appFrcChkinRequestsAccess = false;
  appFrcAttOverHistoryData: any;
  // aoMonthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
  // aoMonthEnd: Date = this.today;
  // StartDateAO = this.aoMonthStart;
  // endDateAO = this.aoMonthEnd;

  //noticiaction
  originalViewEditNotificationModelData;
  showButtonDiv = false;
  isApprov2View = false;
  viewEditNotificationModelData;
  applyLeaveModel = false;
  applyOverwriteModel = false;
  leaveProfileModel = false;
  carryForwardModel = false;
  HoliadyModel = false;
  showleavestatus = false;

  //noticiaction leave Approver
  isApproverTwo: boolean;

  //leave approve var
  leaveData;
  showOwnerMessage = false;
  showLeaveFunBtn = false;

  applyFrcChkInModel = false;
  frcckinModalData;
  tooltipHtml: string

  public currentYear: number = this.today.getFullYear();
  public currentMonth: number = this.today.getMonth();
  public minDate: Object = new Date(this.currentYear, this.currentMonth, 15);
  public maxDate: Object = new Date(
    this.currentYear,
    this.currentMonth + 5,
    15
  );
  EnddateFRC: any;
  StartDateFRC: any;
  datafilter: any;
  filterhistory: any;
  pendingleaveapp: number;
  remaingpending: number;
  sickleaveassigneddata: any;
  leaveSummary: any[];
  totalsepLeaveDays: number;
  leavesHistory: { leave_name: string; total_days: number }[] = [];
  leavebackup: any[];
  totalLeaveDayses: any;
  datecalculator: any;
  notifymodal: boolean;
  sickleavcal: any[];
  sickleaveduration: any[];
  sickLeaveDetails: any;
  sickLeaveProfileDetails: any;
  useAlternativeLogic: boolean;
  lastsickDuration: any;
  test: any;
  approvalbutton: any;
  notnotification: boolean;
  overwritemodaldata: any;
  eligibleannualleave: string;
  annualLeaveProfileDetails: any;

  onRenderCell(args: RenderDayCellEventArgs): void {
    if (this.selectedLeaveSetup == null) {
      return;
    }

    if (this.selectedLeaveSetup[0].is_calendar_days == false) {
      if (args.date.getDay() == 5) {
        //sets isDisabled to true to disable the date.
        args.isDisabled = true;
        //To know about the disabled date customization, you can refer in "styles.css".
      }
    }
  }

  //common for attendance, absent and hr
  commonDateRangeForm: FormGroup;
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

  getHeaderValue = "Attendance";
  startDateSend = moment().format("L");
  endDateSend = moment().format("L");

  //attendance
  attendanceOverwriteReasonIDYesNO = false;
  attendanceReasonOtherValue = false;

  public absentDataCloud: object[];

  constructor(
    public ModuleSetupService: ModuleSetupService,
    private admService: AdministrativeService,
    private empService: EmployeeService,
    private mapsAPILoader: MapsAPILoader,
    private spinner: NgxSpinnerService,
    private leaveService: LeaveService,
    private toastr: ToastrService,
    private orgService: OrganizationService,
    private userService: UserService,
    private timesheetService: TimeSheetService,
    private formBuilder: FormBuilder,
    public AdminSettingService: AdminSettingService,
    private settingsService: settingsService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {
    this.options = {
      placeholder: { id: "", text: "Select" },
      width: "100%",
    };

    this.deptOptions = {
      placeholder: { id: "  ", text: "Select" },
      allowClear: true,
      width: "100%",
    };
  }

  public async addLeave() {
    try {
      this.spinner.show();

      this.getAllEmployee();
      this.GetLeaveRoleModuleApproverByRoleIDandModuleID();
      await this.checkIfHalfDayRequestIsValid();
      this.leavesEntitled = this.earnedLeaves;

      if (this.selectedLeaveSetup.length <= 0) {
        let user_info = JSON.parse(localStorage.getItem("user_info"));
        if (user_info["is_admin"] !== true) {
          this.empValue = user_info["id"];
          let obj = {
            value: this.empValue,
          };
          await this.changedEmp(obj);
        }


      }
      $("#leave_modal").modal("show");
    } catch (error) {
      console.error("Error in addLeave:", error);
    } finally {
      this.spinner.hide();
    }
  }


  is_leave_apply_self_approve = false;
  public GetLeaveRoleModuleApproverByRoleIDandModuleID() {
    let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      roleID: userDataLocal.role_id,
      moduleID: this.currentModuleID,
    };
    this.dualApprovalDiv = false;
    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(postData).subscribe((data: any) => {
      console.log('Approver Data', data)
      data.map((elm) => {
        if (elm.section_name === this.applyLeaveRequestName) {

          if (elm.approver1_roleId !== null) {
            this.noApproverAssigned = false;
            this.approverAssigned = true;
            this.applyLeaveApprover1Value = elm.approver1_roleId;
            this.applyLeaveApprover1Name = elm.approver1_role_name
            if (elm.approver2_roleId !== null) {
              this.dualApprovalDiv = true
              this.applyLeaveApprover2Value = elm.approver2_roleId;
              this.applyLeaveApprover2Name = elm.approver2_role_name
            }
          } else {
            if (elm.is_full_access) {
              this.noApproverAssigned = false;
              this.approverAssigned = true;
              this.is_leave_apply_self_approve = true;
            } else {
              this.noApproverAssigned = true;
              this.approverAssigned = false;
            }
          }
        } else if (elm.section_name === this.applyAttendanceOverwriteName) {
          if (elm.approver1_roleId !== null) {
            this.approverAssignedAO = true;
            this.AttendanceOverwriteApprover1Value = elm.approver1_roleId;
            this.AttendanceOverwriteApprover1Name = elm.approver1_role_name;
            if (elm.approver2_roleId !== null) {
              this.dualApprovalDivAO = true;
              this.AttendanceOverwriteApprover2Value = elm.approver2_roleId;
              this.AttendanceOverwriteApprover2Name = elm.approver2_role_name
            }
          } else {
            this.approverAssignedAO = false;
          }
        }
      });
    }, error => {
      Swal.fire(
        'Error!',
        error,
        'error'
      )
    });
  }

  changedTaskApprover(e) {
    this.approverTaskValue = e.value;
  }
  public OnLeaveClose() {
    this.isExeptionalLeave = false;
    this.selectedLeaveSetup = [];
    this.selectedLeaveId = "";
    this.selectedLeaveName = "";
    this.selEntldDays = "";
    this.availDays = "";
    this.leavePaidUnpaid = "";
    //this.empValue = '';
    this.employeeData = [];
    $("#leave_modal").modal("hide");
    this.closeBtn.nativeElement.click();
    this.dateRangeForm.reset();
    this.leaveForm.reset();
    this.editable = false;
    this.notAllowedToApplyLeave = true;
    this.leaveSpan = "";
  }

  public openCalendarModal() {
    // $('#addLeave').show();
    $("#calendar_modal").modal("show");
  }

  //intray Function
  intraypending() {
    this.spinner.show();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let role_intray_roleid = user_info.role_id;
    let postData = {
      orgID:
        user_info.org_id !== null
          ? user_info.org_id
          : localStorage.getItem("org_id"),
      empID: user_info.role_id,
    };
    try {
      this.leaveService.GetLeaveRqstbyEmpId(postData).subscribe((data: any) => {
        if (data.status === 5) {
          this.listEmployeeLeaveHistoryData = [];
        } else {
          this.listEmployeeLeaveHistoryData = [];
          data.map((elm) => {
            if (elm.leave_status === "pending") {
              if (
                elm.approver1_roleId == role_intray_roleid &&
                elm.is_approved_empId1 == false
              ) {
                this.listEmployeeLeaveHistoryData.push(elm);
                // this.spinner.hide();
              } else if (
                elm.approver2_roleId == role_intray_roleid &&
                elm.is_approved_empId2 == false &&
                elm.is_approved_empId1 == true
              ) {
                this.listEmployeeLeaveHistoryData.push(elm);
                // this.spinner.hide();
              }
              // else{
              //   this.listEmployeeLeaveHistoryData=[];
              // }
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }
  }

  //leave req
  selfRequestHistory(getTxt) {
    console.log(getTxt);
    if (getTxt === "All") {
      this.showLeaveFilter = true;
      this.GetLeaveRqstbyEmpId();
    } else if (getTxt === "Pending") {
      console.log(getTxt);
      let user_info = JSON.parse(localStorage.getItem("user_info"));
      let postData = {
        orgID:
          user_info.org_id !== null
            ? user_info.org_id
            : localStorage.getItem("org_id"),
        empID: user_info.role_id,
      };

      this.leaveService.GetLeaveRqstbyEmpId(postData).subscribe((data: any) => {
        console.log(data);
        this.listEmployeeLeaveHistoryData = [];
        if (data.status === 5) {
          this.listEmployeeLeaveHistoryData = [];
        } else {
          data.map((elm) => {
            if (elm.leave_status === "pending") {
              this.listEmployeeLeaveHistoryData.push(elm);
            }
          });
        }
      });
    } else if (getTxt === "Declined") {
      this.showLeaveFilter = true;
    } else {
      this.showLeaveFilter = false;
      this.listEmployeeLeaveHistory();
    }
  }

  //get self request hist
  GetLeaveRqstbyEmpId() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      orgID:
        user_info.org_id !== null
          ? user_info.org_id
          : localStorage.getItem("org_id"),
      empID: user_info.role_id,
    };
    this.leaveService.GetLeaveRqstbyEmpId(postData).subscribe((data: any) => {
      if (data.status === 5) {
        this.listEmployeeLeaveHistoryData = [];
      } else {
        this.listEmployeeLeaveHistoryData = data;
      }
    });
  }
  //Date Filter for Force Checkin

  GetFRCdatefilter(StartDateFRC, EnddateFRC) {
    this.spinner.show();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      orgID:
        user_info.org_id !== null
          ? user_info.org_id
          : localStorage.getItem("org_id"),
      fromDate: moment(StartDateFRC).format("L"),
      toDate: moment(EnddateFRC).format("L"),
    };
    console.log(postData);
    this.timesheetService
      .GetForceCheckinRequestByOrgId(postData)
      .subscribe((data: any) => {
        console.log("Data", data);
        console.log("Value", this.datafilter);

        var results = [];

        data.map((el) => {
          //  el.createdDate = moment(el.createdDate).format('L');
          // el.ondate = moment(el.ondate).format('L');

          // console.log("el-->",el);

          if (el.reason_name === "Location Failureface Recogonisation Issue") {
            el["desc"] = "Location Issue & Failure in Face Recognition";
          } else if (el.reason_name === "undefinedface Recogonisation Issue") {
            el["desc"] = "Failure in Face Recognition";
          } else {
            el["desc"] = el.reason_name;
          }

          results.push(el);
        });

        if (data.status === 5) {
          this.appFrcAttOverHistoryData = [];
        } else {
          this.appFrcAttOverHistoryData = data;
        }
        this.spinner.hide();
      });
  }

  //get ForceCheckIn/Checkout Request
  GetFrcOverwritebyEmpId() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      orgID: localStorage.getItem("org_id"),
      fromDate: moment(this.aoMonthStart).format("L"),
      toDate: moment(this.aoMonthEnd).format("L"),
    };
    console.log("SafeDAt", postData);
    this.timesheetService
      .GetForceCheckinRequestByOrgId(postData)
      .subscribe((data: any) => {
        console.log("data--->", data);
        if (data.length > 0) {
          var results = [];

          data.map((el) => {
            el.createdDate = moment(el.createdDate).format("L");
            // el.ondate = moment(el.ondate).format('L');

            // console.log("el-->",el);

            if (
              el.reason_name === "Location Failureface Recogonisation Issue"
            ) {
              el["desc"] = "Location Issue & Failure in Face Recognition";
            } else if (
              el.reason_name === "undefinedface Recogonisation Issue"
            ) {
              el["desc"] = "Failure in Face Recognition";
            } else {
              el["desc"] = el.reason_name;
            }

            results.push(el);
          });

          this.appFrcAttOverHistoryData = results;
        } else {
          this.appFrcAttOverHistoryData = [];
        }
      });
  }

  //get approval request history
  listEmployeeLeaveHistory() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    if (user_info.is_superadmin === true) {
      this.leaveService
        .GetLeaveRequestedHistoryByOrgIDandOnbehalfEmpID(user_info.id)
        .subscribe((data) => {
          this.listEmployeeLeaveHistoryData = data;
        });
    } else {
      this.leaveService
        .GetLeaveRequestedHistoryByOrgIDandEmpID(user_info.id)
        .subscribe((data) => {
          this.listEmployeeLeaveHistoryData = data;
        });
    }
  }

  changeleaveFilter(event) {
    this.filterhistory = event;
    console.log(this.filterhistory);

    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      orgID:
        user_info.org_id !== null
          ? user_info.org_id
          : localStorage.getItem("org_id"),
      empID: user_info.role_id,
    };

    this.leaveService.GetLeaveRqstbyEmpId(postData).subscribe((data: any) => {
      console.log(data);
      this.listEmployeeLeaveHistoryData = [];
      console.log(event.itemData.text);
      if (data.status === 5) {
        this.listEmployeeLeaveHistoryData = [];
      } else {
        if (event.itemData.text === "All") {
          this.listEmployeeLeaveHistoryData = data;
        } else if (event.itemData.text === "Approved") {
          data.map((elm) => {
            if (elm.leave_status === "approved") {
              this.listEmployeeLeaveHistoryData.push(elm);
            }
          });
        } else if (event.itemData.text === "Pending") {
          data.map((elm) => {
            if (elm.leave_status === "pending") {
              this.listEmployeeLeaveHistoryData.push(elm);
            }
          });
        } else if (event.itemData.text === "Declined") {
          data.map((elm) => {
            if (elm.leave_status === "declined") {
              this.listEmployeeLeaveHistoryData.push(elm);
            }
          });
        }
      }
    });
  }

  //request tab switch
  requesHistoryTab(event) {
    if (event.selectedItem.outerText === "Leave") {
      if (this.appDisapproveLeaveRequestsAccess === true) {
        this.GetLeaveRqstbyEmpId();
      } else {
        this.listEmployeeLeaveHistory();
      }
    } else if (event.selectedItem.outerText === "Carry Forward") {
      this.GetCryFrwdRqstbyEmpId();
    } else if (event.selectedItem.outerText === "Holidays") {
      if (this.approveDisapproveholidaysAccess === true) {
        this.GetPublicHolidaysCreatedbyApproverId();
      } else {
        if (this.allowPostingholidaysRequestsAccess === true) {
          this.GetPublicHolidaysCreatedbyOrgId();
        }
      }
    } else if (event.selectedItem.outerText === "Attendance Override") {
      this.getAttendanceOverRequestHist(this.aoMonthStart, this.aoMonthEnd);
    } else if (event.selectedItem.outerText === "Force CheckIn/Checkout") {
      this.GetFrcOverwritebyEmpId();
    }
  }

  //attendance overwrite

  getAttendanceOverRequestHist(startDate, endDate) {
    this.spinner.show();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      org_id:
        user_info.org_id !== null
          ? user_info.org_id
          : localStorage.getItem("org_id"),
      emp_id: user_info.id,
      from_date: moment(startDate).format("L"),
      to_date: moment(endDate).format("L"),
    };
    console.log(postData);
    this.leaveService
      .FetchEmployeeOvrwriteApproverId(postData)
      .subscribe((data: any) => {
        console.log("Data", data);
        if (data.status === 5) {
          this.appDisAttOverHistoryData = [];
        } else {
          this.appDisAttOverHistoryData = data;
        }
        this.spinner.hide();
      });
  }

  changeDateAO(event) {
    console.log(event);
    this.StartDateAO = event.value[0];
    this.endDateAO = event.value[1];
    this.getAttendanceOverRequestHist(event.value[0], event.value[1]);
  }

  changeleaveFilterAO(event) {
    this.spinner.show();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      org_id:
        user_info.org_id !== null
          ? user_info.org_id
          : localStorage.getItem("org_id"),
      emp_id: user_info.id,
      from_date: moment(this.StartDateAO).format("L"),
      to_date: moment(this.endDateAO).format("L"),
    };
    this.leaveService
      .FetchEmployeeOvrwriteApproverId(postData)
      .subscribe((data: any) => {
        this.appDisAttOverHistoryData = [];

        if (data.status === 5) {
          this.appDisAttOverHistoryData = [];
        } else {
          if (event.itemData.text === "All") {
            this.appDisAttOverHistoryData = data;
          } else if (event.itemData.text === "Approved") {
            data.map((elm) => {
              if (elm.leave_status === "Checkin Approved") {
                this.appDisAttOverHistoryData.push(elm);
              }
            });
          } else if (event.itemData.text === "Pending") {
            data.map((elm) => {
              if (elm.leave_status === "Overwrite Request Pending") {
                this.appDisAttOverHistoryData.push(elm);
              }
            });
          } else if (event.itemData.text === "Decline") {
            data.map((elm) => {
              if (elm.leave_status === "Checkin Declined") {
                this.appDisAttOverHistoryData.push(elm);
              }
            });
          }
        }
        this.spinner.hide();
      });
  }
  //attendance overwrite

  //Force Checkin Date Filter

  changeDateFRC(event) {
    console.log(event);

    this.StartDateFRC = event.value[0];
    this.EnddateFRC = event.value[1];
    this.GetFRCdatefilter(event.value[0], event.value[1]);
  }

  //Data Filter in the Force Check In

  changedatafilterFRC(event) {
    console.log("Events", event);
    this.datafilter = event.value;
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      orgID: localStorage.getItem("org_id"),
      fromDate: moment(this.aoMonthStart).format("L"),
      toDate: moment(this.aoMonthEnd).format("L"),
    };
    console.log("SafeDAt", postData);
    this.timesheetService
      .GetForceCheckinRequestByOrgId(postData)
      .subscribe((data: any) => {
        console.log("data--->", data.status);

        this.appFrcAttOverHistoryData = [];
        var results = [];

        data.map((el) => {
          //  el.createdDate = moment(el.createdDate).format('L');
          // el.ondate = moment(el.ondate).format('L');

          // console.log("el-->",el);

          if (el.reason_name === "Location Failureface Recogonisation Issue") {
            el["desc"] = "Location Issue & Failure in Face Recognition";
          } else if (el.reason_name === "undefinedface Recogonisation Issue") {
            el["desc"] = "Failure in Face Recognition";
          } else {
            el["desc"] = el.reason_name;
          }

          results.push(el);
        });

        if (data.status === 5) {
          this.appDisAttOverHistoryData = [];
        } else {
          if (event.itemData.text === "All") {
            this.appFrcAttOverHistoryData = data;
          } else if (event.itemData.text === "Approved") {
            data.map((elm) => {
              if (elm.status === "approved") {
                this.appFrcAttOverHistoryData.push(elm);
              }
            });
          } else if (event.itemData.text === "Pending") {
            data.map((elm) => {
              if (elm.status === "pending") {
                this.appFrcAttOverHistoryData.push(elm);
              }
            });
          } else if (event.itemData.text === "Decline") {
            data.map((elm) => {
              if (elm.status === "declined") {
                this.appFrcAttOverHistoryData.push(elm);
              }
            });
          }
        }
      });
  }
  //holidays
  GetPublicHolidaysCreatedbyOrgId() {
    this.spinner.show();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      orgID:
        user_info.org_id !== null
          ? user_info.org_id
          : localStorage.getItem("org_id"),
    };
    this.leaveService
      .GetPublicHolidaysCreatedbyOrgId(postData)
      .subscribe((data: any) => {
        if (data.status === 5) {
          this.listHolidayHistoryData = [];
        } else {
          this.listHolidayHistoryData = data;
        }
        this.spinner.hide();
      });
  }

  GetPublicHolidaysCreatedbyApproverId() {
    this.spinner.show();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      orgID:
        user_info.org_id !== null
          ? user_info.org_id
          : localStorage.getItem("org_id"),
      empID: user_info.role_id,
    };
    this.leaveService
      .GetPublicHolidaysCreatedbyApproverId(postData)
      .subscribe((data: any) => {
        if (data.status === 5) {
          this.listHolidayHistoryData = [];
        } else {
          this.listHolidayHistoryData = data;
        }
        this.spinner.hide();
      });
  }

  changeleaveFilterHO(event) {
    this.spinner.show();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    if (this.approveDisapproveholidaysAccess === true) {
      let postData = {
        orgID:
          user_info.org_id !== null
            ? user_info.org_id
            : localStorage.getItem("org_id"),
        empID: user_info.role_id,
      };
      this.leaveService
        .GetPublicHolidaysCreatedbyApproverId(postData)
        .subscribe((data: any) => {
          this.listHolidayHistoryData = [];
          if (data.status === 5) {
            this.listHolidayHistoryData = [];
          } else {
            if (event.itemData.text === "All") {
              this.listHolidayHistoryData = data;
            } else if (event.itemData.text === "Approved") {
              data.map((elm) => {
                if (elm.status === "approved") {
                  this.listHolidayHistoryData.push(elm);
                }
              });
            } else if (event.itemData.text === "Pending") {
              data.map((elm) => {
                if (elm.status === "pending") {
                  this.listHolidayHistoryData.push(elm);
                }
              });
            } else if (event.itemData.text === "Decline") {
              data.map((elm) => {
                if (elm.status === "decline") {
                  this.listHolidayHistoryData.push(elm);
                }
              });
            }
          }
          this.spinner.hide();
        });
    } else {
      if (this.allowPostingholidaysRequestsAccess === true) {
        let postData2 = {
          orgID:
            user_info.org_id !== null
              ? user_info.org_id
              : localStorage.getItem("org_id"),
        };
        this.leaveService
          .GetPublicHolidaysCreatedbyOrgId(postData2)
          .subscribe((data: any) => {
            this.listHolidayHistoryData = [];
            if (data.status === 5) {
              this.listHolidayHistoryData = [];
            } else {
              if (event.itemData.text === "All") {
                this.listHolidayHistoryData = data;
              } else if (event.itemData.text === "Approved") {
                data.map((elm) => {
                  if (elm.status === "approved") {
                    this.listHolidayHistoryData.push(elm);
                  }
                });
              } else if (event.itemData.text === "Pending") {
                data.map((elm) => {
                  if (elm.status === "pending") {
                    this.listHolidayHistoryData.push(elm);
                  }
                });
              } else if (event.itemData.text === "Decline") {
                data.map((elm) => {
                  if (elm.status === "decline") {
                    this.listHolidayHistoryData.push(elm);
                  }
                });
              }
            }
            this.spinner.hide();
          });
      }
    }
  }

  holidayModelOpen() {
    $("#holiday_modal").modal("show");
    this.holidayProcessFormInputs();
    this.GetLeaveRoleModuleApproverByRoleIDandModuleidHO();
  }

  GetLeaveRoleModuleApproverByRoleIDandModuleidHO() {
    let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      roleID: userDataLocal.role_id,
      moduleID: this.currentModuleID,
    };
    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe(
      (data: any) => {
        console.log(
          "Approver Data Justinnnn ->",
          data,
          this.allowPostingholidaysRequestName
        );
        data.map((elm) => {
          if (elm.section_name === this.allowPostingholidaysRequestName) {
            if (elm.approver1_roleId !== null) {
              this.approverAssignedHO = true;
              this.holidayApprover1Value = elm.approver1_roleId;
              this.holidayApprover1Name = elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.dualApprovalDivHO = true;
                this.holidayApprover2Value = elm.approver2_roleId;
                this.holidayApprover2Name = elm.approver2_role_name;
              }
            } else if (elm.is_full_access) {
              this.selfApproverAssignedHO = true;
              this.holidayApprover1Value = elm.role_id;
            } else {
              this.approverAssignedHO = false;
            }
          }
        });
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );
  }

  holidayProcessFormInputs() {
    this.holidayProcessForm = this.formBuilder.group({
      holidayName: [""],
      description: [""],
      dateRange: [""],
    });
  }

  submitHolidayValue() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let formValue = this.holidayProcessForm.value;
    let startDate = moment(formValue.dateRange[0]).format(
      "YYYY-MM-DD HH:mm:ss.SSS"
    );
    let endDate = moment(formValue.dateRange[1]).format(
      "YYYY-MM-DD HH:mm:ss.SSS"
    );
    let postValue = {
      org_id: user_info.org_id,
      start_date: startDate,
      end_date: endDate,
      description: formValue.description,
      holiday_name: formValue.holidayName,
      holiday_type: null,
      status: "pending",
      approver1_roleId: this.holidayApprover1Value,
      approver2_roleId:
        this.dualApprovalDivHO === true ? this.holidayApprover2Value : null,
      created_date: moment().format("L"),
      created_by_empId: user_info.id,
      modified_date: moment().format("L"),
      modified_by_empId: user_info.id,
    };
    console.log(postValue);
    this.leaveService.AddPublicHolidays(postValue).subscribe((elm: any) => {
      //console.log(elm)
      if (elm.status === "200") {
        this.toastr.success(elm.desc);
      } else {
        this.toastr.error("Something went wrong");
      }
      this.holidayModelClose();
    });
  }

  holidayModelClose() {
    $("#holiday_modal").modal("hide");
    this.GetPublicHolidaysCreatedbyApproverId();
    this.holidayProcessForm.reset();
    this.selfApproverAssignedHO = false;
  }

  //carry forward function
  GetCryFrwdRqstbyEmpId() {
    this.spinner.show();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      orgID:
        user_info.org_id !== null
          ? user_info.org_id
          : localStorage.getItem("org_id"),
      empID: user_info.id,
    };
    this.leaveService.GetCryFrwdRqstbyEmpId(postData).subscribe((data: any) => {
      console.log(data);
      if (data.status === 5) {
        this.listEmployeeCarryForHistoryData = [];
      } else {
        this.listEmployeeCarryForHistoryData = data;
      }
      this.spinner.hide();
    });
  }

  changeleaveFilterCF(event) {
    this.spinner.show();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      orgID:
        user_info.org_id !== null
          ? user_info.org_id
          : localStorage.getItem("org_id"),
      empID: user_info.id,
    };
    this.leaveService.GetCryFrwdRqstbyEmpId(postData).subscribe((data: any) => {
      this.listEmployeeCarryForHistoryData = [];
      if (data.status === 5) {
        this.listEmployeeCarryForHistoryData = [];
      } else {
        if (event.itemData.text === "All") {
          this.listEmployeeCarryForHistoryData = data;
        } else if (event.itemData.text === "Approved") {
          data.map((elm) => {
            if (elm.carry_forward_status === "approved") {
              this.listEmployeeCarryForHistoryData.push(elm);
            }
          });
        } else if (event.itemData.text === "Pending") {
          data.map((elm) => {
            if (elm.carry_forward_status === "pending") {
              this.listEmployeeCarryForHistoryData.push(elm);
            }
          });
        } else if (event.itemData.text === "Decline") {
          data.map((elm) => {
            if (elm.carry_forward_status === "decline") {
              this.listEmployeeCarryForHistoryData.push(elm);
            }
          });
        }
      }
      this.spinner.hide();
    });
  }

  carryForwardModelOpen() {
    this.spinner.show();
    this.GetLeaveRoleModuleApproverByRoleIDandModuleidCF();
    $("#carry_forward_modal").modal("show");
    let postData = {
      orgID: localStorage.getItem("org_id"),
    };
    this.leaveService
      .GetCarryForwardToApprovebyOrgId(postData)
      .subscribe((data: any) => {
        if (data.length === 0) {
          this.leaveService
            .UpdateLeaveAvailableCarryForward(postData)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.carryForwardModelOpen();
              }
            });
        } else {
          this.carryForwardData = data;
          this.spinner.hide();
        }
      });
  }

  carryForwardTableGridSearch(): void {
    document
      .getElementById(this.carryForwardTableGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.carryForwardTableGrid.search(
          (event.target as HTMLInputElement).value
        );
      });
  }

  GetLeaveRoleModuleApproverByRoleIDandModuleidCF() {
    let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      roleID: userDataLocal.role_id,
      moduleID: this.currentModuleID,
    };
    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe(
      (data: any) => {
        console.log("Approver Data ->", data, this.applyCarryForwardName);
        data.map((elm) => {
          if (elm.section_name === this.applyCarryForwardName) {
            if (elm.approver1_roleId !== null) {
              this.approverAssignedCF = true;
              this.carryForwardApprover1Value = elm.approver1_roleId;
              this.carryForwardApprover1Name = elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.dualApprovalDivCF = true;
                this.carryForwardApprover2Value = elm.approver2_roleId;
                this.carryForwardApprover2Name = elm.approver2_role_name;
              }
            } else {
              this.approverAssignedCF = false;
            }
          }
        });
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );
  }

  applyCarryForwardProcess(data) {
    console.log(data);
    this.applyCarryForwardProcessFormInputs();
    this.userCarryForwardApplyDiv = true;
    this.selectedCarryForwardUserData = data;
    this.applyCarryForwardProcessForm.patchValue({
      carryForwardDays: Number(data.carry_forward_to_approve),
    });

    this.applyCarryForwardProcessForm.valueChanges.subscribe((value) => {
      //console.log(value)
      this.carryForwardBalance =
        Number(this.selectedCarryForwardUserData.carry_forward_to_approve) -
        (Number(value.carryForwardDays) +
          Number(value.enCashDays) +
          Number(value.cancelDays) +
          Number(value.onHoldDays));
      if (this.carryForwardBalance === 0) {
        this.balanceZeroError = false;
      } else {
        this.balanceZeroError = true;
      }
      if (
        value.carryForwardDays >
        Number(this.selectedCarryForwardUserData.carry_forward_to_approve)
      ) {
        this.applyCarryForwardProcessForm.patchValue({
          carryForwardDays: Number(
            this.selectedCarryForwardUserData.carry_forward_to_approve
          ),
        });
        this.carryForwardEnCash = false;
      } else {
        this.carryForwardEnCash = true;
      }

      if (value.carryForwardDays === null) {
        this.carryForwardEnCash = false;
      }

      if (
        value.carryForwardDays ===
        Number(this.selectedCarryForwardUserData.carry_forward_to_approve)
      ) {
        this.carryForwardEnCash = false;
      }
    });
  }

  applyCarryForwardProcessFormInputs() {
    this.applyCarryForwardProcessForm = this.formBuilder.group({
      carryForwardDays: [""],
      enCashDays: [""],
      cancelDays: [""],
      onHoldDays: [""],
    });
  }

  applyForFinalCarryForward() {
    this.spinner.show();
    let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
    let carryForwardFormData = this.applyCarryForwardProcessForm.value;
    let postData = {
      org_id: this.selectedCarryForwardUserData.org_id,
      emp_id: this.selectedCarryForwardUserData.emp_id,
      leave_profile_setup_id:
        this.selectedCarryForwardUserData.leave_profile_setup_id,
      leave_available_employee_id: this.selectedCarryForwardUserData.id,
      profile_carry_forward_days:
        this.selectedCarryForwardUserData.profile_carry_forward_days,
      carry_forward_days: carryForwardFormData.cancelDays,
      carry_forward_to_approve: carryForwardFormData.carryForwardDays,
      carry_forward_approved_days: "0",
      onbehalf_applied: carryForwardFormData.onHoldDays,
      ondate_applied: moment().format("L"),
      approver1_roleId: this.carryForwardApprover1Value,
      approver2_roleId:
        this.dualApprovalDivCF === true
          ? this.carryForwardApprover2Value
          : null,
      encash_days: carryForwardFormData.enCashDays,
      is_encashed: false,
      is_approved1: false,
      is_approved2: false,
      carry_forward_status: "pending",
      created_date: moment().format("L"),
      created_by: userDataLocal.id,
      modified_by: userDataLocal.id,
    };
    console.log(postData);
    this.leaveService
      .AddCarryForwardRequest(postData)
      .subscribe((data: any) => {
        console.log(data);
        if (data.status === "200") {
          this.toastr.success("Carry Forward Request Applied Successfully");
        } else {
          this.toastr.error("something went wrong");
        }
        let innerTxt = "inner";
        this.carryForwardModelClose(innerTxt);
        this.spinner.hide();
      });
  }

  carryForwardModelClose(textType) {
    if (textType === "inner") {
      this.userCarryForwardApplyDiv = false;
      this.carryForwardEnCash = false;
      this.carryForwardBalance = 0;
      this.applyCarryForwardProcessForm.reset();
    } else {
      $("#carry_forward_modal").modal("hide");
      this.GetCryFrwdRqstbyEmpId();
    }
  }
  //carry forward function

  //fetch employee
  public getAllEmployee() {
    this.empService.getEmployeeByOrgId().subscribe(
      (data: any) => {
        var empresults = [{ id: "", text: "Select" }];
        let user_info = JSON.parse(localStorage.getItem("user_info"));
        this.empValue = user_info["id"];
        for (var i = 0; i < data.length; i++) {
          if (this.empValue == data[i].id && user_info["is_admin"] == true) {
            // console.log('Dont Add In Array');
            empresults.push({
              id: data[i].id,
              text: data[i].full_name,
            });
          } else {
            empresults.push({
              id: data[i].id,
              text: data[i].full_name,
            });
          }
          if (user_info["is_admin"] != true) {
            this.empValue = user_info["id"];
          }
        }
        this.employeeData = empresults;
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );
  }

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
  selectType(value) {
    this.leavePaidUnpaid = value;
    console.log("assigned the value of leave type", this.leavePaidUnpaid);

  }
  calculateTimeDifference(startTime: string, endTime: string,minHour:number): number | boolean {
    function timeToMinutes(time: string): number {
      try {
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {
          hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
          hours = 0;
        }

        return hours * 60 + minutes;
      } catch (error) {
        return -1;
      }
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (startMinutes === -1 || endMinutes === -1) {
      return false;
    }

    let diffMinutes = endMinutes - startMinutes;

    if (diffMinutes < 0) {
      diffMinutes += 24 * 60;
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    const totalHours = hours + minutes / 60;
    return totalHours <= minHour;
  }

  halfDayObj = {};

  async checkIfHalfDayRequestIsValid() {
    let postData = { id: this.empValue };

    let schedule = await this.admService.FindByEmpID(postData).toPromise();
    console.log(schedule, "***")

    const days = ['saturday_exp', 'sunday_exp', 'monday_exp', 'tuesday_exp', 'wednesday_exp', 'thursday_exp', 'friday_exp'];
    let minHour= 5;
    let leaveData=this.selectedLeaveSetup.find((item) => item.leave_name == "Annual leave");
    console.log(leaveData,"LEAVE DATA")
    if(leaveData && leaveData.half_day_min_hours>0){
      minHour=leaveData.half_day_min_hours
    }
    console.log(this.selectedLeaveSetup,"TEST@")
    console.log(minHour,"MIN HOUR")
    days.forEach(day => {
      const timeData = schedule[day];

      if (timeData && timeData !== '') {
        console.log(timeData, "TEST TIMEDATA")
        const values = timeData.split(',');

        if (values.length >= 5) {
          const startTime = values[1].trim();
          const endTime = values[2].trim();

          const isGreaterThanFive = this.calculateTimeDifference(startTime, endTime,minHour);
          this.halfDayObj[day] = isGreaterThanFive;
        } else {
          this.halfDayObj[day] = false;
        }
      } else {
        this.halfDayObj[day] = false;
      }
    });
    console.log(this.halfDayObj, "RESULT****")
    return this.halfDayObj;
  }
  verifyHalfDayRequest(leaveDay) {
    const date = new Date(leaveDay);
    const day = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    return {isValid:this.halfDayObj[day + '_exp'],day:day};

  }

  //apply long leave range function
  applyLeave(reason) {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let leavePeriod = this.dateRangeForm.get("daterangeAtt").value;
    // if (parseInt(this.leaveSpan) > parseInt(this.selEntldDays)) {
    //   this.toastr.error(`Invalid Date Range Selected of ${this.leaveSpan} days`);
    //   return
    // }\
    if (this.leaveSpan < 1) {
      let checkDay = this.verifyHalfDayRequest(leavePeriod[0])
      if (checkDay.isValid){
        this.toastr.error(`Half day request is not allowed for ${checkDay.day}`);
        this.leaveForm.patchValue({Duration:"full"})
        return
      }
    }

    let reqObj = {
      "org_id": localStorage.getItem('org_id'),
      "emp_id": this.empValue,
      "leave_profile_setup_id": this.selectedLeaveId,
      "leave_name": this.isExeptionalLeave ? this.leaveForm.controls['leaveName'].value : this.selectedLeaveName,
      "leave_type": this.leavePaidUnpaid,
      "leave_start_date": moment(leavePeriod[0]).format('L'),
      "leave_end_date": moment(leavePeriod[1]).format('L'),
      "leave_days_applied": this.leaveSpan,
      "ondate_applied": moment().format('L'),
      "emp_notes": this.leaveForm.controls['desc'].value ? this.leaveForm.controls['desc'].value : '',
      "approver1_roleId": this.applyLeaveApprover1Value,
      "approver2_roleId": this.dualApprovalDiv === true ? this.applyLeaveApprover2Value : null,
      "approver1_notes": "",
      "approver2_notes": "",
      "is_approved_empId1": false,
      "is_approved_empId2": false,
      "leave_status": this.is_leave_apply_self_approve ? "approved" : "pending",
      "created_by_empId": user_info['id'],
      "modified_by_empId": user_info['id'],
      "email": this.leaveForm.controls['emailAddress'].value,
      "phone": (this.leaveForm.controls['phoneNumber'].value).toString(),
      "is_local_leave": this.leaveForm.controls['leaveLocation'].value === 'local Leave' ? true : false,
      "doc_url": this.LeaveDocUrl != "" ? this.LeaveDocUrl : null,
      "is_exception": this.isExeptionalLeave
    }


    if (this.empValue != user_info["id"]) {
      reqObj["onbehalf_applied"] = user_info["id"];
    }

    console.log(this.entitiledLeave);

    console.log(this.leaveSpan, "Leave Span");
    console.log(this.leftDays, "Left Days");
    console.log(this.entitiledLeave, "Entitiled Leave");



    this.leaveService.empAddLeaveRequest(reqObj).subscribe((res: any) => {
      console.log('Sharan', res)
      if (res.status === "200") {
        this.toastr.success("Leave Applied Successfully");
        this.OnLeaveClose();
        this.leaveForm.reset();
        this.dateRangeForm.reset();
        this.listEmployeeLeaveHistory();
      } else if (res.code === "201") {
        this.toastr.error(
          "Please Select a different date range because there is a active leave on the selected range"
        );
      } else if (res.is_sandwich) {
        // this.toastr.error(res.message);

        Swal.fire({
          title: "Sandwich Leave detected !",
          text:"Continous leave should be applied from " + res.newLeaveStartDate.split(" ")[0] + " to " + res.newLeaveEndDate.split(" ")[0],
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "error",
        }).then((result) => {
          if (result.value === true) {
            this.dateRangeForm.patchValue({
              daterangeAtt: [
                new Date(res.newLeaveStartDate),
                new Date(res.newLeaveEndDate),
              ],
            });
          }
        });

      } else {
        this.toastr.error("Something Went Wrong");
        this.OnLeaveClose();
        this.leaveForm.reset();
        this.dateRangeForm.reset();
        this.listEmployeeLeaveHistory();
      }
    });
  }

  changedJobFilter(e: { value: "" }): void {
    if (e.value !== "") {
      console.log("run1", e);
    }
  }

  onBehalfValue:any = [];

  async changedEmp(e: { value: "" }): Promise<void> {
    console.log("run", e);
    this.empValue = e.value;
    console.log(e.value,"e.... value")
    console.log(this.empValue, "///employee value")
    let user_info = JSON.parse(localStorage.getItem("user_info"));

    if (user_info["is_admin"] == true || user_info["is_superadmin"] == true) {
      this.userIsAdmin = true;
    } else {
      this.employeeName = user_info["full_name"];

      console.log(this.employeeName, "...employeeeee name")
    }

    if (user_info["is_admin"] == true) {

      this.empValue = user_info["id"];

      console.log(this.empValue, "....emn P")
    } else {
      this.empValue = e.value;
      console.log(this.empValue, "********")
      // if(this.empValue != user_info['id']) {
      this.changeApproversBhlf(this.empValue);
      // } else {
      //   console.log('Call the other function');
      //this.GetLeaveRoleModuleApproverByRoleIDandModuleID();
      // }
    }
    console.log(this.empValue, "********///")
    let result: any = await this.getEmpLeaveAvailableByOrgId(this.empValue);
    console.log(result, "result of employee leave");
    this.onBehalfValue = result
    if (result && result.length > 0) {
      //  Get Leave Profile Details
      this.leaveService
        .getLeaveProfileSetupByOrgIDandId(result[0].leave_profile_setup_id)
        .subscribe((res: any) => {
          if (res != null) {
            this.selectedLeaveSetup = res[0].leaveDetails;
            console.log("this.selectedLeaveSetup", this.selectedLeaveSetup);
          } else {
            console.log("Invalid Proile Id");
          }
        });
    } else {
      this.selectedLeaveSetup = [];
      console.log("No Setup For Selected Employee");
    }
    console.log(result, "Testing");
  }
  // .then((value: any) => {
  //   if (value.length < 0) {
  //     return;
  //   }
  //   // Get Leave Profile Details
  //   this.leaveService
  //     .getLeaveProfileSetupByOrgIDandId(value[0].leave_profile_setup_id)
  //     .subscribe((res: any) => {
  //       if (res != null) {
  //         this.selectedLeaveSetup = res[0].leaveDetails;
  //         console.log("this.selectedLeaveSetup", this.selectedLeaveSetup);
  //       } else {
  //         console.log("Invalid Proile Id");
  //       }
  //     });
  // })
  // .catch((error) => {
  //   this.selectedLeaveSetup = [];
  //   console.log("No Setup For Selected Employee");
  // });

  changeApproversBhlf(emp_id) {
    let postData = { id: emp_id };
    this.admService.FindByEmpID(postData).subscribe((userData: any) => {
      if (userData) {
        let role_id = userData.role_id;
        this.getApproversbyMdlRlid(role_id);
      }
    });
  }

  getApproversbyMdlRlid(role_id) {
    let postData = {
      roleID: role_id,
      moduleID: this.currentModuleID,
    };
    this.dualApprovalDiv = false;
    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe(
      (data: any) => {
        console.log("Approver Data", data);
        data.map((elm) => {
          if (elm.section_name === this.applyLeaveRequestName) {
            console.log(this.applyLeaveRequestName);
            if (elm.approver1_roleId !== null) {
              this.noApproverAssigned = false;
              this.approverAssigned = true;
              this.applyLeaveApprover1Value = elm.approver1_roleId;
              this.applyLeaveApprover1Name = elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.dualApprovalDiv = true;
                this.applyLeaveApprover2Value = elm.approver2_roleId;
                this.applyLeaveApprover2Name = elm.approver2_role_name;
              }
            } else {
              this.noApproverAssigned = true;
              this.approverAssigned = false;
            }
          }
        });
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );
  }

  public changedEmployeeLeaveAdjustmentEmpID(postData) {
    // let user_info= JSON.parse(localStorage.getItem('user_info'));
    // let postData={
    //   id: user_info['id'],

    //   }

    return this.leaveService
      .FetchEmployeeLeaveAdjustmentEmpID(postData)
      .subscribe(
        (data: any) => {
          if (data != null) {
            //  this.adjustedBalance=data.adjustment;

            this.leavesAdjusted = data.adjustment;
            this.availableLeaves =
              this.leavesEntitled - data.adjustment - this.used_leaves;
          } else {
            this.leavesAdjusted = 0;
            // this.availableLeaves=this.leavesAdjusted-this.used_leaves;
          }
        },
        (error) => {
          Swal.fire("Error!", "Error.", "error").then((result) => { });
        }
      );
  }
  onFocus(args: FocusEventArgs): void {
    // this.datepickerObj.show();
  }

  LeaveCountByEmpID(postData) {
    let joinedDate = "";

    this.empService.LeaveCountByEmpID(postData).subscribe(
      (data: any) => {
        if (data) {
          this.leaveCountData = data;
          //     let datas = new DataManager(data);
          // this.leaveHistory=datas.dataSource['json'];
          // this.toolbar = ['Search' ];
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
  findEmpLeaveHistory(postData) {
    let joinedDate = "";

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
            this.empjoinedDate = "";
          } else {
            this.showLeaveInfo = true;
          }
          this.empjoinedDate =
            data.joined_date != null
              ? moment(data.joined_date).format("L")
              : "";
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

  leaveRange(e) {
    this.leaveSpan = e.daySpan;
  }
  approveRange(e) {
    this.approvalSpan = e.daySpan;
  }
  public checkLeavIsDual(e: any) {
    if (e.srcElement.checked) {
      this.isLeavDual = true;
    } else {
      this.isLeavDual = false;
      this.leaveApprovalValue1 = "";
      this.leaveApprovalValue2 = "";
    }
  }
  public changedLeavApprover(e: any): void {
    this.leavApprovalValue = e.value;
  }
  public changedLeavApprover1(e: any): void {
    this.leaveApprovalValue1 = e.value;
    this.sameLeavApprover = false;
  }
  public changedLeavApprover2(e: any): void {
    this.leaveApprovalValue2 = e.value;
    this.sameLeavApprover = false;
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

  public onAddEmpLeave() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    // if(user_info['id']!=data[i].id){
    let leavePeriod = this.dateRangeForm.get("daterangeAtt").value;
    let leave_id;
    for (var i = 0; i < this.leaveStatusData.length; i++) {
      if (this.leaveStatusData[i].leave_status_name == "Pending") {
        leave_id = this.leaveStatusData[i].id;
      }
    }
    if (this.approvalValue1 == this.approvalValue2) {
      this.sameApprover = true;
    } else {
      this.sameApprover = false;
    }
    if (this.leaveApprovalValue1 == this.leaveApprovalValue2) {
      this.sameLeavApprover = true;
    } else {
      this.sameLeavApprover = false;
    }

    // let leave_status_id=this.leaveStatusData.map(function (leave) {
    //   if(leave.leave_status_name=="Pending"){
    //     return leave.id

    //   }
    // })

    let postData = {
      org_id: localStorage.getItem("org_id"),
      emp_id: this.empValue,
      leave_setup_id: this.leaveSetupid,
      leave_start_date: moment(leavePeriod[0]).format("L"),
      leave_end_date: moment(leavePeriod[1]).format("L"),
      leave_days: this.leaveSpan,
      ondate_applied: moment().format("L"),
      // "approver_emp_id": this.approverTaskValue,
      approver_emp_id: this.isLeavDual
        ? this.leaveApprovalValue1
        : this.leavApprovalValue,
      approver_emp_id2: this.isLeavDual ? this.leaveApprovalValue2 : null,
      leave_status_id: leave_id,
      is_approved: this.isApprove,
      approve_start_date: null,
      approve_end_date: null,
      approved_days: null,
      ondate_approved: null,
      emp_notes: this.leaveForm.get("desc").value,
      createdby: user_info["full_name"],
    };
    console.log("postData", postData);

    if (
      this.leaveForm.status == "VALID" &&
      this.dateRangeForm.status == "VALID" &&
      (this.isLeavDual
        ? !this.sameLeavApprover &&
        this.leaveApprovalValue1 != "" &&
        this.leaveApprovalValue2 != ""
        : this.leavApprovalValue != "")
    ) {
      this.spinner.show();
      return this.leaveService.AddEmployeeLeave(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.spinner.hide();

            this.approverTaskValue = "";
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
            this.fetchEmpLeave();
            $("#leave_modal").modal("hide");
            this.closeBtn.nativeElement.click();
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
  public onUpdateEmpLeave() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    // if(user_info['id']!=data[i].id){
    let leavePeriod = this.dateRangeForm.get("daterangeAtt").value;
    // let approvalPeriod=this.leaveForm.get('approvalrange').value;
    let leave_id;
    for (var i = 0; i < this.leaveStatusData.length; i++) {
      if (this.leaveStatusData[i].leave_status_name == "Pending") {
        leave_id = this.leaveStatusData[i].id;
      }
    }
    let postData = {
      id: this.leaveId,
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
      modifiedby: user_info["full_name"],
    };

    return this.leaveService.UpdateEmployeeLeave(postData).subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.editable = false;
          this.fetchEmpLeave();

          $("#leave_modal").modal("hide");
          this.closeBtn.nativeElement.click();

          this.toastr.success(data["desc"], undefined, {
            positionClass: "toast-top-center",
          });
        }
      },
      (error) => {
        Swal.fire("Error!", "Error.", "error").then((result) => { });
      }
    );
  }

  public fetchEmpLeave() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    // if(user_info['id']!=data[i].id){
    let currentdate = moment().format("L");
    let postData = {
      id: user_info["id"],
    };
    this.showLeaveLogSpinner = true;
    return this.leaveService.FetchEmployeeLeaveEmpID(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        if (data.length != 0) {
          this.showLeaveLogSpinner = false;

          this.employeeLeaves = data;
          let approved = [];
          let used_leaves = 0;
          let earned_used_leaves = 0;
          let upcomingLeaves = [];
          let pastLeaves = [];
          // let dataObj = JSON.parse(data['token']);
          //

          for (var i = 0; i < data.length; i++) {
            // logik to create new items
            if (moment(data[i].leave_start_date).isSameOrAfter(currentdate)) {
              upcomingLeaves.push(data[i]);
            } else {
              pastLeaves.push(data[i]);
            }
            if (data[i].leave_status_name == "Approved") {
              approved.push(data[i]);
            }
          }
          this.upcomingLeaves = upcomingLeaves;
          this.pastLeaves = pastLeaves;

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

  public activityEdit(id) {
    this.leaveId = id;
    // this.activityEditable=true;
    this.editable = true;
    this.getAllEmployee();

    //this.getAllStatus();
    //  this.GetAllProjectStatus();
    this.FindEmployeeLeaveByID(id);
    $("#leave_modal").modal("show");
  }
  RemoveEmpLeave(id) {
    let postData = {
      id: id,
    };
    return this.leaveService.RemoveEmployeeLeave(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        if (data) {
          //  this.employeeLeaves=data;
          this.fetchEmpLeave();
          this.toastr.success(data["desc"], undefined, {
            positionClass: "toast-top-center",
          });
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
  public FindEmployeeLeaveByID(id) {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    // if(user_info['id']!=data[i].id){

    let postData = {
      id: id,
    };
    return this.leaveService.FindEmployeeLeaveByID(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        if (data.length != 0) {
          //  this.employeeLeaves=data;
          this.leaveForm.patchValue({
            desc: data[0].emp_notes,
            leaveType: data[0].leave_setup_id,
          });
          //this.value= [new Date(data[0].leave_start_date), new Date(data[0].leave_end_date)]
          this.approverTaskValue = data[0].approver_emp_id;
          this.leaveSetupid = data[0].leave_setup_id;
          this.dateRangeForm.patchValue({
            daterangeAtt: [
              new Date(data[0].leave_start_date),
              new Date(data[0].leave_end_date),
            ],
          });
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
  public onTaskCheckChange(e) {
    this.taskApprove = e.value;
    if (e.srcElement.checked == true) {
      this.isApprove = true;
    } else {
      this.isApprove = false;
    }
  }
  public OnCalendarClose() {
    $("#calendar_modal").modal("hide");
    this.calndrBtn.nativeElement.click();

  }

  isExeptionalLeave = false;
  customRadioChangefor(id) {
    console.log("id for exp", id)
    if (id = 10) {
      this.isExeptionalLeave = true;
    } else {
      this.isExeptionalLeave = false;
    }
  }
  public customRadioChange(id, name, entldDays, leavePaidUnpaid, calanderType) {

    this.isExeptionalLeave = false;
    //let leftLeaveData = this.assignedLeavesDataLength;
    let leftLeaveData = this.onBehalfValue
    //console.log(id, name, entldDays, leavePaidUnpaid, calanderType)

    console.log(leftLeaveData, "///lef5t ///")
    leftLeaveData.map((elm) => {
      if (elm.leave_name === name) {
        this.leftDays = parseInt(elm.available_leave_days);
        this.entitiledLeave = parseFloat(elm.entitled_leave_days);
      }
    });
    //console.log(this.leaveSpan, this.leftDays)
    if (this.leaveSpan > this.leftDays) {
      this.notAllowedToApplyLeave = false;
    }

    //this.leaveSetupid=id;
    this.selectedLeaveId = "";
    this.selectedLeaveName = "";
    this.selEntldDays = "";
    this.availDays = "";
    this.leavePaidUnpaid = "";
    this.selectedLeaveId = id;
    this.selectedLeaveName = name;
    this.selEntldDays = entldDays;
    this.leavePaidUnpaid = leavePaidUnpaid;
    this.isCalanderDays = calanderType;
    console.log(this.isCalanderDays);
    // this.availDays = availDays;
    //   if(name=="Sick Leave"){
    //     let used_leaves=0;
    //     used_leaves= this.approvedLeaves.reduce(function(sum, record){
    //       if(record.leave_days != '' && record.leave_name=="Sick Leave") return sum +parseInt(record.leave_days) ;
    //       else return sum;
    //     }, 0);

    //               this.used_leaves=used_leaves;

    //     if(this.empjoinedDate!==null && this.empjoinedDate!==''){

    //       let joinedDate=this.empjoinedDate;
    //       let currentDate=moment().format('L');
    //       // var diff = moment(currentDate).diff(moment(joinedDate), "month")
    //       // let earnedLeaves=diff*(this.earnedTimeOff);
    //       let casualLeaves=((this.sickTimeOff)*moment().month() + 1);

    //       this.leavesEntitled=casualLeaves;

    // this.availableLeaves=this.leavesEntitled-used_leaves;

    //       }
    //   }else
    //   {
    //     let used_leaves=0;
    //     used_leaves= this.approvedLeaves.reduce(function(sum, record){
    //       if(record.leave_days != ''  && record.leave_name=="Annual Leave") return sum +parseInt(record.leave_days) ;
    //       else return sum;
    //     }, 0);

    //               this.used_leaves=used_leaves;

    //     if(this.empjoinedDate!==null || this.empjoinedDate!==''){

    //       let joinedDate=this.empjoinedDate;
    //       let currentDate=moment().format('L');
    //        var diff = moment(currentDate).diff(moment(joinedDate), "month")
    //        let earnedLeaves=diff*(this.earnedTimeOff);
    //       let casualLeaves=((this.sickTimeOff)*moment().month() + 1);

    //       this.leavesEntitled=earnedLeaves;

    // this.availableLeaves=this.leavesEntitled-used_leaves-this.adjustedBalance;
    //   }
    // }

  }

  public FetchTimeOffSetupOrgID() {
    this.leaveService.FetchTimeOffSetupOrgID().subscribe(
      (data: any) => {
        if (data) {
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
          }
          setTimeout(() => {
            this.fetchEmpLeave();
          }, 500);
          //  this.fetchEmpLeave();
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

  public FindAllOrgByHeadOrgID() {
    this.orgService.FindAllOrgByHeadOrgID().subscribe(
      (orgData: any) => {
        // let dataObj = JSON.parse(data['token']);
        //
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
          }

          this.officeData = orgData;
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
  public selectedOption(e): void {
    this.xpandStatus = false;
    this.selectedValue = e.org_name;
    this.selectedOfficeId = e.org_id;
    this.selectedentitiyLoc = e.entityLocation;
  }

  public FetchReasonsOrgID() {
    this.leaveService.FetchReasonsOrgID().subscribe(
      (data: any) => {
        if (data) {
          var results = [{ id: "", text: "Select a reason" }];
          // let dataObj = JSON.parse(data['token']);
          //

          for (var i = 0; i < data.length; i++) {
            // logik to create new items
            // if(data[i].status_name!=item.status){
            results.push({
              id: data[i].id,
              text: data[i].reasons_name,
            });
          }

          this.reasonData = results;
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
  public changedApprover(e: any): void {
    this.approvalValue = e.value;
    console.log(this.approvalValue);
  }
  changedReason(e: any): void {
    this.reasonValue = e.value;
    if (e.data[0] != "") {
      this.reasonValueTxt = e.data[0].text;
    }
  }
  public changedApprover1(e: any): void {
    this.approvalValue1 = e.value;
    this.sameApprover = false;
    console.log(this.approvalValue1);
  }

  public changedApprover2(e: any): void {
    this.approvalValue2 = e.value;
    this.sameApprover = false;
    console.log(this.approvalValue2);
  }

  onModification() {
    this.FetchReasonsOrgID();
    this.FetchTimeOffSetupOrgID();
    this.FetchReasonsOrgID();
    this.FindAllOrgByHeadOrgID();
    this.setCurrentLocation();

    this.selectedModifiedGroupVal = "Checkin";

    // $('#modification_modal').modal('show');
    this.homeInput = false;
    this.officeInput = false;
    // this.startEqualEnd=false;
    this.FetchLeaveStatusOrgID();
  }
  public startTimeChanged() {
    this.attendanceApproveForm.get("startTime").valueChanges.subscribe(() => {
      console.log(this.minForEndTime);
      this.minForEndTime = this.attendanceApproveForm.get("startTime").value;
    });
  }
  public endTimeChanged() {
    this.checkinForm.get("endTime").valueChanges.subscribe(() => {
      if (
        this.checkinForm.get("startTime").value ==
        this.checkinForm.get("endTime").value
      ) {
        this.startEqualEnd = true;
      } else {
        this.startEqualEnd = false;
      }
    });
  }

  ngOnInit() {
    console.log(this.leaveData , "just checking for proper Data")
    this.checkUserRights();
    this.checkNotificationRequest();
    this.checkforProbationPeriod();
    this.invoiceToolbar = ["Search", "PdfExport", "ExcelExport"];
    this.selectedModifiedGroupVal = "Leave";
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    // if(user_info['id']!=data[i].id){
    let postData = { id: user_info["id"] };
    this.FetchTimeOffSetupOrgID();
    this.findEmpLeaveHistory(postData);
    // this.onModification();
    this.dateRangeForm = new FormGroup({
      daterangeAtt: new FormControl("", [Validators.required]),
    });

    this.checkinForm = new FormGroup({
      startTime: new FormControl("", [Validators.required]),
      endTime: new FormControl("", [Validators.required]),
      placeName: new FormControl(""),
      reasondesc: new FormControl(""),
    });

    this.OrgId = localStorage.getItem("org_id");
    this.FetchLeaveStatusOrgID();
    this.findJoiningDate(postData);

    //leave range form
    this.leaveForm = new FormGroup({
      desc: new FormControl('', [Validators.required]),
      leaveType: new FormControl('', [Validators.required]),
      leaveLocation: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      Duration: new FormControl(''),
      leaveName: new FormControl(''),
    });

    //absent to leave form
    this.absentToLeaveForm = new FormGroup({
      desc: new FormControl("", [Validators.required]),
      leaveType: new FormControl("", [Validators.required]),
      leaveLocation: new FormControl("", [Validators.required]),
      emailAddress: new FormControl("", [Validators.required]),
      phoneNumber: new FormControl("", [Validators.required]),
    });

    //change time form
    this.attendanceApproveForm = new FormGroup({
      startTime: new FormControl("", [Validators.required]),
      endTime: new FormControl("", [Validators.required]),
      reasondesc: new FormControl(""),
    });

    //absent to present form
    this.absentToPresentForm = new FormGroup({
      startTime: new FormControl("", [Validators.required]),
      endTime: new FormControl("", [Validators.required]),
      reasondesc: new FormControl(""),
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

    if (user_info["is_admin"] != true) {
      this.empValue = user_info["id"];
      let obj = { value: this.empValue };
      this.changedEmp(obj);
    }
    if (user_info["is_admin"] == true) {
      this.userIsAdmin = true;
      this.employeeName = user_info["full_name"];
      let obj = { value: user_info["id"] };
      this.changedEmp(obj);
    } else {
      this.employeeName = user_info["full_name"];
    }

    this.leaveForm.valueChanges.subscribe(() => {
      let duration = this.leaveForm.controls["Duration"].value;
      //console.log(duration)
      if (duration === "half") {
        this.leaveSpan = 0.5;
      } else if (duration === "full") {
        this.leaveSpan = 1;
      }
    });

    this.carryForwardTableGridToolItems = ["Search"];
  }

  checkTabApiCall() {
    this.spinner.show();
    if (this.getHeaderValue === "Attendance") {
      this.GetAttendaceDataByEmpIDAndDate();
    } else if (this.getHeaderValue === "Absent") {
      this.GetAbsentDataByEmpIDAndDate();
    }
  }

  callCommonDareRangeForm() {
    this.commonDateRangeForm = new FormGroup({
      dateRangeCom: new FormControl("", [Validators.required]),
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
    //console.log('this is the line', profileStartDate, canUserApplyLeaveOnProb)
    let DateToConsider =
      profileStartDate !== null ? userInfo.joined_date : profileStartDate;
    this.leaveService
      .getEmpLeaveAvailableByOrgId(userInfo.id)
      .subscribe((data: any) => {
        console.log("gstshhshshshsh", data);
        //let toCall = data[0].is_modified;
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
            this.UpdateAvailableLeaves(userInfo.id);
          }
        } else {
          console.log("can apply");
          this.probationperiodRunning = false;
          this.probationperiodOver = true;
          this.UpdateAvailableLeaves(userInfo.id);
        }
      });
    //console.log(DateToConsider)
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

  fetchEmployeeLeaveEmpID() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    this.leaveService
      .getEmpLeaveAvailableByOrgId(user_info.id)
      .subscribe((data: any) => {
        let annualLeave = [];
        let sickleave = [];
        data.map((elm) => {
          if (elm.leave_name === "Annual leave") {
            annualLeave.push(elm);
          } else if ((elm.leave_name = "Sick Leave")) {
            sickleave.push(elm);
          }
          console.log("Sick Leave", sickleave[0]);
          this.sickleaveassigneddata = sickleave[0];
        });
        let availableLeaveDays = Number(annualLeave[0].available_leave_days);
        this.assignedLeavesDataLength = data;
        console.log(this.assignedLeavesData,"...leave Dataaaaaa")
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

  fetchLeaveOnBehalf(id) {
    this.leaveService
      .getEmpLeaveAvailableByOrgId(id)
      .subscribe((data: any) => {
        let annualLeave = [];
        let sickleave = [];
        data.map((elm) => {
          if (elm.leave_name === "Annual leave") {
            annualLeave.push(elm);
          } else if ((elm.leave_name = "Sick Leave")) {
            sickleave.push(elm);
          }
          console.log("Sick Leave", sickleave[0]);
          this.sickleaveassigneddata = sickleave[0];
        });
        let availableLeaveDays = Number(annualLeave[0].available_leave_days);
        this.assignedLeavesDataLength = data;
        console.log(this.assignedLeavesData,"...leave Dataaaaaa")
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

  checkUserRights() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = { id: user_info.role_id };
    this.userService.GetAccessRightsbyRole(postData).subscribe((data: any) => {
      this.UserRights = _.groupBy(data, "module_name");
      console.log("justin", this.UserRights);
      if (this.UserRights.Leave) {
        this.showLeavePage = true;
        let LeaveRights = this.UserRights.Leave;
        this.currentModuleID = LeaveRights[0].id;

        LeaveRights.map((elm) => {
          if (elm.section_name === "Apply Leave Request") {
            if (elm.is_allow === true) {
              this.applyLeaveRequestAccess = true;
              this.applyLeaveRequestName = elm.section_name;
              this.requestHeaderText.push({
                text: "Leave",
              });
            } else {
              this.applyLeaveRequestAccess = false;
            }
          } else if (elm.section_name === "Apply  Attendance Overwrite") {
            if (elm.is_allow === true) {
              this.applyAttendanceOverwriteAccess = true;
              this.applyAttendanceOverwriteName = elm.section_name;
            } else {
              this.applyAttendanceOverwriteAccess = false;
            }
          } else if (elm.section_name === "Apply Carry Forward") {
            if (elm.is_allow === true) {
              this.applyCarryForwardAccess = true;
              this.applyCarryForwardName = elm.section_name;
              this.requestHeaderText.push({
                text: "Carry Forward",
              });
            } else {
              this.applyCarryForwardAccess = false;
            }
          } else if (elm.section_name === "On behalf Apply Leave Request") {
            if (elm.is_allow === true) {
              this.onbehalfApplyLeaveRequestAccess = true;
              this.onbehalfApplyLeaveRequestName = elm.section_name;
            } else {
              this.onbehalfApplyLeaveRequestAccess = false;
            }
          } else if (
            elm.section_name === "Approve / Disapprove Leave Requests"
          ) {
            if (elm.is_allow === true) {
              this.appDisapproveLeaveRequestsAccess = true;
            } else {
              this.appDisapproveLeaveRequestsAccess = false;
            }
          } else if (
            elm.section_name === "Approve / Disapprove Attendance Overwrite"
          ) {
            if (elm.is_allow === true) {
              this.appDisAttOverRequestsAccess = true;
              this.requestHeaderText.push({
                text: "Attendance Override",
              });
            } else {
              this.appDisAttOverRequestsAccess = false;
            }
          } else if (elm.section_name === "Allow Posting holidays") {
            if (elm.is_allow === true) {
              this.allowPostingholidaysRequestsAccess = true;
              this.allowPostingholidaysRequestName = elm.section_name;
              this.requestHeaderText.push({
                text: "Holidays",
              });
            } else {
              this.allowPostingholidaysRequestsAccess = false;
            }
          } else if (elm.section_name === "Approve / Disapprove holidays") {
            if (elm.is_allow === true) {
              this.approveDisapproveholidaysAccess = true;
            } else {
              this.approveDisapproveholidaysAccess = false;
            }
          } else if (
            elm.section_name === "Approve / Disapprove Force CheckIn-Checkout"
          ) {
            if (elm.is_allow === true) {
              this.appFrcChkinRequestsAccess = true;
              this.requestHeaderText.push({
                text: "Force CheckIn/Checkout",
              });

              this.GetFrcOverwritebyEmpId();
            } else {
              this.appFrcChkinRequestsAccess = false;
            }
          }
        });

        this.appDisapproveLeaveRequestsAccess === true
          ? this.GetLeaveRqstbyEmpId()
          : this.listEmployeeLeaveHistory();
        this.approveDisapproveholidaysAccess === true
          ? this.GetPublicHolidaysCreatedbyApproverId()
          : this.GetPublicHolidaysCreatedbyOrgId();

        if (this.requestHeaderText.length === 0) {
          this.requestHeaderText.push({
            text: "No Leave Profile Assigned",
          });
        }
      } else {
        this.showNotFound = true;
      }
    });
  }

  tabSelected(event) {
    this.getHeaderValue = event.selectedItem.outerText;
    console.log(this.getHeaderValue);
    this.checkTabApiCall();
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

  //attendance Overwrite function starts
  updateAttendance(objData) {
    delete objData.column;
    $("#attendance_Overwrite_modal").modal("show");
    this.attendanceSelectedData = objData;
    this.attendanceSelectedData.check_in === "NA"
      ? this.attendanceApproveForm.patchValue({ startTime: "" })
      : this.attendanceApproveForm.patchValue({ startTime: objData.check_in });
    this.attendanceSelectedData.check_out === "NA"
      ? this.attendanceApproveForm.patchValue({ endTime: "" })
      : this.attendanceApproveForm.patchValue({ endTime: objData.check_out });
    this.minForEndTime =
      this.attendanceSelectedData.check_in !== "NA"
        ? this.attendanceSelectedData.check_in
        : "";
    this.attendFetchReasonsOrgID();
    //get approvers for Overwrite
    this.GetLeaveRoleModuleApproverByRoleIDandModuleID();
  }

  attendanceOverwrite(attendData) {
    if (this.attendanceReasonValue === "") {
      this.attendanceOverwriteReasonIDYesNO = true;
    } else {
      if (
        this.attendanceApproveForm.controls["reasondesc"].value === "" ||
        this.attendanceApproveForm.controls["reasondesc"].value === null
      ) {
        this.attendanceOverwriteReasonIDYesNO = false;
        this.attendanceReasonOtherValue = true;
      } else {
        let userInfo = JSON.parse(localStorage.getItem("user_info"));
        let resVal =
          this.attendanceApproveForm.get("reasondesc").value === ""
            ? null
            : this.attendanceApproveForm.get("reasondesc").value;
        let staTime = this.attendanceApproveForm.get("startTime").value;
        let endTime = this.attendanceApproveForm.get("endTime").value;
        let getDateToSend = attendData.ondate.split(/[-/]/);
        let dateFormated = [
          getDateToSend[1],
          getDateToSend[0],
          getDateToSend[2],
        ].join("/");
        let postData = {
          id: null,
          empid: attendData.employee_id,
          timesheet_id: attendData.timesheet_id,
          ondate: dateFormated,
          check_in: dateFormated + " " + staTime,
          check_out: endTime !== "" ? dateFormated + " " + endTime : null,
          is_checkout: this.attendanceApproveForm.get("endTime").value
            ? true
            : false,
          previous_check_in:
            dateFormated + " " + this.attendanceSelectedData.check_in,
          previous_check_out:
            this.attendanceSelectedData.check_out !== "NA"
              ? dateFormated + " " + this.attendanceSelectedData.check_out
              : null,
          is_onbehalf: false,
          onbehalf_empid: attendData.employee_id,
          approver_emp_id1: this.AttendanceOverwriteApprover1Value,
          approver_emp_id2:
            this.dualApprovalDivAO === true
              ? this.AttendanceOverwriteApprover2Value
              : null,
          total_hrs: null,
          reason_id: this.attendanceReasonValue,
          reason_desc: resVal,
          createdby: userInfo["full_name"],
          org_id: localStorage.getItem("org_id"),
          from_id: attendData.employee_id,
          to_id: null,
          created_by_empId: attendData.employee_id,
          modified_by_empId: attendData.employee_id,
        };
        //console.log(postData)
        this.timesheetService
          .AddTimesheetOverrideByTimesheetIDNew(postData)
          .subscribe(
            (data: any) => {
              //console.log(data)
              if (data.status === "200") {
                this.spinner.show();
                this.GetAttendaceDataByEmpIDAndDate();
                this.toastr.success(
                  "Attendance request has been sent successfully for approval",
                  undefined,
                  {
                    positionClass: "toast-top-center",
                  }
                );
                this.attendanceOverwriteModelClose();
              } else {
                Swal.fire("Error!", "Server Error", data.result.desc);
              }
            },
            (error) => {
              this.spinner.hide();
              Swal.fire("Error!", "Error.", "error");
            }
          );
      }
    }
  }

  attendanceOverwriteModelClose() {
    $("#attendance_Overwrite_modal").modal("hide");
    this.attendanceApproveForm.reset();
    this.attendanceOverwriteReasonIDYesNO = false;
    this.attendanceReasonOtherValue = false;
    this.attendanceOverwriteReasonData = [];
  }

  public attendFetchReasonsOrgID() {
    this.leaveService.FetchReasonsOrgID().subscribe(
      (data: any) => {
        if (data) {
          var results = [{ id: "", text: "Select a reason" }];
          data.map((elm) => {
            results.push({
              id: elm.id,
              text: elm.reasons_name,
            });
          });
          results.push({
            id: "Other123",
            text: "Other",
          });
          this.attendanceOverwriteReasonData = results;
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );
  }

  changedReasonAtt(e: any): void {
    //console.log('required', e)
    this.attendanceReasonValue = e.value;
    if (e.value !== null) {
      this.attendanceReasonValueTxt = e.data[0].text;
    }
  }

  //attendance Overwrite function ends

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

  attendanceOverwriteCellCustomise(args: any) {
    if (args.data["leave_status"] == "Checkin/Checkout Overwrite Pending") {
      args.cell.classList.add("background-inPending");
    } else if (
      args.data["leave_status"] == "Checkin/Checkout Overwrite Approved"
    ) {
      args.cell.classList.add("background-inApproved");
    }
  }

  attendIsActivityLogFieldValid(field: string) {
    if (this.attendanceModifySubmit) {
      return (
        (this.attendShowerrorMsg = true),
        (this.attendanceApproveForm.get(field).errors &&
          this.attendanceApproveForm.get(field).touched) ||
        (this.attendanceApproveForm.get(field).untouched &&
          this.attendanceModifySubmit)
      );
    } else {
      return (this.attendShowerrorMsg = false), false;
    }
  }

  public checkIsDual(e: any) {
    if (e.srcElement.checked) {
      this.isDual = true;
    } else {
      this.isDual = false;
      this.approvalValue1 = "";
      this.approvalValue2 = "";
    }
  }

  //absent function start
  public GetAbsentDataByEmpIDAndDate() {
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

  //absent Model
  absendRequestModel(objData) {
    delete objData.column;
    console.log(objData);
    this.employeeName = objData.full_name;
    $("#absent_Approval_modal").modal("show");
    this.absentSelectedData = objData;
    this.leaveToAbsentDate = objData.ondate;
    this.getUserleaveHistory(objData.id);
    this.GetLeaveRoleModuleApproverByRoleIDandModuleID();
  }

  getUserleaveHistory(empID) {
    let result = this.getEmpLeaveAvailableByOrgId(empID);
    result
      .then((value: any) => {
        if (value.length < 0) {
          return;
        }
        this.leaveService
          .getLeaveProfileSetupByOrgIDandId(value[0].leave_profile_setup_id)
          .subscribe((res: any) => {
            console.log("leave details", res);
            if (res != null) {
              this.selectedLeaveSetup = res[0].leaveDetails;
            } else {
              console.log("Invalid Proile Id");
            }
          });
      })
      .catch((error) => {
        console.log("No Setup For Selected Employee");
      });
  }

  convertAbsentToLeave(reason) {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let reqObj = {
      org_id: localStorage.getItem("org_id"),
      emp_id: this.empValue,
      leave_profile_setup_id: this.selectedLeaveId,
      leave_name: this.selectedLeaveName,
      leave_type: this.leavePaidUnpaid,
      leave_start_date: this.absentSelectedData.ondate,
      leave_end_date: this.absentSelectedData.ondate,
      leave_days_applied: 1,
      ondate_applied: moment().format("L"),
      emp_notes: reason.value ? reason.value : "",
      approver1_roleId: this.applyLeaveApprover1Value,
      approver2_roleId: this.applyLeaveApprover2Value,
      approver1_notes: "",
      approver2_notes: "",
      is_approved_empId1: false,
      is_approved_empId2: false,
      leave_status: "pending",
      created_by_empId: user_info["id"],
      modified_by_empId: user_info["id"],
      email: this.absentToLeaveForm.controls["emailAddress"].value,
      phone: this.absentToLeaveForm.controls["phoneNumber"].value.toString(),
      is_local_leave:
        this.absentToLeaveForm.controls["leaveLocation"].value === "local Leave"
          ? true
          : false,
      is_abs_to_leave: true,
    };

    if (this.empValue != user_info["id"]) {
      reqObj["onbehalf_applied"] = user_info["id"];
    }

    console.log(reqObj);

    this.leaveService.empAddLeaveRequest(reqObj).subscribe((res: any) => {
      if (res != null) {
        this.toastr.success("Leave Applied Successfully");
        this.convertAbsentToLeaveModel();
        this.absentToLeaveForm.reset();
        this.dateRangeForm.reset();
        this.listEmployeeLeaveHistory();
      } else {
        this.toastr.error("Something Went Wrong");
        this.convertAbsentToLeaveModel();
        this.absentToLeaveForm.reset();
        this.dateRangeForm.reset();
        this.listEmployeeLeaveHistory();
      }
    });
  }

  convertAbsentToLeaveModel() {
    this.selectedLeaveSetup = [];
    this.selectedLeaveId = "";
    this.selectedLeaveName = "";
    this.selEntldDays = "";
    this.availDays = "";
    this.leavePaidUnpaid = "";
    this.employeeData = [];
    $("#absent_Approval_modal").modal("hide");
    this.absentToLeaveForm.reset();
  }

  onModifyValChange(val) {
    this.selectedModifiedGroupVal = val;
    if (this.selectedModifiedGroupVal === "Checkin") {
      this.absentToPresentMod();
    }
  }

  absentToPresentMod() {
    this.FindByOrgId();
    this.FindAllOrgByHeadOrgID();
    this.attendFetchReasonsOrgID();
    this.GetLeaveRoleModuleApproverByRoleIDandModuleID();
    this.homeInput = false;
    this.officeInput = false;
    this.startEqualEnd = false;
    this.officeInput = true;
  }

  FindByOrgId() {
    let id = localStorage.getItem("org_id");
    this.orgService.FindByOrgId(id).subscribe((data: any) => {
      console.log(data, this.selecteOptionValue);
      if (data.org_name === this.selecteOptionValue) {
        this.formatted_address = data.entityLocation.formatted_address;
        this.currlatitude = data.entityLocation.lat;
        this.currlongitude = data.entityLocation.lang;
        this.street_number = data.entityLocation.street_number;
        this.route = data.entityLocation.route;
        this.locality = data.entityLocation.locality;
        this.administrative_area_level_2 =
          data.entityLocation.administrative_area_level_2;
        this.administrative_area_level_1 =
          data.entityLocation.administrative_area_level_1;
        this.country = data.entityLocation.country;
      }
    });
  }

  public checkIsHome(e: any) {
    if (e.srcElement.checked) {
      this.homeInput = true;
      this.officeInput = false;
      this.setCurrentLocation();
    } else {
      this.FindByOrgId();
      this.officeInput = true;
      this.homeInput = false;
    }
  }

  private setCurrentLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currlatitude = position.coords.latitude;
            this.currlongitude = position.coords.longitude;
            this.zoom = 8;
            this.getCurrAddress(this.currlatitude, this.currlongitude);
            resolve(true);
          },
          (error) => {
            this.callLocationError(error);
            reject();
          }
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
        $("#absent_Approval_modal").modal("hide");
      }
    });
  }

  getCurrAddress(latitude, longitude) {
    console.log(latitude, longitude);
    var addr = new google.maps.Geocoder();
    addr.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            this.getMatchedTypes(results[0].address_components);
            this.formatted_address = results[0].formatted_address;
          } else {
            Swal.fire("Please try again!", "Location not found", "error").then(
              (result) => {
                if (result.value === true) {
                  $("#absent_Approval_modal").modal("hide");
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

  public getMatchedTypes(address_components) {
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

  convertAbsentToPresent() {
    let user: object = {};
    let startTime = this.absentToPresentForm.get("startTime").value;
    let endTime = this.absentToPresentForm.get("endTime").value;
    let date = moment().format("MM/DD/YYYY");
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    let typeOfCheckin;
    let typeOfCheckinValue;
    if (this.officeInput) {
      (typeOfCheckin = "Office"), (typeOfCheckinValue = this.selectedValue);
    } else if (this.homeInput) {
      (typeOfCheckin = "WFH"), (typeOfCheckinValue = this.formatted_address);
    }
    console.log(this.absentReasonValue);
    let postData = {
      //"team_member_empid": [this.absentManageEmpId],
      teamid: null,
      check_in: date.concat(" " + startTime),
      check_out: date.concat(" " + endTime),
      groupid: null,
      ondate: this.leaveToAbsentDate,
      createdby: user["full_name"],
      is_inrange: true,
      is_checkout: true,
      total_hrs: null,
      is_onbehalf: false,
      onbehalf_empid: user["id"],
      approver1_empid: null,
      approver2_empid: null,
      reason_id: this.attendanceReasonValue,
      reason_desc:
        this.attendanceReasonValueTxt === "Other"
          ? this.absentToPresentForm.get("reasondesc").value
          : null,
      TimesheetCategoryViewModel: {
        project_category_type: typeOfCheckin,
        project_or_comp_id:
          typeOfCheckin === "Office" ? this.selectedOfficeId : null,
        project_or_comp_name: typeOfCheckinValue,
        project_or_comp_type: null,
      },
      TimesheetCurrentLocationViewModel: {
        formatted_address: this.formatted_address ? this.formatted_address : "",
        lat: this.currlatitude,
        lang: this.currlongitude,
        street_number: this.street_number ? this.street_number : "",
        route: this.route ? this.route : "",
        locality: this.locality ? this.locality : "",
        administrative_area_level_2: this.administrative_area_level_2
          ? this.administrative_area_level_2
          : "",
        administrative_area_level_1: this.administrative_area_level_1
          ? this.administrative_area_level_1
          : "",
        postal_code: this.postal_code,
        country: this.country ? this.country : "",
      },
      TimesheetSearchLocationViewModel: {
        manual_address:
          typeOfCheckin == "Manual"
            ? this.absentToPresentForm.get("placeName").value
            : "",
        ...(!this.officeInput
          ? {
            geo_address: this.formatted_address,
            formatted_address: !this.officeInput
              ? this.formatted_address
              : this.formatted_address,
            lat: this.currlatitude ? JSON.stringify(this.currlatitude) : "",
            lang: this.currlongitude
              ? JSON.stringify(this.currlongitude)
              : "",
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
        is_manual: typeOfCheckin == "Manual" ? true : false,
        is_wfh: this.homeInput ? true : false,
      },
    };
    console.log("checkin data", postData);
    if (this.selectedModifiedGroupVal == "Checkin") {
      this.spinner.show();
      return this.timesheetService.ApproveTimesheet(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            $("#absent_Approval_modal").modal("hide");
            this.spinner.hide();
            this.GetAbsentDataByEmpIDAndDate();
            this.toastr.success(
              "Absent request has been sent successfully for approval",
              undefined,
              {
                positionClass: "toast-top-center",
              }
            );
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire("Error!", "Error.", "error");
        }
      );
    }
  }

  //notification request
  checkNotificationRequest() {
    let getNotValue = JSON.parse(localStorage.getItem("notData"));
    let message = localStorage.getItem("message");

    let frchkIn = JSON.parse(localStorage.getItem("notFrcCheckin"));

    if (getNotValue !== null) {
      //console.log(getNotValue)
      this.getViewNotification(getNotValue, message);
      localStorage.removeItem("notData");
      localStorage.removeItem("message");
      localStorage.removeItem("notFrcCheckin");
    } else if (frchkIn != null) {
      this.getViewNotification(frchkIn, "newMessage");

      localStorage.removeItem("notFrcCheckin");
    } else {
      console.log("No Request", getNotValue);
    }
  }

  getViewNotification(notData, message) {
    console.log("Justin", notData);
    this.originalViewEditNotificationModelData = notData;
    this.spinner.show();
    $("#notificationModal").modal("show");
    if (message === "newMessage") {
      this.showButtonDiv = true;
    } else if (message === "oldMessage") {
      this.showButtonDiv = false;
    }
    let postData = {
      id: notData.reference_id,
    };
    if (notData.message === "Approval Requested for New Leave Profile") {
      let message = this.originalViewEditNotificationModelData.message;
      this.AdminSettingService.GetLeaveProfileSetupByOrgIDandProfileID(
        postData
      ).subscribe((data: any) => {
        let serverData = data[0];
        let postData1 = { id: serverData.created_by_empId };
        this.admService.FindByEmpID(postData1).subscribe((data: any) => {
          if (data.full_name) {
            let createdBy = data.full_name;
            serverData["created_by_emp"] = createdBy;
            let postData2 = { id: serverData.approver1_roleId };
            this.ModuleSetupService.FindByRoleModulesID(postData2).subscribe(
              (data: any) => {
                let approver1 = data[0].role_name;
                serverData["approver1_RoleName"] = approver1;
                if (!this.showButtonDiv) {
                  serverData["message"] =
                    "Approval Requested for New Leave Profile";
                } else {
                  serverData["message"] = message;
                }

                if (serverData.is_dual_approval === true) {
                  let postData2 = { id: serverData.approver2_roleId };
                  this.ModuleSetupService.FindByRoleModulesID(
                    postData2
                  ).subscribe((data: any) => {
                    let approver2 = data[0].role_name;
                    this.isApprov2View = true;
                    serverData["approver2_RoleName"] = approver2;
                  });
                }
                this.viewEditNotificationModelData = serverData;
                this.spinner.hide();
                this.leaveProfileModel = true;
              }
            );
          }
        });
      });
    } else if (notData.message === "Requested Approval for New Leave Request") {
      let tabTextName = "Leave";
      this.setTabOf(tabTextName);
      this.AdminSettingService.GetLeaveRequestedHistoryByID(postData).subscribe(
        async (data: any) => {
          console.log("Justin----->", data);
          let serverData = data[0];
          if (!this.showButtonDiv) {
            serverData["message"] = "Approval for New Leave Request";
          } else {
            serverData["message"] =
              this.originalViewEditNotificationModelData.message;
          }
          serverData["created_by_name"] =
            this.originalViewEditNotificationModelData.created_by_name;
          this.viewEditNotificationModelData = serverData;
          this.callLeaveModelProcess();
          this.spinner.hide();

          this.fetchEmployeeLeaveByEmpID(
            serverData.emp_id,
            serverData.leave_name
          );
          this.notifymodal = true;
          await this.getEmployeeLeaveHistory(serverData.emp_id);
          this.applyLeaveModel = true;
        }
      );
    } else if (
      notData.message === "Requested Approval for Check In Check Out Overwrite"
    ) {
      let tabTextName = "Attendance Override";
      console.log("Am the postdata for you",postData);

      this.timesheetService
        .GetTimesheetOverrideDetailsByTimesheetID(postData)
        .subscribe((data: any) => {
          console.log(data);
          this.setTabOf(tabTextName);
          this.aoMonthStart = new Date(data.check_in_old);
          this.aoMonthEnd = new Date(data.check_in_old);
          let serverData = data;
          if (!this.showButtonDiv) {
            serverData["message"] = "Approval for Check In Check Out Overwrite";
          } else {
            serverData["message"] =
              this.originalViewEditNotificationModelData.message;
          }
          this.viewEditNotificationModelData = serverData;
          this.spinner.hide();
          this.applyOverwriteModel = true;
        });
    } else if (
      notData.message === "Requested Approval for Carry Forward Request"
    ) {
      let tabTextName = "Carry Forward";
      this.setTabOf(tabTextName);
      this.timesheetService
        .GetCarryfrwdRqstById(postData)
        .subscribe((data: any) => {
          console.log(data);
          let serverData = data;
          if (!this.showButtonDiv) {
            serverData.message = "Approval Requested for Carry Forward";
          } else {
            serverData.message =
              this.originalViewEditNotificationModelData.message;
          }
          serverData.created_by_name =
            this.originalViewEditNotificationModelData.created_by_name;
          this.viewEditNotificationModelData = serverData;
          this.spinner.hide();
          this.carryForwardModel = true;
        });
    } else if (notData.message === "Requested Approval for a Created Holiday") {
      let tabTextName = "Holidays";
      this.setTabOf(tabTextName);
      this.timesheetService
        .GetPublicHolidaysById(postData)
        .subscribe((data: any) => {
          let serverData = data;
          if (!this.showButtonDiv) {
            serverData.message = "Approval for a Created Holiday";
          } else {
            serverData.message =
              this.originalViewEditNotificationModelData.message;
          }
          serverData.created_by_name =
            this.originalViewEditNotificationModelData.created_by_name;
          this.viewEditNotificationModelData = serverData;
          this.spinner.hide();
          this.HoliadyModel = true;
          console.log(this.viewEditNotificationModelData);
        });
    } else if (
      notData.message.indexOf("Force checkin") > -1 ||
      notData.message.indexOf("Force checkout") > -1
    ) {
      // let tabTextName = 'Holidays';
      // this.setTabOf(tabTextName);
      console.log("This");
      this.timesheetService
        .GetForceCheckinRequestById(postData)
        .subscribe((data: any) => {
          let serverData = data[0];
          if (!this.showButtonDiv) {
            serverData.message = "Approval for a Force CheckIn/Checkout";
          } else {
            serverData.message =
              this.originalViewEditNotificationModelData.message;
          }
          serverData.created_by_name =
            this.originalViewEditNotificationModelData.created_by_name;
          //this.viewEditNotificationModelData = serverData;

          var results = [];

          data.map((el) => {
            if (
              el.reason_name === "Location Failureface Recogonisation Issue"
            ) {
              el["desc"] = "Location Issue & Failure in Face Recognition";
            } else if (
              el.reason_name === "undefinedface Recogonisation Issue"
            ) {
              el["desc"] = "Failure in Face Recognition";
            } else {
              el["desc"] = el.reason_name;
            }
            results.push(el);
          });
          console.log("Data", results);

          this.frcckinModalData = results[0];
          if (this.frcckinModalData.check_in == null) {
            let reqObj = {
              id: this.frcckinModalData.timesheet_id,
            };
            this.timesheetService
              .GetCheckinDetailsbyId(reqObj)
              .subscribe((checkindata: any) => {
                console.log("res", checkindata);
                (this.frcckinModalData.checkin_lat = checkindata[0].lat),
                  (this.frcckinModalData.checkin_lang = checkindata[0].lang);
              });
          }

          this.spinner.hide();
          this.openApproverForceClosureModel(this.frcckinModalData);
          // this.applyFrcChkInModel = true;
          console.log("this.frcckinModalData--->", this.frcckinModalData);
        });
      console.log("postData--->", postData);

      this.spinner.hide();
    }
  }

  setTabOf(tabTextName) {
    setTimeout(() => {
      let tabNumber = this.requestHeaderText
        .map(function (e) {
          return e.text;
        })
        .indexOf(tabTextName);
      this.tabObj.select(tabNumber);
    }, 2000);
  }

  getAllNotificationForOrg() {
    this.AdminSettingService.communicateWithHeaderComp("run-Notification");
  }

  //leave cancel function starts
  leaveCancelModel(data) {
    console.log(data);
    this.leaveCanModel = true;
    this.leaveCancelData = data;
    $("#notificationModal").modal("show");
  }

  HolidayCancelModel(data) {
    console.log(data);
    this.HolidayCancelData = data;
    this.HolidayCanModel = true;
    $("#notificationModal").modal("show");
  }

  HolidayDelete(data) {
    console.log("Deleted", data);
    this.HolidayCanModel = false;
    Swal.fire({
      title: "Delete this Holiday Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        let postData = { id: data.id };
        this.leaveService.RemoveHolidayByID(postData).subscribe((data: any) => {
          console.log(data);
          if (data.status == 200) {
            this.toastr.success("Holiday Request have been deleted");
            this.GetPublicHolidaysCreatedbyOrgId();
          } else {
            this.toastr.error("something went wrong");
          }
        });
      }
    });
  }

  openApproverholidayFormModel(data) {
    this.HoliadyModelApprove = true;
    this.HoliadyModelApproveData = data;
    console.log("HoliadyModelApproveData", this.HoliadyModelApproveData);
    $("#notificationModal").modal("show");
  }

  openApproverAttOverFormModel(data) {
    this.notnotification=true;
    this.overwritemodaldata=data;
    console.log(data,"Data to go");
    if(data.leave_status=='Overwrite Request Pending')
    {
      this.showButtonDiv=true
    }
    let postData = {
      id: data.override_id,
    };
    this.timesheetService
      .GetTimesheetOverrideDetailsByTimesheetID(postData)
      .subscribe((data: any) => {
        console.log(data);
        this.viewEditNotificationModelData = {
          ...data,
          message: "Approval for Check In Check Out Overwrite"

        };
        $("#notificationModal").modal("show");
        console.log("Am here",this.viewEditNotificationModelData)
        this.applyOverwriteModel = true;
      });
  }


  leaveDelete() {
    console.log(this.leaveCancelData.leave_status);
    if (this.leaveCancelData.leave_status == "approved") {
      //  var todaysDate =   moment().add('days',15).format('L');
      var todaysDate = moment().format("L");

      console.log("todaysDate--->", todaysDate);
      console.log("Leave Start Date", this.leaveCancelData.leave_start_date);

      console.log(
        moment(this.leaveCancelData.leave_start_date).isAfter(todaysDate)
      );

      if (
        moment(this.leaveCancelData.leave_start_date).isAfter(todaysDate) ===
        false
      ) {
        this.toastr.error("Leave Cannot Be Cancelled");
      } else {
        let postData = { id: this.leaveCancelData.id };
        this.leaveService
          .RemoveLeaveRequestedHistoryByID(postData)
          .subscribe((data: any) => {
            console.log(data);
            if (data.status == 200) {
              this.toastr.success("Leave Request have been deleted");
            } else {
              this.toastr.error("something went wrong");
            }
            this.leaveCancelCloseModel();
            this.listEmployeeLeaveHistory();
          });
      }
    } else {
      let postData = { id: this.leaveCancelData.id };
      this.leaveService
        .RemoveLeaveRequestedHistoryByID(postData)
        .subscribe((data: any) => {
          console.log(data);
          if (data.status == 200) {
            this.toastr.success("Leave Request have been deleted");
          } else {
            this.toastr.error("something went wrong");
          }
          this.leaveCancelCloseModel();
          this.listEmployeeLeaveHistory();
        });
    }
  }

  leaveCancelCloseModel() {
    $("#notificationModal").modal("hide");
    this.leaveCanModel = false;
    this.HolidayCanModel = false;
  }
  //leave cancel function ends

  //approve leave from the list
  //assetReqEmp = ""
  //let onBehalfValue: string = "";
  async openApproverLeaveFormModel(listdata) {
    this.spinner.show();
    let postData = {
      id: listdata.id,
    };

    console.log(listdata, " ....listedd..")



    this.AdminSettingService.GetLeaveRequestedHistoryByID(postData).subscribe(
      async (data: any) => {
        this.leaveData = data[0];

        console.log(this.leaveData, "...leave Data....")
        console.log(this.leaveData.onbehalf_applied, "......//////")
        //console.log(this.assetReqEmp, " .....regquest")
        if(this.leaveData.onbehalf_applied)
        {
          const data2: any = await this.empService.getEmployeeByOrgId().toPromise();
          console.log(data2, "data");
          data2.map((elm) => {
          if(elm.id == this.leaveData.onbehalf_applied){
            this.leaveData.onbehalf_applied = elm.full_name;
            //this.onBehalfValue = elm.full_name
          }
          console.log(this.onBehalfValue, " ......//////")
        });
        }



        this.leaveData.emp_name = listdata.emp_name;
        this.leaveData.full_name = listdata.emp_name;
        this.getEmployeeRole(
          listdata.approver1_roleId,
          listdata.approver2_roleId
        );

        if (this.leaveData.approver1_roleId === this.userInfoLocal.role_id) {
          if (
            this.leaveData.approver1_roleId === this.userInfoLocal.role_id &&
            this.leaveData.is_approved_empId1
          ) {
            this.showLeaveFunBtn = false;
          } else {
            this.showLeaveFunBtn = true;
          }
        }

        if (this.leaveData.approver2_roleId === this.userInfoLocal.role_id) {
          if (
            this.leaveData.approver2_roleId === this.userInfoLocal.role_id &&
            this.leaveData.is_approved_empId2
          ) {
            this.showLeaveFunBtn = false;
          } else {
            if (
              this.leaveData.approver2_roleId === this.userInfoLocal.role_id &&
              !this.leaveData.is_approved_empId2 &&
              this.leaveData.leave_status === "declined"
            ) {
              this.showLeaveFunBtn = false;
            } else {
              this.showLeaveFunBtn = true;
            }
          }
        }

        if (
          this.leaveData.leave_status === "pending" &&
          this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "approved";
        } else if (
          this.leaveData.leave_status === "pending" &&
          !this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "pending";
        } else if (
          this.leaveData.leave_status === "declined" &&
          this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "approved";
        } else if (
          this.leaveData.leave_status === "declined" &&
          !this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "declined";
        } else if (
          this.leaveData.leave_status === "approved" &&
          this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "approved";
        } else if (
          this.leaveData.leave_status === "approved" &&
          !this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "pending";
        }

        if (this.leaveData.approver2_roleId !== null) {
          if (
            this.leaveData.leave_status === "pending" &&
            this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "approved";
          } else if (
            this.leaveData.leave_status === "pending" &&
            !this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "pending";
          } else if (
            this.leaveData.leave_status === "declined" &&
            this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "approved";
          } else if (
            this.leaveData.leave_status === "declined" &&
            !this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "declined";
          } else if (
            this.leaveData.leave_status === "approved" &&
            this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "approved";
          } else if (
            this.leaveData.leave_status === "approved" &&
            !this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "pending";
          }
        }
        console.log("Fucker am here", this.leaveData.leave_name);
        console.log("Leave Data for checking", this.leaveData)
        this.fetchEmployeeLeaveByEmpID(
          this.leaveData.emp_id,
          this.leaveData.leave_name
        );

        await this.getEmployeeLeaveHistory(this.leaveData.emp_id);
        // this.spinner.hide();
      }
    );
  }

  formatdateFormat(dt) {
    // Step 1: Parse the input date string into a Date object
    const inputDate = new Date(dt);

    // Step 2: Extract individual components
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth() + 1; // Months are zero-based, so we add 1
    const day = inputDate.getDate();
    const hour = inputDate.getHours();
    const minute = inputDate.getMinutes();
    const second = inputDate.getSeconds();

    // Step 3: Create a new Date object with the extracted components and set hour, minute, and second
    const newDate = new Date(year, month - 1, day, hour, minute, second);

    // Step 4: Format the new Date object in the desired format "YYYY-MM-DD HH:mm:ss"
    const formattedDate = newDate.toISOString().slice(0, 19).replace("T", " ");

    return formattedDate;
  }
  haversineDistance(lat1, lng1, lat2, lng2) {
    console.log(lat1, lng1, lat2, lng2, "lat1, lng1, lat2, lng2");
    const toRadians = (angle) => angle * (Math.PI / 180);

    const R = 6371000;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  async openApproverForceClosureModel(data) {
    console.log("Initial Data--->", data);
    this.showMap = false;
    this.showMapLoader = false;
    // Proceed with your logic using checkinLat and checkinLong

    if (data.status === "approved" || data.status === "declined") {
      return;
    } else {
      $("#notificationModal").modal("show");

      try {
        let reqObj = { id: data.timesheet_id };
        const respData = await this.timesheetService
          .GetCheckinDetailsbyId(reqObj)
          .toPromise();
        console.log("Timesheet Data--->", respData);
        data["chkintype"] = respData[0].project_category_type;
        data["chkinplace"] = respData[0].project_or_comp_name;
        if (data.check_in == null) {
          data.checkin_lat = respData[0].lat;
          data.checkin_lang = respData[0].lang;
          console.log(data, "DATA AFTER---->");
          if (data.checkin_lat && data.checkin_lang) {
            this.showMap = true;
            this.showMapLoader = true;
            const calculatedDistance = this.haversineDistance(
              data.checkin_lat,
              data.checkin_lang,
              data.checkout_lat,
              data.checkout_lang
            );
            let zoom =
              calculatedDistance > 300 && calculatedDistance < 1000 ? 12 : 8;
            let distanceBtw =
              calculatedDistance > 1000
                ? `${(calculatedDistance / 1000).toFixed(2)} km`
                : `${calculatedDistance.toFixed(2)} m`;
            this.mapData = {
              checkinLat: parseFloat(data.checkin_lat),
              checkinLong: parseFloat(data.checkin_lang),
              checkoutLat: parseFloat(data.checkout_lat),
              checkoutLong: parseFloat(data.checkout_lang),
              radius: 300,
              zoom: zoom,
              checkinTitle: "Check-in",
              checkoutTitle: "Check-out",
              distanceBtw: distanceBtw,
              rangeExceed: calculatedDistance > 300,
              forcecheckoutreson: "",
              workLocation: "",
            };
            setTimeout(() => {
              this.showMapLoader = false;
            }, 1000);
          } else {
            this.toastr.error("Checkin Location not found");
          }
        }
      } catch (error) {
        console.error("Error fetching check-in details:", error);
      }

      console.log("datavarible", data.check_in);

      if (
        data.desc === "Location Issue & Failure in Face Recognition" ||
        data.desc === "Failure in Face Recognition"
      ) {
        // Call the Photos API
        let newReqObj = {
          orgID: data.empid,
          id: data.refrence_id,
        };
        console.log("newRqObj--->", newReqObj);

        try {
          const respData: any = await this.timesheetService
            .GetFaceRecDetailsById(newReqObj)
            .toPromise();
          console.log("Photo Data--->", respData);
          if (respData.length > 0) {
            data["imgUrl"] = respData[0].imgUrl;
            data["real_photo"] = respData[0].real_photo;
          }
        } catch (error) {
          console.error("Error fetching face recognition details:", error);
        }
      }
    }

    console.log("data--->", data);

    // Display Modal
    this.showButtonDiv = true;
    this.applyFrcChkInModel = true;
    this.frcckinModalData = data;
    setTimeout(() => {
      this.showMapLoader = false;
    }, 1000);
  }


  updateTotalLeaveDays() {
    console.log('Current employeeLeaveHistory:', this.employeeLeaveHistory);
    this.totalLeaveDayses = this.employeeLeaveHistory.reduce((sum, empData) => {
      const leaveDays = Number(empData.leave_days_applied);
      return sum + (isNaN(leaveDays) ? 0 : leaveDays);
    }, 0);
  }

  getSickLeaveBreakdownWithDays(joiningDateStr: string, id: string) {
    console.log("Profile day", joiningDateStr);
    console.log("Leave Data us here ", this.employeeLeaveHistory);

    // Fetch the leave data from the service
    this.leaveService.GetLeaveRequestedHistoryByOrgIDandEmpID(id).subscribe((data: any) => {
      // Filter the data for approved sick leave
      this.sickleavcal = data.filter((elm: any) => elm.leave_status === "approved" && elm.leave_name == 'Sick Leave');
      console.log("Am here to check the data", this.sickleavcal);
      // Calculate and log the breakdown after the data is fetched
      const breakdown = this.calculateSickLeaveBreakdown(joiningDateStr, this.sickleavcal, this.useAlternativeLogic)
      console.log("Breakdown with total days:", breakdown);



    });
  }

  calculateSickLeaveBreakdown(joiningDateStr: string, sickLeaveData: any[], useAlternativeLogic: boolean): any[] {
    console.log("Joining Date:", joiningDateStr);
    console.log("Sick Leave Data:", sickLeaveData);
    console.log("Use Alternative Logic:", useAlternativeLogic);

    const joiningDate = new Date(joiningDateStr);
    const currentYear = new Date().getFullYear();
    const today = new Date(); // Current date to use in the last period
    today.setHours(0, 0, 0, 0); // Normalize time to avoid issues
    const breakdown = [];

    // Modified helper function to optionally format as DD-MM-YYYY
    const formatDate = (date: Date, useDMY: boolean = false): string => {
        if (useDMY) {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        return date.toLocaleDateString('en-CA');
    };

    // Existing helper function for calculating leave days
    const getTotalSickLeaveAppliedInRange = (leavesData: any[], startDate: Date, endDate: Date): number => {
        return leavesData.reduce((total, leave) => {
            const leaveStart = new Date(leave.leave_start_date);
            const leaveEnd = new Date(leave.leave_end_date);

            if (
                leave.leave_name === 'Sick Leave' &&
                leaveStart >= startDate &&
                leaveEnd <= endDate
            ) {
                total += Number(leave.leave_days_applied) || 0;
            }
            return total;
        }, 0);
    };

    if (!useAlternativeLogic) {
        // Alternative logic - modified to handle current period correctly
        let startDate = new Date(joiningDate);

        while (startDate <= today) {
            const endDate = new Date(startDate);
            endDate.setFullYear(startDate.getFullYear() + 1);

            // For the current period, use today's date instead of next year
            if (endDate > today) {
                endDate.setTime(today.getTime());
            }

            breakdown.push({
                year: startDate.getFullYear(),
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                totalDays: getTotalSickLeaveAppliedInRange(sickLeaveData, startDate, endDate),
            });

            // Move to next period (day after current end date)
            startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() + 1);
        }
    } else {
        // Original logic - modified to format last period correctly
        const joiningYear = joiningDate.getFullYear();

        // Breakdown for the first year
        const endOfJoiningYear = new Date(joiningYear, 11, 31);
        breakdown.push({
            year: joiningYear,
            startDate: formatDate(joiningDate),
            endDate: formatDate(endOfJoiningYear),
            totalDays: getTotalSickLeaveAppliedInRange(sickLeaveData, joiningDate, endOfJoiningYear),
        });

        // Breakdown for subsequent full years
        for (let year = joiningYear + 1; year < currentYear; year++) {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31);
            breakdown.push({
                year,
                startDate: formatDate(startOfYear),
                endDate: formatDate(endOfYear),
                totalDays: getTotalSickLeaveAppliedInRange(sickLeaveData, startOfYear, endOfYear),
            });
        }

        // Current year period (from Jan 1 to today)
        const startOfCurrentYear = new Date(currentYear, 0, 1);
        breakdown.push({
            year: currentYear,
            startDate: formatDate(startOfCurrentYear),
            endDate: formatDate(today, true), // Use DD-MM-YYYY format for last period
            totalDays: getTotalSickLeaveAppliedInRange(sickLeaveData, startOfCurrentYear, today),
        });
    }

    // Modified formatting to handle last period specially
    this.formatSickLeaveDetails = (breakdown: any[]) => {
        return breakdown.map((period, index) => {
            const isLast = index === breakdown.length - 1;
            const endDate = isLast ? period.endDate : formatDate(new Date(period.endDate));
            return `${period.startDate} -- ${endDate}: ${period.totalDays} Days`;
        }).join(',  ');
    };

    this.sickleaveduration = breakdown;
    this.sickLeaveDetails = this.formatSickLeaveDetails(breakdown);
    this.lastsickDuration = this.formatSickLeaveDetails([breakdown[breakdown.length - 1]]);

    console.log('Last Sick Leave Duration:', this.lastsickDuration);
    console.log('Sick Leave Details:', this.sickLeaveDetails);

    return breakdown;
}

  formatSickLeaveDetails(breakdown: any[]): string {
    return breakdown
      .map(
        (item) =>
          `${item.startDate} -- ${item.endDate}: ${item.totalDays} Days`
      )
      .join(',  ');
  }


  formatDateForDisplay(date: string): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-CA', options);
  }


  fetchEmployeeLeaveByEmpID(id, leaveName) {
    let empID = id;
    this.leaveService
      .getEmpLeaveAvailableByOrgId(empID)
      .subscribe((data: any) => {
        this.leavesHistory = data;
        console.log("Data for Checking", data);

        this.openbalancedays = data[0].open_balance_days
        data.map(async (elm) => {
          console.log("leave Name", elm.leave_name);
          console.log("Leave Name From", leaveName);

          if (elm.leave_name == "Annual leave") {
            this.calculateMonthsAndDays(elm.profile_effective_from_date);
            await this.getAnnualleavedetails(elm.leave_profile_setup_id);
          }
          if (elm.leave_name.toLowerCase() === leaveName.toLowerCase()) {
            if (leaveName === "Annual leave") {
              this.assignedLeavesToEmpData = elm;
              var joindate = new Date(elm.profile_effective_from_date);
              var currentDate = new Date();
              var months;
              months =
                (currentDate.getFullYear() - joindate.getFullYear()) * 12;
              months -= joindate.getMonth() + 1;
              months += currentDate.getMonth() + 1;
              months = months * 2.5;
              this.eligibleannualleave = months.toString();
              console.log("Months Calculated", this.eligibleannualleave);
              console.log("Before", this.assignedLeavesToEmpData);
              this.assignedLeavesToEmpData.eligible_leave_days =
                months.toString();
              console.log("After", this.assignedLeavesToEmpData);
            } else if (leaveName === "Sick Leave" || leaveName === "Sick leave") {
              this.calculateMonthsAndDays(elm.profile_effective_from_date);
              this.assignedLeavesToEmpData = elm;
              await this.getSickleaveleavedetails(elm.leave_profile_setup_id);
              this.getSickLeaveBreakdownWithDays(elm.profile_effective_from_date, elm.emp_id)
              console.log("Other Dta", this.assignedLeavesToEmpData);
            }
          }
          this.otherAssignedLeavesToEmpData = data;
          console.log(this.otherAssignedLeavesToEmpData);
        });
        console.log("Leaves Data Type", this.employeeLeaveHistory)
      });


    this.leaveService
      .getEmpLeavePendingByOrgId(empID)
      .subscribe((data: any) => {
        let totalLeaveDays = 0;
        data.forEach((leave: any) => {
          if (leave.leave_name === leaveName) {
            totalLeaveDays += parseFloat(leave.leave_days_applied);
          }
        });
        if (isNaN(totalLeaveDays)) {
          totalLeaveDays = 0;
        }
        this.pendingleaveapp = totalLeaveDays;
        console.log("Pending Leaves", this.pendingleaveapp);

        if (this.leaveData == null) {
          this.leaveData = this.viewEditNotificationModelData;
        }

        this.remaingpending =
          this.pendingleaveapp - this.leaveData.leave_days_applied;
        console.log("Remaining Pending", this.remaingpending);
        this.updateTotalLeaveDays();
        return totalLeaveDays;

      });
  }


  async getSickleaveleavedetails(id) {
    this.leaveService
      .getLeaveProfileSetupByOrgIDandId(id)
      .subscribe((res: any) => {
        this.sickLeaveProfileDetails = res[0].leaveDetails.filter(leave => leave.leave_name === "Sick leave")[0];
        this.useAlternativeLogic = this.sickLeaveProfileDetails.is_full_eoy;

      })
  }

  async getAnnualleavedetails(id) {
    this.leaveService
      .getLeaveProfileSetupByOrgIDandId(id)
      .subscribe((res: any) => {
        this.annualLeaveProfileDetails = res[0].leaveDetails.filter(leave => leave.leave_name === "Annual leave")[0];
        console.log("Am here for the data log",this.annualLeaveProfileDetails);
      })
  }


  calculateMonthsAndDays(startDateString) {
    // Parse the date from "MM/DD/YYYY HH:MM:SS AM/PM" format
    const [datePart, timePart, meridiem] = startDateString.split(' ');
    const [month, day, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    const hour24 = meridiem === 'PM' && hours !== 12 ? hours + 12 : (meridiem === 'AM' && hours === 12 ? 0 : hours);

    const startDate = new Date(year, month - 1, day, hour24, minutes, seconds);
    const currentDate = new Date();

    // Calculate total months difference
    let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
    months += currentDate.getMonth() - startDate.getMonth();

    // Adjust if the day of the current month is before the start date's day
    let days = currentDate.getDate() - startDate.getDate();
    if (days < 0) {
      months -= 1; // Go back one month
      const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      days += previousMonth.getDate(); // Add days in previous month to adjust
    }

    // Format the result as a string
    const resultString = `${months} Months and ${days} Days`;
    this.datecalculator = resultString;
    console.log("date formater ", this.datecalculator);

    return resultString;
  }

  async getEmployeeLeaveHistory(id: string) {
    console.log("Nayite mione",id);

    this.employeeLeaveHistory = []; // Clear previous data if needed
    this.totalsepLeaveDays = 0; // Reset total days

    // Ensure leavesHistory is initialized
    if (!this.leavesHistory) {
      this.leavesHistory = [];
    }

    this.leaveService
      .GetLeaveRequestedHistoryByOrgIDandEmpID(id)
      .subscribe(
        (data: any) => {
          if (!data || data.length === 0) {
            console.warn("No leave history data received.");
            this.spinner.hide();
            return;
          }

          // Filter only approved leaves
          this.employeeLeaveHistory = data.filter((elm: any) => elm.leave_status === "approved");
          this.leavebackup = this.employeeLeaveHistory;

          // Normalize leave names to handle case insensitivity
          const leaveSummaryMap = this.employeeLeaveHistory.reduce((acc: any, curr: any) => {
            const leaveNameNormalized = (curr.leave_name || '').toLowerCase(); // Normalize leave name
            const leaveDays = Number(curr.leave_days_applied) || 0; // Default to 0 if undefined or invalid
            acc[leaveNameNormalized] = (acc[leaveNameNormalized] || 0) + leaveDays; // Accumulate
            return acc;
          }, {});

          console.log("Leave History which I needed", this.leaveHistory);
          console.log("I'm here in employee history", this.employeeLeaveHistory);

          // Update leavesHistory if employeeLeaveHistory has data
          if (this.employeeLeaveHistory.length > 0) {
            for (const leaveName in leaveSummaryMap) {
              const totalDays = leaveSummaryMap[leaveName];
              const existingLeave = this.leavesHistory.find(
                (leave: any) => leave.leave_name.toLowerCase() === leaveName
              );

              if (existingLeave) {
                existingLeave.total_days = totalDays; // Update
              } else {
                this.leavesHistory.push({ leave_name: leaveName, total_days: totalDays }); // Add new
              }
            }
          }

          // Calculate the total sum of leave days
          this.totalsepLeaveDays = this.leavesHistory.reduce((sum, leave) => {
            return sum + (Number(leave.total_days) || 0); // Accumulate total safely
          }, 0);
          console.log(this.notifymodal, "notified value ....")
          // Hide spinner after data processing
          this.spinner.hide();

          // Show the modal only if leavesHistory has valid data
          if (this.leavesHistory.length > 0 && this.totalsepLeaveDays >= 0) {

            if (!this.notifymodal) {
              $("#leave_apply_modul").modal("show");
            }
          }

          // Log outputs for verification
          console.log("Updated Leaves History", this.leavesHistory);
          console.log("Total Sum of Leave Days", this.totalsepLeaveDays);
        },
        (error) => {
          // Hide spinner in case of error
          this.spinner.hide();
          console.error("Error fetching leave history", error);
        }
      );
  }



filterLeaves(leave_name: string): void {
  // Update the selected leave type
  this.selectedLeaveType = leave_name;

  // Normalize the leave_name for case-insensitive comparison
  const normalizedLeaveName = leave_name.toLowerCase();

  if (leave_name !== 'all') {
    // Filter based on the normalized leave name
    this.leavebackup = this.employeeLeaveHistory.filter(leave =>
      (leave.leave_name || '').toLowerCase() === normalizedLeaveName
    );
  } else {
    // If 'all' is selected, copy all data
    this.leavebackup = JSON.parse(JSON.stringify(this.employeeLeaveHistory));
  }

  console.log("Filtered leave data:", this.leavebackup);
}






  getEmployeeRole(roleID1, roleID2) {
    let postData = { id: roleID1 };
    this.AdminSettingService.FindEmpByRoleId(postData).subscribe(
      (data: any) => {
        this.leaveData["approver1_Emp_Name"] = data.first_name;
        let postData2 = { id: data.id };
        this.empService.getByEmployeeID(postData2).subscribe((data2: any) => {
          this.leaveData["approver1_Role_Name"] = data2.role_name;
          if (roleID2 !== null) {
            let postData3 = { id: roleID2 };
            this.AdminSettingService.FindEmpByRoleId(postData3).subscribe(
              (data3: any) => {
                this.leaveData["approver2_Emp_Name"] = data3.first_name;
                let postData4 = { id: data3.id };
                this.empService
                  .getByEmployeeID(postData4)
                  .subscribe((data4: any) => {
                    this.leaveData["approver2_Role_Name"] = data4.role_name;
                    if (
                      this.leaveData.approver2_Role_Name === "Account Owner" &&
                      this.leaveData.is_approved_empId2 &&
                      !this.leaveData.is_approved_empId1
                    ) {
                      this.showOwnerMessage = true;
                      this.showLeaveFunBtn = false;
                    }
                  });
              }
            );
          }
        });
      }
    );
  }

  showleave() {
    if (this.showleavestatus == false) {
      this.showleavestatus = true;
    } else if (this.showleavestatus == true) {
      this.showleavestatus = false;
    }
  }

  approveNotificationLeave(approveData) {
    //console.log(approveData);
    Swal.fire({
      title: "Approve this Leave Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        let postData = {
          id: approveData.id,
          org_id: approveData.org_id,
          emp_id: approveData.emp_id,
          leave_profile_setup_id: approveData.leave_profile_setup_id,
          leave_start_date: approveData.leave_start_date,
          leave_end_date: approveData.leave_end_date,
          leave_days_applied: approveData.leave_days_applied,
          ondate_applied: approveData.ondate_applied,
          onbehalf_applied: approveData.onbehalf_applied,
          emp_notes: approveData.emp_notes,
          approver1_roleId: approveData.approver1_roleId,
          approver2_roleId: approveData.approver2_roleId,
          approver1_empId: approveData.approver1_empId,
          approver2_empId: approveData.approver2_empId,
          approver1_notes: approveData.approver1_notes,
          approver2_notes: approveData.approver2_notes,
          created_date: approveData.created_date,
          created_by_empId: approveData.created_by_empId,
          modified_date: approveData.modified_date,
          modified_by_empId: this.userInfoLocal.id,
          leave_status: approveData.leave_status,
          is_approved_empId1: approveData.is_approved_empId1,
          is_approved_empId2: approveData.is_approved_empId1,
        };

        if (
          this.userInfoLocal.role_id === approveData.approver2_roleId &&
          approveData.approver2_Role_Name === "Account Owner"
        ) {
          //Super Approver
          postData["leave_status"] = "approved";
          postData["is_approved_empId2"] = true;
        } else {
          //Single Approver
          if (
            approveData.approver1_roleId != null &&
            approveData.approver2_roleId == null
          ) {
            postData["leave_status"] = "approved";
            postData["is_approved_empId1"] = true;
          }
          //Dual Approver
          if (
            approveData.approver1_roleId != null &&
            approveData.approver2_roleId != null
          ) {
            if (this.userInfoLocal.role_id == approveData.approver1_roleId) {
              postData["leave_status"] = "pending";
              postData["is_approved_empId1"] = true;
            } else if (
              this.userInfoLocal.role_id == approveData.approver2_roleId
            ) {
              postData["leave_status"] = "approved";
              postData["is_approved_empId2"] = true;
            }
          }
        }
        //console.log(postData)
        this.AdminSettingService.UpdateLeaveRequestedHistoryByID(
          postData
        ).subscribe((data: any) => {
          this.spinner.hide();
          if (data.status === "200") {
            this.successToast(data.desc);
            this.closeApproverLeaveFormModel();
            this.intraypending();
          } else {
            this.failerToast();
            this.closeApproverLeaveFormModel();
          }
          console.log(this);

          this.selfRequestHistory(this.filterhistory.itemData.text);
          this.getAllNotificationForOrg();
        });
      }
    });
  }

  declineNotificationLeave(approveData) {
    $("#leave_apply_modul").modal("hide");

    //console.log(approveData)
    Swal.fire({
      title: "Decline this Leave Request",
      input: "text",
      inputPlaceholder: "Reason for decline",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage("Please enter a valid reason");
          return false; // Returning false prevents the modal from closing
        }
        return reason;
      },
    }).then((result) => {
      if (result.value) {
        // Check if the user provided a value
        const reason = result.value;
        console.log("Inside confirmation block");
        console.log("Reason:", reason);

        let postData = {
          id: approveData.id,
          org_id: approveData.org_id,
          emp_id: approveData.emp_id,
          leave_profile_setup_id: approveData.leave_profile_setup_id,
          leave_start_date: approveData.leave_start_date,
          leave_end_date: approveData.leave_end_date,
          leave_days_applied: approveData.leave_days_applied,
          ondate_applied: approveData.ondate_applied,
          onbehalf_applied: approveData.onbehalf_applied,
          emp_notes: approveData.emp_notes,
          approver1_roleId: approveData.approver1_roleId,
          approver2_roleId: approveData.approver2_roleId,
          approver1_empId: approveData.approver1_empId,
          approver2_empId: approveData.approver2_empId,
          approver1_notes: approveData.approver1_notes,
          approver2_notes: approveData.approver2_notes,
          created_date: approveData.created_date,
          created_by_empId: approveData.created_by_empId,
          modified_date: approveData.modified_date,
          modified_by_empId: this.userInfoLocal.id,
          leave_status: approveData.leave_status,
          is_approved_empId1: approveData.is_approved_empId1,
          is_approved_empId2: approveData.is_approved_empId1,
          decline_reason: reason, // Add the reason_for_decline property
        };

        if (
          this.userInfoLocal.role_id === approveData.approver2_roleId &&
          approveData.approver2_Role_Name === "Account Owner"
        ) {
          // Super Approver
          postData["leave_status"] = "declined";
          postData["is_approved_empId2"] = false;
        } else {
          // Single Approver
          if (
            approveData.approver1_roleId != null &&
            approveData.approver2_roleId == null
          ) {
            postData["leave_status"] = "declined";
            postData["is_approved_empId1"] = false;
          }
          // Dual Approver
          if (
            approveData.approver1_roleId != null &&
            approveData.approver2_roleId != null
          ) {
            if (this.userInfoLocal.role_id == approveData.approver1_roleId) {
              postData["leave_status"] = "declined";
              postData["is_approved_empId1"] = false;
            } else if (
              this.userInfoLocal.role_id == approveData.approver2_roleId
            ) {
              postData["leave_status"] = "declined";
              postData["is_approved_empId2"] = false;
            }
          }
        }

        this.AdminSettingService.UpdateLeaveRequestedHistoryByID(
          postData
        ).subscribe((data: any) => {
          this.spinner.hide();
          if (data.status === "200") {
            this.successToast(data.desc);
            this.closeApproverLeaveFormModel();
          } else {
            this.failerToast();
            this.closeApproverLeaveFormModel();
          }
          this.selfRequestHistory("All");
          this.getAllNotificationForOrg();
        });
      }
    });
  }

  closeApproverLeaveFormModel() {
    $("#leave_apply_modul").modal("hide");
    this.showOwnerMessage = false;
    this.showLeaveFunBtn = false;
  }

  //approve leave from the list

  //leave Approver function starts

  callLeaveModelProcess() {
    console.log(this.viewEditNotificationModelData);
    this.getEmployeeRole2(
      this.viewEditNotificationModelData.approver1_roleId,
      this.viewEditNotificationModelData.approver2_roleId
    );
    if (
      this.viewEditNotificationModelData.approver1_roleId ===
      this.userInfoLocal.role_id
    ) {
      if (
        this.viewEditNotificationModelData.approver1_roleId ===
        this.userInfoLocal.role_id &&
        this.viewEditNotificationModelData.is_approved_empId1
      ) {
        this.showLeaveFunBtn = false;
      } else {
        this.showLeaveFunBtn = true;
      }
    }

    if (
      this.viewEditNotificationModelData.approver2_roleId ===
      this.userInfoLocal.role_id
    ) {
      if (
        this.viewEditNotificationModelData.approver2_roleId ===
        this.userInfoLocal.role_id &&
        this.viewEditNotificationModelData.is_approved_empId2
      ) {
        this.showLeaveFunBtn = false;
      } else {
        if (
          this.viewEditNotificationModelData.approver2_roleId ===
          this.userInfoLocal.role_id &&
          !this.viewEditNotificationModelData.is_approved_empId2 &&
          this.viewEditNotificationModelData.leave_status === "declined"
        ) {
          this.showLeaveFunBtn = false;
        } else {
          this.showLeaveFunBtn = true;
        }
      }
    }

    if (
      this.viewEditNotificationModelData.leave_status === "pending" &&
      this.viewEditNotificationModelData.is_approved_empId1
    ) {
      this.viewEditNotificationModelData["approval1_status"] = "approved";
    } else if (
      this.viewEditNotificationModelData.leave_status === "pending" &&
      !this.viewEditNotificationModelData.is_approved_empId1
    ) {
      this.viewEditNotificationModelData["approval1_status"] = "pending";
    } else if (
      this.viewEditNotificationModelData.leave_status === "declined" &&
      this.viewEditNotificationModelData.is_approved_empId1
    ) {
      this.viewEditNotificationModelData["approval1_status"] = "approved";
    } else if (
      this.viewEditNotificationModelData.leave_status === "declined" &&
      !this.viewEditNotificationModelData.is_approved_empId1
    ) {
      this.viewEditNotificationModelData["approval1_status"] = "declined";
    } else if (
      this.viewEditNotificationModelData.leave_status === "approved" &&
      this.viewEditNotificationModelData.is_approved_empId1
    ) {
      this.viewEditNotificationModelData["approval1_status"] = "approved";
    } else if (
      this.viewEditNotificationModelData.leave_status === "approved" &&
      !this.viewEditNotificationModelData.is_approved_empId1
    ) {
      this.viewEditNotificationModelData["approval1_status"] = "pending";
    }

    if (this.viewEditNotificationModelData.approver2_roleId !== null) {
      if (
        this.viewEditNotificationModelData.leave_status === "pending" &&
        this.viewEditNotificationModelData.is_approved_empId2
      ) {
        this.viewEditNotificationModelData["approval2_status"] = "approved";
      } else if (
        this.viewEditNotificationModelData.leave_status === "pending" &&
        !this.viewEditNotificationModelData.is_approved_empId2
      ) {
        this.viewEditNotificationModelData["approval2_status"] = "pending";
      } else if (
        this.viewEditNotificationModelData.leave_status === "declined" &&
        this.viewEditNotificationModelData.is_approved_empId2
      ) {
        this.viewEditNotificationModelData["approval2_status"] = "approved";
      } else if (
        this.viewEditNotificationModelData.leave_status === "declined" &&
        !this.viewEditNotificationModelData.is_approved_empId2
      ) {
        this.viewEditNotificationModelData["approval2_status"] = "declined";
      } else if (
        this.viewEditNotificationModelData.leave_status === "approved" &&
        this.viewEditNotificationModelData.is_approved_empId2
      ) {
        this.viewEditNotificationModelData["approval2_status"] = "approved";
      } else if (
        this.viewEditNotificationModelData.leave_status === "approved" &&
        !this.viewEditNotificationModelData.is_approved_empId2
      ) {
        this.viewEditNotificationModelData["approval2_status"] = "pending";
      }
    }
  }

  getEmployeeRole2(roleID1, roleID2) {
    let postData = { id: roleID1 };
    this.AdminSettingService.FindEmpByRoleId(postData).subscribe(
      (data: any) => {
        this.viewEditNotificationModelData["approver1_Emp_Name"] =
          data.first_name;
        let postData2 = { id: data.id };
        this.empService.getByEmployeeID(postData2).subscribe((data2: any) => {
          this.viewEditNotificationModelData["approver1_Role_Name"] =
            data2.role_name;
          if (roleID2 !== null) {
            let postData3 = { id: roleID2 };
            this.AdminSettingService.FindEmpByRoleId(postData3).subscribe(
              (data3: any) => {
                this.viewEditNotificationModelData["approver2_Emp_Name"] =
                  data3.first_name;
                let postData4 = { id: data3.id };
                this.empService
                  .getByEmployeeID(postData4)
                  .subscribe((data4: any) => {
                    this.viewEditNotificationModelData["approver2_Role_Name"] =
                      data4.role_name;
                    if (
                      this.viewEditNotificationModelData.approver2_Role_Name ===
                      "Account Owner" &&
                      this.viewEditNotificationModelData.is_approved_empId2 &&
                      !this.viewEditNotificationModelData.is_approved_empId1
                    ) {
                      this.showOwnerMessage = true;
                      this.showLeaveFunBtn = false;
                    }
                  });
              }
            );
          }
        });
      }
    );
  }

  approveNotification(approveData) {
    Swal.fire({
      title: "Approve this Leave Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        let notRead = {
          id: this.originalViewEditNotificationModelData.id,
          org_id: this.originalViewEditNotificationModelData.org_id,
          from_id: this.originalViewEditNotificationModelData.from_id,
          to_id: this.originalViewEditNotificationModelData.to_id,
          reference_id: this.originalViewEditNotificationModelData.reference_id,
          read_status: true,
          created_date: this.originalViewEditNotificationModelData.created_date,
          created_by_empId:
            this.originalViewEditNotificationModelData.created_by_empId,
          created_by_name:
            this.originalViewEditNotificationModelData.created_by_name,
          modified_by_empId:
            this.originalViewEditNotificationModelData.modified_by_empId,
          message: this.originalViewEditNotificationModelData.message,
        };

        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
          notRead
        ).subscribe((data: any) => {
          console.log(data);
          if (data.status === "200") {
            let postData = {
              id: approveData.id,
              org_id: approveData.org_id,
              emp_id: approveData.emp_id,
              leave_profile_setup_id: approveData.leave_profile_setup_id,
              leave_start_date: approveData.leave_start_date,
              leave_end_date: approveData.leave_end_date,
              leave_days_applied: approveData.leave_days_applied,
              ondate_applied: approveData.ondate_applied,
              onbehalf_applied: approveData.onbehalf_applied,
              emp_notes: approveData.emp_notes,
              approver1_roleId: approveData.approver1_roleId,
              approver2_roleId: approveData.approver2_roleId,
              approver1_empId: approveData.approver1_empId,
              approver2_empId: approveData.approver2_empId,
              approver1_notes: approveData.approver1_notes,
              approver2_notes: approveData.approver2_notes,
              created_date: approveData.created_date,
              created_by_empId: approveData.created_by_empId,
              modified_date: approveData.modified_date,
              modified_by_empId: this.userInfoLocal.id,
              leave_status: approveData.leave_status,
              is_approved_empId1: approveData.is_approved_empId1,
              is_approved_empId2: approveData.is_approved_empId1,
            };

            if (
              this.userInfoLocal.role_id === approveData.approver2_roleId &&
              approveData.approver2_Role_Name === "Account Owner"
            ) {
              //Super Approver
              postData["leave_status"] = "approved";
              postData["is_approved_empId2"] = true;
            } else {
              //Single Approver
              if (
                approveData.approver1_roleId != null &&
                approveData.approver2_roleId == null
              ) {
                postData["leave_status"] = "approved";
                postData["is_approved_empId1"] = true;
              }
              //Dual Approver
              if (
                approveData.approver1_roleId != null &&
                approveData.approver2_roleId != null
              ) {
                if (
                  this.userInfoLocal.role_id == approveData.approver1_roleId
                ) {
                  postData["leave_status"] = "pending";
                  postData["is_approved_empId1"] = true;
                } else if (
                  this.userInfoLocal.role_id == approveData.approver2_roleId
                ) {
                  postData["leave_status"] = "approved";
                  postData["is_approved_empId2"] = true;
                }
              }
            }

            this.AdminSettingService.UpdateLeaveRequestedHistoryByID(
              postData
            ).subscribe((data: any) => {
              this.spinner.hide();
              if (data.status === "200") {
                this.successToast(data.desc);
                this.closeLeaveModelNot();
              } else {
                this.failerToast();
                this.closeLeaveModelNot();
              }
              //this.selfRequestHistory("All");
              this.getAllNotificationForOrg();
            });
          }
        });
      }
    });
  }

  approvalFRC() {
    Swal.fire({
      title: "Approve this Force Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value == true) {
        this.spinner.show();
        let postData = {
          id: this.frcckinModalData.id,
          org_id: this.frcckinModalData.org_id,
          refrence_id: this.frcckinModalData.refrence_id,
          type: this.frcckinModalData.type,
          empid: this.frcckinModalData.empid,
          ondate: this.frcckinModalData.ondate,
          timesheet_id: this.frcckinModalData.timesheet_id,
          checkin_lat: this.frcckinModalData.checkin_lat,
          checkin_lang: this.frcckinModalData.checkin_lang,
          check_out: this.frcckinModalData.check_out,
          checkout_lat: this.frcckinModalData.checkout_lat,
          checkout_lang: this.frcckinModalData.checkout_lang,
          levelone_roleId: this.frcckinModalData.levelone_roleId,
          isapproved_levelone: true,
          leveltwo_roleId: this.frcckinModalData.leveltwo_roleId,
          isapproved_leveltwo: this.frcckinModalData.isapproved_leveltwo,
          reason_name: this.frcckinModalData.reason_name,
          status: "approved",
          created_date: this.frcckinModalData.created_date,
          createdby: this.frcckinModalData.createdby,
          modified_date: moment(new Date())
            .utc(true)
            .format("DD/MM/YYYY hh:mm a"),
          modifiedby: this.userInfoLocal.id,
          is_deleted: false,
          is_app_check_In: this.frcckinModalData.is_app_check_In,
          check_in: this.frcckinModalData.check_in,
        };
        console.log("PostData", postData);
        this.AdminSettingService.UpdateForceCheckInRequest(postData).subscribe(
          (data: any) => {
            this.spinner.hide();
            if (data.status === "200") {
              this.spinner.show();
              let user_info = JSON.parse(localStorage.getItem("user_info"));
              let postData = {
                orgID:
                  user_info.org_id !== null
                    ? user_info.org_id
                    : localStorage.getItem("org_id"),
                fromDate: moment(this.aoMonthStart).format("L"),
                toDate: moment(this.aoMonthEnd).format("L"),
              };
              console.log(postData);
              this.timesheetService
                .GetForceCheckinRequestByOrgId(postData)
                .subscribe((data: any) => {
                  console.log("data--->", data);
                  if (data.length > 0) {
                    var results = [];

                    data.map((el) => {
                      el.createdDate = moment(el.createdDate).format("L");
                      // el.ondate = moment(el.ondate).format('L');

                      // console.log("el-->",el);

                      if (
                        el.reason_name ===
                        "Location Failureface Recogonisation Issue"
                      ) {
                        el["desc"] =
                          "Location Issue & Failure in Face Recognition";
                      } else if (
                        el.reason_name === "undefinedface Recogonisation Issue"
                      ) {
                        el["desc"] = "Failure in Face Recognition";
                      } else {
                        el["desc"] = el.reason_name;
                      }

                      results.push(el);
                      this.spinner.hide();
                    });

                    this.appFrcAttOverHistoryData = results;
                  } else {
                    this.appFrcAttOverHistoryData = [];
                    this.spinner.hide();
                  }
                });
              this.successToast(data.desc);
              this.applyFrcChkInModel = false;
              console.log("Updated");
            } else {
              this.failerToast();
              this.applyFrcChkInModel = false;

              this.spinner.hide();

              console.log(" Not Updated");
            }
          }
        );
      }
      this.spinner.hide();
      $("#notificationModal").modal("hide");
      this.leaveCanModel = false;
    });
  }

  disapprovalFRC() {
    Swal.fire({
      title: "DisApprove this Force Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value == true) {
        this.spinner.show();
        let postData = {
          id: this.frcckinModalData.id,
          org_id: this.frcckinModalData.org_id,
          refrence_id: this.frcckinModalData.refrence_id,
          type: this.frcckinModalData.type,
          empid: this.frcckinModalData.empid,
          ondate: this.frcckinModalData.ondate,
          timesheet_id: this.frcckinModalData.timesheet_id,
          checkin_lat: this.frcckinModalData.checkin_lat,
          checkin_lang: this.frcckinModalData.checkin_lang,
          check_out: this.frcckinModalData.check_out,
          checkout_lat: this.frcckinModalData.checkout_lat,
          checkout_lang: this.frcckinModalData.checkout_lang,
          levelone_roleId: this.frcckinModalData.levelone_roleId,
          isapproved_levelone: true,
          leveltwo_roleId: this.frcckinModalData.leveltwo_roleId,
          isapproved_leveltwo: this.frcckinModalData.isapproved_leveltwo,
          reason_name: this.frcckinModalData.reason_name,
          status: "declined",
          created_date: this.frcckinModalData.created_date,
          createdby: this.frcckinModalData.createdby,
          modified_date: moment(new Date())
            .utc(true)
            .format("DD/MM/YYYY hh:mm a"),
          modifiedby: this.userInfoLocal.id,
          is_deleted: false,
          is_app_check_In: this.frcckinModalData.is_app_check_In,
          check_in: this.frcckinModalData.check_in,
        };
        console.log("PostData", postData);
        this.AdminSettingService.UpdateForceCheckInRequest(postData).subscribe(
          (data: any) => {
            this.spinner.hide();
            if (data.status === "200") {
              this.spinner.show();
              let user_info = JSON.parse(localStorage.getItem("user_info"));
              let postData = {
                orgID:
                  user_info.org_id !== null
                    ? user_info.org_id
                    : localStorage.getItem("org_id"),
                fromDate: moment(this.aoMonthStart).format("L"),
                toDate: moment(this.aoMonthEnd).format("L"),
              };
              console.log(postData);
              this.timesheetService
                .GetForceCheckinRequestByOrgId(postData)
                .subscribe((data: any) => {
                  console.log("data--->", data);
                  if (data.length > 0) {
                    var results = [];

                    data.map((el) => {
                      el.createdDate = moment(el.createdDate).format("L");
                      // el.ondate = moment(el.ondate).format('L');

                      // console.log("el-->",el);

                      if (
                        el.reason_name ===
                        "Location Failureface Recogonisation Issue"
                      ) {
                        el["desc"] =
                          "Location Issue & Failure in Face Recognition";
                      } else if (
                        el.reason_name === "undefinedface Recogonisation Issue"
                      ) {
                        el["desc"] = "Failure in Face Recognition";
                      } else {
                        el["desc"] = el.reason_name;
                      }

                      results.push(el);
                      this.spinner.hide();
                    });

                    this.appFrcAttOverHistoryData = results;
                  } else {
                    this.appFrcAttOverHistoryData = [];
                    this.spinner.hide();
                  }
                });
              this.successToast(data.desc);
              this.applyFrcChkInModel = false;
              console.log("Updated");
            } else {
              this.failerToast();
              this.applyFrcChkInModel = false;

              this.spinner.hide();

              console.log(" Not Updated");
            }
          }
        );
      }
      this.spinner.hide();
      $("#notificationModal").modal("hide");
      this.leaveCanModel = false;
    });
  }

  getEmployeeOnRoleID(roleID) {
    //console.log(roleID)
    let userInfo: any = JSON.parse(localStorage.getItem("user_info"));
    let req = {
      id: localStorage.getItem("org_id"),
    };
    let empArry = [];
    this.leaveService.GetEmpListWithRolesByOrgID(req).subscribe((data: any) => {
      //console.log(data);
      data.map((elm) => {
        if (elm.EmployeeRole.length !== 0) {
          elm.EmployeeRole.map((role) => {
            if (role.id === roleID) {
              empArry.push(elm.id);
            }
          });
        }
      });
      let isUserPresent = _.includes(empArry, userInfo.id);
      this.isApproverTwo = isUserPresent;
    });
  }

  declineNotification(approveData) {
      $("#notificationModal").modal("hide");

    Swal.fire({
      title: "Decline this Leave Request",
      input: "text",
      inputPlaceholder: "Reason for decline",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage("Please enter a valid reason");
          return false; // Returning false prevents the modal from closing
        }
        return reason;
      }
    }).then((result) => {
      if (result.value) {
        const reason = result.value;
        this.spinner.show();
        let notRead = {
          id: this.originalViewEditNotificationModelData.id,
          org_id: this.originalViewEditNotificationModelData.org_id,
          from_id: this.originalViewEditNotificationModelData.from_id,
          to_id: this.originalViewEditNotificationModelData.to_id,
          reference_id: this.originalViewEditNotificationModelData.reference_id,
          read_status: true,
          created_date: this.originalViewEditNotificationModelData.created_date,
          created_by_empId:
            this.originalViewEditNotificationModelData.created_by_empId,
          created_by_name:
            this.originalViewEditNotificationModelData.created_by_name,
          modified_by_empId:
            this.originalViewEditNotificationModelData.modified_by_empId,
          message: this.originalViewEditNotificationModelData.message,
        };
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
          notRead
        ).subscribe((data: any) => {
          if (data.status === "200") {
            let postData = {
              id: approveData.id,
              org_id: approveData.org_id,
              emp_id: approveData.emp_id,
              leave_profile_setup_id: approveData.leave_profile_setup_id,
              leave_start_date: approveData.leave_start_date,
              leave_end_date: approveData.leave_end_date,
              leave_days_applied: approveData.leave_days_applied,
              ondate_applied: approveData.ondate_applied,
              onbehalf_applied: approveData.onbehalf_applied,
              emp_notes: approveData.emp_notes,
              approver1_roleId: approveData.approver1_roleId,
              approver2_roleId: approveData.approver2_roleId,
              approver1_empId: approveData.approver1_empId,
              approver2_empId: approveData.approver2_empId,
              approver1_notes: approveData.approver1_notes,
              approver2_notes: approveData.approver2_notes,
              created_date: approveData.created_date,
              created_by_empId: approveData.created_by_empId,
              modified_date: approveData.modified_date,
              modified_by_empId: this.userInfoLocal.id,
              leave_status: approveData.leave_status,
              is_approved_empId1: approveData.is_approved_empId1,
              is_approved_empId2: approveData.is_approved_empId1,
              decline_reason:reason,
            };

            if (
              this.userInfoLocal.role_id === approveData.approver2_roleId &&
              approveData.approver2_Role_Name === "Account Owner"
            ) {
              //Super Approver
              postData["leave_status"] = "declined";
              postData["is_approved_empId2"] = false;
            } else {
              //Single Approver
              if (
                approveData.approver1_roleId != null &&
                approveData.approver2_roleId == null
              ) {
                postData["leave_status"] = "declined";
                postData["is_approved_empId1"] = false;
              }
              //Dual Approver
              if (
                approveData.approver1_roleId != null &&
                approveData.approver2_roleId != null
              ) {
                if (
                  this.userInfoLocal.role_id == approveData.approver1_roleId
                ) {
                  postData["leave_status"] = "declined";
                  postData["is_approved_empId1"] = false;
                } else if (
                  this.userInfoLocal.role_id == approveData.approver2_roleId
                ) {
                  postData["leave_status"] = "declined";
                  postData["is_approved_empId2"] = false;
                }
              }
            }

            this.AdminSettingService.UpdateLeaveRequestedHistoryByID(
              postData
            ).subscribe((data: any) => {
              this.spinner.hide();
              if (data.status === "200") {
                this.successToast(data.desc);
                this.closeLeaveModelNot();
              } else {
                this.failerToast();
                this.closeLeaveModelNot();
              }
              this.selfRequestHistory("All");
              this.getAllNotificationForOrg();
            });
          }
        });
      }
    });
  }

  closeLeaveModelNot() {
    this.notifymodal = false;
    this.showLeaveFunBtn = false;
    this.showOwnerMessage = false;
    this.isApprov2View = false;
    this.viewEditNotificationModelData = "";
    this.frcckinModalData = "";
    this.applyLeaveModel = false;
    this.applyOverwriteModel = false;
    this.applyFrcChkInModel = false;
    $("#notificationModal").modal("hide");
  }
  //leave Approver function ends

  //owerwrite function start
  approveOwerwrite(approveData) {
    console.log(approveData);
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    Swal.fire({
      title: "Approve this Overwrite Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();

        // Check if coming from notification (originalViewEditNotificationModelData will have data)
        if (this.originalViewEditNotificationModelData) {
          // Handle notification flow
          let notRead = {
            id: this.originalViewEditNotificationModelData.id,
            org_id: this.originalViewEditNotificationModelData.org_id,
            from_id: this.originalViewEditNotificationModelData.from_id,
            to_id: this.originalViewEditNotificationModelData.to_id,
            reference_id: this.originalViewEditNotificationModelData.reference_id,
            read_status: true,
            created_date: this.originalViewEditNotificationModelData.created_date,
            created_by_empId: this.originalViewEditNotificationModelData.created_by_empId,
            created_by_name: this.originalViewEditNotificationModelData.created_by_name,
            modified_by_empId: this.originalViewEditNotificationModelData.modified_by_empId,
            message: this.originalViewEditNotificationModelData.message,
          };

          console.log("If Statement on the orginal",notRead);

          this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(notRead)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.processApproval(approveData.id);
              }
            });
        } else {
          this.originalViewEditNotificationModelData=''
          // Direct approval flow - skip notification update
          this.originalViewEditNotificationModelData= this.overwritemodaldata
          console.log("OverwriteModaldata",this.overwritemodaldata);

          let notRead = {
            reference_id: this.overwritemodaldata.override_id,
            created_by_empId:this.overwritemodaldata.employee_id,
            read_status: true,
            modified_by_empId:user_info.id,
            is_modified:true
          };
          console.log("Data for the API",notRead);
          console.log("User Info",user_info);


          this.AdminSettingService.UpdateAttendanceRelatedNotificationsByID(notRead)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.processApproval(approveData.id);
              }
            });
          // this.processApproval(approveData.id);
        }
      }
    });
  }

  // Helper method to process the approval
  private processApproval(timesheetID: string) {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      timesheetID: timesheetID,
      approverID: user_info["id"],
    };

    console.log("postData", postData);
    this.leaveService.ApproveByCheckinOverwriteIDAndApproverID(postData)
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == "200") {
            this.spinner.hide();
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
            this.closeviewEditNotificationModel();
            this.getAllNotificationForOrg();
            this.getAttendanceOverRequestHist(
              this.aoMonthStart,
              this.aoMonthEnd
            );
          } else {
            this.failerToast();
            this.closeviewEditNotificationModel();
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire("Error!", error, "error");
        }
      );
  }

  declineOwerwrite(approveData) {
    $("#notificationModal").modal("hide");
    this.applyOverwriteModel=false;
    console.log(approveData);
    Swal.fire({
      title: "Decline this Overwrite Request",
      input: "text",
      inputPlaceholder: "Reason for decline",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage("Please enter a valid reason");
          return false; // Returning false prevents the modal from closing
        }
        return reason;
      }
    }).then((result) => {
      if (result.value) {
      const reason = result.value;
        this.spinner.show();

        // Check if coming from notification (originalViewEditNotificationModelData will have data)
        if (this.originalViewEditNotificationModelData) {
          // Handle notification flow
          let notRead = {
            id: this.originalViewEditNotificationModelData.id,
            org_id: this.originalViewEditNotificationModelData.org_id,
            from_id: this.originalViewEditNotificationModelData.from_id,
            to_id: this.originalViewEditNotificationModelData.to_id,
            reference_id: this.originalViewEditNotificationModelData.reference_id,
            read_status: true,
            created_date: this.originalViewEditNotificationModelData.created_date,
            created_by_empId: this.originalViewEditNotificationModelData.created_by_empId,
            created_by_name: this.originalViewEditNotificationModelData.created_by_name,
            modified_by_empId: this.originalViewEditNotificationModelData.modified_by_empId,
            message: this.originalViewEditNotificationModelData.message,
          };
          this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(notRead)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.processDecline(approveData.id,reason);
              }
            });
        } else {
          // Direct approval flow - skip notification update
          this.originalViewEditNotificationModelData= this.overwritemodaldata
          let notRead = {
            id: this.originalViewEditNotificationModelData.id,
            org_id: this.originalViewEditNotificationModelData.org_id,
            from_id: this.originalViewEditNotificationModelData.from_id,
            to_id: this.originalViewEditNotificationModelData.to_id,
            reference_id: this.originalViewEditNotificationModelData.reference_id,
            read_status: true,
            created_date: this.originalViewEditNotificationModelData.created_date,
            created_by_empId: this.originalViewEditNotificationModelData.created_by_empId,
            created_by_name: this.originalViewEditNotificationModelData.created_by_name,
            modified_by_empId: this.originalViewEditNotificationModelData.modified_by_empId,
            message: this.originalViewEditNotificationModelData.message,
          };
          this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(notRead)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.processDecline(approveData.id,reason);
              }
            });
          // this.processApproval(approveData.id);
        }
      }
    });
  }

  private processDecline(timesheetID: string,reason) {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      timesheetID: timesheetID,
      approverID: user_info["id"],
      decline_reason:reason
    };

    console.log("postData", postData);
    this.leaveService.DeclineByTimesheetIDAndApproverID(postData)
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == "200") {
            this.spinner.hide();
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
            this.closeviewEditNotificationModel();
            this.getAllNotificationForOrg();
            this.getAttendanceOverRequestHist(
              this.aoMonthStart,
              this.aoMonthEnd
            );
          } else {
            this.failerToast();
            this.closeviewEditNotificationModel();
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire("Error!", error, "error");
        }
      );
  }

  //owerwrite function ends

  //leave profile function start
  approveLeaveProfile(approveData) {
    Swal.fire({
      title: "Approve this Profile ?",
      text: "Please Note this profile will be added for the organization",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        let postData = {
          id: this.originalViewEditNotificationModelData.id,
          org_id: this.originalViewEditNotificationModelData.org_id,
          from_id: this.originalViewEditNotificationModelData.from_id,
          to_id: this.originalViewEditNotificationModelData.to_id,
          reference_id: this.originalViewEditNotificationModelData.reference_id,
          read_status: false,
          created_date: this.originalViewEditNotificationModelData.created_date,
          created_by_empId:
            this.originalViewEditNotificationModelData.created_by_empId,
          created_by_name:
            this.originalViewEditNotificationModelData.createdEmpName,
          modified_by_empId:
            this.originalViewEditNotificationModelData.modified_by_empId,
          message: this.originalViewEditNotificationModelData.message,
        };
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
          postData
        ).subscribe((data: any) => {
          console.log(data);
          let processData;
          let finalData = [];
          if (data.status === "200") {
            approveData.leaveDetails.map((elm) => {
              processData = {
                id: elm.id,
                org_id: elm.org_id,
                leave_profile_name: elm.leave_profile_name,
                leave_name: elm.leave_name,
                leave_type: elm.leave_type,
                entitled_leave_days: elm.entitled_leave_days,
                created_date: elm.created_date,
                carry_forward_days: elm.carry_forward_days,
                is_calendar_days: elm.is_calendar_days,
                created_by_empId: elm.created_by_empId,
                modified_by_empId: elm.modified_by_empId,
                is_dual_approval: elm.is_dual_approval,
                approver1_roleId: elm.approver1_roleId,
                approver2_roleId: elm.approver2_roleId,
                is_super_admin: false,
              };

              //Check Single Approver and Dual Approver and Assign Approvers
              let userData = JSON.parse(localStorage.getItem("user_info"));
              if (
                elm.approver1_roleId != null &&
                elm.approver2_roleId == null &&
                elm.approver1_roleId == userData.role_id
              ) {
                //Single Approver Setup
                processData["is_approved_roleId1"] = true;
                processData["is_approved"] = true;
              } else if (
                elm.approver1_roleId != null &&
                elm.approver2_roleId != null &&
                elm.approver1_roleId == userData.role_id
              ) {
                //If Dual Approvers and the current user is the approver1
                processData["is_approved_roleId1"] = true;
                processData["is_approved_roleId2"] = false;
              } else if (
                elm.approver1_roleId != null &&
                elm.approver2_roleId != null &&
                elm.approver2_roleId == userData.role_id
              ) {
                //If Dual Approversand the current user is the approver2
                console.log(
                  "If Dual Approvers and the current user is the approver2"
                );
                processData["is_approved_roleId1"] = true;
                processData["is_approved_roleId2"] = true;
                processData["is_approved"] = true;
              }
              finalData.push(processData);
            });
            let finalSendData = { leaveProfileSetup: finalData };
            this.admService
              .UpdateProfileByOrgIDandProfileNameOrProfileID(finalSendData)
              .subscribe((data: any) => {
                this.spinner.hide();
                if (data.status === "200") {
                  this.successToast(data.desc);
                  this.closeviewEditNotificationModel();
                  this.getAllNotificationForOrg();
                } else {
                  this.failerToast();
                  this.closeviewEditNotificationModel();
                }
              });
          } else {
            this.failerToast();
            this.closeviewEditNotificationModel();
          }
        });
      }
    });
  }

  disapproveLeaveProfile(approveData) {
    Swal.fire({
      title: "Disapprove this Profile ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        let postData = {
          id: this.originalViewEditNotificationModelData.id,
          org_id: this.originalViewEditNotificationModelData.org_id,
          from_id: this.originalViewEditNotificationModelData.from_id,
          to_id: this.originalViewEditNotificationModelData.to_id,
          reference_id: this.originalViewEditNotificationModelData.reference_id,
          read_status: true,
          created_date: this.originalViewEditNotificationModelData.created_date,
          created_by_empId:
            this.originalViewEditNotificationModelData.created_by_empId,
          created_by_name:
            this.originalViewEditNotificationModelData.createdEmpName,
          modified_by_empId:
            this.originalViewEditNotificationModelData.modified_by_empId,
          message: this.originalViewEditNotificationModelData.message,
        };
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
          postData
        ).subscribe((data: any) => {
          this.spinner.hide();
          let processData;
          let finalData = [];
          if (data.status === "200") {
            let userData = JSON.parse(localStorage.getItem("user_info"));
            approveData.leaveDetails.map((elm) => {
              processData = {
                id: elm.id,
                org_id: elm.org_id,
                leave_profile_name: elm.leave_profile_name,
                leave_name: elm.leave_name,
                leave_type: elm.leave_type,
                entitled_leave_days: elm.entitled_leave_days,
                created_date: elm.created_date,
                carry_forward_days: elm.carry_forward_days,
                is_calendar_days: elm.is_calendar_days,
                created_by_empId: elm.created_by_empId,
                modified_by_empId: userData.id
                  ? userData.id
                  : elm.modified_by_empId,
                is_dual_approval: elm.is_dual_approval,
                approver1_roleId: elm.approver1_roleId,
                approver2_roleId: elm.approver2_roleId,
                is_super_admin: false,
                is_approved: false,
                is_disapproved: true,
              };
              finalData.push(processData);
            });
            let finalSendData = {
              leaveProfileSetup: finalData,
            };
            this.admService
              .UpdateProfileByOrgIDandProfileNameOrProfileID(finalSendData)
              .subscribe((data: any) => {
                this.spinner.hide();
                if (data.status === "200") {
                  this.successToast(data.desc);
                  this.closeviewEditNotificationModel();
                  this.getAllNotificationForOrg();
                } else {
                  this.failerToast();
                  this.closeviewEditNotificationModel();
                }
              });
          } else {
            this.failerToast();
            this.closeviewEditNotificationModel();
          }
        });
      }
    });
  }
  //leave profile function ends

  //common close fun for leave Approver, owerwrite  leave profile
  closeviewEditNotificationModel() {
    //this.modalService.dismissAll();
    this.isApprov2View = false;
    this.viewEditNotificationModelData = "";
    this.applyLeaveModel = false;
    this.applyOverwriteModel = false;
    this.applyFrcChkInModel = false;
    $("#notificationModal").modal("hide");
  }
  //common close fun for leave Approver, owerwrite leave profile

  //carry forward function start
  approveCarryForward(approveData) {
    console.log(approveData);
    let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
    Swal.fire({
      title: "Approve this Carry Forward Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        let notRead = {
          id: this.originalViewEditNotificationModelData.id,
          org_id: this.originalViewEditNotificationModelData.org_id,
          from_id: this.originalViewEditNotificationModelData.from_id,
          to_id: this.originalViewEditNotificationModelData.to_id,
          reference_id: this.originalViewEditNotificationModelData.reference_id,
          read_status: true,
          created_date: this.originalViewEditNotificationModelData.created_date,
          created_by_empId:
            this.originalViewEditNotificationModelData.created_by_empId,
          created_by_name:
            this.originalViewEditNotificationModelData.created_by_name,
          modified_by_empId:
            this.originalViewEditNotificationModelData.modified_by_empId,
          message: this.originalViewEditNotificationModelData.message,
        };
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
          notRead
        ).subscribe((data: any) => {
          //console.log(data)
          if (data.status === "200") {
            let postData = {
              id: approveData.id,
              leave_available_employee_id:
                approveData.leave_available_employee_id,
              profile_carry_forward_days:
                approveData.profile_carry_forward_days,
              carry_forward_days: approveData.carry_forward_days,
              approver1_roleId: approveData.approver1_roleId,
              approver2_roleId: approveData.approver2_roleId,
              carry_forward_to_approve: approveData.carry_forward_to_approve,
              carry_forward_status: "approved",
              modified_date: approveData.modified_date,
              modified_by: userDataLocal.id,
              encash_days: approveData.encash_days,
            };
            if (approveData.is_approved1 === false) {
              /* Single approver */
              if (
                approveData.approver1_roleId !== null &&
                approveData.approver1_roleId === userDataLocal.role_id
              ) {
                postData["is_approved1"] = true;
                postData["is_approved2"] = false;
              }
            } else {
              /* Dull approver */
              if (
                approveData.approver2_roleId !== null &&
                approveData.approver2_roleId === userDataLocal.role_id
              ) {
                postData["is_approved1"] = true;
                postData["is_approved2"] = true;
              }
            }
            this.leaveService
              .UpdateCarryForwardRequestByID(postData)
              .subscribe((data2: any) => {
                if (data2.status == "200") {
                  this.toastr.success(data2["desc"], undefined, {
                    positionClass: "toast-top-center",
                  });
                  this.closeCarryForwardModel();
                  this.getAllNotificationForOrg();
                } else {
                  this.failerToast();
                  this.closeCarryForwardModel();
                }
              });
          } else {
            this.toastr.error(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
            this.spinner.hide();
          }
        });
      }
    });
  }

  disapproveCarryForward(disapproveData) {
    console.log(disapproveData);
    let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
    Swal.fire({
      title: "Decline this Carry Forward Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        let notRead = {
          id: this.originalViewEditNotificationModelData.id,
          org_id: this.originalViewEditNotificationModelData.org_id,
          from_id: this.originalViewEditNotificationModelData.from_id,
          to_id: this.originalViewEditNotificationModelData.to_id,
          reference_id: this.originalViewEditNotificationModelData.reference_id,
          read_status: true,
          created_date: this.originalViewEditNotificationModelData.created_date,
          created_by_empId:
            this.originalViewEditNotificationModelData.created_by_empId,
          created_by_name:
            this.originalViewEditNotificationModelData.created_by_name,
          modified_by_empId:
            this.originalViewEditNotificationModelData.modified_by_empId,
          message: this.originalViewEditNotificationModelData.message,
        };
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
          notRead
        ).subscribe((data: any) => {
          //console.log(data)
          if (data.status === "200") {
            let postData = {
              id: disapproveData.id,
              leave_available_employee_id:
                disapproveData.leave_available_employee_id,
              profile_carry_forward_days:
                disapproveData.profile_carry_forward_days,
              carry_forward_days: disapproveData.carry_forward_days,
              approver1_roleId: disapproveData.approver1_roleId,
              approver2_roleId: disapproveData.approver2_roleId,
              carry_forward_to_approve: disapproveData.carry_forward_to_approve,
              carry_forward_status: "decline",
              modified_date: disapproveData.modified_date,
              modified_by: userDataLocal.id,
              encash_days: disapproveData.encash_days,
            };
            if (disapproveData.is_approved1 === false) {
              if (
                disapproveData.approver1_roleId !== null &&
                disapproveData.approver1_roleId === userDataLocal.role_id
              ) {
                postData["is_approved1"] = false;
              }
            } else {
              if (
                disapproveData.approver2_roleId !== null &&
                disapproveData.approver2_roleId === userDataLocal.role_id
              ) {
                postData["is_approved1"] = true;
                postData["is_approved2"] = false;
              }
            }

            this.leaveService
              .UpdateCarryForwardRequestByID(postData)
              .subscribe((data: any) => {
                if (data.status == "200") {
                  this.spinner.hide();
                  this.toastr.success(data["desc"], undefined, {
                    positionClass: "toast-top-center",
                  });
                  this.closeCarryForwardModel();
                  this.getAllNotificationForOrg();
                } else {
                  this.failerToast();
                  this.closeCarryForwardModel();
                }
              });
          } else {
            this.toastr.error(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
            this.spinner.hide();
          }
        });
      }
    });
  }

  closeCarryForwardModel() {
    //this.modalService.dismissAll();
    this.carryForwardModel = false;
    this.spinner.hide();
    $("#notificationModal").modal("hide");
  }
  //carry forward function end

  //holiday function start
  approveHoliday(approveData) {
    console.log(approveData);
    let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
    Swal.fire({
      title: "Approve this Carry Forward Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        let notRead = {
          id: this.originalViewEditNotificationModelData.id,
          org_id: this.originalViewEditNotificationModelData.org_id,
          from_id: this.originalViewEditNotificationModelData.from_id,
          to_id: this.originalViewEditNotificationModelData.to_id,
          reference_id: this.originalViewEditNotificationModelData.reference_id,
          read_status: true,
          created_date: this.originalViewEditNotificationModelData.created_date,
          created_by_empId:
            this.originalViewEditNotificationModelData.created_by_empId,
          created_by_name:
            this.originalViewEditNotificationModelData.created_by_name,
          modified_by_empId:
            this.originalViewEditNotificationModelData.modified_by_empId,
          message: this.originalViewEditNotificationModelData.message,
        };
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
          notRead
        ).subscribe((data: any) => {
          //console.log(data)
          if (data.status === "200") {
            let postData = {
              id: approveData.id,
              org_id: userDataLocal.org_id,
              start_date: approveData.start_date,
              end_date: approveData.end_date,
              description: approveData.description,
              holiday_name: approveData.holiday_name,
              holiday_type: approveData.holiday_type,
              approver1_roleId: approveData.approver1_roleId,
              approver2_roleId: approveData.approver2_roleId,
              created_date: approveData.created_date,
              created_by_empId: approveData.created_by_empId,
              modified_date: approveData.modified_date,
              modified_by_empId: approveData.modified_by_empId,
            };
            if (approveData.is_approved1 === false) {
              /* Single approver */
              if (
                approveData.approver1_roleId !== null &&
                approveData.approver1_roleId === userDataLocal.role_id
              ) {
                postData["is_approved1"] = true;
                postData["is_approved2"] = false;
                postData["status"] =
                  approveData.approver2_roleId !== null
                    ? "pending"
                    : "approved";
                postData["ondate_approved1"] = moment().format("L");
                postData["ondate_approved2"] = approveData.ondate_approved2;
              }
            } else {
              /* Dull approver */
              if (
                approveData.approver2_roleId !== null &&
                approveData.approver2_roleId === userDataLocal.role_id
              ) {
                postData["is_approved1"] = true;
                postData["is_approved2"] = true;
                postData["status"] = "approved";
                postData["ondate_approved1"] = approveData.ondate_approved1;
                postData["ondate_approved2"] = moment().format("L");
              }
            }
            this.leaveService
              .UpdatePublicHolidaysByID(postData)
              .subscribe((data2: any) => {
                if (data2.status == "200") {
                  this.toastr.success(data2["desc"], undefined, {
                    positionClass: "toast-top-center",
                  });
                  this.holidayCloseModel();
                  this.getAllNotificationForOrg();
                } else {
                  this.failerToast();
                  this.holidayCloseModel();
                }
              });
          } else {
            this.toastr.error(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
            this.spinner.hide();
          }
        });
      }
    });
  }
  //Need to Work On the  Back End For teh Approval Section
  approveHolidayLeave(approveData) {
    console.log(approveData);
    let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
    Swal.fire({
      title: "Approve this Hoiday Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        let notRead = {
          id: this.HoliadyModelApproveData.id,
          org_id: this.HoliadyModelApproveData.org_id,
          from_id: this.HoliadyModelApproveData.from_id,
          to_id: this.HoliadyModelApproveData.to_id,
          reference_id: this.HoliadyModelApproveData.reference_id,
          read_status: true,
          created_date: this.HoliadyModelApproveData.created_date,
          created_by_empId: this.HoliadyModelApproveData.created_by_empId,
          created_by_name: this.HoliadyModelApproveData.created_by_name,
          modified_by_empId: this.HoliadyModelApproveData.modified_by_empId,
          message: this.HoliadyModelApproveData.message,
        };
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
          notRead
        ).subscribe((data: any) => {
          //console.log(data)
          if (data.status === "200") {
            let postData = {
              id: approveData.id,
              org_id: userDataLocal.org_id,
              start_date: approveData.start_date,
              end_date: approveData.end_date,
              description: approveData.description,
              holiday_name: approveData.holiday_name,
              holiday_type: approveData.holiday_type,
              approver1_roleId: approveData.approver1_roleId,
              approver2_roleId: approveData.approver2_roleId,
              created_date: approveData.created_date,
              created_by_empId: approveData.created_by_empId,
              modified_date: approveData.modified_date,
              modified_by_empId: approveData.modified_by_empId,
            };
            if (approveData.is_approved1 === false) {
              /* Single approver */
              if (
                approveData.approver1_roleId !== null &&
                approveData.approver1_roleId === userDataLocal.role_id
              ) {
                postData["is_approved1"] = true;
                postData["is_approved2"] = false;
                postData["status"] =
                  approveData.approver2_roleId !== null
                    ? "pending"
                    : "approved";
                postData["ondate_approved1"] = moment().format("L");
                postData["ondate_approved2"] = approveData.ondate_approved2;
              }
            } else {
              /* Dull approver */
              if (
                approveData.approver2_roleId !== null &&
                approveData.approver2_roleId === userDataLocal.role_id
              ) {
                postData["is_approved1"] = true;
                postData["is_approved2"] = true;
                postData["status"] = "approved";
                postData["ondate_approved1"] = approveData.ondate_approved1;
                postData["ondate_approved2"] = moment().format("L");
              }
            }
            this.leaveService
              .UpdatePublicHolidaysByID(postData)
              .subscribe((data2: any) => {
                if (data2.status == "200") {
                  this.toastr.success(data2["desc"], undefined, {
                    positionClass: "toast-top-center",
                  });
                  this.holidayCloseModel();
                  this.GetPublicHolidaysCreatedbyOrgId();
                  this.getAllNotificationForOrg();
                } else {
                  this.failerToast();
                  this.holidayCloseModel();
                }
              });
          } else {
            this.toastr.error(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
            this.spinner.hide();
            this.HoliadyModelApprove = false;
          }
        });
      }
    });
  }

  disapproveHoliday(disapproveData) {
    console.log(disapproveData);
    let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
    Swal.fire({
      title: "Decline this Holiday Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        let notRead = {
          id: this.originalViewEditNotificationModelData.id,
          org_id: this.originalViewEditNotificationModelData.org_id,
          from_id: this.originalViewEditNotificationModelData.from_id,
          to_id: this.originalViewEditNotificationModelData.to_id,
          reference_id: this.originalViewEditNotificationModelData.reference_id,
          read_status: true,
          created_date: this.originalViewEditNotificationModelData.created_date,
          created_by_empId:
            this.originalViewEditNotificationModelData.created_by_empId,
          created_by_name:
            this.originalViewEditNotificationModelData.created_by_name,
          modified_by_empId:
            this.originalViewEditNotificationModelData.modified_by_empId,
          message: this.originalViewEditNotificationModelData.message,
        };
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
          notRead
        ).subscribe((data: any) => {
          //console.log(data)
          if (data.status === "200") {
            let postData = {
              id: disapproveData.id,
              org_id: userDataLocal.org_id,
              start_date: disapproveData.start_date,
              end_date: disapproveData.end_date,
              description: disapproveData.description,
              holiday_name: disapproveData.holiday_name,
              holiday_type: disapproveData.holiday_type,
              approver1_roleId: disapproveData.approver1_roleId,
              approver2_roleId: disapproveData.approver2_roleId,
              created_date: disapproveData.created_date,
              created_by_empId: disapproveData.created_by_empId,
              modified_date: disapproveData.modified_date,
              modified_by_empId: disapproveData.modified_by_empId,
            };
            if (disapproveData.is_approved1 === false) {
              if (
                disapproveData.approver1_roleId !== null &&
                disapproveData.approver1_roleId === userDataLocal.role_id
              ) {
                postData["is_approved1"] = false;
                postData["is_approved2"] = false;
                postData["status"] = "decline";
                postData["ondate_approved1"] = moment().format("L");
                postData["ondate_approved2"] = disapproveData.ondate_approved2;
              }
            } else {
              if (
                disapproveData.approver2_roleId !== null &&
                disapproveData.approver2_roleId === userDataLocal.role_id
              ) {
                postData["is_approved1"] = true;
                postData["is_approved2"] = false;
                postData["status"] = "decline";
                postData["ondate_approved1"] = disapproveData.ondate_approved1;
                postData["ondate_approved2"] = moment().format("L");
              }
            }

            this.leaveService
              .UpdatePublicHolidaysByID(postData)
              .subscribe((data: any) => {
                if (data.status == "200") {
                  this.spinner.hide();
                  this.toastr.success(data["desc"], undefined, {
                    positionClass: "toast-top-center",
                  });
                  this.holidayCloseModel();
                  this.getAllNotificationForOrg();
                } else {
                  this.failerToast();
                  this.holidayCloseModel();
                }
              });
          } else {
            this.toastr.error(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
            this.spinner.hide();
            this.HoliadyModelApprove = false;
          }
        });
      }
    });
  }

  holidayCloseModel() {
    //this.modalService.dismissAll();
    this.HoliadyModel = false;
    this.HoliadyModelApprove = false;
    this.spinner.hide();
    $("#notificationModal").modal("hide");
  }
  //holiday function ends

  //Success message
  successToast(desc) {
    this.toastr.success(desc);
  }

  //failure message
  failerToast() {
    let desc = "Something went wrong";
    this.toastr.error(desc);
  }

  //For Uploading the Document for Apply leave section
  LeaveDocUrl = "";
  isLeaveDocUp = false;
  onFileSelected(event) {
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          this.isLeaveDocUp = true;
          this.LeaveDocUrl = imData.secure_url;
          this.spinner.hide();
        }
      });
    }
  }
  LeaveDocDelete() {
    this.LeaveDocUrl = "";
    this.isLeaveDocUp = false;
  }

  goToLink() {
    window.open(this.LeaveDocUrl, "_blank");
  }

  ViewDoc(link) {
    if (link) {
      if (link != "") {
        window.open(link, "_blank");
      } else {
        this.toastr.error("Link Is not Valid");
      }
    } else {
      this.toastr.error("Something went wrong");
    }
  }
  onMapReady(map: any) {
    const line = new google.maps.Polyline({
      path: [
        { lat: this.mapData.checkinLat, lng: this.mapData.checkinLong },
        { lat: this.mapData.checkoutLat, lng: this.mapData.checkoutLong },
      ],
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    line.setMap(map);
  }
}
