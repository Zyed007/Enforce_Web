import { Injectable } from "@angular/core";
import { ClientService } from "./clientUtilService";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { retry, catchError, tap } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class settingsService {
  userInfo: any = JSON.parse(localStorage.getItem("user_info"));
  orgID =
    this.userInfo.org_id !== null
      ? this.userInfo.org_id
      : localStorage.getItem("org_id");

  constructor(private http: HttpClient, private clientService: ClientService) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
    }),
  };

  GetAllStaticMilestoneByOrgID() {
    let postData = {
      id: localStorage.getItem("org_id"),
    };
    let empUrl = this.clientService.GetAllStaticMilestoneByOrgID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetVendorDocumentUploadTypeByOrgId() {
    let empUrl = this.clientService.GetVendorDocumentUploadTypeByOrgId();
    return this.http
      .post(empUrl, { orgID: this.orgID })
      .pipe(retry(1), catchError(this.handleError));
  }

  GetVendorCategoryTypesByOrgId() {
    let empUrl = this.clientService.GetVendorCategoryTypesByOrgId();
    return this.http
      .post(empUrl, { orgID: this.orgID })
      .pipe(retry(1), catchError(this.handleError));
  }

  GetVendorStatusByOrgId() {
    let empUrl = this.clientService.GetVendorStatusByOrgId();
    return this.http
      .post(empUrl, { orgID: this.orgID })
      .pipe(retry(1), catchError(this.handleError));
  }

  AddVendorCategoryTypes(postData) {
    let empUrl = this.clientService.AddVendorCategoryTypes();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddVendorStatus(postData) {
    let empUrl = this.clientService.AddVendorStatus();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddStaticMilestone(postData) {
    let empUrl = this.clientService.AddStaticMilestone();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateStaticMilestoneById(postData) {
    let empUrl = this.clientService.UpdateStaticMilestoneById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddEstimationService(postData) {
    let empUrl = this.clientService.AddEstimationService();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetEstimationServiceByOrgId() {
    let postData = {
      orgID: this.orgID,
    };
    let empUrl = this.clientService.GetEstimationServiceByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetStaticMilestoneTasksByMilestoneID(mileStoneID) {
    let postData = {
      id: mileStoneID,
    };
    let empUrl = this.clientService.GetStaticMilestoneTasksByMilestoneID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateEstimationService(postData) {
    let empUrl = this.clientService.UpdateEstimationService();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  DeleteEstimationService(postData) {
    let empUrl = this.clientService.DeleteEstimationService();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  CommisionTypeByOrgID() {
    let postData = {
      orgID: this.orgID,
    };
    let empUrl = this.clientService.CommisionTypeByOrgID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddIncomeType(postData) {
    let empUrl = this.clientService.AddIncomeType();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddCommissionType(postData) {
    let empUrl = this.clientService.AddCommissionType();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddVendorDocuments(postData) {
    let empUrl = this.clientService.AddVendorDocuments();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddVendorDocumentUploadType(postData) {
    let empUrl = this.clientService.AddVendorDocumentUploadType();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetIncomeTypeByOrgId() {
    let postData = {
      orgID: this.orgID,
    };
    let empUrl = this.clientService.GetIncomeTypeByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  CommisionTypeByincTypId(postData) {
    let empUrl = this.clientService.CommisionTypeByincTypId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateIncomeTypeById(postData) {
    let empUrl = this.clientService.UpdateIncomeTypeById();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateVendorDocumentUploadTypeById(postData) {
    let empUrl = this.clientService.UpdateVendorDocumentUploadTypeById();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateVendorCategoryTypesById(postData) {
    let empUrl = this.clientService.UpdateVendorCategoryTypesById();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateVendorStatusById(postData) {
    let empUrl = this.clientService.UpdateVendorStatusById();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateCommisionType(postData) {
    let empUrl = this.clientService.UpdateCommisionType();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateDocumentUrlById(postData) {
    let empUrl = this.clientService.UpdateDocumentUrlById();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateCommissionServiceById(postData) {
    let empUrl = this.clientService.UpdateCommissionServiceById();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetCommissionPolicybyComId(postData) {
    let empUrl = this.clientService.GetCommissionPolicybyComId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  FetchCommissionPolicyByOrg() {
    let postData = {
      orgID: this.orgID,
    };
    let empUrl = this.clientService.FetchCommissionPolicyByOrg();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddCommissionPolicy(postData) {
    let empUrl = this.clientService.AddCommissionPolicy();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetCommissionServiceByOrgId() {
    let postData = {
      orgID: this.orgID,
    };
    let empUrl = this.clientService.GetCommissionServiceByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetCommissionServiceByDateOrgId(fromDate, toDate) {
    let postData = {
      orgID: this.orgID,
      fromDate: fromDate,
      toDate: toDate,
    };
    let empUrl = this.clientService.GetCommissionServiceByDateOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateCommissionPolicy(postData) {
    let empUrl = this.clientService.UpdateCommissionPolicy();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetCommissionVendors() {
    let postData = {
      orgID: this.orgID,
    };
    let empUrl = this.clientService.GetCommissionVendors();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  EntityContactsByVendorId(postData) {
    let empUrl = this.clientService.EntityContactsByVendorId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  DocumentUrlByVendorId(postData) {
    let empUrl = this.clientService.DocumentUrlByVendorId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetLastCommissionServiceByOrgId() {
    let postData = {
      orgID: this.orgID,
    };
    let empUrl = this.clientService.GetLastCommissionServiceByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  uploadSignature(vals): Observable<any> {
    let data = vals;
    return this.http.post(
      "https://api.cloudinary.com/v1_1/dq7ta9et2/image/upload",
      data
    );
  }

  uploadEmpDoc(vals): Observable<any> {
    let data = vals;
    return this.http.post(
      "https://api.cloudinary.com/v1_1/dtlt6afvv/image/upload",
      data
    );
  }

  uploadphoto(vals): Observable<any> {
    let data = vals;
    return this.http.post(
      "https://circles-pro-backend.onrender.com/api-v1/uploadImage",
      data
    );
  }

  deletephoto(vals): Observable<any> {
    let url =
      "https://circles-pro-backend.onrender.com/api-v1/deleteImage/" + vals;
    let payload = {};
    return this.http.post(url, payload);
  }

  AddCommissionVendors(postData) {
    let empUrl = this.clientService.AddCommissionVendors();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateCommissionVendors(postData) {
    let empUrl = this.clientService.UpdateCommissionVendors();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateEntityContactsByVendorId(postData) {
    let empUrl = this.clientService.UpdateEntityContactsByVendorId();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddCommissionService(postData) {
    let empUrl = this.clientService.AddCommissionService();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddCostInfltrService(postData){
    let empUrl=this.clientService.AddCostInfltr();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  UpdateCostInfltrService(postData){
    let empUrl=this.clientService.UpdateCostInfltr();
    return this.http.patch(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  NewUpdateEstimationService(postData){
    let empUrl=this.clientService.NewUpdateEstimationService();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  AddServiceMainCategory(postData){
    let empUrl=this.clientService.AddServiceMainCategory();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }


  UpdateServiceMainCategory(postData){
    let empUrl=this.clientService.UpdateServiceMainCategory();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }




  GetServiceMainCategorybyOrgId() {
    let postData = {
      orgID: this.orgID,
    };
    let empUrl = this.clientService.GetServiceMainCategoryByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetStorageUsage() {
    let postData = {
      orgID: this.orgID,
    };
    let empUrl = this.clientService.GetStorageUsage();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  

  GetServicePrimaryCategoryByMain(id) {
    let postData = {
      orgID: id,
    };
    let empUrl = this.clientService.GetServicePrimaryCategoryByMain();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  GetServiceSubCategoryByMain(id) {
    let postData = {
      orgID: id,
    };
    let empUrl = this.clientService.GetServiceSubCategoryByMain();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }





  // Error handling
  handleError(error) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Internal Server Error`;
    }
    return throwError(errorMessage);
  }
}
