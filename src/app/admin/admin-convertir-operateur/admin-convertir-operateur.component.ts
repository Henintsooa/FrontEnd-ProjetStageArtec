import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SensibilisationService } from '../../services/sensibilisation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-convertir-operateur',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './admin-convertir-operateur.component.html',
  styleUrl: './admin-convertir-operateur.component.css'
})
export class AdminConvertirOperateurComponent {
confirmConversion() {
throw new Error('Method not implemented.');
}
  step = 1;
  operateurscibles: any[] = []; // Type à définir selon votre structure de données
  operateurs: any[] = []; // Type à définir selon votre structure de données
  selectedOperateurCible: number | null = null;
  selectedOperateur: number | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  dateConversion: string | null = null;

  constructor(
    private sensibilisationService: SensibilisationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOperateursCibles();
    this.loadOperateurs();
  }

  loadOperateursCibles(): void {
    this.sensibilisationService.getOperateurCibles().subscribe(
      data => this.operateurscibles = data,
      error => console.error('Erreur lors du chargement des opérateurs cibles', error)
    );
  }

  loadOperateurs(): void {
    this.sensibilisationService.getAvailableOperateurs().subscribe(
      data => this.operateurs = data,
      error => console.error('Erreur lors du chargement des opérateurs', error)
    );
  }

  selectOperateurCible(event: Event): void {
    this.selectedOperateurCible = +(event.target as HTMLInputElement).value;
  }

  selectOperateur(event: Event): void {
    this.selectedOperateur = +(event.target as HTMLInputElement).value;
  }

  goToStep(step: number): void {
    this.step = step;
  }

  convertirOperateurs(): void {
    if (this.selectedOperateurCible && this.selectedOperateur) {
      this.sensibilisationService.convertirOperateur({
        idoperateurcible: this.selectedOperateurCible,
        idoperateur: this.selectedOperateur,
        status: 1,
        dateconversion: this.dateConversion
      }).subscribe(
        response => {
          this.successMessage = 'Opérateur converti avec succès!';
          this.errorMessage = null; // Clear previous error message
        },
        error => {
          console.error('Erreur lors de la conversion de l\'opérateur', error);
          this.errorMessage = 'Erreur lors de la conversion de l\'opérateur.';
          this.successMessage = null; // Clear previous success message
        }
      );
    }
  }


}
