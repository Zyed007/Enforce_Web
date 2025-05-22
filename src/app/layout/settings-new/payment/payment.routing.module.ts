import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PaymentComponent } from "./payment.component";
import { TravelPrefixComponent } from "../travel/travel-prefix/travel-prefix.component";
import { WorkExpensesPrefixComponent } from "./work-expenses-prefix/work-expenses-prefix.component";
import { AdjustmentPrefixComponent } from "./adjustment-prefix/adjustment-prefix.component";


const routes: Routes = [
  {
    path: '',
    component: PaymentComponent
  },
    {
    path: 'work-expenses-prefix',
    component: WorkExpensesPrefixComponent
  },
  {
    path: 'adjustment-prefix',
    component: AdjustmentPrefixComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class paymentRoutingModule { }
