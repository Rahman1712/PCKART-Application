package com.ar.pckart.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.ar.pckart.admin.config.JwtUsersService;
import com.ar.pckart.user.model.UserDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final WebClient webClient;
	private final JwtUsersService jwtUsersService;
	
	@Value("${user.service.api.url.getall}")
	private String USER_SERVICE_URL_GETALL;
	
	@Value("${user.service.api.url.getbyid}")
	private String USER_SERVICE_URL_GETBYID;
	
	@Value("${user.service.api.url.update_nonlocked}")
	private String USER_SERVICE_URL_UPDATE_NONLOCKED;
	
	public List<UserDTO> getAllUsers() {
		List<UserDTO> usersList = webClient.get()
				.uri(USER_SERVICE_URL_GETALL)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.onStatus(HttpStatusCode::isError, t -> t.createError())
				.bodyToFlux(UserDTO.class)
				.collectList()
				.block()
				;
		return usersList;
	}
	
	public String updateNonLockedByUserId(Long userId, boolean nonlocked) {
		
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromUriString(USER_SERVICE_URL_UPDATE_NONLOCKED+userId)
				.queryParam("nonlocked", nonlocked);
		
		String uriPathWithQueryParams = uriBuilder.toUriString();
		System.err.println("ddd :"+uriPathWithQueryParams);
		return webClient.put()
				.uri(uriPathWithQueryParams)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.retrieve()
				.onStatus(HttpStatusCode::isError, t-> t.createError())
				.bodyToMono(String.class)
				.block();
	}
	
	private String getAuthenticationUsername() {
		Authentication authentication = SecurityContextHolder
				.getContext().getAuthentication();
		return authentication.getName();
	}

	public UserDTO getUserById(Long id) {
		UserDTO user = webClient.get()
				.uri(USER_SERVICE_URL_GETBYID+id)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.onStatus(HttpStatusCode::isError, t -> t.createError())
				.bodyToMono(UserDTO.class)
				.block()
				;
		return user;
	}
}
