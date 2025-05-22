import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'reciept',
    templateUrl: './reciept.component.html',
    styleUrls: ['./reciept.component.scss']
})
export class RecieptSettingComponent implements OnInit {
    term;
    settingNames = [
        {
            name: 'Reciept Prefix'
        },
    ];


    constructor(
        private router: Router
    ) { }

    ngOnInit() {
        console.log('RECIEPT called!!!')
    }
    back() {
        this.router.navigate(['settings-new', 'finance'])
    }
    cardClick(value) {
        // console.log(value,'***********')
        switch (value) {   
            case 'Reciept Prefix':
                this.router.navigate(['settings-new', 'finance','reciept-setting','reciept-prefix']);
                break;
            default:
                this.router.navigate(['settings-new', 'finance']);
        }
    }


}
