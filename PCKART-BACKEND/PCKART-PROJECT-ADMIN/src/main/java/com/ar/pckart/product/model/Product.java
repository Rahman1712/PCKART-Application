package com.ar.pckart.product.model;

import java.util.HashMap;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
	
	private Long id;
	private String name;
	private Brand brand;
	private double price;
	private int quantity;
	private float discount;
	private Category category;
	private String color;
	private String description;
	private Map<String,String> specs = new HashMap<>();
}
