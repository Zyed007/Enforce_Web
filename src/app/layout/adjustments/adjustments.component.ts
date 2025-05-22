import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { OrganizationService } from '../../services/organization.service';
import { UserService } from '../../services/user.service';
import { ModuleSetupService } from './../../services/moduleSetup.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import moment = require('moment');
import * as _ from "lodash";

@Component({
  selector: 'app-adjustments',
  templateUrl: './adjustments.component.html',
  styleUrls: ['./adjustments.component.scss']
})
export class AdjustmentsComponent implements OnInit {

  userInfo:any = JSON.parse(localStorage.getItem('user_info'));
  orgID = this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id');
  //userRights
  commonModuleName;
  accessToAdjustments = false;
  public adjustmentsToolbar : ToolbarItems[];
  mainTabListing = true;
  firstDiv = false;
  secondDiv = false;
  totalOverDueInvoiceData;
  totalOverDueInvoiceAmt = 0;
  singleOverDueInvoiceData;
  showConfirmOption;
  showPercentage;
  showAbovePercentageError = false;
  adjustmentForm: FormGroup;
  formSubmitAttempt = false;

  //date
  dateRangeForm: FormGroup;
  fromDate = moment().subtract(7, "days").format('L');
  toDate = moment().format('L');
  dateTextToDisplay = moment().subtract(7, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
  isSixMonthActive = false;
  isYearActive = false;
  isMonthActive = false;
  isWeekActive = true;
  isTodayActive= false;
  headerText = [
    { text: 'Adjustments list' },
    { text: 'Provision List'},
    { text: 'Bad Debt list' }
  ];
  invoiceDebtsData;
  vatPercentage;
  orgCurrency;
  currentTabName = 'Adjustments list';
  finalBadDepbtData;

  currentModuleID
  applyAdjustments
  approverAssigned = false
  adjustmentsApprover1Value
  adjustmentsApprover1Name
  dualApprovalAssigned = false;
  adjustmentsApprover2Value
  adjustmentsApprover2Name

  constructor(
    private userService:UserService,
    private projectService: ProjectService,
    public OrganizationService: OrganizationService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    public ModuleSetupService: ModuleSetupService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.checkUserRights();
    this.totalOverDueInvoice();
    this.createAdjustmentForm();
    this.findByOrgId();

    //formControl
    this.dateRangeForm = this.formBuilder.group({
      daterange: [''],
    });
    this.adjustmentsToolbar = ['Search'];

    //active when date picker value changes
    this.dateRangeForm.get('daterange').valueChanges.subscribe(() => {
      let startTime = this.dateRangeForm.get('daterange').value;
      this.fromDate = moment(startTime[0]).format('L');
      this.toDate = moment(startTime[1]).format('L');
      this.GetInvoiceDebtsByDateOrgId(this.fromDate, this.toDate, this.currentTabName)
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateTextToDisplay = moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');
    });
  }

  findByOrgId(){
    this.OrganizationService.getOrgById(this.orgID).subscribe((data: any) => {
      this.vatPercentage = data.vatpercent !== null ? data.vatpercent : 5;
      this.orgCurrency = data.organizationSetup.currency !== null ? data.organizationSetup.currency : 'AED';
    });
  }

  getCommonDateType(value){
    if(value === 'today'){
      this.fromDate = moment().format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().format('ddd, D MMM YYYY')
      this.isTodayActive = true;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
    }else if(value === 'weeks'){
      this.fromDate = moment().subtract(7, "days").format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(7, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = true;
      this.isMonthActive = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
    }else if(value === 'month'){
      this.fromDate = moment().startOf('month').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().startOf('month').format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = true;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
    }else if(value === 'six-month'){
      this.fromDate = moment().subtract(6, 'months').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(6, 'months').format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.isSixMonthActive = true;
      this.isYearActive = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
    }else if(value === 'year'){
      this.fromDate = moment().startOf('year').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().startOf('year').format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.isSixMonthActive = false;
      this.isYearActive = true;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
    }

    this.GetInvoiceDebtsByDateOrgId(this.fromDate, this.toDate, this.currentTabName)
  }

  tabSelected(event){
    this.currentTabName = event.selectedItem.textContent;
    if(this.currentTabName === 'Bad Debt list' || this.currentTabName === 'Provision List' ){
      this.GetInvoiceDebtsByDateOrgId(this.fromDate, this.toDate, this.currentTabName)
    }
  }

  GetInvoiceDebtsByDateOrgId(fromDate, toDate, status){
    let statusFi = status === 'Provision List' ? 'Provision' : 'pending';
    this.projectService.GetInvoiceDebtsByDateOrgId(fromDate, toDate).subscribe((data: any) => {
      console.log(data)
      let result = [];
      if(data.length !== 0){
        data.map((elm, i) => {
          if(statusFi === elm.status){
            result.push(elm)
          }

          if("bad_debt" === elm.status){
            result.push(elm)
          }

          if(data.length === i+1){
            this.invoiceDebtsData = result;
          }
        })
      }else{
        this.invoiceDebtsData = data;
      }
    });
  }

  checkUserRights(){
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let postData = { id : user_info.role_id }

    this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
      data.map((item) => {
        item.module_name = item.module_name.replace(/\s+/g, '');;
        return item;
      });
      this.commonModuleName = _.groupBy(data, 'module_name');
      //settings
      if(this.commonModuleName.Invoice){
        this.currentModuleID = this.commonModuleName.Invoice[0].id;
        this.commonModuleName.Invoice.map((elm) => {
          if(elm.section_name === 'Apply Adjustments' && elm.is_allow){
            this.accessToAdjustments = true;
            this.applyAdjustments = elm.section_name;
          }
        });
      }else{
        this.accessToAdjustments = false;
      }
    });
  }

