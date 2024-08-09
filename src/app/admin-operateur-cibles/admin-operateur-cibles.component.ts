import { Component, OnInit } from '@angular/core';
import { SensibilisationService } from '../services/sensibilisation.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-operateur-cibles',
  templateUrl: './admin-operateur-cibles.component.html',
  standalone: true,
  imports: [CommonModule,RouterModule],
  styleUrls: ['./admin-operateur-cibles.component.css']
})
export class AdminOperateurCiblesComponent implements OnInit {
  operateurs: any[] = [];
  error: string | null = null;
  deleteId: number | null = null;

  constructor(private sensibilisationService: SensibilisationService) { }

  ngOnInit(): void {
    this.loadOperateurs();
  }

  loadOperateurs(): void {
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

  setDeleteId(id: number): void {
    this.deleteId = id;
  }

  confirmDelete(): void {
    if (this.deleteId !== null) {
      this.sensibilisationService.deleteOperateur(this.deleteId).subscribe({
        next: () => {
          this.loadOperateurs();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'opérateur :', err);
          this.error = 'Erreur lors de la suppression de l\'opérateur.';
        }
      });
    }
  }
}
