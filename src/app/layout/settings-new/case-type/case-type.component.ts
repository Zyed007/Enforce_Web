import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import moment = require('moment');
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
//service
import {AdministrativeService} from '../../../services/administrative.service';

declare var $: any;

@Component({
  selector: 'app-case-type',
  templateUrl: './case-type.component.html',
  styleUrls: ['./case-type.component.scss']
})
export class CaseTypeComponent implements OnInit {

  caseTypeData;
  @ViewChild('caseTypeGrid' , {static: false}) public caseTypeGrid: GridComponent;
  caseTypeGridToolItems: ToolbarItems[];
  addCaseProcessForm: FormGroup;
  caseType;
  currentUpdateCaseType;

  constructor(
    public Router :Router,
    private formBuilder: FormBuilder,
    public administrativeService: AdministrativeService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.caseTypeGridToolItems = ['Search'];
    this.addCaseProcessFormInputs();
    this.GetAllCaseTypeByOrgId();
  }

  GetAllCaseTypeByOrgId(){
    this.administrativeService.GetAllCaseTypeByOrgId().subscribe((data: any) => {
      this.caseTypeData = data;
    })
  }

  caseTypeGridSearchKeyUp(): void {
    document.getElementById(this.caseTypeGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.caseTypeGrid.search((event.target as HTMLInputElement).value)
    });
  }

  openAddCaseModel(type){
    $("#add-case-type-modal").modal('show');
    if(type.id){
      this.caseType = 'Update';
      let postData = {
        id: type.id
      }
      this.administrativeService.GetCaseTypeByID(postData).subscribe((data: any) => {
        console.log(data)
        this.currentUpdateCaseType = data[0];
        this.addCaseProcessForm.patchValue({
          caseName: this.currentUpdateCaseType.case_type,
          caseDescription: this.currentUpdateCaseType.case_type_description,
          isShowCheckin: this.currentUpdateCaseType.is_checkIn_required
        });
      });
    }else{
      this.caseType = 'Add';
      this.addCaseProcessForm.patchValue({
        isShowCheckin: false
      });
    }
  }

  subAddCaseData(){
    this.spinner.show();
    let formData = this.addCaseProcessForm.value;
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let org_id = localStorage.getItem('org_id');
    let postData = {
      org_id,
      case_type: formData.caseName,
      case_type_description: formData.caseDescription,
      is_checkIn_required: formData.isShowCheckin
    }

    console.log(postData);
    if(this.caseType === 'Add'){
      postData['created_date'] = moment().format('L'),
      postData['created_by'] = user_info.id,
      this.administrativeService.AddCaseType(postData).subscribe((data: any) => {
        console.log(postData, data)
        if(data.status == 200){
          this.toast.success(data['desc'], undefined,{
            positionClass: 'toast-top-center'
          });
          this.closeAddCaseModel();
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
    }else if(this.caseType === 'Update'){
      postData['id'] = this.currentUpdateCaseType.id;
      postData['created_date'] = this.currentUpdateCaseType.created_date;
      postData['created_by'] = this.currentUpdateCaseType.created_by;
      postData['created_by'] = this.currentUpdateCaseType.created_by;
      postData['modified_date'] = moment().format('L');
      postData['modified_by'] = user_info.id;
      this.administrativeService.UpdateCaseTypeById(postData).subscribe((data: any) => {
        console.log(postData, data)
        if(data.status == 200){
          this.toast.success(data['desc'], undefined,{
            positionClass: 'toast-top-center'
          });
          this.closeAddCaseModel();
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
  }

  deleteCaseModel(data){
    Swal.fire({
      title: 'Delete this case type ?',
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
        console.log(data)
        let postData = {
          id: data.id,
          org_id: data.org_id,
          case_type: data.case_type,
          case_type_description: data.case_type_description,
          created_date: data.created_date,
          created_by: data.created_by,
          modified_date: data.modified_date,
          modified_by: data.modified_by,
          is_deleted: true
        }
        this.administrativeService.UpdateCaseTypeById(postData).subscribe((data: any) => {
          console.log(postData, data)
          if(data.status == 200){
            this.toast.success('Case type deleted Successfully');
            this.GetAllCaseTypeByOrgId();
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

  closeAddCaseModel(){
    $("#add-case-type-modal").modal('hide');
    this.addCaseProcessForm.reset();
    this.GetAllCaseTypeByOrgId();
  }

  addCaseProcessFormInputs(){
    this.addCaseProcessForm = this.formBuilder.group({
      caseName:['', Validators.required],
      caseDescription:['', Validators.required],
      isShowCheckin:['']
    })
  }

  backToMainSetting(){
    this.Router.navigate(['settings-new']);
  }
}
