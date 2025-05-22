
import { Component, OnInit, ViewEncapsulation, ViewChildren } from '@angular/core';
import { routerTransition } from '../../router.animations';
declare var $:any;

import * as moment from 'moment';
import { TimeSheetService } from '../../services/timesheet.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import {  OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { ILoadedEventArgs, ChartComponent, IAxisLabelRenderEventArgs, ITooltipRenderEventArgs } from '@syncfusion/ej2-angular-charts';
import { ChartSeriesType, EmptyPointMode, ChartTheme } from '@syncfusion/ej2-charts';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { TabComponent, SelectEventArgs, EJ2Instance } from '@syncfusion/ej2-angular-navigations';
import { AxisModel, ChartAreaModel, TooltipSettingsModel, pointByIndex, MarkerSettingsModel } from '@syncfusion/ej2-angular-charts';
import * as d3Timelines from 'd3-timelines';
import * as d3TimeFormat from 'd3-time-format';

import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart

} from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormControl } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { DataManager, Query, UrlAdaptor, WebApiAdaptor, ODataAdaptor } from '@syncfusion/ej2-data';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';
import { TeamService } from '../../services/team.service';
import { Select2TemplateFunction, Select2OptionData } from 'ng2-select2';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService, EventSettingsModel, View, PopupOpenEventArgs, ScheduleComponent, ActionEventArgs, RenderCellEventArgs, EventRenderedArgs } from '@syncfusion/ej2-angular-schedule';
import { isNullOrUndefined } from 'util';
import { ActivityService } from '../../services/activity.service';
import * as Highcharts from 'highcharts';

 import * as d3 from "d3-selection";
import Exporting from 'highcharts/modules/exporting';
import xrange from "highcharts/modules/xrange";
declare var require: any;
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
import { ToolbarItems, SearchSettingsModel } from '@syncfusion/ej2-angular-grids';

import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
xrange(Highcharts);
Exporting(Highcharts);
am4core.useTheme(am4themes_animated);
let chart;
let taskchart;
var svg;
@Component({
  selector: 'app-activities-emp',
  templateUrl: './activities-emp.component.html',
  styleUrls: ['./activities-emp.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
})

export class ActivitiesEmpComponent implements OnInit {
  @ViewChild('timeTrackGrid', { static: true }) public grid: GridComponent;
  @ViewChild('projectGrid', { static: true }) public proGrid: GridComponent;
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[];
  projectDataTab;
  taskDatePickerRangeForm: FormGroup;
  selectedDateText = moment().format('ddd, D MMM YYYY');
  public taskDateValue=moment().format('ddd, D MMM YYYY');
  public taskTodayDate: Date = new Date(new Date().toDateString());
  public maxRangeDateForTask: Date = this.taskTodayDate;
  taskStartDate;
  taskEndDate;
  employeeID;
  employeeTaskActivitiesData;
  empProductiveTime;
  empProductivity;
  empActivetyTime;
  empTimeSpend;
  employeeActivityTab = [];
  employeeTodayDayActivitiesProjectData:any = [];
  public toolbarOptions: ToolbarItems[];
  initialSort: { columns: { field: string; direction: string; }[]; };
    // @ViewChild('chart',{static:true}) private chartContainer: ElementRef;
   //@Input() public data: Array<any>=[0,5,10,15,20,25,30,35,40];
   @ViewChild('schedule', { static: true }) public schedule: ScheduleComponent;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private width: number;
  private height: number;
  public seriesType: DropDownList;
  public pointMode: DropDownList;
  public headerText=[];
  public workWeekDays: number[] = [0,1,2, 3,4 ,6];
 // private margin = { top: 20, right: 20, bottom: 30, left: 40 };
 private x: any;
  private y: any;
  private svg: any;
  private g: any;
  private dataset=[10,20,30,40,33,24,12,5];
  public date=moment().format('dddd, D MMM YYYY');
  public dateValue=moment().format('ddd, D MMM YYYY');
  public dateText=moment().format('ddd, D MMM YYYY');
  public pageSettings;
  public showTimeSpinner=true;
  // private chart: any;
  // private width: number;
  // private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;

  dateRangeForm: FormGroup;

  freeLanceCount=0;
  outSourceCount=0;
  permanentCount=0;
  totalEmp=0;
  attendedEmp=0;
  timeSheetFreeLanceCount=0;
  timeSheetOutSourceCount=0;
  timeSheetPermanentCount=0;
  showweeksContainer=false;
  absentMem=0;
  // lat;
  // lng;
  lat= 25.2748983;
  lng= 55.37456589999999;
  zoom=10;
  markers = [

  ]
   currentTime = moment();
   currentHour=moment(this.currentTime).format("hh:mm a");

  public data: Object[] = [
    { x: 'proj1', y: 80,'text':'P1' }, { x: 'proj2', y: null,'text':'P2' }, { x: 'proj3', y: 70,'text':'P3' },
    { x: 'proj4', y: 60,'text':'P4' }, { x: 'proj5', y: null,'text':'P5' },
    { x: 'proj6', y: 70,'text':'P6' }, { x: 'proj7', y: 80,'text':'P7' },  { x: 'proj8', y: 60,'text':'P4' }, { x: 'proj5', y: null,'text':'P5' },
    { x: 'proj9', y: 50,'text':'P6' }, { x: 'proj10', y: 80,'text':'P7' },
];
public labelTestData = [
  {label: "person a", times: [{"starting_time": 1355752800000, "ending_time": 1355759900000,'text':'Tooltip1'}, {"starting_time": 1355767900000, "ending_time": 1355774400000,'text':'Tooltip2'}]},
  {label: "person b", times: [{"starting_time": 1355759910000, "ending_time": 1355761900000,'text':'Tooltip3'}, ]},
  {label: "person c", times: [{"starting_time": 1355761910000, "ending_time": 1355763910000,'text':'Tooltip4'}]}
];
public startHour: string = '05:00';
public endHour: string = '22:00';
public axis = (args: IAxisLabelRenderEventArgs) => {
  if(args.axis.orientation === 'Horizontal') {
    for(var i=0; i< args.axis.series.length; i++)
    {
      for(var j=0; j<args.axis.series[i].points.length; j++){
        if(args.axis.series[i].points[j].xValue === args.value){
            args.text = args.text + ':' + (new Date(+args.axis.series[i].points[j].x).getMilliseconds()).toString();
        }
      }
    }
  }
}

public data1: Object[] =  [
  { x: new Date(2019,1, 18, 9,0), y: 21 },{ x: new Date(2019,1, 18, 9,5), y: 15 },{ x: new Date(2019,1, 18, 9,10), y: 20 }
  ,{ x: new Date(2019,1, 18, 9,15), y: 12 },{ x: new Date(2019,1, 18, 9,20), y: 35 },{ x: new Date(2019,1, 18, 9,25), y: 5 },{ x: new Date(2019,1, 18, 9,30), y: 75 },{ x: new Date(2019,1, 18, 9,35), y: 44 },
  { x: new Date(2019,1, 18, 9,40), y: 18 },{ x: new Date(2019,1, 18, 9,45), y: 45 },{ x: new Date(2019,1, 18, 9,50), y: 55 },{ x: new Date(2019,1, 18, 9,55), y: 0 },
   { x: new Date(2017, 11, 21, 10,0), y: 28 },
  { x: new Date(2019,1, 18,10,5), y: 15 },{ x: new Date(2019,1, 18,10,10), y: 20 }
  ,{ x: new Date(2019,1, 18,10,15), y: 12 },{ x: new Date(2019,1, 18,10,20), y: 35 },{ x: new Date(2019,1, 18,10,25), y: 5 },{ x: new Date(2019,1, 18,10,30), y: 75 },{ x: new Date(2019,1, 18,10,35), y: 44 },
  { x: new Date(2019,1, 18,10,40), y: 18 },{ x: new Date(2019,1, 18,10,45), y: 45 },{ x: new Date(2019,1, 18,10,50), y: 55 },{ x: new Date(2019,1, 18,10,55), y: 45 },
  { x: new Date(2017, 11, 21, 11), y: 28 },
  { x: new Date(2019,1, 18,11,5), y: 15 },{ x: new Date(2019,1, 18,11,10), y: 20 }
  ,{ x: new Date(2019,1, 18,11,15), y: 12 },{ x: new Date(2019,1, 18,11,20), y: 35 },{ x: new Date(2019,1, 18,11,25), y: 5 },{ x: new Date(2019,1, 18,11,30), y: 75 },{ x: new Date(2019,1, 18,11,35), y: 44 },
  { x: new Date(2019,1, 18,11,40), y: 18 },{ x: new Date(2019,1, 18,11,45), y: 45 },{ x: new Date(2019,1, 18,11,50), y: 55 },{ x: new Date(2019,1, 18,11,55), y: 45 },
  { x: new Date(2017, 12, 21, 12), y: 28 },
  { x: new Date(2019,1, 18,12,5), y: 15 },{ x: new Date(2019,1, 18,12,10), y: 20 }
  ,{ x: new Date(2019,1, 18,12,15), y: 12 },{ x: new Date(2019,1, 18,12,20), y: 35 },{ x: new Date(2019,1, 18,12,25), y: 5 },{ x: new Date(2019,1, 18,12,30), y: 75 },{ x: new Date(2019,1, 18,12,35), y: 44 },
  { x: new Date(2019,1, 18,12,40), y: 18 },{ x: new Date(2019,1, 18,12,45), y: 45 },{ x: new Date(2019,1, 18,12,50), y: 55 },{ x: new Date(2019,1, 18,12,55), y: 45 },

  { x: new Date(2017, 11, 26, 1), y: 75 },
  { x: new Date(2019,1, 18,1,5), y: 15 },{ x: new Date(2019,1, 18,1,10), y: 20 }
  ,{ x: new Date(2019,1, 18,1,15), y: 1 },{ x: new Date(2019,1, 18,1,20), y: 35 },{ x: new Date(2019,1, 18,1,25), y: 5 },{ x: new Date(2019,1, 18,1,30), y: 75 },{ x: new Date(2019,1, 18,1,35), y: 44 },
  { x: new Date(2019,1, 18,1,40), y: 18 },{ x: new Date(2019,1, 18,1,45), y: 45 },{ x: new Date(2019,1, 18,1,50), y: 55 },{ x: new Date(2019,1, 18,1,55), y: 45 },
  { x: new Date(2017, 11, 26, 2), y: 75 },
  { x: new Date(2019,1, 18,2,5), y: 15 },{ x: new Date(2019,1, 18,2,10), y: 20 }
  ,{ x: new Date(2019,1, 18,2,15), y: 2 },{ x: new Date(2019,1, 18,2,20), y: 35 },{ x: new Date(2019,1, 18,2,25), y: 5 },{ x: new Date(2019,1, 18,2,30), y: 75 },{ x: new Date(2019,1, 18,2,35), y: 44 },
  { x: new Date(2019,1, 18,2,40), y: 18 },{ x: new Date(2019,1, 18,2,45), y: 45 },{ x: new Date(2019,1, 18,2,50), y: 55 },{ x: new Date(2019,1, 18,2,55), y: 45 },
  { x: new Date(2017, 12, 21, 3), y: 28 },
  { x: new Date(2019,1, 18,3,5), y: 15 },{ x: new Date(2019,1, 18,3,10), y: 20 }
  ,{ x: new Date(2019,1, 18,3,15), y: 3 },{ x: new Date(2019,1, 18,3,20), y: 35 },{ x: new Date(2019,1, 18,3,25), y: 5 },{ x: new Date(2019,1, 18,3,30), y: 75 },{ x: new Date(2019,1, 18,3,35), y: 44 },
  { x: new Date(2019,1, 18,3,40), y: 18 },{ x: new Date(2019,1, 18,3,45), y: 45 },{ x: new Date(2019,1, 18,3,50), y: 55 },{ x: new Date(2019,1, 18,3,55), y: 45 },
  { x: new Date(2017, 12, 21, 4), y: 28 },
  { x: new Date(2019,1, 18,4,5), y: 15 },{ x: new Date(2019,1, 18,4,10), y: 20 }
  ,{ x: new Date(2019,1, 18,4,15), y: 4 },{ x: new Date(2019,1, 18,4,20), y: 35 },{ x: new Date(2019,1, 18,4,25), y: 5 },{ x: new Date(2019,1, 18,4,30), y: 75 },{ x: new Date(2019,1, 18,4,35), y: 44 },
  { x: new Date(2019,1, 18,4,40), y: 18 },{ x: new Date(2019,1, 18,4,45), y: 45 },{ x: new Date(2019,1, 18,4,50), y: 55 },{ x: new Date(2019,1, 18,4,55), y: 45 },
  { x: new Date(2017, 12, 21, 5), y: 28 },
  { x: new Date(2019,1, 18,5,5), y: 15 },{ x: new Date(2019,1, 18,5,10), y: 20 }
  ,{ x: new Date(2019,1, 18,5,15), y: 5 },{ x: new Date(2019,1, 18,5,20), y: 35 },{ x: new Date(2019,1, 18,5,25), y: 5 },{ x: new Date(2019,1, 18,5,30), y: 75 },{ x: new Date(2019,1, 18,5,35), y: 44 },
  { x: new Date(2019,1, 18,5,40), y: 18 },{ x: new Date(2019,1, 18,5,45), y: 45 },{ x: new Date(2019,1, 18,5,50), y: 55 },{ x: new Date(2019,1, 18,5,55), y: 45 },
  { x: new Date(2017, 12, 21, 6), y: 28 },
  { x: new Date(2019,1, 18,6,5), y: 15 },{ x: new Date(2019,1, 18,6,10), y: 20 }
  ,{ x: new Date(2019,1, 18,6,15), y: 6 },{ x: new Date(2019,1, 18,6,20), y: 35 },{ x: new Date(2019,1, 18,6,25), y: 5 },{ x: new Date(2019,1, 18,6,30), y: 75 },{ x: new Date(2019,1, 18,6,35), y: 44 },
  { x: new Date(2019,1, 18,6,40), y: 18 },{ x: new Date(2019,1, 18,6,45), y: 45 },{ x: new Date(2019,1, 18,6,50), y: 55 },{ x: new Date(2019,1, 18,6,55), y: 45 },
  // { x: new Date(2017, 11, 26, 12), y: 70 },
  // { x: new Date(2017, 11, 26, 1), y: 75 }, { x: new Date(2018, 0, 2, 2), y: 82 },
  // { x: new Date(2018, 0, 3, 3), y: 51 }, { x: new Date(2018, 0, 4, 4), y: 54 },
  // { x: new Date(2018, 0, 5, 5), y: 53 }, { x: new Date(2018, 0, 8, 6), y: 45 }
];

public schedulerdata: object [] = [{
  Id: 2,
  EventName: 'Meeting',
  StartTime: new Date(2020, 5, 2, 10, 0),
  EndTime: new Date(2020, 5, 2, 12, 30),
  ArriveTime:'9:00 AM',
  LeftTime:'7:00 PM',
  WorkedFor:'8h 15m',
  ProdTime:'1h 30m',
  DesktimeTime:'7h 15m',

  IsAllDay: false
}];
  arrivalTime;
  leftTime;
  total_hrs;
  final_hrs;
  prodTime: any;
  prodRatio: any;
  desktopCheckin: any;
  desktopCheckout: any;
  desktopHrs: any;
  desktopFinalHrs: any;
  showAppData: boolean=false;
  disableNxtBtn: boolean=false;
  activity_count=0;
  time_spend="0 h 0 m";
  chartSvg;
  public chartOptions: any = {

    chart: {
      type: 'column',

  },
  title: {
    text: null
},
subtitle: {
    text: null
},
credits: {
    enabled: false
},
legend: {
  enabled: false
},

 tooltip: {
  crosshairs: [true, true],
  backgroundColor: 'white',
  borderColor: 'black',
  opacity:0.5,
  borderRadius: 10,
  // borderWidth: 1,

  useHTML: true,
      formatter: function () {

          var ret= '<b>' + Highcharts.dateFormat('%l:%M %p', this.x)+'-'+this.point.time_range+'</b><br/><div style="width: 200px !important;margin-bottom:-10px !important;padding-bottom:-10px !important;">'  +
         "<div class='tooltipDiv'><div>"+this.point.typeOfProd+"</div><div style='font-weight:bold;margin-left:4px'>"+this.y+'%</div></div>';

              Highcharts.each(this.point.appName, function(info) {
                //
                 ret += "<br/><div class='tooltipDiv'><div>"+info.app_name+"</div><div style='font-weight:bold;margin-left:4px'>"+info.time_spend+"</div></div>";

              });
              +'</div>';
              return ret;

      }
  },
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      hour: '%l:%M %p',


  },
  min:this.arrivalTime,
  max:this.leftTime!=''?this.leftTime:this.currentHour,
  gridLineWidth: 0,
  minorGridLineWidth: 0,
  // lineWidth: 0,
  // datetime: [ Date.UTC(2020, 5, 2, 10, 0),
  //        Date.UTC(2020, 5, 2, 10, 0)]
  },
  yAxis:{
    lineWidth: 0,
    max:100,
    title: {
      text: ''
  },
  },
  plotOptions : {
    // column: {
    //    dataLabels: {
    //       enabled: true
    //    }
    // },

    series: {
       stacking: 'normal'
    }
 },
 exporting: {
  buttons: {
      contextButton: {
          enabled: false
      }
  }
},
  series: [
    {data:[{showInLegend: false }  ]},
    {data:[{showInLegend: false }]}
//     {
//       data: [{
//         x:Date.UTC(2020, 5, 2, 9, 5),
//           name: 'Point 1',
//           y: 1,
//           appName:[{'text':'app2','time':'9:00 AM'}]
//       },{
//         x:Date.UTC(2020, 5, 2, 9, 10),
//           name: 'Point 1',


//           y: 1,
//           appName:[{'text':'app2','time':'9:00 AM'}]
//       },{
//         x:Date.UTC(2020, 5, 2, 10, 10),
//           name: 'Point 1',


//           y: 1,
//           appName:[{'text':'app2','time':'9:00 AM'}]
//       }, {
//         x:Date.UTC(2020, 5, 2, 10, 20),
//           name: 'Point 2',


//           y: 5,
//           appName:[{'text':'app4','time':'10:00 AM'}]

//       }],



//   },
//   {
//     data: [{
//       x:Date.UTC(2020, 5, 2, 9, 5),
//         name: 'Point 1',
//         y: 1,
//         appName:[{'text':'app2','time':'9:00 AM'}]
//     },{
//       x:Date.UTC(2020, 5, 2, 9, 10),
//         name: 'Point 1',


//         y: 1,
//         appName:[{'text':'app2','time':'9:00 AM'}]
//     },{
//       x:Date.UTC(2020, 5, 2, 10, 10),
//         name: 'Point 1',


//         y: 1,
//         appName:[{'text':'app2','time':'9:00 AM'}]
//     }, {
//       x:Date.UTC(2020, 5, 2, 10, 20),
//         name: 'Point 2',


//         y: 5,
//         appName:[{'text':'app4','time':'10:00 AM'}]

//     }],

// }
],

  }
  public areaChartOptions: any = {

    chart: {
      type: 'area',

  },
  title: {
    text: null
},
subtitle: {
    text: null
},
credits: {
    enabled: false
},
legend: {
  enabled: false
},

 tooltip: {
  crosshairs: [true, true],
  backgroundColor: 'white',
  borderColor: 'black',
  opacity:0.5,
  borderRadius: 10,
  borderWidth: 1,

  useHTML: true,
      formatter: function () {

          var ret= '<b>' + Highcharts.dateFormat('%l:%M %p', this.x)+'-'+this.point.time_range+'</b><br/><div style="width: 200px !important;margin-bottom:-10px !important;padding-bottom:-10px !important;">'  +
         "<div class='tooltipDiv'><div>"+this.point.typeOfProd+"</div><div style='font-weight:bold;margin-left:4px'>"+this.y+'%</div></div>';

              Highcharts.each(this.point.appName, function(info) {
                //
                 ret += "<br/><div class='tooltipDiv'><div>"+info.app_name+"</div><div style='font-weight:bold;margin-left:4px'>"+info.time_spend+"</div></div>";

              });
              +'</div>';
              return ret;

      }
  },
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      hour: '%l:%M %p',


  },
  min:this.arrivalTime,
  max:this.leftTime!=''?this.leftTime:this.currentHour,
  gridLineWidth: 0,
  minorGridLineWidth: 0,
  lineWidth: 0,
  // datetime: [ Date.UTC(2020, 5, 2, 10, 0),
  //        Date.UTC(2020, 5, 2, 10, 0)]
  },
  yAxis:{
    lineWidth: 0,
    max:100,
    title: {
      text: ''
  },
  },
  plotOptions : {
    // column: {
    //    dataLabels: {
    //       enabled: true
    //    }
    // },

    series: {
       stacking: 'normal',
       marker: {
              enabled: false
           }
    }
 },
 exporting: {
  buttons: {
      contextButton: {
          enabled: false
      }
  }
},
  series: [
    {color: '#cfd2d5',data:[{showInLegend: false }]},
    {color: '#5867dd',data:[{showInLegend: false }  ]},

//     {
//       data: [{
//         x:Date.UTC(2020, 5, 2, 9, 5),
//           name: 'Point 1',
//           y: 1,
//           appName:[{'text':'app2','time':'9:00 AM'}]
//       },{
//         x:Date.UTC(2020, 5, 2, 9, 10),
//           name: 'Point 1',


//           y: 1,
//           appName:[{'text':'app2','time':'9:00 AM'}]
//       },{
//         x:Date.UTC(2020, 5, 2, 10, 10),
//           name: 'Point 1',


//           y: 1,
//           appName:[{'text':'app2','time':'9:00 AM'}]
//       }, {
//         x:Date.UTC(2020, 5, 2, 10, 20),
//           name: 'Point 2',


//           y: 5,
//           appName:[{'text':'app4','time':'10:00 AM'}]

//       }],



//   },
//   {
//     data: [{
//       x:Date.UTC(2020, 5, 2, 9, 5),
//         name: 'Point 1',
//         y: 1,
//         appName:[{'text':'app2','time':'9:00 AM'}]
//     },{
//       x:Date.UTC(2020, 5, 2, 9, 10),
//         name: 'Point 1',


//         y: 1,
//         appName:[{'text':'app2','time':'9:00 AM'}]
//     },{
//       x:Date.UTC(2020, 5, 2, 10, 10),
//         name: 'Point 1',


//         y: 1,
//         appName:[{'text':'app2','time':'9:00 AM'}]
//     }, {
//       x:Date.UTC(2020, 5, 2, 10, 20),
//         name: 'Point 2',


//         y: 5,
//         appName:[{'text':'app4','time':'10:00 AM'}]

//     }],

// }
  ]
  }

  public projchartOptions: any = {

    chart: {
      type: 'xrange',
      height: 110

    },
    title: {
      text: null
    },
    subtitle: {
      text: null
  },
  credits: {
      enabled: false
  },
  legend: {
    enabled: false
  },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        hour: '%l:%M %p',
    },
    offset: 5,
    },
    exporting: {
      buttons: {
          contextButton: {
              enabled: false
          }
      }
  },

    yAxis: {
      title: {
        text: ''
      },
      enabled: false,
      visible:false,

      // reversed: true
    },
    plotOptions: {

      series: {
        dataLabels: {
          align: 'center',
          enabled: true,
          format: "{point.name}"
        },
        pointWidth: 60,

      }
    },
    tooltip: {
    useHTML: true,
      formatter: function() {

        return '<b>'+Highcharts.dateFormat('%l:%M %p', this.x) +
          ' - '+ Highcharts.dateFormat('%l:%M %p', this.x2)+'</b></br><div>'+
          this.point.projName+ '<span>:'+this.point.taskName+'</span></div><div>'+this.point.remarks+'</div>' ;
      }
    },
    series: [{

      pointWidth: 35,

      data: [

     ],
      dataLabels: {
        enabled: true
      }
    }]



  }
  prodChartSeries: any[];
  desktopChart: Highcharts.Chart;
  weekChart1: Highcharts.Chart;
  weekChart2: Highcharts.Chart;
  weekChart3: Highcharts.Chart;
  weekChart4: Highcharts.Chart;
  weekChart5: Highcharts.Chart;
  weekChart6: Highcharts.Chart;
  projectChart: Highcharts.Chart;
  date1: string;
  date2: string;
  date3: string;
  date4: string;
  date5: string;
  date6: string;
  date7: string;
  projectChart1: Highcharts.Chart;
  projectChart2: Highcharts.Chart;
  projectChart3: Highcharts.Chart;
  projectChart4: Highcharts.Chart;
  projectChart5: Highcharts.Chart;
  projectChart6: Highcharts.Chart;
  projectChart7: Highcharts.Chart;
  desktime1: any;
  desktime2: any;
  desktime3: any;
  desktime4: any;
  desktime5: any;
  desktime6: any;
  desktime7: any;
  areachart: Highcharts.Chart;
  showMonthsContainer: boolean;
  showChartSpinner: boolean;
  showAbsentCount: boolean=false;
  avail_workdays_count: any;
  absent_days_count: any;
  late_days_count: any;
  leave_days_count: any;
  full_name='';

  matButtonToggleGroup: any;
  selectedGroupVal: any;
  productivityDiv = true;
  projectDiv = false;
  taskDiv = false;

  onRenderCell(args: RenderCellEventArgs): void {
  // if (args.elementType === 'monthCells') {
  //     let ele: Element = document.createElement('div');
  //     ele.innerHTML = '100';
  //     (args.element).appendChild(ele.firstChild);
  // }
}
public selectedDate=new Date();
public RenderDates = {
  start: new Date(2017, 5, 6),
  end: new Date(2017, 5, 9)
};
public eventSettings: EventSettingsModel = {
  dataSource: this.schedulerdata,
  fields: {
    id: 'Id',
    subject: { name: 'EventName',title:'Activity' },

    isAllDay: { name: 'IsAllDay' },
    startTime: { name: 'StartTime' },
    // location:{name:'ArriveTime'},
    endTime: { name: 'EndTime' },
  },
  // enableTooltip: true
}
public onCloseClick(): void {
  this.schedule.quickPopup.quickPopupHide();
}
public currentView = 'Day ';
//Initializing Primary X Axis
public primaryXAxis: Object = {
    title: 'Time',  valueType: 'DateTimeCategory',
    intervalType: 'Hours',  skeleton:'hm',  labelIntersectAction: 'Hide', majorGridLines: { width: 0 },minorGridLines : {
      color : 'red',
      width : 0
   }
};
public projXAxis: Object = {
  title: 'Task',  valueType: 'Category',
   labelIntersectAction: 'Hide', majorGridLines: { width: 0 },minorGridLines : {
    color : 'red',
    width : 0
 }
};


