import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardDetailsRoutingModule } from './dashboard-details-routing.module';
import { DashboardDetailsComponent } from './dashboard-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

import {
    MatToolbarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule ,MatIconModule,MatButtonToggleModule, MatRadioModule
  } from '@angular/material';
import { GridAllModule,PageService,ToolbarService, PagerModule } from '@syncfusion/ej2-angular-grids';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AgmCoreModule } from '@agm/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { Select2Module } from 'ng2-select2';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../global-constants/constants';

//  import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
    imports: [CommonModule,Select2Module,MatExpansionModule,NgbModule,ToolbarModule,DashboardDetailsRoutingModule,NgxMaterialTimepickerModule,DateRangePickerModule,MatButtonToggleModule, MatToolbarModule,GridAllModule,
        MatTableModule,PagerModule,
        MatFormFieldModule,
        MatInputModule ,MatIconModule, FormsModule, ReactiveFormsModule, AgmCoreModule.forRoot({
            apiKey: GlobalConstants.apiKey,
            libraries: ['places']
          }),],
    declarations: [DashboardDetailsComponent],
    providers: [PageService, ToolbarService]
})
export class DashboardDetailsModule {}
