import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveSetupComponent } from './leave-setup.component';

const routes: Routes = [
    {
        path: '',
        component: LeaveSetupComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaveSetupRoutingModule {}
