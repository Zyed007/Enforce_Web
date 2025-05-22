import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FinanceSettingComponent } from "./finance.component";
import { OpenBalanceComponent } from "./open-balance/open-balance.component";
import { PaymentModeComponent } from "../payment-mode/payment-mode.component";
import { RecieptSettingComponent } from "./reciept/reciept.component";
import { Rev_adjustment } from "./Rev_adjustment/Rev_adjustment.component";
import { PaymentPrefixComponent } from "./payment-prefix/payment-prefix.component";

const routes: Routes = [
    {
        path: '',
        component: FinanceSettingComponent,
        // children: [
        //     {
        //         path: 'open-bal',
        //         component: OpenBalanceComponent
        //     },
        //     // {
        //     //     path: 'company-acc', 
        //     //     component: PaymentModeComponent,
        //     // },
        //     {
        //         path: 'commission',
        //         loadChildren: () => import('./commission/commission.module').then(m => m.commissionSettingModule)
        //     },
        // ]
    },
    {
        path: 'open-bal',
        component: OpenBalanceComponent
    },
    {
        path: 'rev-adjustment',
        component: Rev_adjustment
    },
    {
        path: 'payment-prefix',
        component: PaymentPrefixComponent
    },
    // {
    //     path: 'company-acc',
    //     component: PaymentModeComponent,
    // },
    {
        path: 'commission',
        loadChildren: () => import('./commission/commission.module').then(m => m.commissionSettingModule)
    },
    {
        path: 'reciept-setting',
        loadChildren: () => import('./reciept/reciept.module').then(m => m.recieptSettingModule)
    },

    // {
    //     path: 'payment-mode',
    //     component: PaymentModeComponent
    // },
    // {
    //     path: 'payroll',
    //     component: PayrollComponent
    // },
];
console.log("THIS HAS BEEN CALLED")
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class financeSettingRoutingModule { }