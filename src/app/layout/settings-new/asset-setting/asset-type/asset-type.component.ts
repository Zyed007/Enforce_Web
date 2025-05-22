import { Component, OnInit } from "@angular/core";
import { FormGroup , FormBuilder, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { AssetService } from '../../../../services/asset.service';
import { ToolbarItems , GridComponent } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: 'app-asset-type',
  templateUrl: './asset-type.component.html',
  styleUrls: ['./asset-type.component.scss']
})
export class AssetTypeComponent implements OnInit {

    assetCatogery = [];

    isLoading = false;
    currentEditData = [];

    employeeGridToolItems: ToolbarItems[];

    assetTypeData;
    assetTypeListing = true;

    typeForm: FormGroup;

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
    this.typeFormInput();
    this.getAssetTypeData();
    this.employeeGridToolItems = ['Search'];
    this.GetCategoryData();
  }

  async GetCategoryData() {
    let postData = {
      "orgID": localStorage.getItem('org_id')
    }
  
    //this.assetCategoryData =[]
  
    /*let categoryData: any = await this.assetService.GetAssetCategoryByOrgId(postData).toPromise()
    if (categoryData && categoryData.length > 0) { 
      Object.values(categoryData).map((item) =>  {
        this.assetCatogery.push((item).map(data => data.category));
      });
      
    }*/
  
    //console.log(this.assetCatogery, "assetCategory")
  
    this.assetService.GetAssetCategoryByOrgId(postData).subscribe((data) => {
      //this.assetCategoryData = data;
      //this.isLoading = false;
      //console.log(this.assetCategoryData)
  
      //this.assetCatogery.push({id: Object.values(data).map(item => item.category)})
      //let val = data;
      //console.log(val, "val")
      this.assetCatogery = Object.values(data).map(item => item.category);
      console.log(this.assetCatogery, "assetCategory")
  
    })
  
    //console.log(this.assetCategoryData)
    }

  getAssetTypeData() {
    this.isLoading = true;
    let postData = {
      "orgID": localStorage.getItem('org_id')
    }

    this.assetTypeData =[]

    this.assetService.GetAssetTypeByOrgId(postData).subscribe((data) => {
      this.assetTypeData = data;
      this.isLoading = false;
      console.log(this.assetTypeData)
    })

    console.log(this.assetTypeData)
  }



  backToListing() {
    this.assetTypeListing = true;
  }


  typeFormInput() {
    this.typeForm = this.form.group({
          type: ["", Validators.required],
          desc: ["", Validators.required],
          category: ["", Validators.required],
        });
  }

  back() {
    if (this.assetTypeListing) {
      this.Router.navigate(['settings-new/asset-setting']);
    } else {
      this.backToListing();
      this.getAssetTypeData();
    }
  }

  addNewAssetType() {
    this.assetTypeListing = false;
    this.typeForm.reset();
  }

  serviceSearchKeyUp(): void {
    document
      .getElementById(this.closingServGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.closingServGrid.search((event.target as HTMLInputElement).value);
      });
  }


  submitStatus() {
    let typeFormVal = this.typeForm.value;
    
    if (typeFormVal.type && typeFormVal.type != null && typeFormVal.category != null) {
      let postData = {
        org_id: this.orgID,
        type: typeFormVal.type,
        category: typeFormVal.category,
        type_desc: typeFormVal.desc,
        created_by: this.user["full_name"],
      };
        
        if (!this.editEnabled) {
          if(this.assetTypeData.some(obj => obj.type.toLowerCase().trim().split(" ").join("") === typeFormVal.type.toLowerCase().trim().split(" ").join(""))) {
            this.toast.error("The asset type already exists")
          } else {
            this.assetService.AddAssetType(postData)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.toast.success("New Asset Type Added");
                this.typeForm.reset();
              } else {
                this.toast.error("Something went wrong");
              }
            });
          }
          
        } else {
          postData["id"] = this.currentEditData["id"];
          postData["is_deleted"]=this.currentEditData["is_deleted"]
          this.assetService
            .UpdateAssetTypeByID(postData)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.toast.success("Asset Type Updated Successfully");
                this.typeForm.reset();
                this.editEnabled = false;
                this.assetTypeListing = true;
                this.getAssetTypeData();
              } else {
                this.toast.error("Something went wrong");
              }
            });
        
        
      }
      // this.staticUnitTypeListings.push({
      //     id: Math.floor(Math.random() * 1000000),
      //     createdDate:'25/09/2023',
      //     createdBy:user['full_name'],
      //     unit:unitFormVal.unit,
      //     desc:unitFormVal.desc
      // })
      

      
    } else {
      this.toast.warning("Please enter all the required Data.")
    }

    console.log(typeFormVal, "***********");
  }

  editTypeData(data) {
    this.assetTypeListing = false;
    this.editEnabled = true;
    this.currentEditData = data;
    this.typeForm.patchValue({
      type: data.type,
      desc: data.type_desc,
      category: data.category,
    });
    console.log(this.typeForm)
  }


  deleteTypeData(data){
      let typeFormVal = this.typeForm.value;
      Swal.fire({
        title: 'Delete this Type - '+data.type+' ?',
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
            type: typeFormVal.type,
            type_desc: typeFormVal.desc,
            category: typeFormVal.category,
            created_by: this.user["full_name"],
          };
          postData["id"] = data.id;
          postData["is_deleted"]=true
          this.spinner.show()
          this.assetService
            .UpdateAssetTypeByID(postData)
            .subscribe((data: any) => {
              if (data.status === "200") {
                
                this.getAssetTypeData();
                this.toast.success("Item Deleted Successfully");
                this.typeForm.reset();
                this.editEnabled = false;
                this.assetTypeListing = true;
                this.spinner.hide()
              } else {
                this.toast.error("Something went wrong");
              }
            });
          
        }
      })
    }


  
}