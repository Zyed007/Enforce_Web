import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { settingsService } from "../../../services/settings.service";
import Swal from "sweetalert2";
import { PaymentVoucherService } from "../../../services/payment-voucher.service";
import { data } from "jquery";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { thresholdFreedmanDiaconis } from "d3";
import { EmployeeService } from "../../../services/employee.service";


@Component({
    selector: 'app-payment-mode',
    templateUrl: './payment-mode.component.html',
    styleUrls: ['./payment-mode.component.scss']

})

export class PaymentModeComponent implements OnInit {
    paymentModesListing = true;
    paymentModeArr = [];
    bankAccountDetails = []
    cardDetails = [
        {
            cardHolderName: 'John Doe',
            cardType: 'Visa',
            cardNumber: '4111111111111111',
            expiryDate: '12/24',
            cvv: '123',
            issuer: 'Visa',
            nickname: 'Primary Card',
            currency: 'AED',
        },
        {
            cardHolderName: 'Jane Smith',
            cardType: 'MasterCard',
            cardNumber: '5555555555554444',
            expiryDate: '06/25',
            cvv: '456',
            issuer: 'MasterCard',
            nickname: 'Business Card',
            currency: 'AED',
        }
    ];
    cashDetails = [
        {
            "name": "John Jacob",
            "phone": "050 980 4369",
            "email": "John@gmail.com",
            "document": "",
            "nationalId": "987654456",
            "street": "Manama St",
            "city": "Dubai",
            "country": "UAE"
        },
        {
            "name": "Alice Smith",
            "phone": "123 456 7890",
            "email": "alice@example.com",
            "document": "",
            "nationalId": "987654321",
            "street": "123 Main St",
            "city": "Anytown",
            "country": "USA"
        },
        {
            "name": "Bob Johnson",
            "phone": "987 654 3210",
            "email": "bob@example.com",
            "document": "",
            "nationalId": "123456789",
            "street": "456 Elm St",
            "city": "Sometown",
            "country": "Canada"
        }
    ]

    roleArr = [{
        id: 'Sender',
        value: 'Sender'
    },
    {
        id: 'Recipient',
        value: 'Recipient'
    }]
    selectedPaymentMethod = '';
    key = 'secret';
    paymentModeType = '';
    editBankAccId = '';
    is_company = false;
    is_individual = false;
    is_employee = false;
    is_common = false;
    is_wps = false;
    bankAccountForm: FormGroup;
    cardDetailsForm: FormGroup;
    cashDetailsForm: FormGroup;
    editBankAcc = false;
    editCardDetails = false;
    editCashDetails = false;


    @ViewChild("bankAccModal", { static: false }) bankAccModal: any;
    @ViewChild("cardDetailsModal", { static: false }) cardDetailsModal: any;
    @ViewChild("cashDetailsModal", { static: false }) cashDetailsModal: any;
    @ViewChild("bankDetailsGrid", { static: false }) public bankDetailsGrid: GridComponent;
    @ViewChild("cardDetailsGrid", { static: false }) public cardDetailsGrid: GridComponent;
    @ViewChild("cashDetailsGrid", { static: false }) public cashDetailsGrid: GridComponent;
    commonFields: Object = { text: "value", value: "id" };
    org_id = localStorage.getItem("org_id").toString()
    user_info = JSON.parse(localStorage.getItem('user_info'));
    constructor(public Router: Router, private formBuilder: FormBuilder, private modalService: NgbModal, private toast: ToastrService, private spinner: NgxSpinnerService, public settingsService: settingsService, private paymentVoucherService: PaymentVoucherService,
        private route: ActivatedRoute, private empService: EmployeeService
    ) {

    }
    ngOnInit(): void {
        this.generatePaymentModeArr();
        console.log(this.paymentModeArr, "paymentModeArr");
        this.route.queryParams.subscribe(params => {
            const data = params['key'];
            if (data) {
                let decrypted = this.xorEncryptDecrypt(data, this.key);
                this.handlePaymentMode(decrypted);
            } else {
                this.is_common = true;
                this.paymentModeType = 'common'
            }
        });

    }

    xorEncryptDecrypt(input: string, key: string): string {
        let output = '';

        for (let i = 0; i < input.length; i++) {
            const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            output += String.fromCharCode(charCode);
        }
        return output;
    }
    handlePaymentMode(type) {
        this.paymentModeType = type;
        switch (type) {
            case 'individual':
                this.is_company = false;
                this.is_individual = true;
                this.is_employee = false;
                this.is_common = true;
                this.is_wps = true;
                break;
            case 'finance':
                this.is_company = true;
                this.is_individual = false;
                this.is_employee = false;
                this.is_common = false;
                break;
            case 'employee':
                this.is_company = false;
                this.is_individual = false;
                this.is_employee = true;
                this.is_common = false;
                break;
            default:
                this.is_company = false;
                this.is_individual = false;
                this.is_employee = false;
                this.is_common = false;
                this.is_wps = false;

        }

        this.editPaymentMode('Bank Transfer');
    }

