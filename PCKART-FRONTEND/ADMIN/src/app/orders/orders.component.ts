import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { Order } from '../_model-dto/order/order';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderStatus } from '../_model-dto/order/order-status';
import { UserService } from '../_services/user.service';
import {map} from 'rxjs';
import { UserDTO } from '../_model-dto/user/user-dto';
import { OrderPagination } from '../_model-dto/order/orderPagination';
import { PaymentStatus } from '../_model-dto/order/payment-status';
import { PaymentMethod } from '../_model-dto/order/payment-method';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{

  public ordersList: Order[] = [];
  public pageNum: number = 1;
  public limit: number = 10;
  public sortField: string = 'orderDate';
  public sortDir: string = 'desc';
  public totalItems: number;
  public reverseSortDir: string;
  public totalPages: number;
  public startCount: number;
  public endCount: number;
  public searchKeyword: string = '';

  orderStatuses = Object.values(OrderStatus);
  paymentStatuses = Object.values(PaymentStatus);
  paymentMethods = Object.values(PaymentMethod);
  
  public orderStatusList: OrderStatus[] =[
    OrderStatus.CANCELLED, OrderStatus.DELIVERED, OrderStatus.ORDERED, 
    OrderStatus.PROCESSING, OrderStatus.RETURNED, OrderStatus.SHIPPED,
    OrderStatus.RETURN_REQUESTED
  ];
  public paymentStatusList: PaymentStatus[] = [
    PaymentStatus.CANCELLED,PaymentStatus.PAID,PaymentStatus.PENDING,PaymentStatus.REFUNDED
  ];
  public paymentMethodList: PaymentMethod[] = [
    PaymentMethod.CASH_ON_DELIVERY, PaymentMethod.ONLINE, PaymentMethod.WALLET
  ];

  public ordersPagination: OrderPagination;
  
  constructor(
    private orderService:OrderService,
    private userService:UserService,
  ) { }

  ngOnInit(): void {
    this.getOrdersByLimit(10);
  }

  getOrdersByLimit(limit: number) {
    this.orderService.getOrdersByLimit(limit).subscribe({
      next: (orders: Order[]) => {
        console.log(orders);

        // Fetch the username for each order
        this.ordersList = orders.map((order) => {
          // Use the userService to get the username for each order's userId
          this.userService.getUserById(order.userId).subscribe({
            next: (user: UserDTO) => {
              // Assign the username to the order object
              order.username = user.username;
            },
            error: (error: any) => {
              console.log(error);
            },
          });

          return order;
        });
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        console.log(error);
      },
    });
  }
  // getOrdersByLimit(limit: number){
  //   this.orderService.getOrdersByLimit(10)
  //   .subscribe({
  //     next: (orders: Order[]) =>{
  //       console.log(orders);
  //       this.ordersList = orders;
  //     },
  //     error: (error: HttpErrorResponse) =>{
  //       alert(error.message);
  //       console.log(error);
  //     }
  //   });
  // }

  bgBadgeSelect(orderStatus: any): string{
    switch(orderStatus){
      case OrderStatus.ORDERED : return 'bg-light text-success';
      case OrderStatus.SHIPPED : return 'bg-primary';
      case OrderStatus.CANCELLED : return 'bg-danger';
      case OrderStatus.PROCESSING : return 'bg-warning';
      case OrderStatus.DELIVERED : return 'bg-success';
      case OrderStatus.RETURN_REQUESTED : return 'bg-secondary';
      case OrderStatus.RETURNED : return 'bg-secondary';
      default : return 'bg-success';
    }
  }

  getTotalQuantity(order: Order) {
    return order.products.reduce((total, product) => total + product.productQuantity, 0);
  }

  orderStatusActive(order: Order, orderStatus: any): boolean{
    const result = order.trackStatus.find(t => t.order_status == orderStatus);
    return !!result;
  }

  // to create 1 to totalNum sequence array
  range(totalNum: number): number[]{
    return Array(totalNum).fill(0).map((x,index) => index + 1);
  }
  rangeStart(start:number, totalNum: number): number[]{
    return Array(totalNum-start).fill(0).map((x,index) => index + 1+ start);
  }

  searchOperation(){
    this.getOrdersWithPagination(this.pageNum,this.limit,this.sortField,this.sortDir);
  }

  public getOrdersWithPagination(pageNum:number,limit: number, sortField: string, sortDir: string){
    if(!this.paymentMethodList.length || !this.paymentStatusList.length || !this.orderStatusList.length) return;

    this.orderService.getOrdersWithPagination(
      pageNum, limit, sortField, sortDir, this.searchKeyword,
      this.orderStatusList, this.paymentStatusList, this.paymentMethodList
    )
    .subscribe({
      next: (orderPage: OrderPagination) =>{
        console.log(orderPage);
        this.ordersPagination = orderPage;
       
        this.ordersList = this.ordersPagination.listOrders;
        this.pageNum = this.ordersPagination.pageNum;
        this.limit = this.ordersPagination.limit;
        this.sortField = this.ordersPagination.sortField;
        this.sortDir = this.ordersPagination.sortDir;
        this.totalItems = this.ordersPagination.totalItems;
        this.reverseSortDir = this.ordersPagination.reverseSortDir;
        this.totalPages = this.ordersPagination.totalPages;
        this.startCount = this.ordersPagination.startCount;
        this.endCount = this.ordersPagination.endCount;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    });
  }

  isOrderStatusSelected(status: OrderStatus): boolean {
    return this.orderStatusList.includes(status);
  }
  toggleOrderStatusSelection(status: OrderStatus): void {
    const index = this.orderStatusList.indexOf(status);
    if (index > -1) {
      this.orderStatusList.splice(index, 1);
    } else {
      this.orderStatusList.push(status);
    }

    this.getOrdersWithPagination(this.pageNum,this.limit,this.sortField,this.sortDir);
  }

  isPaymentStatusSelected(status: PaymentStatus): boolean {
    return this.paymentStatusList.includes(status);
  }
  togglePaymentStatusSelection(status: PaymentStatus): void {
    const index = this.paymentStatusList.indexOf(status);
    if (index > -1) {
      this.paymentStatusList.splice(index, 1);
    } else {
      this.paymentStatusList.push(status);
    }

    this.getOrdersWithPagination(this.pageNum,this.limit,this.sortField,this.sortDir);
  }

  isPaymentMethodSelected(status: PaymentMethod): boolean {
    return this.paymentMethodList.includes(status);
  }
  togglePaymentMethodSelection(status: PaymentMethod): void {
    const index = this.paymentMethodList.indexOf(status);
    if (index > -1) {
      this.paymentMethodList.splice(index, 1);
    } else {
      this.paymentMethodList.push(status);
    }

    this.getOrdersWithPagination(this.pageNum,this.limit,this.sortField,this.sortDir);
  }

}



// selectedOrderStatuses: { [key: string]: boolean } = {};
// getSelectedStatusesString(): string {
//   return this.orderStatuses.filter(status => this.selectedOrderStatuses[status]).join(', ');
// }