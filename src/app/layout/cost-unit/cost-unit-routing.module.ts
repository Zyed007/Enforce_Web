import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostUnitComponent } from './cost-unit.component';

const routes: Routes = [
    {
        path: '',
        component: CostUnitComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CostUnitRoutingModule {}
