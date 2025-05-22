import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdministrativeRoutingModule } from './administrative-routing.module';
import {AdministrativeComponent } from './administrative.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';

import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';


@NgModule({
    imports: [CommonModule,GridAllModule,PagerModule,AdministrativeRoutingModule,Select2Module,FormsModule, ReactiveFormsModule,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule],
    declarations: [AdministrativeComponent]
})
export class AdministrativeModule {}
