import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup , FormBuilder, Validators} from "@angular/forms";
import { AssetService } from '../../../../services/asset.service';
import { ToolbarItems , GridComponent } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
import { ProjectService } from '../../../../services/project.service';
import moment = require('moment');

@Component({
    selector: 'app-asset-prefix',
    templateUrl: './asset-prefix.component.html',
    styleUrls: ['./asset-prefix.component.scss']
  })
  export class AssetPrefixComponent implements OnInit {

    constructor(
        public Router: Router,
        public form: FormBuilder,
        private assetService: AssetService,
        private toast: ToastrService, 
        private spinner: NgxSpinnerService,
        private projectService: ProjectService,
        private formBuilder: FormBuilder,
      ) {}

      ngOnInit() : void {
        this.GetAllPrefixByOrgID();
        this.assetPrefixFromInput();
      }

      back() {
        if (this.showPrefix) {
          this.Router.navigate(['settings-new/asset-setting']);
        } else {
          this.backToListing();
          this.GetAllPrefixByOrgID();
    
        }
      }

      deleteAssetPre(data){
       Swal.fire({
             title: "Are you sure?",
             text: "Do you want Remove the Asset Prefix, This will result in not Automating Asset ID" ,
             showCloseButton: true,
             confirmButtonColor: '#e91e63',
             showCancelButton: true,
             focusConfirm: false,
             confirmButtonText: "Yes",
             cancelButtonText: "Cancel",
           }).then((result) => {
             if (result.value === true) {
               this.projectService.RemovePrefix({id: data.id}).subscribe((data:any) => {
                 if(data.status === '200'){
                   this.GetAllPrefixByOrgID();
                   this.toast.success(data.desc)
                 }else{
                   this.toast.error('Something went wrong')
                 }
               });
             }
             else{
             }
           });
      }

      backToListing() {
        this.showPrefix = true;
        this.editAssetPrefixDiv = false;
        //this.assetTypeListing = true;
      }

      showPrefix = true;
      editAssetPrefixDiv = false;

      allAssetPrefixData;
      editAssetPrefixData;
      assetPrefixForm: FormGroup;
      exampletxt;
      example;

      disableSeqNum = true;
        showInputOpt = true;
        sequenceNumberError = false;
        formattedPrefixDate = moment().format('YY/MM');
        formattedPrefix: string;
        inputType;

        prefixTxtError = false;

        currentUser = JSON.parse(localStorage.getItem('user_info'));

      GetAllPrefixByOrgID(){

        this.projectService.GetAllPrefixByOrgID().subscribe((data:any) => {
          let result = []
          data.map((elm, ind) => {
            if(elm.type === 'asset'){
              result.push(elm)
              console.log(result)
            }
    
            if(data.length === ind + 1){
              this.allAssetPrefixData = result;
              console.log(result)
            }
          });
        });
      }

      getInputValue(event){
        this.formattedPrefix = event.srcElement.value
      }

      editSingleAssetPre(data :any){
        // this.spinner.show();
        this.showPrefix = false;
        this.editAssetPrefixDiv = true;
        this.editAssetPrefixData = data;
        console.log(this.editAssetPrefixData)
    
        this.assetPrefixForm.patchValue({
          prefix: this.editAssetPrefixData.prefix_ext,
          prefixFor: this.editAssetPrefixData.prefix_for
        });
    
        if(this.editAssetPrefixData.prefix_for === 'Custom'){
          this.formattedPrefix = '';
          this.disableSeqNum = true;
          this.showInputOpt = false;
          this.exampletxt = 'User is allowed to enter custom prefix';
          this.example = '';
        }else if(this.editAssetPrefixData.prefix_for === 'Sequence'){
          let lastAddprefixSplit = this.editAssetPrefixData.prefix_name.split('/').pop();
          this.formattedPrefix = lastAddprefixSplit;
          this.disableSeqNum = false;
          this.showInputOpt = true;
          this.exampletxt = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.';
          this.example = 'For example, Inc/0001.';
        }else{
          this.formattedPrefix = this.formattedPrefixDate+'/0000';
          this.exampletxt = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
          this.example = 'For example, ENQ/20/08/0000,ENQ/20/08/0001';
          this.disableSeqNum = true;
          this.showInputOpt = true;
        }
        // this.spinner.hide();
      }



      assetPrefixFromInput()
        {
            this.assetPrefixForm = this.formBuilder.group({
            prefix: [''],
            prefixFor: ['']
         });
        }

        changePrefixFor(){
            let value = this.assetPrefixForm.get('prefixFor').value;
            if(value === 'Custom'){
              this.formattedPrefix = '';
              this.assetPrefixForm.patchValue({
                prefixFor: 'Custom'
              });
              this.disableSeqNum = true;
              this.showInputOpt = false;
              this.exampletxt = 'User is allowed to enter custom prefix';
              this.example = '';
            }else if(value === 'Sequence'){
              this.formattedPrefix = '';
              this.assetPrefixForm.patchValue({
                prefixFor: 'Sequence'
              });
              this.disableSeqNum = false;
              this.showInputOpt = true;
              this.inputType = 'number';
              this.exampletxt = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.';
              this.example = 'For example, Inc/0001.';
            }else{
              this.formattedPrefix = '';
              this.assetPrefixForm.patchValue({
                prefixFor: 'Default'
              });
              this.disableSeqNum = true;
              this.showInputOpt = true;
              this.inputType = 'text';
              this.formattedPrefix = this.formattedPrefixDate+'/0000';
              this.exampletxt = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
              this.example = 'For example, ENQ/20/08/0000,ENQ/20/08/0001';
            }
          }

          backToMainCommissionPrefix(){
            if(this.showPrefix){
              this.Router.navigate(['settings-new/asset-setting/asset-prefix']);
            }else{
              this.editAssetPrefixDiv = false;
              this.showPrefix = true;
              this.prefixTxtError = false;
              this.sequenceNumberError = false;
              this.disableSeqNum = false;
              this.GetAllPrefixByOrgID();
              this.assetPrefixForm.reset();
            }
          }


          submitCommissionPrefix(){
              this.prefixTxtError = false;
              this.sequenceNumberError = false;
              let formVaue = this.assetPrefixForm.value;
          
              if(formVaue.prefix === '' || formVaue.prefix === null){
                this.prefixTxtError = true;
                return
              }
              if(!this.disableSeqNum && this.formattedPrefix === ''){
                this.sequenceNumberError = true;
                return
              }
          
              if(this.editAssetPrefixDiv){
                let postData = {
                  id: this.editAssetPrefixData.id,
                  type: "asset",
                  prefix_ext: (formVaue.prefix).toUpperCase(),
                  prefix_name: (formVaue.prefix).toUpperCase()+(formVaue.prefixFor === "Custom" ? '' : '/'+this.formattedPrefix ),
                  prefix_for: formVaue.prefixFor,
                  is_manual_allowed: this.editAssetPrefixData.is_manual_allowed,
                  is_revised: this.editAssetPrefixData.is_revised,
                  created_date: this.editAssetPrefixData.created_date,
                  createdby: this.editAssetPrefixData.createdby,
                  org_id: this.editAssetPrefixData.org_id,
                  modifiedby: this.currentUser.full_name,
                  modified_date: moment().format('L')
                }
          
                this.projectService.UpdatePrefix(postData).subscribe((data:any) => {
                  if(data.status === '200'){
                    this.backToMainCommissionPrefix();
                    this.toast.success(data.desc)
                  }else{
                    this.toast.error('Something went wrong')
                  }
                });
          
              }else{
                let postData = {
                  type: "asset",
                  prefix_ext: (formVaue.prefix).toUpperCase(),
                  prefix_name: (formVaue.prefix).toUpperCase()+(formVaue.prefixFor === "Custom" ? '' : '/'+this.formattedPrefix ),
                  prefix_for: formVaue.prefixFor,
                  is_manual_allowed: false,
                  is_revised: false,
                  created_date: moment().format('L'),
                  createdby: this.currentUser.full_name,
                  org_id: this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id')
                }
          
                this.projectService.AddPrefix(postData).subscribe((data:any) => {
                  if(data.status === '200'){
                    this.backToMainCommissionPrefix();
                    this.toast.success(data.desc)
                  }else{
                    this.toast.error('Something went wrong')
                  }
                });
          
              }
            }


  }