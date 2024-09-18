import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RenewalService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getRenewals(keyword: string = '', isRenewed: string = ''): Observable<any> {
    let params = new HttpParams();

    if (keyword) {
      params = params.set('keyword', keyword);
    }

    if (isRenewed) {
      params = params.set('isRenewed', isRenewed);
    }

    return this.http.get(`${this.baseUrl}/renouvellements`, { params });
  }

  notifyOperators(renewals: any[]): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/notifierOperateur', { renewals });
  }

  getRenewalsForOperator(operatorId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/renouvellements/${operatorId}`);
  }

}
