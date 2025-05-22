import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxTimerModule } from 'ngx-timer';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MatSidenavModule, MatListModule, MatTableModule } from '@angular/material';
import { ProjectLayoutRoutingModule } from './project-layout-routing.module';
import { ProjectLayoutComponent } from './project-layout.component';
import { Select2Module } from 'ng2-select2';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
//import { GridModule } from '@syncfusion/ej2-angular-grids';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';

import { AgmCoreModule } from '@agm/core';
import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService,
  AccumulationDataLabelService } from '@syncfusion/ej2-angular-charts';
  import { TagInputModule } from 'ngx-chips';

  import { ListViewModule } from '@syncfusion/ej2-angular-lists';
  import { TabModule } from '@syncfusion/ej2-angular-navigations';

  import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
  import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
  import { FilterPipe } from '../../services/myFilter.service';
  import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  } from '@angular/material';
import { NotificationComponent } from './components/notification/notification.component';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SliderModule } from '@syncfusion/ej2-angular-inputs';
import { ProjFilterPipe } from '../../services/projFilter.service';
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { GlobalConstants } from '../../global-constants/constants';


@NgModule({
    imports: [
        CommonModule,NgbDropdownModule,NumericTextBoxModule,AccordionModule,SliderModule,NgxIntlTelInputModule,MatButtonToggleModule,TagInputModule,DateRangePickerModule,NgxTimerModule,UploaderModule,MatInputModule,MatSelectModule,MatIconModule,NgbModule,MatExpansionModule,
        TranslateModule,ListViewModule,TabModule,DropDownListModule,MultiSelectModule,
        ProjectLayoutRoutingModule,MatGoogleMapsAutocompleteModule,AccumulationChartModule,GridAllModule,
    FormsModule, ReactiveFormsModule,MatTableModule,DatePickerModule,MatSidenavModule,MatListModule,Select2Module,NgxMaterialTimepickerModule,
    AgmCoreModule.forRoot({
      apiKey:GlobalConstants.apiKey,
      libraries: ['places']
    })
  ],
    declarations: [ProjectLayoutComponent, NotificationComponent,ProjFilterPipe],
    providers: [PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationDataLabelService,
      AccumulationAnnotationService]
})
export class ProjectLayoutComponentModule {}
