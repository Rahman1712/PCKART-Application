package com.ar.pckart.admin.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ar.pckart.admin.dto.AuthenticationRequest;
import com.ar.pckart.admin.dto.AuthenticationResponse;
import com.ar.pckart.admin.dto.RegisterRequest;
import com.ar.pckart.admin.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class PublicController {

	private final AdminService service;
	
	@PostMapping("/register")
	public ResponseEntity<AuthenticationResponse> registerAdmins(@RequestBody @Valid RegisterRequest request) {
		return new ResponseEntity<>(service.register(request), HttpStatus.CREATED);
	}

	@PostMapping("/authenticate")
	public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
		return ResponseEntity.ok(service.authenticate(request));
	}
	
	@GetMapping("/usertoken")
	public ResponseEntity<AuthenticationResponse> userTokenCreation(HttpServletRequest req){
		
		return ResponseEntity.ok(service.genTokenUser(req));
	}

	@PostMapping("/check")
	public ResponseEntity<AuthenticationResponse> authenticate(HttpServletRequest req, HttpServletResponse res) {
		String authHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
		if (authHeader == null) {
			res.setStatus(401);
			return ResponseEntity.badRequest().build();
		}
		String token = authHeader.split(" ")[1];
		if (token == null) {
			res.setStatus(401);
			return ResponseEntity.badRequest().build();
		}
		AuthenticationResponse response =  new AuthenticationResponse();
		response.setToken(token);

		return ResponseEntity.ok(response);
	}
	
	@GetMapping
	public String work(){
		return "admins work";
	}
}

/*
 * @PostMapping("/register") public ResponseEntity<AuthenticationResponse>
 * register( //public ResponseEntity<Object> register(
 * 
 * @RequestBody @Valid RegisterRequest request //,BindingResult bindingResult ){
 * //if(bindingResult.hasErrors()) //return
 * ResponseEntity.badRequest().body(bindingResult.getFieldError()); //return
 * ResponseEntity.badRequest().build();
 * 
 * //return ResponseEntity.ok(service.register(request)); return new
 * ResponseEntity<>(service.register(request), HttpStatus.CREATED); }
 */
