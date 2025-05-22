import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { vendorRoutingModule } from './vendor-routing.module';
import { VendorsComponent } from './vendors.component';
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
import { VendorActivityComponent } from './vendor-activity/vendor-activity.component';
import { VendorStatusComponent } from './vendor-status/vendor-status.component';
import { VendorDocComponent } from './vendor-doc/vendor-doc.component';

@NgModule({
    imports: [
      CommonModule,
      vendorRoutingModule,
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
        VendorsComponent,
        VendorActivityComponent,
        VendorStatusComponent,
        VendorDocComponent,
    ]
})
export class vendorModule {}
