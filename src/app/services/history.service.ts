import { Injectable } from '@angular/core';
import { ClientService } from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable(
{ providedIn: 'root'}
)

export class HistoryService {

  constructor(private http: HttpClient, private clientService: ClientService) {

  }

  AddEntityHistoryLog(postData){
    if(localStorage.getItem('user_info')){
      let empData = JSON.parse(localStorage.getItem('user_info'));
      let empID = empData.id;
      let empName = empData.full_name;
      postData.event_user_id = empID;
      postData.createdby = empName;
      console.log(postData);
      let empUrl=this.clientService.AddEntityHistoryLog();
      return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
    }
  }

  getHistory(id){
    let obj = {
      id
    }
    let empUrl=this.clientService.FetchEntityHistoryLogEntityID();
    return this.http.post(empUrl, obj).pipe(retry(1),catchError(this.handleError))
  }

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
