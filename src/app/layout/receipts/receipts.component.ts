import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from "lodash";
import { UserService } from '../../services/user.service';
import { CostService } from '../../services/cost.service';
import moment = require('moment');
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectService } from '../../services/project.service';
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit {

  //userRights
  user_info = JSON.parse(localStorage.getItem('user_info'));
  commonModuleName;
  accessToReceipts = false;
  public invoiceToolbar : ToolbarItems[];
  @ViewChild('totalInvoicesGrid' , {static: false}) public totalInvoicesGrid: GridComponent;
  @ViewChild('proformaInvoiceTableGrid',{static:false}) public proformaInvoiceTableGrid: GridComponent;
  @ViewChild('receiptsTableGrid',{static:false}) public receiptsTableGrid: GridComponent;
  @ViewChild('customerStatTableGrid',{static:false}) public customerStatTableGrid: GridComponent;

  mainTabListing = true;
  fromDate = moment().startOf('year').format('L');
  toDate = moment().format('L');
  dateTextToDisplay = moment().startOf('year').format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
  isAllActive = true;
  isMonthActive = false;
  isWeekActive = false;
  isTodayActive= false;
  dateRangeForm: FormGroup;
  getHeaderValue = 'Outstanding Invoice';
  stageInvoiceData;
  receiptsData;
  headerText= [
    { text: 'Outstanding Invoice' },
    { text: 'Receipts' },
    { text: 'Customer Statement' }
  ];

  selectedInvoice = [];
  totalInvoices;
  receiptsCard = false;
  singleCustomerStatementDiv = false;
  singleCustomerStatement;
  patchReceiptValueForm: FormGroup;
  paymentMethodData = [
    {
      id:'Bank Transfer',
      value:'Bank Transfer'
    },
    {
      id:'Cash',
      value:'Cash'
    },
    {
      id:'Cash Deposit',
      value:'Cash Deposit'
    },
    {
      id:'Cheque',
      value:'Cheque'
    },
    {
      id:'MasterCard',
      value:'MasterCard'
    },
    {
      id:'Visa',
      value:'Visa'
    }
  ];

  bankTransfer = false;
  commonFields: Object = { text: "value", value: "id" };
  showReceiptTotal = 0;
  showPaymentTotal = 0;
  customerAccounts;
  showContinuebtn = false;
  showChequeDiv = false;
  handOverCash = false;
  projectDetails;
  maxDate: Date = new Date(new Date().setDate(new Date().getDate()+1));
  customerListing;
  customerData;
  projectData;
  allCustomerStatement;
  custStatementAmountPlusVATTotal = 0;
  custStatementOnlyVATTotal = 0;
  custStatementTotal = 0;
  noPaymentTypeError = false;
  confirmCollectionError = false;
  chequeError = false;
  paymentTermsData;
  totalProjValue;
  expandedRowId: number | null = null;
  totalProjPercent;
  previousStageInc;
  custStatementClaimedTotal: any;

  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private projectService : ProjectService,
    private toastr:ToastrService,
    private formBuilder: FormBuilder,
    private costService:CostService
  ) { }

  ngOnInit(){
    this.spinner.show();
    this.checkUserRights();
    this.patchReceiptValueFormInputs();
    this.invoiceToolbar = ['Search', 'PdfExport', 'ExcelExport'];
    this.checkTabApiCall();
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
      this.isAllActive = false;
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.dateTextToDisplay = moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');
    });

    this.patchReceiptValueForm.controls['paymentMethod'].valueChanges.subscribe((selectedValue) => {
      selectedValue === 'Cheque' ? this.showChequeDiv = true : this.showChequeDiv = false;
      selectedValue === 'Bank Transfer' ? this.bankTransfer = true : this.bankTransfer = false;
    });

  }


  checkUserRights(){
    let postData = { id : this.user_info.role_id }
    this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
      data.map((item) => {
        item.module_name = item.module_name.replace(/\s+/g, '');;
        return item;
      });
      this.commonModuleName = _.groupBy(data, 'module_name');
      //settings
      if(this.commonModuleName.Invoice){
        this.commonModuleName.Invoice.map((elm) => {
          if(elm.section_name === 'View Receipts' && elm.is_allow){
            this.accessToReceipts = true;
          }
        });
      }else{
        this.accessToReceipts = false;
      }
    });

  }

  
  async onDetailDataBound(args: any) {
    console.log("Detail row data:", args);
  
    const invoiceIdField = args.data.invoiceIds;
    const invoiceIds = invoiceIdField
      ? invoiceIdField.split(',').map(id => id.trim()).filter(id => !!id)
      : [];
  
    console.log("Parsed Invoice IDs:", invoiceIds);
  
    this.projectService.GetInvoicesByProjectID(args.data.projectId).subscribe(
      (data: any[]) => {
        console.log("Invoices from API:", data);
  
        const matchedInvoices = data
          .filter(invoice => invoiceIds.includes(String(invoice.id)))
          .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
          .map(invoice => {
            const hasExtra = invoice.amountExtra && Object.keys(invoice.amountExtra).length > 0;
            return {
              ...invoice,
              extraAmount: {
                hasExtra,
                data: hasExtra ? invoice.amountExtra : null
              }
            };
          });
  
        console.log("Sorted & Mapped Invoices:", matchedInvoices);
  
        args.data.matchedInvoices = matchedInvoices;
      },
      (error) => {
        console.error("Error fetching invoices:", error);
        args.data.matchedInvoices = [];
      }
    );
  }
  


  
  
  
  
  getCommonDateType(value){
    this.spinner.show();
    if(value === 'today'){
      this.fromDate = moment().format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().format('ddd, D MMM YYYY');
      this.isAllActive = false;
      this.isTodayActive = true;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.checkTabApiCall();
    }else if(value === 'weeks'){
      this.fromDate = moment().subtract(7, "days").format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(7, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isAllActive = false;
      this.isTodayActive = false;
      this.isWeekActive = true;
      this.isMonthActive = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.checkTabApiCall();
    }else if(value === 'All'){
      this.fromDate = moment().startOf('year').format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().startOf('year').format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isAllActive = true;
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.checkTabApiCall();
    }else{
      this.fromDate = moment().subtract(31, "days").format('L');
      this.toDate = moment().format('L');
      this.dateTextToDisplay = moment().subtract(30, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
      this.isAllActive = false;
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = true;
      this.dateRangeForm.patchValue({
        daterange: [this.fromDate, this.toDate]
      });
      this.checkTabApiCall();
    }
  }

  tabSelected(event){
    this.getHeaderValue = event.selectedItem.textContent;
    this.checkTabApiCall();
  }

  checkTabApiCall(){
    this.spinner.show();
    if(this.getHeaderValue === 'Outstanding Invoice'){
      this.GetStageInvoiceByOrgId();
    }else if(this.getHeaderValue === 'Receipts'){
      this.GetReceivePByOrgId();
    }else if(this.getHeaderValue === 'Customer Statement'){
      this.GetAllProjectsByOrgId();
    }
  }

  GetStageInvoiceByOrgId(){
    this.projectService.GetStageInvoiceByOrgId(this.fromDate, this.toDate).subscribe((data: any) => {
      data.map((elm) => {
        elm.taxExcluded = parseFloat(((5/100) * parseFloat(elm.advAmount)).toFixed(2));
        elm.AmoutPlusVat = parseFloat((parseFloat(elm.advAmount) + parseFloat(elm.taxExcluded)).toFixed(2));
        elm.discountAmount = elm.discountAmount === null ? 0 : parseFloat(elm.discountAmount);
        elm.amountClaimed = elm.amountClaimed === null ? 0 : parseFloat(elm.amountClaimed);
        elm.amountBalance = elm.AmoutPlusVat > elm.amountClaimed ? parseFloat((elm.AmoutPlusVat - elm.amountClaimed).toFixed(2)) : 0;
        let finalAmount = elm.discountAmount !== 0 ? (elm.AmoutPlusVat - elm.discountAmount) - elm.amountClaimed : elm.AmoutPlusVat - elm.amountClaimed;
        elm.finalAmount = parseFloat((finalAmount).toFixed(2));
      });
      this.stageInvoiceData = data;
      this.spinner.hide();
    });
  }

  GetReceivePByOrgId(){
    this.projectService.GetReceivePByOrgId(this.fromDate, this.toDate).subscribe((data: any) => {
      this.receiptsData = data;
      this.spinner.hide();
    });
  }

  GetAllProjectsByOrgId(){
    this.projectService.GetAllProjectsByOrgId().subscribe((data) => {
      console.log(data)
      let grouped = _.groupBy(data, cust => cust.cst_id);
      let convertedObj = Object.values(grouped);
      let newArray = [];
      convertedObj.map((elm: any) => {
        let projectNo = [];
        let projectID = []
        elm.map((elm2) => {
          if(elm2.projectId !== null){
            projectNo.push(elm2.project_prefix)
            projectID.push(elm2.project_id)
            let newObj = {
              cst_name: elm2.first_name+elm2.last_name,
              phone: elm2.phone,
              projectNo : projectNo,
              projectID : projectID
            }
            newArray.push(newObj);
          }
        });
      });
      let uniqueCustomer = _.uniqBy(newArray, "cst_name")
      this.customerListing = uniqueCustomer;
      this.spinner.hide();
    });
  }

  showCustStatList(rowData){
    delete rowData["index"];
    delete rowData["column"];
    delete rowData["foreignKeyData"];
    this.customerData = rowData;
    console.log(rowData)
    this.projectService.FindByProjectID({id: rowData.projectID[0]}).subscribe((projectData: any) => {
      let postData = {
        orgID: projectData.org_id,
        id: projectData.entityCustomer.phone,
        aId: projectData.entityContact[0].phone,
      }
      this.projectService.GetInvoicesByCustPhone(postData).subscribe((data: any) => {
      //group by project id
        let grouped = _.groupBy(data, project => project.projectId);
        //convert to array
        let convertedObj = Object.values(grouped);
        let newArray = [];
        convertedObj.map((elm: any) => {
          let invComments = [];
          elm.map((elm2) => {
            if(elm2.projectId !== null){
              invComments.push(elm2.comments)
              let newObj = {
                projectName: elm2.projectName,
                projectId: elm2.projectId,
                comments : invComments,
                statementData: elm
              }
              newArray.push(newObj);
            }
          });
        });
        let uniqueCustomerStatement = _.uniqBy(newArray, "projectId")
        this.allCustomerStatement = uniqueCustomerStatement;
        console.log(this.allCustomerStatement)
      });
      $('#all_customer_statement_modal').modal('show');
    });
  }

  closeCustomerStatementModel(){
    $('#all_customer_statement_modal').modal('hide');
  }

  viewSingleCustStatement(rowData){
    rowData.map((elm) => {
      let amountPlusVat = parseFloat(parseFloat(elm.advAmount).toFixed(2)) + parseFloat(((5/100) * parseFloat(elm.advAmount)).toFixed(2));
      let amountClaimed = elm.amountClaimed === null ? 0 : parseFloat(parseFloat(elm.amountClaimed).toFixed(2));
      let amountExtra = elm.amountExtra === null ? 0 : parseFloat(parseFloat(elm.amountExtra).toFixed(2));
      elm.amountPlusVat = amountPlusVat;
      elm.onlyVat = parseFloat(((5/100) * parseFloat(elm.advAmount)).toFixed(2))
      elm.amountClaimed = amountClaimed;
      elm.amountExtra = amountExtra;
      elm.amountBalance = elm.amountPlusVat > elm.amountClaimed ? parseFloat((elm.amountPlusVat - elm.amountClaimed).toFixed(2)) : 0
      elm.comments = elm.comments.trim() === 'Inv' ? 'Self Claim '+elm.comments : elm.comments;
    });
    rowData.sort((a, b) => a.comments.localeCompare(b.comments));
    this.singleCustomerStatement = rowData;
    let balance = [];
    let amtPlusVat = [];
    let vatOnly = [];
    this.singleCustomerStatement.map((elm) => {
      amtPlusVat.push(elm.amountPlusVat)
      vatOnly.push(elm.onlyVat)
      if(elm.amountBalance !== 0){
        balance.push(elm.amountBalance)
      }
    });
    this.custStatementAmountPlusVATTotal = amtPlusVat.length !== 0 ? amtPlusVat.reduce((partialSum, a) => partialSum + a, 0) : 0;
    this.custStatementOnlyVATTotal = vatOnly.length !== 0 ? vatOnly.reduce((partialSum, a) => partialSum + a, 0) : 0;
    this.custStatementTotal = balance.length !== 0 ? balance.reduce((partialSum, a) => partialSum + a, 0) : 0;
    this.custStatementClaimedTotal = this.singleCustomerStatement.reduce((sum, e) => sum + e.amountClaimed, 0);

    console.log('Total Amount Plus VAT:', this.custStatementAmountPlusVATTotal);
    console.log('Total VAT Only:', this.custStatementOnlyVATTotal);
    console.log('Total Balance:', this.custStatementTotal);
    console.log('Total Amount Claimed:', this.custStatementClaimedTotal);



    this.projectService.FindByProjectID({id:rowData[0].projectId}).subscribe((proData) => {
      this.projectData = proData;
      this.FetchPaymentPolicy(rowData[0].projectId, rowData[0].org_id)
    });

    this.mainTabListing = false;
    this.singleCustomerStatementDiv = true;
    $('#all_customer_statement_modal').modal('hide');
  }

  FetchPaymentPolicy(projectId, orgID){
    let postData = {
      "orgID": orgID,
      "id": projectId,
      "empID": this.user_info.id,
    }
    this.costService.FetchPaymentPolicy(postData).subscribe((data: any) => {
      data.sort((a, b) => a.term_name.localeCompare(b.term_name))
      this.paymentTermsData = data;
      let getPerTotal = [];
      let getValueTotal = [];
      this.paymentTermsData.map((elm) => {
        if(elm.perProjValue !== ''){
          getPerTotal.push(parseInt(elm.term_percent))
        }

        if(elm.term_value !== ''){
          getValueTotal.push(parseFloat(elm.term_value))
        }
      });

      const sumProj = getPerTotal.reduce((a, b) => a + (b || 0), 0);
      const sumValue = getValueTotal.reduce((a, b) => a + (b || 0), 0);
      this.totalProjPercent = sumProj+' %';
      this.totalProjValue = sumValue;
    });
  }

  //invoice club
  openInvoiceClubModel(singleInvoice){
    console.log('openInvoiceClubModel',singleInvoice );
    delete singleInvoice["index"];
    delete singleInvoice["column"];
    delete singleInvoice["foreignKeyData"];
    if(singleInvoice.isCommission){
      this.receiptsCard = true;
      this.mainTabListing = false;
      this.selectedInvoice.push(singleInvoice);
      this.patchValueForForm();
    }else{
      let multipleInvoice = [];
      this.stageInvoiceData.map((elm, stgIn) => {
        if(elm.projectId === singleInvoice.projectId && elm.id !== singleInvoice.id && elm.finalAmount !== 0 && !elm.isCommission){
          multipleInvoice.push(elm)
        }

        if(this.stageInvoiceData.length === stgIn+1){
          if(multipleInvoice.length === 0){
            this.receiptsCard = true;
            this.mainTabListing = false;
            this.selectedInvoice.push(singleInvoice);
            this.patchValueForForm();
            this.getProjectDetails(singleInvoice.projectId);
          }else{
            $('#consolidationView_Invoice_modal').modal('show');
            this.receiptsCard = false;
            this.totalInvoices = [...[singleInvoice], ...multipleInvoice];
            this.getProjectDetails(this.totalInvoices[0].projectId);
          }
        }
      });
    }
  }

  rowSelected(){
    this.selectedInvoice = [];
    this.selectedInvoice = this.totalInvoicesGrid.getSelectedRecords();
    this.selectedInvoice.length !== 0 ? this.showContinuebtn = true : this.showContinuebtn = false;
  }

  checkHandedOverBy(value){
    if(value === 'no'){
      this.handOverCash = true;
    }else{
      this.handOverCash = false;
      this.patchReceiptValueForm.controls['handedOverBy'].setValue('');
    }
  }

  chequeType(value){
    if(value === 'CDC'){
      this.patchReceiptValueForm.controls['chequeDate'].disable();
      this.patchReceiptValueForm.patchValue({
        chequeDate: new Date(),
        chequeType: 'CDC'
      });
    }else{
      this.patchReceiptValueForm.controls['chequeDate'].enable();
      this.patchReceiptValueForm.patchValue({
        chequeDate: new Date(new Date().setDate(new Date().getDate()+1)),
        chequeType: 'PDC'
      });
    }
  }

  selectInvoice(){
    this.receiptsCard = true;
    this.mainTabListing = false;
    $('#consolidationView_Invoice_modal').modal('hide');
    this.patchValueForForm();
  }

  backToMainListing(type){
    if(type === 'receipt'){
      this.getHeaderValue === 'Outstanding Invoice'
      this.selectedInvoice = [];
      this.receiptsCard = false;
      this.mainTabListing = true;
      this.handOverCash = false;
      this.showContinuebtn = false;
      this.bankTransfer = false;
      this.resetError();
      this.checkTabApiCall();
      this.patchReceiptValueForm.reset();
      (this.patchReceiptValueForm.get('arrSelectedInvoice') as FormArray).clear();
      this.spinner.hide();
    }else if(type === 'custStat'){
      this.mainTabListing = true;
      this.singleCustomerStatementDiv = false;
      $('#all_customer_statement_modal').modal('show');
    }
  }

  resetError(){
    this.noPaymentTypeError = false;
    this.confirmCollectionError = false;
    this.chequeError = false;
  }

  patchValueForForm(){
    this.showReceiptTotal = parseFloat((this.selectedInvoice.map(item => item.finalAmount).reduce((prev, next) => prev + next)).toFixed(2));
    let previousStageInc = []
    this.selectedInvoice.map((elm, inLe) => {
      this.projectService.GetStageInvoiceById({id: elm.id}).subscribe((data: any) => {
        previousStageInc.push(data[0])
      });

      if(this.selectedInvoice.length === inLe+1){
        this.previousStageInc = previousStageInc
      }
    })
    this.patchReceiptValueForm.patchValue({
      customerName: this.selectedInvoice[0].customerName,
      date: new Date(),
      chequeDate: new Date(new Date().setDate(new Date().getDate()+1)),
      chequeType: 'PDC',
      confirmCollection: false,
      Amount: this.showReceiptTotal
    });

    this.GetCustomerBalance(this.selectedInvoice[0].custPhone);
    let formData = this.patchReceiptValueForm.get('arrSelectedInvoice') as FormArray;
    this.selectedInvoice.map((elm) => {
      formData.push(this.formBuilder.group({
        createdDate: elm.createdDate,
			  accountRefId: elm.accountRefId,
        projectName: elm.projectName,
        customerName: elm.customerName,
        custPhone: elm.custPhone,
        comments: elm.comments,
        AmoutPlusVat: elm.finalAmount,
        paymentAmt: elm.finalAmount,
        projectId: elm.projectId,
        invoiceID: elm.id,
        dueAmt: elm.finalAmount
      }));
    });
  }

  getProjectDetails(projectId){
    this.projectService.FindByProjectID({id:projectId}).subscribe((proData) => {
      this.projectDetails = proData;
    })
  }

  GetCustomerBalance(phone){
    this.projectService.GetCustomerBalance(phone).subscribe((data) => {
      this.customerAccounts = data[0];
    });
  }

  returePending(item: any, i){
    let getValue = item.value;
    let formData = this.patchReceiptValueForm.get('arrSelectedInvoice') as FormArray;
    let dueValue = parseFloat((getValue.AmoutPlusVat - getValue.paymentAmt).toFixed(2))
    formData.at(i).patchValue({
      dueAmt: dueValue
    });
    this.showPaymentTotal = formData.value.map(item => item.paymentAmt).reduce((prev, next) => prev + next);
    this.patchReceiptValueForm.patchValue({
      Amount: this.showPaymentTotal
    });
    if(dueValue > 0){
      return dueValue
    }else{
      return Math.abs(dueValue)
    }
  }

  convertToReceipt(){
    this.spinner.show();
    this.resetError();
    let formValue = this.patchReceiptValueForm.getRawValue();
    if(formValue.paymentMethod === ''){
      this.noPaymentTypeError = true;
      this.spinner.hide();
			return;
		}else if(formValue.paymentMethod === 'Bank Transfer'){
      if(formValue.confirmCollection){
        this.continueWithConvertToReceipt();
      }else{
        this.confirmCollectionError = true;
        this.spinner.hide();
			  return;
      }
    }else if(formValue.paymentMethod === 'Cheque'){
      if(formValue.memo !== ''){
        this.continueWithConvertToReceipt();
      }else{
        this.chequeError = true;
        this.spinner.hide();
			  return;
      }
    }else{
      this.continueWithConvertToReceipt();
    }
  }

  continueWithConvertToReceipt(){
    let formValue = this.patchReceiptValueForm.getRawValue();
    let invoiceID = [];
    this.selectedInvoice.map((elm) => {
      invoiceID.push(elm.id)
    });
    //success
    let sendData = {
      org_id: this.user_info.org_id !== null ? this.user_info.org_id : localStorage.getItem('org_id'),
      projectId: this.selectedInvoice[0].projectId,
      customerName: formValue.customerName,
      custPhone: this.selectedInvoice[0].custPhone,
      amount: formValue.Amount,
      invoiceIds: invoiceID.toString(),
      projectName: this.selectedInvoice[0].projectName,
      paymentMethod: formValue.paymentMethod,
      description: formValue.memo,
      status: "pending",
      refrenceId: formValue.referenceID,
      confirmCollection: formValue.paymentMethod === 'Bank Transfer' ? formValue.confirmCollection : false,
      paidTo: this.handOverCash ? formValue.handedOverBy : null,
      chequeNumber: null,
      chequeType: null,
      chequeDate: null,
      createdDate: moment().format('L'),
      createdByEmpId: this.user_info.id,
      createdBy: this.user_info.full_name
    }

    if(formValue.paymentMethod === "Cheque"){
      sendData.chequeNumber = formValue.memo;
      sendData.chequeType = formValue.chequeType;
      sendData.chequeDate = moment(formValue.chequeDate).format('L');
    }else{
      sendData.chequeType = '';
      sendData.chequeDate = '';
    }

    let invoiceCredit = [];
    if(!this.selectedInvoice[0].isCommission){
      formValue.arrSelectedInvoice.map((elm) => {
        if(elm.dueAmt < 0){
          invoiceCredit.push({
            id: elm.invoiceID,
            dueAmt: Math.abs(elm.dueAmt)
          })
        }
      });
    }

    this.projectService.AddReceivePayment(sendData).subscribe((data: any) => {
      if(data.status === '200'){
        this.previousStageInc.map((prevInc) => {
          formValue.arrSelectedInvoice.map((formData, index) => {
            if(prevInc.id === formData.invoiceID){
              let prevClaim = prevInc.amountClaimed === null ? 0 : parseFloat(prevInc.amountClaimed)
              let sendObjAmtClim = {
                id: formData.invoiceID,
                amount: parseFloat((formData.paymentAmt + prevClaim).toFixed(2))
              }

              this.projectService.UpdateAmtClimInvoice(sendObjAmtClim).subscribe((data: any) => {
                this.GetStageInvoiceByOrgId();
              });

              let currentBalance = formData.AmoutPlusVat - parseFloat(formData.paymentAmt)
              if(currentBalance !== 0 && (Math.sign(currentBalance) === 1)){
                let sendObjAmtBal = {
                  id: formData.invoiceID,
                  amount: currentBalance,
                  amountBal: currentBalance
                }

                this.projectService.UpdateAmtBalInvoice(sendObjAmtBal).subscribe((data: any) => { });
              }
            }

            if(formValue.arrSelectedInvoice.length === index + 1){
              this.GetStageInvoiceByOrgId();
              if(invoiceCredit.length !== 0){
                invoiceCredit.map((credit, num) =>{
                  let sendCustomerCredit = {
                    org_id: this.user_info.org_id !== null ? this.user_info.org_id : localStorage.getItem('org_id'),
                    projectId: this.selectedInvoice[0].projectId,
                    accountsId: this.selectedInvoice[0].accountRefId,
                    projectName: this.selectedInvoice[0].projectName,
                    customerId: this.projectDetails.entityCustomer.id,
                    customerName: formValue.customerName,
                    custPhone: this.selectedInvoice[0].custPhone,
                    customerBal: credit.dueAmt.toString(),
                    invoiceIds: credit.id,
                    description: "Balance for project "+this.selectedInvoice[0].projectName,
                    createdDate: moment().format('L'),
                    createdByEmpId: this.user_info.id,
                    createdBy: this.user_info.full_name
                  }
                  this.projectService.AddCustomerCredit(sendCustomerCredit).subscribe((data: any) => {
                    if(data.status === '200'){
                      if(invoiceCredit.length === num + 1){
                        this.successToast(data.desc);
                      }
                    }else{
                      this.toastr.error('Customer credit not Updated');
                    }
                    if(invoiceCredit.length === num + 1){
                      this.backToMainListing('receipt');
                    }
                  });
                });
              }else{
                this.successToast(data.desc);
                this.backToMainListing('receipt');
              }
            }
          });
        });
      }else{
        this.failerToast();
        this.GetStageInvoiceByOrgId();
        this.backToMainListing('receipt');
      }
    });
  }

  closeInvoiceClubModel(){
    $('#consolidationView_Invoice_modal').modal('hide');
    this.checkTabApiCall();
    this.showContinuebtn = false;
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

  receiptsDownload(args: ClickEventArgs){
    switch (args.item.text) {
      case 'PDF Export':
          this.receiptsTableGrid.pdfExport();
          break;
      case 'Excel Export':
          this.receiptsTableGrid.excelExport();
          break;
      case 'CSV Export':
          this.receiptsTableGrid.csvExport();
      break;
    }
  }

  customerStatDownload(args: ClickEventArgs){
    switch (args.item.text) {
      case 'PDF Export':
          this.customerStatTableGrid.pdfExport();
          break;
      case 'Excel Export':
          this.customerStatTableGrid.excelExport();
          break;
      case 'CSV Export':
          this.customerStatTableGrid.csvExport();
      break;
    }
  }

  searchKeyStroke(): void {
    document.getElementById(this.customerStatTableGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.customerStatTableGrid.search((event.target as HTMLInputElement).value)
    });
  }

  patchReceiptValueFormInputs(){
    this.patchReceiptValueForm = new FormGroup({
      customerName: new FormControl({value: '', disabled: true}),
      Amount: new FormControl({value: '', disabled: true}),
      paymentMethod: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      memo: new FormControl(''),
      handedOverBy: new FormControl(''),
      confirmCollection: new FormControl(''),
      chequeType: new FormControl(''),
      chequeDate: new FormControl(''),
      referenceID: new FormControl(''),
      arrSelectedInvoice: this.formBuilder.array([])
    });
  }

  get arrSelectedInvoice(): FormArray {
		return this.patchReceiptValueForm.get('arrSelectedInvoice') as FormArray;
	}

  createSelectedInvoiceArray(){
    return this.formBuilder.group({
      createdDate: [{value: '', disabled: true}],
			accountRefId: [{value: '', disabled: true}],
      projectName: [{value: '', disabled: true}],
      customerName: [{value: '', disabled: true}],
      custPhone: [{value: '', disabled: true}],
      comments: [{value: '', disabled: true}],
      AmoutPlusVat: [{value: '', disabled: true}],
      paymentAmt: [{value: '', disabled: true}],
      dueAmt: [{value: '', disabled: true}],
      projectId: [''],
      invoiceID: ['']
		});
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

  //function to add quickbooks id to project
  UpdateAccIdInPrjct(){
    let projectData = [
      {
        "id": null,
        "accountsId": null
      },
    ]
    projectData.map((elm) => {
      this.projectService.UpdateAccIdInPrjct(elm).subscribe((data) =>{
        console.log(data)
      })
    });
  }

  //function to add payment term to project, send Acc ref id
  AddPaymentPolicyByName(){
    let projectData = [
      {
        "projectId": 583
      }
    ]
    projectData.map((elm) => {
      this.projectService.AddPaymentPolicyByName(elm).subscribe((data) =>{
        console.log(data)
      })
    });
  }

  //add project to be claimed, send project id
  AddClaimInvoicesByOrgIdAndProject(){
    let projectData = [
      {
        "id": null
      }
    ]
    projectData.map((elm, index) => {
      this.projectService.AddClaimInvoicesByOrgIdAndProject(elm).subscribe((data) =>{
        console.log(data, index)
      })
    });
  }

}
