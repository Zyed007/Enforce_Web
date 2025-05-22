import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import moment = require('moment');
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource } from '@angular/material';
import { DataManager } from '@syncfusion/ej2-data';
import { ToolbarItems , GridComponent } from "@syncfusion/ej2-angular-grids";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { TeamService } from '../../services/team.service';



@Component({
  selector: 'app-work-location',
  templateUrl: './work-location.component.html',
  styleUrls: ['./work-location.component.scss']
})



export class WorkLocationComponent implements OnInit {
  locationForm: FormGroup;
  showAddForm = false;
  
  

  employeeGridToolItems: ToolbarItems[];
  workLocationData;

  user = JSON.parse(localStorage.getItem("user_info"));
  currentUser: any = JSON.parse(localStorage.getItem("user_info"));
  orgID =
    this.currentUser.org_id !== null
    ? this.currentUser.org_id
    : localStorage.getItem("org_id");

  ngOnInit(): void {
    this.employeeGridToolItems = ['Search'];
    this.locationFormInput()
    this.getWorkLocationData()
  }

  workLocationListing = true;
  locationFormInput() {
      this.locationForm = this.form.group({
            work_location: ["", Validators.required],
            desc: ["", Validators.required],
          });
    }

  constructor(
    public form: FormBuilder,
    public Router: Router,
    private toast: ToastrService,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private teamService: TeamService,
  ) {

  }



  editEnabled = false;
  isLoading = false;
  addNewWorkLocation() {
    this.workLocationListing = false;
    this.locationForm.reset();
    this.showAddForm = true;
   
    this.editEnabled = false;
    //this.getAssetStatusData();
  }

  back() {
    if (this.workLocationListing) {
      console.log("yet to comee...")
      this.Router.navigate(['settings']);
    } else {
      this.showAddForm = false;
      this.workLocationListing = true;
      this.showAddForm = false;
      this.editEnabled = false;
      this.backToLocation();
      this.getWorkLocationData();
    }
  }

  currentEditData = [];

  backToLocation() {

      this.workLocationListing = true;

  }

  getWorkLocationData() {
    this.workLocationData =[]
    this.isLoading = true;
    let postData = {
      "orgID": localStorage.getItem('org_id')
    }

    this.workLocationData =[]

    this.employeeService.GetWorkLocationByOrgId(postData).subscribe((data) => {
      this.workLocationData = data;

      console.log(data, "...///|||")
      this.isLoading = false;
      console.log(this.workLocationData)
    })

    console.log(this.workLocationData)
  }

