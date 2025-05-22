import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveTypeComponent } from './leave-type.component';

const routes: Routes = [
    {
        path: '',
        component: LeaveTypeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaveTypeRoutingModule {}
