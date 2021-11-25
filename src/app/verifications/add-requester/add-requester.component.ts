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

export function onlyDigits(formControl: FormControl): {[key: string]: boolean} {
  const DIGIT_EXPS = /^\d*$/;
  
  if (!formControl.value.match(DIGIT_EXPS)) {

    return {'NaN': true}
  } 
}

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
    
    constructor(
      private fb:FormBuilder,
      private dialogRef: MatDialogRef<AddRequesterComponent> ,
      @Inject(MAT_DIALOG_DATA) public data,
      private verservice:VerificationService,
      public mdialog: MatDialog, private elementRef:ElementRef
    ) {   
          console.log("------------------inside alert",data);
    }
     
    ngOnDestroy(): void {
        this.subs.dispose();
        this.elementRef.nativeElement.remove();
    }

    ngOnInit() {
        this.reqList = [];
        //this.reqList.push({select:false, id:'1', requester_name:"Authbridge", address:"", city:"", state:"", pincode:"", Contact_no:"",email_id:"qualificationcheck2@authbridge.co.in"});
        //this.reqList.push({select:false, id:'2', requester_name:"The District Basic Education Officer", address:"", city:"Agra", state:"Uttar Pradesh", pincode:"282010", Contact_no:"",email_id:"bsaagra12@gmail.com"});
           
        this.requesterForm = this.fb.group({
          name: ['', Validators.required],
          address: [''],
          city: [''],
          state: [''],
          pincode: [''],
          contactno: [''],
          email: ['', [Validators.required, Validators.email]],
          referenceno: [''],
          website: [''],
          authentic: [''],
        }
       );
        this.showSubmit = true; //submit button 
    }
    
    onSubmit() {
      //this.verservice.clear();
      this.reqList =[];
           if (this.requesterForm.invalid) {  
             console.log("requestForm is invalid");        
               return;
           }
            console.log("name ", this.requesterForm.get('name').value);
            
           var inpReqName = this.requesterForm.get('name').value;
           var inpAddress = this.requesterForm.get('address').value;
           var inpCity = this.requesterForm.get('city').value;
           var inpState = this.requesterForm.get('state').value;
           var inpPin = this.requesterForm.get('pincode').value;
           var inpContact = this.requesterForm.get('contactno').value;
           var inpEmail = this.requesterForm.get('email').value;
           /*this.reqList.push({select:false, id:'1', requester_name:"Authbridge", address:"", city:"", state:"", pincode:"", Contact_no:"",email_id:"qualificationcheck2@authbridge.co.in"});
           this.reqList.push({select:false, id:'2', requester_name:"The District Basic Education Officer", address:"", city:"Agra", state:"Uttar Pradesh", pincode:"282010", Contact_no:"",email_id:"bsaagra12@gmail.com"});   
           this.reqList.push({select:false, id:this.ctr++, requester_name:inpReqName, address:inpAddress, city:inpCity, state:inpState, pincode:inpPin, Contact_no:inpContact,email_id:inpEmail});
           console.log("reqList.length=", this.reqList.length);
           */
           let obj = {xmltojs:'N', method:'None' };   
           obj.method='verificationagency';
           let formobj :any = {"name":inpReqName, "address":inpAddress, "city":inpCity, "state":inpState, "pincode":inpPin, "contactno":inpContact, "email":inpEmail};
           console.log("formobj", formobj);
           
           this.subs.add=this.verservice.postdata(formobj,obj).subscribe(
            (res :any) =>{
              this.spinnerstatus=false;
              //res =  res.json();
              console.log(res);    
              //this.agencyresultHandler(res);
              this.verservice.log("Agency Data Saved Successfully. Approval is Awaited!");
              this.spinnerstatus=false;
            },error=>{
              this.verservice.log("There is some problem.");
              this.spinnerstatus=false;
            });
    }

    public  agencyresultHandler(res):void
    {
      const mdialogRef=  this.mdialog.open(alertComponent,
        {data:{title:"Information",content:"Requester with Id = 3 has been added", ok:true,cancel:false,color:"success"}});	
        this.closeConfirmWindow();
    }
    // convenience getter for easy access to form fields
    get f() { return this.requesterForm.controls; }

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