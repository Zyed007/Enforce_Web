import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { routerTransition } from "../router.animations";
import * as $ from "jquery";
import {
  FormGroup,
  FormArray,
  Validators,
  FormControl,
  ValidatorFn,
} from "@angular/forms";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { LoginService } from "../services/login.service";
import { patternValidator } from "../shared/services/index";
import Swal from "sweetalert2";
import { UserService } from "../services/user.service";
import { NgxSpinnerService } from "ngx-spinner";
import { EmployeeService } from "../services/employee.service";
import { SubscriptionService } from "../services/subscription.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { throwToolbarMixedModesError } from "@angular/material";
import { ToastrService } from "ngx-toastr";

// import {
//   CookieService
// } from 'ngx-cookie-service';

//declare var $: any;
interface LoginCred {
  user_id: string;
  token: string;
}
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  animations: [routerTransition()],
  providers: [LoginService],
})
export class SignupComponent implements OnInit {
  closeResult: string;
  versionNumber = 2.0;
  @ViewChild("MFAModal", { static: false }) MFAModal: any;
  loginForm: FormGroup;
  signUpForm: FormGroup;
  forgetPwdForm: FormGroup;
  formSubmitted: boolean;
  signUpFormSubmit: boolean;
  loginFormSubmit: boolean;
  formControlUsername: FormGroup;
  timer: number = 60;
  otpExpired: boolean = false;
  private countdown: any;
  @ViewChild("otp1", { static: false }) otp1: ElementRef;
  @ViewChild("otp2", { static: false }) otp2: ElementRef;
  @ViewChild("otp3", { static: false }) otp3: ElementRef;
  @ViewChild("otp4", { static: false }) otp4: ElementRef;
  public pattern: "/^(?:d{10}|w+@w+.w{2,3})$/";
  phoneInvalid: boolean = false;
  phoneErrorMsg: any;
  loginPhoneInvalid: boolean = false;
  public showLoginError = false;
  invalidLogin: any;
  showSignUpSuccess = false;
  successMsg: any;
  showSignUpError = false;
  errorMsg: any;
  emailValue: any;
  showSignUpDiv: boolean = false;
  signIn: boolean = true;
  resetForm: boolean = false;
  fieldTextType: boolean = false;
  pwdMatch: boolean = false;
  loginCred: LoginCred = {
    user_id: "",
    token: "",
  };
  public showSignUp() {
    this.showSignUpDiv = true;
    this.signIn = false;
    this.resetForm = false;
  }
  public showLogin() {
    this.showSignUpDiv = false;
    this.signIn = true;
    this.resetForm = false;
    this.signUpForm.reset();
  }
  public showReset() {
    this.showSignUpDiv = false;
    this.signIn = false;
    this.resetForm = true;
  }
  private validateAreEqual(fieldControl: FormControl) {
    return fieldControl.value === this.signUpForm.get("password").value
      ? null
      : {
          NotEqual: true,
        };
  }
  url = "https://timeapi.azurewebsites.net/api/Account/Register";
  constructor(
    private http: HttpClient,
    public router: Router,
    public utilService: LoginService,
    public userService: UserService,
    private spinner: NgxSpinnerService,
    private empService: EmployeeService,
    public subscriptionService: SubscriptionService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {
    this.loginForm = new FormGroup({
      // tslint:disable-next-line
      // email: new FormControl('', [Validators.required, patternValidator(/^(?:^\+[1-9]\d{1,14}$|\w+@\w+\.\w{2,3})$/)]),
      email: new FormControl("", [
        Validators.required,
        patternValidator(/^[0-9]+$/),
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      // email: new FormControl('', [Validators.required,patternValidator(/^(?:^\+[1-9]\d{1,14})$/),Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),

      // email: new FormControl('', [Validators.required,
      //   this.customPatternValid({ pattern: /\S+@\S+\.\S+/, msg: 'Enter a valid email' }),
      //   patternValidator(/^[2-9]{1}[0-9]{9}$/)]),

      password: new FormControl("", Validators.required),
      // password: new FormControl('',[ Validators.required,patternValidator(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/)]),
    });

    this.forgetPwdForm = new FormGroup({
      //  email: new FormControl('', [Validators.required, patternValidator(/^(?:\d{10}|\w+@\w+\.\w{2,3})$/)]),
      //email: new FormControl('', [Validators.required,patternValidator(/^(?:^\+[1-9]\d{1,14})$/),Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      email: new FormControl("", [
        Validators.required,
        patternValidator(/^[0-9]+$/),
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
    });
  }
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  closeModel() {
    this.modalService.dismissAll();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  pwdMatchValidator(frm: FormGroup) {
    if (frm.get("cpassword").value != "") {
      return frm.get("password").value === frm.get("cpassword").value
        ? null
        : { mismatch: true };
    }
  }

  hideInvalidPhoneTxt() {
    this.phoneInvalid = false;
    this.loginPhoneInvalid = false;
  }

  signupPhoneValidate() {
    var emailReg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    var phoneReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    // Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
    // Regex r = new Regex(@"^\+?(\d[\d-]+)?(\([\d-]+\))?[\d-]+\d$");
    // if (r.IsMatch(_userName))
    //     Result = "PHONE";
    // else if (regex.IsMatch(_userName))
    //     Result = "EMAIL";

    const email = emailReg.test(this.signUpForm.get("email").value);
    const phone = phoneReg.test(this.signUpForm.get("email").value);
    let postData = {
      ...(phone && { PhoneNumber: this.signUpForm.get("email").value }),
    };
    if (phone && this.signUpForm.get("email").value != "") {
      this.empService.IsPhoneValid(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.phoneInvalid = false;
          } else {
            this.phoneInvalid = true;
            this.phoneErrorMsg = data["desc"];
          }
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/signin']);
            }
          );
        }
      );
    } else {
      this.phoneInvalid = false;
    }
  }

