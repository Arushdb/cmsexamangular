import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  private apiUrl = 'http://localhost:8080/cmsexam/api/test/generate';

  constructor(private http: HttpClient) {}

  generateTranscript(rollNumber: string): Observable<Blob> {
    const url = `${this.apiUrl}?roll_number=${rollNumber}`;
    const headers = new HttpHeaders().set('Accept', 'application/pdf');
    return this.http.get(url, { headers, responseType: 'blob' })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.error || 'Server error');
  }
}
