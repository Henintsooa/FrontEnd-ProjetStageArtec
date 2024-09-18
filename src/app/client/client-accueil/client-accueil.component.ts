import { Component, OnInit } from '@angular/core';
import { FormulaireService } from '../../services/formulaire.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DemandeService } from '../../services/demande.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-client-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-accueil.component.html',
  styleUrls: ['./client-accueil.component.css']
})
export class ClientAccueilComponent implements OnInit{
  typeFormulaires: any[] = [];
  regimes: any[] = [];
  selectedStatus: string = '1';
  filteredDemandes: any[] = [];
  searchKeyword: string = '';
  demandes: any[] = [];
Couleurs: any;

  constructor(
    private formulaireService: FormulaireService,
    private demandeService: DemandeService,
    private router: Router,
  ) {}

  getStatusLabel(status: number | null): string {
    switch (status) {
      case 1:
        return 'En attente de validation';
      case 2:
        return 'Validée';
      case null:
        return 'En attente d\'information supplémentaire';
      default:
        return 'Inconnu';
    }
  }
  ngOnInit(): void {
    this.loadTypeFormulaires();
    const userId = this.getUserIdFromToken();
    // console.log('ID de l\'utilisateur:', userId);
    if (userId) {
      this.loadDemandes(userId);
    } else {
      console.error('Impossible de récupérer l\'ID utilisateur');
    }

  }

  loadDemandes(id: number, keyword: string = '', statusFilter: string = ''): void {
    // console.log('Params:', { keyword, statusFilter });

    this.demandeService.getDemandesById(id, keyword, statusFilter).subscribe(
      (data: any) => {
        // console.log('Données reçues de l\'API:', data);
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
      this.filteredDemandes = this.demandes;
    } else {
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
        // console.log('Token décodé:', decodedToken); // Affichez le contenu décodé
        return decodedToken.sub || null; // Ajustez la clé si nécessaire
      } catch (e) {
        console.error('Erreur lors du décodage du token', e);
        return null;
      }
    }
    return null;
  }

  loadTypeFormulaires(): void {
    this.formulaireService.getTypeFormulaireDetails().subscribe({
      next: (response: any) => {
        // Grouper les formulaires par régime
        const groupedByRegime = response.reduce((acc: any, form: any) => {
          const regimeName = form.nomregime; // Assurez-vous que `nomregime` est la propriété correcte
          if (!acc[regimeName]) {
            acc[regimeName] = [];
          }
          acc[regimeName].push({
            ...form,
            image: form.image ? `http://127.0.0.1:8000/${form.image}` : '../assets/img/default.jpg'
          });
          return acc;
        }, {});

        // Convertir l'objet en tableau pour l'utiliser dans le template
        this.regimes = Object.entries(groupedByRegime).map(([regimeName, formulaires]) => ({
          regimeName,
          formulaires
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
