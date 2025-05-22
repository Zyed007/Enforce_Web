import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//reactive form
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import moment = require('moment');
import { settingsService } from '../../../../../services/settings.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as _ from "lodash";
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import Swal from 'sweetalert2';
//js
declare var $: any;

@Component({
  selector: 'app-income-payment',
  templateUrl: './income-payment.component.html',
  styleUrls: ['./income-payment.component.scss']
})
export class IncomePaymentComponent implements OnInit {

  @ViewChild('resetDropDown',{static:false}) public resetDropDown: DropDownListComponent;
  allIncomePaymentTermData
  public paymentMethodologyForm: FormGroup;
  isValidFormSubmitted: boolean | null = null;
  showPercentageError = false;
  showPercentageError2 = false;
  creditTermsDaysData = [
    {
      id:'Immediately',
      value: 'Immediately'
    },{
      id:'15',
      value: '15 Days'
    },{
      id:'30',
      value: '30 Days'
    },{
      id:'60',
      value: '60 Days'
    }
  ]
  commonFields: Object = { text: "value", value: "id" };
  paymentTermFormType = 'Add';
  userInfo:any = JSON.parse(localStorage.getItem('user_info'));
  editPaymentPolicyData;
  allPaymentTermDropData;
  trigerReset = false;

  constructor(
    public Router :Router,
    public formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr:ToastrService,
    private settingsService: settingsService
  ) { }

  ngOnInit() {
    this.createPaymentMethodologyForm();
    this.GetPaymentPolicyByOrgId()
  }

  //get payment policy for org
  GetPaymentPolicyByOrgId(){
    this.spinner.show();
    this.settingsService.FetchCommissionPolicyByOrg().subscribe((data: any) => {
      let templateData = []
      data.map((elm) => {
        if(elm.project_id === null){
          templateData.push(elm)
        }
      });
      this.processData(templateData)
    });
  }

  processData(data){
    let serverData = _.values( _.groupBy(data, 'id'));
    let paymentData = [];
    let payment
    serverData.map((elm) => {
      let pPolicy = [];
      elm.map((elm2) => {
        payment = {
          createdDate: elm2.createdDate,
          paymentName : elm2.policy_name,
          creditTermsDays : elm2.creditTerms,
          is_default : elm2.is_default,
          id: elm2.id,
          org_id: elm2.org_id
        }
        pPolicy.push(elm2)
      });
      payment["paymentPolicy"] = pPolicy;
      paymentData.push(payment)
    });
    this.allIncomePaymentTermData = paymentData;
    this.spinner.hide();
  }
  //get payment policy for org

  //Add payment terms
  openPaymentTermModel(type){
    if(type === 'Add'){
      if(this.allIncomePaymentTermData.length !== 0){
        this.runDropDownFun();
      }
      this.paymentTermFormType = 'Add';
      $("#Payment_terms_modal").modal('show');
      this.paymentMethodologyForm.patchValue({
        creditTermsDays: 'Immediately',
        isDefault: false
      });
      this.addItemRow();
    }else{
      this.spinner.show();
      this.paymentTermFormType = 'Edit';
      (this.paymentMethodologyForm.get('paymentPolicy') as FormArray).clear();
      this.editPaymentPolicyData = type;
      $("#Payment_terms_modal").modal('show');
      this.patchValues();
    }
  }

  runDropDownFun(){
    let results = [];
    this.allIncomePaymentTermData.map((elm, i) => {
      results.push({
        id: elm.id,
        value: elm.paymentName
      });

      if(this.allIncomePaymentTermData.length === i+1){
        this.allPaymentTermDropData = results;
      }
    });
  }

  addItemRow(){
    let newFormValue = this.paymentPolicy.getRawValue();
    let getPerTotal = [];
    newFormValue.map((elm) => {
      if(elm.perProjValue !== ''){
        getPerTotal.push(parseInt(elm.perProjValue))
      }
    });
    const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
    if(sumProj > 99){
      this.showPercentageError = true;
    }else{
      this.showPercentageError = false;
      let newRow = this.createPaymentPolicy();
      this.paymentPolicy.push(newRow);
    }
	}

  deletePayment(i){
    this.paymentPolicy.removeAt(i)
  }

  patchValues(){
    this.paymentMethodologyForm.patchValue({
      paymentName: this.editPaymentPolicyData.paymentName,
      creditTermsDays: this.editPaymentPolicyData.creditTermsDays,
      isDefault: this.editPaymentPolicyData.is_default
    });
    let formData = this.paymentMethodologyForm.get('paymentPolicy') as FormArray;
    this.editPaymentPolicyData.paymentPolicy.map((elm) => {
      formData.push(this.formBuilder.group({
        paymentTerms: elm.term_name,
        perProjValue: elm.term_percent
      }));
    });
    this.spinner.hide();
  }

  returnItem(i){
    let number = i+1;
    this.paymentPolicy.at(i).patchValue({
      paymentTerms: this.ordinalSuffixOf(number)+' Payment'
    });
    this.paymentPolicy.controls[i].get('paymentTerms').disable();
  }

  ordinalSuffixOf(i) {
    if(this.paymentPolicy.value.length === 1){
      return 'Full'
    }else{
      var j = i % 10,k = i % 100;
      if(j == 1 && k != 11){return i + "st";}
      if(j == 2 && k != 12){return i + "nd";}
      if(j == 3 && k != 13){return i + "rd";}
      return i + "th";
    }
  }

  selectToCopyFrom(event){
    this.trigerReset = true;
    (this.paymentMethodologyForm.get('paymentPolicy') as FormArray).clear();
    this.spinner.show();
    let id = event.value;
    this.allIncomePaymentTermData.map((elm) => {
      if(elm.id === id){
        this.paymentMethodologyForm.patchValue({
          paymentName: elm.paymentName,
          creditTermsDays: elm.creditTermsDays,
          isDefault: elm.is_default
        });
        let formData = this.paymentMethodologyForm.get('paymentPolicy') as FormArray;
        elm.paymentPolicy.map((elm2) => {
          formData.push(this.formBuilder.group({
            paymentTerms: elm2.term_name,
            perProjValue: elm2.term_percent
          }));
        });
        this.spinner.hide();
      }
    });
  }

  savePaymentTerms(){
		this.isValidFormSubmitted = false;
    this.showPercentageError2 = false;
		if(this.paymentMethodologyForm.invalid){
			return;
		}
		this.isValidFormSubmitted = true;
    let formValue = this.paymentMethodologyForm.getRawValue();
    let getPerTotal = [];
    formValue.paymentPolicy.map((elm, i) => {
      if(elm.perProjValue !== ''){
        getPerTotal.push(parseInt(elm.perProjValue))
      }

      if(formValue.paymentPolicy.length === i+1){
        const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
        if(sumProj === 100){
          this.runFinal(formValue)
        }else{
          this.showPercentageError2 = true;
          return;
        }
      }
    });
  }

  runFinal(formValue){
    this.spinner.show();
    let sendValue = [];
    if(this.paymentTermFormType === 'Add'){
      let uniqueID = this.generateId(10);
      formValue.paymentPolicy.map((elm) => {
        sendValue.push({
          id: uniqueID,
          policy_name: formValue.paymentName,
          org_id: this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
          term_name: elm.paymentTerms,
          term_percent: elm.perProjValue,
          creditTerms: formValue.creditTermsDays,
          createdDate: moment().format('L'),
          created_by_empId: this.userInfo.id,
          is_default: formValue.isDefault
        });
      });
      let sendData = {
        "commisionPolicy": sendValue
      }

      this.settingsService.AddCommissionPolicy(sendData).subscribe((data: any) => {
        if(data.status == '200'){
          this.successToast('Payment template created successfully')
        }else{
          this.failerToast();
        }
        this.closePaymentTermModel();
        this.spinner.hide();
      });
    }else{
      formValue.paymentPolicy.map((elm) => {
        sendValue.push({
          id: this.editPaymentPolicyData.id,
          policy_name: formValue.paymentName,
          org_id : this.editPaymentPolicyData.org_id,
          term_name: elm.paymentTerms,
          term_percent: elm.perProjValue,
          createdDate: this.editPaymentPolicyData.paymentPolicy[0].createdDate,
          created_by_empId: this.editPaymentPolicyData.paymentPolicy[0].created_by_empId,
          is_default: formValue.isDefault,
          modifiedDate: moment().format('L'),
          modified_by_empId: this.userInfo.id,
          creditTerms: formValue.creditTermsDays
        });
      })
      let sendData = {
        "commisionPolicy": sendValue
      }

      this.settingsService.UpdateCommissionPolicy(sendData).subscribe((data: any) => {
        if(data.status == '200'){
          this.successToast('Payment template updated successfully')
        }else{
          this.failerToast();
        }
        this.closePaymentTermModel();
        this.spinner.hide();
      });
    }
  }

