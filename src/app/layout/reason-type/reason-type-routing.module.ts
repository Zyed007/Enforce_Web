import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReasonTypeComponent } from './reason-type.component';

const routes: Routes = [
    {
        path: '',
        component: ReasonTypeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReasonTypeRoutingModule {}
