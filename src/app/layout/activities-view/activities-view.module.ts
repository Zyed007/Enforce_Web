import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ActivitiesViewRoutingModule } from './activities-view-routing.module';
import {ActivitiesViewComponent } from './activities-view.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';

import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';



@NgModule({
    imports: [CommonModule,AccumulationChartModule,GridAllModule,DateRangePickerModule,ActivitiesViewRoutingModule,Select2Module,FormsModule, ReactiveFormsModule,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule],
    declarations: [ActivitiesViewComponent]
})
export class ActivitiesViewModule {}
