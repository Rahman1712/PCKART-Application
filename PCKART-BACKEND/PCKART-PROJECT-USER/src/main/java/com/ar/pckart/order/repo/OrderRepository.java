package com.ar.pckart.order.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ar.pckart.order.model.Order;
import com.ar.pckart.order.model.OrderStatus;
import com.ar.pckart.order.model.PaymentStatus;

import jakarta.transaction.Transactional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String>{

	@Modifying
	@Transactional
	@Query("UPDATE Order o SET o.orderStatus = :orderStatus WHERE o.id = :id")
	void updateOrderStatusById(@Param("id")String id,@Param("orderStatus") OrderStatus orderStatus);

	public List<Order> findAllByUserId(Long userId);
	
	
	public Optional<Order> findByTrackingNo(String trackingNo);

	@Modifying
	@Transactional
	@Query("UPDATE Order o SET o.paymentStatus = :paymentStatus WHERE o.id = :id")
	void updatePaymentStatusById(String id, PaymentStatus paymentStatus);

	//List<Order> findTopNByOrderByOrderDateDesc();
	List<Order> findTop10ByOrderByOrderDateDesc();
	List<Order> findTop25ByOrderByOrderDateDesc();
	List<Order> findTop50ByOrderByOrderDateDesc();
	List<Order> findTop100ByOrderByOrderDateDesc();
	
}
