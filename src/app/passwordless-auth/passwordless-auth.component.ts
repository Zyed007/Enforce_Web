import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-passwordless-auth',
  templateUrl: './passwordless-auth.component.html',
  styleUrls: ['./passwordless-auth.component.scss']
})
export class PasswordlessAuthComponent implements OnInit {


    constructor(public route:ActivatedRoute,public router: Router,private userService:UserService,private spinner:NgxSpinnerService,private subscriptionService:SubscriptionService ) { }
  public paramId=this.route.snapshot.queryParams;
  public LoginCallback() {




    return this.userService.LoginCallback(this.paramId.token, this.paramId.username).subscribe(
      data  => {
        // let dataObj = JSON.parse(data['token']);
        if(data['token']){
          // this.cookieService.set('username', this.loginForm.get('email').value);
          // this.cookieService.set('password', this.loginForm.get('password').value);
//           console.log(this.cookieService.get('username'));
// console.log(this.cookieService.get('password'));
          localStorage.setItem('token',data['token']);
           localStorage.setItem('user_id',data['id']);
          this.getUsersInfo(data['id'])
          //this.spinner.hide();

          //this.router.navigate(["/organizations"]);

        }else if(data['code']=='201'){
          this.spinner.hide();
          //alert('201')
          //this.showLoginError=true;
         // this.invalidLogin=data['desc']
         // $("#checkout_modal").modal('show');

//checkout_modal

          Swal.fire(
            'Error!',
            data['desc'],
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })

        }

      },
      error  =>
      {
        Swal.fire(
          'Error!',
          'Oops,Something went wrong! Please try again later',
          'error'
        ).then(
          //used Arrow function here
          (result)=> {


          })


      }

      )










}
public getUsersInfo(user_id){
  let userId={
   ID: user_id
  }
   this.userService.getByUserID(userId).subscribe(
     data  => {
       // let dataObj = JSON.parse(data['token']);
     // this.orgListArr=data
     this.spinner.hide();
     if(data['subscription']){
       localStorage.setItem('planType',data['subscription'].current_plan_id);
       localStorage.setItem('planName',data['subscription'].current_plan_id);

       // localStorage.setItem('enddate',data['subscription'].subscription_end_date);
       // localStorage.setItem('startdate',data['subscription'].subscription_start_date);
   localStorage.setItem('subscription',JSON.stringify(data['subscription']));

     this.subscriptionService.setPlanId(data['subscription'].current_plan_id);
     }else{
       localStorage.setItem('planName','winter');

     }

   localStorage.setItem("userRights", JSON.stringify(data['userRights']));

   localStorage.setItem('user_info',JSON.stringify(data['employee']));
   if( data['employee'].is_superadmin==true  ){

       this.router.navigate(["/organizations"]);

   }else if(data['employee'].is_admin==true || data['employee'].is_superadmin==false  ){
     localStorage.setItem('org_id',data['employee'].org_id);
     localStorage.setItem('planType',null);
       this.router.navigate(["/dashboard-user"]);


   }else if(data['employee'].is_admin==false || data['employee'].is_superadmin==false  ){
     localStorage.setItem('org_id',data['employee'].org_id);
     localStorage.setItem('planType',null);

       this.router.navigate(["/dashboard-user"]);

   }
  //this.OrgList(data['employee'].id);


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
  ngOnInit() {
this.LoginCallback();
  }

}
