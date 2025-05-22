import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import * as moment from "moment";
import { EmployeeService } from "../../services/employee.service";
import {
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  EventSettingsModel,
  View,
  PopupOpenEventArgs,
  ScheduleComponent,
  ActionEventArgs,
  RenderCellEventArgs,
  EventRenderedArgs,
} from "@syncfusion/ej2-angular-schedule";
import { MapsAPILoader, MouseEvent, AgmMap } from "@agm/core";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";
import { created, GridComponent } from "@syncfusion/ej2-angular-grids";
import { Toast, ToastrService } from "ngx-toastr";

declare var $: any;
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from "lodash";
import { Select2OptionData } from "ng2-select2";
import { settingsService } from "../../services/settings.service";

//services
import { TimeSheetService } from "../../services/timesheet.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { string } from "@amcharts/amcharts4/core";
import { OrganizationService } from "../../services/organization.service";
import { PayrollService } from "../../services/payroll.service";
import { UserService } from "../../services/user.service";
import { ModuleSetupService } from "../../services/moduleSetup.service";
import { data } from "jquery";
import { DropDownListComponent } from "@syncfusion/ej2-angular-dropdowns";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { element } from "protractor";
import { ProjectService } from "../../services/project.service";
import Swal from "sweetalert2";

import { VehicleNumberService } from "../../shared/services/vehicle-number.service";
//declare var google: any;

