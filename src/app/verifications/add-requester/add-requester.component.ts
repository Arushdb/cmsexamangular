import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router, NavigationEnd } from '@angular/router';
import { SubscriptionContainer } from '../../shared/subscription-container';//'src/app/shared/subscription-container';
import {Location} from '@angular/common';
import { MyItem} from '../../interfaces/my-item';
import { isNullOrUndefined } from 'util';
import { alertComponent } from '../../shared/alert/alert.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { VerificationService } from '../../services/verification.service';


@Component({
  selector: 'app-add-requester',
  templateUrl: './add-requester.component.html',
  styleUrls: ['./add-requester.component.css']
})
export class AddRequesterComponent implements OnInit,OnDestroy  {
    subs = new SubscriptionContainer();
    requesterForm: FormGroup;
    submitted = false;       
    spinnerstatus: boolean;
    showSubmit: boolean = true;
    enrolvalid: boolean;
    enrvaild: boolean;
    protected reqList:any[]= [];
    public ctr: number = 3;
    approved: boolean = false;

    constructor(
      private fb:FormBuilder,
      private dialogRef: MatDialogRef<AddRequesterComponent> ,
      @Inject(MAT_DIALOG_DATA) public data,
      private verservice:VerificationService,
      public mdialog: MatDialog, private elementRef:ElementRef
    ) {   
          console.log("------------------inside addrequester ",data);
          this.verservice.clear();
    }
     
    ngOnDestroy(): void {
        this.subs.dispose();
        this.elementRef.nativeElement.remove();
    }

    ngOnInit() {
        this.reqList = [];
        this.requesterForm = this.fb.group({
          name: ['', Validators.required],
          address: [''],
          city: [''],
          state: [''],
          pincode: ['', Validators.pattern('^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$')],
          contactno: ['', Validators.pattern('^[0-9]{10}$')],
          email: ['', [Validators.required, Validators.email]],
          referenceno: null,
          website: [''],
          authentic: [false], 
        }
       );
        this.showSubmit = true; //submit button
        this.verservice.clear();
    }

    onSubmit() {
          //this.verservice.clear();
          this.reqList =[];
          this.submitted = true;
      
          if (this.requesterForm.invalid) {  
               console.log("requestForm is invalid");        
               return;
           }
           
          
            
         let formobj = this.requesterForm.getRawValue();
         
           this.subs.add=this.verservice.addVerificationAgency(formobj).subscribe(
            (res :any) =>{
              this.spinnerstatus=false;
                 
              this.verservice.log("Agency Data Saved Successfully. Approval is Awaited!");
              this.spinnerstatus=false;
              this.dialogRef.close(true);
          
            },error=>{
              this.spinnerstatus=false;
              this.verservice.log(error);
              
            });
    }

    // convenience getter for easy access to form fields
    get f() { return this.requesterForm.controls; }

    disableInputs()
    {
      this.requesterForm.controls['name'].disable();
      this.requesterForm.controls['address'].disable();
      this.requesterForm.controls['city'].disable();
      this.requesterForm.controls['state'].disable();
      this.requesterForm.controls['pincode'].disable();
      this.requesterForm.controls['email'].disable();
      this.requesterForm.controls['contactno'].disable();
    }

    onReset() {
        this.submitted = false;
        this.requesterForm.reset();
    }

    //This function Close popup window on click of cancel button on window
    public cancelConfirmWindow():void 
    {
      this.closeConfirmWindow();
    } 

    //This function Close popup window on click of close sign at corner on window
    public closeConfirmWindow():void
    {
      //PopUpManager.removePopUp(this);			
      this.dialogRef.close({ result: this.reqList });
      return;
    }
    
    onBackClose() {
      this.dialogRef.close(true);
    }  

    onchange(){
        //debugger;
        this.verservice.clear();
    }

}