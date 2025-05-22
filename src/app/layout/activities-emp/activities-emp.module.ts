import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule,NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ActivitiesEmpRoutingModule } from './activities-emp-routing.module';
import { ActivitiesEmpComponent } from './activities-emp.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { StatModule } from '../../shared';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { Select2Module } from 'ng2-select2';
import { LegendService, TooltipService, RangeTooltipService, CategoryService } from '@syncfusion/ej2-angular-charts';
import { ChartAllModule, AccumulationChartAllModule, RangeNavigatorAllModule } from '@syncfusion/ej2-angular-charts';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DateTimeService, LineSeriesService, DateTimeCategoryService, StripLineService} from '@syncfusion/ej2-angular-charts';
import { GlobalConstants } from '../../global-constants/constants';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule,TabModule,ScheduleModule,
        NgbAlertModule,NgbModule,DropDownListAllModule,
        ActivitiesEmpRoutingModule,GridAllModule,Select2Module,ChartAllModule,AccumulationChartAllModule, RangeNavigatorAllModule,
        StatModule,DatePickerModule,MatButtonToggleModule,DateRangePickerModule,FormsModule, ReactiveFormsModule
        // AgmCoreModule.forRoot({
        //     apiKey: GlobalConstants.apiKey,
        //     libraries: ['places']
        //   })
    ],
    declarations: [
        ActivitiesEmpComponent,

    ],
    providers: [ DateTimeService, LineSeriesService, DateTimeCategoryService, StripLineService,TooltipService]
})
export class ActivitiesEmpModule {}
