import { Injectable } from "@angular/core";
import { ClientService } from "./clientUtilService";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { retry, catchError, tap } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
let orgId = {
  id: localStorage.getItem("org_id"),
};

@Injectable({ providedIn: "root" })
export class EmployeeService {
  constructor(private http: HttpClient, private clientService: ClientService) {}
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
    }),
  };



  AddEmployeeDocument(postData){
    let empUrl = this.clientService.AddEmployeeDocument();
    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetDocumentsByempId(postData){
    let empUrl = this.clientService.GetDocumentsByempId();
    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetDocumentsByempIdwithDelete(postData){
    let empUrl = this.clientService.GetDocumentsByempIdwithDelete();
    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }


  DeleteDocumentByEmpIDName(postData){
    let empUrl = this.clientService.DeleteDocumentByEmpIDName();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  DeleteDocumentByEmpId(postData){
    let empUrl = this.clientService.DeleteDocumentByEmpId();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  GroupedTimeSheetBreakByEmpIdAndDate(postData){
    let empUrl = this.clientService.GroupedTimeSheetBreakByEmpIdAndDate();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  GetOverTimeWrkbyEmpID(postData){
    let empUrl = this.clientService.GetOverTimeWrkbyEmpID();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }


  GetOverTimeWrkbyHlfEmpID(postData){
    let empUrl = this.clientService.GetOverTimeWrkbyEmpID();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  getAllEmployee() {
    let empUrl = this.clientService.getAllEmployee();

    return this.http
      .get(empUrl, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  getEmployeeByOrgId() {
    let org_id = {
      id: localStorage.getItem("org_id"),
    };
    let empUrl = this.clientService.getEmployeeByOrgId();

    return this.http
      .post(empUrl, org_id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdateNotifyIsViewedByEmpID(postData) {
    let empUrl = this.clientService.UpdateNotifyIsViewedByEmpID();

    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetWeekdaysByOrgID(postData) {
    let org_id = {
      id: localStorage.getItem("org_id"),
    };
    let empUrl = this.clientService.GetWeekdaysByOrgID();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddWeekdays(postData) {
    let empUrl = this.clientService.AddWeekdays();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdateWeekdays(postData) {
    let empUrl = this.clientService.UpdateWeekdays();

    return this.http
      .patch(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetEntityTrackingDaysByOrgID(postData) {
    let org_id = {
      id: localStorage.getItem("org_id"),
    };
    let empUrl = this.clientService.GetEntityTrackingDaysByOrgID();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  SetEmployeeRoles(postData) {
    let empUrl = this.clientService.SetEmployeeRoles();
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }

    postData["createdby"] = user_info["full_name"];

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetEmployeeRoleByOrgID() {
    let postData = {
      id: localStorage.getItem("org_id"),
    };

    let empUrl = this.clientService.GetEmployeeRoleByOrgID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetEmpListWithRolesByOrgID() {
    let postData = {
      id: localStorage.getItem("org_id"),
    };

    let empUrl = this.clientService.GetEmpListWithRolesByOrgID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetDepListWithRolesByOrgID() {
    let postData = {
      id: localStorage.getItem("org_id"),
    };

    let empUrl = this.clientService.GetDepListWithRolesByOrgID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetDepartmentRoleByDepartmentID(postData) {
    let empUrl = this.clientService.GetDepartmentRoleByDepartmentID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  DeleteEmployeeRoles(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }

    postData["createdby"] = user_info["full_name"];
    let empUrl = this.clientService.DeleteEmployeeRoles();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetEmployeeRoleByEmpID(postData) {
    let empUrl = this.clientService.GetEmployeeRoleByEmpID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddEntityTrackingDays(postData) {
    let empUrl = this.clientService.AddEntityTrackingDays();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdateEntityTrackingDays(postData) {
    let empUrl = this.clientService.UpdateEntityTrackingDays();

    return this.http
      .patch(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddApprovalTrackingSetup(postData) {
    let empUrl = this.clientService.AddApprovalTrackingSetup();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  getEmpList() {
    return this.http
      .post(this.clientService.getAllEmployee(), "", this.httpOptions)
      .pipe(
        tap() // Log the result or error
      );
  }

  AddEmployee(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }

    postData["createdby"] = user_info["full_name"];
    postData["org_id"] = localStorage.getItem("org_id");
    let empUrl = this.clientService.addEmployee();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddLabourEmployee(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }

    postData["createdby"] = user_info["full_name"];
    postData["org_id"] = localStorage.getItem("org_id");
    let empUrl = this.clientService.AddLabourEmployee();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddEmployeeDetailsOverride(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    postData["createdby"] = user_info["id"];
    postData["org_id"] = localStorage.getItem("org_id");
    let empUrl = this.clientService.AddEmployeeDetailsOverride();
    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddEmployeeExtention(postData) {
    if (localStorage.getItem("org_id")) {
      postData["org_id"] = localStorage.getItem("org_id");
    }
    let empUrl = this.clientService.AddEmployeeExtention();
    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateEmployeeExtensionByempId(postData) {
    let empUrl = this.clientService.UpdateEmployeeExtensionByempId();
    return this.http
      .patch(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetEmployeeExtensionByempId(postData) {
    let empUrl = this.clientService.GetEmployeeExtensionByempId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetEmployeeBankDetailsByorgId(postData) {
    let empUrl = this.clientService.GetEmployeeBankDetailsByorgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  getByEmployeeID(postData) {
    let empUrl = this.clientService.getByEmployeeID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  getEmployeeByID(postData) {
    let empUrl = this.clientService.getEmployeeByID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  GetLeaveAvailableProfileHistorybyOrgIdEmpId(postData) {
    let empUrl =
      this.clientService.GetLeaveAvailableProfileHistorybyOrgIdEmpId();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  TimeSheetBreakByEmpIdAndDate(postData) {
    let empUrl = this.clientService.TimeSheetBreakByEmpIdAndDate();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  LocationExceptionByEmpIdAndDate(postData) {
    let empUrl = this.clientService.LocationExceptionByEmpIdAndDate();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  getEmpByDeptID(postData) {
    let empUrl = this.clientService.getEmpByDeptID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  getEmpByDesgnID(postData) {
    let empUrl = this.clientService.getEmpByDesgnID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  updateEmp(postData) {
    let user: object;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    postData["modifiedby"] = user["full_name"];
    postData["org_id"] = localStorage.getItem("org_id");

    let empUrl = this.clientService.updateEmp();

    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  delEmp(postData) {
    let user: object;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    postData["modifiedby"] = user["full_name"];
    let empUrl = this.clientService.delEmp();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  delEmpStatus(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    postData["modifiedby"] = user_info["full_name"];
    let empUrl = this.clientService.delEmpStatus();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  delEmpType(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    postData["modifiedby"] = user_info["full_name"];
    let empUrl = this.clientService.delEmpType();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  RemoveEmployeePermanent(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    postData["modifiedby"] = user_info["full_name"];
    let empUrl = this.clientService.RemoveEmployeePermanent();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddEmployeeStatus(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    postData["createdby"] = user_info["full_name"];
    postData["org_id"] = localStorage.getItem("org_id");

    let empUrl = this.clientService.addEmployeeStatus();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  getAllEmpStatus() {
    let empUrl = this.clientService.getAllEmpStatus();

    return this.http
      .get(empUrl, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  getByEmpStatusID(postData) {
    let empUrl = this.clientService.getByEmpStatusID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  empDepartDesignByEmpID(postData) {
    let empUrl = this.clientService.empDepartDesignByEmpID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  FindEmpDepartDesignByTeamID(postData) {
    let empUrl = this.clientService.FindEmpDepartDesignByTeamID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  updateEmpStatus(postData) {
    let empUrl = this.clientService.updateEmpStatus();
    postData["org_id"] = localStorage.getItem("org_id");

    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetEmpOverrideDetailsById(postData) {
    let empUrl = this.clientService.GetEmpOverrideDetailsById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetEmpUpdateHistoryByEmpId(postData) {
    let empUrl = this.clientService.GetEmpUpdateHistoryByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateEmployeeDetailsOverrideByID(postData) {
    let empUrl = this.clientService.UpdateEmployeeDetailsOverrideByID();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddEmployeeType(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    postData["createdby"] = user_info["full_name"];
    postData["org_id"] = localStorage.getItem("org_id");

    let empUrl = this.clientService.addEmployeeType();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  getAllEmpType() {
    let empUrl = this.clientService.getAllEmpType();

    return this.http
      .get(empUrl, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  getByEmpTypeID(postData) {
    let empUrl = this.clientService.getByEmpTypeID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  IsPhoneValid(postData) {
    let empUrl = this.clientService.IsPhoneValid();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  sendLoginNotification(postData) {
    let empUrl = this.clientService.sendLoginNotification();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  verifyUserLoginOTP(postData) {
    let empUrl = this.clientService.verifyUserLoginOTP();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  updateEmpType(postData) {
    let empUrl = this.clientService.updateEmpType();
    postData["org_id"] = localStorage.getItem("org_id");

    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddIndustryType(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    postData["createdby"] = user_info["full_name"];

    let empUrl = this.clientService.addIndustryType();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  getAllIndustryType() {
    let empUrl = this.clientService.getAllIndustryType();

    return this.http
      .get(empUrl, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  getByIndustryTypeID(postData) {
    let empUrl = this.clientService.getByIndustryTypeID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  LeaveCountByEmpID(postData) {
    let empUrl = this.clientService.LeaveCountByEmpID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  EmployeeLeaveListAdjustmentOrgID() {
    let user = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    let postData = {
      id: localStorage.getItem("org_id"),
    };
    let empUrl = this.clientService.EmployeeLeaveListAdjustmentOrgID();

    //  postData['modifedby']=user['full_name'];

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateIndustryType(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    postData["createdby"] = user_info["full_name"];
    postData["modifiedby"] = user_info["full_name"];
    let empUrl = this.clientService.updateIndustryType();

    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetEmployeeRoles() {
    let empUrl = this.clientService.GetEmployeeRoles();

    return this.http.get(empUrl).pipe(retry(1), catchError(this.handleError));
  }
  getAllOutsourcedEmpByOrgID() {
    let org_id = {
      orgID: localStorage.getItem("org_id"),
    };
    let empUrl = this.clientService.getAllOutsourcedEmpByOrgID();

    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }
  getAllFreelancerEmpByOrgID() {
    let org_id = {
      orgID: localStorage.getItem("org_id"),
    };
    let empUrl = this.clientService.getAllFreelancerEmpByOrgID();

    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  fetchGridDataEmployeeByOrgID() {
    let empUrl = this.clientService.fetchGridDataEmployeeByOrgID();
    let org_id = {
      orgID: localStorage.getItem("org_id"),
    };
    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  getEmployeeDataByOrgID(id) {
    let empUrl = this.clientService.fetchGridDataEmployeeByOrgID();
    let org_id = {
      orgID: id,
    };
    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetEmployeeTypeByOrgID() {
    let empUrl = this.clientService.GetEmployeeTypeByOrgID();
    let org_id = {
      ID: localStorage.getItem("org_id"),
    };
    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddWorkLocation(postData) {
    let empUrl = this.clientService.AddWorkLocation();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }
  GetWorkLocationByOrgId(postData) {
    let empUrl = this.clientService.GetWorkLocationByOrgId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateWorkLocationByID(postData) {
    let empUrl = this.clientService.UpdateWorkLocationByID();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }


  GetEmployeeStatusByOrgID() {
    let empUrl = this.clientService.GetEmployeeStatusByOrgID();
    let org_id = {
      ID: localStorage.getItem("org_id"),
    };
    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  getCaseTypeByOrgId() {
    let empUrl = this.clientService.GetAllCaseTypeByOrgId();
    let org_id = {
      orgID: localStorage.getItem("org_id"),
    };
    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  getCaseAssignedByEmpId() {
    let empUrl = this.clientService.GetCaseAssignedtoUser();
    let org_id = {
      id: JSON.parse(localStorage.getItem("user_info")).id,
    };
    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  getCaseActivityHistoryById(id) {
    let empUrl = this.clientService.GetCaseActivityHistoryById();
    let org_id = {
      id: id,
    };
    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddEmpGecoCodEvent(postData) {
    let empUrl = this.clientService.AddEmpGecoCodEvent();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddEmpMapViewEvent(postData) {
    let empUrl = this.clientService.AddEmpMapViewEvent();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetEmployeeDetailsOverrideByApproverRoleID(postData) {
    let empUrl =
      this.clientService.GetEmployeeDetailsOverrideByApproverRoleID();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddCaseHistory(postData) {
    let empUrl = this.clientService.AddCaseHistory();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetCaseHistoryByID(postData) {
    let empUrl = this.clientService.GetCaseHistoryByID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateCaseHistoryByID(postData) {
    let empUrl = this.clientService.UpdateCaseHistoryByID();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  EmployeeLocationByEmpIDAndDate(postData) {
    let empUrl = this.clientService.EmployeeLocationByEmpIDAndDate();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  EmployeeTravelClmByOrgIdAndDate(postData) {
    let empUrl = this.clientService.EmployeeTravelClmByOrgIdAndDate();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetCaseActivityByCaseID(postData) {
    let empUrl = this.clientService.GetCaseActivityByCaseID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddCaseActivity(postData) {
    let empUrl = this.clientService.AddCaseActivity();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateCaseActivityByID(postData) {
    let empUrl = this.clientService.UpdateCaseActivityByID();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetCaseByOrgIdDate(postData) {
    let empUrl = this.clientService.GetCaseByOrgIdDate();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetAppUsageDataByOrgId(postData) {
    let empUrl = this.clientService.GetAppUsageDataByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  EmployeeAvialAttendanceSummaryById(postData) {
    let empUrl = this.clientService.EmployeeAvialAttendanceSummaryById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  EmployeeApprovedLeaveSummaryById(postData) {
    let empUrl = this.clientService.EmployeeApprovedLeaveSummaryById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  EmployeeAllLeaveSummaryById(postData) {
    let empUrl = this.clientService.EmployeeAllLeaveSummaryById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  EmployeeAllLeaveSummaryByOrgId(postData) {
    let empUrl = this.clientService.EmployeeAllLeaveSummaryByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  EmployeeAllLeavePendingSummaryByOrgId(postData) {
    let empUrl = this.clientService.EmployeeAllLeavePendingSummaryByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  GetTimeSheetOverridebyEmpID(postData) {
    let empUrl = this.clientService.GetTimeSheetOverridebyEmpID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetLessHoursWrkbyHlfEmpID(postData) {
    let empUrl = this.clientService.GetLessHoursWrkbyHlfEmpID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetLessHoursWrkbyEmpID(postData) {
    let empUrl = this.clientService.GetLessHoursWrkbyEmpID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  EmployeeAttendanceSummaryById(postData) {
    let empUrl = this.clientService.EmployeeAttendanceSummaryById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  EmployeeSummaryReportByRangeOrgId(postData) {
    let empUrl = this.clientService.EmployeeSummaryReportByRangeOrgId();
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

  GetAllEmployeeDetailsOverrideByOrgID()
  {
    let org_id = {
      orgID: localStorage.getItem("org_id"),
    };
    let empUrl = this.clientService.GetAllEmployeeDetailsOverrideByOrgID();

    return this.http
      .patch(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  getWorkingHrsByEmpId(postData)
  {
    let empUrl = this.clientService.getWorkingHrsByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddDraftEmployeeOverride(postData){
    let empUrl = this.clientService.AddDraftEmployeeOverride();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  RemoveOverrideDetailsById(postData){
    let empUrl = this.clientService.RemoveOverrideDetailsById();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateEmployeeFromDraft(postData){
    let empUrl = this.clientService.UpdateEmployeeFromDraft();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  sendEmpEdtAprReq(postData){
    let empUrl = this.clientService.sendEmpEdtAprReq();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  getJsonFromCsv(postData){
    let empUrl = this.clientService.getJsonFromCsv();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  getDashBoardTeamMemberDataByOrgId(){
    let org_id = {
      id: localStorage.getItem("org_id"),
    };
    let empUrl = this.clientService.getDashBoardTeamMemberDataByOrgId();
    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateDocById(postData){
    let empUrl = this.clientService.UpdateDocById();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetLastempcodeByOrgId(){
    let org_id = {
      id: localStorage.getItem("org_id"),
    };
    let empUrl = this.clientService.GetLastempcodeByOrgId();
    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  getSalaryDetailsByOrgId(){
    let org_id = {
      id: localStorage.getItem("org_id"),
    };
    let empUrl = this.clientService.getSalaryDetailsByOrgId();
    return this.http
      .post(empUrl, org_id)
      .pipe(retry(1), catchError(this.handleError));
  }

  getRoleNameByroleID(postData){
    let empUrl = this.clientService.getRoleNameByroleID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateApprovalInDraftById(postData){
    let empUrl = this.clientService.UpdateApprovalInDraftById();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  getEmployeeEditHistoryByEmpId(postData){
    let empUrl = this.clientService.getEmployeeEditHistoryByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetEmployeeDraftdelailsByID(postData){
    let empUrl = this.clientService.GetEmployeeDraftdelailsByID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  EmployeePendingLeaveSummaryById(postData) {
    let empUrl = this.clientService.EmployeePendingLeaveSummaryById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetColumnChanges(postData) {
    let empUrl = this.clientService.GetColumnChanges();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


}
