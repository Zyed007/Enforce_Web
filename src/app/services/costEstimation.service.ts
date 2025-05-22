import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable(
{ providedIn: 'root'}
)

export class costEstimationService {

  userInfo:any = JSON.parse(localStorage.getItem('user_info'));
  orgID =  this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id');

  constructor(
    private http: HttpClient,
    private clientService: ClientService
  ){ }

  FetchAllCostProjectByOrgID(){
    let org_id = {id: localStorage.getItem('org_id')}
    let empUrl=this.clientService.FetchAllCostProjectByOrgID();
    return this.http.post(empUrl, org_id).pipe(retry(1),catchError(this.handleError));
  }

  NewAddCostProject(postData)  {
    let empUrl=this.clientService.NewAddCostProject();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError));
  }

  CalculateCostProject(postData){
    let empUrl=this.clientService.CalculateCostProject();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError));
  }

  GetProjectEstimationService(postData){
    let empUrl=this.clientService.GetProjectEstimationService();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError));
  }

  GetEstimationServiceById(postData){
    let empUrl=this.clientService.GetEstimationServiceById();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError));
  }

  GetCostInflatorbyServiceById(postData){
    let empUrl=this.clientService.GetCostInflatorbyServiceById();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError));
  }

  GetStaticTasksByEstimationId(postData){
    let empUrl=this.clientService.GetStaticTasksByEstimationId();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError));
  }

  GetWrappedMilestoneByService(postData){
    let empUrl=this.clientService.GetWrappedMilestoneByService();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError));
  }

  ProjectEstimationService(postData){
    let empUrl = this.clientService.ProjectEstimationService();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError));
  }

  FetchAllTypeOfDesignByOrgID(){
    let empUrl=this.clientService.FetchAllTypeOfDesignByOrgID();
    return this.http.post(empUrl,{ID:this.orgID},this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  GetProjectTypeByOrgID(){
    let empUrl = this.clientService.GetProjectTypeByOrgID();
    return this.http.post(empUrl,{ID:this.orgID}).pipe(retry(1),catchError(this.handleError))
  }

  FetchAllPackagesByOrgID(){
    let empUrl = this.clientService.FetchAllPackagesByOrgID();
    return this.http.post(empUrl, {id:this.orgID}).pipe(retry(1),catchError(this.handleError))
  }

  FetchAllUnitDescriptionByOrgID(){
    let empUrl=this.clientService.FetchAllUnitDescriptionByOrgID();
    return this.http.post(empUrl, {id:this.orgID}).pipe(retry(1),catchError(this.handleError))
  }

  NewUpdateCostProject(postData){
    let empUrl=this.clientService.NewUpdateCostProject();
    return this.http.patch(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  FetchCostPerHourOrgID(){
    let empUrl=this.clientService.FetchCostPerHourOrgID();
    return this.http.post(empUrl, {id:this.orgID}).pipe(retry(1),catchError(this.handleError));
  }

  UpdateCostProjectFinalValueByCostProjectID(postData){
    let empUrl=this.clientService.UpdateCostProjectFinalValueByCostProjectID();
    return this.http.patch(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  UpdateCostProjectDiscountAndProfitMarginByProjectID(postData){
    let empUrl=this.clientService.UpdateCostProjectDiscountAndProfitMarginByProjectID();
    return this.http.patch(empUrl, postData).pipe(retry(1),catchError(this.handleError));
  }

  GetEstimationServiceByOrgId(){
    let empUrl=this.clientService.GetEstimationServiceByOrgId();
    return this.http.post(empUrl, {orgID: this.orgID }).pipe(retry(1),catchError(this.handleError))
  }

  UpdateCostProjectDetails(postData){
    let empUrl=this.clientService.UpdateCostProjectDetails();
    return this.http.patch(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  FindByCostProjectID(postData){
    let empUrl=this.clientService.FindByCostProjectID();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  GetLastAddedQuotationPrefixByOrgID(){
    let empUrl=this.clientService.GetLastAddedQuotationPrefixByOrgID();
    return this.http.post(empUrl, {id: this.orgID }).pipe(retry(1),catchError(this.handleError))
  }

  GetAllPrefixByOrgID(){
    let empUrl=this.clientService.GetAllPrefixByOrgID();
    return this.http.post(empUrl,{orgID: this.orgID }).pipe(retry(1),catchError(this.handleError))
  }

  NewAddProjectTask(postData){
    let empUrl=this.clientService.NewAddProjectTask();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  UpdateIsQuotationByCostProjectID(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateIsQuotationByCostProjectID();
    postData['createdby']=user['full_name'];

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  AddQuotation(postData) {
    let empUrl = this.clientService.AddQuotation();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  RemoveCostProjectByID(postData){
    let empUrl=this.clientService.RemoveCostProjectByID();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  FetchPaymentPolicyByServiceId(serviceId){
    let postData = {
      "orgID": this.orgID,
      "id": serviceId
    }
    let empUrl = this.clientService.FetchPaymentPolicyByServiceId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }


  GetProjectAddtionalDetailsByCstId(id){
    // let org_id = {id: localStorage.getItem('org_id')}
    let empUrl=this.clientService.GetProjectAddtionalDetailsByCstId();
    return this.http.post(empUrl, id).pipe(retry(1),catchError(this.handleError));
  }

  UpdateProjectAdditionalDetails(postData){
    ///Project/UpdateProjectAdditionalDetails
      let empUrl=this.clientService.UpdateProjectAdditionalDetails();
      return this.http.patch(empUrl, postData).pipe(retry(1),catchError(this.handleError))
    }
  

    AddProjectAdditionalDetails(postData){
      let empUrl=this.clientService.AddProjectAdditionalDetails();
      return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
    }

    FetchProjectprefixById(projectPrefix){
      let postData = {
        "orgID": this.orgID,
        "id": projectPrefix
      }
      let empUrl = this.clientService.CheckprojectprefixExist();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    GetProjectAddtionalDetailsByPrjId(id){
      // let org_id = {id: localStorage.getItem('org_id')}
      let empUrl=this.clientService.GetProjectAddtionalDetailsByPrjId();
      return this.http.post(empUrl, id).pipe(retry(1),catchError(this.handleError));
    }




  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':'*/*',
      'Access-Control-Allow-Origin':'*',
    })
  }



  // Error handling
  handleError(error){
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Internal Server Error`;
    }
    return throwError(errorMessage);
  }

}
