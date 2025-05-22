import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Injectable()
export class AuthTokenGuard implements CanActivate {
    constructor(private router: Router,private route:ActivatedRoute) {}

    canActivate() {
        const localToken = localStorage.getItem('token');
        const sessionToken = sessionStorage.getItem('token');
        console.log(localToken,sessionToken,"TOKENS")
        if (localToken && localToken === sessionToken) {
            console.log("MATCHED")
            return true;
        }else{
            this.router.navigate(['/signin']);
            return false;
        }

        
    }
    
}