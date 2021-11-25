import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

 // url = 'http://localhost:8080/cmsexam/api/auth/';

  url:string;
  constructor(private httpclient: HttpClient,
    private messagesrv: MessageService) { 
      this.url=environment.url;
    }

    signin(params:HttpParams){
      let myurl = '';
      let headers: HttpHeaders = new HttpHeaders();

        myurl = this.url +"auth/signin" ;
        let body ={
          "username":params.get("username"),
          "password":params.get("password")
        };
           
    //debugger;    
      return  this.httpclient.post(myurl, body, {withCredentials:true,responseType:"json"} );


      }


}
