import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TravelComponent } from "./travel.component";
import { TravelSettingsComponent } from "./travel-settings/travel-settings.component";
import { TravelPrefixComponent } from "./travel-prefix/travel-prefix.component";
import { FuelStationComponent } from "./fuel-station/fuel-station.component";

const routes: Routes = [
  {
    path: '',
    component: TravelComponent
  },
  {
    path: 'travel-settings',
    component: TravelSettingsComponent
  },
  {
    path: 'travel-prefix',
    component: TravelPrefixComponent
  },
  {
    path:'fuel-station',
    component:FuelStationComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelRoutingModule { }
