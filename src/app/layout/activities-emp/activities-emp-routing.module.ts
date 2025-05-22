import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivitiesEmpComponent } from './activities-emp.component';

const routes: Routes = [
    {
        path: '', component: ActivitiesEmpComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivitiesEmpRoutingModule {
}
