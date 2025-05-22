import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { EmployeeService } from '../../services/employee.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DatePipe } from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-travel-claim',
  templateUrl: './travel-claim.component.html',
  styleUrls: ['./travel-claim.component.scss']
})
export class TravelClaimComponent implements OnInit {

  @ViewChild('travelTableGrid',{static:false}) public travelTableGrid: GridComponent;
  public travelToolbar : ToolbarItems[];
  userInfo = JSON.parse(localStorage.getItem('user_info'));
  //user rights var
  commonModuleName
  noAccessToTravelPage = false;
  viewTravelHistory = false;

  dateRangeForm: FormGroup;
  //dates
  today: Date = new Date(new Date().toDateString());
  maxRangeDateTwo: Date = this.today;
  monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
  monthEnd: Date = this.today;
  lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
  lastEnd: Date = this.today;
  yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
  yearEnd: Date = this.today;
  getStartDate;
  getEndDate;

  commonFields: Object = { text: "value", value: "id" };
  allEmpData;
  employeeData
  start_end_marker = [];
  selectedLatLong;
  lat;
  lng;
  zoom;
  currentEmployeeName
  empTotalDistance
  selectedDate

  @ViewChild('searchDropdown',{static:false}) public dropDownListObject: DropDownListComponent;

  constructor(
    public userService: UserService,
    public employeeService: EmployeeService,
    private spinner:NgxSpinnerService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(){
    this.travelToolbar = ['Search', 'PdfExport', 'ExcelExport'];
    this.checkUserRights();
    this.dateRangeFormInput();
    this.dateRangeForm.patchValue({
      dateRange:[new Date(), new Date()]
    })
    this.getStartDate = moment().format('YYYY-MM-DD');
    this.getEndDate = moment().add(1, 'days').format('YYYY-MM-DD')
    this.getEmployeeByOrg();
    this.EmployeeTravelClmByOrgIdAndDate();


    //range date
    this.dateRangeForm.get('dateRange').valueChanges.subscribe(() => {
      let dateVaue = this.dateRangeForm.get('dateRange').value;
      this.getStartDate = moment(dateVaue[0]).format('YYYY-MM-DD');
      this.getEndDate = moment(dateVaue[1]).add(1, 'days').format('YYYY-MM-DD');
      this.dropDownListObject.value = null;
      this.EmployeeTravelClmByOrgIdAndDate();
    });
  }

  checkUserRights(){
    if(this.userInfo.is_superadmin){
      this.viewTravelHistory = true;
      this.noAccessToTravelPage = false;
    }else{
      let postData = { id : this.userInfo.role_id }
      this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
        data.map((item) => {
          item.module_name = item.module_name.replace(/\s+/g, '');;
          return item;
        });
        this.commonModuleName = _.groupBy(data, 'module_name');
        //travel
        if(this.commonModuleName.Travel){
          this.commonModuleName.Travel.map((elm) => {
            if(elm.section_name === 'View Travel History'){
              if(elm.is_allow === true){
                this.viewTravelHistory = true;
              }
            }
          });
        }else{
          this.noAccessToTravelPage = true;
        }
      });
    }
  }

  changeEmployee(e){
    let postData = {
      id: e.itemData.id,
      fromDate: this.getStartDate,
      toDate: this.getEndDate
    }
    this.employeeLocationByEmpIDAndDate(postData)
  }

  EmployeeTravelClmByOrgIdAndDate(){
    //this.dropDownListObject.value = null;
    this.spinner.show();
    let sendData = {
      orgID: this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
      fromDate: this.getStartDate,
      toDate: this.getEndDate
    }
    console.log(sendData);

    this.employeeService.EmployeeTravelClmByOrgIdAndDate(sendData).subscribe((data: any) => {
      data.map((elm) => {
        elm.created_date = this.datePipe.transform(elm.created_date,'dd/MM/yyyy hh:mm a');
      })
      this.employeeData = data;
      // const filteredData= data;
      console.log(this.employeeData,"Travel Data");
      const filteredData = this.employeeData.filter((elm) => {
        let distanceAsInt = parseFloat(elm.distance);
        let checkinlat= parseFloat(elm.checkin_lat)
        let checkinlang=parseFloat(elm.checkin_lang)
        let checkoutlat=parseFloat(elm.checkout_lat)
        let checkoutlang=parseFloat(elm.checkout_lang)
        let checkoutaddress=elm.checkout_formatted_address


        // Check if the parsed distance is greater than 1
        return checkinlat!= 0 && checkinlang!=0 && checkoutlat!=0 &&  checkoutlang!=0 && checkoutaddress!=''

        // this.hasSameDecimalDigits(elm.checkin_lat, elm.checkout_lat, 4) &&
        // this.hasSameDecimalDigits(elm.checkin_lang, elm.checkout_lang, 4)
      });
      console.log(filteredData,"Filtered Data");
      this.employeeData=filteredData;
      this.spinner.hide();
    })
  }

  employeeLocationByEmpIDAndDate(postData){
    this.spinner.show();
    this.employeeService.EmployeeLocationByEmpIDAndDate(postData).subscribe((data: any) => {
      //console.log(data)
      data.map((elm) => {
        elm.created_date = this.datePipe.transform(elm.created_date,'dd/MM/yyyy hh:mm a');
      })
      this.employeeData = data;

      console.log(this.employeeData,"Travel Data");

      this.spinner.hide();
    });
  }

  viewMapModel(data){
    console.log(data)
    var unq = data.travelClaimTrack.reduce((unique, o) => {
      if(!unique.some(obj => obj.lat === o.lat && obj.lang === o.lang  )) {
        unique.push(o);
      }
      return unique;
    },[]);
    this.empTotalDistance = data.distance;
    this.selectedDate = data.created_date;
    this.currentEmployeeName = data.createdby
    this.spinner.show();
    this.start_end_marker = [];
    this.selectedLatLong = [];
    unq.map((elm) => {
      this.selectedLatLong.push([Number(elm.lat), Number(elm.lang)])
    });

    this.start_end_marker.push({
      lat: this.selectedLatLong[0][0],
		  lng: this.selectedLatLong[0][1],
      label: 'CheckOut: '+data.checkout_formatted_address
    });
    this.start_end_marker.push({
      lat: this.selectedLatLong[this.selectedLatLong.length - 1][0],
		  lng: this.selectedLatLong[this.selectedLatLong.length - 1][1],
		  label: 'CheckIn: '+data.checkin_formatted_address
    })
    console.log(this.selectedLatLong,"Location Track")

    this.lat = this.selectedLatLong[0][0],
    this.lng = this.selectedLatLong[this.selectedLatLong.length - 1][1];
    this.zoom = 10;
    $('#map_modal').modal('show');

    this.spinner.hide();
  }

  OnClose(){
    $('#map_modal').modal('hide');
  }

  getEmployeeByOrg(){
    this.employeeService.getEmployeeByOrgId().subscribe((data: any) => {
      let result = [];
      data.map((elm) => {
        result.push({
          id: elm.id,
          value: elm.full_name
        });
      });
      this.allEmpData = result;
    })
  }

  //form
  dateRangeFormInput(){
    this.dateRangeForm = new FormGroup({
      dateRange: new FormControl(''),
    });
  }

  travelGridDownload(args: ClickEventArgs){
    console.log('employee');
    switch (args.item.text) {
      case 'PDF Export':
          this.travelTableGrid.pdfExport();
          break;
      case 'Excel Export':
          this.travelTableGrid.excelExport();
          break;
      case 'CSV Export':
          this.travelTableGrid.csvExport();
      break;
    }
  }
}
