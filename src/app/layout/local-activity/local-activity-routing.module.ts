import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalActivityComponent } from './local-activity.component';

const routes: Routes = [
    {
        path: '',
        component: LocalActivityComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LocalActivityRoutingModule {}
