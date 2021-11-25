import { HttpParams } from '@angular/common/http';
//import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../services/user.service'; //'src/app/services/user.service';
import { SubscriptionContainer } from '../../shared/subscription-container';//'src/app/shared/subscription-container';
import {Location} from '@angular/common';
import { MyItem} from '../../interfaces/my-item';
import { isNullOrUndefined } from 'util';
import { alertComponent } from '../../shared/alert/alert.component';
import { AgGridAngular } from 'ag-grid-angular';
import { CellEditingStoppedEvent, CellFocusedEvent, CellMouseOutEvent, ColDef, ColDefUtil, ColGroupDef, GridOptions, GridReadyEvent, RowDoubleClickedEvent, StartEditingCellParams, ValueSetterParams } from 'ag-grid-community';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ButtonCellRendererComponent } from '../../shared/button-cell-renderer/button-cell-renderer.component';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import {FlleserviceService} from '../../services/flleservice.service'; //'src/app/services/flleservice.service';

export function onlyDigits(formControl: FormControl): {[key: string]: boolean} {
  const DIGIT_EXPS = /^\d*$/;
  
  if (!formControl.value.match(DIGIT_EXPS)) {

    return {'NaN': true}
  } 
}

@Component({
  selector: 'app-add-roll-number',
  templateUrl: './add-roll-number.component.html',
  styleUrls: ['./add-roll-number.component.css']
})
export class AddRollNumberComponent implements OnInit,OnDestroy {
    @ViewChild('agGrid') agGrid: AgGridAngular;
    frameworkComponents: any;
    reqobj: any = this.data.content;
    requesterId:string=this.reqobj.id;
    requesterName:string= this.reqobj.label; //this.reqobj.requester_name;
    requesterRef:string=this.reqobj.reference_no;
    reqMode:string=this.reqobj.request_mode;
    curDate = new Date;
    reqDate:string=this.reqobj.request_received_date;
  
    subs = new SubscriptionContainer();
    requestForm: FormGroup;
    submitted = false;
    public openRequesterComp: boolean = false;
    public openNewReqComp:boolean = true;  //raise a new request
    pdfFilePath: string;
    spinnerstatus: boolean;
    option: string;
    enrolvalid: boolean;
    enrvaild: boolean;
    localUrl:string="http://localhost:8080/CMS" ;
    public enrollNumListGrid: any[]=[];
    public defaultColDef;
    styleGrid: { width: string; height: string; flex: string; };
    //columnDefs: ColDef[];
    columnDefs = [
      { headerName:'EnrollmentNumber', field: 'enrollNumber', width:100},
      { headerName:'StudentName', field: 'firstname', hide:true, width:100 },
      { headerName:'Program', field: 'programname', hide:true },
      { headerName:'Branch', field: 'branchname', hide:true },
      { headerName:'Specialization', field: 'specilizationname', hide:true },
      { headerName:'PassedYear', field: 'passedyear', hide:true },
      { headerName:'Delete',
        cellRendererFramework:ButtonCellRendererComponent,
        cellRendererParams: { onClick: this.onDeleteClicked.bind(this), label: 'X'},
        width:50
      },
      { field: 'programId', hide:true },
      { field: 'branchId', hide:true },
      { field: 'specializationId', hide:true }
      ]; 
  dialog: any;
    constructor(
      private formBuilder:FormBuilder,
      private dialogRef: MatDialogRef<AddRollNumberComponent> ,
      @Inject(MAT_DIALOG_DATA) public data,
      private fileservice:FlleserviceService,
      private userservice:UserService,
      public mdialog: MatDialog, private elementRef:ElementRef
    ) {   
          console.log("------------------inside alert",data);

      this.defaultColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:false };
      this.styleGrid={width: '100%', height: '30%',flex: '1 1 auto'};
    }
     
    ngOnDestroy(): void {
        this.subs.dispose();
        this.elementRef.nativeElement.remove();
    }

    ngOnInit() {
        
        this.requestForm = this.formBuilder.group({
           enrollNumber:['', Validators.required],
        }
       );
        //this.enrollNumListGrid.push({enrollNumber:"1854064", firstname:"PRITHVI RAJ VIRAT", programname:"Program", branchname:"branch", specilizationname:"specialization", passedyear:"2020-2021",programId:"00010080", branchId:'XX', specializationId:'00'});
    }
    
    onDeleteClicked(e) {
      let sel = e.rowData; //this.agGrid.api.getSelectedRows(); 
      console.log("deletedClicked for rowData", sel);
      const dialogRef=  this.mdialog.open(alertComponent,
        {data:{title:"Confirmation",content:"Are you sure to delete selected roll number " + sel.enrollNumber + " ?", ok:true,cancel:true,color:"warn"}});
      console.log("DeleteRollno Clicked for rowData", sel);

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if(result){
          this.agGrid.api.applyTransaction({ remove: [sel]});
        }
      });
    }

    addEnrollNumber() {
      console.log("enrollNumber ", this.requestForm.get('enrollNumber').value);
      var inpRollNo:string = this.requestForm.get('enrollNumber').value;
      console.log("enrollNumListGrid.length=", this.enrollNumListGrid.length, this.enrollNumListGrid);
      this.agGrid.api.applyTransaction({ add: [{enrollNumber:inpRollNo, firstname:"PRITHVI RAJ VIRAT", programname:"Program", branchname:"branch", specilizationname:"specialization", passedyear:"2020-2021",programId:"00010080", branchId:'XX', specializationId:'00'}]});
      this.requestForm.reset();
    
      return;
    }
    
    OnInfoGridReady($event){
      this.agGrid.columnApi.autoSizeAllColumns(false);
      this.agGrid;
    }
    
    onRowSelected(event){
      this.userservice.clear();
    /*  if(this.gridOptions.api.getSelectedNodes().length>1){
        this.userservice.log("Please select only One");
        this.gridOptions.api.deselectAll();
        //this.setoffButton();
        return;
      } */
     
    }
    
    // convenience getter for easy access to form fields
    get f() { return this.requestForm.controls; }
    
    onBack()
    {
      this.dialogRef.close({ result: this.enrollNumListGrid });
      return;
    }
   
    generatePdf()
    {
      this.agGrid.api.forEachNode(node => this.enrollNumListGrid.push(node.data));
      console.log("rows in grid ", this.enrollNumListGrid);
      if (this.enrollNumListGrid.length > 0)
      {
          const alertdialogRef=  this.mdialog.open(alertComponent,
            {data:{title:"Warning",content:"Are you sure to generate PDF ?", ok:true,cancel:true,color:"warn"}});
          alertdialogRef.afterClosed().subscribe(result => {
              console.log(`Dialog result: ${result}`);
              if(result){
                console.log("generate pdf from server");
                this.generateConfirmPdf();
              }
        });
      }
      else
      {
        this.mdialog.open(alertComponent,
          {data:{title:"Warning",content:"Please add Enrollment Number", ok:true,cancel:false,color:"warn"}});
      }
    }

    onSendEmail(){const dialogRef=  this.mdialog.open(alertComponent,
        {data:{title:"Warning",content:"Email will be sent shortly", ok:true,cancel:false,color:"warn"}});
    
        
    }
    public generateConfirmPdf():void
    {
        //this.mask=true;	
        if(isNullOrUndefined(this.reqDate))
        {
          this.reqDate = this.curDate.toString();
        }
      let params:HttpParams= new HttpParams();
      this.requesterId = "100001"; //"210001";
      params=params.set("requestNo",this.requesterId)
                .set("requester",this.requesterName)
                .set("refNo",this.requesterRef)
                .set("receiveDate", this.reqDate)
               ;
        let obj = {xmltojs:'N',
        method: '/resultVerification/generateVerificationReport.htm' };   
          this.userservice.getdata(params,obj).subscribe(res=>{
          res= JSON.parse(res);
          this.pdfsuccess(res);
          //this.mask=false;
          },error=>{
          this.userservice.log(error.originalError.statusText);
          });
    }
    
    private pdfsuccess(res):void{
      var resMsg : string ="";
      if(isNullOrUndefined(res.ResultVerification.info))
      { 
        resMsg = "";
      } 
      else 
      { 
        for ( var o of res.ResultVerification.info )
        {
          resMsg = String(o.message);
        }
      }
      if (resMsg.trim() === "true")
      { //report generated successfully.
        this.pdfFilePath= this.localUrl +"/REPORTS/0001/Result/" + this.requesterId +".pdf";
        console.log(this.pdfFilePath);
        window.open(this.pdfFilePath, '_blank');
      }
      else
      {  //failed to generate
        console.log(resMsg);
      }
    }
}
