import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { workForceNewRoutingModule } from './workforce-new-routing.module';
import { WorkforceNewComponent } from './workforce-new.component';
import { NotFoundModule } from '../components/not-found/not-found.module';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
//plugin Comp
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
    imports: [
      CommonModule,
      NotFoundModule,
      workForceNewRoutingModule,
      GridAllModule,
      FormsModule,
      ReactiveFormsModule,
      SelectDropDownModule,
      DropDownListModule,
      DatePickerModule,
      MatIconModule,
      SwitchModule,
      NgxIntlTelInputModule,
      NgbModule,
      NgxMaterialTimepickerModule,
      DateRangePickerModule
    ],
    declarations: [
      WorkforceNewComponent
    ]
})
export class workForceNewModule {}
