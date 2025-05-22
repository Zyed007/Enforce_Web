import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable(
{ providedIn: 'root'}
)
export class LoginService {
  public visible=false;

  constructor(private http: HttpClient, private clientService: ClientService) {

   }
    // Http Options
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept':'*/*',
  //     'Access-Control-Allow-Origin':'*',


  //   })
  // }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept':'*/*',
      'Access-Control-Allow-Origin':'*',


    })
  }

  setVisible(value){
    this.visible=value;

  }
 getVisible(){

    const updated=true;
return updated;

 }


  onRegistered(postData)  {
    let registerUrl=this.clientService.onRegister();

    return this.http.post(registerUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  onLogin(postData)  {
    let loginUrl=this.clientService.onLogin();

    return this.http.post(loginUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  onForgetPassword(postData)  {
    let forgotPwdUrl=this.clientService.onForgetPassword();

    return this.http.post(forgotPwdUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  onResetPassword(postData)  {
    let forgotPwdUrl=this.clientService.onResetPassword();

    return this.http.post(forgotPwdUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  onVerifyEmail(userId,code)  {
    let forgotPwdUrl=this.clientService.onVerifyEmail();
    let concat=forgotPwdUrl+('?userId='+ userId + '&code=' +code)

    return this.http.get(concat)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
   // Error handling
   handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Internal Server Error`;
    }
    return throwError(errorMessage);
 }
}