    formatDate(date: Date): string {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        return formattedDay + '-' + formattedMonth + '-' + year;
    }

    generatePaymentModeArr(): void {
        const todayDate = new Date();
        const formattedTodayDate = this.formatDate(todayDate);
        for (let i = 0; i < 5; i++) {
            this.paymentModeArr.push({
                id: i + 1,
                value: ['Bank Transfer', 'Cash', 'Cheque', 'MasterCard', 'Visa'][i],
                createdBy: 'Sazid Khan',
                createdDate: formattedTodayDate
            });
        }
    }
    backToMainPayment() {
        // if (this.paymentModesListing) {
        //     this.Router.navigate(['settings-new/payment']);
        // } else {
        //     this.spinner.show()
        //     this.paymentModesListing = true;
        //     setTimeout(() => {
        //         this.spinner.hide()
        //     }, 1000)
        // }
        console.log(this.paymentModeType, "this.paymentModeType")
        if (this.paymentModeType === 'finance') {
            this.Router.navigate(['settings-new/finance']);
        }
        else if (this.paymentModeType == 'individual' || this.paymentModeType == 'employee') {
            this.Router.navigate(['settings-new/payroll/beneficiaryAcc']);
        } else {
            this.Router.navigate(['settings-new/payment-setting']);
        }


    }
    editPaymentMode(data) {
        console.log(data, "CHECKING DATA")
        this.selectedPaymentMethod = data;
        this.spinner.show()
        this.paymentModesListing = false;
        switch (data) {
            case 'Bank Transfer':
                this.bankAccountForm = this.formBuilder.group({
                    acc_holder_name: ['', Validators.required],
                    acc_type: ['', Validators.required],
                    acc_num: ['', Validators.required],
                    bank_name: ['', Validators.required],
                    branch_name: [''],
                    swift_bic: [''],
                    iban: ['', Validators.required],
                    currency: ['', Validators.required],
                    nick_name: ['', Validators.required],
                    role: ['', Validators.required],
                    is_default: false,
                    is_wps: false,
                    desc: ['']
                });
                this.handlebankAccountDetails()

                break;
            case 'MasterCard':
                console.log('MASTE')
                this.cardDetailsForm = this.formBuilder.group({
                    card_holder_name: ['', Validators.required],
                    card_type: ['', Validators.required],
                    card_num: ['', [Validators.required, Validators.pattern(/^4\d{15}$/)]],
                    expiry_date: ['', Validators.required],
                    cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
                    issuer: ['', Validators.required],
                    currency: ['', Validators.required],
                    nick_name: [''],
                    is_default: false
                });
                this.GetCardDetailsByMode()
                break;
            case 'Visa':
                this.cardDetailsForm = this.formBuilder.group({
                    card_holder_name: ['', Validators.required],
                    card_type: ['', Validators.required],
                    card_num: ['', [Validators.required,
                        // Validators.pattern(/^4\d{15}$/)
                    ]
                    ],
                    expiry_date: ['', Validators.required],
                    cvv: ['', [Validators.required,
                        // Validators.pattern(/^\d{3}$/)
                    ]],
                    issuer: ['', Validators.required],
                    currency: ['', Validators.required],
                    nick_name: [''],
                    is_default: false
                });
                this.GetCardDetailsByMode()
                break;
            case 'Cash':
                this.cashDetailsForm = this.formBuilder.group({
                    name: ['', Validators.required],
                    phone: ['', Validators.required],
                    email: ['', Validators.required],
                    document: ['', Validators.required],
                    national_id: ['', Validators.required],
                    street: ['', Validators.required],
                    city: ['', Validators.required],
                    country: ['', Validators.required],
                    is_default: false
                })

        }
        console.log(this.selectedPaymentMethod, "******")
        setTimeout(() => {
            this.spinner.hide()
        }, 1000)

    }
    handlebankAccountDetails() {
        if (this.is_employee) {
            this.GetEmployeeBankDetailsByorgId()
        } else {
            this.GetBankAccountDetailsByMode()
        }
    }

    addNewBankAccount() {
        this.spinner.show()
        this.bankAccountForm.reset()
        setTimeout(() => {
            this.spinner.hide()
            this.openBankAccModal()
        }, 1000)
    }

    openBankAccModal() {
        this.modalService.open(this.bankAccModal);
    }

    closeModel() {
        console.log('CLOSE')
        this.modalService.dismissAll()
        this.editBankAcc = false;
        this.editCardDetails = false;
        this.editCashDetails = false;
    }

    editBankAccount(data) {
        console.log(data, "CHECK");
        this.editBankAccId = data.id
        this.spinner.show();
        this.editBankAcc = true;
        this.bankAccountForm.reset()
        setTimeout(() => {
            this.spinner.hide()
            this.bankAccountForm.patchValue(data);
            this.openBankAccModal();
        }, 1000)
    }
    deletePaymentModeDetailsConfirmation(data) {
        Swal.fire({
            title: 'Are you sure you want to delete this?',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',

        }).then((result) => {
            if (result.value) {
                console.log(result, 'result')
                this.spinner.show()
                this.deletePaymentModeDetailsById(data);
            }
        });
    }
    deletePaymentModeDetailsById(data) {
        if (data) {
            let postData = {
                id: data.id,
                mode: data.mode,
                org_id: this.org_id
            }

            this.paymentVoucherService.DeletePaymentModeDetailsById(postData).subscribe({
                next: (res: any) => {
                    try {
                        if (res.status === '200') {
                            if (data.mode == 'Bank Transfer') {
                                this.GetBankAccountDetailsByMode()
                            } else if (data.mode == 'Card') {
                                this.GetCardDetailsByMode()
                            }
                            this.toast.success('Deleted Successfully!')
                        }
                    } catch (error) {
                        this.toast.error('Something went wrong!')
                    } finally {
                        this.spinner.hide()
                    }
                },
                error: (error) => {
                    this.toast.error('An error occurred while making the request.');
                    this.spinner.hide();
                }
            });
        }
    }
    async submitBankAccountDetails() {

        try {
            let details = this.bankAccountForm.getRawValue();
            // console.log(this.paymentModeType=='common'?details.is_wps : this.is_wps,this.paymentModeType=='common',this.is_wps,"!!!")
            let postData = {
                ...details, mode: 'Bank Transfer', org_id: this.org_id, is_default: false, is_company: this.is_company, mode_type: this.paymentModeType,
                is_common: this.is_common, is_wps: this.paymentModeType == 'common' ? details.is_wps : this.is_wps, created_by: this.user_info['full_name']
            };
            this.spinner.show();

            const res: any = await this.paymentVoucherService.AddPaymentModeDetails(postData).toPromise();

            console.log(res, '******');
            if (res.status === '200') {
                this.GetBankAccountDetailsByMode();
                this.toast.success('Bank account added successfully!')
            }
            console.log(details, "********");
        } catch (error) {
            console.error('Error submitting bank account details:', error);
            this.toast.error("Something went wrong!")
        } finally {
            this.closeModel();
            this.spinner.hide();
        }
    }
    async updateBankAccountDetails() {
        console.log('updateBankAccountDetails')
        try {
            if (this.editBankAccId != '') {
                let details = this.bankAccountForm.getRawValue();
                let postData = {
                    ...details, mode: 'Bank Transfer', org_id: this.org_id, is_default: false, is_company: this.is_company, mode_type: this.paymentModeType, is_common: this.is_common,
                    is_wps: this.paymentModeType == 'common' ? details.is_wps : this.is_wps, created_by: this.user_info['full_name'], id: this.editBankAccId
                };
                this.spinner.show();

                const res: any = await this.paymentVoucherService.UpdatePaymentModeDetailsByID(postData).toPromise();

                console.log(res, '******');

                if (res.status === '200') {
                    this.GetBankAccountDetailsByMode();
                    this.toast.success('Bank account updated successfully!')
                }
                console.log(details, "********");
            }
        } catch (error) {
            console.error('Error updating bank account details:', error);
            this.toast.error("Something went wrong!")
        } finally {
            this.closeModel();
            this.spinner.hide();
        }
    }

    GetBankAccountDetailsByMode() {
        let postData = { mode: 'Bank Transfer', org_id: this.org_id, is_company: this.is_company, mode_type: this.paymentModeType, is_common: this.is_common, is_wps: this.is_wps };
        this.bankAccountDetails = [];
        this.paymentVoucherService.GetPaymentModeDetailsByMode(postData).subscribe((data: any) => {
            data.map((details) => {
                this.bankAccountDetails.push(details)
            })
            this.bankDetailsGrid.refresh()
            console.log(this.bankAccountDetails, "*********")
        })
    }
    GetEmployeeBankDetailsByorgId() {
        let postData = { OrgId: this.org_id };
        this.bankAccountDetails = [];
        this.empService.GetEmployeeBankDetailsByorgId(postData).subscribe((data: any) => {
            if (data && data.length > 0) {
                data.map((emp: any) => {
                    this.bankAccountDetails.push({
                        acc_holder_name: emp.name,
                        acc_type: '',
                        acc_num: emp.bank_account_num,
                        bank_name: emp.bank_name,
                        branch_name: emp.bank_branch,
                        swift_bic: emp.bank_swift,
                        iban: emp.bank_Iban,
                        currency: 'AED',
                        nick_name: '',
                        role: '',
                        is_default: false
                    })
                })
                this.bankDetailsGrid.refresh()
            }
        })
    }
    openCardDetailsModal() {
        this.modalService.open(this.cardDetailsModal);
    }

