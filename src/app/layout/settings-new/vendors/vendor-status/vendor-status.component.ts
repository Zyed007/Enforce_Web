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
  selector: 'app-vendor-status',
  templateUrl: './vendor-status.component.html',
  styleUrls: ['./vendor-status.component.scss']
})
export class VendorStatusComponent implements OnInit {

  currentUser:any = JSON.parse(localStorage.getItem('user_info'));
  orgID =  this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id');
  @ViewChild('vendSatGrid' , {static: false}) public vendSatGrid: GridComponent;
  actStatGridToolItems: ToolbarItems[];
  statusFormTypeData: any = 'Add';
  vendorStatusListing = true;
  statVendorTableData;
  statVendorForm: FormGroup;
  formSubmitAttemptForStatus = false;

  constructor(
    public settingsService: settingsService,
    public Router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.actStatGridToolItems = ['Search'];
    this.GetVendorStatusByOrgId();
    this.statVendorFormInputs();
  }

  GetVendorStatusByOrgId(){
    this.settingsService.GetVendorStatusByOrgId().subscribe((data:any) => {
      this.statVendorTableData = data;
      this.spinner.hide();
    });
  }

  openVenStat(type){
    this.statusFormTypeData = type;
    this.vendorStatusListing = false;
    if(this.statusFormTypeData !== 'Add'){
      this.statVendorForm.patchValue({
        statName: this.statusFormTypeData.name,
        statDesc: this.statusFormTypeData.description,
      })
    }
  }


  submitStatus(){
    this.spinner.show();
    this.formSubmitAttemptForStatus = true;
    if(this.statVendorForm.invalid){
      this.spinner.hide();
      return
    }

    let formValue = this.statVendorForm.value;
    let postData: any = {
      org_id: this.orgID,
      name: formValue.statName,
      description: formValue.statDesc,
      createdDate: moment().format('L'),
      createdByEmpId: this.currentUser.id,
      createdBy: this.currentUser.full_name
    }
    if(this.statusFormTypeData === 'Add'){
      this.settingsService.AddVendorStatus(postData).subscribe((data:any) => {
        if(data.status === '200'){
          this.toast.success('Vendor Status Added');
          this.backToListing();
        }
      });
    }else{
      postData.id = this.statusFormTypeData.id;
      postData.org_id = this.statusFormTypeData.org_id;
      postData.createdDate = this.statusFormTypeData.createdDate;
      postData.createdByEmpId = this.statusFormTypeData.createdByEmpId;
      postData.createdBy = this.statusFormTypeData.createdBy;
      postData.modifiedDate = moment().format('L');
      this.settingsService.UpdateVendorStatusById(postData).subscribe((data:any) => {
        if(data.status === '200'){
          this.toast.success('Vendor Activity Updated');
          this.backToListing();
        }
      });
    }
  }

  deleteVendStat(data){
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
        this.settingsService.UpdateVendorStatusById(postData).subscribe((data:any) => {
          if(data.status === '200'){
            this.toast.success('Vendor Activity Updated');
            this.backToListing();
          }
        });
      }
    });
  }

  backToListing(){
    this.vendorStatusListing = true;
    this.formSubmitAttemptForStatus = false;
    this.statVendorForm.reset();
    this.GetVendorStatusByOrgId();
  }

  statVendorFormInputs(){
    this.statVendorForm = this.formBuilder.group({
      statName: ['', Validators.required],
      statDesc: ['']
    });
  }

  serviceSearchKeyUp(){
    document.getElementById(this.vendSatGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.vendSatGrid.search((event.target as HTMLInputElement).value)
    });
  }

  backToVendor(){
    if(this.vendorStatusListing){
      this.Router.navigate(['settings-new/vendor']);
    }else{
      this.backToListing()
    }
  }

}
