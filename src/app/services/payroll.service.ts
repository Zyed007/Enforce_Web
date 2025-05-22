import { Injectable } from "@angular/core";
import { ClientService } from "./clientUtilService";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { retry, catchError, tap, map } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

let orgId = {
  id: localStorage.getItem("org_id"),
};
let user_info: object;
if (localStorage.getItem("user_info")) {
  user_info = JSON.parse(localStorage.getItem("user_info"));
}

@Injectable({ providedIn: "root" })
export class PayrollService {
  constructor(private http: HttpClient, private clientService: ClientService) {}

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
    }),
  };

  handleError(error) {
    let errorMessage = "";
    if (error.status === 0) {
      errorMessage = "Internal Server Error";
    } else {
      errorMessage = "Something went wrong. please try again";
    }
    return throwError(errorMessage);
  }

  AddPayrollSetting(postData) {
    let empUrl = this.clientService.AddPayrollSetting();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddPayrollAdjustments(postData) {
    let empUrl = this.clientService.AddPayrollAdjustments();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddPayrollVariablePay(postData) {
    let empUrl = this.clientService.AddPayrollVariablePay();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddFinalSettlement(postData) {
    let empUrl = this.clientService.AddFinalSettlement();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddPayrollWorkExpenses(postData) {
    let empUrl = this.clientService.AddPayrollWorkExpenses();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  AddPayrollLoanPayments(postData) {
    let empUrl = this.clientService.AddPayrollLoanPayments();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetPayrollAdjustmentByOrgId(postData) {
    let empUrl = this.clientService.GetPayrollAdjustmentByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetPayrollVariablePayByOrgId(postData) {
    let empUrl = this.clientService.GetPayrollVariablePayByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  GetPayrollWaiveoffByEmpId(postData) {
    let empUrl = this.clientService.GetPayrollWaiveoffByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetPayrollWorkExpensesByOrgId(postData) {
    let empUrl = this.clientService.GetPayrollWorkExpensesByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetPayrollAdjustmentByEmpId(postData) {
    let empUrl = this.clientService.GetPayrollAdjustmentByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetPayrollVariablePayByEmpId(postData) {
    let empUrl = this.clientService.GetPayrollVariablePayByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetPayrollWorkExpensesyByEmpId(postData) {
    let empUrl = this.clientService.GetPayrollWorkExpensesyByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetPayrollLoanPaymentsByEmpId(postData) {
    let empUrl = this.clientService.GetPayrollLoanPaymentsByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetPayrollLoanPaymentsByOrgId(postData) {
    let empUrl = this.clientService.GetPayrollLoanPaymentsByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdatePayrollAdjustmentByItemID(postData) {
    let empUrl = this.clientService.UpdatePayrollAdjustmentByItemID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdatePayrollVariablePayByItemID(postData) {
    let empUrl = this.clientService.UpdatePayrollVariablePayByItemID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdatePayrollWorkExpensesByItemID(postData) {
    let empUrl = this.clientService.UpdatePayrollWorkExpensesByItemID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdatePayrollLoanPaymentsByItemID(postData) {
    let empUrl = this.clientService.UpdatePayrollLoanPaymentsByItemID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  getActiveEmployeeListByOrgID(postData) {
    let empUrl = this.clientService.getActiveEmployeeListByOrgID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  generatePayTableByOrgID(postData) {
    let empUrl = this.clientService.generatePayTableByOrgID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  getActivePayrollMonthDetailsByOrgId(postData) {
    let empUrl = this.clientService.getActivePayrollMonthDetailsByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  getLastUnpaidPayrollMonthDetailsByOrgId(postData) {
    let empUrl = this.clientService.getLastUnpaidPayrollMonthDetailsByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetPayrollSettingByOrgId(postData) {
    let empUrl = this.clientService.GetPayrollSettingByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdatePayrollSetting(postData) {
    let empUrl = this.clientService.UpdatePayrollSetting();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  runPayrollAutodeduction(postData) {
    let empUrl = this.clientService.runPayrollAutodeduction();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  getSalaryHistoryByEmpId(postData) {
    let empUrl = this.clientService.getSalaryHistoryByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdatePayrollDetailsHoldById(postData) {
    let empUrl = this.clientService.UpdatePayrollDetailsHoldById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdatePayrollDetailsPaymentVoucherById(postData) {
    let empUrl = this.clientService.UpdatePayrollDetailsPaymentVoucherById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  SubmitPayrollById(postData) {
    let empUrl = this.clientService.SubmitPayrollById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  getPayrollDetailsByPayrollId(postData) {
    let empUrl = this.clientService.getPayrollDetailsByPayrollId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  GetholdPayrollDetailsByEmpId(postData) {
    let empUrl = this.clientService.GetholdPayrollDetailsByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetPayrollByOrgId(postData) {
    let empUrl = this.clientService.GetPayrollByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetPayrollTimelineById(postData) {
    let empUrl = this.clientService.GetPayrollTimelineById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetPayrollWaiveoffByPayrollId(postData) {
    let empUrl = this.clientService.GetPayrollWaiveoffByPayrollId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddPayrollWaiveoff(postData) {
    let empUrl = this.clientService.AddPayrollWaiveoff();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdatePayrollWaiveoffById(postData) {
    let empUrl = this.clientService.UpdatePayrollWaiveoffById();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetAutoDeductionbyEmpIdDate(postData) {
    let empUrl = this.clientService.GetAutoDeductionbyEmpIdDate();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  CalculateFinalSettlement(postData) {
    let empUrl = this.clientService.CalculateFinalSettlement();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GenerateTravelClaim(postData) {
    let empUrl = this.clientService.generateTravelClaim();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetTravelDisputeByEmpId(postData) {
    let empUrl = this.clientService.GetTravelDisputeByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetTravelDisputeByOrgId(postData) {
    let empUrl = this.clientService.GetTravelDisputeByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetTravelClaimByClaimId(postData) {
    let empUrl = this.clientService.GetTravelClaimByClaimId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetTravelClaimByOrgId(postData) {
    let empUrl = this.clientService.GetTravelClaimByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }


  GetReimbData(postData) {
    let empUrl = this.clientService.GetReimbData();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError))
  }

  GetRepairData(postData)  {
    let empUrl = this.clientService.GetRepairData();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError))
  }

  generateMaintenanceReimb(postData) {
    let empUrl = this.clientService.generateMaintenanceReimb();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  generateRepairReimb(postData) {
    let empUrl = this.clientService.generateRepairReimb();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetLastAddedTravelClaimByVehicleNumber(postData) {
    let empUrl = this.clientService.GetLastAddedTravelClaimByVehicleNumber();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetLastAddedWorkExpensesPrefixByOrgID(postData) {
    let empUrl = this.clientService.GetLastAddedWorkExpensesPrefixByOrgID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetLastAddedAdjustmentPrefixByOrgID(postData) {
    let empUrl = this.clientService.GetLastAddedAdjustmentPrefixByOrgID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  UpdateTravelDisputeData(postData) {
    let empUrl = this.clientService.UpdateTravelDisputeData();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetTravelClaimByEmpId(postData) {
    let empUrl = this.clientService.GetTravelClaimByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddTravelDisputeData(postData) {
    let empUrl = this.clientService.AddTravelDisputeData();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdateTravelSettings(postData) {
    let empUrl = this.clientService.UpdateTravelSettings();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetTravelSettingByOrgId(postData) {
    let empUrl = this.clientService.GetTravelSettingByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetFinalSettlementByEmpId(postData) {
    let empUrl = this.clientService.GetFinalSettlementByEmpId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetTravelSettingHistoryByTypeandOrgId(postData) {
    let empUrl = this.clientService.GetTravelSettingHistoryByTypeandOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  deleteTravelSettings(postData) {
    let empUrl = this.clientService.deleteTravelSettings();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddTravelSettings(postData) {
    let empUrl = this.clientService.AddTravelSettings();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetLastAddedTravelClaimPrefixByOrgID(postData) {
    let empUrl = this.clientService.GetLastAddedTravelClaimPrefixByOrgID();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddFuelStationBrand(postData) {
    let empUrl = this.clientService.AddFuelStationBrand();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdateFuelStationBrand(postData) {
    let empUrl = this.clientService.UpdateFuelStationBrand();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  GetFuelStationBrandsByOrgId(postData) {
    let empUrl = this.clientService.GetFuelStationBrandsByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  DeleteFuelStationBrand(postData) {
    let empUrl = this.clientService.DeleteFuelStationBrand();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }

  GetTravelVehicleConfigByOrgId(postData) {
    let empUrl = this.clientService.GetTravelVehicleConfigByOrgId();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  UpdateTravelVehicleConfig(postData) {
    let empUrl = this.clientService.UpdateTravelVehicleConfig();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
  AddTravelVehicleConfig(postData) {
    let empUrl = this.clientService.AddTravelVehicleConfig();
    return this.http
      .post(empUrl, postData)
      .pipe(retry(1), catchError(this.handleError));
  }
}
