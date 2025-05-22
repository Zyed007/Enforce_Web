import { AdministrativeService } from "../../services/administrative.service";
import { MatTab } from "@angular/material";
import { isEqual } from "lodash";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { EmployeeService } from "../../services/employee.service";
import { settingsService } from "../../services/settings.service";
import { ProjectService } from "../../services/project.service";
import { ToastrService } from "ngx-toastr";
import { TabComponent } from "@syncfusion/ej2-angular-navigations";
import {
  GridComponent,
  ToolbarItems,
  GroupService,
} from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
import moment = require("moment");
import { ActivatedRoute, Router } from "@angular/router";
// import { FormatMoneyPipe } from "../../format-money.pipe";
import {
  NgbModal,
  NgbModalConfig,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { LeaveService } from "../../services/leave.service";
import { UserService } from "../../services/user.service";
import { PayrollService } from "../../services/payroll.service";
import * as _ from "lodash";
import { PaymentVoucherService } from "../../services/payment-voucher.service";
import { ModuleSetupService } from "../../services/moduleSetup.service";
import { checkNumber } from "@amcharts/amcharts4/core";
declare var $: any;
interface PayrollConfig {
  ab_dedc_by: string;
  ab_fixamt: number;
  cm_dedc_by: string;
  cm_fixamt: number;
  created_by: string;
  created_date: string;
  currency: string;
  days_count: number;
  id: string;
  is_auto_dedc_cm: boolean;
  is_auto_dedc_lh: boolean;
  is_auto_dedec_ab: boolean;
  is_deleted: boolean;
  is_due_last_day: boolean;
  is_last_day_calc: boolean;
  lh_dedc_by: string;
  lh_fixamt: number;
  lh_tolr_min: number;
  modified_by: string;
  modified_date: string;
  no_doc_req: boolean;
  num_day_ab: number;
  org_id: string;
  payment_cycle: string;
  per_day_sal_by: string;
  set_due_day: number;
  set_end_date: number;
  start_month: number;
  start_year: number;
}

@Component({
  selector: "app-payroll",
  templateUrl: "./payroll.component.html",
  styleUrls: ["./payroll.component.scss"],
  providers: [GroupService],
})
export class PayrollComponent implements OnInit {
  constructor(
    private empService: EmployeeService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private leaveService: LeaveService,
    private admService: AdministrativeService,
    private toast: ToastrService,
    private modalService: NgbModal,
    public config: NgbModalConfig,
    private spinner: NgxSpinnerService,
    private settingsService: settingsService,
    private projectService: ProjectService,
    private payrollService: PayrollService,
    public Router: Router,
    public paymentVoucherService: PaymentVoucherService,
    public ModuleSetupService: ModuleSetupService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    config.backdrop = "static";
    this.showDetails = new Array(this.statuses.length).fill(false);
  }

  @ViewChild("tabObj", { static: false }) public tabObj: TabComponent;
  @ViewChild("customEmployeeGrid", { static: false })
  @ViewChild("employeeGrid", { static: false })
  employeeGrid: GridComponent;
  public customEmployeeGrid: GridComponent;
  @ViewChild("payrollGrid", { static: false })
  public payrollGrid: GridComponent;
  public previousPayrollGrid: GridComponent;
  public paymentVoucherGrid: GridComponent;
  @ViewChild("empSalGrid", { static: false }) public empSalGrid: GridComponent;
  @ViewChild("bankAccModal", { static: false }) bankAccModal: any;
  @ViewChild("paymentVoucherModal", { static: false }) paymentVoucherModal: any;
  @ViewChild("empPayrollModal", { static: false }) empPayrollModal: any;
  @ViewChild("submitPaytableModel", { static: false }) submitPaytableModel: any;
  @ViewChild("payrollApprovalModal", { static: false })
  payrollApprovalModal: any;
  @ViewChild("addadjustmentModel", { static: false }) addadjustmentModel: any;
  @ViewChild("payrollTimelineModal", { static: false })
  payrollTimelineModal: any;
  @ViewChild("apprMarkPaidModel", { static: false }) apprMarkPaidModel: any;
  @ViewChild("revertActionModal", { static: false }) revertActionModal: any;

  childModalRef: NgbModalRef;
  parentModalRef: NgbModalRef;
  //for drop down configuration
  commonFields: Object = { text: "value", value: "id" };
  adjCommonFields: Object = { text: "text", value: "id" };
  activeEmpCommonFields: Object = { text: "text", value: "id" };
  org_id = localStorage.getItem("org_id").toString();
  public employeeGridToolItems: ToolbarItems[];
  showDetails: boolean[] = [];
  //payroll settings variable:
  setYearData: number[] = Array.from(
    { length: 5 },
    (_, index) => new Date().getFullYear() + index
  );
  setMonthData = [
    { value: "January", id: 1 },
    { value: "February", id: 2 },
    { value: "March", id: 3 },
    { value: "April", id: 4 },
    { value: "May", id: 5 },
    { value: "June", id: 6 },
    { value: "July", id: 7 },
    { value: "August", id: 8 },
    { value: "September", id: 9 },
    { value: "October", id: 10 },
    { value: "November", id: 11 },
    { value: "December", id: 12 },
  ];
  statuses = [
    {
      id: "ed71a073-431a-4904-809b-b56b9b92c6ec",
      payroll_id: "994af2a7-340b-48f2-84f6-f17195e3d321",
      active_employees: 0,
      status: "Revert",
      net_additions: 0,
      net_deductions: 0,
      net_payable: 0,
      hold_employees: 0,
      hold_amount: 0,
      previous_status: "",
      remark: "Simply",
      created_date: "2024-07-05T08:42:57",
      created_by: "a7195be8-b585-49ca-8b4e-f5bc875e9753",
    },
    {
      id: "e4815b30-97d9-4d7e-9bac-6c9ba14f1ec5",
      payroll_id: "994af2a7-340b-48f2-84f6-f17195e3d321",
      active_employees: 10,
      status: "Approved",
      net_additions: 163941,
      net_deductions: -43304,
      net_payable: 46207,
      hold_employees: 2,
      hold_amount: 74430,
      previous_status: "",
      remark: "string",
      created_date: "2024-07-04T12:32:54",
      created_by: "Sazid Khan",
    },
    // Add other status objects here
  ];


  public ApprMarkPaidForm: FormGroup;
  public PaymentMethodForm: FormGroup;
  public paymentForm: FormGroup;
  public bankAccountForm: FormGroup;
  public AddAdjustmentForm: FormGroup;
  // Payroll cycle
  hoursCalc: number[] = Array.from({ length: 12 }, (_, index) => index + 1);
  minutesCalc: number[] = Array.from({ length: 60 }, (_, index) => index + 1);
  overtimeHours = 0;
  overtimeMinutes = 0;
  handleOverTimeCheck = false;
  singlePaymentMethod = true;
  addNewPaymentMethod = false;
  showAddPaymentButton = true;
  showUpdatePaymentButton = false;
  updatePaymentMethod = false;
  addProvisionalBankAcc = false;
  showMarkPaidModal = false;
  releasedEmpVoucher = false;
  showPaymentVoucherModel = false;
  isModalOpen = false;
  isAdjModalOpen = false;
  submitPaymentVouchers = false;
  showPreviousPayrolls = false;
  viewOnlyMode = false;
  editVoucherMode = false;
  showBankAccModal = false;
  showApprovalSection = false;

  //UI Variables
  mainTab = true;
  payrollHeader = "Payroll";
  activeTab = "Pending";
  activeTabIndex = 0;

  startDate = "Not Selected";
  endDate = "Not Selected";
  dueDate = "Not Selected";
  payroll_name = "";

  perDayMessage = "Not selected";
  //Adjustment
  termCount = 2;
  showAdjEmployeeData = false;
  adjType = [
    { id: "Addition", text: "Addition" },
    { id: "Deduction", text: "Deduction" },
    { id: "Recurring Deduction", text: "Recurring Deduction" },
  ];
  selectedEmp = "";
  adjItem = [
    { id: "Absence", text: "Absence" },
    { id: "Advance", text: "Advance" },
    { id: "Arrear Adjustment", text: "Arrear Adjustment" },
    { id: "Leave Salary", text: "Leave Salary" },
    { id: "Loan", text: "Loan" },
    { id: "Fine", text: "Fine" },
  ];
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

  showRecurring = false;
  adjDocUrl = "";
  isadjDocUp = false;
  termDetails = [];
  totalAmount = 0.0;
  totalAmountString = "AED 0.00";

  public jobNo = "000";
  public prefixString = "";
  showPrefixText = false;
  public prefix_for = "";

  employeesArr = [
    { id: 1, name: "John Doe", netPay: 5000 },
    { id: 2, name: "Jane Smith", netPay: 4500 },
    { id: 3, name: "Emily Johnson", netPay: 5500 },
    { id: 4, name: "Michael Brown", netPay: 4700 },
    { id: 1, name: "John Doe", netPay: 5000 },
    { id: 2, name: "Jane Smith", netPay: 4500 },
    { id: 3, name: "Emily Johnson", netPay: 5500 },
    { id: 4, name: "Michael Brown", netPay: 4700 },
    { id: 1, name: "John Doe", netPay: 5000 },
    { id: 2, name: "Jane Smith", netPay: 4500 },
    { id: 3, name: "Emily Johnson", netPay: 5500 },
    { id: 4, name: "Michael Brown", netPay: 4700 },
    // Add more employees as needed
  ];
  Tabs = [
    { text: "Pending" },
    { text: "On Hold" },
    { text: "Approved" },
    { text: "Pending Payment Voucher" },
    { text: "Rejected Payment Voucher" },
    { text: "Approved Payment Voucher" },
    { text: "Deleted Payment Voucher" },
    // { text: "Added to Paytable" },
    { text: "Paid" },
  ];
  paymentStatusArr = [
    {
      id: "Pending",
      value: "Pending",
    },
    {
      id: "Completed",
      value: "Completed",
    },
    {
      id: "Rejected",
      value: "Rejected",
    },
  ];
  paymentModeArr = [
    {
      id: "Bank Transfer",
      value: "Bank Transfer",
    },
    {
      id: "Cash",
      value: "Cash",
    },
    // {
    //   id: 'Cash Deposit',
    //   value: 'Cash Deposit'
    // },
    {
      id: "Cheque",
      value: "Cheque",
    },
    // {
    //   id: 'MasterCard',
    //   value: 'MasterCard'
    // },
    // {
    //   id: 'Visa',
    //   value: 'Visa'
    // }
  ];
  cardArr = [
    {
      id: "ADCB",
      value: "ADCB",
    },
    {
      id: "ENBD",
      value: "ENBD",
    },
    {
      id: "DIB",
      value: "DIB",
    },
  ];
  senderArr = [];
  paidByArr = [
    {
      id: "Syed Mehroz",
      value: "Syed Mehroz",
    },
    {
      id: "Melizza Sanchez",
      value: "Melizza Sanchez",
    },
  ];
  recepientArr = [];
  beneficiaryType = [
    {
      id: "Individual Account",
      value: "Individual Account",
    },
    {
      id: "Employee Accounts",
      value: "Employee Accounts",
    },
    {
      id: "Provisional Account",
      value: "Provisional Account",
    },
  ];
  pendingPayrollCount = 0;
  onHoldPaymentCount = 0;
  pendingVoucherCount = 0;
  approvedVoucherCount = 0;
  onHoldListing = [];
  pendingPayroll = [];
  approvedPayroll = [];
  rejectedPayroll = [];
  addedToPaytable = [];
  paymentMethods = [];
  releasedEmp = [];
  payrollTimelineData = [];
  activeEmpList = [];
  PaymentVouchers = [];
  filteredPaymentVouchers = [];
  selectedPaymentVouchers = [];
  companyBankAccDetails = [];
  individualBankAccDetails = [];
  employeeBankAccDetails = [];
  empSelectionArr = [];
  customEmpSalData = [];
  filteredEmpSalData = [];
  salaryHistory = [];
  previousPayrollListing = [];
  payrollListing = [
    // {
    //   startDate: "Mar 23, 2024",
    //   endDate: "Apr 22, 2024",
    //   dueDate: "May 05, 2024",
    //   employee_count: 10,
    //   status: "Approved",
    //   netAddition: "163,941.00",
    //   netDeduction: "-43,304.00",
    //   netpayable: "120,637.00",
    //   paymentStatus: "Approved",
    //   remarks: "",
    //   pendingNetpay: "120,637.00",
    //   paymentMethods: 0,
    //   paymentsCompleted: 0,
    //   id: "8ceinpbvg",
    //   calcDays: "",
    // },
  ];

  filteredPayroll = [];
  onHoldPayments = [];
  onHoldCount = 0;
  maxPayableAmount = 0;
  pendingPayment = 0;
  onHoldAmount = "";
  paymentVoucherAmount = "";
  selectedemployeeData = {};
  selectedPaymentVoucher = {};
  editPaymentVoucher = false;
  markPaidPaymentVoucher = false;
  paidPaymentVoucher = false;
  pendingPaymentVoucher = false;
  paidPaytableView = false;
  //radiobuttongroup

  status = "Unkwon";
  statuscolor = "#5e5e5e";
  isLoading = true;
  currentMonth;
  currentYear;
  calcDays;
  onPaytableEdit = false;
  onPayTableHold = false;
  onPaytableApproved = false;
  selectedPayrollId = "";
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
    previous_status: "",
    submitted_by: "",
    is_approved_1: false,
    is_approved_2: false,
    approver1_roleId: "",
    approver2_roleId: "",
    approver1_emp_id: "",
    approver2_emp_id: "",
    approver1_name: "",
    approver2_name: "",
  };
  EmpSalData;
  TeamMemberSalData;
  SinEmpData = {
    index: "",
    emp_id: "",
    full_name: "",
    role_name: "",
    basic_salary: "0.00",
    travel_allow: "0.00",
    accommod_allow: "0.00",
    other_allow: 0,
    tax_deduc: "0.00",
    insurance_deduc: "0.00",
    gross_pay: "0.00",
    net_deduc: "0.00",
    net_pay: "0.00",
    currency: "AED:",
  };
  PayrollModuleID = "";
  activeMonth;
  activeYear;
  createPayrollSectionName = "";
  payrollSubmitButton = false;
  payrollSubmitFullAccess = false;
  payrollApprover1RoleId = "";
  payrollApprover1RoleName = "";
  payrollApprover2RoleId = "";
  payrollApprover2RoleName = "";
  isPayrollDualApprover = false;
  isMainTabLoading = false;
  payrollSettings: Partial<PayrollConfig> = {};
  ngOnInit() {
    const parsedUserInfo = JSON.parse(localStorage.getItem("user_info"));
    this.isAccountOwner = parsedUserInfo.is_superadmin;
    this.checkUserRights();
    this.currentMonth = this.setMonthData[moment().month()].value;
    this.currentYear = moment().year();
    this.employeeGridToolItems = ["Search"];
    this.GetLastAddedProjectPrefixByOrgID();
    this.GetPayrollSettingByOrgId();
    this.handleBackFromProfile();

    // this.getEmpSal();
    // this.initializeComponentAsync();
    // this.getPaymentVoucherByOrgId();
    // this.GetCompanyBankAccountDetails();
    // this.GetindividualBankAccDetailsDetails();
    // this.GetEmployeeBankDetailsByorgId();
  }
  async handleBackFromProfile() {
    let emp_id = "";
    let payroll_id = "";
    this.route.queryParams.subscribe(async (params) => {
      emp_id = params["key"];
      payroll_id = params["id"];
      console.log(params, "Params", emp_id, payroll_id);

      if (
        emp_id !== null &&
        emp_id !== undefined &&
        emp_id.trim() !== "" &&
        payroll_id !== null &&
        payroll_id !== undefined &&
        payroll_id.trim() !== ""
      ) {
        await this.openPayRollTable();

        if (this.EmpSalData.length > 0) {
          let employeeData = this.EmpSalData.find(
            (emp) => emp.emp_id == emp_id
          );

          if (employeeData) {
            await this.viewSingleEmployee(employeeData);
            const newUrl = this.router.url.split("?")[0];
            window.history.replaceState({}, "", newUrl);
            console.log(employeeData, this.EmpSalData, "employeeData");
          } else {
            console.log("Employee not found");
          }
        }
        console.log("BACK FROM PROFILE");
      } else {
        console.log("NOT BACK FROM PROFILE: emp_id or payroll_id is invalid");
      }
    });
  }

  async GetPayrollSettingByOrgId() {
    try {
      this.spinner.show();
      this.isMainTabLoading = true;
      const response: any = await this.payrollService
        .GetPayrollSettingByOrgId({ id: this.org_id })
        .toPromise();

      if (response && response.length > 0) {
        this.payrollSettings = response[0];
        const payrollListingResponse = await this.GetPayrollByOrgId();

        if (this.payrollListing.length > 0) {
          console.log("PAYROLL LISTING FOUND!");
          await this.handleInitialLoad();
        } else {
          console.log("ZERO PAYROLL LISTING & INITIALIZE PAYROLL!");
          const generateTableResponse: any = await this.payrollService
            .generatePayTableByOrgID({ id: this.org_id })
            .toPromise();

          if (generateTableResponse) {
            await this.handleInitialLoad();
          }
        }
      } else {
        Swal.fire({
          title: "Initialize the Payroll Settings!",
          text: "After the initialization, you will have the ability to create the Payroll table for this organization!",
          type: "info",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.value) {
            this.spinner.show();
            this.Router.navigate(["settings-new/payroll/payroll-settings"], {
              queryParams: { showInitializeSwal: false },
            });
          }
          console.log(result, "CHECK RESULT");
        });
        // Handle case where no payroll settings are found
      }
    } catch (error) {
      console.error(
        "Error fetching payroll settings or generating payroll table:",
        error
      );
      Swal.fire({
        title: "An error occurred!",
        text: "Please try again later or contact support.",
        type: "error",
        allowOutsideClick: false,
      });
    } finally {
      this.spinner.hide();
    }
  }

  async handleInitialLoad() {
    await this.initializeComponentAsync();
    await this.getPaymentVoucherByOrgId();
    this.getEmpSal();
    this.GetCompanyBankAccountDetails();
    this.GetindividualBankAccDetailsDetails();
    this.GetEmployeeBankDetailsByorgId();
  }
  async initializeComponentAsync() {
    await this.GetPayrollByOrgId();
    await this.loadDashboardDetails();
  }

  accessToPage = false;
  commonModuleName;
  user_info;
  isAccountOwner = false;

  async GetPayrollByOrgId() {
    try {
      this.payrollListing = [];
      const data: any = await this.payrollService
        .GetPayrollByOrgId({ id: this.org_id })
        .toPromise();

      if (data) {
        data.map((item) => {
          item.hold_amount = this.formatMoney(item.hold_amount);
          item.net_payable = this.formatMoney(item.net_payable);
          item.net_deductons = this.formatMoney(item.net_deductons);
          item.net_additions = this.formatMoney(item.net_additions);
        });
      }

      this.payrollListing = data;
      if (this.payrollListing.length > 0) {
        this.updatePayrollListing();
        this.getPayrollOnHoldDetails();
      }
    } catch (error) {
      console.error("Error in GetPayrollByOrgId:", error);
      // Optionally, handle the error state or show an error message
    }
  }
  checkUserRights() {
    this.user_info = JSON.parse(localStorage.getItem("user_info"));

    console.log(this.isAccountOwner, "CHECK ACC OWNER");
    if (this.isAccountOwner) {
      this.accessToPage = true;
      this.payrollSubmitButton = true;
      this.payrollSubmitFullAccess = true;
    } else {
      this.userService
        .GetAccessRightsbyRole({ id: this.user_info.role_id })
        .subscribe((data: any) => {
          if (data) {
            console.log(data, "CHECKING DATA");
            data.map((item) => {
              item.module_name = item.module_name.replace(/\s+/g, "");
              return item;
            });
            this.commonModuleName = _.groupBy(data, "module_name");
            console.log(this.commonModuleName);
            if (this.commonModuleName.Payroll) {
              this.PayrollModuleID = this.commonModuleName.Payroll[0].id;
              this.commonModuleName.Payroll.map((elm) => {
                if (elm.section_name === "Create and Modify Payroll Payments") {
                  if (elm.is_allow === true) {
                    this.payrollSubmitButton = true;
                    this.createPayrollSectionName = elm.section_name;
                  }
                }
                if (elm.section_name === "View PayRoll") {
                  if (elm.is_allow === true) {
                    this.accessToPage = true;
                  }
                }
              });
              this.checkPayrollApprover(this.user_info.role_id);
            }
          }
        });
    }
  }
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
          console.log(elm);
          if (elm.is_full_access) {
            this.payrollSubmitFullAccess = true;
          } else {
            this.payrollSubmitFullAccess = false;
            if (elm.approver1_roleId !== null) {
              this.payrollApprover1RoleId = elm.approver1_roleId;
              this.payrollApprover1RoleName = elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.isPayrollDualApprover = true;
                this.payrollApprover2RoleId = elm.approver2_roleId;
                this.payrollApprover2RoleName = elm.approver2_role_name;
              }
            }
          }
        }
      });
    });
  }

  employee_count;
  netAddition;
  netDeduction;
  netPayable;

  //dashboarding loading the details
  async loadDashboardDetails() {
    try {
      this.isMainTabLoading = true;
      this.EmpSalData = [];
      this.resetSelectedPayroll();
      this.isPayrollActive=true;
      // Fetching active payroll month details
      const rsp: any = await this.payrollService
        .getActivePayrollMonthDetailsByOrgId({ id: this.org_id })
        .toPromise();
      console.log(rsp, "CHECKING RSP");
      if (rsp && rsp.length > 0) {
        this.selectedPayroll = rsp[0];
        // if (this.selectedPayroll.net_payable != "") {
        //   this.selectedPayroll.net_payable = this.formatMoney(
        //     this.selectedPayroll.net_payable
        //   );
        // }
        // if (this.selectedPayroll.net_deductons != "") {
        //   this.selectedPayroll.net_deductons = this.formatMoney(
        //     this.selectedPayroll.net_deductons
        //   );
        // }
        // if (this.selectedPayroll.net_additions != "") {
        //   this.selectedPayroll.net_additions = this.formatMoney(
        //     this.selectedPayroll.net_additions
        //   );
        // }
        const formatIfNotEmpty = (value) =>
          value !== "" ? this.formatMoney(value) : value;

        this.selectedPayroll.net_payable = formatIfNotEmpty(
          this.selectedPayroll.net_payable
        );
        this.selectedPayroll.net_deductons = formatIfNotEmpty(
          this.selectedPayroll.net_deductons
        );
        this.selectedPayroll.net_additions = formatIfNotEmpty(
          this.selectedPayroll.net_additions
        );

        console.log(this.selectedPayroll, "selectedPayroll");
        this.selectedPayrollId = rsp[0].id;

        // Running payroll autodeduction
        const rep = await this.payrollService
          .runPayrollAutodeduction({
            id: rsp[0].org_id,
          })
          .toPromise();
        if (rep) {
          // Generating payroll table by organization ID
          const rpn = await this.payrollService
            .generatePayTableByOrgID({ id: this.org_id })
            .toPromise();

          if (rpn) {
            // Fetching active payroll month details again
            const prn = await this.payrollService
              .getActivePayrollMonthDetailsByOrgId({
                id: this.org_id,
              })
              .toPromise();

            if (prn) {
              // Setting various dashboard data based on fetched payroll details
              this.startDate = moment(prn[0].start_date).format("ll");
              this.endDate = moment(prn[0].end_date).format("ll");
              this.dueDate = moment(prn[0].pay_due_date).format("ll");
              this.employee_count = prn[0].active_employees;
              this.status = prn[0].status;
              this.setStatusColor(this.status);
              this.calcDays = prn[0].calc_day;
              this.netAddition = this.formatMoney(prn[0].net_additions);
              this.netDeduction = this.formatMoney(prn[0].net_deductons);
              this.netPayable = this.formatMoney(prn[0].net_payable);
              this.payroll_name = prn[0].name;
              // Assigning and formatting employee salary data
              this.EmpSalData = rpn;
              this.formatEmpSalData();
              this.EmpSalData.forEach((item) => {
                item.onHold = false;
                item.reason = "";
              });
            }
          }
        }
      } else {
        console.log("ELSE CALLED", this.payrollListing);
        if (this.payrollListing.length > 0) {
          const currentPayroll = this.payrollListing.find(
            (item) => item.status !== "Paid"
          );
          if (currentPayroll) {
            this.selectedPayroll = currentPayroll;
            this.startDate = moment(currentPayroll.start_date).format("ll");
            this.endDate = moment(currentPayroll.end_date).format("ll");
            this.dueDate = moment(currentPayroll.pay_due_date).format("ll");
            this.employee_count = this.selectedPayroll.active_employees;
            this.status = this.selectedPayroll.status;
            this.setStatusColor(this.status);
            // this.calcDays = this.selectedPayroll.;
            this.netAddition = this.selectedPayroll.net_additions;
            this.netDeduction = this.selectedPayroll.net_deductons;
            this.netPayable = this.selectedPayroll.net_payable;
            this.selectedPayrollId = currentPayroll.id;
            this.payroll_name = currentPayroll.name;
            const result: any = await this.payrollService
              .getPayrollDetailsByPayrollId({
                ID: currentPayroll.id,
              })
              .toPromise();
            if (result) {
              this.EmpSalData = result;
              this.formatEmpSalData();
            }
          } else {
          }
        }
      }
    } catch (error) {
      // Handle any errors here
      console.error("Error in loadDashboardDetails:", error);
    } finally {
      this.isMainTabLoading = false;
    }
  }

  showPayTable = false;
  formatEmpSalData() {
    if (this.EmpSalData.length > 0) {
      this.EmpSalData.map((item) => {
        item.basic_salary = this.formatMoney(parseFloat(item.basic_salary));
        item.fix_gross = this.formatMoney(parseFloat(item.fix_gross));
        item.fix_deduc = this.formatMoney(parseFloat(item.fix_deduc));
        item.fix_netpay = this.formatMoney(parseFloat(item.fix_netpay));
        item.variablepay = this.formatMoney(parseFloat(item.variablepay));
        item.adjustmentpay = this.formatMoney(parseFloat(item.adjustmentpay));
        item.workexpenss = this.formatMoney(parseFloat(item.workexpenss));
        item.loanPayments = this.formatMoney(parseFloat(item.loanPayments));
        item.netearning = this.formatMoney(parseFloat(item.netearning));
        item.netdeduction = this.formatMoney(parseFloat(item.netdeduction));
        item.netpayable = this.formatMoney(parseFloat(item.netpayable));
        item.travel_allow = this.formatMoney(parseFloat(item.travel_allow));
        item.accommod_allow = this.formatMoney(parseFloat(item.accommod_allow));
        item.other_allow = this.formatMoney(parseFloat(item.other_allow));
        item.tax_deduc = this.formatMoney(parseFloat(item.tax_deduc));
        item.insurance_deduc = this.formatMoney(
          parseFloat(item.insurance_deduc)
        );
        item.gross_pay = this.formatMoney(parseFloat(item.gross_pay));
        item.net_deduc = this.formatMoney(parseFloat(item.net_deduc));
        item.net_pay = this.formatMoney(parseFloat(item.net_pay));
        item.a_one = this.formatMoney(parseFloat(item.a_one));
        item.a_two = this.formatMoney(parseFloat(item.a_two));
        item.a_three = this.formatMoney(parseFloat(item.a_three));
        item.d_one = this.formatMoney(parseFloat(item.d_one));
        item.d_two = this.formatMoney(parseFloat(item.d_two));
        item.d_three = this.formatMoney(parseFloat(item.d_three));
      });
    }
  }
  async showComponant(component) {
    this.modalService.dismissAll();
    if (component == "maintab") {
      this.mainTab = true;
      this.payrollHeader = "Payroll";
      this.showPayTable = false;
      this.showSalaryDetails = false;
      this.showPreviousPayrolls = false;
      this.onPaytableEdit = false;
      this.onPayTableHold = false;
      await this.initializeComponentAsync();
    }
    if (component == "paytable") {
      this.mainTab = false;
      this.payrollHeader = "Payroll Table";
      this.showPayTable = true;
      this.showSalaryDetails = false;
      this.showPreviousPayrolls = false;
    }
    if (component == "salaryDetails") {
      this.showSalaryDetails = true;
      this.mainTab = false;
      this.payrollHeader = "Employee Salary Details";
      this.showPayTable = false;
      this.showPreviousPayrolls = false;
    }
    if (component == "previousPayrolls") {
      this.showSalaryDetails = false;
      this.mainTab = false;
      this.payrollHeader = "Payroll History";
      this.showPayTable = false;
      this.showPreviousPayrolls = true;
    }
  }

  async goBack() {
    try {
      this.spinner.show();
      this.releasedEmpVoucher = false;
      console.log(this.showPreviousPayrolls, this.paidPaytableView, "********");
      this.activeTabIndex = this.Tabs.findIndex(
        (tab) => tab.text === this.activeTab
      );
      if (this.showPayTable && !this.paidPaytableView) {
        await this.showComponant("maintab");
        this.onPaytableEdit = false;
        this.onPayTableHold = false;
      } else if (this.showSalaryDetails) {
        await this.showComponant("maintab");
      } else if (this.showPreviousPayrolls && !this.paidPaytableView) {
        await this.showComponant("maintab");
      } else if (this.paidPaytableView) {
        await this.showComponant("previousPayrolls");
        this.paidPaytableView = false;
      } else {
        window.history.go(-1);
      }
    } catch (error) {
      console.error("Error in goBack:", error);
    } finally {
      this.spinner.hide();
    }
  }
  // Handle Overtime Fun
  handleOvertime(e) {
    if (e.target.checked) {
      this.handleOverTimeCheck = true;
    } else {
      this.handleOverTimeCheck = false;
    }
  }

  async openPayRollTable() {
    try {
      this.spinner.show();
      await this.showComponant("paytable");
      await this.loadDashboardDetails();
    } catch (error) {
      console.error("Error in openPayRollTable:", error);
    } finally {
      this.spinner.hide();
    }
  }
  isPayrollActive=true;
  async onPaymentTableEdit(id, edit) {
    this.EmpSalData = [];
    this.spinner.show();

    const openPaytable = () => {
      this.mainTab = false;
      this.payrollHeader = "Payroll Table";
      this.showPayTable = true;
      this.showSalaryDetails = false;
      this.showApprovalSection = false;
    };
    console.log(this.EmpSalData, edit, id, "PrevEmpSalData");
    try {
      const result: any = await this.payrollService
        .getPayrollDetailsByPayrollId({
          ID: id,
        })
        .toPromise();

      if (result && result.length > 0) {
        if (!edit) {
          this.EmpSalData = result.filter((x) => x.on_hold);
          openPaytable();
          this.onPayTableHold = true;
          this.onPaytableEdit = false;
        } else {
          this.EmpSalData = result;
          openPaytable();
          this.onPaytableEdit = true;
          this.onPayTableHold = false;
        }

        this.resetSelectedPayroll();
        let payroll = this.payrollListing.find((x) => x.id == id);
        if (payroll.status !== "Active") {
          this.isPayrollActive=false;
          await this.GetPayrollTimelineById(id);
          let submitted_by = this.payrollTimelineData.find(
            (x) => x.status == "Submit"
          ).created_by;
          console.log(submitted_by, "Test**");
          payroll["submitted_by"] = submitted_by;
          if (payroll.approver1_roleId) {
            this.empService
              .getRoleNameByroleID({ id: payroll.approver1_roleId })
              .subscribe((role1name) => {
                if (role1name) {
                  payroll["approver1_roleName"] = role1name[0].role_name;
                }
              });
            if (
              payroll.approver1_roleId == this.user_info.role_id &&
              payroll.status == "Pending" &&
              !payroll.is_approved_1
            ) {
              console.log(payroll, "payroll");
              this.showApprovalSection = true;
            }
          }
          if (payroll.approver2_roleId) {
            this.empService
              .getRoleNameByroleID({ id: payroll.approver2_roleId })
              .subscribe((role1name) => {
                if (role1name) {
                  payroll["approver2_roleName"] = role1name[0].role_name;
                }
              });
            if (
              payroll.approver2_roleId == this.user_info.role_id &&
              payroll.status == "Pending" &&
              !payroll.is_approved_2
            ) {
              this.showApprovalSection = true;
            }
          }

          if (payroll.is_approved_1 == true) {
            let postData = {
              id: payroll.approver1_emp_id,
            };
            let appr1Data: any = await this.empService
              .getEmployeeByID(postData)
              .toPromise();
            console.log(appr1Data, "appr1Data");
            let emp_name = "";
            if (appr1Data && appr1Data.full_name != "") {
              emp_name = appr1Data.full_name;
              payroll["approver1_name"] = emp_name;
            }
          }
          console.log(
            this.payrollApprover2RoleName,
            this.payrollApprover1RoleName,
            "payrollApprover2RoleName"
          );
        }
        this.selectedPayroll = payroll;
        console.log(this.selectedPayroll, "Test** selectedPayroll**");

        this.formatEmpSalData();
      }
    } catch (error) {
      this.toast.error("Something went wrong while fetching payroll details");
      console.log(error, "****");
    } finally {
      setTimeout(() => {
        this.selectedPayrollId = id;
        this.spinner.hide();
        if (this.showPayTable && this.employeeGrid) {
          this.employeeGrid.refresh();
        }
        console.log(this.EmpSalData, "CHECKING EMP SAL DATA");
      }, 1000);
    }
  }

  async onPaymentTableApproved(id) {
    this.EmpSalData = [];
    this.spinner.show();
    console.log(this.EmpSalData, "EmpSalData");
    this.isPayrollActive=false;
    try {
      const result: any = await this.payrollService
        .getPayrollDetailsByPayrollId({
          ID: id,
        })
        .toPromise();

      if (result && result.length > 0) {
        this.EmpSalData = result;
        this.resetSelectedPayroll();
        this.selectedPayroll = this.payrollListing.find((x) => x.id == id);
        this.formatEmpSalData();
      }
    } catch (error) {
      console.log(error);
      this.toast.error("Something went wrong while fetching payroll details");
    } finally {
      setTimeout(() => {
        this.onPaytableApproved = true;
        this.selectedPayrollId = id;
        this.showComponant("paytable");
        this.spinner.hide();
      }, 1000);
    }
  }

  showSalaryDetails = false;

  openSalaryDetails() {
    this.showComponant("salaryDetails");
  }

  // employeeSearchKeyUp(): void {
  //   document
  //     .getElementById(this.employeeGrid.element.id + "_searchbar")
  //     .addEventListener("keyup", () => {
  //       this.employeeGrid.search((event.target as HTMLInputElement).value);
  //     });
  // }

  // payrollSearchKeyUp(): void {
  //   document
  //     .getElementById(this.payrollGrid.element.id + "_searchbar")
  //     .addEventListener("keyup", () => {
  //       this.payrollGrid.search((event.target as HTMLInputElement).value);
  //     });
  // }

  empvariableList = [];
  empadjaddList = [];
  empadjdeducList = [];
  empexpenssList = [];
  empadjautodeducList = [];
  autototal = "0.00";
  autoCout = 0;

  async viewSingleEmployee(data) {
    console.log(data, "SINEMPDATA");
    this.empvariableList = [];
    this.empadjaddList = [];
    this.empadjdeducList = [];
    this.empadjautodeducList = [];
    this.empexpenssList = [];
    this.autototal = "0.00";
    this.autoCout = 0;
    this.openSalaryAccord = false;

    $("#view_Commission_modal").modal("show");

    this.SinEmpData = data;
    this.payrollService
      .GetPayrollVariablePayByEmpId({ id: data.emp_id })
      .subscribe((rspvar: any) => {
        if (rspvar) {
          rspvar.map((elm) => {
            elm.date_incurred = moment(elm.date_incurred).format("ll");
            if (elm.status == "Active") {
              this.empvariableList.push(elm);
            }
          });
        }
      });

    this.payrollService
      .GetPayrollAdjustmentByEmpId({ id: data.emp_id })
      .subscribe((rspadj: any) => {
        if (rspadj) {
          rspadj.map((elm) => {
            if (elm.payroll_id == data.payroll_id) {
              elm.date_incurred = moment(elm.date_incurred).format("ll");
              if (elm.type == "Addition") {
                if (elm.status == "Active") this.empadjaddList.push(elm);
              } else {
                if (elm.status == "Active" && elm.created_by != "System") {
                  this.empadjdeducList.push(elm);
                }

                if (elm.status == "Active" && elm.created_by == "System") {
                  this.empadjautodeducList.push(elm);
                  this.autoCout = this.autoCout + 1;
                  let total =
                    parseFloat(this.autototal) + parseFloat(elm.amount);
                  this.autototal = total.toFixed(2);
                }
              }
            }
          });
        }
      });

    this.payrollService
      .GetPayrollWorkExpensesyByEmpId({ id: data.emp_id })
      .subscribe((rspexp: any) => {
        if (rspexp) {
          this.empexpenssList = rspexp;
        }
      });
    await this.getSalaryHistoryByEmpId(data.emp_id);

    console.log(this.salaryHistory, "SALARY HISTORY");
  }

  closeEmpSalDiv() {
    $("#view_Commission_modal").modal("hide");
  }

  openAccord = false;
  openSalaryAccord = false;

  openAccordPress() {
    this.openAccord = !this.openAccord;
  }
  openSalaryAccordPress() {
    this.openSalaryAccord = !this.openSalaryAccord;
  }

  //Utility Functions:
  getLastDateOfMonth(year: number, month: number): Date {
    const nextMonth = new Date(year, month, 1);
    nextMonth.setHours(-1);
    return nextMonth;
  }

  setStatusColor(status) {
    if (status == "Unkwon") {
      this.statuscolor = "#5e5e5e";
    } else if (status == "Pending") {
      this.statuscolor = "#5e5e5e";
    } else if (status == "Open") {
      this.statuscolor = "#26a802";
    }
  }

  getEmpSal() {
    this.empService.getSalaryDetailsByOrgId().subscribe((res) => {
      if (res) {
        this.TeamMemberSalData = res;
        this.TeamMemberSalData.map((emp: any) => {
          emp.basic_salary = this.formatMoney(parseInt(emp.basic_salary));
          emp.accommod_allow = this.formatMoney(parseInt(emp.accommod_allow));
          emp.travel_allow = this.formatMoney(parseInt(emp.travel_allow));
          emp.tax_deduc = this.formatMoney(parseInt(emp.tax_deduc));
          emp.insurance_deduc = this.formatMoney(parseInt(emp.insurance_deduc));
          emp.gross_pay = this.formatMoney(parseInt(emp.gross_pay));
          emp.net_deduc = this.formatMoney(parseInt(emp.net_deduc));
          emp.net_pay = this.formatMoney(parseInt(emp.net_pay));
          emp.a_one = this.formatMoney(parseInt(emp.net_pay));
          emp.a_two = this.formatMoney(parseInt(emp.net_pay));
          emp.a_three = this.formatMoney(parseInt(emp.net_pay));
          emp.d_one = this.formatMoney(parseInt(emp.net_pay));
          emp.d_two = this.formatMoney(parseInt(emp.net_pay));
          emp.d_three = this.formatMoney(parseInt(emp.net_pay));
        });
      }
    });
  }

  submitTable() {
    console.log("for submitting the pay table");
    this.modalService.open(this.submitPaytableModel);
  }

  handlesubmitPayroll() {
    Swal.fire({
      title: "Are you sure you want to submit this Payroll?",
      html: `
      <div style="font-size: 16px; margin-bottom: 10px;">Please add remarks:</div>
      `,
      input: "text",
      inputPlaceholder: "Remarks...",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage("Please enter valid remarks");
        }
        return reason;
      },
    }).then((result) => {
      if (result.value) {
        const remark = result.value;
        // Process the reason (e.g., send it to backend)
        this.submitPayroll(remark);
        console.log("Remark on Submit:", remark);
        // Optionally, you can trigger your rejection logic here
      }
    });
  }
  async submitPayroll(remark) {
    try {
      this.spinner.show();
      console.log(this.selectedPayroll, "******");
      let postData = {
        id: this.selectedPayrollId,
        active_employees: this.selectedPayroll.active_employees,
        status: "",
        net_additions: this.selectedPayroll.net_additions,
        net_deductons: this.selectedPayroll.net_deductons,
        net_payable: parseFloat(
          this.selectedPayroll.net_payable.replace(/,/g, "")
        ),
        hold_employees: this.selectedPayroll.hold_employees
          ? this.selectedPayroll.hold_employees
          : 0,
        hold_amount: this.selectedPayroll.hold_amount
          ? this.selectedPayroll.hold_amount
          : 0,
        approver1_roleId: null,
        approver2_roleId: null,
        approver1_emp_id: null,
        approver2_emp_id: null,
        is_approved_1: false,
        is_approved_2: false,
        submit_remark: remark,
        modified_by: this.user_info.full_name,
        modified_date: "string",
        submitted_by: this.user_info.full_name,
        previous_status: "",
      };

      if (this.payrollSubmitFullAccess) {
        postData.status = "Approved";
      } else {
        postData.status = "Submit";
        postData["approver1_roleId"] = this.payrollApprover1RoleId;
        if (this.isPayrollDualApprover) {
          postData["approver2_roleId"] = this.payrollApprover2RoleId;
        }
      }
      console.log(postData, "PostData");
      const payrollResponse = await this.payrollService
        .SubmitPayrollById(postData)
        .toPromise();
      console.log("Payroll Submitted");

      if (this.onHoldPayments.length > 0) {
        let holdPostData = [];
        for (const element of this.onHoldPayments) {
          holdPostData.push({
            id: element.id,
            on_hold: true,
            status: "On Hold",
            hold_remark: element.hold_remark,
            hold_history: true,
          });
        }
        const holdResponse = await this.payrollService
          .UpdatePayrollDetailsHoldById({ onHoldEmp: holdPostData })
          .toPromise();
        // console.log(`Hold payment updated for ID: ${element.id}`);
      }
      await this.initializeComponentAsync();
      this.showComponant("maintab");

      this.toast.success("Payroll submitted successfully.");
    } catch (error) {
      console.error(
        "Error submitting payroll or updating hold payments",
        error
      );
      this.toast.error("Something went wrong!");
    } finally {
      this.spinner.hide();
      this.GetPayrollByOrgId();
      console.log(this.onHoldPayments, "******");
    }
  }

  handleApprovePayroll() {
    Swal.fire({
      title: "Are you sure you want to submit this?",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value) {
        console.log(result, "result");
        this.approvePayroll();
      }
    });
  }
  async handleSwal(status) {
    let swalMsg = "";
    if (status == "Dual") {
      swalMsg = "Notification is sent to Level 2 Approver!";
    } else {
      swalMsg = "Payroll has been " + status + " successfully";
    }
    Swal.fire({
      title: swalMsg,
      showCancelButton: false,
      confirmButtonText: "OK",
      allowOutsideClick: false,
      type: "success",
    }).then(async (result) => {
      if (result.value) {
        // this.spinner.show();
        await this.showComponant("maintab");
        this.activeTabIndex = 0;
        this.activeTab = "Pending";
        // this.spinner.hide();
      }
    });
  }

  async approvePayroll() {
    let id = this.selectedPayrollId;

    if (id !== "") {
      let data = this.payrollListing.find((item) => item.id == id);
      console.log(data, "data_check");
      let postData = {
        id: data.id,
        approver_date1: data.approver_date1 ? data.approver_date1 : null,
        approver_date2: data.approver_date2 ? data.approver_date2 : null,
        is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
        is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
        approver1_emp_id: data.approver1_emp_id ? data.approver1_emp_id : null,
        approver2_emp_id: data.approver2_emp_id ? data.approver2_emp_id : null,
        modified_by: this.user_info.full_name,
        status: data.status,
        previous_status: data.status,
        is_deleted: false,
        active_employees: data.active_employees,
        net_additions: data.net_additions,
        net_deductons: data.net_deductons,
        net_payable: parseFloat(data.net_payable.replace(/,/g, "")),
        hold_employees: data.hold_employees ? data.hold_employees : 0,
        hold_amount: data.hold_amount ? data.hold_amount : 0,
        approver1_roleId: data.approver1_roleId,
        approver2_roleId: data.approver2_roleId,
      };

      try {
        if (
          data.approver2_roleId == this.user_info.role_id &&
          data.is_approved_2 == false &&
          data.is_approved_1 == true
        ) {
          postData.approver_date2 = moment().format("L");
          postData.is_approved_2 = true;
          postData.approver2_emp_id = this.user_info.id;
          postData.status = "Approved";

          const rsp: any = await this.payrollService
            .SubmitPayrollById(postData)
            .toPromise();
          if (rsp.result.status == "200") {
            // this.toast.success("Payroll has been approved successfully!");
            this.spinner.show();
            await this.handleSwal("Approved");
            this.spinner.hide();
            // this.getList();
            // this.markNotificationReaded(data.id);
          } else {
            this.toast.error("Something went Wrong to Update the Payroll!");
          }
        } else if (
          data.approver1_roleId == this.user_info.role_id &&
          data.is_approved_1 == false &&
          data.approver2_roleId !== null
        ) {
          postData.approver_date1 = moment().format("L");
          postData.is_approved_1 = true;
          postData.approver1_emp_id = this.user_info.id;
          postData.status = "Pending";
          // this.markNotificationReaded(data.id);

          const rsp: any = await this.payrollService
            .SubmitPayrollById(postData)
            .toPromise();
          if (rsp.result.status == "200") {
            this.spinner.show();
            await this.handleSwal("Dual");
            this.spinner.hide();
            // this.toast.success(
            //   rsp.desc + "Notification is sent to Level 2 Approver!"
            // );
            // this.getList();
          } else {
            this.toast.error("Something went Wrong to Update the Payroll!");
          }
        } else if (
          data.approver1_roleId == this.user_info.role_id &&
          data.is_approved_1 == false &&
          data.approver2_roleId == null
        ) {
          postData.approver_date1 = moment().format("L");
          postData.is_approved_1 = true;
          postData.approver1_emp_id = this.user_info.id;
          postData.status = "Approved";
          // this.markNotificationReaded(data.id);

          const rsp: any = await this.payrollService
            .SubmitPayrollById(postData)
            .toPromise();
          if (rsp.result.status == "200") {
            // this.toast.success("Payroll has been approved successfully!");
            this.spinner.show();
            await this.handleSwal("Approved");
            this.spinner.hide();
            // this.getList();
          } else {
            this.toast.error("Something went Wrong to Update the Payroll!");
          }
        } else if (this.payrollSubmitFullAccess) {
          postData.status = "Approved";
          postData.is_approved_2 = true;
          postData.approver_date2 = moment().format("L");
          postData.approver2_emp_id = this.user_info.id;

          const rsp: any = await this.payrollService
            .SubmitPayrollById(postData)
            .toPromise();
          if (rsp.result.status == "200") {
            // this.toast.success("Payroll has been approved successfully!");
            this.spinner.show();
            await this.handleSwal("Approved");
            this.spinner.hide();
            // this.getList();
            // this.markNotificationReaded(data.id);
          } else {
            this.toast.error("Something went Wrong to Update the Payroll!");
          }
        } else {
          console.log(
            "You don't have the permission for approving the payroll!"
          );
          this.toast.warning(
            "You don't have the permission for approving the payroll!"
          );
        }
      } catch (error) {
        console.error(
          "An error occurred during the payroll approval process:",
          error
        );
        this.toast.error(
          "An unexpected error occurred. Please try again later."
        );
      } finally {
        this.GetPayrollByOrgId();
      }
    }
  }
  async rejPayRollTable(reason) {
    let id = this.selectedPayrollId;
    if (id !== "") {
      let data = this.payrollListing.find((item) => item.id == id);
      console.log(data, "data_check");
      if (
        this.payrollSubmitFullAccess ||
        data.approver1_roleId == this.user_info.role_id ||
        data.approver2_roleId == this.user_info.role_id
      ) {
        let postData = {
          id: data.id,
          approver_date1: data.approver_date1 ? data.approver_date1 : null,
          approver_date2: data.approver_date2 ? data.approver_date2 : null,
          is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
          is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
          approver1_emp_id: data.approver1_emp_id
            ? data.approver1_emp_id
            : null,
          approver2_emp_id: data.approver2_emp_id
            ? data.approver2_emp_id
            : null,
          modified_by: this.user_info.full_name,
          status: "Reject",
          previous_status: data.status,
          is_deleted: false,
          submit_remark: reason,
        };
        const rsp: any = await this.payrollService
          .SubmitPayrollById(postData)
          .toPromise();
        if (rsp.result.status == "200") {
          // this.toast.success("Payroll has been rejected successfully!");
          this.spinner.show();
          await this.handleSwal("Rejected");
          this.spinner.hide();
        } else {
          this.toast.error("Something went Wrong to Update the Payroll!");
        }
      } else {
        this.toast.error(
          "You don't have the permission for rejecting the payroll!"
        );
      }
    } else {
      this.toast.error("Invalid Payroll Id!");
    }
  }

  handleRevertPayroll(id) {
    let existingVouchers = false;
    let condition = (obj) => obj.payroll_id === id && !obj.is_deleted;
    console.log(this.PaymentVouchers, "TEST");
    if (id != "") {
      existingVouchers = this.PaymentVouchers.some(condition);
      if (existingVouchers) {
        this.toast.error(
          "Unable to revert payroll due to existing payment vouchers. Please delete the vouchers before proceeding"
        );
        return;
      } else {
        Swal.fire({
          title: "Are you sure you want to revert this?",
          html: `
          <div style="font-size: 16px; margin-bottom: 10px;">Please add remarks:</div>
          `,
          input: "text",
          inputPlaceholder: "Remarks...",
          showCancelButton: true,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          allowOutsideClick: false,
          preConfirm: (reason) => {
            if (!reason) {
              Swal.showValidationMessage("Please enter valid remarks");
            }
            return reason;
          },
        }).then((result) => {
          if (result.value) {
            const reason = result.value;
            // Process the reason (e.g., send it to backend)
            this.revertApprovedPayroll(reason, id);
            console.log("Reason for rejection:", reason, id);
            // Optionally, you can trigger your rejection logic here
          }
        });
      }
    }
  }

  async revertApprovedPayroll(reason, id) {
    try {
      console.log(reason, id, typeof id, "CHECK***");
      if (id !== "") {
        this.spinner.show(); // Show spinner at the beginning
        this.selectedPayrollId = id;
        let data = this.payrollListing.find((item) => item.id == id);
        console.log(data, this.payrollListing, "data_check");
        if (
          this.payrollSubmitFullAccess ||
          data.approver1_roleId == this.user_info.role_id ||
          data.approver2_roleId == this.user_info.role_id
        ) {
          let postData = {
            id: id,
            approver_date1: data.approver_date1 ? data.approver_date1 : null,
            approver_date2: data.approver_date2 ? data.approver_date2 : null,
            is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
            is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
            approver1_emp_id: data.approver1_emp_id
              ? data.approver1_emp_id
              : null,
            approver2_emp_id: data.approver2_emp_id
              ? data.approver2_emp_id
              : null,
            modified_by: this.user_info.full_name,
            status: "Revert",
            previous_status: data.status,
            is_deleted: false,
            submit_remark: reason,
            hold_amount: 0,
            hold_employees: 0,
          };
          const rsp: any = await this.payrollService
            .SubmitPayrollById(postData)
            .toPromise();
          if (rsp.result.status == "200") {
            // await this.loadDashboardDetails();
            // this.GetPayrollByOrgId();
            this.spinner.show();
            await this.handleSwal("Reverted");
            this.spinner.hide();
          } else {
            this.toast.error(
              "Something went wrong while updating the payroll!"
            );
          }
        } else {
          this.toast.error("You don't have permission to revert the payroll!");
        }
      } else {
        this.toast.error("Invalid Payroll Id!");
      }
    } catch (error) {
      console.error("Error in reverting payroll:", error);
      this.toast.error("An error occurred while reverting the payroll!");
    } finally {
      this.spinner.hide(); // Hide spinner at the end
    }
  }

  generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
  }

  updatePayrollListing() {
    if (this.payrollListing.length > 0) {
      this.filteredPayroll = this.payrollListing.filter(
        (item) => item.status === this.activeTab
      );
      this.pendingPayrollCount = this.filteredPayroll.filter(
        (item) => item.status === "Pending"
      ).length;
      console.log(this.filteredPayroll, this.activeTab, "this.filteredPayroll");
      if (this.payrollGrid) {
        this.payrollGrid.refresh();
      }
    }
  }
  updatePaymentVoucherListing(status) {
    console.log(status, this.PaymentVouchers, "CHECK");
    this.filteredPaymentVouchers = [];
    if (this.PaymentVouchers.length > 0) {
      this.filteredPaymentVouchers = this.PaymentVouchers.filter(
        (item) => item.status === status
      );
      console.log(this.filteredPaymentVouchers, "this.filteredPaymentVouchers");
    }
    if (this.payrollGrid) {
      this.payrollGrid.refresh();
    }
  }
  onTabChange(e) {
    console.log(e, "CHECK");
    this.filteredPayroll = [];

    if (e.selectedIndex != null) {
      this.activeTab = this.Tabs[e.selectedIndex].text;
      this.activeTabIndex = e.selectedIndex;
      if (
        e.selectedIndex == 3 ||
        e.selectedIndex == 4 ||
        e.selectedIndex == 5 ||
        e.selectedIndex == 6 ||
        e.selectedIndex == 7
      ) {
        let status = "";
        if (e.selectedIndex == 3) {
          status = "Pending";
        } else if (e.selectedIndex == 4) {
          status = "Reject";
        } else if (e.selectedIndex == 5) {
          status = "Approved";
        } else if (e.selectedIndex == 6) {
          status = "Delete";
        } else {
          status = "Paid";
        }
        this.updatePaymentVoucherListing(status);
      } else {
        this.updatePayrollListing();
      }

      console.log(this.activeTab, "CHECK");
    }
  }

  closeModel() {
    this.modalService.dismissAll();
  }

  closeAdjModel() {
    console.log("CALLED");
    this.isAdjModalOpen = false;
  }
  closeMarkPaidModel() {
    this.showMarkPaidModal = false;
    $("#apprMarkPaidModel").modal("hide");
    this.singlePaymentMethod = true;
    this.addNewPaymentMethod = false;
    this.singlePaymentMethod = false;
    this.showAddPaymentButton = false;
    this.showUpdatePaymentButton = false;
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

  onPayrollApproval() {
    let id = this.selectedPayrollId;
    console.log(id, this.payrollListing, "!!!!");
    if (id != "" && id != null) {
      let apprData = this.payrollListing.find((i) => i.id == id);
      if (apprData.id !== null && apprData != undefined) {
        this.spinner.show();
        console.log(apprData);
        apprData.paymentStatus = "Approved";

        let currentDate = new Date();
        const shortDate = currentDate.toLocaleDateString("en-US");
        console.log(shortDate);
        // this.updatePayrollListing();
        setTimeout(() => {
          this.spinner.hide();
          this.closeModel();
          this.toast.success("Payroll Has Been Approved!");
        }, 1000);
      }
    }
  }

  openPayrollRejectModal() {
    Swal.fire({
      title: "Are you sure you want to reject this?",
      html: `
      <div style="font-size: 16px; margin-bottom: 10px;">Please add remarks:</div>
      `,
      input: "text",
      inputPlaceholder: "Remarks...",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage("Please enter valid remarks");
        }
        return reason;
      },
    }).then((result) => {
      if (result.value) {
        const reason = result.value;
        // Process the reason (e.g., send it to backend)
        this.rejPayRollTable(reason);
        console.log("Reason for rejection:", reason);
        // Optionally, you can trigger your rejection logic here
      }
    });
  }

  onHoldPaymentModal(emp_id) {
    console.log(emp_id, "emp_id!!!");
    Swal.fire({
      title: "Are you sure you want to hold this payment?",
      html: `
      <div style="font-size: 16px; margin-bottom: 10px;">Please add remarks:</div>
      `,
      input: "text",
      inputPlaceholder: "Remarks...",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage("Please enter valid remarks");
        }
        return reason;
      },
    }).then((result) => {
      if (result.value) {
        const reason = result.value;
        // Process the reason (e.g., send it to backend)
        this.onholdPayment(reason, emp_id);
        console.log("Reason for hold:", reason);
        // Optionally, you can trigger your rejection logic here
      }
    });
  }

  onReleasePaymentModal(emp_id) {
    console.log(emp_id, "emp_id!!!");
    console.log("Release", this.selectedPayroll, this.selectedPayrollId);
    if (this.selectedPayroll.status == "Paid") {
      Swal.fire({
        title:
          "The Payroll is already paid. Please create a separate voucher for this employee.",
        showCancelButton: true,
        confirmButtonText: "Create Payment Voucher",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.value) {
          // this.onReleasePayment(emp_id);
          this.handleSingleVoucherForHold(emp_id);
          // Optionally, you can trigger your rejection logic here
        }
      });
    } else if (this.selectedPayroll.status == "Approved") {
      Swal.fire({
        title: "Are you sure you want to release this payment?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.value) {
          this.handleReleaseOnHold(emp_id);
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure you want to release this payment?",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.value) {
          this.onReleasePayment(emp_id);
          // Optionally, you can trigger your rejection logic here
        }
      });
    }
  }

  onReleaseMultiplePaymentModal(emp_id) {
    console.log(emp_id, "emp_id!!!");
    let empArr = this.EmpSalData.filter((emp) => emp.on_hold);
    if (empArr.length > 0) {
      console.log("Release", this.selectedPayroll, this.selectedPayrollId);
      Swal.fire({
        title: "Are you sure you want to release these payments?",
        showCancelButton: true,
        confirmButtonText: "Create Payment Voucher",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.value) {
          this.handleMultipleVoucherForHold();
          // Optionally, you can trigger your rejection logic here
        }
      });
    } else {
      this.toast.warning(
        "No employees are on hold to create a payment voucher."
      );
    }
  }
  async handleReleaseOnHold(emp_id) {
    try {
      this.spinner.show();
      let onHoldEmp = this.EmpSalData.find((i) => i.emp_id == emp_id);
      let overallNetpayable = parseFloat(
        this.selectedPayroll.net_payable.replace(/,/g, "")
      );
      let empNetPayable = parseFloat(onHoldEmp.netpayable.replace(/,/g, ""));
      let netpayable = overallNetpayable + empNetPayable;
      let payroll = this.payrollListing.find(
        (i) => i.id == this.selectedPayrollId
      );
      let onHoldAmount =
        parseFloat(this.selectedPayroll.hold_amount.replace(/,/g, "")) -
        empNetPayable;
      console.log(this.selectedPayroll, "******");
      let postData = {
        id: this.selectedPayrollId,
        active_employees: this.selectedPayroll.active_employees,
        status: payroll.status,
        net_additions: this.selectedPayroll.net_additions,
        net_deductons: this.selectedPayroll.net_deductons,
        net_payable: netpayable,
        hold_employees: this.selectedPayroll.hold_employees - 1,
        hold_amount: onHoldAmount,
        approver1_roleId: payroll.approver1_roleId,
        approver2_roleId: payroll.approver2_roleId,
        approver1_emp_id: payroll.approver1_emp_id,
        approver2_emp_id: payroll.approver2_emp_id,
        is_approved_1: payroll.is_approved_1,
        is_approved_2: payroll.is_approved_2,
        submit_remark: "",
        modified_by: this.user_info.full_name,
      };

      console.log(postData, "PostData");
      const payrollResponse = await this.payrollService
        .SubmitPayrollById(postData)
        .toPromise();
      let holdPostData = [
        {
          id: onHoldEmp.id,
          on_hold: false,
          status: "Active",
          hold_remark: "",
          hold_history: true,
        },
      ];
      const holdResponse = await this.payrollService
        .UpdatePayrollDetailsHoldById({ onHoldEmp: holdPostData })
        .toPromise();
      const result: any = await this.payrollService
        .getPayrollDetailsByPayrollId({
          ID: this.selectedPayrollId,
        })
        .toPromise();
      await this.GetPayrollByOrgId();
      this.selectedPayroll = this.payrollListing.find(
        (i) => i.id == this.selectedPayrollId
      );

      if (result && result.length > 0) {
        this.EmpSalData = result.filter((i) => i.on_hold);
        this.formatEmpSalData();
      }
      this.toast.success(
        "Payments have been released from hold and are now available in the Approved section for creating payment vouchers."
      );
    } catch (error) {
      console.error("Error releasing payment ", error);
      this.toast.error("Something went wrong!");
    } finally {
      this.spinner.hide();
      // this.GetPayrollByOrgId();
      console.log(this.onHoldPayments, "******");
    }
  }

  async handleSingleVoucherForHold(emp_id) {
    this.releasedEmp = [];
    this.paymentMethods = [];
    this.spinner.show();
    await this.GetLastAddedProjectPrefixByOrgID();
    let empDetails = this.EmpSalData.find((data) => data.emp_id == emp_id);
    this.releasedEmp.push({
      id: empDetails.id,
      on_hold: false,
      status: "Active",
      hold_remark: "",
      amount: empDetails.netpayable,
      emp_id: emp_id,
      hold_history: true,
    });
    console.log(this.releasedEmp, empDetails);

    this.showMarkPaidModal = true;
    this.releasedEmpVoucher = true;
    this.singlePaymentMethod = true;
    let data = this.selectedPayroll;
    console.log(data, "PA");
    this.paymentVoucherInitialization(data);
    this.ApprMarkPaidForm.patchValue({ multipleVouchers: false });
    this.ApprMarkPaidForm.get("multipleVouchers").disable();
    if (this.releasedEmp.length > 0 && this.releasedEmpVoucher) {
      let empList = this.releasedEmp.map((i) => i.emp_id);
      this.customEmpSalData = this.EmpSalData.filter((emp) =>
        empList.includes(emp.emp_id)
      );
    } else {
      this.customEmpSalData = [...this.EmpSalData];
    }
    console.log(empDetails, this.EmpSalData, this.customEmpSalData, "****");
    this.PaymentMethodForm.patchValue({
      mode: "Bank Transfer",
      beneficiaryType: "Employee Accounts",
      amount: empDetails.netpayable,
      empCount: 1,
      empList: [emp_id],
      status: "Active",
      voucherId: this.incrementVoucherPrefix(),
    });
    setTimeout(() => {
      this.spinner.hide();
      console.log(
        this.PaymentMethodForm.getRawValue(),
        "this.PaymentMethodForm.getRawValue()"
      );
      $("#apprMarkPaidModel").modal("show");
    }, 1000);
  }
  async handleMultipleVoucherForHold() {
    this.spinner.show();
    this.releasedEmp = [];
    this.editVoucherMode = true;
    this.singlePaymentMethod = true;
    this.paymentMethods = [];
    let empArr = this.EmpSalData.filter((emp) => emp.on_hold);
    await this.GetLastAddedProjectPrefixByOrgID();
    console.log(empArr, "empArr!!!");
    let empIdList = [];
    if (empArr.length > 0) {
      empArr.forEach((empDetails) => {
        this.releasedEmp.push({
          id: empDetails.id,
          on_hold: false,
          status: "Active",
          hold_remark: "",
          amount: empDetails.netpayable,
          emp_id: empDetails.emp_id,
          hold_history: true,
        });
        empIdList.push(empDetails.emp_id);
      });
      this.showMarkPaidModal = true;
      this.releasedEmpVoucher = true;
      let data = this.selectedPayroll;
      console.log(data, "PA");

      this.paymentVoucherInitialization(data);
      this.ApprMarkPaidForm.patchValue({ multipleVouchers: false });
      if (this.releasedEmp.length > 0 && this.releasedEmpVoucher) {
        this.customEmpSalData = this.EmpSalData.filter((emp) =>
          empIdList.includes(emp.emp_id)
        );
      } else {
        this.customEmpSalData = [...this.EmpSalData];
      }
      console.log(empArr, this.EmpSalData, this.customEmpSalData, "****");
      let empNetPayable = this.releasedEmp.reduce(
        (a, b) => a + parseFloat(b.amount.replace(/,/g, "")),
        0
      );
      this.PaymentMethodForm.patchValue({
        mode: "Bank Transfer",
        beneficiaryType: "Employee Accounts",
        amount: this.formatMoney(empNetPayable),
        empCount: empIdList.length,
        empList: empIdList,
        status: "Active",
        voucherId: this.incrementVoucherPrefix(),
      });
      setTimeout(() => {
        this.spinner.hide();
        console.log(
          this.PaymentMethodForm.getRawValue(),
          "this.PaymentMethodForm.getRawValue()"
        );
        $("#apprMarkPaidModel").modal("show");
      }, 1000);
    }
  }
  async handleEmpWithHold() {
    try {
      const holdResponse: any = await this.payrollService
        .UpdatePayrollDetailsHoldById({ onHoldEmp: this.releasedEmp })
        .toPromise();

      if (holdResponse.result.status === "200") {
        try {
          let overallNetpayable = parseFloat(
            this.selectedPayroll.net_payable.replace(/,/g, "")
          );
          let empNetPayable = this.releasedEmp.reduce(
            (a, b) => a + parseFloat(b.amount.replace(/,/g, "")),
            0
          );
          console.log(this.releasedEmp, "CHECK");
          let netpayable = overallNetpayable + empNetPayable;
          console.log(overallNetpayable, empNetPayable, "NET PAY ACL");
          let payroll = this.payrollListing.find(
            (i) => i.id == this.selectedPayrollId
          );
          let onHoldAmount =
            parseFloat(this.selectedPayroll.hold_amount.replace(/,/g, "")) -
            empNetPayable;
          console.log(this.selectedPayroll, "******");
          let postData = {
            id: this.selectedPayrollId,
            active_employees: this.selectedPayroll.active_employees,
            status: payroll.status,
            net_additions: this.selectedPayroll.net_additions,
            net_deductons: this.selectedPayroll.net_deductons,
            net_payable: netpayable,
            hold_employees: this.selectedPayroll.hold_employees
              ? this.selectedPayroll.hold_employees - this.releasedEmp.length
              : 0,
            hold_amount: onHoldAmount,
            approver1_roleId: payroll.approver1_roleId,
            approver2_roleId: payroll.approver2_roleId,
            approver1_emp_id: payroll.approver1_emp_id,
            approver2_emp_id: payroll.approver2_emp_id,
            is_approved_1: payroll.is_approved_1,
            is_approved_2: payroll.is_approved_2,
            submit_remark: "",
            modified_by: this.user_info.full_name,
          };

          console.log(postData, "PostData");
          const payrollResponse = await this.payrollService
            .SubmitPayrollById(postData)
            .toPromise();
          const result: any = await this.payrollService
            .getPayrollDetailsByPayrollId({
              ID: this.selectedPayrollId,
            })
            .toPromise();
          await this.GetPayrollByOrgId();
          this.selectedPayroll = this.payrollListing.find(
            (i) => i.id == this.selectedPayrollId
          );

          if (result && result.length > 0) {
            let holdedEmp = result.filter((emp) => emp.on_hold);
            if (holdedEmp.length > 0) {
              this.EmpSalData = result.filter((i) => i.on_hold);
              this.formatEmpSalData();
            } else {
              await this.showComponant("maintab");
            }
          }

          this.toast.success(
            "Payments have been released from hold successfully"
          );
        } catch (error) {
          console.error("Error fetching payroll details: ", error);
          this.toast.error(
            "Something went wrong while fetching payroll details"
          );
        }
      } else {
        this.toast.error("Failed to release payments from hold");
      }
    } catch (error) {
      console.error("Error updating payroll details: ", error);
      this.toast.error("Something went wrong while updating payroll details");
    }
  }

  onHoldCalc() {
    let holdAmount = this.onHoldPayments.reduce(
      (a, b) => a + parseFloat(b.netpayable.replace(/,/g, "")),
      0
    );
    this.onHoldAmount =
      holdAmount && holdAmount != null && holdAmount != undefined
        ? this.formatMoney(holdAmount)
        : "";
    this.selectedPayroll.hold_amount = this.onHoldAmount;
    this.onHoldCount = this.onHoldPayments.length;
    this.selectedPayroll.hold_employees = this.onHoldPayments.length;
    console.log(this.onHoldAmount, this.onHoldCount, "this.onHoldAmount!");
  }

  onReleasePayment(emp_id) {
    let onHoldEmp = this.EmpSalData.find((i) => i.emp_id == emp_id);
    // console.log(onHoldEmp, "onHoldEmp")
    if (onHoldEmp != null && onHoldEmp != undefined) {
      this.onHoldPayments = this.onHoldPayments.filter(
        (item) => item.emp_id !== emp_id
      );
      onHoldEmp.on_hold = false;
      onHoldEmp.hold_remark = "";
      // this.onHoldCount--;
      let overallNetpayable = parseFloat(
        this.selectedPayroll.net_payable.replace(/,/g, "")
      );
      let empNetPayable = parseFloat(onHoldEmp.netpayable.replace(/,/g, ""));
      let netpayable = overallNetpayable + empNetPayable;
      // console.log(this.netPayable, onHoldEmp.netpayable, netpayable)
      this.selectedPayroll.net_payable = this.formatMoney(netpayable);
      this.employeeGrid.refresh();
      this.onHoldCalc();
    }
    // console.log(this.EmpSalData, "CHECK!!!")
    console.log(this.onHoldPayments, "this.onHoldPayments Release***");
  }

  onholdPayment(reason, emp_id) {
    let onHoldEmp = this.EmpSalData.find((i) => i.emp_id == emp_id);
    // console.log(onHoldEmp, "onHoldEmp")
    if (onHoldEmp != null && onHoldEmp != undefined) {
      onHoldEmp.on_hold = true;
      onHoldEmp.hold_remark = reason;

      this.onHoldPayments.push(onHoldEmp);
      console.log(onHoldEmp, this.onHoldPayments);
      // this.onHoldCount++
      console.log(this.selectedPayroll, "CHECK SELECTED PAYROLL");
      let overallNetpayable = parseFloat(
        this.selectedPayroll.net_payable.replace(/,/g, "")
      );
      let empNetPayable = parseFloat(onHoldEmp.netpayable.replace(/,/g, ""));
      let netpayable = overallNetpayable - empNetPayable;
      console.log(this.netPayable, onHoldEmp.netpayable, netpayable);
      // this.netPayable = this.formatMoney(netpayable);
      this.selectedPayroll.net_payable = this.formatMoney(netpayable);
      this.employeeGrid.refresh();
      this.onHoldCalc();
    }
    // console.log(this.EmpSalData, "CHECK!!!")
    console.log(this.onHoldPayments, "this.onHoldPayments Hold***");
  }
  async updatedEmpSalDataWithHold() {
    this.EmpSalData = [];
    try {
      const data: any = await this.payrollService
        .getPayrollDetailsByPayrollId({ ID: this.selectedPayrollId })
        .toPromise();
      if (data && data.length > 0) {
        this.EmpSalData = data.filter((i) => !i.on_hold);
        this.formatEmpSalData();
      }
      console.log(this.EmpSalData, "payrollDetailsByPayrollId");
    } catch (error) {
      console.error("Error fetching payroll details:", error);
    }
  }

  async showMarkApprPaidVoucherDetails(data) {
    this.spinner.show();
    const payrollDetails: any = await this.payrollService
      .getPayrollDetailsByPayrollId({ ID: data.id })
      .toPromise();
    if (payrollDetails && payrollDetails.length > 0) {
      this.EmpSalData = payrollDetails;
      this.formatEmpSalData();
    }
    console.log(data, "MarkApprPaid");
    this.viewOnlyMode = true;
    this.editVoucherMode = false;
    this.singlePaymentMethod = false;
    this.selectedPayrollId = data.id;
    this.resetSelectedPayroll();
    this.selectedPayroll = data;
    this.hidePaymentMethod();
    this.showMarkPaidModal = true;
    this.paymentVoucherInitialization(data);
    this.GetSelectedPaymentVouchers(data.id);
    console.log(this.PaymentVouchers, "CHECKING PAYMENT VOUCHERS");
    console.log(this.paymentMethods, "paymentMethods");

    setTimeout(() => {
      this.spinner.hide();
      $("#apprMarkPaidModel").modal("show");
    }, 1000);
  }
  async MarkApprPaid(data) {
    this.spinner.show();
    this.viewOnlyMode = false;
    this.editVoucherMode = true;
    this.singlePaymentMethod = true;
    this.selectedPayrollId = data.id;
    this.resetSelectedPayroll();
    this.selectedPayroll = data;
    await this.updatedEmpSalDataWithHold();
    await this.GetLastAddedProjectPrefixByOrgID();
    this.hidePaymentMethod();
    this.showMarkPaidModal = true;
    this.paymentVoucherInitialization(data);
    let selectedVouchers = this.GetSelectedPaymentVouchers(data.id);
    console.log(this.EmpSalData, "this.EmpSalData");
    console.log(this.releasedEmpVoucher, this.releasedEmp, "releasedEmp");
    this.customEmpSalData = this.EmpSalData.filter((i) => !i.on_hold);
    console.log(this.customEmpSalData, "CUSTOM");
    let empList = this.EmpSalData.filter((i) => !i.on_hold).map(
      (i) => i.emp_id
    );
    let amount = this.customEmpSalData.reduce(
      (a, b) => a + parseFloat(b.netpayable.replace(/,/g, "")),
      0
    );
    console.log(empList, "EMPLIST");
    if (!selectedVouchers) {
      this.PaymentMethodForm.patchValue({
        mode: "Bank Transfer",
        beneficiaryType: "Employee Accounts",
        amount: this.formatMoney(amount),
        empCount: empList.length,
        empList: empList,
        status: "Active",
        voucherId: this.incrementVoucherPrefix(),
      });
    }

    setTimeout(() => {
      this.spinner.hide();
      console.log(this.prefixString, "prefixString MarkApprPaid");
      $("#apprMarkPaidModel").modal("show");
    }, 1000);
  }

  paymentVoucherInitialization(data) {
    let currentDate = new Date();
    const shortDate = currentDate.toLocaleDateString("en-US");
    this.initializeApprMarkPaidForm();
    this.ApprMarkPaidForm.patchValue({
      id: data.id,
      name: data.name,
      employeesCount: data.active_employees,
      amount: data.net_payable,
      pendingAmount: data.pendingNetpay,
      multipleVouchers: false,
      dateincurred: shortDate,
    });

    this.initializePaymentMethodForm();
  }

  GetSelectedPaymentVouchers(id) {
    this.paymentMethods = [];
    if (this.PaymentVouchers.length > 0) {
      let selectedVouchers = this.PaymentVouchers.filter(
        (i) => i.payroll_id == id && !i.is_deleted
      );
      console.log(selectedVouchers, "selectedVouchers");

      if (selectedVouchers.length > 0) {
        this.ApprMarkPaidForm.patchValue({
          multipleVouchers: true,
        });
        this.ApprMarkPaidForm.get("multipleVouchers").disable();

        selectedVouchers.forEach((data) => {
          this.paymentMethods.push({
            voucherId: data.voucher_id,
            amount: data.amount,
            mode: data.method,
            dateincurred: data.dateincurred,
            remark: data.remarks,
            chequeDate: data.cheque_date,
            chequeType: data.cheque_type,
            confirmCollection: data.confirm_collection,
            additionalDoc: data.additional_doc,
            recieptDoc: data.reciept_doc,
            cheque: data.cheque_doc,
            beneficiaryType: data.benf_type,
            empid: data.emp_id,
            debitAcc: data.acc_debit_id,
            beneficiaryAcc: data.wps_provider_id,
            paidByEmpId: data.paidby_emp_id,
            accRefId: data.acc_ref_id,
            singlePaymentMethod: true,
            id: data.id,
            status: data.status,
            receiptNumber: data.reciept_number,
            receiptDocument: data.reciept_document,
            date: data.reciept_date,
            empCount: data.emp_count,
          });
        });
        this.checkActivePaymentVoucher();
        this.singlePaymentMethod = false;
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  initializeApprMarkPaidForm() {
    this.ApprMarkPaidForm = new FormGroup({
      id: new FormControl("", [Validators.required]),
      name: new FormControl("", [Validators.required]),
      reffid: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      pendingAmount: new FormControl("", [Validators.required]),
      mode: new FormControl(0, [Validators.required]),
      dateincurred: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
      chequeDate: new FormControl(""),
      chequeType: new FormControl(""),
      confirmCollection: new FormControl(""),
      employeesCount: new FormControl(""),
      multipleVouchers: new FormControl(false),
    });
  }
  initializePaymentMethodForm() {
    let isDocRequired = false;
    if (this.payrollSettings && this.payrollSettings.no_doc_req) {
      isDocRequired = true;
    }
    this.PaymentMethodForm = new FormGroup({
      id: new FormControl(""),
      voucherId: new FormControl(""),
      amount: new FormControl("", [Validators.required]),
      total_amount: new FormControl(""),
      mode: new FormControl("", [Validators.required]),
      dateincurred: new FormControl(""),
      remarks: new FormControl(""),
      chequeDate: new FormControl(""),
      chequeType: new FormControl(""),
      confirmCollection: new FormControl(""),
      additionalDoc: new FormControl(""),
      recieptDoc: new FormControl(""),
      payrollId: new FormControl(""),
      cheque: new FormControl(""),
      beneficiaryType: new FormControl(""),
      empid: new FormControl(""),
      debitAcc: new FormControl(""),
      beneficiaryAcc: new FormControl(""),
      paidByEmpId: new FormControl(""),
      accRefId: new FormControl(""),
      empList: new FormControl([]),
      empCount: new FormControl("", [Validators.required]),
      status: new FormControl(""),
      transferFees: new FormControl(""),
      paidBy: new FormControl(""),
      chequeNumber: new FormControl(""),
    });
    const recieptDocControl = this.PaymentMethodForm.get("recieptDoc");
    if (isDocRequired) {
      if (recieptDocControl) {
        recieptDocControl.setValidators([Validators.required]);
        recieptDocControl.updateValueAndValidity();
      }
    } else {
      if (recieptDocControl) {
        recieptDocControl.clearValidators();
        recieptDocControl.updateValueAndValidity();
      }
    }
  }
  chequeType(value) {
    if (value === "CDC") {
      this.PaymentMethodForm.controls["chequeDate"].disable();
      this.PaymentMethodForm.patchValue({
        chequeDate: new Date(),
        chequeType: "CDC",
      });
    } else {
      this.PaymentMethodForm.controls["chequeDate"].enable();
      this.PaymentMethodForm.patchValue({
        chequeDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        chequeType: "PDC",
      });
    }
  }
  toggleEmployeeSelection(event: Event, employeeId: number) {
    const checkbox = event.target as HTMLInputElement;
    const currentEmpList = this.PaymentMethodForm.get("empList").value || [];
    const updatedEmpList = checkbox.checked
      ? [...currentEmpList, employeeId]
      : currentEmpList.filter((id) => id !== employeeId);
    const selectedEmployees = this.EmpSalData.filter((emp) =>
      updatedEmpList.includes(emp.emp_id)
    );
    console.log(selectedEmployees, "selectedEmployees!!");
    const sumNetPay = selectedEmployees.reduce(
      (total, emp) => total + parseFloat(emp.netpayable.replace(/,/g, "")),
      0
    );
    let formattedAmt = this.formatMoney(sumNetPay);
    console.log(sumNetPay, formattedAmt, "formattedAmt");
    this.PaymentMethodForm.patchValue({
      empList: updatedEmpList,
      amount: formattedAmt,
      empCount: updatedEmpList.length,
    });
    console.log(this.PaymentMethodForm.getRawValue(), "Form value");
  }
  toggleEmployeeSelectionOnModal(event: Event, employeeId: number) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.empSelectionArr.push(employeeId);
    } else {
      this.empSelectionArr = this.empSelectionArr.filter(
        (id) => id !== employeeId
      );
    }
    console.log(
      this.empSelectionArr,
      this.PaymentMethodForm.get("empList").value,
      "arr"
    );
  }
  toggleSelectAllOnModal(e: any) {
    console.log(e.target.checked, "CHECK");
    this.empSelectionArr = [];

    if (e.target.checked) {
      this.empSelectionArr = this.filteredEmpSalData.map((item) => item.emp_id);
      console.log(this.empSelectionArr, "arr Test****");
    }
  }
  openEmpPayrollModal() {
    if (!this.isModalOpen) {
      this.empSelectionArr = [];
      let empListArr = this.PaymentMethodForm.get("empList").value || [];
      this.empSelectionArr = [...empListArr];
    }
    if (this.showPreviousPayrolls) {
      this.customEmpSalData = this.filteredEmpSalData;
    }

    this.spinner.show();
    setTimeout(() => {
      this.isModalOpen = true;
      this.spinner.hide();
    }, 1000);
  }
  submitSelectedEmployees() {
    try {
      const selectedEmployees = this.EmpSalData.filter((emp) =>
        this.empSelectionArr.includes(emp.emp_id)
      );
      const sumNetPay = selectedEmployees.reduce(
        (total, emp) => total + parseFloat(emp.netpayable.replace(/,/g, "")),
        0
      );
      let formattedAmt = this.formatMoney(sumNetPay);
      this.PaymentMethodForm.patchValue({
        empList: this.empSelectionArr,
        amount: formattedAmt,
        empCount: selectedEmployees.length,
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.empSalGrid.refresh();
      this.closeEmpPayrollModal();
      this.toast.success("Employees selected successfully!");
      // this.isModalOpen = false;
    }
  }
  toggleSelectAll(e: any) {
    console.log(e, "CHECK");
    let empList = this.filteredEmpSalData.map((item) => item.emp_id);
    console.log(this.filteredEmpSalData, "filteredEmpSalData");
    if (e.target.checked) {
      const sumNetPay = this.filteredEmpSalData.reduce(
        (total, emp) => total + parseFloat(emp.netpayable.replace(/,/g, "")),
        0
      );
      console.log(sumNetPay, "***");
      this.PaymentMethodForm.patchValue({
        empList: empList,
        amount: this.formatMoney(sumNetPay),
        empCount: empList.length,
      });
    } else {
      this.PaymentMethodForm.patchValue({
        empList: [],
        amount: "0.00",
        empCount: 0,
      });
    }
  }
  closeEmpPayrollModal() {
    let empList = this.PaymentMethodForm.get("empList").value || [];
    console.log(this.empSelectionArr.length, empList.length);
    if (!isEqual(this.empSelectionArr, empList)) {
      Swal.fire({
        title: "Are you sure you want to close the modal?",
        text: "Remember, if you close the modal, you will loose the selected employees.",
        showCloseButton: true,
        confirmButtonColor: "#e91e63",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.value) {
          console.log(result, "RES");
          this.empSalGrid.refresh();
          this.isModalOpen = false;
        }
      });
    } else {
      this.isModalOpen = false;
    }
  }
  // isSelected(emp_id: number): boolean {
  //   const empListFormControl = this.PaymentMethodForm.get("empList");
  //   console.log("called");
  //   if (
  //     empListFormControl &&
  //     empListFormControl.value &&
  //     Array.isArray(empListFormControl.value)
  //   ) {
  //     return empListFormControl.value.includes(emp_id);
  //   } else {
  //     return false;
  //   }
  // }
  updatePayrollListingStatus(id) {
    let data = this.payrollListing.find((i) => i.id == id);
    let completedPayments = this.paymentMethods.filter(
      (i) => i.status == "Completed"
    );
    let totalPayment = this.paymentMethods.reduce(
      (a, b) => a + parseInt(b.amount),
      0
    );
    let formattedNetPay = parseFloat(data.netpayable.replace(/,/g, ""));
    let pendingNetpay = this.formatMoney(totalPayment - formattedNetPay);
    console.log(data.netpayable, "netPayable!");
    data.paymentMethods = this.paymentMethods.length;
    data.paymentsCompleted = completedPayments.length;
    data.pendingNetpay = pendingNetpay;
    this.ApprMarkPaidForm.patchValue({
      pendingAmount: pendingNetpay,
    });
    this.payrollGrid.refresh();
    // this.updatePayrollListing();
  }

  removePaymentMethod(i) {
    console.log(i, "delete thguis");
    // let methods = this.PaymentMethodForm.get('methods') as FormArray
    // if (methods.length > 0) {
    //   methods.removeAt(i)
    // }
  }

  private createPaymentMethodFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(""),
      amount: new FormControl("", [Validators.required]),
      mode: new FormControl("", [Validators.required]),
      dateincurred: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
      chequeDate: new FormControl(""),
      chequeType: new FormControl(""),
      confirmCollection: new FormControl(""),
      document: new FormControl(""),
    });
  }

  selectMode(data) {
    console.log(data, "MODE OF PAY");
  }

  showPaymentMethod() {
    if (this.EmpSalData.length > 0) {
      this.filteredEmpSalData = this.EmpSalData.filter(
        (i) => !i.payment_voucher_id
      );
      if (this.filteredEmpSalData.length > 0) {
        this.PaymentMethodForm.reset();
        let payrollId = this.ApprMarkPaidForm.get("id").value;
        this.PaymentMethodForm.patchValue({
          id: this.generateRandomId(),
          payrollId: payrollId,
          mode: "Bank Transfer",
          beneficiaryType: "Employee Accounts",
          status: "Active",
          voucherId: this.incrementVoucherPrefix(),
        });
        this.GetAllPrefixByOrgID();
        console.log(this.PaymentMethodForm.getRawValue());
        this.addNewPaymentMethod = true;
        this.showAddPaymentButton = true;
        this.showUpdatePaymentButton = false;
        this.onPaytableEdit = false;
        // this.calcMaxPayableAmount(id);
        console.log(this.filteredEmpSalData, "********");
      } else {
        this.toast.warning(
          "You have already created vouchers for all employees!"
        );
      }
    }
    console.log(this.addNewPaymentMethod, "add new CHECK!!!");
    console.log(this.singlePaymentMethod, "single CHECK!!!");
    // this.PaymentMethodForm.patchValue({
    //   amount
    // })this.maxPayableAmount
  }

  hidePaymentMethod() {
    this.addNewPaymentMethod = false;
    this.updatePaymentMethod = false;
  }
  updatePaymentDetails(data) {
    console.log(data, this.paymentMethods, "Update");
    this.PaymentMethodForm.patchValue(data);
    // this.calcMaxPayableAmount(data.id);
    this.addNewPaymentMethod = true;
    this.updatePaymentMethod = true;
    this.showUpdatePaymentButton = true;
    this.showAddPaymentButton = false;
    this.filteredEmpSalData = [];
    console.log(this.EmpSalData, "EMP SAL");
    if (this.EmpSalData.length > 0) {
      this.filteredEmpSalData = this.EmpSalData.filter(
        (i) => !i.payment_voucher_id || i.payment_voucher_id == data.id
      );
      console.log(this.filteredEmpSalData, "********");
    }
    if (data.status !== "Active") {
      this.PaymentMethodForm.disable();
      this.addNewPaymentMethod = false;
      this.updatePaymentMethod = false;
      this.viewOnlyMode = true;
    }
    if (this.showPreviousPayrolls) {
      this.initializePaymentForm();
      this.paymentForm.patchValue({
        receiptDocument: data.receiptDocument,
        receiptNumber: data.receiptNumber,
        date: data.date,
        remarks: data.remarks,
      });
      this.paymentForm.disable();
    }
  }
  viewPaymentDetails(data) {
    console.log(data, this.paymentMethods, "Update");
    this.PaymentMethodForm.patchValue(data);
    this.addNewPaymentMethod = true;
    this.updatePaymentMethod = false;
    this.editVoucherMode = false;
    this.filteredEmpSalData = [];
    this.PaymentMethodForm.disable();
    console.log(this.EmpSalData, "EMP SAL");
    if (this.EmpSalData.length > 0) {
      this.filteredEmpSalData = this.EmpSalData.filter(
        (i) => i.payment_voucher_id == data.id
      );
      console.log(this.filteredEmpSalData, "********");
    }
    if (this.showPreviousPayrolls) {
      this.initializePaymentForm();
      this.paymentForm.patchValue({
        receiptDocument: data.receiptDocument,
        receiptNumber: data.receiptNumber,
        date: data.date,
        remarks: data.remarks,
      });
      this.paymentForm.disable();
    }
  }
  updateExistingPaymentMethod() {
    let value = this.PaymentMethodForm.value;
    let index = this.paymentMethods.findIndex((item) => item.id === value.id);
    console.log(index, this.paymentMethods, "IND");
    if (index !== -1) {
      this.paymentMethods[index] = value;
      this.filteredEmpSalData.map((emp) => {
        if (value.empList.includes(emp.emp_id)) {
          emp.payment_voucher_id = value.id;
        } else {
          emp.payment_voucher_id = "";
        }
      });

      console.log(this.paymentMethods, "PAY METHODS");

      this.payrollGrid.refresh();
      this.toast.success("Payment method updated successfully!");
    }
    console.log(value, this.paymentMethods, "******");
  }
  checkUsersWithoutVoucher() {
    let usersWithoutVoucher = this.EmpSalData.filter(
      (i) => !i.payment_voucher_id
    );
    return usersWithoutVoucher;
  }
  async submitMultipleVouchers() {
    let usersWithoutVoucher = this.checkUsersWithoutVoucher();
    if (usersWithoutVoucher.length > 0) {
      this.toast.warning(
        "Please create payment vouchers for all employees before submitting"
      );
      return;
    } else {
      try {
        this.spinner.show();
        const data: any = await this.generatePaymentVoucher();
        console.log(data, "CHECK");
        if (data.status == "200") {
          await this.getPaymentVoucherByOrgId();
          this.checkActivePaymentVoucher();
          this.closeMarkPaidModel();
          this.updatedEmpSalDataWithHold();
          this.GetSelectedPaymentVouchers(this.selectedPayrollId);
          this.toast.success(
            "Payment voucher submitted for approval successfully"
          );
        } else if (data.status == "409") {
          this.toast.error(`Voucher Id ${data.code} already exists.`);
        } else {
          this.toast.error(
            "Something went wrong while submitting the payment voucher for approval"
          );
        }
      } catch (error) {
        console.error(error);
        this.toast.error(
          "An error occurred while submitting the payment voucher for approval"
        );
      } finally {
        this.spinner.hide();
      }
    }

    console.log(this.paymentMethods, "PAY METHID");
  }

  backToVoucherListing() {
    Swal.fire({
      title: "Are you sure you want to go back?",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    }).then((result) => {
      if (result && result.value) {
        this.addNewPaymentMethod = false;
        this.updatePaymentMethod = false;
      }
    });
  }
  onFileSelected(event, type) {
    console.log(type, "TYPE");
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
          switch (type) {
            case "cheque":
              this.PaymentMethodForm.patchValue({
                cheque: imData.secure_url,
              });
              break;
            case "additionalDoc":
              this.PaymentMethodForm.patchValue({
                additionalDoc: imData.secure_url,
              });
              break;
            case "reciept":
              this.PaymentMethodForm.patchValue({
                recieptDoc: imData.secure_url,
              });
              break;
            case "payment":
              this.paymentForm.patchValue({
                receiptDocument: imData.secure_url,
              });
              break;
            default:
              console.error("Unhandled type:", type);
          }

          this.spinner.hide();
        }
      });
    }
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
  docDelete(type) {
    Swal.fire({
      title: "Are you sure you want to delete this document?",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value) {
        console.log(result, "result");
        switch (type) {
          case "cheque":
            this.PaymentMethodForm.patchValue({
              cheque: "",
            });
            break;
          case "additionalDoc":
            this.PaymentMethodForm.patchValue({
              additionalDoc: "",
            });
            break;
          case "receipt":
            this.PaymentMethodForm.patchValue({
              receiptDoc: "",
            });
            break;
          case "payment":
            this.paymentForm.patchValue({
              receiptDocument: "",
            });
            break;
          default:
            console.error("Unhandled type:", type);
        }
      }
    });
  }
  async showMultipleVouchers(e) {
    console.log(e.target.checked);
    console.log(this.ApprMarkPaidForm.getRawValue(), "********");
    this.singlePaymentMethod = !this.singlePaymentMethod;
    this.addNewPaymentMethod = false;
    this.PaymentMethodForm.reset();
    this.paymentMethods = [];

    await this.GetLastAddedProjectPrefixByOrgID();
    this.PaymentMethodForm.patchValue({
      mode: "Bank Transfer",
      beneficiaryType: "Employee Accounts",
    });
    if (this.singlePaymentMethod) {
      let empCount = this.ApprMarkPaidForm.get("employeesCount").value;
      let amount = this.ApprMarkPaidForm.get("amount").value;
      console.log(empCount, amount);
      this.PaymentMethodForm.patchValue({
        empCount: empCount,
        amount: amount,
        voucherId: this.incrementVoucherPrefix(),
      });
    } else {
      if (this.EmpSalData.length > 0) {
        let empSalData = this.EmpSalData.map((emp) => {
          emp.payment_voucher_id = "";
          return emp;
        });
        this.filteredEmpSalData = empSalData;
      }
    }
    console.log(this.singlePaymentMethod, "this.singlePaymentMethod");
  }

  getActiveEmployeeList() {
    this.activeEmpList = [];
    this.payrollService
      .getActiveEmployeeListByOrgID({ id: this.org_id })
      .subscribe((rsp: any) => {
        if (rsp) {
          rsp.map((emp) => {
            this.activeEmpList.push({
              id: emp.id,
              text: emp.full_name,
              emp_code: emp.emp_code,
            });
          });
        }
      });
  }
  getUserDetailsByEmpId() {
    let empId = this.PaymentMethodForm.get("empid").value;
    this.selectedemployeeData = {};
    console.log(empId, this.employeeBankAccDetails, "SELECTED empId");
    if (empId) {
      let userData = this.employeeBankAccDetails.find((i) => i.emp_id == empId);
      console.log(this.selectedemployeeData, "this.selectedemployeeData!");
      if (
        userData.bank_account_num &&
        userData.bank_account_num != null &&
        userData.bank_account_num != ""
      ) {
        this.selectedemployeeData = userData;
        this.showEmployeeData();
      } else {
        this.toast.error(
          "Invalid bank details,Please update the banks details of the selected employee!"
        );
      }
    }
  }
  showEmployeeData() {
    const selectedEmployee: any = this.selectedemployeeData;
    let formattedJoinDate = this.formatDate(selectedEmployee.joined_date);
    let formattedEndDate = this.formatDate(selectedEmployee.contract_enddate);
    // Construct HTML dynamically
    const htmlContent = `
      <div>
        <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
          <div style="height: 80px; width: 80px; margin-bottom: 10px; border-radius: 50%; overflow: hidden;">
            <img class="images" src="${selectedEmployee.photo_url}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <h3>${selectedEmployee.name}</h3>
        </div>
        <div style="background-color: #f3f3f3; padding: 10px; border-radius: 5px;">
          <div style="display: flex; margin-top: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
              <div style="font-weight:700">Email:</div>
              <div>${selectedEmployee.pesonal_email}</div>
            </div>
            <div style="flex: 1;">
              <div style="font-weight:700">IBAN:</div>
              <div>${selectedEmployee.bank_Iban}</div>
            </div>
          </div>
          <div style="display: flex; margin-bottom: 10px;">
            <div style="flex: 1;">
              <div style="font-weight:700">Bank Account Number:</div>
              <div>${selectedEmployee.bank_account_num}</div>
            </div>
            <div style="flex: 1;">
              <div style="font-weight:700">Bank Branch:</div>
              <div>${selectedEmployee.bank_branch}</div>
            </div>
          </div>
          <div style="display: flex; margin-bottom: 10px;">
            <div style="flex: 1;">
              <div style="font-weight:700">Bank Name:</div>
              <div>${selectedEmployee.bank_name}</div>
            </div>
            <div style="flex: 1;">
              <div style="font-weight:700">Bank Swift:</div>
              <div>${selectedEmployee.bank_swift}</div>
            </div>
          </div>
          <div style="display: flex; margin-bottom: 10px;">
            <div style="flex: 1;">
              <div style="font-weight:700">Department:</div>
              <div>${selectedEmployee.dep_name}</div>
            </div>
            <div style="flex: 1;">
              <div style="font-weight:700">Designation:</div>
              <div>${selectedEmployee.designation_name}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    Swal.fire({
      html: htmlContent,
      showCloseButton: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        container: "swal2-overflow",
      },
    });
  }
  initializeBankAccountForm() {
    this.bankAccountForm = this.formBuilder.group({
      acc_holder_name: ["", Validators.required],
      acc_type: ["", Validators.required],
      acc_num: ["", Validators.required],
      bank_name: ["", Validators.required],
      branch_name: [""],
      swift_bic: [""],
      iban: ["", Validators.required],
      currency: ["", Validators.required],
      nick_name: ["", Validators.required],
      role: ["", Validators.required],
      is_default: false,
      is_wps: false,
      desc: [""],
    });
  }
  selectBeneficiaryType(e) {
    if (e.value == "Provisional Account") {
      this.initializeBankAccountForm();
      this.openBankAccModal();
      this.addProvisionalBankAcc = true;
      // this.showBankAccountModal()
    }
    console.log(e.value, "EVENT");
  }
  openBankAccModal() {
    // this.childModalRef = this.modalService.open(this.bankAccModal);
    this.showBankAccModal = true;
  }
  closeBankAccModal() {
    // console.log(this.childModalRef, "closedchildModalRef");
    // if (this.childModalRef) {
    //   this.childModalRef.close();
    //   this.addProvisionalBankAcc = false;
    // }
    this.showBankAccModal = false;
    this.addProvisionalBankAcc = false;
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }
  submitBankAccountDetails() {
    let bankDetails = this.bankAccountForm.getRawValue();
    console.log(bankDetails, "bankDetails");
  }

  showSelectedBankAccDetails(type) {
    this.spinner.show();
    try {
      this.initializeBankAccountForm();
      let acc_id = this.PaymentMethodForm.get("debitAcc").value;
      // console.log(this.PaymentMethodForm.getRawValue(),"******")
      let selectedDetails = this.companyBankAccDetails.find(
        (i) => i.id == acc_id
      );
      if (type == "sender") {
        acc_id = this.PaymentMethodForm.get("debitAcc").value;
        selectedDetails = this.companyBankAccDetails.find(
          (i) => i.id == acc_id
        );
      } else {
        acc_id = this.PaymentMethodForm.get("beneficiaryAcc").value;
        selectedDetails = this.individualBankAccDetails.find(
          (i) => i.id == acc_id
        );
      }
      if (selectedDetails) {
        this.bankAccountForm.patchValue(selectedDetails);
      }
      console.log(selectedDetails);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        this.spinner.hide();
        this.openBankAccModal();
      }, 1000);
    }
  }
  GetCompanyBankAccountDetails() {
    let postData = {
      mode: "Bank Transfer",
      org_id: this.org_id,
      is_company: true,
      mode_type: "finance",
    };
    this.companyBankAccDetails = [];
    this.paymentVoucherService
      .GetPaymentModeDetailsByMode(postData)
      .subscribe((data: any) => {
        data.map((details) => {
          this.companyBankAccDetails.push(details);
          this.senderArr.push({
            id: details.id,
            value: details.nick_name,
          });
        });
        console.log(this.companyBankAccDetails, "*********");
      });
  }

  GetindividualBankAccDetailsDetails() {
    let postData = {
      mode: "Bank Transfer",
      org_id: this.org_id,
      is_company: false,
      mode_type: "individual",
      is_wps: true,
      is_common: true,
    };
    this.companyBankAccDetails = [];
    this.paymentVoucherService
      .GetPaymentModeDetailsByMode(postData)
      .subscribe((data: any) => {
        data.map((details) => {
          this.individualBankAccDetails.push(details);
          this.recepientArr.push({
            id: details.id,
            value: details.nick_name,
          });
        });
        console.log(this.individualBankAccDetails, "*********");
      });
  }
  GetEmployeeBankDetailsByorgId() {
    let postData = { OrgId: this.org_id };
    this.employeeBankAccDetails = [];
    this.empService
      .GetEmployeeBankDetailsByorgId(postData)
      .subscribe((data: any) => {
        if (data && data.length > 0) {
          data.map((emp: any) => {
            this.employeeBankAccDetails.push(emp);
            this.activeEmpList.push({
              id: emp.emp_id,
              text: emp.name,
              emp_code: emp.emp_code,
            });
          });
        }
      });
  }
  onFiltering(event: any) {
    const query = event.text.toLowerCase();
    const filteredData = this.activeEmpList.filter((emp) => {
      const text = emp.text ? emp.text.toLowerCase() : "";
      const empCode = emp.emp_code ? emp.emp_code.toLowerCase() : "";
      return text.includes(query) || empCode.includes(query);
    });
    event.updateData(filteredData);
  }
  async markAsPaid() {
    try {
      this.spinner.show();
      this.PaymentMethodForm.markAllAsTouched();
      const firstInvalidControl = this.findFirstInvalidControl();
      if (firstInvalidControl) {
        this.handleFormValidator(firstInvalidControl);
        return;
      } else {
        let value = this.PaymentMethodForm.value;
        this.paymentMethods = [];
        this.paymentMethods.push(value);
        console.log(this.paymentMethods, "PAY METHODS WITH VOUCHER ID");
        const data: any = await this.generatePaymentVoucher();

        console.log(data, "CHECK");
        if (data.status == "200") {
          await this.getPaymentVoucherByOrgId();
          this.closeMarkPaidModel();
          if (this.releasedEmpVoucher) {
            await this.handleEmpWithHold();
          } else {
            await this.updatedEmpSalDataWithHold();
          }
          this.toast.success(
            "Payment voucher submitted for approval successfully"
          );
        } else if (data.status == "409") {
          this.toast.error(`Voucher Id ${data.code} already exists.`);
        } else {
          console.log(
            "An error occurred while processing the payment voucher."
          );
        }
      }
    } catch (error) {
      console.error("Error in markAsPaid:", error);
    } finally {
      this.spinner.hide();
    }
  }
  findFirstInvalidControl() {
    const controls = this.PaymentMethodForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        return name; // Return the name of the first invalid control
      }
    }
    return null; // Return null if all controls are valid
  }
  handleFormValidator(type) {
    if (type == "recieptDoc") {
      this.toast.error(`Please upload the required document.`);
    } else {
      this.toast.error(`Please fill out the ${type} field.`);
    }
  }

  async addPaymentMethod() {
    this.PaymentMethodForm.markAllAsTouched();
    let value = this.PaymentMethodForm.value;
    console.log(value, "CHECING VAL");
    const firstInvalidControl = this.findFirstInvalidControl();

    if (firstInvalidControl) {
      this.handleFormValidator(firstInvalidControl);
      return;
    } else {
      console.log("Form Submitted", this.PaymentMethodForm.value);
      try {
        this.EmpSalData.map((emp) => {
          if (value.empList.includes(emp.emp_id)) {
            emp.payment_voucher_id = value.id;
          }
        });
        console.log(this.EmpSalData, "CHECKING EMPSAL");
        this.addNewPaymentMethod = false;
        this.onPaytableEdit = false;
        this.paymentMethods.push(value);
      } catch (error) {
        this.toast.error("Somewthing went wrong!");
        console.error(error);
      } finally {
        this.checkActivePaymentVoucher();
        this.toast.success("Payment method added successfully!");
      }
    }

    console.log(value, "PAY VAL");
    console.log(this.addNewPaymentMethod, "this.addNewPaymentMethod !!!");
  }

  async generatePaymentVoucher() {
    try {
      let data = this.PaymentMethodForm.getRawValue();
      console.log(this.prefix_for, "prefix_for");
      console.log(data, this.paymentMethods, "CHECK");
      let paymentVouchers = [];
      console.log(this.prefixString, "prefixString");
      this.paymentMethods.forEach((data) => {
        if (data.status == "Active") {
          let postData = {
            voucher_id: data.voucherId,
            amount: parseFloat(data.amount.replace(/,/g, "")),
            method: data.mode,
            dateincurred: data.dateincurred,
            remarks: data.remarks,
            chequeDate: data.chequeDate,
            cheque_type: data.chequeType,
            confirmCollection: data.confirmCollection,
            additional_doc: data.additionalDoc,
            reciept_doc: data.recieptDoc,
            payroll_id: this.ApprMarkPaidForm.get("id").value,
            cheque_doc: data.cheque,
            benf_type: data.beneficiaryType,
            emp_id: data.empid,
            acc_debit_id: data.debitAcc,
            wps_provider_id: data.beneficiaryAcc,
            acc_ref_id: data.accRefId,
            empList: data.empList,
            emp_count: data.empCount,
            paidby_emp_id: data.paidByEmpId,
            singlePaymentMethod: this.singlePaymentMethod,
            status: data.status,
            org_id: this.org_id,
            created_by: this.user_info.full_name,
            modified_by: this.user_info.full_name,
            approver1_roleId: null,
            approver2_roleId: null,
            approver1_emp_id: null,
            approver2_emp_id: null,
            is_approved_1: false,
            is_approved_2: false,
            transfer_fees: data.transferFees,
            fee_paid_by: data.paidBy,
            chequeNumber: data.chequeNumber,
            type:'Payroll',
          };
          console.log(postData, "POSTDATA");
          if (this.payrollSubmitFullAccess) {
            postData.status = "Approved";
          } else {
            postData.status = "Pending";
            postData["approver1_roleId"] = this.payrollApprover1RoleId;
            if (this.isPayrollDualApprover) {
              postData["approver2_roleId"] = this.payrollApprover2RoleId;
            }
          }
          paymentVouchers.push(postData);
        } else if (data.status == "Reject") {
        } else {
        }
      });
      if (paymentVouchers.length > 0) {
        let postData = {
          org_id: this.org_id,
          payment_vouchers: paymentVouchers,
          prefix_for: this.prefix_for,
        };
        let response = await this.paymentVoucherService
          .AddPaymentVoucherDetails(postData)
          .toPromise();
        return response;
      }
    } catch (error) {
      throw error;
    }
  }
  checkActivePaymentVoucher() {
    if (this.paymentMethods) {
      this.submitPaymentVouchers = this.paymentMethods.some(
        (i) => i.status == "Active"
      );
      let amt = this.paymentMethods.reduce(
        (total, method) => total + parseFloat(method.amount.replace(/,/g, "")),
        0
      );
      this.paymentVoucherAmount = this.formatMoney(amt);
    } else {
      this.submitPaymentVouchers = false;
    }
  }
  async getPaymentVoucherByOrgId() {
    let postData = {
      OrgID: this.org_id,
      type: "Payroll",
    };
    this.PaymentVouchers = [];
    this.pendingVoucherCount = 0;
    this.approvedVoucherCount = 0;

    try {
      const data: any = await this.paymentVoucherService
        .GetPaymentVouchersByOrgId(postData)
        .toPromise();

      if (data && data.length > 0) {
        this.PaymentVouchers = data.map((voucher) => {
          voucher.amount = this.formatMoney(voucher.amount);
          voucher.total_amount=voucher.total_amount?this.formatMoney(voucher.total_amount):0
          if (voucher.status === "Pending") {
            this.pendingVoucherCount++;
          } else if (voucher.status === "Approved") {
            this.approvedVoucherCount++;
          }
          return voucher;
        });
      }
    } catch (error) {
      console.error("Error fetching payment vouchers", error);
    }
  }

  GetAllPrefixByOrgID() {
    let paymentPrefixId = "";
    this.projectService.GetAllPrefixByOrgID().subscribe((data: any) => {
      data.map((elm, ind) => {
        if (elm.type === "pv") {
          let result = elm;
          console.log(result, "CHECK");
          if (result && result.prefix_for === "Default") {
            let prefix_name = result.prefix_ext;
            let jobNo = "0";
            paymentPrefixId =
              prefix_name +
              "/" +
              moment().format("YY") +
              "/" +
              moment().format("MM") +
              "/" +
              jobNo;
          } else if (result && result.prefix_for === "Sequence") {
            let prefix_name = result.prefix_ext;
            let jobNo = result.prefix_name.split("/").pop();
            let updatedJobNo = parseInt(jobNo) + 1;
            paymentPrefixId = prefix_name + "/" + updatedJobNo;
            console.log(typeof updatedJobNo, "updatedJobNo");
          } else if (result.prefix_for === "Custom") {
          }
          console.log(paymentPrefixId, "paymentPrefixId");
        }
      });
    });
  }
  async viewPaymentVoucherDetails(data) {
    console.log(data, "payment voucher");
    this.spinner.show();
    this.selectedPaymentVoucher = {};
    if (data.approver1_roleId) {
      this.empService
        .getRoleNameByroleID({ id: data.approver1_roleId })
        .subscribe((role1name) => {
          if (role1name) {
            data["approver1_roleName"] = role1name[0].role_name;
          }
        });
      if (data.is_approved_1 == true) {
        let postData = {
          id: data.approver1_emp_id,
        };
        let appr1Data: any = await this.empService
          .getEmployeeByID(postData)
          .toPromise();
        console.log(appr1Data, "appr1Data");
        let emp_name = "";
        if (appr1Data && appr1Data.full_name != "") {
          emp_name = appr1Data.full_name;
          data["approver1_name"] = emp_name;
        }
      }
    }
    if (data.approver2_roleId) {
      this.empService
        .getRoleNameByroleID({ id: data.approver2_roleId })
        .subscribe((role1name) => {
          if (role1name) {
            data["approver2_roleName"] = role1name[0].role_name;
          }
        });
      if (data.is_approved_2 == true) {
        let postData = {
          id: data.approver2_emp_id,
        };
        let appr1Data: any = await this.empService
          .getEmployeeByID(postData)
          .toPromise();
        console.log(appr1Data, "appr1Data");
        let emp_name = "";
        if (appr1Data && appr1Data.full_name != "") {
          emp_name = appr1Data.full_name;
          data["approver2_name"] = emp_name;
        }
      }
    }
    this.selectedPaymentVoucher = data;
    this.editPaymentVoucher = false;
    this.markPaidPaymentVoucher = false;
    this.pendingPaymentVoucher = false;
    this.paidPaymentVoucher = false;
    this.customEmpSalData = [];
    console.log(this.selectedPaymentVoucher, "selectedPaymentVoucher");

    try {
      const result: any = await this.payrollService
        .getPayrollDetailsByPayrollId({
          ID: data.payroll_id,
        })
        .toPromise();
      if (result && result.length > 0) {
        this.customEmpSalData = result.filter(
          (i) => i.payment_voucher_id == data.id
        );
        this.formatEmpSalData();
        console.log(result, this.EmpSalData, "payrollDetailsByPayrollId");
      }
      this.initializePaymentMethodForm();
      this.PaymentMethodForm.patchValue({
        amount: data.amount,
        mode: data.method,
        dateincurred: data.created_date,
        remarks: data.remarks,
        chequeType: data.cheque_type,
        additionalDoc: data.additional_doc,
        recieptDoc: data.reciept_doc,
        cheque: data.cheque_doc,
        beneficiaryType: data.benf_type,
        empid: data.emp_id,
        debitAcc: data.acc_debit_id,
        beneficiaryAcc: data.wps_provider_id,
        paidByEmpId: data.paidby_emp_id,
        accRefId: data.acc_ref_id,
        empCount: data.emp_count,
        id: data.id,
        voucherId: data.voucher_id,
        status: data.status,
        payrollId: data.payroll_id,
        transferFees: data.transfer_fees,
        paidBy: data.fee_paid_by,
        chequeDate: data.chequeDate,
        chequeNumber: data.chequeNumber,
        total_amount:data.total_amount
      });
      if (data.status == "Reject") {
        this.editPaymentVoucher = true;
      } else if (data.status == "Approved") {
        this.markPaidPaymentVoucher = true;
        this.PaymentMethodForm.disable();
        this.initializePaymentForm();
        this.paymentForm.patchValue({ id: data.id });
      } else if (data.status == "Paid") {
        this.paidPaymentVoucher = true;
        this.initializePaymentForm();
        this.paymentForm.patchValue({
          receiptDocument: data.reciept_document,
          receiptNumber: data.reciept_number,
          date: data.reciept_date,
          remarks: data.remarks,
        });
        this.PaymentMethodForm.disable();
        this.paymentForm.disable();
      } else if (
        !data.is_approved_1 &&
        data.approver1_roleId == this.user_info.role_id
      ) {
        this.pendingPaymentVoucher = true;
        this.PaymentMethodForm.disable();
      } else if (
        !data.is_approved_2 &&
        data.approver2_roleId == this.user_info.role_id
      ) {
        this.pendingPaymentVoucher = true;
        this.PaymentMethodForm.disable();
      } else {
        this.pendingPaymentVoucher = false;
        this.PaymentMethodForm.disable();
      }

      setTimeout(() => {
        this.spinner.hide();
        this.openPaymentVoucherDetails();
        console.log(this.customEmpSalData, "customEmpSalData");
        if (this.customEmployeeGrid) {
          this.customEmployeeGrid.refresh();
        }
      }, 1000);
    } catch (error) {
      console.error("Error fetching payroll details", error);
      this.spinner.hide();
    }
  }
  initializePaymentForm() {
    this.paymentForm = this.formBuilder.group({
      receiptNumber: ["", Validators.required],
      receiptDocument: [],
      remarks: [""],
      date: ["", Validators.required],
      id: [""],
    });
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.paymentForm.patchValue({
        receiptDocument: file,
      });
    }
  }
  openPaymentVoucherDetails() {
    console.log("openPaymentVoucherDetails called!");

    this.showPaymentVoucherModel = true;

    // Ensure the modal is hidden before showing again
    $("#paymentVoucherModal").modal("hide");

    // Add a very short timeout (e.g., 50ms) to give time for hide to complete
    setTimeout(() => {
      $("#paymentVoucherModal").modal("show");
    }, 50);
  }


  closePaymentVoucherDetails() {
    this.showPaymentVoucherModel = false;
    $("#paymentVoucherModal").modal("hide");
  }

  async approvePaymentVoucher() {
    let id = this.PaymentMethodForm.get("voucherId").value;
    console.log(id, "check");

    if (this.PaymentVouchers.length > 0) {
      let data = this.PaymentVouchers.find((item) => item.voucher_id == id);
      console.log(data, "data_check");

      let postData = {
        id: data.id,
        voucher_id: data.voucher_id,
        amount: data.amount,
        method: data.method,
        dateincurred: data.dateincurred,
        remarks: data.remarks,
        chequeDate: data.chequeDate,
        cheque_type: data.cheque_type,
        confirmCollection: data.confirmCollection,
        additional_doc: data.additional_doc,
        reciept_doc: data.reciept_doc,
        payroll_id: data.payroll_id,
        cheque_doc: data.cheque_doc,
        benf_type: data.benf_type,
        emp_id: data.emp_id,
        acc_debit_id: data.acc_debit_id,
        wps_provider_id: data.wps_provider_id,
        acc_ref_id: data.acc_ref_id,
        empList: data.empList,
        emp_count: data.emp_count,
        paidby_emp_id: data.paidby_emp_id,
        singlePaymentMethod: data.singlePaymentMethod,
        status: data.status,
        modified_by: this.user_info.full_name,
        approver1_roleId: data.approver1_roleId,
        approver2_roleId: data.approver2_roleId,
        approver1_emp_id: data.approver1_emp_id,
        approver2_emp_id: data.approver2_emp_id,
        is_approved_1: data.is_approved_1,
        is_approved_2: data.is_approved_2,
        is_deleted: false,
        approver_date1: data.approver_date1,
        approver_date2: data.approver_date2,
        transfer_fees: data.transfer_fees,
        fee_paid_by: data.fee_paid_by,
        chequeNumber: data.chequeNumber,
      };

      try {
        this.spinner.show();

        if (
          data.approver2_roleId == this.user_info.role_id &&
          data.is_approved_2 == false &&
          data.is_approved_1 == true
        ) {
          postData.approver_date2 = moment().format("L");
          postData.is_approved_2 = true;
          postData.approver2_emp_id = this.user_info.id;
          postData.status = "Approved";

          const rsp: any = await this.paymentVoucherService
            .UpdatePaymentVoucherDetailsByID(postData)
            .toPromise();

          if (rsp.status == "200") {
            this.toast.success("Payment Voucher is approved successfully!");
            await this.getPaymentVoucherByOrgId();
            // this.updatePaymentVoucherListing("Approved");
            this.activeTab = this.Tabs[5].text;
            this.updatePaymentVoucherListing("Approved");
            this.activeTabIndex = 5;
            // this.getList();
            // this.markNotificationReaded(data.id);
          } else {
            this.toast.error(
              "Something went wrong to update the payment voucher!"
            );
          }
        } else if (
          data.approver1_roleId == this.user_info.role_id &&
          data.is_approved_1 == false
        ) {
          postData.approver_date1 = moment().format("L");
          postData.is_approved_1 = true;
          postData.approver1_emp_id = this.user_info.id;
          postData.status = "Pending";
          // this.markNotificationReaded(data.id);

          const rsp: any = await this.paymentVoucherService
            .UpdatePaymentVoucherDetailsByID(postData)
            .toPromise();

          if (rsp.status == "200") {
            await this.getPaymentVoucherByOrgId();
            this.updatePaymentVoucherListing("Pending");
            this.toast.success(
              rsp.desc + " Notification is sent to Level 2 Payment Voucher!"
            );
            // this.getList();
          } else {
            this.toast.error(
              "Something went wrong to update the payment voucher!"
            );
          }
        } else if (this.payrollSubmitFullAccess) {
          postData.status = "Approved";
          postData.is_approved_2 = true;
          postData.approver_date2 = moment().format("L");
          postData.approver2_emp_id = this.user_info.id;

          const rsp: any = await this.paymentVoucherService
            .UpdatePaymentVoucherDetailsByID(postData)
            .toPromise();

          if (rsp.status == "200") {
            await this.getPaymentVoucherByOrgId();
            this.activeTab = this.Tabs[5].text;
            this.updatePaymentVoucherListing("Approved");
            this.activeTabIndex = 5;
            this.toast.success("Payment Voucher is approved successfully!");
          } else {
            this.toast.error(
              "Something went wrong to update the payment voucher!"
            );
          }
        } else {
          console.log(
            "You don't have the permission for approving the payment voucher!"
          );
          this.toast.warning(
            "You don't have the permission for approving the payment voucher!"
          );
        }
      } catch (error) {
        console.error("Error approving payment voucher", error);
        this.toast.error("Something went wrong to update the payment voucher!");
      } finally {
        this.closePaymentVoucherDetails();
        this.spinner.hide();
      }
    }
  }

  handleRejectPaymentVoucher() {
    Swal.fire({
      title: "Are you sure you want to reject this?",
      text: "Please add remarks:",
      input: "text",
      inputPlaceholder: "Remarks...",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      // preConfirm: (reason) => {
      //   if (!reason) {
      //     Swal.showValidationMessage("Please enter valid remarks");
      //   }
      //   return reason;
      // },
    }).then((result) => {
      console.log(result, "CHECK");
      if (!result.dismiss) {
        const reason = result.value;
        // Process the reason (e.g., send it to backend)
        let id = this.PaymentMethodForm.get("id").value;
        this.rejectPaymentVoucher(reason, id);
        console.log("Reason for rejection:", reason);
        // Optionally, you can trigger your rejection logic here
      }
    });
  }

  async rejectPaymentVoucher(reason, id) {
    console.log(id, "check", this.PaymentVouchers);
    if (this.PaymentVouchers.length > 0) {
      let data = this.PaymentVouchers.find((item) => item.id == id);
      console.log(data, "data_check");
      try {
        console.log(reason, data, "CHECK***");
        if (data.id !== "") {
          this.spinner.show(); // Show spinner at the beginning
          if (
            this.payrollSubmitFullAccess ||
            data.approver1_roleId == this.user_info.role_id ||
            data.approver2_roleId == this.user_info.role_id
          ) {
            const postData = {
              id: data.id,
              voucher_id: data.voucher_id,
              amount: data.amount,
              method: data.method,
              dateincurred: data.dateincurred,
              remarks: reason,
              chequeDate: data.chequeDate,
              cheque_type: data.cheque_type,
              confirmCollection: data.confirmCollection,
              additional_doc: data.additional_doc,
              reciept_doc: data.reciept_doc,
              payroll_id: data.payroll_id,
              cheque_doc: data.cheque_doc,
              benf_type: data.benf_type,
              emp_id: data.emp_id,
              acc_debit_id: data.acc_debit_id,
              wps_provider_id: data.wps_provider_id,
              acc_ref_id: data.acc_ref_id,
              empList: data.empList,
              emp_count: data.emp_count,
              paidby_emp_id: data.paidby_emp_id,
              singlePaymentMethod: data.singlePaymentMethod,
              status: "Reject",
              modified_by: this.user_info.full_name,
              approver1_roleId: data.approver1_roleId,
              approver2_roleId: data.approver2_roleId,
              approver1_emp_id: data.approver1_emp_id,
              approver2_emp_id: data.approver2_emp_id,
              is_approved_1: data.is_approved_1,
              is_approved_2: data.is_approved_2,
              is_deleted: false,
              transfer_fees: data.transfer_fees,
              fee_paid_by: data.fee_paid_by,
              chequeNumber: data.chequeNumber,
            };
            if (data.approver1_roleId == this.user_info.role_id) {
              postData.is_approved_1 = false;
            } else if (data.approver2_roleId == this.user_info.role_id) {
              postData.is_approved_2 = false;
            }

            const rsp: any = await this.paymentVoucherService
              .UpdatePaymentVoucherDetailsByID(postData)
              .toPromise();
            console.log(rsp, "rsp");
            if (rsp.status == "200") {
              await this.getPaymentVoucherByOrgId().then(() => {
                this.activeTab = this.Tabs[4].text;
                this.updatePaymentVoucherListing("Reject");
                this.activeTabIndex = 4;
                this.closePaymentVoucherDetails();
              });

              this.toast.success(
                "Payment Voucher has been rejected successfully!"
              );
            } else {
              this.toast.error(
                "Something went wrong while updating the Payment Voucher!"
              );
            }
          } else {
            this.toast.error(
              "You don't have permission to reject the Payment Voucher!"
            );
          }
        } else {
          this.toast.error("Invalid Payroll Id!");
        }
      } catch (error) {
        console.error("Error in rejecting Payment Voucher:", error);
        this.toast.error(
          "An error occurred while rejecting the Payment Voucher!"
        );
      } finally {
        this.spinner.hide(); // Hide spinner at the end
      }
    }
  }

  async submitPaymentVoucherAfterReject() {
    try {
      this.spinner.show();
      let data = this.PaymentMethodForm.getRawValue();
      console.log(data, "CHECK");
      console.log(this.prefixString, "prefixString");
      let existingData = this.PaymentVouchers.find((x) => x.id == data.id);
      console.log(existingData, "existingData");
      let postData = {
        id: data.id,
        voucher_id: data.voucherId,
        amount: parseFloat(data.amount.replace(/,/g, "")),
        method: data.mode,
        dateincurred: data.dateincurred,
        remarks: data.remarks,
        chequeDate: data.chequeDate,
        cheque_type: data.chequeType,
        confirmCollection: data.confirmCollection,
        additional_doc: data.additionalDoc,
        reciept_doc: data.recieptDoc,
        payroll_id: data.payrollId,
        cheque_doc: data.cheque,
        benf_type: data.beneficiaryType,
        emp_id: data.empid,
        acc_debit_id: data.debitAcc,
        wps_provider_id: data.beneficiaryAcc,
        acc_ref_id: data.accRefId,
        empList: data.empList,
        emp_count: data.empCount,
        paidby_emp_id: data.paidByEmpId,
        status: data.status,
        org_id: existingData.org_id,
        created_by: existingData.created_by,
        modified_by: this.user_info.full_name,
        approver1_roleId: existingData.approver1_roleId,
        approver2_roleId: existingData.approver2_roleId,
        approver1_emp_id: existingData.approver1_emp_id,
        approver2_emp_id: existingData.approver2_emp_id,
        is_approved_1: false,
        is_approved_2: false,
        transfer_fees: data.transferFees,
        fee_paid_by: data.paidBy,
        chequeNumber: data.chequeNumber,
      };
      console.log(postData, "POSTDATA");
      if (this.payrollSubmitFullAccess) {
        postData.status = "Approved";
      } else {
        postData.status = "Pending";
        postData["approver1_roleId"] = this.payrollApprover1RoleId;
        if (this.isPayrollDualApprover) {
          postData["approver2_roleId"] = this.payrollApprover2RoleId;
        }
      }

      const rsp: any = await this.paymentVoucherService
        .UpdatePaymentVoucherDetailsByID(postData)
        .toPromise();
      console.log(rsp, "rsp");
      if (rsp.status == "200") {
        await this.getPaymentVoucherByOrgId().then(() => {
          this.activeTab = this.Tabs[4].text;
          this.updatePaymentVoucherListing("Reject");
          this.activeTabIndex = 4;
          this.closePaymentVoucherDetails();
        });
      }
    } catch (error) {
      throw error;
    } finally {
      this.toast.success("Payment Voucher has been submitted successfully!");
      this.spinner.hide();
    }
  }
  handleDeletePaymentVoucher(data) {
    if (data.id != "") {
      Swal.fire({
        title: "Are you sure you want to delete this?",
        html: `
          <div style="font-size: 16px; margin-bottom: 10px;">Please add remarks:</div>
          `,
        input: "text",
        inputPlaceholder: "Remarks...",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        preConfirm: (reason) => {
          if (!reason) {
            Swal.showValidationMessage("Please enter valid remarks");
          }
          return reason;
        },
      }).then((result) => {
        if (result.value) {
          const reason = result.value;
          this.manageRevertOrDeleteVoucher(reason, data, true);
        }
      });
    }
  }
  handleRevertPaymentVoucher(data) {
    if (data.id != "") {
      this.selectedPaymentVoucher = {};
      this.selectedPaymentVoucher = data;
      this.modalService.open(this.revertActionModal, {
        centered: true,
        size: "sm",
        backdrop: "static",
      });
    }
  }
  handleRevertOrDeleteVoucher(type, reason) {
    let data: any = this.selectedPaymentVoucher;
    console.log(reason, data, "CHECK");
    if (type == "reject") {
      this.rejectPaymentVoucher(reason, data.id);
    } else {
      this.manageRevertOrDeleteVoucher(reason, data, true);
    }
    this.closeModel();
  }

  async manageRevertOrDeleteVoucher(reason, data, isDelete: boolean) {
    try {
      if (!data.id) {
        this.toast.error("Invalid Payroll Id!");
        return;
      }

      this.spinner.show();

      if (
        this.payrollSubmitFullAccess ||
        data.approver1_roleId === this.user_info.role_id ||
        data.approver2_roleId === this.user_info.role_id
      ) {
        const postData = {
          id: data.id,
          voucher_id: data.voucher_id,
          amount: data.amount,
          method: data.method,
          dateincurred: data.dateincurred,
          remarks: reason,
          chequeDate: data.chequeDate,
          cheque_type: data.cheque_type,
          confirmCollection: data.confirmCollection,
          additional_doc: data.additional_doc,
          reciept_doc: data.reciept_doc,
          payroll_id: data.payroll_id,
          cheque_doc: data.cheque_doc,
          benf_type: data.benf_type,
          emp_id: data.emp_id,
          acc_debit_id: data.acc_debit_id,
          wps_provider_id: data.wps_provider_id,
          acc_ref_id: data.acc_ref_id,
          empList: data.empList,
          emp_count: data.emp_count,
          paidby_emp_id: data.paidby_emp_id,
          singlePaymentMethod: data.singlePaymentMethod,
          status: isDelete ? "Delete" : "Revert",
          modified_by: this.user_info.full_name,
          approver1_roleId: data.approver1_roleId,
          approver2_roleId: data.approver2_roleId,
          approver1_emp_id: data.approver1_emp_id,
          approver2_emp_id: data.approver2_emp_id,
          is_approved_1: data.is_approved_1,
          is_approved_2: data.is_approved_2,
          is_deleted: isDelete,
          transfer_fees: data.transfer_fees,
          fee_paid_by: data.fee_paid_by,
          chequeNumber: data.chequeNumber,
        };

        if (isDelete) {
          const result: any = await this.payrollService
            .getPayrollDetailsByPayrollId({ ID: data.payroll_id })
            .toPromise();

          if (result) {
            const holdedEmp = result.filter(
              (i) => i.hold_history && i.payment_voucher_id === data.id
            );

            if (holdedEmp.length > 0) {
              const payroll = this.payrollListing.find(
                (i) => i.id === data.payroll_id
              );

              if (payroll) {
                const overallNetpayable = parseFloat(
                  payroll.net_payable.replace(/,/g, "")
                );
                const empNetPayable = holdedEmp.reduce(
                  (a, b) => a + parseFloat(b.netpayable),
                  0
                );
                console.log(
                  overallNetpayable,
                  empNetPayable,
                  "overallNetpayable-empNetPayable"
                );
                console.log(holdedEmp, "HOLDED EMP");
                console.log(payroll, "payroll");
                const netpayable = overallNetpayable - empNetPayable;
                const onHoldAmount =
                  parseFloat(payroll.hold_amount.replace(/,/g, "")) +
                  empNetPayable;
                const holdEmployeesCount =
                  payroll.hold_employees + holdedEmp.length;

                const payrollPostData = {
                  id: payroll.id,
                  active_employees: payroll.active_employees,
                  status: payroll.status,
                  net_additions: payroll.net_additions,
                  net_deductons: payroll.net_deductons,
                  net_payable: netpayable,
                  hold_employees: holdEmployeesCount,
                  hold_amount: onHoldAmount,
                  approver1_roleId: payroll.approver1_roleId,
                  approver2_roleId: payroll.approver2_roleId,
                  approver1_emp_id: payroll.approver1_emp_id,
                  approver2_emp_id: payroll.approver2_emp_id,
                  is_approved_1: payroll.is_approved_1,
                  is_approved_2: payroll.is_approved_2,
                  submit_remark: "",
                  modified_by: this.user_info.full_name,
                };
                console.log(payrollPostData, "SUBMIT PAYROLL DATA");
                await this.payrollService
                  .SubmitPayrollById(payrollPostData)
                  .toPromise();
                await this.GetPayrollByOrgId();

                const holdPostData = holdedEmp.map((element) => ({
                  id: element.id,
                  on_hold: true,
                  status: "On Hold",
                  hold_remark: element.hold_remark,
                  hold_history: true,
                }));

                await this.payrollService
                  .UpdatePayrollDetailsHoldById({ onHoldEmp: holdPostData })
                  .toPromise();
              }
            }
          }
        }

        await this.paymentVoucherService
          .UpdatePaymentVoucherDetailsByID(postData)
          .toPromise();

        await this.getPaymentVoucherByOrgId();

        if (isDelete) {
          this.activeTab = this.Tabs[4].text;
          this.updatePaymentVoucherListing("Reject");
          this.toast.success("Payment Voucher has been deleted successfully!");
        } else {
          this.activeTab = this.Tabs[2].text;
          this.updatePaymentVoucherListing("Approved");
          this.toast.success("Payment Voucher has been reverted successfully!");
        }

        this.activeTabIndex = this.Tabs.findIndex(
          (tab) => tab.text === this.activeTab
        );
      } else {
        this.toast.error(
          "You don't have permission to update this Payment Voucher!"
        );
      }
    } catch (error) {
      console.error(
        "Error occurred while updating the Payment Voucher:",
        error
      );
      this.toast.error("An error occurred while updating the Payment Voucher!");
    } finally {
      this.spinner.hide(); // Hide spinner at the end
    }
  }

  handleMarkAsPaid() {
    if (!this.paymentForm.invalid) {
      let data = this.PaymentMethodForm.getRawValue();
      console.log(data, "CHECK");
      Swal.fire({
        title: "Are you sure you want to mark this as paid?",
        html: `
          <div style="font-size: 16px; margin-bottom: 10px;">Please add remarks:</div>
          `,
        input: "text",
        inputPlaceholder: "Remarks...",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
      }).then((result) => {
        if (!result.dismiss) {
          const remarks = result.value;
          this.markPaymentVoucherPaid(remarks);
        }
      });
    } else {
      this.toast.error("Please fill all the required fields");
    }
  }
  cardClick(type) {
    switch (type) {
      case "Pending Payroll":
        this.onTabChange({ selectedIndex: 0 });
        break;
      case "Held Payments":
        this.onTabChange({ selectedIndex: 1 });
        break;
      case "Pending Voucher":
        this.onTabChange({ selectedIndex: 3 });
        break;
      case "Approved Voucher":
        this.onTabChange({ selectedIndex: 5 });
        break;
    }
  }
  async markPaymentVoucherPaid(remarks) {
    try {
      this.spinner.show(); // Show the spinner

      let paymentForm = this.paymentForm.getRawValue();
      let postData = {
        reciept_document: paymentForm.receiptDocument,
        id: paymentForm.id,
        reciept_number: paymentForm.receiptNumber,
        date: paymentForm.date,
        modified_by: this.user_info.full_name,
        remarks: remarks,
        status: "Paid",
        org_id: this.org_id,
      };
      console.log(postData, "postData");

      const rsp: any = await this.paymentVoucherService
        .MarkPaymentVoucherAsPaidByID(postData)
        .toPromise();
      console.log(rsp);

      if (rsp[0].result == "Payment Voucher Updated") {
        await this.getPaymentVoucherByOrgId();
        this.activeTab = this.Tabs[5].text;
        this.updatePaymentVoucherListing("Approved");
        this.activeTabIndex = 5;
        this.closePaymentVoucherDetails();
        this.toast.success(
          "Payment Voucher has been marked as paid successfully!"
        );
      } else if (rsp[0].result == "New Payroll Created") {
        await this.getPaymentVoucherByOrgId();
        this.activeTab = this.Tabs[5].text;
        this.updatePaymentVoucherListing("Approved");
        this.activeTabIndex = 5;
        this.closePaymentVoucherDetails();
        this.toast.success(
          "Payment Voucher has been marked as paid successfully and New Payroll has been created!"
        );
        this.handleNewPayrollCreated(rsp[0].name);
      } else {
        this.toast.error(
          "Something went wrong while marking the Payment Voucher as paid!"
        );
      }
    } catch (error) {
      this.toast.error(
        "Something went wrong while marking the Payment Voucher as paid!"
      );
    } finally {
      this.spinner.hide(); // Hide the spinner
    }
  }
  handleNewPayrollCreated(name) {
    Swal.fire({
      title: `Success, Payroll for ${name} has been created!`,
      confirmButtonText: "OK",
      allowOutsideClick: false,
      type: "success",
    }).then(async (result) => {
      if (result.value) {
        this.spinner.show();
        await this.initializeComponentAsync();
        this.activeTabIndex = 0;
        this.activeTab = "Pending";
        this.spinner.hide();
      }
    });
  }

  resetSelectedPayroll() {
    this.selectedPayroll = {
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
      previous_status: "",
      submitted_by: "",
      is_approved_1: false,
      is_approved_2: false,
      approver1_roleId: "",
      approver2_roleId: "",
      approver1_emp_id: "",
      approver2_emp_id: "",
      approver1_name: "",
      approver2_name: "",
    };
  }
  //Adjustments

  openAddAdjustment(emp_id) {
    this.spinner.show();
    this.selectedEmp = emp_id;
    this.AddAdjustmentForm = new FormGroup({
      reffid: new FormControl("", [Validators.required]),
      empid: new FormControl({ value: emp_id, disabled: true }, [
        Validators.required,
      ]),
      type: new FormControl("", [Validators.required]),
      item: new FormControl("", [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
      dateincurred: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
    });

    this.termDetails = [];
    this.showRecurring = false;
    this.termCount = 2;
    this.adjDocUrl = "";

    setTimeout(() => {
      this.spinner.hide();
      this.isAdjModalOpen = true;

      this.AddAdjustmentForm.patchValue({
        type: this.adjType[0].id,
        item: this.adjItem[0].id,
        reffid: this.generateRandomReferenceKey(),
      });
    }, 2000);
  }

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
    console.log(action, "changeTermCount");
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
  formatCurrency(amount: number): string {
    const formattedAmount = amount.toFixed(2);
    return `AED ${formattedAmount}`;
  }
  changeEmp(evt) {
    console.log("changed the employee", evt);
    this.selectedEmp = evt.itemData.id;
  }
  getAdjUserDetailsByEmpId() {
    let empId = this.AddAdjustmentForm.get("empid").value;
    this.selectedEmp = empId;
    console.log(empId, "SELECTED empId");
    if (empId) {
      let postData = { id: empId };
      this.admService.FindByEmpID(postData).subscribe((userData: any) => {
        console.log(userData, "CHECKING USERDATA!!!");
        this.selectedemployeeData = userData;
        this.showAdjEmployeeData = true;
      });
    }
  }
  goAdjBack() {
    this.showAdjEmployeeData = false;
  }

  async submitAdjustment() {
    try {
      this.spinner.show();
      let postData;
      let formData = this.AddAdjustmentForm.value;
      let user_Info = JSON.parse(localStorage.getItem("user_info"));

      if (this.selectedEmp == "") {
        this.toast.info("Please select the Employee for Proceeding!");
        return;
      }

      postData = {
        reference_id: formData.reffid,
        org_id: this.org_id,
        emp_id: this.selectedEmp,
        pay_item: formData.item,
        type: formData.type,
        amount: formData.amount,
        date_incurred: formData.dateincurred,
        doc_url: this.adjDocUrl,
        remarks: formData.remark,
        created_by: user_Info.id,
        modified_by: this.user_info.full_name,
        is_deleted: false,
      };

      if (this.payrollSubmitFullAccess) {
        postData.status = "Approved";
      } else {
        postData.status = "Pending";
        postData.approver1_roleId = this.payrollApprover1RoleId;
        if (this.isPayrollDualApprover)
          postData.approver2_roleId = this.payrollApprover2RoleId;
      }

      if (formData.type == "Recurring Deduction") {
        // Format of termDetails: { index: i+1, payroll_term, amountstring, amount }
        for (let i = 0; i < this.termCount; i++) {
          postData.amount = this.termDetails[i].amount;
          postData.terms = i + 1;

          await new Promise((resolve) => {
            this.payrollService.AddPayrollAdjustments(postData).subscribe(
              (rsp: any) => {
                if (rsp.status === "200") {
                  console.log("Adding successful");
                  resolve(i);
                }
              },
              (error) => {
                console.error("Error adding payroll adjustment:", error);
                this.toast.error("Failed to add payroll adjustment.");
              }
            );
          });
        }
        await this.payrollService
          .generatePayTableByOrgID({ id: this.org_id })
          .toPromise();
        this.toast.success(
          "Recurring Deduction Payments have been added successfully!"
        );
        this.closeAdjModel();
      } else {
        this.payrollService.AddPayrollAdjustments(postData).subscribe(
          async (rsp: any) => {
            if (rsp) {
              this.toast.success(rsp.desc);
              await this.payrollService
                .generatePayTableByOrgID({ id: this.org_id })
                .toPromise();
              this.closeAdjModel();
            }
          },
          (error) => {
            console.error("Error adding payroll adjustment:", error);
            this.toast.error("Failed to add payroll adjustment.");
          }
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle unexpected errors
      this.toast.error("An unexpected error occurred.");
    } finally {
      this.spinner.hide();
    }
  }

  getPayrollOnHoldDetails() {
    this.onHoldListing = [];
    console.log(this.EmpSalData, "EmpSalData");
    this.payrollListing.forEach((element) => {
      if (element.hold_employees > 0) {
        this.onHoldListing.push(element);
      }
      this.onHoldPaymentCount = this.onHoldListing.length;
      console.log(this.onHoldListing, "onHoldListing");
    });
  }
  async openPayrollTimeline(id) {
    let selectedId = "";
    if (id != "" && id != null) {
      selectedId = id;
    } else {
      selectedId = this.selectedPayrollId;
    }
    try {
      this.spinner.show();
      await this.GetPayrollTimelineById(selectedId);
    } catch (error) {
      console.error(error);
      this.toast.error("Something went wrong. Please try again later");
    } finally {
      this.spinner.hide();
      this.modalService.open(this.payrollTimelineModal, {
        size: "lg",
      });
    }
  }
  async GetPayrollTimelineById(id) {
    let postData = { id: id };
    this.payrollTimelineData = [];
    let res: any = await this.payrollService
      .GetPayrollTimelineById(postData)
      .toPromise();
    if (res.length > 0) {
      this.payrollTimelineData = res;
      console.log(res, "RES");
    }
  }
  toggleDetails(index: number): void {
    this.showDetails[index] = !this.showDetails[index];
  }

  public async GetLastAddedProjectPrefixByOrgID() {
    try {
      // Fetch last added voucher prefix
      const data: any = await this.paymentVoucherService
        .GetLastAddedVoucherPrefixByOrgID({ ID: this.org_id })
        .toPromise();

      if (data.code == "") {
        // Fetch all prefixes
        const prefixes: any = await this.projectService
          .GetAllPrefixByOrgID()
          .toPromise();

        for (var i = 0; i < prefixes.length; i++) {
          if (prefixes[i].type == "pv") {
            if (prefixes[i].prefix_for == "Default") {
              let splittable;
              if (prefixes[i].prefix_name) {
                let prefix_name = prefixes[i].prefix_name;
                splittable = prefix_name.split("/");
                this.prefixString = `${splittable[0]}/${moment().format(
                  "YY"
                )}/${moment().format("MM")}/0000`;
                this.prefix_for = prefixes[i].prefix_for;
              }
            } else if (prefixes[i].prefix_for == "Custom") {
              this.showPrefixText = true;
            } else if (prefixes[i].prefix_for == "Sequence") {
              let splittable;
              this.showPrefixText = false;
              if (prefixes[i].prefix_name) {
                let prefix_name = prefixes[i].prefix_name;
                splittable = prefix_name.split("/");
                this.prefixString = `${splittable[0]}/000`;
                this.prefix_for = prefixes[i].prefix_for;
              }
            } else if (prefixes[i].prefix_for == "random") {
              let splittable;
              if (prefixes[i].prefix_name) {
                let prefix_name = prefixes[i].prefix_name;
                splittable = prefix_name.split("/");
                let random = Math.floor(1000 + Math.random() * 9000);
                this.prefixString = `${splittable[0]}/${random}`;
                this.prefix_for = prefixes[i].prefix_for;
              }
            }
          }
        }
      } else {
        let lastAddedprefix = data.code;
        let lastAddprefixSplit = lastAddedprefix.split("/").pop();

        // Fetch all prefixes
        const prefixes: any = await this.projectService
          .GetAllPrefixByOrgID()
          .toPromise();

        for (var i = 0; i < prefixes.length; i++) {
          if (prefixes[i].type == "pv") {
            console.log("prefix", prefixes[i].prefix_for);
            if (prefixes[i].prefix_for == "Default") {
              let splittable;
              if (prefixes[i].prefix_name) {
                let prefix_name = prefixes[i].prefix_name;
                splittable = prefix_name.split("/");
                this.prefixString = `${splittable[0]}/${moment().format(
                  "YY"
                )}/${moment().format("MM")}/${lastAddprefixSplit}`;
                this.prefix_for = prefixes[i].prefix_for;
              }
            } else if (prefixes[i].prefix_for == "Custom") {
              this.showPrefixText = true;
            } else if (prefixes[i].prefix_for == "Sequence") {
              let splittable;
              this.showPrefixText = false;
              if (prefixes[i].prefix_name) {
                let prefix_name = prefixes[i].prefix_name;
                splittable = prefix_name.split("/");
                this.prefixString = `${splittable[0]}/${lastAddprefixSplit}`;
                this.prefix_for = prefixes[i].prefix_for;
              }
            } else if (prefixes[i].prefix_for == "random") {
              let splittable;
              if (prefixes[i].prefix_name) {
                let prefix_name = prefixes[i].prefix_name;
                splittable = prefix_name.split("/");
                let random = Math.floor(1000 + Math.random() * 9000);
                this.prefixString = `${splittable[0]}/${random}`;
                this.prefix_for = prefixes[i].prefix_for;
              }
            }
          }
        }
      }
    } catch (error) {
      Swal.fire("Error!", error, "error").then((result) => {});
    }
  }

  //Created to increment the prefix on each payment voucher creation
  // public async GetLastAddedProjectPrefixByOrgID() {
  //   try {

  //     const prefixes: any = await this.projectService
  //       .GetAllPrefixByOrgID()
  //       .toPromise();

  //     for (const prefix of prefixes) {
  //       if (prefix.type === "pv") {
  //         if (prefix.prefix_for === "Default") {
  //           this.showPrefixText = false;
  //           if (prefix.prefix_name) {
  //             const splittable = prefix.prefix_name.split("/");
  //             this.prefixString = `${splittable[0]}/${moment().format("YY")}/${moment().format("MM")}/0000`;
  //             this.prefix_for = prefix.prefix_for;
  //           }
  //         } else if (prefix.prefix_for === "Custom") {
  //           this.showPrefixText = true;
  //         } else if (prefix.prefix_for === "Sequence") {
  //           this.showPrefixText = false;
  //           if (prefix.prefix_name) {
  //             const splittable = prefix.prefix_name.split("/");
  //             const lastAddedPrefix = splittable.pop(); // Assuming last part of the split is the current sequence
  //             this.prefixString = `${splittable.join("/")}/${lastAddedPrefix}`;
  //             this.prefix_for = prefix.prefix_for;
  //           }
  //         } else if (prefix.prefix_for === "random") {
  //           if (prefix.prefix_name) {
  //             const splittable = prefix.prefix_name.split("/");
  //             const random = Math.floor(1000 + Math.random() * 9000);
  //             this.prefixString = `${splittable[0]}/${random}`;
  //             this.prefix_for = prefix.prefix_for;
  //           }
  //         }
  //       }
  //       console.log(this.prefixString, this.prefix_for,"this.prefixString, this.prefix_for");
  //     }
  //   } catch (error) {
  //     Swal.fire("Error!", error, "error");
  //   }
  // }

  incrementVoucherPrefix() {
    console.log("Called incrementVoucherPrefix");
    if (!this.prefixString || !this.prefix_for) {
      console.error("Initial prefix and prefixFor type are not set.");
      return;
    }

    let splittable = this.prefixString.split("/");
    let jobNo;

    switch (this.prefix_for) {
      case "Default":
        if (parseInt(splittable[3]).toString().length == 1) {
          jobNo = "000" + (parseInt(splittable[3]) + 1);
        } else if (parseInt(splittable[3]).toString().length == 2) {
          jobNo = "00" + (parseInt(splittable[3]) + 1);
        } else if (parseInt(splittable[3]).toString().length == 3) {
          jobNo = "0" + (parseInt(splittable[3]) + 1);
        } else {
          jobNo = parseInt(splittable[3]) + 1;
        }
        this.prefixString = `${splittable[0]}/${moment().format(
          "YY"
        )}/${moment().format("MM")}/${jobNo}`;
        break;

      case "Custom":
        break;

      case "Sequence":
        if (parseInt(splittable[1]).toString().length == 1) {
          jobNo = "000" + (parseInt(splittable[1]) + 1);
        } else if (parseInt(splittable[1]).toString().length == 2) {
          jobNo = "00" + (parseInt(splittable[1]) + 1);
        } else if (parseInt(splittable[1]).toString().length == 3) {
          jobNo = "0" + (parseInt(splittable[1]) + 1);
        } else {
          jobNo = parseInt(splittable[1]) + 1;
        }
        this.prefixString = `${splittable[0]}/${jobNo}`;
        break;

      case "random":
        let random = Math.floor(1000 + Math.random() * 9000);
        this.prefixString = `${splittable[0]}/${random}`;
        break;

      default:
        console.error("Unknown prefix type.");
        break;
    }
    console.log(this.prefixString, "this.prefixString");
    return this.prefixString;
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
      let filteredSalaryHistory = response
        .filter((history) => {
          const createdDate = new Date(history.start_date);
          const endDate= new Date(history.end_date);
          return createdDate >= start_date && createdDate <= end_date || endDate >= start_date && endDate <= end_date;
        })
        .sort(
          (a, b) =>
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        );
        console.log(filteredSalaryHistory, "filteredSalaryHistory");
        filteredSalaryHistory =filteredSalaryHistory.map((history) => {
        const dateDiff = this.calculateDaysDifference(
          history.start_date,
          history.end_date,
          this.selectedPayroll.start_date,
          this.selectedPayroll.end_date
        );

        return { ...history, dateDiff: dateDiff + 1  };
      });
      console.log(filteredSalaryHistory, "****");
      if (filteredSalaryHistory.length > 1) {
        filteredSalaryHistory[0].start_date = this.selectedPayroll.start_date;
        filteredSalaryHistory[filteredSalaryHistory.length - 1].end_date =
          this.selectedPayroll.end_date;
        this.salaryHistory = filteredSalaryHistory;
        this.openSalaryAccord = filteredSalaryHistory.length < 2;
      } else {
        console.log(response, this.salaryHistory, "else called salaryHistory");
        let history = response.filter((history) => history.is_active);
        history=history.map((history) => {
          const dateDiff = this.calculateDaysDifference(
            history.start_date,
            history.end_date,
            this.selectedPayroll.start_date,
            this.selectedPayroll.end_date
          );

          return { ...history, dateDiff: dateDiff + 1  };
        });
        this.salaryHistory = history;
        this.openSalaryAccord = true;
      }


    }
  }
  calculateDaysDifference(
    startDateStr: any,
    endDateStr: any,
    payrollStartDateStr: any,
    payrollEndDateStr: any
  ): any | null {
    const startDate = new Date(startDateStr);
    const payrollStartDate = new Date(payrollStartDateStr);
    const endDate = endDateStr ? new Date(endDateStr) : new Date(payrollEndDateStr);

    if (isNaN(startDate.getTime())) {
      console.error("Invalid start_date from response.");
      return null;
    } else if (isNaN(payrollStartDate.getTime())) {
      console.error("Invalid payroll_start_date provided.");
      return null;
    } else if (isNaN(endDate.getTime())) {
      console.error("Invalid end_date or payroll_end_date provided.");
      return null;
    }

    const finalStartDate = payrollStartDate > startDate ? payrollStartDate : startDate;

    const timeDifference = endDate.getTime() - finalStartDate.getTime();
    if (isNaN(timeDifference)) {
      console.error("Invalid time difference.");
      return null;
    }

    const dayDiff = timeDifference / (1000 * 3600 * 24);
    return Math.floor(dayDiff);
  }


  openPreviousPayrolls() {
    this.spinner.show();
    let filteredData: any = this.payrollListing.filter(
      (payroll) => payroll.status == "Paid"
    );
    this.previousPayrollListing = filteredData.sort((a, b) => {
      const dateA = new Date(a.created_date);
      const dateB = new Date(b.created_date);
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;
      return dateB.getTime() - dateA.getTime();
    });
    console.log(this.previousPayrollListing, "LISTING CHECK");
    setTimeout(() => {
      this.showComponant("previousPayrolls");
      this.spinner.hide();
    }, 1000);
  }

  openPayrollDetails(data) {
    this.paidPaytableView = true;
    this.onPaymentTableApproved(data.id);
  }
  public toProfile(emp_id) {
    // this.router.navigate(["/user-profile"]);
    // this.modalService.dismissAll();
    this.router.navigate(["/HR-Employee"], {
      queryParams: {
        key: this.xorEncryptDecrypt(emp_id, this.key),
        dest: "EmpView",
        id: this.selectedPayrollId,
      },
    });
    this.closeEmpSalDiv();
  }
  xorEncryptDecrypt(input: string, key: string): string {
    let output = "";
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
    }
    return output;
  }
  key = "secret";
}
