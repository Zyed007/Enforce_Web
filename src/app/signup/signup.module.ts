import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { AppPasswordModule } from '../directives/app-pwd.module';
// import { CookieService } from 'ngx-cookie-service';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SignupRoutingModule,FormsModule, ReactiveFormsModule,NgbModule,
    // AppPasswordModule
  ],
 declarations: [SignupComponent],
  // providers: [ CookieService ]
})
export class SignupModule { }
