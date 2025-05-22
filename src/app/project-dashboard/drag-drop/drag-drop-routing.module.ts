import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DragDropComponent } from './drag-drop.component';

const routes: Routes = [
    {
        path: '',
        component: DragDropComponent

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DragDropRoutingModule {}
