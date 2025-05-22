import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CustomerDashboardRoutingModule } from './customer-dashboard-routing.module';
import {CustomerDashboardComponent } from './customer-dashboard.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';


@NgModule({
    imports: [CommonModule,GridAllModule,NgbModule,PagerModule,NgxIntlTelInputModule,CustomerDashboardRoutingModule,Select2Module,FormsModule, ReactiveFormsModule,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule],
    declarations: [CustomerDashboardComponent]
})
export class CustomerDashboardModule {}
