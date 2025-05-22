import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCaseComponent } from './create-case.component';

const routes: Routes = [
    {
        path: '',
        component: CreateCaseComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class createCaseRoutingModule {}
