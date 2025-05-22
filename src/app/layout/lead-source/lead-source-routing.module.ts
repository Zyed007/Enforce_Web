import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadSourceComponent } from './lead-source.component';

const routes: Routes = [
    {
        path: '',
        component: LeadSourceComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeadSourceRoutingModule {}
