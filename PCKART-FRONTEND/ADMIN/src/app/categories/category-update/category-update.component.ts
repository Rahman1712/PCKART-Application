import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductService } from 'src/app/_services/product.service';
import { Category } from 'src/app/_model-dto/category/category';
import { FileHandle } from 'src/app/_model-dto/file-handle.model';
import { map } from 'rxjs';
import { ImageProcessingService } from 'src/app/_services/image-processing-service.service';
import { AdminsService } from 'src/app/_services/admins.service';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css']
})
export class CategoryUpdateComponent implements OnInit {

  constructor(private productService: ProductService,
    private adminService: AdminsService,
    private sanitizer: DomSanitizer,
    private imageProcessingService: ImageProcessingService,
    private route: ActivatedRoute,
    private router: Router){}

  category: Category = new Category();
  categoryImageFile: FileHandle | undefined;
  categoryParentsList: Category[] = [];
  categoryId: number;

  ngOnInit(): void {
    this.getCategoryParents();
    this.route.params.subscribe(params => {
      // this.productId = params['id'];
       this.categoryId =  Number(params['id']);
       this.getCategoryById(this.categoryId);
    })
  }

  getCategoryById(categoryId: number){
    this.productService.getCategoryById(categoryId)
    .pipe(
      map((category: Category) => 
        this.imageProcessingService.createCategoryImage(category)
      )
    )
    .subscribe({
      next: (next: Category) =>{
        this.category = next;
        this.categoryImageFile = this.category.categoryImage;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    });
  }

  getCategoryParents(){
    this.productService.getAllParentCategories()
    .subscribe({
      next: (next: Category[]) =>{
        this.categoryParentsList = next;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message)
      }
    });
  }

  updateCategory(categoryForm: NgForm, categoryId: number){   
    const formData =  this.prepareFormData(this.category);

    this.adminService.updateCategoryById(formData, categoryId ).subscribe({
      next: (next : string) => {
        this.clearForm(categoryForm);
        //this.getCategoryParents();
        this.router.navigate(['/categories']);
      },
      error : (error: HttpErrorResponse) =>{
        console.log(error)
      }
    });
  }


  prepareFormData(category: Category): FormData{
    const formData = new FormData();

    formData.append(
      'category', 
      new Blob([JSON.stringify(category)], {
        type: 'application/json'
      })
    );

    formData.append(
      'file', 
      this.categoryImageFile!.file,
      this.categoryImageFile!.file.name,
    );
    
    return formData;
  }


  onFileSelected(event: any){
    if(event.target.files){
      const file = event.target.files[0];

      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
          )
      }

      this.categoryImageFile = fileHandle;
    }
  }

  clearForm(categoryForm: NgForm){
    categoryForm.reset();
    this.categoryImageFile = undefined;
  }

  fileDropped(fileHandle: FileHandle){
    this.categoryImageFile = fileHandle;
  }
}
