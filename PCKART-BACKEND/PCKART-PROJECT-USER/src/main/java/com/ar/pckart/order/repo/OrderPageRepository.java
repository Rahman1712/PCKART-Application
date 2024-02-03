package com.ar.pckart.order.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ar.pckart.order.model.Order;
import com.ar.pckart.order.model.OrderStatus;
import com.ar.pckart.order.model.PaymentMethod;
import com.ar.pckart.order.model.PaymentStatus;

@Repository
public interface OrderPageRepository extends PagingAndSortingRepository<Order, String>{
	
	@Query("SELECT o FROM Order o "
			+ "WHERE "
	        + "o.orderStatus IN :orderStatusList "
	        + "AND o.paymentStatus IN :paymentStatusList "
	        + "AND o.paymentMethod IN :paymentMethodList "
			+ "AND CONCAT(o.id, ' ',o.trackingNo) "
			+ "LIKE %:searchKeyword%") 
	public Page<Order> getAllOrdersByPaginationWithSearch(
			Pageable pageable,
			@Param("orderStatusList") List<OrderStatus> orderStatusList,
	        @Param("paymentStatusList") List<PaymentStatus> paymentStatusList,
	        @Param("paymentMethodList") List<PaymentMethod> paymentMethodList,
			@Param("searchKeyword") String searchKeyword);
	
	@Query("SELECT o FROM Order o "
			+ "WHERE "
			+ "o.orderStatus IN :orderStatusList "
			+ "AND o.paymentStatus IN :paymentStatusList "
			+ "AND o.paymentMethod IN :paymentMethodList ") 
	public Page<Order> getAllOrdersByPagination(
			Pageable pageable,
			@Param("orderStatusList") List<OrderStatus> orderStatusList,
			@Param("paymentStatusList") List<PaymentStatus> paymentStatusList,
			@Param("paymentMethodList") List<PaymentMethod> paymentMethodList);
}
