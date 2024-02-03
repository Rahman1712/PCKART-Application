package com.ar.pckart.product.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Brand {

	private Long id;
	private String name;
	private byte[] image;
	private String imageName;
	private String imageType;
}

/*
 * 0 < length <= 255 --> `TINYBLOB` 255 < length <= 65535 --> `BLOB` 65535 <
 * length <= 16777215 --> `MEDIUMBLOB` 16777215 < length <= 2³¹-1 --> `LONGBLOB`
 */
