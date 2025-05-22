import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import moment = require('moment');
import { ProjectService } from '../../../../services/project.service';
import { TeamService } from '../../../../services/team.service';
import { R } from '@angular/cdk/keycodes';
import { EmployeeService } from '../../../../services/employee.service';


@Component({
  selector: 'app-field-management',
  templateUrl: './field-management.component.html',
  styleUrls: ['./field-management.component.scss']
})

export class FieldManagementComponent implements OnInit {
  userInfo = JSON.parse(localStorage.getItem('user_info'));
  org_id = this.userInfo.org_id || localStorage.getItem('org_id')
  fieldForm = this.fb.group({});

  fieldGroupListing = true;
  selectedFieldGroup = '';
  selectedId = ''
  locListing = true;
  fieldGroupData = [
    // {
    //   field_group: 'Basic Details',
    //   field_items: [
    //     { field_name: 'emergency_contact', onshore: true, offshore: false },
    //     { field_name: 'guardian_contact_name', onshore: false, offshore: true }
    //   ]
    // },
    // {
    //   field_group: 'Passport Info',
    //   field_items: [
    //     { field_name: 'passport_num', onshore: true, offshore: true },
    //     { field_name: 'pass_issue_date', onshore: true, offshore: false }
    //   ]
    // }
  ];
  filteredFieldGroupData = []
  locNames;

  constructor(
    public Router: Router,
    private fb: FormBuilder,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private teamService: TeamService,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit() {
    this.fieldForm = this.fb.group({
      field_group: '',
      fields: this.fb.array([])
    });
    this.GetAllFieldSettingByOrgId();
    this.getFieldData();

    console.log(this.fieldForm, "testing initial data")
  }
  isLoading = false;








  getFieldData() {
    this.locNames = [];

    this.isLoading = true;
    let postData = {
      "orgID": localStorage.getItem('org_id')
    }



    this.employeeService.GetWorkLocationByOrgId(postData).subscribe((data) => {
      this.locNames = data;

      console.log(data, "...///|||")
      this.isLoading = false;
      console.log(this.locNames)
    })

    console.log(this.locNames)
  }
  async goBack() {
    if (this.locListing) {
      window.history.go(-1);
    } else if (this.fieldGroupListing == true && this.locListing == false ) {
      this.locListing = true;
      this.fieldGroupListing = true
    }
    else if (this.fieldGroupListing == false && this.locListing == false) {
      this.fieldGroupListing  = true
      this.locListing = false
      // this.spinner.show()
      // await this.GetAllFieldSettingByOrgId()
      // setTimeout(() => {
      //   this.spinner.hide()
      // }, 1000)

    }
  }
  cardClick(id) {
    console.log(id, "Test")
    this.spinner.show()
    this.filteredFieldGroupData = [];
    this.selectedId = id
    this.filterFieldGroupData();
    setTimeout(() => {
      this.spinner.hide()
    }, 1000)
    this.locListing = false;
    this.fieldGroupListing = true;
    console.log(this.fieldGroupData, "*****")

  }
  filterFieldGroupData() {
    this.filteredFieldGroupData = this.fieldGroupData.filter((i) => i.work_loc == this.selectedId)
  }

  editGroup(group: any) {
    this.fields.clear();
    this.selectedFieldGroup = group.field_group;
    let field_data = group.field_data
    if (field_data.length > 0) {
      field_data.forEach((item) => this.addFieldItem(item));
    } else {
      this.addField()
    }
    this.fieldGroupListing = false;
  }


  get fields(): FormArray {
    return this.fieldForm.get('fields') as FormArray;
  }

  addFieldItem(fieldData: any) {
    console.log(fieldData, "required!!!")
    const field = this.fb.group({
      field_name: [fieldData.field_name],
      required: [fieldData.required],

    });
    this.fields.push(field);
  }
  addField(): void {
    const fieldGroup = this.fb.group({
      field_name: ['', Validators.required],
      required: [false],
    });
    this.fields.push(fieldGroup);
  }
  deleteField(index: number): void {
    const fields = this.fieldForm.get('fields') as FormArray;
    fields.removeAt(index);
  }
  async save() {
    let field_group = this.selectedFieldGroup;
    let field_data = this.fields.value;

    const postData = {
      field_group: field_group,
      field_data: JSON.stringify(field_data),
      org_id: this.org_id,
      modified_by: this.userInfo.full_name
    };

    this.spinner.show();

    try {
      console.log(field_group, field_data, "TEST");

      const res: any = await this.teamService.UpdateFieldSettings(postData).toPromise();

      if (res.status === '200') {
        this.fieldGroupListing = true;
        await this.GetAllFieldSettingByOrgId();
        this.filterFieldGroupData();
        this.toast.success('Fields Updated Successfully');
      } else {
        this.toast.error('Failed to update fields');
      }

      console.log(res, "res****");

    } catch (error) {
      console.error("Error in saving field settings:", error);
      this.toast.error('Something went wrong while updating.');
    } finally {
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }
  }

  async GetAllFieldSettingByOrgId() {
    let res: any = await this.teamService.GetAllFieldSettingByOrgId({ 'orgID': this.org_id }).toPromise();
    console.log(res,"testing purposeeee")
    if (res && res.length > 0) {

      this.fieldGroupData = res.map((i) => {
        const parsedData = i.field_data ? JSON.parse(i.field_data) : [];
        return {
          ...i,
          field_data: parsedData,
          field_data_count: parsedData.length
        };
      });


    }
  }
}
