import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeNewComponent } from './employee-new.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeeNewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeNewRoutingModule {}
