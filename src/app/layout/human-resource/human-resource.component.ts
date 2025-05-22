import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import moment = require('moment');
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { TimeSheetService } from '../../services/timesheet.service';
import { EmployeeService } from '../../services/employee.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import * as _ from "lodash";
import { Router } from "@angular/router";
import { AdminSettingService } from '../../services/admin-setting.service';
import { LeaveService } from '../../services/leave.service';

declare var $: any;
@Component({
  selector: 'app-human-resource',
  templateUrl: './human-resource.component.html',
  styleUrls: ['./human-resource.component.scss']
})


export class HumanResourceComponent implements OnInit {

  //userRights
  commonModuleName;
  accessToPage = false;

  public invoiceToolbar: ToolbarItems[];
  @ViewChild('hrTableGrid', { static: false }) public hrTableGrid: GridComponent;
  @ViewChild('hrBreakGrid', { static: false }) public hrBreakGrid: GridComponent;
  @ViewChild('hrAttendanceGrid', { static: false }) public hrAttendanceGrid: GridComponent;
  @ViewChild('leaveRequestGrid', { static: false }) public leaveRequestGrid: GridComponent;

  @ViewChild("empTabledataTableGrid", { static: false }) public empTabledataTableGrid: GridComponent;
  isMonthActive: boolean;
  isWeekActive: boolean;
  isTodayActive = true;
  dateRangeForm: FormGroup;

  //dates
  today: Date = new Date(new Date().toDateString());
  maxRangeDateTwo: Date = this.today;
  monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
  monthEnd: Date = this.today;
  lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
  lastEnd: Date = new Date(this.today.getFullYear(), this.today.getMonth(), 0);
  yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
  yearEnd: Date = this.today;
  getStartDate = moment().format('L');
  getEndDate = moment().format('L');
  weekStart = new Date(new Date(new Date().setDate(new Date().getDate() - 7)).toDateString());
  weekEnd = new Date(new Date().toDateString());
  user_info = JSON.parse(localStorage.getItem('user_info'));
  hrAttendanceData;
  storehrAttendanceData;
  getHeaderValue = 'SUMMARY';
  headerText = [
    { text: 'Summary' },
    { text: 'Attendence' },
    { text: 'Leave Requested' },
    {text: 'Pending Leaves'},
    { text: 'Break' }
  ]
  emptext = 'select a Employee'
  employeeList = [];
  public fields: Object = { text: "name", value: "id" };

  hrBreakData

  constructor(
    private spinner: NgxSpinnerService,
    private timesheetService: TimeSheetService,
    private employeeService: EmployeeService,
    private datePipe: DatePipe,
    private userService: UserService,
    public Router: Router,
    private AdminSettingService: AdminSettingService,
    private empService: EmployeeService,
    private leaveService: LeaveService
  ) { }

  ngOnInit() {
    this.invoiceToolbar = ['Search', 'PdfExport', 'ExcelExport'];
    this.summaryToolbar = ['Search', 'ExcelExport']
    this.dateRangeFormInput();
    this.checkUserRights();

    this.dateRangeForm.patchValue({
      dateRange: [this.getStartDate, this.getEndDate],
    });

    this.dateRangeForm.get('dateRange').valueChanges.subscribe(() => {
      this.spinner.show();
      let dateVaue = this.dateRangeForm.get('dateRange').value;
      this.getStartDate = moment(dateVaue[0]).format('L');
      this.getEndDate = moment(dateVaue[1]).format('L');
      this.isMonthActive = false;
      this.isWeekActive = false;
      this.isTodayActive = false;
      this.checkTabApiCall();
    });

    this.checkTabApiCall();
    this.getAllEmployeeByOrgID()
  }

  checkUserRights() {
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let postData = { id: user_info.role_id }

    this.userService.GetAccessRightsbyRole(postData).subscribe((data: any) => {
      data.map((item) => {
        item.module_name = item.module_name.replace(/\s+/g, '');;
        return item;
      });
      this.commonModuleName = _.groupBy(data, 'module_name');
      //settings
      if (this.commonModuleName.HumanResource) {
        this.accessToPage = true;
      } else {
        this.accessToPage = false;
      }
    });

  }

