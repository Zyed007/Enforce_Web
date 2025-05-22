import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//reactive form
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import moment = require('moment');
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { CostService } from '../../../../services/cost.service';
import { settingsService } from '../../../../services/settings.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as _ from "lodash";
import Swal from 'sweetalert2';
//js
declare var $: any;

@Component({
  selector: 'app-add-payment-term',
  templateUrl: './add-payment-term.component.html',
  styleUrls: ['./add-payment-term.component.scss']
})
export class AddPaymentTermComponent implements OnInit {

  public paymentMethodologyForm: FormGroup;
  isValidFormSubmitted: boolean | null = null;
  contractTypeData;
  mileStoneData;
  commonFields: Object = { text: "value", value: "id" };
  triggerData = [
    {
      id:'Upon Signing contract',
      value:'Upon Signing contract',
    },
    {
      id:'Upon completing',
      value:'Upon completing'
    }
  ];
  showPercentageError = false;
  userInfo:any = JSON.parse(localStorage.getItem('user_info'));
  paymentPolicyData;
  editPaymentPolicy = false;
  editPaymentPolicyData;
  isDefaultProfile = false;
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
  checkRetType = false;
  @ViewChild('paymentGrid' , {static: false}) public paymentGrid: GridComponent;
  paymentGridToolItems: ToolbarItems[];


  constructor(
    public Router :Router,
    public formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr:ToastrService,
    private costService: CostService,
    public settingService: settingsService
  ) { }

  ngOnInit(){
    this.paymentGridToolItems = ['Search'];
    this.createPaymentMethodologyForm();
    this.GetPaymentPolicyByOrgId();
  }

  //get payment policy for org
  GetPaymentPolicyByOrgId(){
    let sendData = {
      orgID: localStorage.getItem('org_id')
    }
    this.costService.GetPaymentPolicyByOrgId(sendData).subscribe((data: any) => {
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
    console.log(data)
    let serverData = _.values( _.groupBy(data, 'id'));
    let paymentData = [];
    let payment
    serverData.map((elm) => {
      let pPolicy = [];
      elm.map((elm2) => {
        payment = {
          paymentName : elm2.policy_name,
          serviceId : elm2.serviceId,
          serviceName : elm2.serviceName,
          creditTermsDays : elm2.creditTerms,
          retensionPercentage : elm2.retetionPercent,
          createdDate: elm2.createdDate,
          emp_name: elm2.emp_name,
          is_default: elm2.is_default
        }
        pPolicy.push(elm2)
      });
      payment["paymentPolicy"] = pPolicy;
      paymentData.push(payment)
    });
    this.paymentPolicyData = paymentData;
    console.log(this.paymentPolicyData)
  }
  //get payment policy for org

  //Add payment terms
  openPaymentTermModel(){
    $("#Payment_terms_modal").modal('show');
    this.paymentMethodologyForm.patchValue({
      creditTermsDays: 'Immediately'
    });
    this.addItemRow();
    this.GetEstimationServiceByOrgId();
  }

  GetEstimationServiceByOrgId(){
    let contractType;
    this.settingService.GetEstimationServiceByOrgId().subscribe((data: any) => {
      if(data.length !== 0){
        let serviceData = _.values(_.groupBy(data, 'id'));
        let serviceDataProcess = [];
        serviceData.map((elm, e) => {
          let milestone = [];
          milestone.push({id: 'Advance', value: 'Advance'});
          elm.map((elm2, e2) => {
            milestone.push({
              id: elm2.milestoneName,
              value: elm2.milestoneName,
            });

            if(elm.length === e2+1){
              let serviceObj = {
                id: elm2.id,
                value: elm2.serviceName,
                milestone: milestone,
              }
              serviceDataProcess.push(serviceObj);
            }
          });
          if(serviceData.length === e+1){
            contractType = _.uniqBy(serviceDataProcess, 'id');
            this.contractTypeData = contractType;
            this.spinner.hide();

            if(this.editPaymentPolicy){
              this.patchValues();
            }
          }
        });
      }else{
        this.contractTypeData = data;
      }
    });
  }

  changeContractType(data){
    if(data.value !== null){
      this.mileStoneData = data.itemData.milestone;
    }
  }

  checkRetension(value){
    if(value === 'Yes'){
      this.checkRetType = true;
    }else{
      this.checkRetType = false;
    }
  }

  //edit payment terms
  editPayTemp(data){
    this.editPaymentPolicy = true;
    (this.paymentMethodologyForm.get('paymentPolicy') as FormArray).clear();
    this.editPaymentPolicyData = data;
    this.GetEstimationServiceByOrgId();
    $("#Payment_terms_modal").modal('show');
  }

  patchValues(){
    this.editPaymentPolicyData.retensionPercentage === null ? this.checkRetType = false : this.checkRetType = true;
    this.isDefaultProfile = this.editPaymentPolicyData.paymentPolicy[0].is_default === null ? false : this.editPaymentPolicyData.paymentPolicy[0].is_default;
    this.paymentMethodologyForm.patchValue({
      paymentName: this.editPaymentPolicyData.paymentName,
      contractType: this.editPaymentPolicyData.serviceId,
      creditTermsDays: this.editPaymentPolicyData.creditTermsDays,
      retensionPercentage: this.editPaymentPolicyData.retensionPercentage
    });
    let formData = this.paymentMethodologyForm.get('paymentPolicy') as FormArray;
    this.editPaymentPolicyData.paymentPolicy.map((elm) => {
      formData.push(this.formBuilder.group({
        paymentTerms: elm.term_name,
        perProjValue: elm.term_percent,
        mileStone: elm.stage_name,
        triggerEvent: elm.payment_event,
        triggerPerValue: elm.paymentEventpercent,
      }));
    });
  }

  //set payment term name
  returnItem(i){
    let number = i+1
    this.paymentPolicy.at(i).patchValue({
      paymentTerms: this.ordinalSuffixOf(number)+' Payment'
    });
    this.paymentPolicy.controls[i].get('paymentTerms').disable();
  }

  ordinalSuffixOf(i) {
    var j = i % 10,k = i % 100;
    if(j == 1 && k != 11){return i + "st";}
    if(j == 2 && k != 12){return i + "nd";}
    if(j == 3 && k != 13){return i + "rd";}
    return i + "th";
  }
  //set payment term name

  //form array add row
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
      let formValue = this.paymentPolicy.value
      formValue.map((elm, index) => {
        if(elm.triggerEvent === 'Upon Signing contract'){
          formValue.length - 1
          var length = formValue.length, except = index,result = Array
          .from({ length }, (_, i) => i)
          .filter(n => n !== except);

          result.map((elm) => {
            this.paymentPolicy.at(elm).patchValue({
              triggerEvent: 'Upon completing'
            })
          })
        }
      });
    }
	}
  //form array delete row
  deletePayment(i){
    this.paymentPolicy.removeAt(i)
  }

