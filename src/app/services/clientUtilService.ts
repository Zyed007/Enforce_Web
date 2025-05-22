// import {environment} from '../../environments/environment.dev';
import { Injectable } from "@angular/core";
@Injectable()
export class ClientService {
  constructor() { }

  // getHostURL(): string {
  //     return 'https://timeapi.azurewebsites.net/';
  //   }

  getHostURL(): string {
   return "https://timeapi.enforcesolutions.com/";
   }
  //   getHostURL(): string {
  //    return 'https://localhost:44391/';
  //  }
  // getHostURL(): string {
  //   return 'http://localhost:5000/';
  // }

  getApiKey(): string {
    return "AIzaSyDWYgdR81ZtTH4YBoAKDjbHRcKQJh2usCM";
  }
  onRegister() {
    return this.getHostURL() + "Account/SignUp";
  }
  onLogin() {
    return this.getHostURL() + "Account/Login";
  }
  onForgetPassword() {
    return this.getHostURL() + "Account/ForgotPassword";
  }
  GetColumnChanges() {
    return this.getHostURL() + "Employee/GetColumnChanges";
  }

  getEmpLeavePendingByOrgId() {
    return this.getHostURL() + "Employee/GetLeavePendingbyOrgIdEmpId";
  }

  RemoveHolidayByID() {
    return this.getHostURL() + "Employee/RemoveHolidayByID";
  }

  onResetPassword() {
    return this.getHostURL() + "Account/ResetPassword";
  }
  addOrgProfile() {
    return this.getHostURL() + "Organization/AddOrganization";
  }
  FindAutoCostProjectPrefixByOrgID() {
    return this.getHostURL() + "Project/FindAutoCostProjectPrefixByOrgID";
  }
  getAllOrg() {
    return this.getHostURL() + "Organization/GetAllOrg";
  }
  getOrgById() {
    return this.getHostURL() + "Organization/FindByOrgId";
  }
  FindCurrencyByOrgId() {
    return this.getHostURL() + "Organization/FindCurrencyByOrgId";
  }
  getAllEmployee() {
    return this.getHostURL() + "Employee/GetAllEmployees";
  }
  getEmployeeByOrgId() {
    return this.getHostURL() + "Employee/FindByOrgID";
  }
  addEmployee() {
    return this.getHostURL() + "Employee/AddEmployee";
  }

  AddLabourEmployee() {
    return this.getHostURL() + "Employee/AddLabourEmployee";
  }

  AddEmployeeDetailsOverride() {
    return this.getHostURL() + "Employee/AddEmployeeDetailsOverride";
  }
  getByEmployeeID() {
    return this.getHostURL() + "Employee/FindByEmpIDNew";
  }
  FetchEmployeeLeaveCalcEmpID() {
    return this.getHostURL() + "Employee/FetchEmployeeLeaveCalcEmpID";
  }
  updateEmp() {
    return this.getHostURL() + "Employee/UpdateEmployee";
  }
  delIndType() {
    return this.getHostURL() + "Setup/RemoveIndustryType";
  }
  getEmpByDesgnID() {
    return this.getHostURL() + "Employee/FindEmployeeListByDesignationID";
  }
  getEmpByDeptID() {
    return this.getHostURL() + "Employee/FindEmployeeListByDepartmentID";
  }
  addDept() {
    return this.getHostURL() + "Department/AddDepartment";
  }
  getCountryList() {
    return this.getHostURL() + "Setup/GetAllCountries";
  }
  getTZList() {
    return this.getHostURL() + "Setup/GetAllTimeZones";
  }
  getAllDept() {
    return this.getHostURL() + "Department/FindDepartmentByOrgID";
    // return this.getHostURL()+'Department/GetAllDepartments';
  }
  getByDeptID() {
    return this.getHostURL() + "Department/FindByDepartmentID";
  }
  updateDept() {
    return this.getHostURL() + "Department/UpdateDepartment";
  }
  delDept() {
    return this.getHostURL() + "Department/RemoveDepartment";
  }
  addDesgn() {
    return this.getHostURL() + "Designation/AddDesignation";
  }
  AddEmployeeDocument() {
    return this.getHostURL() + "Document/AddEmployeeDocument";
  }
  GetDocumentsByempId() {
    return this.getHostURL() + "Document/GetDocumentsByempId";
  }
  GetDocumentsByempIdwithDelete() {
    return this.getHostURL() + "Document/GetDocumentsByempIdwithDelete";
  }
  DeleteDocumentByEmpIDName() {
    return this.getHostURL() + "Document/DeleteDocumentByEmpIDName";
  }

  DeleteDocumentByEmpId() {
    return this.getHostURL() + "Document/DeleteDocumentByEmpId";
  }

  GroupedTimeSheetBreakByEmpIdAndDate() {
    return (
      this.getHostURL() + "AdminDashboard/GroupedTimeSheetBreakByEmpIdAndDate"
    );
  }
  //want to change
  GetOverTimeWrkbyEmpID() {
    return this.getHostURL() + "Timesheet/GetOverTimeWrkbyEmpID";
  }

  GetOverTimeWrkbyHlfEmpID() {
    return this.getHostURL() + "Timesheet/GetOverTimeWrkbyHlfEmpID";
  }

  getAllDesgn() {
    return this.getHostURL() + "Designation/GetAllDesignation";
  }
  getByDesgnID() {
    return this.getHostURL() + "Designation/FindByDesignationID";
  }
  updateDesgn() {
    return this.getHostURL() + "Designation/UpdateDesignation";
  }
  delDesgn() {
    return this.getHostURL() + "Designation/RemoveDesignation";
  }
  delEmp() {
    return this.getHostURL() + "Employee/RemoveEmployee";
  }
  RemoveEmployeePermanent() {
    return this.getHostURL() + "Employee/RemoveEmployeePermanent";
  }
  getByUserID() {
    return this.getHostURL() + "User/GetUserDataGroupByUserID";
  }
  //old function
  GetAllTimesheetByEmpID() {
    return this.getHostURL() + "User/GetAllTimesheetByEmpID";
  }
  //new function
  GetAllTimesheetListByEmployeeID() {
    return this.getHostURL() + "User/GetAllTimesheetListByEmployeeID";
  }

  LastCheckinByEmpID() {
    return this.getHostURL() + "User/LastCheckinByEmpID";
  }
  updateOrg() {
    return this.getHostURL() + "Organization/UpdateOrganization";
  }
  FindAllOrgByHeadOrgID() {
    return this.getHostURL() + "Organization/FindAllOrgByHeadOrgID";
  }
  FindLocationByEntityID() {
    return this.getHostURL() + "Timesheet/FindLocationByEntityID";
  }
  GetTravelClaimLocationById() {
    return this.getHostURL() + "Timesheet/GetTravelClaimLocationById";
  }
  AddTask() {
    return this.getHostURL() + "EmployeeTasks/AddTask";
  }
  getAllTask() {
    return this.getHostURL() + "EmployeeTasks/GetAllTasks";
  }
  getByTaskID() {
    return this.getHostURL() + "EmployeeTasks/FindByTasksId";
  }
  delTask() {
    return this.getHostURL() + "EmployeeTasks/RemoveTask";
  }
  teamDelete() {
    return this.getHostURL() + "Team/RemoveTeamByID";
  }
  AddPriority() {
    return this.getHostURL() + "Setup/AddPriority";
  }
  getAllPriority() {
    return this.getHostURL() + "Setup/GetAllPriority";
  }
  getByPriorityID() {
    return this.getHostURL() + "Setup/FindByPriorityID";
  }
  updatePriority() {
    return this.getHostURL() + "Setup/UpdatePriority";
  }
  delPriority() {
    return this.getHostURL() + "Setup/RemovePriority";
  }
  delTaskStatus() {
    return this.getHostURL() + "Setup/RemoveTaskStatus";
  }
  AddStatus() {
    return this.getHostURL() + "Setup/AddTaskStatus";
  }
  getAllTaskStatus() {
    return this.getHostURL() + "Setup/GetAllTaskStatus";
  }
  getByStatusID() {
    return this.getHostURL() + "Setup/FindByTaskStatusID";
  }
  updateStatus() {
    return this.getHostURL() + "Setup/UpdateTaskStatus";
  }
  addEmployeeStatus() {
    return this.getHostURL() + "Setup/AddEmployeeStatus";
  }
  getAllEmpStatus() {
    return this.getHostURL() + "Setup/GetAllEmployeeStatus";
  }
  getByEmpStatusID() {
    return this.getHostURL() + "Setup/FindByEmployeeStatusID";
  }
  updateEmpStatus() {
    return this.getHostURL() + "Setup/UpdateEmployeeStatus";
  }
  delEmpStatus() {
    return this.getHostURL() + "Setup/RemoveEmployeeStatus";
  }
  delEmpType() {
    return this.getHostURL() + "Setup/RemoveEmployeeType";
  }
  onVerifyEmail() {
    return this.getHostURL() + "Account/ConfirmEmail";
  }
  addEmployeeType() {
    return this.getHostURL() + "Setup/AddEmployeeType";
  }
  getAllEmpType() {
    return this.getHostURL() + "Setup/GetAllEmployeeType";
  }
  getByEmpTypeID() {
    return this.getHostURL() + "Setup/FindByEmployeeTypeID";
  }
  updateEmpType() {
    return this.getHostURL() + "Setup/UpdateEmployeeType";
  }
  addIndustryType() {
    return this.getHostURL() + "Setup/AddIndustryType";
  }
  getAllIndustryType() {
    return this.getHostURL() + "Setup/GetAllIndustryType";
  }
  getByIndustryTypeID() {
    return this.getHostURL() + "Setup/FindByIndustryTypeID";
  }
  updateIndustryType() {
    return this.getHostURL() + "Setup/UpdateIndustryType";
  }
  AddTimeLog() {
    return this.getHostURL() + "Timesheet/AddTimesheet";
  }
  getAllTimeLog() {
    return this.getHostURL() + "Timesheet/GetAllTimesheets";
  }
  AddTimesheetBreak() {
    return this.getHostURL() + "Timesheet/AddTimesheetBreak";
  }
  BreakOutByEmpID() {
    return this.getHostURL() + "Timesheet/BreakOutByEmpIDAndGrpID";
  }
  FindLastTimeSheetBreakByEmpIDAndGrpID() {
    return (
      this.getHostURL() + "Timesheet/FindLastTimeSheetBreakByEmpIDAndGrpID"
    );
  }
  TotalEmpOverTimeCountByOrgIDAndDate() {
    return (
      this.getHostURL() + "AdminDashboard/TotalEmpOverTimeCountByOrgIDAndDate"
    );
  }
  TotalEmpLessHoursByOrgIDAndDate() {
    return this.getHostURL() + "AdminDashboard/TotalEmpLessHoursByOrgIDAndDate";
  }

  TotalLocationCheckInExceptionByOrgIDAndDate() {
    return (
      this.getHostURL() +
      "AdminDashboard/TotalLocationCheckInExceptionByOrgIDAndDate"
    );
  }
  TotalLocationCheckOutExceptionByOrgIDAndDate() {
    return (
      this.getHostURL() +
      "AdminDashboard/TotalLocationCheckOutExceptionByOrgIDAndDate"
    );
  }

  LocationExceptionByEmpIdAndDate() {
    return this.getHostURL() + "AdminDashboard/LocationExceptionByEmpIdAndDate";
  }

  TimeSheetBreakByEmpIdAndDate() {
    return this.getHostURL() + "AdminDashboard/TimeSheetBreakByEmpIdAndDate";
  }

  GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate() {
    return (
      this.getHostURL() +
      "AdminDashboard/GetTimesheetDashboardFirstCheckInGridDataByOrgIDAndDate"
    );
  }
  GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate() {
    return (
      this.getHostURL() +
      "AdminDashboard/GetTimesheetDashboardLastCheckoutGridDataByOrgIDAndDate"
    );
  }
  GetTimesheetDashboardGridOnLeaveDataByOrgIDAndDate() {
    return (
      this.getHostURL() +
      "AdminDashboard/GetTimesheetDashboardGridOnLeaveDataByOrgIDAndDate"
    );
  }
  GetApproveTimesheetByID() {
    return this.getHostURL() + "Timesheet/GetApproveTimesheetByID";
  }
  getByCheckOutID() {
    return this.getHostURL() + "Timesheet/CheckOutByEmpID";
  }
  updateTimeLog() {
    return this.getHostURL() + "Timesheet/UpdateTimesheet";
  }
  fetchGridDataByTaskEmpID() {
    return this.getHostURL() + "EmployeeTasks/FetchGridDataByTaskEmpID";
  }
  updateEmpTaskStatus() {
    return this.getHostURL() + "EmployeeTasks/UpdateTask";
  }
  fetchGridDataByDepartmentOrgID() {
    return this.getHostURL() + "Department/FetchGridDataByDepartmentOrgID";
  }
  fetchGridDataByDesignationDeptOrgID() {
    return (
      this.getHostURL() + "Designation/FetchGridDataByDesignationDeptOrgID"
    );
  }

  GetEmployeeRoles() {
    return this.getHostURL() + "Setup/GetEmployeeRoles";
  }
  getDesgnByDeptId() {
    return this.getHostURL() + "Designation/FindDesignationByDeptID";
  }
  fetchGridDataEmployeeByOrgID() {
    return this.getHostURL() + "Employee/FetchGridDataEmployeeByOrgID";
  }
  GetAllTaskForAssignByProjectID() {
    return this.getHostURL() + "Project/GetAllTaskForAssignByProjectID";
  }
  AssignEmpployeeToTask() {
    return this.getHostURL() + "Project/AssignEmpployeeToTask";
  }
  AssignEmployeeToTaskSubTask() {
    return this.getHostURL() + "Project/AssignEmployeeToTaskSubTask";
  }

  addTeam() {
    return this.getHostURL() + "Team/AddTeam";
  }

  addAccessRightsforAdmin() {
    return this.getHostURL() + "Employee/AddLeaveAccessByAdmins";
  }

  fetchByAllTeamMembersTeamID() {
    return this.getHostURL() + "Team/FetchByAllTeamMembersTeamID";
  }
  FetchAllTeamMembersByTeamID() {
    return this.getHostURL() + "Team/FetchAllTeamMembersByTeamID";
  }
  getAllTeam() {
    return this.getHostURL() + "Team/GetAllTeam";
  }
  getOrgByUserId() {
    return this.getHostURL() + "Organization/FindByUsersId";
  }
  FindTeamsByOrgID() {
    return this.getHostURL() + "Team/FindTeamsByOrgID";
  }
  FindByOrgId() {
    return this.getHostURL() + "Organization/FindByOrgId";
  }
  getByTeamID() {
    return this.getHostURL() + "Team/FindByTeamID";
  }
  updateTeam() {
    return this.getHostURL() + "Team/UpdateTeam";
  }
  empDepartDesignByEmpID() {
    return this.getHostURL() + "Employee/FindEmpDepartDesignByEmpID";
  }
  getAllOutsourcedEmpByOrgID() {
    return this.getHostURL() + "Employee/GetAllOutsourcedEmpByOrgID";
  }
  getAllFreelancerEmpByOrgID() {
    return this.getHostURL() + "Employee/GetAllFreelancerEmpByOrgID";
  }
  getAllDesignationByOrgID() {
    return this.getHostURL() + "Designation/GetAllDesignationByOrgID";
  }
  getAllPhoneCode() {
    return this.getHostURL() + "Setup/GetAllPhoneCode";
  }
  AddAdministrative() {
    return this.getHostURL() + "Setup/AddAdministrative";
  }
  UpdateAdministrative() {
    return this.getHostURL() + "Setup/UpdateAdministrative";
  }
  RemoveAdministrative() {
    return this.getHostURL() + "Setup/RemoveAdministrative";
  }
  GetAllAdministrative() {
    return this.getHostURL() + "Setup/GetAllAdministrative";
  }
  FindByAdministrativeID() {
    return this.getHostURL() + "Setup/FindByAdministrativeID";
  }
  FindEmpDepartDesignByTeamID() {
    return this.getHostURL() + "Employee/FindEmpDepartDesignByTeamID";
  }
  //old function
  AddTimesheetActivity() {
    return this.getHostURL() + "Timesheet/AddTimesheetActivity";
  }
  //new function
  AddTimesheetActivityLog() {
    return this.getHostURL() + "Timesheet/AddTimesheetActivityLog";
  }

  UpdateAdvancetoRevenue() {
    return this.getHostURL() + "Timesheet/UpdateAdvancetoRevenue";
  }

  UpdateTimesheetActivity() {
    return this.getHostURL() + "Timesheet/UpdateTimesheetActivity";
  }
  //old function
  RemoveTimesheetActivity() {
    return this.getHostURL() + "Timesheet/RemoveTimesheetActivity";
  }
  //new function
  RemoveEmployeeTimesheetActivity() {
    return this.getHostURL() + "Timesheet/RemoveEmployeeTimesheetActivity";
  }
  RemoveTimesheet() {
    return this.getHostURL() + "Timesheet/RemoveTimesheet";
  }
  GetTimesheetActivityByGroupAndProjectID() {
    return (
      this.getHostURL() + "Timesheet/GetTimesheetActivityByGroupAndProjectID"
    );
  }
  GetTimesheetActivityByGroupAndDate() {
    return (
      this.getHostURL() + "AdminDashboard/GetTimesheetActivityByGroupAndDate"
    );
  }
  AllProjectRatioByOrgID() {
    return this.getHostURL() + "AdminDashboard/AllProjectRatioByOrgID";
  }
  AddTimesheetAdministrativeActivity() {
    return this.getHostURL() + "Timesheet/AddTimesheetAdministrativeActivity";
  }
  GetAllTimesheetActivitys() {
    return this.getHostURL() + "Timesheet/GetAllTimesheetActivitys";
  }
  GetTop10TimesheetActivityOnTaskID() {
    return this.getHostURL() + "Timesheet/GetTop10TimesheetActivityOnTaskID";
  }

