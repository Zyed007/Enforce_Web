import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { EmployeeService } from "../../../../services/employee.service";
import { settingsService } from "../../../../services/settings.service";
import { PayrollService } from "../../../../services/payroll.service";
import Swal from "sweetalert2";
import { OrganizationService } from "../../../../services/organization.service";
import { GridComponent, ToolbarItems } from "@syncfusion/ej2-angular-grids";

@Component({
  selector: "app-travel-settings",
  templateUrl: "./travel-settings.component.html",
  styleUrls: ["./travel-settings.component.scss"],
})
export class TravelSettingsComponent implements OnInit {
  vehicleForm: FormGroup;
  vehicleConfigForm: FormGroup;
  actVenGridToolItems: ToolbarItems[];
  userInfo = JSON.parse(localStorage.getItem("user_info"));
  @ViewChild("historyModal", { static: false }) historyModal: any;
  @ViewChild("VehicleNumberModal", { static: false }) VehicleNumberModal: any;
  @ViewChild('vendActGrid', { static: false }) public vendActGrid: GridComponent;
  vehicleTypes: any = [];
  vehicleTypeHistory: any = [];
  minDate: Date = new Date();
  isEditMode = false;
  currency: string = "";
  constructor(
    public Router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    public settingsService: settingsService,
    private route: ActivatedRoute,
    private empService: EmployeeService,
    private payrollService: PayrollService,
    private organizationService: OrganizationService
  ) {
    this.vehicleForm = new FormGroup({
      vehicles: new FormArray([]),
      max_num_len: new FormControl(""),
      max_str_len: new FormControl(""),
    });
    this.vehicleConfigForm = this.formBuilder.group({
      id: [''],
      source: [''],
      maxNumLen: [4],
      allowAlphabets: [true],
      allowNumbers: [true],
      alphabetCom: [],
      numberCom: [],
      customCodes: this.formBuilder.array([])
    });


  }
  ngOnInit(): void {
    this.getTravelSettings();
    this.getVehicleNumberConfigByOrgId();
    this.FindCurrencyByOrgId();
    this.handleControlState('allowNumbers', 'numberCom');
    this.handleControlState('allowAlphabets', 'alphabetCom');
  }
  handleControlState(sourceControl: string, targetControl: string) {
    this.vehicleConfigForm.get(sourceControl).valueChanges.subscribe((isAllowed: boolean) => {
      const control = this.vehicleConfigForm.get(targetControl);
      isAllowed ? control.enable() : control.disable();
    });
  }

  get vehicles() {
    return this.vehicleForm.get("vehicles") as FormArray;
  }
  async getTravelSettings() {
    try {
      const res: any = await this.payrollService
        .GetTravelSettingByOrgId({ id: this.userInfo.org_id })
        .toPromise();

      if (res && res.length > 0) {
        this.vehicleTypes = res;
        this.vehicles.clear();
        res.forEach((element: any) => {
          const fuelPrice = element.fuel_cost
            ? parseFloat(element.fuel_cost.toFixed(2))
            : 0;
          const fuelEconomy = element.fuel_efficiency
            ? parseFloat(element.fuel_efficiency.toFixed(2))
            : 0;

          const vehicleGroup = new FormGroup({
            vehicleType: new FormControl(
              element.vehicle_type,
              Validators.required
            ),
            fuelEconomy: new FormControl(fuelEconomy, [
              Validators.required,
              Validators.min(0),
            ]),
            fuelPrice: new FormControl(fuelPrice, [
              Validators.required,
              Validators.min(0),
            ]),
            effectiveDay: new FormControl(element.effective_day, [
              Validators.required,
            ]),
            lastUpdated: new FormControl(element.modified_date || null),
            added: new FormControl(true),
            calc_type: new FormControl(element.calc_type, [
              Validators.required,
            ]),
          });
          vehicleGroup.get("vehicleType").disable();
          this.vehicles.push(vehicleGroup);
        });
      } else {
        this.addVehicleType();
      }
    } catch (err) {
      console.error("Error fetching travel settings:", err);
      this.toast.error("Failed to fetch travel settings. Please try again.");
    }
  }