  loginPhoneValidate() {
    var emailReg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    var phoneReg = /^[0-9]+$/;
    //var phoneReg =/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    // Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
    // Regex r = new Regex(@"^\+?(\d[\d-]+)?(\([\d-]+\))?[\d-]+\d$");
    // if (r.IsMatch(_userName))
    //     Result = "PHONE";
    // else if (regex.IsMatch(_userName))
    //     Result = "EMAIL";

    const email = emailReg.test(this.loginForm.get("email").value);
    const phone = phoneReg.test(this.loginForm.get("email").value);

    let postData = {
      ...(phone && { PhoneNumber: this.loginForm.get("email").value }),
    };

    if (phone && this.loginForm.get("email").value != "") {
      this.empService.IsPhoneValid(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.loginPhoneInvalid = false;
          } else {
            this.loginPhoneInvalid = true;
            this.phoneErrorMsg = data["desc"];
          }
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    } else {
      this.loginPhoneInvalid = false;
    }
  }

  public customPatternValid(config: any): ValidatorFn {
    return (control: FormControl) => {
      let urlRegEx: RegExp = config.pattern;
      if (control.value && !control.value.match(urlRegEx)) {
        return {
          invalidMsg: config.msg,
        };
      } else {
        return null;
      }
    };
  }
  isFieldValid(field: string) {
    return (
      (this.loginForm.get(field).errors && this.loginForm.get(field).touched) ||
      (this.loginForm.get(field).untouched &&
        this.formSubmitted &&
        this.loginForm.get(field).errors &&
        this.loginForm.get(field).errors.patternValidator)
    );
  }

