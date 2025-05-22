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
export class IntfutService {
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
  AddIntfut_floor(postData) {
    let empUrl = this.clientService.AddIntfut_floor();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddIntfutBOQ(postData) {
    let empUrl = this.clientService.AddIntfutBOQ();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetintfutFloorById(postData) {
    let empUrl = this.clientService.GetintfutFloorById();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdateIntfutFloorById(postData) {
    let empUrl = this.clientService.UpdateIntfutFloorById();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetIntfutEstSummary(postData) {
    let empUrl = this.clientService.GetIntfutEstSummary();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  GetInfutBOQByProjectId(postData) {
    let empUrl = this.clientService.GetInfutBOQByProjectId();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddIntfutEstSummary(postData) {
    let empUrl = this.clientService.AddIntfutEstSummary();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  AddProjectService(postData) {
    let empUrl = this.clientService.AddProjectService();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetProjectServicebyID(postData) {
    let empUrl = this.clientService.GetProjectServicebyID();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  DeleteProjectServicebyID(postData) {
    let empUrl = this.clientService.DeleteProjectServicebyID();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetboqcustablebyID(postData) {
    let empUrl = this.clientService.GetboqcustablebyID();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdateProjectServiceCatListbyID(postData) {
    let empUrl = this.clientService.UpdateProjectServiceCatListbyID();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  Addboqcustable(postData) {
    let empUrl = this.clientService.Addboqcustable();
    console.log(empUrl, postData, "API")
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddServiceEstimationTemplate(postData){
    let empUrl = this.clientService.AddServiceEstimationTemplate();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdateServiceEstimationTemplateById(postData){
    let empUrl = this.clientService.UpdateServiceEstimationTemplateById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdateProjectServiceById(postData){
    let empUrl = this.clientService.UpdateProjectServiceById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetServiceEstimationTemplateByOrgId(){
    let postData={OrgID:this.orgID}
    let empUrl = this.clientService.GetServiceEstimationTemplateByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetIntfutServicesByOrgId(){
    let postData={OrgID:this.orgID}
    let empUrl = this.clientService.GetIntfutServicesByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  DeleteServiceEstimationTemplateById(postData){
    let empUrl = this.clientService.DeleteServiceEstimationTemplateById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
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