import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommissionComponent } from './commission.component';
import { AddCommissionTypeComponent } from './add-commission-type/add-commission-type.component';
import { CommissionPrefixComponent } from './commission-prefix/commission-prefix.component';
import { IncomePaymentComponent } from './income-payment/income-payment.component';

const routes: Routes = [
    {
        path: '',
        component: CommissionComponent
    },
    {
      path: 'Add-Commission-type',
      component: AddCommissionTypeComponent
    },
    {
      path: 'commission-prefix',
      component: CommissionPrefixComponent
    },
    {
      path: 'inc-payment-term',
      component: IncomePaymentComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class commissionSettingRoutingModule {}
