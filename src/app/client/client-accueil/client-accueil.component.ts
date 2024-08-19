import { Component } from '@angular/core';
import { FormulaireService } from '../../services/formulaire.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-accueil.component.html',
  styleUrls: ['./client-accueil.component.css']
})
export class ClientAccueilComponent {
  typeFormulaires: any[] = [];

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
        this.typeFormulaires = response.map((form: any) => ({
          ...form,
          image: form.image ? `http://127.0.0.1:8000/${form.image}` : '../assets/img/default.jpg'
        }));
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des types de formulaire', error);
      }
    });
  }

  viewDeclarations(id: number): void {
    this.router.navigate([`/declarations/${id}`]);
  }

  declare(id: number): void {
    this.router.navigate([`/declare/${id}`]);
  }
}
