import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import moment = require('moment');
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from "lodash";
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { Router } from '@angular/router';
//service
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { FinanceService } from '../../services/finance.service';
import { EmployeeService } from '../../services/employee.service';
import { ProjectService } from '../../services/project.service';


declare var $: any;

@Component({
  selector: 'app-project-invoice-new',
  templateUrl: './project-invoice-new.component.html',
  styleUrls: ['./project-invoice-new.component.scss']
})

export class ProjectInvoiceNewComponent implements OnInit {

  //userRightsVariable
  UserRights;
  accessRevenueModuleGranted = false;
  accessViewRevenue = false;
  checkForOverAllStatusData = false;


  //tab value
  headerText= [
    { text: 'Employees' },
    { text: 'Projects' },
    { text: 'Projects Invoicing' },
    { text: 'Productivity' },
    { text: 'Employee Summary' },
    { text: 'Project Status' }
  ]

  public employeeTableData;
  public projectTableData;
  public projectMilestonePerTableData;
  public projectMilestoneWrjPerTableData;

  public employeeProductivityDetail;
  public employeeProductivityWrkFrcDetail;
  public projectMilestoneInvoiceTableData
  public projectStatusOverallDetail;

  @ViewChild('employeeGrid',{static:false}) public employeeGrid: GridComponent;
  @ViewChild('projectGrid',{static:false}) public projectGrid: GridComponent;
  @ViewChild('projectInvoicingGrid',{static:false}) public projectInvoicingGrid: GridComponent;
  @ViewChild('employeeGridModel',{static:false}) public employeeGridModel: GridComponent;
  @ViewChild('projectGridModel',{static:false}) public projectGridModel: GridComponent;
  @ViewChild('openProjectGridModel',{static:false}) public openProjectGridModel: GridComponent;
  @ViewChild('empProductivityTable',{static:false}) public empProductivityTable: GridComponent;
  @ViewChild('projectStatusOverallTable',{static:false}) public projectStatusOverallTable: GridComponent;

  @ViewChild('employeeProdGridListingModel',{static:false}) public employeeProdGridListingModel: GridComponent;
  @ViewChild('employeeSummaryGrid',{static:false}) public employeeSummaryGrid: GridComponent;

  @ViewChild('projectEmpAllTaskTableList',{static:false}) public projectEmpAllTaskTableList: GridComponent;
  @ViewChild('normalEmpAllTaskTableList',{static:false}) public normalEmpAllTaskTableList: GridComponent;
  @ViewChild('activityEmpAllTaskTableList',{static:false}) public activityEmpAllTaskTableList: GridComponent;
  @ViewChild('projectEmpCompTaskTableList',{static:false}) public projectEmpCompTaskTableList: GridComponent;

  @ViewChild('basedOnEmployeeGrid',{static:false}) public basedOnEmployeeGrid: GridComponent;
  @ViewChild('basedOnProjectGrid',{static:false}) public basedOnProjectGrid: GridComponent;


