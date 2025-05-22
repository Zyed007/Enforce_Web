import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {DelegationRoutingModule } from './delegation-routing.module';
import {DelegationComponent } from './delegation.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule,MatIconModule, MatInputModule, MatChipsModule,MatSortModule } from '@angular/material';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TagInputModule } from 'ngx-chips';



@NgModule({
    imports: [CommonModule,TagInputModule,PagerModule,DelegationRoutingModule,MatChipsModule,MatIconModule,DatePickerModule,Select2Module,GridAllModule,FormsModule, ReactiveFormsModule,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule],
    declarations: [DelegationComponent]
})
export class DelegationModule {}
