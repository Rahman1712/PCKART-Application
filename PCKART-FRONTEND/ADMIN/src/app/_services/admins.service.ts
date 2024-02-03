import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductDetails } from '../_model-dto/product/productDetails';
import { Brand } from '../_model-dto/brand/brand';
import { Category } from '../_model-dto/category/category';
import { Admin } from '../_model-dto/admin/admin';
import { AuthenticationResponse } from '../_model-dto/admin/authenticationResponse';
import { AdminDetails } from '../_model-dto/admin/adminDetails';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {
  private apiAdminPrivateUrl = environment.apiAdminPrivateUrl;
  private apiAdminProductUrl = environment.apiAdminProductUrl;
  private apiAdminBrandUrl = environment.apiAdminBrandUrl;
  private apiAdminCategoryUrl = environment.apiAdminCategoryUrl;

  constructor(private http: HttpClient) { }

/* ============================= ADMIN =========================================== */
  public getAdminById(adminId: number): Observable<Admin>{
    return this.http.get<Admin>(`${this.apiAdminPrivateUrl}/get/byId/${adminId}`);
  }

  public getAdminByUsername(adminUsername: string): Observable<Admin>{
    return this.http.get<Admin>(`${this.apiAdminPrivateUrl}/get/byUsername/${adminUsername}`);
  }

  public getAllAdmins(): Observable<Admin[]>{
    return this.http.get<Admin[]>(`${this.apiAdminPrivateUrl}/get/allAdmins`);
  }

  public addAdmin(adminUser: AdminDetails): Observable<AuthenticationResponse>{
    return this.http.post<AuthenticationResponse>(`${this.apiAdminPrivateUrl}/save`, adminUser);
  }

  public updateAdminDetails(adminId: number, formData: FormData): Observable<string> {
    return this.http.put(`${this.apiAdminPrivateUrl}/update/byId/${adminId}`, formData,{ responseType: 'text' })
  }

  public updateEnabledAndNonLocked(admin: Admin): Observable<string>{
    const url = `${this.apiAdminPrivateUrl}/update/enableAndLock/byid/${admin.id}`; 
    const params = {
      enabled: String(admin.enabled),
      nonLocked: String(admin.nonLocked)
    };
    return this.http.put(url, null,{params: params, responseType: 'text' });
  }

  public updatePasswordById(admin: Admin, currentPassword: string, newPassword:string )
  : any  //: Observable<string>
  {
    const url = `${this.apiAdminPrivateUrl}/update/password/byId/${admin.id}`; 
    const params = {
      currentPassword: currentPassword,
      newPassword: newPassword
    };
    // return this.http.put(url, null,{params: params, responseType: 'text' });
    return this.http.put(url, null,{params: params, responseType: 'text' });
  }

  public deleteAdminById(adminId: number): Observable<string> {
    return this.http.delete(`${this.apiAdminPrivateUrl}/delete/byId/${adminId}`, { responseType: 'text' });
  }

/* ============================= PRODUCT =========================================== */
  public addProduct(formData: FormData): Observable<ProductDetails>{
    return this.http.post<ProductDetails>(`${this.apiAdminProductUrl}/save`, formData);
  }

  public updateProductById(formData: FormData, productId: number): Observable<ProductDetails>{
    return this.http.put<ProductDetails>(`${this.apiAdminProductUrl}/update/${productId}`, formData);
  }

  public updateProductQuantiyById(productId: number, quantity: number): Observable<string>{
    const params = { quantity: quantity, };
    return this.http.put(`${this.apiAdminProductUrl}/auth/change-quantity/${productId}`,null,{params: params, responseType: 'text' });
  }
  
  public deleteProductById(productId: number): Observable<string> {
    return this.http.delete(`${this.apiAdminProductUrl}/delete/${productId}`, { responseType: 'text' });
  }
/*
  public updateProductActiveById(productId: number, active: boolean): Observable<string>{
    // const params = new HttpParams().set('active',String(active));
    return this.http.put<string>(`${this.apiAdminProductUrl}/update-active/id/${productId}/active/${active}`,{  responseType: 'text' });
  }
  */
  public updateProductActiveById(productId: number, active: boolean)
  : any  //: Observable<string>
  {
    const url = `${this.apiAdminProductUrl}/update-active/${productId}`; 
    const params = {
      active: active,
    };
    // return this.http.put(url, null,{params: params, responseType: 'text' });
    return this.http.put(url, null,{params: params, responseType: 'text' });
  }
  
  /* ============================= BRAND =========================================== */  
  public addBrand(formData: FormData): Observable<Brand>{
    return this.http.post<Brand>(`${this.apiAdminBrandUrl}/save`, formData);
  }

  public updateBrandById(formData: FormData, brandId: number): Observable<string>{
    return this.http.put(`${this.apiAdminBrandUrl}/update/${brandId}`, formData, { responseType: 'text' });
  }

  public deleteBrandById(brandId: number): Observable<string> {
    return this.http.delete(`${this.apiAdminBrandUrl}/delete/${brandId}`, { responseType: 'text' });
  }

 /* ============================= CATEGORY =========================================== */ 
  public addCategory(formData: FormData): Observable<Category>{
    return this.http.post<Category>(`${this.apiAdminCategoryUrl}/save`, formData);
  }

  public updateCategoryById(formData: FormData, categoryId: number): Observable<string>{
    return this.http.put(`${this.apiAdminCategoryUrl}/update/${categoryId}`, formData, { responseType: 'text' });
  }

  public deleteCategoryById(categoryId: number): Observable<string> {
    return this.http.delete(`${this.apiAdminCategoryUrl}/delete/${categoryId}`, { responseType: 'text' });
  }

/* =============================  =========================================== */

}
