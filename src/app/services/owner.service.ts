import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

  @Injectable(
    { providedIn: 'root'}
  )

export class OwnerService {

  constructor(
    private http: HttpClient,
    private clientService: ClientService
  ) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':'*/*',
      'Access-Control-Allow-Origin':'*'
    })
  }

  GetAllSubscriptionPlan(){
    let empUrl=this.clientService.GetAllSubscriptionPlan();
    return this.http.get(empUrl).pipe(retry(1),catchError(this.handleError))
  }

  GetSubscriptionPlanByID(postData){
    let empUrl=this.clientService.GetSubscriptionPlanByID();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  AddSubscriptionPlan(postData){
    let empUrl=this.clientService.AddSubscriptionPlan();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  UpdateSubscriptionPlanByID(postData){
    let empUrl=this.clientService.UpdateSubscriptionPlanByID();
    return this.http.patch(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if(error.status === 0){
      errorMessage = 'Internal Server Error';
    }else {
      errorMessage = 'Something went wrong. please try again';
    }
    return throwError(errorMessage);
  }

}
