import { NgModule } from '@angular/core';


import { SignonformComponent } from './signonform/signonform.component';
import { SharedModule } from '../shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';

import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [SignonformComponent],

  imports: [
  SharedModule,
  RouterModule,
  LoginRoutingModule,

  ]
})
export class LoginModule { }
