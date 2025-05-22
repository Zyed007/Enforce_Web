import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ToolbarItems, EditSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ProjectService } from '../../../services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import moment = require('moment');
declare var $: any;

@Component({
  selector: 'app-open-balance',
  templateUrl: './open-balance.component.html',
  styleUrls: ['./open-balance.component.scss']
})
export class OpenBalanceComponent implements OnInit {

  public invoiceToolbar : ToolbarItems[];
  editSettings: EditSettingsModel;
  @ViewChild('openBalanceTableGrid',{static:false}) public openBalanceTableGrid: GridComponent;
  openBalanceData: Object[];
  showBackBtn = true;
  user_info = JSON.parse(localStorage.getItem('user_info'));

  constructor(
    private spinner: NgxSpinnerService,
    private projectService : ProjectService,
    private toastr: ToastrService,
    public Router :Router,
  ) { }

  ngOnInit() {
    this.invoiceToolbar = ['Search'];
    this.editSettings = { allowEditing: true, mode: 'Batch' };
    this.spinner.show();
    this.GetOpenbalProjects();
  }

  GetOpenbalProjects(){
    this.projectService.GetOpenbalProjects().subscribe((data: any) => {
      data.map((elm) => {
        elm.revenueAmt = parseInt(elm.revenueAmt);
        elm.totalAmount = parseInt(elm.totalAmount);
        elm.balance = elm.totalAmount - elm.revenueAmt;
        elm.adjustRev = 0
        elm.adjustBal = 0
      });
      this.openBalanceData = data;
      this.spinner.hide();
    });
  }

  submitData(){
    let newArray = [];
    this.openBalanceData.map((elm: any) => {
      if(elm.adjustRev !== 0 || elm.adjustBal !== 0){
        let newObject = {
          projectId: elm.project_id,
          org_id: this.user_info.org_id !== null ? this.user_info.org_id : localStorage.getItem('org_id'),
          projectName: elm.project_name,
          previousRevenue: elm.revenueAmt,
          previousBalance: elm.balance,
          currentRevenue: elm.adjustRev,
          currentBalance: elm.adjustBal,
          fullMode: elm.fullMode,
          createdDate: moment().format('L'),
          createdBy: this.user_info.id,
          createdbyEmpId: this.user_info.full_name
        }
        newArray.push(newObject);
      }
    });

    if(newArray.length !== 0){
      let postData = {
        projectOpenBalance: newArray
      }
      this.projectService.AddProjectOpenBalance(postData).subscribe((data: any) => {
        if(data.status === '200'){
          this.successToast('Open Balance Added');
        }else{
          this.failerToast();
        }
        this.openBalanceTableGrid.refresh();
        this.GetOpenbalProjects();
        this.showBackBtn = true;
      });
    }

  }

  cellSave(args){
    this.openBalanceData.map((elm: any) => {
      if(elm.project_id === args.rowData.project_id){
        args.columnName === 'adjustRev' ? elm.adjustRev = args.value :  elm.adjustBal = args.value;
      }
    });
    this.showBackBtn = false;
  }

  btnfun(){
    if(this.showBackBtn){
      this.Router.navigate(['settings-new']);
    }else{
      this.openBalanceTableGrid.refresh();
      this.GetOpenbalProjects();
      this.showBackBtn = true;
    }
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

}
