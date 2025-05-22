import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import moment = require('moment');
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as _ from "lodash";
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
//service
import { AdministrativeService } from './../../services/administrative.service';
import { UserService } from './../../services/user.service';
import { EmployeeService } from './../../services/employee.service';

declare var $: any;

@Component({
  selector: 'app-create-case',
  templateUrl: './create-case.component.html',
  styleUrls: ['./create-case.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateCaseComponent implements OnInit {

  userInfo:any = JSON.parse(localStorage.getItem('user_info'));
  //userRights
  commonModuleName;
  addEditCaseHistory = false;
  resolveACaseAccess = false;
  viewCaseStatistics = false;
  noAccessToCasePage = false;
  dateRangeForm: FormGroup;
  //dates
  today: Date = new Date(new Date().toDateString());
  maxRangeDateTwo: Date = this.today;
  monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
  monthEnd: Date = this.today;
  lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
  lastEnd: Date = new Date(this.today.getFullYear(),this.today.getMonth(),0);
  yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
  yearEnd: Date = this.today;
  getStartDate = moment().format('L');;
  getEndDate = moment().format('L');
  weekStart = new Date(new Date(new Date().setDate(new Date().getDate() - 7)).toDateString());
  weekEnd = new Date(new Date().toDateString());
  caseHistoryData;
  @ViewChild('caseHistoryGrid' , {static: false}) public caseHistoryGrid: GridComponent;
  @ViewChild('searchDropdown',{static:false}) public dropDownListObject: DropDownListComponent;
  public commonOptions: Select2Options;
  caseHistoryGridToolItems: ToolbarItems[];
  addCaseHistoryProcessForm: FormGroup;
  editCaseHistoryProcessForm: FormGroup;
  addEditCaseActivityProcessForm: FormGroup;
  caseTabListing = true;
  caseHistAddForm = false;
  caseHistEditForm = false;
  commonFields: Object = { text: "value", value: "id" };
  caseTypeData;
  priorityType = [
    {
      id:'Low',
      value:'Low'
    },
    {
      id:'Medium',
      value:'Medium'
    },
    {
      id:'High',
      value:'High'
    },
  ]

  caseActivityStatus = [
    {
      id:'Open',
      value:'Open'
    },
    {
      id:'In progress',
      value:'In progress'
    },
    {
      id:'Completed',
      value:'Completed'
    },
  ]

  commonFilterValue = [
    {
      id:'All',
      text:'All'
    },{
      id:'In progress',
      text:'In progress'
    },{
      id:'Completed',
      text:'Completed'
    }
  ];
  commonPlaceholder = 'Select a Filter';
  commonSelectedValue = 'All';

  empListByOrgIdData;
  selectEditCaseHistory
  formSubmitAttempt: boolean;

  //phone
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedArabEmirates];

  //activity
  newCaseActivity;
  caseHistoryActData;
  updatecaseHistoryActData;

  minOfficeActInputTime = '05:30 AM';
  maxAddLogEndTime ='11:30 PM';
  minForEndTime;

  caseByOrgData;
  isMonthActive: boolean;
  isWeekActive: boolean;
  isTodayActive = true;

  constructor(
    public administrativeService: AdministrativeService,
    public formBuilder: FormBuilder,
    private userService:UserService,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {
    this.commonOptions={
      placeholder:"select",
      width: "100%",
    }
   }

  ngOnInit(){
    this.checkUserRights();
    this.caseHistoryGridToolItems = ['Search'];
    this.GetCaseHistoryByCreatedByEmpID();
    this.addCaseHistoryFormInputs();
    this.addCaseActivityFormInputs();
    this.dateRangeFormInput();

    this.dateRangeForm.patchValue({
      dateRange:[this.getStartDate, this.getEndDate],
    })
    this.GetCaseByOrgIdDate();
    //range date
    this.dateRangeForm.get('dateRange').valueChanges.subscribe(() => {
      let dateVaue = this.dateRangeForm.get('dateRange').value;
      this.getStartDate = moment(dateVaue[0]).format('L');
      this.getEndDate = moment(dateVaue[1]).format('L');
      this.GetCaseByOrgIdDate();
      console.log('run')
      this.isMonthActive = false;
      this.isWeekActive = false;
      this.isTodayActive = false;
    });
  }

  changeCaseFilter(event){
    this.spinner.show();
    let postData = { id: this.userInfo.id };
    this.administrativeService.GetCaseHistoryByCreatedByEmpID(postData).subscribe((data: any) => {
      if(event.itemData.text === 'All'){
        this.caseHistoryData = data;
      }else if(event.itemData.text === 'In progress'){
        let inProgress = [];
        data.map((elm) => {
          if(elm.case_status === "In progress"){
            inProgress.push(elm);
          }
        });
        this.caseHistoryData = inProgress;
      }else if(event.itemData.text === 'Completed'){
        let completed = [];
        data.map((elm) => {
          if(elm.case_status === "Completed"){
            completed.push(elm);
          }
        });
        this.caseHistoryData = completed;
      }
      this.spinner.hide();
    });
  }

  GetCaseHistoryByCreatedByEmpID(){
    let postData = {
      id: this.userInfo.id
    }
    this.administrativeService.GetCaseHistoryByCreatedByEmpID(postData).subscribe((data: any) => {
      this.caseHistoryData = data;
    });
  }

  getTodaysData(){
    this.spinner.show();
    this.isMonthActive = false;
    this.isWeekActive = false;
    this.isTodayActive = true;
    this.getStartDate = moment().format('L');
    this.getEndDate = moment().format('L');
    this.dateRangeForm.patchValue({
      dateRange:[new Date(), new Date()],
    });
    this.GetCaseByOrgIdDate();
  }

  getWeeksData(){
    this.spinner.show();
    this.isMonthActive = false;
    this.isWeekActive = true;
    this.isTodayActive = false;
    let displayValueStart = this.weekStart;
    let displayValueEnd = this.weekEnd;
    this.getStartDate = moment(this.weekStart).format('L');
    this.getEndDate = moment(this.weekEnd).format('L');
    this.dateRangeForm.patchValue({
      dateRange:[displayValueStart, displayValueEnd],
    });
    this.GetCaseByOrgIdDate();
  }

  getMonthsData(){
    this.spinner.show();
    this.isMonthActive = false;
    this.isWeekActive = true;
    this.isTodayActive = false;
    let displayValueStart = this.monthStart;
    let displayValueEnd = this.monthEnd;
    this.getStartDate = moment(this.monthStart).format('L');
    this.getEndDate = moment(this.monthEnd).format('L');
    this.dateRangeForm.patchValue({
      dateRange:[displayValueStart, displayValueEnd],
    });
    this.GetCaseByOrgIdDate();
  }

  caseHistoryTypeGridSearchKeyUp(): void {
    document.getElementById(this.caseHistoryGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.caseHistoryGrid.search((event.target as HTMLInputElement).value)
    });
  }

  //get case statistics
  GetCaseByOrgIdDate(){
    let postData = {
      orgID: this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
      fromDate: this.getStartDate,
      toDate: this.getEndDate
    }
    this.employeeService.GetCaseByOrgIdDate(postData).subscribe((data:any) => {
      console.log(data);
      if(data.length !== 0){
        this.caseByOrgData = data
      }else{
        this.caseByOrgData = [
          {
            "case_name": "No Data for the selected Date Range",
            "total_count": 0,
            "caseTypeId": "",
            "MediumCount": 0,
            "HighCount": 0,
            "LowCount": 0
          }
        ]
      }

    });
    this.spinner.hide();
  }

  //Add case functions
  addComplain(){
    this.GetAllCaseTypeByOrgId();
    this.getAllempByOrgID();
    this.caseHistAddForm = true;
    this.caseTabListing = false;
    this.formSubmitAttempt = false;
    //formControl
    this.addCaseHistoryProcessForm.patchValue({
      caseNo: 'First please select the Case type'
    });
    this.addCaseHistoryProcessForm.get('caseNo').disable();
  }

  changeCaseType(e){
    //console.log('i am running')
    if(e.itemData !== null){
      this.spinner.show();
      let postData = { id: e.itemData.id };
      this.administrativeService.GetCaseTypeByID(postData).subscribe((data: any) => {
        //console.log(data)
        this.addCaseHistoryProcessForm.patchValue({
          caseID: data[0].id,
          caseName: data[0].case_type,
          priority: 'Low'
        });
        this.callToProcessCaseNumber(data[0].case_type);
      });
      this.spinner.hide();
    }
  }

  callToProcessCaseNumber(caseName){
    let postData = {
      orgID : this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id')
    }
    this.administrativeService.GetCaseTicketNumber(postData).subscribe((data: any) => {
      //console.log(data)
      let finalnumber;
      if(data.length === 0){
        finalnumber = 1;
      }else{
        let lastCaseNo = data[0].case_no;
        let processData = lastCaseNo.split('/');
        finalnumber = parseInt(processData[3])+1
      }
      let caseNameTrip = caseName.toUpperCase().replace(/\s+/g, '');
      let todaysDate = new Date();
      let currentMonth = todaysDate.getMonth() + 1;
      let monthValue = currentMonth <= 9 ? '0'+currentMonth : currentMonth;
      this.addCaseHistoryProcessForm.patchValue({
        caseNo: caseNameTrip.charAt(0)+caseNameTrip.charAt(1)+'/'+todaysDate.getFullYear()+'/'+monthValue+'/'+finalnumber
      });
    });

  }

  changeReportedTo(e){
    if(e.checked){
      this.addCaseHistoryProcessForm.patchValue({
        reportedTo: this.userInfo.full_name
      });
    }else{
      this.addCaseHistoryProcessForm.patchValue({
        reportedTo:''
      });
    }
  }

  changeAssignedTo(e){
    if(e.checked){
      this.addCaseHistoryProcessForm.patchValue({
        assignedTo: this.userInfo.id
      });
    }else{
      this.dropDownListObject.value = null;
    }
  }

  submitCaseHistAdd(value){
    this.formSubmitAttempt = true;
    if(this.addCaseHistoryProcessForm.valid){
      this.spinner.show();
      let caseForm = this.addCaseHistoryProcessForm.value
      let postData = {
        case_no: this.addCaseHistoryProcessForm.controls['caseNo'].value,
        case_type_id: caseForm.caseID,
        case_name: caseForm.caseName,
        case_description: caseForm.caseDescription,
        case_location: caseForm.caseLocation,
        org_id: this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
        emp_id: this.userInfo.id,
        onbehalf: this.userInfo.id,
        priority: caseForm.priority,
        reported_by: caseForm.reportedBy,
        reported_to: caseForm.reportedTo,
        reported_date: moment().format('L'),
        assigned_to: caseForm.assignedTo,
        assigned_by: this.userInfo.full_name,
        followup_date: moment(caseForm.followUpDate).format('L'),
        case_status: "In progress",
        created_date: moment().format('L'),
        created_by: this.userInfo.id,
        reported_by_email: caseForm.reportedByEmail,
        reported_by_mobile: caseForm.reportedByPhone.number,
      }
      //console.log(postData)
      this.employeeService.AddCaseHistory(postData).subscribe((data: any) => {
        if(data.status == 200){
          this.toast.success('Case history added successfully');
          if(value === 'single'){
            this.closeaddEditComplainModel();
          }else{
            this.addCaseHistoryProcessForm.reset();
            this.addCaseHistoryProcessForm.get('caseDescription').enable();
            this.addComplain();
          }
        }else{
          this.toast.error('Something went wrong. please try again');
          this.closeaddEditComplainModel();
        }
        this.spinner.hide();
      });
    }
  }

  //edit case functions
  openEditHistForm(data){
    this.spinner.show();
    this.editCaseHistoryFormInputs();
    this.GetAllCaseTypeByOrgId();
    this.getAllempByOrgID();
    this.caseTabListing = false;
    this.caseHistEditForm = true;
    this.caseHistAddForm = false;
    setTimeout(()=> {
      this.getSelectedCaseHistory(data.id);
    }, 4000);
  }

  getSelectedCaseHistory(id){
    this.editCaseHistoryProcessForm.get('caseNo').disable();
    let postData = {
      id: id
    }
    this.employeeService.GetCaseHistoryByID(postData).subscribe((data: any) => {
      //console.log(data)
      this.selectEditCaseHistory = data[0];
      this.editCaseHistoryProcessForm.patchValue({
        caseNo: this.selectEditCaseHistory.case_no,
        caseID: this.selectEditCaseHistory.case_type_id,
        caseName: this.selectEditCaseHistory.case_name,
        caseDescription: this.selectEditCaseHistory.case_description,
        caseLocation: this.selectEditCaseHistory.case_location,
        followUpDate: moment(this.selectEditCaseHistory.followup_date).format('ll'),
        reportedBy: this.selectEditCaseHistory.reported_by,
        reportedByEmail: this.selectEditCaseHistory.reported_by_email,
        reportedByPhone: this.selectEditCaseHistory.reported_by_mobile,
        reportedTo: this.selectEditCaseHistory.reported_to,
        assignedTo: this.selectEditCaseHistory.assigned_to,
        priority: this.selectEditCaseHistory.priority
      });
      this.spinner.hide();
    });
  }

  submitCaseHistEdit(){
    this.formSubmitAttempt = true;
    if(this.editCaseHistoryProcessForm.valid){
      this.spinner.show();
      let caseForm = this.editCaseHistoryProcessForm.value;
      let postData = {
        id: this.selectEditCaseHistory.id,
        case_no: this.selectEditCaseHistory.case_no,
        case_type_id: caseForm.caseID,
        case_name: caseForm.caseName,
        case_description: caseForm.caseDescription,
        case_location: caseForm.caseLocation,
        org_id: this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
        emp_id: this.userInfo.id,
        onbehalf: this.userInfo.id,
        priority: caseForm.priority,
        reported_by: caseForm.reportedBy,
        reported_by_email: caseForm.reportedByEmail,
        reported_by_mobile: caseForm.reportedByPhone.number,
        reported_to: caseForm.reportedTo,
        reported_date: moment().format('L'),
        assigned_to: caseForm.assignedTo,
        assigned_by: this.userInfo.full_name,
        followup_date: moment(caseForm.followUpDate).format('L'),
        case_status: this.selectEditCaseHistory.case_status,
        created_date: this.selectEditCaseHistory.created_date,
        created_by: this.selectEditCaseHistory.created_by,
        modified_date: moment().format('L'),
        modified_by: this.userInfo.id,
      }
      console.log(postData)
      this.employeeService.UpdateCaseHistoryByID(postData).subscribe((data: any) => {
        //console.log(data)
        if(data.status == 200){
          this.toast.success('Case history Updated successfully');
          this.closeaddEditComplainModel();
        }else{
          this.toast.error('Something went wrong. please try again');
          this.closeaddEditComplainModel();
        }
        this.spinner.hide();
      });
    }
  }

  editChangeCaseType(e){
    if(this.selectEditCaseHistory.case_type_id !== e.itemData.id){
      console.log('run')
      this.spinner.show();
      let postData = {
        id: e.itemData.id
      }
      this.administrativeService.GetCaseTypeByID(postData).subscribe((data: any) => {
        //console.log(data)
        this.editCaseHistoryProcessForm.patchValue({
          caseID: data[0].id,
          caseName: data[0].case_type,
        });
      })
      this.spinner.hide();
    }
  }

  //common close function
  closeaddEditComplainModel(){
    if(this.caseHistAddForm){
      console.log('Add form')
      this.addCaseHistoryProcessForm.reset();
      this.caseHistAddForm = false;
    }else{
      console.log('Edit form')
      this.editCaseHistoryProcessForm.reset();
      this.caseHistEditForm = false;
    }
    this.caseTabListing = true;
    this.formSubmitAttempt = false;
    this.GetCaseHistoryByCreatedByEmpID();
  }

  //address case function

  addressCaseModel(data){
    console.log(data)
    this.caseHistoryActData = data
    this.formSubmitAttempt = false;
    this.spinner.show();
    let postData = {
      id: data.id
    }
    this.employeeService.GetCaseActivityByCaseID(postData).subscribe((data2:any) => {
      console.log(data2)
      if(data2.length === 0){
        this.newCaseActivity = true;
      }else{
        this.updatecaseHistoryActData = data2[0];
        console.log(this.updatecaseHistoryActData)
        this.newCaseActivity = false;
      }
      this.patchActivityValue(data);
    });
  }

  startOfficeTimeChanged(){
    this.addEditCaseActivityProcessForm.get('endTime').enable();
    this.addEditCaseActivityProcessForm.get('startTime').valueChanges.subscribe(() => {
      this.minForEndTime = this.addEditCaseActivityProcessForm.get('startTime').value;
    });

    this.addEditCaseActivityProcessForm.get('endTime').valueChanges.subscribe(() => {
      let endTime = this.addEditCaseActivityProcessForm.get('endTime').value;
      console.log(endTime)
    });
  }

  patchActivityValue(data){
    this.addEditCaseActivityProcessForm.get('endTime').disable();
    this.addEditCaseActivityProcessForm.patchValue({
      caseID: data.case_no,
      caseName: data.case_name,
      caseDescription: data.case_description,
      caseLocation: data.case_location,
      reportedBy: data.reported_by,
      reportedByEmail: data.reported_by_email,
      reportedByPhone: data.reported_by_mobile,
      reportedTo: data.reported_to,
      assignedTo: data.assignedEmpName
    });

    if(!this.newCaseActivity){
      this.addEditCaseActivityProcessForm.patchValue({
        caseActStatus: this.updatecaseHistoryActData.activity_status
      });
    }

    this.addEditCaseActivityProcessForm.get('caseID').disable();
    this.addEditCaseActivityProcessForm.get('caseName').disable();
    this.addEditCaseActivityProcessForm.get('caseDescription').disable();
    this.addEditCaseActivityProcessForm.get('caseLocation').disable();
    this.addEditCaseActivityProcessForm.get('reportedBy').disable();
    this.addEditCaseActivityProcessForm.get('reportedByEmail').disable();
    this.addEditCaseActivityProcessForm.get('reportedByPhone').disable();
    this.addEditCaseActivityProcessForm.get('reportedTo').disable();
    this.addEditCaseActivityProcessForm.get('assignedTo').disable();

    $("#case_Activity_modal").modal('show');
    this.spinner.hide();
  }

  submitCaseActivity(){
    this.formSubmitAttempt = true;
    let formData = this.addEditCaseActivityProcessForm.value;
    console.log(formData);
    if(this.newCaseActivity){
      if(this.addEditCaseActivityProcessForm.valid){
        this.spinner.show();
        let postData = {
          "case_type_id": this.caseHistoryActData.case_type_id,
          "case_history_id": this.caseHistoryActData.id,
          "org_id": this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
          "emp_id": this.userInfo.id,
          "activity_description":formData.activityDescription,
          "activity_status": formData.caseActStatus,
          "created_date": moment().format('L'),
          "created_by": this.userInfo.id,
          "start_time": formData.startTime,
          "end_time": formData.endTime,
        }
        console.log(postData)
        this.employeeService.AddCaseActivity(postData).subscribe((data: any) => {
          if(data.status == 200){
            this.toast.success('Case activity added successfully.');
          }else{
            this.toast.error('Something went wrong');
          }
          this.closeCaseActivityModel();
        });
      }
    }else{
      if(this.addEditCaseActivityProcessForm.valid){
        this.spinner.show();
        let postData = {
          "id": this.updatecaseHistoryActData.id,
          "case_type_id": this.caseHistoryActData.case_type_id,
          "case_history_id": this.caseHistoryActData.id,
          "org_id": this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
          "emp_id": this.userInfo.id,
          "activity_description":formData.activityDescription,
          "activity_status": formData.caseActStatus,
          "created_date": this.updatecaseHistoryActData.created_date,
          "created_by": this.updatecaseHistoryActData.created_by,
          "start_time": formData.startTime,
          "end_time": formData.endTime,
          "modified_date": moment().format('L'),
          "modified_by": this.userInfo.id
        }
        console.log(postData)
        this.employeeService.UpdateCaseActivityByID(postData).subscribe((data: any) => {
          console.log(data)
          if(data.status == 200){
            this.toast.success('Case activity added successfully.');
          }else{
            this.toast.error('Something went wrong');
          }
          this.closeCaseActivityModel();
        });
      }
    }
  }

  closeCaseActivityModel(){
    $("#case_Activity_modal").modal('hide');
    this.addEditCaseActivityProcessForm.reset();
    this.spinner.hide();
  }

  //address case function

  //call function
  GetAllCaseTypeByOrgId(){
    this.administrativeService.GetAllCaseTypeByOrgId().subscribe((data: any) => {
      let result = [];
      data.map((elm) => {
        result.push({
          id: elm.id,
          value: elm.case_type
        });
      });
      this.caseTypeData = result;
    });
  }

  getAllempByOrgID(){
    this.employeeService.getEmployeeByOrgId().subscribe((data: any) => {
      let result = [];
      data.map((elm) => {
        result.push({
          id: elm.id,
          value: elm.full_name
        });
      });
      this.empListByOrgIdData = result;
    });
  }

  //formControl
  addCaseHistoryFormInputs(){
    this.addCaseHistoryProcessForm = this.formBuilder.group({
      caseNo: [''],
      caseID: ['', Validators.required],
      caseName:['', Validators.required],
      caseDescription:['', Validators.required],
      caseLocation:['', Validators.required],
      followUpDate:['', Validators.required],
      reportedBy:['', Validators.required],
      reportedByEmail: ['', Validators.required],
      reportedByPhone: ['', Validators.required],
      reportedTo:['', Validators.required],
      assignedTo:['', Validators.required],
      priority:['', Validators.required]
    })
  }

  editCaseHistoryFormInputs(){
    this.editCaseHistoryProcessForm = this.formBuilder.group({
      caseNo: [''],
      caseID: ['', Validators.required],
      caseName:['', Validators.required],
      caseDescription:['', Validators.required],
      caseLocation:['', Validators.required],
      followUpDate:['', Validators.required],
      reportedBy:['', Validators.required],
      reportedByEmail: ['', Validators.required],
      reportedByPhone: ['', Validators.required],
      reportedTo:['', Validators.required],
      assignedTo:['', Validators.required],
      priority:['', Validators.required]
    })
  }

  addCaseActivityFormInputs(){
    this.addEditCaseActivityProcessForm = this.formBuilder.group({
      caseID: [],
      caseName:[],
      caseDescription:[],
      caseLocation:[],
      reportedBy:[],
      reportedByEmail: [],
      reportedByPhone: [],
      reportedTo:[],
      assignedTo:[],
      caseActStatus:['', Validators.required],
      activityDescription:['', Validators.required],
      startTime:['', Validators.required],
      endTime:['', Validators.required]
    })
  }

  //form
  dateRangeFormInput(){
    this.dateRangeForm = new FormGroup({
      dateRange: new FormControl(''),
    });
  }

  //check user rights
  checkUserRights(){
    let postData = { id : this.userInfo.role_id }
    this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
      data.map((item) => {
        item.module_name = item.module_name.replace(/\s+/g, '');
        return item;
      });
      this.commonModuleName = _.groupBy(data, 'module_name');
      if(this.commonModuleName.Case){
        let caseRights = this.commonModuleName.Case;
        caseRights.map((elm) => {
          if(elm.section_name === 'Resolve a Case' && elm.is_allow === true){
            this.resolveACaseAccess = elm.is_allow;
          }

          if(elm.section_name === 'Add / Edit Case' && elm.is_allow === true){
            this.addEditCaseHistory = elm.is_allow;
          }

          if(elm.section_name === 'View Case Statistics' && elm.is_allow === true){
            this.viewCaseStatistics = elm.is_allow;
          }
        });
      }else{
        this.noAccessToCasePage = true;
      }
    });
  }

}