//Initializing Primary Y Axis
public primaryYAxis: Object = {
    // title: 'Productivity',
    minimum: 0, maximum: 100, interval: 20, labelFormat: '{value}%', majorGridLines : {
      color : 'blue',
      width : 0
   }, majorTickLines: { width: 0 }, lineStyle: { width: 0 },
    minorGridLines : {
       color : 'red',
       width : 0
    }
};
public chartArea: Object = {
  border: {
      width: 0
  }
};

//Initializing Marker
public marker: Object = {
    visible: true,
    height: 10, width: 10
};
  user_info: any;
  projValue: any='';
  milesData: any[];
  milesValue: any;
  taskData: { id: string; text: string; }[];
  showActDiv: boolean=false;
  taskValue: any;
  teamData: any[];
  empData: { id: string; text: string; }[];
  empValue: any;
  empOptions:Select2Options;
  options: Select2Options;
  teamValue: any;
  projectName: any;
  project_end_date: any;
  project_start_date='';
  projectProgress: any;
  public showHeaderBar: boolean = false;
  view: string[];
  minDate: Date;
  maxDate=new Date();
 // custom code start
public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
};

onPopupOpen(args: PopupOpenEventArgs): void {
   if (args.type == 'Editor' ) {
    //  $('#activity_log_modal').modal('show');
       args.cancel = true;
   }else if(!args.data['ArriveTime']){
    args.cancel = true;

   }



}

actionBegin(args: any){
  if(args.requestType=="dateNavigate"){

// this.GetTimesheetActivityByEmpIDAndDate()

  }
  console.log('actionEnds')

  // args.cancel = true;
}
checkIsWebApp(event){
  if(event.srcElement.checked==true){
    this.showAppData=true
  }else{
    this.showAppData=false

  }

}
OnActivityClose(){
  $('#activity_log_modal').modal('hide');

}
public GetAllTaskByProjectID (milesId){
  let postData={
    id:milesId
  }
  this.projectService.GetAllTaskByActivityID(postData).subscribe(

    (data:any) => {


      var results=[{ id: '', text: 'Select' }]

      if(data){

        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          // if(data[i].status_name!=item.status){
            results.push({
              "id": data[i].id,
              "text": data[i].task_name
          });
        }
                this.taskData=results;

    }


}



  )
    }

    public onValChange(val){
      this.selectedGroupVal = val;
      if(this.selectedGroupVal === 'Productivity'){
        this.productivityDiv = true;
        this.projectDiv = false;
        this.taskDiv = false;
      }else if(this.selectedGroupVal === 'Project'){
        this.productivityDiv = false;
        this.projectDiv = true;
        this.taskDiv = false;
      }else if(this.selectedGroupVal === 'Task'){
        this.productivityDiv = false;
        this.projectDiv = false;
        this.taskDiv = true;
      }
    }

    public FindByProjectID(id){
      //   this.AddNewSubmit=false;
      //   this.editable=true;
      // this.editTaskId=dept_id;
      // this.showTaskList=false;
      // this.showAddForm=true;
      this.spinner.show();
        let postData={
          id:id
        }


        this.projectService.FindByProjectID(postData).subscribe(
          (data:any)  => {

           if(data!=''){
            this.GetProjectActivityRatioByProjectID(id);
            // this.GetProjectActivityTaskRatioByProjectID();
            this.spinner.hide();

            this.projectName=data.project_name;

            this.project_start_date=data.start_date;
            this.project_end_date=data.end_date;

           }




            // this.projectForm.patchValue({

            //   project_name: data.project_name,
            //   desc:data.project_desc,
            //   startDate:moment(data.start_date).format('L'),
            //   endDate:moment(data.end_date).format('L'),
            //   // completeDate:moment(data.completed_date).format('L'),
            //   accessControl:data.is_private==true?'is_private':'is_public'
            //  // accessControl:new FormControl('')


            // })
           // this.EmpList();
            // this.DesgnList();

          //   this.taskPriority=data.priority,
          //  this.taskStatus=data.status,
          //   this.assigneeStatus=data.assigned_empid,

          //   this.projectForm.valueChanges.subscribe(
          //     value=> {
          //
          //     }
          //  );

          //  this.projectForm.get('firstName').valueChanges.subscribe(val=>{
          //    if(data.first_name!=val){
          //

          //    }
          // })
          // this.projectForm.get('firstName')
          // .valueChanges
          // .pipe(pairwise())
          // .subscribe(([prev, next]: [any, any]) => {
          //
          //
          // });
            //this.EmpList();
           // this.departmentLeadValue=data.depart_lead_empid;
            //  let dataObj = JSON.parse(data['token']);



          // this.router.navigate(["/organizations"]);

          },
          error  => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(
              //used Arrow function here
              (result)=> {

                //  this.router.navigate(['/dashboard']);
              })


          }

          )

      }
      public GetProjectActivityRatioByProjectID(projId){
        let postData={
          id:projId
        }
        this.projectService.GetProjectActivityRatioByProjectID(postData).subscribe(

          (data:any) => {
            // chart.data=data;
              for(var i=0;i<data.length;i++){
            if(data[i].project_status_name=="Completed"){
            this.projectProgress=data[i].ratio;

              }
            }


            // let dataObj = JSON.parse(data['token']);
          //





          }
        )}
FindAllProjectActivityByProjectID(projid){
  let postData={
    id:projid
  }
  this.projectService.FindAllProjectActivityByProjectID(postData).subscribe(

    (data:any) => {


      var results=[{ id: '', text: 'Select' }]

      if(data){

        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          // if(data[i].status_name!=item.status){
            results.push({
              "id": data[i].project_activity_id,
              "text": data[i].activity_name
          });
        }
                this.milesData=results;

    }


}



  )
    }
 // custom code end
