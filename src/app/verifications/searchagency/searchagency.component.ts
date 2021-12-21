import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { CustomComboboxComponent } from '../../shared/custom-combobox/custom-combobox.component';
import { MyItem} from '../../interfaces/my-item';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { SubscriptionContainer } from '../../shared/subscription-container';
import {Location} from '@angular/common';
import { alertComponent } from '../../shared/alert/alert.component';
import { AddRequesterComponent } from '../add-requester/add-requester.component';
import { AddRollNumberComponent } from '../add-roll-number/add-roll-number.component';
import { VerificationService } from '../../services/verification.service';

@Component({
  selector: 'app-searchagency',
  templateUrl: './searchagency.component.html',
  styleUrls: ['./searchagency.component.css']
})
export class SearchagencyComponent implements AfterViewInit,OnDestroy {
  @ViewChild('CustomComboboxComponent') custcombo: CustomComboboxComponent;
  combowidth: string;
  agencyCombolabel : string ='Select Verification Agency';
  agencyCombo : MyItem[] = [];
  //agencyCombo : any[] = [];
  urlagencyList :string='';
  urlgenerate :string='';
  params = new HttpParams().set('application','CMS');
  curDate = new Date;
  mask:boolean = true;
  selectedagencyId : string ="";
  selectedagencyNm : string ="";
  agencyDtlobj :any = null;
  showOk:boolean = true;
  subs = new SubscriptionContainer();
  enableOkBtn:boolean = false;
  public selReference: any=[];
  spinnerstatus:boolean=false;
  lbltext :string ="";
  constructor(private router:Router,
    private verservice:VerificationService,
    private route:ActivatedRoute,
    private elementRef:ElementRef,
    private location:Location,
    public dialog: MatDialog,
    private renderer:Renderer2) { }

  ngOnInit(): void {
    this.getagencyList();
  }
  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
   
  }

onAddRequester()
{
      //call popup container to take inputs for new Requester.
      this.verservice.clear();
      let approved = "false"; //its from online mode and needs to be approved by Examination User.
      const dialogRef=  this.dialog.open(AddRequesterComponent, 
        {data:{width:"100px", height:"100px", title:"Confirmation",content:approved, ok:true,cancel:false,color:"warn"}
      });
      dialogRef.afterClosed().subscribe(res => {
        //this.requesterListGrid = res.result;
      });
}

public getagencyList():void
{
    this.spinnerstatus=true;
    
    this.subs.add= this.verservice.getAllAgency().subscribe(
                    res=>{
                      this.spinnerstatus=false;
                      this.agencyresultHandler(res);   
                    },error=>{
                      this.verservice.log("There is some problem.");
                      this.spinnerstatus=false;
                    });
}

public  agencyresultHandler(res):void
{
  if(!isNullOrUndefined(res) )
	{	
		for (var  o of res){
      this.agencyCombo.push({id:o.id,label:o.name});
		}	
  } 
  this.combowidth = "100%";
}

public agencyChangeHandler(obj):void
{	
	if (obj.id === "-1" )
	{
    this.selectedagencyId = "";
    this.enableOkBtn = false;
	}
	else
	{
    this.selectedagencyId = obj.id;
    this.selectedagencyNm = obj.label;
    this.enableOkBtn = true;
    //this.selReference = {"agency_id":obj.id, "name":obj.lablel, "reference_no":"Online Request", "request_received_date":this.curDate,"request_mode":"Online", "email":"", "contact_number":"", "process_status":"RCV", "generated_date":"", "creator_id":"Online", "enrolno":""};
    this.selReference = {"agency_id":"20", "name":obj.label, "reference_no":"Online Request", "request_received_date":this.curDate,"request_mode":"Online", "email":"", "contact_number":"", "process_status":"RCV", "generated_date":"", "creator_id":"Online", "enrolno":""};
    console.log("selected agency Id=" + this.selectedagencyId + "-" + this.selectedagencyNm, this.selReference);
    
  }
  this.lbltext="";
	return;
  }

  
  onAddEnrollNumbers(){
    this.selReference = {"agency_id":"20", "name":"", "reference_no":"Online Request", "request_received_date":this.curDate,"request_mode":"Online", "email":"", "contact_number":"", "process_status":"RCV", "generated_date":"", "creator_id":"Online", "enrolno":""};
    console.log("selected agency Id=" + this.selectedagencyId + "-" + this.selectedagencyNm, this.selReference);

    const dialogRef=  this.dialog.open(AddRollNumberComponent, 
      {data:{width:"100px", height:"100px", title:"EnrollmentNumber",content:this.selReference, ok:true,cancel:false,color:"warn"}
    });
    dialogRef.afterClosed().subscribe(res => {
      //this.requesterRefListGrid = res.result;
      console.log(res.result);
    });
  }
  
  onGetSelRequester(){
   console.log("get data to Modify selected agency id=", this.selectedagencyId);
   let obj = {xmltojs:'N', method:'None' }; 
   let paramId = this.selectedagencyId;
   this.spinnerstatus=true;
   obj.method='/verificationagency/';
   this.subs.add= this.verservice.getdataById(paramId,obj).subscribe(
                   res=>{
                     this.spinnerstatus=false;
                    // res = JSON.parse(res);
                     console.log("get data by Id ", res); 
                     this.getDataByIdHandler(res);
                   },error=>{
                     this.verservice.log("There is some problem in get data.");
                     this.spinnerstatus=false;
                   });
  }
  
  public  getDataByIdHandler(res):void
  {
    let o = res;
    
    if(!isNullOrUndefined(o) )
    {	
      this.agencyDtlobj =res;
      this.lbltext = "Name:" + o.name +  " Address: " + o.address + " " + o.city + " " + o.state + " " + o.pincode 
          + " EmailId:" + o.email + " ContactNo:" + o.contactno;	
    } 
    this.combowidth = "100%";
  }
  
  onModifyRequester()
  {
    let methodnId ='/verificationagency';
    this.agencyDtlobj.name = "Updated " + this.agencyDtlobj.name;
    this.subs.add=this.verservice.updateVerificationAgency(this.agencyDtlobj).subscribe(
     (res :any) =>{
       this.spinnerstatus=false;
       console.log(res);    
       this.verservice.log("Agency Data Updated Successfully.");
       this.spinnerstatus=false;
     },error=>{
       this.verservice.log("There is some problem.");
       this.spinnerstatus=false;
     });
  }

  onDeleteRequester(){    
    const adialogRef = this.dialog.open(alertComponent,
      {data:{title:"Confirmation",content:"Are you sure to delete Agency :" + "\n" + this.selectedagencyNm + " ?", ok:true,cancel:true,color:"warn"}});
      console.log("Delete selected agency id=", this.selectedagencyId);

    adialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      debugger;
      if(result){
     

        this.subs.add=this.verservice.deleteVerificationAgency(this.selectedagencyId).subscribe(
          (res :any) =>{
            this.spinnerstatus=false;
            console.log(res);    
            this.verservice.log("Agency Data deleted Successfully.");
            this.spinnerstatus=false;
          },error=>{
            this.verservice.log("There is some problem in deleting data.");
            this.spinnerstatus=false;
          });
      }
    });
  }
}

