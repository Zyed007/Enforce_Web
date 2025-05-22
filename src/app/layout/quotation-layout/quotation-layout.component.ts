import { Component, OnInit, NgZone, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import moment = require('moment');
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource } from '@angular/material';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import { GoogleMap } from '@agm/core/services/google-maps-types';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { SubscriptionService } from '../../services/subscription.service';
import { DataManager } from '@syncfusion/ej2-data';
import * as _ from "lodash";
import { costEstimationService } from '../../services/costEstimation.service';
import {
  GridComponent, ToolbarService, PageService, ExcelExportService, PdfExportService,
  GroupService
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-navigations'
import { NgxSpinnerService } from 'ngx-spinner';
import { CountryService } from '../../services/countryList.service';
import { AfterViewInit, Inject } from '@angular/core';
import { Ajax } from '@syncfusion/ej2-base';
import { ExpandEventArgs, Accordion } from '@syncfusion/ej2-navigations';
import { AccordionComponent } from '@syncfusion/ej2-angular-navigations';
import { CostService } from '../../services/cost.service';
import { LeadService } from '../../services/lead.service';
import { patternValidator } from '../../shared/services';
import { QuotationService } from '../../services/quotation.service';
import { CheckBoxSelectionService } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
import {
  NotificationComponent,
} from './components';
import { UserService } from '../../services/user.service';
import { HistoryService } from '../../services/history.service';
import { Thickness } from '@syncfusion/ej2-angular-charts';
let date = moment(new Date()).format('L');
let formattedPrefix = moment(date).format('YY/MM/DD');
declare var $: any;
let brList=[];

@Component({
  selector: 'app-quotation-layout',
  templateUrl: './quotation-layout.component.html',
  styleUrls: ['./quotation-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CheckBoxSelectionService]
})

export class QuotationLayoutComponent implements OnInit {
  projectForm: FormGroup;
  prefixValue: any;

  projectExtensionData;
  setExtensionPrefix;

  @ViewChild('taskCloseBtn',{static:false}) taskCloseBtn: ElementRef;
  @ViewChild('meetCloseBtn',{static:false}) meetCloseBtn: ElementRef;
  @ViewChild('callCloseBtn',{static:false}) callCloseBtn: ElementRef;
  @ViewChild('closeActBtn',{static:false}) closeActBtn: ElementRef;
  @ViewChild('estCloseBtn',{static:false}) estCloseBtn: ElementRef;
  @ViewChild('contactCloseBtn',{static:false}) contactCloseBtn: ElementRef;

  public currentVal=moment().add(1,'minutes').format('hh:mm a')
   public currentTime=moment().add(1,'minutes').format('hh:mm a')
  relationData=[{
    id:'',
    text:'Select'
  },{
    id:'1',
    text:'Owner'
  },{
    id:'2',
    text:'Consultant'
  },{
    id:'3',
    text:'Personal Advisor'
  },{
    id:'4',
    text:'Office Manager'
  }
  ]

  historyData;
  noHistoryDataDiv;
  historyDataDiv;

  dynamicMileStoneData;

  commonFields: Object = { text: "value", value: "id" };

  triggerData = [
    {
      id:'Upon Signing contract',
      value:'Upon Signing contract',
    },
    {
      id:'Upon completing',
      value:'Upon completing'
    }
  ];

  paymentPolicyTemplateDropDown = []

  //payemnt variables

  userInfo:any = JSON.parse(localStorage.getItem('user_info'));
  paymentMethodologyForm = {} as FormGroup;
  paymentTemplateForm: FormGroup
  isValidFormSubmitted: boolean | null = null;
  showPercentageError = false;
  totalProjPercent;
  totalProjValue;
  paymentPolicyTemplateData;
  showPaymentTemplate = false;
  oldProjectPaymentData;
  paymentNameMethodologyForm: FormGroup

  saveTemplatePaymentMethodologyFormValue;
  //payemnt variables

  public prefixString = 'CST/' + formattedPrefix;
  public tagsArrayValue=[];
  public taskOptions: Select2Options;
  public projectNames = [
    {display: 'projName1', value: 1,email:'asda'},
    {display: 'projName2', value: 2,email:'adsdsda'},
    {display: 'projName3', value: 3,email:'sdasda'},
  ];
  public vegetableData: { [key: string]: Object }[] = [
    { vegetable: 'Cabbage', category: 'Leafy and Salad', id: 'item1' },
    { vegetable: 'Spinach', category: 'Leafy and Salad', id: 'item2' },
    { vegetable: 'Wheat grass', category: 'Leafy and Salad', id: 'item3' },
    { vegetable: 'Yarrow', category: 'Leafy and Salad', id: 'item4' },
    { vegetable: 'Pumpkins', category: 'Leafy and Salad', id: 'item5' },
    { vegetable: 'Chickpea', category: 'Beans', id: 'item6' },
    { vegetable: 'Green bean', category: 'Beans', id: 'item7' },
    { vegetable: 'Horse gram', category: 'Beans', id: 'item8' },
    { vegetable: 'Garlic', category: 'Bulb and Stem', id: 'item9' },
    { vegetable: 'Nopal', category: 'Bulb and Stem', id: 'item10' },
    { vegetable: 'Onion', category: 'Bulb and Stem', id: 'item11' }
];
public vegetables: { [key: string]: Object }[] = [
  { "Vegetable": "Cabbage", "Category": "Leafy and Salad", "Id": "item1" },
  { "Vegetable": "Chickpea", "Category": "Beans", "Id": "item2" },
  { "Vegetable": "Garlic", "Category": "Bulb and Stem", "Id": "item3" },
  { "Vegetable": "Green bean", "Category": "Beans", "Id": "item4" },
  { "Vegetable": "Horse gram", "Category": "Beans", "Id": "item5" },
  { "Vegetable": "Nopal", "Category": "Bulb and Stem", "Id": "item6" },
  { "Vegetable": "Onion", "Category": "Bulb and Stem", "Id": "item7" },
  { "Vegetable": "Pumpkins", "Category": "Leafy and Salad", "Id": "item8" },
  { "Vegetable": "Spinach", "Category": "Leafy and Salad", "Id": "item9" },
  { "Vegetable": "Wheat grass", "Category": "Leafy and Salad", "Id": "item10" },
  { "Vegetable": "Yarrow", "Category": "Leafy and Salad", "Id": "item11" }
];
// map the groupBy field with category column
public fields: Object = { groupBy: 'category', text: 'text', value: 'id' };
// Set the popup list height
public height: string = '200px';
// set the placeholder to the MultiSelect input
public placeholder: string = 'Select participants';
public checkFields: Object = { groupBy: 'Category', text: 'Vegetable', value: 'Id' };
// set the placeholder to the MultiSelect input
public checkWaterMark: string = 'Select vegetables';
// set enableGroupCheckBox value to the Multiselect input
public enableGroupCheckBox: boolean = true;
// set mode value to the multiselect input
public mode: string = 'CheckBox';
// set filterBarPlaceholder value to the Multiselect input
public filterBarPlaceholder: string = 'Search Vegetables'

  pageSize: any = 10;
  currentPage: any = 1;
  pgData=[];
  data12: Object[];
  showPrefixText: boolean = false;
  customPrefix: any;
  project_prefix_val: any;
  projectTypeData: { id: string; text: string; }[];
  projTypeVal: any;
  public showTaskList = true;
  public selectedISO = CountryISO.UnitedArabEmirates;
  public box : string = 'Box';
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  today=new Date();

  phoneInvalid: boolean=false;
  phoneErrorMsg: any;
  phoneNumberValue: string='';
  @ViewChild('accordion',{static:true}) accordion: AccordionComponent;
  @ViewChild('notify',{static:true}) updateTask: NotificationComponent;
  public designTypeData = [
  ]
  public typeOfUnit = [{
    "id": '1',
    "text": 'Select'
  }, {
    "id": '2',
    "text": 'Hours'
  }]
  public packageTypeData =[{
    "id": '',
    "text": 'Select'
  },{
    "id": '1',
    "text": 'Package 1'
  }, {
    "id": '2',
    "text": 'Package 2'
  }]
  warrantyData =[{
    "id": '',
    "text": 'Select'
  },{
    "id": '1',
    "text": 'One year against any manufacturing faults'
  }]
  paymentData=[{
    "id": '',
    "text": 'Select'
  },{
    "id": '1',
    "text": 'To be decided on approval'
  }]
  paymentMode=[{
    "id": '',
    "text": 'Select'
  },{
    "id": '1',
    "text": 'Cash'
  },{
    "id": '2',
    "text": 'Cheque'
  }]
  paymentModeType=[{
    "id": '',
    "text": 'Select'
  },{
    "id": '1',
    "text": 'PDC'
  },{
    "id": '2',
    "text": 'CDC'
  }]
  exclusionData=[{
    "id": '',
    "text": 'Select'
  },{
    "id": '1',
    "text": 'Civil Electrical & Carpentry Works'
  }]
  taxData=[{
    "id": '',
    "text": 'Select'
  },{
    "id": '1',
    "text": 'Service Tax'
  }]
  stageData=[{
    "id": '',
    "text": 'Select'
  },
  { id: 1, text: 'Qualification' },
  { id: 2, text: 'Needs Analysis' },
  { id: 3, text: 'Value Proposition' },
  { id: 4, text: 'Closed Lost' },
  { id: 5, text: 'Closed Lost to Competition' }]

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
  statusForm: FormGroup;
  unitTypeVal: any;
  unitTypetxt: any;
  extraUnitData: any[];
  extraUnitForm: FormGroup;
  checkRetType = false;
  public pkgTypeVal;
  public typeOfTask = []
  countryData: { id: string; text: string; }[];
  countryValue: any;
  countryValueTxt: any;
  emailForm: FormGroup;
  designTypeForm: FormGroup;
  projTypeForm: FormGroup;
  desgnTypeVal = '';
  projectUnitArray: any[];
  editTaskId: any;
  ejsDesignTypeData: any[];
  milestoneData: any=[];
  milestTaskForm: FormGroup;
  projCostId: any='';
  BOQvalue: boolean=false;
  siteVal: boolean=false;
  BOQChecked: any=false;
  siteChecked: any=false;
  projectStatusData: { id: string; text: string; }[];
  projStatus: any;
  submitClicked: boolean=false;
  phone: any;
  startdateValue: string;
  disableEndDate: boolean;
  startValChange: boolean;
  minEndDate: any;
  enddateValue: string;
  unitTypeData: any[];
  extraunitTypeVal: any;
  extraunitTypeData: { id: string; text: string; }[];
  extraunitTypetxt: any;
  totalHrs: number=0;
  profit_value: number;
  net_total: any;
  design_hrs: any;
  MilestHrs: any;
  perunitCostHrs=20;
  profit_margin=10;
  projcountryValue: any;
  projcountryValueTxt: any;
  verifyLoc: boolean;
  nearbyAddress="";
  nearbyPlaces: google.maps.places.PlaceResult[];
  changed_address: string;

  ProjectTotal

  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  @ViewChild('search',{ read: ElementRef , static: false })
  searchElementRef: ElementRef;
  public formatted_address;
  public lat;
  public lang;
  public street_number;
 //  public route;
  public locality;
  public administrative_area_level_2;
  public administrative_area_level_1;
  public postal_code;
  public country;
  searchLocVal: string='';

  public changed_formatted_address;
  public changed_lat;
  public changed_lang;
  public changed_street_number;
  public changed_route;
  public changed_locality;
  public changed_administrative_area_level_2;
  public changed_administrative_area_level_1;
  public changed_postal_code;
  public changed_country;
  public changedLocationData;
  public showNearbyPlaces=false;
  geoCodeData: any;
  @ViewChild(AgmMap, { static: true })
  map: GoogleMap;
  route: any;
  drag: boolean=false;
  public CURRENCY: string;
public formatRegex: string;
  vat_total: number;
  total_value: any;
  showUpdateCalculate: boolean=false;
  projTypeSubmit: boolean=false;
  allTagsIncluded: boolean=false;
  showUnitLengthErr: boolean;
  plotSqft: string='sq-ft';
  plotSqm: string='sq-m';
  showOrgDetails: boolean=false;
  industryData: { id: string; text: string; }[];
  industryValue: any='';
  addCstformSubmitted: boolean=false;
  totalCostStudy: any;
  totalCostDesign: any;
  totalCostDrawing: any;
  totalCostService: any;
  costText: boolean;
  costprojectData: { id: string; text: string; }[];
  costprojVal: any;
  warrantyVal: any='';
  paymentVal: any;
  paymentModeVal: any;
  exclusionVal: any;
  taxVal: any;
  stageVal: any;
  paymentModeTypeVal: any;
  costProjectDetails: any='';
  showBranchList: boolean;
  branchDataSource: any=[];
  showUpdateBtn: boolean=false;
  showTextArea4: boolean=false;
  primaryContact={
    name:'empty',
    email:'empty',
    phone:'empty'
      };
  tasks: { id: string; text: string; }[];
  selectedCategData: { id: string; text: string; }[];
  taskWithDesc: { id: string; text: string; additional: { assignee: string; taskDesc: string; milestone: string; dueDate: string; assigne_id: string; status_id: string; }; }[];
  contactData=[{
    "id": '1',
    "text": 'Select'
  }, {
    "id": '2',
    "text": 'Contact'
  } ,{
    "id": '3',
    "text": 'Lead'
  }]
  purposeData=[{
    "id": '1',
    "text": 'Select'
  }, {
    "id": '2',
    "text": 'None'
  } ,{
    "id": '3',
    "text": 'Administrative'
  },{
    "id": '4',
    "text": 'Negotiation'
  }]
  callResultData=[{
    "id": '1',
    "text": 'Select'
  }, {
    "id": '2',
    "text": 'None'
  } ,{
    "id": '3',
    "text": 'Interested'
  },{
    "id": '4',
    "text": 'Not Interested'
  }]
  contactVal: any;
  meetingForm: FormGroup;
  minEndTime: any;
  empData: { id: string; text: string; }[];
  empVal: any;
  startmeetTime: string;
  endmeetTime: string;
  endValChange: boolean=false;
  meetingFormSubmit: boolean=false;
  empGroup: any[];
  disableEndTime: boolean;
  notesForm: FormGroup;
  notesEditable: boolean=false;
  editnotesId: any;
  notesData: Object[];
  meetingData: Object[];
  meetingEditable: boolean;
  editMeetId: any;
  meetingToolbar: string[];
  callForm: FormGroup;
  callFormSubmit: boolean=false;
  purposeVal: any;
  purposeValTxt: any;
  callresVal: any;
  callresValTxt: any;
  entityContactData: { id: string; text: string; }[];
  entityContactVal: any;
  openActData: Object[];
  openActToolbar: string[];
  callEditable: boolean;
  editCallId: any;
  closeData: Object[];
  closeToolbar: string[];
  showValidTimeError: boolean=false;
  closeActData={
    subject:'',
    start_time:'',
    end_time:'',
    entity_type:'',
    remarks:'',
    status:'',
    activity_owner:'',
    due_date:''

  };
  callCstId='';
  closeActLog: boolean;
  customerContactForm: FormGroup;
  disableSaveBranch: boolean=true;
  cstRelationValue: string;
  cstRelationValueTxt: any;
  typeOfModal: string;
  discount_amount: any;
  showReviseBtn: boolean;
  showCostDetails: boolean;
  showConvertBtn: boolean;
  savedContactPh: boolean;
  minStartTime: string;
  project_id: any;
  modifyProjStaus: boolean=false;
  qtnPrefix: any;
  qtnCostDetails: any={
    gross_total_amount:'',
    net_total_amount:'',
    profit_margin_amount:'',
    total_amount:'',
    discount_amount:'',
    vat_amount:''
  };
  disableUpdateBtn: boolean;
  removedTaskList: any=[];
  modified_cost: any;
  modified_hrs: string;
  deletedTaskList: any=[];
  addedTaskList: any=[];
  showModifiedVal: boolean;
  stage_name: any;
  estAddntlData:any;
  isPaymentAdvance: boolean=false;
  advancePymntForm= {} as FormGroup;
  serviceTasks = [];

  prfxExists: boolean=false;
  cstmPrefix = "";
  currentPrefixFrmt:any;
  ntTxtOvr:any;
  upNextPrefix:any;


  scroll(el: HTMLElement) {
    // el.scrollIntoView();
    el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}
showRows4(){
  this.showTextArea4=true;
}
public getTimesheetByEmpId(){
  // this.teamEmpId=[];


      this.userService.GetLastTimesheetByEmpID().subscribe(
        (data:any)  => {

        if(data){
        let timeValue=''

        timeValue=moment(data.check_in).format('hh:mm a')


        //  let timeValue=''
        //  for(var i=0;i<data.length;i++){
        //    if(data[i].timesheetDataModels[0].is_checkout==false){
        //      console.log('AllTimesheet',data[i].timesheetDataModels[0].check_in)
        //      timeValue=moment(data[i].timesheetDataModels[0].check_in).format('hh:mm a')
        //      console.log('timeValue', timeValue);

        //    }
        //  }

          this.minStartTime=timeValue

   if(data.check_out!=null){
    this.currentVal=moment(data.check_out).format('hh:mm a')
   }else{
    this.currentVal=moment().format('hh:mm a')

   }



                }



        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(

            (result)=> {


            })


        }

        )
      ;


   }

public GetAllTaskByEmpID(){
  this.taskService.GetAllTaskByEmpID().subscribe(
    (data:any)  => {
      let completedTasks=[]
      let openTasks=[]
      let inProgrssTasks=[]

      var results=[{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
      //
      if(data){
        for (var i = 0; i < data.employeeTasks.length; i++) {
          // logik to create new items
          results.push({

            "id": data.employeeTasks[i].id,
            "text": data.employeeTasks[i].task_name
        });
          if(data.employeeTasks[i].status_name=="Completed"){
            completedTasks.push(data.employeeTasks[i]);
          }
          else if(data.employeeTasks[i].status_name=="Open"){
            openTasks.push(data.employeeTasks[i]);
          }else{
            inProgrssTasks.push(data.employeeTasks[i]);
           }

      }

    //   this.taskCompletedList=completedTasks;
    //   this.taskOpenList=openTasks;
    //   this.taskInProgressList=inProgrssTasks;
    //  this.tasksList=results;
    //  this.employeeTasksList=data['employeeTasks'];
    //  this.assignedToList=data['assignedEmployeeTasks'];
    //  this.overDueList=data['overDueTasks'];
    }


     var results=[{ id: '', text: 'Select' }]
   if(data){
    for (var i = 0; i < data.length; i++) {
      // logik to create new items

      results.push({
         "id": data[i].id,
         "text": data[i].task_name
      });

      }
   }

this.tasks=results;
this.selectedCategData=results;

     var taskwithDesc=[{ id: '', text: 'Select',additional:{assignee:'',taskDesc:'',milestone:'',dueDate:'',assigne_id:'',status_id:''} }]

     if(data){
      for (var i = 0; i < data.employeeTasks.length; i++) {
        // logik to create new items

        taskwithDesc.push({
           "id": data.employeeTasks[i].id,
           "text": data.employeeTasks[i].task_name,
           additional:{
             assignee:data.employeeTasks[i].assigned_to_name,
             taskDesc:data.employeeTasks[i].project_name,
             milestone:data.employeeTasks[i].milestone_name,
             dueDate:data.employeeTasks[i].due_date,
             assigne_id:data.employeeTasks[i].assigned_to,
             status_id:data.employeeTasks[i].status_id
            }

        });

        }
        this.taskWithDesc=taskwithDesc;

     }

    }


    )
}

ViewEst(){
  $("#est_modal").modal('show');

}
OnLeaveClose(){
  $("#est_modal").modal('hide');
  this.estCloseBtn.nativeElement.click();

}
  public getCountryList() {
    // this.countryData = []
    // this.countryValue=''

    return this.countries.getCountryList().subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);


        var results = [{ id: '  ', text: 'Select' }]

        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            "id": data[i].id,
            "text": data[i].name
          });

        }


        this.countryData = results;

      },
      error => {
        Swal.fire(
          'Error!',
          'Error.',
          'error'
        ).then(

          (result) => {


          })


      }

    )
  }

  public FindByEntityContactOrgID() {
    // this.countryData = []
    // this.countryValue=''
let entityId={
  entityID:sessionStorage.getItem('qtnId'),
   //cstID:sessionStorage.getItem('qtnId')
  cstID:this.callCstId


}

    return this.quotationService.GetAllEntityContactByEntityIDAndCstID(entityId).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);


        var results = [{ id: '  ', text: 'Select' }]

        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            "id": data[i].id,
            "text": data[i].name
          });
          if(data[i]['is_primary']==true){
            this.entityContactVal=data[i].id
          }

        }


        this.entityContactData = results;

      },
      error => {
        Swal.fire(
          'Error!',
          'Error.',
          'error'
        ).then(

          (result) => {


          })


      }

    )
  }

  getContactList(id) {
    // this.countryData = []
    // this.countryValue=''
  let entityId={
  entityID:sessionStorage.getItem("qtnId"),
   //cstID:sessionStorage.getItem("qtnId")
  cstID:this.callCstId


  }

    return this.quotationService.GetAllEntityContactByEntityIDAndCstID(entityId).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);


        var results = [{ id: '  ', text: 'Select' }]

        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            "id": data[i].id,
            "text": data[i].name
          });


        }


        this.entityContactData = results;
        this.entityContactVal=id;
        this.showBranchList=true;
        brList=data;
        this.branchDataSource=data;
        for(var i=0;i<data.length;i++){
          if(data[i]['is_primary']==true){
            this.primaryContact=data[i]
          }
        }
      },
      error => {
        Swal.fire(
          'Error!',
          'Error.',
          'error'
        ).then(

          (result) => {


          })


      }

    )
  }
  public openContactModal(type){
    //$('#details_view_modal').modal('show')
    //  $('#activity_log_modal').modal('hide')
    console.log('openDetailedView',type)
    if(type=='meeting'){
      $("#meeting_modal").removeClass("fade").modal("hide");
      this.closeActLog=true
      this.typeOfModal='meeting'
      this.meetCloseBtn.nativeElement.click();

    }else if(type=='call'){
      $("#call_modal").removeClass("fade").modal("hide");
      this.callCloseBtn.nativeElement.click();

      this.typeOfModal='call'
      this.callCloseBtn.nativeElement.click();

      this.closeActLog=false


    }else if(type=='layout'){

      this.typeOfModal='layout'



    }

    $("#contact_modal").modal("show").addClass("fade");
  }
  closeContactModal(){
    // $('#details_view_modal').modal('hide')
    // $('.modal-backdrop').remove();
    //  $('#activity_log_modal').modal('show')
    $("#contact_modal").removeClass("fade").modal("hide");
    this.contactCloseBtn.nativeElement.click();
    this.customerContactForm.reset();
    this.savedContactPh=false;
  if(this.closeActLog==true){
    $("#meeting_modal").modal("show").addClass("fade");

  }else if(this.typeOfModal!='layout' &&  this.closeActLog==false ){
    $("#call_modal").modal("show").addClass("fade");

  }
  }

  saveContact(e){
    this.savedContactPh=true;

      let postData={

        "id":null,
        "entity_id":sessionStorage.getItem("qtnId"),
        "first_name":this.customerContactForm.get('fname').value,
        "last_name": this.customerContactForm.get('lname').value,
        "name":this.customerContactForm.get('fname').value+' '+ this.customerContactForm.get('lname').value,
        "phone":(this.customerContactForm.get('mobile').value!=null && this.customerContactForm.get('mobile').value!='')? this.customerContactForm.get('mobile').value.internationalNumber.replace(/ /g, ""):null,
        "phone_iso_name":(this.customerContactForm.get('mobile').value!=null && this.customerContactForm.get('mobile').value!='')?this.customerContactForm.get('mobile').value.countryCode:null,
        "email": this.customerContactForm.get('email').value,
        "note": this.customerContactForm.get('note').value,
        "department": null,
        "relationship": this.cstRelationValueTxt!='Select' && this.cstRelationValueTxt!=''?this.cstRelationValueTxt:null,
        "designation": this.customerContactForm.get('designation').value,
        "is_primary":false

      }

     console.log('saveContactAddress',postData)
     if(this.customerContactForm.get('mobile').status=='VALID'){
      this.savedContactPh=false;

     this.spinner.show();

       return this.quotationService.AddEntityContact(postData).subscribe(
        (data: any) => {
if(data.status=='200'){

            this.spinner.hide();
          this.customerContactForm.reset();
          this.cstRelationValue='';
          this.closeContactModal();
          this.getContactList(data.code);
          if(this.typeOfModal=='meeting'){
            this.getAllEmployeeList(data.code);

            }else if(this.typeOfModal=='call'){
              this.getContactList(data.code);


              }
           this.disableSaveBranch=true;
           this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });



}
else{
  this.spinner.hide();
  this.toastr.error('Something went wrong,Please try again later', undefined, {
    positionClass: 'toast-top-center'
  });

}

        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(
            (result) => {

            })


        }

      )

      }
      }
  changedEntityContact(e){
    this.entityContactVal=e.value
  }
  @ViewChild('accordion', { static: false })
  public acrdn: AccordionComponent;
  @ViewChild('grid',{static:false})
  public grid: GridComponent;
  public ajaxData: string = '';
  prefixExists: boolean = false;
  showAddForm: boolean = false;
  AddNewSubmit: boolean = false;
  editable: boolean = false;
  customerData: { id: string; text: string; }[];
  projectData: Object[];
  pageSettings: { pageSizes: boolean; pageCount: number; };
  toolbar: string[];
  customerForm: FormGroup;
  customerVal: any;
  addformSubmitted: boolean;
  cstPhoneNumberValue: any='';
  cstPhone: string;
  cstPhoneInvalid: boolean=false;
  projName: string = '';
  multiOption: Select2Options;
  public nameChange(e) {
    if (e.target.value != '') {
      this.addformSubmitted = false;
      this.projName = e.target.value
    } else {
      this.addformSubmitted = true;

      this.isFieldValid('proj_name');

    }
  }
  public goBack() {
    window.history.go(-1);
    sessionStorage.clear();

  }
  oldGetLastAddedProjectPrefixPrefixByOrgID(){
    this.spinner.show();
    this.projectService.GetLastAddedProjectPrefixByOrgID().subscribe(

      (data:any) => {

    if(data.code==""){
      this.projectService.GetAllPrefixByOrgID().subscribe(

        (data:any) => {
          this.spinner.hide();

      for(var i=0;i<data.length;i++){
        if(data[i].type=="project"){
          if(data[i].prefix_for=="default"){
            let splittable;

            if(data[i].prefix_name){
            let prefix_name=data[i].prefix_name;

             splittable =  prefix_name.split('/');
             if (parseInt(splittable[3]).toString().length == 1) {
              let jobNo = '0000'
              this.prefixString = splittable[0] +'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;

            }
            //  let jobNo=(parseInt(splittable[3])+1)
            // this.prefixString=data[i].prefix_name+jobNo;
            }

    }else if(data[i].prefix_for=="custom"){
      this.showPrefixText=true;

    }else if(data[i].prefix_for=="sequence"){
      let splittable;
      this.showPrefixText=false;

      if(data[i].prefix_name){
      // let project_prefix=data.project_prefix;
      let prefix_name=data[i].prefix_name;

       splittable =  prefix_name.split('/');

             if (parseInt(splittable[1]).toString().length == 1) {
              let jobNo = '000'
              this.prefixString = splittable[0] + '/' + jobNo;

            }

      }

    }else  if(data[i].prefix_for=="random"){
      let splittable;
      if(data[i].prefix_name){
      let prefix_name=data[i].prefix_name;

       splittable =  prefix_name.split('/');
       let jobNo=(parseInt(splittable[1])+1)
       let random= (Math.floor(1000 + Math.random() * 9000));

             this.prefixString = splittable[0] + '/' + random;

      }

    }

        }
      }
      if(this.modifyProjStaus==true){
        this.modifyStatus();

      }else{
       this.onUpdateStatus()

      }
    //  this.onUpdateStatus()
   // this.modifyStatus();


        },
        error  => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(

            (result)=> {


            })


        }

        )
    }else{
      let checkLast = data.code.split('/').pop();
      let letter = checkLast.charAt(0);
      let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
      let lastAddprefixSplit = lastAddedprefix.split('/').pop();
      this.projectService.GetAllPrefixByOrgID().subscribe(

        (data:any) => {
          this.spinner.hide();

      for(var i=0;i<data.length;i++){
        if(data[i].type=="project"){
          if(data[i].prefix_for=="default"){
            let splittable;

            if(data[i].prefix_name){
            let prefix_name=data[i].prefix_name;

             splittable =  prefix_name.split('/');

             console.log("lastAddprefixSplit--->",lastAddprefixSplit);


             if (parseInt(lastAddprefixSplit).toString().length == 1) {
              let jobNo = '000' + (parseInt(lastAddprefixSplit) + 1)
              this.prefixString = splittable[0] +'/'+ moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;

            } else if (parseInt(lastAddprefixSplit).toString().length == 2) {
              let jobNo = '00' + (parseInt(lastAddprefixSplit) + 1)
              // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
              this.prefixString = splittable[0] +'/'+ moment().format('YY')+'/'+ moment().format('MM') + '/' + jobNo;

            }else if (parseInt(lastAddprefixSplit).toString().length == 3) {
              let jobNo = '0' + (parseInt(lastAddprefixSplit) + 1)
              // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
              this.prefixString = splittable[0] +'/'+ moment().format('YY')+'/'+  moment().format('MM') + '/' + jobNo;

            }
            else {
              let jobNo = (parseInt(lastAddprefixSplit) + 1)
              // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
              this.prefixString = splittable[0] +'/'+ moment().format('YY')+'/'+  moment().format('MM') + '/' + jobNo;

            }
            //  let jobNo=(parseInt(splittable[3])+1)
            // this.prefixString=data[i].prefix_name+jobNo;
            }

    }else if(data[i].prefix_for=="custom"){
      this.showPrefixText=true;

    }else if(data[i].prefix_for=="sequence"){
      let splittable;
      this.showPrefixText=false;

      if(data[i].prefix_name){
      // let project_prefix=data.project_prefix;
      let prefix_name=data[i].prefix_name;

       splittable =  prefix_name.split('/');

             if (parseInt(lastAddprefixSplit).toString().length == 1) {
              let jobNo = '000' + (parseInt(lastAddprefixSplit) + 1)
              this.prefixString = splittable[0] + '/' + jobNo;

            } else if (parseInt(lastAddprefixSplit).toString().length == 2) {
              let jobNo = '00' + (parseInt(lastAddprefixSplit) + 1)
              // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
              this.prefixString = splittable[0] + '/' + jobNo;

            }else if (parseInt(lastAddprefixSplit).toString().length == 3) {
              let jobNo = '0' + (parseInt(lastAddprefixSplit) + 1)
              // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
              this.prefixString = splittable[0] + '/' + jobNo;

            }
            else {
              let jobNo = (parseInt(lastAddprefixSplit) + 1)
              // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
              this.prefixString = splittable[0] + '/' + jobNo;

            }

      }

    }else  if(data[i].prefix_for=="random"){
      let splittable;
      if(data[i].prefix_name){
      let prefix_name=data[i].prefix_name;

       splittable =  prefix_name.split('/');
       let random= (Math.floor(1000 + Math.random() * 9000));
       let jobNo=(parseInt(lastAddprefixSplit)+1)

             this.prefixString = splittable[0] + '/' + random;

      }

    }
        }
      }

      this.prefixString = this.projectExtensionData.length === 0 ? this.prefixString : this.setExtensionPrefix;
      if(this.modifyProjStaus==true){
        this.modifyStatus();

      }else{
       this.onUpdateStatus()

      }
     // this.onUpdateStatus()
    //this.modifyStatus();


        },
        error  => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(

            (result)=> {


            })


        }

        )

    }


      },
      error  => {
        this.spinner.hide();

        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result)=> {


          })


      }

      )



      }


      GetLastAddedProjectPrefixPrefixByOrgID(){

        this.projectService.GetAllPrefixByOrgID().subscribe((allPreData:any) => {
          console.log(allPreData)
          let result = []
          let addnlPrfxPrsnt = allPreData.filter((e) =>  e.type === 'project-marketing' || e.type === 'project-complimentary');

          allPreData.map((elm, ind) => {

              //Check if Project is a Complimentary Project Or MarketingProject
              if(this.estAddntlData != null && addnlPrfxPrsnt.length > 0) {
              let typeBy = this.estAddntlData.isMarketing === "true" ? 'project-marketing' : 'project-complimentary';
              if(elm.type === typeBy){
                result.push(elm)
              }

              if(allPreData.length === ind + 1){
                if(result.length !== 0){

                  if(result[0].prefix_for === "Default"){
                    this.projectService.GetLastAddedExtraProjectPrefixByOrgID(result[0].prefix_ext).subscribe((data: any) => {
                      console.log("data.code",data.code);
                      //data.code = "MRP/23/04/0";
                      if(data.code == ""){
                        let prefix_name = result[0].prefix_ext;
                        let jobNo = '0'
                        this.prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;

                        this.runConversion();
                      }else{

                        //remove extension from code if found
                        let checkLast = data.code.split('/').pop();
                        let letter = checkLast.charAt(0);
                        let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                        //remove extension from code if found
                        let currentProID = lastAddedprefix;
                        let storeValue = currentProID.split('/');
                        let prefixString;
                        if(storeValue.length === 4){
                          if(storeValue[2] === moment().format('MM')){
                            let prefix_name = result[0].prefix_ext;
                            let lastAddprefixSplit = storeValue.pop();
                            let jobNo = parseInt(lastAddprefixSplit) + 1
                            prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                            this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                            this.runConversion();
                          }else{
                            let prefix_name = result[0].prefix_ext;
                            let jobNo = 1
                            prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                            this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                            this.runConversion();
                          }
                        }else{
                          this.projectService. GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                            if(predata.length !== 0){
                              let prefix_name = result[0].prefix_ext;
                              let jobNo = predata[0].project_prefix.split('/').pop();
                              prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                              this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                              this.runConversion();
                            }else{
                              let prefix_name = result[0].prefix_ext;
                              let jobNo = '1'
                              prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                              this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                              this.runConversion();
                            }
                          });
                        }
                      }
                    });
                  }else if((result[0].prefix_for === "Sequence")){
                    this.projectService.GetLastAddedExtraProjectPrefixByOrgID(result[0].prefix_ext).subscribe((data: any) => {



                      if(data.code == ""){
                        let prefix_name = result[0].prefix_ext;
                        let jobNo = result[0].prefix_name.split('/').pop();
                        this.prefixString = prefix_name+'/'+jobNo;
                        this.runConversion();
                      }else{
                        //remove extension from code if found
                        let checkLast = data.code.split('/').pop();
                        let letter = checkLast.charAt(0);
                        let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                        //remove extension from code if found
                        let prefixString;
                        let currentProID = lastAddedprefix;
                        let prefix_name = result[0].prefix_ext;
                        let lastAddprefix = currentProID.split('/');
                        if(lastAddedprefix.length === 2){
                          let lastAddprefixSplit = lastAddprefix.pop();
                          prefixString = prefix_name+'/'+(parseFloat(lastAddprefixSplit)+1);
                          this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                       this.runConversion();
                        }else{
                          this.projectService.GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                            if(predata.length !== 0){
                              let prefix_name = result[0].prefix_ext;
                              let jobNo = predata[0].project_prefix.split('/').pop();
                              prefixString = prefix_name+'/'+(parseFloat(jobNo)+1);
                              this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                          this.runConversion();
                            }else{
                              let prefix_name = result[0].prefix_ext;
                              let jobNo = result[0].prefix_name.split('/').pop();
                              prefixString = prefix_name+'/'+jobNo;
                              this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                            this.runConversion();
                            }
                          });
                        }
                      }
                    });
                  }

                  else if((result[0].prefix_for === "Custom")){
                    let randomNum = (Math.floor(1000 + Math.random() * 9000));
                    let prefixString = result[0].prefix_ext+'/'+randomNum;
                    this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                    this.runConversion();
                  }
                  else if((result[0].prefix_for === "Project-Sequence")) {
                    console.log(allPreData.filter((el)=> el.type == 'project')[0].prefix_for);
                    this.runProjectSeq(result,allPreData.filter((el)=> el.type == 'project')[0].prefix_for);
                }
                } else {

                }
              }
              }
              else {

                  if(elm.type === 'project'){
                    result.push(elm)
                  }
                  if(allPreData.length === ind + 1){
                    if(result.length !== 0){
                      if(result[0].prefix_for === "Default"){
                        this.projectService.GetLastAddedProjectPrefixByOrgID().subscribe((data: any) => {
                          //console.log("data.code",data.code);
                          if(data.code == ""){
                            let prefix_name = result[0].prefix_ext;
                            let jobNo = '0'
                            this.prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                            this.runConversion();
                          }else{
                            //remove extension from code if found
                            let checkLast = data.code.split('/').pop();
                            let letter = checkLast.charAt(0);
                            let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                            //remove extension from code if found
                            let currentProID = lastAddedprefix;
                            let storeValue = currentProID.split('/');
                            let prefixString;
                            if(storeValue.length === 4){
                              if(storeValue[2] === moment().format('MM')){
                                let prefix_name = result[0].prefix_ext;
                                let lastAddprefixSplit = storeValue.pop();
                                let jobNo = parseInt(lastAddprefixSplit) + 1
                                prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                                this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                                this.runConversion();
                              }else{
                                let prefix_name = result[0].prefix_ext;
                                let jobNo = 1
                                prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                                this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                                this.runConversion();
                              }
                            }else{
                              //GelstPrjtExtraPrfxNoExt
                              this.projectService.GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                                if(predata.length !== 0){
                                  let prefix_name = result[0].prefix_ext;
                                  let jobNo = predata[0].project_prefix.split('/').pop();
                                  prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                                  this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                                  this.runConversion();
                                }else{
                                  let prefix_name = result[0].prefix_ext;
                                  let jobNo = '1'
                                  prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                                  this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                                  this.runConversion();
                                }
                              });
                            }
                          }
                        });
                      }else if((result[0].prefix_for === "Sequence")){
                        this.projectService.GetLastAddedProjectPrefixByOrgID().subscribe((data: any) => {
                          if(data.code == ""){
                            let prefix_name = result[0].prefix_ext;
                            let jobNo = result[0].prefix_name.split('/').pop();
                            this.prefixString = prefix_name+'/'+jobNo;
                            this.runConversion();
                          }else{

                            //remove extension from code if found
                            let checkLast = data.code.split('/').pop();
                            let letter = checkLast.charAt(0);
                            let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                            //remove extension from code if found
                            let prefixString;
                            let currentProID = lastAddedprefix;
                            let prefix_name = result[0].prefix_ext;
                            let lastAddprefix = currentProID.split('/');
                            if(lastAddedprefix.length === 2){
                              let lastAddprefixSplit = lastAddprefix.pop();
                              prefixString = prefix_name+'/'+(parseFloat(lastAddprefixSplit)+1);
                              this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                            this.runConversion();
                            }else{
                              this.projectService.GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                                console.log(predata);
                                if(predata.length !== 0){
                                  let prefix_name = result[0].prefix_ext;
                                  let jobNo = predata[0].project_prefix.split('/').pop();
                                  prefixString = prefix_name+'/'+(parseFloat(jobNo)+1);
                                  this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                                 this.runConversion();
                                }else{
                                  let prefix_name = result[0].prefix_ext;
                                  let jobNo = result[0].prefix_name.split('/').pop();
                                  prefixString = prefix_name+'/'+jobNo;
                                  this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                                  this.runConversion();
                                }
                              });
                            }
                          }
                        });
                      }else if((result[0].prefix_for === "Custom")){
                        let randomNum = (Math.floor(1000 + Math.random() * 9000));
                        let prefixString = result[0].prefix_ext+'/'+randomNum;
                        this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                        this.runConversion();
                      }
                    }
                  }
              }

          });
        });
      }

      GentLastAddedProjectPrefixPrefixByOrgID(){

        this.projectService.GetAllPrefixByOrgID().subscribe((allPreData:any) => {

          let result = []
          let addnlPrfxPrsnt = allPreData.filter((e) =>  e.type === 'project-marketing' || e.type === 'project-complimentary');

          allPreData.map((elm, ind) => {

              //Check if Project is a Complimentary Project Or MarketingProject
              if(this.estAddntlData != null && addnlPrfxPrsnt.length > 0) {
              let typeBy = this.estAddntlData.isMarketing === "true" ? 'project-marketing' : 'project-complimentary';
              if(elm.type === typeBy){
                result.push(elm)
              }
              if(allPreData.length === ind + 1){
                if(result.length !== 0){

                  if(result[0].prefix_for === "Default"){
                    this.projectService.GetLastAddedExtraProjectPrefixByOrgID(result[0].prefix_ext).subscribe((data: any) => {
                      console.log("data.code",data.code);
                      //data.code = "MRP/23/04/0";
                      if(data.code == ""){
                        let prefix_name = result[0].prefix_ext;
                        let jobNo = '0'
                        this.upNextPrefix = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                        //this.upNextPrefix

                      }else{

                        //remove extension from code if found
                        let checkLast = data.code.split('/').pop();
                        let letter = checkLast.charAt(0);
                        let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                        //remove extension from code if found
                        let currentProID = lastAddedprefix;
                        let storeValue = currentProID.split('/');
                        let prefixString;
                        if(storeValue.length === 4){
                          if(storeValue[2] === moment().format('MM')){
                            let prefix_name = result[0].prefix_ext;
                            let lastAddprefixSplit = storeValue.pop();
                            let jobNo = parseInt(lastAddprefixSplit) + 1
                            prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                            this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                          }else{
                            let prefix_name = result[0].prefix_ext;
                            let jobNo = 1
                            prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                            this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                          }
                        }else{
                          this.projectService. GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                            if(predata.length !== 0){
                              let prefix_name = result[0].prefix_ext;
                              let jobNo = predata[0].project_prefix.split('/').pop();
                              prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                              this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                            }else{
                              let prefix_name = result[0].prefix_ext;
                              let jobNo = '1'
                              prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                              this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                            }
                          });
                        }
                      }
                    });
                  }else if((result[0].prefix_for === "Sequence")){
                    this.projectService.GetLastAddedExtraProjectPrefixByOrgID(result[0].prefix_ext).subscribe((data: any) => {



                      if(data.code == ""){
                        let prefix_name = result[0].prefix_ext;
                        let jobNo = result[0].prefix_name.split('/').pop();
                        this.upNextPrefix = prefix_name+'/'+jobNo;

                      }else{
                        //remove extension from code if found
                        let checkLast = data.code.split('/').pop();
                        let letter = checkLast.charAt(0);
                        let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                        //remove extension from code if found
                        let prefixString;
                        let currentProID = lastAddedprefix;
                        let prefix_name = result[0].prefix_ext;
                        let lastAddprefix = currentProID.split('/');
                        if(lastAddedprefix.length === 2){
                          let lastAddprefixSplit = lastAddprefix.pop();
                          prefixString = prefix_name+'/'+(parseFloat(lastAddprefixSplit)+1);
                          this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                        }else{
                          this.projectService.GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                            if(predata.length !== 0){
                              let prefix_name = result[0].prefix_ext;
                              let jobNo = predata[0].project_prefix.split('/').pop();
                              prefixString = prefix_name+'/'+(parseFloat(jobNo)+1);
                              this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                            }else{
                              let prefix_name = result[0].prefix_ext;
                              let jobNo = result[0].prefix_name.split('/').pop();
                              prefixString = prefix_name+'/'+jobNo;
                              this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                            }
                          });
                        }
                      }
                    });
                  }

                  else if((result[0].prefix_for === "Custom")){
                    let randomNum = (Math.floor(1000 + Math.random() * 9000));
                    let prefixString = result[0].prefix_ext+'/'+randomNum;

                  }
                  else if((result[0].prefix_for === "Project-Sequence")) {
                    console.log(allPreData.filter((el)=> el.type == 'project')[0].prefix_for);
                    this.genrunProjectSeq(result,allPreData.filter((el)=> el.type == 'project')[0].prefix_for);
                  }
                }
              }
              }
              else {

                  if(elm.type === 'project'){
                    result.push(elm)
                  }
                  if(allPreData.length === ind + 1){
                    if(result.length !== 0){
                      if(result[0].prefix_for === "Default"){
                        this.projectService.GetLastAddedProjectPrefixByOrgID().subscribe((data: any) => {
                          //console.log("data.code",data.code);
                          if(data.code == ""){
                            let prefix_name = result[0].prefix_ext;
                            let jobNo = '0'
                            this.upNextPrefix = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;

                          }else{
                            //remove extension from code if found
                            let checkLast = data.code.split('/').pop();
                            let letter = checkLast.charAt(0);
                            let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                            //remove extension from code if found
                            let currentProID = lastAddedprefix;
                            let storeValue = currentProID.split('/');
                            let prefixString;
                            if(storeValue.length === 4){
                              if(storeValue[2] === moment().format('MM')){
                                let prefix_name = result[0].prefix_ext;
                                let lastAddprefixSplit = storeValue.pop();
                                let jobNo = parseInt(lastAddprefixSplit) + 1
                                prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                                this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                              }else{
                                let prefix_name = result[0].prefix_ext;
                                let jobNo = 1
                                prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                                this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                              }
                            }else{
                              //GelstPrjtExtraPrfxNoExt
                              this.projectService.GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                                if(predata.length !== 0){
                                  let prefix_name = result[0].prefix_ext;
                                  let jobNo = predata[0].project_prefix.split('/').pop();
                                  prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                                  this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                                }else{
                                  let prefix_name = result[0].prefix_ext;
                                  let jobNo = '1'
                                  prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                                  this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                                }
                              });
                            }
                          }
                        });
                      }else if((result[0].prefix_for === "Sequence")){
                        this.projectService.GetLastAddedProjectPrefixByOrgID().subscribe((data: any) => {
                          if(data.code == ""){
                            let prefix_name = result[0].prefix_ext;
                            let jobNo = result[0].prefix_name.split('/').pop();
                            this.upNextPrefix = prefix_name+'/'+ jobNo;

                          }else{

                            //remove extension from code if found
                            let checkLast = data.code.split('/').pop();
                            let letter = checkLast.charAt(0);
                            let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                            //remove extension from code if found
                            let prefixString;
                            let currentProID = lastAddedprefix;
                            let prefix_name = result[0].prefix_ext;
                            let lastAddprefix = currentProID.split('/');
                            if(lastAddedprefix.length === 2){
                              let lastAddprefixSplit = lastAddprefix.pop();
                              prefixString = prefix_name+'/'+(parseFloat(lastAddprefixSplit)+1);
                              this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                            }else{
                              this.projectService.GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                                console.log(predata);
                                if(predata.length !== 0){
                                  let prefix_name = result[0].prefix_ext;
                                  let jobNo = predata[0].project_prefix.split('/').pop();
                                  prefixString = prefix_name+'/'+(parseFloat(jobNo)+1);
                                  this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                                }else{
                                  let prefix_name = result[0].prefix_ext;
                                  let jobNo = result[0].prefix_name.split('/').pop();
                                  prefixString = prefix_name+'/'+jobNo;
                                  this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                                }
                              });
                            }
                          }
                        });
                      }else if((result[0].prefix_for === "Custom")){
                        let randomNum = (Math.floor(1000 + Math.random() * 9000));
                        let prefixString = result[0].prefix_ext+'/'+randomNum;
                        this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                      }
                    }
                  }
              }

          });
        });
      }

      formatUpNxtprfx(prfx) {

        if(prfx != undefined) {
          var response = prfx.substring(prfx.indexOf("/")+1);
          //console.log("prfx--->",response);
          return response
        }


      }



      runConversion(){

        console.log("this.modifyProjStaus",this.modifyProjStaus);


        if(this.modifyProjStaus==true){
          this.modifyStatus();
        }else{
         this.onUpdateStatus()
        }
      }


      genrunProjectSeq(result,type) {
        if(result.length !== 0){
          if(type === "Default"){
            this.projectService.GetLastAddedProjectPrefixByOrgID().subscribe((data: any) => {
              //console.log("data.code",data.code);
              if(data.code == ""){
                let prefix_name = result[0].prefix_ext;
                let jobNo = '0'
                this.upNextPrefix = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;

              }else{
                //remove extension from code if found
                let checkLast = data.code.split('/').pop();
                let letter = checkLast.charAt(0);
                let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                //remove extension from code if found
                let currentProID = lastAddedprefix;
                let storeValue = currentProID.split('/');
                let prefixString;
                if(storeValue.length === 4){
                  if(storeValue[2] === moment().format('MM')){
                    let prefix_name = result[0].prefix_ext;
                    let lastAddprefixSplit = storeValue.pop();
                    let jobNo = parseInt(lastAddprefixSplit) + 1
                    prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                    this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                  }else{
                    let prefix_name = result[0].prefix_ext;
                    let jobNo = 1
                    prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                    this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                  }
                }else{
                  this.projectService.GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                    if(predata.length !== 0){
                      let prefix_name = result[0].prefix_ext;
                      let jobNo = predata[0].project_prefix.split('/').pop();
                      prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                      this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                    }else{
                      let prefix_name = result[0].prefix_ext;
                      let jobNo = '1'
                      prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                      this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                    }
                  });
                }
              }
            });
          }else if((type === "Sequence")){
            this.projectService.GetLastAddedProjectPrefixByOrgID().subscribe((data: any) => {
              if(data.code == ""){
                let prefix_name = result[0].prefix_ext;
                let jobNo = result[0].prefix_name.split('/').pop();
                this.upNextPrefix = prefix_name+'/'+jobNo;

              }else{

                //remove extension from code if found
                let checkLast = data.code.split('/').pop();
                let letter = checkLast.charAt(0);
                let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                //remove extension from code if found
                let prefixString;
                let currentProID = lastAddedprefix;
                let prefix_name = result[0].prefix_ext;
                let lastAddprefix = currentProID.split('/');
                if(lastAddedprefix.length === 2){
                  let lastAddprefixSplit = lastAddprefix.pop();
                  prefixString = prefix_name+'/'+(parseFloat(lastAddprefixSplit)+1);
                  this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                }else{
                  this.projectService.GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                    console.log(predata);
                    if(predata.length !== 0){
                      let prefix_name = result[0].prefix_ext;
                      let jobNo = predata[0].project_prefix.split('/').pop();
                      prefixString = prefix_name+'/'+(parseFloat(jobNo)+1);
                      this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;



                    }else{
                      let prefix_name = result[0].prefix_ext;
                      let jobNo = result[0].prefix_name.split('/').pop();
                      prefixString = prefix_name+'/'+jobNo;
                      this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;


                    }
                  });
                }
              }
            });
          }else if((type === "Custom")){
            let randomNum = (Math.floor(1000 + Math.random() * 9000));
            let prefixString = result[0].prefix_ext+'/'+randomNum;
            this.upNextPrefix = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

          }
        }
      }

      runProjectSeq(result,type) {
        if(result.length !== 0){
          if(type === "Default"){
            this.projectService.GetLastAddedProjectPrefixByOrgID().subscribe((data: any) => {
              //console.log("data.code",data.code);
              if(data.code == ""){
                let prefix_name = result[0].prefix_ext;
                let jobNo = '0'
                this.prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                this.runConversion();
              }else{
                //remove extension from code if found
                let checkLast = data.code.split('/').pop();
                let letter = checkLast.charAt(0);
                let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                //remove extension from code if found
                let currentProID = lastAddedprefix;
                let storeValue = currentProID.split('/');
                let prefixString;
                if(storeValue.length === 4){
                  if(storeValue[2] === moment().format('MM')){
                    let prefix_name = result[0].prefix_ext;
                    let lastAddprefixSplit = storeValue.pop();
                    let jobNo = parseInt(lastAddprefixSplit) + 1
                    prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                    this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                    this.runConversion();
                  }else{
                    let prefix_name = result[0].prefix_ext;
                    let jobNo = 1
                    prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo;
                    this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                    this.runConversion();
                  }
                }else{
                  this.projectService.GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                    if(predata.length !== 0){
                      let prefix_name = result[0].prefix_ext;
                      let jobNo = predata[0].project_prefix.split('/').pop();
                      prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                      this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                      this.runConversion();
                    }else{
                      let prefix_name = result[0].prefix_ext;
                      let jobNo = '1'
                      prefixString = prefix_name+'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
                      this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                      this.runConversion();
                    }
                  });
                }
              }
            });
          }else if((type === "Sequence")){
            this.projectService.GetLastAddedProjectPrefixByOrgID().subscribe((data: any) => {
              if(data.code == ""){
                let prefix_name = result[0].prefix_ext;
                let jobNo = result[0].prefix_name.split('/').pop();
                this.prefixString = prefix_name+'/'+jobNo;
                this.runConversion();
              }else{

                //remove extension from code if found
                let checkLast = data.code.split('/').pop();
                let letter = checkLast.charAt(0);
                let lastAddedprefix = letter === 'E' ? data.code.substr(0, data.code.lastIndexOf("/")) : data.code;
                //remove extension from code if found
                let prefixString;
                let currentProID = lastAddedprefix;
                let prefix_name = result[0].prefix_ext;
                let lastAddprefix = currentProID.split('/');
                if(lastAddedprefix.length === 2){
                  let lastAddprefixSplit = lastAddprefix.pop();
                  prefixString = prefix_name+'/'+(parseFloat(lastAddprefixSplit)+1);
                  this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
                this.runConversion();
                }else{
                  this.projectService.GelstPrjtExtraPrfxNoExt(result[0].prefix_ext).subscribe((predata:any) => {
                    console.log(predata);
                    if(predata.length !== 0){
                      let prefix_name = result[0].prefix_ext;
                      let jobNo = predata[0].project_prefix.split('/').pop();
                      prefixString = prefix_name+'/'+(parseFloat(jobNo)+1);
                      this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;


                  this.runConversion();
                    }else{
                      let prefix_name = result[0].prefix_ext;
                      let jobNo = result[0].prefix_name.split('/').pop();
                      prefixString = prefix_name+'/'+jobNo;
                      this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;

                    this.runConversion();
                    }
                  });
                }
              }
            });
          }else if((type === "Custom")){
            let randomNum = (Math.floor(1000 + Math.random() * 9000));
            let prefixString = result[0].prefix_ext+'/'+randomNum;
            this.prefixString = this.projectExtensionData.length === 0 ? prefixString : this.setExtensionPrefix;
            this.runConversion();
          }
        }
      }

  public onSearchChange(){

   }
   changedIndustry(e: any): void {
    this.industryValue = e.value;

  }

  public AddCst() {
    // $('#customer_modal').show();
    $("#customer_modal").modal('show');
    this.getCountryList();
    this.GetIndustryByOrgID();

  }
  public AddProjType() {
    // $('#customer_modal').show();
    $("#proj_type_modal").modal('show');

  }
  public OnProjTypeClose() {
    // $('#customer_modal').show();
    $("#proj_type_modal").modal('hide');

  }

  public AddDesignType() {
    // $('#customer_modal').show();
    $("#design_type_modal").modal('show');

  }
  public OnDesignClose() {
    // $('#customer_modal').show();
    $("#design_type_modal").modal('hide');

  }

  public changedProjType(e: any): void {
    this.projTypeVal = e.value;

  }
  public changedContact(e: any): void {
    this.contactVal = e.value;

  }
  public changedDesgnType(e: any): void {
    this.desgnTypeVal = e.value;

  }

  reEstimate(){
    Swal.fire({

        title: 'Are you sure?',
        text: "Clone estimation will be created with a new reference number while keeping the existing quotation",
        type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'REVISE!',
    cancelButtonText: 'CANCEL!',
    }).then(
      (result) => {
          if (result.value) {
            this.spinner.show();
         this.reviseQtn();



    }
  })

      //  this.router.navigate(["/cost-estimate"]);
      //  sessionStorage.setItem('costId',this.costprojVal);
      //  sessionStorage.setItem('reCalculate','true');

  }
  reviseQtn(){

    let postData={
      id:this.costprojVal,
      "quotationID": sessionStorage.getItem('qtnId')
    }
       //this.fetchUnitDesc();
       // this.extraUnit();
       this.quotationService.RevisedQuotation(postData).subscribe(
         (data: any) => {
           if(data){
            this.spinner.hide();
       sessionStorage.setItem('costId',data.id);

        this.router.navigate(["/cost-estimate"]);
        sessionStorage.setItem('modify','false')


           }
         }
       )

  }
  public changedWarranty(e: any): void {
    this.warrantyVal = e.value;

  }
  public changedPayment(e: any): void {
    this.paymentVal = e.value;

  }
  changedExclusion(e: any): void {
    this.exclusionVal = e.value;

  }
  changedTax(e: any): void {
    this.taxVal = e.value;

  }

  public changedPaymentMode(e: any): void {
    this.paymentModeVal = e.value;

  }
  changedPaymentModeType(e: any): void {
    this.paymentModeTypeVal = e.value;

  }
  public changedPkgType(e: any): void {
    this.pkgTypeVal=e.value;
      }
  public changedCountry(e: any): void {
    this.countryValue = e.value;
    // this.countryValueTxt= e.data[0].text;
    if (e.data[0]) {
      this.countryValueTxt = e.data[0].text;

    }
  }
  public changedProjCountry(e: any): void {
    this.projcountryValue = e.value;
    // this.countryValueTxt= e.data[0].text;
    if (e.data[0]) {
      this.projcountryValueTxt = e.data[0].text;

    }
  }
  public getAllLeadProject(){
    this.leadService.GetAllLeadByOrgID().subscribe(
      (data:any)  => {


        let leadProj=[];
        let last_name=[];
        let company=[];

        for(var i=0;i<data.length;i++){
         if(data[i].project_name!=null ){
          leadProj.push({display: data[i].project_name,value:data[i].id+':id'})
          last_name.push({display: data[i].last_name,value:data[i].id+':id',email:data[i].email})

         }
         if(data[i].company_name!=null){
          company.push({display: data[i].company_name,value:data[i].id+':id',email:data[i].email})
         }
        }
        const projectNameDistinct = [];
const map = new Map();
for (const item of leadProj) {
  if(!map.has(item.display)){
      map.set(item.display, true);    // set any value to Map
      projectNameDistinct.push({
        display: item.display,
        value: item.value+':id',

      });
  }
}
const lastNameDistinct = [];
for (const item of last_name) {
  if(!map.has(item.display)){
      map.set(item.display, true);    // set any value to Map
      lastNameDistinct.push({
        display: item.display,
        value: item.value+':id',
        email:item.email
      });
  }
}
const companyNameDistinct = [];
for (const item of company) {
  if(!map.has(item.display)){
      map.set(item.display, true);    // set any value to Map
      companyNameDistinct.push({
        display: item.display,
        value: item.value+':id',
        email:item.email
      });
  }
}

        this.projectNames=projectNameDistinct;
        // this.lastName=lastNameDistinct;
        // this.companyName=companyNameDistinct;
//this.data12=ds1.dataSource['json'];


      },
      error  => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result)=> {


          })


      }

      )
  }
  public CostCalc(typeOfSubmit) {

    const emails = this.emailForm.get('emails') as FormArray
    const extraUnit = this.extraUnitForm.get('extras') as FormArray
    let user;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));

    }
    let projectUnit = []
    let mainTags=[]
    let extraTags=[]

    let main_unit_qty_all= 0;
    var filterdValues =  emails.value.filter((task) => (task.size != '' && task.size != null) );
   if(filterdValues.length!=0){
    main_unit_qty_all= filterdValues.reduce(function(sum, record){
      if(record.size != '') return sum +parseInt(record.size) ;
      else return sum;
    }, 0);
   }
    let extra_unit_qty_all= 0;
    var extraunitfilterdValues =  extraUnit.value.filter((task) => (task.size != '' && task.size != null) );
   if(extraunitfilterdValues.length!=0){
    extra_unit_qty_all= extraunitfilterdValues.reduce(function(sum, record){
      if(record.size != '') return sum +parseInt(record.size) ;
      else return sum;
    }, 0);
   }


    let unit_qty_all=extra_unit_qty_all+main_unit_qty_all


    for (var i = 0; i < emails.value.length; i++) {
      //let designTypedata = [];
      // if (emails.value[i].designType && emails.value[i].designType.length != 0) {
      //   for (var j = 0; j < emails.value[i].designType.length; j++) {
      //     designTypedata.push({

      //       "id": null,
      //       "org_id": localStorage.getItem('org_id'),
      //       "project_id": null,
      //       "design_type_id": emails.value[i].designType[j],

      //       [typeOfSubmit]: user['full_name'],


      //     });
      //   }
      // }


      let tagsdata = [];
      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push({

            "id": null,
            "org_id": localStorage.getItem('org_id'),
            "project_id": null,
            "tags": emails.value[i].tags[j],

            [typeOfSubmit]: user['full_name'],


          });
          mainTags.push(emails.value[i].tags[j])

        }
      }


      //  if (emails.value[i].size != '') {
        projectUnit.push({
          "id": null,
          "org_id": localStorage.getItem('org_id'),
          "project_id": null,
          "unit_id": emails.value[i].id!=''?emails.value[i].id:null,
          "unit_name": emails.value[i].Label,
          "no_of_unit":1,
          "unit_qty": emails.value[i].size != '' ? emails.value[i].size : null,
          "unit_qty_all":unit_qty_all,
          "note": emails.value[i].notes != '' ? emails.value[i].notes : null,
          "is_extra": false,
          [typeOfSubmit]: user['full_name'],
          // "projectDesignType_ID": emails.value[i].designType.length!=0 ? emails.value[i].designType : null,
          "projectDesignType_ID":  null,
          "projectTags": tagsdata.length != 0 ? tagsdata : null
        })
      // }



    }
    let unitlength=emails.length!=0?emails.length:0;
    for (var i = 0; i < extraUnit.value.length; i++) {
      //let designTypedata = [];
      // if (emails.value[i].designType && emails.value[i].designType.length != 0) {
      //   for (var j = 0; j < emails.value[i].designType.length; j++) {
      //     designTypedata.push({

      //       "id": null,
      //       "org_id": localStorage.getItem('org_id'),
      //       "project_id": null,
      //       "design_type_id": emails.value[i].designType[j],

      //       [typeOfSubmit]: user['full_name'],


      //     });
      //   }
      // }
      let tagsdata = [];
      if (extraUnit.value[i].designType && extraUnit.value[i].designType.length != 0) {
        for (var j = 0; j < extraUnit.value[i].designType.length; j++) {
          if(extraUnit.value[i].designType[0]=='All'){
            for(var k=0;k<extraUnit.value[i].tags.length; k++){
              tagsdata.push({

                "id": null,
                "org_id": localStorage.getItem('org_id'),
                "project_id": null,
                "tags": extraUnit.value[i].tags[k],

                [typeOfSubmit]: user['full_name'],


              });
          extraTags.push(extraUnit.value[i].tags[k])

            }

          }else{
           tagsdata.push({

            "id": null,
            "org_id": localStorage.getItem('org_id'),
            "project_id": null,
            "tags": extraUnit.value[i].designType[j],

            [typeOfSubmit]: user['full_name'],


          });
          extraTags.push(extraUnit.value[i].designType[j])

          }

        }
      }

      //  if (emails.value[i].size != '') {
        projectUnit.push({
          "id": null,
          "org_id": localStorage.getItem('org_id'),
          "project_id": null,
          "unit_id": extraUnit.value[i].id!=''?extraUnit.value[i].id:null,
          "unit_name": extraUnit.value[i].Label,
          "no_of_unit":1,
          "is_extra": true,
          "unit_qty": extraUnit.value[i].size != '' ? extraUnit.value[i].size : null,
          "unit_qty_all":unit_qty_all,
          "note": extraUnit.value[i].notes != '' ? extraUnit.value[i].notes : null,

          [typeOfSubmit]: user['full_name'],
          "total_unit":extraUnit.value[i].designType[0]=='All'?unitlength:(tagsdata.length != 0 ? tagsdata.length : null),
          // "projectDesignType_ID": emails.value[i].designType.length!=0 ? emails.value[i].designType : null,
          "projectDesignType_ID":  null,
          "projectTags": tagsdata.length != 0 ? tagsdata : null
        })
      // }


    }
    if(projectUnit.length==0){
      projectUnit=null
    }
    if ( extraUnit.value.length != 0){
    if(extraTags.includes('All')){
      this.allTagsIncluded=true
          }else{
            var result = mainTags.filter(item=>extraTags.indexOf(item)==-1);
          if(result.length==0){
            this.allTagsIncluded=true

          }else{
            this.allTagsIncluded=false
                Swal.fire(
                    'Warning!',
                    'Please include all the units',
                    'warning'
                  ).then(
                    (result) => {

                    })


          }

          }
        }
    this.projectUnitArray = projectUnit;


    return projectUnit;

  }
  public checkIsLoc(e){
    if(e.srcElement.checked) {
      this.verifyLoc=true;

    }else{
      this.verifyLoc=false;

    }
  }
  focusFunction (){
    if(this.searchElementRef.nativeElement.value==''){
      this.showNearbyPlaces=true;

    }else{
      this.showNearbyPlaces=false;

    }
   this.mapsAPILoader.load().then(() => {
    this.nearByPlaces();
   });
  }
  keyup(event){
     this.showNearbyPlaces=false;

    if(event.keyCode == 8 && this.searchElementRef.nativeElement.value=='' )
    this.showNearbyPlaces=true;
     this.searchLocVal='';

    this.mapsAPILoader.load().then(() => {
      this.nearByPlaces();
     });

  }

  clickFunction (){
     if(this.searchElementRef.nativeElement.value==''){
      this.showNearbyPlaces=true;

    }else{
      this.showNearbyPlaces=false;

    }
   this.mapsAPILoader.load().then(() => {
    this.nearByPlaces();
   });
  }


  selectNearBy(nearbyPlace){
    this.nearbyAddress=nearbyPlace.name;
     this.searchLocVal=nearbyPlace.name;
    this.address=nearbyPlace.name;
    // this.changed_address=nearbyPlace.name;
    // this.web_site = place.website;
    // this.name = place.name;

    // this.getChangedMatchedTypes()
    this.ngZone.run(() => {
      this.latitude = nearbyPlace.geometry.location.lat();
      this.longitude = nearbyPlace.geometry.location.lng();
      this.showNearbyPlaces=false;
      this.zoom=12;
    })


    //set latitude, longitude and zoom


  }
  public nearByPlaces(){
    // this.editableLoc=true;
    if(this.editable==false){
      this.setCurrentLocation();

    }
// let nearbyplaces= new google.maps.places.PlacesService(map);
  this.geoCoder = new google.maps.Geocoder;
let nearby=new google.maps.places.PlacesService(document.createElement('div'));
nearby.nearbySearch({
  location: {lat: this.latitude, lng: this.longitude},
  radius: 100,

}, (results,status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      // this.createMarker(results[i]);
    }
  }
  this.nearbyPlaces=results;

});



}
private setCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.zoom = 8;

       this.getAddress(this.latitude, this.longitude);


    });
  }
}
getAddress(latitude, longitude) {
  this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {

    this.geoCodeData=results[2];

    if (status === 'OK') {
      if (results[0]) {
        this.zoom = 12;
        if(this.drag==true){
          this.getMatchedTypes();
          this.searchElementRef.nativeElement.value= results[0].formatted_address;

        }

        this.address = results[0].formatted_address;
        this.formatted_address = results[2].formatted_address;

      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }

  });
}
public getMatchedTypes() {
  let address_components
  if(this.geoCodeData.length!=0){
     address_components=this.geoCodeData['address_components']

  }


  let i,
      j,
      types;
  let address_component;
  // Loop through the Geocoder result set. Note that the results
// array will change as this loop can self iterate.
for( i=0;i<address_components.length;i++){
  types = address_components[i]['types'];



  for (j = 0; j < types.length; j++) {
    if (types[j] == 'street_number') {




   this.street_number = address_components[i]['short_name'];


    }
    if (types[j] === 'route') {
      this.route =  address_components[i]['long_name'];
    }
    // if (types[j] === 'formatted_address') {
    //   this.formatted_address =  address_components[i]['long_name'];
    // }
    if (types[j] === 'neighborhood') {
      this.street_number =  address_components[i]['long_name'];
    }
    if (types[j] === 'locality') {
      this.locality =  address_components[i]['long_name'];
    }
    if (types[j] === 'administrative_area_level_1') {
      this.administrative_area_level_1 =  address_components[i]['long_name'];
    }
    if (types[j] === 'administrative_area_level_2') {
      this.administrative_area_level_2 =  address_components[i]['long_name'];
    }
    if (types[j] === 'postal_code') {
      this.postal_code =  address_components[i]['long_name'];
    }
    if (types[j] === 'country') {
      this.country =  address_components[i]['long_name'];
    }

  }
}


    // address_component = address_components[element];




}
  public onBOQChange(e){
    if(e.srcElement.checked==true){
      this.BOQvalue=true
    }else{
      this.BOQvalue=false

    }

  }
  public onSitVisitChange(e){
    if(e.srcElement.checked==true){
      this.siteVal=true
    }else{
      this.siteVal=false

    }

  }
  onChange(event){

    if(event){
let phoneNo={
"PhoneNumber":event.dialCode+event.number
}
this.phoneNumberValue=event.dialCode+event.number;
    this.empService.IsPhoneValid(phoneNo).subscribe(
      (data:any)  => {

        if(data.status==200){
          this.phoneInvalid=false;


        }else{
          this.phoneInvalid=true;
          this.phoneErrorMsg=data['desc'];

        }




      },
      error  => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result)=> {


          })


      }

      )
    }
  }
  public changedUnitType(e){

this.unitTypeVal=e.value
if(e.data[0].text){
this.unitTypetxt=e.data[0].text
}
  }
  changedExtraUnitType(e){
this.extraunitTypeVal=e.value
if(e.data[0].text){
this.extraunitTypetxt=e.data[0].text
}
  }
  public AddUnit(index){
    const emails = this.emailForm.get('emails') as FormArray
    const extras = this.extraUnitForm.get('extras') as FormArray

    if(this.unitTypeVal!=''){

this.showUnitLengthErr=false;

    // this.showAssigneeApprove=false;
    // this.showAssigneeLead=false;
    // this.showApprover=false;
    // this.submitClicked=true;
    // if(this.emailForm.get('emails').status=='VALID'){
      // emails.push(this.createEmailFormGroup())
      this.milestoneData=[];

      emails.insert(index, this.createEmailFormGroup());
    //this.submitClicked=false;
//     let addValue;
//     let tags=emails.value[index].tags
//     if(isNaN(parseInt(tags[0].slice(-1))+1)){
//       addValue=emails.value[index].tags[0] +' - '+ 1

//     }else{
// addValue=(emails.value[index].Label  +' - '+ (parseInt(tags[0].slice(-1))+1))

//     }
//
  emails.at(index).patchValue({Label:this.unitTypetxt,designType:['All'],tags: [this.unitTypetxt+ ' - '+ (1)],id: this.unitTypeVal })
  this.unitTypeVal='';
  let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {

      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(


             emails.value[i].tags[j],




          );
        }
      }
    }


  var results1 = [];

  for (var i = 0; i < extras.value.length; i++) {



    //  extras.push(this.createEmailFormGroup())
    extras.at(i).patchValue({designType:['All'], tags:tagsdata.length!=0?tagsdata.concat([
       'All'
    ]):''})
  }
}
  // for (var i = 0; i < this.extraUnitData.length; i++) {



  //   extras.push(this.createEmailFormGroup())

  //   // results1.push({ Label:  this.extraUnitData[i].text, id:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox,tags:([ this.extraUnitData[i].text + ' - '+ (1)]) })
  //   results1.push({tags:this.tagsArrayValue.length!=0?this.tagsArrayValue:'' })
  //   // extras.controls.forEach(pair => pair.patchValue({ Label:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox }));


  // }
  // extras.patchValue(results1);

    //}
  }
  public AddExtraUnit(index){
    const emails = this.emailForm.get('emails') as FormArray
    const extras = this.extraUnitForm.get('extras') as FormArray


    if(this.extraunitTypeVal!=''){
      this.milestoneData=[];
      this.showUnitLengthErr=false;

    // this.showAssigneeApprove=false;
    // this.showAssigneeLead=false;
    // this.showApprover=false;
    // this.submitClicked=true;
    // if(this.emailForm.get('emails').status=='VALID'){
      // emails.push(this.createEmailFormGroup())
      extras.insert(index, this.createEmailFormGroup());
    this.extraunitTypeVal='';

    //this.submitClicked=false;
//     let addValue;
//     let tags=emails.value[index].tags
//     if(isNaN(parseInt(tags[0].slice(-1))+1)){
//       addValue=emails.value[index].tags[0] +' - '+ 1

//     }else{
// addValue=(emails.value[index].Label  +' - '+ (parseInt(tags[0].slice(-1))+1))

//     }
//


  let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {

      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(


             emails.value[i].tags[j],




          );
        }
      }
    }
    extras.at(index).patchValue({Label:this.extraunitTypetxt,id: this.extraunitTypeVal,designType:['All'],
    tags:tagsdata.length!=0?tagsdata.concat([
      'All'
    ]):''})


    }

    //}
  }
  public onAddSubmit() {
    const emails = this.emailForm.get('emails') as FormArray
    const extraUnit = this.extraUnitForm.get('extras') as FormArray
    let unitlength=emails.length!=0?emails.length:0;
    let extraunitlength=extraUnit.length!=0?extraUnit.length:0;
    this.addformSubmitted = true;
    this.desgnTypeVal;
    let designTypedata = [];
    let user;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));

    }

    // for (var j = 0; j < this.desgnTypeVal.length; j++) {
    //   designTypedata.push({

    //     "id": null,
    //     "org_id": localStorage.getItem('org_id'),
    //     "project_id": null,
    //     "design_type_id": this.desgnTypeVal[j],

    //     "createdby": user['full_name'],


    //   });
    // }
    // let date=document.getElementById('ntpDate').innerText
    // moment().format('L');
    let adr1 = this.projectForm.get('street_1').value,
      adr2 = this.projectForm.get('street_2').value,
      city = this.projectForm.get('city').value,
      contact_name = this.projectForm.get('contact_name').value,
      contact_type = this.projectForm.get('contact_type').value

    let postData = {



      "id": null,
      "user_id": user['user_id'],
      "org_id": localStorage.getItem('org_id'),
     "cst_id": this.customerVal,
      "project_type_id": this.projTypeVal,
      "package_id":this.pkgTypeVal,
      "project_name": this.projectForm.get('project_name').value,
      "project_prefix":this.projectForm.get('prefixVal').value=='is_auto'?this.prefixString:this.projectForm.get('prefix_name').value,
      // "is_boq": this.BOQvalue,
      "plot_size":this.projectForm.get('plot_size').value,
      "plot_size_unit":this.projectForm.get('plotVal').value=='sq_ft'?'sq ft':'sq m',
      "buildup_area":this.projectForm.get('built_area').value,
      "buildup_area_unit":this.projectForm.get('builtVal').value=='built_sq_ft'?'sq ft':'sq m',

      // "is_site_visit": this.siteVal,
      "no_of_floors":this.projectForm.get('floor_no').value!=''?this.projectForm.get('floor_no').value:null ,
      "total_unit":unitlength,
      "createdby": user['full_name'],
      "typeOfDesign": this.desgnTypeVal!= '' ? [this.desgnTypeVal] : null,
      "projectUnit": this.CostCalc('createdby'),


        "entityContact": {
          "id": null,
          "entity_id": null,
          name: this.projectForm.get('name').value,
           city: this.projectForm.get('city').value ,
           country: this.projcountryValue!=''?this.projcountryValue:null ,
          phone: this.phoneNumberValue,

          // mobile: this.projectForm.get('mobile').value ,
          email: this.projectForm.get('email').value,


      },

      // email: localStorage.getItem('email'),
      //   ...adr1 && {adr1: adr1},
      //  ...adr2 && { adr2:adr2},
      //  ...city && { city: city},
      //   ...contact_name && {primary_cont_name: contact_name},
      //  ...contact_type && {primary_cont_type:contact_type},








    }



    if(emails.value.length==0 || extraUnit.value.length==0){
      this.showUnitLengthErr=true;
    }else{
      this.showUnitLengthErr=false;

    }

    if (this.projectForm.status=='VALID' && this.emailForm.get('emails').status=='VALID'&& this.extraUnitForm.get('extras').status=='VALID'  && this.allTagsIncluded==true && emails.value.length!=0 && extraUnit.value.length!=0  ) {
      this.spinner.show();

      return this.costService.AddCostProject(postData).subscribe(
        (data: any) => {



          // if (data.status == 200) {
            this.spinner.hide();
            postData['id']=data['id']
            this.projCostId=data['id'];
           this.callCostProj(data['id']);
          this.addformSubmitted=false;

            // this.toastr.success(data['desc'], undefined, {
            //   positionClass: 'toast-top-center'
            // });


         // }
          //  else {
          //   this.spinner.hide();

          //   Swal.fire(
          //     'Error!',
          //     data['result'].desc,
          //     'error'
          //   ).then(
          //     (result) => {
          //
          //     })
          // }
        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(
            (result) => {

            })


        }

      )

    }








  }

  public onUpdateCost(){

    const emails = this.emailForm.get('emails') as FormArray
    const extraUnit = this.extraUnitForm.get('extras') as FormArray
    let unitlength=emails.length!=0?emails.length:0;
    let extraunitlength=extraUnit.length!=0?extraUnit.length:0;
    this.addformSubmitted = true;
    this.desgnTypeVal;
    let designTypedata = [];
    let user;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));

    }
    // for (var j = 0; j < this.desgnTypeVal.length; j++) {
    //   designTypedata.push({

    //     "id": null,
    //     "org_id": localStorage.getItem('org_id'),
    //     "project_id": null,
    //     "design_type_id": this.desgnTypeVal[j],

    //     "createdby": user['full_name'],


    //   });
    // }
    // let date=document.getElementById('ntpDate').innerText
    // moment().format('L');


    let postData = {

      // project_name: this.projectForm.get('project_name').value  ,

      // cst_id: this.customerVal,
      // project_type_id:this.projTypeVal,



      "id": this.projCostId,
      "user_id": user['user_id'],
      "org_id": localStorage.getItem('org_id'),
      "cst_id": this.customerVal,
      "project_type_id": this.projTypeVal,
      "package_id":this.pkgTypeVal,
      "project_name": this.projectForm.get('project_name').value,
      "project_prefix":this.projectForm.get('prefixVal').value=='is_auto'?this.prefixString:this.projectForm.get('prefix_name').value,
      // "is_boq": this.BOQvalue,
      // "is_site_visit": this.siteVal,
      "no_of_floors":this.projectForm.get('floor_no').value!=''?this.projectForm.get('floor_no').value:null ,
       "total_unit":unitlength,
       "plot_size":this.projectForm.get('plot_size').value,
       "plot_size_unit":this.projectForm.get('plotVal').value=='sq_ft'?'sq ft':'sq m',
      "buildup_area":this.projectForm.get('built_area').value,
      "buildup_area_unit":this.projectForm.get('builtVal').value=='built_sq_ft'?'sq ft':'sq m',
      "modifiedby": user['full_name'],
      "typeOfDesign": this.desgnTypeVal!= '' ? [this.desgnTypeVal] : null,
      "projectUnit": this.CostCalc('modifiedby'),

      // email: localStorage.getItem('email'),
      //   ...adr1 && {adr1: adr1},
      //  ...adr2 && { adr2:adr2},
      //  ...city && { city: city},
      //   ...contact_name && {primary_cont_name: contact_name},
      //  ...contact_type && {primary_cont_type:contact_type},

      "entityContact": {
        "id": null,
        "entity_id": null,
        name: this.projectForm.get('name').value,
        // position: this.projectForm.get('position').value ,
        // phone: this.projectForm.get('phone').value ,
        phone: this.phoneNumberValue,

        // mobile: this.projectForm.get('mobile').value ,
        email: this.projectForm.get('email').value,

      },






    }

    if (this.emailForm.get('emails').status=='VALID' && this.projectForm.status=='VALID' && (this.phoneNumberValue!=''?this.phoneInvalid==false:true) && this.allTagsIncluded==true) {
      this.spinner.show();
    return this.costService.UpdateCostProject(postData).subscribe(
      (data: any) => {

        // if (data.status == 200) {
          this.spinner.hide();
          // postData['id']=data['id']
          // this.projCostId=data['id'];
this.addformSubmitted=false;
if(this.milestoneData.length!=0){
  this.acrdn.refresh();

}
sessionStorage.clear();
const emails = this.emailForm.get('emails') as FormArray
    if (emails.length > 1) {
     emails.clear()

    } else {
     emails.clear()

    }
    const extras = this.extraUnitForm.get('extras') as FormArray
    if (extras.length > 1) {
     extras.clear()

    } else {
     extras.clear()

    }
    const miles = this.milestTaskForm.get('miles') as FormArray
    if (miles.length > 1) {
     miles.clear()

    } else {
     miles.clear()

    }
         this.callCostProj(data['id']);
          // this.toastr.success(data['desc'], undefined, {
          //   positionClass: 'toast-top-center'
          // });


       // }
        //  else {
        //   this.spinner.hide();

        //   Swal.fire(
        //     'Error!',
        //     data['result'].desc,
        //     'error'
        //   ).then(
        //     (result) => {
        //
        //     })
        // }
      },
      error => {
        this.spinner.hide();

        Swal.fire(
          'Error!',
          'Error.',
          'error'
        ).then(
          (result) => {

          })


      }

    )
    }

  }
  // public AddUnitDesc(){
  //
  // }
  public AddUnitDesc(index) {
    const emails = this.emailForm.get('emails') as FormArray



    // this.showAssigneeApprove=false;
    // this.showAssigneeLead=false;
    // this.showApprover=false;
    // this.submitClicked=true;
    // if(this.emailForm.get('emails').status=='VALID'){
      // emails.push(this.createEmailFormGroup())
      emails.insert(index+1, this.createEmailFormGroup());
    this.milestoneData=[];

    //this.submitClicked=false;
    let addValue;
    let tags=emails.value[index].tags
    if(isNaN(parseInt(tags[0].slice(-1))+1)){
      addValue=emails.value[index].tags[0] +' - '+ 1

    }else{
addValue=(emails.value[index].Label  +' - '+ (parseInt(tags[0].slice(-1))+1))

    }

  emails.at(index+1).patchValue({Label:  emails.value[index].Label,tags: [addValue]  })

  let tagsdata = [];

  for (var i = 0; i < emails.value.length; i++) {

    if (emails.value[i].tags && emails.value[i].tags.length != 0) {
      for (var j = 0; j < emails.value[i].tags.length; j++) {
        tagsdata.push(


           emails.value[i].tags[j],




        );
      }
    }
  }
 this.tagsArrayValue=tagsdata;
 const extras = this.extraUnitForm.get('extras') as FormArray


var results1 = [];
 for (var i = 0; i < extras.value.length; i++) {



  //  extras.push(this.createEmailFormGroup())
  extras.at(i).patchValue({ designType:['All'],tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
    extras.value[i].Label + ' - '+ (1), 'All'
  ]):''})
this.unitTypeVal='';
   // results1.push({ Label:  this.extraUnitData[i].text, id:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox,tags:([ this.extraUnitData[i].text + ' - '+ (1)]) })
  //  results1.push({designType:['All'],tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
  //   this.extraUnitData[i].text + ' - '+ (1), 'All'
  // ]):'' })
   // extras.controls.forEach(pair => pair.patchValue({ Label:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox }));


 }
// extras.patchValue(results1);

    //}
  }
  public AddExtraUnitDesc(index) {
    const emails = this.extraUnitForm.get('extras') as FormArray
this.extraunitTypeVal='';



    // this.showAssigneeApprove=false;
    // this.showAssigneeLead=false;
    // this.showApprover=false;
    // this.submitClicked=true;
    // if(this.emailForm.get('emails').status=='VALID'){
      // emails.push(this.createEmailFormGroup())
      emails.insert(index+1, this.createEmailFormGroup());
    //this.submitClicked=false;
    this.milestoneData=[];

    let addValue;
    let tags=emails.value[index].tags
    if(isNaN(parseInt(tags[0].slice(-1))+1)){
      addValue=emails.value[index].tags[0] +' - '+ 1

    }else{
addValue=(emails.value[index].Label  +' - '+ (parseInt(tags[0].slice(-1))+1))

    }

  // emails.at(index+1).patchValue({Label:  emails.value[index].Label,tags: [addValue]  })
  emails.at(index+1).patchValue({Label:  emails.value[index].Label,designType:['All'],tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
    addValue, 'All'
  ]):''  })

    //}
  }
  public RemoveExtraUnitDesc(i: number) {
    const emails = this.extraUnitForm.get('extras') as FormArray
    if (emails.length !=0) {
      emails.removeAt(i)
    }
    this.milestoneData=[];

  }
  public RemoveUnitDesc(i: number) {
    const emails = this.emailForm.get('emails') as FormArray
    const extras = this.extraUnitForm.get('extras') as FormArray
    if (emails.length !=0) {
      emails.removeAt(i)
    }
    this.milestoneData=[];


    let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {

      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(

             emails.value[i].tags[j],

          );
        }
      }
    }
 this.tagsArrayValue=tagsdata;

 var results1 = [];
 for (var i = 0; i < extras.value.length; i++) {



  //  extras.push(this.createEmailFormGroup())
  extras.at(i).patchValue({designType:['All'], tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
     'All'
  ]):''})

   // results1.push({ Label:  this.extraUnitData[i].text, id:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox,tags:([ this.extraUnitData[i].text + ' - '+ (1)]) })
  //  results1.push({designType:['All'],tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
  //   this.extraUnitData[i].text + ' - '+ (1), 'All'
  // ]):'' })
   // extras.controls.forEach(pair => pair.patchValue({ Label:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox }));


 }
//  extras.patchValue(results1);


  }
  public taskDelete(deptId){
    let postData={
      id:deptId
    }
    this.quotationService.RemoveQuotation(postData).subscribe(
      (data:any)  => {
        // let dataObj = JSON.parse(data['token']);

      if(data.status==200){
        this.GetPriorityByOrgID();

        this.toastr.error(data['desc'], undefined,{
          positionClass: 'toast-top-center'
     });
    }
        //  let dataObj = JSON.parse(data['token']);




      },
      error  => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result)=> {


          })


      }

      )
    }

    public callCostProj(xpost) {
      //  let postData={"id":"96e30345-8486-4511-a0f4-f708cf8a18d6","user_id":"da59e4af-6e4d-4818-a169-d74a90b1c2d9","org_id":"33781a87-ede0-439f-b890-93ad218b2859","cst_id":"c401ca89-8f25-4fdb-8f0d-231e204c8503","project_type_id":"d0f42298-1e54-4e9e-b51c-0f58d473dec7","project_name":"cost proj2","project_prefix":"JOB/20/05/16/000","createdby":"Hifza Kausar","typeOfDesign":[{"id":null,"org_id":"33781a87-ede0-439f-b890-93ad218b2859","project_id":null,"design_type_id":"98b7a8e0-6fef-4db4-8780-d3e763e40bb4","createdby":"Hifza Kausar"}],"projectUnit":[{"id":null,"org_id":"33781a87-ede0-439f-b890-93ad218b2859","project_id":null,"unit_id":"d55bcd4e-92a0-480e-bbf0-7fa6122dae74","unit_name":"Unit 3","no_of_unit":"1","unit_qty":2,"note":"sd","createdby":"Hifza Kausar","projectDesignType":[{"id":null,"org_id":"33781a87-ede0-439f-b890-93ad218b2859","project_id":null,"design_type_id":"7c8bebf5-7b51-4220-969f-d56ce9f15409","createdby":"Hifza Kausar"}],"projectTags":[{"id":null,"org_id":"33781a87-ede0-439f-b890-93ad218b2859","project_id":null,"tags":"Unit 31","createdby":"Hifza Kausar"}]}],"entityContact":{"id":null,"entity_id":null,"name":null,"email":null}}
        // let postData={"id":"46983803-06f7-4a93-b711-27fd5fcbed32","user_id":"16db3011-bde4-4c5a-b7b1-ae43912d9919","org_id":"44919b38-176e-45ce-9b12-db5faef620d6","cst_id":"c4ca8700-a71a-4064-9778-044f3eef0d00","project_type_id":"3d24fd61-6ab7-4b16-835f-98cc18d969de","project_name":"Cost proj1","project_prefix":"JOB/20/05/17/000","createdby":"Sazid Khan","typeOfDesign":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"5a4c49b3-3ca7-437e-9f51-c4fd7bca1843","createdby":"Sazid Khan"}],"projectUnit":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"unit_id":"61ce225b-1b45-409b-8d07-32129f0c365a","unit_name":"360 ( 3D )","no_of_unit":"2","unit_qty":3,"note":null,"createdby":"Sazid Khan","projectDesignType":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"5a4c49b3-3ca7-437e-9f51-c4fd7bca1843","createdby":"Sazid Khan"}],"projectTags":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )1","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )2","createdby":"Sazid Khan"}]}],"entityContact":{"id":null,"entity_id":null,"name":null,"email":null}}
       // let postData={"id":"12a4b0b2-149d-406f-9569-4d57489b93dd","user_id":"16db3011-bde4-4c5a-b7b1-ae43912d9919","org_id":"44919b38-176e-45ce-9b12-db5faef620d6","cst_id":"c4ca8700-a71a-4064-9778-044f3eef0d00","project_type_id":"3d24fd61-6ab7-4b16-835f-98cc18d969de","project_name":"Cost proj2","project_prefix":"JOB/20/05/18/000","createdby":"Sazid Khan","typeOfDesign":null,"projectUnit":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"unit_id":"61ce225b-1b45-409b-8d07-32129f0c365a","unit_name":"360 ( 3D )","no_of_unit":"2","unit_qty":"3","note":null,"createdby":"Sazid Khan","projectDesignType":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"79ce321c-42b2-4639-a2f7-680945a79794","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"df716fcc-6b44-4e8c-837d-0768d4f46289","createdby":"Sazid Khan"}],"projectTags":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )1","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )2","createdby":"Sazid Khan"}]},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"unit_id":"51b0cd6b-3cf2-4587-a88a-fe935b492614","unit_name":"Bed room","no_of_unit":"4","unit_qty":1,"note":"Bedroom4","createdby":"Sazid Khan","projectDesignType":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"ad1b2884-3de2-4ebb-9b4f-246b627564e9","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"5a4c49b3-3ca7-437e-9f51-c4fd7bca1843","createdby":"Sazid Khan"}],"projectTags":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"Bed room1","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"Bed room2","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"Bed room3","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"Bed room4","createdby":"Sazid Khan"}]}],"entityContact":{"id":null,"entity_id":null,"name":null,"email":null}}
      //let postData={"id":"16996e53-ad07-4003-a2b7-be433ee744bf","user_id":"16db3011-bde4-4c5a-b7b1-ae43912d9919","org_id":"44919b38-176e-45ce-9b12-db5faef620d6","cst_id":"c4ca8700-a71a-4064-9778-044f3eef0d00","project_type_id":"6122752e-25a0-406d-ab5c-9df839e36e6d","project_name":"Costproj5","project_prefix":"JOB/20/05/18/000","is_boq":false,"is_site_visit":false,"no_of_floors":2,"createdby":"Sazid Khan","typeOfDesign":null,"projectUnit":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"unit_id":"61ce225b-1b45-409b-8d07-32129f0c365a","unit_name":"360 ( 3D )","no_of_unit":"2","unit_qty":1,"note":null,"createdby":"Sazid Khan","projectDesignType_ID":["5a4c49b3-3ca7-437e-9f51-c4fd7bca1843"],"projectTags":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )1","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )2","createdby":"Sazid Khan"}]},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"unit_id":null,"unit_name":"360 (1)","no_of_unit":"3","unit_qty":2,"note":"gh","createdby":"Sazid Khan","projectDesignType_ID":["ad1b2884-3de2-4ebb-9b4f-246b627564e9"],"projectTags":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 (1)1","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 (1)2","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 (1)3","createdby":"Sazid Khan"}]}],"entityContact":{"id":null,"entity_id":null,"name":"sas","phone":"+971563874520","email":"as@gm.com"}}
        //  let postData={
        //   "id": "50219e5d-bded-4a4f-8406-397198850e40"
        //  }
         let postData={
          "id": xpost
         }
         this.GetProjectEstimationService(xpost);
      return this.costService.CalculateCostProject(postData).subscribe(
            (data: any) => {
              if (data) {
                this.spinner.hide();
      this.callCstId=data.cst_id;
              //  this.callCostProj(postData,id);
              let milestoneArray=[];
              // this.milestoneData=data['CostProjectMilestone'];
              if(data['CostProjectMilestone']){
              if( data['CostProjectMilestone'].length!=0){
                for (var i = 0; i < data['CostProjectMilestone'].length; i++) {
                  /* if(data['CostProjectMilestone'][i].milestone_name=='Study'){
                    milestoneArray[0]=data['CostProjectMilestone'][i]
                     if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                      let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseFloat(item.qty)).reduce((prev, next) => prev + next);
                    let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);
                    milestoneArray[0]['total_hrs']=total_hrs.toFixed(2)
                    milestoneArray[0]['total_cost']=total_cost.toFixed(2)
                    this.totalCostStudy=total_cost;
                     }
                  }
                  if(data['CostProjectMilestone'][i].milestone_name=='Design'){
                      milestoneArray[1]=data['CostProjectMilestone'][i]
                     if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                    let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseInt(item.qty)).reduce((prev, next) => prev + next);
                    let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);
                    milestoneArray[1]['total_hrs']=total_hrs.toFixed(2)
                    milestoneArray[1]['total_cost']=total_cost.toFixed(2)
                    this.totalCostDesign=total_cost;
                     }
                  }
                  if(data['CostProjectMilestone'][i].milestone_name=='Shop Drawing'){
                      milestoneArray[2]=data['CostProjectMilestone'][i]
                     if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                    let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseInt(item.qty)).reduce((prev, next) => prev + next);
                    let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);
                    milestoneArray[2]['total_hrs']=total_hrs.toFixed(2)
                    milestoneArray[2]['total_cost']=total_cost.toFixed(2)
                    this.totalCostDrawing=total_cost;
                     }
                  }
                  if(data['CostProjectMilestone'][i].milestone_name=='Extra Services'){
                      milestoneArray[3]=data['CostProjectMilestone'][i]
                     if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                    let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseInt(item.qty)).reduce((prev, next) => prev + next);
                    let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);
                    milestoneArray[3]['total_hrs']=total_hrs.toFixed(2)
                    milestoneArray[3]['total_cost']=total_cost.toFixed(2)
                    this.totalCostService=total_cost;
                     }
                  } */
                  milestoneArray[i]=data['CostProjectMilestone'][i]
                    if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                      console.log("data['CostProjectMilestone'][i]",data['CostProjectMilestone'][i]);
                      let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseInt(item.qty)).reduce((prev, next) => prev + next);
                      let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);
                      //console.log(milestoneArray[i]['alias_name'].replace(/\s/g, ""));
                      milestoneArray[i]['alias_name'] = milestoneArray[i]['alias_name'].replace(/\s/g, "");
                      milestoneArray[i]['total_hrs']=total_hrs.toFixed(2)
                      milestoneArray[i]['total_cost']=total_cost.toFixed(2)
                    //this.totalCostDesign=total_cost;
                    }
                          }
              }
              }
              this.milestoneData=milestoneArray;
              this.CURRENCY = 'CURRENCY';
              this.costProjectDetails=data;
      if(data.EntityContact!=null){
              for(var i=0;i<data.EntityContact.length;i++){
                if(data.EntityContact[i]['is_primary']==true){
                  this.primaryContact=data.EntityContact[i]
                }
              }
      }
               this.projectForm.patchValue({
                project_name: data.project_name,
               name: data.EntityContact!=null?data.EntityContact[0].name:'',
               phone: data.EntityContact!=null?data.EntityContact[0].phone:'',
               email: data.EntityContact!=null?data.EntityContact[0].email:'',
               floor_no:data.no_of_floors,
               built_area:data.buildup_area,
               plot_size:data.plot_size,
               city:data.EntityContact!=null?data.EntityContact[0].city:'',
               plotVal:data.plot_size_unit=='sq ft'?'sq_ft':'sq_m',
               builtVal:data.plot_size_unit=='sq ft'?'built_sq_ft':'built_sq_m',
              })
              this.project_prefix_val=data.project_prefix;
              if(data.TypeOfDesign){
                this.desgnTypeVal=data.TypeOfDesign.length!=0?data.TypeOfDesign[0]:'';
              }
              this.pkgTypeVal=data.package_id!=''?data.package_id:'';
              this.phone=data.EntityContact!=null?data.EntityContact.phone:'';
              this.projcountryValue=data.EntityContact!=null?data.EntityContact[0].country:'';
              if(data.cst_id!=null){
                           this.customerVal=data.cst_id
                          //  this.projcountryValue=data.customer.
                          }
                          // if(data.EntityContact!=null || data.EntityContact.length!=0){
                          //   this.showBranchList=true;
                          //   brList=data.EntityContact;
                          //   this.branchDataSource=data.EntityContact;
                          //   for(var i=0;i<data.EntityContact.length;i++){
                          //     if(data.EntityContact[i]['is_primary']==true){
                          //       this.primaryContact=data.EntityContact[i]
                          //     }
                          //   }
                          // }
            //  this.BOQChecked=data.is_boq;
            //  this.siteChecked=data.is_site_visit;
             var projectUnit = []
             // let dataObj = JSON.parse(data['token']);
             //
             for (var i = 0; i < data['ProjectUnit'].length; i++) {
               // logik to create new items
               projectUnit.push({
                 "id": data['ProjectUnit'][i].unit_id,
                 "text": data['ProjectUnit'][i].unit_name,
                 "is_checkbox": false
               });
             }
             this.createEditList(data['ProjectUnit']);
             this.createExtraEditList(data['ProjectUnitExtra'],data['ProjectUnit'])
              this.createMilestTaskForm(data['CostProjectMilestone'],data.no_of_floors);
              this.projTypeVal=data.project_type_id;
          setTimeout(()=>{
          const miles = this.milestTaskForm.get('miles') as FormArray
            let total_hrs=miles.value.map(item =>parseFloat(item.total_cost)).reduce((prev, next) => prev + next);
            this.totalHrs=total_hrs;
            let total_milesthrs=miles.value.map(item =>parseFloat(item.Qty)).reduce((prev, next) => prev + next);
            this.MilestHrs=parseFloat(total_milesthrs).toFixed(2);
            var value=total_hrs*(this.profit_margin/100);
            let result=Math.round(value*100)/100
            if(this.totalHrs!=0){
              this.profit_value=result ;
            }
            let net_total=this.profit_value+total_hrs;
            this.total_value=net_total;
            let vat=net_total*(5/100);
            this.vat_total=vat;
            this.net_total=vat+net_total;
            if(data.discount_amount!=null && data.discount_amount!=''){
              this.discount_amount=data.discount_amount;
              this.total_value=this.totalHrs+this.profit_value+parseFloat(data.discount_amount);
            }else{
              this.discount_amount='';
              //this.total_value=this.totalHrs+this.profit_value+parseFloat(data.discount_amount);
            }
              // let discountVal=(this.totalHrs)-(this.totalHrs *(e.target.value/100))
              //let discountVal=parseFloat(this.total_value)+parseFloat(data.discount_amount)
              //console.log('discountVal',discountVal,this.total_value)
              // total_cost=parseInt(Qty)+parseInt(e.value);
            if(data.discount_amount!=null && data.discount_amount!=''){
              // this.total_value=parseFloat(data.total_amount);
              // this.total_value=discountVal+(discountVal*(this.profit_margin/100));
              // let net_total=this.profit_value+total_hrs;
              //   this.total_value=net_total;
                let vat=this.total_value*(5/100);
                this.vat_total=vat;
                this.net_total=vat+this.total_value;
              //this.net_total=discountVal+(discountVal*(this.profit_margin/100));
            }
              }, 500);
              // setTimeout(()=>{
              //   this.prefilleditView(data['ProjectUnit'])
              //   }, 1500);
      //         const emails = this.emailForm.get('emails') as FormArray
      //     var results = [];
      //           // let dataObj = JSON.parse(data['token']);
      //           //
      //     for (var k = 0; k < emails.value.length; k++) {
      //     for (var i = 0; i < data['ProjectUnit'].length; i++) {
      //       if (emails.value[k].Label==data['ProjectUnit'][i].unit_name){
      //
      //        let index = (<FormArray>this.emailForm.get('emails')).controls.findIndex(x => x.value.id === data['ProjectUnit'][i].unit_id);
      //     var ejsResults=[]
      //
      //       // for (var j = 0; j < data['ProjectUnit'][i].ProjectDesignType.length; j++) {
      //       //   ejsResults.push(
      //       //     data['ProjectUnit'][i].ProjectDesignType[j].id,
      //       //   );
      //       // }
      //       var tags=[]
      //       for (var j = 0; j < data['ProjectUnit'][i].ProjectTags.length; j++) {
      //         tags.push(
      //           data['ProjectUnit'][i].ProjectTags[j].tags,
      //         );
      //       }
      //
      //   results.push({ unit_no: data['ProjectUnit'][i].no_of_unit ,size: data['ProjectUnit'][i].unit_qty ,designType:data['ProjectUnit'][i].ProjectDesignType_ID,tags: tags , is_checkbox:  false })
      //   emails.at(index).patchValue({ unit_no: data['ProjectUnit'][i].no_of_unit ,size: data['ProjectUnit'][i].unit_qty ,designType:data['ProjectUnit'][i].ProjectDesignType_ID,tags: tags , is_checkbox:  false })
      //  }
      //       //emails.controls.forEach(pair => pair.patchValue({ Label:  data['ProjectUnit'].id, is_checkbox:  data['ProjectUnit'].is_checkbox }));
      //     }
      //   }
         //emails.patchValue(results);
              } else {
                this.spinner.hide();
                Swal.fire(
                  'Error!',
                  data['result'].desc,
                  'error'
                ).then(
                  (result) => {
                  })
              }
            },
            error => {
              this.spinner.hide();
              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result) => {
                })
            }
          )
        }
  public createEditList(list) {
    const emails = this.emailForm.get('emails') as FormArray
    if (emails.length > 1) {
     emails.clear()

    } else {
     emails.clear()

    }
    this.editable=true;
    // const emails = this.emailForm.get('emails') as FormArray
    var results = [];
    for (var i = 0; i < list.length; i++) {
      if(list[i].ProjectTags.length!=0){

      emails.push(this.createEmailFormGroup())
      var tags=[]

      for (var j = 0; j < list[i].ProjectTags.length; j++) {

        tags.push(
          list[i].ProjectTags[j].tags,

        );

      }
    }
      results.push({ Label: list[i].unit_name, id: list[i].unit_id,size: list[i].unit_qty, is_checkbox:false,tags:tags,notes:list[i].note })
      // emails.controls.forEach(pair => pair.patchValue({ Label: list[i].id, is_checkbox: list[i].is_checkbox }));


    }
    emails.patchValue(results);


  }
  public createExtraEditList(list,mainlist) {
    const emails = this.extraUnitForm.get('extras') as FormArray
    const mainunit = this.emailForm.get('emails') as FormArray
    if (emails.length > 1) {
     emails.clear()

    } else {
     emails.clear()

    }
    this.editable=true;
    // const emails = this.emailForm.get('emails') as FormArray
    var results = [];

    let maintagsdata = [];

    // for (var i = 0; i < mainunit.value.length; i++) {

    //   if (mainunit.value[i].tags && mainunit.value[i].tags.length != 0) {
    //     for (var j = 0; j < mainunit.value[i].tags.length; j++) {
    //       tagsdata.push(


    //          mainunit.value[i].tags[j],




    //       );
    //     }
    //   }
    // }
    for (var i = 0; i < mainlist.length; i++) {


      var tags=[]

      for (var j = 0; j < mainlist[i].ProjectTags.length; j++) {

        maintagsdata.push(
          mainlist[i].ProjectTags[j].tags,

        );

      }

      // emails.controls.forEach(pair => pair.patchValue({ Label: list[i].id, is_checkbox: list[i].is_checkbox }));


    }

  //
  // var results1 = [];

  // for (var i = 0; i < emails.value.length; i++) {



  //   //  emails.push(this.createEmailFormGroup())
  //   emails.at(i).patchValue({ tags:tagsdata.length!=0?tagsdata.concat([
  //     emails.value[i].Label + ' - '+ (1), 'All'
  //   ]):''})
  // }
    for (var i = 0; i < list.length; i++) {

      emails.push(this.createEmailFormGroup())
      var tags=[]

      for (var j = 0; j < list[i].ProjectTags.length; j++) {

        tags.push(
          list[i].ProjectTags[j].tags,

        );

      }
      if(tags.includes("All")){
        tags=['All']
      }else{
        tags=tags
      }
      results.push({ Label: list[i].unit_name, id: list[i].unit_id,size: list[i].unit_qty, is_checkbox:false,designType:tags,tags: maintagsdata.concat([
        'All'
     ]),notes:list[i].note })
      // emails.controls.forEach(pair => pair.patchValue({ Label: list[i].id, is_checkbox: list[i].is_checkbox }));


    }
    emails.patchValue(results);


  }
  public openUnitModal(){
    $("#unit_modal").modal('show');

  }
  public prefilleditView(dataList){
            const emails = this.emailForm.get('emails') as FormArray

    var results = [];
          // let dataObj = JSON.parse(data['token']);
          //

    for (var k = 0; k < emails.value.length; k++) {

    for (var i = 0; i < dataList.length; i++) {
      if (emails.value[k].Label==dataList[i].unit_name){

       let index = (<FormArray>this.emailForm.get('emails')).controls.findIndex(x => x.value.id === dataList[i].unit_id);
    var ejsResults=[]


      // for (var j = 0; j < data['ProjectUnit'][i].ProjectDesignType.length; j++) {

      //   ejsResults.push(
      //     data['ProjectUnit'][i].ProjectDesignType[j].id,

      //   );

      // }
      var tags=[]

      for (var j = 0; j < dataList[i].ProjectTags.length; j++) {

        tags.push(
          dataList[i].ProjectTags[j].tags,

        );

      }


  // results.push({ unit_no: dataList[i].no_of_unit ,size: dataList[i].unit_qty ,designType:dataList[i].ProjectDesignType_ID,tags: tags , is_checkbox:  false })
  emails.at(index).patchValue({ unit_no: dataList[index].no_of_unit ,size: dataList[index].unit_qty ,designType:dataList[index].ProjectDesignType_ID,tags: tags ,notes:dataList[index].note, is_checkbox:  false })
 }
      //emails.controls.forEach(pair => pair.patchValue({ Label:  data['ProjectUnit'].id, is_checkbox:  data['ProjectUnit'].is_checkbox }));


    }
  }
  //  emails.patchValue(results);

  }
  public changedCustomer(e) {
    this.customerVal = e.value;
    if(e.value!=''){
      let postData={
        id:e.value
      }
      this.projectService.FindByCustomerId(postData).subscribe(
        (data:any)  => {

          this.projectForm.patchValue({
            // customer_Name:new FormControl(''),
            // contact_name:new FormControl(''),
            // customer_type:new FormControl(''),
            // customer_email:new FormControl(''),
            // customer_phone:new FormControl(''),
            // city:new FormControl(''),
            // customer_Name: data.cst_name,
            // customer_type:data.cst_type,
            // customer_phone:data.phone,

            // street_1:data.adr,
            // street_2:data.street,
               city:data.city!=null?data.city:'',








         name: data.entityContact.name,
        //  position: data.entityContact.position,
         phone: data.entityContact.phone,
        //  mobile: data.entityContact.mobile,
         email: data.entityContact.email



          })
          setTimeout(()=>{

            this.projcountryValue=data.country

                }, 500);
        // this.countryValue=data.country



        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(

            (result)=> {


            })


        }

        )
    }

    //  this.FindCustomProjectPrefixByOrgIDAndPrefix(this.customPrefix)
  }
  public changedPrefix(e: any): void {
    if (e.value == 2) {
      this.showPrefixText = true;
      this.prefixString = this.projectForm.get('prefix_name').value;
    } else {
      this.showPrefixText = false;

      //this.FindAutoProjectPrefixByOrgID();
      // this.prefixString='JOB/'+formattedPrefix;


    }
    this.prefixValue = e.value;

  }
  public onAddQtn(e){
    e.preventDefault()
    this.UpdateQuotationStageByQuotationID();
    // let loginUrl=this.utilService.getHostURL()+'Account/login';
    // let code = ''
    // if (this.customerForm.get('customer_phone').value) {
    //   let phoneNo = this.customerForm.get('customer_phone').value;
    //   code = phoneNo.dialCode.concat(phoneNo.number);
    // }
    let postData = {

      "id": null,
      "lead_id": this.projCostId,
      "project_type_id": this.projTypeVal,
      "package_id":this.pkgTypeVal,
      "project_name": this.projectForm.get('project_name').value,
      "quotation_prefix":this.projectForm.get('prefixVal').value=='is_auto'?this.prefixString:this.projectForm.get('prefix_name').value,
      "quotation_date": moment().format('L'),
      "customer_id": this.customerVal,
      "quotation_subject": this.projectForm.get('subject').value,
      "quotation_body": null,
      "warranty_id": this.warrantyVal,
      "validity": this.projectForm.get('validity').value,
      "payment_id":this.paymentVal,
      "mode_of_payment_id": this.paymentModeVal,
      "no_of_days": this.paymentModeTypeVal==1?this.projectForm.get('no_of_days').value:null,
      "exclusion_id":this.exclusionVal,
      "remarks": this.projectForm.get('remarks').value,
      "tax_id":this.taxVal,
      "stage_id": this.stageVal,

    }


    //



    // if (this.projCostId!='') {
    //   this.spinner.show();
    //   return this.quotationService.AddQuotation(postData).subscribe(
    //     (data: any) => {
    //
    //       if (data.status == 200) {
    //         this.GetAllCustomer();
    //         this.addCstformSubmitted = false;
    //         this.spinner.hide();
    //         this.countryValue='';
    //         this.warrantyVal='';
    //         this.paymentVal='';
    //         this.paymentModeTypeVal='';
    //         this.taxVal='';
    //         this.stageVal='';


    //         this.TaskView();
    //       }

    //     },
    //     error => {
    //       Swal.fire(
    //         'Error!',
    //         'Error.',
    //         'error'
    //       ).then(
    //
    //         (result) => {
    //
    //
    //         })
    //

    //     }

    //   )



    //  }
  }
  public onAddCustomer(e) {
    this.addCstformSubmitted = true;
    e.preventDefault()
    // let loginUrl=this.utilService.getHostURL()+'Account/login';
    // let code = ''
    // if (this.customerForm.get('customer_phone').value) {
    //   let phoneNo = this.customerForm.get('customer_phone').value;
    //   code = phoneNo.dialCode.concat(phoneNo.number);
    // }
    let postData = {


      "id": null,
      "cst_name": this.showOrgDetails?this.customerForm.get('company_Name').value:this.customerForm.get('customer_Name').value+' '+this.customerForm.get('last_Name').value,
      "first_name": this.customerForm.get('customer_Name').value,
      "last_name": this.customerForm.get('last_Name').value,
      "cst_type": null,
      "is_company":this.showOrgDetails,
      "email": this.customerForm.get('customer_email').value,
      "phone": this.customerForm.get('customer_phone').value,
      "company_name":this.showOrgDetails?this.customerForm.get('company_Name').value:null,

      "adr": this.customerForm.get('street_1').value,
      "street": this.customerForm.get('street_2').value,
      "country":this.countryValue,
      "city": this.customerForm.get('city').value,
      "annual_revenue": this.customerForm.get('revenue').value,
      "no_of_emp": this.customerForm.get('emp_no').value,
      "industry_id": this.showOrgDetails?this.industryValue:null,
      "website": this.showOrgDetails?this.customerForm.get('website').value:null,

      "EntityContact":this.customerForm.get('fname').value!=''? {
        "id": null,
        // "entity_id": "string",
        "entity_id": null,
        "name": this.customerForm.get('fname').value+' '+this.customerForm.get('lname').value ,
        "position": null,
        "phone": this.customerForm.get('phone').value,
        "mobile": null,
        "email": this.customerForm.get('email').value,
        "first_name": this.customerForm.get('fname').value,
        "last_name": this.customerForm.get('lname').value,
        "adr_1": null,
        "adr_2": null,
        "city": null,
        "country": null,
        "department": null,
        "relationship": this.customerForm.get('relationship').value,
        "designation": this.customerForm.get('desgn').value,
        "note":  this.customerForm.get('note').value,
      }:null
    }


    //



    if (( !this.showOrgDetails?(this.customerForm.get('customer_Name').value!=''&&this.customerForm.get('last_Name').value!='' ):true)&&this.customerForm.status=='VALID'&& (this.showOrgDetails?this.customerForm.get('company_Name').value!='':true)) {
      this.spinner.show();
      return this.projectService.AddCustomer(postData).subscribe(
        (data: any) => {

          if (data.status == 200) {
            this.OnCustomerClose();
            this.GetAllCustomer();
            this.addCstformSubmitted = false;
            this.spinner.hide();
            this.countryValue='';
            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });
          }

        },
        error => {
          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(

            (result) => {


            })


        }

      )



     }
  }
  onCstPhChange(event) {

    let phoneNo = {
      "PhoneNumber": event.dialCode + event.number
    }
    this.cstPhoneNumberValue = event.dialCode + event.number;
    this.empService.IsPhoneValid(phoneNo).subscribe(
      (data: any) => {

        if (data.status == 200) {
          this.cstPhoneInvalid = false;


        } else {
          this.cstPhoneInvalid = true;
          this.phoneErrorMsg = data['desc'];

        }




      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result) => {


          })


      }

    )
  }
  public OnCustomerClose() {

    this.cstPhone = '';
    this.cstPhoneInvalid = false;
    this.phoneErrorMsg = '';
    this.customerForm.reset();
    this.cstPhoneNumberValue='';
    this.showOrgDetails=false;
    $("#customer_modal").modal('hide');

  }
  public AddForm() {
    $.getScript('assets/js/pages/custom/user/edit-user.js')

    this.projectForm.reset();
    this.GetAllCustomer();
    this.FindAutoProjectPrefixByOrgID();
    this.GetAllProjectStatus();
   this.GetPkgByOrgID();
   this.findCostHrs();
   this.findprofitMargin();
   this.getCountryList();
   this.GetCostProjByOrgID();


    this.milestoneData=[];
    const emails = this.emailForm.get('emails') as FormArray
    if (emails.length > 1) {
     emails.clear()

    } else {
     emails.clear()

    }
    const extras = this.extraUnitForm.get('extras') as FormArray
    if (extras.length > 1) {
     extras.clear()

    } else {
     extras.clear()

    }
    const miles = this.milestTaskForm.get('miles') as FormArray
    if (miles.length > 1) {
     miles.clear()

    } else {
     miles.clear()

    }
     setTimeout(()=>{

      this.fetchUnitDesc();
      this.extraUnit();
          }, 1500);


    this.projectForm.patchValue({
      prefixVal: 'is_auto',
      startDate:moment().format('L'),
      floor_no:1,
      plotVal:'sq_ft',
      builtVal:'built_sq_ft'

    })
    this.showTaskList = false;
    this.showAddForm = true;
    this.AddNewSubmit = true;
    this.editable = false;
    this.showPrefixText = false;
    this.customPrefix = '';
    this.prefixExists = false;
    this.projCostId='';
    this.phone='';
    this.customerVal='';
    this.projTypeVal='';
    this.unitTypeVal='';
    this.extraunitTypeVal='';


  }
  public TaskView() {
    this.GetPriorityByOrgID();

    this.showTaskList = true;
    this.showAddForm = false;
    this.totalHrs=0;
    this.profit_value=0;
    this.net_total=0;
    sessionStorage.clear();


  }

  callGetExtensionsLead(id){
    this.quotationService.GetExtensionsLead({id}).subscribe((data) => {
      this.projectExtensionData = data;
      if(this.projectExtensionData.length !== 0){
        this.projectService.FindByProjectID({id: this.projectExtensionData[0].project_id }).subscribe((proData: any) => {
          let postData = {
            "grpID": proData.entityCustomer.id,
            "empID": proData.project_prefix
          }
          this.projectService.GetProjectByPrefixandCstId(postData).subscribe((prefixData: any) => {
            let projectPrefix = prefixData[0].project_prefix;
            let lastValue =  projectPrefix.split('/').pop();
            let letter = lastValue.charAt(0);

            if(letter !== 'E'){
              this.setExtensionPrefix = projectPrefix+'/E1';
            }else{

              let proPrefix = projectPrefix.substr(0, projectPrefix.lastIndexOf("/"))
              let getNumber = lastValue.slice(1);

              let setNumber = parseFloat(getNumber)+1;

              this.setExtensionPrefix = proPrefix+'/E'+setNumber;
             // console.log("this.setExtensionPrefix--->",this.setExtensionPrefix);
            }
          });
        });
      }
    });
  }

   getProjectAddtionalDtls(id) {
    let reqObj = {
      id:id
  }
  this.costEstimationService.GetProjectAddtionalDetailsByCstId(reqObj).subscribe((data: any) => {
    console.log("Project Addtional Details Exist--->",data);
    if(data.length > 0) {
       // this.addntlDtlsExist =true;
        this.estAddntlData = data[0];
    } else {
      this.estAddntlData = null;
      }
     });
   }



   updateProjectPreficoveeride(projectId) {

    let rqObj =  {
      "id": projectId,
      "amount": "string",
      "amountClm": "string"
    }
    this.projectService.updateProjectPreficoveeride(rqObj).subscribe((data:any)=>{
      if(data.status === 200) {
        console.log(data.status);
      }
    });

   }

   updateProjectIdinAddnlDtls(projectId){

    if(this.estAddntlData != null) {

      let rqObj =  {
        "id": this.estAddntlData.id,
        "org_id": this.estAddntlData.org_id,
        "cost_projectId": this.estAddntlData.cost_projectId,
        "projectId":projectId,
        "isMarketing": this.estAddntlData.isMarketing.toString(),
        "isComplimentary": this.estAddntlData.isComplimentary.toString(),
        "createdDate": moment().format('L'),
        "modifiedDate":moment().format('L'),
      }
      this.costEstimationService.UpdateProjectAdditionalDetails(rqObj).subscribe((data:any)=>{
        if(data.status === 200) {
          console.log(data.status);
        }
      });


    }







   }





  public qtnEdit(qtnId){
    this.GetAllCustomer();
    this.GetProjectTypeByOrgID();
       this.GetAllProjectStatus();
       this.findCostHrs();
       this.findprofitMargin();
       this.getCountryList();
   this.GetCostProjByOrgID();
this.spinner.show();
    let postData={
      id:qtnId
    }
       //this.fetchUnitDesc();
       // this.extraUnit();
       this.costService.FetchAllUnitDescriptionByOrgID().subscribe(
         (data: any) => {


   var typeOfUnit=[{id:'',text:'Select'}]

           for (var i = 0; i < data.length; i++) {
             typeOfUnit.push({
               "id": data[i].id,
               "text": data[i].unit_name,
             });

           }
           this.unitTypeData=typeOfUnit;

         }
       )

       var extratypeOfUnit=[{id:'',text:'Select'}]

       this.costService.FetchAllUnitDescriptionExtraByOrgID().subscribe(
         (data12: any) => {


           // this.dataSource =  new MatTableDataSource(data);
           // this.dataSource.paginator = this.paginator;
           //this.dataSource.sort = this.sort;
           var extraUnits=[]

           // let dataObj = JSON.parse(data['token']);
           //


           for (var i = 0; i < data12.length; i++) {
             // logik to create new items



             extratypeOfUnit.push({
               "id": data12[i].id,
               "text": data12[i].unit_name,
             });


           }
           this.extraunitTypeData=extratypeOfUnit;


         }
       )

       this.quotationService.FindByQuotationId(postData).subscribe(
        (data: any) => {

          this.callGetExtensionsLead(data.lead_id);
          this.getProjectAddtionalDtls(data.lead_id);
         // this.fetchPrjctPrefix();

          // this.dataSource =  new MatTableDataSource(data);
          // this.dataSource.paginator = this.paginator;
          //this.dataSource.sort = this.sort;

          // let dataObj = JSON.parse(data['token']);
          //
this.spinner.hide();

         setTimeout(()=>{this.costprojVal=data.lead_id,this.stageVal=data.stage_id},1000);
         this.callCostProj(data.lead_id);
         this.stage_name=data.stage_name;
         if(data.project_id!=null){
          this.showModifiedVal=true;
          this.FindModifiedSubTaskByProjectID(data.lead_id,data.project_id)

         }else{
           this.showModifiedVal=false;
         }
         if(data.stage_name=="Modified"){
          this.disableUpdateBtn=true;
          this.showUpdateBtn=true;

        }else{
          this.disableUpdateBtn=false;

        }
         this.projCostId=data.lead_id;
         this.costprojVal=data.lead_id;
         this.GetProjectIDByEstID(data.lead_id);
         this.GetProjectModifiationByEstID(data.lead_id);
         this.callCstId=data.customer_id;
         this.qtnPrefix=data.quotation_prefix;
         this.getContactList('');
         this.qtnCostDetails=data;
         this.ProjectTotal = parseFloat(data.total_amount)
         console.log('Justijnnn', this.ProjectTotal)
        //  setTimeout(()=>{
        //   this.callCostProj(data.lead_id);


        //       }, 500);

         }
      )
              this.AddNewSubmit=false;
             // setTimeout(()=>{
             //   this.emailForm.get('emails').valueChanges.subscribe(changes=> {
             //
             //     this.milestoneData=[]
             //     this.showUpdateCalculate=true;
             //   })
             //   this.extraUnitForm.get('extras').valueChanges.subscribe(changes=> {
             //
             //     this.milestoneData=[]
             //     this.showUpdateCalculate=true;


             //   })

             //       }, 2500);


   const emails = this.emailForm.get('emails') as FormArray
       if (emails.length > 1) {
        emails.clear()

       } else {
        emails.clear()

       }

       const extras = this.extraUnitForm.get('extras') as FormArray
       if (extras.length > 1) {
        extras.clear()

       } else {
        extras.clear()

       }

       const miles = this.milestTaskForm.get('miles') as FormArray
       if (miles.length > 1) {
        miles.clear()

       } else {
        miles.clear()

       }

         this.milestoneData=[];

              this.editable=true;
            this.editTaskId=qtnId;
            this.showTaskList=false;
            this.showAddForm=true;

            }
            GetProjectIDByEstID(estId){
              let postData={
                id:estId
              }
              this.projectService.GetProjectIDByEstID(postData).subscribe(
                (data: any) => {

                  if(data){
                    this.project_id=data.code;
console.log('project_iddata',this.project_id);
                  }

                }
              )
            }
            GetProjectModifiationByEstID(estId){
              let postData={
                id:estId
              }
              this.projectService.GetProjectModifiationByEstID(postData).subscribe(
                (data: any) => {

                  if(data.code!=null){
                    this.project_id=data.code;
                    this.modifyProjStaus=true;
                  }else{
                    this.modifyProjStaus=false;

                  }

                }
              )
            }
  public taskEdit(dept_id){
 this.GetAllCustomer();
 this.GetProjectTypeByOrgID();
    this.GetAllProjectStatus();
    this.findCostHrs();
    this.findprofitMargin();
    this.getCountryList();

    //this.fetchUnitDesc();
    // this.extraUnit();
    this.costService.FetchAllUnitDescriptionByOrgID().subscribe(
      (data: any) => {


var typeOfUnit=[{id:'',text:'Select'}]

        for (var i = 0; i < data.length; i++) {
          typeOfUnit.push({
            "id": data[i].id,
            "text": data[i].unit_name,
          });

        }
        this.unitTypeData=typeOfUnit;

      }
    )

    var extratypeOfUnit=[{id:'',text:'Select'}]

    this.costService.FetchAllUnitDescriptionExtraByOrgID().subscribe(
      (data12: any) => {


        // this.dataSource =  new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
        var extraUnits=[]

        // let dataObj = JSON.parse(data['token']);
        //


        for (var i = 0; i < data12.length; i++) {
          // logik to create new items



          extratypeOfUnit.push({
            "id": data12[i].id,
            "text": data12[i].unit_name,
          });


        }
        this.extraunitTypeData=extratypeOfUnit;


      }
    )
           this.AddNewSubmit=false;

          // setTimeout(()=>{
          //   this.emailForm.get('emails').valueChanges.subscribe(changes=> {
          //
          //     this.milestoneData=[]
          //     this.showUpdateCalculate=true;
          //   })
          //   this.extraUnitForm.get('extras').valueChanges.subscribe(changes=> {
          //
          //     this.milestoneData=[]
          //     this.showUpdateCalculate=true;


          //   })

          //       }, 2500);
           setTimeout(()=>{
            this.callCostProj(dept_id);


                }, 1000);

const emails = this.emailForm.get('emails') as FormArray
    if (emails.length > 1) {
     emails.clear()

    } else {
     emails.clear()

    }

    const extras = this.extraUnitForm.get('extras') as FormArray
    if (extras.length > 1) {
     extras.clear()

    } else {
     extras.clear()

    }

    const miles = this.milestTaskForm.get('miles') as FormArray
    if (miles.length > 1) {
     miles.clear()

    } else {
     miles.clear()

    }

      this.milestoneData=[];
           this.projCostId=dept_id;
          //  this.editable=true;
         this.editTaskId=dept_id;
         this.showTaskList=false;
         this.showAddForm=true;
    //        let postData={
    //          id:dept_id
    //        }
    //        this.costService.FindByCostProjectID(postData).subscribe(
    //          (data:any)  => {
    //
    //           this.project_prefix_val=data.project_prefix;
    //          this.projName=data.project_name;
    //          this.projTypeVal=data.project_type_id;
    //            this.projectForm.patchValue({

    //              project_name: data.project_name,
    //              desc:data.project_desc,
    //              startDate:moment(data.start_date).format('L'),
    //              endDate:moment(data.end_date).format('L'),

    //              // completeDate:moment(data.completed_date).format('L'),
    //              accessControl:data.is_private==true?'is_private':'is_public',
    //             // accessControl:new FormControl('')

    //             name: data.entityContact?data.entityContact.name:'',
    //  //  position: data.entityContact.position,
    //   phone: data.entityContact?data.entityContact.phone:'',
    //  //  mobile: data.entityContact.mobile,
    //   email: data.entityContact?data.entityContact.email:''



    //            })


    //           // this.EmpList();
    //            // this.DesgnList();

    //           if(data.entityCustomer){
    //            this.customerVal=data.entityCustomer.id

    //           }


    //          //   this.projectForm.valueChanges.subscribe(
    //          //     value=> {
    //          //
    //          //     }
    //          //  );

    //          //  this.projectForm.get('firstName').valueChanges.subscribe(val=>{
    //          //    if(data.first_name!=val){
    //          //

    //          //    }
    //          // })
    //          // this.projectForm.get('firstName')
    //          // .valueChanges
    //          // .pipe(pairwise())
    //          // .subscribe(([prev, next]: [any, any]) => {
    //          //
    //          //
    //          // });
    //            //this.EmpList();
    //           // this.departmentLeadValue=data.depart_lead_empid;
    //            //  let dataObj = JSON.parse(data['token']);
    //


    //

    //          },
    //          error  => {
    //            Swal.fire(
    //              'Error!',
    //              error,
    //              'error'
    //            ).then(
    //
    //              (result)=> {
    //
    //
    //              })
    //

    //          }

    //          )

         }
         hideMilestone(){
          this.milestoneData=[]
              this.showUpdateCalculate=true;
         }

  public GetPriorityByOrgID() {
    this.quotationService.GetAllQuotationByOrgID().subscribe(

      (data: any) => {

if(data){
  this.pgData=data;

  let ds= data.slice(0, this.pageSize);
  let ds1 = new DataManager(ds);
//this.projectData=ds1.dataSource['json'];
}
        let datas = new DataManager(data);
         this.projectData = datas.dataSource['json'];

        // data.forEach((data,index)=>{
        //   if(data){
        //    let index12=index+1;
        //
        //     this.projectData['index'].rowValue=index12;
        //          }
        //   });
        //   this.initialSort = {
        //     columns: [{ field: 'dep_name', direction: 'Ascending' },
        //     { field: 'alias', direction: 'Descending' }]
        // };


        this.pageSettings = { pageSizes: true, pageCount: 5 }
        this.toolbar = ['Search', 'ExcelExport', 'PdfExport',];


      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result) => {


          })


      }

    )
  }
  public GetCostProjByOrgID() {
    this.costService.FetchAllCostProjectByOrgID().subscribe(

      (data: any) => {

  var results = [{
    "id": '',
    "text": 'Select'
  }]

if(data){
  for (var i = 0; i < data.length; i++) {
    // logik to create new items

    results.push({
      "id": data[i].project_id,
      "text": data[i].project_name
    });

  }
}



  this.costprojectData = results;



      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result) => {


          })


      }

    )
  }

  public changedCostProj(e: any): void {
    if(e.value!=''){
        this.callCostProj(e.value);
     this.projCostId = e.value;

            }


  }
  toolbarClick(args: ClickEventArgs): void {
    switch (args.item.text) {
        case 'PDF Export':
            this.grid.pdfExport();
            break;
        case 'Excel Export':
            this.grid.excelExport();
            break;
        case 'CSV Export':
            this.grid.csvExport();
            break;
    }
}
  changed(e) {
    this.pageSize = e.pageSize;
    let start = (this.currentPage - 1) * e.pageSize;
    this.projectData = this.pgData.slice(start, start + e.pageSize);
  }
    click(args) {
    if (args.currentPage) {
      let start = (args.currentPage - 1) * this.pageSize;
      this.projectData = this.pgData.slice(start, start + this.pageSize);
    }
  }
  public GetAllCustomer() {
    this.projectService.GetAllCustomerByOrgID().subscribe(
      (data: any) => {
        var results = [{ 'id': '', text: 'Select' }]

        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            "id": data[i].id,
            "text": data[i].cst_name
          });

        }


        this.customerData = results
      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result) => {


          })


      }

    )
  }

  public customRadioChange() {

    if (this.projectForm.get('prefixVal').value == 'is_custom') {
      this.showPrefixText = true;

    } else {
      this.showPrefixText = false;
      // this.FindAutoProjectPrefixByOrgID();

    }
  }
  public customInputChange(e) {
    this.customPrefix = e.target.value;
    this.FindCustomProjectPrefixByOrgIDAndPrefix(this.customPrefix)
  }
  public FindAutoProjectPrefixByOrgID() {
    this.projectService.FindAutoCostProjectPrefixByOrgID().subscribe(

      (data: any) => {
        // this.project_prefix_val=data.project_prefix;

        if (data == null) {
          let jobNo = '000'
          this.prefixString = 'CST/' + formattedPrefix + '/' + jobNo;

        } else {
          let splittable;
          if (data.project_prefix) {
            let project_prefix = data.project_prefix;

            splittable = project_prefix.split('/');
          }
          // var splittable =  project_prefix.split('/');
          if (parseInt(splittable[4]).toString().length == 1) {
            let jobNo = '00' + (parseInt(splittable[4]) + 1)
            this.prefixString = 'CST/' + formattedPrefix + '/' + jobNo;

          } else if (parseInt(splittable[4]).toString().length == 2) {
            let jobNo = '0' + (parseInt(splittable[4]) + 1)
            this.prefixString = 'CST/' + formattedPrefix + '/' + jobNo;

          }
          else {
            let jobNo = (parseInt(splittable[4]) + 1)
            this.prefixString = 'CST/' + formattedPrefix + '/' + jobNo;

          }



        }
        //this.prefixString='JOB/'+formattedPrefix+'/'+this.jobNo;



      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result) => {


          })


      }

    )
  }

  public FindCustomProjectPrefixByOrgIDAndPrefix(prefix) {
    let postData = {

      Prefix: prefix


    }



    return this.projectService.FindCustomProjectPrefixByOrgIDAndPrefix(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        if (data != null) {
          this.prefixExists = true;
        } else {
          this.prefixExists = false;

        }
        // if(data.status==200){


        // }
      },
      error => {
        Swal.fire(
          'Error!',
          'Error.',
          'error'
        ).then(

          (result) => {


          })


      }

    )




  }
  public toCostLayout() {
    // localStorage.setItem('project_id',id);
    this.router.navigate(['/cost-layout']);

  }
  expand(e: ExpandEventArgs): void {
    if (e.isExpanded && [].indexOf.call(this.acrdn.items, e.item) === 1) {
      if (e.element.querySelectorAll('.e-accordion').length > 0) {
        return;
      }
      //Initialize Nested Accordion component
      let nestAcrdn: Accordion = new Accordion({
        expandMode: 'Single',
        items: [
          { header: 'Mood board', content: '#Sensor_features' },
          { header: '3D Sketch', content: '#Camera_features' },
          { header: 'Exterior Design', content: '#Video_Rec_features' },
        ]
      });
      let sdAcdn: Accordion = new Accordion({
        expandMode: 'Single',
        items: [
          { header: 'Main layout', content: '#Sensor_features' },
          { header: 'Partition layout', content: '#Camera_features' },
          { header: 'Furniture layout', content: '#Video_Rec_features' },
        ]
      });
      let studyAcdn: Accordion = new Accordion({
        expandMode: 'Single',
        items: [
          { header: 'Plan study', content: '#Sensor_features' },
          { header: 'Client Need Study', content: '#Camera_features' },
          { header: 'Zoning', content: '#Video_Rec_features' },
          { header: 'Presentation', content: '#Video_Rec_features' },
        ]
      });
      //Render initialized Nested Accordion component
      nestAcrdn.appendTo('#nested_Acc');
      studyAcdn.appendTo('#study_Acc');
      sdAcdn.appendTo('#sdAcdn');
    }
  }
  public GetProjectTypeByOrgID() {



    this.projectService.GetProjectTypeByOrgID().subscribe(

      (data: any) => {
        var results = [{
          "id": '',
          "text": 'Select'
        }]


        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            "id": data[i].id,
            "text": data[i].type_name
          });

        }


        this.projectTypeData = results;


      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result) => {


          })


      }

    )
  }
  isFieldValid(field: string) {
    // if(this.addformSubmitted){
    //   return (
    //   this.showerrorMsg=true,
    //     this.projectForm.get(field).errors && this.projectForm.get(field).touched ||
    //     this.projectForm.get(field).untouched &&
    //     this.addformSubmitted
    //   );
    // }
    // else if(this.editformSubmitted){
    //   return (
    //     this.showerrorMsg=true,

    //     this.projectForm.get(field).errors &&
    //     this.editformSubmitted
    //   );
    // }
    // else{

    //   return (
    //   this.showerrorMsg=false,

    //     false
    //   );
    // }
    // return (
    //   this.projectForm.get(field).errors && this.projectForm.get(field).touched ||
    //   this.projectForm.get(field).untouched &&
    //   this.formSubmitted && this.projectForm.get(field).errors  && this.projectForm.get(field).errors.patternValidator

    // );
  }
  constructor(private projectService: ProjectService,private userService:UserService,private taskService:TaskService, private quotationService: QuotationService,private leadService:LeadService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private costService: CostService, private formBuilder: FormBuilder, private countries: CountryService, private empService: EmployeeService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService, public histSer :HistoryService,
    public costEstimationService: costEstimationService) {



  }
  public plotSqftChange(e){

//    if(e.target.value=='sq-ft'){
// this.plotSqft='sq-ft';
// this.projectForm.patchValue({
//   plotVal:'sq-ft'
// })
//    }else{
//     this.plotSqm='sq-m';
//     this.projectForm.patchValue({
//       plotVal:'sq-m'
//     })
//    }

  }
  public createTaskForm(type) {
    const emails = this.emailForm.get('emails') as FormArray
    if (emails.length > 1) {
     emails.clear()

    } else {
     emails.clear()

    }
    var results = [];
    for (var i = 0; i < this.typeOfTask.length; i++) {

      emails.push(this.createEmailFormGroup())

      results.push({ Label: this.typeOfTask[i].text, id: this.typeOfTask[i].id, is_checkbox: this.typeOfTask[i].is_checkbox,tags:([this.typeOfTask[i].text + ' - '+ (1)]) })
      // emails.controls.forEach(pair => pair.patchValue({ Label: this.typeOfTask[i].id, is_checkbox: this.typeOfTask[i].is_checkbox }));


    }
    emails.patchValue(results);
    let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {

      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(


             emails.value[i].tags[j],




          );
        }
      }
    }
 this.tagsArrayValue=tagsdata;


    const extras = this.extraUnitForm.get('extras') as FormArray
    if (extras.length > 1) {
     extras.clear()

    } else {
     extras.clear()

    }
    // const extras = this.extraUnitForm.get('extras') as FormArray

    var results1 = [];
    for (var i = 0; i < this.extraUnitData.length; i++) {



      extras.push(this.createEmailFormGroup())

      // results1.push({ Label:  this.extraUnitData[i].text, id:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox,tags:([ this.extraUnitData[i].text + ' - '+ (1)]) })

      results1.push({ Label:  this.extraUnitData[i].text, id:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox,designType:['All'],tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
         'All'
      ]):'' })
      // extras.controls.forEach(pair => pair.patchValue({ Label:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox }));


    }
    extras.patchValue(results1);
  }

  getLeadHistory(id){
    this.histSer.getHistory(id).subscribe((data: any) => {
      console.log(data)
      if(data.length !== 0){
        this.historyData = data;
        this.noHistoryDataDiv = false;
        this.historyDataDiv = true;
      } else {
        this.noHistoryDataDiv = true;
        this.historyDataDiv = false;
      }
    });
  }


  public updateCostProjectTaskQtyTaskID(e,id,ischeck){

    if(ischeck==true && e.target.value!=''){
      this.spinner.show();
      let user_info: object;
    if (localStorage.getItem('user_info')) {
      user_info = JSON.parse(localStorage.getItem('user_info'));

    }
      let postData={
        "id": id,
        "project_id": null,
        "is_selected": true,
        "milestone_id": null,
        "task_name": null,
        "unit": null,
        "qty": e.target.value,
        "modifiedby": user_info['full_name'],
        "employees": null
      }

      return this.costService.UpdateCostProjectTaskQtyTaskID(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {
this.milestoneData=[];
            // this.addformSubmitted=false;
            setTimeout(()=>{
              this.GetMilestoneAndTasksByProjectID();

            },500)
            // this.spinner.hide();

            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }


        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(

            (result) => {


            })


        }

      )
    }

  }
  public GetMilestoneAndTasksByProjectID(){
      let user_info: object;
    if (localStorage.getItem('user_info')) {
      user_info = JSON.parse(localStorage.getItem('user_info'));

    }
      let postData={
        "id": this.projCostId,

      }

      return this.costService.GetMilestoneAndTasksByProjectID(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.length!=0) {

            // this.addformSubmitted=false;
            let milestoneArray;
            // this.milestoneData=data['CostProjectMilestone'];

              for (var i = 0; i < data.length; i++) {
                if(data[i].milestone_name=='Study'){

                  if(data[i]['CostProjectTask'].length!=0){
                  this.milestoneData[0]=data[i]

                    let total_hrs=data[i]['CostProjectTask'].map(item =>parseInt(item.qty)).reduce((prev, next) => prev + next);

                    // this.design_hrs=total_hrs;
                  this.milestoneData[0]['total_hrs']=total_hrs

                  }

                }
                if(data[i].milestone_name=='Design'){
                  if(data[i]['CostProjectTask'].length!=0){
                    this.milestoneData[1]=data[i]

                  let total_hrs=data[i]['CostProjectTask'].map(item =>parseInt(item.qty)).reduce((prev, next) => prev + next);

                  this.milestoneData[1]['total_hrs']=total_hrs
                  }
                }
                if(data[i].milestone_name=='Shop Drawing'){
                  if(data[i]['CostProjectTask'].length!=0){
                    this.milestoneData[2]=data[i]

                  let total_hrs=data[i]['CostProjectTask'].map(item =>parseInt(item.qty)).reduce((prev, next) => prev + next);

                  this.milestoneData[2]['total_hrs']=total_hrs
                  }
                }
                if(data[i].milestone_name=='Extra Services'){
                  if(data[i]['CostProjectTask'].length!=0){
                    this.milestoneData[3]=data[i]

                  let total_hrs=data[i]['CostProjectTask'].map(item =>parseInt(item.qty)).reduce((prev, next) => prev + next);

                  this.milestoneData[3]['total_hrs']=total_hrs
                  }
                }
                        }


            // this.milestoneData=milestoneArray;
            this.spinner.hide();
    const miles = this.milestTaskForm.get('miles') as FormArray

            let total_milesthrs= miles.value.reduce(function(sum, record){
              if(record.is_checkbox == true) return sum +parseInt(record.Qty) ;
              else return sum;
            }, 0);
            this.MilestHrs=total_milesthrs;
            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }


        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(

            (result) => {


            })


        }

      )


  }
  public UpdateCostProjectDiscountAndTotalCostTaskID(id,discount,cost){
    if(discount!=''){
      let user_info: object;
    if (localStorage.getItem('user_info')) {
      user_info = JSON.parse(localStorage.getItem('user_info'));

    }
      let postData={
        "id": id,
        "project_id": null,
        "is_selected": true,
        "milestone_id": null,
        "default_unit_hours": null,
        "unit": null,
        "qty": null,
        "notes": null,
        "discount_amount": discount,
        "total_cost_amount": cost,
        "modifiedby": user_info['full_name'],
        "employees": null
      }

      return this.costService.UpdateCostProjectDiscountAndTotalCostTaskID(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {

            // this.addformSubmitted=false;

            this.spinner.hide();

            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }


        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(

            (result) => {


            })


        }

      )
    }

  }
  public costChange(typeOfText){
    if(typeOfText=="costChange"){
      this.costText=true
    }else{
      this.costText=false

    }
  }
  UpdateCostProjectHrsTaskID(id,hrs,cost){
    if(hrs!=''){
      let user_info: object;
    if (localStorage.getItem('user_info')) {
      user_info = JSON.parse(localStorage.getItem('user_info'));

    }
      let postData={
        "id": id,
        "project_id": null,
        "is_selected": true,
        "milestone_id": null,
        "default_unit_hours": null,
        "budgeted_hours":null,
        "unit": null,
        "qty": hrs,
        "notes": null,
        "discount_amount": null,
        "total_cost_amount": cost,
        "modifiedby": user_info['full_name'],
        "employees": null
      }

      return this.costService.UpdateCostProjectBudgetedHoursTaskID(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {

            // this.addformSubmitted=false;

            this.spinner.hide();

            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }


        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(

            (result) => {


            })


        }

      )
    }

  }
  public UpdateCostProjectNotesQtyTaskID(e,id,ischeck){

    if(ischeck==true && e.target.value!=''){
      let user_info: object;
    if (localStorage.getItem('user_info')) {
      user_info = JSON.parse(localStorage.getItem('user_info'));

    }
      let postData={
        "id": id,
        "project_id": null,
        "is_selected": true,
        "milestone_id": null,
        "task_name": null,
        "unit": e.target.value,
        "qty": null,
        "modifiedby": user_info['full_name'],
        "employees": null
      }

      return this.costService.UpdateCostProjectNotesQtyTaskID(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {

            // this.addformSubmitted=false;

            this.spinner.hide();

            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }


        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(

            (result) => {


            })


        }

      )
    }

  }
  public UpdateCostProjectHrsQtyTaskID(e,id,ischeck){

    if(ischeck==true && e.target.value!=''){
      let user_info: object;
    if (localStorage.getItem('user_info')) {
      user_info = JSON.parse(localStorage.getItem('user_info'));

    }
      let postData={
        "id": id,
        "project_id": null,
        "is_selected": true,
        "milestone_id": null,
        "task_name": null,
        "unit": e.target.value,
        "qty": null,
        "modifiedby": user_info['full_name'],
        "employees": null
      }

      return this.costService.UpdateCostProjectNotesQtyTaskID(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {

            // this.addformSubmitted=false;

            this.spinner.hide();

            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }


        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(

            (result) => {


            })


        }

      )
    }

  }
  public updateIsSelect(e,id,index){

      let user_info: object;
    const miles = this.milestTaskForm.get('miles') as FormArray


    miles.at(index).patchValue({is_checkbox: e.srcElement.checked })

    if (localStorage.getItem('user_info')) {
      user_info = JSON.parse(localStorage.getItem('user_info'));

    }
      let postData={
        "id": id,
        "project_id": null,
        "is_selected": e.srcElement.checked,
        "milestone_id": null,
        "task_name": null,
        "unit": null,
        "qty": null,
        "modifiedby": user_info['full_name'],
        "employees": null
      }
      let hrs= miles.value.reduce(function(sum, record){
        if(record.is_checkbox == true) return sum +parseInt(record.total_cost) ;
        else return sum;
      }, 0);
      let total_milesthrs= miles.value.reduce(function(sum, record){
        if(record.is_checkbox == true) return sum +parseInt(record.Qty) ;
        else return sum;
      }, 0);
      this.MilestHrs=total_milesthrs;

this.totalHrs=hrs;
var value=hrs*0.1;
let result=Math.round(value*100)/100
this.profit_value=result;

// this.net_total=result+hrs;
let net_total=this.profit_value+hrs;
      let vat=net_total*(5/100);
      this.net_total=vat+net_total;
      return this.costService.UpdateIsSelectedByTaskID(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {

            // this.addformSubmitted=false;

            this.spinner.hide();

            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }


        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(

            (result) => {


            })


        }

      )


  }
public discUpdated(e){
  if(e.value>=-this.totalHrs){
    // let discountVal=(this.totalHrs)-(this.totalHrs *(e.target.value/100))
    let discountVal=this.totalHrs+(e.value)
    // total_cost=parseInt(Qty)+parseInt(e.value);

    this.total_value=discountVal+(discountVal*(this.profit_margin/100));
    // let net_total=this.profit_value+total_hrs;
    //   this.total_value=net_total;
      let vat=this.total_value*(5/100);
      this.vat_total=vat;
      this.net_total=vat+this.total_value;
    //this.net_total=discountVal+(discountVal*(this.profit_margin/100));


this.UpdateCostProjectDiscountAndProfitMarginByProjectID(e.value)

  }else{
    //
    this.toastr.error('Please enter a valid discount value', undefined, {
      positionClass: 'toast-top-center'
    });
  }
}
public UpdateCostProjectDiscountAndProfitMarginByProjectID(discount){
  if( discount.value!=''){
    let user_info: object;
  if (localStorage.getItem('user_info')) {
    user_info = JSON.parse(localStorage.getItem('user_info'));

  }
    let postData={
      "id": this.projCostId,
      "discount_amount": discount,
      "profit_margin_amount": this.net_total,
      "modifiedby": user_info['full_name'],

    }

    return this.costService.UpdateCostProjectDiscountAndProfitMarginByProjectID(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        if (data.status == 200) {

          // this.addformSubmitted=false;

          this.spinner.hide();

          this.toastr.success(data['desc'], undefined, {
            positionClass: 'toast-top-center'
          });

        }


      },
      error => {
        this.spinner.hide();

        Swal.fire(
          'Error!',
          'Error.',
          'error'
        ).then(

          (result) => {


          })


      }

    )
  }

}

