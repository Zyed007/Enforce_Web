import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadStageComponent } from './lead-stage.component';

const routes: Routes = [
    {
        path: '',
        component: LeadStageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeadStageRoutingModule {}
