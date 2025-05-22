import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'owner-sidenav',
  templateUrl: './owner-sidenav.component.html',
  styleUrls: ['./owner-sidenav.component.scss']
})
export class OwnerSidenavComponent implements OnInit {

  owerMenuListing = [
    {
      text: 'Dashboard',
      icon: 'dashboard',
      route: '/oDashboard'
    },
    {
      text: 'Organizations',
      icon: 'groups',
      route: '/oOrganization',
    },
    {
      text: 'Settings',
      icon: 'settings',
      route: '/oSettings',
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
