import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommissionVendorsComponent } from './commission-vendors.component';

const routes: Routes = [
    {
        path: '',
        component: CommissionVendorsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommissionVendorsRoutingModule {}
