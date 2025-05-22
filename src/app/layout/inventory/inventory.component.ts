import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ToolbarItems, GridComponent } from "@syncfusion/ej2-angular-grids";
import * as _ from "lodash";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  SearchCountryField,
  TooltipLabel,
  CountryISO,
} from "ngx-intl-tel-input";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import cityList from "../cityList";
import { InventoryService } from "../../services/inventory.service";
import { CountryService } from "../../services/countryList.service";
import { settingsService } from "../../services/settings.service";
import { UserService } from "../../services/user.service";
import { TabComponent } from "@syncfusion/ej2-angular-navigations";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { ModuleSetupService } from "../../services/moduleSetup.service";
import { EmployeeService } from "../../services/employee.service";
import { publicDecrypt } from "crypto";
import { IntfutService } from "../../services/intfut.service";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";

declare var $: any;
@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
})
export class InventoryComponent implements OnInit {
  @ViewChild("tabObj", { static: false }) public tabObj: TabComponent;
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  @ViewChild("closingServGrid", { static: false })
  @ViewChild("Supplier_modal", { static: false })
  @ViewChild("bulkUploadModal", { static: false })
  @ViewChild("bulkDataModal", { static: false })
  supplierModal: ElementRef;
  public closingServGrid: GridComponent;
  
  inventoryListing = true;
  editEnable = false;
  addNewFeature = false;
  isItemDisabled = false;
  loadGridData = false;
  employeeGridToolItems: ToolbarItems[];
  public inventoryToolbar: string[] = ["Search", "ExcelExport", "PdfExport"];
  addInventoryTypeForm: FormGroup;
  vendorForm: FormGroup;
  addSupplierForm: FormGroup;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  selectedISO = CountryISO.UnitedArabEmirates;
  user = JSON.parse(localStorage.getItem("user_info"));
  commonFields: Object = { text: "value", value: "id" };
  organizationID = localStorage.getItem("org_id");
  allSelected = true;
  instockSelected = false;
  outofstockSelected = false;
  materialSubList;
  serviceMainCategory = [];
  servicePrimaryCategory = [];
  serviceSecondaryCategory = [];
  serviceCatList = [];
  showSubCategory1 = false;
  showSubCategory2 = false;
  intfutServices = [];
  showSupplierRatesModal = true;
  showAddNewSupplierModal = false;
  showSupplierRatesTable = true;
  approver1_role_name;
  approver2_role_name;
  approver1_roleId;
  approver2_roleId;
  dualApproval = false;
  selfApproverAssigned;
  serviceID;
  approverAssigned;
  stockStatus = "all";
  vendorCategoryDropDown;
  inventoryPlaceholder =
    "https://res.cloudinary.com/dzjsbplvh/image/upload/v1704793840/InventoryImages/2024-01-09_15040%20PM.webp";
  countryDataDropDown;
  dataForApproval = false;
  addTagDisable = true;
  currentEditItemId;
  selectedTab;
  supplierRatesArr = [];
  bulkUploadData = [];
  bulkUploadErr = [];
  cityDataDropDown = cityList;
  newValue: number | undefined;
  //userRights
  commonModuleName;
  currentModuleID;
  sum = 0;
  currentSection = "Add/Edit";
  accessToPage = false;
  selectedOption: string;

  public MaterialMainvalue: string = "Low Current Systems";
  vendorArr = [];
  tabData = [{ text: "All" }, { text: "In stock" }, { text: "Out of stock" }];
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
  vendorType = [
    {
      id: "Contractor",
      value: "Contractor",
    },
    {
      id: "Trader",
      value: "Trader",
    },
    {
      id: "Consultant",
      value: "Consultant",
    },
  ];
  staticUnitType = [
    {
      id: "54656",
      value: "kg",
    },
    {
      id: "654654",
      value: "cm",
    },
    {
      id: "654864",
      value: "mm",
    },
  ];
  InventoryUnitType = [];
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
  inventoryTags = [];
  filteredTags = [];
  inventoryData = [];
  filteredData = [];

