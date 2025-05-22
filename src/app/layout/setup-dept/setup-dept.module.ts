import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupDeptRoutingModule } from './setup-dept-routing.module';
import { SetupDeptComponent } from './setup-dept.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { SatPopoverModule } from '@ncstate/sat-popover';


@NgModule({
    imports: [CommonModule ,SetupDeptRoutingModule,Select2Module,MatTableModule,SatPopoverModule, MatToolbarModule,DatePickerModule, MatFormFieldModule, MatInputModule, MatSortModule,Select2Module,FormsModule, ReactiveFormsModule],
    declarations: [SetupDeptComponent]
})
export class SetupDeptModule {}
