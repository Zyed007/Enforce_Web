import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeStatusComponent } from './employee-status.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeeStatusComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeStatusRoutingModule {}
