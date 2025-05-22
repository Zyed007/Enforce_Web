import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetSettingComponent } from './asset-setting.component';
import { AssetTypeComponent } from './asset-type/asset-type.component';
import { AssetStatusComponent } from './asset-status/asset-status.component';
import { AssetCategoryComponent } from './asset-category/asset-category.component';
import { AssetPrefixComponent } from './asset-prefix/asset-prefix.component';
//import { ProjectPrefixComponent } from './project-prefix/project-prefix.component';
//import { ProjectClosingComponent } from './project-closing/project-closing.component';

const routes: Routes = [
    {
        path: '',
        component: AssetSettingComponent
    },
    {
        path: 'asset-type',
        component: AssetTypeComponent
    },
    {
        path: 'asset-status',
        component: AssetStatusComponent
    },
    {
        path: 'asset-category',
        component: AssetCategoryComponent
    },
    {
        path: 'asset-prefix',
        component: AssetPrefixComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetSettingRoutingModule {}