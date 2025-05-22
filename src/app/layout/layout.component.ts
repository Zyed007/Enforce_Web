import { Component, OnInit ,ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import { AutoLogoutComponent } from '../auto-logout/auto-logout.component';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    // providers:[AutoLogoutComponent]
})
export class LayoutComponent implements OnInit {

    collapedSideBar: boolean;

    constructor(private router: Router) {}

    ngOnInit() {
        // $.getScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js');
        // $.getScript('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js');
      //  localStorage.setItem('lastAction',Date.now().toString());
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)

        });
    }

    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }
}


