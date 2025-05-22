

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DragDropNewComponent } from './drag-drop-new.component';

const routes: Routes = [
    {
        path: '',
        component: DragDropNewComponent

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DragDropNewRoutingModule {}

