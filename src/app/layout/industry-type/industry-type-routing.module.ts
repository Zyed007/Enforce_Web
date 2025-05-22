import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndustryTypeComponent } from './industry-type.component';

const routes: Routes = [
    {
        path: '',
        component: IndustryTypeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndustryTypeRoutingModule {}
