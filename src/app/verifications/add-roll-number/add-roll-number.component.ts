

import { Component, ElementRef,   OnDestroy, OnInit, Output, ViewChild, Inject } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';

import { SubscriptionContainer } from '../../shared/subscription-container';//'src/app/shared/subscription-container';

import { isNullOrUndefined } from 'util';
import { alertComponent } from '../../shared/alert/alert.component';
import { AgGridAngular } from 'ag-grid-angular';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ButtonCellRendererComponent } from '../../shared/button-cell-renderer/button-cell-renderer.component';

import { VerificationService } from '../../services/verification.service';


@Component({
  selector: 'app-add-roll-number',
  templateUrl: './add-roll-number.component.html',
  styleUrls: ['./add-roll-number.component.css']
})
export class AddRollNumberComponent implements OnInit,OnDestroy {
    @ViewChild('agGrid') agGrid: AgGridAngular;
    
    subs = new SubscriptionContainer();
    requestForm: FormGroup;
    submitted = false;
    refobj: any;
   
    spinnerstatus: boolean;
    public rollNumListGrid;
    public defaultColDef;
    styleGrid: { width: string; height: string; flex: string; };
    //columnDefs: ColDef[];
    columnDefs = [
      { headerName:'Roll Number', field: 'rollno', width:100},
      { headerName:'Id', field:'id', hide:true},
      { headerName:'Delete',
        cellRendererFramework:ButtonCellRendererComponent,
        cellRendererParams: { onClick: this.onDeleteClicked.bind(this), label: 'X'},
        width:50
      }
      ]; 
  
    constructor(
      private formBuilder:FormBuilder,
      private dialogRef: MatDialogRef<AddRollNumberComponent> ,
      @Inject(MAT_DIALOG_DATA) public data,
     
      private verservice:VerificationService,
      public mdialog: MatDialog, private elementRef:ElementRef
    ) {   
     
      this.refobj = this.data.content;
      
      this.defaultColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:false };
      this.styleGrid={width: '100%', height: '30%',flex: '1 1 auto'};
    }
     
    ngOnDestroy(): void {
        this.subs.dispose();
        this.elementRef.nativeElement.remove();
    }

    ngOnInit() {
        
      this.submitted=false;
        this.requestForm = this.formBuilder.group({
         // Pattern for numeric  roll number 
         // rollno:['',[Validators.minLength(6),Validators.required,Validators.pattern('^(0|[1-9][0-9]*)$')]]
          rollno:['',[Validators.minLength(6),Validators.required]]
        }
       );
      
         this.getRollNos();
    }
    
    getRollNos()
    {
   
        this.subs.add= this.verservice.getRollNos(this.refobj.id).subscribe(
                        res=>{
                          this.spinnerstatus=false;
                          this.rollNumListGrid=res["rollno"];
                        
                        },error=>{
                         
                          this.verservice.log(error.originalError.error.message);
                          this.spinnerstatus=false;
                          this.submitted=false;
                        });
    }

  

    onDeleteClicked(e) {
      let sel = e.rowData; //this.agGrid.api.getSelectedRows(); 
     
   
      let id = e.rowData.id;
      let rollno = e.rowData.rollno;
      const dialogRef=  this.mdialog.open(alertComponent,
        {data:{title:"Confirmation",content:"Are you sure to delete selected roll number " + sel.rollno + " ?", ok:true,cancel:true,color:"warn"}});
   

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if(result){
         
          this.subs.add=  this.verservice.deleteRollNo(id).subscribe(res=>{
            this.agGrid.api.applyTransaction({ remove: [sel]});
            this.verservice.log(rollno+ " is deleted");

          },error=>{
            this.verservice.log(error.originalError.error.message);

          });
        
        }
      });
    }

    
    
    OnInfoGridReady($event){
      this.agGrid.columnApi.autoSizeAllColumns(false);
    
    }

    
    // convenience getter for easy access to form fields
    get f() { return this.requestForm.controls; }
    
    onBack()
    {
      this.dialogRef.close({ result: this.rollNumListGrid });
      return;
    }

    addRollNo()
    {
      
      this.submitted=true;
      if(this.requestForm.status==='INVALID'){
     
        return;
      }
   
      let rollno=[];
      rollno.push( this.requestForm.get('rollno').value);
      this.refobj.rollno = rollno;
     
      this.spinnerstatus=true;
  
    
       {
     
                this.subs.add=this.verservice.addRollNo(this.refobj).subscribe(
                  (res :any) =>{
                    this.getRollNos();
                    this.requestForm.reset();
                    this.spinnerstatus=false;
                    this.submitted=false;
                               
                    
                    
                  },error=>{
                  
                    this.verservice.log(error.originalError.error.message);
                    this.spinnerstatus=false;
                    this.submitted=false;
                    this.dialogRef.close();
                  });
               
              }
      
    }

   
    
  
}
