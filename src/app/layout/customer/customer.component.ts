import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { patternValidator } from '../../shared/services';
import Swal from 'sweetalert2';
import { DepartmentService } from '../../services/department.service';
import {MatTableDataSource,MatSort,MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { HistoryService } from '../../services/history.service';
import { DataManager, Query, UrlAdaptor, WebApiAdaptor, ODataAdaptor } from '@syncfusion/ej2-data';
import { GridComponent, EditService, ToolbarService, PageService, ColumnChooserService, EditSettingsModel, ToolbarItems, GridLine,SearchSettingsModel, Column, valueAccessor, ValueAccessor,SortService  } from '@syncfusion/ej2-angular-grids';
import { ProjectService } from '../../services/project.service';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountryService } from '../../services/countryList.service';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { CostService } from '../../services/cost.service';
import moment = require('moment');
import { LeadService } from '../../services/lead.service';
import { DesignationService } from '../../services/designation.service';
import { ɵNullViewportScroller } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { NotificationComponent } from './components';
import { CheckBoxSelectionService , DropDownListComponent  } from '@syncfusion/ej2-angular-dropdowns';
import { UserService } from '../../services/user.service';
import { costEstimationService } from '../../services/costEstimation.service';
import { settingsService } from '../../services/settings.service';
import * as _ from "lodash";
declare var $: any;

let orgId= localStorage.getItem('org_id');
let brList=[]
let date = moment(new Date()).format('L');

let formattedPrefix = moment(date).format('YY/MM/DD');

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CheckBoxSelectionService]
})


export class CustomerComponent implements OnInit {
   @ViewChild('closeBtn',{static:false}) closeBtn: ElementRef;
   @ViewChild('taskCloseBtn',{static:false}) taskCloseBtn: ElementRef;
   @ViewChild('meetCloseBtn',{static:false}) meetCloseBtn: ElementRef;
   @ViewChild('callCloseBtn',{static:false}) callCloseBtn: ElementRef;
   @ViewChild('closeActBtn',{static:false}) closeActBtn: ElementRef;
   @ViewChild('contactCloseBtn',{static:false}) contactCloseBtn: ElementRef;

  dataSource: any;
  editDeptId:string;
  delDeptId:string;
  public currentTime=moment().add(1,'minutes').format('hh:mm a')
  serviceForm: FormGroup;
  showProjectSearchBtn = false;
  projectListingData;
  selectedOriginalProject: any = '';
  extensionsLeadId = '';
  invoiceToolbar : ToolbarItems[];
  @ViewChild('searchProjectdataTableGrid',{static:false}) public searchProjectdataTableGrid: GridComponent;
  showExtensionDiv = true;
  serviceIDError = false;
  commonFields: Object = { text: "value", value: "id" };
  @ViewChild('serviceDropdown',{static:false}) public serviceDropdown: DropDownListComponent;

  public fields: Object = { groupBy: 'category', text: 'text', value: 'id' };
  // Set the popup list height
  public height: string = '200px';
  historyData;
  noHistoryDataDiv;
  historyDataDiv;
  // set the placeholder to the MultiSelect input
  public placeholder: string = 'Select participants';
public showDeptList=true;
public showAddForm=false;
public departmentLeadData: Array<Select2OptionData>;
public taskData: Array<Select2OptionData>;
public departmentLeadValue: string;
public selectedPurpose: string;
public selectedProject: string;
public selectedTask: string;
public deptOptions:Select2Options;
public deptForm: FormGroup;
public displayedColumns = [ 'index','dep_name', 'alias','workemail','lead_name','Action'];
public editable=false;
public AddNewSubmit=true;
public dealTabDisabled=true;
public addformSubmitted=false;
public editformSubmitted=false;
searchField;
public compData: Object[];
public data: DataManager;
public title: string = 'Attorney Comp';
public lines: GridLine = <GridLine>'Both';
public editSettings: EditSettingsModel;
public toolbar: string[];
public initialSort: Object;
public pageSettings: Object;
public searchOptions: SearchSettingsModel;
phoneInvalid: boolean;
phoneErrorMsg: any;
phoneNumberValue:string;
separateDialCode = true;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  public selectedISO=CountryISO.UnitedArabEmirates;
  pageSize: any = 10;
  currentPage: any = 1;
  pgData=[];
  today=new Date();
  public disableSaveBranch=true;