  AddTimesheetActivityComment() {
    return this.getHostURL() + "Timesheet/AddTimesheetActivityComment";
  }
  UpdateTimesheetActivityComment() {
    return this.getHostURL() + "Timesheet/UpdateTimesheetActivityComment";
  }
  RemoveTimesheetActivityComment() {
    return this.getHostURL() + "Timesheet/RemoveTimesheetActivityComment";
  }
  AddTimesheetActivityFile() {
    return this.getHostURL() + "Timesheet/AddTimesheetActivityFile";
  }
  UpdateTimesheetActivityFile() {
    return this.getHostURL() + "Timesheet/UpdateTimesheetActivityComment";
  }
  RemoveTimesheetActivityFile() {
    return this.getHostURL() + "Timesheet/RemoveTimesheetActivityFile";
  }

  GetAdministrativeTaskByOrgID() {
    return this.getHostURL() + "Setup/GetAdministrativeTaskByOrgID";
  }
  GetPriorityByOrgID() {
    return this.getHostURL() + "Setup/GetPriorityByOrgID";
  }
  GetStatusByOrgID() {
    return this.getHostURL() + "Setup/GetStatusByOrgID";
  }
  GetEmployeeTypeByOrgID() {
    return this.getHostURL() + "Setup/GetEmployeeTypeByOrgID";
  }
  GetWorkLocationByOrgId(){
    return this.getHostURL() + "Setup/GetWorkLocationByOrgId"
  }
  AddWorkLocation() {
    return this.getHostURL() + "Setup/AddWorkLocation"
  }
  UpdateWorkLocationByID() {
    return this.getHostURL() + "Setup/UpdateWorkLocationByID"
  }
  GetEmployeeStatusByOrgID() {
    return this.getHostURL() + "Setup/GetEmployeeStatusByOrgID";
  }
  GetAdministrativeByOrgID() {
    return this.getHostURL() + "Setup/GetAdministrativeByOrgID";
  }
  GetTop10TimesheetAdminActivityOnGroupIDAndAdminID() {
    return (
      this.getHostURL() +
      "Timesheet/GetTop10TimesheetAdminActivityOnGroupIDAndAdminID"
    );
  }
  UpdateTaskStatus() {
    return this.getHostURL() + "EmployeeTasks/UpdateTaskStatus";
  }
  IsPhoneValid() {
    return this.getHostURL() + "Setup/IsPhoneValid";
  }
  GetAllTaskByEmpID() {
    return this.getHostURL() + "EmployeeTasks/GetAllTaskByEmpID";
  }
  GetAllTaskByOrgAndEmpID() {
    return this.getHostURL() + "AdminDashboard/GetAllTaskByOrgAndEmpID";
  }
  AddPlanFeature() {
    return this.getHostURL() + "Admin/AddPlanFeature";
  }
  UpdatePlanFeature() {
    return this.getHostURL() + "Admin/UpdatePlanFeature";
  }
  RemovePlanFeature() {
    return this.getHostURL() + "Admin/RemovePlanFeature";
  }
  FindByPlanFeatureID() {
    return this.getHostURL() + "Admin/FindByPlanFeatureID";
  }
  GetAllPlanFeature() {
    return this.getHostURL() + "Admin/GetAllPlanFeature";
  }

  AddPlanPrice() {
    return this.getHostURL() + "Admin/AddPlanPrice";
  }
  UpdatePlanPrice() {
    return this.getHostURL() + "Admin/UpdatePlanPrice";
  }
  RemovePlanPrice() {
    return this.getHostURL() + "Admin/RemovePlanPrice";
  }
  FindByPlanPriceID() {
    return this.getHostURL() + "Admin/FindByPlanPriceID";
  }
  GetAllPlanPrice() {
    return this.getHostURL() + "Admin/GetAllPlanPrice";
  }
  AddPlan() {
    return this.getHostURL() + "Admin/AddPlan";
  }
  UpdatePlan() {
    return this.getHostURL() + "Admin/UpdatePlan";
  }
  RemovePlan() {
    return this.getHostURL() + "Admin/RemovePlan";
  }
  FindByPlanID() {
    return this.getHostURL() + "Admin/FindByPlanID";
  }
  GetAllPlan() {
    return this.getHostURL() + "Admin/GetAllPlan";
  }
  AddProject() {
    return this.getHostURL() + "Project/AddProject";
  }
  GetAllProject() {
    return this.getHostURL() + "Project/GetAllProject";
  }
  FindByProjectID() {
    return this.getHostURL() + "Project/FindByProjectID";
  }

  GetExtensionsByProjectId() {
    return this.getHostURL() + "Project/GetExtensionsByProjectId";
  }

  RemoveProjectByID() {
    return this.getHostURL() + "Project/RemoveProjectByID";
  }
  UpdateProject() {
    return this.getHostURL() + "Project/UpdateProject";
  }
  AddProjectType() {
    return this.getHostURL() + "Project/AddProjectType ";
  }
  GetProjectTypeByOrgID() {
    return this.getHostURL() + "Project/GetProjectTypeByOrgID";
  }
  FindByProjectTypeID() {
    return this.getHostURL() + "Project/FindByProjectTypeID";
  }
  RemoveProjectType() {
    return this.getHostURL() + "Project/RemoveProjectType";
  }
  UpdateProjectType() {
    return this.getHostURL() + "Project/UpdateProjectType";
  }
  AddProjectStatus() {
    return this.getHostURL() + "Project/AddProjectStatus";
  }

  GetAllProjectStatus() {
    return this.getHostURL() + "Project/GetAllProjectStatus";
  }

  GetInvoicesByProjectID() {
    return this.getHostURL() + "Project/GetInvoicesByProjectID";
  }

  FindByProjectStatusID() {
    return this.getHostURL() + "Project/FindByProjectStatusID";
  }
  RemoveProjectStatus() {
    return this.getHostURL() + "Project/RemoveProjectStatus";
  }
  UpdateProjectStatus() {
    return this.getHostURL() + "Project/UpdateProjectStatus";
  }
  FetchAllProjectByOrgID() {
    return this.getHostURL() + "Project/FetchAllProjectByOrgID";
  }
  FetchProjectsWithLocationVerification() {
    return this.getHostURL() + "Project/FetchProjectsWithLocationVerification";
  }
  FetchRecentProjectsByorgId() {
    return this.getHostURL() + "Project/FetchRecentProjectsByorgId";
  }
  AddProjectActivity() {
    return this.getHostURL() + "Project/AddProjectActivity";
  }
  AddMilestoneTemplate() {
    return this.getHostURL() + "Template/AddMilestoneTemplate";
  }
  GetProjectActivityByProjectID() {
    return this.getHostURL() + "Project/GetProjectActivityByProjectID";
  }
  FindAllProjectActivityByProjectID() {
    return this.getHostURL() + "Project/FindAllProjectActivityByProjectID";
  }
  FindByProjectTasksId() {
    return this.getHostURL() + "Project/FindByTasksId";
  }
  UpdateTask() {
    return this.getHostURL() + "Project/UpdateTask";
  }
  UpdateProjectActivity() {
    return this.getHostURL() + "Project/UpdateProjectActivity";
  }
  GetProjectActivityTaskRatioByProjectID() {
    return this.getHostURL() + "Project/GetProjectActivityTaskRatioByProjectID";
  }
  GetProjectActivityRatioByProjectID() {
    return this.getHostURL() + "Project/GetProjectActivityRatioByProjectID";
  }
  GetAllTaskByProjectID() {
    return this.getHostURL() + "Project/GetAllTaskByProjectID";
  }
  AddProjTask() {
    return this.getHostURL() + "Project/AddTask";
  }
  GetAllTaskByActivityID() {
    return this.getHostURL() + "Project/GetAllTaskByActivityID";
  }
  SetupPreDefinedDepartment() {
    return this.getHostURL() + "Department/SetupPreDefinedDepartment";
  }
  GetTimesheetActivityByEmpIDAndDate() {
    return this.getHostURL() + "Timesheet/GetTimesheetActivityByEmpIDAndDate";
  }
  GetEmployeeTasksTimesheetByEmpID() {
    return (
      this.getHostURL() +
      "ProductivityDashboard/GetEmployeeTasksTimesheetByEmpID"
    );
  }
  GetAllTimesheets() {
    return this.getHostURL() + "Timesheet/GetAllTimesheets";
  }
  AddEntityLocation() {
    return this.getHostURL() + "Project/AddEntityLocation";
  }
  UpdateEntityLocation() {
    return this.getHostURL() + "Project/UpdateEntityLocation";
  }
  AddCustomer() {
    return this.getHostURL() + "Customer/AddCustomer";
  }
  GetAllCustomer() {
    return this.getHostURL() + "Customer/GetAllCustomer";
  }
  FindAutoProjectPrefixByOrgID() {
    return this.getHostURL() + "Project/FindAutoProjectPrefixByOrgID";
  }
  RemoveProjectActivity() {
    return this.getHostURL() + "Project/RemoveProjectActivity";
  }
  RemoveTask() {
    return this.getHostURL() + "Project/RemoveTask";
  }
  FindByCustomerId() {
    return this.getHostURL() + "Customer/FindByCustomerId";
  }
  RemoveCustomer() {
    return this.getHostURL() + "Customer/RemoveCustomer";
  }
  UpdateCustomer() {
    return this.getHostURL() + "Customer/UpdateCustomer";
  }
  GetAllCustomerByOrgID() {
    return this.getHostURL() + "Customer/GetAllCustomerByOrgID";
  }
  FindCustomProjectPrefixByOrgIDAndPrefix() {
    return (
      this.getHostURL() + "Project/FindCustomProjectPrefixByOrgIDAndPrefix"
    );
  }
  GetTimesheetDashboardGridDataByOrgIDAndDate() {
    return (
      this.getHostURL() +
      "AdminDashboard/GetTimesheetDashboardGridDataByOrgIDAndDate"
    );
  }
  GetAllTimesheetByOrgID() {
    return this.getHostURL() + "AdminDashboard/GetAllTimesheetByOrgID";
  }
  GetTimesheetDashboardGridAbsentDataByOrgIDAndDate() {
    return (
      this.getHostURL() +
      "AdminDashboard/GetTimesheetDashboardGridAbsentDataByOrgIDAndDate"
    );
  }
  GetCheckOutLocationByGroupID() {
    return this.getHostURL() + "AdminDashboard/GetCheckOutLocationByGroupID";
  }
  TotalEmployeeAbsentDashboardDataByOrgID() {
    return (
      this.getHostURL() +
      "AdminDashboard/TotalEmployeeAbsentDashboardDataByOrgID"
    );
  }
  RemoveOrganization() {
    return this.getHostURL() + "Organization/RemoveOrganization";
  }
  AddProjectCustomer() {
    return this.getHostURL() + "Project/AddProjectCustomer";
  }
  UpdateCostProjectBudgetedHoursTaskID() {
    return this.getHostURL() + "Cost/UpdateCostProjectBudgetedHoursTaskID";
  }
  ProjectTaskCountByProjectID() {
    return this.getHostURL() + "Project/ProjectTaskCountByProjectID";
  }
  UpdateLeadStatusByLeadID() {
    return this.getHostURL() + "Lead/UpdateLeadStatusByLeadID";
  }
  UpdateEstDealValueByLeadID() {
    return this.getHostURL() + "Lead/UpdateEstDealValueByLeadID";
  }
  FindPlanPriceByPlanID() {
    return this.getHostURL() + "Admin/FindPlanPriceByPlanID";
  }
  GetTimesheetDashboardDataByOrgID() {
    return (
      this.getHostURL() +
      "AdminDashboard/GetTimesheetDashboardDataByOrgIDAndDate"
    );
  }
  TotalEmployeeDashboardDataByOrgID() {
    return (
      this.getHostURL() + "AdminDashboard/TotalEmployeeDashboardDataByOrgID"
    );
  }
  AddDelegations() {
    return this.getHostURL() + "Delegation/AddDelegations";
  }
  UpdateDelegations() {
    return this.getHostURL() + "Delegation/UpdateDelegations";
  }
  FindByProjectActivityID() {
    return this.getHostURL() + "Project/FindByProjectActivityID";
  }
  RemoveDelegations() {
    return this.getHostURL() + "Delegation/RemoveDelegations";
  }
  FindByDelegationsID() {
    return this.getHostURL() + "Delegation/FindByDelegationsID";
  }
  GetAllDelegateeByOrgIDAndEmpID() {
    return this.getHostURL() + "Delegation/GetAllDelegateeByOrgIDAndEmpID";
  }
  RemoveAdminRightByEmpID() {
    return this.getHostURL() + "Delegation/RemoveAdminRightByEmpID";
  }
  FindByDelegateesID() {
    return this.getHostURL() + "Delegation/FindByDelegateesID";
  }
  RemoveByDelegateeID() {
    return this.getHostURL() + "Delegation/RemoveByDelegateeID";
  }
  FindMilestoneTemplatesByOrgID() {
    return this.getHostURL() + "Template/FindMilestoneTemplatesByOrgID";
  }
  FindMilestoneTemplatesByTemplateID() {
    return this.getHostURL() + "Template/FindMilestoneTemplatesByTemplateID";
  }
  AddTaskTemplate() {
    return this.getHostURL() + "Template/AddTaskTemplate";
  }
  FindTaskTemplatesByOrgID() {
    return this.getHostURL() + "Template/FindTaskTemplatesByOrgID";
  }
  FindTaskTemplatesByTemplateID() {
    return this.getHostURL() + "Template/FindTaskTemplatesByTemplateID";
  }
  RemoveMilestoneTemplateByID() {
    return this.getHostURL() + "Template/RemoveMilestoneTemplateByID";
  }
  RemoveTaskTemplateByID() {
    return this.getHostURL() + "Template/RemoveTaskTemplateByID";
  }
  AddMultipleTask() {
    return this.getHostURL() + "Project/AddMultipleTask";
  }
  UpdateProjectStatusByID() {
    return this.getHostURL() + "EmployeeTasks/UpdateTaskStatus";
  }
  AddCostProject() {
    return this.getHostURL() + "Cost/AddCostProject";
  }
  GetPlanDetail() {
    return this.getHostURL() + "Admin/GetPlanDetail";
  }
  AddTypeOfDesign() {
    return this.getHostURL() + "Cost/AddTypeOfDesign";
  }
  FetchAllTypeOfDesignByOrgID() {
    return this.getHostURL() + "Cost/FetchAllTypeOfDesignByOrgID";
  }
  FindByTypeOfDesignID() {
    return this.getHostURL() + "Cost/FindByTypeOfDesignID";
  }
  RemoveTypeOfDesignByID() {
    return this.getHostURL() + "Cost/RemoveTypeOfDesignByID";
  }
  UpdateTypeOfDesign() {
    return this.getHostURL() + "Cost/UpdateTypeOfDesign";
  }
  AddSpecifiation() {
    return this.getHostURL() + "Cost/AddSpecifiation";
  }
  FetchAllSpecifiationByOrgID() {
    return this.getHostURL() + "Cost/FetchAllSpecifiationByOrgID";
  }
  FindBySpecifiationID() {
    return this.getHostURL() + "Cost/FindBySpecifiationID";
  }
  RemoveSpecifiationByID() {
    return this.getHostURL() + "Cost/RemoveSpecifiationByID";
  }
  UpdateSpecifiation() {
    return this.getHostURL() + "Cost/UpdateSpecifiation";
  }
  AddBilling() {
    return this.getHostURL() + "Admin/AddBilling";
  }
  UpdateSubscription() {
    return this.getHostURL() + "Admin/UpdateSubscription";
  }
  AddUnitDescription() {
    return this.getHostURL() + "Cost/AddUnitDescription";
  }
  FetchAllUnitDescriptionByOrgID() {
    return this.getHostURL() + "Cost/FetchAllUnitDescriptionByOrgID";
  }
  FindByUnitDescriptionID() {
    return this.getHostURL() + "Cost/FindByUnitDescriptionID";
  }
  UpdateUnitDescription() {
    return this.getHostURL() + "Cost/UpdateUnitDescription";
  }
  RemoveUnitDescriptionByID() {
    return this.getHostURL() + "Cost/RemoveUnitDescriptionByID";
  }
  FetchAllCostProjectByOrgID() {
    return this.getHostURL() + "Cost/FetchAllCostProjectByOrgID";
  }
  FindByCostProjectID() {
    return this.getHostURL() + "Cost/FindByCostProjectID";
  }
  CalculateCostProject() {
    return this.getHostURL() + "Cost/CalculateCostProject";
  }
  RemoveCostProjectByID() {
    return this.getHostURL() + "Cost/RemoveCostProjectByID";
  }
  UpdateCostProject() {
    return this.getHostURL() + "Cost/UpdateCostProject";
  }
  UpdateCostProjectStatusByID() {
    return this.getHostURL() + "Cost/UpdateCostProjectStatusByID";
  }
  GetAllStaticMilestoneByOrgID() {
    return this.getHostURL() + "Cost/GetAllStaticMilestoneByOrgID";
  }

  GetVendorCategoryTypesByOrgId() {
    return this.getHostURL() + "Project/GetVendorCategoryTypesByOrgId";
  }

  GetVendorDocumentUploadTypeByOrgId() {
    return this.getHostURL() + "Project/GetVendorDocumentUploadTypeByOrgId";
  }

  GetVendorStatusByOrgId() {
    return this.getHostURL() + "Project/GetVendorStatusByOrgId";
  }

  AddVendorCategoryTypes() {
    return this.getHostURL() + "Project/AddVendorCategoryTypes";
  }

  AddVendorStatus() {
    return this.getHostURL() + "Project/AddVendorStatus";
  }

