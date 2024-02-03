package com.ar.pckart.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "brands") 
public class Brand {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "brand_id")
	private Long id;
	
	@Column(name = "brand_name",unique = true, nullable = false)
	private String name;
	
	@Lob 
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "brand_image",length=100000)
	private byte[] image;
	
	@Column(name = "brand_image_name")
	private String imageName;
	
	@Column(name = "brand_image_type")
	private String imageType;
	
	@Column(name = "added_at", 
			nullable = false, updatable = false, insertable = false,
			columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	private LocalDateTime addedat;
	
	@JsonIgnore
	@OneToMany(mappedBy = "brand",cascade = CascadeType.ALL)
	private Set<Product> brand = new HashSet<>();
}

/*
 * 0 < length <= 255 --> `TINYBLOB` 255 < length <= 65535 --> `BLOB` 65535 <
 * length <= 16777215 --> `MEDIUMBLOB` 16777215 < length <= 2³¹-1 --> `LONGBLOB`
 */
