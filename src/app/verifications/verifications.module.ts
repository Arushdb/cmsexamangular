import { NgModule } from '@angular/core';

import { VerificationsRoutingModule } from './verifications-routing.module';
import { RequesterMasterComponent } from './requester-master/requester-master.component';
import { AddRollNumberComponent } from './add-roll-number/add-roll-number.component';
import { AddRequesterComponent } from './add-requester/add-requester.component';
import { AddReferenceComponent } from './add-reference/add-reference.component';
import { SearchagencyComponent } from './searchagency/searchagency.component';
import { SharedModule } from '../shared/shared.module';
import { ApproveRequesterComponent } from './approve-requester/approve-requester.component';

@NgModule({
  declarations: [RequesterMasterComponent, AddRollNumberComponent, AddRequesterComponent, AddReferenceComponent, SearchagencyComponent,  ApproveRequesterComponent],
  imports: [
    VerificationsRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddRequesterComponent, 
    AddReferenceComponent,
    AddRollNumberComponent,
  ]
})
export class VerificationsModule { }
