import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAllModule, SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';

import { hrEmployeeRoutingModule } from './hr-employee-routing.module';
import { HrEmployeeComponent } from './hr-employee.component';
import { DatePickerModule,DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NotFoundModule } from '../components/not-found/not-found.module';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';
import { SelectDropDownModule } from "ngx-select-dropdown";
import { LayoutModule } from '../layout.module';
import { PaymentVoucherModule } from '../payment-voucher/payment-voucher.module';

@NgModule({
    imports: [
      CommonModule,
      hrEmployeeRoutingModule,
      DateRangePickerModule,
      FormsModule,
      ReactiveFormsModule,
      GridAllModule,
      TabModule,
      DropDownListModule,
      NotFoundModule,
      NgbModule,
      SwitchModule,
      MatTabsModule,
      SelectDropDownModule,
      DatePickerModule,
      UploaderModule,
      LayoutModule,
      PaymentVoucherModule
    ],
    declarations: [
      HrEmployeeComponent
    ],
    providers: [DatePipe, SearchService, ToolbarService]
})
export class hrEmployeeModule {}
