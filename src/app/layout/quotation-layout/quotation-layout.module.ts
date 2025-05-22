import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationLayoutRoutingModule } from './quotation-layout-routing.module';
import { QuotationLayoutComponent } from './quotation-layout.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { AgmCoreModule } from '@agm/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { TagInputModule } from 'ngx-chips';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxFormatFieldModule } from 'ngx-format-field';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownButtonModule, SplitButtonModule, ProgressButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import {
    NotificationComponent,
} from './components';
import { ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';
import { GlobalConstants } from '../../global-constants/constants';



@NgModule({
    imports: [CommonModule,UploaderModule,NgxMaterialTimepickerModule,PagerModule,NgxFormatFieldModule,NumericTextBoxModule,QuotationLayoutRoutingModule,NgbModule,AccordionModule,TagInputModule,MultiSelectModule,
        Select2Module,MatTableModule,SatPopoverModule,GridAllModule,DropDownListModule, 
        MatToolbarModule,DatePickerModule, MatFormFieldModule, MatInputModule, NgxIntlTelInputModule,
        MatSortModule,Select2Module,FormsModule, ReactiveFormsModule,ButtonModule, CheckBoxModule, RadioButtonModule, DropDownButtonModule, SplitButtonModule, SwitchModule, ProgressButtonModule,  AgmCoreModule.forRoot({
            apiKey: GlobalConstants.apiKey,
            libraries: ['places']
          })],
    declarations: [QuotationLayoutComponent,NotificationComponent]
})
export class QuotationLayoutModule {}



