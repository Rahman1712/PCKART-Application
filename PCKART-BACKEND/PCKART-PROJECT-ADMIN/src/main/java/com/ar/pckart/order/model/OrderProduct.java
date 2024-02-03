package com.ar.pckart.order.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderProduct {

	private Long id;
	private Long productId;
	private String productName;
	private float productPrice;
	private int productQuantity;

}
