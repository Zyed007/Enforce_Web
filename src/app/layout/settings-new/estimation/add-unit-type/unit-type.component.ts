import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToolbarItems, GridComponent } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "../../../../services/inventory.service";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: "app-unit-type",
  templateUrl: "./unit-type.component.html",
  styleUrls: ["./unit-type.component.scss"],
})
export class UnitTypeComponent implements OnInit {
  unitTypeListing = true;
  editEnabled = false;
  currentEditData = [];
  actStatGridToolItems: ToolbarItems[];
  employeeGridToolItems: ToolbarItems[];
  inventoryUnitData$: Observable<any>;
  public closingServGrid: GridComponent;
  user = JSON.parse(localStorage.getItem("user_info"));
  currentUser: any = JSON.parse(localStorage.getItem("user_info"));
  orgID =
    this.currentUser.org_id !== null
      ? this.currentUser.org_id
      : localStorage.getItem("org_id");
  staticUnitTypeListings = [
    {
      id: 54684687897986,
      createdDate: "25/09/2023",
      createdBy: "Sharan K Shaji",
      unit: "kg",
      desc: "Kilogram",
    },
    {
      id: 54684687897987,
      createdDate: "25/09/2023",
      createdBy: "Sazid Khan",
      unit: "cm",
      desc: "Centimetre",
    },
    {
      id: 546846878979569,
      createdDate: "25/09/2023",
      createdBy: "Sharan K Shaji",
      unit: "mm",
      desc: "Millimetre",
    },
  ];
  unitForm: FormGroup;
  constructor(
    public Router: Router,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public inventoryService: InventoryService,
    private spinner: NgxSpinnerService,
  ) {}
  ngOnInit(): void {
    this.unitFormInputs();
    this.getInventoryUnitData();
    this.employeeGridToolItems = ['Search'];
  }
  getInventoryUnitData() {
    this.inventoryUnitData$ = this.inventoryService.GetInventoryUnitByOrgId();
  }
  unitFormInputs() {
    this.unitForm = this.formBuilder.group({
      unit: ["", Validators.required],
      desc: ["", Validators.required],
    });
  }
  addNewUnitType() {
    this.unitTypeListing = false;
    this.unitForm.reset();
  }
  backToListing() {
    this.unitTypeListing = true;
  }
  back() {
    if (this.unitTypeListing) {
      this.Router.navigate(["settings-new/estimation"]);
    } else {
      this.backToListing();
    }
  }
  submitStatus() {
    let unitFormVal = this.unitForm.value;
    if (unitFormVal.unit && unitFormVal.unit != null) {
      // this.staticUnitTypeListings.push({
      //     id: Math.floor(Math.random() * 1000000),
      //     createdDate:'25/09/2023',
      //     createdBy:user['full_name'],
      //     unit:unitFormVal.unit,
      //     desc:unitFormVal.desc
      // })
      let postData = {
        org_id: this.orgID,
        unit: unitFormVal.unit,
        unit_desc: unitFormVal.desc,
        created_by: this.user["full_name"],
      };

      if (!this.editEnabled) {
        this.inventoryService
          .AddInventoryUnit(postData)
          .subscribe((data: any) => {
            if (data.status === "200") {
              this.toast.success("New Unit Type Added");
              this.unitForm.reset();
            } else {
              this.toast.error("Something went wrong");
            }
          });
      } else {
        postData["id"] = this.currentEditData["id"];
        postData["is_deleted"]=this.currentEditData["is_deleted"]
        this.inventoryService
          .UpdateInventoryUnitByID(postData)
          .subscribe((data: any) => {
            if (data.status === "200") {
              this.toast.success("Unit Type Updated Successfully");
              this.unitForm.reset();
              this.editEnabled = false;
              this.unitTypeListing = true;
            } else {
              this.toast.error("Something went wrong");
            }
          });
      }
    }

    console.log(unitFormVal, "***********");
  }
  editUnitData(data) {
    this.unitTypeListing = false;
    this.editEnabled = true;
    this.currentEditData = data;
    this.unitForm.patchValue({
      unit: data.unit,
      desc: data.unit_desc,
    });

  }
  serviceSearchKeyUp(): void {
    document
      .getElementById(this.closingServGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.closingServGrid.search((event.target as HTMLInputElement).value);
      });
  }

  deleteUnitData(data){
    let unitFormVal = this.unitForm.value;
    Swal.fire({
      title: 'Delete this Unit - '+data.unit+' ?',
      text: "Please Note you won't be able to revert this",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        let postData = {
          org_id: this.orgID,
          unit: unitFormVal.unit,
          unit_desc: unitFormVal.desc,
          created_by: this.user["full_name"],
        };
        postData["id"] = data.id;
        postData["is_deleted"]=true
        this.spinner.show()
        this.inventoryService
          .UpdateInventoryUnitByID(postData)
          .subscribe((data: any) => {
            if (data.status === "200") {
              
              this.getInventoryUnitData();
              this.toast.success("Item Deleted Successfully");
              this.unitForm.reset();
              this.editEnabled = false;
              this.unitTypeListing = true;
              this.spinner.hide()
            } else {
              this.toast.error("Something went wrong");
            }
          });
        
      }
    })
  }
}