  closePaymentTermModel(){
    $("#Payment_terms_modal").modal('hide');
    (this.paymentMethodologyForm.get('paymentPolicy') as FormArray).clear();
    this.paymentMethodologyForm.reset();
    this.showPercentageError = false;
    this.showPercentageError2 = false;
    if(this.trigerReset){
      this.resetDropDown.value = null;
    }
    this.trigerReset = false;
    this.GetPaymentPolicyByOrgId();
  }

  deletePaymentTerm(data){
    this.editPaymentPolicyData = data;
    Swal.fire({
      title: `Delete this ${data.paymentName} Template ?`,
      text: "Please Note you won't be able to revert this",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        let sendValue = []
        this.editPaymentPolicyData.paymentPolicy.map((elm) => {
          sendValue.push({
            id: this.editPaymentPolicyData.id,
            policy_name: this.editPaymentPolicyData.paymentName,
            org_id : this.editPaymentPolicyData.org_id,
            term_name: elm.term_name,
            term_percent: elm.term_percent,
            creditTerms: this.editPaymentPolicyData.paymentPolicy[0].creditTerms,
            createdDate: this.editPaymentPolicyData.createdDate,
            created_by_empId: this.editPaymentPolicyData.paymentPolicy[0].created_by_empId,
            is_default: this.editPaymentPolicyData.is_default,
            modifiedDate: this.editPaymentPolicyData.paymentPolicy[0].modifiedDate,
            modified_by_empId: this.editPaymentPolicyData.paymentPolicy[0].modified_by_empId,
            is_deleted: true,
          });
        })
        let sendData = {
          "commisionPolicy": sendValue
        }
        this.settingsService.UpdateCommissionPolicy(sendData).subscribe((data: any) => {
          if(data.status == '200'){
            this.successToast('Payment Template Deleted Successfully')
          }else{
            this.failerToast();
          }
          this.GetPaymentPolicyByOrgId();
        });
      }
    });
  }

  createPaymentMethodologyForm(){
    this.paymentMethodologyForm = this.formBuilder.group({
      paymentName: ['', [Validators.required]],
      creditTermsDays: [''],
      isDefault: [''],
      paymentPolicy: this.formBuilder.array([]),
		});
  }

  createPaymentPolicy(){
    return this.formBuilder.group({
			paymentTerms: [''],
			perProjValue: ['', [Validators.required, Validators.max(100)]]
		})
  }

  get paymentName() {
		return this.paymentMethodologyForm.get('paymentName');
	}

  get paymentPolicy(): FormArray {
		return this.paymentMethodologyForm.get('paymentPolicy') as FormArray;
	}

  //to generate random profile ID
  generateId(length){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ){
      result += characters.charAt(Math.floor(Math.random() * charactersLength ));
    }
    return result;
  }

  successToast(desc){
    this.toastr.success(desc);
  }

  //failure message
  failerToast(){
    let desc = 'Something went wrong';
    this.toastr.error(desc);
  }

  backToMainIncome(){
    this.Router.navigate(['settings-new/finance/commission']);
  }

}
