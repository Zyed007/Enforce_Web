import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectInvoiceNewComponent } from './project-invoice-new.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectInvoiceNewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectInvoiceNewRoutingModule {}
