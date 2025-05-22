import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimesheetMgtComponent } from './timesheet-mgt.component';

const routes: Routes = [
    {
        path: '',
        component: TimesheetMgtComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TimesheetMgtRoutingModule {}
