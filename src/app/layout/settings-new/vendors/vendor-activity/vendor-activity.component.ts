import { Component, OnInit, ViewChild } from '@angular/core';
import { settingsService } from '../../../../services/settings.service';
import { Router } from '@angular/router';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import moment = require('moment');

@Component({
  selector: 'app-vendor-activity',
  templateUrl: './vendor-activity.component.html',
  styleUrls: ['./vendor-activity.component.scss']
})
export class VendorActivityComponent implements OnInit {

  currentUser:any = JSON.parse(localStorage.getItem('user_info'));
  orgID =  this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id');
  @ViewChild('vendActGrid' , {static: false}) public vendActGrid: GridComponent;
  actVenGridToolItems: ToolbarItems[];
  actFormTypeData: any = 'Add';
  vendorListing = true;
  actVendorTableData;
  actVendorForm: FormGroup;
  formSubmitAttemptForActivity = false;

  constructor(
    public settingsService: settingsService,
    public Router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.actVenGridToolItems = ['Search'];
    this.GetVendorCategoryTypesByOrgId();
    this.actVendorFormInputs();
  }

  GetVendorCategoryTypesByOrgId(){
    this.settingsService.GetVendorCategoryTypesByOrgId().subscribe((data:any) => {
      this.actVendorTableData = data;
      this.spinner.hide();
    });
  }

  openVenAct(type){
    this.actFormTypeData = type;
    this.vendorListing = false;
    if(this.actFormTypeData !== 'Add'){
      this.actVendorForm.patchValue({
        actName: this.actFormTypeData.name,
        actDesc: this.actFormTypeData.description,
      })
    }
  }


  submitActivity(){
    this.spinner.show();
    this.formSubmitAttemptForActivity = true;
    if(this.actVendorForm.invalid){
      this.spinner.hide();
      return
    }

    let formValue = this.actVendorForm.value;
    let postData: any = {
      org_id: this.orgID,
      name: formValue.actName,
      description: formValue.actDesc,
      createdDate: moment().format('L'),
      createdByEmpId: this.currentUser.id,
      createdBy: this.currentUser.full_name
    }
    if(this.actFormTypeData === 'Add'){
      this.settingsService.AddVendorCategoryTypes(postData).subscribe((data:any) => {
        if(data.status === '200'){
          this.toast.success('Vendor Activity Added');
          this.backToListing();
        }
      });
    }else{
      postData.id = this.actFormTypeData.id;
      postData.org_id = this.actFormTypeData.org_id;
      postData.createdDate = this.actFormTypeData.createdDate;
      postData.createdByEmpId = this.actFormTypeData.createdByEmpId;
      postData.createdBy = this.actFormTypeData.createdBy;
      postData.modifiedDate = moment().format('L');
      this.settingsService.UpdateVendorCategoryTypesById(postData).subscribe((data:any) => {
        if(data.status === '200'){
          this.toast.success('Vendor Activity Updated');
          this.backToListing();
        }
      });
    }
  }

  deleteVendAct(data){
    delete data['column'];
    delete data['foreignKeyData'];
    delete data['index'];

    Swal.fire({
      title: 'Delete this Activity - '+data.name+' ?',
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
        let postData = {
          id: data.id,
          org_id: data.org_id,
          name: data.name,
          description: data.description,
          createdDate: data.createdDate,
          isDeleted: true,
          modifiedDate: data.modifiedDate,
          createdByEmpId: data.createdByEmpId,
          createdBy: data.createdBy,
        }
        this.settingsService.UpdateVendorCategoryTypesById(postData).subscribe((data:any) => {
          if(data.status === '200'){
            this.toast.success('Vendor Activity Updated');
            this.backToListing();
          }
        });
      }
    });
  }

  backToListing(){
    this.vendorListing = true;
    this.formSubmitAttemptForActivity = false;
    this.actVendorForm.reset();
    this.GetVendorCategoryTypesByOrgId();
  }

  actVendorFormInputs(){
    this.actVendorForm = this.formBuilder.group({
      actName: ['', Validators.required],
      actDesc: ['']
    });
  }

  serviceSearchKeyUp(){
    document.getElementById(this.vendActGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.vendActGrid.search((event.target as HTMLInputElement).value)
    });
  }

  backToVendor(){
    if(this.vendorListing){
      this.Router.navigate(['settings-new/vendor']);
    }else{
      this.backToListing();
    }
  }

}
