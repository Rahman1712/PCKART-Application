import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryResponse } from '../_model-dto/category/categoryResponse';
import { CategoryHierarchy } from '../_model-dto/category/categoryHierarchy';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CategorylistService {

  constructor(private productService: ProductService) { }

  public createCategoryListHierarchy(categoryList: CategoryResponse[]): CategoryHierarchy<CategoryResponse>[]{
    // Reorder the data array
    categoryList.sort((a, b) => {
      if (a.parentid === null && b.parentid !== null) {
        return -1; // Move 'Component' to the front
      } else if (a.parentid !== null && b.parentid === null) {
        return 1; // Move 'Peripheral' to the front
      }
      return 0; // Maintain the order of other items
    });

    const hierarchyList = this.createHierarchy(categoryList, null);
    // console.log(JSON.stringify(hierarchyList, null, 2));
    
    return hierarchyList;
  }

  private createHierarchy(categoryList: CategoryResponse[], parentId: number | null):CategoryHierarchy<CategoryResponse>[] {

    const hierarchy : CategoryHierarchy<CategoryResponse>[]= [];
    for (const category of categoryList) {
      if (category.parentid === parentId) {
        const newItem: CategoryHierarchy<CategoryResponse> = {
          parent: category,
          children: this.createHierarchy(categoryList, category.id)
        };
        hierarchy.push(newItem);
      }
    }
    return hierarchy;
  }
}
