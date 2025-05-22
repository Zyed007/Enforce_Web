import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectLayoutComponent } from './project-layout.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectLayoutComponent
        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectLayoutRoutingModule {}
