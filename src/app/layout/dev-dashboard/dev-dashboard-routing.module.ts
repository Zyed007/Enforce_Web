import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DevDashboardComponent } from "./dev-dashboard.component";
import { DevDashAttendenceComponent } from "./attendence-report/attendence-report.component";
import { DevDashApiUsageComponent } from "./api-usage-report/api-usage-report.component";
import { DevDashStorageUsageComponent } from "./storage-usage-report/storage-usage-report.component";

const routes: Routes = [
  {
    path: "",
    component: DevDashboardComponent,
  },
  {
    path: "attendence-report",
    component: DevDashAttendenceComponent,
  },
  {
    path: "api-usage-report",
    component: DevDashApiUsageComponent,
  },
  {
    path: "storage-usage-report",
    component: DevDashStorageUsageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevDashboardRoutingModule {}
