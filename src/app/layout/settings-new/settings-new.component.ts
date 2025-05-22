import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminSettingService } from './../../services/admin-setting.service';
import { UserService } from '../../services/user.service';
import * as _ from "lodash";

@Component({
  selector: 'app-settings-new',
  templateUrl: './settings-new.component.html',
  styleUrls: ['./settings-new.component.scss']
})
export class SettingsNewComponent implements OnInit {

  noAccessTosettingsPage = false;

  //userRights
  commonModuleName;

  term;
  settingNames = [];

  constructor(
    public Router: Router,
    public AdminSettingService: AdminSettingService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    //check superadmin
    this.checkUserRights(); /* get user rights */
  }

  checkUserRights() {
    this.settingNames = [];
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let postData = { id: user_info.role_id }
    if (user_info.is_superadmin === true) {
      this.settingNames.push(
        {
          name: 'Case Type',
          hasAccess: true
        },
        {
          name: 'Estimation',
          hasAccess: true
        },
        {
          name: 'Finance',
          hasAccess: true
        },

        {
          name: 'Vendor',
          hasAccess: true
        },
        {
          name: 'Project',
          hasAccess: true
        },
        {
          name: 'Payment',
          hasAccess: true
        },
        {
          name: 'Human Resource',
          hasAccess: true
        },
        {
          name: 'Asset',
          hasAccess: true
        },
        
       {
        name: 'Travel',
        hasAccess: true
      }
      )
      this.noAccessTosettingsPage = true;
    } else {

      this.userService.GetAccessRightsbyRole(postData).subscribe((data: any) => {
        data.map((item) => {
          item.module_name = item.module_name.replace(/\s+/g, '');;
          return item;
        });
        this.commonModuleName = _.groupBy(data, 'module_name')
        console.log(this.commonModuleName, "CMD")
        //team members
        // if (this.commonModuleName.TeamMembers) {
        //   this.commonModuleName.TeamMembers.map((elm) => {
        //     if (elm.section_name === 'Add / Edit') {
        //       if (elm.is_allow === true) {
        //         this.settingNames.push({
        //           name: 'Team Members',
        //           hasAccess: true
        //         })
        //       }
        //     }
        //   });
        // }

        //teams
        // if (this.commonModuleName.Team) {
        //   this.commonModuleName.Team.map((elm) => {
        //     if (elm.section_name === 'View') {
        //       if (elm.is_allow === true) {
        //         this.settingNames.push({
        //           name: 'Teams',
        //           hasAccess: true
        //         })
        //       }
        //     }
        //   });
        // }
        //leave profile
        // if (this.commonModuleName.Leave) {
        //   this.commonModuleName.Leave.map((elm) => {
        //     if (elm.section_name === 'Create Leave Profile') {
        //       if (elm.is_allow === true) {
        //         this.settingNames.push({
        //           name: 'Leave Overtime Gratuity Profile',
        //           hasAccess: true
        //         })
        //       }
        //     }
        //   });
        // }
        //case
        if (this.commonModuleName.Case) {
          this.commonModuleName.Case.map((elm) => {
            if (elm.section_name === 'Add / Edit Case Type') {
              if (elm.is_allow === true) {
                this.settingNames.push({
                  name: 'Case Type',
                  hasAccess: true
                })
              }
            }
          });
        }
        //estimation
        if (this.commonModuleName.Estimation) {
          this.commonModuleName.Estimation.map((elm) => {
            if (elm.section_name === 'Estimation Settings') {
              if (elm.is_allow === true) {
                this.settingNames.push({
                  name: 'Estimation',
                  hasAccess: true
                })
              }
            }
          });
        }
        //settings
        if (this.commonModuleName.Settings) {
          this.commonModuleName.Settings.map((elm) => {
            if (elm.section_name === 'View Settings') {
              if (elm.is_allow) {
                this.noAccessTosettingsPage = elm.is_allow;
              } else {
                this.noAccessTosettingsPage = elm.is_allow;
              }
            }
          });
        }
        //invoice
        // if (this.commonModuleName.Invoice) {
        //   this.commonModuleName.Invoice.map((elm) => {
        //     if (elm.section_name === 'Add Open Balance') {
        //       if (elm.is_allow === true) {
        //         this.settingNames.push({
        //           name: 'Open Balance',
        //           hasAccess: true
        //         })
        //       }
        //     }
        //   });
        // }
        //commission
        // if (this.commonModuleName.OtherIncome) {
        //   this.commonModuleName.OtherIncome.map((elm) => {
        //     if (elm.section_name === 'Other Income setting') {
        //       if (elm.is_allow === true) {
        //         this.settingNames.push({
        //           name: 'Other Income',
        //           hasAccess: true
        //         })
        //       }
        //     }
        //   });
        // }

        if (this.commonModuleName.OtherIncome) {
          this.commonModuleName.OtherIncome.map((elm) => {
            if (elm.section_name === 'Vendor setting') {
              if (elm.is_allow === true) {
                this.settingNames.push({
                  name: 'Vendor',
                  hasAccess: true
                })
              }
            }
          });
        }

        if (this.commonModuleName.Project) {
          this.commonModuleName.Project.map((elm) => {
            if (elm.section_name === 'Project settings') {
              if (elm.is_allow === true) {
                this.settingNames.push({
                  name: 'Project',
                  hasAccess: true
                })
              }
            }
          });
        }

        //Asset
         if (this.commonModuleName.Asset) {
         this.commonModuleName.Asset.map((elm) => {
            if (elm.section_name === 'Add Edit Asset') {
              if (elm.is_allow === true) {
                this.settingNames.push({
                  name: 'Asset',
                  hasAccess: true
                 })
               }
             }
           });
         }

        //Payroll
        // if (this.commonModuleName.Payroll) {
        //   this.commonModuleName.Payroll.map((elm) => {
        //     if (elm.section_name === 'View PayRoll') {
        //       if (elm.is_allow === true) {
        //         this.settingNames.push({
        //           name: 'Payroll',
        //           hasAccess: true
        //         })
        //       }
        //     }
        //   });
        // }
        // Payment
        if (this.commonModuleName.Payment) {
          this.commonModuleName.Payment.map((elm) => {
            if (elm.section_name === 'View Payment') {
              if (elm.is_allow === true) {
                this.settingNames.push({
                  name: 'Payment',
                  hasAccess: true
                }, {
                  name: 'Travel',
                  hasAccess: true
                })
              }
            }
          });
        }

        //  // Payment
        //  if (this.commonModuleName.Payment) {
        //   this.commonModuleName.Payment.map((elm) => {
        //     if (elm.section_name === 'View Payment') {
        //       if (elm.is_allow === true) {
        //         this.settingNames.push({
        //           name: 'Trael',
        //           hasAccess: true
        //         })
        //       }
        //     }
        //   });
        // }

        //  Finance
        if (this.commonModuleName.Finance) {
          this.commonModuleName.Finance.map((elm) => {
            if (elm.section_name === 'View Finance') {
              if (elm.is_allow === true) {
                this.settingNames.push({
                  name: 'Finance',
                  hasAccess: true
                })
              }
            }
          });
        }

        //  Human Resource
        if (this.commonModuleName.HumanResource) {
          this.commonModuleName.HumanResource.map((elm) => {
            if (elm.section_name === 'View attendance') {
              if (elm.is_allow === true) {
                this.settingNames.push({
                  name: 'Human Resource',
                  hasAccess: true
                })
              }
            }
          });
        }

      });
    }
  }

