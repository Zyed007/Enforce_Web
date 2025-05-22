import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
//plugin Comp
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { NumericTextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule } from '@angular/material';
import { Select2Module } from 'ng2-select2';
import { AccordionModule } from 'ngx-bootstrap';
import { NotFoundModule } from '../../components/not-found/not-found.module';
import { PaymentModeComponent } from '../payment-mode/payment-mode.component';
import { paymentRoutingModule } from './payment.routing.module';
import { PaymentComponent } from './payment.component';
import { WorkExpensesPrefixComponent } from './work-expenses-prefix/work-expenses-prefix.component';
import { AdjustmentPrefixComponent } from './adjustment-prefix/adjustment-prefix.component';



@NgModule({
    imports: [
        CommonModule,
        paymentRoutingModule,
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
        DateRangePickerModule,
        Ng2SearchPipeModule,
        RadioButtonModule,
        CheckBoxModule,
        UploaderModule,
        CommonModule,
        GridAllModule,
        TabModule,
        PagerModule,
        MatTableModule,
        MatSortModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        Select2Module,
        FormsModule,
        ReactiveFormsModule,
        Ng2SearchPipeModule,
        NgbModule,
        AccordionModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        DatePickerModule,
        NotFoundModule,
        NgxIntlTelInputModule,
        NumericTextBoxModule,
        SelectDropDownModule,
        DropDownListModule,
        CheckBoxModule,
        UploaderModule,
        RadioButtonModule,
    ],
    declarations: [
        PaymentComponent,
        WorkExpensesPrefixComponent,
        AdjustmentPrefixComponent
    ],
    // exports: [
    //     PaymentModeComponent
    // ],
})
export class paymentModule { }
