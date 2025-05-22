import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent implements OnInit {

  term;
  settingNames = [
    {
      name: 'Other Income Type'
    },
    {
      name: 'Other Income Payment Term'
    },
    {
      name: 'Other Income Prefix'
    }
  ]

  constructor(
    public Router :Router
  ) { }

  ngOnInit() {
  }

  cardClick(value){
    console.log(value,"CHECK")
    switch(value){
      case 'Other Income Type': this.Router.navigate(['settings-new/finance/commission/Add-Commission-type']);
      break;

      case 'Other Income Prefix': this.Router.navigate(['settings-new/finance/commission/commission-prefix']);
      break;

      case 'Other Income Payment Term': this.Router.navigate(['settings-new/finance/commission/inc-payment-term']);
      break;

      default: this.Router.navigate(['settings-new/finance']);
    }
  }

}
