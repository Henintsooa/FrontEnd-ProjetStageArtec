import { Component, OnInit } from '@angular/core';
import { SensibilisationService } from '../../services/sensibilisation.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-operateur-cibles',
  templateUrl: './admin-operateur-cibles.component.html',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  styleUrls: ['./admin-operateur-cibles.component.css']
})
export class AdminOperateurCiblesComponent implements OnInit {
  operateurs: any[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  error: string | null = null;
  deleteId: number | null = null;
  selectedOperateurs: any[] = [];
  selectAllOperateurs: boolean = false;
  selectedStatus: string = 'null';
  searchKeyword: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  itemsPerPageOptions: number[] = [10, 25, 50, 100];
  paginatedOperateurs: any[] = [];


  constructor(private sensibilisationService: SensibilisationService) { }

  ngOnInit(): void {
    this.loadOperateurs();
  }

  loadOperateurs(keyword: string = '', status: string = ''): void {
    this.sensibilisationService.getOperateursHistorique({ keyword, status }).subscribe(
      (data: any[]) => {
        this.operateurs = data;
        this.totalItems = data.length; // Nombre total d'éléments
        this.applyPagination(); // Appliquer la pagination après avoir récupéré les données
      },
      (error: any) => this.errorMessage = 'Erreur lors de la récupération des opérateurs'
    );
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOperateurs = this.operateurs.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.loadOperateurs(this.searchKeyword, this.selectedStatus);
  }

  onStatusChange(): void {
    this.currentPage = 1; // Réinitialiser à la première page lors du changement de statut
    this.loadOperateurs(this.searchKeyword, this.selectedStatus);
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; // Réinitialiser à la première page lors du changement du nombre d'éléments par page
    this.applyPagination();
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
    console.log('Selected Operators:', this.selectedOperateurs);
  }


  sendSensibilisationEmail(event: Event): void {
    event.preventDefault(); // Empêche le rechargement de la page

    // Si aucun opérateur n'est sélectionné, ne pas envoyer d'email
    if (this.selectedOperateurs.length === 0) {
        this.errorMessage = "Aucun opérateur sélectionné.";
        return;
    }

    const operators = this.selectedOperateurs.map(op => ({ name: op.nom, email: op.email }));

    this.sensibilisationService.sendSensibilisationEmail({ operators }).subscribe({
        next: (response: any) => {
            this.successMessage = response.message;
            this.errorMessage = '';
            // Réinitialiser la sélection après l'envoi
            this.selectedOperateurs = [];
            this.selectAllOperateurs = false;
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
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
      this.applyPagination();
    }
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.totalItems / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
  }


}
