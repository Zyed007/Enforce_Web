import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorsComponent } from './vendors.component';
import { VendorActivityComponent } from './vendor-activity/vendor-activity.component';
import { VendorStatusComponent } from './vendor-status/vendor-status.component';
import { VendorDocComponent } from './vendor-doc/vendor-doc.component';

const routes: Routes = [
    {
        path: '',
        component: VendorsComponent
    },
    {
        path: 'vendor-activity',
        component: VendorActivityComponent
    },
    {
        path: 'vendor-status',
        component: VendorStatusComponent
    },
    {
        path: 'vendor-doc',
        component: VendorDocComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class vendorRoutingModule {}
