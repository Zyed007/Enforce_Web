import { Component, OnInit} from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import moment = require('moment');
import momentz = require('moment-timezone');
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
//service
import {OrganizationService} from '../../../services/organization.service';
import { EmployeeService } from '../../../services/employee.service';
import { TmplAstReference } from '@angular/compiler';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { resetTime } from '@syncfusion/ej2-angular-schedule';

@Component({
  selector: 'app-app-profile',
  templateUrl: './app-profile.component.html',
  styleUrls: ['./app-profile.component.scss']
})
export class AppProfileComponent implements OnInit {

  public industryData: Array<Select2OptionData>;
  public editOrganizationForm: FormGroup;
  public addOrgBranchForm: FormGroup;
  addDropDownsForm: FormGroup;
  editDropDownsForm: FormGroup;
  addOvertimeForm:FormGroup
  organizationID = localStorage.getItem('org_id');
  selectedOrganizationData;
  editWorkdaysData;
  isFlexibleDiv = false;
  timeZoneData;
  workStartHoursData;
  workEndHoursData;
  workTotalHoursData;
  timeformatData;
  overtimeHourData;
  overtimeMinuteData;
  workStartHourValue: any;
  workEndHourValue: any;
  workTotalHoursValue: any;
  timeZoneValue:any
  timeformatValue:any
  industryValue;
  showIndustryRemarks = false;
  commonOption:Select2Options;

  minDate: Object = new Date(new Date().getFullYear(), 0, 1);
  latitude =  25.1820753;
  longitude = 55.2590815;
  zoom: number;
  brlatitude:number;
  brlongitude:number;
  georadius: number;
  geoCoder;
  newBranchArr = [];
  dropdownConfig;
  worktimeDropConfig;


  constructor(
    public Router :Router,
    private formBuilder: FormBuilder,
    public OrganizationService: OrganizationService,
    public empService: EmployeeService,
    private mapsAPILoader: MapsAPILoader,
    private spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public config: NgbModalConfig,
    private modalService: NgbModal,

  ){
    this.commonOption={
      placeholder: { id: '  ', text: 'Select' },  allowClear: true,
      width:'100%'
    }
    // NEWLY ADDED

  //new dropdown config
    config.backdrop = "static";

    this.dropdownConfig = {
      search: true,
      noResultsFound: "No results found!",
      searchPlaceholder: "Search",
      height: "200px"

    };

    this.worktimeDropConfig = {
      height: "200px",
      placeholder: 'Select'
    }
  }

