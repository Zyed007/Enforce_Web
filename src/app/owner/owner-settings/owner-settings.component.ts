import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-settings',
  templateUrl: './owner-settings.component.html',
  styleUrls: ['./owner-settings.component.scss']
})
export class OwnerSettingsComponent implements OnInit {

  term;
  settingNames = [
    {
      name:'Subscription Plan',
    }
  ];

  constructor(
    public Router :Router,
  ) { }

  ngOnInit() {
  }

  cardClick(value){
    switch(value){
      case 'Subscription Plan':
      this.Router.navigate(['oSettings/plan-settings']);
      break;

      default:
      this.Router.navigate(['oSettings']);
    }
  }

}
