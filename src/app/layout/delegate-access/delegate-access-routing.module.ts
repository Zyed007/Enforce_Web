import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelegateAccessComponent } from './delegate-access.component';


const routes: Routes = [
    {
        path: '', component: DelegateAccessComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DelegateAccessRoutingModule {
}
