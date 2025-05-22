import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeoffTypeComponent } from './timeoff-type.component';

const routes: Routes = [
    {
        path: '',
        component: TimeoffTypeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TimeoffTypeRoutingModule {}
