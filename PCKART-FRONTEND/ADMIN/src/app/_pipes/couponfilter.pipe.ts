import { Pipe, PipeTransform } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CouponsComponent } from '../coupons/coupons.component';

@Pipe({
  name: 'couponfilter'
})
export class CouponFilterPipe implements PipeTransform {

  transform(value: any, sName: string): any {
    // console.log(value)
    // console.log("====")
    if(sName==="" || sName==null || sName==undefined){
      return value;
    }

    let len = value.filteredData.length;
    const couponsArray:any = new MatTableDataSource<any>();
   
    for(let i=0; i<len; i++){
      let categoryName:string=value.filteredData[i].name;
      if(categoryName.toLowerCase().startsWith(sName.toLowerCase())){
        couponsArray.filteredData.push(value.filteredData[i])
      }
    }
    couponsArray.paginator =  CouponsComponent.paginatorValue;
    return couponsArray;
  }

}