  GetModuleApproverByRoleIDandModuleid(){
    let userDataLocal = JSON.parse(localStorage.getItem('user_info'));
    let postData = {
      roleID: userDataLocal.role_id,
      moduleID: this.currentModuleID
    }
    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(postData).subscribe((data: any) => {
      data.map((elm) => {
        if(elm.section_name === this.applyAdjustments){
          if(elm.approver1_roleId !== null){
            this.approverAssigned = true;
            this.adjustmentsApprover1Value = elm.approver1_roleId;
            this.adjustmentsApprover1Name = elm.approver1_role_name;
            if(elm.approver2_roleId !== null){
              this.dualApprovalAssigned = true;
              this.adjustmentsApprover2Value = elm.approver2_roleId;
              this.adjustmentsApprover2Name = elm.approver2_role_name
            }
          }else{
            this.approverAssigned = false;
          }
        }
      });
    });
  }

  totalOverDueInvoice(){
    let endDate = moment().format('L');
    this.projectService.GetOverDueInvoiceByOrgId(endDate).subscribe((data: any) => {
      let totalOverDueInv = [];
      let currentDate = moment(new Date());
      data.map((elm, ind) => {
        elm.taxExcluded = (5/100) * parseFloat(elm.advAmount);
        elm.diffDays = currentDate.diff(moment(elm.dueDate), 'days')
        if(elm.discountAmount !== null){
          elm.AmoutPlusVat = parseFloat((parseFloat((parseFloat(elm.advAmount) + parseFloat(elm.taxExcluded)).toFixed(2)) - parseFloat(elm.discountAmount)).toFixed(2))
        }else{
          elm.AmoutPlusVat = parseFloat((parseFloat(elm.advAmount) + parseFloat(elm.taxExcluded)).toFixed(2));
        }
        totalOverDueInv.push(elm.AmoutPlusVat);

        if(data.length === ind+1){
          this.totalOverDueInvoiceData = data;
          this.totalOverDueInvoiceAmt = totalOverDueInv.reduce((partialSum, a) => partialSum + a, 0);
          this.spinner.hide();
        }
      });
    });
  }

  openBadDebtDiv(data){
    this.singleOverDueInvoiceData = data;
    this.mainTabListing = false;
    this.firstDiv = true;
    this.showConfirmOption = false;
    this.showPercentage = false;
    this.patchAmt();
    this.GetModuleApproverByRoleIDandModuleid();
  }

  patchAmt(){
    this.adjustmentForm.patchValue({
      finalAmount: parseFloat(this.singleOverDueInvoiceData.advAmount)
    });
  }

  checkForYes(e, type){
    if(type === 'category'){
      this.showConfirmOption = e.checked;
      if(!this.showConfirmOption){
        this.showPercentage = false;
        this.patchAmt();
      }
    }else{
      this.showPercentage = e.checked;
    }
  }

