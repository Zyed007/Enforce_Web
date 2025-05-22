import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationSetupComponent } from './notification-setup.component';

const routes: Routes = [
    {
        path: '',
        component: NotificationSetupComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationSetupRoutingModule {}
