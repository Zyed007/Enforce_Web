import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveStatusComponent } from './leave-status.component';

const routes: Routes = [
    {
        path: '',
        component: LeaveStatusComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaveStatusRoutingModule {}
