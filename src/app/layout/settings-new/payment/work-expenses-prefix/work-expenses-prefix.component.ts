import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import moment = require('moment');
import { ProjectService } from '../../../../services/project.service';


@Component({
  selector: 'app-work-expenses-prefix',
  templateUrl: './work-expenses-prefix.component.html',
  styleUrls: ['./work-expenses-prefix.component.scss']
})

export class WorkExpensesPrefixComponent implements OnInit {
  formattedPrefixDate = moment().format('YY/MM');
  formattedPrefix: string;
  inputType;
  mainCtravelPrefListing = true;
  workExpensesPrefixForm: FormGroup;
  editworkExpensesPrefixDiv = false;
  currentUser = JSON.parse(localStorage.getItem('user_info'));
  prefixTxtError = false;
  sequenceNumberError = false;
  allworkExpensesPrefixData;
  editworkExpensesPrefixData;
  example;
  exampletxt;
  disableSeqNum = true;
  showInputOpt = true;

  constructor(
    public Router: Router,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.workExpensesPrefixFormInputs();
    this.GetAllPrefixByOrgID();
  }

  GetAllPrefixByOrgID() {
    this.projectService.GetAllPrefixByOrgID().subscribe((data: any) => {
      let result = []
      data.map((elm, ind) => {
        if (elm.type === 'we') {
          result.push(elm)
        }

        if (data.length === ind + 1) {
          this.allworkExpensesPrefixData = result;
        }
        console.log(this.allworkExpensesPrefixData,"CHECK")
      });
    });
  }

  openworkExpensesPrefix() {
    this.mainCtravelPrefListing = false;
    this.workExpensesPrefixForm.patchValue({
      prefixFor: 'Default'
    });
    this.formattedPrefix = this.formattedPrefixDate + '/0000';
    this.inputType = 'text';
    this.disableSeqNum = true;
    this.showInputOpt = true;
    this.exampletxt = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
    this.example = 'Eg: ENQ/20/08/0000,ENQ/20/08/0001';
  }

  editSingletravelPre(data) {
    this.spinner.show();
    this.editworkExpensesPrefixDiv = true;
    this.editworkExpensesPrefixData = data;
    this.mainCtravelPrefListing = false;
    this.workExpensesPrefixForm.patchValue({
      prefix: this.editworkExpensesPrefixData.prefix_ext,
      prefixFor: this.editworkExpensesPrefixData.prefix_for
    });

    if (this.editworkExpensesPrefixData.prefix_for === 'Custom') {
      this.formattedPrefix = '';
      this.disableSeqNum = true;
      this.showInputOpt = false;
      this.exampletxt = 'User is allowed to enter custom prefix';
      this.example = '';
    } else if (this.editworkExpensesPrefixData.prefix_for === 'Sequence') {
      let lastAddprefixSplit = this.editworkExpensesPrefixData.prefix_name.split('/').pop();
      this.formattedPrefix = lastAddprefixSplit;
      this.disableSeqNum = false;
      this.showInputOpt = true;
      this.exampletxt = 'You can create a custom reference or prefix with a combination of letters and numbers and set the starting number for the sequence. If needed, you can manually override the system-generated voucher number, and the system will adjust future voucher numbers accordingly.';
      this.example = 'For example, Inc/0001.';
    } else {
      this.formattedPrefix = this.formattedPrefixDate + '/0000';
      this.exampletxt = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.If needed, you can manually override the system-generated voucher number, and the system will adjust future voucher numbers accordingly.'
      this.example = 'For example, ENQ/20/08/0000,ENQ/20/08/0001';
      this.disableSeqNum = true;
      this.showInputOpt = true;
    }

    this.spinner.hide();
  }

