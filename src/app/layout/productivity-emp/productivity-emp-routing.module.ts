import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductivityEmpComponent } from './productivity-emp.component';

const routes: Routes = [
    {
        path: '', component: ProductivityEmpComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductivityEmpRoutingModule {
}
