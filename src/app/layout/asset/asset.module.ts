import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Select2Module } from "ng2-select2";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckBoxModule } from "@syncfusion/ej2-angular-buttons";
import {
  MatTableModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatSortModule,
} from "@angular/material";
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { GridAllModule, PagerModule } from "@syncfusion/ej2-angular-grids";
import { TabModule } from "@syncfusion/ej2-angular-navigations";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";
import { UploaderModule } from "@syncfusion/ej2-angular-inputs";
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';

//complonent
import { AssetComponent } from "./asset.component";
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { NotFoundModule } from "../components/not-found/not-found.module";
import { AssetRoutingModule } from "./asset-routing.module";
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';

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
    // PageHeaderModule,
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
    AssetRoutingModule,
    SwitchModule
  ],
  declarations: [
    AssetComponent,
  ],
})
export class AssetModule { }
