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
} from "@angular/forms";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { TaskService } from "../../services/task.service";
import moment = require("moment");
import { EmployeeService } from "../../services/employee.service";
import { MatTableDataSource } from "@angular/material";
import { ProjectService } from "../../services/project.service";
import { Router } from "@angular/router";
import { MapsAPILoader, MouseEvent, AgmMap } from "@agm/core";
import { GoogleMap } from "@agm/core/services/google-maps-types";
import {
  SearchCountryField,
  TooltipLabel,
  CountryISO,
} from "ngx-intl-tel-input";
import { SubscriptionService } from "../../services/subscription.service";
import { DataManager } from "@syncfusion/ej2-data";
import {
  GridComponent,
  PagerComponent,
  ToolbarItems,
} from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import { NgxSpinnerService } from "ngx-spinner";
import { CountryService } from "../../services/countryList.service";
import { CostService } from "../../services/cost.service";
import { patternValidator } from "../../shared/services";
import { jqxKanbanComponent } from "jqwidgets-ng/jqxkanban";
import { P } from "mat-table-exporter";

let date = moment(new Date()).format("L");
let formattedPrefix = moment(date).format("YY/MM/DD");

declare var $: any;
let brList = [];
@Component({
  selector: "app-project-mgt",
  templateUrl: "./project-mgt-new.component.html",
  styleUrls: ["./project-mgt-new.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectMgtNewComponent implements OnInit {
  showCustomerDetails = false;
  contactForAdmin = false;
  allowVerify = false;
  addLocation = false;
  public taskPriority: string;
  public jobNo = "000";
  public prefixString = "";
  @ViewChild("projectBreakGrid", { static: false })
  public projectBreakGrid: GridComponent;
  @ViewChild("pager", { static: true }) pager: PagerComponent;
  @ViewChild("cstCloseBtn", { static: true }) cstCloseBtn: ElementRef;

  pageSize: any = 10;
  currentPage: any = 1;
  public taskStatus: string;
  public taskPriorData: Array<Select2OptionData>;
  public taskStatusData: Array<Select2OptionData>;
  public projectStatusData: Array<Select2OptionData>;
  public projectTypeData: Array<Select2OptionData>;
  public assigneeData: Array<Select2OptionData>;
  public prefixData: Array<Select2OptionData>;
  public countryData: Array<Select2OptionData>;

  public showTaskList = true;
  public showAddForm = false;
  public assigneeStatus: string;
  public taskOptions: Select2Options;
  public editable = false;
  public projectForm: FormGroup;
  public form: FormGroup;
  public startdateValue;
  public enddateValue;
  public completedateValue;
  public prefixExists = false;
  public phone = "";
  public cstPhhone = "";
  nearbyAddress = "";
  nearbyPlaces: google.maps.places.PlaceResult[];
  changed_address: string;

  title: string = "AGM project";
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  georadius: number;
  searchValue: string;
  private geoCoder;
  @ViewChild("search", { read: ElementRef, static: false })
  searchElementRef: ElementRef;
  @ViewChild(AgmMap, { static: true })
  map: GoogleMap;
  @ViewChild("projectGrid", { static: false })
  public projectGrid: GridComponent;

  public date = moment().format("dddd, D MMM YYYY");
  dataSource: any;
  employeeList = [];
  projectCardList = [];
  unverifiedProjectlist = [];
  noLocationProjectList = [];
  closedProjectList = [];
  openProjectList = [];
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];

  phoneInvalid: boolean;
  phoneErrorMsg: any;
  phoneNumberValue: string;
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

  public displayedColumns = [
    "index",
    "project_prefix",
    "project_name",
    "desc",
    "startDate",
    "endDate",
    "completedDate",
    "Action",
  ];
  editTaskId: any;
  searchField: string;
  AddNewSubmit: boolean;
  editProjectData: any = {};
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
  public showProjectCardList = false;
  public isLoading = false;
  geoCodeData: any;
  route: any;
  prefixValue: any;

  data12: Object[];
  showPrefixText: boolean;
  customPrefix: any;
  project_prefix_val: any;
  customerData: any[];
  customerVal: any;
  public selectedISO = CountryISO.UnitedArabEmirates;
  public planType;
  projectData: any[];
  pageSettings: { pageSizes: boolean; pageCount: number };
  projectToolbar: ToolbarItems[];
  endValChange = false;
  disableEndDate = true;
  startValChange: boolean;
  minEndDate: any;
  projStatus: any;
  drag: boolean = false;
  projName: any = "";
  searchLocVal: string = "";
  lastUpdatedBy: string = "";
  lastUpdatedDate: string = "";
  formSubmitted: boolean;
  addformSubmitted: any;
  editformSubmitted: any;
  showerrorMsg: boolean = false;
  projTypeVal: any;
  customerForm: FormGroup;
  cstPhoneNumberValue: any;
  cstPhoneInvalid: boolean = false;
  cstPhone: string;
  verifyLoc: boolean = false;
  verifiedBy: string = "";
  countryValue: any;
  countryValueTxt: any;
  studentView: any;
  pgData: any = [];
  pkgTypeVal: any;
  packageTypeData: { id: string; text: string }[];
  showOrgDetails: boolean = false;
  addCstformSubmitted: boolean = false;
  industryValue: any;
  cstRelationValue: any;
  cstRelationValueTxt: any;
  showAddContact: boolean;
  customerContactForm: FormGroup;
  disableSaveBranch: boolean = true;
  showBranchList: boolean;
  branchDataSource = [];
  showProjectList: boolean = true;
  showUnverifiedList: boolean = false;
  showClosedList: boolean = false;
  showOpenList: boolean = false;
  showNoLocationList: boolean = false;
  showAddBtn: boolean;
  showEditBtn: boolean;
  showDeleteBtn: boolean;
  viewDashboard: boolean;
  savedContactPh: boolean;
  selectedCstISO: any = CountryISO.UnitedArabEmirates;
  getprojByOrgId: boolean;
  showprojDelete: boolean;
  projStatusDisabled: boolean;
  setcurrentLoc: boolean;
  initialSort: { columns: { field: string; direction: string }[] };

  constructor(
    public taskService: TaskService,
    private countries: CountryService,
    private costService: CostService,
    private mapsAPILoader: MapsAPILoader,
    public subscribeService: SubscriptionService,
    private ngZone: NgZone,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public router: Router,
    private formBuilder: FormBuilder,
    public empService: EmployeeService,
    public projectService: ProjectService
  ) {
    this.taskPriority = "0";
    this.taskStatus = "0";

    this.taskPriorData = [
      { id: "1", text: "High" },
      { id: "2", text: "Moderate" },
      { id: "3", text: "Low" },
    ];
    this.prefixData = [
      { id: "1", text: "Default" },
      { id: "2", text: "Custom" },
    ];
    this.taskStatusData = [
      { id: "1", text: "Open" },
      { id: "2", text: "InProgress" },
      { id: "3", text: "Completed" },
    ];
    this.assigneeData = [
      { id: "1", text: "Active" },
      { id: "2", text: "InActive" },
    ];
    this.taskOptions = {
      placeholder: "Select",
      width: "100%",
    };
  }
  public changedPriority(e: any): void {
    this.taskPriority = e.value;
  }
  public OnCustomerClose() {
    this.cstPhone = "";
    this.cstPhoneInvalid = false;
    this.phoneErrorMsg = "";
    $("#customer_modal").modal("hide");
    this.cstCloseBtn.nativeElement.click();
  }
  public AddContact() {
    this.showAddContact = !this.showAddContact;
    //  this.showBranchList=true;
  }
  public GetPrefixByOrgID() {
    this.projectService.GetAllPrefixByOrgID().subscribe(
      (data: any) => {
        if (data[0].prefix_for == "default") {
          let splittable;
          if (data[0].prefix_name) {
            let prefix_name = data[0].prefix_name;

            splittable = prefix_name.split("/");
            let jobNo = parseInt(splittable[3]) + 1;
            this.prefixString = data[0].prefix_name + jobNo;
          }
        } else if (data[0].prefix_for == "custom") {
        } else if (data[0].prefix_for == "sequence") {
          let splittable;
          if (data[0].project_prefix) {
            let project_prefix = data.project_prefix;

            splittable = project_prefix.split("/");
          }
        } else if (data[0].prefix_for == "random") {
          let splittable;
          if (data[0].project_prefix) {
            let project_prefix = data.project_prefix;

            splittable = project_prefix.split("/");
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
  public changedCstRelation(e: any): void {
    this.cstRelationValue = e.value;
    // this.countryValueTxt= e.data[0].text;
    if (e.data[0]) {
      this.cstRelationValueTxt = e.data[0].text;
    }
  }
  public GetLastAddedProjectPrefixByOrgID() {
    this.spinner.show();
    this.projectService.GetLastAddedProjectPrefixByOrgID().subscribe(
      (data: any) => {
        if (data.code == "") {
          this.projectService.GetAllPrefixByOrgID().subscribe(
            (data: any) => {
              this.spinner.hide();

              for (var i = 0; i < data.length; i++) {
                if (data[i].type == "project") {
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
          this.spinner.hide();

          let lastAddedprefix = data.code;
          let lastAddprefixSplit = lastAddedprefix.split("/").pop();
          this.projectService.GetAllPrefixByOrgID().subscribe(
            (data: any) => {
              for (var i = 0; i < data.length; i++) {
                if (data[i].type == "project") {
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
  // public onAddCustomer(e){
  //   this.addformSubmitted = true;
  //   e.preventDefault()
  //   // let loginUrl=this.utilService.getHostURL()+'Account/login';
  //   let code=''
  //   if(this.customerForm.get('customer_phone').value){
  //     let phoneNo=this.customerForm.get('customer_phone').value;
  //     code=phoneNo.dialCode.concat(phoneNo.number);
  //   }
  // let postData={

  //   "id": null,
  //   "cst_name": this.customerForm.get('customer_Name').value,
  //   "cst_type": null,
  //   "email": null,
  //   "phone":null,
  //   "adr": this.customerForm.get('street_1').value,
  //   "street": this.customerForm.get('street_2').value,
  //   "country": this.countryValue!=''?this.countryValue:null,
  //   "city": this.customerForm.get('city').value,
  //   "EntityContact": {
  //     "id": null,
  //     // "entity_id": "string",
  //     "entity_id": null,

  //     "name": this.customerForm.get('name').value,
  //     "position": null,
  //     //"phone": this.customerForm.get('phone').value,
  //     "mobile": null,
  //     "email": this.customerForm.get('email').value,
  //      phone: this.cstPhoneNumberValue,

  //   }
  // }

  //       //

  //       if (this.customerForm.get('customer_Name').value != '' ) {
  //       //
  //           this.spinner.show();
  //           return this.projectService.AddCustomer(postData).subscribe(
  //             (data:any)  => {
  //               // let dataObj = JSON.parse(data['token']);

  //             if(data.status==200){
  //               this.OnCustomerClose();
  //               this.GetAllCustomer();
  //               this.addformSubmitted = false;
  //               this.spinner.hide();

  //               this.toastr.success(data['desc'], undefined,{
  //                 positionClass: 'toast-top-center'
  //            });
  //             }
  //             // this.router.navigate(["/organizations"]);

  //             },
  //             error  => {
  //               Swal.fire(
  //                 'Error!',
  //                 'Error.',
  //                 'error'
  //               ).then(
  //                 //used Arrow function here
  //                 (result)=> {

  //                   //  this.router.navigate(['/dashboard']);
  //                 })

  //             }

  //             )

  //       }
  //   }
  changedIndustry(e: any): void {
    this.industryValue = e.value;
  }
  onPrimaryContactCheck(e) {
    if (e.srcElement.checked == true) {
      let entityContact = this.customerForm.get("customer_phone").value;
      console.log("entityContact", entityContact);
      this.selectedCstISO = entityContact.countryCode;
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
        phone:
          this.customerForm.get("customer_phone").value != "" &&
          this.customerForm.get("customer_phone").value != null
            ? entityContact.number
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
            this.countryValue = data[i].id;
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
  public changedCountry(e: any): void {
    this.countryValue = e.value;
    // this.countryValueTxt= e.data[0].text;
    if (e.data[0]) {
      this.countryValueTxt = e.data[0].text;
    }
  }
  onChange(event) {
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
  public changedStatus(e: any): void {
    this.taskStatus = e.value;
  }

  public changedProj(e: any): void {
    this.projStatus = e.value;
  }
  public changedProjType(e: any): void {
    this.projTypeVal = e.value;
  }

  public nearByPlaces() {
    // this.editableLoc=true;
    // console.log('nearByPlaces');
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
        console.log(results, "nearByPlaces");
        this.nearbyPlaces = results;
      }
    );
  }
  public startDateChanged() {
    /**
     * name
     */
  }
  focusFunction() {
    console.log("focusFunction");
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
    console.log("keyup");
    this.showNearbyPlaces = false;

    if (event.keyCode == 8 && this.searchElementRef.nativeElement.value == "")
      this.showNearbyPlaces = true;
    this.searchLocVal = "";

    this.mapsAPILoader.load().then(() => {
      this.nearByPlaces();
    });
  }

  clickFunction() {
    console.log("clickFunction");
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

  public locationSetUp() {
    $("#kt_user_edit_tab_3").trigger("click");
    if (this.setcurrentLoc == true) {
      this.mapsAPILoader.load().then(() => {
        //this.nearByPlaces();
        this.geoCoder = new google.maps.Geocoder();

        this.setCurrentLocation();
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
            this.searchLocVal = place.formatted_address;
            // this.web_site = place.website;
            // this.name = place.name;

            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 12;
            // this.showNearbyPlaces=false;
            if (this.searchElementRef.nativeElement == "") {
              // this.showNearbyPlaces=true;
              this.searchLocVal = "";
            }
          });
        });
      });
    }
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

  public onSearchChange() {}
  public nameChange(e) {
    if (e.target.value != "") {
      this.addformSubmitted = false;
      this.projName = e.target.value;
    } else {
      this.addformSubmitted = true;

      // this.isFieldValid('proj_name');
    }
  }

  onGeoRadiusChange(value: any) {
    const radius = parseFloat(value);
    if (this.addLocation) {
      if (!isNaN(radius) && radius > 0) {
        if (radius !== this.georadius) {
          this.georadius = radius;
          this.toastr.success("Project radius updated successfully.");
        } else {
          console.log("Radius value is the same as before.");
        }
      } else {
        console.error("Invalid radius value:", value);
        this.toastr.error("Please enter a valid radius greater than 0.");
      }
    }
    {
      this.toastr.error("You dont have permission to update the radius");
    }
  }

  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.drag = true;

    this.getAddress(this.latitude, this.longitude);
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        console.log("getAddress", latitude, longitude);
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

  public AddForm() {
    $.getScript("assets/js/pages/custom/user/edit-user.js");

    this.projectForm.reset();
    this.GetAllCustomer();
    this.GetLastAddedProjectPrefixByOrgID();
    this.GetPrefixByOrgID();
    // this.FindAutoProjectPrefixByOrgID();

    this.projectForm.patchValue({
      accessControl: "is_public",
      prefixVal: "is_auto",
    });
    this.GetPkgByOrgID();
    this.showTaskList = false;
    this.showAddForm = true;
    this.AddNewSubmit = true;
    this.editable = false;
    this.showPrefixText = false;
    this.customPrefix = "";
    this.prefixExists = false;
    this.verifyLoc = false;
    $("#isLoc").prop("checked", false);
    // this.searchElementRef.nativeElement.value='';
    this.nearbyAddress = "";
    this.setcurrentLoc = true;
  }

  public toProjectLayout(id, data) {
    localStorage.setItem("project_id", id);
    this.router.navigate(["/project-layout-new"]);

    if (data !== null) {
      if (data.relprojectId !== null) {
        let originalProject = {
          projectID: data.relprojectId,
          projectName: data.relprojectName,
        };
        localStorage.setItem(
          "Original_project",
          JSON.stringify(originalProject)
        );
      }
    }
  }

  public TaskView() {
    if (this.getprojByOrgId) {
      this.GetPriorityByOrgID();
    } else {
      this.FetchAllProjectByEmpID();
    }

    this.showTaskList = true;
    this.showAddForm = false;
    this.assigneeStatus = "";
    sessionStorage.clear();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  public goBack() {
    window.history.go(-1);
    sessionStorage.clear();
  }
  public AddCst() {
    // $('#addLeave').show();
    $("#customer_modal").modal("show");
    this.getCountryList();
  }
  public onAddSubmit() {
    this.addformSubmitted = true;
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    // let date=document.getElementById('ntpDate').innerText
    // moment().format('L');
    let adr1 = this.projectForm.get("street_1").value,
      adr2 = this.projectForm.get("street_2").value,
      city = this.projectForm.get("city").value,
      contact_name = this.projectForm.get("contact_name").value,
      contact_type = this.projectForm.get("contact_type").value;
    let entityContact = [];
    if (this.branchDataSource.length != 0) {
      for (var i = 0; i < this.branchDataSource.length; i++) {
        entityContact.push({
          id: null,
          entity_id: null,
          name:
            this.branchDataSource[i].first_name +
            "" +
            this.branchDataSource[i].last_name,
          first_name: this.branchDataSource[i].first_name,
          last_name: this.branchDataSource[i].last_name,
          position: null,
          phone: this.branchDataSource[i].phone,
          department: this.branchDataSource[i].department,
          relationship: this.branchDataSource[i].relationship,
          designation: this.branchDataSource[i].designation,
          note: this.branchDataSource[i].note,
          mobile: null,
          email: this.branchDataSource[i].email,
          adr_1: null,
          adr_2: null,

          city: null,
          country: null,
          is_primary: this.branchDataSource[i].is_primary,
          createdby: user_info["full_name"],
        });
      }
    }

    let postData = {
      project_name: this.projectForm.get("project_name").value,
      project_desc: this.projectForm.get("desc").value,
      cst_id: this.customerVal,
      project_type_id: this.projTypeVal,
      package_id: this.pkgTypeVal,

      start_date: moment(this.startdateValue).format("L"),
      end_date: moment(this.enddateValue).format("L"),
      // completed_date: moment(this.completedateValue).format('L'),
      // project_status_id: "string",
      // project_prefix:this.projectForm.get('prefixVal').value=='is_auto'?this.prefixString:this.projectForm.get('prefix_name').value,
      project_prefix: this.prefixString,
      is_private:
        this.projectForm.get("accessControl").value == "is_private"
          ? true
          : false,
      is_public:
        this.projectForm.get("accessControl").value == "is_public"
          ? true
          : false,
      is_inactive: true,
      createdby: user_info["full_name"],

      // email: localStorage.getItem('email'),
      //   ...adr1 && {adr1: adr1},
      //  ...adr2 && { adr2:adr2},
      //  ...city && { city: city},
      //   ...contact_name && {primary_cont_name: contact_name},
      //  ...contact_type && {primary_cont_type:contact_type},
      entityContact: entityContact.length != 0 ? entityContact : null,

      //   "EntityContact": {
      //     "id": null,
      //     "entity_id": null,
      //     name: this.projectForm.get('name').value ,
      //   // position: this.projectForm.get('position').value ,
      //   // phone: this.projectForm.get('phone').value ,
      //   phone: this.phoneNumberValue,

      //  // mobile: this.projectForm.get('mobile').value ,
      //   email: this.projectForm.get('email').value ,

      //   },
      entityLocation:
        this.searchElementRef.nativeElement.value != ""
          ? // &&
            // this.verifyLoc == true
            {
              id: null,
              entity_id: null,
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
              locality: this.changed_locality
                ? this.changed_locality
                : this.locality,
              administrative_area_level_2: this
                .changed_administrative_area_level_2
                ? this.changed_administrative_area_level_2
                : this.administrative_area_level_2,
              administrative_area_level_1: this
                .changed_administrative_area_level_1
                ? this.changed_administrative_area_level_1
                : this.administrative_area_level_1,
              postal_code: this.changed_postal_code
                ? this.changed_postal_code
                : this.postal_code,
              country: this.changed_country
                ? this.changed_country
                : this.country,
              city: this.changed_administrative_area_level_1
                ? this.changed_administrative_area_level_1
                : this.administrative_area_level_1,
              radius: this.georadius ? this.georadius : 0,
              is_verified: this.verifyLoc,
              verified_updatedby: this.verifyLoc
                ? user_info["full_name"]
                : null,
            }
          : null,
    };
    console.log("Addproj", postData);

    if (this.projectForm.status == "VALID") {
      this.spinner.show();

      return this.projectService.AddProject(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.TaskView();
            this.spinner.hide();
            this.addformSubmitted = false;
            this.projName = "";
            this.projectForm.reset();
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
        }

        this.packageTypeData = results;
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
  public changedPkgType(e: any): void {
    this.pkgTypeVal = e.value;
  }
  public onAddNewSubmit() {
    // let date=document.getElementById('ntpDate').innerText
    // moment().format('L');
    this.addformSubmitted = true;
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    let code = "";
    if (this.projectForm.get("phone").value) {
      let phoneNo = this.projectForm.get("phone").value;
      code = phoneNo.dialCode.concat(phoneNo.number);
    }
    let entityContact = [];
    if (this.branchDataSource.length != 0) {
      for (var i = 0; i < this.branchDataSource.length; i++) {
        entityContact.push({
          id: null,
          entity_id: null,
          name:
            this.branchDataSource[i].first_name +
            "" +
            this.branchDataSource[i].last_name,
          first_name: this.branchDataSource[i].first_name,
          last_name: this.branchDataSource[i].last_name,
          position: null,
          phone: this.branchDataSource[i].phone,
          department: this.branchDataSource[i].department,
          relationship: this.branchDataSource[i].relationship,
          designation: this.branchDataSource[i].designation,
          note: this.branchDataSource[i].note,
          mobile: null,
          email: this.branchDataSource[i].email,
          adr_1: null,
          adr_2: null,

          city: null,
          country: null,
          is_primary: this.branchDataSource[i].is_primary,
          createdby: user_info["full_name"],
        });
      }
    }
    let postData = {
      project_name: this.projectForm.get("project_name").value,
      project_desc: this.projectForm.get("desc").value,
      cst_id: this.customerVal,
      project_type_id: this.projTypeVal,

      start_date: moment(this.startdateValue).format("L"),
      end_date: moment(this.enddateValue).format("L"),
      // completed_date: moment(this.completedateValue).format('L'),
      project_status_id: null,
      is_private:
        this.projectForm.get("accessControl").value == "is_private"
          ? true
          : false,
      is_public:
        this.projectForm.get("accessControl").value == "is_public"
          ? true
          : false,
      project_prefix: this.project_prefix_val,
      is_inactive: true,
      entityContact: entityContact.length != 0 ? entityContact : null,

      //     "EntityContact": {
      //       "id": null,
      //       "entity_id": null,
      //       name: this.projectForm.get('name').value ,
      //     // position: this.projectForm.get('position').value ,
      //     // phone: this.projectForm.get('phone').value ,
      // phone: this.phoneNumberValue,

      //     // mobile: this.projectForm.get('mobile').value ,
      //     email: this.projectForm.get('email').value ,

      //     },
      EntityLocation: {
        id: null,
        entity_id: null,
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

    if (this.projName != "") {
      this.spinner.show();

      return this.projectService.AddProject(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {
            this.addformSubmitted = false;
            this.projName = "";
            this.projectForm.reset();

            this.spinner.hide();

            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          } else {
            this.spinner.hide();

            Swal.fire("Error!", data["result"].desc, "error").then(
              //used Arrow function here
              (result) => {
                //  this.router.navigate(['/dashboard']);
              }
            );
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

  public GetProjectTypeByOrgID() {
    this.projectService.GetProjectTypeByOrgID().subscribe(
      (data: any) => {
        var results = [
          {
            id: "",
            text: "Select",
          },
        ];

        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            id: data[i].id,
            text: data[i].type_name,
          });
        }

        this.projectTypeData = results;
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
  public EmpList() {
    this.empService.getAllEmployee().subscribe(
      (data: any) => {
        var results = [];

        // for (var i = 0; i < data.length; i++) {
        // // logik to create new items

        // results.push({
        //     "id": data[i].id,
        //     "text": data[i].first_name
        // });

        // }

        // this.assigneeData =results;
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
  public clearSearchField() {
    this.searchField = "";

    if (this.getprojByOrgId) {
      this.GetPriorityByOrgID();
    } else {
      this.FetchAllProjectByEmpID();
    }
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

  brDelete(index) {
    this.branchDataSource.splice(index, 1);
    brList.splice(index, 1);
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
              // this.projcountryValue=data.country
            }, 500);

            if (data.entityContact != null || data.entityContact.length != 0) {
              let entityContact;
              this.showBranchList = true;

              entityContact = {
                id: null,
                entity_id: null,
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

  // public FindCustomProjectPrefixByOrgIDAndPrefix
  public getAllProject() {
    this.projectService.GetAllProject().subscribe(
      (data: any) => {
        this.dataSource = new MatTableDataSource(data);

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

  public onstartDtChange(e) {
    this.startdateValue = moment(e.value).format("L");

    this.disableEndDate = false;

    this.projectForm.get("startDate").valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      if (this.projectForm.get("startDate").value != "") {
        this.startValChange = true;
      }
      let startDate = this.projectForm.get("startDate").value;
      this.minEndDate = startDate;

      this.projectForm.get("endDate").enable();
    });
  }
  public onendDtChange(e) {
    this.enddateValue = moment(e.value).format("L");
  }
  public oncompltDtChange(e) {
    this.completedateValue = moment(e.value).format("L");
  }

  public async taskEdit(dept_id: string) {
    this.spinner.show();
    this.georadius = 0;
    $.getScript("assets/js/pages/custom/user/edit-user.js");
    console.log("dept_id", dept_id);
    try {
      await Promise.all([
        this.GetAllCustomer(),
        this.GetAllProjectStatus(),
        this.GetProjectTypeByOrgID(),
        this.GetPkgByOrgID(),
      ]);

      this.AddNewSubmit = false;
      this.editable = true;
      this.editTaskId = dept_id;
      this.showTaskList = false;
      this.showAddForm = true;

      const postData = { id: dept_id };
      this.editProjectData = {};

      const data: any = await this.projectService
        .FindByProjectID(postData)
        .toPromise();

      this.project_prefix_val = data.project_prefix;
      this.projName = data.project_name;
      this.editProjectData = data;

      setTimeout(() => {
        this.projTypeVal = data.project_type_id;
        this.pkgTypeVal = data.package_id;
        this.projStatus = data.project_status_id;
      }, 1000);

      this.projectForm.patchValue({
        project_name: data.project_name,
        desc: data.project_desc,
        startDate: moment(data.start_date).format("L"),
        endDate: moment(data.end_date).format("L"),
        cst_name: data.cst_name,
        accessControl: data.is_private ? "is_private" : "is_public",
        name: data.entityContact ? data.entityContact.name : "",
        phone: data.entityContact ? data.entityContact.phone : "",
        email: data.entityContact ? data.entityContact.email : "",
      });

      this.projStatusDisabled = data.is_modification || false;

      if (data.entityLocation) {
        this.setcurrentLoc = false;

        if (data.entityLocation.lat && data.entityLocation.lang) {
          this.nearbyAddress = data.entityLocation.formatted_address;
          this.searchLocVal = data.entityLocation.formatted_address;
          this.address = data.entityLocation.formatted_address;
          this.searchElementRef.nativeElement.value =
            data.entityLocation.formatted_address;

          this.verifyLoc =
            typeof data.entityLocation.is_verified === "boolean"
              ? data.entityLocation.is_verified
              : false;
          this.georadius = Number.isInteger(+data.entityLocation.radius)
            ? +data.entityLocation.radius
            : 0;
          console.log(
            this.georadius,
            "georadius",
            typeof data.entityLocation.radius,
            data.entityLocation.radius
          );
          $("#isLoc").prop("checked", this.verifyLoc);
          this.verifiedBy = data.entityLocation.verified_updatedby;
          if (data.entityLocation.modifiedby) {
            this.lastUpdatedBy = data.entityLocation.modifiedby;
            this.lastUpdatedDate = data.entityLocation.modified_date;
          } else {
            this.lastUpdatedBy = data.entityLocation.createdby;
            this.lastUpdatedDate = data.entityLocation.created_date;
          }

          this.changed_street_number = data.entityLocation.street_number;
          this.changed_route = data.entityLocation.route;
          this.changed_locality = data.entityLocation.locality;
          this.changed_administrative_area_level_2 =
            data.entityLocation.changed_administrative_area_level_2;
          this.changed_administrative_area_level_1 =
            data.entityLocation.changed_administrative_area_level_1;
          this.changed_country = data.entityLocation.changed_country;

          await new Promise((resolve) => setTimeout(resolve, 1000));
          this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder();
            this.setPredefinedLocation(
              parseFloat(data.entityLocation.lat),
              parseFloat(data.entityLocation.lang)
            );
          });
        } else {
          this.verifyLoc = false;
          this.searchElementRef.nativeElement.value = "";
          this.nearbyAddress = "";
          this.setcurrentLoc = true;
        }
      } else {
        this.verifyLoc = false;
        this.searchElementRef.nativeElement.value = "";
        this.nearbyAddress = "";
        this.setcurrentLoc = true;
      }

      if (data.entityContact) {
        this.showBranchList = true;
        this.branchDataSource = data.entityContact;
      }

      if (data.entityCustomer) {
        this.customerVal = data.entityCustomer.id;
      }
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    } finally {
      this.spinner.hide();
    }
  }

  update(el: Element, comment: string) {
    // if (comment == null) { return; }
    // // copy and mutate
    // const copy = this.dataSource.data().slice()
    // el.comment = comment;
    // this.dataSource.update(copy);
  }

  private setPredefinedLocation(lat, lang) {
    if ("geolocation" in navigator) {
      console.log("setPredefinedLocation", lat, lang);
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = lat;
        this.longitude = lang;
        this.zoom = 8;

        this.getAddress(lat, lang);
      });
    }
  }
  public onEditSubmit() {
    // this.projectForm.get('deptName').valueChanges
    // .subscribe((mode: string) => {
    //   if (mode) {
    //
    //   }
    // });
    console.log(this.georadius, "georadius");
    this.spinner.show();
    let entityContact = [];
    console.log(
      this.editProjectData,
      "editProjectData",
      typeof this.editProjectData
    );
    let previousIsVerifiedStatus =
      this.editProjectData.entityLocation &&
      typeof this.editProjectData.entityLocation.is_verified === "boolean"
        ? this.editProjectData.entityLocation.is_verified
        : false;

    let previousUpdatedBy =
      this.editProjectData.entityLocation &&
      typeof this.editProjectData.entityLocation.verified_updatedby === "string"
        ? this.editProjectData.entityLocation.verified_updatedby
        : "";

    let updateIsVerifiedBy = this.verifyLoc === previousIsVerifiedStatus;

    console.log(updateIsVerifiedBy, "CHECK", previousIsVerifiedStatus);
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    for (var i = 0; i < this.branchDataSource.length; i++) {
      entityContact.push({
        id: this.branchDataSource[i].id,
        entity_id: this.branchDataSource[i].entity_id,
        name:
          this.branchDataSource[i].first_name +
          "" +
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
    let postData = {
      id: this.editTaskId,
      project_name: this.projectForm.get("project_name").value,
      project_desc: this.projectForm.get("desc").value,
      cst_id: this.customerVal,
      project_type_id: this.projTypeVal,
      modifiedby: user_info["full_name"],
      start_date: moment(this.startdateValue).format("L"),
      end_date: moment(this.enddateValue).format("L"),
      package_id: this.pkgTypeVal,

      // completed_date: moment(this.completedateValue).format('L'),
      project_status_id: this.projStatus,
      is_private:
        this.projectForm.get("accessControl").value == "is_private"
          ? true
          : false,
      is_public:
        this.projectForm.get("accessControl").value == "is_public"
          ? true
          : false,
      project_prefix: this.project_prefix_val,
      is_inactive: true,
      entityContact: entityContact.length != 0 ? entityContact : null,

      //     "EntityContact": {
      //       "id": null,
      //       "entity_id": null,
      //       name: this.projectForm.get('name').value ,
      //     // position: this.projectForm.get('position').value ,
      //     // phone: this.projectForm.get('phone').value ,
      // phone: this.phoneNumberValue,

      //     // mobile: this.projectForm.get('mobile').value ,
      //     email: this.projectForm.get('email').value ,

      //     },
      entityLocation:
        this.searchElementRef.nativeElement.value != ""
          ? // &&
            // this.verifyLoc == true
            {
              id: null,
              entity_id: null,
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
              locality: this.changed_locality
                ? this.changed_locality
                : this.locality,
              administrative_area_level_2: this
                .changed_administrative_area_level_2
                ? this.changed_administrative_area_level_2
                : this.administrative_area_level_2,
              administrative_area_level_1: this
                .changed_administrative_area_level_1
                ? this.changed_administrative_area_level_1
                : this.administrative_area_level_1,
              postal_code: this.changed_postal_code
                ? this.changed_postal_code
                : this.postal_code,
              country: this.changed_country
                ? this.changed_country
                : this.country,
              city: this.changed_administrative_area_level_1
                ? this.changed_administrative_area_level_1
                : this.administrative_area_level_1,
              radius: this.georadius ? this.georadius : 0,
              is_verified: this.verifyLoc,
              verified_updatedby: updateIsVerifiedBy
                ? previousUpdatedBy
                : user_info["full_name"],
              modifiedby: user_info["full_name"],
            }
          : null,
    };

    if (this.projectForm.get("project_name").value !== "") {
      return this.projectService.UpdateProject(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {
            this.editable = false;
            this.spinner.hide();

            this.TaskView();
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
  public async taskDelete(deptId) {
    const postData = {
        id: deptId,
    };

    try {
        const data: any = await this.projectService.RemoveProjectByID(postData).toPromise();

        if (data.status === 200) {
            if (this.getprojByOrgId) {
                 this.GetPriorityByOrgID();
            } else {
                await this.FetchAllProjectByEmpID();
            }
            this.toastr.error(data["desc"], undefined, {
                positionClass: "toast-top-center",
            });
        }
    } catch (error) {
        Swal.fire("Error!", error.message || "An error occurred.", "error");
    }
}


  public FetchAllProjectByEmpID() {
    this.projectService.FetchAllProjectListByEmpID().subscribe(
      (data: any) => {
        this.dataSource = new MatTableDataSource(data);
        let datas = new DataManager(data);
        this.projectData = datas.dataSource["json"];

        console.log(this.projectData, "this.projectData****");

        //   data.forEach((data,index)=>{
        //     if(data){
        //      let index12=index+1;

        //       this.projectData['index'].rowValue=index12;
        //            }
        //     });
        this.initialSort = {
          columns: [{ field: "ondate", direction: "Descending" }],
          // { field: 'alias', direction: 'Descending' }]
        };

        this.pageSettings = { pageSizes: true, pageCount: 5 };

        // this.router.navigate(["/organizations"]);
        this.pgData = data;

        let ds = data.slice(0, this.pageSize);
        let ds1 = new DataManager(ds);
        this.studentView = ds1.dataSource["json"];
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
  public async GetPriorityByOrgID() {
    try {
      this.isLoading = true;
        const data: any = await this.projectService.FetchAllProjectListByOrg().toPromise();

        this.dataSource = new MatTableDataSource(data);
        let datas = new DataManager(data);
        this.projectData = datas.dataSource["json"];

        this.closedProjectList = [];
        this.openProjectList = [];

        if (this.projectData.length > 0) {
            this.projectData.forEach((project) => {
                if (project.isClosed) {
                    this.closedProjectList.push(project);
                } else {
                    this.openProjectList.push(project);
                }
            });


        }

        this.pageSettings = { pageSizes: true, pageCount: 5 };
        this.pgData = data;

        let ds = data.slice(0, this.pageSize);
        let ds1 = new DataManager(ds);
        this.studentView = ds1.dataSource["json"];
    } catch (error) {
        Swal.fire("Error!", error.message || "An error occurred.", "error");
    }
    finally{
      setTimeout(() => {
        this.isLoading = false;
      },1000)

    }
}


  isFieldValid(field: string) {
    if (this.addformSubmitted) {
      return (
        (this.showerrorMsg = true),
        (this.projectForm.get(field).errors &&
          this.projectForm.get(field).touched) ||
          (this.projectForm.get(field).untouched && this.addformSubmitted)
      );
    } else if (this.editformSubmitted) {
      return (
        (this.showerrorMsg = true),
        this.projectForm.get(field).errors && this.editformSubmitted
      );
    } else {
      return (this.showerrorMsg = false), false;
    }
    // return (
    //   this.projectForm.get(field).errors && this.projectForm.get(field).touched ||
    //   this.projectForm.get(field).untouched &&
    //   this.formSubmitted && this.projectForm.get(field).errors  && this.projectForm.get(field).errors.patternValidator

    // );
  }
  changed(e) {
    this.pageSize = e.pageSize;
    let start = (this.currentPage - 1) * e.pageSize;
    this.studentView = this.projectData.slice(start, start + e.pageSize);
  }
  click(args) {
    if (args.currentPage) {
      let start = (args.currentPage - 1) * this.pageSize;
      this.studentView = this.projectData.slice(start, start + this.pageSize);
    }
  }
  public checkIsLoc(e) {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    if (e.srcElement.checked) {
      this.verifyLoc = true;
      this.verifiedBy = user_info["full_name"];
    } else {
      this.verifyLoc = false;
    }
  }
  public FindAutoProjectPrefixByOrgID() {
    this.projectService.FindAutoProjectPrefixByOrgID().subscribe(
      (data: any) => {
        // this.project_prefix_val=data.project_prefix;

        if (data == null) {
          let jobNo = "000";
          this.prefixString = "JOB/" + formattedPrefix + "/" + jobNo;
        } else {
          let splittable;
          if (data.project_prefix) {
            let project_prefix = data.project_prefix;

            splittable = project_prefix.split("/");
          }
          // var splittable =  project_prefix.split('/');
          if (parseInt(splittable[4]).toString().length == 1) {
            let jobNo = "00" + (parseInt(splittable[4]) + 1);
            this.prefixString = "JOB/" + formattedPrefix + "/" + jobNo;
          } else if (parseInt(splittable[4]).toString().length == 2) {
            let jobNo = "0" + (parseInt(splittable[4]) + 1);
            this.prefixString = "JOB/" + formattedPrefix + "/" + jobNo;
          } else {
            let jobNo = parseInt(splittable[4]) + 1;
            this.prefixString = "JOB/" + formattedPrefix + "/" + jobNo;
          }
        }
        //this.prefixString='JOB/'+formattedPrefix+'/'+this.jobNo;

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

  toolbarClick(args: ClickEventArgs): void {
    switch (args.item.text) {
      case "PDF Export":
        this.projectGrid.pdfExport();
        break;
      case "Excel Export":
        this.projectGrid.excelExport();
        break;
      case "CSV Export":
        this.projectGrid.csvExport();
        break;
    }
  }
  projectBreakGridClick(args: ClickEventArgs): void {
    switch (args.item.text) {
      case "PDF Export":
        this.projectBreakGrid.pdfExport();
        break;
      case "Excel Export":
        this.projectBreakGrid.excelExport();
        break;
      case "CSV Export":
        this.projectBreakGrid.csvExport();
        break;
    }
  }
  //   addTask(){
  //     $("#task_log_modal").modal('show');
  //   }
  //   OnTaskClose(){
  //     $("#task_log_modal").modal('hide');
  //  }
  // getParentApi(): ParentComponentApi  {
  //   return {
  //     callParentMethod: () => {
  //       this.OnTaskClose(),
  //       this.GetAllTaskByEmpID()
  //     }
  //   }
  // }
  public GetAllTaskByEmpID() {}
  public checkIsOrg(e) {
    if (e.srcElement.checked == true) {
      this.showOrgDetails = true;
    } else {
      this.showOrgDetails = false;
    }
  }
  @ViewChild("myKanban", { static: false }) myKanban: jqxKanbanComponent;

  fields: any[] = [
    { name: "id", type: "string" },
    { name: "status", map: "state", type: "string" },
    { name: "text", map: "label", type: "string" },
    { name: "tags", type: "string" },
    { name: "color", map: "hex", type: "string" },
    { name: "resourceId", type: "number" },
  ];

  getWidth(): any {
    if (document.body.offsetWidth < 600) {
      return "90%";
    }

    return 600;
  }

  source: any = {
    localData: [
      {
        id: "1161",
        state: "new",
        label: "Combine Orders",
        tags: "orders, combine",
        hex: "#5dc3f0",
        resourceId: 3,
      },
      {
        id: "1645",
        state: "work",
        label: "Change Billing Address",
        tags: "billing",
        hex: "#f19b60",
        resourceId: 1,
      },
      {
        id: "9213",
        state: "new",
        label: "One item added to the cart",
        tags: "cart",
        hex: "#5dc3f0",
        resourceId: 3,
      },
      {
        id: "6546",
        state: "done",
        label: "Edit Item Price",
        tags: "price, edit",
        hex: "#5dc3f0",
        resourceId: 4,
      },
      {
        id: "9034",
        state: "new",
        label: "Login 404 issue",
        tags: "issue, login",
        hex: "#6bbd49",
      },
    ],
    dataType: "array",
    dataFields: this.fields,
  };

  source2: any = {
    localData: [
      {
        id: "1162",
        state: "new",
        label: "New issue",
        tags: "orders, combine",
        hex: "#5dc3f0",
      },
      {
        id: "1646",
        state: "work",
        label: "NEw issue 2",
        tags: "billing",
        hex: "#f19b60",
      },
      {
        id: "9214",
        state: "new",
        label: "New issue 3",
        tags: "cart",
        hex: "#5dc3f0",
      },
      {
        id: "6547",
        state: "done",
        label: "New issue 4",
        tags: "price, edit",
        hex: "#5dc3f0",
        resourceId: 4,
      },
      {
        id: "9035",
        state: "new",
        label: "New issue 5",
        tags: "issue, login",
        hex: "#6bbd49",
      },
    ],
    dataType: "array",
    dataFields: this.fields,
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  resourcesAdapterFunc = (): any => {
    let resourcesSource = {
      localData: [
        {
          id: 0,
          name: "No name",
          image:
            "https://www.jqwidgets.com/angular/jqwidgets/styles/images/common.png",
          common: true,
        },
        {
          id: 1,
          name: "Andrew Fuller",
          image: "https://www.jqwidgets.com/angular/images/andrew.png",
        },
        {
          id: 2,
          name: "Janet Leverling",
          image: "https://www.jqwidgets.com/angular/images/janet.png",
        },
        {
          id: 3,
          name: "Steven Buchanan",
          image: "https://www.jqwidgets.com/angular/images/steven.png",
        },
        {
          id: 4,
          name: "Nancy Davolio",
          image: "https://www.jqwidgets.com/angular/images/nancy.png",
        },
        {
          id: 5,
          name: "Michael Buchanan",
          image: "https://www.jqwidgets.com/angular/images/Michael.png",
        },
        {
          id: 6,
          name: "Margaret Buchanan",
          image: "https://www.jqwidgets.com/angular/images/margaret.png",
        },
        {
          id: 7,
          name: "Robert Buchanan",
          image: "https://www.jqwidgets.com/angular/images/robert.png",
        },
        {
          id: 8,
          name: "Laura Buchanan",
          image: "https://www.jqwidgets.com/angular/images/Laura.png",
        },
        {
          id: 9,
          name: "Laura Buchanan",
          image: "https://www.jqwidgets.com/angular/images/Anne.png",
        },
      ],
      dataType: "array",
      dataFields: [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
        { name: "image", type: "string" },
        { name: "common", type: "boolean" },
      ],
    };
    let resourcesDataAdapter = new jqx.dataAdapter(resourcesSource);
    return resourcesDataAdapter;
  };

  columns: any[] = [
    { text: "Backlog", dataField: "new", maxItems: 5 },
    { text: "In Progress", dataField: "work", maxItems: 5 },
    {
      text: "Done",
      dataField: "done",
      maxItems: 5,
      collapseDirection: "right",
    },
  ];

  removeItemBtnOnClick(): void {
    // this._removeAllContent();
    // this.myRemoveItemBtn.disabled(true);

    this.myKanban.source(new jqx.dataAdapter(this.source));
  }

  _removeAllContent(): any {
    this.source.localData.forEach((element: object) => {
      this.myKanban.removeItem(element["id"]);
    });
  }

  projectKeyUpSearch(): void {
    document
      .getElementById(this.projectGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.projectGrid.search((event.target as HTMLInputElement).value);
      });
  }

  ngOnInit() {
    this.projectToolbar = ["Search", "ExcelExport", "PdfExport"];
    //  this.getAllProject();
    $(".modal-backdrop").hide();
    $("#kt_user_edit_tab_2").addClass("disabled");
    this.georadius = 0;
    //  this.planType=localStorage.getItem('planType');
    //
    this.getCountryList();
    this.fetchProjectsWithLocationVerification();
    this.GetProjectTypeByOrgID();
    // this.GetPrefixByOrgID();
    this.GetLastAddedProjectPrefixByOrgID();
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

    if (localStorage.getItem("planType")) {
      this.planType = "Basic";
    }
    if (JSON.parse(localStorage.getItem("userRights")).length != 0) {
      console.log("if");
      let userRights = JSON.parse(localStorage.getItem("userRights"));
      for (var i = 0; i < userRights.length; i++) {
        if (userRights[i].module_name == "Project") {
          if (
            userRights[i].section_name == "Project View List" &&
            userRights[i].is_allow == true
          ) {
            this.showProjectList = true;
          } else if (
            userRights[i].section_name == "Project View List" &&
            userRights[i].is_allow == false
          ) {
            this.showProjectList = false;
          }
          if (
            userRights[i].section_name == "Add Project" &&
            userRights[i].is_allow == true
          ) {
            this.showAddBtn = true;
          } else if (
            userRights[i].section_name == "Add Project" &&
            userRights[i].is_allow == false
          ) {
            this.showAddBtn = false;
          }
          if (
            userRights[i].section_name == "Edit Project" &&
            userRights[i].is_allow == true
          ) {
            this.showEditBtn = true;
          } else if (
            userRights[i].section_name == "Edit Project" &&
            userRights[i].is_allow == false
          ) {
            this.showEditBtn = false;
          }
          if (
            userRights[i].section_name == "Delete Project" &&
            userRights[i].is_allow == true
          ) {
            this.showDeleteBtn = true;
          } else if (
            userRights[i].section_name == "Delete Project" &&
            userRights[i].is_allow == false
          ) {
            this.showDeleteBtn = false;
          }
          if (
            userRights[i].section_name == "View Project Dashboard" &&
            userRights[i].is_allow == true
          ) {
            this.viewDashboard = true;
          } else if (
            userRights[i].section_name == "View Project Dashboard" &&
            userRights[i].is_allow == false
          ) {
            this.viewDashboard = false;
          }
          if (
            userRights[i].section_name == "View Contact" &&
            userRights[i].is_allow == true
          ) {
            this.showCustomerDetails = true;
          }
          if (
            userRights[i].section_name == "Verify Location" &&
            userRights[i].is_allow == true
          ) {
            this.allowVerify = true;
          }
          if (
            userRights[i].section_name == "Add Location" &&
            userRights[i].is_allow == true
          ) {
            this.addLocation = true;
          }
          console.log("userRights", userRights[i].section_name);
        } else {
          //   this.showProjectList=true
          // this.showAddBtn=true
          // this.showEditBtn=true
          // this.showDeleteBtn=true
          // this.viewDashboard=true
        }
      }
    } else {
      console.log("else");
      this.showProjectList = true;
      this.showAddBtn = true;
      this.showEditBtn = true;
      this.showDeleteBtn = true;
      this.viewDashboard = true;
    }
    if (localStorage.getItem("user_info")) {
      let user_info = JSON.parse(localStorage.getItem("user_info"));

      if (user_info["is_superadmin"] == true) {
        console.log("superadmin");
        this.getprojByOrgId = true;
        this.showprojDelete = true;
        this.GetPriorityByOrgID();
        this.contactForAdmin = true;
      } else if (
        user_info["is_admin"] == true &&
        user_info["is_superadmin"] == false
      ) {
        console.log("admin");
        this.getprojByOrgId = true;
        this.showprojDelete = false;
        this.GetPriorityByOrgID();
        this.contactForAdmin = true;
      } else if (
        user_info["is_admin"] == false &&
        user_info["is_superadmin"] == false
      ) {
        console.log("employee");
        this.getprojByOrgId = false;
        this.showprojDelete = false;

        this.FetchAllProjectByEmpID();
      }
    }
    this.FindAutoProjectPrefixByOrgID();
    //  let jobno= parseInt(this.jobNo)+parseInt('001');
    this.customerForm = new FormGroup({
      customer_Name: new FormControl(""),
      last_Name: new FormControl(""),
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
      cst_name: new FormControl(""),

      street_1: new FormControl(""),
      street_2: new FormControl(""),

      country: new FormControl(""),

      name: new FormControl(""),
      position: new FormControl(""),
      phone: new FormControl(""),
      mobile: new FormControl(""),
      email: new FormControl(""),
    });
    this.projectForm.valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      this.addformSubmitted = false;
      this.editformSubmitted = false;
    });
    if (this.projectForm.get("startDate").value != "") {
      this.disableEndDate = false;
    }
    this.projectForm.get("endDate").valueChanges.subscribe(() => {
      // fires when the input value has actually changed
      if (this.projectForm.get("endDate").value != "") {
        this.endValChange = true;
      } else {
        this.endValChange = false;
      }
    });
    this.projectForm.patchValue({
      accessControl: "is_public",
      prefixVal: "is_auto",
    });
    this.form = this.formBuilder.group({
      datepicker: [new Date(), Validators.required],
    });

    this.form.valueChanges.subscribe((value) => {});
    this.form.get("datepicker").valueChanges.subscribe((value) => {});
    if (sessionStorage.getItem("projectId")) {
      this.taskEdit(sessionStorage.getItem("projectId"));
    }
  }
  async fetchProjectsWithLocationVerification() {
    let data: any = await this.projectService
      .FetchProjectsWithLocationVerification()
      .toPromise();
    if (data) {
      console.log(data, "CHECK fetchProjectsWithLocationVerification");
      data.forEach((item) => {
        if (item.status == "Entity Location Not Verified") {
          this.unverifiedProjectlist.push(item);
        }
        if (item.status == "No Entity Location") {
          this.noLocationProjectList.push(item);
        }
        // if(item.closed_status===1){
        //   this.closedProjectList.push(item)
        // }
      });
      // this.projectCardList = data;
    }
  }
  handleShowData(type: string|null ) {
    console.log(type,"TYPE OF handleShowData");
    this.projectCardList = [];
    this.isLoading = true;

    if (type === null) {
      this.projectGrid.dataSource = this.projectData;
    } else {
      switch (type) {
        case "unverified":
          this.showClosedList = false;
          this.showNoLocationList = false;
          this.showOpenList = false;
          this.showUnverifiedList = !this.showUnverifiedList;

          this.projectGrid.dataSource = this.showUnverifiedList
            ? this.projectData.filter((item) =>
                this.unverifiedProjectlist.some(
                  (unverified) => unverified.project_id === item.project_id
                )
              )
            : this.projectData;
          break;

        case "nolocation":
          this.showClosedList = false;
          this.showUnverifiedList = false;
          this.showOpenList = false;
          this.showNoLocationList = !this.showNoLocationList;

          this.projectGrid.dataSource = this.showNoLocationList
            ? this.projectData.filter((item) =>
                this.noLocationProjectList.some(
                  (unverified) => unverified.project_id === item.project_id
                )
              )
            : this.projectData;
          break;

        case "closed":
          this.showUnverifiedList = false;
          this.showNoLocationList = false;
          this.showOpenList = false;
          this.showClosedList = !this.showClosedList;
          this.projectGrid.dataSource = this.showClosedList?this.closedProjectList:this.projectData
          break;

        case "open":
          this.showUnverifiedList = false;
          this.showNoLocationList = false;
          this.showClosedList = false;
          this.showOpenList = !this.showOpenList;
          console.log(this.openProjectList,"TEST")
          this.projectGrid.dataSource = this.showOpenList?this.openProjectList:this.projectData
          break;
      }
    }

    this.projectGrid.refresh();

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
// export interface ParentComponentApi {
//   callParentMethod: () => void

// }
