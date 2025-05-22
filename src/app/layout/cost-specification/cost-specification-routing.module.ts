import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostSpecificationComponent } from './cost-specification.component';

const routes: Routes = [
    {
        path: '',
        component: CostSpecificationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CostSpecificationRoutingModule {}
