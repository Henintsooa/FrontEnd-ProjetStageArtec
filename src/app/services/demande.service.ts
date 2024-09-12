import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  addDocumentSupplementaire(iddemande: number, formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/addDocumentSupplementaire/${iddemande}`;
    return this.http.post(url, formData);
  }

  addDateDeclaration(iddemande: number, dateDeclaration: string): Observable<any> {
    const url = `${this.apiUrl}/addDateDeclaration/${iddemande}`;
    const body = { dateDeclaration };

    return this.http.post(url, body);
  }

  addDemande(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/demande`, formData);
  }

  getNotifications(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/notifications`, { headers });
  }

  markNotificationAsRead(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/notifications/${id}/read`, {}, { headers });
  }

  getResponsesByDemande(idDemande: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reponses/${idDemande}`);
  }

  exportPdf(idDemande: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/exportPdf/${idDemande}`, {
      responseType: 'text' as 'json'
    });
  }


  getDemandes(keyword: string = '', statusFilter: string = ''): Observable<any> {
    let params = new HttpParams();
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (statusFilter) {
      params = params.set('statusFilter', statusFilter);
    }
    return this.http.get<any>(`${this.apiUrl}/getDemandes`, { params });
  }

  getDemandesById(id: number, keyword: string = '', statusFilter: string = ''): Observable<any> {
    let params = new HttpParams();
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (statusFilter) {
      params = params.set('statusFilter', statusFilter);
    }

    return this.http.get<any>(`${this.apiUrl}/getDemandes/${id}`, { params });
  }

  accepterDemande (idDemande: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/accepterDemande/${idDemande}`,{});
  }

  refuserDemande (idDemande: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refuserDemande/${idDemande}`,{});
  }

  sendInfoRequest(iddemande: number, message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/demandes/${iddemande}/info-request`, { message });
  }
}
