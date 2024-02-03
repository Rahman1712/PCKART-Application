package com.ar.pckart.user.model;

import java.time.LocalDateTime;
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

    private Long couponId;

    private LocalDateTime used_date;

    private boolean coupon_used = false;
}
