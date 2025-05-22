import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
// import {AppPasswordDirective} from '../directives/app-pwd.directive';
import {AppPasswordModule} from '../directives/app-pwd.module';


import { HttpClientModule, HttpClient } from '@angular/common/http';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
    ResetPasswordRoutingModule,
    FormsModule, ReactiveFormsModule,AppPasswordModule
   
  ],
    declarations: [ResetPasswordComponent]
})
export class ResetPasswordModule {}
