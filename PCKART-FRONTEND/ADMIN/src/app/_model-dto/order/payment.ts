import { PaymentMethod } from "./payment-method";

export class Payment{
	id:string;
	orderId: string;
	paymentMethod:PaymentMethod;
	paymentId:string;
	paymentDate : any;
}