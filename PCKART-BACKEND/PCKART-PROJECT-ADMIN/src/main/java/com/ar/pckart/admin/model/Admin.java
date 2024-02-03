package com.ar.pckart.admin.model;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admins")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Admin {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String fullname;
	private String email;
	private String mobile;
	@Column(unique = true)
	private String username;
	private String password;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	
	@Lob 
	@Basic(fetch = FetchType.EAGER)
	@Column(name = "admin_image",length=100000)
	private byte[] image;
	
	@Column(name = "admin_image_name")
	private String imageName;
	
	@Column(name = "admin_image_type")
	private String imageType;
	
	private boolean enabled;
	
	private boolean nonLocked;
}