import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { undoTaskRoutingModule } from './undo-task-routing.module';
import { UndoTaskComponent } from './undo-task.component';

import { Select2Module } from 'ng2-select2';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
    imports: [
        CommonModule,
        undoTaskRoutingModule,
        Select2Module,
        GridAllModule
  ],
    declarations: [UndoTaskComponent],
    providers: []
})
export class undoTaskComponentModule {}
