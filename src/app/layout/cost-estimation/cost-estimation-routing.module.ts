import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostEstimationComponent } from './cost-estimation.component';

const routes: Routes = [
    {
        path: '',
        component: CostEstimationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CostEstimationNewRoutingModule {}
