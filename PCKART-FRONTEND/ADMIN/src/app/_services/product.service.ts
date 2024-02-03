import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductResponse } from '../_model-dto/product/productResponse';
import { BrandResponse } from '../_model-dto/brand/brandResponse';
import { Category } from '../_model-dto/category/category';
import { ProductDTO } from '../_model-dto/product/productDTO';
import { CategoryResponse } from '../_model-dto/category/categoryResponse';
import { Brand } from '../_model-dto/brand/brand';
import { ProductPagination } from '../_model-dto/product/productPagination';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiProductUrl = environment.apiProductUrl;
  private apiBrandUrl = environment.apiBrandUrl;
  private apiCategoryUrl = environment.apiCategoryUrl;

  constructor(private http: HttpClient) { }
/* ========================== PRODUCT GET ==================================== */
  public getProducts(): Observable<ProductResponse[]>{
    return this.http.get<ProductResponse[]>(`${this.apiProductUrl}/get/all-products`);
  }

  public getProductResponseById(productId: number): Observable<ProductResponse>{
    return this.http.get<ProductResponse>(`${this.apiProductUrl}/get/product-res/${productId}`);
  }
  
  public getAllProductsWithImages(): Observable<ProductDTO<any,any>[]>{
    return this.http.get<ProductDTO<any,any>[]>(`${this.apiProductUrl}/get/all-product-imgs`);
  }

  public getProductByIdWithImages(productId: number): Observable<ProductDTO<any,any>>{
    return this.http.get<ProductDTO<any,any>>(`${this.apiProductUrl}/get/product-imgs/${productId}`);
  }

  public getTopLimitProductsWithImagesByAddedAt(limit: number): Observable<ProductDTO<any,any>[]>{
    return this.http.get<ProductDTO<any,any>[]>(`${this.apiProductUrl}/get/recent-products/limit/${limit}`);
  }

  public getProductDetailsMainImageById(productId: number): Observable<ProductDTO<any,any>>{
    return this.http.get<ProductDTO<any,any>>(`${this.apiProductUrl}/get/product/${productId}`);
  }

  /* ========================== PRODUCTS GET BY SEARCK KEYWORD AND LIMIT=============================== */
  public getAllProductsByKeywordAndLimitWithImages(searchKeyword: string, limit: number):Observable<ProductDTO<any,any>[]>{
    const params = {
      searchKeyword: searchKeyword,
      limit: limit,
    }
    return this.http.get<ProductDTO<any,any>[]>(`${this.apiProductUrl}/get/all/bySearch_and_Limit`, {params: params});
  }
  public getAllProductsByKeywordAndLimit(searchKeyword: string, limit: number):Observable<ProductResponse[]>{
    const params = {
      searchKeyword: searchKeyword,
      limit: limit,
    }
    return this.http.get<ProductResponse[]>(`${this.apiProductUrl}/get/all/prod-res/bySearch_and_Limit`, {params: params});
  }
  // ========================= Products GET Quantity=====================
  public getProductsWithQuantitySort( limit: number, sort: string,):Observable<ProductDTO<any,any>[]>{
    const params = {
      sort: sort,
    }
    return this.http.get<ProductDTO<any,any>[]>(`${this.apiProductUrl}/getprod/quantitySort/${limit}`, {params: params});
  }
/* ========================== BRAND GET ==================================== */
  public getAllBrandsWithOutImgs(): Observable<BrandResponse[]>{
    return this.http.get<BrandResponse[]>(`${this.apiBrandUrl}/get/all-brands-noimage`);
  }
  
  public getAllBrandsWithImgs(): Observable<Brand[]>{
    return this.http.get<Brand[]>(`${this.apiBrandUrl}/get/all-brands`);
  }

  public getBrandById(brandId: number): Observable<Brand>{
    return this.http.get<Brand>(`${this.apiBrandUrl}/get/byid/${brandId}`);
  }
/* ========================== CATEGORY GET ==================================== */
  public getAllCategoriesWithOutImgs(): Observable<CategoryResponse[]>{
    return this.http.get<CategoryResponse[]>(`${this.apiCategoryUrl}/get/all-categories-noimage`);
  }

  public getAllCategoriesWithImgs(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiCategoryUrl}/get/all-categories`);
  }
  
  public getAllParentCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiCategoryUrl}/get/all-parent-categories`);
  }

  public getCategoryById(categoryId: number): Observable<Category>{
    return this.http.get<Category>(`${this.apiCategoryUrl}/get/byid/${categoryId}`);
  }

/* ========================== PRODUCT PAGINATION GET =============================== */
  ///get/page-imgs/1?sortField=name&sortDir=asc&limit=5
  public getProductsWithImagesAndPagination(pageNum:number,limit:number,sortField:string, sortDir:string, searchKeyword:string): Observable<ProductPagination<ProductDTO<any,any>>>{
    const params = new HttpParams()
      .set('limit',limit).set('sortField',sortField)
      .set('sortDir',sortDir).set('searchKeyword',searchKeyword);
    
      return this.http.get<ProductPagination<ProductDTO<any,any>>>(`${this.apiProductUrl}/get/page-imgs/${pageNum}`,{params});
  }
/* ========================== COUNT GET =============================== */
  public countOfProducts(): Observable<string> {
    return this.http.get(`${this.apiProductUrl}/get/product-count`, { responseType: 'text' });
  }

  public countOfProductsByCategoryName(categoryName: string): Observable<string> {
    return this.http.get(`${this.apiProductUrl}/get/product-count/by-category-name/${categoryName}`, { responseType: 'text' });
  }
/* ==========================  =============================== */
  
}
