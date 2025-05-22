import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkforceMembersComponent } from './workforce-members.component';

const routes: Routes = [
    {
        path: '',
        component: WorkforceMembersComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class workforceMembersRoutingModule {}