  public invoiceToolbar : ToolbarItems[];
  public invoiceModelToolbar : ToolbarItems[];
  public totalProjectsModelToolbar : ToolbarItems[];
  public editable=false;
  //public form: FormGroup;
  showTimeSpinner=false;
  public date=moment().format('dddd, D MMM YYYY');
  public today: Date = new Date(new Date().toDateString());
  public weekStart=new Date(new Date().toDateString());
  public weekEnd=new Date().setDate(new Date().getDate() - 7);
  public monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
  public monthEnd: Date = this.today;
  public lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
  public lastEnd: Date = this.today;
  public yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
  public yearEnd: Date = this.today;
  public maxRangeDate: Date = this.today;
  public dateValue=moment().format('ddd, D MMM YYYY');
  public dateText=moment().format('ddd, D MMM YYYY');
  public last3Month: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 3)).setDate(1)).toDateString());
  public last6Month: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 6)).setDate(1)).toDateString());
  public last9Month: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 9)).setDate(1)).toDateString());
  public last7days=new Date(new Date(new Date().setDate(new Date().getDate() - 7)).toDateString());
  public last15days=new Date(new Date(new Date().setDate(new Date().getDate() - 15)).toDateString());
  public last60days=new Date(new Date(new Date().setDate(new Date().getDate() - 60)).toDateString());
  public last90days=new Date(new Date(new Date().setDate(new Date().getDate() - 90)).toDateString());
  public lastAllMonth = new Date('03/06/2021');
  //public lastSingleMonth: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 24)).setDate(1)).toDateString()); 03/06/2021


  opentskData=[];
  employeeList=[];
  pgData: any=[];
  pageSize: any = 10;
  currentPage: any = 1;
  //old Variable
  todayDateStart;
  todayDateEnd;

  //new dateVariable
  dateStart;
  dateEnd;

  empNormalTaskConsolidationListing
  empNormalTaskConsolidationListingDiv = false;

  editTaskId: any;
  toolbar: string[];
  datePickerForm: FormGroup;
  selectedDate: Date;
  isRangeActive: boolean;
  isMonthActive: boolean;
  isWeekActive: boolean;
  isTodayActive: boolean;
  showweeksData: boolean;
  showtodaysData: boolean;
  currentView: string;
  showweeksContainer: boolean;
  showMonthsContainer: boolean;
  dateRangeForm: FormGroup;
  dateRngForm: FormGroup;
  noActivRngForm: FormGroup;

  financeData: any=[];
  disableNxtBtn: boolean;
  public budgeted_hours;
  getProjectName;
  getProjectData;
  getProjectTaskCount;
  getEmployeeName;
  getEmployeeData;
  getEmployeeTaskCount;
  backLogProjectData;
  openProjectData;
  openProjectInnerData;
  openProjectsModelHeader;
  checkForEmpProjData = false;
  checkForMilestoneData = false;
  checkForProductivityData = false;
  empProjectTaskCompdiv = false;
  empProjectTaskdiv = false;
  empProjectTaskListing = [];
  empProjectTaskTimelineListing = [];
  empProjectTaskTimelineListingShow = false;
  empNormalTaskListing = [];
  empActivityTaskListing = [];
  empProjectTaskCompListing = [];
  tempEmpNameCommon
  empProjectTaskConsolidationListing
  empProTaskempProTaskConListingdiv = false
  empProjectTaskRemarkList = false;
  empProjectTaskRemarkData;
  consolidationCheckValue = false;
  empNormalTaskRemarkList = false;
  empNormalTaskRemarkData;
  employeeSummaryData;
  checkForEmployeeSummaryData = false;
  singleEmployeeProjectData
  currentEmpDetails;
  singleEmpAllTask
  showData;
  isWorkForceLeader = false;

  lstMnthAct = false;
  noLstMnthAct = false;


  workForceTeamLeadData
  dateRangeFormWF: FormGroup;
  dateTextToDisplay = moment().subtract(7, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
  fromDate = moment().subtract(7, "days").format('L');
  toDate = moment().format('L');
  isSixMonthActive = false;
  isYearActive = false;
  isMonthActiveWF = false;
  isWeekActiveWF = true;
  isTodayActiveWF = false;
  headerTextWF = [
    { text: 'Employees' },
    { text: 'Projects' },
    { text: 'Employee Summary' },
    { text: 'Projects Invoicing' },
    { text: 'Productivity' }
  ]
  basedOnEmployee
  basedOnProject;

  projectStatusText =  "Select Range";
  activeProject = true;

  cardDataToDisplay = {
    Progressive:{
      toBeClaimValue: 0
    },
    advanceToBeClaimed: {
      toBeClaimCount: 0,
      toBeClaimValue: 0,
      toBeClaimedCount: 0,
      toBeClaimedValue: 0,
    },
    toBeClaimed: {
      toBeClaimCount: 0,
      toBeClaimValue: 0,
      toBeClaimedCount: 0,
      toBeClaimedValue: 0,
    },
    proformaInvoice: {
      toBeClaimCount: 0,
      toBeClaimValue: 0,
      toBeClaimedCount: 0,
      toBeClaimedValue: 0,
    },
    invoice: {
      toBeClaimCount: 0,
      toBeClaimValue: 0,
    },
    Revenue: {
      toBeClaimCount: 0,
      toBeClaimValue: 0,
    }
  }



  constructor(
    public taskService:TaskService,
    private financeService:FinanceService,
    public empService: EmployeeService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    public projectService: ProjectService,
    public router: Router,
    private formBuilder: FormBuilder
  ){}

  //start of onInit
  ngOnInit(){
    this.spinner.show();
    this.checkUserRights(); /* get user rights */
    this.GetWorkForceTeamLead();
    this.invoiceToolbar = ['Search', 'PdfExport', 'ExcelExport'];
    this.invoiceModelToolbar = ['Search'];
    this.totalProjectsModelToolbar = ['Search', 'PdfExport', 'ExcelExport']

    //form control
    this.datePickerForm = new FormGroup({
      date: new FormControl(''),
    });

    this.dateRangeForm = new FormGroup({
      daterange: new FormControl(''),
    });
    //form control

    this.dateRngForm = new FormGroup({
      dtrnge: new FormControl(''),
    });

    //noActivRngForm


    this.noActivRngForm = new FormGroup({
      ndtrnge: new FormControl(''),
    });




    if(sessionStorage.getItem('financeFromDate')){
      if((JSON.parse(sessionStorage.getItem('financeFromDate')) && JSON.parse(sessionStorage.getItem('financeToDate')) ==this.today)){
        this.dateText=moment(JSON.parse(sessionStorage.getItem('financeFromDate'))).format('ddd, D MMM YYYY');
      }else if(sessionStorage.getItem('financeFromDate')!=sessionStorage.getItem('financeToDate')){
        this.dateText=moment(JSON.parse(sessionStorage.getItem('financeFromDate'))).format('ddd, D MMM YYYY')+' - '+moment(JSON.parse(sessionStorage.getItem('financeToDate'))).format('ddd, D MMM YYYY');
      }
    }

    if(JSON.parse(sessionStorage.getItem('financeFromDate'))!=''){
      this.isTodayActive = true;

    }

    if((JSON.parse(sessionStorage.getItem('financeFromDate')) && JSON.parse(sessionStorage.getItem('financeToDate')) ==this.today)){
      this.getTodaysData();

    }else if(moment(JSON.parse(sessionStorage.getItem('financeFromDate'))).format('L')==moment(this.monthStart).format('L')){
      this.getMonthsData()   ;

    }else if(moment(JSON.parse(sessionStorage.getItem('financeFromDate'))).format('L')==moment(this.weekEnd).format('L')){
      this.getWeeksData()
    }else if(JSON.parse(sessionStorage.getItem('financeFromDate'))!=JSON.parse(sessionStorage.getItem('financeToDate'))){

      this.showweeksData=true;
      this.showtodaysData=false;
      this.isTodayActive=false;
      this.isWeekActive=false;
      this.isMonthActive=false;
      this.callFunctionByTab(JSON.parse(sessionStorage.getItem('financeFromDate')), JSON.parse(sessionStorage.getItem('financeToDate')));

    }else{
      this.callFunctionByTab(this.today, this.today);
      sessionStorage.setItem('financeFromDate',JSON.stringify(this.today));
      sessionStorage.setItem('financeToDate',JSON.stringify(this.today));
      this.showtodaysData=true
      this.showweeksData=false;

    }


    this.dateRngForm.patchValue({
      dtrnge: [this.lastAllMonth, this.lastEnd]

    });

    this.dateRngForm.get('dtrnge').valueChanges.subscribe(() => {
      let startTime = this.dateRngForm.get('dtrnge').value;
      //CheckActive or Non-active Project
      if(this.activeProject) {
        if(startTime[0] === this.lastAllMonth) {
          this.GetProjectStatusMilestoneData();
          this.projectStatusText = "Overall Active Projects"
        } else {
          this.activeProjectsByRange(startTime[0],startTime[1]);
          let timeDifference = startTime[0].getTime() - startTime[1].getTime();
          let dayMilliSeconds = 1000 * 60 * 60 * 24;
          let totalDays = Math.abs(timeDifference / dayMilliSeconds); // it returns negative value if start date < end date
         totalDays = Math.floor(totalDays);


          this.projectStatusText = "Active Projects Since " + totalDays  + " days";
        }

      }
      else if(!this.activeProject) {
        if(startTime[0] === this.lastAllMonth) {
           this.projectStatusText = "Overall Non-Active Projects"
          this.noActiveProjectByRange(this.lastAllMonth,startTime[1]);
         } else {
           this.noActiveProjectByRange(startTime[0],startTime[1]);
           let timeDifference = startTime[0].getTime() - startTime[1].getTime();
           let dayMilliSeconds = 1000 * 60 * 60 * 24;
           let totalDays = Math.abs(timeDifference / dayMilliSeconds); // it returns negative value if start date < end date
           totalDays = Math.floor(totalDays);
           this.projectStatusText = "Non-Active Projects Since " + totalDays  + " days";
         }

      }
    });

    //active when date picker value changes
    this.dateRangeForm.get('daterange').valueChanges.subscribe(() => {
      this.spinner.show();
      let startTime = this.dateRangeForm.get('daterange').value;
      this.dateStart = moment(startTime[0]).format('L');
      this.dateEnd = moment(startTime[1]).format('L');
      sessionStorage.setItem('financeFromDate',JSON.stringify(startTime[0]))
      sessionStorage.setItem('financeToDate',JSON.stringify(startTime[1]));
      this.callFunctionByTab(startTime[0], startTime[1]);
      this.showweeksData=true;
      this.showtodaysData=false;
      this.dateText = moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');
    });

    this.datePickerForm.get('date').valueChanges.subscribe(() => {
      this.spinner.show();
      let dateValue = this.datePickerForm.get('date').value
      this.dateText = moment(this.datePickerForm.get('date').value).format('ddd, D MMM YYYY');
      this.callFunctionByTab(dateValue, dateValue);
      sessionStorage.setItem('financeFromDate',JSON.stringify(dateValue))
      this.selectedDate = dateValue;
      if(moment(dateValue).format('L')==moment(this.today).format('L')){
        this.disableNxtBtn=true
      }else{
        this.disableNxtBtn=false
      }
      this.showtodaysData=true;

    });
    //active when date picker value changes

    //active when date picker value changes wf
    this.dateRangeFormWF.get('daterange').valueChanges.subscribe(() => {

      let startTime = this.dateRangeFormWF.get('daterange').value;
      this.fromDate = moment(startTime[0]).format('L');
      this.toDate = moment(startTime[1]).format('L');
      this.isTodayActiveWF = false;
      this.isWeekActiveWF = false;
      this.isMonthActiveWF = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateTextToDisplay = moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');
      // this.GetAllProjectRevenueByWrfcId();
      // this.GetAllMilestoneRevByWrfcId();
      // this.EmployeeProductvityByWrfcId();
      this.spinner.show();
      this.EmployeeProductvityByWrfcIdNS()
      this.GetAllProjectRevenueByWrfcIdNS()
      this.GetAllMilestoneRevByWrfcIdNS()
      this.proformainvoicecount()

    });
    this.proformainvoicecount()

  }
  // end of onInit





//date filter starts
  goBack(){
    window.history.go(-1);
  }


  frmtBdgthr(str) {
    var newstr = str;
    var fndme = str.slice(0, str.indexOf(':'));
    var secPrt=  newstr.slice(-2).indexOf(':') > -1 ? newstr.slice(-1) : newstr.slice(-2);
    return fndme +":"+ secPrt;
  }

  nextday(){
    this.spinner.show();
    let fromDate = moment(JSON.parse(sessionStorage.getItem('financeFromDate'))).add(1, 'day').toDate();
    this.dateText = moment(fromDate).format('ddd, D MMM YYYY');
    this.callFunctionByTab(fromDate, fromDate);
    sessionStorage.setItem('financeFromDate',JSON.stringify(fromDate));
  }

  prevday(){
    this.spinner.show();
    let fromDate = moment(JSON.parse(sessionStorage.getItem('financeFromDate'))).subtract(1, 'day').toDate();
    this.dateText = moment(fromDate).format('ddd, D MMM YYYY');
    this.callFunctionByTab(fromDate, fromDate);
    sessionStorage.setItem('financeFromDate',JSON.stringify(fromDate));
  }

  getTodaysData(){
    this.spinner.show();
    this.currentView = "Day";
    this.showweeksContainer=false;
    this.showMonthsContainer=false;
    this.dateText = moment(this.today).format('ddd, D MMM YYYY')
    this.showtodaysData=true
    this.showweeksData=false;
    this.isTodayActive=true;
    this.isWeekActive=false;
    this.isMonthActive=false;
    this.isRangeActive=false;
    this.selectedDate=this.today;
    sessionStorage.setItem('financeFromDate',JSON.stringify(this.today));
    sessionStorage.setItem('financeToDate',JSON.stringify(this.today));
    this.callFunctionByTab(this.today, this.today);
  }

  getWeeksData(){
    this.spinner.show();
    this.showMonthsContainer=false;
    let curr = new Date()
    let week = []
    this.showtodaysData=true;
    this.showweeksContainer=true;
    for(let i = 1; i <= 7; i++){
      let first = curr.getDate() - curr.getDay() + i
      let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
      week.push(day)
    }
    this.currentView  ='Week';
    this.selectedDate=new Date();
    this.dateText=moment(this.weekEnd).format('ddd, D MMM YYYY')+' - '+moment(this.weekStart).format('ddd, D MMM YYYY');
    this.isTodayActive=false;
    this.isWeekActive=true;
    this.isMonthActive=false;
    this.isRangeActive=false;
    sessionStorage.setItem('financeFromDate',JSON.stringify(this.weekEnd));
    sessionStorage.setItem('financeToDate',JSON.stringify(this.weekStart));
    this.callFunctionByTab(this.weekEnd, this.weekStart);
  }

  getMonthsData(){
    this.spinner.show();
    this.showweeksContainer=false;
    this.showMonthsContainer=true;
    this.currentView="Month";
    this.selectedDate=this.monthStart;
    this.showweeksData=true;
    this.showtodaysData=false;
    this.isTodayActive=false;
    this.isWeekActive=false;
    this.isMonthActive=true;
    this.isRangeActive=false;
    this.dateText = moment(this.monthStart).format('ddd, D MMM YYYY')+' - '+moment(this.monthEnd).format('ddd, D MMM YYYY');
    this.dateText = moment(this.monthStart).format('ddd, D MMM YYYY')+' - '+moment(this.monthEnd).format('ddd, D MMM YYYY');
    this.showtodaysData=true;
    sessionStorage.setItem('financeFromDate',JSON.stringify(this.monthStart));
    sessionStorage.setItem('financeToDate',JSON.stringify(this.monthEnd));
    this.callFunctionByTab(this.monthStart, this.monthEnd);
  }

//date filter ends

  callFunctionByTab(startDate, endDate){
    this.dateStart = moment(startDate).format('L');
    this.dateEnd = moment(endDate).format('L');
    //project invoice tab Call
    this.GetProjectwithMilestoneData();
    //productivity tab Call


     this.GetEmployeeProductvityByOrgID();





    this.GetProjectStatusMilestoneData();
    this.GetAllProjectValueByOrgID();
    this.GetAllBackLogProjectRevenueByOrgID();
    this.GetAllOpenProjectRevenueByOrgID();
    this.EmployeeSummaryByOrgID();
    this.proformainvoicecount();
  }

//user rights
  checkUserRights(){
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let postData = { id : user_info.role_id }
    this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
      this.UserRights = _.groupBy(data, 'module_name')
      if(this.UserRights.Revenue){
        this.accessRevenueModuleGranted = true;
        this.UserRights.Revenue.map((elm) => {
          if(elm.section_name === 'View Revenue'){
            if(elm.is_allow === true){
              this.accessViewRevenue = true;
            }else{
              this.accessViewRevenue = false;
            }
          }else{
            this.accessViewRevenue = false;
          }
        });
      }else{
        this.accessRevenueModuleGranted = false;
      }
    });
  }

  GetWorkForceTeamLead(){
    //formControl
    this.dateRangeFormWF = this.formBuilder.group({
      daterange: [''],
    });
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    this.projectService.GetWorkForceTeamLead({id: user_info.id}).subscribe((data: any) => {
      if(data.length > 0){
        this.isWorkForceLeader = true;
        this.workForceTeamLeadData = data[0];


        this.GetAllProjectRevenueByWrfcId();
        this.GetAllMilestoneRevByWrfcId();
        //Call the work force leader



      }else{
        this.isWorkForceLeader = false;
      }
    });
  }

  tabSelected(event){
    let currentTabName = event.selectedItem.textContent;
    if(currentTabName === 'Employees' || currentTabName === 'Projects'){
      this.GetAllProjectRevenueByWrfcId();
    }else if(currentTabName === 'Productivity'){
      this.EmployeeProductvityByWrfcId();
    } else if(currentTabName === 'Projects Invoicing'){
      this.GetAllMilestoneRevByWrfcId();
    }

    else{
      this.EmployeeSummaryByWrkfcId();
    }
  }

  GetAllMilestoneRevByWrfcId(){
    this.spinner.show();
    this.checkForMilestoneData = true;
    let postData = {
      "id": this.workForceTeamLeadData.id,
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }
    this.projectService.GetWorkForceMileStoneData(postData).subscribe((data: any) => {


     data.map((elm) => {
      elm.accountsId = elm.accountsId
      elm.progress = parseFloat(elm.progress);
      elm.projectMilestoneData.map((el) => {
        if(el.projectMilestoneProperties.length > 0) {
          el.projectMilestoneProperties[0].ratio = parseInt(el.projectMilestoneProperties[0].ratio)
        }
        if(el.projectMilestonePropertieswithDate.length > 0) {
          el.projectMilestonePropertieswithDate[0].ratio = parseInt(el.projectMilestonePropertieswithDate[0].ratio)
        }
        let one = el.projectMilestoneProperties.length !== 0 ? parseInt(el.projectMilestoneProperties[0].ratio) : 0;
        let two = el.projectMilestonePropertieswithDate.length !== 0 ? parseInt(el.projectMilestonePropertieswithDate[0].ratio) : 0;
        el['TotalRatio'] = (one + two) >= 99.50 ? 100 : one + two
      });
      elm['totalTimeProcess'] = parseFloat(((parseFloat(elm.budgeted_hours) - parseFloat(elm.actual_hours.replace(':', '.')))/parseFloat(elm.budgeted_hours) * 100).toFixed(2));
      elm['progressByBudgeted_tilldate'] = parseFloat(((parseFloat(elm.budgeted_mins_tillDate)/parseFloat(elm.budgeted_hours)) * 100).toFixed(2));
    });
    this.callReverseFun(data)


    })
  }

  GetAllMilestoneRevByWrfcIdNS(){
   // this.spinner.show();
    this.checkForMilestoneData = true;
    let postData = {
      "id": this.workForceTeamLeadData.id,
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }
    this.projectService.GetWorkForceMileStoneData(postData).subscribe((data: any) => {


     data.map((elm) => {
      elm.accountsId = elm.accountsId
      elm.progress = parseFloat(elm.progress);
      elm.projectMilestoneData.map((el) => {
        if(el.projectMilestoneProperties.length > 0) {
          el.projectMilestoneProperties[0].ratio = parseInt(el.projectMilestoneProperties[0].ratio)
        }
        if(el.projectMilestonePropertieswithDate.length > 0) {
          el.projectMilestonePropertieswithDate[0].ratio = parseInt(el.projectMilestonePropertieswithDate[0].ratio)
        }
        let one = el.projectMilestoneProperties.length !== 0 ? parseInt(el.projectMilestoneProperties[0].ratio) : 0;
        let two = el.projectMilestonePropertieswithDate.length !== 0 ? parseInt(el.projectMilestonePropertieswithDate[0].ratio) : 0;
        el['TotalRatio'] = (one + two) >= 99.50 ? 100 : one + two
      });
      elm['totalTimeProcess'] = parseFloat(((parseFloat(elm.budgeted_hours) - parseFloat(elm.actual_hours.replace(':', '.')))/parseFloat(elm.budgeted_hours) * 100).toFixed(2));
      elm['progressByBudgeted_tilldate'] = parseFloat(((parseFloat(elm.budgeted_mins_tillDate)/parseFloat(elm.budgeted_hours)) * 100).toFixed(2));
    });
    this.callReverseFunNS(data)


    })
  }


  proformainvoicecount()
  {
    this.showTimeSpinner = true;
    //first API
    this.projectService.GetAllProjectRevenueByOrgID(this.fromDate, this.toDate).subscribe((api1:any) => {
      let Progressive = {
        toBeClaimValue: api1.value
      }
      this.cardDataToDisplay.Progressive = Progressive;
      this.GetAllOpenProjectRevenueByOrgID();
      this.GetAllBackLogProjectRevenueByOrgID();

      this.projectService.GetProformaInvoiceCount(this.fromDate, this.toDate).subscribe((api2:any) => {
        if(api2){
          api2.map((elm) => {
            if(elm.totalAdvanceCount){
              let advanceToBeClaimed = {
                toBeClaimCount: elm.totalAdvanceCount,
                toBeClaimValue: elm.totalAdvanceAmount,
                toBeClaimedCount: 0,
                toBeClaimedValue: 0,
              }
              api2.map((elm2) => {
                if(elm2.totalAdvanceClaimCount){
                  advanceToBeClaimed.toBeClaimedCount = elm2.totalAdvanceClaimCount;
                  advanceToBeClaimed.toBeClaimedValue = elm2.totalAdvanceClaimAmount;
                }
              });

              this.cardDataToDisplay.advanceToBeClaimed = advanceToBeClaimed;
            }

            if(elm.totalAdvanceCount === undefined){
              api2.map((elm2) => {
                if(elm2.totalAdvanceClaimCount){
                  this.cardDataToDisplay.advanceToBeClaimed.toBeClaimedCount = elm2.totalAdvanceClaimCount;
                  this.cardDataToDisplay.advanceToBeClaimed.toBeClaimedValue = elm2.totalAdvanceClaimAmount;
                }
              });
            }

            if(elm.totalClaimCount){
              let toBeClaimed = {
                toBeClaimCount: elm.totalClaimCount,
                toBeClaimValue: elm.totalClaimAmount,
                toBeClaimedCount: 0,
                toBeClaimedValue: 0,
              }
              api2.map((elm2) => {
                if(elm2.totalClaimedCount){
                  toBeClaimed.toBeClaimedCount = elm2.totalClaimedCount;
                  toBeClaimed.toBeClaimedValue = elm2.totalClaimed;
                }
              });
              this.cardDataToDisplay.toBeClaimed = toBeClaimed;
            }

            if(elm.totalClaimCount === undefined){
              api2.map((elm2) => {
                if(elm2.totalClaimedCount){
                  this.cardDataToDisplay.toBeClaimed.toBeClaimedCount = elm2.totalClaimedCount;
                  this.cardDataToDisplay.toBeClaimed.toBeClaimedValue = elm2.totalClaimed;
                }
              });
            }



            if(elm.totalDraftCount){
              let proformaInvoice = {
                toBeClaimCount: elm.totalDraftCount,
                toBeClaimValue: elm.totalDraftAmount,
                toBeClaimedCount: 0,
                toBeClaimedValue: 0,
              }
              api2.map((elm2) => {
                if(elm2.totalClaimDraftCount){
                  proformaInvoice.toBeClaimedCount = elm2.totalClaimDraftCount;
                  proformaInvoice.toBeClaimedValue = elm2.totalClaimDraftAmount;
                }
              });
              this.cardDataToDisplay.proformaInvoice = proformaInvoice;
            }



            if(elm.totalDraftCount === undefined){
              api2.map((elm2) => {
                if(elm2.totalClaimDraftCount){
                  this.cardDataToDisplay.proformaInvoice.toBeClaimedCount = elm2.totalClaimDraftCount;
                  this.cardDataToDisplay.proformaInvoice.toBeClaimedValue = elm2.totalClaimDraftAmount;
                }
              });
            }





            if(elm.totalStageCount){
              let invoice = {
                toBeClaimCount: elm.totalStageCount,
                toBeClaimValue: elm.totalStageAmount,
                toBeClaimedCount: 0,
                toBeClaimedValue: 0,
              }

              api2.map((elm2) => {
                if(elm2.totalStageClaimCount){
                  invoice.toBeClaimedCount = elm2.totalStageClaimCount;
                  invoice.toBeClaimedValue = elm2.totalStageClaimAmount;
                }
              });
              this.cardDataToDisplay.invoice = invoice;

            }

            // if(elm.totalStageCount === undefined){
            //   let invoice = {
            //     toBeClaimCount: elm.totalStageCount,
            //     toBeClaimValue: elm.totalStageAmount,
            //     toBeClaimedCount: 0,
            //     toBeClaimedValue: 0,
            //   }
            //   api2.map((elm2) => {
            //     if(elm2.totalStageClaimCount){
            //       invoice.toBeClaimedCount = elm2.totalAdvanceClaimCount;
            //       invoice.toBeClaimedValue = elm2.totalAdvanceClaimAmount;
            //     }
            //   });
            //   this.cardDataToDisplay.invoice = invoice;
            // }


          });
          this.projectService.GetAdvacneRevInv(this.fromDate, this.toDate).subscribe((data3:any) => {
            if(data3){
              data3.map((elm) => {
                let Revenue = {
                  toBeClaimCount: elm.totalAdvRevCount,
                  toBeClaimValue: elm.totalAdvRevAmount,
                }
                this.cardDataToDisplay.Revenue = Revenue;
              });
              this.showTimeSpinner = false;
            }
          });
        }

      });
    });
  }



  GetAllProjectRevenueByWrfcIdNS(){
   // this.spinner.show();
    let postData = {
      "orgID": this.workForceTeamLeadData.id,
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }
    this.projectService.GetAllProjectRevenueByWrfcId(postData).subscribe((data: any) => {

      this.basedOnEmployee = data.basedOnEmployee.map((elm) => {
        elm.project_count = Number(elm.project_count);
        elm.task_count = Number(elm.task_count);
        elm.budgeted_hours_value = parseFloat((elm.budgeted_hours_value).replace(/,/g, ''));

        elm.avial_hours = parseFloat(elm.avial_hours.replace(':', '.'));
        elm.budgeted_hours_after = parseFloat(this.timeConvert(Number(elm.tot_minutes)));
        return elm;
      });

      this.basedOnProject = data.basedOnProject.map((elm) => {
        elm.employee_count = Number(elm.employee_count);
        elm.task_count = Number(elm.task_count);
        elm.budgeted_hours_value = Number(elm.budgeted_hours_value);
        elm.budgeted_hours = Number(elm.budgeted_hours);
        return elm;
      });


      // this.basedOnEmployee = data.basedOnEmployee;
      // this.basedOnProject = data.basedOnProject;
      //this.spinner.hide();
    })
  }

  GetAllProjectRevenueByWrfcId(){
    this.spinner.show();
    let postData = {
      "orgID": this.workForceTeamLeadData.id,
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }
    this.projectService.GetAllProjectRevenueByWrfcId(postData).subscribe((data: any) => {

      this.basedOnEmployee = data.basedOnEmployee.map((elm) => {
        elm.project_count = Number(elm.project_count);
        elm.task_count = Number(elm.task_count);
        elm.budgeted_hours_value = parseFloat((elm.budgeted_hours_value).replace(/,/g, ''));

        elm.avial_hours = parseFloat(elm.avial_hours.replace(':', '.'));
        elm.budgeted_hours_after = parseFloat(this.timeConvert(Number(elm.tot_minutes)));
        return elm;
      });

      this.basedOnProject = data.basedOnProject.map((elm) => {
        elm.employee_count = Number(elm.employee_count);
        elm.task_count = Number(elm.task_count);
        elm.budgeted_hours_value = Number(elm.budgeted_hours_value);
        elm.budgeted_hours = Number(elm.budgeted_hours);
        return elm;
      });


      // this.basedOnEmployee = data.basedOnEmployee;
      // this.basedOnProject = data.basedOnProject;
      this.spinner.hide();
    })
  }

  EmployeeSummaryByWrkfcId(){
    this.checkForEmployeeSummaryData = true;
    this.projectService.EmployeeSummaryByWrkfcId({ id: this.workForceTeamLeadData.id }).subscribe((data: any) => {
      let empSummary = [];
      data.basedOnProject.map((elm, i) => {
        if(elm.employee_id !== 'NA'){
          elm.expected_working_days = Math.round(parseFloat(elm.budgeted_hours)/8)
          empSummary.push(elm)
        }

        if(data.basedOnProject.length === i+1){
          this.employeeSummaryData = empSummary;
          this.checkForEmployeeSummaryData = false;
        }
      });
    })
  }

  EmployeeProductvityByWrfcIdNS(){
    this.spinner.show();
    let postData = {
      "orgID": this.workForceTeamLeadData.id,
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }
    this.projectService.EmployeeProductvityByWrfcId(postData).subscribe((data: any) => {
      if(data.length === 0){
        this.employeeProductivityWrkFrcDetail = data;
        this.spinner.hide();
      }else{
        let processedData;
        let finalData = [];
        data.map((elm, i) => {
          processedData = {
            full_name : elm.full_name,
            project_tasks_hours : elm.project_tasks_hours,
            project_tasks_count : parseFloat(elm.project_tasks_count),
            project_tasks_comp : parseFloat(elm.task_count),
            normal_tasks_hours : elm.normal_tasks_hours,
            normal_tasks_count : parseFloat(elm.normal_tasks_count),
            activity_tasks_hours: elm.activity_tasks_hours,
            activity_tasks_count : parseFloat(elm.activity_tasks_count),
            avial_hours : elm.avial_hours,
            unproductive_time: elm.unprdtv_hours.includes('-') ? 0 : elm.unprdtv_hours,
            total_Task: parseFloat(elm.project_tasks_count) + parseFloat(elm.normal_tasks_count) + parseFloat(elm.activity_tasks_count),
            total_Working_time: elm.total_hours.includes('-') ? 0 : elm.total_hours,
            revision_count: Number(elm.revision_count),
            start_revisionCount: Number(elm.start_revisionCount),
            budgeted_hours_project: elm.budgeted_hours_project,
            budgeted_hours: elm.budgeted_hours,
            budgeted_hours_value: elm.budgeted_hours_value,
            pending_Hours_value: this.pendingHoursValue(elm.project_tasks_hours, elm.budgeted_hours_project),
            productive: parseFloat(elm.budgeted_hours.replace(':', '.')) >= parseFloat(elm.budgeted_hours_project.replace(':', '.')) ? true : false
          }
          processedData['unproductive_time_per'] = parseFloat(((this.totalSeconds(elm.unprdtv_hours) / this.totalSeconds(elm.avial_hours)) * 100).toFixed(2));
          finalData.push(processedData)

          if(data.length === i+1){
            this.employeeProductivityWrkFrcDetail = finalData;
           // this.spinner.hide();
            setTimeout(()=>{
              this.spinner.hide();
            },5000);

          }
        });
      }
    });
  }


  EmployeeProductvityByWrfcId(){
    this.spinner.show();
    let postData = {
      "orgID": this.workForceTeamLeadData.id,
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }
    this.projectService.EmployeeProductvityByWrfcId(postData).subscribe((data: any) => {
      if(data.length === 0){
        this.employeeProductivityWrkFrcDetail = data;
        this.spinner.hide();
      }else{
        let processedData;
        let finalData = [];
        data.map((elm, i) => {
          processedData = {
            full_name : elm.full_name,
            project_tasks_hours : elm.project_tasks_hours,
            project_tasks_count : parseFloat(elm.project_tasks_count),
            project_tasks_comp : parseFloat(elm.task_count),
            normal_tasks_hours : elm.normal_tasks_hours,
            normal_tasks_count : parseFloat(elm.normal_tasks_count),
            activity_tasks_hours: elm.activity_tasks_hours,
            activity_tasks_count : parseFloat(elm.activity_tasks_count),
            avial_hours : elm.avial_hours,
            unproductive_time: elm.unprdtv_hours.includes('-') ? 0 : elm.unprdtv_hours,
            total_Task: parseFloat(elm.project_tasks_count) + parseFloat(elm.normal_tasks_count) + parseFloat(elm.activity_tasks_count),
            total_Working_time: elm.total_hours.includes('-') ? 0 : elm.total_hours,
            revision_count: Number(elm.revision_count),
            start_revisionCount: Number(elm.start_revisionCount),
            budgeted_hours_project: elm.budgeted_hours_project,
            budgeted_hours: elm.budgeted_hours,
            budgeted_hours_value: elm.budgeted_hours_value,
            pending_Hours_value: this.pendingHoursValue(elm.project_tasks_hours, elm.budgeted_hours_project),
            productive: parseFloat(elm.budgeted_hours.replace(':', '.')) >= parseFloat(elm.budgeted_hours_project.replace(':', '.')) ? true : false
          }
          processedData['unproductive_time_per'] = parseFloat(((this.totalSeconds(elm.unprdtv_hours) / this.totalSeconds(elm.avial_hours)) * 100).toFixed(2));
          finalData.push(processedData)

          if(data.length === i+1){
            this.employeeProductivityWrkFrcDetail = finalData;

            setTimeout(()=>{
              this.spinner.hide();
            },5000);

          }
        });
      }
    });
  }


  GetOpnTskByMilStn(projectId,milstoneName) {

    let postData = {
      id: projectId,
      milestoneName: milstoneName,
      org_id: localStorage.getItem('org_id'),
      fromDate: "01/01/2020",
      toDate: moment().format('L')
    }

    this.financeService.GetOpentaskDatabyMilestone(postData).subscribe((opTaskData: any) => {

          if(opTaskData != null) {
            this.opentskData = opTaskData.projectMilestoneDataWithDate;
              console.log("this.opentskData",this.opentskData);
           //  this.projectMilestoneInvoiceTableData.openTasksData = opTaskData.projectMilestoneDataWithDate;
          }
      });

  }


  getCommonDateType(value){
    if(value === 'today'){
      this.fromDate = moment().format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().format('ddd, D MMM YYYY')
      this.isTodayActiveWF = true;
      this.isWeekActiveWF = false;
      this.isMonthActiveWF = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateRangeFormWF.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
    }else if(value === 'weeks'){
      this.fromDate = moment().subtract(7, "days").format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(7, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActiveWF = false;
      this.isWeekActiveWF = true;
      this.isMonthActiveWF = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateRangeFormWF.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
    }else if(value === 'month'){
      this.fromDate = moment().startOf('month').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().startOf('month').format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActiveWF = false;
      this.isWeekActiveWF = false;
      this.isMonthActiveWF = true;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateRangeFormWF.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
    }else if(value === 'six-month'){
      this.fromDate = moment().subtract(6, 'months').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(6, 'months').format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActiveWF = false;
      this.isWeekActiveWF = false;
      this.isMonthActiveWF = false;
      this.isSixMonthActive = true;
      this.isYearActive = false;
      this.dateRangeFormWF.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
    }else if(value === 'year'){
      this.fromDate = moment().startOf('year').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().startOf('year').format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActiveWF = false;
      this.isWeekActiveWF = false;
      this.isMonthActiveWF = false;
      this.isSixMonthActive = false;
      this.isYearActive = true;
      this.dateRangeFormWF.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
    }
  }

//Summary number data starts
  GetAllBackLogProjectRevenueByOrgID(){
    let postData={
      "fromDate": this.dateStart,
      "orgID": localStorage.getItem('org_id'),
      "toDate": this.dateEnd
    }
    this.financeService.GetAllBackLogProjectRevenueByOrgID(postData).subscribe((data:any)  => {
      if(data){
        let processData = []
        data.basedOnProject.map((elem) => {
          processData.push({
            budgeted_hours: Number(elem.budgeted_hours),
            budgeted_hours_value: Number(elem.budgeted_hours_value),
            task_count: Number(elem.task_count),
            project_name: elem.project_name,
            created_date: elem.created_date,
          })
        })
        let secondData = [];
        processData.map((elm) => {
          if(elm.budgeted_hours_value > 0){
            secondData.push({
              budgeted_hours: Number(elm.budgeted_hours),
              budgeted_hours_value: Number(elm.budgeted_hours_value),
              task_count: Number(elm.task_count),
              project_name: elm.project_name,
              created_date: elm.created_date,
            })
          }
        })
        let finalData;
        finalData = {
          basedOnProject: secondData,
          hours: Math.round(_.sumBy(secondData, 'budgeted_hours')),
          project_count: secondData.length,
          task_count: Math.round(_.sumBy(secondData, 'task_count')),
          value: Math.round(_.sumBy(secondData, 'budgeted_hours_value')),
        }
        this.backLogProjectData = finalData;
      }
    },(error) => {
      Swal.fire(
      'Error!',
        error,
      'error')
    });
  }

  GetAllOpenProjectRevenueByOrgID(){
    let postData={
      "fromDate": this.dateStart,
      "orgID": localStorage.getItem('org_id'),
      "toDate": this.dateEnd
    }
    this.financeService.GetAllOpenProjectRevenueByOrgID(postData).subscribe((data:any) => {
      if(data){
        this.openProjectData = data
      }
    },(error) => {
      Swal.fire(
      'Error!',
       error,
      'error')
    });
  }
//Summary number data ends

//employe, project tab and Summary number starts
  GetAllProjectValueByOrgID(){
    this.checkForEmpProjData = true;
    let postData={
      "fromDate": this.dateStart,
      "toDate": this.dateEnd
    }
    this.financeService.GetAllProjectRevenueByOrgID(postData).subscribe((data:any)  => {
      if(data){
        this.financeData = data;
        this.employeeTableData = data.basedOnEmployee.map((elm) => {
          elm.project_count = Number(elm.project_count);
          elm.task_count = Number(elm.task_count);
          elm.budgeted_hours_value = parseFloat((elm.budgeted_hours_value).replace(/,/g, ''));
          /* elm.budgeted_hours = Number(elm.budgeted_hours); */
          elm.avial_hours = parseFloat(elm.avial_hours.replace(':', '.'));
          elm.budgeted_hours_after = parseFloat(this.timeConvert(Number(elm.tot_minutes)));
          return elm;
        });

        this.projectTableData = data.basedOnProject.map((elm) => {
          elm.employee_count = Number(elm.employee_count);
          elm.task_count = Number(elm.task_count);
          elm.budgeted_hours_value = Number(elm.budgeted_hours_value);
          elm.budgeted_hours = Number(elm.budgeted_hours);
          return elm;
        });
      }
      this.checkForEmpProjData = false;
      this.spinner.hide();
    },(error) => {
      Swal.fire(
      'Error!',
       error,
      'error')
    });
  }

  timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "." + rminutes;
  }


  GetProjectStatusMilestoneData(){
    this.checkForOverAllStatusData = true;
    let reqBody = {
      id: localStorage.getItem('org_id'),
      fromDate: this.dateEnd,
      toDate: this.dateEnd
    }

    this.financeService.GetProjectStatusOpen(reqBody).subscribe((data: any) => {
      data.map((elm) => {
        elm.accountsId = elm.accountsId
        elm.progress = parseFloat(elm.progress);
        elm.projectMilestoneData.map((el) => {
          if(el.projectMilestoneProperties.length > 0) {
            el.projectMilestoneProperties[0].ratio = parseInt(el.projectMilestoneProperties[0].ratio)
          }
          if(el.projectMilestonePropertieswithDate.length > 0) {
            el.projectMilestonePropertieswithDate[0].ratio = parseInt(el.projectMilestonePropertieswithDate[0].ratio)
          }
          let one = el.projectMilestoneProperties.length !== 0 ? parseInt(el.projectMilestoneProperties[0].ratio) : 0;
          let two = el.projectMilestonePropertieswithDate.length !== 0 ? parseInt(el.projectMilestonePropertieswithDate[0].ratio) : 0;
          el['TotalRatio'] = one + two >= 99.50 ? 100 : one + two
        });
        elm['totalTimeProcess'] = parseFloat(((parseFloat(elm.budgeted_hours) - parseFloat(elm.actual_hours.replace(':', '.')))/parseFloat(elm.budgeted_hours) * 100).toFixed(2));
        elm['progressByBudgeted_tilldate'] = parseFloat(((parseFloat(elm.budgeted_mins_tillDate)/parseFloat(elm.budgeted_hours)) * 100).toFixed(2));
      });
      data = data.filter((el) => el.progress != 100);
      this.callReverseOpnFun(data)
    });
  }



  callReverseOpnFun(data){
    data.map((elm) => {
      elm.projectMilestoneData.reverse();
      if(elm.projectMilestoneData.length > 2){
        let design = elm.projectMilestoneData[2];
        let shopDrawing = elm.projectMilestoneData[1];
        elm.projectMilestoneData[1] = design
        elm.projectMilestoneData[2] = shopDrawing;
        if(elm.projectMilestoneData.length > 3){
          let extraService = elm.projectMilestoneData[1];
          let design = elm.projectMilestoneData[3];
          elm.projectMilestoneData[1] = design;
          elm.projectMilestoneData[3] = extraService;
        }
      }
    });

    this.projectStatusOverallDetail = data;
    this.checkForOverAllStatusData = false;
    this.spinner.hide();
  }
