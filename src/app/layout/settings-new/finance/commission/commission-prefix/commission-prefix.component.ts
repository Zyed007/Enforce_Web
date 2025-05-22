import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ProjectService } from '../../../../../services/project.service';
import Swal from 'sweetalert2';
import moment = require('moment');

@Component({
  selector: 'app-commission-prefix',
  templateUrl: './commission-prefix.component.html',
  styleUrls: ['./commission-prefix.component.scss']
})
export class CommissionPrefixComponent implements OnInit {

  formattedPrefixDate = moment().format('YY/MM');
  formattedPrefix: string;
  inputType;
  mainCommPrefListing = true;
  commissionPrefixForm: FormGroup;
  editCommissionPrefixDiv = false;
  currentUser = JSON.parse(localStorage.getItem('user_info'));
  prefixTxtError = false;
  sequenceNumberError = false;
  allCommissionPrefixData;
  editCommissionPrefixData;
  example;
  exampletxt;
  disableSeqNum = true;
  showInputOpt = true;

  constructor(
    public Router :Router,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.commissionPrefixFormInputs();
    this.GetAllPrefixByOrgID();
  }

  GetAllPrefixByOrgID(){
    this.projectService.GetAllPrefixByOrgID().subscribe((data:any) => {
      let result = []
      data.map((elm, ind) => {
        if(elm.type === 'com'){
          result.push(elm)
        }

        if(data.length === ind + 1){
          this.allCommissionPrefixData = result;
        }
      });
    });
  }

  openCommissionPrefix(){
    this.mainCommPrefListing = false;
    this.commissionPrefixForm.patchValue({
      prefixFor: 'Default'
    });
    this.formattedPrefix = this.formattedPrefixDate+'/0000';
    this.inputType = 'text';
    this.disableSeqNum = true;
    this.showInputOpt = true;
    this.exampletxt = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
    this.example = 'Eg: ENQ/20/08/0000,ENQ/20/08/0001';
  }

  editSingleCommissionPre(data){
    this.spinner.show();
    this.editCommissionPrefixDiv = true;
    this.editCommissionPrefixData = data;
    this.mainCommPrefListing = false;
    this.commissionPrefixForm.patchValue({
      prefix: this.editCommissionPrefixData.prefix_ext,
      prefixFor: this.editCommissionPrefixData.prefix_for
    });

    if(this.editCommissionPrefixData.prefix_for === 'Custom'){
      this.formattedPrefix = '';
      this.disableSeqNum = true;
      this.showInputOpt = false;
      this.exampletxt = 'User is allowed to enter custom prefix';
      this.example = '';
    }else if(this.editCommissionPrefixData.prefix_for === 'Sequence'){
      let lastAddprefixSplit = this.editCommissionPrefixData.prefix_name.split('/').pop();
      this.formattedPrefix = lastAddprefixSplit;
      this.disableSeqNum = false;
      this.showInputOpt = true;
      this.exampletxt = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.';
      this.example = 'For example, Inc/0001.';
    }else{
      this.formattedPrefix = this.formattedPrefixDate+'/0000';
      this.exampletxt = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
      this.example = 'For example, ENQ/20/08/0000,ENQ/20/08/0001';
      this.disableSeqNum = true;
      this.showInputOpt = true;
    }

    this.spinner.hide();
  }

