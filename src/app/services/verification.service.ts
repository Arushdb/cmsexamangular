
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
    //this.url= "http://exam.dei.ac.in:8080/cmsexam/api/";
    //this.url = "http://exam.dei.ac.in:8080/cmsexam/api/test/";
    console.log("base url:",this.url);
  }
  
   application="CMS";
  
   /*getdata(params: HttpParams,myparam){
        console.log("enviorment=",this.url);  
        var myurl ="";
        let headers: HttpHeaders= new HttpHeaders();
        myurl = this.url + "verificationagency";
        console.log(console.log(myurl));
        const body = {};
        return  this.httpclient.get(myurl,{headers,responseType: 'json'});      
        
    }
    */
 
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

  
    postdata(inpObj,inpMethod){
      var myurl ="";
      //let headers: HttpHeaders= new HttpHeaders();
      myurl = this.url+inpMethod ;
      let body=inpObj ;
      console.log("in post data",body);
      return  this.httpclient.post(myurl,body,{responseType: 'json'});
    }
    
    updatepostdata(inpObj,inpMethod){
      var myurl ="";
      myurl = this.url + inpMethod ;
      console.log("update url " + myurl);
      let body = inpObj ;
      console.log("in update put data",body);
      return  this.httpclient.put(myurl,body,{responseType: 'json'});
    }

    deletepostdata(inpId){
      var myurl ="";
      myurl = this.url + inpId ;
      console.log("update url " + myurl);
      return  this.httpclient.delete(myurl,{responseType: 'json'});
    }

    postFile(fileToUpload: File,myparam) {
        let headers: HttpHeaders= new HttpHeaders();
        const endpoint = this.url+'/uploadfile/uploadfile.htm';

        const formData: FormData = new FormData();

    //
   // formData.append('name', "myfile");
    formData.append('name', myparam.filename);
   formData.append('filekey', fileToUpload);
    //formData.append('filekey', fileToUpload, fileToUpload.name);

    const customHeaders = new HttpHeaders({
      'Authorization': 'Bearer' + localStorage.getItem('token'),
      'Accepted-Encoding': 'application/json'
    });
  
    const customOptions = {
      headers: customHeaders,
      reportProgress: true,
    };

    if(myparam.xmltojs=="Y"){
      headers=headers.set('format', 'format');// format the response data from xml to json
    }else{
      headers=headers.set('format', 'None');// do not format the response data from xml to json
    } 
    if( !isUndefined(myparam.filepath))
    headers=headers.set('filepath', myparam.filepath);
    if( !isUndefined(myparam.filename))
    headers=headers.set('filename', myparam.filename);
  

       
      
       //const endpoint = this.url;
        
       
       
        return this.httpclient
          .post(endpoint, formData, {headers:headers,reportProgress: true, observe: 'events'})
        //  return this.httpclient
        //    .post(endpoint, formData)
          
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