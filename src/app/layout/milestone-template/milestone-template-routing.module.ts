import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MilestoneTemplateComponent } from './milestone-template.component';

const routes: Routes = [
    {
        path: '',
        component: MilestoneTemplateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MilestoneTemplateRoutingModule {}
