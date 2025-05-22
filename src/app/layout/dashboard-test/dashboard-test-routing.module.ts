import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { DashboardComponent } from './dashboard/dashboard-test/.component';
import { DashboardTestComponent } from './dashboard-test.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardTestComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardTestRoutingModule {
}





