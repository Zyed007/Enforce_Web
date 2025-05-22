import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackageSetupComponent } from './package-setup.component';

const routes: Routes = [
    {
        path: '',
        component: PackageSetupComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageSetupRoutingModule {}
