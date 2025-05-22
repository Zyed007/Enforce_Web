import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { Select2OptionData, Select2TemplateFunction } from "ng2-select2";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TaskService } from "../../services/task.service";
import moment = require("moment");
import { EmployeeService } from "../../services/employee.service";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { TeamService } from "../../services/team.service";
import { DesignationService } from "../../services/designation.service";
import { DepartmentService } from "../../services/department.service";
import { DataManager } from "@syncfusion/ej2-data";
import { NgxSpinnerService } from "ngx-spinner";
import { ProjectService } from "../../services/project.service";
import { CostService } from "../../services/cost.service";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";
import { ModuleSetupService } from "../../services/moduleSetup.service";
import { MultiSelectComponent } from "@syncfusion/ej2-angular-dropdowns";
import { UserService } from "../../services/user.service";
import { identifierModuleUrl } from "@angular/compiler";
import { Tooltip, TooltipEventArgs } from "@syncfusion/ej2-popups";
import * as _ from "lodash";

@Component({
  selector: "app-role-mgt",
  templateUrl: "./role-mgt.component.html",
  styleUrls: ["./role-mgt.component.scss"],
})
export class RoleMgtComponent implements OnInit {
  incrementValue = 0;
  public taskPriority: string;
  public dateValue;
  public taskStatus: string;
  public taskPriorData: Array<Select2OptionData>;
  public taskStatusData: Array<Select2OptionData>;
  public assigneeData: Array<Select2OptionData>;
  public teamData: Array<Select2OptionData>;
  public approverData: Array<Select2OptionData>;
  public milestoneData: Array<Select2OptionData>;
  public milestoneValue = "";
  public showTaskList = true;
  public showAddForm = false;
  public assigneeStatus: string[];
  public taskOptions: Select2Options;
  public assigneeOptions: Select2Options;

  public editable = false;
  public taskForm: FormGroup;
  public form: FormGroup;
  public ejsDueDate;
  groupModel: any;
  p: number = 1;
  public filterEmpByDesgn = false;
  public filterEmpByDept = false;
  public filterEmpByFreeLanc = false;
  public filterEmpByOutsource = false;
  empDataSource: any;

  public deptOptions: Select2Options;

  // public date=moment().format('dddd, D MMM YYYY');
  public dueDate;
  public teamMembers = [];
  public teamMemFetchData = [];
  public teams = [];
  dropdownList = [];
  selectedItems = [];
  repsData = [];
  dropdownSettings = {};

  public teamsValFetchData = [];
  public disableTaskStatus = false;
  dataSource: any;
  //dataSource: MatTableDataSource<UserData>;
  employeeList = [];
  // private paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("checkbox", { static: false })
  sections: MultiSelectComponent;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = [
    "index",
    "task_name",
    "full_name",
    "status_name",
    "priority_name",
    "due_date",
    "Action",
  ];
  displayedEmpColumns = ["index", "Job", "CheckIn", "CheckOut", "Action"];
  public AddNewSubmit = true;
  public options: Select2Options;
  public desgnData: Array<Select2OptionData>;
  public deptData: Array<Select2OptionData>;

  approversTextData;
  allowAccess = false;
  noAllowAccess = true;

  public selectedApprovers = [];
  public selectedSections = [];
  public isValid = true;
  public typeOfUnit = [
    {
      id: "1",
      text: "Floors",
    },
    {
      id: "2",
      text: "Unit",
    },
    {
      id: "3",
      text: "Project",
    },
  ];
  public hoursData = [
    {
      id: "1",
      text: "3 months",
    },
    {
      id: "2",
      text: "6 months",
    },
    {
      id: "3",
      text: "12 months",
    },
  ];
  statelist = [
    {
      text: "state1",
      id: "1",
      cities: [
        { id: "city-1", text: "city-1" },
        { id: "city-2", text: "city-2" },
      ],
    },
    {
      text: "state2",
      id: "2",
      cities: [
        { id: "city-3", text: "city-3" },
        { id: "city-4", text: "city-4" },
      ],
    },
    // { name: "state3", cities: ["city-5", "city-6"] },
    // { name: "state4", cities: ["city-7", "city-8"] }
  ];
  editTaskId: any;
  searchField: string;
  teamAdd: boolean;
  teamValue: any;
  teamMembersData: { id: string; text: string }[];
  desgnEmpValue: any;
  deptEmpValue: any;
  teamEmpName: string;
  teamMemberValue: any;
  approver: boolean;
  pageSettings: { pageSizes: boolean; pageCount: number };
  toolbar: string[];
  isApprove: any;
  approverTaskValue: any = "";
  taskApprove: any;
  addformSubmitted: any = false;
  showerrorMsg: boolean;
  editformSubmitted: any = false;
  emptoolbar: string[];
  @ViewChild("empgrid", { static: false })
  empgrid;
  @ViewChild("grid", { static: false })
  grid;
  selectedCategData: {
    id: string;
    text: string;
    additional: { teamBy: string };
  }[];
  acttaskListValue: any = "";
  recentTaskSel: boolean;
  activityDataText: any;
  projidText: any;
  projid = "";
  recentActSel: boolean;
  activtasksList: { id: string; text: string }[];
  linkToProj: boolean;
  jobOptions: {
    placeholder: string;
    width: string;
    templateResult: Select2TemplateFunction;
    templateSelection: Select2TemplateFunction;
  };
  leadValue: any;
  showAssigneeApprove: boolean = false;
  showAssigneeLead: boolean = false;
  emailForm: FormGroup;
  submitClicked: boolean = false;
  hourValue: any;
  milestoneTaskLength: number;
  ejsModuleList: { id: string; text: string }[];
  ejsAcessList: { id: string; text: string }[];
  itemList: { id: number; itemName: string; category: string }[];
  settings: {
    singleSelection: boolean;
    text: string;
    selectAllText: string;
    unSelectAllText: string;
    searchPlaceholderText: string;
    enableSearchFilter: boolean;
    badgeShowLimit: number;
    groupBy: string;
  };
  duplicatedValues: any = [];
  duplicatedNames: any = [];
  sectionIndex: any;
  addSection: boolean;
  sectionListResults: any[];
  nameExists = false;
  missingApprovers = false;

  editSelectedRole;

  allApproversData: any[];

  constructor(
    private modalService: NgbModal,
    public taskService: TaskService,
    private projectService: ProjectService,
    private costService: CostService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private deptService: DepartmentService,
    private desgnService: DesignationService,
    private teamService: TeamService,
    private formBuilder: FormBuilder,
    public empService: EmployeeService,
    private userService: UserService,
    protected cdr: ChangeDetectorRef,
    private moduleSetupService: ModuleSetupService
  ) {
    this.deptOptions = {
      placeholder: { id: "  ", text: "Select Approver" },
      allowClear: true,
      width: "100%",
    };

    this.taskPriority = "0";
    this.taskStatus = "0";

    this.options = {
      multiple: true,
      placeholder: "Select",
      // allowClear: true,
      width: "100%",
      templateResult: this.templateResult,
      templateSelection: this.templateSelection,
    };
    this.jobOptions = {
      placeholder: "Select",
      width: "100%",
      templateResult: this.templateResult,
      templateSelection: this.templateSelection,
    };
    this.taskStatusData = [];
    this.assigneeData = [];
    this.taskOptions = {
      placeholder: { id: "", text: "Select" },
      width: "100%",
    };
    this.assigneeOptions = {
      multiple: true,
      placeholder: "Select",
      width: "100%",
      templateResult: this.templateResult,
      templateSelection: this.templateSelection,
    };
  }
  public changedPriority(e: any): void {
    this.taskPriority = e.value;
  }
  public changedMilestone(e) {
    this.milestoneValue = e.value;

    const emails = this.emailForm.get("emails") as FormArray;

    if (e.value != "") {
      this.getAllStaticMilestoneTasks(e.value);
    }
  }

  ngOnDestroy() {
    this.tooltip.destroy();
  }

  public content;
  public tooltip: Tooltip;
  ngAfterViewInit() {
    //Initialize Tooltip component
    this.tooltip = new Tooltip({
      // default content of tooltip
      content: "Loading...",
      // set target element to tooltip
      target: ".e-list-item",
      // set position of tooltip
      position: "TopCenter",
      // bind beforeRender event
      beforeRender: this.onBeforeRender,
    });
    this.tooltip.appendTo("body");
  }

  onBeforeRender(args: TooltipEventArgs): void {
    // get the target element
    let listElement = document.getElementById("multiselect-checkbox");
    if (listElement === null) {
      console.log(typeof listElement);
      return;
    }
    var resultNew = [];
    var newElm = document.getElementsByClassName("e-multiselect");
    Array.from(newElm).forEach((el: any, index: any) => {
      // Do stuff here
      if (el.ej2_instances != null) {
        //console.log('el--->',el.ej2_instances[0].dataSource)

        (el as any).ej2_instances[0].dataSource.map((itm: any) => {
          //console.log("itm--->",itm);
          resultNew.push(itm);
        });
      }
    });

    let i: number;
    for (i = 0; i < resultNew.length; i++) {
      if ((resultNew[i] as any).text === args.target.textContent) {
        // this.content  = 'New Tool Tip'
        this.content = (resultNew[i] as any).content;
        break;
      } else {
        this.content = args.target.textContent;
      }
    }
    let isExist = resultNew.filter(
      (el: any) => el.text == args.target.textContent
    );
    if (isExist.length == 0) {
      args.cancel = true;
    }
  }

  onChangeState(event, index) {
    const emails = this.emailForm.get("emails") as FormArray;

    emails.get([index + "", "cities_list"]).patchValue(event.cities);
    console.log(event);
  }

  public changedHours(e) {
    this.hourValue = e.value;
  }

