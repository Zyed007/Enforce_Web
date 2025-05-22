import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import moment = require('moment');
import { PayrollService } from '../../../../services/payroll.service';

@Component({
  selector: 'app-fuel-station-activity',
  templateUrl: './fuel-station.component.html',
  styleUrls: ['./fuel-station.component.scss']
})
export class FuelStationComponent implements OnInit {

  currentUser:any = JSON.parse(localStorage.getItem('user_info'));
  orgID =  this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id');
  @ViewChild('vendActGrid' , {static: false}) public vendActGrid: GridComponent;
  actVenGridToolItems: ToolbarItems[];
  actFormTypeData: any = 'Add';
  fuelStationListing = true;
  actFuelStationTableData;
  actFuelStationForm: FormGroup;
  formSubmitAttemptForActivity = false;

  constructor(
    public payrollService: PayrollService,
    public Router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public PayrollService:PayrollService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.actVenGridToolItems = ['Search'];
    this.actFuelStationFormInputs();
    this.GetFuelStationBrandsByOrgId();
  }

  GetFuelStationBrandsByOrgId() {
    this.spinner.show();
    try {
      this.PayrollService.GetFuelStationBrandsByOrgId({ id: this.currentUser.org_id }).subscribe({
        next: (data: any) => {
          this.actFuelStationTableData = data;
          this.spinner.hide();
        },
        error: (error: any) => {
          console.error("Error fetching fuel station brands:", error);
          this.toast.error("Failed to fetch fuel station brands");
          this.spinner.hide();
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      this.toast.error("Something went wrong");
      this.spinner.hide();
    }
  }


  openVenAct(type){
    this.actFormTypeData = type;
    this.fuelStationListing = false;
    if(this.actFormTypeData !== 'Add'){
      this.actFuelStationForm.patchValue({
        name: this.actFormTypeData.name,
        desc: this.actFormTypeData.desc,
      })
    }
  }


  async submitActivity() {
    try {
      this.spinner.show();
      this.formSubmitAttemptForActivity = true;

      if (!this.actFuelStationForm.get('name').value || !this.actFuelStationForm.get('desc').value) {
        this.spinner.hide();
        return;
      }

      let formValue = this.actFuelStationForm.value;
      console.log(formValue, '"test"');

      let postData: any = {
        org_id: this.orgID,
        name: formValue.name,
        desc: formValue.desc,
        created_by: this.currentUser.full_name,
        modified_by: this.currentUser.full_name
      };

      console.log(this.actFormTypeData, 'OUTSIDE Add');

      if (this.actFormTypeData === 'Add') {
        try {
          const data: any = await this.payrollService.AddFuelStationBrand(postData).toPromise();
          console.log(data, 'Inside Add');
          if (data.result.status === '200') {
            this.toast.success('Fuel Station Brand Added');
            this.backToListing();
          }
        } catch (error) {
          console.error('Error adding fuel station brand:', error);
          this.toast.error('Failed to add fuel station brand');
        }
      } else {
        postData.id = this.actFormTypeData.id;
        postData.modifiedBy = this.currentUser.full_name;

        try {
          const data: any = await this.payrollService.UpdateFuelStationBrand(postData).toPromise();
          console.log(data,"DATA ON UPDATE")
          if (data.result.status === '200') {
            this.toast.success('Fuel Station Activity Updated');
            this.backToListing();
          }
        } catch (error) {
          console.error('Error updating fuel station brand:', error);
          this.toast.error('Failed to update fuel station brand');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      this.toast.error('Something went wrong');
    } finally {
      this.spinner.hide();
    }
  }


  deleteVendAct(data){
    console.log(data,"TEST!!!")
    delete data['column'];
    delete data['foreignKeyData'];
    delete data['index'];

    Swal.fire({
      title: 'Delete this Fuel Station Brand - '+data.name+' ?',
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
          CreatedBy: data.created_by,
        }
        this.payrollService.DeleteFuelStationBrand(postData).subscribe((data:any) => {
          if(data.result.status === '200'){
            this.toast.success('FuelStation Activity Updated');
            this.backToListing();
          }
        });
      }
    });
  }

  backToListing(){
    this.fuelStationListing = true;
    this.formSubmitAttemptForActivity = false;
    this.actFuelStationForm.reset();
    this.GetFuelStationBrandsByOrgId();
  }

  actFuelStationFormInputs(){
    this.actFuelStationForm = this.formBuilder.group({
      id: ['', Validators.required],
      name: [''],
      desc:['']
    });
  }

  serviceSearchKeyUp(){
    document.getElementById(this.vendActGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.vendActGrid.search((event.target as HTMLInputElement).value)
    });
  }

  backToFuelStation(){
    if(this.fuelStationListing){
      this.Router.navigate(['settings-new/travel']);
    }else{
      this.backToListing();
    }
  }

}
