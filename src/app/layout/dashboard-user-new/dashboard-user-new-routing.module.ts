import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardUserNewComponent } from './dashboard-user-new.component';

const routes: Routes = [
    {
        path: '', component: DashboardUserNewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardUserNewRoutingModule {
}