  ngOnInit(){
    this.editOrganizationFormValues();
    this.addOvertimeFormValues()
    this.findByOrgId(this.organizationID);
    this.editDropDownFormInputs();
    this.requiredDataCall();
    this.addBranchForm();
    //function to call
    this.getAllIndustryType();
    this.getAllTimeZone();
    //this.InputeditWorkDayExp();
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.zoom = 16;
     // this.setPredefinedLocation(this.latitude,this.longitude);
    })
  }

  setPredefinedLocation(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
        console.log(results,status);
    })

  }

  addBranchForm() {
    this.addOrgBranchForm = this.formBuilder.group({
      latitiude: [''],
      longitude: [''],
      eformattedAddress:[''],
      eraidus:[''],
      branches: this.formBuilder.array([]),
    })
  }


  addNewBranchFrom() {
    const add = this.addOrgBranchForm.get('branches') as FormArray;


    add.push(this.formBuilder.group({
      latitude: [''],
      longitude: [''],
      org_id: [''],
      formattedAddress:[this.addOrgBranchForm.controls['eformattedAddress'].value],
      raidus:[0],
    }));



  }

  markerDragEndonIndex($event: MouseEvent,index) {
    if($event){

      this.geoCoder.geocode({ 'location': { lat: $event.coords.lat, lng: $event.coords.lng } }, (results, status) => {


        if (status === 'OK') {

          const newBranch = this.addOrgBranchForm.get('branches') as FormArray;


          newBranch.at(index).patchValue({
            latitude: $event.coords.lat,
            longitude: $event.coords.lng,
            formattedAddress:results[1].formatted_address ? results[1].formatted_address : results[0].formatted_address,
            raidus:0,
          })

          this.newBranchArr =  this.addOrgBranchForm.get('branches').value;




        } else {
          Swal.fire(
            'Error!',
            'Error While Reverse Geocoding',
            'error'
          ).then(
            (result)=> {
            })
        }
      })
       // console.log('New lat and long',this.addOrgBranchForm.get('branches').value);
      }
  }

  deleteNewBranch(i) {
    const add = this.addOrgBranchForm.get('branches') as FormArray;
    add.removeAt(i);
    this.newBranchArr =  this.addOrgBranchForm.get('branches').value;
  }

  raidusValue(event,i) {
      console.log(event.target.value,i);
      const newBranch = this.addOrgBranchForm.get('branches') as FormArray;
      newBranch.at(i).patchValue({
        raidus: parseInt(event.target.value),
      })
      console.log(this.addOrgBranchForm.get('branches').value)
      //this.newBranchArr =  this.addOrgBranchForm.get('branches').value;
  }

  orgWorkdayHistory;
  orgActiveWorkday;

  findByOrgId(orgID){
    this.OrganizationService.getOrgById(orgID).subscribe((data) => {
      console.log(data)
      if(data){
        this.organizationProcessing(data);
      }
    })
    this.OrganizationService.getWorkingHrsbyOrgId({orgID : orgID}).subscribe((rsp: any) => {
      if(rsp.length > 0){
        this.orgWorkdayHistory = rsp;
        this.orgActiveWorkday = rsp.find(x => x.is_active == 1);
        this.fillworkdayData(this.orgActiveWorkday);
      }else{
        this.resetWorktime();
      }
    })
  }

  fillworkdayData(data){

    this.resetWorktime();

    if(data.effective_startday){
      this.editDropDownsForm.patchValue(
        {
          wrkProfileEffectiveDay: moment(data.effective_startday).format("ll")
        }
      );
      this.minDate = moment(data.effective_startday).toDate();
    }

    if (data.working_days !== null) {
      let testData = data.working_days.split(",");
      this.editWorkdaysData = [];
      testData.includes("Saturday") === true
        ? this.editWorkdaysData.push({ day: "SA", day_name: "Saturday", is_working: true, })
        : this.editWorkdaysData.push({ day: "SA", day_name: "Saturday", is_working: false, });
      testData.includes("Sunday") === true
        ? this.editWorkdaysData.push({ day: "SU", day_name: "Sunday", is_working: true, })
        : this.editWorkdaysData.push({ day: "SU", day_name: "Sunday", is_working: false, });
      testData.includes("Monday") === true
        ? this.editWorkdaysData.push({ day: "MO", day_name: "Monday", is_working: true, })
        : this.editWorkdaysData.push({ day: "MO", day_name: "Monday", is_working: false, });
      testData.includes("Tuesday") === true
        ? this.editWorkdaysData.push({ day: "TU", day_name: "Tuesday", is_working: true, })
        : this.editWorkdaysData.push({ day: "TU", day_name: "Tuesday", is_working: false, });
      testData.includes("Wednesday") === true
        ? this.editWorkdaysData.push({ day: "WE", day_name: "Wednesday", is_working: true, })
        : this.editWorkdaysData.push({ day: "WE", day_name: "Wednesday", is_working: false, });
      testData.includes("Thursday") === true
        ? this.editWorkdaysData.push({ day: "TH", day_name: "Thursday", is_working: true, })
        : this.editWorkdaysData.push({ day: "TH", day_name: "Thursday", is_working: false, });
      testData.includes("Friday") === true
        ? this.editWorkdaysData.push({ day: "FR", day_name: "Friday", is_working: true, })
        : this.editWorkdaysData.push({ day: "FR", day_name: "Friday", is_working: false, });


      if (data.is_flexible === true) {
        this.editIsFlexibleDiv = true;
        this.editDropDownsForm.patchValue({
          editStartTimeDropdownValue: { id: null, description: "select", },
          editEndTimeDropdownValue: { id: null, description: "select", },
          editCheckinTolerance: { id: null, description: "select", },
          editBreakTimeLimit: { id: null, description: "select", },
          editCheckInAfter: { id: data.checkin_after, description: data.checkin_after, },
          editCheckOutBefore: { id: data.checkout_before, description: data.checkout_before, },
          editTotalHoursDropdownValue: { id: data.min_hrs_flx, description: data.min_hrs_flx, },
          editBreakTimeLimitFlex: { id: data.break_time_flx, description: data.break_time_flx, },
          editLessHourTolerance: { id: data.less_hour_tolerance, description: data.less_hour_tolerance },
        });
      } else {
        this.editIsFlexibleDiv = false;
        this.editDropDownsForm.patchValue({
          editStartTimeDropdownValue: { id: data.work_start_time, description: data.work_start_time, },
          editEndTimeDropdownValue: { id: data.work_end_time, description: data.work_end_time, },
          editCheckinTolerance: { id: data.checkin_tolarence, description: data.checkin_tolarence, },
          editBreakTimeLimit: { id: data.break_time, description: data.break_time, },
          editCheckInAfter: { id: null, description: "select", },
          editCheckOutBefore: { id: null, description: "select", },
          editTotalHoursDropdownValue: { id: null, description: "select", },
          editBreakTimeLimitFlex: { id: null, description: "select", },
          editWorkingHours: this.calculateTimeDifference(data.work_start_time, data.work_end_time),
          editadjustedCheckoutTime: this.addTimePeriod(data.checkin_tolarence, this.calculateTimeDifference(data.work_start_time, data.work_end_time)),
          editLessHourTolerance: { id: data.less_hour_tolerance, description: data.less_hour_tolerance },
        });
      }

      console.log("before the exp",this.editWorkDayExp)

      if (data.is_custom_work) {
        let exptest = data.wroking_days_exp.split(",");
        console.log('working days exp', data.wroking_days_exp);
        console.log('working days exptest', exptest);


        this.editWorkDayExp = [];
        this.managed = true;
        exptest.includes("Saturday.") === true
          ? this.editWorkDayExp.push({ day: "SA", day_name: "Saturday.", is_working: true, })
          : this.editWorkDayExp.push({ day: "SA", day_name: "Saturday.", is_working: false, });
        exptest.includes("Sunday.") === true
          ? this.editWorkDayExp.push({ day: "SU", day_name: "Sunday.", is_working: true, })
          : this.editWorkDayExp.push({ day: "SU", day_name: "Sunday.", is_working: false, });
        exptest.includes("Monday.") === true
          ? this.editWorkDayExp.push({ day: "MO", day_name: "Monday.", is_working: true, })
          : this.editWorkDayExp.push({ day: "MO", day_name: "Monday.", is_working: false, });
        exptest.includes("Tuesday.") === true
          ? this.editWorkDayExp.push({ day: "TU", day_name: "Tuesday.", is_working: true, })
          : this.editWorkDayExp.push({ day: "TU", day_name: "Tuesday.", is_working: false, });
        exptest.includes("Wednesday.") === true
          ? this.editWorkDayExp.push({ day: "WE", day_name: "Wednesday.", is_working: true, })
          : this.editWorkDayExp.push({ day: "WE", day_name: "Wednesday.", is_working: false, });
        exptest.includes("Thursday.") === true
          ? this.editWorkDayExp.push({ day: "TH", day_name: "Thursday.", is_working: true, })
          : this.editWorkDayExp.push({ day: "TH", day_name: "Thursday.", is_working: false, });
        exptest.includes("Friday.") === true
          ? this.editWorkDayExp.push({ day: "FR", day_name: "Friday.", is_working: true, })
          : this.editWorkDayExp.push({ day: "FR", day_name: "Friday.", is_working: false, });

          console.log("after the exp",this.editWorkDayExp)

        let expday = [];
        // saturday exp
        if (data.saturday_exp != null && data.saturday_exp != "") {
          expday = data.saturday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsasa: { id: expday[1], description: expday[1], },
              websa: { id: expday[2], description: expday[2], },
              misa: { id: expday[3], description: expday[3], },
              btlsa: { id: expday[4], description: expday[4], },
              lhtsa: { id: expday[5], description: expday[5], },
            });
          }
          else {
            this.editDropDownsForm.patchValue({
              StartSaturday: { id: expday[1], description: expday[1], },
              EndSaturday: { id: expday[2], description: expday[2], },
              tosa: { id: expday[3], description: expday[3], },
              btlsa: { id: expday[4], description: expday[4], },
              lhtsa: { id: expday[5], description: expday[5], },
              actsa:this.addTimePeriod( expday[3], this.calculateTimeDifference(expday[1], expday[2])),
              whsa: this.calculateTimeDifference(expday[1], expday[2])
            });
          }
        }
        // sunday exp
        if (data.sunday_exp != null && data.sunday_exp != "") {
          expday = data.sunday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsasu: { id: expday[1], description: expday[1], },
              websu: { id: expday[2], description: expday[2], },
              misu: { id: expday[3], description: expday[3], },
              btlsu: { id: expday[4], description: expday[4], },
              lhtsu: { id: expday[5], description: expday[5], }
            });
          }
          else {
            this.editDropDownsForm.patchValue({
              StartSunday: { id: expday[1], description: expday[1], },
              EndSunday: { id: expday[2], description: expday[2], },
              tosu: { id: expday[3], description: expday[3], },
              btlsu: { id: expday[4], description: expday[4], },
              lhtsu: { id: expday[5], description: expday[5], },
              actsu:this.addTimePeriod( expday[3], this.calculateTimeDifference(expday[1], expday[2])),
              whsu: this.calculateTimeDifference(expday[1], expday[2])
            });
          }
        }
        //monday exp
        if (data.monday_exp != null && data.monday_exp != "") {
          expday = data.monday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsamo: { id: expday[1], description: expday[1], },
              webmo: { id: expday[2], description: expday[2], },
              mismo: { id: expday[3], description: expday[3], },
              btlmo: { id: expday[4], description: expday[4], },
              lhtmo: { id: expday[5], description: expday[5], },
            });
          }
          else {
            this.editDropDownsForm.patchValue({
              StartMonday: { id: expday[1], description: expday[1], },
              EndMonday: { id: expday[2], description: expday[2], },
              tomo: { id: expday[3], description: expday[3], },
              btlmo: { id: expday[4], description: expday[4], },
              lhtmo: { id: expday[5], description: expday[5], },
              actmo:this.addTimePeriod( expday[3], this.calculateTimeDifference(expday[1], expday[2])),
              whmo: this.calculateTimeDifference(expday[1], expday[2])
            });
          }
        }
        //tuesday exp
        if (data.tuesday_exp != null && data.tuesday_exp != "") {
          expday = data.tuesday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsatu: { id: expday[1], description: expday[1], },
              webtu: { id: expday[2], description: expday[2], },
              mistu: { id: expday[3], description: expday[3], },
              btltu: { id: expday[4], description: expday[4], },
              lhttu: { id: expday[5], description: expday[5], },
            });
          }
          else {
            this.editDropDownsForm.patchValue({
              StartTuesday: { id: expday[1], description: expday[1], },
              EndTuesday: { id: expday[2], description: expday[2], },
              totu: { id: expday[3], description: expday[3], },
              btltu: { id: expday[4], description: expday[4], },
              lhttu: { id: expday[5], description: expday[5], },
              acttu:this.addTimePeriod( expday[3], this.calculateTimeDifference(expday[1], expday[2])),
              whtu: this.calculateTimeDifference(expday[1], expday[2])
            });
          }
        }
        // wednesday exp
        if (data.wednesday_exp != null && data.wednesday_exp != "") {
          expday = data.wednesday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsawe: { id: expday[1], description: expday[1], },
              webwe: { id: expday[2], description: expday[2], },
              miswe: { id: expday[3], description: expday[3], },
              btlwe: { id: expday[4], description: expday[4], },
              lhtwe: { id: expday[5], description: expday[5], },
            });
          }
          else {
            this.editDropDownsForm.patchValue({
              StartWednesday: { id: expday[1], description: expday[1], },
              EndWednesday: { id: expday[2], description: expday[2], },
              towe: { id: expday[3], description: expday[3], },
              btlwe: { id: expday[4], description: expday[4], },
              lhtwe: { id: expday[5], description: expday[5], },
              actwe:this.addTimePeriod( expday[3], this.calculateTimeDifference(expday[1], expday[2])),
              whwe: this.calculateTimeDifference(expday[1], expday[2])
            });
          }
        }
        // thursday exp
        if (data.thursday_exp != null && data.thursday_exp != "") {
          expday = data.thursday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsath: { id: expday[1], description: expday[1], },
              webth: { id: expday[2], description: expday[2], },
              misth: { id: expday[3], description: expday[3], },
              btlth: { id: expday[4], description: expday[4], },
              lhtth: { id: expday[5], description: expday[5], },
            });
          }
          else {
            this.editDropDownsForm.patchValue({
              StartThursday: { id: expday[1], description: expday[1], },
              EndThursday: { id: expday[2], description: expday[2], },
              toth: { id: expday[3], description: expday[3], },
              btlth: { id: expday[4], description: expday[4], },
              lhtth: { id: expday[5], description: expday[5], },
              actth:this.addTimePeriod( expday[3], this.calculateTimeDifference(expday[1], expday[2])),
              whth: this.calculateTimeDifference(expday[1], expday[2])
            });
          }
        }
        //friday exp
        if (data.friday_exp != null && data.friday_exp != "") {
          expday = data.friday_exp.split(",");
          if (expday[0] == true) {
            this.editDropDownsForm.patchValue({
              wsafr: { id: expday[1], description: expday[1], },
              webfr: { id: expday[2], description: expday[2], },
              misfr: { id: expday[3], description: expday[3], },
              btlfr: { id: expday[4], description: expday[4], },
              lhtfr: { id: expday[5], description: expday[5], },
            });
          }
          else {
            this.editDropDownsForm.patchValue({
              StartFriday: { id: expday[1], description: expday[1], },
              EndFriday: { id: expday[2], description: expday[2], },
              tofr: { id: expday[3], description: expday[3], },
              btlfr: { id: expday[4], description: expday[4], },
              lhtfr: { id: expday[5], description: expday[5], },
              actfr:this.addTimePeriod( expday[3], this.calculateTimeDifference(expday[1], expday[2])),
              whfr: this.calculateTimeDifference(expday[1], expday[2])
            });
          }
        }
      } else {
        this.managed = false;
      }

    } else {
      //this.editPutOrganizationValues();
    }

  }

  resetWorktime(){
    this.minDate = new Date(new Date().getFullYear(), 0, 1);
    this.editDropDownsForm.patchValue(
      {
        wrkProfileEffectiveDay: moment(this.minDate ).format("ll")
      }
    );
    this.editWorkdaysData = [];
    this.editWorkDayExp = [];
    this.editWorkdaysData.push(
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
      },
    )
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
      },
    )
  }

  markerDragEnd($event: MouseEvent) {
    if($event){

      // this.brlatitude = $event.coords.lat;
      // this.brlongitude = $event.coords.lng;
      this.geoCoder.geocode({ 'location': { lat: $event.coords.lat, lng: $event.coords.lng } }, (results, status) => {
        if (status === 'OK') {

            console.log(results)


            //this.selectedOrganizationData.entityLocation.formatted_address = "Coca Cola Arena Dubai";

            this.selectedOrganizationData.entityLocation.formatted_address = results[1].formatted_address ? results[1].formatted_address : results[0].formatted_address;
            this.selectedOrganizationData.entityLocation.geo_address = this.selectedOrganizationData.entityLocation.formatted_address;
            this.selectedOrganizationData.entityLocation.lat =   $event.coords.lat;
            this.selectedOrganizationData.entityLocation.lang = $event.coords.lng;

          this.addOrgBranchForm.patchValue({
            latitiude: $event.coords.lat,
            longitude: $event.coords.lng,
            eformattedAddress:results[1].formatted_address ? results[1].formatted_address : results[0].formatted_address
          })
        } else {
          Swal.fire(
            'Error!',
            'Error While Reverse Geocoding',
            'error'
          ).then(
            (result)=> {
            })
        }
      });
    }
  }

  requiredDataCall(){
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
      }
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
    this.timeformatData = [
      {
        id: "12Hrs",
        description: "12Hrs",
      },
      {
        id: "24Hrs",
        description: "24Hrs",
      },
    ];
  }
  // newly added
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
  helpWork = false;
  helpWorkFlex = false;

  helpWorkOption(sec) {
    if (sec == 'main') {
      if (this.helpWork) {
        this.helpWork = false;
      }
      else {
        this.helpWork = true;
      }
    }
    if ((sec == 'flex')) {
      if (this.helpWorkFlex) {
        this.helpWorkFlex = false;
      }
      else {
        this.helpWorkFlex = true;
      }

    }
  }

  saeditIsFlexibleDiv = false;
  sueditIsFlexibleDiv = false;
  moeditIsFlexibleDiv = false;
  tueditIsFlexibleDiv = false;
  weeditIsFlexibleDiv = false;
  theditIsFlexibleDiv = false;
  freditIsFlexibleDiv = false;
  editIsFlexibleDiv = false;
  editWorkStartHourValue;
  editWorkEndHourValue;
  managed = false;

  manageWorkHrsByWeekDays(e) {

    if (e.srcElement.checked === true) {
      this.managed = true;
    } else {
      this.managed = false;
    }
  }
  editIsFlexed(e) {
    console.log("check box element", e)
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
    }
    else {
      if (e.srcElement.checked === false) {
        this.editIsFlexibleDiv = false;
      } else {
        this.editIsFlexibleDiv = true;
      }
    }
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

  editWorkDayExp = []
  InputeditWorkDayExp() {
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
      },
    )
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

  editChangedTimeZone(e: any): void {
    this.timeZoneValue = e.value;
  }

  changedIndustry(e: any): void {
    if(e.value !== ''){
      this.industryValue= e.value;
      if(e.data[0] && e.data[0].text=="Other"){
        this.showIndustryRemarks=true;
       }else{
         this.showIndustryRemarks=false;
       }
    }
  }

  editChangedTimeformat(e: any): void {
    this.timeformatValue = e.value;
  }

  isFlexed(e){
    console.log(e.srcElement,"VALUE CHECK!!!");

    if(e.srcElement.checked === true){
      this.isFlexibleDiv = true
      this.workStartHourValue = '';
      this.workEndHourValue = '';
    }else{
      this.isFlexibleDiv = false
    }
  }

  workingDayChange(e){

    let compare=e.target.value+ "."
    // this.orgWorkingDays.map((elm) => {
    //   if(elm.day_name === e.target.value){
    //     elm.is_working = e.srcElement.checked
    //   }
    // })
    this.editWorkDayExp.map((elm) => {
      if (elm.day_name === compare) {
        if (e.srcElement.checked == true) {
          elm.is_working = !e.srcElement.checked;
        }
      }
    });

  }

  organizationProcessing(selectedOrganizationData){

    this.newBranchArr = [];

    this.editOrganizationForm.patchValue({
      eOrganizationName: selectedOrganizationData.org_name,
      eCompanyAddress1: selectedOrganizationData.adr1,
      eCompanyAddress2: selectedOrganizationData.adr2,
      eCompanyAddress3: selectedOrganizationData.city,
      industryType: selectedOrganizationData.other_type,
      currency: selectedOrganizationData.organizationSetup.currency,
      vat: selectedOrganizationData.vatpercent
    });

    if(selectedOrganizationData.time_zone === null){
      let tz = moment.tz.guess();
      this.timeZoneValue = tz+" (GMT"+moment.tz(tz).format('Z')+")";
    }else{
      this.timeZoneValue = selectedOrganizationData.time_zone;
    }

    if(selectedOrganizationData.time_format === null){
      this.timeformatValue = '12Hrs';
    }else{
      this.timeformatValue = selectedOrganizationData.time_format;
    }

    this.industryValue = selectedOrganizationData.type;
    this.latitude = parseFloat(selectedOrganizationData.entityLocation.lat);
    this.longitude = parseFloat(selectedOrganizationData.entityLocation.lang);
    this.georadius = parseFloat(selectedOrganizationData.entityLocationRadius.radius);


    this.addOrgBranchForm.patchValue({
      latitude:this.latitude,
      longitude:this.longitude,
      eformattedAddress:selectedOrganizationData.entityLocation.formatted_address ? selectedOrganizationData.entityLocation.formatted_address : 'Dubai' ,
      eraidus: this.georadius ? this.georadius : 10,
    })

    if(selectedOrganizationData.organizationBranchViewModel.length) {

      const add = this.addOrgBranchForm.get('branches') as FormArray;

      add.push(this.formBuilder.group({
        latitude: [this.latitude],
        org_id:selectedOrganizationData.organizationBranchViewModel[0].org_id != null ? selectedOrganizationData.organizationBranchViewModel[0].org_id : '',
        longitude: [ this.longitude],
        formattedAddress:[this.addOrgBranchForm.controls['eformattedAddress'].value],
        raidus:[this.georadius],
      }));


      this.newBranchArr = [];
      selectedOrganizationData.organizationBranchViewModel.map((item,i )=>{
        this.newBranchArr.push({
          org_id:item.org_id,
          latitude:  parseFloat(item.entityLocationViewModel.lat),
          longitude: parseFloat(item.entityLocationViewModel.lang),
          formattedAddress:item.entityLocationViewModel.geo_address,
          raidus:item.radius ? parseFloat(item.radius) : 0 ,
        })
        console.log("item",item.raidus);
        const newBranch = this.addOrgBranchForm.get('branches') as FormArray;
        newBranch.at(i).patchValue({
          org_id:item.org_id,
          latitude:parseFloat(item.entityLocationViewModel.lat),
          longitude: parseFloat(item.entityLocationViewModel.lang),
          formattedAddress:item.entityLocationViewModel.geo_address ? item.entityLocationViewModel.geo_address : item.entityLocationViewModel.geo_address,
          raidus:item.radius ? parseFloat(item.radius) : 0 ,
        })
      })


     if(this.addOrgBranchForm.get('branches').value.length >= 2) {
       let arr = this.addOrgBranchForm.get('branches').value;
      let index = arr.findIndex(x => x.latitiude == selectedOrganizationData.entityLocation.lat);
      console.log(arr);
      console.log(selectedOrganizationData.entityLocation.lat);
      //console.log(index);
     // if(index > 0) {
        this.deleteNewBranch(index);
      //}
      //this.deleteNewBranch(index);
     }



      console.log("BranchArr--->",this.newBranchArr);
      console.log("newBranch--->",this.addOrgBranchForm.get('branches').value);
    }

    this.selectedOrganizationData = selectedOrganizationData;
  }

  saveEditOrganization(){

    this.spinner.show();
    let orgFormValues = this.editOrganizationForm.value

    let newbrnch = this.addOrgBranchForm.get('branches').value;
    let tempArr = [];

    let user_info = JSON.parse(localStorage.getItem('user_info'));
    if(newbrnch.length > 0) {
          newbrnch.map((item:any,i) => {
            let obj = {};
            obj['parent_org_id'] =  this.selectedOrganizationData.org_id;
            obj['org_id'] =  item.org_id.length > 0?  item.org_id : null;
            obj['user_id'] =  this.selectedOrganizationData.user_id;
            obj['org_name'] =  `New Branch ${newbrnch.length} `+ '' + this.selectedOrganizationData.org_name;
            obj['type'] =  this.showIndustryRemarks === true ? orgFormValues.industryType : '';
            obj['other_type'] =  null;
            obj['adr1'] =  item.formattedAddress;
            obj['adr2'] =  item.formattedAddress;
            obj['city'] =  orgFormValues.eCompanyAddress3;
            obj['primary_cont_name'] =  this.selectedOrganizationData.primary_cont_name;
            obj['primary_cont_type'] =  this.selectedOrganizationData.primary_cont_type;
            obj['time_zone_id'] =  this.timeZoneValue !== undefined ? this.timeZoneValue : null;
            obj['createdby'] =  user_info.full_name;
            obj['EntityLocationViewModel'] =  {   'formatted_address' : item.formattedAddress ,  'geo_address' : item.formattedAddress , lat: item.latitude.toString() , lang:item.longitude.toString()    };
            obj['is_restrict_checkin'] = true;
            obj['radius'] =  item.raidus;

            tempArr.push(obj);


          })
    }

    this.selectedOrganizationData.organizationBranchViewModel = tempArr;

    let working_days = [];

    this.editWorkdaysData.map((elm) => {
      if (elm.is_working === true) {
        working_days.push(elm.day_name);
      }
    });

    this.selectedOrganizationData.entityLocationRadius.radius = this.addOrgBranchForm.controls['eraidus'].value  != null
    ? this.addOrgBranchForm.controls['eraidus'].value : this.selectedOrganizationData.entityLocationRadius.radius;

    //console.log("this.selectedOrganizationData.entityLocationRadius.radius",this.selectedOrganizationData.entityLocationRadius.radius);
    let editDropDownForm = this.editDropDownsForm.value;
    let overtimeValues=this.addOvertimeForm.value


    let postData={
      org_id: this.selectedOrganizationData.org_id,
      user_id: this.selectedOrganizationData.user_id,
      org_name: this.selectedOrganizationData.org_name,
      primary_cont_name: this.selectedOrganizationData.primary_cont_name,
      primary_cont_type: this.selectedOrganizationData.primary_cont_type,
      EntityLocationViewModel: this.selectedOrganizationData.entityLocation,
      adr1: orgFormValues.eCompanyAddress1,
      adr2: orgFormValues.eCompanyAddress2,
      city: orgFormValues.eCompanyAddress3,
      type: this.industryValue,
      other_type: this.showIndustryRemarks === true ? orgFormValues.industryType : '',
      OrganizationSetup: this.selectedOrganizationData.organizationSetup,
      OrganizationBranchViewModel:  this.selectedOrganizationData.organizationBranchViewModel,
      is_restrict_checkin: this.selectedOrganizationData.entityLocationRadius.is_allowed,
      radius: this.selectedOrganizationData.entityLocationRadius.radius,
      modified_by_empId: user_info.id,
      time_format: this.timeformatValue !== undefined ? this.timeformatValue : null,
      time_zone: this.timeZoneValue !== undefined ? this.timeZoneValue : null,

      working_days: working_days.toString(),

      work_start_time: this.editIsFlexibleDiv !== true ? editDropDownForm.editStartTimeDropdownValue.id : null,
      work_end_time: this.editIsFlexibleDiv !== true ? editDropDownForm.editEndTimeDropdownValue.id : null,
      checkin_tolarence: this.editIsFlexibleDiv !== true ? editDropDownForm.editCheckinTolerance.id : null, //min_hrs: ,
      break_time: this.editIsFlexibleDiv !== true ? editDropDownForm.editBreakTimeLimit.id : null,

      is_flexible: this.editIsFlexibleDiv,

      checkin_after: this.editIsFlexibleDiv == true ? editDropDownForm.editCheckInAfter.id : null,
      checkout_before: this.editIsFlexibleDiv == true ? editDropDownForm.editCheckOutBefore.id : null,
      min_hrs_flx: this.editIsFlexibleDiv == true ? editDropDownForm.editTotalHoursDropdownValue.id : null,
      break_time_flx: this.editIsFlexibleDiv == true ? editDropDownForm.editBreakTimeLimitFlex.id : null,

      vatpercent: orgFormValues.vat,
      // Overtime added
      addOvertimeHour:overtimeValues.addOvertimeHourDropdownValue.id ,
      addOvertimeMinute:overtimeValues.addOvertimeMinuteDropdownValue.id,
      isWorkdayOvertimeEnabled:overtimeValues.isWorkdayOvertimeEnabled,
      isHolidayOvertimeEnabled:overtimeValues.isHolidayOvertimeEnabled,
    }


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
      })

      if (work_days_exp.includes('Saturday.')) {
        if (this.saeditIsFlexibleDiv) {
          saturday_exp.push('true');
          saturday_exp.push(editDropDownForm.wsasa.id)
          saturday_exp.push(editDropDownForm.websa.id)
          saturday_exp.push(editDropDownForm.misa.id)
          saturday_exp.push(editDropDownForm.btlsa.id)
          saturday_exp.push(editDropDownForm.lhtsa.id)
        } else {
          saturday_exp.push('false');
          saturday_exp.push(editDropDownForm.StartSaturday.id)
          saturday_exp.push(editDropDownForm.EndSaturday.id)
          saturday_exp.push(editDropDownForm.tosa.id)
          saturday_exp.push(editDropDownForm.btlsa.id)
          saturday_exp.push(editDropDownForm.lhtsa.id)
        }
      }
      if (work_days_exp.includes('Sunday.')) {
        if (this.sueditIsFlexibleDiv) {
          sunday_exp.push('true');
          sunday_exp.push(editDropDownForm.wsasu.id)
          sunday_exp.push(editDropDownForm.websu.id)
          sunday_exp.push(editDropDownForm.misu.id)
          sunday_exp.push(editDropDownForm.btlsu.id)
          sunday_exp.push(editDropDownForm.lhtsu.id)
        } else {
          sunday_exp.push('false');
          sunday_exp.push(editDropDownForm.StartSunday.id)
          sunday_exp.push(editDropDownForm.EndSunday.id)
          sunday_exp.push(editDropDownForm.tosu.id)
          sunday_exp.push(editDropDownForm.btlsu.id)
          sunday_exp.push(editDropDownForm.lhtsu.id)
        }
      }
      if (work_days_exp.includes('Monday.')) {
        if (this.moeditIsFlexibleDiv) {
          monday_exp.push('true');
          monday_exp.push(editDropDownForm.wsamo.id)
          monday_exp.push(editDropDownForm.webmo.id)
          monday_exp.push(editDropDownForm.mimo.id)
          monday_exp.push(editDropDownForm.btlmo.id)
          monday_exp.push(editDropDownForm.lhtmo.id)
        } else {
          monday_exp.push('false');
          monday_exp.push(editDropDownForm.StartMonday.id)
          monday_exp.push(editDropDownForm.EndMonday.id)
          monday_exp.push(editDropDownForm.tomo.id)
          monday_exp.push(editDropDownForm.btlmo.id)
          monday_exp.push(editDropDownForm.lhtmo.id)
        }

      }
      if (work_days_exp.includes('Tuesday.')) {
        if (this.tueditIsFlexibleDiv) {
          tuesday_exp.push('true');
          tuesday_exp.push(editDropDownForm.wsatu.id)
          tuesday_exp.push(editDropDownForm.webtu.id)
          tuesday_exp.push(editDropDownForm.mitu.id)
          tuesday_exp.push(editDropDownForm.btltu.id)
          tuesday_exp.push(editDropDownForm.lhttu.id)
        } else {
          tuesday_exp.push('false');
          tuesday_exp.push(editDropDownForm.StartTuesday.id)
          tuesday_exp.push(editDropDownForm.EndTuesday.id)
          tuesday_exp.push(editDropDownForm.totu.id)
          tuesday_exp.push(editDropDownForm.btltu.id)
          tuesday_exp.push(editDropDownForm.lhttu.id)
        }
      }
      if (work_days_exp.includes('Wednesday.')) {
        if (this.weeditIsFlexibleDiv) {
          wednesday_exp.push('true');
          wednesday_exp.push(editDropDownForm.wsawe.id)
          wednesday_exp.push(editDropDownForm.webwe.id)
          wednesday_exp.push(editDropDownForm.miwe.id)
          wednesday_exp.push(editDropDownForm.btlwe.id)
          wednesday_exp.push(editDropDownForm.lhtwe.id)
        } else {
          wednesday_exp.push('false');
          wednesday_exp.push(editDropDownForm.StartWednesday.id)
          wednesday_exp.push(editDropDownForm.EndWednesday.id)
          wednesday_exp.push(editDropDownForm.towe.id)
          wednesday_exp.push(editDropDownForm.btlwe.id)
          wednesday_exp.push(editDropDownForm.lhtwe.id)
        }
      }
      if (work_days_exp.includes('Thursday.')) {
        if (this.theditIsFlexibleDiv) {
          thursday_exp.push('true');
          thursday_exp.push(editDropDownForm.wsath.id)
          thursday_exp.push(editDropDownForm.webth.id)
          thursday_exp.push(editDropDownForm.misth.id)
          thursday_exp.push(editDropDownForm.btlth.id)
          thursday_exp.push(editDropDownForm.lhtth.id)
        } else {
          thursday_exp.push('false');
          thursday_exp.push(editDropDownForm.StartThursday.id)
          thursday_exp.push(editDropDownForm.EndThursday.id)
          thursday_exp.push(editDropDownForm.toth.id)
          thursday_exp.push(editDropDownForm.btlth.id)
          thursday_exp.push(editDropDownForm.lhtth.id)
        }

      }
      if (work_days_exp.includes('Friday.')) {
        if (this.freditIsFlexibleDiv) {
          friday_exp.push('true');
          friday_exp.push(editDropDownForm.wsafr.id)
          friday_exp.push(editDropDownForm.webfr.id)
          friday_exp.push(editDropDownForm.mifr.id)
          friday_exp.push(editDropDownForm.btlfr.id)
          friday_exp.push(editDropDownForm.lhtfr.id)
        } else {
          friday_exp.push('false');
          friday_exp.push(editDropDownForm.StartFriday.id)
          friday_exp.push(editDropDownForm.EndFriday.id)
          friday_exp.push(editDropDownForm.tofr.id)
          friday_exp.push(editDropDownForm.btlfr.id)
          friday_exp.push(editDropDownForm.lhtfr.id)
        }
      }
    }

    let postworkData = {
      id: this.orgActiveWorkday.id,
      org_id: this.selectedOrganizationData.org_id,
      emp_id: null,
      team_id: null,
      is_for_emp: false,
      is_for_org: true,
      is_for_team: false,
      working_days: working_days.toString(),

      work_start_time: this.editIsFlexibleDiv !== true ? editDropDownForm.editStartTimeDropdownValue.id : null,
      work_end_time: this.editIsFlexibleDiv !== true ? editDropDownForm.editEndTimeDropdownValue.id : null,
      checkin_tolarence: this.editIsFlexibleDiv !== true ? editDropDownForm.editCheckinTolerance.id : null, //min_hrs: ,
      break_time: this.editIsFlexibleDiv !== true ? editDropDownForm.editBreakTimeLimit.id : null,
      less_hour_tolerance: editDropDownForm.editLessHourTolerance.id ? editDropDownForm.editLessHourTolerance.id : null,

      is_flexible: this.editIsFlexibleDiv,

      checkin_after: this.editIsFlexibleDiv == true ? editDropDownForm.editCheckInAfter.id : null,
      checkout_before: this.editIsFlexibleDiv == true ? editDropDownForm.editCheckOutBefore.id : null,
      min_hrs_flx: this.editIsFlexibleDiv == true ? editDropDownForm.editTotalHoursDropdownValue.id : null,
      break_time_flx: this.editIsFlexibleDiv == true ? editDropDownForm.editBreakTimeLimitFlex.id : null,

      is_custom_work: this.managed,
      wroking_days_exp: work_days_exp.toString(),
      saturday_exp: saturday_exp.toString(),
      sunday_exp: sunday_exp.toString(),
      monday_exp: monday_exp.toString(),
      tuesday_exp: tuesday_exp.toString(),
      wednesday_exp: wednesday_exp.toString(),
      thursday_exp: thursday_exp.toString(),
      friday_exp: friday_exp.toString(),

      effective_startday: moment(editDropDownForm.wrkProfileEffectiveDay).format("L"),
      effective_enddate: null,
      is_deleted: false,
      modified_date: null,
      created_date: moment(this.orgActiveWorkday.created_date).format("L"),
      created_by: this.orgActiveWorkday.created_by,
      same_as_org: false,
      same_as_team: false,
      is_active: true,
      is_aproved: true,
      workday_settings: "Organisaztion"
    }

    console.log(postData,"postData*************")
    console.log(postworkData, "postworkData*************")
    console.log("from database", moment(this.orgActiveWorkday.effective_startday).format("L"),
     "from form", moment(editDropDownForm.wrkProfileEffectiveDay).format("L"));


    this.OrganizationService.updateOrg(postData).subscribe((data:any) => {
      if(data.status==200){

        if(moment(this.orgActiveWorkday.effective_startday).format("L") == moment(editDropDownForm.wrkProfileEffectiveDay).format("L")){
          console.log("Updating the existing working hrs no change in profile effective day!!");
          this.OrganizationService.UpdateWorkingHrs(postworkData).subscribe((updata: any) => {

            if(updata.status==200){
              this.spinner.hide();
              this.toastr.success(data['desc'], undefined,{positionClass: 'toast-top-center' });
              this.findByOrgId(this.organizationID);
              this.editOrganizationForm.reset();
              return;
            }

          });
        }else{
          console.log("Adding new working hrs no change in profile effective day!!");
          this.OrganizationService.AddWorkingHrs(postworkData).subscribe((adddata: any) => {
            if(adddata.status==200){
              this.spinner.hide();
              this.toastr.success(data['desc'], undefined,{positionClass: 'toast-top-center' });
              this.findByOrgId(this.organizationID);
              this.editOrganizationForm.reset();
              return;
            }
          })
        }

      }else{
        this.spinner.hide();
        Swal.fire(
          'Error!',
          data['result'].desc,
          'error'
        )
      }
    },error => {
      Swal.fire(
      'Error!',
      error,
      'error'
      )
    });

  }

  //common function end
  getAllTimeZone(){
    var timeZones = momentz.tz.names();
    var offsetTmz=[{id: '',text: 'Select'}
    ];
    for(var i in timeZones)
      {
        offsetTmz.push({
          text: timeZones[i]+" (GMT"+moment.tz(timeZones[i]).format('Z')+")",
          id: timeZones[i]+" (GMT"+moment.tz(timeZones[i]).format('Z')+")"
        });
      }
    this.timeZoneData = offsetTmz;
  }

  editOrganizationFormValues() {
    this.editOrganizationForm = this.formBuilder.group({
      eOrganizationName: [ '' , [Validators.required]],
      eCompanyAddress1: [''],
      eCompanyAddress2: [''],
      eCompanyAddress3: [''],
      industryType: [''],
      currency: [''],
      vat: ['']
    });
  }
  addOvertimeFormValues(){
    this.addOvertimeForm=this.formBuilder.group({
      addOvertimeHourDropdownValue: [""],
      addOvertimeMinuteDropdownValue: [""],
      isWorkdayOvertimeEnabled:false,
      isHolidayOvertimeEnabled:false,
    })
  }

  getAllIndustryType(){
    this.empService.getAllIndustryType().subscribe((data:any) => {
      let results=[{ id: '', text: 'Select' }]
      data.map((elm) => {
        results.push({
          "id": elm.id,
          "text": elm.industry_type_name
        });
      })
      this.industryData =results;
    },error => {
      Swal.fire(
      'Error!',
      error,
      'error'
    )}
    )
  }
  //common function end

  backToMainSetting(){
    this.Router.navigate(['organization-overview']);
  }

  editDropDownFormInputs() {
    this.editDropDownsForm = this.formBuilder.group({
      editTeamDropdownValue: [""],
      editEmpTypeDropdownValue: [""],
      editRoleDropdownValue: [""],
      editTimeZoneDropdownValue: [""],
      editTimeFormatDropdownValue: [""],
      editStatusDropdownValue: [""],

      wrkProfileEffectiveDay: [""],

      editStartTimeDropdownValue: [""],
      editEndTimeDropdownValue: [""],
      editCheckinTolerance: [""],
      editLessHourTolerance: [""],
      editBreakTimeLimit: [""],

      editFlexibleCheckbox: [""],

      editCheckInAfter: [""],
      editCheckOutBefore: [""],
      editTotalHoursDropdownValue: [""],
      editBreakTimeLimitFlex: [""],
      editLessHourToleranceFlex: [""],

      editWorkingHours: [""],
      editadjustedCheckoutTime: [""],

      editCostomWorkDays: [""],

      saIsFlex: [""],
      StartSaturday: [""],
      EndSaturday: [""],
      tosa: [""],
      misa: [""],
      wsasa: [""],
      websa: [""],
      btlsa: [""],
      lhtsa: [""],
      actsa: [""],
      whsa: [""],

      suIsFlex: [""],
      StartSunday: [""],
      EndSunday: [""],
      tosu: [""],
      misu: [""],
      wsasu: [""],
      websu: [""],
      btlsu: [""],
      lhtsu: [""],
      actsu: [""],
      whsu: [""],

      moIsFlex: [""],
      StartMonday: [""],
      EndMonday: [""],
      tomo: [""],
      mimo: [""],
      wsamo: [""],
      webmo: [""],
      btlmo: [""],
      lhtmo: [""],
      actmo: [""],
      whmo: [""],

      tuIsFlex: [""],
      StartTuesday: [""],
      EndTuesday: [""],
      totu: [""],
      mitu: [""],
      wsatu: [""],
      webtu: [""],
      btltu: [""],
      lhttu: [""],
      acttu: [""],
      whtu: [""],

      weIsFlex: [""],
      StartWednesday: [""],
      EndWednesday: [""],
      towe: [""],
      miwe: [""],
      wsawe: [""],
      webwe: [""],
      btlwe: [""],
      lhtwe: [""],
      actwe: [""],
      whwe: [""],

      thIsFlex: [""],
      StartThursday: [""],
      EndThursday: [""],
      toth: [""],
      mith: [""],
      wsath: [""],
      webth: [""],
      btlth: [""],
      lhtth: [""],
      actth: [""],
      whth: [""],

      frIsFlex: [""],
      StartFriday: [""],
      EndFriday: [""],
      tofr: [""],
      mifr: [""],
      wsafr: [""],
      webfr: [""],
      btlfr: [""],
      lhtfr: [""],
      actfr: [""],
      whfr: [""],
    });
  }

  // Handle Overtime Fun
  hoursCalc : number[] = Array.from({ length: 12 }, (_, index) => index + 1);
  minutesCalc: number[] = Array.from({ length: 60 }, (_, index) => index + 1);
  handleOverTimeCheck=true

 handleOvertime(e){
  if(e.target.checked){
    this.handleOverTimeCheck=false
  }
  else{
    this.handleOverTimeCheck=true
  }
 }

 editChangeWorkingExpDays(e) {
  this.editWorkdaysData.map((elm) => {
    if (elm.day_name === e.target.value) {
      elm.is_working = e.srcElement.checked;
    }
  });
 }

 editWorkDayExpcheck(e) {
  console.log("checked function", e);
  let compare = e.target.value.slice(0, -1);
  console.log("compare", compare);
  this.editWorkDayExp.map((elm) => {
    if (elm.day_name === e.target.value) {
      elm.is_working = e.srcElement.checked;

      this.editWorkdaysData.map((elm) => {
        if (elm.day_name === compare) {
          if (e.srcElement.checked == true) {
            elm.is_working = !e.srcElement.checked;
          }
        }
      });

    }

  });
 }

 chwkexpdays = false;

  editChangeWorkingDays(e) {
  let compare = e.target.value + "."
  console.log("i am here ", e)
  this.editWorkdaysData.map((elm) => {
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

  addTimePeriod(startTime: string, timePeriod: string): string | null {

      console.log("from addTimePeriod",startTime, timePeriod);
      // Regular expression to validate the time format
      const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(AM|PM)$/i;
      const periodRegex = /^([0-1]?[0-9]):([0-5][0-9])$/;

      // Validate inputs
      if (!timeRegex.test(startTime) || !periodRegex.test(timePeriod)) {
          console.error("Invalid input format");
          return null;
      }

      // Convert the start time to a Date object
      const [time, modifier] = startTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier.toUpperCase() === 'PM' && hours !== 12) {
          hours += 12;
      } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
          hours = 0;
      }

      // Convert the time period to hours and minutes
      const [periodHours, periodMinutes] = timePeriod.split(':').map(Number);

      // Add the time period to the start time
      hours += periodHours;
      minutes += periodMinutes;

      // Handle minute overflow
      if (minutes >= 60) {
          hours += Math.floor(minutes / 60);
          minutes = minutes % 60;
      }

      // Handle hour overflow (24-hour time)
      if (hours >= 24) {
          hours = hours % 24;
      }

      // Convert back to 12-hour time format
      const newModifier = hours >= 12 ? 'PM' : 'AM';
      if (hours > 12) {
          hours -= 12;
      } else if (hours === 0) {
          hours = 12;
      }

      // Format the result
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');

      return `${formattedHours}:${formattedMinutes} ${newModifier}`;
  }


  calculateTimeDifference(startTime: string, endTime: string): string {
    // Helper function to convert 12-hour time format to minutes
    function timeToMinutes(time: string): number {
      try {
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {
          hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
          hours = 0;
        }

        return hours * 60 + minutes;
      } catch (error) {
        return -1; // Return -1 if there's an error in the split method
      }
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // Check if there was an error in parsing the time strings
    if (startMinutes === -1 || endMinutes === -1) {
      return ''; // Return an empty string if there was an error
    }

    let diffMinutes = endMinutes - startMinutes;

    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // If endTime is past midnight
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  selectWorkStart(event) {
    let editDropDownForm = this.editDropDownsForm.value;
    this.editDropDownsForm.patchValue(
      {
        StartSaturday: event['value'],
        StartSunday: event['value'],
        StartMonday: event['value'],
        StartTuesday: event['value'],
        StartWednesday: event['value'],
        StartThursday: event['value'],
        StartFriday: event['value'],
        editWorkingHours: this.calculateTimeDifference(editDropDownForm.editStartTimeDropdownValue.id, editDropDownForm.editEndTimeDropdownValue.id),
        editadjustedCheckoutTime: this.addTimePeriod(editDropDownForm.editCheckinTolerance.id, this.calculateTimeDifference(editDropDownForm.editStartTimeDropdownValue.id, editDropDownForm.editEndTimeDropdownValue.id))
      }
    );
  }

  selectWorkEnd(event) {
    let editDropDownForm = this.editDropDownsForm.value;
    this.editDropDownsForm.patchValue(
      {
        EndSaturday: event['value'],
        EndSunday: event['value'],
        EndMonday: event['value'],
        EndTuesday: event['value'],
        EndWednesday: event['value'],
        EndThursday: event['value'],
        EndFriday: event['value'],
        editWorkingHours: this.calculateTimeDifference(editDropDownForm.editStartTimeDropdownValue.id, editDropDownForm.editEndTimeDropdownValue.id),
        editadjustedCheckoutTime: this.addTimePeriod(editDropDownForm.editCheckinTolerance.id, this.calculateTimeDifference(editDropDownForm.editStartTimeDropdownValue.id, editDropDownForm.editEndTimeDropdownValue.id))
      }
    );
  }

  selectCheckinTolerance(event){
    let editDropDownForm = this.editDropDownsForm.value;
    this.editDropDownsForm.patchValue({
      editadjustedCheckoutTime: this.addTimePeriod(editDropDownForm.editCheckinTolerance.id, this.calculateTimeDifference(editDropDownForm.editStartTimeDropdownValue.id, editDropDownForm.editEndTimeDropdownValue.id))
    })
  }

  selectWorkEndExp(event, expweekday) {
    let edf = this.editDropDownsForm.value;

    console.log("for weekday", expweekday);


    if (expweekday == 'Saturday') {
      this.editDropDownsForm.patchValue(
        {
          whsa:this.calculateTimeDifference(edf.StartSaturday.id, edf.EndSaturday.id) ,
          actsa:this.addTimePeriod( edf.tosa.id, this.calculateTimeDifference(edf.StartSaturday.id, edf.EndSaturday.id)),
        }
      );
    }
    if (expweekday == 'Sunday') {
      this.editDropDownsForm.patchValue(
        {
          whsu:this.calculateTimeDifference(edf.StartSunday.id, edf.EndSunday.id) ,
          actsu:this.addTimePeriod( edf.tosu.id, this.calculateTimeDifference(edf.StartSunday.id, edf.EndSunday.id)),
        }
      );
    }
    if (expweekday == 'Monday') {
      this.editDropDownsForm.patchValue(
        {
          whmo:this.calculateTimeDifference(edf.StartMonday.id, edf.EndMonday.id) ,
          actmo:this.addTimePeriod( edf.tomo.id, this.calculateTimeDifference(edf.StartMonday.id, edf.EndMonday.id)),
        }
      );
    }
    if (expweekday == 'Tuesday') {
      this.editDropDownsForm.patchValue(
        {
          whtu:this.calculateTimeDifference(edf.StartTuesday.id, edf.EndTuesday.id) ,
          acttu:this.addTimePeriod( edf.totu.id, this.calculateTimeDifference(edf.StartTuesday.id, edf.EndTuesday.id)),
        }
      );
    }
    if (expweekday == 'Wednesday') {
      this.editDropDownsForm.patchValue(
        {
          whwe:this.calculateTimeDifference(edf.StartWednesday.id, edf.EndWednesday.id) ,
          actwe:this.addTimePeriod( edf.towe.id, this.calculateTimeDifference(edf.StartWednesday.id, edf.EndWednesday.id)),
        }
      );
    }
    if (expweekday == 'Thursday') {
      this.editDropDownsForm.patchValue(
        {
          whth:this.calculateTimeDifference(edf.StartThursday.id, edf.EndThursday.id) ,
          actth:this.addTimePeriod( edf.toth.id, this.calculateTimeDifference(edf.StartThursday.id, edf.EndThursday.id)),
        }
      );
    }
    if (expweekday == 'Friday') {
      this.editDropDownsForm.patchValue(
        {
          whfr:this.calculateTimeDifference(edf.StartFriday.id, edf.EndFriday.id) ,
          actfr:this.addTimePeriod( edf.tofr.id, this.calculateTimeDifference(edf.StartFriday.id, edf.EndFriday.id)),
        }
      );
    }

  }

  selectCheckinToleranceexp(event, expweekday) {
    let edf = this.editDropDownsForm.value;
    if (expweekday == 'Saturday') {
      this.editDropDownsForm.patchValue({
        actsa: this.addTimePeriod( edf.tosa.id, this.calculateTimeDifference(edf.StartSaturday.id, edf.EndSaturday.id)),
      })
    }
    if (expweekday == 'Sunday') {
      this.editDropDownsForm.patchValue({
        actsu: this.addTimePeriod( edf.tosu.id, this.calculateTimeDifference(edf.StartSunday.id, edf.EndSunday.id)),
      })
    }
    if (expweekday == 'Monday') {
      this.editDropDownsForm.patchValue({
        actmo: this.addTimePeriod( edf.tomo.id, this.calculateTimeDifference(edf.StartMonday.id, edf.EndMonday.id)),
      })
    }
    if (expweekday == 'Tuesday') {
      this.editDropDownsForm.patchValue({
        acttu: this.addTimePeriod( edf.totu.id, this.calculateTimeDifference(edf.StartTuesday.id, edf.EndTuesday.id)),
      })
    }
    if (expweekday == 'Wednesday') {
      this.editDropDownsForm.patchValue({
        actwe: this.addTimePeriod( edf.towe.id, this.calculateTimeDifference(edf.StartWednesday.id, edf.EndWednesday.id)),
      })
    }
    if (expweekday == 'Thursday') {
      this.editDropDownsForm.patchValue({
        actth: this.addTimePeriod( edf.toth.id, this.calculateTimeDifference(edf.StartThursday.id, edf.EndThursday.id)),
      })
    }
    if (expweekday == 'Friday') {
      this.editDropDownsForm.patchValue({
        actfr: this.addTimePeriod( edf.tofr.id, this.calculateTimeDifference(edf.StartFriday.id, edf.EndFriday.id)),
      })
    }

  }

  selectCheckInAfter(event) {
    this.editDropDownsForm.patchValue(
      {
        wsasa: event['value'],
        wsasu: event['value'],
        wsamo: event['value'],
        wsatu: event['value'],
        wsawe: event['value'],
        wsath: event['value'],
        wsafr: event['value'],
      }
    );
  }

  selectCheckOutBefore(event) {
    this.editDropDownsForm.patchValue(
      {
        websa: event['value'],
        websu: event['value'],
        webmo: event['value'],
        webtu: event['value'],
        webwe: event['value'],
        webth: event['value'],
        webfr: event['value'],
      }
    );
  }

  selectTolerance(event) {
    this.editDropDownsForm.patchValue(
      {

        tosa: event['value'],
        tosu: event['value'],
        tomo: event['value'],
        totu: event['value'],
        towe: event['value'],
        toth: event['value'],
        tofr: event['value'],
      }
    );
  }

  selectMinimum(event) {
    this.editDropDownsForm.patchValue(
      {
        misa: event['value'],
        misu: event['value'],
        mimo: event['value'],
        mitu: event['value'],
        miwe: event['value'],
        mith: event['value'],
        mifr: event['value'],
      }
    );
  }

  disableWork = false;

  WorkProfileHistoryModel(WorkProfileHistory) {
    this.modalService.open(WorkProfileHistory);
  }

  closeModels() {
    this.modalService.dismissAll();
  }


}
