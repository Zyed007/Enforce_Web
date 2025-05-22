import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskTemplateRoutingModule } from './task-template-routing.module';
import { TaskTemplateComponent } from './task-template.component';
import { PageHeaderModule } from './../../shared';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
    imports: [CommonModule,MatTableModule,GridAllModule,PagerModule,MatSortModule,MatToolbarModule,MatFormFieldModule,MatInputModule, TaskTemplateRoutingModule,PageHeaderModule,Select2Module, FormsModule, ReactiveFormsModule ],
    declarations: [TaskTemplateComponent]
})
export class TaskTemplateModule {}
