import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToInteger'
})
export class NumberToIntegerPipe implements PipeTransform {

  transform(value:number): number {
    return Math.floor(value);
  }

}
