package com.ar.pckart.order.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ar.pckart.order.model.Order;
import com.ar.pckart.order.model.OrderStatus;
import com.ar.pckart.order.model.PaymentMethod;
import com.ar.pckart.order.model.PaymentStatus;
import com.ar.pckart.order.model.TrackStatus;
import com.ar.pckart.order.service.OrderService;

@RestController
@RequestMapping("/api/v1/order")
@PreAuthorize("hasAnyRole({'ADMIN','ADMINTRAINEE','EDITOR'})") //@PreAuthorize("hasRole('ROLE_ADMIN')")
public class OrderServiceController {

	@Autowired
	private OrderService orderService;
	
	@GetMapping("/get/allOrders")
	@PreAuthorize("hasAuthority('user:read')")
	public ResponseEntity<List<Order>> getAllOrders(){
		return ResponseEntity.ok(orderService.getAllOrders());
	}
	
	@GetMapping("/get/orders/bylimit/{limit}")
	@PreAuthorize("hasAuthority('user:read')")
	public ResponseEntity<List<Order>> getAllOrdersByLimit(@PathVariable("limit") int limit){
		System.err.println("OOOOOOOOOOOO");
		return ResponseEntity.ok(orderService.getAllOrdersByLimit(limit));
	}
	
	@GetMapping("/get/order/byid/{id}")
	@PreAuthorize("hasAuthority('user:read')")
	public ResponseEntity<Order> getOrderById(@PathVariable("id")String id){
		return ResponseEntity.ok(orderService.getOrderById(id));
	}
	
	@GetMapping("/get/order/byTrackingNo/{trackingNo}")
	@PreAuthorize("hasAuthority('user:read')")
	public ResponseEntity<List<Order>> getOrdersByTrackingNo(@PathVariable("trackingNo")String trackingNo){
		return ResponseEntity.ok(orderService.getOrdersByTrackingNo(trackingNo));
	}
	
	@GetMapping("/get/orders/byUserId/{userId}")
	@PreAuthorize("hasAuthority('user:read')")
	public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable("userId")Long userId){
		return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
	}
	
	@PutMapping("/update/payment_status/byid/{orderId}")
	@PreAuthorize("hasAuthority('user:update')")
	public ResponseEntity<String> updatePaymentStatusById(@PathVariable("orderId")String orderId,
			@RequestParam("payment_status") String payment_status){
		return ResponseEntity .ok(orderService.updatePaymentStatusById(orderId, payment_status));
	}
	
	@PutMapping("/update/order_status/byid/{orderId}")
	@PreAuthorize("hasAuthority('user:update')")
	public ResponseEntity<String> updateOrderStatusById(@PathVariable("orderId")String orderId,
			@RequestParam("order_status") String order_status){
		return ResponseEntity .ok(orderService.updateOrderStatusById(orderId, order_status));
	}
	
	@PutMapping("/update/track_status/byid/{orderId}")
	@PreAuthorize("hasAuthority('user:update')")
	public ResponseEntity<String> updateTrackStatusById(@PathVariable("orderId")String orderId,
			@RequestBody TrackStatus track_status){
		return ResponseEntity .ok(orderService.updateTrackStatusById(orderId, track_status));
	}
	
	@GetMapping("/get/orders-page/{pageNum}")  // Map<String, Object>
	public Object listAllOrdersWithPagination(
			@PathVariable("pageNum") int pageNum , 
			@Param("limit") int limit,
			@Param("sortField") String sortField , 
			@Param("sortDir") String sortDir ,
			@Param("searchKeyword") String searchKeyword,
			@Param("orderStatusList") List<OrderStatus> orderStatusList,
			@Param("paymentStatusList") List<PaymentStatus> paymentStatusList,
			@Param("paymentMethodList") List<PaymentMethod> paymentMethodList
			) throws IOException {
		
		Object mapResult = orderService.listAllOrdersWithPagination(
				pageNum, limit, sortField, sortDir, searchKeyword, 
				orderStatusList, paymentStatusList, paymentMethodList);
		
		return mapResult;
	}
}
