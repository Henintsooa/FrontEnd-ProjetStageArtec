import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password });
  }

  sendPasswordResetLink(email: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/sendPasswordResetLink`, { email }, { observe: 'response' });
  }

  resetPassword(email: string, token: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resetPassword`, {
      email,
      resetToken: token,
      password,
      password_confirmation
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
