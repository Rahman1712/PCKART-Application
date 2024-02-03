package com.ar.pckart.order.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

	private Long id;
	private String name;
	private String code;
	private float discount;
	private Date validupto;
	private boolean enabled = true;
}
