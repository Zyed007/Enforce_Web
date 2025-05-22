import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable(
{ providedIn: 'root'}
)
export class FinanceService {
  public visible=false;

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



  GetAllProjectValueByOrgID(postData)  {

let empUrl=this.clientService.GetAllProjectValueByOrgID();
postData['orgID']=localStorage.getItem('org_id');

return this.http.post(empUrl, postData)
.pipe(
retry(1),
catchError(this.handleError)
)
}

GetAllProjectRevenueByOrgID(postData)  {
  let empUrl=this.clientService.GetAllProjectRevenueByOrgID();
  postData['orgID']=localStorage.getItem('org_id');
  return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
}


GetAllTaskDetailsProjectValueByOrgID(sendObj)  {
  let empUrl=this.clientService.GetAllTaskDetailsProjectValueByOrgID();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetAllTaskDetailsEmployeeByID(sendObj)  {
  let empUrl=this.clientService.GetAllTaskDetailsEmployeeByID();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

//delete this api
GetEmpProductvityDetails(sendObj)  {
  let empUrl=this.clientService.GetEmpProductvityDetails();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

ProjectTaskDetailsbyEmp(sendObj){
  let empUrl=this.clientService.ProjectTaskDetailsbyEmp();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

EmployeeSummaryByOrgID(sendObj){
  let empUrl=this.clientService.EmployeeSummaryByOrgID();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetSummaryDetailsbyEmpID(sendObj){
  let empUrl=this.clientService.GetSummaryDetailsbyEmpID();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetSummaryDetailsbyEmpIDAndMil(sendObj){
  let empUrl=this.clientService.GetSummaryDetailsbyEmpIDAndMil();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

NormalTaskDetailsbyEmp(sendObj){
  let empUrl=this.clientService.NormalTaskDetailsbyEmp();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetProjectStatusOpen(sendObj) {

  let empUrl = this.clientService.GetProjectStatusOpen();

  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))

}


GetMilestonDataNoActivities(sendObj) {

  let empUrl = this.clientService.GetMilestonDataNoActivities();

  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))

}

ActivityTaskDetailsbyEmp(sendObj){
  let empUrl=this.clientService.ActivityTaskDetailsbyEmp();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

ProjectCompletedDetailsByEmp(sendObj){
  let empUrl=this.clientService.ProjectCompletedDetailsByEmp();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetAllBackLogProjectRevenueByOrgID(sendObj)  {
  let empUrl=this.clientService.GetAllBackLogProjectRevenueByOrgID();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GettaskDatabyMilestone(sendObj)  {
  let empUrl=this.clientService.GettaskDatabyMilestone();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetOpentaskDatabyMilestone(sendObj)  {
  let empUrl=this.clientService.GetOpentaskDatabyMilestone();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetAllOpenProjectRevenueByOrgID(sendObj)  {
  let empUrl=this.clientService.GetAllOpenProjectRevenueByOrgID();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetProjectInvoiceReport(sendObj)  {
  let empUrl=this.clientService.GetProjectInvoiceReport();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetMiltestoneDatByProjectandDate(sendObj)  {
  let empUrl=this.clientService.GetMiltestoneDatByProjectandDate();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetProjectwithMilestoneData(sendObj)  {
  let empUrl = this.clientService.GetProjectwithMilestoneData();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetEmployeeProductvityByOrgID(sendObj)  {
  let empUrl = this.clientService.GetEmployeeProductvityByOrgID();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetGroupedPrjtTskbyEmpId(sendObj)  {
  let empUrl = this.clientService.GetGroupedPrjtTskbyEmpId();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
}

GetGroupedNrmlTskbyEmpId(sendObj)  {
  let empUrl = this.clientService.GetGroupedNrmlTskbyEmpId();
  return this.http.post(empUrl,sendObj).pipe(retry(1),catchError(this.handleError))
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
