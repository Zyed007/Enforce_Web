import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardUserNewRoutingModule } from './dashboard-user-new-routing.module';
import { DashboardUserNewComponent } from './dashboard-user-new.component';
import { Select2Module } from 'ng2-select2';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgxMultiLineEllipsisModule } from "ngx-multi-line-ellipsis";
import {
    MatToolbarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule ,MatIconModule,MatButtonToggleModule, MatRadioModule,MatTooltipModule
  } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import { AgmCoreModule } from '@agm/core';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { NgxTimerModule } from 'ngx-timer';
import { SliderModule } from '@syncfusion/ej2-angular-inputs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TagInputModule } from 'ngx-chips';
import { CdTimerModule } from 'angular-cd-timer';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { TabModule } from '@syncfusion/ej2-angular-navigations';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { FilterPipe } from '../../services/DashFilter.service';
import { GlobalConstants } from '../../global-constants/constants';
import { AddTaskComponent } from './add-task/add-task.component';

@NgModule({
  imports: [
      CommonModule,
      SliderModule,
      NgbCarouselModule,
      NgbAlertModule,
      NgxMultiLineEllipsisModule,
      MatExpansionModule,
      MatInputModule ,
      GridAllModule,
      MatIconModule,
      TagInputModule,
      MatButtonToggleModule,
      MatRadioModule,PerfectScrollbarModule,
      MatGoogleMapsAutocompleteModule,
      DatePickerModule,
      MatProgressSpinnerModule,
      MatTooltipModule,
      NgxTimerModule,DateRangePickerModule,
      Select2Module,
      AutocompleteLibModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaterialTimepickerModule,
      MatToolbarModule,
      MatTableModule,NgbModule,MatFormFieldModule,
      TabModule,
      AgmCoreModule.forRoot({
        apiKey: GlobalConstants.apiKey,
        libraries: ['places','geometry']
      }),
      CdTimerModule,
      DashboardUserNewRoutingModule,
      Ng2SearchPipeModule,
      CheckBoxModule
    ],
    declarations: [
      DashboardUserNewComponent,
      FilterPipe,
      AddTaskComponent
    ],
    providers: [
      {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
      }
    ]
})
export class DashboardUserNewModule {}
