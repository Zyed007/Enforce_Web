import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EmpNotificationComponent} from './emp-notification.component';

const routes: Routes = [
    {
        path: '', component: EmpNotificationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class empNotificationRoutingModule {
}
