import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { settingsService } from "../../../../services/settings.service";
import { ToastrService } from "ngx-toastr";
import { IntfutService } from "../../../../services/intfut.service";
import { Router } from "@angular/router";
import { MultiSelectComponent } from "@syncfusion/ej2-angular-dropdowns";
import Swal from "sweetalert2";

@Component({
  selector: "intfut-service-templates",
  templateUrl: "./intfut-rules.component.html",
  styleUrls: ["./intfut-rules.component.scss"],
})
export class IntfutServiceRules implements OnInit {
  @ViewChild("serviceGrid", { static: false })
  public serviceGrid: GridComponent;
  @ViewChild("multiselect", { static: false })
  multiselect: MultiSelectComponent;
  extraUnitForm: FormGroup;
  ruleTitleForm: FormGroup;
  ruleForm: FormGroup;
  templateListing = true;
  rule: string = "";
  ruleListingData = [];
  serviceSecondaryCategory = [];
  allServicesArr = [];
  serviceMainCategory = [];
  commonFields: Object = { text: "value", value: "id" };
  operators = [
    { id: 1, operator: "+", text: "Addition" },
    { id: 2, operator: "-", text: "Subtraction" },
    { id: 3, operator: "*", text: "Multiplication" },
    { id: 4, operator: "/", text: "Division" },
    { id: 5, operator: "=", text: "Equals" },
  ];
  selectedItems = [];

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private settingService: settingsService,
    private intfutService: IntfutService,
    private Router: Router
  ) {
    this.extraUnitForm = this.formBuilder.group({
      extras: this.formBuilder.array([]),
    });
  }
  ngOnInit() {
    this.initializeRuleForm();
    this.initializeRuleTitleForm();
    this.getIntFutServices();
    this.GetEstimationServiceByOrgId();
  }
  initializeRuleTitleForm() {
    this.ruleTitleForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      mainCategory: ["", Validators.required],
      secondaryCategory: [[], Validators.required],
    });
  }
  initializeExtraUnitForm() {
    this.extraUnitForm = this.formBuilder.group({
      extras: this.formBuilder.array([]),
    });
  }
  initializeRuleForm() {
    this.ruleForm = this.formBuilder.group({
      rule: [""],
    });
  }
  reset() {
    this.extraUnitForm.reset();
    this.ruleForm.reset();
    this.ruleTitleForm.reset();
    this.selectedItems = [];
  }
  addServiceRule() {
    this.templateListing = false;
    this.reset();
    this.addExtraUnit();
  }
  closeAddServiceRule() {
    this.reset();
    this.templateListing = true;
  }
  get extras(): FormArray {
    return this.extraUnitForm.get("extras") as FormArray;
  }

  addExtraUnit() {
    const extraUnit = this.formBuilder.group({
      secondaryCategory: [""],
      alias: [""],
    });
    this.extras.push(extraUnit);
  }
  removeItem(i: number): void {
    // Get the FormArray and remove the item at the specified index
    const itemsFormArray = this.extraUnitForm.get("extras") as FormArray;
    itemsFormArray.removeAt(i);
  }
  submitTitleForm() {
    const value = this.ruleTitleForm.getRawValue();
    console.log(value, "valueCheck");
    this.selectedItems = [];

    const selectedCategoryIds = new Set(value.secondaryCategory);

    this.serviceSecondaryCategory.forEach((ele, index) => {
      if (selectedCategoryIds.has(ele.id)) {
        const alias = `ID${index + 1}`;
        this.selectedItems.push({
          id: ele.id,
          alias: alias,
          secondaryCategory: ele.value,
        });
      }
    });

    console.log(this.selectedItems, "selectedItems");
  }
  handleSubmitForm() {
    if (this.selectedItems.length > 0) {
      Swal.fire({
        title: "Are you sure you want to submit ?",
        text: "Existing selected items will be removed",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: " Confirm",
        cancelButtonText: "Cancel",
      }).then((res) => {
        if (res.value) {
          this.submitTitleForm();
        }
      });
    } else {
      this.submitTitleForm();
    }
  }

  submitForm() {
    const value = this.extraUnitForm.getRawValue();
    console.log(value, "value");
    if (value.extras && value.extras.length > 0) {
      this.selectedItems = [];

      this.serviceSecondaryCategory.forEach((ele) => {
        const matchingExtra = value.extras.find(
          (i) => i.secondaryCategory === ele.id
        );
        if (matchingExtra) {
          const alias = matchingExtra.alias || this.generateRandomAlias();
          this.selectedItems.push({
            id: ele.id,
            alias: alias,
            secondaryCategory: ele.value,
          });
        }
      });

      console.log(this.selectedItems, "selectedItems");
    }
  }
  generateRandomAlias() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const randomIndex = Math.floor(Math.random() * letters.length);
    return (
      letters[randomIndex] +
      (Math.random() < 0.5
        ? ""
        : letters[Math.floor(Math.random() * letters.length)])
    );
  }
  handleMainCategorySelection(e) {
    console.log(e, "CHECK");
    if (e.value) {
      let SerCatId = e.value;
      this.serviceSecondaryCategory = [];

      let services = this.allServicesArr.filter(
        (i) => i.mainCategoryId == SerCatId
      );

      if (services && services.length > 0) {
        services.forEach((i) => {
          this.serviceSecondaryCategory.push({
            id: i.subCategoryId,
            value: i.subCategoryName,
          });
        });

        if (this.multiselect) {
          this.multiselect.refresh();
        }

        console.log(
          this.serviceSecondaryCategory,
          "this.serviceSecondaryCategory"
        );
      }
    }
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
  backToEstimation() {
    this.Router.navigate(["settings-new/estimation"]);
  }
  handleSubmitRule() {
    let rule = this.ruleForm.get("rule").value;
    const validationResult = this.checkRuleValidity(rule);

    if (rule && validationResult.isValid) {
      this.toast.success("Valid JavaScript code and rule");
      console.log("Valid JavaScript code and rule:", rule);
    } else if (!validationResult.isValid) {
      this.toast.error(validationResult.issue);
      console.log(validationResult.issue);
    } else {
      this.toast.error("Invalid JavaScript code");
      console.log("Invalid JavaScript code:", rule);
    }
  }
  checkRuleValidity(ruleName: string): { isValid: boolean; issue?: string } {
    // Create an array of valid identifiers from the selected items
    const validIdentifiers = this.selectedItems.map(item => item.alias);
    const parts = ruleName.replace(/[\s=]+/g, ' ').trim().split(" ");

    // Check for valid identifiers and math operators
    const hasInvalidAlias = parts.some(part => {
        const trimmedPart = part.trim();
        const isMathOperator = /^[\+\-\*\/]$/.test(trimmedPart);
        const isValidIdentifier = validIdentifiers.includes(trimmedPart);
        const isNumeric = !isNaN(Number(trimmedPart));

        return !isValidIdentifier && !isMathOperator && !isNumeric;
    });

    if (hasInvalidAlias) {
        return { isValid: false, issue: 'Invalid alias used.' };
    }

    // Validate JS code
    try {
        new Function(`return ${ruleName}`)();
    } catch (e) {
        return { isValid: false, issue: 'Invalid math operator used.' };
    }

    return { isValid: true };
}



  isNumeric(value: string): boolean {
    return !isNaN(Number(value));
  }
}
