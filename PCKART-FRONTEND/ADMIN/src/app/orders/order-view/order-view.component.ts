import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/_services/product.service';
import {map} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/_services/order.service';
import { Order } from 'src/app/_model-dto/order/order';
import { ImageProcessingService } from 'src/app/_services/image-processing-service.service';
import { OrderProduct } from 'src/app/_model-dto/order/order-product';
import { ProductDTO } from 'src/app/_model-dto/product/productDTO';
import { OrderStatus } from 'src/app/_model-dto/order/order-status';
import { error } from 'jquery';
import { TrackStatus } from 'src/app/_model-dto/order/track-status';
import { AlertBoxesComponent, AlertType } from 'src/app/_utils/alert-boxes/alert-boxes.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit{

  order: Order = new Order();
  public orderId: string ;

  track_status: TrackStatus = new TrackStatus();
  dialogAlertRef: MatDialogRef<AlertBoxesComponent> | null;

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private route: ActivatedRoute,
    private order_service: OrderService,
    private router: Router,
    public dialog: MatDialog,
  ){}

  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
    });

    this.getOrderByOrderId(this.orderId);
    
  }

  getOrderByOrderId(orderId: string){
    this.order_service.getOrderByOrderId(orderId)
    .subscribe({
      next: (order: Order) =>{
        order.products.forEach((orderProduct) =>{       
          this.getAllProductsByCartItem(orderProduct);
        });
        this.order = order;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
        console.log(error);
      }
    });
  }

  getAllProductsByCartItem(orderProduct: OrderProduct ) {
    this.productService.getProductDetailsMainImageById(orderProduct.productId)
      .pipe(
        map((product: ProductDTO<any,any>) => 
          this.imageProcessingService.createMainImageToProdDto(product)
        )
      )
      .subscribe({
        next: (prodDto: ProductDTO<any,any>) =>{
          orderProduct.mainImage = prodDto.productResponse!.mainImage;
        },
        error: (error: HttpErrorResponse) =>{
          alert(error.message);
          console.log(error);
        }
      });
  }

  orderStatusImage(orderStatus: OrderStatus):string{
    switch(orderStatus){
      case OrderStatus.ORDERED : return "assets/img/order_delivery.png"; 
      case OrderStatus.SHIPPED : return "assets/img/shipped_truck.png"; 
      case OrderStatus.CANCELLED : return "assets/img/order_cancel.png"; 
      case OrderStatus.PROCESSING : return "assets/img/delivery.png"; 
      case OrderStatus.DELIVERED : return "assets/img/delivered_truck.png"; 
      case OrderStatus.RETURN_REQUESTED : return "assets/img/order-check.png"; 
      case OrderStatus.RETURNED : return "assets/img/order_return.png"; 
      default : return "assets/img/shipped_truck.png"; 
    }
  }
  orderStatusActive(orderStatus: any): boolean{
    const result = this.order.trackStatus.find(t => t.order_status == orderStatus);
    return !!result;
  }

  orderStatusActiveBySets(orderStatuses: any[]): boolean{
    const result = this.order.trackStatus.find(t => 
       orderStatuses.find(oS => t.order_status == oS)
    );
    return !!result;
  }

  updateOrderStatus(orderId: string, orderTrackForm: NgForm){
    const currentDateTime: Date = new Date();
    this.track_status.status_time = currentDateTime;

    if(this.track_status.order_status == undefined ||
      this.track_status.order_status == null ||
      this.track_status.description == undefined ||
      this.track_status.description == ""
      ){
        alert("Please fill all fields");
        return;
    }
    console.log(this.track_status);
    this.order_service.updateTrackStatusById(orderId, this.track_status)
    .subscribe({
      next: (res: string) => {
        console.log(res);
        this.dialogAlertRef = this.dialog.open(AlertBoxesComponent, {
          disableClose: true
        });
        this.dialogAlertRef.componentInstance.alertType = AlertType.INFO;
        this.dialogAlertRef.componentInstance.info_title = "Track Status Updated";
        this.dialogAlertRef.componentInstance.info_message = "Track Status Updated successfully";
        this.dialogAlertRef.componentInstance.info_color = "primary";
  
        this.dialogAlertRef.afterClosed().subscribe(result => {
          this.dialogAlertRef = null;
          orderTrackForm.reset();
          this.router.navigate(['/orders/order-view'], {queryParams: { orderId: orderId}});
          this.ngOnInit();
        });
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error);
        this.dialogAlertRef = this.dialog.open(AlertBoxesComponent, {
          disableClose: true
        });
        this.dialogAlertRef.componentInstance.alertType = AlertType.INFO;
        this.dialogAlertRef.componentInstance.info_title = "Error";
        this.dialogAlertRef.componentInstance.info_message = "Error in track status updation";
        this.dialogAlertRef.componentInstance.info_color = "warn";
  
        this.dialogAlertRef.afterClosed().subscribe(result => {
          this.dialogAlertRef = null;
        });
      }
    });
  }


  returnOrder(order: Order){
    this.order_service.returnOrderConfirmed(order)
    .subscribe({
      next: (res: string) => {
        console.log(res);

        this.dialogAlertRef = this.dialog.open(AlertBoxesComponent, {
          disableClose: true
        });
        this.dialogAlertRef.componentInstance.alertType = AlertType.INFO;
        this.dialogAlertRef.componentInstance.info_title = "Order Status Updated";
        this.dialogAlertRef.componentInstance.info_message = "Order Status Updated successfully";
        this.dialogAlertRef.componentInstance.info_color = "primary";
  
        this.dialogAlertRef.afterClosed().subscribe(result => {
          this.ngOnInit();
        });

      },
      error: (error: HttpErrorResponse) =>{
        console.log(error);
        alert(error.message)
      }
    })
  }
}
