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
import { settingsService } from "../../services/settings.service";
import { PayrollService } from "../../services/payroll.service";
import { Router } from "@angular/router";
import {
  NgbModal,
  NgbModalConfig,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ModuleSetupService } from "../../services/moduleSetup.service";

import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { format } from 'url';
import { log } from 'console';


@Component({
  selector: 'app-attexp',
  templateUrl: './attexp.component.html',
  styleUrls: ['./attexp.component.scss']
})
export class AttexpComponent implements OnInit {

  constructor(
    private spinner: NgxSpinnerService,
    private timesheetService: TimeSheetService,
    private employeeService: EmployeeService,
    private payrollService: PayrollService,
    private datePipe: DatePipe,
    private userService:UserService,
    public Router: Router,
    private modalService: NgbModal,
    private settingsService: settingsService,
    private toast: ToastrService,
    public ModuleSetupService: ModuleSetupService,
  ) { }

  public fields: Object = { text: "name", value: "id" };
  @ViewChild('hrAttendanceGrid',{static:false}) public hrAttendanceGrid: GridComponent;
  @ViewChild("markpresentModel", { static: false }) markpresentModel: any;
  @ViewChild("viewSubmissionModal", { static: false }) viewSubmissionModal: any;
  @ViewChild("adjustemntmodal", { static: false }) adjustemntmodal: any;

  commonModuleName;
  accessToPage = false;

  ngOnInit(): void {
    this.checkUserRights();
    this.dateRangeFormInput();
    this.getList();
    this.getcurrentPayrollMonth();

    this.dateRangeForm.patchValue({
      dateRange:[this.getStartDate, this.getEndDate],
    });

    this.dateRangeForm.get('dateRange').valueChanges.subscribe(() => {
      this.spinner.show();
      let dateVaue = this.dateRangeForm.get('dateRange').value;
      this.getStartDate = moment(dateVaue[0]).format('L');
      this.getEndDate = moment(dateVaue[1]).format('L');
      this.isMonthActive = false;
      this.isWeekActive = false;
      this.isTodayActive = false;
      this.CheckAttendenceExpInRangebyOrgId();
    });

    this.CheckAttendenceExpInRangebyOrgId();
    this.getAllEmployeeByOrgID()
  }

  activePayrollname = '';
  activePayrollId = '';
  isPayrollActive = false;

  getcurrentPayrollMonth()
  {
    this.payrollService.getActivePayrollMonthDetailsByOrgId({id: localStorage.getItem('org_id') }).subscribe((data :any) => {
      if(data.length > 0){
        this.isPayrollActive = true;
        this.activePayrollname = data[0].name;
        this.activePayrollId = data[0].id;
        console.log("activepayroll", this.activePayrollname , this.activePayrollId);
      }else{
        console.log("No activepayroll");
        this.isPayrollActive = false;
      }
    })
  }

  dateRangeForm: FormGroup;
  today: Date = new Date(new Date().toDateString());
  maxRangeDateTwo: Date = this.today;
  monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
  monthEnd: Date = this.today;
  lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
  lastEnd: Date = new Date(this.today.getFullYear(),this.today.getMonth(),0);
  yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
  yearEnd: Date = this.today;
  getStartDate = moment().format('L');
  getEndDate = moment().format('L');
  weekStart = new Date(new Date(new Date().setDate(new Date().getDate() - 7)).toDateString());
  weekEnd = new Date(new Date().toDateString());

  dateRangeFormInput(){
    this.dateRangeForm = new FormGroup({
      dateRange: new FormControl(''),
    });
  }

  isMonthActive: boolean;
  isWeekActive: boolean;
  isTodayActive = true;

  getTodaysData(){
    this.spinner.show();
    this.isMonthActive = false;
    this.isWeekActive = false;
    this.isTodayActive = true;
    this.dateRangeForm.patchValue({
      dateRange:[new Date(), new Date()],
    });
  }

  getWeeksData(){
    this.spinner.show();
    this.isMonthActive = false;
    this.isWeekActive = true;
    this.isTodayActive = false;
    let displayValueStart = this.weekStart;
    let displayValueEnd = this.weekEnd;
    this.dateRangeForm.patchValue({
      dateRange:[displayValueStart, displayValueEnd],
    });
  }

