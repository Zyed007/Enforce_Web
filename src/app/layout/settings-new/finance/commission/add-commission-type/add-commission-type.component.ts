import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { settingsService } from '../../../../../services/settings.service';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import moment = require('moment');

@Component({
  selector: 'app-add-commission-type',
  templateUrl: './add-commission-type.component.html',
  styleUrls: ['./add-commission-type.component.scss']
})
export class AddCommissionTypeComponent implements OnInit {

  @ViewChild('commissionGrid' , {static: false}) public commissionGrid: GridComponent;
  commissionGridToolItems: ToolbarItems[];
  incomeTableData;
  mainTypeCommListing = true;
  incomeForm: FormGroup;
  formSubmitAttemptForIncome = true;
  currentUser = JSON.parse(localStorage.getItem('user_info'));
  editCommissionData;
  editCommissionDiv = false;
  disableDeleteBtn = true;

  constructor(
    public Router :Router,
    public settingsService: settingsService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.commissionGridToolItems = ['Search'];
    this.GetIncomeTypeByOrgId();
    this.incomeFormInputs();
  }

  GetIncomeTypeByOrgId(){
    this.settingsService.GetIncomeTypeByOrgId().subscribe((data: any) => {
      if(data.length !== 0){
        data.map((elm, i) => {
          this.settingsService.CommisionTypeByincTypId({id:elm.id}).subscribe((data2: any) => {
            elm.incomeType = data2;

            if(data.length === i + 1){
              this.incomeTableData = data;
              this.spinner.hide();
            }
          });
        });
      }else{
        this.incomeTableData = data;
        this.spinner.hide();
      }
    });
  }

  openCommissionType(){
    this.mainTypeCommListing = false;
    this.addNewTypeName();
    this.checkTaskToDisable();
  }

  addNewTypeName() {
    let newMem = this.typeNameFormInput();
    this.incomeType.push(newMem);
    this.checkTaskToDisable();
    this.formSubmitAttemptForIncome = true;
  }

  deleteTaskRow(i: number) {
    this.incomeType.removeAt(i);
    this.checkTaskToDisable();
  }

  checkTaskToDisable(){
    let formValue = this.incomeForm.controls['incomeType'].value;
    if(formValue.length === 1){
      this.disableDeleteBtn = true
    }else{
      this.disableDeleteBtn = false
    }
  }

  submitCommissionType(){
    this.spinner.show();
    this.formSubmitAttemptForIncome = false;
    if(this.incomeForm.invalid){
      this.spinner.hide();
      return;
    }
    let formvalue = this.incomeForm.value;
    let postData = {
      org_id: this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id'),
      name: formvalue.incomeName,
      description: formvalue.incomeName,
      createdDate: moment().format('L'),
      createdByEmpId: this.currentUser.id,
      createdBy: this.currentUser.full_name
    }

    this.settingsService.AddIncomeType(postData).subscribe((incData: any) => {
      if(incData.status === '200'){
        formvalue.incomeType.map((elm, i) => {
          let postData2 = {
            org_id: this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id'),
            incTypId: incData.desc,
            name: elm.typeName,
            description: elm.typeName,
            createdDate: moment().format('L'),
            createdByEmpId: this.currentUser.id,
            createdBy: this.currentUser.full_name
          }
          this.settingsService.AddCommissionType(postData2).subscribe((data: any) => {
            if(formvalue.incomeType.length === i + 1){
              this.toast.success('Income Added');
              this.backToMainIncome();
            }
          });
        });
      }else{
        this.toast.error('Something went wrong');
        this.backToMainIncome();
      }
    });

  }


  editSingleCommission(data){
    delete data['column'];
    delete data['foreignKeyData'];
    delete data['index'];

    this.spinner.show();
    this.editCommissionData = data;
    this.mainTypeCommListing = false;
    this.editCommissionDiv = true;
    this.disableDeleteBtn = true;

    this.incomeForm.patchValue({
      incomeName: this.editCommissionData.name
    });

    let formData = this.incomeForm.get('incomeType') as FormArray;
    this.editCommissionData.incomeType.map((elm, i) => {
      formData.push(this.formBuilder.group({
        typeName: elm.name,
        id: elm.id
      }));

      if(this.editCommissionData.incomeType.length === i+1){
        this.checkTaskToDisable();
      }
    })

    this.spinner.hide();
  }

  updateCommissionType(){
    this.spinner.show();
    this.formSubmitAttemptForIncome = false;
    if(this.incomeForm.invalid){
      this.spinner.hide();
      return;
    }
    let formData = this.incomeForm.value;
    formData.incomeType.map((elm, id) => {
      if(!('id' in elm)){
        elm.id = 'new'
      }
      if(formData.incomeType.length === id+1){
        this.runFinalUpdate(formData);
      }
    });
  }

