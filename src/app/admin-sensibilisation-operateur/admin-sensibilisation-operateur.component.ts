import { Component, OnInit } from '@angular/core';
import { SensibilisationService } from '../services/sensibilisation.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sensibilisation-operateur',
  templateUrl: './admin-sensibilisation-operateur.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./admin-sensibilisation-operateur.component.css']
})
export class SensibilisationOperateurComponent implements OnInit {

  operateurs: any[] = [];
  selectedOperateurs: any[] = [];
  selectAllOperateurs: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  error: string | null = null;

  constructor(private sensibilisationService: SensibilisationService) {}

  ngOnInit(): void {
    this.loadOperators();
  }

  loadOperators(): void {
    this.sensibilisationService.getOperateurs().subscribe({
      next: (data) => {
        this.operateurs = data;
        this.error = null;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des opérateurs :', err);
        this.error = 'Erreur lors de la récupération des opérateurs.';
      }
    });
  }

  toggleSelectAll(): void {
    this.selectAllOperateurs = !this.selectAllOperateurs;
    if (this.selectAllOperateurs) {
      this.selectedOperateurs = [...this.operateurs];
    } else {
      this.selectedOperateurs = [];
    }
  }

  toggleSelectOperateur(operateur: any): void {
    const index = this.selectedOperateurs.findIndex(op => op.idoperateurcible === operateur.idoperateurcible);
    if (index > -1) {
      this.selectedOperateurs.splice(index, 1);
    } else {
      this.selectedOperateurs.push(operateur);
    }
  }

  sendSensibilisationEmail(): void {
    const selected = this.selectedOperateurs.length ? this.selectedOperateurs : this.operateurs;
    selected.forEach(operator => {
      this.sensibilisationService.sendSensibilisationEmail(operator).subscribe({
        next: (response: any) => {
          this.successMessage = response.message;
          this.errorMessage = '';
        },
        error: (error) => {
          if (error.status === 422) {
            this.errorMessage = error.error.message;
          } else if (error.status === 500) {
            this.errorMessage = 'Erreur serveur: ' + error.error.message;
          } else {
            this.errorMessage = 'Une erreur inconnue s\'est produite.';
          }
        }
      });
    });
  }
}
