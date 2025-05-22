import { Component, OnInit, NgZone, ViewChild, ElementRef, ViewEncapsulation,HostListener  } from '@angular/core';
import { Select2OptionData, Select2TemplateFunction } from 'ng2-select2';
import { CountryService } from '../../services/countryList.service';
//  import * as moment from 'moment-timezone';
import { FormGroup,FormArray, FormBuilder,FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { OrganizationService } from '../../services/organization.service';
import {ChangeDetectorRef } from '@angular/core';
import { patternValidator } from '../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../services/employee.service';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import { array } from '@amcharts/amcharts4/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditSettingsModel,GridComponent, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';

// import  * as moment  from 'moment';
// import 'moment-timezone';

let brList=[]
let weekdata1=[  {
  id: 'Monday',
  text: 'Monday'
},
{
  id: 'Tuesday',
  text: 'Tuesday'
},

{
  id: 'Wednesday',
  text: 'Wednesday'
},
{
  id: 'Thursday',
  text: 'Thursday'
},
{
  id: 'Friday',
  text: 'Friday'
},    {
  id: 'Saturday',
  text: 'Saturday'
},
{
  id: 'Sunday',
  text: 'Sunday'
}]
let weekdata=[  {
  id: 'Monday',
  text: 'Monday',
  from:'9:00 AM',
  to:'7:00 PM',
  enable:true
},
{
  id: 'Tuesday',
  text: 'Tuesday',
  from:'9:00 AM',
  to:'7:00 PM',
  enable:true

},

{
  id: 'Wednesday',
  text: 'Wednesday',
  from:'9:00 AM',
  to:'7:00 PM',
  enable:true

},
{
  id: 'Thursday',
  text: 'Thursday',
  from:'9:00 AM',
  to:'1:00 PM',
  enable:true

},
{
  id: 'Friday',
  text: 'Friday',
  from:'9:00 AM',
  to:'7:00 PM',
  enable:true,


},    {
  id: 'Saturday',
  text: 'Saturday',
  from:'9:00 AM',
  to:'7:00 PM',
  enable:true

},
{
  id: 'Sunday',
  text: 'Sunday',
  from:'9:00 AM',
  to:'7:00 PM',
  enable:true

}]
@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.scss'],
  providers: [CountryService,OrganizationService],
  encapsulation: ViewEncapsulation.None

})
export class OrganizationProfileComponent implements OnInit {
  orgProfileForm: FormGroup;
  formSubmitted: boolean;
  orgProfileFormSubmit: boolean;
  public editable=false;
public customMaskChar: Object = { P: 'P,A,p,a', M: 'M,m'};
public georadius;
circleRadius=100;
  nearbyAddress="";
  nearbyBrAddress="";
  disableAddBranch=true;
  nearbyPlaces: google.maps.places.PlaceResult[];
  changed_address: string;
  public form: FormGroup;
public contactList: FormArray;
public dateFormat: Array<Select2OptionData>;
public parentOrg=true;
public disableAddOrg=true;
public weekend:any=[];
public data: any;
public geofenceChecked=false;
geofenceValue='';
    //public pageSettings: Object;
    public selectionOptions: any;
   
    // public query:Query;
// public dateFormat=['dd-MMM-yy', 'yyyy-MM-dd', 'dd-MMMM'];

public fb:FormBuilder;
  dateFormatValue: any;
  dateFormatText: any;
  workHourValueText: any;
  startDayValueText: any;
  yearValueText: any;
  currencyValueText: any;
  countryValueTxt: any;
  showAddBranch=false;
  showBranchList=false;
  showBranchNearbyPlaces: boolean;
  branchDataSource=[];
  industryValueText=null;
  brchanged_address: string;
  brlatitude: number;
  brlongitude: number;
  public changedBrLocationData;
  public xpandStatus;
  changed_br_street_number: any;
  changed__br_route: any;
  changed__br_locality: any;
  changed__br_administrative_area_level_1: any;
  changed__br_administrative_area_level_2: any;
  changed__br_postal_code: any;
  changed__br_country: any;
  public disableSaveBranch=true;
  currentlatitude: number;
  currentlongitude: number;
  disableNxtSetUp=true;
  industryBranchValue: any;
  industryBranchValueText: any;
  drag: boolean=false;
  br_street_number: any;
  br_route: any;
  br_locality: any;
  br_administrative_area_level_1: any;
  br_administrative_area_level_2: any;
  br_postal_code: any;
  br_country: any;
  br_formatted_address: any;
  showIndustryRemarks: boolean=false;
  showBrIndustryRemarks: boolean=false;
  disableAddWeekend=true;
  minStartTime: any;
  maxEndTime: string;
  disableEndTime: boolean;
  startValChange: boolean;
  fromValue: string;
  toValue: string;
  fromTime: any;
  todateValue: any;
  days: FormArray;
  selectedrowindex: number[];
  selectedrecords: any;
  locValid: boolean=false;
  autoCheck: boolean=false;
  freqHourValue: any;
  freqHourValueText: any;
  workHourAfterValue: any;
  workHourAfterValueText: any;
  maskedValue='';
  screenShotData: { id: string; text: string; }[];
  screenshot: boolean=false;
  trackApp: boolean=false;
  screenShotValue: any;
  screenShotText: any;
  trackAppValue: any;
  trackAppText: any;
  geofence: boolean=false;
  locValue: any='';
  brgeofence: boolean;
  brgeofenceChecked: boolean=false;
  showparentOrg: boolean=true;
  // route: any;
  
  constructor(public countries:CountryService,public toastr:ToastrService,public router: Router ,
    private empService:EmployeeService,public profileService:OrganizationService,private spinner:NgxSpinnerService,
    private cdref: ChangeDetectorRef,public route:ActivatedRoute,private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
      window.onbeforeunload = (ev) => {
  
        // OR
   
       
   
       // finally return the message to browser api.
     
   }; 
   
     
   }
   @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    let id =this.profileService.getOrgID()
    
    //this.setOrgId(id);
 
    this.router.navigate(["/organizations"]);
    sessionStorage.setItem("editOrgId", id)

