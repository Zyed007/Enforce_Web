import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordSetupComponent } from './password-setup.component';

const routes: Routes = [
    {
        path: '',
        component: PasswordSetupComponent
        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PasswordSetupRoutingModule {}
