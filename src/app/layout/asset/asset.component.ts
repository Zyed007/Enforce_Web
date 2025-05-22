import { Component, ElementRef, OnInit, ViewChild , HostListener, AfterViewInit , ChangeDetectorRef } from '@angular/core';
import { FormGroup,FormControl, Validators, FormBuilder } from "@angular/forms";
import { EmployeeService } from '../../services/employee.service';
import { settingsService } from '../../services/settings.service';
import { AssetService } from '../../services/asset.service';
import { ProjectService } from '../../services/project.service';
import { ToastrService } from "ngx-toastr";
import { TabComponent } from "@syncfusion/ej2-angular-navigations";
import { GridComponent, ToolbarItems, GroupService, } from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import moment = require('moment');
import { Router } from '@angular/router';
import { timeHours } from 'd3';
import { Console } from 'console';
import { OrganizationService } from '../../services/organization.service';
import { CostUnitModule } from '../cost-unit/cost-unit.module';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { PayrollService } from '../../services/payroll.service';
//import { Select2Options}
import { UserService } from '../../services/user.service';
import * as _ from "lodash";
import { Select2OptionData } from "ng2-select2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SearchCountryField, TooltipLabel, CountryISO, NgxIntlTelInputComponent} from 'ngx-intl-tel-input';
import { VehicleNumberService } from "../../shared/services/vehicle-number.service";
import { DatePipe } from '@angular/common';
import { SwitchComponent } from '@syncfusion/ej2-angular-buttons';
import { ModuleSetupService } from "../../services/moduleSetup.service";
import { U } from '@angular/cdk/keycodes';


@Component({
  selector: 'asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
})

export class AssetComponent implements OnInit {

  mode = "View";
  @ViewChild("tabObj", { static: false }) public tabObj: TabComponent;
  @ViewChild('typeDropdown', {static: false}) typeDropdown: DropDownListComponent | undefined;
  @ViewChild("addvariablepayModel", { static: false }) addvariablepayModel: any;
  @ViewChild("addrepairpayModel", {static: false}) addrepairpayModel: any ;
  @ViewChild("assignassetModel", { static: false}) assignassetModel: any;
  @ViewChild("maintenanceHistoryModel", { static: false }) maintenanceHistoryModel: any;
  @ViewChild("repairHistoryModel", { static: false }) repairHistoryModel: any;
  @ViewChild("assignHistoryModel", { static: false }) assignHistoryModel: any;
  @ViewChild('ngxIntlp',{static:false}) ngxIntl: NgxIntlTelInputComponent;
  

  
  

  calculateDepreciation(): void {
    setTimeout(() => {
    const price = this.addAssetFromGroup.get('Price').value;
    const usefulLife = this.addAssetFromGroup.get('UsefulLife').value;
    if (price  !== null && usefulLife) {
      this.addAssetFromGroup.patchValue({DepreciationValue : (price  / usefulLife)} );
    }  else {
      this.addAssetFromGroup.patchValue({DepreciationValue : null});
    }
  },0);
}

payrollSubmitFullAccess = false;

addMainformSubmitted: boolean;
separateDialCode = true;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  public selectedISO=CountryISO.UnitedArabEmirates;
  public allowCstPhoneValidations=true;


  isOpen = false;
  isRepairOpen = false;
  open() {
    this.isOpen = !this.isOpen;
  }
  openRepair() {
    this.isRepairOpen = !this.isRepairOpen
  }
  public employeeGridToolItems: ToolbarItems[];

  addPayrollPaymentsFullAccess = false;

  isLoading = false;

  showList = true;
  showPrefix =  false;
  showAdd = false;
  showDetails = false;
  assignSec = false;
  editDetails = false;

  AssetDocUrl = "";
  InvoiceDocUrl = "";
  RegDocUrl = "";
  PolicyDocUrl = "";
  isPolicyDocUp = false;
  isAssetDocUp = false;
  isMainDocUp = false;
  isInvoiceDocUp = false;
  isRepairDocUp = false;
  isReimbDocUp = false;
  isRegDocUp = false;
  showDashboard = true;
  assetList;
  assetDetails;
  rangeBoard = false;
  statBoard = false;
  docGridData = false;

  showDashList = false;

  dashhead;
  maximumNumberLength = 0
  maximumStringLength = 0
  numberPlateCodes=[]

  addHeaderText = [{header :{ text :"Asset Details"}}];

  editheaderText = [
    { text: "Asset Details" },
    { text: "Documents" },
    { text: "Edit History" },
    { text: "Assign History" }
  ];


  assetAssignHistory 	=
  [
    {
      "id": "908d9b0a-12f4-4d6e-9c1d-b514d49a347d",
      "assignee_id": "aad40694-fafb-4b83-9dc6-b1d5513f13eb",
      "assignee_name": "Ashok Naik-Project Trainee",
      "asset_id": "5ddb1fd9-56bf-4383-90e4-9ebe3035b07c",
      "code_id": "newcodeid",
      "asset_name": "lenovo ThinkPad ",
      "asset_status": "Lost",
      "assigned_from": "2023-05-10T16:13:37.5653509",
      "assigned_to": "2023-05-10T16:13:37.5653509",
      "is_assignee_approved": false,
      "approved_date": null,
      "created_date": "2023-05-10T16:13:37.5653509",
      "created_by": "Sazid Khan",
      "is_deleted": false,
      "discription": "empty for now"
    }
  ];

  assetCatogery = [];
  assetType = [];
  assetStatus = [];
  assetWarped = ["No Warranty","1 Week","1 Month", "3 Month", "6 Month", "1 Year", "2 Year", "3 Year", "5 Year", "10 Year"]
  assetReqEmp = [];
  allVendordata =[{id: "100", value:"Not Applied"},{id: "101", value:"Unknown Vendor"}];
  intervalType = ["Mileage - Based","Time - Based"]



  commonFields: Object = { text: "value", value: "id"};

  addAssetFromGroup: FormGroup;
  assignAssetFromGroup: FormGroup;
  assetPrefixForm: FormGroup;
  AddAssetDocFG: FormGroup;
  AddRecordForm: FormGroup;
  AddReimbForm: FormGroup;

  allAssetPrefixData;
  categoryCount: any = {} ;
  typeCount: any = {};
  statusCount: any = {};

  AssetDocs = [];


  public deptOptions: Select2Options;


  addocs = [{docname: "", docexp: "", status:"", crdate:""}];
  esdocs = [{docname: "Policy", crdate:"", docurl: ""}, {docname: "Registration", crdate:"", docurl: ""}];
  

  constructor(
    private formBuilder: FormBuilder,
    public empService: EmployeeService,
    private settingsService: settingsService,
    private assetService: AssetService,
    private toast: ToastrService,
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
    public Router :Router,
    public payrollService: PayrollService,
    private userService: UserService,
   
    private modalService: NgbModal,
    private vehicleNumberService: VehicleNumberService,
    private datePipe: DatePipe,
    public ModuleSetupService: ModuleSetupService,
    
    )
    {

      this.deptOptions = {
        placeholder: { id: "0", text: "Select" },
        allowClear: true,
        width: "100%",
      };
  }

  ngOnInit(): void {
    this.employeeGridToolItems = ["Search"];
    this.addAssetInputs();
    this.assignAssetInputs();
    this.listAsset();
    this.GetAllPrefixByOrgID();
    this.assetPrefixFromInput();
    this.AddAssetDocInputs();
    this.GetAssetPrefixByOrgID();
    this.roleSetting();
    this.fetchVehicleNumberConfig();

    this.addAssetFromGroup.valueChanges.subscribe((values) => {
      this.calculateDepreciation();
    });
    
    
    this.getEmployeeData() 

    this.GetAssetStatusData()

    
  }


  
 

  async fetchVehicleNumberConfig(){
    try {
      const configs = await this.vehicleNumberService.fetchVehicleConfigs();
      if (configs.length > 0) {
        this.vehicleNumberService.setVehicleConfigs(configs);
      }
    } catch (error) {
      console.error('Failed to load vehicle configs', error);
    }
  }
  updateDropdown(source) {

    console.log(source, "...ts")
    let arr= this.vehicleNumberService.getDropdownOptions(source);
    this.numberPlateCodes=arr;
    console.log(arr,"Vehicle No Config")
    
  }

  data;

  async getEmployeeData() {
    this.data = await this.empService.getEmployeeByOrgId().toPromise();
 }




  
    changetab(to) {
      if (to == "asset") this.tabObj.select(0);
      if (to == "insurance") this.tabObj.select(1);
      if (to == "registration") this.tabObj.select(2);
      if (to == "assign") this.tabObj.select(3)
      if (to == "document") this.tabObj.select(4);
      if (to == "addAssign" ) this.tabObj.select(1)
      
      if (to == "check")
      {
        if(this.assetDetails.catogery === 'Vehicle' || this.assetDetails.catogery === 'vehicle' || this.assetDetails.catogery === 'Automobile' || this.assetDetails.catogery === 'automobile')
        {
          this.tabObj.select(2);
        } else {
          this.tabObj.select(0)
        }
      }

      if( to == "asgn")
      {
        if(this.assetDetails.catogery === 'Vehicle' || this.assetDetails.catogery === 'vehicle' || this.assetDetails.catogery === 'Automobile' || this.assetDetails.catogery === 'automobile')
          {
            this.tabObj.select(3);
          } else {
            this.tabObj.select(1)
          }
      }

      if (to == "cat")
      {
        if(this.assetDetails.catogery === 'Vehicle' || this.assetDetails.catogery === 'vehicle' || this.assetDetails.catogery === 'Automobile' || this.assetDetails.catogery === 'automobile')
          {
            this.tabObj.select(4);
          } else {
            this.tabObj.select(2)
          }
      }
    }

    onPlateCodeValueChange(e: any) {
      console.log(e, "TEST");
      const selectedVal = e.value;
      this.addAssetFromGroup.patchValue({
        PlateCode: selectedVal,
      });

      console.log(selectedVal, "****");
    }


    async getTravelVehicleConfigByOrgId() {
      let org_id = localStorage.getItem('org_id')
      let res: any = await this.payrollService.GetTravelVehicleConfigByOrgId({ id: org_id }).toPromise();
      if (res.length > 0) {
        this.maximumNumberLength = res[0].max_num_len,
          this.maximumStringLength = res[0].max_str_len
        this.numberPlateCodes=[];
        this.numberPlateCodes=[{ id: 0, text: "Select Plate Code" },...this.generateCombinations(res[0].max_str_len)]

      }
      console.log(res, 'on get')
    }



    generateCombinations(n) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const result = [];
      const total = Math.pow(26, n);

      for (let i = 0; i < total; i++) {
        let combination = "";
        let num = i;

        for (let j = 0; j < n; j++) {
          combination = alphabet[num % 26] + combination;
          num = Math.floor(num / 26);
        }

        result.push({ id: i + 1, text: combination });
      }

