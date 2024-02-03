import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserDTO } from '../_model-dto/user/user-dto';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Coupon } from '../_model-dto/coupon/coupon';
import { WalletTransactionType } from '../_model-dto/order/wallet-transaction-type';
import { OrderDTO } from '../_model-dto/order/order-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiAdminUserUrl = environment.apiAdminUserUrl;
  private apiAdminCouponUrl = environment.apiAdminCouponUrl;
  private apiAdminUserPaymentUrl = environment.apiAdminUserPaymentUrl;

  private apiUserPublicAuthUrl = environment.apiUserPublicAuthUrl;

  constructor(private http: HttpClient) { }

  /* ============================= USER =========================================== */
  public getAllUsers(): Observable<UserDTO[]>{
    return this.http.get<UserDTO[]>(`${this.apiAdminUserUrl}/getall`);
  }

  public getUserById(id: number): Observable<UserDTO>{
    return this.http.get<UserDTO>(`${this.apiAdminUserUrl}/getbyid/${id}`);
  }

  public updateEnabledAndNonLocked(userId: number, nonlocked: boolean): Observable<string>{
    const url = `${this.apiAdminUserUrl}/update/nonlocked/byid/${userId}`; 
    const params = new HttpParams().set('nonlocked', nonlocked);
    // const params = { nonLocked: String(admin.nonLocked) };
    return this.http.put(url, null,{params: params, responseType: 'text' });
  }
  /* ============================= COUPON ===================================== */
  public getAllCoupons(): Observable<Coupon[]>{
    return this.http.get<Coupon[]>(`${this.apiAdminCouponUrl}/getall`);
  } 

  public addCoupon(coupon: Coupon): Observable<Coupon>{
    return this.http.post<Coupon>(`${this.apiAdminCouponUrl}/save`, coupon);
  }

  public updateCouponDataByCouponId(couponId: number, code: string, discount: number, validupto: string): Observable<string>{
    const url = `${this.apiAdminCouponUrl}/update/coupondata/byid/${couponId}`; 
    const params = new HttpParams()
      .set('code', code).set('discount', discount)
      .set('validupto', validupto);  //.set('validupto', dateString);
    // const params = { nonLocked: String(admin.nonLocked) };
    return this.http.put(url, null,{params: params, responseType: 'text' });
  }
  // public updateCouponDataByCouponId(couponId: number, code: string, discount: number, validupto: Date): Observable<string>{
  //   const dateString = validupto.toISOString();
  //   const url = `${this.apiAdminCouponUrl}/update/coupondata/byid/${couponId}`; 
  //   const params = new HttpParams()
  //     .set('code', code).set('discount', discount)
  //     .set('validupto', dateString);  //.set('validupto', dateString);
  //   // const params = { nonLocked: String(admin.nonLocked) };
  //   return this.http.put(url, null,{params: params, responseType: 'text' });
  // }

  public updateCouponEnabled(couponId: number, enabled: boolean ): Observable<string>{
    const url = `${this.apiAdminCouponUrl}/update/enabled/byid/${couponId}`; 
    const params = new HttpParams().set('enabled', enabled);
    return this.http.put(url, null,{params: params, responseType: 'text' });
  }
  /* ============================= PAYMENT CREDIT TO USER BY RETURN ORDER ===================================== */
  public creditToUserByUserId(userId: number, amount: number, walletTransactionType: WalletTransactionType ): Observable<string>{
    const url = `${this.apiAdminUserPaymentUrl}/credit/byUserId/${userId}`; 
    const params = new HttpParams().set('amount', amount).set('walletTransactionType',walletTransactionType);
    return this.http.put(url, null,{params: params, responseType: 'text' });
  }

  /* =============================  =========================================== */


  /* ========================== COUNT GET , SUM =============================== */
  public countOfUsers(): Observable<number> {
    return this.http.get<number>(`${this.apiUserPublicAuthUrl}/get/user-count`);
  }
  public countOfOrders(): Observable<number> {
    return this.http.get<number>(`${this.apiUserPublicAuthUrl}/get/order-count`);
  }

  public getTotalSumOfPaidTotalPrice(): Observable<number> {
    return this.http.get<number>(`${this.apiUserPublicAuthUrl}/get/order-revenue`);
  }
  /* ========================== TOP ORDERS BY LIMIT =============================== */
  public getTopLimitOrdersByOrderDate(limit: number): Observable<OrderDTO[]>{
    return this.http.get<OrderDTO[]>(`${this.apiUserPublicAuthUrl}/get/recent-orders/${limit}`);
  }


  public getDailyOrderDetails(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUserPublicAuthUrl}/get/orders/byday`);
  }
  public getWeekOrderDetails(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUserPublicAuthUrl}/get/orders/byweek`);
  }
  public getMonthlyOrderDetails(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUserPublicAuthUrl}/get/orders/bymonth`);
  }
  public getYearlyOrderDetails(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUserPublicAuthUrl}/get/orders/byyear`);
  }


  public getMostSellProducts(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUserPublicAuthUrl}/get/orders-most`);
  }
  public getMostOrderProductsQuantity(limit: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUserPublicAuthUrl}/get/orders-more-qty/${limit}`);
  }

  public getOrderStatusCounts(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUserPublicAuthUrl}/get/order-status-count`);
  }

  public getDayOrderAllDetails(duration:any): Observable<any[]>{
    const params = {
      duration: duration,
    };
    return this.http.get<any[]>(`${this.apiUserPublicAuthUrl}/get/orders-all`,{params});
  }

  public getDayOrderAllDetailsPagination(pageNum:number,limit:number,sortField:string, sortDir:string, duration:any): Observable<any>{
    const params = {
      limit: limit,
      sortField: sortField,
      sortDir: sortDir,
      duration: duration,
    };
    return this.http.get<any>(`${this.apiUserPublicAuthUrl}/get/orders-all-page/${pageNum}`,{params});
  }
}
