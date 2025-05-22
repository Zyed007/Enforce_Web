import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxTimerModule } from 'ngx-timer';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ProjectLayoutRoutingNewModule } from './project-layout-routing-new.module';
import { ProjectLayoutNewComponent } from './project-layout-new.component';
import { Select2Module } from 'ng2-select2';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DatePickerModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';

import { AgmCoreModule } from '@agm/core';
import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService, AccumulationDataLabelService } from '@syncfusion/ej2-angular-charts';

import { TagInputModule } from 'ngx-chips';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { FilterPipe } from '../../services/myFilter.service';
import { NotificationComponent } from './components/notification/notification.component';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SliderModule, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ProjFilterNewPipe } from '../../services/projFilterNew.service';
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { GlobalConstants } from '../../global-constants/constants';
import { SelectDropDownModule } from 'ngx-select-dropdown';

// Corrected Angular Material imports
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    NumericTextBoxModule,
    AccordionModule,
    SliderModule,
    NgxIntlTelInputModule,
    MatButtonToggleModule,
    TagInputModule,
    DateRangePickerModule,
    NgxTimerModule,
    UploaderModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    NgbModule,
    MatExpansionModule,
    TranslateModule,
    ListViewModule,
    TabModule,
    DropDownListModule,
    MultiSelectModule,
    ProjectLayoutRoutingNewModule,
    MatGoogleMapsAutocompleteModule,
    AccumulationChartModule,
    GridAllModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    DatePickerModule,
    MatSidenavModule,
    MatListModule,
    Select2Module,
    NgxMaterialTimepickerModule,
    AgmCoreModule.forRoot({
      apiKey: GlobalConstants.apiKey,
      libraries: ['places']
    }),
    SelectDropDownModule,
    // Angular Material Modules
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatGridListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  declarations: [
    ProjectLayoutNewComponent,
    NotificationComponent,
    ProjFilterNewPipe
  ],
  providers: [
    PieSeriesService,
    AccumulationLegendService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    AccumulationAnnotationService
  ]
})
export class ProjectLayoutNewComponentModule {}
