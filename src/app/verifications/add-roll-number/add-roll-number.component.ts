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
import { VerificationService } from '../../services/verification.service';


@Component({
  selector: 'app-add-roll-number',
  templateUrl: './add-roll-number.component.html',
  styleUrls: ['./add-roll-number.component.css']
})
export class AddRollNumberComponent implements OnInit,OnDestroy {
    @ViewChild('agGrid') agGrid: AgGridAngular;
    frameworkComponents: any;
    refId:string;
    requesterId:string ;
    requesterName:string;
    requesterRef:string ;
    reqMode:string;
    curDate = new Date;
    reqDate:string;
    
  
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

    public enrollNumListGrid: any[]=[];
    public defaultColDef;
    styleGrid: { width: string; height: string; flex: string; };
    //columnDefs: ColDef[];
    columnDefs = [
      { headerName:'EnrollmentNumber', field: 'enrolmentno', width:100},
      { headerName:'Id', field:'id', hide:true},
      { headerName:'Delete',
        cellRendererFramework:ButtonCellRendererComponent,
        cellRendererParams: { onClick: this.onDeleteClicked.bind(this), label: 'X'},
        width:50
      }
      ]; 
  dialog: any;
  refobj: any;
    constructor(
      private formBuilder:FormBuilder,
      private dialogRef: MatDialogRef<AddRollNumberComponent> ,
      @Inject(MAT_DIALOG_DATA) public data,
      private fileservice:FlleserviceService,
      private verservice:VerificationService,
      public mdialog: MatDialog, private elementRef:ElementRef
    ) {   
          console.log("------------------inside Add enrollment numbers",data);
          console.log(this.refobj);
          this.refobj = this.data.content;
        
      this.defaultColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:false };
      this.styleGrid={width: '100%', height: '30%',flex: '1 1 auto'};
    }
     
    ngOnDestroy(): void {
        this.subs.dispose();
        this.elementRef.nativeElement.remove();
    }

    ngOnInit() {
        
    this.refId=this.refobj.id;
    this.requesterId=this.refobj.agencyid;
    this.requesterName= this.refobj.name; 
    this.requesterRef=this.refobj.reference_no;
    this.reqMode=this.refobj.request_mode;
    this.curDate = new Date();
    this.reqDate=this.refobj.request_received_date;
    
        this.requestForm = this.formBuilder.group({
           enrollNumber:['', [Validators.required,Validators.pattern('^[0-9]{10}$')]],
        }
       );
        //this.enrollNumListGrid.push({enrollNumber:"1854064", firstname:"PRITHVI RAJ VIRAT", programname:"Program", branchname:"branch", specilizationname:"specialization", passedyear:"2020-2021",programId:"00010080", branchId:'XX', specializationId:'00'});
        if ( isNullOrUndefined(this.requesterName))
        {
          this.requesterName = this.refobj.name;
        }
        this.getEnrolmentNos();
    }
    
    getEnrolmentNos()
    {
        console.log("get enrollment data for refid=", this.refId, "requesterId=", this.requesterId);
        //get enrollment data for refId.
        let inMethod='verificationagencyreference/' + this.refId;
        this.subs.add= this.verservice.getdata(inMethod).subscribe(
                        res=>{
                          this.spinnerstatus=false;
                          console.log("enrol data for ref id", res); 
                          this.enrolresHandler(res);
                        },error=>{
                          console.log(error);
                          this.verservice.log(error.originalError.error.message);
                          this.spinnerstatus=false;
                        });
    }

    enrolresHandler(res)
    {
      this.enrollNumListGrid =[];
      this.agGrid.api.applyTransaction({ remove: this.enrollNumListGrid});
      console.log("res.enrolmentno=", res.enrolmentno);
      for (var r of res.enrolmentno)
      {
          this.enrollNumListGrid.push({enrolmentno:r.enrolmentno, id:r.id});
      } 
      this.agGrid.api.applyTransaction({ add: this.enrollNumListGrid});
    }

    onDeleteClicked(e) {
      let sel = e.rowData; //this.agGrid.api.getSelectedRows(); 
      console.log("deletedClicked for rowData", sel);
      debugger;
      let id = e.rowData.id;
      const dialogRef=  this.mdialog.open(alertComponent,
        {data:{title:"Confirmation",content:"Are you sure to delete selected roll number " + sel.enrollNumber + " ?", ok:true,cancel:true,color:"warn"}});
      console.log("DeleteRollno Clicked for rowData", sel);

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if(result){
          debugger;
          this.verservice.deleteEnrolmentno(id).subscribe(res=>{
            this.agGrid.api.applyTransaction({ remove: [sel]});
            this.verservice.log(res);

          },err=>{
            this.verservice.log(err);

          });
        
        }
      });
    }

    // addEnrollNumber() {
    //   console.log("enrollNumber ", this.requestForm.get('enrollNumber').value);
    //   var inpRollNo:string = this.requestForm.get('enrollNumber').value;
    //   this.agGrid.api.applyTransaction({ add: [{enrolmentno:inpRollNo}]});
    //   this.requestForm.reset(); 
    //   return;
    // }
    
    OnInfoGridReady($event){
      this.agGrid.columnApi.autoSizeAllColumns(false);
      this.agGrid;
    }
    
    onRowSelected(event){
      this.verservice.clear();
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

    addEnrollNumber()
    {
      let enrolmentno=[];
      enrolmentno.push( this.requestForm.get('enrollNumber').value);
      this.refobj.enrolmentno = enrolmentno;
      this.spinnerstatus=true;
      debugger;
      // this.agGrid.api.forEachNode(node => this.enrollNumListGrid.push(node.data));
      // console.log("rows in grid ", this.enrollNumListGrid);
      // if (this.enrollNumListGrid.length > 0)
       {
      //     const alertdialogRef=  this.mdialog.open(alertComponent,
      //       {data:{title:"Warning",content:"Are you sure to get verification of mentioned numbers ?", ok:true,cancel:true,color:"warn"}});
      //         alertdialogRef.afterClosed().subscribe(result => {
      //         console.log(`Dialog result: ${result}`);
      //         if(result){

      //           var enrolno :any=[];
      //           for (var en=0; en < this.enrollNumListGrid.length; en++ )
      //           {
      //             enrolno[en] = this.enrollNumListGrid[en].enrolmentno;
      //           }
      //           console.log("enrolmentno",enrolno, "this.refobj", this.refobj);
      //           this.refobj.enrolmentno = enrolno;
      //           console.log("refobj", this.refobj);
      //           debugger;
      //           let inMethod ='verificationagencyreference';
                this.subs.add=this.verservice.addEnrolmentno(this.refobj).subscribe(
                  (res :any) =>{
                    this.spinnerstatus=false;
                    this.agGrid.api.applyTransaction({ add: [{enrolmentno:enrolmentno[0]}]});               
                    
                    
                  },error=>{
                    this.verservice.log("There is some problem." +error.originalError.error.message);
                    this.spinnerstatus=false;
                  });
                //this.generateConfirmPdf();
              }
      //   });
      // }
      // else
      // {
      //   this.mdialog.open(alertComponent,
      //     {data:{title:"Warning",content:"Please add Enrollment Number", ok:true,cancel:false,color:"warn"}});
      // }
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
      /*let params:HttpParams= new HttpParams();
      this.requesterId = "100001"; //"210001";
      params=params.set("requestNo",this.requesterId)
                .set("requester",this.requesterName)
                .set("refNo",this.requesterRef)
                .set("receiveDate", this.reqDate)
               ;
        let obj = {xmltojs:'N',
        method: '/resultVerification/generateVerificationReport.htm' };   
          this.verservice.getdata(params,obj).subscribe(res=>{
          this.pdfsuccess(res);
          //this.mask=false;
          },error=>{
          this.verservice.log(error.originalError.statusText);
          });*/
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
        //this.pdfFilePath= this.localUrl +"/REPORTS/0001/Result/" + this.requesterId +".pdf";
        console.log(this.pdfFilePath);
        window.open(this.pdfFilePath, '_blank');
      }
      else
      {  //failed to generate
        console.log(resMsg);
      }
    }
}
