import { Component, OnInit, ViewChild } from "@angular/core";
import { ToolbarItems, GridComponent } from "@syncfusion/ej2-angular-grids";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { ProjectService } from "../../../../services/project.service";
import { ModuleSetupService } from "../../../../services/moduleSetup.service";
import Swal from "sweetalert2";
import { Select2OptionData, Select2TemplateFunction } from "ng2-select2";
import moment = require("moment");
import { E } from "@angular/cdk/keycodes";
declare var $: any;

@Component({
  selector: "app-building-type",
  templateUrl: "./building-type.component.html",
  styleUrls: ["./building-type.component.scss"],
})
export class BuildingTypeComponent implements OnInit {
  currentClsID: "";
  prjtListing = true;
  addBuildingTypeFrm: FormGroup;
  editClosingStepSrvId;
  currentUser = JSON.parse(localStorage.getItem("user_info"));
  orgID =
    this.currentUser.org_id !== null
      ? this.currentUser.org_id
      : localStorage.getItem("org_id");
  // addMilestoneNmeFrm: FormGroup;
  newMilestone = false;
  showMilestoneTaskTable = false;
  @ViewChild("closingServGrid", { static: false })
  public closingServGrid: GridComponent;
  public roleData: Array<Select2OptionData>;
  public approverDt: Array<Select2OptionData>;
  public deptOptions: Select2Options;
  //rolesData = [];
  // [{ id: '', text: 'Select Role' }];

  closingStepsServ = [
    // {
    //     id: "jgasjdasdsakdhkk1212121jl",
    //     closingstepName : "Interior Project Closing Plan",
    //     numberofSteps : 5,
    //     createdDate : new Date(),
    //     createdBy : "Sazid Khan",
    // },
  ];
  employeeGridToolItems: ToolbarItems[];
  editMdSelected = false;
  deletedTsk = [];

  constructor(
    public Router: Router,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private moduleSetupService: ModuleSetupService
  ) {}

  ngOnInit() {
    this.deptOptions = {
      placeholder: { id: "  ", text: "Select Role" },
      allowClear: true,
      width: "100%",
    };
    //this.addMilestoneNmeFrmInputs();
    this.employeeGridToolItems = ["Search"];
    //this.fetchRolesData();
    // this.fetchApprovesDt();
    this.fetchExistingClosingSteps();

    // this.fetchDemoAPI();
  }

  // fetchDemoAPI() {
  //   this.projectService.GetDemoApi().subscribe((data:any) => {
  //     console.log("DEMO",data);
  //     // if(data != null) {
  //     //   this.closingStepsServ = data;
  //     // } else {
  //     //   this.closingStepsServ = [];
  //     // }
  // });
  // }

  addProjectClsSteps() {
    this.addClosingServFormInputs();
    this.currentClsID = null;
    this.prjtListing = false;
    this.newMilestone = true;
  }

  //Add milestone Model all function
  addMilestoneModel() {
    $("#Add_Mlstn_modal").modal("show");
    // this.getAllMilestoneByOrg();
  }

  addClosingServFormInputs() {
    this.addBuildingTypeFrm = this.formBuilder.group({
      serTermName: ["", Validators.required],
      //   isDefault: [false],
      //  milestone: ['', Validators.required],
      taskList: this.formBuilder.array([], [Validators.required]),
    });
  }

  backToProject() {
    this.Router.navigate(["settings-new/estimation"]);
    this.editMdSelected = false;
  }

  closeAddEditListing() {
    this.prjtListing = true;
    this.editMdSelected = false;
  }

  addNewTask() {
    let newMem = this.addTaskListFrmInput();
    this.taskList.push(newMem);
  }

  deleteTaskRow(i: number) {
    if (this.editMdSelected) {
      let tskList = this.addBuildingTypeFrm.get("taskList") as FormArray;

      console.log(tskList.value[i]);
      this.deletedTsk.push({ ...tskList.value[i], isDeleted: true });
      this.taskList.removeAt(i);
    } else {
      this.taskList.removeAt(i);
    }
  }

  get taskList(): FormArray {
    return this.addBuildingTypeFrm.get("taskList") as FormArray;
  }

  addTaskListFrmInput() {
    return this.formBuilder.group({
      taskName: ["", [Validators.required]],
      taskDescription: [""],
      // assignRoleId: ['', [Validators.required]],
      // accessType: ['fullAccess'],
      // approverlvlone: [''],
      // approverlvltwo: [''],
    });
  }

  retureHrsMinConvertedDecimal(item: any, i) {
    let getValue = item.value;
    let hours =
      getValue.taskHours === "" || getValue.taskHours === null
        ? 0
        : parseFloat(getValue.taskHours);
    let minutes =
      getValue.taskMinutes === "" || getValue.taskMinutes === null
        ? 0
        : parseFloat(getValue.taskMinutes);
    let totalMinutes = hours * 60 + minutes;
    let timeConverted = parseFloat((totalMinutes / 60).toFixed(2));
    // console.log("timeConverted--->",timeConverted);
    this.taskList.at(i).patchValue({
      timeConverted: timeConverted,
    });
  }

  checkRowToDisable() {
    let formValue = this.addBuildingTypeFrm.controls["taskList"].value;
    if (formValue.length === 1) {
      return true;
    } else {
      return false;
    }
  }

  serviceSearchKeyUp(): void {
    document
      .getElementById(this.closingServGrid.element.id + "_searchbar")
      .addEventListener("keyup", () => {
        this.closingServGrid.search((event.target as HTMLInputElement).value);
      });
  }

  saveMileStone() {
    console.log("Milestone Saved");
  }

