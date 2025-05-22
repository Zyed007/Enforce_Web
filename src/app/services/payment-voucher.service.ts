import { Injectable } from '@angular/core';
import { ClientService } from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

let orgId = {
    id: localStorage.getItem('org_id')
}
let user_info: object;
if (localStorage.getItem('user_info')) {
    user_info = JSON.parse(localStorage.getItem('user_info'));
}

@Injectable(
    { providedIn: 'root' }
)


export class PaymentVoucherService {

    constructor(private http: HttpClient, private clientService: ClientService) {
    }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Access-Control-Allow-Origin': '*'
        })
    }

    handleError(error) {
        let errorMessage = '';
        if (error.status === 0) {
            errorMessage = 'Internal Server Error';
        } else {
            errorMessage = 'Something went wrong. please try again';
        }
        return throwError(errorMessage);
    }
// 
AddPaymentVoucherDetails(postData) {
    console.log("PAY VOU")
    let empUrl = this.clientService.AddPaymentVoucherDetails();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
}
GetLastAddedVoucherPrefixByOrgID(postData) {
    console.log("PAY VOU")
    let empUrl = this.clientService.GetLastAddedVoucherPrefixByOrgID();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
}
UpdatePaymentVoucherDetailsByID(postData) {
    console.log("UPDATE PAY VOU")
    let empUrl = this.clientService.UpdatePaymentVoucherDetailsByID();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
}

MarkPaymentVoucherAsPaidByID(postData) {
    console.log("UPDATE PAY VOU")
    let empUrl = this.clientService.MarkPaymentVoucherAsPaidByID();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
}
GetPaymentVouchersByPayrollId(postData) {
    let empUrl = this.clientService.GetPaymentVouchersByPayrollId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
}
GetPaymentVouchersByOrgId(postData) {
    let empUrl = this.clientService.GetPaymentVouchersByOrgId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
}
GetPaymentVouchersPaymentsByOrgId(postData) {
    let empUrl = this.clientService.GetPaymentVouchersPaymentsByOrgId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
}

DeletePaymentVoucherById(postData) {
    console.log("PAY VOU")
    let empUrl = this.clientService.DeletePaymentVoucherById();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
}

// 

    AddPaymentModeDetails(postData) {
        console.log("PAY VOU")
        let empUrl = this.clientService.AddPaymentModeDetails();
        return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
    }
    UpdatePaymentModeDetailsByID(postData) {
        console.log("UPDATE PAY VOU")
        let empUrl = this.clientService.UpdatePaymentModeDetailsByID();
        return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
    }
    GetPaymentModeDetailsByMode(postData) {
        let empUrl = this.clientService.GetPaymentModeDetailsByMode();
        return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
    }
    GetCommonPaymentModeDetailsByMode(postData) {
        let empUrl = this.clientService.GetCommonPaymentModeDetailsByMode();
        return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
    }

    DeletePaymentModeDetailsById(postData) {
        console.log("PAY VOU")
        let empUrl = this.clientService.DeletePaymentModeDetailsById();
        return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
    }
    AddPaymentVoucherDetailsCommon(postData) {
        let empUrl = this.clientService.AddPaymentVoucherDetailsCommon();
        return this.http
          .post(empUrl, postData)
          .pipe(retry(1), catchError(this.handleError));
      }
      UpdatePaymentVoucherAprovalDetailsByID(postData) {
        let empUrl = this.clientService.UpdatePaymentVoucherAprovalDetailsByID();
        return this.http
          .post(empUrl, postData)
          .pipe(retry(1), catchError(this.handleError));
      }

}