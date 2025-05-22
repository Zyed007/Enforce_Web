import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PaymentModeComponent } from "../payment-mode/payment-mode.component";
import { PayrollSettingComponent } from "./payroll-settings/payroll-settings.component";
import { BeneficiaryBankAccount } from "./beneficiary-accounts/beneficiary-accounts.component";
import { PayrollComponent } from "./payroll.component";

const routes: Routes = [
    {
        path: '',
        component: PayrollComponent
    },
    // {
    //     path: 'payment-mode',
    //     component: PaymentModeComponent,
    //     data: { routeType: 'payroll' } 
    // },
    {
        path: 'payroll-settings',
        component: PayrollSettingComponent
    },
    {
        path: 'beneficiaryAcc',
        component: BeneficiaryBankAccount
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class payrollSettingRoutingModule { }