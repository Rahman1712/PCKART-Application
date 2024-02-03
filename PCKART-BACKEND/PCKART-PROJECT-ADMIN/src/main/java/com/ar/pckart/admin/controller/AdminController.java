package com.ar.pckart.admin.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ar.pckart.admin.dto.AdminDTO;
import com.ar.pckart.admin.dto.AuthenticationResponse;
import com.ar.pckart.admin.dto.RegisterRequest;
import com.ar.pckart.admin.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/private")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole({'ADMIN','ADMINTRAINEE','EDITOR'})") //@PreAuthorize("hasRole('ROLE_ADMIN')")  
public class AdminController {

	private final AdminService service;
	
	@GetMapping("/abc")
	public String works() {
		return "worked";
	}

	@PostMapping("/save")
	@PreAuthorize("hasAuthority('admin:create')")
	public ResponseEntity<AuthenticationResponse> createAdmin(@RequestBody @Valid RegisterRequest request) {
		return new ResponseEntity<>(service.register(request), HttpStatus.CREATED);
	}
	
	@GetMapping("/get/byId/{id}") 
	@PreAuthorize("hasAuthority('self:read')")  // @PreAuthorize("hasAuthority('admin:read')")
	public ResponseEntity<AdminDTO> getDetailsById(@PathVariable("id")Long id){
		return ResponseEntity.ok(service.findById(id));
	}
	
	@GetMapping("/get/byUsername/{username}") 
	@PreAuthorize("hasAuthority('self:read')")  
	public ResponseEntity<AdminDTO> getDetailsByUserName(@PathVariable("username")String username){
		return ResponseEntity.ok(service.findByUsername(username));
	}
	
	@GetMapping("/get/allAdmins")
	@PreAuthorize("hasAuthority('admin:read')")
	public ResponseEntity<List<AdminDTO>> getDetailsOfAllAdmins(){
		return ResponseEntity.ok(service.allAdminsDtos());
	}
	
	@DeleteMapping("/delete/byId/{id}")
	@PreAuthorize("hasAuthority('admin:delete')")
	public ResponseEntity<String> deleteById(@PathVariable("id")Long id){
		return ResponseEntity.ok(service.deleteById(id));
	}
	
	@PutMapping("/update/byId/{id}")
	@PreAuthorize("hasAuthority('self:update')")
	public ResponseEntity<String> updateById(@PathVariable("id")Long id,
			@RequestPart("request") RegisterRequest request,
			@RequestParam("file") MultipartFile file){
		try {
			return ResponseEntity.ok(service.updateAdminById(id, file, request));
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Updation Failed");
		}
	}
	
	@PutMapping("/update/password/byId/{id}")
	@PreAuthorize("hasAuthority('self:update')")
	public ResponseEntity<String> updatePasswordById(@PathVariable("id")Long id,
			@RequestParam("currentPassword") String currentPassword,
			@RequestParam("newPassword") String newPassword
			){
		return ResponseEntity.ok(service.updatePasswordById(id,currentPassword,newPassword));
	}
	
	@PutMapping("/update/enableAndLock/byid/{id}")
	@PreAuthorize("hasAuthority('admin:update')")
	public ResponseEntity<String> updateById(@PathVariable("id")Long id,
			@RequestParam("enabled") boolean enabled,
			@RequestParam("nonLocked") boolean nonLocked){
		System.err.println("Enabled :"+enabled+"  Nonlocked:"+nonLocked);
		return ResponseEntity.ok(service.updateEnableAndNonLockedAccountById(id, enabled, nonLocked));
	}
}