  public AddUnitDesc(index) {
    console.log("justin", index);
    const emails = this.emailForm.get("emails") as FormArray;
    this.addSection = true;
    let moduleName = [];

    for (var i = 0; i < emails.length; i++) {
      moduleName.push({ id: emails.value[i]["ModuleName"] });
    }
    let updatedModuleList = [];
    for (var j = 0; j < moduleName.length; j++) {
      for (var i = 0; i < this.ejsModuleList.length; i++) {
        if (this.ejsModuleList[i].id != moduleName[j]) {
          updatedModuleList.push({ id: this.ejsModuleList[i] });
        }
      }
    }

    var uniqueResultTwo = this.ejsModuleList.filter(function (obj) {
      return !moduleName.some(function (obj2) {
        return obj.id == obj2.id;
      });
    });

    console.log("uniqueResultTwo", uniqueResultTwo);

    if (this.duplicatedValues.length == 0 && this.emailForm.status == "VALID") {
      this.addSection = false;

      emails.insert(index + 1, this.createEmailFormGroup());
      emails.at(index + 1).patchValue({ ModuleList: uniqueResultTwo });
      this.incrementValue = index + 1;
      // emails.at(index+1).patchValue({ ModuleList: this.ejsModuleList});
    }
  }
  public goBack() {
    window.history.go(-1);
  }
  isFieldValid(field: string) {
    if (this.addformSubmitted) {
      return (
        (this.showerrorMsg = true),
        (this.taskForm.get(field).errors && this.taskForm.get(field).touched) ||
          (this.taskForm.get(field).untouched && this.addformSubmitted)
      );
    } else if (this.editformSubmitted) {
      return (
        (this.showerrorMsg = true),
        this.taskForm.get(field).errors && this.editformSubmitted
      );
    } else {
      return (this.showerrorMsg = false), false;
    }
  }
  public checkIsProject(e: any) {
    if (e.srcElement.checked) {
      this.linkToProj = true;
    } else {
      this.linkToProj = false;
    }
  }
  public FetchAllProjectByOrgID() {
    this.projectService.FetchAllProjectByOrgID().subscribe(
      (projectData: any) => {
        var results = [{ id: "", text: "Select", additional: { teamBy: "" } }];
        // let dataObj = JSON.parse(data['token']);
        //
        if (projectData) {
          for (var i = 0; i < projectData.length; i++) {
            // logik to create new items

            results.push({
              id: projectData[i].project_id,
              text: projectData[i].project_name,
              additional: {
                teamBy: projectData[i].project_prefix,
              },
            });
          }
        }

        this.selectedCategData = results;
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
  public changedProjAct(e: any): void {
    if (e.value) {
      this.acttaskListValue = e.value;

      this.activityDataText = e.data[0].text;
      this.recentTaskSel = false;
    } else {
      this.recentTaskSel = true;
    }
  }
  public changedOption(e: any) {
    if (e.value) {
      this.projidText = e.data[0].text;
      this.projid = e.value;
      this.recentActSel = false;
    } else {
      this.recentActSel = true;
    }

    this.fetchActByProjectID(e.value);
    // this.showAdminTasks=true;
  }

  public fetchActByProjectID(projectId) {
    let project_id = {
      ID: projectId,
    };

    this.projectService.GetProjectActivityByProjectID(project_id).subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            results.push({
              id: data[i].id,
              text: data[i].activity_name,
            });
          }
        }

        this.activtasksList = results;
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
  changedTaskApprover(e) {
    this.approverTaskValue = e.value;
  }
  public checkIsDept(e: any): void {
    if (e.srcElement.checked) {
      this.filterEmpByDept = true;
    } else {
      this.filterEmpByDept = false;
    }
    // this.filterEmpByDept=!this.filterEmpByDept
    if (this.filterEmpByDept) {
      this.getAllDept();
      this.teamData = [];

      $("#toggleDesgnCheck").attr("disabled", "disabled");
      $("#toggleFreeLanCheck").attr("disabled", "disabled");
      $("#toggleOutSourceCheck").attr("disabled", "disabled");
    } else {
      $("#toggleDesgnCheck").removeAttr("disabled");
      $("#toggleFreeLanCheck").removeAttr("disabled");
      $("#toggleOutSourceCheck").removeAttr("disabled");
    }
  }
  public checkIsDesgn(e: any): void {
    if (e.srcElement.checked) {
      this.filterEmpByDesgn = true;
    } else {
      this.filterEmpByDesgn = false;
    }
    this.teamData = [];
    if (this.filterEmpByDesgn) {
      this.getAllDesignationByOrgID();

      $("#toggleDeptCheck").attr("disabled", "disabled");
      $("#toggleFreeLanCheck").attr("disabled", "disabled");
      $("#toggleOutSourceCheck").attr("disabled", "disabled");
    } else {
      $("#toggleDeptCheck").removeAttr("disabled");
      $("#toggleFreeLanCheck").removeAttr("disabled");
      $("#toggleOutSourceCheck").removeAttr("disabled");
    }
  }
  public checkIsFreeLan(e: any): void {
    if (e.srcElement.checked) {
      this.filterEmpByFreeLanc = true;
    } else {
      this.filterEmpByFreeLanc = false;
    }
    if (this.filterEmpByFreeLanc) {
      this.EmpList();

      $("#toggleDeptCheck").attr("disabled", "disabled");
      $("#toggleDesgnCheck").attr("disabled", "disabled");
      $("#toggleOutSourceCheck").attr("disabled", "disabled");
    } else {
      $("#toggleDeptCheck").removeAttr("disabled");
      $("#toggleDesgnCheck").removeAttr("disabled");
      $("#toggleOutSourceCheck").removeAttr("disabled");
    }
  }
  public checkIsOutsource(e: any): void {
    if (e.srcElement.checked) {
      this.filterEmpByOutsource = true;
    } else {
      this.filterEmpByOutsource = false;
    }
    if (this.filterEmpByOutsource) {
      this.EmpList();

      $("#toggleDeptCheck").attr("disabled", "disabled");
      $("#toggleFreeLanCheck").attr("disabled", "disabled");
      $("#toggleDesgnCheck").attr("disabled", "disabled");
    } else {
      $("#toggleDeptCheck").removeAttr("disabled");
      $("#toggleFreeLanCheck").removeAttr("disabled");
      $("#toggleDesgnCheck").removeAttr("disabled");
    }
  }
  public changedStatus(e: any): void {
    this.taskStatus = e.value;
  }
  public changedAssignee(e: any): void {
    let user_info: object;
    if (localStorage.getItem("user_info")) {
      user_info = JSON.parse(localStorage.getItem("user_info"));
    }
    this.assigneeStatus = e.value;

    if (this.assigneeStatus.length == 1) {
      if (this.assigneeStatus[0] == user_info["id"]) {
        this.showAssigneeApprove = false;
        this.showAssigneeLead = false;
      } else {
        this.showAssigneeApprove = true;
        this.showAssigneeLead = true;
      }
    } else if (this.assigneeStatus.length > 1) {
      this.showAssigneeLead = true;

      this.showAssigneeApprove = true;
    } else {
      this.showAssigneeLead = false;

      this.showAssigneeApprove = false;
    }
  }
  public changedLeadAssignee(e: any): void {
    this.leadValue = e.value;
  }
  public changedTeam(e: any): void {
    this.teamValue = e.value;
  }
  public sectionList: { [key: string]: Object }[] = [
    // { "Section": "Edit Project","Id": "item1" },
    // { "Section": "Assign Task","Id": "item2" },
    // { "Section": "View Activities",  "Id": "item3" },
    // { "Section": "View Checkin",  "Id": "item4" },
  ];
  // map the groupBy field with category column
  public checkFields: Object = { text: "text", value: "id", tooltip: "id" };
  // set the placeholder to the MultiSelect input
  public checkWaterMark: string = "Select";
  // set enableGroupCheckBox value to the Multiselect input
  public enableGroupCheckBox: boolean = true;
  // set mode value to the multiselect input
  public mode: string = "CheckBox";
  // set filterBarPlaceholder value to the Multiselect input
  public filterBarPlaceholder: string = "Search";
  public changedEmpDept(e: any): void {
    this.deptEmpValue = e.value;

    if (e.value) {
      this.EmpList();
    }
  }
  public changedEmpDesgn(e: any): void {
    this.desgnEmpValue = e.value;
    if (e.value) {
      this.EmpList();
    }
  }
  public RemoveUnitDesc(i: number) {
    const emails = this.emailForm.get("emails") as FormArray;

    if (emails.length != 0 && emails.value[i].sectionArray.length > 0) {
      emails.value[i].sectionArray.map((el) => {
        if (this.selectedApprovers.length > 0) {
          this.selectedApprovers = this.selectedApprovers.filter(
            (em) => em.id != el
          );
        }
      });
      emails.removeAt(i);
    } else if (emails.value[i].sectionArray.length == 0) {
      emails.removeAt(i);
    }
    this.duplicatedValues = [];
    this.incrementValue = this.incrementValue - 1;
  }
  changedEjsMilest(e: any): void {
    this.desgnEmpValue = e.value;
    if (e.value) {
      this.EmpList();
    }
  }
  public EmpList() {
    if (this.filterEmpByDept) {
      let deptId = {
        ID: this.deptEmpValue,
      };
      this.empService.getEmpByDeptID(deptId).subscribe(
        (data: any) => {
          var results = [{ id: "", text: "Select" }];
          if (data) {
            for (var i = 0; i < data.length; i++) {
              results.push({
                id: data[i].id,
                text: data[i].full_name,
              });
            }
          }

          this.teamMembersData = results;
          // this.teamLeadData=results;
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
    } else if (this.filterEmpByDesgn) {
      let desgnId = {
        ID: this.desgnEmpValue,
      };
      this.empService.getEmpByDesgnID(desgnId).subscribe(
        (data: any) => {
          var results = [{ id: "", text: "Select" }];
          if (data) {
            for (var i = 0; i < data.length; i++) {
              results.push({
                id: data[i].id,
                text: data[i].full_name,
              });
            }
          }

          this.teamMembersData = results;
          // this.teamLeadData=results;
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
    } else if (this.filterEmpByFreeLanc) {
      this.empService.getAllFreelancerEmpByOrgID().subscribe(
        (data: any) => {
          var results = [{ id: "", text: "Select" }];
          if (data) {
            for (var i = 0; i < data.length; i++) {
              results.push({
                id: data[i].id,
                text: data[i].full_name,
              });
            }
          }

          this.teamMembersData = results;
          // this.teamLeadData=results;
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
    } else if (this.filterEmpByOutsource) {
      this.empService.getAllOutsourcedEmpByOrgID().subscribe(
        (data: any) => {
          var results = [{ id: "", text: "Select" }];
          if (data) {
            for (var i = 0; i < data.length; i++) {
              results.push({
                id: data[i].id,
                text: data[i].full_name,
              });
            }
          }

          this.teamMembersData = results;
          // this.teamLeadData=results;
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
    } else {
      this.empService.getEmployeeByOrgId().subscribe(
        (data: any) => {
          var results = [{ id: "", text: "Select" }];
          if (data) {
            for (var i = 0; i < data.length; i++) {
              results.push({
                id: data[i].id,
                text: data[i].full_name,
              });
            }
          }

          this.teamMembersData = results;
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

  public AddForm() {
    this.showTaskList = false;
    this.showAddForm = true;
    this.selectedApprovers = [];
    this.editformSubmitted = false;
    this.addformSubmitted = false;
    this.GetAllModules();
    this.editSelectedRole = "";
    this.missingApprovers = false;
    // this.getAllStaticMilestone();
  }
  public GetAllModules() {
    this.moduleSetupService.GetAllModules().subscribe((data: any) => {
      var results = [{ id: "", text: "Select Module" }];

      // let dataObj = JSON.parse(data['token']);
      //

      for (var i = 0; i < data.length; i++) {
        // logik to create new items

        results.push({
          id: data[i].id,
          text: data[i].module_name,
        });
      }

      this.ejsModuleList = results;
      const emails = this.emailForm.get("emails") as FormArray;
      // this.addSection=true;
      let moduleName = [];

      for (var i = 0; i < emails.length; i++) {
        moduleName.push({ id: emails.value[i]["ModuleName"] });
      }
      console.log("moduleName", moduleName);
      let updatedModuleList = [];
      for (var j = 0; j < moduleName.length; j++) {
        for (var i = 0; i < this.ejsModuleList.length; i++) {
          if (this.ejsModuleList[i].id != moduleName[j]) {
            updatedModuleList.push({ id: this.ejsModuleList[i] });
          }
        }
      }

      var uniqueResultTwo = this.ejsModuleList.filter(function (obj) {
        return !moduleName.some(function (obj2) {
          return obj.id == obj2.id;
        });
      });
      emails.at(0).patchValue({ ModuleList: this.ejsModuleList });
    });
  }
  public getAllDept() {
    this.deptService.getAllDept().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            results.push({
              id: data[i].id,
              text: data[i].dep_name,
            });
          }
        }

        this.deptData = results;
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
  public getAllDesignationByOrgID() {
    this.desgnService.getAllDesignationByOrgID().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            results.push({
              id: data[i].id,
              text: data[i].designation_name,
            });
          }
        }

        this.desgnData = results;
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
  public onEmpListByChange(val) {
    if (val == "Department") {
      this.filterEmpByDept = true;
      this.filterEmpByDesgn = false;
      this.filterEmpByFreeLanc = false;
      this.filterEmpByOutsource = false;
      this.getAllDept();
    } else if (val == "Designation") {
      this.filterEmpByDesgn = true;
      this.filterEmpByDept = false;
      this.filterEmpByFreeLanc = false;
      this.filterEmpByOutsource = false;
      this.getAllDesignationByOrgID();
    } else if (val == "Freelance") {
      this.filterEmpByDesgn = false;
      this.filterEmpByDept = false;
      this.filterEmpByFreeLanc = true;
      this.filterEmpByOutsource = false;
    } else {
      this.filterEmpByDesgn = false;
      this.filterEmpByDept = false;
      this.filterEmpByFreeLanc = false;
      this.filterEmpByOutsource = true;
    }
    this.EmpList();
  }
  public templateResult: Select2TemplateFunction = (
    state: Select2OptionData
  ): JQuery | string => {
    if (!state.id) {
      return state.text;
    }

    return jQuery(
      "<div><b>" +
        state.text +
        "</b> " +
        "<span> " +
        state.additional.teamBy +
        "</span></div>"
    );
  };

  // function for selection template
  public templateSelection: Select2TemplateFunction = (
    state: Select2OptionData
  ): JQuery | string => {
    if (!state.id) {
      return state.text;
    }

    return jQuery(
      "<span><b>" + state.text + "</b> " + state.additional.teamBy + "</span>"
    );
    //return jQuery('<div><b>' + state.text+ '</b></div> ' + '<div>'+ state.additional.teamBy + '</div>');
  };
  public FindTeamsByOrgID() {
    this.teamService.FindTeamsByOrgID().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select", additional: { teamBy: "" } }];
        // let dataObj = JSON.parse(data['token']);
        //
        if (data) {
          for (var i = 0; i < data.length; i++) {
            // logik to create new items

            results.push({
              id: data[i].id,
              text: data[i].team_name,
              additional: {
                teamBy: data[i].team_by,
              },
            });
          }
        }

        this.teamData = results;
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

  selectAccessType(selVal, sectId) {
    console.log("selVal--->", selVal);
    if (selVal === "fullAccess") {
      this.selectedSections.map((elem) => {
        if (elem.id == sectId) {
          elem["isDualApprover"] = elem["isDualApprover"]
            ? false
            : elem["isDualApprover"];
          elem["isSingleApprover"] = elem["isSingleApprover"]
            ? false
            : elem["isSingleApprover"];
          elem["fullAccess"] = true;
          elem["approver1"] = null;
          elem["approver2"] = null;
        }
      });

      this.repsData.map((elem) => {
        if (elem.id == sectId) {
          elem["isDualApprover"] = elem["isDualApprover"]
            ? false
            : elem["isDualApprover"];
          elem["isSingleApprover"] = elem["isSingleApprover"]
            ? false
            : elem["isSingleApprover"];
          elem["fullAccess"] = true;
          elem["approver1"] = null;
          elem["approver2"] = null;
        }
      });
    } else if (selVal === "single") {
      this.selectedSections.map((elem) => {
        if (elem.id == sectId) {
          console.log("Check FA", elem["fullAccess"]);
          elem["fullAccess"] = elem["fullAccess"] ? false : elem["fullAccess"];
          elem["isDualApprover"] = elem["isDualApprover"]
            ? false
            : elem["isDualApprover"];
          elem["isSingleApprover"] = true;
          elem["approver2"] = null;
        }
      });

      this.repsData.map((elem) => {
        if (elem.id == sectId) {
          elem["fullAccess"] = elem["fullAccess"] ? false : elem["fullAccess"];
          elem["isDualApprover"] = elem["isDualApprover"]
            ? false
            : elem["isDualApprover"];
          elem["approver2"] = null;
          elem["isSingleApprover"] = true;
        }
      });
    } else if (selVal === "dual") {
      this.selectedSections.map((elem) => {
        if (elem.id == sectId) {
          elem["fullAccess"] = elem["fullAccess"] ? false : elem["fullAccess"];
          elem["isDualApprover"] = true;
        }
      });

      this.repsData.map((elem) => {
        if (elem.id == sectId) {
          elem["fullAccess"] = elem["fullAccess"] ? false : elem["fullAccess"];
          elem["isDualApprover"] = true;
        }
      });
    }
  }
  public TaskView() {
    this.selectedSections = [];
    this.isValid = true;
    this.selectedApprovers = [];
    this.editSelectedRole = "";

    this.fetchDataGrid();
    this.clearForm();
    this.showTaskList = true;
    this.showAddForm = false;
    this.editable = false;
    this.linkToProj = false;
    this.addformSubmitted = false;
    this.editformSubmitted = false;
    this.addSection = false;
    this.projid = "";
    this.acttaskListValue = "";
    const emails = this.emailForm.get("emails") as FormArray;
    // emails.value.forEach((value, index) => {
    //   console.log('forEach',index);
    //   //  if(index!=0){
    //     emails.removeAt(index)
    //   // } // 0, 1, 2

    // });
    if (emails.length > 1) {
      // for (var i = emails.length; i <= emails.value.length; i--) {
      //   console.log('emails.value',emails.value.length,i);
      //       // logik to create new items
      //       // emails.at(i).patchValue({'sectionArray':'',ModuleName: '',AcessType:''})
      //      if(i!=0){
      //       emails.removeAt(i)
      //      }
      //       }
    } else {
      //     emails.at(0).patchValue({'sectionArray':'',ModuleName: '',AcessType:''})
      //     emails.reset()
      // console.log('reset',emails.value.length)
    }
    // const emails = this.emailForm.get('emails') as FormArray
    // emails.clear();
    // this.createEmailFormGroup();
    // if (emails.length >1) {
    //   emails.clear()
    // }else{
    //   emails.reset()
    // }

    // if (emails.length > 1) {
    //   emails.removeAt(i)
    // } else {
    //   emails.reset()
    // }
    // if (emails.length >= 1) {
    //   //emails.removeAt(i)
    //   for (var i = 0; i < emails.length; i++) {
    //     // logik to create new items

    //     emails.removeAt(i)

    //     }

    // } else {
    //   emails.reset()
    //   emails.controls.forEach(pair => pair.patchValue({ ModuleName: '',AcessType:'',sectionArray:[] }));

    // }

    emails.clear();
    emails.insert(0, this.createEmailFormGroup());
  }
  isRecentActFieldValid() {
    if (this.addformSubmitted) {
      if (this.linkToProj && this.projid == "") {
        this.recentActSel = true;
      } else if (this.linkToProj && this.acttaskListValue == "") {
        this.recentTaskSel = true;
      }
    } else {
      return (
        // this.showerrorMsg=false,

        false
      );
    }
  }

  public onAddSubmit() {
    this.submitClicked = true;

    console.log(this.selectedApprovers);

    //  if(this.selectedApprovers.length == 0) {
    //   Swal.fire(
    //     'Error!',
    //     'Please Add Approvers for Sections',
    //     'error'
    //   );
    //   return
    //  }

    const emails = this.emailForm.get("emails") as FormArray;
    let user;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    let sectionData = [];
    for (var i = 0; i < emails.value.length; i++) {
      var moduleSections = [];

      for (var j = 0; j < emails.value[i].sectionArray.length; j++) {
        var obj = {
          id: emails.value[i].sectionArray[j],
          module_id: null,
          section_name: null,
          moduleSectionPolicy: {
            id: null,
            section_id: null,
            is_allow: emails.value[i].AcessType == "Allow" ? true : false,
            is_deny: emails.value[i].AcessType == "Deny" ? true : false,
          },
        };

        this.selectedApprovers.map((apprv) => {
          if (apprv.id == obj.id) {
            obj.moduleSectionPolicy["is_full_access"] = apprv.fullAccess;
            obj.moduleSectionPolicy["approver1_roleId"] = apprv.approver1;
            obj.moduleSectionPolicy["approver2_roleId"] = apprv.approver2;
          }
        });

        moduleSections.push(obj);
      }

      // 36d99bb6-ba7e-4c7e-8fb7-3980928642a6
      //  86ba5b6f-37c6-433a-94d0-ccce507b6b70

      moduleSections.map((itm) => {
        console.log(itm.id);
        if (
          itm.id === "23046a38-1fdf-4788-aa4b-792ff70dcb09" ||
          itm.id === "28237156-d239-4632-8512-f8a47aeeb6f8" ||
          itm.id === "a004eff3-9993-4bb8-99aa-242e56776330" ||
          itm.id === "b20769d0-ac3c-4075-b3ac-07bf4a764baf" ||
          itm.id === "b7e3d3cb-f494-4a4e-aff4-c2e73361fcee" ||
          itm.id === "ba629656-d649-4e0b-aee4-4c0d6275c4e9" ||
          itm.id === "b4f7216e-dd7e-42e5-9907-a090707c28d2" ||
          itm.id === "c7c53e95-d9a1-448e-822d-13c85e4c62d4" ||
          itm.id === "36d99bb6-ba7e-4c7e-8fb7-3980928642a6" ||
          itm.id === "86ba5b6f-37c6-433a-94d0-ccce507b6b70" ||
          itm.id === "8a55082f-5185-4d28-9098-4f268cb47d51" ||
          itm.id === "ed92bf11-d425-4962-bcf8-c7c96cb18091"
        ) {
          if (
            itm.moduleSectionPolicy.is_full_access === undefined ||
            itm.moduleSectionPolicy.is_full_access === false
          ) {
            if (itm.moduleSectionPolicy.approver1_roleId === undefined) {
              if (itm.moduleSectionPolicy.approver2_roleId === undefined) {
                this.missingApprovers = true;
              }
            }
          }
        } else {
          if (
            itm.id === "05ce9c8a-d9c8-4ea7-8225-352ede4adf7d" ||
            itm.id === "ea8643fe-135e-4468-b722-5537cd76487d" ||
            itm.id === "8a5187b2-cec7-4360-be13-04b217de6b6f" ||
            itm.id === "b833ad17-8220-4a8e-9012-3a4ca1796076" ||
            itm.id === "e2aefc13-b5da-4f50-ad34-fa17c0861154" ||
            itm.id === "d42b9416-ff69-452d-90ec-adc3bc723180"
          ) {
            itm.moduleSectionPolicy.is_full_access = true;
          }
        }
      });

      sectionData.push({
        id: emails.value[i].ModuleName,
        org_id: localStorage.getItem("org_id"),
        module_name: null,
        createdby: user["full_name"],
        moduleSections: moduleSections,
      });
    }

    let postData = {
      id: null,
      role_name: this.taskForm.get("name").value,
      role_desc: this.taskForm.get("description").value,
      role_id: "null",
      module_id: "null",
      modules: sectionData,
    };

    if (this.missingApprovers) {
      Swal.fire(
        "Error!",
        "Please Add Approvers for Selected Sections",
        "error"
      );
      return;
    }

    if (this.taskForm.get("name").value == "") {
      Swal.fire("Error!", "Please Add Role Name", "error");
      return;
    }

    if (this.emailForm.get("emails").status == "VALID" && !this.nameExists) {
      this.spinner.show();
      return this.moduleSetupService.AddRoleModules(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.TaskView();
            this.submitClicked = false;
            this.selectedApprovers = [];
            this.spinner.hide();
            emails.clear();
            emails.insert(0, this.createEmailFormGroup());
            this.GetAllRoleModulesByOrgID();
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          } else {
            this.spinner.hide();
            Swal.fire("Error!", "Something went wrong.", "error").then(
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

  existRole(e) {
    let postData = {
      id: e.target.value,
    };
    this.moduleSetupService.FindByRoleNameandOrg(postData).subscribe(
      (data: any) => {
        console.log("FindByRoleName", data);
        if (data)
          if (data.role_name) {
            this.nameExists = true;
          } else {
            this.nameExists = false;
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

  public createEditList(list) {
    const emails = this.emailForm.get("emails") as FormArray;
    if (emails.length > 1) {
      emails.clear();
    } else {
      emails.clear();
    }
    this.editable = true;
    // const emails = this.emailForm.get('emails') as FormArray
    var results = [];
    if (list != null && list.length != 0) {
      for (var i = 0; i < list.length; i++) {
        emails.push(this.createEmailFormGroup());
        var tags = [];
        var sectionList = [];
        var modulesList = [];
        let section = "";
        if (
          list[i].moduleSectionsAllow != null &&
          list[i].moduleSectionsAllow.length != 0
        ) {
          section = "Allow";
          for (var j = 0; j < list[i].moduleSectionsAllow.length; j++) {
            tags.push(list[i].moduleSectionsAllow[j].id);
          }
          modulesList.push({
            id: list[i].moduleSectionsAllow[0].module_id,
            text: list[i].module_name,
          });

          console.log("modulesList1", modulesList);
        } else if (
          list[i].moduleSectionsDeny != null &&
          list[i].moduleSectionsDeny.length != 0
        ) {
          section = "Deny";

          for (var j = 0; j < list[i].moduleSectionsDeny.length; j++) {
            tags.push(list[i].moduleSectionsDeny[j].id);
          }
          modulesList.push({
            id: list[i].moduleSectionsDeny[0].module_id,
            text: list[i].module_name,
          });
          console.log("moduleSectionsDeny", modulesList);
        }

        console.log("moduleSections", sectionList);
        let postData = {
          id: list[i].id,
        };
        //       this.moduleSetupService.FindByModulesID(postData).subscribe(
        //         (data:any)  => {
        // if(data.moduleSections && data.moduleSections.length!=0){
        // var results=[]
        //         for(var k=0;k<data.moduleSections.length;k++){
        //           results.push({
        //             Section:data.moduleSections[k].section_name,
        //             Id:data.moduleSections[k].id
        //           })

        //         }
        //         // tags=results;
        //         console.log('results',results);
        //         this.sectionListResults=results
        //          console.log('emails',emails);

        // }

        //         },
        //         error  => {
        //           Swal.fire(
        //             'Error!',
        //             error,
        //             'error'
        //           ).then(
        //             (result)=> {

        //             })

        //         }

        //         )

        console.log("modulesList", modulesList);

        // console.log('section_list',this.sectionListResults.length!=0?this.sectionListResults:'sas');
        results.push({
          ModuleList: modulesList,
          ModuleName: list[i].id,
          sectionArray: tags,
          AcessType: section,
        });
        this.changedEjsModule(list[i].id, i, "edit");

        // emails.controls.forEach(pair => pair.patchValue({ Label: list[i].id, is_checkbox: list[i].is_checkbox }));
      }
    }

    //Push Slected Approvers

    for (let j = 0; j < results.length; j++) {
      results[j].ModuleList.map((itm) => {
        this.moduleSetupService
          .findApproversByRoleid(this.editSelectedRole.id, itm.id)
          .subscribe((data: any) => {
            for (var e = 0; e < data.length; e++) {
              let obj = {
                id: data[e].section_id,
                text: data[e].section_name,
                approver1: data[e].approver1_roleId,
                approver2: data[e].approver2_roleId,
                isSingleApprover:
                  data[e].approver1_roleId != null ? true : false,
                isDualApprover: data[e].approver2_roleId != null ? true : false,
                fullAccess: data[e].is_full_access,
              };
              this.selectedApprovers.push(obj);
            }
          });

        this.ejsModuleList = this.ejsModuleList.filter(
          (elm) => elm.text != itm.text
        );
      });
    }

    emails.at(0).patchValue({ ModuleList: this.ejsModuleList });
    emails.patchValue(results);
  }

  changedApprType(teamMem, index, moduleName) {
    const emails = this.emailForm.get("emails") as FormArray;

    if (emails.value[index].AcessType == "Deny") {
      Swal.fire("Error!", "Deny Access Type requires no approver", "error");
      return;
    }

    if (emails.value[index].sectionArray.length <= 0) {
      Swal.fire("Error!", "Please Select Sections", "error");
      return;
    }

    console.log(
      "emails.value[index].sectionArray",
      emails.value[index].sectionArray
    );

    if (emails.value[index].sectionArray.length == 2) {
      let sectOne = emails.value[index].sectionArray.filter(
        (id) => id === "ea8643fe-135e-4468-b722-5537cd76487d"
      );
      let sectTwo = emails.value[index].sectionArray.filter(
        (id) => id === "05ce9c8a-d9c8-4ea7-8225-352ede4adf7d"
      );

      if (sectOne.length === 0 && sectTwo.length === 0) {
        sectOne = emails.value[index].sectionArray.filter(
          (id) => id === "3894ac3a-6124-47ce-8fb7-31acbb45f1a6"
        );
        sectTwo = emails.value[index].sectionArray.filter(
          (id) => id === "a71b7687-0c30-45a4-aa0e-e9d281f0e351"
        );
      }

      if (sectOne.length === 0 || sectTwo.length === 0) {
        sectOne = emails.value[index].sectionArray.filter(
          (id) => id === "c75f82d3-4920-4d61-96e5-ac7bf8e711ee"
        );
      }
      // ||    id === '3894ac3a-6124-47ce-8fb7-31acbb45f1a6' || id === 'a71b7687-0c30-45a4-aa0e-e9d281f0e351' || id === 'c75f82d3-4920-4d61-96e5-ac7bf8e711ee'
      //  ||   id === '3894ac3a-6124-47ce-8fb7-31acbb45f1a6' || id === 'a71b7687-0c30-45a4-aa0e-e9d281f0e351' || id === 'c75f82d3-4920-4d61-96e5-ac7bf8e711ee'
      if (sectOne.length === 1 && sectTwo.length === 1) {
        Swal.fire(
          "Error!",
          "Selected Sections Do not Require Approvers",
          "error"
        );
        return;
      }
    } else if (emails.value[index].sectionArray.length == 1) {
      let sectOne = emails.value[index].sectionArray.filter(
        (id) => id === "ea8643fe-135e-4468-b722-5537cd76487d"
      );
      let sectTwo = emails.value[index].sectionArray.filter(
        (id) => id === "05ce9c8a-d9c8-4ea7-8225-352ede4adf7d"
      );
      if (sectOne.length === 0 && sectTwo.length === 0) {
        sectOne = emails.value[index].sectionArray.filter(
          (id) => id === "3894ac3a-6124-47ce-8fb7-31acbb45f1a6"
        );
        sectTwo = emails.value[index].sectionArray.filter(
          (id) => id === "a71b7687-0c30-45a4-aa0e-e9d281f0e351"
        );
      }

      if (sectOne.length === 0 || sectTwo.length === 0) {
        sectOne = emails.value[index].sectionArray.filter(
          (id) => id === "c75f82d3-4920-4d61-96e5-ac7bf8e711ee"
        );
      }

      if (sectOne.length === 1 || sectTwo.length === 1) {
        Swal.fire(
          "Error!",
          "Selected Sections Do not Require Approvers",
          "error"
        );
        return;
      }
    }

    if (this.editSelectedRole != "") {
      this.moduleSetupService
        .findApproversByRoleid(this.editSelectedRole.id, moduleName.value)
        .subscribe((data: any) => {
          if (data.length > 0) {
            //Call the Get Approvers API
            for (var e = 0; e < data.length; e++) {
              emails.value[index].section_list.map((elem) => {
                var isSectionPart = emails.value[index].sectionArray.filter(
                  (e) => e == elem.id
                );
                if (
                  elem.id == data[e].section_id &&
                  emails.value[index].ModuleName == moduleName.value &&
                  isSectionPart.length > 0
                ) {
                  let obj = {
                    ...elem,
                    approver1: data[e].approver1_roleId,
                    approver2: data[e].approver2_roleId,
                    isSingleApprover:
                      data[e].approver1_roleId != null ? true : false,
                    isDualApprover:
                      data[e].approver2_roleId != null ? true : false,
                    fullAccess: data[e].is_full_access,
                  };
                  this.selectedSections.push(obj);
                }
              });
            }

            if (
              emails.value[index].ModuleName == moduleName.value &&
              emails.value[index].sectionArray.length > data.length
            ) {
              emails.value[index].sectionArray.map((ele) => {
                var selFilt = this.selectedSections.filter((e) => e.id == ele);
                if (selFilt.length == 0) {
                  var newOne = emails.value[index].section_list.filter(
                    (itm) => itm.id == ele
                  );

                  if (newOne.length > 0) {
                    let obj = {
                      ...newOne[0],
                      fullAccess: false,
                    };

                    if (newOne[0].text.includes("Approve / Disapprove ")) {
                      obj["fullAccess"] = true;
                    }

                    this.selectedSections.push(obj);
                  }
                }
              });
            }
          } else {
            // check already selected Approvers and Add them in the Modal
            if (this.selectedApprovers.length > 0) {
              this.selectedApprovers.map((elem) => {
                emails.value[index].sectionArray.map((sects) => {
                  if (sects == elem.id) {
                    if (elem.text.includes("Approve / Disapprove ")) {
                      elem["fullAccess"] = true;
                    }
                    this.selectedSections.push(elem);
                  }
                });
              });
              if (this.selectedSections.length == 0) {
                for (
                  var j = 0;
                  j < emails.value[index].sectionArray.length;
                  j++
                ) {
                  emails.value[index].section_list.map((elem) => {
                    if (
                      elem.id == emails.value[index].sectionArray[j] &&
                      emails.value[index].ModuleName == moduleName.value
                    ) {
                      let obj = {
                        ...elem,
                        fullAccess: false,
                      };
                      if (elem.text.includes("Approve / Disapprove ")) {
                        obj["fullAccess"] = true;
                      }
                      this.selectedSections.push(obj);
                    }
                  });
                }
              }
            } else {
              for (
                var j = 0;
                j < emails.value[index].sectionArray.length;
                j++
              ) {
                emails.value[index].section_list.map((elem) => {
                  if (
                    elem.id == emails.value[index].sectionArray[j] &&
                    emails.value[index].ModuleName == moduleName.value
                  ) {
                    let obj = {
                      ...elem,
                      fullAccess: false,
                    };
                    if (elem.text.includes("Approve / Disapprove ")) {
                      obj["fullAccess"] = true;
                    }
                    this.selectedSections.push(obj);
                  }
                });
              }
            }
          }
        });
    } else {
      // check already selected Approvers and Add them in the Modal
      if (
        this.selectedApprovers.length > 0 &&
        emails.value[index].sectionArray.length == this.selectedApprovers.length
      ) {
        this.selectedApprovers.map((elem) => {
          emails.value[index].section_list.map((sects) => {
            if (sects.text == elem.text) {
              if (elem.text.includes("Approve / Disapprove ")) {
                elem["fullAccess"] = true;
              }

              this.selectedSections.push(elem);
            }
          });
        });
        if (this.selectedSections.length == 0) {
          for (var j = 0; j < emails.value[index].sectionArray.length; j++) {
            emails.value[index].section_list.map((elem) => {
              if (
                elem.id == emails.value[index].sectionArray[j] &&
                emails.value[index].ModuleName == moduleName.value
              ) {
                let obj = {
                  ...elem,
                  fullAccess: false,
                };
                if (elem.text.includes("Approve / Disapprove ")) {
                  obj["fullAccess"] = true;
                }
                this.selectedSections.push(obj);
              }
            });
          }
        }
      } else if (
        this.selectedApprovers.length > 0 &&
        emails.value[index].sectionArray.length != this.selectedApprovers.length
      ) {
        emails.value[index].sectionArray.map((itm) => {
          var res = this.selectedApprovers.filter((el) => el.id == itm);

          if (res.length == 0) {
            var newItem = emails.value[index].section_list.filter(
              (le) => le.id == itm
            );

            if (newItem.length > 0) {
              let obj = {
                ...newItem[0],
                fullAccess: false,
              };
              if (newItem[0].text.includes("Approve / Disapprove ")) {
                obj["fullAccess"] = true;
              }
              this.selectedSections.push(obj);
            }
          }
        });

        this.selectedApprovers.map((elem) => {
          emails.value[index].sectionArray.map((sects) => {
            if (sects == elem.id) {
              if (elem.text.includes("Approve / Disapprove ")) {
                elem["fullAccess"] = true;
              }
              this.selectedSections.push(elem);
            }
          });
        });
      } else {
        for (var j = 0; j < emails.value[index].sectionArray.length; j++) {
          emails.value[index].section_list.map((elem) => {
            if (
              elem.id == emails.value[index].sectionArray[j] &&
              emails.value[index].ModuleName == moduleName.value
            ) {
              let obj = {
                ...elem,
                fullAccess: false,
              };
              if (elem.text.includes("Approve / Disapprove ")) {
                obj["fullAccess"] = true;
              }
              this.selectedSections.push(obj);
            }
          });
        }
      }
    }

    emails.value[index].sectionArray.map((el: any) => {
      // If a section of Apply Project Force Closure
      if (el === "64d3a7b3-1ce7-43bb-a825-a0934b201966") {
        //Add the Approvers Which Have the Access to Force Closure
        var newAprvData = this.allApproversData.filter(
          (el) => el.section_id === "d63c4b4d-3c76-4725-9bf3-b608308f7a8b"
        );
      }
    });

    this.addTeam(teamMem);
  }
  returnSectionFiltered(id, sections) {
    let results = this.returnSectionApprvbyId(id, sections);
    let uniqueResults = Array.from(
      new Map(results.map((item) => [item.id, item])).values()
    );
    if (uniqueResults && uniqueResults.length > 0) {
      let ownerCheck = uniqueResults.some((role) => role.text == "Account Owner");
      console.log(ownerCheck, "ownerCheck");
      if (!ownerCheck) {
        if (this.dataSource && this.dataSource.length > 0) {
          let accOwner = this.dataSource.find(
            (role) => role.role_name == "Account Owner"
          );
          console.log(accOwner, this.dataSource, "accOwner");
          if (accOwner && accOwner.id) {
            uniqueResults.push({
              id: accOwner.id,
              text: accOwner.role_name,
            });
          }
        }
      }
    }
    return uniqueResults;
  }

  returnSectionApprvbyId(id, sections) {
    var newAprvData = [];
    var results = [];

    if (id === "64d3a7b3-1ce7-43bb-a825-a0934b201966") {
      //Add the Approvers Which Have the Access to Force Closure
      newAprvData = this.allApproversData.filter(
        (el) => el.section_id === "d63c4b4d-3c76-4725-9bf3-b608308f7a8b"
      );
      newAprvData.map((el: any) => {
        results.push({
          id: el.role_id,
          text: el.role_name,
        });
      });
      //Check if the selected sections also have the approver access
      var exists = sections.filter(
        (el) => el.id === "d63c4b4d-3c76-4725-9bf3-b608308f7a8b"
      );
      var roleExists = results.filter(
        (itm) => itm.id === this.editSelectedRole.id
      );
      if (exists.length > 0 && roleExists.length === 0) {
        results.push({
          id: this.editSelectedRole.id,
          text: this.editSelectedRole.role_name,
        });
      }
      return results;
    } else if (id === "4a366181-a1e5-42d5-b1ab-1d07f1e3280f") {
      newAprvData = this.allApproversData.filter(
        (el) => el.section_id === "a71b7687-0c30-45a4-aa0e-e9d281f0e351"
      );

      newAprvData.map((el: any) => {
        results.push({
          id: el.role_id,
          text: el.role_name,
        });
      });

      //Check if the selected sections also have the approver access
      var exists = sections.filter(
        (el) => el.id === "a71b7687-0c30-45a4-aa0e-e9d281f0e351"
      );
      var roleExists = results.filter(
        (itm) => itm.id === this.editSelectedRole.id
      );

      if (exists.length > 0 && roleExists.length === 0) {
        results.push({
          id: this.editSelectedRole.id,
          text: this.editSelectedRole.role_name,
        });
      }

      return results;
    } else if (id === "eaaebee1-8e7e-4fec-8435-c3d2e3f38203") {
      newAprvData = this.allApproversData.filter(
        (el) => el.section_id === "8897388b-8905-42f7-83d7-e8fc36e38fad"
      );
      newAprvData.map((el: any) => {
        results.push({
          id: el.role_id,
          text: el.role_name,
        });
      });

      //Check if the selected sections also have the approver access
      var exists = sections.filter(
        (el) => el.id === "8897388b-8905-42f7-83d7-e8fc36e38fad"
      );
      var roleExists = results.filter(
        (itm) => itm.id === this.editSelectedRole.id
      );
      if (exists.length > 0 && roleExists.length === 0) {
        results.push({
          id: this.editSelectedRole.id,
          text: this.editSelectedRole.role_name,
        });
      }

      return results;
    } else if (id === "ed92bf11-d425-4962-bcf8-c7c96cb18091") {
      newAprvData = this.allApproversData.filter(
        (el) => el.section_id === "9538ad1f-3ee5-4351-9ec9-9d601e6542be"
      );
      newAprvData.map((el: any) => {
        results.push({
          id: el.role_id,
          text: el.role_name,
        });
      });

      //Check if the selected sections also have the approver access
      var exists = sections.filter(
        (el) => el.id === "9538ad1f-3ee5-4351-9ec9-9d601e6542be"
      );
      var roleExists = results.filter(
        (itm) => itm.id === this.editSelectedRole.id
      );
      if (exists.length > 0 && roleExists.length === 0) {
        results.push({
          id: this.editSelectedRole.id,
          text: this.editSelectedRole.role_name,
        });
      }

      return results;
    } else if (id === "92c2a4ff-f553-43b2-8cec-9cfc5962c4da") {
      newAprvData = this.allApproversData.filter(
        (el) => el.section_id === "c4458afa-610a-4334-ba89-b9f4b70db947"
      );
      newAprvData.map((el: any) => {
        results.push({
          id: el.role_id,
          text: el.role_name,
        });
      });

      //Check if the selected sections also have the approver access
      var exists = sections.filter(
        (el) => el.id === "c4458afa-610a-4334-ba89-b9f4b70db947"
      );
      var roleExists = results.filter(
        (itm) => itm.id === this.editSelectedRole.id
      );
      if (exists.length > 0 && roleExists.length === 0) {
        results.push({
          id: this.editSelectedRole.id,
          text: this.editSelectedRole.role_name,
        });
      }

      return results;
    } else {
      return this.approverData;
    }
  }

  addTeam(teamMem) {
    this.modalService.open(teamMem, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      windowClass: "modal-md",
    });
  }

  closeModal() {
    this.selectedSections = [];
    this.isValid = true;
    this.modalService.dismissAll();
  }
  closeAprvModal() {
    this.modalService.dismissAll();
  }

  giveFullAccess(event, sectionId) {
    if (event.target.checked) {
      this.selectedSections.map((elem) => {
        if (elem.id == sectionId) {
          elem["fullAccess"] = true;
        }
      });
    } else {
      this.selectedSections.map((elem) => {
        if (elem.id == sectionId) {
          elem["fullAccess"] = false;
        }
      });
    }
  }

  public GetAllRoleModulesByOrgID() {
    this.moduleSetupService.GetAllSectionApproversByOrgID().subscribe(
      (data: any) => {
        if (data.length !== 0) {
          let results = [{ id: "", text: "Select Role" }];

          console.log("approver data--->", data);

          this.allApproversData = data;

          data.map((elm) => {
            // if (elm.section_id === '05ce9c8a-d9c8-4ea7-8225-352ede4adf7d' ||
            //   elm.section_id === '05ce9c8a-d9c8-4ea7-8225-352ede4adf7d' ||
            //   elm.section_id === '8a5187b2-cec7-4360-be13-04b217de6b6f' ||
            //   elm.section_id === 'e2aefc13-b5da-4f50-ad34-fa17c0861154' ||
            //   elm.section_id === 'dbde27e4-7d85-4f62-8d24-7682d2c9c9d1' ||
            //   elm.section_id === 'a71b7687-0c30-45a4-aa0e-e9d281f0e351'
            // ) {

            // }

            if (
              elm.section_id === "05ce9c8a-d9c8-4ea7-8225-352ede4adf7d" ||
              elm.section_id === "c4458afa-610a-4334-ba89-b9f4b70db947" ||
              elm.section_id === "9538ad1f-3ee5-4351-9ec9-9d601e6542be" ||
              elm.section_id === "1d9305fc-97a9-47f4-9c50-3344bad2f0ff" ||
              elm.section_id === "8897388b-8905-42f7-83d7-e8fc36e38fad" ||
              elm.section_id === "d63c4b4d-3c76-4725-9bf3-b608308f7a8b" ||
              elm.section_id === "e072c429-d096-48ac-9233-dd630a021688" ||
              elm.section_id === "a71b7687-0c30-45a4-aa0e-e9d281f0e351" ||
              elm.section_id === "88bc742a-8f0e-4c9f-a756-e1bfbc0c2723" ||
              elm.section_id === "dbde27e4-7d85-4f62-8d24-7682d2c9c9d1" ||
              elm.section_id === "d42b9416-ff69-452d-90ec-adc3bc723180" ||
              elm.section_id === "892e12ea-9da8-4c99-b283-211c37d6ff0f" ||
              elm.section_id === "ad6268f7-0ae4-4419-9279-ed5e27f60b58" ||
              elm.section_id === "e2aefc13-b5da-4f50-ad34-fa17c0861154" ||
              elm.section_id === "8a5187b2-cec7-4360-be13-04b217de6b6f" ||
              elm.section_id === "ea8643fe-135e-4468-b722-5537cd76487d" ||
              elm.section_id === "28c8f24e-17dc-4e25-902a-b0c3891fb73a" ||
              elm.section_id === "8cdfacec-bf5d-432a-8c46-606d53c995ca"
            ) {
              results.push({
                id: elm.role_id,
                text: elm.role_name,
              });
            }
          });

          //Main Business Logic Validation  Changed
          //   if(this.editSelectedRole != undefined) {
          //     results = results.filter((itm)=> itm.id != this.editSelectedRole.id);
          //  }

          if (results.length > 0) {
            results = _.uniqBy(results, function (e) {
              return e.id;
            });
          }

          this.approverData = results;
          console.log("**this.approverData--->", this.approverData);
          console.log("**this.approverData**", this.approverData.length);
        }
      },
      (error) => {
        Swal.fire("Error!", error, "error");
      }
    );

    // this.moduleSetupService.GetAllRoleModulesByOrgID().subscribe((data: any) => {
    //   //console.log(data)
    //   if(data.length !== 0){
    //     let results = [{ id: '', text: 'Select' }];
    //     data.map((elm) => {
    //       results.push({
    //         id: elm.id,
    //         text: elm.role_name
    //       });
    //     });

    //     if(this.editSelectedRole != undefined) {
    //       results = results.filter((itm)=> itm.id != this.editSelectedRole.id);
    //       console.log('RESULTS-->',results)
    //    }

    //     this.approverData = results;
    //   }
    // }, error  => {
    //   Swal.fire(
    //     'Error!',
    //     error,
    //     'error'
    //   )
    // });
  }

  changedLevel1(event, sectionId) {
    this.selectedSections.map((elem) => {
      if (elem.id == sectionId) {
        elem["approver1"] = event.value;
      }
    });

    this.repsData.map((elem) => {
      if (elem.id == sectionId) {
        console.log(event.value, elem.approver2);
        if (event.value == elem.approver2) {
          Swal.fire("Error!", "Please Select a Different Role", "error");
          event.value = "";
          this.isValid = false;
          return;
        } else {
          this.isValid = true;
          elem["approver1"] = event.value;
        }
      }
    });
  }

  changedLevel2(event, sectionId) {
    this.selectedSections.map((elem) => {
      if (elem.id == sectionId) {
        if (event.value == elem.approver1) {
          Swal.fire("Error!", "Please Select a Different Role", "error");
          event.value = "";
          this.isValid = false;
          return;
        } else {
          this.isValid = true;
          elem["approver2"] = event.value;
        }
      }
    });

    this.repsData.map((elem) => {
      if (elem.id == sectionId) {
        if (event.value == elem.approver1) {
          Swal.fire("Error!", "Please Select a Different Role", "error");
          event.value = "";
          this.isValid = false;
          return;
        } else {
          this.isValid = true;
          elem["approver2"] = event.value;
        }
      }
    });
  }

  updateSectionPolicies() {
    let postData = {};

    // console.log("this.repsData--->", this.repsData);
    if (this.repsData.length < 0) {
      return;
    }

    //check if the deletion role still exist
    let stillExist = this.repsData.filter(
      (elm) =>
        elm.approver1 === this.repsData[0].deletion_role_id ||
        elm.approver2 === this.repsData[0].deletion_role_id
    );

    if (stillExist.length > 0) {
      Swal.fire(
        "Error!",
        "Kindly Re-assign Roles For All Sections",
        "error"
      ).then(
        //used Arrow function here
        (result) => {}
      );

      return;
    }

    postData["role_id"] = this.repsData[0].deletion_role_id;

    let policyArr = [];

    this.repsData.map((plcy) => {
      let plcyObj = {};
      plcyObj["id"] = plcy.role_id;
      plcyObj["section_id"] = plcy.id;
      plcyObj["is_allow"] = true;
      plcyObj["is_deny"] = false;
      plcyObj["approver1_roleId"] =
        plcy.approver1 != null ? plcy.approver1 : null;
      plcyObj["approver2_roleId"] =
        plcy.approver2 != null ? plcy.approver2 : null;
      plcyObj["is_full_access"] = plcy.fullAccess ? true : false;

      policyArr.push(plcyObj);
    });

    postData["moduleSectionPolicy"] = policyArr;

    var deletedRoleName = this.approverData.filter((item) =>
      _.isEqual(item.id, this.repsData[0].deletion_role_id)
    );

    // console.log("deletedRoleName--->",deletedRoleName);

    this.moduleSetupService.updateApproverDetailsByRoledId(postData).subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.fetchDataGrid();
          this.spinner.hide();
          this.GetAllRoleModulesByOrgID();
          //     this.toastr.success("Role removed Successfully", undefined,{
          //       positionClass: 'toast-top-center'
          //  });
          let roleText = `${deletedRoleName[0].text} role is been replaced and deleted `;
          Swal.fire("Completed!", roleText, "success").then(
            //used Arrow function here
            (result) => {}
          );

          this.repsData = [];
          this.modalService.dismissAll();
        }
      },
      (error) => {
        this.spinner.hide();

        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {}
        );
      }
    );
  }

  saveApproversModuleWise() {
    this.missingApprovers = false;

    // obj.moduleSectionPolicy['is_full_access'] = apprv.fullAccess;
    // obj.moduleSectionPolicy['approver1_roleId'] =  apprv.approver1;
    // obj.moduleSectionPolicy['approver2_roleId'] =  apprv.approver2;
    // this.selectedSections.every((elem)=>{
    //     if(this.selectedApprovers.length > 0) {
    //       const result = this.selectedApprovers.filter(item => item.id == elem.id);
    //       if(result) {
    //         console.log('Duplicate Value Found',result);
    //         return
    //       }
    //     }
    //     this.selectedApprovers.push(elem)
    // })

    for (let i = 0; i < this.selectedSections.length; i++) {
      if (this.selectedApprovers.length > 0) {
        const result = this.selectedApprovers.filter(
          (item) => item.id == this.selectedSections[i].id
        );

        if (result.length > 0) {
          this.selectedApprovers = this.selectedApprovers.filter(
            (item) => item.id != result[0].id
          );
          console.log(this.selectedApprovers);
          //this.selectedSections[i] = result[0];
          //console.log('result --->',this.selectedSections[i]);
          //this.closeModal();
          // continue
        }
      }
      this.selectedApprovers.push(this.selectedSections[i]);
    }
    this.closeModal();
  }

  openViewApprvModal(viewApprov) {
    this.modalService.open(viewApprov, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-md",
    });
  }

  getApproversBySectionId(index, moduleId) {
    let emails = this.emailForm.get("emails") as FormArray;

    if (emails.value[index].sectionArray.length <= 0) {
      return;
    }

    //console.log("TEST--->",emails.value[index].sectionArray.length);

    //console.log("Selected Approvers ---->",this.selectedApprovers);

    let returnString = [];
    let newResponseString = [];

    emails.value[index].sectionArray.map((elm: any) => {
      var result = this.selectedApprovers.filter((item) => item.id == elm);
      if (result.length > 0 && result[0]["fullAccess"] == true) {
        var sectionName = emails.value[index].section_list.filter(
          (sec) => sec.id == elm
        );
        if (sectionName.length != 0) {
          let newStr = sectionName[0]["text"] + "-" + "Full Access ";
          newResponseString.push(newStr);
        }
        returnString.push("Full Access");
      }

      if (
        result.length > 0 &&
        result[0]["approver1"] != null &&
        result[0]["approver2"] == null
      ) {
        var apprv1Name = this.approverData.filter((item) =>
          _.isEqual(item.id, result[0]["approver1"])
        );

        if (emails.value[index].section_list.length == 0) {
          return;
        }

        var sectionName = emails.value[index].section_list.filter(
          (sec) => sec.id == elm
        );
        if (sectionName.length != 0) {
          let secApr = sectionName[0]["text"] + "-" + apprv1Name[0]["text"];
          // let newObj = {
          //   sectionName: sectionName[0]['text'],
          //   accessType:  apprv1Name[0]['text']
          // }
          newResponseString.push(secApr);
        }
        returnString.push(apprv1Name[0]["text"]);
      }

      if (result.length > 0 && result[0]["approver2"] != null) {
        var apprv1Name = this.approverData.filter((item) =>
          _.isEqual(item.id, result[0]["approver1"])
        );
        var apprv2Name = this.approverData.filter((item) =>
          _.isEqual(item.id, result[0]["approver2"])
        );
        var sectionName = emails.value[index].section_list.filter(
          (sec) => sec.id == elm
        );
        // console.log("result-->",result,this.approverData);
        // console.log(apprv1Name);
        // console.log(apprv2Name);
        if (sectionName.length != 0) {
          let newStr =
            sectionName[0]["text"] +
            "-" +
            `${apprv1Name[0]["text"]},${apprv2Name[0]["text"]}  `;
          // newResponseString.push(newStr)
          let secApr = sectionName[0]["text"];
          let newObj = {
            sectionName: sectionName[0]["text"],
            accessType: apprv1Name[0]["text"],
            level2: apprv2Name[0]["text"],
          };
          newResponseString.push(newStr);
        }
        returnString.push(apprv1Name[0]["text"]);
        returnString.push(apprv2Name[0]["text"]);
      }
    });

    this.approversTextData = newResponseString.toString();
    return returnString.length <= 0 ? false : returnString.toString();
  }

  FindByRoleModulesID() {
    // this.addformSubmitted=true;
    //   this.isRecentActFieldValid();
    this.submitClicked = true;
    //  let date=document.getElementById('dueDate').innerText
    //  $("#dueDate").html("18:56:00");
    //

    // this.teamCount=this.teamMemFetchData.length;

    // team_member_empid.push(user_info['id'])
    const emails = this.emailForm.get("emails") as FormArray;
    let user;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    let sectionData = [];
    for (var i = 0; i < emails.value.length; i++) {
      var moduleSections = [];

      for (var j = 0; j < emails.value[i].sectionArray.length; j++) {
        moduleSections.push({
          id: emails.value[i].sectionArray[j],
          module_id: null,
          section_name: null,
          moduleSectionPolicy: {
            id: null,
            section_id: null,
            is_allow: emails.value[i].AcessType == "Allow" ? true : false,
            is_deny: emails.value[i].AcessType == "Deny" ? true : false,
          },
        });
      }

      sectionData.push({
        id: emails.value[i].ModuleName,
        org_id: localStorage.getItem("org_id"),
        module_name: null,
        createdby: user["full_name"],
        moduleSections: moduleSections,
      });
    }
    let postData = {
      id: null,
      role_name: this.taskForm.get("name").value,
      role_desc: this.taskForm.get("description").value,
      role_id: "null",
      module_id: "null",
      modules: sectionData,
    };

    console.log("postData", postData);

    if (this.emailForm.get("emails").status == "VALID") {
      this.spinner.show();

      return this.moduleSetupService.FindByRoleModulesID(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.TaskView();
            this.submitClicked = false;

            this.spinner.hide();
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }

  toolbarClick(args: ClickEventArgs): void {
    switch (args.item.text) {
      case "PDF Export":
        this.grid.pdfExport();
        break;
      case "Excel Export":
        this.grid.excelExport();
        break;
      case "CSV Export":
        this.grid.csvExport();
        break;
    }
  }
  public onEditSubmit() {
    // if(document.getElementById('dueDate').innerText!=''){
    //   this.dueDate=document.getElementById('dueDate').innerText
    // }

    this.editformSubmitted = true;
    this.submitClicked = true;
    //  let date=document.getElementById('dueDate').innerText
    //  $("#dueDate").html("18:56:00");
    //

    // this.teamCount=this.teamMemFetchData.length;

    // team_member_empid.push(user_info['id'])
    const emails = this.emailForm.get("emails") as FormArray;
    let user;
    if (localStorage.getItem("user_info")) {
      user = JSON.parse(localStorage.getItem("user_info"));
    }
    let sectionData = [];
    for (var i = 0; i < emails.value.length; i++) {
      var moduleSections = [];

      for (var j = 0; j < emails.value[i].sectionArray.length; j++) {
        var obj = {
          id: emails.value[i].sectionArray[j],
          module_id: null,
          section_name: null,
          moduleSectionPolicy: {
            id: null,
            section_id: null,
            is_allow: emails.value[i].AcessType == "Allow" ? true : false,
            is_deny: emails.value[i].AcessType == "Deny" ? true : false,
          },
        };

        this.selectedApprovers.map((apprv) => {
          if (apprv.id == obj.id) {
            if (apprv.fullAccess) {
              obj.moduleSectionPolicy["is_full_access"] = apprv.fullAccess;
              obj.moduleSectionPolicy["approver1_roleId"] = null;
              obj.moduleSectionPolicy["approver2_roleId"] = null;
            } else {
              obj.moduleSectionPolicy["is_full_access"] = apprv.fullAccess;
              obj.moduleSectionPolicy["approver1_roleId"] = apprv.approver1;
              obj.moduleSectionPolicy["approver2_roleId"] = apprv.approver2;
            }
          }
        });
        moduleSections.push(obj);
      }

      moduleSections.map((itm) => {
        console.log(itm.id);

        if (
          itm.id === "23046a38-1fdf-4788-aa4b-792ff70dcb09" ||
          itm.id === "28237156-d239-4632-8512-f8a47aeeb6f8" ||
          itm.id === "a004eff3-9993-4bb8-99aa-242e56776330" ||
          itm.id === "b20769d0-ac3c-4075-b3ac-07bf4a764baf" ||
          itm.id === "b7e3d3cb-f494-4a4e-aff4-c2e73361fcee" ||
          itm.id === "ba629656-d649-4e0b-aee4-4c0d6275c4e9" ||
          itm.id === "b4f7216e-dd7e-42e5-9907-a090707c28d2" ||
          itm.id === "c7c53e95-d9a1-448e-822d-13c85e4c62d4" ||
          itm.id === "8a55082f-5185-4d28-9098-4f268cb47d51" ||
          itm.id === "ed92bf11-d425-4962-bcf8-c7c96cb18091"
        ) {
          if (
            itm.moduleSectionPolicy.is_full_access === undefined ||
            itm.moduleSectionPolicy.is_full_access === false
          ) {
            if (itm.moduleSectionPolicy.approver1_roleId === undefined) {
              if (itm.moduleSectionPolicy.approver2_roleId === undefined) {
                this.missingApprovers = true;
              }
            }
          }
        } else {
          if (
            itm.id === "05ce9c8a-d9c8-4ea7-8225-352ede4adf7d" ||
            itm.id === "ea8643fe-135e-4468-b722-5537cd76487d" ||
            itm.id === "8a5187b2-cec7-4360-be13-04b217de6b6f" ||
            itm.id === "b833ad17-8220-4a8e-9012-3a4ca1796076" ||
            itm.id === "e2aefc13-b5da-4f50-ad34-fa17c0861154" ||
            itm.id === "d42b9416-ff69-452d-90ec-adc3bc723180" ||
            itm.id === "9538ad1f-3ee5-4351-9ec9-9d601e6542be"
          ) {
            itm.moduleSectionPolicy.is_full_access = true;
          }
        }
      });

      sectionData.push({
        id: emails.value[i].ModuleName,
        org_id: localStorage.getItem("org_id"),
        module_name: null,
        createdby: user["full_name"],
        moduleSections: moduleSections,
      });
    }
    let postData = {
      id: this.editTaskId,
      role_name: this.taskForm.get("name").value,
      role_desc: this.taskForm.get("description").value,
      role_id: "null",
      module_id: "null",
      created_date: new Date().toISOString(),
      modules: sectionData,
    };

    if (this.missingApprovers) {
      Swal.fire(
        "Error!",
        "Please Add Approvers for Selected Sections",
        "error"
      );
      return;
    }

    if (this.taskForm.get("name").value == "") {
      Swal.fire("Error!", "Please Add Role Name", "error");
      return;
    }

    if (this.emailForm.get("emails").status == "VALID") {
      this.spinner.show();
      return this.moduleSetupService.UpdateRoleModules(postData).subscribe(
        (data: any) => {
          if (data.status == 200) {
            this.TaskView();
            this.submitClicked = false;
            emails.clear();
            emails.insert(0, this.createEmailFormGroup());
            this.spinner.hide();
            this.getUsersInfo();
            this.toastr.success(data["desc"], undefined, {
              positionClass: "toast-top-center",
            });
            this.GetAllRoleModulesByOrgID();
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire("Error!", "Error.", "error").then((result) => {});
        }
      );
    }
  }
  public getUsersInfo() {
    let userId = {
      ID: localStorage.getItem("user_id"),
    };
    this.userService.getByUserID(userId).subscribe(
      (data) => {
        if (data) {
          localStorage.setItem(
            "userRights",
            JSON.stringify(data["userRights"])
          );
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
  public onAddNewSubmit() {
    //  $("#dueDate").html("18:56:00");
    //

    let postData = {
      design_name: this.taskForm.get("taskName").value,
    };

    if (this.taskForm.get("taskName").value != "") {
      this.spinner.show();

      return this.costService.AddTypeOfDesign(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data.status == 200) {
            this.spinner.hide();
            this.taskForm.reset();
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

  public onChange(e) {
    this.ejsDueDate = moment(e.value).format("L");
  }
  public getAllStaticMilestone() {
    this.costService.GetAllStaticMilestoneByOrgID().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select an option" }];
        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data.length; i++) {
          results.push({
            id: data[i].id,
            text: data[i].milestone_name,
          });
        }

        this.milestoneData = results;
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
  public getAllStaticMilestoneTasks(milesoneId) {
    let postData = {
      id: milesoneId,
    };
    this.spinner.show();
    this.costService
      .GetAllStaticMilestoneTasksByMilestoneID(postData)
      .subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);

          if (data) {
            this.createTaskForm(data);
            this.spinner.hide();
            this.milestoneTaskLength = data.length;
          }
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
  public getAllEmployee() {
    let user_info = JSON.parse(localStorage.getItem("user_info"));

    this.empService.getEmployeeByOrgId().subscribe(
      (data: any) => {
        var results = [
          {
            id: user_info["id"],
            text: "Me",
            additional: {
              teamBy: "",
            },
          },
        ];

        // let dataObj = JSON.parse(data['token']);
        //
        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          if (data[i].id != user_info["id"]) {
            results.push({
              id: data[i].id,
              text: data[i].full_name,
              additional: {
                teamBy: data[i].workemail,
              },
            });
          }
        }

        results.splice(data.length + 1, 0, {
          id: "Anyone",
          text: "Anyone",
          additional: {
            teamBy: "",
          },
        });
        this.assigneeData = results;
        this.assigneeStatus = [user_info["id"]];
        this.showAssigneeLead = false;
        this.showAssigneeApprove = false;
        this.leadValue = user_info["id"];
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
  public getAllTask() {
    this.taskService.getAllTask().subscribe(
      (data: any) => {
        this.dataSource = data;

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

  public taskEdit(dept_id) {
    this.editSelectedRole = "";
    // this.DesgnList();
    this.GetAllModules();

    this.AddNewSubmit = false;
    this.editable = true;
    this.editTaskId = dept_id;
    this.showTaskList = false;
    this.missingApprovers = false;
    this.showAddForm = true;
    this.teamAdd = false;
    let postData = {
      id: dept_id,
    };
    this.moduleSetupService.FindByRoleModulesID(postData).subscribe(
      (data: any) => {
        if (data.length != 0) this.editSelectedRole = data[0];
        this.GetAllRoleModulesByOrgID();
        this.taskForm.patchValue({
          name: data[0].role_name,
          description: data[0].role_desc,
        });
        let modules = [];
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].modules.length; j++) {
            modules.push(data[i].modules[j]);
          }
        }
        console.log("modulesList", modules);
        this.createEditList(modules);
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
  public onCheckChange(e) {
    this.taskApprove = e.value;
    if (e.srcElement.checked == true) {
      this.isApprove = true;
    } else {
      this.isApprove = false;
    }
  }
  public getEmployeeByOrgId() {
    this.empService.getEmployeeByOrgId().subscribe(
      (data: any) => {
        var results = [{ id: "", text: "Select" }];

        // let dataObj = JSON.parse(data['token']);
        //

        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            id: data[i].id,
            text: data[i].first_name,
          });
        }

        this.approverData = results;
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
  public fetchDataGrid() {
    this.moduleSetupService
      .GetAllRoleModulesByOrgID()
      .subscribe((data: any) => {
        // this.dataSource =  new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;

        let datas = new DataManager(data);
        this.dataSource = datas.dataSource["json"];
        //   this.initialSort = {
        //     columns: [{ field: 'dep_name', direction: 'Ascending' },
        //     { field: 'alias', direction: 'Descending' }]
        // };
        this.pageSettings = { pageSizes: true, pageCount: 5 };
        this.toolbar = ["Search", "ExcelExport", "PdfExport"];
        // setTimeout(() => {
        //   this.dataSource.paginator = this.paginator;
        //   this.dataSource.sort = this.sort;
        // })
      });
  }
  public checkIsTeam(e: any) {
    if (e.srcElement.checked) {
      this.teamAdd = true;
      this.EmpList();
    } else {
      this.teamAdd = false;
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  public clearForm() {
    //$("#task_log_modal").modal('hide');

    this.taskForm.reset();
    let user_info = JSON.parse(localStorage.getItem("user_info"));

    //  this.assigneeStatus='';
    this.assigneeStatus = [user_info["id"]];

    this.teamAdd = false;
    setTimeout(() => {
      // this.checkTeamValue = false
    });

    //$("#task_log_modal").modal('hide');

    // $('#isTeam').attr('checked',false);
    // $('#isTeam').attr('disabled','disabled');
    // $('#isTeam').prop('checked',false);
    $("#toggleDeptCheck").prop("checked", false);
    $("#toggleDesgnCheck").prop("checked", false);
    $("#toggleOutSourceCheck").prop("checked", false);
    $("#toggleFreeLanCheck").prop("checked", false);
    this.teamAdd = false;
    this.teamValue = "";
    this.deptEmpValue = "";
    this.desgnEmpValue = "";
    this.teamMemberValue = "";
    this.teamMembers = [];
    this.isApprove = false;
    this.approverTaskValue = "";
  }
  public taskDelete(reassign, deptId) {
    this.GetAllRoleModulesByOrgID();
    let checkIfValid = this.approverData.filter((el) => el.id === deptId);

    if (checkIfValid.length > 0) {
      // 'You are Deleting a Role with Approver Access.<br> You need to Replace or Change the approver access level',
      Swal.fire({
        title: "Alert",
        html: " <b> 1. You are Deleting a Role with Approval Authority. </b> <br> <b> 2. Kindly Replace or Change the Approval Authority. </b> <br>  <b> 3. Users Assigned to the following role will be changed to No Role. </b>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
      }).then(
        //used Arrow function here
        (result) => {
          if (result.value === true) {
            //OpenModal to Display Data
            this.modalService.open(reassign, {
              ariaLabelledBy: "modal-basic-title",
              size: "lg",
              windowClass: "modal-md",
            });
            //Get the Data with the API

            let postData = {
              ID: deptId,
            };
            this.moduleSetupService
              .getApproverDetailsByRoledId(postData)
              .subscribe(
                (data: any) => {
                  if (data.length > 0) {
                    console.log("Data HERE -->", data);
                    //isSingleApprover,isDualApprover
                    data.map((elm) => {
                      let mappingObj = {};
                      mappingObj["deletion_role_id"] = deptId;
                      mappingObj["id"] = elm.section_id;
                      mappingObj["text"] = elm.module_name;
                      mappingObj["content"] = elm.module_name;
                      mappingObj["approver1"] = elm.approver1_roleId
                        ? elm.approver1_roleId
                        : null;
                      mappingObj["approver2"] = elm.approver2_roleId
                        ? elm.approver2_roleId
                        : null;
                      mappingObj["role_id"] = elm.role_id ? elm.role_id : null;
                      mappingObj["fullAccess"] = elm.is_full_access
                        ? true
                        : false;
                      mappingObj["isSingleApprover"] =
                        elm.approver1_roleId != null ||
                        elm.approver2_roleId != null
                          ? true
                          : false;
                      mappingObj["isDualApprover"] =
                        elm.approver1_roleId != null &&
                        elm.approver2_roleId != null
                          ? true
                          : false;
                      this.repsData.push(mappingObj);
                    });
                  }
                },
                (error) => {
                  Swal.fire("Error!", error, "error").then(
                    //used Arrow function here
                    (result) => {}
                  );
                }
              );

            //Dummy Data
            //  this.repsData =  [{"text":"Apply  Attendance Overwrite","id":"ba629656-d649-4e0b-aee4-4c0d6275c4e9",
            //  "content":"Apply  Attendance Overwrite",
            //  "approver1":"3bc8de92-13bd-4e4e-be54-0c3ddd6188a2",
            //  "approver2":"5ed6ee1d-8929-4e10-a6c5-9b38fa397d86",
            //  "isSingleApprover":true,"isDualApprover":true,
            //  "fullAccess":false},{"text":"Apply Leave Request","id":"b20769d0-ac3c-4075-b3ac-07bf4a764baf","content":"Apply Leave Request","approver1":"7c681e39-27e8-41f8-b10e-2b4aaf38b103","approver2":"3bc8de92-13bd-4e4e-be54-0c3ddd6188a2","isSingleApprover":true,"isDualApprover":true,"fullAccess":false}]
          }
        }
      );
    } else {
      Swal.fire({
        title: "Alert",
        html: " <b> Are you sure you want to delete this role ?</b> <br>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
      }).then(
        //used Arrow function here
        (result) => {
          this.spinner.show();
          if (result.value === true) {
            let postData = {
              ID: deptId,
            };
            this.moduleSetupService.RemoveRoleModules(postData).subscribe(
              (data: any) => {
                if (data.status == 200) {
                  this.fetchDataGrid();
                  this.spinner.hide();
                  this.GetAllRoleModulesByOrgID();
                }
              },
              (error) => {
                this.spinner.hide();

                Swal.fire("Error!", error, "error").then(
                  //used Arrow function here
                  (result) => {}
                );
              }
            );
          }
        }
      );
    }
  }

  public clearSearchField() {
    this.searchField = "";
    this.fetchDataGrid();
  }
  public AddTeams() {
    let teamsValFetchData = [];
    if (this.teams.length == 0) {
      this.teams.push(this.teamValue[0]);

      let teamEmpId = {
        ID: this.teamValue[0],
      };
      this.empService
        .FindEmpDepartDesignByTeamID(teamEmpId)
        .subscribe((data: any) => {
          data.forEach((element) => {
            this.teamsValFetchData.push(element);
            teamsValFetchData = this.teamsValFetchData;
            this.teamMemFetchData.push(element);
          });

          this.checkedValues();
        });
    } else {
      let teamsValFetchData = [];
      this.teamValue.forEach((element) => {
        if (!this.teams.includes(element)) {
          this.teams.push(element);

          let teamEmpId = {
            ID: element,
          };
          this.empService
            .FindEmpDepartDesignByTeamID(teamEmpId)
            .subscribe((data: any) => {
              data.forEach((element) => {
                this.teamsValFetchData.push(element);
                teamsValFetchData = this.teamsValFetchData;
                // this.teamMemFetchData.push(element);
              });

              const result = [];
              const map = new Map();
              for (const item of this.teamsValFetchData) {
                if (!map.has(item.id)) {
                  map.set(item.id, true); // set any value to Map
                  result.push({
                    id: item.id,
                    full_name: item.full_name,
                    employee_type_name: item.employee_type_name,
                    designation_name: item.designation_name,
                  });
                } else {
                  Swal.fire(
                    "Error!",
                    item.full_name +
                      "has already been added.Please add other employee",
                    "error"
                  ).then(
                    //used Arrow function here
                    (result) => {
                      //  this.router.navigate(['/dashboard']);
                    }
                  );
                }
              }

              this.teamMemFetchData = result;

              this.checkedValues();
            });
        }
        //    else{
        //   Swal.fire(
        //     'Error!',
        //      this.teamEmpName + 'has already been added.Please add other employee',
        //     'error'
        //   ).then(
        //     //used Arrow function here
        //     (result)=> {
        //
        //         this.router.navigate(['/dashboard']);
        //     })

        // }
      });
    }
  }
  public AddTeamMembers() {
    if (this.teamMembers.length == 0) {
      this.teamMembers.push(this.teamMemberValue);

      let teamEmpId = {
        ID: this.teamMemberValue,
      };
      this.empService
        .empDepartDesignByEmpID(teamEmpId)
        .subscribe((data: any) => {
          this.teamMemFetchData.push({ data });

          this.checkedValues();
        });
    } else {
      if (!this.teamMembers.includes(this.teamMemberValue)) {
        this.teamMembers.push(this.teamMemberValue);

        // logik to create new items
        let teamEmpId = {
          ID: this.teamMemberValue,
        };

        this.empService
          .empDepartDesignByEmpID(teamEmpId)
          .subscribe((data: any) => {
            // this.teamMemFetchData.push(data[0]);
            this.teamMemFetchData.push({ data });

            // this.empDataSource=new MatTableDataSource(data);

            this.checkedValues();
          });
      } else {
        Swal.fire(
          "Error!",
          this.teamEmpName + "has already been added.Please add other employee",
          "error"
        ).then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    }
  }
  public checkedValues() {
    const result = [];
    const map = new Map();
    for (const item of this.teamMemFetchData) {
      if (!map.has(item.id) && !map.has(item.data && item.data.id)) {
        map.set(item.id || (item.data && item.data.id), true); // set any value to Map
        result.push({
          id: item.data ? item.data.id : item.id,
          full_name: item.data ? item.data.full_name : item.full_name,
          employee_type_name: item.data
            ? item.data.employee_type_name
            : item.employee_type_name,
          designation_name: item.data
            ? item.data.designation_name
            : item.designation_name,
        });
      } else {
        Swal.fire(
          "Error!",
          item.data
            ? item.data.full_name +
                "has already been added.Please add other employee"
            : item.full_name +
                "has already been added.Please add other employee",
          "error"
        ).then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    }

    this.teamMemFetchData = result;

    // this.empDataSource=new MatTableDataSource(this.teamMemFetchData)
    // this.empDataSource.connect().next(this.teamMemFetchData);

    this.empgrid.refresh();
    let datas = new DataManager(this.teamMemFetchData);
    this.empDataSource = datas.dataSource["json"];
    this.emptoolbar = ["Search"];
  }

  public changedTeamMember(e: any): void {
    this.teamMemberValue = e.value;
    this.teamEmpName = e.data[0].text;
  }
  public teamDelete(id) {
    for (var i = 0; i < this.teamMemFetchData.length; i++) {
      if (
        (this.teamMemFetchData[i].data
          ? this.teamMemFetchData[i].data.id
          : this.teamMemFetchData[i].id) == id
      ) {
        this.teamMemFetchData.splice(i, 1);
        this.teamMembers.splice(id, 1);
        // if(this.teamMemFetchData[i].data){
        //   this.teams.splice(this.teamMemFetchData[i].data.id,1)

        // }else{
        //   this.teamMembers.splice(this.teamMemFetchData[i].id,1)

        // }
      }
    }
    this.checkedValues();
  }
  public createTaskForm(taskList) {
    const emails = this.emailForm.get("emails") as FormArray;
    emails.clear();
    var results = [];

    for (var i = 0; i < taskList.length; i++) {
      let unitType = "";
      if (taskList[i].unit == "Unit") {
        unitType = "2";
      } else if (taskList[i].unit == "Floors") {
        unitType = "1";
      } else if (taskList[i].unit == "Project") {
        unitType = "3";
      }
      emails.push(this.createEmailFormGroup());

      results.push({
        Label: taskList[i].task_name,
        id: taskList[i].id,
        UnitType: unitType,
        unit_no: taskList[i].qty,
      });
      // emails.controls.forEach(pair => pair.patchValue({ Label: this.typeOfTask[i].id }));
      // if(taskList[i].unit=='Unit'){
      //   emails[i].get('unit_no').enable()
      // }else{
      //   emails[i].get('unit_no').disabled()

      // }
    }
    emails.patchValue(results);
  }
  public qtyChange(e, id) {}
  private createEmailFormGroup(): FormGroup {
    return new FormGroup({
      // 'emailAddress': new FormControl('', Validators.email),
      id: new FormControl(""),

      Label: new FormControl(""),
      AcessType: new FormControl("", Validators.required),
      unit_no: new FormControl(""),
      ModuleName: new FormControl("", Validators.required),
      sectionArray: new FormControl("", Validators.required),
      section_list: new FormControl(""),
      ModuleList: new FormControl(""),
    });
  }
  public changedEjsModule(e, index, type): void {
    const emails = this.emailForm.get("emails") as FormArray;
    console.log("e", e);
    emails.at(index).patchValue({ sectionArray: "" });
    this.duplicatedValues = [];
    if (type == "add") {
      this.FindByModulesID(e.value, index, "nocheck", null);
    } else {
      this.FindByModulesID(e, index, "nocheck", null);
    }
  }
  changedEjsSection(e, index): void {
    const emails = this.emailForm.get("emails") as FormArray;
    //   let x=emails.value[index].get('ModuleName').value
    // this.FindByModulesID(e.value,index);
    this.sectionIndex = index;
    let y = emails.at(index).get("ModuleName").value;
    this.FindByModulesID(y, index, "check", e.value);

    // console.log('changedEjsSection',y);
  }
  FindByModulesID(id, index, check, sectValue) {
    const emails = this.emailForm.get("emails") as FormArray;

    let postData = {
      id: id,
    };
    this.moduleSetupService.FindByModulesID(postData).subscribe(
      (data: any) => {
        if (data.moduleSections && data.moduleSections.length != 0) {
          var results = [];

          for (var i = 0; i < data.moduleSections.length; i++) {
            results.push({
              Section: data.moduleSections[i].section_name,
              Id: data.moduleSections[i].id,
            });
          }
          this.sectionList = results;

          var results = [];
          if (data.moduleSections != null && data.moduleSections.length != 0) {
            for (var i = 0; i < data.moduleSections.length; i++) {
              results.push({
                text: data.moduleSections[i].section_name,
                id: data.moduleSections[i].id,
                content: data.moduleSections[i].section_name,
              });
              // emails.controls.forEach(pair => pair.patchValue({ Label: list[i].id, is_checkbox: list[i].is_checkbox }));
            }
          }
          let sectionid = [];
          for (var i = 0; i < emails.value.length; i++) {
            if (
              emails.value[i].ModuleName != "" &&
              emails.value[i].sectionArray.length != 0
            ) {
              for (var j = 0; j < emails.value[i].sectionArray.length; j++)
                sectionid.push(emails.value[i].sectionArray[j]);
            }
          }

          if (sectValue != null) {
            if (emails.length > 1) {
              // let result = sectValue.filter(val => sectionid.includes(val));
              // console.log('intersect',result);
              let findDuplicates = (arr) =>
                arr.filter((item, index) => arr.indexOf(item) != index);
              let duplicatedValues = findDuplicates(sectionid);
              this.duplicatedValues = duplicatedValues;
              console.log("duplicatedValues", duplicatedValues);
              let duplicatedNames = [];

              if (duplicatedValues.length != 0) {
                for (var i = 0; i < duplicatedValues.length; i++) {
                  let postData = {
                    id: duplicatedValues[i],
                  };
                  this.moduleSetupService
                    .FindByModuleSectionsID(postData)
                    .subscribe(
                      (data: any) => {
                        if (data) {
                          duplicatedNames.push(data.section_name);
                          this.duplicatedNames = duplicatedNames;
                        }
                        console.log("duplicatedNames", duplicatedNames);
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
            }
          }

          //Only for Leave Module
          if (id === "94ea9953-9403-4a1c-bb63-7379265d1499") {
            const LRarr = [];
            const AOarr = [];
            const CFarr = [];
            const LParr = [];
            const hol = [];
            const temp = [];

            const newData = results.map((elem) => {
              if (elem.text.indexOf("Leave Request") !== -1) {
                LRarr.push(elem);
              } else if (elem.text.indexOf("Attendance Overwrite") !== -1) {
                AOarr.push(elem);
              } else if (elem.text.indexOf("Carry Forward") !== -1) {
                CFarr.push(elem);
              } else if (elem.text.indexOf("Leave Profile") !== -1) {
                LParr.push(elem);
              } else if (elem.text.indexOf("holidays") !== -1) {
                hol.push(elem);
              } else {
                temp.push(elem);
              }
            });
            emails.at(index).patchValue({
              section_list: LRarr.concat(AOarr, CFarr, LParr, hol, temp),
            });
            // console.log(LRarr.concat(AOarr,CFarr,LParr,hol));
          } else {
            emails.at(index).patchValue({ section_list: results });
          }

          console.log("emails", emails.value);
          this.incrementValue = emails.value.length - 1;
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
  loadDataSet1() {
    this.selectedItems = [];
    this.itemList = [
      { id: 1, itemName: "Apple", category: "fruits" },
      { id: 2, itemName: "Banana", category: "fruits" },
      { id: 5, itemName: "Tomatoe", category: "vegetables" },
      { id: 6, itemName: "Potatoe", category: "vegetables" },
    ];
  }
  loadDataSet2() {
    this.selectedItems = [];
    this.itemList = [
      { id: 1, itemName: "India", category: "asia" },
      { id: 2, itemName: "Singapore", category: "asia pacific" },
      { id: 3, itemName: "Germany", category: "Europe" },
      { id: 4, itemName: "France", category: "Europe" },
      { id: 5, itemName: "South Korea", category: "asia" },
      { id: 6, itemName: "Sweden", category: "Europe" },
    ];
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem("user_info"));
    if (userData.is_superadmin === true || userData.is_admin === true) {
      this.allowAccess = true;
      this.noAllowAccess = false;
    } else {
      this.allowAccess = false;
      this.noAllowAccess = true;
    }
    console.log(userData.is_superadmin, this.allowAccess, this.noAllowAccess);

    this.GetAllRoleModulesByOrgID();

    //this.getAllTask();
    // this.emailForm = this.formBuilder.group({
    //   emails: this.formBuilder.array([t])
    // });
    this.emailForm = this.formBuilder.group({
      emails: this.formBuilder.array([this.createEmailFormGroup()]),
    });

    this.milestoneTaskLength = 0;
    this.ejsModuleList = [
      { id: "Dashboard", text: "Dashboard" },
      { id: "Project", text: "Project" },
    ];
    this.ejsAcessList = [
      { id: "Allow", text: "Allow" },
      { id: "Deny", text: "Deny" },
    ];
    this.itemList = [
      { id: 1, itemName: "India", category: "asia" },
      { id: 2, itemName: "Singapore", category: "asia pacific" },
      { id: 3, itemName: "Germany", category: "Europe" },
      { id: 4, itemName: "France", category: "Europe" },
      { id: 5, itemName: "South Korea", category: "asia" },
      { id: 6, itemName: "Sweden", category: "Europe" },
    ];

    this.selectedItems = [
      { id: 1, itemName: "India" },
      { id: 2, itemName: "Singapore" },
      { id: 4, itemName: "Canada" },
    ];
    this.settings = {
      singleSelection: false,
      text: "Select Fields",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      searchPlaceholderText: "Search Fields",
      enableSearchFilter: true,
      badgeShowLimit: 5,
      groupBy: "category",
    };

    this.fetchDataGrid();
    // this.dataSource=this.paginator;
    // this.getAllStaticMilestone();
    this.GetAllModules();

    // console.log('uniqueResultTwo',uniqueResultTwo);

    $.getScript("assets/plugins/custom/fullcalendar/fullcalendar.bundle.js");
    $.getScript("assets/js/pages/crud/forms/widgets/bootstrap-datepicker.js");

    // $.getScript('assets/modaljs/cssParser.js')
    // $.getScript('assets/modaljs/css-filters-polyfill.js')

    this.taskForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl(""),
    });
    this.form = this.formBuilder.group({
      datepicker: [new Date(), Validators.required],
    });

    this.form.valueChanges.subscribe((value) => {});
    this.form.get("datepicker").valueChanges.subscribe((value) => {});
  }
  // ngAfterViewInit() {

  //   this.taskService.fetchGridDataByTaskEmpID().subscribe(
  //     (data:any)  => {
  //

  // this.dataSource =  new MatTableDataSource(data);
  // this.dataSource.paginator = this.paginator;
  // this.dataSource.sort = this.sort;})

  //  }
}
