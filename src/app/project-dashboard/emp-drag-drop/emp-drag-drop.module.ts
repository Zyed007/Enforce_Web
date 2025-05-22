import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MatSidenavModule, MatListModule, MatTableModule } from '@angular/material';
import { EmpDragDropRoutingModule } from './emp-drag-drop-routing.module';
import { EmpDragDropComponent } from './emp-drag-drop.component';
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

  import { ListViewModule } from '@syncfusion/ej2-angular-lists';
  import { TabModule } from '@syncfusion/ej2-angular-navigations';

  import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
  import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
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
  import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
  import { jqxKanbanModule } from 'jqwidgets-ng/jqxkanban';
  import { jqxSplitterModule } from 'jqwidgets-ng/jqxsplitter';
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { GlobalConstants } from '../../global-constants/constants';

@NgModule({
    imports: [
        CommonModule,jqxKanbanModule,MatButtonToggleModule,MatButtonModule,AccordionModule,jqxSplitterModule,MatInputModule,MatSelectModule,MatIconModule,NgbModule,KanbanModule,MatExpansionModule,
        TranslateModule,ListViewModule,TabModule,DropDownListModule,MultiSelectModule,
        EmpDragDropRoutingModule,MatGoogleMapsAutocompleteModule,AccumulationChartModule,GridAllModule,
    FormsModule, ReactiveFormsModule,MatTableModule,DatePickerModule,MatSidenavModule,MatListModule,Select2Module,NgxMaterialTimepickerModule,
    AgmCoreModule.forRoot({
      apiKey: GlobalConstants.apiKey,
      libraries: ['places']
    })
  ],
    declarations: [EmpDragDropComponent],
    providers: [PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationDataLabelService,
      AccumulationAnnotationService]
})
export class EmpDragDropComponentModule {}
