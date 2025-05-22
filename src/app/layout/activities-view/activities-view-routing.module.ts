import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivitiesViewComponent } from './activities-view.component';

const routes: Routes = [
    {
        path: '',
        component: ActivitiesViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivitiesViewRoutingModule {}
