import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkforceNewComponent } from './workforce-new.component';

const routes: Routes = [
    {
        path: '',
        component: WorkforceNewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class workForceNewRoutingModule {}
