import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageSetupRoutingModule } from './package-setup-routing.module';
import { PackageSetupComponent } from './package-setup.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
import { DatepickerModule } from '../components/datepicker.module';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';


@NgModule({
    imports: [CommonModule,GridAllModule,PagerModule, PackageSetupRoutingModule,Select2Module,MatTableModule, MatToolbarModule,DatepickerModule, MatFormFieldModule, MatInputModule, MatSortModule,Select2Module,FormsModule, ReactiveFormsModule],
    declarations: [PackageSetupComponent]
})
export class PackageSetupModule {}
