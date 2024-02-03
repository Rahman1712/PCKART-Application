package com.ar.pckart.user.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {

	private Long id;
	private String fullname;
	private String email;
	private String mobile;
	private String username;
	private String password;
	private String role;
	private byte[] image;
	private String imageName;
	private String imageType;
	private boolean enabled;
	private boolean nonLocked;
	
	private List<Address> addresses;
	private List<LocalDateTime> last_logins;
}