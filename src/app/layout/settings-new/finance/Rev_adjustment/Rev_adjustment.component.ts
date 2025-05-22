import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ToolbarItems, EditSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ProjectService } from '../../../../services/project.service';
import { FinanceService } from '../../../../services/finance.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import moment = require('moment');
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { log } from 'console';
import { K } from '@angular/cdk/keycodes';
import Swal from "sweetalert2";


declare var $: any;

@Component({
  selector: 'app-Rev_adjustment',
  templateUrl: './Rev_adjustment.component.html',
  styleUrls: ['./Rev_adjustment.component.scss',
]
})
export class Rev_adjustment implements OnInit {

  public invoiceToolbar : ToolbarItems[];
  editSettings: EditSettingsModel;
  @ViewChild('openBalanceTableGrid',{static:false}) public openBalanceTableGrid: GridComponent;
  openBalanceData: Object[];
  showBackBtn = true;
  user_info = JSON.parse(localStorage.getItem('user_info'));
  fromDate = moment().subtract(7, "days").format('L');
  toDate = moment().format('L');
  dateTextToDisplay = moment().subtract(7, "days").format('ddd, D MMM YYYY')+' - '+moment().format('ddd, D MMM YYYY');
  isSixMonthActive = false;
  isYearActive = false;
  isMonthActive = false;
  isWeekActive = true;
  UpperClass=true;
  isTodayActive= false;
  projectRevData=[];
  showAdd=false;
  orgValue=[];
  extensionsByProject;
  mainProjectData;
  singleProjectData;
   //Invoice Validation Varaibles
 invCompleted = false
 upcomingStage:any = null;
  dateRangeForm: FormGroup;
  revenueform: FormGroup;
  maxRangeDate: Date = new Date(new Date().toDateString());
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
  headerText = [
    { text: "Revenue"},
    // { text: "Open Balance"},
    { text: "History"}

  ];
  revenueData=[];
  projectdetails: [
    {
      accountId :"accountID"
    }
  ];
  projectDataDetails:any;
  totalAmount: any;
  balanceAmount:any;
  totalbalance=0;
  datapack: boolean;
  rembal= true;
  totalsum=true;





  constructor(
    private spinner: NgxSpinnerService,
    private projectService : ProjectService,
    private financeService: FinanceService,
    private toastr: ToastrService,
    public Router :Router,
  ) { }

  ngOnInit() {
    // $('#all_project_statement_modal').modal('hide');

    this.invoiceToolbar = ['Search'];
    this.editSettings = { allowEditing: true, mode: 'Batch' };
    this.spinner.show();
    // this.GetOpenbalProjects();
    this.GetRevenuePaymentOrgId();
    this.callCardApi();
    this.dateRangeForm = new FormGroup({
      daterange: new FormControl(''),
    });

    this.revenueform = new FormGroup({
      description: new FormControl(''),
      amount: new FormControl(''),
      createddate: new FormControl(''),      
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
      this.isTodayActive = false;
      this.isWeekActive = false;
      this.isMonthActive = false;
      this.dateTextToDisplay = moment(startTime[0]).format('ddd, D MMM YYYY')+' - '+moment(startTime[1]).format('ddd, D MMM YYYY');
      this.GetRevenuePaymentOrgId();
    });
  }

