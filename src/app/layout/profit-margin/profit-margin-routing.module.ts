import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfitMarginComponent } from './profit-margin.component';

const routes: Routes = [
    {
        path: '',
        component: ProfitMarginComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfitMarginRoutingModule {}
