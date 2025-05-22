import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


let orgId={
    id: localStorage.getItem('org_id')
}
let user_info:object;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));


}

@Injectable(
{ providedIn: 'root'}
)

export class DepartmentService {

  constructor(private http: HttpClient, private clientService: ClientService) {

   }

    // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':'*/*',
      'Access-Control-Allow-Origin':'*'




    })
  }


        getAllDept(){
          let org_id;
          org_id={
            id: localStorage.getItem('org_id')
          }
            let empUrl=this.clientService.getAllDept();


            return this.http.post(empUrl,org_id,this.httpOptions)
            .pipe(
              retry(1),

              catchError(this.handleError)
            )
        }


        AddDept(postData)  {
          let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.addDept();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getByDeptID(postData)  {
    let empUrl=this.clientService.getByDeptID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  updateDept(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }

    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.updateDept();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  delDept(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.delDept();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  fetchGridDataByDepartmentOrgID(){
    let postData={
      'orgID':localStorage.getItem('org_id')

    }

    let empUrl=this.clientService.fetchGridDataByDepartmentOrgID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  SetupPreDefinedDepartment(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['createdby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.SetupPreDefinedDepartment();

    return this.http.post(empUrl, postData)
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
