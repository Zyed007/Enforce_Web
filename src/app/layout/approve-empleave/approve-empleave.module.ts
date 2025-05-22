import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproveEmpLeaveRoutingModule } from './approve-empleave-routing.module';
import { ApproveEmpleaveComponent } from './approve-empleave.component';
import { Select2Module } from 'ng2-select2';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { CategoryService, DateTimeService, ScrollBarService, ColumnSeriesService, LineSeriesService, 
    ChartAnnotationService, RangeColumnSeriesService, StackingColumnSeriesService,LegendService, TooltipService
 } from '@syncfusion/ej2-angular-charts';

@NgModule({
    imports: [CommonModule,ChartModule,GridAllModule, ApproveEmpLeaveRoutingModule,DateRangePickerModule,Select2Module,FormsModule, ReactiveFormsModule ],
    declarations: [ApproveEmpleaveComponent],
    providers: [ CategoryService, DateTimeService, ScrollBarService, LineSeriesService, ColumnSeriesService, 
        ChartAnnotationService, RangeColumnSeriesService, StackingColumnSeriesService, LegendService, TooltipService,]

})
export class ApproveEmpLeaveModule {}
