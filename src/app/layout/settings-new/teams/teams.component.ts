import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Select2OptionData } from "ng2-select2";
import { ToastrService } from "ngx-toastr";
import moment = require("moment");
import momentz = require("moment-timezone");
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToolbarItems, GridComponent } from "@syncfusion/ej2-angular-grids";
import * as _ from "lodash";
//services
import { TeamService } from "../../../services/team.service";
import { DepartmentService } from "../../../services/department.service";
import { EmployeeService } from "../../../services/employee.service";
import { AdministrativeService } from "../../../services/administrative.service";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"],
})
export class TeamsComponent implements OnInit {
  @ViewChild("teamGrid", { static: false }) public teamGrid: GridComponent;
  public teamGridToolItems: ToolbarItems[];
  public addnewTeams: FormGroup;
  public editTeams: FormGroup;
  addOvertimeForm: FormGroup;
  newTeamData = [];
  public deptData: Array<Select2OptionData>;
  public deptOptions: Select2Options;
  public commonOptions: Select2Options;
  editSelectedteam;
  isFlexibleDiv = false;
  teamListDiv = true;
  createTeamDiv = false;
  editTeamDiv = false;
  accessToPage = false;
  timeZoneData;
  timeZoneValue;
  timeformatValue;
  overtimeHourData;
  overtimeMinuteData;
  commonModuleName;
  timeformatData = [
    {
      id: "",
      text: "Select",
    },
    {
      id: "24Hrs",
      text: "24Hrs",
    },
    {
      id: "12Hrs",
      text: "12Hrs",
    },
  ];
  orgWorkingDays;
  editOrgWorkingDays;
  orgTrackingDays = [
    {
      day: "SA",
      day_name: "Saturday",
      is_working: false,
    },
    {
      day: "SU",
      day_name: "Sunday",
      is_working: false,
    },
    {
      day: "MO",
      day_name: "Monday",
      is_working: false,
    },
    {
      day: "TU",
      day_name: "Tuesday",
      is_working: false,
    },
    {
      day: "WE",
      day_name: "Wednesday",
      is_working: false,
    },
    {
      day: "TH",
      day_name: "Thursday",
      is_working: false,
    },
    {
      day: "FR",
      day_name: "Friday",
      is_working: true,
    },
  ];
  workStartHoursData;
  workEndHoursData;
  workTotalHoursData;
  sendReportstimeData = [
    {
      id: "24",
      text: "Morning",
    },
    {
      id: "12",
      text: "Night",
    },
  ];
  workStartHourValue: any;
  workEndHourValue: any;
  workTotalHoursValue: any;

  editTimeZoneValue: any;
  editTimeformatValue: any;
  editWorkStartHourValue: any;
  editWorkEndHourValue: any;
  editWorkTotalHoursValue: any;
  constructor(
    private deptService: DepartmentService,
    public Router: Router,
    private toast: ToastrService,
    private empService: EmployeeService,
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    public AdministrativeService: AdministrativeService,
    private userService: UserService
  ) {
    this.deptOptions = {
      placeholder: { id: "  ", text: "Select" },
      allowClear: true,
      width: "100%",
    };
    this.commonOptions = {
      placeholder: "select",
      width: "100%",
    };
    this.worktimeDropConfig = {
      height: "200px",
      placeholder: "Select",
    };
  }

