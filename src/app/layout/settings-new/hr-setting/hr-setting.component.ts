import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hr-setting',
  templateUrl: './hr-setting.component.html',
  styleUrls: ['./hr-setting.component.scss']
})
export class HRSettingComponent implements OnInit {

  term;
  settingNames = [
    {
      name: 'Payroll'
    },
    {
      name: 'Leave Overtime Gratuity Profile'
    }, {
      name: 'Field Management'
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
      case 'Payroll':
        this.router.navigate(['settings-new', 'payroll']);
        break;
      case 'Leave Overtime Gratuity Profile':
        this.router.navigate(['settings-new', 'leave-mgt']);
        break;
      case 'Field Management':
        this.router.navigate(['settings-new', 'hr-setting','field-management'])
        break;
      default:
        this.router.navigate(['settings-new']);
    }
  }

}
