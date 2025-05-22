import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { LeaveService } from "../../services/leave.service";
import moment = require("moment");
import { PayrollService } from "../../services/payroll.service";
import { ToastrService } from "ngx-toastr";
import { ModuleSetupService } from "../../services/moduleSetup.service";
import { UserService } from "../../services/user.service";
import * as _ from "lodash";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PaymentVoucherService } from "../../services/payment-voucher.service";
import { ProjectService } from "../../services/project.service";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
import { Console } from "console";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-gratuity",
  templateUrl: "./gratuity.component.html",
  styleUrls: ["./gratuity.component.scss"],
})
export class GratuityComponent implements OnInit {
  @Input() data: any;
  constructor(
    private leaveService: LeaveService,
    private payrollService: PayrollService,
    private toast: ToastrService,
    private moduleSetupService: ModuleSetupService,
    private userService: UserService,
    private modalService: NgbModal,
    private paymentVoucherService: PaymentVoucherService,
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
    public router: Router,

  ) { }
  @ViewChild("apprMarkPaidModel", { static: false }) apprMarkPaidModel: any;
  ApprMarkPaidForm: FormGroup;
  user_info = JSON.parse(localStorage.getItem("user_info"));
  custCommonFields: Object = { text: "value", value: "id" };
  isFinalSettlementLoading = false;
  finalSubmitButton = false;
  finalSubmitFullAccess = false;
  createPayrollSectionName = "";
  finalApprover1RoleId = "";
  finalApprover1RoleName = "";
  finalApprover2RoleId = "";
  finalApprover2RoleName = "";
  isfinalDualApprover = false;
  isAccountOwner = false;
  commonModuleName;
  PayrollModuleID = "";
  finalAmount = "";
  leaveCompensationData = {
    totalUnusedLeaves: 0,
    basic_perdaysal: 0,
    totalLeaveCompensation: "",
  };
  additionsOrDeductions = {
    additions: "0",
    deduction: "0",
    total: "0",
  };
  voucherData = {}
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
  ngOnInit() {
    this.handleGratuity();
    this.checkUserRights();
    this.GetFinalSettlementByEmpId();
  }
  senderArr = [];
  companyBankAccDetails = [];
  detailsList = [];
  filteredEmpvariableList = [];
  filteredEmpadjaddList = [];
  filteredEmpadjdeducList = [];
  filteredEmpexpenssList = [];
  filteredEmpLoanAddList = [];
  filteredEmpLoanDeductList = [];
  singleEmployeeData;
  async handleGratuity() {
    try {
      this.isFinalSettlementLoading = true;
      this.filteredEmpadjaddList = this.data.filteredEmpadjaddList || [];
      this.filteredEmpadjdeducList = this.data.filteredEmpadjdeducList || [];
      this.filteredEmpvariableList = this.data.filteredEmpvariableList || [];
      this.filteredEmpLoanAddList = this.data.filteredEmpLoanAddList || [];
      this.filteredEmpLoanDeductList =
        this.data.filteredEmpLoanDeductList || [];
      this.filteredEmpexpenssList = this.data.filteredEmpexpenssList || [];
      this.singleEmployeeData = this.data.singleEmployeeData || {};
      this.detailsList = [];
      await this.handleSinEmpData(this.data.SinEmpData);
      await this.GetLeaveAvailableByEmpId();
      await this.CalculateFinalSettlement();
      await this.CalculateAdditionsOrDeductions();
      this.finalAmount = this.calculateFinalAmount();
      console.log(this.finalAmount, "Final Amount");
    } catch (error) {
      console.error("Error in handling gratuity:", error);
      this.isFinalSettlementLoading = false;
    } finally {
      setTimeout(() => {
        this.isFinalSettlementLoading = false;
      }, 1000);
    }
  }
  isTerminated = false;
  async handleSinEmpData(data) {
    console.log(data, "CHECK");
    if (!data) {
      let res: any = await this.payrollService
        .GetholdPayrollDetailsByEmpId({ id: this.singleEmployeeData.id })
        .toPromise();
      if (res && res.length > 0) {
        this.SinEmpData = res[0];
      }
    }
  }

