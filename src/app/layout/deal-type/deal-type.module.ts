import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealTypeRoutingModule } from './deal-type-routing.module';
import { DealTypeComponent } from './deal-type.component';
import { PageHeaderModule } from './../../shared';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
    imports: [CommonModule,MatTableModule,PagerModule,GridAllModule,MatSortModule,MatToolbarModule,MatFormFieldModule,MatInputModule, DealTypeRoutingModule,PageHeaderModule,Select2Module, FormsModule, ReactiveFormsModule ],
    declarations: [DealTypeComponent]
})
export class DealTypeModule {}
