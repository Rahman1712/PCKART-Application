import { Component ,OnInit,ViewChild} from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../_services/image-processing-service.service';
import { Category } from '../_model-dto/category/category';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AdminsService } from '../_services/admins.service';
import { CategoryViewComponent } from './category-view/category-view.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit{
  @ViewChild(MatPaginator) static paginatorValue: MatPaginator;

  constructor(private productService: ProductService,
    private adminService: AdminsService,
    private imageProcessingService: ImageProcessingService,
    public dialog: MatDialog,
    ){}

  ngOnInit(): void {
    this.getCategories();
  }

  categoriesList: Category[];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','name','preview', 'parent', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchText: string;
  currentPage = 5;
  pageItemNum = 5;

  public popoverTitle: string = 'Delete Category';
  public popoverMessage: string = 'Would you like to delete category?'
  public cancelClicked: boolean = false;
  public confirmClicked: boolean = false;

  dialogRef: MatDialogRef<CategoryViewComponent> | null;

  public getCategories(): void{
    this.productService.getAllCategoriesWithImgs()
    .pipe(
      map((categories: Category[] , i) => 
        categories.map((category: Category) => 
          this.imageProcessingService.createCategoryImage(category)
        )
      )
    )
    .subscribe({
      next: (next: Category[]) =>{
        console.log(next)
        this.categoriesList = next;
        this.dataSource = new MatTableDataSource<Category>(this.categoriesList);
        this.dataSource.paginator = this.paginator;
        CategoriesComponent.paginatorValue = this.paginator;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message)
      }
    });
  }

  showCategoryDetails(category: Category){
    this.dialogRef = this.dialog.open(CategoryViewComponent, {
      disableClose: false,
      width: "60%",
      height: '400px',
    });
    this.dialogRef.componentInstance.category = category;
    this.dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('dialog closed')
      }
      this.dialogRef = null;
    });
  }

  removeCategoryItem(categoryId: number,index: number){
    this.adminService.deleteCategoryById(categoryId)
    .subscribe({
      next: (next: any) =>{
        this.categoriesList?.splice(index, 1);
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }
}
