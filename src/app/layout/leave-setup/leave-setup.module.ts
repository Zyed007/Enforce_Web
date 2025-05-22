import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveSetupRoutingModule } from './leave-setup-routing.module';
import { LeaveSetupComponent } from './leave-setup.component';
import { PageHeaderModule } from './../../shared';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';


@NgModule({
    imports: [CommonModule,MatTableModule,GridAllModule,PagerModule,MatSortModule,MatToolbarModule,MatFormFieldModule,MatInputModule, LeaveSetupRoutingModule,PageHeaderModule,Select2Module, FormsModule, ReactiveFormsModule ],
    declarations: [LeaveSetupComponent]
})
export class LeaveSetupModule {}
