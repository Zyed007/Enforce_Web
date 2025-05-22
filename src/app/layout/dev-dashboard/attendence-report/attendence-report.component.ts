import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import moment = require("moment");
import { TimeSheetService } from "../../../services/timesheet.service";
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl, FormGroup } from "@angular/forms";
import {
  Data,
  GridComponent,
  ToolbarItems,
} from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";
import { PayrollService } from "../../../services/payroll.service";
import { borderTopRightRadius } from "html2canvas/dist/types/css/property-descriptors/border-radius";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { MapsAPILoader, MouseEvent, AgmMap } from "@agm/core";
import { GoogleMap } from "@agm/core/services/google-maps-types";
import { Router } from "@angular/router";
@Component({
  selector: "app-dev-dash-attendence",
  templateUrl: "./attendence-report.component.html",
  styleUrls: ["./attendence-report.component.scss"],
})
export class DevDashAttendenceComponent {
  @ViewChild("hrBreakGrid", { static: false })
  public hrBreakGrid: GridComponent;
  @ViewChild("empTabledataTableGrid", { static: false })
  @ViewChild("viewMoreModal", { static: false })
  viewMoreModal: any;
  public invoiceToolbar: string[] = ["Search", "ExcelExport", "PdfExport"];
  public empTabledataTableGrid: GridComponent;
  @ViewChild(AgmMap, { static: true })
  map: GoogleMap;
  isMonthActive: boolean;
  isWeekActive: boolean;
  isTodayActive = true;
  showForceCheckouts = false;
  showForceCheckins = false;
  showWebCheckin = false;
  showLessHours = false;
  showCheckoutMissed = false;
  isMapModalOpen = false;
  showMapLoader = false;
  isLoading = false;
  checkout_missed = 0;
  less_hours = 0;
  web_checkin = 0;
  force_checkout = 0;
  force_checkin = 0;
  dateRangeForm: FormGroup;
  attendenceFilter: FormGroup;
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
  yearEnd: Date = this.today;
  weekStart = new Date(
    new Date(new Date().setDate(new Date().getDate() - 7)).toDateString()
  );
  weekEnd = new Date(new Date().toDateString());

  hrCheckAttData = [];
  activeEmpList = [];
  viewMoreEvents = [];
  viewMoreData = {
    date: "",
    full_name: "",
    app: false,
    islesshour: false,
    tot_min: "",
    weekday: "",
    workdaystatus: "",
    worktimestatus: "",
  };
  mapData = {
    checkinLat: 0,
    checkinLong: 0,
    checkoutLat: 0,
    checkoutLong: 0,
    radius: 0,
    zoom: 0,
    checkinTitle: "",
    checkoutTitle: "",
    distanceBtw: "",
    rangeExceed: false,
    forcecheckoutreson: "",
    workLocation: "",
    isforcecheckout: false,
  };
  geoCoder;
  workLocation = [
    { id: "Office", value: "Office" },
    { id: "WFH", value: "WFH" },
    { id: "Place", value: "Place" },
  ];
  application = [
    { id: "Web Application", value: "Web Application" },
    { id: "Mobile Application", value: "Mobile Application" },
  ];
  user_info = JSON.parse(localStorage.getItem("user_info"));
  commonFields: Object = { text: "value", value: "id" };
  isforcecheckout: any;
  ngAfterViewInit() {}

