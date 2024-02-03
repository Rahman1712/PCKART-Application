import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ProductResponse } from '../_model-dto/product/productResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductDTO } from '../_model-dto/product/productDTO';
import { MatDialog } from '@angular/material/dialog';
import { ImageProcessingService } from '../_services/image-processing-service.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { ProductPagination } from '../_model-dto/product/productPagination';
import { AdminsService } from '../_services/admins.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  public products: ProductResponse[] | undefined;
  public productDtoById : ProductDTO<any,any>;
  
  public popoverTitle: string = 'Delete Product';
  public popoverMessage: string = 'Would you like to delete product?'
  public cancelClicked: boolean = false;
  public confirmClicked: boolean = false;
  
  public productsPagination: ProductPagination<ProductDTO<any,any>>;
  
  public productsListImgs: ProductDTO<any,any>[] | undefined;
  public pageNum: number = 1;
  public limit: number = 10;
  public sortField: string = 'added_at';
  public sortDir: string = 'desc';
  public totalItems: number;
  public reverseSortDir: string;
  public totalPages: number;
  public startCount: number;
  public endCount: number;
  public searchKeyword: string = '';

  constructor(private productService: ProductService, 
    private adminService: AdminsService,
    public dialog: MatDialog,
    private imageProcessingService: ImageProcessingService,
    private router: Router
  ){}
  
  ngOnInit(): void {
      // this.getAllProductsWithImages();
      this.getProductsWithPagination(this.pageNum,this.limit,this.sortField,this.sortDir);
  }

  searchOperation(){
    this.getProductsWithPagination(this.pageNum,this.limit,this.sortField,this.sortDir);
  }

  // to create 1 to totalNum sequence array
  range(totalNum: number): number[]{
    return Array(totalNum).fill(0).map((x,index) => index + 1);
  }
  rangeStart(start:number, totalNum: number): number[]{
    return Array(totalNum-start).fill(0).map((x,index) => index + 1+ start);
  }

  public getProductsWithPagination(pageNum:number,limit: number, sortField: string, sortDir: string){
    this.productService.getProductsWithImagesAndPagination(pageNum,limit,sortField,sortDir, this.searchKeyword)
    .pipe(
      map((prodPage:ProductPagination<ProductDTO<any,any>>) =>
        this.imageProcessingService.createImagesToPagination(prodPage)
      )
    )
    .subscribe({
      next: (next: ProductPagination<ProductDTO<any, any>>) =>{
        console.log(next);
        this.productsPagination = next;
       
        this.productsListImgs = this.productsPagination.listProducts;
        this.pageNum = this.productsPagination.pageNum;
        this.limit = this.productsPagination.limit;
        this.sortField = this.productsPagination.sortField;
        this.sortDir = this.productsPagination.sortDir;
        this.totalItems = this.productsPagination.totalItems;
        this.reverseSortDir = this.productsPagination.reverseSortDir;
        this.totalPages = this.productsPagination.totalPages;
        this.startCount = this.productsPagination.startCount;
        this.endCount = this.productsPagination.endCount;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    });
  }

  public getAllProductsWithImages(): void{
    this.productService.getAllProductsWithImages()
    .pipe(
      map((x: ProductDTO<any,any>[] , i) => 
        x.map((product: ProductDTO<any,any>) => 
          this.imageProcessingService.createMainImageToProdDto(product)
        )
      )
    )
    .subscribe({
      next: (next: ProductDTO<any,any>[]) =>{
        console.log(next)
        this.productsListImgs = next;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message)
      }
    });
  }

  public getProductDetailsWithImagesById(productId : number): any{
    this.productService.getProductByIdWithImages(productId)
    .pipe(
      map((product: ProductDTO<any,any>) => 
        this.imageProcessingService.createMainAndSubImagesToProdDto(product)
      )
    )
    .subscribe({
      next: (next: ProductDTO<any,any>) =>{
        console.log(next)
        // this.productDtoById = next
        return next
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message)
        return null
      }
    });
  }

  showProductDetails(productId: number) {
    this.router.navigate(['/product-view',{productId: productId}]); 
  }
  
  updateProductDetails(productId: number){
    this.router.navigate(['/product-update', {productId: productId}]);
  }

  removeProductItem(productId: number, index: number){
    this.adminService.deleteProductById(productId)
    .subscribe({
      next: (next: any) =>{
        this.productsListImgs?.splice(index, 1);
        this.ngOnInit();
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }

  updateActive(productId: number, active: boolean){
    this.adminService.updateProductActiveById(productId,active)
    .subscribe({
      next: (next: any) =>{
        console.log(next)
        // this.ngOnInit();
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }
}
