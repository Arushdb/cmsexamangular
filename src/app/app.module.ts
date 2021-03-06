import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {LoginModule} from 'src/app/login/login.module';
import {MenuModule} from 'src/app/menu/menu.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';





import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';




import {HttpinterceptorService} from './services/httpinterceptor.service';


import { SharedModule } from './shared/shared.module';





@NgModule({
  declarations: [
    AppComponent,
  


  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,

    LoginModule,
    MenuModule,



    // AgGridModule.withComponents([])




  ],
  entryComponents: [


  ],
  providers: [

    [
      {provide : HTTP_INTERCEPTORS, useClass: HttpinterceptorService, multi: true},
     // {provide : HTTP_INTERCEPTORS, useClass: FormatInterceptorService, multi: true}


    ]
  ],
  bootstrap: [AppComponent]
})


export class AppModule {

 }
