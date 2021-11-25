import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router, NavigationEnd } from '@angular/router';
import { SubscriptionContainer } from '../../shared/subscription-container';//'src/app/shared/subscription-container';
import { Location} from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { alertComponent } from '../../shared/alert/alert.component';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { AddRequesterComponent } from '../add-requester/add-requester.component';
import { AddReferenceComponent } from '../add-reference/add-reference.component';
import { AddRollNumberComponent } from '../add-roll-number/add-roll-number.component';
import { ButtonCellRendererComponent } from '../../shared/button-cell-renderer/button-cell-renderer.component';
import { VerificationService } from '../../services/verification.service';

@Component({
  selector: 'app-approve-requester',
  templateUrl: './approve-requester.component.html',
  styleUrls: ['./approve-requester.component.css']
})
export class ApproveRequesterComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  subs = new SubscriptionContainer();
  public showRequesterComp: boolean = true;
  public showNewReqComp:boolean = false;  //raise a new request  
  spinnerstatus: boolean;
  public requesterListGrid: any[]=[];
  protected reqList:any[]= [];
  public ctr: number = 3;
  gridOptions: GridOptions;
  public defaultColDef;
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
    { headerName:'Action',
      cellRendererFramework:ButtonCellRendererComponent,
      cellRendererParams: { onClick: this.onReqClicked.bind(this), label: 'Approve'}
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

  constructor(private fb:FormBuilder,
    private dialogRef: MatDialogRef<ApproveRequesterComponent> ,
    @Inject(MAT_DIALOG_DATA) public data,
    private verservice:VerificationService,
    public mdialog: MatDialog, private elementRef:ElementRef
    ) 
  {
    this.gridOptions = <GridOptions>{
      // enableSorting: true,
      // enableFilter: true               
     } ;
    this.defaultColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:false };
    this.styleGrid={width: '100%', height: '30%',flex: '1 1 auto'};
  }
   
  ngOnDestroy(): void {
      this.subs.dispose();
      this.elementRef.nativeElement.remove();
  }

  ngOnInit() {
      this.requesterListGrid = [];
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
                        console.log(error);
                        this.verservice.log("There is some problem.");
                        this.spinnerstatus=false;
                      });
  }
  
  agencyresultHandler(res)
  {
    //console.log("agency", res.Details.item);
    this.requesterListGrid = [];
    for (var r of res)
    {
      if (r.authentic == false)  //requesters pending for approval
      {
        this.requesterListGrid.push(r);
      }
    } 
  }

  onReqClicked(e) {
    let sel = e.rowData; //this.agGrid.api.getSelectedRows(); 
    console.log("Approve Clicked for rowData", sel);
    //this.agGrid.api.applyTransaction({ remove: [sel]});
    this.selRequester = sel;
    this.selReqName = sel.name;
    this.selReqId = sel.id;
    
    console.log("Clicked Requester :", this.selReqName, this.selReqId);
    const adialogRef = this.mdialog.open(alertComponent,
      {data:{title:"Confirmation",content:"Are you sure to approve Agency :" + "\n" + this.selReqName + " ?", ok:true,cancel:true,color:"warn"}});
      console.log("Approve selected agency id=", this.selReqId);

    adialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        console.log("approving data...", sel.authentic);
        let methodnId ='verificationagency';
        //console.log("updateobj", updateobj);
        sel.authentic = true;
        this.subs.add=this.verservice.updatepostdata(sel, methodnId).subscribe(
         (res :any) =>{
           this.spinnerstatus=false;
           console.log(res);    
           //this.verservice.log("Agency Data Updated Successfully.");
           this.getagencyList();
           this.spinnerstatus=false;
         },error=>{
           this.verservice.log("There is some problem.");
           this.spinnerstatus=false;
         });
      }
    });
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
  
  /*onCancel(){
      this.elementRef.nativeElement.remove();
      //this.location.back();
      //this.dialogRef.close();
      this.location.replaceState('/');
      this.router.navigate(['login']);

  } */ 
  
  onchange(){
      //debugger;
      this.verservice.clear();
  }
  
  onBackClose() {
    this.dialogRef.close(true);
  }  
  

}
