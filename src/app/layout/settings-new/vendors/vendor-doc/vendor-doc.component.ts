import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { settingsService } from '../../../../services/settings.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import moment = require('moment');

@Component({
  selector: 'app-vendor-doc',
  templateUrl: './vendor-doc.component.html',
  styleUrls: ['./vendor-doc.component.scss']
})
export class VendorDocComponent implements OnInit {

  currentUser:any = JSON.parse(localStorage.getItem('user_info'));
  orgID =  this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id');
  @ViewChild('vendDocGrid' , {static: false}) public vendDocGrid: GridComponent;
  docVenGridToolItems: ToolbarItems[];
  venDocListListing = true;
  docVendorTableData;
  docVendorForm: FormGroup;
  formSubmitAttemptForDocument = false;
  docFormTypeData:any = 'Add'

  constructor(
    public settingsService: settingsService,
    public Router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.docVenGridToolItems = ['Search'];
    this.docVendorFormInputs();
    this.GetVendorDocumentUploadTypeByOrgId();
  }

  GetVendorDocumentUploadTypeByOrgId(){
    this.settingsService.GetVendorDocumentUploadTypeByOrgId().subscribe((data:any) => {
      this.docVendorTableData = data;
      this.spinner.hide();
    });
  }

  openVenDoc(type){
    this.docFormTypeData = type;
    this.venDocListListing = false;
    if(this.docFormTypeData !== 'Add'){
      this.docVendorForm.patchValue({
        docName: this.docFormTypeData.name,
        docDesc: this.docFormTypeData.description,
        isRequired: this.docFormTypeData.isRequired,
        isExpiryReq: this.docFormTypeData.isExpiryReq
      });
    }else{
      this.docVendorForm.patchValue({
        isRequired: false,
        isExpiryReq: false
      });
    }
  }

  submitDoc(){
    this.spinner.show();
    this.formSubmitAttemptForDocument = true;
    if(this.docVendorForm.invalid){
      this.spinner.hide();
      return
    }

    let formValue = this.docVendorForm.value;
    if(this.docFormTypeData === 'Add'){
      let postData = {
        org_id: this.orgID,
        name: formValue.docName,
        description: formValue.docDesc,
        isRequired: formValue.isRequired,
        isExpiryReq: formValue.isExpiryReq,
        createdDate: moment().format('L'),
        createdByEmpId: this.currentUser.id,
        createdBy: this.currentUser.full_name
      }

      this.settingsService.AddVendorDocumentUploadType(postData).subscribe((data:any) => {
        if(data.status === '200'){
          this.toast.success('Vendor Document Type Added');
          this.backToListing();
        }
      });
    }else{
      let postData = {
        id: this.docFormTypeData.id,
        org_id: this.docFormTypeData.org_id,
        name: formValue.docName,
        description: formValue.docDesc,
        isRequired: formValue.isRequired,
        isExpiryReq: formValue.isExpiryReq,
        createdDate: this.docFormTypeData.createdDate,
        modifiedDate: moment().format('L'),
        createdByEmpId: this.docFormTypeData.createdByEmpId,
        createdBy: this.docFormTypeData.createdBy,
      }

      this.settingsService.UpdateVendorDocumentUploadTypeById(postData).subscribe((data:any) => {
        if(data.status === '200'){
          this.toast.success('Vendor Document Type Updated');
          this.backToListing();
        }
      });
    }
  }

  deleteVendDoc(data){
    delete data['column'];
    delete data['foreignKeyData'];
    delete data['index'];

    Swal.fire({
      title: 'Delete this Document type - '+data.name+' ?',
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
          isRequired: data.isRequired,
          isExpiryReq: data.isExpiryReq,
          description: data.description,
          createdDate: data.createdDate,
          isDeleted: true,
          modifiedDate: data.modifiedDate,
          createdByEmpId: data.createdByEmpId,
          createdBy: data.createdBy,
        }
        this.settingsService.UpdateVendorDocumentUploadTypeById(postData).subscribe((data:any) => {
          if(data.status === '200'){
            this.toast.success('Vendor Activity Deleted');
            this.GetVendorDocumentUploadTypeByOrgId();
          }
        });
      }
    });
  }

  docVendorFormInputs(){
    this.docVendorForm = this.formBuilder.group({
      docName: ['', Validators.required],
      docDesc: [''],
      isRequired: [''],
      isExpiryReq: ['']
    });
  }

  serviceSearchKeyUp(){
    document.getElementById(this.vendDocGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.vendDocGrid.search((event.target as HTMLInputElement).value)
    });
  }

  backToListing(){
    this.venDocListListing = true;
    this.formSubmitAttemptForDocument = false;
    this.docVendorForm.reset();
    this.GetVendorDocumentUploadTypeByOrgId();
  }


  backToVendorDoc(){
    if(this.venDocListListing){
      this.Router.navigate(['settings-new/vendor']);
    }else{
      this.backToListing();
    }
  }

}
