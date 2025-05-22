import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { commissionSettingRoutingModule } from './commission-routing.module';
import { CommissionComponent } from './commission.component';
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
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { AddCommissionTypeComponent } from './add-commission-type/add-commission-type.component';
import { CommissionPrefixComponent } from './commission-prefix/commission-prefix.component';
import { IncomePaymentComponent } from './income-payment/income-payment.component';

@NgModule({
    imports: [
      CommonModule,
      commissionSettingRoutingModule,
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
      CheckBoxModule
    ],
    declarations: [
      CommissionComponent,
      AddCommissionTypeComponent,
      CommissionPrefixComponent,
      IncomePaymentComponent
    ]
})
export class commissionSettingModule {}
