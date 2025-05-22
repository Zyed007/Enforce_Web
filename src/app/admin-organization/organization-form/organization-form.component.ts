import { Component, OnInit } from '@angular/core';
import { Select2OptionData, Select2TemplateFunction } from 'ng2-select2';
import { CountryService } from '../../services/countryList.service';
//  import * as moment from 'moment-timezone';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { OrganizationService } from '../../services/organization.service';
import {ChangeDetectorRef } from '@angular/core';
import { patternValidator } from '../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss']
})

export class OrganizationFormComponent implements OnInit {
  orgProfileForm: FormGroup;
  formSubmitted: boolean;
  orgProfileFormSubmit: boolean;
  // route: any;

  constructor(public countries:CountryService,public profileService:OrganizationService,private cdref: ChangeDetectorRef,public route:ActivatedRoute) {
   }
   public paramId=this.route.snapshot.params.id;
   public countryData: Array<Select2OptionData>;
   public industryData: Array<Select2OptionData>;
   public timeZoneData: Array<Select2OptionData>;


   public options: Select2Options;
   public countryValue:any;
   public industryValue:string;
   public zoneValue:any;
   
   public url:any;
 public onSelectFile(event:any) {
   if (event.target.files && event.target.files[0]) {
     var reader = new FileReader();

     reader.readAsDataURL(event.target.files[0]); // read file as data url

     reader.onload = (event:any) => { // called once readAsDataURL is completed
      
       this.url = event.target.result;
     }
   }
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
 
}
public changedIndustry(e: any): void {
  


   this.industryValue= e.value;


 
}
public changedTimeZone(e: any): void {
  this.zoneValue= e.value;
 
}
public profileSubmit() {
  // let loginUrl=this.utilService.getHostURL()+'Account/login';
let adr1=this.orgProfileForm.get('street_1').value,
    adr2=this.orgProfileForm.get('street_2').value,
    city=this.orgProfileForm.get('city').value,
    contact_name=this.orgProfileForm.get('contact_name').value,
    contact_type=this.orgProfileForm.get('contact_type').value;

 
 let postData={
     
  org_name: this.orgProfileForm.get('org_Name').value ,
  ...this.industryValue && {type: this.industryValue}, 
  ...this.countryValue && {country: this.countryValue},  
  ...adr1 && {adr1: adr1},
 ...adr2 && { adr2:adr2},
 ...city && { city: city},
  ...contact_name && {primary_cont_name: contact_name},
 ...contact_type && {primary_cont_type:contact_type},
  ...this.zoneValue && {time_zone: this.zoneValue},
  ...this.url && {img_url:this.url}
   
  }
  
  // emailString=false;
  this.orgProfileFormSubmit = true;
//   if (this.orgProfileForm.get('org_Name').value !== '') {
//   
   
//       return this.profileService.AddOrgProfile(postData).subscribe(
//         data  => {
//           // let dataObj = JSON.parse(data['token']);
//         
        
//         // this.router.navigate(["/organizations"]);

//         },
//         error  => {
//           Swal.fire(
//             'Error!',
//             error,
//             'error'
//           ).then(
//             //used Arrow function here
//             (result)=> {
//                
//               //  this.router.navigate(['/dashboard']);
//             })
//         
        
//         }
        
//         )
    
    
 
// }



 
}
public org: any = {};
  ngOnInit() {
    // 
    this.orgProfileForm = new FormGroup({
      avatar: new FormControl('', [Validators.required]),
      org_name: new FormControl('', [Validators.required]),
      industry: new FormControl('', [Validators.required]),
      contact_name: new FormControl('', [Validators.required]),
      contact_type: new FormControl('', [Validators.required,patternValidator(/^(?:\d{10}|\w+@\w+\.\w{2,3})$/)]),

      adr1: new FormControl(''),
      adr2: new FormControl(''),
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      time_zone: new FormControl('', [Validators.required]),


          
   });
   
 
   
    this.countryValue='',
    this.industryValue= '',
    this.zoneValue= '',
    
    this.options = {
      placeholder: "Select",
     width:"100%",
     allowClear: true,
   
  
    }
    this.countryData = [
 
  
    { id: 'India', text: 'India' },
    { id: 'UAE', text: 'UAE' },
    { id: 'Turkey', text: 'Turkey' },
    { id: 'Thailand', text: 'Thailand' },]
  
    this.industryData=[
      { id: 'IT Services', text: 'IT Services' },
      { id: 'Software', text: 'Software' },
      { id: 'Hardware', text: 'Hardware' },
      { id: 'Technical Services', text: 'Technical Services' },
    ]
    this.timeZoneData=[
      {id:'International Date Line West',text:'(GMT-11:00) International Date Line West'},
      {id:'Midway Island',text:'(GMT-11:00) Midway Island'},
      {id:'Alaska',text:'(GMT-08:00) Alaska'},
      {id:'Arizona',text:'(GMT-07:00) Arizona'},
      {id:'Chihuahua',text:'(GMT-06:00) Chihuahua'},
      {id:'Central America',text:'(GMT-06:00) Central America'},
    ]
 $.getScript('assets/js/pages/custom/user/edit-user.js')
 let orgName={
   "fullName":this.paramId
 }
 this.profileService.getOrgById(orgName).subscribe(
  data  => {

    this.org =data;
    // let dataObj = JSON.parse(data['token']);
  
  
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

}