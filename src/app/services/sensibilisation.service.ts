import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensibilisationService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getOperateurs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/operateurCibles`);
  }

  deleteOperateur(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/operateurCible/${id}`);
  }

  addOperateurCible(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addOperateurCible`, formData);
  }

  modifierOperateurCible(idOperateurCible: number, formulaireData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/editOperateurCible/${idOperateurCible}`, formulaireData);
  }

  getOperateurCibleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/operateurCibleById/${id}`);
  }
}
