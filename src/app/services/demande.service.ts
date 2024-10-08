import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getOperateur(id: number): Observable<any> {

    return this.http.get<any>(`${this.apiUrl}/operateur/${id}`);
  }

  getDocumentsById(idDemande: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents/${idDemande}`);
  }

  updateDocumentSupplementaire(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/updateDocumentSupplementaire`, formData);
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


  getDemandes(
    keyword: string,
    statusFilter: string,
    startDate: string,
    endDate: string,
    formType: string,
    city: string
  ): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getDemandes`, {
      params: {
        searchKeyword: keyword || '',
        selectedStatus: statusFilter || '',
        startDate: startDate || '',
        endDate: endDate || '',
        selectedFormType: formType || '',
        selectedCity: city || ''
      }
    });
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

  refuserDemande(idDemande: number, motifRefus: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refuserDemande/${idDemande}`, { motif_refus: motifRefus });
}


  sendInfoRequest(iddemande: number, documents: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/demandes/${iddemande}/info-request`, { documents });
  }

  getDocuments(idDemande: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents-complementaires/${idDemande}`);
  }

  getReponsesById(idrenouvellement: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getReponsesIdRenouvellement/${idrenouvellement}`);
  }


}
