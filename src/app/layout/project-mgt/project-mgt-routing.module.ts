import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectMgtComponent } from './project-mgt.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectMgtComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectMgtRoutingModule {}