  changePrefixFor(){
    let value = this.commissionPrefixForm.get('prefixFor').value;
    if(value === 'Custom'){
      this.formattedPrefix = '';
      this.commissionPrefixForm.patchValue({
        prefixFor: 'Custom'
      });
      this.disableSeqNum = true;
      this.showInputOpt = false;
      this.exampletxt = 'User is allowed to enter custom prefix';
      this.example = '';
    }else if(value === 'Sequence'){
      this.formattedPrefix = '';
      this.commissionPrefixForm.patchValue({
        prefixFor: 'Sequence'
      });
      this.disableSeqNum = false;
      this.showInputOpt = true;
      this.inputType = 'number';
      this.exampletxt = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.';
      this.example = 'For example, Inc/0001.';
    }else{
      this.formattedPrefix = '';
      this.commissionPrefixForm.patchValue({
        prefixFor: 'Default'
      });
      this.disableSeqNum = true;
      this.showInputOpt = true;
      this.inputType = 'text';
      this.formattedPrefix = this.formattedPrefixDate+'/0000';
      this.exampletxt = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
      this.example = 'For example, ENQ/20/08/0000,ENQ/20/08/0001';
    }
  }

  getInputValue(event){
    this.formattedPrefix = event.srcElement.value
  }

  submitCommissionPrefix(){
    this.prefixTxtError = false;
    this.sequenceNumberError = false;
    let formVaue = this.commissionPrefixForm.value;

    if(formVaue.prefix === '' || formVaue.prefix === null){
      this.prefixTxtError = true;
      return
    }
    if(!this.disableSeqNum && this.formattedPrefix === ''){
      this.sequenceNumberError = true;
      return
    }

    if(this.editCommissionPrefixDiv){
      let postData = {
        id: this.editCommissionPrefixData.id,
        type: "com",
        prefix_ext: (formVaue.prefix).toUpperCase(),
        prefix_name: (formVaue.prefix).toUpperCase()+(formVaue.prefixFor === "Custom" ? '' : '/'+this.formattedPrefix ),
        prefix_for: formVaue.prefixFor,
        is_manual_allowed: this.editCommissionPrefixData.is_manual_allowed,
        is_revised: this.editCommissionPrefixData.is_revised,
        created_date: this.editCommissionPrefixData.created_date,
        createdby: this.editCommissionPrefixData.createdby,
        org_id: this.editCommissionPrefixData.org_id,
        modifiedby: this.currentUser.full_name,
        modified_date: moment().format('L')
      }

      this.projectService.UpdatePrefix(postData).subscribe((data:any) => {
        if(data.status === '200'){
          this.backToMainCommissionPrefix();
          this.toast.success(data.desc)
        }else{
          this.toast.error('Something went wrong')
        }
      });

    }else{
      let postData = {
        type: "com",
        prefix_ext: (formVaue.prefix).toUpperCase(),
        prefix_name: (formVaue.prefix).toUpperCase()+(formVaue.prefixFor === "Custom" ? '' : '/'+this.formattedPrefix ),
        prefix_for: formVaue.prefixFor,
        is_manual_allowed: false,
        is_revised: false,
        created_date: moment().format('L'),
        createdby: this.currentUser.full_name,
        org_id: this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id')
      }

      this.projectService.AddPrefix(postData).subscribe((data:any) => {
        if(data.status === '200'){
          this.backToMainCommissionPrefix();
          this.toast.success(data.desc)
        }else{
          this.toast.error('Something went wrong')
        }
      });

    }
  }

  backToMainCommissionPrefix(){
    if(this.mainCommPrefListing){
      this.Router.navigate(['settings-new/finance/commission']);
    }else{
      this.editCommissionPrefixDiv = false;
      this.mainCommPrefListing = true;
      this.prefixTxtError = false;
      this.sequenceNumberError = false;
      this.disableSeqNum = false;
      this.GetAllPrefixByOrgID();
      this.commissionPrefixForm.reset();
    }
  }

  deleteCommissionPref(data){
    this.projectService.RemovePrefix({id: data.id}).subscribe((data:any) => {
      if(data.status === '200'){
        this.GetAllPrefixByOrgID();
        this.toast.success(data.desc)
      }else{
        this.toast.error('Something went wrong')
      }
    });
  }

  commissionPrefixFormInputs(){
    this.commissionPrefixForm = this.formBuilder.group({
      prefix: [''],
      prefixFor: ['']
    });
  }

}
