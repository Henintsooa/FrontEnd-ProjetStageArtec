import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Remplacez par l'URL de votre API
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;

  constructor(private http: HttpClient) {
    const userFromStorage = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(userFromStorage);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): AuthResponse | null {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    return null;
  }

  private setUserToStorage(user: AuthResponse): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  private removeUserFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

   login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(user => {
        // Enregistrer les informations de l'utilisateur et du token dans le localStorage
        this.setUserToStorage(user);
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    // Supprimer les informations de l'utilisateur du localStorage et définir currentUser à null
    this.removeUserFromStorage();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
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