  getAllEmployeeByOrgID() {
    this.employeeService.fetchGridDataEmployeeByOrgID().subscribe((data: any) => {
      if (data.length !== 0) {
        data.map((elm) => {
          this.employeeList.push({
            id: elm.id,
            name: elm.full_name
          })
        })
      }
    });
  }

  getTodaysData() {
    this.spinner.show();
    this.isMonthActive = false;
    this.isWeekActive = false;
    this.isTodayActive = true;
    this.dateRangeForm.patchValue({
      dateRange: [new Date(), new Date()],
    });
  }

  getWeeksData() {
    this.spinner.show();
    this.isMonthActive = false;
    this.isWeekActive = true;
    this.isTodayActive = false;
    let displayValueStart = this.weekStart;
    let displayValueEnd = this.weekEnd;
    this.dateRangeForm.patchValue({
      dateRange: [displayValueStart, displayValueEnd],
    });
  }

  getMonthsData() {
    this.spinner.show();
    this.isMonthActive = false;
    this.isWeekActive = true;
    this.isTodayActive = false;
    let displayValueStart = this.monthStart;
    let displayValueEnd = this.monthEnd;
    this.dateRangeForm.patchValue({
      dateRange: [displayValueStart, displayValueEnd],
    });
  }

  tabSelected(event) {
    this.getHeaderValue = event.selectedItem.outerText;
    this.checkTabApiCall();
  }

  checkTabApiCall() {
    this.spinner.show();
    // if(this.getHeaderValue === 'HR'){
    //   this.GetAttendanceReportOrgIDAndDate();
    // }else
    console.log(this.getHeaderValue)
    if (this.getHeaderValue === 'SUMMARY') {
      this.getEmlpoyeeSummaryReport();
    }
    else if (this.getHeaderValue === 'ATTENDENCE') {
      this.CheckAttendenceExpInRangebyOrgId();
    }
    else if (this.getHeaderValue === 'BREAK') {
      this.GetAllTimesheetBreaksbyOrgIdandDate();
    }
    else if (this.getHeaderValue === 'LEAVE REQUESTED') {
      this.EmployeeAllLeaveSummaryByOrgId()
    } else if (this.getHeaderValue === 'PENDING LEAVES') {
      this.EmployeeAllLeavePendingSummaryByOrgId()
    }
  }

  summaryToolbar;

