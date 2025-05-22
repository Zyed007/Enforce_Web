import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostLayoutComponent } from './cost-layout.component';

const routes: Routes = [
    {
        path: '',
        component: CostLayoutComponent
        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CostLayoutRoutingModule {}
