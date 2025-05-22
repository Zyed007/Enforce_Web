import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ownerDashboardRoutingModule } from './owner-dashboard-routing.module';
import { OwnerDashboardComponent } from './owner-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ownerDashboardRoutingModule,
    DatePickerModule,
    DateRangePickerModule
   ],
  declarations: [
    OwnerDashboardComponent
  ]
})
export class OwnerDashboardComponentModule {}
