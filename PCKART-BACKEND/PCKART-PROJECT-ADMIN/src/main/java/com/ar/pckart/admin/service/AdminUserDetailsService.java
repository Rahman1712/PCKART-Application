package com.ar.pckart.admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.ar.pckart.admin.repo.AdminRepository;

public class AdminUserDetailsService implements UserDetailsService {

	@Autowired
	private AdminRepository repository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return repository.findByUsername(username).map(AdminUserDetails::new)
				.orElseThrow(() -> new UsernameNotFoundException("User not Found"));
	}

}
