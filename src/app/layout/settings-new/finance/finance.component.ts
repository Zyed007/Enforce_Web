import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'finance',
    templateUrl: './finance.component.html',
    styleUrls: ['./finance.component.scss']
})
export class FinanceSettingComponent implements OnInit {

    term;
    settingNames = [
        {
            name: 'Open Balance'
        },
        {
            name: 'Other Income'
        },
        {
            name: 'Bank Accounts'
        },
        {
            name: 'Reciept Voucher'
        },
        {
            name: 'Payment Voucher Prefix'
        }, {
            name: 'Revenue Adjustment'
        }
    ];

    constructor(
        private router: Router
    ) { }

    ngOnInit() {
        console.log('called!!!')
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
            case 'Open Balance':
                this.router.navigate(['settings-new', 'finance', 'open-bal']);
                break;
            case 'Other Income':
                this.router.navigate(['settings-new', 'finance', 'commission']);
                break;
            case 'Bank Accounts':
                this.router.navigate(['settings-new', 'payment-mode'], { queryParams: { key: this.xorEncryptDecrypt('finance', this.key) } });
                break;
                case 'Payment Voucher Prefix':
                    this.router.navigate(['settings-new', 'finance', 'payment-prefix']);
                    break;
            case 'Reciept Voucher':
                this.router.navigate(['settings-new', 'finance', 'reciept-setting']);
                break;
            case 'Revenue Adjustment':
                this.router.navigate(['settings-new', 'finance', 'rev-adjustment']);
                break;
            default:
                this.router.navigate(['settings-new']);
        }
    }

}
