
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
  
  getAllAgency(){
    let method = "verificationagency";

    let options:Object ={responseType:'json'

    }
 

  
    return  this.httpclient.get(this.url+method,options);
  }

  getNonApprovedAgency(){
    let method = "authenticverificationagency/0";

    let options:Object ={responseType:'json'

    }

    return  this.httpclient.get(this.url+method,options);
  }

  getActiveAgency(){
    let method = "activeagency";

    let options:Object ={responseType:'json'

    }

    return  this.httpclient.get(this.url+method,options);
  }


  getEnrolmentNos(refid){
    let method = "verificationagencyreference"+"/"+refid;

    let options:Object ={responseType:'json'}
    
    return  this.httpclient.get(this.url+method,options);
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

    getVerificationAgency(id){
      
      let method = "verificationagency/"+id;
      let headers: HttpHeaders= new HttpHeaders();
       let params:HttpParams = new HttpParams();
       params.set("id",id);
      console.log('params', params);
     let  myurl = this.url + method;
      console.log(console.log(myurl));
      return  this.httpclient.get(myurl,{headers,responseType: 'json', params}); 
         
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
    addRollNo(body){
      let method='verificationagencyreference';
         
      return  this.httpclient.put(this.url+method,body,{responseType: 'json'});
    }

    deleteRollNo(id){                                        
      let method='rollno';
         
      return  this.httpclient.delete(this.url+method+"/"+id,{responseType: 'text'});
    }
    getRollNos(refid){
      let method = "verificationagencyreference"+"/"+refid;
  
      let options:Object ={responseType:'json'}
      
      return  this.httpclient.get(this.url+method,options);
    }

    deleteVerificationReferences(id){
     
      let method = "verificationagencyreference" ;
             
      return  this.httpclient.delete(this.url+method,{responseType:"text"});
     
    }

    printpdfVerificationReferences(id){
     
      let method = "getpdf" +"/"+id;
             
      return  this.httpclient.get(this.url+method,{responseType:"arraybuffer" as 'json'});
     
    }

    printdocVerificationReferences(id){
     
      let method = "getdoc" +"/"+id;
             
      return  this.httpclient.get(this.url+method,{responseType:"arraybuffer" as 'json'});
     
    }

    deleteVerificationAgency(id){
      
      let method = "deleteAgency" ;
       
      return  this.httpclient.put(this.url+method+"/"+id,{responseType: 'json'});
    }
   
      
      downloadFile(id) {
        
        let url ="http://exam.dei.ac.in:8080/cmsexam/"+"REPORTS/"+id+".pdf";
        return this.httpclient.get(url, {responseType: 'blob'});
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