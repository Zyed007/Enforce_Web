import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { PageHeaderModule } from './../../shared';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule,MatPaginatorModule, MatSortModule } from '@angular/material';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule } from '@syncfusion/ej2-angular-navigations';


import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { NotFoundModule } from '../components/not-found/not-found.module';
@NgModule({
    imports: [CommonModule,NotFoundModule,PagerModule,TabModule,DatePickerModule,NgxIntlTelInputModule,GridAllModule,MatTableModule,MatSortModule,MatToolbarModule,MatPaginatorModule,MatFormFieldModule,MatInputModule, EmployeeRoutingModule,PageHeaderModule,Select2Module, FormsModule, ReactiveFormsModule ],
    declarations: [EmployeeComponent]
})
export class EmployeeModule {}
