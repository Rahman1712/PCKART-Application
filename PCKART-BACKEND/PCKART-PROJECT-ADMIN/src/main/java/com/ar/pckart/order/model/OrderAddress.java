package com.ar.pckart.order.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderAddress {

	private Long id;
	private String fullname;
	private String houseno;
	private String place;
	private String city;
	private String post;
	private String pincode;
	private String state;
	private String country;
	private String contact;
	private String alternative_contact;
}
