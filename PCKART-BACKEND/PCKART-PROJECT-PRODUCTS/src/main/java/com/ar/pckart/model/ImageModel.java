package com.ar.pckart.model;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "image_model")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImageModel {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	@Lob 
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "image",length=100000)
	private byte[] image; 
	private String imgName;
	private String imgType;
	
}
