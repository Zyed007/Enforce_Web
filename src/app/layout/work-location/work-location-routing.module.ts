import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkLocationComponent } from './work-location.component';

const routes: Routes = [
    {
        path: '',
        component: WorkLocationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorkLocationRoutingModule {}