  serviceDropDownData;
public leadStatusData=[
//   {
//   id:'',
//   text:'Select'
// },{
//   id:'1',
//   text:'Attempted to contact'
// },{
//   id:'2',
//   text:'Contact in future'
// },{
//   id:'3',
//   text:'Contacted'
// },{
//   id:'4',
//   text:'Junk Lead'
// },{
//   id:'5',
//   text:'Lost Lead'
// },{
//   id:'6',
//   text:'Not Contacted'
// }
]
reasonData=[{
  id:'',
  text:'Select'
},{
  id:'1',
  text:'Not interested'
},{
  id:'2',
  text:'Commited to another company'
},{
  id:'3',
  text:'Other'
}]
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
activeTab = 'kt_user_edit_tab_1';
  departmentData: { id: string; text: string; }[];
  deptValue: any;
  desgnData: { id: string; text: string; }[];
  desgnValue: any;
  deptName: any;
  desgnName: any;
  nextSubmit: boolean=false;
  conversionForm: FormGroup;
  convertProjId: any;
  convertSubmitClicked: boolean=false;
  conversionOpt= [];
  showConvertPrefixSelect: boolean=true;
  enddateValue: string;
  companyName: any[];
  stageVal: any='';
  roleVal: any='';
  dealTypeData: any[];
  dealDetails: any;
  contactDetails: any='';
  convertAsCost: any=false;
  customerEmail: any;
  customerDetails: any;
  addCustomer: boolean=false;
  customerData: { id: string; text: string; }[];
  customerVal: any='';
  leadCustomerForm: FormGroup;
  addCstformSubmitted: boolean;
  showCompanyDet: boolean=false;
  reasonValue: any;
  reasonValueTxt: any;
  showReasonSelect: boolean=false;
  showReasonRemarks: boolean=false;
  showManualDet: boolean=false;
  convertCstId: any;
  cstCountryValue: any='';
  cstRelationValue: any;
  cstRelationValueTxt: any='';
  lostLead: boolean=true;
  showTextArea4: boolean=false;
  cstDetails: any;
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
  mode: string;
  startValChange: boolean=false;
  showValidTimeError: boolean;
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
  callCstId: any;
  closeActLog: boolean=false;
  typeOfModal: string;
  entityContactList=[];
  showList: boolean;
  showAddBtn: boolean;
  showEditBtn: boolean;
  showDeleteBtn: boolean;
  showEstBtn: boolean;
  savedContactPh: boolean;
  public selectedCstISO=CountryISO.UnitedArabEmirates;
  minStartTime: string;
  currentVal: string;
  primaryCheck: boolean;

search(activeTab){
  this.nextSubmit=true;


  if (this.ownerValue != '' && this.leadSourceValue!='' && this.statusValue!='' && this.customerVal!='' && (this.showReasonSelect?this.reasonValue!='':true) && ((this.showReasonSelect && this.showReasonRemarks)?this.customerForm.get('remarks').value!='':true)  ) {
    this.nextSubmit=false;
    this.dealTabDisabled=false;

    this.projectForm.patchValue({
      prefixVal: 'is_auto',
    })
  this.activeTab = activeTab;
  }
}


GetEstimationServiceByOrgId(){
  this.settingService.GetEstimationServiceByOrgId().subscribe((data: any) => {
    let serviceData = _.values(_.groupBy(data, 'id'));
    let serviceDataProcess = [];
    serviceData.map((elm, e) => {
      let checkDefault = [];
      elm.map((elm2, e2) => {
        if(elm2.is_default){
          checkDefault.push(elm2.is_default)
        }

        if(elm.length === e2+1){
          let serviceObj = {
            id: elm2.id,
            value: elm2.serviceName,
            isDefault: checkDefault.length === 0 ? false : true
          }
          serviceDataProcess.push(serviceObj);
        }
      });

      if(serviceData.length === e+1){
        this.serviceDropDownData = serviceDataProcess;
        let defaultCT = serviceDataProcess.filter(contractTyp => contractTyp.isDefault);
        this.serviceForm.patchValue({
          serviceID: defaultCT.length === 0 ? serviceDataProcess[0].id : defaultCT[0].id
        });
        this.spinner.hide();
      }
    });
  });
}


result(activeTab){
   if (this.ownerValue != '' && this.leadSourceValue!='' && this.statusValue!='' && this.customerVal!=''&&(!this.showOrgDetails?( this.customerForm.get('contact_no').status=='VALID'):true)   ) {

  this.activeTab = activeTab;
  }
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
        //used Arrow function here
        (result) => {

          //  this.router.navigate(['/dashboard']);
        })


    }

  )
}
onCloseActClose(){
  $("#close_act_modal").modal('hide');
  this.closeActBtn.nativeElement.click();

}
ConvertToProj(id,project){
  this.GetEstimationServiceByOrgId();
  this.fetchDesignType();
    this.GetProjectTypeByOrgID();
    this.convertProjId=id
    if(project!=null){
      this.conversionOpt=[{
        'label':'Create a new contact project',
        'value':'new'
      },{
        'label':' Convert with existing project',
        'value':'existing'
      }]
    }else{
      this.conversionOpt=[{
        'label':'Create a new contact project',
        'value':'new'
      }]
    }

  $('#conversion_modal').modal('show');
  // this.conversionForm.patchValue({
  //   prefixVal: 'is_auto',
  // })

  // this.FindAutoProjectPrefixByOrgID();
  let postData={
    id:this.convertProjId
  }

  this.leadService.FindByLeadId(postData).subscribe(
    (data:any)  => {

  if(data){
    this.convertCstId=data.cst_id

  }
  this.cstDetails=data;
    if(data.leadDeal){
      setTimeout(()=>{
        this.projId=data.leadDeal.id;
        if(data.cst_id!=''){
          this.customerDetails=data;

        }
        // this.desgnTypeVal=data.leadProject.design_type_id;
        // this.projTypeVal=data.leadProject.project_type_id;
        // this.pkgTypeVal=data.leadProject.packages_id;
      },800)
   this.dealDetails=data.leadDeal;
   this.entityContactList=data.entityContact;
   if(data.entityContact.length!=0){
     for(var i=0;i<data.entityContact.length;i++){

       if(data.entityContact[i]['is_primary']==true){
    this.contactDetails=data.entityContact[i];

       }
     }

   }else{
     this.contactDetails='';
   }
      this.project_prefix_val=data.leadDeal.deal_prefix;
      this.conversionForm.patchValue({
        // project_name: data.leadDeal.deal_name,
         amount: data.leadDeal.est_amount,

      })
  }

    },

    error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        //used Arrow function here
        (result)=> {

          //  this.router.navigate(['/dashboard']);
        })


    }

    )

}
public onConvertCheckChange(e){
  if(e.srcElement.checked==true){
    this.convertAsCost=true;

  }else{
    this.convertAsCost=false;

  }
  // this.isApprove=true;
}
public  GetLastAddedCostPrefixByOrgID(){
  this.spinner.show();
  this.costService.GetLastAddedCostPrefixByOrgID().subscribe(

    (data:any) => {

  if(data.code==""){
    this.projectService.GetAllPrefixByOrgID().subscribe(

      (data:any) => {
        this.spinner.hide();

    for(var i=0;i<data.length;i++){
      if(data[i].type=="est"){
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

    this.AddCostProj(this.convertCstId)

      },
      error  => {
        this.spinner.hide();

        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })


      }

      )
  }else{
    let lastAddedprefix=data.code;
    let lastAddprefixSplit=lastAddedprefix.split('/').pop();
    this.projectService.GetAllPrefixByOrgID().subscribe(

      (data:any) => {
        this.spinner.hide();

    for(var i=0;i<data.length;i++){
      if(data[i].type=="est"){
        if(data[i].prefix_for=="default"){
          let splittable;

          if(data[i].prefix_name){
          let prefix_name=data[i].prefix_name;

           splittable =  prefix_name.split('/');
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
  this.AddCostProj(this.convertCstId)


      },
      error  => {
        this.spinner.hide();

        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
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
        //used Arrow function here
        (result)=> {

          //  this.router.navigate(['/dashboard']);
        })


    }

    )
    }
    GetLastAddedQtnPrefixByOrgID(){
      this.spinner.show();
      this.qtnService.GetLastAddedQuotationPrefixByOrgID().subscribe(

        (data:any) => {

      if(data.code==""){
        this.projectService.GetAllPrefixByOrgID().subscribe(

          (data:any) => {
            this.spinner.hide();

        for(var i=0;i<data.length;i++){
          if(data[i].type=="qtn"){
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

        this.AddQtn(this.convertCstId)

          },
          error  => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(
              //used Arrow function here
              (result)=> {

                //  this.router.navigate(['/dashboard']);
              })


          }

          )
      }else{
        let lastAddedprefix=data.code;
        let lastAddprefixSplit=lastAddedprefix.split('/').pop();
        this.projectService.GetAllPrefixByOrgID().subscribe(

          (data:any) => {
            this.spinner.hide();

        for(var i=0;i<data.length;i++){
          if(data[i].type=="qtn"){
            if(data[i].prefix_for=="default"){
              let splittable;

              if(data[i].prefix_name){
              let prefix_name=data[i].prefix_name;

               splittable =  prefix_name.split('/');
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
      this.AddQtn(this.convertCstId)


          },
          error  => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(
              //used Arrow function here
              (result)=> {

                //  this.router.navigate(['/dashboard']);
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
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )
        }
AddCostProj(cstId){
  let formValue = this.serviceForm.value;
  let user;
  if (localStorage.getItem('user_info')) {
    user = JSON.parse(localStorage.getItem('user_info'));

  }

let postData = {

  // project_name: this.projectForm.get('project_name').value  ,

  // cst_id: this.customerVal,
  // project_type_id:this.projTypeVal,



  "id": null,
  "user_id": user['user_id'],
  "org_id": localStorage.getItem('org_id'),
 "cst_id":cstId,
 "service_id": formValue.serviceID,
  "project_type_id": null,
  "package_id":null,
  "project_name": this.dealDetails.deal_name,
  "project_prefix":this.prefixString,
  // "is_boq": this.BOQvalue,
  "plot_size":null,
  "buildup_area":null,
  // "is_site_visit": this.siteVal,
  "no_of_floors":null ,
  "total_unit":null,
  "createdby": user['full_name'],
  "typeOfDesign":  null,
  "projectUnit": null,


  //   "entityContact":this.contactDetails!=''?[{
  //     "id": this.contactDetails.id!=''?this.contactDetails.id:null,
  //     "entity_id": this.contactDetails.entity_id!=''?this.contactDetails.entity_id:null,
  //     name: this.contactDetails.first_name!=''?(this.contactDetails.first_name+' '+this.contactDetails.last_name):null,
  //      city: null,
  //      country: null,
  //     phone: this.contactDetails.phone!=''?this.contactDetails.phone:null,

  //     email: this.contactDetails.email!=''?this.contactDetails.email:null,


  // }]:null,
  "entityContact":this.entityContactList.length!=0?this.entityContactList:null
}

if(  this.dealDetails.deal_name!=''){

  return this.costEstimationService.NewAddCostProject(postData).subscribe(
    (data: any) => {


if(data){
  this.leadService.UpdateCstProjectIdByLeadId({ "id": this.convertProjId, "empId": data.id }).subscribe((data) => {

  });
//this.OnConversionClose();
this.AddEntityHistory(cstId,'cost')
let formValue = this.serviceForm.value;
let sendData = {
  projectId: data.id,
  serviceId: formValue.serviceID
}
this.costEstimationService.ProjectEstimationService(sendData).subscribe((resData:any)=>{
  console.log(resData)
  this.OnConversionClose();
});
 this.toastr.success('Added to estimation', undefined, {
          positionClass: 'toast-top-center'
        });
this.convertSubmitClicked=false;
        this.spinner.hide();
        // this.router.navigate('/cost-project')
        /* this.router.navigate(['/cost-estimate']);

        sessionStorage.setItem('costId',data.id); */
        this.router.navigate(['/cost-estimation']);
        sessionStorage.setItem('Estimation-ID',data.id);
        sessionStorage.setItem('reload', 'yes');

      }else{
        this.spinner.hide();
        this.OnConversionClose();

        this.toastr.error('Something went wrong,please try again later', undefined, {
          positionClass: 'toast-top-center'
        });

      }

      let convID = data.id
      let postData = {
        entity_id: convID,
        event_type: "Lead Converted",
        event_desc: "Successfully lead is converted Estimation",
      };
      this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
        console.log(data)
            if(data){
              this.getLeadHistory(convID);
          }
      });

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
  this.OnConversionClose();
  this.spinner.hide();
}
}

changeService(event){
  this.serviceForm.patchValue({
    serviceID: event.itemData.id
  })
}

serviceFormInputs(){
  this.serviceForm = this.formBuilder.group({
    serviceID: ['']
  });
}

AddQtn(cstId){
  let user;
  if (localStorage.getItem('user_info')) {
    user = JSON.parse(localStorage.getItem('user_info'));

  }
let postData = {
  "id": null,
  "org_id": localStorage.getItem('org_id'),
  "lead_id": null,
  // "quotation_prefix": this.dealDetails.deal_prefix,
  "quotation_prefix": this.prefixString,
  "quotation_date": moment().format('L'),
  "customer_id": cstId,
  "project_name": this.dealDetails.deal_name,
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
  "stage_id": null,
  "createdby": user['full_name'],

}

if(  this.dealDetails.deal_name!=''){

  return this.qtnService.AddQuotation(postData).subscribe(
    (data: any) => {


if(data){
this.OnConversionClose();
this.AddEntityHistory(cstId,'qtn')

 this.toastr.success('Added to quotation', undefined, {
          positionClass: 'toast-top-center'
        });
this.convertSubmitClicked=false;
        this.spinner.hide();
        // this.router.navigate('/cost-project')
        this.router.navigate(['/quotation']);

        // sessionStorage.setItem('projectId',data.code);

      }else{
        this.spinner.hide();
        this.OnConversionClose();

        this.toastr.error('Something went wrong,please try again later', undefined, {
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



}else{
  this.OnConversionClose();
  this.spinner.hide();
}
}
onConvertLeadProj(){
  let formValue = this.serviceForm.value;
  if(formValue.serviceID !== ''){
    this.spinner.show();
    this.updateLeadStatus('quotation')
  }else{
    this.serviceIDError = true;
  }
}
updateLeadStatus(type){
  let costleadStatusId;
  let projectleadStatusId;
  this.leadService.GetAllLeadStatusByOrgID().subscribe(
    (data: any) => {


      for (var i = 0; i < data.length; i++) {
        if(data[i].lead_status=="Cost Estimation"){
          costleadStatusId= data[i].id;
            }
            if(data[i].lead_status=="Project"){
              projectleadStatusId= data[i].id;
                }


    }
    if(costleadStatusId!=''|| costleadStatusId!=undefined){
      let postData={

        "id": this.convertProjId,
        "lead_status_id":type=="project"?projectleadStatusId:costleadStatusId,
        "leadDeal": {
          "lead_id": this.convertProjId,
          "est_amount": this.conversionForm.get('amount').value,
          "is_manual": this.showManualDet,
          "basic_cost":type=="project"?this.conversionForm.get('basicCost').value:null,
          "remarks": this.conversionForm.get('remarks').value,
        }
      }

       this.leadService.UpdateLeadStatusByLeadID(postData).subscribe(
        (data: any) => {

      if(data){
          this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });
            if(type=="quotation"){
              // this.AddQtn(this.convertCstId)
              this.GetLastAddedQtnPrefixByOrgID();



            }else{
              //this.AddCostProj(this.convertCstId)
              this.GetLastAddedCostPrefixByOrgID();

            }




          }

        },
        error => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result) => {

              //  this.router.navigate(['/dashboard']);
            })


        }

      )
    }


    },
    error => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        //used Arrow function here
        (result) => {

          //  this.router.navigate(['/dashboard']);
        })


    }

  )
}
public AddEntityHistory(cstid,type){

// let postData={
//   "id": null,
//   "entity_id": cstid,
//   "event_type": "Lead Converted",
//   "event_desc": "",
//   "event_before": "Lead",
//   "event_after": type=='cost'?"Estimation":"Quotation",

// }


//   this.spinner.show();

//     return this.projectService.AddEntityHistoryLog(postData).subscribe(
//         (data:any)  => {
//           if(data){
//             this.spinner.hide();

//           }


//         },
//         error  => {
//           Swal.fire(
//             'Error!',
//             error,
//             'error'
//           ).then(
//             (result)=> {

//             })


//         }

//        )






}

redirectToCost(){
  let formValue = this.serviceForm.value;
  if(formValue.serviceID !== ''){
    this.convertSubmitClicked=true;
    this.spinner.show();
    this.updateLeadStatus('cost')
  }else{
    this.serviceIDError = true;
  }
}
public findCstName(data){
  let cstData={
    "customerName":( data.first_name!==null)?(data.first_name+' '+data.last_name):data.lead_company_name,
    "email": data.email
  }


  return this.leadService.FindByCustomerByNameAndEmail(cstData).subscribe(
    (data: any) => {



       if (data) {
         if(data.id==''){
           this.addCustomer=true
           let cstPostData
           if(this.customerDetails!=''){
             cstPostData={
               "id": null,
               // "org_id":  this.customerDetails.org_id,
               "cst_name": this.customerDetails.first_name!=null?(this.customerDetails.first_name+' '+this.customerDetails.last_name):this.customerDetails.lead_company_name,
               "cst_type": null,
               "email": this.customerDetails.email,
               "phone": this.customerDetails.phone,
               "adr": this.customerDetails.adr_1,
               "street": this.customerDetails.adr_2,
               "country": this.customerDetails.country_id,
               "city": this.customerDetails.city,

               // "createdby":this.customerDetails.createdby,



               "entityContact":this.contactDetails!=''?({
                 "id": null,
                 "entity_id":null,
                 name: this.contactDetails.first_name!=''?(this.contactDetails.first_name+' '+this.contactDetails.last_name):null,
                 first_name:this.contactDetails.first_name,
                 last_name:this.contactDetails.last_name,
                 department:this.contactDetails.department,
                 designation:this.contactDetails.designation,
                 note:this.contactDetails.note,
                 city: null,
                  country: null,
                 phone: this.contactDetails.phone!=''?this.contactDetails.phone:null,

                 // mobile: this.projectForm.get('mobile').value ,
                 email: this.contactDetails.email!=''?this.contactDetails.email:null,


             }):({
               "id": null,
               "entity_id":null,
               name: this.customerDetails.first_name!=null?(this.customerDetails.first_name+' '+this.customerDetails.last_name):this.customerDetails.lead_company_name,
               first_name:this.customerDetails.first_name,
               last_name:this.customerDetails.last_name,
               department:null,
               designation:null,
               note:null,
               city: null,
                country: null,
               phone: this.customerDetails.phone!=''?this.customerDetails.phone:null,

               // mobile: this.projectForm.get('mobile').value ,
               email: this.customerDetails.email!=''?this.customerDetails.email:null,


           }),
             }
           }





             return this.costService.AddCustomer(cstPostData).subscribe(
               (data: any) => {


           if(data){

             this.AddCostProj(data.code)

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





         }else{
          this.addCustomer=false
          this.AddCostProj(data.id)

         }



        // this.toastr.success(data['desc'], undefined, {
        //   positionClass: 'toast-top-center'
        // });


      }
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
public firstName = [
  {display: 'firstName1', value: 1,email:'asda'},
  {display: 'firstName2', value: 2,email:'adsdsda'},
  {display: 'firstName3', value: 3,email:'sdasda'},
];
public contactNo = [
  {display: '+91-050285156', value: '+91-050285156'},
  {display: '+971-050436679', value: '+91-050285156'},
  {display: '+971-050285567', value: '+91-050285156'},
];
public lastName = [
  {display: 'lastName1', value: 1},
  {display: 'lastName2', value: 2},
  {display: 'lastName3', value: 3},
];
public leadSourceData=[{
  id:'',
  text:'Select'
},{
  id:'1',
  text:'Advertisement'
},{
  id:'2',
  text:'Cold Call'
},{
  id:'3',
  text:'Employee Referral'
},{
  id:'4',
  text:'External Referral'
},{
  id:'5',
  text:'Online store'
},{
  id:'6',
  text:'Partner'
}]
public ratingData=[{
  id:'',
  text:'Select'
},{
  id:'1',
  text:'Active'
},{
  id:'2',
  text:'Acquired'
},{
  id:'3',
  text:'Market Failed'
},{
  id:'4',
  text:'Project Cancelled'
},{
  id:'5',
  text:'Shutdown'
}]
public companyData=[{
  id:'',
  text:'Select'
},{
  id:'1',
  text:'Active'
},{
  id:'2',
  text:'Acquired'
},{
  id:'3',
  text:'Market Failed'
},{
  id:'4',
  text:'Project Cancelled'
},{
  id:'5',
  text:'Shutdown'
}]
public leadOwnerData=[
  //{
//   id:'',
//   text:'Select'
// },{
//   id:'1',
//   text:'Active'
// },{
//   id:'2',
//   text:'Acquired'
// }
]
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
public industryData =[{
  "id": '',
  "text": 'Select'
},{
  "id": '1',
  "text": 'Industry 1'
}, {
  "id": '2',
  "text": 'Industry 2'
}]

@ViewChild(MatSort, {static: false}) sort: MatSort;
public columns: Object[];
  @ViewChild('gridAttorneyComp', {static: false})
  public gridComp: GridComponent;
  @ViewChild('grid',{static:false})
    public grid: GridComponent;
  data12: any;
  customerForm: FormGroup;
  planType: string;
  countryData: { id: string; text: string; }[];
  taskOptions: { placeholder: string; width: string; };
  countryValue: any='';
  countryValueTxt: any;
  emailForm: any;
  submitClicked: boolean=false;
  url: any;
  statusValue: any='';
  statusValueTxt: any;
  leadSourceValue: any='';
  leadSourceValueTxt: any;
  showOrgDetails: boolean=false;
  companyForm: FormGroup;
  showAddContact: boolean=false;
  branchDataSource: any;
  customerContactForm: FormGroup;
  projectForm: FormGroup;
  designTypeData: { id: string; text: string; }[];
  projectTypeData: { id: string; text: string; }[];
  stageData=[
    // { id: 1, text: 'Qualification' },
    // { id: 2, text: 'Needs Analysis' },
    // { id: 3, text: 'Value Proposition' },
    // { id: 4, text: 'Closed Lost' },
    // { id: 5, text: 'Closed Lost to Competition' }
];
roleData=[
  // { id: 1, text: 'None' },
  // { id: 2, text: 'Developer' },
  // { id: 3, text: 'Decision Maker' },
  // { id: 4, text: 'Purchasing' },
  // { id: 5, text: 'Engineering Lead' }
];
  prefixExists: boolean;
  prefixString: string;
  showPrefixText: boolean=false;
  projTypeVal: any;
  desgnTypeVal: any;
  pkgTypeVal: any;
  customPrefix: any;
  designTypeForm: FormGroup;
  projTypeForm: FormGroup;
  companyValue: any='';
  ownerValue: any='';
  industryValue: any;
  projTypeSubmit: boolean=false;
  designTypeSubmit: boolean;
  leadAddSubmit: boolean=false;
  ratingValue: any;
  showBranchList: boolean=false;
  project_prefix_val: any;
  projId: any;
  constructor(
    public costEstimationService: costEstimationService,
    public settingService: settingsService,
    private deptService: DepartmentService,private quotationService:QuotationService,private userService:UserService, private qtnService:QuotationService,private desgnService:DesignationService, private leadService:LeadService,  private costService:CostService, private formBuilder: FormBuilder,private spinner:NgxSpinnerService,private countries:CountryService,private projectService:ProjectService, private empService:EmployeeService, private toastr: ToastrService,public router:Router, public histSer: HistoryService)

  {
    this.taskOptions={
      placeholder:'Select',
      width:'100%'
    }
    this.departmentLeadValue = '';
    this.selectedPurpose = '';
    this.selectedProject='';
    this.selectedTask='';
    this.deptOptions={
      placeholder: { id: '  ', text: 'Select' },  allowClear: true,
      width:'100%'
    }
     this.departmentLeadData = []
   }
   public changedCountry(e: any): void {
    this.countryValue= e.value;
    // this.countryValueTxt= e.data[0].text;
    if(e.data[0]){
      this.countryValueTxt= e.data[0].text;

    }
  }
  public changedCstRelation(e: any): void {
    this.cstRelationValue= e.value;
    // this.countryValueTxt= e.data[0].text;
    if(e.data[0]){
      this.cstRelationValueTxt= e.data[0].text;

    }
  }
  changedCstCountry(e: any): void {
    this.cstCountryValue= e.value;
    // this.countryValueTxt= e.data[0].text;

  }
  public onCheckChange(e){
    if(e.srcElement.checked==true && !this.showOrgDetails){
      let entityContact=this.customerForm.get('contact_no').value;
      console.log('entityContact',entityContact)
      if(entityContact!=null){
        this.selectedCstISO=entityContact.countryCode;
        this.customerContactForm.patchValue({

          mobile:(this.customerForm.get('contact_no').value!='' && this.customerForm.get('contact_no').value!=null) ?entityContact.number:'',

         })
        }

      let fName= this.customerForm.get('first_Name').value!=''?this.customerForm.get('first_Name').value:'';
      let lName= this.customerForm.get('last_Name').value!=''?this.customerForm.get('last_Name').value:'';

   this.customerContactForm.patchValue({
    fname: this.customerForm.get('first_Name').value!=''?this.customerForm.get('first_Name').value:'',
    lname: this.customerForm.get('last_Name').value!=''?this.customerForm.get('last_Name').value:'',
    email:this.customerForm.get('email').value!=''?this.customerForm.get('email').value:'',
    relationship:this.customerForm.get('relationship').value!=''?this.customerForm.get('relationship').value:'',
    designation:this.customerForm.get('designation').value!=''?this.customerForm.get('designation').value:'',
    note:this.customerForm.get('note').value!=''?this.customerForm.get('note').value:'',
   })

  }else{
    this.customerContactForm.patchValue({
      fname:'',
      lname:'',
      mobile:'',
      relationship:'',
      designation:'',
      note:'',


     })
  }
}
  toCstProfile(id){
              this.router.navigate(['/customer-dashboard']);
              localStorage.setItem('cstId',id);

  }
  changedIndustry(e: any): void {
    this.industryValue = e.value;

  }
  changedRating(e: any): void {
    this.ratingValue = e.value;

  }
  public changedProjType(e: any): void {
    this.projTypeVal = e.value;

  }
  public changedDesgnType(e: any): void {
    this.desgnTypeVal = e.value;

  }
  public changedStage(e: any): void {
    this.stageVal = e.value;

  }
  public changedRole(e: any): void {
    this.roleVal = e.value;

  }
  public changedOwner(e: any): void {
    this.ownerValue = e.value;
    console.log('changedOwner',this.projectForm.get('project_amount').value);

  }
  public changedPkgType(e: any): void {
    this.pkgTypeVal=e.value;
      }

  saveContactAddress(e){



    //     let user_info:object;
    // if(localStorage.getItem('user_info')){
    //     user_info= JSON.parse(localStorage.getItem('user_info'));
    //

    // }
    this.savedContactPh=true;
      let data={
        // brName:this.orgProfileForm.get('brName').value,
        // brType:this.industryValueText,
        // brAddress:this.brsearchElementRef.nativeElement.value,
        "id":null,
        "entity_id":null,
        "first_name":this.customerContactForm.get('fname').value,
        "last_name": this.customerContactForm.get('lname').value,
        "name":this.customerContactForm.get('fname').value+' '+ this.customerContactForm.get('lname').value,
        // "phone":this.customerContactForm.get('mobile').value ,
        "phone":(this.customerContactForm.get('mobile').value!=null && this.customerContactForm.get('mobile').value!='')? this.customerContactForm.get('mobile').value.internationalNumber.replace(/ /g, ""):null,
        "phone_iso_name":(this.customerContactForm.get('mobile').value!=null && this.customerContactForm.get('mobile').value!='')?this.customerContactForm.get('mobile').value.countryCode:null,
        "email": this.customerContactForm.get('email').value,
        "note": this.customerContactForm.get('note').value,
        "department": null,
        "relationship": this.cstRelationValueTxt!='Select' && this.cstRelationValueTxt!=''?this.cstRelationValueTxt:null,
        "designation": this.customerContactForm.get('designation').value,
        "is_primary":false

      }

      if(this.customerContactForm.get('mobile').status=='VALID'){
        this.savedContactPh=false
        brList.push(data)

        brList[0]['is_primary']=true;
        this.showAddContact=false;
        this.branchDataSource=brList;
        this.customerContactForm.reset();
        this.cstRelationValue='';
       this.disableSaveBranch=true;

      }
      // this.industryBranchValue='';

      //  if(this.editable){
      //    this.onEditSubmit(e)
      //  }

      }
  brDelete(index){
    this.branchDataSource.splice(index,1)
    brList.splice(index,1)
  }
  public checkIsOrg(e){
    if(e.srcElement.checked==true){
this.showOrgDetails=true;
    }else{
this.showOrgDetails=false;

    }
  }
  public checkIsManual(e){
    if(e.srcElement.checked==true){
this.showManualDet=true;
    }else{
this.showManualDet=false;

    }
  }
  public AddCompany(){

    $('#company_modal').modal('show')
  }
  OnCompanyClose(){
    $('#company_modal').modal('hide')
  }
  OnConversionClose(){
    $('#conversion_modal').modal('hide')
    this.serviceDropdown.value = null;
    this.serviceForm.reset();
    this.serviceIDError = false;
    this.conversionForm.reset();
    this.conversionForm.patchValue({
      Type:"new"
    })
    this.desgnTypeVal='';
    this.projTypeVal='';
    this.pkgTypeVal='';
    this.desgnTypeVal='';
    this.projTypeVal='';
    this.pkgTypeVal='';
    this.showPrefixText=false;

  }
  public changedCompany(e: any): void {
    this.companyValue= e.value;
    // this.countryValueTxt= e.data[0].text;
    if(e.data[0]){
      this.statusValueTxt= e.data[0].text;

    }
  }
  public changedLeadStatus(e: any): void {
    this.statusValue= e.value;
    // this.countryValueTxt= e.data[0].text;
    if(e.data[0]){
      this.statusValueTxt= e.data[0].text;
  if(this.statusValueTxt=='Lost Lead'){
    this.showReasonSelect=true;
  }else{
    this.showReasonSelect=false;

  }
    }
  }
  public changedReason(e: any): void {
    this.reasonValue= e.value;
    // this.countryValueTxt= e.data[0].text;
    if(e.data[0]){
      this.reasonValueTxt= e.data[0].text;
      if(this.reasonValueTxt=='Other'){
        this.showReasonRemarks=true;
      }else{
        this.showReasonRemarks=false;

      }

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
          //used Arrow function here
          (result) => {

            //  this.router.navigate(['/dashboard']);
          })


      }

    )
  }
  public GetCompanyByOrgID() {
    this.leadService.GetAllLeadCompanyByOrgID().subscribe(
      (data: any) => {
        var results = [{
          "id": '',
          "text": 'Select'
        }]

        for (var i = 0; i < data.length; i++) {

          results.push({
            "id": data[i].id,
            "text": data[i].company_name
          });

        }


        this.companyData = results;


      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result) => {

            //  this.router.navigate(['/dashboard']);
          })


      }

    )
  }
  public GetSourceByOrgID() {
    this.leadService.GetAllLeadSourceByOrgID().subscribe(
      (data: any) => {
        var results = [{
          "id": '',
          "text": 'Select'
        }]

        for (var i = 0; i < data.length; i++) {

          results.push({
            "id": data[i].id,
            "text": data[i].lead_source
          });
        if(data[i].lead_source=='Instagram'){
this.leadSourceValue=data[i].id;
        }


        }


        this.leadSourceData = results;


      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result) => {

            //  this.router.navigate(['/dashboard']);
          })


      }

    )
  }
  public GetStatusByOrgID() {
    this.leadService.GetAllLeadStatusByOrgID().subscribe(
      (data: any) => {
        var results = [{
          "id": '',
          "text": 'Select'
        }]

        for (var i = 0; i < data.length; i++) {
if(data[i].lead_status!="Cost Estimation" && data[i].lead_status!="Project" ){
  results.push({
    "id": data[i].id,
    "text": data[i].lead_status
  });
}
if(data[i].lead_status=="Active"  ){
  this.statusValue=data[i].id;
}

        }


        this.leadStatusData = results;


      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result) => {

            //  this.router.navigate(['/dashboard']);
          })


      }

    )
  }
  public GetRatingByOrgID() {
    this.leadService.GetAllLeadRatingByOrgID().subscribe(
      (data: any) => {
        var results = [{
          "id": '',
          "text": 'Select'
        }]

        for (var i = 0; i < data.length; i++) {

          results.push({
            "id": data[i].id,
            "text": data[i].rating_name
          });

        }


        this.ratingData = results;


      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result) => {

            //  this.router.navigate(['/dashboard']);
          })


      }

    )
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
          //used Arrow function here
          (result) => {

            //  this.router.navigate(['/dashboard']);
          })


      }

    )
  }

  changedLeadSource(e: any): void {
    this.leadSourceValue= e.value;
    // this.countryValueTxt= e.data[0].text;
    if(e.data[0]){
      this.leadSourceValueTxt= e.data[0].text;

    }
  }
   public getCountryList(){
    // this.countryData = []
    // this.countryValue=''

    return this.countries.getCountryList().subscribe(
      (data:any)  => {
        // let dataObj = JSON.parse(data['token']);


    var results=[{ id: '  ', text: 'Select' }]

        // let dataObj = JSON.parse(data['token']);
      //
  for (var i = 0; i < data.length; i++) {
  // logik to create new items

  results.push({
      "id": data[i].id,
      "text": data[i].name
  });
  if(data[i].name=='United Arab Emirates'){
    this.cstCountryValue=data[i].id;
    this.countryValue=data[i].id;

  }

  }


  this.countryData =results;

      },
      error  => {
        Swal.fire(
          'Error!',
          'Error.',
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })


      }

      )
  }
  typeChange(type){
if(type=='existing'){
  let postData={
    id:this.convertProjId
  }
  this.showConvertPrefixSelect=false;
  this.leadService.FindByLeadId(postData).subscribe(
    (data:any)  => {


    if(data.leadProject){
      setTimeout(()=>{
        this.projId=data.leadProject.id,
        this.desgnTypeVal=data.leadProject.design_type_id;
        this.projTypeVal=data.leadProject.project_type_id;
        this.pkgTypeVal=data.leadProject.packages_id;
      },800)

      this.project_prefix_val=data.leadProject.project_prefix;
      this.conversionForm.patchValue({

        project_name: data.leadProject.project_name,
        amount: data.leadProject.project_amount,
      })
  }

    },

    error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        //used Arrow function here
        (result)=> {

          //  this.router.navigate(['/dashboard']);
        })


    }

    )
}else{
  this.conversionForm.reset();
  this.showConvertPrefixSelect=true;

  this.conversionForm.patchValue({
    Type:"new",
    prefixVal: 'is_auto',

  })

  this.desgnTypeVal='';
    this.projTypeVal='';
    this.pkgTypeVal='';
    this.project_prefix_val='';

}

  }
  public customRadioChange() {

    // if (this.projectForm.get('prefixVal').value == 'is_custom' ||this.conversionForm.get('prefixVal').value == 'is_custom' ) {
      if (this.projectForm.get('prefixVal').value == 'is_custom' ) {
      this.showPrefixText = true;

    } else {
      this.showPrefixText = false;
      // this.FindAutoProjectPrefixByOrgID();

    }
  }

  public daysRadioChange() {

    // if (this.projectForm.get('prefixVal').value == 'is_custom' ||this.conversionForm.get('prefixVal').value == 'is_custom' ) {
      if (this.projectForm.get('no_of_days').value == '7' ) {
      // let fromDate=moment(this.today).add(7, 'day').toDate();

        this.projectForm.patchValue({
          endDate:moment(this.today).add(7, 'day').toDate()
        })

    } else if (this.projectForm.get('no_of_days').value == '15' ) {
      // let fromDate=moment(this.today).add(14, 'day').toDate();
      this.projectForm.patchValue({
        endDate:moment(this.today).add(15, 'day').toDate()
      })
      // this.FindAutoProjectPrefixByOrgID();

    }else if (this.projectForm.get('no_of_days').value == '30' ) {
      // let fromDate=moment(this.today).add(14, 'day').toDate();
      this.projectForm.patchValue({
        endDate:moment(this.today).add(30, 'day').toDate()
      })
      // this.FindAutoProjectPrefixByOrgID();

    }else {
      // let fromDate=moment(this.today).add(14, 'day').toDate();
      this.projectForm.patchValue({
        endDate:moment(this.today).add(45, 'day').toDate()
      })
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
          this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;

        } else {
          let splittable;
          if (data.project_prefix) {
            let project_prefix = data.project_prefix;

            splittable = project_prefix.split('/');
          }
          // var splittable =  project_prefix.split('/');
          if (parseInt(splittable[4]).toString().length == 1) {
            let jobNo = '00' + (parseInt(splittable[4]) + 1)
            this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;

          } else if (parseInt(splittable[4]).toString().length == 2) {
            let jobNo = '0' + (parseInt(splittable[4]) + 1)
            this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;

          }
          else {
            let jobNo = (parseInt(splittable[4]) + 1)
            this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;

          }



        }
        //this.prefixString='JOB/'+formattedPrefix+'/'+this.jobNo;

        // this.router.navigate(["/organizations"]);

      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result) => {

            //  this.router.navigate(['/dashboard']);
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
          //used Arrow function here
          (result) => {

            //  this.router.navigate(['/dashboard']);
          })


      }

    )




  }
  public AddProjType() {
    // $('#customer_modal').show();
    $("#proj_type_modal").modal('show');
    this.primaryCheck=false;

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
            this.projTypeSubmit=false;

            // this.addformSubmitted=false;
            $('#proj_type_modal').modal('hide');
            this.projTypeForm.reset();
            this.spinner.hide();
            this.GetProjectTypeByOrgID();
            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }
          // this.router.navigate(["/organizations"]);

        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(
            //used Arrow function here
            (result) => {

              //  this.router.navigate(['/dashboard']);
            })


        }

      )

    }
  }
  public AddCst() {
    // $('#customer_modal').show();
    $("#customer_modal").modal('show');
    this.getCountryList();
    this.GetIndustryByOrgID();

  }
  public onAddLeadCompany() {
    this.leadAddSubmit=true;
        let postData = {

          company_name: this.companyForm.get('comp_Name').value,
          comapany_desc: this.companyForm.get('desc').value,



        }



        if (this.companyForm.status=='VALID') {
          this.spinner.show();

          return this.leadService.AddLeadCompany(postData).subscribe(
            (data: any) => {
              // let dataObj = JSON.parse(data['token']);

              if (data.status == 200) {
                this.leadAddSubmit=false;

                // this.addformSubmitted=false;
                $('#company_modal').modal('hide');
                this.companyForm.reset();
    this.GetCompanyByOrgID();
                this.spinner.hide();

                this.toastr.success(data['desc'], undefined, {
                  positionClass: 'toast-top-center'
                });

              }
              // this.router.navigate(["/organizations"]);

            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                //used Arrow function here
                (result) => {

                  //  this.router.navigate(['/dashboard']);
                })


            }

          )

        }
      }
  public onAddDesignType() {
   this.designTypeSubmit=true;
    let postData = {

      design_name: this.designTypeForm.get('design_Name').value,


    }



    if (this.designTypeForm.get('design_Name').value != '') {
      this.spinner.show();

      return this.costService.AddTypeOfDesign(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {
            this.designTypeSubmit=false;
            this.designTypeForm.reset();
            // this.addformSubmitted=false;
this.fetchDesignType();
            this.spinner.hide();
            $('#design_type_modal').modal('hide');

            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }
          // this.router.navigate(["/organizations"]);

        },
        error => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(
            //used Arrow function here
            (result) => {

              //  this.router.navigate(['/dashboard']);
            })


        }

      )

    }


  }
  public onAddDealType() {
    this.designTypeSubmit=true;
     let postData = {

       deal_type_name: this.designTypeForm.get('design_Name').value,
       deal_type_desc:this.designTypeForm.get('desc').value


     }



     if (this.designTypeForm.get('design_Name').value != '') {
       this.spinner.show();

       return this.leadService.AddLeadDealType(postData).subscribe(
         (data: any) => {
           // let dataObj = JSON.parse(data['token']);

           if (data.status == 200) {
             this.designTypeSubmit=false;
             this.designTypeForm.reset();
             // this.addformSubmitted=false;
 this.GetAllLeadDealTypeByOrgID();
             this.spinner.hide();
             $('#design_type_modal').modal('hide');

             this.toastr.success(data['desc'], undefined, {
               positionClass: 'toast-top-center'
             });

           }
           // this.router.navigate(["/organizations"]);

         },
         error => {
           this.spinner.hide();

           Swal.fire(
             'Error!',
             'Error.',
             'error'
           ).then(
             //used Arrow function here
             (result) => {

               //  this.router.navigate(['/dashboard']);
             })


         }

       )

     }


   }
   public AddForm(){
   $.getScript('assets/js/pages/custom/user/edit-user.js')
    this.showExtensionDiv = true;
    //this.EmpList();
    this.getCountryList();
    this.fetchDesignType();
    // this.GetProjectTypeByOrgID();
    this.GetLastAddedLeadPrefixByOrgID();
    this.GetPrefixByOrgID();
    // this.GetCompanyByOrgID();
    // this.GetRatingByOrgID();
    // this.GetSourceByOrgID();
    // this.GetStatusByOrgID();
    this.GetIndustryByOrgID();
    // this.FindAutoProjectPrefixByOrgID();
    // this.GetAllLeadStageByOrgID();
    this.GetAllLeadDealTypeByOrgID();
    // this.GetAllLeadContactRoleByOrgID();

    this.AddNewSubmit=true;
    this.showDeptList=false;
    this.showAddForm=true;
    this.editable=false;
    this.dealTabDisabled=true;
    this.customerVal='';
    this.activeTab='kt_user_edit_tab_1'
    brList=[];
    this.branchDataSource=[];
    sessionStorage.clear();
    this.deptForm.setValue({

      dep_name:'',
      alias:''


    })
    //this.ownerValue='';
    this.showOrgDetails=false;
    this.countryValue='';
    this.companyValue='';
   // this.statusValue='';
    this.ratingValue='';
    //this.leadSourceValue='';
    this.pkgTypeVal='';
    this.desgnTypeVal='';
    this.projTypeVal='';
    this.industryValue='';
    this.reasonValue='';
    this.reasonValueTxt='';
this.stageVal='';
this.roleVal='';
for(var i=0;i<this.leadSourceData.length;i++){
  if(this.leadSourceData[i]['lead_source']=='Instagram'){
    console.log('this.leadSourceData[i]',this.leadSourceData[i])
    this.leadSourceValue=this.leadSourceData[i]['lead_source'];
            }
}
let user={};
if (localStorage.getItem('user_info')) {
  user = JSON.parse(localStorage.getItem('user_info'));

}
for (var i = 0; i < this.leadOwnerData.length; i++) {

  if( this.leadOwnerData[i].full_name==user['full_name']  ){
    this.ownerValue=this.leadOwnerData[i].id;
  }

          }

          for (var i = 0; i < this.leadStatusData.length; i++) {

            if(this.leadStatusData[i].lead_status=="Active"  ){
              this.statusValue=this.leadStatusData[i].id;
            }

                    }

    this.emailForm = this.formBuilder.group({
      emails: this.formBuilder.array([this.createEmailFormGroup()])
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
  this.projectForm.patchValue({
    prefixVal: 'is_auto',
  })
this.customerForm.reset();


}
public addEmailFormGroup() {
  const emails = this.emailForm.get('emails') as FormArray



  this.submitClicked=true;
  if(this.emailForm.get('emails').status=='VALID'){
    emails.push(this.createEmailFormGroup())
  this.submitClicked=false;


  }
}
public delete(){
  this.url = null;
}
public onSelectFile(event:any) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]); // read file as data url

    reader.onload = (event:any) => { // called once readAsDataURL is completed

      this.url = event.target.result;
    }
  }
}
public setPrimary(index){

  for(var i=0;i<this.branchDataSource.length;i++){
    if(i==index){
      this.branchDataSource[i]['is_primary']=true

    }else{
      // emails.at(i).patchValue({primaryAccValue:'no' })
      this.branchDataSource[i]['is_primary']=false

    }

  }







}
public removeOrClearEmail(i: number) {
  const emails = this.emailForm.get('emails') as FormArray
  if (emails.length > 1) {
    emails.removeAt(i)
  } else {
    emails.reset()
  }
}

public goBack(){
  window.history.go(-1);
}
public DeptView(){
  this.showDeptList=true;
  this.showAddForm=false;
  this.GetAllCustomer();
  this.customerForm.reset();
  this.projectForm.reset();
  this.editable=false;
  sessionStorage.clear();

  //this.addformSubmitted=false;
//  this.router.navigate(["/departments"]);
}
public changedLead(e: any): void {
  this.selectedTask= e.value;

  this.departmentLeadValue=e.value;


}
public clearSearchField() {
  this.searchField = '';
  this.FetchGridDataByDepartmentOrgID();
}
public validators = [ this.must_be_email ];
public errorMessages = {
    'must_be_email': 'Please enter a valid contact number'
};
private must_be_email(control: FormControl) {
    var EMAIL_REGEXP = /^\+\d{1,3}-\d{9,10}$/;
    if (control.value.length != "" && !EMAIL_REGEXP.test(control.value)) {
        return { "must_be_email": true };
    }
    return null;
}
public deptEdit(dept_id){
  $.getScript('assets/js/pages/custom/user/edit-user.js')

  this.leadService.GetExtensionsLeadId({id: dept_id}).subscribe((data:any) => {
    if(data.length !== 0){
      this.showExtensionDiv = true;
      this.showProjectSearchBtn = true;
      this.extensionsLeadId = data[0].lead_id;

      this.projectService.FindByProjectID({id: data[0].project_id}).subscribe((projectData: any) => {
        this.selectedOriginalProject = {
          project_id: data[0].project_id,
          project_name: data[0].projectName,
          project_prefix: projectData.project_prefix,
          cst_name: projectData.cst_name,
          phone: projectData.phone
        }
      });
    }else{
      this.showExtensionDiv = false;
      this.showProjectSearchBtn = false;
      this.selectedOriginalProject = '';
      this.extensionsLeadId = '';
    }
  });

  this.EmpList();
  this.getCountryList();
    this.fetchDesignType();
    this.GetProjectTypeByOrgID();
    // this.GetCompanyByOrgID();
    // this.GetRatingByOrgID();

    this.GetIndustryByOrgID();
    this.FindAutoProjectPrefixByOrgID();
    this.GetAllCustomer();
    // this.GetAllLeadStageByOrgID();
    // this.GetAllLeadContactRoleByOrgID();
    this.GetAllLeadDealTypeByOrgID();
    this.getLeadHistory(dept_id);




   this.addformSubmitted=false;
this.editformSubmitted=true;
this.showDeptList=false;
         this.showAddForm=true;
  this.editable=true;
  this.AddNewSubmit=false;
  this.activeTab = 'kt_user_edit_tab_1';

this.editDeptId=dept_id;

sessionStorage.setItem('leadId',this.editDeptId);
this.FetchEntityNotesEntityID();
this.GetAllOpenActivitiesEntityID();
this.GetAllCloseActivitiesEntityID();

  let postData={
    id:dept_id
  }
  this.leadService.FindByLeadId(postData).subscribe(
    (data:any)  => {

this.callCstId=data.cst_id

      this.customerForm.patchValue({

     first_Name:data.first_name!=null?data.first_name:'',
     last_Name:data.last_name!=null?data.last_name:'',
     revenue:data.annual_revenue,
     email: data.email,
     website: data.website,
     emp_no: data.no_of_employee,
     contact_no:data.phone,
     city:data.city,
      street_1: data.adr_1,
      street_2: data.adr_2,
      remarks:data.others_remarks

      })
      this.selectedISO=data.phone_iso_name;

       setTimeout(()=>{
        this.leadSourceValue=data.lead_source_id;
       this.ownerValue=data.lead_owner_emp_id;
       this.ratingValue=data.rating_id;
       this.statusValue=data.lead_status_id;
       this.industryValue=data.industry_id;
       this.countryValue=data.country_id;
       this.reasonValue=data.reason_id;
       this.customerVal=data.cst_id;
       if(data.reason_id=='3'){
         this.showReasonRemarks=true
       }else{
        this.showReasonRemarks=true

       }
       if(data.lead_company_name!=null){
       // this.companyValue=data.lead_company_id;
        this.customerForm.patchValue({

          company_Name:[{'display':data.lead_company_name,'value':data.lead_company_name}],

           })

      }
      if (this.ownerValue != '' && this.leadSourceValue!='' && this.statusValue!=''&& this.customerVal!=''  &&(!this.showOrgDetails?(this.customerForm.get('first_Name').status=='VALID' &&this.customerForm.get('last_Name').status=='VALID' && this.customerForm.get('contact_no').status=='VALID'):true || this.showOrgDetails?this.customerForm.get('company_Name').value!='':true)   ) {

        this.dealTabDisabled = false;
        }else{
        this.dealTabDisabled = true;

        }
      },800)
      if(data.is_company==true){
        this.showCompanyDet=true
      }else{
       this.showCompanyDet=false

      }
       if(data.lead_company_name!=null){
         this.showOrgDetails=true

 $('#toggleDeptCheck').prop('checked', true);

        //  this.companyValue=data.lead_company_id;
       }else{
        this.showOrgDetails=false
 $('#toggleDeptCheck').prop('checked', false);


       }
       let entityContact=[]
       if(data.entityContact!=null || data.entityContact.length!=0){
         this.showBranchList=true;
         brList=data.entityContact;
         this.branchDataSource=data.entityContact;

// for(var i=0<i<data.entityContact.length;i++;){

//   entityContact.push({

//     "first_name":data.entityContact[i].first_name,
//     "last_name": data.entityContact[i].last_name,
//     "phone_no":data.entityContact[i].phone ,
//     "email": data.entityContact[i].email,
//     "is_primary": data.entityContact[i].is_primary
//   })


// }
// this.branchDataSource=entityContact;
       }

       this.customerContactForm.valueChanges.subscribe(
        (selectedValue) => {
          if(this.customerContactForm.get('fname').status=="VALID" && this.customerContactForm.get('lname').status=="VALID" ){
            this.disableSaveBranch=false;
          } else{
           this.disableSaveBranch=true;

          }
        }
    );
    if(data.leadDeal){
      setTimeout(()=>{
        this.projId=data.leadDeal.id,
        this.desgnTypeVal=data.leadDeal.deal_type_id;
        this.roleVal=data.leadDeal.contact_role_id;
        this.stageVal=data.leadDeal.stage_id;

        // this.projTypeVal=data.leadDeal.project_type_id;
        // this.pkgTypeVal=data.leadDeal.packages_id;
      },800)

      this.project_prefix_val=data.leadDeal.deal_prefix;
      this.projectForm.patchValue({

        project_name: data.leadDeal.deal_name,
        project_amount: data.leadDeal.est_amount,
        endDate:moment(data.leadDeal.est_closing_date).format('L'),

      })
}

    },

    error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        //used Arrow function here
        (result)=> {

          //  this.router.navigate(['/dashboard']);
        })


    }

    )

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


applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
public deptDelete(deptId){
let postData={
  id:deptId
}
this.spinner.show();

this.leadService.RemoveLead(postData).subscribe(
  (data:any)  => {

    if(data.status==200){
    this.GetAllCustomer();
    this.spinner.hide();

                this.toastr.error(data['desc'], undefined,{
                  positionClass: 'toast-top-center'
             });
              }else{
                this.spinner.hide();

                           Swal.fire(
                             'Error!',
                             data['result'].desc,
                             'error'
                           ).then(
                             //used Arrow function here
                             (result)=> {

                               //  this.router.navigate(['/dashboard']);
                             })
                         }
    //  let dataObj = JSON.parse(data['token']);


  // this.router.navigate(["/organizations"]);

  },
  error  => {
    Swal.fire(
      'Error!',
      error,
      'error'
    ).then(
      //used Arrow function here
      (result)=> {

        //  this.router.navigate(['/dashboard']);
      })


  }

  )
}
public  DeptList(){

  this.deptService.getAllDept().subscribe(
    (data:any)  => {

      var results=[{ id: '  ', text: 'Select' }]
      // let dataObj = JSON.parse(data['token']);
    //

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
    "id": data[i].id,
    "text": data[i].dep_name
});

}


this.departmentData =results;


    },
    error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        //used Arrow function here
        (result)=> {

          //  this.router.navigate(['/dashboard']);
        })


    }

    )
    }
