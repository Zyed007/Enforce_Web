import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectTypeRoutingModule } from './project-type-routing.module';
import { ProjectTypeComponent } from './project-type.component';
import { PageHeaderModule } from './../../shared';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
    imports: [CommonModule,GridAllModule,PagerModule,MatTableModule,MatSortModule,MatToolbarModule,MatFormFieldModule,MatInputModule, ProjectTypeRoutingModule,PageHeaderModule,Select2Module, FormsModule, ReactiveFormsModule ],
    declarations: [ProjectTypeComponent]
})
export class ProjectTypeModule {}
