
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url;
  }

  generateTranscript(rollNumber: string): Observable<Blob> {

    const method = 'generate';

    const params = new HttpParams()
      .set('roll_number', rollNumber);

    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });

    return this.http.get(this.url + method, {
      headers,
      params,
      responseType: 'blob'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
