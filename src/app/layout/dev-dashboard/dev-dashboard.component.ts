import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import moment = require("moment");
import { TimeSheetService } from "../../services/timesheet.service";
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl, FormGroup } from "@angular/forms";
import {
  Data,
  GridComponent,
  ToolbarItems,
} from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";
import { PayrollService } from "../../services/payroll.service";
import { borderTopRightRadius } from "html2canvas/dist/types/css/property-descriptors/border-radius";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { MapsAPILoader, MouseEvent, AgmMap } from "@agm/core";
import { GoogleMap } from "@agm/core/services/google-maps-types";
import { Router } from "@angular/router";
@Component({
  selector: "app-dev-dashboard",
  templateUrl: "./dev-dashboard.component.html",
  styleUrls: ["./dev-dashboard.component.scss"],
  providers: [],
})
export class DevDashboardComponent implements AfterViewInit, OnInit {
  term;
  devItems = [
    {
      name: "Attendence Report",
    },
    {
      name: "API Usage Report",
    },
    {
      name: "Storage Usage Report",
    },
  ];
  ngAfterViewInit() {}

  ngOnInit(): void {}
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

  cardClick(value) {
    switch (value) {

      case "Attendence Report":
        this.router.navigate(["/dev-dashboard/attendence-report"]);
        break;
      case "API Usage Report":
        this.router.navigate(["/dev-dashboard/api-usage-report"]);
        break;
      case "Storage Usage Report":
        this.router.navigate(["/dev-dashboard/storage-usage-report"]);
        break;
      default:
        this.router.navigate(["dev-dashboard"]);
    }
  }
}
