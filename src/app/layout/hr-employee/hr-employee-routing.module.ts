import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrEmployeeComponent } from './hr-employee.component';

const routes: Routes = [
    {
        path: '',
        component: HrEmployeeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class hrEmployeeRoutingModule {}
