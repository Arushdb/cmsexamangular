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
    protected refList:any[]= [];
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
      debugger;
          this.verservice.clear;
    }
     
    ngOnDestroy(): void {
        this.subs.dispose();
        this.elementRef.nativeElement.remove();
    }

    ngOnInit() {
        this.refList = [];
        this.requesterRefForm = this.fb.group({
          referenceNo: ['', Validators.required],
          requestMode: ['', Validators.required],
          reqRcvDate: ['', Validators.required],
          contactNumber: [''],
          emailId: ['', [Validators.email]],
        }
       );
        this.showSubmit = true; //submit button 
     
    }
    
    onSubmit() {
           this.refList =[];
           if (this.requesterRefForm.invalid) {          
               return;
           }
         
       
          let  inpReqId = parseInt(this.agencyId);

          debugger;
           var inpRef = this.requesterRefForm.get('referenceNo').value;
           var inpReqMode = this.requesterRefForm.get('requestMode').value;
           var inpDate = this.requesterRefForm.get('reqRcvDate').value;
           var inpContact = this.requesterRefForm.get('contactNumber').value;
           var inpEmail = this.requesterRefForm.get('emailId').value;
           this.refList.push({select:false, id:this.ctr, requester_id:inpReqId, reference_no:inpRef, request_mode:inpReqMode, request_received_date:inpDate, Contact_no:inpContact,email_id:inpEmail,  process_status:"Received",generated_date:""});
           console.log("refList.length=", this.refList.length);
         
            let enrolno :any =[];
          
            let body1 :any = {"agencyid":inpReqId, "contact_number":""+inpContact, "email":inpEmail,
                              "reference_no":inpRef, "request_mode":inpReqMode, "reqrcvdate":inpDate, 
                              "processstatus":"RCV", "remarks":"","gen_date":"",
                              "creator_id": "EaxminationUser", "insert_time":"2021-11-28T08:14:46.000+00:00"};
           
           let body =this.requesterRefForm.getRawValue();
                              body.enrolmentno = enrolno;
            //console.log("reference formobj", formobj);
            this.subs.add=this.verservice.addVerificationReferences(body).subscribe(
            (res :any) =>{
            this.spinnerstatus=false;
            console.log(res);    
            this.verservice.log("Reference Data Saved Successfully.");
            this.spinnerstatus=false;
            this.closeConfirmWindow();
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
    
    disableInputs()
    {
      this.requesterRefForm.controls['referenceNo'].disable();
      this.requesterRefForm.controls['requestMode'].disable();
      this.requesterRefForm.controls['reqRcvDate'].disable();
      this.requesterRefForm.controls['emailId'].disable();
      this.requesterRefForm.controls['contactNumber'].disable();
    }
    onReset() {
        this.submitted = false;
        this.requesterRefForm.reset();
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
      this.dialogRef.close({ result: this.refList });
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
