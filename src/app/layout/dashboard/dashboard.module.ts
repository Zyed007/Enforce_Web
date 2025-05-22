import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule,NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NotFoundModule } from '../components/not-found/not-found.module';

import { StatModule } from '../../shared';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { Select2Module } from 'ng2-select2';
import { NgxMultiLineEllipsisModule } from "ngx-multi-line-ellipsis";
import { GlobalConstants } from '../../global-constants/constants';


@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule,
        NgbAlertModule,NgbModule,
        DashboardRoutingModule,GridAllModule,Select2Module,NgxMultiLineEllipsisModule,NotFoundModule,
        StatModule,DatePickerModule,MatButtonToggleModule,DateRangePickerModule,FormsModule, ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: GlobalConstants.apiKey,
            libraries: ['places']
          })
    ],
    declarations: [
        DashboardComponent,
        
    ]
})
export class DashboardModule {}