markerDragEnd($event: MouseEvent) {

  this.latitude = $event.coords.lat;
  this.longitude = $event.coords.lng;
  this.drag=true

  this.getAddress(this.latitude, this.longitude);
}
taskDiscchange(taskid,e,index,Qty){
  const miles = this.milestTaskForm.get('miles') as FormArray
let total_cost;
this.costText=false;


 if(e.value>=-Qty){
  total_cost=parseInt(Qty)+(e.value);
  miles.at(index).patchValue({total_cost: total_cost })
  this.UpdateCostProjectDiscountAndTotalCostTaskID(taskid,e.value,total_cost)
    this.totalCostStudy=parseInt(this.totalCostStudy)+e.value;

//
 }else{
//
miles.at(index).patchValue({total_cost: Qty })
this.toastr.error('Please enter a valid discount value', undefined, {
  positionClass: 'toast-top-center'
});
 }


// let total_cost=(Qty-(Qty *(e.value/100)))
// total_cost=Math.round(total_cost*100)/100


 //   miles.at(index).patchValue({total_cost: total_cost })

    let hrs= miles.value.reduce(function(sum, record){
      if(record.is_checkbox == true) return sum +parseInt(record.total_cost) ;
      else return sum;
    }, 0);


setTimeout(()=>{
  this.totalHrs=hrs;
var value=hrs*(this.profit_margin/100);
let result=Math.round(value*100)/100
this.profit_value=result;
this.total_value=this.profit_value+hrs;

let vat=this.total_value*(5/100);
this.vat_total=vat;
this.net_total=vat+this.total_value;
},500)


}
hrschange(taskid,e,index,Qty){
  const miles = this.milestTaskForm.get('miles') as FormArray
let total_cost;

this.costText=false;

 if(e.target.value>=-Qty){
  total_cost=parseFloat(e.target.value)*(this.perunitCostHrs);
  miles.at(index).patchValue({total_cost: total_cost })
  this.UpdateCostProjectHrsTaskID(taskid,e.target.value,total_cost)

 }else{
miles.at(index).patchValue({total_cost: Qty })
this.toastr.error('Please enter a valid discount value', undefined, {
  positionClass: 'toast-top-center'
});
 }






    let hrs= miles.value.reduce(function(sum, record){
      if(record.is_checkbox == true) return sum +parseFloat(record.total_cost) ;
      else return sum;
    }, 0);
    let total_milesthrs=miles.value.map(item =>parseFloat(item.Qty)).reduce((prev, next) => prev + next);



setTimeout(()=>{
  this.MilestHrs=total_milesthrs;
  this.totalHrs=hrs;
var value=hrs*(this.profit_margin/100);
let result=Math.round(value*100)/100
this.profit_value=result;
this.total_value=this.profit_value+hrs;

let vat=this.total_value*(5/100);
this.vat_total=vat;
this.net_total=vat+this.total_value;
},500)


}

totalcostchange(taskid,e,index,Qty){
  const miles = this.milestTaskForm.get('miles') as FormArray
let total_cost;

if(this.costText==true){


this.UpdateCostProjectDiscountAndTotalCostTaskID(taskid,null,e.value)
 if(e.value>=-Qty){
  // total_cost=parseInt(Qty)+(e.value);
   miles.at(index).patchValue({total_cost: e.value })
  //this.UpdateCostProjectDiscountAndTotalCostTaskID(taskid,null,total_cost)
//
 }else{
//
miles.at(index).patchValue({total_cost: Qty })
this.toastr.error('Please enter a valid discount value', undefined, {
  positionClass: 'toast-top-center'
});
 }


// let total_cost=(Qty-(Qty *(e.value/100)))
// total_cost=Math.round(total_cost*100)/100


 //   miles.at(index).patchValue({total_cost: total_cost })

    let hrs= miles.value.reduce(function(sum, record){
      if(record.is_checkbox == true) return sum +parseFloat(record.total_cost) ;
      else return sum;
    }, 0);


// this.totalHrs=hrs;
// var value=hrs*(this.profit_margin/100);
// let result=Math.round(value*100)/100
// this.profit_value=result;

// this.net_total=this.profit_value+hrs;

setTimeout(()=>{
  this.totalHrs=hrs;
var value=hrs*(this.profit_margin/100);
let result=Math.round(value*100)/100
this.profit_value=result;
this.total_value=this.profit_value+hrs;

let vat=this.total_value*(5/100);
this.vat_total=vat;
this.net_total=vat+this.total_value;
},500)
}
}

