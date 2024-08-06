import { Component, OnInit } from '@angular/core';
import { FormulaireService } from '../services/formulaire.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-formulaires',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './formulaires.component.html'
})
export class FormulairesComponent implements OnInit {
  typeFormulaires: any[] = [];
  idFormulaireToDelete: number | null = null;

  constructor(
    private formulaireService: FormulaireService,
    private router: Router,
  ) {}

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

  setDeleteId(idFormulaire: number): void {
    this.idFormulaireToDelete = idFormulaire;
    console.log('ID du formulaire à supprimer:', this.idFormulaireToDelete);
  }

  confirmDelete(): void {
    console.log('Confirmation de suppression pour ID:', this.idFormulaireToDelete);
    if (this.idFormulaireToDelete !== null) {
      this.formulaireService.supprimerFormulaire(this.idFormulaireToDelete).subscribe({
        next: (response: any) => {
          console.log('Formulaire supprimé avec succès');
          this.loadTypeFormulaires();

        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression du formulaire', error);
        }
      });
    }
  }
}
