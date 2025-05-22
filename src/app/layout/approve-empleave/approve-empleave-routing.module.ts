import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApproveEmpleaveComponent } from './approve-empleave.component';

const routes: Routes = [
    {
        path: '',
        component: ApproveEmpleaveComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApproveEmpLeaveRoutingModule {}
