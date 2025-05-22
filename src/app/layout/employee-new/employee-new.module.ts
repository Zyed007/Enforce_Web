import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeNewRoutingModule } from './employee-new-routing.module';
import { EmployeeNewComponent } from './employee-new.component';
import { PageHeaderModule } from './../../shared';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule,MatPaginatorModule, MatSortModule } from '@angular/material';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotFoundModule } from '../components/not-found/not-found.module';

@NgModule({
    imports: [
      CommonModule,
      NotFoundModule,
      PagerModule,
      TabModule,
      DatePickerModule,
      NgxIntlTelInputModule,
      GridAllModule,
      MatTableModule,
      MatSortModule,
      MatToolbarModule,
      MatPaginatorModule,
      MatFormFieldModule,
      MatInputModule,
      EmployeeNewRoutingModule,
      PageHeaderModule,
      Select2Module,
      FormsModule,
      ReactiveFormsModule,
      NgbModule
    ],
    declarations: [
      EmployeeNewComponent
    ]
})

export class EmployeeNewModule {}
