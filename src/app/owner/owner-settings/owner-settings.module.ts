import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerSettingsRoutingModule } from './ower-settings-routing.module';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

//components
import { OwnerSettingsComponent } from './owner-settings.component';
import { AppPlanComponent } from './app-plan/app-plan.component';


@NgModule({
  imports: [
    CommonModule,
    OwnerSettingsRoutingModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    GridAllModule,
    DropDownListModule,
    MatIconModule
  ],
  declarations: [
    OwnerSettingsComponent,
    AppPlanComponent
  ]
})
export class OwnerSettingsComponentModule {}
