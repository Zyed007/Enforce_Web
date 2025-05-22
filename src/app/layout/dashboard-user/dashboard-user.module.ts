import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardUserRoutingModule } from './dashboard-user-routing.module';
import { DashboardUserComponent } from './dashboard-user.component';
import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent
} from './components';
//import { StatModule } from '../../shared';
//import { NgxTimerModule } from 'ngx-timer';
import { Select2Module } from 'ng2-select2';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
//import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgxMultiLineEllipsisModule } from "ngx-multi-line-ellipsis";

// import { NgClockPickerLibModule } from 'ng-clock-picker-lib';
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

//import { NgClockPickerLibModule } from 'ng-clock-picker-lib';
//  import { ClockPickerDirective } from './clock-picker.directive';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

 import { FilterPipe } from '../../services/myFilter.service';
 import{ GlobalConstants } from '../../global-constants/constants';
// import {FilterModule} from '../fiter.module'

@NgModule({
    imports: [
        CommonModule,SliderModule,
        NgbCarouselModule,
        NgbAlertModule,NgxMultiLineEllipsisModule,
    DashboardUserRoutingModule,
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
    //StatModule,
    //NgxTimerModule,
    Select2Module,
    AutocompleteLibModule,
    //GridModule,
    FormsModule,
    ReactiveFormsModule,
   NgxMaterialTimepickerModule,
        // NgClockPickerLibModule,
        MatToolbarModule,
        MatTableModule,NgbModule,MatFormFieldModule,
        AgmCoreModule.forRoot({
          apiKey: GlobalConstants.apiKey,
          libraries: ['places','geometry']
        }),
        // MatGoogleMapsAutocompleteModule.forRoot()
        CdTimerModule

    ],
    declarations: [
      DashboardUserComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent,
        FilterPipe
        // ClockPickerDirective
    ],
    providers: [
      {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
      }
    ]
//providers: [PageService, SortService, FilterService, GroupService]
})
export class DashboardUserModule {}
