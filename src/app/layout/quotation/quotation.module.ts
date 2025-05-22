import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { QuotationComponent } from './quotation.component';
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

import { ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { NotFoundModule } from '../components/not-found/not-found.module';
import { GlobalConstants } from '../../global-constants/constants';


@NgModule({
    imports: [CommonModule,PagerModule,NotFoundModule,NgxFormatFieldModule,NumericTextBoxModule,QuotationRoutingModule,NgbModule,AccordionModule,TagInputModule,MultiSelectModule,
        Select2Module,MatTableModule,SatPopoverModule,GridAllModule,DropDownListModule, 
        MatToolbarModule,DatePickerModule, MatFormFieldModule, MatInputModule, NgxIntlTelInputModule,
        MatSortModule,Select2Module,FormsModule, ReactiveFormsModule,ButtonModule, CheckBoxModule, RadioButtonModule, DropDownButtonModule, SplitButtonModule, SwitchModule, ProgressButtonModule,  AgmCoreModule.forRoot({
            apiKey: GlobalConstants.apiKey,
            libraries: ['places']
          })],
    declarations: [QuotationComponent]
})
export class QuotationModule {}



