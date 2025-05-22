import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup , FormBuilder, Validators, FormArray, FormControl} from "@angular/forms";
import { AssetService } from '../../../../services/asset.service';
import { ToolbarItems , GridComponent } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-asset-category',
  templateUrl: './asset-category.component.html',
  styleUrls: ['./asset-category.component.scss']
})
export class AssetCategoryComponent implements OnInit {
  isLoading = false;
  currentEditData = [];

  employeeGridToolItems: ToolbarItems[];

  assetCategoryData;
  assetCategoryListing = true;
  assetTypeListing = true;

  categoryForm: FormGroup;

  public closingServGrid: GridComponent;

  editEnabled = false;

  user = JSON.parse(localStorage.getItem("user_info"));
  currentUser: any = JSON.parse(localStorage.getItem("user_info"));
  orgID =
    this.currentUser.org_id !== null
    ? this.currentUser.org_id
    : localStorage.getItem("org_id");
    
  constructor(
    public Router: Router,
    public form: FormBuilder,
    private assetService: AssetService,
    private toast: ToastrService, 
    private spinner: NgxSpinnerService,

  ) {}

  

  ngOnInit() : void {
    this.categoryFormInput();
    this.getAssetCategoryData();
    this.employeeGridToolItems = ['Search'];
  }

  backToListing() {
    this.assetCategoryListing = true;
    this.assetTypeListing = true;
  }

  getAssetCategoryData() {
    this.isLoading = true;
    let postData = {
      "orgID": localStorage.getItem('org_id')
    }

    this.assetCategoryData =[]

    this.assetService.GetAssetCategoryByOrgId(postData).subscribe((data) => {
      this.assetCategoryData = data;
      this.isLoading = false;
      console.log(this.assetCategoryData)
    })

    console.log(this.assetCategoryData)
  }

  

  categoryFormInput() {
    this.categoryForm = this.form.group({
          category: ["", Validators.required],
          desc: ["", Validators.required],
          types: this.form.array([]),
        });
  }

  get types() : FormArray {
    return this.categoryForm.get("types") as FormArray
  }

  newType() : FormGroup {
    return this.form.group({
      type: ["", Validators.required],
      description: ["", Validators.required]
    })
  }

  addTypes() {
    this.types.push(this.newType());

  }



  back() {
    if (this.assetCategoryListing) {
      this.Router.navigate(['settings-new/asset-setting']);
    } else {
      this.backToListing();
      this.getAssetCategoryData();

    }
  }

  addNewAssetCategory() {
    this.assetCategoryListing = false;
    this.categoryForm.reset();
    this.getAssetCategoryData();
    this.assetTypeListing = false;

  }

  

 /* isCategoryEmpty(): boolean {
    return !this.categoryForm.get('category').value;
  }

  isSubmitButtonDisabled(): boolean {
    if (this.isCategoryEmpty()) {
      return true;
    }
  }*/

  /* isAddButtonDisabled(): boolean {

     if (this.isCategoryEmpty()) {
      return true;
    }
    const lastIndex = this.types.length - 1;
    // Check if the 'type' field in the first form group is valid

    if (lastIndex >= 0) {
      // Get the last FormGroup in the FormArray
      const lastFormGroup = this.types.at(lastIndex);
      
      // Ensure the 'type' control exists before checking its validity
      if (lastFormGroup && lastFormGroup.get('type')) {
        return !lastFormGroup.get('type').valid || this.isCategoryEmpty(); // Check the validity of the 'type' control
      }
    } 
  
    return false;
  } */

  serviceSearchKeyUp(): void {
    document
      .getElementById(this.closingServGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.closingServGrid.search((event.target as HTMLInputElement).value);
      });
  }

  submitStatus() {
    let categoryFormVal = this.categoryForm.value;
    if (categoryFormVal.category && categoryFormVal.category != null) {
        let postData = {
          org_id: this.orgID,
          category: categoryFormVal.category,
          category_desc: categoryFormVal.desc,
          created_by: this.user["full_name"],
          
        };
        if (!this.editEnabled) {
          if(this.assetCategoryData.some(obj => obj.category.toLowerCase().trim().split(" ").join("") === categoryFormVal.category.toLowerCase().trim().split(" ").join(""))){
            this.toast.error("The asset category already exists.")
          } else {
            this.assetService.AddAssetCategory(postData)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.toast.success("New Asset Category Added");
                this.categoryForm.reset();
                this.types.clear();
              } else {
                this.toast.error("Something went wrong");
              }
            });
          }
          
        }  else {
          postData["id"] = this.currentEditData["id"];
          postData["is_deleted"]=this.currentEditData["is_deleted"]
          this.assetService
            .UpdateAssetCategoryByID(postData)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.toast.success("Asset Status Updated Successfully");
                this.categoryForm.reset();
                this.editEnabled = false;
                this.assetCategoryListing = true;
                this.getAssetCategoryData();
                
              } else {
                this.toast.error("Something went wrong");
              }
            });
        }
      }
      // this.staticUnitTypeListings.push({
      //     id: Math.floor(Math.random() * 1000000),
      //     createdDate:'25/09/2023',
      //     createdBy:user['full_name'],
      //     unit:unitFormVal.unit,
      //     desc:unitFormVal.desc
      // })
      
      

      
    

    console.log(categoryFormVal, "***********");
  }

  editCategoryData(data) {
    this.assetCategoryListing = false;
    this.editEnabled = true;
    this.currentEditData = data;
    this.categoryForm.patchValue({
      category: data.category,
      desc: data.category_desc
    });
   
  }

  deleteCategoryData(data){
          let categoryFormVal = this.categoryForm.value;
          Swal.fire({
            title: 'Delete this Category - '+data.category+' ?',
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
                category: categoryFormVal.category,
                category_desc: categoryFormVal.desc,
                created_by: this.user["full_name"],
              };
              postData["id"] = data.id;
              postData["is_deleted"]=true
              this.spinner.show()
              this.assetService
                .UpdateAssetCategoryByID(postData)
                .subscribe((data: any) => {
                  if (data.status === "200") {
                    
                    this.getAssetCategoryData();
                    this.toast.success("Item Deleted Successfully");
                    this.categoryForm.reset();
                    this.editEnabled = false;
                    this.assetCategoryListing = true;
                    this.spinner.hide()
                  } else {
                    this.toast.error("Something went wrong");
                  }
                });
              
            }
          })
        }


}