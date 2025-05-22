import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CustomerRoutingModule } from './customer-routing.module';
import {CustomerComponent } from './customer.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { NotificationComponent } from './components/notification/notification.component';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';
import { NotFoundModule } from '../components/not-found/not-found.module';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

@NgModule({
    imports: [CommonModule,GridAllModule,NotFoundModule,NgxMaterialTimepickerModule,UploaderModule,MultiSelectModule,NumericTextBoxModule,DatePickerModule,TagInputModule,DateRangePickerModule,NgbModule,PagerModule,NgxIntlTelInputModule,CustomerRoutingModule,Select2Module,FormsModule, ReactiveFormsModule,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule, SwitchModule,DropDownListModule],
    declarations: [CustomerComponent, NotificationComponent]
})
export class CustomerModule {}
