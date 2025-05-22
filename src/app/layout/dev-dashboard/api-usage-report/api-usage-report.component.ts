import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { GridComponent, ToolbarItems } from "@syncfusion/ej2-angular-grids";
import { AdministrativeService } from "../../../services/administrative.service";
import { NgxSpinnerService } from "ngx-spinner";
import moment = require("moment");
import { FormControl, FormGroup } from "@angular/forms";
import {
  ChartComponent,
  ColumnSeriesService,
  CategoryService,
} from "@syncfusion/ej2-angular-charts";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-dev-dash-attendence",
  templateUrl: "./api-usage-report.component.html",
  styleUrls: ["./api-usage-report.component.scss"],
})
export class DevDashApiUsageComponent {
  @ViewChild("singleOrgGrid", { static: false })
  chartComponent: ChartComponent;
  public singleOrgGrid: GridComponent;
  public toolbarOptions: ToolbarItems[];
  dateRangeForm: FormGroup;
  getStartDate = moment().format("L");
  getEndDate = moment().format("L");
  today: Date = new Date(new Date().toDateString());
  maxRangeDateTwo: Date = this.today;
  monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
  monthEnd: Date = this.today;
  lastStart: Date = new Date(
    new Date(
      new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)
    ).toDateString()
  );
  lastEnd: Date = new Date(this.today.getFullYear(), this.today.getMonth(), 0);
  yearStart: Date = new Date(
    new Date(new Date().setDate(new Date().getDate() - 365)).toDateString()
  );

  public title?: string;
  currentChartType: string = "";
  public legendSettings: Object = {
    visible: true,
    position: "Bottom",
    location: { x: 200, y: 40 },
  };

  primaryXAxis = {
    valueType: "Category",
    labelFormat: "yMMM",
    edgeLabelPlacement: "Shift",
  };

  marker = {
    dataLabel: {
      visible: true,
      position: "Middle",
    },
  };

  primaryYAxis: any;
  public chartData: Object[] = [];

  yearEnd: Date = this.today;
  weekStart = new Date(
    new Date(new Date().setDate(new Date().getDate() - 7)).toDateString()
  );
  weekEnd = new Date(new Date().toDateString());

  singleData = [];
  isMonthActive: boolean;
  isWeekActive: boolean;
  isTodayActive = true;
  chartView = false;
  isChartLoading = false;
  GecodingTotal = 0;
  MapViewTotal = 0;
  RegisterFaceTotal = 0;
  ScanFaceTotal = 0;
  public chartHeight: string = "350px";
  user_info = JSON.parse(localStorage.getItem("user_info"));
  constructor(
    private router: Router,
    public administrativeService: AdministrativeService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {}
  ngOnInit() {
    this.GetEventCountsByOrgId();
    this.GetMonthlyEventCountsByOrgId();
    this.GetYearlyEventCountsByOrgId();
    this.dateRangeFormInput();
    this.dateRangeForm.patchValue({
      dateRange: [this.getStartDate, this.getEndDate],
    });
    this.dateRangeForm.get("dateRange").valueChanges.subscribe(() => {
      let dateVaue = this.dateRangeForm.get("dateRange").value;
      this.getStartDate = moment(dateVaue[0]).format("L");
      this.getEndDate = moment(dateVaue[1]).format("L");
      this.isMonthActive = false;
      this.isWeekActive = false;
      this.isTodayActive = false;
      this.GetEventCountsByOrgId();
    });
    this.toolbarOptions = ["Search"];
  }
  dateRangeFormInput() {
    this.dateRangeForm = new FormGroup({
      dateRange: new FormControl(""),
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
  async GetEventCountsByOrgId() {
    let postData = {
      orgID: this.user_info.org_id,
      fromDate: this.getStartDate,
      toDate: this.getEndDate,
    };

    this.spinner.show();

    try {
      let res: any = await this.administrativeService
        .GetEventCountsByOrgId(postData)
        .toPromise();
      if (res && res.length > 0) {
        let totals: any = this.generateReport(res);
        this.singleData = res;
        this.GecodingTotal = totals.GecodingTotal || 0;
        this.MapViewTotal = totals.MapViewTotal || 0;
        this.RegisterFaceTotal = totals.RegisterFaceTotal || 0;
        this.ScanFaceTotal = totals.ScanFaceTotal || 0;
        if(this.singleOrgGrid){
          this.singleOrgGrid.refresh();
        }

      }
    } catch (error) {
      console.error("Error fetching event counts:", error);
    } finally {
      this.spinner.hide();
    }
  }

  generateReport(data) {
    let totals = data.reduce(
      (acc, curr) => {
        acc.GecodingTotal += curr.GecodingTotal || 0;
        acc.MapViewTotal += curr.MapViewTotal || 0;
        acc.RegisterFaceTotal += curr.RegisterFaceTotal || 0;
        acc.ScanFaceTotal += curr.ScanFaceTotal || 0;
        return acc;
      },
      {
        GecodingTotal: 0,
        MapViewTotal: 0,
        RegisterFaceTotal: 0,
        ScanFaceTotal: 0,
      }
    );

    console.log(totals);
    return totals;
  }
  async handleChartView(type: string) {
    if (this.chartView && this.currentChartType === type) {
      this.chartView = false;
      this.chartData = [];
      return;
    }
    this.chartView = true;
    this.chartData = [];
    this.currentChartType = type;

    if (type === "Yearly") {
      this.isChartLoading = true;
      await this.GetYearlyEventCountsByOrgId();
      this.isChartLoading = false;
    } else if (type === "Monthly") {
      this.isChartLoading = true;
      await this.GetMonthlyEventCountsByOrgId();
      this.isChartLoading = false;
    } else {
      this.chartView = false;
      this.toast.error("Invalid type selected");
    }
  }
   getRandomTwoDigitInteger() {
    return Math.floor(Math.random() * 90) + 10;
}
  async GetMonthlyEventCountsByOrgId() {
    let generateMonthlyData: any = await this.administrativeService
      .GetMonthlyEventCountsByOrgId({
        orgID: this.user_info.org_id,
      })
      .toPromise();
    if (generateMonthlyData && generateMonthlyData.length > 0) {
      generateMonthlyData.sort((a, b) => b.Month - a.Month);
      generateMonthlyData.forEach((ele) => {
        this.chartData.push({
          // x: ele.MonthName,
          // y: ele.GecodingTotal,
          // y1: ele.MapViewTotal,
          // y2: ele.RegisterFaceTotal,
          // y3: ele.ScanFaceTotal,
          x: ele.MonthName,
          y: ele.GecodingTotal,
          y1: this.getRandomTwoDigitInteger(),
          y2: this.getRandomTwoDigitInteger(),
          y3: this.getRandomTwoDigitInteger(),
        });
      });
    }
    console.log(this.chartData, "*******");
  }
  async GetYearlyEventCountsByOrgId() {
    let generatedYearlyData: any = await this.administrativeService
      .GetYearlyEventCountsByOrgId({
        orgID: this.user_info.org_id,
      })
      .toPromise();
    if (generatedYearlyData && generatedYearlyData.length > 0) {
      generatedYearlyData.sort((a, b) => b.Year - a.Year);
      generatedYearlyData.forEach((ele) => {
        this.chartData.push({
          x: ele.Year,
          y: ele.GecodingTotal,
          y1: ele.MapViewTotal,
          y2: ele.RegisterFaceTotal,
          y3: ele.ScanFaceTotal,
        });
      });
    }
    console.log(this.chartData, "*******");
  }

  goBack() {
    this.router.navigate(["/dev-dashboard"]);
  }

}
