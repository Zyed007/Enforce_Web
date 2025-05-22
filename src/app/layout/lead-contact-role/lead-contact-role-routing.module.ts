import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadContactRoleComponent } from './lead-contact-role.component';

const routes: Routes = [
    {
        path: '',
        component: LeadContactRoleComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeadContactRoleRoutingModule {}
