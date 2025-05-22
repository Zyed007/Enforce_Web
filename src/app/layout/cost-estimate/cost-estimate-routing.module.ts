import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostEstimateComponent } from './cost-estimate.component';

const routes: Routes = [
    {
        path: '',
        component: CostEstimateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CostEstimateRoutingModule {}
