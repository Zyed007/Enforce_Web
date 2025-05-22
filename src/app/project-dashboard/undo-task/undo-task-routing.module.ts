import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UndoTaskComponent } from './undo-task.component';

const routes: Routes = [
    {
        path: '',
        component: UndoTaskComponent

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class undoTaskRoutingModule {}