  returnTotalPercentage(){
    let formValue = this.paymentMethodologyForm.getRawValue();
    let getPerTotal = [];
    formValue.paymentPolicy.map((elm) => {
      if(elm.perProjValue !== ''){
        getPerTotal.push(parseInt(elm.perProjValue))
      }
    });
    const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
    return sumProj;
  }

  //add and update payment
  savePaymentTerms(){
    this.showPercentageError = false;
		this.isValidFormSubmitted = false;
		if(this.paymentMethodologyForm.invalid){
			return;
		}
		this.isValidFormSubmitted = true;
    this.spinner.show();
    let formValue = this.paymentMethodologyForm.getRawValue();
    //check if 100%
    let getPerTotal = [];
    formValue.paymentPolicy.map((elm) => {
      if(elm.perProjValue !== ''){
        getPerTotal.push(parseInt(elm.perProjValue))
      }
    });
    const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
    //check if 100%
    if(sumProj !== 100){
      this.showPercentageError = true;
      this.spinner.hide();
    }else{
      let sendValue = [];
      this.spinner.hide();
      if(this.editPaymentPolicy){
        formValue.paymentPolicy.map((elm) => {
          sendValue.push({
            id: this.editPaymentPolicyData.paymentPolicy[0].id,
            serviceId: formValue.contractType,
            policy_name: formValue.paymentName,
            is_superAdmin: this.userInfo.is_superadmin,
            org_id : localStorage.getItem('org_id'),
            term_name: elm.paymentTerms,
            term_percent: elm.perProjValue,
            stage_name: elm.mileStone,
            payment_event: elm.triggerEvent,
            paymentEventpercent: elm.triggerPerValue,
            createdDate: this.editPaymentPolicyData.paymentPolicy[0].createdDate,
            created_by_empId: this.editPaymentPolicyData.paymentPolicy[0].created_by_empId,
            is_default: this.isDefaultProfile,
            modifiedDate: moment().format('L'),
            modified_by_empId: this.userInfo.id,
            creditTerms: formValue.creditTermsDays,
            retetionPercent: !this.checkRetType ? null : formValue.retensionPercentage
          });
        })
        let sendData = {
          "paymentPolicy": sendValue
        }
        this.costService.UpdatePaymentPolicy(sendData).subscribe((data: any) => {
          if(data.status == '200'){
            this.successToast('Payment Template Updated Successfully')
          }else{
            this.failerToast();
          }
          this.closePaymentTermModel();
          this.showPercentageError = false;
        });
      }else{
        let uniqueID = this.generateId(10);
        formValue.paymentPolicy.map((elm) => {
          sendValue.push({
            id: uniqueID,
            serviceId: formValue.contractType,
            policy_name: formValue.paymentName,
            is_superAdmin: this.userInfo.is_superadmin,
            org_id : localStorage.getItem('org_id'),
            term_name: elm.paymentTerms,
            term_percent: elm.perProjValue,
            stage_name: elm.mileStone,
            payment_event: elm.triggerEvent,
            paymentEventpercent: elm.triggerPerValue,
            is_default: this.isDefaultProfile,
            createdDate: moment().format('L'),
            created_by_empId: this.userInfo.id,
            creditTerms: formValue.creditTermsDays,
            retetionPercent: !this.checkRetType ? null : formValue.retensionPercentage
          });
        })

        let sendData = {
          "paymentPolicy": sendValue
        }

        this.costService.AddPaymentPolicy(sendData).subscribe((data: any) => {
          if(data.status == '200'){
            this.successToast('Payment Template Created Successfully')
          }else{
            this.failerToast();
          }
          this.closePaymentTermModel();
          this.showPercentageError = false;
        });
      }
    }
	}

