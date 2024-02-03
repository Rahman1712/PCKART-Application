package com.ar.pckart.product.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ProductServiceExceptionHadler {

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(ProductServiceException.class)
	public Map<String, String> handleValidationExceptions(ProductServiceException ex){
		Map<String, String> errorMap = new HashMap<>();
		errorMap.put("message", ex.getErrorResponse().getMessage());
		errorMap.put("status", ex.getErrorResponse().getStatus()+"");
		errorMap.put("timestamp", ex.getErrorResponse().getTimestamp());
		errorMap.put("path", ex.getErrorResponse().getPath());
		return errorMap;
	}
	
}
