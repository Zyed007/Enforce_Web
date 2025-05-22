import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrefixComponent } from './prefix.component';

const routes: Routes = [
    {
        path: '',
        component: PrefixComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrefixRoutingModule {}