      return result;
    }


  GetAllPrefixByOrgID(){
    this.projectService.GetAllPrefixByOrgID().subscribe((data:any) => {
      let result = []
      data.map((elm, ind) => {
        if(elm.type === 'asset'){
          result.push(elm)
          console.log(result)
        }

        if(data.length === ind + 1){
          this.allAssetPrefixData = result;
          console.log(result)
        }
      });
    });
  }


  editAssetDataValue;
  editAssetPrefixDiv = false;
  editAssetPrefixData;
  prefixTxtError = false;
  inputType;
  example;
  exampletxt;
  disableSeqNum = true;
  showInputOpt = true;
  sequenceNumberError = false;
  formattedPrefixDate = moment().format('YY/MM');
  formattedPrefix: string;
  currentUser = JSON.parse(localStorage.getItem('user_info'));

  editSingleAssetPre(data :any){
    this.showPrefix = false;
    this.editAssetPrefixDiv = true;
    this.editAssetPrefixData = data;
    console.log(this.editAssetPrefixData)

    this.assetPrefixForm.patchValue({
      prefix: this.editAssetPrefixData.prefix_ext,
      prefixFor: this.editAssetPrefixData.prefix_for
    });

    if(this.editAssetPrefixData.prefix_for === 'Custom'){
      this.formattedPrefix = '';
      this.disableSeqNum = true;
      this.showInputOpt = false;
      this.exampletxt = 'User is allowed to enter custom prefix';
      this.example = '';
    }else if(this.editAssetPrefixData.prefix_for === 'Sequence'){
      let lastAddprefixSplit = this.editAssetPrefixData.prefix_name.split('/').pop();
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
  }


  submitCommissionPrefix(){
    this.prefixTxtError = false;
    this.sequenceNumberError = false;
    let formVaue = this.assetPrefixForm.value;

    if(formVaue.prefix === '' || formVaue.prefix === null){
      this.prefixTxtError = true;
      return
    }
    if(!this.disableSeqNum && this.formattedPrefix === ''){
      this.sequenceNumberError = true;
      return
    }

    if(this.editAssetPrefixDiv){
      let postData = {
        id: this.editAssetPrefixData.id,
        type: "asset",
        prefix_ext: (formVaue.prefix).toUpperCase(),
        prefix_name: (formVaue.prefix).toUpperCase()+(formVaue.prefixFor === "Custom" ? '' : '/'+this.formattedPrefix ),
        prefix_for: formVaue.prefixFor,
        is_manual_allowed: this.editAssetPrefixData.is_manual_allowed,
        is_revised: this.editAssetPrefixData.is_revised,
        created_date: this.editAssetPrefixData.created_date,
        createdby: this.editAssetPrefixData.createdby,
        org_id: this.editAssetPrefixData.org_id,
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
        type: "asset",
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
    if(this.showPrefix){
      this.Router.navigate(['settings-new/asset']);
    }else{
      this.editAssetPrefixDiv = false;
      this.showPrefix = true;
      this.prefixTxtError = false;
      this.sequenceNumberError = false;
      this.disableSeqNum = false;
      this.GetAllPrefixByOrgID();
      this.assetPrefixForm.reset();
    }
  }
  changePrefixFor(){
    let value = this.assetPrefixForm.get('prefixFor').value;
    if(value === 'Custom'){
      this.formattedPrefix = '';
      this.assetPrefixForm.patchValue({
        prefixFor: 'Custom'
      });
      this.disableSeqNum = true;
      this.showInputOpt = false;
      this.exampletxt = 'User is allowed to enter custom prefix';
      this.example = '';
    }else if(value === 'Sequence'){
      this.formattedPrefix = '';
      this.assetPrefixForm.patchValue({
        prefixFor: 'Sequence'
      });
      this.disableSeqNum = false;
      this.showInputOpt = true;
      this.inputType = 'number';
      this.exampletxt = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.';
      this.example = 'For example, Inc/0001.';
    }else{
      this.formattedPrefix = '';
      this.assetPrefixForm.patchValue({
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

  deleteAssetPre(data :any)
  {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want Remove the Asset Prefix, This will result in not Automating Asset ID" ,
      showCloseButton: true,
      confirmButtonColor: '#e91e63',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.projectService.RemovePrefix({id: data.id}).subscribe((data:any) => {
          if(data.status === '200'){
            this.GetAllPrefixByOrgID();
            this.toast.success(data.desc)
          }else{
            this.toast.error('Something went wrong')
          }
        });
      }
      else{
      }
    });
  }

  AddAssetDocInputs(){
    this.AddAssetDocFG =  this.formBuilder.group({
      docName: [""],
      docExpDate: [""],
      docDate:[""],
    });

  }

  resetAddForm(){
    this.addAssetFromGroup.reset();
    this.AssetDocUrl = "";
    this.RepairAssetDocUrl = "";
    this.isAssetDocUp = false;
    this.isMainDocUp = false;
    this.isRepairMainDocUp = false;
    this.isRepairInvoiceDocUp = false;
    this.isInvoiceDocUp = false;
    this.isRepairDocUp = false;
    this.isReimbDocUp = false;
    this.isRegDocUp = false;
    this.isPolicyDocUp = false;
  }

  formatMoney(number: any): string {

    
    if (number != null) {
      const numberStr = number.toFixed(2);

      const [integerPart, decimalPart] = numberStr.split(".");

      const integerWithCommas = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );

      return `${integerWithCommas}.${decimalPart}`;
    } else {
      return `0.00`;
    }
  }

  async addAssetInputs() {
    this.addAssetFromGroup = this.formBuilder.group({
      Id: [""],
      Name: [""],
      Status: ["", [Validators.required]],
      Catogery: ["", [Validators.required]],
      Type: ["", [Validators.required]],
      Brand: [""],
      Vendor: [""],
      InvoiceDate: ["", [Validators.required]],
      DeliveryDate: [""],
      WarrantyPeriod: ["", [Validators.required]],
      WarrantyEndDate: [""],
      RequestedBy: [""],
      Description: [""],
      ModifiedDate: [""],
      VIN: [""],
      Price: ["",  [Validators.required, Validators.min(0)]],
      UsefulLife: ["", [Validators.required, Validators.min(0)]],
      DepreciationValue: [""],
      SerialNumber: [""],
      IntervalType: [""],
      IntervalSelection: [""],
      No_of_Days:[""],
      PlateCode: ["", [Validators.required]],
      PlateNo: ["", [Validators.required]],
      PlateCategory: [""],
      PlateSource: [""],
      Emirate: ["", [Validators.required]],
      InsuranceProvider: [""],
      InsurancePolicyNumber: [""],
      PolicyDocument: [""],
      RegistrationDocument: [""],
      RegistrationExpiryDate: [""],
      RegistrationDocDate: [""],
      PolicyDocDate: [""],
      PolicyStartDate: [""],
      PolicyEndDate: [""],
      Comment: [""],
      Assigniee: [""],
      Assignfrom: [""], 
      Assignto: [""], 
      Assigndescription: [""], 
      Assignstatus: [""]
    });

    

    await this.GetVendorData()
    await this.GetCategoryData()
    this.GetAssetTypeData()
    this.GetAssetStatusData()
  }
  async GetVendorData() {
    let vendorData: any = await this.settingsService.GetCommissionVendors().toPromise()
    if (vendorData && vendorData.length > 0) {

      vendorData.map((elm) => {
        this.allVendordata.push({ id: elm.id, value: elm.name + " - " + elm.type })
      });
    }
  }

  public plateCategory = [
    { id: 0, text: "Select Category" },
    { id: 1, text: "Private" },
  ];

  onPlateCategoryValueChange(e:any){
    const selectedVal = e.data[0].text;
    this.addAssetFromGroup.patchValue({
      PlateCategory: selectedVal,
    });

    console.log(selectedVal, "****");
  }

  public emirates = [
    { id: 0, text: "Select Source" },
    { id: 1, text: "Abu Dhabi" },
    { id: 2, text: "Dubai" },
    { id: 3, text: "Sharjah" },
    { id: 4, text: "Ajman" },
    { id: 5, text: "Umm Al-Quwain" },
    { id: 6, text: "Fujairah" },
    { id: 7, text: "Ras Al Khaimah" },
  ];


onEmirateValueChange(e: any) {
    console.log(e, "TEST");
    const selectedVal = e.value;
    this.updateDropdown(selectedVal)
    this.addAssetFromGroup.patchValue({
      Emirate: selectedVal,
    });

    console.log(selectedVal, "****");
  }


 async GetCategoryData() {
  let postData = {
    "orgID": localStorage.getItem('org_id')
  }

 

  this.assetService.GetAssetCategoryByOrgId(postData).subscribe((data) => {
    
    this.assetCatogery = Object.values(data).map(item => item.category);
    console.log(this.assetCatogery, "assetCategory")

  })

  
  }

  newAssetType:any = [];

  GetAssetTypeData() {
    let postData = {
      "orgID": localStorage.getItem('org_id')
    }
    this.assetService.GetAssetTypeByOrgId(postData).subscribe((data) => {
      this.newAssetType = Object.values(data).reduce((acc, item) => {
        // Check if the category exists in the accumulator object
        if (!acc[item.category]) {
          acc[item.category] = [];  // If not, create a new array for that category
        }
        // Push the type into the corresponding category
        acc[item.category].push(item.type);
        return acc;
      }, {});
      //console.log()
      console.log("new asset type :", this.newAssetType)
      this.assetType = Object.values(data).map(item => item.type);
      console.log(this.assetType, "asset - type :")
    })
  }

  selectCategory;
  selectedOption;
  //assetTypes = "";
  assetTypes = []

  


  selectAuto = false 
 
  selectedCat() {
    

    //this.updateTypesForCategory();
    //this.assetTypes = "";
    //console.log(this.assetTypes, "asset-types ::::")


      console.log(this.selectCategory, "selected category")
      
      if(this.selectCategory === 'Automobile') {
        this.selectAuto = true;
        console.log(this.selectAuto, ".....this. is for automobile ")
      } else if (this.selectCategory !== 'Automobile') {
        this.selectAuto = false;
        console.log(this.selectAuto, ".....this. is for automobile ")
      }

      // this.changeDetectorRef.detectChanges();
      this.selectedOption = "";
      this.addAssetFromGroup.controls['Type'].reset();
      this.typeDropdown.setProperties({ dataSource: [] });  // Update the dataSource
      //this.typeDropdown.refresh();
      //this.updateTypesForCategory();
      this.assetTypes = [];
      const keyExists = this.selectCategory in this.newAssetType;
    console.log(keyExists, "keyyssssss.....");
    if(keyExists) {
      this.assetTypes =  this.newAssetType[this.selectCategory]  ;
    } else {
      this.assetTypes = [];
    }








    console.log(this.newAssetType[this.selectCategory], "...selected category")

    console.log(this.assetTypes, "asset-types 22 ::::")
    //this.addAssetFromGroup.controls['Type'].patchValue(this.addAssetFromGroup.controls['Type'].reset();) = this.assetType;
    /*this.addAssetFromGroup.patchValue({
      Type : ""
    }); */

    //this.selectedOption = ""

    console.log(this.selectedOption ,"selected options ......")
    console.log(this.assetType, "this is assettype")
  }

  updateTypesForCategory() {
    this.assetTypes= []
    //const keys = this.newAssetType.filter(obj => obj.);
    //const containsVehicle = Object.values(this.newAssetType).some((arr: string[]) => arr.includes(this.selectCategory));



    // this.updateTypeDropdown();
  }

  /*  updateTypeDropdown() {
    if (this.typeDropdown) {
       // Refresh the dropdown with new data
    }
  } */

  /*updateTypesForCategory() {
    this.assetTypes = []
    this.assetTypes = this.selectCategory ? this.newAssetType[this.selectCategory] : [] ;
    if (this.typeDropdown) {

      this.typeDropdown.dataSource = this.assetTypes;  // Update the dataSource
      this.typeDropdown.refresh();  // Refresh the dropdown with new data
    }
  }
  /**
   * Resets the type dropdown by clearing its data source and refreshing it.
   */
  //}

  /* resetTypeDropdown() {
     const typeDropdown = document.getElementById('typeDropdown') as any;
     if (typeDropdown) {
       //Clear dataSource
       typeDropdown.ej2Instances.dataSource = [];
       //Refresh the dropdown
      typeDropdown.ej2Instances.refreshData();
       typeDropdown.ej2Instances.dataSource = [];  // Clear dataSource
       typeDropdown.ej2Instances.refreshData();  // Refresh the dropdown
     }
   }*/




  GetAssetStatusData() {
    let postData = {
      "orgID": localStorage.getItem('org_id')
    }
    this.assetService.GetAssetStatusByOrgId(postData).subscribe((data) => {
      this.assetStatus = Object.values(data).map(item => item.status);
    })
  }

  assetPrefixFromInput()
  {
   this.assetPrefixForm = this.formBuilder.group({
    prefix: [''],
    prefixFor: ['']
  });
  }

  assignAssetInputs(){
    this.assignAssetFromGroup = this.formBuilder.group({
      Assigniee: new FormControl("", [Validators.required]),
      Assignfrom: new FormControl("", [Validators.required]), 
      Assignto: new FormControl("", [Validators.required]), 
      Assigndescription: [""],
      Status: new FormControl("", [Validators.required]),
    });
  }

  goBack(to: any){
    if(to == "assetlist")
    {
      this.showList = true;
      this.showAdd = false;
      this.showDetails = false;
      this.assignSec = false;
      this.showPrefix = false;
      this.editDetails = false;
      this.listAsset();
      this.resetAddForm();
      this.AddAssetDocFG.reset();
      this.showDashboard =  true;
      this.GetAssetPrefixByOrgID();
      this.selectAuto = false;

    }else if(to == "showPrefix")
    {
      this.editAssetPrefixDiv = false;
      this.showPrefix = true;
      this.resetAddForm();
    }
    else{
      window.history.go(-1);
      this.resetAddForm();
      //this.GetAssetPrefixByOrgID();
    }
  }



  cancelAssign(){
    this.assignSec = false;

    // Reset the assignment form group to its initial state
    this.assignAssetFromGroup.reset();


    console.log("cancel assign")
  }

  async addAsset(){
    this.assignAssetFromGroup.reset();
    this.showList = false;
    this.showAdd = true;
    this.showDetails = false;
    this.assignSec = false;
    this.showDashboard =  false;
    let prefix=await this.GetAssetPrefixByOrgID();
    this.addAssetFromGroup.reset();
    this.addAssetFromGroup.patchValue({
      Id: prefix
    });

    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
      const data: any = await this.empService.getEmployeeByOrgId().toPromise();
      console.log(data, "data");

      if (data && data.length > 0) {
        
          data.forEach((element) => {
            this.assetReqEmp.push({
              id:element.id,
              value: element.full_name,
            })
          })
      
          
          
        

        //console.log(this.AddRecordForm.get('employee').value, "employeeee......")

        }
        
      
    
  }

  public prefixString = "";
  showPrefixText = false;
  public prefix_for = "";
  //no_of_days:any;
  async GetAssetPrefixByOrgID(){
    try
    {
      this.assetList = [];
      let postData = {
        "orgID": localStorage.getItem('org_id')
      }
      let data =await this.assetService.getAssetbyOrgId(postData).toPromise()
      let lastAddedassetId=""
      if(data != null){
        // Object.values(data).map((val) => ({
        //   ...val,
        //   no_of_days : moment().diff(moment(val.invoice_date), "days") + " Days"
        // }))
        // console.log(data, "dataaaaaa.........")
        this.assetList =data;
        this.assetList = this.assetList.map((val) =>({
          ...val,
          no_of_days : moment().diff(moment(val.invoice_date), "days") + " Days"
        }))
        lastAddedassetId = this.assetList[0].code_id;
        console.log("assetlistarray", this.assetList);
        //this.isLoading = false
        console.log(this.assetList[0], "asset list - 0")
        //this.assetList[0].code_id = this.assetList[0].code_id.toString();
        console.log(this.assetList[0].code_id,typeof this.assetList[0].code_id, "asset list - 0")
      }

      if (lastAddedassetId == "") {
        // Fetch all prefixes
        console.log("IF CASE")
        const prefixes: any =  this.projectService
          .GetAllPrefixByOrgID()
          .toPromise();

          if(prefixes && prefixes.length > 0){
            for (let prefix of prefixes) {
              if (prefix.type === "asset") {
                if (prefix.prefix_for === "Default") {
                  if (prefix.prefix_name) {
                    const splittable = prefix.prefix_name.split("/");
                    this.prefixString = `${splittable[0]}/${moment().format("YY")}/${moment().format("MM")}/0001`;
                    this.prefix_for = prefix.prefix_for;
                    return this.prefixString;
                  }
                } else if (prefix.prefix_for === "Custom") {
                  this.showPrefixText = true;
                } else if (prefix.prefix_for === "Sequence") {
                  if (prefix.prefix_name) {
                    const splittable = prefix.prefix_name.split("/");
                    this.prefixString = `${splittable[0]}/001`;
                    this.prefix_for = prefix.prefix_for;
                    console.log(this.prefixString, "prefixString")
                    return this.prefixString;
                  }
                } else if (prefix.prefix_for === "random") {
                  if (prefix.prefix_name) {
                    const splittable = prefix.prefix_name.split("/");
                    const random = Math.floor(1000 + Math.random() * 9000);
                    this.prefixString = `${splittable[0]}/${random}`;
                    this.prefix_for = prefix.prefix_for;
                    return this.prefixString;
                  }
                }
              }
            }
          }

    }
    else {
      console.log("ELSE CASE")
      let lastAddedPrefix = this.assetList[0].code_id

      console.log("lastAddedPrefix", lastAddedPrefix)
      let lastPrefixNumber = parseInt(lastAddedPrefix.split("/").pop() || "0", 10) + 1;

      // Fetch all prefixes
      const prefixes: any = await this.projectService
        .GetAllPrefixByOrgID()
        .toPromise();
        console.log("prefixes", prefixes)
        if(prefixes && prefixes.length > 0){
          for (let prefix of prefixes) {
            console.log(prefix.type, "prefix.type")
            if (prefix.type === "asset") {
              console.log("prefix", prefix)
              if (prefix.prefix_for === "Default") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  this.prefixString = `${splittable[0]}/${moment().format("YY")}/${moment().format("MM")}/${lastPrefixNumber.toString().padStart(4, "0")}`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              } else if (prefix.prefix_for === "Custom") {
                this.showPrefixText = true;
              } else if (prefix.prefix_for === "Sequence") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  this.prefixString = `${splittable[0]}/${lastPrefixNumber.toString().padStart(3, "0")}`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              } else if (prefix.prefix_for === "random") {
                const splittable = prefix.prefix_name.split("/");
                const random = Math.floor(1000 + Math.random() * 9000);
                this.prefixString = `${splittable[0]}/${random}`;
                this.prefix_for = prefix.prefix_for;
                return this.prefixString;
              }
            }
          }
        }


    }
  }
  catch(error) {
    Swal.fire("Error!", error, "error").then(() => {});
    console.log(error);
  }

  return this.prefixString;
}



  addAssetPrefix(){
    this.showPrefix = true;
    this.showList = false;
    this.showAdd = false;
    console.log("show prefix");
  }

  SubmitNext()
  {

  }

  async submitAssign(data) {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
    console.log(user, "......")


  }

  async submitAssignHistory() {

    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }

    const data2: any = await this.empService.getEmployeeByOrgId().toPromise();
      console.log(data2, "data2");

      if (data2 && data2.length > 0) {
        
          data2.forEach((element) => {
            this.assetReqEmp.push({
              id:element.id,
              value: element.full_name,
            })
          })
      
          
          
        

        

        }
    let assignData = this.assignAssetFromGroup.value;
    console.log(assignData, "assignData");
    
    this.val = data2.find(elm => elm.id === assignData.Assigniee );
    console.log(this.val, "this.val")

    console.log(user, "....user Data..")

    //let assetData = this.assetList;
    
    
    

    if(this.assignAssetFromGroup.controls['Assigniee'].invalid ){
      this.toast.error("Select Assigneee...");
     
    } else if (this.assignAssetFromGroup.controls['Status'].invalid) {
      this.toast.error("Select Status...")
    } else if (this.assignAssetFromGroup.controls['Assignfrom'].invalid) {
      this.toast.error("Add Start Date....")
    } else if( this.assignAssetFromGroup.controls['Assignto'].invalid ){
      this.toast.error("Add End Date...");
    }  else {
      let postData = {
        assigned_to : assignData.Assigniee,
        assigned_by : user['full_name'],
        assign_status : "Pending",
        assigned_date : moment().format('YYYY-MM-DD'),  
        start_date : assignData.Assignfrom,
        asset_status: assignData.Status,
        end_date : assignData.Assignto,
        description : assignData.Assigndescription,
        assignee_name : this.val.full_name, 
        is_assignee_approved : false,
        asset_id: this.assetDetails['id'],
        org_id: this.assetDetails['org_id'],
        
      }
     
      await this.assetService.AddAssetAssignHistory(postData).subscribe((result :any) => {
        if(result) {
          
              let postData = {
                "org_id": this.assetDetails['org_id'],
                "asset_id": this.assetDetails['id']
              }
              this.toast.success("Asset assign has been Successfully Done!");
              this.assignAssetFromGroup.reset();
             this.assetService.GetAssetAssignHistory(postData).subscribe((data: any) => {
                if(data != null) {
                  this.assignHistory = data;
                  if(this.assignHistory.length > 0){
                    if(this.assignHistory[0].assign_status === "Pending") {
                      this.isAssign = true;
                      this.modalService.dismissAll();

                    } else if (this.assignHistory[0].assign_status === "Rejected"){
                      this.isAssign = false;
                      this.modalService.dismissAll();
                    } else  {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
              
                      const endDate = new Date(this.assignHistory[0].end_date);
                      if(endDate > today) {
                        this.isAssign = true;
                        this.modalService.dismissAll();
                      } else {
                        this.isAssign = false
                        this.modalService.dismissAll();
                      } 
                      
                      console.log(this.isAssign, "this is assign history")
                    }
                    console.log(result)
                    
                     
                    
                  } else {
                    this.isAssign = false;
                    this.modalService.dismissAll();
                  }
    
                  
                  
                
                
                
    
                } else {
                  this.toast.error("Something went worng, Please try Again!");
                  this.modalService.dismissAll();
                }

              })
              
              
            } else {
              //console.log(result);
              this.toast.error("Somthing went worng, Please try Again!");
            }
        
      })
    }

    



  }

   async submitAsset(next: any){
    
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
    let assetData = this.addAssetFromGroup.value;
    //let assignData = this.assignAssetFromGroup.value;

    let date = new Date(assetData.WarrantyEndDate);

    const data2: any = await this.empService.getEmployeeByOrgId().toPromise();
      console.log(data2, "data2");

      if (data2 && data2.length > 0) {
        
          data2.forEach((element) => {
            this.assetReqEmp.push({
              id:element.id,
              value: element.full_name,
            })
          })
      
          
          
        

        

        }
    
    this.val = data2.find(elm => elm.id === assetData.Assigniee );
    console.log(this.val, "this.val")
    //this.assetDetails.assignee_name = this.val.full_name;


    
// Decrease one day
    date.setDate(date.getDate() - 1);

// Get the new year, month, and day
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // getMonth() returns 0-based month, so add 1
    let day = date.getDate();

// Format the date as "YYYY-MM-DD"
    let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;


    //let Org_id = localStorage.getItem('org_id')

    // if(assetData.Price != null) {
    //   assetData.Price = this.formatMoney(assetData.Price)
    // }

    // if(assetData.DepreciationValue != null) {
    //   assetData.DepreciationValue = this.formatMoney(assetData.DepreciationValue)
    // }
    let postData = {
      code_id: assetData.Id,
      org_id: localStorage.getItem('org_id'),
      name: assetData.Name,
      status: assetData.Status,
      catogery: assetData.Catogery,
      type: assetData.Type,
      brand: assetData.Brand,
      vendor: assetData.Vendor,
      //invoice_date: moment(assetData.InvoiceDate).format('MMM D, YYYY'),
      invoice_date: assetData.InvoiceDate,
      price: assetData.Price,
      useful_life: assetData.UsefulLife,
      depreciation_value: assetData.DepreciationValue,
      delivery_date: assetData.DeliveryDate,
      warranty_period: assetData.WarrantyPeriod,
      warranty_end_date: formattedDate,
      requested_by: assetData.RequestedBy,
      description: assetData.Description,
      created_by: user['full_name'],
      modified_by: user['full_name'],
      is_deleted: false,
      serial_number: assetData.SerialNumber,
      plate_no: assetData.PlateNo,
      plate_source: assetData.Emirate,
      plate_catogery: assetData.PlateCategory,
      plate_code: assetData.PlateCode,
      insurance_provider: assetData.InsuranceProvider,
      insurance_policy_number: assetData.InsurancePolicyNumber,
      policy_document: assetData.PolicyDocument,
      registration_document: assetData.RegistrationDocument,
      registration_expiry_date: assetData.RegistrationExpiryDate,
      service_type: assetData.IntervalType,
      service_interval: assetData.IntervalSelection,
      registration_upload_date: assetData.RegistrationDocDate,
      policy_upload_date: assetData.PolicyDocDate,
      policy_start_date: assetData.PolicyStartDate,
      policy_end_date: assetData.PolicyEndDate,
      comment: assetData.Comment,
      // assignee_id : assetData.Assigniee,
      // assigned_by : user['full_name'],
      // assign_status : "pending",
      // assigned_date : moment().format('YYYY-MM-DD'),  
      // assign_to : assetData.Assignto,
      // assign_from : assetData.Assignfrom,
      // assign_description : assetData.Assigndescription,
      // assignee_name : this.val.full_name,
      //no_of_days: moment().diff(moment(assetData.InvoiceDate), "days") + " Days",
    }

    // let asinged_id = JSON.parse(localStorage.getItem('user_info'))

    // let assignedData = {
    //   assigned_to : assignData.Assigniee,
    //   assign_status : "pending",
    //   start_date : assignData.Assignfrom,
    //   end_date : assignData.Assignto,
    //   assign_description : assignData.Assigndescription,
    //   asset_id : assetData.Id,
    //   org_id:  localStorage.getItem('org_id'),
    //   asset_status: assetData.Status,
    //   assigned_by : asinged_id.id,
    //   description: assignData.Assigndescription,
    //   is_assignee_approved: false,
    // }
    // console.log("assign Data",assignedData);

    this.assetService.AddAsset(postData).subscribe((result: any) => {
      if(result){
        this.isRegDocUp = false;
        this.RegDocUrl = "";
        this.isPolicyDocUp = false;
        this.PolicyDocUrl = "";
        console.log(result, "result");
        if(result.status == 200)
        {
          console.log("asset added successfully")
          if(next=="back")
          {
            this.goBack("assetlist")
          }
          else{
            this.resetForm();
          }
          this.toast.success("Asset has been Successfully Added!");
        } else {
          //console.log(result);
          this.toast.error(result["result"]["desc"].split(".")[0]);
        }
      }
    });

    // this.assetService.AddAssetAssignHistory(assignedData).subscribe((result :any) => {
    //   if(result) {
    //     if(result.status == 200)
    //       {
    //         console.log("asset added successfully")
    //         if(next=="back")
    //         {
    //           this.goBack("assetlist")
    //         }
    //         else{
    //           this.resetForm();
    //         }
    //         this.toast.success("Asset has been Successfully Added!");
    //       } else {
    //         //console.log(result);
    //         this.toast.error(result["result"]["desc"].split(".")[0]);
    //       }
    //   }
    // })


    if(this.addAssetFromGroup.controls['Catogery'].invalid){
      this.toast.error("Please select Category.")
      return;
    }
    else if(assetData.Catogery == "Automobile"){
      // if(this.addAssetFromGroup.controls['PlateCode'].invalid)
      //   {
      //     this.toast.error("Please select Plate Code");
      //     return;
      //   }
         if (this.addAssetFromGroup.controls['PlateNo'].invalid)
          {
            this.toast.error("Please enter Plate Number");
            return;
          } 
        else if (this.addAssetFromGroup.controls['PlateCategory'].invalid)
        {
          this.toast.error("Please select Plate Category");
          return;
        }
        else if (this.addAssetFromGroup.controls['Emirate'].invalid)
          {
            this.toast.error("Please Select Emirate");
            return;
          }  
             
    // } else if( this.addAssetFromGroup.controls['Name'].invalid) {
    //   this.toast.error("Please enter Name of Asset.")
    //   return;
    } else if ( this.addAssetFromGroup.controls['Status'].invalid) {
      this.toast.error("Please select the status of Asset.")
      return;
    } else if (this.addAssetFromGroup.controls['Category'].invalid) {
      this.toast.error("Please select the Category of Asset.")
      return;
    } else if (this.addAssetFromGroup.controls['Type'].invalid) {
      this.toast.error("Please select the type of asset.")
      return;
    }
      else {
        this.assetService.AddAsset(postData).subscribe((result: any) => {
          if(result){
            this.isRegDocUp = false;
            this.RegDocUrl = "";
            this.isPolicyDocUp = false;
            this.PolicyDocUrl = "";
            console.log(result, "result");
            if(result.status == 200)
            {
              console.log("asset added successfully")
              if(next=="back")
              {
                this.goBack("assetlist")
              }
              else{
                this.resetForm();
              }
              this.toast.success("Asset has been Successfully Added!");
            } else {
              //console.log(result);
              this.toast.error(result["result"]["desc"].split(".")[0]);
            }
          }
        });
      }
    
  }

  async resetForm() {
    let prefix= await this.GetAssetPrefixByOrgID();
            this.addAssetFromGroup.reset();
            this.addAssetFromGroup.patchValue({
              Id: prefix
            });
  }

  submitassignAsset()
  {
    this.assetDetails.is_assigned = true
    let assignName = null;
    let flag = true;
    let assigntData = this.assignAssetFromGroup.value;
    this.assetReqEmp.map((elm) => {
      if(elm.id == assigntData.assigniee){
        assignName = elm.value;
      }
    });
    if(assignName == null)
    {
      Swal.fire(
        'Oops!',
        'Please select all the options for Asigning the Asset',
        'warning'
      );
      flag = false;
    }
    if(this.assetDetails.is_assigned == true && flag == true)
    {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to reassign the asset from " +this.assetDetails.assignee_name+ " to "+ assignName ,
        showCloseButton: true,
        confirmButtonColor: '#e91e63',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.value === true) {
         flag = true;
        }
        else{
          flag = false;
        }
      });
    }
    if(flag)
    {

      let user={};
      if(localStorage.getItem('user_info')){
        user= JSON.parse(localStorage.getItem('user_info'));
      }

      let postData = {
        assignee_id: assigntData.assigniee,
        assignee_name: assignName,
        asset_id: this.assetDetails.id,
        code_id: this.assetDetails.code_id,
        asset_name: this.assetDetails.name,
        asset_status: assigntData.status,
        assigned_from: assigntData.assignfrom,
        created_by: user['full_name'],
        is_assignee_approved: false,
      }
      console.log("assign data", postData)

      this.assetService.AddAssetAssignHistory(postData).subscribe((result :any) => {
        if(result){
          if(result["result"]["status"] == 200)
          {
            this.toast.success("Asset has been Assigned Successfully!");
            this.toast.success("Asset has been Successfully Assigned and the aproval reqeust id Forwarded!");
          }
        }
      });

    }

  }



  
  listAsset()
  {
    this.isLoading = true;
    this.assetList = [];
    let postData = {
      "orgID": localStorage.getItem('org_id')
    }
    this.assetService.getAssetbyOrgId(postData).subscribe((data: any) =>{
      if(data != null){
        this.assetList =data;
        this.assetList = this.assetList.map((val) =>({
          ...val,
          no_of_days : moment().diff(moment(val.invoice_date), "days") + " Days"
        }))

        console.log("assetlistarray", this.assetList);
        this.isLoading = false
        this.categoryCount = data.reduce((acc, item) => {
          acc[item.catogery] = (acc[item.catogery] || 0) + 1;
          return acc;
        }, {});

        console.log(this.assetCatogery, "asset - cat :")

        this.assetCatogery.forEach(cat => {
          if (!(cat in this.categoryCount)) {
            this.categoryCount[cat] = 0;
          }
        });

        console.log(this.categoryCount, "category count::")

        this.typeCount = data.reduce((acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {});

        this.assetType.forEach(type => {
          if (!(type in this.typeCount)) {
            this.typeCount[type] = 0;
          }
        });

        this.statusCount = data.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});

        this.assetStatus.forEach(sts => {
          if (!(sts in this.statusCount)) {
            this.statusCount[sts] = 0;
          }
        });

        console.log(this.statusCount, "sts -- count :-")

        console.log(this.categoryCount, "categoryCount")
      }
    });
  }


  //want to be updated
  resetAddAsset(){
    this.goBack("assetlist")
    this.GetAllPrefixByOrgID();
    this.AssetDocUrl = "";
    this.isAssetDocUp = false;
    this.isMainDocUp = false;
    this.isRepairMainDocUp = false;
    this.isRepairInvoiceDocUp = false;
    this.isRepairDocUp = false;
    this.isReimbDocUp = false;
    this.isRegDocUp = false;
    this.isPolicyDocUp = false;
  }

  isLoadingHistory = false;
  maintenanceHistory;
  repairHistory;
  assignHistory;
  isAssign = false;
  async viewAssetData(data :any){
    this.isLoading = true;
    this.isLoadingHistory = true;
    window.scrollTo(0,0)
    console.log("clicked the asset data", data)
    this.showAdd = false;
    this.showList = false;
    this.showDetails = true;
    this.assetDetails = data;
    this.assetDetails['price'] = this.formatMoney(this.assetDetails['price'])
    this.assetDetails['depreciation_value'] = this.formatMoney(this.assetDetails['depreciation_value'])

    //this.assignHistory = this.assetList.filter(elm  => elm.id === this.assetDetails['id'])
    // if(this.assignHistory[0].assign_status === "pending"){
    //   this.isAssign = true;
    // }

    

    console.log(this.assetDetails,"asseted Details")
    this.showDashboard =  false;
    this.assetReqEmp.map((elm) => {
      if(elm.id == this.assetDetails['requested_by']){
        this.assetDetails['requested_by'] = elm.value;
      }
    });
    this.allVendordata.map((elm) =>{
      if(elm.id == this.assetDetails['vendor']){
        this.assetDetails['vendor'] = elm.value;
      }
    });

    let postData = {
      "org_id": this.assetDetails['org_id'],
      "asset_id": this.assetDetails['id']
    }
    await  this.assetService.GetAssetAssignHistory(postData).subscribe((data: any) => {
      if(data != null) {
        this.assignHistory = data;
        this.isLoading = false;
        console.log(this.assignHistory, "this is assign history")
        if(this.assignHistory.length > 0){
          if(this.assignHistory[0].assign_status === "Pending") {
            this.isAssign = true;
          } else if (this.assignHistory[0].assign_status === "Rejected"){
            this.isAssign = false;
          } else  {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            const endDate = new Date(this.assignHistory[0].end_date);
            if(endDate > today) {
              this.isAssign = true;
            } else {
              this.isAssign = false
            } 
            
            console.log(this.isAssign, "this is assign history")
          }
             
           
          
        } else {
          this.isAssign = false;
        }
        
      }
    })
    //console.log(this.assignHistory, "this is assign history")

    

    this.payrollService.GetReimbData(postData).subscribe((data: any) => {
      if(data != null) {

        this.maintenanceHistory = data;
        this.isLoadingHistory = false;


      }

      console.log(this.maintenanceHistory)
    })

    console.log(postData, ".....post  data")

    this.payrollService.GetRepairData(postData).subscribe((data: any) => {

      console.log(data, "....this is test data :")
      if(data != null) {
        this.repairHistory = data;
        this.isLoadingHistory = false;
      }

      console.log(this.repairHistory, ".....repair")
    })
  }

  uploadpoint(root: string) {
    switch (root) {
      case "Policy": {
        document
          .getElementsByClassName("upPolicy")[0]
          .querySelector("button")
          .click();
        break;
      }
      case "Register": {
        document
          .getElementsByClassName("upRegister")[0]
          .querySelector("button")
          .click();
        break;
      }
    }
  }

  uploadpointA(root: string) {
    switch (root) {
      case "Policy": {
        document
          .getElementsByClassName("Policy")[0]
          .querySelector("button")
          .click();
        break;
      }
      case "Registration": {
        document
          .getElementsByClassName("Registration")[0]
          .querySelector("button")
          .click();
        break;
      }
    }
  }

  UpdateHistory = []
  

   async editAssetData(data :any){

    let user = {}
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
      const data2: any = await this.empService.getEmployeeByOrgId().toPromise();
      console.log(data2, "data2");

      if (data2 && data2.length > 0) {
        
          data2.forEach((element) => {
            this.assetReqEmp.push({
              id:element.id,
              value: element.full_name,
            })
          })
      
          
          
        

        //console.log(this.AddRecordForm.get('employee').value, "employeeee......")

        }
        

        
   

    console.log("clicked the asset data edit", data)
    // show the edit details view
    this.showAdd = false;
    this.showList = false;
    this.editDetails = true;
    this.showDashboard = false;
    console.log(this.editDetails)
    // set the asset data to be edited
    this.assetDetails = data;

    console.log(this.assetDetails, "...asset details...")
    
    console.log(this.esdocs)

    let postData = {
        "org_id": this.assetDetails.org_id,
         "asset_id": this.assetDetails.id
       }


       this.assetService.getAssetHistoryByOrgId(postData).subscribe((data: any) => {

          console.log(data, "....this is test data :")
          
            this.UpdateHistory = data
            this.UpdateHistory.forEach((data) => {
              if(data['created_date'] != null){
                data["created_date"] = moment(data["created_date"]).format('MMM D, YYYY')
              }
              if ( data["registration_upload_date"] != null) {
                data["registration_upload_date"] = moment(data["registration_upload_date"]).format('MMM D, YYYY')
              }
              if (data["registration_expiry_date"] != null) {
                data["registration_expiry_date"] = moment(data["registration_expiry_date"]).format('MMM D, YYYY')
              }
              if (data["policy_upload_date"] != null) {
                data["policy_upload_date"] = moment(data["policy_upload_date"]).format('MMM D, YYYY')
              }
              if (data["policy_start_date"] != null) {
                data["policy_start_date"] = moment(data["policy_start_date"]).format('MMM D, YYYY')
              }
              if (data["policy_end_date"] != null) {
                data["policy_end_date"] = moment(data["policy_end_date"]).format('MMM D, YYYY')
              }
            } );
            console.log(this.UpdateHistory, "....checking updated values")
            //this.UpdateHistory.created_date = moment(this.UpdateHistory["created_date"]).format(); 
    
          console.log(this.UpdateHistory, ".....update")
        })

    

    if(this.assetDetails.catogery == "Automobile"){
      this.editheaderText = [
        { text: "Asset Details" },
        { text: "Insurance Details" },
        { text: "Registration Details" },
        { text: "Assign Details"},
        { text: "Documents" },
        { text: "Edit History" },
        { text: "Assign History"}
      ];
      
    } else {
      this.editheaderText = [
        { text: "Asset Details" },
        { text: "Assign Details"},
        { text: "Documents" },
        { text: "Edit History" },
        { text: "Assign History" }
      ];
    }
   

    

    // this.val = this.data.find(elm => elm.id === this.assetDetails.assignee_id );

    // this.assetDetails.assignee_id = this.val.full_name;

    //let date = new Date(this.assetDetails.invoice_date);
    let date1 = new Date(this.assetDetails.warranty_end_date);
    let date2 = new Date(this.assetDetails.delivery_date);
    let date3 = new Date(this.assetDetails.assign_from);
    let date4 = new Date(this.assetDetails.assign_to);

    this.assetDetails.warranty_end_date = moment(date1).format('MMM D, YYYY'); 
    this.assetDetails.invoice_date = moment(this.assetDetails.invoice_date).format('MMM D, YYYY');
    this.assetDetails.delivery_date = moment(date2).format('MMM D, YYYY');
    this.assetDetails.assign_from = moment(date3).format('MMM D, YYYY');
    this.assetDetails.assign_to = moment(date4).format('MMM D,YYYY');
    
    this.assetDetails.price = this.formatMoney(this.assetDetails.price);
    
    this.assetDetails.depreciation_value = this.formatMoney(this.assetDetails.depreciation_value);
    this.PolicyDocUrl = this.assetDetails.policy_document;
    if(this.assetDetails.policy_document != null){
      this.PolicyDocUrl = this.assetDetails.policy_document;
      this.isPolicyDocUp = true;
    } else  {
      this.PolicyDocUrl = "";
      this.isPolicyDocUp = false
    }

    this.RegDocUrl = this.assetDetails.registration_document;
    if(this.assetDetails.registration_document != null){
      this.RegDocUrl = this.assetDetails.registration_document;
      this.isRegDocUp = true;
    } else {
      this.RegDocUrl = "";
      this.isRegDocUp = false;
    }

    console.log(this.assetDetails.policy_document, "policy document")

    if( this.assetDetails.policy_document !== "" ){
    this.esdocs[0]= {
      docname: "Policy",
      crdate: data["policy_upload_date"],
      docurl: data["policy_document"]
    }
  }
  else {
    this.esdocs[0]= {
      docname: "Policy",
      crdate: "",
      docurl: ""
    }
  }

  if( this.assetDetails.registration_document !== "" ){
    this.esdocs[1] = {
      docname: "Registration",
      crdate: data["registration_upload_date"],
      docurl: data["registration_document"]
    }
  }
  else {
    this.esdocs[1] = {
      docname: "Registration",
      crdate: "",
      docurl: ""
    }
  }

    this.GetAssetStatusData()

    this.addAssetFromGroup.patchValue({
      Id: this.assetDetails.code_id,
      Name: this.assetDetails.name,
      Status: this.assetDetails.status,
      Catogery: this.assetDetails.catogery,
      Type: this.assetDetails.type,
      Brand: this.assetDetails.brand,
      Vendor: this.assetDetails.vendor,
      InvoiceDate: this.assetDetails.invoice_date,
      DeliveryDate: this.assetDetails.delivery_date,
      WarrantyPeriod: this.assetDetails.warranty_period,
      WarrantyEndDate: this.assetDetails.warranty_end_date,
      Description: this.assetDetails.description,
      ModifiedDate: moment().format("L"),
      Price: this.assetDetails.price,
      UsefulLife: this.assetDetails.useful_life,
      DepreciationValue: this.assetDetails.depreciation_value,
      SerialNumber : this.assetDetails.serial_number,
      IntervalType: this.assetDetails.service_type,
      IntervalSelection: this.assetDetails.service_interval,
      PlateCode: this.assetDetails.plate_code,
      PlateNo: this.assetDetails.plate_no,
      PlateCategory: this.assetDetails.plate_catogery,
      Emirate: this.assetDetails.plate_source,
      InsuranceProvider: this.assetDetails.insurance_provider,
      InsurancePolicyNumber: this.assetDetails.insurance_policy_number,
      PolicyDocument: this.assetDetails.policy_document,
      RegistrationDocument: this.assetDetails.registration_document,
      RegistrationExpiryDate: this.assetDetails.registration_expiry_date,
      RegistrationDocDate: this.assetDetails.registration_upload_date,
      PolicyDocDate: this.assetDetails.policy_upload_date,
      PolicyStartDate: this.assetDetails.policy_start_date,
      PolicyEndDate: this.assetDetails.policy_end_date,
      Comment : this.assetDetails.comment,
      Assigniee : this.assetDetails.assignee_id,
      Assignfrom : this.assetDetails.assign_from,
      Assignto : this.assetDetails.assign_to,
      Assigndescription : this.assetDetails.assign_description,
      //No_of_Days: moment().diff(moment(this.assetDetails.invoice_date), "days") + " Days",
    })

   console.log(this.addAssetFromGroup, "add asset form group")

    

  }

  assetDelete(data: any){
    console.log("delete asset id",data)
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Remove the Asset" ,
      showCloseButton: true,
      confirmButtonColor: '#e91e63',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.assetService.DeleteAsset({id: data}).subscribe((data:any) => {
          if(data.status === '200'){
            this.GetAllPrefixByOrgID();
            this.toast.success(data.desc);
            this.listAsset();
          }else{
            this.toast.error('Something went wrong')
          }
        });
      }
      else{
      }
    });
  }

  async assignAsset(){
    const data2: any = await this.empService.getEmployeeByOrgId().toPromise();
      console.log(data2, "data2");

      if (data2 && data2.length > 0) {
        
          data2.forEach((element) => {
            this.assetReqEmp.push({
              id:element.id,
              value: element.full_name,
            })
          })
      
          
          
        

        //console.log(this.AddRecordForm.get('employee').value, "employeeee......")

        }
    //this.assignSec = true;
    this.modalService.open(this.assignassetModel, {
      size: 'lg'
    })


  }

  // phoneNumberValue=''
  // phoneInvalid = true
  // phoneErrorMsg;
  // onChange(event){

  // let phoneNo={
  // "contactNumber":event.dialCode+event.number
  // }
  // this.phoneNumberValue=event.dialCode+event.number;
  //       this.empService.IsPhoneValid(phoneNo).subscribe(
  //         (data:any)  => {

  //           if(data.status==200){
  //             this.phoneInvalid=false;


  //           }else{
  //             this.phoneInvalid=true;
  //             this.phoneErrorMsg=data['desc'];

  //           }




  //         },
  //         error  => {
  //           Swal.fire(
  //             'Error!',
  //             error,
  //             'error'
  //           ).then(
  //             //used Arrow function here
  //             (result)=> {

  //               //  this.router.navigate(['/dashboard']);
  //             })


  //         }

  //         )
  //     }

  is_admin = false;
  public AddMaintenanceForm: FormGroup;
  async maintenanceAsset() {
     this.modalService.open(this.addvariablepayModel, {
      size: 'lg',    // Increases modal size
     })

     this.AddRecordForm = new FormGroup({
      serviceCenter: new FormControl(''),
      contactNumber: new FormControl('', [Validators.required] ),
      cost: new FormControl('',[Validators.required]),
      partsReplaced: new FormControl(''),
      lastMaintenanceDate: new FormControl('', [Validators.required]),
      remark: new FormControl(''),
      uploadDoc: new FormControl(''),
      referenceNumber : new FormControl(''),
      invoiceNumber: new FormControl(''),
      invoiceDate: new FormControl(''),
      employee: new FormControl(''),
      dateIncurred: new FormControl(''),
      isReimb: new FormControl(''),
      emp_id: new FormControl(''),
      mileage: new FormControl(''),
      voucherNumber: new FormControl(''),
      paymentDate: new FormControl(''),
      invoiceDoc: new FormControl(''),
      });

      
  

     try {

      let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
      const data: any = await this.empService.getEmployeeByOrgId().toPromise();
      console.log(data, "data");

      if (data && data.length > 0) {
        if(user['is_admin'] === true){
          this.is_admin = true
          data.forEach((element) => {
            this.assetReqEmp.push({
              id:element.id,
              value: element.full_name,
            })
          })
        } else {
          this.is_admin = false
          this.AddRecordForm.patchValue({
            employee: user['full_name']
        })

        console.log(this.AddRecordForm.get('employee').value, "employeeee......")
        
        }
        
      }
      // this.isEmpDelLoading = false;
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
    

  }

  public AddRepairForm: FormGroup;
  async repairAsset() {
    this.modalService.open(this.addrepairpayModel, {
      size: 'lg'
    })
    this.AddRepairForm = new FormGroup({
      serviceCenter: new FormControl(''),
      contactNumber: new FormControl('', [Validators.required] ),
      cost: new FormControl('',[Validators.required]),
      partsReplaced: new FormControl(''),
      repairedDate: new FormControl('', [Validators.required]),
      remark: new FormControl(''),
      uploadDoc: new FormControl(''),
      referenceNumber : new FormControl(''),
      invoiceNumber: new FormControl(''),
      invoiceDate: new FormControl(''),
      employee: new FormControl(''),
      dateIncurred: new FormControl(''),
      isReimb: new FormControl(''),
      emp_id: new FormControl(''),
      voucherNumber: new FormControl(''),
      paymentDate: new FormControl(''),
      invoiceDoc: new FormControl(''),
      mileage: new FormControl(''),
    });

    try {

      let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
      const data: any = await this.empService.getEmployeeByOrgId().toPromise();
      console.log(data, "data");

      if (data && data.length > 0) {
        if(user['is_admin'] === true){
          this.is_admin = true
          data.forEach((element) => {
            this.assetReqEmp.push({
              id:element.id,
              value: element.full_name,
            })
          })
        } else {
          this.is_admin = false
          this.AddRepairForm.patchValue({
            employee: user['full_name']
        })

        console.log(this.AddRepairForm.get('employee').value, "employeeee......")

        }
        
      }
      // this.isEmpDelLoading = false;
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }


  switchState: boolean = false;
  isReadOnly = false;

  formSubmitAttemptForContact = true;
  closeModel() {
    this.isReadOnly = false;
    this.reimbSelected = false;
    this.modalService.dismissAll();
    //!!!want to add the initail values for the changes status part
    this.formSubmitAttemptForContact = true;
    this.isRepairDocUp = false;
    this.isMainDocUp = false;
    this.isRepairMainDocUp = false;
    this.isRepairInvoiceDocUp = false;
    this.isInvoiceDocUp = false;
    this.isReimbDocUp = false;
    this.selectedOption = '';
    if(this.reimbSelected){
      this.AddRepairForm.reset();
      this.AddRecordForm.reset();
    }
    
    //this.AddReimbForm.reset();
    // const factory = this.componentFactoryResolver.resolveComponentFactory(WidgetComponent);
    // this.container.clear(); // Clear any existing components
    // this.container.createComponent(factory);
    
    
    //this.resetSwitch();
  }

  // resetSwitch() {
  //   if(this.switch) {
  //     this.switch.checked = false;
  //   }
  //   //this.reimbSelected = false;
  // }

  viewAssetDoc()
  {
    console.log("viewing the asset doc function")
  }

  removeAssetDoc()
  {

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want Remove the Asset Document" ,
      showCloseButton: true,
      confirmButtonColor: '#e91e63',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.AssetDocUrl = "";
      this.isAssetDocUp = false;
      this.isMainDocUp = false;
      this.isRepairDocUp = false;
      this.AddAssetDocFG.reset();
      this.toast.success("Document deleted successfully");
      }
      else {
        this.toast.error("Document not deleted");
      }});
    //console.log("Removing the asset doc function")

  }

  removeRepairAssetDoc()
  {

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want Remove the Asset Document" ,
      showCloseButton: true,
      confirmButtonColor: '#e91e63',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.RepairAssetDocUrl = "";
      this.isAssetDocUp = false;
      this.isRepairMainDocUp = false;
      this.isRepairDocUp = false;
      this.AddAssetDocFG.reset();
      this.toast.success("Document deleted successfully");
      }
      else {
        this.toast.error("Document not deleted");
      }});
    //console.log("Removing the asset doc function")

  }

  removeInvoiceDoc()
  {

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want Remove the Invoice Document" ,
      showCloseButton: true,
      confirmButtonColor: '#e91e63',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.InvoiceDocUrl = "";
      
        this.isInvoiceDocUp = false;
      this.toast.success("Document deleted successfully");
      }
      else {
        this.toast.error("Document not deleted");
      }});
    //console.log("Removing the asset doc function")

  }

  removeRepairInvoiceDoc()
  {

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want Remove the Invoice Document" ,
      showCloseButton: true,
      confirmButtonColor: '#e91e63',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.RepairInvoiceDocUrl = "";
      
        this.isRepairInvoiceDocUp = false;
      this.toast.success("Document deleted successfully");
      }
      else {
        this.toast.error("Document not deleted");
      }});
    //console.log("Removing the asset doc function")

  }

  removeMainDoc() {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want Remove the Uploaded Document" ,
      showCloseButton: true,
      confirmButtonColor: '#e91e63',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.AssetDocUrl = "";
      this.isAssetDocUp = false;
      this.isMainDocUp = false;
      this.isRepairDocUp = false;
      this.isReimbDocUp = false;
      this.AddRecordForm.get('uploadDoc').reset();
      this.AddRepairForm.get('uploadDoc').reset();
      this.AddReimbForm.get('uploaded_doc').reset();
      this.toast.success("Document deleted successfully");
      }
      else {
        this.toast.error("Document not deleted");
      }});
  }

  removeRegDoc() {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want Remove the Uploaded Document" ,
      showCloseButton: true,
      confirmButtonColor: '#e91e63',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.RegDocUrl = "";
      this.isRegDocUp = false;
      this.addAssetFromGroup.get('RegistrationDocument').reset();
      this.toast.success("Document deleted successfully");
      this.esdocs[1].crdate="";
      this.esdocs[1].docurl="";
      }
      else {
        this.toast.error("Document not deleted");
      }});
  }

  removePolicyDoc() {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want Remove the Uploaded Document" ,
      showCloseButton: true,
      confirmButtonColor: '#e91e63',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        this.PolicyDocUrl = "";
      this.isPolicyDocUp = false;
      this.addAssetFromGroup.get('PolicyDocument').reset();
      this.esdocs[0].crdate="";
      this.esdocs[0].docurl="";
      this.toast.success("Document deleted successfully");
      }
      else {
        this.toast.error("Document not deleted");
      }});
  }

  LeaveDocDelete() {

  }
  /*onFileSelected(event) {
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          this.isLeaveDocUp = true;
          this.LeaveDocUrl = imData.secure_url;
          this.spinner.hide();
        }
      });
    }
  }*/


  onadddoc(event){
    let adddata = {docname: "" , docexp: null, status: "", crdate: moment().format("L")}
    this.addocs.push(adddata);
    console.log(event)
  }

  uploadAdddoc(event){
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          this.isAssetDocUp = true;
          this.isMainDocUp = true;
          this.AssetDocUrl = imData.secure_url;
          this.spinner.hide();
          //let date = new Date(imData.created_at);

// Extract day, month, and year
        //let day = date.getDate();
        //let month = date.toLocaleString('default', { month: 'long' }); // Get the full month name
        //let year = date.getFullYear();

// Format date in "DD Month YYYY"
        //let formattedDate = `${day} ${month} ${year}`;
        this.AddAssetDocFG.patchValue({
            docName : imData.original_filename,
            docDate : moment().format("L"),
        })

        }

        console.log(imData, "uploaded data")
      });

      //console.log(data, "uploaded data")

    }
  }

  uploadMainDoc(event) {
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          
          this.isMainDocUp = true;
          this.isRepairDocUp = true;
          this.AssetDocUrl = imData.secure_url;
          this.spinner.hide();
          
        this.AddRecordForm.patchValue({
            uploadDoc : imData.secure_url,
        })
        }

        console.log(imData, "uploaded data")
      });

      //console.log(data, "uploaded data")

    }
  }

  isRepairMainDocUp = false;
  RepairAssetDocUrl = ""
  uploadRepairMainDoc(event) {
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          
          this.isRepairMainDocUp = true;
          this.isRepairDocUp = true;
          this.RepairAssetDocUrl = imData.secure_url;
          this.spinner.hide();
          
        this.AddRepairForm.patchValue({
            uploadDoc : imData.secure_url,
        })
        }

        console.log(imData, "uploaded data")
      });

      //console.log(data, "uploaded data")

    }
  }

  uploadEssentalDoc(event, name) {
    let imageData = event.filesData[0].rawFile;
   
    const file: File = imageData;
    if(file){
      
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      Swal.fire({
                title: "Are you sure?",
                text: "Do you want to replace the document?",
                showCloseButton: true,
                confirmButtonColor: "#e91e63",
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: "Yes",
                cancelButtonText: "Cancel",
              }).then((result) => {

                if(result.value == true){
                  this.spinner.show();
                  this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
                    if(imData !=  null) {
                      
                      if(name === "Policy") {
                        this.isPolicyDocUp = true
                        this.PolicyDocUrl = imData.secure_url;
                        //this.spinner.hide();

                        this.esdocs[0] = {
                            docname: "Policy",
                            crdate: moment().format("L"),
                            docurl: imData.secure_url
                        }
         
                        this.addAssetFromGroup.patchValue({
                             PolicyDocument : imData.secure_url,
                             PolicyDocDate : moment().format("L")
                        })
                       } else {
                        this.isRegDocUp = true
                        this.RegDocUrl = imData.secure_url;
                        //this.spinner.hide();

                       this.esdocs[1] = {
                            docname: "Registration",
                            crdate: moment().format("L"),
                            docurl: imData.secure_url
                        }
         
                        this.addAssetFromGroup.patchValue({
                        RegistrationDocument : imData.secure_url,
                        RegstrationDocDate : moment().format("L")
                        })
                       }

                      }
                      this.spinner.hide();
                      this.toast.success("Document uploaded successfully");
                    })
                    
                  } else {

                    this.toast.error("Document not uploaded");
                  }
                }) 
              }
    }
  

  
 
  uploadRegdoc(event) {
    let imageData = event.filesData[0].rawFile;
    //this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to upload the document?",
        showCloseButton: true,
        confirmButtonColor: "#e91e63",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      }).then((result) => {

        if(result.value == true){
          this.spinner.show();
          this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
            if (imData != null) {
              //this.isAssetDocUp = true;

              this.isRegDocUp = true
              this.RegDocUrl = imData.secure_url;
              this.spinner.hide();
    
              this.esdocs[1] = {
                docname: "Registration",
                crdate: moment().format("L"),
                docurl: imData.secure_url
              }
             
            this.addAssetFromGroup.patchValue({
                RegistrationDocument : imData.secure_url,
                RegistrationDocDate: moment().format("L")
            })
            }
            this.spinner.hide();
            this.toast.success("Document uploaded successfully");
    
            console.log(imData, "uploaded data")
          });
        } else {
          this.toast.error("Document not uploaded");
        }

      })
      

      //console.log(data, "uploaded data")

    }
  }

  ReuploadRegdoc(event) {
    let imageData = event.filesData[0].rawFile;
    //this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to Replace the document?",
        showCloseButton: true,
        confirmButtonColor: "#e91e63",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      }).then((result) => {

        if(result.value == true){
          this.spinner.show();
          this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
            if (imData != null) {
              //this.isAssetDocUp = true;
              this.isRegDocUp = true
              this.RegDocUrl = imData.secure_url;
              this.spinner.hide();
    
              this.esdocs[1] = {
                docname: "Registration",
                crdate: moment().format("L"),
                docurl: imData.secure_url
              }
             
            this.addAssetFromGroup.patchValue({
                RegistrationDocument : imData.secure_url,
                RegistrationDocDate : moment().format("L")
            })
            }
            this.spinner.hide();
            this.toast.success("Document uploaded successfully");
    
            console.log(imData, "uploaded data")
          });
        } else {
          this.toast.error("Document not uploaded");
        }

      })
      

      //console.log(data, "uploaded data")

    }
  }

  
  uploadPolicyDoc(event) {
    let imageData = event.filesData[0].rawFile;
    //this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);

      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to Upload the document?",
        showCloseButton: true,
        confirmButtonColor: "#e91e63",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if(result.value == true) {
          this.spinner.show();
          this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
            if (imData != null) {
              //this.isAssetDocUp = true;
              this.isPolicyDocUp = true
              this.PolicyDocUrl = imData.secure_url;
              //this.spinner.hide();
    
              this.esdocs[0] = {
                docname: "Policy",
                crdate: moment().format("L"),
                docurl: imData.secure_url
              }
             
            this.addAssetFromGroup.patchValue({
                PolicyDocument : imData.secure_url,
                PolicyDocDate : moment().format('L')
            })
            }
            this.spinner.hide();
            this.toast.success("Document uploaded successfully");
    
            console.log(imData, "uploaded data")
          });
        } else {
          this.toast.error("Document not uploaded");
        }

      })

      

      //console.log(data, "uploaded data")

    }
  }

  ReuploadPolicyDoc(event) {
    let imageData = event.filesData[0].rawFile;
    //this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);

      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to Replace the document?",
        showCloseButton: true,
        confirmButtonColor: "#e91e63",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if(result.value == true) {
          this.spinner.show();
          this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
            if (imData != null) {
              //this.isAssetDocUp = true;
              this.isPolicyDocUp = true
              this.PolicyDocUrl = imData.secure_url;
              //this.spinner.hide();
    
              this.esdocs[0] = {
                docname: "Policy",
                crdate: moment().format("L"),
                docurl: imData.secure_url
              }
             
            this.addAssetFromGroup.patchValue({
                PolicyDocument : imData.secure_url,
                PolicyDocDate : moment().format('L')
            })
            }
            this.spinner.hide();
            this.toast.success("Document uploaded successfully");
    
            console.log(imData, "uploaded data")
          });
        } else {
          this.toast.error("Document not uploaded");
        }

      })

      

      //console.log(data, "uploaded data")

    }
  }



  

  uploadInvoiceDoc(event) {
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          //this.isAssetDocUp = true;
          this.isInvoiceDocUp = true
          this.InvoiceDocUrl = imData.secure_url;
          this.spinner.hide();
          //let date = new Date(imData.created_at);

// Extract day, month, and year
        //let day = date.getDate();
        //let month = date.toLocaleString('default', { month: 'long' }); // Get the full month name
        //let year = date.getFullYear();

// Format date in "DD Month YYYY"
        //let formattedDate = `${day} ${month} ${year}`;

        this.AddRecordForm.patchValue({
            invoiceDoc : imData.secure_url,
        })
        }

        console.log(imData, "uploaded data")
      });

      //console.log(data, "uploaded data")

    }
  }

  isRepairInvoiceDocUp = false;
  RepairInvoiceDocUrl = ""
  uploadRepairInvoiceDoc(event) {
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          //this.isAssetDocUp = true;
          this.isRepairInvoiceDocUp = true
          this.RepairInvoiceDocUrl = imData.secure_url;
          this.spinner.hide();
          //let date = new Date(imData.created_at);

// Extract day, month, and year
        //let day = date.getDate();
        //let month = date.toLocaleString('default', { month: 'long' }); // Get the full month name
        //let year = date.getFullYear();

// Format date in "DD Month YYYY"
        //let formattedDate = `${day} ${month} ${year}`;

        this.AddRepairForm.patchValue({
            invoiceDoc : imData.secure_url,
        })
        }

        console.log(imData, "uploaded data")
      });

      //console.log(data, "uploaded data")

    }
  }



  uploadReimbDoc(event) {
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          //this.isAssetDocUp = true;
          this.isMainDocUp = true;
          this.isRepairMainDocUp = true;
          this.isReimbDocUp = true;
          this.AssetDocUrl = imData.secure_url;
          this.spinner.hide();
          //let date = new Date(imData.created_at);

// Extract day, month, and year
        //let day = date.getDate();
        //let month = date.toLocaleString('default', { month: 'long' }); // Get the full month name
        //let year = date.getFullYear();

// Format date in "DD Month YYYY"
        //let formattedDate = `${day} ${month} ${year}`;
        this.AddReimbForm.patchValue({
            uploaded_doc : imData.secure_url,
        })
        }

        console.log(imData, "uploaded data")
      });

      //console.log(data, "uploaded data")

    }
  }

  // this.esdocs = [
  //   {
  //     docname: "Policy",
  //     crdate:"",
  //   }, {
  //     docname: "Registration",
  //     crdate:"",
  //   }
  // ];

  
 updateAsset(data){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
    console.log(user, "......")
    let assetData = this.addAssetFromGroup.value;

    
      
 
    console.log(assetData,"asset data")
    let postData = {
      modified_by: user['full_name'],
      modified_date: assetData.ModifiedDate,
      is_deleted: false,
      id: this.assetDetails.id,
      policy_document: assetData.PolicyDocument,
      registration_document: assetData.RegistrationDocument,
      registration_upload_date: assetData.RegistrationDocDate,
      policy_upload_date: assetData.PolicyDocDate,
      insurance_provider: assetData.InsuranceProvider,
      insurance_policy_number: assetData.InsurancePolicyNumber,
      registration_expiry_date: assetData.RegistrationExpiryDate,
      registration_doc_date: assetData.RegistrationDocDate,
      policy_doc_date: assetData.PolicyDocDate,
      comment: assetData.Comment,
      policy_start_date: assetData.PolicyStartDate,
      policy_end_date: assetData.PolicyEndDate,
      status: assetData.Status
      
    }

    let postHistory = {
      created_by: user['full_name'],
      created_date: this.assetDetails.created_date,
      asset_id: this.assetDetails.id,
      is_deleted: false,
      org_id: this.assetDetails.org_id,
      policy_document: this.assetDetails.policy_document,
      registration_document: this.assetDetails.registration_document,
      registration_expiry_date: this.assetDetails.registration_expiry_date,
      registration_upload_date: this.assetDetails.registration_upload_date,
      policy_start_date: this.assetDetails.policy_start_date,
      policy_end_date: this.assetDetails.policy_end_date,
      policy_upload_date: this.assetDetails.policy_upload_date,
      insurance_provider: this.assetDetails.insurance_provider,
      insurance_policy_number: this.assetDetails.insurance_policy_number,
      comment: this.assetDetails.comment,
      asset_status: this.assetDetails.status
    }
    this.spinner.show();

    console.log("asset data",postData);

    this.assetService.UpdateAssetByID(postData).subscribe((result: any) => {
      console.log(result)
      if(result && result.status == "200"){
         this.assetService.addAssetHistoryByID(postHistory).subscribe((result: any) => {
          console.log(result)
          if(result && result.status == "200"){
            this.toast.success("Asset has been Successfully Updated!");
            this.spinner.hide();
            this.goBack("assetlist");
          }
         });
      }
    });

    // this.assetService.addAssetHistoryByID(postHistory).subscribe((result: any) => {
    //   console.log(result)
    //   if(result && result.status == "200"){
    //     this.toast.success("Asset has been Successfully Updated!");
    //     this.spinner.hide();
    //     this.goBack("assetlist");
    //   }
    // });



  }

  mainDocUrl;
  isDocUp = false;

  goToLink() {
    window.open(this.AssetDocUrl, "_blank");
  }

  goToDocLink() {
    window.open(this.RepairAssetDocUrl, "_blank");
  }

  goToRegLink() {
    window.open(this.RegDocUrl, "_blank");
  }

  goToPolicyLink() {
    window.open(this.PolicyDocUrl, "_blank");
  }

  goToInvoiceLink() {
    window.open(this.InvoiceDocUrl,"_blank");
  }

  goToRepairInvoiceLink() {
    window.open(this.RepairInvoiceDocUrl, "_blank")
  }

  goToMainDoc() {
    window.open(this.mainDocUrl, "_blank");
  }
  onaddremove(){
    this.addocs.pop();
  }

  viewEssentalDoc(data){
    let doc_url = this.esdocs.filter(item => item.docname === data);
    console.log(doc_url[0].docurl, "this is doc url")
    window.open(doc_url[0].docurl, "_blank");
  }

  viewHistoryDoc(data) {
    window.open(data, "_blank")
  }

  removeEssentialDoc(data){
     
    //console.log(doc_url[0].docurl, "this is doc url")
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want Remove the Uploaded Document" ,
      showCloseButton: true,
      confirmButtonColor: '#e91e63',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        if(data === "Policy"){
          this.esdocs[0].docurl = "";
          this.esdocs[0].crdate = "";
          this.isPolicyDocUp = false; 
          this.PolicyDocUrl = "";
          this.addAssetFromGroup.get('PolicyDocument').reset();   
          this.addAssetFromGroup.get('PolicyDocDate').reset();
        } else {
          this.esdocs[1].docurl = "";
          this.esdocs[1].crdate = "";
          this.isRegDocUp = false; 
          this.RegDocUrl = "";
          this.addAssetFromGroup.get('RegistrationDocument').reset(); 
          this.addAssetFromGroup.get('RegistrationDocDate').reset();
        }
        
      this.toast.success("Document deleted successfully");
      }
      else {
        this.toast.error("Document not deleted");
      }});
  }

  showDashData ;
  cardClick(data) {
    console.log(data)
    if (this.showDashList == true && this.dashhead == data) {
      this.showDashList = false;
    }else{
      if (this.assetCatogery.includes(data)){
        this.showDashList = true;
        this.showDashData = this.assetList.filter(item => item.catogery === data);
        console.log(this.showDashData , "this is category data: ")
        this.dashhead = data;
      }
      else if (this.assetType.includes(data)){
        this.showDashList = true;
        this.showDashData = this.assetList.filter(item => item.type === data)
        console.log(this.showDashData, "this is type data: ")
        this.dashhead = data;
      }
      else if (this.assetStatus.includes(data)){
        this.showDashList = true;
        this.showDashData = this.assetList.filter(item => item.status === data);
        console.log(this.showDashData , "this is status data...:")
        this.dashhead = data;
      }
    }

  }




  closeDashList() {

      this.showDashList = false;


  }

  isDisabled = false ;

  commonModuleName;
  roleSetting() {

    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let postData = { id: user_info.role_id }
    if(user_info.is_superadmin == true){
        this.isDisabled = false;
        this.payrollSubmitFullAccess = true;
    }
    else {

      this.userService.GetAccessRightsbyRole(postData).subscribe((data: any) => {
        data.map((item) => {
          item.module_name = item.module_name.replace(/\s+/g, '');;
          return item;
        });
        this.commonModuleName = _.groupBy(data, 'module_name')
        console.log("cmd......",this.commonModuleName)
        if(this.commonModuleName.Asset) {
          console.log("assetttssss..........")
          this.commonModuleName.Asset.map((elm) => {
            if(elm.section_name !== 'Remove Asset'){

                this.isDisabled = true


            } else {
              this.isDisabled = false
            }
          });
        }

        if(this.commonModuleName.Payroll) {
          this.PayrollModuleID = this.commonModuleName.Payroll[0].id;
          this.commonModuleName.Payroll.map((elm) => {
            if (elm.section_name === "Create and Modify Payroll Payments") {
              if (elm.is_allow === true) {
                //this.showPayrollPaymentBtn = elm.is_allow;
                this.createPayrollSectionName = elm.section_name;
              }
            }
          });
          this.checkPayrollApprover(user_info.role_id);
        }
      })

    }





  }

  PayrollModuleID;
 // showPayrollPaymentBtn;
  createPayrollSectionName;
  createPayrollPaymentApprover1rollId;
  createPayrollPaymentApprover1rollName;
  isDualApproverPayrollPayments;
  createPayrollPaymentApprover2rollId;
  createPayrollPaymentApprover2rollName;

  checkPayrollApprover(role_id) {
    let postData = {
      roleID: role_id,
      moduleID: this.PayrollModuleID,
    };

    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe((data: any) => {

      console.log(data, "this is role approval data...")
      //add edit
      data.map((elm) => {
        if (elm.section_name === this.createPayrollSectionName) {
          if (elm.is_full_access) {
            this.addPayrollPaymentsFullAccess = true;
          } else {
            this.addPayrollPaymentsFullAccess = false;
            if (elm.approver1_roleId !== null) {
              this.createPayrollPaymentApprover1rollId = elm.approver1_roleId;
              this.createPayrollPaymentApprover1rollName =
                elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.isDualApproverPayrollPayments = true;
                this.createPayrollPaymentApprover2rollId = elm.approver2_roleId;
                this.createPayrollPaymentApprover2rollName =
                  elm.approver2_role_name;
              }
            }
          }
        }
      });
    });
  }

  // selectedValue: number;  // This will hold the selected 'value' from the dropdown
  // selectedType: string;   // This will hold the 'text' associated with the selected 'value'
  
  // // Method to find the selected text based on the selected value
  // getSelectedText(value: number): string {
  //   const selectedOption = this.assetReqEmp.find(option => option.value === value);
  //   return selectedOption ? selectedOption.text : '';
  // }

  // // Method to handle when the selection changes
  // onSelectionChange() {
  //   this.selectedText = this.getSelectedText(this.selectedType);
  // }


  historyData ;

  submitMaintenanceHistory() {
    //this.spinner.show()
    this.formSubmitAttemptForContact = false;
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }

    console.log(user, "....user Data..")

    //let assetData = this.assetList;
    let val = this.AddRecordForm.getRawValue();
    console.log(val, ".....val")
    let historyData = this.AddRecordForm.value;
  

    console.log(this.maintenanceHistory, "Maintenance history  data")
    
 
   console.log(historyData.is_reimb, "//is_reimb ......")
    let postData = {
      service_center : historyData.serviceCenter,
      created_by: user['full_name'],
      contact_number: val.contactNumber.dialCode+val.contactNumber.number,
      last_maintenance_date: historyData.lastMaintenanceDate,
      amount: this.formatMoney(historyData.cost),
      parts_replaced: historyData.partsReplaced,
      uploaded_doc: this.AssetDocUrl,
      remarks: historyData.remark,
      asset_id: this.assetDetails['id'],
      org_id: this.assetDetails['org_id'],
      reference_id: historyData.referenceNumber,
      employee: historyData.employee,
      invoice_number: historyData.invoiceNumber,
      invoice_date: historyData.invoiceDate,
      is_reimb: this.reimbSelected,
      status: "Approved",
      emp_id: user['id'],
      approver1_roleId: null,
      approver2_roleId: null,
      mileage: historyData.mileage,
      document: historyData.invoiceDoc,
      voucher_number: historyData.voucherNumber,
      voucher_date: historyData.paymentDate      
    }

    
    if(this.AddRecordForm.controls['contactNumber'].invalid ){
      this.toast.error("Add valid phone number...");
     
    } else if( this.AddRecordForm.controls['lastMaintenanceDate'].invalid ){
      this.toast.error("Add valid service Date...");
    } else if (this.AddRecordForm.controls['cost'].invalid) {
      this.toast.error("Add valid cost....")
    } 
    
    
      else if (this.addPayrollPaymentsFullAccess)
        {
          
          this.payrollService.generateMaintenanceReimb(postData).subscribe((result:any) => {
            if(result){
              let postData = {
                "org_id": this.assetDetails['org_id'],
                "asset_id": this.assetDetails['id']
              }
              this.toast.success("Maintenance Reimbursement History has been Successfully Added!");
              this.AddRecordForm.reset();
              this.isDocUp = false;
              this.isInvoiceDocUp = false;
              
              console.log(postData)
    
              this.payrollService.GetReimbData(postData).subscribe((data: any) => {
                if(data != null) {
                  this.maintenanceHistory = data;
    
    
                  console.log(result)
                this.closeModel();
                
                
                
    
                } else {
                  this.toast.error("Somthing went worng, Please try Again!");
                }
                console.log(this.maintenanceHistory)
              })
            } else {
              this.toast.error("Somthing went worng, Please try Again!");
            }
          })
        }

    
     else {
          
          postData.approver1_roleId = this.createPayrollPaymentApprover1rollId;
          postData.status = "Pending";
          if (this.isDualApproverPayrollPayments)
            postData.approver2_roleId = this.createPayrollPaymentApprover2rollId;
    
          this.payrollService.generateMaintenanceReimb(postData).subscribe((result:any) => {
            if(result){
              let postData = {
                "org_id": this.assetDetails['org_id'],
                "asset_id": this.assetDetails['id']
              }
              this.toast.success("Maintenance Reimbursement History has been Successfully Added!");
              this.AddRecordForm.reset();
              this.isDocUp = false;
              this.isInvoiceDocUp = false;
              console.log(postData)
              

              this.payrollService.GetReimbData(postData).subscribe((data: any) => {
                if(data != null) {
                  this.maintenanceHistory = data;
    
    
                  console.log(result)
                this.closeModel();
                
    
                }
                else {
                  this.toast.error("Somthing went worng, Please try Again!");
                }
                console.log(this.maintenanceHistory)
              })
            } else {
              this.toast.error("Somthing went worng, Please try Again!");
            }
          })
    
        }
    

    console.log("asset data",postData);


  }




  repairData;

  submitRepairHistory() {
    
    this.formSubmitAttemptForContact = false;
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }

    console.log(user, "....user Data..")

    //let assetData = this.assetList;
    let val = this.AddRepairForm.getRawValue();
    console.log(val, ".....val")
    let repairData = this.AddRepairForm.value;
  

    console.log(this.repairHistory, "Repair history  data")
    
 
   console.log(repairData.is_reimb, "//is_reimb ......")
    let postData = {
      service_center : repairData.serviceCenter,
      created_by: user['full_name'],
      contact_number: val.contactNumber.dialCode+val.contactNumber.number,
      repaired_date: repairData.repairedDate,
      amount: this.formatMoney(repairData.cost),
      parts_replaced: repairData.partsReplaced,
      uploaded_doc: this.RepairAssetDocUrl,
      remarks: repairData.remark,
      asset_id: this.assetDetails['id'],
      org_id: this.assetDetails['org_id'],
      reference_id: repairData.referenceNumber,
      employee: repairData.employee,
      invoice_number: repairData.invoiceNumber,
      invoice_date: repairData.invoiceDate,
      is_reimb: this.reimbSelected,
      status: "Approved",
      emp_id: user['id'],
      approver1_roleId: null,
      approver2_roleId: null,
      mileage: repairData.mileage,
      document: repairData.invoiceDoc,
      voucher_number: repairData.voucherNumber,
      voucher_date: repairData.paymentDate      
    }

    
    if(this.AddRepairForm.controls['contactNumber'].invalid ){
      this.toast.error("Add valid phone number...");
     
    } else if( this.AddRepairForm.controls['repairedDate'].invalid ){
      this.toast.error("Add valid service Date...");
    } else if (this.AddRepairForm.controls['cost'].invalid) {
      this.toast.error("Add valid cost....")
    } 
    
    
      else if (this.addPayrollPaymentsFullAccess)
        {
          
          this.payrollService.generateRepairReimb(postData).subscribe((result:any) => {
            if(result){
              let postData = {
                "org_id": this.assetDetails['org_id'],
                "asset_id": this.assetDetails['id']
              }
              this.toast.success("Repair Reimbursement History has been Successfully Added!");
              this.AddRepairForm.reset();
              this.isDocUp = false;
              this.isRepairInvoiceDocUp = false;
              
              console.log(postData)
    
              this.payrollService.GetRepairData(postData).subscribe((data: any) => {
                if(data != null) {
                  this.repairHistory = data;
    
    
                  console.log(result)
                this.closeModel();
                
                
                
    
                } else {
                  this.toast.error("Somthing went worng, Please try Again!");
                }
                console.log(this.repairHistory)
              })
            } else {
              this.toast.error("Somthing went worng, Please try Again!");
            }
          })
        }

    
     else {
          
          postData.approver1_roleId = this.createPayrollPaymentApprover1rollId;
          postData.status = "Pending";
          if (this.isDualApproverPayrollPayments)
            postData.approver2_roleId = this.createPayrollPaymentApprover2rollId;
    
          this.payrollService.generateRepairReimb(postData).subscribe((result:any) => {
            if(result){
              let postData = {
                "org_id": this.assetDetails['org_id'],
                "asset_id": this.assetDetails['id']
              }
              this.toast.success("Repair Reimbursement History has been Successfully Added!");
              this.AddRepairForm.reset();
              this.isDocUp = false;
              this.isRepairInvoiceDocUp = false;
              console.log(postData)
              

              this.payrollService.GetRepairData(postData).subscribe((data: any) => {
                if(data != null) {
                  this.repairHistory = data;
    
    
                  console.log(result)
                this.closeModel();
                
    
                }
                else {
                  this.toast.error("Somthing went worng, Please try Again!");
                }
                console.log(this.repairHistory)
              })
            } else {
              this.toast.error("Somthing went worng, Please try Again!");
            }
          })
    
        }
    

    console.log("asset data",postData);


  }

  val: any;

  newMaintenanceHistory ;

  viewHistoryData(datas) {
    this.modalService.open(this.maintenanceHistoryModel)
    this.newMaintenanceHistory = datas;
    console.log(datas)
    console.log(this.newMaintenanceHistory, "newww ......")
      console.log(this.data, "employeee//////")
      this.newMaintenanceHistory.last_maintenance_date = moment(this.newMaintenanceHistory.last_maintenance_date).format('MMM D, YYYY');
      this.newMaintenanceHistory.amount = this.formatMoney(this.newMaintenanceHistory.amount);
      console.log(this.newMaintenanceHistory.amount, "amountttttt")
      this.newMaintenanceHistory.created_date = moment(this.newMaintenanceHistory.created_date).format('MMM D, YYYY');
      this.newMaintenanceHistory.invoice_date = moment(this.newMaintenanceHistory.invoice_date).format('MMM D, YYYY');
      this.newMaintenanceHistory.voucher_date = moment(this.newMaintenanceHistory.voucher_date).format('MMM D, YYYY');
      this.mainDocUrl = this.newMaintenanceHistory.uploaded_doc;
      this.InvoiceDocUrl = this.newMaintenanceHistory.document;
    console.log(this.mainDocUrl)
    if(this.mainDocUrl === "" || this.mainDocUrl === null)
    {
      this.isDocUp = false;
    } else  {
      this.isDocUp = true;
    }

    if(this.InvoiceDocUrl === "" || this.InvoiceDocUrl === null)
      {
        this.isInvoiceDocUp = false;
      } else  {
        this.isInvoiceDocUp = true;
      }
      
    
      this.val = this.data.find(elm => elm.id === this.newMaintenanceHistory.employee || elm.full_name === this.newMaintenanceHistory.employee);

      console.log(this.val, "employee name")
      // if(this.val ) {
      //   this.newMaintenanceHistory.employee = "Not Available";
      // }
      this.newMaintenanceHistory.employee = this.val.full_name;
      
      //console.log(this.maintenanceHistory.employee, "employee name")
      

    // if(this.newMaintenanceHistory.cost != null || this.newMaintenanceHistory.cost != "") {
      //this.newMaintenanceHistory.cost = this.newMaintenanceHistory.cost.toFixed(2)
    // }
    //this.newMaintenanceHistory.cost = this.newMaintenanceHistory.cost.toFixed(2);
    

  }

  newAssignHistory;
  viewAssignData(data){
    this.modalService.open(this.assignHistoryModel)
    this.newAssignHistory = data;
    this.newAssignHistory.start_date = moment(this.newAssignHistory.start_date).format('MMM D, YYYY');
    this.newAssignHistory.end_date = moment(this.newAssignHistory.end_date).format('MMM D, YYYY');
    this.newAssignHistory.assigned_date = moment(this.newAssignHistory.assigned_date).format('MMM D, YYYY');
  }


  newRepairHistory
  viewRepairHistoryData(data) {
    this.modalService.open(this.repairHistoryModel)
    this.newRepairHistory = data;
    console.log(data)
    console.log(this.newRepairHistory, "newww ......")


    this.newRepairHistory.repaired_date = moment(this.newRepairHistory.repaired_date).format('MMM D, YYYY');
      this.newRepairHistory.amount = this.formatMoney(this.newRepairHistory.amount);
      console.log(this.newRepairHistory.amount, "amountttttt")
      this.newRepairHistory.created_date = moment(this.newRepairHistory.created_date).format('MMM D, YYYY');
      this.newRepairHistory.invoice_date = moment(this.newRepairHistory.invoice_date).format('MMM D, YYYY');
      this.newRepairHistory.voucher_date = moment(this.newRepairHistory.voucher_date).format('MMM D, YYYY');
      this.RepairAssetDocUrl = this.newRepairHistory.uploaded_doc;
      this.RepairInvoiceDocUrl = this.newRepairHistory.document;
    



    this.RepairAssetDocUrl = this.newRepairHistory.uploaded_doc;
    console.log(this.mainDocUrl)
    if(this.RepairAssetDocUrl === "" || this.RepairAssetDocUrl === null)
    {
      this.isRepairMainDocUp = false;
    } else  {
      this.isRepairMainDocUp = true;
    }

    if(this.RepairInvoiceDocUrl === "" || this.RepairInvoiceDocUrl === null)
      {
        this.isRepairInvoiceDocUp = false;
      } else  {
        this.isRepairInvoiceDocUp = true;
      }
      
    
      this.val = this.data.find(elm => elm.id === this.newRepairHistory.employee || elm.full_name === this.newRepairHistory.employee);

      console.log(this.val, "employee name")
      
      this.newRepairHistory.employee = this.val.full_name;

  }

  



  
  reimbSelected = false;
  
  async onRecOrReimb(event) {

    
    //this.selectedOption = option ;

   
      if(event.checked){
        this.reimbSelected = true;
        this.isReadOnly = true;
        //this.AddRecordForm.reset();
        this.mainDocUrl = '';
        this.InvoiceDocUrl = '';
        this.RepairInvoiceDocUrl = '';
        this.isMainDocUp = false;
        this.isRepairMainDocUp = false;
        this.isInvoiceDocUp = false;
        this.isRepairInvoiceDocUp = false;
        // this.AddRecordForm.patchValue({
        //   isReimb: true
        // })

        // this.AddRepairForm.patchValue({
        //   isReimb: true
        // })

      try {

        let user={};
      if(localStorage.getItem('user_info')){
        user= JSON.parse(localStorage.getItem('user_info'));
      }
        const data: any = await this.empService.getEmployeeByOrgId().toPromise();
        console.log(data, "data");
  
        if (data && data.length > 0) {
          if(user['is_admin'] === true){
            this.is_admin = true
            data.forEach((element) => {
              this.assetReqEmp.push({
                id:element.id,
                value: element.full_name,
              })
            })
          } else {
            this.is_admin = false
            this.AddRecordForm.patchValue({
              employee: user['full_name']
          })
  
          console.log(this.AddRecordForm.get('employee').value, "employeeee......")
          
          }
          
        }
        // this.isEmpDelLoading = false;
      } catch (error) {
        console.error("Error fetching employees:", error);
      }

      try {

        let user={};
      if(localStorage.getItem('user_info')){
        user= JSON.parse(localStorage.getItem('user_info'));
      }
        const data: any = await this.empService.getEmployeeByOrgId().toPromise();
        console.log(data, "data");
  
        if (data && data.length > 0) {
          if(user['is_admin'] === true){
            this.is_admin = true
            data.forEach((element) => {
              this.assetReqEmp.push({
                id:element.id,
                value: element.full_name,
              })
            })
          } else {
            this.is_admin = false
            this.AddRepairForm.patchValue({
              employee: user['full_name']
          })
  
          console.log(this.AddRepairForm.get('employee').value, "employeeee......")
          
          }
          
        }
        // this.isEmpDelLoading = false;
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
        
      }else{
        this.reimbSelected = false;
        this.isReadOnly = false;
        this.AddRecordForm.reset();
        this.AddRepairForm.reset();
        this.mainDocUrl = '';
        this.InvoiceDocUrl = '';
        this.RepairInvoiceDocUrl = '';
        this.isMainDocUp = false;
        this.isRepairMainDocUp = false;
        // this.isInvoiceDocUp = false
        //   this.AddRecordForm.patchValue({
        //   isReimb: false
        // })

        // this.AddRepairForm.patchValue({
        //   isReimb: false
        // })
    }

    

    if(this.selectedOption === 'is_reimb') {
      let user={};
      if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
      }

      this.AddReimbForm.patchValue({
        employee: user['full_name']
      })

      


    }
    
  }

  reimbursementData;

  maintenanceReimbursementSubmit() {

    let user={};
      if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
      }

      let reimbData = this.AddReimbForm.value;

      let postData = {
        emp_id : user['id'],
        employee: reimbData.employee,
        amount: reimbData.amount,
        dateIncurred: reimbData.dateIncurred,
        remarks: reimbData.Remark,
        document: reimbData.uploaded_doc,
        created_by: user['id'],
        modified_by: user['id'],
        
        is_approved_1: false,
        is_approved_2: false,
        status: "Pending",
      }

      this.assetService.generateMaintenanceReimb(postData).subscribe((data: any) => {
        if(data != null) {
          this.repairHistory = data;


          //console.log(result)
        this.closeModel();
        this.isMainDocUp = false;
        this.isRepairMainDocUp = false;
        this.isInvoiceDocUp = false;
        this.isRepairInvoiceDocUp = false;
        // this.isRepairDocUp = false;
        this.AssetDocUrl =''
        this.isReimbDocUp = false

        }
        console.log(this.repairHistory)
      })

      
  }

  //invoiceDate;

  //dateValue: any ="" ;

  calculateExpireDate() {
    let assetData = this.addAssetFromGroup.value;
    
    let invoiceDate = new Date(assetData.InvoiceDate);

    if( assetData.InvoiceDate === null || assetData.InvoiceDate === undefined ){
      this.addAssetFromGroup.patchValue({
        WarrantyEndDate : ''
      })
      return;
    }

    if(assetData.WarrantyPeriod === '' || assetData.WarrantyPeriod === null || assetData.WarrantyPeriod === undefined) {

      console.log(assetData.WarrantyPeriod, "...testttt")
      this.addAssetFromGroup.patchValue({
        WarrantyEndDate : ''
      })
      return;
    }

    const periodValue = parseInt(assetData.WarrantyPeriod.split(' ')[0]);  // Extract the numeric part (e.g., 1, 2)
    const periodUnit = assetData.WarrantyPeriod.split(' ')[1];  // Extract the unit part (e.g., weeks, months, years)

    // Calculate the expiry date based on the period
    if (periodUnit === 'Week') {
      invoiceDate.setDate(invoiceDate.getDate() + periodValue * 7 - 1);  // Add weeks
    } else if (periodUnit === 'Month') {
      invoiceDate.setMonth(invoiceDate.getMonth() + periodValue ); 
      invoiceDate.setDate(invoiceDate.getDate() - 1) // Add months
    } else if (periodUnit === 'Year') {
      invoiceDate.setFullYear(invoiceDate.getFullYear() + periodValue ); 
      invoiceDate.setDate(invoiceDate.getDate() - 1) // Add years
    }
    

    // Format the expiry date as yyyy-mm-dd
    //this.dateValue = this.datePipe.transform(invoiceDate, 'MMM d, y')
    this.addAssetFromGroup.patchValue({
      WarrantyEndDate : this.datePipe.transform(invoiceDate, 'MMM d, y')
    })
    
    
  }

}