  GetAllStaticMilestoneTasksByMilestoneID() {
    return this.getHostURL() + "Cost/GetAllStaticMilestoneTasksByMilestoneID";
  }
  UpdateStaticCostTask() {
    return this.getHostURL() + "Cost/UpdateStaticCostTask";
  }
  UpdateIsSelectedByTaskID() {
    return this.getHostURL() + "Cost/UpdateIsSelectedByTaskID";
  }
  UpdateCostProjectTaskQtyTaskID() {
    return this.getHostURL() + "Cost/UpdateCostProjectTaskQtyTaskID";
  }
  FetchAllUnitDescriptionExtraByOrgID() {
    return this.getHostURL() + "Cost/FetchAllUnitDescriptionExtraByOrgID";
  }
  AddPackages() {
    return this.getHostURL() + "Cost/AddPackages";
  }
  FetchAllPackagesByOrgID() {
    return this.getHostURL() + "Cost/FetchAllPackagesByOrgID";
  }
  FindByPackagesID() {
    return this.getHostURL() + "Cost/FindByPackagesID";
  }
  RemovePackagesByID() {
    return this.getHostURL() + "Cost/RemovePackagesByID";
  }
  UpdatePackages() {
    return this.getHostURL() + "Cost/UpdatePackages";
  }
  UpdateCostProjectNotesQtyTaskID() {
    return this.getHostURL() + "Cost/UpdateCostProjectNotesQtyTaskID";
  }
  AddCostPerHour() {
    return this.getHostURL() + "Cost/AddCostPerHour";
  }
  FetchCostPerHourOrgID() {
    return this.getHostURL() + "Cost/FetchCostPerHourOrgID";
  }

  FindByCostPerHourID() {
    return this.getHostURL() + "Cost/FindByCostPerHourID";
  }
  RemoveCostPerHourByID() {
    return this.getHostURL() + "Cost/RemoveCostPerHourByID";
  }
  UpdateCostPerHour() {
    return this.getHostURL() + "Cost/UpdateCostPerHour";
  }
  AddProfitMargin() {
    return this.getHostURL() + "Cost/AddProfitMargin";
  }
  FetchProfitMarginOrgID() {
    return this.getHostURL() + "Cost/FetchProfitMarginOrgID";
  }
  FindByProfitMarginID() {
    return this.getHostURL() + "Cost/FindByProfitMarginID";
  }
  RemoveProfitMarginByID() {
    return this.getHostURL() + "Cost/RemoveProfitMarginByID";
  }
  UpdateProfitMargin() {
    return this.getHostURL() + "Cost/UpdateProfitMargin";
  }
  UpdateCostProjectDiscountAndTotalCostTaskID() {
    return (
      this.getHostURL() + "Cost/UpdateCostProjectDiscountAndTotalCostTaskID"
    );
  }
  UpdateCostProjectDiscountAndProfitMarginByProjectID() {
    return (
      this.getHostURL() +
      "Cost/UpdateCostProjectDiscountAndProfitMarginByProjectID"
    );
  }
  GetMilestoneAndTasksByProjectID() {
    return this.getHostURL() + "Cost/GetMilestoneAndTasksByProjectID";
  }
  AddLeaveSetup() {
    return this.getHostURL() + "Leave/AddLeaveSetup";
  }
  UpdateLeaveSetup() {
    return this.getHostURL() + "Leave/UpdateLeaveSetup";
  }
  RemoveLeaveSetup() {
    return this.getHostURL() + "Leave/RemoveLeaveSetup";
  }
  FindByLeaveSetupID() {
    return this.getHostURL() + "Leave/FindByLeaveSetupID";
  }
  FetchLeaveSetupOrgID() {
    return this.getHostURL() + "Leave/FetchLeaveSetupOrgID";
  }
  AddLeaveType() {
    return this.getHostURL() + "Leave/AddLeaveType";
  }
  UpdateLeaveType() {
    return this.getHostURL() + "Leave/UpdateLeaveType";
  }
  RemoveLeaveType() {
    return this.getHostURL() + "Leave/RemoveLeaveType";
  }
  FindByLeaveTypeID() {
    return this.getHostURL() + "Leave/FindByLeaveTypeID";
  }
  FetchLeaveTypeOrgID() {
    return this.getHostURL() + "Leave/FetchLeaveTypeOrgID";
  }

  AddTimeOffSetup() {
    return this.getHostURL() + "Leave/AddTimeOffSetup";
  }
  UpdateTimeOffSetup() {
    return this.getHostURL() + "Leave/UpdateTimeOffSetup";
  }
  RemoveTimeOffSetup() {
    return this.getHostURL() + "Leave/RemoveTimeOffSetup";
  }
  FindByTimeOffSetupID() {
    return this.getHostURL() + "Leave/FindByTimeOffSetupID";
  }
  FetchTimeOffSetupOrgID() {
    return this.getHostURL() + "Leave/FetchTimeOffSetupOrgID";
  }
  AddEmployeeLeaveSetup() {
    return this.getHostURL() + "Leave/AddEmployeeLeaveSetup";
  }
  UpdateEmployeeLeaveSetup() {
    return this.getHostURL() + "Leave/UpdateEmployeeLeaveSetup";
  }
  RemoveEmployeeLeaveSetup() {
    return this.getHostURL() + "Leave/RemoveEmployeeLeaveSetup";
  }
  FindByEmployeeLeaveSetupID() {
    return this.getHostURL() + "Leave/FindByEmployeeLeaveSetupID";
  }
  FetchEmployeeLeaveSetupOrgID() {
    return this.getHostURL() + "Leave/FetchEmployeeLeaveSetupOrgID";
  }
  AddEmployeeLeave() {
    return this.getHostURL() + "Employee/AddEmployeeLeave";
  }
  UpdateEmployeeLeave() {
    return this.getHostURL() + "Employee/UpdateEmployeeLeave";
  }
  RemoveEmployeeLeave() {
    return this.getHostURL() + "Employee/RemoveEmployeeLeave";
  }
  FetchEmployeeLeaveHistoryEmpID() {
    return this.getHostURL() + "Employee/FetchEmployeeLeaveHistoryEmpID";
  }
  FetchEmployeeLeaveHistoryOrgID() {
    return this.getHostURL() + "Employee/FetchEmployeeLeaveHistoryOrgID";
  }
  FetchEmployeeLeaveLogEmpID() {
    return this.getHostURL() + "Employee/FetchEmployeeLeaveLogEmpID";
  }
  FindEmployeeLeaveByID() {
    return this.getHostURL() + "Employee/FindEmployeeLeaveByID";
  }
  FetchEmployeeLeaveOrgID() {
    return this.getHostURL() + "Employee/FetchEmployeeLeaveOrgID";
  }
  FetchEmployeeLeaveEmpID() {
    return this.getHostURL() + "Employee/FetchEmployeeLeaveEmpID";
  }
  UpdateApprovedByID() {
    return this.getHostURL() + "Employee/ApprovalByLeaveIDAndApproverID";
  }
  // UpdateApprovedByID(){
  //   return this.getHostURL()+'Employee/ApprovalByLeaveIDAndApproverID';
  // }
  AddLeaveStatus() {
    return this.getHostURL() + "Leave/AddLeaveStatus";
  }
  UpdateLeaveStatus() {
    return this.getHostURL() + "Leave/UpdateLeaveStatus";
  }
  RemoveLeaveStatus() {
    return this.getHostURL() + "Leave/RemoveLeaveStatus";
  }
  FindByLeaveStatusID() {
    return this.getHostURL() + "Leave/FindByLeaveStatusID";
  }
  FetchLeaveStatusOrgID() {
    return this.getHostURL() + "Leave/GetLeaveStatusByOrgID";
  }
  AddLeadCompany() {
    return this.getHostURL() + "Lead/AddLeadCompany";
  }
  GetAllLeadCompanyByOrgID() {
    return this.getHostURL() + "Lead/GetAllLeadCompanyByOrgID";
  }
  RemoveLeadCompany() {
    return this.getHostURL() + "Lead/RemoveLeadCompany";
  }
  UpdateLeadCompany() {
    return this.getHostURL() + "Lead/UpdateLeadCompany";
  }
  FindByLeadCompanyByID() {
    return this.getHostURL() + "Lead/FindByLeadCompanyByID";
  }
  AddLeadSource() {
    return this.getHostURL() + "Lead/AddLeadSource";
  }
  GetAllLeadSourceByOrgID() {
    return this.getHostURL() + "Lead/GetAllLeadSourceByOrgID";
  }
  RemoveLeadSource() {
    return this.getHostURL() + "Lead/RemoveLeadSource";
  }
  UpdateLeadSource() {
    return this.getHostURL() + "Lead/UpdateLeadSource";
  }
  FindByLeadSourceByID() {
    return this.getHostURL() + "Lead/FindByLeadSourceByID";
  }
  AddLeadStatus() {
    return this.getHostURL() + "Lead/AddLeadStatus";
  }
  GetAllLeadStatusByOrgID() {
    return this.getHostURL() + "Lead/GetAllLeadStatusByOrgID";
  }
  RemoveLeadStatus() {
    return this.getHostURL() + "Lead/RemoveLeadStatus";
  }
  UpdateLeadStatus() {
    return this.getHostURL() + "Lead/UpdateLeadStatus";
  }
  FindByLeadStatusByID() {
    return this.getHostURL() + "Lead/FindByLeadStatusByID";
  }
  AddLeadRating() {
    return this.getHostURL() + "Lead/AddLeadRating";
  }
  GetAllLeadRatingByOrgID() {
    return this.getHostURL() + "Lead/GetAllLeadRatingByOrgID";
  }
  RemoveLeadRating() {
    return this.getHostURL() + "Lead/RemoveLeadRating";
  }
  UpdateLeadRating() {
    return this.getHostURL() + "Lead/UpdateLeadRating";
  }
  FindByLeadRatingByID() {
    return this.getHostURL() + "Lead/FindByLeadRatingByID";
  }
  AddLead() {
    return this.getHostURL() + "Lead/AddLead";
  }
  UpdateLead() {
    return this.getHostURL() + "Lead/UpdateLead";
  }
  RemoveLead() {
    return this.getHostURL() + "Lead/RemoveLead";
  }

  AddExtensionsLead() {
    return this.getHostURL() + "Project/AddExtensionsLead";
  }

  GetExtensionsLeadId() {
    return this.getHostURL() + "Project/GetExtensionsLeadId";
  }

  UpdateProjectByleadId() {
    return this.getHostURL() + "Project/UpdateProjectByleadId";
  }

  UpdateCstProjectIdByLeadId() {
    return this.getHostURL() + "Project/UpdateCstProjectIdByLeadId";
  }

  FindByLeadId() {
    return this.getHostURL() + "Lead/FindByLeadId";
  }
  GetAllLeadByOrgID() {
    return this.getHostURL() + "Lead/GetAllLeadByOrgID";
  }
  FetchEmployeeLeaveHistoryApproverID() {
    return this.getHostURL() + "Employee/FetchEmployeeLeaveHistoryApproverID";
  }
  EmpProductivityDashboard() {
    return (
      this.getHostURL() +
      "ProductivityDashboard/EmployeeProductivityPerDateByEmpIDAndDate"
    );
  }
  DesktopEmpProductivity() {
    return (
      this.getHostURL() +
      "ProductivityDashboard/DesktopEmployeeProductivityPerDateByEmpIDAndDate"
    );
  }
  EmployeeAppTrackedByEmpIDAndDate() {
    return (
      this.getHostURL() +
      "ProductivityDashboard/EmployeeAppTrackedByEmpIDAndDate"
    );
  }
  EmployeeProductivityTimeFrequencyByEmpIDAndDate() {
    return (
      this.getHostURL() +
      "ProductivityDashboard/EmployeeProductivityTimeFrequencyByEmpIDAndDate"
    );
  }
  AdminProductivityTimeFrequencyByEmpIDAndDate() {
    return (
      this.getHostURL() +
      "AdminProductivityDashboard/EmployeeProductivityTimeFrequencyByOrgIDAndDate"
    );
  }
  AddLeadDealType() {
    return this.getHostURL() + "Lead/AddLeadDealType";
  }
  UpdateLeadDealType() {
    return this.getHostURL() + "Lead/UpdateLeadDealType";
  }
  RemoveLeadDealType() {
    return this.getHostURL() + "Lead/RemoveLeadDealType";
  }

  FindByLeadDealTypeId() {
    return this.getHostURL() + "Lead/FindByLeadDealTypeByID";
  }
  GetAllLeadDealTypeByOrgID() {
    return this.getHostURL() + "Lead/GetAllLeadDealTypeByOrgID";
  }
  AddLeadContractRole() {
    return this.getHostURL() + "Lead/AddLeadContractRole";
  }
  UpdateLeadContractRole() {
    return this.getHostURL() + "Lead/UpdateLeadContractRole";
  }
  RemoveLeadContractRole() {
    return this.getHostURL() + "Lead/RemoveLeadContractRole";
  }

  FindByLeadContractRoleId() {
    return this.getHostURL() + "Lead/FindByLeadContractRoleByID";
  }
  GetAllLeadContractRoleByOrgID() {
    return this.getHostURL() + "Lead/GetAllLeadContractRoleByOrgID";
  }
  AddLeadStage() {
    return this.getHostURL() + "Quotation/AddStage";
  }
  UpdateLeadStage() {
    return this.getHostURL() + "Quotation/UpdateStage";
  }
  RemoveLeadStage() {
    return this.getHostURL() + "Quotation/RemoveStage";
  }

  FindByLeadStageId() {
    return this.getHostURL() + "Quotation/FindByStageByID";
  }
  GetAllLeadStageByOrgID() {
    return this.getHostURL() + "Quotation/GetAllStageByOrgID";
  }
  EmployeeProductivityPerDateByOrgIDAndDate() {
    return (
      this.getHostURL() +
      "AdminProductivityDashboard/EmployeeProductivityPerDateByOrgIDAndDate"
    );
  }
  EmployeeScreenshotsPerDateByOrgIDAndDate() {
    return (
      this.getHostURL() +
      "AdminProductivityDashboard/EmployeeScreenshotsPerDateByOrgIDAndDate"
    );
  }
  FindByCustomerByNameAndEmail() {
    return this.getHostURL() + "Customer/FindByCustomerByNameAndEmail";
  }
  GetEmployeeTasksTimesheetByOrgID() {
    return (
      this.getHostURL() +
      "AdminProductivityDashboard/GetEmployeeTasksTimesheetByOrgID"
    );
  }
  AddQuotation() {
    return this.getHostURL() + "Quotation/AddQuotation";
  }
  UpdateQuotation() {
    return this.getHostURL() + "Quotation/UpdateQuotation";
  }
  RemoveQuotation() {
    return this.getHostURL() + "Quotation/RemoveQuotation";
  }
  UpdateIsQuotationByCostProjectID() {
    return this.getHostURL() + "Cost/UpdateIsQuotationByCostProjectID";
  }

  GetExtensionsLead() {
    return this.getHostURL() + "Project/GetExtensionsLead";
  }

  GetProjectByPrefixandCstId() {
    return this.getHostURL() + "Project/GetProjectByPrefixandCstId";
  }

  FindByQuotationId() {
    return this.getHostURL() + "Quotation/FindByQuotationID";
  }
  GetAllQuotationByOrgID() {
    return this.getHostURL() + "Quotation/GetAllQuotationByOrgID";
  }
  RevisedQuotation() {
    return this.getHostURL() + "Cost/RevisedQuotation";
  }

  AddPrefix() {
    return this.getHostURL() + "Prefix/AddPrefix";
  }

  GetProjectPrefixActivitiesByOrgId() {
    return this.getHostURL() + "Project/GetProjectPrefixActivitiesByOrgId";
  }

  AddProjectPrefixActivities() {
    return this.getHostURL() + "Project/AddProjectPrefixActivities";
  }

  UpdateProjectPrefixActivitiesById() {
    return this.getHostURL() + "Project/UpdateProjectPrefixActivitiesById";
  }

  UpdatePrefix() {
    return this.getHostURL() + "Prefix/UpdatePrefix";
  }
  RemovePrefix() {
    return this.getHostURL() + "Prefix/RemovePrefix";
  }

  FindByPrefixId() {
    return this.getHostURL() + "Prefix/FindByPrefixID";
  }
  GetAllPrefixByOrgID() {
    return this.getHostURL() + "Prefix/GetAllPrefixByOrgID";
  }
  UpdateCostProjectFinalValueByCostProjectID() {
    return (
      this.getHostURL() + "Cost/UpdateCostProjectFinalValueByCostProjectID"
    );
  }
  GetLastAddedLeadPrefixByOrgID() {
    return this.getHostURL() + "Lead/GetLastAddedLeadPrefixByOrgID";
  }
  UpdateQuotationStageByQuotationID() {
    return this.getHostURL() + "Quotation/UpdateQuotationStageByQuotationID";
  }
  GetLastAddedCostPrefixByOrgID() {
    return this.getHostURL() + "Cost/GetLastAddedCostPrefixByOrgID";
  }
  GetLastAddedProjectPrefixByOrgID() {
    return this.getHostURL() + "Project/GetLastAddedProjectPrefixByOrgID";
  }

  GelstPrjtPrfxNoExt() {
    return this.getHostURL() + "Project/GelstPrjtPrfxNoExt";
  }

