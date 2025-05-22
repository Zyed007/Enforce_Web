import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { PlatformDetectionService } from "../../platform-detection.service";
import { is } from "@amcharts/amcharts4/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toast: ToastrService,
    private platformDetectionService: PlatformDetectionService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log("CALLED INTERCEPTOR!!!")
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");
    console.log(request.url, "request.url!!!")

    if (
      request.url.includes("Account/Login") ||
      request.url.includes("User/GetUserDataGroupByUserID") ||
      request.url.includes("assets/i18n/en.json") ||
      request.url.includes("/verification")||
      request.url.includes("/Account/ForgotPassword") ||
      request.url.includes("/Account/ResetPassword")||
      request.url.includes("/api-v1/send-login-notification")||
      request.url.includes("/api-v1/verifyUserLoginOTP")||
      request.url.includes("/Account/ResetPassword") ||
      request.url.includes("/Account/ConfirmEmail")
    ) {
      console.log('Inside the req!');
      return next.handle(request);
    }
    let userInfo: any = localStorage.getItem("user_info");
    let parsedUserInfo = userInfo ? JSON.parse(userInfo) : {};
    let is_superadmin = parsedUserInfo.is_superadmin || false;
    if (
      (localToken && localStorage.getItem("org_id")) ||
      (localToken && is_superadmin)
    ) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error, "TESTING ERRORS");
          if (error.status === 401) {
            // console.log("ELSE CALLED INTERCEPTOR!!!")
            this.router.navigate(["/signin"]);
          }
          if (error.status === 0) {
            // Check internet connection
            this.platformDetectionService
              .checkInternetConnection()
              .then((isConnected) => {
                console.log(isConnected, "isConnected");
                if (!isConnected) {
                  this.platformDetectionService.handleOfflineStatus();
                } else {
                  this.toast.info(
                    "An unknown error occurred. Please try again later."
                  );
                }
              });
          }

          return throwError(error);
        })
      );
    } else {
      console.log("ELSE CALLED INTERCEPTOR!!!")
      this.toast.error("Session timed out, Please sign in to continue");
      this.router.navigate(["/signin"]);
      return throwError("Unauthorized request");
    }
  }
  private async checkInternetConnection(): Promise<boolean> {
    try {
      const response = await fetch("https://www.google.com", {
        method: "HEAD",
        mode: "no-cors",
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
