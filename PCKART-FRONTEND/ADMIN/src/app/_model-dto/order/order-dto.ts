import { OrderStatus } from "./order-status";
import { PaymentMethod } from "./payment-method";
import { TrackStatus } from "./track-status";

export class OrderDTO{
  trackingNo: string;
	orderDate: any;
	orderStatus: OrderStatus;
	paymentMethod: PaymentMethod;
	totalPricePaid: number;
	trackStatus : TrackStatus[];  
}