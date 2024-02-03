package com.ar.pckart.order.controller;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ar.pckart.order.service.CouponService;
import com.ar.pckart.user.model.Coupon;

@RestController
@RequestMapping("/api/v1/coupon")
@PreAuthorize("hasAnyRole({'ADMIN','ADMINTRAINEE','EDITOR'})") //@PreAuthorize("hasRole('ROLE_ADMIN')")
public class CouponServiceController {
	
	@Autowired
	private CouponService couponService;
	
	@PostMapping("/save")
	@PreAuthorize("hasAuthority('user:create')")
	public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon){
		return ResponseEntity.ok(couponService.saveCoupon(coupon));
	}
	
	@GetMapping("/getall")
	@PreAuthorize("hasAuthority('user:read')")
	public ResponseEntity<List<Coupon>> getAllCoupon(){
		return ResponseEntity.ok(couponService.getAllCoupons());
	}
	
	@GetMapping("/getbyid/{couponId}")
	@PreAuthorize("hasAuthority('user:read')")
	public ResponseEntity<Coupon> getCouponById(@PathVariable("couponId") Long couponId){
		return ResponseEntity.ok(couponService.getCouponById(couponId));
	}
	
	
	@PutMapping("/update/enabled/byid/{couponId}")
	@PreAuthorize("hasAuthority('user:update')")
	public ResponseEntity<String> updateNonLockedBycouponId(@PathVariable("couponId")Long couponId,
			@RequestParam("enabled")boolean enabled) {
		return ResponseEntity.ok(couponService.updateEnabledByCouponId(couponId, enabled));
	}
	
	@PutMapping("/update/coupondata/byid/{couponId}")
	@PreAuthorize("hasAuthority('user:update')")
	public ResponseEntity<String> updateCouponDataByCouponId(
			@PathVariable("couponId")Long couponId,
			@RequestParam("code")String code,
			@RequestParam("discount")float discount,
			@RequestParam("validupto") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime validupto
			) {
		return ResponseEntity.ok(couponService.updateCouponDataByCouponId(couponId, code, discount,validupto));
	}
	
	@PutMapping("/update/validupto_discount/byid/{couponId}")
	@PreAuthorize("hasAuthority('user:update')")
	public ResponseEntity<String> updateValiduptoAndDiscountByCouponId(
			@PathVariable("couponId")Long couponId,
			@RequestParam("discount")float discount,
			@RequestParam("validupto") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime validupto
			) {
		return ResponseEntity.ok(couponService.updateValiduptoAndDiscountByCouponId(couponId, discount,validupto));
	}

}
