import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeStatusRoutingModule } from './employee-status-routing.module';
import { EmployeeStatusComponent } from './employee-status.component';
import { PageHeaderModule } from './../../shared';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';

import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [CommonModule,GridAllModule,PagerModule,MatTableModule,MatSortModule,MatToolbarModule,MatFormFieldModule,MatInputModule, EmployeeStatusRoutingModule,PageHeaderModule,Select2Module, FormsModule, ReactiveFormsModule ],
    declarations: [EmployeeStatusComponent]
})
export class EmployeeStatusModule {}
