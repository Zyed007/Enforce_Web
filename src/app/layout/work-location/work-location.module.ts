import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkLocationRoutingModule } from './work-location-routing.module';
import { WorkLocationComponent } from './work-location.component';
import { PageHeaderModule } from './../../shared';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';


@NgModule({
    imports: [CommonModule,MatTableModule,GridAllModule,PagerModule,MatSortModule,MatToolbarModule,MatFormFieldModule,MatInputModule,WorkLocationRoutingModule,PageHeaderModule,Select2Module, FormsModule, ReactiveFormsModule ],
    declarations: [WorkLocationComponent]
})
export class WorkLocationModule {}

