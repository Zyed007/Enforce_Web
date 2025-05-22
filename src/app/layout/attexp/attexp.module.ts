import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';


//import { HumanResourceRoutingModule } from './human-resource-routing.module';
//import { HumanResourceComponent } from './human-resource.component';
import { AttexpRoutingModule } from './attexp-routing.module';
import { AttexpComponent } from './attexp.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NotFoundModule } from '../components/not-found/not-found.module';
import { DatePickerModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@NgModule({
    imports: [
      CommonModule,
      AttexpRoutingModule,
      DateRangePickerModule,
      FormsModule,
      ReactiveFormsModule,
      GridAllModule,
      TabModule,
      DropDownListModule,
      NotFoundModule,
      DatePickerModule,
      UploaderModule,
      NgxMaterialTimepickerModule
    ],
    declarations: [
      AttexpComponent
    ],
    providers: [DatePipe]
})
export class AttexpModule {}
