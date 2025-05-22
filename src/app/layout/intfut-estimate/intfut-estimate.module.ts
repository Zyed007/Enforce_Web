import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntfutEstimateRoutingModule } from './intfut-estimate-routing.module';
import { IntfutEstimateComponent } from './intfut-estimate.component';
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
import { HotTableModule } from '@handsontable/angular';
import { ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { NotFoundModule } from '../components/not-found/not-found.module';
import { GlobalConstants } from '../../global-constants/constants';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SelectDropDownModule } from 'ngx-select-dropdown';

@NgModule({
    imports: [CommonModule, HotTableModule, PagerModule, NotFoundModule, NgxMaterialTimepickerModule, UploaderModule, NgxFormatFieldModule, NumericTextBoxModule, IntfutEstimateRoutingModule, NgbModule, AccordionModule, TagInputModule, MultiSelectModule,
        Select2Module, MatTableModule, SatPopoverModule, GridAllModule, DropDownListModule,
        MatToolbarModule, DatePickerModule, MatFormFieldModule, MatInputModule, NgxIntlTelInputModule,
        MatExpansionModule,
        MatTableModule,
        MatSortModule,
        MatToolbarModule,
        MatFormFieldModule,
        SelectDropDownModule,
        MatInputModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatSortModule, Select2Module, FormsModule, ReactiveFormsModule, ButtonModule, CheckBoxModule, RadioButtonModule, DropDownButtonModule, SplitButtonModule, SwitchModule, ProgressButtonModule, AgmCoreModule.forRoot({
            apiKey: GlobalConstants.apiKey,
            libraries: ['places']
        })],
    declarations: [IntfutEstimateComponent]
})
export class IntfutEstimateModule { }
