import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PaymentModeComponent } from "../payment-mode/payment-mode.component";


const routes: Routes = [
    {
        path: '',
        component: PaymentModeComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class paymentmodeSettingRoutingModule { }