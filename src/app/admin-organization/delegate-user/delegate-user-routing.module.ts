import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelegateUserComponent } from './delegate-user.component';

const routes: Routes = [
    {
        path: '',
        component: DelegateUserComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DelegateUserRoutingModule {}
