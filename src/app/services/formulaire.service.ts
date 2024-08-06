import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormulaireService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getTypeFormulaireDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/formulaire/types`);
  }

  getFormulaireByType(idTypeFormulaire: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/formulaire/type/${idTypeFormulaire}`);
  }

  getTypeQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/type-questions`);
  }

  getCategoriesQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories-questions`);
  }

  addCategory(name: string, nombreReponses: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/addCategory`, { nom: name, nombreReponses });
  }

  addFormulaire(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addFormulaire`, formData);
  }

  supprimerFormulaire(idFormulaire: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/formulaires/${idFormulaire}`);
  }

  getFormulaireById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/formulaires/${id}`);
  }

  modifierFormulaire(idTypeFormulaire: number, formulaireData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/editFormulaire/${idTypeFormulaire}`, formulaireData);
  }
}