  ngOnInit() {
    this.teamGridToolItems = ["Search"];
    this.checkUserRights();
    this.getTeamValues();
    this.addOvertimeFormValues();
  }
  checkUserRights() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    this.userService
      .GetAccessRightsbyRole({ id: user_info.role_id })
      .subscribe((data: any) => {
        data.map((item) => {
          item.module_name = item.module_name.replace(/\s+/g, "");
          return item;
        });
        this.commonModuleName = _.groupBy(data, "module_name");

        //settings
        if (this.commonModuleName.HumanResource) {
          this.accessToPage = true;
        } else {
          this.accessToPage = false;
        }
      });
  }

  //team listing function start
  getTeamValues() {
    this.teamService.FindTeamsByOrgID().subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.newTeamData = data;
        //console.log('team data',data)
      }
    });
  }
  //search employee table key up
  teamSearchKeyUp(): void {
    document
      .getElementById(this.teamGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.teamGrid.search((event.target as HTMLInputElement).value);
      });
  }
  //team listing function ends

  //create team functions starts
  openteamDiv() {
    this.callValues();
    this.editDropDownFormInputs();
    this.editCallDaysandTiming();
    this.InputeditWorkDayExp();
    this.teamListDiv = false;
    this.createTeamDiv = true;
    this.editTeamDiv = false;
    this.getAllTimeZone();
    this.createNewTeamsForm();
    let tz = moment.tz.guess();
    this.timeformatValue = "12Hrs";
    this.timeZoneValue = tz + " (GMT" + moment.tz(tz).format("Z") + ")";
    this.isFlexibleDiv = false;

    //setting organization values
    // let sendData = {
    //   "id": localStorage.getItem('org_id')
    // }
    // this.AdministrativeService.FindByOrgId(sendData).subscribe((data:any) =>{
    //   //console.log(data)
    //   if(data.working_days !== null){
    //     let testData = data.working_days.split(",");
    //     this.orgWorkingDays = [];
    //     testData.includes("Saturday") === true ? this.orgWorkingDays.push({day:'SA',day_name:'Saturday',is_working: true}) : this.orgWorkingDays.push({day:'SA',day_name:'Saturday',is_working: false})
    //     testData.includes("Sunday") === true ? this.orgWorkingDays.push({day:'SU',day_name:'Sunday',is_working: true}) : this.orgWorkingDays.push({day:'SU',day_name:'Sunday',is_working: false})
    //     testData.includes("Monday") === true ? this.orgWorkingDays.push({day:'MO',day_name:'Monday',is_working: true}) : this.orgWorkingDays.push({day:'MO',day_name:'Monday',is_working: false})
    //     testData.includes("Tuesday") === true ? this.orgWorkingDays.push({day:'TU',day_name:'Tuesday',is_working: true}) : this.orgWorkingDays.push({day:'TU',day_name:'Tuesday',is_working: false})
    //     testData.includes("Wednesday") === true ? this.orgWorkingDays.push({day:'WE',day_name:'Wednesday',is_working: true}) : this.orgWorkingDays.push({day:'WE',day_name:'Wednesday',is_working: false})
    //     testData.includes("Thursday") === true ? this.orgWorkingDays.push({day:'TH',day_name:'Thursday',is_working: true}) : this.orgWorkingDays.push({day:'TH',day_name:'Thursday',is_working: false})
    //     testData.includes("Friday") === true ? this.orgWorkingDays.push({day:'FR',day_name:'Friday',is_working: true}) : this.orgWorkingDays.push({day:'FR',day_name:'Friday',is_working: false})
    //   }else{
    //     this.orgWorkingDays = [
    //       {
    //         day:'SA',
    //         day_name:'Saturday',
    //         is_working: false
    //       },
    //       {
    //         day:'SU',
    //         day_name:'Sunday',
    //         is_working: true
    //       },
    //       {
    //         day:'MO',
    //         day_name:'Monday',
    //         is_working: true
    //       },
    //       {
    //         day:'TU',
    //         day_name:'Tuesday',
    //         is_working: true
    //       },
    //       {
    //         day:'WE',
    //         day_name:'Wednesday',
    //         is_working: true
    //       },
    //       {
    //         day:'TH',
    //         day_name:'Thursday',
    //         is_working: true
    //       },
    //       {
    //         day:'FR',
    //         day_name:'Friday',
    //         is_working: false
    //       }
    //     ]
    //   }

    //   if(data.is_flexible === true){
    //     this.isFlexibleDiv = true;
    //     this.workStartHourValue = '';
    //     this.workEndHourValue = '';
    //   }else{
    //     this.workStartHourValue = data.work_start_time;
    //     this.workEndHourValue = data.work_end_time;
    //   }
    //   this.workTotalHoursValue = data.working_hours;

    //   if(data.time_zone !== null){
    //     this.timeZoneValue = data.time_zone;
    //   }else{
    //     //get current time zone
    //     let tz = moment.tz.guess();
    //     this.timeZoneValue = tz+" (GMT"+moment.tz(tz).format('Z')+")";
    //   }

    //   if(data.time_format !== null){
    //     this.timeformatValue = data.time_format;
    //   }else{
    //     this.timeformatValue = '12Hrs';
    //   }

    // });
  }

  isFlexed(e) {
    //console.log(e)
    if (e.srcElement.checked === true) {
      this.isFlexibleDiv = true;
      this.workStartHourValue = "";
      this.workEndHourValue = "";
    } else {
      this.isFlexibleDiv = false;
    }
  }

  createNewTeamsForm() {
    this.addnewTeams = this.formBuilder.group({
      teamName: ["", [Validators.required]],
      teamDesc: ["", [Validators.required]],
    });
  }

  workingDayChange(e) {
    this.orgWorkingDays.map((elm) => {
      if (elm.day_name === e.target.value) {
        elm.is_working = e.srcElement.checked;
      }
    });
  }

  changedTimeZone(e: any): void {
    console.log(e);
    this.timeZoneValue = e.value;
  }

  changedTimeformat(e: any): void {
    this.timeformatValue = e.value;
  }

  changedStartHrs(e: any): void {
    this.workStartHourValue = e.value;
  }

  changedEndHrs(e: any): void {
    this.workEndHourValue = e.value;
  }

  changedTotalHrs(e: any): void {
    this.workTotalHoursValue = e.value;
  }

  addOvertimeFormValues() {
    this.addOvertimeForm = this.formBuilder.group({
      addOvertimeHourDropdownValue: [""],
      addOvertimeMinuteDropdownValue: [""],
      isWorkdayOvertimeEnabled: false,
      isHolidayOvertimeEnabled: false,
    });
  }
  handleOverTimeCheck = true;
  handleOvertime(e) {
    if (e.target.checked) {
      this.handleOverTimeCheck = false;
    } else {
      this.handleOverTimeCheck = true;
    }
  }

  createNewTeam() {
    let editDropDownForm = this.editDropDownsForm.value;
    let overtimeValues = this.addOvertimeForm.value;
    //console.log('updated',this.orgWorkingDays)
    let working_days = [];
    this.editSelectedteam.working_days.map((elm) => {
      if (elm.is_working === true) {
        working_days.push(elm.day_name);
      }
    });

    let work_days_exp = [];
    let saturday_exp = [];
    let sunday_exp = [];
    let monday_exp = [];
    let tuesday_exp = [];
    let wednesday_exp = [];
    let thursday_exp = [];
    let friday_exp = [];

    if (this.managed == true) {
      this.editWorkDayExp.map((elm) => {
        if (elm.is_working === true) {
          work_days_exp.push(elm.day_name);
        }
      });

      if (work_days_exp.includes("Saturday.")) {
        if (this.saeditIsFlexibleDiv) {
          saturday_exp.push("true");
          saturday_exp.push(editDropDownForm.wsasa.id);
          saturday_exp.push(editDropDownForm.websa.id);
          saturday_exp.push(editDropDownForm.misa.id);
          saturday_exp.push(editDropDownForm.btlsa.id);
          console.log("checkobj", editDropDownForm.wsasa.id);
        } else {
          saturday_exp.push("false");
          saturday_exp.push(editDropDownForm.StartSaturday.id);
          saturday_exp.push(editDropDownForm.EndSaturday.id);
          saturday_exp.push(editDropDownForm.tosa.id);
          saturday_exp.push(editDropDownForm.btlsa.id);
        }
      }
      if (work_days_exp.includes("Sunday.")) {
        if (this.sueditIsFlexibleDiv) {
          sunday_exp.push("true");
          sunday_exp.push(editDropDownForm.wsasu.id);
          sunday_exp.push(editDropDownForm.websu.id);
          sunday_exp.push(editDropDownForm.misu.id);
          sunday_exp.push(editDropDownForm.btlsu.id);
        } else {
          sunday_exp.push("false");
          sunday_exp.push(editDropDownForm.StartSunday.id);
          sunday_exp.push(editDropDownForm.EndSunday.id);
          sunday_exp.push(editDropDownForm.tosu.id);
          sunday_exp.push(editDropDownForm.btlsu.id);
        }
      }
      if (work_days_exp.includes("Monday.")) {
        if (this.moeditIsFlexibleDiv) {
          monday_exp.push("true");
          monday_exp.push(editDropDownForm.wsamo.id);
          monday_exp.push(editDropDownForm.webmo.id);
          monday_exp.push(editDropDownForm.mimo.id);
          monday_exp.push(editDropDownForm.btlmo.id);
        } else {
          monday_exp.push("false");
          monday_exp.push(editDropDownForm.StartMonday.id);
          monday_exp.push(editDropDownForm.EndMonday.id);
          monday_exp.push(editDropDownForm.tomo.id);
          monday_exp.push(editDropDownForm.btlmo.id);
        }
      }
      if (work_days_exp.includes("Tuesday.")) {
        if (this.tueditIsFlexibleDiv) {
          tuesday_exp.push("true");
          tuesday_exp.push(editDropDownForm.wsatu.id);
          tuesday_exp.push(editDropDownForm.webtu.id);
          tuesday_exp.push(editDropDownForm.mitu.id);
          tuesday_exp.push(editDropDownForm.btltu.id);
        } else {
          tuesday_exp.push("false");
          tuesday_exp.push(editDropDownForm.StartTuesday.id);
          tuesday_exp.push(editDropDownForm.EndTuesday.id);
          tuesday_exp.push(editDropDownForm.totu.id);
          tuesday_exp.push(editDropDownForm.btltu.id);
        }
      }
      if (work_days_exp.includes("Wednesday.")) {
        if (this.weeditIsFlexibleDiv) {
          wednesday_exp.push("true");
          wednesday_exp.push(editDropDownForm.wsawe.id);
          wednesday_exp.push(editDropDownForm.webwe.id);
          wednesday_exp.push(editDropDownForm.miwe.id);
          wednesday_exp.push(editDropDownForm.btlwe.id);
        } else {
          wednesday_exp.push("false");
          wednesday_exp.push(editDropDownForm.StartWednesday.id);
          wednesday_exp.push(editDropDownForm.EndWednesday.id);
          wednesday_exp.push(editDropDownForm.towe.id);
          wednesday_exp.push(editDropDownForm.btlwe.id);
        }
      }
      if (work_days_exp.includes("Thursday.")) {
        if (this.theditIsFlexibleDiv) {
          thursday_exp.push("true");
          thursday_exp.push(editDropDownForm.wsath.id);
          thursday_exp.push(editDropDownForm.webth.id);
          thursday_exp.push(editDropDownForm.misth.id);
          thursday_exp.push(editDropDownForm.btlth.id);
        } else {
          thursday_exp.push("false");
          thursday_exp.push(editDropDownForm.StartThursday.id);
          thursday_exp.push(editDropDownForm.EndThursday.id);
          thursday_exp.push(editDropDownForm.toth.id);
          thursday_exp.push(editDropDownForm.btlth.id);
        }
      }
      if (work_days_exp.includes("Friday.")) {
        if (this.freditIsFlexibleDiv) {
          friday_exp.push("true");
          friday_exp.push(editDropDownForm.wsafr.id);
          friday_exp.push(editDropDownForm.webfr.id);
          friday_exp.push(editDropDownForm.mifr.id);
          friday_exp.push(editDropDownForm.btlfr.id);
        } else {
          friday_exp.push("false");
          friday_exp.push(editDropDownForm.StartFriday.id);
          friday_exp.push(editDropDownForm.EndFriday.id);
          friday_exp.push(editDropDownForm.tofr.id);
          friday_exp.push(editDropDownForm.btlfr.id);
        }
      }
    }

    //console.log(working_days.toString())
    let currentUserData = JSON.parse(localStorage.getItem("user_info"));
    let reqObj = {
      org_id: localStorage.getItem("org_id"),
      teammember_empids: [],
      team_name: this.addnewTeams.value.teamName,
      team_desc: this.addnewTeams.value.teamDesc,
      team_by: currentUserData.full_name,
      createdby: currentUserData.full_name,

      time_zone: this.timeZoneValue !== undefined ? this.timeZoneValue : null,
      time_format:
        this.timeformatValue !== undefined ? this.timeformatValue : null,
      created_by_empId: currentUserData.id,

      work_profile_effective_day: moment(
        editDropDownForm.wrkProfileEffectiveDay
      ).format("L"),
      working_days: working_days.toString(),
      //"working_hours": this.workTotalHoursValue !== undefined ? this.workTotalHoursValue : null,
      work_start_time:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editStartTimeDropdownValue.id !== undefined
            ? editDropDownForm.editStartTimeDropdownValue.id
            : null
          : null,
      work_end_time:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editEndTimeDropdownValue.id !== undefined
            ? editDropDownForm.editEndTimeDropdownValue.id
            : null
          : null,
      checkin_tolarence:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editCheckinTolerance.id
          : null, //min_hrs: ,
      break_time:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editBreakTimeLimit.id
          : null,

      is_flexible: this.editIsFlexibleDiv,

      checkin_after:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editCheckInAfter.id
          : null,
      checkout_before:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editCheckOutBefore.id
          : null,
      min_hrs_flx:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editTotalHoursDropdownValue.id
          : null,
      break_time_flx:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editBreakTimeLimitFlex.id
          : null,

      is_custom_work: this.managed,
      work_days_exp: work_days_exp.toString(),
      saturday_exp: saturday_exp.toString(),
      sunday_exp: sunday_exp.toString(),
      monday_exp: monday_exp.toString(),
      tuesday_exp: tuesday_exp.toString(),
      wednesday_exp: wednesday_exp.toString(),
      thursday_exp: thursday_exp.toString(),
      friday_exp: friday_exp.toString(),
      // Overtime added
      addOvertimeHour: overtimeValues.addOvertimeHourDropdownValue.id,
      addOvertimeMinute: overtimeValues.addOvertimeMinuteDropdownValue.id,
      isWorkdayOvertimeEnabled: overtimeValues.isWorkdayOvertimeEnabled,
      isHolidayOvertimeEnabled: overtimeValues.isHolidayOvertimeEnabled,
    };
    console.log(reqObj);
    this.teamService.AddTeam(reqObj).subscribe((data: any) => {
      console.log(data);
      if (data.status == 200) {
        this.toast.success("Team Added Successfully");
      } else {
        this.toast.error("Something Went Wrong");
      }
      this.backToTeamListingFromNew();
    });
  }

  backToTeamListingFromNew() {
    this.getTeamValues();
    this.addnewTeams.reset();
    this.teamListDiv = true;
    this.createTeamDiv = false;
    this.workTotalHoursValue = "";
    this.workStartHourValue = "";
    this.workEndHourValue = "";
    this.timeZoneValue = "";
    this.isFlexibleDiv = false;
  }
  //create team functions ends

  //update team functions starts
  editexistTeam(data) {
    this.editDropDownFormInputs();
    this.editCallDaysandTiming();
    this.InputeditWorkDayExp();
    console.log(data);
    this.editTeamsForm();
    //this.callValues();
    this.getAllTimeZone();
    this.teamListDiv = false;
    this.createTeamDiv = false;
    this.editTeamDiv = true;
    let testData = data.working_days.split(",");
    this.editOrgWorkingDays = [];
    testData.includes("Saturday") === true
      ? this.editOrgWorkingDays.push({
          day: "SA",
          day_name: "Saturday",
          is_working: true,
        })
      : this.editOrgWorkingDays.push({
          day: "SA",
          day_name: "Saturday",
          is_working: false,
        });
    testData.includes("Sunday") === true
      ? this.editOrgWorkingDays.push({
          day: "SU",
          day_name: "Sunday",
          is_working: true,
        })
      : this.editOrgWorkingDays.push({
          day: "SU",
          day_name: "Sunday",
          is_working: false,
        });
    testData.includes("Monday") === true
      ? this.editOrgWorkingDays.push({
          day: "MO",
          day_name: "Monday",
          is_working: true,
        })
      : this.editOrgWorkingDays.push({
          day: "MO",
          day_name: "Monday",
          is_working: false,
        });
    testData.includes("Tuesday") === true
      ? this.editOrgWorkingDays.push({
          day: "TU",
          day_name: "Tuesday",
          is_working: true,
        })
      : this.editOrgWorkingDays.push({
          day: "TU",
          day_name: "Tuesday",
          is_working: false,
        });
    testData.includes("Wednesday") === true
      ? this.editOrgWorkingDays.push({
          day: "WE",
          day_name: "Wednesday",
          is_working: true,
        })
      : this.editOrgWorkingDays.push({
          day: "WE",
          day_name: "Wednesday",
          is_working: false,
        });
    testData.includes("Thursday") === true
      ? this.editOrgWorkingDays.push({
          day: "TH",
          day_name: "Thursday",
          is_working: true,
        })
      : this.editOrgWorkingDays.push({
          day: "TH",
          day_name: "Thursday",
          is_working: false,
        });
    testData.includes("Friday") === true
      ? this.editOrgWorkingDays.push({
          day: "FR",
          day_name: "Friday",
          is_working: true,
        })
      : this.editOrgWorkingDays.push({
          day: "FR",
          day_name: "Friday",
          is_working: false,
        });
    data.working_days = this.editOrgWorkingDays;
    this.isFlexibleDiv = data.is_flexible;
    let eValue = { srcElement: { checked: this.isFlexibleDiv } };
    this.isFlexedEdit(eValue);
    this.editTimeZoneValue = data.time_zone;
    this.editTimeformatValue = data.time_format;
    this.editWorkStartHourValue = data.work_start_time;
    this.editWorkEndHourValue = data.work_end_time;
    this.editWorkTotalHoursValue = data.working_hours;
    this.editTeams.patchValue({
      editTeamName: data.team_name,
      editTeamDesc: data.team_desc,
    });

    this.editDropDownsForm.patchValue({
      wrkProfileEffectiveDay: data.work_profile_effective_day,
    });

    this.editSelectedteam = data;
    if (data.is_flexible === true) {
      this.editIsFlexibleDiv = true;
      this.editDropDownsForm.patchValue({
        editStartTimeDropdownValue: { id: null, description: "select" },
        editEndTimeDropdownValue: { id: null, description: "select" },
        editCheckinTolerance: { id: null, description: "select" },
        editBreakTimeLimit: { id: null, description: "select" },
        editCheckInAfter: {
          id: data.checkin_after,
          description: data.checkin_after,
        },
        editCheckOutBefore: {
          id: data.checkout_before,
          description: data.checkout_before,
        },
        editTotalHoursDropdownValue: {
          id: data.min_hrs_flx,
          description: data.min_hrs_flx,
        },
        editBreakTimeLimitFlex: {
          id: data.break_time_flx,
          description: data.break_time_flx,
        },
      });
    } else {
      this.editIsFlexibleDiv = false;
      this.editDropDownsForm.patchValue({
        editStartTimeDropdownValue: {
          id: data.work_start_time,
          description: data.work_start_time,
        },
        editEndTimeDropdownValue: {
          id: data.work_end_time,
          description: data.work_end_time,
        },
        editCheckinTolerance: {
          id: data.checkin_tolarence,
          description: data.checkin_tolarence,
        },
        editBreakTimeLimit: {
          id: data.break_time,
          description: data.break_time,
        },
        editCheckInAfter: { id: null, description: "select" },
        editCheckOutBefore: { id: null, description: "select" },
        editTotalHoursDropdownValue: { id: null, description: "select" },
        editBreakTimeLimitFlex: { id: null, description: "select" },
      });
    }

    if (data.is_custom_work) {
      let exptest = data.work_days_exp.split(",");
      this.editWorkDayExp = [];
      this.managed = true;
      exptest.includes("Saturday.") === true
        ? this.editWorkDayExp.push({
            day: "SA",
            day_name: "Saturday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "SA",
            day_name: "Saturday.",
            is_working: false,
          });
      exptest.includes("Sunday.") === true
        ? this.editWorkDayExp.push({
            day: "SU",
            day_name: "Sunday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "SU",
            day_name: "Sunday.",
            is_working: false,
          });
      exptest.includes("Monday.") === true
        ? this.editWorkDayExp.push({
            day: "MO",
            day_name: "Monday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "MO",
            day_name: "Monday.",
            is_working: false,
          });
      exptest.includes("Tuesday.") === true
        ? this.editWorkDayExp.push({
            day: "TU",
            day_name: "Tuesday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "TU",
            day_name: "Tuesday.",
            is_working: false,
          });
      exptest.includes("Wednesday.") === true
        ? this.editWorkDayExp.push({
            day: "WE",
            day_name: "Wednesday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "WE",
            day_name: "Wednesday.",
            is_working: false,
          });
      exptest.includes("Thursday.") === true
        ? this.editWorkDayExp.push({
            day: "TH",
            day_name: "Thursday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "TH",
            day_name: "Thursday.",
            is_working: false,
          });
      exptest.includes("Friday.") === true
        ? this.editWorkDayExp.push({
            day: "FR",
            day_name: "Friday.",
            is_working: true,
          })
        : this.editWorkDayExp.push({
            day: "FR",
            day_name: "Friday.",
            is_working: false,
          });

      let expday = [];
      // saturday exp
      console.log("error", data.saturday_exp);
      if (data.saturday_exp != null) {
        expday = data.saturday_exp.split(",");
        if (expday[0] == true) {
          this.editDropDownsForm.patchValue({
            wsasa: { id: expday[1], description: expday[1] },
            websa: { id: expday[2], description: expday[2] },
            misa: { id: expday[3], description: expday[3] },
            btlsa: { id: expday[4], description: expday[4] },
          });
        } else {
          this.editDropDownsForm.patchValue({
            StartSaturday: { id: expday[1], description: expday[1] },
            EndSaturday: { id: expday[2], description: expday[2] },
            tosa: { id: expday[3], description: expday[3] },
            btlsa: { id: expday[4], description: expday[4] },
          });
        }
      }
      // sunday exp
      if (data.sunday_exp != null) {
        expday = data.sunday_exp.split(",");
        if (expday[0] == true) {
          this.editDropDownsForm.patchValue({
            wsasu: { id: expday[1], description: expday[1] },
            websu: { id: expday[2], description: expday[2] },
            misu: { id: expday[3], description: expday[3] },
            btlsu: { id: expday[4], description: expday[4] },
          });
        } else {
          this.editDropDownsForm.patchValue({
            StartSunday: { id: expday[1], description: expday[1] },
            EndSunday: { id: expday[2], description: expday[2] },
            tosu: { id: expday[3], description: expday[3] },
            btlsu: { id: expday[4], description: expday[4] },
          });
        }
      }
      //monday exp
      if (data.monday_exp != null) {
        expday = data.monday_exp.split(",");
        if (expday[0] == true) {
          this.editDropDownsForm.patchValue({
            wsamo: { id: expday[1], description: expday[1] },
            webmo: { id: expday[2], description: expday[2] },
            mismo: { id: expday[3], description: expday[3] },
            btlmo: { id: expday[4], description: expday[4] },
          });
        } else {
          this.editDropDownsForm.patchValue({
            StartMonday: { id: expday[1], description: expday[1] },
            EndMonday: { id: expday[2], description: expday[2] },
            tomo: { id: expday[3], description: expday[3] },
            btlmo: { id: expday[4], description: expday[4] },
          });
        }
      }
      //tuesday exp
      if (data.tuesday_exp != null) {
        expday = data.tuesday_exp.split(",");
        if (expday[0] == true) {
          this.editDropDownsForm.patchValue({
            wsatu: { id: expday[1], description: expday[1] },
            webtu: { id: expday[2], description: expday[2] },
            mistu: { id: expday[3], description: expday[3] },
            btltu: { id: expday[4], description: expday[4] },
          });
        } else {
          this.editDropDownsForm.patchValue({
            StartTuesday: { id: expday[1], description: expday[1] },
            EndTuesday: { id: expday[2], description: expday[2] },
            totu: { id: expday[3], description: expday[3] },
            btltu: { id: expday[4], description: expday[4] },
          });
        }
      }
      // wednesday exp
      if (data.wednesday_exp != null) {
        expday = data.wednesday_exp.split(",");
        if (expday[0] == true) {
          this.editDropDownsForm.patchValue({
            wsawe: { id: expday[1], description: expday[1] },
            webwe: { id: expday[2], description: expday[2] },
            miswe: { id: expday[3], description: expday[3] },
            btlwe: { id: expday[4], description: expday[4] },
          });
        } else {
          this.editDropDownsForm.patchValue({
            StartWednesday: { id: expday[1], description: expday[1] },
            EndWednesday: { id: expday[2], description: expday[2] },
            towe: { id: expday[3], description: expday[3] },
            btlwe: { id: expday[4], description: expday[4] },
          });
        }
      }
      // thursday exp
      if (data.thursday_exp != null) {
        expday = data.thursday_exp.split(",");
        if (expday[0] == true) {
          this.editDropDownsForm.patchValue({
            wsath: { id: expday[1], description: expday[1] },
            webth: { id: expday[2], description: expday[2] },
            misth: { id: expday[3], description: expday[3] },
            btlth: { id: expday[4], description: expday[4] },
          });
        } else {
          this.editDropDownsForm.patchValue({
            StartThursday: { id: expday[1], description: expday[1] },
            EndThursday: { id: expday[2], description: expday[2] },
            toth: { id: expday[3], description: expday[3] },
            btlth: { id: expday[4], description: expday[4] },
          });
        }
      }
      //friday exp
      if (data.friday_exp != null) {
        expday = data.friday_exp.split(",");
        if (expday[0] == true) {
          this.editDropDownsForm.patchValue({
            wsafr: { id: expday[1], description: expday[1] },
            webfr: { id: expday[2], description: expday[2] },
            misfr: { id: expday[3], description: expday[3] },
            btlfr: { id: expday[4], description: expday[4] },
          });
        } else {
          this.editDropDownsForm.patchValue({
            StartFriday: { id: expday[1], description: expday[1] },
            EndFriday: { id: expday[2], description: expday[2] },
            tofr: { id: expday[3], description: expday[3] },
            btlfr: { id: expday[4], description: expday[4] },
          });
        }
      }
    } else {
      this.managed = false;
    }

    console.log("working till here");
  }

  saeditIsFlexibleDiv = false;
  sueditIsFlexibleDiv = false;
  moeditIsFlexibleDiv = false;
  tueditIsFlexibleDiv = false;
  weeditIsFlexibleDiv = false;
  theditIsFlexibleDiv = false;
  freditIsFlexibleDiv = false;
  managed = false;

  isFlexedEdit(e) {
    //console.log(e)
    if (this.managed == false) {
      if (e.srcElement.checked === true) {
        this.editIsFlexibleDiv = true;
        this.editWorkStartHourValue = "";
        this.editWorkEndHourValue = "";
        this.saeditIsFlexibleDiv = true;
        this.sueditIsFlexibleDiv = true;
        this.moeditIsFlexibleDiv = true;
        this.tueditIsFlexibleDiv = true;
        this.weeditIsFlexibleDiv = true;
        this.theditIsFlexibleDiv = true;
        this.freditIsFlexibleDiv = true;
      } else {
        this.editIsFlexibleDiv = false;
      }
    } else {
      if (e.srcElement.checked === false) {
        this.editIsFlexibleDiv = false;
      } else {
        this.editIsFlexibleDiv = true;
      }
    }
  }

  editTeamsForm() {
    this.editTeams = this.formBuilder.group({
      editTeamName: ["", [Validators.required]],
      editTeamDesc: ["", [Validators.required]],
    });
  }

  // editWorkingDayChange(e){
  //   this.editOrgWorkingDays.map((elm) => {
  //     if(elm.day_name === e.target.value){
  //       elm.is_working = e.srcElement.checked
  //     }
  //   })
  // }

  editChangedTimeZone(e: any): void {
    this.editTimeZoneValue = e.value;
  }

  editChangedTimeformat(e: any): void {
    this.editTimeformatValue = e.value;
  }

  editChangedStartHrs(e: any): void {
    this.editWorkStartHourValue = e.value;
  }

  editChangedEndHrs(e: any): void {
    this.editWorkEndHourValue = e.value;
  }

  editChangedTotalHrs(e: any): void {
    this.editWorkTotalHoursValue = e.value;
  }

  editExistingTeam() {
    let editDropDownForm = this.editDropDownsForm.value;
    let overtimeValues = this.addOvertimeForm.value;

    let working_days = [];
    this.editOrgWorkingDays.map((elm) => {
      if (elm.is_working === true) {
        working_days.push(elm.day_name);
      }
    });

    let work_days_exp = [];
    let saturday_exp = [];
    let sunday_exp = [];
    let monday_exp = [];
    let tuesday_exp = [];
    let wednesday_exp = [];
    let thursday_exp = [];
    let friday_exp = [];

    if (this.managed == true) {
      this.editWorkDayExp.map((elm) => {
        if (elm.is_working === true) {
          work_days_exp.push(elm.day_name);
        }
      });

      if (work_days_exp.includes("Saturday.")) {
        if (this.saeditIsFlexibleDiv) {
          saturday_exp.push("true");
          saturday_exp.push(editDropDownForm.wsasa.id);
          saturday_exp.push(editDropDownForm.websa.id);
          saturday_exp.push(editDropDownForm.misa.id);
          saturday_exp.push(editDropDownForm.btlsa.id);
          console.log("checkobj", editDropDownForm.wsasa.id);
        } else {
          saturday_exp.push("false");
          saturday_exp.push(editDropDownForm.StartSaturday.id);
          saturday_exp.push(editDropDownForm.EndSaturday.id);
          saturday_exp.push(editDropDownForm.tosa.id);
          saturday_exp.push(editDropDownForm.btlsa.id);
        }
      }
      if (work_days_exp.includes("Sunday.")) {
        if (this.sueditIsFlexibleDiv) {
          sunday_exp.push("true");
          sunday_exp.push(editDropDownForm.wsasu.id);
          sunday_exp.push(editDropDownForm.websu.id);
          sunday_exp.push(editDropDownForm.misu.id);
          sunday_exp.push(editDropDownForm.btlsu.id);
        } else {
          sunday_exp.push("false");
          sunday_exp.push(editDropDownForm.StartSunday.id);
          sunday_exp.push(editDropDownForm.EndSunday.id);
          sunday_exp.push(editDropDownForm.tosu.id);
          sunday_exp.push(editDropDownForm.btlsu.id);
        }
      }
      if (work_days_exp.includes("Monday.")) {
        if (this.moeditIsFlexibleDiv) {
          monday_exp.push("true");
          monday_exp.push(editDropDownForm.wsamo.id);
          monday_exp.push(editDropDownForm.webmo.id);
          monday_exp.push(editDropDownForm.mimo.id);
          monday_exp.push(editDropDownForm.btlmo.id);
        } else {
          monday_exp.push("false");
          monday_exp.push(editDropDownForm.StartMonday.id);
          monday_exp.push(editDropDownForm.EndMonday.id);
          monday_exp.push(editDropDownForm.tomo.id);
          monday_exp.push(editDropDownForm.btlmo.id);
        }
      }
      if (work_days_exp.includes("Tuesday.")) {
        if (this.tueditIsFlexibleDiv) {
          tuesday_exp.push("true");
          tuesday_exp.push(editDropDownForm.wsatu.id);
          tuesday_exp.push(editDropDownForm.webtu.id);
          tuesday_exp.push(editDropDownForm.mitu.id);
          tuesday_exp.push(editDropDownForm.btltu.id);
        } else {
          tuesday_exp.push("false");
          tuesday_exp.push(editDropDownForm.StartTuesday.id);
          tuesday_exp.push(editDropDownForm.EndTuesday.id);
          tuesday_exp.push(editDropDownForm.totu.id);
          tuesday_exp.push(editDropDownForm.btltu.id);
        }
      }
      if (work_days_exp.includes("Wednesday.")) {
        if (this.weeditIsFlexibleDiv) {
          wednesday_exp.push("true");
          wednesday_exp.push(editDropDownForm.wsawe.id);
          wednesday_exp.push(editDropDownForm.webwe.id);
          wednesday_exp.push(editDropDownForm.miwe.id);
          wednesday_exp.push(editDropDownForm.btlwe.id);
        } else {
          wednesday_exp.push("false");
          wednesday_exp.push(editDropDownForm.StartWednesday.id);
          wednesday_exp.push(editDropDownForm.EndWednesday.id);
          wednesday_exp.push(editDropDownForm.towe.id);
          wednesday_exp.push(editDropDownForm.btlwe.id);
        }
      }
      if (work_days_exp.includes("Thursday.")) {
        if (this.theditIsFlexibleDiv) {
          thursday_exp.push("true");
          thursday_exp.push(editDropDownForm.wsath.id);
          thursday_exp.push(editDropDownForm.webth.id);
          thursday_exp.push(editDropDownForm.misth.id);
          thursday_exp.push(editDropDownForm.btlth.id);
        } else {
          thursday_exp.push("false");
          thursday_exp.push(editDropDownForm.StartThursday.id);
          thursday_exp.push(editDropDownForm.EndThursday.id);
          thursday_exp.push(editDropDownForm.toth.id);
          thursday_exp.push(editDropDownForm.btlth.id);
        }
      }
      if (work_days_exp.includes("Friday.")) {
        if (this.freditIsFlexibleDiv) {
          friday_exp.push("true");
          friday_exp.push(editDropDownForm.wsafr.id);
          friday_exp.push(editDropDownForm.webfr.id);
          friday_exp.push(editDropDownForm.mifr.id);
          friday_exp.push(editDropDownForm.btlfr.id);
        } else {
          friday_exp.push("false");
          friday_exp.push(editDropDownForm.StartFriday.id);
          friday_exp.push(editDropDownForm.EndFriday.id);
          friday_exp.push(editDropDownForm.tofr.id);
          friday_exp.push(editDropDownForm.btlfr.id);
        }
      }
    }

    let userData = JSON.parse(localStorage.getItem("user_info"));
    let updateTeamData = {
      id: this.editSelectedteam.id,
      org_id: localStorage.getItem("org_id"),
      teammember_empids: [],
      team_name: this.editTeams.value.editTeamName,
      team_desc: this.editTeams.value.editTeamDesc,
      team_by: this.editSelectedteam.team_by,
      created_date: this.editSelectedteam.created_date,
      createdby: this.editSelectedteam.createdby,
      modifiedby: userData.full_name,
      current_user_empid: userData.id,
      work_profile_effective_day: moment(
        editDropDownForm.wrkProfileEffectiveDay
      ).format("L"),
      working_days: working_days.toString(),

      //"working_hours": this.editWorkTotalHoursValue !== undefined ? this.editWorkTotalHoursValue : null,
      work_start_time:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editStartTimeDropdownValue.id !== undefined
            ? editDropDownForm.editStartTimeDropdownValue.id
            : null
          : null,
      work_end_time:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editEndTimeDropdownValue.id !== undefined
            ? editDropDownForm.editEndTimeDropdownValue.id
            : null
          : null,
      checkin_tolarence:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editCheckinTolerance.id
          : null, //min_hrs: ,
      break_time:
        this.editIsFlexibleDiv !== true
          ? editDropDownForm.editBreakTimeLimit.id
          : null,

      is_flexible: this.editIsFlexibleDiv,

      checkin_after:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editCheckInAfter.id
          : null,
      checkout_before:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editCheckOutBefore.id
          : null,
      min_hrs_flx:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editTotalHoursDropdownValue.id
          : null,
      break_time_flx:
        this.editIsFlexibleDiv == true
          ? editDropDownForm.editBreakTimeLimitFlex.id
          : null,
      // Overtime added
      minOTHours: overtimeValues.addOvertimeHourDropdownValue,
      minOTMinutes: overtimeValues.addOvertimeMinuteDropdownValue,
      isWorkdayOTEnabled: overtimeValues.isWorkdayOvertimeEnabled,
      isHolidayOTEnabled: overtimeValues.isHolidayOvertimeEnabled,

      is_custom_work: this.managed,
      work_days_exp: work_days_exp.toString(),
      saturday_exp: saturday_exp.toString(),
      sunday_exp: sunday_exp.toString(),
      monday_exp: monday_exp.toString(),
      tuesday_exp: tuesday_exp.toString(),
      wednesday_exp: wednesday_exp.toString(),
      thursday_exp: thursday_exp.toString(),
      friday_exp: friday_exp.toString(),

      time_zone:
        this.editTimeZoneValue !== undefined ? this.editTimeZoneValue : null,
      time_format:
        this.editTimeformatValue !== undefined
          ? this.editTimeformatValue
          : null,
      created_by_empId: this.editSelectedteam.created_by_empId,
      modified_by_empId: userData.id,
    };
    console.log(updateTeamData);
    this.teamService.updateTeam(updateTeamData).subscribe((data: any) => {
      //console.log(data)
      if (data.status == 200) {
        this.toast.success("Team Updated Successfully");
      } else {
        this.toast.error("Something Went Wrong");
      }
      this.backToTeamListingFromEdit();
    });
  }

  backToTeamListingFromEdit() {
    this.getTeamValues();
    this.editTeams.reset();
    this.teamListDiv = true;
    this.editTeamDiv = false;
    this.editWorkStartHourValue = "";
    this.editWorkEndHourValue = "";
    this.editWorkTotalHoursValue = "";
    this.editTimeZoneValue = "";
    this.editTimeformatValue = "";
    this.isFlexibleDiv = false;
  }

  resetExistingTeam() {
    Swal.fire({
      title: "Are you sure ?",
      text: "This will reset the working days and working time to organization level settings",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        //console.log("run function")
        let postData = {
          orgID: localStorage.getItem("org_id"),
          teamId: this.editSelectedteam.id,
        };
        //console.log(postData)
        this.teamService.TeamResetSettings(postData).subscribe((data: any) => {
          //console.log(data)
          if (data.result.status === "200") {
            this.toast.success("Team settings reset successfully.");
            this.backToTeamListingFromEdit();
          }
        });
      }
    });
  }
  //update team functions ends

  //delete team functions ends
  deleteTeams(id, element) {
    console.log(element);
    Swal.fire({
      title: "Delete this Team ?",
      text:
        "Please Note " +
        element.memberCount +
        " members will be moved to Without Team",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        let postData = {
          id: id,
        };
        this.teamService.teamDelete(postData).subscribe((data: any) => {
          if (data.status == 200) {
            this.toast.success("Team Deleted Successfully");
          } else {
            this.toast.error("Something Went Wrong");
          }
          this.getTeamValues();
        });
      }
    });
  }

  //common function
  getAllTimeZone() {
    var timeZones = momentz.tz.names();
    var offsetTmz = [];
    for (var i in timeZones) {
      offsetTmz.push({
        text:
          timeZones[i] + " (GMT" + moment.tz(timeZones[i]).format("Z") + ")",
        id: timeZones[i] + " (GMT" + moment.tz(timeZones[i]).format("Z") + ")",
      });
    }
    this.timeZoneData = offsetTmz;
  }
  workStartHoursDataj;
  callValues() {
    this.workStartHoursDataj = [
      {
        id: "",
        text: "Select",
      },
      {
        id: "6:00 AM",
        text: "6:00 AM",
      },
      {
        id: "6:30 AM",
        text: "6:30 AM",
      },
      {
        id: "7:00 AM",
        text: "7:00 AM",
      },
      {
        id: "7:30 AM",
        text: "7:30 AM",
      },
      {
        id: "8:00 AM",
        text: "8:00 AM",
      },
      {
        id: "8:30 AM",
        text: "8:30 AM",
      },
      {
        id: "9:00 AM",
        text: "9:00 AM",
      },
    ];
    this.overtimeHourData = [
      {
        id: null,
        description: "Select",
      },
      {
        id: 1,
        description: "1Hr",
      },
      {
        id: 2,
        description: "2Hr",
      },
      {
        id: 3,
        description: "3Hr",
      },
      {
        id: 4,
        description: "4Hr",
      },
      {
        id: 5,
        description: "5Hr",
      },
      {
        id: 6,
        description: "6Hr",
      },
    ];
    this.overtimeMinuteData = [
      {
        id: null,
        description: "Select",
      },
      {
        id: 10,
        description: "10Min",
      },
      {
        id: 20,
        description: "20Min",
      },
      {
        id: 30,
        description: "30Min",
      },
      {
        id: 40,
        description: "40Min",
      },
      {
        id: 50,
        description: "50Min",
      },
      {
        id: 60,
        description: "60Min",
      },
    ];
  }

  //common function

  //not used
  onCheckChange(e) {}

  backToSettings() {
    this.Router.navigate(["settings-new"]);
  }

  editDropDownsForm: FormGroup;

  editDropDownFormInputs() {
    this.editDropDownsForm = this.formBuilder.group({
      editTeamDropdownValue: [""],
      editEmpTypeDropdownValue: [""],
      editRoleDropdownValue: [""],
      editTimeZoneDropdownValue: [""],
      editTimeFormatDropdownValue: [""],
      editStatusDropdownValue: [""],

      editStartTimeDropdownValue: [""],
      editEndTimeDropdownValue: [""],
      editCheckinTolerance: [""],
      editBreakTimeLimit: [""],

      editFlexibleCheckbox: [""],

      editCheckInAfter: [""],
      editCheckOutBefore: [""],
      editTotalHoursDropdownValue: [""],
      editBreakTimeLimitFlex: [""],

      editCostomWorkDays: [""],

      saIsFlex: [""],
      StartSaturday: [""],
      EndSaturday: [""],
      tosa: [""],
      misa: [""],
      wsasa: [""],
      websa: [""],
      btlsa: [""],

      suIsFlex: [""],
      StartSunday: [""],
      EndSunday: [""],
      tosu: [""],
      misu: [""],
      wsasu: [""],
      websu: [""],
      btlsu: [""],

      moIsFlex: [""],
      StartMonday: [""],
      EndMonday: [""],
      tomo: [""],
      mimo: [""],
      wsamo: [""],
      webmo: [""],
      btlmo: [""],

      tuIsFlex: [""],
      StartTuesday: [""],
      EndTuesday: [""],
      totu: [""],
      mitu: [""],
      wsatu: [""],
      webtu: [""],
      btltu: [""],

      weIsFlex: [""],
      StartWednesday: [""],
      EndWednesday: [""],
      towe: [""],
      miwe: [""],
      wsawe: [""],
      webwe: [""],
      btlwe: [""],

      thIsFlex: [""],
      StartThursday: [""],
      EndThursday: [""],
      toth: [""],
      mith: [""],
      wsath: [""],
      webth: [""],
      btlth: [""],

      frIsFlex: [""],
      StartFriday: [""],
      EndFriday: [""],
      tofr: [""],
      mifr: [""],
      wsafr: [""],
      webfr: [""],
      btlfr: [""],

      wrkProfileEffectiveDay: [""],
    });
  }

  helpWork = false;
  helpWorkFlex = false;

  helpWorkOption(sec) {
    if (sec == "main") {
      if (this.helpWork) {
        this.helpWork = false;
      } else {
        this.helpWork = true;
      }
    }
    if (sec == "flex") {
      if (this.helpWorkFlex) {
        this.helpWorkFlex = false;
      } else {
        this.helpWorkFlex = true;
      }
    }
  }

  WorkProfileHistoryModel() {
    //changehere
  }

  editIsFlexibleDiv = false;
  worktimeDropConfig;

  editCallDaysandTiming() {
    this.workStartHoursData = [
      {
        id: null,
        description: "select",
      },
      {
        id: "6:00 AM",
        description: "6:00 AM",
      },
      {
        id: "6:30 AM",
        description: "6:30 AM",
      },
      {
        id: "7:00 AM",
        description: "7:00 AM",
      },
      {
        id: "7:30 AM",
        description: "7:30 AM",
      },
      {
        id: "8:00 AM",
        description: "8:00 AM",
      },
      {
        id: "8:30 AM",
        description: "8:30 AM",
      },
      {
        id: "9:00 AM",
        description: "9:00 AM",
      },
      {
        id: "9:30 AM",
        description: "9:30 AM",
      },
      {
        id: "10:00 AM",
        description: "10:00 AM",
      },
      {
        id: "10:30 AM",
        description: "10:30 AM",
      },
      {
        id: "11:00 AM",
        description: "11:00 AM",
      },
      {
        id: "11:30 AM",
        description: "11:30 AM",
      },
      {
        id: "12:00 PM",
        description: "12:00 PM",
      },
      {
        id: "12:30 PM",
        description: "12:30 PM",
      },
      {
        id: "1:00 PM",
        description: "1:00 PM",
      },
      {
        id: "1:30 PM",
        description: "1:30 PM",
      },
      {
        id: "2:00 PM",
        description: "2:00 PM",
      },
      {
        id: "2:30 PM",
        description: "2:30 PM",
      },
      {
        id: "3:00 PM",
        description: "3:00 PM",
      },
      {
        id: "3:30 PM",
        description: "3:30 PM",
      },
      {
        id: "4:00 PM",
        description: "4:00 PM",
      },
      {
        id: "4:30 PM",
        description: "4:30 PM",
      },
      {
        id: "5:00 PM",
        description: "5:00 PM",
      },
      {
        id: "5:30 PM",
        description: "5:30 PM",
      },
      {
        id: "6:00 PM",
        description: "6:00 PM",
      },
      {
        id: "6:30 PM",
        description: "6:30 PM",
      },
      {
        id: "7:00 PM",
        description: "7:00 PM",
      },
      {
        id: "7:30 PM",
        description: "7:30 PM",
      },
    ];
    this.workEndHoursData = [
      {
        id: null,
        description: "select",
      },
      {
        id: "12:00 PM",
        description: "12:00 PM",
      },
      {
        id: "12:30 PM",
        description: "12:30 PM",
      },
      {
        id: "1:00 PM",
        description: "1:00 PM",
      },
      {
        id: "2:00 PM",
        description: "2:00 PM",
      },
      {
        id: "3:00 PM",
        description: "3:00 PM",
      },
      {
        id: "4:00 PM",
        description: "4:00 PM",
      },
      {
        id: "4:30 PM",
        description: "4:30 PM",
      },
      {
        id: "5:00 PM",
        description: "5:00 PM",
      },
      {
        id: "5:30 PM",
        description: "5:30 PM",
      },
      {
        id: "6:00 PM",
        description: "6:00 PM",
      },
      {
        id: "6:30 PM",
        description: "6:30 PM",
      },
      {
        id: "7:00 PM",
        description: "7:00 PM",
      },
      {
        id: "7:30 PM",
        description: "7:30 PM",
      },
      {
        id: "8:00 PM",
        description: "8:00 PM",
      },
      {
        id: "8:30 PM",
        description: "8:30 PM",
      },
      {
        id: "9:00 PM",
        description: "9:00 PM",
      },
      {
        id: "9:00 PM",
        description: "9:00 PM",
      },
      {
        id: "9:30 PM",
        description: "9:30 PM",
      },
      {
        id: "10:00 PM",
        description: "10:00 PM",
      },
      {
        id: "10:30 PM",
        description: "10:30 PM",
      },
      {
        id: "11:00 PM",
        description: "11:00 PM",
      },
      {
        id: "11:30 PM",
        description: "11:30 PM",
      },
      {
        id: "12:00 AM",
        description: "12:00 AM",
      },
    ];
    this.workTotalHoursData = [
      {
        id: null,
        description: "Select",
      },
      {
        id: "4h 00m",
        description: "4h 00m",
      },
      {
        id: "5h 00m",
        description: "5h 00m",
      },
      {
        id: "6h 00m",
        description: "6h 00m",
      },
      {
        id: "7h 00m",
        description: "7h 00m",
      },
      {
        id: "7h 30m",
        description: "7h 30m",
      },
      {
        id: "8h 00m",
        description: "8h 00m",
      },
      {
        id: "8h 30m",
        description: "8h 30m",
      },
      {
        id: "9h 00m",
        description: "9h 00m",
      },
      {
        id: "9hr 30m",
        description: "9h 30m",
      },
      {
        id: "10hr 00m",
        description: "10h 00m",
      },
    ];
    console.log("loading the time formats");
  }

  selectWorkStart(event) {
    this.editDropDownsForm.patchValue({
      StartSaturday: event["value"],
      StartSunday: event["value"],
      StartMonday: event["value"],
      StartTuesday: event["value"],
      StartWednesday: event["value"],
      StartThursday: event["value"],
      StartFriday: event["value"],
    });
  }
  selectWorkEnd(event) {
    this.editDropDownsForm.patchValue({
      EndSaturday: event["value"],
      EndSunday: event["value"],
      EndMonday: event["value"],
      EndTuesday: event["value"],
      EndWednesday: event["value"],
      EndThursday: event["value"],
      EndFriday: event["value"],
    });
  }

  selectTolerance(event) {
    this.editDropDownsForm.patchValue({
      tosa: event["value"],
      tosu: event["value"],
      tomo: event["value"],
      totu: event["value"],
      towe: event["value"],
      toth: event["value"],
      tofr: event["value"],
    });
  }

  selectMinimum(event) {
    this.editDropDownsForm.patchValue({
      misa: event["value"],
      misu: event["value"],
      mimo: event["value"],
      mitu: event["value"],
      miwe: event["value"],
      mith: event["value"],
      mifr: event["value"],
    });
  }

  timelimits = [
    {
      id: "0 min",
      description: "0 min",
    },
    {
      id: "5 min",
      description: "5 min",
    },
    {
      id: "10 min",
      description: "10 min",
    },
    {
      id: "15 min",
      description: "15 min",
    },
    {
      id: "20 min",
      description: "20 min",
    },
    {
      id: "25 min",
      description: "25 min",
    },
    {
      id: "30 min",
      description: "30 min",
    },
    {
      id: "45 min",
      description: "45 min",
    },
    {
      id: "1 hour",
      description: "1 hour",
    },
    {
      id: "1h 30m",
      description: "1h 30m",
    },
    {
      id: "2 hour",
      description: "2 hour",
    },
    {
      id: "3 hour",
      description: "3 hour",
    },
  ];

  editWorkDayExp = [];

  InputeditWorkDayExp() {
    this.editWorkDayExp = [];
    this.editWorkDayExp.push(
      {
        day: "SA",
        day_name: "Saturday.",
        is_working: false,
      },
      {
        day: "SU",
        day_name: "Sunday.",
        is_working: false,
      },
      {
        day: "MO",
        day_name: "Monday.",
        is_working: false,
      },
      {
        day: "TU",
        day_name: "Tuesday.",
        is_working: false,
      },
      {
        day: "WE",
        day_name: "Wednesday.",
        is_working: false,
      },
      {
        day: "TH",
        day_name: "Thursday.",
        is_working: false,
      },
      {
        day: "FR",
        day_name: "Friday.",
        is_working: false,
      }
    );
    this.editSelectedteam = {
      working_days: [
        {
          day: "SA",
          day_name: "Saturday",
          is_working: false,
        },
        {
          day: "SU",
          day_name: "Sunday",
          is_working: true,
        },
        {
          day: "MO",
          day_name: "Monday",
          is_working: true,
        },
        {
          day: "TU",
          day_name: "Tuesday",
          is_working: true,
        },
        {
          day: "WE",
          day_name: "Wednesday",
          is_working: true,
        },
        {
          day: "TH",
          day_name: "Thursday",
          is_working: true,
        },
        {
          day: "FR",
          day_name: "Friday",
          is_working: false,
        },
      ],
    };
  }

  //editWorkdaysData;

  editWorkDayExpcheck(e: any) {
    let compare = e.target.value.slice(0, -1);
    console.log("checked function", e);
    this.editWorkDayExp.map((elm) => {
      if (elm.day_name === e.target.value) {
        elm.is_working = e.srcElement.checked;

        this.editSelectedteam.working_days.map((elm) => {
          if (elm.day_name === compare) {
            if (e.srcElement.checked == true) {
              elm.is_working = !e.srcElement.checked;
            }
          }
        });
      }
    });
  }

  manageWorkHrsByWeekDays(e) {
    if (e.srcElement.checked === true) {
      this.managed = true;
    } else {
      this.managed = false;
    }
  }

  editChangeWorkingDays(e) {
    let compare = e.target.value + ".";
    this.editSelectedteam.working_days.map((elm) => {
      if (elm.day_name === e.target.value) {
        elm.is_working = e.srcElement.checked;
        this.editWorkDayExp.map((elm) => {
          if (elm.day_name == compare) {
            if (e.srcElement.checked == true) {
              elm.is_working = !e.srcElement.checked;
            }
          }
        });
      }
    });
    // console.log(compare)
  }

  saeditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.saeditIsFlexibleDiv = true;
    } else {
      this.saeditIsFlexibleDiv = false;
    }
  }

  sueditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.sueditIsFlexibleDiv = true;
    } else {
      this.sueditIsFlexibleDiv = false;
    }
  }

  moeditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.moeditIsFlexibleDiv = true;
    } else {
      this.moeditIsFlexibleDiv = false;
    }
  }

  tueditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.tueditIsFlexibleDiv = true;
    } else {
      this.tueditIsFlexibleDiv = false;
    }
  }

  weeditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.weeditIsFlexibleDiv = true;
    } else {
      this.weeditIsFlexibleDiv = false;
    }
  }

  theditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.theditIsFlexibleDiv = true;
    } else {
      this.theditIsFlexibleDiv = false;
    }
  }

  freditIsFlexed(e) {
    if (e.srcElement.checked === true) {
      this.freditIsFlexibleDiv = true;
    } else {
      this.freditIsFlexibleDiv = false;
    }
  }
}
