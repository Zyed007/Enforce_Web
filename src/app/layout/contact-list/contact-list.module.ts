import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ContactListRoutingModule } from './contact-list-routing.module';
import {ContactListComponent } from './contact-list.component';
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
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';

@NgModule({
    imports: [CommonModule,GridAllModule,NgxMaterialTimepickerModule,UploaderModule,MultiSelectModule,NumericTextBoxModule,DatePickerModule,TagInputModule,DateRangePickerModule,NgbModule,PagerModule,NgxIntlTelInputModule,ContactListRoutingModule,Select2Module,FormsModule, ReactiveFormsModule,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule],
    declarations: [ContactListComponent]
})
export class ContactListModule {}
