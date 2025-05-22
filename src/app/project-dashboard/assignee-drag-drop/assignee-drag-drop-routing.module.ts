import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssigneeDragDropComponent } from './assignee-drag-drop.component';

const routes: Routes = [
    {
        path: '',
        component: AssigneeDragDropComponent

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssigneeDragDropRoutingModule {}
