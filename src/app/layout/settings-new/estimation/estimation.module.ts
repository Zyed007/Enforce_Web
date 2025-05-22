import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { estimationSettingRoutingModule } from './estimation-routing.module';
import { EstimationComponent } from './estimation.component';
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
import { AddServiceComponent } from './add-Service/add-service.component';
import { AddPaymentTermComponent } from './add-payment-term/add-payment-term.component';
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { BuildingTypeComponent } from './add-building-type/building-type.component';
import { IntfutNewServiceComponent } from './intfut-new-service/intfut-new-service.component';
import { UnitTypeComponent } from './add-unit-type/unit-type.component';
import {IntfutServiceTemplates} from './intfut-service-templates/intfut-service-templates';
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { MatExpansionModule } from '@angular/material';
import { IntfutServiceRules } from './intfut-rules/intfut-rules.component';

@NgModule({
    imports: [
      CommonModule,
      estimationSettingRoutingModule,
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
      MultiSelectModule,
      AccordionModule,
      MatExpansionModule,
    ],
    declarations: [
      EstimationComponent,
      AddServiceComponent,
      AddPaymentTermComponent,
      BuildingTypeComponent,
      IntfutNewServiceComponent,
      UnitTypeComponent,
      IntfutServiceTemplates,
      IntfutServiceRules
    
    ]
})
export class estimationSettingModule {}
