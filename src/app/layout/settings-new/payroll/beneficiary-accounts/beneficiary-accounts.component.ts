import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'beneficiaryAcc',
    templateUrl: './beneficiary-accounts.component.html',
    styleUrls: ['./beneficiary-accounts.component.scss']
})
export class BeneficiaryBankAccount implements OnInit {

    term;
    settingNames = [
        {
            name: 'Employee Bank Accounts'
        },
        {
            name: 'WPS Provider Bank Accounts'
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
            case 'Employee Bank Accounts':
                this.router.navigate(['settings-new', 'payment-mode'], { queryParams: { key: this.xorEncryptDecrypt('employee', this.key) } });
                break;
            case 'WPS Provider Bank Accounts':
                this.router.navigate(['settings-new', 'payment-mode'], { queryParams: { key: this.xorEncryptDecrypt('individual', this.key) } });
                break;
            default:
                this.router.navigate(['settings-new/payroll']);
        }
    }

}
