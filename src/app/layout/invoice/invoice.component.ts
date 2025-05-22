import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ActivityService } from '../../services/activity.service';
import { AdminSettingService } from '../../services/admin-setting.service';
import { ModuleSetupService } from '../../services/moduleSetup.service';
import { FinanceService } from '../../services/finance.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment = require('moment');
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as _ from "lodash";
import { UserService } from '../../services/user.service';
import { CostService } from '../../services/cost.service';

declare var $: any;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  userInfo:any = JSON.parse(localStorage.getItem('user_info'));
  //userRights
  commonModuleName;
  accessToInvoice = false;

  public invoiceToolbar : ToolbarItems[];
  public totalProjectsModelToolbar : ToolbarItems[];
  selfClaimToolbar : ToolbarItems[];
  @ViewChild('toBeClaimedTableGrid',{static:false}) public toBeClaimedTableGrid: GridComponent;
  @ViewChild('totalToBeClaimedTableGrid',{static:false}) public totalToBeClaimedTableGrid: GridComponent;
  @ViewChild('openProjectGridModel',{static:false}) public openProjectGridModel: GridComponent;



  @ViewChild('totalperfomaInvoiceTableGrid',{static:false}) public totalperfomaInvoiceTableGrid: GridComponent;
  @ViewChild('proformaInvoiceTableGrid',{static:false}) public proformaInvoiceTableGrid: GridComponent;
  @ViewChild('invoiceTableGrid',{static:false}) public invoiceTableGrid: GridComponent;
  @ViewChild('revenueDataTableGrid' , {static: false}) public revenueDataTableGrid: GridComponent;
  @ViewChild('selfClaimGrid' , {static: false}) public selfClaimGrid: GridComponent;
  @ViewChild('selfClaimMainTableGrid' , {static: false}) public selfClaimMainTableGrid: GridComponent;
  @ViewChild('similarToBeClaimTableGrid' , {static: false}) public similarToBeClaimTableGrid: GridComponent;

  headerText= [
    { text: 'To be Claimed' },
    { text: 'Proforma Invoice' },
    { text: 'Invoice' },
    { text: 'Revenue' },
    { text: 'Overdue Receiveables' }
  ]
  toBeClaimedData;

  addPaymentTypeForm: FormGroup;
  addPartPaymentTypeForm: FormGroup;
  addTaxInvoiceForm: FormGroup;
  addSelfClaimForm: FormGroup;
  dateRangeForm: FormGroup;
  showFull = true
  showBreakDown = false
  selectedInvoiceData;
  similarInvoiceData;
  similarSelectedInvoiceData;
  combineProformatoBeClaimedInvoiceData;
  showInvoiceTotal = 0
  draftProformaInvoiceData;
  viewProformaInvoiceData;
  partAmountPayment = true;
  mainTabListing = true;
  draftProformaInvoicediv = false;
  invoiceDraftDiv = false;
  projectDetails
  totalInvoiceAmt = 0
  getHeaderValue = 'To be Claimed';

  isSixMonthActive = false;
  isYearActive = false;

  isMonthActive = false;
  isWeekActive = true;
  isTodayActive= false;
  fromDate = moment().subtract(7, "days").format('L');
  toDate = moment().format('L');
  dateTextToDisplay = moment().subtract(7, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
  maxRangeDate: Date = new Date(new Date().toDateString());
  todaysDate = new Date();
  showInvoiceError = false;
  stageInvoiceData;

  selfClaimDiv = false;
  commonPlaceholder = 'Search a Project to continue';
  systemGeneratedInvoiceData;
  selfClaimData;
  selectedSelfClaim = [];
  selectedSelfClaimFinal
  showContinuebtn = false;
  selfClaimFinalDiv = false;
  selectedSelfCalimTotal;
  proformaAdvanceData;
  revenueData;
  invoiceInDepthCal;

  projectListing;
  checkSelfClaim = false;
  checkAdvance = false;
  cardDataToDisplay = {
    Progressive:{
      toBeClaimValue: 0
    },
    advanceToBeClaimed: {
      toBeClaimCount: 0,
      toBeClaimValue: 0,
      toBeClaimedCount: 0,
      toBeClaimedValue: 0,
    },
    toBeClaimed: {
      toBeClaimCount: 0,
      toBeClaimValue: 0,
      toBeClaimedCount: 0,
      toBeClaimedValue: 0,
    },
    proformaInvoice: {
      toBeClaimCount: 0,
      toBeClaimValue: 0,
      toBeClaimedCount: 0,
      toBeClaimedValue: 0,
    },
    invoice: {
      toBeClaimCount: 0,
      toBeClaimValue: 0,
    },
    Revenue: {
      toBeClaimCount: 0,
      toBeClaimValue: 0,
    }
  }
  showSpinner = true;

  //discount
  invoiceDiscountApplied = false;
  accessToDiscount = false;
  checkDisApprover = false;
  discountApprover1Id;
  discountApprover1Name;
  discountApprover2Id;
  discountApprover2Name;
  dualApproverDiscount = false;
  invoiceModuleID;
  currentRowDataPerfomaInv;
  accessToAppDissDiscount = false;
  //notification
  notificationMessageData;
  discountRequestTab = false;
  discountReqAppData;
  discountDetails;
  stageInvoiceDetails;

  totalToBeClaimedModelOpen = false;
  totalPerfomaInvoiceModelOpen = false;
  totalOverDueModelOpen = false;
  totalToBeClaimedData;
  totalToBeClaimedAmt = 0;
  totalPerfomaInvoiceData;
  totalPerfomaInvoiceAmt = 0;
  totalOverDueInvoiceData;
  totalOverDueInvoiceAmt = 0;
  invoiceMinDate;

  singleProjectRevData;
  projectRevenueTotal = 0
  saveDraftID;

  invoiceRelated: boolean=false;
  noninvoiceRelated: boolean=false;

  rangeDataView = 0;
  overDataView = 0;
  totalPercentage = 0;

  singleCustomerData;
  allCustomerStatement;
  isCommission = false;
  commDraftProformaInvoicediv = false;
  commissionData;
  commissionPolicyData;
  venCustPhone;
  commInvoiceDraftDiv = false;

  extensionsByProject;
  singleProjectData;
  mainProjectData;

  backLogProjectData;
  openProjectData;
  openProjectInnerData;
  openProjectsModelHeader;



  constructor(
    public ModuleSetupService: ModuleSetupService,
    private projectService: ProjectService,
    private activityService: ActivityService,
    private spinner: NgxSpinnerService,
    private toastr:ToastrService,
    private userService:UserService,
    private financeService: FinanceService,
    public AdminSettingService: AdminSettingService,
    public router: Router,
    private costService: CostService
  ) { }

  ngOnInit(){
    this.spinner.show();
    this.totalToBeClaimed();
    this.totalPerfomaInvoice();
    this.totalOverDueInvoice();
    this.invoiceToolbar = ['Search', 'PdfExport', 'ExcelExport'];
    this.totalProjectsModelToolbar = ['Search', 'PdfExport', 'ExcelExport'];
    this.selfClaimToolbar = ['Search'];
    this.checkUserRights();
    this.checkNotificationRequest();
    //form control
    this.dateRangeForm = new FormGroup({
      daterange: new FormControl(''),
    });

    this.dateRangeForm.patchValue({
      daterange: [this.fromDate, this.toDate]
    });

    //active when date picker value changes
    this.dateRangeForm.get('daterange').valueChanges.subscribe(() => {
      this.spinner.show();
      let startTime = this.dateRangeForm.get('daterange').value;
      this.fromDate = moment(startTime[0]).format('L');
      this.toDate = moment(startTime[1]).format('L');
      this.checkTabApiCall();
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.dateTextToDisplay = moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');
    });

    //tab API
    this.checkTabApiCall();

    //form control
    this.addPaymentTypeFormInputs();
    this.addPartPaymentTypeFormInputs();
    this.addaddTaxInvoiceFormInputs();
    this.addSelfClaimFormInputs();

    //to be claimed model calculate percentage amt
    this.addPartPaymentTypeForm.get('partPayPer').valueChanges.subscribe((x) => {
      if(x !== null){
        this.showInvoiceTotal = this.selectedInvoiceData.map(item => item.amount).reduce((prev, next) => prev + next);
        let perToAmt = (x/100) * this.showInvoiceTotal;
        this.addPartPaymentTypeForm.patchValue({
          partPayPerAmt: (perToAmt).toFixed(2)
        });
      }
    });

  }

  checkUserRights(){
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let postData = { id : user_info.role_id }

    this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
      data.map((item) => {
        item.module_name = item.module_name.replace(/\s+/g, '');;
        return item;
      });
      this.commonModuleName = _.groupBy(data, 'module_name');
      //settings
      this.invoiceModuleID = this.commonModuleName.Invoice[0].id;
      if(this.commonModuleName.Invoice){
        this.commonModuleName.Invoice.map((elm) => {
          if(elm.section_name === 'View Invoice' && elm.is_allow){
            this.accessToInvoice = true;
          }else if(elm.section_name === 'Add discount' && elm.is_allow){
            this.accessToDiscount = elm.is_allow;
            this.getApproverForDiscount();
          }else if(elm.section_name === 'Approve/Disapprove Discount' && elm.is_allow){
            this.accessToAppDissDiscount = elm.is_allow;
          }
        });
      }else{
        this.accessToInvoice = false;
        this.accessToDiscount = false;
      }
    });
  }



  openProjectGridModelSearch(): void {
    document.getElementById(this.openProjectGridModel.element.id + "_searchbar").addEventListener('keyup', () => {
      this.openProjectGridModel.search((event.target as HTMLInputElement).value)
    });
  }

  ProjectDetailsClick(args: ClickEventArgs): void {
    switch (args.item.text) {
      case 'PDF Export':
          this.openProjectGridModel.pdfExport();
          break;
      case 'Excel Export':
          this.openProjectGridModel.excelExport();
          break;
      case 'CSV Export':
          this.openProjectGridModel.csvExport();
      break;
    }
  }

  getApproverForDiscount(){
    let userDataLocal = JSON.parse(localStorage.getItem('user_info'));
    let postData = {
      roleID: userDataLocal.role_id,
      moduleID: this.invoiceModuleID
    }
    this.ModuleSetupService.GetLeaveRoleModuleApproverByRoleIDandModuleID(postData).subscribe((data: any) => {
      data.map((elm) => {
        if(elm.section_name === 'Add discount'){
          if(elm.approver1_roleId !== null){
            this.checkDisApprover = true;
            this.discountApprover1Id = elm.approver1_roleId;
            this.discountApprover1Name = elm.approver1_role_name;
            if(elm.approver2_roleId !== null){
              this.dualApproverDiscount = true;
              this.discountApprover2Id = elm.approver2_roleId;
              this.discountApprover2Name = elm.approver2_role_name;
            }
          }
        }
      });
    });
  }

  getCommonDateType(value){
    if(value === 'today'){
      this.fromDate = moment().format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().format('ddd, D MMM YYYY')
      this.isTodayActive = true;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.checkTabApiCall();
    }else if(value === 'weeks'){
      this.fromDate = moment().subtract(7, "days").format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(7, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = true;
      this.isMonthActive = false;
      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.checkTabApiCall();
    }else if(value === 'month')   {
      this.fromDate = moment().startOf('month').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(30, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = true;

      this.isSixMonthActive = false;
      this.isYearActive = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.checkTabApiCall();
    }

    else if(value === 'six-month')   {
      this.fromDate = moment().subtract(6, 'months').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(30, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.isSixMonthActive = true;
      this.isYearActive = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.checkTabApiCall();
    }

    else if(value === 'year')   {
      this.fromDate = moment().startOf('year').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(30, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;

      this.isSixMonthActive = false;
      this.isYearActive = true;

      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.checkTabApiCall();
    }
  }

  //card function
  callCardApi(){
    this.showSpinner = true;
    //first API
    this.projectService.GetAllProjectRevenueByOrgID(this.fromDate, this.toDate).subscribe((api1:any) => {
      let Progressive = {
        toBeClaimValue: api1.value
      }
      this.cardDataToDisplay.Progressive = Progressive;
      this.GetAllOpenProjectRevenueByOrgID();
      this.GetAllBackLogProjectRevenueByOrgID();

      this.projectService.GetProformaInvoiceCount(this.fromDate, this.toDate).subscribe((api2:any) => {
        if(api2){
          api2.map((elm) => {
            if(elm.totalAdvanceCount){
              let advanceToBeClaimed = {
                toBeClaimCount: elm.totalAdvanceCount,
                toBeClaimValue: elm.totalAdvanceAmount,
                toBeClaimedCount: 0,
                toBeClaimedValue: 0,
              }
              api2.map((elm2) => {
                if(elm2.totalAdvanceClaimCount){
                  advanceToBeClaimed.toBeClaimedCount = elm2.totalAdvanceClaimCount;
                  advanceToBeClaimed.toBeClaimedValue = elm2.totalAdvanceClaimAmount;
                }
              });

              this.cardDataToDisplay.advanceToBeClaimed = advanceToBeClaimed;
            }

            if(elm.totalAdvanceCount === undefined){
              api2.map((elm2) => {
                if(elm2.totalAdvanceClaimCount){
                  this.cardDataToDisplay.advanceToBeClaimed.toBeClaimedCount = elm2.totalAdvanceClaimCount;
                  this.cardDataToDisplay.advanceToBeClaimed.toBeClaimedValue = elm2.totalAdvanceClaimAmount;
                }
              });
            }

            if(elm.totalClaimCount){
              let toBeClaimed = {
                toBeClaimCount: elm.totalClaimCount,
                toBeClaimValue: elm.totalClaimAmount,
                toBeClaimedCount: 0,
                toBeClaimedValue: 0,
              }
              api2.map((elm2) => {
                if(elm2.totalClaimedCount){
                  toBeClaimed.toBeClaimedCount = elm2.totalClaimedCount;
                  toBeClaimed.toBeClaimedValue = elm2.totalClaimed;
                }
              });
              this.cardDataToDisplay.toBeClaimed = toBeClaimed;
            }

            if(elm.totalClaimCount === undefined){
              api2.map((elm2) => {
                if(elm2.totalClaimedCount){
                  this.cardDataToDisplay.toBeClaimed.toBeClaimedCount = elm2.totalClaimedCount;
                  this.cardDataToDisplay.toBeClaimed.toBeClaimedValue = elm2.totalClaimed;
                }
              });
            }



            if(elm.totalDraftCount){
              let proformaInvoice = {
                toBeClaimCount: elm.totalDraftCount,
                toBeClaimValue: elm.totalDraftAmount,
                toBeClaimedCount: 0,
                toBeClaimedValue: 0,
              }
              api2.map((elm2) => {
                if(elm2.totalClaimDraftCount){
                  proformaInvoice.toBeClaimedCount = elm2.totalClaimDraftCount;
                  proformaInvoice.toBeClaimedValue = elm2.totalClaimDraftAmount;
                }
              });
              this.cardDataToDisplay.proformaInvoice = proformaInvoice;
            }



            if(elm.totalDraftCount === undefined){
              api2.map((elm2) => {
                if(elm2.totalClaimDraftCount){
                  this.cardDataToDisplay.proformaInvoice.toBeClaimedCount = elm2.totalClaimDraftCount;
                  this.cardDataToDisplay.proformaInvoice.toBeClaimedValue = elm2.totalClaimDraftAmount;
                }
              });
            }





            if(elm.totalStageCount){
              let invoice = {
                toBeClaimCount: elm.totalStageCount,
                toBeClaimValue: elm.totalStageAmount,
                toBeClaimedCount: 0,
                toBeClaimedValue: 0,
              }

              api2.map((elm2) => {
                if(elm2.totalStageClaimCount){
                  invoice.toBeClaimedCount = elm2.totalStageClaimCount;
                  invoice.toBeClaimedValue = elm2.totalStageClaimAmount;
                }
              });
              this.cardDataToDisplay.invoice = invoice;

            }

            // if(elm.totalStageCount === undefined){
            //   let invoice = {
            //     toBeClaimCount: elm.totalStageCount,
            //     toBeClaimValue: elm.totalStageAmount,
            //     toBeClaimedCount: 0,
            //     toBeClaimedValue: 0,
            //   }
            //   api2.map((elm2) => {
            //     if(elm2.totalStageClaimCount){
            //       invoice.toBeClaimedCount = elm2.totalAdvanceClaimCount;
            //       invoice.toBeClaimedValue = elm2.totalAdvanceClaimAmount;
            //     }
            //   });
            //   this.cardDataToDisplay.invoice = invoice;
            // }


          });
          this.projectService.GetAdvacneRevInv(this.fromDate, this.toDate).subscribe((data3:any) => {
            if(data3){
              data3.map((elm) => {
                let Revenue = {
                  toBeClaimCount: elm.totalAdvRevCount,
                  toBeClaimValue: elm.totalAdvRevAmount,
                }
                this.cardDataToDisplay.Revenue = Revenue;
              });
              this.showSpinner = false;
            }
          });
        }

      });
    });
  }


  GetAllOpenProjectRevenueByOrgID(){
    let postData={
      "fromDate": this.fromDate,
      "orgID": localStorage.getItem('org_id'),
      "toDate": this.toDate
    }
    this.financeService.GetAllOpenProjectRevenueByOrgID(postData).subscribe((data:any) => {
      if(data){
        this.openProjectData = data

      }
    },(error) => {
      Swal.fire(
      'Error!',
       error,
      'error')
    });
  }


  GetAllBackLogProjectRevenueByOrgID(){
    let postData={
      "fromDate": this.fromDate,
      "orgID": localStorage.getItem('org_id'),
      "toDate": this.toDate
    }
    this.financeService.GetAllBackLogProjectRevenueByOrgID(postData).subscribe((data:any)  => {
      if(data){
        let processData = []
        data.basedOnProject.map((elem) => {
          processData.push({
            budgeted_hours: Number(elem.budgeted_hours),
            budgeted_hours_value: Number(elem.budgeted_hours_value),
            task_count: Number(elem.task_count),
            project_name: elem.project_name,
            created_date: elem.created_date,
          })
        })
        let secondData = [];
        processData.map((elm) => {
          if(elm.budgeted_hours_value > 0){
            secondData.push({
              budgeted_hours: Number(elm.budgeted_hours),
              budgeted_hours_value: Number(elm.budgeted_hours_value),
              task_count: Number(elm.task_count),
              project_name: elm.project_name,
              created_date: elm.created_date,
            })
          }
        })
        let finalData;
        finalData = {
          basedOnProject: secondData,
          hours: Math.round(_.sumBy(secondData, 'budgeted_hours')),
          project_count: secondData.length,
          task_count: Math.round(_.sumBy(secondData, 'task_count')),
          value: Math.round(_.sumBy(secondData, 'budgeted_hours_value')),
        }
        this.backLogProjectData = finalData;
      }
    },(error) => {
      Swal.fire(
      'Error!',
        error,
      'error')
    });
  }


  OpenProjectsModel(type,data){
    $('#open_project_modal').modal('show');
    this.openProjectsModelHeader = type
    this.openProjectInnerData = data.map((elm) => {
      elm.created_date = elm.created_date
      elm.budgeted_hours_value = Number(elm.budgeted_hours_value);
      elm.budgeted_hours = Number(elm.budgeted_hours);
      elm.task_count = Number(elm.task_count);
      return elm;
    });
  }

  closeOpenProjectModel(){
    $('#open_project_modal').modal('hide');
    this.openProjectInnerData = ''
  }





  tabSelected(event){
    this.getHeaderValue = event.selectedItem.textContent;
    this.checkTabApiCall();
  }

  checkTabApiCall(){
    this.spinner.show();
    this.callCardApi();
    if(this.getHeaderValue === 'To be Claimed'){
      this.GetProformaInvoiceByOrgId();
    }else if(this.getHeaderValue === 'Proforma Invoice'){
      this.GetDraftProformaInvoiceByOrgId();
    }else if(this.getHeaderValue === 'Invoice'){
      this.GetStageInvoiceByOrgId();
    }else if(this.getHeaderValue === 'Revenue'){
      this.GetRevenuePaymentOrgId();
    }
    else if(this.getHeaderValue === 'Overdue Receiveables'){
      this.totalOverDueInvoice();
    }
  }

  //tab1
  GetProformaInvoiceByOrgId(){
    this.projectService.GetProformaInvoiceByOrgId(this.fromDate, this.toDate).subscribe((data: any) => {
      let toBeClaimed = [];
      data.map((elm) => {
        elm.proInvId = 'INV/'+elm.id.slice(0, 5);
        elm.total = parseFloat(elm.amount) + (elm.amountClaimed === null ? 0 : parseFloat(elm.amountClaimed))
        toBeClaimed.push(elm)
      });
      this.toBeClaimedData = toBeClaimed;
      this.spinner.hide();
    });
  }

  //tab2
  GetDraftProformaInvoiceByOrgId(){
    this.projectService.GetDraftProformaInvoiceByOrgId(this.fromDate, this.toDate).subscribe((data: any) => {
      this.draftProformaInvoiceData = data;
      this.spinner.hide();
    });
  }

  //tab3
  GetStageInvoiceByOrgId(){
    this.projectService.GetStageInvoiceByOrgId(this.fromDate, this.toDate).subscribe((data: any) => {
      data.map((elm) => {
        elm.taxExcluded = ((5/100) * parseFloat(elm.advAmount)).toFixed(2);
        if(elm.discountAmount !== null){
          elm.AmoutPlusVat = parseFloat((parseFloat((parseFloat(elm.advAmount) + parseFloat(elm.taxExcluded)).toFixed(2)) - parseFloat(elm.discountAmount)).toFixed(2))
        }else{
          elm.AmoutPlusVat = parseFloat((parseFloat(elm.advAmount) + parseFloat(elm.taxExcluded)).toFixed(2));
        }
      });
      this.stageInvoiceData = data;
      this.spinner.hide();
    });
  }

  //tab4
  GetRevenuePaymentOrgId(){
    this.projectService.GetRevenuePaymentOrgId(this.fromDate, this.toDate).subscribe((data: any) => {
      this.revenueData = data;
      this.spinner.hide();
    });
  }

  //tab1 functions
  openDraft(rowData){
    this.isCommission = rowData.isCommission;
    if(this.isCommission){
      let postData = {
        id: rowData.projectId,
        fromDate: rowData.createdDate,
      }
      this.projectService.FetchCommissionPolicyByIdAndDate(postData).subscribe((data:any) => {
        this.projectService.GetCommissionServiceByComId({id: data[0].commisionId}).subscribe((comData:any) => {
          this.commissionData = comData[0];
          let getRowData: any = {
            id: rowData.id,
            org_id: rowData.org_id,
            projectId: rowData.projectId,
            projectName: rowData.projectName !== null ? rowData.projectName : rowData.projectCName,
            customerName: rowData.customerName,
            term_name: rowData.term_name,
            amount: parseFloat(rowData.amount),
            description: rowData.description,
            createdDate: rowData.createdDate,
            modifiedDate: rowData.modifiedDate,
            proInvId: rowData.proInvId,
            isDeleted: rowData.isDeleted,
            amountClaimed:null,
            draftId:null,
            status:rowData.status
          }

          if(this.commissionData.vendorId !== ''){
            this.projectService.GetCommissionVendorsById({id: this.commissionData.vendorId}).subscribe((venData) => {
              getRowData.custPhone = venData[0].vendorPhone
            });
          }else{
            getRowData.custPhone = rowData.custPhone
          }

          if(comData[0].projectId !== ''){
            this.projectService.FindByProjectID({id:rowData.projectId}).subscribe((proData) => {
              this.projectDetails = proData;
            });
          }

          this.selectedInvoiceData = [getRowData];
          this.addPaymentTypeForm.patchValue({
            fullPayment: this.selectedInvoiceData[0].amount.toFixed(2)
          });

          $('#total_to_be_claimed_modal').modal('hide');
          $('#isCommission_modal').modal('show');
        });
      });
    }else{
      let getRowData = {
        id: rowData.id,
        org_id: rowData.org_id,
        projectId: rowData.projectId,
        customerName: rowData.customerName,
        custPhone: rowData.custPhone,
        projectName: rowData.projectName,
        term_name: rowData.term_name,
        amount: parseFloat(rowData.amount),
        description: rowData.description,
        createdDate: rowData.createdDate,
        modifiedDate: rowData.modifiedDate,
        proInvId: rowData.proInvId,
        isDeleted: rowData.isDeleted,
        amountClaimed:null,
        draftId:null,
        status:rowData.status
      }
      this.projectService.FindByProjectID({id:getRowData.projectId}).subscribe((proData) => {
        this.projectDetails = proData;
      });
      let processData = [getRowData];
      this.selectedInvoiceData = processData;
      this.checkAdvance = this.selectedInvoiceData[0].description.includes("Advance");
      if(this.checkAdvance){
        this.callCommonForProformaInvoice();
        if(this.totalToBeClaimedModelOpen){
          $('#total_to_be_claimed_modal').modal('hide');
        }
        $('#consolidationView_modal').modal('show');
      }else{
        this.projectService.GetProformaInvoiceByProject({ id: this.selectedInvoiceData[0].projectId }).subscribe((data: any) => {
          if(Array.isArray(data)){
            let filterData = [];
            data.map((elm) => {
              if(!elm.isCommission){
                elm.custPhone = rowData.custPhone,
                elm.proInvId = 'INV/'+elm.id.slice(0, 5);
                elm.amount = parseFloat(elm.amount)
                if(elm.id !== this.selectedInvoiceData[0].id && elm.amount !== 0){
                  filterData.push(elm)
                }
              }
            });
            this.similarInvoiceData = filterData;
            if(this.similarInvoiceData.length === 0){
              this.callCommonForProformaInvoice();
            }else{
              this.showBreakDown = false;
            }
          }else{
            this.callCommonForProformaInvoice();
          }
          if(this.totalToBeClaimedModelOpen){
            $('#total_to_be_claimed_modal').modal('hide');
          }
          $('#consolidationView_modal').modal('show');
        });
      }
    }
  }

  callCommonForProformaInvoice(){
    this.showBreakDown = true;
    this.showInvoiceTotal = this.selectedInvoiceData.map(item => item.amount).reduce((prev, next) => prev + next);
    this.addPaymentTypeForm.patchValue({
      fullPayment: this.showInvoiceTotal.toFixed(2)
    });
    this.addPartPaymentTypeForm.patchValue({
      partPaymentType: 'Amount',
    });
  }

  consolDesc(val){
    this.showBreakDown = true;
    if(val === 'Yes'){
      this.selectedInvoiceData = [...this.selectedInvoiceData, ...this.similarSelectedInvoiceData]
    }
    this.showInvoiceTotal = this.selectedInvoiceData.map(item => item.amount).reduce((prev, next) => prev + next);
    this.addPaymentTypeForm.patchValue({
      fullPayment: this.showInvoiceTotal.toFixed(2)
    });
  }

  rowSelectedToBeCla(){
    this.similarSelectedInvoiceData = this.similarToBeClaimTableGrid.getSelectedRecords();
  }

  updateAmountClaim(){
    this.spinner.show();
    let formValue = this.addPaymentTypeForm.getRawValue();
    let formValue2 = this.addPartPaymentTypeForm.getRawValue();
    if(this.showFull){
      let fullAmount:any = parseFloat(formValue.fullPayment)
      this.callExecute(fullAmount, fullAmount)
    }else{
      let amount: any;
      if(this.partAmountPayment){
        amount = parseFloat(formValue2.partPayAmt);
        this.callExecute(amount, amount)
      }else{
        amount = parseFloat(formValue2.partPayPerAmt);
        this.callExecute(amount, amount)
      }
    }
  }

  callExecute(percentAmt, sendAmt){
    let sendSelectedInvoiceData = JSON.parse(JSON.stringify(this.selectedInvoiceData));
    sendSelectedInvoiceData.map((itm: any)=>{
      if(itm.amount >= percentAmt){
        itm.amountClaimed = parseFloat(percentAmt.toFixed(2))
        itm.amount = parseFloat((itm.amount - percentAmt).toFixed(2));
        percentAmt = 0;
      } else if(itm.amount <= percentAmt){
        itm.amountClaimed = parseFloat(itm.amount.toFixed(2));
        percentAmt = parseFloat((percentAmt - itm.amount).toFixed(2));
        itm.amount = 0
      }
    });

    let profromaIds = []
    this.selectedInvoiceData.map((elm) => {
      profromaIds.push(elm.id)
    });

    let postData = {
      "id": this.generateId(15),
      "profromaIds": profromaIds.toString(),
      "org_id": this.selectedInvoiceData[0].org_id,
      "projectId": this.selectedInvoiceData[0].projectId,
      "customerName": this.selectedInvoiceData[0].customerName,
      "custPhone": this.selectedInvoiceData[0].custPhone,
      "amount": sendAmt,
      "projectName": this.selectedInvoiceData[0].projectName,
      "status": "Pending",
      "createdDate": moment().format('L'),
      "isConsolidated": this.selectedInvoiceData.length > 1 ? true : false,
      "invoiceCount": this.selectedInvoiceData.length,
      "invoicedDate": moment(this.selectedInvoiceData[0].createdDate).format('L'),
      "modifiedDate": moment().format('L'),
      "createdByEmpId": this.userInfo.id,
      "createdBy": this.userInfo.full_name,
    }

    this.projectService.AddDraftProformaInvoice(postData).subscribe((data: any) => {
      this.GetProformaInvoiceByOrgId();
      if(data.status === '200'){
        this.selectedInvoiceData.map((elm) => {
          let postData2 = {
            id: elm.id,
            empId: postData.id
          }
          this.projectService.UpdateProformDraftIds(postData2).subscribe((data2: any) => {

          });
        });

        sendSelectedInvoiceData.map((elm, index) => {
          let postData3 = {
            id: elm.id,
            amount: elm.amount,
            amountClm: elm.amountClaimed
          }
          this.projectService.UpdateAmountClaimed(postData3).subscribe((data3: any) => {
            if(sendSelectedInvoiceData.length === index + 1){
              this.closeCreateProformaInvoiceModel();
              this.successToast('Perfoma Invoice Created');
              this.saveDraftID = postData.id;
              $('#continue_from_drafttoperfoma_modal').modal('show');
            }
          });
        });
      }else{
        this.failerToast();
        this.closeCreateProformaInvoiceModel();
      }
    });
  }

  updateAmountClaimOI(){
    let profromaIds = []
    this.selectedInvoiceData.map((elm) => {
      profromaIds.push(elm.id)
    });

    let postData = {
      "id": this.generateId(15),
      "profromaIds": profromaIds.toString(),
      "org_id": this.selectedInvoiceData[0].org_id,
      "projectId": this.selectedInvoiceData[0].projectId,
      "customerName": this.selectedInvoiceData[0].customerName,
      "custPhone": this.selectedInvoiceData[0].custPhone,
      "amount": this.selectedInvoiceData[0].amount,
      "projectName": this.selectedInvoiceData[0].projectName,
      "status": "Pending",
      "createdDate": moment().format('L'),
      "isConsolidated": false,
      "isCommission": this.isCommission,
      "invoiceCount": this.selectedInvoiceData.length,
      "invoicedDate": moment(this.selectedInvoiceData[0].createdDate).format('L'),
      "modifiedDate": moment().format('L'),
      "createdByEmpId": this.userInfo.id,
      "createdBy": this.userInfo.full_name,
    }

    this.projectService.AddDraftProformaInvoice(postData).subscribe((data: any) => {
      if(data.status === '200'){
        this.selectedInvoiceData.map((elm, index) => {
          let postData2 = {
            id: elm.id,
            empId: postData.id
          }
          this.projectService.UpdateProformDraftIds(postData2).subscribe((data2: any) => {});
          let postData3 = {
            id: elm.id,
            amount: 0,
            amountClm: elm.amount
          }
          this.projectService.UpdateAmountClaimed(postData3).subscribe((data3: any) => {
            if(this.selectedInvoiceData.length === index + 1){
              this.GetProformaInvoiceByOrgId();
              this.closeCreateProformaInvoiceModel();
              this.successToast('Perfoma Invoice Created');
            }
          });
        });
      }else{
        this.failerToast();
        this.closeCreateProformaInvoiceModel();
      }
    });
  }

  closeCreateProformaInvoiceModel(){
    if(this.isCommission){
      $('#isCommission_modal').modal('hide');
    }else{
      $('#consolidationView_modal').modal('hide');
      this.showBreakDown = false;
      this.showFull = true;
      this.partAmountPayment = true;
      this.checkTabApiCall();
      this.addPartPaymentTypeForm.reset();
    }
    this.addPaymentTypeForm.reset();
  }

  detectPaymentType(event){
    if(event.srcElement.value === 'full'){
      this.showFull = true;
      this.addPaymentTypeForm.patchValue({
        fullPayment: this.showInvoiceTotal.toFixed(2)
      });

      this.addPartPaymentTypeForm.patchValue({
        partPayPer: 0,
        partPayPerAmt: 0,
        partPayAmt: 0
      });
    }else{
      this.showFull = false;
    }
  }

  detectpartPaymentType(event){
    if(event.srcElement.value === 'Amount'){
      this.partAmountPayment = true;
      this.addPartPaymentTypeForm.patchValue({
        partPayPer: 0,
        partPayPerAmt: 0
      });
    }else{
      this.partAmountPayment = false;
      this.addPartPaymentTypeForm.patchValue({
        partPayAmt: 0
      });
    }
  }

  //tab2 functions
  openDraftProformaInvoice(rowData){
    this.currentRowDataPerfomaInv = rowData;
    this.checkSelfClaim = rowData.isSelfClaimed;
    if(this.totalPerfomaInvoiceModelOpen){
      $('#total_invoice_perfoma_modal').modal('hide');
    }
    if(rowData.isCommission){
      this.callIsCommission();
    }else{
      if(!rowData.isSelfClaimed){
        this.spinner.show();
        let profromaIds = rowData.profromaIds.split(",");
        let sendArray = [];
        profromaIds.map((elm) => {
          sendArray.push({id: elm})
        });

        let projectData = {
          orgID: rowData.org_id,
          id: rowData.projectId,
        }
        this.projectService.ValidateAdvanceInvoice(projectData).subscribe((advanceData: any) =>{
          this.proformaAdvanceData = advanceData;
        });

        let postData = { paymentPolicy: sendArray };
        let arrayData = [];
        this.projectService.GetProformaInvoiceByList(postData).subscribe((data: any) => {
          let finalData = data;
          this.projectService.FindByProjectID({id:finalData[0].projectId}).subscribe((proData) => {
            this.projectDetails = proData;
            finalData.map((elm2) => {
              elm2.projectName = rowData.projectName
              let postData2 = {
                id: elm2.projectId,
                empId: elm2.term_name
              }
              this.projectService.GetPaymentPolicytermName(postData2).subscribe((data2: any) => {
                data2.map((elm3) => {
                  finalData.map((elmFin2) => {
                    if(elm3.term_name === elmFin2.term_name){
                      elmFin2.paymentEventpercent = elm3.paymentEventpercent;
                      elmFin2.term_percent = elm3.term_percent;
                      elmFin2.payment_event = elm3.payment_event;
                      elmFin2.stage_name = elm3.stage_name;
                      elmFin2.custPhone = this.projectDetails.entityCustomer.phone;
                      elmFin2.projectId = this.projectDetails.id;
                      elmFin2.projectTotal = parseFloat(this.projectDetails.projectAttribute.total_amount);
                      elmFin2.advanceAmt = elm3.stage_name === "Advance" ? 0 : (parseFloat(elm3.term_percent)/100) * parseFloat(this.proformaAdvanceData.term_value);
                      elmFin2.retentionAmt = elm3.stage_name === "Advance" ? 0 : (elm3.retetionPercent === null ? 0 : parseFloat(elm3.retetionValue))
                      elmFin2.amountClaimedFinalUI = ((parseFloat(elmFin2.amountClaimed) - elmFin2.advanceAmt) - elmFin2.retentionAmt).toFixed(2);

                      let taxData = {
                        org_id: elmFin2.org_id,
                        createdDate: elmFin2.createdDate,
                        projectId: elmFin2.projectId,
                        customerName: elmFin2.customerName,
                        description: elmFin2.description,
                        term_name: "VAT",
                        projectName: elmFin2.projectName,
                        custPhone: elmFin2.custPhone,
                        draftId: elmFin2.draftId,
                        paymentEventpercent: elmFin2.paymentEventpercent,
                        term_percent: elmFin2.term_percent,
                        payment_event: elmFin2.payment_event,
                        stage_name: elmFin2.stage_name,
                        projectTotal: elmFin2.projectTotal,
                        advanceAmt: elmFin2.advanceAmt,
                        retentionAmt: elmFin2.retentionAmt,
                        amountClaimedFinalUI: ((5/100) * parseFloat(elmFin2.amountClaimedFinalUI)).toFixed(2),
                      }
                      arrayData.push(elmFin2,taxData)
                    }
                  });
                });
                this.viewProformaInvoiceData = arrayData;
                let amount = this.viewProformaInvoiceData.map(item => parseFloat(item.amountClaimedFinalUI)).reduce((prev, next) => prev + next);
                this.totalInvoiceAmt = (amount).toFixed(2);
                this.mainTabListing = false;
                this.draftProformaInvoicediv = true;
                this.spinner.hide();
              });
            });
          });
        });
      }else{
        this.callSelfClaimRow(rowData)
      }
    }
  }

  callIsCommission(){
    this.commDraftProformaInvoicediv = this.currentRowDataPerfomaInv.isCommission;
    this.mainTabListing = false;
    let postData = {
      id: this.currentRowDataPerfomaInv.projectId,
      fromDate: this.currentRowDataPerfomaInv.invoicedDate,
    }
    this.projectService.FetchCommissionPolicyByIdAndDate(postData).subscribe((data:any) => {
      this.commissionPolicyData = data[0];
      this.projectService.GetCommissionServiceByComId({id: data[0].commisionId}).subscribe((comData:any) => {
        this.commissionData = comData[0];
        if(this.commissionData.vendorId !== ''){
          this.projectService.GetCommissionVendorsById({id: this.commissionData.vendorId}).subscribe((venData) => {
            this.venCustPhone = venData[0].vendorPhone
          });
        }else{
          this.venCustPhone = this.currentRowDataPerfomaInv.custPhone
        }

        let arrayData = [];
        let row1 = {
          createdDate: this.commissionPolicyData.triggerDate,
          term_name: this.commissionPolicyData.term_name,
          term_percent: this.commissionPolicyData.term_percent,
          projectId: this.commissionPolicyData.project_id,
          termTotal: parseFloat(this.commissionPolicyData.term_value),
          amountClaimedFinalUI: parseFloat(this.commissionPolicyData.term_value)
        }

        let row2 = {
          createdDate: this.commissionPolicyData.triggerDate,
          term_name: "VAT",
          term_percent: '',
          projectId: this.commissionPolicyData.project_id,
          termTotal: ((5/100) * parseFloat(this.commissionPolicyData.term_value)).toFixed(2),
          amountClaimedFinalUI: ((5/100) * parseFloat(this.commissionPolicyData.term_value)).toFixed(2)
        }
        arrayData.push(row1,row2)
        this.viewProformaInvoiceData = arrayData;
        let amount = this.viewProformaInvoiceData.map(item => parseFloat(item.amountClaimedFinalUI)).reduce((prev, next) => prev + next);
        this.totalInvoiceAmt = (amount).toFixed(2);

        if(this.commissionData.projectId !== ''){
          this.projectService.FindByProjectID({id:this.commissionData.projectId}).subscribe((proData) => {
            this.projectDetails = proData;
          });
        }
      });
    })
  }

  deleteDraftProformaInvoiceCom(){
    Swal.fire({
      title: 'Delete the Proforma Invoice ?',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        this.spinner.show();
        let postData1 = { id: this.currentRowDataPerfomaInv.id }
        this.projectService.UpdateDraftProformaInv(postData1).subscribe((data: any) => {
          if(data.status === '200'){
            let postData2 = {
              id: this.currentRowDataPerfomaInv.profromaIds,
              amount: parseFloat(this.currentRowDataPerfomaInv.amount),
              amountClm: 0
            }
            this.projectService.UpdateAmountClaimed(postData2).subscribe((data2: any) => {
              if(data2.status === '200'){
                this.successToast(data.desc);
                this.closeDraftPerfoma();
              }
            });
          }else{
            this.failerToast();
            this.closeDraftPerfoma();
          }
        });
      }
    });
  }

  commConvertToInvoice(){
    this.mainTabListing = false;
    this.commDraftProformaInvoicediv = false;
    this.commInvoiceDraftDiv = true;
    let dateObj = new Date();
    let month = (dateObj.getMonth() + 1).toString().padStart(2,'0');
    this.addTaxInvoiceForm.patchValue({
      pnrNum: 'PRN/'+this.generateId(6).toUpperCase()+'/'+month+'/'+dateObj.getUTCFullYear(),
      invoiceDate: new Date(this.viewProformaInvoiceData[0].createdDate)
    });
  }

  backComToDraftPerfoma(){
    this.mainTabListing = false;
    this.commDraftProformaInvoicediv = true;
    this.commInvoiceDraftDiv = false;
    this.addTaxInvoiceForm.reset();
  }

  addToInvoiceCom(){
    let formValue = this.addTaxInvoiceForm.getRawValue();
    if(!this.addTaxInvoiceForm.valid){
      this.showInvoiceError = true
    }else{
      this.showInvoiceError = false;
      let amount = [];
      let vat = [];
      this.viewProformaInvoiceData.map((item) => {
        amount.push(parseFloat(item.amountClaimedFinalUI))
        if(item.term_name === 'VAT'){
          vat.push(parseFloat(item.amountClaimedFinalUI))
        }
      });

      let isRevenue = true;
      let sendData = {
        profromaIds: this.currentRowDataPerfomaInv.profromaIds,
        draftproformaId: this.currentRowDataPerfomaInv.id,
        org_id: this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
        systemId: formValue.pnrNum,
        accountRefId: formValue.invoiceNum,
        customerName: this.currentRowDataPerfomaInv.customerName,
        custPhone: this.venCustPhone,
        projectId: this.currentRowDataPerfomaInv.projectId,
        amount: amount.reduce((prev, next) => prev + next) - vat.reduce((prev, next) => prev + next),
        taxExcluded: vat.reduce((prev, next) => prev + next),
        projectName: this.currentRowDataPerfomaInv.projectName,
        paymentStatus: "pending",
        isCommission: true,
        isRevenue: isRevenue,
        comments: formValue.comments,
        dueDate: moment(formValue.invoiceDate).format('L'),
        createdDate: moment().format('L'),
        createdByEmpId: this.userInfo.id,
        createdBy: this.userInfo.full_name,
      }

      this.projectService.AddStageInvoice(sendData).subscribe((data: any) => {
        if(data.status === '200'){
          let postData = {
            invoiceId: data.desc,
            org_id: this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
            projectId: sendData.projectId,
            projectName: sendData.projectName,
            customerName: sendData.customerName,
            customerPhone: sendData.custPhone,
            amount: sendData.amount,
            isCommission: true,
            createdDate: moment().format('L'),
            description: sendData.comments
          }
          this.projectService.AddRevenuePayment(postData).subscribe((data:any) => {
            if(data.status === '200'){
              this.successToast('Invoice Added to revenue');
            }
          })

          this.projectService.UpdateDraftProformaStsInv({id: sendData.draftproformaId}).subscribe((draft: any) => {
            if(draft.status === '200'){
              this.successToast('Invoice Added');
            }
          });
        }else{
          this.failerToast();
        }
        this.closeDraftPerfoma();
        this.addTaxInvoiceForm.reset();
      });

    }
  }


  callSelfClaimRow(rowData){
    this.projectService.FindByProjectID({id:rowData.projectId}).subscribe((proData) => {
      this.projectDetails = proData;
      let finalData = [];
      let newObject = {
        draftId: rowData.id,
        selfClaim: rowData.isSelfClaimed,
        amountClaimed: parseFloat(rowData.amount),
        custPhone: this.projectDetails.entityCustomer.phone,
        customerName: this.projectDetails.cst_name,
        projectId: this.projectDetails.id,
        term_name: 'Self Claim',
        payment_event: rowData.profromaIds,
        projectName: this.projectDetails.project_name,
        projectTotal: parseFloat(this.projectDetails.projectAttribute.total_amount),
        advanceAmt: 0,
        retentionAmt: 0,
        amountClaimedFinalUI: parseFloat(rowData.amount),
        org_id: rowData.org_id,
        createdDate: rowData.createdDate,
      }
      finalData.push(newObject)

      let taxData = {
        org_id: rowData.org_id,
        createdDate: rowData.createdDate,
        projectId: rowData.projectId,
        selfClaim: rowData.isSelfClaimed,
        customerName: rowData.customerName,
        description: rowData.description,
        term_name: "VAT on Self Claim",
        projectName: rowData.projectName,
        custPhone: rowData.custPhone,
        draftId: rowData.id,
        payment_event: rowData.profromaIds,
        projectTotal: parseFloat(this.projectDetails.projectAttribute.total_amount),
        advanceAmt: 0,
        retentionAmt: 0,
        amountClaimedFinalUI: ((5/100) * parseFloat(rowData.amount)).toFixed(2),
      }
      finalData.push(taxData);

      this.viewProformaInvoiceData = finalData;
      let amount = this.viewProformaInvoiceData.map(item => parseFloat(item.amountClaimedFinalUI)).reduce((prev, next) => prev + next);
      this.totalInvoiceAmt = (amount).toFixed(2);
      this.mainTabListing = false;
      this.draftProformaInvoicediv = true;
      this.spinner.hide();
    });
  }

  viewDraftProformaInvoice(rowData){
    this.checkSelfClaim = rowData.isSelfClaimed;
    if(!rowData.isSelfClaimed){
      this.spinner.show();
      let profromaIds = rowData.profromaIds.split(",");
      let sendArray = [];
      profromaIds.map((elm) => {
        sendArray.push({id: elm})
      });

      let projectData = {
        orgID: rowData.org_id,
        id: rowData.projectId,
      }
      this.projectService.ValidateAdvanceInvoice(projectData).subscribe((advanceData: any) =>{
        this.proformaAdvanceData = advanceData;
      });

      let postData = { paymentPolicy: sendArray };
      let arrayData = [];
      this.projectService.GetProformaInvoiceByList(postData).subscribe((data: any) => {
        let finalData = data;
        this.projectService.FindByProjectID({id:finalData[0].projectId}).subscribe((proData) => {
          this.projectDetails = proData;
          finalData.map((elm2) => {
            elm2.projectName = rowData.projectName
            let postData2 = {
              id: elm2.projectId,
              empId: elm2.term_name
            }
            this.projectService.GetPaymentPolicytermName(postData2).subscribe((data2: any) => {
              data2.map((elm3) => {
                finalData.map((elmFin2) => {
                  if(elm3.term_name === elmFin2.term_name){
                    elmFin2.paymentEventpercent = elm3.paymentEventpercent;
                    elmFin2.term_percent = elm3.term_percent;
                    elmFin2.payment_event = elm3.payment_event;
                    elmFin2.stage_name = elm3.stage_name;
                    elmFin2.custPhone = this.projectDetails.phone;
                    elmFin2.projectId = this.projectDetails.id;
                    elmFin2.projectTotal = parseFloat(this.projectDetails.projectAttribute.total_amount);
                    elmFin2.advanceAmt = elm3.stage_name === "Advance" ? 0 : (parseFloat(elm3.term_percent)/100) * parseFloat(this.proformaAdvanceData.term_value);
                    elmFin2.retentionAmt = elm3.stage_name === "Advance" ? 0 : (elm3.retetionPercent === null ? 0 : parseFloat(elm3.retetionValue))
                    elmFin2.amountClaimedFinalUI = ((parseFloat(elmFin2.amountClaimed) - elmFin2.advanceAmt) - elmFin2.retentionAmt).toFixed(2);

                    let taxData = {
                      org_id: elmFin2.org_id,
                      createdDate: elmFin2.createdDate,
                      projectId: elmFin2.projectId,
                      customerName: elmFin2.customerName,
                      description: elmFin2.description,
                      term_name: "VAT",
                      projectName: elmFin2.projectName,
                      custPhone: elmFin2.custPhone,
                      draftId: elmFin2.draftId,
                      paymentEventpercent: elmFin2.paymentEventpercent,
                      term_percent: elmFin2.term_percent,
                      payment_event: elmFin2.payment_event,
                      stage_name: elmFin2.stage_name,
                      projectTotal: elmFin2.projectTotal,
                      advanceAmt: elmFin2.advanceAmt,
                      retentionAmt: elmFin2.retentionAmt,
                      amountClaimedFinalUI: ((5/100) * parseFloat(elmFin2.amountClaimedFinalUI)).toFixed(2),
                    }
                    arrayData.push(elmFin2,taxData)
                  }
                });
              });
              this.viewProformaInvoiceData = arrayData;
              let amount = this.viewProformaInvoiceData.map(item => parseFloat(item.amountClaimedFinalUI)).reduce((prev, next) => prev + next);
              this.totalInvoiceAmt = (amount).toFixed(2);
              this.spinner.hide();
              $('#viewProfInvoice_modal').modal('show');
            });
          });
        });
      });
    }else{
      this.projectService.FindByProjectID({id:rowData.projectId}).subscribe((proData) => {
        this.projectDetails = proData;
        let finalData = [];
        let newObject = {
          draftId: rowData.id,
          selfClaim: rowData.isSelfClaimed,
          amountClaimed: parseFloat(rowData.amount),
          custPhone: this.projectDetails.phone,
          customerName: this.projectDetails.cst_name,
          projectId: this.projectDetails.id,
          term_name: 'Self Claim',
          payment_event: rowData.profromaIds,
          projectName: this.projectDetails.project_name,
          projectTotal: parseFloat(this.projectDetails.projectAttribute.total_amount),
          advanceAmt: 0,
          retentionAmt: 0,
          amountClaimedFinalUI: parseFloat(rowData.amount),
          org_id: rowData.org_id,
          createdDate: rowData.createdDate,
        }
        finalData.push(newObject)

        let taxData = {
          org_id: rowData.org_id,
          createdDate: rowData.createdDate,
          projectId: rowData.projectId,
          selfClaim: rowData.isSelfClaimed,
          customerName: rowData.customerName,
          description: rowData.description,
          term_name: "VAT on Self Claim",
          projectName: rowData.projectName,
          custPhone: rowData.custPhone,
          draftId: rowData.id,
          payment_event: rowData.profromaIds,
          projectTotal: parseFloat(this.projectDetails.projectAttribute.total_amount),
          advanceAmt: 0,
          retentionAmt: 0,
          amountClaimedFinalUI: ((5/100) * parseFloat(rowData.amount)).toFixed(2),
        }
        finalData.push(taxData);

        this.viewProformaInvoiceData = finalData;
        let amount = this.viewProformaInvoiceData.map(item => parseFloat(item.amountClaimedFinalUI)).reduce((prev, next) => prev + next);
        this.totalInvoiceAmt = (amount).toFixed(2);
        this.mainTabListing = false;
        this.draftProformaInvoicediv = true;
        this.spinner.hide();
        $('#viewProfInvoice_modal').modal('show');
      });
    }
  }

  continueWithPerfoma(){
    let postData = {
      paymentPolicy: [
        {
          id: this.saveDraftID,
        }
      ]
    }

    this.projectService.GetDraftProformaInvoiceByList(postData).subscribe((data)=> {
      $('#continue_from_drafttoperfoma_modal').modal('hide');
      this.openDraftProformaInvoice(data[0])
    });
  }

  checkDiscount(e){
    if(e.checked){
      this.invoiceDiscountApplied = e.checked;
    }else{
      this.invoiceDiscountApplied = e.checked;
    }
  }

  closeViewProformaInvoiceModel(){
    $('#viewProfInvoice_modal').modal('hide');
  }

  viewPreDraftProformaInvoice(){
    $('#viewPreviewInvoice_modal').modal('show');
  }

  closePreviewProformaInvoiceModel(){
    this.checkSelfClaim = false;
    $('#viewPreviewInvoice_modal').modal('hide');
  }

  deleteDraftProformaInvoice(){
    Swal.fire({
      title: 'Delete the Proforma Invoice ?',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        this.spinner.show();
        let postData1 = { id: this.viewProformaInvoiceData[0].draftId }
        this.projectService.UpdateDraftProformaInv(postData1).subscribe((data: any) => {
          if(data.status === '200'){
            this.viewProformaInvoiceData.map((elm, index) => {
              let postData2 = {
                id: elm.id,
                amount: elm.amount !== '0' ? parseFloat(elm.amountClaimed) + parseFloat(elm.amount) : elm.amountClaimed,
                amountClm: 0
              }
              this.projectService.UpdateAmountClaimed(postData2).subscribe((data2: any) => {
                if(data2.status === '200'){
                  if(this.viewProformaInvoiceData.length === index + 1){
                    this.successToast(data.desc);
                    this.closeDraftPerfoma();
                  }
                }
              });
            });
          }else{
            this.failerToast();
            this.closeDraftPerfoma();
          }
        });
      }
    });
  }

  closeDraftPerfoma(){
    this.checkTabApiCall();
    this.mainTabListing = true;
    this.draftProformaInvoicediv = false;
    this.invoiceDraftDiv = false;
    this.checkSelfClaim = false;
    this.commInvoiceDraftDiv = false;
    this.commDraftProformaInvoicediv = false;
  }

  convertToInvoice(){
    this.mainTabListing = false;
    this.draftProformaInvoicediv = false;
    this.invoiceDraftDiv = true;
    let dateObj = new Date();
    let month = (dateObj.getMonth() + 1).toString().padStart(2,'0');
    this.invoiceMinDate = new Date(this.viewProformaInvoiceData[0].createdDate)
    this.addTaxInvoiceForm.patchValue({
      pnrNum: 'PRN/'+this.generateId(6).toUpperCase()+'/'+month+'/'+dateObj.getUTCFullYear(),
      invoiceDate: new Date(this.viewProformaInvoiceData[0].createdDate)
    });
  }

  viewCalculation(data){
    this.invoiceInDepthCal = data;
    $('#viewCalculation_modal').modal('show');
  }

  addToInvoice(){
    let formValue = this.addTaxInvoiceForm.getRawValue();
    if(!this.addTaxInvoiceForm.valid){
      this.showInvoiceError = true
    }else{
      this.showInvoiceError = false;
      if(!this.checkSelfClaim){
        let profromaIds = [];
        this.viewProformaInvoiceData.map((elm) => {
          if(elm.term_name !== 'VAT'){
            profromaIds.push((elm.id));
          }
        });

        let amount = [];
        let vat = [];
        let isRevenue;
        this.viewProformaInvoiceData.map((item) => {
          amount.push(parseFloat(item.amountClaimedFinalUI))
          if(item.term_name === 'VAT'){
            vat.push(parseFloat(item.amountClaimedFinalUI))
          }
          if(item.stage_name === 'Advance'){
            isRevenue = false
          }else{
            isRevenue = true
          }
        });

        let sendData = {
          profromaIds: profromaIds.toString(),
          draftproformaId: this.viewProformaInvoiceData[0].draftId,
          org_id: this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
          systemId: formValue.pnrNum,
          accountRefId: formValue.invoiceNum,
          customerName: this.viewProformaInvoiceData[0].customerName,
          custPhone: this.viewProformaInvoiceData[0].custPhone,
          projectId: this.viewProformaInvoiceData[0].projectId,
          amount: amount.reduce((prev, next) => prev + next) - vat.reduce((prev, next) => prev + next),
          taxExcluded: vat.reduce((prev, next) => prev + next),
          projectName: this.viewProformaInvoiceData[0].projectName,
          paymentStatus: "pending",
          isRevenue: isRevenue,
          comments: formValue.comments,
          dueDate: moment(formValue.invoiceDate).format('L'),
          createdDate: moment().format('L'),
          createdByEmpId: this.userInfo.id,
          createdBy: this.userInfo.full_name,
        }

        this.projectService.AddStageInvoice(sendData).subscribe((data: any) => {
          if(data.status === '200'){
            let userData = {
              orgID: this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
              id: sendData.projectId
            }

            if(this.invoiceDiscountApplied){
              this.callDiscountFunction(formValue, data)
            }else{
              this.invoiceDiscountApplied = false;
            }

            this.activityService.UpdateAdvancetoRevenue(userData).subscribe((data: any) => {
              this.successToast('Revenue Updated');
            });

            this.projectService.UpdateDraftProformaStsInv({id: sendData.draftproformaId}).subscribe((draft: any) => {
              if(draft.status === '200'){
                this.successToast('Invoice Added');
              }
            });
          }else{
            this.failerToast();
          }
          this.closeDraftPerfoma();
          this.addTaxInvoiceForm.reset();
        });
      }else{
        let profromaIds = [];
        this.viewProformaInvoiceData.map((elm) => {
          if(elm.term_name === 'Self Claim'){
            profromaIds.push((elm.payment_event));
          }
        });

        let amount = [];
        let vat = [];
        this.viewProformaInvoiceData.map((item) => {
          amount.push(parseFloat(item.amountClaimedFinalUI))
          if(item.term_name === 'VAT on Self Claim'){
            vat.push(parseFloat(item.amountClaimedFinalUI))
          }
        });

        let sendData = {
          profromaIds: this.viewProformaInvoiceData[0].payment_event,
          draftproformaId: this.viewProformaInvoiceData[0].draftId,
          org_id: this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
          systemId: formValue.pnrNum,
          accountRefId: formValue.invoiceNum,
          customerName: this.viewProformaInvoiceData[0].customerName,
          custPhone: this.viewProformaInvoiceData[0].custPhone,
          projectId: this.viewProformaInvoiceData[0].projectId,
          amount: amount.reduce((prev, next) => prev + next) - vat.reduce((prev, next) => prev + next),
          taxExcluded: vat.reduce((prev, next) => prev + next),
          projectName: this.viewProformaInvoiceData[0].projectName,
          paymentStatus: "pending",
          isRevenue: true,
          comments: formValue.comments,
          dueDate: moment(formValue.invoiceDate).format('L'),
          createdDate: moment().format('L'),
          createdByEmpId: this.userInfo.id,
          createdBy: this.userInfo.full_name,
        }
        this.projectService.AddStageInvoice(sendData).subscribe((data: any) => {
          if(data.status === '200'){
            this.projectService.UpdateDraftProformaStsInv({id: sendData.draftproformaId}).subscribe((draft: any) => {
              if(draft.status === '200'){
                this.successToast('Added to invoice');
                this.successToast(data.desc);
              }
            });
          }else{
            this.failerToast();
          }
          this.closeDraftPerfoma();
          this.addTaxInvoiceForm.reset();
        });
      }
    }
  }

  callDiscountFunction(formValue, data){
    let approverData = {
      "org_id": this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
      "discountAmount": parseFloat(((formValue.invoiceDiscountPer/100) * this.totalInvoiceAmt).toFixed(2)),
      "invoiceId": data.desc,
      "systmGenId": formValue.pnrNum,
      "projectId": this.viewProformaInvoiceData[0].projectId,
      "projectName": this.viewProformaInvoiceData[0].projectName,
      "customerName": this.viewProformaInvoiceData[0].customerName,
      "accountsId": this.currentRowDataPerfomaInv.accountsId,
      "accountsRefId": formValue.invoiceNum,
      "status": "pending",
      "approver1_roleId": this.discountApprover1Id,
      "approver2_roleId": this.discountApprover2Id,
      "is_approved1": false,
      "is_approved2": false,
      "created_date": moment().format('L'),
      "created_by_empId": this.userInfo.id
    }

    this.projectService.AddInvoiceDiscount(approverData).subscribe((data: any) => {
      if(data.status === '200'){
        this.invoiceDiscountApplied = false;
      }
    });
  }

  backToDraftPerfoma(){
    this.mainTabListing = false;
    this.draftProformaInvoicediv = true;
    this.invoiceDraftDiv = false;
    this.addTaxInvoiceForm.reset();
  }

  //self claim

  openSelfClaim(){
    this.spinner.show();
    this.GetAllProjectsByOrgId();
    this.mainTabListing = false;
    this.draftProformaInvoicediv = false;
    this.invoiceDraftDiv = false;
    this.selfClaimDiv = true;

    this.showContinuebtn = false;
    this.selfClaimFinalDiv = false;
    this.selfClaimData = '';
    this.systemGeneratedInvoiceData = '';
  }

  GetAllProjectsByOrgId(){
    this.projectService.GetAllProjectsByOrgId().subscribe((data) => {
      this.projectListing = data;
      this.spinner.hide();
    })
  }

  raiseSelfClaim(data){
    this.spinner.show();
    this.FindByProjectID(data.project_id);
    this.projectService.GetPendingProforma(data.project_id).subscribe((data:any) => {
      this.selfClaimData = data[0];
      this.systemGeneratedInvoiceData = data[1];
    });
    $('#selfClaim_modal').modal('show');
    this.spinner.hide();
  }

  closeselfClaimModel(){
    $('#selfClaim_modal').modal('hide');
  }

  projectSearch(): void {
    document.getElementById(this.selfClaimMainTableGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.selfClaimMainTableGrid.search((event.target as HTMLInputElement).value)
    });
  }

  rowSelected(){
    this.selectedSelfClaim = [];
    this.selectedSelfClaim = this.selfClaimGrid.getSelectedRecords();
    this.selectedSelfClaim.length !== 0 ? this.showContinuebtn = true : this.showContinuebtn = false;
  }

  selectedSelfClaimBtn(){
    $('#selfClaim_modal').modal('hide');
    this.selectedSelfClaimFinal = this.selectedSelfClaim;
    this.selectedSelfCalimTotal = this.selectedSelfClaimFinal.map(item => parseFloat(item.term_value)).reduce((prev, next) => prev + next);
    this.addSelfClaimForm.patchValue({
      amount: this.selectedSelfCalimTotal
    });
    this.selfClaimFinalDiv = true;
  }

  closeSelfClaim(){
    this.mainTabListing = true;
    this.draftProformaInvoicediv = false;
    this.invoiceDraftDiv = false;
    this.selfClaimDiv = false
  }

  FindByProjectID(projectID){
    this.projectService.FindByProjectID({id:projectID}).subscribe((proData) => {
      this.projectDetails = proData;
    });
  }

  saveSelfClaim(){
    let formdata = this.addSelfClaimForm.value;
    let profromaIds = [];
    this.selectedSelfClaimFinal.map((elm) => {
      profromaIds.push(elm.term_name)
    });
    let sendData = {
      "id": this.generateId(15),
      "org_id": this.projectDetails.org_id,
      "profromaIds": profromaIds.toString(),
      "projectId": this.selectedSelfClaimFinal[0].project_id,
      "customerName": this.projectDetails.cst_name,
      "custPhone": this.projectDetails.entityCustomer.phone,
      "description": formdata.comments,
      "amount": formdata.amount,
      "projectName": this.projectDetails.project_name,
      "status": "pending",
      "createdDate": moment().format('L'),
      "isConsolidated": false,
      "isSelfClaimed": true,
      "createdByEmpId": this.userInfo.id,
      "createdBy": this.userInfo.full_name,
      "invoicedDate": moment().format('L'),
    }
    this.projectService.AddSelfClaimProformaInvoice(sendData).subscribe((data: any) => {
      if(data.status === '200'){
        this.successToast('Self Claim added successfully');
      }else{
        this.failerToast();
      }
      this.selectedSelfClaim = [];
      this.showContinuebtn = false;
      this.selfClaimFinalDiv = false;
      this.selfClaimData = '';
      this.systemGeneratedInvoiceData = '';
      this.addSelfClaimForm.reset();
      this.closeSelfClaim();
    });
  }

  //project and extension statement fun

  showProjectStatement(projectId){
    this.checkForProjectExtension(projectId);
    this.getProjectData(projectId, 'main')
  }

  goToProject(id){
    localStorage.setItem('project_id',id);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/project-layout-new'])
    );
    window.open(url, "_blank");
  }

  checkForProjectExtension(id){
    this.projectService.GetExtensionsByProjectId({id}).subscribe((extdata: any) => {
      let extensionsByProject = [];
      if(extdata.length !== 0){
        extdata.map((extProj, eP) => {
          let projects = {
            project_prefix: extProj.project_prefix,
            project_name: extProj.project_name,
            id: extProj.id,
          }
          extensionsByProject.push(projects);
          if(extdata.length === eP+1){
            this.extensionsByProject = extensionsByProject
          }
        });
      }else{
        this.extensionsByProject = extensionsByProject;
      }
    });
  }

  getProjectData(projectID, type){
    this.spinner.show();
    let projectExtData:any = {}
    this.projectService.FindByProjectID({id: projectID}).subscribe((projectData: any) => {
      projectExtData.projectData = projectData;

      this.FetchPaymentPolicy(projectID).then((paymentPolicy)=>{
        projectExtData.paymentPolicy = paymentPolicy;
      });

      this.ViewTaskData(projectID).then((taskDetails)=>{
        projectExtData.taskDetails = taskDetails;
      });

      this.ProjectBdgtProgressbyId(projectID).then((progress) => {
        projectExtData.progress = progress;
      });

      let postData = {
        orgID: projectData.org_id,
        id: projectData.entityCustomer.phone,
        aId: projectData.entityContact[0].phone,
      }
      this.projectService.GetInvoicesByCustPhone(postData).subscribe((invData: any) => {
        this.projectService.GetProformaInvoiceByCstId({id: projectData.entityCustomer.id}).subscribe((toBeCData: any) => {
          if(toBeCData.length !== 0){
            toBeCData.map((elm, i) => {
              elm.isToBeClaimed = true;

              if(toBeCData.length === i+1){
                let combineArray = [...invData, ...toBeCData];
                this.finalStep(projectID, combineArray, projectExtData, type);
              }
            });
          }else{
            this.finalStep(projectID, invData, projectExtData, type);
          }
        });
      });
    });
  }

  finalStep(projectID, combineArray, projectExtData, type){
    this.processShowProjectStatement(projectID, combineArray).then((proStatement: any)=>{
      projectExtData.singleCustomerStatement = proStatement.statementDataArray;
      projectExtData.statementToBeClaimed = proStatement.toBeClaimed;
      projectExtData.custStatementAmountPlusVATTotal = proStatement.custStatementAmountPlusVATTotal;
      projectExtData.custStatementOnlyVATTotal = proStatement.custStatementOnlyVATTotal;
      projectExtData.custStatementTotal = proStatement.custStatementTotal;
    });
    if(type === 'main'){
      this.mainProjectData = projectExtData;
      if(this.totalToBeClaimedModelOpen){
        $('#total_to_be_claimed_modal').modal('hide');
      }
      if(this.totalPerfomaInvoiceModelOpen){
        $('#total_invoice_perfoma_modal').modal('hide');
      }
      if(this.totalOverDueModelOpen){
        $('#total_Over_due_modal').modal('hide');
      }
      $('#all_project_statement_modal').modal('show');
    }else{
      this.singleProjectData = projectExtData;
    }
    this.spinner.hide();
  }

  processShowProjectStatement(projectID, allInvoiceData){
    let projectStatementPromise = new Promise((myResolve, myReject) => {
      let statementDataArray = [];
      let balance = [];
      let amtPlusVat = [];
      let vatOnly = [];
      let toBeClaimed = [];
      allInvoiceData.map((elm, j) => {
        if(elm.projectId === projectID){
          if(!('isToBeClaimed' in elm)){
            let advAmount = parseFloat(elm.advAmount);
            let amountPlusTax = parseFloat(elm.advAmount) + (5/100 * parseFloat(elm.advAmount));
            let amountClaimed = elm.amountClaimed !== null ? parseFloat(elm.amountClaimed) : 0;
            let amountExtra = elm.amountExtra !== null ? parseFloat(elm.amountExtra) : 0;
            let taxExcluded = (5/100 * parseFloat(elm.advAmount));
            let amountBalance = elm.amountBalance !== null ? parseFloat(elm.amountBalance) : 0;

            elm.amount = advAmount;
            elm.amountPlusTax = amountPlusTax;
            elm.amountClaimed = amountClaimed;
            elm.amountExtra = amountExtra;
            elm.taxExcluded = taxExcluded;
            elm.amountBalance = amountClaimed !== 0 ? amountBalance : amountPlusTax - amountClaimed;

            amtPlusVat.push(elm.amountPlusTax);
            vatOnly.push(elm.taxExcluded);
            balance.push(elm.amountBalance);
            statementDataArray.push(elm);
          }else{
            toBeClaimed.push(elm)
          }
        }

        if(allInvoiceData.length === j+1){
          statementDataArray.sort((a, b) => a.comments.localeCompare(b.comments));
          let totalInv: any = {
            statementDataArray,
            toBeClaimed
          }
          totalInv.custStatementAmountPlusVATTotal = amtPlusVat.length !== 0 ? amtPlusVat.reduce((partialSum, a) => partialSum + a, 0) : 0;
          totalInv.custStatementOnlyVATTotal = vatOnly.length !== 0 ? vatOnly.reduce((partialSum, a) => partialSum + a, 0) : 0;
          totalInv.custStatementTotal = balance.length !== 0 ? balance.reduce((partialSum, a) => partialSum + a, 0) : 0;
          myResolve(totalInv);
        }
      });
    });
    return projectStatementPromise;
  }

  returnProjectTotal(gross, profit){
    return parseFloat(gross) + parseFloat(profit);
  }

  FetchPaymentPolicy(projectId){
    let paymentPolicyPromise = new Promise((myResolve, myReject) => {
      let projPaymentTerm:any = {};
      this.projectService.FetchPaymentPolicyById(projectId).subscribe((payPoilcyData: any) => {
        payPoilcyData.sort((a, b) => a.term_name.localeCompare(b.term_name))
        projPaymentTerm.paymentTermsData = payPoilcyData;
        let getPerTotal = [];
        let getValueTotal = [];
        payPoilcyData.map((elm) => {
          if(elm.perProjValue !== ''){
            getPerTotal.push(parseInt(elm.term_percent))
          }
          if(elm.term_value !== ''){
            getValueTotal.push(parseFloat(elm.term_value))
          }
        });
        const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
        const sumValue = getValueTotal.reduce((a, b) => a + (b || 0), 0);
        projPaymentTerm.totalProjPercent = sumProj+' %';
        projPaymentTerm.totalProjValue = sumValue;
        myResolve(projPaymentTerm)
      });
    });
    return paymentPolicyPromise;
  }

  ProjectBdgtProgressbyId(projectID){
    let projProPromise = new Promise((resolve, reject) => {
      let projectProgress;
      this.projectService.ProjectBdgtProgressbyId({id: projectID}).subscribe((data: any) => {
        if(data.length !== 0){
          let projectData = data[0];
          projectProgress = parseFloat(((projectData.hoursWorkedTillDate/parseFloat(projectData.Budgetedhours)) * 100).toFixed(2));
        }else{
          projectProgress = 0;
        }
        resolve(projectProgress);
      });
    });
    return projProPromise;
  }

  ViewTaskData(projectId){
    let allTaskMilestoneData = [];
    let taskPromise = new Promise((myResolve, myReject) => {
      let orgID = this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id')
      this.projectService.GetAllMilestoneByProjectID({id: projectId}).subscribe((data: any) => {
        let result = [];
        data.map((elm, ind) => {
          let postData = {
            id: projectId,
            milestoneName: elm.milestoneName,
            org_id: orgID,
            fromDate: "01/01/2020",
            toDate: moment().format('L')
          }

          this.financeService.GettaskDatabyMilestone(postData).subscribe((taskData: any) => {
            this.financeService.GetOpentaskDatabyMilestone(postData).subscribe((opTaskData: any) => {
              let pushData = {
                mileStoneName: elm.milestoneName,
                mileStoneDataComp: taskData.projectMilestoneDataWithDate,
                mileStoneDataOpen: opTaskData.projectMilestoneDataWithDate
              }
              result.push(pushData);
            });

            if(data.length === ind+1){
              allTaskMilestoneData = result;
              myResolve(allTaskMilestoneData)
            }
          });
        });
      });
    });
    return taskPromise;
  }

  //project and extension statement fun

  showCustomerStatement(projectId){
    this.spinner.show();
    this.projectService.FindByProjectID({id: projectId}).subscribe((projectData: any) => {
      this.singleCustomerData = {
        mainCustomer: projectData.entityCustomer,
        primaryContact: projectData.entityContact
      }

      let postData = {
        orgID: projectData.org_id,
        id: projectData.entityCustomer.phone,
        aId: projectData.entityContact[0].phone,
      }

      this.projectService.GetInvoicesByCustPhone(postData).subscribe((perfomaInvData: any) => {
        this.projectService.GetProformaInvoiceByCstId({id: projectData.entityCustomer.id}).subscribe((toBeClaimedData: any) => {
          if(toBeClaimedData.length !== 0){
            toBeClaimedData.map((elm, i) => {
              elm.isToBeClaimed = true;
              if(toBeClaimedData.length === i+1){
                let combineArray = [...perfomaInvData, ...toBeClaimedData];
                this.processShowCustomerStatement(combineArray)
              }
            });
          }else{
            this.processShowCustomerStatement(perfomaInvData)
          }
        });
      });
    });
  }

  processShowCustomerStatement(allInvoiceData){
    let grouped = _.groupBy(allInvoiceData, project => project.projectId);
    let groupedArray = Object.values(grouped);
    let multipleProject = [];
    groupedArray.map((elm: any, i) => {
      let statementDataArray = [];
      let balance = [];
      let amtPlusVat = [];
      let vatOnly = [];
      let toBeClaimed = [];
      elm.map((elm2, j) => {
        if(!('isToBeClaimed' in elm2)){
          let advAmount = parseFloat(elm2.advAmount);
          let amountPlusTax = parseFloat(elm2.advAmount) + (5/100 * parseFloat(elm2.advAmount));
          let amountClaimed = elm2.amountClaimed !== null ? parseFloat(elm2.amountClaimed) : 0;
          let amountExtra = elm2.amountExtra !== null ? parseFloat(elm2.amountExtra) : 0;
          let taxExcluded = (5/100 * parseFloat(elm2.advAmount));
          let amountBalance = elm2.amountBalance !== null ? parseFloat(elm2.amountBalance) : 0;

          elm2.amount = advAmount;
          elm2.amountPlusTax = amountPlusTax;
          elm2.amountClaimed = amountClaimed;
          elm2.amountExtra = amountExtra;
          elm2.taxExcluded = taxExcluded;
          elm2.amountBalance = amountClaimed !== 0 ? amountBalance : amountPlusTax - amountClaimed;
          amtPlusVat.push(elm2.amountPlusTax);
          vatOnly.push(elm2.taxExcluded);
          balance.push(elm2.amountBalance);
          statementDataArray.push(elm2);
          statementDataArray.sort((a, b) => a.comments.localeCompare(b.comments));
        }else{
         toBeClaimed.push(elm2)
        }

        if(elm.length === j+1){
          this.projectService.FindByProjectID({id:elm2.projectId}).subscribe((projectData) => {

            let projectObj:any = {}
            this.ViewTaskData(elm2.projectId).then((taskDetails)=>{
              projectObj.taskDetails = taskDetails;
            });

            this.FetchPaymentPolicy(elm2.projectId).then((paymentPolicy)=>{
              projectObj.paymentTermData = paymentPolicy;
            });

            this.ProjectBdgtProgressbyId(elm2.projectId).then((progress) => {
              projectObj.projectProgress = progress;
            });

            projectObj.projectName = elm2.projectName;
            projectObj.projectId = elm2.projectId;
            projectObj.projectData = projectData;
            projectObj.statementData = statementDataArray;
            projectObj.statementToBeClaimed = toBeClaimed;
            projectObj.custStatementAmountPlusVATTotal = amtPlusVat.length !== 0 ? amtPlusVat.reduce((partialSum, a) => partialSum + a, 0) : 0;
            projectObj.custStatementOnlyVATTotal = vatOnly.length !== 0 ? vatOnly.reduce((partialSum, a) => partialSum + a, 0) : 0;
            projectObj.custStatementTotal = balance.length !== 0 ? balance.reduce((partialSum, a) => partialSum + a, 0) : 0;
            multipleProject.push(projectObj);
          });
        }
      });

      if(groupedArray.length === i+1){
        this.allCustomerStatement = multipleProject;
        if(this.totalToBeClaimedModelOpen){
          $('#total_to_be_claimed_modal').modal('hide');
        }

        if(this.totalPerfomaInvoiceModelOpen){
          $('#total_invoice_perfoma_modal').modal('hide');
        }

        if(this.totalOverDueModelOpen){
          $('#total_Over_due_modal').modal('hide');
        }

        $('#all_customer_statement_modal').modal('show');
        this.spinner.hide();
      }
    });
  }

  closeCustomerStatement(){
    $('#all_customer_statement_modal').modal('hide');

    if(this.totalToBeClaimedModelOpen){
      $('#total_to_be_claimed_modal').modal('show');
    }

    if(this.totalPerfomaInvoiceModelOpen){
      $('#total_invoice_perfoma_modal').modal('show');
    }

    if(this.totalOverDueModelOpen){
      $('#total_Over_due_modal').modal('show');
    }
  }

  closeProjCustStatement(){
    $('#all_project_statement_modal').modal('hide');
    if(this.totalToBeClaimedModelOpen){
      $('#total_to_be_claimed_modal').modal('show');
    }

    if(this.totalPerfomaInvoiceModelOpen){
      $('#total_invoice_perfoma_modal').modal('show');
    }

    if(this.totalOverDueModelOpen){
      $('#total_Over_due_modal').modal('show');
    }
  }

  showProjRevenue(rowData){
    delete rowData["index"];
    delete rowData["column"];
    delete rowData["foreignKeyData"];
    this.spinner.show();
    this.projectService.GetRevenuePaymentByProject({id: rowData.projectId}).subscribe((data: any) => {
      let getRevenueArray = [];
      data.map((elm, indelm) => {
        getRevenueArray.push(parseFloat(elm.amount));
        if(data.length === indelm+1){
          this.projectRevenueTotal = getRevenueArray.reduce((partialSum, a) => partialSum + a, 0);
          this.singleProjectRevData = data;
          this.callProgressBar(rowData.projectId);
        };
      });
    });
  }

  callProgressBar(projectId){
    this.rangeDataView = 0;
    this.overDataView = 0;

    let postData = {
      id: projectId,
      fromDate: this.fromDate,
      toDate: this.toDate
    }
    this.projectService.FullModeGraphData(postData).subscribe((graphData: any) => {
      if(graphData[0].length !== 0){
        let rangeData = graphData[0][0];
        this.rangeDataView = parseFloat(((rangeData.TaskNameRange/parseFloat(rangeData.BudgetedhoursTotal)) * 100).toFixed(2));
        /* this.rangeDataView = Math.round(parseFloat(((rangeData.TaskNameRange/parseFloat(rangeData.BudgetedhoursTotal)) * 100).toFixed(2))); */
      }

      if(graphData[1].length !== 0){
        let overData = graphData[1][0];
        this.overDataView = parseFloat(((overData.TaskNameOvr/parseFloat(overData.BudgetedhoursTotal)) * 100).toFixed(2));
        /* this.overDataView = Math.round(parseFloat(((overData.TaskNameOvr/parseFloat(overData.BudgetedhoursTotal)) * 100).toFixed(2))); */
      }

      this.totalPercentage = parseFloat((this.rangeDataView + this.overDataView).toFixed(2));

      $('#single_project_rev_modal').modal('show');
      this.spinner.hide();
    });
  }

  hideShowProjRevenue(){
    $('#single_project_rev_modal').modal('hide');
  }

  totalToBeClaimed(){
    let startDate = '01/01/2020';
    let endDate = moment().format('L');
    this.projectService.GetProformaInvoiceByOrgId(startDate, endDate).subscribe((data: any) => {
      let toBeClaimed = [];
      let totaltoBeClaimed = [];
      data.map((elm) => {
        elm.proInvId = 'INV/'+elm.id.slice(0, 5);
        elm.total = parseFloat(elm.amount) + (elm.amountClaimed === null ? 0 : parseFloat(elm.amountClaimed));
        totaltoBeClaimed.push(elm.total)
        toBeClaimed.push(elm)
      });
      this.totalToBeClaimedData = data;
      this.totalToBeClaimedAmt = totaltoBeClaimed.reduce((partialSum, a) => partialSum + a, 0);
      this.spinner.hide();
    });
  }

  totalPerfomaInvoice(){
    let startDate = '01/01/2020';
    let endDate = moment().format('L');
    this.projectService.GetDraftProformaInvoiceByOrgId(startDate, endDate).subscribe((data: any) => {
      let leftPerfomaInv = [];
      let perfomaInv = [];
      data.map((elm, ind) => {
        if(elm.status !== 'reviewed'){
          leftPerfomaInv.push(elm)
          perfomaInv.push(parseFloat(elm.amount));
        }

        if(data.length === ind+1){
          this.totalPerfomaInvoiceData = leftPerfomaInv;
          this.totalPerfomaInvoiceAmt = perfomaInv.reduce((partialSum, a) => partialSum + a, 0);
          this.spinner.hide();
        }
      });
    });
  }

  totalOverDueInvoice(){
    let endDate = moment().format('L');
    this.projectService.GetOverDueInvoiceByOrgId(endDate).subscribe((data: any) => {
      let totalOverDueInv = [];
      let currentDate = moment(new Date());
      data.map((elm, ind) => {
        elm.taxExcluded = ((5/100) * parseFloat(elm.advAmount)).toFixed(2);
       // elm.taxExclud = elm.taxExcluded !== null ? elm.taxExcluded : ((5/100) * parseFloat(elm.advAmount)).toFixed(2);

        elm.diffDays = currentDate.diff(moment(elm.dueDate), 'days')



        if(elm.discountAmount !== null){
          elm.AmoutPlusVat = parseFloat((parseFloat((parseFloat(elm.advAmount) + parseFloat(elm.taxExcluded)).toFixed(2)) - parseFloat(elm.discountAmount)).toFixed(2))
        }else{
          elm.AmoutPlusVat = parseFloat((parseFloat(elm.advAmount) + parseFloat(elm.taxExcluded)).toFixed(2));
        }
        totalOverDueInv.push(elm.AmoutPlusVat);

        if(data.length === ind+1){
          this.totalOverDueInvoiceData = data;
          this.totalOverDueInvoiceAmt = totalOverDueInv.reduce((partialSum, a) => partialSum + a, 0);
          this.spinner.hide();
        }
      });
    });
  }

  onClickViewTotal(Value){
    this.spinner.show();
    if(Value === 'toBeCalim'){
      this.totalToBeClaimedModelOpen = true;
      this.totalToBeClaimed();
      $('#total_to_be_claimed_modal').modal('show');
    }else if(Value === 'perfomaInv'){
      this.totalPerfomaInvoiceModelOpen = true
      this.totalPerfomaInvoice();
      $('#total_invoice_perfoma_modal').modal('show');
    }else{
      this.totalOverDueModelOpen = true;
      this.totalOverDueInvoice();
      $('#total_Over_due_modal').modal('show');
    }
  }

  closeAllToBeClaim(){
    this.totalToBeClaimedModelOpen = false;
    $('#total_to_be_claimed_modal').modal('hide');
  }

  closeAllPerfomaInv(){
    this.totalPerfomaInvoiceModelOpen = false;
    $('#total_invoice_perfoma_modal').modal('hide');
  }

  closeAllOverInv(){
    this.totalOverDueModelOpen = false;
    $('#total_Over_due_modal').modal('hide');
  }

  //notification request
  checkNotificationRequest(){
    let getNotValue = JSON.parse(localStorage.getItem('notData'));
    if(getNotValue !== null){
      this.getViewNotification(getNotValue)
      localStorage.removeItem('notData');
      localStorage.removeItem('message');
    }
  }

  getViewNotification(notData){
    this.mainTabListing = false;
    this.discountRequestTab = true;
    this.openDiscountView();
    this.notificationMessageData = notData;
    this.projectService.GetAddInoviceDiscountById({id: this.notificationMessageData.reference_id}).subscribe((data:any) => {
      data[0].discountAmount = parseFloat(data[0].discountAmount);
      data[0].message = 'Discount request for '+data[0].projectName;
      this.discountDetails = data[0];
      this.projectService.GetStageInvoiceById({id: data[0].invoiceId}).subscribe((data2:any) => {
        data2[0].advAmount = parseFloat(data2[0].advAmount);
        data2[0].advTaxAmount = parseFloat(((5/100) * parseFloat(data2[0].advAmount)).toFixed(2));
        data2[0].totalAmtPlusVat = data2[0].advAmount + data2[0].advTaxAmount;
        data2[0].afterDeduction = (data2[0].totalAmtPlusVat - data[0].discountAmount).toFixed(2);
        this.stageInvoiceDetails = data2[0];
        $('#notification_model').modal('show');
      });
    })
  }

  actionToDisTable(data, text){
    this.notificationMessageData = data;
    this.projectService.GetAddInoviceDiscountById({id: this.notificationMessageData.id}).subscribe((data:any) => {
      data[0].discountAmount = parseFloat(data[0].discountAmount);
      data[0].message = 'Discount request for '+data[0].projectName;
      this.discountDetails = data[0];
      this.projectService.GetStageInvoiceById({id: data[0].invoiceId}).subscribe((data2:any) => {
        data2[0].advAmount = parseFloat(data2[0].advAmount);
        data2[0].advTaxAmount = parseFloat(((5/100) * parseFloat(data2[0].advAmount)).toFixed(2));
        data2[0].totalAmtPlusVat = data2[0].advAmount + data2[0].advTaxAmount;
        data2[0].afterDeduction = (data2[0].totalAmtPlusVat - data[0].discountAmount).toFixed(2);
        this.stageInvoiceDetails = data2[0];
        this.acctionToDis(text);
      });
    })
  }


 public onInvoiceRel(e) {
  if(e.srcElement.checked){
      this.invoiceRelated = true;
      this.revenueData = this.revenueData.filter((el) => el.invoiceId != null);
  } else {
    this.invoiceRelated = false;
    this.GetRevenuePaymentOrgId();

  }
 }

 public onNonInvoiceRel(e) {
  if(e.srcElement.checked){
      this.noninvoiceRelated = true;
      this.revenueData = this.revenueData.filter((el) => el.invoiceId === null);
  } else {
    this.GetRevenuePaymentOrgId();
    this.noninvoiceRelated = false;
  }
 }

  acctionToDis(text){
    let sendData = {
      "id": this.notificationMessageData.reference_id ? this.notificationMessageData.reference_id : this.notificationMessageData.id,
      "org_id": this.discountDetails.org_id,
      "discountAmount": this.discountDetails.discountAmount,
      "invoiceId": this.discountDetails.invoiceId,
      "systmGenId": this.discountDetails.systmGenId,
      "projectId": this.discountDetails.projectId,
      "projectName": this.discountDetails.projectName,
      "customerName": this.discountDetails.customerName,
      "accountsId": this.discountDetails.accountsId,
      "accountsRefId": this.discountDetails.accountsRefId,
      "approver1_roleId": this.discountDetails.approver1_roleId,
      "approver2_roleId": this.discountDetails.approver2_roleId,
      /* "created_date": "string",
      "created_by_empId": "string", */
      "modified_date": "string",
      "modified_by_empId": "string"
    }

    if(text === 'approve'){
      if(this.discountDetails.firstRoleName === 'Account Owner' || this.discountDetails.secondRoleName === 'Account Owner'){
        //Super Approver
        sendData['status'] = "approved";
        sendData['is_approved2'] = true;
        sendData['created_date'] = moment().format('L');
        sendData['created_by_empId'] = this.userInfo.id;
      }else{
        //Single Approver
        if(this.discountDetails.approver1_roleId !== null && this.discountDetails.approver2_roleId === null){
          sendData['status'] = "approved";
          sendData['is_approved1'] = true;
          sendData['created_date'] = moment().format('L');
          sendData['created_by_empId'] = this.userInfo.id;
        }
        //Dual Approver
        if(this.discountDetails.approver1_roleId !== null && this.discountDetails.approver2_roleId !== null){
          if(this.discountDetails.is_approved1){
            sendData['status'] = "approved";
            sendData['is_approved1'] = true;
            sendData['is_approved2'] = true;
          }else{
            sendData['status'] = "pending";
            sendData['is_approved1'] = true;
            sendData['is_approved2'] = false;
            sendData['created_date'] = moment().format('L');
            sendData['created_by_empId'] = this.userInfo.id;
          }
        }
      }
    }else{
      if(this.discountDetails.firstRoleName === 'Account Owner' || this.discountDetails.secondRoleName === 'Account Owner'){
        //Super Approver
        sendData['status'] = "decline";
        sendData['is_approved2'] = false;
        sendData['created_date'] = moment().format('L');
        sendData['created_by_empId'] = this.userInfo.id;
      }else{
        //Single Approver
        if(this.discountDetails.approver1_roleId !== null && this.discountDetails.approver2_roleId === null){
          sendData['status'] = "decline";
          sendData['is_approved1'] = false;
          sendData['created_date'] = moment().format('L');
          sendData['created_by_empId'] = this.userInfo.id;
        }
        //Dual Approver
        if(this.discountDetails.approver1_roleId !== null && this.discountDetails.approver2_roleId !== null){
          if(this.discountDetails.is_approved1){
            sendData['status'] = "decline";
            sendData['is_approved1'] = true;
            sendData['is_approved2'] = false;
          }else{
            sendData['status'] = "decline";
            sendData['is_approved1'] = false;
            sendData['is_approved2'] = false;
            sendData['created_date'] = moment().format('L');
            sendData['created_by_empId'] = this.userInfo.id;
          }
        }
      }
    }

    this.projectService.UpdateInvoiceDicountByID(sendData).subscribe((data:any) => {
      if(data.status === '200'){
        this.successToast('Updated Successfully');
        if(this.notificationMessageData.reference_id){
          this.callNotificationRead();
        }
      }else{
        this.failerToast();
      }
      this.hidenotDisc();
      this.openDiscountView();
    });
  }

  callNotificationRead(){
    let notRead={
      "id": this.notificationMessageData.id,
      "org_id": this.notificationMessageData.org_id,
      "from_id": this.notificationMessageData.from_id,
      "to_id": this.notificationMessageData.to_id,
      "reference_id": this.notificationMessageData.reference_id,
      "read_status": true,
      "created_date": this.notificationMessageData.created_date,
      "created_by_empId": this.notificationMessageData.created_by_empId,
      "created_by_name": this.notificationMessageData.created_by_name,
      "modified_by_empId": this.notificationMessageData.modified_by_empId,
      "message": this.notificationMessageData.message
    }

    this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(notRead).subscribe((data:any) => {
      if(data.status === '200'){
        this.successToast('Notification Read successfully');
      }
    })
  }

  hidenotDisc(){
    $('#notification_model').modal('hide');
  }

  openDiscountView(){
    this.spinner.show();
    this.mainTabListing = false;
    this.discountRequestTab = true;
    let sendObj = {
      orgID: this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id'),
      empID: this.userInfo.role_id
    }
    this.projectService.GetAddInoviceDiscountbyApproverId(sendObj).subscribe((data:any) => {
      data.map((elm) => {
        elm.totalAmount = parseFloat(elm.totalAmount);
        elm.discountAmount = parseFloat(elm.discountAmount);
        elm.totalMinusDiscount = (elm.totalAmount - elm.discountAmount).toFixed(2);
        elm.showButton = elm.approver1_roleId === this.userInfo.role_id ? (elm.is_approved1 ? false : true) : (elm.is_approved2 ? false : true)
      });
      this.discountReqAppData = data;
      this.spinner.hide();
    });
  }

  closeDiscountReq(){
    this.mainTabListing = true;
    this.discountRequestTab = false;
  }

  toBeClaimedDownload(args: ClickEventArgs){
    switch (args.item.text) {
      case 'PDF Export':
          this.toBeClaimedTableGrid.pdfExport();
          break;
      case 'Excel Export':
          this.toBeClaimedTableGrid.excelExport();
          break;
      case 'CSV Export':
          this.toBeClaimedTableGrid.csvExport();
      break;
    }
  }

  totalToBeClaimedDownload(args: ClickEventArgs){
    switch (args.item.text) {
      case 'PDF Export':
          this.totalToBeClaimedTableGrid.pdfExport();
          break;
      case 'Excel Export':
          this.totalToBeClaimedTableGrid.excelExport();
          break;
      case 'CSV Export':
          this.totalToBeClaimedTableGrid.csvExport();
      break;
    }
  }

  totalperfomaInvoiceDownload(args: ClickEventArgs){
    switch (args.item.text) {
      case 'PDF Export':
          this.totalperfomaInvoiceTableGrid.pdfExport();
          break;
      case 'Excel Export':
          this.totalperfomaInvoiceTableGrid.excelExport();
          break;
      case 'CSV Export':
          this.totalperfomaInvoiceTableGrid.csvExport();
      break;
    }
  }

  proformaInvoiceDownload(args: ClickEventArgs){
    switch (args.item.text) {
      case 'PDF Export':
          this.proformaInvoiceTableGrid.pdfExport();
          break;
      case 'Excel Export':
          this.proformaInvoiceTableGrid.excelExport();
          break;
      case 'CSV Export':
          this.proformaInvoiceTableGrid.csvExport();
      break;
    }
  }

  invoiceDownload(args: ClickEventArgs){
    switch (args.item.text) {
      case 'PDF Export':
          this.invoiceTableGrid.pdfExport();
          break;
      case 'Excel Export':
          this.invoiceTableGrid.excelExport();
          break;
      case 'CSV Export':
          this.invoiceTableGrid.csvExport();
      break;
    }
  }

  revenueDataDownload(args: ClickEventArgs){
    switch (args.item.text) {
      case 'PDF Export':
          this.revenueDataTableGrid.pdfExport();
          break;
      case 'Excel Export':
          this.revenueDataTableGrid.excelExport();
          break;
      case 'CSV Export':
          this.revenueDataTableGrid.csvExport();
      break;
    }
  }

  addPaymentTypeFormInputs(){
    this.addPaymentTypeForm = new FormGroup({
      fullPayment: new FormControl({value: '', disabled: true})
    })
  }

  addaddTaxInvoiceFormInputs(){
    this.addTaxInvoiceForm = new FormGroup({
      pnrNum: new FormControl({value: '', disabled: true}),
      invoiceNum: new FormControl('', [Validators.required]),
      invoiceDate: new FormControl('', [Validators.required]),
      invoiceDiscountPer: new FormControl(''),
      comments: new FormControl(''),
    });
  }

  addPartPaymentTypeFormInputs(){
    this.addPartPaymentTypeForm = new FormGroup({
      partPayPer: new FormControl('', [Validators.required]),
      partPayPerAmt: new FormControl({value: '', disabled: true}),
      partPayAmt: new FormControl('')
    });
  }

  addSelfClaimFormInputs(){
    this.addSelfClaimForm = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      comments: new FormControl('', [Validators.required])
    });
  }

  generateId(length){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ){
      result += characters.charAt(Math.floor(Math.random() * charactersLength ));
    }
    return result;
  }

  //Success message
  successToast(desc){
    this.toastr.success(desc);
  }

  //failure message
  failerToast(){
    let desc = 'Something went wrong';
    this.toastr.error(desc);
  }

}
