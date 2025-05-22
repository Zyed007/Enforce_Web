import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationTypeComponent } from './notification-type.component';

const routes: Routes = [
    {
        path: '',
        component: NotificationTypeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationTypeRoutingModule {}