  changePrefixFor() {
    let value = this.workExpensesPrefixForm.get('prefixFor').value;
    if (value === 'Custom') {
      this.formattedPrefix = '';
      this.workExpensesPrefixForm.patchValue({
        prefixFor: 'Custom'
      });
      this.disableSeqNum = true;
      this.showInputOpt = false;
      this.exampletxt = 'User is allowed to enter custom prefix';
      this.example = '';
    } else if (value === 'Sequence') {
      this.formattedPrefix = '';
      this.workExpensesPrefixForm.patchValue({
        prefixFor: 'Sequence'
      });
      this.disableSeqNum = false;
      this.showInputOpt = true;
      this.inputType = 'number';
      this.exampletxt = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.';
      this.example = 'For example, Inc/0001.';
    } else {
      this.formattedPrefix = '';
      this.workExpensesPrefixForm.patchValue({
        prefixFor: 'Default'
      });
      this.disableSeqNum = true;
      this.showInputOpt = true;
      this.inputType = 'text';
      this.formattedPrefix = this.formattedPrefixDate + '/0000';
      this.exampletxt = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
      this.example = 'For example, ENQ/20/08/0000,ENQ/20/08/0001';
    }
  }

  getInputValue(event) {
    this.formattedPrefix = event.srcElement.value
  }

  submitworkExpensesPrefix() {
    this.prefixTxtError = false;
    this.sequenceNumberError = false;
    let formVaue = this.workExpensesPrefixForm.value;

    if (formVaue.prefix === '' || formVaue.prefix === null) {
      this.prefixTxtError = true;
      return
    }
    if (!this.disableSeqNum && this.formattedPrefix === '') {
      this.sequenceNumberError = true;
      return
    }

    if (this.editworkExpensesPrefixDiv) {
      let postData = {
        id: this.editworkExpensesPrefixData.id,
        type: "we",
        prefix_ext: (formVaue.prefix).toUpperCase(),
        prefix_name: (formVaue.prefix).toUpperCase() + (formVaue.prefixFor === "Custom" ? '' : '/' + this.formattedPrefix),
        prefix_for: formVaue.prefixFor,
        is_manual_allowed: this.editworkExpensesPrefixData.is_manual_allowed,
        is_revised: this.editworkExpensesPrefixData.is_revised,
        created_date: this.editworkExpensesPrefixData.created_date,
        createdby: this.editworkExpensesPrefixData.createdby,
        org_id: this.editworkExpensesPrefixData.org_id,
        modifiedby: this.currentUser.full_name,
        modified_date: moment().format('L')
      }

      this.projectService.UpdatePrefix(postData).subscribe((data: any) => {
        if (data.status === '200') {
          this.backToMainworkExpensesPrefix();
          this.toast.success(data.desc)
        } else {
          this.toast.error('Something went wrong')
        }
      });

    } else {
      let postData = {
        type: "we",
        prefix_ext: (formVaue.prefix).toUpperCase(),
        prefix_name: (formVaue.prefix).toUpperCase() + (formVaue.prefixFor === "Custom" ? '' : '/' + this.formattedPrefix),
        prefix_for: formVaue.prefixFor,
        is_manual_allowed: false,
        is_revised: false,
        created_date: moment().format('L'),
        createdby: this.currentUser.full_name,
        org_id: this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id')
      }

      this.projectService.AddPrefix(postData).subscribe((data: any) => {
        if (data.status === '200') {
          this.backToMainworkExpensesPrefix();
          this.toast.success(data.desc)
        } else {
          this.toast.error('Something went wrong')
        }
      });

    }
  }

  backToMainworkExpensesPrefix() {
    if (this.mainCtravelPrefListing) {
      this.Router.navigate(['settings-new/payment']);
    } else {
      this.editworkExpensesPrefixDiv = false;
      this.mainCtravelPrefListing = true;
      this.prefixTxtError = false;
      this.sequenceNumberError = false;
      this.disableSeqNum = false;
      this.GetAllPrefixByOrgID();
      this.workExpensesPrefixForm.reset();
    }
  }

  deletetravelPref(data) {
    this.projectService.RemovePrefix({ id: data.id }).subscribe((data: any) => {
      if (data.status === '200') {
        this.GetAllPrefixByOrgID();
        this.toast.success(data.desc)
      } else {
        this.toast.error('Something went wrong')
      }
    });
  }

  workExpensesPrefixFormInputs() {
    this.workExpensesPrefixForm = this.formBuilder.group({
      prefix: [''],
      prefixFor: ['']
    });
  }

}
