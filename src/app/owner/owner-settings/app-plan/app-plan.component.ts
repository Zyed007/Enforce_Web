import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import moment = require('moment');
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
//service
import { OwnerService } from '../../../services/owner.service';
import { ModuleSetupService } from '../../../services/moduleSetup.service';

@Component({
  selector: 'app-app-plan',
  templateUrl: './app-plan.component.html',
  styleUrls: ['./app-plan.component.scss']
})
export class AppPlanComponent implements OnInit {

  userInfo:any = JSON.parse(localStorage.getItem('user_info'));
  @ViewChild('planTable' , {static: false}) public planTable: GridComponent;
  planGridToolItems: ToolbarItems[];
  commonFields: Object = { text: "value", value: "id" };

  planDetailData
  planTypeData = [
    {
      id:'Monthly',
      value:'Monthly'
    },
    {
      id:'Yearly',
      value:'Yearly'
    }
  ]
  pricingTableDiv = true;
  addPlanDiv = false;
  editPlanDiv = false;
  addPlanForm: FormGroup;
  editPlanForm: FormGroup;
  formSubmitAttempt: boolean;
  monthDiv = false;
  yearDiv = false;
  checkplanDurationErrorDiv = false;
  checkplanDurationError;
  editFormValue;

  moduleListData;

  constructor(
    public Router :Router,
    public formBuilder: FormBuilder,
    public ownerService: OwnerService,
    public moduleSetupService: ModuleSetupService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.planGridToolItems = ['Search'];
    this.GetAllSubscriptionPlan();
  }

  GetAllSubscriptionPlan(){
    this.ownerService.GetAllSubscriptionPlan().subscribe((data) => {
      this.planDetailData = data
    })
  }

  //add plan
  openAddPlanDiv(){
    this.pricingTableDiv = false;
    this.addPlanDiv = true;
    this.addPlanFormFormInputs();
    this.addPlanForm.patchValue({
      planType:'Monthly',
      planDurationY: 0,
      planDurationM: 0,
    });
    this.monthDiv = true;
    this.yearDiv = false;
  }

  changePlanType(e){
    if(e.itemData.id === 'Monthly'){
      this.monthDiv = true;
      this.yearDiv = false;
      this.addPlanForm.patchValue({
        planDurationY: 0
      });
    }else if(e.itemData.id === 'Yearly'){
      this.monthDiv = false;
      this.yearDiv = true;
      this.addPlanForm.patchValue({
        planDurationM: 0
      });
    }
  }

  submitPlan(){
    let formValue = this.addPlanForm.value;
    this.formSubmitAttempt = true;
    let checkplanDuration
    if(formValue.planType === "Monthly"){
      checkplanDuration = formValue.planDurationM > 0 && formValue.planDurationM < 12
      this.checkplanDurationError = 'Month Should be greater than 0 and less than 13'
      this.checkplanDurationErrorDiv = true;
    }else{
      checkplanDuration = formValue.planDurationY > 0
      this.checkplanDurationError = 'Year Should be greater than 0'
      this.checkplanDurationErrorDiv = true;
    }
    if(this.addPlanForm.valid && checkplanDuration){
      this.spinner.show();
      let postData = {
        plan_name: formValue.planName,
        plan_description: formValue.planDescription,
        plan_type: formValue.planType,
        plan_duration: formValue.planType === "Monthly" ? formValue.planDurationM : formValue.planDurationY,
        plan_cost: formValue.planCost,
        no_of_users: formValue.noUser,
        created_date: moment().format('L'),
        created_by: this.userInfo.id
      }
      //console.log(postData)
      this.ownerService.AddSubscriptionPlan(postData).subscribe((data: any) => {
        if(data.status == 200){
          this.toast.success('Subscription plan added successfully');
        }else{
          Swal.fire(
            'Error!',
            data['result'].desc,
            'error'
          )
        }
        this.closeSubmitPlan();
      });
    }
  }
  //add plan

  //edit plan
  openEditForm(data){
    this.editPlanFormFormInputs();
    this.GetAllModules();
    this.spinner.show();
    this.pricingTableDiv = false;
    this.editPlanDiv = true;
    let postData = {
      id: data.id
    }
    this.ownerService.GetSubscriptionPlanByID(postData).subscribe((data) => {
      //console.log(data);
      this.editFormValue = data[0];
      if(data[0].plan_type === 'Monthly'){
        this.monthDiv = true;
      }else{
        this.yearDiv = true;
      }
      this.editPlanForm.patchValue({
        planName: this.editFormValue.plan_name,
        planDescription: this.editFormValue.plan_description,
        planType: this.editFormValue.plan_type,
        planDurationM: this.editFormValue.plan_type === 'Monthly' ? Number(this.editFormValue.plan_duration) : 0,
        planDurationY: this.editFormValue.plan_type === 'Yearly' ? Number(this.editFormValue.plan_duration) : 0,
        planCost: this.editFormValue.plan_cost,
        noUser: this.editFormValue.no_of_users
      });

      //push form array value
      let formData = this.editPlanForm.get('modules') as FormArray;
      if(this.editFormValue.module_id !== null){
        let moduleArrayData = this.editFormValue.module_id.split(",");
        moduleArrayData.map((elm) => {
          formData.push(this.formBuilder.group({
            moduleName: elm,
          }));
        });
      }
      //push form array value
      this.spinner.hide();
    });
  }

  //module
  GetAllModules(){
    this.moduleSetupService.GetAllModules().subscribe((data: any) => {
      let result = [];
      data.map((elm) => {
        result.push({
          id: elm.id,
          value: elm.module_name
        })
      })
      this.moduleListData = result;
    });
  }

  callModeleChange(e){

  }

  addNewModule(){
    const add = this.editPlanForm.get('modules') as FormArray;
    add.push(this.formBuilder.group({
      moduleName: []
    }));
    /* let moduleListDataResults = [];
    this.moduleListArray.filter((elm1) => {
      this.moduleListData.some((elm2) =>{
        if(elm1 !== elm2.id){
          moduleListDataResults.push(elm2)
        }
      })
    });
    this.moduleListData = moduleListDataResults;
    console.log(moduleListDataResults) */
  }

  deleteCurrentModule(index: number, moduleName){
    const add = this.editPlanForm.get('modules') as FormArray;
    add.removeAt(index)
  }

  editChangePlanType(e){
    if(e.e !== null){
      if(e.itemData.id === 'Monthly'){
        this.monthDiv = true;
        this.yearDiv = false;
        this.editPlanForm.patchValue({
          planDurationY: 0
        });
      }else if(e.itemData.id === 'Yearly'){
        this.monthDiv = false;
        this.yearDiv = true;
        this.editPlanForm.patchValue({
          planDurationM: 0
        });
      }
    }
  }

  editSubmitPlan(){
    let formValue = this.editPlanForm.value;
    let checkplanDuration
    if(formValue.planType === "Monthly"){
      checkplanDuration = formValue.planDurationM > 0 && formValue.planDurationM < 12
      this.checkplanDurationError = 'Month Should be greater than 0 and less than 13'
      this.checkplanDurationErrorDiv = true;
    }else{
      checkplanDuration = formValue.planDurationY > 0
      this.checkplanDurationError = 'Year Should be greater than 0'
      this.checkplanDurationErrorDiv = true;
    }
    if(this.editPlanForm.valid && checkplanDuration){
      this.spinner.show();
      //module send
      let moduleListSelectedtext;
      if(formValue.modules.length !== 0){
        let moduleListSelectedFinal = []
        formValue.modules.map((el) => {
          moduleListSelectedFinal.push(el.moduleName)
        });
        moduleListSelectedtext = moduleListSelectedFinal.toString();
      }
      let postData = {
        id: this.editFormValue.id,
        plan_name: formValue.planName,
        plan_description: formValue.planDescription,
        plan_type: formValue.planType,
        plan_duration: formValue.planType === "Monthly" ? formValue.planDurationM : formValue.planDurationY,
        plan_cost: formValue.planCost,
        no_of_users: formValue.noUser,
        module_id: moduleListSelectedtext !== undefined ? moduleListSelectedtext : null,
        created_date: this.editFormValue.created_date,
        created_by: this.editFormValue.created_by,
        modified_date: moment().format('L'),
        modified_by: this.userInfo.id
      }

      console.log(postData, formValue)
      this.ownerService.UpdateSubscriptionPlanByID(postData).subscribe((data: any) => {
        if(data.status == 200){
        this.toast.success('Subscription plan updated successfully.');
        }else{
          Swal.fire(
          'Error!',
          data['result'].desc,
          'error')
        }
        this.closeSubmitPlan();
      });
    }


  }
  //edit plan

  //delete
  openDeleteModel(data){
    Swal.fire({
      title: 'Delete '+data.plan_name+' plan?',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        this.spinner.hide();
        let postData = {
          id: data.id,
          plan_name: data.plan_name,
          plan_description: data.plan_description,
          plan_type: data.plan_type,
          plan_duration: data.plan_duration,
          plan_cost: data.plan_cost,
          no_of_users: data.no_of_users,
          created_date: data.created_date,
          created_by: data.created_by,
          modified_date: data.modified_date,
          modified_by: data.modified_by,
          is_deleted: true
        }
        this.ownerService.UpdateSubscriptionPlanByID(postData).subscribe((data: any) => {
          if(data.status == 200){
            this.toast.success('Plan deleted Successfully');
            this.GetAllSubscriptionPlan();
            this.spinner.hide();
          }else{
            this.spinner.hide();
            Swal.fire(
              'Error!',
              data['result'].desc,
              'error'
            )
          }
        });
      }
    });
  }
  //delete

  //common function
  closeSubmitPlan(){
    if(this.addPlanDiv){
      this.addPlanForm.reset();
      this.addPlanDiv = false;
    }else{
      this.editPlanForm.reset();
      this.editPlanDiv = false;
    }
    this.monthDiv = false;
    this.yearDiv = false;
    this.spinner.hide();
    this.GetAllSubscriptionPlan();
    this.pricingTableDiv = true;
    //no error
    this.checkplanDurationErrorDiv = false;
    this.formSubmitAttempt = false;
  }

  backToSettings(){
    if(this.addPlanDiv || this.editPlanDiv){
      this.closeSubmitPlan();
    }else{
      this.Router.navigate(['oSettings']);
    }
  }

  //formControl
  addPlanFormFormInputs(){
    this.addPlanForm = this.formBuilder.group({
      planName: ['', Validators.required],
      planDescription: ['', Validators.required],
      planType: ['', Validators.required],
      planDurationM: [''],
      planDurationY: [''],
      planCost: ['', Validators.required],
      noUser:['', Validators.required]
    });
  }

  editPlanFormFormInputs(){
    this.editPlanForm = this.formBuilder.group({
      planName: ['', Validators.required],
      planDescription: ['', Validators.required],
      planType: ['', Validators.required],
      planDurationM: [''],
      planDurationY: [''],
      planCost: ['', Validators.required],
      noUser:['', Validators.required],
      modules: this.formBuilder.array([]),
    });
  }

  planSearchKeyUp(): void {
    document.getElementById(this.planTable.element.id + "_searchbar").addEventListener('keyup', () => {
      this.planTable.search((event.target as HTMLInputElement).value)
    });
  }

}
