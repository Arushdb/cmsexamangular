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

export function onlyDigits(formControl: FormControl): {[key: string]: boolean} {
  const DIGIT_EXPS = /^\d*$/;
  
  if (!formControl.value.match(DIGIT_EXPS)) {

    return {'NaN': true}
  } 
}


@Component({
  selector: 'app-add-reference',
  templateUrl: './add-reference.component.html',
  styleUrls: ['./add-reference.component.css']
})
export class AddReferenceComponent implements OnInit,OnDestroy  {
    public obj: any = this.data.content;
    public requesterId:string=this.obj.id;
    public requesterName:string=this.obj.requester_name;
  
    subs = new SubscriptionContainer();
    requesterRefForm: FormGroup;
    submitted = false;       
    spinnerstatus: boolean;
    showSubmit: boolean = true;
    enrolvalid: boolean;
    enrvaild: boolean;
    protected refList:any[]= [];
    public ctr: number = 5;
    
    constructor(
      private fb:FormBuilder,
      private dialogRef: MatDialogRef<AddReferenceComponent> ,
      @Inject(MAT_DIALOG_DATA) public data,
      private userservice:UserService,
      public mdialog: MatDialog, private elementRef:ElementRef
    ) {   
          console.log("------------------inside add reference component: ",data);
    }
     
    ngOnDestroy(): void {
        this.subs.dispose();
        this.elementRef.nativeElement.remove();
    }

    ngOnInit() {
        this.refList = [];
        this.refList.push({select:false, id:'3', requester_id:"2", reference_no:"275/2292/2021-22", request_mode:"Post", request_received_date:"2021-10-07", Contact_no:"",email_id:"bsaagra12@gmail.com", process_status:"Received",generated_date:""});
        this.refList.push({select:false, id:'4', requester_id:"2", reference_no:"36590/26/49692/2020-21", request_mode:"Post", request_received_date:"2021-10-08", Contact_no:"",email_id:"bsaagra12@gmail.com", process_status:"Received",generated_date:""});
        this.requesterRefForm = this.fb.group({
          referenceNo: ['', Validators.required],
          requestMode: ['', Validators.required],
          reqRcvDate: ['', Validators.required],
          contactNumber: [''],
          emailId: ['', [Validators.email]],
        }
       );
        this.showSubmit = true; //submit button 
        console.log("ngOnInit requesterId=", this.requesterId, this.requesterName);
        //this.requesterRefForm.get("requesterId").setValue( this.requesterId);
        //this.requesterRefForm.get("requesterName").setValue(this.requesterName);
    }
    
    onSubmit() {
      //this.userservice.clear();
      this.refList =[];
           if (this.requesterRefForm.invalid) {          
               return;
           }
           //this.requesterRefForm.get('status').setValue('valid');
           //this.changedata.emit(this.requesterRefForm);      
           console.log("referenceNo ", this.requesterRefForm.get('referenceNo').value,
           this.requesterId);
           var inpReqId = this.requesterId;
           var inpRef = this.requesterRefForm.get('referenceNo').value;
           var inpReqMode = this.requesterRefForm.get('requestMode').value;
           var inpDate = this.requesterRefForm.get('reqRcvDate').value;
           var inpContact = this.requesterRefForm.get('contactNumber').value;
           var inpEmail = this.requesterRefForm.get('emailId').value;
           if (inpReqId == "1")
           {
              this.refList.push({select:false, id:'1', requester_id:"1", reference_no:"Your email", request_mode:"Email", request_received_date:"2021-10-04", Contact_no:"",email_id:"qualificationcheck2@authbridge.co.in", process_status:"Processed",generated_date:"2021-10-04"});
              this.refList.push({select:false, id:'2', requester_id:"1", reference_no:"Your email", request_mode:"Email", request_received_date:"2021-10-05", Contact_no:"",email_id:"qualificationcheck@authbridge.co.in", process_status:"Received",generated_date:""});
           }
           else if (inpReqId =="2"){
              this.refList.push({select:false, id:'3', requester_id:"2", reference_no:"275/2292/2021-22", request_mode:"Post", request_received_date:"2021-10-07", Contact_no:"",email_id:"bsaagra12@gmail.com", process_status:"Received",generated_date:""});
              this.refList.push({select:false, id:'4', requester_id:"2", reference_no:"36590/26/49692/2020-21", request_mode:"Post", request_received_date:"2021-10-08", Contact_no:"",email_id:"bsaagra12@gmail.com", process_status:"Received",generated_date:""});
           }
           this.refList.push({select:false, id:this.ctr, requester_id:inpReqId, reference_no:inpRef, request_mode:inpReqMode, request_received_date:inpDate, Contact_no:inpContact,email_id:inpEmail,  process_status:"Received",generated_date:""});
           console.log("refList.length=", this.refList.length);
           const mdialogRef=  this.mdialog.open(alertComponent,
            {data:{title:"Information",content:"Requester with Id = " + this.ctr + "has been added", ok:true,cancel:false,color:"success"}});	
            this.closeConfirmWindow();
           // display form values on success
          // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
    }
    
    // convenience getter for easy access to form fields
    get f() { return this.requesterRefForm.controls; }

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
        this.userservice.clear();
    }

}
