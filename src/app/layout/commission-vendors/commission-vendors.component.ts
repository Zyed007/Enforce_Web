import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { settingsService } from '../../services/settings.service';
import Swal from 'sweetalert2';
import moment = require('moment');
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { CountryService } from '../../services/countryList.service';
import { UserService } from '../../services/user.service';
import * as _ from "lodash";
import cityList from '../cityList';

declare var $: any;

@Component({
  selector: 'app-commission-vendors',
  templateUrl: './commission-vendors.component.html',
  styleUrls: ['./commission-vendors.component.scss']
})
export class CommissionVendorsComponent implements OnInit {

  noAccessPage = false;
  currentUser = JSON.parse(localStorage.getItem('user_info'));
  mainVendorList = true;
  @ViewChild('vendorDataTableGrid',{static:false}) public vendorDataTableGrid: GridComponent;
  @ViewChild('resetDropDown',{static:false}) public resetDropDown: DropDownListComponent;
  commonFields: Object = { text: "value", value: "id"};
  public invoiceToolbar : ToolbarItems[];
  allVendordata;
  vendorForm: FormGroup;
  venPriConForm: FormGroup;

  vendorType = [
    {
      id: 'Contractor',
      value: 'Contractor'
    },
    {
      id: 'Trader',
      value: 'Trader'
    },
    {
      id: 'Consultant',
      value: 'Consultant'
    }
  ]
  cityDataDropDown = cityList;
  vendorCategoryDropDown;
  vendorStatusDropDown;
  vendorDocDropDown;
  docVendorData;

  formSubmitAttemptForVendor = true;
  formSubmitAttemptForVendorContact = true;
  vendorFormType = 'Add';
  editVendorData;

  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
  selectedISO = CountryISO.UnitedArabEmirates;

  expDateMinDate = new Date();
  countryDataDropDown;

  public buttons: Object = {
    browse: 'Browse a document',
  };

  constructor(
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private settingsService: settingsService,
    private countries:CountryService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.invoiceToolbar = ['Search'];
    this.checkUserRights();
    this.vendorFormInputs();
    this.venPriConFormInputs();
    this.GetCommissionVendors();

    this.GetVendorCategoryTypesByOrgId();
    this.GetVendorStatusByOrgId();
    this.GetVendorDocumentUploadTypeByOrgId();
  }