  addVehicleType() {
    const vehicleGroup = new FormGroup({
      vehicleType: new FormControl("", Validators.required),
      fuelEconomy: new FormControl("", [
        Validators.required,
        Validators.min(0),
      ]),
      fuelPrice: new FormControl("", [Validators.required, Validators.min(0)]),
      lastUpdated: new FormControl(""),
      // effectiveDay: new FormControl("", [Validators.required]),
      added: new FormControl(false),
      calc_type: new FormControl(""),
    });

    this.vehicles.push(vehicleGroup);
  }

  removeVehicleType(index: number) {
    const vehicleGroup = this.vehicles.at(index) as FormGroup;
    const vehicleType = vehicleGroup.value;
    if (!vehicleType.added) {
      this.vehicles.removeAt(index);
      return;
    } else {
      Swal.fire({
        title: 'Are you sure you want to delete this vehicle type?',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
          ' Confirm',
        cancelButtonText:
          'Cancel',
      }).then(async (result) => {
        if (result.value === true) {
          await this.deleteVehicleType(vehicleType.vehicleType, index);
        }
      })

    }
  }
  async deleteVehicleType(vehicleType: string, index: number) {
    try {
      this.spinner.show()
      const res: any = await this.payrollService
        .deleteTravelSettings({
          orgID: this.userInfo.org_id,
          type: vehicleType,
        })
        .toPromise();

      console.log(res, "Response");

      if (res.result.status === "200") {
        this.toast.success("Vehicle Type deleted successfully");
        this.vehicles.removeAt(index);
      } else {
        this.toast.info("Failed to delete vehicle type. Please try again.");
      }
    } catch (error) {
      //   console.error("Error fetching vehicle type history:", error);
      this.toast.error(
        "Failed to delete vehicle type. Please try again."
      );
    }
    finally {
      this.spinner.hide();
    }
  }

  async saveVehicleType(index: number) {
    console.log(index, "Test");

    const vehicleGroup = this.vehicles.at(index) as FormGroup;

    if (!vehicleGroup.valid) {
      this.toast.error("Please fill all the fields");
      return;
    }

    const vehicleType = vehicleGroup.value;
    const postData = {
      org_id: this.userInfo.org_id,
      vehicle_type: vehicleType.vehicleType,
      fuel_efficiency: vehicleType.fuelEconomy,
      fuel_cost: vehicleType.fuelPrice,
      is_active: true,
      created_by: this.userInfo.full_name,
      is_deleted: false,
      effective_day: vehicleType.effective_day,
      calc_type: vehicleType.calc_type
    };

    try {
      this.spinner.show();
      const res: any = await this.payrollService
        .AddTravelSettings(postData)
        .toPromise();
      console.log(res, "Response");
      if (res.result.status === '200') {
        this.toast.success("Vehicle Type Added Successfully");
        await this.getTravelSettings();
      }
    } catch (error) {
      console.error("Error saving vehicle type:", error);
      this.toast.error("Failed to save vehicle type. Please try again.");
    } finally {

      this.spinner.hide();
    }
  }
  compareVehicleType(vehicleType: any): boolean {
    const existingVehicle = this.vehicleTypes.find(
      (x) =>
        x.vehicle_type.trim().toLowerCase() ===
        vehicleType.vehicleType.trim().toLowerCase()
    );

    if (!existingVehicle) {
      return false;
    }

    let existingFuelCost = existingVehicle.fuel_cost
      ? parseFloat(existingVehicle.fuel_cost.toFixed(2))
      : 0;
    console.log(existingVehicle, vehicleType, "COM")


    return (
      existingVehicle &&
      existingVehicle.existingFuelCost === vehicleType.fuelPrice &&
      existingVehicle.effective_day === vehicleType.effectiveDay &&
      existingVehicle.calc_type === vehicleType.calc_type
    );
  }


  async updateVehicleType(index: number) {
    const vehicleGroup = this.vehicles.at(index) as FormGroup;

    vehicleGroup.get("vehicleType").enable();
    const vehicleType = vehicleGroup.value;
    vehicleGroup.get("vehicleType").disable();
    console.log(vehicleType, "vehicleType");
    let isSame = this.compareVehicleType(vehicleType);
    console.log(isSame, "isSame");

    if (!isSame) {
      const postData = {
        org_id: this.userInfo.org_id,
        vehicle_type: vehicleType.vehicleType,
        fuel_efficiency: vehicleType.fuelEconomy,
        fuel_cost: vehicleType.fuelPrice,
        is_active: true,
        created_by: this.userInfo.full_name,
        is_deleted: false,
        effective_day: vehicleType.effectiveDay,
        calc_type: vehicleType.calc_type
      };
      console.log(postData, "postData");

      try {
        this.spinner.show();
        const res: any = await this.payrollService
          .UpdateTravelSettings(postData)
          .toPromise();
        console.log(res, "Response");
        if (res.result.status === '200') {
          this.toast.success("Vehicle Type Updated Successfully");
        }
      } catch (error) {
        console.error("Error updating vehicle type:", error);
        await this.getTravelSettings();
        this.toast.error("Failed to update vehicle type. Please try again.");
      } finally {
        this.spinner.hide();
      }
    } else {
      this.toast.info("No changes made to the vehicle type");
    }
  }

  viewVehicleTypeHistory(index: number) {
    console.log(index, "index");
    const vehicleGroup = this.vehicles.at(index) as FormGroup;
    let vehicleType = vehicleGroup.get("vehicleType").value;
    if (vehicleType) {
      try {
        this.payrollService
          .GetTravelSettingHistoryByTypeandOrgId({
            orgID: this.userInfo.org_id,
            type: vehicleType,
          })
          .subscribe((res: any) => {
            console.log(res, "Response");
            if (res && res.length > 0) {
              this.vehicleTypeHistory = [];
              this.vehicleTypeHistory = res;
              console.log(this.vehicleTypeHistory, "this.vehicleTypeHistory");
              this.modalService.open(this.historyModal, { size: 'lg' });
            } else {
              this.toast.info("No history available for this vehicle type");
            }
          });
      } catch (error) {
        console.error("Error fetching vehicle type history:", error);
        this.toast.error(
          "Failed to fetch vehicle type history. Please try again."
        );
      }
    } else {
      this.toast.info("No history available for this vehicle type");
      return;
    }
  }
  closeModel() {
    this.modalService.dismissAll();
  }
  goBack() {
    window.history.go(-1);
  }

  async FindCurrencyByOrgId() {
    let res: any = await this.organizationService.FindCurrencyByOrgId().toPromise();
    if (res && res.length > 0) {
      this.currency = res[0].currency
      // console.log(res[0].currency)
    }
  }




  vehicleNumberConfigArr = []
  async getVehicleNumberConfigByOrgId() {
    let org_id = this.userInfo.org_id ? this.userInfo.org_id : localStorage.getItem('org_id')
    this.vehicleNumberConfigArr = [];
    let res: any = await this.payrollService.GetTravelVehicleConfigByOrgId({ id: org_id }).toPromise();

    if (res.length > 0) {
      this.vehicleNumberConfigArr = res.map(ele => {
        try {
          let parsedCodes = JSON.parse(ele.custom_codes);
          ele.custom_codes = Array.isArray(parsedCodes) && parsedCodes.length > 0
            ? parsedCodes.join(', ')
            : 'No custom codes';
        } catch (error) {
          ele.custom_codes = 'Invalid data';
        }
        return ele;
      });
    }
    console.log(res, 'on get')
  }

  getCustomCodes(index: number): FormArray {
    return this.vehicleConfigForm.get('customCodes') as FormArray;
  }

  addCustomCode(index: number, value: string): void {
    console.log(value, "Testing value")
    if (value.trim()) {
      this.getCustomCodes(index).push(this.formBuilder.control(value));
    }
  }

