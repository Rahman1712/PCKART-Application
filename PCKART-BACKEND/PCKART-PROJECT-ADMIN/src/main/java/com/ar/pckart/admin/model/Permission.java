package com.ar.pckart.admin.model;


public enum Permission {

	
	SELF_READ("self:read"),
	SELF_UPDATE("self:update"),
	ADMIN_READ("admin:read"),
	ADMIN_CREATE("admin:create"),
	ADMIN_UPDATE("admin:update"),
	ADMIN_DELETE("admin:delete"),
	USER_READ("user:read"),
	USER_CREATE("user:create"),
	USER_UPDATE("user:update"),
	USER_DELETE("user:delete"),
	STORE_READ("store:read"),
	STORE_CREATE("store:create"),
	STORE_UPDATE("store:update"),
	STORE_DELETE("store:delete");
	
	private final String permission;
	
	private Permission(String permission) {
		this.permission = permission;
	}
	
	public String getPermission() {
		return permission;
	}
}

/*
import lombok.Getter;
import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor 
@Getter
private final String permission;
*/
