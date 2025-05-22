import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NotFoundModule } from '../components/not-found/not-found.module';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { GlobalConstants } from '../../global-constants/constants';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TravelClaimRoutingModule } from './travel-claim.routing.module';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { MatIconModule } from '@angular/material/icon';
import { TravelClaimComponent } from './travel-claim.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    TravelClaimComponent
  ],
  imports: [
    CommonModule,
    TravelClaimRoutingModule,
    GridAllModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    DateRangePickerModule,
    NotFoundModule,
    DropDownListModule,
    MatIconModule,
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: GlobalConstants.apiKey,
      libraries: ['places']
    })
  ],
  providers: [DatePipe]
})
export class TravelClaimModule { }
