import { Component, OnInit, ViewChild } from "@angular/core";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { PaymentVoucherService } from "../../services/payment-voucher.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { PayrollService } from "../../services/payroll.service";
import moment = require("moment");
import { AdminSettingService } from "../../services/admin-setting.service";
import { AdministrativeService } from "../../services/administrative.service";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
})
export class PaymentComponent implements OnInit {
  public paymentVoucherGrid: GridComponent;
  @ViewChild("apprMarkPaidModel", { static: false }) apprMarkPaidModel: any;
  user_info = JSON.parse(localStorage.getItem("user_info"));
  org_id=localStorage.getItem("org_id")
  Tabs = [
    { text: "Pending Payment Voucher" },
    { text: "Rejected Payment Voucher" },
    { text: "Approved Payment Voucher" },
    { text: "Deleted Payment Voucher" },
    { text: "Paid" },
  ];
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
  activeTab = "Pending";
  mode = "View";
  activeTabIndex = 0;
  PaymentVouchers = [];
  filteredPaymentVouchers = [];
  pendingVoucherCount = 0;
  approvedVoucherCount = 0;
  voucherData = {};
  showAdditionalInfo = false;
  constructor(
    private paymentVoucherService: PaymentVoucherService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private payrollService: PayrollService,
    private admService: AdministrativeService
  ) { }

  ngOnInit() {
    this.getPaymentVoucherByOrgId();
  }

  onTabChange(e) {
    console.log(e, "CHECK");
    // this.filteredPayroll = [];

    if (e.selectedIndex != null) {
      this.activeTab = this.Tabs[e.selectedIndex].text;
      this.activeTabIndex = e.selectedIndex;

      let status = "";
      if (e.selectedIndex == 0) {
        status = "Pending";
      } else if (e.selectedIndex == 1) {
        status = "Reject";
      } else if (e.selectedIndex == 2) {
        status = "Approved";
      } else if (e.selectedIndex == 3) {
        status = "Delete";
      } else {
        status = "Paid";
      }
      this.updatePaymentVoucherListing(status);

      console.log(this.activeTab, "CHECK");
    }
  }

