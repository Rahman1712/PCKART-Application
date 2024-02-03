import { Pipe, PipeTransform } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BrandsComponent } from '../brands/brands.component';

@Pipe({
  name: 'brandfilter'
})
export class BrandfilterPipe implements PipeTransform {

  transform(value: any, sName: string): any {
    // console.log(value)
    // console.log("====")
    if(sName==="" || sName==null || sName==undefined){
      return value;
    }

    let len = value.filteredData.length;
    const brandsArray:any = new MatTableDataSource<any>();
   
    
    for(let i=0; i<len; i++){
      let brandName:string=value.filteredData[i].name;
      if(brandName.toLowerCase().startsWith(sName.toLowerCase())){
        brandsArray.filteredData.push(value.filteredData[i])
      }
    }
    brandsArray.paginator =  BrandsComponent.paginatorValue;
    //console.log(brandsArray)

    return brandsArray;
  }


}
