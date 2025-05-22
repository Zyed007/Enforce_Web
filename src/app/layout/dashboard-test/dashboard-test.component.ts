import { Component, OnInit, ViewChild} from "@angular/core";
import { AdminSettingService } from "./../../services/admin-setting.service";
import { LeaveService } from "../../services/leave.service";
import { ToolbarItems } from "@syncfusion/ej2-angular-grids";
import { Router } from '@angular/router';
import { ModuleSetupService } from "./../../services/moduleSetup.service";
import { EmployeeService } from "../../services/employee.service";
import { PayrollService } from "../../services/payroll.service";
import { NgxSpinnerService } from "ngx-spinner";
import moment = require('moment');
import {
    TabComponent,
  } from "@syncfusion/ej2-angular-navigations";
import { Item } from "angular2-multiselect-dropdown";
import { interpolateMagma } from "d3-scale-chromatic";
import { nonFunctionArgSeparator } from "html2canvas/dist/types/css/syntax/parser";
import { UserService } from '../../services/user.service';
import * as _ from "lodash";
import { Console } from "console";

@Component({
    selector: 'app-dashboard-test',
    templateUrl: './dashboard-test.component.html',
    styleUrls: ['./dashboard-test.component.scss'],
})

export class DashboardTestComponent implements OnInit {
    @ViewChild("tabObj", { static: false }) public tabObj: TabComponent;
    orgID = localStorage.getItem("org_id");
    userInfo: any = JSON.parse(localStorage.getItem("user_info"));

    constructor(
        public AdminSettingService: AdminSettingService,
        private leaveService: LeaveService,
        private router: Router,
        public ModuleSetupService: ModuleSetupService,
        public empService: EmployeeService,
        private payrollService: PayrollService,
        private spinner: NgxSpinnerService,
        private userService:UserService
    ) {
        // Constructor implementation
    }

