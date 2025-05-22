import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskStatusComponent } from './task-status.component';

const routes: Routes = [
    {
        path: '',
        component: TaskStatusComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskStatusRoutingModule {}
