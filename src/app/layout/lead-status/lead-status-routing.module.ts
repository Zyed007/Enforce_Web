import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadStatusComponent } from './lead-status.component';

const routes: Routes = [
    {
        path: '',
        component: LeadStatusComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeadStatusRoutingModule {}
