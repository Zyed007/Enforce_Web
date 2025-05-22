import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizeProfileComponent } from './organize-profile.component';

const routes: Routes = [
    {
        path: '',
        component: OrganizeProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizeProfileRoutingModule {}
