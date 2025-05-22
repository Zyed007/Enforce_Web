import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdjustmentsComponent } from './adjustments.component';

const routes: Routes = [
    {
        path: '',
        component: AdjustmentsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdjustmentsRoutingModule {}
