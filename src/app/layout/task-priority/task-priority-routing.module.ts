import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskPriorityComponent } from './task-priority.component';

const routes: Routes = [
    {
        path: '',
        component: TaskPriorityComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskPriorityRoutingModule {}
