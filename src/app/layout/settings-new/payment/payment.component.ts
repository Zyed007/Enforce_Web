import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  term;
  settingNames = [
    {
      name: 'Payment Modes'
    },
    {
      name: 'Work Expenses Prefix'
    },{
      name:'Adjustment Prefix'
    }
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  xorEncryptDecrypt(input: string, key: string): string {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
    }
    return output;
  }
  key = 'secret';

  cardClick(value) {
    switch (value) {
      case 'Payment Modes':
        this.router.navigate(['settings-new', 'payment-mode']);
        break;
      case 'Work Expenses Prefix':
        this.router.navigate(['settings-new', 'payment', 'work-expenses-prefix']);
        break;
        case 'Adjustment Prefix':
          this.router.navigate(['settings-new', 'payment', 'adjustment-prefix']);
          break;
      default:
        this.router.navigate(['settings-new']);
    }
  }

}
