import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttexpComponent } from './attexp.component';
const routes: Routes = [
    {
        path: '',
        component: AttexpComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AttexpRoutingModule {}
