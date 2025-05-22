import { Component, OnInit } from '@angular/core';
 import moment = require('moment');
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { OrganizationService } from '../../services/organization.service';
import Swal from 'sweetalert2';
import { Select2OptionData, Select2TemplateFunction } from 'ng2-select2';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
//import moment from 'moment'


import { UserService } from '../../services/user.service';
import { SubscriptionService } from '../../services/subscription.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss'],
  providers: [LoginService]
})
export class OrganizationsComponent implements OnInit {
  public date=moment().format('dddd, D MMM YYYY');
 public orgListArr:any;
 public full_name: any;
  activityOptions: { placeholder: string; width: string; };
  public billingData: Array<Select2OptionData>;

  public BillingCycle: Array<Select2OptionData>;
  displayMessage: string;
  planData: any;
  selecteplanOptionValue: Select2Options;
  selectebillingOptionValue: Select2Options;
  planForm: FormGroup;
  totalPrice: number;
  showPrice=false;
  selectebillingOptionText: any;
  showPlanDetails=true;
  showCardDetails: boolean;
  paymentForm: FormGroup;
  addformSubmitted: any;
  editformSubmitted: any;
  planName: any;
  planPrice: any;
  user: any;
  end_date: string;
  start_date: string;
  diffInDays: number;
  firstDate: any;
  secondDate: any;
  pic: string;
  isYearly: boolean=false;

  showOwnerAccess = false;

  constructor( public router: Router, public utilService: LoginService,public toastr:ToastrService,private spinner:NgxSpinnerService, public orgService: OrganizationService,public userService:UserService,public subscribeService:SubscriptionService) { }
  public toDashboard(id){

      localStorage.setItem('org_id',id);
    this.router.navigate(["/dashboard"]);


  }
  setDefaultPic() {
    this.pic = "../../../assets/media/project-logos/3.png";
  }
  get f() { return this.paymentForm.controls; }
  public AddForm(){


    this.router.navigate(["/organization-profile"]);
    $('#org_modal').modal('hide');
    $("#org_modal").modal({backdrop: false});

  }


  public onEditOrg(id,parentId){
   if(!parentId){
sessionStorage.setItem("is_branch", 'false')

   }else{
sessionStorage.setItem("is_branch", 'true')

   }
//  localStorage.setItem('org_id',id);
//     this.router.navigate(["/dashboard"]);
sessionStorage.setItem("editOrgId", id)
    this.orgService.setOrgID(id);
    this.router.navigate(['/organization-profile']);
  }

  public onSettingOrg(id,parentId){
    console.log(id,parentId);
    this.orgService.setOrgID(id);
    localStorage.setItem('org_id',id);
    this.router.navigate(['/organization-overview']);
  }

  public onNotificationOrg(id,parentId){
    console.log(id,parentId);
    this.orgService.setOrgID(id);
    localStorage.setItem('org_id',id);
    this.router.navigate(['/organization-notification']);
  }


