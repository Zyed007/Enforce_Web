import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivitiesAdminComponent } from './activities-admin.component';

const routes: Routes = [
    {
        path: '', component: ActivitiesAdminComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivitiesAdminRoutingModule {
}
