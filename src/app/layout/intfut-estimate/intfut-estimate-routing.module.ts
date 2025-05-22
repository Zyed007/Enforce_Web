import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntfutEstimateComponent } from './intfut-estimate.component';

const routes: Routes = [
    {
        path: '',
        component: IntfutEstimateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IntfutEstimateRoutingModule {}
