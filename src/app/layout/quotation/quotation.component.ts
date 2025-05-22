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
let date = moment(new Date()).format('L');
let formattedPrefix = moment(date).format('YY/MM/DD');
declare var $: any;

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})


export class QuotationComponent implements OnInit {
  projectForm: FormGroup;
  prefixValue: any;
  public prefixString = 'CST/' + formattedPrefix;
  public tagsArrayValue=[];
  public taskOptions: Select2Options;
  public projectNames = [
    {display: 'projName1', value: 1,email:'asda'},
    {display: 'projName2', value: 2,email:'adsdsda'},
    {display: 'projName3', value: 3,email:'sdasda'},
  ];
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

  phoneInvalid: boolean=false;
  phoneErrorMsg: any;
  phoneNumberValue: string='';
  @ViewChild('accordion',{static:true}) accordion: AccordionComponent;
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
  statusForm: FormGroup;
  unitTypeVal: any;
  unitTypetxt: any;
  extraUnitData: any[];
  extraUnitForm: FormGroup;
  
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
  showUpdateBtn: boolean=false;
  showList: boolean;
  showReviseBtn: boolean;
  showCostDetails: boolean;
  showConvertBtn: boolean;
  viewDashboard: boolean;
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
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
          })
        

      }

    )
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
  public changedDesgnType(e: any): void {
    this.desgnTypeVal = e.value;

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
  changedStage(e: any): void {
    // this.stageVal = e.value;
    
    if(e.data[0].text=="Closed Won"){
      this.showUpdateBtn=true;
    }else{
      this.showUpdateBtn=false;

    }

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
          //used Arrow function here
          (result)=> {
             
            //  this.router.navigate(['/dashboard']);
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
      id:this.costprojVal
    }
       //this.fetchUnitDesc();
       // this.extraUnit();
       this.quotationService.RevisedQuotation(postData).subscribe(
         (data: any) => {
           if(data){
            this.spinner.hide();
       sessionStorage.setItem('costId',data.id);
        this.router.navigate(["/cost-estimate"]);

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

            results.push({
              "id": data[i].id,
              "text": data[i].stage_name,

            });
           

          }
          this.stageData = results;
        }



      }
    )
  }
  toQtnLayout(qtnId){
    this.router.navigate(["/quotation-layout"]);

    sessionStorage.setItem('qtnId',qtnId);

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
return this.costService.CalculateCostProject(postData).subscribe(
      (data: any) => {
        if (data) {
          this.spinner.hide();
        

        //  this.callCostProj(postData,id);
        let milestoneArray=[];
        
        // this.milestoneData=data['CostProjectMilestone'];
        if(data['CostProjectMilestone']){
        if( data['CostProjectMilestone'].length!=0){
          for (var i = 0; i < data['CostProjectMilestone'].length; i++) {
            if(data['CostProjectMilestone'][i].milestone_name=='Study'){

              // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
              milestoneArray[0]=data['CostProjectMilestone'][i]
               if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                

                let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseFloat(item.qty)).reduce((prev, next) => prev + next);
              let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);
                  // let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].length!=0? data['CostProjectMilestone'][i]['CostProjectTask'].reduce(function(sum, record){
                  //   if(record.total_cost_amount != null){
                  //     return sum +parseFloat(record.total_cost_amount) ;

                  //   } else{
                  //     return sum +(parseFloat(record.qty)*(this.perunitCostHrs));
                  //   }
                    
                  // }, 0):0;
                  // parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);
               
               
                
                // this.design_hrs=total_hrs;
              milestoneArray[0]['total_hrs']=total_hrs
              milestoneArray[0]['total_cost']=total_cost
              this.totalCostStudy=total_cost;

               }
            
            }
            if(data['CostProjectMilestone'][i].milestone_name=='Design'){
              // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                milestoneArray[1]=data['CostProjectMilestone'][i]
               if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){

              let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseInt(item.qty)).reduce((prev, next) => prev + next);
              let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);
             
              
              milestoneArray[1]['total_hrs']=total_hrs
              milestoneArray[1]['total_cost']=total_cost
              this.totalCostDesign=total_cost;


               }
            }
            if(data['CostProjectMilestone'][i].milestone_name=='Shop Drawing'){
              // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                milestoneArray[2]=data['CostProjectMilestone'][i]
               if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){

              let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseInt(item.qty)).reduce((prev, next) => prev + next);
              let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);
             
              
              milestoneArray[2]['total_hrs']=total_hrs
              milestoneArray[2]['total_cost']=total_cost
              this.totalCostDrawing=total_cost;


               }
            }
            if(data['CostProjectMilestone'][i].milestone_name=='Extra Services'){
              // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                milestoneArray[3]=data['CostProjectMilestone'][i]
               if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){

              let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseInt(item.qty)).reduce((prev, next) => prev + next);
              let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);
              
              
              milestoneArray[3]['total_hrs']=total_hrs
              milestoneArray[3]['total_cost']=total_cost
              this.totalCostService=total_cost;


               }
            }
                    }
        }
        }
        this.milestoneData=milestoneArray;
        this.CURRENCY = 'CURRENCY';

        
         this.projectForm.patchValue({
           
          project_name: data.project_name,
         name: data.EntityContact?data.EntityContact[0].name:'',
         phone: data.EntityContact?data.EntityContact[0].phone:'',
         email: data.EntityContact?data.EntityContact[0].email:'',
         floor_no:data.no_of_floors,
         built_area:data.buildup_area,
         plot_size:data.plot_size,
         city:data.EntityContact?data.EntityContact[0].city:'',
         plotVal:data.plot_size_unit=='sq ft'?'sq_ft':'sq_m',
         builtVal:data.plot_size_unit=='sq ft'?'built_sq_ft':'built_sq_m',

          
        
        })
        this.project_prefix_val=data.project_prefix;
        if(data.TypeOfDesign){
          this.desgnTypeVal=data.TypeOfDesign.length!=0?data.TypeOfDesign[0]:'';

        }
        this.pkgTypeVal=data.package_id!=''?data.package_id:'';
        
       
        this.phone=data.EntityContact?data.EntityContact.phone:'';
        this.projcountryValue=data.EntityContact?data.EntityContact[0].country:'';
        if(data.cst_id!=null){
                     this.customerVal=data.cst_id
                    //  this.projcountryValue=data.customer.
                    }
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

      emails.push(this.createEmailFormGroup())
      var tags=[]

      for (var j = 0; j < list[i].ProjectTags.length; j++) {

        tags.push(
          list[i].ProjectTags[j].tags,

        );

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

    

    if (this.projCostId!='') {
      this.spinner.show();
      return this.quotationService.AddQuotation(postData).subscribe(
        (data: any) => {
          
          if (data.status == 200) {
            this.GetAllCustomer();
            this.addCstformSubmitted = false;
            this.spinner.hide();
            this.countryValue='';
            this.warrantyVal='';
            this.paymentVal='';
            this.paymentModeTypeVal='';
            this.taxVal='';
            this.stageVal='';

           
            this.TaskView();
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



     }
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
            //used Arrow function here
            (result) => {
              
              //  this.router.navigate(['/dashboard']);
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
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
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
  

  public qtnEdit(qtnId){
    this.GetAllCustomer();
    this.GetProjectTypeByOrgID();
       this.GetAllProjectStatus();
       this.findCostHrs();
       this.findprofitMargin();
       this.getCountryList();
   this.GetCostProjByOrgID();

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
          
  
          // this.dataSource =  new MatTableDataSource(data);
          // this.dataSource.paginator = this.paginator;
          //this.dataSource.sort = this.sort;
       
          // let dataObj = JSON.parse(data['token']);
          // 
          this.projCostId==data.lead_id;
          this.costprojVal==data.lead_id;

         setTimeout(()=>{this.costprojVal=data.lead_id},1000);
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
            
             
    //          // this.router.navigate(["/organizations"]);
         
    //          },
    //          error  => {
    //            Swal.fire(
    //              'Error!',
    //              error,
    //              'error'
    //            ).then(
    //              //used Arrow function here
    //              (result)=> {
    //                 
    //                //  this.router.navigate(['/dashboard']);
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
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
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
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
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
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
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
  constructor(private projectService: ProjectService,private quotationService: QuotationService,private leadService:LeadService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private costService: CostService, private formBuilder: FormBuilder, private countries: CountryService, private empService: EmployeeService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) {



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
      total_cost:(data[i].CostProjectTask[j].total_cost_amount!=null?data[i].CostProjectTask[j].total_cost_amount:data[i].CostProjectTask[j].qty*this.perunitCostHrs),profit:data[i].CostProjectTask[j].discount_amount!=null?data[i].CostProjectTask[j].discount_amount:'',perUnit:data[i].CostProjectTask[j].unit!=null?data[i].CostProjectTask[j].unit_type:'',
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
  public openStatusModal(){
  this.locationSetUp();

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
     
      public onUpdateStatus() {
this.submitClicked=true;
        let postData = {
    
          "id": this.projCostId,
          "project_status_id": this.projStatus,
          start_date:moment(this.startdateValue).format('L') ,
    end_date: moment(this.enddateValue).format('L'),
    "entityLocation": {
      "id": "string",
      "entity_id": "string",
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
    
    }

    
    
        }
    
        
    
        if (this.projStatus != '' && this.statusForm.status=='VALID') {
          this.spinner.show();
    
          return this.costService.UpdateCostProjectStatusByID(postData).subscribe(
            (data: any) => {
              // let dataObj = JSON.parse(data['token']);
              
              if (data.status == 200) {
    
                // this.addformSubmitted=false;
                $('#cost_status_modal').modal('hide');
                this.submitClicked=false;
    
                this.TaskView();
                // this.router.navigate
               this.router.navigate(["/projects"]);

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
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
          })
        

      }

    )
  }
  
  ngOnInit() {
    this.GetProjectTypeByOrgID();
    this.FindAutoProjectPrefixByOrgID();
    this.GetPriorityByOrgID();
   this.GetCostProjByOrgID();

    // this.fetchUnitDesc();
    this.fetchDesignType();
    this.findCostHrs();
    this.fetchStageType();
    
  
    this.emailForm = this.formBuilder.group({
      emails: this.formBuilder.array([])
    });
    this.extraUnitForm = this.formBuilder.group({
      extras: this.formBuilder.array([])
    });
    this.milestTaskForm = this.formBuilder.group({
      miles: this.formBuilder.array([])
    });
   
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


    });
    
    this.projectForm.patchValue({
      prefixVal: 'is_auto',
      startDate:moment().format('L'),
      floor_no:1,
      plotVal:'sq_ft',
      builtVal:'built_sq_ft'
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
    // if(sessionStorage.getItem("qtnId")){
    //   this.qtnEdit(sessionStorage.getItem("qtnId"));


    // } 
    if(JSON.parse(localStorage.getItem('userRights')).length!=0){
      console.log('if')
      let userRights= JSON.parse(localStorage.getItem('userRights'));
      for(var i=0;i<userRights.length;i++){
        if(userRights[i].module_name=='Quotation'){
          if(userRights[i].section_name=='View List' && userRights[i].is_allow==true ){
            this.showList=true
          }
        else if(userRights[i].section_name=='View List' && userRights[i].is_allow==false ){
          this.showList=false
    
        }
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
    if(userRights[i].section_name=='Quotation Dashboard' && userRights[i].is_allow==true ){
      this.viewDashboard=true
    }
    else if(userRights[i].section_name=='Quotation Dashboard' && userRights[i].is_allow==false ){
    this.viewDashboard=false
    
    }
    console.log('userRights',userRights[i].section_name)
    
      }else{
        // this.showList=true
        // this.showCostDetails=true
        // this.showConvertBtn=true
        // this.viewDashboard=true
        // this.showReviseBtn=true
      }
      }
    
    }else{
      console.log('else')
      this.showList=true
      this.showCostDetails=true
      this.showConvertBtn=true
      this.viewDashboard=true
      this.showReviseBtn=true
    
    
    
    
    }
  }


}
