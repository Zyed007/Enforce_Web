import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectTypeComponent } from './project-type.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectTypeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectTypeRoutingModule {}
