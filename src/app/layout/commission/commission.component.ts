import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { ProjectService } from '../../services/project.service';
import { OrganizationService } from '../../services/organization.service';
import { EmployeeService } from '../../services/employee.service';
import { CountryService } from '../../services/countryList.service';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { settingsService } from '../../services/settings.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import moment = require('moment');
import * as _ from "lodash";
import cityList from '../cityList';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent implements OnInit {

  pageName = 'Other Income';
  noAccessPage = false;
  public paymentMethodologyForm: FormGroup;
  currentUser = JSON.parse(localStorage.getItem('user_info'));
  orgID = this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id');
  mainCommissionList = true;
  userFormType;
  addCommissionForm: FormGroup;
  addCommissionContactForm: FormGroup;
  addContactForm: FormGroup;
  addCompanyContactForm: FormGroup;
  updateIncomeForm: FormGroup;
  commonFields: Object = { text: "value", value: "id"};
  @ViewChild('resetDropDown',{static:false}) public resetDropDown: DropDownListComponent;
  @ViewChild('resetDropDown2',{static:false}) public resetDropDown2: DropDownListComponent;
  @ViewChild('resetDropDownVen',{static:false}) public resetDropDownVen: DropDownListComponent;
  @ViewChild('resetPayDropDown',{static:false}) public resetPayDropDown: DropDownListComponent;

  customerDataDropDown;
  leadOwnerDataDropDown;
  typeSourceDataDropDown;
  projectListingData
  showProjectOption = true;

	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
  selectedISO = CountryISO.UnitedArabEmirates;

  headerText= [
    { text: 'Under Negotiation' },
    { text: 'Confirmed' },
    { text: 'Declined' }
  ]

  formSubmitAttemptForService = true;
  formSubmitAttemptForContact = true;
  formSubmitAttemptForUpdate = true;
  formSubmitAttemptForComContact = true;

  showOrganizationForm = false;
  countryDataDropDown;
  cityDataDropDown = cityList;
  relationDataDropDown = [{
      id:'Owner',
      value:'Owner'
    },{
      id:'Consultant',
      value:'Consultant'
    },{
      id:'Personal Advisor',
      value:'Personal Advisor'
    },{
      id:'Office Manager',
      value:'Office Manager'
    }
  ]

  creditTermsDaysData = [
    {
      id:'Immediately',
      value: 'Immediately'
    },{
      id:'15',
      value: '15 Days'
    },{
      id:'30',
      value: '30 Days'
    },{
      id:'60',
      value: '60 Days'
    }
  ]

  updateStatusDataDropDown = [
    {
      id: 'Confirmed',
      value: 'Confirmed'
    },
    {
      id: 'Under Negotiation',
      value: 'Under Negotiation'
    },
    {
      id: 'Declined',
      value: 'Declined'
    }
  ]
  industryTypeDataDropDown;
  allCommissionServicedata;
  @ViewChild('CommissionServicedataTableGrid',{static:false}) public CommissionServicedataTableGrid: GridComponent;
  @ViewChild('searchCostomerdataTableGrid',{static:false}) public searchCostomerdataTableGrid: GridComponent;
  public invoiceToolbar : ToolbarItems[];
  allVendordropDownData;
  closingDateMinDate;
  newClosingDateMinDate = new Date();
  commissionID;
  updateCommissionData;
  commissionStatus = [
    {
      id: 'Confirmed',
      value: 'Confirmed'
    },
    {
      id: 'Declined',
      value: 'Declined'
    }
  ]

  incomeTypeDataDropDown;
  incomeTypeDataSelected;
  customerSelected = false;
  custDataSelected = '';
  vendDataSelected = '';
  dateradio = [
    {
      id: 15,
      value: '15 Days'
    },
    {
      id: 30,
      value: '30 Days'
    },
    {
      id: 45,
      value: '45 Days'
    },
    {
      id: 60,
      value: '60 Days'
    }
  ]
  selectedProjectData = '';
  projectData;

  vendorForm: FormGroup;
  venPriConForm: FormGroup;

  vendorType = [
    {
      id: 'Contractor',
      value: 'Contractor'
    },
    {
      id: 'Trader',
      value: 'Trader'
    },
    {
      id: 'Consultant',
      value: 'Consultant'
    }
  ]
  vendorCategoryDropDown;
  vendorStatusDropDown;
  vendorDocDropDown;
  docVendorData
  formSubmitAttemptForVendor = true;
  formSubmitAttemptForVendorContact = true;
  expDateMinDate = new Date();
  showFollowUpdate = false;
  projectTypeData;
  vendorCustError = '';
  allIncomePaymentTermData;
  allPaymentTermDropData
  defaultDropValue
  showPercentageError = false;
  projectType;
  currentTabName = 'Under Negotiation';
  dataToDisplay;
  //date
  dateRangeForm: FormGroup;
  fromDate = moment().subtract(7, "days").format('L');
  toDate = moment().format('L');
  dateTextToDisplay = moment().subtract(7, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
  isSixMonthActive = false;
  isYearActive = false;
  isMonthActive = false;
  isWeekActive = true;
  isTodayActive= false;
  fromStartTillNow = false;
  CommissionPolicyData;
  selectAProjectError = false;
  vatPercentage;
  orgCurrency;

  constructor(
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private empService: EmployeeService,
    private userService: UserService,
    private countries:CountryService,
    private settingsService: settingsService,
    public OrganizationService: OrganizationService,
    public router: Router
  ) { }

  ngOnInit() {
    this.invoiceToolbar = ['Search'];
    this.checkUserRights();
    this.findByOrgId();
    //formControl
    this.dateRangeForm = this.formBuilder.group({
      daterange: [''],
    });
    this.addCommissionFormInputs();
    this.addCommissionContactFormInputs();
    this.addContactFormInputs();
    this.createPaymentMethodologyForm();
    this.vendorFormInputs();
    this.venPriConFormInputs();
    this.updateIncomeFormInputs();

    this.GetCommissionServiceByDateOrgId(this.currentTabName);

    //active when date picker value changes
    this.dateRangeForm.get('daterange').valueChanges.subscribe(() => {
      let startTime = this.dateRangeForm.get('daterange').value;
      this.fromDate = moment(startTime[0]).format('L');
      this.toDate = moment(startTime[1]).format('L');
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateTextToDisplay = moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');
      this.GetCommissionServiceByDateOrgId(this.currentTabName);
    });
  }

  checkUserRights(){
    if(this.currentUser.is_superadmin === true){
      this.noAccessPage = true;
    }else{
      let postData = { id : this.currentUser.role_id }
      this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
        data.map((item) => {
          item.module_name = item.module_name.replace(/\s+/g, '');
          return item;
        });
        let commonModuleName = _.groupBy(data, 'module_name')

        if(commonModuleName.OtherIncome){
          commonModuleName.OtherIncome.map((elm) => {
            if(elm.section_name === 'Add/Update Other Income'){
              if(elm.is_allow){
                this.noAccessPage = elm.is_allow;
              }
            }
          });
        }
      });
    }
  }

  findByOrgId(){
    this.OrganizationService.getOrgById(this.orgID).subscribe((data: any) => {
      this.vatPercentage = data.vatpercent !== null ? data.vatpercent : 5;
      this.orgCurrency = data.organizationSetup.currency !== null ? data.organizationSetup.currency : 'AED';
    });
  }

  getCommonDateType(value){
    if(value === 'today'){
      this.fromDate = moment().format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().format('ddd, D MMM YYYY')
      this.isTodayActive = true;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.fromStartTillNow = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.GetCommissionServiceByDateOrgId(this.currentTabName);
    }else if(value === 'weeks'){
      this.fromDate = moment().subtract(7, "days").format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(7, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = true;
      this.isMonthActive = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.fromStartTillNow = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.GetCommissionServiceByDateOrgId(this.currentTabName);
    }else if(value === 'month'){
      this.fromDate = moment().startOf('month').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().startOf('month').format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = true;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.fromStartTillNow = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.GetCommissionServiceByDateOrgId(this.currentTabName);
    }else if(value === 'six-month'){
      this.fromDate = moment().subtract(6, 'months').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(6, 'months').format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.isSixMonthActive = true;
      this.isYearActive = false;
      this.fromStartTillNow = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.GetCommissionServiceByDateOrgId(this.currentTabName);
    }else if(value === 'year'){
      this.fromDate = moment().startOf('year').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().startOf('year').format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.isSixMonthActive = false;
      this.isYearActive = true;
      this.fromStartTillNow = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.GetCommissionServiceByDateOrgId(this.currentTabName);
    }else if(value === 'all'){
      this.dateTextToDisplay = 'From start till '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.fromStartTillNow = true;
      this.GetAllCommissionServiceData(this.currentTabName);
    }
  }

  tabSelected(event){
    this.currentTabName = event.selectedItem.textContent;
    if(this.fromStartTillNow){
      this.GetAllCommissionServiceData(this.currentTabName);
    }else{
      this.GetCommissionServiceByDateOrgId(this.currentTabName)
    }

  }

  GetCommissionServiceByDateOrgId(keyWord){
    this.spinner.show();
    this.settingsService.GetCommissionServiceByDateOrgId(this.fromDate, this.toDate).subscribe((data:any) => {
      if(data.length !== 0){
        let results = [];
        data.map((elm, i) => {
          if(elm.status === keyWord){
            results.push(elm)
          }

          if(data.length === i+1){
            results.sort((a,b)=> Date.parse(b.createdDate) - Date.parse(a.createdDate));
            this.allCommissionServicedata = results;
            this.getCardData(data);
          }
        });
      }else{
        this.allCommissionServicedata = data;
        this.dataToDisplay = [];
        this.spinner.hide();
      }

    });
  }

  GetAllCommissionServiceData(keyWord){
    this.spinner.show();
    this.settingsService.GetCommissionServiceByOrgId().subscribe((data: any) => {
      let results = [];
      data.map((elm, i) => {
        if(elm.status === keyWord){
          results.push(elm)
        }

        if(data.length === i+1){
          results.sort((a,b)=> Date.parse(b.createdDate) - Date.parse(a.createdDate));
          this.allCommissionServicedata = results;
          this.getCardData(data);
        }
      });
    });
  }

  getCardData(data){
    this.dataToDisplay = [];
    let conf = [];
    let decl = [];
    let unNe = [];
    data.map((elm, i) => {
      if(elm.status === "Confirmed"){
        elm.comValue = elm.comValue !== '' ? elm.comValue : 0;
        conf.push(elm)
      } else if(elm.status === "Declined"){
        elm.comValue = elm.comValue !== '' ? elm.comValue : 0;
        decl.push(elm)
      } else if (elm.status === "Under Negotiation"){
        elm.estcomValue = elm.estcomValue !== '' ? elm.estcomValue : 0;
        unNe.push(elm)
      }

      if(data.length === i+1){
        if(conf.length !== 0){
          this.dataToDisplay.push({
            type: 'Confirmed',
            totalAmt: conf.map((item) => parseFloat(item.comValue)).reduce((prev, next) => prev + next),
            totalList: conf.length
          });
        }

        if(decl.length !== 0){
          this.dataToDisplay.push({
            type: 'Declined',
            totalAmt: decl.map(item => parseFloat(item.comValue)).reduce((prev, next) => prev + next),
            totalList: decl.length
          });
        }

        if(unNe.length !== 0){
          this.dataToDisplay.push({
            type: 'Under Negotiation',
            totalAmt: unNe.map(item => parseFloat(item.estcomValue)).reduce((prev, next) => prev + next),
            totalList: unNe.length
          });
        }
        this.spinner.hide();
      }
    });
  }

  toProjectLayout(id){
    localStorage.setItem('project_id',id);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/project-layout-new'])
    );
    window.open(url, "_blank");
  }

  askForIncomeType(){
    this.spinner.show();
    $('#incomeType').modal('show');
    this.GetIncomeTypeByOrgId();
  }

  GetIncomeTypeByOrgId(){
    this.settingsService.GetIncomeTypeByOrgId().subscribe((data: any) => {
      let results = [];
      data.map((elm) => {
        results.push({
          id: elm.id,
          value: elm.name
        });
      });
      this.incomeTypeDataDropDown = results;
      this.spinner.hide();
    })
  }

  selectAnIncome(event){
    if(event.value !== null){
      this.incomeTypeDataSelected = event.itemData;
      this.settingsService.CommisionTypeByincTypId({id:this.incomeTypeDataSelected.id}).subscribe((data: any) => {
        let results = []
        data.map((elm) => {
          results.push({
            id: elm.id,
            value: elm.name
            })
        });
        this.typeSourceDataDropDown = results;
        $('#incomeType').modal('hide');
        this.addCommissionDiv();
      });
    }
  }

  addCommissionDiv(){
    this.spinner.show();
    this.custDataSelected = '';
    this.vendDataSelected = '';
    this.mainCommissionList = false;
    this.userFormType = 'Add';
    this.GetAllCustomerByOrgID();
    this.GetAllProjectsByOrgId();
    this.GetProjectTypeByOrgID();
    this.getCountryListCom();
    this.EmpList();
    this.GetCommissionVendors();
    this.GetLastCommissionServiceByOrgId();
    this.closingDateMinDate = new Date();
    this.spinner.hide();
  }

  onVendOrCust(event){
    if(event.checked){
      this.customerSelected = true;
      this.vendDataSelected = '';
    }else{
      this.customerSelected = false;
      this.custDataSelected = '';
    }
  }

  choseSingleCustomer(event){
    let custValue = event.itemData;
    this.projectService.FindByCustomerId({id: custValue.id}).subscribe((data:any)  => {
      this.custDataSelected = data;
    });
  }

  choseSingleVendor(event){
    this.spinner.show();
    let venValue = event.itemData;
    this.settingsService.GetCommissionVendors().subscribe((data: any) => {
      let venMainData = data.filter((elm) => elm.id === venValue.id);
      let venData = venMainData[0];
      delete venData['documentExpiryDate'];
      delete venData['documentUrl'];
      delete venData['vendorLocation'];
      this.settingsService.EntityContactsByVendorId({id: venData.id}).subscribe((contData) => {
        venData.entityContact = contData;
        this.settingsService.DocumentUrlByVendorId({id: venData.id}).subscribe((docData) => {
          venData.vendorEntityDocument = docData;
          this.vendDataSelected = venData;
          this.spinner.hide();
        });
      });
    });
  }

  checkProject(e){
    this.showProjectOption = !e.checked;
  }

  selectClosingDate(value){
    this.addCommissionForm.patchValue({
      closingDate: new Date(new Date().setDate(new Date().getDate() + value))
    });
  }

  submitAddCommission(){
    this.formSubmitAttemptForService = false;
    this.vendorCustError = '';
    let formValue = this.addCommissionForm.value;
    let formValue2 = this.addCommissionContactForm.value;
    if(!this.showProjectOption){
      this.formSubmitAttemptForComContact = false;
      if(this.addCommissionContactForm.invalid){
        return;
      }
    }else if(formValue.commissionProject === ''){
      this.selectAProjectError = true;
      return;
    }

    if(this.addCommissionForm.invalid){
      return;
    }

    if(this.commissionID === ''){
      this.toast.error('Commission ID cannot be created due to no Commission Prefix defined in settings')
      return;
    }

    if(this.customerSelected){
      if(formValue.customer === ''){
        let message = 'Please select a Customer';
        this.vendorCustError = message;
        return;
      }
    }else{
      if(formValue.vendor === ''){
        let message = 'Please select a Vendor';
        this.vendorCustError = message;
        return;
      }
    }

    let postData:any = {
      commisionId: this.commissionID,
      customerId: this.customerSelected ? formValue.customer : '',
      vendorId: !this.customerSelected ? formValue.vendor : '',
      org_id: this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id'),
      typeId: formValue.commissionType,
      projectType: formValue.projectType,
      estAmount: formValue.estContValue,
      estcomValue: formValue.estimatedValue,
      description: formValue.Description,
      status: "Under Negotiation",
      projectId: this.showProjectOption ? formValue.commissionProject : '',
      incTypId: this.incomeTypeDataSelected.id,
      closingDate: moment(formValue.closingDate).format('L'),
      createdDate: moment().format('L'),
      createdByEmpId: this.currentUser.id,
      createdBy: this.currentUser.full_name
    }

    if(!this.showProjectOption){
      postData.ldName = formValue2.ldName,
      postData.ldEmail = formValue2.ldEmail,
      postData.ldPhone = formValue2.ldPhone.dialCode+formValue2.ldPhone.number,
      postData.ldAddress = formValue2.ldAddress,
      postData.ldAddressSecond = formValue2.ldAddressSecond,
      postData.ldCity = formValue2.ldCity,
      postData.ldCountry = formValue2.ldCountry
    }else{
      postData.ldName = null,
      postData.ldEmail = null,
      postData.ldPhone = null,
      postData.ldAddress = null,
      postData.ldAddressSecond = null,
      postData.ldCity = null,
      postData.ldCountry = null
    }

    this.settingsService.AddCommissionService(postData).subscribe((data: any) => {
      if(data.status === '200'){
        this.toast.success(data.desc)
      }else{
        this.toast.error('Something went wrong')
      }
      this.closeAddCommissionDiv();
    });
  }

  closeAddCommissionDiv(){
    this.mainCommissionList = true;
    this.customerSelected = false;
    this.showProjectOption = true;
    this.formSubmitAttemptForService = true;
    this.formSubmitAttemptForComContact = true;
    this.selectAProjectError = false;
    this.addCommissionForm.reset();
    this.addCommissionContactForm.reset();
    this.commissionID = '';
    this.vendorCustError = '';
    this.selectedProjectData = '';
    this.GetCommissionServiceByDateOrgId(this.currentTabName);
    this.resetDropDown.value = null;
    this.resetDropDown2.value = null;
  }

  viewVendorsDiv(data){
    this.spinner.show();
    delete data['column'];
    delete data['foreignKeyData'];
    delete data['index'];
    data.comValue = parseFloat(parseFloat(data.comValue).toFixed(2))
    data.incomeVat = Math.round((this.vatPercentage/100) * data.comValue)
    this.updateCommissionData = data;
    this.GetCommissionPolicybyComId(data.commisionId);
    this.getProjectType(data.projectType)
    this.getVendorCustomerInfo(data)
    if(data.projectId !== ''){
      this.FindByProjectID(data.projectId);
    }
    $('#view_Commission_modal').modal('show');
    this.spinner.hide();
  }

  getTotalValue(){
    let getComValue = this.updateIncomeForm.get('comValue').value === '' ? 0 : this.updateIncomeForm.get('comValue').value;
    return Math.round(((this.vatPercentage/100) * getComValue) + getComValue)
  }

  GetCommissionPolicybyComId(comID){
    this.settingsService.GetCommissionPolicybyComId({id:comID}).subscribe((data) => {
      this.CommissionPolicyData = data;
      let getPerTotal = this.returnTotalProjPercent(data)
      let getValueTotal = this.returnTotalProjValue(data)
      this.CommissionPolicyData = {
        commissionPolicyData: data,
        getPerTotal: getPerTotal,
        getValueTotal: getValueTotal
      }
    });
  }

  returnTotalProjPercent(data){
    let getPerTotal = [];
    data.map((elm) => {
      if(elm.term_percent !== ''){
        getPerTotal.push(parseInt(elm.term_percent))
      }
    });
    const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
    return sumProj+' %';
  }

  returnTotalProjValue(data){
    let getValueTotal = [];
    data.map((elm) => {
      if(elm.term_value !== ''){
        getValueTotal.push(parseFloat(elm.term_value))
      }
    });
    const sumValue = getValueTotal.reduce((a, b) => a + (b || 0), 0);
    return sumValue;
  }

  closeVendorsDiv(){
    $('#view_Commission_modal').modal('hide');
  }

  updateVendorsDiv(data){
    this.spinner.show();
    delete data['column'];
    delete data['foreignKeyData'];
    delete data['index'];
    this.updateCommissionData = data;
    this.getProjectType(data.projectType)
    this.getVendorCustomerInfo(data)
    if(data.projectId !== ''){
      this.FindByProjectID(data.projectId);
    }
    $('#update_Commission_modal').modal('show');
    this.updateIncomeForm.patchValue({
      status: data.status,
      contractUrl: ''
    })
  }

  getProjectType(id){
    this.projectService.GetProjectTypeByOrgID().subscribe((data: any) => {
      this.projectType = data.filter((elm) => {return elm.id === id})[0].type_name;
    });
  }

  changeUpdateStatus(e){
    if(e.value === "Confirmed"){
      this.showFollowUpdate = true;
      this.GetPaymentPolicyByOrgId();
    }else{
      this.showFollowUpdate = false;
    }
  }

  onFileSelectUpdateCom(event){
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
      const file:File = imageData;
      if(file){
        let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
        let todaysDate = Math.round(new Date().getTime()/1000);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'enforceVendorDoc');
        data.append('cloud_name', 'dq7ta9et2')
        data.append('public_id', userName+todaysDate)
        this.settingsService.uploadSignature(data).subscribe((imData) => {
          this.updateIncomeForm.patchValue({
            contractUrl: imData.secure_url
          })
          this.spinner.hide();
        });
      }
  }

  FindByProjectID(id){
    this.projectService.FindByProjectID({id:id}).subscribe((data) => {
      this.projectData = data;
    });
  }

  getVendorCustomerInfo(value){
    if(value.customerId !== ''){
      this.projectService.FindByCustomerId({id: value.customerId}).subscribe((data:any)  => {
        this.custDataSelected = data;
      });
    }else{
      this.settingsService.GetCommissionVendors().subscribe((data: any) => {
        let venMainData = data.filter((elm) => elm.id === value.vendorId);
        let venData = venMainData[0];
        this.settingsService.EntityContactsByVendorId({id: venData.id}).subscribe((contData) => {
          venData.entityContact = contData;
          this.settingsService.DocumentUrlByVendorId({id: venData.id}).subscribe((docData) => {
            venData.vendorEntityDocument = docData;
            this.vendDataSelected = venData;
          });
        });
      });
    }
    this.spinner.hide();
  }

  submitUpdateComm(){
    let formValue = this.updateIncomeForm.value;
    if(formValue.status === 'Confirmed'){
      this.formSubmitAttemptForUpdate = false;
      if(this.updateIncomeForm.invalid){
        return;
      }
    }

    let postData: any = {
      id: this.updateCommissionData.id,
      commisionId: this.updateCommissionData.commisionId,
      customerId: this.updateCommissionData.customerId,
      vendorId: this.updateCommissionData.vendorId,
      org_id: this.updateCommissionData.org_id,
      incTypId: this.updateCommissionData.incTypId,
      projectType: this.updateCommissionData.projectType,
      typeId: this.updateCommissionData.typeId,
      estAmount: this.updateCommissionData.estAmount,
      amount: formValue.contValue,
      estcomValue: this.updateCommissionData.estcomValue,
      comValue: formValue.comValue,
      description: this.updateCommissionData.description,
      status: formValue.status,
      contractUrl: formValue.contractUrl,
      projectId: this.updateCommissionData.projectId,
      closingDate: this.updateCommissionData.closingDate,
      createdDate: this.updateCommissionData.createdDate,
      modifiedDate: moment().format('L'),
      createdByEmpId: this.updateCommissionData.createdByEmpId,
      createdBy: this.updateCommissionData.createdBy,
      ldName: this.updateCommissionData.ldName,
      ldEmail: this.updateCommissionData.ldEmail,
      ldPhone: this.updateCommissionData.ldPhone,
      ldAddress: this.updateCommissionData.ldAddress,
      ldAddressSecond: this.updateCommissionData.ldAddressSecond,
      ldCity: this.updateCommissionData.ldCity,
      ldCountry: this.updateCommissionData.ldCountry,
    }

    this.settingsService.UpdateCommissionServiceById(postData).subscribe((data:any) => {
      if(data.status === '200'){
        if(postData.status === 'Confirmed'){
          this.runPaymentTerms();
        }else{
          this.toast.success('Status updated as '+postData.status)
          this.closeUpdateStatus();
        }
      }else{
        this.toast.success('Something went wrong')
        this.closeUpdateStatus();
      }
    });
  }

  runPaymentTerms(){
    let formValue = this.paymentMethodologyForm.getRawValue();
    let projectName;
    let project_id;
    if(this.updateCommissionData.projectId !== ''){
      projectName = this.updateCommissionData.projectName;
      project_id = this.updateCommissionData.projectId;
    }else{
      projectName = this.updateCommissionData.ldName+' '+this.projectType
      project_id = this.updateCommissionData.commisionId
    }

    let sendValue = [];
    let uniqueID = this.generateId(10);
      formValue.paymentPolicy.map((elm) => {
        sendValue.push({
          id: uniqueID,
          policy_name: formValue.paymentName,
          org_id: this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id'),
          term_name: elm.paymentTerms,
          term_percent: elm.perProjValue,
          creditTerms: formValue.creditTermsDays,
          createdDate: moment().format('L'),
          created_by_empId: this.currentUser.id,
          commisionId: this.updateCommissionData.commisionId,
          projectName: projectName,
          project_id: project_id,
          term_value: elm.projValue,
          triggerDate: moment(elm.triggerDate).format('L'),
        });
      });
      let sendData = {
        "commisionPolicy": sendValue
      }

      this.settingsService.AddCommissionPolicy(sendData).subscribe((data: any) => {
        if(data.status === '200'){
          this.toast.success('Status Updated Successfully')
        }else{
          this.toast.success('Something went wrong while applying payment term')
        }
        this.closeUpdateStatus();
        this.projectService.AddCommisiontoClaim().subscribe((data) => {});
      });
  }

  //to generate random profile ID
  generateId(length){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ){
      result += characters.charAt(Math.floor(Math.random() * charactersLength ));
    }
    return result;
  }

  closeUpdateStatus(){
    $('#update_Commission_modal').modal('hide');
    this.formSubmitAttemptForUpdate = true;
    this.updateIncomeForm.reset();
    this.GetCommissionServiceByDateOrgId(this.currentTabName);
    this.resetPayDropDown.value = null;
  }

  //get payment policy for org
  GetPaymentPolicyByOrgId(){
    this.settingsService.FetchCommissionPolicyByOrg().subscribe((data: any) => {
      let templateData = []
      data.map((elm) => {
        if(elm.project_id === null){
          templateData.push(elm)
        }
      });
      this.processData(templateData)
    });
  }

  processData(data){
    let serverData = _.values( _.groupBy(data, 'id'));
    let paymentData = [];
    let payment
    serverData.map((elm) => {
      let pPolicy = [];
      elm.map((elm2) => {
        payment = {
          createdDate: elm2.createdDate,
          paymentName : elm2.policy_name,
          creditTermsDays : elm2.creditTerms,
          is_default : elm2.is_default,
          id: elm2.id,
          org_id: elm2.org_id
        }
        pPolicy.push(elm2)
      });
      payment["paymentPolicy"] = pPolicy;
      paymentData.push(payment)
    });
    this.allIncomePaymentTermData = paymentData;
    this.runDropDownFun();
  }

  runDropDownFun(){
    let results = [];
    this.allIncomePaymentTermData.map((elm, i) => {
      results.push({
        id: elm.id,
        value: elm.paymentName
      });

      if(this.allIncomePaymentTermData.length === i+1){
        this.allPaymentTermDropData = results;
        this.checkForDefault();
      }
    });
  }

  checkForDefault(){
    this.allIncomePaymentTermData.map((elm) => {
      if(elm.is_default){
        this.defaultDropValue = elm.id
      }
    })
  }

  selectToCopyFrom(event){
    let formValue = this.updateIncomeForm.get('comValue').value
    let getNumber = formValue !== '' ? formValue : 0;
    (this.paymentMethodologyForm.get('paymentPolicy') as FormArray).clear();
    let id = event.value;
    this.allIncomePaymentTermData.map((elm) => {
      if(elm.id === id){
        this.paymentMethodologyForm.patchValue({
          creditTermsDays: elm.creditTermsDays
        });
        let formData = this.paymentMethodologyForm.get('paymentPolicy') as FormArray;
        elm.paymentPolicy.map((elm2) => {
          formData.push(this.formBuilder.group({
            paymentTerms: elm2.term_name,
            perProjValue: elm2.term_percent,
            projValue: ((parseInt(elm2.term_percent)/100) * getNumber).toFixed(2),
            triggerDate: new Date()
          }));
        });
      }
    });
  }

  returnItem(i, item){
    let number = i+1;
    this.paymentPolicy.at(i).patchValue({
      paymentTerms: this.ordinalSuffixOf(number)+' Payment'
    });
    let formValue = this.updateIncomeForm.get('comValue').value
    let getNumber = formValue !== '' ? formValue : 0;
    let getValue = item.value;
    if(getValue.perProjValue !== ''){
      this.paymentPolicy.at(i).patchValue({
        projValue: ((parseFloat(getValue.perProjValue)/100) * getNumber).toFixed(2)
      })
    }

    this.paymentPolicy.controls[i].get('paymentTerms').disable();
    this.paymentPolicy.controls[i].get('projValue').disable();
  }

  ordinalSuffixOf(i){
    if(this.paymentPolicy.value.length === 1){
      return 'Full'
    }else{
      var j = i % 10,k = i % 100;
      if(j == 1 && k != 11){return i + "st";}
      if(j == 2 && k != 12){return i + "nd";}
      if(j == 3 && k != 13){return i + "rd";}
      return i + "th";
    }
  }

  goToLinkNew(url: string){
    window.open(url, "_blank");
  }

  addItemRow(){
    let newFormValue = this.paymentPolicy.getRawValue();
    let getPerTotal = [];
    newFormValue.map((elm) => {
      if(elm.perProjValue !== ''){
        getPerTotal.push(parseInt(elm.perProjValue))
      }
    });
    const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
    if(sumProj > 99){
      this.showPercentageError = true;
    }else{
      this.showPercentageError = false;
      let newRow = this.createPaymentPolicy();
      this.paymentPolicy.push(newRow);
    }
	}

  deletePayment(i){
    this.paymentPolicy.removeAt(i)
  }

  createPaymentMethodologyForm(){
    this.paymentMethodologyForm = this.formBuilder.group({
      creditTermsDays: [''],
      paymentPolicy: this.formBuilder.array([]),
		});
  }

  createPaymentPolicy(){
    return this.formBuilder.group({
			paymentTerms: [''],
			perProjValue: ['', [Validators.required, Validators.max(100)]],
      projValue: [{disable: true}],
      triggerDate: ['', [Validators.required]]
		})
  }

  get paymentPolicy(): FormArray {
		return this.paymentMethodologyForm.get('paymentPolicy') as FormArray;
	}

  //get payment policy for org

  deleteCommissionService(data){
    delete data['column'];
    delete data['foreignKeyData'];
    delete data['index'];

    Swal.fire({
      title: 'Delete this - '+data.incomeName+' ?',
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
          commisionId: data.commisionId,
          customerId: data.customerId,
          vendorId: data.vendorId,
          org_id: data.org_id,
          incTypId: data.incTypId,
          typeId: data.typeId,
          amount: data.amount,
          description: data.description,
          status: data.status,
          projectId: data.projectId,
          closingDate: data.closingDate,
          createdDate: data.createdDate,
          modifiedDate: data.modifiedDate,
          createdByEmpId: data.createdByEmpId,
          createdBy: data.createdBy,
          isDeleted: true
        }
        this.settingsService.UpdateCommissionServiceById(postData).subscribe((data:any) => {
          if(data.status === '200'){
            this.toast.success('Deleted Successfully')
          }else{
            this.toast.success('Something went wrong')
          }
          this.GetCommissionServiceByDateOrgId(this.currentTabName);
        });
      }
    });
  }

  addNewCustomerModel(){
    $('#add_New_Cust_modal').modal('show');
    this.getCountryList();
  }

  changeContactType(event){
    this.GetAllIndustryType();
    this.showOrganizationForm = event.checked
  }

  isContactSame(e){
    let formValue = this.addContactForm.value;
    if(e.checked){
      this.addContactForm.patchValue({
        PFname: formValue.Fname,
        PLname: formValue.Lname,
        Pemail: formValue.email,
        Pphone: formValue.phone.number,
      });
    }
  }

  getCountryList(){
    this.countries.getCountryList().subscribe((data:any)  => {
      let results = [];
      data.map((elm) => {
        results.push({
          id: elm.id,
          value: elm.name
        });
      });
      this.countryDataDropDown = results;
      this.addContactForm.patchValue({
        Relationship: 'Owner',
        Country: 224,
      });
    });
  }

  submitAddContact(){
    this.formSubmitAttemptForContact = false;
    if(this.showOrganizationForm){
      if(this.addCompanyContactForm.invalid){
        return;
      }
    }else{
      if(this.addContactForm.invalid){
        return;
      }
    }
    let formValue = this.addContactForm.getRawValue();
    let formvalue2 = this.addCompanyContactForm.value;

    let postData:any = {
      email: formValue.email,
      phone: formValue.phone.dialCode+formValue.phone.number,
      phone_iso_name: formValue.phone.countryCode,
      adr: formValue.street1,
      street: formValue.street2,
      city: formValue.city,
      country: formValue.Country,
      createdby: this.currentUser.full_name,
      created_date: moment().format('L'),
      org_id: this.currentUser.org_id,
      entityContact: {
        name: formValue.PFname+' '+formValue.PLname,
        phone: formValue.Pphone.dialCode+formValue.Pphone.number,
        phone_iso_name: formValue.Pphone.countryCode,
        email: formValue.Pemail,
        first_name: formValue.PFname,
        last_name: formValue.PLname,
        relationship: formValue.Relationship,
        is_primary: true
      }
    }

    if(this.showOrganizationForm){
      postData.cst_name = formvalue2.companyName;
      postData.company_name = formvalue2.companyName;
      postData.is_company = this.showOrganizationForm;
      postData.industry_id = formvalue2.industry;
      postData.website = formvalue2.website;
      postData.first_name = "";
      postData.last_name = "";
    }else{
      postData.cst_name = formValue.Fname+' '+formValue.Lname;
      postData.company_name = null;
      postData.is_company = this.showOrganizationForm;
      postData.industry_id = "";
      postData.website = "";
      postData.first_name = formValue.Fname;
      postData.last_name = formValue.Lname;
    }

    this.projectService.AddCustomer(postData).subscribe((data: any) => {
      if(data.status == '200'){
        this.spinner.show();
        this.GetAllCustomerByOrgID();
        setTimeout(()=>{
          this.applyCustomer(data.code);
        }, 2000);
      }
    });

    this.closeNewCustomerModel();
  }

  applyCustomer(id){
    this.addCommissionForm.patchValue({
      customer: id
    });
    this.spinner.hide();
  }

  closeNewCustomerModel(){
    this.formSubmitAttemptForContact = true;
    this.showOrganizationForm = false;
    this.addContactForm.reset();
    this.addCompanyContactForm.reset();
    $('#add_New_Cust_modal').modal('hide');
  }

  GetProjectTypeByOrgID() {
    this.projectService.GetProjectTypeByOrgID().subscribe((data: any) => {
      let results = [];
      data.map((elm, i) => {
        results.push({
          id: elm.id,
          value: elm.type_name
        });

        if(data.length === i+1){
          this.projectTypeData = results;
        }
      });
    },error => {
      Swal.fire(
      'Error!',
      error,
      'error')
    });
  }

  GetAllCustomerByOrgID() {
    this.projectService.GetAllCustomerByOrgID().subscribe((data: any) => {
      let results = [];
      if(data){
        data.map((elm) => {
          if(elm.cst_name !== null){
            results.push({
              id: elm.id,
              value: elm.cst_name
            });
          }
        });
        this.customerDataDropDown = results;
      }
    },error => {
      Swal.fire(
      'Error!',
      error,
      'error'
      )
    });
  }

  EmpList(){
    this.empService.fetchGridDataEmployeeByOrgID().subscribe((data:any) => {
      let results = [];
      if(data){
        data.map((elm) => {
          results.push({
            id: elm.id,
            value: elm.full_name
          });
        });

        this.leadOwnerDataDropDown = results;
        this.addCommissionForm.patchValue({
          commissionOwner: this.currentUser.id
        });
      }
    },error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      )
    });
  }

  GetAllIndustryType(){
    this.empService.getAllIndustryType().subscribe((data: any) => {
      let results = [];
      if(data){
        data.map((elm) => {
          results.push({
            id: elm.id,
            value: elm.industry_type_name
          });
        });
        this.industryTypeDataDropDown = results;
      }
    },error => {
      Swal.fire(
        'Error!',
        error,
        'error'
      )
    });
  }

  GetAllProjectsByOrgId(){
    this.projectService.GetAllProjectsByOrgId().subscribe((data: any) => {
      this.projectListingData = data;
      this.spinner.hide();
    });
  }

  selectProject(data){
    this.selectedProjectData = data;
    this.addCommissionForm.patchValue({
      commissionProjectName: data.project_name,
      commissionProject: data.project_id
    });
    this.selectAProjectError = false;
    this.closeCustomerSearchModel();
  }

  openProjectModel(){
    $('#Search_project_modal').modal('show');
  }

  closeCustomerSearchModel(){
    $('#Search_project_modal').modal('hide');
  }

  GetCommissionVendors(){
    this.settingsService.GetCommissionVendors().subscribe((data: any) => {
      let results = []
      data.map((elm) => {
        results.push({
          id: elm.id,
          value: elm.name
        });
      });
      this.allVendordropDownData = results;
    });
  }

  GetLastCommissionServiceByOrgId(){
    this.projectService.GetAllPrefixByOrgID().subscribe((data:any) => {
      let result = []
      data.map((elm, ind) => {
        if(elm.type === 'com'){
          result.push(elm)
        }
        if(data.length === ind + 1){
          if(result.length !== 0){
            if(result[0].prefix_for === "Default"){
              this.settingsService.GetLastCommissionServiceByOrgId().subscribe((data: any) => {
                if(data.length === 0){
                  let prefix_name = result[0].prefix_ext;
                  let jobNo = '0'
                  this.commissionID = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                }else{
                  let currentComID = data[0].commisionId;
                  let storeValue = currentComID.split('/');
                  if(storeValue.length === 4){
                    if(storeValue[2] === moment().format('MM')){
                      let prefix_name = result[0].prefix_ext;
                      let lastAddprefixSplit = storeValue.pop();
                      let jobNo = parseInt(lastAddprefixSplit) + 1
                      this.commissionID = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                    }else{
                      let prefix_name = result[0].prefix_ext;
                      let jobNo = 0
                      this.commissionID = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                    }
                  }else{
                    let prefix_name = result[0].prefix_ext;
                    let jobNo = '0'
                    this.commissionID = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                  }
                }
              });
            }else if((result[0].prefix_for === "Sequence")){
              this.settingsService.GetLastCommissionServiceByOrgId().subscribe((data: any) => {
                if(data.length === 0){
                  let prefix_name = result[0].prefix_ext;
                  let jobNo = result[0].prefix_name.split('/').pop();
                  this.commissionID = prefix_name+'/'+jobNo;
                }else{
                  let currentComID = data[0].commisionId;
                  let prefix_name = result[0].prefix_ext;
                  let lastAddprefix = currentComID.split('/');
                  if(lastAddprefix.length === 2){
                    let lastAddprefixSplit = lastAddprefix.pop();
                    this.commissionID = prefix_name+'/'+(parseFloat(lastAddprefixSplit)+1);
                  }else{
                    let prefix_name = result[0].prefix_ext;
                    let jobNo = result[0].prefix_name.split('/').pop();
                    this.commissionID = prefix_name+'/'+jobNo;
                  }
                }
              });
            }else if((result[0].prefix_for === "Custom")){
              let randomNum = (Math.floor(1000 + Math.random() * 9000));
              this.commissionID = result[0].prefix_ext+'/'+randomNum;
            }
          }else{
            this.commissionID = '';
          }
        }
      });
    });

  }

  addCommissionFormInputs(){
    this.addCommissionForm = this.formBuilder.group({
      customer: [''],
      vendor: [''],
      commissionOwner: ['', Validators.required],
      commissionType: ['', Validators.required],
      closingDate: ['', Validators.required],
      commissionProject: [''],
      commissionProjectName: [{ value: '', disabled: true }],
      estContValue: ['', Validators.required],
      estimatedValue: ['', Validators.required],
      projectType: ['', Validators.required],
      Description: ['']
    });
  }

  addCommissionContactFormInputs(){
    this.addCommissionContactForm = this.formBuilder.group({
      ldName: ['', Validators.required],
      ldEmail: ['', Validators.required],
      ldPhone: ['', Validators.required],
      ldAddress: ['', Validators.required],
      ldAddressSecond: [''],
      ldCity: ['', Validators.required],
      ldCountry: ['', Validators.required]
    });
  }

  addContactFormInputs(){
    this.addContactForm = this.formBuilder.group({
      Fname: ['', Validators.required],
      Lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      Country: ['', Validators.required],
      street1: [''],
      street2: [''],
      city: ['', Validators.required],
      PFname: ['', Validators.required],
      PLname: ['', Validators.required],
      Pemail: ['', Validators.required],
      Pphone: ['', Validators.required],
      Relationship: ['']
    });

    this.addCompanyContactForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      industry: ['', Validators.required],
      website: ['']
    });
  }

  updateIncomeFormInputs(){
    this.updateIncomeForm = this.formBuilder.group({
      status: ['', Validators.required],
      contValue: ['', Validators.required],
      comValue: ['', Validators.required],
      contractUrl: ['', Validators.required]
    });
  }

  getCountryListCom(){
    this.countries.getCountryList().subscribe((data:any)  => {
      let results = [];
      data.map((elm) => {
        results.push({
          id: elm.id,
          value: elm.name
        });
      });
      this.countryDataDropDown = results;
      this.addCommissionContactForm.patchValue({
        ldCountry: 224,
      });
    });
  }

  //Add vendor fun

  addNewVendorModel(){
    this.spinner.show();
    this.GetVendorCategoryTypesByOrgId();
    this.getCountryListVen();
    this.GetVendorStatusByOrgId();
    this.GetVendorDocumentUploadTypeByOrgId();
    $('#add_New_Ven_modal').modal('show');
  }

  closeNewVendorModel(){
    $('#add_New_Ven_modal').modal('hide');
    this.resetDropDownVen.value = null;
    this.formSubmitAttemptForVendor = true;
    this.formSubmitAttemptForVendorContact = true;
    this.vendorForm.reset();
    this.venPriConForm.reset();
    (this.vendorForm.get('venDocument') as FormArray).clear();
  }

  isContactSameVen(e){
    let vendorFormValue = this.vendorForm.value;
    if(e.checked){
      this.venPriConForm.patchValue({
        Pemail: vendorFormValue.email,
        Pphone: vendorFormValue.phone.number
      })
    }else{
      this.venPriConForm.patchValue({
        Pemail: '',
        Pphone: ''
      })
    }
  }

  addNewDocumnetName() {
    let newMem = this.venDocumentFormInput();
    this.venDocument.push(newMem);
    this.formSubmitAttemptForVendor = true;
  }

  getDocTypeChange(event, i){
    let dropValueId = event.value;
    this.docVendorData.map((elm) => {
      if(elm.id === dropValueId){
        this.venDocument.at(i).patchValue({
          isExpiryReq: elm.isExpiryReq
        });
      }
    })
  }

  onFileSelected(event, i) {
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file:File = imageData;
    if(file){
      let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime()/1000);
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'enforceVendorDoc');
      data.append('cloud_name', 'dq7ta9et2')
      data.append('public_id', userName+todaysDate)
      this.settingsService.uploadSignature(data).subscribe((imData) => {
        this.venDocument.at(i).patchValue({
          documentUrl: imData.secure_url
        });
        this.spinner.hide();
      });
    }
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  showExpireDate(val){
    let formRowValue = val.value;
    if(formRowValue.isExpiryReq){
      return true
    }else{
      return false
    }
  }

  checkToShowDelete(val){
    let formRowValue = val.value
    let formValue = this.vendorForm.controls['venDocument'].value;
    if(formRowValue.isRequired){
      return true
    }else{
      if(formValue.length === 1){
        return true
      }else{
        return false
      }
    }
  }

  deleteDocumnetRow(i: number){
    this.venDocument.removeAt(i);
  }

  submitAddVendor(){
    this.formSubmitAttemptForVendor = false;
    this.formSubmitAttemptForVendorContact = false;
    if(this.vendorForm.invalid){
      return;
    }

    let formValue = this.vendorForm.value;
    let formValue2 = this.venPriConForm.value;
    let orgId = this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id');

    let postData: any = {
      org_id: orgId,
      name: formValue.name,
      type: formValue.type,
      categorytypes: formValue.category.toString(),
      vendorEmail: formValue.email,
      vendorPhone: formValue.phone.dialCode+formValue.phone.number,
      vendorStatus: formValue.status,
      entityContact: [{
          name: formValue2.PFname+' '+formValue2.PLname,
          first_name: formValue2.PFname,
          last_name: formValue2.PLname,
          department: formValue2.designation,
          designation: formValue2.designation,
          email: formValue2.Pemail,
          phone: formValue2.Pphone.dialCode+formValue2.Pphone.number,
          adr_1: formValue2.address1,
          adr_2: formValue2.address2,
          city: formValue2.city,
          country: formValue2.country,
          is_primary: true,
          createdby: this.currentUser.full_name,
          created_date: moment().format('L')
      }],
      createdDate: moment().format('L'),
      createdByEmpId: this.currentUser.id,
      createdBy: this.currentUser.full_name
    }

    let docArray = []
    formValue.venDocument.map((elm, i) => {
      let docData = {
        org_id: orgId,
        documentURL: elm.documentUrl,
        documentExpiryDate: elm.documentExpireDate !== '' ?  moment(elm.documentExpireDate).format('L') : '',
        description: elm.documentType,
        createdDate: moment().format('L'),
        createdBy: this.currentUser.full_name
      }
      docArray.push(docData);

      if(formValue.venDocument.length === i+1){
        postData.vendorEntityDocument = docArray;
        this.addVendorFinal(postData)
      }
    });
  }

  addVendorFinal(postData){
    this.settingsService.AddCommissionVendors(postData).subscribe((data:any) => {
      if(data.status === '200'){
        this.spinner.show();
        this.GetCommissionVendors();
        setTimeout(()=>{
          this.applyVendor(data.desc);
        }, 3000);
      }else{
        this.toast.error('Something went wrong')
      }
      this.closeNewVendorModel();
    });
  }

  applyVendor(id){
    this.addCommissionForm.patchValue({
      vendor: id
    });
    this.toast.success('Vendor Added successfully')
    this.spinner.hide();
  }

  patchRequiredDocument(){
    let formData = this.vendorForm.get('venDocument') as FormArray;
    this.docVendorData.map((elm, i) => {
      if(elm.isRequired){
        formData.push(this.formBuilder.group({
          isExpiryReq: elm.isExpiryReq,
          isRequired: elm.isRequired,
          documentType: elm.id,
          documentUrl: '',
          documentExpireDate: '',
        }));
      }

      if(this.docVendorData.length === i+1){
        let docformData = formData.value;
        if(docformData.length === 0){
          this.addNewDocumnetName();
        }
      }
    });
  }

  GetVendorCategoryTypesByOrgId(){
    this.settingsService.GetVendorCategoryTypesByOrgId().subscribe((data:any) => {
      let result = [];
      data.map((elm , i) => {
        result.push({
          id: elm.id,
          value: elm.name
        });

        if(data.length === i+1){
          this.vendorCategoryDropDown = result;
        }
      });
    });
  }

  getCountryListVen(){
    this.countries.getCountryList().subscribe((data:any)  => {
      let results = [];
      data.map((elm) => {
        results.push({
          id: elm.id,
          value: elm.name
        });
      });
      this.countryDataDropDown = results;
      this.venPriConForm.patchValue({
        country: 224,
      });
    });
  }

  GetVendorStatusByOrgId(){
    this.settingsService.GetVendorStatusByOrgId().subscribe((data:any) => {
      let result = [];
      data.map((elm , i) => {
        result.push({
          id: elm.id,
          value: elm.name
        });

        if(data.length === i+1){
          this.vendorStatusDropDown = result;
        }
      });
    });
    this.spinner.hide();
  }

  GetVendorDocumentUploadTypeByOrgId(){
    this.settingsService.GetVendorDocumentUploadTypeByOrgId().subscribe((data:any) => {
      this.docVendorData = data;
      let result = [];
      data.map((elm , i) => {
        result.push({
          id: elm.id,
          value: elm.name
        });

        if(data.length === i+1){
          this.vendorDocDropDown = result;
          this.patchRequiredDocument();
        }
      });
    });
  }

  vendorFormInputs(){
    this.vendorForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      category: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required]],
      venDocument: this.formBuilder.array([],[Validators.required])
    });
  }

  get venDocument(): FormArray {
    return this.vendorForm.get('venDocument') as FormArray;
  }

  venDocumentFormInput(){
    return this.formBuilder.group({
      isExpiryReq: [''],
      documentType: ['', [Validators.required]],
      documentUrl: ['', [Validators.required]],
      documentExpireDate: ['']
    });
  }

  venPriConFormInputs(){
    this.venPriConForm = this.formBuilder.group({
      PFname: ['', Validators.required],
      PLname: ['', Validators.required],
      Pemail: ['', [Validators.required]],
      Pphone: ['', Validators.required],
      designation: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }
  //Add vendor fun end

  serviceSearchKeyUp(): void {
    document.getElementById(this.CommissionServicedataTableGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.CommissionServicedataTableGrid.search((event.target as HTMLInputElement).value)
    });
  }

  customerSearchKeyUp(): void {
    document.getElementById(this.searchCostomerdataTableGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.searchCostomerdataTableGrid.search((event.target as HTMLInputElement).value)
    });
  }

}
