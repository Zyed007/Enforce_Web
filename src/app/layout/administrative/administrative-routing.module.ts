import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrativeComponent } from './administrative.component';

const routes: Routes = [
    {
        path: '',
        component: AdministrativeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministrativeRoutingModule {}
