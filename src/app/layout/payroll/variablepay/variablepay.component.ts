import { Component, OnInit, ViewChild } from '@angular/core';

import {FormGroup,FormControl,Validators,FormBuilder} from "@angular/forms";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import { settingsService } from "../../../services/settings.service";
import { UserService } from "../../../services/user.service";
import { EmployeeService } from "../../../services/employee.service";
import { AdministrativeService } from "../../../services/administrative.service";
import { ToastrService } from "ngx-toastr";
import { PayrollService} from "../../../services/payroll.service";
import { ModuleSetupService } from "../../../services/moduleSetup.service";
import Swal from "sweetalert2";
import * as _ from "lodash";

import { TabComponent } from "@syncfusion/ej2-angular-navigations";
import moment = require('moment');

@Component({
  selector: 'app-variablepay',
  templateUrl: './variabepay.component.html',
  styleUrls: ['./variablepay.component.scss']
})

export class VariablpayComponent implements OnInit {

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
  ) {
    config.backdrop = "static";
  }

  @ViewChild("variablepayModel", { static: false }) variablepayModel: any;
  @ViewChild("aprvariablepayModel", { static: false }) aprvariablepayModel: any;
  @ViewChild("addvariablepayModel", { static: false }) addvariablepayModel: any;

  ngOnInit(): void {
    this.checkUserRights();
    this.getList();
    this.getActiveEmployeeList();
    this.getcurrentPayrollMonth();
  }

  accessToPage = false;
  commonModuleName;

  Tabs = [
    { text: "Pending" },
    { text: "Rejected" },
    { text: "Approved" },
    { text: "Added to Paytable" },
    { text: "Paid" },
  ];

  user_info: any;

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
  getActiveEmployeeList(){
    this.activeEmpList=[];
    this.payrollService.getActiveEmployeeListByOrgID({id: this.user_info.org_id}).subscribe((rsp: any) =>{
      if(rsp){
        rsp.map((emp) =>{
          this.activeEmpList.push({id: emp.id, text: emp.full_name})
        })
      }
    })
  }

  selectedEmp = '';
  changeEmp(evt){
    console.log("changed the employee", evt);
    this.selectedEmp = evt.itemData.id;
  }

  public AddVaraiableForm: FormGroup;

  VarItem = [{ id: 'Commision', text: "Commision" },
  { id: 'Incentive', text: "Incentive" },
  { id: 'Arrear Adjustment', text: "Arrear Adjustment" },
  { id: 'Leave Encashment', text: "Leave Encashment" },
  { id: 'Overtime', text: "Overtime" },
  ]

  openAddAdjustment(){
    this.modalService.open(this.addvariablepayModel)
    this.AddVaraiableForm = new FormGroup({
      empid: new FormControl('', [Validators.required]),
      reffid: new FormControl('', [Validators.required]),
      item: new FormControl('select', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      payroll: new FormControl('Pending', [Validators.required]),
      startdate: new FormControl('', [Validators.required]),
      enddate: new FormControl('', [Validators.required]),
      remark: new FormControl(''),
    });

    this.AddVaraiableForm.patchValue({
      reffid: this.generateRandomReferenceKey()
    })

  }

  submitVariablePay(){


    let postData;
    let formData = this.AddVaraiableForm.value;
    let user_Info = JSON.parse(localStorage.getItem("user_info"));

    if(this.selectedEmp == '' ){
      this.toast.info("Please select the Employee for Proceeding!")
      return;
    }


    postData = {
      reference_id: formData.reffid,
      org_id: user_Info.org_id,
      emp_id: this.selectedEmp,
      pay_item: formData.item,
      amount: formData.amount,
      remarks: formData.remark,
      status: "Approved",
      assc_start_date: moment(formData.startdate).format('L'),
      assc_end_date:  moment(formData.enddate).format('L'),
      is_deleted: false,
      modified_by: user_Info.id,
      created_by: user_Info.id,
    }


    if(this.addPayrollPaymentsFullAccess){
      console.log("postData", postData)
      this.payrollService.AddPayrollVariablePay(postData).subscribe((rsp: any)=>{
        if(rsp){
          console.log("rsp", rsp);
          if(rsp.status = '200'){
            this.toast.success(rsp.desc);
            this.getList();
            this.closeModel();
          }else{
            this.closeModel();
            this.toast.error("Somthing went worng, Please try Again!")
          }
        }
      })
    }else{
      postData.approver1_roleId = this.createPayrollPaymentApprover1rollId
      postData.status = 'Pending'
      if(this.isDualApproverPayrollPayments)
      postData.approver2_roleId = this.createPayrollPaymentApprover2rollId
      this.payrollService.AddPayrollVariablePay(postData).subscribe((rsp: any) => {
        if(rsp){
          console.log("rsp", rsp);
          if(rsp.status = '200'){
            this.toast.success(rsp.desc);
            this.getList();
            this.closeModel();
          }else{
            this.closeModel();
            this.toast.error("Somthing went worng, Please try Again!")
          }
        }
      })

    }
  }

  dataList;
  pendingList = [];
  approvedList= [];
  rejectedList= [];
  activeList= [];
  paidList = [];

  getList(){
    this.user_info = JSON.parse(localStorage.getItem("user_info"));
    this.payrollService.GetPayrollVariablePayByOrgId({"orgID": this.user_info.org_id }).subscribe((rsp: any)=>{
      if(rsp){
        this.pendingList = [];
        this.approvedList= [];
        this.rejectedList= [];
        this.activeList = [];
        this.paidList = [];
        this.dataList = rsp;
        rsp.map((elm) => {
          if(elm.status == 'Approved')
          {
            this.approvedList.push(elm);
          }
          if(elm.status == 'Pending'){
            this.pendingList.push(elm);
          }
          if(elm.status == 'Rejected'){
            this.rejectedList.push(elm);
          }
          if(elm.status == 'Active'){
            this.activeList.push(elm);
          }
          if(elm.status == 'Paid'){
            this.paidList.push(elm);
          }
        })
      }
    })

  }

  singleData;

  adjDocUrl = "";
  isadjDocUp = false;

  viewVariablePay(data){
    this.singleData = data;
    if(this.singleData.doc_url){
      this.isadjDocUp = true;
    }else{
      this.isadjDocUp = false;
    }
    this.modalService.open(this.variablepayModel);

    if(this.singleData.approver1_roleId){
      this.employeeService.getRoleNameByroleID({id: this.singleData.approver1_roleId }).subscribe((role1name) =>{
        if(role1name)
        {
          this.singleData.approver1_roleName = role1name[0].role_name;
        }
      })
    }
    if(this.singleData.approver2_roleId){
      this.employeeService.getRoleNameByroleID({id: this.singleData.approver2_roleId }).subscribe((role1name) =>{
        if(role1name)
        {
          this.singleData.approver2_roleName = role1name[0].role_name;
        }
      })
    }

  }

  aprRejVP(data){
    if(this.addPayrollPaymentsFullAccess)
    {
      this.singleData = data;
      this.modalService.open(this.aprvariablepayModel);
    }else if(data.approver1_roleId == this.user_info.role_id){
      this.singleData = data;
      this.modalService.open(this.aprvariablepayModel);
    }else{
      this.toast.warning("You Dont have the Access to Approve the Variable Pay! Contact your Admin")
    }
  }

  aprVP(data){
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
      status: data.status,
      paid_date: data.paid_date ? data.paid_date : null,
      is_deleted: false,
    }

    let isDual = false;
    if( data.approver2_roleId){
      isDual = true;
    }

    if(data.approver2_roleId == this.user_info.role_id && data.is_approved_2 == false && data.is_approved_1 == true)
    {
      postData.approver_date2 = moment().format('L');
      postData.is_approved_2 = true;
      postData.approver2_emp_id = this.user_info.id;
      postData.status = 'Approved'
      this.payrollService.UpdatePayrollVariablePayByItemID(postData).subscribe((rsp: any) => {
        if(rsp.status == '200'){
          this.toast.success(rsp.desc);
          this.getList();
          this.markNotificationReaded(data.id);
        }else{
          this.toast.error("Something went Wrong to Update the Variable Pay!");
        }
      });
    }
    else if(data.approver1_roleId == this.user_info.role_id && data.is_approved_1 == false && isDual == false){

      postData.approver_date1 = moment().format('L');
      postData.is_approved_1 = true;
      postData.approver1_emp_id = this.user_info.id;
      postData.status = 'Approved'
      this.markNotificationReaded(data.id);
      setTimeout(() => {
        this.payrollService.UpdatePayrollVariablePayByItemID(postData).subscribe((rsp: any) => {
          if(rsp.status == '200'){
            this.toast.success(rsp.desc + "Notification is send to Level 2 Approver!");
            this.getList();
          }else{
            this.toast.error("Something went Wrong to Update the Variable Pay!");
          }
        });
      }, 1000);
    }
    else if(data.approver1_roleId == this.user_info.role_id && data.is_approved_1 == false && isDual == true){

      postData.approver_date1 = moment().format('L');
      postData.is_approved_1 = true;
      postData.approver1_emp_id = this.user_info.id;
      postData.status = 'Pending'
      this.markNotificationReaded(data.id);
      setTimeout(() => {
        this.payrollService.UpdatePayrollVariablePayByItemID(postData).subscribe((rsp: any) => {
          if(rsp.status == '200'){
            this.toast.success(rsp.desc);
            this.getList();
          }else{
            this.toast.error("Something went Wrong to Update the Variable Pay!");
          }
        });
      }, 1000);
    }
    //Here is the Question for the call without 1st approver
    else if(data.addPayrollPaymentsFullAccess)
    {
      postData.status = 'Approved'
      postData.is_approved_2 = true;
      postData.approver_date2 = moment().format('L');
      postData.approver2_emp_id = this.user_info.id;
      this.payrollService.UpdatePayrollVariablePayByItemID(postData).subscribe((rsp: any) => {
        if(rsp.status == '200'){
          this.toast.success(rsp.desc);
          this.getList();
          this.markNotificationReaded(data.id);
        }else{
          this.toast.error("Something went Wrong to Update the Variable Pay!");
        }
      });
    }
    else{
      console.log("You dont Have the Permission for Approving the Variable Pay!");
      this.toast.warning("You dont Have the Permission for Approving the Variable Pay!");
    }

  }

  rejVP(data){

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

    this.payrollService.UpdatePayrollVariablePayByItemID(postData).subscribe((rsp: any) => {
      if(rsp.status =='200'){
        this.toast.success("Variable Pay Successfully Rejected!");
        this.getList();
        this.markNotificationReaded(data.id);
      }
    })


  }

  markPending(data){

    Swal.fire({
      title: 'Do you want to move back the Varable Pay to Pending Section?',
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

        this.payrollService.UpdatePayrollVariablePayByItemID(postData).subscribe((rsp: any) => {
          if(rsp.status =='200'){
            this.toast.success("Variable Pay Successfully Moved Back to Pending section!");
            this.getList();
            this.markNotificationReaded(data.id);
          }
        })

      }
    });

  }

  sendBackToApr(data){

    Swal.fire({
      title: "Do you want to send back this Variable Pay to the Approval Section?",
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
            approver_date1: data.approver_date1? moment(data.approver_date1).format('L') : null,
            approver_date2: data.approver_date2? moment(data.approver_date2).format('L') : null,
            is_approved_1: data.is_approved_1,
            is_approved_2: data.is_approved_2,
            modified_date: moment(data.modified_date).format('L'),
            modified_by: data.modified_by? moment(data.modified_by).format('L') : null,
            status: "Approved",
            paid_date: data.paid_date? moment(data.paid_date).format('L') : null,
            is_deleted: false,
            approver1_roleId: data.approver1_roleId,
            approver2_roleId: data.approver2_roleId,
            approver1_emp_id: data.approver1_emp_id,
            approver2_emp_id: data.approver2_emp_id,
            org_id: data.org_id,
            created_by: data.created_by
          }

          this.payrollService.UpdatePayrollVariablePayByItemID(postData).subscribe((rsp: any) => {
            if (rsp.status == '200') {
              this.toast.success(rsp.desc);
              this.getList();
            } else {
              this.toast.error("Something went Wrong to Update the Adjustment!");
            }
          });

        }
      })
  }

  activePayrollname = '';
  activePayrollId = '';
  isPayrollActive = false;
  getcurrentPayrollMonth()
  {
    this.payrollService.getActivePayrollMonthDetailsByOrgId({id: localStorage.getItem('org_id') }).subscribe((data :any) => {
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


  addToPaytable(data){
    if(this.showPayrollPaymentBtn){

      Swal.fire({
        title: "Do you want to Add this Variable Pay to the Active Paytable?",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: " Confirm",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.value === true) {
          if(this.isPayrollActive == false){
            this.toast.warning("Payroll is not active");
            return;
          }else{
            let postData = {
              id: data.id,
              payroll_id: this.activePayrollId,
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
            this.payrollService.UpdatePayrollVariablePayByItemID(postData).subscribe((rsp: any)=>{
              if(rsp.status=='200'){
                this.toast.success("Assigned the Variable Pay to the Active Payroll Table!");
                this.getList();
              }else{
                this.toast.error("Something Went worng While Assigning the Variable Pay!")
              }
            })
          }
        }

      });
    }else{
      this.toast.info("Please Check the Permission for Assigning Variable Pay!")
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


  closeModel() {
    this.modalService.dismissAll();
    //!!!want to add the initail values for the changes status part
  }

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


}