public  FetchGridDataByDepartmentOrgID() {
  this.deptService.fetchGridDataByDepartmentOrgID().subscribe(
    (data:any)  => {


      //  let dataObj = JSON.parse(data['token']);

    let datas = new DataManager(data);

    this.data12=datas.dataSource['json']
    this.initialSort = {
      columns: [{ field: 'dep_name', direction: 'Ascending' },
      { field: 'alias', direction: 'Descending' }]
  };
  this.pageSettings = {pageSizes: true, pageCount: 5 }
  this.toolbar = ['Search'];
//  this.searchOptions = { fields: ['dep_name'], operator: 'contains', key: 'Ha', ignoreCase: true };
     this.dataSource =  new MatTableDataSource(data);
    //  this.compData = data;
    //  this.gridComp.dataSource = data;
    //  this.gridComp.allowPaging = false;
    //  this.gridComp.pageSettings = { pageSize: this.compData.length };
    //  this.gridComp.columns = this.displayedColumns;
     // this.dataSource.paginator = this.paginator;
    //  this.dataSource.sort = this.sort;

    // this.router.navigate(["/organizations"]);

    },
    error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        //used Arrow function here
        (result)=> {

          //  this.router.navigate(['/dashboard']);
        })


    }

    )
    }

    onChange(event){

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
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )
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

  public onLostLeadChange(e){
    if(e.srcElement.checked){
      this.lostLead=false;
      this.GetAllCustomer();
    }else{
      this.lostLead=true;

      this.GetAllCustomer();

    }
    // this.addCurrentUser=!this.addCurrentUser;

  }
    public  GetAllCustomer() {
      this.spinner.show();
      this.leadService.GetAllLeadByOrgID().subscribe(
        (data:any)  => {


          //  let dataObj = JSON.parse(data['token']);

        let leadStatus=[];
        if(this.lostLead){

        for(var i=0;i<data.length;i++){
          if(data[i].lead_status!='Lost Lead'){
            leadStatus.push(data[i])
          }
        }
      }
        else{
          leadStatus=data;

        }
        let datas = new DataManager(leadStatus);
        this.data12=datas.dataSource['json']
      this.spinner.hide();

      //   this.initialSort = {
      //     columns: [{ field: 'dep_name', direction: 'Ascending' },
      //     { field: 'alias', direction: 'Descending' }]
      // };
      this.pageSettings = {pageSizes: true, pageCount: 5 }
      this.toolbar = ['Search','ExcelExport', 'PdfExport'];
    //  this.searchOptions = { fields: ['dep_name'], operator: 'contains', key: 'Ha', ignoreCase: true };
         this.dataSource =  new MatTableDataSource(data);
        //  this.compData = data;
        //  this.gridComp.dataSource = data;
        //  this.gridComp.allowPaging = false;
        //  this.gridComp.pageSettings = { pageSize: this.compData.length };
        //  this.gridComp.columns = this.displayedColumns;
         // this.dataSource.paginator = this.paginator;
        //  this.dataSource.sort = this.sort;

        this.pgData=data;

          let ds= data.slice(0, this.pageSize);
          let ds1 = new DataManager(ds);
          let first_name=[];
          let last_name=[];
          let company=[];

          for(var i=0;i<data.length;i++){
           if(data[i].first_name!=null && data[i].last_name!=null ){
            first_name.push({display: data[i].first_name,value:data[i].id+':id', email:data[i].email})
            last_name.push({display: data[i].last_name,value:data[i].id+':id',email:data[i].email})
           }
           if(data[i].lead_company_name!=null){
            company.push({display: data[i].lead_company_name,value:data[i].id+':id',email:data[i].email})
           }
          }
          const firstNameDistinct = [];
const map = new Map();
for (const item of first_name) {
    if(!map.has(item.display)){
        map.set(item.display, true);    // set any value to Map
        firstNameDistinct.push({
          display: item.display,
          value: item.value+':id',
          email:item.email
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

          this.firstName=firstNameDistinct;
          this.lastName=lastNameDistinct;
          this.companyName=companyNameDistinct;
  //this.data12=ds1.dataSource['json'];
        // this.router.navigate(["/organizations"]);

        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )
        }
        public  GetAllLeadStageByOrgID(){
          this.leadService.GetAllLeadStageByOrgID().subscribe(

            (data:any) => {

              var results = [{id:'',text:'Select'}
              ]

              for (var i = 0; i < data.length; i++) {

                results.push({
                  "id": data[i].id,
                  "text": data[i].stage_name
                });

              }


              this.stageData = results;


            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }
            public  GetAllLeadDealTypeByOrgID(){
              this.leadService.GetAllLeadDealTypeByOrgID().subscribe(

                (data:any) => {

                  var results = [{
                    "id": '',
                    "text": 'Select'
                  }
                  ]

                  for (var i = 0; i < data.length; i++) {

                    results.push({
                      "id": data[i].id,
                      "text": data[i].deal_type_name
                    });

                  }


                  this.dealTypeData = results;


                },
                error  => {
                  Swal.fire(
                    'Error!',
                    error,
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                      //  this.router.navigate(['/dashboard']);
                    })


                }

                )
                }
                public  GetAllLeadContactRoleByOrgID(){
                  this.leadService.GetAllLeadContractRoleByOrgID().subscribe(

                    (data:any) => {

                      var results = [{'id':'','text':'Select'}
                      ]

                      for (var i = 0; i < data.length; i++) {

                        results.push({
                          "id": data[i].id,
                          "text": data[i].contact_role_name
                        });

                      }


                      this.roleData = results;


                    },
                    error  => {
                      Swal.fire(
                        'Error!',
                        error,
                        'error'
                      ).then(
                        //used Arrow function here
                        (result)=> {

                          //  this.router.navigate(['/dashboard']);
                        })


                    }

                    )
                    }
        selectedTag(e){

        }
        scroll(el: HTMLElement) {
          // el.scrollIntoView();
          el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      }
        onAdded($event: any) {

          if($event.value.includes(':')){
            var newString = $event.value.split(":");

            let postData={
              id:newString[0]
            }
            this.leadService.FindByLeadId(postData).subscribe(
              (data:any)  => {


                this.customerForm.patchValue({

               first_Name:[{'display':data.first_name,'value':data.first_name}],
               last_Name:[{'display':data.last_name,'value':data.last_name}],
               revenue:data.annual_revenue,
               email: data.email,
               website: data.website,
               emp_no: data.no_of_employee,
               contact_no:data.phone,
               city:data.city,
                street_1: data.adr_1,
                street_2: data.adr_2,

                })

                 setTimeout(()=>{
                  this.leadSourceValue=data.lead_source_id;
                 this.ownerValue=data.lead_owner_emp_id;
                 this.ratingValue=data.rating_id;
                 this.statusValue=data.lead_status_id;
                 this.industryValue=data.industry_id;
                 this.countryValue=data.country_id
                 if(data.lead_company_id!=null){
                  this.companyValue=data.lead_company_id;
                }
                },800)
                 if(data.lead_company_id!=null){
                   this.showOrgDetails=true
           $('#toggleDeptCheck').prop('checked', true);

                  //  this.companyValue=data.lead_company_id;
                 }else{
                  this.showOrgDetails=false
           $('#toggleDeptCheck').prop('checked', false);


                 }
                 let entityContact=[]
                 if(data.entityContact!=null || data.entityContact.length!=0){
                   this.showBranchList=true;
                   brList=data.entityContact;
                   this.branchDataSource=data.entityContact;

          // for(var i=0<i<data.entityContact.length;i++;){

          //   entityContact.push({

          //     "first_name":data.entityContact[i].first_name,
          //     "last_name": data.entityContact[i].last_name,
          //     "phone_no":data.entityContact[i].phone ,
          //     "email": data.entityContact[i].email,
          //     "is_primary": data.entityContact[i].is_primary
          //   })


          // }
          // this.branchDataSource=entityContact;
                 }

                 this.customerContactForm.valueChanges.subscribe(
                  (selectedValue) => {
                   if(this.customerContactForm.status=="VALID"){
                     this.disableSaveBranch=false;
                   } else{
                    this.disableSaveBranch=true;

                   }
                  }
              );
          //     if(data.leadProject){
          //       setTimeout(()=>{
          //         this.projId=data.leadProject.id,
          //         this.desgnTypeVal=data.leadProject.design_type_id;
          //         this.projTypeVal=data.leadProject.project_type_id;
          //         this.pkgTypeVal=data.leadProject.packages_id;
          //       },800)

          //       this.project_prefix_val=data.leadProject.project_prefix;
          //       this.projectForm.patchValue({

          //         project_name: data.leadProject.project_name,
          //         project_amount: data.leadProject.project_amount,

          //       })
          // }

              },  error  => {
                Swal.fire(
                  'Error!',
                  error,
                  'error'
                ).then(
                  //used Arrow function here
                  (result)=> {

                    //  this.router.navigate(['/dashboard']);
                  })


              }

              )

          }else{
            this.customerForm.reset();
            this.customerForm.patchValue({
              first_Name:[{'display':$event.display,'value':$event.value}],

            })

this.customerContactForm.reset();
this.branchDataSource=[];
this.projectForm.reset();
this.ownerValue='';
this.showOrgDetails=false;
this.countryValue='';
this.companyValue='';
this.statusValue='';
this.ratingValue='';
this.leadSourceValue='';
this.pkgTypeVal='';
this.desgnTypeVal='';
this.industryValue='';

this.projTypeVal='';
          }
        }
        onEditName(e){

        }
        onEditCompanyName(e){

        }

        onAddedCompany($event: any) {

          if($event.value.includes(':')){
            var newString = $event.value.split(":");

            let postData={
              id:newString[0]
            }
            this.leadService.FindByLeadId(postData).subscribe(
              (data:any)  => {


                this.customerForm.patchValue({


               revenue:data.annual_revenue,
               email: data.email,
               website: data.website,
               emp_no: data.no_of_employee,
               contact_no:data.phone,
               city:data.city,
                street_1: data.adr_1,
                street_2: data.adr_2,

                })

                 setTimeout(()=>{
                  this.leadSourceValue=data.lead_source_id;
                 this.ownerValue=data.lead_owner_emp_id;
                 this.ratingValue=data.rating_id;
                 this.statusValue=data.lead_status_id;
                 this.industryValue=data.industry_id;
                 this.countryValue=data.country_id
                 if(data.lead_company_id!=null){
                  this.companyValue=data.lead_company_id;
                }
                },800)
                 if(data.lead_company_name!=null){
                   this.showOrgDetails=true
          //  $('#toggleDeptCheck').prop('checked', true);
           this.customerForm.patchValue({
            company_Name:[{'display':data.lead_company_name,'value':data.lead_company_name}],

          })
                  //  this.companyValue=data.lead_company_id;
                 }else{
                  this.showOrgDetails=false
          //  $('#toggleDeptCheck').prop('checked', false);


                 }
                 let entityContact=[]
                 if(data.entityContact!=null || data.entityContact.length!=0){
                   this.showBranchList=true;
                   brList=data.entityContact;
                   this.branchDataSource=data.entityContact;

          // for(var i=0<i<data.entityContact.length;i++;){

          //   entityContact.push({

          //     "first_name":data.entityContact[i].first_name,
          //     "last_name": data.entityContact[i].last_name,
          //     "phone_no":data.entityContact[i].phone ,
          //     "email": data.entityContact[i].email,
          //     "is_primary": data.entityContact[i].is_primary
          //   })


          // }
          // this.branchDataSource=entityContact;
                 }

                 this.customerContactForm.valueChanges.subscribe(
                  (selectedValue) => {
                   if(this.customerContactForm.status=="VALID"){
                     this.disableSaveBranch=false;
                   } else{
                    this.disableSaveBranch=true;

                   }
                  }
              );
          //     if(data.leadProject){
          //       setTimeout(()=>{
          //         this.projId=data.leadProject.id,
          //         this.desgnTypeVal=data.leadProject.design_type_id;
          //         this.projTypeVal=data.leadProject.project_type_id;
          //         this.pkgTypeVal=data.leadProject.packages_id;
          //       },800)

          //       this.project_prefix_val=data.leadProject.project_prefix;
          //       this.projectForm.patchValue({

          //         project_name: data.leadProject.project_name,
          //         project_amount: data.leadProject.project_amount,

          //       })
          // }

              },  error  => {
                Swal.fire(
                  'Error!',
                  error,
                  'error'
                ).then(
                  //used Arrow function here
                  (result)=> {

                    //  this.router.navigate(['/dashboard']);
                  })


              }

              )

          }else{
            this.customerForm.reset();
            this.customerForm.patchValue({
              company_Name:[{'display':$event.display,'value':$event.value}],

            })
this.customerContactForm.reset();
this.branchDataSource=[];
this.projectForm.reset();
this.ownerValue='';
this.showOrgDetails=true;
this.countryValue='';
this.companyValue='';
this.statusValue='';
this.ratingValue='';
this.leadSourceValue='';
this.pkgTypeVal='';
this.desgnTypeVal='';
this.projTypeVal='';
this.industryValue='';

          }
        }
        changed(e) {
          this.pageSize = e.pageSize;
          let start = (this.currentPage - 1) * e.pageSize;
          this.dataSource = this.pgData.slice(start, start + e.pageSize);
        }
          click(args) {
          if (args.currentPage) {
            let start = (args.currentPage - 1) * this.pageSize;
            this.dataSource = this.pgData.slice(start, start + this.pageSize);
          }
        }
    isFieldValid(field: string) {
      if(this.addformSubmitted){
        return (

          this.customerForm.get(field).errors && this.customerForm.get(field).touched ||
          this.customerForm.get(field).untouched &&
          this.addformSubmitted
        );
      }
      else if(this.editformSubmitted){
        return (

          this.customerForm.get(field).errors &&
          this.editformSubmitted
        );
      }
      else{
        return false;
      }

    }
    nxt(){


    }
public onAddSubmit(e){
  this.addformSubmitted = true;
  let user_info:object;
  if(localStorage.getItem('user_info')){
      user_info= JSON.parse(localStorage.getItem('user_info'));


  }
  e.preventDefault()
  // let loginUrl=this.utilService.getHostURL()+'Account/login';
  let code=''
  // if(this.customerForm.get('customer_phone').value){
  //   let phoneNo=this.customerForm.get('customer_phone').value;
  //   code=phoneNo.dialCode.concat(phoneNo.number);
  // }
  let entityContact=[];
  for(var i=0;i< this.branchDataSource.length;i++){
    entityContact.push({
      "id": this.branchDataSource[i].id,
      "entity_id": this.branchDataSource[i].entity_id,
      "name":this.branchDataSource[i].first_name+ ' ' + this.branchDataSource[i].last_name,
      "first_name": this.branchDataSource[i].first_name,
      "last_name": this.branchDataSource[i].last_name,
      "position": null,
      "phone": this.branchDataSource[i].phone,
      "phone_iso_name": this.branchDataSource[i].phone_iso_name,
      "department": this.branchDataSource[i].department,
      "relationship": this.branchDataSource[i].relationship,
      "designation": this.branchDataSource[i].designation,
      "note": this.branchDataSource[i].note,
      "mobile": null,
      "email": this.branchDataSource[i].email,
      "adr_1": null,
      "adr_2": null,
      "city": null,
      "country": null,
      "is_primary": this.branchDataSource[i].is_primary,
      "createdby": user_info['full_name'],

    })
  }
// let postData={


//   "id": null,
//   "cst_name": this.customerForm.get('customer_Name').value,
//   "cst_type": this.customerForm.get('customer_type').value,
//   "email": this.customerForm.get('customer_email').value,
//   "phone": this.customerForm.get('customer_phone').value,
//   "adr": this.customerForm.get('street_1').value,
//   "street": this.customerForm.get('street_2').value,
//   "country": this.countryValue!=''?this.countryValue:null,
//   "city": this.customerForm.get('city').value,
//   "EntityContact": {
//     "id": null,
//     // "entity_id": "string",
//     "entity_id": null,

//     "name": this.customerForm.get('name').value,
//     "position": this.customerForm.get('position').value,
//     //"phone": this.customerForm.get('phone').value,
//     "mobile": this.customerForm.get('mobile').value,
//     "email": this.customerForm.get('email').value,
//      phone: this.phoneNumberValue,


//   }
// }
let pstData={

  "cst_id":this.customerVal,
  "is_company":this.showCompanyDet,
  // "lead_company_name":null,
  "lead_company_name":!this.showCompanyDet?(this.customerForm.get('first_Name').value+' '+this.customerForm.get('last_Name').value): this.customerForm.get('org_Name').value,

  "lead_owner_emp_id": this.ownerValue,
  "first_name": null,
  // "first_name": !this.showCompanyDet?this.customerForm.get('first_Name').value[0]['display']:null,
  "last_name": null,
  "lead_source_id": this.leadSourceValue,
  "lead_status_id": this.statusValue,
  "reason_id":this.statusValueTxt=="Lost Lead"?this.reasonValue:null,
  "others_remarks":this.reasonValueTxt=="Other"?this.customerForm.get('remarks').value:null,
  "annual_revenue":  null,
  "rating_id": this.ratingValue,
  "industry_id": this.industryValue,
  "no_of_employee":  null,
  "email": this.customerForm.get('email').value,
  // "phone":this.customerForm.get('contact_no').value,
   "phone":(this.customerForm.get('contact_no').value!=null && this.customerForm.get('contact_no').value!='')? this.customerForm.get('contact_no').value.internationalNumber.replace(/ /g, ""):null,
  "phone_iso_name":(this.customerForm.get('contact_no').value!=null && this.customerForm.get('contact_no').value!='')?this.customerForm.get('contact_no').value.countryCode:null,
  "website": this.customerForm.get('website').value,
  "adr_1": this.customerForm.get('street_1').value,
  "adr_2": this.customerForm.get('street_2').value,
  "city": this.customerForm.get('city').value,
  "country_id":this.countryValue,

  "entityContact": entityContact.length!=0?entityContact:null,
  "leadDeal": this.projectForm.get('project_name').value!=''?({
    "id": null,
    "lead_id": null,
    // "deal_prefix":this.projectForm.get('prefixVal').value=='is_auto'?this.prefixString:this.projectForm.get('prefix_name').value,
    "deal_prefix":!this.showPrefixText?this.prefixString:this.projectForm.get('prefix_name').value,
    "deal_name": this.projectForm.get('project_name').value,
    "est_amount":this.projectForm.get('project_amount').value,
    "deal_type_id": this.desgnTypeVal,
    "contact_role_id": null,
    "stage_id": null,
    "est_closing_date": moment(this.enddateValue).format('L'),
    "createdby": user_info['full_name'],
  }):null
}

      //
      console.log('pstData',pstData);

      // let postValues= this.getDirtyValues(this.customerForm);

     if (this.ownerValue != '' && this.leadSourceValue!='' && this.statusValue!='' && this.customerVal!=''&&(!this.showOrgDetails?this.customerForm.status=='VALID':true || this.showOrgDetails?this.customerForm.get('company_Name').value!='':true) && this.projectForm.status=='VALID' ) {
       // if (this.ownerValue != '' && this.leadSourceValue!='' && this.statusValue!='' &&(this.customerForm.status=='VALID') && this.projectForm.status=='VALID' ) {
      // if (true ) {
        console.log('leadFormVal',this.customerForm.status);

       this.spinner.show();
          return this.leadService.AddLead(pstData).subscribe(
            (data:any)  => {


            if(data.status==200){
              if(this.showProjectSearchBtn){
                let userInfo:any = JSON.parse(localStorage.getItem('user_info'));
                let extData = {
                  "lead_id": data.code,
                  "project_id": this.selectedOriginalProject.project_id,
                  "createdDate": moment().format('L'),
                  "createdByEmpId": userInfo.id,
                  "createdBy": userInfo.full_name,
                }

                this.leadService.AddExtensionsLead(extData).subscribe((ext:any) => {
                  if(ext.status === "200"){
                    this.toastr.success('Lead added as extension to the selected Project');
                  }else{
                    this.toastr.error('Something went wrong');
                  }
                  this.showProjectSearchBtn = false;
                  this.selectedOriginalProject = '';
                });
              }

              this.DeptView();
              this.addformSubmitted = false;
              this.spinner.hide();
              this.customerForm.reset();
              this.customerContactForm.reset();
              this.branchDataSource=[];
              this.projectForm.reset();
              this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
              });

              if(data.code){
                let postData = {
                  entity_id: data.code,
                  event_type: "Lead added",
                  event_desc: "a new lead is added",
                };
                this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                  console.log(data)
                });
              }
            }else{
   this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result)=> {

                })
            }

            },
            error  => {
   this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result)=> {

                })


            }

            )



      }
  }


  public GetAllTaskByEmpID(){

  }
  public onEditSubmit(e){
    e.preventDefault();
    this.editformSubmitted=true;
    let user_info:object;
    if(localStorage.getItem('user_info')){
        user_info= JSON.parse(localStorage.getItem('user_info'));


    }
    let entityContact=[];
    for(var i=0;i< this.branchDataSource.length;i++){
      entityContact.push({
        "id": this.branchDataSource[i].id,
        "entity_id": this.branchDataSource[i].entity_id,
        "name":this.branchDataSource[i].first_name+ ' ' + this.branchDataSource[i].last_name,
        "first_name": this.branchDataSource[i].first_name,
        "last_name": this.branchDataSource[i].last_name,
        "position": null,
        "department": this.branchDataSource[i].department,
        "designation": this.branchDataSource[i].designation,
        "note": this.branchDataSource[i].note,
        "phone": this.branchDataSource[i].phone,
        "phone_iso_name": this.branchDataSource[i].phone_iso_name,
        "mobile": null,
        "email": this.branchDataSource[i].email,
        "adr_1": null,
        "adr_2": null,
        "city": null,
        "country": null,
        "is_primary": this.branchDataSource[i].is_primary,
        "modifiedby": user_info['full_name'],

      })
    }
    let postData={
      "id":this.editDeptId,
      "lead_company_id":null,
      "lead_company_name":!this.showCompanyDet?(this.customerForm.get('first_Name').value+' '+this.customerForm.get('last_Name').value): this.customerForm.get('org_Name').value,
      "cst_id":this.customerVal,
      "is_company":this.showCompanyDet,
      "first_name": null,
      // "first_name": !this.showCompanyDet?this.customerForm.get('first_Name').value[0]['display']:null,
      "last_name": null,
      "lead_owner_emp_id": this.ownerValue,

      "lead_source_id": this.leadSourceValue,
      "lead_status_id": this.statusValue,
      "annual_revenue": this.showOrgDetails?this.customerForm.get('revenue').value:null,
      "rating_id": this.ratingValue,
      "industry_id": this.industryValue,
      "no_of_employee": this.showOrgDetails?this.customerForm.get('emp_no').value:null,
      "email": this.customerForm.get('email').value,
      "phone":(this.customerForm.get('contact_no').value!=null && this.customerForm.get('contact_no').value!='')? this.customerForm.get('contact_no').value.internationalNumber.replace(/ /g, ""):null,
      "phone_iso_name":(this.customerForm.get('contact_no').value!=null && this.customerForm.get('contact_no').value!='')?this.customerForm.get('contact_no').value.countryCode:null,
      "website": this.customerForm.get('website').value,

      "adr_1": this.customerForm.get('street_1').value,
      "adr_2": this.customerForm.get('street_2').value,
      "city": this.customerForm.get('city').value,
      "country_id":this.countryValue,
      "entityContact": entityContact.length!=0?entityContact:null,
      "leadProject": {
        "id":this.projId,
        "lead_id": this.editDeptId,
        "project_prefix":this.project_prefix_val,
        "project_name": this.projectForm.get('project_name').value,
    "project_amount":this.projectForm.get('project_amount').value,

        "design_type_id": this.desgnTypeVal,
        "project_type_id": this.projTypeVal,
        "packages_id": this.pkgTypeVal,
        "modifiedby": user_info['full_name'],
      },
      "leadDeal": this.projectForm.get('project_name').value!=''?({
        "id": this.projId,
        "lead_id": this.editDeptId,
        "deal_prefix":this.project_prefix_val,
        "deal_name": this.projectForm.get('project_name').value,
        "est_amount":this.projectForm.get('project_amount').value,
        "deal_type_id": this.desgnTypeVal,
        "contact_role_id": this.roleVal,
        "stage_id": this.stageVal,
        "est_closing_date": moment(this.enddateValue).format('L'),
        "modifiedby": user_info['full_name'],
      }):null
    }

    // let postData={


    //   "id": null,
    //   "cst_name": this.customerForm.get('customer_Name').value,
    //   "cst_type": this.customerForm.get('customer_type').value,
    //   "email": this.customerForm.get('customer_email').value,
    //   "phone": this.customerForm.get('customer_phone').value,
    //   "adr": this.customerForm.get('street_1').value,
    //   "street": this.customerForm.get('street_2').value,
    //   "city": this.customerForm.get('city').value,
    //   "EntityContact": {
    //     "id": null,
    //     "entity_id": null,
    //     "name": this.customerForm.get('name').value,
    //     "position": this.customerForm.get('position').value,
    //     "phone": this.customerForm.get('phone').value,
    //     "mobile": this.customerForm.get('mobile').value,
    //     "email": this.customerForm.get('email').value

    //   }
    // }

      //
      // let postValues= this.getDirtyValues(this.customerForm);
      // postValues['id']=this.editDeptId;
      //

     // if (this.ownerValue != '' && this.leadSourceValue!='' && this.statusValue!='' &&(!this.showOrgDetails?this.customerForm.status=='VALID':true || this.showOrgDetails?this.customerForm.get('company_Name').value!='':true)   ) {
      if (this.ownerValue != '' && this.leadSourceValue!='' && this.statusValue!='' &&(this.customerForm.status=='VALID')   ) {



         this.spinner.show();
            return this.leadService.UpdateLead(postData).subscribe(
              (data:any)  => {

                if(this.selectedOriginalProject !== '' && this.extensionsLeadId !== ''){
                  let extData = {
                    "id": this.extensionsLeadId,
                    "empId": this.selectedOriginalProject.project_id
                  }
                  this.leadService.UpdateProjectByleadId(extData).subscribe((ext:any) => {
                    if(ext.status === "200"){
                      this.toastr.success('Updated');
                    }else{
                      this.toastr.error('Something went wrong');
                    }
                    this.showExtensionDiv = true;
                    this.showProjectSearchBtn = false;
                    this.selectedOriginalProject = '';
                    this.extensionsLeadId = '';
                  });
                }

                if(data.status==200){
                this.editformSubmitted=false;
                this.addformSubmitted=false;
                this.editable=false;
                this.spinner.hide();
                this.toastr.success(data['desc'], undefined,{
                    positionClass: 'toast-top-center'
                });
                if(data.code){
                  let postData = {
                    entity_id: this.editDeptId,
                    event_type: "Lead updated",
                    event_desc: "the lead is updated",
                  };
                  this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                    console.log(data)
                  });
                }
                }else{
                  this.spinner.hide();

                             Swal.fire(
                               'Error!',
                               data['result'].desc,
                               'error'
                             ).then(
                               (result)=> {

                               })
                           }
                this.DeptView();



              },
              error  => {
                Swal.fire(
                  'Error!',
                  'Error.',
                  'error'
                ).then(
                  (result)=> {

                  })


              }

              )



      }
    }

    public onAddNewSubmit(e){
      this.addformSubmitted = true;
      e.preventDefault();
      let user_info:object;
      if(localStorage.getItem('user_info')){
          user_info= JSON.parse(localStorage.getItem('user_info'));


      }
      let entityContact=[];
      for(var i=0;i< this.branchDataSource.length;i++){
        entityContact.push({
          "id": this.branchDataSource[i].id,
          "entity_id": this.branchDataSource[i].entity_id,
          "name":this.branchDataSource[i].first_name+ '' + this.branchDataSource[i].last_name,
          "first_name": this.branchDataSource[i].first_name,
          "last_name": this.branchDataSource[i].last_name,
          "position": null,
          "phone": this.branchDataSource[i].phone_no,
          "department": this.branchDataSource[i].department,
          "designation": this.branchDataSource[i].designation,
          "note": this.branchDataSource[i].note,
          "mobile": null,
          "email": this.branchDataSource[i].email,
          "adr_1": null,
          "adr_2": null,
          "city": null,
          "country": null,
          "is_primary": this.branchDataSource[i].is_primary,
          "createdby": user_info['full_name'],

        })
      }
      // let postData={


      //   "id": null,
      //   "cst_name": this.customerForm.get('customer_Name').value,
      //   "cst_type": this.customerForm.get('customer_type').value,
      //   "email": this.customerForm.get('customer_email').value,
      //   "phone": this.customerForm.get('customer_phone').value,
      //   "adr": this.customerForm.get('street_1').value,
      //   "street": this.customerForm.get('street_2').value,
      //   "city": this.customerForm.get('city').value,
      //   "EntityContact": {
      //     "id": null,
      //     // "entity_id": "string",
      //     "entity_id": null,

      //     "name": this.customerForm.get('name').value,
      //     "position": this.customerForm.get('position').value,
      //     "phone": this.customerForm.get('phone').value,
      //     "mobile": this.customerForm.get('mobile').value,
      //     "email": this.customerForm.get('email').value

      //   }
      // }

      let pstData={

        "cst_id":this.customerVal,
        "is_company":this.showCompanyDet,
        // "lead_company_name":null,
        "lead_company_name":!this.showCompanyDet?(this.customerForm.get('first_Name').value+' '+this.customerForm.get('last_Name').value): this.customerForm.get('org_Name').value,

        //"lead_company_name":!this.showCompanyDet?(this.customerForm.get('first_Name').value+' '+this.customerForm.get('last_Name').value): this.customerForm.get('company_Name').value,
        "lead_owner_emp_id": this.ownerValue,
        "first_name": null,
        // "first_name": !this.showCompanyDet?this.customerForm.get('first_Name').value[0]['display']:null,
        "last_name": null,
        "lead_source_id": this.leadSourceValue,
        "lead_status_id": this.statusValue,
        "reason_id":this.statusValueTxt=="Lost Lead"?this.reasonValue:null,
        "others_remarks":this.reasonValueTxt=="Other"?this.customerForm.get('remarks').value:null,
        "annual_revenue":  null,
        "rating_id": null,
        "industry_id": null,
        "no_of_employee":  null,
        "email": this.customerForm.get('email').value,

        "phone":(this.customerForm.get('contact_no').value!=null && this.customerForm.get('contact_no').value!='')? this.customerForm.get('contact_no').value.internationalNumber.replace(/ /g, ""):null,
        "phone_iso_name":(this.customerForm.get('contact_no').value!=null && this.customerForm.get('contact_no').value!='')?this.customerForm.get('contact_no').value.countryCode:null,
        "website": this.customerForm.get('website').value,

        "adr_1": this.customerForm.get('street_1').value,
        "adr_2": this.customerForm.get('street_2').value,
        "city": this.customerForm.get('city').value,
        "country_id":this.countryValue,

        "entityContact": entityContact.length!=0?entityContact:null,
        "leadDeal": this.projectForm.get('project_name').value!=''?({
          "id": null,
          "lead_id": null,
          "deal_prefix":!this.showPrefixText?this.prefixString:this.projectForm.get('prefix_name').value,
          "deal_name": this.projectForm.get('project_name').value,
          "est_amount":this.projectForm.get('project_amount').value,
          "deal_type_id": this.desgnTypeVal,
          "contact_role_id": null,
          "stage_id": null,
          "est_closing_date": moment(this.enddateValue).format('L'),
          "createdby": user_info['full_name'],
        }):null
      }


            //

            // let postValues= this.getDirtyValues(this.customerForm);


             if (this.ownerValue != '' && this.leadSourceValue!='' && this.statusValue!='' &&(this.customerForm.status=='VALID')   ) {
              // if (true) {
         this.spinner.show();
                return this.leadService.AddLead(pstData).subscribe(
                (data:any)  => {
                  // let dataObj = JSON.parse(data['token']);
                console.log(data)
                if(data.status==200){
                  this.addformSubmitted = false;
                  this.spinner.hide();
                  this.customerForm.reset();
                  this.customerContactForm.reset();
                  this.branchDataSource=[];
                  this.projectForm.reset();
                  this.ownerValue='';
                  this.showOrgDetails=false;
                  this.countryValue='';
                  this.companyValue='';
                  this.statusValue='';
                  this.ratingValue='';
                  this.leadSourceValue='';
                  this.pkgTypeVal='';
                  this.desgnTypeVal='';
                  this.projTypeVal='';
                  this.toastr.success(data['desc'], undefined,{
                    positionClass: 'toast-top-center'
                  });

                  if(this.showProjectSearchBtn){
                    let userInfo:any = JSON.parse(localStorage.getItem('user_info'));
                    let extData = {
                      "lead_id": data.code,
                      "project_id": this.selectedOriginalProject.project_id,
                      "createdDate": moment().format('L'),
                      "createdByEmpId": userInfo.id,
                      "createdBy": userInfo.full_name,
                    }

                    this.leadService.AddExtensionsLead(extData).subscribe((ext:any) => {
                      if(ext.status === "200"){
                        this.toastr.success('Lead added as extension to the selected Project');
                      }else{
                        this.toastr.error('Something went wrong');
                      }
                      this.showProjectSearchBtn = false;
                      this.selectedOriginalProject = '';
                    });
                  }

                  if(data.code){
                    let postData = {
                      entity_id: data.code,
                      event_type: "Lead added",
                      event_desc: "a new lead is added",
                    };
                    this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                      console.log(data)
                    });
                  }

                }else{
                  this.spinner.hide();

                             Swal.fire(
                               'Error!',
                               data['result'].desc,
                               'error'
                             ).then(
                               //used Arrow function here
                               (result)=> {

                                 //  this.router.navigate(['/dashboard']);
                               })
                           }
                this.AddNewSubmit=true;
                // this.router.navigate(["/organizations"]);

                },
                error  => {
                  this.spinner.hide();

                  Swal.fire(
                    'Error!',
                    'Error.',
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                      //  this.router.navigate(['/dashboard']);
                    })


                }

                )



          }
  }
    getDirtyValues(form: any) {
      let dirtyValues = {};

      Object.keys(form.controls)
          .forEach(key => {
              let currentControl = form.controls[key];

              if (currentControl.dirty) {
                  if (currentControl.controls)
                      dirtyValues[key] = this.getDirtyValues(currentControl);
                  else
                      dirtyValues[key] = currentControl.value;
              }
          });

      return dirtyValues;
}
    public  EmpList(){
      this.empService.fetchGridDataEmployeeByOrgID().subscribe(

        (data:any) => {


var results=[{ id: '', text: 'Select' }]
let user={};
if (localStorage.getItem('user_info')) {
  user = JSON.parse(localStorage.getItem('user_info'));

}
          // let dataObj = JSON.parse(data['token']);
        //
    if(data){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items

        results.push({

            "id": data[i].id,
            "text": data[i].full_name
        });
        if(data[i].full_name==user['full_name']){
          this.ownerValue=data[i].id;
        }
    }

    }



// this.departmentLeadData =results;
this.leadOwnerData =results;

        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )

        }

  public GetAllCustomerByOrgID(id) {
    this.projectService.GetAllCustomerByOrgID().subscribe((data: any) => {
      if(data){
        var results = [{ 'id': '', text: 'Select' }]
        data.map((elm)=>{
          if(elm.cst_name !== null){
            results.push({
              "id": elm.id,
              "text": elm.cst_name
            });
          }
        });
        if(id!=null){this.customerVal=id;}
        this.customerData = results
        //console.log(this.customerData)
      }
    },error => {
      Swal.fire(
      'Error!',
      error,
      'error'
      )
    });
  }

        public changedCustomer(e) {
          this.customerVal = e.value;
          if(e.value!='' && !this.editable){
            let postData={
              id:e.value
            }
            this.projectService.FindByCustomerId(postData).subscribe(
              (data:any)  => {
                console.log('this part called')
              //   this.projectForm.patchValue({
              //     // customer_Name:new FormControl(''),
              //     // contact_name:new FormControl(''),
              //     // customer_type:new FormControl(''),
              //     // customer_email:new FormControl(''),
              //     // customer_phone:new FormControl(''),
              //     // city:new FormControl(''),
              //     // customer_Name: data.cst_name,
              //     // customer_type:data.cst_type,
              //     // customer_phone:data.phone,

              //     // street_1:data.adr,
              //     // street_2:data.street,
              //        city:data.city,








              //  name: data.entityContact.name,
              // //  position: data.entityContact.position,
              //  phone: data.entityContact.phone,
              // //  mobile: data.entityContact.mobile,
              //  email: data.entityContact.email



              //   })
              //   setTimeout(()=>{

              //     this.projcountryValue=data.country

              //         }, 500);
              // this.countryValue=data.country

              // this.router.navigate(["/organizations"]);

              this.customerForm.patchValue({

                first_Name:data.first_name,
                last_Name:data.last_name,

                revenue:data.annual_revenue,
                email: data.email,
                website: data.website,
                emp_no: data.no_of_employee,
                contact_no:data.phone,
                city:data.city,
                 street_1: data.adr,
                 street_2: data.street,
                 relationship:data.entityContact!=null?data.entityContact.relationship:'',
                 designation: data.entityContact!=null?data.entityContact.designation:'',
                 note: data.entityContact!=null?data.entityContact.note:'',

                 })
                 this.selectedISO=data.phone_iso_name;
                  this.industryValue=data.industry_id;
                 this.countryValue=data.country;
                 if(data.is_company==true){
                   this.showCompanyDet=true
                   this.customerForm.patchValue({

                    org_Name:data.company_name,
                  })
                 }else{
                  this.showCompanyDet=false

                 }
                 if(data.entityContact!=null && data.entityContact.length!=0){
                   let entityContact;
                  this.showBranchList=true;

                  entityContact={
                    "id":data.entityContact.id,
                    "entity_id":data.entityContact.entity_id,
                    "first_name":data.entityContact.first_name,
                    "last_name": data.entityContact.last_name,
                    "phone":data.entityContact.phone ,
                    "phone_iso_name":data.entityContact.phone_iso_name,
                    "email": data.entityContact.email,
                    "note": data.entityContact.note,
                    // "deptid": this.deptValue,
                    "department": data.entityContact.department,
                    "relationship": data.entityContact.relationship,
                    // "desgnid": this.desgnValue,
                    "designation": data.entityContact.designation,
                    "is_primary":true
                  }
                  brList=[entityContact];
                  this.branchDataSource=[entityContact];

         // for(var i=0<i<data.entityContact.length;i++;){

         //   entityContact.push({

         //     "first_name":data.entityContact[i].first_name,
         //     "last_name": data.entityContact[i].last_name,
         //     "phone_no":data.entityContact[i].phone ,
         //     "email": data.entityContact[i].email,
         //     "is_primary": data.entityContact[i].is_primary
         //   })


         // }
         // this.branchDataSource=entityContact;
                }

              },
              error  => {
                Swal.fire(
                  'Error!',
                  error,
                  'error'
                ).then(
                  //used Arrow function here
                  (result)=> {

                    //  this.router.navigate(['/dashboard']);
                  })


              }

              )
          }

          //  this.FindCustomProjectPrefixByOrgIDAndPrefix(this.customPrefix)
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
            this.currentTime=moment(data.check_out).format('hh:mm a')
           }else{
            this.currentTime=moment().format('hh:mm a')

           }



                        }



                },
                error  => {
                  Swal.fire(
                    'Error!',
                    error,
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                      //  this.router.navigate(['/dashboard']);
                    })


                }

                )
              ;


           }
        public OnCustomerClose() {

       this.showOrgDetails=false;
       this.addCstformSubmitted=false;
       this.closeBtn.nativeElement.click();

          this.leadCustomerForm.reset();
          $("#customer_modal").modal('hide');

        }
        public onAddCustomer(){
          this.addCstformSubmitted=true;
        let postData={


          "id": null,
          "cst_type": null,
          "cst_name": this.showOrgDetails?this.leadCustomerForm.get('company_Name').value:this.leadCustomerForm.get('customer_Name').value+' '+this.leadCustomerForm.get('last_Name').value,
          "first_name": this.leadCustomerForm.get('customer_Name').value,
          "last_name": this.leadCustomerForm.get('last_Name').value,
          "email": this.leadCustomerForm.get('customer_email').value,
          "phone":(this.leadCustomerForm.get('customer_phone').value!=null && this.leadCustomerForm.get('customer_phone').value!='')? this.leadCustomerForm.get('customer_phone').value.internationalNumber.replace(/ /g, ""):null,
          "phone_iso_name":(this.leadCustomerForm.get('customer_phone').value!=null && this.leadCustomerForm.get('customer_phone').value!='')?this.leadCustomerForm.get('customer_phone').value.countryCode:null,
          "is_company":this.showOrgDetails,
          "company_name":this.showOrgDetails?this.leadCustomerForm.get('company_Name').value:null,
          "adr": this.leadCustomerForm.get('street_1').value,
          "street": this.leadCustomerForm.get('street_2').value,
          "city": this.leadCustomerForm.get('city').value,
          "country": this.cstCountryValue,
          "industry_id": this.industryValue,
          "website": this.leadCustomerForm.get('website').value,
          "entityContact": {
            "id": null,
            // "entity_id": "string",
            "entity_id": null,

            "name": this.leadCustomerForm.get('fname').value+' '+this.leadCustomerForm.get('lname').value ,
            //"position": this.leadCustomerForm.get('position').value,
            "phone":(this.leadCustomerForm.get('phone').value!=null && this.leadCustomerForm.get('phone').value!='')? this.leadCustomerForm.get('phone').value.internationalNumber.replace(/ /g, ""):null,
            "phone_iso_name":(this.leadCustomerForm.get('phone').value!=null && this.leadCustomerForm.get('phone').value!='')?this.leadCustomerForm.get('phone').value.countryCode:null,
           // "mobile": this.leadCustomerForm.get('mobile').value,
            "email": this.leadCustomerForm.get('email').value,
            "first_name": this.leadCustomerForm.get('fname').value,
            "last_name": this.leadCustomerForm.get('lname').value,
            "adr_1": null,
            "adr_2": null,
            "city": null,
            "country": null,
            "department": null,

        "relationship": this.cstRelationValueTxt!='Select' && this.cstRelationValueTxt!=''?this.cstRelationValueTxt:null,

            "designation": this.leadCustomerForm.get('designation').value,
            "note":  this.leadCustomerForm.get('note').value,
            "is_primary": true


          }
        }

           if(( !this.showOrgDetails?(this.leadCustomerForm.get('customer_Name').value!=''&&this.leadCustomerForm.get('last_Name').value!='' ):true)&&this.leadCustomerForm.status=='VALID'&& (this.showOrgDetails?this.leadCustomerForm.get('company_Name').value!='':true)){

          this.spinner.show();
this.FindByCustomerByPhone()
        //     return this.projectService.AddCustomer(postData).subscribe(
        //         (data:any)  => {
        //           if(data){
        //   this.spinner.hide();
        //             this.addCstformSubmitted=false;
        //             this.GetAllCustomerByOrgID(data.code);
        //           setTimeout(()=>{
        //             this.customerVal=data.code;

        //             // this.desgnTypeVal=data.leadProject.design_type_id;
        //             // this.projTypeVal=data.leadProject.project_type_id;
        //             // this.pkgTypeVal=data.leadProject.packages_id;
        //           },1500)
        // this.resetCstForm();

        //             this.toastr.success(data['desc'], undefined,{
        //               positionClass: 'toast-top-center'
        //          });
        //           }


        //         },
        //         error  => {
        //           Swal.fire(
        //             'Error!',
        //             error,
        //             'error'
        //           ).then(
        //             (result)=> {

        //             })


        //         }

        //        )

              }





        }

  FindByCustomerByPhone(){
    if((this.leadCustomerForm.get('phone').value!=null && this.leadCustomerForm.get('phone').value!='')){
      let postData={
        "phoneNumber": this.leadCustomerForm.get('phone').value.internationalNumber.replace(/ /g, "")
      }

      this.projectService.FindByCustomerByPhone(postData).subscribe((data:any) => {
        if('code' in data){
          this.spinner.hide();
          let NewCustomerData = {
            "id": null,
            "cst_type": null,
            "cst_name": this.showOrgDetails?this.leadCustomerForm.get('company_Name').value:this.leadCustomerForm.get('customer_Name').value+' '+this.leadCustomerForm.get('last_Name').value,
            "first_name": this.leadCustomerForm.get('customer_Name').value,
            "last_name": this.leadCustomerForm.get('last_Name').value,
            "email": this.leadCustomerForm.get('customer_email').value,
            "phone":(this.leadCustomerForm.get('customer_phone').value!=null && this.leadCustomerForm.get('customer_phone').value!='')? this.leadCustomerForm.get('customer_phone').value.internationalNumber.replace(/ /g, ""):null,
            "phone_iso_name":(this.leadCustomerForm.get('customer_phone').value!=null && this.leadCustomerForm.get('customer_phone').value!='')?this.leadCustomerForm.get('customer_phone').value.countryCode:null,
            "is_company":this.showOrgDetails,
            "company_name":this.showOrgDetails?this.leadCustomerForm.get('company_Name').value:null,
            "adr": this.leadCustomerForm.get('street_1').value,
            "street": this.leadCustomerForm.get('street_2').value,
            "city": this.leadCustomerForm.get('city').value,
            "country": this.cstCountryValue,
            "industry_id": this.industryValue,
            "website": this.leadCustomerForm.get('website').value,
            "entityContact": {
              "id": null,
              "entity_id": null,
              "name": this.leadCustomerForm.get('fname').value+' '+this.leadCustomerForm.get('lname').value ,
              "phone":(this.leadCustomerForm.get('phone').value!=null && this.leadCustomerForm.get('phone').value!='')? this.leadCustomerForm.get('phone').value.internationalNumber.replace(/ /g, ""):null,
              "phone_iso_name":(this.leadCustomerForm.get('phone').value!=null && this.leadCustomerForm.get('phone').value!='')?this.leadCustomerForm.get('phone').value.countryCode:null,
              "email": this.leadCustomerForm.get('email').value,
              "first_name": this.leadCustomerForm.get('fname').value,
              "last_name": this.leadCustomerForm.get('lname').value,
              "adr_1": null,
              "adr_2": null,
              "city": null,
              "country": null,
              "department": null,
              "relationship": this.cstRelationValueTxt!='Select' && this.cstRelationValueTxt!=''?this.cstRelationValueTxt:null,
              "designation": this.leadCustomerForm.get('designation').value,
              "note":  this.leadCustomerForm.get('note').value,
              "is_primary": true
            }
          }

          return this.projectService.AddCustomer(NewCustomerData).subscribe((data:any) => {
            if(data){
              this.spinner.hide();
              this.addCstformSubmitted=false;
              this.GetAllCustomerByOrgID(data.code);
              setTimeout(()=>{
                this.customerVal=data.code;
              },1500)
              this.resetCstForm();
              this.OnCustomerClose();
              this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
              });
            }
          },error  => {
            Swal.fire(
            'Error!',
            error,
            'error'
            ).then((result)=> { })
          })
        }else{
          this.customerVal=data.id;
          this.OnCustomerClose();
          this.toastr.error('Customer phone already exists', undefined,{
            positionClass: 'toast-top-center'
          });
          this.spinner.hide();
        }
      },error  => {
        Swal.fire(
        'Error!',
        error,
        'error'
        ).then((result)=> {})
      });
    }
  }

        resetCstForm(){
          this.leadCustomerForm.reset();
          this.cstCountryValue='';
          this.industryValue='';
          this.addCstformSubmitted=false;
          $('#customer_modal').modal('hide');
          this.closeBtn.nativeElement.click();


        }

        onPrimaryContactCheck(e){

          if(e.srcElement.checked==true ){
          let entityContact=this.leadCustomerForm.get('customer_phone').value;
          console.log('entityContact',entityContact)
          if(entityContact!=null){
          this.selectedCstISO=entityContact.countryCode;
          this.leadCustomerForm.patchValue({

            phone:(this.leadCustomerForm.get('customer_phone').value!='' && this.leadCustomerForm.get('customer_phone').value!=null)?entityContact.number:'',

           })
          }// ,
          //    ...phone && { phone:data.phone ? data.phone:''}
         this.leadCustomerForm.patchValue({
          fname: this.leadCustomerForm.get('customer_Name').value!=''?this.leadCustomerForm.get('customer_Name').value:'',
          lname: this.leadCustomerForm.get('last_Name').value!=''?this.leadCustomerForm.get('last_Name').value:'',
         // phone:(this.leadCustomerForm.get('customer_phone').value!='' && this.leadCustomerForm.get('customer_phone').value!=null)?entityContact.number:'',
          email:this.leadCustomerForm.get('customer_email').value!=''?this.leadCustomerForm.get('customer_email').value:'',
          // relationship:this.customerForm.get('relationship').value!=''?this.customerForm.get('relationship').value:'',
          // designation:this.customerForm.get('designation').value!=''?this.customerForm.get('designation').value:'',
          // note:this.customerForm.get('note').value!=''?this.customerForm.get('note').value:'',
         })

        }else{
          this.leadCustomerForm.patchValue({
            fname:'',
            lname:'',
            phone:'',
            email:'',
            relationship:'',
            designation:'',
            note:'',


           })
        }
        }
        private createEmailFormGroup(): FormGroup {
          return new FormGroup({
            // 'emailAddress': new FormControl('', Validators.email),
            // 'emailLabel': new FormControl(''),
            'OrderID': new FormControl('',Validators.required),
            'primaryAcc': new FormControl(''),
            'primaryAccValue': new FormControl(''),

          })
        }
        public AddContact(){
          this.showAddContact=!this.showAddContact;
         this.DeptList();
         this.customerContactForm.reset();

        // this.selectedISO=CountryISO.UnitedArabEmirates
        //  this.showBranchList=true;


        }
        public changedDept(e: any): void {

           this.deptValue=e.value;
         if(e.value!=''){
            this.deptName=e.data[0].text;
           this.DesgnList(this.deptValue);
         }

       }
       public  DesgnList(deptValue){

        this.desgnService.getDesgnByDeptId(deptValue).subscribe(
          (data:any)  => {

    var results=[{ id: '  ', text: 'Select' }]
    // let dataObj = JSON.parse(data['token']);
  //

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
  "id": data[i].id,
  "text": data[i].designation_name
});

}


