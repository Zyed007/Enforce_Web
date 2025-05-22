import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap } from 'rxjs/operators';
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
export class DesignationService {

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

getAllDesgn(){
    let empUrl=this.clientService.getAllDesgn();

    return this.http.get(empUrl)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
}
getEmpList(){
    return this.http.post(this.clientService.getAllEmployee(),'',this.httpOptions)
    .pipe(
        tap( // Log the result or error

          )
    )


        }

        getByDesgnID(postData)  {
            let empUrl=this.clientService.getByDesgnID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
        AddDesgn(postData)  {
          let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
            postData["createdby"] = user['full_name'];
    let empUrl=this.clientService.addDesgn();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  updateDesgn(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    // postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.updateDesgn();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  delDesgn(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.delDesgn();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
 fetchGridDataByDesignationDeptOrgID(){
  let postData={
    'orgID':localStorage.getItem('org_id')

  }
    let empUrl=this.clientService.fetchGridDataByDesignationDeptOrgID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  getDesgnByDeptId(postData){
   let deptId={
     id:postData
   }
    let empUrl=this.clientService.getDesgnByDeptId();

    return this.http.post(empUrl,deptId,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  getAllDesignationByOrgID(){
    let postData={
      'OrgID':localStorage.getItem('org_id')

    }

     let empUrl=this.clientService.getAllDesignationByOrgID();

     return this.http.post(empUrl,postData,this.httpOptions)
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
