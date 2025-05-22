import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerOrgRoutingModule } from './owner-org-routing.module';
import { OwnerOrgComponent } from './owner-org.component';

import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    OwnerOrgRoutingModule,
    GridAllModule,
    NgbModule,
    DatePickerModule,
    DateRangePickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [OwnerOrgComponent]
})
export class OwnerOrgComponentModule {}
