package com.ar.pckart.order.model;

import java.util.List;

import com.ar.pckart.payment.model.Payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

	private Long userId;
	private OrderAddress orderAddress;
	private Double totalPricePaid;
	private Double grandTotalPrice;
	private float shippingCharge;
	private float couponDiscount;
	private Long userCouponId;
	private List<OrderProduct> products;
	private Payment payment;
	private PaymentMethod paymentMethod;
}