    addCardDetails() {
        this.spinner.show()
        this.cardDetailsForm.reset()
        setTimeout(() => {
            this.spinner.hide()
            this.openCardDetailsModal()
        }, 1000)

    }
    editCardData(data) {
        console.log(data);
        this.spinner.show()
        this.cardDetailsForm.reset();
        setTimeout(() => {
            this.spinner.hide()
            this.editCardDetails = true;
            this.cardDetailsForm.patchValue(data);
            this.openCardDetailsModal();
        }, 1000)

    }
    deleteCardData(data) {

    }
    async submitCardDetails() {
        try {
            let details = this.cardDetailsForm.getRawValue()
            console.log(details, "***details")
            let postData = { ...details, mode: 'Card', org_id: this.org_id, is_default: false, is_company: this.is_company, mode_type: this.paymentModeType };
            this.spinner.show();
            let res: any = await this.paymentVoucherService.AddPaymentModeDetails(postData).toPromise()
            console.log(data, '******')
            if (res.status === '200') {
                this.GetCardDetailsByMode();
                this.toast.success('Card details added successfully!')
            }
            console.log(postData, "********")
        }
        catch (error) {
            this.toast.error("Something went wrong!")
        } finally {
            this.spinner.hide();
        }

    }
    GetCardDetailsByMode() {
        let postData = { mode: 'Card', org_id: this.org_id, is_company: this.is_company, mode_type: this.paymentModeType };
        this.cardDetails = []
        this.paymentVoucherService.GetPaymentModeDetailsByMode(postData).subscribe((data: any) => {
            data.map((details) => {
                this.cardDetails.push(details)
            })
            this.cardDetailsGrid.refresh()
            console.log(this.bankAccountDetails, "*********")
        })
    }
    addNewCashRecepient() {
        this.spinner.show()
        this.cashDetailsForm.reset()
        setTimeout(() => {
            this.spinner.hide()
            this.openCashDetailsModal()
        }, 1000)
    }
    editCashRecepient(data) {
        console.log(data);
        this.spinner.show()
        this.cashDetailsForm.reset();
        setTimeout(() => {
            this.spinner.hide()
            this.editCashDetails = true;
            this.cashDetailsForm.patchValue(data);
            this.openCardDetailsModal();
        }, 1000)

    }
    deleteCashRecepient(data) {

    }

    openCashDetailsModal() {
        this.modalService.open(this.cashDetailsModal);
    }
    setAsDefault(data) {
        switch (data) {
            case 'Bank Transfer':
                this.bankAccountForm.patchValue({
                    isDefault: true
                })
                break;
            case 'Card':
                this.cardDetailsForm.patchValue({
                    isDefault: true
                })
                break;
        }
        this.toast.success('This bank account has been set as default successfully.')
    }
    onFileSelected(event, type) {
        console.log(type, "TYPE")
        let imageData = event.filesData[0].rawFile;
        this.spinner.show();
        const file: File = imageData;
        if (file) {
            //let userName = this.vendorForm.get("name").value !== '' ? this.vendorForm.get("name").value : 'NoName';
            let todaysDate = Math.round(new Date().getTime() / 1000);
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', 'Leavedocuments');
            data.append('cloud_name', 'dtlt6afvv')
            data.append('public_id', "Leave" + todaysDate)
            this.settingsService.uploadEmpDoc(data).subscribe((imData) => {
                if (imData != null) {
                    this.cashDetailsForm.patchValue({
                        document: imData.secure_url
                    })
                }
                this.spinner.hide();
            });
        }
    }
    goToLink(doc_url) {
        // let doc_url = this.PaymentMethodForm.get('document').value
        console.log(doc_url, "doc!")
        if (doc_url != null && doc_url != '') {
            window.open(doc_url, "_blank");
        } else {
            this.toast.warning("Please upload a document")
        }

    }
    docDelete() {
        Swal.fire({
            title: 'Are you sure you want to delete this document?',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',

        }).then((result) => {
            if (result.value) {
                console.log(result, 'result')
                this.cashDetailsForm.patchValue({
                    document: ''
                });
            }
        });
    }
    handleWPS(e: boolean) {
        this.bankAccountForm.patchValue({
            is_wps: e
        })
    }


}