  data$: Observable<any>;
  supplierRatesObser$: Observable<any>;
  featureTags$: Observable<any>;
  constructor(
    public Router: Router,
    private inventoryService: InventoryService,
    private formBuilder: FormBuilder,
    private settingsService: settingsService,
    public settingService: settingsService,
    private toast: ToastrService,
    private countries: CountryService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    public ModuleSetupService: ModuleSetupService,
    public empService: EmployeeService,
    public intfutService: IntfutService
  ) {}
  ngOnInit(): void {
    // this.fetchExistingClosingSteps();
    this.dataForApproval = false;
    this.addInventoryFormInputs();
    this.fetchInventoryItems();
    this.checkUserRights();
    this.getVendorData();
    this.GetEstimationServiceByOrgId();
    this.fetchData();
    this.vendorFormInputs();
    this.getCountryList();
    this.GetVendorCategoryTypesByOrgId();
    this.getInventoryUnitData();
    this.getInventoryTags();
    this.getAllIntfutServices();
    this.checkForApproval();

    this.employeeGridToolItems = ["Search"];
    console.log("NG ON INIT");
  }
  checkForApproval() {
    const notDataString = JSON.parse(localStorage.getItem("notData"));
    const inventory_id = localStorage.getItem("inventory_id");
    console.log(notDataString, "*********", inventory_id);
    if (
      (notDataString.message =
        "Requested Approval for adding Inventory Item && inventory_id!=null")
    ) {
      this.dataForApproval = true;
      let data = { inventory_id: inventory_id };
      this.editTmplt(data);
    }
  }
  approvalStatus(status) {}
  vendorFormInputs() {
    this.vendorForm = this.formBuilder.group({
      name: ["", Validators.required],
      type: ["", Validators.required],
      status: ["", Validators.required],
      category: ["", Validators.required],
      phone: ["", Validators.required],
      email: ["", [Validators.required]],
      address1: ["", Validators.required],
      address2: [""],
      city: ["", Validators.required],
      country: ["", Validators.required],
    });
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

  fetchInventoryItems() {
    this.loadGridData = true;
    this.inventoryData = [];
    let postData = { orgID: this.organizationID };
    this.inventoryService
      .GetInventoryByOrgId(postData)
      .subscribe((data: any) => {
        if (data !== null) {
          data.map((i) => {
            this.inventoryData.push({
              inventory_id: i.inventory_id,
              org_id: i.org_id,
              quantity: i.quantity,
              item_code: i.item_code,
              item_desc: i.item_desc,
              model_no: i.model_no,
              item_name: i.item_name,
              origin: i.origin,
              status: i.status,
              unit: i.unit,
              brand: i.brand,
              supp_name: i.supp_name,
              supp_rate: i.supp_rate,
              currency: i.currency,
              main_category: i.main_category,
              sub_category: i.sub_category,
              created_date: i.created_date,
              modified_date: i.modified_date,
              is_deleted: i.is_deleted,
              created_by: i.created_by,
              tag_name: i.tag_name,
              tag_id: i.tag_id,
              invImage: i.invImage,
              invDataSheet: i.invDataSheet,
            });
          });
          this.loadGridData = false;
          this.filteredData = this.inventoryData;
        }
      });
  }

  fetchData() {
    this.spinner.show();
    let postData = { orgID: this.organizationID };
    this.data$ = this.inventoryService.GetInventoryByOrgId(postData);
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
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
      console.log(this.commonModuleName, this.currentModuleID, "MODULES");
      //settings
      if (this.commonModuleName.Inventory) {
        this.accessToPage = true;
      } else {
        this.accessToPage = false;
      }
    });
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
  async editTmplt(data) {
    console.log(data, "HERE IS THE INV ID");
    this.spinner.show();
    let postData = { ID: data.inventory_id };
    this.currentEditItemId = data.inventory_id;
    this.addInventoryFormInputs();
    this.addTagDisable = false;
    this.showSubCategory1 = true;
    this.showSubCategory2 = false;
    let features;
    try {
      const inventoryData: any = await this.inventoryService
        .GetInventoryByItemId(postData)
        .toPromise();

      if (inventoryData) {
        if (
          inventoryData[0].main_category &&
          inventoryData[0].main_category !== null
        ) {
          this.servicePrimaryCategory = [];
          this.serviceSecondaryCategory = [];

          const primaryCategoryData: any = await this.settingService
            .GetServicePrimaryCategoryByMain(inventoryData[0].main_category)
            .toPromise();
          if (primaryCategoryData) {
            primaryCategoryData.forEach((i) => {
              this.servicePrimaryCategory.push({
                id: i.id,
                value: i.primaryCategoryName,
              });
            });
          }
          if (inventoryData[0].tag_id) {
            features = inventoryData[0].tag_id.split(", ");
          }
          if (
            inventoryData[0].primaryCategoryName &&
            inventoryData[0].primaryCategoryName !== null
          ) {
            this.showSubCategory2 = true;
            this.settingsService;
            const secondaryData: any = await this.settingService
              .GetServiceSubCategoryByMain(inventoryData[0].primaryCategoryName)
              .toPromise();
            if (secondaryData) {
              secondaryData.forEach((i) => {
                this.serviceSecondaryCategory.push({
                  id: i.id,
                  value: i.subCategoryName,
                });
              });
            }
          }
        }

        console.log(features, "OUR FEATURES");
        inventoryData.forEach((i) => {
          this.addInventoryTypeForm.patchValue({
            item_Code: i.item_code,
            model_No: i.model_no,
            itemName: i.item_name,
            brand: i.brand,
            itemDesc: i.item_desc,
            origin: i.origin,
            suppName: i.supp_name,
            suppRate: i.supp_rate,
            currency: i.currency,
            mainCategory: i.main_category,
            subCategory: i.sub_category,
            subCategory2: i.sub_catergory2,
            status: i.status,
            unit: i.unit,
            features: features,
            quantity: i.quantity,
            invImage: i.invImage,
            invDataSheet: i.invDataSheet,
          });
        });
        this.spinner.hide();

        console.log(
          this.addInventoryTypeForm.get("sub_category"),
          "END",
          this.servicePrimaryCategory
        );
      }
      const supplierData: any = await this.inventoryService
        .GetInventoryVendorData(postData)
        .toPromise();
      let tskList = this.addSupplierForm.get("taskList") as FormArray;
      tskList.clear();

      supplierData.map((i) => {
        tskList.push(
          this.formBuilder.group({
            SupplierName: i.supplier_id,
            SupplierRate: i.supplier_rate,
            SupplierCurrency: i.currency,
            CurrencyConversionRate: i.conversionRate,
            SupplierQuantity: i.quantity,
            IsDefaultPrice: i.is_default,
          })
        );
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

      console.log(
        this.addSupplierForm.get("taskList") as FormArray,
        "CHECKING FORM VALUE"
      );
    } catch (error) {
      console.error(error);
    }

    this.inventoryListing = false;
    this.editEnable = true;
  }
  generateUniqueItemCode(category, country) {
    const t = category.slice(0, 4); // Take only the first 4 characters of the category
    const c = country.slice(0, 3); // Take only the first 3 characters of the country code
    const r = Math.random().toString(36).substring(2, 8);
    return `${t}-${c}-${Date.now()}-${r}`;
  }

  saveInventoryType() {
    let inventoryFormVal = this.addInventoryTypeForm.value;
    console.log(inventoryFormVal.features, "CHECK FEATURES");
    console.log(this.supplierRatesArr, "CHECKING SUPPLIER");
    this.spinner.show();
    let reqObj = {};
    reqObj["org_id"] = this.organizationID;
    reqObj["item_code"] = this.generateUniqueItemCode(
      inventoryFormVal.mainCategory,
      inventoryFormVal.mainCategory
    );
    reqObj["model_no"] = inventoryFormVal.model_No;
    reqObj["item_name"] = inventoryFormVal.itemName;
    reqObj["item_desc"] = inventoryFormVal.itemDesc;
    reqObj["origin"] = inventoryFormVal.origin;
    reqObj["brand"] = inventoryFormVal.brand;
    reqObj["supp_name"] = inventoryFormVal.suppName;
    reqObj["supp_rate"] = inventoryFormVal.suppRate;
    reqObj["currency"] = inventoryFormVal.currency;
    reqObj["invImage"] = inventoryFormVal.invImage;
    reqObj["invDataSheet"] = inventoryFormVal.invDataSheet;
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
    this.addInventoryTypeForm.reset();
    console.log(this.editEnable, "EDIT CHECK");
    if (!this.editEnable) {
      this.inventoryService.AddInventoryItem(reqObj).subscribe((data: any) => {
        if (data.status === "200") {
          // this.GetAllPrefixByOrgID();
          // this.closeAddEditListing();
          this.spinner.hide();
          this.supplierRatesArr = [];
          this.addSupplierForm.reset();
          this.addInventoryTypeForm.reset();
          this.fetchInventoryItems();
          this.selectedTab = 0;
          this.toast.success("New Inventory Item Added");
        } else {
          this.toast.error("Something went wrong");
        }
      });
    } else {
      reqObj["id"] = this.currentEditItemId;
      this.inventoryService
        .UpdateInventoryItemByID(reqObj)
        .subscribe((data: any) => {
          if (data.status === "200") {
            // this.GetAllPrefixByOrgID();
            // this.closeAddEditListing();
            this.toast.success("Item Updated Successfully");
            this.editEnable = false;
            this.fetchInventoryItems();
            this.fetchData();
            this.inventoryListing = true;
          } else {
            this.toast.error("Something went wrong");
          }
        });
    }
  }
  deleteInventoryItem(data) {
    console.log(data, "CHECKING DATA");
    Swal.fire({
      title: "Delete this Unit - " + data.item_name + " ?",
      text: "Please Note you won't be able to revert this",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        let postData = {
          id: data.inventory_id,
        };
        this.spinner.show();
        this.inventoryService
          .DeleteInventoryByItemId(postData)
          .subscribe((data: any) => {
            if (data.status === "200") {
              this.toast.success("Item Deleted Successfully");
              this.fetchInventoryItems();
              this.spinner.hide();
              this.selectedTab = 0;
            } else {
              this.toast.error("Something went wrong");
            }
          });
      }
    });
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
    // console.log(this.vendorArr,"**************")
  }
  getInventoryTags() {
    this.inventoryService.GetInventoryTagByOrgId().subscribe((data: any) => {
      if (data) {
        this.inventoryTags = [];
        data.map((i: any) => {
          this.inventoryTags.push({
            id: i.id,
            value: i.tag,
            system_category: i.system_category,
          });
        });
        if (this.serviceID != null) {
          this.handleInventoryTag(this.serviceID);
        } else {
          this.filteredTags = [];
          this.filteredTags = this.inventoryTags;
        }
        console.log(this.filteredTags, "CHECKING INV TAG");
      }
    });
  }
  addSupplier() {
    this.showSupplierRatesTable = false;
    if (this.taskList.length == 0) {
      this.addNewTask();
    }
    $("#Supplier_modal").modal("show");
  }
  addnewSupplier() {
    this.showSupplierRatesModal = false;
    this.showAddNewSupplierModal = true;
  }
  backToAddSupplierRates() {
    this.showSupplierRatesModal = true;
    this.showAddNewSupplierModal = false;
    // this.showSupplierRatesTable = false;
  }
  closeModal() {
    $("#Supplier_modal").modal("hide");
    this.showSupplierRatesTable = true;
  }
  saveSupplierRates() {
    let supplierRates = this.addSupplierForm.value;
    console.log(supplierRates, "SUPPLIER RATES");
    if (supplierRates.taskList) {
      const isDefaultChecker = supplierRates.taskList.filter(
        (i) => i.IsDefaultPrice
      );
      if (isDefaultChecker.length > 1) {
        this.toast.error(
          "Multiple default supplier selected. Please choose only one."
        );
      } else if (isDefaultChecker.length == 0) {
        this.toast.error("Please select atleast one supplier as default!");
      } else {
        supplierRates.taskList.map((data) => {
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
                  (i.quantity = data.SupplierQuantity),
                  (i.is_default = data.IsDefaultPrice)
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
              is_default: data.IsDefaultPrice,
            });
          }
          this.sum = supplierRates.taskList.reduce(
            (accumulator, currentValue) => {
              return accumulator + parseInt(currentValue.SupplierQuantity);
            },
            0
          );
        });
        this.showSupplierRatesTable = true;
        this.closeModal();
      }
      this.toast.success("Supplier added successfully!");

      console.log(this.sum, "sum of quantites");
      this.addInventoryTypeForm.get("quantity").patchValue(this.sum);
      console.log(supplierRates, "SUPPLIER RATES");
      console.log(this.supplierRatesArr, "this.supplierRatesArr");
    }
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
      case "AED":
        convertedRate = (supplierRate * 1).toFixed(2);
        break;
      default:
        convertedRate = "Invalid currency code";
        break;
    }
    console.log(convertedRate, "CONVERTED RATE");
    return convertedRate;
  }

  handleStock(e) {
    console.log(e, "EVENT TAB");
    this.selectedTab = e.index;
    let id = this.tabData[e.index].text;
    switch (id) {
      case "All":
        this.fetchInventoryItems();
        console.log(this.filteredData, "ALL");
        break;
      case "In stock":
        this.filteredData = this.inventoryData.filter(
          (i) => parseInt(i.quantity) > 0
        );
        console.log(this.filteredData, "IN STOCK");
        break;
      case "Out of stock":
        this.filteredData = this.inventoryData.filter(
          (i) =>
            parseInt(i.quantity) == 0 || i.quantity == "" || i.quantity == null
        );
        console.log(this.filteredData, "OUT OF STOCK");
        break;
    }
  }
  selectRadioOption(option) {
    this.selectedOption = option;
    console.log(option, "OPTION CHECK");
  }
  addInventoryFormInputs() {
    this.addInventoryTypeForm = this.formBuilder.group({
      item_Code: [""],
      model_No: [""],
      itemName: [""],
      itemDesc: [""],
      origin: [""],
      suppName: [""],
      suppRate: [""],
      currency: [""],
      mainCategory: [""],
      subCategory: [""],
      subCategory2: [""],
      brand: [""],
      features: [""],
      newFeature: [""],
      status: [""],
      unit: [""],
      quantity: [""],
      invImage: [""],
      invDataSheet: [""],
    });
    this.addSupplierForm = this.formBuilder.group({
      taskList: this.formBuilder.array([], [Validators.required]),
    });
  }
  addTaskListFrmInput() {
    return this.formBuilder.group({
      SupplierName: ["", [Validators.required]],
      SupplierRate: [""],
      SupplierCurrency: [""],
      CurrencyConversionRate: [""],
      SupplierQuantity: [""],
      IsDefaultPrice: [false],
    });
  }

  addNewTask() {
    let newMem = this.addTaskListFrmInput();
    this.taskList.push(newMem);
  }

  deleteTaskRow(i: number) {
    // if(this.editMdSelected) {

    //     let tskList = this.addBuildingTypeFrm.get('taskList') as FormArray;

    //     console.log(tskList.value[i]);
    //     this.deletedTsk.push({...tskList.value[i],  isDeleted:true });
    //     this.taskList.removeAt(i);

    // }else {
    this.taskList.removeAt(i);
    // }
  }

  get taskList(): FormArray {
    return this.addSupplierForm.get("taskList") as FormArray;
  }
  addInventoryType() {
    this.inventoryListing = false;
    this.showSupplierRatesTable = true;
    console.log(this.addTagDisable, "CHECKING ADD TABLE DISABLE");
    // console.log(this.serviceCatList, "SERVICE CATEGORY LISTINGS !!!!!!");
  }

  serviceSearchKeyUp(): void {
    document
      .getElementById(this.closingServGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.closingServGrid.search((event.target as HTMLInputElement).value);
      });
  }

  backToProject() {
    this.Router.navigate(["/dashboard-user"]);
  }
  backToInventory() {
    this.inventoryListing = true;
    this.showSubCategory2 = false;
    this.addTagDisable = true;
    this.editEnable = false;
    this.dataForApproval = false;
    this.supplierRatesArr = [];
    this.addSupplierForm.reset();
    this.addInventoryTypeForm.reset();
    console.log(this.filteredData, "CHECKING DATA");
    // this.allSelected=true;
    // this.filteredData=this.inventoryData;
    // this.instockSelected=false;
    // this.outofstockSelected=false;
  }
  handleInventoryTag(e) {
    this.filteredTags = [];
    this.filteredTags = this.inventoryTags.filter(
      (i) => i.system_category == e
    );
    console.log(this.inventoryTags, this.filteredTags, "CHECKIN TAGS");
  }
  handleMainCategory(e) {
    this.showSubCategory2 = false;
    this.showSubCategory1 = true;
    this.addTagDisable = false;
    console.log(this.addTagDisable, "CHECKING VALUE");
    this.handleInventoryTag(e.value);

    if (e.value != null) {
      this.serviceID = e.value;
      this.servicePrimaryCategory = [];
      this.serviceSecondaryCategory = [];
      this.settingService
        .GetServicePrimaryCategoryByMain(this.serviceID)
        .subscribe((data: any) => {
          if (data) {
            data.map((i) => {
              this.servicePrimaryCategory.push({
                id: i.id,
                value: i.primaryCategoryName,
              });
            });
          }
        });
    }
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
        console.log(this.serviceMainCategory, "SERVICE MAIN CATEGORY");
      });
  }
  GetSecondaryServiceByServiceId(service) {
    this.settingService
      .GetServicePrimaryCategoryByMain(service.id)
      .subscribe((data: any) => {
        if (data) {
          data.map((i) => {
            this.servicePrimaryCategory.push({
              id: i.id,
              value: i.primaryCategoryName,
            });
            let secondaryServiceId = i.id;
            this.serviceSecondaryCategory = [];
            this.settingsService
              .GetServiceSubCategoryByMain(secondaryServiceId)
              .subscribe((data: any) => {
                this.serviceCatList.push({
                  id: i.id,
                  name: i.primaryCategoryName,
                  value: data,
                  service: service.value,
                  serviceId: service.id,
                });
              });
          });
        }
      });
    console.log(this.serviceCatList, "SERVICE CAT LIST");
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
  getCountryList() {
    this.countries.getCountryList().subscribe((data: any) => {
      let results = [];
      data.map((elm) => {
        results.push({
          id: elm.id,
          value: elm.name,
        });
      });
      this.countryDataDropDown = results;
      //   this.addContactForm.patchValue({
      //     Relationship: 'Owner',
      //     Country: 224,
      //   });
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
    console.log(this.commonTags, "COMMON TAGS CHECK");
    // this.cdr.detectChanges()
    this.addInventoryTypeForm.get("newFeature").patchValue("");
  }
  handleStatusChange(event) {
    let status = event.itemData;
    status.value && status.value != null && status.value == "Discontinued"
      ? (this.isItemDisabled = true)
      : (this.isItemDisabled = false);
  }

  uploadInventoryImages(event, i) {
    console.log(event, "EVENT");
    console.log(i, "i");
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD
      const formattedTime = currentDate.toLocaleTimeString().replace(/:/g, ""); // Format as HHMMSS
      const uniqueKey = `${formattedDate}_${formattedTime}`;
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "InventoryImages");
      data.append("cloud_name", "dzjsbplvh");
      data.append("public_id", uniqueKey);
      this.inventoryService.uploadInventory(data).subscribe((imData) => {
        // this.venDocument.at(i).patchValue({
        //   documentUrl: imData.secure_url
        // });
        // this.spinner.hide();
        if (imData.secure_url) {
          this.addInventoryTypeForm
            .get("invImage")
            .patchValue(imData.secure_url);
        }
        this.spinner.hide();
        console.log(this.addInventoryTypeForm.get("invImage").value, "CHECK!@");
        console.log(imData, "CHECK!");
      });
      // console.log(this.addInventoryTypeForm.get("invImage").value,"CHECK!@")
    }
  }
  uploadInventoryDataSheet(event, i) {
    console.log(event, "EVENT");
    console.log(i, "i");
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD
      const formattedTime = currentDate.toLocaleTimeString().replace(/:/g, ""); // Format as HHMMSS
      const uniqueKey = `${formattedDate}_${formattedTime}`;
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "InventoryDataSheet");
      data.append("cloud_name", "dzjsbplvh");
      data.append("public_id", uniqueKey);
      this.inventoryService.uploadInventory(data).subscribe((imData) => {
        if (imData.secure_url) {
          this.addInventoryTypeForm
            .get("invDataSheet")
            .patchValue(imData.secure_url);
        }
        this.spinner.hide();
        console.log(this.addInventoryTypeForm.get("invImage").value, "CHECK!@");
        console.log(imData, "CHECK!");
      });
    }
  }
  goToLink(url: string) {
    console.log(url, "CALLED GOTO LINK");
    window.open(url, "_blank");
  }
  enlargeImage(url) {
    console.log(url, "URL");
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
  handleBulkUpload() {
    $("#bulkUploadModal").modal("show");
  }
  trimSpacesFromKeysAndValues(obj) {
    const trimmedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const trimmedKey = key.trim();
        const trimmedValue =
          typeof obj[key] === "string" ? obj[key].trim() : obj[key];
        trimmedObj[trimmedKey] = trimmedValue;
      }
    }
    return trimmedObj;
  }

  async onBulkUpload(event: any) {
    try {
      const file: File = event.target.files[0];
      if (file) {
        const csvdt = new FormData();
        csvdt.append("file", file);
        this.spinner.show();
        $("#bulkUploadModal").modal("hide");
  
        const resp: any = await this.empService.getJsonFromCsv(csvdt).toPromise();
        
        if (resp) {
          this.bulkUploadData = [];
          this.bulkUploadErr = [];
          
          if (resp.message.length > 0) {
            const intfutServicesMap = new Map();
            this.intfutServices.forEach((pc) => {
              const key = `${pc.mainCategoryName.trim()}-${pc.primaryCategoryName.trim()}-${pc.subCategoryName.trim()}`;
              intfutServicesMap.set(key, {
                primaryCategoryId: pc.primaryCategoryId.trim(),
                mainCategoryId: pc.mainCategoryId.trim(),
                subCategoryId: pc.subCategoryId.trim(),
              });
            });
  
            resp.message.forEach((bulkData) => {
              const cleanedBulkData: any = this.trimSpacesFromKeysAndValues(bulkData);
              const key = `${cleanedBulkData.main_category}-${cleanedBulkData.primary_category}-${cleanedBulkData.sub_category}`;
  
              if (intfutServicesMap.has(key)) {
                const matchedData = intfutServicesMap.get(key);
                cleanedBulkData.main_category = matchedData.mainCategoryId;
                cleanedBulkData.primary_category = matchedData.primaryCategoryId;
                cleanedBulkData.sub_category = matchedData.subCategoryId;
                this.bulkUploadData.push(cleanedBulkData);
              } else {
                this.bulkUploadErr.push(cleanedBulkData);
              }
            });
  
            setTimeout(() => {
              this.spinner.hide();
              $("#bulkDataModal").modal("show");
            }, 1000);
          } else {
            this.toast.error("Something went wrong");
            this.spinner.hide();
          }
        }
      }
    } catch (error) {
      this.toast.error("An error occurred during the file upload process.");
      this.spinner.hide();
    }
  }
  
  validateBulkUpload() {
    if (this.bulkUploadErr.length > 0) {
      Swal.fire({
        title: "Continue Uploading the remaining data ?",
        text: "Please Note you won't be able to revert this",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: " Confirm",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.value === true) {
          this.continueBulkUpload();
        }
      });
    } else {
      this.continueBulkUpload();
    }
  }

  continueBulkUpload() {
    this.spinner.show();
    try {
      let reqObj = {};
      reqObj["org_id"] = this.organizationID;
      reqObj["created_by"] = this.user["full_name"];
      reqObj["approver1_roleId"] = this.approver1_roleId;
      reqObj["approver2_roleId"] = this.dualApproval
        ? this.approver2_roleId
        : null;
      reqObj["approver1_notes"] = "";
      reqObj["approver2_notes"] = "";
      reqObj["is_approved_empId1"] = false;
      reqObj["is_approved_empId2"] = false;
      reqObj["inv_bulk"] = this.bulkUploadData;
      this.inventoryService
        .AddInventoryBulkItems(reqObj)
        .subscribe((res: any) => {
          if (res.status === "200") {
            console.log(res, "RES");
            this.closebulkDataModal();
            this.spinner.hide();
            this.fetchInventoryItems();
            this.selectedTab = 0;
            this.toast.success("Data Added Successfully");
          }
        });
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    } catch {
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }
  }

  async onCreateTemplate() {
    try {
      console.log("ON TEMPLATE");
      this.spinner.show();
      $("#bulkUploadModal").modal("hide");
  
      const data: any = await this.inventoryService.createInvTemplate({}).toPromise();
      window.open("https://circles-pro-backend.onrender.com/inventoryTemplate.xlsx", "_blank");
    } catch (err) {
      console.error(err);
    } finally {
      $("#bulkUploadModal").modal("hide");
      this.spinner.hide();
    }
  }
  

  closeBulkUpload() {
    $("#bulkUploadModal").modal("hide");
  }
  getAllIntfutServices() {
    console.log("CALLED API");
    this.intfutService.GetIntfutServicesByOrgId().subscribe((data: any) => {
      if (data && data.length > 0) {
        this.intfutServices = data;
      }
    });
  }
  closebulkDataModal() {
    $("#bulkDataModal").modal("hide");
  }
  inventoryBreakGridDownload(args: ClickEventArgs) {
    switch (args.item.text) {
      case "PDF Export":
        this.closingServGrid.pdfExport();
        break;
      case "Excel Export":
        this.closingServGrid.excelExport();
        break;
      case "CSV Export":
        this.closingServGrid.csvExport();
        break;
    }
  }

}
