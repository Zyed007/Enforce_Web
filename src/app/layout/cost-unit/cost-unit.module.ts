import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostUnitRoutingModule } from './cost-unit-routing.module';
import { CostUnitComponent } from './cost-unit.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule,MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSortModule, MatButtonToggleModule } from '@angular/material';
import { DatepickerModule } from '../components/datepicker.module';
import { MatTableExporterModule } from 'mat-table-exporter';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
    imports: [CommonModule,GridAllModule,PagerModule,MatTableExporterModule,MatButtonToggleModule,NgxPaginationModule,DatePickerModule, CostUnitRoutingModule,MatPaginatorModule,Select2Module,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule,Select2Module,FormsModule, ReactiveFormsModule],
    declarations: [CostUnitComponent]
})
export class CostUnitModule {}
