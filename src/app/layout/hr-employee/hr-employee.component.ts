import { Component, OnInit, ViewChild } from "@angular/core";
import moment = require("moment");
import { TabComponent } from "@syncfusion/ej2-angular-navigations";
import {
  GridComponent,
  ToolbarItems,
  GroupService,
} from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";
import { LeaveService } from "../../services/leave.service";
import { EmployeeService } from "../../services/employee.service";
import { UserService } from "../../services/user.service";
import * as _ from "lodash";
import { AdministrativeService } from "../../services/administrative.service";
import { MatTab } from "@angular/material";
import { CountryService } from "../../services/countryList.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { settingsService } from "../../services/settings.service";
import { PayrollService } from "../../services/payroll.service";
import { ModuleSetupService } from "../../services/moduleSetup.service";
import { DropDownListComponent, SelectEventArgs } from "@syncfusion/ej2-angular-dropdowns";
import { log } from "console";
import { ActivatedRoute, Router } from "@angular/router";
import { ContractStatusRoutingModule } from "../contract-status/contract-status-routing.module";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { OrganizationService } from "../../services/organization.service";
import { TimeSheetService } from "../../services/timesheet.service";
import { DatePipe } from "@angular/common";
import { AssetService } from '../../services/asset.service';

@Component({
  selector: "app-hr-employee",
  templateUrl: "./hr-employee.component.html",
  styleUrls: ["./hr-employee.component.scss"],
  providers: [GroupService],
})
export class HrEmployeeComponent implements OnInit {
  //userRights
  commonModuleName;
  accessToPage = false;
  disableTabs=true;
  employeeList;
  employeeSummaryList;
  commonFields: Object = { text: "text", value: "id" };
  public invoiceToolbar: ToolbarItems[];
  public singleEmpToolbar: ToolbarItems[];
  @ViewChild("empTabledataTableGrid", { static: false })
  public empTabledataTableGrid: GridComponent;
  @ViewChild("singleEmpPresentGrid", { static: false })
  public singleEmpPresentGrid: GridComponent;
  @ViewChild("singleEmpAbsentGrid", { static: false })
  public singleEmpAbsentGrid: GridComponent;
  @ViewChild("singleEmpAssignedLeaveGrid", { static: false })
  public singleEmpAssignedLeaveGrid: GridComponent;
  @ViewChild("lessHoursWrkbyEmpIDGrid", { static: false })
  public lessHoursWrkbyEmpIDGrid: GridComponent;
  @ViewChild("breakdatagrid", { static: false })
  public breakdatagrid: GridComponent;
  @ViewChild("locationexceptionGrid", { static: false })
  public locationexceptionGrid: GridComponent;
  @ViewChild("waiveoffdetailsModel", { static: false })
  waiveoffdetailsModel: any;
  @ViewChild("tabObj", { static: false }) public tabObj: TabComponent;
  @ViewChild("tabObjlist", { static: false }) public tabObjlist: TabComponent;
  @ViewChild("tabObjmat", { static: false }) public tabObjmat: MatTab;

  @ViewChild("adjustmentModel", { static: false }) adjustmentModel: any;
  @ViewChild("reimbursmentModel", { static: false }) reimbursmentModel: any;
  @ViewChild("printModal", { static: false }) printModal: any;
  @ViewChild("loanpaymentModel", { static: false }) loanpaymentModel: any;

  @ViewChild("variablepayModel", { static: false }) variablepayModel: any;

  singleEmployeePage = false;
  singleEmployeeData;
  public groupOptions: Object;
  public refresh: Boolean;
  @ViewChild("grid", { static: false })
  public grid: GridComponent;
  photourl = "../../../assets/images/profile_img.png";
  emproleid = "";
  empRoleData;
  empextdata;
  esdocs;
  repaddocs;

  mainTab = [
    { text: "DashBoard"},
    { text: "Details" },
    { text: "Attendence" },
    { text: "Leaves" },
    { text: "PayRoll" },
    { text: "Assets" },
    { text: "Documents" },
    { text: "Final Settlement" },
  ];

  attendanceHeader = [
    "Present List",
    "Absent List",
    "Less Hours",
    "Over Time",
    "Override Requests",
    "Breaks List",
    "Location Exception",
  ];

  PayrollHeader = [
    "Active Payroll Month",
    "Variable Pay",
    "Adjustments",
    "Work Expensess",
    "Wave Off",
    "Adavnce & Loan",
    "Pay History",
    "Salary Details",
  ];
  payrollListing = [];
  salaryHistory = [];
  salaryDetails = [];
  holdDetails = [];
  allAvailableLeaves = [];
  EligibleGratuityLeaves = [];
  leavesHistory = [];
  employeeLeaveHistory = [];
  salaryData = [];
  totalsepLeaveDays = 0;
  leaveProfileEndDate: Date = new Date(); // Today's date
  openBalanceStartDate: Date = new Date("2022-01-01");
  openBalanceEndDate: Date = new Date("2021-12-31");
  open_balance_days: number | null = null;
  leavebackup = [];
  listEmployeeHeader = [{ text: "Employees" }, { text: "Summary" }];

  leavesHeader: {
    name: string;
    total_days?: number;
    request_count?: number;
  }[] = [{ name: "All" }, { name: "Leaves Approved" }];
  leavesPendingHeader: {
    name: string;
    total_days?: number;
    request_count?: number;
  }[] = [{ name: "All" }];
  leavesDeclineHeader: {
    name: string;
    total_days?: number;
    request_count?: number;
  }[] = [{ name: "Declined Request" }];

  mattabNumber = 0;
  lmattabnum = 0;
  leaveCompensationData = {
    totalUnusedLeaves: 0,
    basic_perdaysal: 0,
    totalLeaveCompensation: "",
  };
  empData: {
    full_name: any;
    emp_code: any;
    role_id: any;
    workemail: any;
    mobile: any;
    gender: any;
    dob: string;
    alias: any;
    joined_date: string;
    contract_startdate: string;
    contract_enddate: string;
    labour_enddate: string;
    roleName: string;
    marital_status: any;
    labour_id: any;
    emirates_id: any;
    address: any;
    city: any;
    org_name: any;
    bank_Iban: any;
    bank_account_num: any;
    bank_name: any;
    bank_branch: any;
    bank_swift: any;
  };

  employeePresentData;
  employeeAbsentData;
  employeeApprovedLeaveData;
  employeePendingLeaveData;
  employeeLeaveData;
  employeeCheckInOutOverrideData;
  employeeBreakData;
  employeeLocationData;
  lessHoursWrkbyEmpIDData;
  OverTimeWrkbyEmpIDData;

  totalLessHrsData;
  totalOverTimeData;

  breakdaycount = 0;
  availableLeaveDays = 0;
  finalSalary = "";

  countryData;

  lessdays;
  lesshrs;
  lessmins;
  totlesshh = "00:00";

  overdays;
  overhrs;
  overmins;
  totloverhh = "00:00";
  key = "secret";
  isAllActive = true;
  isMonthActive = false;
  isWeekActive = false;
  isTodayActive = false;
  isYearActive = false;
  restrictedUserView = false;
  fromdaterange = true;
  additionsOrDeductions = {
    additions: "0",
    deduction: "0",
    total: "0",
  };
  reqFromSummary = false;
  clickSummary = false;
  isPaySlipLoading = false;
  isFinalSettlementLoading = false;
  finalAmount = "";
  gratuityCompData={}

  fromDate = moment().startOf("month").format("L");
  toDate = moment().format("L");
  public minRangeDate: Date;
  public maxRangeDate: Date = new Date(new Date().toDateString());
  dateRgeFrm: FormGroup;
  payrollMonthFrm: FormGroup;
  payrollHistoryFrm: FormGroup;
  summaryToolbar;

  public today: Date = new Date(new Date().toDateString());
  public weekStart: Date = moment().startOf("week").toDate();
  public monthStart: Date = moment().startOf("month").toDate();
  public yearStart: Date = moment().startOf("year").toDate();

  DateRangeSelected = "All";
  dropdownConfig;
  lheader: any;
  datecalculator: string;
  employeedeclineddata: any;
  calopendays: string;
  calnordays: string;
  multipliedMonths: number;

  constructor(
    private employeeService: EmployeeService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private leaveService: LeaveService,
    private admService: AdministrativeService,
    private countries: CountryService,
    private toast: ToastrService,
    private modalService: NgbModal,
    public config: NgbModalConfig,
    private spinner: NgxSpinnerService,
    private settingsService: settingsService,
    private payrollService: PayrollService,
    public ModuleSetupService: ModuleSetupService,
    private route: ActivatedRoute,
    public Router: Router,
    public orgService: OrganizationService,
    public timesheetService: TimeSheetService,
    private datePipe: DatePipe,
    private assetService: AssetService,
  ) {
    config.backdrop = "static";

    this.dropdownConfig = {
      search: false,
      height: "200px",
      clearOnSelection: true,
    };

    this.lastWorkForm = new FormGroup({
      lastDateOfWork: new FormControl(""), // For Dropdown selection
      customDate: new FormControl(""), // For Custom Date entry
      terminationType: new FormControl(""),
      terminationReason: new FormControl(""),
      remarks: new FormControl(""),
    });
  }

  terminationReasonOptions = [
    "Resignation",
    "End of Contract",
    "Redundancy",
    "Misconduct",
    "Performance Issues",
    "Retirement",
    "Health Reasons",
    "Mutual Agreement",
    "Absenteeism",
    "Other",
  ];

  terminationTypeOptions = [
    "Voluntary (resignation)",
    "Involuntary (dismissal)",
  ];

  ngOnInit() {

    
    console.log(this.restrictedUserView, "RESFRESHED!!!");
    this.invoiceToolbar = ["Search"];
    this.singleEmpToolbar = ["ExcelExport"];
    this.summaryToolbar = ["Search", "ExcelExport"];

    this.route.queryParams.subscribe((params) => {
      const data = params["key"];
      if (data) {
        console.log(data, "**");
        let decrypted = this.xorEncryptDecrypt(data, this.key);
        // console.log(decrypted,"ID CHECK")
        this.restrictedUserView = true;
        this.viewSingleEmployee({ id: decrypted });
      } else {
        console.log(data, "else**");
        this.restrictedUserView = false;
        this.checkUserRights();
      }
    });

    //formControl daterange
    this.dateRgeFrm = new FormGroup({
      daterange: new FormControl(""),
    });

    this.payrollMonthFrm = new FormGroup({
      paymonth: new FormControl("Pending"),
    });
    this.payrollHistoryFrm = new FormGroup({
      paymonth: new FormControl(""),
    });

    this.groupOptions = { showGroupedColumn: false, columns: ["ondate"] };
    this.getAllEmployeeByOrgID();
    this.getEmlpoyeeSummaryReport();
    this.getCountryList();

    //active when date picker value changes
    this.dateRgeFrm.get("daterange").valueChanges.subscribe(() => {
      let startTime = this.dateRgeFrm.get("daterange").value;
      if (startTime !== null) {
        this.fromDate = moment(startTime[0]).format("L");
        this.toDate = moment(startTime[1]).format("L");

        switch (this.fromDate) {
          case moment(this.today).format("L"): {
            this.DateRangeSelected = "Today";
            break;
          }
          case moment(this.weekStart).format("L"): {
            this.DateRangeSelected = "Week";
            break;
          }
          case moment(this.monthStart).format("L"): {
            this.DateRangeSelected = "Month";
            break;
          }
          case moment(this.yearStart).format("L"): {
            this.DateRangeSelected = "Year";
            break;
          }
          default: {
            this.DateRangeSelected = "Custom";
            break;
          }
        }
        console.log(this.DateRangeSelected);

        if (this.fromdaterange) {
          if (this.singleEmployeePage) {
            console.log("Date Changed Called once");
            this.runSingleEmpFunctions();
          } else {
            this.getEmlpoyeeSummaryReport();
            console.log("Date Changed Called once");
          }
        }
      }
    });

    //this request is trigerd from the settings module.
    if (sessionStorage.getItem("empid")) {
      let data = sessionStorage.getItem("empid");
      sessionStorage.removeItem("empid");
      this.viewSingleEmpRequestFromSettings(data);
    }
  }
  isLoading = false;
  assetList
  assignedAsset;
  
