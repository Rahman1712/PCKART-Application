package com.ar.pckart.order.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCoupon {

    private Long id;
    private Long userId;
    private Coupon coupon;
    private Date used_date;
    private boolean coupon_used;
}
