import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadPrefixRoutingModule } from './lead-prefix-routing.module';
import { LeadPrefixComponent } from './lead-prefix.component';
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

@NgModule({
    imports: [CommonModule,GridAllModule,DropDownListModule,MultiSelectModule,MatTableExporterModule,MatButtonToggleModule,NgxPaginationModule,DatePickerModule, LeadPrefixRoutingModule,MatPaginatorModule,Select2Module,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule,Select2Module,FormsModule, ReactiveFormsModule],
    declarations: [LeadPrefixComponent]
})
export class LeadPrefixModule {}
