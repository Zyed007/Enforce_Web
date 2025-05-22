import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HumanResourceRoutingModule } from './human-resource-routing.module';
import { HumanResourceComponent } from './human-resource.component';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NotFoundModule } from '../components/not-found/not-found.module';

@NgModule({
    imports: [
      CommonModule,
      HumanResourceRoutingModule,
      DateRangePickerModule,
      FormsModule,
      ReactiveFormsModule,
      GridAllModule,
      TabModule,
      DropDownListModule,
      NotFoundModule,
      NgbModule
    ],
    declarations: [
      HumanResourceComponent
    ],
    providers: [DatePipe]
})
export class HumanResourceModule {}
