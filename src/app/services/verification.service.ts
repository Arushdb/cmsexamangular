
import { HttpClient,  HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  url:string;
  constructor(private httpclient:HttpClient, private messagesrv:MessageService) 
  {
    this.url=environment.url;
   
  }
  
  
 
    getdata(inpMethod){
    console.log("enviorment=",this.url);  
    var myurl ="";
    let headers: HttpHeaders= new HttpHeaders();
    myurl = this.url + inpMethod;
    console.log(console.log(myurl));
    const body = {};
    return  this.httpclient.get(myurl,{headers,responseType: 'json'});      
    
    }
    getdataById(paramId, myparam){
      var myurl ="";
      let headers: HttpHeaders= new HttpHeaders();
      myurl = this.url + myparam.method + paramId;
      console.log(console.log(myurl));
      return  this.httpclient.get(myurl,{headers,responseType: 'json'});      
    }
    
    getAgencyReferencesByStatus(params: HttpParams){
      var myurl ="";
      let method = 'agencyreferencebyprocessstatus';
      let headers: HttpHeaders= new HttpHeaders();
      console.log('params', params);
      myurl = this.url + method;
      console.log(console.log(myurl));
      return  this.httpclient.get(myurl,{headers,responseType: 'json', params});      
    }
  
    addVerificationAgency(body){
      
      let method = "verificationagency";
     
          return  this.httpclient.post(this.url+method,body,{responseType: 'json'});
    }

    updateVerificationAgency(body){
       var method = "verificationagency";
         
          return  this.httpclient.put(this.url+method,body,{responseType: 'json'});
    }

   

    addVerificationReferences(body){
      
      let method = "verificationagencyreference";
     
          return  this.httpclient.post(this.url+method,body,{responseType: 'json'});
    }
    
    addEnrolmentno(body){
      let method='verificationagencyreference';
         
      return  this.httpclient.put(this.url+method,body,{responseType: 'json'});
    }

    deleteEnrolmentno(id){                                        
      let method='enrolment';
         
      return  this.httpclient.delete(this.url+method+"/"+id,{responseType: 'text'});
    }

    deleteVerificationReferences(id){
     
      let method = "verificationagencyreference" ;
             
      return  this.httpclient.delete(this.url+method,{responseType:"text"});
     
    }

    printVerificationReferences(id){
     
      let method = "agencyreferencepdf" +"/"+id;
             
      return  this.httpclient.get(this.url+method,{responseType:"text"});
     
    }

    deleteVerificationAgency(id){
      
      let method = "verificationagency" ;
       
      return  this.httpclient.delete(this.url+method+"/"+id,{responseType: 'json'});
    }

   


   /** Log a UserService message with the MessageService */
  public log(message: string) {
    this.messagesrv.clear();
  this.messagesrv.add(`Verification Service: ${message}`);
  }

  public clear() {
    this.messagesrv.clear();
    }
  


    
}