  cardClick(value) {
    console.log(value, "CARD CLICK")
    switch (value) {
      case 'Team Members':
        this.Router.navigate(['settings-new/team-members']);
        break;

      case 'Teams':
        this.Router.navigate(['settings-new/teams']);
        break;

      case 'Leave Overtime Gratuity Profile':
        this.Router.navigate(['settings-new/leave-mgt']);
        break;

      case 'Case Type':
        this.Router.navigate(['settings-new/case-type']);
        break;

      case 'Estimation':
        this.Router.navigate(['settings-new/estimation']);
        break;

      case 'Other Income':
        this.Router.navigate(['settings-new/commission']);
        break;

      case 'Open Balance':
        this.Router.navigate(['settings-new/open-bal']);
        break;

      case 'Vendor':
        this.Router.navigate(['settings-new/vendor']);
        break;

      case 'Project':
        this.Router.navigate(['settings-new/project']);
        break;

      case 'Asset':
        this.Router.navigate(['settings-new/asset-setting']);
        break;

      case 'Payroll':
        this.Router.navigate(['settings-new/payroll']);
        break;

      case 'Payment':
        this.Router.navigate(['settings-new/payment']);
        break;
        case 'Travel':
          this.Router.navigate(['settings-new/travel']);
          break;

      case 'Finance':
        this.Router.navigate(['settings-new/finance']);
        break;
      case 'Human Resource':
        this.Router.navigate(['settings-new/hr-setting']);
        break;

      default:
        this.Router.navigate(['settings-new']);
    }
  }

  addNewDelegate() {
    console.log("Delegate Add button");
  }

}
