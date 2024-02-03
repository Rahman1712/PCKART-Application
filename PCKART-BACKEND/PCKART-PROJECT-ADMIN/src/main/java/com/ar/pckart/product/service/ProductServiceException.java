package com.ar.pckart.product.service;

import com.ar.pckart.admin.config.ErrorResponse;

public class ProductServiceException extends RuntimeException{

	private static final long serialVersionUID = 1L;

	private ErrorResponse errorResponse;
	
	public ProductServiceException(ErrorResponse errorResponse) {
		this.errorResponse = errorResponse;
	}

	public ErrorResponse getErrorResponse() {
		return errorResponse;
	}
}
