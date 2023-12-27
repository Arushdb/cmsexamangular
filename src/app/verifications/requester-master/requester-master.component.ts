
import { HttpParams } from '@angular/common/http';
//import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router, NavigationEnd } from '@angular/router';
import { SubscriptionContainer } from '../../shared/subscription-container';//'src/app/shared/subscription-container';
import { Location} from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
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
    protected showbtn:boolean = false;
    curDate = new Date;
    styleGrid: { width: string; height: string; flex: string; };
    
    columnDefs = [
      { headerName:'References',
        cellRendererFramework:ButtonCellRendererComponent,
        cellRendererParams: { onClick: this.onRefClicked.bind(this), label: 'View'}
      },
      { headerName:'Agency',
        cellRendererFramework:ButtonCellRendererComponent,
        cellRendererParams: { onClick: this.onEdit.bind(this), label: 'Edit'}
      },
      { headerName:'Agency',
        cellRendererFramework:ButtonCellRendererComponent,
        cellRendererParams: { onClick: this.onDelete.bind(this), label: 'Delete'}
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
      { headerName:'ReferenceId', field: 'id'  },
  
      { headerName:'RequesterName', field: 'name', hide:true },
      { headerName:'Reference Number', field: 'reference_no', checkboxSelection: true},
      { headerName:'Received Date', field: 'reqrcvdate' },
      { headerName:'Request Mode', field: 'request_mode' },
      { headerName:'Reference Email', field: 'email' },
      
      { headerName:'Status', field: 'processstatus' },
      { headerName:'Generated Date', field: 'gen_date' },
  
 
      { headerName:'Delete',
        cellRendererFramework:ButtonCellRendererComponent,
        cellRendererParams: { onClick: this.onRefDeleteClicked.bind(this), label: 'X'}
      }
     

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
      this.defaultRefColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:true };
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
        this.showReqRefs=false;
         this.getagencyList();
      
    }
     
    OnGridReady($event){
      this.agGrid.columnApi.autoSizeAllColumns(false);
     
    }
    
    getagencyList():void
    {
        this.refreshReqGrid = false;  
        this.spinnerstatus=true;
      
        this.subs.add= this.verservice.getActiveAgency().subscribe(
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
      this.showReqRefs=true;
      
      this.showbtn=false;
      let sel = e.rowData; //this.agGrid.api.getSelectedRows(); 
      console.log("Reference Add Clicked for rowData", sel);
      //this.agGrid.api.applyTransaction({ remove: [sel]});
      this.selRequester = sel;
      this.selReqName = sel.name;
      this.selReqId = sel.id;
      console.log("Clicked Requester :", this.selReqName, this.selReqId);
      this.getAgencyReferencesByStatus();
    }
    onEdit(e) {
      let sel = e.rowData; //this.agGrid.api.getSelectedRows(); 
      
      console.log("Reference Add Clicked for rowData", sel);
      //this.agGrid.api.applyTransaction({ remove: [sel]});
      this.selRequester = sel;
      this.selReqName = sel.name;
      this.selReqId = sel.id;
      console.log("Clicked Requester :", this.selReqName, this.selReqId);

      this.verservice.getVerificationAgency(this.selReqId).
      subscribe((res:any)=>{console.log(res);
       

          const dialogRef=  this.dialog.open(AddRequesterComponent, 
            {data:{
              width:"20%",height:"20%",
            title:"View Agency",content:res, ok:true,cancel:false,color:"warn",mode:"edit"}
          });
          //dialogRef.close();
          dialogRef.afterClosed().subscribe(res => {
           // console.log("res after ref comp closed", res);
            //this.requesterRefListGrid = res.result;
            this.verservice.clear();
            if (res!=='back')
            this.verservice.log(res);
            this.getagencyList();
            //refresh ref grid
            //this.getAgencyReferencesByStatus();
          });
     
    
      
      },
      (error:Error)=>{console.log(error.message);
      
      
      
      });
    }

    onDelete(e) {
      let sel = e.rowData; //this.agGrid.api.getSelectedRows(); 
      
      console.log("Reference Add Clicked for rowData", sel);
      //this.agGrid.api.applyTransaction({ remove: [sel]});
      this.selRequester = sel;
      this.selReqName = sel.name;
      this.selReqId = sel.id;
      console.log("Clicked Requester :", this.selReqName, this.selReqId);

      const dialogRef=  this.dialog.open(AddRequesterComponent, 
        {data:{
          width:"20%",height:"20%",
        title:"View Agency",content:sel, ok:true,cancel:false,color:"warn",mode:"delete"}
      });
      //dialogRef.close();
      dialogRef.afterClosed().subscribe(res => {
       // console.log("res after ref comp closed", res);
        //this.requesterRefListGrid = res.result;
        this.verservice.clear();
        if (res!=='back')
        this.verservice.log(res);

        this.getagencyList();
        //refresh ref grid
        //this.getAgencyReferencesByStatus();
      });


      // this.verservice.getVerificationAgency(this.selReqId).
      // subscribe((res:any)=>{console.log(res);
       

      //     const dialogRef=  this.dialog.open(AddRequesterComponent, 
      //       {data:{
      //         width:"20%",height:"20%",
      //       title:"View Agency",content:res, ok:true,cancel:false,color:"warn",mode:"delete"}
      //     });
      //     //dialogRef.close();
      //     dialogRef.afterClosed().subscribe(res => {
      //      // console.log("res after ref comp closed", res);
      //       //this.requesterRefListGrid = res.result;
      //       this.verservice.clear();
      //       this.getagencyList();
      //       //refresh ref grid
      //       //this.getAgencyReferencesByStatus();
      //     });
     
    
      
      // },
      // (error:Error)=>{console.log(error.message);
      
      
      
      // });
    }

  

    
    onRowSelected(event){
      this.verservice.clear();
   
    }
    
    getAgencyReferencesByStatus(){
      this.requesterRefListGrid = [];
     
    
      let  params =new HttpParams();
      params=params.set("agencyid", this.selReqId)
                       .set("processstatus", "RCV");
        this.subs.add= this.verservice.getAgencyReferencesByStatus(params).subscribe(
                        res=>{
                          this.spinnerstatus=false;
                          //this.refresultHandler(res); 
                          
                          this.requesterRefListGrid=res;
                          this.refreshReqGrid = false;
                          
                          
                        
                        
                        
                        },error=>{
                          console.log(error);
                          this.verservice.log(error.originalError.error.message);
                          this.spinnerstatus=false;
                          //this.refresultHandler(null);   //no data
                        });
     
    }
    
  
    onAddReqRef()
    {
        //call popup container to take inputs for new Requester.
        const dialogRef=  this.dialog.open(AddReferenceComponent, 
          {data:{width:"100px", height:"100px", title:"Confirmation",content:this.selRequester, ok:true,cancel:false,color:"warn"}
        });
        //dialogRef.close();
        dialogRef.afterClosed().subscribe(res => {
         // console.log("res after ref comp closed", res);
          //this.requesterRefListGrid = res.result;
          this.verservice.clear();
          //refresh ref grid
          this.getAgencyReferencesByStatus();
        });

        //dialogRef.close();
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
          {data:{width:"100px", height:"100px", title:"Add Requester",content:approved, ok:true,cancel:false,color:"warn",mode:"add"}
        });
        dialogRef.afterClosed().subscribe(res => {
          this.verservice.clear();

          if (res!=='back')
          this.verservice.log(res);
          //this.requesterListGrid = res.result;
          console.log("after close", res);
          this.getagencyList();
        });
    }

    onViewRequester()
    {
        //call popup container to take inputs for new Requester.
        let approved = "true"; //for examination user 
        this.showReqRefs =false;
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
     
      let id =e.rowData.id; //this.agGrid.api.getSelectedRows(); 
      let del = e.rowData;
     
      const dialogRef=  this.dialog.open(alertComponent,
        {data:{title:"Warning",content:"Are you sure to delete  " , ok:true,cancel:true,color:"warn"}});
   

      dialogRef.afterClosed().subscribe(result => {
        
        this.spinnerstatus=true;
        if(result){
                                                                               
         
        
          this.verservice.deleteVerificationReferences(id).subscribe(res=>{
            this.spinnerstatus=false;
          this.agRefGrid.api.applyTransaction({ remove: [del]}); 
          this.verservice.log(res);
      

          },err=>{
            this.spinnerstatus=false;
            this.verservice.log(err);
            
          }
          
          );
         
         

        }
      });
    }

    onCancel(){
        this.elementRef.nativeElement.remove();
     
        this.location.replaceState('/');
        this.router.navigate(['login']);

    }  

    onchange(){
        //debugger;
        this.verservice.clear();
    }

    OnRefGridReady($event){
      this.agRefGrid.columnApi.autoSizeAllColumns(false);
      
    }
    
    onRefRowSelected(event){
     this.showbtn = false; 
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
          this.showbtn = true;
          this.selReference = event.data;
        
        }
        else{
          this.showbtn = false;
        }
    }

    onRefBack(){
      this.refreshReqGrid = true;
      this.showReqRefs = false;
      this.showbtn=false;
    }
    
    onAddRollno(){
      this.showNewReqComp = true;
      this.showRequesterComp = false;
      const dialogRef=  this.dialog.open(AddRollNumberComponent, 
        {data:{width:"100px", height:"100px", title:"Roll Number",content:this.selReference, ok:true,cancel:false,color:"warn"}
      });
      dialogRef.afterClosed().subscribe(res => {
      
        console.log(res);
      });
    }
    
   


    onPrintpdfClicked() {
    
      let id =this.selReference["id"] ;
      // let id =e.rowData.id; //this.agGrid.api.getSelectedRows(); 
      // let del = e.rowData;
      let del = this.selReference;
      //let id=null;
     
      const dialogRef=  this.dialog.open(alertComponent,
        {data:{title:"Warning",content:"Are you sure to Print  " , ok:true,cancel:true,color:"warn"}});
   

      dialogRef.afterClosed().subscribe(result => {
      
        this.spinnerstatus=true;
        if(result){
                                                                               
              
        
          this.verservice.printpdfVerificationReferences(id).subscribe((res:ArrayBuffer)=>{
            this.spinnerstatus=false;
          this.agRefGrid.api.applyTransaction({ remove: [del]}); 
         
          let file = new Blob([res], { type: 'application/pdf' }); 
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL, '', 'height=650,width=840');
       

          },err=>{
            this.spinnerstatus=false;
            this.verservice.log(err);
            
          }
          
          );
         
         

        }
      });

     

     

    }

    onPrintdocClicked() {
    
      let id =this.selReference["id"] ;
      // let id =e.rowData.id; //this.agGrid.api.getSelectedRows(); 
      // let del = e.rowData;
      let del = this.selReference;
      //let id=null;
     
      const dialogRef=  this.dialog.open(alertComponent,
        {data:{title:"Warning",content:"Are you sure to Print  " , ok:true,cancel:true,color:"warn"}});
   

      dialogRef.afterClosed().subscribe(result => {
      
        this.spinnerstatus=true;
        if(result){
                                                                               
              
        
          this.verservice.printdocVerificationReferences(id).subscribe((res:ArrayBuffer)=>{
            this.spinnerstatus=false;
          this.agRefGrid.api.applyTransaction({ remove: [del]}); 
         
          let file = new Blob([res], { type: 'application/octet-stream' }); 
          let link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download=id+".doc";
          link.click();
         
       

          },err=>{
            this.spinnerstatus=false;
            this.verservice.log(err);
            
          }
          
          );
         
         

        }
      });

     

     

    }
}
