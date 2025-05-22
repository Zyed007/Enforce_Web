import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  GridAllModule,
  SearchService,
  ToolbarService,
} from "@syncfusion/ej2-angular-grids";
import { TabModule } from "@syncfusion/ej2-angular-navigations";
import { DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";
import { SwitchModule } from "@syncfusion/ej2-angular-buttons";
import { PayrollRoutingModule } from "./payroll-routing.module";
import { PayrollComponent } from "./payroll.component";
import {
  DatePickerModule,
  DateRangePickerModule,
} from "@syncfusion/ej2-angular-calendars";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotFoundModule } from "../components/not-found/not-found.module";
import { MatTabsModule } from "@angular/material/tabs";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UploaderModule } from "@syncfusion/ej2-angular-inputs";
import { RadioButtonModule } from "@syncfusion/ej2-angular-buttons";
import { CheckBoxModule } from "@syncfusion/ej2-angular-buttons";
import { AgmCoreModule } from "@agm/core";
//Pipes
import { FormatMoneyPipe } from "../../format-money.pipe";
//Component
import { AdjustmentComponent } from "./adjustments/adjustment.component";
import { ExpensessComponent } from "./expensess/expensess.component";
import { VariablpayComponent } from "./variablepay/variablepay.component";
import { LoanpaymentsComponent } from "./loanpayments/loanpayments.component";
import { GlobalConstants } from "../../global-constants/constants";
import { PaymentVoucherModule } from "../payment-voucher/payment-voucher.module";


@NgModule({
  imports: [
    CommonModule,
    PayrollRoutingModule,
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
    DatePickerModule,
    UploaderModule,
    RadioButtonModule,
    CheckBoxModule,
    PaymentVoucherModule,
    AgmCoreModule.forRoot({
      apiKey: GlobalConstants.apiKey,
      libraries: ["places"],
    }),
  ],
  exports: [],
  declarations: [
    PayrollComponent,
    AdjustmentComponent,
    ExpensessComponent,
    VariablpayComponent,
    LoanpaymentsComponent,
    FormatMoneyPipe,
  ],
  providers: [DatePipe, SearchService, ToolbarService],
})
export class PayrollModule {}
