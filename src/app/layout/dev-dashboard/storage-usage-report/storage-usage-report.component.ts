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
import { settingsService } from "../../../services/settings.service";
export interface UsageData {
  plan: string;
  lastUpdated: string;
  usage: {
    transformationsUsage: number;
    objectsUsage: number;
    bandwidthUsage: number;
    storageUsage: number;
    requests: number;
    credits: {
      usage: number;
      limit: number;
    };
    resources: number;
    derivedResources: number;
  };
  rateLimit: {
    allowed: number;
    resetAt: string;
    remaining: number;
  };
}

@Component({
  selector: "app-dev-dash-storage",
  templateUrl: "./storage-usage-report.component.html",
  styleUrls: ["./storage-usage-report.component.scss"],
})
export class DevDashStorageUsageComponent {
  constructor(
    private router: Router,
    public administrativeService: AdministrativeService,
    public settingsService: settingsService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {}
  public pieData = [];

  public startAngle = 0;
  public endAngle = 360;
  public center = { x: "50%", y: "50%" };
  public explode = true;
  isLoading = false;
  public enableAnimation = true;
  public title = "Storage Details";
  public legendSettings = { visible: true,position: 'Bottom' };
  public dataLabel: Object = {
    visible: true,
    position: "Outside",
    font: { size: "14px", color: "black" },
    template: "<div>${point.x}-${point.y}GB</div>",
  };
  public usageData = {};
  ngOnInit(): void {
    this.getUsageData();
  }
  goBack() {
    this.router.navigate(["/dev-dashboard"]);
  }
  async getUsageData() {
    try {
      this.isLoading = true;
      const response: any = await this.settingsService
        .GetStorageUsage()
        .toPromise();
      if (response && response.data) {
        this.usageData = {
          plan: response.data.plan,
          lastUpdated: response.data.last_updated,
          usage: {
            transformationsUsage: response.data.transformations.usage,
            objectsUsage: response.data.objects.usage,
            bandwidthUsage: this.convertBytesToMB(
              response.data.bandwidth.usage
            ),
            storageUsage: this.convertBytesToMB(response.data.storage.usage),
            requests: response.data.requests,
            credits: {
              usage: response.data.credits.usage,
              limit: response.data.credits.limit,
            },
            resources: response.data.resources,
            derivedResources: response.data.derived_resources,
          },
          rateLimit: {
            allowed: response.data.rate_limit_allowed,
            resetAt: response.data.rate_limit_reset_at,
            remaining: response.data.rate_limit_remaining,
          },
        };
        this.generatePieData(response.data.storage.usage);
      }
    } catch (error) {
      console.error("Error fetching usage data:", error);
    } finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
  }

  // Convert bytes to MB
  convertBytesToMB(bytes: number): number {
    return Math.round((bytes / (1024 * 1024)) * 100) / 100;
  }
  
  convertBytesToGB(bytes: number): number {
    return bytes / (1024 * 1024 * 1024); 
}
generatePieData(usedStorage: number) {
  console.log(usedStorage, "check");
  let totalStorage = 25;
  if (usedStorage && usedStorage > 0) {
      let convertedUsedStorage = this.convertBytesToGB(usedStorage);
      let remainingStorage = totalStorage - convertedUsedStorage;

      this.pieData.push(
          {
              x: "Free Space",
              y: parseFloat(remainingStorage.toFixed(2)), 
          },
          {
              x: "Used Space",
              y: parseFloat(convertedUsedStorage.toFixed(2)), 
          }
      );

      console.log(remainingStorage.toFixed(2), convertedUsedStorage.toFixed(2));
  }
}

  
}
