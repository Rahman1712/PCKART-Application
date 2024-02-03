package com.ar.pckart.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {
	private Long id;
	private String houseno;
	private String place;
	private String city;
	private String state;
	private String country;
	private String pincode;
}
