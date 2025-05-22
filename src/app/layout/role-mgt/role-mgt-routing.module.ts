import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleMgtComponent } from './role-mgt.component';

const routes: Routes = [
    {
        path: '',
        component: RoleMgtComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleMgtRoutingModule {}
