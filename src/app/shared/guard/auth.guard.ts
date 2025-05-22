import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) {}

  canActivate() {
    const localToken = localStorage.getItem("token");
    let userInfo: any = localStorage.getItem("user_info");
    let parsedUserInfo = userInfo ? JSON.parse(userInfo) : {};
    let is_superadmin = parsedUserInfo.is_superadmin || false;
    console.log(is_superadmin, "CALLED");
    if (this.route.snapshot) {
    }
    if (localToken && localStorage.getItem("org_id") || localToken && is_superadmin) {
      return true;
    } else {
      this.toast.error("Session timed out, Please sign in to continue");
      this.router.navigate(["/signin"]);
      return false;
    }
  }
}