  async getPaymentVoucherByOrgId() {
    let postData = {
      id: this.user_info.org_id || this.org_id,
    };
    this.PaymentVouchers = [];
    this.pendingVoucherCount = 0;
    this.approvedVoucherCount = 0;

    try {
      const data: any = await this.paymentVoucherService
        .GetPaymentVouchersPaymentsByOrgId(postData)
        .toPromise();

      if (data && data.length > 0) {
        this.PaymentVouchers = data.map((voucher) => {
          voucher.amount = this.formatMoney(voucher.amount);
          if (voucher.status === "Pending") {
            this.pendingVoucherCount++;
          } else if (voucher.status === "Approved") {
            this.approvedVoucherCount++;
          }
          return voucher;
        });
        this.updatePaymentVoucherListing("Pending");

        console.log(this.PaymentVouchers, "this.PaymentVouchers");
      }
    } catch (error) {
      console.error("Error fetching payment vouchers", error);
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
  updatePaymentVoucherListing(status) {
    console.log(status, this.PaymentVouchers, "CHECK");
    this.filteredPaymentVouchers = [];
    if (this.PaymentVouchers.length > 0) {
      this.filteredPaymentVouchers = this.PaymentVouchers.filter(
        (item) => item.status === status
      );
      console.log(this.filteredPaymentVouchers, "this.filteredPaymentVouchers");
    }
    if (this.paymentVoucherGrid) {
      this.paymentVoucherGrid.refresh();
    }
  }
  createPaymentVoucher() {
    this.mode = "Create";
    this.modalService.open(this.apprMarkPaidModel, { size: "lg" });
    this.voucherData = { type: "Payment" };
  }
  async viewPaymentVoucherDetails(voucher) {
    console.log(voucher, "CHECK");
    if (typeof voucher.amount === "string" && voucher.amount.includes(",")) {
      let parsedAmount = parseFloat(voucher.amount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        voucher.amount = parsedAmount;
      } else {
        console.error("Invalid voucher amount: Not a parseable float.");
      }
    } else if (!isNaN(parseFloat(voucher.amount))) {
      voucher.amount = parseFloat(voucher.amount);
    } else {
      console.error("Invalid voucher amount: Not a parseable float.");
    }
    if (voucher.type == 'Final Settlement') {
      await this.GetFinalSettlementByEmpId(voucher.emp_id);
    }
    this.voucherData = voucher;
    this.mode = "View";
    this.modalService.open(this.apprMarkPaidModel, { size: "lg" });
  }
  submitFinalSettlement(data) {
    console.log(data, "CHECK");
  }
  closeModel() {
    this.modalService.dismissAll();
  }
  async handlePaymentVoucher(res) {
    this.spinner.show();
    await this.getPaymentVoucherByOrgId();
    this.closeModel();
    this.spinner.hide();
  }
  handleAdditonalInfo() {
    this.showAdditionalInfo = !this.showAdditionalInfo;
  }
  finalSettlementData = []
  holdSalaryDetails = []
  finalSalary=0
  additionsArr=[];
  deducationsArr=[];
  LeaveCompensation={}
  async GetFinalSettlementByEmpId(emp_id) {
    let postData = {
      ID: emp_id,
    };
    this.finalSettlementData = [];
    this.LeaveCompensation={};
    this.additionsArr=[];
    this.deducationsArr=[];
    this.holdSalaryDetails=[];
    this.finalSalary=0
    let res: any = await this.payrollService
      .GetFinalSettlementByEmpId(postData)
      .toPromise();
    console.log(res, "GET FINAL SETTLEMENT");
    if (res && res.last_work_date) {
      const last_work_date = moment(res.last_work_date).format("L");
      await this.GetFinalSettlementCalDetails(res.emp_id, last_work_date);
      await this.viewSingleEmpRequestFromSettings(emp_id);
      let gratuity = res.detailList.find((i) => i.item == "Gratuity")
      this.gratuityDesc = this.generateDescription(
        res.last_basic_salary,
        res.days_of_service,
        gratuity.amount.toString()
      );
      this.holdSalaryDetails = (res.detailList || []).filter(
        (item) => item.item === 'Hold Salary'
      );

      this.finalSalary = this.holdSalaryDetails.reduce((acc, item) => {
        const amount = parseFloat(item.amount) || 0;
        return acc + amount;
      }, 0);
      this.LeaveCompensation= (res.detailList || []).find((item)=>item.type=='Leave Compensation')
      this.additionsArr=(res.detailList || []).filter((item)=>item.type=='Addition')
      this.deducationsArr=(res.detailList || []).filter((item)=>item.type=='Deduction')
      this.finalSettlementData = res
      console.log(res, "TEST");
      console.log(this.gratuityDesc, 'this.gratuityDesc')
    }
  }
  finalSettlementCalDetails = {}
  async GetFinalSettlementCalDetails(emp_id, end_date) {
    try {
      const postData = {
        emp_id: emp_id,
        end_date_by: "",
        end_date: end_date,
      };

      const response: any = await this.payrollService
        .CalculateFinalSettlement(postData)
        .toPromise();

      if (response && response.length > 0) {
        this.finalSettlementCalDetails = response[0]
        console.log(response, this.finalSettlementCalDetails, "Check***")
        // const settlementData = response[0];
      }
    }
    catch (err) {
      console.log(err, "Error on GetFinalSettlementCalDetails")
    }
  }
  singleEmployeeData = {};

  async viewSingleEmpRequestFromSettings(empid) {
    let postData = { id: empid };
    let userData = await this.admService.FindByEmpID(postData).toPromise();
    if (userData) {
      console.log(userData, "TEST")
      this.singleEmployeeData = userData;
    }

  }
  gratuityDesc = {
    intro: "",
    calculation: "",
    total: "",
  };

  generateDescription(basicSalary, yearsOfService, gratuityTotal) {
    console.log(gratuityTotal, "gratTotal")
    let roundedYearsOfService = yearsOfService.toFixed(2);
    let description = {
      intro: "",
      calculation: "",
      total: ""
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

}




