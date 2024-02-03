package com.ar.pckart.order.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
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
import com.ar.pckart.order.model.Order;
import com.ar.pckart.order.model.OrderStatus;
import com.ar.pckart.order.model.PaymentMethod;
import com.ar.pckart.order.model.PaymentStatus;
import com.ar.pckart.order.model.TrackStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
	
	private final WebClient webClient;
	private final JwtUsersService jwtUsersService;
	
	@Value("${order.service.api.url.getall}")
	private String ORDER_SERVICE_URL_GETALL;
	
	@Value("${order.service.api.url.getall_bylimit}")
	private String ORDER_SERVICE_URL_GETALL_BYLIMIT;
	
	@Value("${order.service.api.url.getbyid}")
	private String ORDER_SERVICE_URL_GETBYID;
	
	@Value("${order.service.api.url.getbyUserid}")
	private String ORDER_SERVICE_URL_GETBY_USERID;
	
	@Value("${order.service.api.url.getbyTrackingNo}")
	private String ORDER_SERVICE_URL_GETBY_TRACKNO;
	
	@Value("${order.service.api.url.update_order_status}")
	private String ORDER_SERVICE_URL_UPDATE_ORDER_STATUS;
	
	@Value("${order.service.api.url.update_payment_status}")
	private String ORDER_SERVICE_URL_UPDATE_PAYMENT_STATUS;
	
	@Value("${order.service.api.url.update_track_status}")
	private String ORDER_SERVICE_URL_UPDATE_TRACK_STATUS;
	
	@Value("${order.service.api.url.get_orders_page}")
	private String ORDER_SERVICE_URL_GET_ORDERS_PAGE;
	
	public List<Order> getAllOrders() {
		List<Order> ordersList = webClient.get()
				.uri(ORDER_SERVICE_URL_GETALL)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.onStatus(HttpStatusCode::isError, t -> t.createError())
				.bodyToFlux(Order.class)
				.collectList()
				.block()
				;
		return ordersList;
	}
	
	public List<Order> getAllOrdersByLimit(int limit) {
		List<Order> ordersList = webClient.get()
				.uri(ORDER_SERVICE_URL_GETALL_BYLIMIT+limit)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.onStatus(HttpStatusCode::isError, t -> t.createError())
				.bodyToFlux(Order.class)
				.collectList()
				.block()
				;
		return ordersList;
	}
	
	public Order getOrderById(String id) {
		Order order = webClient.get()
				.uri(ORDER_SERVICE_URL_GETBYID+id)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.onStatus(HttpStatusCode::isError, t -> t.createError())
				.bodyToMono(Order.class)
				.block()
				;
		return order;
	}
	
	public List<Order> getOrdersByUserId(Long userId) {
		List<Order> ordersList = webClient.get()
				.uri(ORDER_SERVICE_URL_GETBY_USERID+userId)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.onStatus(HttpStatusCode::isError, t -> t.createError())
				.bodyToFlux(Order.class)
				.collectList()
				.block()
				;
		return ordersList;
	}
	
	public List<Order> getOrdersByTrackingNo(String trackingNo) {
		List<Order> ordersList = webClient.get()
				.uri(ORDER_SERVICE_URL_GETBY_TRACKNO+trackingNo)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.onStatus(HttpStatusCode::isError, t -> t.createError())
				.bodyToFlux(Order.class)
				.collectList()
				.block()
				;
		return ordersList;
	}
	
	public String updatePaymentStatusById(String orderId, String payment_status) {
		
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromUriString(ORDER_SERVICE_URL_UPDATE_PAYMENT_STATUS+orderId)
				.queryParam("payment_status", payment_status);
		
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
	
	public String updateOrderStatusById(String orderId, String order_status) {
		
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromUriString(ORDER_SERVICE_URL_UPDATE_ORDER_STATUS+orderId)
				.queryParam("order_status", order_status);
		
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

	public String updateTrackStatusById(String orderId, TrackStatus track_status) {
		
		return webClient.put()
				.uri(ORDER_SERVICE_URL_UPDATE_TRACK_STATUS+orderId)
				.body(BodyInserters.fromValue(track_status))
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.retrieve()
				.onStatus(HttpStatusCode::isError, t-> t.createError())
				.bodyToMono(String.class)
				.block();
	}

	public Object listAllOrdersWithPagination(int pageNum, int limit, String sortField, String sortDir,
			String searchKeyword, List<OrderStatus> orderStatusList, List<PaymentStatus> paymentStatusList,
			List<PaymentMethod> paymentMethodList) {
		
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromUriString(ORDER_SERVICE_URL_GET_ORDERS_PAGE+pageNum)
				.queryParam("limit", limit)
				.queryParam("sortField", sortField)
				.queryParam("sortDir", sortDir)
				.queryParam("searchKeyword", searchKeyword)
				.queryParam("orderStatusList", orderStatusList)
				.queryParam("paymentStatusList", paymentStatusList)
				.queryParam("paymentMethodList", paymentMethodList);
		
		String uriPathWithQueryParams = uriBuilder.toUriString();
		System.err.println("ddd :"+uriPathWithQueryParams);
		
		Object mapResult = webClient.get()
				.uri(uriPathWithQueryParams)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtUsersService.generateToken(getAuthenticationUsername()))
				.header("Username", getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.onStatus(HttpStatusCode::isError, t -> t.createError())
				.bodyToMono(Object.class)
				.block()
				;
		
		return mapResult;
	}
}
