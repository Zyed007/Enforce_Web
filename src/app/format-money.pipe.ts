import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMoney'
})
export class FormatMoneyPipe implements PipeTransform {
  transform(number: any): string {
    if (number != null) {
      const numberStr = number.toFixed(2);
      const [integerPart, decimalPart] = numberStr.split('.');
      const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return `${integerWithCommas}.${decimalPart}`;
    } else {
      return '0.00';
    }
  }
}
