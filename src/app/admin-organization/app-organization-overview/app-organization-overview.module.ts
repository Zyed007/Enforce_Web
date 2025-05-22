import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//routing module
import { AppOrganizationOverviewRoutingModule } from './app-organization-overview-routing.module';
//component module
import { AppOrganizationOverviewComponent } from './app-organization-overview.component';
import { AppProfileComponent } from './app-profile/app-profile.component';
//plugin Comp
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
//plugin
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AgmCoreModule } from '@agm/core';
import{ GlobalConstants } from '../../global-constants/constants';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";

@NgModule({
    imports: [
      CommonModule,
      AppOrganizationOverviewRoutingModule,
      GridAllModule,
      ButtonModule,
      FormsModule,
      ReactiveFormsModule,
      Select2Module,
      NgbModule,
      Ng2SearchPipeModule,
      TabModule,
      MatCheckboxModule,
      DatePickerModule,
      MatTabsModule,
      MatProgressSpinnerModule,
      NgxIntlTelInputModule,
      DropDownListModule,
      SelectDropDownModule,
      AgmCoreModule.forRoot({
        apiKey: GlobalConstants.apiKey,
        libraries: ['places']
      })
    ],
    declarations: [
      AppOrganizationOverviewComponent,
      AppProfileComponent
    ]
})

export class AppOrganizationOverviewModule {}