  closePaymentTermModel(){
    this.checkRetType = false;
    this.editPaymentPolicy = false;
    this.isDefaultProfile = false;
    this.mileStoneData = [];
    this.isValidFormSubmitted = true;
    $("#Payment_terms_modal").modal('hide');
    (this.paymentMethodologyForm.get('paymentPolicy') as FormArray).clear();
    this.paymentMethodologyForm.reset()
    this.GetPaymentPolicyByOrgId();
    this.spinner.hide();
  }

  addPayProfDefault(event){
    this.isDefaultProfile = event.srcElement.checked;
  }

  deletePayTemp(data){
    (this.paymentMethodologyForm.get('paymentPolicy') as FormArray).clear();
    this.editPaymentPolicyData = data;
    Swal.fire({
      title: 'Delete this Payment Template ?',
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
            id: this.editPaymentPolicyData.paymentPolicy[0].id,
            policy_name: this.editPaymentPolicyData.paymentName,
            is_superAdmin: this.userInfo.is_superadmin,
            org_id : localStorage.getItem('org_id'),
            term_name: elm.paymentTerms,
            term_percent: elm.perProjValue,
            stage_name: elm.mileStone,
            payment_event: elm.triggerEvent,
            paymentEventpercent: elm.triggerPerValue,
            createdDate: this.editPaymentPolicyData.paymentPolicy[0].createdDate,
            created_by_empId: this.editPaymentPolicyData.paymentPolicy[0].created_by_empId,
            is_default: false,
            modifiedDate: moment().format('L'),
            modified_by_empId: this.userInfo.id,
            is_deleted: true,
          });
        })
        let sendData = {
          "paymentPolicy": sendValue
        }
        this.costService.UpdatePaymentPolicy(sendData).subscribe((data: any) => {
          if(data.status == '200'){
            this.successToast('Payment Template Deleted Successfully')
          }else{
            this.failerToast();
          }
          this.closePaymentTermModel();
          this.showPercentageError = false;
        });
      }
    });
  }

  successToast(desc){
    this.toastr.success(desc);
  }

  //failure message
  failerToast(){
    let desc = 'Something went wrong';
    this.toastr.error(desc);
  }

  createPaymentMethodologyForm(){
    this.paymentMethodologyForm = this.formBuilder.group({
      paymentName: ['', [Validators.required]],
      contractType: ['', [Validators.required]],
      paymentPolicy: this.formBuilder.array([]),
      creditTermsDays: [''],
      retensionPercentage: ['']
		});
  }

  createPaymentPolicy(){
    return this.formBuilder.group({
			paymentTerms: [''],
			perProjValue: ['', [Validators.required, Validators.max(100)]],
      mileStone: ['', [Validators.required]],
      triggerEvent: ['', [Validators.required]],
      triggerPerValue: ['', [Validators.required, Validators.max(100)]]
		})
  }

  get paymentName() {
		return this.paymentMethodologyForm.get('paymentName');
	}

  get contractType() {
		return this.paymentMethodologyForm.get('contractType');
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

  backToMainEstimation(){
    this.Router.navigate(['settings-new/estimation']);
  }

  paymentSearchKeyUp(): void {
    document.getElementById(this.paymentGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.paymentGrid.search((event.target as HTMLInputElement).value)
    });
  }

}
