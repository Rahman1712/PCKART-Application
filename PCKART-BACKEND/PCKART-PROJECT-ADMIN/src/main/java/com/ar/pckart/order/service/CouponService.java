package com.ar.pckart.order.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.ar.pckart.admin.config.JwtUsersService;
import com.ar.pckart.user.model.Coupon;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CouponService {

	private final WebClient webClient;
	private final JwtUsersService jwtUsersService;
	
	@Value("${coupon.service.api.url.save}")
	private String COUPON_SERVICE_URL_SAVE;
	
	@Value("${coupon.service.api.url.getall}")
	private String COUPON_SERVICE_URL_GETALL;
	
	@Value("${coupon.service.api.url.getbyid}")
	private String COUPON_SERVICE_URL_GETBYID;
	
	@Value("${coupon.service.api.url.update_coupondata}")
	private String COUPON_SERVICE_URL_UPDATE_COUPONDATA;
	
	@Value("${coupon.service.api.url.update_validupto_discount}")
	private String COUPON_SERVICE_URL_UPDATE_VALIDUPTO_DISCOUNT;
	
	@Value("${coupon.service.api.url.update_enabled}")
	private String COUPON_SERVICE_URL_UPDATE_ENABLED;
	
	public Coupon saveCoupon(Coupon coupon) {
		Coupon couponSaved =  webClient.post()
				.uri(COUPON_SERVICE_URL_SAVE)
				.body(BodyInserters.fromValue(coupon)) // Use BodyInserters to create the request body
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.retrieve()
				.onStatus(HttpStatusCode::isError, t-> t.createError())
				.bodyToMono(Coupon.class)
				.block();
		return couponSaved;
	}
	
	public List<Coupon> getAllCoupons() {
		List<Coupon> couponsList = webClient.get()
				.uri(COUPON_SERVICE_URL_GETALL)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.onStatus(HttpStatusCode::isError, t -> t.createError())
				.bodyToFlux(Coupon.class)
				.collectList()
				.block()
				;
		return couponsList;
	}
	
	public Coupon getCouponById(Long couponId) {
		Coupon coupon = webClient.get()
				.uri(COUPON_SERVICE_URL_GETBYID+couponId)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.onStatus(HttpStatusCode::isError, t -> t.createError())
				.bodyToMono(Coupon.class)
				.block()
				;
		return coupon;
	}
	
	public String updateEnabledByCouponId(Long couponId, boolean enabled) {
		
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromUriString(COUPON_SERVICE_URL_UPDATE_ENABLED+couponId)
				.queryParam("enabled", enabled);
		
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
	
	public String updateCouponDataByCouponId(Long couponId, String code, float discount ,LocalDateTime validupto) {
		
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromUriString(COUPON_SERVICE_URL_UPDATE_COUPONDATA+couponId)
				.queryParam("code", code)
				.queryParam("discount", discount)
				.queryParam("validupto", validupto);
		
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
	
	public String updateValiduptoAndDiscountByCouponId(Long couponId, float discount ,LocalDateTime validupto) {
		
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromUriString(COUPON_SERVICE_URL_UPDATE_VALIDUPTO_DISCOUNT+couponId)
				.queryParam("discount", discount)
				.queryParam("validupto", validupto);
		
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
}