  isSignUpFieldValid(field: string) {
    return (
      (this.signUpForm.get(field).errors &&
        this.signUpForm.get(field).touched) ||
      (this.signUpForm.get(field).untouched &&
        this.signUpFormSubmit &&
        this.signUpForm.get(field).errors &&
        this.signUpForm.get(field).errors.patternValidator)
    );
  }
  public async login() {
    let currentEmail = this.loginForm.get("email").value;
    let userInfo: any = localStorage.getItem("user_info");
    let localToken = localStorage.getItem("token");
    userInfo = JSON.parse(userInfo);
    console.log(userInfo, "userInfo");
    let ExistingEmail = userInfo ? userInfo.workemail : "";
 
    console.log(currentEmail, ExistingEmail, "********");
    // if (userInfo && localToken) {
    //   // console.log("ALREADY LOGIN CALLED")
    //   this.toast.error("Oops! It seems there is already an active session in this browser. Please use another browser or log out from the current session to start a new one.")
    // } else {
 
    // let loginUrl=this.utilService.getHostURL()+'Account/login';
 
    var re = /\S+@\S+\.\S+/;
    //  localStorage.clear();
    let emailString = re.test(this.loginForm.get("email").value);
    const phoneNo = !re.test(this.loginForm.get("email").value);
 
    let postData = {
      ...(emailString && { email: this.loginForm.get("email").value }),
      ...(phoneNo && { email: this.loginForm.get("email").value }),
      password: this.loginForm.get("password").value,
    };
    // emailString=false;
    this.loginFormSubmit = true;
 
    //if (this.loginForm.get('email').value !== '' && this.loginForm.get('password').value !== '') {
    if (
      this.loginForm.get("email").value !== "" &&
      this.loginForm.get("password").value !== "" &&
      (!this.loginForm.controls["email"].errors.patternInvalid ||
        !this.loginForm.controls["email"].errors.pattern)
    ) {
      this.spinner.show();
 
      return this.utilService.onLogin(postData).subscribe(
        async(data) => {
          // let dataObj = JSON.parse(data['token']);
          console.log(data, "DATA*");
 
          if (data["token"]) {
            // localStorage.setItem("token", data["token"]);
            // sessionStorage.setItem("token", data["token"]);
            // localStorage.setItem("user_id", data["id"]);
            // localStorage.setItem("currentNodeTxt", "TIME LOG");
            // this.getUserInitialInfo(data["id"]);
            this.loginCred = { user_id: data["id"], token: data["token"] };
            this.spinner.hide();
            this.handleLoginSuccess();
            // await this.handleMFA(); MFA commented for now
          } else if (data["code"] == "201") {
            this.spinner.hide();
            //alert('201')
            //this.showLoginError=true;
            // this.invalidLogin=data['desc']
            // $("#checkout_modal").modal('show');
 
            //checkout_modal
 
            Swal.fire("Error!", data["desc"], "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        },
        (error) => {
          this.spinner.hide();
 
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    }
 
    this.formSubmitted = true;
    if (
      this.loginForm.get("email").value !== "" &&
      this.loginForm.get("password").value !== ""
    ) {
      // this.router.navigate(["/grid-view"]);
    }
 
    // }
  }
  public async handleMFA() {
    try {
      this.spinner.show();
      let isOtpSend:any = await this.sendLoginNotification()
      console.log(isOtpSend, "isOtpSend***");
      if(isOtpSend){
        this.spinner.hide();
        this.handleMFAModal();
      }
    } catch (error) {
      this.spinner.hide();
      console.error("Error sending login notification:", error);
    }
  }
  public async sendLoginNotification() {
    let email = this.loginForm.get("email").value;
    let postData = {
      "email": email,
      "user_id": this.loginCred.user_id,
      "user_name": "Sharan",
    };
    console.log(postData, "postData***");
    try {
      let res:any = await this.empService.sendLoginNotification(postData).toPromise();
      console.log(res, "res***");
      if(res && res.status==200){
        return true
      }
    } catch (error) {
      console.error("Error sending login notification:", error);
    }
  }
  public async handleMFAModal() {
    console.log(this.loginCred,"this.loginCred")

    this.modalService.open(this.MFAModal, { centered: true, backdrop: 'static',
      keyboard: false,  });
    this.timer=60;
    this.startTimer();

  }
  moveFocus(current: HTMLInputElement, next: HTMLInputElement): void {
    if (current.value.length === 1 && next) {
      next.focus();
    }
  }
  startTimer(): void {
    this.countdown = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.otpExpired = true;
        clearInterval(this.countdown);
      }
    }, 1000);
  }

  async handleResendOtp() {
    try {
      this.spinner.show();
      let isOtpSend = await this.sendLoginNotification();
      if (isOtpSend) {
        this.timer = 60;
        this.otpExpired = false;
        this.otp = ['', '', '', '', '', ''];
        this.startTimer();
      }
      console.log('Resending OTP...');
    } catch (error) {
      console.error('Error resending OTP:', error);
    } finally {
      this.spinner.hide();
    }
  }

  public async verifyUserLoginOTP(otp) {
    let email = this.loginForm.get("email").value;
    let postData = {
      "email": email,
      "user_id": this.loginCred.user_id,
       "enteredOtp":otp
    };
    console.log(postData, "postData***");
    try {
      let res:any = await this.empService.verifyUserLoginOTP(postData).toPromise();
      console.log(res, "res***");
      if(res && res.status==200){
        return true
      }
    } catch (error) {
      console.error("Error sending login notification:", error);
    }
  }

  onOtpComplete(): void {
    if (
      this.otp.length === 6 &&
      this.otp.every((digit) => digit.length === 1)
    ) {
      console.log("OTP entered:", this.otp.join(""));
    }
  }
  async onSubmit() {
    const enteredOtp = this.otp.join("");
    console.log("Submitted OTP:", enteredOtp);
    if (enteredOtp.length !== 6) {
      Swal.fire({
        type: 'error',
        title: 'Invalid OTP',
        text: 'Please enter a valid 6-digit OTP.',
      });
      return;
    }

    try {
      let isOtpVerified = await this.verifyUserLoginOTP(enteredOtp);
      if(isOtpVerified){
        this.closeModel();
        Swal.fire({
          type: 'success',
          title: 'OTP Verified',
          text: 'You have successfully verified your OTP.',
          timer: 1000,
          showConfirmButton: false,
        });

        await this.handleLoginSuccess();
      }else{
        this.toast.error('The OTP you entered is invalid. Please check and try again.');

      }

    } catch (error) {
      Swal.fire({
        type: 'error',
        title: 'Verification Failed',
        text: 'There was an issue verifying your OTP. Please try again.',
      });
    }
  }
  public async handleLoginSuccess() {
    try {
      this.spinner.show();

      localStorage.setItem("token", this.loginCred.token);
      // sessionStorage.setItem("token", this.loginCred.token);
      localStorage.setItem("user_id", this.loginCred.user_id);
      localStorage.setItem("currentNodeTxt", "TIME LOG");

      await this.getUserInitialInfo(this.loginCred.user_id);

      this.spinner.hide();
    } catch (error) {
      console.error("Error handling login:", error);

      this.spinner.hide();

      alert("An error occurred while processing your login. Please try again.");
    }
  }

  public async getUserInitialInfo(user_id) {
    console.log(user_id, "TEST USER ID");
    let userId = {
      ID: user_id,
      OrgID: "Login",
    };
    try {
      let data: any = await this.userService.getByUserID(userId).toPromise();
      console.log(data, "DATA BEFORE");
      if (data) {
        console.log(data, "DATA");
        console.log(data["subscription"], "subscription");
        if (data["subscription"]) {
          localStorage.setItem(
            "planType",
            data["subscription"].current_plan_id
          );
          localStorage.setItem(
            "planName",
            data["subscription"].current_plan_id
          );
          // localStorage.setItem('enddate',data['subscription'].subscription_end_date);
          // localStorage.setItem('startdate',data['subscription'].subscription_start_date);
          localStorage.setItem(
            "subscription",
            JSON.stringify(data["subscription"])
          );

          this.subscriptionService.setPlanId(
            data["subscription"].current_plan_id
          );
        } else {
          localStorage.setItem("planName", "winter");
        }
        if (data["delegateDetails"] && data["delegateDetails"].length > 0) {
          console.log(data["delegateDetails"], "data delegateDetails");
          let delegateDetails = [
            ...data["delegateDetails"],
            {
              primary_org_id: data["organization"][0].org_id,
              primary_org_name: data["organization"][0].org_name,
            },
          ];
          console.log(delegateDetails, "delegateDetails");
          localStorage.setItem(
            "delegateDetails",
            JSON.stringify(delegateDetails)
          );
        }

        localStorage.setItem("userRights", JSON.stringify(data["userRights"]));

        localStorage.setItem("user_info", JSON.stringify(data["employee"]));
        if (data["employee"].is_superadmin == true) {
          this.router.navigate(["/organizations"]);
        } else if (
          data["employee"].is_admin == true ||
          data["employee"].is_superadmin == false
        ) {
          localStorage.setItem("org_id", data["employee"].org_id);
          localStorage.setItem("planType", null);
          this.router.navigate(["/dashboard-user"]);
        } else if (
          data["employee"].is_admin == false ||
          data["employee"].is_superadmin == false
        ) {
          console.log(data["employee"].org_id, "org_id test");
          localStorage.setItem("org_id", data["employee"].org_id);
          localStorage.setItem("planType", null);

          this.router.navigate(["/dashboard-user"]);
        }
      }
    } catch (e) {
      console.log(e, "error");
    }
  }

  public getUsersInfo(user_id) {
    let userId = {
      ID: user_id,
    };
    this.userService.getByUserID(userId).subscribe(
      (data) => {
        // let dataObj = JSON.parse(data['token']);
        // this.orgListArr=data
        this.spinner.hide();
        if (data["subscription"]) {
          localStorage.setItem(
            "planType",
            data["subscription"].current_plan_id
          );
          localStorage.setItem(
            "planName",
            data["subscription"].current_plan_id
          );

          // localStorage.setItem('enddate',data['subscription'].subscription_end_date);
          // localStorage.setItem('startdate',data['subscription'].subscription_start_date);
          localStorage.setItem(
            "subscription",
            JSON.stringify(data["subscription"])
          );

          this.subscriptionService.setPlanId(
            data["subscription"].current_plan_id
          );
        } else {
          localStorage.setItem("planName", "winter");
        }

        localStorage.setItem("userRights", JSON.stringify(data["userRights"]));

        localStorage.setItem("user_info", JSON.stringify(data["employee"]));
        if (data["employee"].is_superadmin == true) {
          this.router.navigate(["/organizations"]);
        } else if (
          data["employee"].is_admin == true ||
          data["employee"].is_superadmin == false
        ) {
          localStorage.setItem("org_id", data["employee"].org_id);
          localStorage.setItem("planType", null);
          this.router.navigate(["/dashboard-user"]);
        } else if (
          data["employee"].is_admin == false ||
          data["employee"].is_superadmin == false
        ) {
          localStorage.setItem("org_id", data["employee"].org_id);
          localStorage.setItem("planType", null);

          this.router.navigate(["/dashboard-user"]);
        }
        //this.OrgList(data['employee'].id);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.signUpForm) {
      return;
    }
    const form = this.signUpForm;
    this.showSignUpError = false;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = "";
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + " ";
        }
      }
    }
  }
  onLoginValueChanged(data: any) {
    this.showLoginError = false;
    this.showSignUpSuccess = false;
    this.showSignUpError = false;
  }
  formErrors = {
    email: "",
    password: "",
  };

