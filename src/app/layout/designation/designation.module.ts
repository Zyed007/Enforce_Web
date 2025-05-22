import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignationRoutingModule } from './designation-routing.module';
import { DesignationComponent } from './designation.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule, MatIconModule } from '@angular/material';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
    imports: [CommonModule,MatIconModule,GridAllModule,PagerModule, DesignationRoutingModule,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule,Select2Module,FormsModule, ReactiveFormsModule],
    declarations: [DesignationComponent]
})
export class DesignationModule {}
