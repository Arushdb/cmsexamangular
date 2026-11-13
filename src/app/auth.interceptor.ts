
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    //const token = this.authService.accessToken;
     const token = localStorage.getItem('token');

    const headers: { [name: string]: string } = {
      'X-APPLICATION-ID': 'CMSEXAM'
    };

    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    const authReq = req.clone({
      setHeaders: headers,
      withCredentials: true
    });

    return next.handle(authReq);
  }
}
