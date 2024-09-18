import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }

  getDemandesValidéesParRegion(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/demandesParRegion`);
  }

  getDemandesValidéesParRegime(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/demandesParRegime`);
  }

  getDemandesValidéesParTypeFormulaire(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/demandesParTypeFormulaire`);
  }

  getKPIDeclarationSensibilisation(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/KPIDeclarationSensibilisation`);
  }
}