  submitStatus() {
    console.log(this.workLocationData,"mmmmmkk")
    let locationFormVal = this.locationForm.value;

    if(this.workLocationData)
    {
      if (locationFormVal.work_location && locationFormVal.work_location != null ) {
        if(this.workLocationData.some(obj => obj.work_location.toLowerCase().trim().split(" ").join("") === locationFormVal.work_location.toLowerCase().trim().split(" ").join("") ))
        {
          this.toast.error("The work location already exists")
        }
        else {
          let postData = {
            org_id: this.orgID,
            work_location: locationFormVal.work_location,
            location_desc: locationFormVal.desc,
            created_by: this.user["full_name"],
            is_deleted: false,
          };

          console.log(postData, "testing data..")
          if (!this.editEnabled) {
            this.employeeService.AddWorkLocation(postData)
              .subscribe(async (data: any) => {
                if (data.status === "200") {

                  const postData = {
                    field_group: "Basic Details",
                    field_data: JSON.stringify( [
                    { "field_name": "Nationality", "required": false },
                    { "field_name": "First Name", "required": false },
                    { "field_name": "Last Name", "required": false },
                    { "field_name": "Email", "required": false },
                    { "field_name": "Phone Number", "required": false  },
                    { "field_name": "Employee Type", "required": false  },
                    { "field_name": "Team", "required": false  },
                    { "field_name": "Employee Role", "required": false  },
                    { "field_name": "Employee Status", "required": false  }
	                  ]),
                    org_id: this.orgID,
                    created_by: this.user["full_name"],
                    work_loc: locationFormVal.work_location,
                    is_deleted: false,
                  };
                  const postData1 = {
                    field_group: "Personal Details",
                    field_data: JSON.stringify([
                      { "field_name": "Date of Birth", "required": false },
                      { "field_name": "Marital Status", "required": false },
                      { "field_name": "Personal Number", "required": false },
                      { "field_name": "Personal Email", "required": false },
                      { "field_name": "Emergency Contact Name", "required": false  },
                      { "field_name": "Emergency Contact Number", "required": false  },
                      { "field_name": "Emergency Contact Relation", "required": false  },
                      { "field_name": "Passport Number", "required": false  },
                      { "field_name": "Passport Issue Country", "required": false  },
                      { "field_name": "Passport Issue Date", "required": false  },
                      { "field_name": "Passport Expiry Date", "required": false  },
                      { "field_name": "Local Address", "required": false  },
                      { "field_name": "City", "required": false  },
                      { "field_name": "Country", "required": false  },
                      { "field_name": "Postal Code", "required": false  }
	                  ]),
                    org_id: this.orgID,
                    created_by: this.user["full_name"],
                    work_loc: locationFormVal.work_location,
                    is_deleted: false,
                  }
                  const postData2 = {
                    field_group: "Contract Details",
                    field_data: JSON.stringify( [
                      { "field_name": "Contract Starting Date", "required": false },
                      { "field_name": "Contract Ending Date", "required": false },
                      { "field_name": "Labour ID", "required": false },
	                    { "field_name": "Labour Expiry Date", "required": false },
                      { "field_name": "Visa Number", "required": false },
                      { "field_name": "Visa Type", "required": false  },
                      { "field_name": "Visa Expiry Date", "required": false  },
                      { "field_name": "Emirates Expiry Date", "required": false  },
                      { "field_name": "Insurance Provider Name", "required": false  },
                      { "field_name": "Insurance Policy Number", "required": false  },
	                    { "field_name": "Insurance Validity Expiry", "required": false  },
	                    { "field_name": "Bank Name", "required": false  },
	                    { "field_name": "Bank Branch", "required": false  },
	                    { "field_name": "Bank Account Number", "required": false  },
	                    { "field_name": "IBAN", "required": false  },
	                    { "field_name": "Swift Code", "required": false  }
	                  ]),
                    org_id: this.orgID,
                    created_by: this.user["full_name"],
                    work_loc: locationFormVal.work_location,
                    is_deleted: false,
                  }
                  const postData3 = {
                    field_group: "Documents",
                    field_data: JSON.stringify( [
                      {"field_name":"Passport","required":false},
                      {"field_name":"Labour ID","required":false},
                      {"field_name":"Visa","required":false},
                      {"field_name":"Emirates ID","required":false},
                      {"field_name":"Photo","required":false}
	                  ]),
                    org_id: this.orgID,
                    created_by: this.user["full_name"],
                    work_loc: locationFormVal.work_location,
                    is_deleted: false,
                  }

                  console.log(postData, "check 1")
                  console.log(postData1, "check 2")
                  console.log(postData2, "check 3")
                  console.log(postData3, "check 4")

                  const res: any = await this.teamService.AddFieldSettings(postData).toPromise();
                  const res2: any = await this.teamService.AddFieldSettings(postData1).toPromise();
                  const res3: any = await this.teamService.AddFieldSettings(postData2).toPromise();
                  const res4: any = await this.teamService.AddFieldSettings(postData3).toPromise();

                  if(res.status == "200" && res2.status == "200" && res3.status == "200" && res4.status == "200" )
                  {
                    this.toast.success("New Work Location Added");
                  }

                  this.locationForm.reset();
                } else {
                  this.toast.error("Something went wrong");
                }
              });
          } else {
            postData["id"] = this.currentEditData["id"];
            postData["is_deleted"]=this.currentEditData["is_deleted"]
            this.employeeService
              .UpdateWorkLocationByID(postData)
              .subscribe(async(data: any) => {
                if (data.status === "200") {
                  const today = moment().format('YYYY-MM-DD');
                  let postData = {
                    work_loc : locationFormVal.work_location,
                    org_id: this.orgID,
                    modified_by: this.user["full_name"],
                    prev_work_loc : this.currentEditData["work_location"],
                    modified_date : today
                  }
                  const res: any = await this.teamService.UpdateFieldSettingsBasedonWorkLocation(postData).toPromise();
                  if(res.status == 200)
                  {
                    this.toast.success("Work Location Updated Successfully");
                  this.locationForm.reset();
                  this.editEnabled = false;
                  this.workLocationListing = true;
                  }

                  this.getWorkLocationData();
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
    } else {
      let postData = {
        org_id: this.orgID,
        work_location: locationFormVal.work_location,
        location_desc: locationFormVal.desc,
        created_by: this.user["full_name"],
        is_deleted: false,
      };

      console.log(postData, "testing data..")
      if (!this.editEnabled) {
        this.employeeService.AddWorkLocation(postData)
          .subscribe((data: any) => {
            if (data.status === "200") {
              this.toast.success("New Work Location Added");
              this.locationForm.reset();
            } else {
              this.toast.error("Something went wrong");
            }
          });
      }
    }


    console.log(locationFormVal, "***********");
  }

  editLocationData(data) {
    this.workLocationListing = false;
    this.editEnabled = true;
    this.currentEditData = data;
    this.locationForm.patchValue({
      work_location: data.work_location,
      desc: data.location_desc,
    });

  
    
    this.showAddForm = true;

  }

  deleteLocationData(data){
          let locationFormVal = this.locationForm.value;
          Swal.fire({
            title: 'Delete this Work location - '+data.work_location+' ?',
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
                work_location: locationFormVal.status,
                location_desc: locationFormVal.desc,
                created_by: this.user["full_name"],
              };
              postData["id"] = data.id;
              postData["is_deleted"]=true
              this.spinner.show()
              this.employeeService
                .UpdateWorkLocationByID(postData)
                .subscribe((data: any) => {
                  if (data.status === "200") {

                    this.getWorkLocationData();
                    this.toast.success("Item Deleted Successfully");
                    this.locationForm.reset();
                    this.editEnabled = false;
                    this.workLocationListing = true;
                    this.spinner.hide()
                  } else {
                    this.toast.error("Something went wrong");
                  }
                });

            }
          })
        }

}