  checkUserRights(){
    if(this.currentUser.is_superadmin === true){
      this.noAccessPage = true;
    }else{
      let postData = { id : this.currentUser.role_id }
      this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
        data.map((item) => {
          item.module_name = item.module_name.replace(/\s+/g, '');
          return item;
        });
        let commonModuleName = _.groupBy(data, 'module_name')

        if(commonModuleName.OtherIncome){
          commonModuleName.OtherIncome.map((elm) => {
            if(elm.section_name === 'Add/Update Vendor'){
              if(elm.is_allow === true){
                this.noAccessPage = true;
              }
            }
          });
        }
      });
    }
  }

  GetCommissionVendors(){
    this.settingsService.GetCommissionVendors().subscribe((data: any) => {
      if(data.length !== 0){
        data.map((elm, i) => {
          delete elm['documentExpiryDate']
          delete elm['documentUrl']
          this.settingsService.EntityContactsByVendorId({id: elm.id}).subscribe((contData) => {
            elm.entityContact = contData;
            this.settingsService.DocumentUrlByVendorId({id: elm.id}).subscribe((docData) => {
              elm.vendorEntityDocument = docData;
              if(data.length === i+1){
                this.allVendordata = data;
              }
            });
          });
        });
      }else{
        this.allVendordata = [];
      }
      this.spinner.hide();
    });
  }

  vendorsDiv(type){
    this.getCountryList();
    this.spinner.show();
    this.mainVendorList = false;
    if(type === 'none'){
      this.vendorFormType = 'Add';
      this.spinner.hide();
      this.venPriConForm.patchValue({
        country: 224,
      });
      this.patchRequiredDocument();
    }else{
      delete type['column'];
      delete type['foreignKeyData'];
      delete type['index'];
      this.vendorFormType = 'Edit';
      this.editVendorData = type;
      console.log('Edit Data selected', type)
      this.vendorForm.patchValue({
        name: type.name,
        type: type.type,
        status: type.vendorStatus,
        category: type.categorytypes.split(","),
        email: type.vendorEmail,
        phone: type.vendorPhone,
      });

      //contact form
      let contact = type.entityContact[0];
      this.venPriConForm.patchValue({
        PFname: contact.first_name,
        PLname: contact.last_name,
        Pemail: contact.email,
        Pphone: contact.phone,
        designation: contact.designation,
        address1: contact.adr_1,
        address2: contact.adr_2,
        city: contact.city,
        country: parseFloat(contact.country)
      });

      let formData = this.vendorForm.get('venDocument') as FormArray;
      this.docVendorData.map((dropMain) => {
        type.vendorEntityDocument.map((elm) => {
          if(dropMain.id === elm.description){
            formData.push(this.formBuilder.group({
              id: elm.id,
              documentType: elm.description,
              documentUrl: elm.documentURL,
              documentExpireDate: new Date(elm.documentExpiryDate),
              isExpiryReq: dropMain.isExpiryReq,
              isRequired: dropMain.isRequired
            }));
          }
        });
      });
      this.spinner.hide();
    }
  }

  isContactSame(e){
    let vendorFormValue = this.vendorForm.value;
    if(e.checked){
      this.venPriConForm.patchValue({
        Pemail: vendorFormValue.email,
        Pphone: vendorFormValue.phone.number
      })
    }else{
      this.venPriConForm.patchValue({
        Pemail: '',
        Pphone: ''
      })
    }
  }

  addNewDocumnetName() {
    let newMem = this.venDocumentFormInput();
    this.venDocument.push(newMem);
    this.formSubmitAttemptForVendor = true;
  }

  patchRequiredDocument(){
    let formData = this.vendorForm.get('venDocument') as FormArray;
    this.docVendorData.map((elm, i) => {
      if(elm.isRequired){
        formData.push(this.formBuilder.group({
          isExpiryReq: elm.isExpiryReq,
          isRequired: elm.isRequired,
          documentType: elm.id,
          documentUrl: '',
          documentExpireDate: '',
        }));
      }

      if(this.docVendorData.length === i+1){
        let docformData = formData.value;
        if(docformData.length === 0){
          this.addNewDocumnetName();
        }
      }
    });
  }

  checkToShowDelete(val){
    let formRowValue = val.value
    let formValue = this.vendorForm.controls['venDocument'].value;
    if(formRowValue.isRequired){
      return true
    }else{
      if(formValue.length === 1){
        return true
      }else{
        return false
      }
    }
  }

  getDocTypeChange(event, i){
    let dropValueId = event.value;
    this.docVendorData.map((elm) => {
      if(elm.id === dropValueId){
        this.venDocument.at(i).patchValue({
          isExpiryReq: elm.isExpiryReq
        });
      }
    })
  }

  showExpireDate(val){
    let formRowValue = val.value;
    if(formRowValue.isExpiryReq){
      return true
    }else{
      return false
    }
  }

  checkForBtnName(val){
    let formRowValue = val.value;
    if(formRowValue.documentUrl === ''){
      return true
    }else{
      return false
    }
  }

  deleteDocumnetRow(i: number){
    if(this.vendorFormType === 'Edit'){
      let formValue = this.vendorForm.value;
      let ToDelete = formValue.venDocument[i];
      this.editVendorData.vendorEntityDocument.map((elm) => {
        if(elm.id === ToDelete.id){
          let postData = {
            id: elm.id,
            entity_id: elm.entity_id,
            org_id: elm.org_id,
            documentURL: elm.documentUrl,
            documentExpiryDate: moment(elm.documentExpireDate).format('L'),
            description: elm.documentType,
            createdDate: elm.createdDate,
            modifiedDate: elm.modifiedDate,
            createdByEmpId: elm.createdByEmpId,
            createdBy: elm.createdBy,
            isDeleted: true
          }

          this.settingsService.UpdateDocumentUrlById(postData).subscribe((data: any) => {
            if(data.status === '200'){
              const indexOfObject = this.editVendorData.vendorEntityDocument.findIndex(object => {
                return object.id === ToDelete.id;
              });
              this.editVendorData.vendorEntityDocument.splice(indexOfObject, 1);
              this.venDocument.removeAt(i);
            }
          });
        }
      });
    }else{
      this.venDocument.removeAt(i);
    }
  }

  onFileSelected(event, i){
    let imageData = event.filesData[0].rawFile;
    this.spinner.show();
    const file:File = imageData;
    if(file){
      let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
      let todaysDate = Math.round(new Date().getTime()/1000);
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'enforceVendorDoc');
      data.append('cloud_name', 'dq7ta9et2')
      data.append('public_id', userName+todaysDate)
      this.settingsService.uploadSignature(data).subscribe((imData) => {
        this.venDocument.at(i).patchValue({
          documentUrl: imData.secure_url
        });
        this.spinner.hide();
      });
    }
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  submitAddVendor(){
    this.formSubmitAttemptForVendor = false;
    this.formSubmitAttemptForVendorContact = false;
    if(this.vendorForm.invalid){
      return;
    }

    if(this.venPriConForm.invalid){
      return;
    }

    let formValue = this.vendorForm.value;
    formValue.venDocument.map((elm, i) => {
      if(elm.documentUrl === ''){
        return
      }

      if(formValue.venDocument.length === i+1){
        this.afterRunSubmitAddVendor();
      }
    });
  }

  afterRunSubmitAddVendor(){
    this.spinner.show();
    let formValue = this.vendorForm.value;
    let formValue2 = this.venPriConForm.value;
    let orgId = this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id');

    if(this.vendorFormType === 'Add'){
      let postData: any = {
        org_id: orgId,
        name: formValue.name,
        type: formValue.type,
        categorytypes: formValue.category.toString(),
        vendorEmail: formValue.email,
        vendorPhone: formValue.phone.dialCode+formValue.phone.number,
        vendorStatus: formValue.status,
        entityContact: [{
            name: formValue2.PFname+' '+formValue2.PLname,
            first_name: formValue2.PFname,
            last_name: formValue2.PLname,
            department: formValue2.designation,
            designation: formValue2.designation,
            email: formValue2.Pemail,
            phone: formValue2.Pphone.dialCode+formValue2.Pphone.number,
            adr_1: formValue2.address1,
            adr_2: formValue2.address2,
            city: formValue2.city,
            country: formValue2.country,
            is_primary: true,
            createdby: this.currentUser.full_name,
            created_date: moment().format('L')
        }],
        createdDate: moment().format('L'),
        createdByEmpId: this.currentUser.id,
        createdBy: this.currentUser.full_name
      }

      let docArray = []
      formValue.venDocument.map((elm, i) => {
        let docData = {
          org_id: orgId,
          documentURL: elm.documentUrl,
          documentExpiryDate: elm.documentExpireDate !== '' ?  moment(elm.documentExpireDate).format('L') : '',
          description: elm.documentType,
          createdDate: moment().format('L'),
          createdBy: this.currentUser.full_name
        }
        docArray.push(docData);

        if(formValue.venDocument.length === i+1){
          postData.vendorEntityDocument = docArray;
          this.addVendorFinal(postData)
        }
      });
    }else{
      let postData: any = {
        id: this.editVendorData.id,
        org_id: this.editVendorData.org_id,
        name: formValue.name,
        type: formValue.type,
        categorytypes: formValue.category.toString(),
        vendorEmail: formValue.email,
        vendorPhone: formValue.phone.internationalNumber.replace(/\s+/g, ''),
        vendorStatus: formValue.status,
        documentExpiryDate: moment(formValue.expireDate).format('L'),
        createdDate: this.editVendorData.createdDate,
        createdByEmpId: this.editVendorData.createdByEmpId,
        createdBy: this.editVendorData.createdBy,
        modifiedDate: moment().format('L'),
      }

      this.settingsService.UpdateCommissionVendors(postData).subscribe((data:any) => {
        if(data.status === '200'){
          let contData = {
            id: this.editVendorData.entityContact[0].id,
            entity_id: this.editVendorData.entityContact[0].entity_id,
            name: formValue2.PFname+' '+formValue2.PLname,
            first_name: formValue2.PFname,
            last_name: formValue2.PLname,
            department: formValue2.designation,
            designation: formValue2.designation,
            email: formValue2.Pemail,
            phone: formValue2.Pphone.internationalNumber.replace(/\s+/g, ''),
            adr_1: formValue2.address1,
            adr_2: formValue2.address2,
            city: formValue2.city,
            country: formValue2.country,
            is_primary: true,
            createdby: this.editVendorData.entityContact[0].createdby,
            created_date: this.editVendorData.entityContact[0].created_date,
            modifiedby: this.currentUser.full_name,
            modified_date: moment().format('L')
          }
          this.settingsService.UpdateEntityContactsByVendorId(contData).subscribe((data: any) =>{
            if(data.status === '200'){
              formValue.venDocument.map((elm, id) => {
                if(!('id' in elm)){
                  elm.id = 'new'
                }
                if(formValue.venDocument.length === id+1){
                  this.callFinalEditDocument(formValue)
                }
              });
            }else{
              this.toast.error('Something went wrong')
              this.closeVendorDiv();
            }
          });
        }else{
          this.toast.error('Something went wrong')
          this.closeVendorDiv();
        }
      });
    }
  }

  callFinalEditDocument(formValue){
    console.log('Edit Data selected doc', this.editVendorData.vendorEntityDocument)
    console.log('Edit Data selected formArray',formValue.venDocument)
    this.editVendorData.vendorEntityDocument.map((oldV, oV) => {
      formValue.venDocument.map((newV) => {
        if(oldV.id === newV.id){
          let postData = {
            id: oldV.id,
            entity_id: oldV.entity_id,
            org_id: oldV.org_id,
            documentURL: newV.documentUrl,
            documentExpiryDate: moment(newV.documentExpireDate).format('L'),
            description: newV.documentType,
            createdDate: oldV.createdDate,
            modifiedDate: moment().format('L'),
            createdByEmpId: oldV.createdByEmpId,
            createdBy: oldV.createdBy
          }
          this.settingsService.UpdateDocumentUrlById(postData).subscribe((data) => {
            if(this.editVendorData.vendorEntityDocument.length === oV + 1){
              let checkIfNew = [];
              formValue.venDocument.filter((elm, i) => {
                if(elm.id === 'new'){
                  checkIfNew.push(elm)
                }

                if(formValue.venDocument.length === i+1){
                  console.log('run')
                  if(checkIfNew.length !== 0){
                    this.addAfterUpdate(checkIfNew)
                  }else{
                    this.toast.success('Income Updated');
                    this.closeVendorDiv();
                  }
                }
              });

            }
          });
        }
      });
    })
  }

  addAfterUpdate(formValue){
    let orgId = this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id');
    formValue.map((newV, nV) => {
      if(newV.id === 'new'){
        let postData = {
          entity_id: this.editVendorData.id,
          org_id: orgId,
          documentURL: newV.documentUrl,
          documentExpiryDate: newV.documentExpireDate !== '' ?  moment(newV.documentExpireDate).format('L') : '',
          description: newV.documentType,
          createdDate: moment().format('L'),
          createdBy: this.currentUser.full_name
        }
        this.settingsService.AddVendorDocuments(postData).subscribe((data) => {
          if(formValue.length === nV + 1){
            this.toast.success('Income Updated');
            this.closeVendorDiv();
          }
        });
      }
    });
  }

  addVendorFinal(postData){
    this.settingsService.AddCommissionVendors(postData).subscribe((data:any) => {
      if(data.status === '200'){
        this.toast.success(data.desc)
      }else{
        this.toast.error('Something went wrong')
      }
      this.closeVendorDiv();
    });
  }

  vendorsDelete(data){
    Swal.fire({
      title: 'Delete this Service - '+data.name+' ?',
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
          id: data.id,
          org_id: data.org_id,
          name: data.name,
          type: data.type,
          categorytypes: data.categorytypes,
          vendorEmail: data.vendorEmail,
          vendorPhone: data.vendorPhone,
          vendorLocation: data.vendorLocation,
          vendorStatus: data.vendorStatus,
          documentUrl: data.documentUrl,
          documentExpiryDate: data.documentExpiryDate,
          createdDate: data.createdDate,
          modifiedDate: data.modifiedDate ? data.modifiedDate : '',
          createdByEmpId: data.createdByEmpId,
          createdBy: data.createdBy,
          isDeleted: true
        }

        this.settingsService.UpdateCommissionVendors(postData).subscribe((data:any) => {
          if(data.status === '200'){
            this.toast.success('Vendor Deleted Successfully')
          }else{
            this.toast.error('Something went wrong')
          }
          this.GetCommissionVendors();
        });
      }
    });


  }

  closeVendorDiv(){
    this.mainVendorList = true;
    this.resetDropDown.value = null;
    this.formSubmitAttemptForVendor = true;
    this.formSubmitAttemptForVendorContact = true;
    this.vendorForm.reset();
    this.venPriConForm.reset();
    (this.vendorForm.get('venDocument') as FormArray).clear();
    this.GetCommissionVendors();
  }

  getCountryList(){
    this.countries.getCountryList().subscribe((data:any)  => {
      let results = [];
      data.map((elm) => {
        results.push({
          id: elm.id,
          value: elm.name
        });
      });
      this.countryDataDropDown = results;
    });
  }

  GetVendorCategoryTypesByOrgId(){
    this.settingsService.GetVendorCategoryTypesByOrgId().subscribe((data:any) => {
      let result = [];
      data.map((elm , i) => {
        result.push({
          id: elm.id,
          value: elm.name
        });

        if(data.length === i+1){
          this.vendorCategoryDropDown = result;
        }
      });
    });
  }

  GetVendorDocumentUploadTypeByOrgId(){
    this.settingsService.GetVendorDocumentUploadTypeByOrgId().subscribe((data:any) => {
      this.docVendorData = data;
      let result = [];
      data.map((elm , i) => {
        result.push({
          id: elm.id,
          value: elm.name
        });

        if(data.length === i+1){
          this.vendorDocDropDown = result;
        }
      });
    });
  }

  GetVendorStatusByOrgId(){
    this.settingsService.GetVendorStatusByOrgId().subscribe((data:any) => {
      let result = [];
      data.map((elm , i) => {
        result.push({
          id: elm.id,
          value: elm.name
        });

        if(data.length === i+1){
          this.vendorStatusDropDown = result;
        }
      });
    });
  }

  vendorFormInputs(){
    this.vendorForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      category: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required]],
      venDocument: this.formBuilder.array([],[Validators.required])
    });
  }

  get venDocument(): FormArray {
    return this.vendorForm.get('venDocument') as FormArray;
  }

  venDocumentFormInput(){
    return this.formBuilder.group({
      isExpiryReq: [''],
      documentType: ['', [Validators.required]],
      documentUrl: ['', [Validators.required]],
      documentExpireDate: ['']
    });
  }

  venPriConFormInputs(){
    this.venPriConForm = this.formBuilder.group({
      PFname: ['', Validators.required],
      PLname: ['', Validators.required],
      Pemail: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      Pphone: ['', Validators.required],
      designation: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  serviceSearchKeyUp(): void{
    document.getElementById(this.vendorDataTableGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.vendorDataTableGrid.search((event.target as HTMLInputElement).value)
    });
  }

}
