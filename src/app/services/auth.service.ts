import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { SubscriptionContainer } from '../shared/subscription-container';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  subs = new SubscriptionContainer();
  login_params: HttpParams ;

  constructor(private userservice:UserService,) {
  
   }

  logout() :void { 
      
    localStorage.setItem('isLoggedIn','false');    
    localStorage.removeItem('token'); 
    localStorage.removeItem('tokentype'); 
    localStorage.removeItem('username'); 
     
    }    


    login(credentials){
     


    }

    isLoggedIn(){
      
      let token = localStorage.getItem("token");
 
      let jwthelper= new JwtHelperService();

      if(!token)
       return false;
       //debugger;

      let expirationDate =jwthelper.getTokenExpirationDate(token);
      let isExpired= jwthelper.isTokenExpired(token);
    
      return !isExpired;

    }

}