  ngOnInit(): void {
    this.CheckAttendenceExpInRangebyOrgId();
    this.dateRangeFormInput();
    this.dateRangeForm.patchValue({
      dateRange: [this.getStartDate, this.getEndDate],
    });
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      // this.setPredefinedLocation(this.latitude,this.longitude);
    });
    this.dateRangeForm.get("dateRange").valueChanges.subscribe(() => {
      this.spinner.show();
      this.handleShowData(null);
      let dateVaue = this.dateRangeForm.get("dateRange").value;
      this.getStartDate = moment(dateVaue[0]).format("L");
      this.getEndDate = moment(dateVaue[1]).format("L");
      this.isMonthActive = false;
      this.isWeekActive = false;
      this.isTodayActive = false;
      this.CheckAttendenceExpInRangebyOrgId();
    });
    this.initializeAttendenceFilter();
    this.getActiveEmployeeList();
  }
  constructor(
    public timesheetService: TimeSheetService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    public payrollService: PayrollService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private router: Router
  ) {}

  CheckAttendenceExpInRangebyOrgId() {
    //console.log("checking Attendence Strarted!!");
    let postData = {
      fromDate: this.getStartDate,
      toDate: this.getEndDate,
    };
    this.timesheetService
      .CheckAttendenceExpInRangebyOrgId(postData)
      .subscribe((data: any) => {
        if (data) {
          data.map((elm) => {
            elm.theday = this.datePipe.transform(
              new Date(elm.theday),
              "dd-MM-yyyy"
            );
            elm.check_in = elm.check_in
              ? this.convertTimeTo12HourFormat(elm.check_in)
              : "NA";
            elm.check_out = elm.check_out
              ? this.convertTimeTo12HourFormat(elm.check_out)
              : "NA";
            elm.tot_min = elm.tot_min
              ? this.convertMinutesToTimestamp(elm.tot_min)
              : "NA";
            elm.lessminutes = elm.lessminutes
              ? this.convertMinutesToTimestamp(elm.lessminutes)
              : "NA";
            elm.overminutes = elm.overminutes
              ? this.convertMinutesToTimestamp(elm.overminutes)
              : "NA";
            elm.is_today = this.currentDayCheck(elm.theday);
            elm.app = elm.isappcheckin
              ? "Mobile App"
              : elm.check_in !== "NA" && !elm.isappcheckin
              ? "Web App"
              : "";
            //console.log(elm.checkinplatform, elm.checkoutplatform, "CHECK");
            elm.checkinplatform = this.handleMobileAppPlatform(
              elm.checkinplatform,
              elm.isappcheckin
            );
            elm.checkoutplatform = this.handleMobileAppPlatform(
              elm.checkoutplatform,
              elm.isappcheckin
            );
          });
          this.hrCheckAttData = data;
          //console.log(data, "ATT DATA");
          let counts = data.reduce(
            (acc, item) => {
              if (item.worktimestatus === "Checkout Missing" && !item.is_today)
                acc.checkout_missed++;
              if (item.worktimestatus === "Lesshours" && !item.is_today)
                acc.less_hours++;
              if (!item.isappcheckin && item.workdaystatus === "Present")
                acc.web_checkin++;
              if (item.isforcecheckin && item.isforcecheckin != null)
                acc.force_checkin++;
              if (item.isforcechecout && item.isforcechecout != null)
                acc.force_checkout++;
              return acc;
            },
            {
              checkout_missed: 0,
              less_hours: 0,
              web_checkin: 0,
              force_checkout: 0,
              force_checkin: 0,
            }
          );
          this.checkout_missed = counts.checkout_missed;
          this.less_hours = counts.less_hours;
          this.web_checkin = counts.web_checkin;
          this.force_checkin = counts.force_checkin;
          this.force_checkout = counts.force_checkout;
          //console.log("checking Attendence!!", counts);
          this.spinner.hide();
        }
      });
  }
  handleMobileAppPlatform(platformInfo, isappcheckin) {
    //console.log(platformInfo, isappcheckin);
    if (
      platformInfo &&
      platformInfo != "" &&
      platformInfo.startsWith("/") &&
      isappcheckin
    ) {
      let formattedInfo = platformInfo.slice(1);
      return `Android/App/${formattedInfo}`;
    } else {
      return platformInfo;
    }
  }
  convertTimeTo12HourFormat(timeString) {
    // Parse the time string to a Date object
    var timeParts = timeString.split(":");
    // Create a new Date object with today's date and the given time
    var dateObj = new Date();
    dateObj.setHours(parseInt(timeParts[0]));
    dateObj.setMinutes(parseInt(timeParts[1]));
    return dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  convertMinutesToTimestamp(minutes) {
    return (
      Math.floor(minutes / 60) +
      ":" +
      (minutes % 60 < 10 ? "0" : "") +
      (minutes % 60)
    );
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

  getActiveEmployeeList() {
    this.activeEmpList = [];
    this.payrollService
      .getActiveEmployeeListByOrgID({ id: this.user_info.org_id })
      .subscribe((rsp: any) => {
        if (rsp) {
          rsp.map((emp) => {
            this.activeEmpList.push({
              value: emp.full_name,
              id: emp.full_name,
            });
          });
        }
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
  //form
  dateRangeFormInput() {
    this.dateRangeForm = new FormGroup({
      dateRange: new FormControl(""),
    });
  }

  initializeAttendenceFilter() {
    this.attendenceFilter = new FormGroup({
      emp_name: new FormControl(""),
      work_location: new FormControl(""),
      week_day: new FormControl(""),
      app: new FormControl(""),
    });
  }

  hrBreakGridDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case "PDF Export":
        this.hrBreakGrid.pdfExport();
        break;
      case "Excel Export":
        this.hrBreakGrid.excelExport();
        break;
      case "CSV Export":
        this.hrBreakGrid.csvExport();
        break;
    }
  }
  // attendenceGridCellInfo(args: any) {
  //   if (
  //     args.data["worktimestatus"] == "Checkout Missing" &&
  //     this.showCheckoutMissed
  //   ) {
  //     args.cell.classList.add("background-inPending");
  //     console.log("working");
  //   }
  //   // else if (args.data['leave_status'] == ('Checkin/Checkout Overwrite Approved')) {
  //   //   args.cell.classList.add('background-inApproved');
  //   // }
  // }
  attendenceGridCellInfo(args: any) {
    args.cell.classList.remove("background-inPending");
    if (args.data["isforcecheckin"] === true && this.showForceCheckins) {
      args.cell.classList.add("background-inPending");
    } else if (
      args.data["isforcechecout"] === true &&
      this.showForceCheckouts
    ) {
      args.cell.classList.add("background-inPending");
    } else if (
      args.data["worktimestatus"] == "Lesshours" &&
      this.showLessHours &&
      !args.data["is_today"]
    ) {
      args.cell.classList.add("background-inPending");
    } else if (
      args.data["worktimestatus"] == "Checkout Missing" &&
      this.showCheckoutMissed &&
      !args.data["is_today"]
    ) {
      args.cell.classList.add("background-inPending");
    } else if (
      args.data["isappcheckin"] === false &&
      args.data["workdaystatus"] === "Present" &&
      this.showWebCheckin
    ) {
      args.cell.classList.add("background-inPending");
    }
  }
  handleShowData(show) {
    this.isLoading = true;

    switch (show) {
      case "Force Checkins":
        this.showForceCheckins = !this.showForceCheckins;
        this.showWebCheckin = false;
        this.showLessHours = false;
        this.showCheckoutMissed = false;
        this.showForceCheckouts = false;
        break;
      case "Force Checkouts":
        this.showForceCheckouts = !this.showForceCheckouts;
        this.showWebCheckin = false;
        this.showLessHours = false;
        this.showCheckoutMissed = false;
        this.showForceCheckins = false;
        break;
      case "Web Checkin":
        this.showForceCheckouts = false;
        this.showWebCheckin = !this.showWebCheckin;
        this.showLessHours = false;
        this.showCheckoutMissed = false;
        this.showForceCheckins = false;
        break;
      case "Less Hours":
        this.showForceCheckouts = false;
        this.showWebCheckin = false;
        this.showLessHours = !this.showLessHours;
        this.showCheckoutMissed = false;
        this.showForceCheckins = false;
        break;
      case "Checkout Missed":
        this.showForceCheckouts = false;
        this.showWebCheckin = false;
        this.showLessHours = false;
        this.showCheckoutMissed = !this.showCheckoutMissed;
        this.showForceCheckins = false;
        break;

      default:
        this.showForceCheckins = false;
        this.showForceCheckouts = false;
        this.showWebCheckin = false;
        this.showLessHours = false;
        this.showCheckoutMissed = false;
    }

    let originalData: any = this.hrCheckAttData;

    let isAnyFilterActive =
      this.showForceCheckins ||
      this.showForceCheckouts ||
      this.showWebCheckin ||
      this.showLessHours ||
      this.showCheckoutMissed;

    if (!isAnyFilterActive) {
      this.hrBreakGrid.dataSource = this.hrCheckAttData;
      this.hrBreakGrid.refresh();
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
      return;
    }

    let filteredData = originalData.filter((item: any) => {
      let matchesWebCheckin = true;
      let matchesForceCheckin = true;
      let matchesForceCheckout = true;
      let matchesCheckoutMissed = true;
      let matchesLessHours = true;

      if (this.showForceCheckouts) {
        matchesForceCheckout = item.isforcechecout === true;
      }
      if (this.showForceCheckins) {
        matchesForceCheckin = item.isforcecheckin === true;
      }
      if (this.showWebCheckin) {
        matchesWebCheckin = !(item.isappcheckin && item.check_in !== "NA");
      }
      if (this.showCheckoutMissed) {
        matchesCheckoutMissed = item.worktimestatus === "Checkout Missing";
      }
      if (this.showLessHours) {
        matchesLessHours = item.worktimestatus === "Lesshours";
      }

      return (
        matchesWebCheckin &&
        matchesForceCheckin &&
        matchesForceCheckout &&
        matchesCheckoutMissed &&
        matchesLessHours
      );
    });

    this.hrBreakGrid.dataSource = filteredData;
    this.hrBreakGrid.refresh();
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  currentDayCheck(theday: string) {
    const today = new Date();
    const formattedToday = this.datePipe.transform(today, "dd-MM-yyyy");
    if (theday === formattedToday) {
      return true;
    } else {
      return false;
    }
  }
  applyAttendenceFilter(): void {
    this.hrBreakGrid.clearFiltering(); // Clear existing filters
    let filters = this.attendenceFilter.getRawValue();
    //console.log(filters, "filters***");
    if (filters.emp_name) {
      this.hrBreakGrid.filterByColumn(
        "full_name",
        "contains",
        filters.emp_name
      );
    }
    if (filters.work_location) {
      this.hrBreakGrid.filterByColumn(
        "worklocation",
        "contains",
        filters.work_location
      );
    }
    if (filters.app && filters.app !== "") {
      if (filters.app === "Mobile Application") {
        this.hrBreakGrid.filterByColumn("app", "contains", "Mobile");
      } else {
        this.hrBreakGrid.filterByColumn("app", "contains", "Web");
      }
    }
    this.hrBreakGrid.refresh();
  }

  clearAllFilters() {
    this.attendenceFilter.reset();
    this.hrBreakGrid.clearFiltering();
  }

  async handleShowMoreDetails(data) {
    this.viewMoreEvents = [];
    this.viewMoreData = {
      date: data.theday,
      full_name: data.full_name,
      app: data.app,
      islesshour: data.islesshour,
      tot_min: data.tot_min,
      weekday: data.weekday,
      workdaystatus: data.workdaystatus,
      worktimestatus: data.worktimestatus,
    };
    //console.log(this.viewMoreData,"viewMoreData");
    this.spinner.show();
    try {
      const details: any = await this.showMoreDetails(data);
      console.log(details, "CHECK");
      if (details && details.length > 0) {
        //console.log(details);
        details.forEach((element) => {
          element.checkin_platform = this.handleMobileAppPlatform(
            element.checkin_platform,
            element.is_app_check_In
          );
          element.checkout_platform = this.handleMobileAppPlatform(
            element.checkout_platform,
            element.is_app_check_In
          );
          this.viewMoreEvents.push(element);
        });

        this.modalService.open(this.viewMoreModal, {
          size: "lg",
        });
      } else {
        this.toast.warning("No Data Found");
      }
    } catch (error) {
      //console.error("Error fetching details:", error);
      this.toast.error("Failed to fetch details");
    } finally {
      this.spinner.hide();
    }
  }

  async showMoreDetails(data) {
    //console.log(data, "theday");
    const formattedDate = moment(data.theday, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    //console.log(formattedDate, "formattedDate");

    try {
      const result = await this.timesheetService
        .PresentDayDetails({ id: data.empid, date: formattedDate })
        .toPromise();
      return result;
    } catch (error) {
      //console.error("Error fetching details:", error);
      throw error;
    }
  }
  closeModel() {
    this.modalService.dismissAll();
  }
  async openMapModal(data) {
    console.log(data, "CHECKING DATA");
  
    this.showMapLoader = true;
    this.spinner.show();
  
    try {
      if (!data.lat || !data.lang) {
        this.toast.error("Sorry, No Location Coordinates Found!");
        return;
      }
      
  
      let mapData = {
        checkinLat: parseFloat(data.lat),
        checkinLong: parseFloat(data.lang),
        checkoutLat: null,
        checkoutLong: null,
        radius: 300,
        zoom: 8,
        checkinTitle: "Check-in",
        checkoutTitle: "Check-out",
        distanceBtw: null,
        rangeExceed: null,
        forcecheckoutreson: null,
        workLocation: data.workloc,
        isforcecheckout: false,
      };
  
      if (data.isforcechecout && data.forcecheckoutlat && data.forcecheckoutlang) {
        const calculatedDistance: number = this.haversineDistance(
          data.lat,
          data.lang,
          data.forcecheckoutlat,
          data.forcecheckoutlang
        );
  
        const zoom = calculatedDistance > 300 && calculatedDistance < 1000 ? 12 : 8;
        const distanceBtw =
          calculatedDistance > 1000
            ? `${(calculatedDistance / 1000).toFixed(2)} km`
            : `${calculatedDistance.toFixed(2)} m`;
  
        mapData = {
          ...mapData,
          checkoutLat: parseFloat(data.forcecheckoutlat),
          checkoutLong: parseFloat(data.forcecheckoutlang),
          zoom,
          distanceBtw,
          rangeExceed: calculatedDistance > 300,
          forcecheckoutreson: data.forcecheckoutreson,
          isforcecheckout: true,
        };
      } else if (data.isforcechecout) {
        this.toast.error("Sorry, No Force Checkout Location Found!");
        return;
      }
  
      this.mapData = mapData;
  
      await this.delay(1000);
      this.isMapModalOpen = true;
      await this.delay(1000);
      this.showMapLoader = false;
    } catch (error) {
      console.error("Error in openMapModal:", error);
      this.toast.error("An unexpected error occurred. Please try again.");
    } finally {
      this.spinner.hide();
      this.showMapLoader = false;
    }
  }
  

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  haversineDistance(lat1, lng1, lat2, lng2) {
    const toRadians = (angle) => angle * (Math.PI / 180);

    const R = 6371000;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
  closeMapModal() {
    this.isMapModalOpen = false;
  }
  onMapReady(map: any) {
    const line = new google.maps.Polyline({
      path: [
        { lat: this.mapData.checkinLat, lng: this.mapData.checkinLong },
        { lat: this.mapData.checkoutLat, lng: this.mapData.checkoutLong },
      ],
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    line.setMap(map);
  }
  navigateToAttendence() {
    console.log("CLICKED");
    this.router.navigate(["/dev-dashboard/attendence-report"]);
  }
  goBack() {
    this.router.navigate(["/dev-dashboard"]);
  }
}