public tooltip: TooltipSettingsModel  = {
    enable: true, header: 'Projects', format: '<b>${point.x} : ${point.y}</b>'
    //  template:
    // '<div id="Tooltip"><table style="width:100%;  border: 1px solid black;" class="table-borderless">' +
    // '<tr><th rowspan="2" style="background-color: #C1272D">' +

    //  '</th><td style="height: 25px; width: 50px; background-color: #C1272D; font-size: 14px; color: #E7C554; font-weight: bold; padding-left: 5px">' +

    //  '${y}</td></tr><tr ><td style="height: 25px; width: 50px; background-color: #C1272D; font-size: 18px; color: #FFFFFF; font-weight: bold; padding-left: 5px">${x}</td>' +
    //  '</tr></table></div>'
};
public title;
@ViewChildren('actchart')
public chart: ChartComponent;
@ViewChildren('milestonechart')
public milestonechart: ChartComponent;
@ViewChildren('taskchart')
public taskchart: ChartComponent;
public legendSettings: Object = {
    visible: false
}
  public today: Date = new Date(new Date().toDateString());
    public weekStart=new Date(new Date().toDateString());
     public  weekEnd=new Date().setDate(new Date().getDate() - 7);

    public monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
    public monthEnd: Date = this.today;
    public lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
    public lastEnd: Date = this.today;
    public yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
    public yearEnd: Date = this.today;
    public maxRangeDate: Date = this.today;
      weekattendedEmp: number=0;
  weekabsentMem: number=0;
  showweeksData: boolean;
  showtodaysData: boolean;
  weekoutSourceCount=0;
  fromDateValue: string;
  toDateValue: string;
  datePickerForm: FormGroup;

  isTodayActive;
  isWeekActive;
  isMonthActive;
  isRangeActive;
  projData: any=[];

 public taskCompletedList;
 public taskOpenList;
 public taskInProgressList;
 public activityOptions: Select2Options;
 projectData: any;

 public totalOverTimeCount=0;

  tasksList: { id: string; text: string; }[];
  employeeTasksList: any;
  assignedToList: any;
  tasks: { id: string; text: string; }[];
  allTimeLog: any;
  showTimeLogSpinner: boolean;
  viewProjType: any;
  viewProjName: any;
  viewProjCheckin: any;
  viewProjCheckout: any;
  data12: Object[];
  taskStatus: any;
  tasktobeUpdated: any;
  taskStatusData: { id: string; text: string; }[];
  dashboardCheckOutExceptionData=0;
  dashboardCheckInExceptionData=0;
  dashboardLessHoursData=0;
  exceptionCount=0;
  overDueList: any;
  public productiveApps=[

  ]
  ondate: any;
    constructor(public timesheetService:TimeSheetService,private userService:UserService,private deptService:DepartmentService, private toastr: ToastrService,private router: Router,private empService:EmployeeService,private teamService:TeamService,private spinner:NgxSpinnerService,private projectService:ProjectService,
      private activityService:ActivityService, private taskService:TaskService) {
      this.activityOptions={
        placeholder:"Select",
        width: "100%",

      }
      this.empOptions={
        placeholder:"Select",
        width: "100%",
        multiple:true


      }
      this.options = {

        placeholder: "Select",
        // allowClear: true,
        width: "100%",
        templateResult: this.templateResult,
        templateSelection: this.templateSelection

      }
  //   new NTPClient()
  // .getNetworkTime()
  // .then(date =>
  // .catch(err => console.error('err',err));



    //   function ShowTime() {
    //     var current_time = moment().tz('Asia/Dubai').format('h:mm A');
    //     $('#txtDefaultTime').val(current_time);
    //     $('#txtDefaultCheckoutTime').val(current_time);
    //     window.setTimeout("ShowTime()", 1000);//1000 miliseconds = 1 second
    // }


      $(".date-picker").change(function () {
      //
      //   var input = $("#selectDate").html();
      //   var parts = input.split("/");
      //   var d1 = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      //  this.date=(moment(d1).format('dddd, D MMM YYYY'));

      //   //sessiondate
      //   localStorage.setItem("SessionDate", moment(d1).format('dddd, D MMM YYYY'));

      //   var startdate = moment(d1).format('dddd, D MMM YYYY');
      //   var enddate = null;
        $('.page-header-fixed.page-sidebar-closed-hide-logo').loader({
          image: '../loader.gif'
        });


      });

      this.employeeActivityTab= [
        {
           "text":"Productivity"
        },
        {
           "text":"Project"
        },
        {
           "text":"Task"
        }
     ]


    }

    public  EmployeeAppTrackedByEmpIDAndDate(fromDate,toDate) {
      let user:object={};
      let teamEmpId='';
if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));

}
if(localStorage.getItem('ActivityEmpID')){
  teamEmpId=localStorage.getItem('ActivityEmpID')
}else{
  teamEmpId=''
}
      let postData={

        "empID":teamEmpId==''?user['id']:teamEmpId,
        "startDate": moment(fromDate).format('L'),
            "endDate": moment(toDate).format('L')
      }
      this.activityService.EmployeeAppTrackedByEmpIDAndDate(postData).subscribe(
        (data:any)  => {

          if(data.length!=0){
         this.spinner.hide();
            // this.productiveApps=data;
            let appsData=[];
            for(var i=0;i<data.length;i++){
              appsData.push({
                name:data[i].app_category_name,
                time:data[i].time_spend,
                icon:'data:image/png;base64,'+data[i].icon

              })
            }
            this.productiveApps=appsData;

          }


        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )
        }
        public  GetTimesheetActivityByEmpIDAndDate(fromDate,toDate) {
          let user:object={};
          let teamEmpId='';
          let ondate;
          let checkin;
          let checkout;

    if(localStorage.getItem('user_info')){
        user= JSON.parse(localStorage.getItem('user_info'));

    }
    if(localStorage.getItem('ActivityEmpID')){
      teamEmpId=localStorage.getItem('ActivityEmpID')
    }else{
      teamEmpId=''
    }
    let is_Week=false;
    if(moment(fromDate).format('L')!=moment(toDate).format('L')){
      is_Week=true;
    }else{
      is_Week=false;

    }
          let postData={
            "empID":teamEmpId==''?user['id']:teamEmpId,

            "startDate": moment(fromDate).format('L'),
                "endDate": moment(toDate).format('L')


          }
          this.activityService.GetEmployeeTasksTimesheetByEmpID(postData).subscribe(
            (data:any)  => {
              let schedulerData=[]
              let timelineData=[]
              let projTimeLineData=[]
              if(data.length!=0){

                  /** spinner ends after 5 seconds */
                  for(var i=0;i<data.length;i++){
                    // checkin=data[i].firstCheckInLastCheckout.checkin;
                    // checkout=data[i].firstCheckInLastCheckout.checkout;
                    for(var j=0;j<data[i]['timesheetDataModels'].length;j++){
      if(data[i]['timesheetDataModels'][j]['viewLogDataModels'].length!=0){
        for(var k=0;k<data[i]['timesheetDataModels'][j]['viewLogDataModels'].length;k++){
          let date=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['ondate']).format('MM-DD-YYYY')
          // date.format("MM-DD-YYYY")
          ondate=moment(fromDate).format('L');
         let x= moment(date).format('L');
         let teamMembers='';
         if(data[i].members.length>1){
          teamMembers=data[i].members.join(",")

         }else{
          teamMembers=''
         }
          schedulerData.push({
            Event: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['task_name'],
            EventName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['task_name']+
            (data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['main_name']!=''?('<span style="margin-left:5px;font-weight:400;font-size:10px;">('+data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['main_name']+')</span>'):'')+'<div style="font-size:12px;text-transform:uppercase;">'+data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['project_name']+'</div>'+
            '<div style="font-size:10px;font-weight:200;">'+data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['milestone_name']+'</div>'+
            '<div style="font-size:10px;font-weight:200;">'+data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['status_name']+(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['worked_percent']!=null?('<span style="margin-left:5px;font-weight:400;font-size:10px;">('+data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['worked_percent']+'%)</span>'):'')+'</div>',
            //  '<br/>' +(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['team_name']!=null?data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['team_name']:'')
            // +'<br/>' +'Arrive Time:' +(moment(data[i]['timesheetDataModels'][j]['check_in']).format('HH:mm A'))
            // +'<br/>' +(data[i]['timesheetDataModels'][j]['check_out']!=null?('Left Time:' +(moment(data[i]['timesheetDataModels'][j]['check_out']).format('HH:mm A'))):'')
            //  +'<br/>' +(teamMembers!=''?teamMembers:''),
            StartTime: new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']),
            EndTime: new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']),
            ArriveTime:(moment(data[i]['timesheetDataModels'][j]['check_in']).format('h:mm A')),
            LeftTime:(data[i]['timesheetDataModels'][j]['check_out']!=null?moment(data[i]['timesheetDataModels'][j]['check_out']).format('h:mm A'):''),
            Remarks:(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']!=null?data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']:''),
            TeamMembers:(teamMembers!=''?teamMembers:''),
           Location:data[i]['timesheetSearchLocationViewModel']!=null?data[i]['timesheetSearchLocationViewModel']['geo_address']:'',
           Project:data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['project_name'],
           Milestone:data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['milestone_name'],
           Task:data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['main_name'],
           Status:data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['status_name'],
           Percent:data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['worked_percent'],

          })
          timelineData.push(
          {"starting_time": new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']), "ending_time": new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']),'text':'Tooltip1'},

          )
          let taskStartTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']);
          let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

          projTimeLineData.push({
           x:Date.UTC(taskStartTime.getFullYear(), taskStartTime.getMonth(), taskStartTime.getDate(),
           taskStartTime.getHours(), taskStartTime.getMinutes(), taskStartTime.getSeconds()),
           x2:Date.UTC(taskEndTime.getFullYear(), taskEndTime.getMonth(), taskEndTime.getDate(),
           taskEndTime.getHours(), taskEndTime.getMinutes(), taskEndTime.getSeconds()),
            color: 'rgb(31, 119, 180)',
            projName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['project_name'],
            name: moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A') + ' <br/> ' + moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A'),
            taskName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['task_name'],
            remarks: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']!=null?data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']:'',
           y: -1,

                        })

        }
      }

                  }
                  }
                    // d3.selectAll("svg> *").remove();
                  //  var ge= d3.select("#timelineRelativeTime").selectAll("svg").datum(this.testDataRelative)
                  //  ge.exit().remove();
            let times=[{
              times:timelineData
            }

            ]



            //  let StartTime=new Date(ondate+'-'+checkin);
            //  let LeftTime=new Date(ondate+'-'+(checkout!='-'  ?checkout:this.currentHour));
            //

     this.testDataRelative=times;




      //d3.select("#timelineRelativeTime").data(this.testDataRelative)
    //  this.chartSvg.attr('d',this.testDataRelative);
    // svg=d3.select("#timelineRelativeTime").append("svg").attr("width", 1000)
    //           .datum(this.testDataRelative)
    // this.projectChart.reflow();

      this.timelineRelativeTime();
              }

              this.schedule.eventSettings.dataSource =schedulerData
               this.schedule.refresh();
            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }

            public  GetTaskTimelineByEmpIDAndDate(fromDate,toDate) {
              let user:object={};
              let teamEmpId='';

        if(localStorage.getItem('user_info')){
            user= JSON.parse(localStorage.getItem('user_info'));

        }
        if(localStorage.getItem('ActivityEmpID')){
          teamEmpId=localStorage.getItem('ActivityEmpID')
        }else{
          teamEmpId=''
        }
              let postData={
                "empID":teamEmpId==''?user['id']:teamEmpId,
                "startDate": moment(fromDate).format('L'),
                "endDate": moment(toDate).format('L'),
                "isWeek":false
              }

              this.activityService.GetEmployeeTasksTimesheetByEmpID(postData).subscribe(
                (data:any)  => {
                  let ondate;
                  let projTimeLineData=[]
                  let checkin;
                  let checkout;
   this.projectChart=Highcharts.chart('projContainer', this.projchartOptions);

                  if(data.length!=0){

                      /** spinner ends after 5 seconds */
                      for(var i=0;i<data.length;i++){

                        for(var j=0;j<data[i]['timesheetDataModels'].length;j++){
                          checkin=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkin;
                    checkout=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkout;
          if(data[i]['timesheetDataModels'][j]['viewLogDataModels'].length!=0){
            for(var k=0;k<data[i]['timesheetDataModels'][j]['viewLogDataModels'].length;k++){
              let date=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['ondate']).format('MM-DD-YYYY')
              // date.format("MM-DD-YYYY")
              ondate=moment(fromDate).format('L');

             let x= moment(date).format('L');
             let teamMembers='';
             if(data[i].members.length>1){
              teamMembers=data[i].members.join(",")

             }else{
              teamMembers=''
             }


              let taskStartTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']);
              let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);
              let start=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A');
              let end=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A');
              let diff=moment.duration(moment(end, "HH:mm:ss a").diff(moment(start, "HH:mm:ss a")))

              projTimeLineData.push({
               x:Date.UTC(taskStartTime.getFullYear(), taskStartTime.getMonth(), taskStartTime.getDate(),
               taskStartTime.getHours(), taskStartTime.getMinutes(), taskStartTime.getSeconds()),
               x2:Date.UTC(taskEndTime.getFullYear(), taskEndTime.getMonth(), taskEndTime.getDate(),
               taskEndTime.getHours(), taskEndTime.getMinutes(), taskEndTime.getSeconds()),
                color: 'rgb(31, 119, 180)',
                projName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['project_name'],
                // name: moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A') + ' <br/> ' + moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A'),
                name: `${diff.hours()} h ${diff.minutes()} m`,
                taskName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['task_name'],
                remarks: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']!=null?data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']:'',
               y: -1,

                            })

            }
          }

                      }
                      }
                        // d3.selectAll("svg> *").remove();
                      //  var ge= d3.select("#timelineRelativeTime").selectAll("svg").datum(this.testDataRelative)
                      //  ge.exit().remove();
                // let times=[{
                //   times:timelineData
                // }

                // ]



                 let StartTime=new Date(ondate+'-'+checkin);
                 let LeftTime=new Date(ondate+'-'+(checkout!='-'  ?checkout:this.currentHour));


        //  this.testDataRelative=times;



         this.projectChart.series[0].setData(projTimeLineData)
         this.projectChart.xAxis[0].update({
          min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
          StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
           max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
           LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
        });

          //d3.select("#timelineRelativeTime").data(this.testDataRelative)
        //  this.chartSvg.attr('d',this.testDataRelative);
        // svg=d3.select("#timelineRelativeTime").append("svg").attr("width", 1000)
        //           .datum(this.testDataRelative)
        // this.projectChart.reflow();
        setTimeout(() => {
          this.projectChart.reflow();
        }, 0);
                  }else{
                    let data=[]
         this.projectChart.series[0].setData(data)
         this.projectChart.reflow();

                  }

                  // this.schedule.refresh();
                },
                error  => {
                  Swal.fire(
                    'Error!',
                    error,
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                      //  this.router.navigate(['/dashboard']);
                    })


                }

                )
                }
    public  GetTaskTimeline1ByEmpIDAndDate(fromDate,toDate) {
      let user:object={};
      let teamEmpId='';

if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));

}
if(localStorage.getItem('ActivityEmpID')){
  teamEmpId=localStorage.getItem('ActivityEmpID')
}else{
  teamEmpId=''
}
      let postData={
        "empID":teamEmpId==''?user['id']:teamEmpId,

        "startDate": moment(fromDate).format('L'),
                "endDate": moment(toDate).format('L')
      }
      this.activityService.GetEmployeeTasksTimesheetByEmpID(postData).subscribe(
        (data:any)  => {
          let ondate;
          let checkin;
       let checkout;
          let projTimeLineData=[]
          if(data.length!=0){

              /** spinner ends after 5 seconds */
              for(var i=0;i<data.length;i++){

                for(var j=0;j<data[i]['timesheetDataModels'].length;j++){
                  checkin=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkin;
                  checkout=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkout;
  if(data[i]['timesheetDataModels'][j]['viewLogDataModels'].length!=0){
    for(var k=0;k<data[i]['timesheetDataModels'][j]['viewLogDataModels'].length;k++){
      let date=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['ondate']).format('MM-DD-YYYY')
      // date.format("MM-DD-YYYY")
      let start=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A');
      let end=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A');
      let diff=moment.duration(moment(end, "HH:mm:ss a").diff(moment(start, "HH:mm:ss a")))

      ondate=moment(fromDate).format('L');
     let x= moment(date).format('L');
     let teamMembers='';
     if(data[i].members.length>1){
      teamMembers=data[i].members.join(",")

     }else{
      teamMembers=''
     }


      let taskStartTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']);
      let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

      projTimeLineData.push({
       x:Date.UTC(taskStartTime.getFullYear(), taskStartTime.getMonth(), taskStartTime.getDate(),
       taskStartTime.getHours(), taskStartTime.getMinutes(), taskStartTime.getSeconds()),
       x2:Date.UTC(taskEndTime.getFullYear(), taskEndTime.getMonth(), taskEndTime.getDate(),
       taskEndTime.getHours(), taskEndTime.getMinutes(), taskEndTime.getSeconds()),
        color: 'rgb(31, 119, 180)',
        projName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['project_name'],
        // name: moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A') + ' <br/> ' + moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A'),
        name: `${diff.hours()} h ${diff.minutes()} m`,
        taskName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['task_name'],
        remarks: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']!=null?data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']:'',
       y: -1,

                    })

    }
  }

              }
              }
                // d3.selectAll("svg> *").remove();
              //  var ge= d3.select("#timelineRelativeTime").selectAll("svg").datum(this.testDataRelative)
              //  ge.exit().remove();
        // let times=[{
        //   times:timelineData
        // }

        // ]



         let StartTime=new Date(ondate+'-'+checkin);
         let LeftTime=new Date(ondate+'-'+(checkout!='-'  ?checkout:this.currentHour));


//  this.testDataRelative=times;



 this.projectChart1.series[0].setData(projTimeLineData)
 this.projectChart1.xAxis[0].update({
  min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
  StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
   max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
   LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
});

  //d3.select("#timelineRelativeTime").data(this.testDataRelative)
//  this.chartSvg.attr('d',this.testDataRelative);
// svg=d3.select("#timelineRelativeTime").append("svg").attr("width", 1000)
//           .datum(this.testDataRelative)
// this.projectChart.reflow();
setTimeout(() => {
  this.projectChart1.reflow();
}, 0);
          }

          // this.schedule.refresh();
        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )
        }

        public  GetTaskTimeline2ByEmpIDAndDate(fromDate,toDate) {
          let user:object={};
          let teamEmpId='';

    if(localStorage.getItem('user_info')){
        user= JSON.parse(localStorage.getItem('user_info'));

    }
    if(localStorage.getItem('ActivityEmpID')){
      teamEmpId=localStorage.getItem('ActivityEmpID')
    }else{
      teamEmpId=''
    }
          let postData={
            "empID":teamEmpId==''?user['id']:teamEmpId,
            "startDate": moment(fromDate).format('L'),
            "endDate": moment(toDate).format('L')
          }
          this.activityService.GetEmployeeTasksTimesheetByEmpID(postData).subscribe(
            (data:any)  => {
              let ondate;
              let checkin;

       let checkout;
              let projTimeLineData=[]
              if(data.length!=0){

                  /** spinner ends after 5 seconds */
                  for(var i=0;i<data.length;i++){

                    for(var j=0;j<data[i]['timesheetDataModels'].length;j++){
                      checkin=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkin;
                      checkout=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkout;
      if(data[i]['timesheetDataModels'][j]['viewLogDataModels'].length!=0){

        for(var k=0;k<data[i]['timesheetDataModels'][j]['viewLogDataModels'].length;k++){
          let date=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['ondate']).format('MM-DD-YYYY')
          // date.format("MM-DD-YYYY")
          let start=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A');
          let end=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A');
          let diff=moment.duration(moment(end, "HH:mm:ss a").diff(moment(start, "HH:mm:ss a")))
          ondate=moment(fromDate).format('L');
         let x= moment(date).format('L');
         let teamMembers='';
         if(data[i].members.length>1){
          teamMembers=data[i].members.join(",")

         }else{
          teamMembers=''
         }


          let taskStartTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']);
          let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

          projTimeLineData.push({
           x:Date.UTC(taskStartTime.getFullYear(), taskStartTime.getMonth(), taskStartTime.getDate(),
           taskStartTime.getHours(), taskStartTime.getMinutes(), taskStartTime.getSeconds()),
           x2:Date.UTC(taskEndTime.getFullYear(), taskEndTime.getMonth(), taskEndTime.getDate(),
           taskEndTime.getHours(), taskEndTime.getMinutes(), taskEndTime.getSeconds()),
            color: 'rgb(31, 119, 180)',
            projName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['project_name'],
            name: `${diff.hours()} h ${diff.minutes()} m`,
            // name: moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A') + ' <br/> ' + moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A'),
            taskName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['task_name'],
            remarks: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']!=null?data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']:'',
           y: -1,

                        })

        }
      }

                  }
                  }
                    // d3.selectAll("svg> *").remove();
                  //  var ge= d3.select("#timelineRelativeTime").selectAll("svg").datum(this.testDataRelative)
                  //  ge.exit().remove();
            // let times=[{
            //   times:timelineData
            // }

            // ]



             let StartTime=new Date(ondate+'-'+checkin);
             let LeftTime=new Date(ondate+'-'+(checkout!='-'  ?checkout:this.currentHour));


    //  this.testDataRelative=times;



     this.projectChart2.series[0].setData(projTimeLineData)
     this.projectChart2.xAxis[0].update({
      min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
      StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
       max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
       LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
    });

      //d3.select("#timelineRelativeTime").data(this.testDataRelative)
    //  this.chartSvg.attr('d',this.testDataRelative);
    // svg=d3.select("#timelineRelativeTime").append("svg").attr("width", 1000)
    //           .datum(this.testDataRelative)
    // this.projectChart.reflow();
    setTimeout(() => {
      this.projectChart2.reflow();
    }, 0);
              }

              // this.schedule.refresh();
            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }
            public  GetTaskTimeline3ByEmpIDAndDate(fromDate,toDate) {
              let user:object={};
              let teamEmpId='';

        if(localStorage.getItem('user_info')){
            user= JSON.parse(localStorage.getItem('user_info'));

        }
        if(localStorage.getItem('ActivityEmpID')){
          teamEmpId=localStorage.getItem('ActivityEmpID')
        }else{
          teamEmpId=''
        }
              let postData={
                "empID":teamEmpId==''?user['id']:teamEmpId,
                "startDate": moment(fromDate).format('L'),
                "endDate": moment(toDate).format('L')
              }
              this.activityService.GetEmployeeTasksTimesheetByEmpID(postData).subscribe(
                (data:any)  => {
                  let ondate;
                  let checkin;
       let checkout;
                  let projTimeLineData=[]
                  if(data.length!=0){

                      /** spinner ends after 5 seconds */
                      for(var i=0;i<data.length;i++){

                        for(var j=0;j<data[i]['timesheetDataModels'].length;j++){
                          checkin=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkin;
                          checkout=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkout;
          if(data[i]['timesheetDataModels'][j]['viewLogDataModels'].length!=0){
            for(var k=0;k<data[i]['timesheetDataModels'][j]['viewLogDataModels'].length;k++){
              let date=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['ondate']).format('MM-DD-YYYY')
              // date.format("MM-DD-YYYY")
              let start=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A');
              let end=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A');
              let diff=moment.duration(moment(end, "HH:mm:ss a").diff(moment(start, "HH:mm:ss a")))
              ondate=moment(fromDate).format('L');
             let x= moment(date).format('L');
             let teamMembers='';
             if(data[i].members.length>1){
              teamMembers=data[i].members.join(",")

             }else{
              teamMembers=''
             }


              let taskStartTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']);
              let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

              projTimeLineData.push({
               x:Date.UTC(taskStartTime.getFullYear(), taskStartTime.getMonth(), taskStartTime.getDate(),
               taskStartTime.getHours(), taskStartTime.getMinutes(), taskStartTime.getSeconds()),
               x2:Date.UTC(taskEndTime.getFullYear(), taskEndTime.getMonth(), taskEndTime.getDate(),
               taskEndTime.getHours(), taskEndTime.getMinutes(), taskEndTime.getSeconds()),
                color: 'rgb(31, 119, 180)',
                projName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['project_name'],
                name: `${diff.hours()} h ${diff.minutes()} m`,
                // name: moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A') + ' <br/> ' + moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A'),
                taskName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['task_name'],
                remarks: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']!=null?data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']:'',
               y: -1,

                            })

            }
          }

                      }
                      }
                        // d3.selectAll("svg> *").remove();
                      //  var ge= d3.select("#timelineRelativeTime").selectAll("svg").datum(this.testDataRelative)
                      //  ge.exit().remove();
                // let times=[{
                //   times:timelineData
                // }

                // ]



                 let StartTime=new Date(ondate+'-'+this.arrivalTime);
                 let LeftTime=new Date(ondate+'-'+(this.leftTime!='-'  ?this.leftTime:this.currentHour));


        //  this.testDataRelative=times;



         this.projectChart3.series[0].setData(projTimeLineData)
         this.projectChart3.xAxis[0].update({
          min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
          StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
           max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
           LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
        });

          //d3.select("#timelineRelativeTime").data(this.testDataRelative)
        //  this.chartSvg.attr('d',this.testDataRelative);
        // svg=d3.select("#timelineRelativeTime").append("svg").attr("width", 1000)
        //           .datum(this.testDataRelative)
        // this.projectChart.reflow();
        setTimeout(() => {
          this.projectChart3.reflow();
        }, 0);
                  }

                  // this.schedule.refresh();
                },
                error  => {
                  Swal.fire(
                    'Error!',
                    error,
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                      //  this.router.navigate(['/dashboard']);
                    })


                }

                )
                }
                public  GetTaskTimeline4ByEmpIDAndDate(fromDate,toDate) {
                  let user:object={};
                  let teamEmpId='';

            if(localStorage.getItem('user_info')){
                user= JSON.parse(localStorage.getItem('user_info'));

            }
            if(localStorage.getItem('ActivityEmpID')){
              teamEmpId=localStorage.getItem('ActivityEmpID')
            }else{
              teamEmpId=''
            }
                  let postData={
                    "empID":teamEmpId==''?user['id']:teamEmpId,
                    "startDate": moment(fromDate).format('L'),
                    "endDate": moment(toDate).format('L')
                  }
                  this.activityService.GetEmployeeTasksTimesheetByEmpID(postData).subscribe(
                    (data:any)  => {
                      let ondate;
                      let checkin;
       let checkout;
                      let projTimeLineData=[]
                      if(data.length!=0){

                          /** spinner ends after 5 seconds */
                          for(var i=0;i<data.length;i++){

                            for(var j=0;j<data[i]['timesheetDataModels'].length;j++){
                              checkin=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkin;
                              checkout=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkout;
              if(data[i]['timesheetDataModels'][j]['viewLogDataModels'].length!=0){
                for(var k=0;k<data[i]['timesheetDataModels'][j]['viewLogDataModels'].length;k++){
                  let date=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['ondate']).format('MM-DD-YYYY')
                  // date.format("MM-DD-YYYY")
                  let start=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A');
                  let end=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A');
                  let diff=moment.duration(moment(end, "HH:mm:ss a").diff(moment(start, "HH:mm:ss a")))
                  ondate=moment(fromDate).format('L');
                 let x= moment(date).format('L');
                 let teamMembers='';
                 if(data[i].members.length>1){
                  teamMembers=data[i].members.join(",")

                 }else{
                  teamMembers=''
                 }


                  let taskStartTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']);
                  let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

                  projTimeLineData.push({
                   x:Date.UTC(taskStartTime.getFullYear(), taskStartTime.getMonth(), taskStartTime.getDate(),
                   taskStartTime.getHours(), taskStartTime.getMinutes(), taskStartTime.getSeconds()),
                   x2:Date.UTC(taskEndTime.getFullYear(), taskEndTime.getMonth(), taskEndTime.getDate(),
                   taskEndTime.getHours(), taskEndTime.getMinutes(), taskEndTime.getSeconds()),
                    color: 'rgb(31, 119, 180)',
                    projName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['project_name'],
                    name: `${diff.hours()} h ${diff.minutes()} m`,
                    // name: moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A') + ' <br/> ' + moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A'),
                    taskName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['task_name'],
                    remarks: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']!=null?data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']:'',
                   y: -1,

                                })

                }
              }

                          }
                          }
                            // d3.selectAll("svg> *").remove();
                          //  var ge= d3.select("#timelineRelativeTime").selectAll("svg").datum(this.testDataRelative)
                          //  ge.exit().remove();
                    // let times=[{
                    //   times:timelineData
                    // }

                    // ]



                     let StartTime=new Date(ondate+'-'+checkin);
                     let LeftTime=new Date(ondate+'-'+(checkout!='-'  ?checkout:this.currentHour));


            //  this.testDataRelative=times;



             this.projectChart4.series[0].setData(projTimeLineData)
             this.projectChart4.xAxis[0].update({
              min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
              StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
               max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
               LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
            });

              //d3.select("#timelineRelativeTime").data(this.testDataRelative)
            //  this.chartSvg.attr('d',this.testDataRelative);
            // svg=d3.select("#timelineRelativeTime").append("svg").attr("width", 1000)
            //           .datum(this.testDataRelative)
            // this.projectChart.reflow();
            setTimeout(() => {
              this.projectChart4.reflow();
            }, 0);
                      }

                      // this.schedule.refresh();
                    },
                    error  => {
                      Swal.fire(
                        'Error!',
                        error,
                        'error'
                      ).then(
                        //used Arrow function here
                        (result)=> {

                          //  this.router.navigate(['/dashboard']);
                        })


                    }

                    )
                    }
                    public  GetTaskTimeline5ByEmpIDAndDate(fromDate,toDate) {
                      let user:object={};
                      let teamEmpId='';

                if(localStorage.getItem('user_info')){
                    user= JSON.parse(localStorage.getItem('user_info'));

                }
                if(localStorage.getItem('ActivityEmpID')){
                  teamEmpId=localStorage.getItem('ActivityEmpID')
                }else{
                  teamEmpId=''
                }
                      let postData={
                        "empID":teamEmpId==''?user['id']:teamEmpId,
                        "startDate": moment(fromDate).format('L'),
                        "endDate": moment(toDate).format('L')
                      }
                      this.activityService.GetEmployeeTasksTimesheetByEmpID(postData).subscribe(
                        (data:any)  => {
                          let ondate;
                          let checkin;
       let checkout;
                          let projTimeLineData=[]
                          if(data.length!=0){

                              /** spinner ends after 5 seconds */
                              for(var i=0;i<data.length;i++){

                                for(var j=0;j<data[i]['timesheetDataModels'].length;j++){
                                  checkin=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkin;
                                  checkout=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkout;
                  if(data[i]['timesheetDataModels'][j]['viewLogDataModels'].length!=0){
                    for(var k=0;k<data[i]['timesheetDataModels'][j]['viewLogDataModels'].length;k++){
                      let date=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['ondate']).format('MM-DD-YYYY')
                      // date.format("MM-DD-YYYY")
                      let start=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A');
                      let end=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A');
                      let diff=moment.duration(moment(end, "HH:mm:ss a").diff(moment(start, "HH:mm:ss a")))
                      ondate=moment(fromDate).format('L');
                     let x= moment(date).format('L');
                     let teamMembers='';
                     if(data[i].members.length>1){
                      teamMembers=data[i].members.join(",")

                     }else{
                      teamMembers=''
                     }


                      let taskStartTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']);
                      let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

                      projTimeLineData.push({
                       x:Date.UTC(taskStartTime.getFullYear(), taskStartTime.getMonth(), taskStartTime.getDate(),
                       taskStartTime.getHours(), taskStartTime.getMinutes(), taskStartTime.getSeconds()),
                       x2:Date.UTC(taskEndTime.getFullYear(), taskEndTime.getMonth(), taskEndTime.getDate(),
                       taskEndTime.getHours(), taskEndTime.getMinutes(), taskEndTime.getSeconds()),
                        color: 'rgb(31, 119, 180)',
                        projName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['project_name'],
                        name: `${diff.hours()} h ${diff.minutes()} m`,
                        // name: moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A') + ' <br/> ' + moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A'),
                        taskName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['task_name'],
                        remarks: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']!=null?data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']:'',
                       y: -1,

                                    })

                    }
                  }

                              }
                              }
                                // d3.selectAll("svg> *").remove();
                              //  var ge= d3.select("#timelineRelativeTime").selectAll("svg").datum(this.testDataRelative)
                              //  ge.exit().remove();
                        // let times=[{
                        //   times:timelineData
                        // }

                        // ]



                         let StartTime=new Date(ondate+'-'+checkin);
                         let LeftTime=new Date(ondate+'-'+(checkout!='-'  ?checkout:this.currentHour));


                //  this.testDataRelative=times;



                 this.projectChart5.series[0].setData(projTimeLineData)
                 this.projectChart5.xAxis[0].update({
                  min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
                  StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
                   max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
                   LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
                });

                  //d3.select("#timelineRelativeTime").data(this.testDataRelative)
                //  this.chartSvg.attr('d',this.testDataRelative);
                // svg=d3.select("#timelineRelativeTime").append("svg").attr("width", 1000)
                //           .datum(this.testDataRelative)
                // this.projectChart.reflow();
                setTimeout(() => {
                  this.projectChart5.reflow();
                }, 0);
                          }

                          // this.schedule.refresh();
                        },
                        error  => {
                          Swal.fire(
                            'Error!',
                            error,
                            'error'
                          ).then(
                            //used Arrow function here
                            (result)=> {

                              //  this.router.navigate(['/dashboard']);
                            })


                        }

                        )
                        }
                        public  GetTaskTimeline6ByEmpIDAndDate(fromDate,toDate) {
                          let user:object={};
                          let teamEmpId='';

                    if(localStorage.getItem('user_info')){
                        user= JSON.parse(localStorage.getItem('user_info'));

                    }
                    if(localStorage.getItem('ActivityEmpID')){
                      teamEmpId=localStorage.getItem('ActivityEmpID')
                    }else{
                      teamEmpId=''
                    }
                          let postData={
                            "empID":teamEmpId==''?user['id']:teamEmpId,
                            "startDate": moment(fromDate).format('L'),
                            "endDate": moment(toDate).format('L')
                          }
                          this.activityService.GetEmployeeTasksTimesheetByEmpID(postData).subscribe(
                            (data:any)  => {
                              let ondate;
                              let checkin;
       let checkout;
                              let projTimeLineData=[]
                              if(data.length!=0){

                                  /** spinner ends after 5 seconds */
                                  for(var i=0;i<data.length;i++){

                                    for(var j=0;j<data[i]['timesheetDataModels'].length;j++){
                                      checkin=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkin;
                                      checkout=data[i]['timesheetDataModels'][j].firstCheckInLastCheckout.checkout;
                      if(data[i]['timesheetDataModels'][j]['viewLogDataModels'].length!=0){
                        for(var k=0;k<data[i]['timesheetDataModels'][j]['viewLogDataModels'].length;k++){
                          let date=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['ondate']).format('MM-DD-YYYY')
                          // date.format("MM-DD-YYYY")
                          let start=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A');
                          let end=moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A');
                          let diff=moment.duration(moment(end, "HH:mm:ss a").diff(moment(start, "HH:mm:ss a")))
                          ondate=moment(fromDate).format('L');
                         let x= moment(date).format('L');
                         let teamMembers='';
                         if(data[i].members.length>1){
                          teamMembers=data[i].members.join(",")

                         }else{
                          teamMembers=''
                         }


                          let taskStartTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']);
                          let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

                          projTimeLineData.push({
                           x:Date.UTC(taskStartTime.getFullYear(), taskStartTime.getMonth(), taskStartTime.getDate(),
                           taskStartTime.getHours(), taskStartTime.getMinutes(), taskStartTime.getSeconds()),
                           x2:Date.UTC(taskEndTime.getFullYear(), taskEndTime.getMonth(), taskEndTime.getDate(),
                           taskEndTime.getHours(), taskEndTime.getMinutes(), taskEndTime.getSeconds()),
                            color: 'rgb(31, 119, 180)',
                            projName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['project_name'],
                            name: `${diff.hours()} h ${diff.minutes()} m`,
                            // name: moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['start_time']).format('h:mm A') + ' <br/> ' + moment(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']).format('h:mm A'),
                            taskName: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['task_name'],
                            remarks: data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']!=null?data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['remarks']:'',
                           y: -1,

                                        })

                        }
                      }

                                  }
                                  }
                                    // d3.selectAll("svg> *").remove();
                                  //  var ge= d3.select("#timelineRelativeTime").selectAll("svg").datum(this.testDataRelative)
                                  //  ge.exit().remove();
                            // let times=[{
                            //   times:timelineData
                            // }

                            // ]



                             let StartTime=new Date(ondate+'-'+checkin);
                             let LeftTime=new Date(ondate+'-'+(checkout!='-'  ?checkout:this.currentHour));


                    //  this.testDataRelative=times;



                     this.projectChart6.series[0].setData(projTimeLineData)
                     this.projectChart6.xAxis[0].update({
                      min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
                      StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
                       max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
                       LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
                    });

                      //d3.select("#timelineRelativeTime").data(this.testDataRelative)
                    //  this.chartSvg.attr('d',this.testDataRelative);
                    // svg=d3.select("#timelineRelativeTime").append("svg").attr("width", 1000)
                    //           .datum(this.testDataRelative)
                    // this.projectChart.reflow();
                    setTimeout(() => {
                      this.projectChart6.reflow();
                    }, 0);
                              }

                              // this.schedule.refresh();
                            },
                            error  => {
                              Swal.fire(
                                'Error!',
                                error,
                                'error'
                              ).then(
                                //used Arrow function here
                                (result)=> {

                                  //  this.router.navigate(['/dashboard']);
                                })


                            }

                            )
                            }

    public OnCloseStatusModal(){
      $("#task_status_modal").modal("hide");

    }
    public templateResult: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
      if (!state.id) {
        return state.text;
      }



      return jQuery('<div><b>' + state.text+ '</b> ' + '<span> '+ state.additional.teamBy + '</span></div>');
    }
    public templateSelection: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
      if (!state.id) {
        return state.text;
      }

      return jQuery('<span><b>' + state.text + '</b> ' + state.additional.teamBy + '</span>');
      //return jQuery('<div><b>' + state.text+ '</b></div> ' + '<div>'+ state.additional.teamBy + '</div>');

    }
    public tooltipRender(args: ITooltipRenderEventArgs): void {

      if (args.text.split('<br/>')[2]) {
      let target: number = parseInt(args.text.split('<br/>')[4].split('<b>')[1].split('</b>')[0], 10);
      let value: string = (target / 100000000).toFixed(1) + 'B';
      args.text = args.text.replace(args.text.split('<br/>')[4].split('<b>')[1].split('</b>')[0], value);
      }
  };

    public  EmpProductivityDashboard(fromDate,toDate) {
      let user:object={};
      let teamEmpId='';
      this.spinner.show();

if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));

}
if(localStorage.getItem('ActivityEmpID')){
  teamEmpId=localStorage.getItem('ActivityEmpID')
}else{
  teamEmpId=''
}
      let postData={
        "empID":teamEmpId==''?user['id']:teamEmpId,

        "startDate": moment(fromDate).format('L'),
            "endDate": moment(toDate).format('L')
      }

      this.activityService.EmpProductivityDashboard(postData).subscribe(
        (data:any)  => {


       if(data!=null && data.length!=0){
        this.showTimeSpinner=false
      // this.spinner.hide();

        this.arrivalTime=data.check_in!=null?data.check_in:'00:00';
        this.leftTime=data.check_out!=null?data.check_out:'00:00';
        this.ondate=data.ondate;

        if(data.total_hrs!=null){
          let totalHrsString=data.total_hrs!=null?data.total_hrs.split(':'):0;
          this.total_hrs=(totalHrsString[0]=="00"?'0 h ':(totalHrsString[0] +' h ')) +(totalHrsString[1]=="00"?'0 m':(totalHrsString[1] +' m '));

        }else{
          this.total_hrs=('0 h 0 m');

        }
        if(data.final_total_hours!=null){
          let finalHrsString=data.final_total_hours!=null?data.final_total_hours.split(':'):0;
          // this.final_hrs=(finalHrsString[0] +' h ') +(finalHrsString[1] +' m ');
          this.final_hrs=(finalHrsString[0]=="00"?'0 h ':(finalHrsString[0] +' h ')) +(finalHrsString[1]=="00"?'0 m':(finalHrsString[1] +' m '));
        }else{
          this.final_hrs=('0 h 0 m');

        }


        // this.prodTime=data[0].productive_time;
        this.prodRatio=data.productivity_ratio!=null && data.productivity_ratio.toString().length==1?data.productivity_ratio:parseFloat(data.productivity_ratio).toFixed(2);
        this.activity_count=data.activity_count!=null?data.activity_count:0;
        this.avail_workdays_count=data.avail_workdays_count!=null?data.avail_workdays_count:0;
        this.absent_days_count=data.absent_days_count!=null?data.absent_days_count:0;
        this.late_days_count=data.late_days_count!=null?data.late_days_count:0;
        this.leave_days_count=data.leave_days_count!=null?data.leave_days_count:0;
this.full_name=data.full_name;

        if(data.time_spend_activity!=null){
          let timeSpentString=data.time_spend_activity.split(':');
          // this.time_spend=(timeSpentString[0] +' h ') +(timeSpentString[1] +' m ');
        this.time_spend=(timeSpentString[0]=="00"?'0 h ':(timeSpentString[0] +' h ')) +(timeSpentString[1]=="00"?'0 m':(timeSpentString[1] +' m '));
        this.prodTime=this.time_spend;

        }else{
          this.time_spend=('0 h 0 m');
          this.prodTime=('0 h 0 m');
          this.prodRatio=0;

        }

        // setTimeout(() => {
        //   this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(fromDate,fromDate)
        // }, 500);

        // this.final_hrs=data[0].final_total_hours;



       }else{
      this.showTimeSpinner=false
      this.spinner.hide();
        this.arrivalTime="00:00";
        this.leftTime="00:00";
        this.total_hrs="0 h 0 m";
        this.final_hrs="0 h 0 m";
       }





        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )
        }
        public  EmployeeProductivityWeek1TimeFrequencyByEmpIDAndDate(fromDate,toDate) {
          let user:object={};
          let teamEmpId='';
    this.spinner.show();
    if(localStorage.getItem('user_info')){
        user= JSON.parse(localStorage.getItem('user_info'));

    }
    if(localStorage.getItem('ActivityEmpID')){
      teamEmpId=localStorage.getItem('ActivityEmpID')
    }else{
      teamEmpId=''
    }
          let postData={
            "empID":teamEmpId==''?user['id']:teamEmpId,

            "startDate": moment(fromDate).format('L'),
            "endDate": moment(toDate).format('L')
          }

          this.activityService.EmployeeProductivityTimeFrequencyByEmpIDAndDate(postData).subscribe(
            (data:any)  => {
       let prodData=[]
       let idleData=[]
       let ondate;
       let checkin;
       let checkout;
       if(data){
    this.spinner.hide();

       }
       if(data!=null && data.employeeProductivityTime.length!=0){
        for(var i=0;i<data.employeeProductivityTime.length;i++){
         ondate=data.employeeProductivityTime[i].ondate;
         checkin=data.employeeProductivityTime[0].checkin;
         checkout=data.employeeProductivityTime[0].checkout;
         this.desktime2=data.employeeProductivityTime[0].desk_time!=null?data.employeeProductivityTime[0].desk_time:'';

          let date=new Date(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].start_time)
          let time_range=moment(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].end_time).format("hh:mm A");

         prodData.push({
           x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
           date.getHours(), date.getMinutes(), date.getSeconds()),
           color: '#5867dd ',
            time_range:time_range,
            typeOfProd:'Productive',
          y: parseInt(data.employeeProductivityTime[i].productive_ratio),
           appName:data.employeeProductivityTime[i].employeeProductivityTrackedTimes              })
        }
        for(var i=0;i<data.employeeIdleTime.length;i++){
         let time_range=moment(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].end_time).format("hh:mm A");

         let date=new Date(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].start_time)
         idleData.push({
          x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
          date.getHours(), date.getMinutes(), date.getSeconds()),
           color: '#cfd2d5',
           typeOfProd:'Unproductive',

           time_range:time_range,
          y: parseInt(data.employeeIdleTime[i].productive_ratio),
          appName:data.employeeIdleTime[i].employeeProductivityTrackedTimes              })
       }

      }
     //  this.prodChartSeries=prodData;

       //  this.chartOptions.series[0].data =[prodData];
       //  this.chartOptions.series[1].data =[idleData];




    let StartTime=new Date(ondate+'-'+checkin);
    let LeftTime=new Date(ondate+'-'+(checkout!='-'?checkout:this.currentHour));

   //  let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