public findCostHrs(){
  this.costService.FetchCostPerHourOrgID().subscribe(
    (data:any)  => {
if(data.length!=0){

this.perunitCostHrs=parseFloat(data[0].cost_per_hour);

}
})
}
public findprofitMargin(){
  this.costService.FetchProfitMarginOrgID().subscribe(
    (data:any)  => {
if(data.length!=0){

this.profit_margin=parseInt(data[0].profit_margin);

}
})
}

  public createMilestTaskForm(data,floorNo) {
    const miles = this.milestTaskForm.get('miles') as FormArray
    var results = [];

    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i]['CostProjectTask']['length']; j++) {

if(data[i]['CostProjectTask'].length!=0){
  miles.push(this.createMilesTaskFormGroup())

 let unitQty=(data[i].CostProjectTask[j].qty!='' || data[i].CostProjectTask[j].qty!=null) ?parseFloat(data[i].CostProjectTask[j].qty).toFixed(2):'';
      results.push({ Label: data[i].CostProjectTask[j].task_name,UnitType: '2',Qty: unitQty, id: data[i].CostProjectTask[j].milestone_id, taskid:data[i].CostProjectTask[j].id,is_checkbox:data[i].CostProjectTask[j].is_selected,Unit:data[i].CostProjectTask[j].total_unit,Unithrs:data[i].CostProjectTask[j].default_unit_hours,
      total_cost:(data[i].CostProjectTask[j].total_cost_amount!=null?parseFloat(data[i].CostProjectTask[j].total_cost_amount).toFixed(2):(data[i].CostProjectTask[j].qty*this.perunitCostHrs).toFixed(2)),profit:data[i].CostProjectTask[j].discount_amount!=null?data[i].CostProjectTask[j].discount_amount:'',perUnit:data[i].CostProjectTask[j].unit!=null?data[i].CostProjectTask[j].unit_type:'',
      floorUnit:data[i].CostProjectTask[j].unit_type
    })
      miles.controls.forEach(pair => pair.patchValue({ is_checkbox: 'true'}));
}

      }


    }
    miles.patchValue(results);



  }
  private createEmailFormGroup(): FormGroup {
    return new FormGroup({
      // 'emailAddress': new FormControl('', Validators.email),
      'id': new FormControl(''),

      'Label': new FormControl(''),
      'is_checkbox': new FormControl(''),
      // 'UnitType': new FormControl(''),
      // 'Qty': new FormControl(''),
      'tags': new FormControl('', Validators.required),
      // 'unit_no': new FormControl(''),
      'size': new FormControl(''),
      'notes': new FormControl(''),
      'designType': new FormControl(''),
      'checkbox_value': new FormControl('')



    })
  }
  private createMilesTaskFormGroup(): FormGroup {
    return new FormGroup({
      // 'emailAddress': new FormControl('', Validators.email),
      'id': new FormControl(''),
      'taskid': new FormControl(''),

      'Label': new FormControl(''),
      'is_checkbox': new FormControl(''),
      'UnitType': new FormControl('', Validators.required),
      'Qty': new FormControl('', Validators.required),
      'Unit': new FormControl(''),
      'notes': new FormControl(''),
      'Unithrs': new FormControl(''),
      'total_cost': new FormControl(''),
      'profit': new FormControl(''),
      'perUnit': new FormControl(''),

      'floorUnit': new FormControl(''),




    })
  }
  public changedEjsAssignee(e,index): void {
    const emails = this.emailForm.get('emails') as FormArray


    let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {

      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(


             emails.value[i].tags[j],




          );
        }
      }
    }
 this.tagsArrayValue=tagsdata;

//     const extras = this.extraUnitForm.get('extras') as FormArray


// if(extras.value[index].designType[0]!='All' || extras.value[index].designType.length==0 ){
//   extras.at(index).patchValue({ tags:this.tagsArrayValue.length!=0?this.tagsArrayValue:[] })

//  }



  }
  changedExtraTags(e, index){

    const emails = this.emailForm.get('emails') as FormArray


    let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {

      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(


             emails.value[i].tags[j],




          );
        }
      }
    }
 this.tagsArrayValue=tagsdata;

    const extras = this.extraUnitForm.get('extras') as FormArray


// if(extras.value[index].designType[0]=='All' || extras.value[index].designType.length==0 ){
  extras.at(index).patchValue({ tags:this.tagsArrayValue.length!=0?this.tagsArrayValue:[] })

//  }
  }
  public onCustomValueSelection(e,index){
    // args.cancel = true;
    // dropObj.mainList.querySelector('li[datavalue="'+dropObj.inputElement.value+'"]').remove();
    //  dropObj.mainData.pop();
    const extras = this.extraUnitForm.get('extras') as FormArray

this.milestoneData=[];
  //   if(extras.value[index].designType[0]=='All'){
  // extras.at(index).patchValue({ designType:'' })

  //   }

}
  public qtyChange(e, index) {

    const emails = this.emailForm.get('emails') as FormArray

    for (var i = 0; i < emails.value.length; i++) {
      if (emails.value[i].is_checkbox == false
        && emails.value[i].unit_no != '' ) {
        let tagsArray = [];

        let taglength =  emails.value[index].unit_no;

        for (var j = 0; j < taglength; j++) {
          tagsArray.push(emails.value[index].Label + ''+ (j + 1))
        }


        emails.at(index).patchValue({ tags: tagsArray })



      }

    }
  }
  public onAddDesignType() {
    // this.addformSubmitted=true;
    //  let date=document.getElementById('dueDate').innerText
    //  $("#dueDate").html("18:56:00");
    //

    // this.teamCount=this.teamMemFetchData.length;


    // team_member_empid.push(user_info['id'])
    let postData = {

      design_name: this.designTypeForm.get('design_Name').value,


    }



    if (this.designTypeForm.get('design_Name').value != '') {
      this.spinner.show();

      return this.costService.AddTypeOfDesign(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {

            // this.addformSubmitted=false;

            this.spinner.hide();
            $('#design_type_modal').modal('hide');
            this.designTypeForm.reset();
this.fetchDesignType();
            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }


        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(

            (result) => {


            })


        }

      )

    }


  }
  public fetchUnitDesc() {
    this.typeOfTask = []

    this.costService.FetchAllUnitDescriptionByOrgID().subscribe(
      (data: any) => {

var results=[]
        // this.dataSource =  new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
var typeOfUnit=[{id:'',text:'Select'}]
        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data.length; i++) {
          // logik to create new items


          typeOfUnit.push({
            "id": data[i].id,
            "text": data[i].unit_name,
          });
            results.push({
              "id": data[i].id,
              "text": data[i].unit_name,
              "is_checkbox": data[i].is_checkbox
            });


        }
        this.typeOfTask = results;
        this.unitTypeData=typeOfUnit;

          // this.createTaskForm('onCreate');

      }
    )


  }
  public extraUnit(){
    this.extraUnitData = []
    var extratypeOfUnit=[{id:'',text:'Select'}]

    this.costService.FetchAllUnitDescriptionExtraByOrgID().subscribe(
      (data12: any) => {


        // this.dataSource =  new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
        var extraUnits=[]

        // let dataObj = JSON.parse(data['token']);
        //


        for (var i = 0; i < data12.length; i++) {
          // logik to create new items



          extratypeOfUnit.push({
            "id": data12[i].id,
            "text": data12[i].unit_name,
          });
            extraUnits.push({
              "id": data12[i].id,
              "text": data12[i].unit_name,
              "is_checkbox": data12[i].is_checkbox
            });

        }
        this.extraUnitData =extraUnits;
        this.extraunitTypeData=extratypeOfUnit;

        // this.createTaskForm('onCreate');

      }
    )
  }

  public FindModifiedSubTaskByProjectID(lead_id,projid){
    let modifyPostData={
      "estID": lead_id,
      "projectID": projid
     }

     this.projectService.FindModifiedSubTaskByProjectID(modifyPostData).subscribe(
      (data: any) => {

        if (data.length!=0) {


          this.spinner.hide();
          this.removedTaskList=data;
          this.modified_cost=data.map(item =>parseFloat(item.amount!=null?item.amount:0)).reduce((prev, next) => prev + next);
           let decimalValues=[];
           for(var i=0;i<data.length;i++){
             let t = data[i].worked_hrs.split(':');
             var dec = parseInt(t[0], 10)*1 + parseInt(t[1], 10)/60;
           decimalValues.push(dec)
           }
          let modified_hrs=decimalValues.map(item =>parseFloat(item!=null?item:0)).reduce((prev, next) => prev + next);
          var sign = modified_hrs < 0 ? "-" : "";
          var min = Math.floor(Math.abs(modified_hrs));
          var sec = Math.floor((Math.abs(modified_hrs) * 60) % 60);
          this.modified_hrs=sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec
          let addedTaskList=[]
          let deletedTaskList=[]
       for(var i=0;i<data.length;i++){
         if(data[i].is_added==1){
          addedTaskList.push(data[i])
         }else{
          deletedTaskList.push(data[i])


         }
       }
       this.deletedTaskList=deletedTaskList;
       this.addedTaskList=addedTaskList;
           //this.modified_cost=data.map(item =>parseFloat(item.amount)).reduce((prev, next) => prev + next);
  console.log('modified_cost',this.modified_cost)

        }else{
          this.modified_cost=0

        }

      },
      error => {
        this.spinner.hide();

        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          (result) => {

          })


      }

    )

  }
  public locationSetUp(){

    this.mapsAPILoader.load().then(() => {
      //this.nearByPlaces();
     this.geoCoder = new google.maps.Geocoder;
  //  if(this.editableLoc==false){
     this.setCurrentLocation();

  //  }
  // let nearby=new google.maps.places.PlacesService(document.createElement('div'));
  // nearby.nearbySearch({
  //   location: {lat: this.latitude, lng: this.longitude},
  //   radius: 100,

  // }, (results,status) => {
  //   if (status === google.maps.places.PlacesServiceStatus.OK) {
  //     for (var i = 0; i < results.length; i++) {
  //       // this.createMarker(results[i]);
  //
  //     }
  //   }
  //   this.nearbyPlaces=results;

  // });
  let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);






        autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result

         let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        this.address = place.formatted_address;

         this.changedLocationData=place;
         this.getChangedMatchedTypes();

         this.changed_address=place.formatted_address;
        // this.web_site = place.website;
        // this.name = place.name;


        //set latitude, longitude and zoom
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.zoom = 12;
        // this.showNearbyPlaces=false;
        if(this.searchElementRef.nativeElement==''){
          // this.showNearbyPlaces=true;

        }
      });
    });



  });
  }
  public getChangedMatchedTypes() {
    let address_components
    if(this.changedLocationData.length!=0){
       address_components=this.changedLocationData['address_components']

    }


    let i,
        j,
        types;
    let address_component;
    // Loop through the Geocoder result set. Note that the results
  // array will change as this loop can self iterate.
  for( i=0;i<address_components.length;i++){
    types = address_components[i]['types'];



    for (j = 0; j < types.length; j++) {
      if (types[j] == 'street_number') {




     this.changed_street_number = address_components[i]['short_name'];


      }
      if (types[j] === 'route') {
        this.changed_route =  address_components[i]['long_name'];
      }
      // if (types[j] === 'formatted_address') {
      //   this.formatted_address =  address_components[i]['long_name'];
      // }
      // if (types[j] === 'neighborhood') {
      //   this.changed_street_number =  address_components[i]['long_name'];
      // }
      if (types[j] === 'locality') {
        this.changed_locality =  address_components[i]['long_name'];
      }
      if (types[j] === 'administrative_area_level_1') {
        this.changed_administrative_area_level_1 =  address_components[i]['long_name'];
      }
      if (types[j] === 'administrative_area_level_2') {
        this.changed_administrative_area_level_2 =  address_components[i]['long_name'];
      }
      if (types[j] === 'postal_code') {
        this.changed_postal_code =  address_components[i]['long_name'];
      }
      if (types[j] === 'country') {
        this.changed_country =  address_components[i]['long_name'];
      }

    }
  }


      // address_component = address_components[element];




}

