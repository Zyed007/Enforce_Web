import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationProfileComponent } from './organization-profile.component';

const routes: Routes = [
    {
        path: '',
        component: OrganizationProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationProfileRoutingModule {}
