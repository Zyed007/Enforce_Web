import { Injectable } from "@angular/core";
import { ClientService } from "./clientUtilService";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { retry, catchError, tap, map } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import moment = require("moment");
import { data } from "jquery";

let orgId = {
  id: localStorage.getItem("org_id"),
};
let user_info: object;
if (localStorage.getItem("user_info")) {
  user_info = JSON.parse(localStorage.getItem("user_info"));
}

@Injectable({ providedIn: "root" })
export class InventoryService {
  userInformation = JSON.parse(localStorage.getItem("user_info"));
  orgID =
    this.userInformation.org_id !== null
      ? this.userInformation.org_id
      : localStorage.getItem("org_id");
  orgId = {
    orgID: this.orgID
  }
  constructor(private http: HttpClient, private clientService: ClientService) { }
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
    }),
  };
  AddInventoryItem(postData) {
    let empUrl = this.clientService.AddinventoryItem();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddInventoryBulkItems(postData) {
    let empUrl = this.clientService.AddInventoryBulkItems();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetInventoryByOrgId(postData) {
    let empUrl = this.clientService.GetInventoryByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetInventoryByItemId(postData) {
    
    let empUrl = this.clientService.GetInventoryByItemId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetInventoryVendorData(postData) {
   
    let empUrl = this.clientService.GetInventoryVendorData();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  //Inventory Unit
  AddInventoryUnit(postData) {
    let empUrl = this.clientService.AddInventoryUnit();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetInventoryUnitByOrgId() {
    let empUrl = this.clientService.GetInventoryUnitByOrgId();
    return this.http
      .post(empUrl, this.orgId)
      .pipe(retry(1), catchError(this.handleError));
  }
  // /Inventory/UpdateInventoryUnitByID
  UpdateInventoryUnitByID(postData) {
    let empUrl = this.clientService.UpdateInventoryUnitByID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddInventoryTag(postData) {
    let empUrl = this.clientService.AddInventoryTag();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdateInventoryItemByID(postData) {
    let empUrl = this.clientService.UpdateInventoryItemByID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetInventoryTagByOrgId() {
    let empUrl = this.clientService.GetInventoryTagByOrgId();
    return this.http
      .post(empUrl, this.orgId)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetInventoryByCategory(postData) {
    let empUrl = this.clientService.GetInventoryByCategory();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  uploadInventory(vals): Observable<any> {
    let data = vals;
    return this.http.post(                                             
      "https://api.cloudinary.com/v1_1/dzjsbplvh/image/upload",
      data
    );
  }
  DeleteInventoryByItemId(postData){
    let empUrl = this.clientService.DeleteInventoryByItemId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  createInvTemplate(postData){
    let empUrl=this.clientService.createInvTemplate();
  
    return this.http.post(empUrl,postData)
    .pipe(
      retry(1),
  
      catchError(this.handleError)
    )
  }
  
  // Error handling
  handleError(error) {
    let errorMessage = "";
    if (error.status === 0) {
      errorMessage = "Internal Server Error";
    } else {
      errorMessage = "Something went wrong. please try again";
    }
    return throwError(errorMessage);
  }

}