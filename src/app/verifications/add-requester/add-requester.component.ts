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
    approved: boolean = this.data.content;

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
          referenceno: [''],
          website: [''],
          authentic: [''],
        }
       );
        this.showSubmit = true; //submit button
        this.verservice.clear();
    }

    onSubmit() {
          //this.verservice.clear();
          this.reqList =[];
          this.submitted = true;
          console.log("this.requesterForm.invalid ", this.requesterForm.invalid);
          if (this.requesterForm.invalid) {  
               console.log("requestForm is invalid");        
               return;
           }
           
          console.log("name ", this.requesterForm.get('name').value);
            
          let inpReqName = this.requesterForm.get('name').value;
          let inpAddress = this.requesterForm.get('address').value;
          let inpCity = this.requesterForm.get('city').value;
          let inpState = this.requesterForm.get('state').value;
          let inpPin = this.requesterForm.get('pincode').value;
          let inpContact = this.requesterForm.get('contactno').value;
          let inpEmail = this.requesterForm.get('email').value;
          let inpAuthentic =  this.approved;  
          let inMethod = 'verificationagency';
          let formobj :any = {"name":inpReqName, "address":inpAddress, "city":inpCity, "state":inpState, "pincode":inpPin, "contactno":inpContact, "email":inpEmail, "authentic":inpAuthentic};
           console.log("formobj", formobj);
           
           this.subs.add=this.verservice.postdata(formobj, inMethod).subscribe(
            (res :any) =>{
              this.spinnerstatus=false;
              console.log(res);    
              this.verservice.log("Agency Data Saved Successfully. Approval is Awaited!");
              this.spinnerstatus=false;
              this.disableInputs();
            },error=>{
              this.verservice.log("There is some problem.");
              this.spinnerstatus=false;
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