  listAsset(newData) {
    this.isLoading = true;
    this.assetList = [];
    let postData = {
      "orgID": localStorage.getItem('org_id')
    }
    this.assetService.getAssetbyOrgId(postData).subscribe((data: any) =>{
      if(data != null){
        this.assetList =data;
        console.log(this.assetList, "assetList")
        this.assignedAsset = this.assetList.filter(val => val.assignee_id === newData.id)

        console.log(this.assignedAsset, "assignedAsset")
        this.isLoading = false;
      }
    })
    
    
    
 }
  xorEncryptDecrypt(input: string, key: string): string {
    let output = "";

    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
    }
    return output;
  }

  getCommonDateType(value) {
    this.fromdaterange = false;
    if (value === "all") {
      this.fromDate = moment(this.singleEmployeeData.joined_date).format("L");
      this.toDate = moment().format("L");
      this.makeallfalse();
      this.isAllActive = true;
      this.dateRgeFrm.patchValue({
        daterange: [this.fromDate, this.toDate],
      });
      if (this.singleEmployeePage) {
        console.log("call from commondate  ALL");
        this.runSingleEmpFunctions();
      }
    } else if (value === "today") {
      this.fromDate = moment().format("L");
      this.toDate = moment().format("L");

      this.makeallfalse();
      this.isTodayActive = true;
      console.log("DAY SELECTED");
      this.dateRgeFrm.patchValue({
        daterange: [this.fromDate, this.toDate],
      });

      if (this.singleEmployeePage) {
        console.log("call from commondate  Today");
        this.runSingleEmpFunctions();
      } else {
        this.getEmlpoyeeSummaryReport();
        console.log("call from commondate  Today");
      }
    } else if (value === "weeks") {
      this.fromDate = moment().subtract(7, "days").format("L");
      this.toDate = moment().format("L");

      this.makeallfalse();
      this.isWeekActive = true;
      console.log("WEEK SELECTED");
      this.dateRgeFrm.patchValue({
        daterange: [this.fromDate, this.toDate],
      });
      if (this.singleEmployeePage) {
        console.log("call from commondate  week");
        this.runSingleEmpFunctions();
      } else {
        this.getEmlpoyeeSummaryReport();
        console.log("call from commondate  week");
      }
    } else if (value === "month") {
      this.fromDate = moment().startOf("month").format("L");
      this.toDate = moment().format("L");

      this.makeallfalse();
      this.isMonthActive = true;
      this.dateRgeFrm.patchValue({
        daterange: [this.fromDate, this.toDate],
      });

      if (this.singleEmployeePage) {
        console.log("call from commondate  month");
        this.runSingleEmpFunctions();
      } else {
        this.getEmlpoyeeSummaryReport();
        console.log("call from commondate  month");
      }
    } else if (value === "year") {
      this.fromDate = moment().startOf("year").format("L");
      this.toDate = moment().format("L");

      this.makeallfalse();
      this.isYearActive = true;
      this.dateRgeFrm.patchValue({
        daterange: [this.fromDate, this.toDate],
      });

      if (this.singleEmployeePage) {
        console.log("call from commondate  year");
        this.runSingleEmpFunctions();
      } else {
        this.getEmlpoyeeSummaryReport();
        console.log("call from commondate  year");
      }
    }
    this.fromdaterange = true;
  }

  getCountryList() {
    this.countries.getCountryList().subscribe((data: any) => {
      let results = [];
      data.map((elm, i) => {
        results.push({
          id: elm.id,
          value: elm.name,
        });

        if (data.length === i + 1) {
          this.countryData = results;
        }
      });
    });
  }

  //for the grouping function
  dataBound() {
    if (this.refresh) {
      this.grid.groupColumn("ondate");
      this.refresh = false;
    }
  }
  load() {
    this.refresh = (<any>this.grid).refreshing;
  }
  created() {
    this.grid.on("columnDragStart", this.columnDragStart, this);
  }
  public columnDragStart(args: any) {
    if (args.column.field === "Mainfieldsofinvention") {
    }
  }

  async checkUserRights() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    // this.route.queryParams.subscribe(async (params) => {
    //   const data = params["key"];
    //   if (data) {
    //     console.log(data, "**");
    //     let decrypted = this.xorEncryptDecrypt(data, this.key);
    //     // console.log(decrypted,"ID CHECK")
    //     this.restrictedUserView = true;
    //     await this.viewSingleEmployee({ id: decrypted });
    //   } else {
    //     console.log(data, "else**");
    //     this.restrictedUserView = false;
    //   }
    // });
    const accessRightsData: any = await this.userService
      .GetAccessRightsbyRole({ id: user_info.role_id })
      .toPromise();
    if (accessRightsData && accessRightsData.length > 0) {
      accessRightsData.map((item) => {
        item.module_name = item.module_name.replace(/\s+/g, "");
        return item;
      });
      this.commonModuleName = _.groupBy(accessRightsData, "module_name");

      if (this.commonModuleName.HumanResource) {
        console.log("Called PERMISSION!!!");
        this.accessToPage = true;
        this.singleEmployeePage = false;
      } else {
        this.accessToPage = false;
      }

      if (this.commonModuleName.Payroll) {
        this.PayrollModuleID = this.commonModuleName.Payroll[0].id;
        this.commonModuleName.Payroll.map((elm) => {
          if (elm.section_name === "Create and Modify Payroll Payments") {
            if (elm.is_allow === true) {
              this.showPayrollPaymentBtn = elm.is_allow;
              this.createPayrollSectionName = elm.section_name;
            }
          }
        });
        this.checkPayrollApprover(user_info.role_id);
      }
    } else {
      this.accessToPage = false;
    }
  }

  PayrollModuleID;
  createPayrollSectionName;
  showPayrollPaymentBtn = false;
  addPayrollPaymentsFullAccess = false;
  createPayrollPaymentApprover1rollId;
  createPayrollPaymentApprover1rollName;
  isDualApproverPayrollPayments = false;
  createPayrollPaymentApprover2rollId;
  createPayrollPaymentApprover2rollName;

  checkPayrollApprover(role_id) {
    let postData = {
      roleID: role_id,
      moduleID: this.PayrollModuleID,
    };

    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe((data: any) => {
      //add edit
      data.map((elm) => {
        if (elm.section_name === this.createPayrollSectionName) {
          if (elm.is_full_access) {
            this.addPayrollPaymentsFullAccess = true;
          } else {
            this.addPayrollPaymentsFullAccess = false;
            if (elm.approver1_roleId !== null) {
              this.createPayrollPaymentApprover1rollId = elm.approver1_roleId;
              this.createPayrollPaymentApprover1rollName =
                elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.isDualApproverPayrollPayments = true;
                this.createPayrollPaymentApprover2rollId = elm.approver2_roleId;
                this.createPayrollPaymentApprover2rollName =
                  elm.approver2_role_name;
              }
            }
          }
        }
      });
    });
  }

  getAllEmployeeByOrgID() {
    this.employeeService
      .fetchGridDataEmployeeByOrgID()
      .subscribe((data: any) => {
        this.employeeList = data;
      });
  }

  getEmlpoyeeSummaryReport() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postdata = {
      orgID: user_info.org_id,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.employeeService
      .EmployeeSummaryReportByRangeOrgId(postdata)
      .subscribe((rep: any) => {
        if (rep !== null) {
          this.employeeSummaryList = rep;
        }
      });
  }

  cardClick(maintb, subtb) {
    console.log("Checking the Main Tab data", maintb);
    console.log("Checking the Sub Tab data", subtb);

    let tabNumber = this.mainTab
      .map(function (e) {
        return e.text;
      })
      .indexOf(maintb);
    this.tabObj.select(tabNumber);

    if (maintb === "Attendence") {
      this.mattabNumber = this.attendanceHeader
        .map(function (e) {
          return e;
        })
        .indexOf(subtb);
    } else if (maintb === "Leaves") {
      this.lmattabnum = this.leavesHeader
        .map(function (e) {
          return e;
        })
        .indexOf(subtb);
    }
  }

  async viewSingleEmployee(data) {
    let postData = { id: data.id };
    localStorage.setItem("emp_id", data.id);
    
    try {
      const userData: any = await this.admService
        .FindByEmpID(postData)
        .toPromise();

      if (userData != null) {
        this.singleEmployeeData = userData;
        console.log("singleemployeedata", this.singleEmployeeData);

        await this.listAsset(userData);

        if (!this.restrictedUserView && this.tabObjlist.selectedItem == 1) {
          this.clickSummary = true;
          this.reqFromSummary = true;
        }

        this.singleEmployeePage = true;
        this.makeallfalse();
        this.minRangeDate = new Date(this.singleEmployeeData.joined_date);

        if (this.reqFromSummary != true) {
          this.fromDate = moment(this.singleEmployeeData.joined_date).format(
            "L"
          );
          this.toDate = moment().format("L");
          this.isAllActive = true;
        }

        this.reqFromSummary = false;
        this.runSingleEmpFunctions();
        this.accessToPage = true;
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  }

  viewSingleEmpRequestFromSettings(empid) {
    let postData = { id: empid };
    this.admService.FindByEmpID(postData).subscribe((userData: any) => {
      if (userData != null) {
        this.singleEmployeeData = userData;

        this.singleEmployeePage = true;
        this.makeallfalse();
        this.isAllActive = true;
        this.minRangeDate = new Date(this.singleEmployeeData.joined_date);
        this.fromDate = moment(this.singleEmployeeData.joined_date).format("L");
        this.toDate = moment().format("L");
        this.runSingleEmpFunctions();
      }
    });
  }

  makeallfalse() {
    this.isAllActive = false;
    this.isTodayActive = false;
    this.isWeekActive = false;
    this.isMonthActive = false;
    this.isYearActive = false;
  }

 async runSingleEmpFunctions() {
    // debugger
    //call api
    this.getEmpExtDetails(this.singleEmployeeData.id);
    this.calculateMonthsAndDays(this.singleEmployeeData.joined_date);
    this.calculateMonthsAndDaysNormal(
      this.openBalanceStartDate,
      this.leaveProfileEndDate
    );
    this.calculateMonthsAndDaysopen(
      this.singleEmployeeData.joined_date,
      this.openBalanceEndDate
    );

    this.getroledata(this.singleEmployeeData.id);
    this.EmployeeAvialAttendanceSummaryById();
    this.EmployeeAttendanceSummaryById();
    // this.EmployeeApprovedLeaveSummaryById();
    this.EmployeeAllLeaveSummaryById();
    this.GetTimeSheetOverridebyEmpID();
    this.filldocdetails();
    //this.callLessHrsCardData();
    //this.callOverTimeCardData();
    this.LocationExceptionByEmpIdAndDate();
    this.TimeSheetBreakByEmpIdAndDate();
    this.GetLessHoursWrkbyEmpID();
    this.GetOverTimeWrkbyEmpID();
    this.callleave(this.singleEmployeeData.id);
    await this.getPayrollData(this.singleEmployeeData.id);
    setTimeout(()=>{
      this.disableTabs=false;
    },1000)
  }

  // variablePayList;
  // adjustmentPayList;
  // workexpenssPayList;

  SinEmpData = {
    a_one: "",
    a_three: "",
    a_two: "",
    d_one: "",
    d_two: "",
    d_three: "",
    emp_id: "",
    fix_deduc: "",
    fix_gross: "",
    fix_netpay: "",
    full_name: "",
    gross_pay: "",
    insurance_deduc: "",
    loanPayments: 0,
    net_deduc: "",
    net_pay: "",
    netdeduction: "",
    netearning: "",
    netpayable: "",
    on_hold: false,
    org_id: "",
    other_allow: "",
    payment_voucher_id: "",
    payroll_id: "",
    role_name: "",
    status: "",
    tax_deduc: "",
    travel_allow: "",
    variablepay: "",
    workexpenss: "",
  };
  EmpSalData;
  selectedPayrollId;

  selectedPayroll = {
    net_additions: "",
    net_deductons: "",
    net_payable: "",
    hold_employees: 0,
    hold_amount: "",
    active_employees: 0,
    status: "",
    start_date: "",
    end_date: "",
    pay_due_date: "",
  };

  empvariableList = [];
  empadjaddList = [];
  empWaveOffList = [];
  empadjdeducList = [];
  empexpenssList = [];
  empadjautodeducList = [];
  empLoanList = [];
  filteredEmpvariableList = [];
  filteredEmpadjaddList = [];
  filteredEmpadjdeducList = [];
  filteredEmpexpenssList = [];
  filteredEmpadjautodeducList = [];
  filteredEmpWorkExpensesList = [];
  filteredEmpLoanAddList = [];
  filteredEmpLoanDeductList = [];

  autototal = 0.0;
  autoCout = 0;
  //getting the the Payroll Details
  async getPayrollData(empid: string) {
    this.resetPayrollData();

    try {
      await this.GetPayrollByOrgId();
      await this.getPayrollSettingRules();

      await this.fetchPayrollData(
        empid,
        "GetPayrollVariablePayByEmpId",
        "empvariableList",
        "filteredEmpvariableList"
      );

      await this.processPayrollAdjustments(empid);

      this.empWaveOffList = await this.fetchData(
        "GetPayrollWaiveoffByEmpId",
        empid
      );

      await this.fetchPayrollData(
        empid,
        "GetPayrollWorkExpensesyByEmpId",
        "empexpenssList",
        "filteredEmpexpenssList"
      );

      await this.processLoanPayments(empid);

      const activePayroll: any = await this.payrollService
        .getLastUnpaidPayrollMonthDetailsByOrgId({
          id: localStorage.getItem("org_id"),
        })
        .toPromise();

      if (activePayroll && activePayroll.length > 0) {
        this.selectedPayrollId = activePayroll[0].id;
        this.selectedPayroll = activePayroll[0];

        const payrollDetails: any = await this.payrollService
          .getPayrollDetailsByPayrollId({ ID: this.selectedPayrollId })
          .toPromise();

        if (payrollDetails && payrollDetails.length > 0) {
          this.EmpSalData = payrollDetails.filter((item) => !item.on_hold);
          this.formatEmpSalData();
          this.SinEmpData = this.EmpSalData.find((emp) => emp.emp_id === empid);
          console.log(this.SinEmpData,"Er**")
          console.log(this.singleEmployeeData,"Erx**")
          await this.getSalaryHistoryByEmpId(empid);
        }
      }
    } catch (error) {
      console.error("Error fetching payroll data:", error);
    }
  }

  private resetPayrollData() {
    this.empvariableList = [];
    this.empadjaddList = [];
    this.empadjdeducList = [];
    this.empadjautodeducList = [];
    this.filteredEmpvariableList = [];
    this.filteredEmpadjaddList = [];
    this.filteredEmpadjdeducList = [];
    this.filteredEmpadjautodeducList = [];
    this.empexpenssList = [];
    this.autototal = 0.0;
    this.autoCout = 0;
    this.openSalaryAccord = false;
  }

  private async fetchData(methodName: string, empid: string): Promise<any[]> {
    return this.payrollService[methodName]({ id: empid }).toPromise();
  }

  private async fetchPayrollData(
    empid: string,
    methodName: string,
    listKey: string,
    filteredKey: string
  ) {
    const data = await this.fetchData(methodName, empid);
    if (data && data.length > 0) {
      this[listKey] = data.map((elm) => ({
        ...elm,
        date_incurred: moment(elm.date_incurred).format("ll"),
      }));
      this[filteredKey] = this[listKey].filter(
        (elm) => elm.status === "Approved"
      );
    }
  }

  private async processPayrollAdjustments(empid: string) {
    const adjustments = await this.fetchData(
      "GetPayrollAdjustmentByEmpId",
      empid
    );

    if (adjustments && adjustments.length > 0) {
      adjustments.forEach((elm) => {
        elm.date_incurred = moment(elm.date_incurred).format("ll");

        if (elm.type === "Addition") {
          this.processAdjustment(elm, "empadjaddList", "filteredEmpadjaddList");
        } else {
          if (elm.created_by !== "System") {
            this.processAdjustment(
              elm,
              "empadjdeducList",
              "filteredEmpadjdeducList"
            );
          }
          if (elm.status === "Active") {
            this.empadjautodeducList.push(elm);
            this.autoCout++;
            this.autototal += parseFloat(elm.amount);
          }
          if (elm.status === "Approved" && elm.created_by === "System") {
            this.filteredEmpadjautodeducList.push(elm);
          }
        }
      });
    }
  }

  private processAdjustment(elm, listKey: string, filteredKey: string) {
    if (elm.status === "Active") {
      this[listKey].push(elm);
    }
    if (elm.status === "Approved") {
      this[filteredKey].push(elm);
    }
  }

  private async processLoanPayments(empid: string) {
    const loans = await this.fetchData("GetPayrollLoanPaymentsByEmpId", empid);

    if (loans && loans.length > 0) {
      loans.forEach((elm) => {
        elm.date_incurred = moment(elm.date_incurred).format("ll");
        if (elm.status === "Active") {
          this.empLoanList.push(elm);
        }
        if (elm.status === "Approved") {
          const key =
            elm.type === "Loan Advance"
              ? "filteredEmpLoanAddList"
              : "filteredEmpLoanDeductList";
          this[key].push(elm);
        }
      });
    }
  }

  async getPayrollDetailsByPayrollId(payrollId) {
    let empid = this.singleEmployeeData.id;
    const activePayroll: any = await this.payrollService
      .getLastUnpaidPayrollMonthDetailsByOrgId({
        id: localStorage.getItem("org_id"),
      })
      .toPromise();

    if (activePayroll && activePayroll.length > 0) {
      this.selectedPayrollId = payrollId;
      this.selectedPayroll = this.payrollListing.find((i) => i.id == payrollId);
      this.EmpSalData = [];
      try {
        const data: any = await this.payrollService
          .getPayrollDetailsByPayrollId({ ID: this.selectedPayrollId })
          .toPromise();
        if (data && data.length > 0) {
          this.EmpSalData = data.filter((i) => !i.on_hold);
          this.formatEmpSalData();
          this.SinEmpData = this.EmpSalData.find((emp) => emp.emp_id == empid);
          await this.getSalaryHistoryByEmpId(empid);
          console.log(this.EmpSalData, "payrollDetailsByPayrollId");
          console.log(this.SinEmpData, "SinEmpData");
        }
      } catch (error) {
        console.error("Error fetching payroll details:", error);
      }
    }
  }

  async GetPayrollByOrgId() {
    try {
      this.payrollListing = [];
      const data: any = await this.payrollService
        .GetPayrollByOrgId({ id: localStorage.getItem("org_id") })
        .toPromise();

      if (data && data.length > 0) {
        data.map((item) => {
          item.hold_amount = this.formatMoney(item.hold_amount);
          item.net_payable = this.formatMoney(item.net_payable);
          item.net_deductons = this.formatMoney(item.net_deductons);
          item.net_additions = this.formatMoney(item.net_additions);
          this.payrollMonthHistory.push({
            id: item.id,
            text: item.name,
          });
        });
      }

      this.payrollListing = data;
    } catch (error) {
      console.error("Error in GetPayrollByOrgId:", error);
      // Optionally, handle the error state or show an error message
    }
  }
  async handlePayrollTabChange(index: number) {
    console.log("Selected Tab", index);
    console.log(this.payrollMonthHistory, "this.payrollMonthHistory");

    this.isPaySlipLoading = true;

    try {
      if (index >= 0) {
        if (this.payrollListing && this.payrollListing.length > 0) {
          if (index == 0) {
            let activePayroll = this.payrollListing.find(
              (i) =>
                i.status === "Active" ||
                i.status === "Pending" ||
                i.status === "Approved"
            );

            if (activePayroll && activePayroll.id) {
              await this.getPayrollDetailsByPayrollId(activePayroll.id);
            } else {
              console.warn("No valid payroll with desired status found.");
            }
          } else {
            let lastPayroll =
              this.payrollListing[this.payrollListing.length - 2];

            if (lastPayroll && lastPayroll.id) {
              await this.getPayrollDetailsByPayrollId(lastPayroll.id);
              this.payrollHistoryFrm.patchValue({ paymonth: lastPayroll.name });
              console.log(lastPayroll, "lastPayroll");
            } else {
              console.warn("No valid second last payroll found.");
            }
          }
        } else {
          console.warn("Payroll listing is empty or undefined.");
        }
      } else {
        console.warn("Invalid tab index.");
      }
    } catch (error) {
      console.error("An error occurred while fetching payroll details:", error);
    } finally {
      this.isPaySlipLoading = false;
    }
  }

  async changePayrollHistoryMonth(e) {
    console.log(e, "CHECK");

    this.isPaySlipLoading = true;

    try {
      if (e.itemData && e.itemData.id) {
        await this.getPayrollDetailsByPayrollId(e.itemData.id);
      } else {
        this.toast.error("Please select a valid month");
      }
    } catch (error) {
      console.error(
        "An error occurred while changing payroll history month:",
        error
      );
      this.toast.error("Failed to fetch payroll details. Please try again.");
    } finally {
      this.isPaySlipLoading = false;
    }
  }

  async getSalaryHistoryByEmpId(empId: string) {
    console.log(empId, "CALLED");
    this.salaryHistory = [];
    const start_date = new Date(this.selectedPayroll.start_date);
    const end_date = new Date(this.selectedPayroll.end_date);
    console.log(start_date, end_date);

    const response: any = await this.payrollService
      .getSalaryHistoryByEmpId({ id: empId })
      .toPromise();

    if (response.length > 0) {
      this.salaryDetails = response;
      const filteredSalaryHistory = response
        .filter((history) => {
          const createdDate = new Date(history.created_date);
          return createdDate >= start_date && createdDate <= end_date;
        })
        .sort(
          (a, b) =>
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        );

      if (filteredSalaryHistory.length > 0) {
        filteredSalaryHistory[0].start_date = this.selectedPayroll.start_date;
        filteredSalaryHistory[filteredSalaryHistory.length - 1].end_date =
          this.selectedPayroll.end_date;
        this.salaryHistory = filteredSalaryHistory;
        this.openSalaryAccord = filteredSalaryHistory.length < 2;
      } else {
        console.log(response, this.salaryHistory, "else called salaryHistory");
        this.salaryHistory = response.filter((history) => history.is_active);
        this.openSalaryAccord = true;
      }
    }

    console.log(start_date, end_date, response, "****");
  }

  formatEmpSalData() {
    if (this.EmpSalData.length > 0) {
      this.EmpSalData.map((item) => {
        item.basic_salary = this.formatMoney(parseInt(item.basic_salary));
        item.fix_gross = this.formatMoney(parseInt(item.fix_gross));
        item.fix_deduc = this.formatMoney(parseInt(item.fix_deduc));
        item.fix_netpay = this.formatMoney(parseInt(item.fix_netpay));
        item.variablepay = this.formatMoney(parseInt(item.variablepay));
        item.adjustmentpay = this.formatMoney(parseInt(item.adjustmentpay));
        item.workexpenss = this.formatMoney(parseInt(item.workexpenss));
        item.loanPayments = this.formatMoney(parseInt(item.loanPayments));
        item.netearning = this.formatMoney(parseInt(item.netearning));
        item.netdeduction = this.formatMoney(parseInt(item.netdeduction));
        item.netpayable = this.formatMoney(parseInt(item.netpayable));
        item.travel_allow = this.formatMoney(parseInt(item.travel_allow));
        item.accommod_allow = this.formatMoney(parseInt(item.accommod_allow));
        item.other_allow = this.formatMoney(parseInt(item.other_allow));
        item.tax_deduc = this.formatMoney(parseInt(item.tax_deduc));
        item.insurance_deduc = this.formatMoney(parseInt(item.insurance_deduc));
        item.gross_pay = this.formatMoney(parseInt(item.gross_pay));
        item.net_deduc = this.formatMoney(parseInt(item.net_deduc));
        item.net_pay = this.formatMoney(parseInt(item.net_pay));
        item.a_one = this.formatMoney(parseInt(item.a_one));
        item.a_two = this.formatMoney(parseInt(item.a_two));
        item.a_three = this.formatMoney(parseInt(item.a_three));
        item.d_one = this.formatMoney(parseInt(item.d_one));
        item.d_two = this.formatMoney(parseInt(item.d_two));
        item.d_three = this.formatMoney(parseInt(item.d_three));
      });
    }
  }

  formatMoney(number: any): string {
    // Convert the number to a string
    if (number != null) {
      const numberStr = number.toFixed(2);

      // Split the string into integer and decimal parts
      const [integerPart, decimalPart] = numberStr.split(".");

      // Add commas for the integer part
      const integerWithCommas = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );

      // Concatenate the integer part with the decimal part and return
      return `${integerWithCommas}.${decimalPart}`;
    } else {
      return `0.00`;
    }
  }

  //getting the role details of the employee.
  getroledata(empid) {
    let postData = { id: empid };
    this.employeeService
      .GetEmployeeRoleByEmpID(postData)
      .subscribe((roledata: any) => {
        this.empRoleData = roledata;
        console.log("employee role", this.empRoleData);
      });
  }

  //getting the Extension details of the employee
  getEmpExtDetails(empid) {
    let postData = { empID: empid };
    this.empextdata = null;
    this.photourl = "../../../assets/images/profile_img.png";
    this.employeeService
      .GetEmployeeExtensionByempId(postData)
      .subscribe((extData: any) => {
        if (extData) {
          console.log("employee extra", extData);
          if (extData.photo_url != null) {
            this.photourl = extData.photo_url;
          }
          this.empextdata = extData;
        }
      });
  }

  callleave(id) {
    this.allAvailableLeaves = [];
    this.leaveService.getEmpLeaveAvailableByOrgId(id).subscribe((data: any) => {
      console.log("Open Balance Data", data[0].open_balance_days);
      this.open_balance_days = data[0].open_balance_days;
      if (data.length !== 0) {
        data.map((elm) => {
          this.allAvailableLeaves.push({
            leave_name: elm.leave_name,
            available_leave_days: parseFloat(elm.available_leave_days).toFixed(
              2
            ),
          });
          if (elm.leave_name === "Annual leave") {
            let leaveLeft = parseFloat(elm.available_leave_days).toFixed(2);
            this.availableLeaveDays = parseFloat(leaveLeft);
          }
        });
        console.log(this.allAvailableLeaves, "*****");
      }
    });
  }

  getDataSource(lheader: string) {
    switch (lheader) {
      case "All":
        return this.employeeLeaveData; // Use combined data for "All"

      case "Leaves Approved":
        return this.employeeApprovedLeaveData;

      case "Pending Leave Request":
        return this.employeePendingLeaveData;

      case "Declined Request":
        return this.employeedeclineddata;

      case "Annual leave":
        return this.employeeLeaveData.filter(
          (leave: any) => leave.leave_name === "Annual leave"
        );

      case "Sick Leave":
        return this.employeeLeaveData.filter(
          (leave: any) => leave.leave_name === "Sick Leave"
        );

      case "Exceptional Leave":
        // Filter for leaves that are neither "Annual Leave" nor "Sick Leave"
        return this.employeeLeaveData.filter(
          (leave: any) =>
            leave.leave_name !== "Annual leave" &&
            leave.leave_name !== "Sick Leave"
        );

      default:
        return [];
    }
  }



  getEmployeeLeaveHistory(id: string) {
    this.spinner.show();
    this.leavebackup = [];

    this.leavesHeader = [{ name: "All" }, { name: "Leaves Approved" }]; // Reset with initial values

    this.leavesPendingHeader = [{ name: "All" }]; // Reset with initial values

    this.leavesDeclineHeader = [{ name: "Declined Request" }];

    const employeeApprovedLeaveDatas = this.employeeApprovedLeaveData; // Already filtered and populated
    const employeePendingLeaveDatas = this.employeePendingLeaveData;
    const employeedeclineddata = this.employeedeclineddata; // Already filtered and populated

    // Calculate totals for approved leaves
    const approvedTotalDays = employeeApprovedLeaveDatas.reduce(
      (sum, leave) => {
        return sum + (Number(leave.leave_days_applied) || 0); // Ensure it's treated as a number
      },
      0
    );
    const approvedRequestCount = employeeApprovedLeaveDatas.length;

    // Calculate totals for pending leaves
    const pendingTotalDays = employeePendingLeaveDatas.reduce((sum, leave) => {
      return sum + (Number(leave.leave_days_applied) || 0); // Ensure it's treated as a number
    }, 0);
    const pendingRequestCount = employeePendingLeaveDatas.length;

    const declineTotalDays = employeedeclineddata.reduce((sum, leave) => {
      return sum + (Number(leave.leave_days_applied) || 0); // Ensure it's treated as a number
    }, 0);
    const declinedRequestCount = employeedeclineddata.length;

    if (employeePendingLeaveDatas.length != 0) {
      this.leavesHeader.push({
        name: "Pending Leave Request",
        total_days: pendingTotalDays, // Ensure it's treated as a number
        request_count: pendingRequestCount,
      });
    }

    if (employeedeclineddata.length != 0) {
      this.leavesHeader.push({
        name: "Declined Request",
        total_days: declineTotalDays, // Ensure it's treated as a number
        request_count: declinedRequestCount,
      });
    }

    // Calculate totals for all leaves
    const allTotalDays = approvedTotalDays + pendingTotalDays;
    const allRequestCount =
      approvedRequestCount + pendingRequestCount + declinedRequestCount;

    // Update leavesHeader for approved and pending leaves
    this.leavesHeader.find(
      (header) => header.name === "Leaves Approved"
    )!.total_days = approvedTotalDays;
    this.leavesHeader.find(
      (header) => header.name === "Leaves Approved"
    )!.request_count = approvedRequestCount;

    this.leavesPendingHeader.find(
      (header) => header.name === "All"
    )!.total_days = pendingTotalDays;
    this.leavesPendingHeader.find(
      (header) => header.name === "All"
    )!.request_count = pendingRequestCount;

    // Update the "All" section
    this.leavesHeader.find((header) => header.name === "All")!.total_days =
      allTotalDays;
    this.leavesHeader.find((header) => header.name === "All")!.request_count =
      allRequestCount;

    // Prepare to collect exceptional leaves
    let exceptionalTotalDays = 0;
    let exceptionalRequestCount = 0;
    let exceptionalTotalDayes = 0;
    let exceptionalRequestCounts = 0;
    const specificLeaves = ["Annual leave", "Sick Leave"];

    // Check for exceptional leaves from approved data
    employeeApprovedLeaveDatas.forEach((leave) => {
      if (!specificLeaves.includes(leave.leave_name)) {
        exceptionalTotalDays += Number(leave.leave_days_applied) || 0; // Ensure it's treated as a number
        exceptionalRequestCount += 1;
      } else {
        // Include specific leaves in the leavesHeader
        const existingLeave = this.leavesHeader.find(
          (header) => header.name === leave.leave_name
        );
        if (existingLeave) {
          existingLeave.total_days =
            (existingLeave.total_days || 0) +
            (Number(leave.leave_days_applied) || 0); // Ensure it's treated as a number
          existingLeave.request_count = (existingLeave.request_count || 0) + 1; // Increment count
        } else {
          this.leavesHeader.push({
            name: leave.leave_name,
            total_days: Number(leave.leave_days_applied) || 0, // Ensure it's treated as a number
            request_count: 1,
          });
        }
      }
    });

    employeePendingLeaveDatas.forEach((leave) => {
      if (!specificLeaves.includes(leave.leave_name)) {
        exceptionalTotalDayes += Number(leave.leave_days_applied) || 0; // Ensure it's treated as a number
        exceptionalRequestCounts += 1;
      } else {
        // Include specific leaves in the leavesHeader
        const existingLeave = this.leavesPendingHeader.find(
          (header) => header.name === leave.leave_name
        );
        if (existingLeave) {
          existingLeave.total_days =
            (existingLeave.total_days || 0) +
            (Number(leave.leave_days_applied) || 0); // Ensure it's treated as a number
          existingLeave.request_count = (existingLeave.request_count || 0) + 1; // Increment count
        } else {
          this.leavesPendingHeader.push({
            name: leave.leave_name,
            total_days: Number(leave.leave_days_applied) || 0, // Ensure it's treated as a number
            request_count: 1,
          });
        }
      }
    });

    // Add "Exceptional Leave" if there are non-specified leave types
    if (exceptionalTotalDays > 0 || exceptionalRequestCount > 0) {
      const exceptionalLeaveEntry = this.leavesHeader.find(
        (header) => header.name === "Exceptional Leave"
      );
      if (exceptionalLeaveEntry) {
        exceptionalLeaveEntry.total_days = exceptionalTotalDays;
        exceptionalLeaveEntry.request_count = exceptionalRequestCount;
      } else {
        this.leavesHeader.push({
          name: "Exceptional Leave",
          total_days: exceptionalTotalDays,
          request_count: exceptionalRequestCount,
        });
      }
    }
    if (exceptionalTotalDayes > 0 || exceptionalRequestCounts > 0) {
      const exceptionalLeaveEntrys = this.leavesPendingHeader.find(
        (header) => header.name === "Exceptional Leave"
      );
      if (exceptionalLeaveEntrys) {
        exceptionalLeaveEntrys.total_days = exceptionalTotalDayes;
        exceptionalLeaveEntrys.request_count = exceptionalRequestCounts;
      } else {
        this.leavesPendingHeader.push({
          name: "Exceptional Leave",
          total_days: exceptionalTotalDayes,
          request_count: exceptionalRequestCounts,
        });
      }
    }

    // console.log(this.leavesHeader, "leavesHeader**");
    // console.log(this.leavesDeclineHeader, "leavesDeclineHeader**");
    this.spinner.hide();
  }

  EmployeeAvialAttendanceSummaryById() {
    this.employeePresentData = "";
    let postData = {
      orgID: this.singleEmployeeData.org_id,
      empId: this.singleEmployeeData.id,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.employeeService
      .EmployeeAvialAttendanceSummaryById(postData)
      .subscribe((presentData: any) => {
        presentData.map((elem, i) => {
          let checkIfExist = presentData.filter(
            (itm) => itm.timesheet_id === elem.timesheet_id
          );
          if (checkIfExist.length == 2) {
            if (
              checkIfExist[0].reasons_name === null ||
              checkIfExist[0].lat === null
            ) {
              presentData.splice(i, 1);
            }
          }
        });
        this.employeePresentData = presentData;
      });
  }

  EmployeeAttendanceSummaryById() {
    this.employeeAbsentData = "";
    let postData: any = {
      orgID: this.singleEmployeeData.org_id,
      empId: this.singleEmployeeData.id,
      fromDate: this.fromDate,
    };
    let year = this.fromDate.toString().split("/");
    if (parseFloat(year[2]) < 2022) {
      postData.toDate = "12/31/2021";
      this.employeeService
        .EmployeeAttendanceSummaryById(postData)
        .subscribe((absentData1: any) => {
          let abserntArray = [];
          absentData1.map((elm, i) => {
            let empAb = {
              name: this.singleEmployeeData.full_name,
              date: elm,
              day: this.returnDay(elm),
            };
            abserntArray.push(empAb);
            if (absentData1.length === i + 1) {
              let postData2: any = {
                orgID: this.singleEmployeeData.org_id,
                empId: this.singleEmployeeData.id,
                fromDate: "01/01/2022",
                toDate: this.toDate,
              };
              this.employeeService
                .EmployeeAttendanceSummaryById(postData2)
                .subscribe((absentData2: any) => {
                  absentData2.map((elm2, i) => {
                    let empAb = {
                      name: this.singleEmployeeData.full_name,
                      date: elm2,
                      day: this.returnDay(elm2),
                    };
                    abserntArray.push(empAb);
                    if (absentData2.length === i + 1) {
                      this.employeeAbsentData = abserntArray;
                    }
                  });
                });
            }
          });
        });
    } else {
      postData.toDate = this.toDate;
      this.employeeService
        .EmployeeAttendanceSummaryById(postData)
        .subscribe((absentData1: any) => {
          let abserntArray = [];
          if (absentData1.length !== 0) {
            absentData1.map((elm, i) => {
              let empAb = {
                name: this.singleEmployeeData.full_name,
                date: elm,
                day: this.returnDay(elm),
              };
              abserntArray.push(empAb);
              if (absentData1.length === i + 1) {
                this.employeeAbsentData = abserntArray;
              }
            });
          } else {
            this.employeeAbsentData = abserntArray;
          }
        });
    }
  }

  async EmployeeAllLeaveSummaryById() {
    const postData = {
      orgID: this.singleEmployeeData.org_id,
      empId: this.singleEmployeeData.id,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };

    try {
      // Request both approved and pending leave data in parallel
      const [approvedLeave] = await Promise.all([
        this.employeeService.EmployeeAllLeaveSummaryById(postData).toPromise(),
        // this.employeeService.EmployeePendingLeaveSummaryById(postData).toPromise()
      ]);

      // Separate approved leave data by leave_status
      this.employeeLeaveData = approvedLeave || [];
      this.employeeApprovedLeaveData = this.employeeLeaveData.filter(
        (leave: any) => leave.leave_status === "approved"
      );
      this.employeePendingLeaveData = this.employeeLeaveData.filter(
        (leave: any) => leave.leave_status === "pending"
      );
      this.employeedeclineddata = this.employeeLeaveData.filter(
        (leave: any) => leave.leave_status === "declined"
      );

      // Set pending leave data if available

      // console.log("All Leave Data", this.employeeLeaveData);
      // console.log("Approved Leave", this.employeeApprovedLeaveData);
      // console.log("Pending Leave", this.employeePendingLeaveData);
      // console.log("Decline Leave", this.employeedeclineddata);

      // Fetch leave history after both leave data are set
      await this.getEmployeeLeaveHistory(this.singleEmployeeData.id);
    } catch (error) {
      console.error("Error fetching leave summaries:", error);
    }
  }

  GetTimeSheetOverridebyEmpID() {
    this.employeeCheckInOutOverrideData = "";
    let postData = {
      orgID: this.singleEmployeeData.id,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.employeeService
      .GetTimeSheetOverridebyEmpID(postData)
      .subscribe((OverrideData: any) => {
        this.employeeCheckInOutOverrideData = OverrideData;
      });
  }

  LocationExceptionByEmpIdAndDate() {
    this.employeeLocationData = "";
    let postData = {
      orgID: this.singleEmployeeData.id,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.employeeService
      .LocationExceptionByEmpIdAndDate(postData)
      .subscribe((locationdata: any) => {
        this.employeeLocationData = locationdata;
      });
  }

  TimeSheetBreakByEmpIdAndDate() {
    let daycount;
    this.employeeBreakData = "";
    let postData = {
      orgID: this.singleEmployeeData.id,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.employeeService
      .TimeSheetBreakByEmpIdAndDate(postData)
      .subscribe((BreakData: any) => {
        this.employeeBreakData = BreakData;
        BreakData.map((item) => {
          item.ondate = moment(item.ondate).format("L");
        });
        daycount = _.groupBy(BreakData, "ondate");
        this.breakdaycount = Object.keys(daycount).length;
        this.GroupedTimeSheetBreakByEmpIdAndDate();
      });
  }

  GroupedTimeSheetBreakByEmpIdAndDate() {
    let postData = {
      orgID: this.singleEmployeeData.id,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.employeeService
      .GroupedTimeSheetBreakByEmpIdAndDate(postData)
      .subscribe((GrpBreak: any) => {
        this.employeeBreakData.map((main) => {
          GrpBreak.map((item) => {
            item.ondate = moment(item.ondate).format("L");
            if (main.ondate === item.ondate) {
              if (item.totalTime != null || item.totalTime != "") {
                main.ondate = (
                  main.ondate.toString() +
                  "      Total Break Hours :  " +
                  item.totalTime.split(":")[0] +
                  " Hours,  " +
                  item.totalTime.split(":")[1] +
                  " Minutes"
                ).toString();
              }
            }
          });
        });
      });
  }

  strToMins(t) {
    var s = t.split(":");
    return Number(s[0]) * 60 + Number(s[1]);
  }
  minsToStr(t) {
    return Math.trunc(t / 60) + ":" + ("00" + (t % 60)).slice(-2);
  }

  strTODays(t) {
    var s = t.split(":");
    this.lessdays = (s[0] / 9).toString().split(".")[0];
    this.lesshrs = s[0] % 9;
    this.lessmins = s[1];
  }

  OverstrTODays(t) {
    var s = t.split(":");
    this.overdays = (s[0] / 9).toString().split(".")[0];
    this.overhrs = s[0] % 9;
    this.overmins = s[1];
  }

  GetLessHoursWrkbyEmpID() {
    this.lessHoursWrkbyEmpIDData = [];
    let postData = {
      orgID: this.singleEmployeeData.id,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.employeeService
      .GetLessHoursWrkbyEmpID(postData)
      .subscribe((lessHrsData: any) => {
        if (lessHrsData != null) {
          lessHrsData.map((el: any) => {
            var time1 = "09:00";
            var time2 = el.total_hrs;
            el.diff = this.minsToStr(
              this.strToMins(time1) - this.strToMins(time2)
            );
          });

          this.employeeService
            .GetLessHoursWrkbyHlfEmpID(postData)
            .subscribe((lesshalf: any) => {
              lesshalf.map((el: any) => {
                var time1 = "05:00";
                var time2 = el.total_hrs;
                el.diff = this.minsToStr(
                  this.strToMins(time1) - this.strToMins(time2)
                );
                lessHrsData.push(el);
              });

              this.lessHoursWrkbyEmpIDData = lessHrsData;
              this.totlesshh = "00:00";
              //total hours calculated here
              for (var i = 0; i < lessHrsData.length; i++) {
                this.totlesshh = this.minsToStr(
                  this.strToMins(this.totlesshh) +
                    this.strToMins(lessHrsData[i].diff)
                );
                //console.log("diffrence", totlesshours);
              }
              this.strTODays(this.totlesshh);
            });
        }
      });
  }

  //want to change
  GetOverTimeWrkbyEmpID() {
    this.OverTimeWrkbyEmpIDData = [];
    let postData = {
      orgID: this.singleEmployeeData.id,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.employeeService
      .GetOverTimeWrkbyEmpID(postData)
      .subscribe((lessHrsData: any) => {
        if (lessHrsData != null) {
          lessHrsData.map((el: any) => {
            var time1 = "09:00";
            var time2 = el.total_hrs;
            el.diff = this.minsToStr(
              this.strToMins(time2) - this.strToMins(time1)
            );
          });
          this.employeeService
            .GetOverTimeWrkbyHlfEmpID(postData)
            .subscribe((overhalf: any) => {
              if (overhalf != null) {
                overhalf.map((el) => {
                  var time1 = "05:00";
                  var time2 = el.total_hrs;
                  el.diff = this.minsToStr(
                    this.strToMins(time2) - this.strToMins(time1)
                  );
                  lessHrsData.push(el);
                });

                this.OverTimeWrkbyEmpIDData = lessHrsData;
                this.totloverhh = "00:00";
                //total hours calculated here
                for (var i = 0; i < lessHrsData.length; i++) {
                  this.totloverhh = this.minsToStr(
                    this.strToMins(this.totloverhh) +
                      this.strToMins(lessHrsData[i].diff)
                  );
                  //console.log("diffrence", totlesshours);
                }
                this.OverstrTODays(this.totloverhh);
              }
            });
        } else {
          //this.lessHoursWrkbyEmpIDData = [];
          this.OverstrTODays("00:00");
        }
      });
  }

  calculateMonthsAndDays(startDateString) {
    // Parse the date from "MM/DD/YYYY HH:MM:SS AM/PM" format
    let [datePart, timePart = "12:00:00", meridiem = "AM"] = startDateString.split(" ");
    let [month, day, year] = datePart.split("/").map(Number);
    let [hours, minutes, seconds] = timePart.split(":").map(Number);

    // Convert to 24-hour format
    let hour24 =
      meridiem === "PM" && hours !== 12 ? hours + 12 :
      meridiem === "AM" && hours === 12 ? 0 :
      hours;

    // Create Date objects in UTC to prevent timezone discrepancies
    let startDate = new Date(Date.UTC(year, month - 1, day, hour24, minutes, seconds));
    let currentDate = new Date();

    // Calculate months difference
    let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
    months += currentDate.getMonth() - startDate.getMonth();

    // Adjust day difference
    let days = currentDate.getDate() - startDate.getDate();
    if (days < 0) {
      months -= 1;
      let prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
      days += prevMonthLastDate;
    }

    // Apply the multiplier (months * 2.5)
    this.multipliedMonths = months * 2.5;

    // Format result
    let resultString = `${months} Months and ${days} Days`;
    this.datecalculator = resultString;
    console.log("Date Formatter:", this.datecalculator);
    return resultString;
  }


  calculateMonthsAndDaysNormal(startDateInput, endDateInput) {
    console.log("Date  of startDateInput:", startDateInput);
    console.log("Date  of endDateInput:", endDateInput);

    // Helper function to parse date string in "MM/DD/YYYY HH:MM:SS AM/PM" format
    function parseDate(dateInput) {
      if (typeof dateInput === "string") {
        const [datePart, timePart, meridiem] = dateInput.split(" ");
        const [month, day, year] = datePart.split("/").map(Number);
        const [hours, minutes, seconds] = timePart.split(":").map(Number);
        const hour24 =
          meridiem === "PM" && hours !== 12
            ? hours + 12
            : meridiem === "AM" && hours === 12
            ? 0
            : hours;
        return new Date(year, month - 1, day, hour24, minutes, seconds);
      } else if (dateInput instanceof Date) {
        return dateInput; // Already a Date object
      } else {
        throw new Error(
          "Invalid date input type. Must be a string or Date object."
        );
      }
    }

    // Parse both the start and end dates
    const startDate = parseDate(startDateInput);
    const endDate = parseDate(endDateInput);

    // Calculate total months difference
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months += endDate.getMonth() - startDate.getMonth();

    // Adjust if the day of the end date is before the start date's day
    let days = endDate.getDate() - startDate.getDate();
    if (days < 0) {
      months -= 1; // Go back one month
      const previousMonth = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        0
      ); // Get the last day of the previous month
      days += previousMonth.getDate(); // Add days in previous month to adjust
    }

    // Format the result as a string
    const resultnorString = `${months} Months and ${days} Days`;
    console.log("Date difference:", resultnorString);
    this.calnordays = resultnorString;
    console.log("Formatted result:", this.calnordays);
    return resultnorString;
  }

  calculateMonthsAndDaysopen(startDateInput, endDateInput) {
    console.log("Date Type of startDateInput:", typeof startDateInput);
    console.log("Date Type of endDateInput:", typeof endDateInput);

    // Helper function to parse date string or handle Date objects
    function parseDate(dateInput) {
      if (typeof dateInput === "string") {
        const [datePart, timePart, meridiem] = dateInput.split(" ");
        const [month, day, year] = datePart.split("/").map(Number);
        const [hours, minutes, seconds] = timePart.split(":").map(Number);
        const hour24 =
          meridiem === "PM" && hours !== 12
            ? hours + 12
            : meridiem === "AM" && hours === 12
            ? 0
            : hours;
        return new Date(year, month - 1, day, hour24, minutes, seconds);
      } else if (dateInput instanceof Date) {
        return dateInput; // Already a Date object
      } else {
        throw new Error(
          "Invalid date input type. Must be a string or Date object."
        );
      }
    }

    // Parse both the start and end dates
    const startDate = parseDate(startDateInput);
    const endDate = parseDate(endDateInput);

    // Calculate total months difference
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months += endDate.getMonth() - startDate.getMonth();

    // Adjust if the day of the end date is before the start date's day
    let days = endDate.getDate() - startDate.getDate();
    if (days < 0) {
      months -= 1; // Go back one month
      const previousMonth = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        0
      ); // Get the last day of the previous month
      days += previousMonth.getDate(); // Add days in previous month to adjust
    }

    // Format the result as a string
    const resultopenString = `${months} Months and ${days} Days`;
    console.log("Date difference:", resultopenString);
    this.calopendays = resultopenString;
    console.log("Formatted result:", this.calopendays);
    return resultopenString;
  }

  returnDay(date) {
    var oneDate = moment(date, "MM-DD-YYYY");
    var dayName = oneDate.format("dddd");
    return dayName;
  }

  closeSingleEmp() {
    let backToPayroll = false;
    let emp_id = "";
    let payroll_id = "";
    this.route.queryParams.subscribe((params) => {
      let encrypted = params["key"];
      console.log(encrypted, "encrypted");
      emp_id = this.xorEncryptDecrypt(encrypted, this.key);
      console.log(emp_id, "emp_id");
      payroll_id = params["id"];
      if (emp_id != "" && payroll_id != "") {
        backToPayroll = true;
      } else {
        backToPayroll = false;
      }
    });
    if (this.restrictedUserView && !backToPayroll) {
      this.Router.navigate(["dashboard-user"]);
    } else if (this.restrictedUserView && backToPayroll) {
      // this.Router.navigate(["Payroll"]);
      this.Router.navigate(["Payroll"], {
        queryParams: { key: emp_id, dest: "EmpView", id: payroll_id },
      });
    } else {
      this.singleEmployeePage = false;
      this.employeePresentData = "";
      this.employeeAbsentData = "";
      this.employeeApprovedLeaveData = "";
      this.employeeCheckInOutOverrideData = "";
      this.employeeBreakData = "";
      this.employeeLocationData = "";
      this.lessHoursWrkbyEmpIDData = "";
      this.OverTimeWrkbyEmpIDData = "";
      this.repaddocs = [];
      this.esdocs = [
        { docname: "Passport", docexp: "", status: "pending", crdate: "" },
        { docname: "Labour ID", docexp: "", status: "pending", crdate: "" },
        { docname: "Visa", docexp: "", status: "pending", crdate: "" },
        { docname: "Emirates ID", docexp: "", status: "pending", crdate: "" },
        { docname: "Insurance", docexp: "", status: "pending", crdate: "" },
      ];
      this.dateRgeFrm.reset();
      this.fromDate = moment().startOf("month").format("L");
      this.toDate = moment().format("L");
      localStorage.removeItem("emp_id");
      this.getEmlpoyeeSummaryReport();
    }
  }

  empTableSearchKeyUp(): void {
    document
      .getElementById(this.empTabledataTableGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.empTabledataTableGrid.search(
          (event.target as HTMLInputElement).value
        );
      });
  }

  singleEmpGridDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case "Excel Export":
        this.singleEmpPresentGrid.excelExport();
        break;
    }
  }

  employeeSummaryListDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case "Excel Export":
        this.employeeList.excelExport();
        break;
    }
  }

  singleEmpAbGridDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case "Excel Export":
        this.singleEmpAbsentGrid.excelExport();
        break;
    }
  }

  singleEmpALGridDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case "Excel Export":
        this.singleEmpAssignedLeaveGrid.excelExport();
        break;
    }
  }

  lessHoursWrkbyEmpIDDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case "Excel Export":
        this.lessHoursWrkbyEmpIDGrid.excelExport();
        break;
    }
  }

  employeeBreakDataDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case "Excel Export":
        this.breakdatagrid.excelExport();
        break;
    }
  }

  employeeLocationDataDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case "ExcelExport":
        this.locationexceptionGrid.excelExport();
        break;
    }
  }

  //Fill the Document Details to the Employee page!
  filldocdetails() {
    let adddata;
    this.repaddocs = [];
    this.employeeService
      .GetDocumentsByempIdwithDelete({
        id: localStorage.getItem("emp_id").toString(),
      })
      .subscribe((data: any) => {
        if (data != null) {
          this.esdocs = [
            {
              docid: "",
              docname: "Passport",
              docexp: "",
              status: "pending",
              crdate: "",
            },
            { docname: "Labour ID", docexp: "", status: "pending", crdate: "" },
            { docname: "Visa", docexp: "", status: "pending", crdate: "" },
            {
              docname: "Emirates ID",
              docexp: "",
              status: "pending",
              crdate: "",
            },
            { docname: "Insurance", docexp: "", status: "pending", crdate: "" },
          ];
          data.map((elm) => {
            if (elm.is_essential_doc == true && elm.related_to == "original") {
              if (elm.doc_action == "delete" || elm.doc_action == "complete")
                for (var i = 0; i < this.esdocs.length; i++) {
                  if (elm.name === this.esdocs[i].docname) {
                    this.esdocs[i].docid = elm.id;
                    this.esdocs[i].status =
                      elm.status == null ? "Active" : elm.status;
                    this.esdocs[i].crdate = elm.created_date;
                    this.esdocs[i].docexp = elm.doc_exp_date;
                  }
                }
            } else {
              if (elm.related_to == "original") {
                if (
                  elm.doc_action == "delete" ||
                  elm.doc_action == "complete"
                ) {
                  adddata = {
                    docid: elm.id,
                    docname: elm.name,
                    docexp: moment(elm.doc_exp_date).format("L").toString(),
                    status: elm.status == null ? "Active" : elm.status,
                    crdate: moment(elm.created_date).format("L").toString(),
                  };
                  this.repaddocs.push(adddata);
                }
              }
            }
          });
        }
      });
  }

  viewEssentalDoc(docname) {
    let docexist = false;
    let repdocurl = "";
    this.employeeService
      .GetDocumentsByempId({ id: localStorage.getItem("emp_id").toString() })
      .subscribe((data: any) => {
        if (data != null) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].name === docname) {
              repdocurl = data[i].url.toString();
              docexist = true;
              window.open(repdocurl, "_blank");
            }
          }
          if (!docexist) {
            Swal.fire("Oops!", "There is no Document Uploaded!", "warning");
          }
        } else {
          console.log("somthing wrong in viewing the document");
        }
      });
  }

  downloadBtn = document.createElement("button");
  sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  downloadDoc(docname) {
    let docexist = false;
    let repdocurl = "";
    this.employeeService
      .GetDocumentsByempId(
        '"' + localStorage.getItem("emp_id").toString() + '"'
      )
      .subscribe((data: any) => {
        if (data != null) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].name === docname) {
              repdocurl = data[i].url.toString();
              console.log(repdocurl);
              docexist = true;
              fetch(repdocurl)
                .then((res) => res.blob())
                .then((file) => {
                  let tempUrl = URL.createObjectURL(file);
                  const aTag = document.createElement("a");
                  aTag.href = tempUrl;
                  aTag.download =
                    docname + repdocurl.substring(repdocurl.lastIndexOf("."));
                  document.body.appendChild(aTag);
                  aTag.click();
                  this.downloadBtn.innerText = "Download File";
                  URL.revokeObjectURL(tempUrl);
                  aTag.remove();
                })
                .catch(() => {
                  alert("Failed to download file!");
                  this.downloadBtn.innerText = "Download File";
                });
            }
          }
          if (!docexist) {
            Swal.fire("Oops!", "There is no Document Uploaded!", "warning");
          } else {
            this.sleep(1000).then(() => {
              this.toast.success(docname + " is downloaded successfully!");
            });
          }
        } else {
          console.log("Somthing wrong in viewing the document");
        }
      });
  }

  dateTriger() {
    console.log("date trigered");
  }

  //For Variable Pay
  public AddVaraiableForm: FormGroup;
  VarItem = [
    { id: "Commision", text: "Commision" },
    { id: "Incentive", text: "Incentive" },
    { id: "Arrear Adjustment", text: "Arrear Adjustment" },
    { id: "Leave Encashment", text: "Leave Encashment" },
    { id: "Overtime", text: "Overtime" },
  ];

  openAddVariablePay() {
    this.modalService.open(this.variablepayModel);
    this.AddVaraiableForm = new FormGroup({
      reffid: new FormControl("", [Validators.required]),
      item: new FormControl("select", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      payroll: new FormControl("Pending", [Validators.required]),
      startdate: new FormControl("", [Validators.required]),
      enddate: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
    });

    this.AddVaraiableForm.patchValue({
      reffid: this.generateRandomReferenceKey(),
    });
  }

  submitVariablePay() {
    let postData;
    let formData = this.AddVaraiableForm.value;
    let user_Info = JSON.parse(localStorage.getItem("user_info"));
    let empId = localStorage.getItem("emp_id");

    postData = {
      reference_id: formData.reffid,
      org_id: user_Info.org_id,
      emp_id: empId,
      pay_item: formData.item,
      amount: formData.amount,
      remarks: formData.remark,
      status: "Approved",
      assc_start_date: moment(formData.startdate).format("L"),
      assc_end_date: moment(formData.enddate).format("L"),
      is_deleted: false,
      modified_by: user_Info.id,
      created_by: user_Info.id,
    };

    if (this.addPayrollPaymentsFullAccess) {
      console.log("postData", postData);
      this.payrollService
        .AddPayrollVariablePay(postData)
        .subscribe((rsp: any) => {
          if (rsp) {
            console.log("rsp", rsp);
            if ((rsp.status = "200")) {
              this.toast.success(rsp.desc);
              this.getPayrollData(empId);
              this.closeModel();
            } else {
              this.closeModel();
              this.toast.error("Somthing went worng, Please try Again!");
            }
          }
        });
    } else {
      postData.approver1_roleId = this.createPayrollPaymentApprover1rollId;
      postData.status = "Pending";
      if (this.isDualApproverPayrollPayments)
        postData.approver2_roleId = this.createPayrollPaymentApprover2rollId;

      this.payrollService
        .AddPayrollVariablePay(postData)
        .subscribe((rsp: any) => {
          if (rsp) {
            console.log("rsp", rsp);
            if ((rsp.status = "200")) {
              this.toast.success(rsp.desc);
              this.getPayrollData(empId);
              this.closeModel();
            } else {
              this.closeModel();
              this.toast.error("Somthing went worng, Please try Again!");
            }
          }
        });
    }
  }

  // For adjustment
  public AddAdjustmentForm: FormGroup;

  termCount = 2;

  payrollmonth = [
    {
      id: "Pending ",
      text: "Pending",
    },
    {
      id: "January 2024",
      text: "January 2024",
    },
    {
      id: "February 2024",
      text: "February 2024",
    },
    {
      id: "March 2024",
      text: "March 2024",
    },
    {
      id: "April 2024",
      text: "April 2024",
    },
    {
      id: "May 2024",
      text: "May 2024",
    },
    {
      id: "June 2024",
      text: "June 2024",
    },
  ];
  payrollMonthHistory = [];

  adjList = [
    {
      type: "Deduction",
      name: "Loan",
      amount: "2000",
      payrollmonth: "01/02/2024",
      date_incurred: "01/23/2024",
      remark: "Re Installment of the loan amount",
      doc_url: "img",
    },
    {
      type: "Deduction",
      name: "Loan",
      amount: "2000",
      payrollmonth: "01/02/2024",
      date_incurred: "01/23/2024",
      remark: "Re Installment of the loan amount",
      doc_url: "img",
    },
    {
      type: "Deduction",
      name: "Loan",
      amount: "2000",
      payrollmonth: "01/02/2024",
      date_incurred: "01/23/2024",
      remark: "Re Installment of the loan amount",
      doc_url: "img",
    },
  ];
  adjType = [
    { id: "Addition", text: "Addition" },
    { id: "Deduction", text: "Deduction" },
    { id: "Recurring Deduction", text: "Recurring Deduction" },
  ];
  adjItem = [
    { id: "Absence", text: "Absence" },
    { id: "Advance", text: "Advance" },
    { id: "Arrear Adjustment", text: "Arrear Adjustment" },
    { id: "Leave Salary", text: "Leave Salary" },
    { id: "Loan", text: "Loan" },
    { id: "Fine", text: "Fine" },
  ];
  termDetails = [];
  totalAmount = 0.0;
  totalAmountString = "AED 0.00";
  showRecurring = false;

  openAddAdjustment() {
    this.modalService.open(this.adjustmentModel);
    this.AddAdjustmentForm = new FormGroup({
      reffid: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      item: new FormControl("", [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
      payrollMonth: new FormControl("Pending", [Validators.required]),
      dateincurred: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
    });

    this.AddAdjustmentForm.patchValue({
      type: this.adjType[0].id,
      item: this.adjItem[0].id,
      payrollMonth: this.payrollmonth[0].id,
      reffid: this.generateRandomReferenceKey(),
    });
    this.termDetails = [];
    this.showRecurring = false;
    this.termCount = 2;
    this.adjDocUrl = "";
  }

  async submitAdjustment() {
    console.log("Submitted the Adjustment");
    let postData;
    let formData = this.AddAdjustmentForm.value;
    let user_Info = JSON.parse(localStorage.getItem("user_info"));
    let empId = localStorage.getItem("emp_id");

    postData = {
      org_id: user_Info.org_id,
      reference_id: formData.reffid,
      emp_id: empId,
      payroll_id: formData.payroll,
      pay_item: formData.item,
      type: formData.type,
      amount: formData.amount,
      date_incurred: moment(formData.dateincurred).format("L"),
      doc_url: this.adjDocUrl,
      remarks: formData.remark,
      created_by: user_Info.id,
      modified_by: user_Info.id,
      is_deleted: false,
    };

    if (this.addPayrollPaymentsFullAccess) {
      postData.status = "Approved";
    } else {
      postData.status = "Pending";
      postData.approver1_roleId = this.createPayrollPaymentApprover1rollId;
      if (this.isDualApproverPayrollPayments)
        postData.approver2_roleId = this.createPayrollPaymentApprover2rollId;
    }

    if (formData.type == "Recurring Deduction") {
      //format of termDetails : { index: i+1, payroll_term, amountstring, amount }
      for (let i = 0; i < this.termCount; i++) {
        postData.amount = this.termDetails[i].amount;
        //postData.payroll_id = this.termDetails[i].payroll_term;
        postData.terms = i + 1;
        await new Promise((resolve) => {
          this.payrollService
            .AddPayrollAdjustments(postData)
            .subscribe((rsp: any) => {
              if (rsp.status == "200") {
                console.log("Adding successfull");
                resolve(i);
              }
            });
        });
      }
      this.toast.success(
        "Recurring Dedution Payments has Been Added Successfully!"
      );
      this.getPayrollData(empId);
      this.closeModel();
    } else {
      console.log("post Data", postData);
      this.payrollService
        .AddPayrollAdjustments(postData)
        .subscribe((rsp: any) => {
          if (rsp) {
            this.getPayrollData(empId);
            this.toast.success(rsp.desc);
            this.closeModel();
          }
        });
    }
  }

  adjDocUrl = "";
  isadjDocUp = false;
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
          this.isadjDocUp = true;
          this.adjDocUrl = imData.secure_url;
          this.spinner.hide();
        }
      });
    }
  }

  DocDelete() {
    this.adjDocUrl = "";
    this.isadjDocUp = false;
  }

  changeAdjTyp(evnt) {
    console.log("Change from: ", evnt);
    if (evnt.itemData.id == "Addition") {
      this.showRecurring = false;
    }
    if (evnt.itemData.id == "Deduction") {
      this.showRecurring = false;
    }
    if (evnt.itemData.id == "Recurring Deduction") {
      this.showRecurring = true;
      this.generateTermDetails();
    }
  }

  changeTermCount(action) {
    if (action == "plus") {
      if (this.termCount < 6) {
        this.termCount = this.termCount + 1;
        this.generateTermDetails();
      } else {
        this.toast.warning("Recurring Adjustment cannot be more than 6 Months");
      }
    }
    if (action == "minus") {
      if (this.termCount > 2) {
        this.termCount = this.termCount - 1;
        this.generateTermDetails();
      } else {
        this.toast.warning("Recurring Adjustment cannot be less than 2 Months");
      }
    }
  }

  generateTermDetails() {
    this.termDetails = [];
    this.totalAmount = parseFloat(
      this.AddAdjustmentForm.value.amount.toFixed(2)
    );
    this.totalAmountString = this.formatCurrency(this.totalAmount);
    let amnt = this.totalAmount / this.termCount;
    let amntstr = this.formatCurrency(amnt);
    for (let i = 0; i < this.termCount; i++) {
      this.termDetails.push({
        index: i + 1,
        payroll_term: this.payrollmonth[i + 1].id,
        amountstring: amntstr,
        amount: amnt,
      });
    }
  }

  //For Reimbursement
  public AddReimbursementForm: FormGroup;

  rembItem = [
    { id: "Travel Expenses", text: "Travel Expenses" },
    { id: "Office Supplies", text: "Office Supplies" },
    { id: "Utility Bills", text: "Utility Bills" },
    { id: "Training and Development", text: "Training and Development" },
    { id: "Health and Wellness", text: "Health and Wellness" },
    { id: "Miscellaneous Expenses", text: "Miscellaneous Expenses" },
  ];

  openAddReimbersment() {
    this.modalService.open(this.reimbursmentModel);
    this.AddReimbursementForm = new FormGroup({
      reffid: new FormControl("", [Validators.required]),
      type: new FormControl("Addition", [Validators.required]),
      item: new FormControl("Absence", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      payrollMonth: new FormControl("Pending", [Validators.required]),
      dateincurred: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
    });

    this.AddReimbursementForm.patchValue({
      reffid: this.generateRandomReferenceKey(),
    });
  }

  submitReimbersment() {
    let postData;
    let formData = this.AddVaraiableForm.value;
    let user_Info = JSON.parse(localStorage.getItem("user_info"));
    let empId = localStorage.getItem("emp_id");

    postData = {
      org_id: user_Info.org_id,
      emp_id: empId,
      pay_item: formData.item,
      amount: formData.amount,
      doc_url: this.adjDocUrl,
      remarks: formData.remark,
      status: "Approved",
      date_incurred: moment(formData.dateincurred).format("L"),
      is_deleted: false,
      created_by: user_Info.id,
      modified_by: user_Info.id,
      reference_id: formData.reffid,
    };

    if (this.addPayrollPaymentsFullAccess) {
      console.log("postData", postData);
      this.payrollService
        .AddPayrollWorkExpenses(postData)
        .subscribe((rsp: any) => {
          if (rsp) {
            console.log("rsp", rsp);
            if ((rsp.status = "200")) {
              this.toast.success(rsp.desc);
            } else {
              this.toast.error("Somthing went worng, Please try Again!");
            }
          }
        });
    } else {
      postData.approver1_roleId = this.createPayrollPaymentApprover1rollId;
      postData.status = "Pending";
      if (this.isDualApproverPayrollPayments)
        postData.approver2_roleId = this.createPayrollPaymentApprover2rollId;

      this.payrollService
        .AddPayrollWorkExpenses(postData)
        .subscribe((rsp: any) => {
          if (rsp) {
            console.log("rsp", rsp);
            if ((rsp.status = "200")) {
              this.toast.success(rsp.desc);
              this.getPayrollData(empId);
              this.closeModel();
            } else {
              this.toast.error("Somthing went worng, Please try Again!");
            }
          }
        });
    }
  }

  //For LoanPayments
  public AddLoanPaymentsForm: FormGroup;

  openLoanPayments() {
    this.modalService.open(this.reimbursmentModel);
    this.AddReimbursementForm = new FormGroup({
      reffid: new FormControl("", [Validators.required]),
      type: new FormControl("Addition", [Validators.required]),
      item: new FormControl("Absence", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      payrollMonth: new FormControl("Pending", [Validators.required]),
      dateincurred: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
    });

    this.AddReimbursementForm.patchValue({
      reffid: this.generateRandomReferenceKey(),
    });
  }

  //Common utilities

  generateRandomReferenceKey(length = 8) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if (this.checkKey(result)) {
      return result;
    } else {
      this.generateRandomReferenceKey();
    }
  }

  checkKey(key): boolean {
    //!!!write the code to check if the key is duplicating
    return true;
  }

  formatCurrency(amount: number): string {
    const formattedAmount = amount.toFixed(2);
    return `AED ${formattedAmount}`;
  }

  changePayrollMonthFrm(evnt) {
    console.log("Change in Payroll month", evnt);
  }

  closeModel() {
    this.modalService.dismissAll();
    this.adjDocUrl = "";
    this.isadjDocUp = false;
    this.showRecurring = false;
    this.termCount = 2;
    this.termDetails = [];
    //!!!want to add the initail values for the changes status part
  }

  goToLink() {
    window.open(this.adjDocUrl, "_blank");
  }

  goToLinkdoc(doc_url) {
    // let doc_url = this.PaymentMethodForm.get('document').value
    console.log(doc_url, "doc!");
    if (doc_url != null && doc_url != "") {
      window.open(doc_url, "_blank");
    } else {
      this.toast.warning("Document Not Uploaded!");
    }
  }

  lastWorkForm: FormGroup;
  dateOptions: string[] = ["Contract End Date", "Labour End Date", "Custom"];

  gtData = {
    status: "Pending",
    year_of_service: 0,
    gratuity_total: 0.0,
    gtStartYear: 0,
    gtSecondYear: 0,
    gtCalcDayOne: 0,
    gtCalcDayTwo: 0,
    joined_date: "",
    con_start: "",
    con_end: "",
    labour_exp_date: "",
    basicsalary: 0,
    end_date: "",
    basic_perdaysal: 0,
  };

  onSubmit() {
    const formData = this.lastWorkForm.value;
    console.log("Form Data:", formData);

    let postdata = {
      emp_id: localStorage.getItem("emp_id"),
      end_date_by: formData.lastDateOfWork,
      end_date: "10/09/2024",
    };

    if (formData.lastDateOfWork === "Custom" && formData.customDate) {
      console.log("Selected Custom Date:", formData.customDate);
      postdata.end_date = formData.customDate;
    }
    this.payrollService
      .CalculateFinalSettlement(postdata)
      .subscribe((rsp: any) => {
        if (rsp) {
          console.log("rsp", rsp);
          if (rsp[0].status == "Eligible") {
            this.gtData = rsp[0];
            this.toast.success("The employee is eligible for Gratuity");
          }
          if (rsp[0].status == "Not Eligible") {
            this.toast.error("The employee is not eligible for Gratuity");
          }
        }
      });
  }

  async onTabChange(e: any) {
    const selectedIndex = e.selectedIndex;
    console.log(selectedIndex, e, "TEST IND");
    if (selectedIndex == 7) {
      await this.handleGratuity();
    }
  }
  async handleGratuity() {
    let isTerminated=this.singleEmployeeData.term_end_date?true:false;
    this.gratuityCompData={
      singleEmployeeData:this.singleEmployeeData,
      SinEmpData:this.SinEmpData,
      filteredEmpadjaddList:this.filteredEmpadjaddList,
      filteredEmpvariableList:this.filteredEmpvariableList,
      filteredEmpLoanAddList:this.filteredEmpLoanAddList,
      filteredEmpexpenssList:this.filteredEmpexpenssList,
      filteredEmpadjdeducList:this.filteredEmpadjdeducList,
      filteredEmpLoanDeductList:this.filteredEmpLoanDeductList,
      isTerminated:isTerminated,
    }
  }

  async HandleFinalSalary() {
    console.log(this.EmpSalData, "this.EmpSalData Before");
    let activePayroll = this.payrollListing.find(
      (i) =>
        i.status === "Active" ||
        i.status === "Pending" ||
        i.status === "Approved"
    );

    if (activePayroll && activePayroll.id) {
      await this.getPayrollDetailsByPayrollId(activePayroll.id);
    } else {
      console.warn("No valid payroll with desired status found.");
    }
  }
  generateDescription(basicSalary, yearsOfService, gratuityTotal) {
    let roundedYearsOfService = yearsOfService.toFixed(2);
    let description = {
      intro: "",
      calculation: "",
      total: `Total Gratuity: AED ${gratuityTotal}`,
    };

    if (roundedYearsOfService < 1) {
      description.intro =
        "The employee has served less than 1 year and is not entitled to any gratuity pay.";
    } else if (roundedYearsOfService <= 5) {
      description.intro = `The employee has served ${roundedYearsOfService} year(s), entitling them to 21 days of basic salary per year of service.`;
      description.calculation =
        `Gratuity Calculation:\n` +
        ` 21 days / 360 days * Basic Salary * ${roundedYearsOfService} years\n` +
        `= AED (21 / 360) * ${basicSalary} * ${roundedYearsOfService}`;
    } else {
      description.intro =
        `The employee has served ${roundedYearsOfService} years, entitling them to:\n` +
        ` 21 days of basic salary per year for the first 5 years\n` +
        ` 30 days of basic salary per year for each additional year after 5 years`;

      description.calculation =
        `Gratuity Calculation:\n` +
        `For the first 5 years:\n` +
        ` 21 days / 360 days * Basic Salary * 5 years\n` +
        `For years beyond 5:\n` +
        ` 30 days / 360 days * Basic Salary * ${
          roundedYearsOfService - 5
        } additional years`;
    }

    return description;
  }

  openAccord = false;
  openSalaryAccord = false;
  gratuityDesc = {
    intro: "",
    calculation: "",
    total: "",
  };

  openAccordPress() {
    this.openAccord = !this.openAccord;
  }

  openSalaryAccordPress() {
    this.openSalaryAccord = !this.openSalaryAccord;
  }
  convertYearsToYMD(decimalYears) {
    const years = Math.floor(decimalYears);
    const remainingMonthsDecimal = (decimalYears - years) * 12;
    const months = Math.floor(remainingMonthsDecimal);
    const remainingDaysDecimal = (remainingMonthsDecimal - months) * 30.4375;
    const days = Math.round(remainingDaysDecimal);

    return `${years} year(s) ${months} month(s) ${days} day(s)`;
  }

  async handlePrintEmpData() {
    console.log(this.singleEmployeeData, "***");
    console.log(this.empextdata, "***");
    this.empData = {
      full_name: this.singleEmployeeData.full_name || "",
      emp_code: this.singleEmployeeData.emp_code || "",
      role_id: this.singleEmployeeData.role_id || "",
      workemail: this.singleEmployeeData.workemail || "",
      mobile: this.empextdata.phone_no || "N/A",
      gender: this.singleEmployeeData.gender || "N/A",
      dob: moment(this.singleEmployeeData.dob).format("YYYY-MM-DD") || "N/A",
      alias: this.singleEmployeeData.alias || "N/A",
      joined_date:
        moment(this.singleEmployeeData.joined_date).format("YYYY-MM-DD") ||
        "N/A",
      contract_startdate:
        moment(this.empextdata.con_start).format("YYYY-MM-DD") || "N/A",
      contract_enddate:
        moment(this.empextdata.con_start).format("YYYY-MM-DD") || "N/A",
      labour_enddate:
        moment(this.empextdata.labour_exp_date).format("YYYY-MM-DD") || "N/A",
      roleName: "N/A",
      marital_status: this.empextdata.marital_status || "N/A",
      labour_id: this.empextdata.labour_id || "N/A",
      emirates_id: this.empextdata.emirates_id || "N/A",
      address: this.empextdata.contact_adr_1 || "N/A",
      city: this.empextdata.adr_city || "N/A",
      org_name: "N/A",
      bank_Iban: this.empextdata.bank_Iban || "N/A",
      bank_account_num: this.empextdata.bank_account_num || "N/A",
      bank_name: this.empextdata.bank_name || "N/A",
      bank_branch: this.empextdata.bank_branch || "N/A",
      bank_swift: this.empextdata.bank_swift || "N/A",
    };

    let empRoleData: any = await this.employeeService
      .getRoleNameByroleID({ id: this.singleEmployeeData.role_id })
      .toPromise();
    console.log(empRoleData, "empRoleData");
    if (empRoleData && empRoleData.length > 0 && empRoleData[0].role_name) {
      this.empData.roleName = empRoleData[0].role_name;
    }
    let org_id = this.singleEmployeeData.org_id;
    let orgData: any = await this.orgService.FindByOrgId(org_id).toPromise();
    console.log(orgData, "orgData");
    if (orgData && orgData.org_name) {
      this.empData.org_name = orgData.org_name;
    }
    this.salaryData = [];
    let salaryData = this.handleSalaryData(this.empextdata);
    if (salaryData && salaryData.length > 0) {
      this.salaryData = salaryData;
    }
    console.log(this.salaryData, "salaryData");

    this.modalService.open(this.printModal, { size: "lg" });

    console.log(this.empData, "TEST");
  }
  handleSalaryData(data) {
    console.log(data, "CHECK");
    let arr = [];
    let commonData = [
      "accommod_allow",
      "basic_salary",
      "travel_allow",
      "net_pay",
    ];
    Object.entries(data).map(([key, value]) => {
      if (key.startsWith("a_") && typeof value === "number" && value > 0) {
        arr.push({ type: key, value: value });
        console.log(`${key} has a value greater than 0: ${value}`);
      }
      if (key.startsWith("d_") && typeof value === "number" && value > 0) {
        arr.push({ type: key, value: -value });
        console.log(`${key} has a value greater than 0: ${value}`);
      }
      if (commonData.includes(key)) {
        if (key == "accommod_allow") {
          arr.push({ type: "Accomodation", value: value });
        } else if (key == "travel_allow") {
          arr.push({ type: "Travel", value: value });
        } else if (key == "basic_salary") {
          arr.push({ type: "Basic Salary", value: value });
        } else {
          arr.push({ type: "Net Pay", value: value });
        }
      }
    });
    return arr;
  }
  getColumnClass(length: number): string {
    if (length <= 3) {
      return "col-4";
    } else if (length === 4) {
      return "col-3";
    } else {
      return "col-2";
    }
  }
  printContent() {
    const printSection = document.getElementById("print-section");
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write("<html><head><title>Print</title>");

    iframeDoc.write(`
      <style>
        @media print {
          .modal-header, .modal-footer {
            display: none;
          }
             .modal-body {
        background-color: #f1f1f1 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
        .container{
        margin:10px !important;
              background-color: #f1f1f1 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        }

          .profile-preview {
            display: block;

          }

          .profile-preview .col-8,
          .profile-preview .col-4,
          .profile-preview .col-3,
          .profile-preview .col-6 {
            display: block;
            width: 100%;
            margin-bottom: 5px;
             margin-top: 10px;
          }

          .images {
            width: 100px;
            height: 125px;
            margin-bottom: 12px;
          }

          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }

          .container {
            width: 100%;
          }

          .row {
            display: flex;
            flex-wrap: wrap;
          }

          .col-4,.col-2,.col-8,.col-6, .col-3 {
            padding: 10px;
            background-color: #fff;
            border: 1px solid black;
            box-sizing: border-box;
          }

          .col-8 {
            flex: 0 0 66.66%;
          }

         .profile-preview .col-2 {
  flex: 0 0 16.66%;
}

.profile-preview .col-3 {
  flex: 0 0 25%;
}

.profile-preview .col-4 {
  flex: 0 0 33.33%;
}

.profile-preview .col-6 {
  flex: 0 0 50%;
}
        }
      </style>
    `);

    iframeDoc.write("</head><body>");
    iframeDoc.write(printSection.innerHTML);
    iframeDoc.write("</body></html>");
    iframeDoc.close();
    iframe.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }
  singleData: any;
  showDateIncured = false;
  DateIncuredData = {};
  viewWaiveOff(data) {
    this.singleData = data;
    this.modalService.open(this.waiveoffdetailsModel);
    console.log("for viewing waive off", this.singleData);
    if (
      [
        "Absent",
        "Absent Penality",
        "Less Hour",
        "Checkout Missed",
        "Late CheckIn",
      ].includes(this.singleData.pay_item)
    ) {
      this.timesheetService
        .CheckAttendenceExpInRangebyEmpId({
          empID: this.singleData.emp_id,
          startDate: moment(this.singleData.date_incurred).format("L"),
          endDate: moment(this.singleData.date_incurred).format("L"),
        })
        .subscribe((data: any) => {
          console.log(data, " for single DATA");
          if (data) {
            data.map((elm) => {
              elm.day = elm.theday
                ? this.datePipe.transform(new Date(elm.theday), "MMM d, y")
                : "NA";
              elm.theday = this.datePipe.transform(
                new Date(elm.theday),
                "dd-MM-yyyy"
              );
              elm.check_in = elm.check_in
                ? this.convertTimeTo12HourFormat(elm.check_in)
                : "NA";
              elm.check_out = elm.check_out
                ? this.convertTimeTo12HourFormat(elm.check_out)
                : "NA";
              elm.tot_min = elm.tot_min
                ? this.convertMinutesToTimestamp(elm.tot_min)
                : "NA";
              elm.lessminutes = elm.lessminutes
                ? this.convertMinutesToTimestamp(elm.lessminutes)
                : "NA";
              elm.overminutes = elm.overminutes
                ? this.convertMinutesToTimestamp(elm.overminutes)
                : "NA";
            });
            this.DateIncuredData = data;
            this.showDateIncured = true;
          }
        });
    }
  }
  convertTimeTo12HourFormat(timeString) {
    // Parse the time string to a Date object
    var timeParts = timeString.split(":");
    // Create a new Date object with today's date and the given time
    var dateObj = new Date();
    dateObj.setHours(parseInt(timeParts[0]));
    dateObj.setMinutes(parseInt(timeParts[1]));
    return dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  convertMinutesToTimestamp(minutes) {
    return (
      Math.floor(minutes / 60) +
      ":" +
      (minutes % 60 < 10 ? "0" : "") +
      (minutes % 60)
    );
  }
  ForAbsentDeduction = "No Absent Penality Deduction";
  ForLessHourDeduction = "No Less Hour Deduction";
  ForCheckoutMissing = "No Checkout Missing Deduction";
  ForLateCheckin = "No Late Checkin Deduction";

  async getPayrollSettingRules() {
    try {
      const data: any = await this.payrollService
        .GetPayrollSettingByOrgId({
          id: localStorage.getItem("org_id"),
        })
        .toPromise();

      if (data.length > 0) {
        let settingData = data[0];

        if (settingData.is_auto_dedec_ab) {
          if (settingData.ab_dedc_by === "abperday") {
            this.ForAbsentDeduction =
              "Absent Penality Deducted by Per Day Salary";
          } else if (settingData.ab_dedc_by === "abnumberday") {
            this.ForAbsentDeduction = `Absent Penality Deducted by ${settingData.ab_number_day} Days Salary`;
          } else if (settingData.ab_dedc_by === "abfixamt") {
            this.ForAbsentDeduction = `Absent Penality Deducted by ${settingData.ab_fix_amount} Amount`;
          }
        }

        if (settingData.is_auto_dedc_lh) {
          if (settingData.lh_dedc_by === "lhpermin") {
            this.ForLessHourDeduction = `Less Hour Deducted by considering each less minute as ${
              settingData.lh_tolr_min
            } minutes.
               Maximum deduction upto ${settingData.lh_maxdeduc_by} ${
              settingData.lh_maxdeduc_by === "Fixed Amount"
                ? settingData.lh_fix_amount
                : ""
            }`;
          } else if (settingData.lh_dedc_by === "lhhalfday") {
            this.ForLessHourDeduction = `Less Hour Deducted by Half day Salary`;
          } else if (settingData.lh_dedc_by === "lhperday") {
            this.ForLessHourDeduction = `Less Hour Deducted by Per Day Salary`;
          } else if (settingData.lh_dedc_by === "lhfixamt") {
            this.ForLessHourDeduction = `Less Hour Deducted by ${settingData.lh_fix_amount} Amount`;
          }
        }

        if (settingData.is_auto_dedc_cm) {
          if (settingData.cm_dedc_by === "cmphalfday") {
            this.ForCheckoutMissing = `Checkout Missing Deducted by Half day Salary`;
          } else if (settingData.cm_dedc_by === "cmperday") {
            this.ForCheckoutMissing = `Checkout Missing Deducted by Per Day Salary`;
          } else if (settingData.cm_dedc_by === "cmfixamt") {
            this.ForCheckoutMissing = `Checkout Missing Deducted by ${settingData.cm_fix_amount} Amount`;
          }
        }

        if (settingData.is_auto_dedc_lc) {
          if (settingData.lc_dedc_by === "lchalfday") {
            this.ForLateCheckin = `Late Checkin Deducted by Half day Salary`;
          } else if (settingData.lc_dedc_by === "lcperday") {
            this.ForLateCheckin = `Late Checkin Deducted by Per Day Salary`;
          } else if (settingData.lc_dedc_by === "lcfixamt") {
            this.ForLateCheckin = `Late Checkin Deducted by ${settingData.lc_fixamt} Amount`;
          }
        }
      }
    } catch (error) {
      console.error("Error while fetching payroll settings:", error);
    }
  }
}
