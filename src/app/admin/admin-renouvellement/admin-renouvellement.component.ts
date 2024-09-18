import { Component } from '@angular/core';
import { RenewalService } from '../../services/renewal.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-admin-renouvellement',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-renouvellement.component.html',
  styleUrl: './admin-renouvellement.component.css'
})
export class AdminRenouvellementComponent {
  renewals: any[] = [];
  keyword: string = '';
  isRenewed: string = 'pas_fait'; // 'fait' ou 'pas_fait'
  selectedRenewals: any[] = [];  // Les renouvellements sélectionnés
  selectAllRenewals: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private renewalService: RenewalService) { }

  ngOnInit(): void {
    this.fetchRenewals();
  }

  fetchRenewals(): void {
    this.renewalService.getRenewals(this.keyword, this.isRenewed).subscribe((data: any[]) => {
      this.renewals = data;
    });
  }

  onSearch(): void {
    this.fetchRenewals();
  }

  onFilterChange(value: string): void {
    this.isRenewed = value;
    this.fetchRenewals();
  }

   // Sélectionne ou désélectionne un renouvellement
   toggleSelectRenewal(renewal: any) {
    const index = this.selectedRenewals.indexOf(renewal);
    if (index === -1) {
      this.selectedRenewals.push(renewal);
    } else {
      this.selectedRenewals.splice(index, 1);
    }
  }

  // Sélectionne ou désélectionne tous les renouvellements
  toggleSelectAllRenewals() {
    this.selectAllRenewals = !this.selectAllRenewals;
    if (this.selectAllRenewals) {
      this.selectedRenewals = [...this.renewals];
    } else {
      this.selectedRenewals = [];
    }
  }

  // Notifie les opérateurs sélectionnés pour les renouvellements
  notifySelectedOperators(event: Event): void {
    event.preventDefault(); // Empêche le comportement par défaut (si besoin)

    // Si aucun renouvellement n'est sélectionné, afficher un message d'erreur
    if (this.selectedRenewals.length === 0) {
        this.errorMessage = "Aucun opérateur sélectionné.";
        return;
    }

    // Préparer les données à envoyer, directement sous la forme souhaitée
    const renewals = this.selectedRenewals.map(renewal => {
        if (renewal && renewal.idrenouvellement) {
            return { idrenouvellement: renewal.idrenouvellement };
        } else {
            console.error('idrenouvellement manquant pour un renouvellement:', renewal);
            return null;
        }
    }).filter(renewal => renewal !== null);
    console.log("Data to be sent:", { renewals }); // Vérifiez le format ici

    // Appeler le service pour notifier les opérateurs sélectionnés
    this.renewalService.notifyOperators(renewals).subscribe({
        next: (response: any) => {
            // Message de succès
            this.successMessage = response.message;
            this.errorMessage = '';

            // Réinitialiser la sélection après l'envoi
            this.selectedRenewals = [];
            this.selectAllRenewals = false;
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



}
