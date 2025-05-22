import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
export function patternValidator(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value;
    if (value === '') {
      return null;
    }
    return !regexp.test(value) ? { 'patternInvalid': { regexp } } : null;
  };
}

export function generateUUID(): string {
  return uuidv4();
}

export function initializeDeviceId(): void {
  const LOCAL_STORAGE_KEY = 'deviceId';
  if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    const newDeviceId = generateUUID();
    localStorage.setItem(LOCAL_STORAGE_KEY, newDeviceId);
  }
}

export function getDeviceId(): string | null {
  const LOCAL_STORAGE_KEY = 'deviceId';
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

export function clearDeviceId(): void {
  const LOCAL_STORAGE_KEY = 'deviceId';
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export function verifyDelegateUserControl(){
  console.log("HIT")
  let delegateAccess = JSON.parse(localStorage.getItem("delegateDetails"));
  let userInfo= JSON.parse(localStorage.getItem("user_info"));
  if(delegateAccess && delegateAccess.length > 0){
    const primaryOrg = delegateAccess.find(item => item.primary_org_id);
    if(primaryOrg!=null && userInfo.org_id !== primaryOrg.primary_org_id){
      console.log('HIS PRIMARY ORGANIZATION',userInfo.org_id,primaryOrg.primary_org_id);
      return true

    }else{
      return false
    }
  }else{
    return false
  }
}