    this.profileService.setOrgID(id);
  }
  
  @HostListener('window:beforeunload') goToPage() {
    this.router.navigate(["/organizations"]);
    window.history.go(-1);
  }
   public paramId=this.route.snapshot.params.id;
   
   public countryData: Array<Select2OptionData>;
   public industryData: Array<Select2OptionData>;
   public timeZoneData: Array<Select2OptionData>;
   public startDayData=[  {
    id: 'Monday',
    text: 'Monday',
    from:'9:00 AM',
    to:'6:00 PM',
    enable:false
  },
  {
    id: 'Tuesday',
    text: 'Tuesday',
    from:'9:00 AM',
    to:'6:00 PM',
    enable:false
  
  },
  
  {
    id: 'Wednesday',
    text: 'Wednesday',
    from:'9:00 AM',
    to:'6:00 PM',
    enable:false
  
  },
  {
    id: 'Thursday',
    text: 'Thursday',
    from:'9:00 AM',
    to:'6:00 PM',
    enable:false
  
  },
  {
    id: 'Friday',
    text: 'Friday',
    from:'9:00 AM',
    to:'6:00 PM',
    enable:false,
  
  
  },    {
    id: 'Saturday',
    text: 'Saturday',
    from:'9:00 AM',
    to:'6:00 PM',
    enable:false
  
  },
  {
    id: 'Sunday',
    text: 'Sunday',
    from:'9:00 AM',
    to:'6:00 PM',
    enable:false
  
  }];
  public fromData=[{
    from:'9:00 AM'

  },{
    from:'10:00 AM'

  },{
    from:'11:00 AM'

  },{
    from:'12:00 AM'

  },{
    from:'13:00 AM'

  },{
    from:'14:00 AM'

  },{
    from:'9:00 AM'

  }]
   public workHoursData: Array<Select2OptionData>;
   public freqHoursData: Array<Select2OptionData>;
   
   public currencyData: Array<Select2OptionData>;
   public yearData: Array<Select2OptionData>;
   

   public options: Select2Options;
   public multioptions: Select2Options;
   public countryValue:any;
  industryValue='';
   public zoneValue:any;
   public url:any;
   public yearValue:any;
   startDayValue='';
   public workHourValue:any;
   public currencyValue:any;
   public changedYear:any;
  //  public changedStartDay:any;
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
   public editSettings: EditSettingsModel;
   fieldArray: Array<any> = [
   
    
  ];
  newAttribute: any = {};

  firstField = true;
  firstFieldName = 'First Item name';
  isEditItems: boolean;

   title: string = 'AGM project';
   latitude: number;
   longitude: number;
   zoom: number;
   address: string;
   private geoCoder;
   displayedEmpColumns= ['index','Branch', 'Type', 'Address','Action'];

   @ViewChild('search',{ read: ElementRef , static: false })
    searchElementRef: ElementRef
    @ViewChild('brsearch',{ read: ElementRef ,  static: false })
    brsearchElementRef: ElementRef;
    @ViewChild('grid',{   static: false })
    grid;
    
   
    
 
    // @ViewChild(AgmMap, { static: true })
    // public selectedAddress: PlaceResult;

    georadiuschange(event:any) {
      console.log('event',event.target.value)
      this.georadius=parseInt(event.target.value);

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
 public AddBranch(){
   this.showAddBranch=!this.showAddBranch;
  
  this.showBranchList=true;
  this.brgeofenceChecked=false;
  this.orgProfileForm.patchValue({
      'is_br_restrict':false
    }
  )

 }
 public AddWeekend(){
 let data= {
    "id": null,
    "org_id":this.editable?this.profileService.getOrgID():null,
    "offworkdays": this.startDayValueText,
    "start_time": this.orgProfileForm.get('startTime').value?this.orgProfileForm.get('startTime').value:null,
    "end_time":this.orgProfileForm.get('endTime').value?this.orgProfileForm.get('endTime').value:null,
   
  }
  
  this.weekend.push(data);
  this.startDayValue='';
   this.fromValue='';
  this.toValue='';
  this.orgProfileForm.patchValue({
    startTime:'',
    endTime:''

  })
  this.startDayValueText='';

  
 }
public inlineEdit(i){
 
 this.startDayData.forEach(element => {
   
 });
      this.startDayData[i].enable=false
    
 
}
public saveEdit(i){
  
       this.startDayData[i].enable=true;
this.startDayData[i].from=this.fromTime;
this.startDayData[i].to=this.todateValue;
// this.orgProfileForm.patchValue({
//   startTime:'',
//   endTime:''
// })
     
  
 }
 public selectedOption(e,option){
  const results:any=[]
   if(e.srcElement.checked==true){
    let data= {
      "id": null,
      "org_id":this.editable?this.profileService.getOrgID():null,
      "day_name": option.text,
      "from_time": option.from?option.from:null,
      "to_time": option.to?option.to:null,
      "is_off":option.from==null?true:false,
      
     
    }
    this.weekend.push(data);
  }
    const map = new Map();
   
     

    
    }
 public onCheckChange(e,i){
  
  
  if(e.srcElement.checked){
    //  this.startDayData[i].enable=false;
    this.startDayData[i].from=null;
    this.startDayData[i].to=null;
  this.grid.refresh();

    this.startDayData[i].enable=true;



  }else{
    this.startDayData[i].from='9:00 AM';
    this.startDayData[i].to='7:00 PM';
  this.grid.refresh();

    this.startDayData[i].enable=false;


  }

  
}
 addFieldValue(index) {
  if (this.fieldArray.length <= 2) {
    this.fieldArray.push(this.newAttribute);
    this.newAttribute = {};
  } else {

  }
}

deleteFieldValue(index) {
  this.fieldArray.splice(index, 1);
}

onEditCloseItems() {
  this.isEditItems = !this.isEditItems;
}
 createContact(): FormGroup {
  return this.fb.group({
    type: ['email', Validators.compose([Validators.required])],
    name: [null, Validators.compose([Validators.required])],
    value: [null, Validators.compose([Validators.required, Validators.email])]
  });
}
 public delete(){
   this.url = null;
 }
  //  public tz=moment.tz.names();

public nextTab(id){

// var href = $(this).attr('href').substring(1); 
//alert(href); 

// $(this).removeClass('active'); 
// $('.tab-pane[id="' + id + '"]').removeClass('active')
}
public changedCountry(e: any): void {
  this.countryValue= e.value;
  // this.countryValueTxt= e.data[0].text;
  if(e.data[0]){
    this.countryValueTxt= e.data[0].text;

  }
}
public changedIndustry(e: any): void {
  


   this.industryValue= e.value;
   //this.industryValueText=e.data[0].text
   if(e.data[0]){
    this.industryValueText= e.data[0].text;
    //this.disableNxtSetUp=false;

  }
  if(e.data[0] && e.data[0].text=="Other"){
    this.showIndustryRemarks=true;
  }else{
    this.showIndustryRemarks=false;

  }
  
}
public changedBranchIndustry(e: any): void {
  


   this.industryBranchValue= e.value;
   //this.industryValueText=e.data[0].text
   if(e.data[0]){
    this.industryBranchValueText= e.data[0].text;
    //this.disableNxtSetUp=false;

  }
  if(e.data[0].text=="Other"){
    this.showBrIndustryRemarks=true;
    //this.disableNxtSetUp=false;

  }else{
    this.showBrIndustryRemarks=false;

  }
  
}
public changedStartDay(e: any): void {
  


  this.startDayValue= e.value;
  this.disableAddWeekend=false;
  if(e.data[0]){
    this.startDayValueText= e.data[0].text;

  }



}
public startTimeChanged(index,txt){
  
  this.disableEndTime=false;
  
  this.days.get('txt').valueChanges.subscribe(() => {
    // fires when the input value has actually changed
    // if(this.orgProfileForm.get('startTime').value!=''){
    //   this.startValChange=true;
    // }
    // let startTime=this.orgProfileForm.get('startTime').value;
    // this.maxEndTime=startTime;
    // this.fromTime=this.orgProfileForm.get('startTime').value;
    // 
    //this.orgProfileForm.get('endTime').enable()

    //

    // this.startDayData[index].from=this.orgProfileForm.get('days').value[index].controls('index').value;



});
/**
 * name
 */
// this.startDayData[index].from=this.orgProfileForm.get('days').value[index].controls('index').value;


 


}
public endTimeChanged(index){
  this.orgProfileForm.get('endTime').valueChanges.subscribe(() => {
    // fires when the input value has actually changed
    if(this.orgProfileForm.get('endTime').value!=''){
      this.startValChange=true;
    }
    let startTime=this.orgProfileForm.get('endTime').value;
    this.maxEndTime=startTime;
    this.todateValue=this.orgProfileForm.get('endTime').value;
    
    //this.orgProfileForm.get('endTime').enable()



this.startDayData[index].to=this.orgProfileForm.get('endTime').value;



});







/**
 * name
 */

 


}
public changedDateFormat(e: any): void {
  


  this.dateFormatValue= e.value;
  // this.dateFormatText=e.data[0].text;
  if(e.data[0]){
    this.dateFormatText= e.data[0].text;

  }


}
public changedWorkHrs(e: any): void {
  


  this.workHourValue= e.value;
  // this.workHourValueText=e.data[0].text;
  if(e.data[0]){
    this.workHourValueText= e.data[0].text;

  }


}
public changedHrsFreq(e: any): void {
  


  this.freqHourValue= e.value;
 
  // this.workHourValueText=e.data[0].text;
  if(e.data[0]){
    this.freqHourValueText= e.data[0].text;

  }

}
public changedHrsScreenshot(e: any): void {
  


  this.screenShotValue= e.value;
  // this.workHourValueText=e.data[0].text;
  if(e.data[0]){
    this.screenShotText= e.data[0].text;

  }

}
public changedTrackAppHrs(e: any): void {
  


  this.trackAppValue= e.value;
  // this.workHourValueText=e.data[0].text;
  if(e.data[0]){
    this.trackAppText= e.data[0].text;

  }

}
public changedTrackTime(e: any): void {
  


  this.screenShotValue= e.value;
  // this.workHourValueText=e.data[0].text;
  if(e.data[0]){
    this.screenShotText= e.data[0].text;

  }

}

public changedWorkHrsAfter(e: any): void {
  


  this.workHourAfterValue= e.value;
  // this.workHourValueText=e.data[0].text;
  if(e.data[0]){
    this.workHourAfterValueText= e.data[0].text;

  }


}

public changedCurrency(e: any): void {
  


  this.currencyValue= e.value;
  if(e.data[0]){
    this.currencyValueText=e.data[0].text;

  }




}
public changedTimeZone(e: any): void {
  this.zoneValue= e.value;
 
}
public changedYears(e: any): void {
this.yearValue=e.value;
if(e.data[0]){

this.yearValueText=e.data[0].text;
}
}
public profileSubmit() {
  var results=[]
 this.locValue=this.searchElementRef.nativeElement.value;
  for (var i = 0; i < this.startDayData.length; i++) {
  
  results.push({
    "id": null,
    "org_id":this.editable?this.profileService.getOrgID():null,
    "day_name": this.startDayData[i].text,
    "from_time": this.startDayData[i].from?this.startDayData[i].from:null,
    "to_time":this.startDayData[i].to?this.startDayData[i].to:null,
    "is_off":this.startDayData[i].from?true:false

  });
  
  }
 this.weekend=results;
  
  this.editable=false;
  // let loginUrl=this.utilService.getHostURL()+'Account/login';
let adr1=this.orgProfileForm.get('street_1').value,
    adr2=this.orgProfileForm.get('street_2').value,
    city=this.orgProfileForm.get('city').value,
    contact_name=this.orgProfileForm.get('contact_name').value,
    contact_type=this.orgProfileForm.get('contact_type').value,
    summary=this.orgProfileForm.get('summary').value;
   
    let user_info:object;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));
    

}
if(this.branchDataSource.length!=0){
  this.branchDataSource.forEach(element => {
    element['country_id']=this.countryValue,
    element['time_zone_id']=this.zoneValue
  });
}
let subscription:object;

 
 if(localStorage.getItem('subscription')){
  subscription= JSON.parse(localStorage.getItem('subscription'));
  

}
 let postData={
     
  org_name: this.orgProfileForm.get('org_Name').value ,
  user_id: localStorage.getItem('user_id'),
  
  ...this.industryValue && {type: this.industryValue}, 
  ...this.countryValue && {country_id: this.countryValue},  
  ...adr1 && {adr1: adr1},
 ...adr2 && { adr2:adr2},
 ...city && { city: city},
  ...contact_name && {primary_cont_name: contact_name},
 ...contact_type && {primary_cont_type:contact_type},
  ...this.zoneValue && {time_zone_id: this.zoneValue},
  ...this.url && {img_url:this.url},
  ...summary && {summary:summary},
  "other_type": this.showIndustryRemarks?this.orgProfileForm.get('industryType').value:null,
  "createdby": user_info['full_name'],

  "EntityLocationViewModel": {
    "geo_address":this.searchElementRef.nativeElement.value,
    "formatted_address": this.changed_address?this.changed_address:this.formatted_address,
        "lat": this.latitude?JSON.stringify(this.latitude):"",
        "lang": this.longitude?JSON.stringify(this.longitude):"",
        "street_number": this.changed_street_number?this.changed_street_number:this.street_number,
        "route": this.changed_route,
        "locality": this.changed_locality?this.changed_locality:this.locality,
        "administrative_area_level_2": this.changed_administrative_area_level_2?this.changed_administrative_area_level_2:this.administrative_area_level_2,
        "administrative_area_level_1": this.changed_administrative_area_level_1?this.changed_administrative_area_level_1:this.administrative_area_level_1,
        "postal_code": this.changed_postal_code?this.changed_postal_code:this.postal_code,
        "country":  this.changed_country?this.changed_country:this.country,
        "city": this.changed_administrative_area_level_1?this.changed_administrative_area_level_1:this.administrative_area_level_1,

  },
  "OrganizationSetup": {
    "country": this.countryValueTxt=='Select'|| this.countryValueTxt==undefined?null:this.countryValueTxt,
    "fiscal_year": this.yearValueText=='Select'|| this.yearValueText==undefined?null:this.yearValueText,
    //"start_of_week": this.startDayValueText=='Select'|| this.startDayValueText==undefined?null:this.startDayValue.toString(),
    "working_hrs": this.workHourValueText=='Select'|| this.workHourValueText==undefined?null:this.workHourValueText,
    "date_format": this.dateFormatText=='Select'|| this.dateFormatText==undefined?null:this.dateFormatText,
    "currency": this.currencyValueText=='Select'|| this.currencyValueText==undefined?null:this.currencyValueText,
    "time_zome": this.zoneValue==''|| this.zoneValue==undefined?null:this.zoneValue,
    "is_location_validation": this.locValid,
    "notify_before_working_hours":  this.freqHourValueText=='Select'|| this.freqHourValueText==undefined?null:this.freqHourValue,
    "is_autocheckout_allowed": this.autoCheck,
    "notify_after_working_hours":this.workHourAfterValueText=='Select'|| this.workHourAfterValueText==undefined?null:this.workHourAfterValueText,
    "weekends": this.weekend,
     "max_days_expiry":this.orgProfileForm.get('max_days_expiry').value,
    // "screenshot_time":this.maskedValue!=''?this.maskedValue:null,
    "is_screenshot": this.screenshot,
    "screenshot_time": this.screenShotText=='Select'|| this.screenShotText==undefined?null:this.screenShotText,
    "is_track_app": this.trackApp,
    "track_app_time": this.trackAppText=='Select'|| this.trackAppText==undefined?null:this.trackAppText,
  },
  "OrganizationBranchViewModel":this.showBranchList?this.branchDataSource:null,
  "is_restrict_checkin":  this.orgProfileForm.get('is_restrict').value,
  "radius": this.orgProfileForm.get('orgRadius').value==''?null:this.orgProfileForm.get('orgRadius').value
 
   
  }
  
  this.orgProfileFormSubmit = true;
  console.log('postData',postData);
  if ((this.orgProfileForm.get('org_Name').value !== '') && (this.orgProfileForm.get('is_restrict').value==true && this.orgProfileForm.get('orgRadius').value!='') && (this.industryValueText!='Select' ||  this.industryValueText!=null) && (this.searchElementRef.nativeElement.value!='')) {
this.spinner.show();
    
    return this.profileService.AddOrgProfile(postData).subscribe(
        (data:any)  => {
          if(data.status==200){
            this.spinner.hide();

            this.router.navigate(["/organizations"]);
            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });
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
  
  public getTZList(){
    
  
    return this.countries.getTZList().subscribe(
      (data:any)  => {
        // let dataObj = JSON.parse(data['token']);
      
      
  var results=[{ id: ' ', text: 'Select' }]
  
        // let dataObj = JSON.parse(data['token']);
      // 
    
  for (var i = 0; i < data.length; i++) {
  // logik to create new items
  
  results.push({
      "id": data[i].id,
      "text": (data[i].timezone_location).concat('',data[i].gmt)
  });
  
  }
  
      
  this.timeZoneData =results;
  
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
    
public onEditSubmit(){
  var results=[]
 
  for (var i = 0; i < this.startDayData.length; i++) {
  
  results.push({
    "id": null,
    "org_id":this.editable?this.profileService.getOrgID():null,
    "day_name": this.startDayData[i].text,
    "from_time": this.startDayData[i].from?this.startDayData[i].from:null,
    "to_time":this.startDayData[i].to?this.startDayData[i].to:null,
    "is_off":this.startDayData[i].enable
  });
  
  }
 this.weekend=results;
  
 
this.spinner.show();

  let adr1=this.orgProfileForm.get('street_1').value,
    adr2=this.orgProfileForm.get('street_2').value,
    city=this.orgProfileForm.get('city').value,
    contact_name=this.orgProfileForm.get('contact_name').value,
    contact_type=this.orgProfileForm.get('contact_type').value,
    summary=this.orgProfileForm.get('summary').value;
    let user_info:object;
    if(localStorage.getItem('user_info')){
        user_info= JSON.parse(localStorage.getItem('user_info'));
        
    
    }

  let postData={
    org_id:this.profileService.getOrgID(),
    user_id:localStorage.getItem('user_id'),
    org_name: this.orgProfileForm.get('org_Name').value ,
    ...this.industryValue && {type: this.industryValue}, 
    "other_type": this.showIndustryRemarks?this.orgProfileForm.get('industryType').value:null,

    ...this.countryValue && {country_id: this.countryValue},  
    ...adr1 && {adr1: adr1},
   ...adr2 && { adr2:adr2},
   ...city && { city: city},
    ...contact_name && {primary_cont_name: contact_name},
   ...contact_type && {primary_cont_type:contact_type},
    ...this.zoneValue && {time_zone_id: this.zoneValue},
    ...this.url && {img_url:this.url},
    ...summary && {summary:summary},
    "EntityLocationViewModel": {
    "geo_address":this.searchElementRef.nativeElement.value,

      "formatted_address": this.changed_address?this.changed_address:this.formatted_address,
          "lat": this.latitude?JSON.stringify(this.latitude):"",
          "lang": this.longitude?JSON.stringify(this.longitude):"",
          "street_number": this.changed_street_number?this.changed_street_number:this.street_number,
          "route": this.changed_route,
          "locality": this.changed_locality?this.changed_locality:this.locality,
          "administrative_area_level_2": this.changed_administrative_area_level_2?this.changed_administrative_area_level_2:this.administrative_area_level_2,
          "administrative_area_level_1": this.changed_administrative_area_level_1?this.changed_administrative_area_level_1:this.administrative_area_level_1,
          "postal_code": this.changed_postal_code?this.changed_postal_code:this.postal_code,
          "country":  this.changed_country?this.changed_country:this.country,
          "city": this.changed_administrative_area_level_1?this.changed_administrative_area_level_1:this.administrative_area_level_1,
  
    },
    "OrganizationSetup": {
      "country": this.countryValueTxt=='Select'|| this.countryValueTxt==undefined?null:this.countryValueTxt,
      "fiscal_year": this.yearValueText=='Select'|| this.yearValueText==undefined?null:this.yearValueText,
     // "start_of_week": this.startDayValueText=='Select'|| this.startDayValueText==undefined?null:this.startDayValue.toString(),
      "working_hrs": this.workHourValueText=='Select'|| this.workHourValueText==undefined?null:this.workHourValueText,
      "date_format": this.dateFormatText=='Select'|| this.dateFormatText==undefined?null:this.dateFormatText,
      "currency": this.currencyValueText=='Select'|| this.currencyValueText==undefined?null:this.currencyValueText,
      "time_zome": this.zoneValue==''|| this.zoneValue==undefined?null:this.zoneValue,
      "is_location_validation": this.locValid,
      "notify_before_working_hours":  this.freqHourValueText=='Select'|| this.freqHourValueText==undefined?null:this.freqHourValue,
      "is_autocheckout_allowed": this.autoCheck,
      "notify_after_working_hours":this.workHourAfterValueText=='Select'|| this.workHourAfterValueText==undefined?null:this.workHourAfterValueText,
      "weekends":this.weekend, 
      "is_screenshot": this.screenshot,
      "screenshot_time": this.screenShotText=='Select'|| this.screenShotText==undefined?null:this.screenShotText,
      "is_track_app": this.trackApp,
      "track_app_time": this.trackAppText=='Select'|| this.trackAppText==undefined?null:this.trackAppText,
      "max_days_expiry":this.orgProfileForm.get('max_days_expiry').value,
    },
    "OrganizationBranchViewModel":this.showBranchList?this.branchDataSource:null,
    "is_restrict_checkin":  this.orgProfileForm.get('is_restrict').value,
    "radius": this.orgProfileForm.get('orgRadius').value
     
    }
      
      
     
      if (this.orgProfileForm.get('org_Name').value !== '') {
      
       
          return this.profileService.updateOrg(postData).subscribe(
            (data:any)  => {
            
            
            if(data.status==200){
              this.spinner.hide();

              this.router.navigate(["/organizations"]);
              this.toastr.success(data['desc'], undefined,{
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
            // this.router.navigate(["/organizations"]);

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
    this.editable=false;
  }
  public nearByPlaces(){
    if( this.profileService.getOrgID()==''){
     // this.setCurrentLocation();

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
  focusBrFunction (){
    if(this.brsearchElementRef.nativeElement.value==''){
      this.showBranchNearbyPlaces=true;
  
    }else{
      this.showBranchNearbyPlaces=false;
  
    }
   this.mapsAPILoader.load().then(() => {
    this.nearByPlaces();
   });
  }
  keyupBr(event){
     this.showBranchNearbyPlaces=false;
  
    if(event.keyCode == 8 && this.brsearchElementRef.nativeElement.value=='' ){
      this.showBranchNearbyPlaces=true;
   
        this.disableSaveBranch=true;

      // this.searchLocVal='';
    
      this.mapsAPILoader.load().then(() => {
        this.nearByPlaces();
       });
    
    }
    
  else{
    this.disableSaveBranch=false;
    if((this.orgProfileForm.get('is_br_restrict').value==true && this.orgProfileForm.get('brRadius').value!='')){
      this.disableSaveBranch=false;

    }else if((this.orgProfileForm.get('is_br_restrict').value==true && this.orgProfileForm.get('brRadius').value=='')){
      this.disableSaveBranch=true;

    }

  }}
  
  clickBrFunction (){
     if(this.brsearchElementRef.nativeElement.value==''){
      this.showBranchNearbyPlaces=true;
  
    }else{
      this.showBranchNearbyPlaces=false;
  
    }
   this.mapsAPILoader.load().then(() => {
    this.nearByPlaces();
   });
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
  
    if(event.keyCode == 8 && this.searchElementRef.nativeElement.value=='' ){
      this.showNearbyPlaces=true;
      // this.searchLocVal='';
      this.disableAddBranch=false;
          this.disableNxtSetUp=true;

      this.mapsAPILoader.load().then(() => {
        this.nearByPlaces();
       });
    }else{
      this.disableAddBranch=false;
    }
   
  
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
  public goBack(){
    window.history.go(-1);
  }
  selectBrNearBy(nearbyPlace){
    this.nearbyBrAddress=nearbyPlace.name;
    // this.searchLocVal=nearbyPlace.name;
    this.address=nearbyPlace.name;
    this.disableSaveBranch=false;
    this.disableNxtSetUp=false;
    // this.changed_address=nearbyPlace.name;
    // this.web_site = place.website;
    // this.name = place.name;

    // this.getChangedMatchedTypes()
    this.ngZone.run(() => {
      this.latitude = nearbyPlace.geometry.location.lat();
      this.longitude = nearbyPlace.geometry.location.lng();
      this.showBranchNearbyPlaces=false;
      this.zoom=12;
    })
    

    //set latitude, longitude and zoom
  

  }
  saveBrAddress(){
    let adr1=this.orgProfileForm.get('street_1').value,
    adr2=this.orgProfileForm.get('street_2').value,
    city=this.orgProfileForm.get('city').value,
    contact_name=this.orgProfileForm.get('contact_name').value,
    contact_type=this.orgProfileForm.get('contact_type').value,
    summary=this.orgProfileForm.get('summary').value;
   
    let user_info:object;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));
    

}
  let data={
    // brName:this.orgProfileForm.get('brName').value,
    // brType:this.industryValueText,
    // brAddress:this.brsearchElementRef.nativeElement.value,
    "parent_org_id": this.editable?this.profileService.getOrgID():null,
    "org_id": null,
    "user_id": localStorage.getItem('user_id'),
    "org_name": this.orgProfileForm.get('brName').value,
    ...this.industryBranchValue && {type: this.industryBranchValue}, 
"other_type": this.showBrIndustryRemarks?this.orgProfileForm.get('brindustryType').value:null,

...this.countryValue && {country_id: this.countryValue},  
...adr1 && {adr1: null},
...adr2 && { adr2:null},
...city && { city: null},
...contact_name && {primary_cont_name: contact_name},
...contact_type && {primary_cont_type:contact_type},
...this.zoneValue && {time_zone_id: this.zoneValue},
...this.url && {img_url:null},
...summary && {summary:null},

    "createdby": user_info['full_name'],
  "EntityLocationViewModel": {
    "geo_address": this.brsearchElementRef.nativeElement.value,

    "formatted_address": this.brchanged_address?this.brchanged_address:this.br_formatted_address,
        "lat": this.brlatitude?JSON.stringify(this.brlatitude):"",
        "lang": this.brlongitude?JSON.stringify(this.brlongitude):"",
        "street_number": this.changed_br_street_number?this.changed_br_street_number:this.br_street_number,
        "route": this.changed__br_route?this.changed__br_route:this.br_route,
        "locality": this.changed__br_locality?this.br_locality:this.br_locality,
        "administrative_area_level_1": this.changed__br_administrative_area_level_1?this.changed__br_administrative_area_level_1:this.br_administrative_area_level_1,
        "administrative_area_level_2": this.changed__br_administrative_area_level_2?this.changed__br_administrative_area_level_2:this.br_administrative_area_level_2,
        "postal_code": this.changed__br_postal_code?this.changed__br_postal_code:this.br_postal_code,
        "country":  this.changed__br_country?this.changed__br_country:this.br_country,
        "city": this.changed__br_administrative_area_level_1?this.changed__br_administrative_area_level_1:this.br_administrative_area_level_1,

  },
  "is_restrict_checkin": this.orgProfileForm.get('is_br_restrict').value,
  "radius": this.orgProfileForm.get('brRadius').value
  } 
  console.log('brRadius',data)
  brList.push(data)
  
  this.showAddBranch=false;
  this.branchDataSource=brList;
  this.orgProfileForm.patchValue({
    brName:'',
    brRadius:'',
    is_br_restrict:''
  })
  this.brgeofenceChecked=false;
  this.industryBranchValue='';
  this.brsearchElementRef.nativeElement.value='';
  this.disableSaveBranch=true;
  }
  brDelete(index){
    this.branchDataSource.splice(index,1)
  }
  offDayDelete(index){
    this.weekend.splice(index,1)
  }
  selectNearBy(nearbyPlace){
    this.nearbyAddress=nearbyPlace.name;
    // this.searchLocVal=nearbyPlace.name;
    this.address=nearbyPlace.name;
    this.disableAddBranch=false;
    this.disableNxtSetUp=false;
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
  public  getAllIndustryType(){
    this.empService.getAllIndustryType().subscribe(
      
      (data:any) => {
  
        var results=[{ id: '  ', text: 'Select' }]
  
        // let dataObj = JSON.parse(data['token']);
      // 
    
  for (var i = 0; i < data.length; i++) {
  // logik to create new items
  
  results.push({
      "id": data[i].id,
      "text": data[i].industry_type_name
  });
  
  }
  
      
  this.industryData =results;
    
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
      public goToOrgList(){
        this.router.navigate(["/organizations"]);
      }
   
     
      public locationSetUp(){
        
        $('#kt_user_edit_tab_3').trigger('click')
        this.mapsAPILoader.load().then(() => {
          //this.nearByPlaces();
          if(this.searchElementRef.nativeElement.value!=''){
            this.disableAddBranch=false;
            this.disableNxtSetUp=false;
          }else{
            this.disableNxtSetUp=true;
          }
 if(this.editable==false && this.drag==false){
  this.geoCoder = new google.maps.Geocoder;

          this.setCurrentLocation();

 }
     
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);

            autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            
             let place: google.maps.places.PlaceResult = autocomplete.getPlace();
           
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.address = place.formatted_address;
            this.disableNxtSetUp=false;

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

        this.mapsAPILoader.load().then(() => {
          //this.nearByPlaces();
      if(this.editable==false  && this.drag==false){
        this.geoCoder = new google.maps.Geocoder;

          this.setCurrentLocation();
      
      }
      
      
        let branchAutocomplete = new google.maps.places.Autocomplete(this.brsearchElementRef.nativeElement);
      
        branchAutocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
        //get the place result
        
         let brplace: google.maps.places.PlaceResult = branchAutocomplete.getPlace();
        
        if (brplace.geometry === undefined || brplace.geometry === null) {
          return;
        }
        this.address = brplace.formatted_address;
        
         this.changedBrLocationData=brplace;
         this.getBrChangedMatchedTypes();
        
         this.brchanged_address=brplace.formatted_address;
        // this.web_site = place.website;
        // this.name = place.name;
        
        
        //set latitude, longitude and zoom
        this.brlatitude = brplace.geometry.location.lat();
        this.brlongitude = brplace.geometry.location.lng();
        this.zoom = 12;
        
        // this.showNearbyPlaces=false;
       
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
    public getBrChangedMatchedTypes() {
      let address_components
      if(this.changedBrLocationData.length!=0){
         address_components=this.changedBrLocationData['address_components']
  
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
  
  
  
          
       this.changed_br_street_number = address_components[i]['short_name'];
  
  
        }
        if (types[j] === 'route') {
          this.changed__br_route =  address_components[i]['long_name'];
        } 
        // if (types[j] === 'formatted_address') {
        //   this.formatted_address =  address_components[i]['long_name'];
        // }
        // if (types[j] === 'neighborhood') {
        //   this.changed_street_number =  address_components[i]['long_name'];
        // }
        if (types[j] === 'locality') {
          this.changed__br_locality =  address_components[i]['long_name'];
        }
        if (types[j] === 'administrative_area_level_1') {
          this.changed__br_administrative_area_level_1 =  address_components[i]['long_name'];
        }
        if (types[j] === 'administrative_area_level_2') {
          this.changed__br_administrative_area_level_2 =  address_components[i]['long_name'];
        }
        if (types[j] === 'postal_code') {
          this.changed__br_postal_code =  address_components[i]['long_name'];
        }
        if (types[j] === 'country') {
          this.changed__br_country =  address_components[i]['long_name'];
        }
       
      }
    }
        
    
        // address_component = address_components[element];
    
       
  
   
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
    private setPredefinedLocation(lat,lang) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = lat;
          this.longitude = lang;
          this.zoom = 8;
          
          this.getAddress(lat,lang);
        
        });
      }
    }
    public onSearchChange(){
      
     }
     
  markerDragEnd($event: MouseEvent) {
    
if($event){
  if(this.showAddBranch==true){
    this.brlatitude = $event.coords.lat;
    this.brlongitude = $event.coords.lng;

  }
 
  this.drag=true

  this.getAddress($event.coords.lat, $event.coords.lng);
}
   
  }
    getAddress(latitude, longitude) {
      this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
        
        this.geoCodeData=results[2];
        
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;
            //  this.getMatchedTypes();
  
            this.address = results[0].formatted_address;
            if(this.drag==true){
             this.disableAddBranch=false;
             this.disableNxtSetUp=false;

            if(this.showAddBranch==true){
              this.getBrMatchedTypes();
              this.brsearchElementRef.nativeElement.value=results[0].formatted_address;
              this.br_formatted_address = results[2].formatted_address;
      this.disableSaveBranch=false;
      


            }else{
            this.searchElementRef.nativeElement.value=results[0].formatted_address;
            this.formatted_address = results[2].formatted_address;

            this.getMatchedTypes();

            }
            }
            
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
    public getBrMatchedTypes() {
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
  
  
  
          
       this.br_street_number = address_components[i]['short_name'];
  
  
        }
        if (types[j] === 'route') {
          this.br_route =  address_components[i]['long_name'];
        } 
        // if (types[j] === 'formatted_address') {
        //   this.formatted_address =  address_components[i]['long_name'];
        // }
        if (types[j] === 'neighborhood') {
          this.br_street_number =  address_components[i]['long_name'];
        }
        if (types[j] === 'locality') {
          this.br_locality =  address_components[i]['long_name'];
        }
        if (types[j] === 'administrative_area_level_1') {
          this.br_administrative_area_level_1 =  address_components[i]['long_name'];
        }
        if (types[j] === 'administrative_area_level_2') {
          this.br_administrative_area_level_2 =  address_components[i]['long_name'];
        }
        if (types[j] === 'postal_code') {
          this.br_postal_code =  address_components[i]['long_name'];
        }
        if (types[j] === 'country') {
          this.br_country =  address_components[i]['long_name'];
        }
       
      }
    }
        
    
        // address_component = address_components[element];
    
       
  
   
  }
  rowSelected(args: RowSelectEventArgs) {
    
    var results:any;
    
    // let dataObj = JSON.parse(data['token']);
  // 



     this.selectedrowindex = this.grid.getSelectedRowIndexes();  // Get the selected row indexes.
    //alert(selectedrowindex); // To alert the selected row indexes.

     this.selectedrecords = this.grid.getSelectedRecords(); 
     
      // Get the selected records.
    //  if(this.selectedrecords.length!=0){
    //   for (var i = 0; i < this.selectedrecords.length; i++) {
        
       
        
    //     }
    //   this.weekend =results;
  
    // }
    
      
        
}
public onLocValidChange(e){
  if(e.srcElement.checked){
    this.locValid=true;
  }else{
    this.locValid=false;


  }
  
}
public onAutoCheckOutChange(e){
  if(e.srcElement.checked){
    this.autoCheck=true;
    
    this.orgProfileForm.get('screenshot_time').value
  }else{
    this.autoCheck=false;


  }
  // this.addCurrentUser=!this.addCurrentUser;
  
}
public onScreenshotChange(e){
  if(e.srcElement.checked){
    this.screenshot=true;
  
  }else{
    this.screenshot=false;


  }
  // this.addCurrentUser=!this.addCurrentUser;
  
}
onGeoFenceChange(e){
  if(e.srcElement.checked){
    this.geofence=true;
    this.orgProfileForm.patchValue({
      'is_restrict':true
    }
  )
  }else{
    this.geofence=false;
    this.orgProfileForm.patchValue({
      'is_restrict':false,
      'orgRadius':''
    }
  )
// this.georadius='';
  }
  // this.addCurrentUser=!this.addCurrentUser;
  
}
onBrGeoFenceChange(e){
  if(e.srcElement.checked){
    this.brgeofenceChecked=true;
    this.orgProfileForm.patchValue({
      'is_br_restrict':true
    }
      )
  
  }else{
    this.brgeofenceChecked=false;
    this.orgProfileForm.patchValue({
      'is_br_restrict':false,
      'brRadius':''
    }
      )
// this.georadius=null;
  }
  // this.addCurrentUser=!this.addCurrentUser;
  
}
public onTrackAppChange(e){
  if(e.srcElement.checked){
    this.trackApp=true;
  
  }else{
    this.trackApp=false;


  }
  // this.addCurrentUser=!this.addCurrentUser;
  
}
onMaskTxtInputChange(e){
 
    
    if(e.value!=''){
      this.maskedValue=e.maskedValue;

    }else{

  this.maskedValue='';

    }
  
}
  public setOrgId (id){
    this.profileService.setOrgID(id);
}

  ngOnInit() {
    // this.industryValue='';
   // this.setCurrentLocation();
   window.onbeforeunload = (ev) => {
  
     // OR

    
   // this.router.navigate(["/organizations"]);


    // finally return the message to browser api.
  
}; 

   
      this.locationSetUp();
      // this.pageSettings = { pageCount: 5 };
     // this.selectionOptions = {persistSelection:true}
      this.editSettings = { allowEditing: true };
      
//       var results=[]
    
//     if(weekdata){
//       for (var i = 0; i < weekdata.length; i++) {
//         // logik to create new items
        
//         results.push({
        
//             id: weekdata[i].id,
//             text: weekdata[i].text,
//             from:weekdata[i].from,
//             to:weekdata[i].to,
//             enable:weekdata[i].enable

           
        
            
         
//         });
        
//         }

//     }
   

    
// this.startDayData =results;
  
  this.workHoursData=[

   {
    id: '',
    text: 'Select'
  },  {
    id: '5',
    text: '5'
  },
  {
    id: '6',
    text: '6'
  },
  
  {
    id: '7',
    text: '7'
  },
  {
    id: '8',
    text: '8'
  },
  {
    id: '8.5',
    text: '8.5'
  },

  {
    id: '9',
    text: '9'
  },
  {
    id: '10',
    text: '10'
  }]
  this.freqHoursData=[

    {
     id: '',
     text: 'Select'
   },  
   {
    id: '60',
    text: '1'
  },
  {
    id: '120',
    text: '2'
  }, {
    id: '180',
    text: '3'
  }, {
    id: '240',
    text: '4'
  }
 ]
   this.screenShotData=[

    {
     id: '',
     text: 'Select'
   },  
   {
    id: '5',
    text: '5'
  },
  {
    id: '15',
    text: '15'
  }, {
    id: '30',
    text: '30'
  }, {
    id: '45',
    text: '45'
  },{
     id: '60',
     text: '60'
   },
]
  this.dateFormat=[
    {
   id: '',
   text: 'Select'
 },  {
   id: '09-03-20',
   text: '09-03-20'
 },
 {
   id: '2020-03-09',
   text: '2020-03-09'
 },
 
 {
   id: '03/09/20',
   text: '03/09/20'
 },

]
  this.currencyData=[
    {
      id: '',
      text: 'Select'
    },  {
      id: 'AED',
      text: 'AED'
    },
    {
      id: 'USD',
      text: 'USD'
    },
    
    {
      id: 'INR',
      text: 'INR'
    },
    {
      id: 'EURO',
      text: 'EURO'
    },
  ]
  this.yearData=[
    {
      id: '',
      text: 'Select'
    },  {
      id: '1-January-2020 to 31-December-2020',
      text: '1-January-2020 to 31-December-2020'
    },
    {
      id: '1-April-2020 to 31-March-2020',
      text: '1-April-2020 to 31-March-2020'
    },
    
   
  ]
    // this.countryValue='',
    $('body').removeClass('modal-open');
$('.modal-backdrop').remove();
    let user_info:object;
    if(localStorage.getItem('user_info')){
        user_info= JSON.parse(localStorage.getItem('user_info'));
        
    
    }

   this.getCountryList();
   this.getTZList();
   this.getAllIndustryType();

    // 
    this.orgProfileForm = new FormGroup({
      avatar: new FormControl('', [Validators.required]),
      org_Name: new FormControl('', [Validators.required]),
      summary: new FormControl(''),

      //industry: new FormControl('', [Validators.required]),
      contact_name: new FormControl('', [Validators.required]),
      contact_type: new FormControl('', [Validators.required,patternValidator(/^(?:\d{10}|\w+@\w+\.\w{2,3})$/)]),

      street_1: new FormControl(''),
      street_2: new FormControl(''),
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      time_zone: new FormControl('', [Validators.required]),
      hours_frequency: new FormControl(''),
      hours_after_hours: new FormControl(''),
      brName:new FormControl(''),
      brRadius:new FormControl(''),
      industryType:new FormControl(''),
      brindustryType:new FormControl(''),
      startTime:new FormControl(''),
      endTime:new FormControl(''),
      Monday:new FormControl(''),
      Tuesday:new FormControl(''),
      Wednesday:new FormControl(''),
      Thursday:new FormControl(''),
      Friday:new FormControl(''),
      Saturday:new FormControl(''),
      Sunday:new FormControl(''),
      max_days_expiry:new FormControl(''),
      screenshot_time:new FormControl(''),
      orgRadius:new FormControl(''),
      is_br_restrict:new FormControl(''),
      is_restrict:new FormControl(''),
    //   days:new FormArray(weekdata1.map(x=>new FormGroup({
    //     Monday:new FormControl(x.text),
    //     symbol:new FormControl(x.symbol),
    // })
      days:new FormArray([
        
        //  new FormControl('Monday'),
         new FormControl(''),
      
          // new FormControl('Tuesday'),
          // new FormControl('Wednesday'),
          // new FormControl('Thursday'),
          // new FormControl('Friday'),
          // new FormControl('Saturday'),
          // new FormControl('Sunday'),
        // new FormControl('0'),
      
        // new FormControl('1'),
        // new FormControl('2'),
        // new FormControl('3'),
        // new FormControl('4'),
        // new FormControl('5'),
        // new FormControl('6'),
          
        ])
      // orgcity:new FormControl(''),
      // brcity:new FormControl('')
     

          
   });



this.orgProfileForm.get('endTime').disable();
 
  

   
 if( sessionStorage.getItem("editOrgId")){
  this.editable=true;
  this.getCountryList();
  this.getTZList();
  this.getAllIndustryType();



 let id =this.profileService.getOrgID()
 window.onbeforeunload = function() {
  // this.router.navigate(["/organizations"]);
 //this.setOrgId(id);
 
  
 }  

this.profileService.getOrgById(sessionStorage.getItem("editOrgId")).subscribe(
  (data:any)  => {

    this.orgProfileForm.patchValue({
      //avatar: data.img_url,
      org_Name:data.org_name,
      summary:data.summary,
      // industry: new FormControl('', [Validators.required]),
      contact_name: data.primary_cont_name,
      contact_type: data.primary_cont_type,

      street_1: data.adr1,
      street_2: data.adr2,
      city: data.city,

      industryType: data.other_type?data.other_type:'',
      max_days_expiry: data.organizationSetup.max_days_expiry?data.organizationSetup.max_days_expiry:''
          
    });
 this.countryValue=data.country_id;
 this.zoneValue=data.time_zone_id;
 this.industryValue=data.type;
  this.url=data.img_url;
 if(data.entityLocation){
  // this.searchElementRef.nativeElement.value=data.entityLocation.geo_address;
  this.nearbyAddress=data.entityLocation.geo_address;
  this.latitude=parseFloat(data.entityLocation.lat);
  this.longitude=parseFloat(data.entityLocation.lang);
  this.changed_street_number=data.entityLocation.street_number;
  this.changed_route=data.entityLocation.route;
  this.changed_locality=data.entityLocation.locality;
  this.changed_administrative_area_level_2=data.entityLocation.changed_administrative_area_level_2;
  this.changed_administrative_area_level_1=data.entityLocation.changed_administrative_area_level_1;
  this.changed_country=data.entityLocation.changed_country;
this.disableNxtSetUp=false;
  this.mapsAPILoader.load().then(() => {
    //this.nearByPlaces();
   this.geoCoder = new google.maps.Geocoder;

    this.setPredefinedLocation(this.latitude,this.longitude);
  })
  this.disableAddBranch=false;


  }
  if(data.parent_org_id!=null){
    this.parentOrg=false;
  }else{
    this.parentOrg=true;

  }
  if(data.organizationSetup){
    // this.searchElementRef.nativeElement.value=data.organizationSetup.formatted_address;
    this.dateFormatValue=data.organizationSetup.date_format?data.organizationSetup.date_format:'';
this.yearValue=data.organizationSetup.fiscal_year?data.organizationSetup.fiscal_year:'';
this.startDayValue=data.organizationSetup.start_of_week?data.organizationSetup.start_of_week:'';
this.workHourValue=data.organizationSetup.working_hrs?data.organizationSetup.working_hrs:'';
this.currencyValue=data.organizationSetup.currency?data.organizationSetup.currency:'';
this.freqHourValue=data.organizationSetup.notify_before_working_hours?data.organizationSetup.notify_before_working_hours:'';
this.workHourAfterValue=data.organizationSetup.notify_after_working_hours?data.organizationSetup.notify_after_working_hours:'';
this.screenShotValue=data.organizationSetup.screenshot_time?data.organizationSetup.screenshot_time:'';
this.trackAppValue=data.organizationSetup.track_app_time?data.organizationSetup.track_app_time:'';


this.dateFormatText=data.organizationSetup.date_format?data.organizationSetup.date_format:'';
this.yearValueText=data.organizationSetup.fiscal_year?data.organizationSetup.fiscal_year:'';
this.startDayValue=data.organizationSetup.start_of_week?data.organizationSetup.start_of_week.split(","):'';
this.workHourValueText=data.organizationSetup.working_hrs?data.organizationSetup.working_hrs:'';
// this.freqHourValueText=data.organizationSetup.hours_frequency?data.organizationSetup.hours_frequency:'';
this.workHourAfterValueText=data.organizationSetup.hours_after_working_hours?data.organizationSetup.hours_after_working_hours:'';
this.screenShotText=data.organizationSetup.screenshot_time?data.organizationSetup.screenshot_time:'';
this.trackAppText=data.organizationSetup.track_app_time?data.organizationSetup.track_app_time:'';



this.currencyValueText=data.organizationSetup.currency?data.organizationSetup.currency:'';
this.locValid=data.organizationSetup.is_location_validation;
this.autoCheck=data.organizationSetup.is_autocheckout_allowed;
this.screenshot=data.organizationSetup.is_screenshot;
this.trackApp=data.organizationSetup.is_track_app

   
var results=[]
 
for (var i = 0; i < data.organizationSetup.weekends.length; i++) {

results.push({
  "id":data.organizationSetup.weekends[i].day_name,
  "text": data.organizationSetup.weekends[i].day_name,
  "from": data.organizationSetup.weekends[i].from_time?data.organizationSetup.weekends[i].from_time:null,
  "to":data.organizationSetup.weekends[i].to_time?data.organizationSetup.weekends[i].to_time:null,
  "enable":data.organizationSetup.weekends[i].is_off

  
});

}
this.startDayData=results;
// this.orgProfileForm.patchValue({
 

//   hours_frequency: data.organizationSetup.hours_frequency?data.organizationSetup.hours_frequency:'',
//   hours_after_hours: data.organizationSetup.hours_after_hours?data.organizationSetup.hours_after_hours:'',

      
// });
    }
    if(data.entityLocationRadius!=null){
      if(data.entityLocationRadius['is_allowed']==true){
        this.geofenceChecked=true
        this.orgProfileForm.patchValue({
          'is_restrict':true
        })
      }else{
        this.geofenceChecked=false
        this.orgProfileForm.patchValue({
          'is_restrict':false
        })
      
      }
      this.orgProfileForm.patchValue({
        orgRadius:data.entityLocationRadius['radius']
      })
    }

    if(data.organizationBranchViewModel){
      this.showBranchList=true;
      brList=data.organizationBranchViewModel;
     this.branchDataSource=data.organizationBranchViewModel
    
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
if(sessionStorage.getItem("is_branch")=='true'){
this.showparentOrg=false;
}else{
  this.showparentOrg=true;

}
  

  

 }
 if(this.editable==false){  
  this.orgProfileForm.patchValue({
 avatar: '',
 org_Name:'',
 summary:'',
 // industry: new FormControl('', [Validators.required]),
 contact_name: user_info['full_name'],
 contact_type: user_info['workemail'],

 street_1: '',
 street_2: '',
 country: '',
 city: '',
 time_zone: '',


     
})
this.orgProfileForm.get('endTime').enable()
this.countryValue='';
this.zoneValue='';
this.industryValue='';
};


    this.options = {
      placeholder: "Select",
     width:"100%",
     allowClear: true,
   
  
    }
    this.multioptions = {
    multiple: true,

      placeholder: "Select",
     width:"100%",
   
  
    }
    
  

 $.getScript('assets/js/pages/custom/user/edit-user.js')


  }
  ngAfterViewInit(){
    this.locationSetUp();
 
  }
}
