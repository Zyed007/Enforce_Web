import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PageHeaderModule } from "../../../shared";
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
import { AssetSettingComponent } from "./asset-setting.component";
// import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { NotFoundModule } from "../../components/not-found/not-found.module";
import {  AssetSettingRoutingModule } from "./asset-routing.module";
import { AssetTypeComponent } from "./asset-type/asset-type.component";
import { AssetStatusComponent } from "./asset-status/asset-status.component";
import { AssetCategoryComponent } from "./asset-category/asset-category.component";
import { AssetPrefixComponent } from "./asset-prefix/asset-prefix.component";

@NgModule({
  imports: [
    CommonModule,
    NotFoundModule,
    AssetSettingRoutingModule,
    Ng2SearchPipeModule,
    Select2Module,
    NgxIntlTelInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatTableModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    RadioButtonModule,
    GridAllModule,
    PagerModule,
    TabModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    DatePickerModule,
    SelectDropDownModule,
    DropDownListModule,
    CheckBoxModule,
    UploaderModule,
    NumericTextBoxModule,
    PageHeaderModule
    
  ],
  declarations: [
    AssetSettingComponent,
    AssetTypeComponent,
    AssetStatusComponent,
    AssetCategoryComponent,
    AssetPrefixComponent
  ],
})
export class AssetSettingModule { }