this.desgnData =results;



          },
          error  => {
            Swal.fire(
              'Error!',
              'error',
              'error'
            ).then(
              //used Arrow function here
              (result)=> {

                //  this.router.navigate(['/dashboard']);
              })


          }

          )
          }


       public changedDesgn(e: any): void {

         this.desgnValue=e.value;
         if(e.value!=''){
           this.desgnName=e.data[0].text;
        }
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
              }



            }
          )
        }
        public onendDtChange(e){
          this.enddateValue=moment(e.value).format('L');


        }
        showRows4(){
          this.showTextArea4=true;
        }
        public  GetPrefixByOrgID(){
          this.projectService.GetAllPrefixByOrgID().subscribe(

            (data:any) => {

          for(var i=0;i<data.length;i++){
            if(data[i].type=="lead"){
              if(data[i].prefix_for=="default"){
                let splittable;
                if(data[i].prefix_name){
                let prefix_name=data[i].prefix_name;

                 splittable =  prefix_name.split('/');
                 if (parseInt(splittable[3]).toString().length == 1) {
                  let jobNo = '000' + (parseInt(splittable[3]) + 1)
                  this.prefixString = splittable[0] +'/'+ splittable[1]+'/'+ splittable[2] + '/' + jobNo;

                } else if (parseInt(splittable[3]).toString().length == 2) {
                  let jobNo = '00' + (parseInt(splittable[3]) + 1)
                  // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                  this.prefixString = splittable[0] +'/'+ splittable[1]+'/'+ splittable[2] + '/' + jobNo;

                }else if (parseInt(splittable[3]).toString().length == 3) {
                  let jobNo = '0' + (parseInt(splittable[3]) + 1)
                  // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                  this.prefixString = splittable[0] +'/'+ splittable[1]+'/'+ splittable[2] + '/' + jobNo;

                }
                else {
                  let jobNo = (parseInt(splittable[3]) + 1)
                  // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                  this.prefixString = splittable[0] +'/'+ splittable[1]+'/'+ splittable[2] + '/' + jobNo;

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
           let jobNo=(parseInt(splittable[1])+1)
                 this.prefixString=splittable[0] +'/'+jobNo;
                 if (parseInt(splittable[1]).toString().length == 1) {
                  let jobNo = '000' + (parseInt(splittable[1]) + 1)
                  this.prefixString = splittable[0] + '/' + jobNo;

                } else if (parseInt(splittable[1]).toString().length == 2) {
                  let jobNo = '00' + (parseInt(splittable[1]) + 1)
                  // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                  this.prefixString = splittable[0] + '/' + jobNo;

                }else if (parseInt(splittable[1]).toString().length == 3) {
                  let jobNo = '0' + (parseInt(splittable[1]) + 1)
                  // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                  this.prefixString = splittable[0] + '/' + jobNo;

                }
                else {
                  let jobNo = (parseInt(splittable[1]) + 1)
                  // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                  this.prefixString = splittable[0] + '/' + jobNo;

                }
          }

        }else  if(data[i].prefix_for=="random"){
          let splittable;
          if(data[i].prefix_name){
          let prefix_name=data[i].prefix_name;

           splittable =  prefix_name.split('/');
           let jobNo=(parseInt(splittable[1])+1)
                 this.prefixString=data[i].prefix_name+jobNo;

                 this.prefixString = splittable[0] + '/' + jobNo;

          }

        }
            }
          }


            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }
            public  GetLastAddedLeadPrefixByOrgID(){
              this.leadService.GetLastAddedLeadPrefixByOrgID().subscribe(

                (data:any) => {

              if(data.code==""){
                this.projectService.GetAllPrefixByOrgID().subscribe(

                  (data:any) => {

                for(var i=0;i<data.length;i++){
                  if(data[i].type=="lead"){
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


                  },
                  error  => {
                    Swal.fire(
                      'Error!',
                      error,
                      'error'
                    ).then(
                      //used Arrow function here
                      (result)=> {

                        //  this.router.navigate(['/dashboard']);
                      })


                  }

                  )
              }else{
                let lastAddedprefix=data.code;
                let lastAddprefixSplit=lastAddedprefix.split('/').pop();
                this.projectService.GetAllPrefixByOrgID().subscribe(

                  (data:any) => {

                for(var i=0;i<data.length;i++){
                  if(data[i].type=="lead"){
                    if(data[i].prefix_for=="default"){
                      let splittable;

                      if(data[i].prefix_name){
                      let prefix_name=data[i].prefix_name;

                       splittable =  prefix_name.split('/');
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


                  },
                  error  => {
                    Swal.fire(
                      'Error!',
                      error,
                      'error'
                    ).then(
                      //used Arrow function here
                      (result)=> {

                        //  this.router.navigate(['/dashboard']);
                      })


                  }

                  )

              }


                },
                error  => {
                  Swal.fire(
                    'Error!',
                    error,
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                      //  this.router.navigate(['/dashboard']);
                    })


                }

                )
                }

                 /*Meeting Info*/
                 getParentApi(): ParentComponentApi  {
                  return {
                    callParentMethod: () => {
                      this.OnTaskClose(),
                      this.GetAllCloseActivitiesEntityID(),
                      this.GetAllOpenActivitiesEntityID()
                    }
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
          "entity_id": this.editDeptId,
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
       this.meetingForm.reset();
       this.meetingForm.patchValue({
        startTime:moment().format("hh:mm a")
      });
      this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

            if(data){
              let postData = {
              entity_id: this.editDeptId,
              event_type: "Meeting added",
              event_desc: "Meeting added from the lead",
            };
             this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
              console.log(data)
                  if(data){
                    this.getLeadHistory(this.editDeptId);
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

      cancelText(){
        this.showTextArea4=false;
        this.notesEditable=false;
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
          "entity_id": this.editDeptId,

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
       this.meetingForm.patchValue({
        startTime:moment().format("hh:mm a")
      });

      this.toastr.success(data['desc'], undefined, {
        positionClass: 'toast-top-center'
      });

      if(data){
        let postData = {
        entity_id: this.editDeptId,
        event_type: "Meeting Updated",
        event_desc: "Meeting Updated form the lead",
      };
       this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
        console.log(data)
          if(data){
              this.getLeadHistory(this.editDeptId);
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
          "entity_id": this.editDeptId,
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

                if(data){
                  let postData = {
                  entity_id: this.editDeptId,
                  event_type: "note added",
                  event_desc: "note added for the lead",
                };
                 this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                  console.log(data)
                    if(data){
                      this.getLeadHistory(this.editDeptId);
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
      public updateNotes() {



        let postData = {

          "id": this.editnotesId,
          "entity_id": this.editDeptId,
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

              if(data){
                let postData = {
                entity_id: this.editDeptId,
                event_type: "note updated",
                event_desc: "note updated for the lead",
              };
               this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
                    console.log(data)
                    if(data){
                      this.getLeadHistory(this.editDeptId);
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
          "entity_id": this.editDeptId,
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

        }




        if (this.callForm.status=='VALID' && this.entityContactVal!='' ) {
          this.spinner.show();
          return this.quotationService.AddEntityCall(postData).subscribe(
            (data: any) => {

               if (data.status == 200) {
                this.spinner.hide();
                this.callCloseBtn.nativeElement.click();
                $('#call_modal').modal('hide');
       this.GetAllOpenActivitiesEntityID();
       this.GetAllCloseActivitiesEntityID();

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
          entity_id: this.editDeptId,
          event_type: "call added",
          event_desc: "call added from the lead",
        };
         this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
              console.log(data)
              if(data){
                this.getLeadHistory(this.editDeptId);
              }
          });
         }

              }else if (data.status == 205) {
                this.spinner.hide();
                this.toastr.error(data['desc'], undefined, {
                  positionClass: 'toast-top-center'
                });
                this.callCloseBtn.nativeElement.click();

                $('#call_modal').modal('hide');

              }else {
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
          "entity_id": this.editDeptId,
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
                this.callCloseBtn.nativeElement.click();

                $('#call_modal').modal('hide');
       this.GetAllOpenActivitiesEntityID();
       this.GetAllCloseActivitiesEntityID();

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
          entity_id: this.editDeptId,
          event_type: "call updated",
          event_desc: "call updated for the lead",
        };
         this.histSer.AddEntityHistoryLog(postData).subscribe((data)=> {
            console.log(data)
                if(data){
                    this.getLeadHistory(this.editDeptId);
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
          "id":sessionStorage.getItem('leadId')
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
              //used Arrow function here
              (result) => {

                //  this.router.navigate(['/dashboard']);
              })


          }

        )
      }

      public GetAllOpenActivitiesEntityID() {
        let postData={
          "id":sessionStorage.getItem('leadId')

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
              //used Arrow function here
              (result) => {

                //  this.router.navigate(['/dashboard']);
              })


          }

        )
      }
      GetAllCloseActivitiesEntityID() {
        let postData={
          "id":sessionStorage.getItem('leadId')


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
              //used Arrow function here
              (result) => {

                //  this.router.navigate(['/dashboard']);
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
          //  let datas = new DataManager(data);
          //   this.projectData = datas.dataSource['json'];

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
          //

           this.pageSettings = { pageSizes: true, pageCount: 5 }
           this.toolbar = ['Search', 'ExcelExport', 'PdfExport',];
           // this.router.navigate(["/organizations"]);

         },
         error => {
           Swal.fire(
             'Error!',
             error,
             'error'
           ).then(
             //used Arrow function here
             (result) => {

               //  this.router.navigate(['/dashboard']);
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
               //used Arrow function here
               (result) => {

                 //  this.router.navigate(['/dashboard']);
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
               //used Arrow function here
               (result) => {

                 //  this.router.navigate(['/dashboard']);
               })


           }

         )
        }else{
          this.updateTask.taskEdit(id);
        }

     }
  @ViewChild('notify',{static:true}) updateTask: NotificationComponent;

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

    public FindByEntityContactOrgID() {
      // this.countryData = []
      // this.countryValue=''

  let entityId={
    entityID:this.editDeptId,
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
            //used Arrow function here
            (result) => {

              //  this.router.navigate(['/dashboard']);
            })


        }

      )
    }
    getContactList(id) {
      // this.countryData = []
      // this.countryValue=''
      let entityId={
        entityID:this.editDeptId,
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

        },
        error => {
          Swal.fire(
            'Error!',
            'Error.',
            'error'
          ).then(
            //used Arrow function here
            (result) => {

              //  this.router.navigate(['/dashboard']);
            })


        }

      )
    }

    public openContactModal(type){
      //$('#details_view_modal').modal('show')
      //  $('#activity_log_modal').modal('hide')
      console.log('openDetailedView',type)
      this.savedContactPh=false;
      if(type=='meeting'){
        $("#meeting_modal").removeClass("fade").modal("hide");
        this.closeActLog=true
        this.typeOfModal='meeting'

      }else if(type=='call'){
        $("#call_modal").removeClass("fade").modal("hide");

        this.closeActLog=false
        this.typeOfModal='call'


      }

      $("#contact_modal").modal("show").addClass("fade");
    }
    closeContactModal(){
      // $('#details_view_modal').modal('hide')
      // $('.modal-backdrop').remove();
      //  $('#activity_log_modal').modal('show')
      this.contactCloseBtn.nativeElement.click();
      $("#contact_modal").removeClass("fade").modal("hide");
      this.customerContactForm.reset();
      this.savedContactPh=false;
    if(this.closeActLog==true){
      $("#meeting_modal").modal("show").addClass("fade");

    }else{
      $("#call_modal").modal("show").addClass("fade");

    }
    }
    saveContact(e){
  this.savedContactPh=true;
        let postData={

          "id":null,
          "entity_id":this.editDeptId,
          "first_name":this.customerContactForm.get('fname').value,
          "last_name": this.customerContactForm.get('lname').value,
          "name":this.customerContactForm.get('fname').value+' '+ this.customerContactForm.get('lname').value,
          // "phone":this.customerContactForm.get('mobile').value ,
          "phone":(this.customerContactForm.get('mobile').value!=null && this.customerContactForm.get('mobile').value!='')? this.customerContactForm.get('mobile').value.internationalNumber.replace(/ /g, ""):null,
          "phone_iso_name":(this.customerContactForm.get('mobile').value!=null && this.customerContactForm.get('mobile').value!='')?this.customerContactForm.get('mobile').value.countryCode:null,
          "email": this.customerContactForm.get('email').value,
          "note": this.customerContactForm.get('note').value,
          "department": null,

        "relationship": this.cstRelationValueTxt!='Select' && this.cstRelationValueTxt!=''?this.cstRelationValueTxt:null,

          "designation": this.customerContactForm.get('designation').value,
          "is_primary":false

        }

       if(this.customerContactForm.get('mobile').status=='VALID'){
       console.log('saveContactAddress',postData)
       this.savedContactPh=false;

       this.spinner.show();

         return this.quotationService.AddEntityContact(postData).subscribe(
          (data: any) => {
  if(data.status=='200'){

              this.spinner.hide();
            this.customerContactForm.reset();
            this.cstRelationValue='';
            this.closeContactModal();
            if(this.typeOfModal=='meeting'){
            this.getAllEmployeeList(data.code);

            }else if(this.typeOfModal=='call'){
              this.getContactList(data.code);


              }
            // this.getContactList(data.code);
            // this.getAllEmployeeList();
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
        entityID:this.editDeptId,
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
            //used Arrow function here
            (result) => {

              //  this.router.navigate(['/dashboard']);
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
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )

        }
    OnMeetingModalClose(){
      $("#meeting_modal").modal('hide');
      this.meetCloseBtn.nativeElement.click();

      this.meetingForm.reset();
      this.empVal='';

    }
    OnCallModalClose(){
      $("#call_modal").modal('hide');
      this.callCloseBtn.nativeElement.click();

      this.callForm.reset();
      this.contactVal='';
      this.entityContactVal='';

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
          if((new Date(moment().format('YYYY-MM-DD')+' '+this.callForm.get('endTime').value)>new Date(moment().format('YYYY-MM-DD')+' '+this.currentTime))){
            this.showValidTimeError=true;
          }else{
            this.showValidTimeError=false;

          }
          // if(this.callForm.get('endTime').value>this.currentTime){
          //   this.showValidTimeError=true;
          // }else{
          //   this.showValidTimeError=false;

          // }
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
  ngOnInit() {
    this.serviceFormInputs();
    this.invoiceToolbar = ['Search'];
    // this.DeptList();
    this.EmpList();
    this.GetLastAddedLeadPrefixByOrgID();
// this.GetPrefixByOrgID();
this.GetSourceByOrgID();
this.GetStatusByOrgID();
    this.GetAllCustomerByOrgID(null);
    this.getTimesheetByEmpId();
    this.emailForm = this.formBuilder.group({
      emails: this.formBuilder.array([this.createEmailFormGroup()])
    });
    if(JSON.parse(localStorage.getItem('userRights')).length!=0){
      console.log('if')
      let userRights= JSON.parse(localStorage.getItem('userRights'));
      for(var i=0;i<userRights.length;i++){
        if(userRights[i].module_name=='Lead'){
          if(userRights[i].section_name=='View List' && userRights[i].is_allow==true ){
            this.showList=true
          }
        else if(userRights[i].section_name=='View List' && userRights[i].is_allow==false ){
          this.showList=false

        }
        if(userRights[i].section_name=='Add' && userRights[i].is_allow==true ){
          this.showAddBtn=true
        }
      else if(userRights[i].section_name=='Add' && userRights[i].is_allow==false ){
        this.showAddBtn=false

      }
      if(userRights[i].section_name=='Edit' && userRights[i].is_allow==true ){
        this.showEditBtn=true
      }
    else if(userRights[i].section_name=='Edit' && userRights[i].is_allow==false ){
      this.showEditBtn=false

    }
    if(userRights[i].section_name=='Delete' && userRights[i].is_allow==true ){
      this.showDeleteBtn=true
    }
    else if(userRights[i].section_name=='Delete' && userRights[i].is_allow==false ){
    this.showDeleteBtn=false

    }
    if(userRights[i].section_name=='Lead To Estimation' && userRights[i].is_allow==true ){
      this.showEstBtn=true
    }
    else if(userRights[i].section_name=='Lead To Estimation' && userRights[i].is_allow==false ){
    this.showEstBtn=false

    }
    console.log('userRights',userRights[i].section_name)

      }else{
        // this.showList=true
        // this.showAddBtn=true
        // this.showEditBtn=true
        // this.showDeleteBtn=true
        // this.showEstBtn=true
      }
      }

    }else{
      console.log('else')
      this.showList=true
      this.showAddBtn=true
      this.showEditBtn=true
      this.showDeleteBtn=true
      this.showEstBtn=true




    }
    if(localStorage.getItem('planType')){

      this.planType='Basic'
    }
    if (this.ownerValue != '' && this.leadSourceValue!='' && this.statusValue!='' &&(!this.showOrgDetails?(this.customerForm.get('first_Name').status=='VALID' &&this.customerForm.get('last_Name').status=='VALID' && this.customerForm.get('contact_no').status=='VALID'):true || this.showOrgDetails?this.companyValue!='':true)   ) {

      this.dealTabDisabled = false;
      }else{
        this.dealTabDisabled = true;

      }
    //this.FetchGridDataByDepartmentOrgID();
    this.GetAllCustomer();
    this.deptForm = new FormGroup({
      dep_name: new FormControl('', [Validators.required]),
      alias: new FormControl(''),




   });
   this.designTypeForm = new FormGroup({
    design_Name: new FormControl('', [Validators.required]),
    desc: new FormControl('')
  })
  this.projTypeForm = new FormGroup({
    type_Name: new FormControl('', [Validators.required]),
    desc: new FormControl(''),

  })
   this.companyForm = new FormGroup({
    comp_Name: new FormControl('', [Validators.required]),
    desc: new FormControl(''),



 });
 this.conversionForm = new FormGroup({
  Type: new FormControl(''),
  desc: new FormControl(''),
  project_name: new FormControl('', [Validators.required]),
  amount: new FormControl(''),
  basicCost: new FormControl(''),
  prefixVal: new FormControl(''),
  prefix_name: new FormControl(''),
  remarks: new FormControl(''),






});

 this.projectForm = new FormGroup({
  project_name: new FormControl('', [Validators.required]),
  desc: new FormControl(''),
  project_amount: new FormControl(''),
  // startDate: new FormControl(''),
   endDate: new FormControl(''),
  // completeDate: new FormControl(''),
  // accessControl: new FormControl(''),
  prefixVal: new FormControl(''),
  prefix_name: new FormControl(''),
  no_of_days: new FormControl(''),



});
this.projectForm.patchValue({
  prefixVal: 'is_auto',
})
 this.customerContactForm = new FormGroup({


  fname: new FormControl('', [Validators.required]),
  lname: new FormControl('', [Validators.required]),
  department: new FormControl(''),
  note: new FormControl(''),
  relationship: new FormControl(''),

  designation: new FormControl(''),
  //  phone: new FormControl(''),
  mobile:new FormControl('',[Validators.required]),

  //  mobile: new FormControl('',[patternValidator(/^\+\d{1,3}-\d{9,10}$/)]),
   email: new FormControl('', [
    Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),








});

   this.customerForm = new FormGroup({
    avatar: new FormControl(''),

    // customer_Name:new FormControl(''),
    first_Name:new FormControl(''),
    last_Name:new FormControl(''),
    // tags:new FormControl('', [Validators.required]),
    revenue:new FormControl(''),
    contact_no:new FormControl('',[Validators.required]),
     contact_name:new FormControl(''),
     customer_type:new FormControl(''),
     customer_email:new FormControl(''),
     customer_phone:new FormControl(''),
     city:new FormControl(''),

  company_Name: new FormControl(''),
  org_Name: new FormControl(''),

     street_1: new FormControl(''),
     street_2: new FormControl(''),


     country: new FormControl(''),

     name: new FormControl(''),
     position: new FormControl(''),
    //  phone: new FormControl(''),
     mobile: new FormControl(''),

     email: new FormControl('',[Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),

    //  phone: new FormControl(undefined, [Validators.required]),


     website: new FormControl(''),
     emp_no: new FormControl(''),
     relationship: new FormControl(''),
     designation: new FormControl(''),
     note: new FormControl(''),
     remarks: new FormControl(''),



  });

  this.leadCustomerForm = new FormGroup({
    customer_Name: new FormControl(''),
    last_Name: new FormControl(''),
    company_Name: new FormControl(''),
    contact_name: new FormControl(''),
    customer_type: new FormControl(''),
    customer_phone: new FormControl('',[Validators.required]),
    // customer_email: new FormControl('',[Validators.required,patternValidator(/^(?:^\+[1-9]\d{1,14}$|\w+@\w+\.\w{2,3})$/)]),
    customer_email: new FormControl('', [
      Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),

    city: new FormControl(''),
    website: new FormControl(''),
    revenue: new FormControl(''),
    emp_no: new FormControl(''),
    street_1: new FormControl(''),
    street_2: new FormControl(''),


    country: new FormControl(''),

    name: new FormControl(''),
    fname: new FormControl('',[Validators.required]),
    lname: new FormControl('',[Validators.required]),
    position: new FormControl(''),
    phone: new FormControl('',[Validators.required]),
    mobile: new FormControl(''),
    email: new FormControl('',[Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
    relationship: new FormControl(''),
    designation: new FormControl(''),
    note: new FormControl(''),







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
    // $.getScript("assets/js/departments-datatable.js")
    this.callForm.patchValue({
      callType: 'current',
      startDate:moment().format('L'),

    })

  }

  checkForYes(e){
    this.showProjectSearchBtn = e.checked
    if(!e.checked){
      this.selectedOriginalProject = ''
    }
  }

  openProjectSearchModel(){
    $('#Search_project_modal').modal('show');
    this.spinner.show();
    this.GetAllProjectsByOrgId();
  }

  GetAllProjectsByOrgId(){
    this.projectService.GetAllProjectsByOrgId().subscribe((data: any) => {
      let filteredProject = [];
      data.map((elm, i) => {
        filteredProject.push(elm);
        if(data.length === i+1){
          this.projectListingData = filteredProject;
          console.log('Justin',this.projectListingData)
          this.spinner.hide();
        }
      });
    });
  }

  toProjectLayout(id){
    localStorage.setItem('project_id',id);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/project-layout-new'])
    );
    window.open(url, "_blank");
  }

  closeProjectSearchModel(){
    $('#Search_project_modal').modal('hide');
  }

  continueWithSelectedProj(data){
    console.log('Justin', data)
    this.selectedOriginalProject = {
      project_id: data.project_id,
      project_name: data.project_name,
      project_prefix: data.project_prefix,
      cst_name: data.cst_name,
      phone: data.phone
    }
    this.toastr.success('Project '+data.project_name+' selected')
    this.closeProjectSearchModel();
  }

  projectSearchKeyUp(): void {
    document.getElementById(this.searchProjectdataTableGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.searchProjectdataTableGrid.search((event.target as HTMLInputElement).value)
    });
  }


}
export interface ParentComponentApi {
  callParentMethod: () => void
  // taskParentMethod: () => void

}