  public fetchApprovesDt() {
    this.moduleSetupService
      .GetAllSectionApproversByOrgID()
      .subscribe((data: any) => {
        var filtDt = data.filter(
          (el) =>
            el.module_id === "ae3c96f7-cd3c-4796-a5c1-81067d8a7b78" &&
            el.section_id === "a71b7687-0c30-45a4-aa0e-e9d281f0e351"
        );
        var aprvDt = [{ id: "", text: "Select Role" }];
        console.log("filtDt--->", filtDt);
        for (var i = 0; i < filtDt.length; i++) {
          // logik to create new items

          aprvDt.push({
            id: filtDt[i].id,
            text: filtDt[i].role_name,
          });
        }
        //  console.log('aprvDt--->',aprvDt);
        this.approverDt = aprvDt;

        if (this.approverDt.length === 0) {
          console.log("Show An Error Message in Case No Approvers Are Present");
        }
      });
  }

  selectAccessType(selValue, index) {
    let tskList = this.addBuildingTypeFrm.get("taskList").value;
    console.log(" Selected Value--->", tskList);
  }

  public fetchRolesData() {
    this.moduleSetupService
      .GetAllRoleModulesByOrgID()
      .subscribe((data: any) => {
        var results = [{ id: "", text: "Select Role" }];

        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          results.push({
            id: data[i].id,
            text: data[i].role_name,
          });
        }
        this.roleData = results;
      });
  }

  async saveClosingSteps() {
    console.log("editMdSelected--->", this.editMdSelected);
    this.spinner.show();
  
    try {
      let frmValue = this.addBuildingTypeFrm.value;
  
      let reqObj: any = {};
      let tskArr: any[] = [];
  
      reqObj["typeName"] = frmValue.serTermName;
      reqObj["typeDescription"] = frmValue.serTermName;
      reqObj["org_id"] = this.orgID;
      reqObj["created_date"] = moment().format("L");
      reqObj["modified_date"] = moment().format("L");
      reqObj["createdEmpId"] = this.currentUser.id;
      reqObj["createdByName"] = this.currentUser.full_name;
      reqObj["isDeleted"] = false;
  
      if (frmValue.taskList.length > 0) {
        frmValue.taskList.forEach((el: any) => {
          tskArr.push({
            id: el.id ? el.id : null,
            name: el.taskName,
            description: el.taskDescription,
            createdDate: moment().format("L"),
            modifiedDate: moment().format("L"),
            createdByName: this.currentUser.full_name,
            createdbyEmpId: this.currentUser.id,
            modifiedbyEmpId: this.currentUser.id,
            isDeleted: false,
          });
        });
      }
  
      if (this.editMdSelected === true) {
        reqObj["id"] = this.editClosingStepSrvId;
        this.deletedTsk.forEach((el) => {
          tskArr.push(el);
        });
  
        reqObj["buildingEntity"] = tskArr;
  
        console.log("reqObj --->", reqObj);
  
        const data:any = await this.projectService.UpdateBuildingTypeById(reqObj).toPromise();
        if (data.status === "200") {
          await this.fetchExistingClosingSteps();
          this.closeAddEditListing();
          this.toast.success(data.desc);
        } else {
          this.toast.error("Something went wrong");
        }
      } else {
        reqObj["buildingEntity"] = tskArr;
  
        console.log("reqObj---->", reqObj);
  
        const data:any = await this.projectService.AddBuildingType(reqObj).toPromise();
        if (data.status === "200") {
          await this.fetchExistingClosingSteps();
          this.closeAddEditListing();
          this.toast.success("New Building Type Added");
        } else {
          this.toast.error("Something went wrong");
        }
      }
    } catch (error) {
      this.toast.error("An error occurred");
      console.error("Error in saveClosingSteps:", error);
    } finally {
      this.spinner.hide();
    }
  }
  
  assigntskRl(value, index) {
    console.log(value, index);
    let tskList = this.addBuildingTypeFrm.get("taskList") as FormArray;
    tskList.at(index).patchValue({
      assignRoleId: value.value,
    });
  }

  fetchExistingClosingSteps() {
    this.projectService.GetAllBuildingTypesOrgID().subscribe((data: any) => {
      if (data != null) {
        this.closingStepsServ = data;
      } else {
        this.closingStepsServ = [];
      }
    });
  }

  //edit service
  editTmplt(editServiceData) {
    //this.addBuildingTypeFrm.reset();
    this.addClosingServFormInputs();
    this.addTaskListFrmInput();

    this.spinner.show();
    this.editClosingStepSrvId = editServiceData.id;
    var tskArr = [];

    let tskList = this.addBuildingTypeFrm.get("taskList") as FormArray;

    this.addBuildingTypeFrm.patchValue({
      serTermName: editServiceData.typeName,
    });

    editServiceData.buildingEntity.map((el, i) => {
      tskList.push(
        this.formBuilder.group({
          id: el.id,
          taskName: el.name,
          taskDescription: el.description,
          //  assignRoleId: el.assignRoleId,
          //  accessType: el.accessType,
          //  approverlvlone: el.approverlvlone ? el.approverlvlone  : "" ,
          // approverlvltwo: el.approverlvltwo ? el.approverlvltwo  : "",
        })
      );

      //   let tskList = this.addBuildingTypeFrm.get('taskList') as FormArray;
      // tskList.at(i).patchValue({
      //   assignRoleId: el.assignRoleId
      // })
    });

    //console.log(taskList.controls[i].get('assignRoleId'))
    this.prjtListing = false;
    this.editMdSelected = true;
    this.spinner.hide();
  }
}
