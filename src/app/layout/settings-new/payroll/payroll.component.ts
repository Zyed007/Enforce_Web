import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'payroll',
    templateUrl: './payroll.component.html',
    styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {

    term;
    settingNames = [
        {
            name: 'Beneficiary Bank Accounts'
        },
        {
            name: 'Payroll Setting'
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
            case 'Beneficiary Bank Accounts':
                this.router.navigate(['settings-new', 'payroll','beneficiaryAcc']);
                break;
            case 'Payroll Setting':
                this.router.navigate(['settings-new', 'payroll','payroll-settings']);
                break;
            default:
                this.router.navigate(['settings-new/hr-setting']);
        }
    }

}