  public onProceed(){
    this.showPlanDetails=false;
    this.showCardDetails=true;
    this.user=this.planForm.get('users').value;
  }
  public openPurchaseModal(){
    this.getAllPlan();
    this.findByPlanId();
    this.FindPlanPriceByPlanID();

this.showPlanDetails=true;
    $('#purchase_log_modal').modal('show');
  }
  public toSelectPlan(){
   this.router.navigate(["/choose-plan"]);

  }
  public OrgList(id){
    this.spinner.show();
this.orgService.getOrgByUserId(id).subscribe(
  (data:any)  => {
    if(data.length!=0){

      this.spinner.hide();

       this.orgListArr=data
      //  this.orgListArr=[]

    }else{

      $("#org_modal").modal({backdrop: false});
      $('#org_modal').modal('show');

    }
    // let dataObj = JSON.parse(data['token']);



  // this.router.navigate(["/organizations"]);

  },
  error  => {
    Swal.fire(
      'Error!',
      'Org List Error.',
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
  public onSettings(){
   this.utilService.setVisible(true);

  }
  public getUsersInfo(){
    if(localStorage.getItem('user_id') && localStorage.getItem('token') ){

      let user_id={
        id:localStorage.getItem('user_id')
      }
      this.userService.getByUserID(user_id).subscribe(
        data  => {
          // let dataObj = JSON.parse(data['token']);
        // this.orgListArr=data


      localStorage.setItem('user_info',JSON.stringify(data['employee']));

        // this.router.navigate(["/organizations"]);
     this.OrgList(data['employee'].id);


        },
        error  => {
          Swal.fire(
            'Error!',
            'Org List Error.',
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
  }

  public FindPlanPriceByPlanID(){

    let postData={
      ID:localStorage.getItem('plan_id')
    }
    if(localStorage.getItem('plan_type')!=='null'){
       this.selectebillingOptionText=localStorage.getItem('plan_type')
       if(this.selectebillingOptionText=='Yearly'){
            this.isYearly=true;


       }else{
     this.isYearly=false;

       }


     }
    this.subscribeService.FindPlanPriceByPlanID(postData).subscribe(
      (data:any)  => {


       for (var i = 0; i < data.length; i++) {
        // logik to create new items
        if(this.selectebillingOptionText=='Monthly' && data[i].billing_cycle=="Monthly" ){
          this.planForm.patchValue({

            planPrice: data[i].price_amount,


          })
        }



        }

        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          // if(this.selectebillingOptionValue=='Monthly' && data[i].billing_cycle=="Monthly" ){
          //   this.planForm.patchValue({

          //     planPrice: data[i].price_amount,


          //   })
          // }
          if(this.selectebillingOptionText=='Yearly' && data[i].billing_cycle=="Yearly" ){
            this.planForm.patchValue({

              planPrice: data[i].price_amount,


            })
          }


          }
     this.planPrice=this.planForm.get('planPrice').value;

      if(this.planForm.get('users').value){
        this.calcPrice();
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
     //this.isYearly=true;

  }
  public AddBilling(){

    let postData={
      "id": null,
      "current_plan_id": localStorage.getItem('plan_id'),
      "billing_cycle": localStorage.getItem('plan_type'),
      "total_user": this.user,
      "total_cost": this.planPrice,
      "first_name": this.paymentForm.get('firstName').value,
      "last_name": this.paymentForm.get('lastName').value,
      "card_no": this.paymentForm.get('cardNumber').value,
      "expire_month": this.paymentForm.get('expirationMonth').value,
      "expire_year": this.paymentForm.get('expirationYear').value,
      "cvv": this.paymentForm.get('cardCVVNumber').value,
      "adr1": this.paymentForm.get('adr1').value,
      "zip": this.paymentForm.get('zip').value,
      "state": null,
      "country": null,


    }
    if (this.paymentForm.invalid) {
      this.displayMessage = "Payment Failed!";
        return;
    }
      this.displayMessage = "Payment Successful!";

    let subscribeObj;
    if(localStorage.getItem('user_info')){
      subscribeObj= JSON.parse(localStorage.getItem('subscription'));


  }
    let subscribePostData={
      "id": null,
      "api_key": subscribeObj['api_key'],
      "current_plan_id": localStorage.getItem('plan_id'),
      "subscription_start_date": moment().format('L, h:mm:ss A'),
      "subscription_end_date": localStorage.getItem('plan_type')=='Monthly'?moment().add(1, 'months').format('L, h:mm:ss A'):moment().add(1, 'years').format('L, h:mm:ss A'),
      "on_date_subscribed": moment().format('L, h:mm:ss A'),
      "offer_id": subscribeObj['offer_id'],
      "offer_start_date": moment().format('L, h:mm:ss A'),
      "offer_end_date": localStorage.getItem('plan_type')=='Monthly'?moment().add(1, 'months').format('L, h:mm:ss A'):moment().add(1, 'years').format('L, h:mm:ss A'),
      "is_trial":moment(moment().format('YYYY-MM-DD')).isSameOrBefore(moment(subscribeObj['subscription_end_date']).format('YYYY-MM-DD'))? true:false,
      "is_subscibe_after_trial": true,

    }

    this.subscribeService.AddBilling(postData).subscribe(
      (data:any)  => {

     if(data.status=='200'){
    $('#purchase_log_modal').modal('hide');

      this.subscribeService.UpdateSubscription(subscribePostData).subscribe(
        (subscdata:any)  => {

       if(subscdata.status=='200'){
       $('#purchase_log_modal').modal('hide');

        Swal.fire(
          'Success!',
          subscdata['desc'],
          'success'
        ).then(
          (result)=> {
            $('#purchase_log_modal').modal('hide');

          })
       }else{

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
  public findByPlanId(){

    let postData={
      id:localStorage.getItem('plan_id')
    }
    this.subscribeService.FindByPlanID(postData).subscribe(
      (data:any)  => {


        this.planForm.patchValue({

          planName: data.plan_name,


        })
        this.planName=data.plan_name




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
  onDelete(orgid){

    let postData={
      id:orgid
    }
    this.orgService.RemoveOrganization(postData).subscribe(
      (data:any)  => {



       if(data.status==200){
        this.OrgList(localStorage.getItem('user_id'));
        this.toastr.success(data['desc'], undefined,{
          positionClass: 'toast-top-center'
     });
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
  public selectedOption(option){

  }
  public  getAllPlan(){
    // this.selecteplanOptionValue=localStorage.getItem('planId');

    this.subscribeService.GetAllPlan().subscribe(

      (data:any) => {


var results=[{ id: '', text: 'Select' }]
// let dataObj = JSON.parse(data['token']);
//
if(data){
for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({

    "id": data[i].id,
    "text": data[i].plan_name
});

}

}


this.planData =results;


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

      /**
       * changedPlan
       */
      public changedPlan(e:any) {
        this.selecteplanOptionValue=e.value;
      }

      public changedOption(e) {

        if(e.srcElement.checked==true){
          this.selectebillingOptionValue=e.value;
          this.selectebillingOptionText='Yearly';

        }else{
          this.selectebillingOptionText='Monthly';

        }
        this.FindPlanPriceByPlanID();

      }
      public calcPrice(){
        let cost=parseFloat(this.planForm.get('planPrice').value.match(/[\d\.]+/));
        this.showPrice=true;
        // let cost=parseInt(this.planForm.get('planPrice').value);
        let usersNo=this.planForm.get('users').value;
        this.totalPrice=cost*usersNo;

      }
      /**
       *  OnPurchaseLogClose
       */
      public  OnPurchaseLogClose() {
        this.showCardDetails=false;
        this.showPlanDetails=true;
        $('#purchase_log_modal').modal('hide');
      }
      /**
       * OnTimeLogClose
       */
      public OnTimeLogClose() {
        this.showCardDetails=false;
        this.showPlanDetails=true;
      }
      isEmpProfileFieldValid(field: string) {
        if(this.addformSubmitted){
          return (

            this.paymentForm.get(field).errors && this.paymentForm.get(field).touched ||
            this.paymentForm.get(field).untouched &&
            this.addformSubmitted
          );
        }
        else if(this.editformSubmitted){
          return (

            this.paymentForm.get(field).errors &&
            this.editformSubmitted
          );
        }
        else{
          return false;
        }

      }

  ngOnInit() {
    this.selectebillingOptionText="Monthly"

    let userInfo = JSON.parse(localStorage.getItem('user_info'));
    if(userInfo.id === 'cd572b1b-fd3c-4fc6-bbcb-cb953a0e900d' || userInfo.id === 'ca9ff8c2-2913-4287-89e5-92ab4ecbabe5'){
      this.showOwnerAccess = true;
    }

     //$("#org_modal").modal({backdrop: false});
   //  $('#org_modal').modal('show');
  //  $('#isYearly').prop('checked',true);
  //  $('#isYearly').prop('checked', true);
  //  this.isYearly=true;
  let subscribeObj;
    if(localStorage.getItem('user_info')){
      subscribeObj= JSON.parse(localStorage.getItem('subscription'));
      var d1=moment(subscribeObj['subscription_end_date']).format('L');
      var d2=moment().format('L');
      if(moment(moment(subscribeObj['subscription_end_date']).format('YYYY-MM-DD')).isSameOrAfter(moment().format('YYYY-MM-DD'))){


      }

  }
   if(localStorage.getItem('plan_id') && localStorage.getItem('plan_id')!='null'){

    this.getAllPlan();
    this.findByPlanId();
    this.FindPlanPriceByPlanID();

this.showPlanDetails=true;
$('#purchase_log_modal').modal('show');

   }

    this.planForm = new FormGroup({
      planName: new FormControl('', [Validators.required]),
      planPrice: new FormControl('', [Validators.required]),
      users: new FormControl('', [Validators.required])


   });
   this.paymentForm = new FormGroup({
    firstName: new FormControl('',  [Validators.required,Validators.minLength(1),Validators.pattern('^[A-Za-z][A-Za-z -]*$')]),
    lastName: new FormControl('',  [Validators.required,Validators.minLength(1),Validators.pattern('^[A-Za-z][A-Za-z -]*$')]),
    adr1: new FormControl(''),
    zip: new FormControl(''),


    cardNumber: new FormControl('', [Validators.required,Validators.minLength(16),Validators.min(1111111111111111),Validators.max(9999999999999999)]),
    expirationMonth: new FormControl('', [Validators.required,Validators.minLength(1),Validators.maxLength(2),Validators.min(1),Validators.max(12)]),
    expirationYear: new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(4),Validators.min(1111),Validators.max(9999)]),
    cardCVVNumber: new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.min(111),Validators.max(999)])


 });


    this.activityOptions={
      placeholder:"Select",
      width: "100%",
    }

    this.billingData = [


      { id: '1', text: 'Monthly' },

      { id: '2', text: 'Yearly' },
      ]

    this.orgService.setOrgID('');
    //this.getUsersInfo();
sessionStorage.clear();
    $.getScript('assets/js/pages/crud/forms/widgets/bootstrap-datepicker.js')
    this.utilService.setVisible(false);
    if(localStorage.getItem('user_info')){
      let user_info= JSON.parse(localStorage.getItem('user_info'));

      this.OrgList(localStorage.getItem('user_id'));

        this.full_name=user_info['full_name'];
       ;





  }

  if(localStorage.getItem('enddate') && localStorage.getItem('enddate') ){
  this.end_date=localStorage.getItem('enddate');
   this.start_date=localStorage.getItem('startdate');


    this.firstDate = moment(this.start_date).format('MM/DD/YYYY');
    this.secondDate = moment(this.end_date).format('MM/DD/YYYY');
// this.diffInDays = Math.abs(this.firstDate.diff(this.secondDate, 'days'));
//  let date1 = new Date(parseInt(sdate1[2]), parseInt(sdate1[1]), parseInt(sdate1[0]));
//  let date2 = new Date(parseInt(sdate2[2]), parseInt(sdate2[1]), parseInt(sdate2[0]));
// let date2 = new Date(sdate2[0], sdate2[1], sdate2[2]);

// let msDiff = parseInt(date2) - date1; // 172800000, this is time in milliseconds
// let daysDiff = msDiff / 1000 / 60 / 60 / 24; // 2 days
//

}

  }

}
