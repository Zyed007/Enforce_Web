import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup , FormBuilder, Validators} from "@angular/forms";
import { AssetService } from '../../../../services/asset.service';
import { ToolbarItems , GridComponent } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: 'app-asset-status',
  templateUrl: './asset-status.component.html',
  styleUrls: ['./asset-status.component.scss']
})
export class AssetStatusComponent implements OnInit {

  isLoading = false;
  currentEditData = [];

  employeeGridToolItems: ToolbarItems[];

  assetStatusData;
  assetStatusListing = true;

  statusForm: FormGroup;

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
    this.statusFormInput();
    this.getAssetStatusData();
    this.employeeGridToolItems = ['Search'];
  }

  backToListing() {
    this.assetStatusListing = true;
  }

  getAssetStatusData() {
    this.isLoading = true;
    let postData = {
      "orgID": localStorage.getItem('org_id')
    }

    this.assetStatusData =[]

    this.assetService.GetAssetStatusByOrgId(postData).subscribe((data) => {
      this.assetStatusData = data;
      this.isLoading = false;
      console.log(this.assetStatusData)
    })

    console.log(this.assetStatusData)
  }

  statusFormInput() {
    this.statusForm = this.form.group({
          status: ["", Validators.required],
          desc: ["", Validators.required],
        });
  }


  back() {
    if (this.assetStatusListing) {
      this.Router.navigate(['settings-new/asset-setting']);
    } else {
      this.backToListing();
      this.getAssetStatusData();
    }
  }

  addNewAssetStatus() {
    this.assetStatusListing = false;
    this.statusForm.reset();
    this.getAssetStatusData();
  }

  serviceSearchKeyUp(): void {
    document
      .getElementById(this.closingServGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.closingServGrid.search((event.target as HTMLInputElement).value);
      });
  }

  submitStatus() {
    let statusFormVal = this.statusForm.value;
    if (statusFormVal.status && statusFormVal.status != null) {
      if(this.assetStatusData.some(obj => obj.status.toLowerCase().trim().split(" ").join("") === statusFormVal.status.toLowerCase().trim().split(" ").join("") ))
      {
        this.toast.error("The asset status already exists")
      } else {
        let postData = {
          org_id: this.orgID,
          status: statusFormVal.status,
          status_desc: statusFormVal.desc,
          created_by: this.user["full_name"],
        };
        if (!this.editEnabled) {
          this.assetService.AddAssetStatus(postData)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.toast.success("New Asset Status Added");
                this.statusForm.reset();
              } else {
                this.toast.error("Something went wrong");
              }
            });
        } else {
          postData["id"] = this.currentEditData["id"];
          postData["is_deleted"]=this.currentEditData["is_deleted"]
          this.assetService
            .UpdateAssetStatusByID(postData)
            .subscribe((data: any) => {
              if (data.status === "200") {
                this.toast.success("Asset Status Updated Successfully");
                this.statusForm.reset();
                this.editEnabled = false;
                this.assetStatusListing = true;
                this.getAssetStatusData();
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
      

      
    }

    console.log(statusFormVal, "***********");
  }

  editStatusData(data) {
    this.assetStatusListing = false;
    this.editEnabled = true;
    this.currentEditData = data;
    this.statusForm.patchValue({
      status: data.status,
      desc: data.status_desc,
    });
   
  }

  deleteStatusData(data){
        let statusFormVal = this.statusForm.value;
        Swal.fire({
          title: 'Delete this Status - '+data.status+' ?',
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
              status: statusFormVal.status,
              status_desc: statusFormVal.desc,
              created_by: this.user["full_name"],
            };
            postData["id"] = data.id;
            postData["is_deleted"]=true
            this.spinner.show()
            this.assetService
              .UpdateAssetStatusByID(postData)
              .subscribe((data: any) => {
                if (data.status === "200") {
                  
                  this.getAssetStatusData();
                  this.toast.success("Item Deleted Successfully");
                  this.statusForm.reset();
                  this.editEnabled = false;
                  this.assetStatusListing = true;
                  this.spinner.hide()
                } else {
                  this.toast.error("Something went wrong");
                }
              });
            
          }
        })
      }
  


}