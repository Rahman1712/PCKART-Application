import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../_model-dto/order/order';
import { PaymentStatus } from '../_model-dto/order/payment-status';
import { OrderStatus } from '../_model-dto/order/order-status';
import { TrackStatus } from '../_model-dto/order/track-status';
import { OrderPagination } from '../_model-dto/order/orderPagination';
import { PaymentMethod } from '../_model-dto/order/payment-method';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiAdminOrderUrl = environment.apiAdminOrderUrl;
  constructor(private http: HttpClient) { }

  /* ========================== ORDERS GET ==================================== */
  public getAllOrders(): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiAdminOrderUrl}/get/allOrders`);
  }

  public getOrdersByLimit(limit: number): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiAdminOrderUrl}/get/orders/bylimit/${limit}`);
  }

  public getOrderByOrderId(orderId: string): Observable<Order>{
    return this.http.get<Order>(`${this.apiAdminOrderUrl}/get/order/byid/${orderId}`);
  }

  public getOrdersByUserId(userId: number): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiAdminOrderUrl}/get/orders/byUserId/${userId}`);
  }

  public getOrdersByTrackingNo(trackingNo: string): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiAdminOrderUrl}/get/order/byTrackingNo/${trackingNo}`);
  }

/* ========================== ORDERS UPDATE ==================================== */
  public updatePaymentStatusById(orderId: string, payment_status: PaymentStatus):Observable<string>{
    const params = { payment_status: payment_status,};
    return this.http.put(`${this.apiAdminOrderUrl}/update/payment_status/byid/${orderId}`, null, {params: params, responseType: 'text'})
  }

  public updateOrderStatusById(orderId: string, order_status: OrderStatus):Observable<string>{
    const params = { order_status: order_status,};
    return this.http.put(`${this.apiAdminOrderUrl}/update/order_status/byid/${orderId}`, null, {params: params, responseType: 'text'})
  }

  public updateTrackStatusById(orderId: string, track_status: TrackStatus):Observable<string>{
    return this.http.put(`${this.apiAdminOrderUrl}/update/track_status/byid/${orderId}`, track_status, {responseType: 'text'})
  }

  public returnOrderConfirmed(order: Order):Observable<string>{
    return this.http.put(`${this.apiAdminOrderUrl}/update/return-order`, order, {responseType: 'text'})
  }

  /* ========================== ORDER PAGINATION GET =============================== */
  ///get/page-imgs/1?sortField=name&sortDir=asc&limit=5
  public getOrdersWithPagination(pageNum:number,limit:number,sortField:string, sortDir:string, searchKeyword:string,
    orderStatusList: OrderStatus[], paymentStatusList: PaymentStatus[], paymentMethodList: PaymentMethod[]): Observable<OrderPagination>{
    
      const params = {
        limit: limit,
        sortField: sortField,
        sortDir: sortDir,
        searchKeyword: searchKeyword,
        orderStatusList: orderStatusList,
        paymentStatusList: paymentStatusList,
        paymentMethodList: paymentMethodList,
      };

    return this.http.get<OrderPagination>(`${this.apiAdminOrderUrl}/get/orders-page/${pageNum}`,{params});
  }
}


/*
let params = new HttpParams()
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortDir', sortDir)
      .set('searchKeyword', searchKeyword);
  
    for (const orderStatus of orderStatusList) {
      params = params.append('orderStatusList', orderStatus);
    }
  
    for (const paymentStatus of paymentStatusList) {
      params = params.append('paymentStatusList', paymentStatus);
    }
  
    for (const paymentMethod of paymentMethodList) {
      params = params.append('paymentMethodList', paymentMethod);
    }

*/