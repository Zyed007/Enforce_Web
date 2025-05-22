import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  term;
  settingNames = [
    {
      name: 'Vendor Activity'
    },
    {
      name: 'Vendor Status'
    },
    {
      name: 'Vendor Attachment Type'
    }
  ]

  constructor(
    public Router :Router
  ) { }

  ngOnInit() {
  }

  cardClick(value){
    switch(value){
      case 'Vendor Activity': this.Router.navigate(['settings-new/vendor/vendor-activity']);
      break;

      case 'Vendor Status': this.Router.navigate(['settings-new/vendor/vendor-status']);
      break;

      case 'Vendor Attachment Type': this.Router.navigate(['settings-new/vendor/vendor-doc']);
      break;

      default: this.Router.navigate(['settings-new']);
    }
  }

}
