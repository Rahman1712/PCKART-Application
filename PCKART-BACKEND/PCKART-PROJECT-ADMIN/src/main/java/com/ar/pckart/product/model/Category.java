package com.ar.pckart.product.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Category {

	private Long id;
	private String name;
	private boolean permenant; 
	private byte[] image;
	private String imageName;
	private String imageType;
	private Category parent;
} 