//  this.projectChart.xAxis[0].setExtremes(Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
//  StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),null);

this.weekChart1.xAxis[0].update({
min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
});
this.weekChart1.series[1].setData(prodData)
this.weekChart1.series[0].setData(idleData)
this.weekChart1.reflow();

            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }
            public  EmployeeProductivityWeek2TimeFrequencyByEmpIDAndDate(fromDate,toDate) {
              let user:object={};
              let teamEmpId='';
        this.spinner.show();
        if(localStorage.getItem('user_info')){
            user= JSON.parse(localStorage.getItem('user_info'));

        }
        if(localStorage.getItem('ActivityEmpID')){
          teamEmpId=localStorage.getItem('ActivityEmpID')
        }else{
          teamEmpId=''
        }
              let postData={
                "empID":teamEmpId==''?user['id']:teamEmpId,

                "startDate": moment(fromDate).format('L'),
                "endDate": moment(toDate).format('L')
              }

              this.activityService.EmployeeProductivityTimeFrequencyByEmpIDAndDate(postData).subscribe(
                (data:any)  => {
           let prodData=[]
           let idleData=[]
           let ondate;
           let checkin;
           let checkout;
           if(data){
        this.spinner.hide();

           }

               if(data!=null && data.employeeProductivityTime.length!=0){
                 for(var i=0;i<data.employeeProductivityTime.length;i++){
                  ondate=data.employeeProductivityTime[i].ondate;
                  checkin=data.employeeProductivityTime[0].checkin;
                  checkout=data.employeeProductivityTime[0].checkout;
                  this.desktime3=data.employeeProductivityTime[0].desk_time!=null?data.employeeProductivityTime[0].desk_time:'';

                   let date=new Date(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].start_time)
                   let time_range=moment(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].end_time).format("hh:mm A");

                  prodData.push({
                    x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                    date.getHours(), date.getMinutes(), date.getSeconds()),
                    color: '#5867dd ',
                     time_range:time_range,
                     typeOfProd:'Productive',
                   y: parseInt(data.employeeProductivityTime[i].productive_ratio),
                    appName:data.employeeProductivityTime[i].employeeProductivityTrackedTimes              })
                 }
                 for(var i=0;i<data.employeeIdleTime.length;i++){
                  let time_range=moment(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].end_time).format("hh:mm A");

                  let date=new Date(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].start_time)
                  idleData.push({
                   x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                   date.getHours(), date.getMinutes(), date.getSeconds()),
                    color: '#cfd2d5',
                    typeOfProd:'Unproductive',

                    time_range:time_range,
                   y: parseInt(data.employeeIdleTime[i].productive_ratio),
                   appName:data.employeeIdleTime[i].employeeProductivityTrackedTimes              })
                }

               }
              //  this.prodChartSeries=prodData;

                //  this.chartOptions.series[0].data =[prodData];
                //  this.chartOptions.series[1].data =[idleData];




             let StartTime=new Date(ondate+'-'+checkin);
             let LeftTime=new Date(ondate+'-'+(checkout!='-'?checkout:this.currentHour));

            //  let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

    //  this.projectChart.xAxis[0].setExtremes(Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
    //  StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),null);

    this.weekChart2.xAxis[0].update({
      min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
      StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
       max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
       LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
    });
    this.weekChart2.series[1].setData(prodData)
    this.weekChart2.series[0].setData(idleData)
    this.weekChart2.reflow();

                },
                error  => {
                  Swal.fire(
                    'Error!',
                    error,
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                      //  this.router.navigate(['/dashboard']);
                    })


                }

                )
                }
                public  EmployeeProductivityWeek3TimeFrequencyByEmpIDAndDate(fromDate,toDate) {
                  let user:object={};
                  let teamEmpId='';
            this.spinner.show();
            if(localStorage.getItem('user_info')){
                user= JSON.parse(localStorage.getItem('user_info'));

            }
            if(localStorage.getItem('ActivityEmpID')){
              teamEmpId=localStorage.getItem('ActivityEmpID')
            }else{
              teamEmpId=''
            }
                  let postData={
                    "empID":teamEmpId==''?user['id']:teamEmpId,

                    "startDate": moment(fromDate).format('L'),
                    "endDate": moment(toDate).format('L')
                  }

                  this.activityService.EmployeeProductivityTimeFrequencyByEmpIDAndDate(postData).subscribe(
                    (data:any)  => {
               let prodData=[]
               let idleData=[]
               let ondate;
               let checkin;
               let checkout;
               if(data){
            this.spinner.hide();

               }

                   if(data!=null && data.employeeProductivityTime.length!=0){
                     for(var i=0;i<data.employeeProductivityTime.length;i++){
                      ondate=data.employeeProductivityTime[i].ondate;
                       let date=new Date(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].start_time)
                       let time_range=moment(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].end_time).format("hh:mm A");
                       checkin=data.employeeProductivityTime[0].checkin;
                       checkout=data.employeeProductivityTime[0].checkout;
              this.desktime4=data.employeeProductivityTime[0].desk_time!=null?data.employeeProductivityTime[0].desk_time:'';

                      prodData.push({
                        x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                        date.getHours(), date.getMinutes(), date.getSeconds()),
                        color: '#5867dd ',
                         time_range:time_range,
                         typeOfProd:'Productive',
                       y: parseInt(data.employeeProductivityTime[i].productive_ratio),
                        appName:data.employeeProductivityTime[i].employeeProductivityTrackedTimes              })
                     }
                     for(var i=0;i<data.employeeIdleTime.length;i++){
                      let time_range=moment(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].end_time).format("hh:mm A");

                      let date=new Date(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].start_time)
                      idleData.push({
                       x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                       date.getHours(), date.getMinutes(), date.getSeconds()),
                        color: '#cfd2d5',
                        typeOfProd:'Unproductive',

                        time_range:time_range,
                       y: parseInt(data.employeeIdleTime[i].productive_ratio),
                       appName:data.employeeIdleTime[i].employeeProductivityTrackedTimes              })
                    }

                   }
                  //  this.prodChartSeries=prodData;

                    //  this.chartOptions.series[0].data =[prodData];
                    //  this.chartOptions.series[1].data =[idleData];




                 let StartTime=new Date(ondate+'-'+checkin);
                 let LeftTime=new Date(ondate+'-'+(checkout!='-'?checkout:this.currentHour));

                //  let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

        //  this.projectChart.xAxis[0].setExtremes(Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
        //  StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),null);

        this.weekChart3.xAxis[0].update({
          min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
          StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
           max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
           LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
        });
        this.weekChart3.series[1].setData(prodData)
        this.weekChart3.series[0].setData(idleData)
        this.weekChart3.reflow();

                    },
                    error  => {
                      Swal.fire(
                        'Error!',
                        error,
                        'error'
                      ).then(
                        //used Arrow function here
                        (result)=> {

                          //  this.router.navigate(['/dashboard']);
                        })


                    }

                    )
                    }
                    public  EmployeeProductivityWeek4TimeFrequencyByEmpIDAndDate(fromDate,toDate) {
                      let user:object={};
                      let teamEmpId='';
                this.spinner.show();
                if(localStorage.getItem('user_info')){
                    user= JSON.parse(localStorage.getItem('user_info'));

                }
                if(localStorage.getItem('ActivityEmpID')){
                  teamEmpId=localStorage.getItem('ActivityEmpID')
                }else{
                  teamEmpId=''
                }
                      let postData={
                        "empID":teamEmpId==''?user['id']:teamEmpId,

                        "startDate": moment(fromDate).format('L'),
                        "endDate": moment(toDate).format('L')
                      }

                      this.activityService.EmployeeProductivityTimeFrequencyByEmpIDAndDate(postData).subscribe(
                        (data:any)  => {
                   let prodData=[]
                   let idleData=[]
                   let ondate;
                   let checkin;
                   let checkout;
                   if(data){
                this.spinner.hide();

                   }

                       if(data!=null && data.employeeProductivityTime && data.employeeProductivityTime.length!=0){
                         for(var i=0;i<data.employeeProductivityTime.length;i++){
                          ondate=data.employeeProductivityTime[i].ondate;
                           let date=new Date(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].start_time)
                           let time_range=moment(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].end_time).format("hh:mm A");
                           checkin=data.employeeProductivityTime[0].checkin;
                           checkout=data.employeeProductivityTime[0].checkout;
              this.desktime5=data.employeeProductivityTime[0].desk_time!=null?data.employeeProductivityTime[0].desk_time:'';

                          prodData.push({
                            x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                            date.getHours(), date.getMinutes(), date.getSeconds()),
                            color: '#5867dd ',
                             time_range:time_range,
                             typeOfProd:'Productive',
                           y: parseInt(data.employeeProductivityTime[i].productive_ratio),
                            appName:data.employeeProductivityTime[i].employeeProductivityTrackedTimes              })
                         }
                         for(var i=0;i<data.employeeIdleTime.length;i++){
                          let time_range=moment(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].end_time).format("hh:mm A");

                          let date=new Date(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].start_time)
                          idleData.push({
                           x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                           date.getHours(), date.getMinutes(), date.getSeconds()),
                            color: '#cfd2d5',
                            typeOfProd:'Unproductive',

                            time_range:time_range,
                           y: parseInt(data.employeeIdleTime[i].productive_ratio),
                           appName:data.employeeIdleTime[i].employeeProductivityTrackedTimes              })
                        }

                       }
                      //  this.prodChartSeries=prodData;

                        //  this.chartOptions.series[0].data =[prodData];
                        //  this.chartOptions.series[1].data =[idleData];




                     let StartTime=new Date(ondate+'-'+checkin);
                     let LeftTime=new Date(ondate+'-'+(checkout!='-'?checkout:this.currentHour));

                    //  let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

            //  this.projectChart.xAxis[0].setExtremes(Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
            //  StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),null);

            this.weekChart4.xAxis[0].update({
              min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
              StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
               max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
               LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
            });
            this.weekChart4.series[1].setData(prodData)
            this.weekChart4.series[0].setData(idleData)
            this.weekChart4.reflow();

                        },
                        error  => {
                          Swal.fire(
                            'Error!',
                            error,
                            'error'
                          ).then(
                            //used Arrow function here
                            (result)=> {

                              //  this.router.navigate(['/dashboard']);
                            })


                        }

                        )
                        }
                        public  EmployeeProductivityWeek5TimeFrequencyByEmpIDAndDate(fromDate,toDate) {
                          let user:object={};
                          let teamEmpId='';
                    this.spinner.show();
                    if(localStorage.getItem('user_info')){
                        user= JSON.parse(localStorage.getItem('user_info'));

                    }
                    if(localStorage.getItem('ActivityEmpID')){
                      teamEmpId=localStorage.getItem('ActivityEmpID')
                    }else{
                      teamEmpId=''
                    }
                          let postData={
                            "empID":teamEmpId==''?user['id']:teamEmpId,

                            "startDate": moment(fromDate).format('L'),
                            "endDate": moment(toDate).format('L')
                          }

                          this.activityService.EmployeeProductivityTimeFrequencyByEmpIDAndDate(postData).subscribe(
                            (data:any)  => {
                       let prodData=[]
                       let idleData=[]
                       let ondate;
                       let checkin;
                       let checkout;
                       if(data){
                    this.spinner.hide();

                       }

                           if(data!=null && data.employeeProductivityTime.length!=0){
                             for(var i=0;i<data.employeeProductivityTime.length;i++){
                              ondate=data.employeeProductivityTime[i].ondate;
                               let date=new Date(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].start_time)
                               let time_range=moment(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].end_time).format("hh:mm A");
                               checkin=data.employeeProductivityTime[0].checkin;
                               checkout=data.employeeProductivityTime[0].checkout;
              this.desktime6=data.employeeProductivityTime[0].desk_time!=null?data.employeeProductivityTime[0].desk_time:'';

                              prodData.push({
                                x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                                date.getHours(), date.getMinutes(), date.getSeconds()),
                                color: '#5867dd ',
                                 time_range:time_range,
                                 typeOfProd:'Productive',
                               y: parseInt(data.employeeProductivityTime[i].productive_ratio),
                                appName:data.employeeProductivityTime[i].employeeProductivityTrackedTimes              })
                             }
                             for(var i=0;i<data.employeeIdleTime.length;i++){
                              let time_range=moment(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].end_time).format("hh:mm A");

                              let date=new Date(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].start_time)
                              idleData.push({
                               x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                               date.getHours(), date.getMinutes(), date.getSeconds()),
                                color: '#cfd2d5',
                                typeOfProd:'Unproductive',

                                time_range:time_range,
                               y: parseInt(data.employeeIdleTime[i].productive_ratio),
                               appName:data.employeeIdleTime[i].employeeProductivityTrackedTimes              })
                            }

                           }
                          //  this.prodChartSeries=prodData;

                            //  this.chartOptions.series[0].data =[prodData];
                            //  this.chartOptions.series[1].data =[idleData];




                         let StartTime=new Date(ondate+'-'+checkin);
                         let LeftTime=new Date(ondate+'-'+(checkout!='-'?checkout:this.currentHour));

                        //  let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

                //  this.projectChart.xAxis[0].setExtremes(Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
                //  StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),null);

                this.weekChart5.xAxis[0].update({
                  min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
                  StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
                   max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
                   LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
                });
                this.weekChart5.series[1].setData(prodData)
                this.weekChart5.series[0].setData(idleData)
                this.weekChart5.reflow();

                            },
                            error  => {
                              Swal.fire(
                                'Error!',
                                error,
                                'error'
                              ).then(
                                //used Arrow function here
                                (result)=> {

                                  //  this.router.navigate(['/dashboard']);
                                })


                            }

                            )
                            }
                            public  EmployeeProductivityWeek6TimeFrequencyByEmpIDAndDate(fromDate,toDate) {
                              let user:object={};
                              let teamEmpId='';
                        this.spinner.show();
                        if(localStorage.getItem('user_info')){
                            user= JSON.parse(localStorage.getItem('user_info'));

                        }
                        if(localStorage.getItem('ActivityEmpID')){
                          teamEmpId=localStorage.getItem('ActivityEmpID')
                        }else{
                          teamEmpId=''
                        }
                              let postData={
                                "empID":teamEmpId==''?user['id']:teamEmpId,

                                "startDate": moment(fromDate).format('L'),
                                "endDate": moment(toDate).format('L')
                              }

                              this.activityService.EmployeeProductivityTimeFrequencyByEmpIDAndDate(postData).subscribe(
                                (data:any)  => {
                           let prodData=[]
                           let idleData=[]
                           let ondate;
                           let checkin;
                           let checkout;
                           if(data){
                        this.spinner.hide();

                           }

                               if(data!=null && data.employeeProductivityTime.length!=0){
                                 for(var i=0;i<data.employeeProductivityTime.length;i++){
                                  ondate=data.employeeProductivityTime[i].ondate;
                                   let date=new Date(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].start_time)
                                   let time_range=moment(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].end_time).format("hh:mm A");
                                   checkin=data.employeeProductivityTime[0].checkin;
                                   checkout=data.employeeProductivityTime[0].checkout;
              this.desktime7=data.employeeProductivityTime[0].desk_time!=null?data.employeeProductivityTime[0].desk_time:'';

                                  prodData.push({
                                    x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                                    date.getHours(), date.getMinutes(), date.getSeconds()),
                                    color: '#5867dd ',
                                     time_range:time_range,
                                     typeOfProd:'Productive',
                                   y: parseInt(data.employeeProductivityTime[i].productive_ratio),
                                    appName:data.employeeProductivityTime[i].employeeProductivityTrackedTimes              })
                                 }
                                 for(var i=0;i<data.employeeIdleTime.length;i++){
                                  let time_range=moment(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].end_time).format("hh:mm A");

                                  let date=new Date(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].start_time)
                                  idleData.push({
                                   x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                                   date.getHours(), date.getMinutes(), date.getSeconds()),
                                    color: '#cfd2d5',
                                    typeOfProd:'Unproductive',

                                    time_range:time_range,
                                   y: parseInt(data.employeeIdleTime[i].productive_ratio),
                                   appName:data.employeeIdleTime[i].employeeProductivityTrackedTimes              })
                                }

                               }
                              //  this.prodChartSeries=prodData;

                                //  this.chartOptions.series[0].data =[prodData];
                                //  this.chartOptions.series[1].data =[idleData];




                             let StartTime=new Date(ondate+'-'+checkin);
                             let LeftTime=new Date(ondate+'-'+(checkout!='-'?checkout:this.currentHour));

                            //  let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

                    //  this.projectChart.xAxis[0].setExtremes(Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
                    //  StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),null);

                    this.weekChart6.xAxis[0].update({
                      min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
                      StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
                       max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
                       LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
                    });
                    this.weekChart6.series[1].setData(prodData)
                    this.weekChart6.series[0].setData(idleData)
                    this.weekChart6.reflow();

                                },
                                error  => {
                                  Swal.fire(
                                    'Error!',
                                    error,
                                    'error'
                                  ).then(
                                    //used Arrow function here
                                    (result)=> {

                                      //  this.router.navigate(['/dashboard']);
                                    })


                                }

                                )
                                }

        public  EmployeeProductivityTimeFrequencyByEmpIDAndDate(fromDate,toDate) {
          let user:object={};
          let teamEmpId='';
    this.spinner.show();
    this.showChartSpinner=true;
    this.date1=moment(fromDate).format("ddd, MMMM DD");
    if(localStorage.getItem('user_info')){
        user= JSON.parse(localStorage.getItem('user_info'));

    }
    if(localStorage.getItem('ActivityEmpID')){
      teamEmpId=localStorage.getItem('ActivityEmpID')
    }else{
      teamEmpId=''
    }
          let postData={
            "empID":teamEmpId==''?user['id']:teamEmpId,

            "startDate": moment(fromDate).format('L'),
            "endDate": moment(toDate).format('L')
          }

          this.activityService.EmployeeProductivityTimeFrequencyByEmpIDAndDate(postData).subscribe(
            (data:any)  => {
       let prodData=[]
       let idleData=[]
       let ondate;
       let check_in;
       let check_out;
       if(data){
    this.spinner.hide();

       }
   this.desktopChart=Highcharts.chart('container', this.chartOptions);

           if(data!=null && data.employeeProductivityTime.length!=0){

             for(var i=0;i<data.employeeProductivityTime.length;i++){
              ondate=data.employeeProductivityTime[i].ondate;
              check_in=data.employeeProductivityTime[0].checkin;
              check_out=data.employeeProductivityTime[0].checkout;
    this.showChartSpinner=false;


              // this.prodTime=(prodHrsString[0]=="00"?'0 h ':(prodHrsString[0] +' h ')) +(prodHrsString[1]=="00"?'0 m':(prodHrsString[1] +' m '));
              this.desktime1=data.employeeProductivityTime[0].desk_time!=null?data.employeeProductivityTime[0].desk_time:'';

               let date=new Date(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].start_time)
               let time_range=moment(data.employeeProductivityTime[i].ondate+' '+data.employeeProductivityTime[i].end_time).format("hh:mm A");

              prodData.push({
                x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                date.getHours(), date.getMinutes(), date.getSeconds()),
                color: '#5867dd ',
                 time_range:time_range,
                 typeOfProd:'Productive',
               y: parseInt(data.employeeProductivityTime[i].productive_ratio),
                appName:data.employeeProductivityTime[i].employeeProductivityTrackedTimes              })
             }
             for(var i=0;i<data.employeeIdleTime.length;i++){
              let time_range=moment(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].end_time).format("hh:mm A");

              let date=new Date(data.employeeIdleTime[i].ondate+' '+data.employeeIdleTime[i].start_time)
              idleData.push({
               x:Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
               date.getHours(), date.getMinutes(), date.getSeconds()),
                color: '#cfd2d5',
                typeOfProd:'Unproductive',

                time_range:time_range,
               y: parseInt(data.employeeIdleTime[i].productive_ratio),
               appName:data.employeeIdleTime[i].employeeProductivityTrackedTimes              })
            }




             let StartTime=new Date(ondate+'-'+check_in);
             let LeftTime=new Date(ondate+'-'+(check_out!='-'?check_out:this.currentHour));

            this.desktopChart.xAxis[0].update({
              min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
              StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
               max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
               LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
            });
            // this.areachart.xAxis[0].update({
            //   min: Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
            //   StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),
            //    max: Date.UTC(LeftTime.getFullYear(), LeftTime.getMonth(), LeftTime.getDate(),
            //    LeftTime.getHours(), LeftTime.getMinutes(), LeftTime.getSeconds()),
            // });
            // this.areachart.series[1].setData(prodData)
            // this.areachart.series[0].setData(idleData)
            // this.areachart.reflow();

                     this.desktopChart.series[1].setData(prodData)
                     this.desktopChart.series[0].setData(idleData)
                              this.desktopChart.reflow();
           }else{
            // this.areachart.series[1].setData([])
            // this.areachart.series[0].setData([])
            // this.areachart.reflow();
            this.desktopChart.series[1].setData([])
            this.desktopChart.series[0].setData([])
                     this.desktopChart.reflow();
    this.showChartSpinner=false;

           }
          //  this.prodChartSeries=prodData;

            //  this.chartOptions.series[0].data =[prodData];
            //  this.chartOptions.series[1].data =[idleData];

        //  let taskEndTime=new Date(data[i]['timesheetDataModels'][j]['viewLogDataModels'][k]['end_time']);

