import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  sendContactMessage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, data);
  }

  getAdminEmails(): Observable<string[]> {
    return this.http.get<{ emails: string[] }>(`${this.apiUrl}/emails`).pipe(
      map((response: { emails: any; }) => response.emails) // Extraction du tableau d'emails
    );
  }

}
