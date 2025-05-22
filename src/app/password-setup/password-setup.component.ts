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
  selector: 'app-password-setup',
  templateUrl: './password-setup.component.html',
  styleUrls: ['./password-setup.component.scss']
})


export class PasswordSetupComponent implements OnInit {
  VerificationForm: FormGroup;
  signUpForm: FormGroup;
  forgetPwdForm:FormGroup;
  formSubmitted: boolean;
  VerificationFormSubmit:boolean;
  loginFormSubmit:boolean;
  formControlUsername:FormGroup;
  public email;
  public pattern:'/^(?:\d{10}|\w+@\w+\.\w{2,3})$/';

  url="https://timeapi.azurewebsites.net/api/Account/Register";
  pwdMatch: boolean=false;
  constructor(
    private http:HttpClient,
    public router: Router,
    public loginService: LoginService,
    public userService:UserService,
    public route:ActivatedRoute,
    private spinner:NgxSpinnerService

  
  ) { 
    
    this.VerificationForm = new FormGroup({
      // tslint:disable-next-line
     
     password: new FormControl('',[ Validators.required,
     Validators.minLength(6),
     Validators.maxLength(25)]),
     cpassword: new FormControl('', [Validators.compose(
      [Validators.required],
  )]),
  
     
    },this.pwdMatchValidator);

   
  
  
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
    onValueChanged(data?: any) {
      if (!this.VerificationForm) { return; }
      const form = this.VerificationForm;
      for (const field in this.formErrors) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
   
   formErrors = {
      'email': '',
      'password': ''
    };
  
    validationMessages = {
      'email': {
        'required':      'Email is required.',
        'email':         'Email must be a valid email'
      },
      'password': {
        'required':      'Password is required.',
        'pattern':       'Password must be include at one letter and one number.',
        'minlength':     'Password must be at least 6 characters long.',
        'maxlength':     'Password cannot be more than 40 characters long.',
      }
    }
   
    public verifyEmailValue() {
     
      // emailString=false;

       
          return this.loginService.onVerifyEmail(this.paramId.userId, this.paramId.code).subscribe(
            data  => {
              // let dataObj = JSON.parse(data['token']);
            
            if(data['employee']){
              this.email=data['employee'].workemail
              //this.router.navigate(["/organizations"]);

            }else{
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
    pwdMatchValidator(frm: FormGroup) {
      // 
      return frm.get('password').value === frm.get('cpassword').value
        ? null : { 'mismatch': true };
       
    }
    public resetPwd() {
      if(  this.VerificationForm.get('password').value!='' &&   this.VerificationForm.get('cpassword').value!='' ){
        if( this.VerificationForm.get('password').value ==  this.VerificationForm.get('cpassword').value){
         this.pwdMatch=true
        }else{
         this.pwdMatch=false 
        }
        
       }
      // let loginUrl=this.utilService.getHostURL()+'Account/login';
  
     let postData={
         
     Email: this.email ,
    
        Password:  this.VerificationForm.get('password').value,
        ConfirmPassword: this.VerificationForm.get('cpassword').value,
        Code: this.paramId.code
      }
      // let postData=
      //   {"Email":"hifza147@gmail.com","Password":"Amaze@147","ConfirmPassword":"Amaze@147","Code":"Q2ZESjhEYkVvVkdjRks5RHJvNXB5clgwdE5Edkh6NU9hR0dqR0NiQnZPUCtndTVVUi9LWW9KdmFMQkpxbkUyaHFCVmVzQUhmWDRjenF3VFdtRFNhd29UVFFEWjZlV1pkbG1VcTNDMnhHMkhJL2hCZlN1ajU5WFJ5eHEzdlJ5Qm5FbCtwclM4ZEJjR0RUU0ZwMVBIK0RwOHZqbFQ5OWhYdjJhYWtSNEoxdGZUQmZaSU5jVWIwVGtXL0hhKzgyVUlqSmh6enlvSERCNXJYNUUzTFlVeUZxM2Zra2RaaElrZlpSclVWQkFjZ1Q3YnVBVTB0"}
      
      // emailString=false;
      this.VerificationFormSubmit = true;
      
      if (this.VerificationForm.get('password').value !== '' && this.VerificationForm.get('cpassword').value !== '' && this.pwdMatch
         ) {
    this.spinner.show();
       
          return this.loginService.onResetPassword(postData).subscribe(
            data  => {
            
            if(data['code']==200){
     this.spinner.hide();
     this.VerificationFormSubmit = false;

              Swal.fire(
                'Success!',
                data['desc'],
                'success'
              ).then(
                (result)=> {
                   
                   this.router.navigate(["/signin"]);
             
                })
           
            }else{
     this.spinner.hide();
     this.VerificationFormSubmit = false;

              Swal.fire(
                'Error!',
                data['desc'],
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
                'Something went wrong!!.',
                'error'
              ).then(
                (result)=> {
                   
                })
            
            
            }
            
            )
        
        
     
    }
   
  
    
  
     
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
          this.email=data['employee'].workemail
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
    this.getUsersInfo();
    this.VerificationForm.valueChanges.subscribe(data => this.onValueChanged(data));

   
    this.onValueChanged(); // reset validation messages
      //this.createForm();
  //  this.verifyEmailValue();
      // $.getScript('assets/js/departments-datatable.js');

      // $.getScript('assets/js/pages/custom/login/login-general.js');
   
      $.getScript('assets/js/pages/components/extended/toastr.js');

  
      
      
    
  
  }

}