  async CalculateAdditionsOrDeductions(): Promise<void> {
    return new Promise((resolve) => {
      let additions = 0;
      let deductions = 0;

      const additionItems = [
        ...this.data.filteredEmpadjaddList,
        ...this.data.filteredEmpvariableList,
        ...this.data.filteredEmpLoanAddList,
        ...this.data.filteredEmpexpenssList,
      ].filter((item) => item);

      if (additionItems.length > 0) {
        additionItems.forEach((item) => {
          this.detailsList.push({
            item: "Adjustment",
            item_detail: item.pay_item,
            amount: item.amount,
            item_reff_id: item.id,
            remarks: item.remarks,
            status: item.status,
            is_deleted: false,
            type: "Addition",
          });
        });
        additions = additionItems.reduce((acc, item) => acc + item.amount, 0);
        this.additionsOrDeductions.additions = this.formatMoney(additions);
      }

      const deductionItems = [
        ...this.data.filteredEmpadjdeducList,
        ...this.data.filteredEmpLoanDeductList,
      ].filter((item) => item);

      if (deductionItems.length > 0) {
        deductionItems.forEach((item) => {
          this.detailsList.push({
            item: "Deduction",
            item_detail: item.pay_item,
            amount: item.amount,
            item_reff_id: item.id,
            remarks: item.remarks,
            status: item.status,
            is_deleted: false,
            type: "Deduction",
          });
        });
        deductions = deductionItems.reduce((acc, item) => acc + item.amount, 0);
        this.additionsOrDeductions.deduction = this.formatMoney(deductions);
      }

      if (
        this.additionsOrDeductions.additions &&
        this.additionsOrDeductions.deduction
      ) {
        this.additionsOrDeductions.total = this.formatMoney(
          additions - deductions
        );
      }

      resolve(); // Resolve the promise once calculations are done
    });
  }


  calculateFinalAmount() {
    const gratuityTotal = this.gtData.gratuity_total || 0;
    this.detailsList.push({
      item: "Gratuity",
      item_detail: "Gratuity",
      amount: gratuityTotal,
      item_reff_id: "string",
      remarks: "Gratuity",
      status: "string",
      is_deleted: false,
      type: "Gratuity",
    });
    const additions =
      parseFloat(this.additionsOrDeductions.total.replace(/,/g, "")) || 0;
    const leaveCompensation =
      parseFloat(
        this.leaveCompensationData.totalLeaveCompensation.replace(/,/g, "")
      ) || 0;
    const finalSalary = parseFloat(this.finalSalary.replace(/,/g, "")) || 0;

    const finalAmount =
      gratuityTotal + additions + leaveCompensation + finalSalary;
    return this.formatMoney(finalAmount);
  }
  holdDetails = [];
  finalSalary = "";

