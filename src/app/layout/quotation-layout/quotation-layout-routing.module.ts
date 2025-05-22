import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotationLayoutComponent } from './quotation-layout.component';

const routes: Routes = [
    {
        path: '',
        component: QuotationLayoutComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuotationLayoutRoutingModule {}
