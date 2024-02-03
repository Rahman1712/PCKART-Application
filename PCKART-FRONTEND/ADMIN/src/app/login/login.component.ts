import { Component, OnInit } from '@angular/core';
import { AuthenticationRequest } from '../_model-dto/admin/authenticationRequest';
import { AuthenticationResponse } from '../_model-dto/admin/authenticationResponse';
import { AuthService } from '../_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private _auth: AuthService,
     private _router: Router,
      private route: ActivatedRoute){}
 
  ngOnInit(): void {
    if (this._auth.loggedIn()) {
      this._router.navigate(['/']);
    }
  }

  adminLoginDetail:AuthenticationRequest = new AuthenticationRequest();
  // token!: AuthenticationResponse;
  loginError: boolean = false;
  errorMsg: string = 'error';
  loggedOut: boolean = false;

  loginUser(){
    this._auth.clear()
    //console.log(this.adminLoginDetail)
    this._auth.loginUser(this.adminLoginDetail)
    .subscribe(
      { 
        next: (next:AuthenticationResponse) => {
          console.log(next)
          this._auth.setToken(next.token);
          this._auth.setUserName(next.username)
          this._auth.setRole(next.role);

          this._router.navigate(['/dashboard'])
          //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          //this._router.navigateByUrl(returnUrl);
          this.loggedOut = false;
          this.loginError = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loginError = true;
          this.errorMsg = error.error.errorMessage
        }
      }
    );
  }

  isErrorOnLogin(){
    return this.loginError;
  }

  isLoggedOut(){
    return this.loggedOut;
  }
}


 /*
  loginUser(){
    console.log(this.adminLoginDetail)
    this._auth.loginUser(this.adminLoginDetail)
    .subscribe(
      { 
        next: next => {
          console.log(next)
          localStorage.setItem('token', next.token)
        },
        error: console.error
      }
    );
  }
  */
  // loginUser(){
  //   console.log(this.adminLoginDetail)
  //   this._auth.loginUser(this.adminLoginDetail)
  //     .subscribe(
  //       (response: AuthenticatorResponse) =>{
  //         console.log(response)
  //         this.token = response;
  //       },
  //       (error: HttpErrorResponse) =>{
  //         console.log(error)
  //         alert(error.message);
  //       }
  //     )
  // }