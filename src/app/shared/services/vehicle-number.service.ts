import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PayrollService } from '../../services/payroll.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleNumberService {
  private vehicleConfigs: any[] = [];
  userInfo = JSON.parse(localStorage.getItem("user_info"));
  constructor(private http: HttpClient, private payrollService: PayrollService,) { }

  async fetchVehicleConfigs(): Promise<any[]> {
    try {
      let res: any = await this.payrollService.GetTravelVehicleConfigByOrgId({ id: this.userInfo.org_id }).toPromise();
      return Array.isArray(res) && res.length > 0 ? res : [];
    } catch (error) {
      console.error('Error fetching vehicle configs:', error);
      return [];
    }
  }


  setVehicleConfigs(configs: any[]): void {
    this.vehicleConfigs = configs;
  }

  getDropdownOptions(source: string): { id: string, text: string }[] {
    const config = this.vehicleConfigs.find(cfg => cfg.source === source);
    console.log(config, "config");

    if (!config) return [];

    let dropdownOptions: { id: string, text: string }[] = [];

    if (config.allow_alphabets) {
      const alphabetCombinations = this.generateAlphabetCombinations(config.alphabet_com);
      dropdownOptions.push(...alphabetCombinations.map(code => ({ id: code, text: code })));
    }

    if (config.allow_numbers) {
      const numberCombinations = this.generateNumberCombinations(config.number_com);
      dropdownOptions.push(...numberCombinations.map(code => ({ id: code, text: code })));
    }

    if (config.custom_codes) {
      let parsedCodes = JSON.parse(config.custom_codes);
      console.log(parsedCodes, "parsedCodes");
      dropdownOptions.push(...parsedCodes.map(code => ({ id: code, text: code })));
    }

    return dropdownOptions;
  }


  private generateAlphabetCombinations(length: number): string[] {
    const result: string[] = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const generate = (prefix = '', depth = 0) => {
      if (depth === length) {
        result.push(prefix);
        return;
      }
      for (let i = 0; i < letters.length; i++) {
        generate(prefix + letters[i], depth + 1);
      }
    };

    for (let i = 1; i <= length; i++) {
      if (i === 1) {
        result.push(...letters.split(''));
      } else {
        generate('', 0);
      }
    }

    return result;
  }

  private generateNumberCombinations(length: number): string[] {
    const result: string[] = [];
    const max = Math.pow(10, length);

    for (let i = 1; i < max; i++) {
      result.push(i.toString());
    }

    return result;
  }

}