  removeCustomCode(index: number, codeIndex: number): void {
    this.getCustomCodes(index).removeAt(codeIndex);
  }
  openModal() {
    this.modalService.open(this.VehicleNumberModal);
  }
  async updateVehicleNumberConfig() {
    let value = this.vehicleConfigForm.getRawValue();
    console.log(value, "value")
    if (!value.maxNumLen || isNaN(value.maxNumLen) || value.maxNumLen < 1) {
      this.toast.error("Maximum numbers should be a valid number greater than 1");
      return;
    }
    let postData = {
      id: value.id,
      max_num_len: value.maxNumLen,
      org_id: this.userInfo.org_id ? this.userInfo.org_id : localStorage.getItem('org_id'),
      source: value.source,
      allow_alphabets: value.allowAlphabets ? true : false,
      allow_numbers: value.allowNumbers ? true : false,
      alphabet_com: value.alphabetCom ? parseInt(value.alphabetCom) : 0,
      number_com: value.numberCom ? parseInt(value.numberCom) : 0,
      custom_codes: JSON.stringify(value.customCodes),
      modified_by: this.userInfo.full_name,
    }

    try {
      this.spinner.show();

      let res: any = await this.payrollService.UpdateTravelVehicleConfig(postData).toPromise();

      if (res.result.status === "200") {
        await this.getVehicleNumberConfigByOrgId();
        this.closeModel();
        this.toast.success("Vehicle number configuration updated successfully");
      }

      console.log(res, "TEST");
    } catch (error) {
      this.toast.error("An error occurred while updating vehicle configuration");
      console.error("Error updating vehicle number config:", error);
    } finally {
      this.spinner.hide();
    }
    console.log(value, "TEST")
  }
  async saveVehicleNumberConfig() {
    let value = this.vehicleConfigForm.getRawValue();
    let postData = {
      id: '',
      max_num_len: value.maxNumLen,
      org_id: this.userInfo.org_id ? this.userInfo.org_id : localStorage.getItem('org_id'),
      source: value.source,
      allow_alphabets: value.allowAlphabets ? true : false,
      allow_numbers: value.allowNumbers ? true : false,
      alphabet_com: value.alphabetCom ? parseInt(value.alphabetCom) : 0,
      number_com: value.numberCom ? parseInt(value.numberCom) : 0,
      custom_codes: JSON.stringify(value.customCodes),
      created_by: this.userInfo.full_name,
    }
    try {
      this.spinner.show();

      let res: any = await this.payrollService.AddTravelVehicleConfig(postData).toPromise();

      if (res.result.status === "200") {
        await this.getVehicleNumberConfigByOrgId();
        this.closeModel();
        this.toast.success("Vehicle number configuration updated successfully");
      }
      console.log(res, "TEST");
    } catch (error) {
      this.toast.error("An error occurred while updating vehicle configuration");
      console.error("Error updating vehicle number config:", error);
    } finally {
      this.spinner.hide();
    }

  }
  addVehicleNumberConfig() {
    this.vehicleConfigForm.reset()
    this.isEditMode = false;
    this.openModal()
  }


  editVehicleNumberConfig(data) {
    console.log(data);
    this.vehicleConfigForm.reset()
    this.vehicleConfigForm.patchValue({
      id: data.id,
      maxNumLen: data.max_num_len,
      source: data.source,
      allowAlphabets: data.allow_alphabets,
      allowNumbers: data.allow_numbers,
      alphabetCom: data.alphabet_com,
      numberCom: data.number_com,
    })
    const customCodesArray = this.vehicleConfigForm.get('customCodes') as FormArray;
    customCodesArray.clear();
    let customCodes = data.custom_codes ? data.custom_codes.split(',') : []
    console.log(customCodes, "customCodes")
    if (customCodes) {
      customCodes.forEach(code => {
        customCodesArray.push(new FormControl(code.trim()));
      });
    }
    console.log(this.vehicleConfigForm.value, "***")
    this.isEditMode = true;
    this.openModal()
  }
  serviceSearchKeyUp(): void {
    document.getElementById(this.vendActGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.vendActGrid.search((event.target as HTMLInputElement).value)
    });
  }

}