  GetLastAddedQuotationPrefixByOrgID() {
    return this.getHostURL() + "Quotation/GetLastAddedQuotationPrefixByOrgID";
  }
  AddEntityMeeting() {
    return this.getHostURL() + "Entity/AddEntityMeeting";
  }
  UpdateEntityMeeting() {
    return this.getHostURL() + "Entity/UpdateEntityMeeting";
  }
  RemoveEntityMeeting() {
    return this.getHostURL() + "Entity/RemoveEntityMeeting";
  }
  FindByEntityMeetingID() {
    return this.getHostURL() + "Entity/FindByEntityMeetingID";
  }
  FetchEntityMeetingOrgID() {
    return this.getHostURL() + "Entity/FetchEntityMeetingOrgID";
  }
  FetchEntityMeetingEntityID() {
    return this.getHostURL() + "Entity/FetchEntityMeetingEntityID";
  }
  AddEntityNotes() {
    return this.getHostURL() + "Entity/AddEntityNotes";
  }
  UpdateEntityNotes() {
    return this.getHostURL() + "Entity/UpdateEntityNotes";
  }
  RemoveEntityNotes() {
    return this.getHostURL() + "Entity/RemoveEntityNotes";
  }
  FindByEntityNotesID() {
    return this.getHostURL() + "Entity/FindByEntityNotesID";
  }
  FetchEntityNotesOrgID() {
    return this.getHostURL() + "Entity/FetchEntityNotesOrgID";
  }
  FetchEntityNotesEntityID() {
    return this.getHostURL() + "Entity/FetchEntityNotesEntityID";
  }
  AddEntityCall() {
    return this.getHostURL() + "Entity/AddEntityCall";
  }
  UpdateEntityCall() {
    return this.getHostURL() + "Entity/UpdateEntityCall";
  }
  RemoveEntityCall() {
    return this.getHostURL() + "Entity/RemoveEntityCall";
  }
  FindByEntityCallID() {
    return this.getHostURL() + "Entity/FindByEntityCallID";
  }
  FetchEntityCallOrgID() {
    return this.getHostURL() + "Entity/FetchEntityCallOrgID";
  }
  FetchEntityCallEntityID() {
    return this.getHostURL() + "Entity/FetchEntityCallEntityID";
  }
  AddLocalActivity() {
    return this.getHostURL() + "Setup/AddLocalActivity";
  }
  UpdateLocalActivity() {
    return this.getHostURL() + "Setup/UpdateLocalActivity";
  }
  RemoveLocalActivity() {
    return this.getHostURL() + "Setup/RemoveLocalActivity";
  }

  FindByLocalActivityID() {
    return this.getHostURL() + "Setup/FindByLocalActivityID";
  }
  GetAllLocalActivityByOrgID() {
    return this.getHostURL() + "Setup/FetchLocalActivityOrgID";
  }
  FindByEntityContactOrgID() {
    return this.getHostURL() + "Project/FindByEntityContactOrgID";
  }
  GetAllSubTaskByTaskID() {
    return this.getHostURL() + "Project/GetAllSubTaskByTaskID";
  }
  GetAllOpenActivitiesEntityID() {
    return this.getHostURL() + "Entity/GetAllOpenActivitiesEntityID";
  }
  GetAllCloseActivitiesEntityID() {
    return this.getHostURL() + "Entity/GetAllCloseActivitiesEntityID";
  }
  GetLocalActivitieEntityID() {
    return this.getHostURL() + "Entity/GetLocalActivitieEntityID";
  }
  AddEntityHistoryLog() {
    return this.getHostURL() + "Entity/AddEntityHistoryLog";
  }
  UpdateEntityHistoryLog() {
    return this.getHostURL() + "Entity/UpdateEntityHistoryLog";
  }
  RemoveEntityHistoryLog() {
    return this.getHostURL() + "Entity/RemoveEntityHistoryLog";
  }
  FindByEntityHistoryLogID() {
    return this.getHostURL() + "Entity/FindByEntityHistoryLogID";
  }
  FetchEntityHistoryLogEntityID() {
    return this.getHostURL() + "Entity/FetchEntityHistoryLogEntityID";
  }

  FindEntityContactByEntityID() {
    return this.getHostURL() + "Project/FindEntityContactByEntityID";
  }
  AddEntityContact() {
    return this.getHostURL() + "Project/AddEntityContact";
  }
  GetAllEntityContactByEntityIDAndCstID() {
    return this.getHostURL() + "Project/GetAllEntityContactByEntityIDAndCstID";
  }
  WorkforceProductiveByOrgIDAndDate() {
    return this.getHostURL() + "Workforce/WorkforceProductiveByOrgIDAndDate";
  }
  WorkforceProductiveByTeamIDAndDate() {
    return this.getHostURL() + "Workforce/WorkforceProductiveByTeamIDAndDate";
  }
  WorkforceProductiveByDeptIDAndDate() {
    return this.getHostURL() + "Workforce/WorkforceProductiveByDeptIDAndDate";
  }

  ProductiveByDeptIDAndDate() {
    return (
      this.getHostURL() + "AdminProductivityDashboard/ProductiveByDeptIDAndDate"
    );
  }
  ProductiveByTeamIDAndDate() {
    return (
      this.getHostURL() + "AdminProductivityDashboard/ProductiveByTeamIDAndDate"
    );
  }
  ProductiveByOrgIDAndDate() {
    return (
      this.getHostURL() + "AdminProductivityDashboard/ProductiveByOrgIDAndDate"
    );
  }
  ProductivityGraphByOrgIDAndDate() {
    return (
      this.getHostURL() +
      "AdminProductivityDashboard/ProductivityGraphByOrgIDAndDate"
    );
  }
  ProductiveGraphByTeamIDAndDate() {
    return (
      this.getHostURL() +
      "AdminProductivityDashboard/ProductivityGraphByTeamIDAndDate"
    );
  }
  ProductiveGraphByDeptIDAndDate() {
    return (
      this.getHostURL() +
      "AdminProductivityDashboard/ProductivityGraphByDeptIDAndDate"
    );
  }
  AppTrackedByOrgIDAndDate() {
    return this.getHostURL() + "ProductivityDashboard/AppTrackedByOrgIDAndDate";
  }
  AddEntityApps() {
    return this.getHostURL() + "Entity/AddEntityApps";
  }
  UpdateEntityApps() {
    return this.getHostURL() + "Entity/UpdateEntityApps";
  }
  AppTrackedByOrgIDByEntityIDAndDate() {
    return this.getHostURL() + "Entity/AppTrackedByOrgIDByEntityIDAndDate";
  }
  GetAllAccomplishedTaskByProjectIDAndDate() {
    return (
      this.getHostURL() + "Project/GetAllAccomplishedTaskByProjectIDAndDate"
    );
  }
  GetAllProjectCheckInByProjectIDAndDate() {
    return this.getHostURL() + "Project/GetAllProjectCheckInByProjectIDAndDate";
  }
  GetAllProjectRemarksByGroupID() {
    return this.getHostURL() + "Project/GetAllProjectRemarksByGroupID";
  }
  AddWeekdays() {
    return this.getHostURL() + "Setup/AddWeekdays";
  }
  GetWeekdaysByOrgID() {
    return this.getHostURL() + "Setup/GetWeekdaysByOrgID";
  }
  UpdateWeekdays() {
    return this.getHostURL() + "Setup/UpdateWeekdays";
  }
  AddEntityTrackingDays() {
    return this.getHostURL() + "Setup/AddEntityTrackingDays";
  }
  GetEntityTrackingDaysByOrgID() {
    return this.getHostURL() + "Setup/EntityTrackingDaysByEntityID";
  }
  UpdateEntityTrackingDays() {
    return this.getHostURL() + "Setup/UpdateEntityTrackingDays";
  }
  GetAccomplishedTaskByActivityID() {
    return this.getHostURL() + "Project/GetAccomplishedTaskByActivityID";
  }
  UpdateSubTasks() {
    return this.getHostURL() + "Project/UpdateSubTasks";
  }
  FindBySubTaskssId() {
    return this.getHostURL() + "Project/FindBySubTasksID";
  }
  UpdateSubTask() {
    return this.getHostURL() + "Project/UpdateSubTask";
  }
  GetAllSubTaskByActivityID() {
    return this.getHostURL() + "Project/GetAllSubTaskByActivityID";
  }
  GetAllSubTaskByMilestoneID() {
    return this.getHostURL() + "Project/GetAllSubTaskByMilestoneID";
  }
  UpdateSubTaskStatus() {
    return this.getHostURL() + "EmployeeTasks/UpdateSubTaskStatus";
  }
  UpdateEntityContactList() {
    return this.getHostURL() + "Project/UpdateEntityContactList";
  }
  ProjectPropertyByProjectID() {
    return this.getHostURL() + "Project/ProjectPropertyByProjectID";
  }
  ProductivityProgressByProjectID() {
    return this.getHostURL() + "Project/ProductivityProgressByProjectID";
  }
  ProductivityTaskProgressByProjectID() {
    return this.getHostURL() + "Project/ProductivityTaskProgressByProjectID";
  }
  UpdateCostProjectDetails() {
    return this.getHostURL() + "Cost/UpdateCostProjectDetails";
  }
  AddModules() {
    return this.getHostURL() + "Module/AddModules";
  }
  UpdateModules() {
    return this.getHostURL() + "Module/UpdateModules";
  }
  RemoveModules() {
    return this.getHostURL() + "Module/RemoveModules";
  }
  FindByModulesID() {
    return this.getHostURL() + "Module/FindByModulesID";
  }
  FetchModulesOrgID() {
    return this.getHostURL() + "Module/FetchModulesOrgID";
  }
  AddRoleModules() {
    return this.getHostURL() + "Module/AddRoleModules";
  }
  UpdateRoleModules() {
    return this.getHostURL() + "Module/UpdateRoleModules";
  }
  RemoveRoleModules() {
    return this.getHostURL() + "Module/RemoveRoleModules";
  }

  GetApproverDetailsbyRoleId() {
    return this.getHostURL() + "Module/GetApproverDetailsbyRoleId";
  }

  UpdateModuleSectionApprv() {
    return this.getHostURL() + "Module/UpdateModuleSectionApprv";
  }

  FindByRoleModulesID() {
    return this.getHostURL() + "Module/FindByRoleModulesID";
  }
  FetchRoleModulesOrgID() {
    return this.getHostURL() + "Module/FetchRoleModulesOrgID";
  }
  GetAllRoleModulesByOrgID() {
    return this.getHostURL() + "Module/GetAllRoleModulesByOrgID";
  }

  GetAllSectionApproversByOrgID() {
    return this.getHostURL() + "Employee/GetLeaveRoleModuleApproverByOrgID";
  }
  FindByModuleSectionsID() {
    return this.getHostURL() + "Module/FindByModuleSectionsID";
  }
  SetEmployeeRoles() {
    return this.getHostURL() + "User/SetEmployeeRoles";
  }
  GetEmployeeRoleByOrgID() {
    return this.getHostURL() + "User/GetEmployeeRoleByOrgID";
  }
  GetEmpListWithRolesByOrgID() {
    return this.getHostURL() + "Employee/GetEmpListWithRolesByOrgID";
  }
  GetEmployeeRoleByEmpID() {
    return this.getHostURL() + "User/GetEmployeeRoleByEmpID";
  }
  FindByRoleName() {
    return this.getHostURL() + "Employee/FindByRoleName";
  }

  FindByRoleNameandOrg() {
    return this.getHostURL() + "Employee/FindByRoleNameandOrgName";
  }

  GetDepListWithRolesByOrgID() {
    return this.getHostURL() + "Department/GetDepListWithRolesByOrgID";
  }
  GetAllModules() {
    return this.getHostURL() + "Module/GetAllModules";
  }
  GetDepartmentRoleByDepartmentID() {
    return this.getHostURL() + "User/GetDepartmentRoleByDepartmentID";
  }
  DeleteEmployeeRoles() {
    return this.getHostURL() + "User/DeleteEmployeeRoles";
  }
  //remove
  FetchAllProjectByEmpID() {
    return this.getHostURL() + "Project/FetchAllProjectByEmpID";
  }
  LoginCallback() {
    return this.getHostURL() + "Account/LoginCallback";
  }
  //old function
  LastAddedTimesheetActivityByEmpID() {
    return this.getHostURL() + "Timesheet/LastAddedTimesheetActivityByEmpID";
  }

  //new function
  LastAddedTimesheetActivityLogByEmpID() {
    return this.getHostURL() + "Timesheet/LastAddedTimesheetActivityLogByEmpID";
  }
  setReverseCalc() {
    return this.getHostURL() + "Cost/SetReverseCalc";
  }
  GetAllTaskByEmpIDAndProjectIDAndMilestoneIDAndTaskID() {
    return (
      this.getHostURL() +
      "EmployeeTasks/GetAllTaskByEmpIDAndProjectIDAndMilestoneIDAndTaskID"
    );
  }
  NotifyService() {
    return this.getHostURL() + "Notification";
  }
  UpdateNotifyIsViewedByEmpID() {
    return this.getHostURL() + "Employee/UpdateNotifyIsViewedByEmpID";
  }
  AddNotifyType() {
    return this.getHostURL() + "Notify/AddNotifyType";
  }
  UpdateNotifyType() {
    return this.getHostURL() + "Notify/UpdateNotifyType";
  }
  FindByNotifyTypeID() {
    return this.getHostURL() + "Notify/FindByNotifyTypeID";
  }
  RemoveNotifyType() {
    return this.getHostURL() + "Notify/RemoveNotifyType";
  }
  FetchGridDataNotifyTypeByOrgID() {
    return this.getHostURL() + "Notify/FetchGridDataNotifyTypeByOrgID";
  }
  AddNotify() {
    return this.getHostURL() + "Notify/AddNotify";
  }
  UpdateNotify() {
    return this.getHostURL() + "Notify/UpdateNotify";
  }
  FindByNotifyID() {
    return this.getHostURL() + "Notify/FindByNotifyID";
  }
  RemoveNotify() {
    return this.getHostURL() + "Notify/RemoveNotify";
  }
  FetchGridDataNotifyByOrgID() {
    return this.getHostURL() + "Notify/FetchGridDataNotifyByOrgID";
  }

  WorkforceEmployeeProductiveByDeptIDAndDate() {
    return (
      this.getHostURL() + "Workforce/WorkforceEmployeeProductiveByDeptIDAndDate"
    );
  }
  WorkforceEmployeeProductiveByTeamIDAndDate() {
    return (
      this.getHostURL() + "Workforce/WorkforceEmployeeProductiveByTeamIDAndDate"
    );
  }
  WorkforceEmployeeProductiveByOrgIDAndDate() {
    return (
      this.getHostURL() + "Workforce/WorkforceEmployeeProductiveByOrgIDAndDate"
    );
  }
  PushNotifyByEmpID() {
    return this.getHostURL() + "Notify/PushNotifyByEmpID";
  }
  ProjectDetailByEmpIDAndDate() {
    return this.getHostURL() + "Workforce/ProjectDetailByEmpIDAndDate";
  }
  GetAllViewedNotifyByEmpID() {
    return this.getHostURL() + "Notify/GetAllViewedNotifyByEmpID";
  }
  AssignEmpployeeToMilestoneID() {
    return this.getHostURL() + "Project/AssignEmpployeeToMilestoneID";
  }
  AssignEmpployeeToProjectID() {
    return this.getHostURL() + "Project/AssignEmpployeeTProjectID";
  }
  FindByEntityContactID() {
    return this.getHostURL() + "Project/FindByEntityContactID";
  }
  UpdateEntityContact() {
    return this.getHostURL() + "Project/UpdateEntityContact";
  }
  GetMilestoneWorkedRatioByProjectID() {
    return this.getHostURL() + "Project/GetMilestoneWorkedRatioByProjectID";
  }
  ProductivityMilestoneProgressByProjectID() {
    return (
      this.getHostURL() + "Project/ProductivityMilestoneProgressByProjectID"
    );
  }
  ProductivityProjectProgressByProjectID() {
    return this.getHostURL() + "Project/ProductivityProjectProgressByProjectID";
  }
  GetLastTimesheetByEmpID() {
    return this.getHostURL() + "Timesheet/GetLastTimesheetByEmpID";
  }
  ProjectModificationByProjectID() {
    return this.getHostURL() + "Project/ProjectModificationByProjectID";
  }
  FindSubTaskBySubTaskNameAndProjectID() {
    return this.getHostURL() + "Project/FindSubTaskBySubTaskNameAndProjectID";
  }
  FindModifiedSubTaskByProjectID() {
    return this.getHostURL() + "Project/FindModifiedSubTaskByProjectID";
  }
  GetProjectIDByEstID() {
    return this.getHostURL() + "Project/GetProjectIDByEstID";
  }
  ModifyProjectByProjectID() {
    return this.getHostURL() + "Project/ModifyProjectByProjectID";
  }
  UpdateCostProjectIsQuotationByID() {
    return this.getHostURL() + "Cost/UpdateCostProjectIsQuotationByID";
  }
  SetProjectModificationByProjectID() {
    return this.getHostURL() + "Project/SetProjectModificationByProjectID";
  }
  GetProjectModifiationByEstID() {
    return this.getHostURL() + "Project/GetProjectModifiationByEstID";
  }
  SetUnitAddOrRemovedByUnitID() {
    return this.getHostURL() + "Project/SetUnitAddOrRemovedByUnitID";
  }
  UpdateSubTaskExceptUnitQty() {
    return this.getHostURL() + "Project/UpdateSubTaskExceptUnitQty";
  }
  GetAllStaticMilestoneByMilestoneID() {
    return this.getHostURL() + "Cost/GetAllStaticMilestoneByMilestoneID";
  }
  AddEmployeeLeaveAdjustment() {
    return this.getHostURL() + "Employee/AddEmployeeLeaveAdjustment";
  }
  UpdateEmployeeLeaveAdjustment() {
    return this.getHostURL() + "Employee/UpdateEmployeeLeaveAdjustment";
  }
  RemoveEmployeeLeaveAdjustment() {
    return this.getHostURL() + "Employee/RemoveEmployeeLeaveAdjustment";
  }
  FindEmployeeLeaveAdjustmentByID() {
    return this.getHostURL() + "Employee/FindEmployeeLeaveAdjustmentByID";
  }
  FetchEmployeeLeaveAdjustmentOrgID() {
    return this.getHostURL() + "Employee/FetchEmployeeLeaveAdjustmentOrgID";
  }
  FetchEmployeeLeaveAdjustmentEmpID() {
    return this.getHostURL() + "Employee/FetchEmployeeLeaveAdjustmentEmpID";
  }
  EmployeeLeaveListAdjustmentOrgID() {
    return this.getHostURL() + "Employee/EmployeeLeaveListAdjustmentOrgID";
  }
  LeaveCountByEmpID() {
    return this.getHostURL() + "Employee/LeaveCountByEmpID";
  }
  ReassignEmployeeToMilestoneID() {
    return this.getHostURL() + "Project/ReassignEmployeeToMilestoneID";
  }
  ReassignEmpployeeTProjectID() {
    return this.getHostURL() + "Project/ReassignEmpployeeTProjectID";
  }
  ApproveTimesheet() {
    return this.getHostURL() + "Timesheet/ApproveTimesheet";
  }
  //old function
  getEmployeePreviousProjects() {
    return this.getHostURL() + "User/GetAllActivityByEmpIDAndDate";
  }
  GetTimeLogAllActivityByEmpIDAndDate() {
    return this.getHostURL() + "User/GetTimeLogAllActivityByEmpIDAndDate";
  }
  AddReasons() {
    return this.getHostURL() + "Setup/AddReasons";
  }
  RemoveReasons() {
    return this.getHostURL() + "Setup/RemoveReasons";
  }
  FindByReasonsID() {
    return this.getHostURL() + "Setup/FindByReasonsID";
  }
  FetchReasonsOrgID() {
    return this.getHostURL() + "Setup/FetchReasonsOrgID";
  }
  UpdateReasons() {
    return this.getHostURL() + "Setup/UpdateReasons";
  }
  ApprovalByTimesheetIDAndApproverID() {
    return this.getHostURL() + "Employee/ApprovalByTimesheetIDAndApproverID";
  }
  DeclineByLeaveIDAndApproverID() {
    return this.getHostURL() + "Employee/DeclineByLeaveIDAndApproverID";
  }
  DeclineByTimesheetIDAndApproverID() {
    return this.getHostURL() + "Employee/DeclineByTimesheetIDAndApproverID";
  }
  GetAllProjectValueByOrgID() {
    return this.getHostURL() + "Finance/GetAllProjectValueByOrgID";
  }
  GetTimesheetByGroupID() {
    return this.getHostURL() + "Timesheet/GetTimesheetByGroupID";
  }
  AddApprovalTrackingSetup() {
    return this.getHostURL() + "Setup/AddApprovalTrackingSetup";
  }

