package com.ar.pckart.admin.util;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MaxByteArraySizeValidator.class)
public @interface MaxByteArraySize {
	String message() default "Byte array size exceeds the maximum allowed.";
	Class<?>[] groups() default {};
	Class<? extends Payload>[] payload() default {};
	int value();

}
