import { Pipe, PipeTransform } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BrandsComponent } from '../brands/brands.component';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any, sName: string): any {
    // console.log(value)
    // console.log("====")
    if(sName==="" || sName==null || sName==undefined){
      return value;
    }

    let len = value.filteredData.length;
    const brandsArray:any = new MatTableDataSource<any>();
   
    brandsArray.paginator =  BrandsComponent.paginatorValue;
    for(let i=0; i<len; i++){
      let brandName:string=value.filteredData[i].name;
      if(brandName.toLowerCase().startsWith(sName)){
        brandsArray.filteredData.push(value.filteredData[i])
      }
    }
    return brandsArray;
  }

}
