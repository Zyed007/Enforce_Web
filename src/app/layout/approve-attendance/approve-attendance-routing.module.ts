import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApproveAttendanceComponent } from './approve-attendance.component';

const routes: Routes = [
    {
        path: '',
        component: ApproveAttendanceComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApproveAttendanceRoutingModule {}
