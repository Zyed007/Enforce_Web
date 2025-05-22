import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-organization-overview',
  templateUrl: './app-organization-overview.component.html',
  styleUrls: ['./app-organization-overview.component.scss']
})
export class AppOrganizationOverviewComponent implements OnInit {

  term;
  settingNames = [
    {
      name:'Organization Profile'
    }
  ]

  constructor(public router: Router) {

  }

  ngOnInit() {
  }


  backToOrgOverview(){
    this.router.navigate(['organizations']);
  }

  cardClick(value){
    switch(value){
      case 'Organization Profile':
      this.router.navigate(['organization-overview/organization-profile']);
      break;

      default:
      this.router.navigate(['settings-new']);
    }
  }


}
