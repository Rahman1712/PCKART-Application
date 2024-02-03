package com.ar.pckart.product.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ar.pckart.product.model.Brand;
import com.ar.pckart.product.service.BrandService;

@RestController
@RequestMapping("/api/v1/brand")
@PreAuthorize("hasAnyRole({'ADMIN','ADMINTRAINEE','EDITOR'})") //@PreAuthorize("hasRole('ROLE_ADMIN')")
public class BrandServiceController {

	@Autowired private BrandService brandService;
	
	@PostMapping("/save")
	@PreAuthorize("hasAuthority('store:create')")
	public ResponseEntity<Brand> addBrand(
			@RequestParam("file") MultipartFile file,
			@RequestParam("name") String name
			) {
		return ResponseEntity.ok(brandService.addBrand(file, name));
	}
	
	@PutMapping("/update/{id}")
	@PreAuthorize("hasAuthority('store:update')")
	public ResponseEntity<String> updateBrand(
			@PathVariable("id") Long id,
			@RequestParam("name") String name,
			@RequestParam("file") MultipartFile file
			) {
		return ResponseEntity.ok(brandService.updateBrand(id,name,file));
	}
	
	@DeleteMapping("/delete/{id}")
	@PreAuthorize("hasAuthority('store:delete')")
	public ResponseEntity<String> deleteBrand(@PathVariable("id") Long id){
		return ResponseEntity.ok(brandService.deleteBrand(id));
	}
}
