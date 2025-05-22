import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectDashboardComponent } from './project-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectDashboardComponent,
        children:[
            {path:'',loadChildren: () => import('./project-layout/project-layout.module').then(m => m.ProjectLayoutComponentModule)},
            { path: 'project-layout', loadChildren: () => import('./project-layout/project-layout.module').then(m => m.ProjectLayoutComponentModule) },
            { path: 'drag-drop', loadChildren: () => import('./drag-drop/drag-drop.module').then(m => m.DragDropComponentModule) },
            { path: 'cost-layout', loadChildren: () => import('./cost-layout/cost-layout.module').then(m => m.CostLayoutComponentModule) },
            { path: 'employee-layout', loadChildren: () => import('./emp-drag-drop/emp-drag-drop.module').then(m => m.EmpDragDropComponentModule) },
            //new-routes
            { path: 'assignee-drag-drop', loadChildren: () => import('./assignee-drag-drop/assignee-drag-drop.module').then(m => m.AssigneeDragDropComponentModule) },
            { path: 'project-layout-new', loadChildren: () => import('./project-layout-new/project-layout-new.module').then(m => m.ProjectLayoutNewComponentModule) },
            { path: 'drag-drop-new', loadChildren: () => import('./drag-drop-new/drag-drop-new.module').then(m => m.DragDropNewComponentModule) },
            { path: 'task-undo', loadChildren: () => import('./undo-task/undo-task.module').then(m => m.undoTaskComponentModule) },
            // { path: 'project-layout/:id', loadChildren: () => import('./project-layout/project-layout.module').then(m => m.ProjectLayoutComponentModule) },

        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectDashboardRoutingModule {}



