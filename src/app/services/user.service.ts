import { HttpClient,  HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

import { isUndefined } from 'typescript-collections/dist/lib/util';

import {environment} from '../../environments/environment'; // 'src/environments/environment'

	

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'http://localhost:8080/cmsexam/api/auth/';
  constructor(private httpclient: HttpClient,
              private messagesrv: MessageService

    ) {
  // this.url = environment.url;
  console.log('Envirnment:', this.url);

    }


 // url="http://admission.dei.ac.in:8085/CMS" ;
 // url="http://localhost:8080/CMS" ;


  // url="http://125.17.153.215:8089/CMS" ;
  // url="http://10.154.0.112:8089/CMS" ;



   application = 'CMS';

   getdata(params: HttpParams, myparam){
    console.log('enviorment=', this.url);

    let myurl = '';
    let headers: HttpHeaders = new HttpHeaders();


   // console.log("XMLJS flag",params.get("xmltojs"));
    // if(params.get("xmltojs")=="Y"){
    //   console.log("in xmljs");
    //   headers=headers.append('format', 'format');// format the response data from xml to json
    // }else{
    //   headers=headers.append('format', 'None');// format the response data from xml to json
    // }
    if (myparam.xmltojs == 'Y'){
      headers = headers.set('format', 'format'); // format the response data from xml to json
    }else{
      headers = headers.set('format', 'None'); // format the response data from xml to json
    }

    // console.log(params.get('method'));
    console.log(this.url);
    console.log('params', params);

    // myurl = this.url+params.get('method') ;
    myurl = this.url + myparam.method ;
    console.log(console.log(myurl));
   // return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
    const body = {};

    return  this.httpclient.get(myurl, {headers, responseType: 'text', params});


    }


     postdata(params, myparam){
      let myurl = '';
      let headers: HttpHeaders = new HttpHeaders();



      if (myparam.xmltojs == 'Y'){
        headers = headers.set('format', 'format'); // format the response data from xml to json
      }else{
        headers = headers.set('format', 'None'); // do not format the response data from xml to json
      }


      myurl = this.url + myparam.method ;
     // console.log(console.log(myurl));
     // return  this.httpclient.get(myurl,{headers,responseType: 'text',params});

     // console.log("in post data",params);
     
      return  this.httpclient.post(myurl, {headers, params, responseType: 'text'});


      }




   /** Log a UserService message with the MessageService */
  public log(message: string) {
    this.messagesrv.clear();
    this.messagesrv.add(`User Service: ${message}`);
  }

  public clear() {
    this.messagesrv.clear();
    }




     }



