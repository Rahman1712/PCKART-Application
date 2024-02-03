import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminDetails } from '../_model-dto/admin/adminDetails';
import { AuthenticationResponse } from '../_model-dto/admin/authenticationResponse';
import { AuthenticationRequest } from '../_model-dto/admin/authenticationRequest';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiServiceUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient, private router: Router) { }

  public loginUser(adminUserLogin: AuthenticationRequest):Observable<AuthenticationResponse>{
    return this.http.post<AuthenticationResponse>(`${this.apiServiceUrl}/authenticate`, adminUserLogin);
  } 

  public registerUser(adminUser: AdminDetails):Observable<AuthenticationResponse>{
    return this.http.post<AuthenticationResponse>(`${this.apiServiceUrl}/register`, adminUser);
  }

  redirectUrl!: string;

  public loggedIn(): boolean{
    this.redirectUrl = this.router.url;
    return !!localStorage.getItem('jwtAdminToken');
  } 

  public setToken(jwtToken: string) {
    localStorage.setItem('jwtAdminToken', jwtToken);
  }

  public getToken(): string | null {
    return localStorage.getItem('jwtAdminToken');
  }

  public setUserName(username: string) {
    localStorage.setItem('AdminUsername', username);
  }

  public getUsername(): string | null {
    return localStorage.getItem('AdminUsername');
  }

  public setRole(role: string) {
    localStorage.setItem('AdminRole', role);
  }

  public getRole(): string | null {
    return localStorage.getItem('AdminRole');
  }

  public adminRoleMatch(allowedRoles: string[]): boolean{
    for(let i=0; i<allowedRoles.length ;i++){
      if(allowedRoles[i] === this.getRole()){
        return true;
      }
    }
    return false;
  }

  public clear() {
    localStorage.clear();
  }
}

/*
  public setRoles(roles: []) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getRoles(): [] {
    return JSON.parse(localStorage.getItem('roles'));
  }
*/