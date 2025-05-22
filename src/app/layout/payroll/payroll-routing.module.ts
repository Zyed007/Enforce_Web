import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayrollComponent } from './payroll.component';
import { AdjustmentComponent } from './adjustments/adjustment.component';
import { ExpensessComponent } from './expensess/expensess.component';
import { VariablpayComponent} from './variablepay/variablepay.component';
import { LoanpaymentsComponent } from './loanpayments/loanpayments.component';

const routes: Routes = [
    {
      path: '',
      component: PayrollComponent
    },
    {
      path: 'variablepay',
      component: VariablpayComponent
    },
    {
      path: 'adjustments',
      component: AdjustmentComponent
    },
    {
      path: 'expensess',
      component: ExpensessComponent
    },
    {
      path: 'loanpayments',
      component: LoanpaymentsComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PayrollRoutingModule {}
