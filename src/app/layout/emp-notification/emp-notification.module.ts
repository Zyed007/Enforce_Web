import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EmpNotificationComponent} from './emp-notification.component';
import {empNotificationRoutingModule} from './emp-notification.routing.module';
import { GridModule, SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';

@NgModule({
  declarations: [
    EmpNotificationComponent
  ],
  imports: [
    CommonModule,
    empNotificationRoutingModule,
    GridModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    DateRangePickerModule
  ],
  providers: [SearchService, ToolbarService]
})
export class EmpNotificationModule { }
