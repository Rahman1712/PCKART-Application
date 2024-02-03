import { Pipe, PipeTransform } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriesComponent } from '../categories/categories.component';

@Pipe({
  name: 'categoryfilter'
})
export class CategoryfilterPipe implements PipeTransform {

  transform(value: any, sName: string): any {
    // console.log(value)
    // console.log("====")
    if(sName==="" || sName==null || sName==undefined){
      return value;
    }

    let len = value.filteredData.length;
    const categoriesArray:any = new MatTableDataSource<any>();
   
    for(let i=0; i<len; i++){
      let categoryName:string=value.filteredData[i].name;
      if(categoryName.toLowerCase().startsWith(sName.toLowerCase())){
        categoriesArray.filteredData.push(value.filteredData[i])
      }
    }
    categoriesArray.paginator =  CategoriesComponent.paginatorValue;
    return categoriesArray;
  }


}
