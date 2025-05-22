import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstimatePrefixComponent } from './estimate-prefix.component';

const routes: Routes = [
    {
        path: '',
        component: EstimatePrefixComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EstimatePrefixRoutingModule {}
