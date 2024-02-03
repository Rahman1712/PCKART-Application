package com.ar.pckart.user.model;

import java.time.LocalDateTime;
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
	
	private LocalDateTime validupto;
	
	private boolean enabled = true;
}
