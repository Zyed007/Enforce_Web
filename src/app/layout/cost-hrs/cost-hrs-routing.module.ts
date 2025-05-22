import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostHrsComponent } from './cost-hrs.component';

const routes: Routes = [
    {
        path: '',
        component: CostHrsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CostHrsRoutingModule {}
