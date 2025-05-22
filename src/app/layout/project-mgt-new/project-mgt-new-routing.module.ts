import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectMgtNewComponent } from './project-mgt-new.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectMgtNewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectMgtNewRoutingModule {}
