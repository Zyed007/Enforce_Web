import { Injectable } from "@angular/core";
import { ClientService } from "./clientUtilService";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { retry, catchError, tap, map } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { PlatformDetectionService } from "../platform-detection.service";
import { getDeviceId } from "../shared/services";

let orgId = {
  id: localStorage.getItem("org_id"),
};
let user_info: object;
if (localStorage.getItem("user_info")) {
  user_info = JSON.parse(localStorage.getItem("user_info"));
}

@Injectable({ providedIn: "root" })
export class TimeSheetService {
  constructor(
    private http: HttpClient,
    private clientService: ClientService,
    private platformDetectionService: PlatformDetectionService
  ) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
    }),
  };

  getAllTask() {
    let empUrl = this.clientService.getAllTask();

    // return this.http.post(empUrl,orgId,this.httpOptions)
    // .pipe(
    //   retry(1),

    //   catchError(this.handleError)
    // )
    return this.http.get(empUrl, this.httpOptions).pipe(
      retry(1),

      catchError(this.handleError)
    );
  }

  AddTimeLog(postData) {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    let empUrl = this.clientService.AddTimeLog();
    //  postData['createdby']=user_info['full_name'];
    //  postData['id']=localStorage.getItem('org_id');
    //  postData['empid']=user_info['id'];
    postData["checkin_platform"] = this.platformDetectionService.toString();
    postData["checkin_user_empid"] = user_info["id"];
    postData["checkin_tag_id"] = getDeviceId();
    console.log(postData);
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAddressFromMapBox(latitude, longitude) {
    console.log(latitude, longitude);
    let types = "poi";
    let accessToken =
      "pk.eyJ1IjoiYXNob2tuIiwiYSI6ImNrdXhxN2h5ejRoNGcyd282cHg1YzZlMGIifQ.P_YVBRx5LjnyNkYbDcP_7g";
    let mapBoxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${latitude},${longitude}.json?types=${types}&access_token=${accessToken}`;
    return this.http
      .get(mapBoxUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddTimesheetBreak(postData) {
    let empUrl = this.clientService.AddTimesheetBreak();
    //  postData['createdby']=user_info['full_name'];
    postData["orgid"] = localStorage.getItem("org_id");
    //  postData['empid']=user_info['id'];

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  BreakOutByEmpID(postData) {
    let empUrl = this.clientService.BreakOutByEmpID();
    //  postData['createdby']=user_info['full_name'];
    postData["orgid"] = localStorage.getItem("org_id");
    //  postData['empid']=user_info['id'];

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  FindLastTimeSheetBreakByEmpIDAndGrpID(postData) {
    let empUrl = this.clientService.FindLastTimeSheetBreakByEmpIDAndGrpID();
    //  postData['createdby']=user_info['full_name'];
    //  postData['empid']=user_info['id'];

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  getByCheckOutID(postData) {
    let empUrl = this.clientService.getByCheckOutID();
    postData["checkout_platform"] = this.platformDetectionService.toString();
    postData["checkout_tag_id"] = getDeviceId();
      return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetTravelClaimLocationById(postData) {
    let empUrl = this.clientService.GetTravelClaimLocationById();
      return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  ApproveTimesheet(postData) {
    let empUrl = this.clientService.ApproveTimesheet();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  FindLocationByEntityID(postData) {
    let empUrl = this.clientService.FindLocationByEntityID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateTimeLog(postData) {
    let user = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }

    postData["modifiedby"] = user["full_name"];

    let empUrl = this.clientService.updateTimeLog();

    return this.http
      .put(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  delTask(postData) {
    let user = {};
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    postData["modifiedby"] = user["full_name"];
    let empUrl = this.clientService.delTask();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  //old function
  LastAddedTimesheetActivityByEmpID(postData) {
    let empUrl = this.clientService.LastAddedTimesheetActivityByEmpID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  //new function
  LastAddedTimesheetActivityLogByEmpID(postData) {
    let empUrl = this.clientService.LastAddedTimesheetActivityLogByEmpID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetTaskHistoryByTskId(postData) {
    let empUrl = this.clientService.GetTaskHistoryByTskId();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  ValidateProjectTask(postData) {
    let empUrl = this.clientService.ValidateProjectTask();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddPriority(postData) {
    let empUrl = this.clientService.AddPriority();
    postData["createdby"] = user_info["full_name"];
    postData["org_id"] = localStorage.getItem("org_id");

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  getAllPriority() {
    let empUrl = this.clientService.getAllPriority();

    // return this.http.post(empUrl,orgId,this.httpOptions)
    // .pipe(
    //   retry(1),

    //   catchError(this.handleError)
    // )
    return this.http.get(empUrl, this.httpOptions).pipe(
      retry(1),

      catchError(this.handleError)
    );
  }

  GetTimesheetActivityByEmpIDAndDate(postData) {
    let empUrl = this.clientService.GetTimesheetActivityByEmpIDAndDate();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetTimesheetDashboardDataByOrgID(postData) {
    let empUrl = this.clientService.GetTimesheetDashboardDataByOrgID();

    postData["OrgID"] = localStorage.getItem("org_id");
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetAllTimesheets() {
    let empUrl = this.clientService.GetAllTimesheets();

    return this.http.get(empUrl).pipe(retry(1), catchError(this.handleError));
  }
  GetTimesheetDashboardGridDataByOrgIDAndDate(postData) {
    let empUrl =
      this.clientService.GetTimesheetDashboardGridDataByOrgIDAndDate();

    postData["OrgID"] = localStorage.getItem("org_id");
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetAttendaceDataByEmpIDAndDate(postData) {
    let empUrl = this.clientService.GetAttendaceDataByEmpIDAndDate();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    postData["empID"] = user_info["id"];
    console.log(postData);
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddTimesheetOverrideByTimesheetID(postData) {
    let empUrl = this.clientService.AddTimesheetOverrideByTimesheetID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddTimesheetOverrideByTimesheetIDNew(postData) {
    let empUrl = this.clientService.AddTimesheetOverrideByTimesheetIDNew();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetAbsentDataByEmpIDAndDate(postData) {
    let empUrl = this.clientService.GetAbsentDataByEmpIDAndDate();
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    postData["empID"] = user_info["id"];
    postData["orgID"] =
      user_info.org_id !== null
        ? user_info.org_id
        : localStorage.getItem("org_id");
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetAttendanceReportOrgIDAndDate(postData) {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let empUrl = this.clientService.GetAttendanceReportOrgIDAndDate();
    postData["orgID"] =
      user_info.org_id !== null
        ? user_info.org_id
        : localStorage.getItem("org_id");
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetAllTimesheetBreaksbyOrgIdandDate(postData) {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let empUrl = this.clientService.GetAllTimesheetBreaksbyOrgIdandDate();
    postData["orgID"] =
      user_info.org_id !== null
        ? user_info.org_id
        : localStorage.getItem("org_id");
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetTimesheetDashboardGridOnLeaveDataByOrgIDAndDate(postData) {
    let empUrl =
      this.clientService.GetTimesheetDashboardGridOnLeaveDataByOrgIDAndDate();

    postData["orgID"] = localStorage.getItem("org_id");
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetApproveTimesheetByID(postData) {
    let empUrl = this.clientService.GetApproveTimesheetByID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetTimesheetOverrideDetailsByTimesheetID(postData) {
    let empUrl = this.clientService.GetTimesheetOverrideDetailsByTimesheetID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetTimesheetByGroupID(postData) {
    let empUrl = this.clientService.GetTimesheetByGroupID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetAllTimesheetByOrgID(postData) {
    let empUrl = this.clientService.GetAllTimesheetByOrgID();

    postData["OrgID"] = localStorage.getItem("org_id");
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  //old function
  RemoveTimesheetActivity(postData) {
    let empUrl = this.clientService.RemoveTimesheetActivity();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  //new function
  RemoveEmployeeTimesheetActivity(postData) {
    let empUrl = this.clientService.RemoveEmployeeTimesheetActivity();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetTimesheetDashboardGridAbsentDataByOrgIDAndDate(postData) {
    let empUrl =
      this.clientService.GetTimesheetDashboardGridAbsentDataByOrgIDAndDate();

    postData["OrgID"] = localStorage.getItem("org_id");
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  TotalEmployeeDashboardDataByOrgID(postData) {
    let empUrl = this.clientService.TotalEmployeeDashboardDataByOrgID();
    postData["OrgID"] = localStorage.getItem("org_id");

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetCheckOutLocationByGroupID(postData) {
    let empUrl = this.clientService.GetCheckOutLocationByGroupID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  TotalEmployeeAbsentDashboardDataByOrgID(postData) {
    let empUrl = this.clientService.TotalEmployeeAbsentDashboardDataByOrgID();

    postData["OrgID"] = localStorage.getItem("org_id");
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  getByPriorityID(postData) {
    let empUrl = this.clientService.getByPriorityID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  updatePriority(postData) {
    let empUrl = this.clientService.updatePriority();

    return this.http
      .put(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  delPriority(postData) {
    postData["createdby"] = "Hifza K";
    postData["modifiedby"] = "Hifza K";
    let empUrl = this.clientService.delPriority();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddStatus(postData) {
    postData["createdby"] = "Hifza K";
    postData["modifiedby"] = "Hifza K";
    let empUrl = this.clientService.AddStatus();

    return this.http
      .post(empUrl, postData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  getAllTimeLog() {
    let empUrl = this.clientService.getAllTimeLog();

    // return this.http.post(empUrl,orgId,this.httpOptions)
    // .pipe(
    //   retry(1),

    //   catchError(this.handleError)
    // )
    return this.http.get(empUrl, this.httpOptions).pipe(
      retry(1),

      catchError(this.handleError)
    );
  }
  getByStatusID(postData) {
    let empUrl = this.clientService.getByStatusID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateStatus(postData) {
    let empUrl = this.clientService.updateStatus();

    return this.http
      .put(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  RemoveTimesheet(postData) {
    let empUrl = this.clientService.RemoveTimesheet();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetTimesheetActivityByGroupAndProjectID(postData) {
    let empUrl = this.clientService.GetTimesheetActivityByGroupAndProjectID();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetTimesheetActivityByGroupAndDate(postData) {
    let empUrl = this.clientService.GetTimesheetActivityByGroupAndDate();

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  TotalEmpOverTimeCountByOrgIDAndDate(postData) {
    let empUrl = this.clientService.TotalEmpOverTimeCountByOrgIDAndDate();
    postData["OrgID"] = localStorage.getItem("org_id");

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  TotalEmpLessHoursByOrgIDAndDate(postData) {
    let empUrl = this.clientService.TotalEmpLessHoursByOrgIDAndDate();
    postData["OrgID"] = localStorage.getItem("org_id");

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  TotalLocationCheckInExceptionByOrgIDAndDate(postData) {
    let empUrl =
      this.clientService.TotalLocationCheckInExceptionByOrgIDAndDate();
    postData["OrgID"] = localStorage.getItem("org_id");

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  TotalLocationCheckOutExceptionByOrgIDAndDate(postData) {
    let empUrl =
      this.clientService.TotalLocationCheckOutExceptionByOrgIDAndDate();
    postData["OrgID"] = localStorage.getItem("org_id");

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate(postData) {
    let empUrl =
      this.clientService.GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate();
    postData["OrgID"] = localStorage.getItem("org_id");

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate(postData) {
    let empUrl =
      this.clientService.GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate();
    postData["OrgID"] = localStorage.getItem("org_id");

    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetLatLongDataByEmpIDAndDate(postData) {
    let empUrl = this.clientService.GetLatLongDataByEmpIDAndDate();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetCarryfrwdRqstById(postData) {
    let empUrl = this.clientService.GetCarryfrwdRqstById();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetPublicHolidaysById(postData) {
    let empUrl = this.clientService.GetPublicHolidaysById();
    return this.http
      .patch(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AdminReopenTasks(postData) {
    let empUrl = this.clientService.AdminReopenTasks();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetForceCheckinRequestById(postData) {
    let empUrl = this.clientService.GetForceCheckinRequestById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetForceCheckinRequestByOrgId(postData) {
    let empUrl = this.clientService.GetForceCheckinRequestByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetCheckinDetailsbyId(postData) {
    let empUrl = this.clientService.GetCheckinDetailsbyId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetFaceRecDetailsById(postData) {
    let empUrl = this.clientService.GetFaceRecDetailsById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  CheckAttendenceExpInRangebyOrgId(postData) {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let empUrl = this.clientService.CheckAttendenceExpInRangebyOrgId();
    postData["orgID"] =
      user_info.org_id !== null
        ? user_info.org_id
        : localStorage.getItem("org_id");
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  CheckAttendenceExpInRangebyEmpId(postData) {
    let empUrl = this.clientService.CheckAttendenceExpInRangebyEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  PresentDayDetails(postData) {
    let empUrl = this.clientService.PresentDayDetails();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddForceCheckInRequest(postData) {
    let empUrl = this.clientService.AddForceCheckInRequest();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddAttendenceExp(postData) {
    let empUrl = this.clientService.AddAttendenceExp();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateAttendenceExp(postData) {
    let empUrl = this.clientService.UpdateAttendenceExp();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetAttExceptionOrgId(postData) {
    let empUrl = this.clientService.GetAttExceptionOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  ListExtraWorkDays(postData){
    let empUrl = this.clientService.ListExtraWorkDays();
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