changedStage(e: any): void {
   this.stageVal = e.value;
  if(e.value!='' && (e.value!='Select')){
    console.log('e',e.data)
    if(e.data!=null && e.data.length!=0 && e.data[0].text=="Closed Won"){
      this.showUpdateBtn=true;
      this.GentLastAddedProjectPrefixPrefixByOrgID();
      this.callGetExtensionsLead(this.projCostId);
    }else{
      this.showUpdateBtn=false;

    }

  }


}
  public openStatusModal(){
   this.locationSetUp();
   console.log('this.project_id',this.project_id)
   this.checkIfPojectPaymentExist();

    const miles = this.milestTaskForm.get('miles') as FormArray
   let arrayOfMiles=[];
   let arrayOfTasks=[];
    for (var k = 0; k < this.milestoneData.length; k++) {

      for (var i = 0; i < miles.value.length; i++) {
        if (miles.value[i].id==this.milestoneData[k].id){

          arrayOfMiles.push(
            {
              // "id": "string",
              // "org_id": "string",
              // "project_id": "string",
              "milestone_name": this.milestoneData[k].milestone_name,
              // "created_date": "string",
              // "createdby": "string",
              // "modified_date": "string",
              // "modifiedby": "string",
              // "is_deleted": true,
            }
          )
   }
        //emails.controls.forEach(pair => pair.patchValue({ Label:  data['ProjectUnit'].id, is_checkbox:  data['ProjectUnit'].is_checkbox }));


      }
    }
    let result = [];

//javascript array has a method foreach that enumerates keyvalue pairs.
miles.value.forEach(
    r => {
        //if an array index by the value of id is not found, instantiate it.
        if( !result[r.id]  ){
            //result gets a new index of the value at id.

            result[r.id] = [];
        }
        //push that whole object from api_array into that list
        result[r.id].push(r);
    }
);
for (var k = 0; k < this.milestoneData.length; k++) {
// for (var j = 0; j <result.length; j++) {
   if (result[this.milestoneData[k].id]==this.milestoneData[k].id){

   }
// }

}


    let costProjectMilestone= [
      {
        "id": "string",
        "org_id": "string",
        "project_id": "string",
        "milestone_name": "string",
        "created_date": "string",
        "createdby": "string",
        "modified_date": "string",
        "modifiedby": "string",
        "is_deleted": true,
        "costProjectTask": [
          {
            "id": "string",
            "project_id": "string",
            "is_selected": true,
            "milestone_id": "string",
            "task_name": "string",
            "unit": "string",
            "qty": "string",
            "created_date": "string",
            "createdby": "string",
            "modified_date": "string",
            "modifiedby": "string",
            "is_deleted": true
          }
        ]
      }
    ]

   $('#cost_status_modal').modal('show');
   this.fetchPrjctPrefix();
   this.statusForm.patchValue({
    startDate:moment().format('L')
  })

  }
  public groupBy( array , f )
{
  var groups = {};
  array.forEach( function( o )
  {
    var group = JSON.stringify( f(o) );
    groups[group] = groups[group] || [];
    groups[group].push( o );
  });
  return Object.keys(groups).map( function( group )
  {
    return groups[group];
  })
}

  public OnStatusModalClose(){
    $('#cost_status_modal').modal('hide');
    (this.paymentMethodologyForm.get('paymentPolicy') as FormArray).clear();
    this.paymentNameMethodologyForm.reset();

  //  (this.advancePymntForm.get('advpaymentPolicy') as FormArray).clear();
    this.advancePymntForm.reset();
    this.isPaymentAdvance = false;

    this.checkRetType = false;
  }

  public  GetAllProjectStatus(){
    this.projectService.GetAllProjectStatus().subscribe(

      (data:any) => {

    var results=[{ id: '', text: 'Select an option' }]
        // let dataObj = JSON.parse(data['token']);
      //

  for (var i = 0; i < data.length; i++) {
  // logik to create new items

  results.push({
      "id": data[i].id,
      "text": data[i].project_status_name
  });
  if(data[i].project_status_name=='Open'){
    this.projStatus=data[i].id
  }

  }


  this.projectStatusData =results;


      },
      error  => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result)=> {


          })


      }

      )
      }

      public changedCostStatus(e: any): void {
        this.projStatus= e.value;

      }
      public  GetPkgByOrgID(){
        this.costService.FetchAllPackagesByOrgID().subscribe(

          (data:any) => {

          //this.dataSource = new MatTableDataSource(data);
          var results=[{ id: '', text: 'Select' }]
          // let dataObj = JSON.parse(data['token']);
        //
      if(data){
        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
              "id": data[i].id,
              "text": data[i].package_name
          });


          }
      }



    this.packageTypeData =results;


          },
          error  => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(

              (result)=> {


              })


          }

          )
          }
          public viewCloseAct(id){
            $("#close_act_modal").modal('show');
            this.GetLocalActivitieEntityID(id)

          }
          GetLocalActivitieEntityID(id) {
            this.spinner.show();
            let postData={
              "id": id
            }
            this.quotationService.GetLocalActivitieEntityID(postData).subscribe(
              (data: any) => {
                this.spinner.hide();

                // let dataObj = JSON.parse(data['token']);
                //
                if(data.length!=0){
                  this.closeActData=data[0];
                }




              },
              error => {
                Swal.fire(
                  'Error!',
                  error,
                  'error'
                ).then(

                  (result) => {


                  })


              }

            )
          }
          onCloseActClose(){
            $("#close_act_modal").modal('hide');
            this.closeActBtn.nativeElement.click();

          }
          onOpen(args) {
            // args.popup.position = { X: "left", Y: "top" }; // changing popup position
            // args.popup.position = { X: "top", Y: "top" };
            args.popup.offsetX=0; // changing the popup position with set any number value
              args.popup.offsetY=-150;
          }

      public onUpdateStatus() {
this.submitClicked=true;
let user_info= JSON.parse(localStorage.getItem('user_info'));

        if(this.cstmPrefix != null && this.cstmPrefix.length > 0) {
          this.prefixString = this.cstmPrefix;
          console.log("**Updated the Prefix***")
        }

        let postData = {

          "id": this.projCostId,
          "quotation_id": sessionStorage.getItem('qtnId'),
          "project_status_id": this.projStatus,
          "emp_id": user_info['id'],
          "project_prefix": this.prefixString,
          start_date:moment(this.startdateValue).format('L') ,
    end_date: moment(this.enddateValue).format('L'),
    "entityLocation":this.searchElementRef.nativeElement.value!=''? {
      "id":null,
      "entity_id": null,
      "geo_address":this.searchElementRef.nativeElement.value,
      "formatted_address": this.changed_address?this.changed_address:this.formatted_address,
          "lat": this.latitude?JSON.stringify(this.latitude):"",
          "lang": this.longitude?JSON.stringify(this.longitude):"",
          "street_number": this.changed_street_number?this.changed_street_number:this.street_number,
          "route": this.changed_route?this.changed_route:this.route,
          "locality": this.changed_locality?this.changed_locality:this.locality,
          "administrative_area_level_2": this.changed_administrative_area_level_2?this.changed_administrative_area_level_2:this.administrative_area_level_2,
          "administrative_area_level_1": this.changed_administrative_area_level_1?this.changed_administrative_area_level_1:this.administrative_area_level_1,
          "postal_code": this.changed_postal_code?this.changed_postal_code:this.postal_code,
          "country":  this.changed_country?this.changed_country:this.country,
          "city": this.changed_administrative_area_level_1?this.changed_administrative_area_level_1:this.administrative_area_level_1,

    }:null

        }

        console.log("postData--->",postData);
        //debugger

        if (this.projStatus != '' && this.statusForm.status=='VALID') {
          this.spinner.show();
    this.UpdateQuotationStageByQuotationID();
          return this.costService.UpdateCostProjectStatusByID(postData).subscribe(
            (data: any) => {
              let projectID = data.code
              let sendData = {
                entity_id: projectID,
                event_type: "Quotation converted to project",
                event_desc: "Quotation converted to project",
                };
                let revenueData ={
                  "estimation_id": this.projCostId,
                  "project_id": data.code,
                  "org_id": localStorage.getItem('org_id'),
                }
                console.log('revenueData',revenueData);
                this.updateProjectIdinAddnlDtls(data.code);

                if(this.cstmPrefix != null && this.cstmPrefix.length > 0) {
                this.updateProjectPreficoveeride(data.code);
                }

                this.addPaymentPolicy(data.code);
                this.histSer.AddEntityHistoryLog(sendData).subscribe((data: any)=> {
                  console.log(data)
                    if(data){
                      this.getLeadHistory(projectID);
                    }
                });


              if (data.status == 200) {
                this.submitClicked=false;
                this.TaskView();

                this.spinner.hide();
                this.toastr.success(data['desc'], undefined, {
                  positionClass: 'toast-top-center'
                });
                 this.costService.UpdateProjectIdTask(revenueData).subscribe(
                  (data: any) => {

                  },
                  error => {
                    this.spinner.hide();

                    Swal.fire(
                      'Error!',
                      'Error.',
                      'error'
                    ).then(
                      (result) => {

                      })


                  }

                )

              }else{
                $('#cost_status_modal').modal('hide');
                this.toastr.error(data['desc'], undefined, {
                  positionClass: 'toast-top-center'
                });

              }

            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result) => {

                })


            }

          )

        }
      }
      public modifyStatus() {
        this.submitClicked=true;
        let user_info= JSON.parse(localStorage.getItem('user_info'));

                let postData = {

                  "estimation_id": this.projCostId,
                  "project_id": this.project_id,
                  "quotation_id": sessionStorage.getItem('qtnId'),
                  "project_status_id": this.projStatus,
                  "emp_id": user_info['id'],
                  "project_prefix": this.prefixString,
                  start_date:moment(this.startdateValue).format('L') ,
            end_date: moment(this.enddateValue).format('L'),
            "entityLocation":this.searchElementRef.nativeElement.value!=''? {
              "id":null,
              "entity_id": null,
              "geo_address":this.searchElementRef.nativeElement.value,
              "formatted_address": this.changed_address?this.changed_address:this.formatted_address,
                  "lat": this.latitude?JSON.stringify(this.latitude):"",
                  "lang": this.longitude?JSON.stringify(this.longitude):"",
                  "street_number": this.changed_street_number?this.changed_street_number:this.street_number,
                  "route": this.changed_route?this.changed_route:this.route,
                  "locality": this.changed_locality?this.changed_locality:this.locality,
                  "administrative_area_level_2": this.changed_administrative_area_level_2?this.changed_administrative_area_level_2:this.administrative_area_level_2,
                  "administrative_area_level_1": this.changed_administrative_area_level_1?this.changed_administrative_area_level_1:this.administrative_area_level_1,
                  "postal_code": this.changed_postal_code?this.changed_postal_code:this.postal_code,
                  "country":  this.changed_country?this.changed_country:this.country,
                  "city": this.changed_administrative_area_level_1?this.changed_administrative_area_level_1:this.administrative_area_level_1,

            }:null



                }



                console.log('modifyStatus',postData);

                if (this.projStatus != '' && this.statusForm.status=='VALID') {
                  this.spinner.show();
                  this.UpdateQuotationStageByQuotationID();
                    //Call the Addtional Details Function Here
            //updateProjectIdinAddnlDtls(projectId){


                  return this.projectService.ModifyProjectByProjectID(postData).subscribe(
                    (data: any) => {
                      if (data.status == 200) {
                        $('#cost_status_modal').modal('hide');
                        this.submitClicked=false;

                        this.TaskView();
                        this.router.navigate(["/projects"]);
                        this.spinner.hide();
                        this.toastr.success(data['desc'], undefined, {
                          positionClass: 'toast-top-center'
                        });

                      }else{
                        $('#cost_status_modal').modal('hide');
                        this.toastr.error(data['desc'], undefined, {
                          positionClass: 'toast-top-center'
                        });

                      }


                    },
                    error => {
                      this.spinner.hide();

                      Swal.fire(
                        'Error!',
                        'Error.',
                        'error'
                      ).then(

                        (result) => {


                        })


                    }

                  )

                }
              }

      public UpdateQuotationStageByQuotationID() {
                let postData = {

                  "id": sessionStorage.getItem('qtnId'),
                  "lead_id": null,
                  "quotation_prefix": null,
                  "quotation_date": null,
                  "customer_id": null,
                  "project_name": null,
                  "quotation_subject": null,
                  "quotation_body": null,
                  "warranty_id": null,
                  "validity": null,
                  "payment_id": null,
                  "mode_of_payment_id": null,
                  "no_of_days": null,
                  "exclusion_id": null,
                  "remarks": null,
                  "tax_id": null,
                  "stage_id": this.stageVal,

                }



                if (this.stageVal != '' && this.stageVal != 'Select' ) {
                  this.spinner.show();

                  return this.quotationService.UpdateQuotationStageByQuotationID(postData).subscribe(
                    (data: any) => {
                      // let dataObj = JSON.parse(data['token']);

                      if (data.status == 200) {

                        // this.addformSubmitted=false;
                        this.submitClicked=false;
                        // $('#cost_status_modal').modal('hide');

                        this.TaskView();

                        this.spinner.hide();
                        this.toastr.success(data['desc'], undefined, {
                          positionClass: 'toast-top-center'
                        });

                      }


                    },
                    error => {
                      this.spinner.hide();

                      Swal.fire(
                        'Error!',
                        'Error.',
                        'error'
                      ).then(

                        (result) => {


                        })


                    }

                  )

                }
              }
  public onAddProjType() {
    this.projTypeSubmit=true;

    let postData = {

      type_name: this.projTypeForm.get('type_Name').value,
      type_desc: this.projTypeForm.get('desc').value,



    }



    if (this.projTypeForm.status=='VALID') {
      this.spinner.show();

      return this.projectService.AddProjectType(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {
            this.projTypeSubmit=true;
            this.projTypeForm.reset();
            this.GetProjectTypeByOrgID();
            // this.addformSubmitted=false;
            $('#proj_type_modal').modal('hide');

            this.spinner.hide();

            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }


        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(

            (result) => {


            })


        }

      )

    }
  }
  public onAdd(item) {


  }
  public errorMessages = {
    'must_be_email': ''
  };
  public onRemove(item) {

  }

  public onSelect(item) {

  }

  public onFocus(item) {

  }
  public fetchDesignType() {
    this.costService.FetchAllTypeOfDesignByOrgID().subscribe(
      (data: any) => {


        if (data) {
          var results = [{
            "id": '',
            "text": 'Select'
          }]
var ejsResults=[]
          // let dataObj = JSON.parse(data['token']);
          //

          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            results.push({
              "id": data[i].id,
              "text": data[i].design_name,

            });
            ejsResults.push({
              "id": data[i].id,
              "text": data[i].design_name,

            });

          }
          this.designTypeData = results;
          this.ejsDesignTypeData = ejsResults;
        }



      }
    )
  }

  public fetchStageType() {
    this.leadService.GetAllLeadStageByOrgID().subscribe(
      (data: any) => {


        if (data) {
          var results = [{
            "id": '',
            "text": 'Select'
          }]
          // let dataObj = JSON.parse(data['token']);
          //

          for (var i = 0; i < data.length; i++) {
            // logik to create new items
if(data[i].stage_name!='Modified'){
  results.push({
    "id": data[i].id,
    "text": data[i].stage_name,

  });
}



          }
          this.stageData = results;
        }



      }
    )
  }
  public onstartDtChange(e){
    this.startdateValue=moment(e.value).format('L');
      this.disableEndDate=false;
      this.statusForm.get('startDate').valueChanges.subscribe(() => {
        // fires when the input value has actually changed
        if(this.statusForm.get('startDate').value!=''){
          this.startValChange=true;
        }
        let startDate=this.statusForm.get('startDate').value;
        this.minEndDate=startDate;
        this.statusForm.get('endDate').enable()

    });


  }
  public onendDtChange(e){
    this.enddateValue=moment(e.value).format('L');

  }
  public checkIsOrg(e){
    if(e.srcElement.checked==true){
this.showOrgDetails=true;
    }else{
this.showOrgDetails=false;

    }
  }
  public GetIndustryByOrgID() {
    this.empService.getAllIndustryType().subscribe(
      (data: any) => {
        var results = [{
          "id": '',
          "text": 'Select'
        }]

        for (var i = 0; i < data.length; i++) {

          results.push({
            "id": data[i].id,
            "text": data[i].industry_type_name
          });

        }


        this.industryData = results;


      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(

          (result) => {


          })


      }

    )
  }
  public daysRadioChange() {

    // if (this.projectForm.get('prefixVal').value == 'is_custom' ||this.conversionForm.get('prefixVal').value == 'is_custom' ) {
      if (this.statusForm.get('no_of_days').value == '4' ) {
      // let fromDate=moment(this.today).add(7, 'day').toDate();

        this.statusForm.patchValue({
          endDate:moment(this.today).add(4, 'months').toDate()
        })

    } else if (this.statusForm.get('no_of_days').value == '6' ) {
      this.showPrefixText = false;
      // let fromDate=moment(this.today).add(14, 'day').toDate();
      this.statusForm.patchValue({
        endDate:moment(this.today).add(6, 'months').toDate()
      })
      // this.FindAutoProjectPrefixByOrgID();

    }else if (this.statusForm.get('no_of_days').value == '8' ) {
      this.showPrefixText = false;
      // let fromDate=moment(this.today).add(14, 'day').toDate();
      this.statusForm.patchValue({
        endDate:moment(this.today).add(8, 'months').toDate()
      })
      // this.FindAutoProjectPrefixByOrgID();

    }
      // this.FindAutoProjectPrefixByOrgID();


  }





      /*Meeting Info*/
      getParentApi(): ParentComponentApi  {
        return {
          callParentMethod: () => {
            this.OnTaskClose(),
            // this.GetAllTaskByEmpID()
            this.GetAllOpenActivitiesEntityID(),
            this.GetAllCloseActivitiesEntityID()
          }
        }
      }
      public setPrimary(index){
        let user_info= JSON.parse(localStorage.getItem('user_info'));
        for(var i=0;i<this.branchDataSource.length;i++){
          if(i==index){
            this.branchDataSource[i]['is_primary']=true
            this.branchDataSource[i]['modifiedby']=user_info['full_name']

          }else{
            // emails.at(i).patchValue({primaryAccValue:'no' })
            this.branchDataSource[i]['is_primary']=false


          }

        }



        console.log('this.branchDataSource',this.branchDataSource);


        this.projectService.UpdateEntityContactList(this.branchDataSource).subscribe(

          (data:any) => {
          if(data.status=="200"){
            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });
            this.getContactList('');

          }



          },
          error  => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(

              (result)=> {


              })


          }

          )



      }
      public  getAllEmployeeList(id){
        var contactList=[]
        var employeeList=[]


        this.empService.getEmployeeByOrgId().subscribe(

          (data:any) => {
            var results=[{ id: '', text: 'Select' }]

            // let dataObj = JSON.parse(data['token']);
          //
          let user_info= JSON.parse(localStorage.getItem('user_info'));


            for (var i = 0; i < data.length; i++) {
              // logik to create new items
          // if(user_info['id']!=data[i].id){

              results.push({
                  "id": data[i].id,
                  "text": data[i].first_name
              });
           if(user_info['id']!=data[i].id){

              employeeList.push({
                "id": data[i].id,
                "text": data[i].first_name,
                "category":'Employee'
            });
          }
           if(user_info['id']==data[i].id){

              this.empVal=data[i].id
               }
          }

         this.empData=results

        let entityId={
          entityID:sessionStorage.getItem('qtnId'),
           //cstID:sessionStorage.getItem('qtnId')
    cstID:this.callCstId


        }
         this.quotationService.GetAllEntityContactByEntityIDAndCstID(entityId).subscribe(
          (data: any) => {
            // let dataObj = JSON.parse(data['token']);


            var results = [{ id: '  ', text: 'Select' }]

            // let dataObj = JSON.parse(data['token']);
            //

            for (var i = 0; i < data.length; i++) {
              // logik to create new items

              contactList.push({
                "id": data[i].id,
                "text": data[i].name,
                "category":'Contact'
              });

            }
            this.branchDataSource=data;
            for(var i=0;i<data.length;i++){
              if(data[i]['is_primary']==true){
                this.primaryContact=data[i]
              }
            }

            // this.entityContactData = results;
            this.empGroup=employeeList.concat(contactList)
            if(id!=''){
              this.meetingForm.patchValue({
                participantId:[id]
              })
            }

          },
          error => {
            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(

              (result) => {


              })


          }

        )

          },
          error  => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(

              (result)=> {


              })


          }

          )

          }
      changedEmp(e){
        this.empVal=e.value;
      }
      changedCallPurpose(e){
        this.purposeVal=e.value;
        if(e.value!=''){
          this.purposeValTxt=e.data[0].text
        }
      }
      changedCallRes(e){
        this.callresVal=e.value;
        if(e.value!=''){
          this.callresValTxt=e.data[0].text
        }
      }
      public onAddMeeting() {

        let user;
        this.meetingFormSubmit=true;
        if (localStorage.getItem('user_info')) {
          user = JSON.parse(localStorage.getItem('user_info'));

        }
        if(this.meetingForm.get('startTime').value){
          let startTime=this.meetingForm.get('startTime').value;
          let endTime=this.meetingForm.get('endTime').value;
        let date=moment().format('MM/DD/YYYY');
        this.startmeetTime=date.concat(' ' +startTime) ;
        this.endmeetTime=date.concat(' ' +endTime) ;

        }



        let postData = {

          "id": null,
          "entity_id": sessionStorage.getItem('qtnId'),
          "meeting_name": this.meetingForm.get('meeeting_Name').value,
          "location": this.meetingForm.get('meeeting_loc').value,
          "desc": this.meetingForm.get('desc').value,
          "start_time": this.startmeetTime,
          "end_time": this.endmeetTime,
          "host": this.empVal,
          "participant_id": this.meetingForm.get('participantId').value,


        }




        if (this.meetingForm.status=='VALID' ) {
          this.spinner.show();

          return this.quotationService.AddEntityMeeting(postData).subscribe(
            (data: any) => {

               if (data.status == 200) {
                this.spinner.hide();

                $('#meeting_modal').modal('hide');
       this.GetAllOpenActivitiesEntityID();
       this.GetAllCloseActivitiesEntityID();
      this.meetingForm.reset();
       this.meetingForm.patchValue({
        startTime:moment().format("hh:mm a")
      });
      this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

            this.meetCloseBtn.nativeElement.click();

            if(data){
              let postData = {
              entity_id: sessionStorage.getItem('qtnId'),
              event_type: "quotation meeting added",
              event_desc: "quotation meeting added successfully",
            };
             this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                  console.log(data)
                  if(data){
                    this.getLeadHistory(sessionStorage.getItem('qtnId'));
                  }
              });
             }

              }else if (data.status == 205) {
                this.spinner.hide();
                this.toastr.error(data['desc'], undefined, {
                  positionClass: 'toast-top-center'
                });
                $('#meeting_modal').modal('hide');
                this.meetCloseBtn.nativeElement.click();

              }
               else {
                this.spinner.hide();

                Swal.fire(
                  'Error!',
                  data['result'].desc,
                  'error'
                ).then(
                  (result) => {
                  })
              }
            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result) => {

                })


            }

          )

        }








      }

      openAttachModal(){
        $('#attachment_modal').modal('show');

      }
      closeAttachModal(){
        $('#attachment_modal').modal('hide');

      }
      public onUpdateMeeting() {

        let user;
        this.meetingFormSubmit=true;
        if (localStorage.getItem('user_info')) {
          user = JSON.parse(localStorage.getItem('user_info'));

        }
        if(this.meetingForm.get('startTime').value){
          let startTime=this.meetingForm.get('startTime').value;
          let endTime=this.meetingForm.get('endTime').value;
        let date=moment().format('MM/DD/YYYY');
        this.startmeetTime=date.concat(' ' +startTime) ;
        this.endmeetTime=date.concat(' ' +endTime) ;

        }



        let postData = {

          "id": this.editMeetId,
          "entity_id": sessionStorage.getItem('qtnId'),
          "meeting_name": this.meetingForm.get('meeeting_Name').value,
          "location": this.meetingForm.get('meeeting_loc').value,
          "desc": this.meetingForm.get('desc').value,
          "start_time": this.startmeetTime,
          "end_time": this.endmeetTime,
          "host": this.empVal,
          "participant_id": this.meetingForm.get('participantId').value,


        }




        if (this.meetingForm.status=='VALID' ) {
          this.spinner.show();

          return this.quotationService.AddEntityMeeting(postData).subscribe(
            (data: any) => {

               if (data.status == 200) {
                this.spinner.hide();

                $('#meeting_modal').modal('hide');
      this.meetCloseBtn.nativeElement.click();

       this.GetAllOpenActivitiesEntityID();
       this.GetAllCloseActivitiesEntityID();

       this.meetingForm.patchValue({
        startTime:moment().format("hh:mm a")
      });

      this.toastr.success(data['desc'], undefined, {
        positionClass: 'toast-top-center'
      });

      if(data){
        let postData = {
        entity_id: sessionStorage.getItem('qtnId'),
        event_type: "quotation meeting updated",
        event_desc: "quotation meeting updated successfully",
      };
       this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
          console.log(data)
          if(data){
            this.getLeadHistory(sessionStorage.getItem('qtnId'));
          }
        });
       }

              }
               else {
                this.spinner.hide();

                Swal.fire(
                  'Error!',
                  data['result'].desc,
                  'error'
                ).then(
                  (result) => {
                  })
              }
            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result) => {

                })


            }

          )

        }








      }
      public addNotes() {



        let postData = {

          "id": null,
          "entity_id": sessionStorage.getItem('qtnId'),
          "notes": this.notesForm.get('notes').value,
          "title": this.notesForm.get('title').value,

        }




        if (this.notesForm.status=='VALID' ) {
          this.spinner.show();

          return this.quotationService.AddEntityNotes(postData).subscribe(
            (data: any) => {

               if (data.status == 200) {
                this.spinner.hide();
                this.notesForm.reset();
                this.showTextArea4=false;
                this.FetchEntityNotesEntityID();
                this.toastr.success(data['desc'], undefined, {
                  positionClass: 'toast-top-center'
                });


                let postData = {
                    entity_id: sessionStorage.getItem('qtnId'),
                    event_type: "Notes Added",
                    event_desc: "Successfully Notes Added",
                };
                this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                    console.log(data)
                    if(data){
                      this.getLeadHistory(sessionStorage.getItem('qtnId'));
                    }
                });
              }
               else {
                this.spinner.hide();

                Swal.fire(
                  'Error!',
                  data['result'].desc,
                  'error'
                ).then(
                  (result) => {
                  })
              }
            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result) => {

                })


            }

          )

        }








      }
      public updateNotes() {



        let postData = {

          "id": this.editnotesId,
          "entity_id": sessionStorage.getItem('qtnId'),
          "notes": this.notesForm.get('notes').value,
          "title": this.notesForm.get('title').value,


        }



        if (this.notesForm.status=='VALID' ) {
          this.spinner.show();

          return this.quotationService.UpdateEntityNotes(postData).subscribe(
            (data: any) => {

               if (data.status == 200) {
                this.spinner.hide();
                this.notesForm.reset();
                this.showTextArea4=false;
                this.notesEditable=false;
                this.FetchEntityNotesEntityID();

                let postData = {
                  entity_id: sessionStorage.getItem('qtnId'),
                  event_type: "Notes updated",
                  event_desc: "Successfully Notes updated",
              };
              this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                  console.log(data)
                  if(data){
                    this.getLeadHistory(sessionStorage.getItem('qtnId'));
                  }
              });

              }
               else {
                this.spinner.hide();

                Swal.fire(
                  'Error!',
                  data['result'].desc,
                  'error'
                ).then(
                  (result) => {
                  })
              }
            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result) => {

                })


            }

          )

        }








      }
      public notesDelete(id) {



        let postData = {

          "id": id,


        }



        if (true ) {
          this.spinner.show();

          return this.quotationService.RemoveEntityNotes(postData).subscribe(
            (data: any) => {

               if (data.status == 200) {
                this.spinner.hide();

                this.FetchEntityNotesEntityID();

              }
               else {
                this.spinner.hide();

                Swal.fire(
                  'Error!',
                  data['result'].desc,
                  'error'
                ).then(
                  (result) => {
                  })
              }
            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result) => {

                })


            }

          )

        }








      }
      public onAddCall() {

        let user;
        this.callFormSubmit=true;
        if (localStorage.getItem('user_info')) {
          user = JSON.parse(localStorage.getItem('user_info'));

        }
        let callStartTime='';
        let callEndTime='';
        let scheduleTime='';
        let startTime=this.callForm.get('startTime').value;
        let endTime=this.callForm.get('endTime').value;
      let date=moment().format('MM/DD/YYYY');
      callStartTime=date.concat(' ' +startTime) ;
      callEndTime=date.concat(' ' +endTime) ;
        // if(this.callForm.get('callType').value=='completed' && this.callForm.get('startTime').value){
        //   let startTime=this.callForm.get('startTime').value;
        //   let endTime=this.callForm.get('endTime').value;
        // let date=moment().format('MM/DD/YYYY');
        // callStartTime=date.concat(' ' +startTime) ;
        // callEndTime=date.concat(' ' +endTime) ;

        // }
        // if(this.callForm.get('callType').value=='schedule' && this.callForm.get('scheduleTime').value){
        //   let startTime=this.callForm.get('scheduleTime').value;
        // let date=moment().format('MM/DD/YYYY');
        // callEndTime=date.concat(' ' +startTime) ;
        // callStartTime=moment(this.callForm.get('startDate').value).format('L')

        // }
        // if(this.callForm.get('callType').value=='current' ){

        // callEndTime=null ;
        // callStartTime=null

        // }



        let postData = {

          "id": null,
          "entity_id": sessionStorage.getItem('qtnId'),
          "subject": this.callForm.get('subject').value,
          "contact_id":this.entityContactVal,
          "call_purpose": this.purposeValTxt,
          "is_current_call": true,
          "is_completed_call": false,
          "is_schedule_call": false,
          "start_time": callStartTime,
          "end_time": callEndTime,
          "call_desc": this.callForm.get('desc').value,
          "call_result": this.callresValTxt,
          // "host": this.callForm.get('callType').value=='schedule'?this.empVal:null

        }




        if (this.callForm.status=='VALID' && this.entityContactVal!='' ) {
          this.spinner.show();
          return this.quotationService.AddEntityCall(postData).subscribe(
            (data: any) => {

               if (data.status == 200) {
                this.spinner.hide();

                $('#call_modal').modal('hide');
       this.GetAllOpenActivitiesEntityID();
       this.GetAllCloseActivitiesEntityID();
  this.callCloseBtn.nativeElement.click();
       this.callForm.reset();
       this.entityContactVal='';
       this.empVal='';
       this.purposeVal='';
       this.callresVal='';
       this.callForm.patchValue({
        callType:'current',
        startDate:moment().format('L')
      });
      this.toastr.success(data['desc'], undefined, {
          positionClass: 'toast-top-center'
        });

        if(data){
          let postData = {
          entity_id: sessionStorage.getItem('qtnId'),
          event_type: "quotation call added",
          event_desc: "quotation call added successfully",
         };
         this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
          console.log(data)
                if(data){
                    this.getLeadHistory(sessionStorage.getItem('qtnId'));
                }
          });
         }

              }else if (data.status == 205) {
                this.spinner.hide();
                this.toastr.error(data['desc'], undefined, {
                  positionClass: 'toast-top-center'
                });
                $('#call_modal').modal('hide');
                this.callCloseBtn.nativeElement.click();

              }
               else {
                this.spinner.hide();

                Swal.fire(
                  'Error!',
                  data['result'].desc,
                  'error'
                ).then(
                  (result) => {
                  })
              }
            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result) => {

                })


            }

          )

        }








      }
      public onUpdateCall() {

        let user;
        this.callFormSubmit=true;
        if (localStorage.getItem('user_info')) {
          user = JSON.parse(localStorage.getItem('user_info'));

        }
        let callStartTime='';
        let callEndTime='';
        let scheduleTime='';
        let startTime=this.callForm.get('startTime').value;
        let endTime=this.callForm.get('endTime').value;
      let date=moment().format('MM/DD/YYYY');
      callStartTime=date.concat(' ' +startTime) ;
      callEndTime=date.concat(' ' +endTime) ;
        // if(this.callForm.get('callType').value=='completed' && this.callForm.get('startTime').value){
        //   let startTime=this.callForm.get('startTime').value;
        //   let endTime=this.callForm.get('endTime').value;
        // let date=moment().format('MM/DD/YYYY');
        // callStartTime=date.concat(' ' +startTime) ;
        // callEndTime=date.concat(' ' +endTime) ;

        // }
        // if(this.callForm.get('callType').value=='schedule' && this.callForm.get('scheduleTime').value){
        //   let startTime=this.callForm.get('scheduleTime').value;
        // let date=moment().format('MM/DD/YYYY');
        // callEndTime=date.concat(' ' +startTime) ;
        // callStartTime=moment(this.callForm.get('startDate').value).format('L')

        // }
        // if(this.callForm.get('callType').value=='current' ){

        // callEndTime=null ;
        // callStartTime=null

        // }



        let postData = {

          "id": null,
          "entity_id": sessionStorage.getItem('qtnId'),
          "subject": this.callForm.get('subject').value,
          "contact_id":this.entityContactVal,
          "call_purpose": this.purposeValTxt,
          "is_current_call": true,
          "is_completed_call": false,
          "is_schedule_call": false,
          "start_time": callStartTime,
          "end_time": callEndTime,
          "call_desc": this.callForm.get('desc').value,
          "call_result": this.callresValTxt,
          "host": this.callForm.get('callType').value=='schedule'?this.empVal:null

        }




        if (this.callForm.status=='VALID' ) {
          this.spinner.show();

          return this.quotationService.UpdateEntityCall(postData).subscribe(
            (data: any) => {

               if (data.status == 200) {
                this.spinner.hide();

                $('#call_modal').modal('hide');
       this.GetAllOpenActivitiesEntityID();
       this.GetAllCloseActivitiesEntityID();
       this.callCloseBtn.nativeElement.click();

       this.callForm.reset();
       this.entityContactVal='';
       this.empVal='';
       this.purposeVal='';
       this.callresVal='';
       this.callForm.patchValue({
        callType:'current',
        startDate:moment().format('L')
      });
      this.toastr.success(data['desc'], undefined, {
          positionClass: 'toast-top-center'
        });

        if(data){
          let postData = {
          entity_id: sessionStorage.getItem('qtnId'),
          event_type: "quotation call updated",
          event_desc: "quotation call updated successfully",
         };
         this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
          console.log(data)
                if(data){
                   this.getLeadHistory(sessionStorage.getItem('qtnId'));
                }
          });
         }

              }
               else {
                this.spinner.hide();

                Swal.fire(
                  'Error!',
                  data['result'].desc,
                  'error'
                ).then(
                  (result) => {
                  })
              }
            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result) => {

                })


            }

          )

        }








      }


          public changedCstRelation(e: any): void {
            this.cstRelationValue= e.value;
            // this.countryValueTxt= e.data[0].text;
            if(e.data[0]){
              this.cstRelationValueTxt= e.data[0].text;

            }
          }
      callMinsRadioChange() {
        let currentTime=this.callForm.get('startTime').value;

            // if (this.projectForm.get('prefixVal').value == 'is_custom' ||this.conversionForm.get('prefixVal').value == 'is_custom' ) {
              if (this.callForm.get('no_mins').value == 5 ) {
              // let fromDate=moment(this.today).add(7, 'day').toDate();
                this.callForm.patchValue({
                  endTime:moment(currentTime, 'hh:mm a').add(5, 'minutes').format('hh:mm a')
                })

            } else if (this.callForm.get('no_mins').value == 10 ) {

              // let fromDate=moment(this.today).add(14, 'day').toDate();
              this.callForm.patchValue({
                endTime:moment(currentTime, 'hh:mm a').add(10, 'minutes').format('hh:mm a')
              })
              // this.FindAutoProjectPrefixByOrgID();

            }else if (this.callForm.get('no_mins').value == 15 ) {

              this.callForm.patchValue({
                endTime:moment(currentTime, 'hh:mm a').add(15, 'minutes').format('hh:mm a')
              })
              // this.FindAutoProjectPrefixByOrgID();

            }
    //         var start = this.callForm.get('endTime').value;
    //         var end = this.currentVal;
    //         if(Date.parse('01/01/2011 '+end) < Date.parse('01/01/2011 '+start))
    // {
    //     alert("End time should exceed the start time");
    // }
    // else if(Date.parse('01/01/2011 '+end) -Date.parse('01/01/2011 '+start)==0)
    // {
    //     alert("Start time and end time cannot be same");
    // }
    if((new Date(moment().format('YYYY-MM-DD')+' '+this.callForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+this.currentTime))){
      this.showValidTimeError=true;
    }else{
      this.showValidTimeError=false;

    }
              // this.FindAutoProjectPrefixByOrgID();


          }
          addCall(){
            $("#call_modal").modal('show');
            this.getAllEmployeeList('');
            this.FindByEntityContactOrgID();
            // this.callForm.patchValue({

            //   startTime:moment().format('hh:mm a'),

            // })
            this.callForm.get('endTime').enable();
            let startTime=this.callForm.get('startTime').value;
            this.minEndTime=startTime;
            // this.entityContactVal=this.callCstId;
            console.log('callCstId',this.callCstId);
          }
          public callStartTimeChanged(){
            this.callForm.get('startTime').valueChanges.subscribe(() => {
              // fires when the input value has actually changed
              if(this.callForm.get('startTime').value!=''){
                this.startValChange=true;
              }
              let startTime=this.callForm.get('startTime').value;
              this.minEndTime=startTime;

              this.callForm.get('endTime').enable()
              this.callForm.patchValue({
                'no_mins':'',
                'endTime':""
              })
              this.showValidTimeError=false;


          });
          /**
           * name
           */




          }
      public meetDelete(id) {



        let postData = {

          "id": id,


        }



        if (true ) {
          this.spinner.show();

          return this.quotationService.RemoveEntityMeeting(postData).subscribe(
            (data: any) => {

               if (data.status == 200) {
                this.spinner.hide();

                this.GetAllOpenActivitiesEntityID();

              }
               else {
                this.spinner.hide();

                Swal.fire(
                  'Error!',
                  data['result'].desc,
                  'error'
                ).then(
                  (result) => {
                  })
              }
            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result) => {

                })


            }

          )

        }








      }
      public FetchEntityNotesEntityID() {
        let postData={
          "id": sessionStorage.getItem('qtnId')
        }
        this.quotationService.FetchEntityNotesEntityID(postData).subscribe(
          (data: any) => {

            // let dataObj = JSON.parse(data['token']);
            //
            if(data){
              let datas = new DataManager(data);
              this.notesData = datas.dataSource['json'];
            }




          },
          error => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(

              (result) => {


              })


          }

        )
      }

      public GetAllOpenActivitiesEntityID() {
        let postData={
          "id": sessionStorage.getItem('qtnId')
        }
        this.quotationService.GetAllOpenActivitiesEntityID(postData).subscribe(
          (data: any) => {

            // let dataObj = JSON.parse(data['token']);
            //
            if(data){
              let datas = new DataManager(data);
              this.meetingData = datas.dataSource['json'];
              this.meetingToolbar = ['Search'];

            }




          },
          error => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(

              (result) => {


              })


          }

        )
      }
      GetAllCloseActivitiesEntityID() {
        let postData={
          "id": sessionStorage.getItem('qtnId')
        }
        this.quotationService.GetAllCloseActivitiesEntityID(postData).subscribe(
          (data: any) => {

            // let dataObj = JSON.parse(data['token']);
            //
            if(data){
              let datas = new DataManager(data);
              this.closeData = datas.dataSource['json'];
              this.closeToolbar = ['Search'];

            }




          },
          error => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(

              (result) => {


              })


          }

        )
      }
      notesEdit(id){
        let postData={
          id:id
        }
       this.quotationService.FindByEntityNotesID(postData).subscribe(

         (data: any) => {

   if(data){
    this.showTextArea4=true;
    this.notesEditable=true;

     this.notesForm.patchValue({
      title:data.title,
      notes:data.notes
    })
    this.editnotesId=id

   //this.projectData=ds1.dataSource['json'];
   }
           let datas = new DataManager(data);
            this.projectData = datas.dataSource['json'];

           // data.forEach((data,index)=>{
           //   if(data){
           //    let index12=index+1;
           //
           //     this.projectData['index'].rowValue=index12;
           //          }
           //   });
           //   this.initialSort = {
           //     columns: [{ field: 'dep_name', direction: 'Ascending' },
           //     { field: 'alias', direction: 'Descending' }]
           // };


           this.pageSettings = { pageSizes: true, pageCount: 5 }
           this.toolbar = ['Search', 'ExcelExport', 'PdfExport',];


         },
         error => {
           Swal.fire(
             'Error!',
             error,
             'error'
           ).then(

             (result) => {


             })


         }

       )
      }
      meetEdit(id,type){
        if(type=="Meeting"){
          let postData={
            id:id
          }
         this.quotationService.FindByEntityMeetingID(postData).subscribe(

           (data: any) => {

     if(data){
      this.meetingEditable=true;
      this.getAllEmployeeList('');

    this.meetingForm.get('endTime').enable();

    $("#meeting_modal").modal('show');
      this.meetingForm.patchValue({
        meeeting_Name:data.meeting_name,
        meeeting_loc:data.location,
        startTime:moment(data.start_time).format("hh:mm a"),
        endTime:moment(data.end_time).format("hh:mm a"),
        desc:data.desc,
        participantId:data.participant_id

      })

      this.editMeetId=id
   setTimeout(()=>{
   this.empVal=data.host


   },1000)
     }

           },
           error => {
             Swal.fire(
               'Error!',
               error,
               'error'
             ).then(

               (result) => {


               })


           }

         )
        }
        else if(type=="Call"){
        this.FindByEntityContactOrgID();

          let postData={
            id:id
          }
         this.quotationService.FindByEntityCallID(postData).subscribe(

           (data: any) => {

     if(data){
      this.callEditable=true;
      this.getAllEmployeeList('');

  this.entityContactVal=data.contact_id;



    $("#call_modal").modal('show');
      this.callForm.patchValue({
        subject:data.subject,


        desc:data.call_desc,

      })

      if(data.is_completed_call==true){
        this.callForm.patchValue({
          callType:'completed',
          showStartEndTime:true,
          showDateEndTime:false,
          startTime:moment(data.start_time).format("hh:mm a"),
          endTime:moment(data.end_time).format("hh:mm a"),

        })
        this.callForm.get('endTime').enable();
      }else if(data.is_current_call==true){
        this.callForm.patchValue({
          callType:'current',
          showStartEndTime:false,
            showDateEndTime:false,
            startTime:moment(data.start_time).format("hh:mm a"),
            endTime:moment(data.end_time).format("hh:mm a"),

        })
      }
      else if(data.is_schedule_call==true){
        this.callForm.patchValue({
          callType:'schedule',
          showStartEndTime:false,
          showDateEndTime:true,
          startDate:moment(data.start_time).format("hh:mm a"),
          scheduleTime:moment(data.end_time).format("hh:mm a"),

        })
        this.callForm.get('scheduleTime').enable();

      }

      this.editCallId=id
   setTimeout(()=>{
   this.empVal=data.host
   if(data.call_purpose=='None'){
    this.purposeVal=2
  }else if(data.call_purpose=='Administrative'){
    this.purposeVal=3
  }else if(data.call_purpose=='Negotiation'){
    this.purposeVal=4
  }
  if(data.call_result=='None'){
    this.callresVal=2
  }else if(data.call_result=='Not Interested'){
    this.callresVal=4
  }else if(data.call_result=='Interested'){
    this.callresVal=3
  }

   },1000)
     }

           },
           error => {
             Swal.fire(
               'Error!',
               error,
               'error'
             ).then(

               (result) => {


               })


           }

         )
        }else{
          this.updateTask.taskEdit(id);
        }

     }
     addTask(){
      $("#task_log_modal").modal('show');
    }
    OnTaskClose(){
       $("#task_log_modal").modal('hide');
       this.taskCloseBtn.nativeElement.click();
    }
    addMeeting(){
      $("#meeting_modal").modal('show');
      this.getAllEmployeeList('');
      this.mode = 'CheckBox';

    }

    OnMeetingModalClose(){
      $("#meeting_modal").modal('hide');
      this.meetCloseBtn.nativeElement.click();
      this.meetingForm.reset();
      this.empVal='';

    }
    OnCallModalClose(){
      $("#call_modal").modal('hide');
      this.callForm.reset();
      this.contactVal='';
      this.entityContactVal='';
      this.callCloseBtn.nativeElement.click();

      this.empVal='';
      this.purposeVal='';
      this.callresVal='';

    }

    public startTimeChanged(){
      this.disableEndTime=false;

      this.meetingForm.get('startTime').valueChanges.subscribe(() => {
        // fires when the input value has actually changed
        if(this.meetingForm.get('startTime').value!=''){
          this.startValChange=true;
        }
        let startTime=this.meetingForm.get('startTime').value;
        this.minEndTime=startTime;

        this.meetingForm.get('endTime').enable()


    });
    /**
     * name
     */




    }

    callRadioChange() {
      // if (this.projectForm.get('prefixVal').value == 'is_custom' ||this.conversionForm.get('prefixVal').value == 'is_custom' ) {
        if (this.callForm.get('callType').value == 'current' ) {
        // let fromDate=moment(this.today).add(7, 'day').toDate();

          this.callForm.patchValue({
            showStartEndTime:false,
            showDateEndTime:false,

          })

      } else if (this.callForm.get('callType').value == 'completed' ) {

        // let fromDate=moment(this.today).add(14, 'day').toDate();
        this.callForm.patchValue({
          showStartEndTime:true,
          showDateEndTime:false,

        })
        // this.FindAutoProjectPrefixByOrgID();

      }else if (this.callForm.get('callType').value == 'schedule' ) {

        this.callForm.patchValue({
          showStartEndTime:false,
          showDateEndTime:true,

        })
        // this.FindAutoProjectPrefixByOrgID();

      }
        // this.FindAutoProjectPrefixByOrgID();


    }
    public actList = [
      {display: 'Meeting', value: 1},
      {display: 'Call', value: 2},
    ];
    cancelText(){
      this.showTextArea4=false;
      this.notesEditable=false;
    }
  ngOnInit() {
    this.GetProjectTypeByOrgID();
    this.FindAutoProjectPrefixByOrgID();
    this.GetPriorityByOrgID();
   this.GetCostProjByOrgID();
   this.FetchEntityNotesEntityID();
   this.GetAllOpenActivitiesEntityID();
   this.getTimesheetByEmpId();
  //  this.GetAllOpenActivitiesEntityID();
   this.GetAllCloseActivitiesEntityID();
    this.addPaymentMethodologyForm();

   // this.fetchPrjctPrefix();

   // this.advaePymntForm();

    this.addPaymentTemplateForm();
    this.addpaymentNameMethodologyForm();
    //this.GetPaymentPolicyByOrgId();
    this.fetchStageType();
    // this.fetchUnitDesc();
    this.fetchDesignType();
    this.findCostHrs();

    //this.getAllEmployeeList();
    if(JSON.parse(localStorage.getItem('userRights')).length!=0){
      console.log('if')
      let userRights= JSON.parse(localStorage.getItem('userRights'));
      for(var i=0;i<userRights.length;i++){
        if(userRights[i].module_name=='Quotation'){

        if(userRights[i].section_name=='Revise' && userRights[i].is_allow==true ){
          this.showReviseBtn=true
        }
      else if(userRights[i].section_name=='Revise' && userRights[i].is_allow==false ){
        this.showReviseBtn=false

      }
      if(userRights[i].section_name=='View Cost Details' && userRights[i].is_allow==true ){
        this.showCostDetails=true
      }
    else if(userRights[i].section_name=='View Cost Details' && userRights[i].is_allow==false ){
      this.showCostDetails=false

    }
    if(userRights[i].section_name=='Quotation To Project' && userRights[i].is_allow==true ){
      this.showConvertBtn=true
    }
    else if(userRights[i].section_name=='Quotation To Project' && userRights[i].is_allow==false ){
    this.showConvertBtn=false

    }

    console.log('userRights',userRights[i].section_name)

      }else{
        // this.showCostDetails=true
        // this.showConvertBtn=true
        // this.showReviseBtn=true
      }
      }

    }else{
      console.log('else')
      this.showCostDetails=true
        this.showConvertBtn=true
        this.showReviseBtn=true




    }

    this.emailForm = this.formBuilder.group({
      emails: this.formBuilder.array([])
    });
    this.extraUnitForm = this.formBuilder.group({
      extras: this.formBuilder.array([])
    });
    this.milestTaskForm = this.formBuilder.group({
      miles: this.formBuilder.array([])
    });
    this.meetingForm = new FormGroup({
      meeeting_Name: new FormControl('', [Validators.required]),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      meeeting_loc: new FormControl(''),
      callType: new FormControl(''),
      desc: new FormControl(''),
      participantId: new FormControl('', [Validators.required]),



    });
    this.callForm = new FormGroup({
      subject: new FormControl('', [Validators.required]),
      startDate: new FormControl(''),
      startTime: new FormControl(''),
      endTime: new FormControl(''),
      scheduleTime: new FormControl(''),
      callType: new FormControl(''),
      showStartEndTime:new FormControl(''),
      showDateEndTime:new FormControl(''),
      desc: new FormControl(''),
    no_mins: new FormControl(''),

    });


    this.meetingForm.get('endTime').disable();
    this.callForm.get('endTime').disable();

    this.meetingForm.get('endTime').valueChanges.subscribe(() => {
      if(this.meetingForm.get('endTime').value!=''){
        this.endValChange=true;
      }else
      {
        this.endValChange=false;

      }



    });
    this.notesForm = new FormGroup({
      notes: new FormControl('', [Validators.required]),
      title: new FormControl(''),

    })
    this.customerForm = new FormGroup({
      customer_Name: new FormControl(''),
      last_Name: new FormControl(''),
      company_Name: new FormControl(''),
      contact_name: new FormControl(''),
      customer_type: new FormControl(''),
      customer_phone: new FormControl('',[Validators.required,patternValidator(/^\+\d{1,3}-\d{9,10}$/)]),
      customer_email: new FormControl('',[Validators.required,patternValidator(/^(?:^\+[1-9]\d{1,14}$|\w+@\w+\.\w{2,3})$/)]),
      city: new FormControl(''),
      website: new FormControl(''),
      revenue: new FormControl(''),
      emp_no: new FormControl(''),
      street_1: new FormControl(''),
      street_2: new FormControl(''),


      country: new FormControl(''),

      fname: new FormControl(''),
      lname: new FormControl(''),
      name:new FormControl(''),
      position: new FormControl(''),
      phone: new FormControl('',[patternValidator(/^\+\d{1,3}-\d{9,10}$/)]),
      mobile: new FormControl(''),
      email: new FormControl('',[patternValidator(/^(?:^\+[1-9]\d{1,14}$|\w+@\w+\.\w{2,3})$/)]),
      relationship: new FormControl(''),
      desgn: new FormControl(''),
      note: new FormControl(''),
    });
    this.designTypeForm = new FormGroup({
      design_Name: new FormControl(''),
      cost: new FormControl('')
    })
    this.projTypeForm = new FormGroup({
      type_Name: new FormControl('', [Validators.required]),
      desc: new FormControl(''),

    })
    this.customerContactForm = new FormGroup({


      fname: new FormControl('', [Validators.required]),
      lname: new FormControl('', [Validators.required]),
      department: new FormControl(''),
      note: new FormControl(''),
      relationship: new FormControl(''),

      designation: new FormControl(''),
      //  phone: new FormControl(''),
      mobile:new FormControl('', [Validators.required]),

      //  mobile: new FormControl('',[patternValidator(/^\+\d{1,3}-\d{9,10}$/)]),
       email: new FormControl('', [
        Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),








    });
    this.customerContactForm.valueChanges.subscribe(
      (selectedValue) => {

       if(this.customerContactForm.get('fname').status=="VALID" && this.customerContactForm.get('lname').status=="VALID" ){
         this.disableSaveBranch=false;
       } else{
        this.disableSaveBranch=true;

       }
      }
    );
    this.projectForm = new FormGroup({
      project_name: new FormControl('', [Validators.required]),
      desc: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      completeDate: new FormControl(''),
      accessControl: new FormControl(''),
      prefixVal: new FormControl(''),
      customer_Name: new FormControl(''),
      contact_name: new FormControl(''),
      contact_type: new FormControl(''),
      city: new FormControl(''),
      prefix_name: new FormControl(''),
      floor_no: new FormControl('', [Validators.required]),
      plot_size: new FormControl(''),
      plotVal: new FormControl(''),
      builtVal: new FormControl(''),

      built_area: new FormControl(''),

      street_1: new FormControl(''),
      street_2: new FormControl(''),


      country: new FormControl(''),

      name: new FormControl(''),
      position: new FormControl(''),
      phone: new FormControl(''),
      mobile: new FormControl(''),
      email: new FormControl('',[Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]),
      tags: new FormControl(''),
      validity: new FormControl(''),
      remarks: new FormControl(''),
      subject: new FormControl(''),
      no_of_days: new FormControl(''),


    });
    this.statusForm = new FormGroup({

      startDate: new FormControl(''),
      endDate: new FormControl('', [Validators.required]),
      no_of_days: new FormControl(''),


    });

    this.projectForm.patchValue({
      prefixVal: 'is_auto',
      startDate:moment().format('L'),
      floor_no:1,
      plotVal:'sq_ft',
      builtVal:'built_sq_ft'
    })
    this.callForm.patchValue({
      callType: 'current',
      startDate:moment().format('L'),

    })
        this.taskOptions = {
      placeholder: 'Select',
      width: '100%'
    }
    this.multiOption = {
      multiple: true,
      placeholder: 'Select',
      width: '100%'
    }
    if(sessionStorage.getItem("qtnId")){
      this.qtnEdit(sessionStorage.getItem("qtnId"));
   // this.milestoneData=[];


    }

    this.getLeadHistory(sessionStorage.getItem("qtnId"))
  }


//payment policy starts

  addItemRow(){
    let newFormValue = this.paymentPolicy.getRawValue();
    let getPerTotal = [];
    let getValueTotal = []
    newFormValue.map((elm) => {
      if(elm.perProjValue !== ''){
        getPerTotal.push(parseFloat(elm.perProjValue))
      }

      if(elm.projValue !== ''){
        getValueTotal.push(parseFloat(elm.projValue))
      }
    });
    const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
    const sumValue = getValueTotal.reduce((a, b) => a + (b || 0), 0);
    if(sumProj > 99){
      this.showPercentageError = true;
    }else{
      this.showPercentageError = false;
      let newRow = this.createPaymentPolicy();
      this.paymentPolicy.push(newRow);
      let formValue = this.paymentPolicy.value
      formValue.map((elm, index) => {
        if(elm.triggerEvent === 'Upon Signing contract'){
          formValue.length - 1
          var length = formValue.length, except = index,result = Array
          .from({ length }, (_, i) => i)
          .filter(n => n !== except);

          result.map((elm) => {
            this.paymentPolicy.at(elm).patchValue({
              triggerEvent: 'Upon completing'
            })
          })
        }
      });
    }
    if(sumValue == this.total_value){
      this.totalProjPercent = '100 %';
    }else{
      this.totalProjPercent = sumProj+' %';
    }
    this.totalProjValue = 'AED '+sumValue.toLocaleString();
  }



  deleteAdvPayment(i){
    this.advpaymentPolicy.removeAt(i)
    let newFormValue = this.advpaymentPolicy.getRawValue();
    let getPerTotal = [];
    let getValueTotal = []
    newFormValue.map((elm) => {
      if(elm.perProjValue !== ''){
        getPerTotal.push(parseFloat(elm.perProjValue))
      }

      if(elm.projValue !== ''){
        getValueTotal.push(parseFloat(elm.projValue))
      }
    });
    const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
    const sumValue = getValueTotal.reduce((a, b) => a + (b || 0), 0);
    if(sumValue == this.total_value){
      this.totalProjPercent = '100 %';
    }else{
      this.totalProjPercent = sumProj+' %';
    }
    this.totalProjValue = 'AED '+sumValue.toLocaleString();
    this.showPercentageError = false;
  }


  deletePayment(i){
    this.paymentPolicy.removeAt(i)
    let newFormValue = this.paymentPolicy.getRawValue();
    let getPerTotal = [];
    let getValueTotal = []
    newFormValue.map((elm) => {
      if(elm.perProjValue !== ''){
        getPerTotal.push(parseFloat(elm.perProjValue))
      }

      if(elm.projValue !== ''){
        getValueTotal.push(parseFloat(elm.projValue))
      }
    });
    const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
    const sumValue = getValueTotal.reduce((a, b) => a + (b || 0), 0);
    if(sumValue == this.total_value){
      this.totalProjPercent = '100 %';
    }else{
      this.totalProjPercent = sumProj+' %';
    }
    this.totalProjValue = 'AED '+sumValue.toLocaleString();
    this.showPercentageError = false;
  }


  returnAdvItem(i, item){
    let number = i+1
    this.advpaymentPolicy.at(i).patchValue({
      PaymentTerms: this.ordinalSuffixOf(number)+' Payment'
    });

    let getValue = item.value;
    if(getValue.projValue !== ''){
      this.advpaymentPolicy.at(i).patchValue({
        //projValue: ((parseFloat(getValue.perProjValue)/100) * this.total_value).toFixed(2)
        perProjValue: ((parseFloat(getValue.projValue)/this.total_value) * 100).toFixed(2)

      })
    }

    this.advpaymentPolicy.controls[i].get('PaymentTerms').disable();
   // this.advpaymentPolicy.controls[i].get('projValue').disable();
   // this.getTotalProPer();
    this.getAdvcTotalProPer();
  }



  returnItem(i, item){
    let number = i+1
    this.paymentPolicy.at(i).patchValue({
      PaymentTerms: this.ordinalSuffixOf(number)+' Payment'
    });
     let getValue = item.value;
       //console.log(getValue.metType);
     // if(getValue.metType === 'percent') {
        if(getValue.perProjValue !== ''){
          this.paymentPolicy.at(i).patchValue({
            projValue: ((parseFloat(getValue.perProjValue)/100) * this.total_value).toFixed(2)
          })
        }
      //}
      // if(getValue.metType === 'fixed') {
      //   if(getValue.projValue !== ''){
      //     this.paymentPolicy.at(i).patchValue({
      //       perProjValue: ((parseFloat(getValue.projValue)/this.total_value) * 100).toFixed(2)
      //     })
      //   }
      // }
    this.paymentPolicy.controls[i].get('PaymentTerms').disable();
   // this.paymentPolicy.controls[i].get('projValue').disable();
    this.getTotalProPer();
  }


  returnFixItem(i, item){
    let number = i+1
    this.paymentPolicy.at(i).patchValue({
      PaymentTerms: this.ordinalSuffixOf(number)+' Payment'
    });

     let getValue = item.value;

       //console.log(getValue.metType);

     // if(getValue.metType === 'percent') {
        // if(getValue.perProjValue !== ''){
        //   this.paymentPolicy.at(i).patchValue({
        //     projValue: ((parseFloat(getValue.perProjValue)/100) * this.total_value).toFixed(2)
        //   })
        // }
      //}

      // if(getValue.metType === 'fixed') {
        if(getValue.projValue !== ''){
          this.paymentPolicy.at(i).patchValue({
            perProjValue: ((parseFloat(getValue.projValue)/this.total_value) * 100).toFixed(2)
          })
        }
      // }



    this.paymentPolicy.controls[i].get('PaymentTerms').disable();
   // this.paymentPolicy.controls[i].get('projValue').disable();
    this.getTotalProPer();
  }

  changePymtmtd(e,item,i) {
    if(e.srcElement.checked) {
      console.log(item.value.perProjValue);
     this.paymentPolicy.at(i).patchValue({
      metType: 'percent'
    });

    } else {
       this.paymentPolicy.at(i).patchValue({
        metType: 'fixed'
    });

    }
  }

  // returnNwItem(i, item){
  //   let number = i+1
  //   this.paymentPolicy.at(i).patchValue({
  //     PaymentTerms: this.ordinalSuffixOf(number)+' Payment'
  //   });

  //   let getValue = item.value;
  //   console.log('IN the New FUnction');
  //   if(getValue.projValue !== ''){
  //       this.paymentPolicy.at(i).patchValue({
  //         projValue: ((parseFloat(getValue.projValue)/this.total_value) * 100).toFixed(2)
  //       })
  //     }
  //   this.paymentPolicy.controls[i].get('PaymentTerms').disable();
  //  // this.paymentPolicy.controls[i].get('projValue').disable();
  //  // this.getTotalProPer();
  // }






  getTotalProPer(){
    let newFormValue = this.paymentPolicy.getRawValue();
    let getPerTotal = [];
    let getValueTotal = []
    newFormValue.map((elm) => {
      if(elm.perProjValue !== ''){
        getPerTotal.push(parseFloat(elm.perProjValue))
      }

      if(elm.projValue !== ''){
        getValueTotal.push(parseFloat(elm.projValue))
      }
    });
    const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
    const sumValue = getValueTotal.reduce((a, b) => a + (b || 0), 0);
    console.log("sumValue",  sumValue, typeof(sumValue))
    console.log("sumProj",  sumProj, typeof(sumProj))
    this.totalProjValue = 'AED '+sumValue.toLocaleString();
    if(sumValue == this.total_value){
      this.totalProjPercent = '100 %';
    }else{
      this.totalProjPercent = sumProj+' %';
    }
    sumProj > 100 ? this.showPercentageError = true : this.showPercentageError = false;
  }


  getAdvcTotalProPer(){
    let newFormValue = this.advpaymentPolicy.getRawValue();
    let getPerTotal = [];
    let getValueTotal = []
    newFormValue.map((elm) => {
      if(elm.perProjValue !== ''){
        getPerTotal.push(parseFloat(elm.perProjValue))
      }

      if(elm.projValue !== ''){
        getValueTotal.push(parseFloat(elm.projValue))
      }
    });
    const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
    const sumValue = getValueTotal.reduce((a, b) => a + (b || 0), 0);
    this.totalProjValue = 'AED '+sumValue.toLocaleString();
    if(sumValue == this.total_value){
      this.totalProjPercent = '100 %';
    }else{
      this.totalProjPercent = sumProj+' %';
    }
    sumProj > 100.01 ? this.showPercentageError = true : this.showPercentageError = false;
  }

  ordinalSuffixOf(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
  }

  addPaymentPolicy(projectID){
    this.saveTemplatePaymentMethodologyFormValue = JSON.parse(JSON.stringify(this.paymentMethodologyForm.getRawValue()));
    let sendValue = []
    let formValue = this.paymentPolicy.getRawValue();
    let formValue2 = this.paymentMethodologyForm.getRawValue();
    if(this.showPaymentTemplate){
      let uniqueID = this.generateId(10);
      formValue.map((elm) => {
        sendValue.push({
          id: uniqueID,
          org_id : localStorage.getItem('org_id'),
          project_id : projectID,
          term_name: elm.PaymentTerms,
          term_value: ((elm.perProjValue/100) * this.ProjectTotal).toFixed(2),
          term_percent: elm.perProjValue,
          stage_name: elm.mileStone,
          payment_event: elm.triggerEvent,
          paymentEventpercent: elm.triggerPerValue,
          createdDate: moment().format('L'),
          created_by_empId: this.userInfo.id,
          retetionPercent: this.checkRetType ? formValue2.retensionPercentage : null,
          retetionValue: this.checkRetType ? formValue2.retensionValue: null
        });
      })

      let sendData = {
        "paymentPolicy": sendValue
      }
      this.costService.AddPaymentPolicy(sendData).subscribe((data: any) => {
        this.showPercentageError = false;
        if(data.status === '200'){
          sendValue.map((elm2) => {
            if(elm2.stage_name === "Advance" && this.ProjectTotal !== 0){
              let proSendData = {
                org_id: localStorage.getItem('org_id'),
                projectId: projectID,
                customerName: this.costProjectDetails.customer_name,
                projectName: this.costProjectDetails.project_name,
                term_name: elm2.term_name,
                amount: elm2.term_value,
                description: elm2.stage_name+' for '+this.costProjectDetails.project_name,
                status: "pending",
                createdDate: moment().format('L')
              }
              this.costService.AddProformaInvoice(proSendData).subscribe((data) => {
                console.log('justinnnndndndn', data)
              });
            }
          });
        }
      });

      /* console.log('Justin', this.paymentPolicyTemplateData);
      console.log('Justin', this.paymentTemplateForm.value);
      console.log('Justin', sendData) */
      $('#cost_status_modal').modal('hide');
      let paymentTemplateId = this.paymentTemplateForm.value
      if(this.paymentPolicyTemplateData.length !== 0){
        this.paymentPolicyTemplateData.map((elm) => {
          if(elm.id === paymentTemplateId.paymentTemplate){
            if(elm.paymentPolicy.length === sendData.paymentPolicy.length){
              this.router.navigate(["/projects"]);
            }else{
              $('#save_Pay_Template_modal').modal('show');
            }
          }
        });
      }else{
        $('#save_Pay_Template_modal').modal('show');
      }

    }else{
      console.log('No new Payment')
    }
  }


  advaePymntForm(){
    this.advancePymntForm = this.formBuilder.group({
      advpaymentPolicy: this.formBuilder.array([]),
      creditTrmsDays: [''],
      retPercentage: [''],
      retValue: ['']
		});
  }

  addPaymentMethodologyForm(){
    this.paymentMethodologyForm = this.formBuilder.group({
      paymentPolicy: this.formBuilder.array([]),
      creditTermsDays: [''],
      retensionPercentage: [''],
      retensionValue: ['']
		});
  }

  createPaymentPolicy(){
    return this.formBuilder.group({
			PaymentTerms: [''],
			perProjValue: ['', [Validators.required]],
			projValue: [''],
    //  metType:[''],
      mileStone: ['', [Validators.required]],
      triggerEvent: ['', [Validators.required]],
      triggerPerValue: ['', [Validators.required]]
		})
  }



  addPaymentTemplateForm(){
    this.paymentTemplateForm = this.formBuilder.group({
      paymentTemplate: ['']
		});
  }

  addpaymentNameMethodologyForm(){
    this.paymentNameMethodologyForm = this.formBuilder.group({
      paymentTemplateName: ['' , [Validators.required]]
		});
  }

  get paymentPolicy(): FormArray {
		return this.paymentMethodologyForm.get('paymentPolicy') as FormArray;
	}

  get advpaymentPolicy(): FormArray {
		return this.advancePymntForm.get('advpaymentPolicy') as FormArray;
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

  //get payment template by orgid
  /* to delete
  GetPaymentPolicyByOrgId(){
    let sendData = {
      orgID: localStorage.getItem('org_id')
    }
    this.costService.GetPaymentPolicyByOrgId(sendData).subscribe((data: any) => {
      let templateData = []
      data.map((elm) => {
        if(elm.project_id === null){
          templateData.push(elm)
        }
      });
      this.processData(templateData)
    });
  } */

  GetProjectEstimationService(id){
    this.costEstimationService.GetProjectEstimationService({id}).subscribe((data: any) => {
      let serviceId = data[0].serviceId;
      this.fetchSerMlstnTsks(data[0].serviceId);


      this.costEstimationService.FetchPaymentPolicyByServiceId(serviceId).subscribe((serData: any) => {
        if(data.length !== 0){
          let serverData = _.values( _.groupBy(serData, 'id'));
          let paymentData = [];
          let payment;
          let result = [];
          serverData.map((elm, i) => {
            let pPolicy = [];
            elm.map((elm2, j) => {
              payment = {
                id: elm2.id,
                paymentName : elm2.policy_name,
                is_default : elm2.is_default,
                serviceName : elm2.serviceName,
                serviceId : elm2.serviceId,
                creditTermsDays: elm2.creditTerms,
                retensionPercentage: elm2.retetionPercent
              }
              pPolicy.push(elm2)
              if(elm.length === j+1){
                payment["paymentPolicy"] = pPolicy;
                paymentData.push(payment);
                result.push({
                  id: elm2.id,
                  value: elm2.policy_name
                });
              }
            });

            if(serverData.length === i+1){
              this.paymentPolicyTemplateData = paymentData;
              this.paymentPolicyTemplateDropDown = result;
            }
          });
        }else{
          this.paymentPolicyTemplateData = serData;
          this.paymentPolicyTemplateDropDown = serData;
        }
      });
    });
  }

  /* to delete
  processData(data){
    let serverData = _.values( _.groupBy(data, 'id'));
    let paymentData = [];
    let payment
    serverData.map((elm) => {
      let pPolicy = [];
      elm.map((elm2) => {
        payment = {
          paymentName : elm2.policy_name,
          is_default : elm2.is_default,
          id: elm2.id,
          creditTermsDays: elm2.creditTerms,
          retensionPercentage: elm2.retetionPercent
        }
        pPolicy.push(elm2)
      });
      payment["paymentPolicy"] = pPolicy;
      paymentData.push(payment)
    });
    this.paymentPolicyTemplateData = paymentData;
    paymentData.map((elm) => {
      this.paymentPolicyTemplateDropDown.push({
        id: elm.paymentPolicy[0].id,
        value: elm.paymentName
      })
    });
  } */

  makeMileStone(mileStone){
    console.log('Justin', this.paymentPolicyTemplateData, mileStone)
    let result = []
    mileStone.map((elm, i) => {
      result.push({
        id: elm.stage_name,
        value: elm.stage_name,
      });

      if(mileStone.length === i+1){
        this.dynamicMileStoneData = result;
      }
    });
  }

  checkIfPojectPaymentExist(){
    let postData = {
      "orgID": localStorage.getItem('org_id'),
      "id": this.project_id,
      "empID": this.userInfo.id,
    }
    this.costService.FetchPaymentPolicy(postData).subscribe((data: any) => {
      if(data.length !== 0){
        this.showPaymentTemplate = false;
        this.oldProjectPaymentData = data;
        let formData = this.paymentMethodologyForm.get('paymentPolicy') as FormArray;
        data.map((elm) => {
          formData.push(this.formBuilder.group({
            PaymentTerms: elm.term_name,
            perProjValue: elm.term_percent,
            projValue: elm.term_value,
          //  metType:'percent',
            mileStone: elm.stage_name,
            triggerEvent: elm.payment_event,
            triggerPerValue: elm.paymentEventpercent,
          }));
        });
      }else{
        this.showPaymentTemplate = true;
        if(this.paymentPolicyTemplateData.length !== 0){
          this.paymentPolicyTemplateData.map((elm) => {
            if(elm.is_default){
              this.makeMileStone(elm.paymentPolicy);
              this.paymentTemplateForm.patchValue({
                paymentTemplate: elm.id
              });

              this.paymentMethodologyForm.patchValue({
                creditTermsDays: elm.creditTermsDays
              });

              if(elm.retensionPercentage !== null){
                this.checkRetType = true;
                this.paymentMethodologyForm.patchValue({
                  retensionPercentage: elm.retensionPercentage,
                  retensionValue: (this.ProjectTotal/100) * parseFloat(elm.retensionPercentage)
                });
              }else{
                this.checkRetType = false;
              }

              let formData = this.paymentMethodologyForm.get('paymentPolicy') as FormArray;
              elm.paymentPolicy.map((elm) => {
                let percentVal = ((parseFloat(elm.term_percent)/100) * this.total_value).toFixed(2);
                formData.push(this.formBuilder.group({
                  PaymentTerms: elm.term_name,
                  perProjValue: elm.term_percent,
                  projValue: percentVal.toString(),
                 // metType:'percent',
                  mileStone: elm.stage_name,
                  triggerEvent: elm.payment_event,
                  triggerPerValue: elm.paymentEventpercent,
                }));
              });
            }
          });
        }else{
          this.addItemRow();
        }
        let formDataCheck = this.paymentMethodologyForm.get('paymentPolicy') as FormArray;
        if(formDataCheck.value.length === 0){
          this.makeMileStone(this.paymentPolicyTemplateData[0].paymentPolicy);
          this.paymentTemplateForm.patchValue({
            paymentTemplate: this.paymentPolicyTemplateData[0].id
          });

          this.paymentMethodologyForm.patchValue({
            creditTermsDays: this.paymentPolicyTemplateData[0].creditTermsDays
          });

          if(this.paymentPolicyTemplateData[0].retensionPercentage !== null){
            this.checkRetType = true;
            this.paymentMethodologyForm.patchValue({
              retensionPercentage: this.paymentPolicyTemplateData[0].retensionPercentage,
              retensionValue: (this.ProjectTotal/100) * parseFloat(this.paymentPolicyTemplateData[0].retensionPercentage)
            });
          }else{
            this.checkRetType = false;
          }

          let formValue = this.paymentTemplateForm.value;
          let arrayData = [];
          this.paymentPolicyTemplateData.map((elm) => {
            if(elm.paymentPolicy[0].id === formValue.paymentTemplate){
              arrayData.push(elm)
            }
          })

          if(arrayData.length !== 0){
            let formData = this.paymentMethodologyForm.get('paymentPolicy') as FormArray;


            arrayData[0].paymentPolicy.map((elm) => {
              let precentVal = ((parseFloat(elm.term_percent)/100) * this.total_value).toFixed(2);
              formData.push(this.formBuilder.group({
                PaymentTerms: elm.term_name,
                perProjValue: elm.term_percent,
                projValue: precentVal.toString(),
               // metType:'percent',
                mileStone: elm.stage_name,
                triggerEvent: elm.payment_event,
                triggerPerValue: elm.paymentEventpercent,
              }));
            });
          }else{
            this.addItemRow();
          }
        }

      }
    });
  }

  changeTemplate(event){

    //console.log(event)
    if(event.itemData != undefined) {
      (this.paymentMethodologyForm.get('paymentPolicy') as FormArray).clear();
      let id = event.itemData.id;
      let arrayData = [];
      this.paymentPolicyTemplateData.map((elm) => {
        if(elm.paymentPolicy[0].id === id){
          arrayData.push(elm)
          this.makeMileStone(elm.paymentPolicy);
          this.paymentMethodologyForm.patchValue({
            creditTermsDays: elm.creditTermsDays
          });

          if(elm.retensionPercentage !== null){
            this.checkRetType = true;
            this.paymentMethodologyForm.patchValue({
              retensionPercentage: elm.retensionPercentage,
              retensionValue: (this.ProjectTotal/100) * parseFloat(elm.retensionPercentage)
            });
          }else{
            this.checkRetType = false;
          }
        }
      });

      if(arrayData.length !== 0){
        console.log(arrayData[0])
        let formData = this.paymentMethodologyForm.get('paymentPolicy') as FormArray;
        arrayData[0].paymentPolicy.map((elm) => {
         // let precentVal = ((parseFloat(elm.perProjValue)/100) * this.total_value).toFixed(2);
        //  console.log("precentVal--->",precentVal,elm);
          formData.push(this.formBuilder.group({
            PaymentTerms: elm.term_name,
            perProjValue: elm.term_percent,
            projValue: ((parseFloat(elm.term_percent)/100) * this.total_value).toFixed(2),
           // metType:'percent',
            mileStone: elm.stage_name,
            triggerEvent: elm.payment_event,
            triggerPerValue: elm.paymentEventpercent,
          }));
        });
      }
    }

  }


  advPymntSetup() {

      let newRow = this.createPaymentPolicy();
      this.advpaymentPolicy.push(newRow);
      let formValue = this.paymentPolicy.value;
      console.log("formValue--->",formValue);
      // formValue.map((elm, index) => {
      //       this.advpaymentPolicy.at(elm).patchValue({
      //         PaymentTerms:'1st Payment',
      //         perProjValue:'100',
      //         projValue: this.total_value ,
      //         triggerEvent: 'Upon completing',
      //         mileStone:'Advance',
      //         triggerPerValue:'100'
      //       })

      // });






      let milArr = [];
      let tskArr = [];
      let advArr = [{
        id: "Advance",
        value:  "Advance",
      }]
      //Update Milestone list
      this.milestoneData.map((el)=>{
        milArr.push({
          id: el.milestone_name,
          value: el.milestone_name,
        });
      });
      this.serviceTasks.map((el)=>{
        tskArr.push({
          id: el.task_name,
          value: el.task_name,
        });
      });
      this.dynamicMileStoneData = advArr.concat(milArr,tskArr);

  }

  addNewTermAdPymtSetup() {

    //console.log(this.totalProjValue);
    console.log(this.total_value);

    var amt = this.totalProjValue;
    amt = parseInt(amt.split(' ')[1].replace(/,/g, ''));
    //console.log(amt < this.total_value)
    if(amt < this.total_value) {
      let newRow = this.createPaymentPolicy();
      this.advpaymentPolicy.push(newRow);
    }


  }

  fetchSerMlstnTsks(serviceId) {
    this.costEstimationService.GetStaticTasksByEstimationId({id:serviceId}).subscribe((serviceTask: any) => {
       this.serviceTasks = serviceTask;
     });
  }
  resetCstmPrefix() {
    this.upNextPrefix = null;
   // console.log('this.upNextPrefix-->',this.upNextPrefix);
    this.GentLastAddedProjectPrefixPrefixByOrgID();
    this.prfxExists = false;
    this.upNextPrefix;
  }


  existPrefix(e) {
    console.log(e.target.value);
    //console.log(e.target.value);
    //784 , 727
    //Check the Prefix type
    if(e.target.value.length > 0) {

      if(this.currentPrefixFrmt.prefix_for === "Sequence") {

        // if(e.target.value.indexOf('/') !== -1 ) {
        //   this.cstmPrefix = null;
        // } else {
          console.log("e.target.value--->",e.target.value);
          this.costEstimationService.FetchProjectprefixById(this.currentPrefixFrmt.prefix_ext +'/'+ e.target.value).subscribe((serData: any) => {
            console.log("serData--->",serData);
            if(serData.length > 0) {
              this.prfxExists = true
              this.cstmPrefix = null;
            } else {
              this.prfxExists = false
              this.cstmPrefix =  this.currentPrefixFrmt.prefix_ext +'/'+ e.target.value;
            }
           });
       // }

      } else if(this.currentPrefixFrmt.prefix_for === "Default") {

        // if(e.target.value.indexOf('/') == -1 ) {
        //   this.cstmPrefix = null;
        // } else {
          this.costEstimationService.FetchProjectprefixById(this.currentPrefixFrmt.prefix_ext +'/'+ e.target.value).subscribe((serData: any) => {
            console.log("serData--->",serData);
            if(serData.length > 0) {
              this.prfxExists = true
              this.cstmPrefix = null;
            } else {
              this.prfxExists = false
              this.cstmPrefix =  this.currentPrefixFrmt.prefix_ext +'/'+ e.target.value;
            }
           });
       // }


      }


    }




  }

  fetchPrjctPrefix() {
    this.projectService.GetAllPrefixByOrgID().subscribe((data:any) => {
      let result = []
      data.map((elm, ind) => {
        if(elm.type === 'project' && this.estAddntlData  === null){
          result.push(elm)
        } else if(this.estAddntlData  != null) {

          let typeBy = this.estAddntlData.isMarketing === "true" ? 'project-marketing' : 'project-complimentary';
          if(elm.type === typeBy){
            result.push(elm)
          }
        }
      });
      this.ntTxtOvr = `As per the Setup for Project Prefix Enter Prefix in ${result[0].prefix_for} I.E ${result[0].prefix_name} `
      this.currentPrefixFrmt = result[0];
      // console.log('this.currentPrefixFrmt--->',this.currentPrefixFrmt);
    });
  }



  saveTemplate(){
    let uniqueID = this.generateId(10);
    let formValue = this.paymentMethodologyForm.getRawValue();
    //let formValue = this.saveTemplatePaymentMethodologyFormValue;
    let formValue2 = this.paymentNameMethodologyForm.value;
    let sendValue = [];
    formValue.paymentPolicy.map((elm) => {
      sendValue.push({
        id: uniqueID,
        policy_name: formValue2.paymentTemplateName,
        is_superAdmin: this.userInfo.is_superadmin,
        org_id : localStorage.getItem('org_id'),
        term_name: elm.PaymentTerms,
        term_percent: elm.perProjValue,
        stage_name: elm.mileStone,
        payment_event: elm.triggerEvent,
        paymentEventpercent: elm.triggerPerValue,
        createdDate: moment().format('L'),
        created_by_empId: this.userInfo.id,
        creditTerms: formValue.creditTermsDays
      });
    })
    let sendData = {
      "paymentPolicy": sendValue
    }
    this.costService.AddPaymentPolicy(sendData).subscribe((data: any) => {
      if(data.status == '200'){
        this.toastr.success('Payment Template Created Successfully');
      }else{
        this.toastr.error('Something went wrong')
      }
      this.onClosePaytemplate();
    });
  }


  onClosePaytemplate(){
    this.paymentMethodologyForm.reset();
    this.paymentNameMethodologyForm.reset();
    $('#save_Pay_Template_modal').modal('hide');
    this.router.navigate(["/projects"]);
  }


  changePaymentOptions(e) {
    if(e.srcElement.checked) {
      this.isPaymentAdvance = true;
      this.advPymntSetup();

    } else {
      this.isPaymentAdvance = false
    }
  }


}
export interface ParentComponentApi {
  callParentMethod: () => void
  // taskParentMethod: () => void

}

