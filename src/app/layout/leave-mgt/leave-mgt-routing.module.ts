import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveMgtComponent } from './leave-mgt.component';

const routes: Routes = [
    {
        path: '',
        component: LeaveMgtComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaveMgtRoutingModule {}
