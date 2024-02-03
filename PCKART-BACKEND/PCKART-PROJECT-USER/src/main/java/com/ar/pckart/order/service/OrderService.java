package com.ar.pckart.order.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ar.pckart.coupon.model.UserCoupon;
import com.ar.pckart.coupon.service.UserCouponService;
import com.ar.pckart.order.model.Order;
import com.ar.pckart.order.model.OrderProduct;
import com.ar.pckart.order.model.OrderRequest;
import com.ar.pckart.order.model.OrderStatus;
import com.ar.pckart.order.model.PaymentMethod;
import com.ar.pckart.order.model.PaymentStatus;
import com.ar.pckart.order.model.TrackStatus;
import com.ar.pckart.order.repo.OrderPageRepository;
import com.ar.pckart.order.repo.OrderRepository;
import com.ar.pckart.payment.model.Payment;
import com.ar.pckart.payment.service.PaymentService;
import com.ar.pckart.product.service.CartService;
import com.ar.pckart.product.service.ProductService;

@Service
public class OrderService {

	@Autowired private OrderRepository orderRepo;
	@Autowired private OrderPageRepository orderPageRepo;
	@Autowired PaymentService paymentService; 
	@Autowired UserCouponService userCouponService;
	@Autowired CartService cartService;
	@Autowired ProductService productService;
	
	public List<Order> findAll(){
		return orderRepo.findAll();
	}
	
	public List<Order> findAllByUserId(Long userId){
		return orderRepo.findAllByUserId(userId);
	}
	
	public Order findById(String id) {
		return orderRepo.findById(id).get();
	}
	
	public Order saveOrder(Order order) {
		return orderRepo.save(order);
	}
	
	@Transactional
	public Order saveOrderDetails(OrderRequest orderRequest) {
		try {
			Order order = new Order();
			order.setUserId(orderRequest.getUserId());
			order.setOrderAddress(orderRequest.getOrderAddress());
			order.setProducts(orderRequest.getProducts());
			order.setGrandTotalPrice(orderRequest.getGrandTotalPrice());
			order.setShippingCharge(orderRequest.getShippingCharge());
			
			if(orderRequest.getUserCouponId() != 0) {
				UserCoupon userCoupon = userCouponService.updateEnabledAndDateById(orderRequest.getUserCouponId(), LocalDateTime.now(), true);
				order.setUserCoupon(userCoupon);
				order.setCouponDiscount(orderRequest.getCouponDiscount());
			}
			
			order.setTotalPricePaid(orderRequest.getTotalPricePaid());
			
			List<TrackStatus> trackStatusList = new ArrayList<>();
			TrackStatus trackStatusOrdered = TrackStatus.builder()
					.order_status(OrderStatus.ORDERED)
					.description("order placed "+orderRequest.getProducts().size()+" products , using "+orderRequest.getPaymentMethod()+ " payment method.")
					.status_time(LocalDateTime.now())
					.build();
			trackStatusList.add(trackStatusOrdered);
			order.setTrackStatus(trackStatusList);
			
			order.setTrackingNo(generateUniqueTrackingNumber());
			order.setOrderDate(LocalDateTime.now());
			order.setOrderStatus(OrderStatus.ORDERED);
			
			if(orderRequest.getPaymentMethod() == PaymentMethod.ONLINE) {
				Payment paymentSaved = paymentService.savePayment(orderRequest.getPayment());
				order.setPaymentId(paymentSaved.getRazorpay_payment_id());
			}
			
			if(orderRequest.getPaymentMethod() == PaymentMethod.ONLINE) {
				order.setPaymentStatus(PaymentStatus.PAID);
			}else {
				order.setPaymentStatus(PaymentStatus.PENDING);
			}
			order.setPaymentMethod(orderRequest.getPaymentMethod());
	
			Order savedOrder = saveOrder(order);
			String resultString = cartService.deleteCartsByUserIdAndProductId(savedOrder.getUserId(), 
					savedOrder.getProducts()
						.stream() 
						.map(OrderProduct::getProductId)
						.collect(Collectors.toList()));
			System.err.println(resultString);
			
			System.err.println(productService.updateProductsQuantiy(order.getProducts()));
			
			return savedOrder;
		
		} catch (Exception e) {
	        e.printStackTrace();
	        throw new RuntimeException("Error occurred, transaction rolled back.");
	    }
	}
	
	public void updateOrderStatusById(String id, OrderStatus orderStatus) {
		orderRepo.updateOrderStatusById(id,orderStatus);
	}
	
	public void updatePaymentStatusById(String id, PaymentStatus paymentStatus) {
		orderRepo.updatePaymentStatusById(id,paymentStatus);
	}

	public Optional<Order> findByTrackingNo(String trackingNo) {
		return orderRepo.findByTrackingNo(trackingNo);
	} 
	
	
	
    private String generateUniqueTrackingNumber() {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String randomNumber = String.valueOf((int) (Math.random() * 10000));
        return timestamp + "-" + randomNumber;
    }


    public String deleteById(String id) {
    	orderRepo.deleteById(id);
    	return "deleted";
    }

	public List<Order> findAllByLimit(int limit) {
		if(limit<=10){
			return orderRepo.findTop10ByOrderByOrderDateDesc();
		}else if(limit<=25) {
			return orderRepo.findTop25ByOrderByOrderDateDesc();
		}else if(limit<=50) {
			return orderRepo.findTop50ByOrderByOrderDateDesc();
		}else {
			return orderRepo.findTop100ByOrderByOrderDateDesc();
		}
	}

	public void updateTrackStatusById(String orderId, TrackStatus track_status) {
		Order order = findById(orderId);
		order.getTrackStatus().add(track_status);
		order.setOrderStatus(track_status.getOrder_status());
		orderRepo.save(order);
	}
	
	public Map<String, Object> listAllOrdersWithPagination(int pageNum, int limit, String sortField, String sortDir, String searchKeyword, 
			List<OrderStatus> orderStatusList,List<PaymentStatus> paymentStatusList,List<PaymentMethod> paymentMethodList)
			 {
		Sort sort = Sort.by(sortField);
		sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();

		Pageable pageable = PageRequest.of(pageNum - 1, limit, sort); // 10 5 20
		
		Page<Order> page = null;
		if(searchKeyword != null && !searchKeyword.trim().equals("")) {
			/*---------- PAGE WITH SEARCH KEYWORD FILTER---------*/
			page = orderPageRepo.getAllOrdersByPaginationWithSearch(
					pageable, orderStatusList, paymentStatusList, paymentMethodList, searchKeyword.trim());
		}else {
			/*---------- PAGE WITHOUT SEARCH---------*/
			page = orderPageRepo.getAllOrdersByPagination(pageable, orderStatusList, paymentStatusList, paymentMethodList);
		}

		long totalItems = page.getTotalElements();
		int totalPages = page.getTotalPages();

		Map<String, Object> map = new HashMap<>();
		map.put("pageNum", pageNum);
		map.put("totalItems", totalItems);
		map.put("totalPages", totalPages);
		map.put("listOrders", page.getContent());
		map.put("sortField", sortField);
		map.put("sortDir", sortDir);
		map.put("limit", limit);
		
		String reverseSortDir =  sortDir.equals("asc") ? "desc" : "asc" ;
		map.put("reverseSortDir", reverseSortDir);
		
		long startCount = (pageNum - 1) * limit + 1;
		map.put("startCount", startCount);
		
		long endCount = (startCount+limit-1) < totalItems ? (startCount+limit-1) : totalItems;
		map.put("endCount", endCount);

		return map;
	}

}
