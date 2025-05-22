import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApproveCheckinComponent } from './approve-checkin.component';

const routes: Routes = [
    {
        path: '',
        component: ApproveCheckinComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApproveCheckinRoutingModule {}
