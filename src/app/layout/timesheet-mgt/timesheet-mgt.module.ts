import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesheetMgtRoutingModule } from './timesheet-mgt-routing.module';
import { TimesheetMgtComponent } from './timesheet-mgt.component';


import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
import {MatChipsModule} from '@angular/material/chips';
// import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { PageHeaderModule } from './../../shared';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { NotFoundModule } from '../components/not-found/not-found.module';

@NgModule({
    imports: [CommonModule,GridAllModule,PagerModule,NotFoundModule, TimesheetMgtRoutingModule,MatChipsModule,PageHeaderModule,Select2Module,FormsModule, ReactiveFormsModule,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule],
    declarations: [TimesheetMgtComponent]
})
export class TimesheetMgtModule {}