//  this.projectChart.xAxis[0].setExtremes(Date.UTC(StartTime.getFullYear(), StartTime.getMonth(), StartTime.getDate(),
//  StartTime.getHours(), StartTime.getMinutes(), StartTime.getSeconds()),null);



            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }



        public  DesktopEmpProductivity(fromDate,toDate) {
          this.spinner.show();

          let postData={
            "startDate": moment(fromDate).format('L'),
            "endDate": moment(toDate).format('L')
          }
          this.activityService.DesktopEmpProductivity(postData).subscribe(
            (data:any)  => {


           if(data!=null && data.length!=0){
            // this.showTimeSpinner=false
            // let prodHrsString=data[0].productive_time.split(':');
            // this.prodTime=(prodHrsString[0]=="00"?'0 h ':(prodHrsString[0] +' h ')) +(prodHrsString[1]=="00"?'0 m':(prodHrsString[1] +' m '));
            // this.prodTime=data[0].productive_time;
           // this.prodRatio=data[0].productive_ratio;
            // this.desktopCheckin=data[0].check_in;
            // this.desktopCheckout=data[0].check_out;
            // let totalHrsString=data[0].total_hrs.split(':');
            // this.desktopHrs=(totalHrsString[0] +' h ') +(totalHrsString[1] +' m ');
            // let finalHrsString=data[0].final_total_hours.split(':');
            // this.desktopFinalHrs=(finalHrsString[0] +' h ') +(finalHrsString[1] +' m ');
            // this.desktopHrs=data[0].total_hrs;
            // this.desktopFinalHrs=data[0].final_total_hours;
            this.spinner.hide();
            // this.total_hrs=data[0].total_hrs;
            // this.final_hrs=data[0].final_total_hours;



           }else{
          this.showTimeSpinner=false
          // this.prodTime="0 h 0 m";
          // this.spinner.hide();

          // this.prodRatio=0;
          // this.desktopCheckin="00:00";
          // this.desktopCheckout="00:00";
          // this.desktopHrs="0 h 0 m";
          // this.desktopFinalHrs="0 h 0 m";
           }





            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }
        public  DesktopEmpProductivityDashboard(fromDate,toDate) {
          let postData={
            "fromDate": moment(fromDate).format('L'),
            "toDate": moment(toDate).format('L')
          }
          this.activityService.DesktopEmpProductivity(postData).subscribe(
            (data:any)  => {


           if(data.length!=0){
            this.showTimeSpinner=false
            this.arrivalTime=data[0].check_in;
            this.leftTime=data[0].check_out;
            this.total_hrs=data[0].total_hrs;
            this.final_hrs=data[0].final_hrs;



           }else{
          this.showTimeSpinner=false
            this.arrivalTime=0;
            this.leftTime=0;
            this.total_hrs=0;
            this.final_hrs=0;
           }





            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }
    public  FetchGridDataByDepartmentOrgID() {
      this.deptService.fetchGridDataByDepartmentOrgID().subscribe(
        (data:any)  => {
    this.user_info={};
    var results=[]

       if(data){

        if(localStorage.getItem('user_info')){
          this.user_info= JSON.parse(localStorage.getItem('user_info'));
          if(this.user_info['is_superadmin']==true){

            this.headerText= [{ text: 'Projects' }, { text: 'Team' }, { text: 'Employees' }
          ];
          data.forEach(element => {
            this.headerText.push({'text':element.dep_name})
          });
          }
          if(this.user_info['is_admin']==true && this.user_info['is_superadmin']==false){

            this.headerText= [{ text: 'Projects' }, { text: 'Team' }

          ];
          data.forEach(element => {
            if(element.department_id==this.user_info['deptid']){
              this.headerText.push({'text':element.dep_name,'id':element.department_id})

            }
          });
          }
          if(this.user_info['is_admin']==false && this.user_info['is_superadmin']==false){
            this.headerText= [];
          }

        }



       }





        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )
        }

  mapClicked($event: MouseEvent) {
    // this.markers.push({
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng,
    //   draggable: true
    // });
  }
    public  TotalEmployeeAbsentDashboardDataByOrgID(fromDate,toDate) {

      let postData={
        "fromDate": moment(fromDate).format('L'),
        "toDate": moment(toDate).format('L')
      }
    let totalEmp=0;
      this.timesheetService.TotalEmployeeAbsentDashboardDataByOrgID(postData).subscribe(
        (data:any)  => {





       this.absentMem=data;

// this.GetTimesheetDashboardDataByOrgID(this.weekEnd,this.weekEnd)
//this.GetTimesheetDashboardDataByOrgID(this.today,this.today)



        },
        error  => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )
        }

        public getUsersInfo(){
          //  $.getScript('assets/js/audioTimer.js')
          let userId={
           ID:localStorage.getItem('user_id')
          }
           this.userService.getByUserID(userId).subscribe(
             data  => {



             if(data['timesheet']){

              this.allTimeLog=data['timesheet'];



             }


             },
             error  => {
              this.spinner.hide();

               Swal.fire(
                 'Error!',
                 'Org List Error.',
                 'error'
               ).then(
                 //used Arrow function here
                 (result)=> {

                   //  this.router.navigate(['/dashboard']);
                 })


             }

             )
           ;


        }
    public  TotalEmployeeDashboardDataByOrgID(fromDate,toDate) {
 this.spinner.show();
      let postData={
        "fromDate": moment(fromDate).format('L'),
        "toDate": moment(toDate).format('L')
      }
    let totalEmp=0;
      this.timesheetService.TotalEmployeeDashboardDataByOrgID(postData).subscribe(
        (data:any)  => {


if(data){
  data.forEach(element => {
    totalEmp+=element.attandance;
    if(element.employee_type_name=='FREELANCE'){
      this.freeLanceCount=element.attandance;

    }else if(element.employee_type_name=='OUTSOURCED'){
      this.outSourceCount=element.attandance;
    this.weekoutSourceCount=element.attandance;



    }else if(element.employee_type_name=='PERMANENT'){
      this.permanentCount=element.attandance;

    }
  });
}


       this.totalEmp=totalEmp;
// this.GetTimesheetDashboardDataByOrgID(this.weekEnd,this.weekEnd)
//this.GetTimesheetDashboardDataByOrgID(this.today,this.today)



        },
        error  => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {

              //  this.router.navigate(['/dashboard']);
            })


        }

        )
        }

    public  GetTimesheetDashboardDataByOrgID(fromDate,toDate) {
      this.timeSheetFreeLanceCount=0;
      this.timeSheetOutSourceCount=0;
      this.timeSheetPermanentCount=0;
      let totalEmp=0;
      let totalOutsource=0;

      this.spinner.show();
      let postData={
        "fromDate": moment(fromDate).format('L'),
        "toDate": moment(toDate).format('L')
      }
      this.timesheetService.GetTimesheetDashboardDataByOrgID(postData).subscribe(
        (data:any)  => {
      //this.spinner.hide();


if(data && data.length!=0){

  data.forEach(element => {
  totalEmp+=element.attandance;

    if(element.employee_type_name=='FREELANCE'){
      this.timeSheetFreeLanceCount=element.attandance;

    }else if(element.employee_type_name=='OUTSOURCED'){
      totalOutsource+=element.attandance;
      this.timeSheetOutSourceCount=element.attandance;


    }else if(element.employee_type_name=='PERMANENT'){
      this.timeSheetPermanentCount=element.attandance;
    }

  });
  this.attendedEmp=totalEmp;
  this.timeSheetOutSourceCount=totalOutsource;



}else{

 this.attendedEmp=0;

}
this.weekattendedEmp=totalEmp;



        },
        error  => {
          this.spinner.hide();

          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {


              //  this.router.navigate(['/dashboard']);
            })


        }

        )
        }
        public OnClose(){

          $('#map_modal').modal('hide');
        }
        onMouseOver(infoWindow, $event: MouseEvent) {
          infoWindow.open();
      }

  onMouseOut(infoWindow, $event: MouseEvent) {
          infoWindow.close();
      }
        public  GetAllTimesheetByOrgID(fromDate,toDate) {
         this.showTimeLogSpinner=true;
         this.markers=[]
         let projTime=[]
          let postData={
            "fromDate": moment(fromDate).format('L'),
            "toDate": moment(toDate).format('L')
          }
          this.timesheetService.GetAllTimesheetByOrgID(postData).subscribe(
            (data:any)  => {
          this.spinner.hide();


    if(data ){
      this.showTimeLogSpinner=false;
 projTime=data;
      this.allTimeLog=data;
      data.forEach(element => {
        if(element.timesheetSearchLocationViewModel!=null){

          let data={
            lat:element.timesheetSearchLocationViewModel.lat,
            lng:element.timesheetSearchLocationViewModel.lang,
            label:'D',
            draggable:false,
            jobName:element.timesheetProjectCategoryDataModel.project_or_comp_name,
            checkin:element.timesheetDataModels[0].check_in
          }
          this.markers.push(data)
        }else{
          let data={
            lat:element.timesheetCurrentLocationViewModels.lat,
            lng:element.timesheetCurrentLocationViewModels.lang,
            label:'E',
            draggable:false
          }
          this.markers.push(data)
        }
      });

      const map = projTime.map((x, index) => {

        if(x.timesheetProjectCategoryDataModel.project_type=='Job'){
          let postData={
            GroupID: x.timesheetProjectCategoryDataModel.groupid,
            ProjectID: x.timesheetProjectCategoryDataModel.project_or_comp_id,
            Date: x.timesheetDataModels[0].ondate

          }

          this.timesheetService.GetTimesheetActivityByGroupAndProjectID(postData).subscribe(
            (data12:any)  => {
              if(data12.length!=0){
                x['proj']=data12
                // projTime.splice(i, 0, data12)
                //  data[i].push('proj',data12)
              }else{
                x['proj']=[]

              }




            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                (result)=> {

                })


            }

            )
        }
        return x ;
      });
      // for(var i=0;i<projTime.length;i++){
      //   if(projTime[i].timesheetProjectCategoryDataModel.project_type=='Job'){
      //     let postData={
      //       GroupID: projTime[i].timesheetProjectCategoryDataModel.groupid,
      //       ProjectID: projTime[i].timesheetProjectCategoryDataModel.project_or_comp_id,
      //       Date: projTime[i].timesheetDataModels[0].ondate

      //     }

      //     this.timesheetService.GetTimesheetActivityByGroupAndProjectID(postData).subscribe(
      //       (data12:any)  => {
      //         if(data12.length!=0){
      //           projTime[i]['proj']=data12
      //           // projTime.splice(i, 0, data12)
      //           //  data[i].push('proj',data12)
      //         }else{
      //           projTime[i]['proj']=[]

      //         }




      //       },
      //       error  => {
      //         Swal.fire(
      //           'Error!',
      //           error,
      //           'error'
      //         ).then(
      //           (result)=> {
      //
      //           })
      //

      //       }

      //       )
      //   }
      // }




    }


            },
            error  => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {


                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }
            public markerDragEnd(m,e){

            }
            public  TotalEmpOverTimeCountByOrgIDAndDate(fromDate,toDate) {
             //this.spinner.show();
               let postData={
                 "fromDate": moment(toDate).format('L'),
                 "toDate": moment(fromDate).format('L')
               }
               this.timesheetService.TotalEmpOverTimeCountByOrgIDAndDate(postData).subscribe(
                 (data:any)  => {
               //this.spinner.hide();


         if(data ){
           this.totalOverTimeCount=data.length;


         }


                 },
                 error  => {
                  this.spinner.hide();

                   Swal.fire(
                     'Error!',
                     error,
                     'error'
                   ).then(
                     //used Arrow function here
                     (result)=> {


                       //  this.router.navigate(['/dashboard']);
                     })


                 }

                 )
                 }

                 public  TotalLocationCheckInExceptionByOrgIDAndDate(fromDate,toDate) {
                  //this.spinner.show();
                  let dashboardCheckInExceptionData=0;
                  let dashboardCheckOutExceptionData=0;
                  let dashboardLessHoursData=0;

                    let postData={
                      "fromDate": moment(toDate).format('L'),
                      "toDate": moment(fromDate).format('L')
                    }
                    this.timesheetService.TotalLocationCheckInExceptionByOrgIDAndDate(postData).subscribe(
                      (data:any)  => {


              if(data ){

              //  let dataObj = JSON.parse(data['token']);

            dashboardCheckInExceptionData=data.length;
          //   this.initialSort = {
          //     columns: [{ field: 'dep_name', direction: 'Ascending' },
          //     { field: 'alias', direction: 'Descending' }]
          // };

              }


                      },
                      error  => {
                        this.spinner.hide();
                        Swal.fire(
                          'Error!',
                          error,
                          'error'
                        ).then(
                          //used Arrow function here
                          (result)=> {


                            //  this.router.navigate(['/dashboard']);
                          })


                      }

                      )

                      this.timesheetService.TotalLocationCheckOutExceptionByOrgIDAndDate(postData).subscribe(
                        (data:any)  => {


                if(data ){

                  // this.spinner.hide();
                //  let dataObj = JSON.parse(data['token']);
              dashboardCheckOutExceptionData=data.length;
            //   this.initialSort = {
            //     columns: [{ field: 'dep_name', direction: 'Ascending' },
            //     { field: 'alias', direction: 'Descending' }]
            // };

                }


                        },
                        error  => {
                        this.spinner.hide();

                          Swal.fire(
                            'Error!',
                            error,
                            'error'
                          ).then(
                            //used Arrow function here
                            (result)=> {


                              //  this.router.navigate(['/dashboard']);
                            })


                        }

                        )

                        this.timesheetService.TotalEmpLessHoursByOrgIDAndDate(postData).subscribe(
                          (data:any)  => {


                  if(data ){

                    this.spinner.hide();
                  //  let dataObj = JSON.parse(data['token']);

               dashboardLessHoursData=data.length
               this.exceptionCount=dashboardCheckInExceptionData+dashboardCheckOutExceptionData+dashboardLessHoursData


              //   this.initialSort = {
              //     columns: [{ field: 'dep_name', direction: 'Ascending' },
              //     { field: 'alias', direction: 'Descending' }]
              // };

                  }


                          },
                          error  => {
                        this.spinner.hide();

                            Swal.fire(
                              'Error!',
                              error,
                              'error'
                            ).then(
                              //used Arrow function here
                              (result)=> {


                                //  this.router.navigate(['/dashboard']);
                              })


                          }

                          )


                      }


        public nextday(){
          let dateValue;
          let dateformat;
          this.showweeksContainer=false;
this.showMonthsContainer=false;

          if(this.dateText.includes('-')){
            dateValue=this.dateText.split('-')
            dateformat=moment(dateValue[0]).format('L')

          }else{
            dateformat=moment(this.dateText).format('L')

          }

         let fromDate=moment(dateformat).add(1, 'day').toDate();

         this.currentView="Day";
         this.view=['Day'];
         this.dateText=moment(fromDate).format('ddd, D MMM YYYY');
         this.EmpProductivityDashboard(fromDate,fromDate);
        // this.DesktopEmpProductivity(fromDate,fromDate);
this.GetTimesheetActivityByEmpIDAndDate(fromDate,fromDate);
this.EmployeeAppTrackedByEmpIDAndDate(fromDate,fromDate);
 this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(fromDate,fromDate);

         this.selectedDate=fromDate;
         if(moment(this.selectedDate).format('L')==moment(this.today).format('L')){
          this.disableNxtBtn=true
        }else{
          this.disableNxtBtn=false
        }
        //  this.TotalEmployeeDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
        //  this.TotalEmployeeAbsentDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))

        //   this.GetTimesheetDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
        //   this.GetAllTimesheetByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))

        //  localStorage.setItem('fromDate',JSON.stringify(fromDate));
        //  localStorage.setItem('toDate',JSON.stringify(fromDate));

        this.taskDatePickerRangeForm.patchValue({
          taskDaterange: [
            moment(this.dateText).format('L'),
            moment(this.dateText).format('L'),
          ]
        })
        let sendDate = moment(this.dateText).format('MM/DD/YYYY')
        let postData = {
          "empID": '',
          "startDate": sendDate,
          "endDate": sendDate
        }
        console.log(postData)
        this.getEmployeeTask(postData);
        this.employeeTodayDayProj(postData);

        }
        public prevday(){
          let dateValue;
          let dateformat;
          this.showweeksContainer=false;
this.showMonthsContainer=false;

          if(this.dateText.includes('-')){
            dateValue=this.dateText.split('-')
            dateformat=moment(dateValue[0]).format('L')

          }else{
            dateformat=moment(this.dateText).format('L')

          }

          let fromDate=moment(dateformat).subtract(1, 'day').toDate();
           this.selectedDate=fromDate;
           this.currentView="Day";
           this.view=['Day'];
          this.dateText=moment(fromDate).format('ddd, D MMM YYYY');
          if(moment(this.selectedDate).format('L')==moment(this.today).format('L')){
            this.disableNxtBtn=true
          }else{
            this.disableNxtBtn=false
          }
          this.EmpProductivityDashboard(fromDate,fromDate);
          //this.DesktopEmpProductivity(fromDate,fromDate);
this.GetTimesheetActivityByEmpIDAndDate(fromDate,fromDate);
this.EmployeeAppTrackedByEmpIDAndDate(fromDate,fromDate);
 this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(fromDate,fromDate);
 this.GetTaskTimelineByEmpIDAndDate(fromDate,fromDate);


        //   this.TotalEmployeeDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
        //   this.TotalEmployeeAbsentDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
        //   this.GetAllTimesheetByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))

        //    this.GetTimesheetDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
        //   localStorage.setItem('fromDate',JSON.stringify(fromDate));
        //  localStorage.setItem('toDate',JSON.stringify(fromDate));


        this.taskDatePickerRangeForm.patchValue({
              taskDaterange: [
                    moment(this.dateText).format('L'),
                    moment(this.dateText).format('L'),
              ]
            })
        let sendDate = moment(this.dateText).format('MM/DD/YYYY')
        let postData = {
                "empID": '',
                "startDate": sendDate,
                "endDate": sendDate
        }
        console.log(postData)
        this.getEmployeeTask(postData);
        this.employeeTodayDayProj(postData);


         }
         onActionComplete(args): void {

          if ( args.requestType === "dateNavigate") {
            var currentViewDates = this.schedule.getCurrentViewDates();
            var startDate = currentViewDates[0];
            var endDate = currentViewDates[currentViewDates.length - 1];
            // let start=moment(startDate).add(1 , 'month')
            // let end=moment(endDate).add(1 , 'month')

            if(startDate==endDate){
              this.dateText=moment(startDate).format('ddd, D MMM YYYY')
             this.EmpProductivityDashboard(startDate,endDate);
//this.DesktopEmpProductivity(this.dateText,this.dateText);
this.EmployeeAppTrackedByEmpIDAndDate(startDate,endDate);
this.showweeksContainer=false;
this.GetTaskTimelineByEmpIDAndDate(startDate,startDate);
this.GetTimesheetActivityByEmpIDAndDate(startDate,endDate);


this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(startDate,startDate);


            }else{
              this.dateText=moment(startDate).format('ddd, D MMM YYYY') + '-' + moment(endDate).format('ddd, D MMM YYYY')
              this.EmpProductivityDashboard(startDate,endDate);
              //this.DesktopEmpProductivity(startDate,startDate);
              //this.GetTimesheetActivityByEmpIDAndDate(startDate,endDate);
this.EmployeeAppTrackedByEmpIDAndDate(startDate,endDate);
this.showweeksContainer=false;
if(this.currentView=='Week'){
this.showweeksContainer=true;
this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(currentViewDates[0],currentViewDates[0]);
this.GetTaskTimelineByEmpIDAndDate(currentViewDates[0],currentViewDates[0]);

this.date1=moment(currentViewDates[0]).format("ddd, MMMM DD");
this.EmployeeProductivityWeek1TimeFrequencyByEmpIDAndDate(currentViewDates[1],currentViewDates[1])
this.date2=moment(currentViewDates[1]).format("ddd, MMMM DD");
this.GetTaskTimeline1ByEmpIDAndDate(currentViewDates[1],currentViewDates[1]);


this.EmployeeProductivityWeek2TimeFrequencyByEmpIDAndDate(currentViewDates[2],currentViewDates[2])
this.date3=moment(currentViewDates[2]).format("ddd, MMMM DD");
this.GetTaskTimeline2ByEmpIDAndDate(currentViewDates[2],currentViewDates[2]);

this.EmployeeProductivityWeek3TimeFrequencyByEmpIDAndDate(currentViewDates[3],currentViewDates[3])
this.date4=moment(currentViewDates[3]).format("ddd, MMMM DD");
this.GetTaskTimeline3ByEmpIDAndDate(currentViewDates[3],currentViewDates[3]);

this.EmployeeProductivityWeek4TimeFrequencyByEmpIDAndDate(currentViewDates[4],currentViewDates[4])
this.date5=moment(currentViewDates[4]).format("ddd, MMMM DD");
this.GetTaskTimeline4ByEmpIDAndDate(currentViewDates[4],currentViewDates[4]);

this.EmployeeProductivityWeek5TimeFrequencyByEmpIDAndDate(currentViewDates[5],currentViewDates[5])
this.date6=moment(currentViewDates[5]).format("ddd, MMMM DD");
this.GetTaskTimeline5ByEmpIDAndDate(currentViewDates[5],currentViewDates[5]);

this.EmployeeProductivityWeek6TimeFrequencyByEmpIDAndDate(currentViewDates[6],currentViewDates[6])
this.date7=moment(currentViewDates[6]).format("ddd, MMMM DD");
this.GetTaskTimeline6ByEmpIDAndDate(currentViewDates[6],currentViewDates[6]);

}else{
this.showweeksContainer=false;

}
this.GetTimesheetActivityByEmpIDAndDate(startDate,endDate);


// this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(startDate,startDate);

// this.GetTaskTimelineByEmpIDAndDate(startDate,startDate);

            }

          }
        }
       public getTodaysData(){
        // this.spinner.show();
        this.currentView="Day";
this.view=['Day'];
this.showweeksContainer=false;
this.showMonthsContainer=false;
this.showAbsentCount=false;


//          this.TotalEmployeeDashboardDataByOrgID(this.today,this.today)
// this.TotalEmployeeAbsentDashboardDataByOrgID(this.today,this.today)
// this.dateText=moment(this.today).format('ddd, D MMM YYYY');
//          this.GetTimesheetDashboardDataByOrgID(this.today,this.today)
//     this.GetAllTimesheetByOrgID(this.today,this.today);
//     this.TotalEmpOverTimeCountByOrgIDAndDate(this.today,this.today);
//     this.TotalLocationCheckInExceptionByOrgIDAndDate(this.today,this.today);

this.dateText=moment(this.today).format('ddd, D MMM YYYY')
       this.showtodaysData=true
       this.showweeksData=false;
       this.isTodayActive=true;
       this.isWeekActive=false;
       this.isMonthActive=false;
    this.isRangeActive=false;
    this.selectedDate=this.today;
    this.EmpProductivityDashboard(this.today,this.today);
//this.DesktopEmpProductivity(this.today,this.today);
this.GetTimesheetActivityByEmpIDAndDate(this.today,this.today);
this.EmployeeAppTrackedByEmpIDAndDate(this.today,this.today);

this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(this.today,this.today);

this.GetTaskTimelineByEmpIDAndDate(this.today,this.today);

// localStorage.setItem('fromDate',JSON.stringify(this.today));
// localStorage.setItem('toDate',JSON.stringify(this.today));

  let sendDate = moment(this.today).format('MM/DD/YYYY')
  let postData = {
    "empID": '',
    "startDate": sendDate,
    "endDate": sendDate
  }
  console.log(postData)
  this.getEmployeeTask(postData);
  this.employeeTodayDayProj(postData);

        }
        onDataBound() {
          const scheduleElement: any = document.getElementsByClassName('e-schedule')[0];
          const scheduleObj: ScheduleComponent = ((scheduleElement as EJ2Instance).ej2_instances[0] as ScheduleComponent);

          if (scheduleObj.currentView == "Month"   ) {
            let eventCollection: Object[] = scheduleObj.getCurrentViewEvents();

            if (eventCollection.length > 0) {
              let oldIndexDate: Date = new Date((<Date>(<{ [key: string]: Object }>eventCollection[0]).StartTime).getTime());
              oldIndexDate.setHours(0, 0, 0, 0);
              let costValue: number = 0;
              let leftTime: number = 0;
              let prodTime: number = 0;
              let deskTime: number = 0;

              let workedHrs: number = 0;
              for (let i: number = 0; i < eventCollection.length; i++) {
                let eventData: any = <{ [key: string]: Object }>eventCollection[i];
                let indexDate: Date = new Date((<Date>(eventData).StartTime).getTime());
                indexDate.setHours(0, 0, 0, 0);
                if (oldIndexDate.getTime() == indexDate.getTime()) {
                  costValue += isNullOrUndefined(eventData.ArriveTime) ? 0 : eventData.ArriveTime;
                  leftTime += isNullOrUndefined(eventData.LeftTime) ? 0 : eventData.LeftTime;
                  prodTime += isNullOrUndefined(eventData.ProdTime) ? 0 : eventData.ProdTime;
                  deskTime += isNullOrUndefined(eventData.DesktimeTime) ? 0 : eventData.DesktimeTime;
                  workedHrs += isNullOrUndefined(eventData.WorkedFor) ? 0 : eventData.WorkedFor;

                } else {
                  // this.onElementRender(scheduleObj, oldIndexDate, costValue,leftTime,prodTime,deskTime,workedHrs);
                  costValue = 0;
                  leftTime = 0;
                  prodTime = 0;
                  deskTime = 0;
                  costValue += isNullOrUndefined(eventData.ArriveTime) ? 0 : eventData.ArriveTime;
                  leftTime += isNullOrUndefined(eventData.LeftTime) ? 0 : eventData.LeftTime;
                  prodTime += isNullOrUndefined(eventData.ProdTime) ? 0 : eventData.ProdTime;
                  deskTime += isNullOrUndefined(eventData.DesktimeTime) ? 0 : eventData.DesktimeTime;
                  workedHrs += isNullOrUndefined(eventData.WorkedFor) ? 0 : eventData.WorkedFor;

                  oldIndexDate = indexDate;
                }
                if (i == eventCollection.length - 1) {
                  // this.onElementRender(scheduleObj, oldIndexDate, costValue,leftTime,prodTime,deskTime,workedHrs);
                }
              }
            }
          }
        }
        onElementRender(scheduleObj: ScheduleComponent, oldIndexDate: Date, costValue: number,leftTime:number,prodTime:number,deskTime:number,workTime:number) {
          let index: number = scheduleObj.getIndexOfDate(scheduleObj.activeView.renderDates, oldIndexDate);
          let target: HTMLElement = scheduleObj.element.querySelectorAll('.e-work-cells')[index] as HTMLElement;
          if (target.querySelectorAll('total-cost-wrapper').length == 0) {
            let costWrapper: HTMLElement = document.createElement('div');
            let costElement: HTMLElement = document.createElement('div');
            let leftElement: HTMLElement = document.createElement('div');
            let prodElement: HTMLElement = document.createElement('div');
            let deskElement: HTMLElement = document.createElement('div');
            let workedHrElement: HTMLElement = document.createElement('div');
            costWrapper.setAttribute('class', 'total-cost-wrapper');
            costElement.setAttribute('class', 'total-cost');
            leftElement.setAttribute('class', 'leftTime');
            prodElement.setAttribute('class', 'prodTime');
            deskElement.setAttribute('class', 'deskTime');
            workedHrElement.setAttribute('class', 'workedTime');
            costElement.innerHTML = "Arrived at: " + costValue.toString();
            leftElement.innerHTML = "Left at: " + leftTime.toString();
            prodElement.innerHTML = "Productive time: " + prodTime.toString();
            deskElement.innerHTML = "Desktime time: " + deskTime.toString();
            workedHrElement.innerHTML = "Worked for: " + workTime.toString();
            costWrapper.appendChild(costElement);
            costWrapper.appendChild(leftElement);
            costWrapper.appendChild(prodElement);
            costWrapper.appendChild(deskElement);
            costWrapper.appendChild(workedHrElement);
            target.appendChild(costWrapper);
          } else {
            let costElement: HTMLElement = target.querySelector('total-cost-wrapper');
            costElement.innerHTML = "Arrived At: " + costValue.toString();
            // leftElement.innerHTML = "Arrived At: " + costValue.toString();
          }
        }
        public onEventRendered(args: EventRenderedArgs): void {
          //
        }
        public getWeeksData(){
          // this.spinner.show();
this.view=['Week'];
// this.currentView="Week";
this.showMonthsContainer=false;

// this.minDate=new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
// this.maxDate=this.weekStart;
let curr = new Date()
let week = []
this.showtodaysData=true;
this.showweeksContainer=true;
setTimeout(() => {
  this.weekChart1=Highcharts.chart('weekcontainer1', this.chartOptions);
  this.weekChart2=Highcharts.chart('weekcontainer2', this.chartOptions);
  this.weekChart3=Highcharts.chart('weekcontainer3', this.chartOptions);
  this.weekChart4=Highcharts.chart('weekcontainer4', this.chartOptions);
  this.weekChart5=Highcharts.chart('weekcontainer5', this.chartOptions);
  this.weekChart6=Highcharts.chart('weekcontainer6', this.chartOptions);
  this.projectChart1=Highcharts.chart('proj1Container', this.projchartOptions);
  this.projectChart2=Highcharts.chart('proj2Container', this.projchartOptions);
  this.projectChart3=Highcharts.chart('proj3Container', this.projchartOptions);
  this.projectChart4=Highcharts.chart('proj4Container', this.projchartOptions);
  this.projectChart5=Highcharts.chart('proj5Container', this.projchartOptions);
  this.projectChart6=Highcharts.chart('proj6Container', this.projchartOptions);

}, 50);
for (let i = 1; i <= 7; i++) {
  let first = curr.getDate() - curr.getDay() + i
  let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
  week.push(day)
}
let stat=moment(week[0]).subtract(1 , 'day')
let end=moment(week[6]).subtract(1 , 'day')

this.EmpProductivityDashboard(stat,end);
//this.DesktopEmpProductivity(stat,stat);
this.GetTaskTimelineByEmpIDAndDate(stat,stat);

this.EmployeeAppTrackedByEmpIDAndDate(stat,end);
setTimeout(() => {
  this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(stat,stat);

  this.date1=moment(stat).format("ddd, MMMM DD");
  this.EmployeeProductivityWeek1TimeFrequencyByEmpIDAndDate(week[0],week[0])
  this.date2=moment(week[0]).format("ddd, MMMM DD");
  this.GetTaskTimeline1ByEmpIDAndDate(week[0],week[0]);


  this.EmployeeProductivityWeek2TimeFrequencyByEmpIDAndDate(week[1],week[1])
  this.date3=moment(week[1]).format("ddd, MMMM DD");
  this.GetTaskTimeline2ByEmpIDAndDate(week[1],week[1]);


  this.EmployeeProductivityWeek3TimeFrequencyByEmpIDAndDate(week[2],week[2])
  this.date4=moment(week[2]).format("ddd, MMMM DD");
  this.GetTaskTimeline3ByEmpIDAndDate(week[2],week[2]);

  this.EmployeeProductivityWeek4TimeFrequencyByEmpIDAndDate(week[3],week[3])
  this.date5=moment(week[3]).format("ddd, MMMM DD");
  this.GetTaskTimeline4ByEmpIDAndDate(week[3],week[3]);

  this.EmployeeProductivityWeek5TimeFrequencyByEmpIDAndDate(week[4],week[4])
  this.date6=moment(week[4]).format("ddd, MMMM DD");
  this.GetTaskTimeline5ByEmpIDAndDate(week[4],week[4]);

  this.EmployeeProductivityWeek6TimeFrequencyByEmpIDAndDate(week[5],week[5])
  this.date7=moment(week[5]).format("ddd, MMMM DD");
  this.GetTaskTimeline6ByEmpIDAndDate(week[5],week[5]);

}, 80);
this.GetTimesheetActivityByEmpIDAndDate(stat,end);

let startDate = moment(stat).format('MM/DD/YYYY')
let endDate = moment(stat).subtract(7 , 'day').format('MM/DD/YYYY')
this.taskDatePickerRangeForm.patchValue({
  taskDaterange: [
    moment(startDate).format('L'),
    moment(endDate).format('L'),
  ]
})
let postData = {
  "empID": '',
  "startDate": endDate,
  "endDate": startDate
}
console.log(postData)
this.getEmployeeTask(postData);
this.employeeTodayDayProj(postData);

           this.currentView  ='Week';
           this.showAbsentCount=true;
          //  this.schedule.eventSettings.dataSource =[{
          //   Id: 2,
          //   EventName: 'Meeting',
          //   StartTime: new Date(2020, 5, 2, 10, 0),
          //   EndTime: new Date(2020, 5, 2, 12, 30),
          //   ArriveTime:'9:00 AM',
          //   LeftTime:'7:00 PM',
          //   WorkedFor:'8h 15m',
          //   ProdTime:'1h 30m',
          //   DesktimeTime:'7h 15m',

          //   IsAllDay: false
          // },{
          //   Id: 3,
          //   EventName: 'TASK',
          //   StartTime: new Date(2020, 6, 2, 10, 0),
          //   EndTime: new Date(2020, 6, 2, 12, 30),
          //   ArriveTime:'9:00 AM',
          //   LeftTime:'7:00 PM',
          //   WorkedFor:'8h 15m',
          //   ProdTime:'1h 30m',
          //   DesktimeTime:'7h 15m',

          //   IsAllDay: false
          // }]
            this.selectedDate=new Date();
          // this.schedule.refresh();
//          this.TotalEmployeeDashboardDataByOrgID(this.weekEnd,this.weekStart)
//          this.TotalEmployeeAbsentDashboardDataByOrgID(this.weekEnd,this.weekStart)

//           this.GetTimesheetDashboardDataByOrgID(this.weekEnd,this.weekStart)
//           this.GetAllTimesheetByOrgID(this.weekEnd,this.weekStart);
//           this.TotalEmpOverTimeCountByOrgIDAndDate(this.weekEnd,this.weekStart);
// this.TotalLocationCheckInExceptionByOrgIDAndDate(this.weekEnd,this.weekStart);

// localStorage.setItem('fromDate',JSON.stringify(this.weekEnd));
// localStorage.setItem('toDate',JSON.stringify(this.weekStart));
this.dateText=moment(stat).format('ddd, D MMM YYYY')+' - '+moment(end).format('ddd, D MMM YYYY');
this.isTodayActive=false;
this.isWeekActive=true;
this.isMonthActive=false;
this.isRangeActive=false;

      //     this.showweeksData=true;
      //  this.showtodaysData=false;
// this.dateValue=this.weekEnd;
          // this.weekabsentMem=0


         }
         public getMonthsData(){
          // this.spinner.show();
          // this.GetTimesheetDashboardDataByOrgID(this.monthStart,this.monthEnd)
          // this.GetAllTimesheetByOrgID(this.monthStart,this.monthEnd);
          // this.TotalEmployeeDashboardDataByOrgID(this.monthStart,this.monthEnd)
          // this.TotalEmployeeAbsentDashboardDataByOrgID(this.monthStart,this.monthEnd)
          // this.TotalEmpOverTimeCountByOrgIDAndDate(this.monthStart,this.monthEnd);
          // this.TotalLocationCheckInExceptionByOrgIDAndDate(this.monthStart,this.monthEnd);

this.showweeksContainer=false;
this.showMonthsContainer=true;
setTimeout(() => {
  // this.areachart=Highcharts.chart('areaContainer1', this.areaChartOptions);


}, 50);


          this.EmpProductivityDashboard(this.monthStart,this.monthEnd);
          //this.DesktopEmpProductivity(this.monthStart,this.monthStart);
this.GetTimesheetActivityByEmpIDAndDate(this.monthStart,this.monthEnd);
this.EmployeeAppTrackedByEmpIDAndDate(this.monthStart,this.monthEnd);
// this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(this.monthStart,this.monthEnd);


this.currentView="Month";
this.showAbsentCount=true;

this.view=['Month'];
this.schedule.refresh();
// this.schedule.eventSettings.sche.refresh();
this.selectedDate=this.monthStart;
          this.showweeksData=true;
          this.showtodaysData=false;
          this.isTodayActive=false;
          this.isWeekActive=false;
          this.isMonthActive=true;
    this.isRangeActive=false;
    this.schedule.eventSettings.dataSource =[{
      Id: 2,
      EventName: 'Meeting',
      StartTime: new Date(2020, 5, 2, 10, 0),
      EndTime: new Date(2020, 5, 2, 12, 30),
      ArriveTime:'9:00 AM',
      LeftTime:'7:00 PM',
      WorkedFor:'8h 15m',
      ProdTime:'1h 30m',
      DesktimeTime:'7h 15m',

      IsAllDay: false
    },{
      Id: 3,
      EventName: 'TASK',
      StartTime: new Date(2020, 6, 2, 10, 0),
      EndTime: new Date(2020, 6, 2, 12, 30),
      ArriveTime:'9:00 AM',
      LeftTime:'7:00 PM',
      WorkedFor:'8h 15m',
      ProdTime:'1h 30m',
      DesktimeTime:'7h 15m',

      IsAllDay: false
    }]
    // this.schedulerdata= [{
    //   Id: 2,
    //   EventName: 'Meeting',
    //   StartTime: new Date(2020, 5, 2, 10, 0),
    //   EndTime: new Date(2020, 5, 2, 12, 30),
    //   ArriveTime:'9:00 AM',
    //   LeftTime:'7:00 PM',
    //   WorkedFor:'8h 15m',
    //   ProdTime:'1h 30m',
    //   DesktimeTime:'7h 15m',

    //   IsAllDay: false
    // },{
    //   Id: 3,
    //   EventName: 'TASK',
    //   StartTime: new Date(2020, 6, 2, 10, 0),
    //   EndTime: new Date(2020, 6, 2, 12, 30),
    //   ArriveTime:'9:00 AM',
    //   LeftTime:'7:00 PM',
    //   WorkedFor:'8h 15m',
    //   ProdTime:'1h 30m',
    //   DesktimeTime:'7h 15m',

    //   IsAllDay: false
    // }];
    this.schedule.refresh();
          // this.weekabsentMem=0;

// localStorage.setItem('fromDate',JSON.stringify(this.monthStart));
// localStorage.setItem('toDate',JSON.stringify(this.monthEnd));
 this.dateText=moment(this.monthStart).format('ddd, D MMM YYYY')+' - '+moment(this.monthEnd).format('ddd, D MMM YYYY');

this.showtodaysData=true;

let startDate = moment().format('MM/DD/YYYY')
let endDate = moment(startDate).subtract(31 , 'day').format('MM/DD/YYYY')
this.taskDatePickerRangeForm.patchValue({
  taskDaterange: [
    moment(startDate).format('L'),
    moment(endDate).format('L'),
  ]
})
let postData = {
  "empID": '',
  "startDate":  endDate,
  "endDate": startDate
}
console.log(postData)
this.getEmployeeTask(postData);
this.employeeTodayDayProj(postData);


         }
         public openStatusModal(item){

          this.taskStatus=item.status_id;

          $('#task_status_modal').modal('show');
          this.tasktobeUpdated=item;
          this.getAllStatus();

        }
        public changedStatus(e: any): void {
          this.taskStatus= e.value;

        }
        public changedEmp(e: any): void {
          this.empValue= e.value;


        }
        public changedMiles(e: any): void {
          // this.milesValue= e.value;
          this.GetAllTaskByProjectID(e.value)

        }
        public changedTask(e: any): void {
           this.taskValue= e.value;
          // this.GetAllTaskByProjectID(e.value)

        }

        public  GetEmpByOrgID(){
            this.empService.fetchGridDataEmployeeByOrgID().subscribe(
            (data:any) => {
              var results=[{ id: '', text: 'Select' }]
              // let dataObj = JSON.parse(data['token']);
            //
            if(data){

        for (var i = 0; i < data.length; i++) {
        // logik to create new items
        // if(data[i].status_name!=item.status){
          results.push({
            "id": data[i].id,
            "text": data[i].full_name
        });

      }
      results.push({
        "id": 'All',
        "text": 'All'
    });
              this.empData=results;

            }



            // this.router.navigate(["/organizations"]);

            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }
            public FindTeamsByOrgID(){
              this.teamService.FindTeamsByOrgID().subscribe(

                (data:any) => {


            var results=[]
                  // let dataObj = JSON.parse(data['token']);
                //
                if(data){
                  for (var i = 0; i < data.length; i++) {
                    // logik to create new items

                    results.push({

                        id: data[i].id,
                        text: data[i].team_name,
                        additional:{
                          teamBy: data[i].team_by
                      }



                    });

                    }

                }



            this.teamData =results;

                },
                error  => {
                  Swal.fire(
                    'Error!',
                    error,
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                      //  this.router.navigate(['/dashboard']);
                    })


                }

                )

            }
        public  GetProjectsByOrgID(){
          this.projectService.FetchAllProjectByOrgID().subscribe(

            (data:any) => {
              var results=[{ id: '', text: 'Select' }]
              // let dataObj = JSON.parse(data['token']);
            //
            if(data){

        for (var i = 0; i < data.length; i++) {
        // logik to create new items
        // if(data[i].status_name!=item.status){
          results.push({
            "id": data[i].project_id,
            "text": data[i].project_name
        });
      }
              this.projectData=results;

            }



            // this.router.navigate(["/organizations"]);

            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }

            public changedProj(e: any): void {
              // this.projValue= e.value;
              this.showActDiv=true;
              this.FindAllProjectActivityByProjectID(e.value)
              this.FindByProjectID(e.value)

            }
        public onTaskStatusSubmit(){

          this.spinner.show();
          let postData={
            id: this.tasktobeUpdated.id,

            status_id: this.taskStatus,


          }

          this.taskService.UpdateTaskStatus(postData).subscribe(

            (data:any) => {

          if(data){
          this.spinner.hide();

            // this.toastr.success(data.desc);
            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
          });
            this.GetAllTaskByEmpID();
            $('#task_status_modal').modal('hide');


          }


            },
            error  => {
          this.spinner.hide();

              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )

          }
        public  getAllStatus(){
          this.taskService.GetStatusByOrgID().subscribe(

            (data:any) => {

          var results=[{ id: '', text: 'Select an option' }]
              // let dataObj = JSON.parse(data['token']);
            //

        for (var i = 0; i < data.length; i++) {
        // logik to create new items
        // if(data[i].status_name!=item.status){
          results.push({
            "id": data[i].id,
            "text": data[i].status_name
        });
    //     }else{

    // //
    //     }


        }


        this.taskStatusData =results;
            // this.router.navigate(["/organizations"]);

            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }
            public AllActivities(){
              this.router.navigate(['/activities']);

     }
     public goBack(){
      window.history.go(-1);
    }
         public  GetProjByOrgID(){
          this.projectService.AllProjectRatioByOrgID().subscribe(

            (data:any) => {
              // if(data['result'].status!=201){
 if(data.length!=0 ){
  this.projData=data;

}
// }


            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {

                  //  this.router.navigate(['/dashboard']);
                })


            }

            )
            }
         public toProjList(){
               this.router.navigate(['/projects']);
            }
            public toProjectLayout(id){
              localStorage.setItem('project_id',id);
              this.router.navigate(['/project-layout']);

            }

            public getTimesheetByEmpId(){
              this.showTimeLogSpinner=true;
             let  user_info= JSON.parse(localStorage.getItem('user_info'));

                let empId={
                 ID:user_info['id']
                }
                 this.userService.GetAllTimesheetByEmpID(empId).subscribe(
                   (data:any)  => {
                     // let dataObj = JSON.parse(data['token']);
                   // this.orgListArr=data


                   if(data.length==0){
                    localStorage.setItem('is_checkout',JSON.stringify(true))

                   }
                   if(data){
                    //  this.teamEmpId=[]
                     this.showTimeLogSpinner=false;


                    this.allTimeLog=data;






                   }

                //this.OrgList(data['employee'].id);

                   },
                   error  => {
                     Swal.fire(
                       'Error!',
                       error,
                       'error'
                     ).then(
                       //used Arrow function here
                       (result)=> {

                         //  this.router.navigate(['/dashboard']);
                       })


                   }

                   )
                 ;


              }

            public GetAllTaskByEmpID(){
              this.taskService.GetAllTaskByOrgAndEmpID().subscribe(
                (data:any)  => {
                  let completedTasks=[]
                  let openTasks=[]
                  let inProgrssTasks=[]

                  var results=[{ id: '', text: 'Select' }]
                    // let dataObj = JSON.parse(data['token']);
                  //
                  if(data){
                    for (var i = 0; i < data.employeeTasks.length; i++) {
                      // logik to create new items
                      results.push({

                        "id": data.employeeTasks[i].id,
                        "text": data.employeeTasks[i].task_name
                    });
                      if(data.employeeTasks[i].status=="Completed"){
                        completedTasks.push(data.employeeTasks[i]);
                      }
                      else if(data.employeeTasks[i].status=="Open"){
                        openTasks.push(data.employeeTasks[i]);
                      }else{
                        inProgrssTasks.push(data.employeeTasks[i]);
                       }

                  }

                  this.taskCompletedList=completedTasks;
                  this.taskOpenList=openTasks;
                  this.taskInProgressList=inProgrssTasks;
                 this.tasksList=results;
                 this.employeeTasksList=data['employeeTasks'];
                 this.assignedToList=data['assignedEmployeeTasks'];
                 this.overDueList=data['overDueTasks'];
                }




                 var results=[{ id: '', text: 'Select' }]
               if(data){
                for (var i = 0; i < data.length; i++) {
                  // logik to create new items

                  results.push({
                     "id": data[i].id,
                     "text": data[i].task_name
                  });

                  }
               }

            this.tasks=results;

                }
                )
            }
            public taskDelete(deptId){
              let postData={
                ID:deptId
              }
              this.taskService.delTask(postData).subscribe(
                (data:any)  => {

                  if(data.status==200){
                    this.GetAllTaskByEmpID();

                              this.toastr.error(data['desc'], undefined,{
                                positionClass: 'toast-top-center'
                           });

                            }


                },
                error  => {
                  Swal.fire(
                    'Error!',
                    error,
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                    })

                }

                )
              }

              public openViewModal(element){

                //this.FetchGridDataByDepartmentOrgID();
                if(element.timesheetProjectCategoryDataModel!=null){
                  this.viewProjType=element.timesheetProjectCategoryDataModel.project_type;
                  this.viewProjName=element.timesheetProjectCategoryDataModel.project_or_comp_name;


                  this.GetTimesheetActivityByGroupAndProjectID(element);

                }
                if(element.timesheetDataModels!=null){
                  this.viewProjCheckin=element.timesheetDataModels[0].check_in;
                  this.viewProjCheckout=element.timesheetDataModels[0].check_out;



                }

                $('#activity_view_modal').modal('show');

              }
              public closeViewModal(){
                $('#activity_view_modal').modal('hide');

              }
              public  GetProjTimesheetActivityByGroupAndProjectID(element){

                let data12 = [];

                let postData={
                  GroupID: element.timesheetProjectCategoryDataModel.groupid,
                  ProjectID: element.timesheetProjectCategoryDataModel.project_or_comp_id,
                  Date: element.timesheetDataModels[0].ondate

                }

                this.timesheetService.GetTimesheetActivityByGroupAndProjectID(postData).subscribe(
                  (data:any)  => {



                   data12=data


                  },
                  error  => {
                    Swal.fire(
                      'Error!',
                      error,
                      'error'
                    ).then(
                      (result)=> {

                      })


                  }

                  )


                  }
              public  GetTimesheetActivityByGroupAndProjectID(element) {

                let postData={
                  GroupID: element.timesheetProjectCategoryDataModel.groupid,
                  ProjectID: element.timesheetProjectCategoryDataModel.project_or_comp_id,
                  Date: element.timesheetDataModels[0].ondate

                }
                this.timesheetService.GetTimesheetActivityByGroupAndProjectID(postData).subscribe(
                  (data:any)  => {


                   let datas = new DataManager(data);
                   this.data12=datas.dataSource['json']
                 // this.groupOptions = { showGroupedColumn: false,showDropArea: false,  columns: ['timesheet'] };
                // this.pageSettings = {pageSizes: true, pageCount: 5 }
                // this.toolbar = ['Search'];
              //  this.searchOptions = { fields: ['dep_name'], operator: 'contains', key: 'Ha', ignoreCase: true };
                  //  this.dataSource =  new MatTableDataSource(data);
                  //  this.compData = data;
                  //  this.gridComp.dataSource = data;
                  //  this.gridComp.allowPaging = false;
                  //  this.gridComp.pageSettings = { pageSize: this.compData.length };
                  //  this.gridComp.columns = this.displayedColumns;
                   // this.dataSource.paginator = this.paginator;
                  //  this.dataSource.sort = this.sort;

                  // this.router.navigate(["/organizations"]);

                  },
                  error  => {
                    Swal.fire(
                      'Error!',
                      error,
                      'error'
                    ).then(
                      //used Arrow function here
                      (result)=> {

                        //  this.router.navigate(['/dashboard']);
                      })


                  }

                  )
                  }
                  public MapModal(){
                    $('#map_modal').modal("show");
                  }

                  public tabSelected(args: SelectEventArgs): void {

                   if(args.selectedItem.innerText!="PROJECTS"){
                     this.showActDiv=false;
                     this.projValue='';
                   }
                   if(args.selectedItem.innerText!="EMPLOYEES"){
                    // this.showActDiv=false;
                    this.empValue='';
                  }

                }


                public changedTeam(e: any): void {
                  this.teamValue= e.value;

                }
         public testDataRelative = [
                  {times: [{"starting_time": new Date(2019,1, 18, 9,0,0), "ending_time": new Date(2019,1, 18, 10,30,0),'text':'Tooltip1'}, {"starting_time": new Date(2019,1, 18, 11,0,0), "ending_time": new Date(2019,1, 18, 12,30),'text':'Tooltip4'}]},
                  {times: [{"starting_time":new Date(2019,1, 18, 12,0), "ending_time": new Date(2019,1, 18, 13,0),'text':'Tooltip2'}]},
                  {times: [{"starting_time":new Date(2019,1, 18, 17,0), "ending_time": new Date(2019,1, 18, 17,30),'text':'Tooltip3'}]}
                ];
      public timelineRelativeTime() {
        var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
        //This solution is for relative time is from
        //http://stackoverflow.com/questions/11286872/how-do-i-make-a-custom-axis-formatter-for-hours-minutes-in-d3-js
        var chart = d3Timelines.timelines()

          .tickFormat({
            format: function(d) { return d3TimeFormat.timeFormat("%l:%M %p")(d) },
            tickTime: d3Timelines.timeMinutes,
            tickInterval: 30,
            tickSize: 15,
          })
          .mouseover(function (d, i, datum) {
            // d is the current rendering object
            // i is the index during d3 rendering
            // datum is the id object
            div
            .style("opacity", .9);
        div.html(d.text + "<br/>"  )
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

            }) .mouseout(function (d, i, datum) {
              // d is the current rendering object
              // i is the index during d3 rendering
              // datum is the id object
              div
              .style("opacity", 0);
              });



  // svg= d3.select("#timelineRelativeTime").append("svg").attr("width", 1000)
  // .data([this.testDataRelative]).call(chart);




      }

      // public  timelineHover() {
      //   var div = d3.select("body").append("div")
      //   .attr("class", "tooltip")
      //   .style("opacity", 0);
      //   var chart = d3Timelines.timelines()
      //     .width(500)
      //     .stack()
      //     .margin({left:70, right:30, top:0, bottom:0})
      //     .hover(function (d, i, datum) {
      //     // d is the current rendering object
      //     // i is the index during d3 rendering
      //     // datum is the id object
      //       var div = $('#hoverRes');
      //       var colors = chart.colors();
      //       div.find('.coloredDiv').css('background-color', colors(i))
      //       div.find('#name').text(datum.label);
      //     })
      //      .mouseover(function (d, i, datum) {
      //       // d is the current rendering object
      //       // i is the index during d3 rendering
      //       // datum is the id object
      //       div
      //       .style("opacity", .9);
      //   div.html(d.text + "<br/>"  )
      //       .style("left", (d3.event.pageX) + "px")
      //       .style("top", (d3.event.pageY - 28) + "px");

      //       }) .mouseout(function (d, i, datum) {
      //         // d is the current rendering object
      //         // i is the index during d3 rendering
      //         // datum is the id object
      //         div
      //         .style("opacity", 0);
      //         })
      //     .click(function (d, i, datum) {
      //       alert(datum.label);
      //     })
      //     .scroll(function (x, scale) {
      //       $("#scrolled_date").text(scale.invert(x) + " to " + scale.invert(x+500));
      //     });

      //   var svg = d3.select("#timeline3").append("svg").attr("width", 500)
      //     .datum(this.labelTestData).call(chart);
      // }

  ngOnInit() {
  //  this.areachart=Highcharts.chart('areaContainer1', this.areaChartOptions);
  this.selectedGroupVal="Productivity";

this.spinner.hide();
this.view=['Day'];
if(this.currentView=='Week'){
  this.showAbsentCount=true
}else{
  this.showAbsentCount=false

}
console.log('this.currentView',this.currentView);
this.showChartSpinner=true;
var testData = [
  {label: "person a", times: [
      {"starting_time": 1355752800000, "ending_time": 1355759900000},
      {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
  {label: "person b", times: [
      {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
  {label: "person c", times: [
      {"starting_time": 1355761910000, "ending_time": 1355763910000}]}
  ];
//  var chart = d3Timelines.timelines();

// var svg = d3.select("#timeline1").append("svg").attr("width", 500)
//     .datum(testData).call(chart);
this.timelineRelativeTime();
// this.timelineHover();
this.isTodayActive=true;

if(moment(this.selectedDate).format('L')==moment(this.today).format('L')){
  this.disableNxtBtn=true
}else{
  this.disableNxtBtn=false
}

// chart = am4core.create("chartdiv", am4charts.XYChart);
// chart.data = [{
//   "country": "USA",
//   "visits": 2025,
//   "text":"sdss"
// }, {
//   "country": "China",
//   "text":"sdss",
//   "visits": 1882,
// }
// , {
//   "country": "Japan",
//   "text":"sdss",

//   "visits": 1809
// }
// ];
// var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
// categoryAxis.dataFields.category = "country";
// categoryAxis.renderer.grid.template.location = 0;
// categoryAxis.renderer.minGridDistance = 30;

// categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
//   if (target.dataItem && target.dataItem.index ) {
//     return dy + 25;
//   }
//   return dy;
// });

// var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// var series = chart.series.push(new am4charts.ColumnSeries());
// series.dataFields.valueY = "visits";
// series.dataFields.categoryX = "country";
// series.name = "Visits";
// series.columns.template.fillOpacity = .8;
// series.columns.template.tooltipHTML="{categoryX}: [bold]{valueY} <span>{{text}}</span>[/]"
// var columnTemplate = series.columns.template;
// columnTemplate.strokeWidth = 2;
// columnTemplate.strokeOpacity = 1;


this.showtodaysData=true;
// this.FetchGridDataByDepartmentOrgID();
// this.GetProjectsByOrgID();
// this.GetEmpByOrgID();
// this.FindTeamsByOrgID();

    this.seriesType = new DropDownList({
      index: 0,
      width: 100,
      change: () => {
          let type: string = this.seriesType.value.toString();
          this.chart.series[0].type = <ChartSeriesType>type;
          this.chart.refresh();
      }
  });
  this.seriesType.appendTo('#seriestype');
  this.pointMode = new DropDownList({
      index: 0,
      width: 100,
      change: () => {
          let mode: string = this.pointMode.value.toString();
          this.chart.series[0].emptyPointSettings.mode = <EmptyPointMode>mode;
          this.chart.series[0].emptyPointSettings.fill = '#e6e6e6';
          this.chart.refresh();
      }
  });
  this.pointMode.appendTo('#emptyPointMode');
    // this.GetProjByOrgID();
    // this.GetAllTaskByEmpID();
    // this.getUsersInfo();
    // this.getAllStatus();
//     this.createChart();
//     if (this.data) {
//       this.updateChart();
//     }
//     this.initSvg();
//  this.initAxis();
// this.drawAxis();
 //this.drawBars();
    //this.getTimesheetByEmpId();


  if(localStorage.getItem('fromDate')){
    if((JSON.parse(localStorage.getItem('fromDate')) && JSON.parse(localStorage.getItem('toDate')) ==this.today)){
this.dateText=moment(JSON.parse(localStorage.getItem('fromDate'))).format('ddd, D MMM YYYY');

    }else if(localStorage.getItem('fromDate')!=localStorage.getItem('toDate')){
this.dateText=moment(JSON.parse(localStorage.getItem('fromDate'))).format('ddd, D MMM YYYY')+' - '+moment(JSON.parse(localStorage.getItem('toDate'))).format('ddd, D MMM YYYY');

    }else{

    }



  }


    this.dateRangeForm = new FormGroup({
      daterange: new FormControl(''),




   });
   this.datePickerForm = new FormGroup({
    date: new FormControl(''),




 });
 if(sessionStorage.getItem('workforceDate')){
  this.dateText=moment(JSON.parse(sessionStorage.getItem('workforceDate'))).format('ddd, D MMM YYYY');
  let dateValue=moment(JSON.parse(sessionStorage.getItem('workforceDate'))).format('L')
  this.EmpProductivityDashboard(dateValue,dateValue);
// this.DesktopEmpProductivity(dateValue,dateValue);
this.EmployeeAppTrackedByEmpIDAndDate(dateValue,dateValue);
this.GetTimesheetActivityByEmpIDAndDate(dateValue,dateValue);
this.GetTaskTimelineByEmpIDAndDate(dateValue,dateValue);
this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(dateValue,dateValue);
this.selectedDate=new Date(moment(JSON.parse(sessionStorage.getItem('workforceDate'))).format('L'));

  }else{
    this.EmpProductivityDashboard(this.today,this.today);
    // this.DesktopEmpProductivity(this.today,this.today);
    this.EmployeeAppTrackedByEmpIDAndDate(this.today,this.today);
    this.GetTimesheetActivityByEmpIDAndDate(this.today,this.today);
    this.GetTaskTimelineByEmpIDAndDate(this.today,this.today);

    this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(this.today,this.today);
  }
 this.datePickerForm.get('date').valueChanges.subscribe(() => {
  // fires when the input value has actually changed
 let dateValue=this.datePickerForm.get('date').value
 this.dateText=moment(this.datePickerForm.get('date').value).format('ddd, D MMM YYYY');
 this.showAbsentCount=false;

this.view=['Day'];
this.currentView  ='Day';
this.selectedDate=dateValue;
this.spinner.show();
this.showweeksContainer=false;

   this.EmpProductivityDashboard(dateValue,dateValue);
   //this.DesktopEmpProductivity(dateValue,dateValue);
   this.GetTimesheetActivityByEmpIDAndDate(dateValue,dateValue);
this.EmployeeAppTrackedByEmpIDAndDate(dateValue,dateValue);
this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(dateValue,dateValue);
this.GetTaskTimelineByEmpIDAndDate(dateValue,dateValue);

if(moment(dateValue).format('L')==moment(this.today).format('L')){
  this.disableNxtBtn=true
}else{
  this.disableNxtBtn=false
}
    // this.showweeksData=true;
    this.showtodaysData=true;


this.taskDatePickerRangeForm.patchValue({
  taskDaterange: [
    moment(dateValue).format('L'),
    moment(dateValue).format('L'),
  ]
})
let sendDate = moment(dateValue).format('MM/DD/YYYY')
let postData = {
  "empID": '',
  "startDate": sendDate,
  "endDate": sendDate
}
console.log(postData)
this.getEmployeeTask(postData);
this.employeeTodayDayProj(postData);


});
//    var today = new Date();
// // var startDay = 6;
// // var weekStart = new Date(today.getDate() - (7 + today.getDay() - startDay) % 7);
// // var weekEnd = new Date(today.getDate() + (7 - today.getDay() - startDay) % 7);
//
//    this.dateRangeForm.get('daterange').valueChanges.subscribe(() => {
//     // fires when the input value has actually changed

//     let startTime=this.dateRangeForm.get('daterange').value;
//     this.fromDateValue=moment(startTime[0]).format('L');
//     this.toDateValue=moment(startTime[1]).format('L');
//     this.spinner.show();
//     localStorage.setItem('fromDate',JSON.stringify(startTime[0]))
//     localStorage.setItem('toDate',JSON.stringify(startTime[1]));// this.GetTimesheetActivityByEmpIDAndDate(this.fromDateValue,this.toDateValue);

//     this.TotalEmployeeDashboardDataByOrgID(this.fromDateValue,this.toDateValue)
//     this.TotalEmployeeAbsentDashboardDataByOrgID(this.fromDateValue,this.toDateValue)
//     //
//     this.GetTimesheetDashboardDataByOrgID(this.fromDateValue,this.toDateValue)
//     this.GetAllTimesheetByOrgID(this.fromDateValue,this.toDateValue);
//     this.TotalEmpOverTimeCountByOrgIDAndDate(this.fromDateValue,this.toDateValue);
//     this.TotalLocationCheckInExceptionByOrgIDAndDate(this.fromDateValue,this.toDateValue);
//     this.showweeksData=true;
//     this.showtodaysData=false;

//     this.dateText=moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');



// });




  //
  //   $.getScript('assets/js/pages/dashboard.js')
  //   $.getScript('assets/plugins/custom/fullcalendar/fullcalendar.bundle.js')
  //   $.getScript('assets/js/pages/crud/forms/widgets/bootstrap-datepicker.js')

  this.toolbar = ['Search','PdfExport','ExcelExport'];
  this.searchSettings = {fields: ['project_name', 'cst_name']};
  this.initialSort = {
    columns: [{ field: 'ondate', direction: 'Descending' }]
  };
  this.getAllProject()

    this.taskDatePickerRangeForm = new FormGroup({
      taskDaterange: new FormControl(''),
    });


    let user_info= JSON.parse(localStorage.getItem('user_info'));
    this.employeeID = user_info.id;
    let sendDate = moment(this.dateText).format('MM/DD/YYYY')
    console.log('todays date', sendDate)
    if(user_info){
      let postData = {
        "empID": this.employeeID,
        "startDate": sendDate,
        "endDate":sendDate
      }
      console.log(postData)
      this.getEmployeeTask(postData);
      this.employeeTodayDayProj(postData);
    }

    this.taskDatePickerRangeForm.get('taskDaterange').valueChanges.subscribe(() => {
      this.spinner.show();
      let startTime=this.taskDatePickerRangeForm.get('taskDaterange').value;
      this.taskStartDate = moment(startTime[0]).format('L');
      this.taskEndDate = moment(startTime[1]).format('L');
      this.selectedDateText = moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');
      if(this.employeeID){
        let postData = {
          "empID": this.employeeID,
          "startDate": this.taskStartDate,
          "endDate": this.taskEndDate
        }
        console.log(postData)
        this.getEmployeeTask(postData);
        this.employeeTodayDayProj(postData);
      }
    });

    this.toolbarOptions = ['PdfExport', 'ExcelExport','Search'];
  }

  getAllProject(){
    /* this.projectService.FetchAllProjectByEmpID().subscribe((data) => {
      this.projectDataTab = data;
    }); */
    this.projectService.getFetchAllProjectByEmpID().subscribe((data) => {
      this.projectDataTab = data;
    });
  }


  getEmployeeTask(postData){
    this.projectService.getEmployeePreviousDayActivities(postData).subscribe((data) => {
      console.log(data)
      this.employeeTaskActivitiesData = data;
      this.empProductiveTime = this.employeeTaskActivitiesData.time_spend_activity === null ? '-' : this.employeeTaskActivitiesData.time_spend_activity;
      this.empProductivity = this.employeeTaskActivitiesData.productivity_ratio === null ? '-' : this.employeeTaskActivitiesData.productivity_ratio;
      this.empActivetyTime = this.employeeTaskActivitiesData.activity_count === null ? '-' : this.employeeTaskActivitiesData.activity_count;
      this.empTimeSpend = this.employeeTaskActivitiesData.time_spend_activity === null ? '-' : this.employeeTaskActivitiesData.time_spend_activity;
      this.spinner.hide();
    });
  }

  employeeTodayDayProj(postData){
    this.projectService.getEmployeePreviousDayActivitiesProjects(postData).subscribe((data) => {
      console.log(data);
      this.employeeTodayDayActivitiesProjectData = data;
    })
  }

  toolbarClick(args: ClickEventArgs): void {
    console.log(args)
    if (args.item.id === 'grid_1633817824_1_pdfexport') {
        this.grid.pdfExport();
    } else if(args.item.id === 'grid_1633817824_1_excelexport'){
       this.grid.excelExport();
    }
  }

  gridProjecttoolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'grid_1633817824_0_pdfexport') {
        this.proGrid.pdfExport();
    } else if(args.item.id === 'grid_1633817824_0_excelexport'){
        this.proGrid.excelExport();
    }
  }

  public employeeTabSelected(args: SelectEventArgs): void {
    console.log('tabSelected',args)
    this.scroll(args.selectedItem.innerText)
  }

  scroll(el) {
    document.getElementById(el).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }


}
