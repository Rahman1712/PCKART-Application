package com.ar.pckart.admin.util;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class MaxByteArraySizeValidator implements ConstraintValidator<MaxByteArraySize, byte[]>{

	private int maxSize;
	
	@Override
	public void initialize(MaxByteArraySize constraintAnnotation) {
		this.maxSize = constraintAnnotation.value();
	}
	
	@Override
	public boolean isValid(byte[] value, ConstraintValidatorContext context) {
		return value == null || value.length <= maxSize;
	}
	

}
