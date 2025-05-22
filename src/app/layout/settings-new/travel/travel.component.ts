import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements OnInit {

  term;
  settingNames = [
    {
      name: 'Travel Settings'
    }, {
      name: 'Travel Prefix'
    },
    {
      name: 'Fuel Station Brands'
    },
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
      case 'Travel Settings':
        this.router.navigate(['settings-new', 'travel', 'travel-settings']);
        break;
      case 'Travel Prefix':
        this.router.navigate(['settings-new', 'travel', 'travel-prefix']);
        break;
      case 'Fuel Station Brands':
        this.router.navigate(['settings-new', 'travel', 'fuel-station']);
        break;
      default:
        this.router.navigate(['settings-new']);
    }
  }

}
