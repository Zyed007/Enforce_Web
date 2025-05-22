import { Component, OnInit, ViewChild } from "@angular/core";

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { settingsService } from "../../../services/settings.service";
import { UserService } from "../../../services/user.service";
import { EmployeeService } from "../../../services/employee.service";
import { AdministrativeService } from "../../../services/administrative.service";
import { PayrollService } from "../../../services/payroll.service";
import { ModuleSetupService } from "../../../services/moduleSetup.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { TabComponent } from "@syncfusion/ej2-angular-navigations";
import * as _ from "lodash";
import moment = require("moment");
import { TimeSheetService } from "../../../services/timesheet.service";
import { ProjectService } from "../../../services/project.service";

@Component({
  selector: "app-expensess",
  templateUrl: "./expensess.component.html",
  styleUrls: ["./expensess.component.scss"],
})
export class ExpensessComponent implements OnInit {
  constructor(
    private employeeService: EmployeeService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private admService: AdministrativeService,
    private toast: ToastrService,
    private modalService: NgbModal,
    public config: NgbModalConfig,
    private spinner: NgxSpinnerService,
    private settingsService: settingsService,
    private payrollService: PayrollService,
    public ModuleSetupService: ModuleSetupService,
    public timesheetService: TimeSheetService,
    private projectService: ProjectService
  ) {
    config.backdrop = "static";
  }

  @ViewChild("tabObj", { static: false }) public tabObjlist: TabComponent;

  @ViewChild("reimbursmentModel", { static: false }) reimbursmentModel: any;
  @ViewChild("addreimbursmentModel", { static: false })
  addreimbursmentModel: any;
  @ViewChild("aprreimbursmentModel", { static: false })
  aprreimbursmentModel: any;

  ngOnInit(): void {
    this.checkUserRights();
    this.getList();
    this.getActiveEmployeeList();
  }

  accessToPage = false;
  commonModuleName;

  Tabs = [
    { text: "Pending" },
    { text: "Rejected" },
    { text: "Approved" },
    { text: "Added to Paytable" },
    { text: "Paid" },
  ];
  org_id = localStorage.getItem("org_id").toString();
  user_info = JSON.parse(localStorage.getItem("user_info"));
  showTravel = false;
  isLoading = false;
  isTravelHidden = false;
  travelData = [];
  totalDistance = "";
  vehicleData = {};

  checkUserRights() {
    this.userService
      .GetAccessRightsbyRole({ id: this.user_info.role_id })
      .subscribe((data: any) => {
        if (data) {
          data.map((item) => {
            item.module_name = item.module_name.replace(/\s+/g, "");
            return item;
          });
          this.commonModuleName = _.groupBy(data, "module_name");
          if (this.commonModuleName.Payroll) {
            this.PayrollModuleID = this.commonModuleName.Payroll[0].id;
            this.commonModuleName.Payroll.map((elm) => {
              if (elm.section_name === "Create and Modify Payroll Payments") {
                if (elm.is_allow === true) {
                  this.showPayrollPaymentBtn = elm.is_allow;
                  this.createPayrollSectionName = elm.section_name;
                }
              }
              if (elm.section_name === "View PayRoll") {
                if (elm.is_allow === true) {
                  this.accessToPage = true;
                }
              }
            });
            this.checkPayrollApprover(this.user_info.role_id);
          }
        }
      });
  }

  PayrollModuleID;
  createPayrollSectionName;
  showPayrollPaymentBtn = false;
  addPayrollPaymentsFullAccess = false;
  createPayrollPaymentApprover1rollId;
  createPayrollPaymentApprover1rollName;
  isDualApproverPayrollPayments = false;
  createPayrollPaymentApprover2rollId;
  createPayrollPaymentApprover2rollName;

  checkPayrollApprover(role_id) {
    let postData = {
      roleID: role_id,
      moduleID: this.PayrollModuleID,
    };

    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(
      postData
    ).subscribe((data: any) => {
      //add edit
      data.map((elm) => {
        if (elm.section_name === this.createPayrollSectionName) {
          if (elm.is_full_access) {
            this.addPayrollPaymentsFullAccess = true;
          } else {
            this.addPayrollPaymentsFullAccess = false;
            if (elm.approver1_roleId !== null) {
              this.createPayrollPaymentApprover1rollId = elm.approver1_roleId;
              this.createPayrollPaymentApprover1rollName =
                elm.approver1_role_name;
              if (elm.approver2_roleId !== null) {
                this.isDualApproverPayrollPayments = true;
                this.createPayrollPaymentApprover2rollId = elm.approver2_roleId;
                this.createPayrollPaymentApprover2rollName =
                  elm.approver2_role_name;
              }
            }
          }
        }
      });
    });
  }

