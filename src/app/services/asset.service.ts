import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable(
  { providedIn: 'root'}
  )


  export class AssetService {

   
    constructor(private http: HttpClient, private clientService: ClientService) {
    }

    //Http Options
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept':'*/*',
        'Access-Control-Allow-Origin':'*'
      })
    }

    //Handlling Error
    handleError(error) {
      let errorMessage = '';
      if(error.status === 0){
        errorMessage = 'Internal Server Error';
      } else {
        errorMessage = 'Something went wrong. please try again';
      }
      return throwError(errorMessage);
    }

    AddAsset(postData)  {
      let empUrl=this.clientService.AddAsset();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    AddAssetAssignHistory(postData) {
      let empUrl=this.clientService.AddAssetAssignHistory();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    GetAssetAssignHistory(postData) {
      let empUrl = this.clientService.GetAssetAssignHistory();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    addAssetHistoryByID(postData) {
      let empUrl = this.clientService.addAssetHistoryByID();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    getAssetHistoryByOrgId(postData) {
      let empUrl = this.clientService.getAssetHistoryByOrgId();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }


    getAssetbyOrgId(postData)  {
      let empUrl=this.clientService.getAssetbyOrgId();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    UpdateAssetByID(postData) {
      let empUrl = this.clientService.UpdateAssetByID();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    RemoveAsset(postData) {
      let empUrl=this.clientService.RemoveAsset();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    DeleteAsset(postData) {
      let empUrl = this.clientService.DeleteAsset();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    GetAssetTypeByOrgId(postData) {
      let empUrl = this.clientService.GetAssetTypeByOrgId();
      return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
    }

    AddAssetType(postData) {
      let empUrl = this.clientService.AddAssetType();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    UpdateAssetTypeByID(postData) {
      let empUrl = this.clientService.UpdateAssetTypeById();    
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    AddAssetStatus(postData) {
      let empUrl = this.clientService.AddAssetStatus();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    GetAssetStatusByOrgId(postData) { 
      let empUrl = this.clientService.GetAssetStatusByOrgId();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    UpdateAssetStatusByID(postData) {
      let empUrl = this.clientService.UpdateAssetStatusById();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    AddAssetCategory(postData) {
      let empUrl = this.clientService.AddAssetCategory();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    GetAssetCategoryByOrgId(postData) {
      let empUrl = this.clientService.GetAssetCategoryByOrgId();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    UpdateAssetCategoryByID(postData) {
      let empUrl = this.clientService.UpdateAssetCategoryById();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    GetMaintenanceHistory(postData) {
      let empUrl = this.clientService.GetMaintenanceHistory();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))    
    }

    AddMaintenanceHistory(postData) {
      let empUrl = this.clientService.AddMaintenanceHistory();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }

    GetRepairHistory(postData) {
      let empUrl = this.clientService.GetRepairHistory();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))    
    }

    AddRepairHistory(postData) {
      let empUrl = this.clientService.AddRepairHistory();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))    
    }

    generateMaintenanceReimb(postData) {
      let empUrl = this.clientService.generateMaintenanceReimb();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))    
    }
  }
