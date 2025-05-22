import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { PayrollService } from '../../../../services/payroll.service';
import { EmployeeService } from '../../../../services/employee.service';
import { settingsService } from '../../../../services/settings.service';
import { AssetService } from '../../../../services/asset.service';
import { ProjectService } from '../../../../services/project.service';
import { ToastrService } from "ngx-toastr";
import { TabComponent } from "@syncfusion/ej2-angular-navigations";
import { GridComponent, ToolbarItems, GroupService, } from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import moment = require('moment');
import { ActivatedRoute, Router } from '@angular/router';
import { E } from '@angular/cdk/keycodes';
import { SettingsComponent } from '../../../settings/settings.component';
//import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
declare var $: any;
@Component({
  selector: 'payroll-settings',
  templateUrl: './payroll-settings.component.html',
  styleUrls: ['./payroll-settings.component.scss']
})

export class PayrollSettingComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public empService: EmployeeService,
    private settingsService: settingsService,
    private assetService: AssetService,
    private toast: ToastrService,
    private projectService: ProjectService,
    private PayrollService: PayrollService,
    private spinner: NgxSpinnerService,
    public Router: Router,
    private route: ActivatedRoute
  ) { }


  //for drop down configuration
  commonFields: Object = { text: "value", value: "id" };


  //payroll settings variable:
  setYearData: number[] = Array.from({ length: 5 }, (_, index) => new Date().getFullYear() + index);
  setMonthData = [{ value: 'January', id: 1 }, { value: 'February', id: 2 }, { value: 'March', id: 3 }, { value: 'April', id: 4 }, { value: 'May', id: 5 }, { value: 'June', id: 6 }, { value: 'July', id: 7 }, { value: 'August', id: 8 }, { value: 'September', id: 9 }, { value: 'October', id: 10 }, { value: 'November', id: 11 }, { value: 'December', id: 12 }];
  //: string[] = Array.from({ length: 12 }, (_, index) => new Date(0, index).toLocaleString('en-US', { month: 'long' }));
  set30days: number[] = Array.from({ length: 30 }, (_, index) => index + 1);
  set28days: number[] = Array.from({ length: 28 }, (_, index) => index + 1);
  lesstimedata: number[] = Array.from({ length: 60 }, (_, index) => index + 1 );
  currencyArr: Array<Object> = [{ value: 'AED', id: 'AED' }, { value: 'USD', id: 'USD' }, { value: 'EUR', id: 'EUR' }, { value: 'GBP', id: 'GBP' }, { value: 'JPY', id: 'JPY' }, { value: 'CAD', id: 'CAD' }, { value: 'INR', id: 'INR' }];

  setdeducdays: number[] = Array.from({length: 9}, (_, i) => i + 2);
  setdeducfixAmount: number[] = Array.from({length: 20}, (_, i) => (i + 1) * 10);

  maxDeducData = [{ text: 'Half Day Salary', id: 'Half Day Salary' }, {text: 'Per Day Salary', id: 'Per Day Salary' }, {text: 'Fixed Amount', id: 'Fixed Amount' },{text: 'No Limit', id: 'No Limit' }];

  setPayRollForm: FormGroup;

  // Payroll cycle
  defaultPayrollCycle = 'Monthly'
  hoursCalc: number[] = Array.from({ length: 12 }, (_, index) => index + 1);
  minutesCalc: number[] = Array.from({ length: 60 }, (_, index) => index + 1);
  overtimeHours = 0;
  overtimeMinutes = 0;


  //UI Variables

  startDate = "Not Selected";
  endDate = "Not Selected";
  dueDate = "Not Selected";
  setDueDate = "Not Selected";
  setstartDate = "Not Selected";
  setlastDate = "Not Selected";
  perdaysalby = '';
  perDayMessage = 'Not selected';

  //radiobuttongroup
  radioButtonlast = false;
  radioButtonspecific = false;
  is_select_days_per_month = false;

  radioCalcYear = false;
  radioCalcActual = false;
  radioCalcSpecific = false;
  is_specific_day_of_month = false;

  radioDueLast = false;
  radioDueSpecific = false;
  is_specific_day_of_next_month = false;

  status = "Unkwon"
  statuscolor = '#5e5e5e'

  calcDays;

  radioabsentperDay = false;
  radioabsentnumberDay = false;
  radioabsentfixAmount = false;

  showmaxDeducfixAmount = false;
  radiolhperMin = false;
  radiolhhalfDay = false;
  radiolhperDay = false;
  radiolhfixamt = false;

  radiocmhalfday = false;
  radiocmperday = false;
  radiocmfixamt = false;

  radiolchalfday = false;
  radiolcperday = false;
  radiolcfixamt = false;

  isabnumberdays = false;
  isabfixedamout = false;
  islhallow = false;
  islhfixedamout = false;
  iscmfixedamout = false;
  islcfixedamout = false;


  enableAutoDeducAbsent: boolean  = false;
  enableAutoDeducLessHour: boolean  = false;
  enableAutoDeducMissCheckout: boolean  = false;
  enableAutoDeducLateCheckin: boolean  = false;
  enableNoDocReq: boolean = false;


  createSettings = false;
  settingsID = '';

  ngOnInit(): void {
    this.setPayRollFormInputs();
    this.checkinitailsSetup();
    // let settings = {is_select_days_per_month : false, days_count : 30, start_year: 2023, start_month : 8, is_last_day_calc: false, set_end_date: 25};
  }

  setPayRollFormInputs() {
    this.setPayRollForm = this.formBuilder.group({
      monthDays: [''],
      setStartYear:['', [Validators.required]] ,
      setStartMonth: ['', [Validators.required]] ,
      setEndDay: [''],
      setDueDay: [''],
      numberDaysAbsent: [''],
      fixdeducAbsent: [''],
      lesstrminutes: [1],
      maxDeducTo: ['Per Day Salary'],
      maxDeducTofixAmount: ['10'],
      fixdeducLessHour: [''],
      fixdeducMissCheckout: [''],
      fixdeducLateCheckin: [''],
      selectedCurrency: [''],
      travelAmont: [1],
    })
    // this.setPayRollForm = new FormGroup({
    //   monthDays: new FormControl(""),
    //   setStartYear: new FormControl("", [Validators.required]),
    //   setStartMonth: new FormControl("", [Validators.required]),
    //   setEndDay: new FormControl("",[{disabled: true }]),
    //   setDueDay: new FormControl(""),
    //   numberDaysAbsent: new FormControl(""),
    //   fixdeducAbsent: new FormControl(""),
    //   lesstrminutes: new FormControl(""),
    //   fixdeducLessHour: new FormControl(""),
    //   fixdeducMissCheckout: new FormControl(""),
    //   fixdeducLateCheckin: new FormControl(""),
    //   selectedCurrency: new FormControl(""),
    // });
  }

  goBack() {
    window.history.go(-1);
  }

  //check this is initail setup for the Organisation
  checkinitailsSetup(){
    this.PayrollService.GetPayrollSettingByOrgId({"id": localStorage.getItem('org_id')}).subscribe((rsp :any) => {
      if(rsp){
        if(rsp.length == 0){
          console.log("the payroll settings is empty", rsp.length);
          this.route.queryParamMap.subscribe(params => {
            const showInitializeSwal = params.get('showInitializeSwal');
            console.log(showInitializeSwal);
            if(!showInitializeSwal){
              Swal.fire(
                'Initialise the Payroll Settings!',
                'After the Initialisation you will have the ability to create the Payroll table for this organistion!',
                'info'
              )
            }
          });

          this.createSettings= true;
        }else{
          this.createSettings = false;
          this.loadsettings(rsp[0]);
        }
      }
    });
  }

  //loading the defult settings
  loadsettings(settingData) {

    this.settingsID = settingData.id;

    this.deducABby = '';
    this.deducLHby = '';
    this.deducCMby = '';
    this.deducLCby = '';

    this.perdaysalby = '';

    this.radioButtonlast = false;
    this.radioButtonspecific = false;
    this.is_specific_day_of_month = false;
    this.setstartDate = 'Not Selected';
    this.setlastDate = 'Not Selected';

    this.radioDueLast = false;
    this.radioDueSpecific = false;
    this.is_specific_day_of_next_month = false;
    this.setDueDate = 'Not Selected';

    this.radioCalcYear = false;
    this.radioCalcActual = false;
    this.radioCalcSpecific = false;
    this.is_select_days_per_month = false;
    this.perDayMessage = 'Not Selected';

    this.enableAutoDeducAbsent  = false;
    this.radioabsentperDay = false;
    this.radioabsentnumberDay = false;
    this.radioabsentfixAmount = false;
    this.isabnumberdays = false;
    this.isabfixedamout = false;

    this.enableAutoDeducLessHour = false;
    this.showmaxDeducfixAmount = false;
    this.islhallow = false;
    this.radiolhperMin = false;
    this.radiolhhalfDay = false;
    this.radiolhperDay = false;
    this.radiolhfixamt = false;
    this.islhfixedamout = false;

    this.enableAutoDeducMissCheckout  = false;
    this.radiocmhalfday = false;
    this.radiocmperday = false;
    this.radiocmfixamt = false;
    this.iscmfixedamout = false;

    this.enableAutoDeducLateCheckin  = false;
    this.radiolchalfday = false;
    this.radiolcperday = false;
    this.radiolcfixamt = false;
    this.islcfixedamout = false;

    this.enableNoDocReq = false;

    //initialising eveverything to zero
    this.setPayRollForm.patchValue({
      setStartYear: null,
      setStartMonth: null,
      setEndDay: null,
      setDueDay: null,
      monthDays: null,
      numberDaysAbsent: null,
      fixdeducAbsent: null,
      lesstrminutes: null,
      maxDeducTo: null,
      maxDeducTofixAmount: 10,
      fixdeducLessHour: null,
      fixdeducMissCheckout: null,
      fixdeducLateCheckin: null,
      selectedCurrency: null,
    })

    this.setPayRollForm.patchValue({
      setStartYear: settingData.start_year,
      setStartMonth: settingData.start_month,
      setEndDay: settingData.set_end_date,
      setDueDay: settingData.set_due_day,
      monthDays: settingData.days_count,
      numberDaysAbsent: settingData.num_day_ab,
      fixdeducAbsent: settingData.ab_dedc_by == 'abfixamt' ? settingData.ab_fixamt : 0,
      lesstrminutes: settingData.lh_dedc_by == 'lhpermin'? settingData.lh_tolr_min : 1,
      maxDeducTo: settingData.lh_maxdeduc_by,
      maxDeducTofixAmount: settingData.lh_maxdeduc_fixamt,
      fixdeducLessHour: settingData.lh_dedc_by == 'lhfixamt' ? settingData.lh_fixamt : 0,
      fixdeducMissCheckout: settingData.cm_dedc_by == 'cmfixamt' ? settingData.cm_fixamt : 0,
      fixdeducLateCheckin: settingData.lc_dedc_by == 'lcfixamt' ? settingData.lc_fixamt : 0,
      selectedCurrency: settingData.currency
    })

    if(settingData.is_last_day_calc == true){
      this.radioButtonlast = true;
      this.radioButtonspecific= false;
      this.is_specific_day_of_month = false;
      console.log(this.radioButtonlast, this.radioButtonspecific,this.is_specific_day_of_month);
      this.computeCycle(0, this.setPayRollForm.value.setStartMonth, this.setPayRollForm.value.setStartYear);
    }else if(settingData.is_last_day_calc == false){
      this.radioButtonlast = false;
      this.radioButtonspecific = true;
      this.is_specific_day_of_month = true;
      console.log(this.radioButtonlast, this.radioButtonspecific,this.is_specific_day_of_month);
    }

    if(settingData.is_due_last_day == true)
    {
      this.clickDueRadio('last');
      this.radioDueLast = true;
      this.radioDueSpecific = false;
      this.is_specific_day_of_next_month = false;
    } else if(settingData.is_due_last_day == false){
      this.clickDueRadio('specific');
      this.radioDueLast = false;
      this.radioDueSpecific = true;
      this.is_specific_day_of_next_month = true;
    }

    this.computPerDaySalBy(settingData.per_day_sal_by, settingData.days_count);

    if (settingData.is_auto_dedec_ab) {
      this.enableAutoDeducAbsent = true;
      this.deducABby = settingData.ab_dedc_by;
    }else{
      this.enableAutoDeducAbsent = false;
    }

    if(settingData.ab_dedc_by == 'abperday'){
      this.radioabsentperDay = true;
    }
    else if(settingData.ab_dedc_by == 'abnumberday'){
      this.radioabsentnumberDay = true;
      this.isabnumberdays = true;
    }
    else if(settingData.ab_dedc_by == 'abfixamt'){
      this.radioabsentfixAmount = true;
      this.isabfixedamout = true;
    }

    if(settingData.is_auto_dedc_lh){
      this.enableAutoDeducLessHour = true;
      this.deducLHby = settingData.lh_dedc_by;
    }else{
      this.enableAutoDeducLessHour = false;
    }

    if(settingData.lh_dedc_by == 'lhpermin'){
      this.islhallow = true;
      this.radiolhperMin = true;
      if(settingData.lh_maxdeduc_by == 'Fixed Amount'){
        this.showmaxDeducfixAmount = true;
      }
    }
    else if(settingData.lh_dedc_by == 'lhhalfday'){
      this.radiolhhalfDay = true;
    }
    else if(settingData.lh_dedc_by == 'lhperday'){
      this.radiolhperDay = true;
    }
    else if(settingData.lh_dedc_by == 'lhfixamt'){
      this.radiolhfixamt = true;
      this.islhfixedamout = true;
    }

    if(settingData.is_auto_dedc_cm){
      this.deducCMby = settingData.cm_dedc_by;
      this.enableAutoDeducMissCheckout = true;
    }else{
      this.enableAutoDeducMissCheckout = false;
    }

    if(settingData.cm_dedc_by == 'cmphalfday'){
      this.radiocmhalfday = true;
    }
    else if(settingData.cm_dedc_by == 'cmperday'){
      this.radiocmperday = true;
    }
    else if(settingData.cm_dedc_by == 'cmfixamt'){
      this.radiocmfixamt = true;
      this.iscmfixedamout = true;
    }

    if(settingData.is_auto_dedc_lc){
      this.deducLCby = settingData.lc_dedc_by;
      this.enableAutoDeducLateCheckin = true;
    }else{
      this.enableAutoDeducLateCheckin = false;
    }

    if(settingData.lc_dedc_by =='lchalfday'){
      this.radiolchalfday = true;
    }
    else if(settingData.lc_dedc_by == 'lcperday'){
      this.radiolcperday = true;
    }
    else if(settingData.lc_dedc_by == 'lcfixamt'){
      this.radiolcfixamt = true;
      this.islcfixedamout = true;
    }

    if(settingData.no_doc_req)
    {
      this.enableNoDocReq = true;
    }else{
      this.enableNoDocReq = false;
    }

  }

  changeAbsentradio(check){

    if(check=='abperday'){
      this.deducABby = 'abperday';
      this.radioabsentperDay = true;
      this.isabfixedamout = false;
      this.isabnumberdays = false;
    }else if(check=='abnumberday'){
      this.deducABby = 'abnumberday';
      this.radioabsentnumberDay = true;
      this.isabnumberdays = true;
      this.isabfixedamout = false;
    }
    else if(check=='abfixamt'){
      this.deducABby = 'abfixamt';
      this.radioabsentfixAmount = true;
      this.isabfixedamout = true;
      this.isabnumberdays = false;
    }

  }

  changeLhradio(check){

    if(check=='lhpermin'){
      this.deducLHby = 'lhpermin';
      this.radiolhperMin = true;
      this.islhallow = true;
      this.radiolhhalfDay = false;
      this.radiolhperDay = false;
      this.radiolhfixamt = false;
      this.islhfixedamout = false;
    }
    else if(check=='lhhalfday'){
      this.deducLHby = 'lhhalfday';
      this.radiolhperMin = false;
      this.islhallow = false;
      this.radiolhhalfDay = true;
      this.radiolhperDay = false;
      this.radiolhfixamt = false;
      this.islhfixedamout = false;
    }
    else if(check=='lhperday'){
      this.deducLHby = 'lhperday';
      this.radiolhperMin = false;
      this.islhallow = false;
      this.radiolhhalfDay = false;
      this.radiolhperDay = true;
      this.radiolhfixamt = false;
      this.islhfixedamout =false;
    }
    else if(check=='lhfixamt'){
      this.deducLHby = 'lhfixamt';
      this.radiolhperMin = false;
      this.islhallow = false;
      this.radiolhhalfDay = false;
      this.radiolhperDay = false;
      this.radiolhfixamt = true;
      this.islhfixedamout = true;
    }

  }

  changeCMRadio(check){

    if(check=='cmphalfday'){
      this.deducCMby = 'cmphalfday';
      this.radiocmhalfday = true;
      this.radiocmperday = false;
      this.radiocmfixamt = false;
      this.iscmfixedamout = false;
    }
    else if(check=='cmperday'){
      this.deducCMby = 'cmperday';
      this.radiocmhalfday = false;
      this.radiocmperday = true;
      this.radiocmfixamt = false;
      this.iscmfixedamout = false;
    }
    else if(check=='cmfixamt'){
      this.deducCMby = 'cmfixamt';
      this.radiocmhalfday = false;
      this.radiocmperday = false;
      this.radiocmfixamt = true;
      this.iscmfixedamout = true;
    }

  }

  changeLCRadio(check){

    if(check=='lchalfday'){
      this.deducLCby = 'lchalfday';
      this.radiolchalfday = true;
      this.radiolcperday = false;
      this.radiolcfixamt = false;
      this.islcfixedamout = false;
    }
    else if(check=='lcperday'){
      this.deducLCby = 'lcperday';
      this.radiolchalfday = false;
      this.radiolcperday = true;
      this.radiolcfixamt = false;
      this.islcfixedamout = false;
    }
    else if(check=='lcfixamt'){
      this.deducLCby = 'lcfixamt';
      this.radiolchalfday = false;
      this.radiolcperday = false;
      this.radiolcfixamt = true;
      this.islcfixedamout = true;
    }

  }

  //Calculating the Payment cycle start and end dates
  computeCycle(day: number, month: number, year: number) {
    if (day == 0) {
      this.radioButtonlast = true;
      this.setstartDate = moment(new Date(year, month - 1, 1)).format("ll");
      this.setlastDate = moment(this.getLastDateOfMonth(year, month)).format("ll");
    }
    else {
      this.radioButtonspecific = true;
      this.setstartDate = moment(new Date(year, month - 2, day + 1)).format("ll");
      this.setlastDate = moment(new Date(year, month - 1, day)).format("ll");
    }
  }

  calcSetDueDate(day: number, month: number, year: number) {
    if (day == 0) {
      this.radioDueLast = true;
      this.setDueDate = moment(this.getLastDateOfMonth(year, month)).format("ll");
    } else {
      this.radioDueSpecific = true;
      this.setDueDate = moment(new Date(year, month, day)).format("ll");
    }
  }

  computPerDaySalBy(selected, days) {
    if (selected == 'year') {
      this.radioCalcYear = true;
      this.radioCalcActual = false;
      this.radioCalcSpecific = false;
      this.is_select_days_per_month = false;
      this.perdaysalby = 'year';
      this.perDayMessage = 'x 12 / 365';
    }
    else if (selected == 'month') {
      this.radioCalcYear = false;
      this.radioCalcActual = true;
      this.radioCalcSpecific = false;
      this.is_select_days_per_month = false;
      this.perdaysalby = 'month';
      this.perDayMessage = ' / Actual number of Days in the Payment Month ';
    }
    else if (selected == 'select') {
      this.radioCalcYear = false;
      this.radioCalcActual = false;
      this.radioCalcSpecific = true;
      this.is_select_days_per_month = true;
      this.perdaysalby = 'select';
      let count = days
      this.perDayMessage = ' / ' + count;
    }
  }

  changePerDaySalRadio(e) {
    if (e == 'year') {
      this.radioCalcYear = true;
      this.radioCalcActual = false;
      this.radioCalcSpecific = false;
      this.is_select_days_per_month = false;
      this.perdaysalby = 'year';
      this.perDayMessage = 'x 12 / 365';
    }
    else if (e == 'month') {
      this.radioCalcYear = false;
      this.radioCalcActual = true;
      this.radioCalcSpecific = false;
      this.is_select_days_per_month = false;
      this.perdaysalby = 'month';
      this.perDayMessage = ' / Actual number of Days in the Payment Month ';
    }
    else if (e == 'select') {
      this.radioCalcYear = false;
      this.radioCalcActual = false;
      this.radioCalcSpecific = true;
      this.is_select_days_per_month = true;
      this.perdaysalby = 'select';
      let count = this.setPayRollForm.value.monthDays
      this.perDayMessage = ' / ' + count;
    }
  }

  changeDaysPerMonth(e) {
    console.log("check here ", e);
    this.perDayMessage = ' / ' + e.value;
  }

  changeYear(e) {
  // this.toast.info("Please select the reqired month and Last Day for the Payment Cycle!");
  }

  changeMonth(e) {
   // this.toast.info("Please select the reqired Last Day for the Payment Cycle!");
  }

  clickDayOfMonth(e) {
    if(this.createSettings == true){
      if (e == 'last') {
        this.radioButtonlast ? this.radioButtonlast = false : this.radioButtonlast = true;
        this.radioButtonspecific = false;
        this.is_specific_day_of_month = false;
        this.computeCycle(0, this.setPayRollForm.value.setStartMonth, this.setPayRollForm.value.setStartYear);
      }
      else if (e = 'specific') {
        this.radioButtonlast = false;
        this.radioButtonspecific ? this.radioButtonspecific = false : this.radioButtonspecific = true;
        this.radioButtonspecific ? this.is_specific_day_of_month = true : this.is_specific_day_of_month = false;
        if (this.setPayRollForm.value.setEndDay) {
          this.changelastDay({ itemData: { value: this.setPayRollForm.value.setEndDay } });
        }
      }
    }else{
      this.toast.warning("You cant change the Payroll setting after Initialising the settings!");
    }

  }

  changelastDay(e) {
    if (e.itemData.value) {
      this.computeCycle(e.itemData.value, this.setPayRollForm.value.setStartMonth, this.setPayRollForm.value.setStartYear);
    }
  }

  changeCurrency(e) {
    console.log(e, "SELECTED CURRENCY EVENT!")
  }

  clickDueRadio(e) {
    let month = this.setPayRollForm.value.setStartMonth;
    let year = this.setPayRollForm.value.setStartYear;
    if (e == 'last') {
      this.radioDueLast ? this.radioDueLast = false : this.radioDueLast = true;
      this.radioDueSpecific = false;
      this.is_specific_day_of_next_month = false;
      this.calcSetDueDate(0, month, year);
    }
    else if (e = 'specific') {
      this.radioDueLast = false;
      this.radioDueSpecific ? this.radioDueSpecific = false : this.radioDueSpecific = true;
      this.radioDueSpecific ? this.is_specific_day_of_next_month = true : this.is_specific_day_of_next_month = false;
      if (month == 12) {
        month = 0;
        year = year + 1;
      }
      //this.calcSetDueDate(this.setPayRollForm.value.setDueDay, month, year);
    }

    console.log("from changeing the due date:",
      "radiDueLast",this.radioDueLast,
      "radiDueSpecific",this.radioDueSpecific,
      "is_specific_day_of_next_month",this.is_specific_day_of_next_month);

  }

  changeDueDay(e) {
    if (e.itemData.value) {
      this.calcSetDueDate(e.itemData.value, this.setPayRollForm.value.setStartMonth, this.setPayRollForm.value.setStartYear);
    }
  }

  changeMaxdeducdata(event){
    console.log("check here", event );
    if(event.itemData.text == 'Fixed Amount'){
      this.showmaxDeducfixAmount = true;
    }else{
      this.showmaxDeducfixAmount = false;
    }
  }

  showSalaryDetails = false;

  deducABby = ''
  deducLHby = ''
  deducCMby = ''
  deducLCby = ''

  savePayrollSettings() {

    console.log("clicked save button!!!");

    let formData = this.setPayRollForm.value;
    let userinfo = JSON.parse(localStorage.getItem('user_info'));

    let validation = [];

    if(!formData.setStartYear || !formData.setStartMonth){
      this.toast.error("Please Select the Start Year and Month!");
      return;
    }

    if( this.radioButtonlast == false && !formData.setEndDay)
    {
      this.toast.error("Please Select the End Day of the Payment Cycle!");
      return;
    }

    if( this.radioDueLast == false && !formData.setDueDay)
    {
      this.toast.error("Please Select the Payment Due Date for the Payment Cycle!");
      return;
    }

    if(this.enableAutoDeducAbsent){
      if(this.deducABby == ''){
        this.toast.error("Please Select Auto Deduct Absent Action");
        return;
      }
      if(this.deducABby == 'abnumberday' && !formData.numberDaysAbsent  )
      {
        this.toast.error("Please Select Auto Deduct Absent : Number of Salary Days ");
        return;
      }
      if(this.deducABby == 'abfixamt' && !formData.fixdeducAbsent  )
      {
        this.toast.error("Please Select Auto Deduct Absent : Fix Amount ");
        return;
      }
    }

    if(this.enableAutoDeducLessHour){
      if(this.deducLHby == ''){
        this.toast.error("Please Select Auto Deduct Less Hour Action");
        return;
      }
      if(this.deducLHby == 'lhpermin' && !formData.lesstrminutes  )
      {
        this.toast.error("Please Select Auto Deduct Less Hour : Per Minute Value");
        return;
      }
      if(formData.maxDeducData == 'Fixed Amount' && !formData.maxDeducTofixAmount  ){
        this.toast.error("Please Select Auto Deduct Less Hour : Fixed Amount");
        return;
      }
      if(this.deducLHby == 'lhfixamt' && !formData.fixdeducLessHour  )
      {
        this.toast.error("Please Select Auto Deduct Less Hour : Fix Amount");
        return;
      }
    }

    if(this.enableAutoDeducMissCheckout){
      if(this.deducCMby == ''){
        this.toast.error("Please Select Auto Deduct Missing Checkout Action");
        return;
      }
      if(this.deducCMby == 'cmfixamt' && !formData.fixdeducMissCheckout  )
      {
        this.toast.error("Please Select Auto Deduct Missing Checkout: Fix Amount");
        return;
      }
    }


    if(this.enableAutoDeducLateCheckin){
      if(this.deducLCby == ''){
        this.toast.error("Please Select Auto Deduct Late Checkin Action");
        return;
      }
      if(this.deducLCby == 'cmfixamt' && !formData.fixdeducLateCheckin  )
      {
        this.toast.error("Please Select Auto Deduct Late Checkin: Fix Amount");
        return;
      }
    }

    let postData = {
      id: '',
      org_id: localStorage.getItem("org_id").toString(),
      payment_cycle: this.defaultPayrollCycle,
      start_year: formData.setStartYear,
      start_month: formData.setStartMonth,
      is_last_day_calc: this.radioButtonlast,
      set_end_date: this.radioButtonlast? 0 : formData.setEndDay,
      is_due_last_day: this.radioDueLast,
      set_due_day: this.radioDueLast ? 0 : formData.setDueDay,
      per_day_sal_by: this.perdaysalby,
      days_count: formData.monthDays =='' ? 0 : formData.monthDays ,
      is_auto_dedec_ab: this.enableAutoDeducAbsent,
      ab_dedc_by: this.deducABby,
      num_day_ab: formData.numberDaysAbsent  =='' ? 0 : formData.numberDaysAbsent,
      ab_fixamt: formData.fixdeducAbsent =='' ? 0 : formData.fixdeducAbsent ,
      is_auto_dedc_lh: this.enableAutoDeducLessHour,
      lh_tolr_min: formData.lesstrminutes  =='' ? 0 : formData.lesstrminutes, //this was changed as the per minutes deduction value, after shifting the less hour tolerence to the team member moduule.
      lh_dedc_by: this.deducLHby,
      lh_fixamt: formData.fixdeducLessHour  =='' ? 0 : formData.fixdeducLessHour,
      lh_maxdeduc_by: formData.maxDeducTo,
      lh_maxdeduc_fixamt: formData.maxDeducTofixAmount =='' ? 0 : formData.maxDeducTofixAmount,
      is_auto_dedc_cm: this.enableAutoDeducMissCheckout,
      cm_dedc_by: this.deducCMby,
      cm_fixamt: formData.fixdeducMissCheckout =='' ? 0 : formData.fixdeducMissCheckout,
      is_auto_dedc_lc: this.enableAutoDeducLateCheckin,
      lc_dedc_by: this.deducLCby,
      lc_fixamt: formData.fixdeducLateCheckin =='' ? 0 : formData.fixdeducLateCheckin,
      currency: formData.selectedCurrency,
      no_doc_req: this.enableNoDocReq,
      created_by: userinfo['full_name'],
      modified_by: userinfo['full_name'],
      is_deleted: false
    }

    if(postData.lh_maxdeduc_fixamt==null){
      postData.lh_maxdeduc_fixamt=10;
    }

    console.log("postData", postData);

    if(this.createSettings)
    {
      this.PayrollService.AddPayrollSetting(postData).subscribe((rsp:any) =>{
        if(rsp.result.status === "200"){
          //this.toast.success(rsp.result.desc);
          Swal.fire("Payroll Settings Initialized!", "Now you can create the Payroll Table!", "success");
          this.createSettings = false;
        }
      })

    }else{
      postData.id = this.settingsID
      console.log("postData in update payrollsettings", postData);
      this.PayrollService.UpdatePayrollSetting(postData).subscribe((rsp: any)=>{
        if(rsp.result.status === "200"){
          Swal.fire("Payroll Settings Updated!", "Now you can create the Payroll Table! with new settings", "success");
        }
      })
    }

  }

  //Utility Functions:
  getLastDateOfMonth(year: number, month: number): Date {
    const nextMonth = new Date(year, month, 1);
    nextMonth.setHours(-1);
    return nextMonth;
  }

}
