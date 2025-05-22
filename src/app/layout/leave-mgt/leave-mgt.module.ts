import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveMgtRoutingModule } from './leave-mgt-routing.module';
import { LeaveMgtComponent } from './leave-mgt.component';
import { Select2Module } from 'ng2-select2';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import {
    MatToolbarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule ,MatIconModule,MatButtonToggleModule, MatRadioModule,MatTooltipModule
  } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import { AgmCoreModule } from '@agm/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { GlobalConstants } from '../../global-constants/constants';
import { NotFoundModule } from '../components/not-found/not-found.module';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DatePipe } from '@angular/common';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';

@NgModule({
    imports: [CommonModule,MatTableModule,NgbModule,NgxMaterialTimepickerModule,MatButtonToggleModule,GridAllModule,MatExpansionModule, LeaveMgtRoutingModule,DateRangePickerModule,Select2Module,FormsModule,TabModule,
      ReactiveFormsModule,AgmCoreModule.forRoot({
        apiKey: GlobalConstants.apiKey,
        libraries: ['places']
      }),
      NotFoundModule,
      DropDownListModule,
      RadioButtonModule,
      MatIconModule,
      UploaderModule
    ],
    declarations: [LeaveMgtComponent],
    providers: [DatePipe]
})
export class LeaveMgtModule {}
