import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/_model-dto/category/category';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent {

  constructor(public dialogRef: MatDialogRef<CategoryViewComponent>){}
  
  public category: Category ;
}
