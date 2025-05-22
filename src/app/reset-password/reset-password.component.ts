import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { patternValidator } from '../shared/services';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [LoginService]
})
export class ResetPasswordComponent implements OnInit {
  resetPwdForm: FormGroup;
  resetFormSubmit: boolean;
  pwdMatch: boolean=false;
  // utilService: any;
     
      constructor( public utilService: LoginService,public router:Router,private spinner:NgxSpinnerService) { }
  isFieldValid(field: string) {
    return (
      this.resetPwdForm.get(field).errors && this.resetPwdForm.get(field).touched ||
      this.resetPwdForm.get(field).untouched &&
      // this.formSubmitted && 
      this.resetPwdForm.get(field).errors  && this.resetPwdForm.get(field).errors.patternValidator
    );
  }
  public resetPwd() {
    // let loginUrl=this.utilService.getHostURL()+'Account/login';
    var re = /\S+@\S+\.\S+/;
    if(  this.resetPwdForm.get('password').value!='' &&   this.resetPwdForm.get('cpassword').value!='' ){
      if( this.resetPwdForm.get('password').value ==  this.resetPwdForm.get('cpassword').value){
       this.pwdMatch=true
      }else{
       this.pwdMatch=false 
      }
      
     }
   
    let emailString=re.test(this.resetPwdForm.get('email').value);
   const phoneNo=!re.test(this.resetPwdForm.get('email').value);
     
     
   let postData={
       
  ...emailString && { email: this.resetPwdForm.get('email').value },
  ...phoneNo  && { phone: this.resetPwdForm.get('email').value },  
      password:  this.resetPwdForm.get('password').value,
      confirmPassword: this.resetPwdForm.get('cpassword').value,
      code: null
    }
    // emailString=false;
    this.resetFormSubmit = true;
    // if (this.resetPwdForm.get('email').value !== '' && this.resetPwdForm.get('password').value !== '' && this.resetPwdForm.get('cpassword').value !== '' && this.pwdMatch ) {
      if ( this.resetPwdForm.get('email').value !== ''&& this.resetPwdForm.get('password').value !== '' && (!this.resetPwdForm.controls['email'].errors.patternInvalid || !this.resetPwdForm.controls['email'].errors.pattern)  && this.pwdMatch) {
    
this.spinner.show();
     
        return this.utilService.onResetPassword(postData).subscribe(
          data  => {
            // let dataObj = JSON.parse(data['token']);
          
          if(data['code']==200){
            this.spinner.hide();
            this.resetFormSubmit = false;

            Swal.fire(
              'Success!',
              'Password has been reset successfully.',
              'success'
            ).then(
              //used Arrow function here
              (result)=> {
                 
                 this.router.navigate(["/signin"]);
           
              })
          }else{
          this.spinner.hide();
          this.resetFormSubmit = false;

            Swal.fire(
              'Error!',
              'Something went wrong!!.',
              'error'
            ).then(
              //used Arrow function here
              (result)=> {
                 
                //  this.router.navigate(['/dashboard']);
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
              //used Arrow function here
              (result)=> {
                 
                //  this.router.navigate(['/dashboard']);
              })
          
          
          }
          
          )
      
      
   
  }
 

  

   
  }
  pwdMatchValidator(frm: FormGroup) {
    // 
    return frm.get('password').value === frm.get('cpassword').value
      ? null : { 'mismatch': true };
     
  }
  ngOnInit() {
    this.resetPwdForm = new FormGroup({
      // email: new FormControl('', [Validators.required, patternValidator(/^(?:\d{10}|\w+@\w+\.\w{2,3})$/)]),
      email: new FormControl('', [Validators.required,patternValidator(/^(?:^\+[1-9]\d{1,14})$/),Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),

      password: new FormControl('', Validators.required),
      cpassword: new FormControl('', [Validators.compose(
        [Validators.required],
    )]),
    
       
      },this.pwdMatchValidator);

    
    
  }

}