  async CalculateFinalSettlement() {
    try {
      const todaysDate = moment(new Date()).format("L");
      this.leaveCompensationData.basic_perdaysal = 0;
      this.holdDetails = [];
      let term_end_date = this.singleEmployeeData.term_end_date
        ? moment(this.singleEmployeeData.term_end_date).format("L")
        : "";
      this.isTerminated = term_end_date ? true : false;
      const postData = {
        emp_id: this.singleEmployeeData.id,
        end_date_by: "",
        end_date: term_end_date ? term_end_date : todaysDate,
      };

      const response: any = await this.payrollService
        .CalculateFinalSettlement(postData)
        .toPromise();

      if (response && response.length > 0) {
        const settlementData = response[0];

        if (settlementData.status === "Eligible") {
          this.gtData = settlementData;
          this.leaveCompensationData.basic_perdaysal = parseFloat(
            settlementData.basic_perdaysal
          );

          const totalLeaveCompensation =
            this.leaveCompensationData.totalUnusedLeaves *
            this.leaveCompensationData.basic_perdaysal;
          this.leaveCompensationData.totalLeaveCompensation = this.formatMoney(
            totalLeaveCompensation
          );
          this.detailsList.push({
            item: "Leave Compensation",
            item_detail: "Leave Compensation",
            amount: totalLeaveCompensation,
            item_reff_id: "string",
            remarks: `${this.leaveCompensationData.totalUnusedLeaves} at ${this.leaveCompensationData.basic_perdaysal}`,
            status: "string",
            is_deleted: false,
            type: "Leave Compensation",
          });

          const holdDetails = JSON.parse(settlementData.payrolldetailsarray);

          if (holdDetails && holdDetails.length > 0) {
            const holdSum = holdDetails.reduce(
              (acc, item) => acc + item.netpayable,
              0
            );

            holdDetails.forEach((item) => {
              this.detailsList.push({
                item: "Hold Salary",
                item_detail: item.name,
                amount: item.netpayable,
                item_reff_id: item.id,
                remarks: "Hold Salary",
                status: "string",
                is_deleted: false,
                type: "Hold Salary",
                on_hold: item.on_hold
              });
              item.netpayable = this.formatMoney(item.netpayable);
            });

            this.finalSalary = this.formatMoney(holdSum);
            this.holdDetails = holdDetails;

            this.gratuityDesc = this.generateDescription(
              settlementData.basicsalary,
              settlementData.year_of_service,
              settlementData.gratuity_total
            );
          } else {
            this.finalSalary = "0.00";
          }
        } else if (settlementData.status === "Not Eligible") {
          this.toast.error("The employee is not eligible for Gratuity");
        }
      }
    } catch (error) {
      this.toast.error(
        "An error occurred while calculating the final settlement. Please try again later."
      );
    }
  }
  EligibleGratuityLeaves = [];
  async GetLeaveAvailableByEmpId() {
    this.leaveCompensationData.totalUnusedLeaves = 0;
    this.EligibleGratuityLeaves = [];
    this.leaveService
      .getEmpLeaveAvailableByOrgId(this.data.singleEmployeeData.id)
      .subscribe((rsp: any) => {
        if (rsp) {
          let eligibleLeaves = rsp.filter(
            (elm) => elm.is_unused_leave_eligible
          );
          if (eligibleLeaves.length > 0) {
            eligibleLeaves.forEach((element) => {
              this.EligibleGratuityLeaves.push({
                leaveName: element.leave_name,
                entitledLeaveDays: parseFloat(element.entitled_leave_days),
                availableLeaveDays: parseFloat(element.available_leave_days),
              });
              this.leaveCompensationData.totalUnusedLeaves += parseFloat(
                element.available_leave_days
              );
            });
          }
          console.log("rsp", this.EligibleGratuityLeaves, rsp);
        }
      });
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
        ` 30 days / 360 days * Basic Salary * ${roundedYearsOfService - 5
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
  getDuration(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      let previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += previousMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} years, ${months} months, and ${days} days`;
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

  handleSubmitFinalSettlement() {
    this.voucherData = {
      amount: this.finalAmount.replace(/,/g, ''),
      mode: "Cheque", type: "Final Settlement",
    }
    this.MarkApprPaid();
    console.log("Final Settlement Submitted");
  }
  // captureFormData(data: any) {
  //   console.log(data,"TEST")
  //   this.submitFinalSettlement(data);
  // }
  async submitFinalSettlement(data) {
    let gratuity = this.gtData;
    let total_amount = this.finalAmount.replace(/,/g, '')
    let postData = {
      org_id: this.singleEmployeeData.org_id,
      emp_id: this.singleEmployeeData.id,
      last_basic_salary: gratuity.basicsalary,
      days_of_service: gratuity.year_of_service,
      join_date: gratuity.joined_date,
      last_work_date: this.isTerminated
        ? this.singleEmployeeData.term_end_date
        : this.gtData.end_date,
      status: "string",
      voucher_status: "string",
      voucher_id: "string",
      total_amount: parseFloat(total_amount),
      is_deleted: false,
      created_by: this.user_info.full_name,
      modifed_by: this.user_info.full_name,
      detailList: this.detailsList,
    };

    if (this.finalSubmitFullAccess) {
      postData.status = "Approved";
    } else {
      postData.status = "Pending";
      postData["approver1_roleId"] = this.finalApprover1RoleId;
      if (this.isfinalDualApprover) {
        postData["approver2_roleId"] = this.finalApprover2RoleId;
      }
    }

    try {
      this.spinner.show();
      console.log(postData, "Post Data");

      let finalRes: any = await this.payrollService
        .AddFinalSettlement(postData)
        .toPromise();
      console.log(finalRes, "Final Settlement Added");

      if (finalRes.result && finalRes.result.status == "200") {
        let res: any = await this.generatePaymentVoucher(finalRes.result.code, data);
        console.log(res, "PAYMENT VOUCHER");
        if (res.status == "200") {
          console.log("Voucher Generated Successfully");
          await this.GetFinalSettlementByEmpId();
          this.closeModel();
          this.toast.success("Final Settlement submitted successfully.");
        }
      }
    } catch (error) {
      console.error("Error submitting final settlement:", error);
      Swal.fire(
        "Error!",
        "Something went wrong while submitting final settlement.",
        "error"
      );
    } finally {
      this.spinner.hide();
    }
  }

  checkUserRights() {
    this.user_info = JSON.parse(localStorage.getItem("user_info"));

    console.log(this.isAccountOwner, "CHECK ACC OWNER");
    if (this.isAccountOwner) {
      this.finalSubmitButton = true;
      this.finalSubmitFullAccess = true;
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
                    this.finalSubmitButton = true;
                    this.createPayrollSectionName = elm.section_name;
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
    this.moduleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe((data: any) => {
      //add edit
      data.map((elm) => {
        if (elm.section_name === this.createPayrollSectionName) {
          console.log(elm);
          if (elm.is_full_access) {
            this.finalSubmitFullAccess = true;
          } else {
            this.finalSubmitFullAccess = false;
            if (elm.approver1_roleId !== null) {
              this.finalApprover1RoleId = elm.approver1_roleId;
              this.finalApprover1RoleName = elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.isfinalDualApprover = true;
                this.finalApprover2RoleId = elm.approver2_roleId;
                this.finalApprover2RoleName = elm.approver2_role_name;
              }
            }
          }
        }
      });
    });
  }
  async MarkApprPaid() {
    this.modalService.open(this.apprMarkPaidModel, { size: "lg" });
  }


  async generatePaymentVoucher(finalSettlementId, formData) {
    console.log("Generating Payment Voucher", finalSettlementId);
    let data = formData;
    let paymentVoucher = {
      voucher_id: data.reffid,
      amount: parseFloat(data.amount.replace(/,/g, "")),
      method: data.mode,
      dateincurred: data.dateincurred,
      remarks: data.remark,
      chequeDate: data.chequeDate,
      cheque_type: data.chequeType,
      confirmCollection: data.confirmCollection,
      additional_doc: data.additionalDoc,
      reciept_doc: data.recieptDoc,
      cheque_doc: data.cheque,
      benf_type: data.beneficiaryType,
      acc_debit_id: data.debitAcc,
      wps_provider_id: data.beneficiaryAcc,
      acc_ref_id: data.accRefId,
      empList: data.empList,
      emp_count: data.empCount,
      paidby_emp_id: data.paidByEmpId,
      singlePaymentMethod: true,
      status: data.status,
      org_id: this.user_info.org_id,
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
      payroll_id: finalSettlementId,
      type: "Final Settlement",
      emp_id: this.singleEmployeeData.id,
    };
    console.log(paymentVoucher, "POSTDATA");
    if (this.finalSubmitFullAccess) {
      paymentVoucher.status = "Approved";
    } else {
      paymentVoucher.status = "Pending";
      paymentVoucher["approver1_roleId"] = this.finalApprover1RoleId;
      if (this.isfinalDualApprover) {
        paymentVoucher["approver2_roleId"] = this.finalApprover2RoleId;
      }
    }
    let postData = {
      org_id: this.user_info.org_id,
      payment_vouchers: [paymentVoucher],
    };
    console.log(postData, "POST DATA VOUCHER");
    let response = await this.paymentVoucherService
      .AddPaymentVoucherDetails(postData)
      .toPromise();
    return response;
  }
  closeModel() {
    this.modalService.dismissAll();
  }
  finalSettementDone = false;
  async GetFinalSettlementByEmpId() {
    let postData = {
      ID: this.singleEmployeeData.id,
    };
    let res: any = await this.payrollService
      .GetFinalSettlementByEmpId(postData)
      .toPromise();
    console.log(res, "GET FINAL SETTLEMENT");
    if (res && res.created_date) {
      console.log(res, "TEST");
      this.finalSettementDone = true;
    } else {
      this.finalSettementDone = false;
    }
  }
  addAdjustment() {
    this.router.navigate(["Payroll/adjustments"], { queryParams: { id: this.singleEmployeeData.id } });
  }

}