  GetAbsentDataByEmpIDAndDate() {
    return this.getHostURL() + "Employee/GetAbsentDataByEmpIDAndDate";
  }
  GetAttendaceDataByEmpIDAndDate() {
    return this.getHostURL() + "Employee/GetAttendaceDataByEmpIDAndDate";
  }
  AddTimesheetOverrideByTimesheetID() {
    return this.getHostURL() + "Timesheet/AddTimesheetOverrideByTimesheetID";
  }
  GetTimesheetOverrideDetailsByTimesheetID() {
    return (
      this.getHostURL() + "Employee/GetTimesheetOverrideDetailsByTimesheetID"
    );
  }

  ApproveByCheckinOverwriteIDAndApproverID() {
    return (
      this.getHostURL() + "Employee/ApproveByCheckinOverwriteIDAndApproverID"
    );
  }

  DeclineByCheckinOverwriteIDAndApproverID() {
    return (
      this.getHostURL() + "Employee/DeclineByCheckinOverwriteIDAndApproverID"
    );
  }
  UpdateProjectTagByUnitIdProjectID() {
    return this.getHostURL() + "Cost/UpdateProjectTagByUnitIdProjectID";
  }
  UpdateProjectExtraTagByUnitIdProjectID() {
    return this.getHostURL() + "Cost/UpdateProjectExtraTagByUnitIdProjectID";
  }

  GetAllTaskDetailsProjectValueByOrgID() {
    return this.getHostURL() + "Finance/GetAllTaskDetailsProjectValueByOrgID";
  }

  GetAllTaskDetailsEmployeeByID() {
    return this.getHostURL() + "Finance/GetAllTaskDetailsEmployeeByID";
  }

  GetAllMilestoneByProjectID() {
    return this.getHostURL() + "Project/GetAllMilestoneByProjectID";
  }
  GetAllTaskByMilestoneID() {
    return this.getHostURL() + "Project/GetAllTaskByMilestoneID";
  }
  GetAllSubTaskByMilestone() {
    return this.getHostURL() + "Project/GetAllSubTaskByMilestone";
  }
  AssignEmployeeTaskByProjectID() {
    return this.getHostURL() + "Project/AssignEmployeeTaskByProjectID";
  }
  ReAssignEmployeeTaskByProjectID() {
    return this.getHostURL() + "Project/ReAssignEmployeeTaskByProjectID";
  }
  AddProjectTask() {
    return this.getHostURL() + "Cost/AddProjectTask";
  }
  UpdateProjectIdTask() {
    return this.getHostURL() + "Cost/UpdateProjectIdTask";
  }
  FindAssigneeByProjectID() {
    return this.getHostURL() + "Project/FindAssigneeByProjectID";
  }
  AssignEmployeeTaskByMilestoneID() {
    return this.getHostURL() + "Project/AssignEmployeeTaskByMilestoneID";
  }
  ReAssignEmployeeTaskByMilestoneID() {
    return this.getHostURL() + "Project/ReAssignEmployeeTaskByMilestoneID";
  }
  FindAssigneeByMilestoneId() {
    return this.getHostURL() + "Project/FindAssigneeByMilestoneId";
  }
  AddProjectLocalTask() {
    return this.getHostURL() + "EmployeeTasks/AddProjectLocalTask";
  }
  GetTaskByMilestoneID() {
    return this.getHostURL() + "Project/GetTaskByMilestoneID";
  }
  GetAllEmployeeTasksByMilestoneId() {
    return this.getHostURL() + "Project/GetAllEmployeeTasksByMilestoneId";
  }
  GetMilestoneByProjectID() {
    return this.getHostURL() + "Project/GetMilestoneByProjectID";
  }
  GetProjectTaskListByEmployeeIDByProject() {
    return (
      this.getHostURL() +
      "EmployeeTasks/GetProjectTaskListByEmployeeIDByProject"
    );
  }
  GetTaskListByEmployeeIDByProject() {
    return this.getHostURL() + "EmployeeTasks/GetTaskListByEmployeeIDByProject";
  }
  AddProjectMilestone() {
    return this.getHostURL() + "Project/AddProjectMilestone";
  }
  FindAllProjectMilestoneByProjectID() {
    return this.getHostURL() + "Project/FindAllProjectMilestoneByProjectID";
  }

  GetAllProjectTaskListByEmpIDAndProjectIDAndMilestoneIDAndTaskID() {
    return (
      this.getHostURL() +
      "EmployeeTasks/GetAllProjectTaskListByEmpIDAndProjectIDAndMilestoneIDAndTaskID"
    );
  }
  GetAllFilterLocalTaskListByEmpIDAndProjectIDAndMilestoneIDAndTaskID() {
    return (
      this.getHostURL() +
      "EmployeeTasks/GetAllFilterLocalTaskListByEmpIDAndProjectIDAndMilestoneIDAndTaskID"
    );
  }
  GetAllTaskListByEmployeeID() {
    return this.getHostURL() + "EmployeeTasks/GetAllTaskListByEmployeeID";
  }
  GetAllProjectTaskListByEmployeeID() {
    return (
      this.getHostURL() + "EmployeeTasks/GetAllProjectTaskListByEmployeeID"
    );
  }
  FetchAllEmployeeProjectByEmpID() {
    return this.getHostURL() + "Project/FetchAllEmployeeProjectByEmpID";
  }
  FetchAllEmployeeLocalTasks() {
    return this.getHostURL() + "Project/FetchAllEmployeeLocalTasks";
  }
  GetAllMainandLocalTaskListByEmpId() {
    return (
      this.getHostURL() + "EmployeeTasks/GetAllMainandLocalTaskListByEmpId"
    );
  }
  GetAllMainandLocalSubTaskListByEmployeeId() {
    return (
      this.getHostURL() +
      "EmployeeTasks/GetAllMainandLocalSubTaskListByEmployeeId"
    );
  }
  GetAllSubtaskListByTaskEmpId() {
    return this.getHostURL() + "EmployeeTasks/GetAllSubtaskListByTaskEmpId";
  }
  GetAllProjectRevenueByOrgID() {
    return this.getHostURL() + "Finance/GetAllProjectRevenueByOrgID";
  }
  FetchAllProjectListByOrg() {
    return this.getHostURL() + "Project/FetchAllProjectListByOrg";
  }
  FetchAllProjectListByEmpID() {
    return this.getHostURL() + "Project/FetchAllProjectListByEmpID";
  }
  ProjectListPropertyByProjectID() {
    return this.getHostURL() + "Project/ProjectListPropertyByProjectID";
  }
  GetAllProjectTaskListByProjectID() {
    return this.getHostURL() + "Project/GetAllProjectTaskListByProjectID";
  }
  GetAllProjectLocalTaskListByProjectID() {
    return this.getHostURL() + "Project/GetAllProjectLocalTaskListByProjectID";
  }
  GetProjectMilestoneWorkedRatioByProjectID() {
    return (
      this.getHostURL() + "Project/GetProjectMilestoneWorkedRatioByProjectID"
    );
  }
  GetProjectTaskRatioByProjectID() {
    return this.getHostURL() + "Project/GetProjectTaskRatioByProjectID";
  }
  GetProjectAllMilestoneRatioByProjectID() {
    return this.getHostURL() + "Project/GetProjectAllMilestoneRatioByProjectID";
  }
  ProductivityProjectTaskTaskProgressByProjectID() {
    return (
      this.getHostURL() +
      "Project/ProductivityProjectTaskTaskProgressByProjectID"
    );
  }
  ProductivityProjectMilestoneProgressByProjectID() {
    return (
      this.getHostURL() +
      "Project/ProductivityProjectMilestoneProgressByProjectID"
    );
  }
  ProductivityProjectProgressActualBudgtedByProjectID() {
    return (
      this.getHostURL() +
      "Project/ProductivityProjectProgressActualBudgtedByProjectID"
    );
  }
  UpdateProjectTask() {
    return this.getHostURL() + "Project/UpdateProjectTask";
  }
  FindProjectListEditBySubTasksID() {
    return this.getHostURL() + "Project/FindProjectListEditBySubTasksID";
  }
  GetAllProjectTaskByMilestoneID() {
    return this.getHostURL() + "Project/GetAllProjectTaskByMilestoneID";
  }
  UpdateEstimationTask() {
    return this.getHostURL() + "Project/UpdateEstimationTask";
  }
  UpdateProjectSubTaskStatus() {
    return this.getHostURL() + "EmployeeTasks/UpdateProjectSubTaskStatus";
  }
  GetProjectMilestoneByProjectID() {
    return this.getHostURL() + "Project/GetProjectMilestoneByProjectID";
  }
  GetAllProjectSubTaskByMilestoneID() {
    return this.getHostURL() + "Project/GetAllProjectSubTaskByMilestoneID";
  }
  GetProjectAssigneeReassigneeList() {
    return this.getHostURL() + "Cost/GetProjectAssigneeReassigneeList";
  }
  GetAllSubTaskListByTaskId() {
    return this.getHostURL() + "EmployeeTasks/GetAllSubTaskListByTaskId";
  }
  FindByCustomerByPhone() {
    return this.getHostURL() + "Customer/FindByCustomerByPhone";
  }
  GetLatLongDataByEmpIDAndDate() {
    return this.getHostURL() + "Timesheet/GetLatLongDataByEmpIDAndDate";
  }
  AddLeaveProfileSetup() {
    return this.getHostURL() + "Employee/AddLeaveProfileSetup";
  }
  UpdateProfileByOrgIDandProfileNameOrProfileID() {
    return (
      this.getHostURL() +
      "Employee/UpdateProfileByOrgIDandProfileNameOrProfileID"
    );
  }
  GetAllLeaveProfileSetupByOrgID() {
    return this.getHostURL() + "Employee/GetAllLeaveProfileSetupByOrgID";
  }
  RemoveLeaveProfileByOrgIDAndProfileName() {
    return (
      this.getHostURL() + "Employee/RemoveLeaveProfileByOrgIDAndProfileName"
    );
  }
  FindByEmpID() {
    return this.getHostURL() + "Employee/FindByEmpID";
  }
  GetLeaveAccessByOrgIDandEmpID() {
    return this.getHostURL() + "Employee/GetLeaveAccessByOrgIDandEmpID";
  }

  saUpdateAccessRightsByOrgIDandEmpID() {
    return this.getHostURL() + "Employee/UpdateLeaveAccessByOrgIDandEmpID";
  }

  GetLeaveRelatedNotificationsByOrgID() {
    return this.getHostURL() + "Employee/GetLeaveRelatedNotificationsByOrgID";
  }

  GetLeaveProfileSetupByOrgIDandProfileID() {
    return (
      this.getHostURL() + "Employee/GetLeaveProfileSetupByOrgIDandProfileID"
    );
  }

  UpdateLeaveRelatedNotificationsByID() {
    return this.getHostURL() + "Employee/UpdateLeaveRelatedNotificationsByID";
  }

  UpdateAttendanceRelatedNotificationsByID() {
    return this.getHostURL() + "Employee/UpdateAttendanceRelatedNotificationsByID";
  }

  getEmpLeaveAvailableByOrgId() {
    return this.getHostURL() + "Employee/GetLeaveAvailablebyOrgIdEmpId";
  }

  getLeaveProfileSetupByOrgIDandId() {
    return (
      this.getHostURL() + "Employee/GetLeaveProfileSetupByOrgIDandProfileID"
    );
  }
  ///Employee/AddLeaveRequestedHistory
  addEmpAddLeaveRequestedHistory() {
    return this.getHostURL() + "Employee/AddLeaveRequestedHistory";
  }

  GetLeaveRelatedNotificationsByOrgIDandEmpID() {
    return (
      this.getHostURL() + "Employee/GetLeaveRelatedNotificationsByOrgIDandEmpID"
    );
  }
  GetUnreadLeaveRelatedNotificationsByOrgIDandEmpID() {
    return (
      this.getHostURL() +
      "Employee/GetUnreadLeaveRelatedNotificationsByOrgIDandEmpID"
    );
  }

  UpdateLeaveRequestedHistoryByID() {
    return this.getHostURL() + "Employee/UpdateLeaveRequestedHistoryByID";
  }

  GetLeaveRequestedHistoryByID() {
    return this.getHostURL() + "Employee/GetLeaveRequestedHistoryByID";
  }

  GetLeaveRequestedHistoryByOrgIDandEmpID() {
    return (
      this.getHostURL() + "Employee/GetLeaveRequestedHistoryByOrgIDandEmpID"
    );
  }



  GetLeaveRequestedHistoryByOrgIDandOnbehalfEmpID() {
    return (
      this.getHostURL() +
      "Employee/GetLeaveRequestedHistoryByOrgIDandOnbehalfEmpID"
    );
  }

  GetLeaveAccessByOrgIDandChkInChkOutOverWrite() {
    return (
      this.getHostURL() +
      "Employee/GetLeaveAccessByOrgIDandChkInChkOutOverWrite"
    );
  }
  AddTimesheetOverrideByTimesheetIDNew() {
    return this.getHostURL() + "Timesheet/AddTimesheetOverrideByTimesheetIDNew";
  }

  FetchAllTeamMembersByTeamName() {
    return this.getHostURL() + "Team/FetchAllTeamMembersByTeamName";
  }

  GetAllBackLogProjectRevenueByOrgID() {
    return this.getHostURL() + "Finance/GetAllBackLogProjectRevenueByOrgID";
  }

  GetAllOpenProjectRevenueByOrgID() {
    return this.getHostURL() + "Finance/GetAllOpenProjectRevenueByOrgID";
  }

  getLeaveRoleModuleApproverByRoleIDandModuleID() {
    return (
      this.getHostURL() +
      "Employee/GetLeaveRoleModuleApproverByRoleIDandModuleID"
    );
  }

  GetAccessRightsbyRole() {
    return this.getHostURL() + "User/GetAccessRightsbyRole";
  }

  GetProjectInvoiceReport() {
    return this.getHostURL() + "Finance/GetProjectInvoiceReport";
  }

  GetMiltestoneDatByProjectandDate() {
    return this.getHostURL() + "Project/GetMiltestoneDatByProjectandDate";
  }

  GetDefaultLeaveProfileSetupByOrgID() {
    return this.getHostURL() + "Employee/GetDefaultLeaveProfileSetupByOrgID";
  }

  UpdateAvailableLeaves() {
    return this.getHostURL() + "Employee/UpdateAvailableLeaves";
  }

  SearchLeavePofileName() {
    return this.getHostURL() + "Employee/SearchLeavePofileName";
  }

  DefaultToCommonProfileByOrgIDandProfileId() {
    return (
      this.getHostURL() + "Employee/DefaultToCommonProfileByOrgIDandProfileId"
    );
  }

  GetLeaveAvailableProfileHistorybyOrgIdEmpId() {
    return (
      this.getHostURL() + "Employee/GetLeaveAvailableProfileHistorybyOrgIdEmpId"
    );
  }

  TeamResetSettings() {
    return this.getHostURL() + "Team/TeamResetSettings";
  }
  GetAllFieldSettingByOrgId() {
    return this.getHostURL() + "Team/GetAllFieldSettingByOrgId";
  }
  UpdateFieldSettings() {
    return this.getHostURL() + "Team/UpdateFieldSettingByFieldGroup";
  }
  AddFieldSettings() {
    return this.getHostURL() + "Team/AddFieldSettings";
  }
  UpdateFieldSettingsBasedonWorkLocation() {
    return this.getHostURL() + "Team/UpdateFieldSettingsBasedonWorkLocation"
  }
  EmployeeResetSettings() {
    return this.getHostURL() + "Employee/EmployeeResetSettings";
  }

  FindByTeamID() {
    return this.getHostURL() + "Team/FindByTeamID";
  }
  FindByTeamIDnew() {
    return this.getHostURL() + "Team/FindByTeamIDnew";
  }

