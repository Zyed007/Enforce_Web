import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';


import { workforceMembersRoutingModule } from './workforce-members-routing.module';
import { WorkforceMembersComponent } from './workforce-members.component';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NotFoundModule } from '../components/not-found/not-found.module';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
      CommonModule,
      workforceMembersRoutingModule,
      DateRangePickerModule,
      FormsModule,
      ReactiveFormsModule,
      GridAllModule,
      TabModule,
      DropDownListModule,
      NotFoundModule,
      NgbModule,
      CheckBoxModule
    ],
    declarations: [
      WorkforceMembersComponent
    ],
    providers: [DatePipe]
})
export class workforceMembersModule {}