  activeEmpList = [];
  getActiveEmployeeList() {
    this.activeEmpList = [];
    this.payrollService
      .getActiveEmployeeListByOrgID({ id: this.org_id })
      .subscribe((rsp: any) => {
        if (rsp) {
          rsp.map((emp) => {
            this.activeEmpList.push({ id: emp.id, text: emp.full_name });
          });
        }
      });
  }

  selectedEmp = "";
  changeEmp(evt) {
    console.log("changed the employee", evt);
    this.selectedEmp = evt.itemData.id;
  }

  public AddReimbursementForm: FormGroup;

  rembItem = [
    { id: "Travel Expenses", text: "Travel Expenses" },
    { id: "Office Supplies", text: "Office Supplies" },
    { id: "Utility Bills", text: "Utility Bills" },
    { id: "Training and Development", text: "Training and Development" },
    { id: "Health and Wellness", text: "Health and Wellness" },
    { id: "Miscellaneous Expenses", text: "Miscellaneous Expenses" },
  ];

  async openAddReimbersment() {
    this.modalService.open(this.addreimbursmentModel);
    this.AddReimbursementForm = new FormGroup({
      empid: new FormControl("", [Validators.required]),
      reffid: new FormControl("", [Validators.required]),
      item: new FormControl("Absence", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      payroll: new FormControl("Pending", [Validators.required]),
      dateincurred: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
    });
    let prefixString= await this.GetWorkExpensesPrefixByOrgID();
    this.AddReimbursementForm.patchValue({
      reffid:prefixString,
    });
  }

  adjDocUrl = "";
  isadjDocUp = false;
  onFileSelected(event) {
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file: File = imageData;
    if (file) {
      //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime() / 1000);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Leavedocuments");
      data.append("cloud_name", "dtlt6afvv");
      data.append("public_id", "Leave" + todaysDate);
      this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
        if (imData != null) {
          this.isadjDocUp = true;
          this.adjDocUrl = imData.secure_url;
          this.spinner.hide();
        }
      });
    }
  }

  DocDelete() {
    this.adjDocUrl = "";
    this.isadjDocUp = false;
  }

  submitWRKEXP() {
    let postData;
    let formData = this.AddReimbursementForm.value;
    let user_Info = JSON.parse(localStorage.getItem("user_info"));

    if (this.selectedEmp == "") {
      this.toast.info("Please select the Employee for Proceeding!");
      return;
    }

    postData = {
      reference_id: formData.reffid,
      org_id: this.org_id,
      emp_id: this.selectedEmp,
      pay_item: formData.item,
      amount: formData.amount,
      remarks: formData.remark,
      status: "Approved",
      date_incurred: moment(formData.dateincurred).format("L"),
      is_deleted: false,
      modified_by: user_Info.id,
      created_by: user_Info.id,
    };

    if (this.addPayrollPaymentsFullAccess) {
      this.payrollService
        .AddPayrollWorkExpenses(postData)
        .subscribe((rsp: any) => {
          if (rsp) {
            console.log("rsp", rsp);
            if ((rsp.status = "200")) {
              this.toast.success(rsp.desc);
              this.getList();
              this.closeModel();
            } else {
              this.closeModel();
              this.toast.error("Somthing went worng, Please try Again!");
            }
          }
        });
    } else {
      postData.approver1_roleId = this.createPayrollPaymentApprover1rollId;
      postData.status = "Pending";
      if (this.isDualApproverPayrollPayments)
        postData.approver2_roleId = this.createPayrollPaymentApprover2rollId;
      this.payrollService
        .AddPayrollWorkExpenses(postData)
        .subscribe((rsp: any) => {
          if (rsp) {
            console.log("rsp", rsp);
            if ((rsp.status = "200")) {
              this.toast.success(rsp.desc);
              this.getList();
              this.closeModel();
            } else {
              this.closeModel();
              this.toast.error("Somthing went worng, Please try Again!");
            }
          }
        });
    }
  }

  dataList;
  pendingList = [];
  approvedList = [];
  rejectedList = [];
  activeList = [];

  getList() {
    this.user_info = JSON.parse(localStorage.getItem("user_info"));
    this.payrollService
      .GetPayrollWorkExpensesByOrgId({ orgID: this.org_id })
      .subscribe((rsp: any) => {
        if (rsp) {
          this.pendingList = [];
          this.approvedList = [];
          this.rejectedList = [];
          this.activeList = [];
          this.dataList = rsp;
          rsp.map((elm) => {
            if (elm.amount && elm.amount != null) {
              elm.amount = parseFloat(elm.amount.toFixed(2));
            }
            if (elm.status == "Approved") {
              this.approvedList.push(elm);
            }
            if (elm.status == "Pending") {
              this.pendingList.push(elm);
            }
            if (elm.status == "Rejected") {
              this.rejectedList.push(elm);
            }
            if (elm.status == "Active") {
              this.activeList.push(elm);
            }
          });
        }
      });
  }

  singleData;

  viewReimbersment(data) {
    console.log(data, "CHECK");
    this.singleData = data;
    this.modalService.open(this.reimbursmentModel);
  }

  async aprRejWE(data) {
    this.spinner.show();

    try {
      if (
        this.addPayrollPaymentsFullAccess ||
        data.approver1_roleId === this.user_info.role_id
      ) {
        this.singleData = data;
        if (data.pay_item == "Travel Expense") {
          this.isTravelHidden=false;
          this.showTravel = false;
          await this.handleTravelData(data);
          this.modalService.open(this.aprreimbursmentModel, { size: "lg" });
        } else {
          this.modalService.open(this.aprreimbursmentModel);
        }
      } else {
        this.toast.warning(
          "You don't have the access to approve the reimbursement request! Contact your admin."
        );
      }
    } catch (error) {
      console.error("Error during APR rejection:", error);
      this.toast.error("An error occurred. Please try again later.");
    } finally {
      this.spinner.hide();
    }
  }
  toggleTravelData() {
    this.isTravelHidden = !this.isTravelHidden;
  }

  aprWE(data) {
    this.closeModel();
    let postData = {
      id: data.id,
      approver_date1: data.approver_date1 ? data.approver_date1 : null,
      approver_date2: data.approver_date2 ? data.approver_date2 : null,
      is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
      is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
      approver1_emp_id: data.approver1_emp_id ? data.approver1_emp_id : null,
      approver2_emp_id: data.approver2_emp_id ? data.approver2_emp_id : null,
      modified_by: this.user_info.id,
      status: data.status,
      paid_date: data.paid_date ? data.paid_date : null,
      is_deleted: false,
    };

    if (
      data.approver2_roleId == this.user_info.role_id &&
      data.is_approved_2 == false &&
      data.is_approved_1 == true
    ) {
      postData.approver_date2 = moment().format("L");
      postData.is_approved_2 = true;
      postData.approver2_emp_id = this.user_info.id;
      postData.status = "Approved";
      this.payrollService
        .UpdatePayrollWorkExpensesByItemID(postData)
        .subscribe((rsp: any) => {
          if (rsp.status == "200") {
            this.toast.success(rsp.desc);
            this.getList();
            this.markNotificationReaded(data.id);
          } else {
            this.toast.error(
              "Something went Wrong to Update the Work Expenss!"
            );
          }
        });
    } else if (
      data.approver1_roleId == this.user_info.role_id &&
      data.is_approved_1 == false
    ) {
      postData.approver_date1 = moment().format("L");
      postData.is_approved_1 = true;
      postData.approver1_emp_id = this.user_info.id;
      postData.status = "Pending";
      this.markNotificationReaded(data.id);
      setTimeout(() => {
        this.payrollService
          .UpdatePayrollVariablePayByItemID(postData)
          .subscribe((rsp: any) => {
            if (rsp.status == "200") {
              this.toast.success(
                rsp.desc + "Notification is send to Level 2 Approver!"
              );
              this.getList();
            } else {
              this.toast.error(
                "Something went Wrong to Update the Reimbursement"
              );
            }
          });
      }, 1000);
    }
    //Here is the Question for the call without 1st approver
    else if (data.addPayrollPaymentsFullAccess) {
      postData.status = "Approved";
      postData.is_approved_2 = true;
      postData.approver_date2 = moment().format("L");
      postData.approver2_emp_id = this.user_info.id;
      this.payrollService
        .UpdatePayrollWorkExpensesByItemID(postData)
        .subscribe((rsp: any) => {
          if (rsp.status == "200") {
            this.toast.success(rsp.desc);
            this.getList();
            this.markNotificationReaded(data.id);
          } else {
            this.toast.error(
              "Something went Wrong to Update the Variable Pay!"
            );
          }
        });
    } else {
      console.log(
        "You dont Have the Permission for Approving the Variable Pay!"
      );
      this.toast.warning(
        "You dont Have the Permission for Approving the Variable Pay!"
      );
    }
  }

  rejWE(data) {
    this.closeModel();

    let postData = {
      id: data.id,
      approver_date1: data.approver_date1 ? data.approver_date1 : null,
      approver_date2: data.approver_date2 ? data.approver_date2 : null,
      is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
      is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
      approver1_emp_id: data.approver1_emp_id ? data.approver1_emp_id : null,
      approver2_emp_id: data.approver2_emp_id ? data.approver2_emp_id : null,
      modified_by: this.user_info.id,
      status: "Rejected",
      paid_date: data.paid_date ? data.paid_date : null,
      is_deleted: false,
    };

    this.payrollService
      .UpdatePayrollWorkExpensesByItemID(postData)
      .subscribe((rsp: any) => {
        if (rsp.status == "200") {
          this.toast.success("Reimbersment Successfully Rejected!");
          this.getList();
          this.markNotificationReaded(data.id);
        }
      });
  }

  markPending(data) {
    Swal.fire({
      title: "Do you want to move back the Reimbersment to Pending Section?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        let postData = {
          id: data.id,
          approver_date1: data.approver_date1 ? data.approver_date1 : null,
          approver_date2: data.approver_date2 ? data.approver_date2 : null,
          is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
          is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
          approver1_emp_id: data.approver1_emp_id
            ? data.approver1_emp_id
            : null,
          approver2_emp_id: data.approver2_emp_id
            ? data.approver2_emp_id
            : null,
          modified_by: this.user_info.id,
          status: "Pending",
          paid_date: data.paid_date ? data.paid_date : null,
          is_deleted: false,
        };

        this.payrollService
          .UpdatePayrollWorkExpensesByItemID(postData)
          .subscribe((rsp: any) => {
            if (rsp.status == "200") {
              this.toast.success(
                "Variable Pay Successfully Moved Back to Pending section!"
              );
              this.getList();
              this.markNotificationReaded(data.id);
            }
          });
      }
    });
  }

  sendBackToApr(data) {
    Swal.fire({
      title:
        "Do you want to send back this Variable Pay to the Approval Section?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        let postData = {
          id: data.id,
          payroll_id: null,
          approver_date1: data.approver_date1
            ? moment(data.approver_date1).format("L")
            : null,
          approver_date2: data.approver_date2
            ? moment(data.approver_date2).format("L")
            : null,
          is_approved_1: data.is_approved_1,
          is_approved_2: data.is_approved_2,
          modified_date: moment(data.modified_date).format("L"),
          modified_by: data.modified_by
            ? moment(data.modified_by).format("L")
            : null,
          status: "Approved",
          paid_date: data.paid_date ? moment(data.paid_date).format("L") : null,
          is_deleted: false,
          approver1_roleId: data.approver1_roleId,
          approver2_roleId: data.approver2_roleId,
          approver1_emp_id: data.approver1_emp_id,
          approver2_emp_id: data.approver2_emp_id,
          org_id: data.org_id,
          created_by: data.created_by,
        };

        this.payrollService
          .UpdatePayrollWorkExpensesByItemID(postData)
          .subscribe((rsp: any) => {
            if (rsp.status == "200") {
              this.toast.success(rsp.desc);
              this.getList();
            } else {
              this.toast.error(
                "Something went Wrong to Update the Adjustment!"
              );
            }
          });
      }
    });
  }

  activePayrollname = "";
  activePayrollId = "";
  isPayrollActive = false;
  getcurrentPayrollMonth() {
    this.payrollService
      .getActivePayrollMonthDetailsByOrgId({ id: this.org_id })
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.isPayrollActive = true;
          this.activePayrollname = data[0].name;
          this.activePayrollId = data[0].id;
          console.log(
            "activepayroll",
            this.activePayrollname,
            this.activePayrollId
          );
        } else {
          console.log("No activepayroll");
          this.isPayrollActive = false;
        }
      });
  }

  addToPaytable(data) {
    if (this.showPayrollPaymentBtn) {
      let postData = {
        id: data.id,
        payroll_id: this.activePayrollId,
        approver_date1: data.approver_date1 ? data.approver_date1 : null,
        approver_date2: data.approver_date2 ? data.approver_date2 : null,
        is_approved_1: data.is_approved_1 ? data.is_approved_1 : false,
        is_approved_2: data.is_approved_2 ? data.is_approved_2 : false,
        approver1_emp_id: data.approver1_emp_id ? data.approver1_emp_id : null,
        approver2_emp_id: data.approver2_emp_id ? data.approver2_emp_id : null,
        modified_by: this.user_info.id,
        status: "Active",
        paid_date: data.paid_date ? data.paid_date : null,
        is_deleted: false,
      };
      this.payrollService
        .UpdatePayrollWorkExpensesByItemID(postData)
        .subscribe((rsp: any) => {
          if (rsp.status == "200") {
            this.toast.success(
              "Assigned the Reimbersment Pay to the Active Payroll Table!"
            );
            this.getList();
          } else {
            this.toast.error(
              "Something Went worng While Assigning the Reimbersment Pay!"
            );
          }
        });
    } else {
      this.toast.info(
        "Please Check the Permission for Assigning Reimbersment Pay!"
      );
    }
  }

  MarkWEPaid(data) {
    //!!!for marking Paid
    console.log("This Payment want to mark as Paid!", data);
  }

  markNotificationReaded(reff_id) {
    //!!! call the api for removing the approval notification!!!!
    console.log("The Notifications are marked As Readed.");
  }

  closeReimbursement() {
    this.modalService.dismissAll();
  }

  employeeList = [
    {
      id: "January 2024",
      text: "Prathyush Parambath",
    },
    {
      id: "February 2024",
      text: "Syed Anas",
    },
    {
      id: "March 2024",
      text: "Sharan K Shaji",
    },
  ];

  //Common utilities

  generateRandomReferenceKey(length = 8) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if (this.checkKey(result)) {
      return result;
    } else {
      this.generateRandomReferenceKey();
    }
  }

  checkKey(key): boolean {
    //!!!write the code to check if the key is duplicating
    return true;
  }

  formatCurrency(amount: number): string {
    const formattedAmount = amount.toFixed(2);
    return `AED ${formattedAmount}`;
  }

  closeModel() {
    this.modalService.dismissAll();
    //!!!want to add the initail values for the changes status part
  }

  goToLink() {
    window.open(this.adjDocUrl, "_blank");
  }
  async handleTravelData(data) {
    let travelData = await this.viewTravelData(data.reference_id);
    if (travelData && travelData.length > 0) {
      let vehicleType = travelData[0].vehicle_type;
      if (vehicleType) {
        let vehicleData = await this.getTravelSettings(vehicleType);
        if (vehicleData) {
          this.vehicleData = vehicleData;
        }
        console.log(vehicleData, "Vehicle Data");
      }
    }
  }
  async viewTravelData(id) {
    try {
      const travelData: any = await this.payrollService
        .GetTravelClaimByClaimId({ id: id })
        .toPromise();

      if (travelData && travelData.length > 0) {
        this.travelData = travelData;
        this.totalDistance = travelData
          .reduce((acc, val) => acc + parseFloat(val.distance), 0)
          .toFixed(2);

        console.log(this.totalDistance, "Total Dis");
        return travelData;
      }
    } catch (error) {
      console.error("Error fetching travel data:", error);
    }
  }

  hideTravel() {
    this.showTravel = false;
  }
  start_end_marker = [];
  selectedLatLong;
  selectedData={}
  selectedTravelData={};
  lat;
  lng;
  zoom;

  handleTravelTrackData(data) {
    console.log(data, "***");
    this.selectedData=data;
    let travelData = this.timesheetService
      .GetTravelClaimLocationById({ ID: data.travel_id })
      .subscribe((rsp: any) => {
        if (rsp && rsp[0].travelClaimTrack.length > 0) {
          this.viewMapModel(rsp[0]);
          this.showTravel = true;
          this.isLoading = true;
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        } else {
          this.toast.error("No Location Data Found!");
        }
      });
  }
  async getTravelSettings(type) {
    try {
      const res: any = await this.payrollService
        .GetTravelSettingByOrgId({ id: this.user_info.org_id })
        .toPromise();

      if (res && res.length > 0) {
        let vehicle_type = res.find((elm) => elm.vehicle_type === type);
        return vehicle_type;
      }
    } catch (err) {}
  }
  viewMapModel(data) {
    console.log(data);
    this.selectedTravelData=data;
    var unq = data.travelClaimTrack.reduce((unique, o) => {
      if (!unique.some((obj) => obj.lat === o.lat && obj.lang === o.lang)) {
        unique.push(o);
      }
      return unique;
    }, []);
    this.start_end_marker = [];
    this.selectedLatLong = [];
    unq.map((elm) => {
      this.selectedLatLong.push([Number(elm.lat), Number(elm.lang)]);
    });

    this.start_end_marker.push({
      lat: this.selectedLatLong[0][0],
      lng: this.selectedLatLong[0][1],
      label: "CheckOut: " + data.checkout_formatted_address,
    });
    this.start_end_marker.push({
      lat: this.selectedLatLong[this.selectedLatLong.length - 1][0],
      lng: this.selectedLatLong[this.selectedLatLong.length - 1][1],
      label: "CheckIn: " + data.checkin_formatted_address,
    });
    console.log(this.selectedLatLong, "Location Track");

    (this.lat = this.selectedLatLong[0][0]),
      (this.lng = this.selectedLatLong[this.selectedLatLong.length - 1][1]);
    this.zoom = 20;
  }
    public jobNo = "000";
    public prefixString = "";
    showPrefixText = false;
    public prefix_for = "";
    userInfo=JSON.parse(localStorage.getItem("user_info"));
    public async GetWorkExpensesPrefixByOrgID() {
      try {
        // Fetch last added travel claim prefix
        const data: any = await this.payrollService
          .GetLastAddedWorkExpensesPrefixByOrgID({ ID: this.userInfo.org_id })
          .toPromise();

        if (data.code == "") {
          // Fetch all prefixes
          const prefixes: any = await this.projectService
            .GetAllPrefixByOrgID()
            .toPromise();

          for (let prefix of prefixes) {
            if (prefix.type === "we") {
              if (prefix.prefix_for === "Default") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  this.prefixString = `${splittable[0]}/${moment().format(
                    "YY"
                  )}/${moment().format("MM")}/0001`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              } else if (prefix.prefix_for === "Custom") {
                this.showPrefixText = true;
              } else if (prefix.prefix_for === "Sequence") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  this.prefixString = `${splittable[0]}/001`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              } else if (prefix.prefix_for === "random") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  const random = Math.floor(1000 + Math.random() * 9000);
                  this.prefixString = `${splittable[0]}/${random}`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              }
            }
          }
        } else {
          let lastAddedPrefix = data.code;

          let lastPrefixNumber =
            parseInt(lastAddedPrefix.split("/").pop() || "0", 10) + 1;

          // Fetch all prefixes
          const prefixes: any = await this.projectService
            .GetAllPrefixByOrgID()
            .toPromise();

          for (let prefix of prefixes) {
            if (prefix.type === "we") {
              if (prefix.prefix_for === "Default") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  this.prefixString = `${splittable[0]}/${moment().format(
                    "YY"
                  )}/${moment().format("MM")}/${lastPrefixNumber
                    .toString()
                    .padStart(4, "0")}`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              } else if (prefix.prefix_for === "Custom") {
                this.showPrefixText = true;
              } else if (prefix.prefix_for === "Sequence") {
                if (prefix.prefix_name) {
                  const splittable = prefix.prefix_name.split("/");
                  this.prefixString = `${splittable[0]}/${lastPrefixNumber
                    .toString()
                    .padStart(3, "0")}`;
                  this.prefix_for = prefix.prefix_for;
                  return this.prefixString;
                }
              } else if (prefix.prefix_for === "random") {
                const splittable = prefix.prefix_name.split("/");
                const random = Math.floor(1000 + Math.random() * 9000);
                this.prefixString = `${splittable[0]}/${random}`;
                this.prefix_for = prefix.prefix_for;
                return this.prefixString;
              }
            }
          }
        }
      } catch (error) {
        Swal.fire("Error!", error, "error").then(() => { });
      }
      console.log(this.prefixString, "prefixString");
      return this.prefixString;
    }
}
