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
import { PaymentPrefixComponent } from '../finance/payment-prefix/payment-prefix.component';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule } from '@angular/material';
import { SettingsNewRoutingModule } from '../settings-new-routing.module';
import { Select2Module } from 'ng2-select2';
import { AccordionModule } from 'ngx-bootstrap';
import { NotFoundModule } from '../../components/not-found/not-found.module';
import { FinanceSettingComponent } from './finance.component';
import { financeSettingRoutingModule } from './finance-routing.module';
import { OpenBalanceComponent } from './open-balance/open-balance.component';
import { PaymentModeComponent } from '../payment-mode/payment-mode.component';
import { paymentModeModule } from '../payment-mode/payment-mode.module';
import { PageHeaderModule } from '../../../shared';
import { SettingsNewModule } from '../settings-new.module';
import { Rev_adjustment } from './Rev_adjustment/Rev_adjustment.component';


@NgModule({
    imports: [
        CommonModule,
        GridAllModule,
        TabModule,
        PagerModule,
        MatTableModule,
        MatSortModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        PageHeaderModule,
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
        financeSettingRoutingModule,
        DatePickerModule,
        DateRangePickerModule
    ],
    declarations: [
        FinanceSettingComponent,
        OpenBalanceComponent,
        Rev_adjustment,
        PaymentPrefixComponent
    ]
})
export class financeSettingModule { }
