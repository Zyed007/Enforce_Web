import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeTypeComponent } from './employee-type.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeeTypeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeTypeRoutingModule {}
