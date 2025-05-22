import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordlessAuthComponent } from './passwordless-auth.component';

const routes: Routes = [
    {
        path: '',
        component: PasswordlessAuthComponent
        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PasswordlessAuthRoutingModule {}
