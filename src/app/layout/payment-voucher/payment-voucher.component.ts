import { Component, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import moment = require("moment");
import Swal from "sweetalert2";
import { PaymentVoucherService } from "../../services/payment-voucher.service";
import { ProjectService } from "../../services/project.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { PayrollService } from "../../services/payroll.service";
import { EmployeeService } from "../../services/employee.service";
import { EventEmitter } from "@angular/core";
import { settingsService } from "../../services/settings.service";
import { ModuleSetupService } from "../../services/moduleSetup.service";
import { UserService } from "../../services/user.service";
import * as _ from "lodash";
@Component({
  selector: "app-payment-voucher",
  templateUrl: "./payment-voucher.component.html",
  styleUrls: ["./payment-voucher.component.scss"],
})
export class PaymentVoucherComponent implements OnInit {
  @Input() voucherData: any;
  @Input() mode: any;
  @Output() formDataEmitter = new EventEmitter<any>();
  user_info = JSON.parse(localStorage.getItem("user_info"));
  org_id = this.user_info.org_id !== null ? this.user_info.org_id : localStorage.getItem('org_id');
  isAccountOwner = this.user_info.is_superadmin;
  activeEmpCommonFields: Object = { text: "text", value: "id" };
  commonFields: Object = { text: "value", value: "id" };
  ApprMarkPaidForm: FormGroup;
  paymentForm: FormGroup;
  bankAccountForm: FormGroup;
  senderArr = [];
  companyBankAccDetails = [];
  recepientArr = [];
  showEmployeeData = false;
  showChequeDiv = false;
  bankTransfer = false;
  finalAmount = "";
  prefixString = "";
  public jobNo = "000";
  showPrefixText = false;
  isVoucherLoading = false;
  addProvisionalBankAcc = false;
  isViewMode = false;
  isAmountDisabled = true;
  isActionable = false;
  isCreateMode = false;
  isMarkPaid = false;
  isPaid=false;
  PayrollModuleID = "";
  createPayrollSectionName = "";
  payrollSubmitButton = false;
  payrollSubmitFullAccess = false;
  payrollApprover1RoleId = "";
  payrollApprover1RoleName = "";
  payrollApprover2RoleId = "";
  payrollApprover2RoleName = "";
  isPayrollDualApprover = false;
  commonModuleName;

  showBankAccModal = false;
  public prefix_for = "";
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
  paymentModeArr = [
    {
      id: "Bank Transfer",
      value: "Bank Transfer",
    },
    {
      id: "Cash",
      value: "Cash",
    },
    {
      id: "Cheque",
      value: "Cheque",
    },
  ];
  beneficiaryType = [
    {
      id: "Individual Account",
      value: "Individual Account",
    },
    {
      id: "Provisional Account",
      value: "Provisional Account",
    },
  ];
  constructor(
    private paymentVoucherService: PaymentVoucherService,
    private settingsService: settingsService,
    private projectService: ProjectService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private payrollService: PayrollService,
    private empService: EmployeeService,
    private formBuilder: FormBuilder,
    private ModuleSetupService: ModuleSetupService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.initializePaymentForm();
    this.createPaymentVoucher();
    this.checkUserRights();
    console.log(this.voucherData, "this.voucherData");
  }
  emitFormData(data) {
    console.log("Emitting form data:", data);
    this.formDataEmitter.emit(data);
  }
  async handleSubmitPaymentVoucher() {
    if (this.ApprMarkPaidForm.valid) {
      this.ApprMarkPaidForm.controls["chequeDate"].enable();
      let data = this.ApprMarkPaidForm.value;
      if (this.voucherData.type == "Final Settlement") {
        this.emitFormData(data);
      } else {
        let res = await this.generatePaymentVoucher(
          this.voucherData.reffId,
          data,
          this.voucherData.type
        );
        console.log(res, "PAY VOCU");
        this.formDataEmitter.emit(res);
      }
    } else {
      this.toast.error("Please fill all the required fields");
    }
  }

  async createPaymentVoucher() {
    this.isVoucherLoading = true;
    await this.GetCompanyBankAccountDetails();
    await this.getActiveEmployeeList();
    await this.GetCompanyBankAccountDetails();
    await this.GetindividualBankAccDetailsDetails();
    await this.GetEmployeeBankDetailsByorgId();
    let amount = parseFloat(this.voucherData.amount);
    let formattedAmount = this.formatMoney(amount);
    if (this.mode && this.mode == "View") {
      console.log(this.mode, "TST");
      this.setViewModeData(formattedAmount);
      this.isViewMode = true;
      this.isAmountDisabled = true;
      this.isCreateMode = false;
      if (this.voucherData.status == "Pending") {
        this.isActionable = true;
      }
      if (this.voucherData.status == "Approved") {
        this.isMarkPaid = true;
        this.paymentForm.patchValue({
          id: this.voucherData.id
        });
      }
      if(this.voucherData.status=="Paid"){
        this.isMarkPaid=true;
        this.isPaid=true;
        this.paymentForm.patchValue({
          receiptNumber:this.voucherData.reciept_number,
          receiptDocument:this.voucherData.reciept_document,
          date:this.voucherData.reciept_date,
          remarks:this.voucherData.remarks
        })
        this.paymentForm.disable()
      }
    } else if (this.mode && this.mode == "Create") {
      await this.GetLastAddedProjectPrefixByOrgID();
      this.ApprMarkPaidForm.patchValue({
        reffid: this.prefixString,
        type: this.voucherData.type,
        beneficiaryType: "Individual Account",
        mode: "Cheque",
      });
      this.isCreateMode = true;
      this.isAmountDisabled = false;
      this.isViewMode = false;
    } else if (this.mode && this.mode == "Create with amount") {
      await this.GetLastAddedProjectPrefixByOrgID();
      this.ApprMarkPaidForm.patchValue({
        reffid: this.prefixString,
        type: this.voucherData.type,
        beneficiaryType: "Individual Account",
        mode: "Cheque",
        amount: formattedAmount,
      });
      this.isCreateMode = true;
      this.isViewMode = false;
      this.isAmountDisabled = true;
    } else {
      await this.GetLastAddedProjectPrefixByOrgID();
      this.ApprMarkPaidForm.patchValue({
        amount: formattedAmount,
        reffid: this.prefixString,
      });
      this.isAmountDisabled = true;
    }
    console.log(this.isAmountDisabled, "this.isAmountDisabled");
    console.log(this.activeEmpList, "ACTIVEMP***")
    this.isVoucherLoading = false;
  }
  async setViewModeData(formattedAmount) {
    let data = {
      amount: formattedAmount,
      debitAcc: this.voucherData.acc_debit_id,
      reffid: this.voucherData.voucher_id,
      type: this.voucherData.type,
      mode: this.voucherData.method,
      dateincurred: this.voucherData.created_date,
      remark: this.voucherData.remarks,
      chequeDate: this.voucherData.chequeDate,
      chequeType: this.voucherData.cheque_type,
      additionalDoc: this.voucherData.additional_doc,
      recieptDoc: this.voucherData.receipt_doc,
      cheque: this.voucherData.cheque_doc,
      empid: this.voucherData.emp_id,
      accRefId: this.voucherData.acc_ref_id,
      beneficiaryType: this.voucherData.benf_type,
      chequeNumber: this.voucherData.chequeNumber
    };
    this.ApprMarkPaidForm.patchValue(data);
    this.ApprMarkPaidForm.disable();
    if (this.voucherData.approver1_roleId) {
      this.empService
        .getRoleNameByroleID({ id: this.voucherData.approver1_roleId })
        .subscribe((role1name) => {
          if (role1name) {
            this.voucherData.approver1_roleName = role1name[0].role_name;
          }
        });
    }
    if (this.voucherData.approver2_roleId) {
      this.empService
        .getRoleNameByroleID({ id: this.voucherData.approver2_roleId })
        .subscribe((role2name) => {
          if (role2name) {
            this.voucherData.approver2_roleName = role2name[0].role_name;
          }
        });
    }
    if (this.voucherData.is_approved_1 == true) {
      let postData = {
        id: this.voucherData.approver1_emp_id,
      };
      let appr1Data: any = await this.empService
        .getEmployeeByID(postData)
        .toPromise();
      console.log(appr1Data, "appr1Data");
      let emp_name = "";
      if (appr1Data && appr1Data.full_name != "") {
        emp_name = appr1Data.full_name;
        this.voucherData["approver1_name"] = emp_name;
      }
    }
    if (this.voucherData.is_approved_2 == true) {
      let postData = {
        id: this.voucherData.approver2_emp_id,
      };
      let appr1Data: any = await this.empService
        .getEmployeeByID(postData)
        .toPromise();
      console.log(appr1Data, "appr1Data");
      let emp_name = "";
      if (appr1Data && appr1Data.full_name != "") {
        emp_name = appr1Data.full_name;
        this.voucherData["approver2_name"] = emp_name;
      }
    }
  }
  async initializeForm() {
    this.ApprMarkPaidForm = new FormGroup({
      reffid: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      // item: new FormControl('', [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
      mode: new FormControl(0, [Validators.required]),
      dateincurred: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
      chequeDate: new FormControl(""),
      chequeType: new FormControl(""),
      additionalDoc: new FormControl(""),
      recieptDoc: new FormControl(""),
      cheque: new FormControl(""),
      empid: new FormControl(""),
      debitAcc: new FormControl(""),
      accRefId: new FormControl(""),
      beneficiaryType: new FormControl(""),
      paidBy: new FormControl(""),
      chequeNumber: new FormControl(""),
    });
  }
  initializePaymentForm() {
    this.paymentForm = this.formBuilder.group({
      receiptNumber: ["", Validators.required],
      receiptDocument: ["", Validators.required],
      remarks: [""],
      date: ["", Validators.required],
      id: [""],
    });
  }
  async GetCompanyBankAccountDetails() {
    const postData = {
      mode: "Bank Transfer",
      org_id: this.org_id,
      is_company: true,
      mode_type: "finance",
    };

    try {
      const data: any = await this.paymentVoucherService
        .GetPaymentModeDetailsByMode(postData)
        .toPromise();

      this.companyBankAccDetails = [];
      this.senderArr = [];

      data.forEach((details: any) => {
        this.companyBankAccDetails.push(details);
        this.senderArr.push({
          id: details.id,
          value: details.nick_name,
        });
      });
    } catch (error) {
      console.error("Error fetching company bank account details:", error);
    }
  }
  checkUserRights() {
    this.user_info = JSON.parse(localStorage.getItem("user_info"));

    console.log(this.isAccountOwner, "CHECK ACC OWNER");
    if (this.isAccountOwner) {
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
                // if (elm.section_name === "View PayRoll") {
                //   if (elm.is_allow === true) {
                //     this.accessToPage = true;
                //   }
                // }
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

  public async GetLastAddedProjectPrefixByOrgID() {
    try {
      // Fetch the last added voucher prefix
      const data: any = await this.paymentVoucherService
        .GetLastAddedVoucherPrefixByOrgID({ ID: this.org_id })
        .toPromise();

      const prefixes: any = await this.projectService
        .GetAllPrefixByOrgID()
        .toPromise();

      for (let i = 0; i < prefixes.length; i++) {
        if (prefixes[i].type === "pv") {
          let splittable;
          if (prefixes[i].prefix_for === "Default" && prefixes[i].prefix_name) {
            let prefix_name = prefixes[i].prefix_name;
            splittable = prefix_name.split("/");

            // Determine the numeric part to increment
            let lastNumber = data.code
              ? parseInt(data.code.split("/").pop(), 10)
              : parseInt(splittable[3], 10) || 0;

            // Increment the number and format it
            let incrementedNumber = lastNumber + 1;
            let formattedNumber = incrementedNumber.toString().padStart(4, "0");

            this.prefixString = `${splittable[0]}/${moment().format(
              "YY"
            )}/${moment().format("MM")}/${formattedNumber}`;
            this.prefix_for = prefixes[i].prefix_for;
          } else if (prefixes[i].prefix_for === "Custom") {
            this.showPrefixText = true;
          } else if (
            prefixes[i].prefix_for === "Sequence" &&
            prefixes[i].prefix_name
          ) {
            let prefix_name = prefixes[i].prefix_name;
            splittable = prefix_name.split("/");

            // Determine the numeric part to increment
            let lastNumber = data.code
              ? parseInt(data.code.split("/").pop(), 10)
              : parseInt(splittable[1], 10) || 0;

            // Increment the number and format it
            let incrementedNumber = lastNumber + 1;
            let formattedNumber = incrementedNumber.toString().padStart(4, "0");

            this.prefixString = `${splittable[0]}/${formattedNumber}`;
            this.prefix_for = prefixes[i].prefix_for;
          } else if (
            prefixes[i].prefix_for === "random" &&
            prefixes[i].prefix_name
          ) {
            let prefix_name = prefixes[i].prefix_name;
            splittable = prefix_name.split("/");
            let random = Math.floor(1000 + Math.random() * 9000);
            this.prefixString = `${splittable[0]}/${random}`;
            this.prefix_for = prefixes[i].prefix_for;
          }
        }
      }
    } catch (error) {
      Swal.fire("Error!", error, "error").then(() => { });
    }
  }
  activeEmpList = [];
  async getActiveEmployeeList() {
    const postData = { id: this.org_id };
    this.activeEmpList = [];

    try {
      const rsp: any = await this.payrollService
        .getActiveEmployeeListByOrgID(postData)
        .toPromise();

      if (rsp) {
        this.activeEmpList = rsp.map((emp: any) => ({
          id: emp.id,
          text: emp.full_name,
          emp_code: emp.emp_code,
        }));
      }
    } catch (error) {
      console.error("Error fetching active employee list:", error);
    }
  }

  selectedemployeeData = {};
  individualBankAccDetails = [];
  employeeBankAccDetails = [];
  getUserDetailsByEmpId() {
    let id = this.ApprMarkPaidForm.get("empid").value;
    this.selectedemployeeData = {};
    console.log(id, this.employeeBankAccDetails, "SELECTED empId");
    if (id) {
      let userData = this.employeeBankAccDetails.find((i) => i.emp_id == id);
      console.log(userData, "TESTING USERDATA")
      if (
        userData.bank_account_num &&
        userData.bank_account_num != null &&
        userData.bank_account_num != ""
      ) {
        this.selectedemployeeData = userData;
        this.showEmployeeDataFun();
        console.log(this.selectedemployeeData, "this.selectedemployeeData!");
      } else {
        this.toast.error(
          "Invalid bank details,Please update the banks details of the selected employee!"
        );
      }
    }
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
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }
  showEmployeeDataFun() {
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
  async GetindividualBankAccDetailsDetails() {
    const postData = {
      mode: "Bank Transfer",
      org_id: this.org_id,
      is_company: false,
      mode_type: "individual",
      is_wps: true,
      is_common: true,
    };

    try {
      this.individualBankAccDetails = [];
      const data: any = await this.paymentVoucherService
        .GetPaymentModeDetailsByMode(postData)
        .toPromise();

      data.forEach((details: any) => {
        this.individualBankAccDetails.push(details);
        this.recepientArr.push({
          id: details.id,
          value: details.nick_name,
        });
      });

      console.log(this.individualBankAccDetails, "*********");
    } catch (error) {
      console.error("Error fetching individual bank account details:", error);
    }
  }

  async GetEmployeeBankDetailsByorgId() {
    const postData = { OrgId: this.org_id };

    try {
      this.employeeBankAccDetails = [];
      // this.activeEmpList = [];
      const data: any = await this.empService
        .GetEmployeeBankDetailsByorgId(postData)
        .toPromise();

      if (data && data.length > 0) {
        data.forEach((emp: any) => {
          this.employeeBankAccDetails.push(emp);
          // this.activeEmpList.push({
          //   id: emp.emp_id,
          //   text: emp.name,
          //   emp_code: emp.emp_code,
          // });
        });
      }
    } catch (error) {
      console.error("Error fetching employee bank details:", error);
    }
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
  closeBankAccModal() {
    // console.log(this.childModalRef, "closedchildModalRef");
    // if (this.childModalRef) {
    //   this.childModalRef.close();
    //   this.addProvisionalBankAcc = false;
    // }
    this.showBankAccModal = false;
    this.addProvisionalBankAcc = false;
  }
  showSelectedBankAccDetails(type) {
    this.spinner.show();
    try {
      this.initializeBankAccountForm();
      let acc_id = this.ApprMarkPaidForm.get("debitAcc").value;
      // console.log(this.ApprMarkPaidForm.getRawValue(),"******")
      let selectedDetails = this.companyBankAccDetails.find(
        (i) => i.id == acc_id
      );
      if (type == "sender") {
        acc_id = this.ApprMarkPaidForm.get("debitAcc").value;
        selectedDetails = this.companyBankAccDetails.find(
          (i) => i.id == acc_id
        );
      } else {
        acc_id = this.ApprMarkPaidForm.get("beneficiaryAcc").value;
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
  approvePaymentVoucher() { }
  handleRejectPaymentVoucher() { }
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
            case "reciept":
              this.ApprMarkPaidForm.patchValue({
                recieptDoc: imData.secure_url,
              });
              break;
            case "additionalDoc":
              this.ApprMarkPaidForm.patchValue({
                additionalDoc: imData.secure_url,
              });
              break;
            case "receiptDocument":
              this.paymentForm.patchValue({
                receiptDocument: imData.secure_url
              })
              break;

            default:
              console.error("Unhandled type:", type);
          }

          this.spinner.hide();
        }
      });
    }
  }
  async generatePaymentVoucher(refId, formData, type) {
    console.log("Generating Payment Voucher", refId);
    console.log(formData, "TEST FINAL DATA")
    let data = formData;

    let paymentVoucher = {
      voucher_id: data.reffid,
      amount: parseFloat(data.amount.replace(/,/g, "")),
      method: data.mode,
      dateincurred: data.dateincurred,
      remark: data.remark,
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
      payroll_id: refId,
      type: type,
      emp_id: data.emp_id,
    };
    console.log(paymentVoucher, "POSTDATA");
    if (this.payrollSubmitFullAccess) {
      paymentVoucher.status = "Approved";
    } else {
      paymentVoucher.status = "Pending";
      paymentVoucher["approver1_roleId"] = this.payrollApprover1RoleId;
      if (this.isPayrollDualApprover) {
        paymentVoucher["approver2_roleId"] = this.payrollApprover2RoleId;
      }
    }
    console.log(paymentVoucher, "POST DATA VOUCHER");
    let response = await this.paymentVoucherService
      .AddPaymentVoucherDetailsCommon(paymentVoucher)
      .toPromise();
    return response;
  }
  async handleUpdatePaymentVoucher(status) {
    let data = this.ApprMarkPaidForm.value;
    this.spinner.show();
    let postData = {
      id: this.voucherData.id,
      remarks: data.remark,
      status: status,
      modified_by: this.user_info.full_name,
      approver1_emp_id: this.voucherData.approver1_emp_id,
      approver2_emp_id: this.voucherData.approver2_emp_id,
      approver1_roleId: this.voucherData.approver1_roleId,
      approver2_roleId: this.voucherData.approver2_roleId,
      approver_date1: this.voucherData.approver_date1,
      approver_date2: this.voucherData.approver_date2,
      is_approved_1: this.voucherData.is_approved_1,
      is_approved_2: this.voucherData.is_approved_2,
      is_reverted: this.voucherData.is_reverted,
    };
    try {
      switch (status) {
        case "Approved":
          if (
            postData.approver2_roleId == this.user_info.role_id &&
            postData.is_approved_2 == false &&
            postData.is_approved_1 == true
          ) {
            postData.approver_date2 = moment().format("L");
            postData.is_approved_2 = true;
            postData.approver2_emp_id = this.user_info.id;
            postData.status = "Approved";
            await this.updatePaymentVoucher(postData);
          } else if (
            postData.approver1_roleId == this.user_info.role_id &&
            postData.is_approved_1 == false
          ) {
            postData.approver_date1 = moment().format("L");
            postData.is_approved_1 = true;
            postData.approver1_emp_id = this.user_info.id;
            postData.status = "Pending";
            await this.updatePaymentVoucher(postData);
          } else if (this.payrollSubmitFullAccess) {
            postData.status = "Approved";
            postData.is_approved_2 = true;
            postData.approver_date2 = moment().format("L");
            postData.approver2_emp_id = this.user_info.id;
            await this.updatePaymentVoucher(postData);
          } else {
            console.log(
              "You don't have the permission for approving the payment voucher!"
            );
            this.toast.warning(
              "You don't have the permission for approving the payment voucher!"
            );
          }
          console.log(postData, "POSTDATA");
          break;
      }
    } catch (error) {
      console.error("Error updating payment voucher:", error);
      this.toast.error(
        "An error occurred while updating the payment voucher. Please try again later."
      );
    } finally {
      this.spinner.hide();
    }
  }

  async updatePaymentVoucher(postData) {
    let res: any = await this.paymentVoucherService
      .UpdatePaymentVoucherAprovalDetailsByID(postData)
      .toPromise();
    if (res && res.status == '200') {
      this.toast.success('Payment Voucher Updated successfully')
      this.emitFormData(null)
    }
    console.log(res, "TESTING RS");
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
  goToLink(link) {
    if (link == '') {
      this.toast.error('No document found!')
    }
    else {
      window.open(link, "_blank");
    }
  }
  handleMarkAsPaid() {
    if (!this.paymentForm.invalid) {
      let data = this.paymentForm.getRawValue();
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

  async markPaymentVoucherPaid(remarks) {
    try {
      this.spinner.show();

      let paymentForm = this.paymentForm.getRawValue();

      console.log(paymentForm, "TEST")
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

      if (rsp[0].result == "Payment Voucher Updated" || rsp[0].result == "New Payroll Created") {
        this.toast.success('Payment Voucher Updated successfully')
        this.emitFormData(null)
      }


    } catch (error) {
      this.toast.error(
        "Something went wrong while marking the Payment Voucher as paid!"
      );
    } finally {
      this.spinner.hide(); // Hide the spinner
    }
  }
}
