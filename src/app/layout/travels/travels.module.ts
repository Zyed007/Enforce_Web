import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAllModule,PagerModule } from '@syncfusion/ej2-angular-grids';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { GlobalConstants } from '../../global-constants/constants';
import { Select2Module } from 'ng2-select2';
import {DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';
import {TravelsComponent} from './travels.component';
import {TravelsRoutingModule} from './travels.routing.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";
import {
  MatTableModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatSortModule,
} from "@angular/material";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
@NgModule({
  declarations: [
    TravelsComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    TravelsRoutingModule,
    GridAllModule,
    MatTableModule,
    NgbModule,
    NgxMaterialTimepickerModule,
    MatExpansionModule,
    PagerModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    UploaderModule,
    DropDownListModule,
    AgmCoreModule.forRoot({
      apiKey: GlobalConstants.apiKey,
      libraries: ['places']
    }),
    DateRangePickerModule
  ]
})
export class TravelsModule { }