  validationMessages = {
    email: {
      required: "Email is required.",
      email: "Email must be a valid email",
    },
    password: {
      required: "Password is required.",
      pattern: "Password must be include at one letter and one number.",
      minlength: "Password must be at least 6 characters long.",
      maxlength: "Password cannot be more than 40 characters long.",
    },
  };
  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    let pass = group.get("password").value;
    let confirmPass = group.get("cpassword").value;

    return pass === confirmPass ? null : { notSame: true };
  }
  public signUp() {
    // let registerUrl=this.utilService.getHostURL()+'Account/Register';
    // let emailString:boolean ;

    var re = /\S+@\S+\.\S+/;

    const emailString = re.test(this.signUpForm.get("email").value);
    const phoneNo = !re.test(this.signUpForm.get("email").value);

    let postData = {
      FullName: this.signUpForm
        .get("firstName")
        .value.concat(" ", this.signUpForm.get("lastName").value),
      FirstName: this.signUpForm.get("firstName").value,
      LastName: this.signUpForm.get("lastName").value,
      ...(emailString && { Email: this.signUpForm.get("email").value }),
      ...(phoneNo && { Phone: this.signUpForm.get("email").value }),
      Password: this.signUpForm.get("password").value,
      ConfirmPassword: this.signUpForm.get("cpassword").value,
    };
    // emailString=false;
    this.signUpFormSubmit = true;
    if (
      this.signUpForm.get("password").value != "" &&
      this.signUpForm.get("cpassword").value != ""
    ) {
      if (
        this.signUpForm.get("password").value ==
        this.signUpForm.get("cpassword").value
      ) {
        this.pwdMatch = true;
      } else {
        this.pwdMatch = false;
      }
    }
    console.log(
      "this.signUpForm",
      !this.signUpForm.controls["email"].errors.patternInvalid ||
        !this.signUpForm.controls["email"].errors.pattern,
      this.signUpForm.get("email").status
    );

    //         if (this.signUpForm.get('firstName').value !== '' && this.signUpForm.get('email').value !== '' &&  this.signUpForm.get('password').value !== '' && (!this.signUpForm.controls['email'].errors.patternInvalid || !this.signUpForm.controls['email'].errors.pattern) && this.pwdMatch) {

    if (
      this.signUpForm.get("firstName").value !== "" &&
      this.signUpForm.get("email").value !== "" &&
      this.signUpForm.get("password").value !== "" &&
      (!this.signUpForm.controls["email"].errors.patternInvalid ||
        !this.signUpForm.controls["email"].errors.pattern) &&
      this.pwdMatch &&
      !this.phoneInvalid
    ) {
      this.spinner.show();

      return this.utilService.onRegistered(postData).subscribe(
        (data) => {
          if (data["status"] == "Success") {
            this.spinner.hide();
            this.showSignUpSuccess = true;
            this.showSignUpError = false;
            this.signUpForm.reset();
            this.successMsg = data["desc"];
            this.emailValue = this.signUpForm.get("email").value;
            Swal.fire("Success!", data["desc"], "success").then((result) => {
              window.location.reload();
            });
          } else {
            this.spinner.hide();
            this.showSignUpError = true;
            this.showSignUpSuccess = false;

            this.errorMsg = data["result"].desc;
            Swal.fire("Error!", data["result"].desc, "error").then(
              (result) => {}
            );
          }
        },
        (error) => {
          Swal.fire(
            "Error!",
            "Oops,Something went wrong! Please try again later",
            "error"
          ).then(
            //used Arrow function here
            (result) => {}
          );
        }
      );
    }
  }
  public toLogin() {
    window.location.reload();
  }
  public myFunction() {
    this.fieldTextType = !this.fieldTextType;
  }
  public forgotPwd() {
    var re = /\S+@\S+\.\S+/;

    const emailString = re.test(this.forgetPwdForm.get("email").value);
    const phoneNo = !re.test(this.forgetPwdForm.get("email").value);

    let postData = {
      ...(emailString && { email: this.forgetPwdForm.get("email").value }),
      ...(phoneNo && { phone: this.forgetPwdForm.get("email").value }),
    };
    // if ( this.forgetPwdForm.get('email').value !== '') {
    if (
      this.forgetPwdForm.get("email").value !== "" &&
      (!this.forgetPwdForm.controls["email"].errors.patternInvalid ||
        !this.forgetPwdForm.controls["email"].errors.pattern)
    ) {
      this.spinner.show();

      return this.utilService.onForgetPassword(postData).subscribe(
        (data) => {
          if (data["status"] == "Success") {
            this.spinner.hide();
            Swal.fire("Success!", data["desc"], "success").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["status"], "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        },
        (error) => {}
      );
    }
  }
  ngOnInit() {
    //this.createForm();
    this.signUpForm = new FormGroup(
      {
        // tslint:disable-next-line
        firstName: new FormControl("", [Validators.required]),

        lastName: new FormControl("", [Validators.required]),

        email: new FormControl("", [
          Validators.required,
          patternValidator(/^[0-9]+$/),
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),

        //email: new FormControl('', [Validators.required,patternValidator(/^(?:^\+[1-9]\d{1,14})$/),Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(25),
        ]),
        cpassword: new FormControl("", [
          Validators.compose([Validators.required]),
        ]),
      },
      this.pwdMatchValidator
    );

    this.signUpForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.loginForm.valueChanges.subscribe((data) =>
      this.onLoginValueChanged(data)
    );

    this.onValueChanged();

    // if(this.cookieService.get('username') && this.cookieService.get('password') ){
    //   this.loginForm.patchValue({
    //     'email':this.cookieService.get('username'),
    //     'password':this.cookieService.get('password')
    //   })
    // }
    // reset validation messages
    // $.getScript('assets/js/departments-datatable.js');
  }

  ngAfterViewInit() {
    $.getScript("assets/js/teamPanel.js");
  }
  otp: string[] = ["", "", "", "", "", ""]; // Array to store OTP digits

  // Move focus to the next input field


}
