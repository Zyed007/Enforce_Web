import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppSupAdminNotificationComponent } from './app-sup-admin-notification.component';

const routes: Routes = [
    {
        path: '',
        component: AppSupAdminNotificationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppSupAdminNotificationRoutingModule {}
