import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpTeamSetupComponent } from './emp-team-setup.component';

const routes: Routes = [
    {
        path: '', component: EmpTeamSetupComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmpTeamSetupRoutingModule {
}