  GetEmployeeByOrgIDAndProfileID() {
    return this.getHostURL() + "Employee/GetEmployeeByOrgIDAndProfileID";
  }

  GetCarryfrwdRqstById() {
    return this.getHostURL() + "Employee/GetCarryfrwdRqstById";
  }

  GetCarryForwardHistorybyOrgId() {
    return this.getHostURL() + "Employee/GetCarryForwardHistorybyOrgId";
  }

  AddCarryForwardRequest() {
    return this.getHostURL() + "Employee/AddCarryForwardRequest";
  }

  GetCarryForwardToApprovebyOrgId() {
    return this.getHostURL() + "Employee/GetCarryForwardToApprovebyOrgId";
  }

  UpdateLeaveAvailableCarryForward() {
    return this.getHostURL() + "Employee/UpdateLeaveAvailableCarryForward";
  }

  UpdateCarryForwardRequestByID() {
    return this.getHostURL() + "Employee/UpdateCarryForwardRequestByID";
  }

  GetCryFrwdRqstbyEmpId() {
    return this.getHostURL() + "Employee/GetCryFrwdRqstbyEmpId";
  }

  GetPublicHolidaysCreatedbyOrgId() {
    return this.getHostURL() + "Employee/GetPublicHolidaysCreatedbyOrgId";
  }

  GetPublicHolidaysCreatedbyApproverId() {
    return this.getHostURL() + "Employee/GetPublicHolidaysCreatedbyApproverId";
  }

  AddPublicHolidays() {
    return this.getHostURL() + "Employee/AddPublicHolidays";
  }

  GetPublicHolidaysById() {
    return this.getHostURL() + "Employee/GetPublicHolidaysById";
  }

  GetLeaveRqstbyEmpId() {
    return this.getHostURL() + "Employee/GetLeaveRqstbyEmpId";
  }

  UpdatePublicHolidaysByID() {
    return this.getHostURL() + "Employee/UpdatePublicHolidaysByID";
  }

  FetchEmployeeOvrwriteApproverId() {
    return this.getHostURL() + "Employee/FetchEmployeeOvrwriteApproverId";
  }

  AdminReopenTasks() {
    return this.getHostURL() + "Timesheet/AdminReopenTasks";
  }

  AddEmpGecoCodEvent() {
    return this.getHostURL() + "AdminDashboard/AddEmpGecoCodEvent";
  }

  AddEmpMapViewEvent() {
    return this.getHostURL() + "AdminDashboard/AddEmpMapViewEvent";
  }

  GetEventTotalByOrgId() {
    return this.getHostURL() + "AdminDashboard/GetEventTotalByOrgId";
  }

  GetEventCountsByOrgId() {
    return this.getHostURL() + "AdminDashboard/GetEventCountsByOrgId";
  }
  GetMonthlyEventCountsByOrgId() {
    return this.getHostURL() + "AdminDashboard/GetMonthlyEventCountsByOrgId";
  }
  GetYearlyEventCountsByOrgId() {
    return this.getHostURL() + "AdminDashboard/GetYearlyEventCountsByOrgId";
  }

  GetProjectwithMilestoneData() {
    return this.getHostURL() + "Project/GetProjectwithMilestoneData";
  }

  GettaskDatabyMilestone() {
    return this.getHostURL() + "Project/GettaskDatabyMilestone";
  }

  GetOpentaskDatabyMilestone() {
    return this.getHostURL() + "Project/GetOpentaskDatabyMilestone";
  }

  GetEmpOverrideDetailsById() {
    return this.getHostURL() + "Employee/GetEmpOverrideDetailsById";
  }

  UpdateEmployeeDetailsOverrideByID() {
    return this.getHostURL() + "Employee/UpdateEmployeeDetailsOverrideByID";
  }

  GetEmployeeDetailsOverrideByApproverRoleID() {
    return (
      this.getHostURL() + "Employee/GetEmployeeDetailsOverrideByApproverRoleID"
    );
  }

  GetEmployeeProductvityByOrgID() {
    return this.getHostURL() + "Finance/GetEmployeeProductvityByOrgID";
  }

  GetEmpProductvityDetails() {
    return this.getHostURL() + "Finance/GetEmpProductvityDetails";
  }

  AddCaseType() {
    return this.getHostURL() + "Case/AddCaseType";
  }

  UpdateCaseTypeById() {
    return this.getHostURL() + "Case/UpdateCaseTypeById";
  }

  GetAllCaseTypeByOrgId() {
    return this.getHostURL() + "Case/GetAllCaseTypeByOrgId";
  }

  GetCaseAssignedtoUser() {
    return this.getHostURL() + "Case/GetCaseHistoryByAssignedToEmpID";
  }

  GetCaseActivityHistoryById() {
    return this.getHostURL() + "Case/GetCaseActivityByCaseID";
  }

  GetCaseTypeByID() {
    return this.getHostURL() + "Case/GetCaseTypeByID";
  }

  GetCaseHistoryByCreatedByEmpID() {
    return this.getHostURL() + "Case/GetCaseHistoryByCreatedByEmpID";
  }

  AddCaseHistory() {
    return this.getHostURL() + "Case/AddCaseHistory";
  }

  ProjectTaskDetailsbyEmp() {
    return this.getHostURL() + "Finance/ProjectTaskDetailsbyEmp";
  }

  EmployeeSummaryByOrgID() {
    return this.getHostURL() + "Finance/EmployeeSummaryByOrgID";
  }

  GetSummaryDetailsbyEmpID() {
    return this.getHostURL() + "Finance/GetSummaryDetailsbyEmpID";
  }

  GetSummaryDetailsbyEmpIDAndMil() {
    return this.getHostURL() + "Finance/GetSummaryDetailsbyEmpIDAndMil";
  }

  NormalTaskDetailsbyEmp() {
    return this.getHostURL() + "Finance/NormalTaskDetailsbyEmp";
  }

  ActivityTaskDetailsbyEmp() {
    return this.getHostURL() + "Finance/ActivityTaskDetailsbyEmp";
  }

  ProjectCompletedDetailsByEmp() {
    return this.getHostURL() + "Finance/ProjectCompletedDetailsByEmp";
  }

  GetCaseHistoryByID() {
    return this.getHostURL() + "Case/GetCaseHistoryByID";
  }

  UpdateCaseHistoryByID() {
    return this.getHostURL() + "Case/UpdateCaseHistoryByID";
  }

  GetAllSubscriptionPlan() {
    return this.getHostURL() + "Subscription/GetAllSubscriptionPlan";
  }

  AddSubscriptionPlan() {
    return this.getHostURL() + "Subscription/AddSubscriptionPlan";
  }

  UpdateSubscriptionPlanByID() {
    return this.getHostURL() + "Subscription/UpdateSubscriptionPlanByID";
  }

  GetSubscriptionPlanByID() {
    return this.getHostURL() + "Subscription/GetSubscriptionPlanByID";
  }

  GetGroupedPrjtTskbyEmpId() {
    return this.getHostURL() + "Finance/GetGroupedPrjtTskbyEmpId";
  }

  GetGroupedNrmlTskbyEmpId() {
    return this.getHostURL() + "Finance/GetGroupedNrmlTskbyEmpId";
  }

  GetTaskHistoryByTskId() {
    return this.getHostURL() + "Timesheet/GetTaskHistoryByTskId";
  }

  ValidateProjectTask() {
    return this.getHostURL() + "Finance/ValidateProjectTask";
  }

  EmployeeLocationByEmpIDAndDate() {
    return this.getHostURL() + "Employee/EmployeeLocationByEmpIDAndDate";
  }

  RemoveLeaveRequestedHistoryByID() {
    return this.getHostURL() + "Employee/RemoveLeaveRequestedHistoryByID";
  }

  GetCaseActivityByCaseID() {
    return this.getHostURL() + "Case/GetCaseActivityByCaseID";
  }

  AddCaseActivity() {
    return this.getHostURL() + "Case/AddCaseActivity";
  }

  UpdateCaseActivityByID() {
    return this.getHostURL() + "Case/UpdateCaseActivityByID";
  }

  GetCaseTicketNumber() {
    return this.getHostURL() + "Case/GetCaseTicketNumber";
  }

  GetCaseByOrgIdDate() {
    return this.getHostURL() + "Case/GetCaseByOrgIdDate";
  }

  AddStaticMilestone() {
    return this.getHostURL() + "Cost/AddStaticMilestone";
  }

  UpdateStaticMilestoneById() {
    return this.getHostURL() + "Cost/UpdateStaticMilestoneById";
  }

  AddEstimationService() {
    return this.getHostURL() + "Cost/AddEstimationService";
  }

  GetEstimationServiceByOrgId() {
    return this.getHostURL() + "Cost/GetEstimationServiceByOrgId";
  }

  GetStaticMilestoneTasksByMilestoneID() {
    return this.getHostURL() + "Cost/GetStaticMilestoneTasksByMilestoneID";
  }

  UpdateEstimationService() {
    return this.getHostURL() + "Cost/UpdateEstimationService";
  }

  DeleteEstimationService() {
    return this.getHostURL() + "Cost/DeleteEstimationService";
  }

  CommisionTypeByOrgID() {
    return this.getHostURL() + "Project/CommisionTypeByOrgID";
  }

  AddIncomeType() {
    return this.getHostURL() + "Project/AddIncomeType";
  }

  AddCommissionType() {
    return this.getHostURL() + "Project/AddCommissionType";
  }

  AddVendorDocuments() {
    return this.getHostURL() + "Project/AddVendorDocuments";
  }

  AddVendorDocumentUploadType() {
    return this.getHostURL() + "Project/AddVendorDocumentUploadType";
  }

  GetIncomeTypeByOrgId() {
    return this.getHostURL() + "Project/GetIncomeTypeByOrgId";
  }

  CommisionTypeByincTypId() {
    return this.getHostURL() + "Project/CommisionTypeByincTypId";
  }

  UpdateIncomeTypeById() {
    return this.getHostURL() + "Project/UpdateIncomeTypeById";
  }

  UpdateVendorDocumentUploadTypeById() {
    return this.getHostURL() + "Project/UpdateVendorDocumentUploadTypeById";
  }

  UpdateVendorCategoryTypesById() {
    return this.getHostURL() + "Project/UpdateVendorCategoryTypesById";
  }

  UpdateVendorStatusById() {
    return this.getHostURL() + "Project/UpdateVendorStatusById";
  }

  UpdateCommisionType() {
    return this.getHostURL() + "Project/UpdateCommisionType";
  }

  UpdateDocumentUrlById() {
    return this.getHostURL() + "Project/UpdateDocumentUrlById";
  }

  UpdateCommissionServiceById() {
    return this.getHostURL() + "Project/UpdateCommissionServiceById";
  }

  GetCommissionPolicybyComId() {
    return this.getHostURL() + "Employee/GetCommissionPolicybyComId";
  }

  AddCommissionPolicy() {
    return this.getHostURL() + "Employee/AddCommissionPolicy";
  }

  FetchCommissionPolicyByOrg() {
    return this.getHostURL() + "Employee/FetchCommissionPolicyByOrg";
  }

  GetCommissionServiceByOrgId() {
    return this.getHostURL() + "Project/GetCommissionServiceByOrgId";
  }

  GetCommissionServiceByDateOrgId() {
    return this.getHostURL() + "Project/GetCommissionServiceByDateOrgId";
  }

  UpdateCommissionPolicy() {
    return this.getHostURL() + "Employee/UpdateCommissionPolicy";
  }

  GetCommissionVendors() {
    return this.getHostURL() + "Project/GetCommissionVendors";
  }

  EntityContactsByVendorId() {
    return this.getHostURL() + "Project/EntityContactsByVendorId";
  }

  DocumentUrlByVendorId() {
    return this.getHostURL() + "Project/DocumentUrlByVendorId";
  }

  GetLastCommissionServiceByOrgId() {
    return this.getHostURL() + "Project/GetLastCommissionServiceByOrgId";
  }

  AddCommissionVendors() {
    return this.getHostURL() + "Project/AddCommissionVendors";
  }

  UpdateCommissionVendors() {
    return this.getHostURL() + "Project/UpdateCommissionVendors";
  }

  UpdateEntityContactsByVendorId() {
    return this.getHostURL() + "Project/UpdateEntityContactsByVendorId";
  }

  AddCommissionService() {
    return this.getHostURL() + "Project/AddCommissionService";
  }

  GetEstimationServiceById() {
    return this.getHostURL() + "Cost/GetEstimationServiceById";
  }

  EmployeeTravelClmByOrgIdAndDate() {
    return this.getHostURL() + "Employee/EmployeeTravelClmByOrgIdAndDate";
  }

  GetAttendanceReportOrgIDAndDate() {
    return this.getHostURL() + "AdminDashboard/GetAttendanceReportOrgIDAndDate";
  }

  GetAllTimesheetBreaksbyOrgIdandDate() {
    return this.getHostURL() + "Timesheet/GetAllTimesheetBreaksbyOrgIdandDate";
  }

  FindEmpByRoleId() {
    return this.getHostURL() + "Employee/FindEmpByRoleId";
  }

  AddPaymentPolicy() {
    return this.getHostURL() + "Employee/AddPaymentPolicy";
  }

  AddProformaInvoice() {
    return this.getHostURL() + "Project/AddProformaInvoice";
  }

  FetchPaymentPolicy() {
    return this.getHostURL() + "Employee/FetchPaymentPolicy";
  }

  UpdatePaymentPolicy() {
    return this.getHostURL() + "Employee/UpdatePaymentPolicy";
  }

  GetPaymentPolicyByOrgId() {
    return this.getHostURL() + "Employee/GetPaymentPolicyByOrgId";
  }

  GetAppUsageDataByOrgId() {
    return this.getHostURL() + "Employee/GetAppUsageDataByOrgId";
  }

  EmployeeAvialAttendanceSummaryById() {
    return (
      this.getHostURL() + "AdminDashboard/EmployeeAvialAttendanceSummaryById"
    );
  }
  CheckAttendenceExpInRangebyEmpId() {
    return (
      this.getHostURL() + "AdminDashboard/CheckAttendenceExpInRangebyEmpId"
    );
  }

  EmployeeAllLeaveSummaryById() {
    return this.getHostURL() + "AdminDashboard/EmployeeAllLeaveSummaryById";
  }
  EmployeeAllLeaveSummaryByOrgId() {
    return this.getHostURL() + "AdminDashboard/EmployeeAllLeaveSummaryByOrgId";
  }
  EmployeeAllLeavePendingSummaryByOrgId() {
    return this.getHostURL() + "AdminDashboard/EmployeeAllLeavePendingSummaryByOrgId";
  }

  EmployeeApprovedLeaveSummaryById() {
    return (
      this.getHostURL() + "AdminDashboard/EmployeeApprovedLeaveSummaryById"
    );
  }

  GetTimeSheetOverridebyEmpID() {
    return this.getHostURL() + "Timesheet/GetTimeSheetOverridebyEmpID";
  }

  GetLessHoursWrkbyEmpID() {
    return this.getHostURL() + "Timesheet/GetLessHoursWrkbyEmpID";
  }

  GetLessHoursWrkbyHlfEmpID() {
    return this.getHostURL() + "Timesheet/GetLessHoursWrkbyHlfEmpID";
  }

  EmployeeAttendanceSummaryById() {
    return this.getHostURL() + "AdminDashboard/EmployeeAttendanceSummaryById";
  }

  GetProformaInvoiceByOrgId() {
    return this.getHostURL() + "Project/GetProformaInvoiceByOrgId";
  }

  GetProformaInvoiceCount() {
    return this.getHostURL() + "Project/GetProformaInvoiceCount";
  }

  GetAdvacneRevInv() {
    return this.getHostURL() + "Project/GetAdvacneRevInv";
  }

  GetStagesRevInv() {
    return this.getHostURL() + "Project/GetStagesRevInv";
  }

  GetProformaInvoiceByProject() {
    return this.getHostURL() + "Project/GetProformaInvoiceByProject";
  }

  AddDraftProformaInvoice() {
    return this.getHostURL() + "Project/AddDraftProformaInvoice";
  }

  UpdateProformDraftIds() {
    return this.getHostURL() + "Project/UpdateProformDraftIds";
  }

  UpdateAmountClaimed() {
    return this.getHostURL() + "Project/UpdateAmountClaimed";
  }

  GetDraftProformaInvoiceByOrgId() {
    return this.getHostURL() + "Project/GetDraftProformaInvoiceByOrgId";
  }

  GetOverDueInvoiceByOrgId() {
    return this.getHostURL() + "Project/GetOverDueInvoiceByOrgId";
  }

  AddInvoiceDebts() {
    return this.getHostURL() + "Project/AddInvoiceDebts";
  }

  UpdateInvoiceDebtById() {
    return this.getHostURL() + "Project/UpdateInvoiceDebtById";
  }

  GetInvoiceDebtsByDateOrgId() {
    return this.getHostURL() + "Project/GetInvoiceDebtsByDateOrgId";
  }

  GetRevenuePaymentByProject() {
    return this.getHostURL() + "Project/GetRevenuePaymentByProject";
  }

  FullModeGraphData() {
    return this.getHostURL() + "Project/FullModeGraphData";
  }

  ProjectBdgtProgressbyId() {
    return this.getHostURL() + "Project/ProjectBdgtProgressbyId";
  }

  GetProformaInvoiceByList() {
    return this.getHostURL() + "Project/GetProformaInvoiceByList";
  }

  GetPaymentPolicytermName() {
    return this.getHostURL() + "Employee/GetPaymentPolicytermName";
  }

  GetProjectDetailsByMil() {
    return this.getHostURL() + "Project/GetProjectDetailsByMil";
  }

  GetBadDebtRequestById() {
    return this.getHostURL() + "Project/GetBadDebtRequestById";
  }

  GetInvoiceDebtsById() {
    return this.getHostURL() + "Project/GetInvoiceDebtsById";
  }

  UpdateDraftProformaInv() {
    return this.getHostURL() + "Project/UpdateDraftProformaInv";
  }

