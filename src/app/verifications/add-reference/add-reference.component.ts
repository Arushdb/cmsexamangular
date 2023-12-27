import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../services/user.service'; //'src/app/services/user.service';
import { SubscriptionContainer } from '../../shared/subscription-container';//'src/app/shared/subscription-container';
import {Location} from '@angular/common';
import { MyItem} from '../../interfaces/my-item';
import { isNullOrUndefined } from 'util';
import { alertComponent } from '../../shared/alert/alert.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { VerificationService } from '../../services/verification.service';


@Component({
  selector: 'app-add-reference',
  templateUrl: './add-reference.component.html',
  styleUrls: ['./add-reference.component.css']
})
export class AddReferenceComponent implements OnInit,OnDestroy  {
    public obj: any ;
 
    public requesterName:string;
  
    subs = new SubscriptionContainer();
    requesterRefForm: FormGroup;
    submitted = false;       
    spinnerstatus: boolean;
    showSubmit: boolean = true;
    enrolvalid: boolean;
    enrvaild: boolean;

    public ctr: number = 5;
  agencyId: any;
    
    constructor(
      private fb:FormBuilder,
      private dialogRef: MatDialogRef<AddReferenceComponent> ,
      @Inject(MAT_DIALOG_DATA) public data,
      private verservice:VerificationService,
      public mdialog: MatDialog, private elementRef:ElementRef
    ) {   
     // this.obj = this.data.content;
      this.agencyId=this.data.content.id;
      console.log("Data:",this.data);
      this.requesterName =this.data.content.name;
      
          this.verservice.clear;
    }
     
    ngOnDestroy(): void {
        this.subs.dispose();
        this.elementRef.nativeElement.remove();
    }

    ngOnInit() {
     
        this.requesterRefForm = this.fb.group({
          reference_no: ['', Validators.required],
          request_mode: ['', Validators.required],
          request_received_date: ['', Validators.required],
          contact_number: [''],
          email: ['', [Validators.email]],
        }
       );
        this.showSubmit = true; //submit button 
     
    }
    
    onSubmit() {
         
           if (this.requesterRefForm.invalid) {          
               return;
           }
         
       
          let  inpReqId = parseInt(this.agencyId);
      
            let enrolno :any =[];
              
        
           let body =this.requesterRefForm.getRawValue();
                              body.enrolmentno = enrolno;
                              body.agencyid=inpReqId;
                              body.processstatus="RCV";
            //console.log("reference formobj", formobj);
            this.subs.add=this.verservice.addVerificationReferences(body).subscribe(
            (res :any) =>{
            this.spinnerstatus=false;
            console.log(res);    
            this.verservice.log("Reference Data Saved Successfully.");
            this.spinnerstatus=false;
            this.dialogRef.close();
          
            //this.disableInputs();
            //debugger;
         },error=>{
           this.verservice.log("There is some problem." +error.originalError.error.message);
           this.spinnerstatus=false;
           return;
         });
    }
    
    // convenience getter for easy access to form fields
    get f() { return this.requesterRefForm.controls; }
    
   
    onReset() {
        this.submitted = false;
        this.requesterRefForm.reset();
    }

   
    
    onBackClose() {
      this.dialogRef.close(true);
    }  

    onchange(){
        //debugger;
        this.verservice.clear();
    }

}