  getMonthsData(){
    this.spinner.show();
    this.isMonthActive = false;
    this.isWeekActive = true;
    this.isTodayActive = false;
    let displayValueStart = this.monthStart;
    let displayValueEnd = this.monthEnd;
    this.dateRangeForm.patchValue({
      dateRange:[displayValueStart, displayValueEnd],
    });
  }

  moduleId;
  addattendenceException  = false;
  user_info: any;

  addFullAccess = false;
  createApprover1rollId;
  createApprover1rollName;
  isDualApprover = false;
  createApprover2rollId;
  createApprover2rollName;
  createSectionName;

  PayrollModuleID;
  createPayrollSectionName;
  allowWaiveoff = false;
  showPayrollPaymentBtn = false;
  addPayrollPaymentsFullAccess = false;
  createPayrollPaymentApprover1rollId;
  createPayrollPaymentApprover1rollName;
  isDualApproverPayrollPayments = false;
  createPayrollPaymentApprover2rollId;
  createPayrollPaymentApprover2rollName;

  checkUserRights(){
    this.user_info = JSON.parse(localStorage.getItem('user_info'));
    let postData = { id : this.user_info.role_id }

    this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
      data.map((item) => {
        item.module_name = item.module_name.replace(/\s+/g, '');;
        return item;
      });
      this.commonModuleName = _.groupBy(data, 'module_name');
      if (this.commonModuleName.HumanResource) {

        this.commonModuleName.HumanResource.map((elm) => {
          if(elm.section_name === 'Add Attendence Exception'){
            this.moduleId = elm.id;
            if(elm.is_allow === true){
              this.addattendenceException = true;
              this.createSectionName = elm.section_name;
            }
          }
          if(elm.section_name === 'View Attendence Exception'){
            if(elm.is_allow === true){
              this.accessToPage = true;
            }
          }
        });

        this.checkApprover(this.user_info.role_id);
      }

      if (this.commonModuleName.Payroll) {
        this.PayrollModuleID = this.commonModuleName.Payroll[0].id;
        this.commonModuleName.Payroll.map((elm) => {
          console.log("section :" , elm.section_name);
          if (elm.section_name === "Create and Modify Payroll Payments") {
            if (elm.is_allow === true) {
              this.showPayrollPaymentBtn = elm.is_allow;
              this.createPayrollSectionName = elm.section_name;
            }
          }
          if (elm.section_name === "View PayRoll") {
            if (elm.is_allow === true) {
              this.accessToPage = true;
            }
          }
          if(elm.section_name === "Waive off Auto Deduction "){
            if(elm.is_allow === true){
              this.allowWaiveoff = true;
            }
          }
        });
        this.checkPayrollApprover(this.user_info.role_id);
      }

    });
  }

  checkApprover(role_id){

    let postData = {
      roleID: role_id,
      moduleID: this.moduleId,
    };

    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe((data: any) => {
      //add edit
      data.map((elm) => {
        if (elm.section_name === this.createSectionName) {
          if (elm.is_full_access) {
            this.addFullAccess = true;
          } else {
            this.addFullAccess = false;
            if (elm.approver1_roleId !== null) {
              this.createApprover1rollId = elm.approver1_roleId;
              this.createApprover1rollName = elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.isDualApprover = true;
                this.createApprover2rollId = elm.approver2_roleId;
                this.createApprover2rollName = elm.approver2_role_name;
              }
            }
          }
        }
      });
    });

  }

  checkPayrollApprover(role_id) {
    let postData = {
      roleID: role_id,
      moduleID: this.PayrollModuleID,
    };

    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe((data: any) => {
      //add edit
      data.map((elm) => {
        if (elm.section_name === this.createPayrollSectionName) {
          if (elm.is_full_access) {
            this.addPayrollPaymentsFullAccess = true;
          } else {
            this.addPayrollPaymentsFullAccess = false;
            if (elm.approver1_roleId !== null) {
              this.createPayrollPaymentApprover1rollId = elm.approver1_roleId;
              this.createPayrollPaymentApprover1rollName = elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.isDualApproverPayrollPayments = true;
                this.createPayrollPaymentApprover2rollId = elm.approver2_roleId;
                this.createPayrollPaymentApprover2rollName = elm.approver2_role_name;
              }
            }
          }
        }
      });
    });
  }

  employeeList = [];
  getAllEmployeeByOrgID(){
    this.employeeList.push({
      id: 'All',
      name: 'All'
    })
    this.employeeService.fetchGridDataEmployeeByOrgID().subscribe((data: any) => {
      if(data.length !== 0){
        data.map((elm) => {
          this.employeeList.push({
            id: elm.id,
            name: elm.full_name
          })
        })
      }
    });
  }

  emptext = 'select a Employee'

  hrCheckAttData;
  hrAttendanceData;
  storehrAttendanceData;

  CheckAttendenceExpInRangebyOrgId(){
    console.log("checking Attendence Strarted!!");
    let postData = {
      "fromDate": this.getStartDate,
      "toDate": this.getEndDate
    }
    this.timesheetService.CheckAttendenceExpInRangebyOrgId(postData).subscribe((data: any) =>{
      if(data){
        data.map((elm) =>{
          elm.day = elm.theday ? this.datePipe.transform(new Date(elm.theday),'MMM d, y') : 'NA';
          elm.theday = this.datePipe.transform(new Date(elm.theday),'dd-MM-yyyy');
          elm.check_in = elm.check_in ? this.convertTimeTo12HourFormat(elm.check_in) : 'NA';
          elm.check_out = elm.check_out ? this.convertTimeTo12HourFormat(elm.check_out) : 'NA';
          elm.tot_min = elm.tot_min ? this.convertMinutesToTimestamp(elm.tot_min): 'NA';
          elm.lessminutes = elm.lessminutes ? this.convertMinutesToTimestamp(elm.lessminutes): 'NA';
          elm.overminutes = elm.overminutes ? this.convertMinutesToTimestamp(elm.overminutes): 'NA';
        })
        this.storehrAttendanceData = data;
        let processData = [];
        if(this.selectedName === 'All'){
          this.hrCheckAttData = this.storehrAttendanceData;
        }else{
          this.storehrAttendanceData.map((elm) => {
            if(elm.full_name === this.selectedName){
              processData.push(elm)
            }
          });
          this.hrCheckAttData = processData;
        }
        this.spinner.hide();
      }
    })
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
    return  Math.floor(minutes / 60) + ":" + ((minutes % 60) < 10 ? '0' : '') + (minutes % 60);
  }

  GetAttendanceReportOrgIDAndDate(){
    let postData = {
      "fromDate": this.getStartDate,
      "toDate": this.getEndDate
    }
    this.timesheetService.GetAttendanceReportOrgIDAndDate(postData).subscribe((data:any) => {
      data.map((elm) => {
        elm.ondate =  new Date(elm.ondate);
        elm.check_in = elm.leave_name !== null && elm.leave_name !== 'Absent' ? elm.check_in+' ('+elm.leave_name+')' : elm.check_in,
        elm.check_out = elm.leave_name !== null && elm.leave_name !== 'Absent' ? elm.check_out+' ('+elm.leave_name+')' : elm.check_out,
        elm.total_hrs = elm.leave_name !== null && elm.leave_name !== 'Absent' ? elm.total_hrs+' ('+elm.leave_name+')' : elm.total_hrs,
        elm["type"] = elm.project_or_comp_id === 'Absent' ? 'Absent' : (elm.project_or_comp_id === null && elm.is_wfh === true ? 'WFH' : (elm.project_or_comp_id === null && elm.is_wfh === false ? 'Place' : (elm.project_or_comp_id === 'Leave' ? elm.project_or_comp_id+' ('+elm.leave_name+')' : (elm.leave_status !== 'Saturday' ? 'Office' : elm.leave_status ))));
        elm.day_status = elm.timesheet_id === "Leave" ? elm.type : (elm.day_status === null ? 'Working Day' : (elm.day_status === 'Absent Day' ? 'Absent' : elm.day_status));
      });

      data.sort(function(a, b){
        return a.ondate - b.ondate
      });

      data.map((elm) => {
        elm.ondate = this.datePipe.transform(elm.ondate,'dd-MM-yyyy');
      })
      this.hrAttendanceData = data;
      this.storehrAttendanceData = data;
      this.spinner.hide();
    });
  }

  selectedName = 'All';

  onFiltering(e){
    let processData = [];
    if(e.itemData.name === 'All'){
      this.selectedName = 'All';
      this.hrCheckAttData = this.storehrAttendanceData;
    }else{
      this.storehrAttendanceData.map((elm) => {
        if(elm.full_name === e.itemData.name){
          processData.push(elm)
        }
      });
      this.selectedName = e.itemData.name;
      this.hrCheckAttData = processData;
    }
  }

  hrAtendanceGridDownload(args: ClickEventArgs){
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

  actionData = ["Leave", "Present", "Compensate"]
  leaveTpe = ["paid", "halfpaid", "unpaid"]
  checkintype = ["WFH", "Office", "Place"]
  starttime = ["05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"]
  endtime = ["11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"]
  commonFields: Object = { text: "value", value: "id"};
  selectedaction = "Leave";

  comdateData = [];
  comdateFullData = [];

  changeaction(evnt){
    console.log("changeaction data: ",evnt);
    if (evnt.itemData.value == "Leave") {
      this.selectedaction = "Leave";
    }
    if (evnt.itemData.value == "Overide WorkTime") {
      this.selectedaction = "Overide WorkTime";
    }
    if (evnt.itemData.value == "Absent") {
      this.selectedaction = "Absent";
    }
    if (evnt.itemData.value == "Present") {
      this.selectedaction = "Present";
    }
    if(evnt.itemData.value == "Compensate") {
      this.selectedaction = "Compensate";
      this.spinner.show();
      this.comdateData = [];
      this.comdateFullData = [];
      this.timesheetService.ListExtraWorkDays({"id": this.selectEmpData.empid}).subscribe((data:any) => {
        if(data.length > 0){
          data.map((elm) => {
            this.comdateData.push({id: elm.id, value: this.datePipe.transform(elm.theday,'MMM d, y')});
            this.comdateFullData.push(elm);
          })
          this.spinner.hide();
        }else{
          this.spinner.hide();
          this.toast.warning("No Compensate Date Found");
        }
      })
    }
  }

  selectcompdate;
  selectedcompdate(evnt){
    console.log("selectedcompdate data: ",evnt);
    let timeid = evnt.itemData.id;
    let comdatestatus = this.comdateFullData.find((i) => i.id == timeid).holidayname;
    this.markpresentForm.patchValue({
      comdaystat: comdatestatus,
    });
    this.selectcompdate = evnt.itemData.value;
    console.log("selectedcompdate: ",this.selectcompdate);
  }

  selectEmpData;
  public markpresentForm: FormGroup;

  managingPresentData = false;

  marktimecomplete(data){

    this.managingPresentData = true;
    this.selectEmpData = data;
    console.log("markprsent data: ",data);

    this.actionData = ["Overide WorkTime", "Absent", "Leave"]
    this.selectedaction = "Overide WorkTime";

    this.modalService.open(this.markpresentModel);

    this.markpresentForm = new FormGroup({
      empname: new FormControl(data.full_name, [Validators.required]),
      dateincurred: new FormControl(data.theday, [Validators.required]),
      action: new FormControl("Overide WorkTime", [Validators.required]),
      leaveName: new FormControl("", [Validators.required]),
      leavetype: new FormControl("", [Validators.required]),
      checkintype: new FormControl("", [Validators.required]),
      starttime: new FormControl("", [Validators.required]),
      endtime: new FormControl("", [Validators.required]),
      comdate: new FormControl("", [Validators.required]),
      comdaystat: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
    });

  }

  markpresent(data){
    this.managingPresentData = false;
    this.selectEmpData = data;
    console.log("markprsent data: ",data);
    this.actionData = ["Leave", "Present", "Compensate"]
    this.selectedaction = "Leave";

    this.modalService.open(this.markpresentModel);

    this.markpresentForm = new FormGroup({
      empname: new FormControl(data.full_name, [Validators.required]),
      dateincurred: new FormControl(data.theday, [Validators.required]),
      action: new FormControl("Leave", [Validators.required]),
      leaveName: new FormControl("", [Validators.required]),
      leavetype: new FormControl("", [Validators.required]),
      checkintype: new FormControl("", [Validators.required]),
      starttime: new FormControl("", [Validators.required]),
      endtime: new FormControl("", [Validators.required]),
      comdate: new FormControl("", [Validators.required]),
      comdaystat: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
    });

  }

  async submitExeption(){
    this.spinner.show();
    let formdata = this.markpresentForm.value;
    const result = await this.precheckPayrollEffected( this.selectEmpData.empid , moment(this.selectEmpData.theday, "DD-MM-YYYY").format('L'));
      if (result) {
        this.spinner.hide();
        Swal.fire( 'This Attendence Exception change will effect in Payroll, but no Active Payroll Found!','Please try agian this after creating an active payroll, scince this change will create Auto Addjustment! ', 'warning' )
      } else {
        let postData = {
          id: null,
          org_id: localStorage.getItem('org_id'),
          empid: this.selectEmpData.empid,
          previous_status: this.selectEmpData.worktimestatus,
          date_Incurred: moment(this.selectEmpData.theday, "DD-MM-YYYY").format('L'),
          action: formdata.action,
          leave_name: formdata.action == "Leave" ? formdata.leaveName : null,
          leave_type: formdata.action == "Leave" ? formdata.leavetype : null,
          checkIn_type: formdata.action == "Present" || formdata.action == "Overide WorkTime" ? formdata.checkintype : null,
          check_in: formdata.action == "Present"  || formdata.action == "Overide WorkTime" ? formdata.starttime : null,
          check_out: formdata.action == "Present"  || formdata.action == "Overide WorkTime" ? formdata.endtime : null,
          compensate_date: formdata.action == "Compensate" ? moment(this.selectcompdate).format('L') : null,
          compensate_day_status: formdata.action == "Compensate" ? formdata.comdaystat : null,
          remark: formdata.remark,
          doc_url: this.adjDocUrl,
          status: this.addFullAccess ? "Approved" : "Pending",
          created_date: null,
          modified_date: null,
          created_by: this.user_info.id,
          approver1_emp_id: null,
          approver2_emp_id: null,
          approver1_roleId: this.addFullAccess? null : this.createApprover1rollId,
          approver2_roleId: this.isDualApprover? this.createApprover2rollId : null,
          approver_date1: null,
          approver_date2: null,
          is_approved_1: false,
          is_approved_2: false,
          is_deleted: false
        };
        console.log("postData: ",postData);
        this.timesheetService.AddAttendenceExp(postData).subscribe((rsp: any) => {
          if (rsp.status == "200") {
            this.toast.success("Marked Present Successfully!");
            this.getList();
            this.CheckAttendenceExpInRangebyOrgId();
            this.modalService.dismissAll();
            if( postData.status == "Approved"){
              this.checkPayrollEffected(postData.empid,postData.date_Incurred);
            }
            this.spinner.hide();
          }else {
            this.toast.error("Something Went worng While Marking Present!");
          }
        })
      }
  }

  submissionData;
  showapprbtn = false;
  aprRej(data){
    this.showapprbtn = true;
    this.submissionData = data;
    this.modalService.open(this.viewSubmissionModal);
  }

  viewattexp(data){
    this.showapprbtn = false;
    this.submissionData = data;
    this.modalService.open(this.viewSubmissionModal);
  }


  async apr(data){
    this.closeModel();

    const result = await this.precheckPayrollEffected( data.empid, moment(data.date_Incurred).format("MM/DD/YYYY"));
      if (result) {
        this.spinner.hide();
        Swal.fire( 'This Attendence Exception change will effect in Payroll, but no Active Payroll Found!','Please try agian this after creating an active payroll, since this change will create an Addition Auto Addjustment! ', 'warning' )
      } else {

        let postData = {
          id: data.id,
          org_id: data.org_id,
          empid: data.empid,
          previous_status: data.previous_status,
          date_Incurred: moment(data.date_Incurred).format("MM/DD/YYYY"),
          action: data.action,
          leave_name: data.leave_name,
          leave_type: data.leave_type,
          checkIn_type: data.checkIn_type,
          check_in: data.check_in,
          check_out: data.check_out,
          compensate_date: moment(data.compensate_date).format("MM/DD/YYYY"),
          compensate_day_status: data.compensate_day_status,
          remark: data.remark,
          doc_url: this.adjDocUrl,
          approver_date1: data.approver_date1 ? data.approver_date1 : null,
          approver_date2: data.approver_date2 ? data.approver_date2 : null,
          is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
          is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
          approver1_emp_id: data.approver1_emp_id ? data.approver1_emp_id : null,
          approver2_emp_id: data.approver2_emp_id ? data.approver2_emp_id : null,
          approver1_roleId: data.approver1_roleId? data.approver1_roleId  : null,
          approver2_roleId: data.approver2_roleId? data.approver2_roleId  : null,
          modified_by: this.user_info.id,
          status: data.status,
          is_deleted: false,
          created_by: data.created_by
        }
        if (data.approver2_roleId == this.user_info.role_id && data.is_approved_2 == false && data.is_approved_1 == true) {
          postData.approver_date2 = moment().format('L');
          postData.is_approved_2 = true;
          postData.approver2_emp_id = this.user_info.id;
          postData.status = "Approved";
          console.log("postdata arroval",postData);

          this.timesheetService
            .UpdateAttendenceExp(postData)
            .subscribe((rsp: any) => {
              if (rsp.status == "200") {
                this.toast.success(rsp.desc);
                this.CheckAttendenceExpInRangebyOrgId();
                this.getList();
                this.markNotificationReaded(postData.id);
                if( postData.status == "Approved"){
                  this.checkPayrollEffected(postData.empid,postData.date_Incurred);
                }
              } else {
                this.toast.error("Something went Wrong to Update the Adjustment!");
              }
            });
        }
        else if ( data.approver1_roleId == this.user_info.role_id &&  data.is_approved_1 == false)
        {
          postData.approver_date1 = moment().format("L");
          postData.is_approved_1 = true;
          postData.approver1_emp_id = this.user_info.id;
          postData.status = data.approver2_roleId == null ? "Approved" : "Pending";

          console.log("postdata update arroval",postData);
          console.log("converted datae", moment(data.date_Incurred).format("MM/DD/YYYY"));

          setTimeout(() => {
            this.timesheetService
              .UpdateAttendenceExp(postData)
              .subscribe((rsp: any) => {
                if (rsp.status == "200") {
                  this.toast.success(
                    rsp.desc + " Notification is send to Level 2 Approver!"
                  );
                  this.getList();
                  this.CheckAttendenceExpInRangebyOrgId();
                  this.markNotificationReaded(postData.id);
                  if( postData.status == "Approved"){
                    this.checkPayrollEffected(postData.empid,postData.date_Incurred);
                  }
                } else {
                  this.toast.error(
                    "Something went Wrong to Update the Adjustment!"
                  );
                }
              });
            console.log("postdata arroval",postData);
          }, 1000);
        }
        else {
          console.log("You dont Have the Permission for Approving the Attendence Exception!");
          this.toast.warning(
            "You dont Have the Permission for Approving the Attendence Exception!"
          );
        }

      }
  }

  rej(data){

    this.closeModel();

    let postData = {
      id: data.id,
      org_id: data.org_id,
      empid: data.empid,
      previous_status: data.previous_status,
      date_Incurred: moment(data.date_Incurred).format("MM/DD/YYYY"),
      action: data.action,
      leave_name: data.leave_name,
      leave_type: data.leave_type,
      checkIn_type: data.checkIn_type,
      check_in: data.check_in,
      check_out: data.check_out,
      compensate_date: moment(data.compensate_date).format("MM/DD/YYYY") ,
      compensate_day_status: data.compensate_day_status,
      remark: data.remark,
      doc_url: this.adjDocUrl,
      approver_date1: data.approver_date1 ? data.approver_date1 : null,
      approver_date2: data.approver_date2 ? data.approver_date2 : null,
      is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
      is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
      approver1_emp_id: data.approver1_emp_id ? data.approver1_emp_id : null,
      approver2_emp_id: data.approver2_emp_id ? data.approver2_emp_id : null,
      approver1_roleId: data.approver1_roleId? data.approver1_roleId  : null,
      approver2_roleId: data.approver2_roleId? data.approver2_roleId  : null,
      modified_by: this.user_info.id,
      status: "Rejected",
      is_deleted: false,
      created_by: data.created_by
    }

    this.timesheetService.UpdateAttendenceExp(postData).subscribe((rsp: any) => {
      if (rsp.status == "200") {
        this.toast.success("Attentence Expense Successfully Rejected!");
        this.CheckAttendenceExpInRangebyOrgId();
        this.getList();
        this.markNotificationReaded(data.id);
      } else {
        this.toast.error("Something went Wrong to Update the Adjustment!");
      }
    });

  }


  async precheckPayrollEffected(empid: number, date_Incurred: string): Promise<boolean> {
    try {
      const rsp: any = await this.payrollService.GetAutoDeductionbyEmpIdDate({ id: empid, date: date_Incurred }).toPromise();
      if (rsp && rsp.length > 0) {
        console.log("Check the Payroll Status", rsp);
        if (rsp[0].status === 'Paid' && rsp[0].payroll_status === 'Paid' && rsp[0].payroll_details_status === 'Paid') {
          if(this.isPayrollActive){
            return false;
          }else{
            return true;
          }
        } else {
          return false;
        }
      }

      return false; // In case rsp is empty or doesn't match the condition
    } catch (error) {
      console.error("Error fetching payroll details", error);
      return false; // Handle error case
    }
  }

  deduction;
  checkPayrollEffected( empid, date_Incurred) {
    this.spinner.show();
    this.payrollService.GetAutoDeductionbyEmpIdDate({id: empid, date: date_Incurred}).subscribe((rsp: any) => {
      if(rsp){
        if(rsp.length > 0){
          if(rsp[0].status == 'Paid' && rsp[0].payroll_status == 'Paid' && rsp[0].payroll_details_status == 'Paid'){
            this.deduction = rsp[0];
            this.modalService.open(this.adjustemntmodal);
            let postData;
            postData = {
              reference_id: this.generateRandomReferenceKey(),
              payroll_id: this.activePayrollId,
              org_id: localStorage.getItem("org_id"),
              emp_id: this.deduction.emp_id,
              pay_item: "Attendance Exception",
              type: "Addition",
              amount: this.deduction.amount,
              date_incurred: this.deduction.date_incurred,
              doc_url: "",
              remarks: "Auto Addition Adjustment",
              status: "Active",
              created_by: "System",
              modified_by:this.user_info.id,
              is_deleted: false,
            };
            this.payrollService.AddPayrollAdjustments(postData).subscribe((rsp: any) => {
              if (rsp) {
                this.toast.success(rsp.desc);
                this.spinner.hide();
              }
            });
          }
        }else{
          this.spinner.hide();
        }
      }
    });
  }


  markNotificationReaded(reff_id) {
    //!!! call the api for removing the approval notification!!!!
    console.log("The Notifications are marked As Readed.");
  }




  closeModel() {
    this.modalService.dismissAll();
    //!!!want to add the initail values for the changes status part
  }

  adjDocUrl = "";
  isadjDocUp = false;


  onFileSelected(event) {
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          this.isadjDocUp = true;
          this.adjDocUrl = imData.secure_url;
          this.spinner.hide();
        }
      });
    }
  }

  goToLink(link) {
    if(link ==''){
      window.open(this.adjDocUrl, "_blank");
    }
    else{
      window.open(link, "_blank");
    }
  }

  DocDelete() {
    this.adjDocUrl = "";
    this.isadjDocUp = false;
  }

  Tabs = [
    { text: "Pending" },
    { text: "Rejected" },
    { text: "Approved" },
  ];

  pendingList = [];
  approvedList = [];
  rejectedList = [];

  async getList() {
    this.spinner.show();
    this.user_info = JSON.parse(localStorage.getItem("user_info"));
    const rsp: any = await this.timesheetService.GetAttExceptionOrgId({ "id": localStorage.getItem("org_id")}).toPromise();
      if (rsp  && Array.isArray(rsp)) {
        this.pendingList = [];
        this.approvedList = [];
        this.rejectedList = [];
        rsp.map((elm) => {
          if (elm.status == 'Approved') {
            this.approvedList.push(elm);
          }
          if (elm.status == 'Pending') {
            this.pendingList.push(elm);
          }
          if (elm.status == 'Rejected') {
            this.rejectedList.push(elm);
          }
        })
        this.checkforNotification();
        this.spinner.hide();
      }

  }
  notificationData;
  checkforNotification(){
    if(localStorage.getItem('notAttExp')){
      console.log("notification Data",localStorage.getItem('notAttExp') );
      this.notificationData = JSON.parse(localStorage.getItem('notAttExp'));
      localStorage.removeItem('notAttExp');

      let elm = this.pendingList.find(value =>  value.id == this.notificationData.reference_id );

      if(elm){
        elm.status = this.notificationData.status;
        this.aprRej(elm);
      }else{
        console.log("notification already haddled");
        this.toast.warning("Notification already handled");
      }

    }
  }

  helpWork = false;
  helpWorkOption(){
    if (this.helpWork) {
      this.helpWork = false;
    }
    else {
      this.helpWork = true;
    }
  }

  generateRandomReferenceKey(length = 8) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if (this.checkKey(result)) {
      return result;
    } else {
      this.generateRandomReferenceKey();
    }
  }

  checkKey(key): boolean {
    //!!!write the code to check if the key is duplicating
    return true;
  }


}
