import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import * as $ from 'jquery';
import { FormGroup, FormArray,
    Validators,FormControl,ValidatorFn } from '@angular/forms';
    import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {LoginService} from '../services/login.service';
import { patternValidator } from '../shared/services/index';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})


export class VerificationComponent implements OnInit {
  VerificationForm: FormGroup;
  signUpForm: FormGroup;
  forgetPwdForm:FormGroup;
  formSubmitted: boolean;
  VerificationFormSubmit:boolean;
  loginFormSubmit:boolean;
  formControlUsername:FormGroup;
  public pattern:'/^(?:\d{10}|\w+@\w+\.\w{2,3})$/';

  url="https://timeapi.azurewebsites.net/api/Account/Register";
  public full_name='';
  constructor(
    private http:HttpClient,
    public router: Router,
    public loginService: LoginService,
    public userService:UserService,
    public route:ActivatedRoute,
    private spinner:NgxSpinnerService
  
  ) { 
    
    
    
    this.VerificationForm = new FormGroup({
     
     
       password: new FormControl('', Validators.required),
       cpassword: new FormControl('', Validators.required),
      // password: new FormControl('',[ Validators.required,patternValidator(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/)]),

    
    });
   
  
  
  }
  public paramId=this.route.snapshot.queryParams;

  public customPatternValid(config: any): ValidatorFn {
    return (control: FormControl) => {
      let urlRegEx: RegExp = config.pattern;
      if (control.value && !control.value.match(urlRegEx)) {
        return {
          invalidMsg: config.msg
        };
      } else {
        return null;
      }
    };
}
    isFieldValid(field: string) {
      return (
        this.VerificationForm.get(field).errors && this.VerificationForm.get(field).touched ||
        this.VerificationForm.get(field).untouched &&
        this.formSubmitted && this.VerificationForm.get(field).errors  && this.VerificationForm.get(field).errors.patternValidator
      );
    }

    isSignUpFieldValid(field: string) {
      return (
        this.VerificationForm.get(field).errors && this.VerificationForm.get(field).touched ||
        this.VerificationForm.get(field).untouched &&
        this.VerificationFormSubmit && this.VerificationForm.get(field).errors && this.VerificationForm.get(field).errors.patternValidator
      );
    }
    public toLogin(){
      this.router.navigate(["/signin"]);
    }
   
    public verifyEmailValue() {
     
     

       
          return this.loginService.onVerifyEmail(this.paramId.userId, this.paramId.code).subscribe(
            data  => {
              // let dataObj = JSON.parse(data['token']);
            if(data['result'].status=="200"){
              Swal.fire(
                'Success!',
                data['result'].desc,
                'success'
              ).then(
                //used Arrow function here
                (result)=> {
                   
                  //  this.router.navigate(['/dashboard']);
                })
              //this.router.navigate(["/organizations"]);

            }
            else{
              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                
                (result)=> {
                   
                  
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
    public getUsersInfo(){
    
      let userId={
       ID:this.paramId.userId
      }
       this.userService.getByUserID(userId).subscribe(
         data  => {
           // let dataObj = JSON.parse(data['token']);
         // this.orgListArr=data
         
         
         if(data['employee']){
          this.full_name=data['employee'].full_name
          //this.router.navigate(["/organizations"]);

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
      //this.createForm();
   this.verifyEmailValue();
   this.getUsersInfo();

      // $.getScript('assets/js/departments-datatable.js');

      $.getScript('assets/js/pages/custom/login/login-general.js');
   
      $.getScript('assets/js/pages/components/extended/toastr.js');

  
      
      
    
  
  }

}
