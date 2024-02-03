package com.ar.pckart.order.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

	private String id;
    private Long userId;
    private OrderAddress orderAddress;
    private List<OrderProduct> products; 
    private Double grandTotalPrice;
    private float shippingCharge;
    private UserCoupon userCoupon;
    private float couponDiscount;
    private Double totalPricePaid;
    private List<TrackStatus> trackStatus;
    private String trackingNo;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private String paymentId;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
}
