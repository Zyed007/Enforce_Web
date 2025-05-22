import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganizationFormRoutingModule } from './organization-form-routing.module';
import { OrganizationFormComponent } from './organization-form.component';


import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Select2Module } from 'ng2-select2';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        OrganizationFormRoutingModule,
    FormsModule, ReactiveFormsModule ,Select2Module
   
  ],
    declarations: [OrganizationFormComponent]
})
export class OrganizationFormModule {}
