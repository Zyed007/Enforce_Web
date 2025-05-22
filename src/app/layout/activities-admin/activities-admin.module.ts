import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule,NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ActivitiesAdminRoutingModule } from './activities-admin-routing.module';
import { ActivitiesAdminComponent } from './activities-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { StatModule } from '../../shared';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { Select2Module } from 'ng2-select2';
import { ChartAllModule, AccumulationChartAllModule, RangeNavigatorAllModule } from '@syncfusion/ej2-angular-charts';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DateTimeService, LineSeriesService, DateTimeCategoryService, StripLineService} from '@syncfusion/ej2-angular-charts';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatGridListModule} from '@angular/material/grid-list'
// import { NgClockPickerLibModule } from 'ng-clock-picker-lib';

import {
    MatToolbarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule ,MatIconModule,MatButtonToggleModule, MatRadioModule,MatTooltipModule
  } from '@angular/material';
  import {MatCardModule} from '@angular/material/card';
  import { NgImageSliderModule } from 'ng-image-slider';
  import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { GlobalConstants } from '../../global-constants/constants';

@NgModule({
    imports: [
        CommonModule,MatGridListModule,MatCardModule,NgImageSliderModule,NgImageFullscreenViewModule,
        NgbCarouselModule,TabModule,ScheduleModule,NgxMaterialTimepickerModule,MatTableModule,
        NgbAlertModule,NgbModule,DropDownListAllModule,
        ActivitiesAdminRoutingModule,GridAllModule,Select2Module,ChartAllModule,AccumulationChartAllModule, RangeNavigatorAllModule,
        StatModule,DatePickerModule,MatButtonToggleModule,DateRangePickerModule,FormsModule, ReactiveFormsModule,
        // AgmCoreModule.forRoot({
        //     apiKey: GlobalConstants.apiKey,
        //     libraries: ['places']
        //   })
    ],
    declarations: [
        ActivitiesAdminComponent,
        
    ],
    providers: [ DateTimeService, LineSeriesService, DateTimeCategoryService, StripLineService]
})
export class ActivitiesAdminModule {}
