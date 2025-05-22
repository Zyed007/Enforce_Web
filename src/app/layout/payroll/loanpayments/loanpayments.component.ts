import { Component, OnInit, ViewChild } from '@angular/core';

import {FormGroup,FormControl,Validators,FormBuilder} from "@angular/forms";
import { NgbModal, NgbModalConfig, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import { settingsService } from "../../../services/settings.service";
import { UserService } from "../../../services/user.service";
import { EmployeeService } from "../../../services/employee.service";
import { AdministrativeService } from "../../../services/administrative.service";
import { ToastrService } from "ngx-toastr";
import { PayrollService} from "../../../services/payroll.service";
import { ModuleSetupService } from "../../../services/moduleSetup.service";
import { PaymentVoucherService } from "../../../services/payment-voucher.service";
import Swal from "sweetalert2";
import * as _ from "lodash";

import { TabComponent } from "@syncfusion/ej2-angular-navigations";
import moment = require('moment');

@Component({
  selector: 'app-loanpayments',
  templateUrl: './loanpayments.component.html',
  styleUrls: ['./loanpayments.component.scss']
})

export class LoanpaymentsComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private admService: AdministrativeService,
    private toast: ToastrService,
    private modalService: NgbModal,
    public config: NgbModalConfig,
    private spinner:NgxSpinnerService,
    private settingsService: settingsService,
    private payrollService: PayrollService,
    public ModuleSetupService: ModuleSetupService,
    private paymentVoucherService: PaymentVoucherService
  ) {
    config.backdrop = "static";
  }

  @ViewChild("addadjustmentModel", { static: false }) addadjustmentModel: any;
  @ViewChild("addRepaymentadjustmentModel", { static: false }) addRepaymentadjustmentModel: any;
  @ViewChild("adjustmentModel", { static: false }) adjustmentModel: any;
  @ViewChild("apradjustmentModel", { static: false }) apradjustmentModel: any;

  ngOnInit(): void {
    this.checkUserRights();
    this.getList();
    this.getcurrentPayrollMonth();
    this.getActiveEmployeeList();
  }

  Tabs = [
    { text: "Pending" },
    { text: "Rejected" },
    { text: "Approved" },
    { text: "Added to Paytable" },
    { text: "Paid" },
  ];

  user_info: any;
  selectedemployeeData;

  accessToPage = false;
  showEmployeeData = false;
  showChequeDiv = false;
  bankTransfer = false;
  commonModuleName;
  org_id = localStorage.getItem("org_id").toString();

  commonFields: Object = { text: "text", value: "id" };
  custCommonFields: Object = { text: "value", value: "id" };
  checkUserRights() {
    this.user_info = JSON.parse(localStorage.getItem("user_info"));
    this.userService.GetAccessRightsbyRole({ id: this.user_info.role_id }).subscribe((data: any) => {
      if(data){
        data.map((item) => {
          item.module_name = item.module_name.replace(/\s+/g, "");
          return item;
        });
        this.commonModuleName = _.groupBy(data, "module_name");
        if (this.commonModuleName.Payroll) {
          this.PayrollModuleID = this.commonModuleName.Payroll[0].id;
          this.commonModuleName.Payroll.map((elm) => {
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

          });
          this.checkPayrollApprover(this.user_info.role_id);
        }
      }
    });
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

    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(postData).subscribe((data: any) => {
      //add edit
      data.map((elm) => {
        if (elm.section_name === this.createPayrollSectionName) {
          if (elm.is_full_access) {
            this.addPayrollPaymentsFullAccess = true;
          } else {
            this.addPayrollPaymentsFullAccess = false;
            if (elm.approver1_roleId !== null) {
              this.createPayrollPaymentApprover1rollId = elm.approver1_roleId;
              this.createPayrollPaymentApprover1rollName = elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.isDualApproverPayrollPayments = true;
                this.createPayrollPaymentApprover2rollId = elm.approver2_roleId;
                this.createPayrollPaymentApprover2rollName = elm.approver2_role_name;
              }
            }
          }
        }
      });
    });
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

  activePayrollname = '';
  activePayrollId = '';
  isPayrollActive = false;

  getcurrentPayrollMonth()
  {
    this.payrollService.getActivePayrollMonthDetailsByOrgId({id: this.org_id}).subscribe((data :any) => {
      if(data.length > 0){
        this.isPayrollActive = true;
        this.activePayrollname = data[0].name;
        this.activePayrollId = data[0].id;
        console.log("activepayroll", this.activePayrollname , this.activePayrollId);
      }else{
        console.log("No activepayroll");
        this.isPayrollActive = false;
      }
    })
  }

  payrollListing = [];
  runningPayrollId = '';
  payrollWaiveoffListing = [];
  async GetPayrollByOrgId() {
    this.spinner.show();
    try {
      this.payrollListing = [];
      const data: any = await this.payrollService.GetPayrollByOrgId({ id: this.org_id }).toPromise();
      if(data){
        this.payrollListing = data;
        if (this.payrollListing.length > 0) {
          const currentPayroll = this.payrollListing.find(
              (item) => item.status !== "Paid"
            );
            this.runningPayrollId = currentPayroll.id;
            this.payrollService.GetPayrollWaiveoffByPayrollId({ "id": this.runningPayrollId }).subscribe((rsp: any) => {
              if (rsp) {
                this.payrollWaiveoffListing = rsp;
                console.log("payrollWaiveoffListing", this.payrollWaiveoffListing);
                this.spinner.hide();
              }
            })
        }
      }
    } catch (error) {
      console.error("Error in GetPayrollByOrgId:", error);
      // Optionally, handle the error state or show an error message
    }
  }


  selectedEmp = '';
  changeEmp(evt){
    console.log("changed the employee", evt);
    this.selectedEmp = evt.itemData.id;
  }

  public AddAdjustmentForm: FormGroup;

  termCount = 2;

  payrollmonth = [
    {
      id: 'Pending ',
      text: 'Pending'
    }, {
      id: 'January 2024',
      text: 'January 2024'
    }, {
      id: 'February 2024',
      text: 'February 2024'
    }, {
      id: 'March 2024',
      text: 'March 2024'
    }, {
      id: 'April 2024',
      text: 'April 2024'
    }, {
      id: 'May 2024',
      text: 'May 2024'
    }, {
      id: 'June 2024',
      text: 'June 2024'
    }
  ];

  adjType = [{ id: "Loan Advance", text: "Loan Advance" }, { id: "Loan Repayment", text: "Loan Repayment" }, { id: "Recurring Repayment", text: "Recurring Repayment" }];

  adjItem = [{ id: "Salary Advance", text: "Salary Advance" },
  { id: "Personal Loan", text: "Personal Loan" },
  { id: 'Home Loan', text: "Home Loan" },
  { id: "Vehicle Loan", text: "Vehicle Loan" },
  { id: "Education Loan", text: "Education Loan" },
  { id: "Emergency Loan", text: "Emergency Loan" },
  { id: "Travel Loan", text: "Travel Loan" },
  { id: "Purchase Loan", text: "Purchase Loan" },
  { id: "Retirement Loan", text: "Retirement Loan"},
  { id: "Other Loan", text: "Other Loan"}
  ]

  termDetails = [];
  totalAmount = 0.0;
  totalAmountString = 'AED 0.00'
  showRecurring = false;

  openAddAdjustment() {
    this.adjType = [{ id: "Loan Advance", text: "Loan Advance" }, { id: "Loan Repayment", text: "Loan Repayment" }, { id: "Recurring Repayment", text: "Recurring Repayment" }];
    this.modalService.open(this.addadjustmentModel);
    this.AddAdjustmentForm = new FormGroup({
      reffid: new FormControl('', [Validators.required]),
      empid: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      item: new FormControl('', [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
      // payrollMonth: new FormControl('Pending', [Validators.required]),
      dateincurred: new FormControl('', [Validators.required]),
      remark: new FormControl(''),
    });

    this.AddAdjustmentForm.patchValue({
      type: this.adjType[0].id
      , item: this.adjItem[0].id
      , reffid: this.generateRandomReferenceKey()
    });
    this.termDetails = [];
    this.showRecurring = false;
    this.termCount = 2;
    this.adjDocUrl = '';
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

  async submitAdjustment() {

    let postData;
    let formData = this.AddAdjustmentForm.value;
    let user_Info = JSON.parse(localStorage.getItem("user_info"));

    if(this.selectedEmp == '' ){
      this.toast.info("Please select the Employee for Proceeding!")
      return;
    }

    let updatedType = 'Addition'

    if(formData.type == 'Loan Advance'){
      this.checktoRepay = true;
    }else{
      this.checktoRepay = false;
      updatedType = 'Deduction'
    }

    postData = {
        reference_id:  formData.reffid
      , org_id: this.org_id
      , emp_id: this.selectedEmp
      , pay_item: updatedType
      , type: formData.type
      , amount: formData.amount
      , date_incurred: formData.dateincurred
      , doc_url: this.adjDocUrl
      , remarks: formData.remark
      , created_by: user_Info.id
      , modified_by: user_Info.id
      , is_deleted: false
    }

    console.log("post Data Before", postData);

    if(this.addPayrollPaymentsFullAccess){
      postData.status = 'Approved'
    }else{
      postData.status = 'Pending'
      postData.approver1_roleId = this.createPayrollPaymentApprover1rollId
      if(this.isDualApproverPayrollPayments)
      postData.approver2_roleId = this.createPayrollPaymentApprover2rollId
    }

    if (formData.type == 'Recurring Repayment') {
      //format of termDetails : { index: i+1, payroll_term, amountstring, amount }
      for (let i = 0; i < this.termCount; i++) {
        postData.amount = this.termDetails[i].amount;
        //postData.payroll_id = this.termDetails[i].payroll_term;
        postData.terms = i + 1;
        await new Promise(resolve => {
          console.log("post Data", postData);
          this.payrollService.AddPayrollLoanPayments(postData).subscribe((rsp: any) => {
            if(rsp.status == '200'){
              console.log("Adding successfull");
              resolve(i)
            }
          });
        })
      }
      this.toast.success("Recurring Dedution Payments has Been Added Successfully!")
      this.getList();
      this.closeModel();
    } else {
      console.log("post Data", postData);
      this.payrollService.AddPayrollLoanPayments(postData).subscribe((rsp: any) => {
        if(rsp){
          this.getList()
          this.toast.success(rsp.desc);
          this.closeModel();
          if(this.checktoRepay){
            Swal.fire({
            title: 'Do you want to add the Repayment for this Loan?',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Yes add Repayment',
            cancelButtonText: 'No Proceed',
            }).then((result) => {
              if(result.value === true){
                console.log("Opted the repayment");
               // this.openRepayAdjustmentFrom(formData.item, formData.reffid);
               //!!! want to implement the loan repayment

              }else{
                console.log("Opted to add the advance payment");
              }
            });
          }
          this.checktoRepay = false;
        }
      })
    }
  }


  public AddRepayAdjustmentForm: FormGroup;

  openRepayAdjustmentFrom(selecetedItem, reffid ){

    this.adjType = [{ id: "Loan Repayment", text: "Loan Repayment" }, { id: "Recurring Repayment", text: "Recurring Repayment" }];

    this.modalService.open(this.addRepaymentadjustmentModel);
    this.AddRepayAdjustmentForm = new FormGroup({
      reffid: new FormControl('', [Validators.required]),
      empid: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      item: new FormControl('', [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
      // payrollMonth: new FormControl('Pending', [Validators.required]),
      dateincurred: new FormControl('', [Validators.required]),
      remark: new FormControl(''),
    });

    this.AddRepayAdjustmentForm.patchValue({
      type: this.adjType[0].id
      , item: selecetedItem
      , reffid: reffid
    });

    this.termDetails = [];
    this.showRecurring = false;
    this.termCount = 2;
    this.adjDocUrl = '';

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
      data.append('file', file);
      data.append('upload_preset', 'Leavedocuments');
      data.append('cloud_name', 'dtlt6afvv')
      data.append('public_id', "Leave" + todaysDate)
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


  dataList;
  pendingList = [];
  approvedList= [];
  rejectedList= [];
  activeList= [];

  getList() {
    this.spinner.show();
    this.user_info = JSON.parse(localStorage.getItem("user_info"));
    this.payrollService.GetPayrollLoanPaymentsByOrgId({ "orgID": this.org_id}).subscribe((rsp: any) => {
      if (rsp) {
        this.pendingList = [];
        this.approvedList = [];
        this.rejectedList = [];
        this.activeList = [];
        this.dataList = rsp;
        rsp.map((elm) => {
          if (elm.status == 'Approved') {
            this.approvedList.push(elm);
          }
          if (elm.status == 'Pending') {
            this.pendingList.push(elm);
          }
          if (elm.status == 'Rejected') {
            this.rejectedList.push(elm);
          }
          if (elm.status == 'Active') {
            this.activeList.push(elm);
          }
        })
        this.spinner.hide();
      }
    })
    this.GetPayrollByOrgId();
  }

  checktoRepay = false;
  changeAdjTyp(evnt) {
    console.log("Change from: ", evnt);
    if (evnt.itemData.id == 'Loan Advance') {
      this.showRecurring = false;
      this.checktoRepay = true;
    }
    if (evnt.itemData.id == 'Loan Repayment') {
      this.showRecurring = false;
      this.checktoRepay = false;
    }
    if (evnt.itemData.id == 'Recurring Repayment') {
      this.showRecurring = true;
      this.checktoRepay = false;
      this.generateTermDetails();
    }
  }

  changeTermCount(action) {
    if (action == 'plus') {
      if (this.termCount < 12) {
        this.termCount = this.termCount + 1;
        this.generateTermDetails();
      } else {
        this.toast.warning("Recurring Adjustment cannot be more than 12 Months")
      }
    }
    if (action == 'minus') {
      if (this.termCount > 2) {
        this.termCount = this.termCount - 1;
        this.generateTermDetails();
      } else {
        this.toast.warning("Recurring Adjustment cannot be less than 2 Months")
      }
    }
  }

  generateTermDetails() {
    this.termDetails = [];
    this.totalAmount = parseFloat((this.AddAdjustmentForm.value.amount).toFixed(2));
    this.totalAmountString = this.formatCurrency(this.totalAmount)
    let amnt = this.totalAmount / this.termCount
    let amntstr = this.formatCurrency(amnt);
    for (let i = 0; i < this.termCount; i++) {
      this.termDetails.push({ index: i + 1, payroll_term: this.payrollmonth[i + 1].id, amountstring: amntstr, amount: amnt })
    }
  }


  singleData;
  apprMarkPaidData: object;

  viewAdjustmentPay(data){
    this.singleData = data;
    this.modalService.open(this.adjustmentModel);
  }

  aprRejAJ(data){
    if(this.addPayrollPaymentsFullAccess)
    {
      this.singleData = data;
      this.modalService.open(this.apradjustmentModel);
    }else if(data.approver1_roleId == this.user_info.role_id){
      this.singleData = data;
      this.modalService.open(this.apradjustmentModel);
    }else{
      this.toast.warning("You Dont have the Access to Approve the Loan Payment! Contact your Admin")
    }
  }

  aprAJ(data){
    this.closeModel();
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
    }

    let isDual = false;
    if( data.approver2_roleId){
      isDual = true;
    }

    if (data.approver2_roleId == this.user_info.role_id && data.is_approved_2 == false && data.is_approved_1 == true) {
      postData.approver_date2 = moment().format('L');
      postData.is_approved_2 = true;
      postData.approver2_emp_id = this.user_info.id;
      postData.status = "Approved";
      this.payrollService
        .UpdatePayrollLoanPaymentsByItemID(postData)
        .subscribe((rsp: any) => {
          if (rsp.status == "200") {
            this.toast.success(rsp.desc);
            this.getList();
            this.markNotificationReaded(data.id);
          } else {
            this.toast.error("Something went Wrong to Update the Loan Payment!");
          }
        });
    }
    else if ( data.approver1_roleId == this.user_info.role_id && data.is_approved_1 == false && isDual == false)
    {
      postData.approver_date1 = moment().format("L");
      postData.is_approved_1 = true;
      postData.approver1_emp_id = this.user_info.id;
      postData.status = "Approved";
      this.markNotificationReaded(data.id);
      setTimeout(() => {
        this.payrollService
          .UpdatePayrollLoanPaymentsByItemID(postData)
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
    }

    else if ( data.approver1_roleId == this.user_info.role_id && data.is_approved_1 == false  && isDual == true)
      {
        postData.approver_date1 = moment().format("L");
        postData.is_approved_1 = true;
        postData.approver1_emp_id = this.user_info.id;
        postData.status = "Pending";
        this.markNotificationReaded(data.id);
        setTimeout(() => {
          this.payrollService
            .UpdatePayrollLoanPaymentsByItemID(postData)
            .subscribe((rsp: any) => {
              if (rsp.status == "200") {
                this.toast.success(
                  rsp.desc
                );
                this.getList();
              } else {
                this.toast.error(
                  "Something went Wrong to Update the Loan Payment!"
                );
              }
            });
        }, 1000);
      }
    //Here is the Question for the call without 1st approver
    else if (data.addPayrollPaymentsFullAccess) {
      postData.status = "Approved";
      postData.is_approved_2 = true;
      postData.approver_date2 = moment().format("L");
      postData.approver2_emp_id = this.user_info.id;
      this.payrollService
        .UpdatePayrollLoanPaymentsByItemID(postData)
        .subscribe((rsp: any) => {
          if (rsp.status == "200") {
            this.toast.success(rsp.desc);
            this.getList();
            this.markNotificationReaded(data.id);
          } else {
            this.toast.error("Something went Wrong to Update the Loan Payment!");
          }
        });
    } else {
      console.log("You dont Have the Permission for Approving the Loan Payment!");
      this.toast.warning(
        "You dont Have the Permission for Approving the Loan Payment!"
      );
    }

  }

  rejAJ(data){

    this.closeModel();

    let postData = {
      id: data.id,
      approver_date1:  data.approver_date1 ? data.approver_date1 : null,
      approver_date2:  data.approver_date2 ? data.approver_date2 : null,
      is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
      is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
      approver1_emp_id : data.approver1_emp_id ?  data.approver1_emp_id : null,
      approver2_emp_id : data.approver2_emp_id ?  data.approver2_emp_id : null,
      modified_by: this.user_info.id,
      status: "Rejected",
      paid_date: data.paid_date ? data.paid_date : null,
      is_deleted: false,
    }

    this.payrollService.UpdatePayrollLoanPaymentsByItemID(postData).subscribe((rsp: any) => {
      if(rsp.status =='200'){
        this.toast.success("Adjustment Successfully Rejected!");
        this.getList();
        this.markNotificationReaded(data.id);
      }
    })


  }

  markPending(data){

    Swal.fire({
      title: 'Do you want to move back the Adjustment to Pending Section?',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){

        let postData = {
          id: data.id,
          approver_date1:  data.approver_date1 ? data.approver_date1 : null,
          approver_date2:  data.approver_date2 ? data.approver_date2 : null,
          is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
          is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
          approver1_emp_id : data.approver1_emp_id ?  data.approver1_emp_id : null,
          approver2_emp_id : data.approver2_emp_id ?  data.approver2_emp_id : null,
          modified_by: this.user_info.id,
          status: "Pending",
          paid_date: data.paid_date ? data.paid_date : null,
          is_deleted: false,
        }

        this.payrollService.UpdatePayrollLoanPaymentsByItemID(postData).subscribe((rsp: any) => {
          if(rsp.status =='200'){
            this.toast.success("Adjustment Successfully Moved Back to Pending section!");
            this.getList();
            this.markNotificationReaded(data.id);
          }
        })

      }
    });

  }

  activePayrollMonthId = "March2024"
  addToPaytable(data){
    if(this.showPayrollPaymentBtn){
      let postData = {
        id: data.id,
        payroll_id: this.activePayrollMonthId,
        approver_date1:  data.approver_date1 ? data.approver_date1 : null,
        approver_date2:  data.approver_date2 ? data.approver_date2 : null,
        is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
        is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
        approver1_emp_id : data.approver1_emp_id ?  data.approver1_emp_id : null,
        approver2_emp_id : data.approver2_emp_id ?  data.approver2_emp_id : null,
        modified_by: this.user_info.id,
        status: "Active",
        paid_date: data.paid_date ? data.paid_date : null,
        is_deleted: false,
      }
      this.payrollService.UpdatePayrollLoanPaymentsByItemID(postData).subscribe((rsp: any)=>{
        if(rsp.status=='200'){
          this.toast.success("Assigned the Adjustment to the Active Payroll Table!");
          this.getList();
        }else{
          this.toast.error("Something Went worng While Assigning the Adjustment!")
        }
      })

    }else{
      this.toast.info("Please Check the Permission for Assigning Adjustment!")
    }

  }


  MarkVPPaid(data){
    //!!!for marking Paid
    console.log("This Payment want to mark as Paid!", data);

  }

  markNotificationReaded(reff_id){
    //!!! call the api for removing the approval notification!!!!
    console.log("The Notifications are marked As Readed.");
  }


  //Common utilities

  generateRandomReferenceKey(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if(this.checkKey(result)){
      return result;
    }
    else{
      this.generateRandomReferenceKey();
    }
  }

  checkKey(key): boolean{
    //!!!write the code to check if the key is duplicating
    return true;
  }

  formatCurrency(amount: number): string {
    const formattedAmount = amount.toFixed(2);
    return `AED ${formattedAmount}`;
  }

  changePayrollMonthFrm(evnt){
    console.log("Change in Payroll month", evnt)
  }

  goToLink(){
    window.open(this.adjDocUrl, "_blank");
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

  public ApprMarkPaidForm: FormGroup;
  public bankAccountForm: FormGroup;
  childModalRef: NgbModalRef;

  senderArr = [];

  @ViewChild("apprMarkPaidModel", { static: false }) apprMarkPaidModel: any;
  @ViewChild("bankAccModal", { static: false }) bankAccModal: any;

  companyBankAccDetails = [];

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

  MarkApprPaid(data) {
    console.log(data);
    this.apprMarkPaidData = data;
    this.modalService.open(this.apprMarkPaidModel);
    this.GetCompanyBankAccountDetails();
    this.ApprMarkPaidForm = new FormGroup({
      reffid: new FormControl("", [Validators.required]),
      // empid: new FormControl('', [Validators.required]),
      type: new FormControl("", [Validators.required]),
      // item: new FormControl('', [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
      mode: new FormControl(0, [Validators.required]),
      // payrollMonth: new FormControl('Pending', [Validators.required]),
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
    });
    this.ApprMarkPaidForm.patchValue({
      type: data.type,
      // , item: data.id
      reffid: data.reference_id,
      amount: data.amount,
      remark: data.remark,
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


}
