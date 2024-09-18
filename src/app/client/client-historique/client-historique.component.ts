import { Component, OnInit } from '@angular/core';
import { FormulaireService } from '../../services/formulaire.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DemandeService } from '../../services/demande.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-historique',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './client-historique.component.html',
  styleUrl: './client-historique.component.css'
})
export class ClientHistoriqueComponent implements OnInit {

  selectedStatus: string = 'all';
  filteredDemandes: any[] = [];
  searchKeyword: string = '';
  demandes: any[] = [];


  constructor(
    private demandeService: DemandeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const userId = this.getUserIdFromToken();
    console.log('ID de l\'utilisateur:', userId);
    if (userId) {
      this.loadDemandes(userId);
    } else {
      console.error('Impossible de récupérer l\'ID utilisateur');
    }
  }

  onSearch(): void {
    console.log('Mot-clé de recherche:', this.searchKeyword);
    const userId = this.getUserIdFromToken();
    if (userId) {
      this.loadDemandes(userId, this.searchKeyword, this.selectedStatus);
    } else {
      console.error('Impossible de récupérer l\'ID utilisateur');
    }
  }

  onStatusChange(): void {
    const userId = this.getUserIdFromToken();
    if (userId) {
      this.loadDemandes(userId, this.searchKeyword, this.selectedStatus);
    } else {
      console.error('Impossible de récupérer l\'ID utilisateur');
    }
  }

  loadDemandes(id: number, keyword: string = '', statusFilter: string = 'all'): void {
    console.log('Params:', { keyword, statusFilter });

    this.demandeService.getDemandesById(id, keyword, statusFilter).subscribe(
      (data: any) => {
        console.log('Données reçues de l\'API:', data);
        if (Array.isArray(data)) {
          this.demandes = data;
        } else {
          console.error('Format des données inattendu:', data);
        }
        this.applyFilters();
      },
      (error) => {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    );
  }

  applyFilters(): void {
    if (this.selectedStatus === 'all') {
      // Affiche toutes les demandes
      this.filteredDemandes = this.demandes;
    } else {
      // Filtre par statut
      this.filteredDemandes = this.demandes.filter(demande =>
        this.selectedStatus === '' ? demande.status === null : demande.status == this.selectedStatus
      );
    }
  }


  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Token décodé:', decodedToken); // Affichez le contenu décodé
        return decodedToken.sub || null; // Ajustez la clé si nécessaire
      } catch (e) {
        console.error('Erreur lors du décodage du token', e);
        return null;
      }
    }
    return null;
  }

  getStatusLabel(status: number | null): string {
    switch (status) {
      case 1:
        return 'En attente de validation';
      case 2:
        return 'Validée';
      case null:
        return 'En attente d\'information';
      default:
        return 'Inconnu';
    }
  }

}
