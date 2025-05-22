import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SettingsNewRoutingModule } from "./settings-new-routing.module";
import { SettingsNewComponent } from "./settings-new.component";
import { PageHeaderModule } from "./../../shared";
import { Select2Module } from "ng2-select2";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckBoxModule } from "@syncfusion/ej2-angular-buttons";
import {
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatSortModule,
  MatExpansionModule,

  
} from "@angular/material";
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { GridAllModule, PagerModule } from "@syncfusion/ej2-angular-grids";
import { TabModule } from "@syncfusion/ej2-angular-navigations";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DatePickerModule,DateRangePickerModule} from "@syncfusion/ej2-angular-calendars";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";
import { UploaderModule } from "@syncfusion/ej2-angular-inputs";
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SliderModule } from '@syncfusion/ej2-angular-inputs';
import { TranslateModule } from '@ngx-translate/core';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { MatSidenavModule, MatListModule, MatTableModule } from '@angular/material';

//complonent
import { TeamMembersComponent } from "./team-members/team-members.component";
import { TeamsComponent } from "./teams/teams.component";
import { LeaveManagementComponent } from "./leave-management/leave-management.component";
import { CaseTypeComponent } from "./case-type/case-type.component";
import { OpenBalanceComponent } from "./open-balance/open-balance.component";
import { NotFoundModule } from "../components/not-found/not-found.module";

import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { PaymentModeComponent } from "./payment-mode/payment-mode.component";
import { FinanceSettingComponent } from "./finance/finance.component";

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
    SettingsNewRoutingModule,
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
    DateRangePickerModule,
    NgbDropdownModule,
    SliderModule,
    MatExpansionModule,
    TranslateModule,
    ListViewModule,
    MatGoogleMapsAutocompleteModule,
    AccumulationChartModule,
    MatSidenavModule,
    MatTableModule,
    
  ],
  declarations: [
    SettingsNewComponent,
    TeamMembersComponent,
    TeamsComponent,
    LeaveManagementComponent,
    CaseTypeComponent,
    OpenBalanceComponent,
    // PayrollComponent,
    // PaymentComponent,
    // FinanceSettingComponent,
    // PaymentModeComponent
  ],
  exports:[
    // PaymentModeComponent
  ]

})
export class SettingsNewModule { }