  calculatePercentage(event){
    this.showAbovePercentageError = false;
    let perNumber = !isNaN(event.target.valueAsNumber) ? event.target.valueAsNumber : 100;
    let editAmount = parseFloat(this.singleOverDueInvoiceData.advAmount)
    if(perNumber < 101){
      let sendAmount = (perNumber/100) * editAmount;
      this.adjustmentForm.patchValue({
        finalAmount: parseFloat((sendAmount).toFixed(2))
      });
    }else{
      this.showAbovePercentageError = true;
    }
  }

  saveAdjustment(){
    this.spinner.show();
    this.formSubmitAttempt = true;
    if(this.adjustmentForm.invalid){
      this.spinner.hide();
      return;
    }
    let formValue = this.adjustmentForm.getRawValue();
    let postData: any = {
      "invoiceId": this.singleOverDueInvoiceData.id,
      "org_id": this.singleOverDueInvoiceData.org_id,
      "description": formValue.reason,
      "amount": formValue.finalAmount,
      "createdDate": moment().format('L'),
      "createdByEmpId": this.userInfo.id,
      "createdBy": this.userInfo.full_name,
      "status": formValue.isProvision ? 'Provision' : 'bad_debt'
    }

    if(!formValue.isProvision){
      postData.approver1_roleId = this.adjustmentsApprover1Value,
      postData.approver2_roleId = this.dualApprovalAssigned ? this.adjustmentsApprover2Value : ''
    }

    this.projectService.AddInvoiceDebts(postData).subscribe((data: any) => {
      if(data.status === '200'){
        this.toast.success('Send for approval')
      }else{
        this.toast.error('Something went wrong')
      }
      this.spinner.hide();
      this.closeSingleAdjDiv();
    });
  }

  runFinal(postData){
    console.log(postData)

  }

  closeSingleAdjDiv(){
    this.mainTabListing = true;
    this.firstDiv = false;
    this.secondDiv = false;
    this.formSubmitAttempt = false;
    this.totalOverDueInvoice();
    this.adjustmentForm.reset();
  }

  openFinalBadDebtDiv(data){
    this.mainTabListing = false;
    this.secondDiv = true;
    this.finalBadDepbtData = data;
    this.GetModuleApproverByRoleIDandModuleid();
    this.projectService.GetStageInvoiceById({id: data.invoiceId}).subscribe((invData:any) => {
      this.finalBadDepbtData.details = {
        customerName: invData[0].customerName,
        custPhone: invData[0].custPhone,
        projectName: invData[0].projectName,
        paymentStatus: invData[0].paymentStatus,
        isCommission: invData[0].isCommission
      }
    });
  }

  reasonValue(event){
    this.finalBadDepbtData.description = event.srcElement.value
  }

  updateAdjustment(){
    let postData = {
      "id": this.finalBadDepbtData.id,
      "invoiceId": this.finalBadDepbtData.invoiceId,
      "org_id": this.finalBadDepbtData.org_id,
      "description": this.finalBadDepbtData.description,
      "amount": this.finalBadDepbtData.amount,
      "createdDate": this.finalBadDepbtData.createdDate,
      "modifiedDate": moment().format('L'),
      "createdByEmpId": this.userInfo.id,
      "createdBy": this.userInfo.full_name,
      "status": 'bad_debt',
      "approver1_roleId": this.adjustmentsApprover1Value,
      "approver2_roleId": this.dualApprovalAssigned ? this.adjustmentsApprover2Value : ''
    }
    this.projectService.UpdateInvoiceDebtById(postData).subscribe((data: any) => {
      if(data.status === '200'){
        this.toast.success('Send for Approval')
      }else{
        this.toast.error('Something went wrong')
      }
      this.spinner.hide();
      this.closeFinalAdjDiv();
    });
  }

  closeFinalAdjDiv(){
    this.mainTabListing = true;
    this.secondDiv = false;
  }

  createAdjustmentForm(){
    this.adjustmentForm = this.formBuilder.group({
      finalAmount: [{value: '', disabled: true}, [Validators.required]],
      isProvision: [false, [Validators.required]],
      reason: ['', [Validators.required]]
		});
  }

}
