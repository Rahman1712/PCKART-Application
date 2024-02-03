package com.ar.pckart.admin.service;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ar.pckart.admin.model.Admin;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class AdminUserDetails implements UserDetails {

	private static final long serialVersionUID = 1L;

	private final Admin admin;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		//return List.of(new SimpleGrantedAuthority(admin.getRole().name()));
		/*
		System.err.println(admin.getRole().getGrantedAuthorities());
		[self:update, store:update, store:delete, user:delete, store:read, user:update, admin:create, self:read, store:create, admin:update, user:create, user:read, admin:read, ROLE_ADMIN, admin:delete]
		*/
		/*
		System.err.println(admin.getRole().getPermissions());
		[USER_READ, SELF_UPDATE, STORE_CREATE, ADMIN_DELETE, ADMIN_CREATE, ADMIN_READ, ADMIN_UPDATE, STORE_UPDATE, STORE_READ, SELF_READ, USER_CREATE, STORE_DELETE, USER_UPDATE, USER_DELETE]
		*/
		return admin.getRole().getGrantedAuthorities();
	}

	@Override
	public String getPassword() {
		return admin.getPassword();
	}

	@Override
	public String getUsername() {
		return admin.getUsername();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return admin.isNonLocked();
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return admin.isEnabled();
	}

}
