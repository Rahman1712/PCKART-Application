import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authService = this.injector.get(AuthService)
    let tokenizedReq = req.clone({
      setHeaders: {
        // Authorization: `Bearer xx.yy.zz`
        Authorization:  authService.getToken()!=null ?`Bearer ${authService.getToken()}`:''
      }
    })
    return next.handle(tokenizedReq)
  }


  // intercept(req:any,next:any) {
  //   let tokenizedReq = req.clone({
  //     setHeaders: {
  //       Authorization: 'Bearer xx.yy.zz'
  //     }
  //   })
  //   return next.handle(tokenizedReq)
  // }
}