  UpdatebadDebtRequestById() {
    return this.getHostURL() + "Project/UpdatebadDebtRequestById";
  }

  AddStageInvoice() {
    return this.getHostURL() + "Project/AddStageInvoice";
  }

  GetStageInvoiceByOrgId() {
    return this.getHostURL() + "Project/GetStageInvoiceByOrgId";
  }

  GetRevenuePaymentOrgId() {
    return this.getHostURL() + "Project/GetRevenuePaymentOrgId";
  }

  GetOpenbalProjects() {
    return this.getHostURL() + "Project/GetOpenbalProjects";
  }

  AddProjectOpenBalance() {
    return this.getHostURL() + "Project/AddProjectOpenBalance";
  }

  GetReceivePByOrgId() {
    return this.getHostURL() + "Project/GetReceivePByOrgId";
  }

  GetReceivePByProjectID() {
    return this.getHostURL() + "Project/GetReceivePByProjectID";
  }

  GetCustomerBalance() {
    return this.getHostURL() + "Project/GetCustomerBalance";
  }

  UpdateDraftProformaStsInv() {
    return this.getHostURL() + "Project/UpdateDraftProformaStsInv";
  }

  AddRevenuePayment() {
    return this.getHostURL() + "Project/AddRevenuePayment";
  }

  UpdateAccIdInPrjct() {
    return this.getHostURL() + "Project/UpdateAccIdInPrjct";
  }

  GetAllProjectsByOrgId() {
    return this.getHostURL() + "Project/GetAllProjectsByOrgId";
  }

  GetWorkForceTeamsByOrgId() {
    return this.getHostURL() + "Workforce/GetWorkForceTeamsByOrgId";
  }

  AddWorkForceTeams() {
    return this.getHostURL() + "Workforce/AddWorkForceTeams";
  }

  UpdateWorkforceTeam() {
    return this.getHostURL() + "Workforce/UpdateWorkforceTeam";
  }

  GetWorkForceTeamLead() {
    return this.getHostURL() + "Workforce/GetWorkForceTeamLead";
  }

  GetWorkForceTeamsById() {
    return this.getHostURL() + "Workforce/GetWorkForceTeamsById";
  }

  GetAllProjectRevenueByWrfcId() {
    return this.getHostURL() + "Finance/GetAllProjectRevenueByWrfcId";
  }

  EmployeeSummaryByWrkfcId() {
    return this.getHostURL() + "Finance/EmployeeSummaryByWrkfcId";
  }

  EmployeeProductvityByWrfcId() {
    return this.getHostURL() + "Finance/EmployeeProductvityByWrfcId";
  }

  AddPaymentPolicyByName() {
    return this.getHostURL() + "Employee/AddPaymentPolicyByName";
  }

  AddClaimInvoicesByOrgIdAndProject() {
    return this.getHostURL() + "Timesheet/AddClaimInvoicesByOrgIdAndProject";
  }

  AddInvoiceDiscount() {
    return this.getHostURL() + "Employee/AddInvoiceDiscount";
  }

  AddFullPaymentInClaim() {
    // return this.getHostURL() + "Project/AddConFullPaymentInClaim"; this is deprecated
    return this.getHostURL() + "Project/AddAdvancePaymentToRevenueByOrgId";
  }

  AddCommisiontoClaim() {
    return this.getHostURL() + "Project/AddCommisiontoClaim";
  }

  GetPendingProforma() {
    return this.getHostURL() + "Project/GetPendingProforma";
  }

  GetAddInoviceDiscountbyApproverId() {
    return this.getHostURL() + "Employee/GetAddInoviceDiscountbyApproverId";
  }

  UpdateInvoiceDicountByID() {
    return this.getHostURL() + "Employee/UpdateInvoiceDicountByID";
  }

  GetAddInoviceDiscountById() {
    return this.getHostURL() + "Employee/GetAddInoviceDiscountById";
  }

  GetStageInvoiceById() {
    return this.getHostURL() + "Project/GetStageInvoiceById";
  }

  FetchPaymentPolicyById() {
    return this.getHostURL() + "Employee/FetchPaymentPolicyById";
  }

  AddReceivePayment() {
    return this.getHostURL() + "Project/AddReceivePayment";
  }

  UpdateAmtClimInvoice() {
    return this.getHostURL() + "Project/UpdateAmtClimInvoice";
  }

  UpdateAmtBalInvoice() {
    return this.getHostURL() + "Project/UpdateAmtBalInvoice";
  }

  AddCustomerCredit() {
    return this.getHostURL() + "Project/AddCustomerCredit";
  }

  ValidateAdvanceInvoice() {
    return this.getHostURL() + "Project/ValidateAdvanceInvoice";
  }

  GetCommissionServiceByProjId() {
    return this.getHostURL() + "Project/GetCommissionServiceByProjId";
  }

  GetCommissionServiceByComId() {
    return this.getHostURL() + "Project/GetCommissionServiceByComId";
  }

  GetCommissionVendorsById() {
    return this.getHostURL() + "Project/GetCommissionVendorsById";
  }

  FetchCommissionPolicyByIdAndDate() {
    return this.getHostURL() + "Employee/FetchCommissionPolicyByIdAndDate";
  }

  AddSelfClaimProformaInvoice() {
    return this.getHostURL() + "Project/AddSelfClaimProformaInvoice";
  }

  GetInvoicesByCustPhone() {
    return this.getHostURL() + "Project/GetInvoicesByCustPhone";
  }

  GetProformaInvoiceByCstId() {
    return this.getHostURL() + "Project/GetProformaInvoiceByCstId";
  }

  GetDraftProformaInvoiceByList() {
    return this.getHostURL() + "Project/GetDraftProformaInvoiceByList";
  }

  UpdateEmployeeExtensionByempId() {
    return this.getHostURL() + "Employee/UpdateEmployeeExtensionByempId";
  }

  AddEmployeeExtention() {
    return this.getHostURL() + "Employee/AddEmployeeExtention";
  }

  GetEmployeeExtensionByempId() {
    return this.getHostURL() + "Employee/GetEmployeeExtensionByempId";
  }
  GetEmployeeBankDetailsByorgId() {
    return this.getHostURL() + "Employee/GetEmployeeBankDetailsByorgId";
  }

  NewAddCostProject() {
    return this.getHostURL() + "Cost/NewAddCostProject";
  }

  GetProjectEstimationService() {
    return this.getHostURL() + "Cost/GetProjectEstimationService";
  }

  GetCostInflatorbyServiceById() {
    return this.getHostURL() + "Cost/GetContractTypeCostInflatorByServiceId";
  }

  GetStaticTasksByEstimationId() {
    return this.getHostURL() + "Cost/GetStaticTasksByEstimationId";
  }

  GetWrappedMilestoneByService() {
    return this.getHostURL() + "Cost/GetWrappedMilestoneByService";
  }

  ProjectEstimationService() {
    return this.getHostURL() + "Cost/ProjectEstimationService";
  }

  NewUpdateCostProject() {
    return this.getHostURL() + "Cost/NewUpdateCostProject";
  }

  NewAddProjectTask() {
    return this.getHostURL() + "Cost/NewAddProjectTask";
  }

  FetchPaymentPolicyByServiceId() {
    return this.getHostURL() + "Employee/FetchPaymentPolicyByServiceId";
  }

  AddCostInfltr() {
    return this.getHostURL() + "Cost/AddContractTypeCostInflator";
  }

  UpdateCostInfltr() {
    return this.getHostURL() + "Cost/UpdateContractTypeCostInflator";
  }

  NewUpdateEstimationService() {
    return this.getHostURL() + "Cost/NewUpdateEstimationService";
  }

  GetProjectStatusOpen() {
    return this.getHostURL() + "Project/GetProjectStatusOpen";
  }

  GetMilestonDataNoActivities() {
    return this.getHostURL() + "Project/GetMilestonDataNoActivities";
  }

  ReunAssignEmployeeTaskByMilestoneID() {
    return this.getHostURL() + "Project/ReunAssignEmployeeTaskByMilestoneID";
  }

  ReUnAssignEmployeeTaskByProjectID() {
    return this.getHostURL() + "Project/ReUnAssignEmployeeTaskByProjectID";
  }

  GetProjectAddtionalDetailsByCstId() {
    return this.getHostURL() + "Project/GetProjectAddtionalDetailsByCstId";
  }

  UpdateProjectAdditionalDetails() {
    return this.getHostURL() + "Project/UpdateProjectAdditionalDetails";
  }

  AddProjectAdditionalDetails() {
    return this.getHostURL() + "Project/AddProjectAdditionalDetails";
  }

  GetLastAddedExtraProjectPrefixByOrgID() {
    return this.getHostURL() + "Project/GetLastAddedExtraProjectPrefixByOrgID";
  }

  GelstPrjtExtraPrfxNoExt() {
    return this.getHostURL() + "Project/GelstPrjtExtraPrfxNoExt";
  }

  updateProjectPreficoveeride() {
    return this.getHostURL() + "Project/UpdateProjectPrefixOvrFlag";
  }

  CheckprojectprefixExist() {
    return this.getHostURL() + "Project/CheckprojectprefixExist";
  }
  GetProjectAddtionalDetailsByPrjId() {
    return this.getHostURL() + "Project/GetProjectAddtionalDetailsByPrjtId";
  }

  EmployeeSummaryReportByRangeOrgId() {
    return this.getHostURL() + "Employee/EmployeeSummaryReportByRangeOrgId";
  }

  GetWorkForceMileStoneData() {
    return this.getHostURL() + "Project/GetWorkForceMileStoneData";
  }

  AddAsset() {
    return this.getHostURL() + "Asset/AddAsset";
  }
  addAssetHistoryByID() {
    return this.getHostURL() + "Asset/addAssetHistoryByID";
  }

  getAssetHistoryByOrgId() {
    return this.getHostURL() + "Asset/getAssetHistoryByOrgId"
  }

  getAssetbyOrgId() {
    return this.getHostURL() + "Asset/getAssetbyOrgId";
  }

  DeleteAsset() {
    return this.getHostURL() + "Asset/DeleteAsset";
  }

  UpdateAssetByID() {
    return this.getHostURL() + "Asset/UpdateAssetByID";
  }

  GetAssetTypeByOrgId() {
    return this.getHostURL() + "Asset/GetAssetTypeByOrgId";
  }

  UpdateAssetTypeById() {
    return this.getHostURL() + "Asset/UpdateAssetTypeById";
  }

  AddAssetType() {
    return this.getHostURL() + "Asset/AddAssetType";
  }

  AddAssetStatus() {
    return this.getHostURL() + "Asset/AddAssetStatus";
  }

  UpdateAssetStatusById() {
    return this.getHostURL() + "Asset/UpdateAssetStatusById";
  }

  GetAssetStatusByOrgId() {
    return this.getHostURL() + "Asset/GetAssetStatusByOrgId";
  }

  AddAssetCategory() {
    return this.getHostURL() + "Asset/AddAssetCategory";
  }

  UpdateAssetCategoryById() {
    return this.getHostURL() + "Asset/UpdateAssetCategoryById";
  }

  GetAssetCategoryByOrgId() {
    return this.getHostURL() + "Asset/GetAssetCategoryByOrgId";
  }

  GetReimbData() {
    return this.getHostURL() + "Payroll/GetReimbData";
  }

  GetRepairData() {
    return this.getHostURL() + "Payroll/GetRepairData";
  }

  generateMaintenanceReimb() {
    return this.getHostURL() + "Payroll/generateMaintenanceReimb";
  }

  generateRepairReimb() {
    return this.getHostURL() + "Payroll/generateRepairReimb"
  }

  GetMaintenanceHistory() {
    return this.getHostURL() + "Asset/GetMaintenanceHistory";
  }
  GetRepairHistory() {
    return this.getHostURL() + "Asset/GetRepairHistory";
  }


  AddMaintenanceHistory() {
    return this.getHostURL() + "Asset/AddMaintenanceHistory";
  }

  AddRepairHistory() {
    return this.getHostURL() + "Asset/AddRepairHistory";
  }
  AddAssetAssignHistory() {
    return this.getHostURL() + "Asset/AddAssignHistory";
  }

  GetAssetAssignHistory() {
    return this.getHostURL() + "Asset/GetAssignHistory";
  }

  // generateMaintenanceReimb() {
  //   return this.getHostURL() + "Payroll/generateMaintenanceReimb";
  // }


  AddProjectClosingTsk() {
    return this.getHostURL() + "Project/AddProjectClosingSteps";
  }

  UpdateProjectClosingTsk() {
    return this.getHostURL() + "Project/UpdateProjectClosingStepsbyOrgId";
  }

  GetAllClosingStepsByOrg() {
    return this.getHostURL() + "Project/GetProjectClosingStepsbyOrgId";
  }

  AddRequestForceClosure() {
    return this.getHostURL() + "Project/AddGenericApprovalRequest";
  }

  GetForceClosureRequest() {
    return this.getHostURL() + "Project/GetGenericApprovalRequestByOrgId";
  }

  UpdateForceClosureRequest() {
    return this.getHostURL() + "Project/UpdateGenericApprovalRequest";
  }

  AddProjectClosureTasks() {
    return this.getHostURL() + "Project/AddProjectClosureTasks";
  }

  GetProjectClosureTaskByProjectId() {
    return this.getHostURL() + "Project/GetProjectClosureTaskByProjectId";
  }

  UpdateProjectClosureTaskByTaskID() {
    return this.getHostURL() + "Project/UpdateClosureTskById";
  }

  UpdateClosureEmpTskById() {
    return this.getHostURL() + "Project/UpdateClosureEmpTskById";
  }

  UpdateClosureAprvTskById() {
    return this.getHostURL() + "Project/UpdateClosureAprvTskById";
  }

  UndoProjectClosureTsk() {
    return this.getHostURL() + "Project/UndoProjectClosureTsk";
  }

  ValidateInvoicesRaised() {
    return this.getHostURL() + "Project/ValidateInvoicesCreated";
  }

  ValidatePaymentTerm() {
    return this.getHostURL() + "Project/ValidatePaymentTerm";
  }

  RemoveAsset() {
    return this.getHostURL() + "Asset/RemoveAsset";
  }

  GetAllEmployeeDetailsOverrideByOrgID() {
    return this.getHostURL() + "Employee/GetAllEmployeeDetailsOverrideByOrgID";
  }

  getWorkingHrsByEmpId() {
    return this.getHostURL() + "Workinghrs/getWorkingHrsByEmpId";
  }

  AddDraftEmployeeOverride() {
    return this.getHostURL() + "Employee/AddDraftEmployeeOverride";
  }

  RemoveOverrideDetailsById() {
    return this.getHostURL() + "Employee/RemoveOverrideDetailsById";
  }

  UpdateEmployeeFromDraft() {
    return this.getHostURL() + "Employee/UpdateEmployeeFromDraft";
  }

  sendEmpEdtAprReq() {
    return this.getHostURL() + "Employee/sendEmpEdtAprReq";
  }

  getDashBoardTeamMemberDataByOrgId() {
    return this.getHostURL() + "Employee/getDashBoardTeamMemberDataByOrgId";
  }

  UpdateDocById() {
    return this.getHostURL() + "Document/UpdateDocById";
  }

  GetLastempcodeByOrgId() {
    return this.getHostURL() + "Employee/GetLastempcodeByOrgId";
  }

  getSalaryDetailsByOrgId() {
    return this.getHostURL() + "Employee/getSalaryDetailsByOrgId";
  }

  //Force Check IN
  UpdateForceCheckInRequest() {
    return this.getHostURL() + "Timesheet/UpdateForceCheckInRequest";
  }

  GetFaceRecDetailsById() {
    return this.getHostURL() + "Employee/GetMobileAppEventsByEmpId";
  }

  GetCheckinDetailsbyId() {
    return this.getHostURL() + "Timesheet/GetCheckinDetailsById";
  }

  GetForceCheckinRequestById() {
    return this.getHostURL() + "Timesheet/GetForceCheckInRequestbyID";
  }

  GetForceCheckinRequestByOrgId() {
    return this.getHostURL() + "Timesheet/GetForceCheckInRequest";
  }

  getRoleNameByroleID() {
    return this.getHostURL() + "Employee/getRoleNameByroleID";
  }

  UpdateApprovalInDraftById() {
    return this.getHostURL() + "Employee/UpdateApprovalInDraftById";
  }

  GetEmpUpdateHistoryByEmpId() {
    return this.getHostURL() + "Employee/GetEmpUpdateHistoryByEmpId";
  }

  GetLeaveRelatedNotificationByReffId() {
    return this.getHostURL() + "Employee/GetLeaveRelatedNotificationByReffId";
  }

  getEmployeeByID() {
    return this.getHostURL() + "Employee/getEmployeeByID";
  }

  getEmployeeEditHistoryByEmpId() {
    return this.getHostURL() + "Employee/getEmployeeEditHistoryByEmpId";
  }

  GetEmployeeDraftdelailsByID() {
    return this.getHostURL() + "Employee/GetEmployeeDraftdelailsByID";
  }
  generateTravelClaim() {
    return this.getHostURL() + "Payroll/generateTravelClaim";
  }
  AddTravelDisputeData() {
    return this.getHostURL() + "Payroll/AddTravelDisputeData";
  }
  AddFinalSettlement() {
    return this.getHostURL() + "Payroll/AddFinalSettlement";
  }
  UpdateTravelDisputeData() {
    return this.getHostURL() + "Payroll/UpdateTravelDisputeData";
  }
  GetFinalSettlementByEmpId() {
    return this.getHostURL() + "Payroll/GetFinalSettlementByEmpId";
  }

