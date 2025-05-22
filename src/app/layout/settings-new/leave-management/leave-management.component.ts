import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
//packages
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ToolbarItems, GridComponent } from "@syncfusion/ej2-angular-grids";
import {
  Tab,
  TabComponent,
  SelectingEventArgs,
  SelectEventArgs,
} from "@syncfusion/ej2-angular-navigations";
//reactive form
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import * as _ from "lodash";
//service
import { AdministrativeService } from "../../../services/administrative.service";
import { ModuleSetupService } from "../../../services/moduleSetup.service";
import { LeaveService } from "../../../services/leave.service";
import moment = require("moment");
import { get } from "jquery";

//js
declare var $: any;

@Component({
  selector: "app-leave-management",
  templateUrl: "./leave-management.component.html",
  styleUrls: ["./leave-management.component.scss"],
})
export class LeaveManagementComponent implements OnInit {
  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.escapeButtonPressed(event.code);
  }

  @ViewChild("deleteProfile", { static: false }) deleteProfile: any;

  allLeaveProfileData;
  noDefaultleaveProfileData;
  DefaultleaveProfileData;
  public addLeaveProfileForm: FormGroup;
  public addCyclingLeaveForm: FormGroup;

  public deptOptions: Select2Options;
  public deptOptions2: Select2Options;
  public deptOptions3: Select2Options;

  leaveTypeData = ["Paid", "Unpaid"];

  organizationID;
  currentUserID;
  public dateValue = moment().format("ddd, D MMM YYYY");

  //aprover
  existingProfileData: { id: string; text: string }[];

  probationPeriodData = [
    { id: 0, text: "Select" },
    { id: 1, text: "1 month" },
    { id: 2, text: "2 month" },
    { id: 3, text: "3 month" },
    { id: 4, text: "4 month" },
    { id: 5, text: "5 month" },
    { id: 6, text: "6 month" },
    { id: 7, text: "7 month" },
    { id: 8, text: "8 month" },
    { id: 9, text: "9 month" },
    { id: 10, text: "10 month" },
    { id: 11, text: "11 month" },
    { id: 12, text: "12 month" },
  ];

  viewProfileModelData;
  //editVar
  createdProfileDate;
  createdEmployeeID;
  createdProfileUniqueID;

  editedProfileData;

  editIsDefaultProfile = false;
  sameProfileName = false;

  deleteProfileData;
  usersAssignedToProfile;

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private admService: AdministrativeService,
    public ModuleSetupService: ModuleSetupService,
    public leaveService: LeaveService,
    public Router: Router
  ) {
    this.deptOptions = {
      placeholder: "Select a Approver type",
      width: "100%",
    };

    this.deptOptions2 = {
      placeholder: "Select a Profile",
      width: "100%",
    };

    this.deptOptions3 = {
      placeholder: "Select a Probation Period",
      width: "100%",
    };
  }

  //form validate functions
  createaddLeaveProfileForm() {
    this.addLeaveProfileForm = this.formBuilder.group({
      profileName: ["", [Validators.required]],
      effectiveDate: ["", [Validators.required]],
      probation: ["", [Validators.required]],
      leaveDetails: this.formBuilder.array([]),
      isProbationLeave: [""],
      annualLeave: ["Annual leave"],
      annualleaveType: ["", [Validators.required]],
      annualleaveNum: ["", [Validators.required]],
      halfDayMinHours: [0, [Validators.required]],
      calculateAnuFrom: [""],
      annualFullAvail: ["calender"],
      eligibilityMethod: [""],
      sickLeave: ["Sick leave"],
      sickleaveType: ["", [Validators.required]],
      sickleaveNum: ["", [Validators.required]],
      is_full_eoy: ["calender"],
      calculateSickFrom: [""],
      sickeligibilityMethod: [""],
      isProbationLeaveSick: [""],
      annualleaveCarryFow: [
        "",
        [Validators.pattern(/\b([0-9]|1[0-9]|2[0])\b/)],
      ],
      isUnUsedEligible: [""],
      isUnUsedEligibleSick: [""],
    });
  }
  createCyclingLeaveFormGroup(): FormGroup {
    return this.formBuilder.group({
      leaveName: ["", [Validators.required]],
      leaveType: ["paid"],
      leaveNum: ["", [Validators.required]],
      incident: [false],
      eligibilityMethod: ["Accrued", { disabled: false }],
      calculateFrom: ["Calendar", { disabled: false }],
      probation: ["no", { disabled: false }],
      gratuity: ["no", { disabled: false }],
      id: [""],
    });
  }
  get leaveDetailsFormArray() {
    return this.addCyclingLeaveForm.get("leaveDetails") as FormArray;
  }
  createaddCyclingLeaveForm() {
    this.addCyclingLeaveForm = this.formBuilder.group({
      leaveDetails: this.formBuilder.array([
        this.createCyclingLeaveFormGroup(),
      ]),
    });
  }
  addLeaveDetail() {
    const leaveDetailsFormArray = this.addCyclingLeaveForm.get(
      "leaveDetails"
    ) as FormArray;
    leaveDetailsFormArray.push(this.createCyclingLeaveFormGroup());
    console.log(
      "Adding the leaves ",
      this.addCyclingLeaveForm.value,
      "this.addCyclingLeaveForm.value"
    );
  }

  ngOnInit() {
    this.spinner.show();
    this.organizationID = localStorage.getItem("org_id");
    let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
    this.currentUserID = userDataLocal.id;
    this.getAllProfilebyOrgID(this.organizationID);
    this.createaddCyclingLeaveForm();
    this.createaddLeaveProfileForm();
    this.createaddGratuityForm();
  }
  //Handle Incident Leave
  handleIncidentChange(index: number, newValue: boolean) {
    console.log(newValue);
    const leaveDetailsArray = this.addCyclingLeaveForm.get(
      "leaveDetails"
    ) as FormArray;
    const specificLeaveDetail = leaveDetailsArray.at(index) as FormGroup;

    if (newValue === true) {
      specificLeaveDetail.get("probation").setValue("no");
      specificLeaveDetail.get("eligibilityMethod").setValue("Full");
      specificLeaveDetail.get("gratuity").setValue("no");
      specificLeaveDetail.get("calculateFrom").setValue("Calendar");
      //disble fields
      specificLeaveDetail.get("probation").disable();
      specificLeaveDetail.get("eligibilityMethod").disable();
      specificLeaveDetail.get("gratuity").disable();
      specificLeaveDetail.get("calculateFrom").disable();
    } else {
      specificLeaveDetail.get("probation").enable();
      specificLeaveDetail.get("eligibilityMethod").enable();
      specificLeaveDetail.get("gratuity").enable();
      specificLeaveDetail.get("calculateFrom").enable();
    }
    specificLeaveDetail.get("incident").setValue(newValue);
  }

  //get all profile for current org
  getAllProfilebyOrgID(id) {
    let postData = { orgID: id };
    this.admService
      .GetAllLeaveProfileSetupByOrgID(postData)
      .subscribe((data: any) => {
        //console.log(data)
        let serverData = [];
        data.map((elm) => {
          if (elm.is_approved === true) {
            serverData.push(elm);
          }
        });

        if (serverData.length === 0) {
          let uuid = this.generateId(15);
          let defaultArr = [
            {
              id: uuid,
              org_id: this.organizationID,
              leave_profile_name: "UAE Leave Profile",
              leave_name: "Annual leave",
              leave_type: "paid",
              entitled_leave_days: 30,
              carry_forward_days: 0,
              is_calendar_days: true,
              created_by_empId: this.currentUserID,
              modified_by_empId: this.currentUserID,
              is_super_admin: true,
              is_approved: true,
              is_leave_on_probation: false,
              is_default: true,
              is_accrued: true,
              week_ot_by: "Basic Salary",
              holi_ot_by: "Basic Salary",
              ot_week: 1.25,
              ot_holi: 1.5,
              gtStartYear: 1,
              gtSecondYear: 5,
              gtCalcDayOne: 21,
              gtCalcDayTwo: 30,
            },
            {
              id: uuid,
              org_id: this.organizationID,
              leave_profile_name: "UAE Leave Profile",
              leave_name: "Sick Leave",
              leave_type: "paid",
              entitled_leave_days: 15,
              carry_forward_days: 0,
              is_calendar_days: true,
              created_by_empId: this.currentUserID,
              modified_by_empId: this.currentUserID,
              is_super_admin: true,
              is_approved: true,
              is_leave_on_probation: false,
              is_default: true,
              is_accrued: true,
              week_ot_by: "Basic Salary",
              holi_ot_by: "Basic Salary",
              ot_week: 1.25,
              ot_holi: 1.5,
              gtStartYear: 1,
              gtSecondYear: 5,
              gtCalcDayOne: 21,
              gtCalcDayTwo: 30,
            },
            {
              id: uuid,
              org_id: this.organizationID,
              leave_profile_name: "UAE Leave Profile",
              leave_name: "Sabbatical leave",
              leave_type: "paid",
              entitled_leave_days: 30,
              carry_forward_days: 0,
              is_calendar_days: true,
              created_by_empId: this.currentUserID,
              modified_by_empId: this.currentUserID,
              is_super_admin: true,
              is_approved: true,
              is_leave_on_probation: false,
              is_default: true,
              is_accrued: true,
              week_ot_by: "Basic Salary",
              holi_ot_by: "Basic Salary",
              ot_week: 1.25,
              ot_holi: 1.5,
              gtStartYear: 1,
              gtSecondYear: 5,
              gtCalcDayOne: 21,
              gtCalcDayTwo: 30,
            },
            {
              id: uuid,
              org_id: this.organizationID,
              leave_profile_name: "UAE Leave Profile",
              leave_name: "Maternity leave",
              leave_type: "paid",
              entitled_leave_days: 60,
              carry_forward_days: 0,
              is_calendar_days: true,
              created_by_empId: this.currentUserID,
              modified_by_empId: this.currentUserID,
              is_super_admin: true,
              is_approved: true,
              is_leave_on_probation: false,
              is_default: true,
              is_accrued: true,
              week_ot_by: "Basic Salary",
              holi_ot_by: "Basic Salary",
              ot_week: 1.25,
              ot_holi: 1.5,
              gtStartYear: 1,
              gtSecondYear: 5,
              gtCalcDayOne: 21,
              gtCalcDayTwo: 30,
            },
          ];
          this.createDeaultProfile(defaultArr);
          this.spinner.hide();
        } else {
          this.allLeaveProfileData = [];
          this.noDefaultleaveProfileData = [];
          this.DefaultleaveProfileData = [];
          serverData.map((elm) => {
            let postData = { id: elm.created_by_empId };
            this.admService.FindByEmpID(postData).subscribe((userData: any) => {
              elm["createdBy_Name"] = userData.full_name;
            });
            if (elm.is_default === true) {
              this.DefaultleaveProfileData.push(elm);
            } else {
              this.noDefaultleaveProfileData.push(elm);
            }
            this.allLeaveProfileData.push(elm);
          });
          this.spinner.hide();
        }
      });
  }

  createDeaultProfile(data) {
    let finalSendData = {
      leaveProfileSetup: data,
    };
    this.admService
      .AddLeaveProfileSetup(finalSendData)
      .subscribe((data: any) => {
        if (data.status === "200") {
          this.getAllProfilebyOrgID(this.organizationID);
        }
      });
  }

  //display current profile
  viewCurProfile(content, profData) {
    //console.log(profData)
    this.spinner.show();
    this.modalService.open(content);
    this.viewProfileModelData = profData;
    let profileData = {
      org_id: profData.org_id,
      leave_profile_setup_id: profData.leaveDetails[0].id,
    };
    this.leaveService
      .GetEmployeeByOrgIDAndProfileID(profileData)
      .subscribe((data: any) => {
        this.viewProfileModelData["userNumber"] = data.length;
        this.spinner.hide();
      });
  }

  //close display current profile
  closeProfileViewModel() {
    this.modalService.dismissAll();
    this.viewProfileModelData = "";
  }

  //delete the current profile
  deleteCurProfile(profData) {
    this.deleteProfileData = profData;
    let profileData = {
      org_id: this.deleteProfileData.org_id,
      leave_profile_setup_id: this.deleteProfileData.leaveDetails[0].id,
    };
    this.leaveService
      .GetEmployeeByOrgIDAndProfileID(profileData)
      .subscribe((data: any) => {
        console.log(data);
        if (data.length === 0) {
          Swal.fire({
            title: "Delete this Profile ?",
            text: "Please Note you won't be able to revert this",
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: " Confirm",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.value === true) {
              this.deleteLeaveProfile();
            }
          });
        } else {
          this.modalService.open(this.deleteProfile);
          this.usersAssignedToProfile = data;
        }
      });
  }

  deleteLeaveProfile() {
    let postData = {
      org_id: this.deleteProfileData.org_id,
      id: this.deleteProfileData.leaveDetails[0].id,
    };
    this.admService
      .RemoveLeaveProfileByOrgIDAndProfileName(postData)
      .subscribe((data: any) => {
        //console.log(data)
        if (data.status === "200") {
          this.successToast(data.desc);
          this.getAllProfilebyOrgID(this.organizationID);
        } else {
          this.failerToast();
        }
      });
  }

  closeDeleteLeaveProfileViewModel() {
    this.modalService.dismissAll();
  }
  //get pre existing profile
  getSelectedProfile(event) {
    console.log(event, "CHECK", this.allLeaveProfileData);
    const foundElm = this.allLeaveProfileData.find(
      (elm) => elm.leaveDetails[0].id === event.value
    );
    console.log(foundElm, "foundElm");
    if (foundElm && foundElm.leaveDetails.length > 0) {
      let formData = this.addLeaveProfileForm.get("leaveDetails") as FormArray;
      const cyclingLeaveFormArray = this.addCyclingLeaveForm.get(
        "leaveDetails"
      ) as FormArray;
      formData.clear();
      cyclingLeaveFormArray.clear();
      console.log("profiledata", foundElm);
      console.log("formData", formData);
      foundElm.leaveDetails.map((elm) => {
        console.log("Leave Name", elm.leave_name.toString().toUpperCase());
        if (elm.leave_name.toString().toUpperCase() === "ANNUAL LEAVE") {
          this.addLeaveProfileForm.patchValue({
            profileName: elm.leave_profile_name,
            probation: elm.probationPeriod,
            annualLeave: elm.leave_name,
            annualleaveType: elm.leave_type,
            annualleaveNum: elm.entitled_leave_days.trim(),
            isProbationLeave: elm.is_leave_on_probation === true ? "yes" : "no",
            annualleaveCarryFow: elm.carry_forward_days,
            calculateAnuFrom:
              elm.is_calendar_days === true ? "Calendar" : "Working",
            eligibilityMethod: elm.is_accrued === true ? "Accrued" : "Full",
            isUnUsedEligible:
              elm.is_unused_leave_eligible === true ? "yes" : "no",
          });
        } else if (elm.leave_name.toString().toUpperCase() === "SICK LEAVE") {
          console.log("Inside sick");

          this.addLeaveProfileForm.patchValue({
            sickLeave: elm.leave_name,
            sickleaveType: elm.leave_type,
            sickleaveNum: elm.entitled_leave_days.trim(),
            isProbationLeaveSick:
              elm.is_leave_on_probation === true ? "yes" : "no",
            calculateSickFrom:
              elm.is_calendar_days === true ? "Calendar" : "Working",
            sickeligibilityMethod: elm.is_accrued === true ? "Accrued" : "Full",
            isUnUsedEligibleSick:
              elm.is_unused_leave_eligible === true ? "yes" : "no",
            is_full_eoy: elm.is_full_eoy ===true? "calender" : "contract",
          });
        } else {
          console.log(elm, "TEST!");
          const newCyclingLeaveGroup = this.createCyclingLeaveFormGroup();
          newCyclingLeaveGroup.patchValue({
            leaveName: elm.leave_name,
            leaveType: elm.leave_type,
            incident: elm.is_incident,
            leaveNum: elm.entitled_leave_days.trim(),
            eligibilityMethod: elm.is_accrued === true ? "Accrued" : "Full",
            calculateFrom:
              elm.is_calendar_days === true ? "Calendar" : "Working",
            probation: elm.is_leave_on_probation === true ? "yes" : "no",
            id: "",
          });

          cyclingLeaveFormArray.push(newCyclingLeaveGroup);
        }
      });
      console.log("cyclingLeaveFormArray", cyclingLeaveFormArray);
      this.toastr.success("Profile Applied Successfully");
    }
    // this.allLeaveProfileData.map((elm) => {
    //   if (elm.leaveDetails[0].id === event.value) {
    //     let selectedProfileData: any = {
    //       annualleaveType: elm.leaveDetails[0].leave_type,
    //       annualleaveNum: elm.leaveDetails[0].entitled_leave_days.trim(),
    //       annualleaveCarryFow: elm.leaveDetails[0].carry_forward_days,
    //       calculateAnuFrom: elm.is_calendar_days,
    //       isProbationLeave: elm.is_leave_on_probation,
    //       eligibilityMethod: elm.is_accrued,
    //     };
    //     let leaveData = [];
    //     elm.leaveDetails.map((elm2) => {
    //       if (elm2.leave_name !== "Annual leave") {
    //         leaveData.push({
    //           LeaveName: elm2.leave_name,
    //           leaveType: elm2.leave_type,
    //           NumberOfDays: elm2.entitled_leave_days.trim(),
    //         });
    //       }
    //     });
    //     selectedProfileData["leaveDetails"] = leaveData;
    //     let formData = this.addLeaveProfileForm.get(
    //       "leaveDetails"
    //     ) as FormArray;
    //     formData.clear();
    //     this.addLeaveProfileForm.patchValue({
    //       annualleaveType: selectedProfileData.annualleaveType,
    //       annualleaveNum: selectedProfileData.annualleaveNum,
    //       annualleaveCarryFow: selectedProfileData.annualleaveCarryFow,
    //       calculateAnuFrom:
    //         selectedProfileData.calculateAnuFrom === true
    //           ? "Calendar"
    //           : "Working",
    //       isProbationLeave:
    //         selectedProfileData.iisProbationLeave === true ? "yes" : "no",
    //       eligibilityMethod:
    //         selectedProfileData.eligibilityMethod === true ? "Accrued" : "Full",
    //     });
    //     selectedProfileData.leaveDetails.map((elm) => {
    //       formData.push(
    //         this.formBuilder.group({
    //           LeaveName: elm.LeaveName,
    //           leaveType: elm.leaveType,
    //           NumberOfDays: elm.NumberOfDays,
    //         })
    //       );
    //     });
    //   }
    // });
  }

  //update model call
  editCurProfile(profiledata) {
    console.log("profiledata", profiledata);
    this.createdProfileDate = profiledata.created_date;
    this.createdEmployeeID = profiledata.created_by_empId;
    this.createdProfileUniqueID = profiledata.leaveDetails[0].id;
    this.selectedProbation = profiledata.leaveDetails[0].probationPeriod;

    $("#leave_Profile_Form_Edit_modal").modal("show");
    let formData = this.addLeaveProfileForm.get("leaveDetails") as FormArray;
    const cyclingLeaveFormArray = this.addCyclingLeaveForm.get(
      "leaveDetails"
    ) as FormArray;
    cyclingLeaveFormArray.clear();

    profiledata.leaveDetails.map((elm, index) => {
      this.selectedProbation = elm.probationPeriod;
      if (elm.leave_name.toString().toUpperCase() === "ANNUAL LEAVE") {
        this.addLeaveProfileForm.patchValue({
          profileName: elm.leave_profile_name,
          effectiveDate: moment(elm.effective_from_date).format("ll"),
          probation: elm.probationPeriod,
          annualLeave: elm.leave_name,
          annualleaveType: elm.leave_type,
          annualleaveNum: elm.entitled_leave_days.trim(),
          isProbationLeave: elm.is_leave_on_probation === true ? "yes" : "no",
          annualleaveCarryFow: elm.carry_forward_days,
          calculateAnuFrom:
            elm.is_calendar_days === true ? "Calendar" : "Working",
          eligibilityMethod: elm.is_accrued === true ? "Accrued" : "Full",
          isUnUsedEligible:
            elm.is_unused_leave_eligible === true ? "yes" : "no",
            halfDayMinHours:elm.half_day_min_hours
        });
      } else if (elm.leave_name.toString().toUpperCase() === "SICK LEAVE") {
        console.log(elm,"Inside sick");

        this.addLeaveProfileForm.patchValue({
          sickLeave: elm.leave_name,
          sickleaveType: elm.leave_type,
          sickleaveNum: elm.entitled_leave_days.trim(),
          isProbationLeaveSick:
            elm.is_leave_on_probation === true ? "yes" : "no",
          calculateSickFrom:
            elm.is_calendar_days === true ? "Calendar" : "Working",
          sickeligibilityMethod: elm.is_accrued === true ? "Accrued" : "Full",
          isUnUsedEligibleSick:
            elm.is_unused_leave_eligible === true ? "yes" : "no",
          is_full_eoy: elm.is_full_eoy === true ? "calender" : "contract",
        });
      } else {
        console.log(elm, "TEST!");
        const newCyclingLeaveGroup = this.createCyclingLeaveFormGroup();
        newCyclingLeaveGroup.patchValue({
          leaveName: elm.leave_name,
          leaveType: elm.leave_type,
          incident: elm.is_incident,
          leaveNum: elm.entitled_leave_days.trim(),
          eligibilityMethod: elm.is_accrued === true ? "Accrued" : "Full",
          calculateFrom: elm.is_calendar_days === true ? "Calendar" : "Working",
          probation: elm.is_leave_on_probation === true ? "yes" : "no",
          id: elm.id,
        });

        cyclingLeaveFormArray.push(newCyclingLeaveGroup);
        console.log("formarray", cyclingLeaveFormArray);
        console.log("index", index);

        if (elm.is_incident === true) {
          let specificLeaveDetail = cyclingLeaveFormArray.at(
            index - 2
          ) as FormGroup;
          specificLeaveDetail.get("probation").disable();
          specificLeaveDetail.get("eligibilityMethod").disable();
          specificLeaveDetail.get("gratuity").disable();
          specificLeaveDetail.get("calculateFrom").disable();
        }
      }
    });
    console.log("cyclingLeaveFormArray", cyclingLeaveFormArray);

    this.editIsDefaultProfile = profiledata.leaveDetails[0].is_default;
    this.editedProfileData = profiledata.leaveDetails;

    this.addGratuityForm.patchValue({
      setOTweek: profiledata.ot_week,
      setOTholi: profiledata.ot_holi,
      firstYear: profiledata.gtStartYear,
      secondYear: profiledata.gtSecondYear,
      calcDaysOne: profiledata.gtCalcDayOne,
      calcDaysTwo: profiledata.gtCalcDayTwo,
      gratuityStartDate: profiledata.gtStartDate,
    });

    this.selectedweekdayOverCalc = profiledata.week_ot_by;
    this.selectedholidayOverCalc = profiledata.holi_ot_by;

    if (profiledata.week_ot_by != "Basic Salary") {
      this.radioButtonWeekBasic = false;
      this.radioButtonWeekNetSal = true;
    } else {
      this.radioButtonWeekBasic = true;
      this.radioButtonWeekNetSal = false;
    }

    if (profiledata.holi_ot_by != "Basic Salary") {
      this.radioButtonHoliBasic = false;
      this.radioButtonHoliNetSal = true;
    } else {
      this.radioButtonHoliBasic = true;
      this.radioButtonHoliNetSal = false;
    }

    this.firstYear = profiledata.gtStartYear.toString();
    this.secondYear = profiledata.gtSecondYear.toString();
    this.calcDaysOne = profiledata.gtCalcDayOne;
    this.calcDaysTwo = profiledata.gtCalcDayTwo;
  }

  addeditLeaveDetail() {
    const leaveDetailsFormArray = this.addLeaveProfileForm.get(
      "leaveDetails"
    ) as FormArray;
    leaveDetailsFormArray.push(this.createCyclingLeaveFormGroup());
  }

  editCheckForDefaultProfile(event) {
    //console.log(event)
    if (
      event.srcElement.checked === true &&
      this.editIsDefaultProfile === false
    ) {
      let postData2 = { orgID: localStorage.getItem("org_id") };
      this.leaveService
        .GetDefaultLeaveProfileSetupByOrgID(postData2)
        .subscribe((data: any) => {
          //console.log(data)
          if (data.length === 0) {
            let desc = "Default profile added successfully";
            this.editDefaultProfileToastSuccess(desc);
            this.editIsDefaultProfile = true;
          } else {
            let postData = {
              org_id: localStorage.getItem("org_id"),
              id: data[0].leaveDetails[0].id,
            };
            //console.log(postData)
            this.leaveService
              .DefaultToCommonProfileByOrgIDandProfileId(postData)
              .subscribe((data2: any) => {
                //console.log(data2)
                if (data2.status === "200") {
                  let desc = "Default profile added successfully";
                  this.editDefaultProfileToastSuccess(desc);
                  this.editIsDefaultProfile = true;
                }
              });
          }
        });
    } else if (
      event.srcElement.checked === false &&
      this.editIsDefaultProfile === true
    ) {
      this.editIsDefaultProfile = false;
      let desc = "Default profile removed successfully";
      this.editDefaultProfileToastSuccess(desc);
    }
  }

  editDefaultProfileToastSuccess(desc) {
    this.toastr.success(desc);
  }

  editDefaultProfileToastError(desc) {
    this.toastr.error(desc);
  }

  submitEditedProfile() {
    this.spinner.show();
    let getFormData = this.addLeaveProfileForm.value;
    let getGatFormData = this.addGratuityForm.value;
    let finalData = [];
    console.log(getFormData);
    let processData = {
      id: this.createdProfileUniqueID,
      org_id: this.organizationID,
      leave_profile_name: getFormData.profileName,
      leave_name: "Annual leave",
      leave_type: getFormData.annualleaveType,
      half_day_min_hours:getFormData.halfDayMinHours,
      // annualFullAvail: getFormData.annualFullAvail,
      entitled_leave_days: getFormData.annualleaveNum,
      carry_forward_days: 0,
      is_calendar_days:
        getFormData.calculateAnuFrom !== ""
          ? getFormData.calculateAnuFrom === "Working"
            ? false
            : true
          : true,
      created_by_empId: this.createdEmployeeID,
      modified_by_empId: this.currentUserID,
      is_super_admin: true,
      is_approved: true,
      is_default: this.editIsDefaultProfile,
      is_leave_on_probation:
        getFormData.isProbationLeave !== ""
          ? getFormData.isProbationLeave === "yes"
            ? true
            : false
          : false,
      is_accrued:
        getFormData.eligibilityMethod !== ""
          ? getFormData.eligibilityMethod === "Accrued"
            ? true
            : false
          : true,
      week_ot_by: this.selectedweekdayOverCalc,
      holi_ot_by: this.selectedholidayOverCalc,
      ot_week: getGatFormData.setOTweek,
      ot_holi: getGatFormData.setOTholi,
      gtStartYear: this.firstYear,
      gtSecondYear: this.secondYear,
      gtCalcDayOne: this.calcDaysOne,
      gtCalcDayTwo: this.calcDaysTwo,
      probationPeriod: this.selectedProbation,
      is_unused_leave_eligible: true,
      gtStartDate: getGatFormData.gratuityStartDate,
      created_date: this.createdProfileDate,
      is_incident: false,
      effective_from_date: moment(getFormData.effectiveDate).format("L"),
    };
    finalData.push(processData);
    // let processData = {
    //   id: this.createdProfileUniqueID,
    //   org_id: this.organizationID,
    //   leave_profile_name: getFormData.profileName,
    //   leave_name: getFormData.annualLeave,
    //   leave_type: getFormData.annualleaveType,
    //   entitled_leave_days: getFormData.annualleaveNum,
    //   carry_forward_days:
    //     getFormData.annualleaveCarryFow === "" ||
    //     getFormData.annualleaveCarryFow === null
    //       ? 0
    //       : getFormData.annualleaveCarryFow,
    //   created_date: this.createdProfileDate,
    //   is_calendar_days:
    //     getFormData.calculateAnuFrom !== ""
    //       ? getFormData.calculateAnuFrom === "Working"
    //         ? false
    //         : true
    //       : true,
    //   created_by_empId: this.createdEmployeeID,
    //   modified_by_empId: this.currentUserID,
    //   is_super_admin: true,
    //   is_approved: true,
    //   is_default: this.editIsDefaultProfile,
    //   is_leave_on_probation:
    //     getFormData.isProbationLeave === "yes" ? true : false,
    //   is_accrued: getFormData.eligibilityMethod === "Accrued" ? true : false,
    //   week_ot_by: this.selectedweekdayOverCalc,
    //   holi_ot_by: this.selectedholidayOverCalc,
    //   ot_week: getGatFormData.setOTweek,
    //   ot_holi: getGatFormData.setOTholi,
    //   gtStartYear: this.firstYear,
    //   gtSecondYear: this.secondYear,
    //   gtCalcDayOne: this.calcDaysOne,
    //   gtCalcDayTwo: this.calcDaysTwo,
    // };
    // finalData.push(processData);
    // getFormData.leaveDetails.map((elm)=> {
    //   if(elm.LeaveName != null && elm.NumberOfDays != null && elm.leaveType != null){
    //     processData = {
    //       "id": this.createdProfileUniqueID,
    //       "org_id": this.organizationID,
    //       "leave_profile_name": getFormData.profileName,
    //       "leave_name": elm.LeaveName,
    //       "leave_type": elm.leaveType,
    //       "entitled_leave_days": elm.NumberOfDays,
    //       "created_date": this.createdProfileDate,
    //       "carry_forward_days": 0,
    //       "is_calendar_days": true,
    //       "created_by_empId": this.createdEmployeeID,
    //       "modified_by_empId": this.currentUserID,
    //       "is_super_admin": true,
    //       "is_approved": true,
    //       "is_default": this.editIsDefaultProfile,
    //       "is_leave_on_probation": getFormData.isProbationLeave === 'yes' ? true : false,
    //       "is_accrued": getFormData.eligibilityMethod === 'Accrued' ? true : false,
    //       "week_ot_by": this.selectedweekdayOverCalc,
    //       "holi_ot_by": this.selectedholidayOverCalc,
    //       "ot_week":getGatFormData.setOTweek,
    //       "ot_holi":getGatFormData.setOTholi,
    //       "gtStartYear": this.firstYear,
    //       "gtSecondYear": this.secondYear,
    //       "gtCalcDayOne":  this.calcDaysOne,
    //       "gtCalcDayTwo": this.calcDaysTwo
    //     }
    //     finalData.push(processData);
    //   }
    // });
    let processData2 = {
      id: this.createdProfileUniqueID,
      org_id: this.organizationID,
      leave_profile_name: getFormData.profileName,
      leave_name: "Sick leave",
      leave_type: getFormData.sickleaveType,
      entitled_leave_days: getFormData.sickleaveNum,
      is_calendar_days:
        getFormData.calculateSickFrom !== ""
          ? getFormData.calculateSickFrom === "Working"
            ? false
            : true
          : true,
      created_by_empId: this.currentUserID,
      modified_by_empId: this.currentUserID,
      carry_forward_days: 0,
      is_super_admin: true,
      is_approved: true,
      is_default: this.editIsDefaultProfile,
      is_leave_on_probation:
        getFormData.isProbationLeaveSick !== ""
          ? getFormData.isProbationLeaveSick === "yes"
            ? true
            : false
          : false,
      is_accrued:
        getFormData.sickeligibilityMethod !== ""
          ? getFormData.sickeligibilityMethod === "Accrued"
            ? true
            : false
          : true,
      week_ot_by: this.selectedweekdayOverCalc,
      holi_ot_by: this.selectedholidayOverCalc,
      ot_week: getGatFormData.setOTweek,
      ot_holi: getGatFormData.setOTholi,
      gtStartYear: this.firstYear,
      gtSecondYear: this.secondYear,
      gtCalcDayOne: this.calcDaysOne,
      gtCalcDayTwo: this.calcDaysTwo,
      is_full_eoy: getFormData.is_full_eoy === "calender" ? true :false,
      probationPeriod: this.selectedProbation,
      is_unused_leave_eligible: getFormData.isUnusedLeaveEligible,
      gtStartDate: getGatFormData.gratuityStartDate,
      is_incident: false,
      created_date: this.createdProfileDate,
      effective_from_date: moment(getFormData.effectiveDate).format("L"),
    };
    finalData.push(processData2);
    let cycleFormData = this.addCyclingLeaveForm.value;
    console.log("cycleformdata", cycleFormData);
    cycleFormData.leaveDetails.map((elm) => {
      if (
        elm.leaveName != null &&
        elm.leaveNum != null &&
        elm.leaveType != null
      ) {
        console.log(
          "value for the incident leave",
          elm.incident,
          "type :",
          typeof elm.incident
        );
        console.log(
          "value for the eligibility leave",
          elm.eligibilityMethod,
          "type :",
          typeof elm.eligibilityMethod
        );

        processData = {
          id: this.createdProfileUniqueID,
          org_id: this.organizationID,
          leave_profile_name: getFormData.profileName,
          half_day_min_hours: 0,
          leave_name: elm.leaveName,
          leave_type: elm.leaveType,
          entitled_leave_days: elm.leaveNum,
          is_incident: elm.incident ? true : false,
          is_accrued:
            elm.eligibilityMethod !== ""
              ? elm.eligibilityMethod === "Accrued"
                ? true
                : false
              : true,
          is_calendar_days:
            elm.calculateFrom !== ""
              ? elm.calculateFrom === "Working"
                ? false
                : true
              : true,
          is_leave_on_probation:
            elm.probation !== ""
              ? elm.probation === "yes"
                ? true
                : false
              : false,
          is_unused_leave_eligible:
            elm.gratuity !== ""
              ? elm.probation === "yes"
                ? true
                : false
              : false,
          carry_forward_days: 0,

          created_by_empId: this.currentUserID,
          modified_by_empId: this.currentUserID,
          is_super_admin: true,
          is_approved: true,
          is_default: this.editIsDefaultProfile,

          week_ot_by: this.selectedweekdayOverCalc,
          holi_ot_by: this.selectedholidayOverCalc,
          ot_week: getGatFormData.setOTweek,
          ot_holi: getGatFormData.setOTholi,
          gtStartYear: this.firstYear,
          gtSecondYear: this.secondYear,
          gtCalcDayOne: this.calcDaysOne,
          gtCalcDayTwo: this.calcDaysTwo,
          probationPeriod: this.selectedProbation,
          gtStartDate: getGatFormData.gratuityStartDate,
          created_date: this.createdProfileDate,
          effective_from_date: moment(getFormData.effectiveDate).format("L"),
        };

        finalData.push(processData);
        console.log("process data", processData);
      }
    });

    let finalSendData = {
      leaveProfileSetup: finalData,
    };

    console.log("post for Update", finalSendData);
    this.admService
      .UpdateProfileByOrgIDandProfileNameOrProfileID(finalSendData)
      .subscribe((data: any) => {
        //console.log(data)
        this.spinner.hide();
        if (data.status === "200") {
          this.successToast(data.desc);
          this.closeEditLeaveProfileModel();
          this.getAllProfilebyOrgID(this.organizationID);
        } else {
          this.failerToast();
          this.closeEditLeaveProfileModel();
        }
      });
  }

  closeEditLeaveProfileModel() {
    $("#leave_Profile_Form_Edit_modal").modal("hide");
    this.editIsDefaultProfile = false;
    const add = this.addLeaveProfileForm.get("leaveDetails") as FormArray;
    add.clear();
    this.addLeaveProfileForm.reset();
    //this.addGratuityForm.reset();
    this.radioButtonWeekBasic = true;
    this.radioButtonWeekNetSal = false;
    this.selectedholidayOverCalc = "Basic Salary";
    this.radioButtonHoliBasic = true;
    this.radioButtonHoliNetSal = false;
    this.firstYear = "Select";
    this.secondYear = "Select";
    this.calcDaysOne = "";
    this.calcDaysTwo = "";
  }
  //update model call ends

  //Add New Profile starts
  //add new profile model
  addNewProfile() {
    $("#leave_Profile_Form_Create_modal").modal("show");

    this.addLeaveProfileForm.patchValue({
      annualLeave: "Annual leave",
      annualleaveType: "paid",
      annualleaveNum: 0,
      calculateAnuFrom: "Calendar",
      isProbationLeave: "no",
      eligibilityMethod: "Accrued",
      isUnUsedEligible: "yes",
    });

    this.addLeaveProfileForm.patchValue({
      sickLeave: "Sick leave",
      sickleaveType: "paid",
      sickleaveNum: 0,
      calculateSickFrom: "Calendar",
      isProbationLeaveSick: "no",
      sickeligibilityMethod: "Accrued",
      isUnUsedEligibleSick: "no",
    });
    const cyclingLeaveFormArray = this.addCyclingLeaveForm.get(
      "leaveDetails"
    ) as FormArray;
    cyclingLeaveFormArray.clear();

    this.addLeaveProfileForm.get("annualLeave").disable();
    this.addLeaveProfileForm.get("sickLeave").disable();

    this.addGratuityForm.patchValue({
      gratuityStartDate: "Joining",
      firstYear: 1,
      secondYear: 5,
      calcDaysOne: 21,
      calcDaysTwo: 30,
      setOTweek: 1.0,
      setOTholi: 1.0,
    });

    this.firstYear = "1";
    this.secondYear = "5";
    this.calcDaysOne = "21";
    this.calcDaysTwo = "30";

    this.existingProfileData = [{ id: "", text: "Select" }];

    this.allLeaveProfileData.map((elm) => {
      this.existingProfileData.push({
        id: elm.leaveDetails[0].id,
        text: elm.profileName,
      });
    });
  }

  //add new row (form array) array
  //delete new row (form array) array
  deleteNewRowLeave(index: number) {
    const add = this.addLeaveProfileForm.get("leaveDetails") as FormArray;
    add.removeAt(index);
  }
  deleteLeaveDetail(index: number) {
    const add = this.addCyclingLeaveForm.get("leaveDetails") as FormArray;
    add.removeAt(index);
  }
  //submit new leave profile
  checkSameNameProfile(event) {
    let postData = {
      orgID: this.organizationID,
      id: event.target.value,
    };
    this.admService.SearchLeavePofileName(postData).subscribe((data: any) => {
      console.log(data);
      if (data.length >= 0) {
        this.sameProfileName = true;
      } else {
        this.sameProfileName = false;
      }
    });
  }

  submitNewProfile() {
    //this.spinner.show();
    let getFormData = this.addLeaveProfileForm.value;
    let getGatFormData = this.addGratuityForm.value;

    console.log("Value from getFormData", getFormData);
    console.log("value from getGatFormData", getGatFormData);

    let uniqueID = this.generateId(20);
    let finalData = [];
    let processData = {
      id: uniqueID,
      org_id: this.organizationID,
      leave_profile_name: getFormData.profileName,
      leave_name: "Annual leave",
      leave_type: getFormData.annualleaveType,
      // annualFullAvail: getFormData.annualFullAvail,
      entitled_leave_days: getFormData.annualleaveNum,
      carry_forward_days: 0,
      is_calendar_days:
        getFormData.calculateAnuFrom !== ""
          ? getFormData.calculateAnuFrom === "Working"
            ? false
            : true
          : true,
      created_by_empId: this.currentUserID,
      modified_by_empId: this.currentUserID,
      is_super_admin: true,
      is_approved: true,
      is_default: false,
      is_leave_on_probation:
        getFormData.isProbationLeave !== ""
          ? getFormData.isProbationLeave === "yes"
            ? true
            : false
          : false,
      is_accrued:
        getFormData.eligibilityMethod !== ""
          ? getFormData.eligibilityMethod === "Accrued"
            ? true
            : false
          : true,
      week_ot_by: this.selectedweekdayOverCalc,
      holi_ot_by: this.selectedholidayOverCalc,
      ot_week: getGatFormData.setOTweek,
      ot_holi: getGatFormData.setOTholi,
      gtStartYear: this.firstYear,
      gtSecondYear: this.secondYear,
      gtCalcDayOne: this.calcDaysOne,
      gtCalcDayTwo: this.calcDaysTwo,
      probationPeriod: this.selectedProbation,
      is_unused_leave_eligible: true,
      gtStartDate: getGatFormData.gratuityStartDate,
      is_incident: false,
      effective_from_date: moment(getFormData.effectiveDate).format("L"),
    };
    finalData.push(processData);

    let processData2 = {
      id: uniqueID,
      org_id: this.organizationID,
      leave_profile_name: getFormData.profileName,
      leave_name: "Sick leave",
      leave_type: getFormData.sickleaveType,
      is_full_eoy:  getFormData.is_full_eoy === "calender" ? true :false,
      entitled_leave_days: getFormData.sickleaveNum,
      is_calendar_days:
        getFormData.calculateSickFrom !== ""
          ? getFormData.calculateSickFrom === "Working"
            ? false
            : true
          : true,
      created_by_empId: this.currentUserID,
      modified_by_empId: this.currentUserID,
      carry_forward_days: 0,
      is_super_admin: true,
      is_approved: true,
      is_default: false,
      is_leave_on_probation:
        getFormData.isProbationLeaveSick !== ""
          ? getFormData.isProbationLeaveSick === "yes"
            ? true
            : false
          : false,
      is_accrued:
        getFormData.sickeligibilityMethod !== ""
          ? getFormData.sickeligibilityMethod === "Accrued"
            ? true
            : false
          : true,
      week_ot_by: this.selectedweekdayOverCalc,
      holi_ot_by: this.selectedholidayOverCalc,
      ot_week: getGatFormData.setOTweek,
      ot_holi: getGatFormData.setOTholi,
      gtStartYear: this.firstYear,
      gtSecondYear: this.secondYear,
      gtCalcDayOne: this.calcDaysOne,
      gtCalcDayTwo: this.calcDaysTwo,
      probationPeriod: this.selectedProbation,
      is_unused_leave_eligible: getFormData.isUnUsedEligibleSick, //!!!
      gtStartDate: getGatFormData.gratuityStartDate,
      is_incident: false,
      effective_from_date: moment(getFormData.effectiveDate).format("L"),
    };

    finalData.push(processData2);

    let cycleFormData = this.addCyclingLeaveForm.value;
    console.log("cycleformdata", cycleFormData);

    cycleFormData.leaveDetails.map((elm) => {
      if (
        elm.leaveName != null &&
        elm.leaveNum != null &&
        elm.leaveType != null
      ) {
        console.log(
          "value for the incident leave",
          elm.incident,
          "type :",
          typeof elm.incident
        );
        console.log(
          "value for the eligibility leave",
          elm.eligibilityMethod,
          "type :",
          typeof elm.eligibilityMethod
        );

        processData = {
          id: uniqueID,
          org_id: this.organizationID,
          leave_profile_name: getFormData.profileName,
          leave_name: elm.leaveName,
          leave_type: elm.leaveType,
          entitled_leave_days: elm.leaveNum,

          is_incident: elm.incident ? true : false,
          is_accrued:
            elm.eligibilityMethod !== ""
              ? elm.eligibilityMethod === "Accrued"
                ? true
                : false
              : true,
          is_calendar_days:
            elm.calculateFrom !== ""
              ? elm.calculateFrom === "Working"
                ? false
                : true
              : true,
          is_leave_on_probation:
            elm.probation !== ""
              ? elm.probation === "yes"
                ? true
                : false
              : false,
          is_unused_leave_eligible:
            elm.gratuity !== ""
              ? elm.probation === "yes"
                ? true
                : false
              : false,
          carry_forward_days: 0,

          created_by_empId: this.currentUserID,
          modified_by_empId: this.currentUserID,
          is_super_admin: true,
          is_approved: true,
          is_default: false,

          week_ot_by: this.selectedweekdayOverCalc,
          holi_ot_by: this.selectedholidayOverCalc,
          ot_week: getGatFormData.setOTweek,
          ot_holi: getGatFormData.setOTholi,
          gtStartYear: this.firstYear,
          gtSecondYear: this.secondYear,
          gtCalcDayOne: this.calcDaysOne,
          gtCalcDayTwo: this.calcDaysTwo,
          probationPeriod: this.selectedProbation,

          gtStartDate: getGatFormData.gratuityStartDate,
          effective_from_date: moment(getFormData.effectiveDate).format("L"),
        };
        finalData.push(processData);
        console.log("process data", processData);
      }
    });
    //console.log(finalData)
    let finalSendData = {
      leaveProfileSetup: finalData,
    };
    console.log("posting data", finalSendData);
    this.admService
      .AddLeaveProfileSetup(finalSendData)
      .subscribe((data: any) => {
        //console.log(data)
        this.spinner.hide();
        if (data.status === "200") {
          this.successToast(data.desc);
          this.closeLeaveProfileModel();
          this.getAllProfilebyOrgID(this.organizationID);
        } else {
          this.failerToast();
          this.closeLeaveProfileModel();
        }
      });
  }

  defaultProfileToastError(desc) {
    this.toastr.error(desc);
  }

  defaultProfileToastSuccess(desc) {
    this.toastr.success(desc);
  }

  //close new leave profile model
  closeLeaveProfileModel() {
    this.existingProfileData = [];
    const add = this.addLeaveProfileForm.get("leaveDetails") as FormArray;
    add.clear();
    $("#leave_Profile_Form_Create_modal").modal("hide");
    this.addLeaveProfileForm.reset();
    //this.addGratuityForm.reset();
    this.sameProfileName = false;
    this.radioButtonWeekBasic = true;
    this.radioButtonWeekNetSal = false;
    this.selectedholidayOverCalc = "Basic Salary";
    this.radioButtonHoliBasic = true;
    this.radioButtonHoliNetSal = false;
    this.firstYear = "Select";
    this.secondYear = "Select";
    this.calcDaysOne = "";
    this.calcDaysTwo = "";
  }
  //Add New Profile ends

  // if escape key pressed by user
  escapeButtonPressed(code) {
    if (code === "Escape") {
      const add = this.addLeaveProfileForm.get("leaveDetails") as FormArray;
      add.clear();
      this.addLeaveProfileForm.reset();
      //this.addGratuityForm.reset();
      this.editIsDefaultProfile = false;
      this.radioButtonWeekBasic = true;
      this.radioButtonWeekNetSal = false;
      this.selectedholidayOverCalc = "Basic Salary";
      this.radioButtonHoliBasic = true;
      this.radioButtonHoliNetSal = false;
      this.firstYear = "Select";
      this.secondYear = "Select";
      this.calcDaysOne = "";
      this.calcDaysTwo = "";
    }
  }

  //Success message
  successToast(desc) {
    this.toastr.success(desc);
  }

  //failure message
  failerToast() {
    let desc = "Something went wrong";
    this.toastr.error(desc);
  }

  //to generate random profile ID
  generateId(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  backToMainSetting() {
    this.Router.navigate(["settings-new/hr-setting"]);
  }

  selectedweekdayOverCalc = "Basic Salary";
  selectedholidayOverCalc = "Basic Salary";
  radioButtonWeekBasic = true;
  radioButtonWeekNetSal = false;
  radioButtonHoliBasic = true;
  radioButtonHoliNetSal = false;

  multiplyBy = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  perDayMessage = "/ Number of days as per the payroll";

  clickWeekOT(from) {
    if (from == "Basic Salary") {
      this.selectedweekdayOverCalc = "Basic Salary";
      this.radioButtonWeekBasic = true;
      this.radioButtonWeekNetSal = false;
    }
    if (from == "Gross Salary") {
      this.selectedweekdayOverCalc = "Gross Salary";
      this.radioButtonWeekBasic = false;
      this.radioButtonWeekNetSal = true;
    }
  }

  clickHoliOT(from) {
    if (from == "Basic Salary") {
      this.selectedholidayOverCalc = "Basic Salary";
      this.radioButtonHoliBasic = true;
      this.radioButtonHoliNetSal = false;
    }
    if (from == "Gross Salary") {
      this.selectedholidayOverCalc = "Gross Salary";
      this.radioButtonHoliBasic = false;
      this.radioButtonHoliNetSal = true;
    }
  }

  selectYear: number[] = Array.from({ length: 15 }, (_, index) => index);
  selectYear2: number[] = Array.from({ length: 15 }, (_, index) => index);
  selectDays: number[] = Array.from({ length: 30 }, (_, index) => index + 1);

  firstYear = "Select";
  secondYear = "Select";
  calcDaysOne = "";
  calcDaysTwo = "";

  addGratuityForm: FormGroup;

  createaddGratuityForm() {
    this.addGratuityForm = this.formBuilder.group({
      setOTweek: ["", [Validators.required]],
      setOTholi: ["", [Validators.required]],

      firstYear: ["", [Validators.required]],
      secondYear: ["", [Validators.required]],
      calcDaysOne: ["", [Validators.required]],
      calcDaysTwo: ["", [Validators.required]],
      gratuityStartDate: ["", [Validators.required]],
    });
  }

  changeFirstYear(event) {
    this.firstYear = event.itemData.value;
    this.selectYear2 = Array.from({ length: 15 }, (_, index) => index);
    this.selectYear2 = this.selectYear2.splice(event.itemData.value + 1);
  }

  changeSecondYear(event) {
    if (this.firstYear) {
      this.secondYear = event.itemData.value;
    }
  }

  changefirstDay(event) {
    if (this.secondYear) {
      this.calcDaysOne = event.itemData.value;
    }
  }

  changeSecondDay(event) {
    this.calcDaysTwo = event.itemData.value;
  }

  selectedProbation;
  createchangeProbationPeriod(event) {
    try {
      this.selectedProbation = parseInt(event.value);
      console.log("assigned new pob value", this.selectedProbation);
    } catch (error) {
      console.log("Error for undifined while setting probation", error);
    }
  }

  editchangeProbationPeriod(event) {
    let getFormData = this.addLeaveProfileForm.value;
    this.selectedProbation = parseInt(getFormData.probation);
    console.log("edit assigned from form control ", getFormData.probation);
  }
}
