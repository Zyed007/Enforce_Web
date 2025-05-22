import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from "@angular/core";
import { Select2OptionData } from "ng2-select2";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
  AbstractControl,
} from "@angular/forms";
import Swal from "sweetalert2";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { TaskService } from "../../services/task.service";
import moment = require("moment");
import { EmployeeService } from "../../services/employee.service";
import { settingsService } from "../../services/settings.service";
import { MatTabGroup, MatTableDataSource } from "@angular/material";
import { ProjectService } from "../../services/project.service";
import { Router } from "@angular/router";
import { MapsAPILoader, MouseEvent, AgmMap } from "@agm/core";
import { GoogleMap } from "@agm/core/services/google-maps-types";
import { Query } from "@syncfusion/ej2-data";
import {
  SearchCountryField,
  TooltipLabel,
  CountryISO,
} from "ngx-intl-tel-input";
import { SubscriptionService } from "../../services/subscription.service";
import { DataManager } from "@syncfusion/ej2-data";
import "handsontable/dist/handsontable.full.css";
import { ChangeDetectorRef } from "@angular/core";

import {
  GridComponent,
  ToolbarService,
  PageService,
  ExcelExportService,
  PdfExportService,
  GroupService,
  ToolbarItems,
  columnSelectionComplete,
} from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import { NgxSpinnerService } from "ngx-spinner";
import { CountryService } from "../../services/countryList.service";
import { ExpandEventArgs, Accordion } from "@syncfusion/ej2-navigations";
import {
  AccordionComponent,
  SelectEventArgs,
  RemoveEventArgs,
  TabComponent,
} from "@syncfusion/ej2-angular-navigations";
import { CostService } from "../../services/cost.service";
import { LeadService } from "../../services/lead.service";
import { patternValidator } from "../../shared/services";
import { QuotationService } from "../../services/quotation.service";
import {
  CheckBoxSelectionService,
  PopupEventArgs,
} from "@syncfusion/ej2-angular-dropdowns";
import { UserService } from "../../services/user.service";

import { HttpClient } from "@angular/common/http";
let date = moment(new Date()).format("L");
let formattedPrefix = moment(date).format("YY/MM/DD");
declare var $: any;
declare var XLSX: any;
declare var TableToExcel: any;

import { MatAccordion } from "@angular/material";
import { Console, log } from "console";
import { InventoryService } from "../../services/inventory.service";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { ModuleSetupService } from "../../services/moduleSetup.service";
import { esDoLocale } from "ngx-bootstrap";
import { IntfutService } from "../../services/intfut.service";
import { J } from "@angular/cdk/keycodes";
import { Label } from "@amcharts/amcharts4/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PlatformDetectionService } from "../../platform-detection.service";

let brList = [];
let tableS = [];
let count = 0;
interface PrimaryCategory {
  id: string;
  milestone_name: string;
  sequence: string;
  staticTask: [];
}

interface PrimaryCatList {
  id: string;
  serviceName: string;
  primaryCategory: PrimaryCategory[];
}
@Component({
  selector: "app-intfut-estimate",
  templateUrl: "./intfut-estimate.component.html",
  styleUrls: ["./intfut-estimate.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [CheckBoxSelectionService],
})
export class IntfutEstimateComponent implements OnInit {
  private gridApi;
  private gridColumnApi;
  @ViewChild("tabObj", { static: false }) public tabObj: MatTabGroup;
  @ViewChild("tabObjFullScreen", { static: false })
  public tabObjFullScreen: MatTabGroup;
  @ViewChild("serviceGrid", { static: false })
  public serviceGrid: GridComponent;
  @ViewChild("InvSelectionModal", { static: false })
  InvSelectionModal: any;
  //private columnDefs;
  tableSettings: any = {
    // rowHeaders: true,
    // colHeaders: true,
    // viewportColumnRenderingOffset: 27,
    //viewportRowRenderingOffset: "auto",
    //colWidths: 150,
    height: 250,
    // allowInsertColumn: false,
    // allowInsertRow: false,
    // allowRemoveColumn: false,
    // allowRemoveRow: false,
    autoWrapRow: false,
    // autoWrapCol: false,
    stretchH: "all",
    // width: 924,
    // autoWrapRow: true,
    //height: 487,
    maxRows: 22,
    //manualRowResize: true,
    //manualColumnResize: true,
    // rowHeaders: true,

    columns: [
      {
        data: "floor",
        type: "text",
      },
      {
        data: "id",
        type: "numeric",
        width: 40,
      },
      {
        data: "level",
        type: "numeric",
        // numericFormat: {
        //   pattern: '0.0000'
        // }
      },
      {
        data: "units",
        type: "text",
      },
      {
        data: "asOf",
        type: "numeric",

        // type: 'date',
        // dateFormat: 'MM/DD/YYYY'
      },
      {
        data: "onedChng",
        type: "numeric",
        // numericFormat: {
        //   pattern: '0.00%'
        // }
      },
      {
        data: "smtv",
        type: "numeric",
        // numericFormat: {
        //   pattern: '0.0000'
        // }
      },
      {
        data: "intercom",
        type: "numeric",
      },
      {
        data: "flat",
        type: "numeric",
      },
      {
        data: "smtv",
        type: "numeric",
        // numericFormat: {
        //   pattern: '0.0000'
        // }
      },
      {
        data: "intercom",
        type: "numeric",
      },
      {
        data: "flat",
        type: "numeric",
      },
      {
        data: "smtv",
        type: "numeric",
        // numericFormat: {
        //   pattern: '0.0000'
        // }
      },
      {
        data: "intercom",
        type: "numeric",
      },
      {
        data: "flat",
        type: "numeric",
      },
      {
        data: "flat",
        type: "numeric",
      },
    ],
    //colHeaders: ["Floor", "Area/Flat", "Socket", "12 Cabinet", "Date", "Change"],
    nestedHeaders: [
      [
        "Floor",
        "Area/Flat",
        { label: "Socket", colspan: 2 },
        { label: "12 Cabinet", colspan: 2 },
        "INTERCOM",
        "SMATV",
        "Flat type",
        { label: "Access Control", colspan: 6 },
        "Gate Barrier",
      ],

      [
        "",
        "",
        "Dual",
        "Single",
        "12U*600*600*150",
        "12U*600*600*350",
        "",
        "",
        "",
        "CR",
        "PB",
        "MLN",
        "BG",
        "DC",
        "Long Range Reader",
        "",
      ],
    ],
    // manualRowMove: true,
    // manualColumnMove: true,
    //contextMenu: true,
    //filters: true,
    //dropdownMenu: true,
    afterValidate: function (isValid, value, row, prop) {
      if (isValid == false) {
        // console.log(value, row, prop)
        // console.log("Invalid")
        //Value = isValid
        // row = inserted invalid value
        //prop = row index changed
      } else {
        // console.log("valid", isValid)
      }
    },
    licenseKey: "non-commercial-and-evaluation",
  };
  currencyList = [
    {
      id: "USD",
      value: "USD",
    },
    {
      id: "INR",
      value: "INR",
    },
    {
      id: "RIYAL",
      value: "RIYAL",
    },
    {
      id: "DINAR",
      value: "DINAR",
    },
    {
      id: "AED",
      value: "AED",
    },
  ];
  public dropConfig = {
    height: "250px",
    placeholder: "Select",
  };
  tabData = [];
  floorData = [];
  tempProjectData = [
    {
      project_prefix: "EST/07/31/2024",
      project_type_name: "Wednesday Intfut Test Project",
      project_name: "Latest Test",
      profit_margin_amount: "",
      cst_name: "Sher Khan",
      email: "sherkhan1972@hotmail.com",
      phone: "0509804082",
      ondate: "17/30/2024",
      project_id: "f3r4p9p4-l9f7-8qjc-9c8d-1e2f4a4b5c7x",
      project_type_id: "x7503f5b-34ed-4cdf-b1a1-c82c31df29e5",
      building_type: "f7503f5b-34ed-4cdf-b1a1-c82c31df29e1",
    },
    {
      project_prefix: "EST/08/04/2024",
      project_type_name: "Soundhar Test Residential Project 1",
      project_name: "Soundhar Test Residential Project 1",
      profit_margin_amount: "",
      cst_name: "Sher Khan",
      email: "sherkhan1972@hotmail.com",
      phone: "0509804082",
      ondate: "08/04/2024",
      project_id: "z3y4p9p4-l9f7-8qjc-9c8d-1e2f4a4b5c7y",
      project_type_id: "p7503f7b-34ed-4cdf-c1a1-c82c31df29e5",
      building_type: "f7503f5b-34ed-4cdf-b1a1-c82c31df29e1",
    },
    {
      project_prefix: "EST/08/04/2024",
      project_type_name: "Soundhar Test Residential Project 2",
      project_name: "Soundhar Test Residential Project 2",
      profit_margin_amount: "",
      cst_name: "Sher Khan",
      email: "sherkhan1972@hotmail.com",
      phone: "0509804082",
      ondate: "08/04/2024",
      project_id: "z3y4p9p4-l9f7-8pjc-9c8d-1e2f4a4b5c7r",
      project_type_id: "p7503f5b-34ed-4cdf-b1a1-c82c31df29e5",
      building_type: "f7503f5b-34ed-4cdf-b1a1-c82c31df29e1",
    },
    {
      project_prefix: "EST/08/04/2024",
      project_type_name: "Soundhar Test Residential Project 3",
      project_name: "Soundhar Test Residential Project 3",
      profit_margin_amount: "",
      cst_name: "Sher Khan",
      email: "sherkhan1972@hotmail.com",
      phone: "0509804082",
      ondate: "08/04/2024",
      project_id: "w3y4p9p4-l9f7-8ejc-9c8d-1e2f4a4b5c7r",
      project_type_id: "p7503f5b-34ed-4cdf-b1a1-c82c31df29e5",
      building_type: "f7503f5b-34ed-4cdf-b1a1-c82c31df29e1",
    },
    {
      project_prefix: "EST/08/04/2024",
      project_type_name: "Soundhar Test Villa Project 1",
      project_name: "Soundhar Test Villa Project 1",
      profit_margin_amount: "",
      cst_name: "Sher Khan",
      email: "sherkhan1972@hotmail.com",
      phone: "0509804082",
      ondate: "08/04/2024",
      project_id: "p3o5p9p4-i9f7-8qjc-9c8d-1e2f4a4b5c7d",
      project_type_id: "p7503f5b-34ed-4cdf-b1a1-c82c31df29e5",
      building_type: "bb89e94a-f8e0-4b6f-96e4-962d82fe1620",
    },
    {
      project_prefix: "EST/08/04/2024",
      project_type_name: "Soundhar Test Villa Project 2",
      project_name: "Soundhar Test Villa Project 2",
      profit_margin_amount: "",
      cst_name: "Sher Khan",
      email: "sherkhan1972@hotmail.com",
      phone: "0509804082",
      ondate: "08/04/2024",
      project_id: "r3o5p9p4-i9f7-8qjc-9c8d-1e2f4a4b5c7e",
      project_type_id: "p7503f5b-34ed-4cdf-b1a1-c82c31df29e5",
      building_type: "bb89e94a-f8e0-4b6f-96e4-962d82fe1620",
    },
    {
      project_prefix: "EST/08/04/2024",
      project_type_name: "Soundhar Test Villa Project 3",
      project_name: "Soundhar Test Project 3",
      profit_margin_amount: "",
      cst_name: "Sher Khan",
      email: "sherkhan1972@hotmail.com",
      phone: "0509804082",
      ondate: "08/04/2024",
      project_id: "xb89e94a-f8x0-4b6f-96e4-962d82fe1624",
      project_type_id: "p7503f5b-34ed-4cdf-b1a1-c82c31df29e5",
      building_type: "bb89e94a-f8e0-4b6f-96e4-962d82fe1620",
    },
  ];

  dataset = [
    {
      id: 1,
      flag: "EUR",
      currencyCode: "EUR",
      floor: "P1",
      level: 2,
      units: "5",
      asOf: "3",
      onedChng: 1,
      smtv: 1,
      intercom: 1,
      flat: 1,
    },
    {
      id: 2,
      flag: "JPY",
      currencyCode: "JPY",
      floor: "P2",
      level: 3,
      units: "6",
      asOf: "4",
      onedChng: 1,
      smtv: 1,
      intercom: 1,
      flat: 1,
    },
  ];
  detectChanges = (hotInstance, changes, source) => {
    // console.log('detectChanges', changes);

  };
  public defaultColDef;
  //private rowData: any;
  columnDefs = [{ field: "make" }, { field: "model" }, { field: "price" }];

  rowData = [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 },
  ];
  projectForm: FormGroup;
  prefixValue: any;
  @ViewChild("convertBtn", { static: false }) convertBtn: ElementRef;
  @ViewChild("cstBtn", { static: false }) cstBtn: ElementRef;
  @ViewChild("taskCloseBtn", { static: false }) taskCloseBtn: ElementRef;
  @ViewChild("meetCloseBtn", { static: false }) meetCloseBtn: ElementRef;
  @ViewChild("callCloseBtn", { static: false }) callCloseBtn: ElementRef;
  @ViewChild("closeActBtn", { static: false }) closeActBtn: ElementRef;
  @ViewChild("contactCloseBtn", { static: false }) contactCloseBtn: ElementRef;

  //Accordion Control
  @ViewChild("accordion", { static: true }) Accordion: MatAccordion;
  @ViewChild("summaryAccordion", { static: true })
  summaryAccordion: MatAccordion;
  @ViewChild("accordionNVR", { static: true }) AccordionNV: MatAccordion;

  public currentTime = moment().add(1, "minutes").format("hh:mm a");
  public InvItemtype = ["New", "Existing", "Provisional"];
  public InvItemDropType = [
    { id: "New", description: "New" },
    { id: "Existing", description: "Existing" },
    { id: "Provisional", description: "Provisional" },
  ];
  organizationID = localStorage.getItem("org_id");
  user = JSON.parse(localStorage.getItem("user_info"));
  public prefixString = "";
  public tagsArrayValue = [];
  public taskOptions: Select2Options;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  selectedISO = CountryISO.UnitedArabEmirates;
  brList = [];
  public fields: Object = { groupBy: "category", text: "text", value: "id" };
  // Set the popup list height
  public height: string = "200px";
  // set the placeholder to the MultiSelect input
  public placeholder: string = "Select participants";

  public projectNames = [
    { display: "projName1", value: 1, email: "asda" },
    { display: "projName2", value: 2, email: "adsdsda" },
    { display: "projName3", value: 3, email: "sdasda" },
  ];
  tempSummary = [
    {
      type: "Network Switch 8",
      qty: 1,
      MainType: "Network Switch",
      MainCat: "CCTV New",
      mainCategoryId: "55d13737-6a1b-4926-82d1-482e0ad3cb88",
      primaryCategoryId: "Au2POVlTd5",
      subcategoryId: "K3loaLdk5cNiqii",
    },
    {
      type: "Network Switch 16",
      qty: 4,
      MainType: "Network Switch",
      MainCat: "CCTV New",
      mainCategoryId: "55d13737-6a1b-4926-82d1-482e0ad3cb88",
      primaryCategoryId: "Au2POVlTd5",
      subcategoryId: "V5Xgq46PeEMv1fO",
    },
  ];
  primaryCatList: PrimaryCatList = {
    id: "",
    serviceName: "",
    primaryCategory: [],
  };
  selectedPrimaryCatList = [];
  hiddenPrimaryCatList = [];
  selectedHiddenPrimaryCatList = [];
  allServicesUnfiltered = [];
  floorNo = [
    {
      id: "",
      text: "Select",
    },
    {
      id: "1",
      text: "Ground floor",
    },
    {
      id: "2",
      text: "Floor",
    },
    {
      id: "3",
      text: "Basement",
    },
    {
      id: "4",
      text: "Podium",
    },
    {
      id: "5",
      text: "Roof",
    },
    {
      id: "6",
      text: "Upper Roof",
    },
    {
      id: "7",
      text: "Mezzanine Floor",
    },
  ];
  flatNames = [
    {
      id: "",
      text: "Select",
    },
    {
      id: "1",
      text: "Retail",
    },
    {
      id: "2",
      text: "Flat",
    },
  ];
  flatTypesData = [
    {
      id: "",
      text: "Select",
    },
    // {
    //   id:'1',
    //   text:'1 BHK'
    // },{
    //   id:'2',
    //   text:'2 BHK'
    // },{
    //   id:'3',
    //   text:'3 BHK'
    // }
    // ,{
    //   id:'4',
    //   text:'Electrical Room'
    // },{
    //   id:'5',
    //   text:'Telephone Room'
    // },{
    //   id:'6',
    //   text:'Gym'
    // }
  ];
  serviceNames = [
    {
      id: "",
      text: "Select",
    },
  ];
  selectedTab = 0;
  templateListingData$;
  invselectedRowIndex = 0;
  supselectedRowIndex = 0;
  customColumnArr: any = [];
  colDataArr: any = [];
  supplierRatesArr = [];
  existingInventory = [];
  SummaryMatTabVals = [];
  SummaryMatAccordianVals = [];
  appliedTemplates = [];
  filteredTaskList = [];
  templateRuleList = [];
  showLoader = false;
  addTagDisable = true;
  enableFloorSummary = false;
  closeSummaryAccordion = false;
  showInvCustomModal = false;
  isSummaryModalOpen = false;
  summaryDetailsArr = {};
  showHiddenItems = false;
  isLoading = false;
  commonModuleName;
  currentModuleID;
  editProjectData = {};
  vendorCategoryDropDown;
  templateListing = true;
  templateRuleListing = false;
  editTemplateId = "";
  serviceID;
  selectedMainCategory = "";
  selectedPrimaryCategory = "";
  currentSection = "Add/Edit";
  accessToPage = false;
  addInventory = true;
  showIntfutSummaryTable = false;
  showSupplierRatesModal = true;
  showAddNewSupplierModal = false;
  showSupplierRatesTable = false;
  showSummaryTable = true;
  isEstimationModalEnabled = false;
  showEstModalSpinner = false;
  editEnable = false;
  matTabSpinner = false;
  approver1_role_name;
  approver2_role_name;
  approver1_roleId;
  approver2_roleId;
  selectedServiceTab = "All";
  selectedServiceTabIndex = 0;
  selectedEditService = "";
  selectedEditServiceId = "";
  isSummaryFullScreen = false;
  isFullInventory = false;
  sum = 0;
  summaryDataIndex = 0;
  dualApproval = false;
  isStructureTableVisible = false;
  isUnitTableVisible = false;
  selfApproverAssigned;
  approverAssigned;
  isEstSummarySaved = false;
  catgeryOnlyColumnArr: any = [];
  catgeryOnlycolDataArr: any = [];
  serviceSummaryData: any = [];
  inventoryNameStore = {};
  inventoryPlaceholder =
    "https://res.cloudinary.com/dzjsbplvh/image/upload/v1704793840/InventoryImages/2024-01-09_15040%20PM.webp";
  flatTypeArrayValues = [
    {
      id: "7",
      text: "1 BHK",
    },
    {
      id: "1",
      text: "2 BHK",
    },
    {
      id: "2",
      text: "Gym",
    },
  ];
  serviceCategNames = [
    {
      id: "1",
      text: "Dual",
    },
    {
      id: "2",
      text: "Single",
    },
  ];
  relationData = [
    {
      id: "",
      text: "Select",
    },
    {
      id: "1",
      text: "Owner",
    },
    {
      id: "2",
      text: "Consultant",
    },
    {
      id: "3",
      text: "Personal Advisor",
    },
    {
      id: "4",
      text: "Office Manager",
    },
  ];

  addItemsDropDownData = [
    {
      id: "Standalone",
      value: "Standalone",
    },
    {
      id: "Realtional",
      value: "Realtional",
    },
  ];

  addAreasArr = [
    {
      id: "Standalone",
      value: "Standalone",
    },
    {
      id: "Realtional",
      value: "Realtional",
    },
  ];

  addTypesArr = [
    {
      id: "Standalone",
      value: "Standalone",
    },
    {
      id: "Realtional",
      value: "Realtional",
    },
  ];

  newSummaryTbl = [];
  cctvtype = [];
  vendorArr = [];
  serviceMainCategory = [];
  servicePrimaryCategory = [];
  serviceSecondaryCategory = [];
  serviceCatList = [];
  showSubCategory1 = false;
  showSubCategory2 = false;
  showCameraDesc: boolean = false;
  showNVRPECameraDesc: boolean = false;
  showNVRwithoutPECameraDesc: boolean = false;
  typetextDesc: boolean = false;

  cstRelationValue: any = "";
  cstRelationValueTxt: any = "";
  showAddContact: any = false;
  disableSaveFlat: any = false;
  branchDataSource: any[];
  customerContactForm: FormGroup;
  addSupplierForm: FormGroup;
  addInventoryTypeForm: FormGroup;
  templateForm: FormGroup;
  employeeGridToolItems: ToolbarItems[];
  disableSaveBranch: boolean = true;
  showBranchList: boolean = false;
  disc_value: any = "";
  plotValue: number;
  builtUpplotValue: number;
  mode: string;
  savedExtrasArr: any;
  showTextArea4: boolean;
  showValidTimeError: boolean = false;
  closeActData = {
    subject: "",
    start_time: "",
    end_time: "",
    entity_type: "",
    remarks: "",
    status: "",
    activity_owner: "",
    due_date: "",
  };
  closeActLog: boolean;
  callCstId: any;
  typeOfModal: string;
  discount_amount: any;
  showList: boolean;
  showAddBtn: boolean;
  showEditBtn: boolean;
  showDeleteBtn: boolean;
  showConvertBtn: boolean;
  savedContactPh: boolean;
  public selectedCstISO = CountryISO.UnitedArabEmirates;
  editableTotal: boolean = false;
  sortTypeVal: any;
  minStartTime: string;
  showModification: boolean = true;
  removedTaskList: any = [];
  modified_cost: any = 0;
  deletedTaskList: any = [];
  addedTaskList: any = [];
  modified_hrs: any;
  serviceNameVal: any = "";
  serviceNameValTxt: any;
  servicesForm: FormGroup;
  serviceCategNameVal: any = "";
  serviceCategNameValTxt: any = "";
  serviceCategNamesTxt: any = [];
  tempUnitStack: any = [];
  templateUnitStack: any = [];
  updatedUnitStack: any = [];
  editSummaryFormArray: any = [];
  addFlatTypeSubmit: boolean;
  buildTypeVal: any;
  calcUnitForm: FormGroup;
  summaryFormArray: FormGroup;
  calculateSubmit: boolean = false;
  selectedService = "";

  camerTypetxtDescription: any = "";
  nvrPetxtDescription: any = "";

  typetxtDescription: any = "";

  //intfutService

  allservicesArr: any = [];
  newItemFormGroup: any;
  itemsFormArray: any;
  summaryDataArr = [];
  super: any;
  SerCatName: any;
  SerCatId: any;

  public changedCstRelation(e: any): void {
    this.cstRelationValue = e.value;
    // this.countryValueTxt= e.data[0].text;
    if (e.data[0]) {
      this.cstRelationValueTxt = e.data[0].text;
    }
  }

  // addCamTypeInputs() {

  // }

  //Main Funciton which creates the outer structure of the New Table Data
  async openNewCstModal(serviceId, servName) {
    // console.log("ServiceID", serviceId);
    // console.log("ServiceName", servName);
    // console.log(this.allservicesArr, "allservicesArr");
    this.showHiddenItems = false;
    this.spinner.show();
    this.tempUnitStack = [];
    this.selectedService = servName.value.Label;
    try {
      const showServiceSelection = await this.fetchBoqCustable(serviceId);
      const serviceData: any = await this.intfutService
        .GetProjectServicebyID({ id: this.editTaskId })
        .toPromise();
      const selServ = this.allservicesArr.find((em) => em.id === serviceId);
      const deepSelServ = JSON.parse(JSON.stringify(selServ));
      let primaryCatExists = false;

      if (serviceData.length > 0) {
        const service = serviceData.find((ele) => ele.service_id == serviceId);
        console.log(service, "service", service.primary_cat_list);

        if (service.primary_cat_list && service.primary_cat_list.length > 0) {
          primaryCatExists = true;
          const parsedList = JSON.parse(service.primary_cat_list);
          this.selectedPrimaryCatList = parsedList;
          this.primaryCatList = selServ;
          this.hiddenPrimaryCatList = deepSelServ.primaryCategory.filter(
            (i) => !parsedList.includes(i.id)
          );
          console.log(this.primaryCatList, this.hiddenPrimaryCatList, "HIDE");
          deepSelServ.primaryCategory = deepSelServ.primaryCategory.filter(
            (i) => parsedList.includes(i.id)
          );
          console.log(parsedList, deepSelServ.primaryCategory, "parsedList");
          console.log(selServ, deepSelServ, "TEST OG VS DEEP");
        }
      }
      console.log(primaryCatExists, "primaryCatExists");

      primaryCatExists
        ? this.openNewCustomizationModal(deepSelServ)
        : this.openServiceSelectionModal(deepSelServ);
    } catch (error) {
      console.error("An error occurred while opening the modal:", error);
    } finally {
      this.spinner.hide();
    }
  }

  async openNewCustomizationModal(selServ) {
    console.log(this.hiddenPrimaryCatList, "this.hiddenPrimaryCatList");
    if (selServ) {
      await this.updatedGetDynamicCols(selServ);
    }

    this.unitTypeVal = "";
    this.selTblData = this.newTblData;

    // Show the modal
    $("#new_customization_modal").modal("show");
  }
  async proceedCustomization() {
    this.spinner.show();
    try {
      if (this.selectedPrimaryCatList.length > 0) {
        let data: any = JSON.parse(JSON.stringify(this.primaryCatList));
        data.primaryCategory = data.primaryCategory.filter((i) =>
          this.selectedPrimaryCatList.includes(i.id)
        );
        this.hiddenPrimaryCatList = this.primaryCatList.primaryCategory.filter(
          (i) => !this.selectedPrimaryCatList.includes(i.id)
        );
        console.log(this.hiddenPrimaryCatList, "TEST HIDDEN CATS");

        let res = await this.UpdateProjectServiceCatListbyID(
          this.primaryCatList.id,
          this.editTaskId
        );

        if (res.status === "200") {
          this.spinner.hide();
          setTimeout(() => {
            $("#serviceSelectionModal").modal("hide");
            this.toast.success("Service updated successfully");
          }, 500);
          setTimeout(() => {
            this.openNewCustomizationModal(data);
          }, 1000);
        } else {
          this.toast.error("Something went wrong. Please try again later");
        }
      } else {
        this.toast.error("Please select at least one category");
      }
    } catch (error) {
      this.spinner.hide();
      console.error("An error occurred during customization:", error);
      this.toast.error("An error occurred. Please try again later.");
    }
  }
  async handleHiddenCatsSubmit() {
    console.log(
      this.selectedHiddenPrimaryCatList,
      this.selectedPrimaryCatList,
      "selectedHiddenPrimaryCatList"
    );
    console.log(this.selectedHiddenPrimaryCatList.length, "length");

    try {
      if (this.selectedHiddenPrimaryCatList.length === 0) {
        this.toast.error("Please select at least one category");
        return;
      }
      let alreadyExists = this.selectedPrimaryCatList.some((el) =>
        this.selectedHiddenPrimaryCatList.includes(el)
      );
      if (alreadyExists) {
        this.handleSwalFire(
          "Are you sure you want to unselect the selected categories?.",
          async () => await this.submitHiddenCats(alreadyExists),
          null,
          "Continue"
        );
      } else {
        await this.submitHiddenCats(alreadyExists);
      }
      console.log(alreadyExists, "alreadyExists");

      this.spinner.show();
    } catch (err) {
      console.error(err);
    } finally {
      this.spinner.hide();
    }
  }
  checkDisabled(item) {
    if (this.summaryDataArr.length === 0) return false;
    return this.summaryDataArr.some(
      (el) => el.categoryName === item.milestone_name
    );
  }
  async submitHiddenCats(alreadyExists) {
    if (alreadyExists) {
      let removeArr = this.selectedPrimaryCatList.filter((el) =>
        this.selectedHiddenPrimaryCatList.includes(el)
      );

      this.selectedPrimaryCatList = this.selectedPrimaryCatList.filter(
        (el) => !removeArr.includes(el)
      );
      this.selectedHiddenPrimaryCatList =
        this.selectedHiddenPrimaryCatList.filter(
          (el) => !removeArr.includes(el)
        );

      this.selectedPrimaryCatList = [
        ...this.selectedHiddenPrimaryCatList,
        ...this.selectedPrimaryCatList,
      ];

      this.colDataArr = this.colDataArr
        .map((el) => {
          if (el.childItems) {
            el.childItems = el.childItems.filter(
              (i) => !removeArr.includes(i.primaryCategoryId)
            );
          }
          return el;
        })
        .filter((el) => (el.childItems ? el.childItems.length > 0 : true));
    } else {
      this.selectedPrimaryCatList = [
        ...this.selectedHiddenPrimaryCatList,
        ...this.selectedPrimaryCatList,
      ];
    }

    let hiddenCats: any = JSON.parse(JSON.stringify(this.primaryCatList));
    hiddenCats.primaryCategory = hiddenCats.primaryCategory.filter((i) =>
      this.selectedHiddenPrimaryCatList.includes(i.id)
    );

    let res = await this.UpdateProjectServiceCatListbyID(
      this.primaryCatList.id,
      this.editTaskId
    );

    if (hiddenCats.primaryCategory.length > 0) {
      if (res.status === "200") {
        this.hiddenPrimaryCatList = this.hiddenPrimaryCatList.filter(
          (i) => !this.selectedHiddenPrimaryCatList.includes(i.id)
        );

        hiddenCats.primaryCategory.forEach((el) => {
          let tempObj = {
            id: Math.random(),
            text: el.milestone_name,
            mainCatId: hiddenCats.id,
            childItems: el.staticTask ? el.staticTask : undefined,
          };

          this.customColumnArr.push(tempObj);
          this.colDataArr.push(tempObj);
          this.cctvtype.push(tempObj);
        });

        this.selectedHiddenPrimaryCatList = [];
        this.toast.success("Service updated successfully");
      }
    } else if (!alreadyExists && hiddenCats.primaryCategory.length <= 0) {
      this.toast.error("Please select at least one category");
    }

    console.log(this.colDataArr, "COLDATA CHECK");
  }

  showHiddenPrimaryCats() {
    this.showHiddenItems = !this.showHiddenItems;
  }

  async UpdateProjectServiceCatListbyID(service_id, project_id) {
    const primaryCatListJson = JSON.stringify(this.selectedPrimaryCatList);

    const postData = {
      service_id,
      project_id,
      primary_cat_list: primaryCatListJson,
      modified_by: this.user["full_name"],
    };

    try {
      const res: any = await this.intfutService
        .UpdateProjectServiceCatListbyID(postData)
        .toPromise();

      console.log(res, "res");
      return res;
    } catch (error) {
      console.error(
        "An error occurred while updating the project service category list:",
        error
      );
      throw error;
    }
  }

  async fetchBoqCustable(serviceId) {
    const postdata = { project_id: this.editTaskId, service_id: serviceId };
    this.summaryDataArr = [];
    try {
      const data: any = await this.intfutService
        .GetboqcustablebyID(postdata)
        .toPromise();

      if (data.length !== 0) {
        const convert = JSON.parse(data[0].boqdata);
        this.tempUnitStack = convert;

        const transformedData = this.tempUnitStack.map((category) => {
          const categoryName = category.id.trim();
          const value = category.value.reduce((acc, item) => {
            const existingItem = acc.find(
              (i) => i.type === item.type.trim().toUpperCase()
            );
            if (existingItem) {
              existingItem.qty += parseInt(item.qty, 10);
            } else {
              acc.push({
                type: item.type.trim().toUpperCase(),
                qty: parseInt(item.qty, 10),
              });
            }
            return acc;
          }, []);

          return {
            categoryName,
            value,
          };
        });

        this.summaryDataArr = transformedData;
        // console.log("Result of summary", this.summaryDataArr);
        return true;
      } else {
        console.log("THERE IS NO DATA TO BE PATCHED in database also!");
        return false;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  }
  onCategorySelected(event: any, item: any) {
    const itemId = item.id;
    if (this.selectedPrimaryCatList.includes(itemId)) {
      this.selectedPrimaryCatList = this.selectedPrimaryCatList.filter(
        (id) => id !== itemId
      );
    } else {
      this.selectedPrimaryCatList.push(itemId);
    }
  }
  onHiddenCategorySelected(event: any, item: any) {
    const itemId = item.id;
    console.log(itemId);
    if (this.selectedHiddenPrimaryCatList.includes(itemId)) {
      this.selectedHiddenPrimaryCatList =
        this.selectedHiddenPrimaryCatList.filter((id) => id !== itemId);
    } else {
      this.selectedHiddenPrimaryCatList.push(itemId);
    }
  }

  onCategorySelectAll(event: any) {
    const isChecked = event.target.checked;
    let catList = this.primaryCatList.primaryCategory;
    if (isChecked && this.primaryCatList.primaryCategory.length > 0) {
      this.selectedPrimaryCatList = this.primaryCatList.primaryCategory.map(
        (e) => e.id
      );
    } else {
      this.selectedPrimaryCatList = [];
    }

    console.log(this.selectedPrimaryCatList);
  }

  async updatedGetDynamicCols(selServ) {
    // console.log(selServ, "selServ----------------")
    let tempObj;
    this.customColumnArr = [
      {
        id: Math.random(),
        text: "Floor",
      },
      {
        id: Math.random(),
        text: "    Area / Flat Name    ",
      },
      {
        id: Math.random(),
        text: "Custom Number",
      },
    ];
    this.colDataArr = [
      {
        id: Math.random(),
        text: "Custom Number",
      },
    ];

    selServ.primaryCategory.map((el) => {
      if (el["staticTask"] != undefined) {
        tempObj = {
          id: Math.random(),
          text: el.milestone_name,
          childItems: el.staticTask,
          mainCatId: selServ.id,
        };
      } else {
        tempObj = {
          id: Math.random(),
          text: el.milestone_name,
          mainCatId: selServ.id,
        };
      }
      this.customColumnArr.push(tempObj);
      this.colDataArr.push(tempObj);
      this.cctvtype.push(tempObj);
    });

    if (this.editEnable && selServ.id && selServ.id != null) {
      await this.GetInfutBOQByProjectId(selServ.id);
    }

    // console.log("this.colDataArr--->", this.colDataArr);
  }
  groupBySummaryItemName(data: any) {
    const result = {};
    data.forEach((item) => {
      const { label, itemName } = item;

      if (!result[label]) {
        result[label] = {};
      }

      if (!result[label][itemName]) {
        result[label][itemName] = [];
      }

      result[label][itemName].push(item);
    });
    console.log(result, "RESULT!");
    return result;
  }

  isToBeUpdated= false;

  public showSummaryDetails() {
    this.isSummaryModalOpen = true;
    this.summaryDetailsArr = {};
    let estimationData = this.retrieveBOQserviceData(this.colDataArr);
    this.isToBeUpdated = true;
    if (estimationData.length > 0) {
      this.summaryDetailsArr = this.groupBySummaryItemName(estimationData);
      
      console.log(this.summaryDetailsArr, "this.summaryDetailsArr");
    }
    console.log(estimationData, "estimationData");
    
  }
  public hideSummaryDetails() {
    this.isSummaryModalOpen = false;
  }
  public async submitEstimationData() {
    let estimationData = this.retrieveBOQserviceData(this.colDataArr);
    console.log(estimationData, "estimationData");

    if (estimationData.length > 0) {
      this.spinner.show();
      this.isEstimationModalEnabled = false;

      $("#new_customization_modal").modal("hide");
      $("#gen_xl_modal").modal("hide");
      this.myForm.reset();

      try {
        this.hideSummaryDetails();
        const postData = {
          project_id: this.editEnable ? this.editTaskId : this.newTaskId,
          main_category: this.SerCatId,
          estimation_data: estimationData,
          created_by: this.user["full_name"],
        };

        // Await the result of the first API call
        const boqResponse: any = await this.intfutService
          .AddIntfutBOQ(postData)
          .toPromise();
        if (boqResponse.status === "200") {
          this.clearExistingServiceData(this.SerCatId);
        } else {
          console.error("Error on AddIntfutBOQ");
        }

        const postdata = {
          project_id: this.editTaskId,
          boqdata: this.tempUnitStack,
          service_id: this.SerCatId,
          created_by: this.user["full_name"],
          modified_by: this.user["full_name"],
        };

        const serviceResponse: any = await this.intfutService
          .Addboqcustable(postdata)
          .toPromise();

        if (serviceResponse.status === "200") {
          this.summaryDataArr = [];
          this.updateSummaryTable();
        } else {
          console.error("Error on Addboqcustable");
        }
      } catch (error) {
        this.toast.error("Something went wrong. Please try again later.");
      } finally {
        this.spinner.hide();
        this.toast.success("Estimation data saved successfully");
      }
    } else {
      this.toast.error("No data to save");
    }
  }

  retrieveBOQserviceData(jsonData) {
    const detailsList = [];

    jsonData.forEach((item) => {
      if (item.childItems) {
        item.childItems.forEach((subItem) => {
          if (subItem.detailsArr) {
            detailsList.push(...subItem.detailsArr);
          }
        });
      }
    });

    return detailsList;
  }

  async GetInfutBOQByProjectId(service_id) {
    const postData = { id: this.editTaskId, service_id: service_id };
    try {
      const data: any = await this.intfutService
        .GetInfutBOQByProjectId(postData)
        .toPromise();
      if (data) {
        this.mergeDetails(this.colDataArr, data);
        // console.log(this.colDataArr, "CHECK IF WORKING")
      }
    } catch (error) {
      console.error("Error fetching BOQ data:", error);
    }
  }

  mergeDetails(jsonData, details) {
    jsonData.forEach((jsonItem) => {
      if (jsonItem.childItems && Array.isArray(jsonItem.childItems)) {
        jsonItem.childItems.forEach((childItem) => {
          const matchingDetails = details.filter(
            (detail) =>
              detail.primaryCategory === childItem.primaryCategoryId &&
              detail.subCategory === childItem.id
          );
          if (matchingDetails.length > 0) {
            childItem.detailsArr = matchingDetails;
          }
        });
      }
    });

    return jsonData;
  }

  closeNewCustomModel() {
    this.isEstimationModalEnabled = false;
    this.spinner.show();
    setTimeout(() => {
      $("#gen_xl_modal").modal("hide");
      this.myForm.reset();
      this.spinner.hide();
    }, 1000);

    // $("#new_customization_modal").modal('show');
  }

  openGenExcelModal() {
    this.showEstModalSpinner = true;
    this.spinner.show();
    this.isEstimationModalEnabled = true;

    console.log(this.catgeryOnlycolDataArr, "catgeryOnlycolDataArr");
    console.log(this.catgeryOnlyColumnArr, "catgeryOnlyColumnArr");
    console.log(this.selTblData, "selTblData");
    setTimeout(() => {
      $("#gen_xl_modal").modal("show");
      this.spinner.hide();
      setTimeout(() => {
        this.showEstModalSpinner = false;
      }, 1000);
    }, 1000);

    //$("#new_customization_modal").modal('hide');
  }

  openAllGenExcelModal() {
    // this.catgeryOnlyColumnArr = _.cloneDeep(this.customColumnArr);
    // this.catgeryOnlycolDataArr = _.cloneDeep(this.colDataArr);
    this.catgeryOnlyColumnArr = this.customColumnArr;
    this.catgeryOnlycolDataArr = this.colDataArr;
    console.log(this.catgeryOnlycolDataArr, this.colDataArr, "******");
    this.showEstModalSpinner = true;
    this.spinner.show();

    setTimeout(() => {
      this.isEstimationModalEnabled = true;
      $("#gen_xl_modal").modal("show");
      this.spinner.hide();
      setTimeout(() => {
        this.showEstModalSpinner = false;
      }, 1000);
    }, 1000);
  }

  closeGenExcelModal(): void {
    this.spinner.show();
    this.Accordion.closeAll();
    this.isEstimationModalEnabled = false;
    $("#gen_xl_modal").modal("hide");
    $("#new_customization_modal").modal("hide");
    $("#new_customization_modal").modal("show");

    this.spinner.hide();
  }

  updateSummaryTable() {
    this.newSummaryTbl = [];

    let typeQuantityMap = {};
    console.log(this.colDataArr, "this.colDataArr");
    this.colDataArr.forEach((item) => {
      if (item.childItems) {
        item.childItems.forEach((fe) => {
          if (fe.detailsArr) {
            fe.detailsArr.forEach((de) => {
              console.log(de.subCategory, de.type, "sub vs type");
              // Create a unique key using both type and subCategory
              const uniqueKey = `${de.type}|${de.subCategory}`;

              if (typeQuantityMap[uniqueKey]) {
                typeQuantityMap[uniqueKey].qty += parseInt(de.qty);
              } else {
                typeQuantityMap[uniqueKey] = {
                  qty: parseInt(de.qty),
                  MainType: item.text,
                  MainCat: this.SerCatName,
                  mainCategoryId: this.SerCatId,
                  primaryCategoryId: fe.primaryCategoryId,
                  subcategoryId: fe.id,
                  type: de.type,
                };
              }
            });
          }
        });
      }
    });
    console.log(typeQuantityMap, "typeQuantityMap");

    for (const key in typeQuantityMap) {
      const {
        qty,
        MainType,
        MainCat,
        mainCategoryId,
        primaryCategoryId,
        subcategoryId,
        type,
      } = typeQuantityMap[key];
      // const [type] = key.split("-");

      // Check if a matching entry already exists in this.newSummaryTbl
      const existingEntryIndex = this.newSummaryTbl.findIndex(
        (entry) =>
          entry.type === type &&
          entry.MainType === MainType &&
          entry.MainCat === MainCat
      );
      if (existingEntryIndex !== -1) {
        // If an existing entry is found, update its quantity
        this.newSummaryTbl[existingEntryIndex].qty = qty;
      } else {
        // If no existing entry is found, add a new entry
        this.newSummaryTbl.push({
          type,
          qty,
          MainType,
          MainCat,
          mainCategoryId,
          primaryCategoryId,
          subcategoryId,
        });
      }
    }
  }
  async saveDetails() {
    let res: any = null;

    try {
      this.spinner.show();
      this.updateSummaryTable();

      let data = this.getAllCustomNumbers(this.newTblData);

      if (data && data.length > 0) {
        let postData = { project_id: this.editTaskId, customNumberData: data };

        res = await this.intfutService
          .UpdateIntfutFloorById(postData)
          .toPromise();
        console.log(res, "RE IS HERE");
        if (res.status === "200") {
          this.toast.success("Floor data updated successfully");
        } else {
          // console.warn("Response status is not 200", res);
        }
      } else {
        console.log("No data to send");
      }
    } catch (error) {
      console.error("Error updating intfut floor data", error);
    } finally {
      this.closeGenExcelModal();
    }
  }

  getAllCustomNumbers(data) {
    const finalData = data.flatMap((item) =>
      item.fltDescription.filter((desc) => desc.customNumber && desc.isChanged)
    );
    return finalData;
  }

  async submitDetails() {
    // console.log("Sel TAble Data", this.selTblData);
    this.closeGenExcelModal();
    await this.submitEstimationData();
    // console.log("Sel TAble Data", this.selTblData);
  }
  customization() {
    // $('#customer_modal').show();
    $("#customization_modal").modal("show");
    this.tableSettings = {
      // rowHeaders: true,
      // colHeaders: true,
      // viewportColumnRenderingOffset: 27,
      //viewportRowRenderingOffset: "auto",
      //colWidths: 150,
      height: 250,
      // allowInsertColumn: false,
      // allowInsertRow: false,
      // allowRemoveColumn: false,
      // allowRemoveRow: false,
      autoWrapRow: false,
      // autoWrapCol: false,
      stretchH: "all",
      // width: 924,
      // autoWrapRow: true,
      //height: 487,
      maxRows: 22,
      //manualRowResize: true,
      //manualColumnResize: true,
      // rowHeaders: true,
      columns: [
        {
          data: "floor",
          type: "text",
        },
        {
          data: "id",
          type: "numeric",
          width: 40,
        },
        {
          data: "level",
          type: "numeric",
          // numericFormat: {
          //   pattern: '0.0000'
          // }
        },
        {
          data: "units",
          type: "text",
        },
        {
          data: "asOf",
          type: "numeric",

          // type: 'date',
          // dateFormat: 'MM/DD/YYYY'
        },
        {
          data: "onedChng",
          type: "numeric",
          // numericFormat: {
          //   pattern: '0.00%'
          // }
        },
        {
          data: "smtv",
          type: "numeric",
          // numericFormat: {
          //   pattern: '0.0000'
          // }
        },
        {
          data: "intercom",
          type: "numeric",
        },
        {
          data: "flat",
          type: "numeric",
        },
        {
          data: "smtv",
          type: "numeric",
          // numericFormat: {
          //   pattern: '0.0000'
          // }
        },
        {
          data: "intercom",
          type: "numeric",
        },
        {
          data: "flat",
          type: "numeric",
        },
        {
          data: "smtv",
          type: "numeric",
          // numericFormat: {
          //   pattern: '0.0000'
          // }
        },
        {
          data: "intercom",
          type: "numeric",
        },
        {
          data: "flat",
          type: "numeric",
        },
        {
          data: "flat",
          type: "numeric",
        },
      ],
      //colHeaders: ["Floor", "Area/Flat", "Socket", "12 Cabinet", "Date", "Change"],
      nestedHeaders: [
        [
          "Floor",
          "Area/Flat",
          { label: "Socket", colspan: 2 },
          { label: "12 Cabinet", colspan: 2 },
          "INTERCOM",
          "SMATV",
          "Flat type",
          { label: "Access Control", colspan: 6 },
          "Gate Barrier",
        ],

        [
          "",
          "",
          "Dual",
          "Single",
          "12U*600*600*150",
          "12U*600*600*350",
          "",
          "",
          "",
          "CR",
          "PB",
          "MLN",
          "BG",
          "DC",
          "Long Range Reader",
          "",
        ],
      ],
      // manualRowMove: true,
      // manualColumnMove: true,
      //contextMenu: true,
      //filters: true,
      //dropdownMenu: true,
      afterValidate: function (isValid, value, row, prop) {
        if (isValid == false) {
          // console.log(value, row, prop)
          // console.log("Invalid")
          //Value = isValid
          // row = inserted invalid value
          //prop = row index changed
        } else {
          // console.log("valid", isValid)
        }
      },
      licenseKey: "non-commercial-and-evaluation",
    };

    this.dataset = [
      {
        id: 1,
        flag: "EUR",
        currencyCode: "EUR",
        floor: "P1",
        level: 2,
        units: "5",
        asOf: "3",
        onedChng: 1,
        smtv: 1,
        intercom: 1,
        flat: 1,
      },
      {
        id: 2,
        flag: "JPY",
        currencyCode: "JPY",
        floor: "P2",
        level: 3,
        units: "6",
        asOf: "4",
        onedChng: 1,
        smtv: 1,
        intercom: 1,
        flat: 1,
      },
    ];
  }
  public AddContact() {
    this.showAddContact = !this.showAddContact;
    //  this.showBranchList=true;
  }
  brDelete(index) {
    this.branchDataSource.splice(index, 1);
    brList.splice(index, 1);
  }

  pageSize: any = 10;
  currentPage: any = 1;
  pgData = [];
  data12: Object[];
  showPrefixText: boolean = false;
  customPrefix: any;
  project_prefix_val: any;
  projectTypeData: { id: string; text: string }[];
  projTypeVal: any;
  public showTaskList = true;
  addNewFeature = false;
  isItemDisabled = false;

  public box: string = "Box";
  separateDialCode = true;

  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];

  phoneInvalid: boolean = false;
  phoneErrorMsg: any;
  phoneNumberValue: string = "";

  @ViewChild("accordion", { static: true }) accordion: AccordionComponent;
  @ViewChild("accordionNVR", { static: true }) accordionNVR: AccordionComponent;

  public designTypeData = [];
  public typeOfUnit = [
    {
      id: "1",
      text: "Select",
    },
    {
      id: "2",
      text: "Hours",
    },
  ];
  public packageTypeData = [
    {
      id: "",
      text: "Select",
    },
    {
      id: "1",
      text: "Package 1",
    },
    {
      id: "2",
      text: "Package 2",
    },
  ];
  buildingTypeData = [
    {
      id: "",
      text: "Select",
    },
  ];
  public sqFtData = [
    {
      id: "",
      text: "Select",
    },
    {
      id: "1",
      text: "sq ft",
    },
    {
      id: "2",
      text: "sq m",
    },
  ];
  statusForm: FormGroup;
  unitTypeVal: any;
  unitTypetxt: any;
  extraUnitData: any[];
  extraUnitForm: FormGroup;
  extraTemplateUnitForm: FormGroup;
  public pkgTypeVal;
  public typeOfTask = [];
  countryData: { id: string; text: string }[];
  countryValue: any;
  countryValueTxt: any;
  emailForm: FormGroup;
  designTypeForm: FormGroup;
  projTypeForm: FormGroup;
  desgnTypeVal = "";
  projectUnitArray: any[];
  editTaskId: any;
  newTaskId: any;
  callCounter = 0;
  ejsDesignTypeData: any[];
  milestoneData: any = [];
  milestTaskForm: FormGroup;

  myForm: FormGroup;
  addCamTypeFormGroup: FormGroup;

  addNVRFormGroup: FormGroup;
  addNVRwithoutPOEFormGroup: FormGroup;

  projCostId: any = "";
  BOQvalue: boolean = false;
  siteVal: boolean = false;
  BOQChecked: any = false;

  siteChecked: any = false;
  projectStatusData: { id: string; text: string }[];
  projStatus: any;
  submitClicked: boolean = false;
  phone: any;
  startdateValue: string;
  disableEndDate: boolean;
  startValChange: boolean;
  minEndDate: any;
  enddateValue: string;
  unitTypeData: any[];
  extraunitTypeVal: any;
  extraunitTypeData: { id: string; text: string }[];
  extraunitTypetxt: any;
  totalHrs: number = 0;
  profit_value: number;
  net_total: any;
  design_hrs: any;
  MilestHrs: any;
  perunitCostHrs = 20;
  profit_margin = 10;
  serviceSummaryTotal = 0;
  serviceSummaryVat = 0;
  serviceSummaryFinal = 0;
  serviceSummaryNetTotal = 0;
  projcountryValue: any;
  projcountryValueTxt: any;
  verifyLoc: boolean;
  nearbyAddress = "";
  nearbyPlaces: google.maps.places.PlaceResult[];
  changed_address: string;

  title: string = "AGM project";
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  @ViewChild("search", { read: ElementRef, static: false })
  searchElementRef: ElementRef;
  public formatted_address;
  public lat;
  public lang;
  public street_number;
  //  public route;
  public locality;
  public administrative_area_level_2;
  public administrative_area_level_1;
  public postal_code;
  public country;
  searchLocVal: string = "";

  public changed_formatted_address;
  public changed_lat;
  public changed_lang;
  public changed_street_number;
  public changed_route;
  public changed_locality;
  public changed_administrative_area_level_2;
  public changed_administrative_area_level_1;
  public changed_postal_code;
  public changed_country;
  public changedLocationData;
  public showNearbyPlaces = false;
  geoCodeData: any;
  @ViewChild(AgmMap, { static: true })
  map: GoogleMap;
  route: any;
  drag: boolean = false;
  public CURRENCY: string;
  public formatRegex: string;
  vat_total: number;
  total_value: any;
  showUpdateCalculate: boolean = false;
  projTypeSubmit: boolean = false;
  allTagsIncluded: boolean = false;
  showUnitLengthErr: boolean;
  plotSqft: string = "sq-ft";
  plotSqm: string = "sq-m";
  selectedInventoryType: string = "New";
  showOrgDetails: boolean = false;
  industryData: { id: string; text: string }[];
  industryValue: any = "";
  addCstformSubmitted: boolean = false;
  totalCostStudy: any;
  totalCostDesign: any;
  totalCostDrawing: any;
  totalCostService: any;
  costText: boolean;
  convertProjId: any;
  convertCstId: any;
  convertCustomerDetails: any;
  convertProjDetails: any;
  contactDetails: any;
  conversionForm: FormGroup;
  contactData = [
    {
      id: "1",
      text: "Select",
    },
    {
      id: "2",
      text: "Contact",
    },
    {
      id: "3",
      text: "Lead",
    },
  ];
  purposeData = [
    {
      id: "1",
      text: "Select",
    },
    {
      id: "2",
      text: "None",
    },
    {
      id: "3",
      text: "Administrative",
    },
    {
      id: "4",
      text: "Negotiation",
    },
  ];
  callResultData = [
    {
      id: "1",
      text: "Select",
    },
    {
      id: "2",
      text: "None",
    },
    {
      id: "3",
      text: "Interested",
    },
    {
      id: "4",
      text: "Not Interested",
    },
  ];
  sortableData = [
    {
      id: "1",
      text: "A - Z",
    },
    {
      id: "2",
      text: "Added Order",
    },
  ];
  checkdata = [
    {
      id: "34f2b91e-8595-4e64-bd3d-a7c86a48ed76",
      org_id: "44919b38-176e-45ce-9b12-db5faef620d6",
      item_code: "",
      item_name: "Network Item",
      item_desc: "NONE",
      origin: "SA",
      brand: "ESA",
      currency: "",
      main_category: "55d13737-6a1b-4926-82d1-482e0ad3cb88",
      sub_category: "Au2POVlTd5",
      sub_category2: "K3loaLdk5cNiqii",
      created_date: "2023-11-20T15:08:26",
      modified_date: "2023-11-20T15:08:26",
      model_no: "4598626",
      status: "Available",
      unit: "011a45e5-a332-4fec-b1c7-e0151a395ccf",
      created_by: "Sazid Khan",
      approver1_emp_id: null,
      approver2_emp_id: null,
      approver1_roleId: "3a932552-c797-4f9d-9227-bf5645b6923d",
      approver2_roleId: "ea9f90da-a9dd-4542-adde-a1223dd0185e",
      approver_date1: null,
      approver_date2: null,
      approved_status: "pending",
      is_approved_1: false,
      is_approved_2: false,
      quantity: "17",
      is_deleted: false,
    },
  ];
  statusArr = [
    {
      id: "Available",
      value: "Available",
    },
    {
      id: "Out of stock",
      value: "Out of stock",
    },
    {
      id: "Discontinued",
      value: "Discontinued",
    },
  ];
  commonTags = [
    { id: 256, value: "Tag A" },
    { id: 369, value: "Tag B" },
    { id: 566, value: "Tag C" },
    { id: 966, value: "Tag D" },
  ];
  InventoryUnitType = [];
  inventoryTags = [];
  filteredTags = [];
  inventoryData = [];
  filteredData = [];
  selectedInvData = [];
  showTextAreaStack = {};
  contactVal: any;
  meetingForm: FormGroup;
  minEndTime: any;
  empData: { id: string; text: string }[];
  empVal: any;
  startmeetTime: string;
  endmeetTime: string;
  endValChange: boolean = false;
  closeAccordion: boolean = false;
  meetingFormSubmit: boolean = false;
  empGroup: any[];
  disableEndTime: boolean;
  notesForm: FormGroup;
  notesEditable: boolean = false;
  editnotesId: any;
  notesData: Object[];
  meetingData: Object[];
  meetingEditable: boolean;
  editMeetId: any;
  meetingToolbar: string[];
  callForm: FormGroup;
  inventorySelector: FormGroup;
  callFormSubmit: boolean = false;
  purposeVal: any;
  purposeValTxt: any;
  callresVal: any;
  callresValTxt: any;
  entityContactData: { id: string; text: string }[];
  entityContactVal: any;
  openActData: Object[];
  openActToolbar: string[];
  callEditable: boolean;
  editCallId: any;
  closeData: Object[];
  closeToolbar: string[];

  public getCountryList() {
    // this.countryData = []
    // this.countryValue=''

    return this.countries.getCountryList().subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        var results = [{ id: "  ", text: "Select" }];

        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            id: data[i].id,
            text: data[i].name,
          });
          if (data[i].name == "United Arab Emirates") {
            (this.countryValue = data[i].id),
              (this.countryValueTxt = data[i].name);
          }
        }

        this.countryData = results;
      },
      (error) => {
        Swal.fire("Error!", "Error.", "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  @ViewChild("accordion", { static: false })
  @ViewChild("inventoryListingGrid", { static: false })
  @ViewChild("inventory_modal", { static: false })
  @ViewChild("templateSelectionModal", { static: false })
  templateSelectionModal: any;
  @ViewChild("serviceSelectionModal", { static: false })
  public acrdn: AccordionComponent;
  @ViewChild("grid", { static: false })
  existingInventoryData$: Observable<any>;
  // public inventoryListingGrid: GridComponent;
  @ViewChild("inventoryListingGrid", { static: false })
  inventoryListingGrid: GridComponent;
  @ViewChild("supplierListingGrid", { static: false })
  supplierListingGrid: GridComponent;
  public grid: GridComponent;
  public ajaxData: string = "";
  prefixExists: boolean = false;
  showAddForm: boolean = false;
  AddNewSubmit: boolean = false;
  editable: boolean = false;
  customerData: { id: string; text: string }[];
  projectData: Object[];
  pageSettings: { pageSizes: boolean; pageCount: number };
  toolbar: string[];
  customerForm: FormGroup;
  customerVal: any;
  addformSubmitted: boolean;
  cstPhoneNumberValue: any = "";
  newTblData = [];
  structureSummary = [];
  flatunitSummary = [];
  selTblData = [];
  editTemplateData = [];
  cstPhone: string;
  cstPhoneInvalid: boolean = false;
  projName: string = "";
  multiOption: Select2Options;
  editableDisc = true;
  public nameChange(e) {
    if (e.target.value != "") {
      this.addformSubmitted = false;
      this.projName = e.target.value;
    } else {
      this.addformSubmitted = true;

      this.isFieldValid("proj_name");
    }
  }
  labelchanged(e) {
    const emails = this.emailForm.get("emails") as FormArray;
    const extras = this.extraUnitForm.get("extras") as FormArray;

    // let tagsdata = [];

    // for (var i = 0; i < emails.value.length; i++) {

    //   if (emails.value[i].tags && emails.value[i].tags.length != 0) {
    //     for (var j = 0; j < emails.value[i].tags.length; j++) {
    //       tagsdata.push(

    //          emails.value[i].tags[j],

    //       );
    //     }
    //   }
    // }

    let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {
      // if (emails.value[i].tags && emails.value[i].tags.length != 0) {
      //   for (var j = 0; j < emails.value[i].tags.length; j++) {
      tagsdata.push(emails.value[i].Label);
      //   }
      // }
    }
    this.tagsArrayValue = tagsdata;
    // console.log('tagsDataRemoved', this.tagsArrayValue)

    var results1 = [];
    for (var i = 0; i < extras.value.length; i++) {
      //  extras.push(this.createEmailFormGroup())
      // extras.at(i).patchValue({ designType:['All'],selection_limit:'1',tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
      //   extras.value[i].Label + ' - '+ (1), 'All'
      // ]):''})
      extras.at(i).patchValue({
        designType: this.tagsArrayValue,
        selection_limit: "1",
        tags:
          this.tagsArrayValue.length != 0
            ? this.tagsArrayValue.concat([
                // extras.value[i].Label + ' - '+ (1)
              ])
            : "",
      });
      this.unitTypeVal = "";
    }
  }

  ExportToExcel(type, fn, dl) {
    var elt = document.getElementById("tbl_exporttable_to_xls");

    // console.log("elt-->", elt);

    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
      : XLSX.writeFile(wb, fn || "MySheetName." + (type || "xlsx"));
  }

  //Function that call the API to Convert JSON to XLSX
  newReport() {
    this.spinner.show();

    let newColArr = this.colDataArr.filter(
      (el: any) => el.text != "Custom Number"
    );
    // console.log("this.colDataArr --->", this.colDataArr);
    // console.log("newColArr--->", newColArr);

    //API for Converting JSON Data to SQL
    //Field ---> Contains all the data of the floors and there number of the Areas i.e Floor 1 --> 1 BHK
    //Cols ---> This Depends on the service which has been selected
    this.projectService
      .ConvertJsontoXLSX({ field: this.newTblData, cols: newColArr })
      .subscribe((data) => {
        if (data != null) {
          console.log("data--->", data);
          window.open(
            "https://circles-pro-backend.onrender.com/sample.xlsx",
            "_blank" // <- This is what makes it open in a new window.
          );
        }
      });
    this.spinner.hide();
  }

  generateSummaryExcelReport() {
    let summaryData = this.summaryFormArray.getRawValue();
    console.log(summaryData, "summaryData");
    if (summaryData.taskList && summaryData.taskList.length > 0) {
      this.spinner.show();
      const reducedSummary = Object.entries(
        summaryData.taskList.reduce((acc, obj) => {
          const {
            MainCat,
            mainCategoryId,
            primaryCategoryId,
            subcategoryId,
            inventory_id,
            ...rest
          } = obj;
          if (!acc[MainCat]) {
            acc[MainCat] = [];
          }
          acc[MainCat].push({ MainCat, ...rest });
          return acc;
        }, {})
      ).map(([key, value]) => ({ key, value }));
      let postData = {
        field: [
          "Service Name",
          "Primary Category",
          "Item Name",
          "Inventory Type",
          "Inventory Item Name",
          "Item Code",
          "Item Description",
          "Total Qty",
          "Remarks",
          "Unit Price",
          "Total Price",
        ],
        value: reducedSummary,
      };
      this.projectService
        .convertSummaryJsontoXLSX(postData)
        .subscribe((data: any) => {
          if (data.filePath != null && data.filePath != "") {
            // console.log('data--->', data);
            window.open(
              "https://circles-pro-backend.onrender.com/samplesummary.xlsx",
              "_blank"
            );
          }
          this.spinner.hide();
          this.toastr.success(
            "Data has been exported successfully",
            undefined,
            {
              positionClass: "toast-top-center",
            }
          );
        });
    } else {
      this.toastr.error(
        "There is no data to be exported! Please complete customization",
        undefined,
        {
          positionClass: "toast-top-center",
        }
      );
    }
  }

  resetPreSumTable() {
    // this.calcUnitForm.reset();
    (this.calcUnitForm.get("calcUnit") as FormArray).clear();
    this.calculateSubmit = false;
    
  }

  submitServiceEdit() {
    if (this.selectedEditService != null && this.selectedEditService != "") {
      console.log(this.selectedEditService, "this.selectedEditService");
      this.spinner.show();
      this.showIntfutSummaryTable = false;
      this.SummaryMatTabVals = this.SummaryMatTabVals.filter(
        (i) =>
          i.MainCat.toString() !== this.selectedEditService.toString().trim()
      );
      let currentSummaryData = this.taskList.getRawValue();
      console.log(currentSummaryData, "currentSummaryData");
      if (currentSummaryData.length > 0) {
        currentSummaryData.forEach((item) => {
          if (item.newValue) {
            this.isNewChecked = true;
            let selectedItem = this.allServicesUnfiltered.find(
              (el) => el.subCategoryId === item.type
            );
            (item.MainType = selectedItem.primaryCategoryName),
              (item.type = selectedItem.subCategoryName),
              (item.primaryCategoryId = selectedItem.primaryCategoryId),
              (item.subcategoryId = selectedItem.subcategoryId),
              (item.newValue = false);
          }
          this.SummaryMatTabVals.push(item);
        });
        // currentSummaryData.forEach((item) => this.SummaryMatTabVals.push(item));
      }
      console.log(this.SummaryMatTabVals, "SummaryMatTabVals!");
      setTimeout((el) => {
        this.spinner.hide();
        this.showIntfutSummaryTable = true;
        this.closeFullScreenModal();
        $("#fullScreenModal").modal("hide");
        this.isNewChecked = true;
      }, 1000);
    } else {
      setTimeout((el) => {
        this.spinner.hide();
        this.showIntfutSummaryTable = true;
        this.isNewChecked = false;
        this.toast.error("Something went wrong!");
      }, 1000);
    }
  }
  populateMatHeaders() {
    this.tabData = [];
    this.tabData.push({ text: "All" });
    let existingServices = this.servicesForm.getRawValue();
    if (existingServices.services.length > 0) {
      existingServices.services.forEach((service) => {
        console.log(service, "EXISTING SERVICES");
        this.tabData.push({ text: service.Label, id: service.id });
      });
      return true;
    } else {
      return false;
    }
  }

  calcUnit() {
    console.log("CLICKED CALC UNIT");
    this.calculateSubmit = true;
    this.spinner.show();
    this.patchValuesToForm();
    this.updateSummaryTable();
    console.log(this.newSummaryTbl, "NEW SUMMARY TBL");
    let checkServiceData = this.populateMatHeaders();
    if (checkServiceData) {
      setTimeout((el) => {
        this.spinner.hide();
        this.showIntfutSummaryTable = true;
        this.closeFullScreenModal();
        console.log(this.tabData, "TAB DATA");
        this.isToBeUpdated = false;
      }, 1000);
    } else {
      setTimeout((el) => {
        this.spinner.hide();

        console.log(this.tabData, "TAB DATA");
        this.toast.warning("There is no service data to be updated!");
        this.isToBeUpdated = false;
      }, 1000);
    }
  }

  public async goBack() {
    window.history.go(-1);
    sessionStorage.clear();
    this.editEnable = false;

    console.log("GO BACK");
  }
  commonResetFunctionsOnEstimate() {
    this.summaryFormArray.reset();
    this.servicesForm.reset();
    this.calculateSubmit = false;
    this.extraUnitForm.reset();
    this.newTblData = [];
    this.catgeryOnlyColumnArr = [];
    this.tempUnitStack = [];
    this.summaryDataArr = [];
    this.structureSummary = [];
    this.flatunitSummary = [];
    this.enableFloorSummary = false;
    this.showIntfutSummaryTable = false;
    this.isEstSummarySaved = false;
    this.SummaryMatTabVals = [];
    let servicesArray = this.servicesForm.get("services") as FormArray;
    servicesArray.clear();
  }
  public onSearchChange() {}
  changedIndustry(e: any): void {
    this.industryValue = e.value;
  }
  public AddCst() {
    // $('#customer_modal').show();
    $("#customer_modal").modal("show");
    this.getCountryList();
    this.GetIndustryByOrgID();
  }
  public AddProjType() {
    // $('#customer_modal').show();
    $("#proj_type_modal").modal("show");
  }
  public OnProjTypeClose() {
    // $('#customer_modal').show();
    $("#proj_type_modal").modal("hide");
  }

  public AddDesignType() {
    // $('#customer_modal').show();
    $("#design_type_modal").modal("show");
  }
  public OnDesignClose() {
    // $('#customer_modal').show();
    $("#design_type_modal").modal("hide");
  }

  public changedProjType(e: any): void {
    this.projTypeVal = e.value;
  }

  public changedBuildType(e: any): void {
    // this.buildTypeVal = e.value;
    this.projectForm.patchValue({
      building_type: e.value,
    });

    console.log(e.value, "VALUE");
    console.log(this.buildingTypeData, "buildingTypeData DATA");
    let selBulTy: any = this.buildingTypeData.filter(
      (el: any) => el.id === e.value
    );
    console.log("selBulTy--->", selBulTy);

    if (selBulTy.length > 0) {
      selBulTy.map((el: any) => {
        el.buildingEntity.map((el) => {
          el["text"] = el.name;
        });
      });
      this.flatTypesData = selBulTy[0].buildingEntity;
      console.log(this.flatTypesData, "CHECKING FlatTypes Data!!!!");
    }
  }
  public changedDesgnType(e: any): void {
    this.desgnTypeVal = e.value;
  }
  public changedPkgType(e: any): void {
    this.pkgTypeVal = e.value;
  }
  public changedCountry(e: any): void {
    this.countryValue = e.value;
    // this.countryValueTxt= e.data[0].text;
    if (e.data[0]) {
      this.countryValueTxt = e.data[0].text;
    }
  }
  public changedProjCountry(e: any): void {
    this.projcountryValue = e.value;
    // this.countryValueTxt= e.data[0].text;
    if (e.data[0]) {
      this.projcountryValueTxt = e.data[0].text;
    }
  }
  public getAllLeadProject() {
    this.leadService.GetAllLeadByOrgID().subscribe(
      (data: any) => {
        let leadProj = [];
        let last_name = [];
        let company = [];

        for (var i = 0; i < data.length; i++) {
          if (data[i].project_name != null) {
            leadProj.push({
              display: data[i].project_name,
              value: data[i].id + ":id",
            });
            last_name.push({
              display: data[i].last_name,
              value: data[i].id + ":id",
              email: data[i].email,
            });
          }
          if (data[i].company_name != null) {
            company.push({
              display: data[i].company_name,
              value: data[i].id + ":id",
              email: data[i].email,
            });
          }
        }
        const projectNameDistinct = [];
        const map = new Map();
        for (const item of leadProj) {
          if (!map.has(item.display)) {
            map.set(item.display, true); // set any value to Map
            projectNameDistinct.push({
              display: item.display,
              value: item.value + ":id",
            });
          }
        }
        const lastNameDistinct = [];
        for (const item of last_name) {
          if (!map.has(item.display)) {
            map.set(item.display, true); // set any value to Map
            lastNameDistinct.push({
              display: item.display,
              value: item.value + ":id",
              email: item.email,
            });
          }
        }
        const companyNameDistinct = [];
        for (const item of company) {
          if (!map.has(item.display)) {
            map.set(item.display, true); // set any value to Map
            companyNameDistinct.push({
              display: item.display,
              value: item.value + ":id",
              email: item.email,
            });
          }
        }

        this.projectNames = projectNameDistinct;
        // this.lastName=lastNameDistinct;
        // this.companyName=companyNameDistinct;
        //this.data12=ds1.dataSource['json'];
        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public CostCalc(typeOfSubmit) {
    const emails = this.emailForm.get("emails") as FormArray;
    const extraUnit = this.extraUnitForm.get("extras") as FormArray;
    let user;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    let projectUnit = [];
    let mainTags = [];
    let extraTags = [];

    let main_unit_qty_all = 0;
    var filterdValues = emails.value.filter(
      (task) => task.size != "" && task.size != null
    );
    if (filterdValues.length != 0) {
      main_unit_qty_all = filterdValues.reduce(function (sum, record) {
        if (record.size != "") return sum + parseInt(record.size);
        else return sum;
      }, 0);
    }
    let extra_unit_qty_all = 0;
    var extraunitfilterdValues = extraUnit.value.filter(
      (task) => task.size != "" && task.size != null
    );
    if (extraunitfilterdValues.length != 0) {
      extra_unit_qty_all = extraunitfilterdValues.reduce(function (
        sum,
        record
      ) {
        if (record.size != "") return sum + parseInt(record.size);
        else return sum;
      },
      0);
    }

    let unit_qty_all = extra_unit_qty_all + main_unit_qty_all;

    for (var i = 0; i < emails.value.length; i++) {
      //let designTypedata = [];
      // if (emails.value[i].designType && emails.value[i].designType.length != 0) {
      //   for (var j = 0; j < emails.value[i].designType.length; j++) {
      //     designTypedata.push({

      //       "id": null,
      //       "org_id": localStorage.getItem('org_id'),
      //       "project_id": null,
      //       "design_type_id": emails.value[i].designType[j],

      //       [typeOfSubmit]: user['full_name'],

      //     });
      //   }
      // }

      let tagsdata = [];
      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push({
            id: null,
            org_id: localStorage.getItem("org_id"),
            project_id: null,
            tags: emails.value[i].tags[j],

            [typeOfSubmit]: user["full_name"],
          });
          mainTags.push(emails.value[i].tags[j]);
        }
      }

      //  if (emails.value[i].size != '') {
      projectUnit.push({
        id: null,
        org_id: localStorage.getItem("org_id"),
        project_id: null,
        unit_id: emails.value[i].id != "" ? emails.value[i].id : null,
        unit_name: emails.value[i].Label,
        no_of_unit: 1,
        unit_qty: emails.value[i].size != "" ? emails.value[i].size : null,
        unit_qty_all: unit_qty_all,
        note: emails.value[i].notes != "" ? emails.value[i].notes : null,
        is_extra: false,
        [typeOfSubmit]: user["full_name"],
        // "projectDesignType_ID": emails.value[i].designType.length!=0 ? emails.value[i].designType : null,
        projectDesignType_ID: null,
        projectTags: tagsdata.length != 0 ? tagsdata : null,
      });
      // }
    }

    let unitlength = emails.length != 0 ? emails.length : 0;
    for (var i = 0; i < extraUnit.value.length; i++) {
      //let designTypedata = [];
      // if (emails.value[i].designType && emails.value[i].designType.length != 0) {
      //   for (var j = 0; j < emails.value[i].designType.length; j++) {
      //     designTypedata.push({

      //       "id": null,
      //       "org_id": localStorage.getItem('org_id'),
      //       "project_id": null,
      //       "design_type_id": emails.value[i].designType[j],

      //       [typeOfSubmit]: user['full_name'],

      //     });
      //   }
      // }
      let tagsdata = [];
      if (
        extraUnit.value[i].designType &&
        extraUnit.value[i].designType.length != 0
      ) {
        for (var j = 0; j < extraUnit.value[i].designType.length; j++) {
          if (extraUnit.value[i].designType[0] == "All") {
            for (var k = 0; k < extraUnit.value[i].tags.length; k++) {
              tagsdata.push({
                id: null,
                org_id: localStorage.getItem("org_id"),
                project_id: null,
                tags: extraUnit.value[i].tags[k],

                [typeOfSubmit]: user["full_name"],
              });
              extraTags.push(extraUnit.value[i].tags[k]);
            }
          } else {
            tagsdata.push({
              id: null,
              org_id: localStorage.getItem("org_id"),
              project_id: null,
              tags: extraUnit.value[i].designType[j],

              [typeOfSubmit]: user["full_name"],
            });
            extraTags.push(extraUnit.value[i].designType[j]);
          }
        }
      }

      //  if (emails.value[i].size != '') {
      projectUnit.push({
        id: null,
        org_id: localStorage.getItem("org_id"),
        project_id: null,
        unit_id: extraUnit.value[i].id != "" ? extraUnit.value[i].id : null,
        unit_name: extraUnit.value[i].Label,
        no_of_unit: 1,
        is_extra: true,
        unit_qty:
          extraUnit.value[i].size != "" ? extraUnit.value[i].size : null,
        unit_qty_all: unit_qty_all,
        note: extraUnit.value[i].notes != "" ? extraUnit.value[i].notes : null,

        [typeOfSubmit]: user["full_name"],
        total_unit:
          extraUnit.value[i].designType[0] == "All"
            ? unitlength
            : tagsdata.length != 0
            ? tagsdata.length
            : null,
        // "projectDesignType_ID": emails.value[i].designType.length!=0 ? emails.value[i].designType : null,
        projectDesignType_ID: null,
        projectTags: tagsdata.length != 0 ? tagsdata : null,
      });
      // } Swal.fire
    }
    if (projectUnit.length == 0) {
      projectUnit = null;
    }
    if (extraUnit.value.length != 0) {
      if (extraTags.includes("All")) {
        this.allTagsIncluded = true;
      } else {
        var result = mainTags.filter((item) => extraTags.indexOf(item) == -1);
        if (result.length == 0) {
          this.allTagsIncluded = true;
        } else {
          this.allTagsIncluded = false;
          Swal.fire("Warning!", "Please include all the units", "warning").then(
            (result) => {}
          );
        }
      }
    }
    this.projectUnitArray = projectUnit;

    return projectUnit;
  }
  public checkIsLoc(e) {
    if (e.srcElement.checked) {
      this.verifyLoc = true;
    } else {
      this.verifyLoc = false;
    }
  }
  focusFunction() {
    if (this.searchElementRef.nativeElement.value == "") {
      this.showNearbyPlaces = true;
    } else {
      this.showNearbyPlaces = false;
    }
    this.mapsAPILoader.load().then(() => {
      this.nearByPlaces();
    });
  }
  keyup(event) {
    this.showNearbyPlaces = false;

    if (event.keyCode == 8 && this.searchElementRef.nativeElement.value == "")
      this.showNearbyPlaces = true;
    this.searchLocVal = "";

    this.mapsAPILoader.load().then(() => {
      this.nearByPlaces();
    });
  }

  clickFunction() {
    if (this.searchElementRef.nativeElement.value == "") {
      this.showNearbyPlaces = true;
    } else {
      this.showNearbyPlaces = false;
    }
    this.mapsAPILoader.load().then(() => {
      this.nearByPlaces();
    });
  }

  selectNearBy(nearbyPlace) {
    this.nearbyAddress = nearbyPlace.name;
    this.searchLocVal = nearbyPlace.name;
    this.address = nearbyPlace.name;
    // this.changed_address=nearbyPlace.name;
    // this.web_site = place.website;
    // this.name = place.name;

    // this.getChangedMatchedTypes()
    this.ngZone.run(() => {
      this.latitude = nearbyPlace.geometry.location.lat();
      this.longitude = nearbyPlace.geometry.location.lng();
      this.showNearbyPlaces = false;
      this.zoom = 12;
    });

    //set latitude, longitude and zoom
  }
  public nearByPlaces() {
    // this.editableLoc=true;
    if (this.editable == false) {
      this.setCurrentLocation();
    }
    // let nearbyplaces= new google.maps.places.PlacesService(map);
    this.geoCoder = new google.maps.Geocoder();
    let nearby = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    nearby.nearbySearch(
      {
        location: { lat: this.latitude, lng: this.longitude },
        radius: 100,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            // this.createMarker(results[i]);
          }
        }
        this.nearbyPlaces = results;
      }
    );
  }
  private setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;

        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        this.geoCodeData = results[2];

        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            if (this.drag == true) {
              this.getMatchedTypes();
              this.searchElementRef.nativeElement.value =
                results[0].formatted_address;
            }

            this.address = results[0].formatted_address;
            this.formatted_address = results[2].formatted_address;
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }
  public getMatchedTypes() {
    let address_components;
    if (this.geoCodeData.length != 0) {
      address_components = this.geoCodeData["address_components"];
    }

    let i, j, types;
    let address_component;
    // Loop through the Geocoder result set. Note that the results
    // array will change as this loop can self iterate.
    for (i = 0; i < address_components.length; i++) {
      types = address_components[i]["types"];

      for (j = 0; j < types.length; j++) {
        if (types[j] == "street_number") {
          this.street_number = address_components[i]["short_name"];
        }
        if (types[j] === "route") {
          this.route = address_components[i]["long_name"];
        }
        // if (types[j] === 'formatted_address') {
        //   this.formatted_address =  address_components[i]['long_name'];
        // }
        if (types[j] === "neighborhood") {
          this.street_number = address_components[i]["long_name"];
        }
        if (types[j] === "locality") {
          this.locality = address_components[i]["long_name"];
        }
        if (types[j] === "administrative_area_level_1") {
          this.administrative_area_level_1 = address_components[i]["long_name"];
        }
        if (types[j] === "administrative_area_level_2") {
          this.administrative_area_level_2 = address_components[i]["long_name"];
        }
        if (types[j] === "postal_code") {
          this.postal_code = address_components[i]["long_name"];
        }
        if (types[j] === "country") {
          this.country = address_components[i]["long_name"];
        }
      }
    }

    // address_component = address_components[element];
  }
  public onBOQChange(e) {
    if (e.srcElement.checked == true) {
      this.BOQvalue = true;
    } else {
      this.BOQvalue = false;
    }
  }
  public onSitVisitChange(e) {
    if (e.srcElement.checked == true) {
      this.siteVal = true;
    } else {
      this.siteVal = false;
    }
  }
  onChange(event) {
    if (event) {
      let phoneNo = {
        PhoneNumber: event.dialCode + event.number,
      };
      this.phoneNumberValue = event.dialCode + event.number;
      this.empService.IsPhoneValid(phoneNo).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.phoneInvalid = false;
          } else {
            this.phoneInvalid = true;
            this.phoneErrorMsg = data["desc"];
          }
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    }
  }
  public changedUnitType(e) {
    // console.log('unitTypetxt', e.data)
    this.unitTypeVal = e.value;
    if (e.data && e.data[0].text) {
      this.unitTypetxt = e.data[0].text;
    }
  }
  changedExtraUnitType(e) {
    this.extraunitTypeVal = e.value;
    if (e.data[0].text) {
      this.extraunitTypetxt = e.data[0].text;
    }
  }
  changedServiceName(e) {
    console.log("DataValue", this.serviceNames, e);

    this.serviceNameVal = e.value;
    if (e.data[0].text) {
      this.serviceNameValTxt = e.data[0].text;
    }
  }
  changedServiceCategName(e) {
    this.serviceCategNameVal = e.value;
    // console.log('changedServiceCategName', e);
    if (e.itemData) {
      this.serviceCategNameValTxt = e.itemData.text;
      // this.serviceCategNamesTxt.push(e.itemData);
    }
  }
  onRemoveServiceName(e) {
    // console.log('onRemoveServiceName', e);
    // this.serviceCategNamesTxt.splice(e.itemData);
  }
  public AddUnit(index) {
    console.log("kitti");
    const emails = this.emailForm.get("emails") as FormArray;
    const extras = this.extraUnitForm.get("extras") as FormArray;

    if (this.unitTypeVal != "") {
      this.showUnitLengthErr = false;

      // this.showAssigneeApprove=false;
      // this.showAssigneeLead=false;
      // this.showApprover=false;
      // this.submitClicked=true;
      // if(this.emailForm.get('emails').status=='VALID'){
      // emails.push(this.createEmailFormGroup())
      this.milestoneData = [];
      this.editableTotal = false;
      this.editableDisc = true;
      this.editable = true;

      this.discount_amount = "";

      emails.insert(index, this.createEmailFormGroup());
      // console.log('AddUnitDesc', emails.value);

      // console.log('AddUnitDesc', this.unitTypetxt);
      const checker = (value) =>
        [this.unitTypetxt].some((element) => value.includes(element));

      // // console.log('checker',checker)

      let commonValues = [];
      if (emails.value.length != 0) {
        for (var i = 0; i < emails.value.length; i++) {
          let checkerArr =
            emails.value[i].tags.length != 0 &&
            emails.value[i].tags.filter(checker);
          if (checkerArr != false && checkerArr.length != 0) {
            commonValues.push(parseInt(checkerArr[0].slice(-1)));
          }
          // console.log('checkerArr', checkerArr)
        }
      }
      // console.log('commonValues', commonValues);
      let maxValue;
      if (commonValues.length != 0) {
        maxValue = Math.max(...commonValues);
        // console.log('maxValues', Math.max(...commonValues));
      } else {
        maxValue = 0;
      }
      // console.log('commonValues', commonValues);
      let addValue;
      if (commonValues.length == 0) {
        addValue = this.unitTypetxt + "-" + 1;
      } else {
        let maxValue = Math.max(...commonValues);
        // console.log('maxValues', Math.max(...commonValues));

        addValue = this.unitTypetxt + "-" + (maxValue + 1);
      }
      //     this.submitClicked=false;
      //     let addValue;
      //     let tags=emails.value[index].tags
      //     if(isNaN(parseInt(tags[0].slice(-1))+1)){
      //       addValue=emails.value[index].tags[0] +' - '+ 1

      //     }else{
      // addValue=(emails.value[index].Label  +' - '+ (parseInt(tags[0].slice(-1))+1))

      //     }
      let user_info: object;
      if (localStorage.getItem("user_info")) {
        user_info = JSON.parse(localStorage.getItem("user_info"));
      }
      let postData = {
        projectID: sessionStorage.getItem("modifyProjId"),
        subTaskName: this.unitTypetxt + " - " + (maxValue + 1),
        isAdded: true,
        isRemoved: false,
        estID: sessionStorage.getItem("costId"),
        // "unit_name":this.unitTypetxt,
        projectUnit: {
          id: null,
          org_id: localStorage.getItem("org_id"),
          project_id: sessionStorage.getItem("costId"),
          unit_id: this.unitTypeVal,
          unit_name: this.unitTypetxt,
          no_of_unit: null,
          unit_qty: null,
          unit_qty_all: null,
          total_unit: null,
          note: null,
          is_extra: false,

          createdby: user_info["full_name"],

          projectDesignType_ID: null,
          projectTags: [
            {
              id: null,
              project_id: sessionStorage.getItem("costId"),
              unit_id: this.unitTypeVal,
              tags: this.unitTypetxt + " - " + (maxValue + 1),
              createdby: user_info["full_name"],
              is_added: true,
              is_removed: false,
            },
          ],
        },

        // "orgID": localStorage.getItem('org_id')
      };
      // console.log('modifypostData', postData);
      if (this.showModification == true) {
        this.projectService
          .FindSubTaskBySubTaskNameAndProjectID(postData)
          .subscribe(
            (data: any) => {
              if (data) {
                this.spinner.hide();
                this.removedTaskList = data;
                let addedTaskList = [];
                let deletedTaskList = [];
                for (var i = 0; i < data.length; i++) {
                  if (data[i].is_added == 1) {
                    addedTaskList.push(data[i]);
                  } else {
                    deletedTaskList.push(data[i]);
                  }
                }
                this.deletedTaskList = deletedTaskList;
                this.addedTaskList = addedTaskList;
                this.modified_cost = data
                  .map((item) =>
                    parseFloat(item.amount != null ? item.amount : 0)
                  )
                  .reduce((prev, next) => prev + next);
                let decimalValues = [];
                for (var i = 0; i < data.length; i++) {
                  let t = data[i].worked_hrs.split(":");
                  var dec = parseInt(t[0], 10) * 1 + parseInt(t[1], 10) / 60;
                  decimalValues.push(dec);
                }
                let modified_hrs = decimalValues
                  .map((item) => parseFloat(item != null ? item : 0))
                  .reduce((prev, next) => prev + next);
                var sign = modified_hrs < 0 ? "-" : "";
                var min = Math.floor(Math.abs(modified_hrs));
                var sec = Math.floor((Math.abs(modified_hrs) * 60) % 60);
                this.modified_hrs =
                  sign +
                  (min < 10 ? "0" : "") +
                  min +
                  ":" +
                  (sec < 10 ? "0" : "") +
                  sec;
                // this.modified_cost=data.map(item =>parseFloat(item.amount)).reduce((prev, next) => prev + next);
                // console.log('total_cost', this.modified_cost)
              }
            },
            (error) => {
              this.spinner.hide();

              Swal.fire("Error!", error, "error").then((result) => {});
            }
          );
      }
      emails.at(index).patchValue({
        Label: addValue,
        designType: ["All"],
        tags: [this.unitTypetxt + " - " + (maxValue + 1)],
        id: this.unitTypeVal,
        disabledTag: false,
      });

      this.unitTypeVal = "";
      let tagsdata = [];

      for (var i = 0; i < emails.value.length; i++) {
        if (emails.value[i].tags && emails.value[i].tags.length != 0) {
          for (var j = 0; j < emails.value[i].tags.length; j++) {
            tagsdata.push(emails.value[i].tags[j]);
          }
        }
      }

      var results1 = [];

      for (var i = 0; i < extras.value.length; i++) {
        //  extras.push(this.createEmailFormGroup())
        // extras.at(i).patchValue({designType:['All'], tags:tagsdata.length!=0?tagsdata.concat([
        //    'All'
        // ]):''})
        extras.at(i).patchValue({
          designType: tagsdata,
          tags: tagsdata.length != 0 ? tagsdata : "",
        });
      }
    }
    // for (var i = 0; i < this.extraUnitData.length; i++) {

    //   extras.push(this.createEmailFormGroup())

    //   // results1.push({ Label:  this.extraUnitData[i].text, id:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox,tags:([ this.extraUnitData[i].text + ' - '+ (1)]) })
    //   results1.push({tags:this.tagsArrayValue.length!=0?this.tagsArrayValue:'' })
    //   // extras.controls.forEach(pair => pair.patchValue({ Label:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox }));

    // }
    // extras.patchValue(results1);

    //}
  }
  public AddExtraUnit(index) {
    this.isHandleSave = true
    const emails = this.emailForm.get("emails") as FormArray;
    const extras = this.extraUnitForm.get("extras") as FormArray;
    const servicesForm = this.servicesForm.get("services") as FormArray;
    if (this.extraunitTypeVal != "") {
      this.milestoneData = [];
      this.editableTotal = false;
      this.editableDisc = true;
      this.showUnitLengthErr = false;
      this.discount_amount = "";

      extras.insert(index, this.createEmailFormGroup());

      let tagsdata = [];

      for (var i = 0; i < emails.value.length; i++) {
        if (emails.value[i].tags && emails.value[i].tags.length != 0) {
          for (var j = 0; j < emails.value[i].tags.length; j++) {
            tagsdata.push(emails.value[i].tags[j]);
          }
        }
      }
      const checker = (value) =>
        [this.extraunitTypetxt].some((element) => value.includes(element));
      let commonValues = [];
      for (var i = 0; i < extras.value.length; i++) {
        if (extras.value[i].Label != "") {
          let checkerArr = [];
          //   if(emails.value[i].Label.includes("-")){
          //  checkerArr=[emails.value[i].Label.split('-')[0]].filter(checker);
          //   }if(emails.value[i].Label.includes("-")==false){
          checkerArr = [extras.value[i].Label].filter(checker);

          //}
          // console.log('checker', checkerArr);
          if (checkerArr.length != 0) {
            // if(isNaN(parseInt(checkerArr[0].slice(-1)))){
            //   commonValues.push(0)
            // }else{
            commonValues.push(
              isNaN(parseInt(checkerArr[0].slice(-1))) == true
                ? 0
                : parseInt(checkerArr[0].slice(-1))
            );

            //}
          }
        }
        // // console.log('checker', commonValues.push(checkerArr[0]));
      }
      // console.log('commonValues', commonValues);
      let addValue;
      if (commonValues.length == 0) {
        addValue = this.extraunitTypetxt;
      } else {
        let maxValue = Math.max(...commonValues);
        // console.log('maxValues', Math.max(...commonValues));

        addValue = this.extraunitTypetxt + "-" + (maxValue + 1);
      }

      let user_info: object;
      if (localStorage.getItem("user_info")) {
        user_info = JSON.parse(localStorage.getItem("user_info"));
      }
      let tagsObj = [];
      for (var j = 0; j < tagsdata.length; j++) {
        tagsObj.push({
          id: null,

          project_id: sessionStorage.getItem("costId"),
          unit_id: null,
          tags: tagsdata[j],
          is_added: true,
          is_removed: false,
          createdby: user_info["full_name"],
        });
      }

      extras.at(index).patchValue({
        Label: addValue,
        id: this.extraunitTypeVal,
        designType: tagsdata,
        Value: 1,
        tags: tagsdata.length != 0 ? tagsdata : "",
        selection_limit: "1",
      });
      this.extraunitTypeVal = "";

      let tagsObjdata = [];
      for (var i = 0; i < extras.value.length; i++) {
        if (extras.value[i].Label) {
          tagsObjdata.push(extras.value[i].Label);
        }
      }

      for (var i = 0; i < servicesForm.value.length; i++) {
        servicesForm.at(i).patchValue({
          designType: tagsObjdata,
          tags: tagsObjdata.length != 0 ? tagsObjdata : "",
        });
      }
    }

    //}
  }
  keytab(event) {
    let element = event.srcElement.nextElementSibling; // get the sibling element

    if (element == null)
      // check if its null
      return;
    else element.focus(); // focus if not null
  }

  public AddServiceUnit(index) {
    const emails = this.emailForm.get("emails") as FormArray;

    const extras = this.extraUnitForm.get("extras") as FormArray;
    const services = this.servicesForm.get("services") as FormArray;
    console.log(emails, extras, services, "CHECKING *******");
    let userinfo = JSON.parse(localStorage.getItem("user_info"));
    if (services && services.value) {
      let serviceExists = services.value.some(
        (i) => i.id == this.serviceNameVal
      );
      if (serviceExists) {
        this.toast.error("Service Already Exists");
      } else {
        // console.log("Project_id", this.editTaskId);
        // console.log("Service_id", this.serviceNameVal);
        // console.log('org_id', userinfo.org_id);
        // console.log("User_Name", userinfo.full_name);
        console.log(this.serviceNameVal, "CALLED AddServiceUnit");
        let postData = {
          service_id: this.serviceNameVal,
          project_id: this.editTaskId,
          org_id: userinfo.org_id,
          created_by: userinfo.full_name,
        };

        this.intfutService
          .AddProjectService(postData)
          .subscribe((data: any) => {
            if (data.status == 200) {
              console.log(services, "CHECKING EXTRAS");
              if (this.serviceNameVal != "") {
                this.milestoneData = [];
                this.editableTotal = false;
                this.editableDisc = true;
                this.showUnitLengthErr = false;
                this.discount_amount = "";

                services.insert(index, this.createServiceFormGroup());

                let tagsdata = [];

                for (var i = 0; i < extras.value.length; i++) {
                  if (extras.value[i].Label) {
                    // for (var j = 0; j < extras.value[i].tags.length; j++) {
                    tagsdata.push(extras.value[i].Label);
                    // }
                  }
                }

                // console.log('tagsdata', tagsdata);
                const checker = (value) =>
                  [this.serviceNameValTxt].some((element) =>
                    value.includes(element)
                  );
                let commonValues = [];
                for (var i = 0; i < extras.value.length; i++) {
                  if (extras.value[i].Label != "") {
                    let checkerArr = [];
                    checkerArr = [extras.value[i].Label].filter(checker);

                    if (checkerArr.length != 0) {
                      // if(isNaN(parseInt(checkerArr[0].slice(-1)))){
                      //   commonValues.push(0)
                      // }else{
                      commonValues.push(
                        isNaN(parseInt(checkerArr[0].slice(-1))) == true
                          ? 0
                          : parseInt(checkerArr[0].slice(-1))
                      );

                      //}
                    }
                  }
                }

                let addValue;
                if (commonValues.length == 0) {
                  addValue = this.serviceNameValTxt;
                } else {
                  let maxValue = Math.max(...commonValues);
                  // console.log('maxValues', Math.max(...commonValues));

                  addValue = this.serviceNameValTxt + "-" + (maxValue + 1);
                }

                let user_info: object;
                if (localStorage.getItem("user_info")) {
                  user_info = JSON.parse(localStorage.getItem("user_info"));
                }
                let tagsObj = [];
                for (var j = 0; j < tagsdata.length; j++) {
                  tagsObj.push({
                    id: null,

                    project_id: sessionStorage.getItem("costId"),
                    unit_id: null,
                    tags: tagsdata[j],
                    is_added: true,
                    is_removed: false,
                    createdby: user_info["full_name"],
                  });
                }

                let servicesNames = [];
                if (
                  this.serviceNameValTxt == "Structured Cabling System(SCS)"
                ) {
                  servicesNames.push(
                    "Dual",
                    "Single",
                    "12U(600X600X150)",
                    "12U(600X600X350)"
                  );
                } else if (this.serviceNameValTxt == "Access Control System") {
                  servicesNames.push(
                    "CR",
                    "PB",
                    "MLN",
                    "BG",
                    "DC",
                    "Long Range Reader"
                  );
                }

                services.at(index).patchValue({
                  Label: addValue,
                  id: this.serviceNameVal,
                  designType: tagsdata,
                  categid: this.projectForm.get("serviceCategName").value,
                  serviceCateg: servicesNames,
                  tags: tagsdata.length != 0 ? tagsdata : "",
                });
                this.serviceNameVal = "";
              }
              this.serviceCategNameVal = "";
              this.projectForm.patchValue({ serviceCategName: "" });

              var serviceNAMES = [];
              for (var i = 0; i < this.serviceNames.length; i++) {
                for (var k = 0; k < services.value.length; k++) {
                  if (this.serviceNames[i].id != services.value[k].id) {
                    serviceNAMES.push({
                      id: this.serviceNames[i].id,
                      text: this.serviceNames[i].text,
                    });
                    //do stuff
                  }
                }
              }
            } else {
              // console.log("Failure");
            }
          });

        // console.log(services, "CHECKING EXTRAS")
        if (this.serviceNameVal != "") {
          this.milestoneData = [];
          this.editableTotal = false;
          this.editableDisc = true;
          this.showUnitLengthErr = false;
          this.discount_amount = "";

          services.insert(index, this.createServiceFormGroup());

          let tagsdata = [];

          for (var i = 0; i < extras.value.length; i++) {
            if (extras.value[i].Label) {
              // for (var j = 0; j < extras.value[i].tags.length; j++) {
              tagsdata.push(extras.value[i].Label);
              // }
            }
          }
          // console.log('tagsdata', tagsdata);
          const checker = (value) =>
            [this.serviceNameValTxt].some((element) => value.includes(element));
          let commonValues = [];
          for (var i = 0; i < extras.value.length; i++) {
            if (extras.value[i].Label != "") {
              let checkerArr = [];
              //   if(emails.value[i].Label.includes("-")){
              //  checkerArr=[emails.value[i].Label.split('-')[0]].filter(checker);
              //   }if(emails.value[i].Label.includes("-")==false){
              checkerArr = [extras.value[i].Label].filter(checker);

              //}
              // console.log('checker', checkerArr);

              if (checkerArr.length != 0) {
                // if(isNaN(parseInt(checkerArr[0].slice(-1)))){
                //   commonValues.push(0)
                // }else{
                commonValues.push(
                  isNaN(parseInt(checkerArr[0].slice(-1))) == true
                    ? 0
                    : parseInt(checkerArr[0].slice(-1))
                );

                //}
              }
            }
            // // console.log('checker', commonValues.push(checkerArr[0]));
          }
          // console.log('commonValues', commonValues);
          let addValue;
          if (commonValues.length == 0) {
            addValue = this.serviceNameValTxt;
          } else {
            let maxValue = Math.max(...commonValues);
            // console.log('maxValues', Math.max(...commonValues));

            addValue = this.serviceNameValTxt + "-" + (maxValue + 1);
          }

          let user_info: object;
          if (localStorage.getItem("user_info")) {
            user_info = JSON.parse(localStorage.getItem("user_info"));
          }
          let tagsObj = [];
          for (var j = 0; j < tagsdata.length; j++) {
            tagsObj.push({
              id: null,

              project_id: sessionStorage.getItem("costId"),
              unit_id: null,
              tags: tagsdata[j],
              is_added: true,
              is_removed: false,
              createdby: user_info["full_name"],
            });
          }

          // console.log('serviceCategName', this.projectForm.get('serviceCategName').value)
          let servicesNames = [];
          if (this.serviceNameValTxt == "Structured Cabling System(SCS)") {
            servicesNames.push(
              "Dual",
              "Single",
              "12U(600X600X150)",
              "12U(600X600X350)"
            );
          } else if (this.serviceNameValTxt == "Access Control System") {
            servicesNames.push(
              "CR",
              "PB",
              "MLN",
              "BG",
              "DC",
              "Long Range Reader"
            );
          }
          // if(this.projectForm.get('serviceCategName').value!='' && this.projectForm.get('serviceCategName').value!=null){
          //   let serviceNames=this.projectForm.get('serviceCategName').value
          //   for(var i=0;i<serviceNames.length;i++){
          // for(var j=0;j<this.serviceCategNames.length;j++){
          //   if(serviceNames[i]==this.serviceCategNames[j].id){
          //     servicesNames.push(
          //       this.serviceCategNames[j].text
          //     )
          //   }
          // }
          //   }
          //   // console.log('serviceCategNamesArray',services);
          // }else{
          //   servicesNames=[]
          // }
          // // console.log('serviceCategNamesTxt',this.serviceCategNamesTxt)
          services.at(index).patchValue({
            Label: addValue,
            id: this.serviceNameVal,
            designType: tagsdata,
            categid: this.projectForm.get("serviceCategName").value,
            serviceCateg: servicesNames,
            tags: tagsdata.length != 0 ? tagsdata : "",
          });
          this.serviceNameVal = "";
        }
        this.serviceCategNameVal = "";
        this.projectForm.patchValue({ serviceCategName: "" });

        var serviceNAMES = [];
        for (var i = 0; i < this.serviceNames.length; i++) {
          for (var k = 0; k < services.value.length; k++) {
            if (this.serviceNames[i].id != services.value[k].id) {
              serviceNAMES.push({
                id: this.serviceNames[i].id,
                text: this.serviceNames[i].text,
              });
              //do stuff
            }
          }
        }
        //  this.serviceNames=serviceNAMES;
        //  // console.log('serviceNAMES',serviceNAMES);
      }
    }
  }
  public onAddSubmit() {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }

    const emails = this.emailForm.get("emails") as FormArray;
    const services = this.servicesForm.get("services") as FormArray;
    const extraUnit = this.extraUnitForm.get("extras") as FormArray;
    let unitlength = emails.length != 0 ? emails.length : 0;
    let extraunitlength = extraUnit.length != 0 ? extraUnit.length : 0;
    this.addformSubmitted = true;
    // this.desgnTypeVal;
    let designTypedata = [];
    let user;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    let projectUnit = [];
    for (var i = 0; i < services.value.length; i++) {
      projectUnit.push({
        // "id": null,
        // "org_id": localStorage.getItem('org_id'),
        // "project_id": null,
        unit_id: services.value[i].id != "" ? services.value[i].id : null,
        unit_name: services.value[i].Label,
        // "no_of_unit":1,
        categ_qty:
          services.value[i].categid != "" ? services.value[i].categid : null,
        // "unit_qty_all":unit_qty_all,
        categ:
          services.value[i].serviceCateg != ""
            ? services.value[i].serviceCateg
            : null,
        // "is_extra": false,
        // [typeOfSubmit]: user['full_name'],
        // "projectDesignType_ID":  null,
        // "projectTags": tagsdata.length != 0 ? tagsdata : null
      });
    }
    let floorUnit = [];
    for (var i = 0; i < extraUnit.value.length; i++) {
      floorUnit.push({
        // "id": null,
        // "org_id": localStorage.getItem('org_id'),
        // "project_id": null,
        unit_id: extraUnit.value[i].id != "" ? extraUnit.value[i].id : null,
        unit_name: extraUnit.value[i].Label,
        is_typical: extraUnit.value[i].is_typical,
        fromValue: extraUnit.value[i].fromValue,
        toValue: extraUnit.value[i].toValue,
        Value: extraUnit.value[i].Value,
        flatType: extraUnit.value[i].flatType,
      });
    }
    // console.log('projectUnitdata', projectUnit);
    // console.log('floorUnitdata', floorUnit);

    //   let postData = {

    //     "id": null,
    //     "user_id": user['user_id'],
    //     "org_id": localStorage.getItem('org_id'),
    //    "cst_id": this.customerVal,
    //     "project_type_id": this.projTypeVal,
    //     "package_id":this.pkgTypeVal,
    //     "project_name": this.projectForm.get('project_name').value,
    //     // "project_prefix":this.projectForm.get('prefixVal').value=='is_auto'?this.prefixString:this.projectForm.get('prefix_name').value,
    //     "project_prefix":!this.showPrefixText?this.prefixString:this.projectForm.get('prefix_name').value,

    //     // "is_boq": this.BOQvalue,
    //     "plot_size":this.projectForm.get('plot_size').value,
    //     "plot_size_unit":this.plotValue==1?'sq ft':'sq m',
    //     "buildup_area":this.projectForm.get('built_area').value,
    //     "buildup_area_unit":this.builtUpplotValue==1?'sq ft':'sq m',
    //     // "buildup_area_unit":this.projectForm.get('builtVal').value=='built_sq_ft'?'sq ft':'sq m',

    //     // "is_site_visit": this.siteVal,
    //     "no_of_floors":this.projectForm.get('floor_no').value!=''?this.projectForm.get('floor_no').value:null ,
    //     "total_unit":unitlength,
    //     "createdby": user['full_name'],
    //     "typeOfDesign": this.desgnTypeVal!= '' ? [this.desgnTypeVal] : null,
    //     "projectUnit": this.CostCalc('createdby'),

    // "entityContact": entityContact.length!=0?entityContact:null,
    //   }

    //   if(emails.value.length==0 || extraUnit.value.length==0){
    //     this.showUnitLengthErr=true;
    //   }else{
    //     this.showUnitLengthErr=false;

    //   }
    // // console.log('postData',postData);

    // if (this.projectForm.status=='VALID' && this.emailForm.get('emails').status=='VALID'&& this.extraUnitForm.get('extras').status=='VALID'  && this.allTagsIncluded==true && emails.value.length!=0 && extraUnit.value.length!=0 && this.desgnTypeVal!=''  ) {
    //   this.spinner.show();

    //   return this.costService.AddCostProject(postData).subscribe(
    //     (data: any) => {

    //       // if (data.status == 200) {
    //         this.spinner.hide();
    //         postData['id']=data['id']
    //         this.projCostId=data['id'];
    //        this.callCostProj(data['id']);
    //       this.addformSubmitted=false;

    //         // this.toastr.success(data['desc'], undefined, {
    //         //   positionClass: 'toast-top-center'
    //         // });

    //      // }
    //       //  else {
    //       //   this.spinner.hide();

    //       //   Swal.fire(
    //       //     'Error!',
    //       //     data['result'].desc,
    //       //     'error'
    //       //   ).then(
    //       //     (result) => {
    //       //
    //       //     })
    //       // }
    //     },
    //     error => {
    //       this.spinner.hide();

    //       Swal.fire(
    //         'Error!',
    //         'Error.',
    //         'error'
    //       ).then(
    //         (result) => {

    //         })

    //     }

    //   )

    // }
  }
  public setPrimary(index) {
    for (var i = 0; i < this.branchDataSource.length; i++) {
      if (i == index) {
        this.branchDataSource[i]["is_primary"] = true;
      } else {
        // emails.at(i).patchValue({primaryAccValue:'no' })
        this.branchDataSource[i]["is_primary"] = false;
      }
    }
  }
  public onUpdateCost() {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    let entityContact = [];
    for (var i = 0; i < this.branchDataSource.length; i++) {
      entityContact.push({
        id: this.branchDataSource[i].id,
        entity_id: this.branchDataSource[i].entity_id,
        name:
          this.branchDataSource[i].first_name +
          " " +
          this.branchDataSource[i].last_name,
        first_name: this.branchDataSource[i].first_name,
        last_name: this.branchDataSource[i].last_name,
        position: null,
        department: this.branchDataSource[i].department,
        designation: this.branchDataSource[i].designation,
        relationship: this.branchDataSource[i].relationship,
        note: this.branchDataSource[i].note,
        phone: this.branchDataSource[i].phone,
        mobile: null,
        email: this.branchDataSource[i].email,
        adr_1: null,
        adr_2: null,
        city: null,
        country: null,
        is_primary: this.branchDataSource[i].is_primary,
        modifiedby: user_info["full_name"],
      });
    }
    const emails = this.emailForm.get("emails") as FormArray;
    const extraUnit = this.extraUnitForm.get("extras") as FormArray;
    let unitlength = emails.length != 0 ? emails.length : 0;
    let extraunitlength = extraUnit.length != 0 ? extraUnit.length : 0;
    this.addformSubmitted = true;
    // this.desgnTypeVal;
    let designTypedata = [];
    let user;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    this.editableTotal = false;
    this.editableDisc = true;
    this.setReverseCalc(this.projCostId);
    // for (var j = 0; j < this.desgnTypeVal.length; j++) {
    //   designTypedata.push({

    //     "id": null,
    //     "org_id": localStorage.getItem('org_id'),
    //     "project_id": null,
    //     "design_type_id": this.desgnTypeVal[j],

    //     "createdby": user['full_name'],

    //   });
    // }
    // let date=document.getElementById('ntpDate').innerText
    // moment().format('L');

    let postData = {
      // project_name: this.projectForm.get('project_name').value  ,

      // cst_id: this.customerVal,
      // project_type_id:this.projTypeVal,

      id: this.projCostId,
      user_id: user["user_id"],
      org_id: localStorage.getItem("org_id"),
      cst_id: this.customerVal,
      project_type_id: this.projTypeVal,
      package_id: this.pkgTypeVal,
      project_name: this.projectForm.get("project_name").value,
      project_prefix: this.showModification
        ? this.project_prefix_val
        : this.projectForm.get("prefixVal").value == "is_auto"
        ? this.prefixString
        : this.projectForm.get("prefix_name").value,
      // "is_boq": this.BOQvalue,
      // "is_site_visit": this.siteVal,
      no_of_floors:
        this.projectForm.get("floor_no").value != ""
          ? this.projectForm.get("floor_no").value
          : null,
      total_unit: unitlength,
      plot_size: this.projectForm.get("plot_size").value,
      plot_size_unit: this.plotValue == 1 ? "sq ft" : "sq m",
      buildup_area: this.projectForm.get("built_area").value,
      buildup_area_unit: this.builtUpplotValue == 1 ? "sq ft" : "sq m",
      modifiedby: user["full_name"],
      typeOfDesign: this.desgnTypeVal != "" ? [this.desgnTypeVal] : null,
      projectUnit: this.CostCalc("modifiedby"),

      // email: localStorage.getItem('email'),
      //   ...adr1 && {adr1: adr1},
      //  ...adr2 && { adr2:adr2},
      //  ...city && { city: city},
      //   ...contact_name && {primary_cont_name: contact_name},
      //  ...contact_type && {primary_cont_type:contact_type},

      entityContact: entityContact.length != 0 ? entityContact : null,
    };
    // console.log('updatepostData', postData);
    if (
      this.emailForm.get("emails").status == "VALID" &&
      this.projectForm.status == "VALID" &&
      (this.phoneNumberValue != "" ? this.phoneInvalid == false : true) &&
      this.allTagsIncluded == true &&
      this.desgnTypeVal != ""
    ) {
      this.spinner.show();
      let reCalc = false;
      if (sessionStorage.getItem("reCalculate")) {
        reCalc = true;
      } else {
        reCalc = false;
      }
      if (!reCalc) {
        return this.costService.UpdateCostProject(postData).subscribe(
          (data: any) => {
            // if (data.status == 200) {
            this.spinner.hide();

            this.addformSubmitted = false;
            if (this.milestoneData.length != 0) {
              this.acrdn.refresh();
            }
            const emails = this.emailForm.get("emails") as FormArray;
            if (emails.length > 1) {
              emails.clear();
            } else {
              emails.clear();
            }
            const extras = this.extraUnitForm.get("extras") as FormArray;
            if (extras.length > 1) {
              extras.clear();
            } else {
              extras.clear();
            }
            const miles = this.milestTaskForm.get("miles") as FormArray;
            if (miles.length > 1) {
              miles.clear();
            } else {
              miles.clear();
            }
            this.callCostProj(data["id"]);
          },
          (error) => {
            this.spinner.hide();

            Swal.fire("Error!", "Error.", "error").then((result) => {});
          }
        );
      } else {
        this.spinner.hide();
      }
    }
  }
  // public AddUnitDesc(){
  //
  // }
  public AddUnitDesc(index) {
    const emails = this.emailForm.get("emails") as FormArray;

    const arr = ["banana", "banana - 1", "apple", "kiwi", "orange"];
    // console.log('AddUnitDesc', emails.value[index].Label);
    const checker = (value) =>
      [emails.value[index].Label.split("-")[0]].some((element) =>
        value.includes(element)
      );
    let commonValues = [];
    for (var i = 0; i < emails.value.length; i++) {
      if (emails.value[i].tags.length != 0) {
        let checkerArr = emails.value[i].tags.filter(checker);
        // console.log('checker', checkerArr);
        if (checkerArr.length != 0) {
          commonValues.push(checkerArr[0].slice(-1));
        }
      }
      // // console.log('checker', commonValues.push(checkerArr[0]));
    }
    // console.log('commonValues', commonValues);
    let maxValue = Math.max(...commonValues);
    // console.log('maxValues', Math.max(...commonValues));
    let addValue;
    if (commonValues.length == 0) {
      addValue = emails.value[index].Label.split("-")[0] + "-" + 1;
    } else {
      let maxValue = Math.max(...commonValues);
      // console.log('maxValues', Math.max(...commonValues));
      addValue = emails.value[index].Label.split("-")[0] + "-" + (maxValue + 1);

      // addValue=emails.value[index].Label+'-'+(maxValue+1)
    }

    // this.showAssigneeApprove=false;
    // this.showAssigneeLead=false;
    // this.showApprover=false;
    // this.submitClicked=true;
    // if(this.emailForm.get('emails').status=='VALID'){
    // emails.push(this.createEmailFormGroup())
    emails.insert(index + 1, this.createEmailFormGroup());
    this.milestoneData = [];
    this.editableTotal = false;
    this.editableDisc = true;
    this.discount_amount = "";
    // this.UpdateCostProjectDiscountAndTotalCostTaskID('')

    //this.submitClicked=false;
    //     let addValue;
    //     let tags=emails.value[index].tags
    //     if(isNaN(parseInt(tags[0].slice(-1))+1)){
    //       addValue=emails.value[index].tags[0] +' - '+ 1

    //     }else{
    // addValue=(emails.value[index].Label  +' - '+ (maxValue+1))

    //     }
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }

    emails
      .at(index + 1)
      .patchValue({ Label: addValue, tags: [addValue], disabledTag: false });
    let postData = {
      projectID: sessionStorage.getItem("modifyProjId"),
      subTaskName: addValue,
      isAdded: true,
      isRemoved: false,
      estID: sessionStorage.getItem("costId"),
      // "unit_name":this.unitTypetxt,
      projectUnit: {
        id: null,
        org_id: localStorage.getItem("org_id"),
        project_id: sessionStorage.getItem("costId"),
        unit_id: emails.value[index].id,
        unit_name: emails.value[index].Label,
        no_of_unit: null,
        unit_qty: null,
        unit_qty_all: null,
        total_unit: null,
        note: null,
        is_extra: false,

        createdby: user_info["full_name"],

        projectDesignType_ID: null,
        projectTags: [
          {
            id: null,
            project_id: sessionStorage.getItem("costId"),
            unit_id: emails.value[index].id,
            tags: addValue,
            createdby: user_info["full_name"],
            is_added: true,
            is_removed: false,
          },
        ],
      },

      // "orgID": localStorage.getItem('org_id')
    };
    //   let postData={
    //     projectID:sessionStorage.getItem('modifyProjId'),
    //     subTaskName:addValue,
    //     "isAdded": true,
    //     "isRemoved": false,
    //   "estID": sessionStorage.getItem('costId'),
    // "projectTags": {
    //   "id": null,
    //   "project_id": sessionStorage.getItem('costId'),
    //   "unit_id": emails.value[index].id,
    //   "tags": addValue,
    //   "createdby": user_info['full_name'],
    //   "is_added": true,
    //   "is_removed": false
    // }

    //    // "orgID": localStorage.getItem('org_id')
    //   }
    // console.log('modifypostData', postData);
    if (this.showModification == true) {
      this.projectService
        .FindSubTaskBySubTaskNameAndProjectID(postData)
        .subscribe(
          (data: any) => {
            if (data) {
              this.spinner.hide();
              this.removedTaskList = data;
              let addedTaskList = [];
              let deletedTaskList = [];
              for (var i = 0; i < data.length; i++) {
                if (data[i].is_added == 1) {
                  addedTaskList.push(data[i]);
                } else {
                  deletedTaskList.push(data[i]);
                }
              }
              this.deletedTaskList = deletedTaskList;
              this.addedTaskList = addedTaskList;
              this.modified_cost = data
                .map((item) =>
                  parseFloat(item.amount != null ? item.amount : 0)
                )
                .reduce((prev, next) => prev + next);
              let decimalValues = [];
              for (var i = 0; i < data.length; i++) {
                let t = data[i].worked_hrs.split(":");
                var dec = parseInt(t[0], 10) * 1 + parseInt(t[1], 10) / 60;
                decimalValues.push(dec);
              }
              let modified_hrs = decimalValues
                .map((item) => parseFloat(item != null ? item : 0))
                .reduce((prev, next) => prev + next);
              var sign = modified_hrs < 0 ? "-" : "";
              var min = Math.floor(Math.abs(modified_hrs));
              var sec = Math.floor((Math.abs(modified_hrs) * 60) % 60);
              this.modified_hrs =
                sign +
                (min < 10 ? "0" : "") +
                min +
                ":" +
                (sec < 10 ? "0" : "") +
                sec;
              // console.log('total_cost', this.modified_cost)
            }
          },
          (error) => {
            this.spinner.hide();

            Swal.fire("Error!", error, "error").then((result) => {});
          }
        );
    }
    let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {
      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(emails.value[i].tags[j]);
        }
      }
    }
    this.tagsArrayValue = tagsdata;
    // console.log('tagsDataRemoved', this.tagsArrayValue)
    const extras = this.extraUnitForm.get("extras") as FormArray;

    var results1 = [];
    for (var i = 0; i < extras.value.length; i++) {
      //  extras.push(this.createEmailFormGroup())
      // extras.at(i).patchValue({ designType:['All'],selection_limit:'1',tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
      //   extras.value[i].Label + ' - '+ (1), 'All'
      // ]):''})
      extras.at(i).patchValue({
        designType: this.tagsArrayValue,
        selection_limit: "1",
        tags:
          this.tagsArrayValue.length != 0
            ? this.tagsArrayValue.concat([
                // extras.value[i].Label + ' - '+ (1)
              ])
            : "",
      });
      this.unitTypeVal = "";
      // results1.push({ Label:  this.extraUnitData[i].text, id:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox,tags:([ this.extraUnitData[i].text + ' - '+ (1)]) })
      //  results1.push({designType:['All'],tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
      //   this.extraUnitData[i].text + ' - '+ (1), 'All'
      // ]):'' })
      // extras.controls.forEach(pair => pair.patchValue({ Label:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox }));
    }
    // extras.patchValue(results1);

    //}f
  }
  public AddExtraUnitDesc(index) {
    this.isHandleSave = true;
    const emails = this.extraUnitForm.get("extras") as FormArray;
    const emailsForm = this.emailForm.get("emails") as FormArray;
    const servicesForm = this.servicesForm.get("services") as FormArray;

    // this.showAssigneeApprove=false;
    // this.showAssigneeLead=false;
    // this.showApprover=false;
    // this.submitClicked=true;
    // if(this.emailForm.get('emails').status=='VALID'){
    // emails.push(this.createEmailFormGroup())
    emails.insert(index + 1, this.createEmailFormGroup());
    //this.submitClicked=false;
    this.milestoneData = [];
    this.editableTotal = false;
    this.editableDisc = true;
    this.discount_amount = "";
    // this.UpdateCostProjectDiscountAndTotalCostTaskID('')

    let addValue;
    let tags = emails.value[index].Label;
    // console.log('checkedArrays', emails.value[index].Label.includes("-") ? emails.value[index].Label.split('-')[0] : emails.value[index].Label);
    const checker = (value) =>
      [
        emails.value[index].Label.includes("-")
          ? emails.value[index].Label.split("-")[0]
          : emails.value[index].Label,
      ].some((element) => value.includes(element));
    let commonValues = [];
    for (var i = 0; i < emails.value.length; i++) {
      if (emails.value[i].Label != "") {
        let checkerArr = [];
        //   if(emails.value[i].Label.includes("-")){
        //  checkerArr=[emails.value[i].Label.split('-')[0]].filter(checker);
        //   }if(emails.value[i].Label.includes("-")==false){
        checkerArr = [emails.value[i].Label].filter(checker);

        //}
        // console.log('checker', checkerArr);
        if (checkerArr.length != 0) {
          // if(isNaN(parseInt(checkerArr[0].slice(-1)))){
          //   commonValues.push(0)
          // }else{
          commonValues.push(
            isNaN(parseInt(checkerArr[0].slice(-1))) == true
              ? 0
              : parseInt(checkerArr[0].slice(-1))
          );

          //}
        }
      }
      // // console.log('checker', commonValues.push(checkerArr[0]));
    }
    // console.log('commonValues', commonValues);
    let maxValue = Math.max(...commonValues);
    // console.log('maxValues', Math.max(...commonValues));

    // if(isNaN(parseInt(tags.slice(-1))+1)){
    //       addValue=emails.value[index].Label +'-'+ 1

    //     }else{
    // addValue=(emails.value[index].Label.split('-')[0]+'-'+ (parseInt(tags.slice(-1))+1))

    //     }
    if (isNaN(maxValue)) {
      addValue = emails.value[index].Label + "-" + 1;
    } else {
      if (maxValue == 0) {
        addValue =
          emails.value[index].Label.split("-")[0] + "-" + (maxValue + 2);
        // console.log("Before Index", emails.value);
        if (emails.value[0] != null) {
          let newVal = emails.value[0].Label.split("-")[0] + "-" + 1;
          emails.at(0).patchValue({ Label: newVal });
        }
      } else {
        addValue =
          emails.value[index].Label.split("-")[0] + "-" + (maxValue + 1);
      }
    }
    // console.log('')
    let tagsdata = [];

    for (var i = 0; i < emailsForm.value.length; i++) {
      if (emailsForm.value[i].tags && emailsForm.value[i].tags.length != 0) {
        for (var j = 0; j < emailsForm.value[i].tags.length; j++) {
          tagsdata.push(emailsForm.value[i].tags[j]);
        }
      }
    }
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    let tagsObj = [];
    for (var j = 0; j < tagsdata.length; j++) {
      tagsObj.push({
        id: null,

        project_id: sessionStorage.getItem("costId"),
        unit_id: null,
        tags: tagsdata[j],
        is_added: true,
        is_removed: false,
        createdby: user_info["full_name"],
      });
    }
    let postData = {
      unitID: null,
      unitName: addValue,
      estID: sessionStorage.getItem("costId"),
      projectID: sessionStorage.getItem("modifyProjId"),
      isAdded: true,
      isRemoved: false,
      projectTags: tagsdata.length != 0 ? tagsObj : "",
      modifiedBy: user_info["full_name"],
      projectUnit: {
        id: null,
        org_id: localStorage.getItem("org_id"),
        project_id: sessionStorage.getItem("costId"),
        unit_id: null,
        unit_name: addValue,
        no_of_unit: null,
        unit_qty: null,
        unit_qty_all: null,
        total_unit: null,
        note: null,
        is_extra: true,

        createdby: user_info["full_name"],

        projectDesignType_ID: null,
        projectTags: tagsObj.length != 0 ? tagsObj : "",
      },
    };

    // console.log('extramodifypostData', postData);
    if (this.showModification == true) {
      this.costService.SetUnitAddOrRemovedByUnitID(postData).subscribe(
        (data: any) => {
          if (data) {
            this.spinner.hide();
            this.removedTaskList = data;
            let addedTaskList = [];
            let deletedTaskList = [];
            for (var i = 0; i < data.length; i++) {
              if (data[i].is_added == 1) {
                addedTaskList.push(data[i]);
              } else {
                deletedTaskList.push(data[i]);
              }
            }
            this.deletedTaskList = deletedTaskList;
            this.addedTaskList = addedTaskList;
            this.modified_cost = data
              .map((item) => parseFloat(item.amount != null ? item.amount : 0))
              .reduce((prev, next) => prev + next);
            let decimalValues = [];
            for (var i = 0; i < data.length; i++) {
              let t = data[i].worked_hrs.split(":");
              var dec = parseInt(t[0], 10) * 1 + parseInt(t[1], 10) / 60;
              decimalValues.push(dec);
            }
            let modified_hrs = decimalValues
              .map((item) => parseFloat(item != null ? item : 0))
              .reduce((prev, next) => prev + next);
            var sign = modified_hrs < 0 ? "-" : "";
            var min = Math.floor(Math.abs(modified_hrs));
            var sec = Math.floor((Math.abs(modified_hrs) * 60) % 60);
            this.modified_hrs =
              sign +
              (min < 10 ? "0" : "") +
              min +
              ":" +
              (sec < 10 ? "0" : "") +
              sec;
            // console.log('total_cost', this.modified_cost)
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", error, "error").then((result) => {});
        }
      );
    }
    // console.log('tagsdata', tagsdata, addValue);

    emails.at(index + 1).patchValue({
      Label: addValue,
      designType: tagsdata,
      tags: tagsdata.length != 0 ? tagsdata : "",
      Value: 1,
    });
    this.extraunitTypeVal = "";

    let tagsObjdata = [];
    for (var i = 0; i < emails.value.length; i++) {
      if (emails.value[i].Label) {
        tagsObjdata.push(emails.value[i].Label);
      }
    }

    for (var i = 0; i < servicesForm.value.length; i++) {
      servicesForm.at(i).patchValue({
        designType: tagsObjdata,
        tags: tagsObjdata.length != 0 ? tagsObjdata : "",
      });
    }
  }

  editTotal() {
    this.editableTotal = !this.editableTotal;
    this.editableDisc = !this.editableDisc;
    this.setReverseCalc(this.projCostId);
  }
  public RemoveExtraUnitDesc(i: number, label, tagValue, id) {
    this.isHandleSave = true;
    const emails = this.extraUnitForm.get("extras") as FormArray;
    if (emails.length != 0) {
      emails.removeAt(i);
    }
    // console.log('RemoveExtraUnitDesc', i, label, tagValue, id)

    this.editableTotal = false;
    this.editableDisc = true;
    this.milestoneData = [];
    this.discount_amount = "";
    this.editableTotal = false;
    // this.UpdateCostProjectDiscountAndTotalCostTaskID('')

    if (this.editable == true) {
      this.UpdateCostProjectDiscountAndTotalCostTaskID(
        this.projCostId,
        null,
        null,
        "hide"
      );
      this.setReverseCalc(this.projCostId);
    }
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    let tagsObj = [];
    for (var j = 0; j < tagValue.length; j++) {
      tagsObj.push({
        id: null,

        project_id: sessionStorage.getItem("costId"),
        unit_id: id != "" ? id : null,
        tags: tagValue[j],
        is_added: false,
        is_removed: true,
        modifiedBy: user_info["full_name"],
      });
    }

    let postData = {
      unitID: id != "" ? id : null,
      unitName: label,
      estID: sessionStorage.getItem("costId"),
      projectID: sessionStorage.getItem("modifyProjId"),
      isAdded: false,
      isRemoved: true,
      projectTags: tagValue.length != 0 ? tagsObj : "",
      modifiedBy: user_info["full_name"],
      projectUnit: null,
    };

    // console.log('removeextramodifypostData', postData);

    if (this.showModification == true) {
      this.costService.SetUnitAddOrRemovedByUnitID(postData).subscribe(
        (data: any) => {
          if (data) {
            this.spinner.hide();
            this.removedTaskList = data;
            let addedTaskList = [];
            let deletedTaskList = [];
            for (var i = 0; i < data.length; i++) {
              if (data[i].is_added == 1) {
                addedTaskList.push(data[i]);
              } else {
                deletedTaskList.push(data[i]);
              }
            }

            this.deletedTaskList = deletedTaskList;
            this.addedTaskList = addedTaskList;
            this.modified_cost = data
              .map((item) => parseFloat(item.amount != null ? item.amount : 0))
              .reduce((prev, next) => prev + next);
            let decimalValues = [];
            for (var i = 0; i < data.length; i++) {
              let t = data[i].worked_hrs.split(":");
              var dec = parseInt(t[0], 10) * 1 + parseInt(t[1], 10) / 60;
              decimalValues.push(dec);
            }
            let modified_hrs = decimalValues
              .map((item) => parseFloat(item != null ? item : 0))
              .reduce((prev, next) => prev + next);
            var sign = modified_hrs < 0 ? "-" : "";
            var min = Math.floor(Math.abs(modified_hrs));
            var sec = Math.floor((Math.abs(modified_hrs) * 60) % 60);
            this.modified_hrs =
              sign +
              (min < 10 ? "0" : "") +
              min +
              ":" +
              (sec < 10 ? "0" : "") +
              sec;
            // console.log('total_cost', this.modified_cost)
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", error, "error").then((result) => {});
        }
      );
    }
  }
  private createTemplateFormGroup(): FormGroup {
    return new FormGroup({
      secondaryCategoryName: new FormControl(""),
      inventory_id: new FormControl(""),
      inventory_type: new FormControl(""),
      inventory_name: new FormControl(""),
      inventory_brand: new FormControl(""),
    });
  }
  templateFormInputs() {
    this.templateForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      mainCategory: ["", Validators.required],
    });
  }
  public RemoveServiceDesc(i: number, label, tagValue, id) {
    this.spinner.show();
    const emails = this.servicesForm.get("services") as FormArray;
    // if (emails.length != 0) {
    //   emails.removeAt(i)
    // }
    let services = this.servicesForm.get("services") as FormArray;
    let user_infos = JSON.parse(localStorage.getItem("user_info"));
    if (i >= 0 && i < services.length) {
      let deletedService = services.at(i) as FormGroup;
      let deletedServiceId = deletedService.get("id").value;

      // Perform the delete operation
      services.removeAt(i);
      let postdata = {
        service_id: deletedServiceId,
        project_id: this.editEnable ? this.editTaskId : this.newTaskId,
        is_deleted: true,
        modified_by: user_infos.full_name,
      };
      this.intfutService
        .DeleteProjectServicebyID(postdata)
        .subscribe((data: any) => {
          if (data.status == 200) {
            // console.log("Deleted Sucess");
            let summaryForm = this.taskList.value;
            let filteredSummaryData = summaryForm.filter(
              (i) => i.mainCategoryId !== deletedServiceId.toString()
            );
            this.clearExistingServiceData(deletedServiceId);
            // // console.log(this.allservicesArr.filter((em) => em.id === deletedServiceId)[0],"AFTER CHECK")
            this.taskList.clear();
            filteredSummaryData.forEach((data) => {
              // // console.log(data, "CHECKING Data!!!")
              const taskFormGroup = this.addTaskListFrmInput();
              taskFormGroup.patchValue(data);
              this.taskList.push(taskFormGroup);
            });
            // // console.log(summaryForm, filteredSummaryData, deletedServiceId, "TaskList")
            // // console.log(this.taskList.value, "Updated summary value!!!")
          } else {
            // console.log("Not Deleted");
          }
          this.spinner.hide();
        });

      // Now you can use the deletedServiceId for further processing (e.g., send it to your API for deletion)
      // console.log('Deleted service id:', deletedServiceId);
    }

    // console.log('RemoveExtraUnitDesc', i, label, tagValue, id)

    this.editableTotal = false;
    this.editableDisc = true;
    this.milestoneData = [];
    this.discount_amount = "";
    this.editableTotal = false;
    // this.UpdateCostProjectDiscountAndTotalCostTaskID('')

    if (this.editable == true) {
      this.UpdateCostProjectDiscountAndTotalCostTaskID(
        this.projCostId,
        null,
        null,
        "hide"
      );
      this.setReverseCalc(this.projCostId);
    }
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    let tagsObj = [];
    for (var j = 0; j < tagValue.length; j++) {
      tagsObj.push({
        id: null,

        project_id: sessionStorage.getItem("costId"),
        unit_id: id != "" ? id : null,
        tags: tagValue[j],
        is_added: false,
        is_removed: true,
        modifiedBy: user_info["full_name"],
      });
    }

    let postData = {
      unitID: id != "" ? id : null,
      unitName: label,
      estID: sessionStorage.getItem("costId"),
      projectID: sessionStorage.getItem("modifyProjId"),
      isAdded: false,
      isRemoved: true,
      projectTags: tagValue.length != 0 ? tagsObj : "",
      modifiedBy: user_info["full_name"],
      projectUnit: null,
    };

    // console.log('removeextramodifypostData', postData);

    if (this.showModification == true) {
      this.costService.SetUnitAddOrRemovedByUnitID(postData).subscribe(
        (data: any) => {
          if (data) {
            this.spinner.hide();
            this.removedTaskList = data;
            let addedTaskList = [];
            let deletedTaskList = [];
            for (var i = 0; i < data.length; i++) {
              if (data[i].is_added == 1) {
                addedTaskList.push(data[i]);
              } else {
                deletedTaskList.push(data[i]);
              }
            }

            this.deletedTaskList = deletedTaskList;
            this.addedTaskList = addedTaskList;
            this.modified_cost = data
              .map((item) => parseFloat(item.amount != null ? item.amount : 0))
              .reduce((prev, next) => prev + next);
            let decimalValues = [];
            for (var i = 0; i < data.length; i++) {
              let t = data[i].worked_hrs.split(":");
              var dec = parseInt(t[0], 10) * 1 + parseInt(t[1], 10) / 60;
              decimalValues.push(dec);
            }
            let modified_hrs = decimalValues
              .map((item) => parseFloat(item != null ? item : 0))
              .reduce((prev, next) => prev + next);
            var sign = modified_hrs < 0 ? "-" : "";
            var min = Math.floor(Math.abs(modified_hrs));
            var sec = Math.floor((Math.abs(modified_hrs) * 60) % 60);
            this.modified_hrs =
              sign +
              (min < 10 ? "0" : "") +
              min +
              ":" +
              (sec < 10 ? "0" : "") +
              sec;
            // console.log('total_cost', this.modified_cost)
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", error, "error").then((result) => {});
        }
      );
    }
  }
  public clearExistingServiceData(deletedServiceId) {
    var existingServiceData = this.allservicesArr.find(
      (em) => em.id === deletedServiceId
    );

    if (existingServiceData) {
      existingServiceData.primaryCategory =
        existingServiceData.primaryCategory.map((item) => ({
          ...item,
          staticTask: item.staticTask.map(({ detailsArr, ...rest }) => ({
            ...rest,
          })),
        }));

      console.log(existingServiceData, this.allservicesArr, deletedServiceId);
    }
  }

  public RemoveUnitDesc(index: number, tagValue) {
    const emails = this.emailForm.get("emails") as FormArray;
    const extras = this.extraUnitForm.get("extras") as FormArray;
    // console.log('RemoveUnitDesc', index, tagValue[0])

    if (emails.length != 0) {
      emails.removeAt(index);
    }
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }

    let postData = {
      projectID: sessionStorage.getItem("modifyProjId"),
      subTaskName: tagValue[0],
      isAdded: false,
      isRemoved: true,
      estID: sessionStorage.getItem("costId"),
      projectUnit: null,
      // "orgID": localStorage.getItem('org_id')
    };
    // console.log('modifypostData', postData);
    if (this.showModification == true) {
      this.projectService
        .FindSubTaskBySubTaskNameAndProjectID(postData)
        .subscribe(
          (data: any) => {
            if (data) {
              this.spinner.hide();
              this.removedTaskList = data;
              let addedTaskList = [];
              let deletedTaskList = [];
              for (var i = 0; i < data.length; i++) {
                if (data[i].is_added == 1) {
                  addedTaskList.push(data[i]);
                } else {
                  deletedTaskList.push(data[i]);
                }
              }
              this.deletedTaskList = deletedTaskList;
              this.addedTaskList = addedTaskList;
              this.modified_cost = data
                .map((item) =>
                  parseFloat(item.amount != null ? item.amount : 0)
                )
                .reduce((prev, next) => prev + next);
              let decimalValues = [];
              for (var i = 0; i < data.length; i++) {
                let t = data[i].worked_hrs.split(":");
                var dec = parseInt(t[0], 10) * 1 + parseInt(t[1], 10) / 60;
                decimalValues.push(dec);
              }
              let modified_hrs = decimalValues
                .map((item) => parseFloat(item != null ? item : 0))
                .reduce((prev, next) => prev + next);
              var sign = modified_hrs < 0 ? "-" : "";
              var min = Math.floor(Math.abs(modified_hrs));
              var sec = Math.floor((Math.abs(modified_hrs) * 60) % 60);
              this.modified_hrs =
                sign +
                (min < 10 ? "0" : "") +
                min +
                ":" +
                (sec < 10 ? "0" : "") +
                sec;
              // console.log('total_cost', this.modified_cost)
            }
          },
          (error) => {
            this.spinner.hide();

            Swal.fire("Error!", error, "error").then((result) => {});
          }
        );
    }
    this.milestoneData = [];
    this.editableTotal = false;
    this.editableDisc = true;
    this.discount_amount = "";
    // this.UpdateCostProjectDiscountAndTotalCostTaskID('')

    if (this.editable == true) {
      this.UpdateCostProjectDiscountAndTotalCostTaskID(
        this.projCostId,
        null,
        null,
        "hide"
      );
      this.setReverseCalc(this.projCostId);
    }
    let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {
      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(emails.value[i].tags[j]);
        }
      }
    }
    this.tagsArrayValue = tagsdata;
    // console.log('tagsdata', tagsdata);
    var results1 = [];
    for (var j = 0; j < extras.value.length; j++) {
      extras.at(j).patchValue({
        designType: tagsdata,
        selection_limit: "1",
        tags: this.tagsArrayValue.length != 0 ? tagsdata.concat([]) : "",
      });

      //  extras.push(this.createEmailFormGroup())
      // extras.at(i).patchValue({designType:['All'], tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
      //    'All'
      // ]):''})

      // results1.push({ Label:  this.extraUnitData[i].text, id:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox,tags:([ this.extraUnitData[i].text + ' - '+ (1)]) })
      //  results1.push({designType:['All'],tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
      //   this.extraUnitData[i].text + ' - '+ (1), 'All'
      // ]):'' })
      //extras.controls.forEach(pair => pair.patchValue({ Label:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox }));
    }
    //  extras.patchValue(results1);
  }
  public taskDelete(deptId) {
    let postData = {
      id: deptId,
    };
    this.costService.RemoveCostProjectByID(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        if (data.status == 200) {
          this.GetPriorityByOrgID();

          this.toastr.error(data["desc"], undefined, {
            positionClass: "toast-top-center",
          });
        }
        //  let dataObj = JSON.parse(data['token']);

        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public callCostProj(xpost) {
    //  let postData={"id":"96e30345-8486-4511-a0f4-f708cf8a18d6","user_id":"da59e4af-6e4d-4818-a169-d74a90b1c2d9","org_id":"33781a87-ede0-439f-b890-93ad218b2859","cst_id":"c401ca89-8f25-4fdb-8f0d-231e204c8503","project_type_id":"d0f42298-1e54-4e9e-b51c-0f58d473dec7","project_name":"cost proj2","project_prefix":"JOB/20/05/16/000","createdby":"Hifza Kausar","typeOfDesign":[{"id":null,"org_id":"33781a87-ede0-439f-b890-93ad218b2859","project_id":null,"design_type_id":"98b7a8e0-6fef-4db4-8780-d3e763e40bb4","createdby":"Hifza Kausar"}],"projectUnit":[{"id":null,"org_id":"33781a87-ede0-439f-b890-93ad218b2859","project_id":null,"unit_id":"d55bcd4e-92a0-480e-bbf0-7fa6122dae74","unit_name":"Unit 3","no_of_unit":"1","unit_qty":2,"note":"sd","createdby":"Hifza Kausar","projectDesignType":[{"id":null,"org_id":"33781a87-ede0-439f-b890-93ad218b2859","project_id":null,"design_type_id":"7c8bebf5-7b51-4220-969f-d56ce9f15409","createdby":"Hifza Kausar"}],"projectTags":[{"id":null,"org_id":"33781a87-ede0-439f-b890-93ad218b2859","project_id":null,"tags":"Unit 31","createdby":"Hifza Kausar"}]}],"entityContact":{"id":null,"entity_id":null,"name":null,"email":null}}
    // let postData={"id":"46983803-06f7-4a93-b711-27fd5fcbed32","user_id":"16db3011-bde4-4c5a-b7b1-ae43912d9919","org_id":"44919b38-176e-45ce-9b12-db5faef620d6","cst_id":"c4ca8700-a71a-4064-9778-044f3eef0d00","project_type_id":"3d24fd61-6ab7-4b16-835f-98cc18d969de","project_name":"Cost proj1","project_prefix":"JOB/20/05/17/000","createdby":"Sazid Khan","typeOfDesign":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"5a4c49b3-3ca7-437e-9f51-c4fd7bca1843","createdby":"Sazid Khan"}],"projectUnit":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"unit_id":"61ce225b-1b45-409b-8d07-32129f0c365a","unit_name":"360 ( 3D )","no_of_unit":"2","unit_qty":3,"note":null,"createdby":"Sazid Khan","projectDesignType":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"5a4c49b3-3ca7-437e-9f51-c4fd7bca1843","createdby":"Sazid Khan"}],"projectTags":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )1","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )2","createdby":"Sazid Khan"}]}],"entityContact":{"id":null,"entity_id":null,"name":null,"email":null}}

    // let postData={"id":"12a4b0b2-149d-406f-9569-4d57489b93dd","user_id":"16db3011-bde4-4c5a-b7b1-ae43912d9919","org_id":"44919b38-176e-45ce-9b12-db5faef620d6","cst_id":"c4ca8700-a71a-4064-9778-044f3eef0d00","project_type_id":"3d24fd61-6ab7-4b16-835f-98cc18d969de","project_name":"Cost proj2","project_prefix":"JOB/20/05/18/000","createdby":"Sazid Khan","typeOfDesign":null,"projectUnit":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"unit_id":"61ce225b-1b45-409b-8d07-32129f0c365a","unit_name":"360 ( 3D )","no_of_unit":"2","unit_qty":"3","note":null,"createdby":"Sazid Khan","projectDesignType":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"79ce321c-42b2-4639-a2f7-680945a79794","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"df716fcc-6b44-4e8c-837d-0768d4f46289","createdby":"Sazid Khan"}],"projectTags":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )1","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )2","createdby":"Sazid Khan"}]},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"unit_id":"51b0cd6b-3cf2-4587-a88a-fe935b492614","unit_name":"Bed room","no_of_unit":"4","unit_qty":1,"note":"Bedroom4","createdby":"Sazid Khan","projectDesignType":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"ad1b2884-3de2-4ebb-9b4f-246b627564e9","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"design_type_id":"5a4c49b3-3ca7-437e-9f51-c4fd7bca1843","createdby":"Sazid Khan"}],"projectTags":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"Bed room1","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"Bed room2","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"Bed room3","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"Bed room4","createdby":"Sazid Khan"}]}],"entityContact":{"id":null,"entity_id":null,"name":null,"email":null}}
    //let postData={"id":"16996e53-ad07-4003-a2b7-be433ee744bf","user_id":"16db3011-bde4-4c5a-b7b1-ae43912d9919","org_id":"44919b38-176e-45ce-9b12-db5faef620d6","cst_id":"c4ca8700-a71a-4064-9778-044f3eef0d00","project_type_id":"6122752e-25a0-406d-ab5c-9df839e36e6d","project_name":"Costproj5","project_prefix":"JOB/20/05/18/000","is_boq":false,"is_site_visit":false,"no_of_floors":2,"createdby":"Sazid Khan","typeOfDesign":null,"projectUnit":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"unit_id":"61ce225b-1b45-409b-8d07-32129f0c365a","unit_name":"360 ( 3D )","no_of_unit":"2","unit_qty":1,"note":null,"createdby":"Sazid Khan","projectDesignType_ID":["5a4c49b3-3ca7-437e-9f51-c4fd7bca1843"],"projectTags":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )1","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 ( 3D )2","createdby":"Sazid Khan"}]},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"unit_id":null,"unit_name":"360 (1)","no_of_unit":"3","unit_qty":2,"note":"gh","createdby":"Sazid Khan","projectDesignType_ID":["ad1b2884-3de2-4ebb-9b4f-246b627564e9"],"projectTags":[{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 (1)1","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 (1)2","createdby":"Sazid Khan"},{"id":null,"org_id":"44919b38-176e-45ce-9b12-db5faef620d6","project_id":null,"tags":"360 (1)3","createdby":"Sazid Khan"}]}],"entityContact":{"id":null,"entity_id":null,"name":"sas","phone":"+971563874520","email":"as@gm.com"}}
    //  let postData={
    //   "id": "50219e5d-bded-4a4f-8406-397198850e40"

    //  }
    let postData = {
      id: xpost,
    };
    //    if(this.showModification==true){
    //      let modifyPostData={
    //       "estID": sessionStorage.getItem('costId'),
    //       "projectID": sessionStorage.getItem('modifyProjId')
    //      }
    //     this.projectService.FindModifiedSubTaskByProjectID(modifyPostData).subscribe(
    //      (data: any) => {

    //        if (data.length!=0) {

    //          this.spinner.hide();
    //          this.removedTaskList=data;
    //          this.modified_cost=data.map(item =>parseFloat(item.amount!=null?item.amount:0)).reduce((prev, next) => prev + next);
    //          let addedTaskList=[]
    //          let deletedTaskList=[]
    //       for(var i=0;i<data.length;i++){
    //         if(data[i].is_added==1){
    //          addedTaskList.push(data[i])
    //         }else{
    //          deletedTaskList.push(data[i])

    //         }
    //       }
    //       this.deletedTaskList=deletedTaskList;
    //       this.addedTaskList=addedTaskList;
    //           //this.modified_cost=data.map(item =>parseFloat(item.amount)).reduce((prev, next) => prev + next);
    //  // console.log('modified_cost',this.modified_cost)

    //        }

    //      },
    //      error => {
    //        this.spinner.hide();

    //        Swal.fire(
    //          'Error!',
    //          error,
    //          'error'
    //        ).then(
    //          (result) => {

    //          })

    //      }

    //    )

    //   }
    return this.costService.CalculateCostProject(postData).subscribe(
      (data: any) => {
        if (data) {
          this.spinner.hide();

          //  this.callCostProj(postData,id);
          let milestoneArray = [];

          // this.milestoneData=data['CostProjectMilestone'];
          if (data["CostProjectMilestone"]) {
            if (data["CostProjectMilestone"].length != 0) {
              for (var i = 0; i < data["CostProjectMilestone"].length; i++) {
                if (data["CostProjectMilestone"][i].milestone_name == "Study") {
                  // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                  milestoneArray[0] = data["CostProjectMilestone"][i];
                  if (
                    data["CostProjectMilestone"][i]["CostProjectTask"].length !=
                    0
                  ) {
                    let total_hrs = data["CostProjectMilestone"][i][
                      "CostProjectTask"
                    ]
                      .map((item) => parseFloat(item.qty))
                      .reduce((prev, next) => prev + next);
                    let total_cost = data["CostProjectMilestone"][i][
                      "CostProjectTask"
                    ]
                      .map((item) => parseFloat(item.qty) * this.perunitCostHrs)
                      .reduce((prev, next) => prev + next);
                    // let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].length!=0? data['CostProjectMilestone'][i]['CostProjectTask'].reduce(function(sum, record){
                    //   if(record.total_cost_amount != null){
                    //     return sum +parseFloat(record.total_cost_amount) ;

                    //   } else{
                    //     return sum +(parseFloat(record.qty)*(this.perunitCostHrs));
                    //   }

                    // }, 0):0;
                    // parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);

                    // this.design_hrs=total_hrs;
                    milestoneArray[0]["total_hrs"] = total_hrs.toFixed(2);
                    milestoneArray[0]["total_cost"] = total_cost.toFixed(2);
                    this.totalCostStudy = total_cost;
                  }
                }
                if (
                  data["CostProjectMilestone"][i].milestone_name == "Design"
                ) {
                  // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                  milestoneArray[1] = data["CostProjectMilestone"][i];
                  if (
                    data["CostProjectMilestone"][i]["CostProjectTask"].length !=
                    0
                  ) {
                    let total_hrs = data["CostProjectMilestone"][i][
                      "CostProjectTask"
                    ]
                      .map((item) => parseFloat(item.qty))
                      .reduce((prev, next) => prev + next);
                    let total_cost = data["CostProjectMilestone"][i][
                      "CostProjectTask"
                    ]
                      .map((item) => parseFloat(item.qty) * this.perunitCostHrs)
                      .reduce((prev, next) => prev + next);

                    milestoneArray[1]["total_hrs"] = total_hrs.toFixed(2);
                    milestoneArray[1]["total_cost"] = total_cost.toFixed(2);
                    this.totalCostDesign = total_cost;
                  }
                }
                if (
                  data["CostProjectMilestone"][i].milestone_name ==
                  "Shop Drawing"
                ) {
                  // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                  milestoneArray[2] = data["CostProjectMilestone"][i];
                  if (
                    data["CostProjectMilestone"][i]["CostProjectTask"].length !=
                    0
                  ) {
                    let total_hrs = data["CostProjectMilestone"][i][
                      "CostProjectTask"
                    ]
                      .map((item) => parseFloat(item.qty))
                      .reduce((prev, next) => prev + next);
                    let total_cost = data["CostProjectMilestone"][i][
                      "CostProjectTask"
                    ]
                      .map((item) => parseFloat(item.qty) * this.perunitCostHrs)
                      .reduce((prev, next) => prev + next);

                    milestoneArray[2]["total_hrs"] = total_hrs.toFixed(2);
                    milestoneArray[2]["total_cost"] = total_cost.toFixed(2);
                    this.totalCostDrawing = total_cost;
                  }
                }
                if (
                  data["CostProjectMilestone"][i].milestone_name ==
                  "Extra Services"
                ) {
                  // if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){
                  milestoneArray[3] = data["CostProjectMilestone"][i];
                  if (
                    data["CostProjectMilestone"][i]["CostProjectTask"].length !=
                    0
                  ) {
                    let total_hrs = data["CostProjectMilestone"][i][
                      "CostProjectTask"
                    ]
                      .map((item) => parseFloat(item.qty))
                      .reduce((prev, next) => prev + next);
                    let total_cost = data["CostProjectMilestone"][i][
                      "CostProjectTask"
                    ]
                      .map((item) => parseFloat(item.qty) * this.perunitCostHrs)
                      .reduce((prev, next) => prev + next);

                    milestoneArray[3]["total_hrs"] = total_hrs.toFixed(2);
                    milestoneArray[3]["total_cost"] = total_cost.toFixed(2);
                    this.totalCostService = total_cost;
                  }
                }
              }
            }
          }
          this.milestoneData = milestoneArray;
          this.CURRENCY = "CURRENCY";

          this.projectForm.patchValue({
            project_name: data.project_name,
            name: data.EntityContact ? data.EntityContact.name : "",
            phone: data.EntityContact ? data.EntityContact.phone : "",
            email: data.EntityContact ? data.EntityContact.email : "",
            floor_no: data.no_of_floors,
            built_area: data.buildup_area,
            plot_size: data.plot_size,
            city: data.EntityContact ? data.EntityContact.city : "",
            plotVal: data.plot_size_unit == "sq ft" ? "sq_ft" : "sq_m",
            builtVal:
              data.plot_size_unit == "sq ft" ? "built_sq_ft" : "built_sq_m",
            cst_name: data.EntityContact ? data.customer_name : "",
          });
          this.editableTotal = data.is_reverse;
          this.editableDisc = !data.is_reverse;
          this.plotValue = data.plot_size_unit == "sq ft" ? 1 : 2;
          this.builtUpplotValue = data.buildup_area_unit == "sq ft" ? 1 : 2;
          this.project_prefix_val = data.project_prefix;
          if (data.TypeOfDesign) {
            this.desgnTypeVal =
              data.TypeOfDesign.length != 0 ? data.TypeOfDesign[0] : "";
          }
          this.pkgTypeVal = data.package_id != "" ? data.package_id : "";

          this.phone = data.EntityContact ? data.EntityContact.phone : "";
          this.projcountryValue = data.EntityContact
            ? data.EntityContact.country
            : "";
          if (data.cst_id != null) {
            this.customerVal = data.cst_id;
            this.callCstId = data.cst_id;
            //  this.projcountryValue=data.customer.
          }
          if (data.EntityContact != null && data.EntityContact.length != 0) {
            this.showBranchList = true;
            brList = data.EntityContact;
            this.branchDataSource = data.EntityContact;
          } else {
            this.branchDataSource = data.EntityContact;
          }

          // this.customerContactForm.valueChanges.subscribe(
          //  (selectedValue) => {
          if (
            this.customerContactForm.get("fname").status == "VALID" &&
            this.customerContactForm.get("lname").status == "VALID" &&
            this.customerContactForm.get("email").status == "VALID"
          ) {
            this.disableSaveBranch = false;
          } else {
            this.disableSaveBranch = true;
          }
          // }
          // );
          //  this.BOQChecked=data.is_boq;
          //  this.siteChecked=data.is_site_visit;

          var projectUnit = [];

          // let dataObj = JSON.parse(data['token']);
          //
          if (data["ProjectUnit"]) {
            for (var i = 0; i < data["ProjectUnit"].length; i++) {
              // logik to create new items

              projectUnit.push({
                id: data["ProjectUnit"][i].unit_id,
                text: data["ProjectUnit"][i].unit_name,
                is_checkbox: false,
              });
            }
          }

          this.createEditList(data["ProjectUnit"]);
          this.createExtraEditList(
            data["ProjectUnitExtra"],
            data["ProjectUnit"]
          );

          this.createMilestTaskForm(
            data["CostProjectMilestone"],
            data.no_of_floors
          );
          this.projTypeVal = data.project_type_id;
          if (data.discount_amount != null && data.discount_amount != "") {
            this.discount_amount = data.discount_amount;
            // console.log('discount_amount1', this.discount_amount)
          }

          setTimeout(() => {
            const miles = this.milestTaskForm.get("miles") as FormArray;
            if (miles.length != 0) {
              let total_hrs = miles.value
                .map((item) => parseFloat(item.total_cost))
                .reduce((prev, next) => prev + next);
              this.totalHrs = total_hrs;
              let total_milesthrs = miles.value
                .map((item) => parseFloat(item.Qty))
                .reduce((prev, next) => prev + next);
              this.MilestHrs = parseFloat(total_milesthrs).toFixed(2);
              var value = total_hrs * (this.profit_margin / 100);
              let result = Math.round(value * 100) / 100;
              if (this.totalHrs != 0) {
                this.profit_value = result;
              }
              // let net_total=this.profit_value+total_hrs;
              let net_total: any;
              // if(this.showModification){
              //   net_total=this.profit_value+total_hrs+this.modified_cost
              // }else{
              net_total =
                this.profit_value + total_hrs + parseFloat(this.modified_cost);
              // console.log('net_totalVal', net_total);
              // }
              this.total_value = net_total;
              if (data.is_reverse == false) {
                let vat = net_total * (5 / 100);
                this.vat_total = vat;
                this.net_total = vat + net_total;
              }
              if (data.discount_amount != null && data.discount_amount != "") {
                this.discount_amount = data.discount_amount;
                // console.log('discount_amount2', this.discount_amount)

                this.disc_value = data.discount_amount;
                if (data.is_reverse == false) {
                  // if(this.showModification){

                  // this.total_value=this.totalHrs+this.profit_value+parseFloat(data.discount_amount)+this.modified_cost;
                  // }else{
                  this.total_value =
                    this.totalHrs +
                    this.profit_value +
                    parseFloat(data.discount_amount) +
                    parseFloat(this.modified_cost);

                  // }
                } else {
                  // if(this.showModification){

                  // this.total_value=data.total_amount+this.modified_cost
                  // }
                  // else
                  // {
                  this.total_value = parseFloat(data.total_amount);
                  // console.log('ModifiedCost', this.total_value);
                  // }
                }
              } else {
                this.discount_amount = "";
                this.disc_value = "";
                //this.total_value=this.totalHrs+this.profit_value+parseFloat(data.discount_amount);
              }
              // let discountVal=(this.totalHrs)-(this.totalHrs *(e.target.value/100))
              //let discountVal=parseFloat(this.total_value)+parseFloat(data.discount_amount)
              //// console.log('discountVal',discountVal,this.total_value)
              // total_cost=parseInt(Qty)+parseInt(e.value);
              if (data.discount_amount != null && data.discount_amount != "") {
                // this.total_value=parseFloat(data.total_amount);
                // this.total_value=discountVal+(discountVal*(this.profit_margin/100));
                // let net_total=this.profit_value+total_hrs;
                //   this.total_value=net_total;
                if (data.is_reverse == false) {
                  let vat = this.total_value * (5 / 100);
                  this.vat_total = vat;
                  this.net_total = vat + this.total_value;
                } else {
                  this.vat_total = data.vat_amount;
                  this.net_total = data.net_total_amount;
                }
                //this.net_total=discountVal+(discountVal*(this.profit_margin/100));

                this.disc_value = parseFloat(data.discount_amount);
              }
            } else {
              this.totalHrs = 0;
              this.total_value = 0;
              this.vat_total = 0;
              this.net_total = 0;
              this.MilestHrs = 0;
            }

            this.onUpdateFinalCost(xpost);
          }, 500);

          this.GetAllCloseActivitiesEntityID();
          this.GetAllOpenActivitiesEntityID();
          this.FetchEntityNotesEntityID();

          // setTimeout(()=>{

          //   this.prefilleditView(data['ProjectUnit'])

          //   }, 1500);
          //         const emails = this.emailForm.get('emails') as FormArray
          //     var results = [];
          //           // let dataObj = JSON.parse(data['token']);
          //           //

          //     for (var k = 0; k < emails.value.length; k++) {

          //     for (var i = 0; i < data['ProjectUnit'].length; i++) {
          //       if (emails.value[k].Label==data['ProjectUnit'][i].unit_name){
          //
          //        let index = (<FormArray>this.emailForm.get('emails')).controls.findIndex(x => x.value.id === data['ProjectUnit'][i].unit_id);
          //     var ejsResults=[]
          //

          //       // for (var j = 0; j < data['ProjectUnit'][i].ProjectDesignType.length; j++) {

          //       //   ejsResults.push(
          //       //     data['ProjectUnit'][i].ProjectDesignType[j].id,

          //       //   );

          //       // }
          //       var tags=[]

          //       for (var j = 0; j < data['ProjectUnit'][i].ProjectTags.length; j++) {

          //         tags.push(
          //           data['ProjectUnit'][i].ProjectTags[j].tags,

          //         );

          //       }
          //

          //   results.push({ unit_no: data['ProjectUnit'][i].no_of_unit ,size: data['ProjectUnit'][i].unit_qty ,designType:data['ProjectUnit'][i].ProjectDesignType_ID,tags: tags , is_checkbox:  false })
          //   emails.at(index).patchValue({ unit_no: data['ProjectUnit'][i].no_of_unit ,size: data['ProjectUnit'][i].unit_qty ,designType:data['ProjectUnit'][i].ProjectDesignType_ID,tags: tags , is_checkbox:  false })
          //  }
          //       //emails.controls.forEach(pair => pair.patchValue({ Label:  data['ProjectUnit'].id, is_checkbox:  data['ProjectUnit'].is_checkbox }));

          //     }
          //   }
          //emails.patchValue(results);
        } else {
          this.spinner.hide();

          Swal.fire("Error!", data["result"].desc, "error").then(
            (result) => {}
          );
        }
      },
      (error) => {
        this.spinner.hide();

        Swal.fire("Error!", "Error.", "error").then((result) => {});
      }
    );
  }

  public callModifyProj(xpost) {
    let postData = {
      id: xpost,
    };
    return this.projectService
      .ProjectModificationByProjectID(postData)
      .subscribe(
        (data: any) => {
          if (data) {
            this.spinner.hide();

            // let milestoneArray=[];

            // if(data['CostProjectMilestone']){
            // if( data['CostProjectMilestone'].length!=0){
            //   for (var i = 0; i < data['CostProjectMilestone'].length; i++) {
            //     if(data['CostProjectMilestone'][i].milestone_name=='Study'){

            //       milestoneArray[0]=data['CostProjectMilestone'][i]
            //        if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){

            //         let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseFloat(item.qty)).reduce((prev, next) => prev + next);
            //       let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);

            //       milestoneArray[0]['total_hrs']=total_hrs.toFixed(2)
            //       milestoneArray[0]['total_cost']=total_cost.toFixed(2)
            //       this.totalCostStudy=total_cost;

            //        }

            //     }
            //     if(data['CostProjectMilestone'][i].milestone_name=='Design'){
            //         milestoneArray[1]=data['CostProjectMilestone'][i]
            //        if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){

            //       let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseFloat(item.qty)).reduce((prev, next) => prev + next);
            //       let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);

            //       milestoneArray[1]['total_hrs']=total_hrs.toFixed(2)
            //       milestoneArray[1]['total_cost']=total_cost.toFixed(2)
            //       this.totalCostDesign=total_cost;

            //        }
            //     }
            //     if(data['CostProjectMilestone'][i].milestone_name=='Shop Drawing'){
            //         milestoneArray[2]=data['CostProjectMilestone'][i]
            //        if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){

            //       let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseFloat(item.qty)).reduce((prev, next) => prev + next);
            //       let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);

            //       milestoneArray[2]['total_hrs']=total_hrs.toFixed(2)
            //       milestoneArray[2]['total_cost']=total_cost.toFixed(2)
            //       this.totalCostDrawing=total_cost;

            //        }
            //     }
            //     if(data['CostProjectMilestone'][i].milestone_name=='Extra Services'){
            //         milestoneArray[3]=data['CostProjectMilestone'][i]
            //        if(data['CostProjectMilestone'][i]['CostProjectTask'].length!=0){

            //       let total_hrs=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>parseFloat(item.qty)).reduce((prev, next) => prev + next);
            //       let total_cost=data['CostProjectMilestone'][i]['CostProjectTask'].map(item =>(parseFloat(item.qty)*(this.perunitCostHrs))).reduce((prev, next) => prev + next);

            //       milestoneArray[3]['total_hrs']=total_hrs.toFixed(2)
            //       milestoneArray[3]['total_cost']=total_cost.toFixed(2)
            //       this.totalCostService=total_cost;

            //        }
            //     }
            //             }
            // }
            // }
            // this.milestoneData=milestoneArray;
            // this.CURRENCY = 'CURRENCY';

            this.projectForm.patchValue({
              project_name: data.project_name,
              name: data.EntityContact ? data.EntityContact.name : "",
              phone: data.EntityContact ? data.EntityContact.phone : "",
              email: data.EntityContact ? data.EntityContact.email : "",
              floor_no: data.no_of_floors,
              built_area: data.buildup_area,
              plot_size: data.plot_size,
              city: data.EntityContact ? data.EntityContact.city : "",
              plotVal: data.plot_size_unit == "sq ft" ? "sq_ft" : "sq_m",
              builtVal:
                data.plot_size_unit == "sq ft" ? "built_sq_ft" : "built_sq_m",
              cst_name: data.EntityContact ? data.customer_name : "",
            });
            this.projTypeVal = data.project_type_id;

            this.editableTotal = data.is_reverse;
            this.editableDisc = !data.is_reverse;
            this.plotValue = data.plot_size_unit == "sq ft" ? 1 : 2;
            this.builtUpplotValue = data.buildup_area_unit == "sq ft" ? 1 : 2;
            this.project_prefix_val = data.project_prefix;
            if (data.TypeOfDesign) {
              this.desgnTypeVal =
                data.TypeOfDesign.length != 0 ? data.TypeOfDesign[0] : "";
            }
            this.pkgTypeVal = data.package_id != "" ? data.package_id : "";

            //   this.phone=data.EntityContact?data.EntityContact.phone:'';
            //   this.projcountryValue=data.EntityContact?data.EntityContact.country:'';
            if (data.cst_id != null) {
              this.customerVal = data.cst_id;
              this.callCstId = data.cst_id;
            }
            if (data.EntityContact != null && data.EntityContact.length != 0) {
              this.showBranchList = true;
              brList = data.EntityContact;
              this.branchDataSource = data.EntityContact;
            } else {
              this.branchDataSource = data.EntityContact;
            }

            //  if(this.customerContactForm.get('fname').status=="VALID" && this.customerContactForm.get('lname').status=="VALID"&& this.customerContactForm.get('email').status=="VALID"  ){

            //                   this.disableSaveBranch=false;
            //                 } else{
            //                  this.disableSaveBranch=true;

            //                 }

            //  var projectUnit = []

            //  if(data['ProjectUnit']){
            //   for (var i = 0; i < data['ProjectUnit'].length; i++) {

            //     projectUnit.push({
            //       "id": data['ProjectUnit'][i].unit_id,
            //       "text": data['ProjectUnit'][i].unit_name,
            //       "is_checkbox": false
            //     });

            //   }
            //  }

            //  this.createEditList(data['ProjectUnit']);
            //  this.createExtraEditList(data['ProjectUnitExtra'],data['ProjectUnit'])

            //   this.createMilestTaskForm(data['CostProjectMilestone'],data.no_of_floors);
            //   if(data.discount_amount!=null && data.discount_amount!=''){
            //   this.discount_amount=data.discount_amount

            //   }

            // setTimeout(()=>{
            // const miles = this.milestTaskForm.get('miles') as FormArray
            //       if(miles.length!=0){
            //         let total_hrs=miles.value.map(item =>parseFloat(item.total_cost)).reduce((prev, next) => prev + next);
            //         this.totalHrs=total_hrs;
            //         let total_milesthrs=miles.value.map(item =>parseFloat(item.Qty)).reduce((prev, next) => prev + next);
            //         this.MilestHrs=parseFloat(total_milesthrs).toFixed(2);
            //         var value=total_hrs*(this.profit_margin/100);
            //         let result=Math.round(value*100)/100
            //         if(this.totalHrs!=0){
            //           this.profit_value=result ;

            //         }
            //         let net_total=this.profit_value+total_hrs;
            //         this.total_value=net_total;
            //         if(data.is_reverse==false){
            //         let vat=net_total*(5/100);
            //         this.vat_total=vat;
            //         this.net_total=vat+net_total;
            //         }
            //         if(data.discount_amount!=null && data.discount_amount!=''){
            //           this.discount_amount=data.discount_amount;
            //           this.disc_value=data.discount_amount;
            //         if(data.is_reverse==false){

            //           this.total_value=this.totalHrs+this.profit_value+parseFloat(data.discount_amount);
            //         }else{
            //           this.total_value=data.total_amount
            //         }

            //         }else{
            //           this.discount_amount='';
            //           this.disc_value='';

            //         }

            //         if(data.discount_amount!=null && data.discount_amount!=''){

            //         if(data.is_reverse==false){

            //             let vat=this.total_value*(5/100);
            //             this.vat_total=vat;
            //             this.net_total=vat+this.total_value;
            //         }else{
            //           this.vat_total=data.vat_amount
            //           this.net_total=data.net_total_amount;
            //         }

            //         this.disc_value=parseFloat(data.discount_amount);
            //         }

            //       }else{
            //         this.totalHrs=0;
            //         this.total_value=0;
            //         this.vat_total=0;
            //         this.net_total=0;
            //         this.MilestHrs=0;

            //       }

            //   this.onUpdateFinalCost(xpost)
            //     }, 500);

            //     this.GetAllCloseActivitiesEntityID();
            //     this.GetAllOpenActivitiesEntityID();
            //     this.FetchEntityNotesEntityID();
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["result"].desc, "error").then(
              (result) => {}
            );
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
  }
  public createEditList(list) {
    const emails = this.emailForm.get("emails") as FormArray;
    if (emails.length > 1) {
      emails.clear();
    } else {
      emails.clear();
    }
    let disabledTag = false;
    if (this.showModification == true) {
      disabledTag = true;
    } else {
      disabledTag = false;
    }
    this.editable = true;
    // const emails = this.emailForm.get('emails') as FormArray
    var results = [];
    if (list != null && list.length != 0) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].ProjectTags.length != 0) {
          emails.push(this.createEmailFormGroup());
          var tags = [];

          for (var j = 0; j < list[i].ProjectTags.length; j++) {
            tags.push(list[i].ProjectTags[j].tags);
          }

          results.push({
            Label: list[i].unit_name,
            id: list[i].unit_id,
            size: list[i].unit_qty,
            is_checkbox: false,
            tags: tags,
            notes: list[i].note,
            disabledTag: disabledTag,
          });
          // emails.controls.forEach(pair => pair.patchValue({ Label: list[i].id, is_checkbox: list[i].is_checkbox }));
        }
      }
    }

    emails.patchValue(results);
  }
  public createExtraEditList(list, mainlist) {
    const emails = this.extraUnitForm.get("extras") as FormArray;
    const mainunit = this.emailForm.get("emails") as FormArray;
    if (emails.length > 1) {
      emails.clear();
    } else {
      emails.clear();
    }
    this.editable = true;
    // const emails = this.emailForm.get('emails') as FormArray
    var results = [];

    let maintagsdata = [];

    // for (var i = 0; i < mainunit.value.length; i++) {

    //   if (mainunit.value[i].tags && mainunit.value[i].tags.length != 0) {
    //     for (var j = 0; j < mainunit.value[i].tags.length; j++) {
    //       tagsdata.push(

    //          mainunit.value[i].tags[j],

    //       );
    //     }
    //   }
    // }
    if (mainlist != null && mainlist.length != 0) {
      for (var i = 0; i < mainlist.length; i++) {
        var tags = [];

        for (var j = 0; j < mainlist[i].ProjectTags.length; j++) {
          maintagsdata.push(mainlist[i].ProjectTags[j].tags);
        }
      }
      // emails.controls.forEach(pair => pair.patchValue({ Label: list[i].id, is_checkbox: list[i].is_checkbox }));
    }

    //
    // var results1 = [];

    // for (var i = 0; i < emails.value.length; i++) {

    //   //  emails.push(this.createEmailFormGroup())
    //   emails.at(i).patchValue({ tags:tagsdata.length!=0?tagsdata.concat([
    //     emails.value[i].Label + ' - '+ (1), 'All'
    //   ]):''})
    // }
    if (list != null && list.length != 0) {
      for (var i = 0; i < list.length; i++) {
        emails.push(this.createEmailFormGroup());
        var tags = [];

        for (var j = 0; j < list[i].ProjectTags.length; j++) {
          tags.push(list[i].ProjectTags[j].tags);
        }
        tags = tags.filter(function (item) {
          return item !== "All";
        });
        // console.log('tagsFilter', tags)
        // if(tags.includes("All")){
        //   tags=['All']
        // }else{
        //   tags=tags
        // }
        //   results.push({ Label: list[i].unit_name, id: list[i].unit_id,size: list[i].unit_qty, is_checkbox:false,designType:tags,tags: maintagsdata.concat([
        //     'All'
        //  ]),notes:list[i].note })
        results.push({
          Label: list[i].unit_name,
          id: list[i].unit_id,
          size: list[i].unit_qty,
          is_checkbox: false,
          designType: tags,
          tags: maintagsdata,
          notes: list[i].note,
        });
        // emails.controls.forEach(pair => pair.patchValue({ Label: list[i].id, is_checkbox: list[i].is_checkbox }));
      }
    }
    emails.patchValue(results);
  }
  public openUnitModal() {
    $("#unit_modal").modal("show");
  }
  public prefilleditView(dataList) {
    const emails = this.emailForm.get("emails") as FormArray;

    var results = [];
    // let dataObj = JSON.parse(data['token']);
    //

    for (var k = 0; k < emails.value.length; k++) {
      for (var i = 0; i < dataList.length; i++) {
        if (emails.value[k].Label == dataList[i].unit_name) {
          let index = (<FormArray>(
            this.emailForm.get("emails")
          )).controls.findIndex((x) => x.value.id === dataList[i].unit_id);
          var ejsResults = [];

          // for (var j = 0; j < data['ProjectUnit'][i].ProjectDesignType.length; j++) {

          //   ejsResults.push(
          //     data['ProjectUnit'][i].ProjectDesignType[j].id,

          //   );

          // }
          var tags = [];

          for (var j = 0; j < dataList[i].ProjectTags.length; j++) {
            tags.push(dataList[i].ProjectTags[j].tags);
          }

          // results.push({ unit_no: dataList[i].no_of_unit ,size: dataList[i].unit_qty ,designType:dataList[i].ProjectDesignType_ID,tags: tags , is_checkbox:  false })
          emails.at(index).patchValue({
            unit_no: dataList[index].no_of_unit,
            size: dataList[index].unit_qty,
            designType: dataList[index].ProjectDesignType_ID,
            tags: tags,
            notes: dataList[index].note,
            is_checkbox: false,
          });
        }
        //emails.controls.forEach(pair => pair.patchValue({ Label:  data['ProjectUnit'].id, is_checkbox:  data['ProjectUnit'].is_checkbox }));
      }
    }
    //  emails.patchValue(results);
  }
  changedSortType(e) {
    this.sortTypeVal = e.value;
  }
  public changedCustomer(e) {
    this.customerVal = e.value;
    if (e.value != "") {
      let postData = {
        id: e.value,
      };
      if (this.editable == false) {
        this.projectService.FindByCustomerId(postData).subscribe(
          (data: any) => {
            this.projectForm.patchValue({
              // customer_Name:new FormControl(''),
              // contact_name:new FormControl(''),
              // customer_type:new FormControl(''),
              // customer_email:new FormControl(''),
              // customer_phone:new FormControl(''),
              // city:new FormControl(''),
              // customer_Name: data.cst_name,
              // customer_type:data.cst_type,
              // customer_phone:data.phone,

              // street_1:data.adr,
              // street_2:data.street,
              city: data.city != null ? data.city : "",

              name: data.entityContact.name,
              //  position: data.entityContact.position,
              phone: data.entityContact.phone,
              //  mobile: data.entityContact.mobile,
              email: data.entityContact.email,
            });
            setTimeout(() => {
              this.projcountryValue = data.country;
            }, 500);
            if (data.entityContact != null || data.entityContact.length != 0) {
              let entityContact;
              this.showBranchList = true;

              entityContact = {
                id: data.entityContact.id,
                entity_id: data.entityContact.entity_id,
                first_name: data.entityContact.first_name,
                last_name: data.entityContact.last_name,
                phone: data.entityContact.phone,
                email: data.entityContact.email,
                note: data.entityContact.note,
                // "deptid": this.deptValue,
                department: data.entityContact.department,
                relationship: data.entityContact.relationship,
                // "desgnid": this.desgnValue,
                designation: data.entityContact.designation,
                is_primary: true,
              };
              brList = [entityContact];
              this.branchDataSource = [entityContact];

              // for(var i=0<i<data.entityContact.length;i++;){

              //   entityContact.push({

              //     "first_name":data.entityContact[i].first_name,
              //     "last_name": data.entityContact[i].last_name,
              //     "phone_no":data.entityContact[i].phone ,
              //     "email": data.entityContact[i].email,
              //     "is_primary": data.entityContact[i].is_primary
              //   })

              // }
              // this.branchDataSource=entityContact;
            }

            // this.countryValue=data.country

            // this.router.navigate(["/organizations"]);
          },
          (error) => {
            Swal.fire("Error!", error, "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        );
      }
    }

    //  this.FindCustomProjectPrefixByOrgIDAndPrefix(this.customPrefix)
  }
  public changedPlotValue(e) {}
  public changedBuiltUpValue(e) {}
  public changedPrefix(e: any): void {
    if (e.value == 2) {
      this.showPrefixText = true;
      this.prefixString = this.projectForm.get("prefix_name").value;
    } else {
      this.showPrefixText = false;

      //this.FindAutoProjectPrefixByOrgID();
      // this.prefixString='JOB/'+formattedPrefix;
    }
    this.prefixValue = e.value;
  }
  onPrimaryContactCheck(e) {
    if (e.srcElement.checked == true) {
      let entityContact = this.customerForm.get("customer_phone").value;
      // console.log('entityContact', entityContact)
      if (entityContact != null) {
        this.selectedCstISO = entityContact.countryCode;
        this.customerForm.patchValue({
          phone:
            this.customerForm.get("customer_phone").value != "" &&
            this.customerForm.get("customer_phone").value != null
              ? entityContact.number
              : "",
        });
      }
      // ,
      //    ...phone && { phone:data.phone ? data.phone:''}
      this.customerForm.patchValue({
        fname:
          this.customerForm.get("customer_Name").value != ""
            ? this.customerForm.get("customer_Name").value
            : "",
        lname:
          this.customerForm.get("last_Name").value != ""
            ? this.customerForm.get("last_Name").value
            : "",
        email:
          this.customerForm.get("customer_email").value != ""
            ? this.customerForm.get("customer_email").value
            : "",
        // relationship:this.customerForm.get('relationship').value!=''?this.customerForm.get('relationship').value:'',
        // designation:this.customerForm.get('designation').value!=''?this.customerForm.get('designation').value:'',
        // note:this.customerForm.get('note').value!=''?this.customerForm.get('note').value:'',
      });
    } else {
      this.customerForm.patchValue({
        fname: "",
        lname: "",
        phone: "",
        email: "",
        relationship: "",
        designation: "",
        note: "",
      });
    }
  }
  // onPrimaryContactCheck(e){
  //   if(e.srcElement.checked==true ){

  //  this.customerForm.patchValue({
  //   fname: this.customerForm.get('customer_Name').value!=''?this.customerForm.get('customer_Name').value:'',
  //   lname: this.customerForm.get('last_Name').value!=''?this.customerForm.get('last_Name').value:'',
  //   phone:this.customerForm.get('customer_phone').value!=''?this.customerForm.get('customer_phone').value:'',
  //   email:this.customerForm.get('customer_email').value!=''?this.customerForm.get('customer_email').value:'',
  //   // relationship:this.customerForm.get('relationship').value!=''?this.customerForm.get('relationship').value:'',
  //   // designation:this.customerForm.get('designation').value!=''?this.customerForm.get('designation').value:'',
  //   // note:this.customerForm.get('note').value!=''?this.customerForm.get('note').value:'',
  //  })

  // }else{
  //   this.customerForm.patchValue({
  //     fname:'',
  //     lname:'',
  //     phone:'',
  //     email:'',
  //     relationship:'',
  //     designation:'',
  //     note:'',

  //    })
  // }
  // }
  public onAddCustomer(e) {
    this.addCstformSubmitted = true;
    e.preventDefault();
    // let loginUrl=this.utilService.getHostURL()+'Account/login';
    // let code = ''
    // if (this.customerForm.get('customer_phone').value) {
    //   let phoneNo = this.customerForm.get('customer_phone').value;
    //   code = phoneNo.dialCode.concat(phoneNo.number);
    // }
    let postData = {
      id: null,
      cst_name: this.showOrgDetails
        ? this.customerForm.get("company_Name").value
        : this.customerForm.get("customer_Name").value +
          " " +
          this.customerForm.get("last_Name").value,
      first_name: this.customerForm.get("customer_Name").value,
      last_name: this.customerForm.get("last_Name").value,
      cst_type: null,
      is_company: this.showOrgDetails,
      email: this.customerForm.get("customer_email").value,
      // "phone": this.customerForm.get('customer_phone').value,
      phone:
        this.customerForm.get("customer_phone").value != null &&
        this.customerForm.get("customer_phone").value != ""
          ? this.customerForm
              .get("customer_phone")
              .value.internationalNumber.replace(/ /g, "")
          : null,
      phone_iso_name:
        this.customerForm.get("customer_phone").value != null &&
        this.customerForm.get("customer_phone").value != ""
          ? this.customerForm.get("customer_phone").value.countryCode
          : null,
      company_name: this.showOrgDetails
        ? this.customerForm.get("company_Name").value
        : null,

      adr: this.customerForm.get("street_1").value,
      street: this.customerForm.get("street_2").value,
      country: this.countryValue,
      city: this.customerForm.get("city").value,
      annual_revenue: this.customerForm.get("revenue").value,
      no_of_emp: this.customerForm.get("emp_no").value,
      industry_id: this.showOrgDetails ? this.industryValue : null,
      website: this.showOrgDetails
        ? this.customerForm.get("website").value
        : null,

      EntityContact:
        this.customerForm.get("fname").value != ""
          ? {
              id: null,
              // "entity_id": "string",
              entity_id: null,
              name:
                this.customerForm.get("fname").value +
                " " +
                this.customerForm.get("lname").value,
              position: null,
              // "phone": this.customerForm.get('phone').value,
              phone:
                this.customerForm.get("phone").value != null &&
                this.customerForm.get("phone").value != ""
                  ? this.customerForm
                      .get("phone")
                      .value.internationalNumber.replace(/ /g, "")
                  : null,
              phone_iso_name:
                this.customerForm.get("phone").value != null &&
                this.customerForm.get("phone").value != ""
                  ? this.customerForm.get("phone").value.countryCode
                  : null,
              mobile: null,
              email: this.customerForm.get("email").value,
              first_name: this.customerForm.get("fname").value,
              last_name: this.customerForm.get("lname").value,
              adr_1: null,
              adr_2: null,
              city: null,
              country: null,
              department: null,
              relationship: this.customerForm.get("relationship").value,
              designation: this.customerForm.get("desgn").value,
              note: this.customerForm.get("note").value,
              is_primary: true,
            }
          : null,
    };

    //

    if (
      (!this.showOrgDetails
        ? this.customerForm.get("customer_Name").value != "" &&
          this.customerForm.get("last_Name").value != ""
        : true) &&
      this.customerForm.status == "VALID" &&
      (this.showOrgDetails
        ? this.customerForm.get("company_Name").value != ""
        : true)
    ) {
      this.spinner.show();
      return this.projectService.AddCustomer(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.OnCustomerClose();
            this.GetAllCustomer();
            this.addCstformSubmitted = false;
            this.spinner.hide();
            this.countryValue = "";
            this.customerVal = data.code;

            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          }
        },
        (error) => {
          Swal.fire("Error!", "Error.", "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    }
  }
  onCstPhChange(event) {
    let phoneNo = {
      PhoneNumber: event.dialCode + event.number,
    };
    this.cstPhoneNumberValue = event.dialCode + event.number;
    this.empService.IsPhoneValid(phoneNo).subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.cstPhoneInvalid = false;
        } else {
          this.cstPhoneInvalid = true;
          this.phoneErrorMsg = data["desc"];
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public OnCustomerClose() {
    this.cstPhone = "";
    this.cstPhoneInvalid = false;
    this.phoneErrorMsg = "";
    this.customerForm.reset();
    this.cstPhoneNumberValue = "";
    this.showOrgDetails = false;
    $("#customer_modal").modal("hide");
    this.cstBtn.nativeElement.click();
  }
  public AddForm() {
    $.getScript("assets/js/pages/custom/user/edit-user.js");

    this.projectForm.reset();
    this.GetAllCustomer();
    this.FindAutoProjectPrefixByOrgID();
    this.GetAllProjectStatus();
    this.GetPkgByOrgID();
    this.findCostHrs();
    this.findprofitMargin();
    this.getCountryList();
    this.GetLastAddedCostPrefixByOrgID();
    this.commonResetFunctionsOnEstimate();
    // this.initializeSummaryForm()
    // this.patchValuesToForm()
    this.newSummaryTbl = [];
    this.cctvtype = [];
    sessionStorage.clear();
    this.newTaskId = this.generateProjectId();
    // console.log(this.newTaskId, "NEW TASK ID")
    this.milestoneData = [];
    this.editableTotal = false;
    this.editableDisc = true;
    const emails = this.emailForm.get("emails") as FormArray;
    if (emails.length > 1) {
      emails.clear();
    } else {
      emails.clear();
    }
    const extras = this.extraUnitForm.get("extras") as FormArray;
    if (extras.length > 1) {
      extras.clear();
    } else {
      extras.clear();
    }
    const miles = this.milestTaskForm.get("miles") as FormArray;
    if (miles.length > 1) {
      miles.clear();
    } else {
      miles.clear();
    }
    setTimeout(() => {
      this.fetchUnitDesc();
      this.extraUnit();
    }, 1500);

    this.projectForm.patchValue({
      prefixVal: "is_auto",
      startDate: moment().format("L"),
      floor_no: 1,
      plotVal: "sq_ft",
      builtVal: "built_sq_ft",
    });
    this.showTaskList = false;
    this.showAddForm = true;
    this.AddNewSubmit = true;
    this.editable = false;
    this.showPrefixText = false;
    this.customPrefix = "";
    this.prefixExists = false;
    this.projCostId = "";
    this.phone = "";
    this.customerVal = "";
    this.projTypeVal = "";
    this.unitTypeVal = "";
    brList = [];
    this.branchDataSource = [];
    this.extraunitTypeVal = "";
    this.plotValue = 1;
    this.builtUpplotValue = 1;
    this.editable = false;

    console.log(this.newTaskId, "TASK ID");
  }
  public async TaskView() {
    this.spinner.show();
    // await this.GetPriorityByOrgID();
    await this.getIntfutServiceNames();
    await this.getIntFutServices();
    this.commonResetFunctionsOnEstimate();
    this.showTaskList = true;
    this.showAddForm = false;
    this.totalHrs = 0;
    this.profit_value = 0;
    this.net_total = 0;
    sessionStorage.clear();
    this.showModification = false;
    this.spinner.hide();
    // console.log('TaskView')
  }
  public showTaskView() {
    this.GetPriorityByOrgID();
    // this.onUpdateFinalCost();
    this.showTaskList = true;
    this.showAddForm = false;
    this.totalHrs = 0;
    this.profit_value = 0;
    this.net_total = 0;
    sessionStorage.clear();
  }

  saveBOQEstimate() {
    this.spinner.show();
    let summaryData = this.SummaryMatTabVals;
    console.log(summaryData, "CHECK ON summaryData!!!");
    let userinfo = JSON.parse(localStorage.getItem("user_info"));
    if (summaryData && summaryData.length > 0) {
      let postData = {
        project_id: this.editEnable ? this.editTaskId : this.newTaskId,
        org_id: userinfo.org_id,
        created_by: userinfo.full_name,
        intfutSummary: summaryData,
      };
      this.intfutService
        .AddIntfutEstSummary(postData)
        .subscribe((data: any) => {
          if (data.status == 200) {
            this.isNewChecked = false;
            this.toastr.success(
              "Summary has been saved succesfully",
              undefined,
              {
                positionClass: "toast-top-center",
              }
            );
            this.isEstSummarySaved = true;
            this.serviceSummaryData = [];
            this.serviceSummaryData = this.generateServiceSummary(summaryData);
            if (this.serviceSummaryData.length > 0) {
              this.serviceSummaryTotal = this.serviceSummaryData.reduce(
                (accumulator, service) => accumulator + service.totalPrice,
                0
              );
              this.serviceSummaryVat = this.serviceSummaryVat =
                this.serviceSummaryTotal && this.serviceSummaryTotal !== null
                  ? parseFloat((this.serviceSummaryTotal * 0.05).toFixed(2))
                  : 0;
              this.serviceSummaryNetTotal =
                this.serviceSummaryTotal + this.serviceSummaryVat;
              this.serviceSummaryFinal = this.serviceSummaryData.reduce(
                (accumulator, service) => accumulator + service.finalPrice,
                0
              );
            }
            // console.log(this.serviceSummaryData, "serviceSummaryData")
          }
          this.spinner.hide();
        });
      if (this.appliedTemplates.length > 0) {
        this.appliedTemplates.forEach((i) => {
          let serviceTemplatePostData = {
            project_id: this.editEnable ? this.editTaskId : this.newTaskId,
            org_id: userinfo.org_id,
            modified_by: userinfo.full_name,
            service_id: i.mainCategoryId,
            template_id: i.id,
            is_applied: true,
          };
          this.intfutService
            .UpdateProjectServiceById(serviceTemplatePostData)
            .subscribe((data) => {
              console.info("SUCCESS!!!");
              this.isNewChecked = false;
            });
        });
      }
    }
    // console.log(summaryData, "CHECKING SUMMARY FORM DATA!!!")
  }
  generateServiceSummary(taskList) {
    const totalPriceSumByMainCat = {};

    taskList.forEach((task) => {
      const mainCat = task.MainCat;
      const totalPrice = parseFloat(task.totalPrice) || 0;
      const finalPrice = parseFloat(task.finalPrice) || 0;

      if (!totalPriceSumByMainCat[mainCat]) {
        totalPriceSumByMainCat[mainCat] = {
          totalPrice: 0,
          finalPrice: 0,
          service: mainCat,
        };
      }

      totalPriceSumByMainCat[mainCat].totalPrice += totalPrice;
      totalPriceSumByMainCat[mainCat].finalPrice += finalPrice;
    });

    return Object.values(totalPriceSumByMainCat);
  }

  scroll(el: HTMLElement) {
    // el.scrollIntoView();
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  public taskEdit(dept_id) {
    this.GetAllCustomer();
    this.GetProjectTypeByOrgID();
    this.GetAllProjectStatus();
    this.findCostHrs();
    this.findprofitMargin();
    this.getCountryList();
    // this.GetProjectModifiationByEstID(dept_id);
    //this.fetchUnitDesc();
    // this.extraUnit();
    this.costService.FetchAllUnitDescriptionByOrgID().subscribe((data: any) => {
      var typeOfUnit = [{ id: "", text: "Select" }];

      for (var i = 0; i < data.length; i++) {
        typeOfUnit.push({
          id: data[i].id,
          text: data[i].unit_name,
        });
      }
      this.unitTypeData = typeOfUnit;
    });

    var extratypeOfUnit = [{ id: "", text: "Select" }];

    this.costService
      .FetchAllUnitDescriptionExtraByOrgID()
      .subscribe((data12: any) => {
        // this.dataSource =  new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
        var extraUnits = [];

        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data12.length; i++) {
          // logik to create new items

          extratypeOfUnit.push({
            id: data12[i].id,
            text: data12[i].unit_name,
          });
        }
        this.extraunitTypeData = extratypeOfUnit;
      });
    this.AddNewSubmit = false;

    // setTimeout(()=>{
    //   this.emailForm.get('emails').valueChanges.subscribe(changes=> {
    //
    //     this.milestoneData=[]
    //     this.showUpdateCalculate=true;
    //   })
    //   this.extraUnitForm.get('extras').valueChanges.subscribe(changes=> {
    //
    //     this.milestoneData=[]
    //     this.showUpdateCalculate=true;

    //   })

    //       }, 2500);

    const emails = this.emailForm.get("emails") as FormArray;
    if (emails.length > 1) {
      emails.clear();
    } else {
      emails.clear();
    }

    const extras = this.extraUnitForm.get("extras") as FormArray;
    if (extras.length > 1) {
      extras.clear();
    } else {
      extras.clear();
    }

    const miles = this.milestTaskForm.get("miles") as FormArray;
    if (miles.length > 1) {
      miles.clear();
    } else {
      miles.clear();
    }

    this.milestoneData = [];
    this.projCostId = dept_id;
    this.editable = true;
    this.editTaskId = dept_id;
    this.showTaskList = false;
    this.showAddForm = true;

    sessionStorage.setItem("costId", dept_id);
    //        let postData={
    //          id:dept_id
    //        }
    //        this.costService.FindByCostProjectID(postData).subscribe(
    //          (data:any)  => {
    //
    //           this.project_prefix_val=data.project_prefix;
    //          this.projName=data.project_name;
    //          this.projTypeVal=data.project_type_id;
    //            this.projectForm.patchValue({

    //              project_name: data.project_name,
    //              desc:data.project_desc,
    //              startDate:moment(data.start_date).format('L'),
    //              endDate:moment(data.end_date).format('L'),

    //              // completeDate:moment(data.completed_date).format('L'),
    //              accessControl:data.is_private==true?'is_private':'is_public',
    //             // accessControl:new FormControl('')

    //             name: data.entityContact?data.entityContact.name:'',
    //  //  position: data.entityContact.position,
    //   phone: data.entityContact?data.entityContact.phone:'',
    //  //  mobile: data.entityContact.mobile,
    //   email: data.entityContact?data.entityContact.email:''

    //            })

    //           // this.EmpList();
    //            // this.DesgnList();

    //           if(data.entityCustomer){
    //            this.customerVal=data.entityCustomer.id

    //           }

    //          //   this.projectForm.valueChanges.subscribe(
    //          //     value=> {
    //          //
    //          //     }
    //          //  );

    //          //  this.projectForm.get('firstName').valueChanges.subscribe(val=>{
    //          //    if(data.first_name!=val){
    //          //

    //          //    }
    //          // })
    //          // this.projectForm.get('firstName')
    //          // .valueChanges
    //          // .pipe(pairwise())
    //          // .subscribe(([prev, next]: [any, any]) => {
    //          //
    //          //
    //          // });callCostProj
    //            //this.EmpList();
    //           // this.departmentLeadValue=data.depart_lead_empid;
    //            //  let dataObj = JSON.parse(data['token']);
    //

    //          // this.router.navigate(["/organizations"]);

    //          },
    //          error  => {
    //            Swal.fire(
    //              'Error!',
    //              error,
    //              'error'
    //            ).then(
    //              //used Arrow function here
    //              (result)=> {
    //
    //                //  this.router.navigate(['/dashboard']);
    //              })
    //

    //          }

    //          )
  }

  public async newTaskEdit(data: any) {
    this.spinner.show();

    try {
      await this.initializeIntfutServices();

      const buildingType = { value: data.building_type };
      this.changedBuildType(buildingType);

      const clearFormArray = (formArray: FormArray) => formArray.clear();
      clearFormArray(this.emailForm.get("emails") as FormArray);
      clearFormArray(this.extraUnitForm.get("extras") as FormArray);
      clearFormArray(this.milestTaskForm.get("miles") as FormArray);

      this.AddNewSubmit = false;
      this.milestoneData = [];
      this.editProjectData = data;
      this.projCostId = data.project_id;
      this.editEnable = true;
      this.editTaskId = data.project_id;
      this.showTaskList = false;
      this.showAddForm = true;

      await this.GetExistingEstimationData();
      sessionStorage.setItem("costId", data.project_id);
      console.log(this.colDataArr, "****Col Data");
    } catch (error) {
      console.error("Error during newTaskEdit:", error);
      // Handle the error (e.g., show a user-friendly message)
    } finally {
      this.spinner.hide();
    }
  }

  async GetExistingEstimationData() {
    this.spinner.show();
    const postData = { id: this.editTaskId };

    try {
      const { floorData, servicesData, summaryData } = await forkJoin({
        floorData: this.intfutService.GetintfutFloorById(postData),
        servicesData: this.intfutService.GetProjectServicebyID(postData),
        summaryData: this.intfutService.GetIntfutEstSummary(postData),
      }).toPromise();

      // Process floor data
      if (Array.isArray(floorData) && floorData.length > 0) {
        this.floorData = floorData;
        const newArr = Object.values(
          floorData.reduce((acc, unit) => {
            const key = `${unit.unit_desc}_${unit.is_typical}_${unit.from_value}_${unit.to_value}`;
            acc[key] = acc[key] || {
              label: unit.unit_desc,
              is_typical: unit.is_typical,
              from_value: unit.from_value,
              to_value: unit.to_value,
              value: [],
            };

            if (
              !acc[key].value.some((item) => item.flatVal === unit.flat_type)
            ) {
              acc[key].value.push({
                units: unit.units,
                flatVal: unit.flat_type,
              });
            }

            return acc;
          }, {})
        );
        console.log(newArr, "CHECK NEW ARR");
        const extras = this.extraUnitForm.get("extras") as FormArray;
        console.log(extras, "CHECK extras UNDER NEW ARR");
        newArr.forEach((data: any) => {
          const flatTypeArray = this.formBuilder.array(
            data.value.map((flatType) =>
              this.formBuilder.group({
                units: flatType.units,
                flatVal: flatType.flatVal,
              })
            )
          );

          extras.push(
            this.formBuilder.group({
              Label: data.label,
              Value: 1,
              checkbox_value: "",
              designType: [],
              disabledTag: "",
              flatType: flatTypeArray,
              fromValue: data.from_value,
              id: "1",
              is_checkbox: false,
              is_typical: data.is_typical,
              notes: "",
              selection_limit: "1",
              size: "",
              tags: "",
              toValue: data.to_value,
            })
          );
        });

        this.opensaveflat(extras);
      }

      // Process services data
      if (Array.isArray(servicesData) && servicesData.length > 0) {
        const services = this.servicesForm.get("services") as FormArray;

        if (servicesData.length > services.length) {
          const diff = servicesData.length - services.length;
          for (let i = 0; i < diff; i++) {
            services.push(this.createServiceFormGroup());
          }
        }

        const templateList = servicesData
          .filter((serviceData) => serviceData.is_applied)
          .map((serviceData) => serviceData.template_id);

        servicesData.forEach((serviceData, i) => {
          const serviceFormGroup = services.at(i) as FormGroup;
          serviceFormGroup.patchValue({
            Label: serviceData.serviceCategoryName,
            id: serviceData.service_id,
            primaryCatList:
              serviceData.primary_cat_list &&
              serviceData.primary_cat_list.trim() !== ""
                ? JSON.parse(serviceData.primary_cat_list)
                : [],
          });
        });

        if (templateList.length > 0) {
          await this.GetServiceEstimationTemplates();
          this.templateListingData$.subscribe((data) => {
            if (data && data.length > 0) {
              this.appliedTemplates = data.filter((templates) =>
                templateList.includes(templates.id)
              );
            }
          });
        }
      }

      // Process summary data
      if (Array.isArray(summaryData) && summaryData.length > 0) {
        this.taskList.clear();
        this.SummaryMatTabVals = summaryData.map((item) => item);
        this.populateMatHeaders();
        this.isEstSummarySaved = true;
        this.calculateSubmit = true;
        this.showIntfutSummaryTable = true;
      }
    } catch (error) {
      console.error("Error in API calls", error);
    } finally {
      this.spinner.hide();
    }
  }

  GetProjectModifiationByEstID(estId) {
    let postData = {
      id: estId,
    };
    this.projectService
      .GetProjectModifiationByEstID(postData)
      .subscribe((data1: any) => {
        if (data1.code != null) {
          this.showModification = true;
          let modifyPostData = {
            estID: sessionStorage.getItem("costId"),
            projectID: data1.code,
          };
          // console.log('data1.code', data1.code);
          sessionStorage.setItem("modifyProjId", data1.code);
          this.projectService
            .FindModifiedSubTaskByProjectID(modifyPostData)
            .subscribe(
              (data: any) => {
                if (data.length != 0) {
                  this.spinner.hide();
                  this.removedTaskList = data;
                  this.modified_cost = data
                    .map((item) =>
                      parseFloat(item.amount != null ? item.amount : 0)
                    )
                    .reduce((prev, next) => prev + next);
                  let decimalValues = [];
                  for (var i = 0; i < data.length; i++) {
                    let t = data[i].worked_hrs.split(":");
                    var dec = parseInt(t[0], 10) * 1 + parseInt(t[1], 10) / 60;
                    decimalValues.push(dec);
                  }
                  let modified_hrs = decimalValues
                    .map((item) => parseFloat(item != null ? item : 0))
                    .reduce((prev, next) => prev + next);
                  var sign = modified_hrs < 0 ? "-" : "";
                  var min = Math.floor(Math.abs(modified_hrs));
                  var sec = Math.floor((Math.abs(modified_hrs) * 60) % 60);
                  this.modified_hrs =
                    sign +
                    (min < 10 ? "0" : "") +
                    min +
                    ":" +
                    (sec < 10 ? "0" : "") +
                    sec;
                  let addedTaskList = [];
                  let deletedTaskList = [];
                  for (var i = 0; i < data.length; i++) {
                    if (data[i].is_added == 1) {
                      addedTaskList.push(data[i]);
                    } else {
                      deletedTaskList.push(data[i]);
                    }
                  }
                  this.deletedTaskList = deletedTaskList;
                  this.addedTaskList = addedTaskList;
                  //this.modified_cost=data.map(item =>parseFloat(item.amount)).reduce((prev, next) => prev + next);
                  // console.log('modified_cost', this.modified_cost)
                  setTimeout(() => {
                    this.callCostProj(estId);
                  }, 1000);
                } else {
                  this.modified_cost = 0;
                  setTimeout(() => {
                    this.callCostProj(estId);
                  }, 1000);
                }
              },
              (error) => {
                this.spinner.hide();

                Swal.fire("Error!", error, "error").then((result) => {});
              }
            );
        } else {
          this.showModification = false;
          setTimeout(() => {
            this.callCostProj(estId);
          }, 1000);
        }
      });
  }
  OnTagAdded(tags) {
    // console.log('tagsADDEd', tags)
    this.milestoneData = [];
    this.discount_amount = "";
    // this.UpdateCostProjectDiscountAndTotalCostTaskID('')

    if (this.editable == true) {
      this.UpdateCostProjectDiscountAndTotalCostTaskID(
        this.projCostId,
        null,
        null,
        "hide"
      );
    }

    this.showUpdateCalculate = true;
    const emails = this.emailForm.get("emails") as FormArray;

    let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {
      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(emails.value[i].tags[j]);
        }
      }
    }

    this.tagsArrayValue = tagsdata;
    const extras = this.extraUnitForm.get("extras") as FormArray;

    var results1 = [];
    for (var i = 0; i < extras.value.length; i++) {
      //  extras.push(this.createEmailFormGroup())
      // extras.at(i).patchValue({ designType:['All'],selection_limit:'1',tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
      //   extras.value[i].Label + ' - '+ (1), 'All'
      // ]):''})
      extras.at(i).patchValue({
        designType: this.tagsArrayValue,
        selection_limit: "1",
        tags:
          this.tagsArrayValue.length != 0
            ? this.tagsArrayValue.concat([
                // extras.value[i].Label + ' - '+ (1)
              ])
            : "",
      });
      this.unitTypeVal = "";
      // results1.push({ Label:  this.extraUnitData[i].text, id:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox,tags:([ this.extraUnitData[i].text + ' - '+ (1)]) })
      //  results1.push({designType:['All'],tags:this.tagsArrayValue.length!=0?this.tagsArrayValue.concat([
      //   this.extraUnitData[i].text + ' - '+ (1), 'All'
      // ]):'' })
      // extras.controls.forEach(pair => pair.patchValue({ Label:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox }));
    }
  }
  hideMilestone() {
    this.milestoneData = [];
    this.discount_amount = "";
    // this.UpdateCostProjectDiscountAndTotalCostTaskID('')

    if (this.editable == true) {
      this.UpdateCostProjectDiscountAndTotalCostTaskID(
        this.projCostId,
        null,
        null,
        "hide"
      );
    }
    this.showUpdateCalculate = true;
  }
  public async GetPriorityByOrgID() {
    try {
      const data: any = await this.costService
        .FetchAllCostProjectByOrgID()
        .toPromise();

      if (data) {
        this.pgData = data;

        let ds = data.slice(0, this.pageSize);
        let ds1 = new DataManager(ds);
        //this.projectData=ds1.dataSource['json'];
      }
      let datas = new DataManager(data);
      this.projectData = datas.dataSource["json"];

      this.pageSettings = { pageSizes: true, pageCount: 5 };
      this.toolbar = ["Search", "ExcelExport", "PdfExport"];
      // this.router.navigate(["/organizations"]);
    } catch (error) {
      Swal.fire("Error!", error, "error").then(
        //used Arrow function here
        (result) => {
          //  this.router.navigate(['/dashboard']);
        }
      );
    }
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
  changed(e) {
    this.pageSize = e.pageSize;
    let start = (this.currentPage - 1) * e.pageSize;
    this.projectData = this.pgData.slice(start, start + e.pageSize);
  }
  click(args) {
    if (args.currentPage) {
      let start = (args.currentPage - 1) * this.pageSize;
      this.projectData = this.pgData.slice(start, start + this.pageSize);
    }
  }
  public GetAllCustomer() {
    this.projectService.GetAllCustomerByOrgID().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];

        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            id: data[i].id,
            text: data[i].cst_name,
          });
        }

        this.customerData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public customRadioChange() {
    if (this.projectForm.get("prefixVal").value == "is_custom") {
      this.showPrefixText = true;
    } else {
      this.showPrefixText = false;
      // this.FindAutoProjectPrefixByOrgID();
    }
  }
  public customInputChange(e) {
    this.customPrefix = e.target.value;
    this.FindCustomProjectPrefixByOrgIDAndPrefix(this.customPrefix);
  }
  public async FindAutoProjectPrefixByOrgID() {
    try {
      const data: any = await this.projectService
        .FindAutoCostProjectPrefixByOrgID()
        .toPromise();

      if (data == null) {
        let jobNo = "000";
        this.prefixString = "EST/" + formattedPrefix + "/" + jobNo;
      } else {
        let splittable = data.project_prefix
          ? data.project_prefix.split("/")
          : [];
        if (splittable[4] && parseInt(splittable[4]).toString().length == 1) {
          let jobNo = "00" + (parseInt(splittable[4]) + 1);
          this.prefixString = "EST/" + formattedPrefix + "/" + jobNo;
        } else if (
          splittable[4] &&
          parseInt(splittable[4]).toString().length == 2
        ) {
          let jobNo = "0" + (parseInt(splittable[4]) + 1);
          this.prefixString = "EST/" + formattedPrefix + "/" + jobNo;
        } else if (splittable[4]) {
          let jobNo = parseInt(splittable[4]) + 1;
          this.prefixString = "EST/" + formattedPrefix + "/" + jobNo;
        }
      }
    } catch (error) {
      Swal.fire("Error!", error, "error").then((result) => {
        // Handle the error here
      });
    }
  }

  public FindCustomProjectPrefixByOrgIDAndPrefix(prefix) {
    let postData = {
      Prefix: prefix,
    };

    return this.projectService
      .FindCustomProjectPrefixByOrgIDAndPrefix(postData)
      .subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data != null) {
            this.prefixExists = true;
          } else {
            this.prefixExists = false;
          }
          // if(data.status==200){

          // }
        },
        (error) => {
          Swal.fire("Error!", "Error.", "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
  }
  public toCostLayout() {
    // localStorage.setItem('project_id',id);
    this.router.navigate(["/cost-layout"]);
  }
  expand(e: ExpandEventArgs): void {
    if (e.isExpanded && [].indexOf.call(this.acrdn.items, e.item) === 1) {
      if (e.element.querySelectorAll(".e-accordion").length > 0) {
        return;
      }
      //Initialize Nested Accordion component
      let nestAcrdn: Accordion = new Accordion({
        expandMode: "Single",
        items: [
          { header: "Mood board", content: "#Sensor_features" },
          { header: "3D Sketch", content: "#Camera_features" },
          { header: "Exterior Design", content: "#Video_Rec_features" },
        ],
      });
      let sdAcdn: Accordion = new Accordion({
        expandMode: "Single",
        items: [
          { header: "Main layout", content: "#Sensor_features" },
          { header: "Partition layout", content: "#Camera_features" },
          { header: "Furniture layout", content: "#Video_Rec_features" },
        ],
      });
      let studyAcdn: Accordion = new Accordion({
        expandMode: "Single",
        items: [
          { header: "Plan study", content: "#Sensor_features" },
          { header: "Client Need Study", content: "#Camera_features" },
          { header: "Zoning", content: "#Video_Rec_features" },
          { header: "Presentation", content: "#Video_Rec_features" },
        ],
      });
      //Render initialized Nested Accordion component
      nestAcrdn.appendTo("#nested_Acc");
      studyAcdn.appendTo("#study_Acc");
      sdAcdn.appendTo("#sdAcdn");
    }
  }
  public async GetProjectTypeByOrgID() {
    try {
      const data: any = await this.projectService
        .GetProjectTypeByOrgID()
        .toPromise();

      const results = [{ id: "", text: "Select" }];

      for (let i = 0; i < data.length; i++) {
        results.push({
          id: data[i].id,
          text: data[i].type_name,
        });
      }

      this.projectTypeData = results;
    } catch (error) {
      Swal.fire("Error!", error, "error").then((result) => {
        // Handle the error here
      });
    }
  }
  isFieldValid(field: string) {
    // if(this.addformSubmitted){
    //   return (
    //   this.showerrorMsg=true,
    //     this.projectForm.get(field).errors && this.projectForm.get(field).touched ||
    //     this.projectForm.get(field).untouched &&
    //     this.addformSubmitted
    //   );
    // }
    // else if(this.editformSubmitted){
    //   return (
    //     this.showerrorMsg=true,
    //     this.projectForm.get(field).errors &&
    //     this.editformSubmitted
    //   );
    // }
    // else{
    //   return (
    //   this.showerrorMsg=false,
    //     false
    //   );
    // }
    // return (
    //   this.projectForm.get(field).errors && this.projectForm.get(field).touched ||
    //   this.projectForm.get(field).untouched &&
    //   this.formSubmitted && this.projectForm.get(field).errors  && this.projectForm.get(field).errors.patternValidator
    // );
  }
  constructor(
    private http: HttpClient,
    public settingService: settingsService,
    public inventoryService: InventoryService,
    public ModuleSetupService: ModuleSetupService,
    private toast: ToastrService,
    private settingsService: settingsService,
    private projectService: ProjectService,
    private userService: UserService,
    private quotationService: QuotationService,
    private qtnService: QuotationService,
    private leadService: LeadService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private costService: CostService,
    private formBuilder: FormBuilder,
    private countries: CountryService,
    private empService: EmployeeService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private intfutService: IntfutService,
    private modalService: NgbModal,
    private platformDetectionService: PlatformDetectionService
  ) {
    // this.columnDefs = [
    //   {
    //     field: 'athlete',
    //     minWidth: 160,
    //   },
    //   { field: 'age' },
    //   {
    //     field: 'country',
    //     minWidth: 140,
    //   },
    //   { field: 'year' },
    //   {
    //     field: 'date',
    //     minWidth: 140,
    //   },
    //   {
    //     field: 'sport',
    //     minWidth: 160,
    //   },
    //   { field: 'gold' },
    //   { field: 'silver' },
    //   { field: 'bronze' },
    //   { field: 'total' },
    // ];
    // this.columnDefs = [
    //   {
    //     field: 'make',
    //     cellEditor: 'agSelectCellEditor',
    //     cellEditorParams: {
    //       values: ['Porsche', 'Toyota', 'Ford', 'AAA', 'BBB', 'CCC'],
    //     },
    //   },
    //   { field: 'model' },
    //   {
    //     field: 'price',
    //     cellEditor: 'numericCellEditor',
    //   },
    //   {
    //     headerName: 'Suppress Navigable',
    //     field: 'field5',
    //     suppressNavigable: true,
    //     minWidth: 200,
    //   },
    //   {
    //     headerName: 'Not Editable',
    //     field: 'field6',
    //     editable: false,
    //   },
    // ];
    // this.rowData = this.getRowData();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.http
    //   .get('https://www.ag-grid.com/example-assets/olympic-winners.json')
    //   .subscribe((data) => {
    //     this.rowData = data;
    //   });
  }
  public getRowData() {
    var rowData = [];
    for (var i = 0; i < 10; i++) {
      rowData.push({
        make: "Toyota",
        model: "Celica",
        price: 35000 + i * 1000,
        field5: "Sample 22",
        field6: "Sample 23",
      });
      rowData.push({
        make: "Ford",
        model: "Mondeo",
        price: 32000 + i * 1000,
        field5: "Sample 24",
        field6: "Sample 25",
      });
      rowData.push({
        make: "Porsche",
        model: "Boxter",
        price: 72000 + i * 1000,
        field5: "Sample 26",
        field6: "Sample 27",
      });
    }
    return rowData;
  }
  public plotSqftChange(e) {
    //    if(e.target.value=='sq-ft'){
    // this.plotSqft='sq-ft';
    // this.projectForm.patchValue({
    //   plotVal:'sq-ft'
    // })
    //    }else{
    //     this.plotSqm='sq-m';
    //     this.projectForm.patchValue({
    //       plotVal:'sq-m'
    //     })
    //    }
  }
  public createTaskForm(type) {
    const emails = this.emailForm.get("emails") as FormArray;
    if (emails.length > 1) {
      emails.clear();
    } else {
      emails.clear();
    }
    var results = [];
    for (var i = 0; i < this.typeOfTask.length; i++) {
      emails.push(this.createEmailFormGroup());

      results.push({
        Label: this.typeOfTask[i].text,
        id: this.typeOfTask[i].id,
        is_checkbox: this.typeOfTask[i].is_checkbox,
        tags: [this.typeOfTask[i].text + " - " + 1],
      });
      // emails.controls.forEach(pair => pair.patchValue({ Label: this.typeOfTask[i].id, is_checkbox: this.typeOfTask[i].is_checkbox }));
    }
    emails.patchValue(results);
    let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {
      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(emails.value[i].tags[j]);
        }
      }
    }
    this.tagsArrayValue = tagsdata;

    const extras = this.extraUnitForm.get("extras") as FormArray;
    if (extras.length > 1) {
      extras.clear();
    } else {
      extras.clear();
    }
    // const extras = this.extraUnitForm.get('extras') as FormArray

    var results1 = [];
    for (var i = 0; i < this.extraUnitData.length; i++) {
      extras.push(this.createEmailFormGroup());

      // results1.push({ Label:  this.extraUnitData[i].text, id:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox,tags:([ this.extraUnitData[i].text + ' - '+ (1)]) })

      results1.push({
        Label: this.extraUnitData[i].text,
        id: this.extraUnitData[i].id,
        is_checkbox: this.extraUnitData[i].is_checkbox,
        designType: ["All"],
        tags:
          this.tagsArrayValue.length != 0
            ? this.tagsArrayValue.concat(["All"])
            : "",
      });
      // extras.controls.forEach(pair => pair.patchValue({ Label:  this.extraUnitData[i].id, is_checkbox:  this.extraUnitData[i].is_checkbox }));
    }
    extras.patchValue(results1);
  }

  public updateCostProjectTaskQtyTaskID(e, id, ischeck) {
    if (ischeck == true && e.target.value != "") {
      this.spinner.show();
      let user_info: object;
      if (localStorage.getItem("user_info")) {
        user_info = JSON.parse(localStorage.getItem("user_info"));
      }
      let postData = {
        id: id,
        project_id: null,
        is_selected: true,
        milestone_id: null,
        task_name: null,
        unit: null,
        qty: e.target.value,
        modifiedby: user_info["full_name"],
        employees: null,
      };

      return this.costService
        .UpdateCostProjectTaskQtyTaskID(postData)
        .subscribe(
          (data: any) => {
            // let dataObj = JSON.parse(data['token']);

            if (data.status == 200) {
              this.milestoneData = [];
              // this.addformSubmitted=false;
              setTimeout(() => {
                this.GetMilestoneAndTasksByProjectID();
              }, 500);
              // this.spinner.hide();

              this.toastr.success(data["desc"], undefined, {
                positionClass: "toast-top-center",
              });
            }
            // this.router.navigate(["/organizations"]);
          },
          (error) => {
            this.spinner.hide();

            Swal.fire("Error!", "Error.", "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        );
    }
  }
  public GetMilestoneAndTasksByProjectID() {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    let postData = {
      id: this.projCostId,
    };

    return this.costService.GetMilestoneAndTasksByProjectID(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        if (data.length != 0) {
          // this.addformSubmitted=false;
          let milestoneArray;
          // this.milestoneData=data['CostProjectMilestone'];

          for (var i = 0; i < data.length; i++) {
            if (data[i].milestone_name == "Study") {
              if (data[i]["CostProjectTask"].length != 0) {
                this.milestoneData[0] = data[i];

                let total_hrs = data[i]["CostProjectTask"]
                  .map((item) => parseInt(item.qty))
                  .reduce((prev, next) => prev + next);

                // this.design_hrs=total_hrs;
                this.milestoneData[0]["total_hrs"] = total_hrs;
              }
            }
            if (data[i].milestone_name == "Design") {
              if (data[i]["CostProjectTask"].length != 0) {
                this.milestoneData[1] = data[i];

                let total_hrs = data[i]["CostProjectTask"]
                  .map((item) => parseInt(item.qty))
                  .reduce((prev, next) => prev + next);

                this.milestoneData[1]["total_hrs"] = total_hrs;
              }
            }
            if (data[i].milestone_name == "Shop Drawing") {
              if (data[i]["CostProjectTask"].length != 0) {
                this.milestoneData[2] = data[i];

                let total_hrs = data[i]["CostProjectTask"]
                  .map((item) => parseInt(item.qty))
                  .reduce((prev, next) => prev + next);

                this.milestoneData[2]["total_hrs"] = total_hrs;
              }
            }
            if (data[i].milestone_name == "Extra Services") {
              if (data[i]["CostProjectTask"].length != 0) {
                this.milestoneData[3] = data[i];

                let total_hrs = data[i]["CostProjectTask"]
                  .map((item) => parseInt(item.qty))
                  .reduce((prev, next) => prev + next);

                this.milestoneData[3]["total_hrs"] = total_hrs;
              }
            }
          }

          // this.milestoneData=milestoneArray;
          this.spinner.hide();
          const miles = this.milestTaskForm.get("miles") as FormArray;

          let total_milesthrs = miles.value.reduce(function (sum, record) {
            if (record.is_checkbox == true) return sum + parseInt(record.Qty);
            else return sum;
          }, 0);
          this.MilestHrs = total_milesthrs;
          this.toastr.success(data["desc"], undefined, {
            positionClass: "toast-top-center",
          });
        }
        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        this.spinner.hide();

        Swal.fire("Error!", "Error.", "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public UpdateCostProjectDiscountAndTotalCostTaskID(id, discount, cost, show) {
    if (discount != "") {
      let user_info: object;
      if (localStorage.getItem("user_info")) {
        user_info = JSON.parse(localStorage.getItem("user_info"));
      }
      let postData = {
        id: id,
        project_id: null,
        is_selected: true,
        milestone_id: null,
        default_unit_hours: null,
        unit: null,
        qty: null,
        notes: null,
        discount_amount: discount,
        total_cost_amount: cost,
        modifiedby: user_info["full_name"],
        employees: null,
      };

      return this.costService
        .UpdateCostProjectDiscountAndTotalCostTaskID(postData)
        .subscribe(
          (data: any) => {
            // let dataObj = JSON.parse(data['token']);

            if (data.status == 200) {
              // this.addformSubmitted=false;

              this.spinner.hide();
              if (show == "show") {
                this.toastr.success(data["desc"], undefined, {
                  positionClass: "toast-top-center",
                });
              } else {
              }
            }
            // this.router.navigate(["/organizations"]);
          },
          (error) => {
            this.spinner.hide();

            Swal.fire("Error!", error, "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        );
    }
  }
  public costChange(typeOfText) {
    if (typeOfText == "costChange") {
      this.costText = true;
    } else {
      this.costText = false;
    }
  }
  UpdateCostProjectHrsTaskID(id, hrs, cost) {
    if (hrs != "") {
      let user_info: object;
      if (localStorage.getItem("user_info")) {
        user_info = JSON.parse(localStorage.getItem("user_info"));
      }
      let postData = {
        id: id,
        project_id: null,
        is_selected: true,
        milestone_id: null,
        default_unit_hours: null,
        budgeted_hours: null,
        unit: null,
        qty: hrs,
        notes: null,
        discount_amount: null,
        total_cost_amount: cost,
        modifiedby: user_info["full_name"],
        employees: null,
      };

      return this.costService
        .UpdateCostProjectBudgetedHoursTaskID(postData)
        .subscribe(
          (data: any) => {
            // let dataObj = JSON.parse(data['token']);

            if (data.status == 200) {
              // this.addformSubmitted=false;

              this.spinner.hide();

              this.toastr.success(data["desc"], undefined, {
                positionClass: "toast-top-center",
              });
            }
            // this.router.navigate(["/organizations"]);
          },
          (error) => {
            this.spinner.hide();

            Swal.fire("Error!", "Error.", "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        );
    }
  }
  public UpdateCostProjectNotesQtyTaskID(e, id, ischeck) {
    if (ischeck == true && e.target.value != "") {
      let user_info: object;
      if (localStorage.getItem("user_info")) {
        user_info = JSON.parse(localStorage.getItem("user_info"));
      }
      let postData = {
        id: id,
        project_id: null,
        is_selected: true,
        milestone_id: null,
        task_name: null,
        unit: e.target.value,
        qty: null,
        modifiedby: user_info["full_name"],
        employees: null,
      };

      return this.costService
        .UpdateCostProjectNotesQtyTaskID(postData)
        .subscribe(
          (data: any) => {
            // let dataObj = JSON.parse(data['token']);

            if (data.status == 200) {
              // this.addformSubmitted=false;

              this.spinner.hide();

              this.toastr.success(data["desc"], undefined, {
                positionClass: "toast-top-center",
              });
            }
            // this.router.navigate(["/organizations"]);
          },
          (error) => {
            this.spinner.hide();

            Swal.fire("Error!", "Error.", "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        );
    }
  }
  public UpdateCostProjectHrsQtyTaskID(e, id, ischeck) {
    if (ischeck == true && e.target.value != "") {
      let user_info: object;
      if (localStorage.getItem("user_info")) {
        user_info = JSON.parse(localStorage.getItem("user_info"));
      }
      let postData = {
        id: id,
        project_id: null,
        is_selected: true,
        milestone_id: null,
        task_name: null,
        unit: e.target.value,
        qty: null,
        modifiedby: user_info["full_name"],
        employees: null,
      };

      return this.costService
        .UpdateCostProjectNotesQtyTaskID(postData)
        .subscribe(
          (data: any) => {
            // let dataObj = JSON.parse(data['token']);

            if (data.status == 200) {
              // this.addformSubmitted=false;

              this.spinner.hide();

              this.toastr.success(data["desc"], undefined, {
                positionClass: "toast-top-center",
              });
            }
            // this.router.navigate(["/organizations"]);
          },
          (error) => {
            this.spinner.hide();

            Swal.fire("Error!", "Error.", "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        );
    }
  }
  public updateIsSelect(e, id, index) {
    let user_info: object;
    const miles = this.milestTaskForm.get("miles") as FormArray;

    miles.at(index).patchValue({ is_checkbox: e.srcElement.checked });

    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    let postData = {
      id: id,
      project_id: null,
      is_selected: e.srcElement.checked,
      milestone_id: null,
      task_name: null,
      unit: null,
      qty: null,
      modifiedby: user_info["full_name"],
      employees: null,
    };
    let hrs = miles.value.reduce(function (sum, record) {
      if (record.is_checkbox == true) return sum + parseInt(record.total_cost);
      else return sum;
    }, 0);
    let total_milesthrs = miles.value.reduce(function (sum, record) {
      if (record.is_checkbox == true) return sum + parseInt(record.Qty);
      else return sum;
    }, 0);
    this.MilestHrs = total_milesthrs;

    this.totalHrs = hrs;
    var value = hrs * 0.1;
    let result = Math.round(value * 100) / 100;
    this.profit_value = result;

    // this.net_total=result+hrs;
    let net_total = this.profit_value + hrs;
    let vat = net_total * (5 / 100);
    this.net_total = vat + net_total;
    return this.costService.UpdateIsSelectedByTaskID(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);

        if (data.status == 200) {
          // this.addformSubmitted=false;

          this.spinner.hide();

          this.toastr.success(data["desc"], undefined, {
            positionClass: "toast-top-center",
          });
        }
        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        this.spinner.hide();

        Swal.fire("Error!", "Error.", "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  changeMethod(e) {
    this.net_total = e.value;
  }
  onKeyupMethod(e) {
    if (e.keyCode == 13) {
      // console.log('onKeyupMethod', e.keyCode, e, this.net_total)

      let adjustedAmount = this.net_total / 1.05;
      this.discount_amount = adjustedAmount - this.total_value;
      // console.log('netTotalUpdated', this.total_value, this.net_total);
      this.disc_value = adjustedAmount - this.total_value;
      // console.log('discount_amount3', this.discount_amount)

      let vat = adjustedAmount * (5 / 100);
      this.vat_total = vat;
      this.net_total = this.net_total;
      this.setReverseCalc(this.projCostId);
    }
  }
  netTotalUpdated(e) {
    if (this.editableTotal) {
      let adjustedAmount = e.value / 1.05;
      this.discount_amount = adjustedAmount - this.total_value;
      // console.log('netTotalUpdated', this.total_value, e.value);
      this.disc_value = adjustedAmount - this.total_value;
      // console.log('discount_amount3', this.discount_amount)

      let vat = adjustedAmount * (5 / 100);
      this.vat_total = vat;
      this.net_total = e.value;
      this.setReverseCalc(this.projCostId);
    }
  }
  public discUpdated(e) {
    // if(e.value>=-this.total_value){
    // console.log('discUpdated', e.value)
    // if(e.value!=''){
    // let discountVal=(this.totalHrs)-(this.totalHrs *(e.target.value/100))
    // let discountVal=this.total_value+(e.value)
    if (!this.editableTotal) {
      let discountVal =
        this.totalHrs +
        this.profit_value +
        e.value +
        parseFloat(this.modified_cost);

      // console.log('discountVal', discountVal, this.total_value, parseFloat(this.modified_cost))
      // total_cost=parseInt(Qty)+parseInt(e.value);
      let total_value = discountVal;
      //reverse calc

      this.total_value = parseFloat(discountVal);
      this.discount_amount = e.value;
      //reverse calc ends
      // this.total_value=discountVal+(discountVal*(this.profit_margin/100));
      // let net_total=this.profit_value+total_hrs;
      //   this.total_value=net_total;
      //reverse calc
      let vat = this.total_value * (5 / 100);
      this.vat_total = vat;
      this.net_total = vat + this.total_value;

      this.disc_value = e.value;

      this.UpdateCostProjectDiscountAndProfitMarginByProjectID(e.value);

      this.onUpdateFinalCost(this.projCostId);
    }
    // }
    // else{
    //   //
    // this.disc_value='';

    //   this.toastr.error('Please enter a valid discount value', undefined, {
    //     positionClass: 'toast-top-center'
    //   });
    // }
  }
  public UpdateCostProjectDiscountAndProfitMarginByProjectID(discount) {
    if (discount != null && discount.value != "") {
      let user_info: object;
      if (localStorage.getItem("user_info")) {
        user_info = JSON.parse(localStorage.getItem("user_info"));
      }
      let postData = {
        id: this.projCostId,
        discount_amount: discount,
        profit_margin_amount: this.net_total,
        modifiedby: user_info["full_name"],
      };

      return this.costService
        .UpdateCostProjectDiscountAndProfitMarginByProjectID(postData)
        .subscribe(
          (data: any) => {
            // let dataObj = JSON.parse(data['token']);

            if (data.status == 200) {
              // this.addformSubmitted=false;

              this.spinner.hide();

              this.toastr.success(data["desc"], undefined, {
                positionClass: "toast-top-center",
              });
            }
            // this.router.navigate(["/organizations"]);
          },
          (error) => {
            this.spinner.hide();

            Swal.fire("Error!", "Error.", "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
          }
        );
    }
  }

  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.drag = true;

    this.getAddress(this.latitude, this.longitude);
  }
  taskDiscchange(taskid, e, index, Qty) {
    const miles = this.milestTaskForm.get("miles") as FormArray;
    let total_cost;
    this.costText = false;

    if (e.value >= -Qty) {
      total_cost = parseInt(Qty) + e.value;
      miles.at(index).patchValue({ total_cost: total_cost });
      this.UpdateCostProjectDiscountAndTotalCostTaskID(
        taskid,
        e.value,
        total_cost,
        "show"
      );
      this.totalCostStudy = parseInt(this.totalCostStudy) + e.value;

      //
    } else {
      //
      miles.at(index).patchValue({ total_cost: Qty });
      this.toastr.error("Please enter a valid discount value", undefined, {
        positionClass: "toast-top-center",
      });
    }

    // let total_cost=(Qty-(Qty *(e.value/100)))
    // total_cost=Math.round(total_cost*100)/100

    //   miles.at(index).patchValue({total_cost: total_cost })

    let hrs = miles.value.reduce(function (sum, record) {
      if (record.is_checkbox == true) return sum + parseInt(record.total_cost);
      else return sum;
    }, 0);

    setTimeout(() => {
      this.totalHrs = hrs;
      var value = hrs * (this.profit_margin / 100);
      let result = Math.round(value * 100) / 100;
      this.profit_value = result;
      this.total_value = this.profit_value + hrs;

      let vat = this.total_value * (5 / 100);
      this.vat_total = vat;
      this.net_total = vat + this.total_value;
    }, 500);
  }
  hrschange(taskid, e, index, Qty) {
    const miles = this.milestTaskForm.get("miles") as FormArray;
    let total_cost;

    this.costText = false;

    if (e.target.value >= -Qty) {
      total_cost = parseFloat(e.target.value) * this.perunitCostHrs;
      miles.at(index).patchValue({ total_cost: total_cost });
      this.UpdateCostProjectHrsTaskID(taskid, e.target.value, total_cost);
    } else {
      miles.at(index).patchValue({ total_cost: Qty });
      this.toastr.error("Please enter a valid discount value", undefined, {
        positionClass: "toast-top-center",
      });
    }

    let hrs = miles.value.reduce(function (sum, record) {
      if (record.is_checkbox == true)
        return sum + parseFloat(record.total_cost);
      else return sum;
    }, 0);
    let total_milesthrs = miles.value
      .map((item) => parseFloat(item.Qty))
      .reduce((prev, next) => prev + next);

    setTimeout(() => {
      this.MilestHrs = total_milesthrs;
      this.totalHrs = hrs;
      var value = hrs * (this.profit_margin / 100);
      let result = Math.round(value * 100) / 100;
      this.profit_value = result;
      this.total_value = this.profit_value + hrs;

      let vat = this.total_value * (5 / 100);
      this.vat_total = vat;
      this.net_total = vat + this.total_value;
    }, 500);
  }

  totalcostchange(taskid, e, index, Qty) {
    const miles = this.milestTaskForm.get("miles") as FormArray;
    let total_cost;

    if (this.costText == true) {
      this.UpdateCostProjectDiscountAndTotalCostTaskID(
        taskid,
        null,
        e.value,
        "show"
      );
      if (e.value >= -Qty) {
        // total_cost=parseInt(Qty)+(e.value);
        miles.at(index).patchValue({ total_cost: e.value });
        //this.UpdateCostProjectDiscountAndTotalCostTaskID(taskid,null,total_cost)
        //
      } else {
        //
        miles.at(index).patchValue({ total_cost: Qty });
        this.toastr.error("Please enter a valid discount value", undefined, {
          positionClass: "toast-top-center",
        });
      }

      // let total_cost=(Qty-(Qty *(e.value/100)))
      // total_cost=Math.round(total_cost*100)/100

      //   miles.at(index).patchValue({total_cost: total_cost })

      let hrs = miles.value.reduce(function (sum, record) {
        if (record.is_checkbox == true)
          return sum + parseFloat(record.total_cost);
        else return sum;
      }, 0);

      // this.totalHrs=hrs;
      // var value=hrs*(this.profit_margin/100);
      // let result=Math.round(value*100)/100
      // this.profit_value=result;

      // this.net_total=this.profit_value+hrs;

      setTimeout(() => {
        this.totalHrs = hrs;
        var value = hrs * (this.profit_margin / 100);
        let result = Math.round(value * 100) / 100;
        this.profit_value = result;
        this.total_value = this.profit_value + hrs;

        let vat = this.total_value * (5 / 100);
        this.vat_total = vat;
        this.net_total = vat + this.total_value;
      }, 500);
    }
  }

  public findCostHrs() {
    this.costService.FetchCostPerHourOrgID().subscribe((data: any) => {
      if (data.length != 0) {
        this.perunitCostHrs = parseFloat(data[0].cost_per_hour);
      }
    });
  }
  public findprofitMargin() {
    this.costService.FetchProfitMarginOrgID().subscribe((data: any) => {
      if (data.length != 0) {
        this.profit_margin = parseInt(data[0].profit_margin);
      }
    });
  }

  public createMilestTaskForm(data, floorNo) {
    const miles = this.milestTaskForm.get("miles") as FormArray;
    var results = [];

    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i]["CostProjectTask"]["length"]; j++) {
        if (data[i]["CostProjectTask"].length != 0) {
          miles.push(this.createMilesTaskFormGroup());
          let unitQty =
            data[i].CostProjectTask[j].qty != "" ||
            data[i].CostProjectTask[j].qty != null
              ? parseFloat(data[i].CostProjectTask[j].qty).toFixed(2)
              : "";
          results.push({
            Label: data[i].CostProjectTask[j].task_name,
            UnitType: "2",
            Qty: unitQty,
            id: data[i].CostProjectTask[j].milestone_id,
            taskid: data[i].CostProjectTask[j].id,
            is_checkbox: data[i].CostProjectTask[j].is_selected,
            Unit: data[i].CostProjectTask[j].total_unit,
            Unithrs: data[i].CostProjectTask[j].default_unit_hours,
            total_cost:
              data[i].CostProjectTask[j].total_cost_amount != null
                ? parseFloat(
                    data[i].CostProjectTask[j].total_cost_amount
                  ).toFixed(2)
                : (
                    data[i].CostProjectTask[j].qty * this.perunitCostHrs
                  ).toFixed(2),
            profit:
              data[i].CostProjectTask[j].discount_amount != null
                ? data[i].CostProjectTask[j].discount_amount
                : "",
            perUnit:
              data[i].CostProjectTask[j].unit != null
                ? data[i].CostProjectTask[j].unit_type
                : "",
            floorUnit: data[i].CostProjectTask[j].unit_type,
          });
          miles.controls.forEach((pair) =>
            pair.patchValue({ is_checkbox: "true" })
          );
        }
      }
    }
    miles.patchValue(results);
  }
  private createServiceFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(""),
      Label: new FormControl(""),
      is_checkbox: new FormControl(""),
      serviceCateg: new FormControl(""),
      tags: new FormControl(""),
      designType: new FormControl(""),
      categid: new FormControl(""),
      primaryCatList: new FormControl([]),
    });
  }
  get taskList(): FormArray {
    return this.summaryFormArray.get("taskList") as FormArray;
  }
  addTaskListFrmInput() {
    return this.formBuilder.group({
      MainCat: [""],
      MainType: [""],
      type: [""],
      inventoryType: [""],
      inventoryItemName: [""],
      supplierName: [""],
      supplierId: [""],
      itemCode: [""],
      itemDescription: [""],
      qty: [""],
      // price: [''],
      remarks: [""],
      mainCategoryId: [""],
      primaryCategoryId: [""],
      subcategoryId: [""],
      inventory_id: [""],
      unitPrice: [0],
      totalPrice: [0],
      discount: [0],
      finalPrice: [0],
      currency: [""],
      discountType: ["value"],
      newValue: false,
      customAdded: false,
      bufferQty: [""],
      isModifiedQty: false,
    });
  }

  initializeSummaryForm() {
    // console.log("INITIALIZE SUMMARY HERE!!!")
    const newTaskFormGroup = this.addTaskListFrmInput();
    this.taskList.push(newTaskFormGroup);
  }
  private createEmailFormGroup(): FormGroup {
    return new FormGroup({
      // 'emailAddress': new FormControl('', Validators.email),
      id: new FormControl(""),
      Label: new FormControl(""),
      is_checkbox: new FormControl(""),
      // 'UnitType': new FormControl(''),
      // 'Qty': new FormControl(''),
      tags: new FormControl(""),
      // 'unit_no': new FormControl(''),
      size: new FormControl(""),
      notes: new FormControl(""),
      designType: new FormControl(""),
      checkbox_value: new FormControl(""),
      selection_limit: new FormControl(""),
      disabledTag: new FormControl(""),
      fromValue: new FormControl(""),
      toValue: new FormControl(""),
      Value: new FormControl(""),
      is_typical: new FormControl(false),
      flatType: new FormArray([this.initType()]),
    });
  }
  private createCalcFormGroup(): FormGroup {
    return new FormGroup({
      // 'emailAddress': new FormControl('', Validators.email),
      id: new FormControl(""),

      Label: new FormControl(""),
      is_checkbox: new FormControl(""),
      // 'UnitType': new FormControl(''),
      // 'Qty': new FormControl(''),
      tags: new FormControl(""),
      // 'unit_no': new FormControl(''),
      size: new FormControl(""),
      notes: new FormControl(""),
      designType: new FormControl(""),
      checkbox_value: new FormControl(""),
      selection_limit: new FormControl(""),
      disabledTag: new FormControl(""),
      fromValue: new FormControl(""),
      toValue: new FormControl(""),
      Value: new FormControl(""),
      is_typical: new FormControl(""),
      flatType: new FormArray([this.initType()]),
    });
  }
  initType() {
    return new FormGroup({
      units: new FormControl("", Validators.required),
      flatVal: new FormControl("", Validators.required),
    });
  }
  getFlatTypes(form) {
    //// console.log(form.get('sections').controls);
    return form.controls.flatType.controls;
  }
  removeFlatTypes(j, k) {
    // console.log('removeFlatTypes', j, k)
    this.isHandleSave = true;
    const control = <FormArray>(
      this.extraUnitForm.get("extras")["controls"][j].get("flatType")
    );
    control.removeAt(k);
  }
  changedEjsMilest(event, i, j) {
    console.log("event", i, j, event.value);
    let selectedVal = event.value;
    let extras = this.extraUnitForm.get("extras").value;
    console.log(extras, "extras");
    if (extras && extras[i].flatType && extras[i].flatType.length > 0) {
      const flag = extras[i].flatType.some(
        (i: any) => i.flatVal === selectedVal
      );
      if (flag) {
        this.toast.error("Flat type already exists");
        this.removeFlatTypes(i, j);
      }
      console.log(flag, "flag");
    }
  }
  private createMilesTaskFormGroup(): FormGroup {
    return new FormGroup({
      // 'emailAddress': new FormControl('', Validators.email),
      id: new FormControl(""),
      taskid: new FormControl(""),

      Label: new FormControl(""),
      is_checkbox: new FormControl(""),
      UnitType: new FormControl("", Validators.required),
      Qty: new FormControl("", Validators.required),
      Unit: new FormControl(""),
      notes: new FormControl(""),
      Unithrs: new FormControl(""),
      total_cost: new FormControl(""),
      profit: new FormControl(""),
      perUnit: new FormControl(""),

      floorUnit: new FormControl(""),
    });
  }
  public changedEjsAssignee(e, index): void {
    const emails = this.emailForm.get("emails") as FormArray;

    let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {
      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(emails.value[i].tags[j]);
        }
      }
    }
    this.tagsArrayValue = tagsdata;

    //     const extras = this.extraUnitForm.get('extras') as FormArray

    // if(extras.value[index].designType[0]!='All' || extras.value[index].designType.length==0 ){
    //   extras.at(index).patchValue({ tags:this.tagsArrayValue.length!=0?this.tagsArrayValue:[] })

    //  }
  }
  changedExtraTags(e, index) {
    const emails = this.emailForm.get("emails") as FormArray;

    let tagsdata = [];

    for (var i = 0; i < emails.value.length; i++) {
      if (emails.value[i].tags && emails.value[i].tags.length != 0) {
        for (var j = 0; j < emails.value[i].tags.length; j++) {
          tagsdata.push(emails.value[i].tags[j]);
        }
      }
    }
    this.tagsArrayValue = tagsdata;

    const extras = this.extraUnitForm.get("extras") as FormArray;

    // if(extras.value[index].designType[0]=='All' || extras.value[index].designType.length==0 ){
    extras.at(index).patchValue({
      tags: this.tagsArrayValue.length != 0 ? this.tagsArrayValue : [],
    });

    //  }
  }

  public onCustomValueSelection(e: SelectEventArgs, index) {
    // args.cancel = true;
    // dropObj.mainList.querySelector('li[datavalue="'+dropObj.inputElement.value+'"]').remove();
    //  dropObj.mainData.pop();
    const extras = this.extraUnitForm.get("extras") as FormArray;

    this.milestoneData = [];
    this.discount_amount = "";
    // this.UpdateCostProjectDiscountAndTotalCostTaskID('')

    if (this.editable == true) {
      this.UpdateCostProjectDiscountAndTotalCostTaskID(
        this.projCostId,
        null,
        null,
        "hide"
      );
    }
    // console.log('eValue', extras.value[index].designType[0]);
    // console.log('SelectEventArgs', e);
    //   if(extras.value[index].designType[0]!='All'){
    // extras.at(index).patchValue({ selection_limit:'1000' })

    //   }
  }
  public qtyChange(e, index) {
    const emails = this.emailForm.get("emails") as FormArray;

    for (var i = 0; i < emails.value.length; i++) {
      if (
        emails.value[i].is_checkbox == false &&
        emails.value[i].unit_no != ""
      ) {
        let tagsArray = [];

        let taglength = emails.value[index].unit_no;

        for (var j = 0; j < taglength; j++) {
          tagsArray.push(emails.value[index].Label + "" + (j + 1));
        }
        emails.at(index).patchValue({ tags: tagsArray });
      }
    }
  }
  public onAddDesignType() {
    // this.addformSubmitted=true;
    //  let date=document.getElementById('dueDate').innerText
    //  $("#dueDate").html("18:56:00");
    //

    // this.teamCount=this.teamMemFetchData.length;

    // team_member_empid.push(user_info['id'])
    let postData = {
      design_name: this.designTypeForm.get("design_Name").value,
    };

    if (this.designTypeForm.get("design_Name").value != "") {
      this.spinner.show();

      return this.costService.AddTypeOfDesign(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {
            // this.addformSubmitted=false;

            this.spinner.hide();
            $("#design_type_modal").modal("hide");
            this.designTypeForm.reset();
            this.fetchDesignType();
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          }
          // this.router.navigate(["/organizations"]);
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    }
  }
  public setReverseCalc(id) {
    // this.addformSubmitted=true;
    //  let date=document.getElementById('dueDate').innerText
    //  $("#dueDate").html("18:56:00");
    //

    // this.teamCount=this.teamMemFetchData.length;

    // team_member_empid.push(user_info['id'])
    let postData = {
      id: id,
      is_reverse: this.editableTotal,
    };

    if (true) {
      this.spinner.show();

      return this.costService.setReverseCalc(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            if (this.editableTotal == true) {
              this.onUpdateFinalCost(this.projCostId);
            }

            this.spinner.hide();
          } else {
            this.spinner.hide();

            Swal.fire("Error!", "Error.", "error").then((result) => {});
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }
  public onUpdateFinalCost(id) {
    // this.addformSubmitted=true;
    //  let date=document.getElementById('dueDate').innerText
    //  $("#dueDate").html("18:56:00");
    //

    // this.teamCount=this.teamMemFetchData.length;

    // team_member_empid.push(user_info['id'])
    let postData = {
      id: id,
      total_hours: this.MilestHrs,
      gross_total_amount: this.totalHrs,
      profit_margin_amount: this.profit_value,
      discount_amount: this.disc_value != "" ? this.disc_value : "",
      total_amount: this.total_value,
      vat_amount: this.vat_total,
      net_total_amount: this.net_total,
      modified_hours: this.showModification ? this.modified_hrs : null,
      modified_value: this.showModification ? this.modified_cost : null,
    };

    if (true) {
      this.spinner.show();

      return this.costService
        .UpdateCostProjectFinalValueByCostProjectID(postData)
        .subscribe(
          (data: any) => {
            if (data.status == 200) {
              this.spinner.hide();
            } else {
              this.spinner.hide();

              Swal.fire("Error!", "Error.", "error").then((result) => {});
            }
          },
          (error) => {
            this.spinner.hide();

            Swal.fire("Error!", "Error.", "error").then((result) => {});
          }
        );
    }
  }
  public fetchUnitDesc() {
    this.typeOfTask = [];

    this.costService.FetchAllUnitDescriptionByOrgID().subscribe((data: any) => {
      var results = [];
      // this.dataSource =  new MatTableDataSource(data);
      // this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.sort;
      var typeOfUnit = [{ id: "", text: "Select" }];
      // let dataObj = JSON.parse(data['token']);
      //

      for (var i = 0; i < data.length; i++) {
        // logik to create new items

        typeOfUnit.push({
          id: data[i].id,
          text: data[i].unit_name,
        });
        results.push({
          id: data[i].id,
          text: data[i].unit_name,
          is_checkbox: data[i].is_checkbox,
        });
      }
      this.typeOfTask = results;
      this.unitTypeData = typeOfUnit;

      // this.createTaskForm('onCreate');
    });
  }
  public extraUnit() {
    this.extraUnitData = [];
    var extratypeOfUnit = [{ id: "", text: "Select" }];

    this.costService
      .FetchAllUnitDescriptionExtraByOrgID()
      .subscribe((data12: any) => {
        // this.dataSource =  new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
        var extraUnits = [];

        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data12.length; i++) {
          // logik to create new items

          extratypeOfUnit.push({
            id: data12[i].id,
            text: data12[i].unit_name,
          });
          extraUnits.push({
            id: data12[i].id,
            text: data12[i].unit_name,
            is_checkbox: data12[i].is_checkbox,
          });
        }
        this.extraUnitData = extraUnits;
        this.extraunitTypeData = extratypeOfUnit;

        // this.createTaskForm('onCreate');
      });
  }
  public locationSetUp() {
    this.mapsAPILoader.load().then(() => {
      //this.nearByPlaces();
      this.geoCoder = new google.maps.Geocoder();
      //  if(this.editableLoc==false){
      this.setCurrentLocation();

      //  }
      // let nearby=new google.maps.places.PlacesService(document.createElement('div'));
      // nearby.nearbySearch({
      //   location: {lat: this.latitude, lng: this.longitude},
      //   radius: 100,

      // }, (results,status) => {
      //   if (status === google.maps.places.PlacesServiceStatus.OK) {
      //     for (var i = 0; i < results.length; i++) {
      //       // this.createMarker(results[i]);
      //
      //     }
      //   }
      //   this.nearbyPlaces=results;

      // });
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result

          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.address = place.formatted_address;

          this.changedLocationData = place;
          this.getChangedMatchedTypes();

          this.changed_address = place.formatted_address;
          // this.web_site = place.website;
          // this.name = place.name;

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          // this.showNearbyPlaces=false;
          if (this.searchElementRef.nativeElement == "") {
            // this.showNearbyPlaces=true;
          }
        });
      });
    });
  }
  public getChangedMatchedTypes() {
    let address_components;
    if (this.changedLocationData.length != 0) {
      address_components = this.changedLocationData["address_components"];
    }

    let i, j, types;
    let address_component;
    // Loop through the Geocoder result set. Note that the results
    // array will change as this loop can self iterate.
    for (i = 0; i < address_components.length; i++) {
      types = address_components[i]["types"];

      for (j = 0; j < types.length; j++) {
        if (types[j] == "street_number") {
          this.changed_street_number = address_components[i]["short_name"];
        }
        if (types[j] === "route") {
          this.changed_route = address_components[i]["long_name"];
        }
        // if (types[j] === 'formatted_address') {
        //   this.formatted_address =  address_components[i]['long_name'];
        // }
        // if (types[j] === 'neighborhood') {
        //   this.changed_street_number =  address_components[i]['long_name'];
        // }
        if (types[j] === "locality") {
          this.changed_locality = address_components[i]["long_name"];
        }
        if (types[j] === "administrative_area_level_1") {
          this.changed_administrative_area_level_1 =
            address_components[i]["long_name"];
        }
        if (types[j] === "administrative_area_level_2") {
          this.changed_administrative_area_level_2 =
            address_components[i]["long_name"];
        }
        if (types[j] === "postal_code") {
          this.changed_postal_code = address_components[i]["long_name"];
        }
        if (types[j] === "country") {
          this.changed_country = address_components[i]["long_name"];
        }
      }
    }

    // address_component = address_components[element];
  }
  public openStatusModal() {
    this.locationSetUp();

    const miles = this.milestTaskForm.get("miles") as FormArray;
    let arrayOfMiles = [];
    let arrayOfTasks = [];
    for (var k = 0; k < this.milestoneData.length; k++) {
      for (var i = 0; i < miles.value.length; i++) {
        if (miles.value[i].id == this.milestoneData[k].id) {
          arrayOfMiles.push({
            // "id": "string",
            // "org_id": "string",
            // "project_id": "string",
            milestone_name: this.milestoneData[k].milestone_name,
            // "created_date": "string",
            // "createdby": "string",
            // "modified_date": "string",
            // "modifiedby": "string",
            // "is_deleted": true,
          });
        }
        //emails.controls.forEach(pair => pair.patchValue({ Label:  data['ProjectUnit'].id, is_checkbox:  data['ProjectUnit'].is_checkbox }));
      }
    }
    let result = [];

    //javascript array has a method foreach that enumerates keyvalue pairs.
    miles.value.forEach((r) => {
      //if an array index by the value of id is not found, instantiate it.
      if (!result[r.id]) {
        //result gets a new index of the value at id.

        result[r.id] = [];
      }
      //push that whole object from api_array into that list
      result[r.id].push(r);
    });
    for (var k = 0; k < this.milestoneData.length; k++) {
      // for (var j = 0; j <result.length; j++) {
      if (result[this.milestoneData[k].id] == this.milestoneData[k].id) {
      }
      // }
    }

    let costProjectMilestone = [
      {
        id: "string",
        org_id: "string",
        project_id: "string",
        milestone_name: "string",
        created_date: "string",
        createdby: "string",
        modified_date: "string",
        modifiedby: "string",
        is_deleted: true,
        costProjectTask: [
          {
            id: "string",
            project_id: "string",
            is_selected: true,
            milestone_id: "string",
            task_name: "string",
            unit: "string",
            qty: "string",
            created_date: "string",
            createdby: "string",
            modified_date: "string",
            modifiedby: "string",
            is_deleted: true,
          },
        ],
      },
    ];

    $("#cost_status_modal").modal("show");
    this.statusForm.patchValue({
      startDate: moment().format("L"),
    });
  }
  public groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  }
  ConvertToQtn(id, project) {
    this.convertProjId = id;

    $("#conversion_modal").modal("show");
    // this.conversionForm.patchValue({
    //   prefixVal: 'is_auto',
    // })

    // this.FindAutoProjectPrefixByOrgID();
    let postData = {
      id: this.convertProjId,
    };

    this.costService.FindByCostProjectID(postData).subscribe(
      (data: any) => {
        if (data) {
          this.convertCstId = data.entityCustomer.id;
        }
        if (data) {
          setTimeout(() => {
            // this.projId=data.leadDeal.id;
            this.convertCustomerDetails = data;
            // this.desgnTypeVal=data.leadProject.design_type_id;
            // this.projTypeVal=data.leadProject.project_type_id;
            // this.pkgTypeVal=data.leadProject.packages_id;
          }, 800);
          this.convertProjDetails = data;
          if (data.entityContact != "" || data.entityContact != null) {
            for (var i = 0; i < data.entityContact.length; i++) {
              if (data.entityContact[i]["is_primary"] == true) {
                // this.contactDetails=data.entityContact[i];
                this.contactDetails = data.entityContact[i];
              }
            }
          } else {
            this.contactDetails = "";
          }
        }
      },

      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  AddQtn() {
    let user;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    this.spinner.show();

    let postData = {
      id: null,
      org_id: localStorage.getItem("org_id"),
      lead_id: this.convertProjId,
      quotation_prefix: this.prefixString,
      quotation_date: moment().format("L"),
      customer_id: this.convertCstId,
      project_name: this.convertProjDetails.project_name,
      quotation_subject: null,
      quotation_body: null,
      warranty_id: null,
      validity: null,
      payment_id: null,
      mode_of_payment_id: null,
      no_of_days: null,
      exclusion_id: null,
      remarks: null,
      tax_id: null,
      stage_id: null,
      createdby: user["full_name"],
    };

    if (this.convertProjDetails.project_name != "") {
      return this.qtnService.AddQuotation(postData).subscribe(
        (data: any) => {
          if (data) {
            this.OnConversionClose();
            this.updateQtnStatus(this.convertProjId);
            this.toastr.success("Added to quotation", undefined, {
              positionClass: "toast-top-center",
            });
            // this.convertSubmitClicked=false;
            this.spinner.hide();
            // this.router.navigate('/cost-project')
            this.router.navigate(["/quotation"]);

            sessionStorage.setItem("qtnId", data.code);
          } else {
            this.spinner.hide();
            this.OnConversionClose();

            this.toastr.error(
              "Something went wrong,please try again later",
              undefined,
              {
                positionClass: "toast-top-center",
              }
            );
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    } else {
      this.OnConversionClose();
      this.spinner.hide();
    }
  }
  public OnStatusModalClose() {
    $("#cost_status_modal").modal("hide");
  }
  public updateQtnStatus(id) {
    let postData = {
      id: id,
      is_quotation: true,
    };
    this.qtnService.UpdateIsQuotationByCostProjectID(postData).subscribe(
      (data: any) => {
        // this.toastr.success(data['desc'], undefined, {
        //   positionClass: 'toast-top-center'
        // });
        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public GetAllProjectStatus() {
    this.projectService.GetAllProjectStatus().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select an option" }];
        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            id: data[i].id,
            text: data[i].project_status_name,
          });
        }

        this.projectStatusData = results;
        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public changedCostStatus(e: any): void {
    this.projStatus = e.value;
  }
  public GetPkgByOrgID() {
    this.costService.FetchAllPackagesByOrgID().subscribe(
      (data: any) => {
        //this.dataSource = new MatTableDataSource(data);
        var results = [{ id: "", text: "Select" }];
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            results.push({
              id: data[i].id,
              text: data[i].package_name,
            });
          }
          this.packageTypeData = results;

          if (data != null && data.length != 0) {
            var packageWithHash = [];
            // let dataObj = JSON.parse(data['token']);
            //

            for (var i = 0; i < data.length; i++) {
              // logik to create new items

              packageWithHash.push({
                value: data[i].id,
                display: data[i].package_name,
              });
            }

            // this.packageTypeData =packageWithHash;
            // this.router.navigate(["/organizations"]);
          }
        }

        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public onUpdateStatus() {
    this.submitClicked = true;
    let postData = {
      id: this.projCostId,
      project_status_id: this.projStatus,
      start_date: moment(this.startdateValue).format("L"),
      end_date: moment(this.enddateValue).format("L"),
      entityLocation: {
        id: "string",
        entity_id: "string",
        geo_address: this.searchElementRef.nativeElement.value,
        formatted_address: this.changed_address
          ? this.changed_address
          : this.formatted_address,
        lat: this.latitude ? JSON.stringify(this.latitude) : "",
        lang: this.longitude ? JSON.stringify(this.longitude) : "",
        street_number: this.changed_street_number
          ? this.changed_street_number
          : this.street_number,
        route: this.changed_route ? this.changed_route : this.route,
        locality: this.changed_locality ? this.changed_locality : this.locality,
        administrative_area_level_2: this.changed_administrative_area_level_2
          ? this.changed_administrative_area_level_2
          : this.administrative_area_level_2,
        administrative_area_level_1: this.changed_administrative_area_level_1
          ? this.changed_administrative_area_level_1
          : this.administrative_area_level_1,
        postal_code: this.changed_postal_code
          ? this.changed_postal_code
          : this.postal_code,
        country: this.changed_country ? this.changed_country : this.country,
        city: this.changed_administrative_area_level_1
          ? this.changed_administrative_area_level_1
          : this.administrative_area_level_1,
      },
    };

    if (this.projStatus != "" && this.statusForm.status == "VALID") {
      this.spinner.show();

      return this.costService.UpdateCostProjectStatusByID(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {
            // this.addformSubmitted=false;
            $("#cost_status_modal").modal("hide");
            this.submitClicked = false;

            this.TaskView();
            this.spinner.hide();
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          }
          // this.router.navigate(["/organizations"]);
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    }
  }

  public onAddProjType() {
    this.projTypeSubmit = true;

    let postData = {
      type_name: this.projTypeForm.get("type_Name").value,
      type_desc: this.projTypeForm.get("desc").value,
    };

    if (this.projTypeForm.status == "VALID") {
      this.spinner.show();

      return this.projectService.AddProjectType(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {
            this.projTypeSubmit = true;
            this.projTypeForm.reset();
            this.GetProjectTypeByOrgID();
            // this.addformSubmitted=false;
            $("#proj_type_modal").modal("hide");

            this.spinner.hide();

            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          }
          // this.router.navigate(["/organizations"]);
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    }
  }

  OnConversionClose() {
    $("#conversion_modal").modal("hide");
    this.convertBtn.nativeElement.click();

    this.conversionForm.reset();
    this.convertBtn.nativeElement.click();
    // this.conversionForm.patchValue({
    //   Type:"new"
    // })
    // this.desgnTypeVal='';
    // this.projTypeVal='';
    // this.pkgTypeVal='';
    // this.desgnTypeVal='';
    // this.projTypeVal='';
    // this.pkgTypeVal='';
    // this.showPrefixText=false;
  }
  public onAdd(item) {}
  public errorMessages = {
    must_be_email: "",
  };
  public onRemove(item) {}

  public onSelect(item) {}

  public onFocus(item) {}
  //make async function
  public async fetchDesignType() {
    try {
      const data: any = await this.costService
        .FetchAllTypeOfDesignByOrgID()
        .toPromise();

      if (data) {
        const results = [{ id: "", text: "Select" }];
        const ejsResults = [];

        for (let i = 0; i < data.length; i++) {
          results.push({
            id: data[i].id,
            text: data[i].design_name,
          });
          ejsResults.push({
            id: data[i].id,
            text: data[i].design_name,
          });
        }

        this.designTypeData = results;
        this.ejsDesignTypeData = ejsResults;
      }
    } catch (error) {
      console.error("Error fetching design types:", error);
    }
  }

  public onstartDtChange(e) {
    this.startdateValue = moment(e.value).format("L");
    this.disableEndDate = false;
    this.statusForm.get("startDate").valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      if (this.statusForm.get("startDate").value != "") {
        this.startValChange = true;
      }
      let startDate = this.statusForm.get("startDate").value;
      this.minEndDate = startDate;
      this.statusForm.get("endDate").enable();
    });
  }
  public onendDtChange(e) {
    this.enddateValue = moment(e.value).format("L");
  }
  public checkIsOrg(e) {
    if (e.srcElement.checked == true) {
      this.showOrgDetails = true;
    } else {
      this.showOrgDetails = false;
    }
  }
  public async getTimesheetByEmpId() {
    try {
      const data: any = await this.userService
        .GetLastTimesheetByEmpID()
        .toPromise();

      if (data) {
        const timeValue = moment(data.check_in).format("hh:mm a");
        this.minStartTime = timeValue;

        if (data.check_out) {
          this.currentTime = moment(data.check_out).format("hh:mm a");
        } else {
          this.currentTime = moment().format("hh:mm a");
        }
      }
    } catch (error) {
      Swal.fire("Error!", error, "error");
    }
  }

  GetLastAddedQtnPrefixByOrgID() {
    this.spinner.show();
    this.qtnService.GetLastAddedQuotationPrefixByOrgID().subscribe(
      (data: any) => {
        if (data.code == "") {
          this.projectService.GetAllPrefixByOrgID().subscribe(
            (data: any) => {
              this.spinner.hide();

              for (var i = 0; i < data.length; i++) {
                if (data[i].type == "qtn") {
                  if (data[i].prefix_for == "default") {
                    let splittable;

                    if (data[i].prefix_name) {
                      let prefix_name = data[i].prefix_name;

                      splittable = prefix_name.split("/");
                      if (parseInt(splittable[3]).toString().length == 1) {
                        let jobNo = "0000";
                        this.prefixString =
                          splittable[0] +
                          "/" +
                          moment().format("YY") +
                          "/" +
                          moment().format("MM") +
                          "/" +
                          jobNo;
                      }
                      //  let jobNo=(parseInt(splittable[3])+1)
                      // this.prefixString=data[i].prefix_name+jobNo;
                    }
                  } else if (data[i].prefix_for == "custom") {
                    this.showPrefixText = true;
                  } else if (data[i].prefix_for == "sequence") {
                    let splittable;
                    this.showPrefixText = false;

                    if (data[i].prefix_name) {
                      // let project_prefix=data.project_prefix;
                      let prefix_name = data[i].prefix_name;

                      splittable = prefix_name.split("/");

                      if (parseInt(splittable[1]).toString().length == 1) {
                        let jobNo = "000";
                        this.prefixString = splittable[0] + "/" + jobNo;
                      }
                    }
                  } else if (data[i].prefix_for == "random") {
                    let splittable;
                    if (data[i].prefix_name) {
                      let prefix_name = data[i].prefix_name;

                      splittable = prefix_name.split("/");
                      let jobNo = parseInt(splittable[1]) + 1;
                      let random = Math.floor(1000 + Math.random() * 9000);

                      this.prefixString = splittable[0] + "/" + random;
                    }
                  }
                }
              }

              this.AddQtn();
            },
            (error) => {
              this.spinner.hide();

              Swal.fire("Error!", error, "error").then(
                //used Arrow function here
                (result) => {
                  //  this.router.navigate(['/dashboard']);
                }
              );
            }
          );
        } else {
          let lastAddedprefix = data.code;
          let lastAddprefixSplit = lastAddedprefix.split("/").pop();
          this.projectService.GetAllPrefixByOrgID().subscribe(
            (data: any) => {
              this.spinner.hide();

              for (var i = 0; i < data.length; i++) {
                if (data[i].type == "qtn") {
                  if (data[i].prefix_for == "default") {
                    let splittable;

                    if (data[i].prefix_name) {
                      let prefix_name = data[i].prefix_name;

                      splittable = prefix_name.split("/");
                      if (parseInt(lastAddprefixSplit).toString().length == 1) {
                        let jobNo = "000" + (parseInt(lastAddprefixSplit) + 1);
                        this.prefixString =
                          splittable[0] +
                          "/" +
                          moment().format("YY") +
                          "/" +
                          moment().format("MM") +
                          "/" +
                          jobNo;
                      } else if (
                        parseInt(lastAddprefixSplit).toString().length == 2
                      ) {
                        let jobNo = "00" + (parseInt(lastAddprefixSplit) + 1);
                        // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                        this.prefixString =
                          splittable[0] +
                          "/" +
                          moment().format("YY") +
                          "/" +
                          moment().format("MM") +
                          "/" +
                          jobNo;
                      } else if (
                        parseInt(lastAddprefixSplit).toString().length == 3
                      ) {
                        let jobNo = "0" + (parseInt(lastAddprefixSplit) + 1);
                        // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                        this.prefixString =
                          splittable[0] +
                          "/" +
                          moment().format("YY") +
                          "/" +
                          moment().format("MM") +
                          "/" +
                          jobNo;
                      } else {
                        let jobNo = parseInt(lastAddprefixSplit) + 1;
                        // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                        this.prefixString =
                          splittable[0] +
                          "/" +
                          moment().format("YY") +
                          "/" +
                          moment().format("MM") +
                          "/" +
                          jobNo;
                      }
                      //  let jobNo=(parseInt(splittable[3])+1)
                      // this.prefixString=data[i].prefix_name+jobNo;
                    }
                  } else if (data[i].prefix_for == "custom") {
                    this.showPrefixText = true;
                  } else if (data[i].prefix_for == "sequence") {
                    let splittable;
                    this.showPrefixText = false;

                    if (data[i].prefix_name) {
                      // let project_prefix=data.project_prefix;
                      let prefix_name = data[i].prefix_name;

                      splittable = prefix_name.split("/");

                      if (parseInt(lastAddprefixSplit).toString().length == 1) {
                        let jobNo = "000" + (parseInt(lastAddprefixSplit) + 1);
                        this.prefixString = splittable[0] + "/" + jobNo;
                      } else if (
                        parseInt(lastAddprefixSplit).toString().length == 2
                      ) {
                        let jobNo = "00" + (parseInt(lastAddprefixSplit) + 1);
                        // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                        this.prefixString = splittable[0] + "/" + jobNo;
                      } else if (
                        parseInt(lastAddprefixSplit).toString().length == 3
                      ) {
                        let jobNo = "0" + (parseInt(lastAddprefixSplit) + 1);
                        // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                        this.prefixString = splittable[0] + "/" + jobNo;
                      } else {
                        let jobNo = parseInt(lastAddprefixSplit) + 1;
                        // this.prefixString = 'ENQ/' + formattedPrefix + '/' + jobNo;
                        this.prefixString = splittable[0] + "/" + jobNo;
                      }
                    }
                  } else if (data[i].prefix_for == "random") {
                    let splittable;
                    if (data[i].prefix_name) {
                      let prefix_name = data[i].prefix_name;

                      splittable = prefix_name.split("/");
                      let random = Math.floor(1000 + Math.random() * 9000);
                      let jobNo = parseInt(lastAddprefixSplit) + 1;

                      this.prefixString = splittable[0] + "/" + random;
                    }
                  }
                }
              }
              this.AddQtn();
            },
            (error) => {
              this.spinner.hide();

              Swal.fire("Error!", error, "error").then(
                //used Arrow function here
                (result) => {
                  //  this.router.navigate(['/dashboard']);
                }
              );
            }
          );
        }
      },
      (error) => {
        this.spinner.hide();

        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public async GetLastAddedCostPrefixByOrgID() {
    const data: any = await this.costService
      .GetLastAddedCostPrefixByOrgID()
      .toPromise();

    if (data.code == "") {
      const prefixData: any = await this.projectService
        .GetAllPrefixByOrgID()
        .toPromise();

      for (const item of prefixData) {
        if (item.type == "est") {
          if (item.prefix_for == "default") {
            const splittable = item.prefix_name.split("/");
            const jobNo = this.getJobNo(splittable[3]);
            this.prefixString =
              splittable[0] +
              "/" +
              moment().format("YY") +
              "/" +
              moment().format("MM") +
              "/" +
              jobNo;
          } else if (item.prefix_for == "custom") {
            this.showPrefixText = true;
          } else if (item.prefix_for == "sequence") {
            this.showPrefixText = false;
            const splittable = item.prefix_name.split("/");
            const jobNo = this.getJobNo(splittable[1]);
            this.prefixString = splittable[0] + "/" + jobNo;
          } else if (item.prefix_for == "random") {
            const splittable = item.prefix_name.split("/");
            const random = Math.floor(1000 + Math.random() * 9000);
            this.prefixString = splittable[0] + "/" + random;
          }
        }
      }
    } else {
      const lastAddedprefix = data.code;
      const lastAddprefixSplit = lastAddedprefix.split("/").pop();
      const prefixData: any = await this.projectService
        .GetAllPrefixByOrgID()
        .toPromise();

      for (const item of prefixData) {
        if (item.type == "est") {
          if (item.prefix_for == "default") {
            const splittable = item.prefix_name.split("/");
            const jobNo = this.getJobNo(lastAddprefixSplit, splittable[3]);
            this.prefixString =
              splittable[0] +
              "/" +
              moment().format("YY") +
              "/" +
              moment().format("MM") +
              "/" +
              jobNo;
          } else if (item.prefix_for == "custom") {
            this.showPrefixText = true;
          } else if (item.prefix_for == "sequence") {
            this.showPrefixText = false;
            const splittable = item.prefix_name.split("/");
            const jobNo = this.getJobNo(lastAddprefixSplit, splittable[1]);
            this.prefixString = splittable[0] + "/" + jobNo;
          } else if (item.prefix_for == "random") {
            const splittable = item.prefix_name.split("/");
            const random = Math.floor(1000 + Math.random() * 9000);
            const jobNo = parseInt(lastAddprefixSplit) + 1;
            this.prefixString = splittable[0] + "/" + random;
          }
        }
      }
    }
  }

  private getJobNo(lastAddprefixSplit: string, currentPrefix?: string) {
    const length = currentPrefix ? currentPrefix.length : 1;
    const jobNo = parseInt(lastAddprefixSplit) + 1;
    return jobNo.toString().padStart(length, "0");
  }

  public GetIndustryByOrgID() {
    this.empService.getAllIndustryType().subscribe(
      (data: any) => {
        var results = [
          {
            id: "",
            text: "Select",
          },
        ];

        for (var i = 0; i < data.length; i++) {
          results.push({
            id: data[i].id,
            text: data[i].industry_type_name,
          });
        }

        this.industryData = results;
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  saveContactAddress(e) {
    //     let user_info:object;
    // if(localStorage.getItem('user_info')){
    //     user_info= JSON.parse(localStorage.getItem('user_info'));
    //

    // }
    this.savedContactPh = true;
    let data = {
      // brName:this.orgProfileForm.get('brName').value,
      // brType:this.industryValueText,
      // brAddress:this.brsearchElementRef.nativeElement.value,
      id: null,
      entity_id: null,
      first_name: this.customerContactForm.get("fname").value,
      last_name: this.customerContactForm.get("lname").value,
      name:
        this.customerContactForm.get("fname").value +
        " " +
        this.customerContactForm.get("lname").value,
      // "phone":this.customerContactForm.get('mobile').value ,
      phone:
        this.customerContactForm.get("mobile").value != null &&
        this.customerContactForm.get("mobile").value != ""
          ? this.customerContactForm
              .get("mobile")
              .value.internationalNumber.replace(/ /g, "")
          : null,
      phone_iso_name:
        this.customerContactForm.get("mobile").value != null &&
        this.customerContactForm.get("mobile").value != ""
          ? this.customerContactForm.get("mobile").value.countryCode
          : null,
      email: this.customerContactForm.get("email").value,
      note: this.customerContactForm.get("note").value,
      department: null,
      relationship:
        this.cstRelationValueTxt != "Select" && this.cstRelationValueTxt != ""
          ? this.cstRelationValueTxt
          : null,
      designation: this.customerContactForm.get("designation").value,
      is_primary: false,
    };

    if (this.customerContactForm.get("mobile").status == "VALID") {
      this.savedContactPh = false;
      brList.push(data);

      brList[0]["is_primary"] = true;
      this.showAddContact = false;
      this.branchDataSource = brList;
      this.customerContactForm.reset();
      this.cstRelationValue = "";
      this.disableSaveBranch = true;
    }
    // this.industryBranchValue='';

    //  if(this.editable){
    //    this.onEditSubmit(e)
    //  }
  }
  // saveContactAddress(e){

  //   //     let user_info:object;
  //   // if(localStorage.getItem('user_info')){
  //   //     user_info= JSON.parse(localStorage.getItem('user_info'));
  //   //

  //   // }
  //     let data={
  //       // brName:this.orgProfileForm.get('brName').value,
  //       // brType:this.industryValueText,
  //       // brAddress:this.brsearchElementRef.nativeElement.value,
  //       "id":null,
  //       "entity_id":null,
  //       "first_name":this.customerContactForm.get('fname').value,
  //       "last_name": this.customerContactForm.get('lname').value,
  //       "name":this.customerContactForm.get('fname').value+ ' '+ this.customerContactForm.get('lname').value,
  //       "phone":this.customerContactForm.get('mobile').value,
  //       "email": this.customerContactForm.get('email').value,
  //       "note": this.customerContactForm.get('note').value,
  //       "department": null,
  //       "relationship": this.cstRelationValueTxt!='Select' && this.cstRelationValueTxt!=''?this.cstRelationValueTxt:null,

  //       "designation": this.customerContactForm.get('designation').value,
  //       "is_primary":false

  //     }
  //     brList.push(data)

  //     brList[0]['is_primary']=true;
  //     this.showAddContact=false;
  //     this.branchDataSource=brList;
  //     this.customerContactForm.reset();
  //     this.cstRelationValue='';
  //     // this.industryBranchValue='';

  //      this.disableSaveBranch=true;
  //     //  if(this.editable){
  //     //    this.onEditSubmit(e)
  //     //  }
  //     }
  addTask() {
    $("#task_log_modal").modal("show");
  }
  OnTaskClose() {
    $("#task_log_modal").modal("hide");
    this.taskCloseBtn.nativeElement.click();
  }

  public GetAllTaskByEmpID() {}

  public onAddMeeting() {
    let user;
    this.meetingFormSubmit = true;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    if (this.meetingForm.get("startTime").value) {
      let startTime = this.meetingForm.get("startTime").value;
      let endTime = this.meetingForm.get("endTime").value;
      let date = moment().format("MM/DD/YYYY");
      this.startmeetTime = date.concat(" " + startTime);
      this.endmeetTime = date.concat(" " + endTime);
    }

    let postData = {
      id: null,
      entity_id: sessionStorage.getItem("costId"),
      meeting_name: this.meetingForm.get("meeeting_Name").value,
      location: this.meetingForm.get("meeeting_loc").value,
      desc: this.meetingForm.get("desc").value,
      start_time: this.startmeetTime,
      end_time: this.endmeetTime,
      host: this.empVal,
      participant_id: this.meetingForm.get("participantId").value,
    };

    if (this.meetingForm.status == "VALID") {
      this.spinner.show();

      return this.quotationService.AddEntityMeeting(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.spinner.hide();

            $("#meeting_modal").modal("hide");
            this.meetCloseBtn.nativeElement.click();

            this.GetAllOpenActivitiesEntityID();
            this.GetAllCloseActivitiesEntityID();
            this.meetingForm.reset();
            this.meetingForm.patchValue({
              startTime: moment().format("hh:mm a"),
            });
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          } else if (data.status == 205) {
            this.spinner.hide();
            this.toastr.error(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
            $("#meeting_modal").modal("hide");
            this.meetCloseBtn.nativeElement.click();
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["result"].desc, "error").then(
              (result) => {}
            );
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }

  openAttachModal() {
    $("#attachment_modal").modal("show");
  }
  closeAttachModal() {
    $("#attachment_modal").modal("hide");
  }
  public onUpdateMeeting() {
    let user;
    this.meetingFormSubmit = true;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    if (this.meetingForm.get("startTime").value) {
      let startTime = this.meetingForm.get("startTime").value;
      let endTime = this.meetingForm.get("endTime").value;
      let date = moment().format("MM/DD/YYYY");
      this.startmeetTime = date.concat(" " + startTime);
      this.endmeetTime = date.concat(" " + endTime);
    }

    let postData = {
      id: this.editMeetId,
      entity_id: sessionStorage.getItem("costId"),

      meeting_name: this.meetingForm.get("meeeting_Name").value,
      location: this.meetingForm.get("meeeting_loc").value,
      desc: this.meetingForm.get("desc").value,
      start_time: this.startmeetTime,
      end_time: this.endmeetTime,
      host: this.empVal,
      participant_id: this.meetingForm.get("participantId").value,
    };

    if (this.meetingForm.status == "VALID") {
      this.spinner.show();

      return this.quotationService.AddEntityMeeting(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.spinner.hide();

            $("#meeting_modal").modal("hide");
            this.meetCloseBtn.nativeElement.click();

            this.GetAllOpenActivitiesEntityID();
            this.meetingForm.patchValue({
              startTime: moment().format("hh:mm a"),
            });

            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["result"].desc, "error").then(
              (result) => {}
            );
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }
  public addNotes() {
    let postData = {
      id: null,
      entity_id: sessionStorage.getItem("costId"),
      notes: this.notesForm.get("notes").value,
      title: this.notesForm.get("title").value,
    };

    if (this.notesForm.status == "VALID") {
      this.spinner.show();

      return this.quotationService.AddEntityNotes(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.spinner.hide();
            this.notesForm.reset();
            this.showTextArea4 = false;
            this.FetchEntityNotesEntityID();
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["result"].desc, "error").then(
              (result) => {}
            );
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }
  public updateNotes() {
    let postData = {
      id: this.editnotesId,
      entity_id: sessionStorage.getItem("costId"),

      notes: this.notesForm.get("notes").value,
      title: this.notesForm.get("title").value,
    };

    if (this.notesForm.status == "VALID") {
      this.spinner.show();

      return this.quotationService.UpdateEntityNotes(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.spinner.hide();
            this.notesForm.reset();
            this.showTextArea4 = false;
            this.notesEditable = false;
            this.FetchEntityNotesEntityID();
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["result"].desc, "error").then(
              (result) => {}
            );
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }
  public notesDelete(id) {
    let postData = {
      id: id,
    };

    if (true) {
      this.spinner.show();

      return this.quotationService.RemoveEntityNotes(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.spinner.hide();

            this.FetchEntityNotesEntityID();
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["result"].desc, "error").then(
              (result) => {}
            );
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }
  public onAddCall() {
    let user;
    this.callFormSubmit = true;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    let callStartTime = "";
    let callEndTime = "";
    let scheduleTime = "";
    let startTime = this.callForm.get("startTime").value;
    let endTime = this.callForm.get("endTime").value;
    let date = moment().format("MM/DD/YYYY");
    callStartTime = date.concat(" " + startTime);
    callEndTime = date.concat(" " + endTime);
    // if(this.callForm.get('callType').value=='completed' && this.callForm.get('startTime').value){
    //   let startTime=this.callForm.get('startTime').value;
    //   let endTime=this.callForm.get('endTime').value;
    // let date=moment().format('MM/DD/YYYY');
    // callStartTime=date.concat(' ' +startTime) ;
    // callEndTime=date.concat(' ' +endTime) ;

    // }
    // if(this.callForm.get('callType').value=='schedule' && this.callForm.get('scheduleTime').value){
    //   let startTime=this.callForm.get('scheduleTime').value;
    // let date=moment().format('MM/DD/YYYY');
    // callEndTime=date.concat(' ' +startTime) ;
    // callStartTime=moment(this.callForm.get('startDate').value).format('L')

    // }
    // if(this.callForm.get('callType').value=='current' ){

    // callEndTime=null ;
    // callStartTime=null

    // }

    let postData = {
      id: null,

      entity_id: sessionStorage.getItem("costId"),

      subject: this.callForm.get("subject").value,
      contact_id: this.entityContactVal,
      call_purpose: this.purposeValTxt,
      is_current_call: true,
      is_completed_call: false,
      is_schedule_call: false,
      start_time: callStartTime,
      end_time: callEndTime,
      call_desc: this.callForm.get("desc").value,
      call_result: this.callresValTxt,
      // "host": this.callForm.get('callType').value=='schedule'?this.empVal:null
    };

    if (this.callForm.status == "VALID" && this.entityContactVal != "") {
      this.spinner.show();
      return this.quotationService.AddEntityCall(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.spinner.hide();

            $("#call_modal").modal("hide");
            this.GetAllOpenActivitiesEntityID();
            this.GetAllCloseActivitiesEntityID();
            this.callCloseBtn.nativeElement.click();
            this.callForm.reset();
            this.entityContactVal = "";
            this.empVal = "";
            this.purposeVal = "";
            this.callresVal = "";
            this.callForm.patchValue({
              callType: "current",
              startDate: moment().format("L"),
            });
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          } else if (data.status == 205) {
            this.spinner.hide();
            this.toastr.error(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
            $("#call_modal").modal("hide");
            this.callCloseBtn.nativeElement.click();
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["result"].desc, "error").then(
              (result) => {}
            );
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }
  public onUpdateCall() {
    let user;
    this.callFormSubmit = true;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    let callStartTime = "";
    let callEndTime = "";
    let scheduleTime = "";
    let startTime = this.callForm.get("startTime").value;
    let endTime = this.callForm.get("endTime").value;
    let date = moment().format("MM/DD/YYYY");
    callStartTime = date.concat(" " + startTime);
    callEndTime = date.concat(" " + endTime);
    // if(this.callForm.get('callType').value=='completed' && this.callForm.get('startTime').value){
    //   let startTime=this.callForm.get('startTime').value;
    //   let endTime=this.callForm.get('endTime').value;
    // let date=moment().format('MM/DD/YYYY');
    // callStartTime=date.concat(' ' +startTime) ;
    // callEndTime=date.concat(' ' +endTime) ;

    // }
    // if(this.callForm.get('callType').value=='schedule' && this.callForm.get('scheduleTime').value){
    //   let startTime=this.callForm.get('scheduleTime').value;
    // let date=moment().format('MM/DD/YYYY');
    // callEndTime=date.concat(' ' +startTime) ;
    // callStartTime=moment(this.callForm.get('startDate').value).format('L')

    // }
    // if(this.callForm.get('callType').value=='current' ){

    // callEndTime=null ;
    // callStartTime=null

    // }

    let postData = {
      id: null,
      entity_id: sessionStorage.getItem("costId"),

      subject: this.callForm.get("subject").value,
      contact_id: this.entityContactVal,
      call_purpose: this.purposeValTxt,
      is_current_call: true,
      is_completed_call: false,
      is_schedule_call: false,
      start_time: callStartTime,
      end_time: callEndTime,
      call_desc: this.callForm.get("desc").value,
      call_result: this.callresValTxt,
      host:
        this.callForm.get("callType").value == "schedule" ? this.empVal : null,
    };

    if (this.callForm.status == "VALID") {
      this.spinner.show();

      return this.quotationService.UpdateEntityCall(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.spinner.hide();

            $("#call_modal").modal("hide");
            this.callCloseBtn.nativeElement.click();

            this.GetAllOpenActivitiesEntityID();
            this.GetAllCloseActivitiesEntityID();

            this.callForm.reset();
            this.entityContactVal = "";
            this.empVal = "";
            this.purposeVal = "";
            this.callresVal = "";
            this.callForm.patchValue({
              callType: "current",
              startDate: moment().format("L"),
            });
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["result"].desc, "error").then(
              (result) => {}
            );
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }
  callMinsRadioChange() {
    let currentTime = this.callForm.get("startTime").value;

    // if (this.projectForm.get('prefixVal').value == 'is_custom' ||this.conversionForm.get('prefixVal').value == 'is_custom' ) {
    if (this.callForm.get("no_mins").value == 5) {
      // let fromDate=moment(this.today).add(7, 'day').toDate();
      this.callForm.patchValue({
        endTime: moment(currentTime, "hh:mm a")
          .add(5, "minutes")
          .format("hh:mm a"),
      });
    } else if (this.callForm.get("no_mins").value == 10) {
      // let fromDate=moment(this.today).add(14, 'day').toDate();
      this.callForm.patchValue({
        endTime: moment(currentTime, "hh:mm a")
          .add(10, "minutes")
          .format("hh:mm a"),
      });
      // this.FindAutoProjectPrefixByOrgID();
    } else if (this.callForm.get("no_mins").value == 15) {
      this.callForm.patchValue({
        endTime: moment(currentTime, "hh:mm a")
          .add(15, "minutes")
          .format("hh:mm a"),
      });
      // this.FindAutoProjectPrefixByOrgID();
    }
    // if(this.callForm.get('endTime').value>this.currentTime){
    //   this.showValidTimeError=true;
    // }else{
    //   this.showValidTimeError=false;

    // }
    if (
      new Date(
        moment().format("YYYY-MM-DD") + " " + this.callForm.get("endTime").value
      ) > new Date(moment().format("YYYY-MM-DD") + " " + this.currentTime)
    ) {
      this.showValidTimeError = true;
    } else {
      this.showValidTimeError = false;
    }
    // this.FindAutoProjectPrefixByOrgID();
  }
  addCall() {
    $("#call_modal").modal("show");
    this.getAllEmployeeList("");
    this.FindByEntityContactOrgID();
    // this.callForm.patchValue({

    //   startTime:moment().format('hh:mm a'),

    // })
    this.callForm.get("endTime").enable();
    let startTime = this.callForm.get("startTime").value;
    this.minEndTime = startTime;
  }
  public callStartTimeChanged() {
    this.callForm.get("startTime").valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      if (this.callForm.get("startTime").value != "") {
        this.startValChange = true;
      }
      let startTime = this.callForm.get("startTime").value;
      this.minEndTime = startTime;

      this.callForm.get("endTime").enable();
      this.callForm.patchValue({
        no_mins: "",
        endTime: "",
      });
      this.showValidTimeError = false;
    });
    /**
     * name
     */
  }
  public meetDelete(id) {
    let postData = {
      id: id,
    };

    if (true) {
      this.spinner.show();

      return this.quotationService.RemoveEntityMeeting(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.spinner.hide();

            this.GetAllOpenActivitiesEntityID();
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["result"].desc, "error").then(
              (result) => {}
            );
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }
  public FetchEntityNotesEntityID() {
    let postData = {
      id: sessionStorage.getItem("costId"),
    };
    this.quotationService.FetchEntityNotesEntityID(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          let datas = new DataManager(data);
          this.notesData = datas.dataSource["json"];
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  public GetAllOpenActivitiesEntityID() {
    let postData = {
      id: sessionStorage.getItem("costId"),
    };
    this.quotationService.GetAllOpenActivitiesEntityID(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          let datas = new DataManager(data);
          this.meetingData = datas.dataSource["json"];
          this.meetingToolbar = ["Search"];
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  GetAllCloseActivitiesEntityID() {
    let postData = {
      id: sessionStorage.getItem("costId"),
    };
    this.quotationService.GetAllCloseActivitiesEntityID(postData).subscribe(
      (data: any) => {
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          let datas = new DataManager(data);
          this.closeData = datas.dataSource["json"];
          this.closeToolbar = ["Search"];
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  showRows4() {
    this.showTextArea4 = true;
  }
  cancelText() {
    this.showTextArea4 = false;
    this.notesEditable = false;
  }
  notesEdit(id) {
    let postData = {
      id: id,
    };
    this.quotationService.FindByEntityNotesID(postData).subscribe(
      (data: any) => {
        if (data) {
          this.showTextArea4 = true;
          this.notesEditable = true;

          this.notesForm.patchValue({
            title: data.title,
            notes: data.notes,
          });
          this.editnotesId = id;

          //this.projectData=ds1.dataSource['json'];
        }
        //  let datas = new DataManager(data);
        //   this.projectData = datas.dataSource['json'];

        // data.forEach((data,index)=>{
        //   if(data){
        //    let index12=index+1;
        //
        //     this.projectData['index'].rowValue=index12;
        //          }
        //   });
        //   this.initialSort = {
        //     columns: [{ field: 'dep_name', direction: 'Ascending' },
        //     { field: 'alias', direction: 'Descending' }]
        // };
        //

        this.pageSettings = { pageSizes: true, pageCount: 5 };
        this.toolbar = ["Search", "ExcelExport", "PdfExport"];
        // this.router.navigate(["/organizations"]);
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  addFlatTypes(j) {
    this.isHandleSave = true;
    console.log(j);
    this.addFlatTypeSubmit = true;
    const extras = this.extraUnitForm.get("extras") as FormArray;
    console.log(extras, "CHECK");
    // console.log(j);
    const control = <FormArray>(
      this.extraUnitForm.get("extras")["controls"][j].get("flatType")
    );
    console.log(control);
    if (control.status == "VALID") {
      this.addFlatTypeSubmit = false;

      control.push(this.initType());
    }

    // // console.log('extrasquestions',extras.value[j].get('flatType'));
    // extras.insert(j, this.initType());

    //   const control = extras[j].get('questions');
    //  // // console.log(control);
    //   control.push(this.initType());
  }
  compareFlatTypeArrays(existingArray, newArray) {
    function expandTypicalItems(newArray) {
      const expandedItems = [];
      newArray.forEach((item) => {
        if (item.is_typical) {
          const baseLabel = item.Label;
          const from = +item.fromValue;
          const to = +item.toValue;

          for (let i = from; i <= to; i++) {
            expandedItems.push({
              Label: `${baseLabel}-${i}`,
              flatType: item.flatType,
              is_typical: item.is_typical,
              fromValue: item.fromValue,
              toValue: item.toValue,
            });
          }
        } else {
          expandedItems.push({
            Label: item.Label,
            flatType: item.flatType,
            is_typical: item.is_typical,
            fromValue: item.fromValue,
            toValue: item.toValue,
          });
        }
      });

      return expandedItems;
    }
    const removeProperties = (array) => {
      return array.map(({ spanlen, fltDescription, ...rest }) => rest);
    };
    function compareArrays(arr1, arr2) {
      function normalizeFlatType(flatTypes) {
        return flatTypes
          .slice()
          .map((ft) => ({
            flatVal: ft.flatVal,
            units: ft.units,
          }))
          .sort((a, b) => a.flatVal.localeCompare(b.flatVal));
      }

      function areFlatTypesEqual(flatTypes1, flatTypes2) {
        if (flatTypes1.length !== flatTypes2.length) {
          console.error("FlatType arrays have different lengths");
          return false;
        }

        const sorted1 = normalizeFlatType(flatTypes1);
        const sorted2 = normalizeFlatType(flatTypes2);

        if (JSON.stringify(sorted1) !== JSON.stringify(sorted2)) {
          console.error("FlatType arrays are not equal", { sorted1, sorted2 });
          return false;
        }

        return true;
      }

      function normalizeArray(arr) {
        return arr
          .slice()
          .sort((a, b) => a.Label.localeCompare(b.Label))
          .map((item) => ({
            ...item,
            flatType: normalizeFlatType(item.flatType),
          }));
      }

      const sortedArr1 = normalizeArray(arr1);
      const sortedArr2 = normalizeArray(arr2);

      console.log(sortedArr1, sortedArr2, "CHECK NORMALIZED ARRAY");

      if (sortedArr1.length !== sortedArr2.length) {
        console.error("Arrays have different lengths");
        return false;
      }

      return sortedArr1.every((item, index) => {
        const otherItem = sortedArr2[index];

        if (item.Label !== otherItem.Label) {
          console.error("Labels do not match", {
            item: item.Label,
            otherItem: otherItem.Label,
          });
          return false;
        }

        if (!areFlatTypesEqual(item.flatType, otherItem.flatType)) {
          console.error("FlatTypes do not match for label", item.Label);
          return false;
        }

        if (item.is_typical !== otherItem.is_typical) {
          console.error("is_typical does not match for label", item.Label);
          return false;
        }

        if (item.fromValue !== otherItem.fromValue) {
          console.error("fromValue does not match for label", item.Label);
          return false;
        }

        if (item.toValue !== otherItem.toValue) {
          console.error("toValue does not match for label", item.Label);
          return false;
        }

        return true;
      });
    }

    let expandedNewArr = expandTypicalItems(newArray);

    let filteredExistingArr = removeProperties(existingArray);

    let areFlatTypeArraysEqual = compareArrays(
      filteredExistingArr,
      expandedNewArr
    );
    console.log(filteredExistingArr, expandedNewArr, "CHECK");
    console.log(areFlatTypeArraysEqual, "areFlatTypeArraysEqual");
    return areFlatTypeArraysEqual;
  }

  // const areFlatTypeArraysEqual = compareFlatTypeArrays(existingArr, newArr);
  // // console.log(areFlatTypeArraysEqual);
  async handleCustomization(serviceId, servName) {
    this.SerCatName = servName.value.Label;
    // console.log(serviceId, servName, "SERVICE!!!!!!!!!!!!");
    this.SerCatId = serviceId;
    this.spinner.show();

    try {
      const floorData = await this.intfutService
        .GetintfutFloorById({ id: this.editTaskId })
        .toPromise();
      if (Array.isArray(floorData) && floorData.length > 0) {
        this.floorData = floorData;
        this.newTblData = this.generateNewTableData(floorData);
        console.log(this.newTblData, "NEW TBL DATA");
      }

      const extras = this.extraUnitForm.get("extras") as FormArray;
      if (this.newTblData.length > 0) {
        let isEqual = this.compareFlatTypeArrays(this.newTblData, extras.value);
        // console.log(isEqual, "CHECK IF IT IS EQUAL");

        if (isEqual) {
          this.openNewCstModal(serviceId, servName);
          // this.openServiceSelectionModal(serviceId);
        } else {
          const result = await Swal.fire({
            title: "Do you want to continue without saving the scope of work?",
            text: "Please Note you won't be able to revert this",
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: "Continue",
            cancelButtonText: "Cancel",
          });

          if (result.value) {
            this.openNewCstModal(serviceId, servName);
          }
        }
      } else {
        this.toastr.warning(
          "Please add the required units for customization",
          undefined,
          {
            positionClass: "toast-top-center",
          }
        );
      }
    } catch (error) {
      console.error("Error handling customization:", error);
      this.toastr.error(
        "An error occurred while handling customization.",
        undefined,
        {
          positionClass: "toast-top-center",
        }
      );
    }
  }

  public async addIntFutFloor(project_id: string) {
    this.spinner.show();

    try {
      const extrasFormVal = this.extraUnitForm.getRawValue();
      const extras = this.extraUnitForm.get("extras") as FormArray;

      if (extrasFormVal.extras.length > 0) {
        const floorData = extrasFormVal.extras.map((form) => ({
          Label: form.Label,
          flatType: form.flatType,
          is_typical:
            form.is_typical && form.is_typical !== "" ? form.is_typical : false,
          from_value: form.fromValue.toString(),
          to_value: form.toValue.toString(),
        }));

        const postData = {
          org_id: localStorage.getItem("org_id"),
          project_id: project_id,
          floorData: floorData,
          created_by: this.user["full_name"],
        };

        const response: any = await this.intfutService
          .AddIntfut_floor(postData)
          .toPromise();

        if (response.status === "200") {
          this.toastr.success("Data has been saved successfully", undefined, {
            positionClass: "toast-top-center",
          });
          this.opensaveflat(extras);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      this.toastr.error(
        "Something went wrong! Please try again later.",
        undefined,
        {
          positionClass: "toast-top-center",
        }
      );
    } finally {
      this.spinner.hide();
    }
  }

  calculateStructureSummary(
    data
  ): { label: string; data: { flatName: string; units: number }[] }[] {
    const resultArray: {
      label: string;
      data: { flatName: string; units: number }[];
    }[] = [];

    data.forEach((item) => {
      const multiplier = item.is_typical ? 1 : parseInt(item.units, 10) || 1;
      const fromValue = parseInt(item.fromValue, 10) || 1;
      const toValue = parseInt(item.toValue, 10) || 1;

      for (let i = fromValue; i <= toValue; i++) {
        const labelSuffix = item.is_typical ? `-${i}` : ""; // Add suffix for typical floors
        const labeledItem = { ...item, Label: item.Label + labelSuffix };
        const flatNameUnitsArray: { flatName: string; units: number }[] = [];

        labeledItem.flatType.forEach((flv) => {
          const flatVal = flv.flatVal;
          const flatTypeInfo = this.flatTypesData.find(
            (info) => info.id === flatVal
          );

          if (flatTypeInfo) {
            const totalUnits = multiplier * parseInt(flv.units, 10);
            flatNameUnitsArray.push({
              flatName: flatTypeInfo.text,
              units: totalUnits,
            });
          }
        });

        resultArray.push({
          label: labeledItem.Label,
          data: flatNameUnitsArray,
        });
      }
    });

    return resultArray;
  }
  openServiceSelectionModal(selServ) {
    this.selectedPrimaryCatList = [];
    this.primaryCatList = {
      id: "",
      serviceName: "",
      primaryCategory: [],
    };
    if (selServ.primaryCategory.length > 0) {
      this.primaryCatList = selServ;
      console.log(this.primaryCatList, "SEL SERV PRIM");
    }
    console.log(selServ.primaryCategory, "selServ");
    $("#serviceSelectionModal").modal("show");
  }

  generateProjectId() {
    const characters = "0123456789abcdef";

    const randomHex = (length) =>
      Array.from(
        { length },
        () => characters[Math.floor(Math.random() * characters.length)]
      ).join("");

    const firstPart = randomHex(4);
    const secondPart = [4, 12].map((length) => randomHex(length)).join("-");

    return `${firstPart}-${secondPart}`;
  }
  handleServicesOnFloorUpdate() {
    let existingServices = this.servicesForm.getRawValue();
    // console.log(existingServices, "**********")
    if (existingServices.services.length > 0) {
      existingServices.services.forEach((service) => {
        this.clearExistingServiceData(service.id);
      });
      // console.log("HERE")
      this.servicesForm.reset();
    }
    if (this.taskList && this.taskList.length > 0) {
      this.taskList.clear();
    }

    // console.log(existingServices, "EXISTING SERVICES")
  }

  isHandleSave = false;
  async handleSaveFlat() {
    this.isHandleSave = false;
    this.isToBeUpdated = true;
    const extras = this.extraUnitForm.get("extras") as FormArray;
    let isEqual = false;
    isEqual = this.compareFlatTypeArrays(this.newTblData, extras.value);
    console.log(isEqual, "TESTING EQUAL");
    if (this.newTblData.length > 0 && !this.editEnable) {
      if (!isEqual) {
        Swal.fire({
          title: "Saving this data will overwrite the existing scope of work ?",
          text: "Please Note you won't be able to revert this",
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: " Save",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          this.closeAccordion = false;
          if (result.value === true) {
            await this.addIntFutFloor(this.newTaskId);
            this.handleServicesOnFloorUpdate();
          }
        });
      } else {
        this.toastr.info("Data has been already saved", undefined, {
          positionClass: "toast-top-center",
        });
      }
    } else if (this.newTblData.length == 0 && this.editEnable) {
      await this.addIntFutFloor(this.editTaskId);
      this.handleServicesOnFloorUpdate();
    } else if (this.newTblData.length > 0 && this.editEnable && !isEqual) {
      Swal.fire({
        title: "Saving this data will overwrite the existing scope of work ?",
        text: "Please Note you won't be able to revert this",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: " Save",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        this.closeAccordion = false;
        if (result.value === true) {
          await this.addIntFutFloor(this.editTaskId);
          this.handleServicesOnFloorUpdate();
        }
      });
    } else if (this.newTblData.length > 0 && this.editEnable && isEqual) {
      this.toastr.warning("Data has already been saved!");
    } else {
      await this.addIntFutFloor(this.newTaskId);
    }
  }
  generateNewTableData(data) {
    const result = {};
    const floorTypical = {};

    data.forEach((entry) => {
      const { floor_name, is_typical } = entry;

      if (!floorTypical[floor_name]) {
        floorTypical[floor_name] = is_typical === true;
      } else if (is_typical === true) {
        floorTypical[floor_name] = true;
      }
    });

    data.forEach((entry) => {
      const {
        floor_name,
        flat_name,
        flat_type,
        id,
        custom_number,
        from_value,
        to_value,
      } = entry;

      if (!result[floor_name]) {
        result[floor_name] = {
          Label: floor_name,
          flatType: [],
          fltDescription: [],
          spanlen: 0,
          is_typical: floorTypical[floor_name] || false,
        };
      }

      const flatTypeIndex = result[floor_name].flatType.findIndex(
        (ft) => ft.flatVal === flat_type
      );
      if (flatTypeIndex === -1) {
        result[floor_name].flatType.push({
          flatVal: flat_type,
          units: "1",
        });
      } else {
        result[floor_name].flatType[flatTypeIndex].units = (
          parseInt(result[floor_name].flatType[flatTypeIndex].units, 10) + 1
        ).toString();
      }

      result[floor_name].fltDescription.push({
        itemName: flat_name,
        unitId: id,
        customNumber: custom_number,
        isChanged: false,
      });

      result[floor_name].spanlen = result[floor_name].fltDescription.length;
      result[floor_name].fromValue = from_value;
      result[floor_name].toValue = to_value;
    });

    return Object.values(result);
  }

  opensaveflat(extras) {
    this.savedExtrasArr = extras.value;
    const calcUnit = this.calcUnitForm.get("calcUnit") as FormArray;
    console.log(extras, "CHECK Extras");
    // console.log(this.flatTypesData,"CHECKING FLAT DATA")
    // this.newTblData = [];
    let tagsdata = [];
    let fltDescription = [];

    // for (var i = 0; i < extras.value.length; i++) {
    //   let obj = {};
    //   var flDescObj = {};

    //   //Checking if the current Iteration is Typical or not
    //   if (!extras.value[i].is_typical) {
    //     obj["is_typical"] = false;
    //     obj["Label"] = extras.value[i].Label;

    //     fltDescription = [];
    //     let flatTypes = extras.value[i].flatType;
    //     // console.log(extras.value[i].flatType, "FLAT TYPE");

    //     flatTypes.forEach((el) => {
    //       if (el.units !== "" && parseInt(el.units) >= 2) {
    //         for (let f = 1; f <= parseInt(el.units); f++) {
    //           let flDescObj = {};
    //           let placeName = this.flatTypesData.find(
    //             (itm) => itm.id === el.flatVal
    //           );

    //           if (placeName) {
    //             flDescObj["itemName"] = `${placeName.text}-${f}`;
    //             flDescObj["id"]=''
    //             fltDescription.push(flDescObj);
    //           }
    //         }
    //       } else {
    //         let placeName = this.flatTypesData.find(
    //           (itm) => itm.id === el.flatVal
    //         );
    //         if (placeName) {
    //           let singleDescObj = {};
    //           singleDescObj["itemName"] = `${placeName.text}-1`;
    //           console.log(placeName.text, "PLACE NAME");
    //           console.log(singleDescObj, "singleDescObj");
    //           fltDescription.push(singleDescObj);
    //         }
    //       }
    //     });
    //     obj["fltDescription"] = fltDescription;
    //     obj["spanlen"] = fltDescription.length;
    //     obj["flatType"] = extras.value[i].flatType;
    //     // console.log(obj, "CHECK Obj");
    //     this.newTblData.push(obj);
    //   } else {
    //     for (
    //       let em = extras.value[i].fromValue;
    //       em <= extras.value[i].toValue;
    //       em++
    //     ) {
    //       let newObj = {};

    //       newObj["Label"] = extras.value[i].Label + " " + em;
    //       newObj["is_typical"] = true;
    //       newObj["fromValue"] = extras.value[i].fromValue;
    //       newObj["toValue"] = extras.value[i].toValue;

    //       fltDescription = [];
    //       extras.value[i].flatType.map((el) => {
    //         if (el.units != "" && parseInt(el.units) >= 2) {
    //           for (let f = 1; f <= parseInt(el.units); f++) {
    //             flDescObj = {};
    //             var placeName = this.flatTypesData.filter(
    //               (itm) => itm.id === el.flatVal
    //             )[0];
    //             flDescObj["itemName"] = placeName.text + "-" + f;
    //             fltDescription.push(flDescObj);
    //           }
    //         } else {
    //           let singleDescObj = {};
    //           var placeName = this.flatTypesData.filter(
    //             (itm) => itm.id === el.flatVal
    //           )[0];
    //           singleDescObj["itemName"] = placeName.text + "-" + 1;

    //           if (
    //             fltDescription.filter(
    //               (fl: any) => fl.itemName === singleDescObj["itemName"]
    //             ).length === 0
    //           ) {
    //             fltDescription.push(singleDescObj);
    //           }
    //         }
    //       });
    //       newObj["fltDescription"] = fltDescription;
    //       newObj["spanlen"] = fltDescription.length;
    //       newObj["flatType"] = extras.value[i].flatType;
    //       // console.log("newObj--->", newObj);

    //       this.newTblData.push(newObj);
    //     }
    //   }
    // }
    // this.newTblData=this.generateNewTableData(this.floorData)
    console.log(this.newTblData, "floorModified on openSaveFlat");
    // console.log(this.newTblData,"this.newTblData on openSaveFlat")
    this.structureSummary = this.calculateStructureSummary(extras.value);

    if (this.structureSummary.length > 0) {
      this.flatunitSummary = this.structureSummary.reduce(
        (accumulator, floor) => {
          floor.data.forEach((flat) => {
            const existingFlat = accumulator.find(
              (item) => item.flatName === flat.flatName
            );

            if (existingFlat) {
              existingFlat.totalUnits += flat.units;
            } else {
              accumulator.push({
                flatName: flat.flatName,
                totalUnits: flat.units,
              });
            }
          });

          return accumulator;
        },
        []
      );
    }
    this.enableFloorSummary = true;
    console.log(this.structureSummary, "this.structureSummary ");
  }
  meetEdit(id, type) {
    if (type == "Meeting") {
      let postData = {
        id: id,
      };
      this.quotationService.FindByEntityMeetingID(postData).subscribe(
        (data: any) => {
          if (data) {
            this.meetingEditable = true;
            this.getAllEmployeeList("");

            this.meetingForm.get("endTime").enable();

            $("#meeting_modal").modal("show");
            this.meetingForm.patchValue({
              meeeting_Name: data.meeting_name,
              meeeting_loc: data.location,
              startTime: moment(data.start_time).format("hh:mm a"),
              endTime: moment(data.end_time).format("hh:mm a"),
              desc: data.desc,
              participantId: data.participant_id,
            });

            this.editMeetId = id;
            setTimeout(() => {
              this.empVal = data.host;
            }, 1000);
          }
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    } else if (type == "Call") {
      this.FindByEntityContactOrgID();

      let postData = {
        id: id,
      };
      this.quotationService.FindByEntityCallID(postData).subscribe(
        (data: any) => {
          if (data) {
            this.callEditable = true;
            this.getAllEmployeeList("");

            this.entityContactVal = data.contact_id;

            $("#call_modal").modal("show");
            this.callForm.patchValue({
              subject: data.subject,

              desc: data.call_desc,
            });

            if (data.is_completed_call == true) {
              this.callForm.patchValue({
                callType: "completed",
                showStartEndTime: true,
                showDateEndTime: false,
                startTime: moment(data.start_time).format("hh:mm a"),
                endTime: moment(data.end_time).format("hh:mm a"),
              });
              this.callForm.get("endTime").enable();
            } else if (data.is_current_call == true) {
              this.callForm.patchValue({
                callType: "current",
                showStartEndTime: false,
                showDateEndTime: false,
                startTime: moment(data.start_time).format("hh:mm a"),
                endTime: moment(data.end_time).format("hh:mm a"),
              });
            } else if (data.is_schedule_call == true) {
              this.callForm.patchValue({
                callType: "schedule",
                showStartEndTime: false,
                showDateEndTime: true,
                startDate: moment(data.start_time).format("hh:mm a"),
                scheduleTime: moment(data.end_time).format("hh:mm a"),
              });
              this.callForm.get("scheduleTime").enable();
            }

            this.editCallId = id;
            setTimeout(() => {
              this.empVal = data.host;
              if (data.call_purpose == "None") {
                this.purposeVal = 2;
              } else if (data.call_purpose == "Administrative") {
                this.purposeVal = 3;
              } else if (data.call_purpose == "Negotiation") {
                this.purposeVal = 4;
              }
              if (data.call_result == "None") {
                this.callresVal = 2;
              } else if (data.call_result == "Not Interested") {
                this.callresVal = 4;
              } else if (data.call_result == "Interested") {
                this.callresVal = 3;
              }
            }, 1000);
          }
        },
        (error) => {
          Swal.fire("Error!", error, "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
    } else {
    }
  }

  addMeeting() {
    $("#meeting_modal").modal("show");
    this.getAllEmployeeList("");
    this.mode = "CheckBox";
  }

  public FindByEntityContactOrgID() {
    // this.countryData = []
    // this.countryValue=''
    let entityId = {
      entityID: this.editTaskId,
      cstID: this.callCstId,
    };

    return this.quotationService
      .GetAllEntityContactByEntityIDAndCstID(entityId)
      .subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          var results = [{ id: "  ", text: "Select" }];

          // let dataObj = JSON.parse(data['token']);
          //

          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            results.push({
              id: data[i].id,
              text: data[i].name,
            });
            if (data[i]["is_primary"] == true) {
              this.entityContactVal = data[i].id;
            }
          }

          this.entityContactData = results;
        },
        (error) => {
          Swal.fire("Error!", "Error.", "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
  }
  getContactList(id) {
    // this.countryData = []
    // this.countryValue=''
    let entityId = {
      entityID: this.editTaskId,
      cstID: this.callCstId,
    };

    return this.quotationService
      .GetAllEntityContactByEntityIDAndCstID(entityId)
      .subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          var results = [{ id: "  ", text: "Select" }];

          // let dataObj = JSON.parse(data['token']);
          //

          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            results.push({
              id: data[i].id,
              text: data[i].name,
            });
          }

          this.entityContactData = results;
          this.entityContactVal = id;
          this.showBranchList = true;
          brList = data;
          this.branchDataSource = data;
        },
        (error) => {
          Swal.fire("Error!", "Error.", "error").then(
            //used Arrow function here
            (result) => {
              //  this.router.navigate(['/dashboard']);
            }
          );
        }
      );
  }

  public openContactModal(type) {
    //$('#details_view_modal').modal('show')
    //  $('#activity_log_modal').modal('hide')
    // console.log('openDetailedView', type)
    if (type == "meeting") {
      $("#meeting_modal").removeClass("fade").modal("hide");
      this.meetCloseBtn.nativeElement.click();

      this.closeActLog = true;
      this.typeOfModal = "meeting";
    } else if (type == "call") {
      $("#call_modal").removeClass("fade").modal("hide");
      this.callCloseBtn.nativeElement.click();

      this.closeActLog = false;
      this.typeOfModal = "call";
    }

    $("#contact_modal").modal("show").addClass("fade");
  }
  closeContactModal() {
    // $('#details_view_modal').modal('hide')
    // $('.modal-backdrop').remove();
    //  $('#activity_log_modal').modal('show')
    $("#contact_modal").removeClass("fade").modal("hide");
    this.contactCloseBtn.nativeElement.click();
    this.customerContactForm.reset();
    this.savedContactPh = false;
    if (this.closeActLog == true) {
      $("#meeting_modal").modal("show").addClass("fade");
    } else {
      $("#call_modal").modal("show").addClass("fade");
    }
  }
  saveContact(e) {
    this.savedContactPh = true;
    let postData = {
      id: null,
      entity_id: this.editTaskId,
      first_name: this.customerContactForm.get("fname").value,
      last_name: this.customerContactForm.get("lname").value,
      name:
        this.customerContactForm.get("fname").value +
        " " +
        this.customerContactForm.get("lname").value,
      // "phone":this.customerContactForm.get('mobile').value ,
      phone:
        this.customerContactForm.get("mobile").value != null &&
        this.customerContactForm.get("mobile").value != ""
          ? this.customerContactForm
              .get("mobile")
              .value.internationalNumber.replace(/ /g, "")
          : null,
      phone_iso_name:
        this.customerContactForm.get("mobile").value != null &&
        this.customerContactForm.get("mobile").value != ""
          ? this.customerContactForm.get("mobile").value.countryCode
          : null,
      email: this.customerContactForm.get("email").value,
      note: this.customerContactForm.get("note").value,
      department: null,

      relationship:
        this.cstRelationValueTxt != "Select" && this.cstRelationValueTxt != ""
          ? this.cstRelationValueTxt
          : null,

      designation: this.customerContactForm.get("designation").value,
      is_primary: false,
    };

    if (this.customerContactForm.get("mobile").status == "VALID") {
      // console.log('saveContactAddress', postData)
      this.savedContactPh = false;

      this.spinner.show();

      return this.quotationService.AddEntityContact(postData).subscribe(
        (data: any) => {
          if (data.status == "200") {
            this.spinner.hide();
            this.customerContactForm.reset();
            this.cstRelationValue = "";
            this.closeContactModal();
            if (this.typeOfModal == "meeting") {
              this.getAllEmployeeList(data.code);
            } else if (this.typeOfModal == "call") {
              this.getContactList(data.code);
            }
            // this.getContactList(data.code);
            // this.getAllEmployeeList();
            this.disableSaveBranch = true;
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          } else {
            this.spinner.hide();
            this.toastr.error(
              "Something went wrong,Please try again later",
              undefined,
              {
                positionClass: "toast-top-center",
              }
            );
          }
        },
        (error) => {
          this.spinner.hide();

          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }

  changedEntityContact(e) {
    this.entityContactVal = e.value;
  }
  public getAllEmployeeList(id) {
    var contactList = [];
    var employeeList = [];

    this.empService.getEmployeeByOrgId().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];

        // let dataObj = JSON.parse(data['token']);
        //
        let user_info = JSON.parse(localStorage.getItem("user_info"));

        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          // if(user_info['id']!=data[i].id){

          results.push({
            id: data[i].id,
            text: data[i].first_name,
          });
          if (user_info["id"] != data[i].id) {
            employeeList.push({
              id: data[i].id,
              text: data[i].first_name,
              category: "Employee",
            });
          }
          if (user_info["id"] == data[i].id) {
            this.empVal = data[i].id;
          }
        }

        this.empData = results;
        let entityId = {
          entityID: this.editTaskId,
          cstID: this.callCstId,
        };
        this.quotationService
          .GetAllEntityContactByEntityIDAndCstID(entityId)
          .subscribe(
            (data: any) => {
              // let dataObj = JSON.parse(data['token']);

              var results = [{ id: "  ", text: "Select" }];

              // let dataObj = JSON.parse(data['token']);
              //

              for (var i = 0; i < data.length; i++) {
                // logik to create new items

                contactList.push({
                  id: data[i].id,
                  text: data[i].name,
                  category: "Contact",
                });
              }
              this.branchDataSource = data;

              // this.entityContactData = results;
              this.empGroup = employeeList.concat(contactList);
              if (id != "") {
                this.meetingForm.patchValue({
                  participantId: [id],
                });
              }
            },
            (error) => {
              Swal.fire("Error!", "Error.", "error").then(
                //used Arrow function here
                (result) => {
                  //  this.router.navigate(['/dashboard']);
                }
              );
            }
          );
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  OnMeetingModalClose() {
    $("#meeting_modal").modal("hide");
    this.meetCloseBtn.nativeElement.click();

    this.meetingForm.reset();
    this.empVal = "";
  }
  OnCallModalClose() {
    $("#call_modal").modal("hide");
    this.callCloseBtn.nativeElement.click();

    this.callForm.reset();
    this.contactVal = "";
    this.entityContactVal = "";

    this.empVal = "";
    this.purposeVal = "";
    this.callresVal = "";
  }

  public startTimeChanged() {
    this.disableEndTime = false;

    this.meetingForm.get("startTime").valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      if (this.meetingForm.get("startTime").value != "") {
        this.startValChange = true;
      }
      let startTime = this.meetingForm.get("startTime").value;
      this.minEndTime = startTime;

      this.meetingForm.get("endTime").enable();
    });
    /**
     * name
     */
  }

  callRadioChange() {
    // if (this.projectForm.get('prefixVal').value == 'is_custom' ||this.conversionForm.get('prefixVal').value == 'is_custom' ) {
    if (this.callForm.get("callType").value == "current") {
      // let fromDate=moment(this.today).add(7, 'day').toDate();

      this.callForm.patchValue({
        showStartEndTime: false,
        showDateEndTime: false,
      });
    } else if (this.callForm.get("callType").value == "completed") {
      // let fromDate=moment(this.today).add(14, 'day').toDate();
      this.callForm.patchValue({
        showStartEndTime: true,
        showDateEndTime: false,
      });
      // this.FindAutoProjectPrefixByOrgID();
    } else if (this.callForm.get("callType").value == "schedule") {
      this.callForm.patchValue({
        showStartEndTime: false,
        showDateEndTime: true,
      });
      // this.FindAutoProjectPrefixByOrgID();
    }
    // this.FindAutoProjectPrefixByOrgID();
  }
  public actList = [
    { display: "Meeting", value: 1 },
    { display: "Call", value: 2 },
  ];
  changedEmp(e) {
    this.empVal = e.value;
  }
  changedCallPurpose(e) {
    this.purposeVal = e.value;
    if (e.value != "") {
      this.purposeValTxt = e.data[0].text;
    }
  }
  changedCallRes(e) {
    this.callresVal = e.value;
    if (e.value != "") {
      this.callresValTxt = e.data[0].text;
    }
  }
  public viewCloseAct(id) {
    $("#close_act_modal").modal("show");
    this.GetLocalActivitieEntityID(id);
  }
  GetLocalActivitieEntityID(id) {
    this.spinner.show();
    let postData = {
      id: id,
    };
    this.quotationService.GetLocalActivitieEntityID(postData).subscribe(
      (data: any) => {
        this.spinner.hide();

        // let dataObj = JSON.parse(data['token']);
        //
        if (data.length != 0) {
          this.closeActData = data[0];
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  onCloseActClose() {
    $("#close_act_modal").modal("hide");
    this.closeActBtn.nativeElement.click();
  }
  ngOnInit() {
    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      editable: true,
    };
    console.log(this.platformDetectionService.toString(), "Platform");
    this.showAddForm = false;
    this.showTaskList = true;
    this.editEnable = false;
    this.showModification = false;

    // this.GetProjectTypeByOrgID();
    // this.FindAutoProjectPrefixByOrgID();
    // this.GetPriorityByOrgID();
    // this.GetLastAddedCostPrefixByOrgID();
    // this.getTimesheetByEmpId();
    // this.fetchDesignType();
    // this.findCostHrs();
    this.getIntfutServiceNames();
    this.getIntFutServices();
    this.addInventoryFormInputs();
    // this.fetchBuildingTypes();
    // this.getIntFutServices();
    this.employeeGridToolItems = ["Search"];

    this.summaryFormArray = this.formBuilder.group({
      taskList: this.formBuilder.array([]),
    });

    // this.initializeSummaryForm()
    this.emailForm = this.formBuilder.group({
      emails: this.formBuilder.array([]),
    });
    this.extraUnitForm = this.formBuilder.group({
      extras: this.formBuilder.array([]),
    });
    this.servicesForm = this.formBuilder.group({
      services: this.formBuilder.array([]),
    });
    this.calcUnitForm = this.formBuilder.group({
      calcUnit: this.formBuilder.array([]),
    });
    this.milestTaskForm = this.formBuilder.group({
      miles: this.formBuilder.array([]),
    });

    this.myForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });

    this.addCamTypeFormGroup = this.formBuilder.group({
      camTypes: this.formBuilder.array([], [Validators.required]),
    });

    this.addNVRFormGroup = this.formBuilder.group({
      nvrTypes: this.formBuilder.array([], [Validators.required]),
    });

    this.addNVRwithoutPOEFormGroup = this.formBuilder.group({
      nvrwithoutTypes: this.formBuilder.array([], [Validators.required]),
    });
    this.projectForm = new FormGroup({
      project_name: new FormControl("", [Validators.required]),
      desc: new FormControl(""),
      startDate: new FormControl(""),
      endDate: new FormControl(""),
      completeDate: new FormControl(""),
      accessControl: new FormControl(""),
      prefixVal: new FormControl(""),
      customer_Name: new FormControl(""),
      contact_name: new FormControl(""),
      contact_type: new FormControl(""),
      city: new FormControl(""),
      prefix_name: new FormControl(""),
      floor_no: new FormControl("", [Validators.required]),
      plot_size: new FormControl(""),
      plotVal: new FormControl(""),
      builtVal: new FormControl(""),
      built_area: new FormControl(""),
      street_1: new FormControl(""),
      street_2: new FormControl(""),
      country: new FormControl(""),
      name: new FormControl(""),
      position: new FormControl(""),
      phone: new FormControl(""),
      mobile: new FormControl(""),
      email: new FormControl("", [
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      tags: new FormControl(""),
      note: new FormControl(""),
      cst_name: new FormControl(""),
      serviceCategName: new FormControl(""),
      plot_no: new FormControl(""),
      building_type: new FormControl(""),
    });

    this.customerForm = new FormGroup({
      customer_Name: new FormControl(""),
      last_Name: new FormControl(""),
      name: new FormControl(""),
      company_Name: new FormControl(""),
      contact_name: new FormControl(""),
      customer_type: new FormControl(""),
      customer_phone: new FormControl("", [Validators.required]),
      customer_email: new FormControl("", [
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),

      city: new FormControl(""),
      website: new FormControl(""),
      revenue: new FormControl(""),
      emp_no: new FormControl(""),
      street_1: new FormControl(""),
      street_2: new FormControl(""),

      country: new FormControl(""),
      fname: new FormControl("", [Validators.required]),
      lname: new FormControl("", [Validators.required]),
      position: new FormControl(""),
      phone: new FormControl("", [Validators.required]),
      mobile: new FormControl(""),
      email: new FormControl("", [
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      relationship: new FormControl(""),
      desgn: new FormControl(""),
      note: new FormControl(""),
    });
    this.customerContactForm = new FormGroup({
      fname: new FormControl("", [Validators.required]),
      lname: new FormControl("", [Validators.required]),
      department: new FormControl(""),
      note: new FormControl(""),
      relationship: new FormControl(""),

      designation: new FormControl(""),
      //  phone: new FormControl(''),
      mobile: new FormControl("", [Validators.required]),

      //  mobile: new FormControl('',[patternValidator(/^\+\d{1,3}-\d{9,10}$/)]),
      email: new FormControl("", [
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
    });
    this.customerContactForm.valueChanges.subscribe((selectedValue) => {
      if (
        this.customerContactForm.get("fname").status == "VALID" &&
        this.customerContactForm.get("lname").status == "VALID" &&
        this.customerContactForm.get("email").status == "VALID"
      ) {
        this.disableSaveBranch = false;
      } else {
        this.disableSaveBranch = true;
      }
    });
    this.designTypeForm = new FormGroup({
      design_Name: new FormControl(""),
      cost: new FormControl(""),
    });
    this.conversionForm = new FormGroup({
      Type: new FormControl(""),
      desc: new FormControl(""),
      project_name: new FormControl("", [Validators.required]),
      amount: new FormControl(""),
      basicCost: new FormControl(""),
      prefixVal: new FormControl(""),
      prefix_name: new FormControl(""),
      remarks: new FormControl(""),
    });
    this.projTypeForm = new FormGroup({
      type_Name: new FormControl("", [Validators.required]),
      desc: new FormControl(""),
    });

    this.statusForm = new FormGroup({
      startDate: new FormControl(""),
      endDate: new FormControl("", [Validators.required]),
    });

    this.projectForm.patchValue({
      prefixVal: "is_auto",
      startDate: moment().format("L"),
      floor_no: 1,
      plotVal: "sq_ft",
      builtVal: "built_sq_ft",
    });
    this.taskOptions = {
      placeholder: "Select",
      width: "100%",
    };
    this.multiOption = {
      multiple: true,
      placeholder: "Select",
      width: "100%",
    };
    if (sessionStorage.getItem("costId")) {
      this.taskEdit(sessionStorage.getItem("costId"));
      this.milestoneData = [];

      this.GetAllCloseActivitiesEntityID();
      this.GetAllOpenActivitiesEntityID();
      this.FetchEntityNotesEntityID();
    }
    // if(sessionStorage.getItem("modifyProjId")){
    //   this.modifyProj(sessionStorage.getItem("modifyProjId"));

    // }

    this.meetingForm = new FormGroup({
      meeeting_Name: new FormControl("", [Validators.required]),
      startDate: new FormControl(""),
      endDate: new FormControl(""),
      startTime: new FormControl("", [Validators.required]),
      endTime: new FormControl("", [Validators.required]),
      meeeting_loc: new FormControl(""),
      callType: new FormControl(""),
      desc: new FormControl(""),
      participantId: new FormControl("", [Validators.required]),
    });
    this.callForm = new FormGroup({
      subject: new FormControl("", [Validators.required]),
      startDate: new FormControl(""),
      startTime: new FormControl(""),
      endTime: new FormControl(""),
      scheduleTime: new FormControl(""),
      callType: new FormControl(""),
      showStartEndTime: new FormControl(""),
      showDateEndTime: new FormControl(""),
      desc: new FormControl(""),
      no_mins: new FormControl(""),
    });

    this.meetingForm.get("endTime").disable();
    this.callForm.get("endTime").disable();

    this.meetingForm.get("endTime").valueChanges.subscribe(() => {
      if (this.meetingForm.get("endTime").value != "") {
        this.endValChange = true;
      } else {
        this.endValChange = false;
      }
    });

    this.extraUnitForm.get("extras").valueChanges.subscribe(() => {
      //let nwChange = this.emailForm.get('extras').value;
      let existFrmLen = this.calcUnitForm.get("calcUnit") as FormArray;

      if (existFrmLen.value.length > 0) {
        this.resetPreSumTable();
      }
    });

    this.notesForm = new FormGroup({
      notes: new FormControl("", [Validators.required]),
      title: new FormControl(""),
    });
    // $.getScript("assets/js/departments-datatable.js")
    this.callForm.patchValue({
      callType: "current",
      startDate: moment().format("L"),
    });
    if (JSON.parse(localStorage.getItem("userRights")).length != 0) {
      // console.log('if')
      let userRights = JSON.parse(localStorage.getItem("userRights"));
      for (var i = 0; i < userRights.length; i++) {
        if (userRights[i].module_name == "Estimation") {
          if (
            userRights[i].section_name == "View List" &&
            userRights[i].is_allow == true
          ) {
            this.showList = true;
          } else if (
            userRights[i].section_name == "View List" &&
            userRights[i].is_allow == false
          ) {
            this.showList = false;
          }
          if (
            userRights[i].section_name == "Add" &&
            userRights[i].is_allow == true
          ) {
            this.showAddBtn = true;
          } else if (
            userRights[i].section_name == "Add" &&
            userRights[i].is_allow == false
          ) {
            this.showAddBtn = false;
          }
          if (
            userRights[i].section_name == "Edit" &&
            userRights[i].is_allow == true
          ) {
            this.showEditBtn = true;
          } else if (
            userRights[i].section_name == "Edit" &&
            userRights[i].is_allow == false
          ) {
            this.showEditBtn = false;
          }
          if (
            userRights[i].section_name == "Delete" &&
            userRights[i].is_allow == true
          ) {
            this.showDeleteBtn = true;
          } else if (
            userRights[i].section_name == "Delete" &&
            userRights[i].is_allow == false
          ) {
            this.showDeleteBtn = false;
          }
          if (
            userRights[i].section_name == "Convert Estimation" &&
            userRights[i].is_allow == true
          ) {
            this.showConvertBtn = true;
          } else if (
            userRights[i].section_name == "Convert Estimation" &&
            userRights[i].is_allow == false
          ) {
            this.showConvertBtn = false;
          }
          // console.log('userRights', userRights[i].section_name)
        } else {
          // this.showList=true
          // this.showAddBtn=true
          // this.showEditBtn=true
          // this.showDeleteBtn=true
          // this.showConvertBtn=true
        }
      }
    } else {
      // console.log('else')
      this.showList = true;
      this.showAddBtn = true;
      this.showEditBtn = true;
      this.showDeleteBtn = true;
      this.showConvertBtn = true;
    }

    // this.emailForm.get('emails').valueChanges.subscribe(() => {
    //   let newChange = this.emailForm.get('emails').value;
    //   // console.log('CHANGE 1--->',newChange);
    // });
  }

  async initializeIntfutServices() {
    try {
      await this.fetchBuildingTypes();
      await this.GetProjectTypeByOrgID();
      // await this.FindAutoProjectPrefixByOrgID();
      // await this.GetPriorityByOrgID();
      // await this.GetLastAddedCostPrefixByOrgID();
      await this.getTimesheetByEmpId();
      await this.fetchDesignType();
      // this.findCostHrs();
    } catch (error) {
      console.error("Error during initialization:", error);
    } finally {
    }
  }

  // New Apis Integration and Functionalites //

  addTypes() {
    const newItemFormGroup = this.formBuilder.group({
      areaName: ["", [Validators.required]],
      type: ["", [Validators.required]],
      qty: ["", [Validators.required]],
      isChanged: false,
    });

    const itemsFormArray = this.myForm.get("items") as FormArray;
    // console.log(newItemFormGroup, "newItemFormGroup!!!")
    // console.log(itemsFormArray.controls, "itemsFormArray")
    itemsFormArray.push(newItemFormGroup);
  }

  addNewIteminput(): void {
    // console.log("Am here",);
  }

  removeItem(i: number): void {
    // Get the FormArray and remove the item at the specified index
    const itemsFormArray = this.myForm.get("items") as FormArray;
    itemsFormArray.removeAt(i);
  }

  get item(): FormArray {
    return this.newItemFormGroup.get("items") as FormArray;
  }

  // addCamTpeListFormInputs(){
  //   return this.formBuilder.group({
  //     areaName: ['', [Validators.required]],
  //     type: ['', [Validators.required]],
  //     qty: ['', [Validators.required]],
  //   });
  // }

  // addcamTypes() {
  //   let newMem = this.addCamTpeListFormInputs();

  //   this.camTypes.push(newMem);
  //   // console.log("this.camTypes--->",this.camTypes);
  // }

  // deleteCamTypes(i: number) {
  //   this.camTypes.removeAt(i);
  // }
  // End of Camera type Implementation

  // NVR type Implementation
  get nvrTypes(): FormArray {
    return this.addNVRFormGroup.get("nvrTypes") as FormArray;
  }

  addnvrTypesListFormInputs() {
    return this.formBuilder.group({
      areaName: ["", [Validators.required]],
      nvrtype: ["", [Validators.required]],
      qty: ["", [Validators.required]],
    });
  }
  initializeInventorySelectorForm() {
    this.inventorySelector = this.formBuilder.group({
      selectedRow: [null],
    });
  }
  addnvrTypes() {
    let newMem = this.addnvrTypesListFormInputs();
    this.nvrTypes.push(newMem);
  }

  deletenvrTypes(i: number) {
    this.nvrTypes.removeAt(i);
  }
  // End of NVR type Implementation

  //Start of NVR Without POE implementation

  get nvrwithoutTypes(): FormArray {
    return this.addNVRwithoutPOEFormGroup.get("nvrwithoutTypes") as FormArray;
  }

  addnvrwithoutpoeTypesListFormInputs() {
    return this.formBuilder.group({
      areaName: ["", [Validators.required]],
      nvrwithouttype: ["", [Validators.required]],
      qty: ["", [Validators.required]],
    });
  }

  addnvrwithoutTypes() {
    let newMem = this.addnvrwithoutpoeTypesListFormInputs();
    this.nvrwithoutTypes.push(newMem);
  }

  deletenvrwithoutTypes(i: number) {
    this.nvrwithoutTypes.removeAt(i);
  }

  // //End of NVR Without POE implementation

  async fetchBuildingTypes() {
    try {
      const data: any = await this.projectService
        .GetAllBuildingTypesOrgID()
        .toPromise();

      if (data) {
        // Map the data to add 'text' field
        this.buildingTypeData = data.map((itm: any) => ({
          ...itm,
          text: itm.typeName,
        }));
      } else {
        this.buildingTypeData = [];
      }
    } catch (error) {
      console.error("Error fetching building types:", error);
      this.buildingTypeData = [];
    }
  }
  getFlatTypesByLabel(label, is_typical) {
    // // console.log("label--->",label);
    // // console.log("is_typical--->",is_typical['controls'].is_typical.value);

    if (is_typical["controls"].is_typical.value) {
      var returnData = this.newTblData.filter((it: any) =>
        it.Label.includes(label)
      )[0];

      if (returnData.flatType != null) {
        returnData.flatType.map((el) => {
          el["name"] = this.flatTypesData.filter(
            (ti: any) => ti.id === el.flatVal
          )[0].text;
        });
      }

      return returnData.flatType;
    } else {
      var returnData = this.newTblData.filter(
        (it: any) => it.Label === label
      )[0];
      // // console.log(returnData)
      if (returnData.flatType != null) {
        returnData.flatType.map((el) => {
          el["name"] = this.flatTypesData.filter(
            (ti: any) => ti.id === el.flatVal
          )[0].text;
        });
      }

      return returnData.flatType;
    }
  }

  // async getIntFutServices() {
  //   let serviceArr = [];
  //   try {
  //     const data: any = await this.settingService
  //       .GetServiceMainCategorybyOrgId()
  //       .toPromise();

  //     if (data) {
  //       for (const itm of data) {
  //         const mileData: any = await this.settingService
  //           .GetServicePrimaryCategoryByMain(itm.id)
  //           .toPromise();
  //         let serviceMilestones = [];

  //         for (const mil of mileData) {
  //           let milestoneData: any = {
  //             id: mil.id,
  //             org_id: mil.org_id,
  //             milestone_name: mil.primaryCategoryName,
  //             sequence: mil.sequence ? mil.sequence : null,
  //             created_date: mil.createdDate,
  //             createdby: mil.createdBy,
  //           };

  //           const taskData: any = await this.settingService
  //             .GetServiceSubCategoryByMain(mil.id)
  //             .toPromise();
  //           if (taskData.length > 0 && taskData[0].subCategoryName.length > 0) {
  //             milestoneData["staticTask"] = taskData;
  //           }

  //           serviceMilestones.push(milestoneData);
  //         }

  //         let sortedMilestone = serviceMilestones.sort(
  //           (a, b) => parseInt(a.sequence) - parseInt(b.sequence)
  //         );
  //         let serviceObj = {
  //           id: itm.id,
  //           serviceName: itm.serviceCategoryName,
  //           primaryCategory: sortedMilestone,
  //         };
  //         serviceArr.push(serviceObj);
  //       }

  //       data.forEach((itm: any) => {
  //         itm["text"] = itm.serviceCategoryName;
  //       });

  //       this.serviceNames = data;
  //       console.log(data,'serviceNames');
  //       this.allservicesArr = serviceArr;
  //       console.log(this.allservicesArr, "CHECK ARR");
  //     } else {
  //       this.serviceNames = [];
  //     }
  //   } catch (error) {
  //     console.error("Error fetching services:", error);
  //     this.serviceNames = [];
  //   }

  // }
  async getIntfutServiceNames() {
    let serviceNames = [];
    try {
      const data: any = await this.settingService
        .GetServiceMainCategorybyOrgId()
        .toPromise();
      if (data && data.length > 0) {
        data.forEach((itm: any) => {
          itm["text"] = itm.serviceCategoryName;
        });
        this.serviceNames = data;
        // console.log(data, "serviceNames");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getIntFutServices() {
    try {
      this.allServicesUnfiltered = [];
      let flatData: any = await this.intfutService
        .GetIntfutServicesByOrgId()
        .toPromise();
      this.allServicesUnfiltered = flatData;
      // console.log(flatData, "FLAT DATA");
      console.log(this.allServicesUnfiltered, "allServicesUnfiltered");
      this.allservicesArr = [];
      if (flatData.length > 0) {
        const result = flatData.reduce((acc, row) => {
          let mainCategory = acc.find((item) => item.id === row.mainCategoryId);
          if (!mainCategory) {
            mainCategory = {
              id: row.mainCategoryId,
              serviceName: row.mainCategoryName,
              primaryCategory: [],
            };
            acc.push(mainCategory);
          }

          let primaryCategory = mainCategory.primaryCategory.find(
            (item) => item.id === row.primaryCategoryId
          );
          if (!primaryCategory) {
            primaryCategory = {
              id: row.primaryCategoryId,
              milestone_name: row.primaryCategoryName,
              sequence: "0",
              staticTask: [],
            };
            mainCategory.primaryCategory.push(primaryCategory);
          }

          primaryCategory.staticTask.push({
            id: row.subCategoryId,
            subCategoryName: row.subCategoryName,
            subCategoryDescription: row.subCategoryName,
            primaryCategoryId: row.primaryCategoryId,
            created_date: null,
            createdby: null,
            is_deleted: false,
          });

          return acc;
        }, []);
        this.allservicesArr = result;
      }
    } catch (error) {
      this.allservicesArr = [];
      console.error("Error fetching or processing data", error);
    } finally {
    }
  }

  updateDropDownVals(mil) {
    console.log(mil, "FUNCTION IS CALLED ON EVERY CLICK");
    this.myForm.reset();
    const tempStackVal = this.tempUnitStack
      .filter((i) => i.id == mil)
      .map((i) => i.value);
    let tskList = this.myForm.get("items") as FormArray;
    tskList.clear();
    if (tempStackVal.length > 0) {
      // this.myForm.patchValue(tempStackVal)
      tempStackVal[0].map((i) => {
        tskList.push(
          this.formBuilder.group({
            areaName: i.areaName,
            type: i.type,
            qty: i.qty,
          })
        );
      });
    } else {
      // console.log("THERE IS NO DATA TO BE PATCHED!")
    }

    this.addTypesArr = [];
    this.addAreasArr = [];
    let areaData = this.newTblData[0];
    console.log(areaData, "CHECKING DATA", this.newTblData);
    let chilItms = this.colDataArr.filter((le) => le.text === mil)[0];

    chilItms.childItems.map((elm) => {
      let tempObj = {
        id: elm.subCategoryName,
        value: elm.subCategoryName,
      };
      this.addTypesArr.push(tempObj);
    });
    let flatVals = [];

    this.newTblData.forEach((item) => {
      item.flatType.forEach((ft) => {
        flatVals.push(ft.flatVal);
      });
    });
    let uniqueFlatVals = Object.keys(
      flatVals.reduce((acc, val) => {
        acc[val] = true;
        return acc;
      }, {})
    );
    uniqueFlatVals.forEach((unit) => {
      let value = this.flatTypesData
        .filter((i) => i.id == unit)
        .map((i: any) => i.name)[0];
      this.addAreasArr.push({
        id: value,
        value: value,
      });
    });
    console.log(this.addAreasArr, "addAreasArr*********");
  }

  //manipulated form value and grouping them
  manipulateFormValue(formValue, categoryName) {
    console.log(formValue, "CHECKING FORM VALUE");
    const result = {};

    formValue.forEach((item) => {
      const type = item.type.toUpperCase();
      const qty = parseInt(item.qty);

      if (type in result) {
        result[type] += qty;
      } else {
        result[type] = qty;
      }
    });

    const outputObject = {
      categoryName: categoryName,
      value: Object.keys(result).map((type) => ({
        type: type,
        qty: result[type],
      })),
    };
    return outputObject;
  }

  //New Save Form
  saveTypeForm(categoryName) {
    // console.log(categoryName, "SAVE!")
    this.typetextDesc = true;
    // let formValue = this.myForm.getRawValue();
    const itemsFormArray = this.myForm.get("items") as FormArray;
    let formValue = itemsFormArray.value;
    formValue.forEach((obj) => {
      obj.primaryCat = categoryName;
    });
    console.log(formValue, "FORM VALUE");
    // console.log(this.updatedUnitStack, "updatedUnitStack")

    if (this.updatedUnitStack.length > 0 && formValue.length > 0) {
      this.updatedUnitStack.forEach((b) => {
        const c = formValue.find(
          (a) => a.areaName == b.areaName && a.type == b.type
        );
        if (c) {
          c.isChanged = true;
        }
      });
    }
    let modifiedCheck = formValue.some((item) => item.isChanged);
    // console.log(formValue, "FORM VALUE AFTER")
    if (modifiedCheck) {
      Swal.fire({
        title:
          "Saving this data will result in modifications to the BOQ sheet ?",
        text: "Please Note you won't be able to revert this",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: " Save",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.value === true) {
          this.saveFormData(formValue, categoryName);
        }
      });
    } else {
      this.saveFormData(formValue, categoryName);
    }
  }
  saveFormData(formValue, categoryName) {
    let reducedFormdata = this.manipulateFormValue(formValue, categoryName);
    console.log(reducedFormdata, "TESTING reducedFormdata");
    const typeDescIndex = this.summaryDataArr.findIndex(
      (i) => i.categoryName === categoryName
    );
    // console.log(this.summaryDataArr[typeDescIndex], typeDescIndex, "TEST!!!!!!")
    if (typeDescIndex !== -1) {
      this.summaryDataArr[typeDescIndex].value = reducedFormdata.value;
    } else {
      this.summaryDataArr.push(reducedFormdata);
    }

    //Temperory stack table
    let tempStackIndex = this.tempUnitStack.findIndex(
      (i) => i.id == categoryName
    );
    if (tempStackIndex !== -1) {
      this.tempUnitStack.splice(tempStackIndex, 1);
    }
    this.tempUnitStack.push({
      id: categoryName,
      value: formValue,
    });

    const subCatIndex = this.colDataArr.findIndex(
      (fe) => fe.text === categoryName
    );
    const subCat = this.colDataArr[subCatIndex];
    console.log(subCat, "SUBCAT CHECK");
    formValue.forEach((el) => {
      if (subCatIndex !== -1) {
        const childItemIndex = subCat.childItems.findIndex(
          (x) => x.subCategoryName === el.type
        );

        if (childItemIndex !== -1) {
          if (!subCat.childItems[childItemIndex].unitArr) {
            subCat.childItems[childItemIndex].unitArr = [];
          }
          const existingElIndex = subCat.childItems[
            childItemIndex
          ].unitArr.findIndex((x) => x.areaName === el.areaName);

          if (existingElIndex !== -1) {
            subCat.childItems[childItemIndex].unitArr[existingElIndex].qty =
              el.qty;
          } else {
            subCat.childItems[childItemIndex].unitArr.push(el);
            // console.log("Am good", subCat.childItems[childItemIndex].subCategoryName);
            let filtertable = this.newTblData.map((fe) =>
              fe.fltDescription.map((ft) => ft)
            );
            let result = filtertable.map((fe) => fe.map((fs) => fs));
            console.log(result, "CHECK");
          }
        }
      }
    });

    this.newTblData.map((flr) => {
      // console.log("FLR data", flr);

      flr.fltDescription.map((fldesc: any) => {
        formValue.map((el: any) => {
          console.log(fldesc.itemName, "TEST HERE!!!");
          console.log(el, "TEST HERE!!!");
          if (fldesc.itemName.split("-")[0] === el.areaName) {
            if (!fldesc["newArr"]) {
              fldesc["newArr"] = [];
            }
            fldesc["newArr"].push({ ...el, itemName: fldesc.itemName });
            fldesc["type"] = el.type;
            fldesc["qty"] = el.qty;
            fldesc["typeName"] = el.areaName.split("-")[0];
            fldesc["primaryCat"] = categoryName;
          }
        });
      });

      this.mapFltDescriptionsToCategories(
        this.newTblData,
        this.colDataArr,
        categoryName
      );
      // console.log("Reult ", this.colDataArr);
    });

    this.toastr.success(`${categoryName} has been saved succesfully!`);
  }

  mapFltDescriptionsToCategories(newtableData, newArr, categoryName) {
    // console.log(newtableData, newArr, categoryName,"TEST")
    // console.log(newArr,"Testing New Array on Begin")
    for (const floor of newtableData) {
      for (const mainFltDescriptionItem of floor.fltDescription) {
        // console.log(mainFltDescriptionItem, "CHECK!!!")
        if (
          mainFltDescriptionItem.newArr &&
          mainFltDescriptionItem.newArr.length > 0
        ) {
          // console.log(mainFltDescriptionItem,"mainFltDescriptionItem")
          for (const fltDescriptionItem of mainFltDescriptionItem.newArr) {
            if (
              fltDescriptionItem.type &&
              mainFltDescriptionItem.primaryCat == categoryName
            ) {
              const category = newArr.find(
                (item) => item.text === categoryName
              );
              if (category) {
                // console.log(fltDescriptionItem, category, "CHECK TEST")
                // console.log(category.text,categoryName,"CHECK NAME")
                const subCategory = category.childItems.find(
                  (subCategoryItem) =>
                    subCategoryItem.subCategoryName ===
                      fltDescriptionItem.type &&
                    fltDescriptionItem.primaryCat == categoryName
                );
                if (subCategory) {
                  if (!subCategory.detailsArr) {
                    subCategory.detailsArr = [];
                  }
                  // console.log(newArr,"Testing New Array on detailsArray Creation")

                  const labeledItem = {
                    ...fltDescriptionItem,
                    label: floor.Label,
                    isChanged: false,
                    primaryCategory: subCategory.primaryCategoryId,
                    subCategory: subCategory.id,
                  };

                  const existingItem = subCategory.detailsArr.find(
                    (item) =>
                      item.itemName === labeledItem.itemName &&
                      item.type === labeledItem.type &&
                      item.areaName === labeledItem.areaName &&
                      item.label === labeledItem.label
                  );
                  console.log(existingItem, "existingItem Check");
                  if (existingItem) {
                    existingItem.qty = labeledItem.qty;
                  } else {
                    subCategory.detailsArr.push(labeledItem);
                  }
                  console.log(this.colDataArr, "CHECK COL DATA");
                }
              }
            }
          }
        }
      }
    }
  }

  arraysAreEqual(arr1, arr2) {
    console.log(arr1, arr2, "CHECK ARRAYS");

    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      const {
        isChanged: isChanged1,
        primaryCat: primaryCat1,
        ...rest1
      } = arr1[i];
      const { isChanged: isChanged2, ...rest2 } = arr2[i];

      if (
        !Object.entries(rest1).every(([key, value]) => value === rest2[key])
      ) {
        return false;
      }
    }

    return true;
  }

  onPanelClosed(categoryName) {
    let formValue = this.myForm.getRawValue();
    console.log(formValue, "ON CLOSE FORM VALUE");
    let tempStackIndex = this.tempUnitStack.findIndex(
      (i) => i.id == categoryName
    );
    //Comparing existing tempStack data with current form value to recognize if changes are made
    if (formValue.items.length > 0) {
      if (tempStackIndex !== -1) {
        let isEqual = this.arraysAreEqual(
          this.tempUnitStack[tempStackIndex].value,
          formValue.items
        );
        console.log(isEqual, "checking isEqual");
        if (!isEqual) {
          this.closeAccordion = true;
          // console.log("Do you want to save the Data???")
          $("#save_changes_modal").modal("show");
          this.saveDialogBox(categoryName);
        } else {
          // this.saveTypeForm(categoryName)
        }
      } else {
        this.saveDialogBox(categoryName);
      }
    } else {
      // this.saveDialogBox(categoryName)
    }
  }
  saveDialogBox(categoryName) {
    Swal.fire({
      title: "Do you want to save this data ?",
      text: "Please Note you won't be able to revert this",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Save",
      cancelButtonText: "Cancel",
    }).then((result) => {
      this.closeAccordion = false;
      if (result.value === true) {
        this.saveTypeForm(categoryName);
      }
    });
  }

  updateTextInputCell(e, colData, arrData, floorName, itemname, areaIndex) {
    // console.log(e, 'e')
    // console.log("ColData", colData);
    // console.log("arrData", arrData);
    // console.log("floorName", floorName);
    // console.log("areaIndex", areaIndex);
    // console.log(this.tempUnitStack, "TEMP UNIT STACK")
    //changing isChanged
    // let currentStack = this.tempUnitStack.filter(i => i.id == arrData.text)[0].value
    // currentStack.filter(i => i.type == colData.subCategoryName && i.areaName == itemname.split('-')[0])
    const itemsFormArray = this.myForm.get("items") as FormArray;
    const targetItem = itemsFormArray.value.find(
      (i) =>
        i.type === colData.subCategoryName &&
        i.areaName === itemname.split("-")[0]
    );
    this.updatedUnitStack.push({
      areaName: itemname.split("-")[0],
      type: colData.subCategoryName,
    });
    if (targetItem) {
      targetItem.isChanged = true;
    }
    let exactLocation = this.newTblData.filter(
      (el: any) => el.Label == floorName
    )[0];
    exactLocation.fltDescription[areaIndex][colData.subCategoryName] =
      e.target.value;
    // console.log(exactLocation, 'exactLocation!')

    let newexLocation = this.selTblData.filter(
      (el: any) => el.Label == floorName
    )[0];
    newexLocation.fltDescription[areaIndex][colData.subCategoryName] =
      e.target.value;
    // console.log(newexLocation, 'newexLocation!')
    const sample = {
      itemName: itemname,
      type: colData.subCategoryName,
      qty: e.target.value,
      primaryCategory: colData.primaryCategoryId,
      subCategory: colData.id,
      typeName: itemname.split("-")[0],
      label: floorName,
      isChanged: true,
      primaryCat: arrData.text,
      areaName: itemname.split("-")[0],
    };
    if (!colData.detailsArr) {
      colData.detailsArr = [];
      colData.detailsArr.push(sample);
      // console.log("Am outside loop");
    } else {
      const matchCondition = (fe) =>
        fe.itemName == itemname &&
        fe.label == floorName &&
        fe.type == colData.subCategoryName;

      const isMatchFound = colData.detailsArr.some((fe) => matchCondition(fe));
      console.log("isMatchFound", isMatchFound);
      if (isMatchFound) {
        colData.detailsArr.forEach((fe) => {
          if (matchCondition(fe)) {
            fe.qty = e.target.value;
            fe.isChanged = true;
            // console.log("Target: Updated qty for existing item", fe);
          }
        });
      } else {
        // console.log("New Sample: Adding a new item", sample);
        colData.detailsArr.push(sample);
        console.log("colData.detailsArr", colData.detailsArr);
      }
    }
  }

  updateCustomNumberCell(e, arrData, floorName, itemname, areaIndex) {
    // console.log(e, 'e')
    // console.log("arrData", arrData);
    // console.log("floorName", floorName);
    // console.log('itemname',itemname);
    // console.log("areaIndex", areaIndex);
    const itemsFormArray = this.myForm.get("items") as FormArray;
    console.log(itemsFormArray, "itemsFormArray");
    let exactLocation = this.newTblData.filter(
      (el: any) => el.Label == floorName
    )[0];
    if (exactLocation && exactLocation.fltDescription.length > 0) {
      exactLocation.fltDescription[areaIndex]["customNumber"] = e.target.value;
      exactLocation.fltDescription[areaIndex]["isChanged"] = true;
    }
    console.log(exactLocation, "exactLocation");
    console.log(this.newTblData, "this.newTblData");
  }
  getCustomNumber(floorName, itemname, areaIndex) {
    const floorData = this.newTblData.find((el: any) => el.Label === floorName);
    if (floorData) {
      const customNumber = floorData.fltDescription[areaIndex].customNumber
        ? floorData.fltDescription[areaIndex].customNumber
        : "";
      return customNumber;
    } else {
      return "";
    }
  }

  openExcelGenPopup(categoryType) {
    // console.log("Open the Same Excel File with limited Columns", categoryType);
    //this.colDataArr
    // console.log(this.colDataArr, "CHECKING COL DATA ARR")
    // console.log("categoryType--->", categoryType);
    this.catgeryOnlyColumnArr = this.customColumnArr.filter(
      (em) =>
        em.text == "Custom Number" ||
        em.text == "Floor" ||
        em.text == "    Area / Flat Name    " ||
        em.text == categoryType
    );
    this.catgeryOnlycolDataArr = this.colDataArr.filter(
      (em) =>
        em.text == "Custom Number" ||
        em.text == "Floor" ||
        em.text == "    Area / Flat Name    " ||
        em.text == categoryType
    );

    // console.log("Data1 us here", this.catgeryOnlyColumnArr);
    // console.log("Data2 us here", this.catgeryOnlycolDataArr);
    // console.log("Data3 us here", this.selTblData);
    // console.log('NEW TABLE ADATA', this.newTblData)

    this.openGenExcelModal();
  }

  commonFields: Object = { text: "value", value: "id" };
  commonServiceFields: Object = { text: "value", value: "value" };
  commonBuildingFields: Object = { text: "text", value: "id" };
  templateFields: Object = { id: "id", value: "value" };

  //   if (elm.childItems !== undefined ) {
  //     const result = elm.childItems
  //       .map(elm => elm.unitArr.find(r => r.areaName === it.itemName.split('-')[0]))
  //       .filter(unit => unit !== undefined)
  //       .map(unit => unit.qty);
  //     this.cdr.reattach();
  //     if(result!='' && result!=null && result.length>0){
  //       return result;
  //     }
  //     else{
  //       return 0;
  //     }

  //   } else {
  //     this.cdr.reattach();
  //     return 0;
  //   }
  // }
  getComputedValue(elm, it, labal) {
    return elm.detailsArr.length > 0
      ? (
          elm.detailsArr.find(
            (i) => i.itemName === it.itemName && i.label === labal.trim()
          ) || { qty: 0 }
        ).qty
      : 0;
  }

  // getComputedValue(elm, it, labal) {
  //   return elm.detailsArr.length > 0
  //     ? (elm.detailsArr.find(i => i.itemName === it.itemName || i.unit_name && i.label || i.floor === labal) || { qty: 0 }).qty
  //     : 0;
  // }
  getVal(elm, it, labal) {
    if (elm && elm.detailsArr && elm.detailsArr.length > 0) {
      let element = elm.detailsArr.find(
        (i) => i && i.itemName === it.itemName && i.label === labal
      );

      if (
        element &&
        element.isChanged !== undefined &&
        element.isChanged === true
      ) {
        return element.isChanged === true;
      } else {
        return false;
      }
    } else {
      return false;
    }

    return false;
  }

  handleInvItemtype(e, ind) {
    console.log(e, ind, "INV CHANGE TRIGGERED!!!");
    this.initializeInventorySelectorForm();
    if (e) {
      // console.log(this.isSummaryFullScreen, "HERE!")
      this.showSummaryTable = false;
      // this.spinner.show();
      this.isLoading = true;
      this.showLoader = true;
      this.selectedInventoryType = e;
      this.invselectedRowIndex = null;
      this.supselectedRowIndex = null;
      this.isFullInventory = false;
      let currentData = this.summaryFormArray.getRawValue();
      // console.log(currentData.taskList[ind], ind, "CHECKING")

      const commonOperations = () => {
        console.log("commonOperations!!!");
        this.GetEstimationServiceByOrgId();
        this.getInventoryUnitData();
        this.checkUserRights();
        this.getVendorData();
        const data = currentData.taskList[this.summaryDataIndex];
        console.log(data, "CHECK!!!");
        if (data.MainCat != null && data.MainCat !== "") {
          // this.serviceID = data.mainCategoryId;
          this.getInventoryTags();
          this.addInventoryTypeForm.patchValue({
            mainCategory: data.mainCategoryId,
            subCategory: data.primaryCategoryId,
            subCategory2: data.subcategoryId,
          });
        }
      };

      if (e === "New" || e === "Provisional") {
        console.log("HERE!");
        commonOperations();
        // showInventoryModalWithDelay(null);
        // this.showSupplierRatesTable = true;
        this.supplierRatesArr = [];
      } else if (e === "Existing") {
        console.log("Existing");
        console.log("Check Ind!", ind, ind !== "", ind !== null);
        if (ind !== null && ind !== "" && ind != undefined) {
          console.log("HERE!", ind);
          this.summaryDataIndex = ind;
          this.openCustomModal();
        }

        const data = currentData.taskList[this.summaryDataIndex];
        this.inventoryData = [];
        this.supplierRatesArr = [];
        if (data.MainCat != null && data.MainCat !== "") {
          const postData = {
            org_id: localStorage.getItem("org_id"),
            main_category: data.mainCategoryId,
            primary_category: data.primaryCategoryId,
            secondary_category: data.subcategoryId,
          };

          this.inventoryService
            .GetInventoryByCategory(postData)
            .subscribe((invData: any) => {
              if (invData && invData.length > 0) {
                // // console.log(invData, "INV DATA**********")
                this.inventoryData = invData;
                let existingIndex = null;
                if (data.inventory_id != null && data.inventory_id != "") {
                  existingIndex = this.inventoryData.findIndex(
                    (i) => i.id == data.inventory_id
                  );
                  // this.invselectedRowIndex = existingIndex;
                  // // console.log("HERE @3", this.invselectedRowIndex, existingIndex)
                }
                if (existingIndex != null && existingIndex !== "") {
                  if (existingIndex == 0) {
                    this.invselectedRowIndex = existingIndex;
                  } else {
                    this.invselectedRowIndex = 0;
                    this.invselectedRowIndex = existingIndex;
                  }
                }

                // showInventoryModalWithDelay(existingIndex)
              }
            });
        }
      } else {
        console.log("Please select a valid Inventory Type");
      }
      setTimeout(() => {
        // this.spinner.hide();
        this.isLoading = false;
      }, 1000);
    }
  }

  selectinventoryItemName(e, type) {
    let value = e.value;
    let item = type;
    this.inventoryNameStore[item] = value;
  }
  saveForm() {
    const formData = this.summaryFormArray.value;
    const summaryDataArray = this.summaryFormArray.get("taskList") as FormArray;

    // console.log(formData, "FORM VALUES")
  }
  // patchValuesToForm() {
  //   // this.taskList.clear()
  //   if (this.newSummaryTbl.length > 0) {
  //     this.newSummaryTbl.forEach(item => {
  //       const taskFormGroup = this.addTaskListFrmInput();
  //       taskFormGroup.patchValue(item);
  //       this.taskList.push(taskFormGroup);
  //     });
  //   }
  // }
  patchValuesToForm() {
    console.log("CLICKED!!!", this.newSummaryTbl);
    // Clear existing items with the same MainCat
    const newMainCatValues = this.newSummaryTbl.map((item) => item.MainCat);
    // this.removeExistingItemsWithSameMainCat(newMainCatValues);
    this.SummaryMatTabVals = this.SummaryMatTabVals.filter(
      (i) => i.mainCategoryId != this.SerCatId
    );
    // Add new items to the form array
    if (this.newSummaryTbl.length > 0) {
      this.newSummaryTbl.forEach((item, index) => {
        // const taskFormGroup = this.addTaskListFrmInput();
        // taskFormGroup.patchValue(item);

        // // console.log(taskFormGroup, "taskFormGroup!!!!")
        // this.taskList.push(taskFormGroup);
        this.SummaryMatTabVals.push(item);
        this.showTextAreaStack[index] = false;
      });
    }
  }

  removeExistingItemsWithSameMainCat(newMainCatValues: string[]) {
    const taskListArray = this.taskList.controls as FormGroup[];

    for (let i = taskListArray.length - 1; i >= 0; i--) {
      const existingMainCat =
        taskListArray[i] && taskListArray[i].get("MainCat")
          ? (taskListArray[i].get("MainCat")!.value as string)
          : "";
      if (!existingMainCat || newMainCatValues.includes(existingMainCat)) {
        // Remove the existing item with the same MainCat
        this.taskList.removeAt(i);
      }
    }
  }

  addInventoryFormInputs() {
    this.addInventoryTypeForm = this.formBuilder.group({
      inventory_id: [""],
      item_Code: [""], // Required validator
      model_No: ["", Validators.required],
      itemName: ["", Validators.required],
      itemDesc: ["", Validators.maxLength(200)], // Maximum length validator
      origin: ["", Validators.required],
      mainCategory: [""],
      subCategory: [""],
      subCategory2: [""],
      brand: [""],
      features: [""],
      newFeature: [""],
      status: [""],
      unit: [""],
      quantity: [""], // Required and positive integer pattern validator
    });
    this.addSupplierForm = this.formBuilder.group({
      supplierTaskList: this.formBuilder.array([], [Validators.required]),
    });
  }

  addSupplierTaskListFrmInput() {
    return this.formBuilder.group({
      SupplierName: ["", [Validators.required]],
      SupplierRate: [""],
      SupplierCurrency: [""],
      CurrencyConversionRate: [""],
      SupplierQuantity: [""],
    });
  }
  get supplierTaskList(): FormArray {
    return this.addSupplierForm.get("supplierTaskList") as FormArray;
  }
  addNewTask() {
    let newMem = this.addSupplierTaskListFrmInput();
    this.supplierTaskList.push(newMem);
  }

  getInventoryUnitData() {
    this.inventoryService.GetInventoryUnitByOrgId().subscribe((data: any) => {
      if (data && data.length > 0) {
        data.map((i) => {
          this.InventoryUnitType.push({
            id: i.id,
            value: i.unit,
          });
        });
      }
    });
  }
  handleInventoryTag(e) {
    this.filteredTags = [];
    this.filteredTags = this.inventoryTags.filter(
      (i) => i.system_category == e
    );
    // console.log(this.inventoryTags, this.filteredTags, "CHECKIN TAGS")
  }

  GetEstimationServiceByOrgId() {
    this.serviceMainCategory = [];
    this.settingService
      .GetServiceMainCategorybyOrgId()
      .subscribe((data: any) => {
        data.map((i) => {
          this.serviceMainCategory.push({
            id: i.id,
            value: i.serviceCategoryName,
          });
          // let service = { id: i.id, value: i.serviceCategoryName };
          // this.GetSecondaryServiceByServiceId(service);
        });
        // console.log(this.serviceMainCategory, "SERVICE MAIN CATEGORY");
      });
  }
  async GetSecondaryServiceByServiceId(service) {
    this.servicePrimaryCategory = [];

    try {
      const data: any = await this.settingService
        .GetServicePrimaryCategoryByMain(service.id)
        .toPromise();

      if (data) {
        for (const i of data) {
          this.servicePrimaryCategory.push({
            id: i.id,
            value: i.primaryCategoryName,
          });

          // You can uncomment and modify the following lines if you need to handle secondary categories.
          // const secondaryServiceId = i.id;
          // const subData: any = await this.settingsService.GetServiceSubCategoryByMain(secondaryServiceId).toPromise();
          // this.serviceCatList.push({
          //   id: i.id,
          //   name: i.primaryCategoryName,
          //   value: subData,
          //   service: service.value,
          //   serviceId: service.id,
          // });
        }
      }
    } catch (error) {
      console.error("Error fetching service categories:", error);
    }
  }

  GetVendorCategoryTypesByOrgId() {
    this.settingsService
      .GetVendorCategoryTypesByOrgId()
      .subscribe((data: any) => {
        let result = [];
        data.map((elm, i) => {
          result.push({
            id: elm.id,
            value: elm.name,
          });

          if (data.length === i + 1) {
            this.vendorCategoryDropDown = result;
          }
        });
      });
  }

  showAddnewFeature() {
    this.addNewFeature = true;
  }
  closeAddNewFeature() {
    this.addNewFeature = false;
  }
  addNewFeatureToList() {
    this.addNewFeature = false;
    let newVal = this.addInventoryTypeForm.get("newFeature").value;
    let service = this.addInventoryTypeForm.get("mainCategory").value;
    if (newVal) {
      let postData = {
        org_id: this.organizationID,
        tag: newVal,
        created_by: this.user["full_name"],
        system_category: service,
      };
      this.inventoryService.AddInventoryTag(postData).subscribe((data: any) => {
        if (data.status === "200") {
          this.getInventoryTags();

          this.toast.success("New Inventory Tag Added");
        } else {
          this.toast.error("Something went wrong");
        }
      });
    }
    // console.log(this.commonTags, "COMMON TAGS CHECK");
    // this.cdr.detectChanges()
    this.addInventoryTypeForm.get("newFeature").patchValue("");
  }
  handleStatusChange(event) {
    let status = event.itemData;
    status.value && status.value != null && status.value == "Discontinued"
      ? (this.isItemDisabled = true)
      : (this.isItemDisabled = false);
  }
  getInventoryTags() {
    this.inventoryService.GetInventoryTagByOrgId().subscribe((data: any) => {
      if (data) {
        this.inventoryTags = [];
        if (this.SerCatId) {
          let filteredTags = data.filter(
            (i) => i.system_category == this.SerCatId
          );
          filteredTags.map((i: any) => {
            this.inventoryTags.push({
              id: i.id,
              value: i.tag,
              system_category: i.system_category,
            });
          });
        } else {
          data.map((i: any) => {
            this.inventoryTags.push({
              id: i.id,
              value: i.tag,
              system_category: i.system_category,
            });
          });
        }
        // console.log(this.inventoryTags, "CHECKING INVENTORY TAGS")
      }
    });
  }
  //Saving an Inventory item
  saveInventoryType() {
    let inventoryFormVal = this.addInventoryTypeForm.value;
    // console.log(inventoryFormVal, "CHECK inventoryFormVal on save")
    // console.log(this.supplierRatesArr, "CHECKING SUPPLIER")
    let reqObj = {};
    reqObj["org_id"] = this.organizationID;
    reqObj["item_code"] = this.generateUniqueItemCode(inventoryFormVal.origin);
    reqObj["model_no"] = inventoryFormVal.model_No;
    reqObj["item_name"] = inventoryFormVal.itemName;
    reqObj["item_desc"] = inventoryFormVal.itemDesc;
    reqObj["origin"] = inventoryFormVal.origin;
    reqObj["brand"] = inventoryFormVal.brand;
    reqObj["supp_name"] = inventoryFormVal.suppName;
    reqObj["supp_rate"] = inventoryFormVal.suppRate;
    reqObj["currency"] = inventoryFormVal.currency;
    reqObj["status"] = inventoryFormVal.status;
    reqObj["unit"] = inventoryFormVal.unit;
    reqObj["main_category"] = inventoryFormVal.mainCategory;
    reqObj["sub_category"] = inventoryFormVal.subCategory;
    reqObj["sub_category2"] = inventoryFormVal.subCategory2;
    reqObj["supplier_data"] = this.supplierRatesArr;
    reqObj["features"] = inventoryFormVal.features;
    reqObj["created_by"] = this.user["full_name"];
    reqObj["quantity"] = inventoryFormVal.quantity;
    reqObj["approver1_roleId"] = this.approver1_roleId;
    reqObj["approver2_roleId"] = this.dualApproval
      ? this.approver2_roleId
      : null;
    reqObj["approver1_notes"] = "";
    reqObj["approver2_notes"] = "";
    reqObj["is_approved_empId1"] = false;
    reqObj["is_approved_empId2"] = false;

    this.inventoryService.AddInventoryItem(reqObj).subscribe((data: any) => {
      if (data.status === "200") {
        // console.log(data, "ADDED DATA")
        let postData = { ID: data.desc };
        this.inventoryService
          .GetInventoryByItemId(postData)
          .subscribe((data: any) => {
            const formData = this.summaryFormArray.get("taskList") as FormArray;
            if (formData && formData.length > 0) {
              formData.at(this.summaryDataIndex).patchValue({
                itemCode: data[0].item_desc,
                inventoryItemName: data[0].item_name,
                itemDescription: data[0].item_desc,
                inventory_id: data[0].inventory_id,
              });
            }
            // console.log(formData, "CHECKING FORM DATA")
          });

        this.supplierRatesArr = [];
        this.addSupplierForm.reset();
        this.addInventoryTypeForm.reset();

        this.toast.success("New Inventory Item Added");
      } else {
        this.toast.error("Something went wrong");
      }
      // console.log(this.summaryFormArray.value, "CHECKING SUMMARY FORM DATA")
    });
  }
  generateUniqueItemCode(prefix) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8); // Using a random string

    const uniqueCode = `${prefix}-${timestamp}-${randomString}`;
    return uniqueCode;
  }
  saveProvisionalInventoryType() {
    let inventoryFormVal = this.addInventoryTypeForm.value;
    const formData = this.summaryFormArray.get("taskList") as FormArray;

    // console.log(inventoryFormVal, "PROVISONAL DATA")
    if (formData && formData.length > 0) {
      formData.at(this.summaryDataIndex).patchValue({
        itemCode: this.generateUniqueItemCode(inventoryFormVal.origin),
        inventoryItemName: inventoryFormVal.itemName,
        itemDescription: inventoryFormVal.itemDesc,
      });
      this.toast.success("Provisional item added successfully");
    }
    this.supplierRatesArr = [];
    this.addSupplierForm.reset();
    this.addInventoryTypeForm.reset();
    // console.log(formData, "CHECKING FORM DATA")
  }
  getInventoryModuleApprover() {
    let userDataLocal = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      roleID: userDataLocal.role_id,
      moduleID: this.currentModuleID,
    };
    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe((data: any) => {
      data.map((elm) => {
        if (elm.section_name == this.currentSection) {
          if (elm.approver1_roleId !== null) {
            this.approver1_roleId = elm.approver1_roleId;
            this.approver1_role_name = elm.approver1_role_name;
          }
          if (elm.approver2_roleId !== null) {
            this.approver2_roleId = elm.approver2_roleId;
            this.approver2_role_name = elm.approver2_role_name;
            this.dualApproval = true;
          } else if (elm.is_full_access) {
            this.selfApproverAssigned = true;
            this.approver1_roleId = elm.role_id;
          } else {
            this.approverAssigned = false;
          }
        }
      });
    });
  }
  checkUserRights() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let postData = { id: user_info.role_id };

    this.userService.GetAccessRightsbyRole(postData).subscribe((data: any) => {
      data.map((item) => {
        item.module_name = item.module_name.replace(/\s+/g, "");
        return item;
      });
      this.commonModuleName = _.groupBy(data, "module_name");
      this.currentModuleID = this.commonModuleName.Inventory[0].id;
      this.getInventoryModuleApprover();
      // console.log(this.commonModuleName, this.currentModuleID, "MODULES")
      //settings
      if (this.commonModuleName.Inventory) {
        this.accessToPage = true;
      } else {
        this.accessToPage = false;
      }
    });
  }
  //Supplier form
  addSupplier() {
    this.showSupplierRatesTable = false;
    this.addInventory = false;
    if (this.supplierTaskList.length == 0) {
      this.addNewTask();
    }
  }
  saveSupplierRates() {
    let supplierRates = this.addSupplierForm.value;
    // console.log(supplierRates, "SUPPLIER RATES")
    if (supplierRates.supplierTaskList) {
      supplierRates.supplierTaskList.map((data) => {
        let suppName = this.vendorArr
          .filter((i) => i.id == data.SupplierName)
          .map((i) => i.value);
        let conversionRate = this.handleSupplierRates(data);
        let alreadyExists = this.supplierRatesArr.filter(
          (i) => i.supplier_id == data.SupplierName
        );
        if (alreadyExists.length > 0) {
          this.supplierRatesArr
            .filter((i) => i.supplier_id == data.SupplierName)
            .map(
              (i) => (
                (i.supplier_rate = data.SupplierRate),
                (i.currency = data.SupplierCurrency),
                (i.conversionRate = conversionRate),
                (i.quantity = data.SupplierQuantity)
              )
            );
        } else {
          this.supplierRatesArr.push({
            supplier_name: suppName[0],
            supplier_rate: data.SupplierRate,
            supplier_id: data.SupplierName,
            currency: data.SupplierCurrency,
            quantity: data.SupplierQuantity,
            conversionRate: conversionRate,
            created_date: Date.now(),
          });
        }
        this.sum = supplierRates.supplierTaskList.reduce(
          (accumulator, currentValue) => {
            return accumulator + parseInt(currentValue.SupplierQuantity);
          },
          0
        );
      });
      // console.log(this.sum, "sum of quantites");
      this.addInventoryTypeForm.get("quantity").patchValue(this.sum);
      // console.log(supplierRates, "SUPPLIER RATES")
      // console.log(this.supplierRatesArr, "this.supplierRatesArr")
    }
    this.showSupplierRatesTable = true;
  }
  getVendorData() {
    this.vendorArr = [];
    this.settingsService.GetCommissionVendors().subscribe((data: any) => {
      data.map((item) => {
        this.vendorArr.push({
          id: item.id,
          value: item.name,
        });
      });
    });
  }
  handleSupplierRates(supplierRates) {
    let supplierRate = supplierRates.SupplierRate;
    let currency = supplierRates.SupplierCurrency;
    let convertedRate;
    switch (currency) {
      case "USD":
        convertedRate = (supplierRate * 3.67).toFixed(2);
        break;
      case "INR":
        convertedRate = (supplierRate * 0.044).toFixed(2);
        break;
      case "RIYAL":
        convertedRate = (supplierRate * 0.98).toFixed(2);
        break;
      case "DINAR":
        convertedRate = (supplierRate * 11.88).toFixed(2);
        break;
      default:
        convertedRate = "Invalid currency code";
        break;
    }
    // console.log(convertedRate, "CONVERTED RATE")
    return convertedRate;
  }
  backToinventory() {
    // this.showSupplierRatesTable = true;
    this.addInventory = true;
  }
  closeModal(event) {
    $("#inventory_modal").modal("hide");
    // event.stopPropagation();
    this.invselectedRowIndex = null;
    this.supselectedRowIndex = null;
    this.spinner.hide();
    // this.spinner.show()
    // setTimeout(() => {
    //   this.spinner.hide()
    //   this.showSummaryTable = true;
    // }, 1000)
  }
  closeSecondModal(event: Event) {
    event.stopPropagation(); // Prevent the click event from propagating to the parent modal
    // Code to close the second modal
  }
  onExistingSelected(e) {
    console.log(e, "EVENT SELECTED");
    this.supplierRatesArr = [];
    this.selectedInvData = [];
    this.showSupplierRatesTable = false;
    let data = e.data;
    let id = data.inventory_id ? data.inventory_id : data.id;
    // The entire data of the selected row
    this.invselectedRowIndex = e.rowIndex;
    this.inventorySelector.get("selectedRow").setValue(id);
    console.log(this.inventorySelector.get("selectedRow").value, "CHECK");
    if (data && data != null) {
      if (e.isInteracted) {
        this.toast.success(`${data.item_name} selected successfully`);
      }
      const formData = this.summaryFormArray.get("taskList") as FormArray;
      // console.log(formData, "formData")
      if (data.id || data.inventory_id) {
        let postData = {
          ID: data.id ? data.id : data.inventory_id,
        };
        let defaultPrice = 0;
        let defaultSupplierName = "";
        let defaultSupplierId = "";
        let defaultCurrency = "";

        this.inventoryService
          .GetInventoryVendorData(postData)
          .subscribe((vendorData: any) => {
            if (vendorData && vendorData.length > 0) {
              let defaultVendors = vendorData.filter(
                (i) => i.is_default == true
              );
              // console.log(defaultVendors, "CHECKING VENDOR!")
              if (defaultVendors.length > 0) {
                defaultPrice = defaultVendors[0].supplier_rate;
                defaultSupplierName = defaultVendors[0].supplier_name;
                defaultSupplierId = defaultVendors[0].supplier_id;
                defaultCurrency = defaultVendors[0].currency;
              }
              // console.log(defaultPrice, "CHECKING PRICE CHECK!")
              vendorData.map((i) => {
                this.supplierRatesArr.push({
                  supplier_name: i.supplier_name,
                  supplier_rate: i.supplier_rate,
                  supplier_id: i.supplier_id,
                  currency: i.currency,
                  quantity: i.quantity,
                  conversionRate: i.conversionRate,
                  created_date: i.created_date,
                  is_default: i.is_default,
                });
              });
              let existingVendor = formData.controls.find(
                (i, index) => index == this.summaryDataIndex
              );
              if (
                existingVendor.value &&
                existingVendor.value.supplierId &&
                !e.isInteracted
              ) {
                let existingVendorIndex = vendorData.findIndex(
                  (i) => i.supplier_id == existingVendor.value.supplierId
                );
                if (existingVendorIndex != null && existingVendorIndex !== "") {
                  this.supselectedRowIndex = existingVendorIndex;
                }
              } else {
                let defaultVendorIndex = vendorData.findIndex(
                  (i) => i.is_default == true
                );
                this.supselectedRowIndex = defaultVendorIndex;
              }
              // console.log(existingVendor, "existingVendor")
              this.showSupplierRatesTable = true;
              // console.log(this.supplierRatesArr, "SUPPLIER RATES")
            }
            this.selectedInvData.push({
              itemCode: data.item_code,
              inventoryItemName: data.item_name,
              itemDescription: data.item_desc,
              inventory_id: data.id,
              unitPrice: defaultPrice,
              supplierName: defaultSupplierName,
              supplierId: defaultSupplierId,
              currency: defaultCurrency,
            });
            // if (formData && formData.length > 0) {
            //   formData.at(this.summaryDataIndex).patchValue({
            //     itemCode: data.item_code,
            //     inventoryItemName: data.item_name,
            //     itemDescription: data.item_desc,
            //     inventory_id: data.id,
            //     unitPrice: defaultPrice,
            //     supplierName: defaultSupplierName,
            //     supplierId: defaultSupplierId,
            //     currency: defaultCurrency
            //   });
            //   // this.updateTotalPrice()
            //   this.updateSummaryItemTotalPrice(this.summaryDataIndex)

            // }
            // console.log(data, defaultPrice, "DEFAULT PRICE CHECK")
          });
      }
    }
    // this.closeModal()
  }
  onExistingVendorSelected(e) {
    // console.log(e, this.selectedInvData, "this.selectedInvData BEGIN")
    const formData = this.summaryFormArray.get("taskList") as FormArray;
    if (formData && formData.length > 0) {
      if (e.isInteracted) {
        this.toast.success(`${e.data.supplier_name} selected successfully`);
      }
      this.selectedInvData = [
        ...this.selectedInvData.map((item) => {
          return {
            ...item,
            unitPrice: e.data.supplier_rate,
            supplierName: e.data.supplier_name,
            supplierId: e.data.supplier_id,
          };
        }),
      ];
      // formData.at(this.summaryDataIndex).patchValue({
      //   unitPrice: e.data.supplier_rate,
      //   supplierName: e.data.supplier_name,
      //   supplierId: e.data.supplier_id
      // })
      // console.log(this.selectedInvData, "Updated END")
    }
  }

  updateTotalPrice() {
    const formArray = this.summaryFormArray.get("taskList") as FormArray;

    formArray.controls.forEach((control: FormGroup) => {
      const qty = control.get("qty").value;
      const unitPrice = control.get("unitPrice").value;
      const totalPrice = Math.floor(qty * unitPrice);
      // console.log(totalPrice, "totalprice")
      control.get("totalPrice").setValue(totalPrice);
    });
  }

  updateSummaryItemTotalPrice(i) {
    const formArray = this.summaryFormArray.get("taskList") as FormArray;
    const qty = parseInt(formArray.at(i).get("qty").value, 10) || 0;
    const bufferQty = parseInt(formArray.at(i).get("bufferQty").value, 10) || 0;
    const unitPrice = parseInt(formArray.at(i).get("unitPrice").value, 10) || 0;
    const totalPrice = Math.floor((qty + bufferQty) * unitPrice);

    formArray.at(i).patchValue({ totalPrice: totalPrice });
    this.updateSummaryItemFinalPrice(i);
  }

  updateSummaryItemFinalPrice(i) {
    const formArray = this.summaryFormArray.get("taskList") as FormArray;
    const totalPriceControl = formArray.at(i).get("totalPrice");
    const discountControl = formArray.at(i).get("discount");
    const discountTypeControl = formArray.at(i).get("discountType");

    if (!totalPriceControl || !discountControl || !discountTypeControl) {
      this.toast.error("Missing form controls!");
      return;
    }

    let totalPrice = parseFloat(totalPriceControl.value);
    let discount = discountControl.value
      ? discountControl.value.replace("-", "")
      : "0";
    const discountType = discountTypeControl.value;

    if (isNaN(totalPrice) || totalPrice <= 0) {
      this.toast.error("Invalid total price!");
      return;
    }

    discount = parseFloat(discount);

    if (isNaN(discount) || discount < 0) {
      this.toast.error("Invalid discount value!");
      return;
    }

    let finalPrice = 0;

    if (discountType === "percentage") {
      if (discount < 0 || discount > 100) {
        this.toast.error("Invalid discount percentage!");
        return;
      }
      let discountedPrice = (discount / 100) * totalPrice;
      finalPrice = totalPrice - discountedPrice;
    } else {
      finalPrice = totalPrice - discount;
    }

    discount = "-" + discount;
    formArray.at(i).patchValue({ discount: discount });
    formArray.at(i).patchValue({ finalPrice: finalPrice });
  }
  handleServiceCategory(e, id) {
    //  let data= this.allservicesArr.filter(i=>i.id==id);
    //  console.log(this.allservicesArr,"ALLSERVICESARR")
    //  console.log(data,"CHECK")
    //  if(data.length>0){

    //  }

    console.log(
      this.servicePrimaryCategory,
      this.serviceCatList,
      "this.servicePrimaryCategoryList"
    );
  }

  handleSubCategory(e) {
    this.serviceSecondaryCategory = [];
    if (e.value != null) {
      this.showSubCategory2 = true;
      let serviceId = e.value;
      this.settingsService
        .GetServiceSubCategoryByMain(serviceId)
        .subscribe((data: any) => {
          if (data) {
            data.map((i) => {
              this.serviceSecondaryCategory.push({
                id: i.id,
                value: i.subCategoryName,
              });
            });
          }
        });
    }
  }

  async handleSummaryEditData(e, id) {
    this.selectedEditService = e.trim();
    this.selectedEditServiceId = id;
    // this.handleServiceCategory(e, id);
    await this.GetSecondaryServiceByServiceId({ id: id });
    console.log(e, id, this.servicePrimaryCategory, "CHECK");
    // const formArray = this.summaryFormArray.get("taskList") as FormArray;
    let filteredData = this.SummaryMatTabVals.filter((i) => i.MainCat == e);
    this.summaryFormArray.reset();
    this.taskList.clear();
    filteredData.forEach((item, index) => {
      const taskFormGroup = this.addTaskListFrmInput();
      taskFormGroup.patchValue(item);
      console.log(taskFormGroup, "taskFormGroup");
      this.taskList.push(taskFormGroup);
    });
    console.log(
      filteredData,
      this.summaryFormArray.getRawValue(),
      "***********"
    );
    

    this.handleSummaryFullScreen();
  }
  addNewSummaryItem() {
    const taskFormGroup = this.addTaskListFrmInput();
    taskFormGroup.patchValue({
      MainCat: this.selectedEditService,
      mainCategoryId: this.selectedEditServiceId,
      newValue: true,
      customAdded: true,
    });

    this.taskList.controls.forEach((element) => {
      if (element.get("newValue").value) {
        let sub_category = element.get("type").value;

        let selectedItem = this.allServicesUnfiltered.find(
          (el) => el.subCategoryId === sub_category
        );
        let MainType = selectedItem.primaryCategoryName;
        let type = selectedItem.subCategoryName;
        let primaryCategoryId = selectedItem.primaryCategoryId;
        let subcategoryId = selectedItem.subcategoryId;
        element.patchValue({
          newValue: false,
          MainType: MainType,
          type: type,
          primaryCategoryId: primaryCategoryId,
          subcategoryId: subcategoryId,
        });
      }
      console.log(element, "PACXTH ELEMENET");
    });
    this.taskList.push(taskFormGroup);
    this.newSummaryTbl.push(this.addTaskListFrmInput());
  }

  get filteredTaskListGetter(): FormGroup[] {
    // Remove () after filteredTaskListGetter
    console.log("CALLED getfilteredTaskList ");
    return (this.summaryFormArray.get("taskList") as FormArray).controls
      .filter((task) => task.get("MainCat").value === this.selectedEditService)
      .map((task) => task as FormGroup);
  }

  handleSummaryData(e) {
    console.log(e.tab, "CHECK");
    this.matTabSpinner = true;
    let tabVal = e.tab.textLabel;
    this.selectedServiceTab = tabVal.toString();
    this.selectedServiceTabIndex = this.tabData.findIndex(
      (tab) => tab.text === tabVal
    );
    // this.SummaryMatTabVals = this.taskList.controls
    //   .filter(task => task.get('MainCat').value === tabVal.toString() || tabVal.toString() === 'All')
    //   .map(task => task.value);
    console.log(this.SummaryMatTabVals, "CHECKING!!!");
    // console.log(this.selectedServiceTabIndex, "selectedServiceTabIndex")
    setTimeout(() => {
      this.matTabSpinner = false;
      // console.log(this.matTabSpinner, "matTabSpinner INSIDE!")
    }, 1000);
    // console.log(this.matTabSpinner, "matTabSpinner!")
  }

  selectionChanged(e) {
    // console.log(e, "SELEC")
  }

  openCustomModal() {
    // document.getElementById("customModal").style.display = "block";
    this.showInvCustomModal = true;
    // this.modalService.open(this.InvSelectionModal, { size: "lg" });
  }

  closeCustomModal() {
    // document.getElementById("customModal").style.display = "none";
    this.showInvCustomModal = false;
    // this.modalService.dismissAll();
    this.invselectedRowIndex = null;
    this.supselectedRowIndex = null;
  }
  enlargeImage(url) {
    // console.log(url, "URL")
    if (url) {
      Swal.fire({
        imageUrl: url,
        imageAlt: "Enlarged Image",
        showConfirmButton: false,
        customClass: {
          // popup: 'enlarged-popup',
          closeButton: "enlarged-close-button",
        },
        showCloseButton: true,
      });
    }
  }

  handleSummaryFullScreen() {
    this.spinner.show();
    this.isSummaryFullScreen = true;
    this.showIntfutSummaryTable = false;
    console.log(this.SummaryMatTabVals, "SummaryMatTabVals!");

    console.log(this.summaryAccordion, "this.summaryAccordion");
    if (this.summaryAccordion) {
      this.summaryAccordion.closeAll();
    }

    setTimeout((el) => {
      this.spinner.hide();
      $("#fullScreenModal").modal("show");
      // this.tabObjFullScreen.selectedIndex = this.selectedServiceTabIndex
    }, 1000);
  }
  closeFullScreenModal() {
    // console.log("CLOSE MODAL CLICKED")
    this.isSummaryFullScreen = false;
    this.showIntfutSummaryTable = true;
  }
  onInventorySelectionChange(data) {
    this.inventoryData.map((item) => {
      if (item.id == data.id) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    });
    // console.log(this.inventoryData, "inventoryData!!!")
  }
  OnInventoryItemSave() {
    console.log("CLICKED", this.selectedInvData[0]);
    this.spinner.show();
    if (this.selectedInvData.length > 0) {
      let data = this.selectedInvData[0];
      if (data) {
        const formData = this.summaryFormArray.get("taskList") as FormArray;
        if (formData && formData.length > 0) {
          formData.at(this.summaryDataIndex).patchValue({
            itemCode: data.itemCode,
            inventoryItemName: data.inventoryItemName,
            itemDescription: data.itemDescription,
            inventory_id: data.inventory_id,
            unitPrice: data.unitPrice,
            supplierName: data.supplierName,
            supplierId: data.supplierId,
            currency: data.currency,
            inventoryType: this.selectedInventoryType,
          });
          this.isSummaryFullScreen
            ? this.closeCustomModal()
            : $("#inventory_modal").modal("hide");
          setTimeout(() => {
            this.spinner.hide();
            this.toast.success(
              `${data.inventoryItemName} ${
                data.supplierName !== "" ? "and " + data.supplierName : ""
              } selected successfully`
            );
            console.log(
              this.summaryFormArray.get("taskList") as FormArray,
              "CHECKING DATA ON SAVE N PATCH"
            );
          }, 500);

          this.updateTotalPrice();
          this.updateSummaryItemTotalPrice(this.summaryDataIndex);
        } else {
          this.toast.error("Something went Wrong!");
        }
      }
    }
  }
  toggleTextArea(index) {
    this.showTextAreaStack[index] = !this.showTextAreaStack[index];
  }
  onSummaryTabOpened(tab) {
    this.SummaryMatAccordianVals = this.taskList.controls
      .filter(
        (task) =>
          task.get("MainCat").value === tab.toString() ||
          tab.toString() === "All"
      )
      .map((task) => task.value);
  }
  handleFullInventoryListing() {
    this.inventoryData = [];
    this.supplierRatesArr = [];
    this.selectedInvData = [];
    this.showSupplierRatesTable = false;
    this.isFullInventory = true;
    // this.spinner.show();
    this.isLoading = true;
    let postData = { orgID: this.organizationID };
    this.inventoryService
      .GetInventoryByOrgId(postData)
      .subscribe((data: any) => {
        console.log(data, "CHECKING STATUS!!!");

        if (data.length > 0) {
          this.inventoryData = data;
        }
      });
    setTimeout(() => {
      // this.spinner.hide();
      this.isLoading = false;
      console.log(this.inventoryData, "CHECK DATA");
    }, 1500);
  }
  async handleTemplateSelection() {
    try {
      this.spinner.show();
      await this.GetServiceEstimationTemplates();
      this.extraTemplateUnitForm = this.formBuilder.group({
        extras: this.formBuilder.array([]),
      });

      this.templateFormInputs();

      setTimeout(() => {
        this.spinner.hide();
        $("#templateSelectionModal").modal("show");
      }, 1000);
    } catch (error) {
      this.spinner.hide();
      console.error("Error opening modal:", error);
    }
  }

  async GetServiceEstimationTemplates() {
    try {
      // Assuming GetServiceEstimationTemplateByOrgId returns an Observable
      this.templateListingData$ =
        this.intfutService.GetServiceEstimationTemplateByOrgId();

      const listings = await this.templateListingData$.toPromise();

      if (listings && listings.length > 0) {
        // Handle the listings data here
      } else {
        console.log("No data found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  serviceSearchKeyUp(): void {
    document
      .getElementById(this.serviceGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.serviceGrid.search((event.target as HTMLInputElement).value);
      });
  }

  isNewChecked = false;
  handleApplyEstTemplate(data) {
    console.log(data);
    if (data) {
      let isServiceExists = this.appliedTemplates.some(
        (i) => i.mainCategoryId === data.mainCategoryId
      );
      if (isServiceExists) {
        let title = "Saving this template would remove the existing templates?";
        this.handleSwalFire(title, this.applyEstTemplate(data), null, "Apply");
        this.isNewChecked = true;
      } else {
        this.applyEstTemplate(data);
        this.isNewChecked = true;
      }
    }
  }

  applyEstTemplate(data) {
    if (data.id) {
      this.spinner.show();
      try {
        this.appliedTemplates = this.appliedTemplates.filter(
          (i) => i.id !== data.id
        );
        this.appliedTemplates.push({
          mainCategoryId: data.mainCategoryId,
          mainCategory: data.mainCategory,
          id: data.id,
          name: data.name,
        });
        let templateData = JSON.parse(data.templateData);
        let estimationData = this.summaryFormArray.getRawValue();
        const formData = this.summaryFormArray.get("taskList") as FormArray;
        console.log(templateData, estimationData, formData, "*******");
        let selectedEstimationData = this.SummaryMatTabVals.filter(
          (i) => i.mainCategoryId == data.mainCategoryId
        );
        templateData.forEach((primary) => {
          let primaryCategory = primary.id;
          primary.value.forEach((sec) => {
            let secondaryCategory = sec.secondaryCategoryName;
            selectedEstimationData.forEach((selected) => {
              console.log(
                selected.MainType == primaryCategory &&
                  selected.type == secondaryCategory,
                "CHECK"
              );
              if (
                selected.MainType == primaryCategory &&
                selected.type == secondaryCategory
              ) {
                let index = this.SummaryMatTabVals.indexOf(selected);
                console.log(index, "IND CHECK");
                if (index !== -1) {
                  this.SummaryMatTabVals[index].inventoryItemName =
                    sec.inventory_name;
                  this.SummaryMatTabVals[index].inventoryType =
                    sec.inventory_type;
                  // Add other properties as needed
                }
              }
            });
          });
        });
        this.calcUnit();
        this.toast.success(`${data.name} applied successfully`);
        console.log(templateData, "PARSED");
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
    }
  }

  isTemplateApplied(id) {
    return this.appliedTemplates.some((i) => i.id === id);
  }
  isTemplateAppliedForCurrentService(text) {
    return this.appliedTemplates.some((i) => i.mainCategory === text);
  }

  handleRemoveAppliedService(data) {
    let title = "Are you sure you want to remove this template?";
    this.handleSwalFire(
      title,
      () => this.removeAppliedTemplate(data),
      null,
      "Remove"
    );
  }
  // removeAppliedService(data) {
  //   if (data.id) {
  //     // this.appliedTemplates = this.appliedTemplates.filter((i) => i.id !== data.id)
  //     this.removeAppliedTemplate
  //     this.toast.success(`${data.name} removed successfully`)
  //   }

  // }
  removeAppliedTemplate(data) {
    if (data.id) {
      this.spinner.show();
      try {
        this.appliedTemplates = this.appliedTemplates.filter(
          (i) => i.id !== data.id
        );
        let estimationData = this.summaryFormArray.getRawValue();
        const formData = this.summaryFormArray.get("taskList") as FormArray;
        let templateData = JSON.parse(data.templateData);
        console.log(data.mainCategoryId, "data.mainCategoryId");
        let selectedEstimationData = this.SummaryMatTabVals.filter(
          (i) => i.mainCategoryId == data.mainCategoryId
        );
        templateData.forEach((primary) => {
          let primaryCategory = primary.id;
          primary.value.forEach((sec) => {
            let secondaryCategory = sec.secondaryCategoryName;
            selectedEstimationData.forEach((selected) => {
              console.log(
                selected.MainType == primaryCategory &&
                  selected.type == secondaryCategory,
                "CHECK"
              );
              if (
                selected.MainType == primaryCategory &&
                selected.type == secondaryCategory
              ) {
                let index = this.SummaryMatTabVals.indexOf(selected);
                console.log(index, "IND CHECK");
                if (index !== -1) {
                  this.SummaryMatTabVals[index].inventoryItemName = "";
                  this.SummaryMatTabVals[index].inventoryType = "";
                  // Add other properties as needed
                }
              }
            });
          });
        });
        this.calcUnit();
        this.toast.success(`${data.name} removed successfully`);
        this.isNewChecked = true;
      } catch (error) {
        console.error(error);
        this.isNewChecked = false;
      } finally {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
    }
  }

  handleSwalFire(title, confirmCallBack, rejectCallBack, confirmButtonText) {
    console.log(typeof confirmCallBack, "confirmCallBack");
    Swal.fire({
      title: title,
      text: "Please Note you won't be able to revert this",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: confirmButtonText,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        confirmCallBack();
        // this.appliedTemplates = this.appliedTemplates.filter((i) => i.id !== data.id)
        // this.applyEstTemplate(data);
      }
    });
  }

  // Template Func
  addServiceTemplate() {
    this.spinner.show();
    this.templateListing = false;
    this.templateRuleListing = false;
    this.templateForm.reset();
    this.extraTemplateUnitForm.reset();
    this.addInventoryTypeForm.reset();
    this.addSupplierForm.reset();
    this.templateUnitStack = [];
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
  goBackToTemplate() {
    this.templateListing = true;
    this.templateRuleListing = false;
  }
  viewTemplateRules(data) {
    let templateData = JSON.parse(data.templateData);
    // this.templateRuleList=templateData;
    this.templateRuleList = [];
    let ruleList = templateData.reduce((acc, item) => {
      if (item.value.length > 0) {
        item.value.forEach((val) => {
          acc.push(...val.related_items);
        });
      }
      return acc;
    }, []);
    if (ruleList.length > 0) {
      ruleList.forEach((element) => {
        console.log(element, "element****");
        console.log(this.allServicesUnfiltered, "this.allservicesArr****");
        let slave_elm = this.allServicesUnfiltered.find(
          (i) => i.subCategoryId == element.related_item_id
        );
        let master_elm = this.allServicesUnfiltered.find(
          (i) =>
            i.subCategoryName == element.masterSecondaryCat &&
            i.primaryCategoryName == element.masterPrimaryCat
        );
        console.log(master_elm, slave_elm, "****");
        element.related_item_name = slave_elm.subCategoryName;
        element.primary_item_id = slave_elm.primaryCategoryId;
        element["primary_item_name"] = slave_elm.primaryCategoryName;
        element["masterSecondaryCatId"] = master_elm.subCategoryId;
        element["masterPrimaryCatId"] = master_elm.primaryCategoryId;
        this.templateRuleList.push(element);
      });
    }
    this.templateRuleListing = true;
    // console.log(templateData,"TEST")
    // console.log(data,"TEST")
    console.log(this.templateRuleList, "templateRuleList");
  }
  applyTemplateRule(data) {
    console.log(data, "applyTemplateRule");
  
    let slave_elm = data.related_item_id;
    let master_elm = data.masterSecondaryCatId;
    const formArray = this.summaryFormArray.get("taskList") as FormArray;
  
    let requiredMasterData = this.SummaryMatTabVals.find(
      (i) => i.subcategoryId == master_elm
    );
    let requiredSlaveData = this.SummaryMatTabVals.find(
      (i) => i.subcategoryId == slave_elm
    );
  
    console.log(
      requiredSlaveData,
      requiredMasterData,
      "requiredSlaveData/requiredMasterData"
    );
  
    if (requiredMasterData) {
      let masterQty = requiredMasterData.qty;
      let rule = data.rule;
      let slaveQty = this.ruleCalculation(rule, masterQty);
  
      if (slaveQty == null || slaveQty < 0) {
        this.toast.error(`Invalid quantity calculated for ${data.related_item_name}`);
        return;  
      }
  
      if (requiredSlaveData) {

        requiredSlaveData.qty += slaveQty;
        requiredMasterData.isModifiedQty = true;
        this.toast.success(`${data.related_item_name} updated successfully`);
      } else {

        this.SummaryMatTabVals.push({
          MainCat: requiredMasterData.MainCat,
          MainType: data.primary_item_name,
          type: data.related_item_name,
          mainCategoryId: requiredMasterData.mainCategoryId,
          primaryCategoryId: data.primary_item_id,
          subcategoryId: slave_elm,
          qty: slaveQty,
        });
        this.toast.success(`${data.related_item_name} added successfully`);
      }
  
      console.log(masterQty, slaveQty, "masterQty,slaveQty");
    }
  }
  
  ruleCalculation(rule, M) {
    try {
      const calculate = new Function("M", `return ${rule};`);
      let result = calculate(M);
      return Math.round(result);
    } catch (error) {
      console.error("Error evaluating rule:", error);
      return null;
    }
  }

  async editTemplate(data) {
    this.spinner.show();
    this.editEnable = true;
    console.log(data, "data");
    this.addServiceTemplate();
    this.templateUnitStack = [];
    this.editTemplateData = [];
    if (data && data.id != "" && data.id != null) {
      this.editTemplateId = data.id;
      this.editTemplateData.push({
        mainCategory: data.mainCategory,
        mainCategoryId: data.mainCategoryId,
        templateData: data.templateData,
        name: data.name,
        id: data.id,
      });
      this.selectedMainCategory = data.mainCategoryId;
      await this.fetchPrimaryCategory();
      this.templateForm.patchValue({
        name: data.name,
        mainCategory: data.mainCategory,
        description: data.description,
      });
      this.templateUnitStack = JSON.parse(data.templateData);
    } else {
      console.log("Nothing went wrong!");
    }
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    console.log(data, this.templateUnitStack, "templateUnitStack EDIT DATA");
  }
  async updateTemplateDropDownVals(value, id) {
    console.log(value, id, "CHECK");
    await this.handleSecondaryCategory(id);
    this.selectedPrimaryCategory = id;
    // this.AddExtraTemplateUnitDesc()
    const emails = this.extraTemplateUnitForm.get("extras") as FormArray;
    // emails.insert(0, this.createTemplateFormGroup());
    this.extraTemplateUnitForm.reset();
    const tempStackVal = this.templateUnitStack
      .filter((i) => i.id == value)
      .map((i) => i.value);
    emails.clear();
    if (tempStackVal.length > 0) {
      // this.myForm.patchValue(tempStackVal)
      tempStackVal[0].map((i) => {
        emails.push(
          this.formBuilder.group({
            secondaryCategoryName: i.secondaryCategoryName,
            inventory_type: i.inventory_type,
            inventory_name: i.inventory_name,
            inventory_brand: i.inventory_brand,
            inventory_id: i.inventory_id,
          })
        );
      });
      console.log(
        this.extraTemplateUnitForm.getRawValue(),
        "extraTemplateUnitForm!!!"
      );
    } else {
      emails.insert(0, this.createTemplateFormGroup());
      // console.log("THERE IS NO DATA TO BE PATCHED!")
    }
  }
  public AddExtraTemplateUnitDesc(index) {
    const emails = this.extraTemplateUnitForm.get("extras") as FormArray;
    emails.insert(index + 1, this.createTemplateFormGroup());
  }
  SaveForm() {
    const emails = this.extraTemplateUnitForm.get("extras") as FormArray;
    console.log(emails, "TEST!");
  }
  removeTemplateItem(i: number): void {
    // Get the FormArray and remove the item at the specified index
    const itemsFormArray = this.extraTemplateUnitForm.get(
      "extras"
    ) as FormArray;
    itemsFormArray.removeAt(i);
  }
  async handlePrimaryCategory(isInteracted): Promise<void> {
    // this.showSubCategory2 = false;
    // this.showSubCategory1 = true;

    console.log("CALLED", isInteracted, this.templateUnitStack);
    if (this.templateUnitStack.length > 0 && isInteracted) {
      console.log("INSIDE");
      const result = await Swal.fire({
        title: "Changing service will clear the existing data ?",
        text: "Please Note you won't be able to revert this",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: " Save",
        cancelButtonText: "Cancel",
      });

      if (result.value === true) {
        await this.fetchPrimaryCategory();
      } else {
        this.templateForm.patchValue({
          mainCategory: this.editTemplateData[0].mainCategory,
        });
      }
    } else {
      await this.fetchPrimaryCategory();
    }
  }

  private async fetchPrimaryCategory(): Promise<void> {
    this.spinner.show();
    return new Promise<void>(async (resolve, reject) => {
      this.servicePrimaryCategory = [];
      this.serviceSecondaryCategory = [];
      this.templateUnitStack = [];
      this.extraUnitForm.reset();

      try {
        const data: any = await this.settingService
          .GetServicePrimaryCategoryByMain(this.selectedMainCategory)
          .toPromise();

        if (data) {
          data.map((i: any) => {
            this.servicePrimaryCategory.push({
              id: i.id,
              value: i.primaryCategoryName,
            });
          });
        }

        console.log(this.servicePrimaryCategory);
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        this.spinner.hide();
      }
    });
  }
  handleSecondaryCategory(e): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.serviceSecondaryCategory = [];
      if (e != null) {
        this.settingService.GetServiceSubCategoryByMain(e).subscribe(
          (data: any) => {
            if (data) {
              data.map((i) => {
                this.serviceSecondaryCategory.push({
                  id: i.id,
                  value: i.subCategoryName,
                });
              });
            }
            console.log(
              this.serviceSecondaryCategory,
              "this.serviceSecondaryCategory"
            );
            resolve(); 
          },
          (error) => {
            reject(error); 
          }
        );
      } else {
        resolve(); 
      }
    });
  }
  ApplyEditTemplate() {
    if (this.editTemplateId) {
      this.spinner.show();
      try {
        this.appliedTemplates = this.appliedTemplates.filter(
          (i) => i.id !== this.editTemplateId
        );
        console.log(this.editTemplateData, "editTemplateData");
        if (this.editTemplateData.length > 0) {
          this.appliedTemplates.push({
            mainCategoryId: this.editTemplateData[0].mainCategoryId,
            mainCategory: this.editTemplateData[0].mainCategory,
            id: this.editTemplateData[0].id,
            name: this.editTemplateData[0].name,
          });
          console.log(
            this.templateUnitStack,
            JSON.parse(this.editTemplateData[0].templateData),
            "CHECK!!!"
          );
        }

        let estimationData = this.summaryFormArray.getRawValue();
        const formData = this.summaryFormArray.get("taskList") as FormArray;
        console.log(
          this.templateUnitStack,
          estimationData,
          formData,
          "*******"
        );
        let selectedEstimationData = this.SummaryMatTabVals.filter(
          (i) => i.mainCategoryId == this.editTemplateData[0].mainCategoryId
        );
        this.templateUnitStack.forEach((primary) => {
          let primaryCategory = primary.id;
          primary.value.forEach((sec) => {
            let secondaryCategory = sec.secondaryCategoryName;
            selectedEstimationData.forEach((selected) => {
              console.log(
                selected.MainType == primaryCategory &&
                  selected.type == secondaryCategory,
                "CHECK"
              );
              if (
                selected.MainType == primaryCategory &&
                selected.type == secondaryCategory
              ) {
                let index = this.SummaryMatTabVals.indexOf(selected);
                console.log(index, "IND CHECK");
                if (index !== -1) {
                  this.SummaryMatTabVals[index].inventoryItemName =
                    sec.inventory_name;
                  this.SummaryMatTabVals[index].inventoryType =
                    sec.inventory_type;
                  // Add other properties as needed
                }
              }
            });
          });
        });
        this.calcUnit();
        this.toast.success(
          `${this.editTemplateData[0].name} applied successfully`
        );
        // console.log(templateData, "PARSED");
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
    }
  }
  //New Save Form
  saveTemplateTypeForm(categoryName) {
    const itemsFormArray = this.extraTemplateUnitForm.get(
      "extras"
    ) as FormArray;
    console.log(itemsFormArray);
    let formValue = itemsFormArray.value;
    let ifValuesExist = this.areValuesEmpty(formValue);
    if (ifValuesExist) {
      this.saveTemplateFormData(formValue, categoryName);
    } else {
      this.toast.warning(
        "Kindly ensure all required fields are filled before saving."
      );
    }
  }
  areValuesEmpty(data) {
    for (const item of data) {
      for (const value of Object.values(item)) {
        if (value !== "") {
          return true;
        }
      }
    }
    return false;
  }

  saveTemplateFormData(formValue, categoryName) {
    // console.log(formValue, "TESTING RAW FORM VALUE 1")

    //Temperory stack table
    let tempStackIndex = this.templateUnitStack.findIndex(
      (i) => i.id == categoryName
    );
    if (tempStackIndex !== -1) {
      this.templateUnitStack.splice(tempStackIndex, 1);
    }
    this.templateUnitStack.push({
      id: categoryName,
      value: formValue,
    });

    console.log(this.templateUnitStack, "TEMP STACK");

    this.toast.success(`${categoryName} has been saved succesfully!`);
  }
  closeAddServiceTemplate() {
    // this.spinner.show()
    this.templateListing = true;
    this.templateRuleListing = false;
    this.editEnable = false;
    this.templateForm.reset();
    this.extraUnitForm.reset();
    // this.addInventoryTypeForm.reset();
    // this.addSupplierForm.reset();
    this.templateUnitStack = [];
    // setTimeout(() => {
    //     this.spinner.hide()
    // }, 1000)
  }
  public onFiltering: any = (e: any) => {
    console.log(e, "ON FILTERING", this.addTypesArr);
    let query: Query = new Query();
    query =
      e.text !== "" ? query.where("text", "startswith", e.text, true) : query;
    e.updateData(this.addTypesArr, query);
  };
  toggleTable() {
    this.isStructureTableVisible = !this.isStructureTableVisible;
  }
  toggleUnitTable() {
    this.isUnitTableVisible = !this.isUnitTableVisible;
  }
}