  GetTravelDisputeByEmpId() {
    return this.getHostURL() + "Payroll/GetTravelDisputeByEmpId";
  }
  GetTravelClaimByEmpId() {
    return this.getHostURL() + "Payroll/GetTravelClaimByEmpId";
  }
  GetTravelClaimByOrgId() {
    return this.getHostURL() + "Payroll/GetTravelClaimByOrgId";
  }
  GetTravelDisputeByOrgId() {
    return this.getHostURL() + "Payroll/GetTravelDisputeByOrgId";
  }
  GetLastAddedTravelClaimByVehicleNumber() {
    return this.getHostURL() + "Payroll/GetLastAddedTravelClaimByVehicleNumber";
  }
  GetLastAddedAdjustmentPrefixByOrgID() {
    return this.getHostURL() + "Payroll/GetLastAddedAdjustmentPrefixByOrgID";
  }
  GetLastAddedWorkExpensesPrefixByOrgID() {
    return this.getHostURL() + "Payroll/GetLastAddedWorkExpensesPrefixByOrgID";
  }

  GetTravelClaimByClaimId() {
    return this.getHostURL() + "Payroll/GetTravelClaimByClaimId";
  }
  AddPayrollSetting() {
    return this.getHostURL() + "Payroll/AddPayrollSetting";
  }

  AddPayrollAdjustments() {
    return this.getHostURL() + "Payroll/AddPayrollAdjustments";
  }

  AddPayrollVariablePay() {
    return this.getHostURL() + "Payroll/AddPayrollVariablePay";
  }

  AddPayrollWorkExpenses() {
    return this.getHostURL() + "Payroll/AddPayrollWorkExpenses";
  }

  AddPayrollLoanPayments() {
    return this.getHostURL() + "Payroll/AddPayrollLoanPayments";
  }

  GetPayrollAdjustmentByOrgId() {
    return this.getHostURL() + "Payroll/GetPayrollAdjustmentByOrgId";
  }

  GetPayrollVariablePayByOrgId() {
    return this.getHostURL() + "Payroll/GetPayrollVariablePayByOrgId";
  }

  GetPayrollWorkExpensesByOrgId() {
    return this.getHostURL() + "Payroll/GetPayrollWorkExpensesByOrgId";
  }

  GetPayrollLoanPaymentsByOrgId() {
    return this.getHostURL() + "Payroll/GetPayrollLoanPaymentsByOrgId";
  }

  GetPayrollAdjustmentByEmpId() {
    return this.getHostURL() + "Payroll/GetPayrollAdjustmentByEmpId";
  }

  GetPayrollVariablePayByEmpId() {
    return this.getHostURL() + "Payroll/GetPayrollVariablePayByEmpId";
  }

  GetPayrollWorkExpensesyByEmpId() {
    return this.getHostURL() + "Payroll/GetPayrollWorkExpensesyByEmpId";
  }

  GetPayrollLoanPaymentsByEmpId() {
    return this.getHostURL() + "Payroll/GetPayrollLoanPaymentsByEmpId";
  }

  UpdatePayrollAdjustmentByItemID() {
    return this.getHostURL() + "Payroll/UpdatePayrollAdjustmentByItemID";
  }

  UpdatePayrollVariablePayByItemID() {
    return this.getHostURL() + "Payroll/UpdatePayrollVariablePayByItemID";
  }

  UpdatePayrollWorkExpensesByItemID() {
    return this.getHostURL() + "Payroll/UpdatePayrollWorkExpensesByItemID";
  }

  UpdatePayrollLoanPaymentsByItemID() {
    return this.getHostURL() + "Payroll/UpdatePayrollLoanPaymentsByItemID";
  }

  getActiveEmployeeListByOrgID() {
    return this.getHostURL() + "Payroll/getActiveEmployeeListByOrgID";
  }

  generatePayTableByOrgID() {
    return this.getHostURL() + "Payroll/generatePayTableByOrgID";
  }

  getActivePayrollMonthDetailsByOrgId() {
    return this.getHostURL() + "Payroll/getActivePayrollMonthDetailsByOrgId";
  }

  getLastUnpaidPayrollMonthDetailsByOrgId() {
    return (
      this.getHostURL() + "Payroll/getLastUnpaidPayrollMonthDetailsByOrgId"
    );
  }
  GetPayrollWaiveoffByEmpId() {
    return this.getHostURL() + "Payroll/GetPayrollWaiveoffByEmpId";
  }

  //Payment Vouchers
  AddPaymentVoucherDetails() {
    return this.getHostURL() + "PaymentVoucher/AddPaymentVoucherDetails";
  }
  AddPaymentVoucherDetailsCommon() {
    return this.getHostURL() + "PaymentVoucher/AddPaymentVoucherDetailsCommon";
  }
  UpdatePaymentVoucherAprovalDetailsByID() {
    return this.getHostURL() + "PaymentVoucher/UpdatePaymentVoucherAprovalDetailsByID";
  }
  GetLastAddedVoucherPrefixByOrgID() {
    return (
      this.getHostURL() + "PaymentVoucher/GetLastAddedVoucherPrefixByOrgID"
    );
  }
  UpdatePaymentVoucherDetailsByID() {
    return this.getHostURL() + "PaymentVoucher/UpdatePaymentVoucherDetailsByID";
  }
  MarkPaymentVoucherAsPaidByID() {
    return this.getHostURL() + "PaymentVoucher/MarkPaymentVoucherAsPaidByID";
  }
  DeletePaymentVoucherById() {
    return this.getHostURL() + "PaymentVoucher/DeletePaymentVoucherById";
  }

  GetPaymentVouchersByPayrollId() {
    return this.getHostURL() + "PaymentVoucher/GetPaymentVouchersByPayrollId";
  }
  GetPaymentVouchersByOrgId() {
    return this.getHostURL() + "PaymentVoucher/GetPaymentVouchersByOrgId";
  }

  GetPaymentVouchersPaymentsByOrgId() {
    return this.getHostURL() + "PaymentVoucher/GetPaymentVouchersPaymentsByOrgId";
  }
  //
  AddPaymentModeDetails() {
    return this.getHostURL() + "PaymentVoucher/AddPaymentModeDetails";
  }
  UpdatePaymentModeDetailsByID() {
    return this.getHostURL() + "PaymentVoucher/UpdatePaymentModeDetailsByID";
  }
  DeletePaymentModeDetailsById() {
    return this.getHostURL() + "PaymentVoucher/DeletePaymentModeDetailsById";
  }

  GetPaymentModeDetailsByMode() {
    return this.getHostURL() + "PaymentVoucher/GetPaymentModeDetailsByMode";
  }

  GetCommonPaymentModeDetailsByMode() {
    return (
      this.getHostURL() + "PaymentVoucher/GetCommonPaymentModeDetailsByMode"
    );
  }

  UpdateRevenueAdjustment() {
    return this.getHostURL() + "Project/UpdateRevenueAdjustment";
  }

  AddHistoryRevenuePayment() {
    return this.getHostURL() + "Project/AddHistoryRevenuePayment";
  }

  CheckAttendenceExpInRangebyOrgId() {
    return (
      this.getHostURL() + "AdminDashboard/CheckAttendenceExpInRangebyOrgId"
    );
  }

  GetPayrollSettingByOrgId() {
    return this.getHostURL() + "Payroll/GetPayrollSettingByOrgId";
  }

  UpdatePayrollSetting() {
    return this.getHostURL() + "Payroll/UpdatePayrollSetting";
  }

  runPayrollAutodeduction() {
    return this.getHostURL() + "Payroll/runPayrollAutodeduction";
  }

  EmployeePendingLeaveSummaryById() {
    return this.getHostURL() + "AdminDashboard/EmployeePendingLeaveSummaryById";
  }

  getSalaryHistoryByEmpId() {
    return this.getHostURL() + "Payroll/getSalaryHistoryByEmpId";
  }
  PresentDayDetails() {
    return this.getHostURL() + "AdminDashboard/PresentDayDetails";
  }
  UpdatePayrollDetailsPaymentVoucherById() {
    return this.getHostURL() + "Payroll/UpdatePayrollDetailsPaymentVoucherById";
  }
  UpdatePayrollDetailsHoldById() {
    return this.getHostURL() + "Payroll/UpdatePayrollDetailsHoldById";
  }
  SubmitPayrollById() {
    return this.getHostURL() + "Payroll/SubmitPayrollById";
  }
  getPayrollDetailsByPayrollId() {
    return this.getHostURL() + "Payroll/getPayrollDetailsByPayrollId";
  }
  GetholdPayrollDetailsByEmpId() {
    return this.getHostURL() + "Payroll/GetholdPayrollDetailsByEmpId";
  }

  GetPayrollByOrgId() {
    return this.getHostURL() + "Payroll/GetPayrollByOrgId";
  }
  GetPayrollTimelineById() {
    return this.getHostURL() + "Payroll/GetPayrollTimelineById";
  }

  GetPayrollWaiveoffByPayrollId() {
    return this.getHostURL() + "Payroll/GetPayrollWaiveoffByPayrollId";
  }
  AddPayrollWaiveoff() {
    return this.getHostURL() + "Payroll/AddPayrollWaiveoff";
  }
  UpdatePayrollWaiveoffById() {
    return this.getHostURL() + "Payroll/UpdatePayrollWaiveoffById";
  }

  AddForceCheckInRequest() {
    return this.getHostURL() + "Timesheet/AddForceCheckInRequest";
  }
  // Intfut Services
  AddServiceMainCategory() {
    return this.getHostURL() + "Cost/AddServiceMainCategory";
  }

  UpdateServiceMainCategory() {
    return this.getHostURL() + "Cost/UpdateServiceMainCategory";
  }
  GetServiceMainCategoryByOrgId() {
    return this.getHostURL() + "Cost/GetServiceMainCategoryByOrgId";
  }

  GetServicePrimaryCategoryByMain() {
    return this.getHostURL() + "Cost/GetServicePrimaryCategoryByMain";
  }

  GetServiceSubCategoryByMain() {
    return this.getHostURL() + "Cost/GetServiceSubCategoryByMain";
  }

  AddBuildingType() {
    return this.getHostURL() + "Project/AddBuildingType";
  }

  UpdateBuildingTypeById() {
    return this.getHostURL() + "Project/UpdateBuildingType";
  }

  GetAllBuildingTypesOrgID() {
    return this.getHostURL() + "Project/FetchBuildingType";
  }

  jsonToXlsx() {
    return "https://circles-pro-backend.onrender.com/api-v1/converttoXlsx";
  }
  sendLoginNotification() {
    return "https://circles-pro-backend.onrender.com/api-v1/send-login-notification";
  }
  verifyUserLoginOTP() {
    return "https://circles-pro-backend.onrender.com/api-v1/verifyUserLoginOTP";
  }
  //summary_table_to_xlsx
  convertSummaryJsontoXLSX() {
    return "https://circles-pro-backend.onrender.com/api-v1/convertSummarytoXlsx";
  }
  createInvTemplate() {
    return "https://circles-pro-backend.onrender.com/api-v1/createInvTemplate";
  }
  GetStorageUsage() {
    return "https://circles-pro-backend.onrender.com/api-v1/storage-usage";
    // return "http://localhost:8080/api-v1/storage-usage";
  }

  getJsonFromCsv() {
    return "https://circles-pro-backend.onrender.com/api-v1/convertCSVtoJSON";
    // return "http://localhost:8080/api-v1/convertCSVtoJSON";
  }
  // Intfut Services
  AddIntfut_floor() {
    return this.getHostURL() + "Intfut/AddIntfut_floor";
  }
  AddServiceEstimationTemplate() {
    return this.getHostURL() + "Intfut/AddServiceEstimationTemplate";
  }
  UpdateServiceEstimationTemplateById() {
    return this.getHostURL() + "Intfut/UpdateServiceEstimationTemplateById";
  }
  GetServiceEstimationTemplateByOrgId() {
    return this.getHostURL() + "Intfut/GetServiceEstimationTemplateByOrgId";
  }
  DeleteServiceEstimationTemplateById() {
    return this.getHostURL() + "Intfut/DeleteServiceEstimationTemplateById";
  }
  GetIntfutServicesByOrgId() {
    return this.getHostURL() + "Intfut/GetIntfutServicesByOrgId";
  }

  GetintfutFloorById() {
    return this.getHostURL() + "Intfut/GetintfutFloorById";
  }
  UpdateIntfutFloorById() {
    return this.getHostURL() + "Intfut/UpdateIntfutFloorById";
  }
  AddIntfutEstSummary() {
    return this.getHostURL() + "Intfut/AddIntfutEstSummary";
  }
  GetIntfutEstSummary() {
    return this.getHostURL() + "Intfut/GetIntfutEstSummary";
  }

  AddIntfutBOQ() {
    return this.getHostURL() + "Intfut/AddIntfutBOQ";
  }
  GetInfutBOQByProjectId() {
    return this.getHostURL() + "Intfut/GetInfutBOQByProjectId";
  }
  AddProjectService() {
    return this.getHostURL() + "Intfut/AddProjectService";
  }

  GetProjectServicebyID() {
    return this.getHostURL() + "Intfut/GetProjectServicebyID";
  }
  DeleteProjectServicebyID() {
    return this.getHostURL() + "Intfut/DeleteProjectServicebyID";
  }
  GetboqcustablebyID() {
    return this.getHostURL() + "Intfut/GetboqcustablebyID";
  }
  UpdateProjectServiceCatListbyID() {
    return this.getHostURL() + "Intfut/UpdateProjectServiceCatListbyID";
  }
  Addboqcustable() {
    return this.getHostURL() + "Intfut/Addboqcustable";
  }
  UpdateProjectServiceById() {
    return this.getHostURL() + "Intfut/UpdateProjectServiceById";
  }

  // Inventory
  AddinventoryItem() {
    return this.getHostURL() + "Inventory/AddInventoryItem";
  }
  AddInventoryBulkItems() {
    return this.getHostURL() + "Inventory/AddinventoryBulkItems";
  }
  GetInventoryByOrgId() {
    return this.getHostURL() + "Inventory/GetInventoryByOrgId";
  }
  DeleteInventoryByItemId() {
    return this.getHostURL() + "Inventory/DeleteInventoryByItemId";
  }

  GetInventoryByItemId() {
    return this.getHostURL() + "Inventory/GetInventoryByItemId";
  }
  GetInventoryVendorData() {
    return this.getHostURL() + "Inventory/GetInventoryVendorData";
  }
  UpdateInventoryItemByID() {
    return this.getHostURL() + "Inventory/UpdateInventoryItemByID";
  }
  GetInventoryByCategory() {
    return this.getHostURL() + "Inventory/GetInventoryByCategory";
  }
  AddInventoryUnit() {
    return this.getHostURL() + "Inventory/AddInventoryUnitType";
  }
  AddInventoryTag() {
    return this.getHostURL() + "Inventory/AddInventoryTag";
  }

  GetInventoryUnitByOrgId() {
    return this.getHostURL() + "Inventory/GetInventoryUnitByOrgId";
  }
  UpdateInventoryUnitByID() {
    return this.getHostURL() + "Inventory/UpdateInventoryUnitByID";
  }
  GetInventoryTagByOrgId() {
    return this.getHostURL() + "Inventory/GetInventoryTagByOrgId";
  }

  CheckDelegateExisting() {
    return this.getHostURL() + "Delegation/CheckDelegateExisting";
  }

  AddDelegateDetails() {
    return this.getHostURL() + "Delegation/AddDelegateDetails";
  }

  AddAttendenceExp() {
    return this.getHostURL() + "Timesheet/AddAttendenceExp";
  }

  UpdateAttendenceExp() {
    return this.getHostURL() + "Timesheet/UpdateAttendenceExp";
  }

  GetAttExceptionOrgId() {
    return this.getHostURL() + "Timesheet/GetAttExceptionOrgId";
  }

  GetAutoDeductionbyEmpIdDate() {
    return this.getHostURL() + "Payroll/GetAutoDeductionbyEmpIdDate";
  }

  ListExtraWorkDays() {
    return this.getHostURL() + "Timesheet/ListExtraWorkDays";
  }

  getWorkingHrsbyOrgId() {
    return this.getHostURL() + "Workinghrs/getWorkingHrsbyOrgId";
  }

  UpdateWorkingHrs() {
    return this.getHostURL() + "Workinghrs/UpdateWorkingHrs";
  }

  AddWorkingHrs() {
    return this.getHostURL() + "Workinghrs/AddWorkingHrs";
  }

  CalculateFinalSettlement() {
    return this.getHostURL() + "Payroll/CalculateFinalSettlement";
  }
  GetTravelSettingByOrgId() {
    return this.getHostURL() + "Payroll/GetTravelSettingByOrgId";
  }
  GetTravelSettingHistoryByTypeandOrgId() {
    return this.getHostURL() + "Payroll/GetTravelSettingHistoryByTypeandOrgId";
  }
  AddTravelSettings() {
    return this.getHostURL() + "Payroll/AddTravelSettings";
  }
  deleteTravelSettings() {
    return this.getHostURL() + "Payroll/deleteTravelSettings";
  }
  UpdateTravelSettings() {
    return this.getHostURL() + "Payroll/UpdateTravelSettings";
  }
  GetLastAddedTravelClaimPrefixByOrgID() {
    return this.getHostURL() + "Payroll/GetLastAddedTravelClaimPrefixByOrgID";
  }
  AddFuelStationBrand() {
    return this.getHostURL() + "Payroll/AddFuelStationBrand";
  }
  UpdateFuelStationBrand() {
    return this.getHostURL() + "Payroll/UpdateFuelStationBrand";
  }
  GetFuelStationBrandsByOrgId() {
    return this.getHostURL() + "Payroll/GetFuelStationBrandsByOrgId";
  }
  DeleteFuelStationBrand() {
    return this.getHostURL() + "Payroll/DeleteFuelStationBrand";
  }
  GetTravelVehicleConfigByOrgId() {
    return this.getHostURL() + "Payroll/GetTravelVehicleConfigByOrgId";
  }
  UpdateTravelVehicleConfig() {
    return this.getHostURL() + "Payroll/UpdateTravelVehicleConfig";
  }
  AddTravelVehicleConfig() {
    return this.getHostURL() + "Payroll/AddTravelVehicleConfig";
  }



}
