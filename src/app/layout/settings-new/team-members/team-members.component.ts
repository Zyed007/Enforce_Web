import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ToolbarItems, GridComponent } from "@syncfusion/ej2-angular-grids";
import {
  Tab,
  TabComponent,
  SelectingEventArgs,
  SelectEventArgs,
} from "@syncfusion/ej2-angular-navigations";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { Select2OptionData } from "ng2-select2";

import Swal from "sweetalert2";
import moment = require("moment");
import momentz = require("moment-timezone");
import { ToastrService } from "ngx-toastr";
import {
  SearchCountryField,
  TooltipLabel,
  CountryISO,
} from "ngx-intl-tel-input";
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from "lodash";
//services
import { LeaveService } from "../../../services/leave.service";
import { TeamService } from "../../../services/team.service";
import { ProjectService } from "../../../services/project.service";
import { EmployeeService } from "../../../services/employee.service";
import { AdministrativeService } from "../../../services/administrative.service";
import { UserService } from "../../../services/user.service";
import { ModuleSetupService } from "../../../services/moduleSetup.service";
import { AdminSettingService } from "../../../services/admin-setting.service";
import { CountryService } from "../../../services/countryList.service";
import { settingsService } from "../../../services/settings.service";
import { PayrollService } from "../../../services/payroll.service";
import { DelegationService } from "../../../services/delegation.service";
import { OrganizationService } from "../../../services/organization.service";


import { getDate } from "ngx-bootstrap/chronos/utils/date-getters";
import { color } from "highcharts";
import { array } from "@amcharts/amcharts4/core";
import { timer, utcMonday } from "d3";
import { userInfo } from "os";
import { log } from "console";
import { async } from "@angular/core/testing";
import { DropDownListComponent } from "@syncfusion/ej2-angular-dropdowns";
import { ContractStatusModule } from "../../contract-status/contract-status.module";
import { CostUnitModule } from "../../cost-unit/cost-unit.module";
import { off } from "process";
import { Conditional } from "@angular/compiler";

declare var $: any;

@Component({
  selector: "app-team-members",
  templateUrl: "./team-members.component.html",
  styleUrls: ["./team-members.component.scss"],
})
export class TeamMembersComponent implements OnInit {
  @ViewChild("tabObj", { static: false }) public tabObj: TabComponent;
  @ViewChild("employeeGrid", { static: false })
  @ViewChild("editChangeEmpTypeModel", { static: false })
  editChangeEmpTypeModel: any;
  @ViewChild("compareupdate", { static: false }) compareupdate: any;
  @ViewChild("empDropdown", { static: false })
  empDropdown: DropDownListComponent;
  @ViewChild("overridedata", { static: false }) overridedata: any;
  @ViewChild("confrimpassword", { static: false }) confrimpassword: any;
  @ViewChild("compareNotification", { static: false }) compareNotification: any;
  @ViewChild("fromnotification", { static: false }) fromnotification: any;
  @ViewChild("bulkupdate", { static: false }) bulkupdate: any;
  @ViewChild("askJoiningDateType", { static: false }) askJoiningDateType: any;
  @ViewChild("newEmployeeCreateRequest", { static: false })
  newEmployeeCreateRequest: any;
  //@ViewChild("employeeEditRequest", { static: false }) employeeEditRequest: any;
  @ViewChild("requestedemployeeGrid", { static: false })
  @ViewChild("employeeDeleteRequest", { static: false })
  employeeDeleteRequest: any;
  @ViewChild("termiationformmodal", { static: false }) termiationformmodal: any;

  public employeeGrid: GridComponent;
  assetimg = "../../assets/images/profile_img.png";

  //userRights
  commonModuleName;
  teamMemberModuleID;
  public requestedemployeeGrid: GridComponent;

  AddHeaderText = [{ text: "Basic Details" }];

  editheaderText = [
    { text: "Basic Details" },
    { text: "Personal Details" },
    { text: "Contract Details" },
    { text: "Documents" },
    { text: "Edit History" },
  ];
  esdocs;
  repaddocs;
  addocs = [{ docid: "", docname: "", docexp: "", status: "", crdate: "" }];
  Orgid;

  accessToPage = false;
  showAddEdit = false;
  AddEditSectionName;
  addEditSectionFullAccess = false;
  addEditdualApprovalDiv = false;
  addEditApprover1Value;
  addEditApprover1Name;
  addEditApprover2Value;
  addEditApprover2Name;
  public countryDataDropDown;

  showDelete = false;
  deleteSectionName;
  deleteSectionFullAccess = false;
  deletedualApprovalDiv = false;
  deleteApprover1Value;
  deleteApprover1Name;
  deleteApprover2Value;
  deleteApprover2Name;
  currentDeleteEmpData;
  isEmpDelLoading = false;
  consame = false;

  public employeeGridToolItems: ToolbarItems[];
  public today: Date = new Date(new Date().toDateString());
  public maxRangeDate: Date = this.today;
  public minDate: Object = new Date(new Date().getFullYear(), 0, 1);

  public employeeTypeData;
  public teamByOrganizationData;
  public leaveProfileType;
  public overtimeProfileType = [
    { id: "xfaskgjah", description: "UAE OverTime Profile" },
  ];
  public employeeRoleData;
  public orgData = [];
  public empDelData = [];
  public gratuitydata;
  public gratuityDis = true;

  addNewEmployeeForm: FormGroup;
  addEmployeeExtension: FormGroup;
  editEmployeeExtension: FormGroup;
  uploadEmployeeDoc: FormGroup;
  AddAditionalDoc: FormGroup;
  addNewEmployeeLeaveForm: FormGroup;
  addDropDownsForm: FormGroup;
  editDropDownsForm: FormGroup;
  editEmployeeLeaveForm: FormGroup;
  editopeningBalanceDiv = false;
  editleaveTakenDiv = false;
  dropdownConfig;
  worktimeDropConfig;

  basicpay = 0.0;
  travel = 0.0;
  accommodation = 0.0;
  otherallow = 0.0;
  tax = 0.0;
  insurance = 0.0;
  otherdeduct = 0.0;

  aone = 0.0;
  atwo = 0.0;
  athree = 0.0;
  done = 0.0;
  dtwo = 0.0;
  dthree = 0.0;

  grosspay = 0.0;
  netdeduct = 0.0;
  netpay = 0.0;

  gender = "Male";
  malecheck = true;
  femalecheck = false;

  editEmployeeForm: FormGroup;
  user_Info = JSON.parse(localStorage.getItem("user_info"));
  currentEmployeeData;
  currentTeamName;
  currentEmpTypeName;
  currentLeaveName;
  selected = new FormControl(0);
  loadGridData = false;
  allEmployeeGrid = true;
  singleEmployeeEdit = false;
  singleEmployeeAdd = false;
  allEmployeeData;
  WorkdaysData;
  editWorkdaysData;
  // editWorkdaysexpData;
  workStartHoursData;
  workEndHoursData;
  workTotalHoursData;
  addIsFlexibleDiv = false;
  timeformatData;
  sendReportstimeData = [
    {
      id: "24",
      description: "Morning",
    },
    {
      id: "12",
      description: "Night",
    },
  ];

  newTeamData;
  timeZoneData;
  editWorkStartHourValue;
  editWorkEndHourValue;
  editWorkTotalHoursValue;
  editIsFlexibleDiv = false;
  editEmployeeData;
  empStatusValue;
  phoneNumberValue: any;
  phoneNumberCode: any;
  allmembersCount;
  withoutTeamCount;
  withoutTeamData;
  emailDiv = true;
  phoneDiv = false;

  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  public selectedISO = CountryISO.UnitedArabEmirates;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  phone: any;
  phoneInvalid: boolean = false;
  phoneErrorMsg: any;

  openingBalanceDiv = false;
  leaveTakenDiv = false;

  //add emp var
  addEmployeeDetailsRequestData;
  addEmpRoleValueError = false;
  addEmpEmailValueError = false;
  addEmpStatusID;
  profileChangeHistoryData;

  lProfEffectiveDateDiv = true;
  editlProfEffectiveDateDiv = true;

  noEmployee = true;
  employeePresent = false;

  isNewProfile: boolean;
  isChangeProfile: boolean;

  oldJoinDateDiv = true;
  newJoinDateDiv = false;
  getJDchangeData;
  editEmployeeDetailsRequestData;

  //noticiaction
  originalViewEditNotificationModelData;
  showButtonDiv = false;
  isApprov2View = false;
  viewEditNotificationModelData;
  sendEmployeeData;
  originalEditEmpData;
  addEmployeeRequest = false;
  editEmployeeRequest = false;

  viewDeleteNotificationModelData;
  deleteEmployeeRequest = false;
  //originalDeleteEmpData

  constructor(
    private formBuilder: FormBuilder,
    public Router: Router,
    public config: NgbModalConfig,
    private modalService: NgbModal,
    public teamService: TeamService,
    public empService: EmployeeService,
    public adminService: AdminSettingService,
    public AdministrativeService: AdministrativeService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private leaveService: LeaveService,
    private userService: UserService,
    public ModuleSetupService: ModuleSetupService,
    public AdminSettingService: AdminSettingService,
    private countries: CountryService,
    private settingsService: settingsService,
    private payrollService: PayrollService,
    private projectService: ProjectService,
    private delegateService: DelegationService,
    public OrganizationService: OrganizationService,

  ) {
    config.backdrop = "static";

    //new dropdown config
    this.dropdownConfig = {
      search: true,
      noResultsFound: "No results found!",
      searchPlaceholder: "Search",
      height: "200px",
    };

    // this.deptOptions = {
    //   placeholder: { id: '  ', text: 'Select' }, allowClear: true,
    //   width: '100%'
    // }

    this.worktimeDropConfig = {
      height: "200px",
      placeholder: "Select",
    };
  }

    appDisappTeamMembers = false;
    myRequest = false;
    myRequestedEmp

    yearNumber = 0;
    oneYear = false;
    twoYear = false;
    fourYear = false;
    fiveYear = false;
    commonFields: Object = { text: "value", value: "id" };

    shoreData ;
    isLoading = false;

  async getShoreData(){
    this.shoreData = [] ;
    this.isLoading = true;
    let postData = {
      "orgID": localStorage.getItem('org_id')
    }



    await this.empService.GetWorkLocationByOrgId(postData).subscribe((data) => {
      this.shoreData = Object.values(data).map(item => item.work_location);

      console.log(data, "...///|||")
      this.isLoading = false;
      console.log(this.shoreData)
    })

    console.log(this.shoreData)
  }


  MaritalStatus: string[] = [
    "Single",
    "Married",
    "Widowed",
    "Separated",
    "Divorced",
  ];

  visatype: string[] = [
    "Resident Visa",
    "Visiting Visa",
    "Employment Visa",
    "Family Visa",
    "Domestic Workers Visa",
    "Specialist Resident Visa",
    "Golden Visa",
  ];



  overtimeHourData = [
    {
      id: 0,
      description: "0Hr",
    },
    {
      id: 1,
      description: "1Hr",
    },
    {
      id: 2,
      description: "2Hr",
    },
    {
      id: 3,
      description: "3Hr",
    },
    {
      id: 4,
      description: "4Hr",
    },
    {
      id: 5,
      description: "5Hr",
    },
    {
      id: 6,
      description: "6Hr",
    },
  ];
  overtimeMinuteData = [
    {
      id: 0,
      description: "0 Min",
    },
    {
      id: 10,
      description: "10Min",
    },
    {
      id: 20,
      description: "20Min",
    },
    {
      id: 30,
      description: "30Min",
    },
    {
      id: 40,
      description: "40Min",
    },
    {
      id: 50,
      description: "50Min",
    },
  ];
  ngOnInit() {
    this.AddAditionalDocInput();
    this.checkUserRights();
    this.employeeGridToolItems = ["Search"];
    this.getDraftEmployeeEditData();
    this.getEmployeeByOrgId();
    this.getCountryList();
    this.salarycalculator();
    this.getRequestStatus();
    this.fillDashBoardDetails();
    this.checkNotificationRequest();
    this.getRequiredField();
    this.getShoreData();
  }

  managed = false;

  manageWorkHrsByWeekDays(e) {
    if (e.srcElement.checked === true) {
      this.managed = true;
    } else {
      this.managed = false;
    }
  }

  DashboardData: any;
  Inservice;
  Outservice;
  ProfileComplete;
  DocExpired;
  DocNearExpiry;
  Offshore;
  WithoutTeam;
  Delegates;
  selectRange = "90 Days";
  headerText = "Expire Within";
  requiredData = [] ;
  basicDetails
  offShoreTrue;
  onShoreTrue;
  requiredEmployeeFields = [];
  requiredDropFields = [];
  offShoreRequired = [];
  onShoreRequired = [];


  async getRequiredField() {
    const orgId = localStorage.getItem("org_id");
    console.log(orgId,"....///")
    const data = await this.teamService.GetAllFieldSettingByOrgId({OrgID : orgId}).toPromise();
    const newData =JSON.parse(JSON.stringify(data));

    console.log(data
      , "getRequiredField");

    console.log(newData, "get New Data")

    newData.forEach((val) => {
      this.requiredData.push(JSON.parse(val.field_data));
    })

    console.log(this.requiredData, "RequiredField...")
    this.basicDetails = this.requiredData[0]
    console.log(this.basicDetails, "basicDetails")
    this.addEmployeeFormInputs();
    this.requiredEmployeeFields.push(this.addNewEmployeeForm.value)
    console.log(Object.keys(this.requiredEmployeeFields[0]), "testingggggggggggg");

    this.offShoreTrue = this.basicDetails.filter(val =>
      val.offshore == true
    )

    this.onShoreTrue = this.basicDetails.filter(val => val.onshore === true)
    console.log(this.offShoreTrue, "offShoreTrue")
    console.log(this.onShoreTrue, "onShoreTrue")

    // this.offShoreRequired =
    this.offShoreRequired = Object.keys(this.requiredEmployeeFields[0]).filter((val) => {

      const cleanKey = val.toLowerCase().replace(/[^a-z]/g, '');
      return this.offShoreTrue.some(field => {
      const words = field.field_name.toLowerCase().split(/\s+/);
      return words.some(word =>
      cleanKey.includes(word.replace(/[^a-z]/g, ''))
        );
      });

    })

    this.onShoreRequired = Object.keys(this.requiredEmployeeFields[0]).filter((val) => {
      const cleanKey = val.toLowerCase().replace(/[^a-z]/g, '');
      return this.onShoreTrue.some(field => {
      const words = field.field_name.toLowerCase().split(/\s+/);
      return words.some(word =>
      cleanKey.includes(word.replace(/[^a-z]/g, ''))
        );
      });

     })

     this.addDropDownFormInputs();
     this.requiredDropFields.push(this.addDropDownsForm.value)
     console.log(Object.keys(this.requiredDropFields[0]), "droppppppp");
     //console.log(this.requiredDropFields, "...//")

     const remRequired = Object.keys(this.requiredDropFields[0]).filter((val) => {

      const cleanKey = val.toLowerCase().replace(/[^a-z]/g, '');
      return this.offShoreTrue.some(field => {
      const words = field.field_name.toLowerCase().split(/\s+/);
      return words.some(word =>
      cleanKey.includes(word.replace(/[^a-z]/g, ''))
        );
      });

     })

     remRequired.map(val => this.offShoreRequired.push(val))

     const resRequired = Object.keys(this.requiredDropFields[0]).filter((val) => {

      const cleanKey = val.toLowerCase().replace(/[^a-z]/g, '');
      return this.onShoreTrue.some(field => {
      const words = field.field_name.toLowerCase().split(/\s+/);
      return words.some(word =>
      cleanKey.includes(word.replace(/[^a-z]/g, ''))
        );
      });

     })

     resRequired.map(val => this.onShoreRequired.push(val))



    console.log(this.offShoreRequired, "offShoreRequired")
    console.log(this.onShoreRequired, "onShoreRequired")
  }

  async fillDashBoardDetails() {
    try {
      const rsp = await this.empService
        .getDashBoardTeamMemberDataByOrgId()
        .toPromise();
      console.log(rsp, "DASHBOARD DATA");
      if (rsp) {
        this.DashboardData = rsp[0][0];
        this.Inservice = rsp[1];
        this.Outservice = rsp[2];
        this.ProfileComplete = rsp[3];
        this.DocExpired = rsp[4]
        this.DocNearExpiry = rsp[5];
        this.Offshore = rsp[6];
        this.WithoutTeam = rsp[7];
        this.Delegates = rsp[8];


        this.DocExpired = this.DocExpired.map((val) => ({
          ...val,
          exp_by: moment().diff(moment(val.doc_exp_date), "days") + " Days ago",
          doc_exp_date: moment(val.doc_exp_date.split("T")[0]).format("ll"),
          created_date: moment(val.created_date.split("T")[0]).format("ll"),
          checklast: moment().diff(moment(val.doc_exp_date), "days"),
        }));

        let newData = this.allEmployeeData.filter(val => val.employee_status_name === "In Service")
        console.log(newData,"newData")
        console.log(this.DocExpired,"DocExpired")


        this.DocExpired = this.DocExpired.filter( val => newData.some(item => item.id === val.id));

        this.doclastExpiredDate = this.DocExpired.reduce(
          (max, obj) => (obj.checklast > max ? obj.checklast : max),
          this.DocExpired[0].checklast
        );

        this.DocNearExpiry = this.DocNearExpiry.map((val) => ({
          ...val,
          exp_by: moment(val.doc_exp_date).diff(moment(), "days") + " Days",
          doc_exp_date: moment(val.doc_exp_date.split("T")[0]).format("ll"),
          created_date: moment(val.created_date.split("T")[0]).format("ll"),
        }));

        this.docExpiredtot = this.DocExpired.length;
        this.dashListData = this.DocNearExpiry.filter(
          (value) => moment(value.doc_exp_date).diff(moment(), "days") < 90
        );
        this.docNearExpTot = this.dashListData.length;
      }
      await this.getRequestStatus();
    } catch (error) {
      console.error("Error in fillDashBoardDetails:", error);
    }
  }

  closeDashList() {
    this.showDashList = false;
  }

  //team starts
  //get all employee
  async getEmployeeByOrgId() {
    let data: any = await this.empService
      .fetchGridDataEmployeeByOrgID()
      .toPromise();
    console.log(data, typeof data, "DATA CHECK");
    if (data) {
      console.log("DATA CHECK IN");
      let noTeamData = [];
      data.map((elm) => {
        elm.team_id = elm.team_id === null ? "null" : elm.team_id;
        if (elm.team_id === "null") {
          noTeamData.push(elm);
        }
      });
      this.loadGridData = false;

      this.allEmployeeData = data;
      console.log(this.allEmployeeData, "DATA CHECK allEmployeeData");

      await this.getTeamValues(
        this.allEmployeeData.length,
        noTeamData.length,
        this.totaldraftcount
      );
      this.noEmployee = false;
      this.employeePresent = true;
    } else {
      this.noEmployee = true;
      this.employeePresent = false;
    }
    console.log(this.allEmployeeData, "DATA CHECK allEmployeeData");
  }

  checkGender(gen) {
    if (gen === "Male") {
      this.gender = "Male";
      this.malecheck = true;
      this.femalecheck = false;
    } else if (gen === "Female") {
      this.gender = "Female";
      this.malecheck = false;
      this.femalecheck = true;
    }
  }

  countryData;
  getCountryList() {
    this.countries.getCountryList().subscribe((data: any) => {
      let results = [];
      data.map((elm, i) => {
        results.push({ id: elm.id, value: elm.name });
        if (data.length === i + 1) {
          this.countryDataDropDown = results;
          this.countryData = data;
        }
      });
    });
  }

  totalempcount = 0;
  totalwithOutTeamCount = 0;
  totaldraftcount = 0;

  //get all team tab name by OrgID
  async getTeamValues(allMemberCount, withOutTeamCount, totaldraftcount) {
    this.totalempcount = allMemberCount;
    this.totalwithOutTeamCount = withOutTeamCount;
    let data: any = await this.teamService.FindTeamsByOrgID().toPromise();
    //console.log(data)
    let teamData = [
      { text: "All Members" + " (" + allMemberCount + ")" },
      { text: "Without Team" + " (" + withOutTeamCount + ")" },
      { text: "Saved Draft" + " (" + totaldraftcount + ")" },
    ];
    if (data && data.length > 0) {
      data.map((elm) => {
        teamData.push({
          text: elm.team_name + " (" + elm.memberCount + ")",
        });
      });
    }
    this.newTeamData = teamData;
  }

  WeekOvertimeEnable = false;
  HoliOvertimeEnable = false;
  handleOverTimeCheck = true;

  handleOvertime(e) {
    console.log("from check box", e.target.value);
    if (e.target.checked) {
      this.handleOverTimeCheck = false;
      if (e.target.value == "Week") {
        this.WeekOvertimeEnable = true;
      } else if ((e.target.value = "Holi")) {
        this.HoliOvertimeEnable = true;
      }
    } else {
      if (e.target.value == "Week") {
        this.WeekOvertimeEnable = false;
      } else if ((e.target.value = "Holi")) {
        this.HoliOvertimeEnable = false;
      }
      if (!this.WeekOvertimeEnable && !this.HoliOvertimeEnable) {
        this.handleOverTimeCheck = true;
      }
    }
  }

  MinumumOvertime = "00:00";
  changeOvertimeHour(e) {
    let time = this.MinumumOvertime.split(":");
    this.MinumumOvertime = "0" + e.value.id + ":" + time[1];
  }
  changeOvertimeMinute(e) {
    let tt;
    e.value.id == 0 ? (tt = "00") : (tt = e.value.id);
    let time = this.MinumumOvertime.split(":");
    this.MinumumOvertime = time[0] + ":" + tt;
  }


  //change team tab
  async changeTeam(args) {
    this.loadGridData = true;
    let teamName = args.tab.textLabel.split(" (");
    //console.log(teamName[0]);
    if (
      teamName[0] !== "All Members" &&
      teamName[0] !== "Without Team" &&
      teamName[0] !== "Saved Draft"
    ) {
      this.draftcheck = false;
      let sendObj = {
        name: teamName[0],
        orgID: localStorage.getItem("org_id"),
      };
      this.teamService
        .FetchAllTeamMembersByTeamName(sendObj)
        .subscribe((data: any) => {
          //console.log(data)
          this.allEmployeeData = data;
          this.loadGridData = false;
        });
    } else if (teamName[0] === "Without Team") {
      this.draftcheck = false;
      this.getDataforteamandwithoutteam();
    } else if (teamName[0] === "Saved Draft") {
      this.draftcheck = true;
      this.getDraftEmployeeEditData();
    } else {
      this.draftcheck = false;
      this.getEmployeeByOrgId();


    }
  }

  draftEmployeeList;
  draftcheck = false;

  getDraftEmployeeEditData() {
    let datalength = 0;
    //channge required
    this.empService
      .GetAllEmployeeDetailsOverrideByOrgID()
      .subscribe((data: any) => {
        //console.log(data)
        if (data !== null) {
          data.map((emp) => {
            emp.created_date = moment(emp.created_date).format("ll");
          });
          this.loadGridData = false;
          this.draftEmployeeList = data;
          console.log(data.id, "testing id....")
          this.totaldraftcount = this.draftEmployeeList.length;
          this.noEmployee = false;
          this.employeePresent = true;
        } else {
          this.noEmployee = true;
          this.employeePresent = false;
        }
      });
  }

  getDataforteamandwithoutteam() {
    this.empService.fetchGridDataEmployeeByOrgID().subscribe((data: any) => {
      let noTeamData = [];
      data.map((elm) => {
        elm.team_id = elm.team_id === null ? "null" : elm.team_id;
        if (elm.team_id === "null") {
          noTeamData.push(elm);
        }
      });
      this.loadGridData = false;
      this.allEmployeeData = noTeamData;
      this.getTeamValues(data.length, noTeamData.length, this.totaldraftcount);
    });
  }

  employeeSearchKeyUp(): void {
    document
      .getElementById(this.employeeGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.employeeGrid.search((event.target as HTMLInputElement).value);
      });
  }

  //routing the employee details to hr employee component
  viewEmployeeInHR(data) {
    this.Router.navigate(["/HR-Employee"]);
    sessionStorage.setItem("empid", data.id);
  }

  dbEmpExtData;

  //add new team starts
  editEmployeeExtensionDiv(fdata) {
    this.assetimg = "../../assets/images/profile_img.png";
    this.editEmployeeExtensionInputs();
    let postData = {
      empID: fdata.id,
    };
    localStorage.setItem("emp_id", fdata.id);
    sessionStorage.setItem("emp_id", fdata.id);
    this.empService.GetEmployeeExtensionByempId(postData).subscribe(
      (data: any) => {
        if (data != null) {
          console.log("for filling the document", data);

          this.extraAllowance = [];
          this.extraDeduction = [];

          if (data.a_one > 0) {
            this.extraAllowance.push(true);
            console.log("trigered one");
          }
          if (data.a_two > 0) {
            this.extraAllowance.push(true);
            console.log("trigered two");
          }
          if (data.a_three > 0) {
            this.extraAllowance.push(true);
            console.log("trigered d one");
          }

          if (data.d_one > 0) {
            this.extraDeduction.push(true);
          }
          if (data.d_two > 0) {
            this.extraDeduction.push(true);
            console.log("trigered d two");
          }
          if (data.d_three > 0) {
            this.extraDeduction.push(true);
            console.log("trigered d three");
          }

          this.dbEmpExtData = data;

          this.editEmployeeExtension.patchValue({
            //personal details
            dateofbirth: data.dob != null ? moment(data.dob).format("ll") : "",
            maritalStatus: data.marital_status,
            nationality: parseFloat(data.nationality),
            phoneNo: data.phone_no,
            personalEmail: data.pesonal_email,
            //emergency contacts
            gardianContact: data.gardian_contact,
            emergencyContact: data.emergency_contact,
            gardianRelation: data.gardian_relation,
            //passport details
            fullNamePst: data.full_name_pst,
            passNumber: data.passport_num,
            passIssueContry: parseFloat(data.pass_issue_contry),
            passIssueDate:
              data.pass_issue_date != null
                ? moment(data.pass_issue_date).format("ll")
                : "",
            passExpDate:
              data.pass_exp_date != null
                ? moment(data.pass_exp_date).format("ll")
                : "",
            //Address details
            adr1: data.adr_1,
            adr2: data.adr_2,
            adrCity: data.adr_city,
            adrCountry: parseFloat(data.adr_country),
            adrPostalCode: data.adr_postal_code,
            isconsame: data.is_con_same,
            conAdr1: data.contact_adr_1,
            conAdr2: data.contact_adr_2,
            conCity: data.contact_city,
            conCountry: parseFloat(data.contact_country),
            conPostalCode: data.contact_postal_code,
            //contract details
            conStart:
              data.con_start != null ? moment(data.con_start).format("ll") : "",
            conEnd:
              data.con_end != null ? moment(data.con_end).format("ll") : "",
            labourId: data.labour_id,
            labourExpDate:
              data.labour_exp_date != null
                ? moment(data.labour_exp_date).format("ll")
                : "",
            //visa details
            visaId: data.visa_id,
            visaType: data.visa_type,
            visaExpDate:
              data.visa_exp_date != null
                ? moment(data.visa_exp_date).format("ll")
                : "",
            emiratesId: data.emirates_id,
            emiratesIdExpDate:
              data.emirates_id_exp_date != null
                ? moment(data.emirates_id_exp_date).format("ll")
                : "",
            //insurane Details
            insProvider: data.ins_provider,
            insPloicy: data.ins_policy,
            insExp:
              data.ins_exp != null ? moment(data.ins_exp).format("ll") : "",
            //bank details
            bankName: data.bank_name,
            bankBranch: data.bank_branch,
            accNumber: data.bank_account_num,
            iban: data.bank_Iban,
            swiftCode: data.bank_swift,
            //salary Details
            salEffDate:
              data.salary_effective_date != null
                ? moment(data.salary_effective_date).format("ll")
                : "",
            basicPay: parseFloat(data.basic_salary),
            travelAllow: parseFloat(data.travel_allow),
            accoAllow: parseFloat(data.accommod_allow),
            aOneName: data.a_one_name,
            aOne: data.a_one,
            aTwoName: data.a_two_name,
            aTwo: data.a_two,
            aThreeName: data.a_three_name,
            aThree: data.a_three,
            //otherAllow: parseFloat(data.other_allow),
            taxDed: parseFloat(data.tax_deduc),
            insDed: parseFloat(data.insurance_deduc),
            //otherDed: parseFloat(data.other_deduc),
            dOneName: data.d_one_name,
            dOne: data.d_one,
            dTwoName: data.d_two_name,
            dTwo: data.d_two,
            dThreeName: data.d_three_name,
            dThree: data.d_three,
          });

          this.onsalKeyUpEdit();
          //this.otherdeduct=parseFloat(data.other_deduc),
          this.consame = data.is_con_same;
          this.checkGender(data.gender);

          if (
            data.photo_url === "" ||
            data.photo_url === undefined ||
            data.photo_url === null
          ) {
            this.assetimg = "../../assets/images/profile_img.png";
            sessionStorage.setItem("photo_url", "");
          } else {
            this.assetimg = data.photo_url;
            sessionStorage.setItem("photo_url", data.photo_url);
          }
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );
  }

  editEmployeeExtensionDivDraft(data) {
    this.assetimg = "../../assets/images/profile_img.png";
    this.editEmployeeExtensionInputs();
    this.dbEmpExtData = data;
    console.log("from eot", data);
    localStorage.setItem("emp_id", data.emp_id);
    sessionStorage.setItem("emp_id", data.emp_id);
    this.editEmployeeExtension.patchValue({
      //personal details
      dateofbirth: data.dob != null ? moment(data.dob).format("ll") : "",
      maritalStatus: data.marital_status,
      nationality: parseFloat(data.nationality),
      phoneNo: data.phone_no,
      personalEmail: data.pesonal_email,
      //emergency contacts
      gardianContact: data.gardian_contact,
      emergencyContact: data.emergency_contact,
      gardianRelation: data.gardian_relation,
      //passport details
      fullNamePst: data.full_name_pst,
      passNumber: data.passport_num,
      passIssueContry: parseFloat(data.pass_issue_contry),
      passIssueDate:
        data.pass_issue_date != null
          ? moment(data.pass_issue_date).format("ll")
          : "",
      passExpDate:
        data.pass_exp_date != null
          ? moment(data.pass_exp_date).format("ll")
          : "",
      //Address details
      adr1: data.adr_1,
      adr2: data.adr_2,
      adrCity: data.adr_city,
      adrCountry: parseFloat(data.adr_country),
      adrPostalCode: data.adr_postal_code,
      isconsame: data.is_con_same,
      conAdr1: data.contact_adr_1,
      conAdr2: data.contact_adr_2,
      conCity: data.contact_city,
      conCountry: parseFloat(data.contact_country),
      conPostalCode: data.contact_postal_code,
      //contract details
      conStart:
        data.con_start != null ? moment(data.con_start).format("ll") : "",
      conEnd: data.con_end != null ? moment(data.con_end).format("ll") : "",
      labourId: data.labour_id,
      labourExpDate:
        data.labour_exp_date != null
          ? moment(data.labour_exp_date).format("ll")
          : "",
      //visa details
      visaId: data.visa_id,
      visaType: data.visa_type,
      visaExpDate:
        data.visa_exp_date != null
          ? moment(data.visa_exp_date).format("ll")
          : "",
      emiratesId: data.emirates_id,
      emiratesIdExpDate:
        data.emirates_id_exp_date != null
          ? moment(data.emirates_id_exp_date).format("ll")
          : "",
      //insurane Details
      insProvider: data.ins_provider,
      insPloicy: data.ins_policy,
      insExp: data.ins_exp != null ? moment(data.ins_exp).format("ll") : "",
      //bank details
      bankName: data.bank_name,
      bankBranch: data.bank_branch,
      accNumber: data.bank_account_num,
      iban: data.bank_Iban,
      swiftCode: data.bank_swift,
      //salary Details
      salEffDate:
        data.salary_effective_date != null
          ? moment(data.salary_effective_date).format("ll")
          : "",
      basicPay: parseFloat(data.basic_salary),
      travelAllow: parseFloat(data.travel_allow),
      accoAllow: parseFloat(data.accommod_allow),
      aOneName: data.a_one_name,
      aOne: data.a_one,
      aTwoName: data.a_two_name,
      aTwo: data.a_two,
      aThreeName: data.a_three_name,
      aThree: data.a_three,
      //otherAllow: parseFloat(data.other_allow),
      taxDed: parseFloat(data.tax_deduc),
      insDed: parseFloat(data.insurance_deduc),
      //otherDed: parseFloat(data.other_deduc),
      dOneName: data.d_one_name,
      dOne: data.d_one,
      dTwoName: data.d_two_name,
      dTwo: data.d_two,
      dThreeName: data.d_three_name,
      dThree: data.d_three,
    });
    (this.basicpay = parseFloat(data.basic_salary)),
      (this.travel = parseFloat(data.travel_allow)),
      (this.accommodation = parseFloat(data.accommod_allow)),
      //this.otherallow =parseFloat(data.other_allow),
      (this.tax = parseFloat(data.tax_deduc)),
      (this.insurance = parseFloat(data.insurance_deduc)),
      //this.otherdeduct=parseFloat(data.other_deduc),
      (this.consame = data.is_con_same);
    this.onsalKeyUpEdit();
    if (
      data.photo_url === "" ||
      data.photo_url === undefined ||
      data.photo_url === null
    ) {
      this.assetimg = "../../assets/images/profile_img.png";
      sessionStorage.setItem("photo_url", "");
    } else {
      this.assetimg = data.photo_url;
      sessionStorage.setItem("photo_url", data.photo_url);
    }
    console.log("setting up the needed things");
  }

  fromsavedraft = false;
  draftid;
  draftorg;

  editEmployeeDivDraft(data: any) {
    console.log("editEmployeeDivDraft : ", data);

    //flaging this is alreading existing draft, and want to update the same while saving.
    this.fromsavedraft = true;
    this.draftid = data.id;
    this.draftorg = data.org_id;

    this.getAllTimeZone();
    this.GetEmployeeStatusByOrgID();
    this.editEmployeeExtensionDivDraft(data);
    this.editEmployeeLeaveFormInputs();
    this.editEmployeeFormInputs();
    this.editDropDownFormInputs();
    this.editCallDaysandTiming();
    this.filldocdetails();
    this.InputeditWorkDayExp();
    this.GetLeaveAvailableProfileHistorybyOrgIdEmpId(data.emp_id);
    this.GetWorkProfileHistorybyEmpId(data.emp_id);
    this.GetSalaryHistorybyEmpId(data.emp_id);
    this.getEmployeeEditHistory(data.emp_id);

    //this.editEmployeeData = data;
    this.allEmployeeGrid = false;
    this.singleEmployeeAdd = false;
    this.singleEmployeeEdit = true;
    this.currentEmployeeData = data;
    this.editEmployeeForm.patchValue({
      eFirstName: data.first_name,
      eLastName: data.last_name,
      eWorkEmail: data.workemail,
      empCode: data.emp_code,
      nationality: data.mobile,
    });
    this.checkGender(data.gender);
    this.editEmployeeLeaveForm.patchValue({
      editJoinedDate:
        data.joined_date != null ? moment(data.joined_date).format("ll") : "",
      editProfileStartDate:
        data.profile_effective_from_date != null
          ? moment(data.profile_effective_from_date).format("ll")
          : "",
      editopenBalance:
        data.open_balance_days !== "" ? data.open_balance_days : 0,
      editleaveTaken: data.leave_taken !== "" ? data.leave_taken : 0,
      editleaveTakenSick:
        data.leave_taken_sick !== "" ? data.leave_taken_sick : 0,
      editEndDate:
        data.emp_contract_end_date != null
          ? moment(data.emp_contract_end_date).format("ll")
          : "",
    });

    this.editDropDownsForm.patchValue({
      editworkLocDropdownValue: data.work_location,
      editTimeZoneDropdownValue: {
        id: data.time_zone,
        description: data.time_zone,
      },
      editTimeFormatDropdownValue: {
        id: data.time_format,
        description: data.time_format,
      },
      wrkProfileEffectiveDay: moment(data.work_profile_effective_day).format(
        "ll"
      ),
    });

    if (data.minimum_overtime) {
      this.handleOverTimeCheck = false;
      let splitVal = data.minimum_overtime.split(":");
      console.log("split", splitVal);

      let found = this.overtimeHourData.find((item) => item.id == splitVal[0]);
      console.log("found", splitVal);
      let found1 = this.overtimeMinuteData.find(
        (item) => item.id == splitVal[1]
      );
      console.log("found1", splitVal);
      this.editEmployeeLeaveForm.patchValue({
        overtimeHour: found,
        overtimeMinute: found1,
      });
    } else {
      this.handleOverTimeCheck = true;
    }

    this.editEmployeeLeaveForm.patchValue({
      isWeekDayOvertime: data.is_weekday_overtime_enabled,
      isHoliDayOvertime: data.is_holiday_overtime_enabled,
    });

    this.editAddDropDownValues(
      data.team_id,
      data.emp_type_id,
      data.role_id,
      data.leave_profile_setup_id,
      data.emp_status_id
    );

    this.phoneNumberValue = data.phone;
    this.phoneNumberCode = data.phone_iso_name;
    this.empStatusValue = data.emp_status_id;

    this.extraAllowance = [];
    this.extraDeduction = [];

    if (data.a_one > 0) {
      this.extraAllowance.push(true);
    }
    if (data.a_two > 0) {
      this.extraAllowance.push(true);
    }
    if (data.a_three > 0) {
      this.extraAllowance.push(true);
    }

    if (data.d_one > 0) {
      this.extraDeduction.push(true);
    }
    if (data.d_two > 0) {
      this.extraDeduction.push(true);
    }
    if (data.d_three > 0) {
      this.extraDeduction.push(true);
    }

    if (data.working_days !== null) {
      let testData = data.working_days.split(",");
      this.editWorkdaysData = [];
      testData.includes("Saturday") === true
        ? this.editWorkdaysData.push({
            day: "SA",
            day_name: "Saturday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "SA",
            day_name: "Saturday",
            is_working: false,
          });
      testData.includes("Sunday") === true
        ? this.editWorkdaysData.push({
            day: "SU",
            day_name: "Sunday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "SU",
            day_name: "Sunday",
            is_working: false,
          });
      testData.includes("Monday") === true
        ? this.editWorkdaysData.push({
            day: "MO",
            day_name: "Monday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "MO",
            day_name: "Monday",
            is_working: false,
          });
      testData.includes("Tuesday") === true
        ? this.editWorkdaysData.push({
            day: "TU",
            day_name: "Tuesday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "TU",
            day_name: "Tuesday",
            is_working: false,
          });
      testData.includes("Wednesday") === true
        ? this.editWorkdaysData.push({
            day: "WE",
            day_name: "Wednesday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "WE",
            day_name: "Wednesday",
            is_working: false,
          });
      testData.includes("Thursday") === true
        ? this.editWorkdaysData.push({
            day: "TH",
            day_name: "Thursday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "TH",
            day_name: "Thursday",
            is_working: false,
          });
      testData.includes("Friday") === true
        ? this.editWorkdaysData.push({
            day: "FR",
            day_name: "Friday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "FR",
            day_name: "Friday",
            is_working: false,
          });

      if (data.is_flexible === true) {
        this.editIsFlexibleDiv = true;
        this.editDropDownsForm.patchValue({
          editStartTimeDropdownValue: { id: null, description: "select" },
          editEndTimeDropdownValue: { id: null, description: "select" },
          editCheckinTolerance: { id: null, description: "select" },
          editBreakTimeLimit: { id: null, description: "select" },
          editCheckInAfter: {
            id: data.checkin_after,
            description: data.checkin_after,
          },
          editCheckOutBefore: {
            id: data.checkout_before,
            description: data.checkout_before,
          },
          editTotalHoursDropdownValue: {
            id: data.min_hrs_flx,
            description: data.min_hrs_flx,
          },
          editBreakTimeLimitFlex: {
            id: data.break_time_flx,
            description: data.break_time_flx,
          },
          editLessHourTolerance: {
            id: data.less_hour_tolerance,
            description: data.less_hour_tolerance,
          },
        });
      } else {
        this.editIsFlexibleDiv = false;
        this.editDropDownsForm.patchValue({
          editStartTimeDropdownValue: {
            id: data.work_start_time,
            description: data.work_start_time,
          },
          editEndTimeDropdownValue: {
            id: data.work_end_time,
            description: data.work_end_time,
          },
          editCheckinTolerance: {
            id: data.checkin_tolarence,
            description: data.checkin_tolarence,
          },
          editBreakTimeLimit: {
            id: data.break_time,
            description: data.break_time,
          },
          editCheckInAfter: { id: null, description: "select" },
          editCheckOutBefore: { id: null, description: "select" },
          editTotalHoursDropdownValue: { id: null, description: "select" },
          editBreakTimeLimitFlex: { id: null, description: "select" },
          editWorkingHours: this.calculateTimeDifference(
            data.work_start_time,
            data.work_end_time
          ),
          editadjustedCheckoutTime: this.addTimePeriod(
            data.checkin_tolarence,
            this.calculateTimeDifference(
              data.work_start_time,
              data.work_end_time
            )
          ),
          editLessHourTolerance: {
            id: data.less_hour_tolerance,
            description: data.less_hour_tolerance,
          },
        });
      }

      if (data.is_custom_work) {
        let exptest = data.work_days_exp.split(",");
        this.editWorkDayExp = [];
        this.managed = true;
        exptest.includes("Saturday.") === true
          ? this.editWorkDayExp.push({
              day: "SA",
              day_name: "Saturday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "SA",
              day_name: "Saturday.",
              is_working: false,
            });
        exptest.includes("Sunday.") === true
          ? this.editWorkDayExp.push({
              day: "SU",
              day_name: "Sunday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "SU",
              day_name: "Sunday.",
              is_working: false,
            });
        exptest.includes("Monday.") === true
          ? this.editWorkDayExp.push({
              day: "MO",
              day_name: "Monday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "MO",
              day_name: "Monday.",
              is_working: false,
            });
        exptest.includes("Tuesday.") === true
          ? this.editWorkDayExp.push({
              day: "TU",
              day_name: "Tuesday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "TU",
              day_name: "Tuesday.",
              is_working: false,
            });
        exptest.includes("Wednesday.") === true
          ? this.editWorkDayExp.push({
              day: "WE",
              day_name: "Wednesday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "WE",
              day_name: "Wednesday.",
              is_working: false,
            });
        exptest.includes("Thursday.") === true
          ? this.editWorkDayExp.push({
              day: "TH",
              day_name: "Thursday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "TH",
              day_name: "Thursday.",
              is_working: false,
            });
        exptest.includes("Friday.") === true
          ? this.editWorkDayExp.push({
              day: "FR",
              day_name: "Friday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "FR",
              day_name: "Friday.",
              is_working: false,
            });

        let expday = [];
        // saturday exp
        if (data.saturday_exp != null || data.saturday_exp != "") {
          expday = data.saturday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsasa: { id: expday[1], description: expday[1] },
              websa: { id: expday[2], description: expday[2] },
              misa: { id: expday[3], description: expday[3] },
              btlsa: { id: expday[4], description: expday[4] },
              lhtsa: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartSaturday: { id: expday[1], description: expday[1] },
              EndSaturday: { id: expday[2], description: expday[2] },
              tosa: { id: expday[3], description: expday[3] },
              btlsa: { id: expday[4], description: expday[4] },
              lhtsa: { id: expday[5], description: expday[5] },
              actsa: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whsa: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        // sunday exp
        if (data.sunday_exp != null || data.sunday_exp != "") {
          expday = data.sunday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsasu: { id: expday[1], description: expday[1] },
              websu: { id: expday[2], description: expday[2] },
              misu: { id: expday[3], description: expday[3] },
              btlsu: { id: expday[4], description: expday[4] },
              lhtsu: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartSunday: { id: expday[1], description: expday[1] },
              EndSunday: { id: expday[2], description: expday[2] },
              tosu: { id: expday[3], description: expday[3] },
              btlsu: { id: expday[4], description: expday[4] },
              lhtsu: { id: expday[5], description: expday[5] },
              actsu: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whsu: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        //monday exp
        if (data.monday_exp != null || data.monday_exp != "") {
          expday = data.monday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsamo: { id: expday[1], description: expday[1] },
              webmo: { id: expday[2], description: expday[2] },
              mismo: { id: expday[3], description: expday[3] },
              btlmo: { id: expday[4], description: expday[4] },
              lhtmo: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartMonday: { id: expday[1], description: expday[1] },
              EndMonday: { id: expday[2], description: expday[2] },
              tomo: { id: expday[3], description: expday[3] },
              btlmo: { id: expday[4], description: expday[4] },
              lhtmo: { id: expday[5], description: expday[5] },
              actmo: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whmo: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        //tuesday exp
        if (data.tuesday_exp != null || data.tuesday_exp != "") {
          expday = data.tuesday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsatu: { id: expday[1], description: expday[1] },
              webtu: { id: expday[2], description: expday[2] },
              mistu: { id: expday[3], description: expday[3] },
              btltu: { id: expday[4], description: expday[4] },
              lhttu: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartTuesday: { id: expday[1], description: expday[1] },
              EndTuesday: { id: expday[2], description: expday[2] },
              totu: { id: expday[3], description: expday[3] },
              btltu: { id: expday[4], description: expday[4] },
              lhttu: { id: expday[5], description: expday[5] },
              acttu: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whtu: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        // wednesday exp
        if (data.wednesday_exp != null || data.wednesday_exp != "") {
          expday = data.wednesday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsawe: { id: expday[1], description: expday[1] },
              webwe: { id: expday[2], description: expday[2] },
              miswe: { id: expday[3], description: expday[3] },
              btlwe: { id: expday[4], description: expday[4] },
              lhtwe: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartWednesday: { id: expday[1], description: expday[1] },
              EndWednesday: { id: expday[2], description: expday[2] },
              towe: { id: expday[3], description: expday[3] },
              btlwe: { id: expday[4], description: expday[4] },
              actwe: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whwe: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        // thursday exp
        if (data.thursday_exp != null || data.thursday_exp != "") {
          expday = data.thursday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsath: { id: expday[1], description: expday[1] },
              webth: { id: expday[2], description: expday[2] },
              misth: { id: expday[3], description: expday[3] },
              btlth: { id: expday[4], description: expday[4] },
              lhtth: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartThursday: { id: expday[1], description: expday[1] },
              EndThursday: { id: expday[2], description: expday[2] },
              toth: { id: expday[3], description: expday[3] },
              btlth: { id: expday[4], description: expday[4] },
              actth: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whth: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        //friday exp
        if (data.friday_exp != null || data.friday_exp != "") {
          expday = data.friday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsafr: { id: expday[1], description: expday[1] },
              webfr: { id: expday[2], description: expday[2] },
              misfr: { id: expday[3], description: expday[3] },
              btlfr: { id: expday[4], description: expday[4] },
              lhtfr: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartFriday: { id: expday[1], description: expday[1] },
              EndFriday: { id: expday[2], description: expday[2] },
              tofr: { id: expday[3], description: expday[3] },
              btlfr: { id: expday[4], description: expday[4] },
              actfr: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whfr: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
      } else {
        this.managed = false;
      }
    } else {
      //this.editPutOrganizationValues();
    }

    if (data.leave_profile_setup_id === null) {
      this.editlProfEffectiveDateDiv = false;
    }

    if (Number(data.leave_taken) > 0) {
      this.editleaveTakenDiv = true;
    }

    if (Number(data.open_balance_days) > 0) {
      this.editopeningBalanceDiv = true;
    }

    let empJoiningDate =
      this.editEmployeeLeaveForm.controls["editJoinedDate"].value;
    let profileStartDate =
      this.editEmployeeLeaveForm.controls["editProfileStartDate"].value;

    if (profileStartDate === null) {
      // this.editSetProfileEffectiveDate(empJoiningDate);
      // this.FindByOrgId(empJoiningDate);
    }

    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    this.editDropDownsForm.patchValue({
      workSettings: data.workday_settings,
    });

    if (
      data.workday_settings == "Organistaion Settings" ||
      data.workday_settings == "Team Settings"
    ) {
      this.disableWork = true;
      this.editDropDownsForm
        .get("editFlexibleCheckbox")
        .disable({ onlySelf: true });
      this.editDropDownsForm
        .get("editCostomWorkDays")
        .disable({ onlySelf: true });
      this.editDropDownsForm.get("saIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("suIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("moIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("tuIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("weIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("thIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("frIsFlex").disable({ onlySelf: true });
    }

    if (data.term_end_by) {
      this.istermination = true;
      this.terminationData = {
        term_end_by: data.term_end_by,
        term_end_date: moment(data.term_end_date).format("L"),
        term_type: data.term_type,
        term_reason: data.term_reason,
        remarks: data.remarks,
        term_doc_url: data.term_doc_url,
      };
      this.adjDocUrl = data.term_doc_url;
    } else {
      this.adjDocUrl = "";
      this.isadjDocUp = false;
      this.istermination = false;
      this.terminationData = null;
    }

    //this.selectededitedWorkSettings({value: data.workday_settings})
  }

  //edit employee starts
  editEmployeeDiv(empdata) {
    //Check if the record is there in the draft

    let is_drafted = this.draftEmployeeList.some(
      (hash) => hash.emp_id === empdata.id
    );
    let saveddraftdetails;
    if (is_drafted) {
      Swal.fire({
        title:
          "Employee edited draft details are already available in the Saved Draft Section!",
        text: "Do you want to delete the existing Draft and create new employee edit session?",
        showCloseButton: true,
        confirmButtonColor: "#e91e63",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Yes Create New",
        cancelButtonText: "Continue From Draft",
      }).then((res) => {
        if (res.value === true) {
          Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Delete the Saved Draft",
            showCancelButton: true,
            confirmButtonColor: "#e91e63",
            confirmButtonText: "Yes, delete it!",
          }).then((result) => {
            if (result.value == true) {
              this.spinner.show();
              saveddraftdetails = this.draftEmployeeList.find(
                (hash) => hash.emp_id === empdata.id
              );
              this.empService
                .RemoveOverrideDetailsById({ id: saveddraftdetails.id })
                .subscribe((datain: any) => {
                  if (datain.status == 200) {
                    this.empService
                      .GetDocumentsByempIdwithDelete({ id: empdata.id })
                      .subscribe(async (docdata: any) => {
                        if (docdata != null) {
                          await docdata.map((doc: any) => {
                            if (
                              doc.related_to != "original" &&
                              doc.is_approved == false
                            ) {
                              console.log(
                                "find unsaved draft document to delete",
                                doc
                              );
                              this.removeDocPermenentByID(doc);
                            }
                            if (
                              doc.related_to == "original" &&
                              doc.is_approved == false
                            ) {
                              doc.is_approved = true;
                              doc.doc_action = "complete";
                              doc.is_deleted = false;
                              this.empService
                                .UpdateDocById(doc)
                                .subscribe((rep) => {
                                  if (rep) {
                                    if (rep["result"]["status"] == 200) {
                                      console.log(
                                        "Original Document is Revived Back to Normal"
                                      );
                                    }
                                  }
                                });
                            }
                          });
                          this.spinner.hide();
                          this.getDraftEmployeeEditData();
                          this.newemployeeeditsession(empdata);
                        }
                        //for reloading the draft section after the deleting the record
                      });
                  }
                });
            }
          });
        } else {
          saveddraftdetails = this.draftEmployeeList.find(
            (hash) => hash.emp_id === empdata.id
          );
          this.editEmployeeDivDraft(saveddraftdetails);
        }
      });
    } else {
      this.newemployeeeditsession(empdata);
    }
  }

  newemployeeeditsession(data) {
    this.spinner.show();
    this.getAllTimeZone();
    this.GetEmployeeStatusByOrgID();
    this.editEmployeeLeaveFormInputs();
    this.editEmployeeFormInputs();
    this.editDropDownFormInputs();
    this.editCallDaysandTiming();
    this.editEmployeeExtensionDiv(data);
    this.fillOriginalDocDetails();
    this.InputeditWorkDayExp();
    //get profile change history
    this.GetLeaveAvailableProfileHistorybyOrgIdEmpId(data.id);
    this.GetWorkProfileHistorybyEmpId(data.id);
    this.GetSalaryHistorybyEmpId(data.id);
    this.getEmployeeEditHistory(data.id);

    //this.editEmployeeData = data;
    this.fromsavedraft = false;
    this.allEmployeeGrid = false;
    this.singleEmployeeAdd = false;
    this.singleEmployeeEdit = true;
    let postData = {
      id: data.id,
    };
    this.empService.getByEmployeeID(postData).subscribe(
      (data: any) => {
        if (data) {
          this.currentEmployeeData = data;
          this.editEmployeeForm.patchValue({
            eFirstName: data.first_name,
            eLastName: data.last_name,
            eWorkEmail: data.workemail,
            empCode: data.emp_code,
            nationality: data.alias,
          });
          this.checkGender(data.gender);
          //leave profile
          this.editEmployeeLeaveForm.patchValue({
            editJoinedDate:
              data.joined_date != null
                ? moment(data.joined_date).format("ll")
                : "",
            editProfileStartDate:
              data.profile_effective_from_date != null
                ? moment(data.profile_effective_from_date).format("ll")
                : "",
            editopenBalance:
              data.open_balance_days !== "" ? data.open_balance_days : 0,
            editleaveTaken: data.leave_taken !== "" ? data.leave_taken : 0,
            editleaveTakenSick:
              data.leave_taken_sick !== "" ? data.leave_taken_sick : 0,
          });
          //time zone

          this.editDropDownsForm.patchValue({
            editworkLocDropdownValue: data.work_location,
            editTimeZoneDropdownValue: {
              id: data.time_zone,
              description: data.time_zone,
            },
            editTimeFormatDropdownValue: {
              id: data.time_format,
              description: data.time_format,
            },
            wrkProfileEffectiveDay: moment(
              data.work_profile_effective_day
            ).format("ll"),
          });

          if (data.minimum_overtime) {
            this.handleOverTimeCheck = false;
            let splitVal = data.minimum_overtime.split(":");
            let found = this.overtimeHourData.find(
              (item) => item.id == splitVal[0]
            );
            let found1 = this.overtimeMinuteData.find(
              (item) => item.id == splitVal[1]
            );
            this.editEmployeeLeaveForm.patchValue({
              overtimeHour: found,
              overtimeMinute: found1,
            });
          } else {
            this.handleOverTimeCheck = true;
          }

          this.editEmployeeLeaveForm.patchValue({
            isWeekDayOvertime: data.is_weekday_overtime_enabled,
            isHoliDayOvertime: data.is_holiday_overtime_enabled,
          });

          this.editAddDropDownValues(
            data.team_id,
            data.emp_type_id,
            data.role_id,
            data.leave_profile_setup_id,
            data.emp_status_id
          );

          this.phoneNumberValue = data.phone;
          this.phoneNumberCode = data.phone_iso_name;
          this.empStatusValue = data.emp_status_id;

          if (data.working_days !== null) {
            let testData = data.working_days.split(",");
            this.editWorkdaysData = [];
            testData.includes("Saturday") === true
              ? this.editWorkdaysData.push({
                  day: "SA",
                  day_name: "Saturday",
                  is_working: true,
                })
              : this.editWorkdaysData.push({
                  day: "SA",
                  day_name: "Saturday",
                  is_working: false,
                });
            testData.includes("Sunday") === true
              ? this.editWorkdaysData.push({
                  day: "SU",
                  day_name: "Sunday",
                  is_working: true,
                })
              : this.editWorkdaysData.push({
                  day: "SU",
                  day_name: "Sunday",
                  is_working: false,
                });
            testData.includes("Monday") === true
              ? this.editWorkdaysData.push({
                  day: "MO",
                  day_name: "Monday",
                  is_working: true,
                })
              : this.editWorkdaysData.push({
                  day: "MO",
                  day_name: "Monday",
                  is_working: false,
                });
            testData.includes("Tuesday") === true
              ? this.editWorkdaysData.push({
                  day: "TU",
                  day_name: "Tuesday",
                  is_working: true,
                })
              : this.editWorkdaysData.push({
                  day: "TU",
                  day_name: "Tuesday",
                  is_working: false,
                });
            testData.includes("Wednesday") === true
              ? this.editWorkdaysData.push({
                  day: "WE",
                  day_name: "Wednesday",
                  is_working: true,
                })
              : this.editWorkdaysData.push({
                  day: "WE",
                  day_name: "Wednesday",
                  is_working: false,
                });
            testData.includes("Thursday") === true
              ? this.editWorkdaysData.push({
                  day: "TH",
                  day_name: "Thursday",
                  is_working: true,
                })
              : this.editWorkdaysData.push({
                  day: "TH",
                  day_name: "Thursday",
                  is_working: false,
                });
            testData.includes("Friday") === true
              ? this.editWorkdaysData.push({
                  day: "FR",
                  day_name: "Friday",
                  is_working: true,
                })
              : this.editWorkdaysData.push({
                  day: "FR",
                  day_name: "Friday",
                  is_working: false,
                });

            if (data.is_flexible === true) {
              this.editIsFlexibleDiv = true;
              this.editDropDownsForm.patchValue({
                editStartTimeDropdownValue: { id: null, description: "select" },
                editEndTimeDropdownValue: { id: null, description: "select" },
                editCheckinTolerance: { id: null, description: "select" },
                editBreakTimeLimit: { id: null, description: "select" },
                editCheckInAfter: {
                  id: data.checkin_after,
                  description: data.checkin_after,
                },
                editCheckOutBefore: {
                  id: data.checkout_before,
                  description: data.checkout_before,
                },
                editTotalHoursDropdownValue: {
                  id: data.min_hrs_flx,
                  description: data.min_hrs_flx,
                },
                editBreakTimeLimitFlex: {
                  id: data.break_time_flx,
                  description: data.break_time_flx,
                },
                editLessHourTolerance: {
                  id: data.less_hour_tolerance,
                  description: data.less_hour_tolerance,
                },
              });
            } else {
              this.editIsFlexibleDiv = false;
              this.editDropDownsForm.patchValue({
                editStartTimeDropdownValue: {
                  id: data.work_start_time,
                  description: data.work_start_time,
                },
                editEndTimeDropdownValue: {
                  id: data.work_end_time,
                  description: data.work_end_time,
                },
                editCheckinTolerance: {
                  id: data.checkin_tolarence,
                  description: data.checkin_tolarence,
                },
                editBreakTimeLimit: {
                  id: data.break_time,
                  description: data.break_time,
                },
                editCheckInAfter: { id: null, description: "select" },
                editCheckOutBefore: { id: null, description: "select" },
                editTotalHoursDropdownValue: {
                  id: null,
                  description: "select",
                },
                editBreakTimeLimitFlex: { id: null, description: "select" },
                editWorkingHours: this.calculateTimeDifference(
                  data.work_start_time,
                  data.work_end_time
                ),
                editadjustedCheckoutTime: this.addTimePeriod(
                  data.checkin_tolarence,
                  this.calculateTimeDifference(
                    data.work_start_time,
                    data.work_end_time
                  )
                ),
                editLessHourTolerance: {
                  id: data.less_hour_tolerance,
                  description: data.less_hour_tolerance,
                },
              });
            }

            if (data.is_custom_work) {
              let exptest = data.work_days_exp.split(",");
              this.editWorkDayExp = [];
              this.managed = true;
              exptest.includes("Saturday.") === true
                ? this.editWorkDayExp.push({
                    day: "SA",
                    day_name: "Saturday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "SA",
                    day_name: "Saturday.",
                    is_working: false,
                  });
              exptest.includes("Sunday.") === true
                ? this.editWorkDayExp.push({
                    day: "SU",
                    day_name: "Sunday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "SU",
                    day_name: "Sunday.",
                    is_working: false,
                  });
              exptest.includes("Monday.") === true
                ? this.editWorkDayExp.push({
                    day: "MO",
                    day_name: "Monday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "MO",
                    day_name: "Monday.",
                    is_working: false,
                  });
              exptest.includes("Tuesday.") === true
                ? this.editWorkDayExp.push({
                    day: "TU",
                    day_name: "Tuesday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "TU",
                    day_name: "Tuesday.",
                    is_working: false,
                  });
              exptest.includes("Wednesday.") === true
                ? this.editWorkDayExp.push({
                    day: "WE",
                    day_name: "Wednesday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "WE",
                    day_name: "Wednesday.",
                    is_working: false,
                  });
              exptest.includes("Thursday.") === true
                ? this.editWorkDayExp.push({
                    day: "TH",
                    day_name: "Thursday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "TH",
                    day_name: "Thursday.",
                    is_working: false,
                  });
              exptest.includes("Friday.") === true
                ? this.editWorkDayExp.push({
                    day: "FR",
                    day_name: "Friday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "FR",
                    day_name: "Friday.",
                    is_working: false,
                  });

              let expday = [];
              // saturday exp
              if (data.saturday_exp != null) {
                expday = data.saturday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsasa: { id: expday[1], description: expday[1] },
                    websa: { id: expday[2], description: expday[2] },
                    misa: { id: expday[3], description: expday[3] },
                    btlsa: { id: expday[4], description: expday[4] },
                    lhtsa: { id: expday[5], description: expday[5] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartSaturday: { id: expday[1], description: expday[1] },
                    EndSaturday: { id: expday[2], description: expday[2] },
                    tosa: { id: expday[3], description: expday[3] },
                    btlsa: { id: expday[4], description: expday[4] },
                    lhtsa: { id: expday[5], description: expday[5] },
                    actsa: this.addTimePeriod(
                      expday[3],
                      this.calculateTimeDifference(expday[1], expday[2])
                    ),
                    whsa: this.calculateTimeDifference(expday[1], expday[2]),
                  });
                }
              }
              // sunday exp
              if (data.sunday_exp != null) {
                expday = data.sunday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsasu: { id: expday[1], description: expday[1] },
                    websu: { id: expday[2], description: expday[2] },
                    misu: { id: expday[3], description: expday[3] },
                    btlsu: { id: expday[4], description: expday[4] },
                    lhtsu: { id: expday[5], description: expday[5] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartSunday: { id: expday[1], description: expday[1] },
                    EndSunday: { id: expday[2], description: expday[2] },
                    tosu: { id: expday[3], description: expday[3] },
                    btlsu: { id: expday[4], description: expday[4] },
                    lhtsu: { id: expday[5], description: expday[5] },
                    actsu: this.addTimePeriod(
                      expday[3],
                      this.calculateTimeDifference(expday[1], expday[2])
                    ),
                    whsu: this.calculateTimeDifference(expday[1], expday[2]),
                  });
                }
              }
              //monday exp
              if (data.monday_exp != null) {
                expday = data.monday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsamo: { id: expday[1], description: expday[1] },
                    webmo: { id: expday[2], description: expday[2] },
                    mismo: { id: expday[3], description: expday[3] },
                    btlmo: { id: expday[4], description: expday[4] },
                    lhtmo: { id: expday[5], description: expday[5] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartMonday: { id: expday[1], description: expday[1] },
                    EndMonday: { id: expday[2], description: expday[2] },
                    tomo: { id: expday[3], description: expday[3] },
                    btlmo: { id: expday[4], description: expday[4] },
                    lhtmo: { id: expday[5], description: expday[5] },
                    actmo: this.addTimePeriod(
                      expday[3],
                      this.calculateTimeDifference(expday[1], expday[2])
                    ),
                    whmo: this.calculateTimeDifference(expday[1], expday[2]),
                  });
                }
              }
              //tuesday exp
              if (data.tuesday_exp != null) {
                expday = data.tuesday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsatu: { id: expday[1], description: expday[1] },
                    webtu: { id: expday[2], description: expday[2] },
                    mistu: { id: expday[3], description: expday[3] },
                    btltu: { id: expday[4], description: expday[4] },
                    lhttu: { id: expday[5], description: expday[5] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartTuesday: { id: expday[1], description: expday[1] },
                    EndTuesday: { id: expday[2], description: expday[2] },
                    totu: { id: expday[3], description: expday[3] },
                    btltu: { id: expday[4], description: expday[4] },
                    lhttu: { id: expday[5], description: expday[5] },
                    acttu: this.addTimePeriod(
                      expday[3],
                      this.calculateTimeDifference(expday[1], expday[2])
                    ),
                    whtu: this.calculateTimeDifference(expday[1], expday[2]),
                  });
                }
              }
              // wednesday exp
              if (data.wednesday_exp != null) {
                expday = data.wednesday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsawe: { id: expday[1], description: expday[1] },
                    webwe: { id: expday[2], description: expday[2] },
                    miswe: { id: expday[3], description: expday[3] },
                    btlwe: { id: expday[4], description: expday[4] },
                    lhtwe: { id: expday[5], description: expday[5] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartWednesday: { id: expday[1], description: expday[1] },
                    EndWednesday: { id: expday[2], description: expday[2] },
                    towe: { id: expday[3], description: expday[3] },
                    btlwe: { id: expday[4], description: expday[4] },
                    lhtwe: { id: expday[5], description: expday[5] },
                    actwe: this.addTimePeriod(
                      expday[3],
                      this.calculateTimeDifference(expday[1], expday[2])
                    ),
                    whwe: this.calculateTimeDifference(expday[1], expday[2]),
                  });
                }
              }
              // thursday exp
              if (data.thursday_exp != null) {
                expday = data.thursday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsath: { id: expday[1], description: expday[1] },
                    webth: { id: expday[2], description: expday[2] },
                    misth: { id: expday[3], description: expday[3] },
                    btlth: { id: expday[4], description: expday[4] },
                    lhtth: { id: expday[5], description: expday[5] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartThursday: { id: expday[1], description: expday[1] },
                    EndThursday: { id: expday[2], description: expday[2] },
                    toth: { id: expday[3], description: expday[3] },
                    btlth: { id: expday[4], description: expday[4] },
                    lhtth: { id: expday[5], description: expday[5] },
                    actth: this.addTimePeriod(
                      expday[3],
                      this.calculateTimeDifference(expday[1], expday[2])
                    ),
                    whth: this.calculateTimeDifference(expday[1], expday[2]),
                  });
                }
              }
              //friday exp
              if (data.friday_exp != null) {
                expday = data.friday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsafr: { id: expday[1], description: expday[1] },
                    webfr: { id: expday[2], description: expday[2] },
                    misfr: { id: expday[3], description: expday[3] },
                    btlfr: { id: expday[4], description: expday[4] },
                    lhtfr: { id: expday[5], description: expday[5] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartFriday: { id: expday[1], description: expday[1] },
                    EndFriday: { id: expday[2], description: expday[2] },
                    tofr: { id: expday[3], description: expday[3] },
                    btlfr: { id: expday[4], description: expday[4] },
                    lhtfr: { id: expday[5], description: expday[5] },
                    actfr: this.addTimePeriod(
                      expday[3],
                      this.calculateTimeDifference(expday[1], expday[2])
                    ),
                    whfr: this.calculateTimeDifference(expday[1], expday[2]),
                  });
                }
              }
            } else {
              this.managed = false;
            }
          } else {
            //this.editPutOrganizationValues();
          }

          if (data.leave_profile_setup_id === null) {
            this.editlProfEffectiveDateDiv = false;
          }

          if (Number(data.leave_taken) > 0) {
            this.editleaveTakenDiv = true;
          }

          if (Number(data.open_balance_days) > 0) {
            this.editopeningBalanceDiv = true;
          }

          //if leave profile effective days is null
          let empJoiningDate =
            this.editEmployeeLeaveForm.controls["editJoinedDate"].value;

          console.log("from the api call", data.profile_effective_from_date);

          if (data.profile_effective_from_date === null) {
            //this.editSetProfileEffectiveDate(empJoiningDate);
            //this.FindByOrgId(empJoiningDate);
          }
          //if leave profile effective days is null
          this.spinner.hide();
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });

          this.editDropDownsForm.patchValue({
            workSettings: data.workday_settings,
          });

          if (
            data.workday_settings == "Organistaion Settings" ||
            data.workday_settings == "Team Settings"
          ) {
            this.disableWork = true;
            this.editDropDownsForm
              .get("editFlexibleCheckbox")
              .disable({ onlySelf: true });
            this.editDropDownsForm
              .get("editCostomWorkDays")
              .disable({ onlySelf: true });
            this.editDropDownsForm.get("saIsFlex").disable({ onlySelf: true });
            this.editDropDownsForm.get("suIsFlex").disable({ onlySelf: true });
            this.editDropDownsForm.get("moIsFlex").disable({ onlySelf: true });
            this.editDropDownsForm.get("tuIsFlex").disable({ onlySelf: true });
            this.editDropDownsForm.get("weIsFlex").disable({ onlySelf: true });
            this.editDropDownsForm.get("thIsFlex").disable({ onlySelf: true });
            this.editDropDownsForm.get("frIsFlex").disable({ onlySelf: true });
          }

          if (data.term_end_by) {
            this.istermination = true;
            this.terminationData = {
              term_end_by: data.term_end_by,
              term_end_date: moment(data.term_end_date).format("L"),
              term_type: data.term_type,
              term_reason: data.term_reason,
              remarks: data.remarks,
              term_doc_url: data.term_doc_url,
            };
            this.adjDocUrl = data.term_doc_url;
          } else {
            this.adjDocUrl = "";
            this.isadjDocUp = false;
            this.istermination = false;
            this.terminationData = null;
          }
        }

        //this.selectededitedWorkSettings({value: data.workday_settings});
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );
  }

  editWorkDayExp = [];

  InputeditWorkDayExp() {
    this.editWorkDayExp.push(
      {
        day: "SA",
        day_name: "Saturday.",
        is_working: false,
      },
      {
        day: "SU",
        day_name: "Sunday.",
        is_working: false,
      },
      {
        day: "MO",
        day_name: "Monday.",
        is_working: false,
      },
      {
        day: "TU",
        day_name: "Tuesday.",
        is_working: false,
      },
      {
        day: "WE",
        day_name: "Wednesday.",
        is_working: false,
      },
      {
        day: "TH",
        day_name: "Thursday.",
        is_working: false,
      },
      {
        day: "FR",
        day_name: "Friday.",
        is_working: false,
      }
    );
  }

  editAddDropDownValues(teamID, empTypID, roleId, leaveID, statusId) {
    this.teamService.FindTeamsByOrgID().subscribe((data: any) => {
      let results = [{ id: null, description: "Without Team" }];
      if (data) {
        data.map((elm) => {
          results.push({
            id: elm.id,
            description: elm.team_name,
          });
        });
        this.teamByOrganizationData = results;
        console.log("Teams : ", this.teamByOrganizationData);
        this.teamByOrganizationData.map((elm) => {
          if (elm.id === teamID) {
            this.editDropDownsForm.patchValue({
              editTeamDropdownValue: {
                id: teamID,
                description: elm.description,
              },
            });
            this.currentTeamName = elm.description;
          }
        });
      }
    });

    this.empService.GetEmployeeTypeByOrgID().subscribe((data: any) => {
      var results = [];
      data.map((elm) => {
        results.push({
          id: elm.id,
          description: elm.employee_type_name,
        });
      });
      this.employeeTypeData = results;
      console.log("Types : ", this.employeeTypeData);
      this.employeeTypeData.map((elm) => {
        if (elm.id === empTypID) {
          this.editDropDownsForm.patchValue({
            editEmpTypeDropdownValue: {
              id: empTypID,
              description: elm.description,
            },
          });
          this.currentEmpTypeName = elm.description;
        }
      });
    });

    this.empService.GetEmployeeRoleByOrgID().subscribe((data: any) => {
      let results = [{ id: null, description: "No Role" }];
      data.map((elm) => {
        results.push({
          id: elm.id,
          description: elm.role_name,
        });
      });
      results = results.filter(
        (el: any) => el.description.toLowerCase() !== "account owner"
      );
      this.employeeRoleData = results;
      console.log("Role : ", this.employeeRoleData);
      this.employeeRoleData.map((elm) => {
        if (elm.id === roleId) {
          this.editDropDownsForm.patchValue({
            editRoleDropdownValue: {
              id: roleId,
              description: elm.description,
            },
          });
        }
      });
    });

    let postData = { orgID: localStorage.getItem("org_id") };
    this.AdministrativeService.GetAllLeaveProfileSetupByOrgID(
      postData
    ).subscribe((data: any) => {
      let results = [{ id: null, description: "No Leave Profile" }];
      data.map((elm) => {
        if (elm.is_approved === true) {
          results.push({
            id: elm.leaveDetails[0].id,
            description: elm.profileName,
          });
        }
      });

      this.leaveProfileType = results;
      console.log("Leave Profile : ", this.leaveProfileType);
      this.leaveProfileType.map((elm) => {
        if (elm.id === leaveID) {
          this.editEmployeeLeaveForm.patchValue({
            editleaveProfileDropdownValue: {
              id: leaveID,
              description: elm.description,
            },
          });
          this.currentLeaveName = elm.description;
        }
      });
      this.overtimeProfileType = [
        { id: "xfaskgjah", description: "UAE OverTime Profile" },
      ];
    });

    this.empService.GetEmployeeStatusByOrgID().subscribe(
      (data: any) => {
        if (data) {
          this.empstatusData = [{ id: "null", description: "Select" }];
          data.map((elm) => {
            this.empstatusData.push({
              id: elm.id,
              description: elm.employee_status_name,
            });
            console.log("error, status ID", statusId, "elm Id", elm.id);
          });

          this.empstatusData.map((elm) => {
            if (elm.id == statusId) {
              console.log("success, status ID", statusId, "elm Id", elm.id);
              this.editDropDownsForm.patchValue({
                editStatusDropdownValue: {
                  id: elm.id,
                  description: elm.description,
                },
              });
            }
          });
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );
  }

  timelimits = [
    {
      id: "0 min",
      description: "0 min",
    },
    {
      id: "5 min",
      description: "5 min",
    },
    {
      id: "10 min",
      description: "10 min",
    },
    {
      id: "15 min",
      description: "15 min",
    },
    {
      id: "20 min",
      description: "20 min",
    },
    {
      id: "25 min",
      description: "25 min",
    },
    {
      id: "30 min",
      description: "30 min",
    },
    {
      id: "45 min",
      description: "45 min",
    },
    {
      id: "1 hour",
      description: "1 hour",
    },
    {
      id: "1h 30m",
      description: "1h 30m",
    },
    {
      id: "2 hour",
      description: "2 hour",
    },
    {
      id: "3 hour",
      description: "3 hour",
    },
  ];

  editCallDaysandTiming() {
    this.workStartHoursData = [
      {
        id: null,
        description: "select",
      },
      {
        id: "6:00 AM",
        description: "6:00 AM",
      },
      {
        id: "6:30 AM",
        description: "6:30 AM",
      },
      {
        id: "7:00 AM",
        description: "7:00 AM",
      },
      {
        id: "7:30 AM",
        description: "7:30 AM",
      },
      {
        id: "8:00 AM",
        description: "8:00 AM",
      },
      {
        id: "8:30 AM",
        description: "8:30 AM",
      },
      {
        id: "9:00 AM",
        description: "9:00 AM",
      },
      {
        id: "9:30 AM",
        description: "9:30 AM",
      },
      {
        id: "10:00 AM",
        description: "10:00 AM",
      },
      {
        id: "10:30 AM",
        description: "10:30 AM",
      },
      {
        id: "11:00 AM",
        description: "11:00 AM",
      },
      {
        id: "11:30 AM",
        description: "11:30 AM",
      },
      {
        id: "12:00 PM",
        description: "12:00 PM",
      },
      {
        id: "12:30 PM",
        description: "12:30 PM",
      },
      {
        id: "1:00 PM",
        description: "1:00 PM",
      },
      {
        id: "1:30 PM",
        description: "1:30 PM",
      },
      {
        id: "2:00 PM",
        description: "2:00 PM",
      },
      {
        id: "2:30 PM",
        description: "2:30 PM",
      },
      {
        id: "3:00 PM",
        description: "3:00 PM",
      },
      {
        id: "3:30 PM",
        description: "3:30 PM",
      },
      {
        id: "4:00 PM",
        description: "4:00 PM",
      },
      {
        id: "4:30 PM",
        description: "4:30 PM",
      },
      {
        id: "5:00 PM",
        description: "5:00 PM",
      },
      {
        id: "5:30 PM",
        description: "5:30 PM",
      },
      {
        id: "6:00 PM",
        description: "6:00 PM",
      },
      {
        id: "6:30 PM",
        description: "6:30 PM",
      },
      {
        id: "7:00 PM",
        description: "7:00 PM",
      },
      {
        id: "7:30 PM",
        description: "7:30 PM",
      },
    ];
    this.workEndHoursData = [
      {
        id: null,
        description: "select",
      },
      {
        id: "12:00 PM",
        description: "12:00 PM",
      },
      {
        id: "12:30 PM",
        description: "12:30 PM",
      },
      {
        id: "1:00 PM",
        description: "1:00 PM",
      },
      {
        id: "2:00 PM",
        description: "2:00 PM",
      },
      {
        id: "3:00 PM",
        description: "3:00 PM",
      },
      {
        id: "4:00 PM",
        description: "4:00 PM",
      },
      {
        id: "4:30 PM",
        description: "4:30 PM",
      },
      {
        id: "5:00 PM",
        description: "5:00 PM",
      },
      {
        id: "5:30 PM",
        description: "5:30 PM",
      },
      {
        id: "6:00 PM",
        description: "6:00 PM",
      },
      {
        id: "6:30 PM",
        description: "6:30 PM",
      },
      {
        id: "7:00 PM",
        description: "7:00 PM",
      },
      {
        id: "7:30 PM",
        description: "7:30 PM",
      },
      {
        id: "8:00 PM",
        description: "8:00 PM",
      },
      {
        id: "8:30 PM",
        description: "8:30 PM",
      },
      {
        id: "9:00 PM",
        description: "9:00 PM",
      },
      {
        id: "9:00 PM",
        description: "9:00 PM",
      },
      {
        id: "9:30 PM",
        description: "9:30 PM",
      },
      {
        id: "10:00 PM",
        description: "10:00 PM",
      },
      {
        id: "10:30 PM",
        description: "10:30 PM",
      },
      {
        id: "11:00 PM",
        description: "11:00 PM",
      },
      {
        id: "11:30 PM",
        description: "11:30 PM",
      },
      {
        id: "12:00 AM",
        description: "12:00 AM",
      },
    ];
    this.workTotalHoursData = [
      {
        id: null,
        description: "Select",
      },
      {
        id: "4h 00m",
        description: "4h 00m",
      },
      {
        id: "5h 00m",
        description: "5h 00m",
      },
      {
        id: "6h 00m",
        description: "6h 00m",
      },
      {
        id: "7h 00m",
        description: "7h 00m",
      },
      {
        id: "7h 30m",
        description: "7h 30m",
      },
      {
        id: "8h 00m",
        description: "8h 00m",
      },
      {
        id: "8h 30m",
        description: "8h 30m",
      },
      {
        id: "9h 00m",
        description: "9h 00m",
      },
      {
        id: "9hr 30m",
        description: "9h 30m",
      },
      {
        id: "10hr 00m",
        description: "10h 00m",
      },
    ];
    this.timeformatData = [
      {
        id: "12Hrs",
        description: "12Hrs",
      },
      {
        id: "24Hrs",
        description: "24Hrs",
      },
    ];
  }

  helpWork = false;
  helpWorkFlex = false;

  helpWorkOption(sec) {
    if (sec == "main") {
      if (this.helpWork) {
        this.helpWork = false;
      } else {
        this.helpWork = true;
      }
    }
    if (sec == "flex") {
      if (this.helpWorkFlex) {
        this.helpWorkFlex = false;
      } else {
        this.helpWorkFlex = true;
      }
    }
  }

  editChangeWorkingDays(e) {
    let compare = e.target.value + ".";
    // console.log("i am here ", e)
    this.editWorkdaysData.map((elm) => {
      if (elm.day_name === e.target.value) {
        elm.is_working = e.srcElement.checked;
        this.editWorkDayExp.map((elm) => {
          if (elm.day_name == compare) {
            if (e.srcElement.checked == true) {
              elm.is_working = !e.srcElement.checked;
            }
          }
        });
      }
    });
    // console.log(compare)
  }

  editWorkDayExpcheck(e: any) {
    let compare = e.target.value.slice(0, -1);
    console.log("checked function", e);
    this.editWorkDayExp.map((elm) => {
      if (elm.day_name === e.target.value) {
        elm.is_working = e.srcElement.checked;

        this.editWorkdaysData.map((elm) => {
          if (elm.day_name === compare) {
            if (e.srcElement.checked == true) {
              elm.is_working = !e.srcElement.checked;
            }
          }
        });
      }
    });
  }

  addWorkDayExpcheck(e: any) {
    let compare = e.target.value.slice(0, -1);
    console.log("checked function", e);
    this.editWorkDayExp.map((elm) => {
      if (elm.day_name === e.target.value) {
        elm.is_working = e.srcElement.checked;

        this.WorkdaysData.map((elm) => {
          if (elm.day_name === compare) {
            if (e.srcElement.checked == true) {
              elm.is_working = !e.srcElement.checked;
            }
          }
        });
      }
    });
  }

  editChangeWorkingExpDays(e) {
    this.editWorkdaysData.map((elm) => {
      if (elm.day_name === e.target.value) {
        elm.is_working = e.srcElement.checked;
      }
    });
  }

  saeditIsFlexibleDiv = false;
  sueditIsFlexibleDiv = false;
  moeditIsFlexibleDiv = false;
  tueditIsFlexibleDiv = false;
  weeditIsFlexibleDiv = false;
  theditIsFlexibleDiv = false;
  freditIsFlexibleDiv = false;

  editIsFlexed(e) {
    console.log("check box element", e);
    if (this.managed == false) {
      if (e.srcElement.checked === true) {
        this.editIsFlexibleDiv = true;
        this.editWorkStartHourValue = "";
        this.editWorkEndHourValue = "";
        this.saeditIsFlexibleDiv = true;
        this.sueditIsFlexibleDiv = true;
        this.moeditIsFlexibleDiv = true;
        this.tueditIsFlexibleDiv = true;
        this.weeditIsFlexibleDiv = true;
        this.theditIsFlexibleDiv = true;
        this.freditIsFlexibleDiv = true;
      } else {
        this.editIsFlexibleDiv = false;
      }
    } else {
      if (e.srcElement.checked === false) {
        this.editIsFlexibleDiv = false;
      } else {
        this.editIsFlexibleDiv = true;
      }
    }
  }

  saeditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.saeditIsFlexibleDiv = true;
    } else {
      this.saeditIsFlexibleDiv = false;
    }
  }

  sueditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.sueditIsFlexibleDiv = true;
    } else {
      this.sueditIsFlexibleDiv = false;
    }
  }

  moeditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.moeditIsFlexibleDiv = true;
    } else {
      this.moeditIsFlexibleDiv = false;
    }
  }

  tueditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.tueditIsFlexibleDiv = true;
    } else {
      this.tueditIsFlexibleDiv = false;
    }
  }

  weeditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.weeditIsFlexibleDiv = true;
    } else {
      this.weeditIsFlexibleDiv = false;
    }
  }

  theditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.theditIsFlexibleDiv = true;
    } else {
      this.theditIsFlexibleDiv = false;
    }
  }

  freditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.freditIsFlexibleDiv = true;
    } else {
      this.freditIsFlexibleDiv = false;
    }
  }

  uploadpoint(root: string) {
    switch (root) {
      case "Insurance": {
        document
          .getElementsByClassName("upInsurance")[0]
          .querySelector("button")
          .click();
        break;
      }
      case "Emirates": {
        document
          .getElementsByClassName("upEmirates")[0]
          .querySelector("button")
          .click();
        break;
      }
      case "Labour": {
        document
          .getElementsByClassName("upLabour")[0]
          .querySelector("button")
          .click();
        break;
      }
      case "Visa": {
        document
          .getElementsByClassName("upVisa")[0]
          .querySelector("button")
          .click();
        break;
      }
      case "Passport": {
        document
          .getElementsByClassName("upPassport")[0]
          .querySelector("button")
          .click();
        break;
      }
    }
  }

  uploadpointA(root: string) {
    console.log("this is the key", root);
    switch (root) {
      case "Insurance": {
        document
          .getElementsByClassName("Insurance")[0]
          .querySelector("button")
          .click();
        break;
      }
      case "Emirates ID": {
        document
          .getElementsByClassName("Emirates")[0]
          .querySelector("button")
          .click();
        break;
      }
      case "Labour ID": {
        document
          .getElementsByClassName("Labour")[0]
          .querySelector("button")
          .click();
        break;
      }
      case "Visa": {
        document
          .getElementsByClassName("Visa")[0]
          .querySelector("button")
          .click();
        break;
      }
      case "Passport": {
        document
          .getElementsByClassName("Passport")[0]
          .querySelector("button")
          .click();
        break;
      }
    }
  }

  editStartDtChange(event) {
    if (event.value !== null) {
      this.FindByOrgId(event.value);
    } else {
      this.FindByOrgId(moment().format("ll"));
    }
    console.log("triger starts from editStartDtChange");

    this.editSetProfileEffectiveDate(event.value);

    let join = new Date(this.currentEmployeeData.joined_date).getFullYear();
    if (this.currentEmployeeData.contract_enddate !== "") {
      let end = new Date(
        this.currentEmployeeData.contract_enddate
      ).getFullYear();
      this.yearNumber = end - join;
      if (this.yearNumber > 0) {
        this.editEmployeeLeaveForm.patchValue({
          editEndDate: moment(event.value)
            .add(this.yearNumber, "years")
            .format("ll"),
        });
        this.callCommonEndOpt();
      }
    }
  }

  editDetectEndDateRadioChange(event) {
    console.log(event);
    let leaveForm = this.editEmployeeLeaveForm.value;
    if (event.target.value) {
      this.yearNumber = parseInt(event.target.value);
      this.editEmployeeLeaveForm.patchValue({
        editEndDate: moment(leaveForm.editJoinedDate)
          .add(this.yearNumber, "years")
          .format("ll"),
      });
      this.callCommonEndOpt();
    }
  }

  callCommonEndOpt() {
    if (this.yearNumber === 1) {
      this.oneYear = true;
    } else if (this.yearNumber === 2) {
      this.twoYear = true;
    } else if (this.yearNumber === 4) {
      this.fourYear = true;
    } else if (this.yearNumber === 5) {
      this.fiveYear = true;
    }
  }

  editChangedEmpType(e) {
    console.log(e);
    if (e.value.description === "Permanent") {
      this.modalService.open(this.editChangeEmpTypeModel);
    }
  }

  selectedNation = "";
  editChangedNationality(e) {
    // this.spinner.show();
    let nationCode = this.countryData.find((x) => x.id == e.itemData.id);
    this.selectedNation = nationCode.name;
    this.empService.GetLastempcodeByOrgId().subscribe((code: any) => {
      if (code) {
        let newCode = nationCode.iso3 + (parseInt(code.empcode) + 1);
        this.addNewEmployeeForm.patchValue({ addempCode: newCode });
      }
    });
  }

  lastWorkForm: FormGroup;
  terminationForm() {
    this.lastWorkForm = new FormGroup({
      lastDateOfWork: new FormControl("", Validators.required),
      customDate: new FormControl(""),
      terminationType: new FormControl("", Validators.required),
      terminationReason: new FormControl("", Validators.required),
      remarks: new FormControl(""),
    });
  }

  dateOptions: string[] = ["Contract End Date", "Labour End Date", "Custom"];
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

  editchangedEmpstatus(e) {
    console.log("prathyush", e.value.id);
    if (e.value.id == "7937594f-ebd9-4394-84cc-3d88e229ab4d") {
      this.terminationForm();
      this.modalService.open(this.termiationformmodal);
    } else {
      this.adjDocUrl = "";
      this.isadjDocUp = false;
      this.istermination = false;
      this.terminationData = null;
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

  istermination = false;
  terminationData;
  onSubmit() {
    let labourExpDate = this.editEmployeeExtension.value.labourExpDate;
    let contractExpDate = this.editEmployeeExtension.value.conEnd;
    const formData = this.lastWorkForm.value;

    if (this.lastWorkForm.invalid) {
      this.toast.error("Please fill all required fields");
      return;
    }

    if (formData.lastDateOfWork === "Custom" && !formData.customDate) {
      this.toast.error("Please select a Custom Date");
      return;
    }

    let postdata = {
      term_end_by: formData.lastDateOfWork,
      term_end_date: moment(formData.customDate).format("L"),
      term_type: formData.terminationType,
      term_reason: formData.terminationReason,
      remarks: formData.remarks,
      term_doc_url: this.adjDocUrl,
    };

    if (formData.lastDateOfWork == "Custom" && formData.customDate) {
      if (formData.customDate) {
        postdata.term_end_date = moment(formData.customDate).format("L");
      } else {
        this.toast.error("Please select a Custom Date");
        return;
      }
    } else if (formData.lastDateOfWork == "Labour End Date") {
      if (moment(labourExpDate).isValid()) {
        postdata.term_end_date = moment(labourExpDate).format("L");
      } else {
        this.toast.error("Please select a valid Labour Expiry Date");
        return;
      }
    } else if (formData.lastDateOfWork == "Contract End Date") {
      if (moment(contractExpDate).isValid()) {
        postdata.term_end_date = moment(contractExpDate).format("L");
      } else {
        this.toast.error("Please select a vaild Contract Ending Date");
        return;
      }
    }

    this.terminationData = postdata;
    this.istermination = true;
    this.toast.success("Employee Terminated Details updated successfully");
    this.modalService.dismissAll();
    console.log("", postdata);
  }

  goToLink(doc_url) {
    // let doc_url = this.PaymentMethodForm.get('document').value
    console.log(doc_url, "doc!");
    if (doc_url != null && doc_url != "") {
      window.open(doc_url, "_blank");
    } else {
      this.toast.warning("Please upload a document");
    }
  }

  docDelete() {
    Swal.fire({
      title: "Are you sure you want to delete this document?",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value) {
        this.adjDocUrl = "";
        this.isadjDocUp = false;
      }
    });
  }

  closeSubmitTermination() {
    if (this.istermination == false) {
      this.editDropDownsForm.patchValue({
        editStatusDropdownValue: {
          id: "42bc21d9-60fd-47f3-b2a8-0061b9f2e15d",
          description: "In Service",
        },
      });
    }
    this.modalService.dismissAll();
  }

  detectChangeJoiningDate(event) {
    if (event.srcElement.value === "new") {
      this.oldJoinDateDiv = false;
      this.newJoinDateDiv = true;
    } else {
      this.oldJoinDateDiv = true;
      this.newJoinDateDiv = false;
    }
  }

  editSaveNewJoinDateDtChange(event) {
    this.getJDchangeData = event;
  }

  submitNewJD() {
    this.editStartDtChange(this.getJDchangeData);
    this.editEmployeeLeaveForm.patchValue({
      editJoinedDate: moment(this.getJDchangeData.value).format("ll"),
    });
    this.editChangedEmpTypeCloseDiv("saveNclose");
  }

  editChangedEmpTypeCloseDiv(type) {
    if (type === "onlyClose") {
      this.editDropDownsForm.patchValue({
        editEmpTypeDropdownValue: {
          id: this.currentEmployeeData.emp_type_id,
          description: this.currentEmpTypeName,
        },
      });
    }
    this.modalService.dismissAll();
    this.oldJoinDateDiv = true;
    this.newJoinDateDiv = false;
    this.getJDchangeData = "";
  }

  editSetProfileEffectiveDate(joiningDate) {
    let empJoiningDate = new Date(joiningDate);
    let employeeCreatedDate = new Date();
    //console.log('cond2')
    if (empJoiningDate < employeeCreatedDate) {
      //console.log('cond2-1')
      console.log("I am trigered here in 2");
      this.editEmployeeLeaveForm.patchValue({
        editProfileStartDate: moment(empJoiningDate).format("ll"),
      });
    } else {
      //console.log('cond2-2')
      console.log("I am trigered here 3");
      this.editEmployeeLeaveForm.patchValue({
        editProfileStartDate: moment(empJoiningDate).format("ll"),
      });
    }
  }

  changetab(to) {
    if (to == "basic") this.tabObj.select(0);
    if (to == "personal") this.tabObj.select(1);
    if (to == "contract") this.tabObj.select(2);
    if (to == "document") this.tabObj.select(3);
  }

  compareData;
  postbasicData;
  postExtData;

  getEditedEmployeeBasic() {
    //this.spinner.show();
    let editLeaveForm = this.editEmployeeLeaveForm.value;
    let editDropDownForm = this.editDropDownsForm.value;
    let working_days = [];

    console.log("editDropDownForm", editDropDownForm);

    this.editWorkdaysData.map((elm) => {
      if (elm.is_working === true) {
        working_days.push(elm.day_name);
      }
    });

    let work_days_exp = [];
    let saturday_exp = [];
    let sunday_exp = [];
    let monday_exp = [];
    let tuesday_exp = [];
    let wednesday_exp = [];
    let thursday_exp = [];
    let friday_exp = [];

    if (this.managed == true) {
      this.editWorkDayExp.map((elm) => {
        if (elm.is_working === true) {
          work_days_exp.push(elm.day_name);
        }
      });

      if (work_days_exp.includes("Saturday.")) {
        if (this.saeditIsFlexibleDiv) {
          saturday_exp.push("true");
          saturday_exp.push(editDropDownForm.wsasa.id);
          saturday_exp.push(editDropDownForm.websa.id);
          saturday_exp.push(editDropDownForm.misa.id);
          saturday_exp.push(editDropDownForm.btlsa.id);
          saturday_exp.push(editDropDownForm.lhtsa.id);
        } else {
          saturday_exp.push("false");
          saturday_exp.push(editDropDownForm.StartSaturday.id);
          saturday_exp.push(editDropDownForm.EndSaturday.id);
          saturday_exp.push(editDropDownForm.tosa.id);
          saturday_exp.push(editDropDownForm.btlsa.id);
          saturday_exp.push(editDropDownForm.lhtsa.id);
        }
      }
      if (work_days_exp.includes("Sunday.")) {
        if (this.sueditIsFlexibleDiv) {
          sunday_exp.push("true");
          sunday_exp.push(editDropDownForm.wsasu.id);
          sunday_exp.push(editDropDownForm.websu.id);
          sunday_exp.push(editDropDownForm.misu.id);
          sunday_exp.push(editDropDownForm.btlsu.id);
          sunday_exp.push(editDropDownForm.lhtsu.id);
        } else {
          sunday_exp.push("false");
          sunday_exp.push(editDropDownForm.StartSunday.id);
          sunday_exp.push(editDropDownForm.EndSunday.id);
          sunday_exp.push(editDropDownForm.tosu.id);
          sunday_exp.push(editDropDownForm.btlsu.id);
          sunday_exp.push(editDropDownForm.lhtsu.id);
        }
      }
      if (work_days_exp.includes("Monday.")) {
        if (this.moeditIsFlexibleDiv) {
          monday_exp.push("true");
          monday_exp.push(editDropDownForm.wsamo.id);
          monday_exp.push(editDropDownForm.webmo.id);
          monday_exp.push(editDropDownForm.mimo.id);
          monday_exp.push(editDropDownForm.btlmo.id);
          monday_exp.push(editDropDownForm.lhtmo.id);
        } else {
          monday_exp.push("false");
          monday_exp.push(editDropDownForm.StartMonday.id);
          monday_exp.push(editDropDownForm.EndMonday.id);
          monday_exp.push(editDropDownForm.tomo.id);
          monday_exp.push(editDropDownForm.btlmo.id);
          monday_exp.push(editDropDownForm.lhtmo.id);
        }
      }
      if (work_days_exp.includes("Tuesday.")) {
        if (this.tueditIsFlexibleDiv) {
          tuesday_exp.push("true");
          tuesday_exp.push(editDropDownForm.wsatu.id);
          tuesday_exp.push(editDropDownForm.webtu.id);
          tuesday_exp.push(editDropDownForm.mitu.id);
          tuesday_exp.push(editDropDownForm.btltu.id);
          tuesday_exp.push(editDropDownForm.lhttu.id);
        } else {
          tuesday_exp.push("false");
          tuesday_exp.push(editDropDownForm.StartTuesday.id);
          tuesday_exp.push(editDropDownForm.EndTuesday.id);
          tuesday_exp.push(editDropDownForm.totu.id);
          tuesday_exp.push(editDropDownForm.btltu.id);
          tuesday_exp.push(editDropDownForm.lhttu.id);
        }
      }
      if (work_days_exp.includes("Wednesday.")) {
        if (this.weeditIsFlexibleDiv) {
          wednesday_exp.push("true");
          wednesday_exp.push(editDropDownForm.wsawe.id);
          wednesday_exp.push(editDropDownForm.webwe.id);
          wednesday_exp.push(editDropDownForm.miwe.id);
          wednesday_exp.push(editDropDownForm.btlwe.id);
          wednesday_exp.push(editDropDownForm.lhtwe.id);
        } else {
          wednesday_exp.push("false");
          wednesday_exp.push(editDropDownForm.StartWednesday.id);
          wednesday_exp.push(editDropDownForm.EndWednesday.id);
          wednesday_exp.push(editDropDownForm.towe.id);
          wednesday_exp.push(editDropDownForm.btlwe.id);
          wednesday_exp.push(editDropDownForm.lhtwe.id);
        }
      }
      if (work_days_exp.includes("Thursday.")) {
        if (this.theditIsFlexibleDiv) {
          thursday_exp.push("true");
          thursday_exp.push(editDropDownForm.wsath.id);
          thursday_exp.push(editDropDownForm.webth.id);
          thursday_exp.push(editDropDownForm.misth.id);
          thursday_exp.push(editDropDownForm.btlth.id);
          thursday_exp.push(editDropDownForm.lhtth.id);
        } else {
          thursday_exp.push("false");
          thursday_exp.push(editDropDownForm.StartThursday.id);
          thursday_exp.push(editDropDownForm.EndThursday.id);
          thursday_exp.push(editDropDownForm.toth.id);
          thursday_exp.push(editDropDownForm.btlth.id);
          thursday_exp.push(editDropDownForm.lhtth.id);
        }
      }
      if (work_days_exp.includes("Friday.")) {
        if (this.freditIsFlexibleDiv) {
          friday_exp.push("true");
          friday_exp.push(editDropDownForm.wsafr.id);
          friday_exp.push(editDropDownForm.webfr.id);
          friday_exp.push(editDropDownForm.mifr.id);
          friday_exp.push(editDropDownForm.btlfr.id);
          friday_exp.push(editDropDownForm.lhtfr.id);
        } else {
          friday_exp.push("false");
          friday_exp.push(editDropDownForm.StartFriday.id);
          friday_exp.push(editDropDownForm.EndFriday.id);
          friday_exp.push(editDropDownForm.tofr.id);
          friday_exp.push(editDropDownForm.btlfr.id);
          friday_exp.push(editDropDownForm.lhtfr.id);
        }
      }
    }

    editLeaveForm.overtimeHour.id + ":" + editLeaveForm.overtimeMinute.id;

    let postData = {
      alias: this.editEmployeeForm.get("nationality").value,
      emp_code: this.editEmployeeForm.get("empCode").value,
      id: sessionStorage.getItem("emp_id"), //localStorage.getItem("emp_id"),
      full_name: this.editEmployeeForm
        .get("eFirstName")
        .value.concat(" ", this.editEmployeeForm.get("eLastName").value),
      first_name: this.editEmployeeForm.get("eFirstName").value,
      last_name: this.editEmployeeForm.get("eLastName").value,
      workemail: this.editEmployeeForm.get("eWorkEmail").value,

      gender: this.gender,
      joined_date: moment(
        this.editEmployeeLeaveForm.get("editJoinedDate").value
      ).format("L"),
      phone: this.phoneNumberValue,
      phone_iso_name: this.phoneNumberCode,
      emp_status_id: editDropDownForm.editStatusDropdownValue.id,
      emp_type_id: editDropDownForm.editEmpTypeDropdownValue.id,
      role_id: editDropDownForm.editRoleDropdownValue.id,
      org_id: localStorage.getItem("org_id"),
      is_admin: false,
      is_superadmin: false,
      leave_profile_setup_id: editLeaveForm.editleaveProfileDropdownValue.id,
      profile_effective_from_date:
        editLeaveForm.editProfileStartDate != ""
          ? moment(editLeaveForm.editProfileStartDate).format("L")
          : "",
      team_id: editDropDownForm.editTeamDropdownValue.id,

      open_balance_days: this.editopeningBalanceDiv
        ? editLeaveForm.editopenBalance === "" ||
          editLeaveForm.editopenBalance === null
          ? 0
          : editLeaveForm.editopenBalance
        : 0,
      leave_taken: this.editleaveTakenDiv
        ? editLeaveForm.editleaveTaken === "" ||
          editLeaveForm.editleaveTaken === null
          ? 0
          : editLeaveForm.editleaveTaken
        : 0,
      leave_taken_sick: this.editleaveTakenDiv
        ? editLeaveForm.editleaveTakenSick === "" ||
          editLeaveForm.editleaveTakenSick === null
          ? 0
          : editLeaveForm.editleaveTakenSick
        : 0,

      work_location: editDropDownForm.editworkLocDropdownValue
        ? editDropDownForm.editworkLocDropdownValue.id
        : null,
      time_zone: editDropDownForm.editTimeZoneDropdownValue.id,
      time_format: editDropDownForm.editTimeFormatDropdownValue.id,

      workday_settings: editDropDownForm.workSettings,
      work_profile_effective_day: moment(
        editDropDownForm.wrkProfileEffectiveDay
      ).format("L"),
      working_days: working_days.toString(),

      //working_hours: editDropDownForm.editTotalHoursDropdownValue.id,
      work_start_time:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editStartTimeDropdownValue.id
          : null,
      work_end_time:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editEndTimeDropdownValue.id
          : null,
      checkin_tolarence:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editCheckinTolerance.id
          : null, //min_hrs: ,
      break_time:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editBreakTimeLimit.id
          : null,
      less_hour_tolerance: editDropDownForm.editLessHourTolerance.id
        ? editDropDownForm.editLessHourTolerance.id
        : null,

      is_flexible: this.editIsFlexibleDiv,

      checkin_after:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editCheckInAfter.id
          : null,
      checkout_before:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editCheckOutBefore.id
          : null,
      min_hrs_flx:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editTotalHoursDropdownValue.id
          : null,
      break_time_flx:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editBreakTimeLimitFlex.id
          : null,

      is_custom_work: this.managed,
      work_days_exp: work_days_exp.toString(),
      saturday_exp: saturday_exp.toString(),
      sunday_exp: sunday_exp.toString(),
      monday_exp: monday_exp.toString(),
      tuesday_exp: tuesday_exp.toString(),
      wednesday_exp: wednesday_exp.toString(),
      thursday_exp: thursday_exp.toString(),
      friday_exp: friday_exp.toString(),

      contract_enddate:
        editLeaveForm.editEndDate !== ""
          ? moment(editLeaveForm.editEndDate).format("L")
          : "",
      is_new_profile:
        this.currentEmployeeData.leave_profile_setup_id ===
        editLeaveForm.editleaveProfileDropdownValue.id
          ? false
          : this.isNewProfile,
      is_change_profile:
        this.currentEmployeeData.leave_profile_setup_id ===
        editLeaveForm.editleaveProfileDropdownValue.id
          ? false
          : this.isChangeProfile,

      is_weekday_overtime_enabled: editLeaveForm.isWeekDayOvertime
        ? true
        : false,
      is_holiday_overtime_enabled: editLeaveForm.is_holiday_overtime_enabled
        ? true
        : false,
      minimum_overtime:
        editLeaveForm.overtimeMinute.id != null
          ? editLeaveForm.overtimeHour.id +
            ":" +
            editLeaveForm.overtimeMinute.id
          : null,
    };
    this.postbasicData = {};
    this.postbasicData = postData;
    console.log("postbasicData prathyush", this.postbasicData);
  }

  getEditEmployeeExtsion() {
    let pturl: string;
    let empextfromdt = this.editEmployeeExtension.value;
    if (sessionStorage.getItem("photo_url")) {
      pturl = sessionStorage.getItem("photo_url").toString();
    } else {
      pturl = "";
    }
    let postdata = {
      emp_id: sessionStorage.getItem("emp_id"), //localStorage.getItem("emp_id"),
      //personal details
      dob:
        empextfromdt.dateofbirth === "" || empextfromdt.dateofbirth === null
          ? null
          : moment(empextfromdt.dateofbirth).format("L"),
      marital_status:
        empextfromdt.maritalStatus === "" || empextfromdt.maritalStatus === null
          ? ""
          : empextfromdt.maritalStatus,
      nationality:
        empextfromdt.nationality === "" || empextfromdt.nationality === null
          ? ""
          : empextfromdt.nationality.toString(),
      phone_no:
        empextfromdt.phoneNo === "" || empextfromdt.phoneNo === null
          ? ""
          : empextfromdt.phoneNo.internationalNumber,
      pesonal_email:
        empextfromdt.personalEmail === "" || empextfromdt.personalEmail === null
          ? ""
          : empextfromdt.personalEmail,
      //emergency contact details
      gardian_contact:
        empextfromdt.gardianContact === "" ||
        empextfromdt.gardianContact === null
          ? ""
          : empextfromdt.gardianContact,
      emergency_contact:
        empextfromdt.emergencyContact === "" ||
        empextfromdt.emergencyContact === null
          ? ""
          : empextfromdt.emergencyContact.internationalNumber,
      gardian_relation:
        empextfromdt.gardianRelation === "" ||
        empextfromdt.gardianRelation === null
          ? ""
          : empextfromdt.gardianRelation,
      //photo_details
      photo_url: pturl,
      //passprtdetails
      full_name_pst:
        empextfromdt.fullNamePst === "" || empextfromdt.fullNamePst === null
          ? ""
          : empextfromdt.fullNamePst,
      passport_num:
        empextfromdt.passNumber === "" || empextfromdt.passNumber === null
          ? ""
          : empextfromdt.passNumber,
      pass_issue_contry: empextfromdt.passIssueContry,
      pass_issue_date:
        empextfromdt.passIssueDate === "" || empextfromdt.passIssueDate === null
          ? null
          : moment(empextfromdt.passIssueDate).format("L"),
      pass_exp_date:
        empextfromdt.passExpDate === "" || empextfromdt.passExpDate === null
          ? null
          : moment(empextfromdt.passExpDate).format("L"),
      //addressdetails
      adr_1:
        empextfromdt.adr1 === "" || empextfromdt.adr1 === null
          ? ""
          : empextfromdt.adr1,
      adr_2:
        empextfromdt.adr2 === "" || empextfromdt.adr2 === null
          ? ""
          : empextfromdt.adr2,
      adr_city:
        empextfromdt.adrCity === "" || empextfromdt.adrCity === null
          ? ""
          : empextfromdt.adrCity,
      adr_country: empextfromdt.adrCountry,
      adr_postal_code:
        empextfromdt.adrPostalCode === "" || empextfromdt.adrPostalCode === null
          ? ""
          : empextfromdt.adrPostalCode,
      //want some chnge here
      is_con_same: this.consame,
      contact_adr_1:
        empextfromdt.conAdr1 === "" || empextfromdt.conAdr1 === null
          ? ""
          : empextfromdt.conAdr1,
      contact_adr_2:
        empextfromdt.conAdr2 === "" || empextfromdt.conAdr2 === null
          ? ""
          : empextfromdt.conAdr2,
      contact_city:
        empextfromdt.conCity === "" || empextfromdt.conCity === null
          ? ""
          : empextfromdt.conCity,
      contact_country: empextfromdt.conCountry,
      contact_postal_code:
        empextfromdt.conPostalCode === "" || empextfromdt.conPostalCode === null
          ? ""
          : empextfromdt.conPostalCode,
      //contractdetails
      con_start:
        empextfromdt.conStart === "" || empextfromdt.conStart === null
          ? null
          : moment(empextfromdt.conStart).format("L"),
      con_end:
        empextfromdt.conEnd === "" || empextfromdt.conEnd === null
          ? null
          : moment(empextfromdt.conEnd).format("L"),
      labour_id:
        empextfromdt.labourId === "" || empextfromdt.labourId === null
          ? ""
          : empextfromdt.labourId,
      labour_exp_date:
        empextfromdt.labourExpDate === "" || empextfromdt.labourExpDate === null
          ? null
          : moment(empextfromdt.labourExpDate).format("L"),
      //visadetails
      visa_id:
        empextfromdt.visaId === "" || empextfromdt.visaId === null
          ? ""
          : empextfromdt.visaId,
      visa_type:
        empextfromdt.visaType === "" || empextfromdt.visaType === null
          ? ""
          : empextfromdt.visaType,
      visa_exp_date:
        empextfromdt.visaExpDate === "" || empextfromdt.visaExpDate === null
          ? null
          : moment(empextfromdt.visaExpDate).format("L"),
      emirates_id:
        empextfromdt.emiratesId === "" || empextfromdt.emiratesId === null
          ? ""
          : empextfromdt.emiratesId,
      emirates_id_exp_date:
        empextfromdt.emiratesIdExpDate === "" ||
        empextfromdt.emiratesIdExpDate === null
          ? null
          : moment(empextfromdt.emiratesIdExpDate).format("L"),
      //insurancedetails
      ins_provider:
        empextfromdt.insProvider === "" || empextfromdt.insProvider === null
          ? ""
          : empextfromdt.insProvider,
      ins_policy:
        empextfromdt.insPloicy === "" || empextfromdt.insPloicy === null
          ? ""
          : empextfromdt.insPloicy,
      ins_exp:
        empextfromdt.insExp === "" || empextfromdt.insExp === null
          ? null
          : moment(empextfromdt.insExp).format("L"),
      //bankdetails
      bank_name:
        empextfromdt.bankName === "" || empextfromdt.bankName === null
          ? ""
          : empextfromdt.bankName,
      bank_branch:
        empextfromdt.bankBranch === "" || empextfromdt.bankBranch === null
          ? ""
          : empextfromdt.bankBranch,
      bank_account_num:
        empextfromdt.accNumber === "" || empextfromdt.accNumber === null
          ? ""
          : empextfromdt.accNumber,
      bank_Iban:
        empextfromdt.iban === "" || empextfromdt.iban === null
          ? ""
          : empextfromdt.iban,
      bank_swift:
        empextfromdt.swiftCode === "" || empextfromdt.swiftCode === null
          ? ""
          : empextfromdt.swiftCode,
      //salarydetails
      salary_effective_date:
        empextfromdt.salEffDate === "" || empextfromdt.salEffDate === null
          ? null
          : moment(empextfromdt.salEffDate).format("L"),
      basic_salary: isNaN(empextfromdt.basicPay) ? 0 : empextfromdt.basicPay,
      travel_allow: isNaN(empextfromdt.travelAllow)
        ? 0
        : empextfromdt.travelAllow,
      accommod_allow: isNaN(empextfromdt.accoAllow)
        ? 0
        : empextfromdt.accoAllow,
      a_one_name: this.extraAllowance[0] ? empextfromdt.aOneName : "",
      a_one: this.extraAllowance[0] ? empextfromdt.aOne : 0,
      a_two_name: this.extraAllowance[1] ? empextfromdt.aTwoName : "",
      a_two: this.extraAllowance[1] ? empextfromdt.aTwo : 0,
      a_three_name: this.extraAllowance[2] ? empextfromdt.aThreeName : "",
      a_three: this.extraAllowance[2] ? empextfromdt.aThree : 0,
      tax_deduc: isNaN(empextfromdt.taxDed) ? 0 : empextfromdt.taxDed,
      insurance_deduc: isNaN(empextfromdt.insDed) ? 0 : empextfromdt.insDed,
      d_one_name: this.extraDeduction[0] ? empextfromdt.dOneName : "",
      d_one: this.extraDeduction[0] ? empextfromdt.dOne : 0,
      d_two_name: this.extraDeduction[1] ? empextfromdt.dTwoName : "",
      d_two: this.extraDeduction[1] ? empextfromdt.dTwo : 0,
      d_three_name: this.extraDeduction[2] ? empextfromdt.dThreeName : "",
      d_three: this.extraDeduction[2] ? empextfromdt.dThree : 0,
      gross_pay: this.grosspay,
      net_deduc: this.netdeduct,
      net_pay: this.netpay,
      //generaldetails
      is_deleted: false,
      gender: this.gender,
      created_date: moment().format("L"),
      modified_date: moment().format("L"),
      //notused
      status: null,
      emp_code: null,
      other_allow: null,
      other_deduc: null,
      home_no: null,
    };
    this.postExtData = postdata;
  }

  comparechanges(from) {
    //to sotre the changes!
    let changesection = [];

    //retriving the Form Input values
    let editLeaveForm = this.editEmployeeLeaveForm.value;
    let editDropDownForm = this.editDropDownsForm.value;

    console.log("Edit Leave form",editLeaveForm);
    console.log("editDropDownForm",editDropDownForm);


    //getiing the inputed workdays in the given format
    let working_days = [];

    this.editWorkdaysData.map((elm) => {
      if (elm.is_working === true) {
        working_days.push(elm.day_name);
      }
    });

    let work_days_exp = [];
    let saturday_exp = [];
    let sunday_exp = [];
    let monday_exp = [];
    let tuesday_exp = [];
    let wednesday_exp = [];
    let thursday_exp = [];
    let friday_exp = [];

    if (this.managed == true) {
      this.editWorkDayExp.map((elm) => {
        if (elm.is_working === true) {
          work_days_exp.push(elm.day_name);
        }
      });

      if (work_days_exp.includes("Saturday.")) {
        if (this.saeditIsFlexibleDiv) {
          saturday_exp.push("true");
          saturday_exp.push(editDropDownForm.wsasa.id);
          saturday_exp.push(editDropDownForm.websa.id);
          saturday_exp.push(editDropDownForm.misa.id);
          saturday_exp.push(editDropDownForm.btlsa.id);
          console.log("checkobj", editDropDownForm.wsasa.id);
        } else {
          saturday_exp.push("false");
          saturday_exp.push(editDropDownForm.StartSaturday.id);
          saturday_exp.push(editDropDownForm.EndSaturday.id);
          saturday_exp.push(editDropDownForm.tosa.id);
          saturday_exp.push(editDropDownForm.btlsa.id);
        }
      }
      if (work_days_exp.includes("Sunday.")) {
        if (this.sueditIsFlexibleDiv) {
          sunday_exp.push("true");
          sunday_exp.push(editDropDownForm.wsasu.id);
          sunday_exp.push(editDropDownForm.websu.id);
          sunday_exp.push(editDropDownForm.misu.id);
          sunday_exp.push(editDropDownForm.btlsu.id);
        } else {
          sunday_exp.push("false");
          sunday_exp.push(editDropDownForm.StartSunday.id);
          sunday_exp.push(editDropDownForm.EndSunday.id);
          sunday_exp.push(editDropDownForm.tosu.id);
          sunday_exp.push(editDropDownForm.btlsu.id);
        }
      }
      if (work_days_exp.includes("Monday.")) {
        if (this.moeditIsFlexibleDiv) {
          monday_exp.push("true");
          monday_exp.push(editDropDownForm.wsamo.id);
          monday_exp.push(editDropDownForm.webmo.id);
          monday_exp.push(editDropDownForm.mimo.id);
          monday_exp.push(editDropDownForm.btlmo.id);
        } else {
          monday_exp.push("false");
          monday_exp.push(editDropDownForm.StartMonday.id);
          monday_exp.push(editDropDownForm.EndMonday.id);
          monday_exp.push(editDropDownForm.tomo.id);
          monday_exp.push(editDropDownForm.btlmo.id);
        }
      }
      if (work_days_exp.includes("Tuesday.")) {
        if (this.tueditIsFlexibleDiv) {
          tuesday_exp.push("true");
          tuesday_exp.push(editDropDownForm.wsatu.id);
          tuesday_exp.push(editDropDownForm.webtu.id);
          tuesday_exp.push(editDropDownForm.mitu.id);
          tuesday_exp.push(editDropDownForm.btltu.id);
        } else {
          tuesday_exp.push("false");
          tuesday_exp.push(editDropDownForm.StartTuesday.id);
          tuesday_exp.push(editDropDownForm.EndTuesday.id);
          tuesday_exp.push(editDropDownForm.totu.id);
          tuesday_exp.push(editDropDownForm.btltu.id);
        }
      }
      if (work_days_exp.includes("Wednesday.")) {
        if (this.weeditIsFlexibleDiv) {
          wednesday_exp.push("true");
          wednesday_exp.push(editDropDownForm.wsawe.id);
          wednesday_exp.push(editDropDownForm.webwe.id);
          wednesday_exp.push(editDropDownForm.miwe.id);
          wednesday_exp.push(editDropDownForm.btlwe.id);
        } else {
          wednesday_exp.push("false");
          wednesday_exp.push(editDropDownForm.StartWednesday.id);
          wednesday_exp.push(editDropDownForm.EndWednesday.id);
          wednesday_exp.push(editDropDownForm.towe.id);
          wednesday_exp.push(editDropDownForm.btlwe.id);
        }
      }
      if (work_days_exp.includes("Thursday.")) {
        if (this.theditIsFlexibleDiv) {
          thursday_exp.push("true");
          thursday_exp.push(editDropDownForm.wsath.id);
          thursday_exp.push(editDropDownForm.webth.id);
          thursday_exp.push(editDropDownForm.misth.id);
          thursday_exp.push(editDropDownForm.btlth.id);
        } else {
          thursday_exp.push("false");
          thursday_exp.push(editDropDownForm.StartThursday.id);
          thursday_exp.push(editDropDownForm.EndThursday.id);
          thursday_exp.push(editDropDownForm.toth.id);
          thursday_exp.push(editDropDownForm.btlth.id);
        }
      }
      if (work_days_exp.includes("Friday.")) {
        if (this.freditIsFlexibleDiv) {
          friday_exp.push("true");
          friday_exp.push(editDropDownForm.wsafr.id);
          friday_exp.push(editDropDownForm.webfr.id);
          friday_exp.push(editDropDownForm.mifr.id);
          friday_exp.push(editDropDownForm.btlfr.id);
        } else {
          friday_exp.push("false");
          friday_exp.push(editDropDownForm.StartFriday.id);
          friday_exp.push(editDropDownForm.EndFriday.id);
          friday_exp.push(editDropDownForm.tofr.id);
          friday_exp.push(editDropDownForm.btlfr.id);
        }
      }
    }

    if (!this.fromsavedraft) {
      //want to add the codes for comparing the function from the all team members team
      //to match the currentEmployeeData.
    }

    if (this.istermination == true) {
      changesection.push({
        section: "General Details",
        field: "Termination Details",
        oldvalue: "Last Date By",
        newvalue: this.terminationData.term_end_by,
      });
      changesection.push({
        section: "General Details",
        field: "Termination Details",
        oldvalue: "Last Date",
        newvalue: this.terminationData.term_end_date,
      });
      changesection.push({
        section: "General Details",
        field: "Termination Details",
        oldvalue: "Type",
        newvalue: this.terminationData.term_type,
      });
      changesection.push({
        section: "General Details",
        field: "Termination Details",
        oldvalue: "Reason",
        newvalue: this.terminationData.term_reason,
      });
      changesection.push({
        section: "General Details",
        field: "Termination Details",
        oldvalue: "Remarks",
        newvalue: this.terminationData.remarks,
      });
    }

    //general details
    if (
      this.currentEmployeeData.first_name !=
      this.editEmployeeForm.get("eFirstName").value
    ) {
      changesection.push({
        section: "General Details",
        field: "First Name",
        oldvalue: this.currentEmployeeData.first_name,
        newvalue: this.editEmployeeForm.get("eFirstName").value,
      });
    }
    if (
      this.currentEmployeeData.last_name !=
      this.editEmployeeForm.get("eLastName").value
    ) {
      changesection.push({
        section: "General Details",
        field: "Last Name",
        oldvalue: this.currentEmployeeData.last_name,
        newvalue: this.editEmployeeForm.get("eLastName").value,
      });
    }

    //not needed
    // if (this.currentEmployeeData.workemail != this.editEmployeeForm.get("eWorkEmail").value) {
    //   changesection.push({ 'section': 'General Details', 'field': 'Work Email', 'oldvalue': this.currentEmployeeData.workemail, 'newvalue': this.editEmployeeForm.get("eWorkEmail").value })
    // }

    if (this.dbEmpExtData.gender) {
      if (this.gender != this.dbEmpExtData.gender) {
        changesection.push({
          section: "General Details",
          field: "Gender",
          oldvalue: this.dbEmpExtData.gender,
          newvalue: this.gender,
        });
      }
    }

    if (
      moment(this.editEmployeeLeaveForm.get("editJoinedDate").value).format(
        "L"
      ) != moment(this.currentEmployeeData.joined_date).format("L")
    ) {
      changesection.push({
        section: "General Details",
        field: "Joined Date",
        oldvalue: moment(this.currentEmployeeData.joined_date).format("L"),
        newvalue: moment(
          this.editEmployeeLeaveForm.get("editJoinedDate").value
        ).format("L"),
      });
    }

    //Administrator Details
    if (this.currentEmployeeData.emp_type_id) {
      if (
        this.currentEmployeeData.emp_type_id !=
        editDropDownForm.editEmpTypeDropdownValue.id
      ) {
        let curempidvalue = this.employeeTypeData.find(
          (x) => x.id == this.currentEmployeeData.emp_type_id
        );
        changesection.push({
          section: "Administrator Details",
          field: "Employee Type",
          oldvalue: curempidvalue.description,
          newvalue: editDropDownForm.editEmpTypeDropdownValue.description,
        });
      }
    }

    if (this.currentEmployeeData.role_id) {
      if (
        this.currentEmployeeData.role_id !=
        editDropDownForm.editRoleDropdownValue.id
      ) {
        let curempvalue = this.employeeRoleData.find(
          (x) => x.id == this.currentEmployeeData.role_id
        );
        changesection.push({
          section: "Administrator Details",
          field: "Employee Role",
          oldvalue: curempvalue.description,
          newvalue: editDropDownForm.editRoleDropdownValue.description,
        });
      }
    }

    //noted------
    // if (this.fromsavedraft) {
    //   if (moment(this.currentEmployeeData.emp_contract_end_date).format("L") != moment(editLeaveForm.editEndDate).format("L")) {
    //     changesection.push({ 'section': 'Administrator Details', 'field': 'Contract End Date', 'oldvalue': moment(this.currentEmployeeData.emp_contract_end_date).format("L"), 'newvalue': moment(editLeaveForm.editEndDate).format("L") })
    //   }
    // }
    // else{
    //   if(moment(this.currentEmployeeData.contract_enddate).format("L") != moment(editLeaveForm.editEndDate).format("L"))
    //   {
    //     changesection.push({'section':'Administrator Details', 'field':'Contract End Date', 'oldvalue' : moment(this.currentEmployeeData.contract_enddate).format("L"),'newvalue' : moment(editLeaveForm.editEndDate).format("L") })
    //   }
    // }

    //Geo Details
    if (
      this.currentEmployeeData.work_location !=
      editDropDownForm.workLocDropdownValue
    ) {
      changesection.push({
        section: "Geo Details",
        field: "Work Location",
        oldvalue: this.currentEmployeeData.work_location,
        newvalue: editDropDownForm.editworkLocDropdownValue,
      });
    }

    if (
      this.currentEmployeeData.time_zone !=
      editDropDownForm.editTimeZoneDropdownValue.id
    ) {
      changesection.push({
        section: "Geo Details",
        field: "Time Zone",
        oldvalue: this.currentEmployeeData.time_zone,
        newvalue: editDropDownForm.editTimeZoneDropdownValue.id,
      });
    }

    if (
      this.currentEmployeeData.time_format !=
      editDropDownForm.editTimeFormatDropdownValue.id
    ) {
      changesection.push({
        section: "Geo Details",
        field: "Time Format",
        oldvalue: this.currentEmployeeData.time_format,
        newvalue: editDropDownForm.editTimeFormatDropdownValue.id,
      });
    }

    //Working Days
    if (
      this.currentEmployeeData.work_profile_effective_day &&
      editDropDownForm.wrkProfileEffectiveDay &&
      !moment(this.currentEmployeeData.work_profile_effective_day).isSame(
        moment(editDropDownForm.wrkProfileEffectiveDay),
        "day"
      )
    ) {
      changesection.push({
        section: "Working Days",
        field: "Work Profile Effective Date",
        oldvalue: moment(
          this.currentEmployeeData.work_profile_effective_day
        ).format("L"),
        newvalue: moment(editDropDownForm.wrkProfileEffectiveDay).format("L"),
      });
    }

    //for working days
    if (this.currentEmployeeData.working_days != working_days.toString()) {
      changesection.push({
        section: "Work Days",
        field: "Work Days",
        oldvalue: this.currentEmployeeData.working_days,
        newvalue: working_days.toString(),
      });
    }

    //for changes in the work timings!
    if (this.currentEmployeeData.is_flexible != this.editIsFlexibleDiv) {
      if (this.editIsFlexibleDiv) {
        changesection.push({
          section: "Working Days",
          field: "Flexible Working Days",
          oldvalue: "Flexible",
          newvalue: "Not Flexible",
        });
      } else {
        changesection.push({
          section: "Working Days",
          field: "Flexible Working Days",
          oldvalue: "Not Flexible",
          newvalue: "Flexible",
        });
      }
    } else {
      if (this.currentEmployeeData.is_flexible != true) {
        if (
          this.currentEmployeeData.work_start_time !=
          editDropDownForm.editStartTimeDropdownValue.id
        )
          changesection.push({
            section: "Working Days",
            field: "Work starts",
            oldvalue: this.currentEmployeeData.work_start_time,
            newvalue: editDropDownForm.editStartTimeDropdownValue.id,
          });
        if (
          this.currentEmployeeData.work_end_time !=
          editDropDownForm.editEndTimeDropdownValue.id
        )
          changesection.push({
            section: "Working Days",
            field: "Work ends",
            oldvalue: this.currentEmployeeData.work_end_time,
            newvalue: editDropDownForm.editEndTimeDropdownValue.id,
          });
        if (
          this.currentEmployeeData.checkin_tolarence !=
          editDropDownForm.editCheckinTolerance.id
        )
          changesection.push({
            section: "Working Days",
            field: "CheckIn Tolerance",
            oldvalue: this.currentEmployeeData.checkin_tolarence,
            newvalue: editDropDownForm.editCheckinTolerance.id,
          });
        if (
          this.currentEmployeeData.break_time !=
          editDropDownForm.editBreakTimeLimit.id
        )
          changesection.push({
            section: "Working Days",
            field: "Break Time Limit",
            oldvalue: this.currentEmployeeData.break_time,
            newvalue: editDropDownForm.editBreakTimeLimit.id,
          });
      } else {
        if (
          this.currentEmployeeData.checkin_after !=
          editDropDownForm.editCheckInAfter.id
        )
          changesection.push({
            section: "Working Days",
            field: "CheckIn After",
            oldvalue: this.currentEmployeeData.checkin_after,
            newvalue: editDropDownForm.editCheckInAfter.id,
          });
        if (
          this.currentEmployeeData.checkout_before !=
          editDropDownForm.editCheckOutBefore.id
        )
          changesection.push({
            section: "Working Days",
            field: "CheckOut Before",
            oldvalue: this.currentEmployeeData.checkout_before,
            newvalue: editDropDownForm.editCheckOutBefore.id,
          });
        if (
          this.currentEmployeeData.min_hrs_flx !=
          editDropDownForm.editTotalHoursDropdownValue.id
        )
          changesection.push({
            section: "Working Days",
            field: "Minimum work hours",
            oldvalue: this.currentEmployeeData.min_hrs_flx,
            newvalue: editDropDownForm.editTotalHoursDropdownValue.id,
          });
        if (
          this.currentEmployeeData.break_time_flx !=
          editDropDownForm.editTotalHoursDropdownValue.id
        )
          changesection.push({
            section: "Working Days",
            field: "Break Time Limit",
            oldvalue: this.currentEmployeeData.break_time_flx,
            newvalue: editDropDownForm.editTotalHoursDropdownValue.id,
          });
      }
    }

    //for Custom working days
    if (this.currentEmployeeData.work_days_exp != work_days_exp.toString()) {
      changesection.push({
        section: "Custom Work Days",
        field: "Work Days",
        oldvalue: this.currentEmployeeData.work_days_exp,
        newvalue: work_days_exp.toString(),
      });
    }

    //for custom working days
    //if(this.currentEmployeeData)
    //check if there is any changes in the working days and the custom work days

    //if(this.currentEmployeeData.working_days != )

    //email Reports

    //Leave Details

    if (
      this.currentEmployeeData.leave_profile_setup_id !=
      editLeaveForm.editleaveProfileDropdownValue.id
    ) {
      let curempidvalue = this.leaveProfileType.find(
        (x) => x.id == this.currentEmployeeData.leave_profile_setup_id
      );
      changesection.push({
        section: "Leave Details",
        field: "Leave Overtime Gratuity Profile",
        oldvalue: curempidvalue.description,
        newvalue: editLeaveForm.editleaveProfileDropdownValue.description,
      });
    }

    // if (moment(this.currentEmployeeData.profile_effective_from_date).format("L") != moment(editLeaveForm.editProfileStartDate).format("L")) {
    //   changesection.push({ 'section': 'Leave Details', 'field': 'Profile Effective Date', 'oldvalue': moment(this.currentEmployeeData.profile_effective_from_date).format("L"), 'newvalue': moment(editLeaveForm.editProfileStartDate).format("L") })
    // }

    // if (this.currentEmployeeData.open_balance_days != editLeaveForm.editopenBalance) {
    //   changesection.push({ 'section': 'Leave Details', 'field': 'Open Balance', 'oldvalue': this.currentEmployeeData.open_balance_days, 'newvalue': editLeaveForm.editopenBalance })
    // }

    //overtime options
    //Overtime Options|
    if (
      this.currentEmployeeData.is_weekday_overtime_enabled != null ||
      editLeaveForm.isWeekDayOvertime != null
    ) {
      if (
        this.currentEmployeeData.is_weekday_overtime_enabled !=
        editLeaveForm.isWeekDayOvertime
      ) {
        changesection.push({
          section: "Overtime Option",
          field: "Workday Overtime",
          oldvalue: this.currentEmployeeData.is_weekday_overtime_enabled
            ? "enabled"
            : "disabled",
          newvalue: editLeaveForm.isWeekDayOvertime ? "enabled" : "disabled",
        });
      }
    }

    if (
      this.currentEmployeeData.is_holiday_overtime_enabled != null ||
      editLeaveForm.isHoliDayOvertime != null
    ) {
      if (
        this.currentEmployeeData.is_holiday_overtime_enabled !=
        editLeaveForm.isHoliDayOvertime
      ) {
        changesection.push({
          section: "Overtime Option",
          field: "Holiday Ovetime",
          oldvalue: this.currentEmployeeData.is_holiday_overtime_enabled
            ? "enabled"
            : "disabled",
          newvalue: editLeaveForm.isHoliDayOvertime ? "enabled" : "disabled",
        });
      }
    }

    let testmiover =
      editLeaveForm.overtimeMinute.id != null
        ? editLeaveForm.overtimeHour.id + ":" + editLeaveForm.overtimeMinute.id
        : null;
    if (
      this.currentEmployeeData.minimum_overtime != null ||
      testmiover != null
    ) {
      if (this.currentEmployeeData.minimum_overtime != testmiover) {
        changesection.push({
          section: "Overtime Option",
          field: "Minimum Overtime Hours",
          oldvalue: this.currentEmployeeData.minimum_overtime,
          newvalue: testmiover,
        });
      }
    }
    //TestOpenBalance
    console.log(
      typeof this.currentEmployeeData.open_balance_days,
      typeof editLeaveForm.editopenBalance,
      "T*"
    );
    if (
      this.currentEmployeeData.open_balance_days &&
      editLeaveForm.editopenBalance
    ) {
      if (
        (this.currentEmployeeData.open_balance_days || "").trim() !=
        editLeaveForm.editopenBalance
      ) {
        this.chprofiopen = true;
        changesection.push({
          section: "Leave Details",
          field: "Open Balance",
          oldvalue: this.currentEmployeeData.open_balance_days,
          newvalue: editLeaveForm.editopenBalance,
        });
      }
    }
    if (editLeaveForm.editopenBalance != null) {
      console.log(typeof editLeaveForm.editopenBalance, "TEST OPEN BALANCE");
      // if (this.currentEmployeeData.minimum_overtime != testmiover) {
      //   changesection.push({
      //     section: "Overtime Option",
      //     field: "Minimum Overtime Hours",
      //     oldvalue: this.currentEmployeeData.minimum_overtime,
      //     newvalue: testmiover,
      //   });
      // }
    }

    // Taking the Employee Extension Details From the Database.
    let editExtension = this.editEmployeeExtension.value;

    console.log("extention data", this.dbEmpExtData);

    if (this.dbEmpExtData.dob != null) {
      if (
        this.dbEmpExtData.dob &&
        editExtension.dateofbirth &&
        !moment(this.dbEmpExtData.dob).isSame(
          moment(editExtension.dateofbirth),
          "day"
        )
      ) {
        changesection.push({
          section: "Personal Details",
          field: "Date of Birth",
          oldvalue: moment(this.dbEmpExtData.dob).format("L"),
          newvalue: moment(editExtension.dateofbirth).format("L"),
        });
      }
    }

    if (this.dbEmpExtData.marital_status != editExtension.maritalStatus) {
      changesection.push({
        section: "Personal Details",
        field: "Marital Status",
        oldvalue: this.dbEmpExtData.marital_status,
        newvalue: editExtension.maritalStatus,
      });
    }

    // //drpdown value
    // if( this.dbEmpExtData.nationality  != editExtension.nationality)
    // {
    //   changesection.push({'section':'Personal Details', 'field':'Natinality', 'oldvalue' : this.dbEmpExtData.nationality,'newvalue' : editExtension.nationality})
    // }

    if (editExtension.phoneNo != null) {
      if (
        (this.dbEmpExtData.phone_no || "").replace(/\D/g, "").trim() !=
        (editExtension.phoneNo.internationalNumber || "")
          .replace(/\D/g, "")
          .trim()
      ) {
        changesection.push({
          section: "Personal Details",
          field: "Phone Number",
          oldvalue: this.dbEmpExtData.phone_no,
          newvalue: editExtension.phoneNo.internationalNumber,
        });
      }
    }

    //new field for personal email
    if (editExtension.personalEmail != null) {
      if (this.dbEmpExtData.pesonal_email != editExtension.personalEmail) {
        changesection.push({
          section: "Personal Details",
          field: "Email Address",
          oldvalue: this.dbEmpExtData.pesonal_email,
          newvalue: editExtension.personalEmail,
        });
      }
    }

    if (this.dbEmpExtData.gardian_contact != editExtension.gardianContact) {
      changesection.push({
        section: "Emergency Contact Details",
        field: "Contact Name",
        oldvalue: this.dbEmpExtData.gardian_contact,
        newvalue: editExtension.gardianContact,
      });
    }

    if (
      editExtension.emergencyContact != null &&
      (this.dbEmpExtData.emergency_contact || "").replace(/\D/g, "").trim() !=
        (editExtension.emergencyContact.internationalNumber || "")
          .replace(/\D/g, "")
          .trim()
    ) {
      changesection.push({
        section: "Emergency Contact Details",
        field: "Contact Phone Number",
        oldvalue: this.dbEmpExtData.emergency_contact,
        newvalue: editExtension.emergencyContact.internationalNumber,
      });
    }

    if (this.dbEmpExtData.gardian_relation != editExtension.gardianRelation) {
      changesection.push({
        section: "Emergency Contact Details",
        field: "Contact Relation",
        oldvalue: this.dbEmpExtData.gardian_relation,
        newvalue: editExtension.gardianRelation,
      });
    }

    if (sessionStorage.getItem("photo_url")) {
      if (this.dbEmpExtData.photo_url != sessionStorage.getItem("photo_url")) {
        changesection.push({
          section: "Photo Details",
          field: "Photo file",
          oldvalue: "Old photo",
          newvalue: "New photo file",
        });
      }
    }

    //for not added full name for passport
    if (this.dbEmpExtData.full_name_pst != editExtension.fullNamePst) {
      changesection.push({
        section: "Passport Details",
        field: "Passport Full Name",
        oldvalue: this.dbEmpExtData.full_name_pst,
        newvalue: editExtension.fullNamePst,
      });
    }

    if (this.dbEmpExtData.passport_num != editExtension.passNumber) {
      changesection.push({
        section: "Passport Details",
        field: "Passport Number",
        oldvalue: this.dbEmpExtData.passport_num,
        newvalue: editExtension.passNumber,
      });
    }

    if (
      this.dbEmpExtData.pass_issue_contry != null &&
      !isNaN(this.dbEmpExtData.pass_issue_contry)
    ) {
      if (
        this.dbEmpExtData.pass_issue_contry != editExtension.passIssueContry
      ) {
        let curempidvalue = this.countryDataDropDown.find(
          (x) => x.id == this.dbEmpExtData.pass_issue_contry
        );
        let curempidvadiv = this.countryDataDropDown.find(
          (x) => x.id == editExtension.passIssueContry
        );
        changesection.push({
          section: "Passport Details",
          field: "Issue Country",
          oldvalue: curempidvalue.value,
          newvalue: curempidvadiv.value,
        });
      }
    } else {
      if (
        editExtension.passIssueContry != null &&
        !isNaN(editExtension.passIssueContry)
      ) {
        let curempidvalue = this.countryDataDropDown.find(
          (x) => x.id == editExtension.passIssueContry
        );
        changesection.push({
          section: "Passport Details",
          field: "Issue Country",
          oldvalue: "Not assigned",
          newvalue: curempidvalue.value,
        });
      }
    }

    if (
      moment(this.dbEmpExtData.pass_issue_date).format("L") !=
      moment(editExtension.passIssueDate).format("L")
    ) {
      changesection.push({
        section: "Passport Details",
        field: "Issue Date",
        oldvalue: moment(this.dbEmpExtData.pass_issue_date).format("L"),
        newvalue: moment(editExtension.passIssueDate).format("L"),
      });
    }

    if (
      moment(this.dbEmpExtData.pass_exp_date).format("L") !=
      moment(editExtension.passExpDate).format("L")
    ) {
      changesection.push({
        section: "Passport Details",
        field: "Expiry Date",
        oldvalue: moment(this.dbEmpExtData.pass_exp_date).format("L"),
        newvalue: moment(editExtension.passExpDate).format("L"),
      });
    }

    if (this.dbEmpExtData.adr_1 != editExtension.adr1) {
      changesection.push({
        section: "Address Details",
        field: "Local Address Line 1",
        oldvalue: this.dbEmpExtData.adr_1,
        newvalue: editExtension.adr1,
      });
    }

    if (this.dbEmpExtData.adr_2 != editExtension.adr2) {
      changesection.push({
        section: "Address Details",
        field: "Local Address Line 2",
        oldvalue: this.dbEmpExtData.adr_2,
        newvalue: editExtension.adr2,
      });
    }

    if (this.dbEmpExtData.adr_city != editExtension.adrCity) {
      changesection.push({
        section: "Address Details",
        field: "Local Address City",
        oldvalue: this.dbEmpExtData.adr_city,
        newvalue: editExtension.adrCity,
      });
    }

    if (this.dbEmpExtData.adr_country != null) {
      if (
        this.dbEmpExtData.adr_country != editExtension.adrCountry &&
        !isNaN(this.dbEmpExtData.adr_country)
      ) {
        let curempidvalue = this.countryDataDropDown.find(
          (x) => x.id == this.dbEmpExtData.adr_country
        );
        let curempidvale = this.countryDataDropDown.find(
          (x) => x.id == editExtension.adrCountry
        );
        changesection.push({
          section: "Address Details",
          field: "Local Address Country",
          oldvalue: curempidvalue.value,
          newvalue: curempidvale.value,
        });
      }
    } else {
      if (
        editExtension.adrCountry != null &&
        !isNaN(editExtension.adrCountry)
      ) {
        let gggg = this.countryDataDropDown.find(
          (x) => x.id == editExtension.adrCountry
        );
        changesection.push({
          section: "Address Details",
          field: "Local Address Country",
          oldvalue: "Not Assigned",
          newvalue: gggg.value,
        });
      }
    }

    if (this.dbEmpExtData.adr_postal_code != editExtension.adrPostalCode) {
      changesection.push({
        section: "Address Details",
        field: "Local Address Postal Code",
        oldvalue: this.dbEmpExtData.adr_country,
        newvalue: editExtension.adrPostalCode,
      });
    }

    if (this.dbEmpExtData.contact_adr_1 != editExtension.conAdr1) {
      changesection.push({
        section: "Address Details",
        field: "Home Address Line 1",
        oldvalue: this.dbEmpExtData.contact_adr_1,
        newvalue: editExtension.conAdr1,
      });
    }

    if (this.dbEmpExtData.contact_adr_2 != editExtension.conAdr2) {
      changesection.push({
        section: "Address Details",
        field: "Home Address Line 2",
        oldvalue: this.dbEmpExtData.contact_adr_2,
        newvalue: editExtension.conAdr2,
      });
    }

    if (this.dbEmpExtData.contact_city != editExtension.conCity) {
      changesection.push({
        section: "Address Details",
        field: "Home Address City",
        oldvalue: this.dbEmpExtData.contact_city,
        newvalue: editExtension.conCity,
      });
    }

    if (
      this.dbEmpExtData.contact_country != null &&
      !isNaN(this.dbEmpExtData.contact_country)
    ) {
      if (this.dbEmpExtData.contact_country != editExtension.conCountry) {
        let curempidvalue = this.countryDataDropDown.find(
          (x) => x.id == this.dbEmpExtData.contact_country
        );
        let curempivalue = this.countryDataDropDown.find(
          (x) => x.id == editExtension.conCountry
        );
        changesection.push({
          section: "Address Details",
          field: "Home Address Country",
          oldvalue: curempidvalue.value,
          newvalue: curempivalue.value,
        });
      }
    } else {
      if (
        editExtension.conCountry != null &&
        !isNaN(editExtension.conCountry)
      ) {
        let curempidvalue = this.countryDataDropDown.find(
          (x) => x.id == editExtension.conCountry
        );
        changesection.push({
          section: "Address Details",
          field: "Home Address Country",
          oldvalue: "Not Assigned",
          newvalue: curempidvalue.value,
        });
      }
    }

    if (this.dbEmpExtData.contact_postal_code != editExtension.conPostalCode) {
      changesection.push({
        section: "Address Details",
        field: "Home Address Postal Code",
        oldvalue: this.dbEmpExtData.contact_postal_code,
        newvalue: editExtension.conPostalCode,
      });
    }

    if (
      this.dbEmpExtData.con_start &&
      editExtension.conStart &&
      !moment(this.dbEmpExtData.con_start).isSame(
        moment(editExtension.conStart),
        "day"
      )
    ) {
      changesection.push({
        section: "Contract Details",
        field: "Contract Start Date",
        oldvalue: moment(this.dbEmpExtData.con_start).format("L"),
        newvalue: moment(editExtension.conStart).format("L"),
      });
    }

    if (
      this.dbEmpExtData.con_end &&
      editExtension.conEnd &&
      !moment(this.dbEmpExtData.con_end).isSame(
        moment(editExtension.conEnd),
        "day"
      )
    ) {
      changesection.push({
        section: "Contract Details",
        field: "Contract End Date",
        oldvalue: moment(this.dbEmpExtData.con_end).format("L"),
        newvalue: moment(editExtension.conEnd).format("L"),
      });
    }

    if (this.dbEmpExtData.labour_id != editExtension.labourId) {
      changesection.push({
        section: "Contract Details",
        field: "Labour ID",
        oldvalue: this.dbEmpExtData.labour_id,
        newvalue: editExtension.labourId,
      });
    }

    if (
      this.dbEmpExtData.labour_exp_date &&
      editExtension.labourExpDate &&
      !moment(this.dbEmpExtData.labour_exp_date).isSame(
        moment(editExtension.labourExpDate),
        "day"
      )
    ) {
      changesection.push({
        section: "Contract Details",
        field: "Labour Expiry Date",
        oldvalue: moment(this.dbEmpExtData.labour_exp_date).format("L"),
        newvalue: moment(editExtension.labourExpDate).format("L"),
      });
    }

    if (this.dbEmpExtData.visa_id != editExtension.visaId) {
      changesection.push({
        section: "UAE Immigration Details",
        field: "Visa ID",
        oldvalue: this.dbEmpExtData.visa_id,
        newvalue: editExtension.visaId,
      });
    }

    if (this.dbEmpExtData.visa_type != editExtension.visaType) {
      changesection.push({
        section: "UAE Immigration Details",
        field: "Visa Type",
        oldvalue: this.dbEmpExtData.visa_type,
        newvalue: editExtension.visaType,
      });
    }

    if (
      moment(this.dbEmpExtData.visa_exp_date).format("L") !=
      moment(editExtension.visaExpDate).format("L")
    ) {
      changesection.push({
        section: "UAE Immigration Details",
        field: "Visa Expiry Date",
        oldvalue: moment(this.dbEmpExtData.visa_exp_date).format("L"),
        newvalue: moment(editExtension.visaExpDate).format("L"),
      });
    }

    if (this.dbEmpExtData.emirates_id != editExtension.emiratesId) {
      changesection.push({
        section: "UAE Immigration Details",
        field: "Emirates ID",
        oldvalue: this.dbEmpExtData.emirates_id,
        newvalue: editExtension.emiratesId,
      });
    }

    if (
      moment(this.dbEmpExtData.emirates_id_exp_date).format("L") !=
      moment(editExtension.emiratesIdExpDate).format("L")
    ) {
      changesection.push({
        section: "UAE Immigration Details",
        field: "Emirates Expiry Date",
        oldvalue: moment(this.dbEmpExtData.emirates_id_exp_date).format("L"),
        newvalue: moment(editExtension.emiratesIdExpDate).format("L"),
      });
    }

    //insurance change

    //bank details

    if (this.dbEmpExtData.bank_name != editExtension.bankName) {
      changesection.push({
        section: "Bank Details",
        field: "Bank Name",
        oldvalue: this.dbEmpExtData.bank_name,
        newvalue: editExtension.bankName,
      });
    }

    if (this.dbEmpExtData.bank_branch != editExtension.bankBranch) {
      changesection.push({
        section: "Bank Details",
        field: "Bank Branch",
        oldvalue: this.dbEmpExtData.bank_branch,
        newvalue: editExtension.bankBranch,
      });
    }

    if (this.dbEmpExtData.bank_account_num != editExtension.accNumber) {
      changesection.push({
        section: "Bank Details",
        field: "Bank Account Number",
        oldvalue: this.dbEmpExtData.bank_account_num,
        newvalue: editExtension.accNumber,
      });
    }

    if (this.dbEmpExtData.bank_Iban != editExtension.iban) {
      changesection.push({
        section: "Bank Details",
        field: "Bank IBAN",
        oldvalue: this.dbEmpExtData.bank_Iban,
        newvalue: editExtension.iban,
      });
    }

    if (this.dbEmpExtData.bank_swift != editExtension.swiftCode) {
      changesection.push({
        section: "Bank Details",
        field: "Bank Swift",
        oldvalue: this.dbEmpExtData.bank_swift,
        newvalue: editExtension.swiftCode,
      });
    }

    //Chnage in salary

    if (
      moment(this.dbEmpExtData.salary_effective_date).format("L") !=
      moment(editExtension.salEffDate).format("L")
    ) {
      console.log(
        moment(this.dbEmpExtData.salary_effective_date).format("L"),
        moment(editExtension.salary_effective_date).format("L"),
        moment(editExtension.salEffDate).format("L"),
        "DATES"
      );
      changesection.push({
        section: "Salary Details",
        field: "Salary Effective Date",
        oldvalue: moment(this.dbEmpExtData.salary_effective_date).format("L"),
        newvalue: moment(editExtension.salEffDate).format("L"),
      });
    }

    if (this.dbEmpExtData.basic_salary != this.basicpay) {
      changesection.push({
        section: "Salary Details",
        field: "Basic Salary",
        oldvalue: this.formatMoney(this.dbEmpExtData.basic_salary),
        newvalue: this.formatMoney(this.basicpay),
      });
    }

    if (this.dbEmpExtData.accommod_allow != this.accommodation) {
      changesection.push({
        section: "Salary Details",
        field: "Accomodation Allowance",
        oldvalue: this.formatMoney(this.dbEmpExtData.accommod_allow),
        newvalue: this.formatMoney(this.accommodation),
      });
    }

    if (this.dbEmpExtData.travel_allow != this.travel) {
      changesection.push({
        section: "Salary Details",
        field: "Travel Allowance",
        oldvalue: this.formatMoney(this.dbEmpExtData.travel_allow),
        newvalue: this.formatMoney(this.travel),
      });
    }

    if (this.dbEmpExtData.a_one != this.aone) {
      changesection.push({
        section: "Salary Details",
        field: editExtension.aOneName,
        oldvalue: this.formatMoney(this.dbEmpExtData.a_one),
        newvalue: this.formatMoney(this.aone),
      });
    }

    if (this.dbEmpExtData.a_two != this.atwo) {
      changesection.push({
        section: "Salary Details",
        field: editExtension.aTwoName,
        oldvalue: this.formatMoney(this.dbEmpExtData.a_two),
        newvalue: this.formatMoney(this.atwo),
      });
    }

    if (this.dbEmpExtData.a_three != this.athree) {
      changesection.push({
        section: "Salary Details",
        field: editExtension.aThreeName,
        oldvalue: this.formatMoney(this.dbEmpExtData.a_three),
        newvalue: this.formatMoney(this.athree),
      });
    }

    if (this.dbEmpExtData.tax_deduc != this.tax) {
      changesection.push({
        section: "Salary Details",
        field: "Tax Deduction",
        oldvalue: this.formatMoney(this.dbEmpExtData.tax_deduc),
        newvalue: this.formatMoney(this.tax),
      });
    }

    if (this.dbEmpExtData.insurance_deduc != this.insurance) {
      changesection.push({
        section: "Salary Details",
        field: "Insurance",
        oldvalue: this.formatMoney(this.dbEmpExtData.insurance_deduc),
        newvalue: this.formatMoney(this.insurance),
      });
    }

    if (this.dbEmpExtData.d_one != this.done) {
      changesection.push({
        section: "Salary Details",
        field: editExtension.dOneName,
        oldvalue: this.formatMoney(this.dbEmpExtData.d_one),
        newvalue: this.formatMoney(this.done),
      });
    }

    if (this.dbEmpExtData.d_two != this.dtwo) {
      changesection.push({
        section: "Salary Details",
        field: editExtension.dTwoName,
        oldvalue: this.formatMoney(this.dbEmpExtData.d_two),
        newvalue: this.formatMoney(this.dtwo),
      });
    }

    if (this.dbEmpExtData.d_three != this.dthree) {
      changesection.push({
        section: "Salary Details",
        field: editExtension.dThreeName,
        oldvalue: this.formatMoney(this.dbEmpExtData.d_three),
        newvalue: this.formatMoney(this.dthree),
      });
    }

    if (this.dbEmpExtData.gross_pay != this.grosspay) {
      changesection.push({
        section: "Salary Details",
        field: "Gross Pay",
        oldvalue: this.formatMoney(this.dbEmpExtData.gross_pay),
        newvalue: this.formatMoney(this.grosspay),
      });
    }

    if (this.dbEmpExtData.net_deduc != this.netdeduct) {
      changesection.push({
        section: "Salary Details",
        field: "Net Deduction",
        oldvalue: this.formatMoney(this.dbEmpExtData.net_deduc),
        newvalue: this.formatMoney(this.netdeduct),
      });
    }

    if (this.dbEmpExtData.net_pay != this.netpay) {
      changesection.push({
        section: "Salary Details",
        field: "Net Pay",
        oldvalue: this.formatMoney(this.dbEmpExtData.net_pay),
        newvalue: this.formatMoney(this.netpay),
      });
    }

    let groupedArr = changesection.reduce((acc, obj) => {
      let { section, ...rest } = obj;
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(rest);
      return acc;
    }, {});

    this.groupedData = Object.entries(groupedArr).map(([id, value]) => ({
      id,
      value,
    }));

    console.log("Section", changesection);
    this.compareData = [];
    this.compareData = changesection;

    if (this.compareData.length != 0) {
      this.modalService.open(this.compareupdate, {
        size: "lg",
        backdrop: "static",
      });
    } else {
      Swal.fire({
        title: "Save Changes",
        text: "Do you want to continue without any change to the Saved Draft!",
        showCloseButton: true,
        confirmButtonColor: "#e91e63",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.value === true) {
          this.modalService.open(this.compareupdate, {
            size: "lg",
            backdrop: "static",
          });
        }
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
      return `AED: ${integerWithCommas}.${decimalPart}`;
    }
  }

  saveasdraft(from: any) {
    //getting the basic post data.
    let postDraft = {};
    console.log("checking the current employee data", this.currentEmployeeData);
    console.log("beginign this.terminationData", this.terminationData);

    this.getEditedEmployeeBasic();
    let userinfo = JSON.parse(localStorage.getItem("user_info"));
    this.postbasicData["emp_id"] = localStorage.getItem("emp_id");
    if (
      this.addEditApprover1Value != undefined ||
      this.addEditApprover1Value != null
    ) {
      this.postbasicData["approver1_roleId"] = this.addEditApprover1Value;
    } else {
      this.postbasicData["approver1_roleId"] = null;
    }
    this.postbasicData["approver2_roleId"] = this.addEditdualApprovalDiv
      ? this.addEditApprover2Value
      : null;
    this.postbasicData["is_draft"] = true;
    this.postbasicData["draft_by"] = userinfo.id;
    //getting the extension post data.
    this.getEditEmployeeExtsion();
    console.log("postbasicData", this.postbasicData);
    console.log("postExtData", this.postExtData);
    let phurl = "";
    if (sessionStorage.getItem("photo_url")) {
      phurl = sessionStorage.getItem("photo_url");
    }

    postDraft = {
      emp_id: this.postbasicData.id,
      org_id: this.postbasicData.org_id,
      update_status: "Pending",
      //GeneralDetails
      mobile: this.postbasicData.alias, //Nationality cannot be changed by user
      emp_code: this.postbasicData.emp_code,
      status: this.postbasicData.status,
      first_name: this.postbasicData.first_name,
      last_name: this.postbasicData.last_name,
      full_name: this.postbasicData.full_name,
      gender: this.postbasicData.gender,
      workemail: this.postbasicData.workemail,
      phone_iso_name: this.postbasicData.phone_iso_name,
      phone: this.postbasicData.phone,
      team_id: this.postbasicData.team_id,
      joined_date: this.postbasicData.joined_date,
      emp_created_date: moment(this.currentEmployeeData.created_date).format(
        "L"
      ),

      //,emp_modified_date: moment(this.currentEmployeeData.modified_date).format("L")

      //administartive
      emp_status_id: this.postbasicData.emp_status_id,
      emp_type_id: this.postbasicData.emp_type_id,
      role_id: this.postbasicData.role_id,
      emp_contract_end_date: this.postbasicData.contract_enddate,

      //geo Details
      work_location: this.postbasicData.work_location,
      time_zone: this.postbasicData.time_zone,
      time_format: this.postbasicData.time_format,

      //working days Details
      workday_settings: this.postbasicData.workday_settings,
      work_profile_effective_day: this.postbasicData.work_profile_effective_day,
      working_days: this.postbasicData.working_days,
      work_start_time: this.postbasicData.work_start_time,
      work_end_time: this.postbasicData.work_end_time,
      checkin_tolarence: this.postbasicData.checkin_tolarence,
      less_hour_tolerance: this.postbasicData.less_hour_tolerance, //new
      break_time: this.postbasicData.break_time,
      is_flexible: this.postbasicData.is_flexible,
      checkin_after: this.postbasicData.checkin_after,
      checkout_before: this.postbasicData.checkout_before,
      min_hrs_flx: this.postbasicData.min_hrs_flx,
      break_time_flx: this.postbasicData.break_time_flx,
      is_custom_work: this.postbasicData.is_custom_work,
      work_days_exp: this.postbasicData.work_days_exp,
      saturday_exp: this.postbasicData.saturday_exp,
      sunday_exp: this.postbasicData.sunday_exp,
      monday_exp: this.postbasicData.monday_exp,
      tuesday_exp: this.postbasicData.tuesday_exp,
      wednesday_exp: this.postbasicData.wednesday_exp,
      thursday_exp: this.postbasicData.thursday_exp,
      friday_exp: this.postbasicData.friday_exp,

      //Leave Details
      leave_profile_setup_id: this.postbasicData.leave_profile_setup_id,
      leave_taken: this.postbasicData.leave_taken,
      leave_taken_sick: this.postbasicData.leave_taken_sick,
      is_new_profile:
        this.postbasicData.is_new_profile == null
          ? false
          : this.postbasicData.is_new_profile,
      is_change_profile:
        this.postbasicData.is_change_profile == null
          ? false
          : this.postbasicData.is_change_profile,
      profile_effective_from_date:
        this.postbasicData.profile_effective_from_date,
      open_balance_days: this.postbasicData.open_balance_days,
      is_approved1: false,
      is_approved2: false,
      approver1_roleId: this.postbasicData.approver1_roleId,
      approver2_roleId: this.postbasicData.approver2_roleId,
      createdby: userinfo.id,

      //Overtime Details
      is_weekday_overtime_enabled:
        this.postbasicData.is_weekday_overtime_enabled,
      is_holiday_overtime_enabled:
        this.postbasicData.is_holiday_overtime_enabled,
      minimum_overtime: this.postbasicData.minimum_overtime,

      //NOT USABLE fields
      // ,min_hrs: null
      // ,designation_id: ''
      // ,mobile: ''
      // ,email: ''
      // ,summary: ''
      // ,user_id: ''
      // ,working_hours: this.postbasicData.work_start_time
      // ,is_delegate_user: ''
      // ,open_balance_sick: this.postbasicData.op
      // ,is_special: ''
      // ,ondate_approved1:
      // ,ondate_approved2: ''
      // ,approver1_notes: ''
      // ,approver2_notes: ''
      // ,created_date: ''
      // ,modified_date: null
      // ,modifiedby: null
      // ,emp_code_ext:
      // ,other_allow: this.postExtData.
      // ,other_deduc:
      // ,home_no: this.postExtData.home_no

      //Personal Details
      dob: this.postExtData.dob,
      marital_status: this.postExtData.marital_status,
      nationality: this.postExtData.nationality,
      phone_no: this.postExtData.phone_no,
      pesonal_email: this.postExtData.pesonal_email,

      //Emergency Details
      gardian_contact: this.postExtData.gardian_contact,
      emergency_contact: this.postExtData.emergency_contact,
      gardian_relation: this.postExtData.gardian_relation,

      //photo details
      photo_url: phurl,

      //Passport Details
      full_name_pst: this.postExtData.full_name_pst,
      passport_num: this.postExtData.passport_num,
      //,pass_issue_contry: isNaN(this.postExtData.pass_issue_contry) ? this.postExtData.pass_issue_contry : null
      pass_issue_contry: this.postExtData.pass_issue_contry,
      pass_issue_date: this.postExtData.pass_issue_date,
      pass_exp_date: this.postExtData.pass_exp_date,

      //Address Details
      adr_1: this.postExtData.adr_1,
      adr_2: this.postExtData.adr_2,
      adr_city: this.postExtData.adr_city,
      //,adr_country: isNaN(this.postExtData.adr_country) ? this.postExtData.adr_country : null
      adr_country: this.postExtData.adr_country,
      adr_postal_code: this.postExtData.adr_postal_code,
      is_con_same:
        this.postExtData.is_con_same == null
          ? false
          : this.postExtData.is_con_same,
      contact_adr_1: this.postExtData.contact_adr_1,
      contact_adr_2: this.postExtData.contact_adr_2,
      contact_city: this.postExtData.contact_city,
      //,contact_country: isNaN(this.postExtData.contact_country) ? this.postExtData.contact_country :null
      contact_country: this.postExtData.contact_country,
      contact_postal_code: this.postExtData.contact_postal_code,

      //contract Details
      con_start: this.postExtData.con_start,
      con_end: this.postExtData.con_end,
      labour_id: this.postExtData.labour_id,
      labour_exp_date: this.postExtData.labour_exp_date,

      //UAE Immigration Details
      visa_id: this.postExtData.visa_id,
      visa_type: this.postExtData.visa_type,
      visa_exp_date: this.postExtData.visa_exp_date,
      emirates_id: this.postExtData.emirates_id,
      emirates_id_exp_date: this.postExtData.emirates_id_exp_date,

      //Insurance Details
      ins_provider: this.postExtData.ins_provider,
      ins_policy: this.postExtData.ins_policy,
      ins_exp: this.postExtData.ins_exp,

      //Bank Details
      bank_name: this.postExtData.bank_name,
      bank_branch: this.postExtData.bank_branch,
      bank_account_num: this.postExtData.bank_account_num,
      bank_Iban: this.postExtData.bank_Iban,
      bank_swift: this.postExtData.bank_swift,

      //Salary Details
      salary_effective_date: this.postExtData.salary_effective_date,
      basic_salary: this.postExtData.basic_salary,
      travel_allow: this.postExtData.travel_allow,
      accommod_allow: this.postExtData.accommod_allow,
      a_one_name: this.postExtData.a_one_name,
      a_one: this.postExtData.a_one,
      a_two_name: this.postExtData.a_two_name,
      a_two: this.postExtData.a_two,
      a_three_name: this.postExtData.a_three_name,
      a_three: this.postExtData.a_three,

      tax_deduc: this.postExtData.tax_deduc,
      insurance_deduc: this.postExtData.insurance_deduc,
      d_one_name: this.postExtData.d_one_name,
      d_one: this.postExtData.d_one,
      d_two_name: this.postExtData.d_two_name,
      d_two: this.postExtData.d_two,
      d_three_name: this.postExtData.d_three_name,
      d_three: this.postExtData.d_three,

      gross_pay: this.postExtData.gross_pay,
      net_deduc: this.postExtData.net_deduc,
      net_pay: this.postExtData.net_pay,

      //Post data details
      is_deleted: false,
      is_emp_deleted: false,
      is_deleted_ext: false,

      //functionality perspective
      is_draft: true,
      draft_by: this.postbasicData.draft_by,

      //fortermination
      term_end_by: this.terminationData
        ? this.terminationData.term_end_by
        : null,
      term_end_date: this.terminationData
        ? this.terminationData.term_end_date
        : null,
      term_type: this.terminationData ? this.terminationData.term_type : null,
      term_reason: this.terminationData
        ? this.terminationData.term_reason
        : null,
      remarks: this.terminationData ? this.terminationData.remarks : null,
      term_doc_url: this.terminationData
        ? this.terminationData.term_doc_url
        : null,
    };

    if (this.fromsavedraft) {
      postDraft["id"] = this.draftid;
      postDraft["is_deleted"] = true;
    }

    if (from == "close") {
      postDraft["update_status"] = "Drafted";
    }

    console.log("post Draft", postDraft);
    this.empService
      .AddDraftEmployeeOverride(postDraft)
      .subscribe((data: any) => {
        if (data != null) {
          console.log("after post draft", data);
          if (data.code == "200") {
            if (from == "close") {
              //service for saving the details to the draft table.
              this.toast.success("Employee Details Saved as Draft!");
              this.getDraftEmployeeEditData();
              this.editEmployeeClose();
              this.modalService.dismissAll();
              this.spinner.hide();
            } else if (from == "getid") {
              this.draftid = data.status;
              console.log("getting the id", this.draftid);
              this.callSubmitDraft();
            } else if (from == "sendAprReq") {
              console.log("inside sending the request!");
              this.draftid = data.status;
              let postData = {
                id: this.draftid,
              };
              this.empService
                .sendEmpEdtAprReq(postData)
                .subscribe((data: any) => {
                  if (data.status == 200) {
                    if (
                      data["desc"] ==
                      "Employee Details Send For Approvel Successfully."
                    ) {
                      this.spinner.hide();
                      this.toast.success(data["desc"], undefined, {
                        positionClass: "toast-top-center",
                      });
                    } else {
                      this.spinner.hide();
                      this.toast.info(data["desc"], undefined, {
                        positionClass: "toast-top-center",
                      });
                    }

                    this.closeEditEmployeeRequest();
                    this.getDraftEmployeeEditData();
                    this.editEmployeeClose();
                  } else {
                    this.closeEditEmployeeRequest();
                    this.getDraftEmployeeEditData();
                    this.editEmployeeClose();
                    Swal.fire("Error!", data["result"].desc, "error");
                  }
                });
            }
          } else {
            this.toast.error("Something Went Worng! Not Drafted");
          }
        }
      });
  }

  sendNoToFinal() {
    let userinfo = JSON.parse(localStorage.getItem("user_info"));
    let employeeAprRequest = {
      id: this.originalEditEmpData.id,
      emp_id: this.originalEditEmpData.emp_id,
      update_status: "Pending",
      ondate_approved1: moment().format("L"),
      approver1_notes: null,
      approver2_notes: null,
      ondate_approved2: null,
      approver1_roleId: this.originalEditEmpData.approver1_roleId,
      approver2_roleId: this.originalEditEmpData.approver2_roleId,
      is_approved1: true,
      is_approved2: false,
      createdby: this.originalEditEmpData.createdby,
      modifiedby: userinfo.id,
    };

    // id = modal.id,
    // update_status = modal.update_status,
    // ondate_approved1 = modal.ondate_approved1,
    // ondate_approved2 = modal.ondate_approved2,
    // approver1_notes = modal.approver1_notes,
    // approver2_notes = modal.approver2_notes,
    // is_approved1 = modal.is_approved1,
    // is_approved2 = modal.is_approved2,
    // modified_date = _dateTime.ToString(),
    // modifiedby = modal.modifiedby

    let postData = {
      id: this.originalEditEmpData.id,
    };

    this.empService
      .UpdateEmployeeDetailsOverrideByID(employeeAprRequest)
      .subscribe((getApproverdata: any) => {
        if (getApproverdata.status == 200) {
          this.empService.sendEmpEdtAprReq(postData).subscribe((data: any) => {
            if (data.status == 200) {
              if (
                data["desc"] ==
                "Employee Details Send For Approvel Successfully."
              ) {
                this.spinner.hide();
                this.toast.success(
                  "Approved and further request send to Level 2 approver"
                );
                this.markNotRead();
              } else {
                this.spinner.hide();
                this.toast.info(data["desc"], undefined, {
                  positionClass: "toast-top-center",
                });
              }

              this.closeEditEmployeeRequest();
              this.getDraftEmployeeEditData();
              this.fillDashBoardDetails();
              this.editEmployeeClose();
            } else {
              this.closeEditEmployeeRequest();
              this.getDraftEmployeeEditData();
              this.fillDashBoardDetails();
              this.editEmployeeClose();
              Swal.fire("Error!", data["result"].desc, "error");
            }
          });
        } else {
          this.toast.error("Something went wrong while sending approval");
          this.closeEditEmployeeRequest();
          this.getDraftEmployeeEditData();
          this.fillDashBoardDetails();
          this.editEmployeeClose();
        }
      });
  }

  saveAsAprover() {
    this.saveasdraft("getid");
  }

  sendAprEditEmployee() {
    this.saveasdraft("sendAprReq");
  }

  callSubmitDraft() {
    this.spinner.show();
    let postData;
    if (this.addEditSectionFullAccess) {
      postData = {
        orgID: this.draftorg,
        id: this.draftid,
        empID: localStorage.getItem("emp_id"),
      };
      console.log("my post data", postData);

      this.empService
        .UpdateEmployeeFromDraft(postData)
        .subscribe(async (data: any) => {
          if (data != null && data.status == "200") {
            // console.log("update result", data)
            this.empService
              .GetDocumentsByempIdwithDelete({
                id: localStorage.getItem("emp_id"),
              })
              .subscribe(async (docdata: any) => {
                if (docdata != null) {
                  await docdata.map((doc: any) => {
                    if (
                      doc.related_to == "draft" &&
                      doc.doc_action == "upload" &&
                      doc.is_approved == false
                    ) {
                      doc.is_approved = true;
                      doc.doc_action = "complete";
                      doc.related_to = "original";
                      this.empService
                        .UpdateDocById(doc)
                        .subscribe((rsp: any) => {});
                    } else if (
                      doc.related_to == "original" &&
                      doc.doc_action == "delete" &&
                      doc.is_approved == false
                    ) {
                      doc.is_approved = true;
                      doc.doc_action = "complete";
                      this.removeDocPermenentByID(doc);
                    }
                  });
                  console.log("API ENDED");
                  this.spinner.hide();
                  this.toast.success(
                    "Employee Details where updated successfully"
                  );
                  this.editEmployeeClose();
                  this.getDraftEmployeeEditData();
                  this.fillDashBoardDetails();
                  this.modalService.dismissAll();
                }
              });
          } else {
            this.toast.error("Something went wrong! ");
          }
        });
    }
  }

  // saveEditedEmployee(postData){
  //   if (this.addEditSectionFullAccess) {
  //     this.callEditFinalEmployee(postData);
  //     this.modalService.dismissAll();
  //   } else {
  //     postData["emp_id"] = localStorage.getItem('emp_id');
  //     postData["approver1_roleId"] = this.addEditApprover1Value;
  //     postData["approver2_roleId"] = this.addEditdualApprovalDiv ? this.addEditApprover2Value : null;
  //     this.callEditEmpRequestModel();
  //     this.editEmployeeDetailsRequestData = postData;
  //     this.modalService.dismissAll();
  //     this.spinner.hide();
  //   }
  // }

  // callEditFinalEmployee(postData) {
  //   this.empService.updateEmp(postData).subscribe((data: any) => {
  //     console.log(data);
  //     if (data.status == 200) {
  //       this.toast.success(data["desc"], undefined, {
  //         positionClass: "toast-top-center",
  //       });
  //       this.editEmployeeClose();
  //       this.spinner.hide();
  //     } else {
  //       this.spinner.hide();
  //       Swal.fire("Error!", data["result"].desc, "error");
  //     }
  //   });
  // }

  closeEditEmployeeRequest() {
    this.modalService.dismissAll();
    //this.disableEditSection();
  }

  backeditbutton() {
    Swal.fire({
      title: "Oops! Closing Employee Edit Section!",
      text: "Do you want to continue to close employee edit section without saving the data?",
      showCloseButton: true,
      confirmButtonColor: "#e91e63",
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        // this.empService.GetDocumentsByempIdwithDelete({ id: localStorage.getItem("emp_id") }).subscribe(async (docdata: any) => {
        //   if (docdata != null) {
        //     await docdata.map(async (doc) => {
        //       if (doc.related_to != 'original' && doc.is_approved == false) {
        //         this.removeDocPermenentByID(doc);
        //         console.log("removed unsaved draft document", doc);
        //       }
        //       if (doc.related_to == 'original' && doc.is_approved == false) {
        //         doc.is_approved = true;
        //         doc.doc_action = 'complete';
        //         doc.is_deleted = false;
        //         console.log("testdata", doc);
        //         this.empService.UpdateDocById(doc).subscribe((rep) => {
        //           if (rep) {
        //             if (rep["result"]["status"] == 200) {
        //               console.log("Original Document is Revived Back to Normal");
        //             }
        //           }
        //         });
        //       }
        //     });
        //   }
        // });

        this.editEmployeeClose();
        this.draftcheck = false;
      }
    });
  }

  editEmployeeClose() {
    this.editEmployeeForm.reset();
    this.editEmployeeLeaveForm.reset();
    this.allEmployeeGrid = true;
    this.singleEmployeeAdd = false;
    this.singleEmployeeEdit = false;
    this.fromsavedraft = false;
    this.istermination = false;
    this.terminationData = null;
    this.getEmployeeByOrgId();
    //this.get
    this.assetimg = "../../assets/images/profile_img.png";
    if (localStorage.getItem("empi_id")) {
      localStorage.removeItem("emp_id");
    }
    if (sessionStorage.getItem("empi_id")) {
      sessionStorage.removeItem("emp_id");
    }
    if (sessionStorage.getItem("photo_url")) {
      sessionStorage.removeItem("photo_url");
    }
    this.yearNumber = 0;
    this.oneYear = false;
    this.twoYear = false;
    this.fourYear = false;
    this.fiveYear = false;
    this.basicpay = 0.0;
    this.travel = 0.0;
    this.aone = 0.0;
    this.atwo = 0.0;
    this.athree = 0.0;
    this.done = 0.0;
    this.dtwo = 0.0;
    this.dthree = 0.0;
    this.accommodation = 0.0;
    this.otherallow = 0.0;
    this.insurance = 0.0;
    this.otherdeduct = 0.0;
    this.grosspay = 0.0;
    this.netdeduct = 0.0;
    this.netpay = 0.0;
    this.editWorkDayExp = [];
    this.is_doc_changed = false;
    this.docchangelist = [];
    this.fromNotification = false;
    this.NoIsDual = false;

    this.chfirst = false;
    this.chlast = false;
    this.chgen = false;
    this.chemail = false;
    this.chstatus = false;
    this.chteam = false;
    this.chjoin = false;
    this.chtype = false;
    this.chrole = false;
    this.chloca = false;
    this.chtime = false;
    this.chformat = false;
    this.chwkset = false;
    this.chwrefdate = false;
    this.chwkdays = false;
    this.chwkexpdays = false;
    this.chprofi = false;
    this.chprofiopen = false;
    this.chefday = false;
    this.choverweek = false;
    this.choverholi = false;
    this.chovtime = false;
    this.chdob = false;
    this.chmrst = false;
    this.chpsnum = false;
    this.chpemal = false;
    this.chemcont = false;
    this.chconum = false;
    this.chcnrel = false;
    this.chpsname = false;
    this.chpstnum = false;
    this.chpstcon = false;
    this.chpstisdt = false;
    this.chpstexp = false;
    this.chadr1 = false;
    this.chadr2 = false;
    this.chadrci = false;
    this.chcon = false;
    this.chzip = false;
    this.chhadr1 = false;
    this.chhadr2 = false;
    this.chhadrci = false;
    this.chhcon = false;
    this.chhzip = false;
    this.chconstdt = false;
    this.chconeddt = false;
    this.chlobr = false;
    this.chlaexp = false;
    this.chvisnum = false;
    this.chvistyp = false;
    this.chviexp = false;
    this.chemid = false;
    this.chemexp = false;
    this.chipn = false;
    this.chipon = false;
    this.chivex = false;
    this.chbkname = false;
    this.chbkbrch = false;
    this.chbknum = false;
    this.chbkiban = false;
    this.chbkswift = false;
    this.chbpay = false;
    this.chalacco = false;
    this.chaltrav = false;
    this.chalone = false;
    this.chaltwo = false;
    this.chalthree = false;
    this.chdetax = false;
    this.chdeins = false;
    this.chdeone = false;
    this.chdetwo = false;
    this.chdethree = false;
    this.chgrp = false;
    this.chnetdect = false;
    this.chntpay = false;
  }

  //!!!change
  employeeResetSettings() {
    console.log(this.currentEmployeeData);
    Swal.fire({
      title: "Are you sure ?",
      text: "This will reset the working days and working time to team level settings",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.assetimg = "../../assets/images/profile_img.png";
        //console.log("run function")
        let postData = {
          orgID: localStorage.getItem("org_id"),
          teamId:
            this.currentEmployeeData.team_id === null
              ? "false"
              : this.currentEmployeeData.team_id,
          empID: this.currentEmployeeData.id,
        };
        //console.log(postData)
        this.teamService
          .EmployeeResetSettings(postData)
          .subscribe((data: any) => {
            //console.log(data)
            if (data.result.status === "200") {
              this.toast.success("Team settings reset successfully.");
              this.editEmployeeClose();
            }
          });
      }
    });
  }

  leaveProfileHistoryModel(leaveProfileHistory) {
    this.modalService.open(leaveProfileHistory);
  }

  WorkProfileHistoryModel(WorkProfileHistory) {
    this.modalService.open(WorkProfileHistory);
  }

  SalaryHistoryModel(SalaryHistory) {
    this.modalService.open(SalaryHistory, { size: "lg", backdrop: "static" });
  }

  CheckSalaryHistory(event) {
    console.log("salary query", event);
  }

  closeModels() {
    this.modalService.dismissAll();
  }

  GetLeaveAvailableProfileHistorybyOrgIdEmpId(id) {
    let postdata = {
      orgID: localStorage.getItem("org_id"),
      empID: id,
    };
    this.empService
      .GetLeaveAvailableProfileHistorybyOrgIdEmpId(postdata)
      .subscribe((data: any) => {
        this.profileChangeHistoryData = data;
      });
  }

  workprofileChangeHistoryData;
  GetWorkProfileHistorybyEmpId(id: any) {
    let postdata = {
      orgID: id,
    };
    this.empService.getWorkingHrsByEmpId(postdata).subscribe((data: any) => {
      if (data != null) {
        this.workprofileChangeHistoryData = data;
      }
    });
  }

  salarychangeHistoryData;
  GetSalaryHistorybyEmpId(id: any) {
    let postdata = { id: id };
    this.payrollService
      .getSalaryHistoryByEmpId(postdata)
      .subscribe((data: any) => {
        if (data != null) {
          this.salarychangeHistoryData = data;
        }
      });
  }

  changedEmpTeamEdit(e) {
    let teamValue;

    if (e.value.id !== null) {
      Swal.fire({
        title: "Apply this team settings ?",
        text: "The current employee Work Timings will be inline with the Selected team",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: " Confirm",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.value === true) {
          let postData = {
            id: e.value.id,
          };
          this.teamService.FindByTeamIDnew(postData).subscribe((data: any) => {
            if (data) {
              teamValue = data;
              console.log("response value", teamValue);

              if (teamValue.working_days !== null) {
                let testData = teamValue.working_days.split(",");
                this.editWorkdaysData = [];
                testData.includes("Saturday") === true
                  ? this.editWorkdaysData.push({
                      day: "SA",
                      day_name: "Saturday",
                      is_working: true,
                    })
                  : this.editWorkdaysData.push({
                      day: "SA",
                      day_name: "Saturday",
                      is_working: false,
                    });
                testData.includes("Sunday") === true
                  ? this.editWorkdaysData.push({
                      day: "SU",
                      day_name: "Sunday",
                      is_working: true,
                    })
                  : this.editWorkdaysData.push({
                      day: "SU",
                      day_name: "Sunday",
                      is_working: false,
                    });
                testData.includes("Monday") === true
                  ? this.editWorkdaysData.push({
                      day: "MO",
                      day_name: "Monday",
                      is_working: true,
                    })
                  : this.editWorkdaysData.push({
                      day: "MO",
                      day_name: "Monday",
                      is_working: false,
                    });
                testData.includes("Tuesday") === true
                  ? this.editWorkdaysData.push({
                      day: "TU",
                      day_name: "Tuesday",
                      is_working: true,
                    })
                  : this.editWorkdaysData.push({
                      day: "TU",
                      day_name: "Tuesday",
                      is_working: false,
                    });
                testData.includes("Wednesday") === true
                  ? this.editWorkdaysData.push({
                      day: "WE",
                      day_name: "Wednesday",
                      is_working: true,
                    })
                  : this.editWorkdaysData.push({
                      day: "WE",
                      day_name: "Wednesday",
                      is_working: false,
                    });
                testData.includes("Thursday") === true
                  ? this.editWorkdaysData.push({
                      day: "TH",
                      day_name: "Thursday",
                      is_working: true,
                    })
                  : this.editWorkdaysData.push({
                      day: "TH",
                      day_name: "Thursday",
                      is_working: false,
                    });
                testData.includes("Friday") === true
                  ? this.editWorkdaysData.push({
                      day: "FR",
                      day_name: "Friday",
                      is_working: true,
                    })
                  : this.editWorkdaysData.push({
                      day: "FR",
                      day_name: "Friday",
                      is_working: false,
                    });
                console.log(this.editWorkdaysData);
              } else {
                this.editWorkdaysData = [
                  {
                    day: "SA",
                    day_name: "Saturday",
                    is_working: false,
                  },
                  {
                    day: "SU",
                    day_name: "Sunday",
                    is_working: true,
                  },
                  {
                    day: "MO",
                    day_name: "Monday",
                    is_working: true,
                  },
                  {
                    day: "TU",
                    day_name: "Tuesday",
                    is_working: true,
                  },
                  {
                    day: "WE",
                    day_name: "Wednesday",
                    is_working: true,
                  },
                  {
                    day: "TH",
                    day_name: "Thursday",
                    is_working: true,
                  },
                  {
                    day: "FR",
                    day_name: "Friday",
                    is_working: false,
                  },
                ];
              }

              if (data.is_flexible === true) {
                this.editIsFlexibleDiv = true;
                this.editDropDownsForm.patchValue({
                  editStartTimeDropdownValue: {
                    id: null,
                    description: "select",
                  },
                  editEndTimeDropdownValue: { id: null, description: "select" },
                  editCheckinTolerance: { id: null, description: "select" },
                  editBreakTimeLimit: { id: null, description: "select" },
                  editCheckInAfter: {
                    id: data.checkin_after,
                    description: data.checkin_after,
                  },
                  editCheckOutBefore: {
                    id: data.checkout_before,
                    description: data.checkout_before,
                  },
                  editTotalHoursDropdownValue: {
                    id: data.min_hrs_flx,
                    description: data.min_hrs_flx,
                  },
                  editBreakTimeLimitFlex: {
                    id: data.break_time_flx,
                    description: data.break_time_flx,
                  },
                });
              } else {
                this.editIsFlexibleDiv = false;
                this.editDropDownsForm.patchValue({
                  editStartTimeDropdownValue: {
                    id: data.work_start_time,
                    description: data.work_start_time,
                  },
                  editEndTimeDropdownValue: {
                    id: data.work_end_time,
                    description: data.work_end_time,
                  },
                  editCheckinTolerance: {
                    id: data.checkin_tolarence,
                    description: data.checkin_tolarence,
                  },
                  editBreakTimeLimit: {
                    id: data.break_time,
                    description: data.break_time,
                  },
                  editCheckInAfter: { id: null, description: "select" },
                  editCheckOutBefore: { id: null, description: "select" },
                  editTotalHoursDropdownValue: {
                    id: null,
                    description: "select",
                  },
                  editBreakTimeLimitFlex: { id: null, description: "select" },
                });
              }

              if (data.is_custom_work) {
                let exptest = data.work_days_exp.split(",");
                this.editWorkDayExp = [];
                this.managed = true;
                exptest.includes("Saturday.") === true
                  ? this.editWorkDayExp.push({
                      day: "SA",
                      day_name: "Saturday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "SA",
                      day_name: "Saturday.",
                      is_working: false,
                    });
                exptest.includes("Sunday.") === true
                  ? this.editWorkDayExp.push({
                      day: "SU",
                      day_name: "Sunday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "SU",
                      day_name: "Sunday.",
                      is_working: false,
                    });
                exptest.includes("Monday.") === true
                  ? this.editWorkDayExp.push({
                      day: "MO",
                      day_name: "Monday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "MO",
                      day_name: "Monday.",
                      is_working: false,
                    });
                exptest.includes("Tuesday.") === true
                  ? this.editWorkDayExp.push({
                      day: "TU",
                      day_name: "Tuesday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "TU",
                      day_name: "Tuesday.",
                      is_working: false,
                    });
                exptest.includes("Wednesday.") === true
                  ? this.editWorkDayExp.push({
                      day: "WE",
                      day_name: "Wednesday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "WE",
                      day_name: "Wednesday.",
                      is_working: false,
                    });
                exptest.includes("Thursday.") === true
                  ? this.editWorkDayExp.push({
                      day: "TH",
                      day_name: "Thursday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "TH",
                      day_name: "Thursday.",
                      is_working: false,
                    });
                exptest.includes("Friday.") === true
                  ? this.editWorkDayExp.push({
                      day: "FR",
                      day_name: "Friday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "FR",
                      day_name: "Friday.",
                      is_working: false,
                    });

                let expday = [];
                // saturday exp
                if (data.saturday_exp) {
                  expday = data.saturday_exp.split(",");
                  if (expday[0] == true) {
                    this.editDropDownsForm.patchValue({
                      wsasa: { id: expday[1], description: expday[1] },
                      websa: { id: expday[2], description: expday[2] },
                      misa: { id: expday[3], description: expday[3] },
                      btlsa: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.editDropDownsForm.patchValue({
                      StartSaturday: { id: expday[1], description: expday[1] },
                      EndSaturday: { id: expday[2], description: expday[2] },
                      tosa: { id: expday[3], description: expday[3] },
                      btlsa: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                // sunday exp
                if (data.sunday_exp) {
                  expday = data.sunday_exp.split(",");
                  if (expday[0] == true) {
                    this.editDropDownsForm.patchValue({
                      wsasu: { id: expday[1], description: expday[1] },
                      websu: { id: expday[2], description: expday[2] },
                      misu: { id: expday[3], description: expday[3] },
                      btlsu: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.editDropDownsForm.patchValue({
                      StartSunday: { id: expday[1], description: expday[1] },
                      EndSunday: { id: expday[2], description: expday[2] },
                      tosu: { id: expday[3], description: expday[3] },
                      btlsu: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                //monday exp
                if (data.monday_exp) {
                  expday = data.monday_exp.split(",");
                  if (expday[0] == true) {
                    this.editDropDownsForm.patchValue({
                      wsamo: { id: expday[1], description: expday[1] },
                      webmo: { id: expday[2], description: expday[2] },
                      mismo: { id: expday[3], description: expday[3] },
                      btlmo: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.editDropDownsForm.patchValue({
                      StartMonday: { id: expday[1], description: expday[1] },
                      EndMonday: { id: expday[2], description: expday[2] },
                      tomo: { id: expday[3], description: expday[3] },
                      btlmo: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                //tuesday exp
                if (data.tuesday_exp) {
                  expday = data.tuesday_exp.split(",");
                  if (expday[0] == true) {
                    this.editDropDownsForm.patchValue({
                      wsatu: { id: expday[1], description: expday[1] },
                      webtu: { id: expday[2], description: expday[2] },
                      mistu: { id: expday[3], description: expday[3] },
                      btltu: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.editDropDownsForm.patchValue({
                      StartTuesday: { id: expday[1], description: expday[1] },
                      EndTuesday: { id: expday[2], description: expday[2] },
                      totu: { id: expday[3], description: expday[3] },
                      btltu: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                // wednesday exp
                if (data.wednesday_exp) {
                  expday = data.wednesday_exp.split(",");
                  if (expday[0] == true) {
                    this.editDropDownsForm.patchValue({
                      wsawe: { id: expday[1], description: expday[1] },
                      webwe: { id: expday[2], description: expday[2] },
                      miswe: { id: expday[3], description: expday[3] },
                      btlwe: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.editDropDownsForm.patchValue({
                      StartWednesday: { id: expday[1], description: expday[1] },
                      EndWednesday: { id: expday[2], description: expday[2] },
                      towe: { id: expday[3], description: expday[3] },
                      btlwe: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                // thursday exp
                if (data.thursday_exp) {
                  expday = data.thursday_exp.split(",");
                  if (expday[0] == true) {
                    this.editDropDownsForm.patchValue({
                      wsath: { id: expday[1], description: expday[1] },
                      webth: { id: expday[2], description: expday[2] },
                      misth: { id: expday[3], description: expday[3] },
                      btlth: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.editDropDownsForm.patchValue({
                      StartThursday: { id: expday[1], description: expday[1] },
                      EndThursday: { id: expday[2], description: expday[2] },
                      toth: { id: expday[3], description: expday[3] },
                      btlth: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                //friday exp
                if (data.friday_exp) {
                  expday = data.friday_exp.split(",");
                  if (expday[0] == true) {
                    this.editDropDownsForm.patchValue({
                      wsafr: { id: expday[1], description: expday[1] },
                      webfr: { id: expday[2], description: expday[2] },
                      misfr: { id: expday[3], description: expday[3] },
                      btlfr: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.editDropDownsForm.patchValue({
                      StartFriday: { id: expday[1], description: expday[1] },
                      EndFriday: { id: expday[2], description: expday[2] },
                      tofr: { id: expday[3], description: expday[3] },
                      btlfr: { id: expday[4], description: expday[4] },
                    });
                  }
                }
              } else {
                this.managed = false;
              }

              if (data.time_zone !== null) {
                this.editDropDownsForm.patchValue({
                  editTimeZoneDropdownValue: {
                    id: data.time_zone,
                    description: data.time_zone,
                  },
                });
              } else {
                //get current time zone
                let tz = moment.tz.guess();
                this.editDropDownsForm.patchValue({
                  editTimeZoneDropdownValue: {
                    id: tz + " (GMT" + moment.tz(tz).format("Z") + ")",
                    description: tz + " (GMT" + moment.tz(tz).format("Z") + ")",
                  },
                });
              }

              if (data.time_format !== null) {
                this.editDropDownsForm.patchValue({
                  editTimeFormatDropdownValue: {
                    id: data.time_format,
                    description: data.time_format,
                  },
                });
              } else {
                this.editDropDownsForm.patchValue({
                  editTimeFormatDropdownValue: {
                    id: "12Hrs",
                    description: "12Hrs",
                  },
                });
              }
            }
          });
        } else {
          this.editDropDownsForm.patchValue({
            editTeamDropdownValue: {
              id: this.currentEmployeeData.team_id,
              description: this.currentTeamName,
            },
          });
        }
      });
    } else {
      if (this.editDropDownsForm.value.workSettings == "Team Settings") {
        this.editDropDownsForm.patchValue({
          workSettings: "Individual Settings",
        });
        this.selectededitedWorkSettings({ value: "Individual Settings" });
        Swal.fire(
          "Work Days Settings!",
          "The Work Days Settings has been changed back to Individual Settings",
          "info"
        );
      }
    }
  }

  changededitLeaveProfileType(e) {
    //console.log(e)
    if (e.value.description === "No Leave Profile") {
      this.editlProfEffectiveDateDiv = false;
      this.FindByOrgId(
        this.editEmployeeLeaveForm.controls["editJoinedDate"].value
      );
      console.log("triger starts here changededitLeaveProfileType 1");
      this.editSetProfileEffectiveDate(
        this.editEmployeeLeaveForm.controls["editJoinedDate"].value
      );

      (this.isNewProfile = false), (this.isChangeProfile = false);
    } else {
      Swal.fire({
        title: "Alert",
        text: "The new availability will be inline in with the new profile selected",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.value === true) {
          this.editlProfEffectiveDateDiv = true;
          this.isNewProfile = false;
          this.isChangeProfile = true;
          this.FindByOrgId(
            this.editEmployeeLeaveForm.controls["editJoinedDate"].value
          );
          console.log("triger starts here changededitLeaveProfileType 2");
          this.editSetProfileEffectiveDate(
            this.editEmployeeLeaveForm.controls["editJoinedDate"].value
          );
        } else {
          this.editEmployeeLeaveForm.patchValue({
            editleaveProfileDropdownValue: {
              id: this.currentEmployeeData.leave_profile_setup_id,
              description: this.currentLeaveName,
            },
          });
        }
      });
    }
  }

  backAllEmpMain() {
    this.allEmployeeGrid = true;
    this.singleEmployeeEdit = false;
    this.singleEmployeeAdd = false;
    let args = { tab: { textLabel: "All Members" } };
    this.changeTeam(args);
  }
  //single team edit ends

  //employee delete
  empDelete(data) {
    if (this.deleteSectionFullAccess) {
      console.log(data);
      Swal.fire({
        title: "Delete " + data.full_name + " ?",
        text: "Please Note this action cannot be reverted",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: " Confirm",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.value === true) {
          this.finalDelete(data);
        }
      });
    } else {
      let postData = {
        id: data.id,
      };
      this.empService.getEmployeeByID(postData).subscribe((data: any) => {
        if (data) {
          let properdata = data;
          properdata["approver1_roleId"] = this.deleteApprover1Value;
          properdata["approver2_roleId"] = this.deletedualApprovalDiv
            ? this.deleteApprover2Value
            : null;
          properdata["is_emp_deleted"] = true;
          properdata["emp_id"] = data.id;
          properdata["update_status"] = "Pending";
          delete properdata["id"];
          this.currentDeleteEmpData = properdata;
          this.callDeleteRequestModel();
        }
      });
    }
  }

  finalDelete(data) {
    this.spinner.show();
    let postData = { id: data.id };
    this.empService.delEmp(postData).subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.getEmployeeByOrgId();
          this.toast.success(data["desc"], undefined, {
            positionClass: "toast-top-center",
          });
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        Swal.fire("Error!", error, "error");
      }
    );
    let post = { emp_id: data.id, is_deleted: true };
    this.empService.UpdateEmployeeExtensionByempId(post).subscribe(
      (data: any) => {},
      (error) => {
        this.spinner.hide();
        Swal.fire("Error!", error, "error");
      }
    );

    this.empService.DeleteDocumentByEmpId({ emp_id: data.id }).subscribe(
      (data: any) => {
        console.log("deleted the files of the employee");
      },
      (error) => {
        this.spinner.hide();
        Swal.fire("Error!", error, "error");
      }
    );
  }

  callDeleteRequestModel() {
    console.log("data for deletion", this.currentDeleteEmpData);
    this.modalService.open(this.employeeDeleteRequest);
  }

  closeDeleteRequestModelt() {
    this.modalService.dismissAll();
  }

  callDeleteFinalEmployeeRequest() {
    this.spinner.show();
    this.empService
      .AddEmployeeDetailsOverride(this.currentDeleteEmpData)
      .subscribe((data: any) => {
        if (data.status == 200) {
          this.toast.success(
            "Employee Delete Request had send to the Approver",
            undefined,
            {
              positionClass: "toast-top-center",
            }
          );
        } else {
          Swal.fire("Error!", data["result"].desc, "error");
        }
        this.spinner.hide();
        this.closeDeleteRequestModelt();
      });
  }

  //employee delete

  //Adding the employee bulk upadte funtion!

  bulkEmployeeUpdate() {
    console.log("We are at the buk upload");
    this.modalService.open(this.bulkupdate);
  }
  cancelBulk() {
    this.modalService.dismissAll();
  }

  //single employee add start
  addNewEmployee() {
    //initialize form control
    this.addEmployeeFormInputs();
    this.InputeditWorkDayExp();
    this.addEmployeeLeaveFormInputs();
    this.addDropDownFormInputs();
    //set values for dropdown
    this.addDropDownPatchValue();
    //set values for dropdown
    this.allEmployeeGrid = false;
    this.singleEmployeeAdd = true;
    this.singleEmployeeEdit = false;
    this.showAddDelegate = false;
    //drop down data
    this.getAllTeamByOrg();
    this.GetEmployeeRoleByOrgID();
    this.GetEmployeeStatusByOrgID();
    this.GetEmployeeTypeByOrgID();
    this.GetAllLeaveProfileSetupByOrgID();
    this.getAllTimeZone();
    this.callDaysandTiming();
    //drop down data
    this.addNewEmployeeLeaveForm.patchValue({
      aJoinedDate: moment().format("ll"),
    });
    this.addDropDownsForm.patchValue({
      addStatusDropdownValue: {
        id: "42bc21d9-60fd-47f3-b2a8-0061b9f2e15d",
        description: "In Service",
      },
      workLocDropdownValue: "Onshore",
    });

    let getFormData = this.addNewEmployeeLeaveForm.value;
    this.FindByOrgId(getFormData.aJoinedDate);
    this.setProfileEffectiveDate(getFormData.aJoinedDate);

    //This code is for loading the organisation setting
    //now its stored as Hard code.
    this.setWorkDetailsByOrgData();
  }

  //Change the working days settings to the organisation!!!
  setWorkDetailsByOrgData() {
    let data = {
      id: "2358dd4a-1dc9-4c55-82f6-bd48b1cb3ed1",
      org_id: "44919b38-176e-45ce-9b12-db5faef620d6",
      team_name: "Enforce",
      team_by: "Sazid Khan",
      team_desc: "Enforce technology",
      team_department_id: null,
      team_lead_empid: null,
      created_date: "11/03/2021 14:12:30",
      createdby: "Sazid Khan",
      modified_date: "08/08/2023 17:15:09",
      modifiedby: null,
      is_deleted: false,
      working_days: "Sunday,Monday,Tuesday,Wednesday,Thursday",
      working_hours: null,
      work_start_time: "8:00 AM",
      work_end_time: "5:00 PM",
      time_zone: null,
      time_format: null,
      created_by_empId: null,
      modified_by_empId: "a7195be8-b585-49ca-8b4e-f5bc875e9753",
      is_flexible: false,
      work_days_exp: "Friday.",
      saturday_exp: "",
      sunday_exp: "",
      monday_exp: "",
      tuesday_exp: "",
      wednesday_exp: "",
      thursday_exp: "",
      friday_exp: "false,8:00 AM,1:00 PM,9:30 AM,0 min",
      checkin_tolarence: "9:30 AM",
      break_time: "30 min",
      break_time_flx: null,
      is_custom_work: true,
      checkin_after: null,
      checkout_before: null,
      min_hrs: null,
      min_hrs_flx: null,
    };

    let teamValue = data;

    if (teamValue.working_days !== null) {
      let testData = teamValue.working_days.split(",");
      this.WorkdaysData = [];
      testData.includes("Saturday") === true
        ? this.WorkdaysData.push({
            day: "SA",
            day_name: "Saturday",
            is_working: true,
          })
        : this.WorkdaysData.push({
            day: "SA",
            day_name: "Saturday",
            is_working: false,
          });
      testData.includes("Sunday") === true
        ? this.WorkdaysData.push({
            day: "SU",
            day_name: "Sunday",
            is_working: true,
          })
        : this.WorkdaysData.push({
            day: "SU",
            day_name: "Sunday",
            is_working: false,
          });
      testData.includes("Monday") === true
        ? this.WorkdaysData.push({
            day: "MO",
            day_name: "Monday",
            is_working: true,
          })
        : this.WorkdaysData.push({
            day: "MO",
            day_name: "Monday",
            is_working: false,
          });
      testData.includes("Tuesday") === true
        ? this.WorkdaysData.push({
            day: "TU",
            day_name: "Tuesday",
            is_working: true,
          })
        : this.WorkdaysData.push({
            day: "TU",
            day_name: "Tuesday",
            is_working: false,
          });
      testData.includes("Wednesday") === true
        ? this.WorkdaysData.push({
            day: "WE",
            day_name: "Wednesday",
            is_working: true,
          })
        : this.WorkdaysData.push({
            day: "WE",
            day_name: "Wednesday",
            is_working: false,
          });
      testData.includes("Thursday") === true
        ? this.WorkdaysData.push({
            day: "TH",
            day_name: "Thursday",
            is_working: true,
          })
        : this.WorkdaysData.push({
            day: "TH",
            day_name: "Thursday",
            is_working: false,
          });
      testData.includes("Friday") === true
        ? this.WorkdaysData.push({
            day: "FR",
            day_name: "Friday",
            is_working: true,
          })
        : this.WorkdaysData.push({
            day: "FR",
            day_name: "Friday",
            is_working: false,
          });
    } else {
      this.WorkdaysData = [
        {
          day: "SA",
          day_name: "Saturday",
          is_working: false,
        },
        {
          day: "SU",
          day_name: "Sunday",
          is_working: true,
        },
        {
          day: "MO",
          day_name: "Monday",
          is_working: true,
        },
        {
          day: "TU",
          day_name: "Tuesday",
          is_working: true,
        },
        {
          day: "WE",
          day_name: "Wednesday",
          is_working: true,
        },
        {
          day: "TH",
          day_name: "Thursday",
          is_working: true,
        },
        {
          day: "FR",
          day_name: "Friday",
          is_working: false,
        },
      ];
    }

    if (data.is_flexible === true) {
      this.editIsFlexibleDiv = true;
      this.addDropDownsForm.patchValue({
        startTimeDropdownValue: { id: null, description: "select" },
        endTimeDropdownValue: { id: null, description: "select" },
        addCheckinTolerance: { id: null, description: "select" },
        addBreakTimeLimit: { id: null, description: "select" },
        editCheckInAfter: {
          id: data.checkin_after,
          description: data.checkin_after,
        },
        editCheckOutBefore: {
          id: data.checkout_before,
          description: data.checkout_before,
        },
        editTotalHoursDropdownValue: {
          id: data.min_hrs_flx,
          description: data.min_hrs_flx,
        },
        editBreakTimeLimitFlex: {
          id: data.break_time_flx,
          description: data.break_time_flx,
        },
      });
    } else {
      this.addDropDownsForm.patchValue({
        startTimeDropdownValue: {
          id: data.work_start_time,
          description: data.work_start_time,
        },
        endTimeDropdownValue: {
          id: data.work_end_time,
          description: data.work_end_time,
        },
        addCheckinTolerance: {
          id: data.checkin_tolarence,
          description: data.checkin_tolarence,
        },
        addBreakTimeLimit: {
          id: data.break_time,
          description: data.break_time,
        },
        editCheckInAfter: { id: null, description: "select" },
        editCheckOutBefore: { id: null, description: "select" },
        editTotalHoursDropdownValue: { id: null, description: "select" },
        editBreakTimeLimitFlex: { id: null, description: "select" },
      });
    }

    if (data.is_custom_work) {
      let exptest = data.work_days_exp.split(",");
      this.editWorkDayExp = [];
      this.managed = true;
      exptest.includes("Saturday.") === true
        ? this.editWorkDayExp.push({
            day: "SA",
            day_name: "Saturday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "SA",
            day_name: "Saturday.",
            is_working: false,
          });
      exptest.includes("Sunday.") === true
        ? this.editWorkDayExp.push({
            day: "SU",
            day_name: "Sunday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "SU",
            day_name: "Sunday.",
            is_working: false,
          });
      exptest.includes("Monday.") === true
        ? this.editWorkDayExp.push({
            day: "MO",
            day_name: "Monday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "MO",
            day_name: "Monday.",
            is_working: false,
          });
      exptest.includes("Tuesday.") === true
        ? this.editWorkDayExp.push({
            day: "TU",
            day_name: "Tuesday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "TU",
            day_name: "Tuesday.",
            is_working: false,
          });
      exptest.includes("Wednesday.") === true
        ? this.editWorkDayExp.push({
            day: "WE",
            day_name: "Wednesday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "WE",
            day_name: "Wednesday.",
            is_working: false,
          });
      exptest.includes("Thursday.") === true
        ? this.editWorkDayExp.push({
            day: "TH",
            day_name: "Thursday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "TH",
            day_name: "Thursday.",
            is_working: false,
          });
      exptest.includes("Friday.") === true
        ? this.editWorkDayExp.push({
            day: "FR",
            day_name: "Friday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "FR",
            day_name: "Friday.",
            is_working: false,
          });

      let expday = [];
      if (data.saturday_exp) {
        expday = data.saturday_exp.split(",");
        if (expday[0] == true) {
          this.addDropDownsForm.patchValue({
            wsasa: { id: expday[1], description: expday[1] },
            websa: { id: expday[2], description: expday[2] },
            misa: { id: expday[3], description: expday[3] },
            btlsa: { id: expday[4], description: expday[4] },
          });
        } else {
          this.addDropDownsForm.patchValue({
            StartSaturday: { id: expday[1], description: expday[1] },
            EndSaturday: { id: expday[2], description: expday[2] },
            tosa: { id: expday[3], description: expday[3] },
            btlsa: { id: expday[4], description: expday[4] },
          });
        }
      }
      // sunday exp
      if (data.sunday_exp) {
        expday = data.sunday_exp.split(",");
        if (expday[0] == true) {
          this.addDropDownsForm.patchValue({
            wsasu: { id: expday[1], description: expday[1] },
            websu: { id: expday[2], description: expday[2] },
            misu: { id: expday[3], description: expday[3] },
            btlsu: { id: expday[4], description: expday[4] },
          });
        } else {
          this.addDropDownsForm.patchValue({
            StartSunday: { id: expday[1], description: expday[1] },
            EndSunday: { id: expday[2], description: expday[2] },
            tosu: { id: expday[3], description: expday[3] },
            btlsu: { id: expday[4], description: expday[4] },
          });
        }
      }
      //monday exp
      if (data.monday_exp) {
        expday = data.monday_exp.split(",");
        if (expday[0] == true) {
          this.addDropDownsForm.patchValue({
            wsamo: { id: expday[1], description: expday[1] },
            webmo: { id: expday[2], description: expday[2] },
            mismo: { id: expday[3], description: expday[3] },
            btlmo: { id: expday[4], description: expday[4] },
          });
        } else {
          this.addDropDownsForm.patchValue({
            StartMonday: { id: expday[1], description: expday[1] },
            EndMonday: { id: expday[2], description: expday[2] },
            tomo: { id: expday[3], description: expday[3] },
            btlmo: { id: expday[4], description: expday[4] },
          });
        }
      }
      //tuesday exp
      if (data.tuesday_exp) {
        expday = data.tuesday_exp.split(",");
        if (expday[0] == true) {
          this.addDropDownsForm.patchValue({
            wsatu: { id: expday[1], description: expday[1] },
            webtu: { id: expday[2], description: expday[2] },
            mistu: { id: expday[3], description: expday[3] },
            btltu: { id: expday[4], description: expday[4] },
          });
        } else {
          this.addDropDownsForm.patchValue({
            StartTuesday: { id: expday[1], description: expday[1] },
            EndTuesday: { id: expday[2], description: expday[2] },
            totu: { id: expday[3], description: expday[3] },
            btltu: { id: expday[4], description: expday[4] },
          });
        }
      }
      // wednesday exp
      if (data.wednesday_exp) {
        expday = data.wednesday_exp.split(",");
        if (expday[0] == true) {
          this.addDropDownsForm.patchValue({
            wsawe: { id: expday[1], description: expday[1] },
            webwe: { id: expday[2], description: expday[2] },
            miswe: { id: expday[3], description: expday[3] },
            btlwe: { id: expday[4], description: expday[4] },
          });
        } else {
          this.addDropDownsForm.patchValue({
            StartWednesday: { id: expday[1], description: expday[1] },
            EndWednesday: { id: expday[2], description: expday[2] },
            towe: { id: expday[3], description: expday[3] },
            btlwe: { id: expday[4], description: expday[4] },
          });
        }
      }
      // thursday exp
      if (data.thursday_exp) {
        expday = data.thursday_exp.split(",");
        if (expday[0] == true) {
          this.addDropDownsForm.patchValue({
            wsath: { id: expday[1], description: expday[1] },
            webth: { id: expday[2], description: expday[2] },
            misth: { id: expday[3], description: expday[3] },
            btlth: { id: expday[4], description: expday[4] },
          });
        } else {
          this.addDropDownsForm.patchValue({
            StartThursday: { id: expday[1], description: expday[1] },
            EndThursday: { id: expday[2], description: expday[2] },
            toth: { id: expday[3], description: expday[3] },
            btlth: { id: expday[4], description: expday[4] },
          });
        }
      }
      //friday exp
      if (data.friday_exp) {
        expday = data.friday_exp.split(",");
        if (expday[0] == true) {
          this.addDropDownsForm.patchValue({
            wsafr: { id: expday[1], description: expday[1] },
            webfr: { id: expday[2], description: expday[2] },
            misfr: { id: expday[3], description: expday[3] },
            btlfr: { id: expday[4], description: expday[4] },
          });
        } else {
          this.addDropDownsForm.patchValue({
            StartFriday: { id: expday[1], description: expday[1] },
            EndFriday: { id: expday[2], description: expday[2] },
            tofr: { id: expday[3], description: expday[3] },
            btlfr: { id: expday[4], description: expday[4] },
          });
        }
      }
    } else {
      this.managed = false;
    }

    this.addDropDownsForm.patchValue({ workSettings: "Organistaion Settings" });
    this.disableWork = true;
    this.addDropDownsForm
      .get("addFlexibleCheckbox")
      .disable({ onlySelf: true });
    this.addDropDownsForm.get("editCostomWorkDays").disable({ onlySelf: true });
    this.addDropDownsForm.get("saIsFlex").disable({ onlySelf: true });
    this.addDropDownsForm.get("suIsFlex").disable({ onlySelf: true });
    this.addDropDownsForm.get("moIsFlex").disable({ onlySelf: true });
    this.addDropDownsForm.get("tuIsFlex").disable({ onlySelf: true });
    this.addDropDownsForm.get("weIsFlex").disable({ onlySelf: true });
    this.addDropDownsForm.get("thIsFlex").disable({ onlySelf: true });
    this.addDropDownsForm.get("frIsFlex").disable({ onlySelf: true });
  }

  orgActiveWorkday;
  //Change the working days settings to the organisation!!!
  setEditWorkDetailsByOrgData() {
    this.OrganizationService.getWorkingHrsbyOrgId({
      orgID: localStorage.getItem("org_id"),
    }).subscribe((rsp: any) => {
      if (rsp.length > 0) {
        this.orgActiveWorkday = rsp.find((x) => x.is_active == 1);
        console.log("from organisation settings", this.orgActiveWorkday);
        this.fillworkdayData(this.orgActiveWorkday);
      } else {
        this.resetWorktime();
      }
    });

    // let data =
    // {
    //   "id": "2358dd4a-1dc9-4c55-82f6-bd48b1cb3ed1",
    //   "org_id": "44919b38-176e-45ce-9b12-db5faef620d6",
    //   "team_name": "Enforce",
    //   "team_by": "Sazid Khan",
    //   "team_desc": "Enforce technology",
    //   "team_department_id": null,
    //   "team_lead_empid": null,
    //   "created_date": "11/03/2021 14:12:30",
    //   "createdby": "Sazid Khan",
    //   "modified_date": "08/08/2023 17:15:09",
    //   "modifiedby": null,
    //   "is_deleted": false,
    //   "working_days": "Sunday,Monday,Tuesday,Wednesday,Thursday",
    //   "working_hours": null,
    //   "work_start_time": "8:00 AM",
    //   "work_end_time": "5:00 PM",
    //   "time_zone": null,
    //   "time_format": null,
    //   "created_by_empId": null,
    //   "modified_by_empId": "a7195be8-b585-49ca-8b4e-f5bc875e9753",
    //   "is_flexible": false,
    //   "work_days_exp": "Friday.",
    //   "saturday_exp": "",
    //   "sunday_exp": "",
    //   "monday_exp": "",
    //   "tuesday_exp": "",
    //   "wednesday_exp": "",
    //   "thursday_exp": "",
    //   "friday_exp": "false,8:00 AM,1:00 PM,9:30 AM,0 min",
    //   "checkin_tolarence": "9:30 AM",
    //   "break_time": "30 min",
    //   "break_time_flx": null,
    //   "is_custom_work": true,
    //   "checkin_after": null,
    //   "checkout_before": null,
    //   "min_hrs": null,
    //   "min_hrs_flx": null
    // }

    // if (data.working_days !== null) {
    //   let testData = data.working_days.split(",");
    //   this.editWorkdaysData = [];
    //   testData.includes("Saturday") === true
    //     ? this.editWorkdaysData.push({ day: "SA", day_name: "Saturday", is_working: true, })
    //     : this.editWorkdaysData.push({ day: "SA", day_name: "Saturday", is_working: false, });
    //   testData.includes("Sunday") === true
    //     ? this.editWorkdaysData.push({ day: "SU", day_name: "Sunday", is_working: true, })
    //     : this.editWorkdaysData.push({ day: "SU", day_name: "Sunday", is_working: false, });
    //   testData.includes("Monday") === true
    //     ? this.editWorkdaysData.push({ day: "MO", day_name: "Monday", is_working: true, })
    //     : this.editWorkdaysData.push({ day: "MO", day_name: "Monday", is_working: false, });
    //   testData.includes("Tuesday") === true
    //     ? this.editWorkdaysData.push({ day: "TU", day_name: "Tuesday", is_working: true, })
    //     : this.editWorkdaysData.push({ day: "TU", day_name: "Tuesday", is_working: false, });
    //   testData.includes("Wednesday") === true
    //     ? this.editWorkdaysData.push({ day: "WE", day_name: "Wednesday", is_working: true, })
    //     : this.editWorkdaysData.push({ day: "WE", day_name: "Wednesday", is_working: false, });
    //   testData.includes("Thursday") === true
    //     ? this.editWorkdaysData.push({ day: "TH", day_name: "Thursday", is_working: true, })
    //     : this.editWorkdaysData.push({ day: "TH", day_name: "Thursday", is_working: false, });
    //   testData.includes("Friday") === true
    //     ? this.editWorkdaysData.push({ day: "FR", day_name: "Friday", is_working: true, })
    //     : this.editWorkdaysData.push({ day: "FR", day_name: "Friday", is_working: false, });

    //   if (data.is_flexible === true) {
    //     this.editIsFlexibleDiv = true;
    //     this.editDropDownsForm.patchValue({
    //       editStartTimeDropdownValue: { id: null, description: "select", },
    //       editEndTimeDropdownValue: { id: null, description: "select", },
    //       editCheckinTolerance: { id: null, description: "select", },
    //       editBreakTimeLimit: { id: null, description: "select", },
    //       editCheckInAfter: { id: data.checkin_after, description: data.checkin_after, },
    //       editCheckOutBefore: { id: data.checkout_before, description: data.checkout_before, },
    //       editTotalHoursDropdownValue: { id: data.min_hrs_flx, description: data.min_hrs_flx, },
    //       editBreakTimeLimitFlex: { id: data.break_time_flx, description: data.break_time_flx, },
    //     });
    //   } else {
    //     this.editIsFlexibleDiv = false;
    //     this.editDropDownsForm.patchValue({
    //       editStartTimeDropdownValue: { id: data.work_start_time, description: data.work_start_time, },
    //       editEndTimeDropdownValue: { id: data.work_end_time, description: data.work_end_time, },
    //       editCheckinTolerance: { id: data.checkin_tolarence, description: data.checkin_tolarence, },
    //       editBreakTimeLimit: { id: data.break_time, description: data.break_time, },
    //       editCheckInAfter: { id: null, description: "select", },
    //       editCheckOutBefore: { id: null, description: "select", },
    //       editTotalHoursDropdownValue: { id: null, description: "select", },
    //       editBreakTimeLimitFlex: { id: null, description: "select", },
    //     });
    //   }

    //   if (data.is_custom_work) {
    //     let exptest = data.work_days_exp.split(",");
    //     this.editWorkDayExp = [];
    //     this.managed = true;
    //     exptest.includes("Saturday.") === true
    //       ? this.editWorkDayExp.push({ day: "SA", day_name: "Saturday.", is_working: true, })
    //       : this.editWorkDayExp.push({ day: "SA", day_name: "Saturday.", is_working: false, });
    //     exptest.includes("Sunday.") === true
    //       ? this.editWorkDayExp.push({ day: "SU", day_name: "Sunday.", is_working: true, })
    //       : this.editWorkDayExp.push({ day: "SU", day_name: "Sunday.", is_working: false, });
    //     exptest.includes("Monday.") === true
    //       ? this.editWorkDayExp.push({ day: "MO", day_name: "Monday.", is_working: true, })
    //       : this.editWorkDayExp.push({ day: "MO", day_name: "Monday.", is_working: false, });
    //     exptest.includes("Tuesday.") === true
    //       ? this.editWorkDayExp.push({ day: "TU", day_name: "Tuesday.", is_working: true, })
    //       : this.editWorkDayExp.push({ day: "TU", day_name: "Tuesday.", is_working: false, });
    //     exptest.includes("Wednesday.") === true
    //       ? this.editWorkDayExp.push({ day: "WE", day_name: "Wednesday.", is_working: true, })
    //       : this.editWorkDayExp.push({ day: "WE", day_name: "Wednesday.", is_working: false, });
    //     exptest.includes("Thursday.") === true
    //       ? this.editWorkDayExp.push({ day: "TH", day_name: "Thursday.", is_working: true, })
    //       : this.editWorkDayExp.push({ day: "TH", day_name: "Thursday.", is_working: false, });
    //     exptest.includes("Friday.") === true
    //       ? this.editWorkDayExp.push({ day: "FR", day_name: "Friday.", is_working: true, })
    //       : this.editWorkDayExp.push({ day: "FR", day_name: "Friday.", is_working: false, });

    //     let expday = [];
    //     // saturday exp
    //     console.log("error", data.saturday_exp)
    //     if (data.saturday_exp != null) {
    //       expday = data.saturday_exp.split(",");
    //       if (expday[0] == true) {
    //         this.editDropDownsForm.patchValue({
    //           wsasa: { id: expday[1], description: expday[1], },
    //           websa: { id: expday[2], description: expday[2], },
    //           misa: { id: expday[3], description: expday[3], },
    //           btlsa: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //       else {
    //         this.editDropDownsForm.patchValue({
    //           StartSaturday: { id: expday[1], description: expday[1], },
    //           EndSaturday: { id: expday[2], description: expday[2], },
    //           tosa: { id: expday[3], description: expday[3], },
    //           btlsa: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //     }
    //     // sunday exp
    //     if (data.sunday_exp != null) {
    //       expday = data.sunday_exp.split(",");
    //       if (expday[0] == true) {
    //         this.editDropDownsForm.patchValue({
    //           wsasu: { id: expday[1], description: expday[1], },
    //           websu: { id: expday[2], description: expday[2], },
    //           misu: { id: expday[3], description: expday[3], },
    //           btlsu: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //       else {
    //         this.editDropDownsForm.patchValue({
    //           StartSunday: { id: expday[1], description: expday[1], },
    //           EndSunday: { id: expday[2], description: expday[2], },
    //           tosu: { id: expday[3], description: expday[3], },
    //           btlsu: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //     }
    //     //monday exp
    //     if (data.monday_exp != null) {
    //       expday = data.monday_exp.split(",");
    //       if (expday[0] == true) {
    //         this.editDropDownsForm.patchValue({
    //           wsamo: { id: expday[1], description: expday[1], },
    //           webmo: { id: expday[2], description: expday[2], },
    //           mismo: { id: expday[3], description: expday[3], },
    //           btlmo: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //       else {
    //         this.editDropDownsForm.patchValue({
    //           StartMonday: { id: expday[1], description: expday[1], },
    //           EndMonday: { id: expday[2], description: expday[2], },
    //           tomo: { id: expday[3], description: expday[3], },
    //           btlmo: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //     }
    //     //tuesday exp
    //     if (data.tuesday_exp != null) {
    //       expday = data.tuesday_exp.split(",");
    //       if (expday[0] == true) {
    //         this.editDropDownsForm.patchValue({
    //           wsatu: { id: expday[1], description: expday[1], },
    //           webtu: { id: expday[2], description: expday[2], },
    //           mistu: { id: expday[3], description: expday[3], },
    //           btltu: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //       else {
    //         this.editDropDownsForm.patchValue({
    //           StartTuesday: { id: expday[1], description: expday[1], },
    //           EndTuesday: { id: expday[2], description: expday[2], },
    //           totu: { id: expday[3], description: expday[3], },
    //           btltu: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //     }
    //     // wednesday exp
    //     if (data.wednesday_exp != null) {
    //       expday = data.wednesday_exp.split(",");
    //       if (expday[0] == true) {
    //         this.editDropDownsForm.patchValue({
    //           wsawe: { id: expday[1], description: expday[1], },
    //           webwe: { id: expday[2], description: expday[2], },
    //           miswe: { id: expday[3], description: expday[3], },
    //           btlwe: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //       else {
    //         this.editDropDownsForm.patchValue({
    //           StartWednesday: { id: expday[1], description: expday[1], },
    //           EndWednesday: { id: expday[2], description: expday[2], },
    //           towe: { id: expday[3], description: expday[3], },
    //           btlwe: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //     }
    //     // thursday exp
    //     if (data.thursday_exp != null) {
    //       expday = data.thursday_exp.split(",");
    //       if (expday[0] == true) {
    //         this.editDropDownsForm.patchValue({
    //           wsath: { id: expday[1], description: expday[1], },
    //           webth: { id: expday[2], description: expday[2], },
    //           misth: { id: expday[3], description: expday[3], },
    //           btlth: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //       else {
    //         this.editDropDownsForm.patchValue({
    //           StartThursday: { id: expday[1], description: expday[1], },
    //           EndThursday: { id: expday[2], description: expday[2], },
    //           toth: { id: expday[3], description: expday[3], },
    //           btlth: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //     }
    //     //friday exp
    //     if (data.friday_exp != null) {
    //       expday = data.friday_exp.split(",");
    //       if (expday[0] == true) {
    //         this.editDropDownsForm.patchValue({
    //           wsafr: { id: expday[1], description: expday[1], },
    //           webfr: { id: expday[2], description: expday[2], },
    //           misfr: { id: expday[3], description: expday[3], },
    //           btlfr: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //       else {
    //         this.editDropDownsForm.patchValue({
    //           StartFriday: { id: expday[1], description: expday[1], },
    //           EndFriday: { id: expday[2], description: expday[2], },
    //           tofr: { id: expday[3], description: expday[3], },
    //           btlfr: { id: expday[4], description: expday[4], }
    //         });
    //       }
    //     }
    //   } else {
    //     this.managed = false;
    //   }

    // } else {
    //   //this.editPutOrganizationValues();
    // }
    // this.editDropDownsForm.patchValue({ workSettings: 'Organistaion Settings' });
    // this.disableWork = true;
    // this.editDropDownsForm.get('editFlexibleCheckbox').disable({ onlySelf: true });
    // this.editDropDownsForm.get('editCostomWorkDays').disable({ onlySelf: true });
    // this.editDropDownsForm.get('saIsFlex').disable({ onlySelf: true });
    // this.editDropDownsForm.get('suIsFlex').disable({ onlySelf: true });
    // this.editDropDownsForm.get('moIsFlex').disable({ onlySelf: true });
    // this.editDropDownsForm.get('tuIsFlex').disable({ onlySelf: true });
    // this.editDropDownsForm.get('weIsFlex').disable({ onlySelf: true });
    // this.editDropDownsForm.get('thIsFlex').disable({ onlySelf: true });
    // this.editDropDownsForm.get('frIsFlex').disable({ onlySelf: true });
  }

  fillworkdayData(data) {
    let empstartdate = moment(
      this.editDropDownsForm.get("wrkProfileEffectiveDay").value
    );
    this.resetWorktime();
    let orgstartdate = moment(data.effective_startday);

    if (empstartdate.isBefore(orgstartdate)) {
      this.editDropDownsForm.patchValue({
        wrkProfileEffectiveDay: orgstartdate.format("ll"),
      });
      this.minDate = orgstartdate.toDate();
    } else {
      this.editDropDownsForm.patchValue({
        wrkProfileEffectiveDay: empstartdate.format("ll"),
      });
      this.minDate = empstartdate.toDate();
    }

    if (data.working_days !== null) {
      let testData = data.working_days.split(",");
      this.editWorkdaysData = [];
      testData.includes("Saturday") === true
        ? this.editWorkdaysData.push({
            day: "SA",
            day_name: "Saturday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "SA",
            day_name: "Saturday",
            is_working: false,
          });
      testData.includes("Sunday") === true
        ? this.editWorkdaysData.push({
            day: "SU",
            day_name: "Sunday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "SU",
            day_name: "Sunday",
            is_working: false,
          });
      testData.includes("Monday") === true
        ? this.editWorkdaysData.push({
            day: "MO",
            day_name: "Monday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "MO",
            day_name: "Monday",
            is_working: false,
          });
      testData.includes("Tuesday") === true
        ? this.editWorkdaysData.push({
            day: "TU",
            day_name: "Tuesday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "TU",
            day_name: "Tuesday",
            is_working: false,
          });
      testData.includes("Wednesday") === true
        ? this.editWorkdaysData.push({
            day: "WE",
            day_name: "Wednesday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "WE",
            day_name: "Wednesday",
            is_working: false,
          });
      testData.includes("Thursday") === true
        ? this.editWorkdaysData.push({
            day: "TH",
            day_name: "Thursday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "TH",
            day_name: "Thursday",
            is_working: false,
          });
      testData.includes("Friday") === true
        ? this.editWorkdaysData.push({
            day: "FR",
            day_name: "Friday",
            is_working: true,
          })
        : this.editWorkdaysData.push({
            day: "FR",
            day_name: "Friday",
            is_working: false,
          });

      if (data.is_flexible === true) {
        this.editIsFlexibleDiv = true;
        this.editDropDownsForm.patchValue({
          editStartTimeDropdownValue: { id: null, description: "select" },
          editEndTimeDropdownValue: { id: null, description: "select" },
          editCheckinTolerance: { id: null, description: "select" },
          editBreakTimeLimit: { id: null, description: "select" },
          editCheckInAfter: {
            id: data.checkin_after,
            description: data.checkin_after,
          },
          editCheckOutBefore: {
            id: data.checkout_before,
            description: data.checkout_before,
          },
          editTotalHoursDropdownValue: {
            id: data.min_hrs_flx,
            description: data.min_hrs_flx,
          },
          editBreakTimeLimitFlex: {
            id: data.break_time_flx,
            description: data.break_time_flx,
          },
          editLessHourTolerance: {
            id: data.less_hour_tolerance,
            description: data.less_hour_tolerance,
          },
        });
      } else {
        this.editIsFlexibleDiv = false;
        this.editDropDownsForm.patchValue({
          editStartTimeDropdownValue: {
            id: data.work_start_time,
            description: data.work_start_time,
          },
          editEndTimeDropdownValue: {
            id: data.work_end_time,
            description: data.work_end_time,
          },
          editCheckinTolerance: {
            id: data.checkin_tolarence,
            description: data.checkin_tolarence,
          },
          editBreakTimeLimit: {
            id: data.break_time,
            description: data.break_time,
          },
          editCheckInAfter: { id: null, description: "select" },
          editCheckOutBefore: { id: null, description: "select" },
          editTotalHoursDropdownValue: { id: null, description: "select" },
          editBreakTimeLimitFlex: { id: null, description: "select" },
          editWorkingHours: this.calculateTimeDifference(
            data.work_start_time,
            data.work_end_time
          ),
          editadjustedCheckoutTime: this.addTimePeriod(
            data.checkin_tolarence,
            this.calculateTimeDifference(
              data.work_start_time,
              data.work_end_time
            )
          ),
          editLessHourTolerance: {
            id: data.less_hour_tolerance,
            description: data.less_hour_tolerance,
          },
        });
      }

      console.log("before the exp", this.editWorkDayExp);

      if (data.is_custom_work) {
        let exptest = data.wroking_days_exp.split(",");
        console.log("working days exp", data.wroking_days_exp);
        console.log("working days exptest", exptest);

        this.editWorkDayExp = [];
        this.managed = true;
        exptest.includes("Saturday.") === true
          ? this.editWorkDayExp.push({
              day: "SA",
              day_name: "Saturday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "SA",
              day_name: "Saturday.",
              is_working: false,
            });
        exptest.includes("Sunday.") === true
          ? this.editWorkDayExp.push({
              day: "SU",
              day_name: "Sunday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "SU",
              day_name: "Sunday.",
              is_working: false,
            });
        exptest.includes("Monday.") === true
          ? this.editWorkDayExp.push({
              day: "MO",
              day_name: "Monday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "MO",
              day_name: "Monday.",
              is_working: false,
            });
        exptest.includes("Tuesday.") === true
          ? this.editWorkDayExp.push({
              day: "TU",
              day_name: "Tuesday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "TU",
              day_name: "Tuesday.",
              is_working: false,
            });
        exptest.includes("Wednesday.") === true
          ? this.editWorkDayExp.push({
              day: "WE",
              day_name: "Wednesday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "WE",
              day_name: "Wednesday.",
              is_working: false,
            });
        exptest.includes("Thursday.") === true
          ? this.editWorkDayExp.push({
              day: "TH",
              day_name: "Thursday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "TH",
              day_name: "Thursday.",
              is_working: false,
            });
        exptest.includes("Friday.") === true
          ? this.editWorkDayExp.push({
              day: "FR",
              day_name: "Friday.",
              is_working: true,
            })
          : this.editWorkDayExp.push({
              day: "FR",
              day_name: "Friday.",
              is_working: false,
            });

        console.log("after the exp", this.editWorkDayExp);

        let expday = [];
        // saturday exp
        if (data.saturday_exp != null && data.saturday_exp != "") {
          expday = data.saturday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsasa: { id: expday[1], description: expday[1] },
              websa: { id: expday[2], description: expday[2] },
              misa: { id: expday[3], description: expday[3] },
              btlsa: { id: expday[4], description: expday[4] },
              lhtsa: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartSaturday: { id: expday[1], description: expday[1] },
              EndSaturday: { id: expday[2], description: expday[2] },
              tosa: { id: expday[3], description: expday[3] },
              btlsa: { id: expday[4], description: expday[4] },
              lhtsa: { id: expday[5], description: expday[5] },
              actsa: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whsa: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        // sunday exp
        if (data.sunday_exp != null && data.sunday_exp != "") {
          expday = data.sunday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsasu: { id: expday[1], description: expday[1] },
              websu: { id: expday[2], description: expday[2] },
              misu: { id: expday[3], description: expday[3] },
              btlsu: { id: expday[4], description: expday[4] },
              lhtsu: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartSunday: { id: expday[1], description: expday[1] },
              EndSunday: { id: expday[2], description: expday[2] },
              tosu: { id: expday[3], description: expday[3] },
              btlsu: { id: expday[4], description: expday[4] },
              lhtsu: { id: expday[5], description: expday[5] },
              actsu: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whsu: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        //monday exp
        if (data.monday_exp != null && data.monday_exp != "") {
          expday = data.monday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsamo: { id: expday[1], description: expday[1] },
              webmo: { id: expday[2], description: expday[2] },
              mismo: { id: expday[3], description: expday[3] },
              btlmo: { id: expday[4], description: expday[4] },
              lhtmo: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartMonday: { id: expday[1], description: expday[1] },
              EndMonday: { id: expday[2], description: expday[2] },
              tomo: { id: expday[3], description: expday[3] },
              btlmo: { id: expday[4], description: expday[4] },
              lhtmo: { id: expday[5], description: expday[5] },
              actmo: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whmo: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        //tuesday exp
        if (data.tuesday_exp != null && data.tuesday_exp != "") {
          expday = data.tuesday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsatu: { id: expday[1], description: expday[1] },
              webtu: { id: expday[2], description: expday[2] },
              mistu: { id: expday[3], description: expday[3] },
              btltu: { id: expday[4], description: expday[4] },
              lhttu: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartTuesday: { id: expday[1], description: expday[1] },
              EndTuesday: { id: expday[2], description: expday[2] },
              totu: { id: expday[3], description: expday[3] },
              btltu: { id: expday[4], description: expday[4] },
              lhttu: { id: expday[5], description: expday[5] },
              acttu: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whtu: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        // wednesday exp
        if (data.wednesday_exp != null && data.wednesday_exp != "") {
          expday = data.wednesday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsawe: { id: expday[1], description: expday[1] },
              webwe: { id: expday[2], description: expday[2] },
              miswe: { id: expday[3], description: expday[3] },
              btlwe: { id: expday[4], description: expday[4] },
              lhtwe: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartWednesday: { id: expday[1], description: expday[1] },
              EndWednesday: { id: expday[2], description: expday[2] },
              towe: { id: expday[3], description: expday[3] },
              btlwe: { id: expday[4], description: expday[4] },
              lhtwe: { id: expday[5], description: expday[5] },
              actwe: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whwe: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        // thursday exp
        if (data.thursday_exp != null && data.thursday_exp != "") {
          expday = data.thursday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsath: { id: expday[1], description: expday[1] },
              webth: { id: expday[2], description: expday[2] },
              misth: { id: expday[3], description: expday[3] },
              btlth: { id: expday[4], description: expday[4] },
              lhtth: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartThursday: { id: expday[1], description: expday[1] },
              EndThursday: { id: expday[2], description: expday[2] },
              toth: { id: expday[3], description: expday[3] },
              btlth: { id: expday[4], description: expday[4] },
              lhtth: { id: expday[5], description: expday[5] },
              actth: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whth: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
        //friday exp
        if (data.friday_exp != null && data.friday_exp != "") {
          expday = data.friday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsafr: { id: expday[1], description: expday[1] },
              webfr: { id: expday[2], description: expday[2] },
              misfr: { id: expday[3], description: expday[3] },
              btlfr: { id: expday[4], description: expday[4] },
              lhtfr: { id: expday[5], description: expday[5] },
            });
          } else {
            this.editDropDownsForm.patchValue({
              StartFriday: { id: expday[1], description: expday[1] },
              EndFriday: { id: expday[2], description: expday[2] },
              tofr: { id: expday[3], description: expday[3] },
              btlfr: { id: expday[4], description: expday[4] },
              lhtfr: { id: expday[5], description: expday[5] },
              actfr: this.addTimePeriod(
                expday[3],
                this.calculateTimeDifference(expday[1], expday[2])
              ),
              whfr: this.calculateTimeDifference(expday[1], expday[2]),
            });
          }
        }
      } else {
        this.managed = false;
      }
    } else {
      //this.editPutOrganizationValues();
    }
  }

  resetWorktime() {
    this.editWorkdaysData = [];
    this.editWorkDayExp = [];
    this.editWorkdaysData.push(
      {
        day: "SA",
        day_name: "Saturday.",
        is_working: false,
      },
      {
        day: "SU",
        day_name: "Sunday.",
        is_working: false,
      },
      {
        day: "MO",
        day_name: "Monday.",
        is_working: false,
      },
      {
        day: "TU",
        day_name: "Tuesday.",
        is_working: false,
      },
      {
        day: "WE",
        day_name: "Wednesday.",
        is_working: false,
      },
      {
        day: "TH",
        day_name: "Thursday.",
        is_working: false,
      },
      {
        day: "FR",
        day_name: "Friday.",
        is_working: false,
      }
    );
    this.editWorkDayExp.push(
      {
        day: "SA",
        day_name: "Saturday.",
        is_working: false,
      },
      {
        day: "SU",
        day_name: "Sunday.",
        is_working: false,
      },
      {
        day: "MO",
        day_name: "Monday.",
        is_working: false,
      },
      {
        day: "TU",
        day_name: "Tuesday.",
        is_working: false,
      },
      {
        day: "WE",
        day_name: "Wednesday.",
        is_working: false,
      },
      {
        day: "TH",
        day_name: "Thursday.",
        is_working: false,
      },
      {
        day: "FR",
        day_name: "Friday.",
        is_working: false,
      }
    );
  }

  addNewEmployeeExtension() {}

  addDropDownPatchValue() {
    this.addDropDownsForm.patchValue({
      teamDropdownValue: {
        id: null,
        description: "Without Team",
      },
      roleDropdownValue: {
        id: null,
        description: "No Role",
      },
    });
  }

  callDaysandTiming() {
    this.workStartHoursData = [
      {
        id: null,
        description: "select",
      },
      {
        id: "6:00 AM",
        description: "6:00 AM",
      },
      {
        id: "6:30 AM",
        description: "6:30 AM",
      },
      {
        id: "7:00 AM",
        description: "7:00 AM",
      },
      {
        id: "7:30 AM",
        description: "7:30 AM",
      },
      {
        id: "8:00 AM",
        description: "8:00 AM",
      },
      {
        id: "8:30 AM",
        description: "8:30 AM",
      },
      {
        id: "9:00 AM",
        description: "9:00 AM",
      },
      {
        id: "9:30 AM",
        description: "9:30 AM",
      },
      {
        id: "10:00 AM",
        description: "10:00 AM",
      },
      {
        id: "10:30 AM",
        description: "10:30 AM",
      },
      {
        id: "11:00 AM",
        description: "11:00 AM",
      },
      {
        id: "11:30 AM",
        description: "11:30 AM",
      },
      {
        id: "12:00 PM",
        description: "12:00 PM",
      },
      {
        id: "12:30 PM",
        description: "12:30 PM",
      },
      {
        id: "1:00 PM",
        description: "1:00 PM",
      },
      {
        id: "1:30 PM",
        description: "1:30 PM",
      },
      {
        id: "2:00 PM",
        description: "2:00 PM",
      },
      {
        id: "2:30 PM",
        description: "2:30 PM",
      },
      {
        id: "3:00 PM",
        description: "3:00 PM",
      },
      {
        id: "3:30 PM",
        description: "3:30 PM",
      },
      {
        id: "4:00 PM",
        description: "4:00 PM",
      },
      {
        id: "4:30 PM",
        description: "4:30 PM",
      },
      {
        id: "5:00 PM",
        description: "5:00 PM",
      },
      {
        id: "5:30 PM",
        description: "5:30 PM",
      },
      {
        id: "6:00 PM",
        description: "6:00 PM",
      },
      {
        id: "6:30 PM",
        description: "6:30 PM",
      },
      {
        id: "7:00 PM",
        description: "7:00 PM",
      },
      {
        id: "7:30 PM",
        description: "7:30 PM",
      },
    ];
    this.workEndHoursData = [
      {
        id: null,
        description: "select",
      },
      {
        id: "12:00 PM",
        description: "12:00 PM",
      },
      {
        id: "12:30 PM",
        description: "12:30 PM",
      },
      {
        id: "1:00 PM",
        description: "1:00 PM",
      },
      {
        id: "2:00 PM",
        description: "2:00 PM",
      },
      {
        id: "3:00 PM",
        description: "3:00 PM",
      },
      {
        id: "4:00 PM",
        description: "4:00 PM",
      },
      {
        id: "4:30 PM",
        description: "4:30 PM",
      },
      {
        id: "5:00 PM",
        description: "5:00 PM",
      },
      {
        id: "5:30 PM",
        description: "5:30 PM",
      },
      {
        id: "6:00 PM",
        description: "6:00 PM",
      },
      {
        id: "6:30 PM",
        description: "6:30 PM",
      },
      {
        id: "7:00 PM",
        description: "7:00 PM",
      },
      {
        id: "7:30 PM",
        description: "7:30 PM",
      },
      {
        id: "8:00 PM",
        description: "8:00 PM",
      },
      {
        id: "8:30 PM",
        description: "8:30 PM",
      },
      {
        id: "9:00 PM",
        description: "9:00 PM",
      },
      {
        id: "9:00 PM",
        description: "9:00 PM",
      },
      {
        id: "9:30 PM",
        description: "9:30 PM",
      },
      {
        id: "10:00 PM",
        description: "10:00 PM",
      },
      {
        id: "10:30 PM",
        description: "10:30 PM",
      },
      {
        id: "11:00 PM",
        description: "11:00 PM",
      },
      {
        id: "11:30 PM",
        description: "11:30 PM",
      },
      {
        id: "12:00 AM",
        description: "12:00 AM",
      },
    ];
    this.workTotalHoursData = [
      {
        id: null,
        description: "Select",
      },
      {
        id: "4h 00m",
        description: "4h 00m",
      },
      {
        id: "5h 00m",
        description: "5h 00m",
      },
      {
        id: "6h 00m",
        description: "6h 00m",
      },
      {
        id: "7h 00m",
        description: "7h 00m",
      },
      {
        id: "7h 30m",
        description: "7h 30m",
      },
      {
        id: "8h 00m",
        description: "8h 00m",
      },
      {
        id: "8h 30m",
        description: "8h 30m",
      },
      {
        id: "9h 00m",
        description: "9h 00m",
      },
      {
        id: "9hr 30m",
        description: "9h 30m",
      },
      {
        id: "10hr 00m",
        description: "10h 00m",
      },
    ];
    this.timeformatData = [
      {
        id: "12Hrs",
        description: "12Hrs",
      },
      {
        id: "24Hrs",
        description: "24Hrs",
      },
    ];
    //setting organization values
    let sendData = {
      id: localStorage.getItem("org_id"),
    };
    this.AdministrativeService.FindByOrgId(sendData).subscribe((data: any) => {
      //console.log(data)
      // if (data.working_days !== null) {
      //   let testData = data.working_days.split(",");
      //   this.WorkdaysData = [];
      //   testData.includes("Saturday") === true
      //     ? this.WorkdaysData.push({
      //         day: "SA",
      //         day_name: "Saturday",
      //         is_working: true,
      //       })
      //     : this.WorkdaysData.push({
      //         day: "SA",
      //         day_name: "Saturday",
      //         is_working: false,
      //       });
      //   testData.includes("Sunday") === true
      //     ? this.WorkdaysData.push({
      //         day: "SU",
      //         day_name: "Sunday",
      //         is_working: true,
      //       })
      //     : this.WorkdaysData.push({
      //         day: "SU",
      //         day_name: "Sunday",
      //         is_working: false,
      //       });
      //   testData.includes("Monday") === true
      //     ? this.WorkdaysData.push({
      //         day: "MO",
      //         day_name: "Monday",
      //         is_working: true,
      //       })
      //     : this.WorkdaysData.push({
      //         day: "MO",
      //         day_name: "Monday",
      //         is_working: false,
      //       });
      //   testData.includes("Tuesday") === true
      //     ? this.WorkdaysData.push({
      //         day: "TU",
      //         day_name: "Tuesday",
      //         is_working: true,
      //       })
      //     : this.WorkdaysData.push({
      //         day: "TU",
      //         day_name: "Tuesday",
      //         is_working: false,
      //       });
      //   testData.includes("Wednesday") === true
      //     ? this.WorkdaysData.push({
      //         day: "WE",
      //         day_name: "Wednesday",
      //         is_working: true,
      //       })
      //     : this.WorkdaysData.push({
      //         day: "WE",
      //         day_name: "Wednesday",
      //         is_working: false,
      //       });
      //   testData.includes("Thursday") === true
      //     ? this.WorkdaysData.push({
      //         day: "TH",
      //         day_name: "Thursday",
      //         is_working: true,
      //       })
      //     : this.WorkdaysData.push({
      //         day: "TH",
      //         day_name: "Thursday",
      //         is_working: false,
      //       });
      //   testData.includes("Friday") === true
      //     ? this.WorkdaysData.push({
      //         day: "FR",
      //         day_name: "Friday",
      //         is_working: true,
      //       })
      //     : this.WorkdaysData.push({
      //         day: "FR",
      //         day_name: "Friday",
      //         is_working: false,
      //       });
      //   //console.log(this.WorkdaysData)
      // } else {
      //   this.WorkdaysData = [
      //     {
      //       day: "SA",
      //       day_name: "Saturday",
      //       is_working: false,
      //     },
      //     {
      //       day: "SU",
      //       day_name: "Sunday",
      //       is_working: true,
      //     },
      //     {
      //       day: "MO",
      //       day_name: "Monday",
      //       is_working: true,
      //     },
      //     {
      //       day: "TU",
      //       day_name: "Tuesday",
      //       is_working: true,
      //     },
      //     {
      //       day: "WE",
      //       day_name: "Wednesday",
      //       is_working: true,
      //     },
      //     {
      //       day: "TH",
      //       day_name: "Thursday",
      //       is_working: true,
      //     },
      //     {
      //       day: "FR",
      //       day_name: "Friday",
      //       is_working: false,
      //     },
      //   ];
      // }

      // if (data.is_flexible === true) {
      //   this.addIsFlexibleDiv = true;
      //   this.addDropDownsForm.patchValue({
      //     startTimeDropdownValue: null,
      //     endTimeDropdownValue: null,
      //   });
      // } else {
      //   this.addDropDownsForm.patchValue({
      //     startTimeDropdownValue: data.work_start_time,
      //     endTimeDropdownValue: data.work_start_time,
      //   });
      // }
      // this.addDropDownsForm.patchValue({
      //   totalHoursDropdownValue: {
      //     id: data.working_hours,
      //     description: data.working_hours,
      //   },
      // });

      if (data.time_zone !== null) {
        this.addDropDownsForm.patchValue({
          timeZoneDropdownValue: {
            id: data.time_zones,
            description: data.time_zone,
          },
        });
      } else {
        //get current time zone
        let tz = moment.tz.guess();
        this.addDropDownsForm.patchValue({
          timeZoneDropdownValue: {
            id: tz + " (GMT" + moment.tz(tz).format("Z") + ")",
            description: tz + " (GMT" + moment.tz(tz).format("Z") + ")",
          },
        });
      }

      if (data.time_format !== null) {
        this.addDropDownsForm.patchValue({
          timeFormatDropdownValue: {
            id: data.time_format,
            description: data.time_format,
          },
        });
      } else {
        this.addDropDownsForm.patchValue({
          timeFormatDropdownValue: {
            id: "12Hrs",
            description: "12Hrs",
          },
        });
      }
    });
  }

  setProfileEffectiveDate(joiningDate) {
    let empJoiningDate = new Date(joiningDate);
    let employeeCreatedDate = new Date();
    //console.log('date to consider',empJoiningDate, employeeCreatedDate)
    if (empJoiningDate.getFullYear() < employeeCreatedDate.getFullYear()) {
      this.addNewEmployeeLeaveForm.patchValue({
        aProfileStartDate: moment().startOf("year").format("ll"),
      });
      this.addDropDownsForm.patchValue({
        addwrkProfileEffectiveDay: moment().startOf("year").format("ll"),
      });
    } else {
      //console.log('cond2')
      if (empJoiningDate < employeeCreatedDate) {
        //console.log('cond2-1')
        this.addNewEmployeeLeaveForm.patchValue({
          aProfileStartDate: moment(empJoiningDate).format("ll"),
        });
        this.addDropDownsForm.patchValue({
          addwrkProfileEffectiveDay: moment(empJoiningDate).format("ll"),
        });
      } else {
        //console.log('cond2-2')
        this.addNewEmployeeLeaveForm.patchValue({
          aProfileStartDate: moment(employeeCreatedDate).format("ll"),
        });
        this.addDropDownsForm.patchValue({
          addwrkProfileEffectiveDay: moment(employeeCreatedDate).format("ll"),
        });
      }
    }
  }

  detectEmpPho(event) {
    if (event.srcElement.value === "Phone") {
      this.emailDiv = false;
      this.phoneDiv = true;
    } else {
      this.emailDiv = true;
      this.phoneDiv = false;
    }
  }

  addChangedEmpTeam(event) {
    let teamValue;
    if (event.value.id !== null) {
      Swal.fire({
        title: "Apply this team settings ?",
        text: "The current employee Work Timings will be inline with the Selected team",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: " Confirm",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.value === true) {
          if (
            event.value.description == "Without Team" ||
            event.value.description == null ||
            event.value.description == "" ||
            event.value.description == undefined
          ) {
            this.setWorkDetailsByOrgData();
            return;
          }
          let postData = {
            id: this.addDropDownsForm.value.teamDropdownValue.id,
          };
          console.log("Getting Team data", postData);
          this.teamService.FindByTeamIDnew(postData).subscribe((data: any) => {
            if (data) {
              teamValue = data;

              if (teamValue.working_days !== null) {
                let testData = teamValue.working_days.split(",");
                this.WorkdaysData = [];
                testData.includes("Saturday") === true
                  ? this.WorkdaysData.push({
                      day: "SA",
                      day_name: "Saturday",
                      is_working: true,
                    })
                  : this.WorkdaysData.push({
                      day: "SA",
                      day_name: "Saturday",
                      is_working: false,
                    });
                testData.includes("Sunday") === true
                  ? this.WorkdaysData.push({
                      day: "SU",
                      day_name: "Sunday",
                      is_working: true,
                    })
                  : this.WorkdaysData.push({
                      day: "SU",
                      day_name: "Sunday",
                      is_working: false,
                    });
                testData.includes("Monday") === true
                  ? this.WorkdaysData.push({
                      day: "MO",
                      day_name: "Monday",
                      is_working: true,
                    })
                  : this.WorkdaysData.push({
                      day: "MO",
                      day_name: "Monday",
                      is_working: false,
                    });
                testData.includes("Tuesday") === true
                  ? this.WorkdaysData.push({
                      day: "TU",
                      day_name: "Tuesday",
                      is_working: true,
                    })
                  : this.WorkdaysData.push({
                      day: "TU",
                      day_name: "Tuesday",
                      is_working: false,
                    });
                testData.includes("Wednesday") === true
                  ? this.WorkdaysData.push({
                      day: "WE",
                      day_name: "Wednesday",
                      is_working: true,
                    })
                  : this.WorkdaysData.push({
                      day: "WE",
                      day_name: "Wednesday",
                      is_working: false,
                    });
                testData.includes("Thursday") === true
                  ? this.WorkdaysData.push({
                      day: "TH",
                      day_name: "Thursday",
                      is_working: true,
                    })
                  : this.WorkdaysData.push({
                      day: "TH",
                      day_name: "Thursday",
                      is_working: false,
                    });
                testData.includes("Friday") === true
                  ? this.WorkdaysData.push({
                      day: "FR",
                      day_name: "Friday",
                      is_working: true,
                    })
                  : this.WorkdaysData.push({
                      day: "FR",
                      day_name: "Friday",
                      is_working: false,
                    });
                console.log(this.WorkdaysData);
              } else {
                this.WorkdaysData = [
                  {
                    day: "SA",
                    day_name: "Saturday",
                    is_working: false,
                  },
                  {
                    day: "SU",
                    day_name: "Sunday",
                    is_working: true,
                  },
                  {
                    day: "MO",
                    day_name: "Monday",
                    is_working: true,
                  },
                  {
                    day: "TU",
                    day_name: "Tuesday",
                    is_working: true,
                  },
                  {
                    day: "WE",
                    day_name: "Wednesday",
                    is_working: true,
                  },
                  {
                    day: "TH",
                    day_name: "Thursday",
                    is_working: true,
                  },
                  {
                    day: "FR",
                    day_name: "Friday",
                    is_working: false,
                  },
                ];
              }
              if (data.is_flexible === true) {
                this.editIsFlexibleDiv = true;
                this.addDropDownsForm.patchValue({
                  startTimeDropdownValue: { id: null, description: "select" },
                  endTimeDropdownValue: { id: null, description: "select" },
                  addCheckinTolerance: { id: null, description: "select" },
                  addBreakTimeLimit: { id: null, description: "select" },
                  editCheckInAfter: {
                    id: data.checkin_after,
                    description: data.checkin_after,
                  },
                  editCheckOutBefore: {
                    id: data.checkout_before,
                    description: data.checkout_before,
                  },
                  editTotalHoursDropdownValue: {
                    id: data.min_hrs_flx,
                    description: data.min_hrs_flx,
                  },
                  editBreakTimeLimitFlex: {
                    id: data.break_time_flx,
                    description: data.break_time_flx,
                  },
                });
              } else {
                this.addDropDownsForm.patchValue({
                  startTimeDropdownValue: {
                    id: data.work_start_time,
                    description: data.work_start_time,
                  },
                  endTimeDropdownValue: {
                    id: data.work_end_time,
                    description: data.work_end_time,
                  },
                  addCheckinTolerance: {
                    id: data.checkin_tolarence,
                    description: data.checkin_tolarence,
                  },
                  addBreakTimeLimit: {
                    id: data.break_time,
                    description: data.break_time,
                  },
                  editCheckInAfter: { id: null, description: "select" },
                  editCheckOutBefore: { id: null, description: "select" },
                  editTotalHoursDropdownValue: {
                    id: null,
                    description: "select",
                  },
                  editBreakTimeLimitFlex: { id: null, description: "select" },
                });
              }
              if (data.is_custom_work) {
                let exptest = data.work_days_exp.split(",");
                this.editWorkDayExp = [];
                this.managed = true;
                exptest.includes("Saturday.") === true
                  ? this.editWorkDayExp.push({
                      day: "SA",
                      day_name: "Saturday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "SA",
                      day_name: "Saturday.",
                      is_working: false,
                    });
                exptest.includes("Sunday.") === true
                  ? this.editWorkDayExp.push({
                      day: "SU",
                      day_name: "Sunday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "SU",
                      day_name: "Sunday.",
                      is_working: false,
                    });
                exptest.includes("Monday.") === true
                  ? this.editWorkDayExp.push({
                      day: "MO",
                      day_name: "Monday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "MO",
                      day_name: "Monday.",
                      is_working: false,
                    });
                exptest.includes("Tuesday.") === true
                  ? this.editWorkDayExp.push({
                      day: "TU",
                      day_name: "Tuesday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "TU",
                      day_name: "Tuesday.",
                      is_working: false,
                    });
                exptest.includes("Wednesday.") === true
                  ? this.editWorkDayExp.push({
                      day: "WE",
                      day_name: "Wednesday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "WE",
                      day_name: "Wednesday.",
                      is_working: false,
                    });
                exptest.includes("Thursday.") === true
                  ? this.editWorkDayExp.push({
                      day: "TH",
                      day_name: "Thursday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "TH",
                      day_name: "Thursday.",
                      is_working: false,
                    });
                exptest.includes("Friday.") === true
                  ? this.editWorkDayExp.push({
                      day: "FR",
                      day_name: "Friday.",
                      is_working: true,
                    })
                  : this.editWorkDayExp.push({
                      day: "FR",
                      day_name: "Friday.",
                      is_working: false,
                    });

                let expday = [];
                // saturday exp
                if (data.saturday_exp) {
                  expday = data.saturday_exp.split(",");
                  if (expday[0] == true) {
                    this.addDropDownsForm.patchValue({
                      wsasa: { id: expday[1], description: expday[1] },
                      websa: { id: expday[2], description: expday[2] },
                      misa: { id: expday[3], description: expday[3] },
                      btlsa: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.addDropDownsForm.patchValue({
                      StartSaturday: { id: expday[1], description: expday[1] },
                      EndSaturday: { id: expday[2], description: expday[2] },
                      tosa: { id: expday[3], description: expday[3] },
                      btlsa: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                // sunday exp
                if (data.sunday_exp) {
                  expday = data.sunday_exp.split(",");
                  if (expday[0] == true) {
                    this.addDropDownsForm.patchValue({
                      wsasu: { id: expday[1], description: expday[1] },
                      websu: { id: expday[2], description: expday[2] },
                      misu: { id: expday[3], description: expday[3] },
                      btlsu: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.addDropDownsForm.patchValue({
                      StartSunday: { id: expday[1], description: expday[1] },
                      EndSunday: { id: expday[2], description: expday[2] },
                      tosu: { id: expday[3], description: expday[3] },
                      btlsu: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                //monday exp
                if (data.monday_exp) {
                  expday = data.monday_exp.split(",");
                  if (expday[0] == true) {
                    this.addDropDownsForm.patchValue({
                      wsamo: { id: expday[1], description: expday[1] },
                      webmo: { id: expday[2], description: expday[2] },
                      mismo: { id: expday[3], description: expday[3] },
                      btlmo: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.addDropDownsForm.patchValue({
                      StartMonday: { id: expday[1], description: expday[1] },
                      EndMonday: { id: expday[2], description: expday[2] },
                      tomo: { id: expday[3], description: expday[3] },
                      btlmo: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                //tuesday exp
                if (data.tuesday_exp) {
                  expday = data.tuesday_exp.split(",");
                  if (expday[0] == true) {
                    this.addDropDownsForm.patchValue({
                      wsatu: { id: expday[1], description: expday[1] },
                      webtu: { id: expday[2], description: expday[2] },
                      mistu: { id: expday[3], description: expday[3] },
                      btltu: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.addDropDownsForm.patchValue({
                      StartTuesday: { id: expday[1], description: expday[1] },
                      EndTuesday: { id: expday[2], description: expday[2] },
                      totu: { id: expday[3], description: expday[3] },
                      btltu: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                // wednesday exp
                if (data.wednesday_exp) {
                  expday = data.wednesday_exp.split(",");
                  if (expday[0] == true) {
                    this.addDropDownsForm.patchValue({
                      wsawe: { id: expday[1], description: expday[1] },
                      webwe: { id: expday[2], description: expday[2] },
                      miswe: { id: expday[3], description: expday[3] },
                      btlwe: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.addDropDownsForm.patchValue({
                      StartWednesday: { id: expday[1], description: expday[1] },
                      EndWednesday: { id: expday[2], description: expday[2] },
                      towe: { id: expday[3], description: expday[3] },
                      btlwe: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                // thursday exp
                if (data.thursday_exp) {
                  expday = data.thursday_exp.split(",");
                  if (expday[0] == true) {
                    this.addDropDownsForm.patchValue({
                      wsath: { id: expday[1], description: expday[1] },
                      webth: { id: expday[2], description: expday[2] },
                      misth: { id: expday[3], description: expday[3] },
                      btlth: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.addDropDownsForm.patchValue({
                      StartThursday: { id: expday[1], description: expday[1] },
                      EndThursday: { id: expday[2], description: expday[2] },
                      toth: { id: expday[3], description: expday[3] },
                      btlth: { id: expday[4], description: expday[4] },
                    });
                  }
                }
                //friday exp
                if (data.friday_exp) {
                  expday = data.friday_exp.split(",");
                  if (expday[0] == true) {
                    this.addDropDownsForm.patchValue({
                      wsafr: { id: expday[1], description: expday[1] },
                      webfr: { id: expday[2], description: expday[2] },
                      misfr: { id: expday[3], description: expday[3] },
                      btlfr: { id: expday[4], description: expday[4] },
                    });
                  } else {
                    this.addDropDownsForm.patchValue({
                      StartFriday: { id: expday[1], description: expday[1] },
                      EndFriday: { id: expday[2], description: expday[2] },
                      tofr: { id: expday[3], description: expday[3] },
                      btlfr: { id: expday[4], description: expday[4] },
                    });
                  }
                }
              } else {
                this.managed = false;
              }

              this.addDropDownsForm.patchValue({
                totalHoursDropdownValue: {
                  id: data.working_hours,
                  description: data.working_hours,
                },
              });
              if (teamValue.time_zone !== null) {
                this.addDropDownsForm.patchValue({
                  timeZoneDropdownValue: {
                    id: teamValue.time_zones,
                    description: teamValue.time_zone,
                  },
                });
              } else {
                let tz = moment.tz.guess();
                this.addDropDownsForm.patchValue({
                  timeZoneDropdownValue: {
                    id: tz + " (GMT" + moment.tz(tz).format("Z") + ")",
                    description: tz + " (GMT" + moment.tz(tz).format("Z") + ")",
                  },
                });
              }
              if (teamValue.time_format !== null) {
                this.addDropDownsForm.patchValue({
                  timeFormatDropdownValue: {
                    id: teamValue.time_format,
                    description: teamValue.time_format,
                  },
                });
              } else {
                this.addDropDownsForm.patchValue({
                  timeFormatDropdownValue: {
                    id: "12Hrs",
                    description: "12Hrs",
                  },
                });
              }
            }
            this.disableWork = true;
            this.addDropDownsForm
              .get("addFlexibleCheckbox")
              .disable({ onlySelf: true });
            this.addDropDownsForm
              .get("editCostomWorkDays")
              .disable({ onlySelf: true });
            this.addDropDownsForm.get("saIsFlex").disable({ onlySelf: true });
            this.addDropDownsForm.get("suIsFlex").disable({ onlySelf: true });
            this.addDropDownsForm.get("moIsFlex").disable({ onlySelf: true });
            this.addDropDownsForm.get("tuIsFlex").disable({ onlySelf: true });
            this.addDropDownsForm.get("weIsFlex").disable({ onlySelf: true });
            this.addDropDownsForm.get("thIsFlex").disable({ onlySelf: true });
            this.addDropDownsForm.get("frIsFlex").disable({ onlySelf: true });
            this.addDropDownsForm.patchValue({ workSettings: "Team Settings" });
            this.toast.success(
              this.addDropDownsForm.value.teamDropdownValue.description +
                "Teams Settings Applied!"
            );
          });
        } else {
          this.toast.info("Team Settings Not Applied!");
        }
      });
    } else {
      if (this.addDropDownsForm.value.workSettings == "Team Settings") {
        this.addDropDownsForm.patchValue({
          workSettings: "Individual Settings",
        });
        this.selectedWorkSettings({ value: "Individual Settings" });
        Swal.fire(
          "Work Days Settings!",
          "The Work Days Settings has been changed back to Individual Settings",
          "info"
        );
      }
    }
  }

  addChangeWorkingDays(e) {
    let compare = e.target.value + ".";
    this.WorkdaysData.map((elm) => {
      if (elm.day_name === e.target.value) {
        elm.is_working = e.srcElement.checked;
        this.editWorkDayExp.map((elm) => {
          if (elm.day_name == compare) {
            if (e.srcElement.checked == true) {
              elm.is_working = !e.srcElement.checked;
            }
          }
        });
      }
    });
  }

  addIsFlexed(e) {
    //console.log(e)
    if (e.srcElement.checked === true) {
      this.addIsFlexibleDiv = true;
      this.addDropDownsForm.patchValue({
        startTimeDropdownValue: null,
        endTimeDropdownValue: null,
      });
    } else {
      this.addIsFlexibleDiv = false;
    }
  }

  addStartDtChange(event) {
    if (event.value !== null) {
      this.FindByOrgId(event.value);
      this.setProfileEffectiveDate(event.value);
    } else {
      this.FindByOrgId(moment().format("ll"));
      this.setProfileEffectiveDate(moment().format("ll"));
    }

    if (this.yearNumber > 0) {
      this.addNewEmployeeLeaveForm.patchValue({
        aEndDate: moment(event.value)
          .add(this.yearNumber, "years")
          .format("ll"),
      });
    }
  }

  addDetectEndDateRadioChange(event) {
    console.log(event);
    let leaveForm = this.addNewEmployeeLeaveForm.value;
    if (event.target.value) {
      this.yearNumber = parseInt(event.target.value);
      this.addNewEmployeeLeaveForm.patchValue({
        aEndDate: moment(leaveForm.aJoinedDate)
          .add(this.yearNumber, "years")
          .format("ll"),
      });
    }
  }

  addSaveDateType() {
    this.modalService.dismissAll();
  }

  addChangedLeaveProfileType(event) {
    //console.log(event)
    if (event.value.id === null) {
      this.lProfEffectiveDateDiv = false;
      this.openingBalanceDiv = false;
      this.leaveTakenDiv = false;
    } else {
      this.lProfEffectiveDateDiv = true;
    }
  }

  FindByOrgId(empJoiningDateProcess) {
    let sendData = { id: localStorage.getItem("org_id") };
    this.AdministrativeService.FindByOrgId(sendData).subscribe((data: any) => {
      let todaysDate = new Date(new Date().setHours(0, 0, 0, 0));
      let empJoiningDate = new Date(
        new Date(empJoiningDateProcess).setHours(0, 0, 0, 0)
      );
      let leaveValue;
      if (this.singleEmployeeEdit) {
        leaveValue = this.editEmployeeLeaveForm.value;
      } else {
        leaveValue = this.addNewEmployeeLeaveForm.value;
      }

      if (empJoiningDate.getFullYear() < todaysDate.getFullYear()) {
        if (this.singleEmployeeEdit) {
          //If No Leave Prfile then hide opeblncDiv
          if (leaveValue.editleaveProfileDropdownValue.id === null) {
            this.editopeningBalanceDiv = false;
            this.editleaveTakenDiv = false;
          } else {
            this.editopeningBalanceDiv = true;
            this.editleaveTakenDiv = false;
          }
        } else {
          //If No Leave Prfile then hide opeblncDiv
          if (leaveValue.leaveProfileDropdownValue.id === null) {
            this.editopeningBalanceDiv = false;
            this.editleaveTakenDiv = false;
          } else {
            this.openingBalanceDiv = true;
            this.leaveTakenDiv = false;
          }
        }
      } else {
        if (this.singleEmployeeEdit) {
          //If No Leave Prfile then hide opeblncDiv
          if (leaveValue.editleaveProfileDropdownValue.id === null) {
            this.editopeningBalanceDiv = false;
            this.editleaveTakenDiv = false;
          } else {
            //Check if current date is equal to join
            if (JSON.stringify(empJoiningDate) === JSON.stringify(todaysDate)) {
              this.editopeningBalanceDiv = false;
              this.editleaveTakenDiv = false;
            } else {
              this.editopeningBalanceDiv = false;
              this.editleaveTakenDiv = true;
            }
          }
        } else {
          //If No Leave Prfile then hide opeblncDiv
          if (leaveValue.leaveProfileDropdownValue.id === null) {
            this.openingBalanceDiv = false;
            this.leaveTakenDiv = false;
          } else {
            //Check if current date is equal to join
            if (JSON.stringify(empJoiningDate) === JSON.stringify(todaysDate)) {
              this.openingBalanceDiv = false;
              this.leaveTakenDiv = false;
            } else {
              console.log("IAGDGHGHDH");
              this.openingBalanceDiv = false;
              this.leaveTakenDiv = true;
            }
          }
        }
      }
    });
  }

  newVal ;
  checkErrorBeforeAddEmployee() {
    let employeeFormData = this.addNewEmployeeForm.value;
    let dropDownForm = this.addDropDownsForm.value;
    console.log("checkErrorBeforeAddEmployee", employeeFormData);
    console.log("checkErrorBeforeAddEmployee", dropDownForm);
    console.log(dropDownForm.workLocDropdownValue === "Onshore",".........test....")

    if(dropDownForm.workLocDropdownValue === "Onshore")
    {
      console.log(this.onShoreRequired, "//////")
      this.onShoreRequired.forEach((elm) => {
        console.log(elm, "......elm")
        if(elm === "addStatusDropdownValue" || elm === "teamDropdownValue" || elm === "roleDropdownValue" )
          {
            console.log("ffffuuuuuuu")
            console.log(dropDownForm[elm]['id'] === 'null', ",,,,,,")
            if (!dropDownForm[elm]['id'] || dropDownForm[elm]['id'] === "" || dropDownForm[elm]['id'] === 'null') {
              const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
              const isInArray = this.onShoreTrue.some(field => {
                const words = field.field_name.toLowerCase().split(/\s+/);

                return words.some((word) => {
                  // if (elmVal.includes(word.replace(/[^a-z]/g, '')))
                  // {
                  //   this.newVal = field.field_name
                  // }
                  return elmVal.includes(word.replace(/[^a-z]/g, ''))
                  });
                });
                if (isInArray)
                {
              //     this.addEmpRoleValueError = true;
              // this.toast.error(`${elm}R is Required`);
                if(elm === "addStatusDropdownValue"){
                  this.chpstatus = true;
                } else if(elm === "teamDropdownValue"){
                  this.chpteam = true;
                } else if (elm === "roleDropdownValue"){
                  this.chprole = true;
                }
                }


          }
          else {

            const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
              const isInArray = this.onShoreTrue.some(field => {
                const words = field.field_name.toLowerCase().split(/\s+/);

                return words.some((word) => {
                  // if (elmVal.includes(word.replace(/[^a-z]/g, '')))
                  // {
                  //   this.newVal = field.field_name
                  // }
                  return elmVal.includes(word.replace(/[^a-z]/g, ''))
                  });
                });
                if (isInArray)
                {
              //     this.addEmpRoleValueError = true;
              // this.toast.error(`${this.newVal}Rstu is Required`);
                if(elm === "addStatusDropdownValue"){
                  this.chpstatus = false;
                } else if(elm === "teamDropdownValue"){
                  this.chpteam = false;
                } else if (elm === "roleDropdownValue"){
                  this.chprole = false;
                }
                }


          }
        }
        else if (elm === "addnationality")
        {
          console.log(typeof(employeeFormData[elm]), "////")
          if(!employeeFormData[elm] || employeeFormData[elm] === "" || employeeFormData[elm] === null)
          {
            const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
            const isInArray = this.onShoreTrue.some(field => {
              const words = field.field_name.toLowerCase().split(/\s+/);

              return words.some((word) => {

                return elmVal.includes(word.replace(/[^a-z]/g, ''))
                });
              });
              if(isInArray)
              {
            //     this.addEmpRoleValueError = true;
            // this.toast.error(`${elm}t is Required`);

              this.chpnation = true;

              }
          } else {
            const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
            const isInArray = this.onShoreTrue.some(field => {
              const words = field.field_name.toLowerCase().split(/\s+/);

              return words.some((word) => {

                return elmVal.includes(word.replace(/[^a-z]/g, ''))
                });
              });
              if(isInArray)
              {
            //     this.addEmpRoleValueError = true;
            // this.toast.error(`${elm}t is Required`);

              this.chpnation = false;

              }
          }
        }
        else if  (Object.keys(employeeFormData).includes(elm))
        {
          const ssss = this.addNewEmployeeForm.get(elm).value
          console.log(ssss, "////")
          console.log("fucked uppp...",typeof(ssss))
          const isNonEmptyString = typeof ssss === 'string' && ssss.trim().length > 0 ;
          //const isNum = typeof ssss
          if(isNonEmptyString )
          {
            console.log("sukkkkk")
            const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
            const isInArray = this.onShoreTrue.some(field => {
              const words = field.field_name.toLowerCase().split(/\s+/);

              return words.some((word) => {

                return elmVal.includes(word.replace(/[^a-z]/g, ''))
                });
              });
              if(isInArray)
              {
            //     this.addEmpRoleValueError = true;
            // this.toast.error(`${elm}t is Required`);
            if(elm === "aFirstName"){
              this.chpfirst = false;
            } else if (elm  === "aLastName"){
              this.chplast = false;
            } else if ( elm  === "aPhoneNumber"){
              this.chpphone = false;
            } else if ( elm === "aWorkEmail"){
              this.chpmail = false;
            } else if ( elm === "addnationality"){
              this.chpnation = false;
            }
              }

          }
          else  {
            console.log()
            const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
            console.log(elmVal," .... ///eeeeee llll mmmmm")
            const isInArray = this.onShoreTrue.some(field => {
              const words = field.field_name.toLowerCase().split(/\s+/);
              console.log(words," wwww  oooorrr  jjs")
              return words.some((word) => {
                return elmVal.includes(word.replace(/[^a-z]/g, ''))
                });
              });

              console.log(isInArray ,"checkkkk...")
            console.log(elm, "..////val//u")
            if(isInArray)
            {
            //   this.addEmpRoleValueError = true;
            // this.toast.error(`${elm}s is Required`);
            if(elm === "aFirstName"){
              this.chpfirst = true;
            } else if (elm  === "aLastName"){
              this.chplast = true;
            } else if ( elm  === "aPhoneNumber"){
              this.chpphone = true;
            } else if ( elm === "aWorkEmail"){
              this.chpmail = true;
            } else if ( elm === "addnationality"){
              this.chpnation = true;
            }
            }


          }
        } else if  (Object.keys(dropDownForm).includes(elm))
        {
          if(dropDownForm[elm]['id'] !== 'null' && dropDownForm[elm]['id'] !== undefined) {

            const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
            const isInArray = this.onShoreTrue.some(field => {
              const words = field.field_name.toLowerCase().split(/\s+/);

              return words.some((word) => {
                return elmVal.includes(word.replace(/[^a-z]/g, ''))
                });
              });

            console.log(dropDownForm[elm]['id'], " ....///")
            // this.addEmpRoleValueError = true;
            // this.toast.success(`Done`);
            if(isInArray)
            {
              if( elm  === "empTypeDropdownValue")
              {
                this.chptype = false;
              }

            }


          }
          else if (!dropDownForm.elm  || dropDownForm.elm === "") {
            const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
            const isInArray = this.onShoreTrue.some(field => {
              const words = field.field_name.toLowerCase().split(/\s+/);

              return words.some((word) => {
               return elmVal.includes(word.replace(/[^a-z]/g, ''))

                });
              });
            // this.addEmpRoleValueError = true;
            // this.toast.error(`${this.newVal}y is Required`);
            if(isInArray)
            {
              if(elm === "empTypeDropdownValue"){
                this.chptype = true;
              }
            }


            console.log("chptype", this.chptype)

          }
        }
         else {
          this.addEmployee();
        }

      })
    } else if(dropDownForm.workLocDropdownValue === "Offshore")
      {
        console.log(this.offShoreRequired, "//////")
        this.onShoreRequired.forEach((elm) => {
          console.log(elm, "......elm")
          if(elm === "addStatusDropdownValue" || elm === "teamDropdownValue" || elm === "roleDropdownValue" )
            {
              console.log("ffffuuuuuuu")
              console.log(dropDownForm[elm]['id'] === 'null', ",,,,,,")
              if (!dropDownForm[elm]['id'] || dropDownForm[elm]['id'] === "" || dropDownForm[elm]['id'] === 'null') {
                const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
                const isInArray = this.offShoreTrue.some(field => {
                  const words = field.field_name.toLowerCase().split(/\s+/);

                  return words.some((word) => {
                    // if (elmVal.includes(word.replace(/[^a-z]/g, '')))
                    // {
                    //   this.newVal = field.field_name
                    // }
                    return elmVal.includes(word.replace(/[^a-z]/g, ''))
                    });
                  });
                  if (isInArray)
                  {
                //     this.addEmpRoleValueError = true;
                // this.toast.error(`${elm}R is Required`);
                  if(elm === "addStatusDropdownValue"){
                    this.chpstatus = true;
                  } else if(elm === "teamDropdownValue"){
                    this.chpteam = true;
                  } else if (elm === "roleDropdownValue"){
                    this.chprole = true;
                  }
                  }


            }
            else {

              const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
                const isInArray = this.offShoreTrue.some(field => {
                  const words = field.field_name.toLowerCase().split(/\s+/);

                  return words.some((word) => {
                    // if (elmVal.includes(word.replace(/[^a-z]/g, '')))
                    // {
                    //   this.newVal = field.field_name
                    // }
                    return elmVal.includes(word.replace(/[^a-z]/g, ''))
                    });
                  });
                  if (isInArray)
                  {
                //     this.addEmpRoleValueError = true;
                // this.toast.error(`${elm}Rstu is Required`);
                  if(elm === "addStatusDropdownValue"){
                    this.chpstatus = false;
                  } else if(elm === "teamDropdownValue"){
                    this.chpteam = false;
                  } else if (elm === "roleDropdownValue"){
                    this.chprole = false;
                  }
                  }


            }
          }
          else if (elm === "addnationality")
            {
              console.log(typeof(employeeFormData[elm]), "////")
              if(!employeeFormData[elm] || employeeFormData[elm] === "" || employeeFormData[elm] === null)
              {
                const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
                const isInArray = this.offShoreTrue.some(field => {
                  const words = field.field_name.toLowerCase().split(/\s+/);

                  return words.some((word) => {

                    return elmVal.includes(word.replace(/[^a-z]/g, ''))
                    });
                  });
                  if(isInArray)
                  {
                //     this.addEmpRoleValueError = true;
                // this.toast.error(`${elm}t is Required`);

                  this.chpnation = true;

                  }
              } else {
                const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
                const isInArray = this.offShoreTrue.some(field => {
                  const words = field.field_name.toLowerCase().split(/\s+/);

                  return words.some((word) => {

                    return elmVal.includes(word.replace(/[^a-z]/g, ''))
                    });
                  });
                  if(isInArray)
                  {
                //     this.addEmpRoleValueError = true;
                // this.toast.error(`${elm}t is Required`);

                  this.chpnation = false;

                  }
              }
            }
          else if  (Object.keys(employeeFormData).includes(elm))
          {
            const ssss = this.addNewEmployeeForm.get(elm).value
            console.log("fucked uppp...",typeof(ssss))
            const isNonEmptyString = typeof ssss === 'string' && ssss.trim().length > 0;
            if(isNonEmptyString)
            {
              console.log("sukkkkk")
              const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
              const isInArray = this.offShoreTrue.some(field => {
                const words = field.field_name.toLowerCase().split(/\s+/);

                return words.some((word) => {

                  return elmVal.includes(word.replace(/[^a-z]/g, ''))
                  });
                });
                if(isInArray)
                {
              //     this.addEmpRoleValueError = true;
              // this.toast.error(`${elm}t is Required`);
              if(elm === "aFirstName"){
                this.chpfirst = false;
              } else if (elm  === "aLastName"){
                this.chplast = false;
              } else if ( elm  === "aPhoneNumber"){
                this.chpphone = false;
              } else if ( elm === "aWorkEmail"){
                this.chpmail = false;
              } else if ( elm === "addnationality"){
                this.chpnation = false;
              }
                }

            }
            else  {
              console.log()
              const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
              console.log(elmVal," .... ///eeeeee llll mmmmm")
              const isInArray = this.offShoreTrue.some(field => {
                const words = field.field_name.toLowerCase().split(/\s+/);
                console.log(words," wwww  oooorrr  jjs")
                return words.some((word) => {
                  return elmVal.includes(word.replace(/[^a-z]/g, ''))
                  });
                });

                console.log(isInArray ,"checkkkk...")
              console.log(elm, "..////val//u")
              if(isInArray)
              {
              //   this.addEmpRoleValueError = true;
              // this.toast.error(`${elm}s is Required`);
              if(elm === "aFirstName"){
                this.chpfirst = true;
              } else if (elm  === "aLastName"){
                this.chplast = true;
              } else if ( elm  === "aPhoneNumber"){
                this.chpphone = true;
              } else if ( elm === "aWorkEmail"){
                this.chpmail = true;
              } else if ( elm === "addnationality"){
                this.chpnation = true;
              }
              }


            }
          } else if  (Object.keys(dropDownForm).includes(elm))
          {
            if(dropDownForm[elm]['id'] !== 'null' && dropDownForm[elm]['id'] !== undefined) {

              const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
              const isInArray = this.offShoreTrue.some(field => {
                const words = field.field_name.toLowerCase().split(/\s+/);

                return words.some((word) => {
                  return elmVal.includes(word.replace(/[^a-z]/g, ''))
                  });
                });

              console.log(dropDownForm[elm]['id'], " ....///")
              // this.addEmpRoleValueError = true;
              // this.toast.success(`Done`);
              if(isInArray)
              {
                if( elm  === "empTypeDropdownValue")
                {
                  this.chptype = false;
                }

              }


            }
            else if (!dropDownForm.elm  || dropDownForm.elm === "") {
              const elmVal = elm.toLowerCase().replace(/[^a-z]/g, '');
              const isInArray = this.offShoreTrue.some(field => {
                const words = field.field_name.toLowerCase().split(/\s+/);

                return words.some((word) => {
                 return elmVal.includes(word.replace(/[^a-z]/g, ''))

                  });
                });
              // this.addEmpRoleValueError = true;
              // this.toast.error(`${this.newVal}y is Required`);
              if(isInArray)
              {
                if(elm === "empTypeDropdownValue"){
                  this.chptype = true;
                }
              }


              console.log("chptype", this.chptype)

            }
          }
           else {
            this.addEmployee();
          }

        })
      }


  }

  addEmployee() {
    let employeeFormData = this.addNewEmployeeForm.value;
    let leaveForm = this.addNewEmployeeLeaveForm.value;
    let dropDownForm = this.addDropDownsForm.value;

    let userinfo = JSON.parse(localStorage.getItem("user_info"));

    let working_days = [];

    this.WorkdaysData.map((elm) => {
      if (elm.is_working === true) {
        working_days.push(elm.day_name);
      }
    });
    this.noError();

    let work_days_exp = [];
    let saturday_exp = [];
    let sunday_exp = [];
    let monday_exp = [];
    let tuesday_exp = [];
    let wednesday_exp = [];
    let thursday_exp = [];
    let friday_exp = [];

    if (this.managed == true) {
      this.editWorkDayExp.map((elm) => {
        if (elm.is_working === true) {
          work_days_exp.push(elm.day_name);
        }
      });

      if (work_days_exp.includes("Saturday.")) {
        if (this.saeditIsFlexibleDiv) {
          saturday_exp.push("true");
          saturday_exp.push(dropDownForm.wsasa.id);
          saturday_exp.push(dropDownForm.websa.id);
          saturday_exp.push(dropDownForm.misa.id);
          saturday_exp.push(dropDownForm.btlsa.id);
          console.log("checkobj", dropDownForm.wsasa.id);
        } else {
          saturday_exp.push("false");
          saturday_exp.push(dropDownForm.StartSaturday.id);
          saturday_exp.push(dropDownForm.EndSaturday.id);
          saturday_exp.push(dropDownForm.tosa.id);
          saturday_exp.push(dropDownForm.btlsa.id);
        }
      }

      if (work_days_exp.includes("Sunday.")) {
        if (this.sueditIsFlexibleDiv) {
          sunday_exp.push("true");
          sunday_exp.push(dropDownForm.wsasu.id);
          sunday_exp.push(dropDownForm.websu.id);
          sunday_exp.push(dropDownForm.misu.id);
          sunday_exp.push(dropDownForm.btlsu.id);
        } else {
          sunday_exp.push("false");
          sunday_exp.push(dropDownForm.StartSunday.id);
          sunday_exp.push(dropDownForm.EndSunday.id);
          sunday_exp.push(dropDownForm.tosu.id);
          sunday_exp.push(dropDownForm.btlsu.id);
        }
      }
      if (work_days_exp.includes("Monday.")) {
        if (this.moeditIsFlexibleDiv) {
          monday_exp.push("true");
          monday_exp.push(dropDownForm.wsamo.id);
          monday_exp.push(dropDownForm.webmo.id);
          monday_exp.push(dropDownForm.mimo.id);
          monday_exp.push(dropDownForm.btlmo.id);
        } else {
          monday_exp.push("false");
          monday_exp.push(dropDownForm.StartMonday.id);
          monday_exp.push(dropDownForm.EndMonday.id);
          monday_exp.push(dropDownForm.tomo.id);
          monday_exp.push(dropDownForm.btlmo.id);
        }
      }
      if (work_days_exp.includes("Tuesday.")) {
        if (this.tueditIsFlexibleDiv) {
          tuesday_exp.push("true");
          tuesday_exp.push(dropDownForm.wsatu.id);
          tuesday_exp.push(dropDownForm.webtu.id);
          tuesday_exp.push(dropDownForm.mitu.id);
          tuesday_exp.push(dropDownForm.btltu.id);
        } else {
          tuesday_exp.push("false");
          tuesday_exp.push(dropDownForm.StartTuesday.id);
          tuesday_exp.push(dropDownForm.EndTuesday.id);
          tuesday_exp.push(dropDownForm.totu.id);
          tuesday_exp.push(dropDownForm.btltu.id);
        }
      }
      if (work_days_exp.includes("Wednesday.")) {
        if (this.weeditIsFlexibleDiv) {
          wednesday_exp.push("true");
          wednesday_exp.push(dropDownForm.wsawe.id);
          wednesday_exp.push(dropDownForm.webwe.id);
          wednesday_exp.push(dropDownForm.miwe.id);
          wednesday_exp.push(dropDownForm.btlwe.id);
        } else {
          wednesday_exp.push("false");
          wednesday_exp.push(dropDownForm.StartWednesday.id);
          wednesday_exp.push(dropDownForm.EndWednesday.id);
          wednesday_exp.push(dropDownForm.towe.id);
          wednesday_exp.push(dropDownForm.btlwe.id);
        }
      }
      if (work_days_exp.includes("Thursday.")) {
        if (this.theditIsFlexibleDiv) {
          thursday_exp.push("true");
          thursday_exp.push(dropDownForm.wsath.id);
          thursday_exp.push(dropDownForm.webth.id);
          thursday_exp.push(dropDownForm.misth.id);
          thursday_exp.push(dropDownForm.btlth.id);
        } else {
          thursday_exp.push("false");
          thursday_exp.push(dropDownForm.StartThursday.id);
          thursday_exp.push(dropDownForm.EndThursday.id);
          thursday_exp.push(dropDownForm.toth.id);
          thursday_exp.push(dropDownForm.btlth.id);
        }
      }
      if (work_days_exp.includes("Friday.")) {
        if (this.freditIsFlexibleDiv) {
          friday_exp.push("true");
          friday_exp.push(dropDownForm.wsafr.id);
          friday_exp.push(dropDownForm.webfr.id);
          friday_exp.push(dropDownForm.mifr.id);
          friday_exp.push(dropDownForm.btlfr.id);
        } else {
          friday_exp.push("false");
          friday_exp.push(dropDownForm.StartFriday.id);
          friday_exp.push(dropDownForm.EndFriday.id);
          friday_exp.push(dropDownForm.tofr.id);
          friday_exp.push(dropDownForm.btlfr.id);
        }
      }
    }

    let postData = {
      alias: this.selectedNation,
      email: this.selectedNation,
      emp_code: employeeFormData.addempCode,
      full_name: employeeFormData.aFirstName + " " + employeeFormData.aLastName,
      first_name: employeeFormData.aFirstName,
      last_name: employeeFormData.aLastName,
      gender: this.gender,
      workemail: employeeFormData.aWorkEmail,
      phone:
        employeeFormData.aPhoneNumber !== ""
          ? employeeFormData.aPhoneNumber.dialCode +
            employeeFormData.aPhoneNumber.number
          : null,
      phone_iso_name:
        employeeFormData.aPhoneNumber !== ""
          ? employeeFormData.aPhoneNumber.countryCode
          : null,
      emp_status_id: dropDownForm.addStatusDropdownValue.id,
      team_id: dropDownForm.teamDropdownValue.id,
      joined_date: moment(leaveForm.aJoinedDate).format("L"),

      emp_type_id:
        dropDownForm.empTypeDropdownValue !== ""
          ? dropDownForm.empTypeDropdownValue.id
          : null,
      role_id: dropDownForm.roleDropdownValue.id,

      work_location: dropDownForm.workLocDropdownValue
        ? dropDownForm.workLocDropdownValue
        : null,
      time_zone:
        dropDownForm.timeZoneDropdownValue.id === undefined
          ? dropDownForm.timeZoneDropdownValue.description
          : dropDownForm.timeZoneDropdownValue.id,
      time_format: dropDownForm.timeFormatDropdownValue.id,

      leave_profile_setup_id: leaveForm.leaveProfileDropdownValue.id,
      profile_effective_from_date:
        this.lProfEffectiveDateDiv === false
          ? null
          : moment(leaveForm.aProfileStartDate).format("L"),
      open_balance_days: this.openingBalanceDiv
        ? leaveForm.openBalance === "" || leaveForm.openBalance === null
          ? 0
          : leaveForm.openBalance
        : 0,
      leave_taken: this.leaveTakenDiv
        ? leaveForm.leaveTaken === "" || leaveForm.leaveTaken === null
          ? 0
          : leaveForm.leaveTaken
        : 0,
      leave_taken_sick: this.leaveTakenDiv
        ? leaveForm.leaveTakenSick === "" || leaveForm.leaveTakenSick === null
          ? 0
          : leaveForm.leaveTakenSick
        : 0,

      workday_settings: dropDownForm.workSettings,
      work_profile_effective_day: moment(
        dropDownForm.addwrkProfileEffectiveDay
      ).format("L"),
      working_days: working_days.toString(),
      work_start_time:
        this.addIsFlexibleDiv !== true
          ? dropDownForm.startTimeDropdownValue.id !== null ||
            dropDownForm.startTimeDropdownValue.id !== ""
            ? dropDownForm.startTimeDropdownValue.id
            : null
          : null,
      work_end_time:
        this.addIsFlexibleDiv !== true
          ? dropDownForm.endTimeDropdownValue.id !== null ||
            dropDownForm.endTimeDropdownValue.id !== ""
            ? dropDownForm.endTimeDropdownValue.id
            : null
          : null,
      checkin_tolarence:
        this.editIsFlexibleDiv !== true
          ? dropDownForm.addCheckinTolerance.id
          : null, //min_hrs: ,
      break_time:
        this.editIsFlexibleDiv !== true
          ? dropDownForm.addBreakTimeLimit.id
          : null,

      is_flexible: this.editIsFlexibleDiv,

      checkin_after:
        this.editIsFlexibleDiv == true
          ? dropDownForm.editCheckInAfter.id
          : null,
      checkout_before:
        this.editIsFlexibleDiv == true
          ? dropDownForm.editCheckOutBefore.id
          : null,
      min_hrs_flx:
        this.editIsFlexibleDiv == true
          ? dropDownForm.editTotalHoursDropdownValue.id
          : null,
      break_time_flx:
        this.editIsFlexibleDiv == true
          ? dropDownForm.editBreakTimeLimitFlex.id
          : null,

      is_custom_work: this.managed,

      work_days_exp: work_days_exp.toString(),
      saturday_exp: saturday_exp.toString(),
      sunday_exp: sunday_exp.toString(),
      monday_exp: monday_exp.toString(),
      tuesday_exp: tuesday_exp.toString(),
      wednesday_exp: wednesday_exp.toString(),
      thursday_exp: thursday_exp.toString(),
      friday_exp: friday_exp.toString(),

      contract_enddate:
        leaveForm.aEndDate !== "" ? moment(leaveForm.aEndDate).format("L") : "",
      //working_hours: dropDownForm.totalHoursDropdownValue.id !== null ? dropDownForm.totalHoursDropdownValue.id : null,
      // is_new_profile: this.currentEmployeeData.leave_profile_setup_id === leaveForm.editleaveProfileDropdownValue.id ? false : this.isNewProfile,
      // is_change_profile: this.currentEmployeeData.leave_profile_setup_id === leaveForm.editleaveProfileDropdownValue.id ? false : this.isChangeProfile,

      is_weekday_overtime_enabled: this.WeekOvertimeEnable ? true : false,
      is_holiday_overtime_enabled: this.HoliOvertimeEnable ? true : false,
      minimum_overtime: this.MinumumOvertime ? this.MinumumOvertime : null,
      createdby: userinfo.id,

      min_hrs: null, //for the labour pswd
    };
    console.log("reqdata", postData);
    if (this.addEditSectionFullAccess) {
      if (this.phoneDiv) {
        this.postAddphoneEmployee = postData;
        this.checkPassword();
      } else {
        this.callAddFinalEmployee(postData);
        console.log("Employee register with the email");
      }
    } else {
      if (this.phoneDiv) {
        //this.postAddphoneEmployee = postData
        //this.checkPassword();
        Swal.fire(
          "You dont have permission for adding a employee using Phone Number! Please try using the email address!"
        );
      } else {
        postData["approver1_roleId"] = this.addEditApprover1Value;
        postData["approver2_roleId"] = this.addEditdualApprovalDiv
          ? this.addEditApprover2Value
          : null;
        postData["is_approved1"] = false;
        postData["is_approved2"] = false;
        postData["update_status"] = "Pending";
        this.addEmployeeDetailsRequestData = postData;
        this.modalService.open(this.newEmployeeCreateRequest);
      }
    }
  }

  callAddFinalEmployee(postData) {
    let sendData = postData;
    console.log("add employee details", sendData);
    this.spinner.show();
    this.empService.AddEmployee(postData).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        let postData = {
          id: data.code,
        };
        if (localStorage.getItem("emp_id")) {
          localStorage.removeItem("emp_id");
        }
        if (sessionStorage.getItem("empi_id")) {
          sessionStorage.removeItem("emp_id");
        }
        localStorage.setItem("emp_id", postData.id);
        sessionStorage.setItem("emp_id", postData.id);
        if (sendData.leave_profile_setup_id !== null) {
          this.leaveService
            .UpdateAvailableLeaves(postData)
            .subscribe((data: any) => {
              if (data.status === "200") {
                console.log(data);
              }
            });
        }
        Swal.fire({
          title: "New Employee Registered with Basic Details!",
          text: "Do you want to continue adding additional details for the new Employee?",
          showCloseButton: true,
          confirmButtonColor: "#e91e63",
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: "Yes",
          cancelButtonText: "Do later",
        }).then((result) => {
          if (result.value === true) {
            //changes_required
            this.spinner.hide();
            this.newemployeeeditsession(postData);
            this.tabObj.select(1);
          } else {
            this.spinner.hide();
            this.clossAddEmployee();
          }
        });
      } else {
        this.spinner.hide();
        this.clossAddEmployee();
        Swal.fire("Error!", data["result"].desc, "error");
      }
    });
  }

  postAddphoneEmployee;

  checkPassword() {
    this.loadPasswordform();
    this.modalService.open(this.confrimpassword);
  }

  callAddFinalPhoneEmployee() {
    if (this.registrationForm.valid) {
      this.modalService.dismissAll();
      this.labPwd = this.registrationForm.get("confirmPassword").value;
      console.log("Form submitted successfully!", this.labPwd);
      this.modalService.dismissAll();
    } else {
      // Mark fields as touched to show validation messages
      this.registrationForm.markAllAsTouched();
      return;
    }
    this.spinner.show();
    let sendData = this.postAddphoneEmployee;
    sendData.min_hrs = this.labPwd;
    console.log("add employee details", sendData);
    this.empService.AddLabourEmployee(sendData).subscribe((rsdata: any) => {
      if (rsdata.status == 200) {
        console.log("newpwd", rsdata);
        let postData = {
          id: rsdata.code,
        };
        if (localStorage.getItem("emp_id")) {
          localStorage.removeItem("emp_id");
        }
        if (sessionStorage.getItem("empi_id")) {
          sessionStorage.removeItem("emp_id");
        }
        localStorage.setItem("emp_id", postData.id);
        sessionStorage.setItem("emp_id", postData.id);
        if (sendData.leave_profile_setup_id !== null) {
          this.leaveService
            .UpdateAvailableLeaves(postData)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.spinner.hide();
                Swal.fire({
                  title: "New Employee Registered with Basic Details!",
                  text:
                    "Here is the password for the Employee : " + rsdata.desc,
                });
              } else {
                this.spinner.show("Somthing Went wrong!");
              }
            });
        }
      } else {
        this.spinner.hide();
        this.clossAddEmployee();
        Swal.fire("Error!", rsdata["result"].desc, "error");
      }
    });
  }

  //!!! This need to change by looking the permmisions and want to give the request to add new employee!!
  callAddFinalEmployeeRequest() {
    this.spinner.show();
    console.log("add employee details", this.addEmployeeDetailsRequestData);
    this.empService
      .AddEmployeeDetailsOverride(this.addEmployeeDetailsRequestData)
      .subscribe((data: any) => {
        if (data.status == 200) {
          this.spinner.hide();
          this.toast.success(
            "Employee Add request has been send to the Approver",
            undefined,
            {
              positionClass: "toast-top-center",
            }
          );
          this.clossAddEmployee();
          this.closeAddEmployeeRequest();
        } else {
          this.spinner.hide();
          this.clossAddEmployee();
          this.closeAddEmployeeRequest();
          Swal.fire("Error!", data["result"].desc, "error");
        }
      });
  }

  closeAddEmployeeRequest() {
    this.modalService.dismissAll();
  }

  clossAddEmployee() {
    this.addNewEmployeeForm.reset();
    this.addNewEmployeeLeaveForm.reset();
    this.addDropDownsForm.reset();
    this.noError();
    this.resetBooleanValues();
    this.getEmployeeByOrgId();
    this.yearNumber = 0;
    this.fromNotification = false;
    this.NoIsDual = false;
    this.chpnation = false;
    this.chpfirst = false;
    this.chplast = false;
    this.chpmail = false;
    this.chpphone = false;
    this.chptype = false;
    this.chpteam = false;
    this.chprole = false;
    this.chpstatus = false;

  }

  resetBooleanValues() {
    this.allEmployeeGrid = true;
    this.singleEmployeeAdd = false;
    this.singleEmployeeEdit = false;
    this.lProfEffectiveDateDiv = true;
    this.openingBalanceDiv = false;
    this.leaveTakenDiv = false;
  }

  noError() {
    this.addEmpRoleValueError = false;
    this.addEmpEmailValueError = false;
  }

  //single employee add end
  //common function start
  //get all leave profile
  GetAllLeaveProfileSetupByOrgID() {
    let postData = { orgID: localStorage.getItem("org_id") };
    this.AdministrativeService.GetAllLeaveProfileSetupByOrgID(
      postData
    ).subscribe((data: any) => {
      console.log(data);
      let results = [];
      data.map((elm) => {
        if (elm.is_approved === true) {
          if (elm.is_default && this.singleEmployeeAdd) {
            this.addNewEmployeeLeaveForm.patchValue({
              leaveProfileDropdownValue: {
                id: elm.leaveDetails[0].id,
                description: elm.profileName,
              },
            });
          }
          results.push({
            id: elm.leaveDetails[0].id,
            description: elm.profileName,
          });
        }
      });
      results.unshift({ id: null, description: "No Leave Profile" });
      this.leaveProfileType = results;
    });
  }

  //get all team
  getAllTeamByOrg() {
    this.teamService.FindTeamsByOrgID().subscribe((data: any) => {
      let results = [{ id: null, description: "Without Team" }];
      if (data) {
        data.map((elm) => {
          results.push({
            id: elm.id,
            description: elm.team_name,
          });
        });
        this.teamByOrganizationData = results;
      }
    });
  }

  onadddoc() {
    let adddata = {
      docid: "",
      docname: "",
      docexp: null,
      status: "",
      crdate: moment().format("L"),
    };
    this.addocs.push(adddata);
  }

  onaddremove() {
    this.addocs.pop();
  }

  //Fill the Document Details to the Employee page!
  filldocdetails() {
    let postemp = { id: localStorage.getItem("emp_id").toString() };
    console.log("Reseting and Filling Draft Document Data");
    this.empService.GetDocumentsByempId(postemp).subscribe((data: any) => {
      let adddata;
      this.repaddocs = [];
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
          { docname: "Emirates ID", docexp: "", status: "pending", crdate: "" },
          { docname: "Insurance", docexp: "", status: "pending", crdate: "" },
        ];
        data.map((elm) => {
          if (elm.is_essential_doc == true) {
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
            adddata = {
              docid: elm.id,
              docname: elm.name,
              docexp: moment(elm.doc_exp_date).format("L").toString(),
              status: elm.status == null ? "Active" : elm.status,
              crdate: moment(elm.created_date).format("L").toString(),
            };
            this.repaddocs.push(adddata);
          }
        });
      }
    });
  }

  fillOriginalDocDetails() {
    let adddata;
    this.repaddocs = [];
    let postemp = { id: localStorage.getItem("emp_id").toString() };
    this.empService
      .GetDocumentsByempIdwithDelete(postemp)
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
    console.log("Reseting and Filling Original Document Data");
  }

  is_doc_changed = false;
  docchangelist: any = [];

  //viewing the Essential Document
  viewEssentalDoc(docname) {
    let docexist = false;
    let repdocurl = "";
    let postemp = { id: localStorage.getItem("emp_id").toString() };
    this.empService.GetDocumentsByempId(postemp).subscribe((data: any) => {
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

  ViewDocInNewTab(link) {
    window.open(link, "_blank");
  }

  //uploading an essential document
  uploadEssentalDoc(event, docname, action) {
    let document = event.filesData[0].rawFile;
    let replace = false;
    let docexpdate = "Invaild date";
    let updoc;
    let empext = this.editEmployeeExtension.value;
    let postemp = { id: localStorage.getItem("emp_id").toString() };
    switch (docname) {
      case "Passport":
        docexpdate = moment(empext.passExpDate).format("L").toString();
        break;
      case "Labour ID":
        docexpdate = moment(empext.labourExpDate).format("L").toString();
        break;
      case "Visa":
        docexpdate = moment(empext.visaExpDate).format("L").toString();
        break;
      case "Emirates ID":
        docexpdate = moment(empext.emiratesIdExpDate).format("L").toString();
        break;
      case "Insurance":
        docexpdate = moment(empext.insExp).format("L").toString();
        break;
    }

    if (docexpdate !== "Invalid date") {
      if (action == "replace") {
        Swal.fire({
          title: "Are you sure?",
          text: "Do you want to replace the document?",
          showCloseButton: true,
          confirmButtonColor: "#e91e63",
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.value === true) {
            this.spinner.show();
            this.empService
              .GetDocumentsByempId(postemp)
              .subscribe(async (data: any) => {
                if (data != null) {
                  for (var i = 0; i < data.length; i++) {
                    if (
                      data[i].name == docname &&
                      data[i].is_approved == false &&
                      data[i].related_to != "original"
                    ) {
                      await this.removeDocPermenentByID(data[i]);
                      console.log(
                        "This document is deleted and asked to upload a new file"
                      );
                      replace = true;
                    } else if (
                      data[i].name === docname &&
                      data[i].is_approved == true &&
                      data[i].doc_action == "complete"
                    ) {
                      data[i].is_approved = false;
                      data[i].doc_action = "delete";
                      data[i].is_deleted = true;
                      replace = true;
                      updoc = data[i];
                      this.empService
                        .UpdateDocById(updoc)
                        .subscribe((data: any) => {
                          if (data) {
                            if (data["result"]["status"] == 200) {
                              console.log(
                                "here the document is aproved and action completed so this document will be goying to update the record! as disapproved"
                              );
                            }
                          }
                        });
                    }
                  }
                  this.spinner.hide();
                  //uploading the new document in which goying for the approval.
                  this.uploadDoc(document, docname, true, docexpdate, replace);
                } else {
                  this.spinner.hide();
                  this.toast.error("Cannot find the file to be replaced!");
                }
              });
          }
        });
      }
      if (action == "upload") {
        this.spinner.hide();
        this.uploadDoc(document, docname, true, docexpdate, replace);
      }
    } else {
      this.spinner.hide();
      Swal.fire(
        "Oops!",
        "Please Update the Document Exipry Date in the previous section!",
        "warning"
      );
    }
  }
  //Removing an Essential Document
  removeEssentialDoc(docname) {
    let docexist = false;
    let docdata;
    let is_essential = false;
    let postemp = { id: localStorage.getItem("emp_id").toString() };
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the " + docname + " document?",
      showCloseButton: true,
      confirmButtonColor: "#e91e63",
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        this.empService
          .GetDocumentsByempIdwithDelete(postemp)
          .subscribe(async (data: any) => {
            if (data != null) {
              docdata = data.filter((x) => x.name == docname);
              await docdata.map(async (doc) => {
                console.log("FUN WAITS");
                docexist = true;
                if (doc.is_approved == false && doc.related_to != "original") {
                  this.removeDocPermenentByID(doc);
                  console.log("doc deleted permenently");
                  is_essential = doc.is_essential;
                } else if (
                  doc.is_approved == true &&
                  doc.doc_action == "complete"
                ) {
                  //update the document details with diffrent delatails
                  docexist = true;
                  doc.is_approved = false;
                  doc.doc_action = "delete";
                  doc.is_deleted = true;
                  this.empService.UpdateDocById(doc).subscribe((data: any) => {
                    if (data) {
                      if (data["result"]["status"] == 200) {
                        console.log(
                          "this document will be deleted after the approval cause this is from main document"
                        );
                      }
                    }
                  });
                  this.is_doc_changed = true;
                  is_essential = doc.is_essential;
                }
              });
              // console.log("ENDS")
              // this.docchangelist.push({ docname: docname, is_essential: is_essential ? "Essential Doc" : "Additional Doc", changeType: "Deleted" })
              // this.filldocdetails();
              // this.spinner.hide();
              // this.toast.success("Document is Deleted!")
              setTimeout(() => {
                this.docchangelist.push({
                  docname: docname,
                  is_essential: is_essential
                    ? "Essential Doc"
                    : "Additional Doc",
                  changeType: "Deleted",
                });
                this.filldocdetails();
                this.spinner.hide();
                this.toast.success("Document is Deleted!");
              }, 1200);
            }
            if (!docexist) {
              this.spinner.hide();
              Swal.fire("Oops!", "There is no Document Uploaded!", "warning");
            }
          });
      }
    });
  }

  //Upload Additional Document
  uploadAdddoc(event) {
    let docFormData = this.AddAditionalDoc.value;
    let docexp = moment(docFormData.docExpDate).format("L");
    let docname = docFormData.docName;
    let document = event.filesData[0].rawFile;
    let postemp = { id: localStorage.getItem("emp_id").toString() };
    let replace = false;

    if (docname == null || docname == "") {
      Swal.fire("Oops!", "Please add Document Name before upload", "warning");
      return;
    }
    if (docexp == null || docexp == "Invalid date" || docexp == "") {
      Swal.fire(
        "Oops!",
        "Please add Document Expiry Date before upload",
        "warning"
      );
      return;
    }

    this.empService.GetDocumentsByempId(postemp).subscribe((data: any) => {
      if (data.length != null) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].name == docname) {
            replace = true;
          }
        }
        if (replace) {
          Swal.fire(
            "Oops!",
            "Additional Document with the same name is existing. Please rename before upload!",
            "warning"
          );
          return;
        } else {
          this.uploadDoc(document, docname, false, docexp, false);
          this.AddAditionalDoc.patchValue({
            docName: "",
            docExpDate: null,
          });
        }
      }
    });
  }
  //common Upload function for Document Uploading
  uploadDoc(
    document,
    docname,
    is_essential = false,
    docexpdate,
    isreplace = false
  ) {
    let docurl;
    let cloudid;
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let emp = sessionStorage.getItem("emp_id"); //localStorage.getItem("emp_id");
    let todaysDate = Math.round(new Date().getTime() / 1000);
    this.spinner.show();
    const file: File = document;
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "enEMPdoc");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", docname + todaysDate);

      this.settingsService.uploadEmpDoc(data).subscribe((imageData) => {
        if (imageData != null) {
          docurl = imageData.secure_url;
          //cloudid = docurl.substring(docurl.lastIndexOf("/") + 1).split(".").slice(0, -1).join(".");
          let postData = {
            org_id: user_info.org_id,
            name: docname,
            emp_id: emp,
            type: "",
            extension: "",
            category: "",
            url: docurl,
            //cloud_id: cloudid,
            doc_remark: "",
            related_to: "draft",
            doc_exp_date: moment(docexpdate).format("L"),
            modified_by: user_info.id,
            created_date: moment().format("L"),
            modified_date: moment().format("L"),
            is_essential_doc: is_essential,
            is_doc_present: true,
            is_deleted: false,
            is_approved: false,
            doc_action: "upload",
          };
          console.log("uploading doc info", postData);
          this.empService
            .AddEmployeeDocument(postData)
            .subscribe((data: any) => {
              if (data != null) {
                if (data["result"]["status"] == 200) {
                  this.is_doc_changed = true;
                  if (isreplace) {
                    this.docchangelist.push({
                      docname: docname,
                      doctype: is_essential
                        ? "Essential Doc"
                        : "Additional Doc",
                      changeType: "Replaced file",
                      newvalue: docurl,
                    });
                  } else {
                    this.docchangelist.push({
                      docname: docname,
                      is_essential: is_essential
                        ? "Essential Doc"
                        : "Additional Doc",
                      changeType: "New file Added",
                      newvalue: docurl,
                    });
                  }
                  this.filldocdetails();
                  this.spinner.hide();
                  this.toast.success(
                    docname + " Document has been Successfully Uploaded!"
                  );
                } else {
                  this.spinner.hide();
                  this.toast.error(
                    "Something went wrong while Uploading the Document!"
                  );
                }
              }
            });
        }
      });
    }
  }

  removeDocPermenentByID(doc) {
    doc.related_to = "draft";
    doc.is_approved = true;
    doc.doc_action = "complete";
    doc.is_deleted = true;
    this.empService.UpdateDocById(doc).subscribe((data: any) => {
      if (data) {
        if (data["result"]["status"] == 200) {
          console.log("Draft Document is Deleted Permenantly");
        } else {
          console.log("problem in deleting the unwanted document:", data);
        }
      }
    });

    // this.settingsService.deletephoto(doc.cloud_id).subscribe((res) => {
    //   if (res != null) {
    //     if (res["status"] == 200) {
    //       doc.related_to = 'draft'
    //       doc.is_approved = true;
    //       doc.doc_action = "complete";
    //       doc.is_deleted = true;
    //       this.empService.UpdateDocById(doc).subscribe((data: any) => {
    //         if (data) {
    //           if (data["result"]["status"] == 200) {
    //             console.log("Draft Document is Deleted Permenantly")
    //           } else {
    //             console.log("problem in deleting the unwanted document:", data)
    //           }
    //         }
    //       });
    //     }
    //   }
    // });
  }

  viewDocByID(docId) {
    let docexist = false;
    let repdocurl = "";
    let postemp = { id: localStorage.getItem("emp_id").toString() };
    this.empService.GetDocumentsByempId(postemp).subscribe((data: any) => {
      if (data != null) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id === docId) {
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

  onPhotoSelected(event, i) {
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    let todaysDate = Math.round(new Date().getTime() / 1000);
    if (file) {
      //alue : 'NoName'\\\\file updated;
      //if (localStorage.getItem("emp_id")) {
      if (sessionStorage.getItem("emp_id")) {
        const datag = new FormData();
        //data.append("profile", file);
        datag.append("file", file);
        datag.append("upload_preset", "enEMPdoc");
        datag.append("cloud_name", "dtlt6afvv");
        datag.append(
          "public_id",
          sessionStorage.getItem("emp_id").toString() + todaysDate
        );

        this.settingsService.uploadEmpDoc(datag).subscribe((imageData) => {
          if (imageData != null) {
            console.log("url is here", imageData.url);
            if (sessionStorage.getItem("photo_url")) {
              sessionStorage.removeItem("photo_url");
            }
            sessionStorage.setItem("photo_url", imageData.url);
            this.assetimg = imageData.url;
            this.spinner.hide();
          }
        });
      } else {
        this.toast.warning("Please Save The Basic Details of New Employee.");
      }
    } else {
      this.toast.warning("Please upload the photo correctly");
    }
  }

  //get all role
  GetEmployeeRoleByOrgID() {
    this.empService.GetEmployeeRoleByOrgID().subscribe((data: any) => {
      let results = [{ id: null, description: "No Role" }];
      data.map((elm) => {
        results.push({
          id: elm.id,
          description: elm.role_name,
        });
      });

      results = results.filter(
        (el: any) => el.description.toLowerCase() !== "account owner"
      );

      this.employeeRoleData = results;
      this.spinner.hide();
    });
  }

  empstatusData;

  //get status of employee
  GetEmployeeStatusByOrgID() {
    this.empService.GetEmployeeStatusByOrgID().subscribe(
      (data: any) => {
        var results = [{ id: "null", description: "Select" }];
        data.map((elm) => {
          results.push({
            id: elm.id,
            description: elm.employee_status_name,
          });

          if (elm.employee_status_name === "Active") {
            this.addEmpStatusID = elm.id;
          }
        });
        this.empstatusData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );
  }

  //get employee type
  GetEmployeeTypeByOrgID() {
    this.empService.GetEmployeeTypeByOrgID().subscribe(
      (data: any) => {
        var results = [];
        data.map((elm) => {
          results.push({
            id: elm.id,
            description: elm.employee_type_name,
          });
        });
        this.employeeTypeData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );
  }
  //common function end

  //timezone start
  getAllTimeZone() {
    var timeZones = momentz.tz.names();
    var offsetTmz = [];
    for (var i in timeZones) {
      offsetTmz.push({
        description:
          timeZones[i] + " (GMT" + moment.tz(timeZones[i]).format("Z") + ")",
        id: timeZones[i] + " (GMT" + moment.tz(timeZones[i]).format("Z") + ")",
      });
    }
    this.timeZoneData = offsetTmz;
    //console.log(offsetTmz)
  }
  //timezone ends

  //form input controls

  selectWorkStart(event) {
    let editDropDownForm = this.editDropDownsForm.value;
    this.editDropDownsForm.patchValue({
      StartSaturday: event["value"],
      StartSunday: event["value"],
      StartMonday: event["value"],
      StartTuesday: event["value"],
      StartWednesday: event["value"],
      StartThursday: event["value"],
      StartFriday: event["value"],
      editWorkingHours: this.calculateTimeDifference(
        editDropDownForm.editStartTimeDropdownValue.id,
        editDropDownForm.editEndTimeDropdownValue.id
      ),
      editadjustedCheckoutTime: this.addTimePeriod(
        editDropDownForm.editCheckinTolerance.id,
        this.calculateTimeDifference(
          editDropDownForm.editStartTimeDropdownValue.id,
          editDropDownForm.editEndTimeDropdownValue.id
        )
      ),
    });
  }

  selectWorkEnd(event) {
    let editDropDownForm = this.editDropDownsForm.value;
    this.editDropDownsForm.patchValue({
      EndSaturday: event["value"],
      EndSunday: event["value"],
      EndMonday: event["value"],
      EndTuesday: event["value"],
      EndWednesday: event["value"],
      EndThursday: event["value"],
      EndFriday: event["value"],
      editWorkingHours: this.calculateTimeDifference(
        editDropDownForm.editStartTimeDropdownValue.id,
        editDropDownForm.editEndTimeDropdownValue.id
      ),
      editadjustedCheckoutTime: this.addTimePeriod(
        editDropDownForm.editCheckinTolerance.id,
        this.calculateTimeDifference(
          editDropDownForm.editStartTimeDropdownValue.id,
          editDropDownForm.editEndTimeDropdownValue.id
        )
      ),
    });
  }

  selectCheckinTolerance(event) {
    let editDropDownForm = this.editDropDownsForm.value;
    this.editDropDownsForm.patchValue({
      editadjustedCheckoutTime: this.addTimePeriod(
        editDropDownForm.editCheckinTolerance.id,
        this.calculateTimeDifference(
          editDropDownForm.editStartTimeDropdownValue.id,
          editDropDownForm.editEndTimeDropdownValue.id
        )
      ),
    });
  }

  selectWorkEndExp(event, expweekday) {
    let edf = this.editDropDownsForm.value;

    console.log("for weekday", expweekday);

    if (expweekday == "Saturday") {
      this.editDropDownsForm.patchValue({
        whsa: this.calculateTimeDifference(
          edf.StartSaturday.id,
          edf.EndSaturday.id
        ),
        actsa: this.addTimePeriod(
          edf.tosa.id,
          this.calculateTimeDifference(edf.StartSaturday.id, edf.EndSaturday.id)
        ),
      });
    }
    if (expweekday == "Sunday") {
      this.editDropDownsForm.patchValue({
        whsu: this.calculateTimeDifference(
          edf.StartSunday.id,
          edf.EndSunday.id
        ),
        actsu: this.addTimePeriod(
          edf.tosu.id,
          this.calculateTimeDifference(edf.StartSunday.id, edf.EndSunday.id)
        ),
      });
    }
    if (expweekday == "Monday") {
      this.editDropDownsForm.patchValue({
        whmo: this.calculateTimeDifference(
          edf.StartMonday.id,
          edf.EndMonday.id
        ),
        actmo: this.addTimePeriod(
          edf.tomo.id,
          this.calculateTimeDifference(edf.StartMonday.id, edf.EndMonday.id)
        ),
      });
    }
    if (expweekday == "Tuesday") {
      this.editDropDownsForm.patchValue({
        whtu: this.calculateTimeDifference(
          edf.StartTuesday.id,
          edf.EndTuesday.id
        ),
        acttu: this.addTimePeriod(
          edf.totu.id,
          this.calculateTimeDifference(edf.StartTuesday.id, edf.EndTuesday.id)
        ),
      });
    }
    if (expweekday == "Wednesday") {
      this.editDropDownsForm.patchValue({
        whwe: this.calculateTimeDifference(
          edf.StartWednesday.id,
          edf.EndWednesday.id
        ),
        actwe: this.addTimePeriod(
          edf.towe.id,
          this.calculateTimeDifference(
            edf.StartWednesday.id,
            edf.EndWednesday.id
          )
        ),
      });
    }
    if (expweekday == "Thursday") {
      this.editDropDownsForm.patchValue({
        whth: this.calculateTimeDifference(
          edf.StartThursday.id,
          edf.EndThursday.id
        ),
        actth: this.addTimePeriod(
          edf.toth.id,
          this.calculateTimeDifference(edf.StartThursday.id, edf.EndThursday.id)
        ),
      });
    }
    if (expweekday == "Friday") {
      this.editDropDownsForm.patchValue({
        whfr: this.calculateTimeDifference(
          edf.StartFriday.id,
          edf.EndFriday.id
        ),
        actfr: this.addTimePeriod(
          edf.tofr.id,
          this.calculateTimeDifference(edf.StartFriday.id, edf.EndFriday.id)
        ),
      });
    }
  }

  selectCheckinToleranceexp(event, expweekday) {
    let edf = this.editDropDownsForm.value;
    if (expweekday == "Saturday") {
      this.editDropDownsForm.patchValue({
        actsa: this.addTimePeriod(
          edf.tosa.id,
          this.calculateTimeDifference(edf.StartSaturday.id, edf.EndSaturday.id)
        ),
      });
    }
    if (expweekday == "Sunday") {
      this.editDropDownsForm.patchValue({
        actsu: this.addTimePeriod(
          edf.tosu.id,
          this.calculateTimeDifference(edf.StartSunday.id, edf.EndSunday.id)
        ),
      });
    }
    if (expweekday == "Monday") {
      this.editDropDownsForm.patchValue({
        actmo: this.addTimePeriod(
          edf.tomo.id,
          this.calculateTimeDifference(edf.StartMonday.id, edf.EndMonday.id)
        ),
      });
    }
    if (expweekday == "Tuesday") {
      this.editDropDownsForm.patchValue({
        acttu: this.addTimePeriod(
          edf.totu.id,
          this.calculateTimeDifference(edf.StartTuesday.id, edf.EndTuesday.id)
        ),
      });
    }
    if (expweekday == "Wednesday") {
      this.editDropDownsForm.patchValue({
        actwe: this.addTimePeriod(
          edf.towe.id,
          this.calculateTimeDifference(
            edf.StartWednesday.id,
            edf.EndWednesday.id
          )
        ),
      });
    }
    if (expweekday == "Thursday") {
      this.editDropDownsForm.patchValue({
        actth: this.addTimePeriod(
          edf.toth.id,
          this.calculateTimeDifference(edf.StartThursday.id, edf.EndThursday.id)
        ),
      });
    }
    if (expweekday == "Friday") {
      this.editDropDownsForm.patchValue({
        actfr: this.addTimePeriod(
          edf.tofr.id,
          this.calculateTimeDifference(edf.StartFriday.id, edf.EndFriday.id)
        ),
      });
    }
  }

  addTimePeriod(startTime: string, timePeriod: string): string | null {
    console.log("from addTimePeriod", startTime, timePeriod);
    // Regular expression to validate the time format
    const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(AM|PM)$/i;
    const periodRegex = /^([0-1]?[0-9]):([0-5][0-9])$/;

    // Validate inputs
    if (!timeRegex.test(startTime) || !periodRegex.test(timePeriod)) {
      console.error("Invalid input format");
      return null;
    }

    // Convert the start time to a Date object
    const [time, modifier] = startTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    // Convert the time period to hours and minutes
    const [periodHours, periodMinutes] = timePeriod.split(":").map(Number);

    // Add the time period to the start time
    hours += periodHours;
    minutes += periodMinutes;

    // Handle minute overflow
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }

    // Handle hour overflow (24-hour time)
    if (hours >= 24) {
      hours = hours % 24;
    }

    // Convert back to 12-hour time format
    const newModifier = hours >= 12 ? "PM" : "AM";
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    // Format the result
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${newModifier}`;
  }

  calculateTimeDifference(startTime: string, endTime: string): string {
    // Helper function to convert 12-hour time format to minutes
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
        return -1; // Return -1 if there's an error in the split method
      }
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // Check if there was an error in parsing the time strings
    if (startMinutes === -1 || endMinutes === -1) {
      return ""; // Return an empty string if there was an error
    }

    let diffMinutes = endMinutes - startMinutes;

    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // If endTime is past midnight
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }
  selectCheckInAfter(event) {
    this.editDropDownsForm.patchValue({
      wsasa: event["value"],
      wsasu: event["value"],
      wsamo: event["value"],
      wsatu: event["value"],
      wsawe: event["value"],
      wsath: event["value"],
      wsafr: event["value"],
    });
  }

  selectCheckOutBefore(event) {
    this.editDropDownsForm.patchValue({
      websa: event["value"],
      websu: event["value"],
      webmo: event["value"],
      webtu: event["value"],
      webwe: event["value"],
      webth: event["value"],
      webfr: event["value"],
    });
  }

  selectTolerance(event) {
    this.editDropDownsForm.patchValue({
      tosa: event["value"],
      tosu: event["value"],
      tomo: event["value"],
      totu: event["value"],
      towe: event["value"],
      toth: event["value"],
      tofr: event["value"],
    });
  }

  selectMinimum(event) {
    this.editDropDownsForm.patchValue({
      misa: event["value"],
      misu: event["value"],
      mimo: event["value"],
      mitu: event["value"],
      miwe: event["value"],
      mith: event["value"],
      mifr: event["value"],
    });
  }

  addselectWorkStart(event) {
    this.addDropDownsForm.patchValue({
      StartSaturday: event["value"],
      StartSunday: event["value"],
      StartMonday: event["value"],
      StartTuesday: event["value"],
      StartWednesday: event["value"],
      StartThursday: event["value"],
      StartFriday: event["value"],
    });
  }

  addselectWorkEnd(event) {
    this.addDropDownsForm.patchValue({
      EndSaturday: event["value"],
      EndSunday: event["value"],
      EndMonday: event["value"],
      EndTuesday: event["value"],
      EndWednesday: event["value"],
      EndThursday: event["value"],
      EndFriday: event["value"],
    });
  }

  addselectCheckInAfter(event) {
    this.addDropDownsForm.patchValue({
      wsasa: event["value"],
      wsasu: event["value"],
      wsamo: event["value"],
      wsatu: event["value"],
      wsawe: event["value"],
      wsath: event["value"],
      wsafr: event["value"],
    });
  }
  addselectCheckOutBefore(event) {
    this.addDropDownsForm.patchValue({
      websa: event["value"],
      websu: event["value"],
      webmo: event["value"],
      webtu: event["value"],
      webwe: event["value"],
      webth: event["value"],
      webfr: event["value"],
    });
  }

  addselectTolerance(event) {
    this.addDropDownsForm.patchValue({
      tosa: event["value"],
      tosu: event["value"],
      tomo: event["value"],
      totu: event["value"],
      towe: event["value"],
      toth: event["value"],
      tofr: event["value"],
    });
  }

  addselectMinimum(event) {
    this.addDropDownsForm.patchValue({
      misa: event["value"],
      misu: event["value"],
      mimo: event["value"],
      mitu: event["value"],
      miwe: event["value"],
      mith: event["value"],
      mifr: event["value"],
    });
  }

  //Loding the Addding Employee Form.

  addEmployeeFormInputs() {
    this.addNewEmployeeForm = new FormGroup({
      addnationality: new FormControl("", [Validators.required]),
      addempCode: new FormControl("", [Validators.required]),
      aFirstName: new FormControl("", [Validators.required]),
      aLastName: new FormControl("", [Validators.required]),
      aWorkEmail: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      aPhoneNumber: new FormControl(""),
    });
  }

  addDropDownFormInputs() {
    this.addDropDownsForm = this.formBuilder.group({
      teamDropdownValue: [""],
      empTypeDropdownValue: [""],
      roleDropdownValue: [""],

      workLocDropdownValue: [""],
      timeZoneDropdownValue: [""],
      timeFormatDropdownValue: [""],
      addStatusDropdownValue: [""],

      workSettings: [""],
      addwrkProfileEffectiveDay: [""],
      startTimeDropdownValue: [""],
      endTimeDropdownValue: [""],
      addCheckinTolerance: [""],
      addBreakTimeLimit: [""],

      totalHoursDropdownValue: [""],

      addFlexibleCheckbox: [""],

      editCheckInAfter: [""],
      editCheckOutBefore: [""],
      editTotalHoursDropdownValue: [""],
      editBreakTimeLimitFlex: [""],

      editCostomWorkDays: [""],

      saIsFlex: [""],
      StartSaturday: [""],
      EndSaturday: [""],
      tosa: [""],
      misa: [""],
      wsasa: [""],
      websa: [""],
      btlsa: [""],

      suIsFlex: [""],
      StartSunday: [""],
      EndSunday: [""],
      tosu: [""],
      misu: [""],
      wsasu: [""],
      websu: [""],
      btlsu: [""],

      moIsFlex: [""],
      StartMonday: [""],
      EndMonday: [""],
      tomo: [""],
      mimo: [""],
      wsamo: [""],
      webmo: [""],
      btlmo: [""],

      tuIsFlex: [""],
      StartTuesday: [""],
      EndTuesday: [""],
      totu: [""],
      mitu: [""],
      wsatu: [""],
      webtu: [""],
      btltu: [""],

      weIsFlex: [""],
      StartWednesday: [""],
      EndWednesday: [""],
      towe: [""],
      miwe: [""],
      wsawe: [""],
      webwe: [""],
      btlwe: [""],

      thIsFlex: [""],
      StartThursday: [""],
      EndThursday: [""],
      toth: [""],
      mith: [""],
      wsath: [""],
      webth: [""],
      btlth: [""],

      frIsFlex: [""],
      StartFriday: [""],
      EndFriday: [""],
      tofr: [""],
      mifr: [""],
      wsafr: [""],
      webfr: [""],
      btlfr: [""],
    });
  }

  addEmployeeLeaveFormInputs() {
    this.addNewEmployeeLeaveForm = this.formBuilder.group({
      aJoinedDate: ["", Validators.required],
      aEndDate: [""],
      aProfileStartDate: [""],
      openBalance: [
        "",
        [Validators.pattern(/\b([0-9]|[12][0-9]|3[0-9]|4[0-5])\b/)],
      ],
      leaveTaken: [""],
      leaveTakenSick: [""],
      leaveProfileDropdownValue: [""],
      isWeekDayOvertime: [""],
      isHoliDayOvertime: [""],
      overtimeHour: [""],
      overtimeMinute: [""],
    });
  }

  AddAditionalDocInput() {
    this.AddAditionalDoc = this.formBuilder.group({
      docName: [""],
      docExpDate: [""],
    });
  }

  //Loding the Editing Employee Form.

  editEmployeeFormInputs() {
    this.editEmployeeForm = new FormGroup({
      nationality: new FormControl("", [Validators.required]),
      empCode: new FormControl("", [Validators.required]),
      eFirstName: new FormControl("", [Validators.required]),
      eLastName: new FormControl("", [Validators.required]),
      eWorkEmail: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
    });
  }

  editDropDownFormInputs() {
    this.editDropDownsForm = this.formBuilder.group({
      editTeamDropdownValue: [""],
      editEmpTypeDropdownValue: [""],
      editRoleDropdownValue: [""],

      editworkLocDropdownValue: [""],
      editTimeZoneDropdownValue: [""],
      editTimeFormatDropdownValue: [""],
      editStatusDropdownValue: [""],

      workSettings: [""],
      wrkProfileEffectiveDay: [""],

      editStartTimeDropdownValue: [""],
      editEndTimeDropdownValue: [""],
      editCheckinTolerance: [""],
      editLessHourTolerance: [""],
      editBreakTimeLimit: [""],

      editFlexibleCheckbox: [""],

      editCheckInAfter: [""],
      editCheckOutBefore: [""],
      editTotalHoursDropdownValue: [""],
      editBreakTimeLimitFlex: [""],
      editLessHourToleranceFlex: [""],

      editWorkingHours: [""],
      editadjustedCheckoutTime: [""],

      editCostomWorkDays: [""],

      saIsFlex: [""],
      StartSaturday: [""],
      EndSaturday: [""],
      tosa: [""],
      misa: [""],
      wsasa: [""],
      websa: [""],
      btlsa: [""],
      lhtsa: [""],
      actsa: [""],
      whsa: [""],

      suIsFlex: [""],
      StartSunday: [""],
      EndSunday: [""],
      tosu: [""],
      misu: [""],
      wsasu: [""],
      websu: [""],
      btlsu: [""],
      lhtsu: [""],
      actsu: [""],
      whsu: [""],

      moIsFlex: [""],
      StartMonday: [""],
      EndMonday: [""],
      tomo: [""],
      mimo: [""],
      wsamo: [""],
      webmo: [""],
      btlmo: [""],
      lhtmo: [""],
      actmo: [""],
      whmo: [""],

      tuIsFlex: [""],
      StartTuesday: [""],
      EndTuesday: [""],
      totu: [""],
      mitu: [""],
      wsatu: [""],
      webtu: [""],
      btltu: [""],
      lhttu: [""],
      acttu: [""],
      whtu: [""],

      weIsFlex: [""],
      StartWednesday: [""],
      EndWednesday: [""],
      towe: [""],
      miwe: [""],
      wsawe: [""],
      webwe: [""],
      btlwe: [""],
      lhtwe: [""],
      actwe: [""],
      whwe: [""],

      thIsFlex: [""],
      StartThursday: [""],
      EndThursday: [""],
      toth: [""],
      mith: [""],
      wsath: [""],
      webth: [""],
      btlth: [""],
      lhtth: [""],
      actth: [""],
      whth: [""],

      frIsFlex: [""],
      StartFriday: [""],
      EndFriday: [""],
      tofr: [""],
      mifr: [""],
      wsafr: [""],
      webfr: [""],
      btlfr: [""],
      lhtfr: [""],
      actfr: [""],
      whfr: [""],
    });
  }

  editEmployeeLeaveFormInputs() {
    this.editEmployeeLeaveForm = this.formBuilder.group({
      editJoinedDate: ["", Validators.required],
      editEndDate: [""],
      editProfileStartDate: [""],
      editopenBalance: [
        "",
        [Validators.pattern(/\b([0-9]|[12][0-9]|3[0-9]|4[0-5])\b/)],
      ],
      editleaveTaken: [""],
      editleaveTakenSick: [""],
      editleaveProfileDropdownValue: [""],
      isWeekDayOvertime: [""],
      isHoliDayOvertime: [""],
      overtimeHour: [""],
      overtimeMinute: [""],
    });
  }

  editEmployeeExtensionInputs() {
    this.editEmployeeExtension = this.formBuilder.group({
      //personal Details
      dateofbirth: [""],
      maritalStatus: [""],
      nationality: [""],
      phoneNo: [""],
      personalEmail: [""],
      //emergencgy details
      gardianContact: [""],
      emergencyContact: [""],
      gardianRelation: [""],
      //passport details
      fullNamePst: [""],
      passNumber: [""],
      passIssueContry: [""],
      passIssueDate: [""],
      passExpDate: [""],
      //Address Details
      adr1: [""],
      adr2: [""],
      adrCity: [""],
      adrCountry: [""],
      adrPostalCode: [""],
      isconsame: [""],
      conAdr1: [""],
      conAdr2: [""],
      conCity: [""],
      conCountry: [""],
      conPostalCode: [""],
      //contract details
      conStart: [""],
      conEnd: [""],
      labourId: [""],
      labourExpDate: [""],
      //immigration Details
      visaId: [""],
      visaType: [""],
      visaExpDate: [""],
      emiratesId: [""],
      emiratesIdExpDate: [""],
      //Insurance Details
      insProvider: [""],
      insPloicy: [""],
      insExp: [""],
      //bank details
      bankName: [""],
      bankBranch: [""],
      accNumber: [""],
      iban: [""],
      swiftCode: [""],
      //salary details
      salEffDate: [""],
      basicPay: [""],
      travelAllow: [""],
      accoAllow: [""],
      aOneName: [""],
      aOne: [""],
      aTwoName: [""],
      aTwo: [""],
      aThreeName: [""],
      aThree: [""],
      taxDed: [""],
      insDed: [""],
      dOneName: [""],
      dOne: [""],
      dTwoName: [""],
      dTwo: [""],
      dThreeName: [""],
      dThree: [""],
    });
  }

  backToSettings() {
    if (this.myRequest) {
      this.employeePresent = true;
      this.showAddEdit = true;
      this.myRequest = false;
    } else {
      this.Router.navigate(["settings-new"]);
    }
  }

  userInfo;
  checkUserRights() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = { id: user_info.role_id };
    this.userInfo = user_info;

    this.userService.GetAccessRightsbyRole(postData).subscribe((data: any) => {
      //console.log('rights',data)
      data.map((item) => {
        item.module_name = item.module_name.replace(/\s+/g, "");
        return item;
      });

      this.commonModuleName = _.groupBy(data, "module_name");
      // Restricting View
      if (this.commonModuleName.HumanResource) {
        this.accessToPage = true;
      } else {
        this.accessToPage = false;
      }

      //team members
      if (this.commonModuleName.TeamMembers) {
        this.teamMemberModuleID = this.commonModuleName.TeamMembers[0].id;

        this.commonModuleName.TeamMembers.map((elm) => {
          if (elm.section_name === "Add / Edit") {
            if (elm.is_allow === true) {
              this.showAddEdit = elm.is_allow;
              this.AddEditSectionName = elm.section_name;
            }
          }

          if (elm.section_name === "Delete") {
            if (elm.is_allow === true) {
              this.showDelete = elm.is_allow;
              this.deleteSectionName = elm.section_name;
            }
          }

          if (elm.section_name === "Approve/Disapprove Team Members") {
            if (elm.is_allow === true) {
              this.appDisappTeamMembers = elm.is_allow;
            }
          }
        });
        this.checkApprover(user_info.role_id);
      }
    });
  }

  checkApprover(role_id) {
    let postData = {
      roleID: role_id,
      moduleID: this.teamMemberModuleID,
    };

    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe((data: any) => {
      //add edit
      data.map((elm) => {
        if (elm.section_name === this.AddEditSectionName) {
          if (elm.is_full_access) {
            this.addEditSectionFullAccess = true;
          } else {
            this.addEditSectionFullAccess = false;
            if (elm.approver1_roleId !== null) {
              this.addEditApprover1Value = elm.approver1_roleId;
              this.addEditApprover1Name = elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.addEditdualApprovalDiv = true;
                this.addEditApprover2Value = elm.approver2_roleId;
                this.addEditApprover2Name = elm.approver2_role_name;
              }
            }
          }
        }
      });

      //delete
      data.map((elm) => {
        if (elm.section_name === this.deleteSectionName) {
          if (elm.is_full_access) {
            this.deleteSectionFullAccess = true;
          } else {
            this.deleteSectionFullAccess = false;
            if (elm.approver1_roleId !== null) {
              this.deleteApprover1Value = elm.approver1_roleId;
              this.deleteApprover1Name = elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.deletedualApprovalDiv = true;
                this.deleteApprover2Value = elm.approver2_roleId;
                this.deleteApprover2Name = elm.approver2_role_name;
              }
            }
          }
        }
      });
    });
  }

  //notification request
  checkNotificationRequest() {
    let getNotValue = JSON.parse(localStorage.getItem("notData"));

    //return if there is no message!
    if (getNotValue) {
    } else {
      return;
    }

    this.originalViewEditNotificationModelData = getNotValue;
    let message = localStorage.getItem("message");

    localStorage.removeItem("notData");
    localStorage.removeItem("message");

    if (
      getNotValue.message === "Requested Approval for Creating new Employee"
    ) {
      let postData = { id: getNotValue.reference_id };
      this.empService
        .GetEmpOverrideDetailsById(postData)
        .subscribe((data: any) => {
          console.log("add employee popup details", data);
          let serverData = data;
          if (!this.showButtonDiv) {
            serverData["message"] = "Approval for Creating new Employee";
          } else {
            serverData["message"] =
              this.originalViewEditNotificationModelData.message;
          }
          this.viewEditNotificationModelData = serverData;
          this.sendEmployeeData = Object.assign({}, serverData[0]);
          console.log(this.viewEditNotificationModelData);
          this.spinner.hide();
          this.addEmployeeRequest = true;
        });
      $("#notificationModal").modal("show");
    } else if (
      getNotValue.message === "Requested Approval for Updating Employee Details"
    ) {
      this.getNotificData(getNotValue, message);

      //this.getViewNotification(getNotValue, message);
    } else if (
      getNotValue.message === "Requested Approval for Delete Employee Details"
    ) {
      console.log("came in for deleting !!!");
      let postData = { id: getNotValue.reference_id };
      this.empService
        .GetEmpOverrideDetailsById(postData)
        .subscribe((data: any) => {
          if (data) {
            console.log(data);
            let serverData = data;
            this.viewDeleteNotificationModelData = serverData.overrideData;
            this.viewDeleteNotificationModelData["created_by_name"] =
              getNotValue.created_by_name;
            this.viewDeleteNotificationModelData["message"] =
              "Approval for Delete Employee Details";
            console.log("for checking", this.viewDeleteNotificationModelData);

            this.updateApproverDetails.approver1_roleId =
              this.viewDeleteNotificationModelData.approver1_roleId;
            this.updateApproverDetails.approver2_roleId =
              this.viewDeleteNotificationModelData.approver2_roleId;
            this.empService
              .getRoleNameByroleID({
                id: this.updateApproverDetails.approver1_roleId,
              })
              .subscribe((role1name) => {
                if (role1name) {
                  this.updateApproverDetails.approver1_roleName =
                    role1name[0].role_name;
                }
              });
            this.adminService
              .FindEmpByRoleId({
                id: this.updateApproverDetails.approver1_roleId,
              })
              .subscribe((empName: any) => {
                if (empName) {
                  this.updateApproverDetails.approver1_name = empName.full_name;
                }
              });
            if (this.viewDeleteNotificationModelData.approver2_roleId != null) {
              this.NoIsDual = true;
              console.log("Its getting inside the approver 2");
              this.empService
                .getRoleNameByroleID({
                  id: this.updateApproverDetails.approver2_roleId,
                })
                .subscribe((role2name) => {
                  if (role2name) {
                    this.updateApproverDetails.approver2_roleName =
                      role2name[0].role_name;
                  }
                });
              this.adminService
                .FindEmpByRoleId({
                  id: this.updateApproverDetails.approver2_roleId,
                })
                .subscribe((empName2: any) => {
                  if (empName2) {
                    this.updateApproverDetails.approver2_name =
                      empName2.full_name;
                  }
                });
            }
            this.updateApproverDetails.is_approved1 =
              this.viewDeleteNotificationModelData.is_approved1;
            this.updateApproverDetails.is_approved2 =
              this.viewDeleteNotificationModelData.is_approved2;
            this.updateApproverDetails.ondate_approver1 =
              this.viewDeleteNotificationModelData.ondate_approver1;
            this.updateApproverDetails.ondate_approver2 =
              this.viewDeleteNotificationModelData.ondate_approver2;
            this.updateApproverDetails.update_status =
              this.viewDeleteNotificationModelData.update_status;

            this.spinner.hide();
            this.deleteEmployeeRequest = true;
            console.log();
            $("#notificationModal").modal("show");
          }
        });
    } else {
      console.log("No Request", getNotValue);
    }
  }

  notificationData;
  NoIsDual = false;
  NoApprove1Name = "";
  NoApprove2Name = "";
  NoApprove2Value = "";
  fromNotification = false;
  sendApproveRestestDual = false;

  getNotificData(notData, message) {
    this.fromNotification = true;
    let draftdata;
    let postempext;
    let empbasic;
    let postempid;
    let empext;

    if (notData.read_status == true) {
      Swal.fire({
        title: "Notification Already Processed",
        text: "This notification has already been taken action. No further action is required.",
        confirmButtonText: " Confirm",
      });
      return;
    }

    console.log("start here", notData, message);
    this.notificationData = notData;
    this.originalViewEditNotificationModelData = notData;

    setTimeout(() => {
      if (this.draftEmployeeList) {
        draftdata = this.draftEmployeeList.find(
          (x) => x.id == notData.reference_id
        );
        this.originalEditEmpData = draftdata;
        this.editEmployeeDivDraft(draftdata);
        postempext = {
          orgID: localStorage.getItem("org_id"),
          empID: draftdata.emp_id,
        };
        postempid = {
          id: draftdata.emp_id,
        };
        if (draftdata.approver2_roleId != null) {
          this.NoIsDual = true;
        }
        if (
          draftdata.approver2_roleId != null &&
          draftdata.is_approved1 == false
        ) {
          this.sendApproveRestestDual = true;
        }

        this.empService
          .getByEmployeeID(postempid)
          .subscribe((basicdata: any) => {
            if (basicdata != null) {
              empbasic = basicdata;
              this.empService
                .GetEmployeeExtensionByempId(postempext)
                .subscribe((extdata: any) => {
                  if (extdata != null) {
                    empext = extdata;
                    console.log("inside the get employee details section");
                    this.currentEmployeeData = empext;
                    this.currentEmployeeData.first_name = empbasic.first_name;
                    this.currentEmployeeData.last_name = empbasic.last_name;
                    this.currentEmployeeData.full_name = empbasic.full_name;
                    this.currentEmployeeData.workemail = empbasic.workemail;
                    this.currentEmployeeData.joined_date = empbasic.joined_date;
                    this.currentEmployeeData.emp_type_id = empbasic.emp_type_id;
                    this.currentEmployeeData.role_id = empbasic.role_id;
                    this.currentEmployeeData.time_zone = empbasic.time_zone;
                    this.currentEmployeeData.time_format = empbasic.time_format;
                    this.currentEmployeeData.work_profile_effective_day =
                      empbasic.work_profile_effective_day;
                    this.currentEmployeeData.working_days =
                      empbasic.working_days;
                    this.currentEmployeeData.is_flexible = empbasic.is_flexible;
                    this.currentEmployeeData.work_start_time =
                      empbasic.work_start_time;
                    this.currentEmployeeData.work_end_time =
                      empbasic.work_end_time;
                    this.currentEmployeeData.checkin_tolarence =
                      empbasic.checkin_tolarence;
                    this.currentEmployeeData.break_time = empbasic.break_time;
                    this.currentEmployeeData.checkin_after =
                      empbasic.checkin_after;
                    this.currentEmployeeData.checkout_before =
                      empbasic.checkout_before;
                    this.currentEmployeeData.min_hrs_flx = empbasic.min_hrs_flx;
                    this.currentEmployeeData.break_time_flx =
                      empbasic.break_time_flx;
                    this.currentEmployeeData.work_days_exp =
                      empbasic.work_days_exp;
                    this.currentEmployeeData.leave_profile_setup_id =
                      empbasic.leave_profile_setup_id;
                    this.currentEmployeeData.profile_effective_from_date =
                      empbasic.profile_effective_from_date;
                    this.currentEmployeeData.open_balance_days =
                      empbasic.open_balance_days;
                    this.currentEmployeeData.gender = empbasic.gender;
                    this.currentEmployeeData.emp_status_id =
                      empbasic.emp_status_id;
                    this.currentEmployeeData.team_id = empbasic.team_id;
                    this.currentEmployeeData.work_location =
                      empbasic.work_location;
                    this.currentEmployeeData.workday_settings =
                      empbasic.workday_settings;
                    this.currentEmployeeData.is_weekday_overtime_enabled =
                      empbasic.is_weekday_overtime_enabled;
                    this.currentEmployeeData.is_holiday_overtime_enabled =
                      empbasic.is_holiday_overtime_enabled;
                    this.currentEmployeeData.minimum_overtime =
                      empbasic.minimum_overtime;
                    //this.currentEmployeeData.
                    this.comparechangesforapprover();
                    //this.currentEmployeeData.emp_status_id = empbasic.full_name
                  }
                });
            }
          });
      }
    }, 2000);
  }

  compareDocData: any = [];
  groupedData: any = [];
  updateApproverDetails = {
    approver1_roleId: "",
    approver2_roleId: "",
    approver1_name: "",
    approver2_name: "",
    approver1_roleName: "",
    approver2_roleName: "",
    ondate_approver1: "",
    ondate_approver2: "",
    approver1_notes: "",
    approver2_notes: "",
    is_approved1: "",
    is_approved2: "",
    update_status: "",
  };

  chfirst = false;
  chlast = false;
  chgen = false;
  chemail = false;
  chstatus = false;
  chteam = false;
  chjoin = false;
  chtype = false;
  chrole = false;
  chloca = false;
  chtime = false;
  chformat = false;

  chwkset = false;
  chwrefdate = false;
  chwkdays = false;
  chwkexpdays = false;

  chprofi = false;
  chprofiopen = false;
  chefday = false;
  choverweek = false;
  choverholi = false;
  chovtime = false;

  chdob = false;
  chmrst = false;
  chpsnum = false;
  chpemal = false;
  chemcont = false;
  chconum = false;
  chcnrel = false;

  chpsname = false;
  chpstnum = false;
  chpstcon = false;
  chpstisdt = false;
  chpstexp = false;

  chpnation = false;
  chpfirst = false;
  chplast = false;
  chpmail = false;
  chpphone = false;
  chptype = false;
  chpteam = false;
  chprole = false;
  chpstatus = false;


  chadr1 = false;
  chadr2 = false;
  chadrci = false;
  chcon = false;
  chzip = false;

  chhadr1 = false;
  chhadr2 = false;
  chhadrci = false;
  chhcon = false;
  chhzip = false;

  chconstdt = false;
  chconeddt = false;
  chlobr = false;
  chlaexp = false;

  chvisnum = false;
  chvistyp = false;
  chviexp = false;
  chemid = false;
  chemexp = false;

  chipn = false;
  chipon = false;
  chivex = false;

  chbkname = false;
  chbkbrch = false;
  chbknum = false;
  chbkiban = false;
  chbkswift = false;

  chbpay = false;
  chalacco = false;
  chaltrav = false;
  chalone = false;
  chaltwo = false;
  chalthree = false;
  chdetax = false;
  chdeins = false;
  chdeone = false;
  chdetwo = false;
  chdethree = false;
  chgrp = false;
  chnetdect = false;
  chntpay = false;

  comparechangesforapprover() {
    let changesection = [];

    console.log("currentemployee", this.currentEmployeeData);
    console.log("drafted details", this.originalEditEmpData);

    //general details
    if (
      this.currentEmployeeData.first_name &&
      this.originalEditEmpData.first_name
    ) {
      if (
        this.currentEmployeeData.first_name !=
        this.originalEditEmpData.first_name
      ) {
        this.chfirst = true;
        changesection.push({
          section: "General Details",
          field: "First Name",
          oldvalue: this.currentEmployeeData.first_name,
          newvalue: this.originalEditEmpData.first_name,
        });
      }
    }

    if (this.istermination == true) {
      changesection.push({
        section: "General Details",
        field: "Termination Details",
        oldvalue: "Last Date By",
        newvalue: this.terminationData.term_end_by,
      });
      changesection.push({
        section: "General Details",
        field: "Termination Details",
        oldvalue: "Last Date",
        newvalue: this.terminationData.term_end_date,
      });
      changesection.push({
        section: "General Details",
        field: "Termination Details",
        oldvalue: "Type",
        newvalue: this.terminationData.term_type,
      });
      changesection.push({
        section: "General Details",
        field: "Termination Details",
        oldvalue: "Reason",
        newvalue: this.terminationData.term_reason,
      });
      changesection.push({
        section: "General Details",
        field: "Termination Details",
        oldvalue: "Remarks",
        newvalue: this.terminationData.remarks,
      });
    }

    if (
      this.currentEmployeeData.last_name &&
      this.originalEditEmpData.last_name
    ) {
      if (
        this.currentEmployeeData.last_name != this.originalEditEmpData.last_name
      ) {
        this.chlast = true;
        changesection.push({
          section: "General Details",
          field: "Last Name",
          oldvalue: this.currentEmployeeData.last_name,
          newvalue: this.originalEditEmpData.last_name,
        });
      }
    }

    if (this.currentEmployeeData.gender && this.originalEditEmpData.gender) {
      if (this.currentEmployeeData.gender != this.originalEditEmpData.gender) {
        this.chgen = true;

        changesection.push({
          section: "General Details",
          field: "Gender",
          oldvalue: this.currentEmployeeData.gender,
          newvalue: this.originalEditEmpData.gender,
        });
      }
    }

    //employee status
    if (
      this.currentEmployeeData.emp_status_id &&
      this.originalEditEmpData.emp_status_id
    ) {
      if (
        this.currentEmployeeData.emp_status_id !=
        this.currentEmployeeData.emp_status_id
      ) {
        this.chstatus = true;
        let curempidvalue = this.empstatusData.find(
          (x) => x.id == this.currentEmployeeData.emp_status_id
        );
        let editempidvalue = this.empstatusData.find(
          (x) => x.id == this.originalEditEmpData.emp_status_id
        );
        changesection.push({
          section: "General Details",
          field: "Employee Status",
          oldvalue: curempidvalue.description,
          newvalue: editempidvalue.description,
        });
      }
    }

    //employee Team

    if (
      this.currentEmployeeData.joined_date &&
      this.originalEditEmpData.joined_date
    ) {
      if (
        moment(this.currentEmployeeData.joined_date).format("L") !=
        moment(this.originalEditEmpData.joined_date).format("L")
      ) {
        this.chjoin = true;
        changesection.push({
          section: "General Details",
          field: "Joined Date",
          oldvalue: moment(this.currentEmployeeData.joined_date).format("L"),
          newvalue: moment(this.originalEditEmpData.joined_date).format("L"),
        });
      }
    }

    //Administrator Details
    if (
      this.currentEmployeeData.emp_type_id &&
      this.originalEditEmpData.emp_type_id
    ) {
      if (
        this.currentEmployeeData.emp_type_id !=
        this.originalEditEmpData.emp_type_id
      ) {
        this.chtype = true;
        let curempidvalue = this.employeeTypeData.find(
          (x) => x.id == this.currentEmployeeData.emp_type_id
        );
        let editempidvalue = this.employeeTypeData.find(
          (x) => x.id == this.originalEditEmpData.emp_type_id
        );
        changesection.push({
          section: "Administrator Details",
          field: "Employee Type",
          oldvalue: curempidvalue.description,
          newvalue: editempidvalue.description,
        });
      }
    }

    if (this.currentEmployeeData.role_id && this.originalEditEmpData.role_id) {
      if (
        this.currentEmployeeData.role_id != this.originalEditEmpData.role_id
      ) {
        this.chrole = true;
        let curempvalue = this.employeeRoleData.find(
          (x) => x.id == this.currentEmployeeData.role_id
        );
        let editempvalue = this.employeeRoleData.find(
          (x) => x.id == this.originalEditEmpData.role_id
        );
        changesection.push({
          section: "Administrator Details",
          field: "Employee Role",
          oldvalue: curempvalue.description,
          newvalue: editempvalue.description,
        });
      }
    }

    //Geo Details
    if (
      this.currentEmployeeData.work_location &&
      this.originalEditEmpData.work_location
    ) {
      if (
        this.currentEmployeeData.work_location !=
        this.originalEditEmpData.work_location
      ) {
        this.chloca = true;
        changesection.push({
          section: "Geo Details",
          field: "Work Location",
          oldvalue: this.currentEmployeeData.work_location,
          newvalue: this.originalEditEmpData.work_location,
        });
      }
    }

    if (
      this.currentEmployeeData.time_zone &&
      this.originalEditEmpData.time_zone
    ) {
      if (
        this.currentEmployeeData.time_zone.toString() !=
        this.originalEditEmpData.time_zone.toString()
      ) {
        this.chtime = true;
        changesection.push({
          section: "Geo Details",
          field: "Time Zone",
          oldvalue: this.currentEmployeeData.time_zone,
          newvalue: this.originalEditEmpData.time_zone,
        });
      }
    }

    if (
      this.currentEmployeeData.time_format &&
      this.originalEditEmpData.time_format.id
    ) {
      if (
        this.currentEmployeeData.time_format.toString() !=
        this.originalEditEmpData.time_format.id.toString()
      ) {
        this.chformat = true;
        changesection.push({
          section: "Geo Details",
          field: "Time Format",
          oldvalue: this.currentEmployeeData.time_format,
          newvalue: this.originalEditEmpData.time_format,
        });
      }
    }

    //Workday setting
    if (
      this.currentEmployeeData.workday_settings &&
      this.originalEditEmpData.workday_settings
    ) {
      if (
        this.currentEmployeeData.workday_settings !=
        this.originalEditEmpData.workday_settings
      ) {
        this.chwkset = true;
        changesection.push({
          section: "Work Days",
          field: "Workday Settings",
          oldvalue: this.currentEmployeeData.workday_settings,
          newvalue: this.originalEditEmpData.workday_settings,
        });
      }
    }

    if (
      this.currentEmployeeData.work_profile_effective_day &&
      this.originalEditEmpData.work_profile_effective_day
    ) {
      if (
        moment(this.currentEmployeeData.work_profile_effective_day).format(
          "L"
        ) !=
        moment(this.originalEditEmpData.work_profile_effective_day).format("L")
      ) {
        this.chwkexpdays = true;
        changesection.push({
          section: "Work Days",
          field: "Work Profile Effective Date",
          oldvalue: moment(
            this.currentEmployeeData.work_profile_effective_day
          ).format("L"),
          newvalue: moment(
            this.originalEditEmpData.wrkProfileEffectiveDay
          ).format("L"),
        });
      }
    }

    //for working days
    if (
      (this.currentEmployeeData.working_days || "").trim() &&
      (this.originalEditEmpData.working_days || "").trim()
    ) {
      if (
        this.currentEmployeeData.working_days !=
        this.originalEditEmpData.working_days
      ) {
        this.chwkdays = true;
        changesection.push({
          section: "Work Days",
          field: "Work Days",
          oldvalue: this.currentEmployeeData.working_days,
          newvalue: this.originalEditEmpData.working_days,
        });
      }
    }

    if (
      (this.currentEmployeeData.work_days_exp || "").trim() &&
      (this.originalEditEmpData.work_days_exp || "").trim()
    ) {
      if (
        this.currentEmployeeData.work_days_exp !=
        this.originalEditEmpData.work_days_exp
      ) {
        this.chwkexpdays = true;
        changesection.push({
          section: "Work Days",
          field: "Custom Work Days",
          oldvalue: this.currentEmployeeData.working_days,
          newvalue: this.originalEditEmpData.working_days,
        });
      }
    }

    //Leave Details
    if (
      this.currentEmployeeData.leave_profile_setup_id &&
      this.originalEditEmpData.leave_profile_setup_id
    ) {
      if (
        (this.currentEmployeeData.leave_profile_setup_id || "").trim() !=
        (this.originalEditEmpData.leave_profile_setup_id || "").trim()
      ) {
        this.chprofi = true;
        let curempidvalue = this.leaveProfileType.find(
          (x) => x.id == this.currentEmployeeData.leave_profile_setup_id
        );
        let editempidvalue = this.leaveProfileType.find(
          (x) => x.id == this.originalEditEmpData.leave_profile_setup_id
        );
        changesection.push({
          section: "Leave Details",
          field: "Leave Profile",
          oldvalue: curempidvalue.description,
          newvalue: editempidvalue.editleaveProfileDropdownValue.description,
        });
      }
    }

    if (
      this.currentEmployeeData.open_balance_days &&
      this.originalEditEmpData.open_balance_days
    ) {
      if (
        (this.currentEmployeeData.open_balance_days || "").trim() !=
        (this.originalEditEmpData.open_balance_days || "").trim()
      ) {
        this.chprofiopen = true;
        changesection.push({
          section: "Leave Details",
          field: "Open Balance",
          oldvalue: this.currentEmployeeData.open_balance_days,
          newvalue: this.originalEditEmpData.open_balance_days,
        });
      }
    }

    // if (moment(this.currentEmployeeData.profile_effective_from_date).format("L") != moment(editLeaveForm.editProfileStartDate).format("L")) {
    //   changesection.push({ 'section': 'Leave Details', 'field': 'Profile Effective Date', 'oldvalue': moment(this.currentEmployeeData.profile_effective_from_date).format("L"), 'newvalue': moment(editLeaveForm.editProfileStartDate).format("L") })
    // }

    // if (this.currentEmployeeData.open_balance_days != editLeaveForm.editopenBalance) {
    //   changesection.push({ 'section': 'Leave Details', 'field': 'Open Balance', 'oldvalue': this.currentEmployeeData.open_balance_days, 'newvalue': editLeaveForm.editopenBalance })
    // }

    //Overtime Options|

    if (
      this.currentEmployeeData.is_weekday_overtime_enabled !=
      this.originalEditEmpData.is_weekday_overtime_enabled
    ) {
      this.choverweek = true;
      changesection.push({
        section: "Overtime Option",
        field: "Workday Overtime",
        oldvalue: this.currentEmployeeData.is_weekday_overtime_enabled
          ? "enabled"
          : "disabled",
        newvalue: this.originalEditEmpData.is_weekday_overtime_enabled
          ? "enabled"
          : "disabled",
      });
    }

    if (
      this.currentEmployeeData.is_holiday_overtime_enabled !=
      this.originalEditEmpData.is_holiday_overtime_enabled
    ) {
      this.choverholi = true;
      changesection.push({
        section: "Overtime Option",
        field: "Holiday Ovetime",
        oldvalue: this.currentEmployeeData.is_holiday_overtime_enabled
          ? "enabled"
          : "disabled",
        newvalue: this.originalEditEmpData.is_holiday_overtime_enabled
          ? "enabled"
          : "disabled",
      });
    }

    if (
      this.currentEmployeeData.minimum_overtime != null ||
      this.originalEditEmpData.minimum_overtime != null
    ) {
      if (
        (this.currentEmployeeData.minimum_overtime || "").trim() !=
        (this.originalEditEmpData.minimum_overtime || "").trim()
      ) {
        this.chovtime = true;
        changesection.push({
          section: "Overtime Option",
          field: "Minimum Ovetime",
          oldvalue: this.currentEmployeeData.minimum_overtime,
          newvalue: this.originalEditEmpData.minimum_overtime,
        });
      }
    }

    //Personal Details

    if (
      (this.currentEmployeeData.dob || "").trim() != null ||
      (this.originalEditEmpData.dob || "").trim()
    ) {
      if (
        moment(this.currentEmployeeData.dob).format("L") !=
        moment(this.originalEditEmpData.dob).format("L")
      ) {
        this.chdob = true;
        changesection.push({
          section: "Personal Details",
          field: "Date of Birth",
          oldvalue: moment(this.currentEmployeeData.dob).format("L"),
          newvalue: moment(this.originalEditEmpData.dob).format("L"),
        });
      }
    }

    if (
      (this.currentEmployeeData.marital_status || "").trim() !=
      (this.originalEditEmpData.marital_status || "").trim()
    ) {
      this.chmrst = true;
      changesection.push({
        section: "Personal Details",
        field: "Marital Status",
        oldvalue: this.currentEmployeeData.marital_status,
        newvalue: this.originalEditEmpData.marital_status,
      });
    }

    if (this.currentEmployeeData.phone_no != null) {
      if (
        (this.currentEmployeeData.phone_no || "").replace(/\D/g, "").trim() !=
        (this.originalEditEmpData.phone_no || "").replace(/\D/g, "").trim()
      ) {
        this.chpsnum = true;
        changesection.push({
          section: "Personal Details",
          field: "Phone Number",
          oldvalue: this.dbEmpExtData.phone_no,
          newvalue: this.originalEditEmpData.phone_no,
        });
      }
    }

    if (this.currentEmployeeData.pesonal_email != null) {
      if (
        this.currentEmployeeData.pesonal_email !=
        this.originalEditEmpData.pesonal_email
      ) {
        this.chpemal = true;
        changesection.push({
          section: "Personal Details",
          field: "Email Address",
          oldvalue: this.currentEmployeeData.pesonal_email,
          newvalue: this.originalEditEmpData.pesonal_email,
        });
      }
    }

    //Emergency details
    if (
      (this.currentEmployeeData.gardian_contact || "").trim() !=
      (this.originalEditEmpData.gardian_contact || "").trim()
    ) {
      this.chemcont = true;
      changesection.push({
        section: "Emergency Contact Details",
        field: "Contact Name",
        oldvalue: this.currentEmployeeData.gardian_contact,
        newvalue: this.originalEditEmpData.gardian_contact,
      });
    }

    if (
      (this.currentEmployeeData.emergency_contact || "")
        .replace(/\D/g, "")
        .trim() !=
      (this.originalEditEmpData.emergency_contact || "")
        .replace(/\D/g, "")
        .trim()
    ) {
      console.log(
        this.currentEmployeeData.emergency_contact,
        this.originalEditEmpData.emergency_contact,
        "phn"
      );
      this.chconum = true;
      changesection.push({
        section: "Emergency Contact Details",
        field: "Contact Phone Number",
        oldvalue: this.currentEmployeeData.emergency_contact,
        newvalue: this.originalEditEmpData.emergency_contact,
      });
    }

    if (
      (this.currentEmployeeData.gardian_relation || "").trim() !=
      (this.originalEditEmpData.gardian_relation || "").trim()
    ) {
      this.chcnrel = true;
      changesection.push({
        section: "Emergency Contact Details",
        field: "Contact Relation",
        oldvalue: this.currentEmployeeData.gardian_relation,
        newvalue: this.originalEditEmpData.gardian_relation,
      });
    }

    if (sessionStorage.getItem("photo_url")) {
      if (
        this.currentEmployeeData.photo_url !=
        sessionStorage.getItem("photo_url")
      ) {
        changesection.push({
          section: "Photo Details",
          field: "Photo file",
          oldvalue: "Old photo",
          newvalue: "New Photo",
        });
      }
    }

    if (
      (this.currentEmployeeData.full_name_pst || "").trim() !=
      (this.originalEditEmpData.full_name_pst || "").trim()
    ) {
      this.chpsname = true;
      changesection.push({
        section: "Passport Details",
        field: "Passport Full Name",
        oldvalue: this.currentEmployeeData.full_name_pst,
        newvalue: this.originalEditEmpData.full_name_pst,
      });
    }

    if (
      (this.currentEmployeeData.passport_num || "").trim() !=
      (this.originalEditEmpData.passport_num || "").trim()
    ) {
      this.chpstnum = true;
      changesection.push({
        section: "Passport Details",
        field: "Passport Number",
        oldvalue: this.currentEmployeeData.passport_num,
        newvalue: this.originalEditEmpData.passport_num,
      });
    }

    //passport country skiped

    if (
      moment(this.currentEmployeeData.pass_issue_date).format("L") !=
      moment(this.originalEditEmpData.pass_issue_date).format("L")
    ) {
      this.chpstisdt = true;
      changesection.push({
        section: "Passport Details",
        field: "Issue Date",
        oldvalue: moment(this.currentEmployeeData.pass_issue_date).format("L"),
        newvalue: moment(this.originalEditEmpData.pass_issue_date).format("L"),
      });
    }

    if (
      moment(this.currentEmployeeData.pass_exp_date).format("L") !=
      moment(this.originalEditEmpData.pass_exp_date).format("L")
    ) {
      this.chpstexp = true;
      changesection.push({
        section: "Passport Details",
        field: "Expiry Date",
        oldvalue: moment(this.currentEmployeeData.pass_exp_date).format("L"),
        newvalue: moment(this.originalEditEmpData.pass_exp_date).format("L"),
      });
    }

    //local address details
    if (
      (this.currentEmployeeData.adr_1 || "").trim() !=
      (this.originalEditEmpData.adr_1 || "").trim()
    ) {
      this.chadr1 = true;
      changesection.push({
        section: "Address Details",
        field: "Local Address Line 1",
        oldvalue: this.currentEmployeeData.adr_1,
        newvalue: this.originalEditEmpData.adr_1,
      });
    }

    if (
      (this.currentEmployeeData.adr_2 || "").trim() !=
      (this.originalEditEmpData.adr_2 || "").trim()
    ) {
      this.chadr2 = true;
      changesection.push({
        section: "Address Details",
        field: "Local Address Line 2",
        oldvalue: this.currentEmployeeData.adr_2,
        newvalue: this.originalEditEmpData.adr_2,
      });
    }

    if (
      (this.currentEmployeeData.adr_city || "").trim() !=
      (this.originalEditEmpData.adr_city || "").trim()
    ) {
      this.chadrci = true;
      changesection.push({
        section: "Address Details",
        field: "Local Address City",
        oldvalue: this.currentEmployeeData.adr_city,
        newvalue: this.originalEditEmpData.adr_city,
      });
    }

    //skiped country

    if (
      (this.currentEmployeeData.adr_postal_code || "").trim() !=
      (this.originalEditEmpData.adr_postal_code || "").trim()
    ) {
      this.chzip = true;
      changesection.push({
        section: "Address Details",
        field: "Local Address Postal Code",
        oldvalue: this.currentEmployeeData.adr_postal_code,
        newvalue: this.originalEditEmpData.adr_postal_code,
      });
    }

    if (
      (this.currentEmployeeData.contact_adr_1 || "").trim() !=
      (this.originalEditEmpData.contact_adr_1 || "").trim()
    ) {
      this.chhadr1 = true;
      changesection.push({
        section: "Address Details",
        field: "Home Address Line 1",
        oldvalue: this.currentEmployeeData.contact_adr_1,
        newvalue: this.originalEditEmpData.contact_adr_1,
      });
    }

    if (
      (this.currentEmployeeData.contact_adr_2 || "").trim() !=
      (this.originalEditEmpData.contact_adr_2 || "").trim()
    ) {
      this.chhadr2 = true;
      changesection.push({
        section: "Address Details",
        field: "Home Address Line 2",
        oldvalue: this.dbEmpExtData.contact_adr_2,
        newvalue: this.originalEditEmpData.contact_adr_2,
      });
    }

    if (
      (this.currentEmployeeData.contact_city || "").trim() !=
      (this.originalEditEmpData.contact_city || "").trim()
    ) {
      this.chhadrci = true;
      changesection.push({
        section: "Address Details",
        field: "Home Address City",
        oldvalue: this.currentEmployeeData.contact_city,
        newvalue: this.originalEditEmpData.contact_city,
      });
    }

    //skiped contry

    if (
      (this.currentEmployeeData.contact_postal_code || "").trim() !=
      (this.originalEditEmpData.contact_postal_code || "").trim()
    ) {
      this.chhzip = true;
      changesection.push({
        section: "Address Details",
        field: "Home Address Postal Code",
        oldvalue: this.dbEmpExtData.contact_postal_code,
        newvalue: this.originalEditEmpData.contact_postal_code,
      });
    }

    if (
      this.currentEmployeeData.con_start &&
      this.originalEditEmpData.con_start &&
      !moment(this.currentEmployeeData.con_start).isSame(
        moment(this.originalEditEmpData.con_start),
        "day"
      )
    ) {
      this.chconstdt = true;
      changesection.push({
        section: "Contract Details",
        field: "Contract Start Date",
        oldvalue: moment(this.currentEmployeeData.con_start).format("L"),
        newvalue: moment(this.originalEditEmpData.con_start).format("L"),
      });
    }

    if (
      this.currentEmployeeData.con_end &&
      this.originalEditEmpData.con_end &&
      !moment(this.currentEmployeeData.con_end).isSame(
        moment(this.originalEditEmpData.con_end),
        "day"
      )
    ) {
      this.chconeddt = true;
      changesection.push({
        section: "Contract Details",
        field: "Contract End Date",
        oldvalue: moment(this.currentEmployeeData.con_end).format("L"),
        newvalue: moment(this.originalEditEmpData.con_end).format("L"),
      });
    }

    if (
      (this.currentEmployeeData.labour_id || "").trim() !=
      (this.originalEditEmpData.labour_id || "").trim()
    ) {
      this.chlobr = true;
      changesection.push({
        section: "Contract Details",
        field: "Labour ID",
        oldvalue: this.currentEmployeeData.labour_id,
        newvalue: this.originalEditEmpData.labour_id,
      });
    }
    console.log(
      this.currentEmployeeData.labour_exp_date,
      this.originalEditEmpData.labour_exp_date,
      "TEST**"
    );
    if (
      this.currentEmployeeData.labour_exp_date &&
      this.originalEditEmpData.labour_exp_date &&
      !moment(this.currentEmployeeData.labour_exp_date).isSame(
        moment(this.originalEditEmpData.labour_exp_date),
        "day"
      )
    ) {
      console.log(
        this.currentEmployeeData.labour_exp_date,
        this.originalEditEmpData.labour_exp_date,
        "TEST** IN"
      );
      this.chlaexp = true;
      changesection.push({
        section: "Contract Details",
        field: "Labour Expiry Date",
        oldvalue: moment(this.currentEmployeeData.labour_exp_date).format("L"),
        newvalue: moment(this.originalEditEmpData.labour_exp_date).format("L"),
      });
    }

    if (this.currentEmployeeData.visa_id != this.originalEditEmpData.visa_id) {
      this.chvisnum = true;
      changesection.push({
        section: "UAE Immigration Details",
        field: "Visa ID",
        oldvalue: this.currentEmployeeData.visa_id,
        newvalue: this.originalEditEmpData.visa_id,
      });
    }

    if (
      this.currentEmployeeData.visa_type != this.originalEditEmpData.visa_type
    ) {
      this.chvistyp = true;
      changesection.push({
        section: "UAE Immigration Details",
        field: "Visa Type",
        oldvalue: this.currentEmployeeData.visa_type,
        newvalue: this.originalEditEmpData.visa_type,
      });
    }

    if (
      this.currentEmployeeData.visa_exp_date &&
      this.originalEditEmpData.visa_exp_date &&
      !moment(this.currentEmployeeData.visa_exp_date).isSame(
        moment(this.originalEditEmpData.visa_exp_date),
        "day"
      )
    ) {
      this.chviexp = true;
      changesection.push({
        section: "UAE Immigration Details",
        field: "Visa Expiry Date",
        oldvalue: moment(this.currentEmployeeData.visa_exp_date).format("L"),
        newvalue: moment(this.originalEditEmpData.visa_exp_date).format("L"),
      });
    }

    if (
      this.currentEmployeeData.emirates_id !=
      this.originalEditEmpData.emirates_id
    ) {
      this.chemid = true;
      changesection.push({
        section: "UAE Immigration Details",
        field: "Emirates ID",
        oldvalue: this.currentEmployeeData.emirates_id,
        newvalue: this.originalEditEmpData.emirates_id,
      });
    }

    if (
      this.currentEmployeeData.emirates_id_exp_date &&
      this.originalEditEmpData.emirates_id_exp_date &&
      !moment(this.currentEmployeeData.emirates_id_exp_date).isSame(
        moment(this.originalEditEmpData.emirates_id_exp_date),
        "day"
      )
    ) {
      this.chemexp = true;
      changesection.push({
        section: "UAE Immigration Details",
        field: "Emirates Expiry Date",
        oldvalue: moment(this.currentEmployeeData.emirates_id_exp_date).format(
          "L"
        ),
        newvalue: moment(this.originalEditEmpData.emirates_id_exp_date).format(
          "L"
        ),
      });
    }

    //insurance change

    if (
      this.currentEmployeeData.ins_provider &&
      this.originalEditEmpData.ins_provider
    ) {
      if (
        this.currentEmployeeData.ins_provider.toString() !=
        this.originalEditEmpData.ins_provider.toString()
      ) {
        this.chipn = true;
        changesection.push({
          section: "Insurance Details",
          field: "Provider Name",
          oldvalue: this.currentEmployeeData.ins_provider,
          newvalue: this.originalEditEmpData.ins_provider,
        });
      }
    }

    if (
      this.currentEmployeeData.ins_policy &&
      this.originalEditEmpData.ins_policy
    ) {
      if (
        this.currentEmployeeData.ins_policy.toString() !=
        this.originalEditEmpData.ins_policy.toString()
      ) {
        this.chipon = true;
        changesection.push({
          section: "Insurance Details",
          field: "Policy Number",
          oldvalue: this.currentEmployeeData.ins_policy,
          newvalue: this.originalEditEmpData.ins_policy,
        });
      }
    }

    if (this.currentEmployeeData.ins_exp && this.originalEditEmpData.ins_exp) {
      if (
        moment(this.currentEmployeeData.ins_exp).format("L") !=
        moment(this.originalEditEmpData.ins_exp).format("L")
      ) {
        this.chivex = true;
        changesection.push({
          section: "Insurance Details",
          field: "Insurance Expiry Date",
          oldvalue: moment(this.currentEmployeeData.ins_exp).format("L"),
          newvalue: moment(this.originalEditEmpData.ins_exp).format("L"),
        });
      }
    }

    //bank details

    if (
      (this.currentEmployeeData.bank_name || "").trim() !==
      (this.originalEditEmpData.bank_name || "").trim()
    ) {
      this.chbkname = true;
      changesection.push({
        section: "Bank Details",
        field: "Bank Name",
        oldvalue: this.currentEmployeeData.bank_name,
        newvalue: this.originalEditEmpData.bank_name,
      });
    }

    if (
      (this.currentEmployeeData.bank_branch || "").trim() !==
      (this.originalEditEmpData.bank_branch || "").trim()
    ) {
      this.chbkbrch = true;
      changesection.push({
        section: "Bank Details",
        field: "Bank Branch",
        oldvalue: this.originalEditEmpData.bank_branch,
        newvalue: this.currentEmployeeData.bank_branch,
      });
    }

    if (
      (this.currentEmployeeData.bank_account_num || "").trim() !==
      (this.originalEditEmpData.bank_account_num || "").trim()
    ) {
      this.chbknum = true;
      changesection.push({
        section: "Bank Details",
        field: "Bank Account Number",
        oldvalue: this.originalEditEmpData.bank_account_num,
        newvalue: this.currentEmployeeData.bank_account_num,
      });
    }

    if (
      (this.currentEmployeeData.bank_Iban || "").trim() !==
      (this.originalEditEmpData.bank_Iban || "").trim()
    ) {
      this.chbkiban = true;
      changesection.push({
        section: "Bank Details",
        field: "Bank IBAN",
        oldvalue: this.originalEditEmpData.bank_Iban,
        newvalue: this.currentEmployeeData.bank_Iban,
      });
    }

    if (
      (this.currentEmployeeData.bank_swift || "").trim() !==
      (this.originalEditEmpData.bank_swift || "").trim()
    ) {
      this.chbkswift = true;
      changesection.push({
        section: "Bank Details",
        field: "Bank Swift",
        oldvalue: this.originalEditEmpData.bank_swift,
        newvalue: this.currentEmployeeData.bank_swift,
      });
    }

    //Chnage in salary
    if (
      moment(this.currentEmployeeData.salary_effective_date).format("L") !=
      moment(this.originalEditEmpData.salary_effective_date).format("L")
    ) {
      changesection.push({
        section: "Salary Details",
        field: "Salary Effective Date",
        oldvalue: moment(this.currentEmployeeData.salary_effective_date).format(
          "L"
        ),
        newvalue: moment(this.originalEditEmpData.salary_effective_date).format(
          "L"
        ),
      });
    }

    if (
      this.currentEmployeeData.basic_salary !=
      this.originalEditEmpData.basic_salary
    ) {
      this.chbpay = true;
      changesection.push({
        section: "Salary Details",
        field: "Basic Salary",
        oldvalue: this.formatMoney(this.currentEmployeeData.basic_salary),
        newvalue: this.formatMoney(this.originalEditEmpData.basic_salary),
      });
    }

    if (
      this.currentEmployeeData.accommod_allow !=
      this.originalEditEmpData.accommod_allow
    ) {
      this.chalacco = true;
      changesection.push({
        section: "Salary Details",
        field: "Accomodation Allowance",
        oldvalue: this.formatMoney(this.currentEmployeeData.accommod_allow),
        newvalue: this.formatMoney(this.originalEditEmpData.accommod_allow),
      });
    }

    if (
      this.currentEmployeeData.travel_allow !=
      this.originalEditEmpData.travel_allow
    ) {
      this.chaltrav = true;
      changesection.push({
        section: "Salary Details",
        field: "Travel Allowance",
        oldvalue: this.formatMoney(this.currentEmployeeData.travel_allow),
        newvalue: this.formatMoney(this.originalEditEmpData.travel_allow),
      });
    }

    if (this.currentEmployeeData.a_one != this.originalEditEmpData.a_one) {
      this.chalone = true;
      changesection.push({
        section: "Salary Details",
        field: this.originalEditEmpData.a_one_name.toString() + " Allowance",
        oldvalue: this.formatMoney(this.currentEmployeeData.a_one),
        newvalue: this.formatMoney(this.originalEditEmpData.a_one),
      });
    }

    if (this.currentEmployeeData.a_two != this.originalEditEmpData.a_two) {
      this.chaltwo = true;
      changesection.push({
        section: "Salary Details",
        field: this.originalEditEmpData.a_two_name.toString() + " Allowance",
        oldvalue: this.formatMoney(this.currentEmployeeData.a_two),
        newvalue: this.formatMoney(this.originalEditEmpData.a_two),
      });
    }

    if (this.currentEmployeeData.a_three != this.originalEditEmpData.a_three) {
      this.chalthree = true;
      changesection.push({
        section: "Salary Details",
        field: this.originalEditEmpData.a_three_name.toString() + " Allowance",
        oldvalue: this.formatMoney(this.currentEmployeeData.a_three),
        newvalue: this.formatMoney(this.originalEditEmpData.a_three),
      });
    }

    if (
      this.currentEmployeeData.tax_deduc != this.originalEditEmpData.tax_deduc
    ) {
      this.chdetax = true;
      changesection.push({
        section: "Salary Details",
        field: "Tax Deduction",
        oldvalue: this.formatMoney(this.currentEmployeeData.tax_deduc),
        newvalue: this.formatMoney(this.originalEditEmpData.tax_deduc),
      });
    }

    if (
      this.currentEmployeeData.insurance_deduc !=
      this.originalEditEmpData.insurance_deduc
    ) {
      this.chdeins = true;
      changesection.push({
        section: "Salary Details",
        field: "Insurance Deduction",
        oldvalue: this.formatMoney(this.currentEmployeeData.insurance_deduc),
        newvalue: this.formatMoney(this.originalEditEmpData.insurance_deduc),
      });
    }

    if (this.currentEmployeeData.d_one != this.originalEditEmpData.d_one) {
      this.chdeone = true;
      changesection.push({
        section: "Salary Details",
        field: this.originalEditEmpData.d_one_name.toString() + " Deduction",
        oldvalue: this.formatMoney(this.currentEmployeeData.d_one),
        newvalue: this.formatMoney(this.originalEditEmpData.d_one),
      });
    }

    if (this.currentEmployeeData.d_two != this.originalEditEmpData.d_two) {
      this.chdetwo = true;
      changesection.push({
        section: "Salary Details",
        field: this.originalEditEmpData.d_two_name.toString() + " Deduction",
        oldvalue: this.formatMoney(this.currentEmployeeData.d_two),
        newvalue: this.formatMoney(this.originalEditEmpData.d_two),
      });
    }

    if (this.currentEmployeeData.d_three != this.originalEditEmpData.d_three) {
      this.chdethree = true;
      changesection.push({
        section: "Salary Details",
        field: this.originalEditEmpData.d_three_name.toString() + " Deduction",
        oldvalue: this.formatMoney(this.currentEmployeeData.d_three),
        newvalue: this.formatMoney(this.originalEditEmpData.d_three),
      });
    }

    if (
      this.currentEmployeeData.gross_pay != this.originalEditEmpData.gross_pay
    ) {
      this.chgrp = true;
      changesection.push({
        section: "Salary Details",
        field: "Gross Pay",
        oldvalue: this.formatMoney(this.currentEmployeeData.gross_pay),
        newvalue: this.formatMoney(this.originalEditEmpData.gross_pay),
      });
    }

    if (
      this.currentEmployeeData.net_deduc != this.originalEditEmpData.net_deduc
    ) {
      this.chnetdect = true;
      changesection.push({
        section: "Salary Details",
        field: "Net Deduction",
        oldvalue: this.formatMoney(this.currentEmployeeData.net_deduc),
        newvalue: this.formatMoney(this.originalEditEmpData.net_deduc),
      });
    }

    if (this.currentEmployeeData.net_pay != this.originalEditEmpData.net_pay) {
      this.chntpay = true;
      changesection.push({
        section: "Salary Details",
        field: "Net Pay",
        oldvalue: this.formatMoney(this.currentEmployeeData.net_pay),
        newvalue: this.formatMoney(this.originalEditEmpData.net_pay),
      });
    }

    let groupedArr = changesection.reduce((acc, obj) => {
      let { section, ...rest } = obj;
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(rest);
      return acc;
    }, {});
    this.groupedData = Object.entries(groupedArr).map(([id, value]) => ({
      id,
      value,
    }));

    let postemp = { id: this.currentEmployeeData.emp_id };
    let doccompare = [];
    //get documents changes
    this.empService
      .GetDocumentsByempIdwithDelete(postemp)
      .subscribe((data: any) => {
        if (data != null) {
          data.map((elm) => {
            if (elm.related_to == "original" && elm.doc_action == "delete") {
              doccompare.push({
                section: "Documents",
                field: elm.name,
                oldvalue: "Deleted",
                newvalue: elm.url,
              });
            }
            if (
              elm.related_to == "draft" &&
              elm.doc_action == "upload" &&
              elm.is_deleted == false
            )
              doccompare.push({
                section: "Documents",
                field: elm.name,
                oldvalue: "Uploaded",
                newvalue: elm.url,
              });
          });
          console.log("document data", doccompare);
          this.compareDocData = doccompare;
        }
      });

    //Getting the current approval status
    this.updateApproverDetails.approver1_roleId =
      this.originalEditEmpData.approver1_roleId;
    this.updateApproverDetails.approver2_roleId =
      this.originalEditEmpData.approver2_roleId;
    this.empService
      .getRoleNameByroleID({ id: this.updateApproverDetails.approver1_roleId })
      .subscribe((role1name) => {
        if (role1name) {
          this.updateApproverDetails.approver1_roleName =
            role1name[0].role_name;
        }
      });
    this.adminService
      .FindEmpByRoleId({ id: this.updateApproverDetails.approver1_roleId })
      .subscribe((empName: any) => {
        if (empName) {
          this.updateApproverDetails.approver1_name = empName.full_name;
        }
      });
    if (this.NoIsDual) {
      this.empService
        .getRoleNameByroleID({
          id: this.updateApproverDetails.approver2_roleId,
        })
        .subscribe((role2name) => {
          if (role2name) {
            this.updateApproverDetails.approver2_roleName =
              role2name[0].role_name;
          }
        });

      this.adminService
        .FindEmpByRoleId({ id: this.updateApproverDetails.approver2_roleId })
        .subscribe((empName2: any) => {
          if (empName2) {
            this.updateApproverDetails.approver2_name = empName2.full_name;
          }
        });
    }
    this.updateApproverDetails.is_approved1 =
      this.originalEditEmpData.is_approved1;
    this.updateApproverDetails.is_approved2 =
      this.originalEditEmpData.is_approved2;
    this.updateApproverDetails.ondate_approver1 =
      this.originalEditEmpData.ondate_approver1;
    this.updateApproverDetails.ondate_approver2 =
      this.originalEditEmpData.ondate_approver2;
    this.updateApproverDetails.update_status =
      this.originalEditEmpData.update_status;

    this.modalService.open(this.compareNotification, {
      size: "lg",
      backdrop: "static",
    });
    this.disableEditSection();
  }

  showchanges() {
    this.modalService.open(this.compareNotification, {
      size: "lg",
      backdrop: "static",
    });
  }

  //add by req emp

  approveAddEmployee() {
    Swal.fire({
      title: "Approve new employee request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        //let approverData = this.viewEditNotificationModelData[0];
        let approverData = this.viewEditNotificationModelData[0];
        let userDataLocal = JSON.parse(localStorage.getItem("user_info"));

        let employeeAprRequest;

        if (
          approverData.approver1_roleId === userDataLocal.role_id &&
          approverData.is_approved1 == false &&
          approverData.approver2_roleId == null
        ) {
          employeeAprRequest = {
            id: approverData.id,
            org_id: userDataLocal.org_id,
            update_status: "Approved",
            ondate_approved1: moment().format("L"),
            approver1_notes: null,
            approver2_notes: null,
            ondate_approved2: null,
            approver1_roleId: approverData.approver1_roleId,
            approver2_roleId: approverData.approver2_roleId,
            is_approved1: true,
            is_approved2: false,
            createdby: approverData.createdby,
            modifiedby: userDataLocal.id,
          };
        } else if (
          approverData.approver1_roleId === userDataLocal.role_id &&
          approverData.is_approved1 == false &&
          approverData.approver2_roleId != null
        ) {
          employeeAprRequest = {
            id: approverData.id,
            org_id: userDataLocal.org_id,
            update_status: "pending",
            ondate_approved1: moment().format("L"),
            approver1_notes: null,
            approver2_notes: null,
            ondate_approved2: null,
            approver1_roleId: approverData.approver1_roleId,
            approver2_roleId: approverData.approver2_roleId,
            is_approved1: true,
            is_approved2: false,
            createdby: approverData.createdby,
            modifiedby: userDataLocal.id,
          };
        } else if (
          approverData.approver2_roleId === userDataLocal.role_id &&
          approverData.is_approved1 == true &&
          approverData.approver2_roleId != null
        ) {
          employeeAprRequest = {
            id: approverData.id,
            org_id: userDataLocal.org_id,
            update_status: "Approved",
            ondate_approved1: moment().format("L"),
            approver1_notes: null,
            approver2_notes: null,
            ondate_approved2: null,
            approver1_roleId: approverData.approver1_roleId,
            approver2_roleId: approverData.approver2_roleId,
            is_approved1: true,
            is_approved2: false,
            createdby: approverData.createdby,
            modifiedby: userDataLocal.id,
          };
        }

        this.empService
          .UpdateEmployeeDetailsOverrideByID(employeeAprRequest)
          .subscribe((getApproverdata: any) => {
            //console.log('1', employeeAprRequest, getApproverdata)
            if (getApproverdata.status == 200) {
              if (employeeAprRequest.update_status === "Approved") {
                let employeeCreate = this.sendEmployeeData;
                [
                  "id",
                  "approver1_notes",
                  "approver1_roleId",
                  "approver2_notes",
                  "approver2_roleId",
                  "is_approved1",
                  "is_approved2",
                  "ondate_approved1",
                  "ondate_approved2",
                ].forEach((e) => delete employeeCreate[e]);
                this.empService
                  .AddEmployee(employeeCreate)
                  .subscribe((empCreatedata: any) => {
                    if (empCreatedata.status == 200) {
                      this.toast.success("Employee created successfully");
                      this.markNotRead();
                    } else {
                      this.toast.error(
                        "Something went wrong while Employee creation"
                      );
                    }
                  });
              } else {
                this.toast.success(
                  "Approved and further request send to Level 2 approver"
                );
                this.markNotRead();
              }
              this.closeAddAppDecEmployee();
            } else {
              this.toast.error("Something went wrong while approving");
              this.closeAddAppDecEmployee();
              this.spinner.hide();
            }
          });
      }
    });
  }

  closeaddaproval() {
    this.spinner.hide();
    $("#notificationModal").modal("hide");
    this.addEmployeeRequest = false;
    this.editEmployeeRequest = false;
    this.deleteEmployeeRequest = false;
    this.originalViewEditNotificationModelData = {};
    this.viewEditNotificationModelData = {};
    console.log("call after the approval part");
  }

  declineAddEmployee() {
    Swal.fire({
      title: "Decline new employee request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        let disapproveData = this.viewEditNotificationModelData[0];
        let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
        let employeeAprRequest;
        if (disapproveData.is_approved1 === false) {
          if (
            disapproveData.approver1_roleId !== null &&
            disapproveData.approver1_roleId === userDataLocal.role_id
          ) {
            employeeAprRequest = {
              id: disapproveData.id,
              approver1_roleId: disapproveData.approver1_roleId,
              approver2_roleId: disapproveData.approver2_roleId,
              is_approved1: false,
              is_approved2: false,
              update_status: "Decline",
              ondate_approved1: moment().format("L"),
              ondate_approved2: disapproveData.ondate_approved2,
            };
          }
        } else {
          if (
            disapproveData.approver2_roleId !== null &&
            disapproveData.approver2_roleId === userDataLocal.role_id
          ) {
            employeeAprRequest = {
              id: disapproveData.id,
              approver1_roleId: disapproveData.approver1_roleId,
              approver2_roleId: disapproveData.approver2_roleId,
              is_approved1: true,
              is_approved2: false,
              update_status: "Decline",
              ondate_approved1: disapproveData.ondate_approved1,
              ondate_approved2: moment().format("L"),
            };
          }
        }
        this.empService
          .UpdateEmployeeDetailsOverrideByID(employeeAprRequest)
          .subscribe((data: any) => {
            if (data.status == 200) {
              this.markNotRead();
              this.getEmployeeByOrgId();
              this.toast.success(
                "Employee approval request dennied successfully"
              );
            } else {
              this.toast.error("Something went wrong while approving");
            }
            this.closeAddAppDecEmployee();
          });
        this.addEmployeeRequest = false;
      }
    });
  }

  //update by req emp
  approveUpdateEmployee() {
    Swal.fire({
      title: "Approve update employee request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        let approverData = this.originalEditEmpData;
        let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
        let employeeAprRequest;
        if (approverData.is_approved1 === false) {
          if (
            approverData.approver1_roleId !== null &&
            approverData.approver1_roleId === userDataLocal.role_id
          ) {
            employeeAprRequest = {
              id: approverData.id,
              approver1_roleId: approverData.approver1_roleId,
              approver2_roleId: approverData.approver2_roleId,
              is_approved1: true,
              is_approved2: false,
              update_status:
                approverData.approver2_roleId !== null ? "pending" : "approved",
              ondate_approved1: moment().format("L"),
              ondate_approved2: approverData.ondate_approved2,
            };
          }
        } else {
          if (
            approverData.approver2_roleId !== null &&
            approverData.approver2_roleId === userDataLocal.role_id
          ) {
            employeeAprRequest = {
              id: approverData.id,
              approver1_roleId: approverData.approver1_roleId,
              approver2_roleId: approverData.approver2_roleId,
              is_approved1: true,
              is_approved2: true,
              update_status: "approved",
              ondate_approved1: approverData.ondate_approved1,
              ondate_approved2: moment().format("L"),
            };
          }
        }
        this.empService
          .UpdateEmployeeDetailsOverrideByID(employeeAprRequest)
          .subscribe((getAppdata: any) => {
            //console.log('1',employeeAprRequest, getAppdata)
            if (getAppdata.status == 200) {
              if (employeeAprRequest.update_status === "approved") {
                let employeeCreate = this.sendEmployeeData;
                [
                  "id",
                  "approver1_notes",
                  "approver1_roleId",
                  "approver2_notes",
                  "approver2_roleId",
                  "is_approved1",
                  "is_approved2",
                  "ondate_approved1",
                  "ondate_approved2",
                  "update_status",
                ].forEach((e) => delete employeeCreate[e]);
                employeeCreate["id"] = employeeCreate["emp_id"];
                delete employeeCreate["emp_id"];
                employeeCreate["joined_date"] = moment(
                  employeeCreate["joined_date"]
                ).format("L");
                employeeCreate["profile_effective_from_date"] = moment(
                  employeeCreate["profile_effective_from_date"]
                ).format("L");
                this.empService
                  .updateEmp(employeeCreate)
                  .subscribe((empUpdateData: any) => {
                    //console.log('2',employeeCreate, empUpdateData)
                    if (empUpdateData.status == 200) {
                      this.getEmployeeByOrgId();
                      this.markNotRead();
                    } else {
                      this.toast.error(
                        "Something went wrong while Employee creation"
                      );
                    }
                    this.closeAddAppDecEmployee();
                  });
              } else {
                this.markNotRead();
                this.toast.success(
                  "Approved and further request send to Level 2 approver"
                );
              }
              this.closeAddAppDecEmployee();
            } else {
              this.closeAddAppDecEmployee();
              this.toast.error("Something went wrong while approving");
            }
          });
        this.editEmployeeRequest = false;
      }
    });
  }

  async singleApprovalupdate() {
    try {
      const result = await Swal.fire({
        title: "Approve update employee request?",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirm",
        confirmButtonColor: "#e91e63",
        cancelButtonText: "Cancel",
      });

      if (result.value !== true) return;

      this.spinner.show();

      let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
      let approverData = this.originalEditEmpData;
      let employeeAprRequest;

      if (this.NoIsDual === false) {
        try {
          if (
            approverData.approver1_roleId !== null &&
            approverData.approver1_roleId === userDataLocal.role_id
          ) {
            employeeAprRequest = {
              update_status: "Approved",
              ondate_approved1: moment().format("MM/DD/YYYY"),
              is_approved1: true,
              modifiedby: userDataLocal.id,
              id: approverData.id,
            };
          }

          const res: any = await this.empService
            .UpdateApprovalInDraftById(employeeAprRequest)
            .toPromise();
          if (res && res.status === "200") {
            let postData = {
              orgID: "",
              id: approverData.id,
              empID: localStorage.getItem("emp_id"),
            };

            const data: any = await this.empService
              .UpdateEmployeeFromDraft(postData)
              .toPromise();
            if (data && data.status === "200") {
              const docdata: any = await this.empService
                .GetDocumentsByempIdwithDelete({
                  id: localStorage.getItem("emp_id"),
                })
                .toPromise();

              if (docdata) {
                for (let doc of docdata) {
                  if (
                    doc.related_to === "draft" &&
                    doc.doc_action === "upload" &&
                    !doc.is_approved
                  ) {
                    doc.is_approved = true;
                    doc.doc_action = "complete";
                    doc.related_to = "original";
                    await this.empService.UpdateDocById(doc).toPromise();
                  } else if (
                    doc.related_to === "original" &&
                    doc.doc_action === "delete" &&
                    !doc.is_approved
                  ) {
                    doc.is_approved = true;
                    doc.doc_action = "complete";
                    await this.removeDocPermenentByID(doc);
                  }
                }
                this.toast.success(
                  "Employee Details were updated successfully"
                );
                await this.resetUIAfterSuccess();
              }
            } else {
              this.toast.error("Something went wrong!");
            }
          }
        } catch (error) {
          console.error("Error during single approval update:", error);
        }
      }

      if (approverData.is_approved1 === false && this.NoIsDual === true) {
        this.sendNoToFinal();
      }

      if (approverData.is_approved1 === true && this.NoIsDual === true) {
        if (
          approverData.approver2_roleId !== null &&
          approverData.approver2_roleId === userDataLocal.role_id
        ) {
          try {
            employeeAprRequest = {
              id: approverData.id,
              approver1_roleId: approverData.approver1_roleId,
              approver2_roleId: approverData.approver2_roleId,
              is_approved1: true,
              is_approved2: true,
              update_status: "Approved",
              ondate_approved1: approverData.ondate_approved2,
              ondate_approved2: moment().format("MM/DD/YYYY"),
            };

            const res: any = await this.empService
              .UpdateApprovalInDraftById(employeeAprRequest)
              .toPromise();
            if (res && res.status === "200") {
              let postData = {
                orgID: "",
                id: approverData.id,
                empID: localStorage.getItem("emp_id"),
              };

              const data: any = await this.empService
                .UpdateEmployeeFromDraft(postData)
                .toPromise();
              if (data && data.status === "200") {
                const docdata: any = await this.empService
                  .GetDocumentsByempIdwithDelete({
                    id: localStorage.getItem("emp_id"),
                  })
                  .toPromise();

                if (docdata) {
                  for (let doc of docdata) {
                    if (
                      doc.related_to === "draft" &&
                      doc.doc_action === "upload" &&
                      !doc.is_approved
                    ) {
                      doc.is_approved = true;
                      doc.doc_action = "complete";
                      doc.related_to = "original";
                      await this.empService.UpdateDocById(doc).toPromise();
                    } else if (
                      doc.related_to === "original" &&
                      doc.doc_action === "delete" &&
                      !doc.is_approved
                    ) {
                      doc.is_approved = true;
                      doc.doc_action = "complete";
                      await this.removeDocPermenentByID(doc);
                    }
                  }
                  this.toast.success(
                    "Employee Details were updated successfully"
                  );
                  await this.resetUIAfterSuccess();
                }
              } else {
                this.toast.error("Something went wrong!");
              }
            }
          } catch (error) {
            console.error("Error in dual approval process:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error initiating approval request:", error);
    } finally {
      this.showDashList = false;
      this.cardClick("Approvals", "approval");
      this.spinner.hide();
    }
  }

  // Utility to reset UI after successful completion
  async resetUIAfterSuccess() {
    this.editEmployeeClose();
    await this.getEmployeeByOrgId();
    this.getDraftEmployeeEditData();
    await this.fillDashBoardDetails();
    this.modalService.dismissAll();
    this.markNotRead();
    await this.getRequestStatus();
  }

  async declineUpdateEmployee() {
    const result = await Swal.fire({
      title: "Decline update employee request?",
      text: "Please provide a reason for declining.",
      input: "text",
      inputPlaceholder: "Enter reason here...",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonColor: "#e91e63",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    });
    console.log(result.value, "TEST");

    if (result.value) {
      this.spinner.show();
      let employeeAprRequest;
      let disapproveData = this.originalEditEmpData;
      let userDataLocal = JSON.parse(localStorage.getItem("user_info"));

      if (!disapproveData.is_approved1) {
        if (
          disapproveData.approver1_roleId !== null &&
          disapproveData.approver1_roleId === userDataLocal.role_id
        ) {
          employeeAprRequest = {
            id: disapproveData.id,
            approver1_roleId: disapproveData.approver1_roleId,
            approver2_roleId: disapproveData.approver2_roleId,
            is_approved1: false,
            is_approved2: false,
            update_status: "decline",
            ondate_approved1: moment().format("L"),
            ondate_approved2: disapproveData.ondate_approved2,
            remarks: result.value,
          };
        }
      } else {
        if (
          disapproveData.approver2_roleId !== null &&
          disapproveData.approver2_roleId === userDataLocal.role_id
        ) {
          employeeAprRequest = {
            id: disapproveData.id,
            approver1_roleId: disapproveData.approver1_roleId,
            approver2_roleId: disapproveData.approver2_roleId,
            is_approved1: true,
            is_approved2: false,
            update_status: "decline",
            ondate_approved1: disapproveData.ondate_approved1,
            ondate_approved2: moment().format("L"),
            remarks: result.value,
          };
        }
      }

      try {
        const updateResponse: any = await this.empService
          .UpdateApprovalInDraftById(employeeAprRequest)
          .toPromise();

        if (updateResponse.status == 200) {
          const removeOverrideResponse: any = await this.empService
            .RemoveOverrideDetailsById({ id: disapproveData.id })
            .toPromise();

          if (removeOverrideResponse.status == 200) {
            const docData: any = await this.empService
              .GetDocumentsByempIdwithDelete({ id: disapproveData.emp_id })
              .toPromise();

            if (docData) {
              for (const doc of docData) {
                if (doc.related_to !== "original" && !doc.is_approved) {
                  console.log("Deleting unsaved draft document", doc);
                  await this.removeDocPermenentByID(doc);
                }

                if (doc.related_to === "original" && !doc.is_approved) {
                  doc.is_approved = true;
                  doc.doc_action = "complete";
                  doc.is_deleted = false;
                  const updateDocResponse: any = await this.empService
                    .UpdateDocById(doc)
                    .toPromise();

                  if (updateDocResponse.result.status == 200) {
                    console.log("Original document restored.");
                  }
                }
              }
            }
          }

          this.toast.success("Employee approval request declined successfully");
          await this.resetUIAfterSuccess();
        } else {
          this.toast.error("Something went wrong while declining");
        }
      } catch (error) {
        console.error("Error in declineUpdateEmployee:", error);
        this.toast.error("An error occurred during the decline process");
      } finally {
        this.showDashList = false;
        this.cardClick("Approvals", "approval");
        this.spinner.hide();
      }
    }
  }

  //delete by req emp
  approveDeleteEmployee() {
    Swal.fire({
      title: "Approve Delete Employee ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
        let approverData = this.viewDeleteNotificationModelData;
        let employeeAprRequest;
        if (approverData.is_approved1 === false) {
          if (
            approverData.approver1_roleId !== null &&
            approverData.approver1_roleId === userDataLocal.role_id
          ) {
            employeeAprRequest = {
              id: approverData.id,
              org_id: userDataLocal.org_id,
              update_status:
                approverData.approver2_roleId !== null ? "pending" : "approved",
              ondate_approved1: moment().format("L"),
              ondate_approved2: null,
              approver1_notes: null,
              approver2_notes: null,
              approver1_roleId: approverData.approver1_roleId,
              approver2_roleId: approverData.approver2_roleId,
              is_approved1: true,
              is_approved2: false,
              is_emp_deleted: true,
              createdby: approverData.createdby,
              modifiedby: userDataLocal.id,
            };
          }
        } else {
          if (
            approverData.approver2_roleId !== null &&
            approverData.approver2_roleId === userDataLocal.role_id
          ) {
            employeeAprRequest = {
              id: approverData.id,
              org_id: userDataLocal.org_id,
              update_status: "approved",
              ondate_approved1: approverData.ondate_approved1,
              ondate_approved2: moment().format("L"),
              approver1_notes: null,
              approver2_notes: null,
              approver1_roleId: approverData.approver1_roleId,
              approver2_roleId: approverData.approver2_roleId,
              is_approved1: true,
              is_approved2: true,
              createdby: approverData.createdby,
              modifiedby: userDataLocal.id,
              is_emp_deleted: true,
            };
          }
        }
        console.log("for deleting approve", employeeAprRequest);
        this.empService
          .UpdateEmployeeDetailsOverrideByID(employeeAprRequest)
          .subscribe((getOverrdata: any) => {
            console.log(employeeAprRequest, getOverrdata, approverData);
            if (getOverrdata.status == 200) {
              if (employeeAprRequest.update_status === "approved") {
                let deleteEmp = { id: approverData.emp_id };
                this.empService
                  .delEmp(deleteEmp)
                  .subscribe((getDeletedata: any) => {
                    console.log(employeeAprRequest, deleteEmp);
                    if (getDeletedata.status == 200) {
                      this.toast.success(
                        "Approved and Employee Deleted successfully"
                      );
                      this.markNotRead();
                    } else {
                      Swal.fire(
                        "Error!",
                        getDeletedata["result"].desc,
                        "error"
                      );
                    }
                    this.closeAddAppDecEmployee();
                    this.getEmployeeByOrgId();
                  });
              } else {
                this.toast.success(
                  "Approved and further request send to Level 2 approver"
                );
                this.markNotRead();
              }
              this.closeAddAppDecEmployee();
              this.getEmployeeByOrgId();
            } else {
              this.spinner.hide();
              $("#notificationModal").modal("hide");
              this.toast.error("Something went with Override request");
            }
          });
        this.deleteEmployeeRequest = false;
      }
    });
  }

  declineDeleteEmployee() {
    Swal.fire({
      title: "Decline Delete Employee ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();
        let disapproveData = this.viewDeleteNotificationModelData.overrideData;
        let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
        let employeeAprRequest;
        if (disapproveData.is_approved1 === false) {
          if (
            disapproveData.approver1_roleId !== null &&
            disapproveData.approver1_roleId === userDataLocal.role_id
          ) {
            employeeAprRequest = {
              id: disapproveData.id,
              approver1_roleId: disapproveData.approver1_roleId,
              approver2_roleId: disapproveData.approver2_roleId,
              is_approved1: false,
              is_approved2: false,
              update_status: "decline",
              ondate_approved1: moment().format("L"),
              ondate_approved2: disapproveData.ondate_approved2,
            };
          }
        } else {
          if (
            disapproveData.approver2_roleId !== null &&
            disapproveData.approver2_roleId === userDataLocal.role_id
          ) {
            employeeAprRequest = {
              id: disapproveData.id,
              approver1_roleId: disapproveData.approver1_roleId,
              approver2_roleId: disapproveData.approver2_roleId,
              is_approved1: true,
              is_approved2: false,
              update_status: "decline",
              ondate_approved1: disapproveData.ondate_approved1,
              ondate_approved2: moment().format("L"),
            };
          }
        }
        this.empService
          .UpdateEmployeeDetailsOverrideByID(employeeAprRequest)
          .subscribe((data: any) => {
            if (data.status == 200) {
              this.markNotRead();
              this.toast.success(
                "Employee approval request dennied successfully"
              );
            } else {
              this.toast.error("Error in Approval Request");
            }
            this.getEmployeeByOrgId();
            this.closeAddAppDecEmployee();
          });
        this.deleteEmployeeRequest = false;
      }
    });
  }

  markNotRead() {
    let notRead = {
      id: this.originalViewEditNotificationModelData.id,
      read_status: true,
      modified_by_empId:
        this.originalViewEditNotificationModelData.modified_by_empId,
      is_modified: true,
    };
    this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
      notRead
    ).subscribe((data: any) => {
      console.log("3", data, notRead);
      if (data.status === "200") {
        console.log("notification read successfully");
      } else {
        console.log("something went wrong while reading notification");
      }
    });
  }

  closeAddAppDecEmployee() {
    this.spinner.hide();
    $("#notificationModal").modal("hide");
    this.addEmployeeRequest = false;
    this.editEmployeeRequest = false;
    this.deleteEmployeeRequest = false;
    this.NoIsDual = false;
  }

  updateisContactsame(e) {
    let Permanentvalue = this.editEmployeeExtension.value;
    if (e.checked) {
      this.editEmployeeExtension.patchValue({
        conAdr1: Permanentvalue.adr1,
        conAdr2: Permanentvalue.adr2,
        conCity: Permanentvalue.adrCity,
        conCountry: Permanentvalue.adrCountry,
        conPostalCode: Permanentvalue.adrPostalCode,
        isconsame: true,
      });
      this.consame = true;
    } else {
      this.editEmployeeExtension.patchValue({
        conAdr1: "",
        conAdr2: "",
        conCity: "",
        conCountry: "",
        conPostalCode: "",
        isconsame: false,
      });
      this.consame = false;
    }
  }

  pendingAprCount = 0;
  aprovedAprCount = 0;
  declineAprCount = 0;

  async getRequestStatus() {
    try {
      let user_info = JSON.parse(localStorage.getItem("user_info"));
      let postData = { id: user_info.role_id };

      const data: any = await this.empService
        .GetEmployeeDetailsOverrideByApproverRoleID(postData)
        .toPromise();

      console.log("getRequestStatus", data);
      this.Orgid = localStorage.getItem('org_id')
      if (data && data.length > 0) {
        let processData = [];
        this.pendingAprCount = 0;
        this.aprovedAprCount = 0;
        this.declineAprCount = 0;

        data.forEach((elm) => {
          if (elm.emp_id) {
            elm.action = elm.is_emp_deleted ? "Delete" : "Edit";
          } else {
            elm.action = "Add";
          }

          elm.aproval_level = elm.approver2_roleId
            ? "Dual Approver"
            : "Single Approver";

          if (elm.approver2_roleId == user_info.role_id) {
            if (elm.is_approved1) {
              if (elm.update_status === "Approved") {
                this.aprovedAprCount += 1;
                processData.push(elm);
              } else if (elm.update_status.includes("Pending") && elm.org_id == this.Orgid) {
                this.pendingAprCount += 1;
                processData.push(elm);
              } else if (elm.update_status.includes("decline")) {
                this.declineAprCount += 1;
                processData.push(elm);
              }
            }
          }

          if (elm.approver1_roleId == user_info.role_id) {
            if (elm.update_status === "Approved" && elm.is_approved1) {
              this.aprovedAprCount += 1;
              processData.push(elm);
            } else if (
              elm.update_status.includes("Pending") &&
              !elm.is_approved1
            ) {
              this.pendingAprCount += 1;
              processData.push(elm);
            } else if (elm.update_status.includes("decline")) {
              this.declineAprCount += 1;
              processData.push(elm);
            }
          }
        });

        this.myRequestedEmp = processData;
      }
    } catch (error) {
      console.error("Error in getRequestStatus:", error);
    }
  }

  requestedEmployeeSearchKeyUp(): void {
    document
      .getElementById(this.requestedemployeeGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.requestedemployeeGrid.search(
          (event.target as HTMLInputElement).value
        );
      });
  }

  salarycalculator() {
    this.grosspay = 0;
    this.netdeduct = 0;
    this.netpay = 0;
    this.grosspay =
      parseFloat(this.basicpay.toString()) +
      parseFloat(this.travel.toString()) +
      parseFloat(this.accommodation.toString()) +
      parseFloat(this.aone.toString()) +
      parseFloat(this.atwo.toString()) +
      parseFloat(this.athree.toString());
    this.netdeduct =
      parseFloat(this.tax.toString()) +
      parseFloat(this.insurance.toString()) +
      parseFloat(this.done.toString()) +
      parseFloat(this.dtwo.toString()) +
      parseFloat(this.dthree.toString());
    this.netpay =
      parseFloat(this.grosspay.toString()) -
      parseFloat(this.netdeduct.toString());
  }

  onsalKeyUp() {
    let salchange = this.addEmployeeExtension.value;
    this.basicpay = salchange.basicPay || 0.0;
    this.travel = salchange.travelAllow || 0.0;
    this.accommodation = salchange.accoAllow || 0.0;
    this.otherallow = salchange.otherAllow || 0.0;
    this.tax = salchange.taxDed || 0.0;
    this.insurance = salchange.insDed || 0.0;
    this.otherdeduct = salchange.otherDed || 0.0;

    this.salarycalculator();
  }

  onsalKeyUpEdit() {
    let salchange = this.editEmployeeExtension.value;
    this.basicpay = salchange.basicPay || 0.0;
    this.travel = salchange.travelAllow || 0.0;
    this.accommodation = salchange.accoAllow || 0.0;
    this.otherallow = salchange.otherAllow || 0.0;

    this.tax = salchange.taxDed || 0.0;
    this.insurance = salchange.insDed || 0.0;
    this.otherdeduct = salchange.otherDed || 0.0;

    this.aone = salchange.aOne || 0.0;
    this.atwo = salchange.aTwo || 0.0;
    this.athree = salchange.aThree || 0.0;
    this.done = salchange.dOne || 0.0;
    this.dtwo = salchange.dTwo || 0.0;
    this.dthree = salchange.dThree || 0.0;
    this.salarycalculator();
  }

  extraAllowance = [];
  extraDeduction = [];

  onaddsalextra(type) {
    if (type == "allowance") {
      console.log("clicked the allowance", this.extraAllowance);
      if (this.extraAllowance.length < 3) {
        this.extraAllowance.push("true");
      } else {
        this.toast.warning("Adding Allowance limit is Over.");
      }
    }
    if (type == "deductions") {
      console.log("clicked the deductions", this.extraDeduction);
      if (this.extraDeduction.length < 3) {
        this.extraDeduction.push("true");
      } else {
        this.toast.warning("Adding Deduction limit is Over.");
      }
    }
  }

  onrmsalextra(type) {
    if (type == "allowance") {
      switch (this.extraAllowance.length) {
        case 0:
          console.log("Array is empty");
          break;
        case 1:
          this.aone = 0;
          this.editEmployeeExtension.patchValue({
            aOneName: "",
            aOne: 0,
          });
          break;
        case 2:
          this.atwo = 0;
          this.editEmployeeExtension.patchValue({
            aTwoName: "",
            aTwo: 0,
          });
          break;
        case 3:
          this.editEmployeeExtension.patchValue({
            aThreeName: "",
            aThree: 0,
          });
          this.athree = 0;
          break;
      }
      this.extraAllowance.pop();
      this.salarycalculator();
    }
    if (type == "deductions") {
      switch (this.extraDeduction.length) {
        case 0:
          console.log("Array is empty");
          break;
        case 1:
          this.done = 0;
          this.editEmployeeExtension.patchValue({
            dOneName: "",
            dOne: 0,
          });
          break;
        case 2:
          this.dtwo = 0;
          this.editEmployeeExtension.patchValue({
            dTwoName: "",
            dTwo: 0,
          });
          break;
        case 3:
          this.editEmployeeExtension.patchValue({
            dThreeName: "",
            dThree: 0,
          });
          this.dthree = 0;
          break;
      }
      this.extraDeduction.pop();
      this.salarycalculator();
    }
  }

  backToList() {
    this.employeePresent = true;
    this.showAddEdit = true;
    this.myRequest = true;
    if (this.myRequest) {
      this.employeePresent = true;
      this.showAddEdit = true;
      this.myRequest = false;
    } else {
      this.Router.navigate(["settings-new"]);
    }
  }

  empDeleteDraft(data) {
    let postData = {
      id: data.id,
    };
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Delete the Saved Draft",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value == true) {
        this.spinner.show();
        this.empService
          .RemoveOverrideDetailsById(postData)
          .subscribe((datain: any) => {
            if (datain.status == 200) {
              this.empService
                .GetDocumentsByempIdwithDelete({ id: data.emp_id })
                .subscribe(async (docdata: any) => {
                  if (docdata != null) {
                    await docdata.map(async (doc) => {
                      if (
                        doc.related_to != "original" &&
                        doc.is_approved == false
                      ) {
                        this.removeDocPermenentByID(doc);
                        console.log("removed unsaved draft document", doc);
                      }
                      if (
                        doc.related_to == "original" &&
                        doc.is_approved == false
                      ) {
                        doc.is_approved = true;
                        doc.doc_action = "complete";
                        doc.is_deleted = false;
                        console.log("testdata", doc);
                        this.empService.UpdateDocById(doc).subscribe((rep) => {
                          if (rep) {
                            if (rep["result"]["status"] == 200) {
                              console.log(
                                "Original Document is Revived Back to Normal"
                              );
                            }
                          }
                        });
                      }
                      this.spinner.hide();
                      this.toast.info("The Saved Draft Details is Deleted!");
                      this.getDraftEmployeeEditData();
                    });
                  }
                });
            }
          });
      }
    });
  }

  dashhead;
  showDashList = false;
  docGridData = false;
  dashListData = [];
  rangeBoard = false;
  statBoard = false;
  docNearExpTot = 0;
  docExpiredtot = 0;
  doclastExpiredDate = 0;

  cardClick(input, toshow) {
    this.rangeBoard = false;
    this.statBoard = false;
    this.docGridData = toshow;
    if (this.showDashList == true && this.dashhead == input) {
      this.showDashList = false;
    } else {
      if (input == "In Service") {
        this.dashhead = "In Service";
        this.showDashList = true;
        this.dashListData = this.Inservice;
      } else if (input == "Out Of Service") {
        this.showDashList = true;
        this.dashhead = "Out Of Service";
        this.dashListData = this.Outservice;
      } else if (input == "Profile Completed") {
        this.showDashList = true;
        this.dashhead = "Profile Completed";
        this.dashListData = this.ProfileComplete;
      } else if (input == "Profile Incomplete") {
        this.showDashList = true;
        this.dashhead = "Profile Incomplete";
        this.dashListData = this.Inservice;
      } else if (input == "Document Expired") {
        this.headerText = "Expired Since";
        this.showDashList = false;
        let newData = this.allEmployeeData.filter(val => val.employee_status_name === "In Service")
        console.log(newData,"newData")
        console.log(this.DocExpired,"DocExpired")

        // let newVal =
        // console.log(newVal,"DocExpired")
        this.dashListData = this.DocExpired.filter( val => newData.some(item => item.id === val.id));
        console.log(this.dashListData,"testtttt")
        //this.docGridData = true;
        this.docExpiredtot = this.dashListData.length;

        this.dashhead = "Document Expired";
        this.showDashList = true;
      } else if (input == "Near Document Expiry") {
        this.headerText = "Expire Within";
        this.rangeBoard = true;
        this.showDashList = true;
        //this.docGridData = true;
        this.dashListData = this.DocNearExpiry.filter(
          (value) => moment(value.doc_exp_date).diff(moment(), "days") < 90
        );
        this.docNearExpTot = this.dashListData.length;
        this.dashhead = "Near Document Expiry";
      }

      else if (input == "Without Team") {
        this.showDashList = true;
        this.dashhead = "Without Team";
        this.dashListData = this.WithoutTeam;
      } else if (input == "Approvals") {
        this.Orgid = localStorage.getItem('org_id')
        this.showDashList = true;
        this.statBoard = true;
        this.dashhead = "Approvals";
        console.log(this.myRequestedEmp, "request employeee")
        this.dashListData = this.myRequestedEmp.filter(
          (value) => value.update_status == "Pending" && value.org_id == this.Orgid
        );

        console.log(this.dashListData,"00000")
      }
      else if (input == "delegatedetails") {
        this.showDashList = true;
        this.dashhead = "Delegates Details";
        this.dashListData = this.Delegates;
      }
    }
  }

  docExpRange = ["15 Days", "30 Days", "60 Days", "90 Days", "180 Days"];
  selectRangeto = moment().add(90, "days").format("ll");
  selectRangefrom = moment().format("ll");

  selectUpdateStatus = ["Pending", "Approved", "Decline", "All"];

  docRangeSelecChnage(event) {
    if (event.itemData.value == "15 Days") {
      this.dashListData = this.DocNearExpiry.filter(
        (value) => moment(value.doc_exp_date).diff(moment(), "days") < 15
      );
      this.selectRangeto = moment().add(15, "days").format("ll");
      this.selectRange = event.itemData.value;
    } else if (event.itemData.value == "30 Days") {
      this.dashListData = this.DocNearExpiry.filter(
        (value) => moment(value.doc_exp_date).diff(moment(), "days") < 30
      );
      this.selectRangeto = moment().add(30, "days").format("ll");
      this.selectRange = event.itemData.value;
    } else if (event.itemData.value == "60 Days") {
      this.dashListData = this.DocNearExpiry.filter(
        (value) => moment(value.doc_exp_date).diff(moment(), "days") < 60
      );
      this.selectRangeto = moment().add(60, "days").format("ll");
      this.selectRange = event.itemData.value;
    } else if (event.itemData.value == "90 Days") {
      this.dashListData = this.DocNearExpiry.filter(
        (value) => moment(value.doc_exp_date).diff(moment(), "days") < 90
      );
      this.selectRangeto = moment().add(90, "days").format("ll");
      this.selectRange = event.itemData.value;
    } else if (event.itemData.value == "180 Days") {
      this.dashListData = this.DocNearExpiry.filter(
        (value) => moment(value.doc_exp_date).diff(moment(), "days") < 180
      );
      this.selectRangeto = moment().add(180, "days").format("ll");
      this.selectRange = event.itemData.value;
    }
    this.docNearExpTot = this.dashListData.length;
  }

  selectstantuschange(event) {
    if (event.itemData.value == "Pending") {
      this.dashListData = this.myRequestedEmp.filter(
        (value) => value.update_status == "Pending"
      );
    } else if (event.itemData.value == "Approved") {
      this.dashListData = this.myRequestedEmp.filter(
        (value) => value.update_status == "Approved"
      );
    } else if (event.itemData.value == "Decline") {
      this.dashListData = this.myRequestedEmp.filter(
        (value) => value.update_status == "decline"
      );
    } else if (event.itemData.value == "All") {
      this.dashListData = this.myRequestedEmp;
    }
  }

  viewDocInTab(doc_id) {
    if (doc_id) {
      window.open(doc_id.toString(), "_blank");
    }
  }

  workdaySelection = [
    "Organistaion Settings",
    "Team Settings",
    "Individual Settings",
  ];
  disableWork = false;

  selectedWorkSettings(event) {
    let teamValue;
    if (event.value == "Organistaion Settings") {
      this.setWorkDetailsByOrgData();
      this.disableWork = true;
      this.addDropDownsForm
        .get("addFlexibleCheckbox")
        .disable({ onlySelf: true });
      this.addDropDownsForm
        .get("editCostomWorkDays")
        .disable({ onlySelf: true });
      this.addDropDownsForm.get("saIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("suIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("moIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("tuIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("weIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("thIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("frIsFlex").disable({ onlySelf: true });
      this.toast.success("Organization Settings Applied!");
    } else if (event.value == "Team Settings") {
      let teamDrop = this.addDropDownsForm.value.teamDropdownValue;
      if (
        teamDrop.description == "Without Team" ||
        teamDrop.description == null ||
        teamDrop.description == "" ||
        teamDrop.description == undefined
      ) {
        Swal.fire(
          "Error!",
          "Please select a team from General Details!",
          "error"
        );
        this.addDropDownsForm.patchValue({
          workSettings: "Organistaion Settings",
        });
      } else {
        let postData = {
          id: this.addDropDownsForm.value.teamDropdownValue.id,
        };
        console.log("Getting Team data", postData);
        this.teamService.FindByTeamIDnew(postData).subscribe((data: any) => {
          if (data) {
            teamValue = data;

            if (teamValue.working_days !== null) {
              let testData = teamValue.working_days.split(",");
              this.WorkdaysData = [];
              testData.includes("Saturday") === true
                ? this.WorkdaysData.push({
                    day: "SA",
                    day_name: "Saturday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "SA",
                    day_name: "Saturday",
                    is_working: false,
                  });
              testData.includes("Sunday") === true
                ? this.WorkdaysData.push({
                    day: "SU",
                    day_name: "Sunday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "SU",
                    day_name: "Sunday",
                    is_working: false,
                  });
              testData.includes("Monday") === true
                ? this.WorkdaysData.push({
                    day: "MO",
                    day_name: "Monday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "MO",
                    day_name: "Monday",
                    is_working: false,
                  });
              testData.includes("Tuesday") === true
                ? this.WorkdaysData.push({
                    day: "TU",
                    day_name: "Tuesday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "TU",
                    day_name: "Tuesday",
                    is_working: false,
                  });
              testData.includes("Wednesday") === true
                ? this.WorkdaysData.push({
                    day: "WE",
                    day_name: "Wednesday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "WE",
                    day_name: "Wednesday",
                    is_working: false,
                  });
              testData.includes("Thursday") === true
                ? this.WorkdaysData.push({
                    day: "TH",
                    day_name: "Thursday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "TH",
                    day_name: "Thursday",
                    is_working: false,
                  });
              testData.includes("Friday") === true
                ? this.WorkdaysData.push({
                    day: "FR",
                    day_name: "Friday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "FR",
                    day_name: "Friday",
                    is_working: false,
                  });
              console.log(this.WorkdaysData);
            } else {
              this.WorkdaysData = [
                {
                  day: "SA",
                  day_name: "Saturday",
                  is_working: false,
                },
                {
                  day: "SU",
                  day_name: "Sunday",
                  is_working: true,
                },
                {
                  day: "MO",
                  day_name: "Monday",
                  is_working: true,
                },
                {
                  day: "TU",
                  day_name: "Tuesday",
                  is_working: true,
                },
                {
                  day: "WE",
                  day_name: "Wednesday",
                  is_working: true,
                },
                {
                  day: "TH",
                  day_name: "Thursday",
                  is_working: true,
                },
                {
                  day: "FR",
                  day_name: "Friday",
                  is_working: false,
                },
              ];
            }
            if (data.is_flexible === true) {
              this.editIsFlexibleDiv = true;
              this.addDropDownsForm.patchValue({
                startTimeDropdownValue: { id: null, description: "select" },
                endTimeDropdownValue: { id: null, description: "select" },
                addCheckinTolerance: { id: null, description: "select" },
                addBreakTimeLimit: { id: null, description: "select" },
                editCheckInAfter: {
                  id: data.checkin_after,
                  description: data.checkin_after,
                },
                editCheckOutBefore: {
                  id: data.checkout_before,
                  description: data.checkout_before,
                },
                editTotalHoursDropdownValue: {
                  id: data.min_hrs_flx,
                  description: data.min_hrs_flx,
                },
                editBreakTimeLimitFlex: {
                  id: data.break_time_flx,
                  description: data.break_time_flx,
                },
              });
            } else {
              this.addDropDownsForm.patchValue({
                startTimeDropdownValue: {
                  id: data.work_start_time,
                  description: data.work_start_time,
                },
                endTimeDropdownValue: {
                  id: data.work_end_time,
                  description: data.work_end_time,
                },
                addCheckinTolerance: {
                  id: data.checkin_tolarence,
                  description: data.checkin_tolarence,
                },
                addBreakTimeLimit: {
                  id: data.break_time,
                  description: data.break_time,
                },
                editCheckInAfter: { id: null, description: "select" },
                editCheckOutBefore: { id: null, description: "select" },
                editTotalHoursDropdownValue: {
                  id: null,
                  description: "select",
                },
                editBreakTimeLimitFlex: { id: null, description: "select" },
              });
            }
            if (data.is_custom_work) {
              let exptest = data.work_days_exp.split(",");
              this.editWorkDayExp = [];
              this.managed = true;
              exptest.includes("Saturday.") === true
                ? this.editWorkDayExp.push({
                    day: "SA",
                    day_name: "Saturday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "SA",
                    day_name: "Saturday.",
                    is_working: false,
                  });
              exptest.includes("Sunday.") === true
                ? this.editWorkDayExp.push({
                    day: "SU",
                    day_name: "Sunday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "SU",
                    day_name: "Sunday.",
                    is_working: false,
                  });
              exptest.includes("Monday.") === true
                ? this.editWorkDayExp.push({
                    day: "MO",
                    day_name: "Monday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "MO",
                    day_name: "Monday.",
                    is_working: false,
                  });
              exptest.includes("Tuesday.") === true
                ? this.editWorkDayExp.push({
                    day: "TU",
                    day_name: "Tuesday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "TU",
                    day_name: "Tuesday.",
                    is_working: false,
                  });
              exptest.includes("Wednesday.") === true
                ? this.editWorkDayExp.push({
                    day: "WE",
                    day_name: "Wednesday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "WE",
                    day_name: "Wednesday.",
                    is_working: false,
                  });
              exptest.includes("Thursday.") === true
                ? this.editWorkDayExp.push({
                    day: "TH",
                    day_name: "Thursday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "TH",
                    day_name: "Thursday.",
                    is_working: false,
                  });
              exptest.includes("Friday.") === true
                ? this.editWorkDayExp.push({
                    day: "FR",
                    day_name: "Friday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "FR",
                    day_name: "Friday.",
                    is_working: false,
                  });

              let expday = [];
              // saturday exp
              if (data.saturday_exp) {
                expday = data.saturday_exp.split(",");
                if (expday[0] == true) {
                  this.addDropDownsForm.patchValue({
                    wsasa: { id: expday[1], description: expday[1] },
                    websa: { id: expday[2], description: expday[2] },
                    misa: { id: expday[3], description: expday[3] },
                    btlsa: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.addDropDownsForm.patchValue({
                    StartSaturday: { id: expday[1], description: expday[1] },
                    EndSaturday: { id: expday[2], description: expday[2] },
                    tosa: { id: expday[3], description: expday[3] },
                    btlsa: { id: expday[4], description: expday[4] },
                  });
                }
              }
              // sunday exp
              if (data.sunday_exp) {
                expday = data.sunday_exp.split(",");
                if (expday[0] == true) {
                  this.addDropDownsForm.patchValue({
                    wsasu: { id: expday[1], description: expday[1] },
                    websu: { id: expday[2], description: expday[2] },
                    misu: { id: expday[3], description: expday[3] },
                    btlsu: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.addDropDownsForm.patchValue({
                    StartSunday: { id: expday[1], description: expday[1] },
                    EndSunday: { id: expday[2], description: expday[2] },
                    tosu: { id: expday[3], description: expday[3] },
                    btlsu: { id: expday[4], description: expday[4] },
                  });
                }
              }
              //monday exp
              if (data.monday_exp) {
                expday = data.monday_exp.split(",");
                if (expday[0] == true) {
                  this.addDropDownsForm.patchValue({
                    wsamo: { id: expday[1], description: expday[1] },
                    webmo: { id: expday[2], description: expday[2] },
                    mismo: { id: expday[3], description: expday[3] },
                    btlmo: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.addDropDownsForm.patchValue({
                    StartMonday: { id: expday[1], description: expday[1] },
                    EndMonday: { id: expday[2], description: expday[2] },
                    tomo: { id: expday[3], description: expday[3] },
                    btlmo: { id: expday[4], description: expday[4] },
                  });
                }
              }
              //tuesday exp
              if (data.tuesday_exp) {
                expday = data.tuesday_exp.split(",");
                if (expday[0] == true) {
                  this.addDropDownsForm.patchValue({
                    wsatu: { id: expday[1], description: expday[1] },
                    webtu: { id: expday[2], description: expday[2] },
                    mistu: { id: expday[3], description: expday[3] },
                    btltu: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.addDropDownsForm.patchValue({
                    StartTuesday: { id: expday[1], description: expday[1] },
                    EndTuesday: { id: expday[2], description: expday[2] },
                    totu: { id: expday[3], description: expday[3] },
                    btltu: { id: expday[4], description: expday[4] },
                  });
                }
              }
              // wednesday exp
              if (data.wednesday_exp) {
                expday = data.wednesday_exp.split(",");
                if (expday[0] == true) {
                  this.addDropDownsForm.patchValue({
                    wsawe: { id: expday[1], description: expday[1] },
                    webwe: { id: expday[2], description: expday[2] },
                    miswe: { id: expday[3], description: expday[3] },
                    btlwe: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.addDropDownsForm.patchValue({
                    StartWednesday: { id: expday[1], description: expday[1] },
                    EndWednesday: { id: expday[2], description: expday[2] },
                    towe: { id: expday[3], description: expday[3] },
                    btlwe: { id: expday[4], description: expday[4] },
                  });
                }
              }
              // thursday exp
              if (data.thursday_exp) {
                expday = data.thursday_exp.split(",");
                if (expday[0] == true) {
                  this.addDropDownsForm.patchValue({
                    wsath: { id: expday[1], description: expday[1] },
                    webth: { id: expday[2], description: expday[2] },
                    misth: { id: expday[3], description: expday[3] },
                    btlth: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.addDropDownsForm.patchValue({
                    StartThursday: { id: expday[1], description: expday[1] },
                    EndThursday: { id: expday[2], description: expday[2] },
                    toth: { id: expday[3], description: expday[3] },
                    btlth: { id: expday[4], description: expday[4] },
                  });
                }
              }
              //friday exp
              if (data.friday_exp) {
                expday = data.friday_exp.split(",");
                if (expday[0] == true) {
                  this.addDropDownsForm.patchValue({
                    wsafr: { id: expday[1], description: expday[1] },
                    webfr: { id: expday[2], description: expday[2] },
                    misfr: { id: expday[3], description: expday[3] },
                    btlfr: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.addDropDownsForm.patchValue({
                    StartFriday: { id: expday[1], description: expday[1] },
                    EndFriday: { id: expday[2], description: expday[2] },
                    tofr: { id: expday[3], description: expday[3] },
                    btlfr: { id: expday[4], description: expday[4] },
                  });
                }
              }
            } else {
              this.managed = false;
            }
          }
        });
        this.toast.success(teamDrop.description + " Team Settings Applied!");
      }
      this.disableWork = true;
      this.addDropDownsForm
        .get("addFlexibleCheckbox")
        .disable({ onlySelf: true });
      this.addDropDownsForm
        .get("editCostomWorkDays")
        .disable({ onlySelf: true });
      this.addDropDownsForm.get("saIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("suIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("moIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("tuIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("weIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("thIsFlex").disable({ onlySelf: true });
      this.addDropDownsForm.get("frIsFlex").disable({ onlySelf: true });
    } else if (event.value == "Individual Settings") {
      this.disableWork = false;
      this.addDropDownsForm
        .get("addFlexibleCheckbox")
        .enable({ onlySelf: true });
      this.addDropDownsForm
        .get("editCostomWorkDays")
        .enable({ onlySelf: true });
      this.addDropDownsForm.get("saIsFlex").enable({ onlySelf: true });
      this.addDropDownsForm.get("suIsFlex").enable({ onlySelf: true });
      this.addDropDownsForm.get("moIsFlex").enable({ onlySelf: true });
      this.addDropDownsForm.get("tuIsFlex").enable({ onlySelf: true });
      this.addDropDownsForm.get("weIsFlex").enable({ onlySelf: true });
      this.addDropDownsForm.get("thIsFlex").enable({ onlySelf: true });
      this.addDropDownsForm.get("frIsFlex").enable({ onlySelf: true });
    }
  }

  selectededitedWorkSettings(event) {
    let teamValue;
    if (event.value == "Organistaion Settings") {
      this.setEditWorkDetailsByOrgData();
      this.disableWork = true;
      this.editDropDownsForm
        .get("editFlexibleCheckbox")
        .disable({ onlySelf: true });
      this.editDropDownsForm
        .get("editCostomWorkDays")
        .disable({ onlySelf: true });
      this.editDropDownsForm.get("saIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("suIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("moIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("tuIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("weIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("thIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("frIsFlex").disable({ onlySelf: true });
      this.toast.success("Organization Settings Applied!");
    } else if (event.value == "Team Settings") {
      let teamDrop = this.editDropDownsForm.value.editTeamDropdownValue;
      if (
        teamDrop.description == "Without Team" ||
        teamDrop.description == null ||
        teamDrop.description == "" ||
        teamDrop.description == undefined
      ) {
        Swal.fire(
          "Error!",
          "Please select a team from General Details!",
          "error"
        );
        this.addDropDownsForm.patchValue({
          workSettings: "Organistaion Settings",
        });
      } else {
        let postData = {
          id: this.editDropDownsForm.value.editTeamDropdownValue.id,
        };
        this.teamService.FindByTeamIDnew(postData).subscribe((data: any) => {
          if (data) {
            teamValue = data;

            if (teamValue.working_days !== null) {
              let testData = teamValue.working_days.split(",");
              this.WorkdaysData = [];
              testData.includes("Saturday") === true
                ? this.WorkdaysData.push({
                    day: "SA",
                    day_name: "Saturday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "SA",
                    day_name: "Saturday",
                    is_working: false,
                  });
              testData.includes("Sunday") === true
                ? this.WorkdaysData.push({
                    day: "SU",
                    day_name: "Sunday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "SU",
                    day_name: "Sunday",
                    is_working: false,
                  });
              testData.includes("Monday") === true
                ? this.WorkdaysData.push({
                    day: "MO",
                    day_name: "Monday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "MO",
                    day_name: "Monday",
                    is_working: false,
                  });
              testData.includes("Tuesday") === true
                ? this.WorkdaysData.push({
                    day: "TU",
                    day_name: "Tuesday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "TU",
                    day_name: "Tuesday",
                    is_working: false,
                  });
              testData.includes("Wednesday") === true
                ? this.WorkdaysData.push({
                    day: "WE",
                    day_name: "Wednesday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "WE",
                    day_name: "Wednesday",
                    is_working: false,
                  });
              testData.includes("Thursday") === true
                ? this.WorkdaysData.push({
                    day: "TH",
                    day_name: "Thursday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "TH",
                    day_name: "Thursday",
                    is_working: false,
                  });
              testData.includes("Friday") === true
                ? this.WorkdaysData.push({
                    day: "FR",
                    day_name: "Friday",
                    is_working: true,
                  })
                : this.WorkdaysData.push({
                    day: "FR",
                    day_name: "Friday",
                    is_working: false,
                  });
              console.log(this.WorkdaysData);
            } else {
              this.WorkdaysData = [
                {
                  day: "SA",
                  day_name: "Saturday",
                  is_working: false,
                },
                {
                  day: "SU",
                  day_name: "Sunday",
                  is_working: true,
                },
                {
                  day: "MO",
                  day_name: "Monday",
                  is_working: true,
                },
                {
                  day: "TU",
                  day_name: "Tuesday",
                  is_working: true,
                },
                {
                  day: "WE",
                  day_name: "Wednesday",
                  is_working: true,
                },
                {
                  day: "TH",
                  day_name: "Thursday",
                  is_working: true,
                },
                {
                  day: "FR",
                  day_name: "Friday",
                  is_working: false,
                },
              ];
            }
            if (data.is_flexible === true) {
              this.editIsFlexibleDiv = true;
              this.addDropDownsForm.patchValue({
                startTimeDropdownValue: { id: null, description: "select" },
                endTimeDropdownValue: { id: null, description: "select" },
                addCheckinTolerance: { id: null, description: "select" },
                addBreakTimeLimit: { id: null, description: "select" },
                editCheckInAfter: {
                  id: data.checkin_after,
                  description: data.checkin_after,
                },
                editCheckOutBefore: {
                  id: data.checkout_before,
                  description: data.checkout_before,
                },
                editTotalHoursDropdownValue: {
                  id: data.min_hrs_flx,
                  description: data.min_hrs_flx,
                },
                editBreakTimeLimitFlex: {
                  id: data.break_time_flx,
                  description: data.break_time_flx,
                },
              });
            } else {
              this.addDropDownsForm.patchValue({
                startTimeDropdownValue: {
                  id: data.work_start_time,
                  description: data.work_start_time,
                },
                endTimeDropdownValue: {
                  id: data.work_end_time,
                  description: data.work_end_time,
                },
                addCheckinTolerance: {
                  id: data.checkin_tolarence,
                  description: data.checkin_tolarence,
                },
                addBreakTimeLimit: {
                  id: data.break_time,
                  description: data.break_time,
                },
                editCheckInAfter: { id: null, description: "select" },
                editCheckOutBefore: { id: null, description: "select" },
                editTotalHoursDropdownValue: {
                  id: null,
                  description: "select",
                },
                editBreakTimeLimitFlex: { id: null, description: "select" },
              });
            }
            if (data.is_custom_work) {
              let exptest = data.work_days_exp.split(",");
              this.editWorkDayExp = [];
              this.managed = true;
              exptest.includes("Saturday.") === true
                ? this.editWorkDayExp.push({
                    day: "SA",
                    day_name: "Saturday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "SA",
                    day_name: "Saturday.",
                    is_working: false,
                  });
              exptest.includes("Sunday.") === true
                ? this.editWorkDayExp.push({
                    day: "SU",
                    day_name: "Sunday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "SU",
                    day_name: "Sunday.",
                    is_working: false,
                  });
              exptest.includes("Monday.") === true
                ? this.editWorkDayExp.push({
                    day: "MO",
                    day_name: "Monday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "MO",
                    day_name: "Monday.",
                    is_working: false,
                  });
              exptest.includes("Tuesday.") === true
                ? this.editWorkDayExp.push({
                    day: "TU",
                    day_name: "Tuesday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "TU",
                    day_name: "Tuesday.",
                    is_working: false,
                  });
              exptest.includes("Wednesday.") === true
                ? this.editWorkDayExp.push({
                    day: "WE",
                    day_name: "Wednesday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "WE",
                    day_name: "Wednesday.",
                    is_working: false,
                  });
              exptest.includes("Thursday.") === true
                ? this.editWorkDayExp.push({
                    day: "TH",
                    day_name: "Thursday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "TH",
                    day_name: "Thursday.",
                    is_working: false,
                  });
              exptest.includes("Friday.") === true
                ? this.editWorkDayExp.push({
                    day: "FR",
                    day_name: "Friday.",
                    is_working: true,
                  })
                : this.editWorkDayExp.push({
                    day: "FR",
                    day_name: "Friday.",
                    is_working: false,
                  });

              let expday = [];
              // saturday exp
              if (data.saturday_exp) {
                expday = data.saturday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsasa: { id: expday[1], description: expday[1] },
                    websa: { id: expday[2], description: expday[2] },
                    misa: { id: expday[3], description: expday[3] },
                    btlsa: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartSaturday: { id: expday[1], description: expday[1] },
                    EndSaturday: { id: expday[2], description: expday[2] },
                    tosa: { id: expday[3], description: expday[3] },
                    btlsa: { id: expday[4], description: expday[4] },
                  });
                }
              }
              // sunday exp
              if (data.sunday_exp) {
                expday = data.sunday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsasu: { id: expday[1], description: expday[1] },
                    websu: { id: expday[2], description: expday[2] },
                    misu: { id: expday[3], description: expday[3] },
                    btlsu: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartSunday: { id: expday[1], description: expday[1] },
                    EndSunday: { id: expday[2], description: expday[2] },
                    tosu: { id: expday[3], description: expday[3] },
                    btlsu: { id: expday[4], description: expday[4] },
                  });
                }
              }
              //monday exp
              if (data.monday_exp) {
                expday = data.monday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsamo: { id: expday[1], description: expday[1] },
                    webmo: { id: expday[2], description: expday[2] },
                    mismo: { id: expday[3], description: expday[3] },
                    btlmo: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartMonday: { id: expday[1], description: expday[1] },
                    EndMonday: { id: expday[2], description: expday[2] },
                    tomo: { id: expday[3], description: expday[3] },
                    btlmo: { id: expday[4], description: expday[4] },
                  });
                }
              }
              //tuesday exp
              if (data.tuesday_exp) {
                expday = data.tuesday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsatu: { id: expday[1], description: expday[1] },
                    webtu: { id: expday[2], description: expday[2] },
                    mistu: { id: expday[3], description: expday[3] },
                    btltu: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartTuesday: { id: expday[1], description: expday[1] },
                    EndTuesday: { id: expday[2], description: expday[2] },
                    totu: { id: expday[3], description: expday[3] },
                    btltu: { id: expday[4], description: expday[4] },
                  });
                }
              }
              // wednesday exp
              if (data.wednesday_exp) {
                expday = data.wednesday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsawe: { id: expday[1], description: expday[1] },
                    webwe: { id: expday[2], description: expday[2] },
                    miswe: { id: expday[3], description: expday[3] },
                    btlwe: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartWednesday: { id: expday[1], description: expday[1] },
                    EndWednesday: { id: expday[2], description: expday[2] },
                    towe: { id: expday[3], description: expday[3] },
                    btlwe: { id: expday[4], description: expday[4] },
                  });
                }
              }
              // thursday exp
              if (data.thursday_exp) {
                expday = data.thursday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsath: { id: expday[1], description: expday[1] },
                    webth: { id: expday[2], description: expday[2] },
                    misth: { id: expday[3], description: expday[3] },
                    btlth: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartThursday: { id: expday[1], description: expday[1] },
                    EndThursday: { id: expday[2], description: expday[2] },
                    toth: { id: expday[3], description: expday[3] },
                    btlth: { id: expday[4], description: expday[4] },
                  });
                }
              }
              //friday exp
              if (data.friday_exp) {
                expday = data.friday_exp.split(",");
                if (expday[0] == true) {
                  this.editDropDownsForm.patchValue({
                    wsafr: { id: expday[1], description: expday[1] },
                    webfr: { id: expday[2], description: expday[2] },
                    misfr: { id: expday[3], description: expday[3] },
                    btlfr: { id: expday[4], description: expday[4] },
                  });
                } else {
                  this.editDropDownsForm.patchValue({
                    StartFriday: { id: expday[1], description: expday[1] },
                    EndFriday: { id: expday[2], description: expday[2] },
                    tofr: { id: expday[3], description: expday[3] },
                    btlfr: { id: expday[4], description: expday[4] },
                  });
                }
              }
            } else {
              this.managed = false;
            }
          }
        });
        this.toast.success(teamDrop.description + " Team Settings Applied!");
      }
      this.disableWork = true;
      this.editDropDownsForm
        .get("editFlexibleCheckbox")
        .disable({ onlySelf: true });
      this.editDropDownsForm
        .get("editCostomWorkDays")
        .disable({ onlySelf: true });
      this.editDropDownsForm.get("saIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("suIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("moIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("tuIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("weIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("thIsFlex").disable({ onlySelf: true });
      this.editDropDownsForm.get("frIsFlex").disable({ onlySelf: true });
    } else if (event.value == "Individual Settings") {
      this.disableWork = false;
      this.editDropDownsForm
        .get("editFlexibleCheckbox")
        .enable({ onlySelf: true });
      this.editDropDownsForm
        .get("editCostomWorkDays")
        .enable({ onlySelf: true });
      this.editDropDownsForm.get("saIsFlex").enable({ onlySelf: true });
      this.editDropDownsForm.get("suIsFlex").enable({ onlySelf: true });
      this.editDropDownsForm.get("moIsFlex").enable({ onlySelf: true });
      this.editDropDownsForm.get("tuIsFlex").enable({ onlySelf: true });
      this.editDropDownsForm.get("weIsFlex").enable({ onlySelf: true });
      this.editDropDownsForm.get("thIsFlex").enable({ onlySelf: true });
      this.editDropDownsForm.get("frIsFlex").enable({ onlySelf: true });
    }
  }

  disableEditSection() {
    this.editEmployeeForm.get("eFirstName").disable({ onlySelf: true });
    this.editEmployeeForm.get("eLastName").disable({ onlySelf: true });
    this.editEmployeeForm.get("eWorkEmail").disable({ onlySelf: true });
    this.editDropDownsForm
      .get("editStatusDropdownValue")
      .disable({ onlySelf: true });
    this.editDropDownsForm
      .get("editTeamDropdownValue")
      .disable({ onlySelf: true });
    //this.editDropDownsForm.get('editJoinedDate').disable({ onlySelf: true});

    this.editDropDownsForm
      .get("editEmpTypeDropdownValue")
      .disable({ onlySelf: true });
    this.editDropDownsForm
      .get("editRoleDropdownValue")
      .disable({ onlySelf: true });
    this.editDropDownsForm
      .get("editworkLocDropdownValue")
      .disable({ onlySelf: true });
    this.editDropDownsForm
      .get("editTimeZoneDropdownValue")
      .disable({ onlySelf: true });
    this.editDropDownsForm
      .get("editTimeFormatDropdownValue")
      .disable({ onlySelf: true });

    this.editDropDownsForm.get("workSettings").disable({ onlySelf: true });
    this.editDropDownsForm
      .get("wrkProfileEffectiveDay")
      .disable({ onlySelf: true });

    this.editEmployeeLeaveForm
      .get("editleaveProfileDropdownValue")
      .disable({ onlySelf: true });
    this.editEmployeeLeaveForm
      .get("editProfileStartDate")
      .disable({ onlySelf: true });
    this.editEmployeeLeaveForm
      .get("editopenBalance")
      .disable({ onlySelf: true });
    this.editEmployeeLeaveForm
      .get("editleaveTaken")
      .disable({ onlySelf: true });
    this.editEmployeeLeaveForm
      .get("editleaveTakenSick")
      .disable({ onlySelf: true });

    this.editEmployeeLeaveForm
      .get("isWeekDayOvertime")
      .disable({ onlySelf: true });
    this.editEmployeeLeaveForm
      .get("isHoliDayOvertime")
      .disable({ onlySelf: true });
    this.editEmployeeLeaveForm.get("overtimeHour").disable({ onlySelf: true });
    this.editEmployeeLeaveForm
      .get("overtimeMinute")
      .disable({ onlySelf: true });

    this.editEmployeeExtension.get("dateofbirth").disable({ onlySelf: true });
    this.editEmployeeExtension.get("maritalStatus").disable({ onlySelf: true });
    this.editEmployeeExtension.get("phoneNo").disable({ onlySelf: true });
    this.editEmployeeExtension.get("personalEmail").disable({ onlySelf: true });
    this.editEmployeeExtension
      .get("gardianContact")
      .disable({ onlySelf: true });
    this.editEmployeeExtension
      .get("emergencyContact")
      .disable({ onlySelf: true });
    this.editEmployeeExtension
      .get("gardianRelation")
      .disable({ onlySelf: true });
    this.editEmployeeExtension.get("fullNamePst").disable({ onlySelf: true });
    this.editEmployeeExtension.get("passNumber").disable({ onlySelf: true });
    this.editEmployeeExtension
      .get("passIssueContry")
      .disable({ onlySelf: true });
    this.editEmployeeExtension.get("passIssueDate").disable({ onlySelf: true });
    this.editEmployeeExtension.get("passExpDate").disable({ onlySelf: true });
    this.editEmployeeExtension.get("adr1").disable({ onlySelf: true });
    this.editEmployeeExtension.get("adr2").disable({ onlySelf: true });
    this.editEmployeeExtension.get("adrCity").disable({ onlySelf: true });
    this.editEmployeeExtension.get("adrCountry").disable({ onlySelf: true });
    this.editEmployeeExtension.get("adrPostalCode").disable({ onlySelf: true });
    this.editEmployeeExtension.get("isconsame").disable({ onlySelf: true });
    this.editEmployeeExtension.get("conAdr1").disable({ onlySelf: true });
    this.editEmployeeExtension.get("conAdr2").disable({ onlySelf: true });
    this.editEmployeeExtension.get("conCity").disable({ onlySelf: true });
    this.editEmployeeExtension.get("conCountry").disable({ onlySelf: true });
    this.editEmployeeExtension.get("conPostalCode").disable({ onlySelf: true });
    this.editEmployeeExtension.get("conStart").disable({ onlySelf: true });
    this.editEmployeeExtension.get("conEnd").disable({ onlySelf: true });
    this.editEmployeeExtension.get("labourId").disable({ onlySelf: true });
    this.editEmployeeExtension.get("labourExpDate").disable({ onlySelf: true });
    this.editEmployeeExtension.get("visaId").disable({ onlySelf: true });
    this.editEmployeeExtension.get("visaType").disable({ onlySelf: true });
    this.editEmployeeExtension.get("visaExpDate").disable({ onlySelf: true });
    this.editEmployeeExtension.get("emiratesId").disable({ onlySelf: true });
    this.editEmployeeExtension
      .get("emiratesIdExpDate")
      .disable({ onlySelf: true });
    this.editEmployeeExtension.get("insProvider").disable({ onlySelf: true });
    this.editEmployeeExtension.get("insPloicy").disable({ onlySelf: true });
    this.editEmployeeExtension.get("insExp").disable({ onlySelf: true });
    this.editEmployeeExtension.get("bankName").disable({ onlySelf: true });
    this.editEmployeeExtension.get("bankBranch").disable({ onlySelf: true });
    this.editEmployeeExtension.get("accNumber").disable({ onlySelf: true });
    this.editEmployeeExtension.get("iban").disable({ onlySelf: true });
    this.editEmployeeExtension.get("swiftCode").disable({ onlySelf: true });
    this.editEmployeeExtension.get("salEffDate").disable({ onlySelf: true });
    this.editEmployeeExtension.get("basicPay").disable({ onlySelf: true });
    this.editEmployeeExtension.get("travelAllow").disable({ onlySelf: true });
    this.editEmployeeExtension.get("accoAllow").disable({ onlySelf: true });
    this.editEmployeeExtension.get("aOneName").disable({ onlySelf: true });
    this.editEmployeeExtension.get("aOne").disable({ onlySelf: true });
    this.editEmployeeExtension.get("aTwoName").disable({ onlySelf: true });
    this.editEmployeeExtension.get("aTwo").disable({ onlySelf: true });
    this.editEmployeeExtension.get("aThreeName").disable({ onlySelf: true });
    this.editEmployeeExtension.get("aThree").disable({ onlySelf: true });
    this.editEmployeeExtension.get("taxDed").disable({ onlySelf: true });
    this.editEmployeeExtension.get("insDed").disable({ onlySelf: true });
    this.editEmployeeExtension.get("dOneName").disable({ onlySelf: true });
    this.editEmployeeExtension.get("dOne").disable({ onlySelf: true });
    this.editEmployeeExtension.get("dTwoName").disable({ onlySelf: true });
    this.editEmployeeExtension.get("dTwo").disable({ onlySelf: true });
    this.editEmployeeExtension.get("dThreeName").disable({ onlySelf: true });
    this.editEmployeeExtension.get("dThree").disable({ onlySelf: true });
  }

  actionAproveList(data: any) {
    this.spinner.show();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    if (data.update_status == "pending" || data.update_status == "Pending") {
      if (data.action == "Add") {
        this.empService
          .GetEmpOverrideDetailsById({ id: data.id })
          .subscribe((resp: any) => {
            console.log("add employee popup details", resp);
            let serverData = resp;
            if (!this.showButtonDiv) {
              serverData["message"] = "Approval for Creating new Employee";
            } else {
              serverData["message"] =
                "Requested Approval for Creating new Employee";
            }
            this.viewEditNotificationModelData = serverData;
            this.sendEmployeeData = Object.assign({}, serverData[0]);
            console.log(this.viewEditNotificationModelData);
            this.spinner.hide();
            this.addEmployeeRequest = true;
          });

        this.adminService
          .GetLeaveRelatedNotificationByReffId({ id: data.id })
          .subscribe((resp: []) => {
            if (resp) {
              let filtresp: any = resp.filter(
                (elm: any) =>
                  elm.message == "Requested Approval for Creating new Employee"
              );
              if (filtresp[0]) {
                console.log("the response from ", resp);
                this.originalViewEditNotificationModelData = {
                  id: filtresp[0].id,
                  modified_by_empId: user_info.id,
                };
              } else {
                this.originalViewEditNotificationModelData = {
                  id: "",
                  modified_by_empId: user_info.id,
                };
              }
            }
          });

        $("#notificationModal").modal("show");
      }
      if (data.action == "Edit") {
        this.adminService
          .GetLeaveRelatedNotificationByReffId({ id: data.id })
          .subscribe((resp: []) => {
            if (resp) {
              let filtresp: any = resp.filter(
                (elm: any) =>
                  elm.message ==
                  "Requested Approval for Updating Employee Details"
              );
              if (filtresp[0]) {
                console.log("the response from ", resp);
                this.getNotificData(
                  filtresp[0],
                  "Requested Approval for Updating Employee Details"
                );
              } else {
                this.toast.warning("edit notification is not found");
              }
            }
          });
      }
      if (data.action == "Delete") {
        // !!!delete action
      }
    }
    if (data.update_status == "Approved") {
      this.showdetailsOverrideDetails(data.id);
    }
    if (data.update_status == "Decline" || data.update_status == "decline") {
      this.showdetailsOverrideDetails(data.id);
    }
    this.spinner.hide();
  }

  overrideheaderdetails;
  overridedetails;
  showdetailsOverrideDetails(dataid: any) {
    console.log("dataid", dataid);
    this.overrideheaderdetails = dataid;
    this.UpdateHistory = [];
    this.groupedData = [];
    let maindata = {};
    let changesection = [];
    this.empService.GetColumnChanges({ id: dataid }).subscribe((resp: any) => {
      console.log(resp, "groupedArr resp");
      if (resp && resp.length > 0) {
        resp.forEach((value) => {
          changesection.push({
            section: value.Cateogry,
            field: value.ColumnName,
            oldvalue: value.PreviousValue,
            newvalue: value.NewValue,
          });
        });
        let groupedArr = changesection.reduce((acc, obj) => {
          let { section, ...rest } = obj;
          if (!acc[section]) {
            acc[section] = [];
          }
          acc[section].push(rest);
          return acc;
        }, {});
        console.log(groupedArr, "groupedArr");

        this.groupedData = Object.entries(groupedArr).map(([id, value]) => ({
          id,
          value,
        }));

        this.modalService.open(this.overridedata, {
          size: "lg",
          backdrop: "static",
        });
      } else {
        this.empService
          .GetEmployeeDraftdelailsByID({ id: dataid })
          .subscribe((resp: any) => {
            if (resp) {
              resp.forEach((value) => {
                maindata["Createdby"] = value.createdbyname;
                maindata["CreatedDate"] = moment(value.created_date).format(
                  "ll"
                );
                //general details
                changesection.push({
                  section: "General Details",
                  field: "First Name",
                  oldvalue: value.first_name,
                });
                changesection.push({
                  section: "General Details",
                  field: "Last Name",
                  oldvalue: value.last_name,
                });
                changesection.push({
                  section: "General Details",
                  field: "Gender",
                  oldvalue: value.gender,
                });
                changesection.push({
                  section: "General Details",
                  field: "Employee Status",
                  oldvalue: value.description,
                });
                //missing team
                changesection.push({
                  section: "General Details",
                  field: "Joined Date",
                  oldvalue: moment(value.joined_date).format("L"),
                });
                //administrative details
                //changesection.push({ 'section': 'Administrator Details', 'field': 'Employee Type', 'oldvalue': curempidvalue.description })
                //changesection.push({ 'section': 'Administrator Details', 'field': 'Employee Role', 'oldvalue': curempvalue.description})
                //geo details
                changesection.push({
                  section: "Geo Details",
                  field: "Work Location",
                  oldvalue: value.work_location,
                });
                changesection.push({
                  section: "Geo Details",
                  field: "Time Zone",
                  oldvalue: value.time_zone,
                });
                changesection.push({
                  section: "Geo Details",
                  field: "Time Format",
                  oldvalue: value.time_format,
                });
                //workday setting
                changesection.push({
                  section: "Work Days",
                  field: "Workday Settings",
                  oldvalue: value.workday_settings,
                });
                changesection.push({
                  section: "Work Days",
                  field: "Work Profile Effective Date",
                  oldvalue: moment(value.work_profile_effective_day).format(
                    "L"
                  ),
                });
                changesection.push({
                  section: "Work Days",
                  field: "Work Days",
                  oldvalue: value.working_days,
                });
                //leave Details
                //changesection.push({ 'section': 'Leave Details', 'field': 'Leave Profile', 'oldvalue': curempidvalue.description })
                //Overtime option
                changesection.push({
                  section: "Overtime Option",
                  field: "Workday Overtime",
                  oldvalue: value.is_weekday_overtime_enabled
                    ? "enabled"
                    : "disabled",
                });
                changesection.push({
                  section: "Overtime Option",
                  field: "Holiday Ovetime",
                  oldvalue: value.is_holiday_overtime_enabled
                    ? "enabled"
                    : "disabled",
                });
                changesection.push({
                  section: "Overtime Option",
                  field: "Minimum Ovetime",
                  oldvalue: value.minimum_overtime,
                });
                //Personal Details
                changesection.push({
                  section: "Personal Details",
                  field: "Date of Birth",
                  oldvalue: moment(value.dob).format("L"),
                });
                changesection.push({
                  section: "Personal Details",
                  field: "Marital Status",
                  oldvalue: value.marital_status,
                });
                changesection.push({
                  section: "Personal Details",
                  field: "Phone Number",
                  oldvalue: value.phone_no,
                });
                changesection.push({
                  section: "Personal Details",
                  field: "Email Address",
                  oldvalue: value.pesonal_email,
                });
                //Emergency details
                changesection.push({
                  section: "Emergency Contact Details",
                  field: "Contact Name",
                  oldvalue: value.gardian_contact,
                });
                changesection.push({
                  section: "Emergency Contact Details",
                  field: "Contact Phone Number",
                  oldvalue: value.emergency_contact,
                });
                changesection.push({
                  section: "Emergency Contact Details",
                  field: "Contact Relation",
                  oldvalue: value.gardian_relation,
                });
                //passportdetails
                changesection.push({
                  section: "Passport Details",
                  field: "Passport Full Name",
                  oldvalue: value.full_name_pst,
                });
                changesection.push({
                  section: "Passport Details",
                  field: "Passport Number",
                  oldvalue: value.passport_num,
                });
                changesection.push({
                  section: "Passport Details",
                  field: "Issue Date",
                  oldvalue: moment(value.pass_issue_date).format("L"),
                });
                changesection.push({
                  section: "Passport Details",
                  field: "Expiry Date",
                  oldvalue: moment(value.pass_exp_date).format("L"),
                });
                //local Address Details
                changesection.push({
                  section: "Address Details",
                  field: "Local Address Line 1",
                  oldvalue: value.adr_1,
                });
                changesection.push({
                  section: "Address Details",
                  field: "Local Address Line 2",
                  oldvalue: value.adr_2,
                });
                changesection.push({
                  section: "Address Details",
                  field: "Local Address City",
                  oldvalue: value.adr_city,
                });
                changesection.push({
                  section: "Address Details",
                  field: "Local Address Postal Code",
                  oldvalue: value.adr_postal_code,
                });
                //home Address Details
                changesection.push({
                  section: "Address Details",
                  field: "Home Address Line 1",
                  oldvalue: value.contact_adr_1,
                });
                changesection.push({
                  section: "Address Details",
                  field: "Home Address Line 2",
                  oldvalue: value.contact_adr_2,
                });
                changesection.push({
                  section: "Address Details",
                  field: "Home Address City",
                  oldvalue: value.contact_city,
                });
                changesection.push({
                  section: "Address Details",
                  field: "Home Address Postal Code",
                  oldvalue: value.contact_postal_code,
                });
                //contract Details
                changesection.push({
                  section: "Contract Details",
                  field: "Contract Start Date",
                  oldvalue: moment(value.con_start).format("L"),
                });
                changesection.push({
                  section: "Contract Details",
                  field: "Contract End Date",
                  oldvalue: moment(value.con_end).format("L"),
                });
                changesection.push({
                  section: "Contract Details",
                  field: "Labour ID",
                  oldvalue: value.labour_id,
                });
                changesection.push({
                  section: "Contract Details",
                  field: "Labour Expiry Date",
                  oldvalue: moment(value.labour_exp_date).format("L"),
                });
                //Uae Immigration Details
                changesection.push({
                  section: "UAE Immigration Details",
                  field: "Visa ID",
                  oldvalue: value.visa_id,
                });
                changesection.push({
                  section: "UAE Immigration Details",
                  field: "Visa Type",
                  oldvalue: value.visa_type,
                });
                changesection.push({
                  section: "UAE Immigration Details",
                  field: "Visa Expiry Date",
                  oldvalue: moment(value.visa_exp_date).format("L"),
                });
                changesection.push({
                  section: "UAE Immigration Details",
                  field: "Emirates ID",
                  oldvalue: value.emirates_id,
                });
                changesection.push({
                  section: "UAE Immigration Details",
                  field: "Emirates Expiry Date",
                  oldvalue: moment(value.emirates_id_exp_date).format("L"),
                });
                //insurance details
                changesection.push({
                  section: "Insurance Details",
                  field: "Provider Name",
                  oldvalue: value.ins_provider,
                });
                changesection.push({
                  section: "Insurance Details",
                  field: "Policy Number",
                  oldvalue: value.ins_policy,
                });
                changesection.push({
                  section: "Insurance Details",
                  field: "Insurance Expiry Date",
                  oldvalue: moment(value.ins_exp).format("L"),
                });
                //bank details
                changesection.push({
                  section: "Bank Details",
                  field: "Bank Name",
                  oldvalue: value.bank_name,
                });
                changesection.push({
                  section: "Bank Details",
                  field: "Bank Branch",
                  oldvalue: value.bank_branch,
                });
                changesection.push({
                  section: "Bank Details",
                  field: "Bank Account Number",
                  oldvalue: value.bank_account_num,
                });
                changesection.push({
                  section: "Bank Details",
                  field: "Bank IBAN",
                  oldvalue: value.bank_Iban,
                });
                changesection.push({
                  section: "Bank Details",
                  field: "Bank Swift",
                  oldvalue: value.bank_swift,
                });
                //salary Details
                changesection.push({
                  section: "Salary Details",
                  field: "Basic Salary",
                  oldvalue: this.formatMoney(value.basic_salary),
                });
                changesection.push({
                  section: "Salary Details",
                  field: "Accomodation Allowance",
                  oldvalue: this.formatMoney(value.accommod_allow),
                });
                changesection.push({
                  section: "Salary Details",
                  field: "Travel Allowance",
                  oldvalue: this.formatMoney(value.travel_allow),
                });
                if (value.a_one && value.a_one_name)
                  changesection.push({
                    section: "Salary Details",
                    field: value.a_one_name.toString() + " Allowance",
                    oldvalue: this.formatMoney(value.a_one),
                  });
                if (value.a_two && value.a_two_name)
                  changesection.push({
                    section: "Salary Details",
                    field: value.a_two_name.toString() + " Allowance",
                    oldvalue: this.formatMoney(value.a_two),
                  });
                if (value.a_three && value.a_three_name)
                  changesection.push({
                    section: "Salary Details",
                    field: value.a_three_name.toString() + " Allowance",
                    oldvalue: this.formatMoney(value.a_three),
                  });
                changesection.push({
                  section: "Salary Details",
                  field: "Tax Deduction",
                  oldvalue: this.formatMoney(value.tax_deduc),
                });
                changesection.push({
                  section: "Salary Details",
                  field: "Insurance Deduction",
                  oldvalue: this.formatMoney(value.insurance_deduc),
                });
                if (value.d_one && value.d_one_name)
                  changesection.push({
                    section: "Salary Details",
                    field: value.d_one_name.toString() + " Deduction",
                    oldvalue: this.formatMoney(value.d_one),
                  });
                if (value.d_two && value.d_two_name)
                  changesection.push({
                    section: "Salary Details",
                    field: value.d_two_name.toString() + " Deduction",
                    oldvalue: this.formatMoney(value.d_two),
                  });
                if (value.d_three && value.d_three_name)
                  changesection.push({
                    section: "Salary Details",
                    field: value.d_three_name.toString() + " Deduction",
                    oldvalue: this.formatMoney(value.d_three),
                  });
                changesection.push({
                  section: "Salary Details",
                  field: "Gross Pay",
                  oldvalue: this.formatMoney(value.gross_pay),
                });
                changesection.push({
                  section: "Salary Details",
                  field: "Net Deduction",
                  oldvalue: this.formatMoney(value.net_deduc),
                });
                changesection.push({
                  section: "Salary Details",
                  field: "Net Pay",
                  oldvalue: this.formatMoney(value.net_pay),
                });

                let groupedArr = changesection.reduce((acc, obj) => {
                  let { section, ...rest } = obj;
                  if (!acc[section]) {
                    acc[section] = [];
                  }
                  acc[section].push(rest);
                  return acc;
                }, {});

                maindata["vlaues"] = Object.entries(groupedArr).map(
                  ([id, value]) => ({ id, value })
                );
                this.UpdateHistory.push(maindata);
                changesection = [];
                maindata = {};

                this.modalService.open(this.overridedata, {
                  size: "lg",
                  backdrop: "static",
                });
              });
            }
          });
        this.toast.info("These are the intial details of the employee.");
      }
    });
  }

  closeoverridemodel() {
    this.overrideheaderdetails = {};
    this.modalService.dismissAll();
  }

  UpdateHistory;
  getEmployeeEditHistory(empid) {
    this.UpdateHistory = [];
    let maindata = {};
    let changesection = [];
    this.empService
      .getEmployeeEditHistoryByEmpId({ id: empid })
      .subscribe((resp: any) => {
        if (resp) {
          resp.forEach((value) => {
            maindata["Createdby"] = value.createdbyname;
            maindata["CreatedDate"] = moment(value.created_date).format("ll");
            //general details
            changesection.push({
              section: "General Details",
              field: "First Name",
              oldvalue: value.first_name,
            });
            changesection.push({
              section: "General Details",
              field: "Last Name",
              oldvalue: value.last_name,
            });
            changesection.push({
              section: "General Details",
              field: "Gender",
              oldvalue: value.gender,
            });
            changesection.push({
              section: "General Details",
              field: "Employee Status",
              oldvalue: value.description,
            });
            //missing team
            changesection.push({
              section: "General Details",
              field: "Joined Date",
              oldvalue: moment(value.joined_date).format("L"),
            });
            //administrative details
            //changesection.push({ 'section': 'Administrator Details', 'field': 'Employee Type', 'oldvalue': curempidvalue.description })
            //changesection.push({ 'section': 'Administrator Details', 'field': 'Employee Role', 'oldvalue': curempvalue.description})
            //geo details
            changesection.push({
              section: "Geo Details",
              field: "Work Location",
              oldvalue: value.work_location,
            });
            changesection.push({
              section: "Geo Details",
              field: "Time Zone",
              oldvalue: value.time_zone,
            });
            changesection.push({
              section: "Geo Details",
              field: "Time Format",
              oldvalue: value.time_format,
            });
            //workday setting
            changesection.push({
              section: "Work Days",
              field: "Workday Settings",
              oldvalue: value.workday_settings,
            });
            changesection.push({
              section: "Work Days",
              field: "Work Profile Effective Date",
              oldvalue: moment(value.work_profile_effective_day).format("L"),
            });
            changesection.push({
              section: "Work Days",
              field: "Work Days",
              oldvalue: value.working_days,
            });
            //leave Details
            //changesection.push({ 'section': 'Leave Details', 'field': 'Leave Profile', 'oldvalue': curempidvalue.description })
            //Overtime option
            changesection.push({
              section: "Overtime Option",
              field: "Workday Overtime",
              oldvalue: value.is_weekday_overtime_enabled
                ? "enabled"
                : "disabled",
            });
            changesection.push({
              section: "Overtime Option",
              field: "Holiday Ovetime",
              oldvalue: value.is_holiday_overtime_enabled
                ? "enabled"
                : "disabled",
            });
            changesection.push({
              section: "Overtime Option",
              field: "Minimum Ovetime",
              oldvalue: value.minimum_overtime,
            });
            //Personal Details
            changesection.push({
              section: "Personal Details",
              field: "Date of Birth",
              oldvalue: moment(value.dob).format("L"),
            });
            changesection.push({
              section: "Personal Details",
              field: "Marital Status",
              oldvalue: value.marital_status,
            });
            changesection.push({
              section: "Personal Details",
              field: "Phone Number",
              oldvalue: value.phone_no,
            });
            changesection.push({
              section: "Personal Details",
              field: "Email Address",
              oldvalue: value.pesonal_email,
            });
            //Emergency details
            changesection.push({
              section: "Emergency Contact Details",
              field: "Contact Name",
              oldvalue: value.gardian_contact,
            });
            changesection.push({
              section: "Emergency Contact Details",
              field: "Contact Phone Number",
              oldvalue: value.emergency_contact,
            });
            changesection.push({
              section: "Emergency Contact Details",
              field: "Contact Relation",
              oldvalue: value.gardian_relation,
            });
            //passportdetails
            changesection.push({
              section: "Passport Details",
              field: "Passport Full Name",
              oldvalue: value.full_name_pst,
            });
            changesection.push({
              section: "Passport Details",
              field: "Passport Number",
              oldvalue: value.passport_num,
            });
            changesection.push({
              section: "Passport Details",
              field: "Issue Date",
              oldvalue: moment(value.pass_issue_date).format("L"),
            });
            changesection.push({
              section: "Passport Details",
              field: "Expiry Date",
              oldvalue: moment(value.pass_exp_date).format("L"),
            });
            //local Address Details
            changesection.push({
              section: "Address Details",
              field: "Local Address Line 1",
              oldvalue: value.adr_1,
            });
            changesection.push({
              section: "Address Details",
              field: "Local Address Line 2",
              oldvalue: value.adr_2,
            });
            changesection.push({
              section: "Address Details",
              field: "Local Address City",
              oldvalue: value.adr_city,
            });
            changesection.push({
              section: "Address Details",
              field: "Local Address Postal Code",
              oldvalue: value.adr_postal_code,
            });
            //home Address Details
            changesection.push({
              section: "Address Details",
              field: "Home Address Line 1",
              oldvalue: value.contact_adr_1,
            });
            changesection.push({
              section: "Address Details",
              field: "Home Address Line 2",
              oldvalue: value.contact_adr_2,
            });
            changesection.push({
              section: "Address Details",
              field: "Home Address City",
              oldvalue: value.contact_city,
            });
            changesection.push({
              section: "Address Details",
              field: "Home Address Postal Code",
              oldvalue: value.contact_postal_code,
            });
            //contract Details
            changesection.push({
              section: "Contract Details",
              field: "Contract Start Date",
              oldvalue: moment(value.con_start).format("L"),
            });
            changesection.push({
              section: "Contract Details",
              field: "Contract End Date",
              oldvalue: moment(value.con_end).format("L"),
            });
            changesection.push({
              section: "Contract Details",
              field: "Labour ID",
              oldvalue: value.labour_id,
            });
            changesection.push({
              section: "Contract Details",
              field: "Labour Expiry Date",
              oldvalue: moment(value.labour_exp_date).format("L"),
            });
            //Uae Immigration Details
            changesection.push({
              section: "UAE Immigration Details",
              field: "Visa ID",
              oldvalue: value.visa_id,
            });
            changesection.push({
              section: "UAE Immigration Details",
              field: "Visa Type",
              oldvalue: value.visa_type,
            });
            changesection.push({
              section: "UAE Immigration Details",
              field: "Visa Expiry Date",
              oldvalue: moment(value.visa_exp_date).format("L"),
            });
            changesection.push({
              section: "UAE Immigration Details",
              field: "Emirates ID",
              oldvalue: value.emirates_id,
            });
            changesection.push({
              section: "UAE Immigration Details",
              field: "Emirates Expiry Date",
              oldvalue: moment(value.emirates_id_exp_date).format("L"),
            });
            //insurance details
            changesection.push({
              section: "Insurance Details",
              field: "Provider Name",
              oldvalue: value.ins_provider,
            });
            changesection.push({
              section: "Insurance Details",
              field: "Policy Number",
              oldvalue: value.ins_policy,
            });
            changesection.push({
              section: "Insurance Details",
              field: "Insurance Expiry Date",
              oldvalue: moment(value.ins_exp).format("L"),
            });
            //bank details
            changesection.push({
              section: "Bank Details",
              field: "Bank Name",
              oldvalue: value.bank_name,
            });
            changesection.push({
              section: "Bank Details",
              field: "Bank Branch",
              oldvalue: value.bank_branch,
            });
            changesection.push({
              section: "Bank Details",
              field: "Bank Account Number",
              oldvalue: value.bank_account_num,
            });
            changesection.push({
              section: "Bank Details",
              field: "Bank IBAN",
              oldvalue: value.bank_Iban,
            });
            changesection.push({
              section: "Bank Details",
              field: "Bank Swift",
              oldvalue: value.bank_swift,
            });
            //salary Details
            changesection.push({
              section: "Salary Details",
              field: "Basic Salary",
              oldvalue: this.formatMoney(value.basic_salary),
            });
            changesection.push({
              section: "Salary Details",
              field: "Accomodation Allowance",
              oldvalue: this.formatMoney(value.accommod_allow),
            });
            changesection.push({
              section: "Salary Details",
              field: "Travel Allowance",
              oldvalue: this.formatMoney(value.travel_allow),
            });
            if (value.a_one && value.a_one_name)
              changesection.push({
                section: "Salary Details",
                field: value.a_one_name.toString() + " Allowance",
                oldvalue: this.formatMoney(value.a_one),
              });
            if (value.a_two && value.a_two_name)
              changesection.push({
                section: "Salary Details",
                field: value.a_two_name.toString() + " Allowance",
                oldvalue: this.formatMoney(value.a_two),
              });
            if (value.a_three && value.a_three_name)
              changesection.push({
                section: "Salary Details",
                field: value.a_three_name.toString() + " Allowance",
                oldvalue: this.formatMoney(value.a_three),
              });
            changesection.push({
              section: "Salary Details",
              field: "Tax Deduction",
              oldvalue: this.formatMoney(value.tax_deduc),
            });
            changesection.push({
              section: "Salary Details",
              field: "Insurance Deduction",
              oldvalue: this.formatMoney(value.insurance_deduc),
            });
            if (value.d_one && value.d_one_name)
              changesection.push({
                section: "Salary Details",
                field: value.d_one_name.toString() + " Deduction",
                oldvalue: this.formatMoney(value.d_one),
              });
            if (value.d_two && value.d_two_name)
              changesection.push({
                section: "Salary Details",
                field: value.d_two_name.toString() + " Deduction",
                oldvalue: this.formatMoney(value.d_two),
              });
            if (value.d_three && value.d_three_name)
              changesection.push({
                section: "Salary Details",
                field: value.d_three_name.toString() + " Deduction",
                oldvalue: this.formatMoney(value.d_three),
              });
            changesection.push({
              section: "Salary Details",
              field: "Gross Pay",
              oldvalue: this.formatMoney(value.gross_pay),
            });
            changesection.push({
              section: "Salary Details",
              field: "Net Deduction",
              oldvalue: this.formatMoney(value.net_deduc),
            });
            changesection.push({
              section: "Salary Details",
              field: "Net Pay",
              oldvalue: this.formatMoney(value.net_pay),
            });

            let groupedArr = changesection.reduce((acc, obj) => {
              let { section, ...rest } = obj;
              if (!acc[section]) {
                acc[section] = [];
              }
              acc[section].push(rest);
              return acc;
            }, {});

            maindata["vlaues"] = Object.entries(groupedArr).map(
              ([id, value]) => ({ id, value })
            );
            this.UpdateHistory.push(maindata);
            changesection = [];
            maindata = {};
          });
        }
      });
  }

  registrationForm: FormGroup;
  loadPasswordform() {
    this.registrationForm = this.formBuilder.group(
      {
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            this.atLeastOneSpecialChar,
            this.atLeastOneNumber,
          ],
        ],
        confirmPassword: ["", Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("password").value === g.get("confirmPassword").value
      ? null
      : { mismatch: true };
  }

  labPwd = "";
  closeSubmitPassword() {
    this.modalService.dismissAll();
  }

  atLeastOneSpecialChar(control: AbstractControl) {
    const regex = /[!@#$%^&*(),.?":{}|<>]/;
    return regex.test(control.value) ? null : { specialChar: true };
  }

  atLeastOneNumber(control: AbstractControl) {
    const regex = /\d/;
    return regex.test(control.value) ? null : { numberRequired: true };
  }

  //Delegate Access
  public deptForm: FormGroup;
  delegatorName;
  showerrorMsg = false;
  addformSubmitted = false;
  editformSubmitted = false;
  editable = false;

  is_permanent;
  is_temporary;

  showAddDelegate = false;
  showExpiryField = false;
  showPhoneFied = false;
  showInternal = false;

  async showAddNewDelegate() {
    this.spinner.show();

    let hasAuthority = false;

    try {
      hasAuthority = await this.getAllOrg();

      if (hasAuthority) {
        this.allEmployeeGrid = false;
        this.showAddDelegate = true;
        this.singleEmployeeAdd = false;
        this.singleEmployeeEdit = false;
        this.editable = false;
        let user_info = JSON.parse(localStorage.getItem("user_info"));
        this.deptForm = new FormGroup({
          delegation_name: new FormControl("", [Validators.required]),
          org: new FormControl("", [Validators.required]),
          emp: new FormControl("", [Validators.required]),
          user_type: new FormControl("External"),
          logintype: new FormControl("Email"),
          email: new FormControl("", [
            Validators.required,
            Validators.pattern(
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
          ]),
          phone: new FormControl(""),
          role: new FormControl(""),
          type: new FormControl("is_permanent"),
          expDate: new FormControl("", [Validators.required]),
          desc: new FormControl(""),
        });

        this.delegatorName = user_info.full_name;

        await this.GetEmployeeRoleByOrgID();
      }
    } catch (error) {
      console.error("Error showing delegate form", error);
    } finally {
      this.spinner.hide();

      if (!hasAuthority) {
        this.toast.error(
          "There is no organization associated with your account"
        );
      }
    }
  }

  async getAllOrg() {
    let userinfo: any = JSON.parse(localStorage.getItem("user_info"));
    this.orgData = [];

    try {
      const data: any = await this.OrganizationService.getAllOrg().toPromise();

      if (data && data.length > 0) {
        let filteredData = data.filter(
          (org) =>
            org.user_id == userinfo.user_id &&
            org.org_id !== localStorage.getItem("org_id")
        );
        console.log(filteredData, "TEST DATA");

        if (filteredData && filteredData.length > 0) {
          filteredData.forEach((element) => {
            this.orgData.push({
              id: element.org_id,
              value: element.org_name,
            });
          });
          console.log(this.orgData, "filteredData ORG");
          return true;
        } else {
          return false;
        }
      }
      console.log(data, "ORG");
    } catch (error) {
      console.error("Error fetching organization data", error);
      return false;
    }
  }

  async onOrgChange(e) {
    console.log(e.itemData, "org change");
    let org = e.itemData.id;
    this.empDelData = [];
    this.isEmpDelLoading = true;
    if (org) {
      try {
        const data: any =
          await this.OrganizationService.getEmployeesByOrgIdForDelegate(
            org
          ).toPromise();
        console.log(data, "data");

        if (data && data.length > 0) {
          data.forEach((element) => {
            this.empDelData.push({
              id: element.user_id,
              value: element.full_name,
            });
          });
        }
        this.isEmpDelLoading = false;
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
  }

  async onAddDelegateSubmit() {
    console.log("the data submitted", this.deptForm.value);
    let formData = this.deptForm.value;
    let ExistingEmpDetails = {
      user_id: null,
      org_id: null,
    };
    this.spinner.show();
    console.log("form data", formData);

    try {
      if (formData.user_type == "Internal") {
        ExistingEmpDetails = {
          user_id: formData.emp,
          org_id: formData.org,
        };
        await this.adddelegateDetails(formData, true, ExistingEmpDetails);
      } else {
        let postCheckData = {
          username:
            formData.logintype == "Email"
              ? formData.email
              : formData.phone.internationalNumber.replace(/\s+/g, ""),
          type: formData.logintype,
        };

        let rspcheck: any = await this.delegateService
          .CheckDelegateExisting(postCheckData)
          .toPromise();

        if (rspcheck.length > 0) {
          for (const element of rspcheck) {
            console.log(
              "element.org_id",
              element.org_id,
              "localStorage",
              localStorage.getItem("org_id")
            );

            if (element.org_id == localStorage.getItem("org_id")) {
              Swal.fire(
                "The User Already Exists in This Organisation",
                "Please Try with Another Email/Phone Number",
                "error"
              );
              return;
            } else {
              const res = await Swal.fire({
                title:
                  "You are about to add a delegate using an existing user from a different organization.",
                text:
                  "Do you want to continue to add " +
                  formData.delegation_name.toString() +
                  " as a Delegate for the " +
                  formData.role.description.toString() +
                  " role?",
                showCloseButton: true,
                confirmButtonColor: "#e91e63",
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: "Yes Create",
                cancelButtonText: "Cancel",
              });

              if (res.value === true) {
                await this.adddelegateDetails(
                  formData,
                  true,
                  ExistingEmpDetails
                );
              }
            }
          }
        } else {
          const res = await Swal.fire({
            title: "You are about to add a new delegate user.",
            text:
              "Do you want to continue adding " +
              formData.delegation_name.toString() +
              " as a Delegate for the " +
              formData.role.description.toString() +
              " role?",
            showCloseButton: true,
            confirmButtonColor: "#e91e63",
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: "Yes Create New",
            cancelButtonText: "Cancel",
          });

          if (res.value === true) {
            await this.adddelegateDetails(formData, false, ExistingEmpDetails);
          }
        }
      }
    } catch (error) {
      console.error("Error in onAddDelegateSubmit:", error);
      Swal.fire("Error", "An error occurred during submission", "error");
    } finally {
      this.spinner.hide();
    }
  }

  adddelegateDetails(delegateDetails, isExisting: boolean, ExistingEmpDetails) {
    let userinfo = JSON.parse(localStorage.getItem("user_info"));
    console.log(delegateDetails, ExistingEmpDetails, "********");
    let delegatePostData = {
      id: null,
      delegator_user_id: userinfo.user_id,
      delegator_emp_id: userinfo.id,
      delegator_full_name: userinfo.full_name,
      Is_delegate_existing_user: isExisting,
      delegate_user_id: ExistingEmpDetails.user_id
        ? ExistingEmpDetails.user_id
        : null,
      delegate_origin_org_id: ExistingEmpDetails.org_id
        ? ExistingEmpDetails.org_id
        : null,
      delegate_org_id: localStorage.getItem("org_id"),
      delegate_emp_id: null,
      delegate_name: delegateDetails.delegation_name,
      login_type: delegateDetails.logintype,
      email:
        delegateDetails.logintype == "Email" && isExisting
          ? delegateDetails.email
          : null,
      phone:
        delegateDetails.logintype == "Phone" && isExisting
          ? delegateDetails.phone.internationalNumber.replace(/\s+/g, "")
          : null,
      delegate_role_id: delegateDetails.role.id
        ? delegateDetails.role.id
        : null,
      delegate_role_name: delegateDetails.role.description
        ? delegateDetails.role.description
        : null,
      is_permanent: delegateDetails.type == "is_permanent" ? true : false,
      expiry_date:
        delegateDetails.type == "is_permanent" ? null : delegateDetails.expDate,
      description: delegateDetails.desc,
      created_date: null,
      modified_date: null,
      is_deleted: false,
    };

    this.delegateService
      .AddDelegateDetails(delegatePostData)
      .subscribe((rsp: any) => {
        if (rsp.status == 200) {
          Swal.fire("Success", "Delegate Added Successfully", "success");
          this.deptForm.reset();
        } else {
          this.toast.error("Something went wrong", "Error");
        }
        console.log("rsp", rsp);
      });
  }

  onEditDelegateSubmit() {
    console.log("Selected Edit Submit");
  }

  checkBeforAddDelegate() {
    //want to verify wheather any user is available as per the email in the user table and also its owned by the Accoutnt owner.
  }

  isFieldValid(field: string) {
    if (this.addformSubmitted) {
      return (
        (this.showerrorMsg = true),
        (this.deptForm.get(field).errors && this.deptForm.get(field).touched) ||
          (this.deptForm.get(field).untouched && this.addformSubmitted)
      );
    } else if (this.editformSubmitted) {
      return (
        (this.showerrorMsg = true),
        this.deptForm.get(field).errors && this.editformSubmitted
      );
    } else {
      return (this.showerrorMsg = false), false;
    }
  }

  onTypeChange() {
    if (this.deptForm.get("type").value == "is_temporary") {
      this.showExpiryField = true;
    } else {
      this.showExpiryField = false;
    }
  }

  onLoginTypeChange() {
    if (this.deptForm.get("logintype").value == "Phone") {
      this.showPhoneFied = true;
    } else {
      this.showPhoneFied = false;
    }
  }
  async onUserTypeChange() {
    if (this.deptForm.get("user_type").value == "External") {
      this.showInternal = false;
    } else {
      this.showInternal = true;
      if (this.orgData.length > 0) {
        console.log(this.orgData[0], "ORG CHECK");
        this.deptForm.patchValue({
          org: this.orgData[0].id,
        });
        await this.onOrgChange({ itemData: { id: this.orgData[0].id } });
      }
    }
  }

  clossAddDelegate() {
    this.allEmployeeGrid = true;
    this.showAddDelegate = false;
    this.singleEmployeeAdd = false;
    this.singleEmployeeEdit = false;
  }
}