  employeeSummaryList;
  getEmlpoyeeSummaryReport() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postdata = {
      orgID: user_info.org_id,
      fromDate: this.getStartDate,
      toDate: this.getEndDate
    };
    this.employeeService.EmployeeSummaryReportByRangeOrgId(postdata).subscribe((rep: any) => {
      if (rep !== null) {
        this.employeeSummaryList = rep;
        this.spinner.hide();
      }
    });
  }

  empTableSearchKeyUp(): void {
    document
      .getElementById(this.empTabledataTableGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.empTabledataTableGrid.search(
          (event.target as HTMLInputElement).value
        );
      });
  }

  employeeSummaryListDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case "Excel Export":
        this.empTabledataTableGrid.excelExport();
        break;
    }
  }

  viewSingleEmpRequestFromSettings(empid) {
    this.Router.navigate(["/HR-Employee"]);
    sessionStorage.setItem("empid", empid);
  }

  hrCheckAttData;
  CheckAttendenceExpInRangebyOrgId() {
    console.log("checking Attendence Strarted!!");
    let postData = {
      "fromDate": this.getStartDate,
      "toDate": this.getEndDate
    }
    this.timesheetService.CheckAttendenceExpInRangebyOrgId(postData).subscribe((data: any) => {
      if (data) {
        data.map((elm) => {
          elm.theday = this.datePipe.transform(new Date(elm.theday), 'dd-MM-yyyy');
          elm.check_in = elm.check_in ? this.convertTimeTo12HourFormat(elm.check_in) : 'NA';
          elm.real_check_in = elm.real_check_in ? this.convertTimeTo12HourFormat(elm.real_check_in) : 'NA';
          elm.check_out = elm.check_out ? this.convertTimeTo12HourFormat(elm.check_out) : 'NA';
          elm.tot_min = elm.tot_min ? this.convertMinutesToTimestamp(elm.tot_min) : 'NA';
          elm.real_tot_min = elm.real_tot_min ? this.convertMinutesToTimestamp(elm.real_tot_min) : 'NA';
          elm.lessminutes = elm.lessminutes ? this.convertMinutesToTimestamp(elm.lessminutes) : 'NA';
          elm.reallessminutes = elm.reallessminutes ? this.convertMinutesToTimestamp(elm.reallessminutes) : 'NA';
          elm.overminutes = elm.overminutes ? this.convertMinutesToTimestamp(elm.overminutes) : 'NA';
          elm.workdaystatus = elm.leave_applied && elm.leave_status !== 'approved'
            ? `${elm.leavename} (${elm.leave_status})`
            : elm.workdaystatus;
        })
        this.storehrAttendanceData = data;
        this.hrCheckAttData = data;
        console.log("checking Attendence!!", data);
        this.spinner.hide();
      }
    })
  }

  leaveRequestedData = [];
  pendingLeaveRequestedData = [];
  async EmployeeAllLeaveSummaryByOrgId() {
    let postData = {
      "fromDate": this.getStartDate,
      "toDate": this.getEndDate,
      "OrgID": this.user_info.org_id
    };

    this.spinner.show();

    try {
      const data: any = await this.employeeService.EmployeeAllLeaveSummaryByOrgId(postData).toPromise();

      if (data) {
        this.leaveRequestedData = data;
        console.log(this.leaveRequestedData, "*****")
      }
    } catch (error) {
      console.error("Error fetching leave summary:", error);
    } finally {
      this.spinner.hide();
    }
  }
  async EmployeeAllLeavePendingSummaryByOrgId() {
    let postData = {
      "OrgID": this.user_info.org_id
    };

    this.spinner.show();

    try {
      const data: any = await this.employeeService.EmployeeAllLeavePendingSummaryByOrgId(postData).toPromise();

      if (data) {
        this.pendingLeaveRequestedData = data;
        console.log(this.pendingLeaveRequestedData, "*****")
      }
    } catch (error) {
      console.error("Error fetching pending  leave summary:", error);
    } finally {
      this.spinner.hide();
    }
  }




  convertTimeTo12HourFormat(timeString) {
    // Parse the time string to a Date object
    var timeParts = timeString.split(":");
    // Create a new Date object with today's date and the given time
    var dateObj = new Date();
    dateObj.setHours(parseInt(timeParts[0]));
    dateObj.setMinutes(parseInt(timeParts[1]));
    return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  convertMinutesToTimestamp(minutes) {
    return Math.floor(minutes / 60) + ":" + ((minutes % 60) < 10 ? '0' : '') + (minutes % 60);
  }

  GetAttendanceReportOrgIDAndDate() {
    let postData = {
      "fromDate": this.getStartDate,
      "toDate": this.getEndDate
    }
    this.timesheetService.GetAttendanceReportOrgIDAndDate(postData).subscribe((data: any) => {
      data.map((elm) => {
        elm.ondate = new Date(elm.ondate);
        elm.check_in = elm.leave_name !== null && elm.leave_name !== 'Absent' ? elm.check_in + ' (' + elm.leave_name + ')' : elm.check_in,
          elm.check_out = elm.leave_name !== null && elm.leave_name !== 'Absent' ? elm.check_out + ' (' + elm.leave_name + ')' : elm.check_out,
          elm.total_hrs = elm.leave_name !== null && elm.leave_name !== 'Absent' ? elm.total_hrs + ' (' + elm.leave_name + ')' : elm.total_hrs,
          elm["type"] = elm.project_or_comp_id === 'Absent' ? 'Absent' : (elm.project_or_comp_id === null && elm.is_wfh === true ? 'WFH' : (elm.project_or_comp_id === null && elm.is_wfh === false ? 'Place' : (elm.project_or_comp_id === 'Leave' ? elm.project_or_comp_id + ' (' + elm.leave_name + ')' : (elm.leave_status !== 'Saturday' ? 'Office' : elm.leave_status))));
        elm.day_status = elm.timesheet_id === "Leave" ? elm.type : (elm.day_status === null ? 'Working Day' : (elm.day_status === 'Absent Day' ? 'Absent' : elm.day_status));
      });

      data.sort(function (a, b) {
        return a.ondate - b.ondate
      });

      data.map((elm) => {
        elm.ondate = this.datePipe.transform(elm.ondate, 'dd-MM-yyyy');
      })
      this.hrAttendanceData = data;
      this.storehrAttendanceData = data;
      this.spinner.hide();
    });
  }

  GetAllTimesheetBreaksbyOrgIdandDate() {
    let postData = {
      "fromDate": this.getStartDate,
      "toDate": this.getEndDate
    }
    this.timesheetService.GetAllTimesheetBreaksbyOrgIdandDate(postData).subscribe((data: any) => {
      data.map((elm) => {
        elm.ondate = this.datePipe.transform(elm.ondate, 'dd/MM/yyyy');
      })
      this.hrBreakData = data;
      this.spinner.hide();
    });
  }

  onFiltering(e) {
    let processData = [];
    this.storehrAttendanceData.map((elm) => {
      if (elm.full_name === e.itemData.name) {
        processData.push(elm)
      }
    });
    this.hrCheckAttData = processData;
  }

  //form
  dateRangeFormInput() {
    this.dateRangeForm = new FormGroup({
      dateRange: new FormControl(''),
    });
  }

  // Depreciated  for previous HR
  // hrGridDownload(args: ClickEventArgs){
  //   switch (args.item.text) {
  //     case 'PDF Export':
  //         this.hrTableGrid.pdfExport();
  //         break;
  //     case 'Excel Export':
  //         this.hrTableGrid.excelExport();
  //         break;
  //     case 'CSV Export':
  //         this.hrTableGrid.csvExport();
  //     break;
  //   }
  // }

  hrAtendanceGridDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case 'PDF Export':
        this.hrAttendanceGrid.pdfExport();
        break;
      case 'Excel Export':
        this.hrAttendanceGrid.excelExport();
        break;
      case 'CSV Export':
        this.hrAttendanceGrid.csvExport();
        break;
    }
  }
  leaveRequestGridDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case 'PDF Export':
        this.leaveRequestGrid.pdfExport();
        break;
      case 'Excel Export':
        this.leaveRequestGrid.excelExport();
        break;
      case 'CSV Export':
        this.leaveRequestGrid.csvExport();
        break;
    }
  }

  hrBreakGridDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case 'PDF Export':
        this.hrBreakGrid.pdfExport();
        break;
      case 'Excel Export':
        this.hrBreakGrid.excelExport();
        break;
      case 'CSV Export':
        this.hrBreakGrid.csvExport();
        break;
    }
  }
  //LeaveAppliedData
  leaveData;
  showOwnerMessage = false;
  showLeaveFunBtn = false;

  openApproverLeaveFormModel(listdata) {
    this.spinner.show();
    let postData = {
      id: listdata.id,
    };
    this.AdminSettingService.GetLeaveRequestedHistoryByID(postData).subscribe(
      async (data: any) => {
        this.leaveData = data[0];
        this.leaveData.emp_name = listdata.emp_name;
        this.leaveData.full_name = listdata.emp_name;
        this.getEmployeeRole(
          listdata.approver1_roleId,
          listdata.approver2_roleId
        );

        // if (this.leaveData.approver1_roleId === this.user_info.role_id) {
        //   if (
        //     this.leaveData.approver1_roleId === this.user_info.role_id &&
        //     this.leaveData.is_approved_empId1
        //   ) {
        //     this.showLeaveFunBtn = false;
        //   } else {
        //     this.showLeaveFunBtn = true;
        //   }
        // }

        // if (this.leaveData.approver2_roleId === this.user_info.role_id) {
        //   if (
        //     this.leaveData.approver2_roleId === this.user_info.role_id &&
        //     this.leaveData.is_approved_empId2
        //   ) {
        //     this.showLeaveFunBtn = false;
        //   } else {
        //     if (
        //       this.leaveData.approver2_roleId === this.user_info.role_id &&
        //       !this.leaveData.is_approved_empId2 &&
        //       this.leaveData.leave_status === "declined"
        //     ) {
        //       this.showLeaveFunBtn = false;
        //     } else {
        //       this.showLeaveFunBtn = true;
        //     }
        //   }
        // }

        if (
          this.leaveData.leave_status === "pending" &&
          this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "approved";
        } else if (
          this.leaveData.leave_status === "pending" &&
          !this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "pending";
        } else if (
          this.leaveData.leave_status === "declined" &&
          this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "approved";
        } else if (
          this.leaveData.leave_status === "declined" &&
          !this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "declined";
        } else if (
          this.leaveData.leave_status === "approved" &&
          this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "approved";
        } else if (
          this.leaveData.leave_status === "approved" &&
          !this.leaveData.is_approved_empId1
        ) {
          this.leaveData["approval1_status"] = "pending";
        }

        if (this.leaveData.approver2_roleId !== null) {
          if (
            this.leaveData.leave_status === "pending" &&
            this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "approved";
          } else if (
            this.leaveData.leave_status === "pending" &&
            !this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "pending";
          } else if (
            this.leaveData.leave_status === "declined" &&
            this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "approved";
          } else if (
            this.leaveData.leave_status === "declined" &&
            !this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "declined";
          } else if (
            this.leaveData.leave_status === "approved" &&
            this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "approved";
          } else if (
            this.leaveData.leave_status === "approved" &&
            !this.leaveData.is_approved_empId2
          ) {
            this.leaveData["approval2_status"] = "pending";
          }
        }

        this.fetchEmployeeLeaveByEmpID(
          this.leaveData.emp_id,
          this.leaveData.leave_name
        );

        await this.getEmployeeLeaveHistory(this.leaveData.emp_id);
        // this.spinner.hide();
      }
    );
  }

  totalsepLeaveDays: number;
  leavebackup: any[];
  notifymodal: boolean;
  async getEmployeeLeaveHistory(id: string) {
    this.employeeLeaveHistory = []; // Clear previous data if needed
    this.totalsepLeaveDays = 0; // Reset total days

    // Ensure leavesHistory is initialized
    if (!this.leavesHistory) {
      this.leavesHistory = [];
    }

    this.leaveService
      .GetLeaveRequestedHistoryByOrgIDandEmpID(id)
      .subscribe((data: any) => {
        // Filter only approved leaves
        this.employeeLeaveHistory = data.filter((elm: any) => elm.leave_status === "approved");
        this.leavebackup = this.employeeLeaveHistory;

        // Calculate total leave days for each leave type
        const leaveSummaryMap = this.employeeLeaveHistory.reduce((acc: any, curr: any) => {
          const leaveDays = Number(curr.leave_days_applied) || 0; // Default to 0 if undefined or not a valid number
          if (acc[curr.leave_name]) {
            acc[curr.leave_name] += leaveDays; // Accumulate
          } else {
            acc[curr.leave_name] = leaveDays; // Initialize
          }
          return acc;
        }, {});

        // Update leavesHistory if employeeLeaveHistory has data
        if (this.employeeLeaveHistory.length > 0) {
          for (const leaveName in leaveSummaryMap) {
            const totalDays = leaveSummaryMap[leaveName];
            const existingLeave = this.leavesHistory.find(leave => leave.leave_name === leaveName);

            if (existingLeave) {
              existingLeave.total_days = totalDays; // Update
            } else {
              this.leavesHistory.push({ leave_name: leaveName, total_days: totalDays }); // Add new
            }
          }
        }

        // Calculate the total sum of digits in all leave days
        this.totalsepLeaveDays = this.leavesHistory.reduce((sum, leave) => {
          if (leave.total_days !== undefined) { // Check if total_days is defined
            return sum + Number(leave.total_days); // Accumulate total
          }
          return sum; // Return sum if total_days is undefined
        }, 0);

        // Hide spinner after data is fully processed
        this.spinner.hide();

        // Show the modal only if leavesHistory has been properly calculated
        if (this.leavesHistory.length > 0 && this.totalsepLeaveDays >= 0) {
          if (!this.notifymodal) {
            $("#leave_apply_modul").modal("show");
          }
        }

        // Log outputs for verification
        console.log("Updated Leaves History", this.leavesHistory);
        console.log("Total Sum of Digits in Leave Days", this.totalsepLeaveDays);
      },
        (error) => {
          // Hide spinner in case of error as well
          this.spinner.hide();
          console.error("Error fetching leave history", error);
        });
  }

  getEmployeeRole(roleID1, roleID2) {
    let postData = { id: roleID1 };
    this.AdminSettingService.FindEmpByRoleId(postData).subscribe(
      (data: any) => {
        this.leaveData["approver1_Emp_Name"] = data.first_name;
        let postData2 = { id: data.id };
        this.empService.getByEmployeeID(postData2).subscribe((data2: any) => {
          this.leaveData["approver1_Role_Name"] = data2.role_name;
          if (roleID2 !== null) {
            let postData3 = { id: roleID2 };
            this.AdminSettingService.FindEmpByRoleId(postData3).subscribe(
              (data3: any) => {
                this.leaveData["approver2_Emp_Name"] = data3.first_name;
                let postData4 = { id: data3.id };
                this.empService
                  .getByEmployeeID(postData4)
                  .subscribe((data4: any) => {
                    this.leaveData["approver2_Role_Name"] = data4.role_name;
                    if (
                      this.leaveData.approver2_Role_Name === "Account Owner" &&
                      this.leaveData.is_approved_empId2 &&
                      !this.leaveData.is_approved_empId1
                    ) {
                      this.showOwnerMessage = true;
                      this.showLeaveFunBtn = false;
                    }
                  });
              }
            );
          }
        });
      }
    );
  }
  pendingleaveapp: number;
  remaingpending: number;
  used_leaves: number = 0;
  availableLeaves: number = 0;
  earned_used_leaves: number = 0;
  sick_used_leaves: number = 0;
  earned_remaining: number = 0;
  sick_remaining: number = 0;
  openbalancedays: Number = 0;
  assignedLeavesToEmpData: any;
  otherAssignedLeavesToEmpData: any;
  datecalculator: any;
  sickLeaveProfileDetails: any;
  leavesHistory: { leave_name: string; total_days: number }[] = [];
  fetchEmployeeLeaveByEmpID(id, leaveName) {
    let empID = id;
    this.leaveService
      .getEmpLeaveAvailableByOrgId(empID)
      .subscribe((data: any) => {
        this.leavesHistory = data;
        console.log("Data for Checking", data);

        this.openbalancedays = data[0].open_balance_days
        data.map(async (elm) => {
          console.log("leave Name", elm.leave_name);
          console.log("Leave Name From", leaveName);

          if (elm.leave_name == "Annual leave") {
            this.calculateMonthsAndDays(elm.profile_effective_from_date);
          }
          if (elm.leave_name.toLowerCase() === leaveName.toLowerCase()) {
            if (leaveName === "Annual leave") {
              this.assignedLeavesToEmpData = elm;
              var joindate = new Date(elm.profile_effective_from_date);
              var currentDate = new Date();
              var months;
              months =
                (currentDate.getFullYear() - joindate.getFullYear()) * 12;
              months -= joindate.getMonth() + 1;
              months += currentDate.getMonth() + 1;
              months = months * 2.5;
              console.log("Months Calculated", months);
              console.log("Before", this.assignedLeavesToEmpData);
              this.assignedLeavesToEmpData.eligible_leave_days =
                months.toString();
              console.log("After", this.assignedLeavesToEmpData);
            } else if (leaveName === "Sick Leave" || leaveName === "Sick leave") {
              this.calculateMonthsAndDays(elm.profile_effective_from_date);
              this.assignedLeavesToEmpData = elm;
              await this.getSickleaveleavedetails(elm.leave_profile_setup_id);
              this.getSickLeaveBreakdownWithDays(elm.profile_effective_from_date, elm.emp_id)
              console.log("Other Dta", this.assignedLeavesToEmpData);
            }
          }
          this.otherAssignedLeavesToEmpData = data;
          console.log(this.otherAssignedLeavesToEmpData);
        });
        console.log("Leaves Data Type", this.employeeLeaveHistory)
      });


    this.leaveService
      .getEmpLeavePendingByOrgId(empID)
      .subscribe((data: any) => {
        let totalLeaveDays = 0;
        data.forEach((leave: any) => {
          if (leave.leave_name === leaveName) {
            totalLeaveDays += parseFloat(leave.leave_days_applied);
          }
        });
        if (isNaN(totalLeaveDays)) {
          totalLeaveDays = 0;
        }
        this.pendingleaveapp = totalLeaveDays;
        console.log("Pending Leaves", this.pendingleaveapp);

        if (this.leaveData == null) {
          this.leaveData = this.viewEditNotificationModelData;
        }

        this.remaingpending =
          this.pendingleaveapp - this.leaveData.leave_days_applied;
        console.log("Remaining Pending", this.remaingpending);
        this.updateTotalLeaveDays();
        return totalLeaveDays;

      });
  }

  updateTotalLeaveDays() {
    console.log('Current employeeLeaveHistory:', this.employeeLeaveHistory);
    this.totalLeaveDayses = this.employeeLeaveHistory.reduce((sum, empData) => {
      const leaveDays = Number(empData.leave_days_applied);
      return sum + (isNaN(leaveDays) ? 0 : leaveDays);
    }, 0);
  }
  getSickLeaveBreakdownWithDays(joiningDateStr: string, id: string) {
    console.log("Profile day", joiningDateStr);
    console.log("Leave Data us here ", this.employeeLeaveHistory);

    // Fetch the leave data from the service
    this.leaveService.GetLeaveRequestedHistoryByOrgIDandEmpID(id).subscribe((data: any) => {
      // Filter the data for approved sick leave
      this.sickleavcal = data.filter((elm: any) => elm.leave_status === "approved" && elm.leave_name == 'Sick Leave');
      console.log("Am here to check the data", this.sickleavcal);
      // Calculate and log the breakdown after the data is fetched
      const breakdown = this.calculateSickLeaveBreakdown(joiningDateStr, this.sickleavcal, this.useAlternativeLogic)
      console.log("Breakdown with total days:", breakdown);



    });
  }
  calculateSickLeaveBreakdown(joiningDateStr: string, sickLeaveData: any[], useAlternativeLogic: boolean): any[] {
    const joiningDate = new Date(joiningDateStr);
    const currentYear = new Date().getFullYear();
    const breakdown = [];

    // Helper function: Format date as "YYYY-MM-DD"
    const formatDate = (date: Date): string => date.toLocaleDateString('en-CA');

    // Helper function: Calculate total sick leave days within a range
    const getTotalSickLeaveAppliedInRange = (leavesData: any[], startDate: Date, endDate: Date): number => {
      return leavesData.reduce((total, leave) => {
        const leaveStart = new Date(leave.leave_start_date);
        const leaveEnd = new Date(leave.leave_end_date);

        if (
          leave.leave_name === 'Sick Leave' &&
          leaveStart >= startDate &&
          leaveEnd <= endDate
        ) {
          total += Number(leave.leave_days_applied) || 0;
        }
        return total;
      }, 0);
    };

    if (!useAlternativeLogic) {
      // Alternative logic
      let startDate = new Date(joiningDate); // Initial start date is the joining date
      while (startDate.getFullYear() <= currentYear) {
        const endDate = new Date(startDate);
        endDate.setFullYear(startDate.getFullYear() + 1); // Set end date to the same day and month next year

        breakdown.push({
          year: startDate.getFullYear(),
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          totalDays: getTotalSickLeaveAppliedInRange(sickLeaveData, startDate, endDate),
        });

        startDate = new Date(endDate); // Move to the next year’s joining date
      }
    } else {
      // Original logic
      const joiningYear = joiningDate.getFullYear();

      // Breakdown for the first year
      const endOfJoiningYear = new Date(joiningYear, 11, 31);
      breakdown.push({
        year: joiningYear,
        startDate: formatDate(joiningDate),
        endDate: formatDate(endOfJoiningYear),
        totalDays: getTotalSickLeaveAppliedInRange(sickLeaveData, joiningDate, endOfJoiningYear),
      });

      // Breakdown for subsequent years
      for (let year = joiningYear + 1; year <= currentYear; year++) {
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31);
        breakdown.push({
          year,
          startDate: formatDate(startOfYear),
          endDate: formatDate(endOfYear),
          totalDays: getTotalSickLeaveAppliedInRange(sickLeaveData, startOfYear, endOfYear),
        });
      }
    }

    // Assign formatted details for rendering
    this.sickleaveduration = breakdown;
    this.sickLeaveDetails = this.formatSickLeaveDetails(breakdown);
    this.lastsickDuration = this.formatSickLeaveDetails([breakdown[breakdown.length - 1]]);
    console.log('Last Sick Leave Duration:', this.lastsickDuration);
    console.log('Sick Leave Details:', this.sickLeaveDetails);

    return breakdown;
  }
  formatSickLeaveDetails(breakdown: any[]): string {
    return breakdown
      .map(
        (item) =>
          `${item.startDate} -- ${item.endDate}: ${item.totalDays} Days`
      )
      .join(',  ');
  }
  sickleavcal: any[];
  sickleaveduration: any[];
  sickLeaveDetails: any;

  useAlternativeLogic: boolean;
  lastsickDuration: any;
  employeeLeaveHistory = [];
  totalLeaveDayses: any;
  viewEditNotificationModelData;
  async getSickleaveleavedetails(id) {
    this.leaveService
      .getLeaveProfileSetupByOrgIDandId(id)
      .subscribe((res: any) => {
        this.sickLeaveProfileDetails = res[0].leaveDetails.filter(leave => leave.leave_name === "Sick leave")[0];
        console.log("Am here sick Leave profile Details", this.sickLeaveProfileDetails);
        this.useAlternativeLogic = this.sickLeaveProfileDetails.is_full_eoy;
        console.log("Ulternative Logic", this.useAlternativeLogic)

      })
  }

  calculateMonthsAndDays(startDateString) {
    // Parse the date from "MM/DD/YYYY HH:MM:SS AM/PM" format
    const [datePart, timePart, meridiem] = startDateString.split(' ');
    const [month, day, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    const hour24 = meridiem === 'PM' && hours !== 12 ? hours + 12 : (meridiem === 'AM' && hours === 12 ? 0 : hours);

    const startDate = new Date(year, month - 1, day, hour24, minutes, seconds);
    const currentDate = new Date();

    // Calculate total months difference
    let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
    months += currentDate.getMonth() - startDate.getMonth();

    // Adjust if the day of the current month is before the start date's day
    let days = currentDate.getDate() - startDate.getDate();
    if (days < 0) {
      months -= 1; // Go back one month
      const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      days += previousMonth.getDate(); // Add days in previous month to adjust
    }

    // Format the result as a string
    const resultString = `${months} Months and ${days} Days`;
    this.datecalculator = resultString;
    console.log("date formater ", this.datecalculator);

    return resultString;
  }

  selectedLeaveType: string = 'all';
  filterLeaves(leave_name: string): void {
    // Update the selected leave type
    this.selectedLeaveType = leave_name;

    if (leave_name !== 'all') {
      this.leavebackup = this.employeeLeaveHistory.filter(leave => leave.leave_name === leave_name);
    } else {
      this.leavebackup = JSON.parse(JSON.stringify(this.employeeLeaveHistory));
    }

    console.log("Filtered leave data:", this.leavebackup);
  }

  showleavestatus = false;
  showleave() {
    if (this.showleavestatus == false) {
      this.showleavestatus = true;
    } else if (this.showleavestatus == true) {
      this.showleavestatus = false;
    }
  }
  closeApproverLeaveFormModel() {
    $("#leave_apply_modul").modal("hide");
    this.showOwnerMessage = false;
    this.showLeaveFunBtn = false;
  }


}
