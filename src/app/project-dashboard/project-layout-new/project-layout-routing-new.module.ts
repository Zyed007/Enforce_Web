import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectLayoutNewComponent } from './project-layout-new.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectLayoutNewComponent

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectLayoutRoutingNewModule {}
