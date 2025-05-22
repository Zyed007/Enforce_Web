import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ToolbarItems, GridComponent } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "../../../../services/inventory.service";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
import { settingsService } from "../../../../services/settings.service";
import { MatAccordion } from "@angular/material";
import { IntfutService } from "../../../../services/intfut.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
@Component({
  selector: "intfut-service-templates",
  templateUrl: "./intfut-service-templates.html",
  styleUrls: ["./intfut-service-templates.scss"],
})
export class IntfutServiceTemplates implements OnInit {
  userInfo: any = JSON.parse(localStorage.getItem("user_info"));
  orgID =
    this.userInfo.org_id !== null
      ? this.userInfo.org_id
      : localStorage.getItem("org_id");
  @ViewChild("serviceGrid", { static: false })
  public serviceGrid: GridComponent;
  @ViewChild("serviceSelectionModal", { static: false })
  @ViewChild("InvSelectionModal", { static: false })
  InvSelectionModal: any;
  @ViewChild("accordion", { static: true }) Accordion: MatAccordion;
  employeeGridToolItems: ToolbarItems[];
  public inventoryToolbar: string[] = ["Search"];
  extraUnitForm: FormGroup;
  addSupplierForm: FormGroup;
  addInventoryTypeForm: FormGroup;
  templateForm: FormGroup;
  inventorySelector: FormGroup;
  addRelatedItemForm: FormGroup;
  templateListing = true;
  isFullInventory = false;
  showSupplierRatesModal = true;
  showAddNewSupplierModal = false;
  showSupplierRatesTable = false;
  showSummaryTable = true;
  addInventory = true;
  editEnable = false;
  sum = 0;
  templateListingData$;
  invselectedRowIndex = 0;
  supselectedRowIndex = 0;
  masterPrimaryCat = "";
  masterSecondaryCat = "";
  masterIndex = 0;
  // templateListingData = [];
  serviceMainCategory = [];
  serviceSecondaryCategory = [];
  allServicesFiltered = [];
  servicePrimaryCategory = [];
  InventoryUnitType = [];
  inventoryTags = [];
  filteredTags = [];
  inventoryData = [];
  allServicesArr = [];
  filteredData = [];
  selectedInvData = [];
  vendorArr = [];
  supplierRatesArr = [];
  existingInventory = [];
  editTemplateData = [];
  templateUnitStack = [];
  summaryDataIndex = 0;
  selectedMainCategory = "";
  selectedPrimaryCategory = "";
  editTemplateId = "";
  SerCatId: any;
  selectedInventoryType: string = "New";
  commonFields: Object = { id: "id", value: "value" };
  commonAllSerFields: Object = { text: "value", value: "id" };
  organizationID = localStorage.getItem("org_id");
  user = JSON.parse(localStorage.getItem("user_info"));
  constructor(
    public Router: Router,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public inventoryService: InventoryService,
    private spinner: NgxSpinnerService,
    private settingService: settingsService,
    private intfutService: IntfutService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.GetEstimationServiceByOrgId();
    this.extraUnitForm = this.formBuilder.group({
      extras: this.formBuilder.array([]),
    });
    this.addInventoryFormInputs();
    this.templateFormInputs();
    this.addRelatedItemFormInputs();
    this.GetServiceEstimationTemplates();
    this.getIntFutServices();
    this.spinner.show();
  }
  // async GetServiceEstimationTemplates() {
  //     try {
  //         // Make the API call and wait for the response
  //         const listings: any = await this.intfutService.GetServiceEstimationTemplateByOrgId().toPromise();
  //         console.log(listings," data found.");
  //         // Transform the data and push it into templateListingData
  //         if (listings && listings.length > 0) {
  //             listings.forEach((i: any) => {
  //                 this.templateListingData.push({
  //                     createdDate: i.created_date,
  //                     templateName: i.name,
  //                     serviceName: i.mainCategory,
  //                     createdBy: i.created_by
  //                 });
  //             });
  //         } else {
  //             console.log("No data found.");
  //         }
  //     } catch (error) {
  //         console.error("Error fetching data:", error);
  //         // Handle the error as needed
  //     } finally {
  //         // Hide the spinner after the API call, whether successful or not
  //         this.spinner.hide();
  //     }
  // }
  GetServiceEstimationTemplates() {
    // Assuming GetServiceEstimationTemplateByOrgId returns an Observable
    this.templateListingData$ =
      this.intfutService.GetServiceEstimationTemplateByOrgId();

    this.templateListingData$.subscribe(
      (listings) => {
        if (listings && listings.length > 0) {
        } else {
          console.log("No data found.");
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      },
      () => {
        this.spinner.hide();
      }
    );
  }
  private createTemplateFormGroup(): FormGroup {
    return new FormGroup({
      secondaryCategoryName: new FormControl(""),
      inventory_id: new FormControl(""),
      inventory_type: new FormControl(""),
      inventory_name: new FormControl(""),
      inventory_brand: new FormControl(""),
      related_items: new FormArray([]),
    });
  }

  templateFormInputs() {
    this.templateForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      mainCategory: ["", Validators.required],
    });
  }
  backToEstimation() {
    this.Router.navigate(["settings-new/estimation"]);
  }
  addServiceTemplate() {
    this.spinner.show();
    this.templateListing = false;
    this.templateForm.reset();
    this.extraUnitForm.reset();
    this.addInventoryTypeForm.reset();
    this.addSupplierForm.reset();
    this.templateUnitStack = [];
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
  closeAddServiceTemplate() {
    this.spinner.show();
    this.templateListing = true;
    this.editEnable = false;
    this.templateForm.reset();
    this.extraUnitForm.reset();
    this.addInventoryTypeForm.reset();
    this.addSupplierForm.reset();
    this.templateUnitStack = [];
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
  serviceSearchKeyUp(): void {
    document
      .getElementById(this.serviceGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.serviceGrid.search((event.target as HTMLInputElement).value);
      });
  }
  async GetEstimationServiceByOrgId() {
    this.serviceMainCategory = [];

    try {
      const data: any = await this.settingService
        .GetServiceMainCategorybyOrgId()
        .toPromise();
      data.map((i) => {
        this.serviceMainCategory.push({
          id: i.id,
          value: i.serviceCategoryName,
        });
      });
      console.log(this.serviceMainCategory, "SERVICE MAIN CATEGORY");
    } catch (error) {
      console.error(
        "An error occurred while fetching service main categories:",
        error
      );
      this.toast.error(
        "Failed to load service main categories. Please try again later."
      );
    }
  }

  // handleServiceSelection() {
  //     $("#serviceSelectionModal").modal("show");
  // }

  handleMainCategorySelection(e) {
    console.log(e.isInteracted);
    if (e.itemData.id !== null && e.isInteracted) {
      // this.spinner.show()
      this.selectedMainCategory = e.itemData.id;
      // this.addServiceTemplate()
      this.handlePrimaryCategory(e.isInteracted);
    }
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
  async getIntFutServices() {
    try {
      let flatData: any = await this.intfutService
        .GetIntfutServicesByOrgId()
        .toPromise();
      if (flatData && flatData.length > 0) {
        this.allServicesArr = flatData;
      }
    } catch (error) {}
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
            resolve(); // Resolve the promise when the asynchronous operation is complete
          },
          (error) => {
            reject(error); // Reject the promise if there is an error
          }
        );
      } else {
        resolve(); // Resolve the promise immediately if e is null
      }
    });
  }

  async updateDropDownVals(value, id) {
    await this.handleSecondaryCategory(id);
    this.selectedPrimaryCategory = id;
    // this.AddExtraUnitDesc()
    const emails = this.extraUnitForm.get("extras") as FormArray;
    // emails.insert(0, this.createTemplateFormGroup());
    this.extraUnitForm.reset();
    const tempStackVal = this.templateUnitStack
      .filter((i) => i.id == value)
      .map((i) => i.value);
    emails.clear();
    console.log(tempStackVal, "TEST");
    if (tempStackVal.length > 0) {
      // this.myForm.patchValue(tempStackVal)
      tempStackVal[0].map((i) => {
        let extraItem = this.createTemplateFormGroup();
        extraItem.patchValue({
          secondaryCategoryName: i.secondaryCategoryName,
          inventory_type: i.inventory_type,
          inventory_name: i.inventory_name,
          inventory_brand: i.inventory_brand,
          inventory_id: i.inventory_id,
        });
        console.log(i, "CHECKING I");
        if (i.related_items && i.related_items.length > 0) {
          const relatedItems = extraItem.get("related_items") as FormArray;
          i.related_items.forEach((item) => {
            let related_item = this.createRelatedItemFormGroup();
            related_item.patchValue(item);
            relatedItems.push(related_item);
          });
        }
        emails.push(extraItem);
      });
    } else {
      emails.insert(0, this.createTemplateFormGroup());
      // console.log("THERE IS NO DATA TO BE PATCHED!")
    }
    console.log(emails, "emails Check");
  }
  public AddExtraUnitDesc(index: number) {
    const extras = this.extraUnitForm.get("extras") as FormArray;
    extras.insert(index + 1, this.createTemplateFormGroup());
  }
  get relatedItems(): FormArray {
    return this.addRelatedItemForm.get("relatedItems") as FormArray;
  }
  addRelatedItemFormInputs() {
    this.addRelatedItemForm = this.formBuilder.group({
      relatedItems: this.formBuilder.array([], [Validators.required]),
    });
  }
  public OpenRelatedItemsModal(index: number, primary_category: string) {
    console.log(index, primary_category, "primary_category");
    this.masterPrimaryCat = "";
    this.masterSecondaryCat = "";
    this.masterIndex = index;
    this.addRelatedItemForm.reset();
    this.relatedItems.clear();
    const extras = this.extraUnitForm.get("extras") as FormArray;
    const selectedExtraValue = extras.at(index).value;
    console.log(extras, selectedExtraValue, "extras");

    if (selectedExtraValue.secondaryCategoryName != "") {
      this.masterPrimaryCat = primary_category;
      this.masterSecondaryCat = selectedExtraValue.secondaryCategoryName;
      let services = this.allServicesArr.filter(
        (i) => i.mainCategoryId == this.selectedMainCategory
      );
      console.log(services, "services");
      if (services && services.length > 0) {
        services.forEach((i) => {
          this.allServicesFiltered.push({
            id: i.subCategoryId,
            value: i.subCategoryName,
            primaryCat:i.primaryCategoryName
          });
        });
      }
      if (
        selectedExtraValue.related_items &&
        selectedExtraValue.related_items.length > 0
      ) {
        selectedExtraValue.related_items.forEach((i) => {
          let relatedItem = this.createRelatedItemFormGroup();
          relatedItem.patchValue(i);
          this.relatedItems.push(relatedItem);
        });
      } else {
        let relatedItem = this.createRelatedItemFormGroup();
        relatedItem.patchValue({
          masterSecondaryCat: this.masterSecondaryCat,
          masterPrimaryCat: this.masterPrimaryCat,
        });
        this.relatedItems.push(relatedItem);
      }
      $("#Add_RelativeItem_modal").modal("show");
    } else {
      this.toast.error("Please select a category first");
    }
  }
  saveRelatedItems() {
    const extras = this.extraUnitForm.get("extras") as FormArray;
    const selectedExtraGroup = extras.at(this.masterIndex) as FormGroup;
    const relatedItems = selectedExtraGroup.get("related_items") as FormArray;

    relatedItems.clear();

    const relatedItemsValues = this.relatedItems.value;
    relatedItemsValues.forEach((item) => {
      let related_item = this.createRelatedItemFormGroup();
      related_item.patchValue(item);
      relatedItems.push(related_item);
    });
    
    $("#Add_RelativeItem_modal").modal("hide");
    this.toast.success("Rule Added Successfully")
    console.log(this.extraUnitForm.getRawValue(), "*******");
  }

  deleteRelatedItems(i: number) {
    this.relatedItems.removeAt(i);
  }
  closeRelativeItemModel() {
    $("#Add_RelativeItem_modal").modal("hide");
  }

  AddRelatedItems() {
    let relatedItem = this.createRelatedItemFormGroup();
    relatedItem.patchValue({
      masterSecondaryCat: this.masterSecondaryCat,
      masterPrimaryCat: this.masterPrimaryCat,
    });

    this.relatedItems.push(relatedItem);
    console.log(this.relatedItems, "this.relatedItems");
  }
  // In your component.ts
  getRelatedItems(index: number) {
    const extras = this.extraUnitForm.get("extras") as FormArray;
    const extraGroup = extras.at(index) as FormGroup;
    const relatedItems = extraGroup.get("related_items") as FormArray;
    return relatedItems;
  }

  private createRelatedItemFormGroup(): FormGroup {
    return new FormGroup({
      related_item_name: new FormControl(""),
      related_item_id: new FormControl(""),
      primary_item_id: new FormControl(""),
      masterPrimaryCat: new FormControl(""),
      masterSecondaryCat: new FormControl(""),
      rule: new FormControl(""),
    });
  }

  SaveForm() {
    const emails = this.extraUnitForm.get("extras") as FormArray;
    console.log(emails, "TEST!");
  }
  removeItem(i: number): void {
    // Get the FormArray and remove the item at the specified index
    const itemsFormArray = this.extraUnitForm.get("extras") as FormArray;
    itemsFormArray.removeAt(i);
  }

  //Inventory Related
  openCustomModal() {
    // document.getElementById('customModal').style.display = 'block';
    this.modalService.open(this.InvSelectionModal, { size: "lg" });
  }

  closeCustomModal() {
    // document.getElementById('customModal').style.display = 'none';
    this.modalService.dismissAll();
    this.invselectedRowIndex = null;
    this.supselectedRowIndex = null;
  }
  async handleInvItemtype(e: any, ind: any) {
    console.log(e, ind, "INV CHANGE TRIGGERED!!!");

    if (e) {
      this.showSummaryTable = false;
      this.spinner.show();
      this.selectedInventoryType = e;
      this.invselectedRowIndex = null;
      this.supselectedRowIndex = null;
      this.isFullInventory = false;
      let currentData = this.extraUnitForm.getRawValue();
      console.log(currentData, ind, "CHECKING currentData");

      const commonOperations = async () => {
        console.log("commonOperations!!!");
        await this.GetEstimationServiceByOrgId();
        await this.getInventoryUnitData();
        await this.getVendorData();

        if (
          this.selectedMainCategory != null &&
          this.selectedMainCategory !== ""
        ) {
          await this.getInventoryTags();
          this.addInventoryTypeForm.patchValue({
            mainCategory: this.selectedMainCategory,
            subCategory: this.selectedPrimaryCategory,
          });
        }
      };

      try {
        if (e === "New" || e === "Provisional") {
          await commonOperations();
          this.showSupplierRatesTable = true;
          this.supplierRatesArr = [];
        } else if (e === "Existing") {
          const data = currentData.extras[this.summaryDataIndex];
          this.inventoryData = [];
          this.supplierRatesArr = [];

          if (
            this.selectedMainCategory != null &&
            this.selectedMainCategory !== ""
          ) {
            const postData = {
              org_id: localStorage.getItem("org_id"),
              main_category: this.selectedMainCategory,
              primary_category: this.selectedPrimaryCategory,
              secondary_category: data.secondaryCategoryName,
            };

            const invData: any = await this.inventoryService
              .GetInventoryByCategory(postData)
              .toPromise();

            if (invData && invData.length > 0) {
              this.inventoryData = invData;
              let existingIndex = null;

              if (data.inventory_id != null && data.inventory_id != "") {
                existingIndex = this.inventoryData.findIndex(
                  (i) => i.id == data.inventory_id
                );
              }

              if (existingIndex != null && existingIndex !== "") {
                this.invselectedRowIndex =
                  existingIndex === 0 ? existingIndex : 0;
                this.invselectedRowIndex = existingIndex;
              }
            }
            if (ind !== null && ind !== "" && ind !== undefined) {
              this.summaryDataIndex = ind;
              this.spinner.hide();
              this.openCustomModal();
            }
          }
        } else {
          console.log("Please select a valid Inventory Type");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        this.spinner.hide();
        this.toast.error(
          "An error occurred while processing the inventory type. Please try again."
        );
      }
    }
  }

  async getInventoryUnitData() {
    try {
      const data: any = await this.inventoryService
        .GetInventoryUnitByOrgId()
        .toPromise();
      if (data && data.length > 0) {
        this.InventoryUnitType = data.map((i) => ({
          id: i.id,
          value: i.unit,
        }));
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching inventory unit data:",
        error
      );
      this.toast.error(
        "Failed to load inventory unit data. Please try again later."
      );
    }
  }

  async getVendorData() {
    this.vendorArr = [];
    try {
      const data: any = await this.settingService
        .GetCommissionVendors()
        .toPromise();
      this.vendorArr = data.map((item) => ({
        id: item.id,
        value: item.name,
      }));
    } catch (error) {
      console.error("An error occurred while fetching vendor data:", error);
      this.toast.error("Failed to load vendor data. Please try again later.");
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

  async getInventoryTags() {
    try {
      const data: any = await this.inventoryService
        .GetInventoryTagByOrgId()
        .toPromise();
      if (data) {
        this.inventoryTags = [];

        const tags = this.SerCatId
          ? data.filter((i) => i.system_category === this.SerCatId)
          : data;

        this.inventoryTags = tags.map((i: any) => ({
          id: i.id,
          value: i.tag,
          system_category: i.system_category,
        }));
      }
    } catch (error) {
      console.error("An error occurred while fetching inventory tags:", error);
      this.toast.error(
        "Failed to load inventory tags. Please try again later."
      );
    }
  }

  addTaskListFrmInput() {
    // console.log(`Function called ${this.callCounter} times`);
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
      unitPrice: [""],
      totalPrice: [""],
      discount: [""],
      finalPrice: [""],
      currency: [""],
      discountType: ["value"],
    });
  }

  onExistingSelected(e) {
    console.log(e, "EVENT SELECTED");
    this.supplierRatesArr = [];
    this.selectedInvData = [];
    this.showSupplierRatesTable = false;
    let data = e.data;
    // The entire data of the selected row
    // this.invselectedRowIndex = e.rowIndex;
    // this.inventorySelector.get('selectedRow').setValue(data.id);
    // console.log(this.inventorySelector.get('selectedRow').value, "CHECK")
    if (data && data != null) {
      if (e.isInteracted) {
        this.toast.success(`${data.item_name} selected successfully`);
      }
      const formData = this.extraUnitForm.get("extras") as FormArray;
      // console.log(formData, "formData")
      if (data.id || data.inventory_id) {
        console.log(data, "CHECKING DATA");
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
              brand: data.brand,
            });

            console.log(this.selectedInvData, "this.selectedInvData");
          });
      }
    }
    // this.closeModal()
  }
  onExistingVendorSelected(e) {
    // console.log(e, this.selectedInvData, "this.selectedInvData BEGIN")
    const formData = this.extraUnitForm.get("extras") as FormArray;
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
  initializeInventorySelectorForm() {
    this.inventorySelector = this.formBuilder.group({
      selectedRow: [null],
    });
  }
  handleFullInventoryListing() {
    this.inventoryData = [];
    this.supplierRatesArr = [];
    this.selectedInvData = [];
    this.showSupplierRatesTable = false;
    this.isFullInventory = true;
    this.spinner.show();
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
      this.spinner.hide();
      console.log(this.inventoryData, "CHECK DATA");
    }, 1500);
  }
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
    this.showSupplierRatesTable = true;
    this.addInventory = true;
  }

  OnInventoryItemSave() {
    console.log("CLICKED", this.selectedInvData[0]);
    this.spinner.show();
    if (this.selectedInvData.length > 0) {
      let data = this.selectedInvData[0];
      if (data) {
        console.log("data check", data);
        const formData = this.extraUnitForm.get("extras") as FormArray;
        if (formData && formData.length > 0) {
          formData.at(this.summaryDataIndex).patchValue({
            inventory_type: this.selectedInventoryType,
            inventory_name: data.inventoryItemName,
            inventory_brand: data.brand,
            inventory_id: data.inventory_id,
          });
          this.closeCustomModal();
          setTimeout(() => {
            this.spinner.hide();
            this.toast.success(
              `${data.inventoryItemName} ${
                data.supplierName !== "" ? "and " + data.supplierName : ""
              } selected successfully`
            );
            console.log(
              this.extraUnitForm.get("extras") as FormArray,
              "CHECKING DATA ON SAVE N PATCH"
            );
          }, 500);
        } else {
          this.toast.error("Something went Wrong!");
          this.spinner.hide();
        }
      } else {
        this.toast.error("Something went Wrong!");
        this.spinner.hide();
      }
    } else {
      this.toast.error("Something went Wrong!");
      this.spinner.hide();
    }
  }
  //New Save Form
  saveTypeForm(categoryName) {
    const itemsFormArray = this.extraUnitForm.get("extras") as FormArray;
    console.log(itemsFormArray);
    let formValue = itemsFormArray.value;
    let ifValuesExist = this.areValuesEmpty(formValue);
    if (ifValuesExist) {
      this.saveFormData(formValue, categoryName);
    } else {
      this.toast.warning(
        "Kindly ensure all required fields are filled before saving."
      );
    }
  }
  saveFormData(formValue, categoryName) {
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
  arraysAreEqual(arr1, arr2) {
    console.log(arr1, arr2);
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (
        !Object.entries(arr1[i]).every(([key, value]) => value === arr2[i][key])
      ) {
        return false;
      }
    }

    return true;
  }
  onPanelClosed(categoryName) {
    const itemsFormArray = this.extraUnitForm.get("extras") as FormArray;
    console.log(itemsFormArray);
    let formValue = itemsFormArray.value;
    let tempStackIndex = this.templateUnitStack.findIndex(
      (i) => i.id == categoryName
    );
    console.log(
      formValue,
      this.templateUnitStack,
      tempStackIndex,
      "ON CLOSE FORM VALUE"
    );
    //Comparing existing tempStack data with current form value to recognize if changes are made
    let ifValuesExist = this.areValuesEmpty(formValue);
    console.log(ifValuesExist, "ifValuesExist!!!");
    if (formValue.length > 0 && ifValuesExist) {
      if (tempStackIndex !== -1) {
        let isEqual = this.arraysAreEqual(
          this.templateUnitStack[tempStackIndex].value,
          formValue
        );
        console.log(isEqual, "checking isEqual");
        if (!isEqual) {
          //   // console.log("Do you want to save the Data???")
          //   $("#save_changes_modal").modal('show');
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
      if (result.value === true) {
        this.saveTypeForm(categoryName);
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
    // reqObj["approver1_roleId"] = this.approver1_roleId;
    // reqObj["approver2_roleId"] = this.dualApproval ? this.approver2_roleId : null;
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
            const formData = this.extraUnitForm.get("extras") as FormArray;
            if (formData && formData.length > 0) {
              formData.at(this.summaryDataIndex).patchValue({
                inventory_type: this.selectedInventoryType,
                inventory_name: data[0].inventoryItemName,
                inventory_brand: data[0].brand,
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
    const formData = this.extraUnitForm.get("extras") as FormArray;

    console.log(inventoryFormVal, "PROVISONAL DATA");
    if (formData && formData.length > 0) {
      formData.at(this.summaryDataIndex).patchValue({
        inventory_type: this.selectedInventoryType,
        inventory_name: inventoryFormVal.itemName,
        inventory_brand: inventoryFormVal.brand,
      });
      this.toast.success("Provisional item added successfully");
    }
    this.supplierRatesArr = [];
    this.addSupplierForm.reset();
    this.addInventoryTypeForm.reset();
    // console.log(formData, "CHECKING FORM DATA")
  }
  saveTemplate() {
    let templateHeaders = this.templateForm.getRawValue();
    let templateData = this.templateUnitStack;
    let postData = {
      mainCategory: templateHeaders.mainCategory,
      mainCategoryId: this.selectedMainCategory,
      name: templateHeaders.name,
      templateData: templateData,
      description: templateHeaders.description,
      org_id: this.organizationID,
      created_by: this.user["full_name"],
    };
    if (this.editEnable) {
      postData["id"] = this.editTemplateId;
      this.intfutService
        .UpdateServiceEstimationTemplateById(postData)
        .subscribe((data: any) => {
          if (data.status === "200") {
            this.toast.success("Template has been updated successfully");
          }
        });
    } else {
      this.intfutService
        .AddServiceEstimationTemplate(postData)
        .subscribe((data: any) => {
          if (data.status === "200") {
            this.toast.success("Template has been added successfully");
          }
        });
    }

    console.log(templateHeaders, templateData, "**********");
  }
  async editTemplate(data) {
    this.spinner.show();
    this.editEnable = true;
    console.log(data, "data");
    this.addServiceTemplate();
    this.templateUnitStack = [];
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
  DeleteTemplate(id) {
    this.spinner.show();
    if (id != null && id != "") {
      let postData = {
        ID: id,
        OrgID: this.organizationID,
      };
      this.intfutService
        .DeleteServiceEstimationTemplateById(postData)
        .subscribe((data: any) => {
          if (data.status === "200") {
            this.GetServiceEstimationTemplates();
            this.toast.success(
              "Service template has been deleted successfully"
            );
          } else {
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);

            this.toast.error("Oops...Something went wrong!");
          }
        });
    } else {
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);

      this.toast.error("Invalid service template id!");
    }
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
}
