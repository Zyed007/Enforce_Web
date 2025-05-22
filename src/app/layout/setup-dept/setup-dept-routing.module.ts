import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupDeptComponent } from './setup-dept.component';

const routes: Routes = [
    {
        path: '',
        component: SetupDeptComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SetupDeptRoutingModule {}
