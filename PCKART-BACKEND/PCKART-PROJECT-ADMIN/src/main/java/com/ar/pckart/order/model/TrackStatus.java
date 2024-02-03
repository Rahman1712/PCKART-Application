package com.ar.pckart.order.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackStatus {

	private Long id;
	private OrderStatus order_status;
	private String description;
	private LocalDateTime status_time;
	
}