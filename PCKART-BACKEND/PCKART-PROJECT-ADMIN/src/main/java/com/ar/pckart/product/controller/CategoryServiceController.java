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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ar.pckart.product.model.Category;
import com.ar.pckart.product.service.CategoryService;

@RestController
@RequestMapping("/api/v1/category")
@PreAuthorize("hasAnyRole({'ADMIN','ADMINTRAINEE','EDITOR'})") //@PreAuthorize("hasRole('ROLE_ADMIN')")
public class CategoryServiceController {

	@Autowired private CategoryService categoryService;
	
	@PostMapping("/save")
	@PreAuthorize("hasAuthority('store:create')")
	public ResponseEntity<Category> addCategory(
			@RequestPart("category") Category category,
			@RequestParam("file") MultipartFile file
			) {
		return ResponseEntity.ok(categoryService.addCategory(category, file));
	}
	
	@PutMapping("/update/{id}")
	@PreAuthorize("hasAuthority('store:update')")
	public ResponseEntity<String> updateCategory(
			@PathVariable("id") Long id,
			@RequestPart("category") Category category,
			@RequestParam("file") MultipartFile file){
		return ResponseEntity.ok(categoryService.updateCategory(id, category, file));
	}
	
	@DeleteMapping("/delete/{id}")
	@PreAuthorize("hasAuthority('store:delete')")
	public ResponseEntity<String> deleteCategory(
			@PathVariable("id") Long id){
		return ResponseEntity.ok(categoryService.deleteCategory(id));
	}
}