  runFinalUpdate(formData){
    let mainPostData = {
      id: this.editCommissionData.id,
      org_id: this.editCommissionData.org_id,
      name: formData.incomeName,
      description: formData.incomeName,
      createdDate: this.editCommissionData.createdDate,
      modifiedDate: moment().format('L'),
      createdByEmpId: this.editCommissionData.createdByEmpId,
      createdBy: this.editCommissionData.createdBy
    }

    this.settingsService.UpdateIncomeTypeById(mainPostData).subscribe((data: any) => {
      if(data.status === '200'){
        this.editCommissionData.incomeType.map((oldV, oV) => {
          formData.incomeType.map((newV) => {
            if(oldV.id === newV.id ){
              let postData = {
                id: oldV.id,
                org_id: oldV.org_id,
                name: newV.typeName,
                description: newV.typeName,
                incTypId: oldV.incTypId,
                createdDate: oldV.createdDate,
                modifiedDate: moment().format('L'),
                createdByEmpId: oldV.createdByEmpId,
                createdBy: oldV.createdBy
              }
              this.settingsService.UpdateCommisionType(postData).subscribe((data: any) => {
                if(this.editCommissionData.incomeType.length === oV + 1){
                  this.addAfterUpdate(formData)
                }
              });
            }
          });
        });
      }else{
        this.toast.error('Something went wrong')
      }
    });
  }

  addAfterUpdate(formData){
    formData.incomeType.map((newV, nV) => {
      if(newV.id === 'new'){
        let postData2 = {
          org_id: this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id'),
          incTypId: this.editCommissionData.id,
          name: newV.typeName,
          description: newV.typeName,
          createdDate: moment().format('L'),
          createdByEmpId: this.currentUser.id,
          createdBy: this.currentUser.full_name
        }
        this.settingsService.AddCommissionType(postData2).subscribe((data: any) => {
          if(formData.incomeType.length === nV + 1){
            this.toast.success('Income Updated');
            this.backToMainIncome();
          }
        });
      }
    })
  }

  deleteCommission(data){
    Swal.fire({
      title: 'Delete this Income - '+data.name+' ?',
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
        this.spinner.show();
        let mainPostData = {
          id: data.id,
          org_id: data.org_id,
          name: data.name,
          description: data.name,
          createdDate: data.createdDate,
          modifiedDate: data.modifiedDate ? data.modifiedDate : '',
          isDeleted: true,
          createdByEmpId: data.createdByEmpId,
          createdBy: data.createdBy
        }

        this.settingsService.UpdateIncomeTypeById(mainPostData).subscribe((resData: any) => {
          if(resData.status === '200'){

            data.incomeType.map((elm, id) => {

              let postData = {
                id: elm.id,
                org_id: elm.org_id,
                name: elm.name,
                description: elm.description,
                incTypId: elm.incTypId,
                createdDate: elm.createdDate,
                isDeleted: true,
                modifiedDate: elm.modifiedDate ? elm.modifiedDate : '',
                createdByEmpId: elm.createdByEmpId,
                createdBy: elm.createdBy
              }

              this.settingsService.UpdateCommisionType(postData).subscribe((serData: any) => {
                if(data.incomeType.length === id + 1){
                  this.toast.error('Income Deleted');
                  this.editCommissionDiv = false;
                  this.GetIncomeTypeByOrgId();
                }
              });
            });
          }
        });
      }
    });
  }

  serviceSearchKeyUp(): void {
    document.getElementById(this.commissionGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.commissionGrid.search((event.target as HTMLInputElement).value)
    });
  }

  backToMainIncome(){
    if(this.mainTypeCommListing){
      this.Router.navigate(['settings-new/finance/commission']);
    }else{
      this.formSubmitAttemptForIncome = true;
      this.GetIncomeTypeByOrgId();
      (this.incomeForm.get('incomeType') as FormArray).clear();
      this.incomeForm.reset();
      this.mainTypeCommListing = true;
    }
  }

  incomeFormInputs(){
    this.incomeForm = this.formBuilder.group({
      incomeName: ['', Validators.required],
      incomeType: this.formBuilder.array([],[Validators.required])
    });
  }

  get incomeType(): FormArray {
    return this.incomeForm.get('incomeType') as FormArray;
  }

  typeNameFormInput(){
    return this.formBuilder.group({
      typeName: ['', [Validators.required]]
    });
  }

}
