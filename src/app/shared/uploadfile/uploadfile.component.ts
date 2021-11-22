import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Host, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { UserService } from 'src/app/services/user.service';
import { SubscriptionContainer } from '../subscription-container';

@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.css']
})
export class UploadfileComponent implements OnInit {
@Input() filepath: string;
@Input() filename: string;
@Input() formsubmitted: boolean;

@Output()  filestatus = new EventEmitter<boolean>();

  fileToUpload: File = null;
  submitted = false;
  subs = new SubscriptionContainer();
  spinnerstatus: boolean;
  registerForm: FormGroup;
  progress = 0;
  fileuploaded = false;

  constructor(private userservice: UserService, private formBuilder: FormBuilder,
      ) { }

  ngOnInit(): void {

    this.registerForm = this.formBuilder.group({
      file: ['', Validators.required]
    });

    this.progress = 0;
    this.fileuploaded = false;
    this.filestatus.emit(this.fileuploaded);
    console.log(this.filename);
  }

  // tslint:disable-next-line: typedef
  get f() {

    return this.registerForm.controls; }


//   onReset() {
//     this.submitted = false;
//     this.registerForm.reset();
// }

// tslint:disable-next-line: typedef
handleFileInput(files: FileList) {

  this.progress = 0;
  this.fileuploaded = false;
  this.fileToUpload = files.item(0);
  if (this.fileToUpload == null){
      this.filestatus.emit(this.fileuploaded);
      this.userservice.log('Please select file.');
      return;
    }

  this.uploadFileToActivity();



}

// tslint:disable-next-line: typedef
uploadFileToActivity() {



  const obj = {xmltojs: 'N',
  method: 'None',
  filepath: this.filepath,
  filename: this.filename

};
// debugger;
  this.spinnerstatus = true;
  this.fileuploaded = false;
  this.spinnerstatus = true;
  // this.subs.add = this.userservice.postFile(this.fileToUpload, obj).subscribe((event: HttpEvent<any>) => {


  //  switch (event.type) {
  //    case HttpEventType.Sent:

  //      console.log('Request has been made!');
  //      break;
  //    case HttpEventType.ResponseHeader:

  //      console.log('Response header has been received!');
  //      break;
  //    // case HttpEventType.UploadProgress:
  //    case HttpEventType.UploadProgress:

  //      this.progress = Math.round(event.loaded / event.total * 100);
  //      console.log(`Uploaded! ${this.progress}%`);
  //      break;
  //    case HttpEventType.Response:
  //     this.spinnerstatus = false;
  //     this.fileuploaded = true;
  //     this.spinnerstatus = false;
  //     this.filestatus.emit(this.fileuploaded);
  //     this.userservice.log('File Uploaded Successfully!');

  //     setTimeout(() => {

  //      }, 1500);
  //     this.progress = 0;

  //  }
  // }, error => {

  //   // tslint:disable-next-line: triple-equals
  //   if (error.originalError.status == 501){
  //     this.userservice.log(' Only pdf,png,jpg and jpeg files are allowed');
  //   }else{
  //     this.userservice.log('error in file upload');
  //   }

  //   this.spinnerstatus = false;
  //   this.fileuploaded = false;
  //   this.filestatus.emit(this.fileuploaded);



  //  });





}


// tslint:disable-next-line: typedef
onfocus(){
  this.fileuploaded = false;
  console.log('mouse down');
}
}
