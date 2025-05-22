import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskTemplateComponent } from './task-template.component';

const routes: Routes = [
    {
        path: '',
        component: TaskTemplateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskTemplateRoutingModule {}
