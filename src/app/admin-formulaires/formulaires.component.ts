import { Component, OnInit } from '@angular/core';
import { FormulaireService } from '../services/formulaire.service';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-formulaires',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './formulaires.component.html'
})
export class FormulairesComponent {
  typeFormulaires: any[] = [];

  constructor(private formulaireService:FormulaireService, private router: Router) {

  }
  ngOnInit(): void {
    this.loadTypeFormulaires();
  }

  loadTypeFormulaires(): void {
    this.formulaireService.getTypeFormulaireDetails().subscribe({
      next: (response: any) => {
        this.typeFormulaires = response;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des types de formulaire', error);
      }
    });
  }
}