    async ngOnInit() {

        // setTimeout(() => {
        //   this.spinner.show()
        // },3000)

        await this.getUnreadLeaveNotification();
        this.employeeGridToolItems = ["Search"];
        await this.GetPayrollByOrgId();
        await this.getList();

        await this.GetAccessRightsbyRole()

    }
    viewDashboard = false;
    commonModuleName;
    GetAccessRightsbyRole(){
      this.isLoading = true;
        let user_info = JSON.parse(localStorage.getItem('user_info'));
        let postData = {
          id : user_info.role_id
        }
        if(user_info.is_superadmin){
          this.viewDashboard = true;
        }else{
          this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
            data.map((item) => {
              item.module_name = item.module_name.replace(/\s+/g, '');
              console.log(item.module_name, "module name")
              return item;
            });
            this.commonModuleName = _.groupBy(data, 'module_name')
            console.log('Justin', this.commonModuleName)
            if(this.commonModuleName.DashboardTest){
              this.commonModuleName.DashboardTest
              .map((elm) => {
                if(elm.section_name === 'View' && elm.is_allow === true){
                  this.viewDashboard = true;
                }else{
                  this.viewDashboard = false;
                }
              });
              console.log('Justin2', this.viewDashboard)
            }else{
              this.viewDashboard = false;
            }
          });
        }
        this.isLoading = false;
      }

    dashItems= ["Leave", "Attendance Override", "Human Resource", "Payroll", "Adjustments"]
    leaveItems = ["New Leave Request"]
    overwriteItems =  ["check In check Out Overwrite Request"]
    hrItems = ["Creating Employee Details", "Updating Employee Details", "Deleting Employee Details"]
    payrollItems = ["Payroll"]
    adjustmentItems = ["Absence", "Advance", "Arrear Adjustment", "Leave Salary", "Loan", "Fine"]
    dashhead;
    newData: any = []
    leaveHistory: any  = []
    assignedLeavesToEmpData: any;
    applyLeaveModel = false;
    isLoading = false;
    isPendingLoading =false;
    isPayrollLoading = false;
    isHRLoading = false;
    unReadOverrideData: any = []
    pendingAprCount = 0;
    aprovedAprCount = 0;
    declineAprCount = 0;
    myRequestedEmp;
    unReadDetailsUpdate: any = [];
    unReadDetailsCreate: any = [];
    unReadDetailsDelete: any = [];
    payrollListing = [];
    pendingPayrollCount = 0;
    pendingAdjustmentCount = 0;
    filteredPayroll = [];
    payrollList = false;
    absenceList = [];
    advanceList = [];
    arrearList = [];
    leaveSalaryList = [];
    loanList = [];
    fineList = [];
    async getUnreadLeaveNotification() {
        this.spinner.show();
        this.isHRLoading = true;
        this.isLoading = true;
        const postData = {
            orgID: this.orgID,
            empID: this.userInfo.id,
          };

        const postData1 = {
            orgID:  this.userInfo.org_id !== null
            ? this.userInfo.org_id
            : localStorage.getItem("org_id"),
            empID: this.userInfo.role_id,
        }

            let unReadData: any = await this.AdminSettingService.GetUnreadLeaveRelatedNotificationsByOrgIDandEmpID(postData).toPromise();

            if(unReadData != null){
              unReadData = unReadData.map((val) =>({
                        ...val,
                        no_of_days : moment().diff(moment(val.created_date), "days") + " Days"
                      }))
            }

            this.unReadOverrideData = unReadData.filter(item => item.message === "Requested Approval for Check In Check Out Overwrite" && !item.read_status )
            console.log(this.unReadOverrideData, "....data ....")
            this.unReadDetailsUpdate = unReadData.filter(item => {
                const isRelevantMessage =
                  item.message === "Requested Approval for Updating Employee Details"

                return isRelevantMessage && !item.read_status;
              });
            this.unReadDetailsCreate = unReadData.filter(item => {
              const isRelevantMessage =
              item.message === "Requested Approval for Creating new Employee"

              return isRelevantMessage && !item.read_status
            })
            this.unReadDetailsDelete = unReadData.filter(item => {
              const isRelevantMessage =
                  item.message === "Requested Approval for Deleting Employee Details";
                  return isRelevantMessage && !item.read_status
            })

            console.log(this.unReadDetailsUpdate, "unReadDetailsUpdate")
            console.log(this.unReadOverrideData, "unReadOverrideData")

            this.leaveHistory = await this.leaveService.GetLeaveRqstbyEmpId(postData1).toPromise();

            const referenceIds = this.leaveHistory.map(item => item.id)


            this.newData = unReadData.filter(item => referenceIds.includes(item.reference_id) && !item.read_status )

            console.log(this.newData)

            console.log(unReadData)
            console.log(this.leaveHistory)

            if(this.newData.length > 0) {
                this.isLoading = false;
                this.spinner.hide();
                this.isHRLoading = false;
            }



    }
    // pendingData: any = []

    // async getRequestStatus() {
    //     try {
    //       let user_info = JSON.parse(localStorage.getItem("user_info"));
    //       let postData = { id: user_info.role_id };

    //       const data: any = await this.empService
    //         .GetEmployeeDetailsOverrideByApproverRoleID(postData)
    //         .toPromise();

    //         console.log(data, "dataaaaaaaaa     ")

    //       if (data && data.length > 0) {
    //         let processData = [];
    //         this.pendingAprCount = 0;
    //         this.aprovedAprCount = 0;
    //         this.declineAprCount = 0;

    //         data.forEach((elm) => {
    //           if (elm.emp_id) {
    //             elm.action = elm.is_emp_deleted ? "Delete" : "Edit";
    //           } else {
    //             elm.action = "Add";
    //           }

    //           elm.aproval_level = elm.approver2_roleId
    //             ? "Dual Approver"
    //             : "Single Approver";

    //           if (elm.approver2_roleId == user_info.role_id) {
    //             if (elm.is_approved1) {
    //               if (elm.update_status === "Approved") {
    //                 this.aprovedAprCount += 1;
    //                 processData.push(elm);
    //               } else if (elm.update_status.includes("Pending")) {
    //                 this.pendingAprCount += 1;
    //                 this.pendingData.push(elm);
    //                 processData.push(elm);
    //               } else if (elm.update_status.includes("decline")) {
    //                 this.declineAprCount += 1;
    //                 processData.push(elm);
    //               }
    //             }
    //           }

    //           if (elm.approver1_roleId == user_info.role_id) {
    //             if (elm.update_status === "Approved" && elm.is_approved1) {
    //               this.aprovedAprCount += 1;
    //               processData.push(elm);
    //             } else if (
    //               elm.update_status.includes("Pending") &&
    //               !elm.is_approved1
    //             ) {
    //               this.pendingAprCount += 1;
    //               processData.push(elm);
    //             } else if (elm.update_status.includes("decline")) {
    //               this.declineAprCount += 1;
    //               processData.push(elm);
    //             }
    //           }
    //         });

    //         this.myRequestedEmp = processData;
    //         console.log(this.pendingData, "penidng Data.....")
    //       }
    //     } catch (error) {
    //       console.error("Error in getRequestStatus:", error);
    //     }
    //   }


    formatMoney(number: any): string {
        // Convert the number to a string


        if (number != null) {
          const numberStr = number.toFixed(2);

          // Split the string into integer and decimal parts
          const [integerPart, decimalPart] = numberStr.split(".");

          // Add commas for the integer part
          const integerWithCommas = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          );

          // Concatenate the integer part with the decimal part and return
          return `${integerWithCommas}.${decimalPart}`;
        } else {
          return `0.00`;
        }
      }

    async GetPayrollByOrgId() {
        this.isLoading = true;
        this.isPayrollLoading = true;
        this.spinner
        try {
          this.payrollListing = [];
          let data: any = await this.payrollService
            .GetPayrollByOrgId({ id: this.orgID })
            .toPromise();

            console.log(data, "payroll data")

          if (data) {
            data.map((item) => {
              item.hold_amount = this.formatMoney(item.hold_amount);
              item.net_payable = this.formatMoney(item.net_payable);
              item.net_deductons = this.formatMoney(item.net_deductons);
              item.net_additions = this.formatMoney(item.net_additions);
            });
          }

          if(data != null){
            data = data.map((val) =>({
                      ...val,
                      no_of_days : moment().diff(moment(val.created_date), "days") + " Days"
                    }))
          }

          this.payrollListing = data;
          if (this.payrollListing.length > 0) {

            this.filteredPayroll = this.payrollListing.filter(
                (item) => item.status === "Pending"
              );
          } else if(this.payrollListing.length <= 0) {
            this.isPayrollLoading = false;
            this.spinner.hide();
            this.isLoading = false;

          }
          this.spinner.hide();
            this.isLoading = false;
            this.isPayrollLoading = false;

        } catch (error) {
          console.error("Error in GetPayrollByOrgId:", error);
        }
      }



      async getList() {
        this.spinner.show();
        this.isLoading = true;
        this.isPendingLoading = true
        this.isHRLoading = true;
        try {



          let rsp: any = await this.payrollService
            .GetPayrollAdjustmentByOrgId({ orgID: this.orgID })
            .toPromise();

            this.spinner.show();
            this.isLoading = true;
            this.isHRLoading = true;
            this.isPendingLoading = true;

           if(rsp != null) {
            rsp = rsp.map((val) =>({
                      ...val,
                      no_of_days : moment().diff(moment(val.created_date), "days") + " Days"
                    }))
           }

          if (rsp) {
            this.absenceList = [];


            rsp.forEach((elm) => {
              elm.amount = parseFloat(elm.amount.toFixed(2));
              elm.amount = this.formatMoney(elm.amount);
                if(elm.status === "Pending" && elm.pay_item === "Absence")
                {
                    this.absenceList.push(elm);
                    this.isLoading = true;
                    this.isPendingLoading = true;

                }
                if(elm.status === "Pending" && elm.pay_item === "Advance")
                {
                    this.advanceList.push(elm);
                    this.isLoading = true;
                    this.isPendingLoading = true;
                }
                if(elm.status === "Pending" && elm.pay_item === "Arrear Adjustment")
                {
                    this.arrearList.push(elm)
                    this.isLoading = true;
                    this.isPendingLoading = true;
                }
                if(elm.status === "Pending" && elm.pay_item === "Leave Salary") {
                    this.leaveSalaryList.push(elm);
                    this.isLoading = true;
                    this.isPendingLoading = true;
                }
                if(elm.status === "Pending" && elm.pay_item === "Loan") {
                    this.loanList.push(elm);
                    this.isLoading = true;
                    this.isPendingLoading = true;
                }
                if(elm.status === "Pending" && elm.pay_item === "Fine") {
                    this.fineList.push(elm);
                    this.isLoading = true;
                    this.isPendingLoading = true;

                }
                if( this.absenceList.length > 0) {
                    this.isPendingLoading = false
                    this.spinner.hide();
                    this.isLoading = false;
                    this.isPendingLoading = true;
                }
                else if (this.absenceList.length <= 0) {
                    this.isPendingLoading = false
                    this.spinner.hide();
                    this.isLoading = false;
                    this.isPendingLoading = false;
                }
                if( this.advanceList.length > 0) {
                  this.isPendingLoading = false
                  this.spinner.hide();
                  this.isLoading = true;
                  this.isPendingLoading = true;
              }
              else if (this.advanceList.length <= 0) {
                  this.isPendingLoading = false
                  this.spinner.hide();
                  this.isLoading = false;
                  this.isPendingLoading = false;
              }
              if( this.arrearList.length > 0) {
                this.isPendingLoading = false
                this.spinner.hide();
                this.isLoading = true;
                this.isPendingLoading = true;
            }
            else if (this.arrearList.length <= 0) {
                this.isPendingLoading = false
                this.spinner.hide();
                this.isLoading = false;
                this.isPendingLoading = false;
            }
            if( this.leaveSalaryList.length > 0) {
              this.isPendingLoading = false
              this.spinner.hide();
              this.isLoading = true;
              this.isPendingLoading = false;
            }
            else if (this.leaveSalaryList.length <= 0) {
              this.isPendingLoading = false
              this.spinner.hide();
              this.isLoading = false;
              this.isPendingLoading = false;
            }
            if( this.loanList.length > 0) {
              this.isPendingLoading = false
              this.spinner.hide();
              this.isLoading = true;
              this.isPendingLoading = true;
            }
            else if (this.loanList.length <= 0) {
              this.isPendingLoading = false
              this.spinner.hide();
              this.isLoading = false;
              this.isPendingLoading = false;
            }
            if( this.fineList.length > 0) {
              this.isPendingLoading = false
              this.spinner.hide();
              this.isLoading = true;
              this.isPendingLoading = true;
            }
            else if (this.fineList.length <= 0) {
              this.isPendingLoading = false
              this.spinner.hide();
              this.isLoading = false;
              this.isPendingLoading = false;
            }

            //console.log(this.advanceList, "payroll adjustments data")

            });
          }

          this.spinner.hide();
          this.isLoading = false;
          this.isHRLoading = false;
          this.isPendingLoading = false;

        } catch (error) {
          console.error("Error fetching payroll adjustments:", error);
        } finally {
            this.spinner.hide();
            this.isLoading = false;
            this.isPendingLoading = false;
            this.isHRLoading = false;
        }

      }



    showLeaveList = false;
    showAbsenceList = false;
    showDashData ;
    showOverData;
    showCreateData
    showUpdateData
    showDeleteData
    showPayrollData
    showAbsenceData
    showAdvanceData
    showArrearAdjustmentData
    showLeaveSalaryData
    showLoanData
    showFineData
    showDashList = false;
    showPendingList = false;
    showCreateList = false;
    showUpdateList = false;
    showDeleteList = false;
    showAdvanceList = false;
    showArrearAdjustment = false;
    showLeaveSalary = false;
    showLoan = false;
    showFine = false;
    leaveClick(data){
      if(this.showLeaveList == true ) {
        this.showLeaveList = false;
        console.log(this.showLeaveList, "showLeaveList")
      } else {

          this.showLeaveList = true;
          // this.showDashList = false;
          // this.payrollList = false;
          // this.showPendingList = false;
          // this.showCreateList = false;
          // this.showUpdateList = false;
          // this.showDeleteList = false;
          this.showDashData = this.newData;
          console.log(this.showDashData)
          this.dashhead = "New Leave Request"
      }
    }

    overClick(data){
      if (this.showDashList == true ) {
        this.showDashList = false;
      } else {

          this.showDashList = true;
          // this.payrollList = false;
          // this.showPendingList = false;
          this.showOverData = this.unReadOverrideData;
          console.log(this.showDashData)
          this.dashhead = "check In check Out Overwrite Request"

      }
    }

    payrollClick(data) {
      if (this.payrollList == true ) {
        this.payrollList = false;
      } else {


          console.log("its clicked....")

          this.payrollList = true;
          // this.showDashList = false;
          // this.showPendingList = false;
          this.showPayrollData = this.filteredPayroll;
          this.dashhead = "Payroll"

      }
    }

    adjustClick(data) {
      if(this.showAbsenceList == true && this.dashhead == data) {
        this.showAbsenceList = false;
      }
      else if (this.showAdvanceList == true && this.dashhead == data){
        this.showAdvanceList = false;
      }
      else if (this.showArrearAdjustment == true && this.dashhead == data){
        this.showArrearAdjustment = false;
      }
      else if (this.showLeaveSalary == true && this.dashhead == data) {
        this.showLeaveSalary = false;
      }
      else if (this.showLoan == true && this.dashhead == data) {
        this.showLoan = false;
      }
      else if (this.showFine == true && this.dashhead == data) {
        this.showFine = false;
      }
      else {
        if(data === "Absence"){
          this.showAbsenceList = true;
          this.showAdvanceList = false;
          this.showArrearAdjustment = false;
          this.showLeaveSalary = false;
          this.showLoan = false;
          this.showFine = false;
          this.showAbsenceData = this.absenceList;
          this.dashhead = "Absence"
        }
        else if(data === "Advance"){
          this.showAdvanceList = true;
          this.showAbsenceList = false;
          this.showArrearAdjustment = false;
          this.showLeaveSalary = false;
          this.showLoan = false;
          this.showFine = false;
          this.showAdvanceData = this.advanceList;
          this.dashhead = "Advance"
        }
        else if (data === "Arrear Adjustment") {
          this.showArrearAdjustment = true;
          this.showAbsenceList = false;
          this.showAdvanceList = false;
          this.showLeaveSalary = false;
          this.showLoan = false;
          this.showFine = false;
          this.showArrearAdjustmentData = this.arrearList;
          this.dashhead = "Arrear Adjustment"
        }
        else if (data === "Leave Salary") {
          this.showLeaveSalary = true;
          this.showAbsenceList = false;
          this.showAdvanceList = false;
          this.showArrearAdjustment = false;
          this.showLoan = false;
          this.showFine = false;
          this.showLeaveSalaryData = this.loanList;
          this.dashhead = "Leave Salary"
        }
        else if (data === "Loan") {
          this.showLoan = true;
          this.showAbsenceList = false;
          this.showAdvanceList = false;
          this.showArrearAdjustment = false;
          this.showLeaveSalary = false;
          this.showFine = false;
          this.showLoanData = this.leaveSalaryList;
          this.dashhead = "Loan"
        }
        else if (data === "Fine") {
          this.showFine = true;
          this.showAbsenceList = false;
          this.showAdvanceList = false;
          this.showArrearAdjustment = false;
          this.showLeaveSalary = false;
          this.showLoan = false;
          this.showFineData = this.fineList;
          console.log(this.fineList, "testing finee...")
          this.dashhead = "Fine"
        }
      }
    }

    cardClick(data){

        if(this.showCreateList == true && this.dashhead == data){
          this.showCreateList = false;
        }
        else if(this.showUpdateList == true && this.dashhead == data){
          this.showUpdateList = false
        }
        else if(this.showDeleteList == true && this.dashhead == data){
          this.showDeleteList = false
        }

      else {
            if (data === "Creating Employee Details") {
                this.showCreateList = true;
                // this.showLeaveList = false;
                // this.showDashList = false;
                // this.payrollList = false;
                // this.showPendingList = false;
                this.showDeleteList = false;
                this.showUpdateList = false;
                this.showCreateData = this.unReadDetailsCreate;
                this.dashhead = "Creating Employee Details"
            }
            else if (data === "Updating Employee Details") {
              this.showUpdateList = true;
              // this.showLeaveList = false;
              // this.showDashList = false;
              // this.payrollList = false;
              // this.showPendingList = false;
              this.showDeleteList = false;
              this.showCreateList = false;
              this.showUpdateData = this.unReadDetailsUpdate;
              this.dashhead = "Updating Employee Details"
          }
          else if (data === "Deleting Employee Details") {
            this.showDeleteList = true;
            // this.showLeaveList = false;
            // this.showDashList = false;
            // this.payrollList = false;
            // this.showPendingList = false;
            this.showCreateList = false;
            this.showUpdateList = false;
            this.showDeleteData = this.unReadDetailsDelete;
            this.dashhead = "Deleting Employee Details"
        }


        }
    }

    closeDashList(header) {
      if(header === "New Leave Request" && this.showLeaveList === true) {
        this.showLeaveList = false;
      }
      else if (header === "check In check Out Overwrite Request" && this.showDashList === true) {
        this.showDashList = false;
      }
      else if (header === "Creating Employee Details" && this.showCreateList === true) {
        this.showCreateList = false;
      } else if (header === "Updating Employee Details" && this.showUpdateList === true) {
        this.showUpdateList = false;
      } else if (header === "Deleting Employee Details" && this.showDeleteList === true) {
        this.showDeleteList = false;
      } else if (header === "Payroll" && this.payrollList === true) {
        this.payrollList = false;
      }  else if (header === "Absence" && this.showAbsenceList === true) {
        this.showAbsenceList = false;
      } else if (header === "Advance" && this.showAdvanceList === true) {
        this.showAdvanceList = false;
      } else if (header === 'Arrear Adjustment' && this.showArrearAdjustment === true) {
        this.showArrearAdjustment = false;
      } else if (header === 'Leave Salary' && this.showLeaveSalary === true) {
        this.showLeaveSalary = false;
      } else if (header === 'Loan' && this.showLoan === true) {
        this.showLoan = false;
      } else if (header === 'Fine' && this.showFine === true) {
        this.showFine = false;
      }

        // this.showDashList = false;
        // this.payrollList = false;
        // this.showPendingList = false;
        // this.showCreateList = false;
        // this.showUpdateList = false;
        // this.showDeleteList = false;
    }


    public employeeGridToolItems: ToolbarItems[];
    applyLeaveDiv = false;
    singleHistory: any = [];
    singleData: any = []
    onBehalfValue:any = [];
    viewEditNotification(notData, message){
        localStorage.setItem("notData", JSON.stringify(notData));
        localStorage.setItem("message", message);
        console.log(notData, "///////")

        this.singleHistory = notData;
        this.singleData = this.leaveHistory.filter(item => item.id === notData.reference_id)

        if(notData.message === "Requested Approval for Updating Employee Details" ||
            notData.message === "Requested Approval for Creating new Employee" ||
            notData.message === "Requested Approval for Deleting Employee Details") {
                this.router.navigate(["/settings-new/team-members"]);
        } else {
            console.log(" error side notData--->", notData);
            this.router.navigate(["/leave-details"]);
        }


    }

    viewPayrollNotification(data) {
        localStorage.setItem("payrollData", JSON.stringify(data));
        this.router.navigate(["/Payroll"]);
    }

    viewAdjustmentsNotification(data) {
        localStorage.setItem("adjustmentsData", JSON.stringify(data));
        this.router.navigate(["/Payroll/adjustments"]);
    }















}
