import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranscriptService } from '../../services/transcript.service';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.css']
})
export class TranscriptComponent implements OnInit {
  transcriptForm: FormGroup;
  loading = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private transcriptService: TranscriptService
  ) {}

  ngOnInit(): void {
    this.transcriptForm = this.fb.group({
      rollNumber: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onGenerateTranscript(): void {
    if (this.transcriptForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const rollNumber = this.transcriptForm.get('rollNumber')?.value;

    this.transcriptService.generateTranscript(rollNumber).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript_${rollNumber}.pdf`;
        a.click();
        this.loading = false;
      },
      (error) => {
        this.errorMessage = error === 'Roll number not found'
          ? 'Roll Number is Incorrect'
          : 'Roll Number has not passed the program';
        this.loading = false;
      }
    );
  }
}
