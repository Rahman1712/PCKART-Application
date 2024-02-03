package com.ar.pckart.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponse {

	private Long id;
	private String name;
	private boolean permenant; 
	private Long parentid;
}
