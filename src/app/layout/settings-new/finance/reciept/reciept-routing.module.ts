import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecieptSettingComponent } from "./reciept.component";
import { RecieptPrefixComponent } from "./reciept-prefix/reciept-prefix.component";

const routes: Routes = [
    {
        path: '',
        component: RecieptSettingComponent,
    }, {
        path: 'reciept-prefix',
        component: RecieptPrefixComponent
    }
];

console.log("THIS HAS BEEN CALLED")
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class recieptSettingRoutingModule { }