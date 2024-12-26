import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  // Import this module
import { TranscriptComponent } from './transcript/transcript.component';



@NgModule({
  declarations: [TranscriptComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ReportsModule { }
