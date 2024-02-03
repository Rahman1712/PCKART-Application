import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderfilter'
})
export class OrderfilterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
