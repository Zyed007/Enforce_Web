import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { projectSettingRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
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
import { ProjectPrefixComponent } from './project-prefix/project-prefix.component';
import { ProjectClosingComponent } from './project-closing/project-closing.component';

@NgModule({
    imports: [
      CommonModule,
      projectSettingRoutingModule,
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
      ProjectComponent,
      ProjectPrefixComponent,
      ProjectClosingComponent
    ]
})
export class projectSettingModule {}
