import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ProductResponse } from '../_model-dto/product/productResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductDTO } from '../_model-dto/product/productDTO';
import { AdminsService } from '../_services/admins.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageProcessingService } from '../_services/image-processing-service.service';
import { ProductPagination } from '../_model-dto/product/productPagination';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit{

  public products: ProductResponse[] | undefined;
  public productDtoById : ProductDTO<any,any>;

  public productResponseEdit : ProductResponse | undefined;
  public newProductQuantity: number = 1;
  public productsSearchList: ProductDTO<any,any>[] = [];

  public productsPagination: ProductPagination<ProductDTO<any,any>>;
  
  public productsListImgs: ProductDTO<any,any>[] | undefined;
  public pageNum: number = 1;
  public limit: number = 10;
  public sortField: string = 'quantity';
  public sortDir: string = 'asc';
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
    private router: Router,
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

  updateProductStock(productResponse: ProductResponse, stockEditBtn: any){
    this.productResponseEdit = productResponse;
    stockEditBtn.click();
  }

  searchProductOperation(){
    if(this.searchKeyword.trim() != ''){
      this.getAllProductsBySearchKeywordAndLimit();
    }else{
      this.productsSearchList = [];
    }
  }
  public getAllProductsBySearchKeywordAndLimit(): void {
    this.productService.getAllProductsByKeywordAndLimitWithImages(this.searchKeyword, this.limit)
    .pipe(
      map((x: ProductDTO<any,any>[] , i) => 
        x.map((product: ProductDTO<any,any>) => {
          return this.imageProcessingService.createMainImageToProdDto(product)
        })
      )
    )
    .subscribe({
      next: (searchList: ProductDTO<any,any>[]) =>{
        console.log(searchList)
        this.productsSearchList = searchList;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message)
      }
    });
  }

  addQuantity(stockViewBtn: any){
    const qty =  this.productResponseEdit!.productQuantity + this.newProductQuantity ;
    // alert(qty)
    this.adminService.updateProductQuantiyById(this.productResponseEdit!.productId, qty)
    .subscribe({
      next: (res: string) => {
        console.log(res);
        this.newProductQuantity = 1;
        this.productResponseEdit = undefined;
        this.searchKeyword = '';
        this.ngOnInit();
        stockViewBtn.click();
      },
      error: error => console.log(error)
    });
  }
  removeQuantity(stockViewBtn: any){
    const qty = (this.productResponseEdit!.productQuantity - this.newProductQuantity) < 0 ? 0 : (this.productResponseEdit!.productQuantity - this.newProductQuantity);
    // alert(qty)
    this.adminService.updateProductQuantiyById(this.productResponseEdit!.productId, qty)
    .subscribe({
      next: (res: string) => {
        console.log(res);
        this.newProductQuantity = 1;
        this.productResponseEdit = undefined;
        this.searchKeyword = '';
        this.ngOnInit();
        stockViewBtn.click();
      },
      error: error => console.log(error)
    });
  }

}
