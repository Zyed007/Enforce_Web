import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostTypeDesignComponent } from './cost-type-design.component';

const routes: Routes = [
    {
        path: '',
        component: CostTypeDesignComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CostTypeDesignRoutingModule {}
