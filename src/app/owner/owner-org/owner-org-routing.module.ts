import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnerOrgComponent } from './owner-org.component';

const routes: Routes = [
    {
        path: '',
        component: OwnerOrgComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OwnerOrgRoutingModule {}