@Component({
  selector: "app-travels",
  templateUrl: "./travels.component.html",
  styleUrls: ["./travels.component.scss"],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TravelsComponent implements OnInit {
  public today: Date = new Date(new Date().toDateString());
  public dateValue = moment().format("ddd, D MMM YYYY");
  public dateText = moment().format("ddd, D MMM YYYY");
  dateSelect = moment().format("L");
  public selectedDate = new Date();
  public maxRangeDate: Date = this.today;
  datePickerForm: FormGroup;
  dateRangeForm: FormGroup;
  distanceForm: FormGroup;
  kmdistances: FormGroup;
  travelDispute: FormGroup;
  public empForm: FormGroup;

  disputeAllForm: FormGroup;
  claimForm: FormGroup;

  lat;
  lng;
  zoom;
  toolbar: string[];
  taskOptions: { placeholder: string; width: string };
  commonFields: Object = { text: "value", value: "id" };
  public employeeNameData: Array<Select2OptionData>;
  public maxRangeDateTwo: Date = this.today;
  public monthStart: Date = new Date(
    new Date(new Date().setDate(1)).toDateString()
  );
  public deptOptions: Select2Options;
  public monthEnd: Date = this.today;
  public lastStart: Date = new Date(
    new Date(
      new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)
    ).toDateString()
  );
  public lastEnd: Date = this.today;
  public yearStart: Date = new Date(
    new Date(new Date().setDate(new Date().getDate() - 365)).toDateString()
  );
  public currentTime = moment().add(1, "minutes").format("hh:mm a");
  public yearEnd: Date = this.today;
  @ViewChild("grid", { static: false })
  public grid: GridComponent;
  @ViewChild("claimgrid", { static: false })
  public claimgrid: GridComponent;
  @ViewChild("toClaimgrid", { static: false })
  public toClaimgrid: GridComponent;
  @ViewChild("pendinggrid", { static: false })
  public pendinggrid: GridComponent;

  @ViewChild("empDropdown", { static: false })
  empDropdown: DropDownListComponent;

  @ViewChild("mapCloseBtn", { static: false }) mapCloseBtn: ElementRef;
  @ViewChild("statusCloseBtn", { static: false }) statusCloseBtn: ElementRef;
  @ViewChild("aprDisputeModal", { static: false }) aprDisputeModal: any;
  @ViewChild("printModal", { static: false }) printModal: any;

  selectedDateModel;
  distanceDroven;
  newTeamData;
  checkin_formatted_address;
  checkout_formatted_address;
  selectedKmModel;
  selectLocationArray = [];
  selectLocationArray2 = [];
  selectedLatLong = [];
  selectedLatLong2 = [];
  distanceArray;
  totalDistance2 = [];
  selectedItems = [];
  employeeData = [];
  filteredtravelData = [];
  pendingDisputeData = [];
  disputeData = [];
  filteredDisputeData = [];
  VehicleType = [];
  claimData = [];
  userInfo;
  sendDateStart;
  sendDateEnd;
  disputeModalData = {};
  activeTab = "";
  activeTabIndex = 0;
  selectedDisputeData: any = {
    group_id: "",
    elements: [],
    count: 0,
    created_date: "",
    status: "Pending",
    empName: "",
    created_by: "",
    modified_by: "",
    approver1_roleId: null,
    approver2_roleId: null,
    approver1_emp_id: null,
    approver2_emp_id: null,
    is_approved_1: false,
    is_approved_2: false,
    approver_date1: "",
    approver_date2: "",
    org_id: "",
    emp_id: "",
  };

  empDelData = [];
  isEmpDelLoading = false;
  selectAllDispute = false;
  selectAllClaims = false;
  payrollSubmitFullAccess = false;
  payrollApprover1RoleId = "";
  payrollApprover1RoleName = "";
  payrollApprover2RoleId = "";
  payrollApprover2RoleName = "";
  isPayrollDualApprover = false;
  isAccountOwner = false;
  PayrollModuleID = "";
  createPayrollSectionName = "";
  employeeID;
  employeeName;
  commonModuleName;
  start_end_mark = [];
  is_submitted: boolean = false;
  is_claimSubmitted: boolean = false;
  public userData: any = [
    {
      _id: "7f91e9e0-893c-4499-929b-d4fafa742f5e",
      empid: "994af2a7-340b-48f2-84f6-f17195e3d321",
      created_date: "2021-03-21T20:00:00.000Z",
      TravelClaimTrack: [
        {
          lat: "25.2134904",
          lang: "55.2599101",
          checkout_formatted_address:
            "1501 Al Mustaqbal St - Business Bay - Dubai - United Arab Emirates",
        },
        {
          lat: "25.182075299999997",
          lang: "55.25908150000001",
          checkout_formatted_address:
            "1501 Al Mustaqbal St - Business Bay - Dubai - United Arab Emirates",
        },
        {
          lat: "25.14164",
          lang: "55.31394",
          checkout_formatted_address:
            "1501 Al Mustaqbal St - Business Bay - Dubai - United Arab Emirates",
        },
        {
          lat: "25.1666006",
          lang: "55.4091784",
          checkout_formatted_address:
            "1501 Al Mustaqbal St - Business Bay - Dubai - United Arab Emirates",
        },
      ],
    },
    {
      _id: "7f91e9e0-893c-4499-929b-d4fafa742f5e",
      empid: "994af2a7-340b-48f2-84f6-f17195e3d321",
      created_date: "2021-03-23T20:00:00.000Z",
      TravelClaimTrack: [
        {
          lat: "25.20183",
          lang: "55.25523",
          checkout_formatted_address:
            "1501 Al Mustaqbal St - Business Bay - Dubai - United Arab Emirates",
        },
        {
          lat: "25.20532",
          lang: "55.27403",
          checkout_formatted_address:
            "1501 Al Mustaqbal St - Business Bay - Dubai - United Arab Emirates",
        },
        {
          lat: "25.21741",
          lang: "55.28670",
          checkout_formatted_address:
            "1501 Al Mustaqbal St - Business Bay - Dubai - United Arab Emirates",
        },
      ],
    },
  ];
  public emirates = [
    { id: 0, text: "Select Source" },
    { id: 1, text: "Abu Dhabi" },
    { id: 2, text: "Dubai" },
    { id: 3, text: "Sharjah" },
    { id: 4, text: "Ajman" },
    { id: 5, text: "Umm Al-Quwain" },
    { id: 6, text: "Fujairah" },
    { id: 7, text: "Ras Al Khaimah" },
  ];
  public fuelStations = [

  ];
  public plateCategory = [
    { id: 0, text: "Select Category" },
    { id: 1, text: "Private" },
  ];

  public NewUserData = [];
  totalkms: number;
  pending: boolean;
  clamintracelbutton: boolean;
  travelid: any;
  disputeButtonDisabled: boolean; // Initially, button is enabled
  LeaveDocUrl: any;
  isLeaveDocUp: boolean;
  originalTravedata: any[];

  constructor(
    public timesheetService: TimeSheetService,
    public employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private settingsService: settingsService,
    private payrollService: PayrollService,
    private empService: EmployeeService,
    private userService: UserService,
    private ModuleSetupService: ModuleSetupService,
    private formBuilder: FormBuilder,
    public modalService: NgbModal,
    public projectService: ProjectService,
    public organizationService: OrganizationService,
    private vehicleNumberService: VehicleNumberService
  ) {
    this.taskOptions = {
      placeholder: "Select",
      width: "100%",
    };
    this.deptOptions = {
      placeholder: { id: "0", text: "Select" },
      allowClear: true,
      width: "100%",
    };

    //forms method
    this.singleDateForm();
    this.DateRangeForm();
    this.kmdistance();
  }
  InitializeTravelDispute() {
    this.travelDispute = new FormGroup({
      new_val: new FormControl("", [Validators.required, Validators.min(0)]),
      reasondesc: new FormControl("", Validators.required),
      doc: new FormControl("", Validators.required),
    });
  }

  createDisputeAllForm(): void {
    this.disputeAllForm = new FormGroup({
      disputeDetails: this.formBuilder.array([]),
    });
  }

  get disputeDetails(): FormArray {
    return this.disputeAllForm.get("disputeDetails") as FormArray;
  }

  kmdistance() {
    this.kmdistances = new FormGroup({
      reasondesc: new FormControl(""),
      reasondescs: new FormControl(""),
    });
  }

  singleDateForm() {
    this.datePickerForm = new FormGroup({
      singleData: new FormControl(""),
    });
  }

  DateRangeForm() {
    this.dateRangeForm = new FormGroup({
      dateRange: new FormControl(""),
    });
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem("user_info"));
    this.clamintracelbutton = false;
    this.empForm = new FormGroup({
      emp: new FormControl(null, [Validators.required]),
      empName: new FormControl(""),
      vehicleType: new FormControl("", [Validators.required]),
    });
    this.claimForm = new FormGroup({
      empName: new FormControl("", [Validators.required]),
      vehicleType: new FormControl("", [Validators.required]),
      document: new FormControl("", Validators.required),
      remarks: new FormControl(""),
      totalDistance: new FormControl("", Validators.required),
      date: new FormControl("", Validators.required),
      actual_fuel_Price: new FormControl("", Validators.required),
      actual_fuel_quantity: new FormControl("", Validators.required),
      odometer: new FormControl("", Validators.required),
      vehicle_number: new FormControl("", Validators.required),
      vehicle_text: new FormControl("", Validators.required),
      plate_category:new FormControl("", Validators.required),
      dateRange: new FormControl(""),
      time: new FormControl(""),
      claim_id: new FormControl("", Validators.required),
      emirate: new FormControl("", Validators.required),
      fuel_pump: new FormControl("", Validators.required),
      calcType: new FormControl(""),
      createdDate: new FormControl(""),
      createdBy: new FormControl(""),

    });
    this.fetchVehicleNumberConfig();
    this.checkUserRights();
    this.getEmployeeList();
    this.createDisputeAllForm();
    this.InitializeTravelDispute();
    this.getTravelSettings();
    this.fetchTravelDisputeData();
    this.GetTravelClaimByEmpId();
    this.FindCurrencyByOrgId();

    this.employeeNameData = [
      {
        id: "",
        text: "select",
      },
      {
        id: "f68ec248-e579-4b5a-a64d-ba690b15a37a",
        text: "Wael Mostafa",
      },
      {
        id: "f0ad0c2-184c-4bf3-a710-ad2a7aee3e42",
        text: "Mitesh Gandhi",
      },
    ];

    this.newTeamData = [
      { text: "Travel Log" },
      { text: "Travel Claim" },
      { text: "Pending" },
      { text: "Rejected" },
      { text: "Approved" },
    ];

    //single date
    this.datePickerForm.get("singleData").valueChanges.subscribe(() => {
      let dateVaue = this.datePickerForm.get("singleData").value;
      this.dateText = moment(dateVaue).format("ddd, D MMM YYYY");
      this.sendDateStart = moment(dateVaue).format("YYYY-MM-DD");
      this.sendDateEnd = moment(dateVaue).format("YYYY-MM-DD");
    });

    this.dateRangeForm.get("dateRange").valueChanges.subscribe((dateValue) => {
      if (dateValue && dateValue.length > 0) {
        this.dateText =
          moment(dateValue[0]).format("ddd, D MMM YYYY") +
          " - " +
          moment(dateValue[1]).format("ddd, D MMM YYYY");
        this.sendDateStart = moment(dateValue[0]).format("YYYY-MM-DD");
        this.sendDateEnd = moment(dateValue[1]).format("YYYY-MM-DD");
      }
    });

    this.dateRangeForm.patchValue({
      dateRange: [
        moment(this.sendDateStart).format("L"),
        moment(this.sendDateEnd).format("L"),
      ],
    });

    this.toolbar = ["ExcelExport", "PdfExport"];
    //setTimeout(() => this.mainFunction(), 10000);
  }
 async fetchVehicleNumberConfig(){
    try {
      const configs = await this.vehicleNumberService.fetchVehicleConfigs();
      if (configs.length > 0) {
        this.vehicleNumberService.setVehicleConfigs(configs);
        // this.updateDropdown();
      }
    } catch (error) {
      console.error('Failed to load vehicle configs', error);
    }
  }
  updateDropdown(source) {
    let arr= this.vehicleNumberService.getDropdownOptions(source);
    this.numberPlateCodes=arr;
    console.log(arr,"Vehicle No Config")
  }

  changedCustomer(event) {
    this.employeeName = event.data[0].text;
    this.employeeID = event.value;
  }

  distancechanges(data: any) {
    console.log(data);
    data.disputeButtonDisabled = true;
    this.travelid = data.id;
    this.selectedDateModel = data.created_date;
    this.distanceDroven = data.updatedDistance;
    this.checkin_formatted_address = data.checkin_formatted_address;
    this.checkout_formatted_address = data.checkout_formatted_address;
    console.log(
      "Calling distancechanges function with data:",
      data.disputeButtonDisabled
    );
  }

  // distancechanges(data){
  //   this.disputebutton=false;
  //   this.travelid=data.id;
  //   this.selectedDateModel = data.created_date;
  //   this.distanceDroven=data.distance;
  //   this.checkin_formatted_address=data.checkin_formatted_address;
  //   this.checkout_formatted_address=data.checkout_formatted_address;
  //   // $('#distance_modal').modal("show");
  // }

  Canceldispute(data) {
    console.log("Am here", data);

    // const itemToUpdate = this.filteredtravelData.find(elm => elm.id === this.travelid);

    // if (itemToUpdate) {
    //   itemToUpdate.isLeaveDocUp = false;
    // }
    data.disputeButtonDisabled = false;
    this.grid.refresh();
  }

  distanceoverwrite(data) {
    console.log("Daata is here ", data);
    this.filteredtravelData.map((elm) => {
      if (elm.id == this.travelid) {
        elm.pending = true;
        elm.isLeaveDocUp = false;
        elm.disputeButtonDisabled = false;
      }
    });
    this.filteredtravelData = this.originalTravedata;
    console.log(this.filteredtravelData);

    //Need to add the api call in here tp add the data to the database for the further updatations
    // Need to store this data in to a dispute table inorder to give that to the a[[rpova; sectopns

    // this.filteredtravelData=this.filteredtravelData.filter((elm) => {
    //   return elm.pending === false; // Keep only elements where elm.pending is true
    // });
    this.grid.refresh();
    this.OnCloseChanes();
    this.toastr.success(
      "Distance Change request has been sent successfully for approval",
      undefined,
      {
        positionClass: "toast-top-center",
      }
    );
    this.grid.refresh();
  }
  async handleTravelClaimSubmit() {
    await this.travelClaimSubmit();
  }
  calculateClaimAmount(distance: number, vehicleType: string) {
    console.log(distance, vehicleType, "calculateClaimAmount");
    let vehicleData = this.VehicleType.find(
      (i) => i.vehicle_type === vehicleType
    );
    if (vehicleData.fuel_efficiency && vehicleData.fuel_cost) {
      return (distance / vehicleData.fuel_efficiency) * vehicleData.fuel_cost;
    }
    return 0;
  }
  travelDataForPrint = [];
  async travelClaimSubmit() {
    console.log(this.selectedItems, "selectedItems");
    const forClaimData = this.selectedItems.filter((i) => i.selected);
    const empId = this.empForm.get("emp").value;
    let filteredRecordData = [];
    if (forClaimData.length === 0) {
      this.toastr.error("Please select records for claim");
      return;
    }

    const validationError = this.validateClaimForm();
    if (validationError) {
      this.toastr.error(validationError);
      return;
    }

    this.spinner.show();

    try {
      let wePrefix = await this.GetWorkExpensesPrefixByOrgID();
      const claimValue = this.claimForm.getRawValue();
      filteredRecordData = forClaimData.map((i) => ({
        travel_id: i.id,
        org_id: i.org_id,
        emp_id: i.empid,
        travel_group_id: i.groupid,
        checkin_addr: i.checkin_formatted_address,
        checkout_addr: i.checkout_formatted_address,
        distance: i.updatedDistance,
        travel_created_date: i.created_date,
        job_type: i.checkout_jobType,
        project: i.checkout_project,
      }));
      let fuel_price =
        claimValue.actual_fuel_Price / claimValue.actual_fuel_quantity;
      const postData = {
        emp_id: empId,
        org_id: this.userInfo.org_id,
        travel_data: filteredRecordData,
        created_by: this.userInfo.id,
        modified_by: this.userInfo.id,
        approver1_roleId: this.payrollSubmitFullAccess
          ? null
          : this.payrollApprover1RoleId,
        approver2_roleId: this.isPayrollDualApprover
          ? this.payrollApprover2RoleId
          : null,
        is_approved_1: false,
        is_approved_2: false,
        status: "Pending",
        document: claimValue.document,
        final_amount: 0,
        remarks: claimValue.remarks,
        vehicle_type: claimValue.vehicleType,
        actual_fuel_Price:
          claimValue.vehicleType === "Company Car" ? fuel_price : 0,
        actual_fuel_quantity:
          claimValue.vehicleType === "Company Car"
            ? claimValue.actual_fuel_quantity
            : 0,
        odometer:
          claimValue.vehicleType === "Company Car" ? claimValue.odometer : 0,
        actual_fuel_date: claimValue.date,
        vehicle_number:
          claimValue.vehicle_number != null ? claimValue.vehicle_text + claimValue.vehicle_number : "",
        actual_doc: claimValue.document,
        emirate:
          claimValue.emirate != null ? claimValue.emirate.toLowerCase() : "",
        fuel_pump:
          claimValue.fuel_pump != null
            ? claimValue.fuel_pump.toLowerCase()
            : "",
        expense_id: wePrefix,
        claim_id: claimValue.claim_id,
      };
      console.log(postData, "TEST");

      const response: any = await this.payrollService.GenerateTravelClaim(postData).toPromise();
      console.log(response, "response***");

      if (response && response.status == "200") {
        this.toastr.success("Travel claim submitted successfully");
      }
    } catch (error) {
      this.toastr.error("An error occurred while submitting the travel claim");
    } finally {
      this.spinner.hide();
      Swal.fire({
        title: "Claim Submitted Successfully",
        text: "Do you want to print the document?",
        confirmButtonText: "Print",
        showCancelButton: true,
        allowOutsideClick: false,
        type: "success",
      }).then(async (res) => {
        if (res.value) {
          this.travelDataForPrint = [];
          this.travelDataForPrint = filteredRecordData;
          this.modalService.open(this.printModal, { size: "lg" });
        } else {
          await this.handleClaimModalClose();
        }
      });

    }
    console.log("TEST", this.claimForm.getRawValue());
  }

  async handleClaimModalClose() {
    await this.GetTravelClaimByEmpId();
    await this.getlocationDetails();
    this.OntotalCloseChanes();
    this.selectedItems = [];
    this.selectedTravelData = [];
    this.claimgrid.refresh();
  }

  // Separate validation function
  validateClaimForm() {
    const claimValue = this.claimForm.getRawValue();
    const empId = this.empForm.get("emp").value;
    console.log("Am herer to trst",claimValue);


    if (!empId) {
      return "Please select an employee";
    }
    if (!claimValue.vehicleType) {
      return "Please select vehicle type";
    }

    if (claimValue.calcType === "actual" && this.claimForm.invalid) {
      return "Please fill all required fields!";
    }

    if (
      claimValue.calcType === "actual" &&
      claimValue.actual_fuel_price <= 0
    ) {
      return "Fuel price should be greater than 0!";
    }

    if (
      claimValue.calcType === "actual" &&
      claimValue.actual_fuel_quantity <= 0
    ) {
      return "Fuel quantity should be greater than 0!";
    }

    if (
      (!claimValue.claim_id || claimValue.claim_id.trim() === "")
    ) {
      return "Please fill all required fields!";
    }
    console.log(this.maximumStringLength, this.maximumNumberLength, 'this.maximumStringLength,this.maximumNumberLength');
    if (claimValue.calcType === "actual") {
      let vehicleNumber = claimValue.vehicle_number;
      const maxVehicleNumberLength = this.maximumNumberLength;


      const vehicleNumberRegex = new RegExp(`^[0-9]{1,${maxVehicleNumberLength}}$`);

      if (!vehicleNumberRegex.test(vehicleNumber)) {
        return `Vehicle number must contain 1-${maxVehicleNumberLength} digits!`;
      }

      if(claimValue.vehicle_text=='Select Plate Code'){

      }
    }


    return null;
  }
  trimVehicleNumber(vehicleNumber) {
    // Trim and remove spaces
    return vehicleNumber ? vehicleNumber.replace(/\s+/g, "").trim() : "";
  }

  async handleSubmitTravelDispute(data) {
    if (data && data.id) {
      let formData = this.travelDispute.getRawValue();

      console.log("AM here to investicate",formData);

      let disputeData = [
        {
          old_val: data.updatedDistance,
          new_val: formData.new_val,
          remarks: formData.reasondesc,
          doc: formData.doc,
          travel_id: data.id,
          checkin_addr: data.checkin_formatted_address,
          checkout_addr: data.checkout_formatted_address,
          travel_created_date: data.created_date,
        },
      ];
      console.log(data, disputeData, "***");
      await this.submitTravelDispute(disputeData);
    }
  }

  async submitTravelDispute(data) {
    console.log(data, "***Dis");

    this.spinner.show();
    let selectedEmp = this.empForm.get("emp").value;
    let postData = {
      travel_dispute_data: data,
      status: "Pending",
      created_by: this.userInfo.full_name,
      modified_by: this.userInfo.full_name,
      approver1_roleId: null,
      approver2_roleId: null,
      approver1_emp_id: null,
      approver2_emp_id: null,
      is_approved_1: false,
      is_approved_2: false,
      org_id: this.userInfo.org_id,
      emp_id: selectedEmp,
    };

    if (!this.payrollSubmitFullAccess) {
      postData.approver1_roleId = this.payrollApprover1RoleId;
      if (this.isPayrollDualApprover) {
        postData.approver2_roleId = this.payrollApprover2RoleId;
      }
    }

    try {
      const response: any = await this.payrollService
        .AddTravelDisputeData(postData)
        .toPromise();
      if (response.status == 200) {
        await this.fetchTravelDisputeData();
        await this.getlocationDetails();
        this.toastr.success("Travel dispute submitted successfully");
      }
      console.log(response, "TEST");
    } catch (error) {
      console.error("Error submitting travel dispute:", error);
      alert("There was an issue submitting the travel dispute.");
    } finally {
      this.spinner.hide();
    }
  }
  async fetchTravelDisputeData() {
    this.spinner.show();
    await this.GetTravelDisputeByEmpId();
    this.spinner.hide();
    this.selectedTravelData = [];
    this.pendinggrid.refresh();
    this.grid.refresh();
  }
  async onDisputeAllSubmit() {
    let disputeData = this.disputeDetails.getRawValue();
    let filteredDisputeData = disputeData.filter((i) => i.selected);
    function validateDisputeDetails(disputeDetails: any[]): boolean {
      for (const dispute of disputeDetails) {
        if (!dispute.new_val || !dispute.doc || !dispute.remarks ) {
          return false;
        }
      }
      return true;
    }
    console.log(disputeData, filteredDisputeData, "***");
    if (filteredDisputeData.length > 0) {
      let selectedEmp = this.empForm.get("emp").value;
      let isValid = validateDisputeDetails(filteredDisputeData);
      if (isValid) {
        await this.submitTravelDispute(filteredDisputeData);
        $("#dispute_modal").modal("hide");
      } else {
        this.toastr.error("Please fill all the required fields");
      }
    }
  }
  async handleApproveDisputes() {
    let disputeData = this.disputeDetails.getRawValue();
    console.log(disputeData, "***");
    await this.approveTravelDispute(disputeData);
  }
  async approveTravelDispute(disputeDataArr) {
    console.log(this.selectedDisputeData, "this.selectedDisputeData");
    console.log(this.userInfo.role_id, this.userInfo, "this.userInfo.role_id");

    const data = this.selectedDisputeData;

    let postData = {
      travel_dispute_data: disputeDataArr,
      status: "Pending",
      created_by: data.created_by,
      modified_by: data.modified_by,
      approver1_roleId: data.approver1_roleId,
      approver2_roleId: data.approver2_roleId,
      approver1_emp_id: data.approver1_emp_id,
      approver2_emp_id: data.approver2_emp_id,
      is_approved_1: data.is_approved_1,
      is_approved_2: data.is_approved_2,
      org_id: data.org_id,
      emp_id: data.emp_id,
      approver_date2: data.approver_date2,
      approver_date1: data.approver_date1,
      dispute_id: data.dispute_id,
    };

    try {
      if (
        data.approver2_roleId === this.userInfo.role_id &&
        !data.is_approved_2 &&
        data.is_approved_1
      ) {
        postData = {
          ...postData,
          approver_date2: moment().format("L"),
          is_approved_2: true,
          approver2_emp_id: this.userInfo.id,
          status: "Approved",
        };
        await this.UpdateTravelDisputeData(postData);
      } else if (
        data.approver1_roleId === this.userInfo.role_id &&
        !data.is_approved_1
      ) {
        postData = {
          ...postData,
          approver_date1: moment().format("L"),
          is_approved_1: true,
          approver1_emp_id: this.userInfo.id,
          status: "Pending",
        };
        await this.UpdateTravelDisputeData(postData);
      } else if (this.payrollSubmitFullAccess) {
        postData = {
          ...postData,
          status: "Approved",
          is_approved_2: true,
          approver_date2: moment().format("L"),
          approver2_emp_id: this.userInfo.id,
        };
        await this.UpdateTravelDisputeData(postData);
      } else if (
        data.approver1_roleId === this.userInfo.role_id &&
        data.is_approved_1
      ) {
        this.toastr.warning("You have already approved this travel dispute!");
      } else {
        this.toastr.warning(
          "You don't have the permission for approving the travel dispute!"
        );
      }

      console.log(postData, "TEST");
    } catch (error) {
      console.error("Error in approval process:", error);
    }
  }

  async handleRejectDisputes() {
    let disputeData = this.disputeDetails.getRawValue();
    console.log(disputeData, "***");
    await this.rejectTravelDispute(disputeData);
  }
  async rejectTravelDispute(disputeDataArr) {
    const data = this.selectedDisputeData;
    console.log(data, "selectedDisputeData");
    if (
      this.payrollSubmitFullAccess ||
      data.approver1_roleId == this.userInfo.role_id ||
      data.approver2_roleId == this.userInfo.role_id
    ) {
      let postData = {
        travel_dispute_data: disputeDataArr,
        status: "Rejected",
        created_by: data.created_by,
        modified_by: this.userInfo.full_name,
        approver1_roleId: data.approver1_roleId,
        approver2_roleId: data.approver2_roleId,
        approver1_emp_id: data.approver1_emp_id,
        approver2_emp_id: data.approver2_emp_id,
        is_approved_1: data.is_approved_1,
        is_approved_2: data.is_approved_2,
        org_id: data.org_id,
        emp_id: data.emp_id,
        approver_date2: data.approver_date2,
        approver_date1: data.approver_date1,
        dispute_id: data.dispute_id,
      };
      if (data.approver1_roleId == this.userInfo.role_id) {
        postData.is_approved_1 = false;
      } else if (data.approver2_roleId == this.userInfo.role_id) {
        postData.is_approved_2 = false;
      }
      await this.UpdateTravelDisputeData(postData);
    }
  }
  async UpdateTravelDisputeData(postData: any) {
    this.spinner.show();
    try {
      const data: any = await this.payrollService
        .UpdateTravelDisputeData(postData)
        .toPromise();
      if (data.status == "200") {
        $("#dispute_modal").modal("hide");
        await this.fetchTravelDisputeData();
        this.toastr.success("Travel dispute updated successfully");
      }
      console.log(data, "TEST");
    } catch (error) {
      this.toastr.error("Error updating travel dispute data");
      console.error("Error updating travel dispute data:", error);
    } finally {
      this.spinner.hide();
    }
  }

  async handleDisputeAll() {
    let disputeData = this.filteredtravelData.filter(
      (item) =>
        item.pending === false && !item.disputeRaised && !item.claimRaised
    );
    console.log(
      disputeData,
      this.filteredtravelData,
      this.grid.dataSource,
      "etes"
    );
    console.log(disputeData, "TEST");

    this.disputeDetails.clear();
    this.is_submitted = false;
    if (disputeData.length > 0) {
      disputeData.forEach((elm) => {
        this.disputeDetails.push(
          this.formBuilder.group({
            travel_id: [elm.id, Validators.required],
            travel_created_date: [elm.created_date, Validators.required],
            checkin_addr: [elm.checkin_formatted_address, Validators.required],
            checkout_addr: [
              elm.checkout_formatted_address,
              Validators.required,
            ],
            old_val: [elm.updatedDistance, Validators.required],
            new_val: ["", Validators.required],
            doc: [""],
            remarks: [""],
            selected: [true],
          })
        );
      });
      this.selectAllDispute = true;
      console.log(disputeData, "***Dis");
      $("#dispute_modal").modal("show");
      console.log(this.disputeAllForm.getRawValue(), "***");
    } else {
      this.toastr.error("Please select at least one travel to raise a dispute");
    }
  }
  onDisputeSelectionChange(e, data) {
    const isChecked = (e.target as HTMLInputElement).checked;
    this.selectAllDispute = isChecked;
    this.disputeDetails.controls.forEach((group: FormGroup) => {
      group.get("selected").setValue(isChecked);
    });
    console.log(this.disputeDetails.value, "this.disputeDetails.value");
  }
  viewTravelDisputeData(data) {
    console.log(data, "CHECK");
    this.modalService.open(this.aprDisputeModal);
    this.disputeModalData = data;
  }

  apprTravelDisputeData(data) {
    console.log(data, "Appr CHECK");
    let disputeData = data.elements;
    this.selectedDisputeData = {
      group_id: "",
      elements: [],
      count: 0,
      created_date: "",
      status: "Pending",
      empName: "",
      created_by: "",
      modified_by: "",
      approver1_roleId: null,
      approver2_roleId: null,
      approver1_emp_id: null,
      approver2_emp_id: null,
      is_approved_1: false,
      is_approved_2: false,
      org_id: "",
      emp_id: "",
    };

    this.selectedDisputeData = data;
    this.disputeDetails.clear();
    this.is_submitted = true;
    if (disputeData.length > 0) {
      disputeData.forEach((elm) => {
        const formGroup = this.formBuilder.group({
          id: [elm.id],
          travel_created_date: [elm.created_date],
          checkin_addr: [elm.checkin_addr],
          checkout_addr: [elm.checkout_addr],
          old_val: [`${elm.old_val} km`],
          new_val: [`${elm.new_val} km`],
          doc: [elm.doc],
          remarks: [elm.remarks],
        });
        formGroup.disable();
        this.disputeDetails.push(formGroup);
      });
      console.log(disputeData, "***Dis");
      $("#dispute_modal").modal("show");
    }
  }
  selectedClaimId = ""
  viewClaimDetails(id) {
    this.selectedClaimId = id;
    let data = this.claimData.find((i) => i.id == id)
    console.log(data, "Claim CHECK");
    let claimData = data.elements;
    let matchAlphabets = data.vehicle_number.match(/^[A-Za-z]+/);
    let matchNumbers = data.vehicle_number.match(/\d+$/);

    let alphabets = matchAlphabets ? matchAlphabets[0] : "";
    let numbers = matchNumbers ? matchNumbers[0] : "";
    if (claimData.length > 0) {
      this.claimForm.reset();
      this.claimForm.patchValue({
        empName: data.emp_name,
        claim_id: data.claim_id,
        vehicleType: data.vehicle_type,
        emirate: data.emirate,
        fuel_pump: data.fuel_pump,
        vehicle_text:alphabets,
        vehicle_number: numbers,
        odometer: data.odometer,
        actual_fuel_Price: data.actual_fuel_price,
        actual_fuel_quantity: data.actual_fuel_quantity,
        calcType: data.calc_type,
        createdBy:data.created_by,
        createdDate:data.created_date
      });
      if (data.calc_type == "actual") {
        let res = this.splitDateTime(data.actual_fuel_date);
        this.claimForm.patchValue({
          date: res.date,
          time: res.time
        });
      } else {
        this.claimForm.patchValue({
          date: moment(data.created_date).format("DD-MM-YYYY") //data.created_date
        });
      }
      this.is_claimSubmitted = true;
      this.claimForm.disable();
      this.updateColumnVisibility();
      this.travelclaims(claimData);
    }
  }
  splitDateTime(dateTimeString: string) {
    const dateObj = new Date(dateTimeString);
    const date = moment(dateObj).format("DD-MM-YYYY");
    let hours = dateObj.getHours() % 12 || 12;
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const ampm = dateObj.getHours() >= 12 ? 'PM' : 'AM';
    return { date, time: `${hours}:${minutes} ${ampm}` };
  }
  updateColumnVisibility() {
    if (this.toClaimgrid) {
      const column = this.toClaimgrid.getColumnByField('selectClaim');
      column.visible = !this.is_claimSubmitted;
      this.toClaimgrid.refreshColumns();
    }
  }
  onFileSelectedForDispute(event, i) {
    console.log(event);
    let imageData = event.target.files[0];
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          this.disputeDetails.at(i).patchValue({ doc: imData.secure_url });
          this.spinner.hide();
        }
      });
    }
  }
  goToDisputeDocLink(i) {
    let url = this.disputeDetails.at(i).get("doc").value;
    if (url) {
      window.open(url, "_blank");
    }
  }

  disputeAllDelete(i) {
    this.disputeDetails.at(i).get("doc").setValue("");
    this.toastr.success("Document deleted successfully");
  }
  onFileSelectedForClaim(event, i) {
    console.log(event);
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          this.claimForm.patchValue({ document: imData.secure_url });
          this.spinner.hide();
        }
      });
    }
  }
  goToClaimLink() {
    let url = this.claimForm.get("document").value;
    if (url) {
      window.open(url, "_blank");
    }
  }
  deleteClaimDoc() {
    this.claimForm.get("document").setValue("");
  }
  public OnDisputeClose() {
    $("#dispute_modal").modal("hide");
  }
  selectedTravelData: any[] = [];
  onSelectionChange(e, data) {
    const isChecked = (e.target as HTMLInputElement).checked;

    if (isChecked) {
      if (!this.selectedTravelData.some((item) => item.id === data.id)) {
        this.selectedTravelData.push(data);
      }
    } else {
      this.selectedTravelData = this.selectedTravelData.filter(
        (item) => item.id !== data.id
      );
    }

    console.log(
      "Selected Item:",
      data,
      "Selected Disputes:",
      this.selectedTravelData,
      "Filtered Data:",
      this.filteredtravelData
    );
  }

  toggleSelectAll(e) {
    const isChecked = (e.target as HTMLInputElement).checked;

    this.filteredtravelData.forEach((elm) => {
      if (elm.disputeRaised) return;
      elm.dispute = isChecked;

      if (isChecked) {
        if (!this.selectedTravelData.some((item) => item.id === elm.id)) {
          this.selectedTravelData.push(elm);
        }
      } else {
        this.selectedTravelData = this.selectedTravelData.filter(
          (item) => item.id !== elm.id
        );
      }
    });

    this.selectAllDispute = isChecked;

    if (!isChecked) {
      this.selectedTravelData = [];
    }

    this.grid.refresh();
    console.log(
      "Select All Status:",
      this.selectAllDispute,
      "Selected Disputes:",
      this.selectedTravelData
    );
  }
  isDisputeSelected(id: string | number): boolean {
    return this.selectedTravelData.some((item) => item.id === id);
  }

  onFileSelected(event, data) {
    console.log(event);
    console.log(data);
    let id = data.id;
    let imageData = event.target.files[0];
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          // this.filteredtravelData.filter((elm) => {
          //   if (elm.id == id) {
          //     elm.isLeaveDocUp = true;
          //     elm.LeaveDocUrl = imData.secure_url;
          //   }
          // });
          // this.grid.refresh();
          this.travelDispute.patchValue({ doc: imData.secure_url });
          this.spinner.hide();
        }
      });
    }
  }

  goToLink(url: string): void {
    if (url) {
      window.open(url, "_blank");
    } else {
      console.error("Invalid document URL");
      this.toastr.warning("Invalid document URL");
    }
  }

  disputeDelete(data) {
    this.travelDispute.get("doc").setValue("");
    this.toastr.success("Document deleted successfully");
  }

  LeaveDocDelete(data) {
    // Clear the form control for the document URL
    this.travelDispute.get("doc").setValue("");
  }

  LeaveDocDeleteAll(data) {
    console.log(data);
    data.LeaveDocUrl = "";
    data.isLeaveDocUp = false;
    data.pending = false;
    this.grid.refresh();
  }

  onCheckboxChange(data) {
    this.selectedItems.map((elm) => {
      if (elm.id == data.id) {
        if (elm.selected == false) {
          elm.selected = true;
          // data.pending=true;
        } else if (elm.selected == true) {
          elm.selected = false;
          // data.pending=false;
        }
      }
    });
    this.UpdatedClaimTravelDistance();
    // this.travelclaims();
    console.log(this.filteredtravelData);
  }
  UpdatedClaimTravelDistance() {
    console.log(
      this.selectedItems.filter((i) => i.selected),
      "selectedItems"
    );
    let forClaimData = this.selectedItems.filter((i) => i.selected);
    if (forClaimData.length > 0) {
      let totalDistance = forClaimData.reduce(
        (sum, i) => sum + (parseFloat(i.updatedDistance) || 0),
        0
      );
      const formattedDistance = totalDistance.toFixed(2);
      this.claimForm.patchValue({
        totalDistance: formattedDistance + " km",
      });
    }
  }
  prevClaimData = [];
  async GetLastAddedTravelClaimByVehicleNumber() {
    let postData = {
      vehicle_number: this.claimForm.get("vehicle_number").value,
      org_id: this.userInfo.org_id,
    };
    this.prevClaimData = [];

    try {
      const claimData: any = await this.payrollService
        .GetLastAddedTravelClaimByVehicleNumber(postData)
        .toPromise();
      console.log(claimData, "Prev claimData");
      if (claimData.length > 0) {
        this.prevClaimData = claimData;
        return claimData[0];
      }
    } catch (error) {
      console.error("Error fetching travel claim data:", error);
    }
  }
  async fetchTravelClaimData() {
    this.spinner.show();
    try {
      let value = this.claimForm.getRawValue();
      let selectedEmp = this.empForm.get("emp").value;
      let startDate = "";
      let endDate = "";

      if (value.vehicleType == "Company Car") {
        if (value.time == null || value.time == "") {
          this.toastr.error(
            "Please select the time when the vehicle was refueled."
          );
          this.spinner.hide();
        }
        let prevClaimData = await this.GetLastAddedTravelClaimByVehicleNumber();
        let prevClaimDate = "2025-01-01";
        if (prevClaimData) {
          prevClaimDate = prevClaimData.actual_fuel_date
            ? moment(prevClaimData.actual_fuel_date).format("YYYY-MM-DD")
            : "2025-01-01";
        }

        startDate = prevClaimDate + "T00:00:00";
        endDate =
          moment(value.date).format("YYYY-MM-DD") +
          "T" +
          moment(value.time, "hh:mm A").format("HH:mm:ss");
      } else {
        startDate =
          moment(value.dateRange[0]).format("YYYY-MM-DD") + "T00:00:00";
        endDate = moment(value.dateRange[1]).format("YYYY-MM-DD") + "T23:59:59";
      }

      const sendData = {
        id: selectedEmp,
        fromDate: startDate,
        toDate: endDate,
      };

      const data = await this.EmployeeLocationByEmpIDAndDate(sendData);

      const selectedItems = data.filter(
        (item) =>
          // Check if addresses are not null/empty and distance is greater than 1
          ((item.checkout_formatted_address != null || item.checkin_formatted_address != null) &&
            item.checkout_formatted_address !== '' &&
            item.checkin_formatted_address !== '' &&
            parseFloat(item.updatedDistance)) &&

          // Check if pending is false, no dispute, and no claim raised
          item.pending === false && !item.disputeRaised && !item.claimRaised
      );


      if (selectedItems.length > 0) {
        this.is_claimSubmitted = false;
        this.travelclaims(selectedItems);
      } else {
        this.toastr.error("Sorry, no available travel data to claim.");
      }
    } catch (error) {
      console.error(
        "Error fetching travel claim data:",
        error.message || error
      );
      this.toastr.error("An error occurred while fetching travel claim data.");
    } finally {
      this.spinner.hide();
    }
  }

  async handleTravelClaim() {
    // let selectedItems = this.filteredtravelData.filter(
    //   (item) =>
    //     item.pending === false && !item.disputeRaised && !item.claimRaised
    // );
    // if (selectedItems.length > 0) {
    //   this.is_claimSubmitted = false;
    //   this.travelclaims(selectedItems);
    // } else {
    //   this.toastr.error("Please select at least one travel to claim.");
    // }

    let prefix = await this.GetTravelClaimPrefixByOrgID();
    await this.GetFuelStationBrandsByOrgId();
    await this.getTravelVehicleConfigByOrgId();
    this.selectedItems = [];
    this.is_claimSubmitted = false;
    this.updateColumnVisibility();
    console.log(prefix, "prefix!");
    this.claimForm.reset();
    const empName = this.empForm.get("empName").value;
    this.claimForm.enable();
    this.claimForm.patchValue({ empName: empName, claim_id: prefix,createdBy: this.userInfo.full_name,createdDate:this.today });

    $("#claim_modal").modal("show");
  }

  travelclaims(selectedItems) {
    this.totalkms = 0;
    try {
      this.selectedItems = selectedItems;
      selectedItems.forEach((elm) => {
        const distanceValue = parseFloat(elm.updatedDistance);
        if (!isNaN(distanceValue)) {
          this.totalkms += distanceValue;
        } else {
          console.warn(`Invalid distance value for travel item: ${elm.id}`);
        }
        elm.selected = true;
      });
      this.selectAllClaims = true;

      this.totalkms = parseFloat(this.totalkms.toFixed(2));
      this.claimForm.patchValue({
        totalDistance: this.totalkms + " km",
      });

      console.log("Total KM:", this.totalkms);
      console.log(this.claimForm.value, "claimForm");
      $("#claim_modal").modal("show");

      this.grid.refresh();
    } catch (error) {
      console.error("Error while processing travel claims:", error);
      this.toastr.error("An error occurred while processing travel claims.");
    }
  }
  onClaimSelectionChange(e) {
    const isChecked = (e.target as HTMLInputElement).checked;
    console.log(isChecked, "TEST");
    this.selectAllClaims = isChecked;
    this.selectedItems.forEach((i) => (i.selected = isChecked));
    this.toClaimgrid.refresh();
    console.log(this.selectedItems, "this.selectedItems");
  }

  checkUserRights() {
    console.log(this.isAccountOwner, "CHECK ACC OWNER");
    if (this.isAccountOwner) {
      this.payrollSubmitFullAccess = true;
    } else {
      this.userService
        .GetAccessRightsbyRole({ id: this.userInfo.role_id })
        .subscribe((data: any) => {
          if (data) {
            console.log(data, "CHECKING DATA");
            data.map((item) => {
              item.module_name = item.module_name.replace(/\s+/g, "");
              return item;
            });
            this.commonModuleName = _.groupBy(data, "module_name");
            console.log(this.commonModuleName);
            if (this.commonModuleName.Payroll) {
              this.PayrollModuleID = this.commonModuleName.Payroll[0].id;
              this.commonModuleName.Payroll.map((elm) => {
                if (elm.section_name === "Create and Modify Payroll Payments") {
                  if (elm.is_allow === true) {
                    this.createPayrollSectionName = elm.section_name;
                  }
                }
                if (elm.section_name === "View PayRoll") {
                  if (elm.is_allow === true) {
                  }
                }
              });
              this.checkPayrollApprover(this.userInfo.role_id);
            }
          }
        });
    }
  }
  checkPayrollApprover(role_id) {
    let postData = {
      roleID: role_id,
      moduleID: this.PayrollModuleID,
    };
    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe((data: any) => {
      //add edit
      data.map((elm) => {
        if (elm.section_name === this.createPayrollSectionName) {
          console.log(elm);
          if (elm.is_full_access) {
            this.payrollSubmitFullAccess = true;
          } else {
            this.payrollSubmitFullAccess = false;
            if (elm.approver1_roleId !== null) {
              this.payrollApprover1RoleId = elm.approver1_roleId;
              this.payrollApprover1RoleName = elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.isPayrollDualApprover = true;
                this.payrollApprover2RoleId = elm.approver2_roleId;
                this.payrollApprover2RoleName = elm.approver2_role_name;
              }
            }
          }
        }
      });
    });
  }

  // getUserTravelHistory(){
  //   this.spinner.show();
  //   let postData = {
  //     "empID": this.employeeID,
  //     "startDate": this.sendDateStart,
  //     "endDate": this.sendDateEnd
  //   }
  //   this.timesheetService.GetLatLongDataByEmpIDAndDate(postData).subscribe((data:any)  => {
  //     let serverData = [];
  //     data.map((elm) => {
  //       if(elm.lang !== '' && elm.lat !== ''){
  //         serverData.push(elm)
  //       }
  //     });
  //     let result = _(serverData)
  //     .groupBy(x => x.created_date)
  //     .map((value, key) => ({ data: value }))
  //     .value();

  //   console.log('formated result---->',result);

  //   let tempArr = [];
  //   result.map((elem)=>{
  //       let rwObj = {};
  //       rwObj['created_date'] = elem.data[0].created_date;
  //       rwObj['TravelClaimTrack'] = elem.data;
  //       tempArr.push(rwObj);
  //   })

  //   this.NewUserData = tempArr;
  //   this.NewUserData.map((elm) => {
  //     let getServerLatLongValue = elm.TravelClaimTrack;
  //     let selectedLatLongValue = [];
  //     getServerLatLongValue.map((elm) => {
  //       selectedLatLongValue.push({lat: Number(elm.lat), long: Number(elm.lang)})
  //     });
  //     for(let i=0; i < selectedLatLongValue.length; i++){
  //       if(i == selectedLatLongValue.length - 1) {
  //           break;
  //       }
  //       let spot1 = new google.maps.LatLng(selectedLatLongValue[i].lat ,selectedLatLongValue[i].long);
  //       let spot2 = new google.maps.LatLng(selectedLatLongValue[i+1].lat ,selectedLatLongValue[i+1].long);
  //       let total = Math.round(google.maps.geometry.spherical.computeDistanceBetween (spot1, spot2) / 1000);
  //       this.totalDistance2.push(total);
  //       console.log(this.totalDistance2)
  //     }
  //     let total2 = this.totalDistance2.reduce((a, b) => a + b, 0);
  //     elm["distance"] = total2;
  //     this.totalDistance2 = [];
  //   })
  //   console.log(this.NewUserData)
  //   this.spinner.hide();
  //   })
  // }

  public MapModal(data: any, locationArray: any[]): void {
    console.log(data, locationArray);
    if (
      !data ||
      typeof data.created_date === "undefined" ||
      typeof data.updatedDistance === "undefined"
    ) {
      console.error(
        "Invalid data provided. 'created_date' and 'updatedDistance' are required."
      );
      return;
    }

    if (!Array.isArray(locationArray) || locationArray.length === 0) {
      console.error(
        "Invalid locationArray provided. It should be a non-empty array."
      );
      return;
    }

    this.selectedLatLong = [];
    this.start_end_mark = [];
    $("#map_modal").modal("show");
    this.selectedDateModel = data.created_date;
    this.selectedKmModel = data.updatedDistance;
    this.selectLocationArray = locationArray;
    this.selectLocationArray.forEach((elm) => {
      if (elm.lat && elm.lang) {
        this.selectedLatLong.push([Number(elm.lat), Number(elm.lang)]);
      } else {
        console.warn("Invalid location detected in locationArray:", elm);
      }
    });

    if (this.selectedLatLong.length === 0) {
      console.error(
        "No valid latitude/longitude pairs found in locationArray."
      );
      return;
    }

    this.start_end_mark.push(this.selectedLatLong[0]);
    this.start_end_mark.push(
      this.selectedLatLong[this.selectedLatLong.length - 1]
    );
    this.lat = this.selectedLatLong[0][0];
    this.lng = this.selectedLatLong[this.selectedLatLong.length - 1][1];
    this.zoom = 10;
  }

  onScreenFun(locationArray) {
    console.log(locationArray, "locationarray");
    this.selectLocationArray2 = locationArray.travelClaimTrack;
    this.selectLocationArray2.map((elm) => {
      this.selectedLatLong2.push({
        lat: Number(elm.lat),
        long: Number(elm.lang),
      });
    });
    this.getDistanceReal(this.selectedLatLong2);
  }

  public OnClose() {
    $("#map_modal").modal("hide");
    this.mapCloseBtn.nativeElement.click();
    this.selectLocationArray = [];
    this.start_end_mark = [];
  }

  public OnCloseChanes() {
    $("#distance_modal").modal("hide");
  }

  public OntotalCloseChanes() {
    $("#claim_modal").modal("hide");
  }

  public OnCloseStatusModal() {
    $("#task_status_modal").modal("hide");
    this.statusCloseBtn.nativeElement.click();
  }

  toolbarClick(args: ClickEventArgs): void {
    switch (args.item.text) {
      case "PDF Export":
        this.grid.pdfExport();
        break;
      case "Excel Export":
        this.grid.excelExport();
        break;
      case "CSV Export":
        this.grid.csvExport();
        break;
    }
  }
  claimToolbarClick(args: ClickEventArgs): void {
    switch (args.item.text) {
      case "PDF Export":
        this.toClaimgrid.pdfExport();
        break;
      case "Excel Export":
        this.toClaimgrid.excelExport();
        break;
      case "CSV Export":
        this.toClaimgrid.csvExport();
        break;
    }
  }
  async viewTravel() {
    let selectedEmp = this.empForm.get("emp").value;

    if (selectedEmp != null && selectedEmp != "") {
      if (
        this.sendDateStart != "" &&
        this.sendDateStart != null &&
        this.sendDateEnd != "" &&
        this.sendDateEnd != null
      ) {
        await this.GetTravelClaimByEmpId();
        await this.getlocationDetails();
      } else {
        this.toastr.error("Please select a range");
      }
    } else {
      this.toastr.error("Please select an employee");
    }
  }
  async EmployeeLocationByEmpIDAndDate(sendData) {
    try {
      const data: any = await this.employeeService
        .EmployeeLocationByEmpIDAndDate(sendData)
        .toPromise();

      if (!data || data.length === 0) {
        return [];
      }

      return data
        .filter((elm: any) => {
          return (
            !isNaN(parseInt(elm.updatedDistance, 10)) &&
            !isNaN(parseFloat(elm.checkin_lat)) &&
            !isNaN(parseFloat(elm.checkin_lang)) &&
            !isNaN(parseFloat(elm.checkout_lat)) &&
            !isNaN(parseFloat(elm.checkout_lang))
          );
        })
        .map((item: any) => ({
          ...item,
          selected: false,
          dispute: false,
          disputeButtonDisabled: false,
          isLeaveDocUp: false,
          LeaveDocUrl: "",
          pending: false,
        }));
    } catch (error) {
      console.error("Error fetching location details:", error.message || error);
      return [];
    }
  }

  async getlocationDetails() {
    this.spinner.show();
    const selectedEmp = this.empForm.get("emp").value;
    const sendData = {
      id: selectedEmp,
      fromDate: this.sendDateStart + "T00:00:00",
      toDate: this.sendDateEnd + "T23:59:59",
    };
    let claimData = [];
    let disputeData = [];
    try {
      const filteredData = await this.EmployeeLocationByEmpIDAndDate(sendData);

      if (!filteredData.length) {
        this.filteredtravelData = [];
        this.originalTravedata = [];
        return;
      }

      console.log(filteredData, "filteredData");
      // this.filteredtravelData = filteredData.filter(item =>
      //   (item.checkout_formatted_address != null || item.checkin_formatted_address != null) &&
      //   item.checkout_formatted_address !== '' &&
      //   item.checkin_formatted_address !== '' &&
      //   parseFloat(item.updatedDistance) > 1
      // );
      this.filteredtravelData=filteredData.filter(data => data.checkin_formatted_address != "");
      let new_data = filteredData.filter(data => data.checkin_formatted_address == "")
      console.log(new_data, "lrtss testtss")

      console.log(this.filteredtravelData, "This.filteredtravelData")
      this.originalTravedata = [...this.filteredtravelData];
    } catch (error) {
      console.error("Error fetching location details:", error);
    } finally {
      console.log(this.filteredtravelData, "filetered");
      console.log(claimData, "claimData");
      console.log(disputeData, "disputeData");
      this.spinner.hide();
    }
  }

  async GetTravelDisputeByEmpId() {
    this.disputeData = [];
    this.pendingDisputeData = [];
    let is_admin = this.userInfo.is_admin;

    try {
      let postData = {
        id: is_admin ? this.userInfo.org_id == null ? localStorage.getItem("org_id").toString() : this.userInfo.org_id : this.userInfo.id,
        fromDate: this.sendDateStart,
        toDate: this.sendDateEnd,
      };

      const disputeData: any = is_admin
        ? await this.payrollService.GetTravelDisputeByOrgId(postData).toPromise()
        : await this.payrollService.GetTravelDisputeByEmpId(postData).toPromise();


      if (disputeData.length > 0) {
        this.disputeData = disputeData
          .filter((dispute) => dispute.status !== "Pending")
          .map((dispute) => ({
            ...dispute,
            empName: dispute.emp_name,
          }));

        this.pendingDisputeData = this.reduceDisputeArr(disputeData);

        console.log(this.pendingDisputeData, "pendingDisputeData");
        console.log(this.disputeData, "Updated disputeData with empName");
      }

    } catch (error) {
      console.error("Error fetching travel dispute data:", error);
    }
  }

  reduceDisputeArr(arr) {
    let map = new Map();

    arr.forEach((elm) => {
      if (elm.status === "Pending") {
        if (map.has(elm.dispute_id)) {
          map.set(elm.dispute_id, [...map.get(elm.dispute_id), elm]);
        } else {
          map.set(elm.dispute_id, [elm]);
        }
      }
    });

    return Array.from(map, ([group_id, elements]) => {
      const firstElement = elements[0];
      const empName = firstElement.emp_name
      console.log(empName, "empNameTest");
      return {
        group_id: group_id,
        elements: elements,
        count: elements.length,
        created_date: firstElement.created_date,
        status: "Pending",
        empName: empName,
        created_by: firstElement.created_by,
        modified_by: firstElement.modified_by,
        approver1_roleId: firstElement.approver1_roleId,
        approver2_roleId: firstElement.approver2_roleId,
        approver1_emp_id: firstElement.approver1_emp_id,
        approver2_emp_id: firstElement.approver2_emp_id,
        is_approved_1: firstElement.is_approved_1,
        is_approved_2: firstElement.is_approved_2,
        org_id: firstElement.org_id,
      };
    });
  }

  reduceTravelClaimArr(arr) {
    console.log(arr, "CLAIM ARR")
    let map = new Map();

    arr.forEach((elm) => {
      if (map.has(elm.travel_claim_id)) {
        map.set(elm.travel_claim_id, [...map.get(elm.travel_claim_id), elm]);
      } else {
        map.set(elm.travel_claim_id, [elm]);
      }
    });

    return Array.from(map, ([travel_claim_id, elements]) => {
      const firstElement = elements[0];
      const empName = firstElement.emp_name
      return {
        travel_claim_id: travel_claim_id,
        elements: elements,
        count: elements.length,
        created_date: firstElement.created_date,
        status: firstElement.status || "Pending",
        empName: empName,
        created_by: firstElement.created_by,
        modified_by: firstElement.modified_by,
        approver1_roleId: firstElement.approver1_roleId,
        approver2_roleId: firstElement.approver2_roleId,
        approver1_emp_id: firstElement.approver1_emp_id,
        approver2_emp_id: firstElement.approver2_emp_id,
        is_approved_1: firstElement.is_approved_1,
        is_approved_2: firstElement.is_approved_2,
        org_id: firstElement.org_id,
        updatedDistance: firstElement.updatedDistance,
        travel_created_date: firstElement.travel_created_date,
        remarks: firstElement.remarks || "No remarks",
        claim_id: firstElement.claim_id,
        emirate: firstElement.emirate,
        fuel_pump: firstElement.fuel_pump,
        vehicle_type: firstElement.vehicle_type,
        vehicle_number: firstElement.vehicle_number,
        odometer: firstElement.odometer,
        actual_fuel_quantity: firstElement.actual_fuel_quantity,
        actual_fuel_price: firstElement.actual_fuel_price * firstElement.actual_fuel_quantity,
        calc_type: firstElement.calc_type,
        actual_fuel_date: firstElement.actual_fuel_date
      };
    });
  }

  async GetTravelClaimByEmpId() {
    let selectedEmp = this.empForm.get("emp").value;
    const postData = {
      id: selectedEmp,
      fromDate: this.sendDateStart,
      toDate: this.sendDateEnd,
    };

    const is_admin = this.userInfo.is_admin;
    const empName = this.empForm.get("empName").value;

    console.log(empName, "empName");
    this.claimData = [];

    try {
      if (is_admin) {
        postData.id = this.userInfo.org_id == null ? localStorage.getItem("org_id").toString() : this.userInfo.org_id
      }

      const claimData: any = await (is_admin
        ? this.payrollService.GetTravelClaimByOrgId(postData).toPromise()
        : this.payrollService.GetTravelClaimByEmpId(postData).toPromise());

      console.log(claimData, "claimData TEST");

      if (claimData.length > 0) {
        // this.claimData = claimData.map((claim) => ({
        //   ...claim,
        //   elements: JSON.parse(claim.elements),
        // }));

        const updatedClaimData = this.processClaimData(claimData);

        // this.claimData = this.reduceTravelClaimArr(updatedClaimData);
        this.claimData = updatedClaimData;
        console.log(this.claimData, "Updated claimData with empName");
      }
    } catch (error) {
      console.error("Error fetching travel claim data:", error);
    }
  }

  processClaimData(claimData) {
    return claimData.map((claim) => ({
      ...claim,
      elements: (typeof claim.elements === "string" ? JSON.parse(claim.elements) : claim.elements).map((element) => ({
        ...element,
        updatedDistance: element.distance ? parseFloat(element.distance).toFixed(2) : "0.00",
        empName: element.emp_name,
        checkout_formatted_address: element.checkout_addr || "",
        checkin_formatted_address: element.checkin_addr || "",
      })),
      // count: claim.elements.length
    }));
  }



  onTabChange(e) {
    console.log(e, "CHECK");
    this.filteredDisputeData = [];

    if (e.index != null) {
      this.activeTab = this.newTeamData[e.index].text;
      this.activeTabIndex = e.index;
      if (e.index == 3 || e.index == 4) {
        if (e.index == 3) {
          this.filteredDisputeData = this.disputeData.filter(
            (i) => i.status == "Rejected"
          );
        } else if (e.index == 4) {
          this.filteredDisputeData = this.disputeData.filter(
            (i) => i.status == "Approved"
          );
        }
        console.log(this.filteredDisputeData, "TEST");
      }
    }
  }
  getDistanceReal(arrayVal) {
    for (let i = 0; i < arrayVal.length; i++) {
      if (i == arrayVal.length - 1) {
        break;
      }
      let spot1 = new google.maps.LatLng(arrayVal[i].lat, arrayVal[i].long);
      let spot2 = new google.maps.LatLng(
        arrayVal[i + 1].lat,
        arrayVal[i + 1].long
      );
      let total = Math.round(
        google.maps.geometry.spherical.computeDistanceBetween(spot1, spot2) /
        1000
      );
      this.totalDistance2.push(total);
      console.log(this.totalDistance2);
    }

    let total2 = this.totalDistance2.reduce((a, b) => a + b, 0);
    console.log(total2);
  }

  changetravelclaim(event) {
    console.log(event.tab);
    if (event.tab.textLabel == "Travel Log") {
      this.filteredtravelData = this.originalTravedata;
      // this.filteredtravelData=this.filteredtravelData.filter((elm) => {
      //   return elm.pending === false; // Keep only elements where elm.pending is true
      // });
      this.grid.refresh();
    } else if (event.tab.textLabel == "Pending") {
      this.filteredtravelData = this.originalTravedata;
      // this.filteredtravelData=this.filteredtravelData.filter((elm) => {
      //   return elm.pending === true;
      // // Keep only elements where elm.pending is true
      // });
      this.filteredtravelData.map((res) => {
        res.isLeaveDocUp = false;
        res.disputeButtonDisabled = false;
      });

      this.grid.refresh();
    } else if (event.textLabel == "Rejected") {
    }
  }

  is_admin = false;

  async getEmployeeList() {
    try {

      this.empDelData = [];
    this.isEmpDelLoading = true;

      let user={};
      let user_id ;
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }

    const data: any = await this.empService.getEmployeeByOrgId().toPromise();
      console.log(data, "data");

      if (data && data.length > 0) {
        console.log(data, "testign data...")
        if(user['role_id'] === 'd3a0a34f-802b-47ca-886a-135da7929f6a' || user['role_id'] === 'e0640ea6-4fb4-4be2-ab25-74745fa4e6c0' || user['role_id'] === '23da095c-5a52-4c64-8351-483172ebef87'){
          this.is_admin = true
          data.forEach((element) => {
            this.empDelData.push({
              id:element.id,
              text: element.full_name,
            })
          })
          this.isEmpDelLoading = false;
        } else {

          this.is_admin = false
          this.empForm.patchValue({
            emp: user['id'],
            empName: user['full_name']
          });


        this.isEmpDelLoading = false;

        console.log(this.empForm.get('empName').value, "employeeee......")

        }

      }

    } catch (error) {
      console.error("Error fetching employees:", error);
    }


  }

  // onChange(e: any) {
  //   const selectedEmp = e;
  //   const emp = this.empDelData.find((i) => i.id === selectedEmp);
  //   const empName = emp ? emp.text : "";
  //   this.empForm.patchValue({
  //     emp: selectedEmp,
  //     empName: empName
  //   });

  // }


    // console.log("GETTING CALLED");

    // this.empDelData = [];
    // this.isEmpDelLoading = true;
    // try {
    //   const data: any = await this.empService.getEmployeeByOrgId().toPromise();
    //   console.log(data, "data");

    //   if (data && data.length > 0) {
    //     data.forEach((element) => {
    //       this.empDelData.push({
    //         id: element.id,
    //         text: element.full_name,
    //       });
    //     });
    //   }
    //   this.isEmpDelLoading = false;
    // } catch (error) {
    //   console.error("Error fetching employees:", error);
    //}
  //}


  closeModal() {
    this.modalService.dismissAll();
  }
  onValueChange(e: any) {
    console.log(e, "TEST");
    const selectedEmp = e.value;
    const emp = this.empDelData.find((i) => i.id === selectedEmp);
    const empName = emp ? emp.text : "";
    this.empForm.patchValue({
      emp: selectedEmp,
      empName: empName,
    });

    console.log(selectedEmp, "****");
  }
  onVehicleValueChange(e: any) {
    console.log(e, "TEST");
    const selectedVal = e.data[0].text;
    this.claimForm.patchValue({
      vehicleType: selectedVal,
      calcType: e.data[0].calc_type
    });

    console.log(selectedVal, "****");
  }
  onEmirateValueChange(e: any) {
    console.log(e, "TEST");
    const selectedVal = e.data[0].text;
    this.updateDropdown(selectedVal);
    this.claimForm.patchValue({
      emirate: selectedVal,
    });

    console.log(selectedVal, "****");
  }
  onPlateCodeValueChange(e: any) {
    console.log(e, "TEST");
    const selectedVal = e.data[0].text;
    this.claimForm.patchValue({
      vehicle_text: selectedVal,
    });

    console.log(selectedVal, "****");
  }


  onfuelStationValueChange(e: any) {
    console.log(e, "TEST");
    const selectedVal = e.data[0].text;
    this.claimForm.patchValue({
      fuel_pump: selectedVal,
    });

    console.log(selectedVal, "****");
  }
  onPlateCategoryValueChange(e:any){
    const selectedVal = e.data[0].text;
    this.claimForm.patchValue({
      plate_category: selectedVal,
    });

    console.log(selectedVal, "****");
  }
  companyCarDesc = "";
  personalCarDesc = "";
  async getTravelSettings() {
    try {
      const res: any = await this.payrollService
        .GetTravelSettingByOrgId({ id: this.userInfo.org_id })
        .toPromise();

      this.companyCarDesc = "";
      this.personalCarDesc = "";

      this.VehicleType = [];

      if (Array.isArray(res) && res.length > 0) {
        this.VehicleType = [
          { id: 0, text: "Select Vehicle Type" },
          ...res.map((elm) => {
            if (elm.vehicle_type === "Company Car") {
              this.companyCarDesc = elm.calc_type === "fixed"
                ? `The preset fuel price of ${elm.fuel_cost} AED and fuel economy of ${elm.fuel_efficiency} km/l is used to calculate the claim.`
                : "The fuel price and distance provided by the user are used to calculate the claim based on fuel economy.";
            } else if (elm.vehicle_type === "Personal Car") {
              this.personalCarDesc = `The preset price of ${elm.fuel_cost} AED per KM is used to calculate the claim.`;
            }

            return { id: elm.id, text: elm.vehicle_type, ...elm };
          }),
        ];
      } else {
        console.error("No travel settings found for the organization");
      }

      console.log(this.VehicleType, "VehicleType");
      console.log(this.companyCarDesc, "companyCarDesc");
      console.log(this.personalCarDesc, "personalCarDesc");

    } catch (err) {
      console.error("Error fetching travel settings:", err);
    }
  }

  applyTimePickerStyle() {
    const timePicker: any = document.querySelector("ngx-material-timepicker"); // Select the timepicker DOM
    if (timePicker) {
      timePicker.style.visibility = "hidden"; // Hide temporarily to apply styles
      setTimeout(() => {
        timePicker.style.visibility = "visible"; // Show after styles have been applied
      }, 10);
    }
  }

  public jobNo = "000";
  public prefixString = "";
  showPrefixText = false;
  public prefix_for = "";
  public async GetTravelClaimPrefixByOrgID() {
    try {
      // Fetch last added travel claim prefix
      const data: any = await this.payrollService
        .GetLastAddedTravelClaimPrefixByOrgID({ ID: this.userInfo.org_id })
        .toPromise();

      if (data.code == "") {
        // Fetch all prefixes
        const prefixes: any = await this.projectService
          .GetAllPrefixByOrgID()
          .toPromise();

        for (let prefix of prefixes) {
          if (prefix.type === "travel-claim") {
            if (prefix.prefix_for === "Default") {
              if (prefix.prefix_name) {
                const splittable = prefix.prefix_name.split("/");
                this.prefixString = `${splittable[0]}/${moment().format(
                  "YY"
                )}/${moment().format("MM")}/0001`;
                this.prefix_for = prefix.prefix_for;
                return this.prefixString;
              }
            } else if (prefix.prefix_for === "Custom") {
              this.showPrefixText = true;
            } else if (prefix.prefix_for === "Sequence") {
              if (prefix.prefix_name) {
                const splittable = prefix.prefix_name.split("/");
                this.prefixString = `${splittable[0]}/001`;
                this.prefix_for = prefix.prefix_for;
                return this.prefixString;
              }
            } else if (prefix.prefix_for === "random") {
              if (prefix.prefix_name) {
                const splittable = prefix.prefix_name.split("/");
                const random = Math.floor(1000 + Math.random() * 9000);
                this.prefixString = `${splittable[0]}/${random}`;
                this.prefix_for = prefix.prefix_for;
                return this.prefixString;
              }
            }
          }
        }
      } else {
        let lastAddedPrefix = data.code;

        let lastPrefixNumber =
          parseInt(lastAddedPrefix.split("/").pop() || "0", 10) + 1;

        // Fetch all prefixes
        const prefixes: any = await this.projectService
          .GetAllPrefixByOrgID()
          .toPromise();

        for (let prefix of prefixes) {
          if (prefix.type === "travel-claim") {
            if (prefix.prefix_for === "Default") {
              if (prefix.prefix_name) {
                const splittable = prefix.prefix_name.split("/");
                this.prefixString = `${splittable[0]}/${moment().format(
                  "YY"
                )}/${moment().format("MM")}/${lastPrefixNumber
                  .toString()
                  .padStart(4, "0")}`;
                this.prefix_for = prefix.prefix_for;
                return this.prefixString;
              }
            } else if (prefix.prefix_for === "Custom") {
              this.showPrefixText = true;
            } else if (prefix.prefix_for === "Sequence") {
              if (prefix.prefix_name) {
                const splittable = prefix.prefix_name.split("/");
                this.prefixString = `${splittable[0]}/${lastPrefixNumber
                  .toString()
                  .padStart(3, "0")}`;
                this.prefix_for = prefix.prefix_for;
                return this.prefixString;
              }
            } else if (prefix.prefix_for === "random") {
              const splittable = prefix.prefix_name.split("/");
              const random = Math.floor(1000 + Math.random() * 9000);
              this.prefixString = `${splittable[0]}/${random}`;
              this.prefix_for = prefix.prefix_for;
              return this.prefixString;
            }
          }
        }
      }
    } catch (error) {
      Swal.fire("Error!", error, "error").then(() => { });
    }
    console.log(this.prefixString, "prefixString");
    return this.prefixString;
  }

  // public jobNo = "000";
  public wePrefixString = "";
  // showPrefixText = false;
  // public prefix_for = "";
  public async GetWorkExpensesPrefixByOrgID() {
    try {
      // Fetch last added travel claim prefix
      const data: any = await this.payrollService
        .GetLastAddedWorkExpensesPrefixByOrgID({ ID: this.userInfo.org_id })
        .toPromise();

      if (data.code == "") {
        // Fetch all prefixes
        const prefixes: any = await this.projectService
          .GetAllPrefixByOrgID()
          .toPromise();

        for (let prefix of prefixes) {
          if (prefix.type === "we") {
            if (prefix.prefix_for === "Default") {
              if (prefix.prefix_name) {
                const splittable = prefix.prefix_name.split("/");
                this.wePrefixString = `${splittable[0]}/${moment().format(
                  "YY"
                )}/${moment().format("MM")}/0001`;
                this.prefix_for = prefix.prefix_for;
                return this.wePrefixString;
              }
            } else if (prefix.prefix_for === "Custom") {
              this.showPrefixText = true;
            } else if (prefix.prefix_for === "Sequence") {
              if (prefix.prefix_name) {
                const splittable = prefix.prefix_name.split("/");
                this.wePrefixString = `${splittable[0]}/001`;
                this.prefix_for = prefix.prefix_for;
                return this.wePrefixString;
              }
            } else if (prefix.prefix_for === "random") {
              if (prefix.prefix_name) {
                const splittable = prefix.prefix_name.split("/");
                const random = Math.floor(1000 + Math.random() * 9000);
                this.wePrefixString = `${splittable[0]}/${random}`;
                this.prefix_for = prefix.prefix_for;
                return this.wePrefixString;
              }
            }
          }
        }
      } else {
        let lastAddedPrefix = data.code;

        let lastPrefixNumber =
          parseInt(lastAddedPrefix.split("/").pop() || "0", 10) + 1;

        // Fetch all prefixes
        const prefixes: any = await this.projectService
          .GetAllPrefixByOrgID()
          .toPromise();

        for (let prefix of prefixes) {
          if (prefix.type === "we") {
            if (prefix.prefix_for === "Default") {
              if (prefix.prefix_name) {
                const splittable = prefix.prefix_name.split("/");
                this.wePrefixString = `${splittable[0]}/${moment().format(
                  "YY"
                )}/${moment().format("MM")}/${lastPrefixNumber
                  .toString()
                  .padStart(4, "0")}`;
                this.prefix_for = prefix.prefix_for;
                return this.wePrefixString;
              }
            } else if (prefix.prefix_for === "Custom") {
              this.showPrefixText = true;
            } else if (prefix.prefix_for === "Sequence") {
              if (prefix.prefix_name) {
                const splittable = prefix.prefix_name.split("/");
                this.wePrefixString = `${splittable[0]}/${lastPrefixNumber
                  .toString()
                  .padStart(3, "0")}`;
                this.prefix_for = prefix.prefix_for;
                return this.wePrefixString;
              }
            } else if (prefix.prefix_for === "random") {
              const splittable = prefix.prefix_name.split("/");
              const random = Math.floor(1000 + Math.random() * 9000);
              this.wePrefixString = `${splittable[0]}/${random}`;
              this.prefix_for = prefix.prefix_for;
              return this.wePrefixString;
            }
          }
        }
      }
    } catch (error) {
      Swal.fire("Error!", error, "error").then(() => { });
    }
    console.log(this.wePrefixString, "wePrefixString");
    return this.wePrefixString;
  }
  handlePrintAfterClaim() {
    this.travelDataForPrint = [];
    this.travelDataForPrint = this.selectedItems;
    this.modalService.open(this.printModal, { size: "lg" });
  }
  printContent() {
    const printSection = document.getElementById("print-section");
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write("<html><head><title>Print</title>");

    iframeDoc.write(`
      <style>
        @media print {
          .modal-header, .modal-footer {
            display: none;
          }

          .modal-body {
            background-color: #f1f1f1 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .invoice-container {
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }

          .invoice-header {
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 2px solid #ddd;
            margin-bottom: 15px;
          }

          .invoice-header h2 {
            margin: 0;
            color: #333;
          }

          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          }

          .invoice-column {
            width: 48%;
          }

          .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }

          .detail-item label {
            font-weight: bold;
            width: 150px;
          }

          .invoice-footer {
            margin-top: 10px;
            font-size: 12px;

          }

          .upload-section {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
          }

          .upload-section .fa-eye {
            cursor: pointer;
            margin-left: 5px;
            color: blue;
          }

          .invoice-table {
            padding: 15px;
          }

          .invoice-table table {
            width: 100%;
            border-collapse: collapse;
          }

          .invoice-table th, .invoice-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
          }

          .invoice-table th {
            background: #a1a1a1;
          }

          .travel-data-invoice {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }

          .travel-data-invoice th, .travel-data-invoice td {
            padding: 10px 15px;
            text-align: center;
            border: 1px solid #ddd;
          }

          .travel-data-invoice th {
            background-color: #f1f1f1;
            font-weight: bold;
            color: #333;
          }

          .travel-data-invoice .pending {
            color: red;
            font-weight: bold;
          }
            .invoice-table {
            padding: 15px;
            }

.travel-data-invoice table {
  width: 100%;
  border-collapse: collapse;
}

.travel-data-invoice th, .invoice-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.travel-data-invoice th {
          .travel-data-invoice th:nth-child(2),
          .travel-data-invoice td:nth-child(2),
          .travel-data-invoice th:nth-child(3),
          .travel-data-invoice td:nth-child(3) {
            width: 30%;
          }
        }
          .end-div{
margin-top: 10px;
display: flex;
justify-content: space-between;
padding-right:50px;
}
      </style>
    `);

    iframeDoc.write("</head><body>");
    iframeDoc.write(printSection.innerHTML);
    iframeDoc.write("</body></html>");
    iframeDoc.close();
    iframe.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
      this.closePrint();
    }, 1000);
  }
  async closePrint() {
    this.spinner.show()

    if (!this.is_claimSubmitted) {
      this.closeModal();
      await this.handleClaimModalClose();
      this.spinner.hide();
    } else {

      this.closeModal();

      setTimeout(() => {
        this.OntotalCloseChanes();
        this.viewClaimDetails(this.selectedClaimId)
        this.spinner.hide();
      }, 1000)


    }

  }
  async GetFuelStationBrandsByOrgId() {
    try {
      const data: any = await this.payrollService.GetFuelStationBrandsByOrgId({ id: this.userInfo.org_id }).toPromise();
      this.fuelStations = [];
      if (data && data.length > 0) {
        this.fuelStations = [{ id: 0, text: "Select Fuel Station Brand" }, data.map((ele) => ({
          id: ele.id,
          text: ele.name
        }))]
      } this.fuelStations = [
        { id: 0, text: "Select Fuel Station Brand" },
        ...data.map((ele) => ({ id: ele.id, text: ele.name }))
      ];
    } catch (error) {
      console.error("Error fetching fuel station brands:", error);
      this.toastr.error("Failed to fetch fuel station brands");
    }
  }
  maximumNumberLength = 0
  maximumStringLength = 0
  numberPlateCodes=[]
  async getTravelVehicleConfigByOrgId() {
    let org_id = this.userInfo.org_id ? this.userInfo.org_id : localStorage.getItem('org_id')
    let res: any = await this.payrollService.GetTravelVehicleConfigByOrgId({ id: org_id }).toPromise();
    if (res.length > 0) {
      this.maximumNumberLength = res[0].max_num_len,
        this.maximumStringLength = res[0].max_str_len
      this.numberPlateCodes=[];
      this.numberPlateCodes=[{ id: 0, text: "Select Plate Code" },...this.generateCombinations(res[0].max_str_len)]

    }
    console.log(res, 'on get')
  }
  currency: string = ""
  async FindCurrencyByOrgId() {
    let res: any = await this.organizationService.FindCurrencyByOrgId().toPromise();
    if (res && res.length > 0) {
      this.currency = res[0].currency
      // console.log(res[0].currency)
    }
  }
  generateCombinations(n) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const result = [];
    const total = Math.pow(26, n);

    for (let i = 0; i < total; i++) {
      let combination = "";
      let num = i;

      for (let j = 0; j < n; j++) {
        combination = alphabet[num % 26] + combination;
        num = Math.floor(num / 26);
      }

      result.push({ id: i + 1, text: combination });
    }

    return result;
  }

}