  // GetOpenbalProjects(){
  //   this.projectService.GetOpenbalProjects().subscribe((data: any) => {
  //     data.map((elm) => {
  //       elm.revenueAmt = parseInt(elm.revenueAmt);
  //       elm.totalAmount = parseInt(elm.totalAmount);
  //       elm.balance = elm.totalAmount - elm.revenueAmt;
  //       elm.adjustRev = 0
  //       elm.adjustBal = 0
  //     });
  //     this.openBalanceData = data;
  //     this.spinner.hide();
  //     console.log("open Bal data",this.openBalanceData);
  //   });
  // }
callCardApi(){
     this.projectService.GetAdvacneRevInv(this.fromDate, this.toDate).subscribe((data3:any) => {
    data3.map((elm) => {
      let Revenue = {
        toBeClaimCount: elm.totalAdvRevCount,
        toBeClaimValue: elm.totalAdvRevAmount,
      }
      this.cardDataToDisplay.Revenue = Revenue;
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
      this.GetRevenuePaymentOrgId();
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
      this.GetRevenuePaymentOrgId();
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
      this.GetRevenuePaymentOrgId();
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
      this.GetRevenuePaymentOrgId();
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
      this.GetRevenuePaymentOrgId();

    }
  }
  goBack(){
    this.Router.navigate(['settings-new/finance'])
  }

  searchKeyStroke(): void {
    document.getElementById(this.openBalanceTableGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.openBalanceTableGrid.search((event.target as HTMLInputElement).value)
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

  GetRevenuePaymentOrgId(){
    this.callCardApi();
    this.projectService.GetRevenuePaymentOrgId(this.fromDate, this.toDate).subscribe((data: any) => {
      this.revenueData = data;
      this.spinner.hide();
      console.log("Data is here",this.revenueData)
    });
    // this.projectService.GetOpenbalProjects().subscribe((data: any) => {
    //   data.map((elm) => {
    //     elm.revenueAmt = parseInt(elm.revenueAmt);
    //     elm.totalAmount = parseInt(elm.totalAmount);
    //     elm.balance = elm.totalAmount - elm.revenueAmt;
    //     elm.adjustRev = 0
    //     elm.adjustBal = 0
    //   });
    //   this.revenueData = data;
    //   console.log(this.revenueData);
      
    //   this.spinner.hide();
    // });
  }


  editDetails(data)
  {
    console.log(data)
    let postDta={
      id:data.projectId
    }
    this.projectService.GetRevenuePaymentByProject(postDta).subscribe((data: any) => {
      console.log(data);
      this.projectRevData = data;
      
      this.projectDataDetails = [data[0]]; 

      let totalAmount = 0;


      this.projectRevData.forEach(invoice => {
        totalAmount += parseFloat(invoice.amount);
    });
    this.totalAmount=totalAmount
    console.log("Total Amount:", totalAmount);
      
      console.log("project Data", this.projectDataDetails);
    });


      

    this.rembal=true;

          $("#revenueeditmodal").modal('show');

  }


  deleteRevenue(item) {
    console.log(item, "delete");
    console.log("projectRev",this.projectRevData);
    
    Swal.fire({
      title: "Sure you want to delete this revenue?",
      text: "Please Note this action cannot be reverted",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => { 
      if (result.value === true) {
        const index = this.projectRevData.findIndex(fe => fe.id === item.id);
        if (index !== -1) {
          this.projectRevData.splice(index, 1);
          console.log(this.projectRevData);
          const amount =  parseFloat(item.amount)
          console.log(amount);
          this.totalbalance += amount;
          this.rembal=false;
        }
        else {
          const index2 = this.projectRevData.findIndex(fe => fe.balance === item.balance);

        }
        } 
    });
  }
  

  updateAmount(item: any,e) {
    // Get the input value

    this.totalsum=false;

    // if(item.balance!=0)
    // {
    //   this.totalbalance = this.totalbalance - item.balance
    //   item.balance=0
    // }

    if(item.balance!=undefined){
      if(this.totalbalance<item.balance)
      {
        this.totalbalance = this.totalbalance + item.balance
        item.balance=undefined
      }
      else if(this.totalbalance>item.balance)
      {
      this.totalbalance = this.totalbalance - item.balance
      item.balance=undefined
      }
    }
    

    const inputValueElement = event.target as HTMLInputElement;
    
    const inputValue = parseFloat(inputValueElement.value);
    ;

    
    if(item.amount!=0){

      item.balance =item.amount - inputValue;
    if(this.totalbalance<=0){ 
      this.totalbalance = this.totalbalance - item.balance;
      }
      else{
        this.totalbalance = this.totalbalance + item.balance;
      }
    }
    else{
      // item.balance=0
      item.balance = inputValue -  item.amount ;
      if(this.totalbalance<=0){
      this.totalbalance = this.totalbalance + item.balance;
      }
      else{
        this.totalbalance = this.totalbalance - item.balance;
      }
    }
    // console.log(this.totalbalance); 
    // console.log(item.balance,"item.balance");  
    if(this.totalbalance!=0)
    {
    this.rembal=false;
    }
    else{
      this.rembal=true;
    }
     console.log(this.projectRevData);
     
  }

  lastrev(date){
    this.projectRevData.filter((de)=>de.createdDate =null)
  }

  adddate(){
    var dateInput = <HTMLInputElement>document.getElementById('dateInput');
    
    // Get the selected date value
    var selectedDate = dateInput.value;
    
    // Log the selected date to the console or use it in further JavaScript logic
    console.log(selectedDate);
    this.lastrev(selectedDate);

  }

  addreve() {
    // Create a new entry with default values

    const newEntry = {
      createdDate: null, // Will be set by the user later
      amount: 0,
      balance: 0
    };
    // Add the new entry to the projectRevData array
    this.projectRevData.push(newEntry);
  }
  


  onSubmit() {
    console.log("Form Date",this.revenueform.value);

    this.orgValue.push(
      { 
        description: this.projectRevData[0].description ,
        amount: this.projectRevData[0].amount,
        createddate: this.projectRevData[0].createdDate
      });
   console.log(this.orgValue);
     if(this.projectRevData[0]!=null){
          let datas= {
            invoiceId: this.projectRevData[0].invoiceId ,
            org_id:this.user_info.org_id, 
            isCommission: this.projectRevData[0].isCommission, 
            projectId: this.projectRevData[0].projectId,
            projectName: this.projectRevData[0].projectName,
            customerName: this.projectRevData[0].customerName, 
            description: this.projectRevData[0].description,
            customerPhone: this.projectRevData[0].customerPhone, 
            amount: this.projectRevData[0].amount, 
            createdDate: this.projectRevData[0].createdDate,
            modifiedDate:moment().format('L'),
            revenue_id:this.projectRevData[0].id
          }

          console.log("Superhuman",datas)

          this.projectService.AddHistoryRevenuePayment(datas).subscribe((data: any) => {
            if(data.status==200)
            {
              console.log("Am done with this shit");
              let postData={
                id:this.projectRevData[0].id,
                description:this.revenueform.value.description?this.revenueform.value.description:this.projectRevData[0].description,
                amount:this.revenueform.value.amount?this.revenueform.value.amount:this.projectRevData[0].amount,
                createdDate:this.revenueform.value.createddate?this.revenueform.value.createddate:this.projectRevData[0].createdDate,
            
              }
              console.log("Am heerere anda;j",postData);
              this.projectService.UpdateRevenueAdjustment(postData).subscribe((data:any) =>
              {
              if(data.status==200)
              {
                
                console.log("Revenue Added");
                this.successToast('Revenue Updated successfully');

                this.closemodal()
                this.GetRevenuePaymentOrgId()
                
                
              }
            }
              )
            }
          });

  

   
  }          

  }
  closemodal()
  {
    $("#revenueeditmodal").modal('hide');  

  }

  tabSelected(e)
  {
  
  }




//New Custom Modal

showProjectStatement(projectId){
  // let projectId=  localStorage.getItem('project_id');
  this.checkForProjectExtension(projectId);
  console.log(projectId);
  
  this.getProjectData(projectId, 'main')
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
  console.log(projectID);
  
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

ViewTaskData(projectId){
  let allTaskMilestoneData = [];
  let taskPromise = new Promise((myResolve, myReject) => {
    let orgID = this.user_info.org_id !== null ? this.user_info.org_id : localStorage.getItem('org_id')
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
     this.checkInvCompleted();
    // if(this.totalToBeClaimedModelOpen){
    //   $('#total_to_be_claimed_modal').modal('hide');
    // }
    // if(this.totalPerfomaInvoiceModelOpen){
    //   $('#total_invoice_perfoma_modal').modal('hide');
    // }
    // if(this.totalOverDueModelOpen){
    //   $('#total_Over_due_modal').modal('hide');
    // }
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

checkInvCompleted() {
  let reObj = {
    "id": localStorage.getItem('project_id'),
   }
  this.projectService.ValidateInvoicesRaised(reObj).subscribe((res:any)=>{
    //console.log("res--->",res);
    if(res.desc =="All Invoices Raised.") {
      this.invCompleted =true;
    } else {
      this.invCompleted = false;
      this.checkUpcomingStage();
    }
  })
}

checkUpcomingStage() {

  let reObj = {
    "id": localStorage.getItem('project_id'),
   }
  this.projectService.ValidatePaymentTerm(reObj).subscribe((res:any)=>{
     
     console.log("prj",this.mainProjectData.paymentPolicy)

     if(this.mainProjectData.paymentPolicy.paymentTermsData.length === 1 && res.desc == "All terms present") {
        this.upcomingStage = "1st Payment";
     }

     else if(this.mainProjectData.paymentPolicy.paymentTermsData.length > 1 && res.desc != "All terms present") {
      this.upcomingStage = res.desc;
     }
   
  })


}
}
