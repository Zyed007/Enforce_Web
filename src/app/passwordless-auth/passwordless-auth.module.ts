import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordlessAuthRoutingModule } from './passwordless-auth-routing.module';
import { PasswordlessAuthComponent } from './passwordless-auth.component';


import { HttpClientModule, HttpClient } from '@angular/common/http';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
    PasswordlessAuthRoutingModule,
    FormsModule, ReactiveFormsModule 
   
  ],
    declarations: [PasswordlessAuthComponent]
})
export class PasswordlessAuthModule {}
