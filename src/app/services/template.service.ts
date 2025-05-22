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
export class TemplateService {

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


  FindMilestoneTemplatesByOrgID()  {
            let orgId={
                OrgID: localStorage.getItem('org_id')
            }
            let empUrl=this.clientService.FindMilestoneTemplatesByOrgID();
         
            return this.http.post(empUrl, orgId)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FindMilestoneTemplatesByTemplateID(postData)  {
            let empUrl=this.clientService.FindMilestoneTemplatesByTemplateID();
         
            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          AddTaskTemplate(postData)  {
            postData['org_id']=localStorage.getItem('org_id');
            let empUrl=this.clientService.AddTaskTemplate();
         
            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FindTaskTemplatesByOrgID()  {
            let orgId={
                OrgID: localStorage.getItem('org_id')
            }
            let empUrl=this.clientService.FindTaskTemplatesByOrgID();
         
            return this.http.post(empUrl, orgId)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FindTaskTemplatesByTemplateID(postData)  {
            let empUrl=this.clientService.FindTaskTemplatesByTemplateID();
         
            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          RemoveMilestoneTemplateByID(postData)  {
            let empUrl=this.clientService.RemoveMilestoneTemplateByID();
         
            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          RemoveTaskTemplateByID(postData)  {
            let empUrl=this.clientService.RemoveTaskTemplateByID();
         
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