//employe, project tab and Summary number ends

//project invoicing starts
  GetProjectwithMilestoneData(){
    this.checkForMilestoneData = true;
    let reqBody = {
      id: localStorage.getItem('org_id'),
      fromDate: this.dateStart,
      toDate: this.dateEnd
    }
    this.financeService.GetProjectwithMilestoneData(reqBody).subscribe((data: any) => {
      data.map((elm) => {
        elm.accountsId = elm.accountsId
        elm.progress = parseFloat(elm.progress);
        elm.projectMilestoneData.map((el) => {
          if(el.projectMilestoneProperties.length > 0) {
            el.projectMilestoneProperties[0].ratio = parseInt(el.projectMilestoneProperties[0].ratio)
          }
          if(el.projectMilestonePropertieswithDate.length > 0) {
            el.projectMilestonePropertieswithDate[0].ratio = parseInt(el.projectMilestonePropertieswithDate[0].ratio)
          }
          let one = el.projectMilestoneProperties.length !== 0 ? parseInt(el.projectMilestoneProperties[0].ratio) : 0;
          let two = el.projectMilestonePropertieswithDate.length !== 0 ? parseInt(el.projectMilestonePropertieswithDate[0].ratio) : 0;
          el['TotalRatio'] = (one + two) >= 99.50 ? 100 : one + two
        });
        elm['totalTimeProcess'] = parseFloat(((parseFloat(elm.budgeted_hours) - parseFloat(elm.actual_hours.replace(':', '.')))/parseFloat(elm.budgeted_hours) * 100).toFixed(2));
        elm['progressByBudgeted_tilldate'] = parseFloat(((parseFloat(elm.budgeted_mins_tillDate)/parseFloat(elm.budgeted_hours)) * 100).toFixed(2));
      });
      this.callReverseFun(data)
    });
  }

  trimValue(value){
    return value.toFixed(2)
  }



  callReverseFunNS(data){
    data.map((elm) => {
      elm.projectMilestoneData.reverse();
      if(elm.projectMilestoneData.length > 2){
        let design = elm.projectMilestoneData[2];
        let shopDrawing = elm.projectMilestoneData[1];
        elm.projectMilestoneData[1] = design
        elm.projectMilestoneData[2] = shopDrawing;
        if(elm.projectMilestoneData.length > 3){
          let extraService = elm.projectMilestoneData[1];
          let design = elm.projectMilestoneData[3];
          elm.projectMilestoneData[1] = design;
          elm.projectMilestoneData[3] = extraService;
        }
      }
    });
    this.projectMilestonePerTableData = data;
    this.projectMilestoneWrjPerTableData =data;
    this.checkForMilestoneData = false;
   // this.spinner.hide();
  }

  callReverseFun(data){
    data.map((elm) => {
      elm.projectMilestoneData.reverse();
      if(elm.projectMilestoneData.length > 2){
        let design = elm.projectMilestoneData[2];
        let shopDrawing = elm.projectMilestoneData[1];
        elm.projectMilestoneData[1] = design
        elm.projectMilestoneData[2] = shopDrawing;
        if(elm.projectMilestoneData.length > 3){
          let extraService = elm.projectMilestoneData[1];
          let design = elm.projectMilestoneData[3];
          elm.projectMilestoneData[1] = design;
          elm.projectMilestoneData[3] = extraService;
        }
      }
    });
    this.projectMilestonePerTableData = data;
    this.projectMilestoneWrjPerTableData =data;
    this.checkForMilestoneData = false;
    this.spinner.hide();
  }

  projectInvoicingDetailsModel(projdata, proData){


    this.spinner.show();
    $('#project_invoicing_modal').modal("show");

    this.GetOpnTskByMilStn(projdata.project_id,proData.activity_name);


    let reqObject = {
      id: projdata.project_id,
      milestoneName: proData.activity_name,
      org_id: localStorage.getItem('org_id'),
      fromDate: this.dateStart,
      toDate: this.dateEnd
    }
    this.financeService.GettaskDatabyMilestone(reqObject).subscribe((data: any) => {
      let finalData = {
        projectName: projdata.project_name,
        milestoneName: proData.activity_name,
        fromDate: this.dateStart,
        toDate: this.dateEnd,
        projectMilestoneData: data.projectMilestoneData,
        projectMilestoneDataWithDate: data.projectMilestoneDataWithDate,
      }
      this.projectMilestoneInvoiceTableData = finalData;
      this.spinner.hide();
    });
  }

 timeToMinutes(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
}
//project invoicing ends

