import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import * as moment from 'moment';
import * as _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-workforce-new',
  templateUrl: './workforce-new.component.html',
  styleUrls: ['./workforce-new.component.scss']
})
export class WorkforceNewComponent implements OnInit {

  datePickerForm: FormGroup;
  maxRangeDate = new Date(new Date().toDateString());
  currentDateValue;
  dateDisable = false;
  workForceData: any;
  showDetailsActivity = false;
  detailsActivityDataFromClick;
  detailsOverAllData
  detailsActivityIdleData
  tableActivityData
  commonFilterValue = [
    {
      id:'All',
      text:'All'
    },{
      id:'Active',
      text:'Active'
    },{
      id:'Idle',
      text:'Idle'
    }
  ];
  commonSelectedValue = 'All';

  constructor(
    public employeeService: EmployeeService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(){
    this.fetchDatePickerForm();

    this.datePickerForm.patchValue({
      date: new Date()
    })
    this.currentDateValue = new Date();
    this.GetAppUsageDataByOrgId(this.currentDateValue);

    // fires when the input value has actually changed
    this.datePickerForm.get('date').valueChanges.subscribe(() => {
      let dateValue = this.datePickerForm.get('date').value;
      this.currentDateValue = dateValue
      this.GetAppUsageDataByOrgId(this.currentDateValue);
    });

  }

  prevday(){
    let formValue = this.datePickerForm.value;
    let currentValue = moment(formValue.date).subtract(1, 'day').toDate();
    this.datePickerForm.patchValue({
      date: currentValue
    });
    moment(currentValue).format('L') === moment().format('L') ? this.dateDisable = true : this.dateDisable = false;
  }

  nextday(){
    let formValue = this.datePickerForm.value;
    if(moment(formValue.date).format('L') === moment().format('L')){
      this.dateDisable = true;
      this.datePickerForm.patchValue({
        date: new Date()
      });
    }else{
      this.dateDisable = false;
      let currentValue = moment(formValue.date).add(1, 'day').toDate();
      this.datePickerForm.patchValue({
        date: currentValue
      });
    }
  }

  GetAppUsageDataByOrgId(date){
    this.spinner.show();
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let postData = {
      "orgID": user_info.org_id !== null ? user_info.org_id : localStorage.getItem('org_id'),
      "fromDate": moment(date).format('YYYY-MM-DD'),
      "toDate": moment(date).add(1, 'days').format('YYYY-MM-DD')
    }
    this.employeeService.GetAppUsageDataByOrgId(postData).subscribe((data: any) => {
      if(data.length !== 0){
        let result = _(data).groupBy(x => x.emp_id).map((value, key) => ({
          emp_id: key,
          ondate: value[0].ondate,
          createdby: value[0].createdby,
          start_time: moment(value[0].start_time, "HH:mm:ss").format("LT"),
          end_time: moment(value[value.length - 1].end_time, "HH:mm:ss").format("LT"),
          total_time: moment.utc(moment(value[value.length - 1].end_time, "HH:mm:ss").diff(moment(value[0].start_time, "HH:mm:ss"))).format("HH:mm"),
          employeeAppTrackedModel: value
        })).value();

        let usageArr = [];
        result.map((itm)=>{
          let trackArr =[];
          let tempObj = {};
          tempObj = { ...itm };
          itm.employeeAppTrackedModel.map((elm) => {
            elm.employeeAppTrackedModel.map((it)=>{
              trackArr.push(it)
            });
          });
          delete tempObj['employeeAppTrackedModel'];
          tempObj['trackData'] = trackArr;
          usageArr.push(tempObj);
        });
        this.workForceData = usageArr;
      }else{
        this.workForceData = []
      }
      this.spinner.hide();
    });
  }

  seeActivity(elm){
    this.showDetailsActivity = true;
    this.detailsOverAllData = {
      ondate: elm.ondate,
      start_time: elm.start_time,
      end_time: elm.end_time,
      total_time: elm.total_time
    }
    this.detailsActivityDataFromClick = elm.trackData;
    this.detailsActivityIdleData = elm.trackData;
    this.processActivityAndIdle()
  }

  processActivityAndIdle(){
    let active = [];
    let idle = [];
    this.detailsActivityDataFromClick.map((elm) => {
      if(elm.app_name !== "Idle"){
        active.push(elm.time_spend.split(':').length > 1 ? '00:'+elm.time_spend: elm.time_spend)
      }else{
        idle.push(elm.time_spend.split(':').length > 1 ? '00:'+elm.time_spend: elm.time_spend)
      }
    });
    console.log(active, idle)
    let activeTime = this.sumTime(active)
    let idleTime = this.sumTime(idle)
    this.tableActivityData = {
      activeCount: active.length,
      activeTimeTotal: activeTime,
      idleCount: idle.length,
      idleTimeTotal: idleTime,
      totalCount: active.length + idle.length,
      totalTime: this.detailsOverAllData.total_time
    }
    console.log(this.tableActivityData)
  }

  sumTime(times) {
    let sumSeconds = 0;

    times.forEach(time => {
      let a = time.split(":");
      let seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
      sumSeconds += seconds;
    });

    return new Date(sumSeconds * 1000).toISOString().substr(11, 8);
  }


  changeFilter(event){
    this.spinner.show();
    if(event.itemData.text === 'All'){
      this.detailsActivityIdleData = this.detailsActivityDataFromClick;
      this.spinner.hide();
    }else if(event.itemData.text === 'Active'){
      this.detailsActivityIdleData = [];
      this.detailsActivityDataFromClick.map((elm) => {
        if(elm.app_name !== "Idle"){
          this.detailsActivityIdleData.push(elm)
        }
      });
      this.spinner.hide();
    }else if(event.itemData.text === 'Idle'){
      this.detailsActivityIdleData = [];
      this.detailsActivityDataFromClick.map((elm) => {
        if(elm.app_name === "Idle"){
          this.detailsActivityIdleData.push(elm)
        }
      });
      this.spinner.hide();
    }
  }

  backtoListing(){
    this.showDetailsActivity = false;
  }

  fetchDatePickerForm(){
    this.datePickerForm = new FormGroup({
      date: new FormControl(''),
    });
  }

}
