package com.ar.pckart.admin.dto;

import com.ar.pckart.admin.util.MaskData;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminDTO {

	private Long id;
	private String fullname;
	private String email;
	@MaskData
	private String mobile;
	private String username;
	private String password;
	private String role;
	private byte[] image;
	private String imageName;
	private String imageType;
	private boolean enabled;
	private boolean nonLocked;
}
