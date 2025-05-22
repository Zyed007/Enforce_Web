import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable(
{ providedIn: 'root'}
)
export class UserService {

  constructor(private http: HttpClient, private clientService: ClientService) {

   }
    // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':'*/*',
      'Access-Control-Allow-Origin':'*',


    })
  }


        getByUserID(postData)  {
          console.log(postData,"ETST");
            let empUrl=this.clientService.getByUserID();
            if(!postData.OrgID){
              postData['OrgID']=localStorage.getItem('orgID');
            }
            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          //old function
          GetAllTimesheetByEmpID(postData)  {
            let empUrl=this.clientService.GetAllTimesheetByEmpID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          GetAllTimesheetListByEmployeeID(postData)  {
            let empUrl=this.clientService.GetAllTimesheetListByEmployeeID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          LastCheckinByEmpID(postData)  {
            let empUrl=this.clientService.LastCheckinByEmpID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          GetLastTimesheetByEmpID(){

            let empUrl=this.clientService.GetLastTimesheetByEmpID();
          let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let postData={
      empID:user['id']
    }
            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          LoginCallback(token,username)  {
            let forgotPwdUrl=this.clientService.LoginCallback();
            let concat=forgotPwdUrl+('?userId='+ token + '&code=' +username)
            let postData={
              'username':username,
              'token':token
            }
            return this.http.post(forgotPwdUrl,postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

  GetAccessRightsbyRole(postData)  {
    let empUrl=this.clientService.GetAccessRightsbyRole();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }



   // Error handling
   handleError(error) {
    let errorMessage = '';
     if(error.status === 0){
      errorMessage = 'Internal Server Error';
     } else {
      errorMessage = 'Something went wrong. please try again';
     }
      return throwError(errorMessage);
   }

}
