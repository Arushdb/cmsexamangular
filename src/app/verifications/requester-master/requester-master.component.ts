
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
import { isNullOrUndefined } from 'util';



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
    public requesterListGrid: any=[];
    public requesterRefListGrid: any =[];
    //protected reqList:any[]= [];
    public ctr: number = 3;
    gridOptions: GridOptions;
    public defaultColDef;
    public defaultRefColDef;
    public selReqName:string ="";
    public selReqId:string ="";
    public refreshReqGrid:boolean = false;
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
      { headerName:'Pin Code', field: 'pincode' } 
     ]; 
     
     columnRefDefs = [
      { headerName:'ReferenceId', field: 'id', hide:true  },
      { headerName:'RequesterId', field: 'agencyid', hide:true },
      { headerName:'RequesterName', field: 'name', hide:true },
      { headerName:'Reference Number', field: 'reference_no', checkboxSelection: true},
      { headerName:'Received Date', field: 'reqrcvdate' },
      { headerName:'Request Mode', field: 'request_mode' },
      { headerName:'Reference Email', field: 'email' },
      { headerName:'ContactNumber', field: 'contact_number', hide:true },
      { headerName:'Status', field: 'processstatus', hide:true },
      { headerName:'Generated Date', field: 'gen_date', hide:true },
      { headerName:'User', field:'creator_id', hide:true},   
      { headerName:'EnrollmentNo', field:'enrolmentno', hide:true},
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
        this.requesterRefListGrid =[];
         this.getagencyList();
    }
     
    OnGridReady($event){
      this.agGrid.columnApi.autoSizeAllColumns(false);
      this.agGrid
    }
    
    getagencyList():void
    {
        this.refreshReqGrid = false;  
        this.spinnerstatus=true;
        let inMethod='verificationagency';
        this.subs.add= this.verservice.getdata(inMethod).subscribe(
                        res=>{
                          this.spinnerstatus=false;
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
      //this.requesterListGrid = res;
      this.requesterListGrid = [];
      for (var r of res)
      {
        if (r.authentic == true)  //requesters pending for approval
        {
          this.requesterListGrid.push(r);
        }
      } 
      this.refreshReqGrid = true;
    }

    onRefClicked(e) {
      let sel = e.rowData; //this.agGrid.api.getSelectedRows(); 
      console.log("Reference Add Clicked for rowData", sel);
      //this.agGrid.api.applyTransaction({ remove: [sel]});
      this.selRequester = sel;
      this.selReqName = sel.name;
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
      //let inMethod='verificationagencyreference/' + this.selReqId;
      //let inMethod='agencyreference/' + this.selReqId;
      let inMethod='agencyreferencebyprocessstatus/';
      let  v_params =new HttpParams();
      v_params=v_params.set("agencyid", this.selReqId)
                       .set("processstatus", "RCV");
        this.subs.add= this.verservice.getdataByIdStatus(v_params,inMethod).subscribe(
                        res=>{
                          this.spinnerstatus=false;
                          this.refresultHandler(res);   
                        },error=>{
                          console.log(error);
                          this.verservice.log(error.originalError.error.message);
                          this.spinnerstatus=false;
                          this.refresultHandler(null);   //no data
                        });
     
    }
    
    refresultHandler(res)
    {
      //this.agRefGrid.api.setRowData(res);
      if (!isNullOrUndefined(res))
      {
        console.log(res); 
        res.name = this.selReqName;
        res.creator_id = "EaxminationUser";  
        this.requesterRefListGrid.push(res);
      }
      /* for (var r of res)
      {
        if (r.process_status == "RCV")  //requesters pending for approval
        {
          this.requesterRefListGrid.push(r);
        }
      } */ 
      this.refreshReqGrid = false;
      this.showReqRefs = true;
    }

    onAddReqRef()
    {
        //call popup container to take inputs for new Requester.
        const dialogRef=  this.dialog.open(AddReferenceComponent, 
          {data:{width:"100px", height:"100px", title:"Confirmation",content:this.selRequester, ok:true,cancel:false,color:"warn"}
        });
        dialogRef.afterClosed().subscribe(res => {
          console.log("res after ref comp closed", res);
          this.requesterRefListGrid = res.result;
          this.verservice.clear();
          //refresh ref grid
          this.onRequestRefs();
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
        this.getagencyList();
      });
    }

    onAddRequester()
    {
        //call popup container to take inputs for new Requester.
        let approved = "true"; //for examination user 
        const dialogRef=  this.dialog.open(AddRequesterComponent, 
          {data:{width:"100px", height:"100px", title:"Add Requester",content:approved, ok:true,cancel:false,color:"warn"}
        });
        dialogRef.afterClosed().subscribe(res => {
          this.verservice.clear();
          //this.requesterListGrid = res.result;
          console.log("after close", res);
          this.getagencyList();
        });
    }
    
    onRefDeleteClicked(e) {
      let del = e.rowData; //this.agGrid.api.getSelectedRows(); 
      const dialogRef=  this.dialog.open(alertComponent,
        {data:{title:"Warning",content:"Are you sure to delete this request reference received on " + del.reqrcvdate + " date !", ok:true,cancel:true,color:"warn"}});
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
      this.refreshReqGrid = true;
      this.showReqRefs = false;
    }
    
    onAddRollNumbers(){
      this.showNewReqComp = true;
      this.showRequesterComp = false;
      const dialogRef=  this.dialog.open(AddRollNumberComponent, 
        {data:{width:"100px", height:"100px", title:"EnrollNumber",content:this.selReference, ok:true,cancel:false,color:"warn"}
      });
      dialogRef.afterClosed().subscribe(res => {
        //this.requesterRefListGrid = res.result;
        console.log(res);
      });
    }
    
  
}
