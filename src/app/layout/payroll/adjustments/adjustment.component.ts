import { Component, OnInit, ViewChild } from "@angular/core";

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import {
  NgbModal,
  NgbModalConfig,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { settingsService } from "../../../services/settings.service";
import { UserService } from "../../../services/user.service";
import { EmployeeService } from "../../../services/employee.service";
import { AdministrativeService } from "../../../services/administrative.service";
import { ToastrService } from "ngx-toastr";
import { PayrollService } from "../../../services/payroll.service";
import { ModuleSetupService } from "../../../services/moduleSetup.service";
import { TimeSheetService } from "../../../services/timesheet.service";
import Swal from "sweetalert2";
import * as _ from "lodash";
import { DatePipe } from "@angular/common";

import { TabComponent } from "@syncfusion/ej2-angular-navigations";
import moment = require("moment");
import { PaymentVoucherService } from "../../../services/payment-voucher.service";
import { log } from "console";
import { timeThursday } from "d3";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { ActivatedRoute } from "@angular/router";
import { throwMatDialogContentAlreadyAttachedError } from "@angular/material";
import { ProjectService } from "../../../services/project.service";

@Component({
  selector: "app-adjustment",
  templateUrl: "./adjustment.component.html",
  styleUrls: ["./adjustment.component.scss"],
})
export class AdjustmentComponent implements OnInit {
  constructor(
    private employeeService: EmployeeService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private admService: AdministrativeService,
    private toast: ToastrService,
    private modalService: NgbModal,
    public config: NgbModalConfig,
    private spinner: NgxSpinnerService,
    private settingsService: settingsService,
    private payrollService: PayrollService,
    public ModuleSetupService: ModuleSetupService,
    private paymentVoucherService: PaymentVoucherService,
    private timesheetService: TimeSheetService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private empService: EmployeeService,
    private projectService:ProjectService
  ) {
    config.backdrop = "static";
  }

  @ViewChild("addadjustmentModel", { static: false }) addadjustmentModel: any;
  @ViewChild("adjustmentModel", { static: false }) adjustmentModel: any;
  @ViewChild("waiveoffdetailsModel", { static: false })
  waiveoffdetailsModel: any;
  @ViewChild("apradjustmentModel", { static: false }) apradjustmentModel: any;
  @ViewChild("apprMarkPaidModel", { static: false }) apprMarkPaidModel: any;
  @ViewChild("apprEditAdjModel", { static: false }) apprEditAdjModel: any;
  @ViewChild("autoAdjGrid", { static: false })
  public autoAdjGrid: GridComponent;

  @ViewChild("bankAccModal", { static: false }) bankAccModal: any;

  ngOnInit(): void {
    const parsedUserInfo = JSON.parse(localStorage.getItem("user_info"));
    this.isAccountOwner = parsedUserInfo.is_superadmin;
    this.checkDashboardRequest();
    this.checkUserRights();
    this.getList();
    this.getcurrentPayrollMonth();
    this.getActiveEmployeeList();
    this.getPayrollSettingRules();
    this.route.queryParams.subscribe((params) => {
      const id = params["id"];
      if (id != null) {
        this.spinner.show();
        setTimeout(() => {
          this.openAddAdjustment(id);
          this.spinner.hide();
        }, 1000);
        console.log("Received ID:", id);
      }
      // Use the id as needed
    });
    this.payrollHistoryFrm = new FormGroup({
      paymonth: new FormControl(""),
    });
    localStorage.removeItem('adjustmentsData');
  }

  

  accessToPage = false;
  showEmployeeData = false;
  showChequeDiv = false;
  bankTransfer = false;
  selectAllWaiveOff = false;
  isAccountOwner = false;
  commonModuleName;

  Tabs = [
    { text: "Pending" },
    { text: "Rejected" },
    { text: "Approved" },
    { text: "Added to Payment" },
    { text: "Added to Paytable" },
    { text: "Absent Deduction" },
    { text: "Auto Adjustment" },
    { text: "Waive off" },
    { text: "Paid" },
  ];
  selectedWaveOffItems = [];
  user_info: any;
  selectedemployeeData;

  PayrollModuleID;
  createPayrollSectionName;
  allowWaiveoff = false;
  showPayrollPaymentBtn = false;
  addPayrollPaymentsFullAccess = false;
  createPayrollPaymentApprover1rollId;
  createPayrollPaymentApprover1rollName;
  isDualApproverPayrollPayments = false;
  createPayrollPaymentApprover2rollId;
  createPayrollPaymentApprover2rollName;

  commonFields: Object = { text: "text", value: "id" };
  custCommonFields: Object = { text: "value", value: "id" };
  org_id = localStorage.getItem("org_id").toString();
  async checkUserRights() {
    this.user_info = JSON.parse(localStorage.getItem("user_info"));
    if (this.isAccountOwner) {
      this.accessToPage = true;
      this.showPayrollPaymentBtn = true;
      this.allowWaiveoff = true;
      this.addPayrollPaymentsFullAccess = true;
    } {
      this.userService
        .GetAccessRightsbyRole({ id: this.user_info.role_id })
        .subscribe((data: any) => {
          if (data) {
            data.map((item) => {
              item.module_name = item.module_name.replace(/\s+/g, "");
              return item;
            });
            this.commonModuleName = _.groupBy(data, "module_name");
            if (this.commonModuleName.Payroll) {
              this.PayrollModuleID = this.commonModuleName.Payroll[0].id;
              this.commonModuleName.Payroll.map((elm) => {
                console.log("section :", elm.section_name);
                if (elm.section_name === "Create and Modify Payroll Payments") {
                  if (elm.is_allow === true) {
                    this.showPayrollPaymentBtn = elm.is_allow;
                    this.createPayrollSectionName = elm.section_name;
                  }
                }
                if (elm.section_name === "View PayRoll") {
                  if (elm.is_allow === true) {
                    this.accessToPage = true;
                  }
                }
                if (elm.section_name === "Waive off Auto Deduction ") {
                  if (elm.is_allow === true) {
                    this.allowWaiveoff = true;
                  }
                }
              });
              this.checkPayrollApprover(this.user_info.role_id);
            }
          }
        });
    }

  }

  async checkDashboardRequest(){
    let data = JSON.parse(localStorage.getItem("adjustmentsData"));
    
    if(data != null){
      this.dashAprRej(data);
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

  activePayrollname = "";
  activePayrollId = "";
  isPayrollActive = false;
  getcurrentPayrollMonth() {
    this.payrollService
      .getActivePayrollMonthDetailsByOrgId({
        id: localStorage.getItem("org_id"),
      })
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.isPayrollActive = true;
          this.activePayrollname = data[0].name;
          this.activePayrollId = data[0].id;
          console.log(
            "activepayroll",
            this.activePayrollname,
            this.activePayrollId
          );
        } else {
          console.log("No activepayroll");
          this.isPayrollActive = false;
        }
      });
  }

  ForAbsentDeduction = "No Absent Penality Deduction";
  ForLessHourDeduction = "No Less Hour Deduction";
  ForCheckoutMissing = "No Checkout Missing Deduction";
  ForLateCheckin = "No Late Checkin Deduction";

  getPayrollSettingRules() {
    this.payrollService
      .GetPayrollSettingByOrgId({
        id: localStorage.getItem("org_id"),
      })
      .subscribe((data: any) => {
        if (data.length > 0) {
          let settingData = data[0];

          if (data[0].is_auto_dedec_ab == true) {
            if (settingData.ab_dedc_by == "abperday") {
              this.ForAbsentDeduction =
                "Absent Penality Deducted by Per Day Salary";
            } else if (settingData.ab_dedc_by == "abnumberday") {
              this.ForAbsentDeduction = `Absent Penality Deducted by ${settingData.ab_number_day} Days Salary`;
            } else if (settingData.ab_dedc_by == "abfixamt") {
              this.ForAbsentDeduction = `Absent Penality Deducted by ${settingData.ab_fix_amount} Amount`;
            }
          }

          if (data[0].is_auto_dedc_lh == true) {
            if (settingData.lh_dedc_by == "lhpermin") {
              this.ForLessHourDeduction = `Less Hour Deducted by considering each less minute as ${settingData.lh_tolr_min
                } minutes.
               Maximum deduction upto ${settingData.lh_maxdeduc_by} ${settingData.lh_maxdeduc_by == "Fixed Amount"
                  ? settingData.lh_fix_amount
                  : ""
                } `;
            } else if (settingData.lh_dedc_by == "lhhalfday") {
              this.ForLessHourDeduction = `Less Hour Deducted by Half day Salary`;
            } else if (settingData.lh_dedc_by == "lhperday") {
              this.ForLessHourDeduction = `Less Hour Deducted by Per Day Salary`;
            } else if (settingData.lh_dedc_by == "lhfixamt") {
              this.ForLessHourDeduction = `Less Hour Deducted by ${settingData.lh_fix_amount} Amount`;
            }
          }

          if (data[0].is_auto_dedc_cm == true) {
            if (settingData.cm_dedc_by == "cmphalfday") {
              this.ForCheckoutMissing = `Checkout Missing Deducted by Half day Salary`;
            } else if (settingData.cm_dedc_by == "cmperday") {
              this.ForCheckoutMissing = `Checkout Missing Deducted by Per Day Salary`;
            } else if (settingData.cm_dedc_by == "cmfixamt") {
              this.ForCheckoutMissing = `Checkout Missing Deducted by ${settingData.cm_fix_amount} Amount`;
            }
          }

          if (data[0].is_auto_dedc_lc == true) {
            if (settingData.lc_dedc_by == "lchalfday") {
              this.ForLateCheckin = `Late Checkin Deducted by Half day Salary`;
            } else if (settingData.lc_dedc_by == "lcperday") {
              this.ForLateCheckin = `Late Checkin Deducted by Per Day Salary`;
            } else if (settingData.lc_dedc_by == "lcfixamt") {
              this.ForLateCheckin = `Late Checkin Deducted by ${settingData.lc_fixamt} Amount`;
            }
          }
        }
      });
  }

  payrollListing = [];
  runningPayrollId = "";
  payrollWaiveoffListing = [];
  async GetPayrollByOrgId() {
    this.spinner.show();
    try {
      this.payrollListing = [];
      const data: any = await this.payrollService
        .GetPayrollByOrgId({ id: this.org_id })
        .toPromise();
      if (data) {
        this.payrollListing = data;
        let flagcheck = false;
        data.map((item) => {
          if (item.status === "Paid") {
            this.payrollMonthHistory.push({
              id: item.id,
              text: item.name,
            });
            if (flagcheck == false && item.status === "Paid") {
              this.payrollHistoryFrm.patchValue({ paymonth: item.name });
              flagcheck = true;
            }
          }
        });
        if (this.payrollListing.length > 0) {
          const currentPayroll = this.payrollListing.find(
            (item) => item.status !== "Paid"
          );
          this.runningPayrollId = currentPayroll.id;
          this.payrollService
            .GetPayrollWaiveoffByPayrollId({ id: this.runningPayrollId })
            .subscribe((rsp: any) => {
              if (rsp) {
                this.payrollWaiveoffListing = rsp;
                console.log(
                  "payrollWaiveoffListing",
                  this.payrollWaiveoffListing
                );
                this.spinner.hide();
              }
            });
        }
      }
    } catch (error) {
      console.error("Error in GetPayrollByOrgId:", error);
      // Optionally, handle the error state or show an error message
    }
  }

  activeEmpList = [];
  getActiveEmployeeList() {
    this.activeEmpList = [];
    this.payrollService
      .getActiveEmployeeListByOrgID({ id: this.org_id })
      .subscribe((rsp: any) => {
        if (rsp) {
          rsp.map((emp) => {
            // this.activeEmpList.push({ value: emp.id, text: emp.full_name + ' (ID: ' + emp.id + ')' });
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
    let empId = this.AddAdjustmentForm.get("empid").value;
    console.log(empId, "SELECTED empId");
    if (empId) {
      let postData = { id: empId };
      this.admService.FindByEmpID(postData).subscribe((userData: any) => {
        console.log(userData, "CHECKING USERDATA!!!");
        this.selectedemployeeData = userData;
        this.showEmployeeData = true;
        console.log(
          this.selectedemployeeData.imgurl_id,
          this.selectedemployeeData,
          "IMG"
        );
      });
    }
  }
  goBack() {
    this.showEmployeeData = false;
  }

  selectedEmp = "";
  changeEmp(evt) {
    console.log("changed the employee", evt);
    this.selectedEmp = evt.itemData.id;
  }

  public AddAdjustmentForm: FormGroup;
  public ApprMarkPaidForm: FormGroup;
  public bankAccountForm: FormGroup;
  childModalRef: NgbModalRef;

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

  adjType = [
    { id: "Addition", text: "Addition" },
    { id: "Deduction", text: "Deduction" },
    { id: "Recurring Deduction", text: "Recurring Deduction" },
  ];
  // paymentModeArr = [{ id: "Cheque", text: "Cheque" }, { id: "Cash", text: "Cash" }, { id: "Bank Transfer", text: "Bank Transfer" }];
  paymentModeArr = [
    {
      id: "Bank Transfer",
      text: "Bank Transfer",
    },
    {
      id: "Cash",
      text: "Cash",
    },
    {
      id: "Cheque",
      text: "Cheque",
    },
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
  senderArr = [];
  companyBankAccDetails = [];
  totalAmount = 0.0;
  totalAmountString = "AED 0.00";
  showRecurring = false;

  async openAddAdjustment(empid) {
    this.modalService.open(this.addadjustmentModel);

    this.AddAdjustmentForm = new FormGroup({
      reffid: new FormControl("", [Validators.required]),
      empid: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      item: new FormControl("", [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
      // payrollMonth: new FormControl('Pending', [Validators.required]),
      dateincurred: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
      doc_url: new FormControl(""),
    });
    if (empid != null) {
      this.AddAdjustmentForm.patchValue({
        empid: empid,
      });
    }
    let adj_prefix=await this.GetAdjustmentPrefixByOrgID()
    this.AddAdjustmentForm.patchValue({
      type: this.adjType[0].id,
      item: this.adjItem[0].id,
      reffid: adj_prefix,
    });
    this.termDetails = [];
    this.showRecurring = false;
    this.termCount = 2;
    this.adjDocUrl = "";
  }
  checkIfEmpIdExists() { }
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
  GetCompanyBankAccountDetails() {
    let postData = {
      mode: "Bank Transfer",
      org_id: this.org_id,
      is_company: true,
      mode_type: "finance",
    };
    // this.companyBankAccDetails = [];
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
        // console.log(this.companyBankAccDetails, "*********")
      });
  }
  showSelectedBankAccDetails(type) {
    this.spinner.show();
    try {
      this.initializeBankAccountForm();
      let acc_id = this.ApprMarkPaidForm.get("debitAcc").value;

      let selectedDetails = this.companyBankAccDetails.find(
        (i) => i.id == acc_id
      );
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
  openBankAccModal() {
    this.childModalRef = this.modalService.open(this.bankAccModal);
  }
  closeBankAccModal() {
    console.log(this.childModalRef, "childModalRef");
    if (this.childModalRef) {
      this.childModalRef.close();
    }
  }
  closeModel() {
    this.modalService.dismissAll();
    this.adjDocUrl = "";
    this.isadjDocUp = false;
    this.showRecurring = false;
    this.termCount = 2;
    this.termDetails = [];
    localStorage.removeItem('adjustmentsData');
    //!!!want to add the initail values for the changes status part
  }

  async submitAdjustment() {
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
      doc_url: formData.doc_url,
      remarks: formData.remark,
      created_by: user_Info.id,
      modified_by: user_Info.id,
      is_deleted: false,
    };
    console.log("post Data Before", postData);

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
          console.log("post Data", postData);
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
      this.getList();
      this.closeModel();
    } else {
      console.log("post Data", postData);
      this.payrollService
        .AddPayrollAdjustments(postData)
        .subscribe((rsp: any) => {
          if (rsp) {
            this.getList();
            this.toast.success(rsp.desc);
            this.closeModel();
          }
        });
    }
  }

  adjDocUrl = "";
  isadjDocUp = false;
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
              this.ApprMarkPaidForm.patchValue({
                cheque: imData.secure_url,
              });
              break;
            case "additionalDoc":
              this.ApprMarkPaidForm.patchValue({
                additionalDoc: imData.secure_url,
              });
              break;
            case "reciept":
              this.ApprMarkPaidForm.patchValue({
                recieptDoc: imData.secure_url,
              });
              break;
            case "adjDoc":
              // this.adjDocUrl = imData.secure_url;
              this.AddAdjustmentForm.patchValue({
                doc_url: imData.secure_url,
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
    }).then((result) => {
      if (result.value) {
        switch (type) {
          case "cheque":
            this.ApprMarkPaidForm.patchValue({
              cheque: "",
            });
            break;
          case "additionalDoc":
            this.ApprMarkPaidForm.patchValue({
              additionalDoc: "",
            });
            break;
          case "recieptDoc":
            this.ApprMarkPaidForm.patchValue({
              recieptDoc: "",
            });
            break;
          case "adjDoc":
            this.AddAdjustmentForm.patchValue({
              doc_url: "",
            });
            break;
          default:
            console.error("Unhandled type:", type);
        }
      }
    });
  }
  dataList;
  pendingList = [];
  approvedList = [];
  rejectedList = [];
  absentDeducList = [];
  autoDeducList = [];
  activeList = [];
  paymentList = [];
  paidListMain = [];
  payrollMonthHistory = [];

  async getList() {
    try {
      this.spinner.show();
      this.user_info = JSON.parse(localStorage.getItem("user_info"));

      const rsp: any = await this.payrollService
        .GetPayrollAdjustmentByOrgId({ orgID: this.org_id })
        .toPromise();

      if (rsp) {
        this.pendingList = [];
        this.approvedList = [];
        this.rejectedList = [];
        this.activeList = [];
        this.autoDeducList = [];
        this.absentDeducList = [];
        this.paidListMain = [];
        this.paymentList = [];
        this.dataList = rsp;

        rsp.forEach((elm) => {
          elm.amount = parseFloat(elm.amount.toFixed(2));
          switch (elm.status) {
            case "Approved":
              this.approvedList.push(elm);
              break;
            case "Pending":
              this.pendingList.push(elm);
              break;
            case "Rejected":
              this.rejectedList.push(elm);
              break;
            case "Payment":
              this.paymentList.push(elm);
              break;
            case "Active":
              if (elm.created_by === "System") {
                this.autoDeducList.push(elm);
              } else if (elm.created_by === " System") {
                this.absentDeducList.push(elm);
              } else {
                this.activeList.push(elm);
              }
              break;
            case "Paid":
              this.paidListMain.push(elm);
              break;
          }
        });
      }
      await this.GetPayrollByOrgId();
    } catch (error) {
      console.error("Error fetching payroll adjustments:", error);
    } finally {
      this.spinner.hide();
    }
  }

  paidList = [];
  async changePayrollHistoryMonth(e) {
    console.log(e, "CHECK");
    console.log("paid Main List", this.paidListMain);
    this.paidList = [];
    this.paidListMain.map((elm) => {
      if (e.itemData.id == elm.payroll_id) {
        this.paidList.push(elm);
      }
    });
    console.log("paid List", this.paidList);
  }

  payrollHistoryFrm: FormGroup;

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
    let amtValue = this.AddAdjustmentForm.value;
    if (amtValue && amtValue.amount) {
      this.totalAmount = parseFloat(amtValue.amount.toFixed(2));
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
  }

  singleData;
  apprMarkPaidData: object;
  showDateIncured = false;
  DateIncuredData;
  async viewAdjustmentPay(data) {
    this.showDateIncured = false;
    this.singleData = data;
    console.log(data, "TEST");
    if (this.singleData.doc_url) {
      this.isadjDocUp = true;
    } else {
      this.isadjDocUp = false;
    }
    this.modalService.open(this.adjustmentModel);

    if (this.singleData.approver1_roleId) {
      this.employeeService
        .getRoleNameByroleID({ id: this.singleData.approver1_roleId })
        .subscribe((role1name) => {
          if (role1name) {
            this.singleData.approver1_roleName = role1name[0].role_name;
          }
        });
    }
    if (this.singleData.approver2_roleId) {
      this.employeeService
        .getRoleNameByroleID({ id: this.singleData.approver2_roleId })
        .subscribe((role2name) => {
          if (role2name) {
            this.singleData.approver2_roleName = role2name[0].role_name;
          }
        });
    }
    if (this.singleData.is_approved_1 == true) {
      let postData = {
        id: this.singleData.approver1_emp_id,
      };
      let appr1Data: any = await this.empService
        .getEmployeeByID(postData)
        .toPromise();
      console.log(appr1Data, "appr1Data");
      let emp_name = "";
      if (appr1Data && appr1Data.full_name != "") {
        emp_name = appr1Data.full_name;
        this.singleData["approver1_name"] = emp_name;
      }
    }
    if (this.singleData.is_approved_2 == true) {
      let postData = {
        id: this.singleData.approver2_emp_id,
      };
      let appr1Data: any = await this.empService
        .getEmployeeByID(postData)
        .toPromise();
      console.log(appr1Data, "appr1Data");
      let emp_name = "";
      if (appr1Data && appr1Data.full_name != "") {
        emp_name = appr1Data.full_name;
        this.singleData["approver2_name"] = emp_name;
      }
    }

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
    console.log(data, "TEST END");
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

  singleWaiveoffData;
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
  waiveoffDelete(data) {
    Swal.fire({
      title: "Do you want to Delete the WaiveOff ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        let postData = {
          id: data.id,
          is_deleted: true,
          waive_off_status: "Deleted",
        };

        this.payrollService
          .UpdatePayrollWaiveoffById(postData)
          .subscribe((rsp: any) => {
            if (rsp["result"]["status"] == "200") {
              this.toast.success("Waive Off Added Successfully!");
              this.payrollService
                .runPayrollAutodeduction({ id: this.org_id })
                .subscribe((rep: any) => {
                  if (rep) {
                    this.spinner.hide();
                    this.getList();
                  }
                });
            } else {
              console.log("Something Went worng While Waive Off!");
            }
          });
      }
    });
  }

  editAjustmentPay(data) {
    if (this.addPayrollPaymentsFullAccess) {
      this.singleData = data;
      this.modalService.open(this.apprEditAdjModel);
    } else {
      this.toast.info(
        "Your Dont Have the permission to Edit the Approved Payment!"
      );
    }
  }

  async dashAprRej(data) {
    console.log(this.user_info, "USER INFO");
    console.log(data, " ......s data")
    if (data.doc_url) {
      this.isadjDocUp = true;
    } else {
      this.isadjDocUp = false;
    }
    await this.checkUserRights();

    console.log(this.addPayrollPaymentsFullAccess, "addPayrollPaymentsFullAccess");
    if(data != null) {
      if (
        this.addPayrollPaymentsFullAccess ||
        data.approver1_roleId == this.user_info.role_id ||
        data.approver2_roleId == this.user_info.role_id
      ) {
        this.singleData = data;
        this.modalService.open(this.apradjustmentModel);
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
      } else {
        this.toast.warning(
          "You Dont have the Access to Approve the Adjustment! Contact your Admin"
        );
      }
    }
    
  }

  async aprRejAJ(data) {
    console.log(this.user_info, "USER INFO");
    console.log(data, " ......s data")
    if (data.doc_url) {
      this.isadjDocUp = true;
    } else {
      this.isadjDocUp = false;
    }

    console.log(this.addPayrollPaymentsFullAccess, "addPayrollPaymentsFullAccess");
    if (
      this.addPayrollPaymentsFullAccess ||
      data.approver1_roleId == this.user_info.role_id ||
      data.approver2_roleId == this.user_info.role_id
    ) {
      this.singleData = data;

      if (this.singleData.is_approved_1 == true) {
        let postData = {
          id: this.singleData.approver1_emp_id,
        };
        let appr1Data: any = await this.empService
          .getEmployeeByID(postData)
          .toPromise();
        console.log(appr1Data, "appr1Data");
        let emp_name = "";
        if (appr1Data && appr1Data.full_name != "") {
          emp_name = appr1Data.full_name;
          this.singleData["approver1_name"] = emp_name;
        }
      }
      if (this.singleData.is_approved_2 == true) {
        let postData = {
          id: this.singleData.approver2_emp_id,
        };
        let appr1Data: any = await this.empService
          .getEmployeeByID(postData)
          .toPromise();
        console.log(appr1Data, "appr1Data");
        let emp_name = "";
        if (appr1Data && appr1Data.full_name != "") {
          emp_name = appr1Data.full_name;
          this.singleData["approver2_name"] = emp_name;
        }
      }
      this.modalService.open(this.apradjustmentModel);
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
    } else {
      this.toast.warning(
        "You Dont have the Access to Approve the Adjustment! Contact your Admin"
      );
    }
  }

  aprAJ(data) {
    this.closeModel();
    localStorage.removeItem('adjustmentsData');
    let postData = {
      id: data.id,
      approver_date1: data.approver_date1 ? data.approver_date1 : null,
      approver_date2: data.approver_date2 ? data.approver_date2 : null,
      is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
      is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
      approver1_emp_id: data.approver1_emp_id ? data.approver1_emp_id : null,
      approver2_emp_id: data.approver2_emp_id ? data.approver2_emp_id : null,
      modified_by: this.user_info.id,
      status: data.status,
      paid_date: data.paid_date ? data.paid_date : null,
      is_deleted: false,
    };

    let isDual = false;
    if (data.approver2_roleId) {
      isDual = true;
    }

    if (
      data.approver2_roleId == this.user_info.role_id &&
      data.is_approved_2 == false &&
      data.is_approved_1 == true
    ) {
      postData.approver_date2 = moment().format("L");
      postData.is_approved_2 = true;
      postData.approver2_emp_id = this.user_info.id;
      postData.status = "Approved";
      this.payrollService
        .UpdatePayrollAdjustmentByItemID(postData)
        .subscribe((rsp: any) => {
          if (rsp.status == "200") {
            this.toast.success(rsp.desc);
            this.getList();
            this.markNotificationReaded(data.id);
          } else {
            this.toast.error("Something went Wrong to Update the Adjustment!");
          }
        });
    } else if (
      data.approver1_roleId == this.user_info.role_id &&
      data.is_approved_1 == false &&
      isDual == false
    ) {
      postData.approver_date1 = moment().format("L");
      postData.is_approved_1 = true;
      postData.approver1_emp_id = this.user_info.id;
      postData.status = "Approved";
      this.markNotificationReaded(data.id);
      setTimeout(() => {
        this.payrollService
          .UpdatePayrollAdjustmentByItemID(postData)
          .subscribe((rsp: any) => {
            if (rsp.status == "200") {
              this.toast.success(
                rsp.desc + "Notification is send to Level 2 Approver!"
              );
              this.getList();
            } else {
              this.toast.error(
                "Something went Wrong to Update the Adjustment!"
              );
            }
          });
      }, 1000);
    } else if (
      data.approver1_roleId == this.user_info.role_id &&
      data.is_approved_1 == false &&
      isDual == true
    ) {
      postData.approver_date1 = moment().format("L");
      postData.is_approved_1 = true;
      postData.approver1_emp_id = this.user_info.id;
      postData.status = "Pending";
      this.markNotificationReaded(data.id);
      setTimeout(() => {
        this.payrollService
          .UpdatePayrollAdjustmentByItemID(postData)
          .subscribe((rsp: any) => {
            if (rsp.status == "200") {
              this.toast.success(rsp.desc);
              this.getList();
            } else {
              this.toast.error(
                "Something went Wrong to Update the Adjustment!"
              );
            }
          });
      }, 1000);
    }
    //Here is the Question for the call without 1st approver
    else if (this.addPayrollPaymentsFullAccess) {
      postData.status = "Approved";
      postData.is_approved_2 = true;
      postData.approver_date2 = moment().format("L");
      postData.approver2_emp_id = this.user_info.id;
      this.payrollService
        .UpdatePayrollAdjustmentByItemID(postData)
        .subscribe((rsp: any) => {
          if (rsp.status == "200") {
            this.toast.success(rsp.desc);
            this.getList();
            this.markNotificationReaded(data.id);
          } else {
            this.toast.error("Something went Wrong to Update the Adjustment!");
          }
        });
      console.log(postData, "TEST CHECK POSTDATA")
    } else {
      console.log("You dont Have the Permission for Approving the Adjustment!");
      this.toast.warning(
        "You dont Have the Permission for Approving the Adjustment!"
      );
    }
  }

  rejAJ(data) {
    this.closeModel();
    localStorage.removeItem('adjustmentsData');
    let postData = {
      id: data.id,
      approver_date1: data.approver_date1 ? data.approver_date1 : null,
      approver_date2: data.approver_date2 ? data.approver_date2 : null,
      is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
      is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
      approver1_emp_id: data.approver1_emp_id ? data.approver1_emp_id : null,
      approver2_emp_id: data.approver2_emp_id ? data.approver2_emp_id : null,
      modified_by: this.user_info.id,
      status: "Rejected",
      paid_date: data.paid_date ? data.paid_date : null,
      is_deleted: false,
    };

    this.payrollService
      .UpdatePayrollAdjustmentByItemID(postData)
      .subscribe((rsp: any) => {
        if (rsp.status == "200") {
          this.toast.success("Adjustment Successfully Rejected!");
          this.getList();
          this.markNotificationReaded(data.id);
        }
      });
  }

  editAJ(data) {
    Swal.fire({
      title: "Do you want to Edit this Adjustment?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        //!!! API to edit the adjustment
      }
    });
  }

  delAJ(data) {
    Swal.fire({
      title: "Do you want to Delete this Adjustment?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.modalService.dismissAll();
        this.spinner.show();
        let postData = {
          id: data.id,
          payroll_id: data.payroll_id,
          approver_date1: data.approver_date1
            ? moment(data.approver_date1).format("L")
            : null,
          approver_date2: data.approver_date2
            ? moment(data.approver_date2).format("L")
            : null,
          is_approved_1: data.is_approved_1,
          is_approved_2: data.is_approved_2,
          modified_date: moment(data.modified_date).format("L"),
          modified_by: data.modified_by
            ? moment(data.modified_by).format("L")
            : null,
          status: "Deleted",
          paid_date: data.paid_date ? moment(data.paid_date).format("L") : null,
          is_deleted: true,
          approver1_roleId: data.approver1_roleId,
          approver2_roleId: data.approver2_roleId,
          approver1_emp_id: data.approver1_emp_id,
          approver2_emp_id: data.approver2_emp_id,
          org_id: data.org_id,
          created_by: data.created_by,
        };
        this.payrollService
          .UpdatePayrollAdjustmentByItemID(postData)
          .subscribe((rsp: any) => {
            if (rsp.status == "200") {
              this.spinner.hide();
              this.toast.success(
                "Adjustment Payment has been Deleted successfully"
              );
              this.getList();
            } else {
              this.spinner.hide();
              this.toast.error(
                "Something went Wrong to Update the Adjustment!"
              );
            }
          });
      }
    });
  }

  sendBackToApr(data) {
    Swal.fire({
      title: "Do you want to send back this Adjusment to the Approval Section?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        let postData = {
          id: data.id,
          payroll_id: null,
          approver_date1: data.approver_date1
            ? moment(data.approver_date1).format("L")
            : null,
          approver_date2: data.approver_date2
            ? moment(data.approver_date2).format("L")
            : null,
          is_approved_1: data.is_approved_1,
          is_approved_2: data.is_approved_2,
          modified_date: moment(data.modified_date).format("L"),
          modified_by: data.modified_by
            ? moment(data.modified_by).format("L")
            : null,
          status: "Approved",
          paid_date: data.paid_date ? moment(data.paid_date).format("L") : null,
          is_deleted: false,
          approver1_roleId: data.approver1_roleId,
          approver2_roleId: data.approver2_roleId,
          approver1_emp_id: data.approver1_emp_id,
          approver2_emp_id: data.approver2_emp_id,
          org_id: data.org_id,
          created_by: data.created_by,
        };

        this.payrollService
          .UpdatePayrollAdjustmentByItemID(postData)
          .subscribe((rsp: any) => {
            if (rsp.status == "200") {
              this.toast.success(rsp.desc);
              this.getList();
            } else {
              this.toast.error(
                "Something went Wrong to Update the Adjustment!"
              );
            }
          });
      }
    });
  }

  markPending(data) {
    Swal.fire({
      title: "Do you want to move back the Adjustment to Pending Section?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        let postData = {
          id: data.id,
          approver_date1: null,
          approver_date2: null,
          is_approved_1: false,
          is_approved_2: false,
          approver1_emp_id: null,
          approver2_emp_id: null,
          modified_by: this.user_info.id,
          status: "Pending",
          paid_date: null,
          is_deleted: false,
        };

        if (data.approver2_roleId != null && data.is_approved_1 == true) {
          postData = {
            id: data.id,
            approver_date1: data.approver_date1,
            approver_date2: null,
            is_approved_1: true,
            is_approved_2: false,
            approver1_emp_id: data.approver1_emp_id
              ? data.approver1_emp_id
              : null,
            approver2_emp_id: null,
            modified_by: this.user_info.id,
            status: "Pending",
            paid_date: null,
            is_deleted: false,
          };
        }

        this.payrollService
          .UpdatePayrollAdjustmentByItemID(postData)
          .subscribe((rsp: any) => {
            if (rsp.status == "200") {
              this.toast.success(
                "Adjustment Successfully Moved Back to Pending section!"
              );
              this.getList();
              this.markNotificationReaded(data.id);
            }
          });
      }
    });
  }

  addToPaytable(data) {
    if (this.showPayrollPaymentBtn) {
      Swal.fire({
        title: "Do you want to Add this Adjusment to the Paytable?",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: " Confirm",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.value === true) {
          if (this.isPayrollActive == false) {
            this.toast.warning("Payroll is not active");
            return;
          } else {
            let postData = {
              id: data.id,
              payroll_id: this.activePayrollId,
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
              modified_by: this.user_info.id,
              status: "Active",
              paid_date: data.paid_date ? data.paid_date : null,
              is_deleted: false,
            };

            this.payrollService
              .UpdatePayrollAdjustmentByItemID(postData)
              .subscribe((rsp: any) => {
                if (rsp.status == "200") {
                  this.toast.success(
                    "Assigned the Adjustment to the Active Payroll Table!"
                  );
                  this.getList();
                } else {
                  this.toast.error(
                    "Something Went worng While Assigning the Adjustment!"
                  );
                }
              });
          }
        }
      });
    } else {
      this.toast.info("Please Check the Permission for Assigning Adjustment!");
    }
  }
  voucherData = {};
  MarkVPPaid(data) {
    //!!!for marking Paid
    console.log("This Payment want to mark as Paid!", data);
  }
  async handlePaymentVoucher(res) {
    console.log(res, "DATA ON RES");
    let data: any = this.apprMarkPaidData;
    console.log(data, "ADJUSTMENT DATA");

    if (res.status === "200") {
      let postData = {
        id: data.id,
        payroll_id: "",
        approver_date1: data.approver_date1 ? data.approver_date1 : null,
        approver_date2: data.approver_date2 ? data.approver_date2 : null,
        is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
        is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
        approver1_emp_id: data.approver1_emp_id ? data.approver1_emp_id : null,
        approver2_emp_id: data.approver2_emp_id ? data.approver2_emp_id : null,
        modified_by: this.user_info.id,
        status: "Payment",
        paid_date: data.paid_date ? data.paid_date : null,
        is_deleted: false,
      };

      try {
        this.spinner.show();
        const rsp: any = await this.payrollService
          .UpdatePayrollAdjustmentByItemID(postData)
          .toPromise();
        if (rsp.status === "200") {
          await this.getList();
          this.toast.success("Created payment voucher and added to payments!");
          this.closeModel();
          this.spinner.hide();
        } else {
          this.toast.error(
            "Something went wrong while assigning the adjustment!"
          );
        }
      } catch (error) {
        console.error("Error while updating payroll adjustment:", error);
        this.toast.error(
          "An error occurred while processing the payment voucher."
        );
      }
    }
  }

  MarkApprPaid(data) {
    console.log(data);
    this.apprMarkPaidData = data;
    this.voucherData = {
      amount: data.amount,
      type: "Adjustment",
      reffId: data.id,
    };
    this.modalService.open(this.apprMarkPaidModel, { size: "lg" });
    // this.GetCompanyBankAccountDetails();
    // this.ApprMarkPaidForm = new FormGroup({
    //   reffid: new FormControl("", [Validators.required]),
    //   // empid: new FormControl('', [Validators.required]),
    //   type: new FormControl("", [Validators.required]),
    //   // item: new FormControl('', [Validators.required]),
    //   amount: new FormControl(0, [Validators.required]),
    //   mode: new FormControl(0, [Validators.required]),
    //   // payrollMonth: new FormControl('Pending', [Validators.required]),
    //   dateincurred: new FormControl("", [Validators.required]),
    //   remark: new FormControl(""),
    //   chequeDate: new FormControl(""),
    //   chequeType: new FormControl(""),
    //   additionalDoc: new FormControl(""),
    //   recieptDoc: new FormControl(""),
    //   cheque: new FormControl(""),
    //   empid: new FormControl(""),
    //   debitAcc: new FormControl(""),
    //   accRefId: new FormControl(""),
    // });
    // this.ApprMarkPaidForm.patchValue({
    //   type: data.type,
    //   // , item: data.id
    //   reffid: data.reference_id,
    //   amount: data.amount,
    //   remark: data.remark,
    // });
  }

  selectMode(data) {
    if (data.value === "Cheque") {
      this.showChequeDiv = true;
      this.bankTransfer = false;
    } else if (data.value === "Bank Transfer") {
      this.bankTransfer = true;
      this.showChequeDiv = false;
    } else {
      this.showChequeDiv = false;
      this.bankTransfer = false;
    }
    console.log(data, "MODE OF PAY");
  }

  markNotificationReaded(reff_id) {
    //!!! call the api for removing the approval notification!!!!
    console.log("The Notifications are marked As Readed.");
  }

  async waiveoff(data) {
    if (data.emp_id == this.user_info.id) {
      this.toast.warning("You can't waive off your own Adjustment!");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure you want to waive off this Auto Deduction?",
      html: `<div style="font-size: 16px; margin-bottom: 10px;">Please add Waive Off remarks:</div>`,
      input: "text",
      inputPlaceholder: "Remarks...",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage("Please enter valid remarks");
        }
        return reason;
      },
    });

    if (result.value) {
      const reason = result.value;
      this.spinner.show();
      console.log("Reason for rejection:", reason);

      const res = await this.handleWaveOffData(data, reason);

      if (res) {
        await this.payrollService
          .runPayrollAutodeduction({ id: this.org_id })
          .toPromise();
        await this.getList();
        this.spinner.hide();
        this.toast.success("Waive Off Added Successfully!");
      } else {
        this.spinner.hide();
      }
    }
  }

  async handleWaveOffData(data, reason) {
    const postData = {
      payroll_id: data.payroll_id,
      emp_id: data.emp_id,
      pay_item: data.pay_item,
      type: data.type,
      amount: data.amount,
      date_incurred: data.date_incurred,
      remarks: reason,
      status: data.status,
      org_id: this.org_id,
      waive_off_status: "Active",
      waive_off_created_by: this.user_info.full_name,
    };

    try {
      const rsp = await this.payrollService
        .AddPayrollWaiveoff(postData)
        .toPromise();

      if (rsp["result"]["status"] == "200") {
        return true;
      } else {
        console.log("Something went wrong while adding Waive Off!");
        return false;
      }
    } catch (error) {
      console.error("Error in handleWaveOffData:", error);
      return false;
    }
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

  chequeType(value) {
    if (value === "CDC") {
      this.ApprMarkPaidForm.controls["chequeDate"].disable();
      this.ApprMarkPaidForm.patchValue({
        chequeDate: new Date(),
        chequeType: "CDC",
      });
    } else {
      this.ApprMarkPaidForm.controls["chequeDate"].enable();
      this.ApprMarkPaidForm.patchValue({
        chequeDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        chequeType: "PDC",
      });
    }
  }

  onSelectionChange(e, data) {
    console.log(e, data, "SELEC");
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedWaveOffItems.push(data);
    } else {
      this.selectedWaveOffItems = this.selectedWaveOffItems.filter(
        (item) => item.id !== data.id
      );
    }
    console.log(this.selectedWaveOffItems, "***********");
  }
  async handleAllWaiveOff() {
    if (this.selectedWaveOffItems.length > 0) {
      const ownAdjustment = this.selectedWaveOffItems.some(
        (item) => item.emp_id === this.user_info.id
      );

      if (ownAdjustment) {
        this.toast.warning("You can't waive off your own Adjustment!");
        return;
      }

      const result = await Swal.fire({
        title: "Are you sure you want to waive off all these Auto Deductions?",
        html: `<div style="font-size: 16px; margin-bottom: 10px;">Please add Waive Off remarks:</div>`,
        input: "text",
        inputPlaceholder: "Remarks...",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        preConfirm: (reason) => {
          if (!reason) {
            Swal.showValidationMessage("Please enter valid remarks");
          }
          return reason;
        },
      });

      if (result.value) {
        const reason = result.value;
        this.spinner.show();

        try {
          const results = await Promise.all(
            this.selectedWaveOffItems.map((data) =>
              this.handleWaveOffData(data, reason)
            )
          );
          console.log(results, "Results");

          const allSuccessful = results.every((res) => res);

          if (allSuccessful) {
            this.toast.success("All Waive Offs Added Successfully!");
            await this.payrollService
              .runPayrollAutodeduction({ id: this.org_id })
              .toPromise();
            await this.getList();
          } else {
            this.toast.error("Some Waive Offs could not be processed.");
          }
        } catch (error) {
          console.error("Error during batch waive-off processing:", error);
          this.toast.error("An error occurred during the waive-off process.");
        } finally {
          this.selectedWaveOffItems = [];
          this.selectAllWaiveOff = false;
          this.spinner.hide();
        }
      }
    } else {
      this.toast.warning("No items selected for waive off.");
    }
  }
  toggleSelectAll(e) {
    console.log(e, "Testing!!!");
    this.selectedWaveOffItems = [];
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectAllWaiveOff = true;
      this.selectedWaveOffItems = this.autoAdjGrid.getCurrentViewRecords();
    } else {
      this.selectedWaveOffItems = [];
      this.selectAllWaiveOff = false;
    }
    console.log(this.selectedWaveOffItems, "TEST");
  }
  isItemSelected(data: any): boolean {
    return this.selectedWaveOffItems.some((item) => item.id === data.id);
  }

    public jobNo = "000";
    public prefixString = "";
    showPrefixText = false;
    public prefix_for = "";
    public async GetAdjustmentPrefixByOrgID() {
      try {
        console.log("INSDE!!!")
        // Fetch last added adj prefix
        const data: any = await this.payrollService
          .GetLastAddedAdjustmentPrefixByOrgID({ ID: this.org_id })
          .toPromise();

        if (data.code == "") {
          // Fetch all prefixes
          const prefixes: any = await this.projectService
            .GetAllPrefixByOrgID()
            .toPromise();

          for (let prefix of prefixes) {
            if (prefix.type === "adj") {
              if (prefix.prefix_for === "Default") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  this.prefixString = `${splittable[0]}/${moment().format(
                    "YY"
                  )}/${moment().format("MM")}/0001`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              } else if (prefix.prefix_for === "Custom") {
                this.showPrefixText = true;
              } else if (prefix.prefix_for === "Sequence") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  this.prefixString = `${splittable[0]}/001`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              } else if (prefix.prefix_for === "random") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  const random = Math.floor(1000 + Math.random() * 9000);
                  this.prefixString = `${splittable[0]}/${random}`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              }
            }
          }
        } else {
          let lastAddedPrefix = data.code;

          let lastPrefixNumber =
            parseInt(lastAddedPrefix.split("/").pop() || "0", 10) + 1;

          // Fetch all prefixes
          const prefixes: any = await this.projectService
            .GetAllPrefixByOrgID()
            .toPromise();

          for (let prefix of prefixes) {
            if (prefix.type === "adj") {
              if (prefix.prefix_for === "Default") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  this.prefixString = `${splittable[0]}/${moment().format(
                    "YY"
                  )}/${moment().format("MM")}/${lastPrefixNumber
                    .toString()
                    .padStart(4, "0")}`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              } else if (prefix.prefix_for === "Custom") {
                this.showPrefixText = true;
              } else if (prefix.prefix_for === "Sequence") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  this.prefixString = `${splittable[0]}/${lastPrefixNumber
                    .toString()
                    .padStart(3, "0")}`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              } else if (prefix.prefix_for === "random") {
                const splittable = prefix.prefix_name.split("/");
                const random = Math.floor(1000 + Math.random() * 9000);
                this.prefixString = `${splittable[0]}/${random}`;
                this.prefix_for = prefix.prefix_for;
                return this.prefixString;
              }
            }
          }
        }
      } catch (error) {
        Swal.fire("Error!", error, "error").then(() => { });
      }
      console.log(this.prefixString, "prefixString");
      return this.prefixString;
    }
}