//productivity fun starts

  //get employee productivity - tab
  async GetEmployeeProductvityByOrgID(){
    this.checkForProductivityData = true;
    let reqBody = {
      orgID: localStorage.getItem('org_id'),
      fromDate: this.dateStart,
      toDate: this.dateEnd
    }

    try {
       const data: any = await this.financeService.GetEmployeeProductvityByOrgID(reqBody).toPromise();
       let finalData = data.map((elm) => {
        const processedData = {
          full_name : elm.full_name,
          project_tasks_hours : elm.project_tasks_hours === null ? "00:00" : elm.project_tasks_hours,
          project_tasks_count : parseFloat(elm.project_tasks_count),
          project_tasks_comp : parseFloat(elm.task_count),
          normal_tasks_hours : elm.normal_tasks_hours === null ? "00:00" : elm.normal_tasks_hours,
          normal_tasks_count : parseFloat(elm.normal_tasks_count),
          activity_tasks_hours: elm.activity_tasks_hours === null ? "00:00" : elm.activity_tasks_hours,
          activity_tasks_count : parseFloat(elm.activity_tasks_count),
          avial_hours : elm.avial_hours,
          unproductive_time: elm.unprdtv_hours.includes('-') ? 0 : elm.unprdtv_hours,
          total_Task: parseFloat(elm.project_tasks_count) + parseFloat(elm.normal_tasks_count) + parseFloat(elm.activity_tasks_count),
          total_Working_time: elm.total_hours.includes('-') ? 0 : elm.total_hours,
          revision_count: Number(elm.revision_count),
          start_revisionCount: Number(elm.start_revisionCount),
          budgeted_hours_project: elm.budgeted_hours_project === null ? "00:00" : elm.budgeted_hours_project,
          budgeted_hours: elm.budgeted_hours,
          budgeted_hours_value: elm.budgeted_hours_value === null ? 0 : elm.budgeted_hours_value,
          pending_Hours_value:  elm.project_tasks_hours ||  elm.budgeted_hours_project ?  this.pendingHoursValue(elm.project_tasks_hours, elm.budgeted_hours_project) : 0,
          //productive: parseFloat(elm.budgeted_hours.replace(':', '.')) >= parseFloat(elm.budgeted_hours_project.replace(':', '.')) ? true : false
          productive : this.timeToMinutes(elm.budgeted_hours) >= this.timeToMinutes(elm.budgeted_hours_project)
        }
        processedData['unproductive_time_per'] = parseFloat(((this.totalSeconds(elm.unprdtv_hours) / this.totalSeconds(elm.avial_hours)) * 100).toFixed(2));
        return processedData;
       })
       this.employeeProductivityDetail = finalData;
       this.checkForProductivityData = false;

    } catch(error) {
      console.error('Error fetching productivity data:', error);
    } finally {
      this.checkForProductivityData = false;
      this.spinner.hide();
    }


  }

  totalSeconds(time){
    var parts = time.split(':');
    return parts[0] * 3600 + parts[1] * 60;
  }

  pendingHoursValue(totalHrs, complHrs){
    let valueTotal = moment.duration(totalHrs);
    let valueComp = moment.duration(complHrs);
    let difference = valueTotal.subtract(valueComp);
    let hours = difference.hours() < 9 ? '0'+difference.hours() : difference.hours();
    let minutes = difference.minutes() < 9 ? '0'+difference.minutes() : difference.minutes();
    return hours + ":" + minutes === '00:00' ? 'Completed task time: '+complHrs : (complHrs !== '00:00' ? 'In-Progress task time: '+hours + ":" + minutes+' Completed Task time: '+complHrs : 'In-Progress task time: '+hours + ":" + minutes);
  }

  //Productivity - employee summary
  EmployeeSummaryByOrgID(){
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let user_access = user_info['is_admin']
    if(user_access == true){
    this.checkForEmployeeSummaryData = true;
    this.financeService.EmployeeSummaryByOrgID({orgID: localStorage.getItem('org_id')}).subscribe((data:any) => {
      let empSummary = [];
      data.basedOnProject.map((elm, i) => {
        if(elm.employee_id !== 'NA'){
          elm.expected_working_days = Math.round(parseFloat(elm.budgeted_hours)/8)
          empSummary.push(elm)
        }
        if(data.basedOnProject.length === i+1){
          this.employeeSummaryData = empSummary;
          this.checkForEmployeeSummaryData = false;
        }
      });
    });
  }
}
  // EmployeeSummaryByOrgID(){
  //   this.checkForEmployeeSummaryData = true;
  //   this.financeService.EmployeeSummaryByOrgID({orgID: localStorage.getItem('org_id')}).subscribe((data:any) => {
  //     let empSummary = [];
  //     data.basedOnProject.map((elm, i) => {
  //       if(elm.employee_id !== 'NA'){
  //         elm.expected_working_days = Math.round(parseFloat(elm.budgeted_hours)/8)
  //         empSummary.push(elm)
  //       }

  //       if(data.basedOnProject.length === i+1){
  //         this.employeeSummaryData = empSummary;
  //         this.checkForEmployeeSummaryData = false;
  //       }
  //     });
  //   });
  // }

  openSingleEmployeeDetailsModel(data){
    this.spinner.show();
    this.currentEmpDetails = data;
    this.financeService.GetSummaryDetailsbyEmpID({id: data.employee_id}).subscribe((data) => {
      let grouped = _.groupBy(data, project => project.ProjectId);
      this.singleEmployeeProjectData = Object.values(grouped);
      console.log(this.singleEmployeeProjectData)
      $('#single_Employee_Details_modal').modal("show");
      this.spinner.hide();
    });
  }

  routToProject(id){
    localStorage.setItem('project_id',id);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/project-layout-new'])
    );
    window.open(url, "_blank");
  }

  openSingleEmpAllTaskModel(empID, grpID){
    let postData = {empID, grpID}
    this.financeService.GetSummaryDetailsbyEmpIDAndMil(postData).subscribe((data) => {
      this.singleEmpAllTask = data;
      this.showData = {
        employeeName: this.singleEmpAllTask[0].EmployeeName,
        milestone: grpID,
        tasklength: this.singleEmpAllTask.length
      }
      $('#single_Employee_Task_Details_modal').modal("show");
    })
  }

  closeSingleEmpAllTaskModel(){
    $('#single_Employee_Task_Details_modal').modal("hide");
  }

  closeSingleEmployeeDetailsModel(){
    $('#single_Employee_Details_modal').modal("hide");
  }

  //Productivity - project, normal and activity task com fun
  employeeProdTaskModel(empData, type){
    this.tempEmpNameCommon = empData.full_name
    let sendObj = {
      empName: empData.full_name,
      fromDate: this.isWorkForceLeader ? this.fromDate : this.dateStart,
      toDate: this.isWorkForceLeader ? this.toDate : this.dateEnd
    }
    if(type === 'projectTask'){
      this.financeService.ProjectTaskDetailsbyEmp(sendObj).subscribe((data: any)=>{
        this.empProjectTaskListing = data
        $('#employee_Prod_task_modal').modal("show");
        this.empProjectTaskdiv = true;
        this.empProjectTaskCompdiv = false;
      });
    }else if(type === 'otherTask'){
      this.normaltaskListing(sendObj);
    }else if(type === 'activityTask'){
      this.activityTaskListing(sendObj);
    }else if(type === 'projectTaskComp'){
      this.financeService.ProjectCompletedDetailsByEmp(sendObj).subscribe((data: any)=>{
        data.map((elm) => {
          var budgetmainHr = elm.budgetedHours;
          var tillDateHr = elm.workedHours;
          var checkBudgetmainHr = budgetmainHr.includes(".");
          var formatBudgetHr =  checkBudgetmainHr ? budgetmainHr.replace('.', ':') : budgetmainHr+':00'
          budgetmainHr = formatBudgetHr.split(':');
          budgetmainHr[0] = Number(budgetmainHr[0]) <= 9 ? (budgetmainHr[0] == 0 ? '00' : '0'+budgetmainHr[0]) : budgetmainHr[0]
          elm.budgetedHours = budgetmainHr.join(':')
          tillDateHr =  tillDateHr.split(':');
          let budgetedHours = parseInt(budgetmainHr[0] * 3600 + budgetmainHr[1] * 60 + budgetmainHr[0]);
          let hoursTillDate = parseInt(tillDateHr[0] * 3600 + tillDateHr[1] * 60 + tillDateHr[0]);
          if(budgetedHours > hoursTillDate){
            elm.Preformance = true
          }else{
            elm.Preformance = false
          }
        });
        this.empProjectTaskCompListing = data;
        $('#employee_Prod_task_modal').modal("show");
        this.empProjectTaskdiv = false;
        this.empProjectTaskCompdiv = true;
      });
    }
  }

  closeEmployeeProdTaskDetailsModel(type){
    if(type === 'normal'){
      $('#employee_Normal_task_modal').modal('hide');
      this.empNormalTaskConsolidationListingDiv = false;
      this.empNormalTaskRemarkList = false;
    }else if(type === 'project'){
      $('#employee_Prod_task_modal').modal('hide');
      this.empProjectTaskdiv = false;
      this.empProjectTaskCompdiv = false;
      this.empProTaskempProTaskConListingdiv = false;
      this.empProjectTaskTimelineListingShow = false;
      this.empProjectTaskRemarkList = false;
    }else if(type === 'activity'){
      $('#employee_Activity_task_modal').modal('hide');
    }
    this.consolidationCheckValue = false;
  }
  //Productivity - project, normal and activity task com fun

  //project task com fun
  checkConsolidation(e){
    this.spinner.show();
    this.empProjectTaskListing = [];
    let sendObj = {
      empName: this.tempEmpNameCommon,
      fromDate: this.isWorkForceLeader ? this.fromDate : this.dateStart,
      toDate: this.isWorkForceLeader ? this.toDate : this.dateEnd
    }
    if(e.checked){
      this.financeService.GetGroupedPrjtTskbyEmpId(sendObj).subscribe((data: any) => {
        data.map((elm) => {
          elm.StartTime = elm.startTime
          elm.EndTime = elm.endTime
          elm.ProjectName = elm.projectName
          elm.TaskName = elm.taskName
          elm.StatusName = elm.status
          elm.TotalHrs = elm.tasks_hours
          elm.hoursTillDate = elm.hours_tillDate
          elm.budgetedHours = elm.budgeted_hours
          elm.Remarks = elm.remarks === '' || elm.remarks === null ? [''] : elm.remarks.split(', ')
          /* if(elm.StatusName === 'Completed'){ */
            var budgetmainHr = elm.budgetedHours;
            var tillDateHr = elm.hoursTillDate;
            var checkBudgetmainHr = budgetmainHr.includes(".");
            var formatBudgetHr =  checkBudgetmainHr ? budgetmainHr.replace('.', ':') : budgetmainHr+':00'
            budgetmainHr = formatBudgetHr.split(':');
            budgetmainHr[0] = Number(budgetmainHr[0]) <= 9 ? (budgetmainHr[0] == 0 ? '00' : '0'+budgetmainHr[0]) : budgetmainHr[0]
            elm.budgetedHours = budgetmainHr.join(':')
            tillDateHr =  tillDateHr.split(':');
            let budgetedHours = parseInt(budgetmainHr[0] * 3600 + budgetmainHr[1] * 60 + budgetmainHr[0]);
            let hoursTillDate = parseInt(tillDateHr[0] * 3600 + tillDateHr[1] * 60 + tillDateHr[0]);
            if(budgetedHours > hoursTillDate){
              elm.Preformance = true
            }else{
              elm.Preformance = false
            }
          /* }else{
            var budgetmainHr = elm.budgetedHours;
            var checkBudgetmainHr = budgetmainHr.includes(".");
            var formatBudgetHr =  checkBudgetmainHr ? budgetmainHr.replace('.', ':') : budgetmainHr+':00'
            budgetmainHr = formatBudgetHr.split(':');
            budgetmainHr[0] = Number(budgetmainHr[0]) <= 9 ? (budgetmainHr[0] == 0 ? '00' : '0'+budgetmainHr[0]) : budgetmainHr[0]
            elm.budgetedHours = budgetmainHr.join(':');
          } */
        });
        this.empProjectTaskConsolidationListing = data;
        this.empProjectTaskdiv = false;
        this.empProTaskempProTaskConListingdiv = true;
        this.spinner.hide()
      });
    }else{
      this.empProjEstTaskListing();
    }
  }

  empProjEstTaskListing(){
    let sendObj = {
      empName: this.tempEmpNameCommon,
      fromDate: this.isWorkForceLeader ? this.fromDate : this.dateStart,
      toDate: this.isWorkForceLeader ? this.toDate : this.dateEnd
    }
    this.financeService.ProjectTaskDetailsbyEmp(sendObj).subscribe((data: any)=>{
      this.empProjectTaskListing = data
      $('#employee_Prod_task_modal').modal("show");
      this.empProjectTaskdiv = true;
      this.empProjectTaskCompdiv = false;
      this.empProTaskempProTaskConListingdiv = false;
    });
    this.spinner.hide();
  }

  viewTimeline(taskData){
    let sendObj = {
      empName: this.tempEmpNameCommon,
      fromDate: this.isWorkForceLeader ? this.fromDate : this.dateStart,
      toDate: this.isWorkForceLeader ? this.toDate : this.dateEnd
    }
    this.financeService.ProjectTaskDetailsbyEmp(sendObj).subscribe((data: any)=>{
      let result = [];
      data.map((elm) => {
        if(elm.TaskId === taskData.TaskId){
          result.push(elm);
        }
      });
      this.empProjectTaskTimelineListing = result;
      this.empProjectTaskTimelineListingShow = true;
      this.empProTaskempProTaskConListingdiv = false;
      this.empProjectTaskdiv = false;
    });
  }

  viewRemarkForTask(data){
    this.empProjectTaskRemarkList = true;
    this.empProTaskempProTaskConListingdiv = false;
    this.empProjectTaskRemarkData = data;
  }

  blacktoEmpProjectTaskListing(text){
    if(text === 'timeLineList'){
      this.empProjectTaskTimelineListingShow = false;
      this.empProjectTaskdiv = true;
      this.consolidationCheckValue = false;
    }else{
      this.consolidationCheckValue = true;
      this.empProjectTaskRemarkList = false;
      this.empProTaskempProTaskConListingdiv = true;
    }
  }
  //project task com fun

  //normal task com fun
  normaltaskListing(sendObj){
    this.financeService.NormalTaskDetailsbyEmp(sendObj).subscribe((data: any)=>{
      this.empNormalTaskListing = data
      $('#employee_Normal_task_modal').modal("show");
      this.empNormalTaskConsolidationListingDiv = false;
      this.spinner.hide();
    });
  }

  checkConsolidationNT(e){
    this.spinner.show();
    this.empProjectTaskListing = [];
    let sendObj = {
      empName: this.tempEmpNameCommon,
      fromDate: this.isWorkForceLeader ? this.fromDate : this.dateStart,
      toDate: this.isWorkForceLeader ? this.toDate : this.dateEnd
    }
    if(e.checked){
      this.financeService.GetGroupedNrmlTskbyEmpId(sendObj).subscribe((data: any) => {
        data.map((elm) => {
          elm.remarks = elm.remarks === '' || elm.remarks === null ? [''] : elm.remarks.split(', ')
        })
        this.empNormalTaskConsolidationListing = data;
        this.empNormalTaskConsolidationListingDiv = true;
        this.spinner.hide();
      });
    }else{
      this.normaltaskListing(sendObj);
    }
  }

  viewRemarkForNormalTask(data){
    this.empNormalTaskRemarkList = true;
    this.empNormalTaskConsolidationListingDiv = false;
    this.empNormalTaskRemarkData = data;
  }

  blacktoEmpNormalTaskListing(){
    this.empNormalTaskRemarkList = false;
    this.empNormalTaskConsolidationListingDiv = true;
  }
  //normal task com fun

  //activity task com fun
  activityTaskListing(sendObj){
    this.financeService.ActivityTaskDetailsbyEmp(sendObj).subscribe((data: any)=>{
      this.empActivityTaskListing = data
      $('#employee_Activity_task_modal').modal("show");
    });
  }
  //activity task com fun




  //table search function
  employeeGridSearch(): void {
  document.getElementById(this.employeeGrid.element.id + "_searchbar").addEventListener('keyup', () => {
    this.employeeGrid.search((event.target as HTMLInputElement).value)
  });
  }

  basedOnEmployeeGridSearch(): void {
    document.getElementById(this.basedOnEmployeeGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.basedOnEmployeeGrid.search((event.target as HTMLInputElement).value)
    });
  }

  basedOnProjectGridSearch(): void {
    document.getElementById(this.basedOnProjectGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.basedOnProjectGrid.search((event.target as HTMLInputElement).value)
    });
  }

  employeeSummaryGridSearch(): void {
    document.getElementById(this.employeeSummaryGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.employeeSummaryGrid.search((event.target as HTMLInputElement).value)
    });
  }

  projectGridSearch(): void {
  document.getElementById(this.projectGrid.element.id + "_searchbar").addEventListener('keyup', () => {
    this.projectGrid.search((event.target as HTMLInputElement).value)
  });
  }

  projectInvoicingGridSearch(): void {
  document.getElementById(this.projectInvoicingGrid.element.id + "_searchbar").addEventListener('keyup', () => {
    this.projectInvoicingGrid.search((event.target as HTMLInputElement).value)
  });
  }

  employeeGridModelSearch(): void {
  document.getElementById(this.employeeGridModel.element.id + "_searchbar").addEventListener('keyup', () => {
    this.employeeGridModel.search((event.target as HTMLInputElement).value)
  });
  }

  projectGridModelSearch(): void {
  document.getElementById(this.projectGridModel.element.id + "_searchbar").addEventListener('keyup', () => {
    this.projectGridModel.search((event.target as HTMLInputElement).value)
  });
  }

  openProjectGridModelSearch(): void {
  document.getElementById(this.openProjectGridModel.element.id + "_searchbar").addEventListener('keyup', () => {
    this.openProjectGridModel.search((event.target as HTMLInputElement).value)
  });
  }

  empProductivityGridSearch(): void {
  document.getElementById(this.empProductivityTable.element.id + "_searchbar").addEventListener('keyup', () => {
    this.empProductivityTable.search((event.target as HTMLInputElement).value)
  });
  }

  employeeGridProdListModelSearch(): void {
  document.getElementById(this.employeeProdGridListingModel.element.id + "_searchbar").addEventListener('keyup', () => {
    this.employeeProdGridListingModel.search((event.target as HTMLInputElement).value)
  });
  }

  projectEmpAllTaskTableListSearch(): void {
    document.getElementById(this.projectEmpAllTaskTableList.element.id + "_searchbar").addEventListener('keyup', () => {
      this.projectEmpAllTaskTableList.search((event.target as HTMLInputElement).value)
    });
  }

  projectOverallStatusGridSearch(): void {
    document.getElementById(this.projectStatusOverallTable.element.id + "_searchbar").addEventListener('keyup', () => {
      this.projectStatusOverallTable.search((event.target as HTMLInputElement).value)
    });
    }

  projectEmpCompTaskTableListSearch(): void {
    document.getElementById(this.projectEmpCompTaskTableList.element.id + "_searchbar").addEventListener('keyup', () => {
      this.projectEmpCompTaskTableList.search((event.target as HTMLInputElement).value)
    });
  }

  normalEmpAllTaskTableListSearch(): void {
    document.getElementById(this.normalEmpAllTaskTableList.element.id + "_searchbar").addEventListener('keyup', () => {
      this.normalEmpAllTaskTableList.search((event.target as HTMLInputElement).value)
    });
  }

  activityEmpAllTaskTableListSearch(): void {
    document.getElementById(this.activityEmpAllTaskTableList.element.id + "_searchbar").addEventListener('keyup', () => {
      this.activityEmpAllTaskTableList.search((event.target as HTMLInputElement).value)
    });
  }


  changeDisplayMethod(e) {
    //console.log('e--->',e);

    let startTime = this.dateRngForm.get('dtrnge').value;

    if(e.srcElement.checked) {

      this.activeProject = false;
      if(startTime[0] === this.lastAllMonth) {

          this.noActiveProjectByRange(this.lastAllMonth,startTime[1]);

       // this.projectStatusText = "Displaying Overall Active Projects"
      } else {
        console.log("CALL ACTIVE PRO")
        this.noActiveProjectByRange(startTime[0],startTime[1]);
       // this.projectStatusText = "Displaying  Active Projects from " + moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');
      }


    } else {

      this.activeProject = true;
      if(startTime[0] === this.lastAllMonth) {
        // this.projectStatusText = "Displaying Overall
        this.GetProjectStatusMilestoneData();
       //this.G();
       } else {
        console.log("CALL INACTIVE")
         this.activeProjectsByRange(startTime[0],startTime[1]);
        // this.projectStatusText = "Displaying  Active Projects from " + moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');
       }
    }

  }





  // onActivityDone(e) {

  //   if(e.srcElement.checked) {
  //     this.lstMnthAct = true;
  //     this.checkForOverAllStatusData = true;
  //     let toDate = moment().format('L');
  //     let strDate = moment(toDate).subtract(30, 'days').format('L');
  //     let reqBody = {
  //       id: localStorage.getItem('org_id'),
  //       fromDate: strDate,
  //       toDate: toDate
  //     };


  //     this.financeService.GetProjectwithMilestoneData(reqBody).subscribe((data: any) => {
  //       data.map((elm) => {
  //         elm.accountsId = elm.accountsId
  //         elm.progress = parseFloat(elm.progress);
  //         elm.projectMilestoneData.map((el) => {
  //           if(el.projectMilestoneProperties.length > 0) {
  //             el.projectMilestoneProperties[0].ratio = parseInt(el.projectMilestoneProperties[0].ratio)
  //           }
  //           if(el.projectMilestonePropertieswithDate.length > 0) {
  //             el.projectMilestonePropertieswithDate[0].ratio = parseInt(el.projectMilestonePropertieswithDate[0].ratio)
  //           }
  //           let one = el.projectMilestoneProperties.length !== 0 ? parseInt(el.projectMilestoneProperties[0].ratio) : 0;
  //           let two = el.projectMilestonePropertieswithDate.length !== 0 ? parseInt(el.projectMilestonePropertieswithDate[0].ratio) : 0;
  //           el['TotalRatio'] = one + two >= 99 ? 100 : one + two
  //         });
  //         elm['totalTimeProcess'] = parseFloat(((parseFloat(elm.budgeted_hours) - parseFloat(elm.actual_hours.replace(':', '.')))/parseFloat(elm.budgeted_hours) * 100).toFixed(2));
  //         elm['progressByBudgeted_tilldate'] = parseFloat(((parseFloat(elm.budgeted_mins_tillDate)/parseFloat(elm.budgeted_hours)) * 100).toFixed(2));
  //       });
  //       this.callReverseOpnFun(data)
  //     });



  //   } else {
  //     this.lstMnthAct = false
  //     this.GetProjectStatusMilestoneData();

  //   }

  // }

  activeProjectsByRange(startDate,endDate) {
    this.checkForOverAllStatusData = true;

    let reqBody = {
      id: localStorage.getItem('org_id'),
      fromDate: moment(startDate).format('L'),
      toDate: moment(endDate).format('L'),
    };

    this.financeService.GetProjectwithMilestoneData(reqBody).subscribe((data: any) => {
      data.map((elm) => {
        elm.accountsId = elm.accountsId
        elm.progress = parseFloat(elm.progress);
        elm.projectMilestoneData.map((el) => {
          if(el.projectMilestoneProperties.length > 0) {
            el.projectMilestoneProperties[0].ratio = parseInt(el.projectMilestoneProperties[0].ratio)
          }
          if(el.projectMilestonePropertieswithDate.length > 0) {
            el.projectMilestonePropertieswithDate[0].ratio = parseInt(el.projectMilestonePropertieswithDate[0].ratio)
          }
          let one = el.projectMilestoneProperties.length !== 0 ? parseInt(el.projectMilestoneProperties[0].ratio) : 0;
          let two = el.projectMilestonePropertieswithDate.length !== 0 ? parseInt(el.projectMilestonePropertieswithDate[0].ratio) : 0;
          el['TotalRatio'] = one + two >= 99.50 ? 100 : one + two
        });
        elm['totalTimeProcess'] = parseFloat(((parseFloat(elm.budgeted_hours) - parseFloat(elm.actual_hours.replace(':', '.')))/parseFloat(elm.budgeted_hours) * 100).toFixed(2));
        elm['progressByBudgeted_tilldate'] = parseFloat(((parseFloat(elm.budgeted_mins_tillDate)/parseFloat(elm.budgeted_hours)) * 100).toFixed(2));
      });
      data = data.filter((el) => el.progress != 100);
      this.callReverseOpnFun(data)
    });



  }

  noActiveProjectByRange(startDate,endDate) {
    this.checkForOverAllStatusData = true;
    let reqBody = {
      id: localStorage.getItem('org_id'),
      fromDate: startDate,
      toDate: endDate
    };


    this.financeService.GetMilestonDataNoActivities(reqBody).subscribe((data: any) => {
      data.map((elm) => {
        elm.accountsId = elm.accountsId
        elm.progress = parseFloat(elm.progress) > 0 ?  parseFloat(elm.progress) : 0;
        elm.projectMilestoneData.map((el) => {
          if(el.projectMilestoneProperties.length > 0) {
            el.projectMilestoneProperties[0].ratio = parseInt(el.projectMilestoneProperties[0].ratio)
          }
          if(el.projectMilestonePropertieswithDate.length > 0) {
            el.projectMilestonePropertieswithDate[0].ratio = parseInt(el.projectMilestonePropertieswithDate[0].ratio)
          }
          let one = el.projectMilestoneProperties.length !== 0 ? parseInt(el.projectMilestoneProperties[0].ratio) : 0;
          let two = el.projectMilestonePropertieswithDate.length !== 0 ? parseInt(el.projectMilestonePropertieswithDate[0].ratio) : 0;
          el['TotalRatio'] = one + two >= 99.50 ? 100 : one + two
        });
        elm['totalTimeProcess'] = parseFloat(((parseFloat(elm.budgeted_hours) - parseFloat(elm.actual_hours.replace(':', '.')))/parseFloat(elm.budgeted_hours) * 100).toFixed(2));
        elm['progressByBudgeted_tilldate'] = 0;
      });

      console.log("data-->",data);

      data = data.filter((el) => el.progress == 0);
      console.log("data-->",data);
      this.callReverseOpnFun(data)
    });
  }





  onNoActivityDone(e) {
    if(e.srcElement.checked) {
      this.noLstMnthAct = true;
      // Call the GetProjectMilestoneData with the Current day to the last 30Days
      this.checkForOverAllStatusData = true;
      let toDate = moment().format('L');
      let strDate = moment(toDate).subtract(30, 'days').format('L');
      let reqBody = {
        id: localStorage.getItem('org_id'),
        fromDate: strDate,
        toDate: toDate
      };


      this.financeService.GetMilestonDataNoActivities(reqBody).subscribe((data: any) => {
        data.map((elm) => {
          elm.accountsId = elm.accountsId
          elm.progress = parseFloat(elm.progress) > 0 ?  parseFloat(elm.progress) : 0;
          elm.projectMilestoneData.map((el) => {
            if(el.projectMilestoneProperties.length > 0) {
              el.projectMilestoneProperties[0].ratio = parseInt(el.projectMilestoneProperties[0].ratio)
            }
            if(el.projectMilestonePropertieswithDate.length > 0) {
              el.projectMilestonePropertieswithDate[0].ratio = parseInt(el.projectMilestonePropertieswithDate[0].ratio)
            }
            let one = el.projectMilestoneProperties.length !== 0 ? parseInt(el.projectMilestoneProperties[0].ratio) : 0;
            let two = el.projectMilestonePropertieswithDate.length !== 0 ? parseInt(el.projectMilestonePropertieswithDate[0].ratio) : 0;
            el['TotalRatio'] = one + two >= 99.50 ? 100 : one + two
          });
          elm['totalTimeProcess'] = parseFloat(((parseFloat(elm.budgeted_hours) - parseFloat(elm.actual_hours.replace(':', '.')))/parseFloat(elm.budgeted_hours) * 100).toFixed(2));
          elm['progressByBudgeted_tilldate'] = 0;
        });

        console.log("data-->",data);

        data = data.filter((el) => el.budgeted_mins_tillDate === "0.00");
        console.log("data-->",data);
        this.callReverseOpnFun(data)
      });




    } else {
      this.noLstMnthAct = false
      this.GetProjectStatusMilestoneData();
    }
  }





  ProjectDetailsClick(args: ClickEventArgs): void {
    switch (args.item.text) {
      case 'PDF Export':
          this.openProjectGridModel.pdfExport();
          break;
      case 'Excel Export':
          this.openProjectGridModel.excelExport();
          break;
      case 'CSV Export':
          this.openProjectGridModel.csvExport();
      break;
    }
  }

  ProductivityDetailsCick(args: ClickEventArgs): void {

    switch (args.item.text) {
      case 'PDF Export':
          this.empProductivityTable.pdfExport();
          break;
      case 'Excel Export':
          this.empProductivityTable.excelExport();
          break;
      case 'CSV Export':
          this.empProductivityTable.csvExport();
      break;
    }
  }


  //employeeTaskModel start
  employeeDetailsModel(empData){
    let orgID = localStorage.getItem('org_id');
    let sendObj = {
      orgID,
      fromDate: this.isWorkForceLeader ? this.fromDate : this.dateStart,
      toDate: this.isWorkForceLeader ? this.toDate : this.dateEnd,
      projectname: empData.project_name,
      empId: empData.employee_id
    }
    this.financeService.GetAllTaskDetailsEmployeeByID(sendObj).subscribe((data: any)=>{
      this.getEmployeeData = data.map((elm) => {
        elm.budgeted_hours = Number(elm.budgeted_hours);
        elm.actual_hours = Number(elm.actual_hours.replace(':', '.'));
        return elm;
      });
      this.getEmployeeTaskCount = this.getEmployeeData.length;
      this.getEmployeeName = empData.full_name;

      $('#employee_task_modal').modal("show");
    });
  }

  closeProjectInvoicingDetailsModel(){
    $('#project_invoicing_modal').modal('hide');
  }

  public closeEmployeeDetailsModel(){
    $('#employee_task_modal').modal('hide');
    this.employeeGridModel.searchSettings.key = '';
  }
  //employeeTaskModel end



  //projectTaskModel start
  public projectDetailsModel(proData){
    let orgID = localStorage.getItem('org_id');
    let sendObj = {
      orgID,
      fromDate: this.isWorkForceLeader ? this.fromDate : this.dateStart,
      toDate: this.isWorkForceLeader ? this.toDate : this.dateEnd,
      projectname: proData.project_id
    }
    this.financeService.GetAllTaskDetailsProjectValueByOrgID(sendObj).subscribe((data)=>{
      this.getProjectData = data;
      this.getProjectTaskCount = this.getProjectData.length;
      this.getProjectName = proData.project_name;
      $('#project_task_modal').modal("show");
   });
  }

  public closeProjectDetailsModel(){
    $('#project_task_modal').modal('hide');
    this.projectGridModel.searchSettings.key = '';
  }
  //projectTaskModel end

  OpenProjectsModel(type,data){
    $('#open_project_modal').modal('show');
    this.openProjectsModelHeader = type
    this.openProjectInnerData = data.map((elm) => {
      elm.created_date = elm.created_date
      elm.budgeted_hours_value = Number(elm.budgeted_hours_value);
      elm.budgeted_hours = Number(elm.budgeted_hours);
      elm.task_count = Number(elm.task_count);
      return elm;
    });
  }

  closeOpenProjectModel(){
    $('#open_project_modal').modal('hide');
    this.openProjectInnerData = ''
  }

  employeeGridDownload(args: ClickEventArgs){
    switch (args.item.text) {
      case 'PDF Export':
          this.employeeGrid.pdfExport();
          break;
      case 'Excel Export':
          this.employeeGrid.excelExport();
          break;
      case 'CSV Export':
          this.employeeGrid.csvExport();
      break;
    }
  }

  employeeSummaryGridDownload(args: ClickEventArgs){
    switch (args.item.text) {
      case 'PDF Export':
          this.employeeSummaryGrid.pdfExport();
          break;
      case 'Excel Export':
          this.employeeSummaryGrid.excelExport();
          break;
      case 'CSV Export':
          this.employeeSummaryGrid.csvExport();
      break;
    }
  }

  projectGridDownload(args: ClickEventArgs){
    switch (args.item.text) {
      case 'PDF Export':
          this.projectGrid.pdfExport();
          break;
      case 'Excel Export':
          this.projectGrid.excelExport();
          break;
      case 'CSV Export':
          this.projectGrid.csvExport();
      break;
    }
  }

}
