package com.ar.pckart.admin.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{
	
	@Autowired
	private JwtService jwtService;
	@Autowired
	private UserDetailsService userDetailsService; 
	 

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain)
			throws ServletException, IOException { 
		
		System.err.println("Filter jwt invoked");
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		final String jwt;
		final String userName;
		if(authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}
		jwt = authHeader.split(" ")[1].trim(); //jwt = authHeader.substring(7);
		try {
			userName = jwtService.extractUsername(jwt);
			if(userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails = this.userDetailsService.loadUserByUsername(userName);
				if(jwtService.isTokenValid(jwt, userDetails)) {
					UsernamePasswordAuthenticationToken authToken =  new UsernamePasswordAuthenticationToken(
							userDetails,
							null,
							userDetails.getAuthorities()
					);
					authToken.setDetails(
							new WebAuthenticationDetailsSource()
								.buildDetails(request)
					);
					SecurityContextHolder.getContext().setAuthentication(authToken);
				}
			}
		}catch(ExpiredJwtException ex) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			
			ErrorResponse errorResponse = new ErrorResponse();
			errorResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			errorResponse.setMessage("Token has Expired : admin section :"+ex.getMessage());
			
			ObjectMapper objectMapper = new ObjectMapper();
			String jsonError = objectMapper.writeValueAsString(errorResponse);
			
			response.getWriter().write(jsonError);
			return;
		}catch(Exception ex) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().write("An Error occured : admin section : "+ex.getMessage());
			return;
		}
		filterChain.doFilter(request, response);
	}

}
/*
 @RequiredArgsConstructor  
 
	private final JwtService jwtService;
	private final UserDetailsService userDetailsService; 
	 
 */
