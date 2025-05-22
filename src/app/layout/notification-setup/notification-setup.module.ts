import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule,NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NotificationSetupRoutingModule } from './notification-setup-routing.module';
import { NotificationSetupComponent } from './notification-setup.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule,MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSortModule, MatButtonToggleModule } from '@angular/material';
import { DatepickerModule } from '../components/datepicker.module';
import { MatTableExporterModule } from 'mat-table-exporter';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { TagInputModule } from 'ngx-chips';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { TabModule } from '@syncfusion/ej2-angular-navigations';

@NgModule({
    imports: [CommonModule,GridAllModule,TabModule,MultiSelectAllModule,AngularMultiSelectModule,TagInputModule,NgbModule,DropDownListModule,MultiSelectModule,MatTableExporterModule,MatButtonToggleModule,NgxPaginationModule,DatePickerModule, NotificationSetupRoutingModule,MatPaginatorModule,Select2Module,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule,Select2Module,FormsModule, ReactiveFormsModule],
    declarations: [NotificationSetupComponent]
})
export class NotificationSetupModule {}
