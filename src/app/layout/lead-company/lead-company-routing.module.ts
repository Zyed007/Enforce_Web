import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadCompanyComponent } from './lead-company.component';

const routes: Routes = [
    {
        path: '',
        component: LeadCompanyComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeadCompanyRoutingModule {}
