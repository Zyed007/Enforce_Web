import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DealTypeComponent } from './deal-type.component';

const routes: Routes = [
    {
        path: '',
        component: DealTypeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DealTypeRoutingModule {}
