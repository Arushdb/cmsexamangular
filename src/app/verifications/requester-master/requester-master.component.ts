
import { HttpParams } from '@angular/common/http';
//import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router, NavigationEnd } from '@angular/router';
import { SubscriptionContainer } from '../../shared/subscription-container';//'src/app/shared/subscription-container';
import { Location} from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { alertComponent } from '../../shared/alert/alert.component';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { AddRequesterComponent } from '../add-requester/add-requester.component';
import { AddReferenceComponent } from '../add-reference/add-reference.component';
import { AddRollNumberComponent } from '../add-roll-number/add-roll-number.component';
import { ButtonCellRendererComponent } from '../../shared/button-cell-renderer/button-cell-renderer.component';
import { VerificationService } from '../../services/verification.service';
import { ApproveRequesterComponent } from '../approve-requester/approve-requester.component';



@Component({
  selector: 'app-requester-master',
  templateUrl: './requester-master.component.html',
  styleUrls: ['./requester-master.component.css']
})


export class RequesterMasterComponent implements OnInit,OnDestroy {
    @ViewChild('agGrid') agGrid: AgGridAngular;
    @ViewChild('agRefGrid') agRefGrid: AgGridAngular;
    subs = new SubscriptionContainer();
    public showRequesterComp: boolean = true;
    public showNewReqComp:boolean = false;  //raise a new request  
    spinnerstatus: boolean;
    public requesterListGrid: any[]=[];
    public requesterRefListGrid: any[] =[];
    protected reqList:any[]= [];
    public ctr: number = 3;
    gridOptions: GridOptions;
    public defaultColDef;
    public defaultRefColDef;
    public selReqName:string ="";
    public selReqId:string ="";
    public showReqs:boolean = true;
    public showReqRefs:boolean= false;
    public selRequester: any[]=[];
    public selReference: any[]=[];
    protected showAddRollbtn:boolean = false;
    curDate = new Date;
    styleGrid: { width: string; height: string; flex: string; };
    
    columnDefs = [
      { headerName:'References',
        cellRendererFramework:ButtonCellRendererComponent,
        cellRendererParams: { onClick: this.onRefClicked.bind(this), label: 'View'}
      },
      { headerName:'RequesterId', field: 'id', hide:true }, //,checkboxSelection: true 
      { headerName:'RequesterName', field: 'name'},
      { headerName:'Email', field: 'email' },
      { headerName:'ContactNumber', field: 'Contactno' },
      { headerName:'Address', field: 'address' },
      { headerName:'City', field: 'city' },
      { headerName:'State', field: 'state' },
      { headerName:'Pin Code', field: 'pincode' },      
     ]; 
     
     columnRefDefs = [
      { headerName:'ReferenceId', field: 'id', hide:true  },
      { headerName:'RequesterId', field: 'requester_id', hide:true },
      { headerName:'RequesterName', field: 'requester_name', hide:true },
      { headerName:'Reference Number', field: 'reference_no', checkboxSelection: true},
      { headerName:'Received Date', field: 'request_received_date' },
      { headerName:'Request Mode', field: 'request_mode' },
      { headerName:'Reference Email', field: 'email_id' },
      { headerName:'ContactNumber', field: 'Contact_no', hide:true },
      { headerName:'Status', field: 'process_status', hide:true },
      { headerName:'Generated Date', field: 'generated_date', hide:true },
      { headerName:'Delete',
        cellRendererFramework:ButtonCellRendererComponent,
        cellRendererParams: { onClick: this.onRefDeleteClicked.bind(this), label: 'X'}
      },
     ]; 
  
    constructor(private router: Router,
      private verservice:VerificationService,
      private elementRef:ElementRef,
      private location:Location,
      private dialog: MatDialog) 
    {
      this.gridOptions = <GridOptions>{
        // enableSorting: true,
        // enableFilter: true               
       } ;
      this.defaultColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:false };
      this.defaultRefColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:false };
      this.styleGrid={width: '100%', height: '30%',flex: '1 1 auto'};
      this.subs.add =this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
          this.requesterListGrid=[];
          this.requesterRefListGrid=[];
          this.ngOnInit();    
        }
      });
    }
     
    ngOnDestroy(): void {
        this.subs.dispose();
        this.elementRef.nativeElement.remove();
    }

    ngOnInit() {
        this.requesterListGrid = [];
        //this.requesterListGrid.push({select:false, id:'1', requester_name:"Authbridge", address:"", city:"", state:"", pincode:"", Contact_no:"",email_id:"qualificationcheck2@authbridge.co.in"});
        //this.requesterListGrid.push({select:false, id:'2', requester_name:"The District Basic Education Officer", address:"", city:"Agra", state:"Uttar Pradesh", pincode:"282010", Contact_no:"",email_id:"bsaagra12@gmail.com"});
        this.getagencyList();
    }
     
    OnGridReady($event){
      this.agGrid.columnApi.autoSizeAllColumns(false);
      this.agGrid
    }
    
    getagencyList():void
    {
        let obj = {xmltojs:'N', method:'None' }; 
        let  v_params =new HttpParams();
        this.spinnerstatus=true;
        obj.method='verificationagency';
        v_params=v_params.set("time", this.curDate.toString());
        this.subs.add= this.verservice.getdata(v_params,obj).subscribe(
                        res=>{
                          this.spinnerstatus=false;
                          res = JSON.parse(res);
                          this.agencyresultHandler(res);
                         // console.log(res);    
                        },error=>{
                          //console.log(error);
                          this.verservice.log("There is some problem." +error.originalError.error.message);
                          this.spinnerstatus=false;
                        });
    }
    
    agencyresultHandler(res)
    {
      //console.log("agency", res.Details.item);
      //this.requesterListGrid = res;
      this.requesterListGrid = [];
      for (var r of res)
      {
        if (r.authentic == true)  //requesters pending for approval
        {
          this.requesterListGrid.push(r);
        }
      } 
    }

    onRefClicked(e) {
      let sel = e.rowData; //this.agGrid.api.getSelectedRows(); 
      console.log("Reference Add Clicked for rowData", sel);
      //this.agGrid.api.applyTransaction({ remove: [sel]});
      this.selRequester = sel;
      this.selReqName = sel.requester_name;
      this.selReqId = sel.id;
      console.log("Clicked Requester :", this.selReqName, this.selReqId);
      this.onRequestRefs();
    }
    
    onRowSelected(event){
      this.verservice.clear();
    /*  const gridData = this.agGrid.api.getSelectedNodes();
      const selectedGridItem = gridData.map(node => node.data );
        if(selectedGridItem.length>1){
          this.verservice.log("Please select only One");
          this.gridOptions.api.deselectAll();
          return;
        }
        else
        {
          for(var selgridItem of selectedGridItem)
          {			
            //show request reference grid.
            this.selRequester = selgridItem;
            this.selReqName = selgridItem.requester_name;
            this.selReqId = selgridItem.id;
          } 
        } 
        console.log("Selected Requester :", this.selReqName, this.selReqId); */
    }
    
    onRequestRefs(){
      
      this.requesterRefListGrid = [];
      if (this.selReqId == "1")
      {
        this.requesterRefListGrid.push({select:false, id:'1', requester_id:"1", requester_name:this.selReqName, reference_no:"Your email", request_mode:"Email", request_received_date:"2021-10-04", Contact_no:"",email_id:"qualificationcheck2@authbridge.co.in", process_status:"Processed",generated_date:"2021-10-04"});
        this.requesterRefListGrid.push({select:false, id:'2', requester_id:"1", requester_name:this.selReqName, reference_no:"Your email", request_mode:"Email", request_received_date:"2021-10-05", Contact_no:"",email_id:"qualificationcheck@authbridge.co.in", process_status:"Received",generated_date:""});
      }
      else if (this.selReqId == "2"){
      this.requesterRefListGrid.push({select:false, id:'3', requester_id:"2", requester_name:this.selReqName, reference_no:"275/2292/2021-22", request_mode:"Post", request_received_date:"2021-10-07", Contact_no:"",email_id:"bsaagra12@gmail.com", process_status:"Received",generated_date:""});
      this.requesterRefListGrid.push({select:false, id:'4', requester_id:"2", requester_name:this.selReqName, reference_no:"36590/26/49692/2020-21", request_mode:"Post", request_received_date:"2021-10-08", Contact_no:"",email_id:"bsaagra12@gmail.com", process_status:"Received",generated_date:""});
      }
      this.showReqs = false;
      this.showReqRefs = true;
    }

    onAddReqRef()
    {
        //call popup container to take inputs for new Requester.
        const dialogRef=  this.dialog.open(AddReferenceComponent, 
          {data:{width:"100px", height:"100px", title:"Confirmation",content:this.selRequester, ok:true,cancel:false,color:"warn"}
        });
        dialogRef.afterClosed().subscribe(res => {
          this.requesterRefListGrid = res.result;
        });
    }

    onApproveAgency()
    {
      const dialogRef=  this.dialog.open(ApproveRequesterComponent, 
        {data:{ title:"Approve Agency",content:"", ok:true,cancel:false,color:"warn"}, 
        width:"100%",height:"70%"
      });
      dialogRef.afterClosed().subscribe(res => {
        this.verservice.clear();
        //this.requesterListGrid = res.result;
        console.log("after close", res);
      });
    }

    onAddRequester()
    {
        //call popup container to take inputs for new Requester.
        const dialogRef=  this.dialog.open(AddRequesterComponent, 
          {data:{width:"100px", height:"100px", title:"Add Requester",content:"", ok:true,cancel:false,color:"warn"}
        });
        dialogRef.afterClosed().subscribe(res => {
          this.verservice.clear();
          //this.requesterListGrid = res.result;
          console.log("after close", res);
        });
    }
    
    onRefDeleteClicked(e) {
      let del = e.rowData; //this.agGrid.api.getSelectedRows(); 
      const dialogRef=  this.dialog.open(alertComponent,
        {data:{title:"Warning",content:"Are you sure to delete this request reference received on " + del.request_received_date + " date !", ok:true,cancel:true,color:"warn"}});
      console.log("Delete Reference Clicked for rowData", del);

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if(result){
          this.agRefGrid.api.applyTransaction({ remove: [del]});
        }
      });
    }

    onCancel(){
        this.elementRef.nativeElement.remove();
        //this.location.back();
        //this.dialogRef.close();
        this.location.replaceState('/');
        this.router.navigate(['login']);

    }  

    onchange(){
        //debugger;
        this.verservice.clear();
    }

    OnRefGridReady($event){
      this.agRefGrid.columnApi.autoSizeAllColumns(false);
      this.agRefGrid
    }
    
    onRefRowSelected(event){
      this.verservice.clear();
      const refgridData = this.agRefGrid.api.getSelectedNodes();
      const selectedRefGridItem = refgridData.map(node => node.data );
        if(selectedRefGridItem.length>1){
          this.verservice.log("Please select only One");
          this.gridOptions.api.deselectAll();
          return;
        }
        if(event.node.selected)
        {
          console.log("event.data", event.data);
          this.showAddRollbtn = true;
          this.selReference = event.data;
          /*for(var selgridItem of selectedRefGridItem)
          {			
            this.selReference = selgridItem;
            //show request reference grid.
          } */
        }
        else{
          this.showAddRollbtn = false;
        }
    }

    onRefBack(){
      this.showReqs = true;
      this.showReqRefs = false;
    }
    
    onAddRollNumbers(){
      this.showNewReqComp = true;
      this.showRequesterComp = false;
      const dialogRef=  this.dialog.open(AddRollNumberComponent, 
        {data:{width:"100px", height:"100px", title:"RollNumber",content:this.selReference, ok:true,cancel:false,color:"warn"}
      });
      dialogRef.afterClosed().subscribe(res => {
        //this.requesterRefListGrid = res.result;
        console.log(res.result);
      });
    }
    
  
}
