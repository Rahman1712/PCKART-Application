package com.ar.pckart.product.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class ProductResponse {

	private Long productId;
	private String productName;
	private double productPrice;
	private int productQuantity; 
	private float productDiscount;
	private String productColor;
	
	private String productDescription;
	private List<Map<String,String>> productSpecs;

	private Long brandId;
	private String brandName;
	
	private Long categoryId;
	private String categoryName;
	private LocalDateTime added_at;
}
