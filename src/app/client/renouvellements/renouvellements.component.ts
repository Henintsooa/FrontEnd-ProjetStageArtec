import { Component } from '@angular/core';
import { RenewalService } from '../../services/renewal.service';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-renouvellements',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './renouvellements.component.html',
  styleUrl: './renouvellements.component.css'
})
export class RenouvellementsComponent {
  renewals: any[] = [];

  constructor(private renewalService: RenewalService, private router: Router) {}

  ngOnInit(): void {
    const userId = this.getUserIdFromToken();
    // console.log('ID de l\'utilisateur:', userId);
    this.loadRenewals(userId);
  }

  loadRenewals(id: number | null): void {
    if (id !== null) {
      this.renewalService.getRenewalsForOperator(id).subscribe(
      (response) => {
        this.renewals = response.renewals;
      },
      (error) => {
        console.error('Erreur lors de la récupération des renouvellements:', error);
      }
    );
      } else {
        console.error('ID de l\'opérateur est null');
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
}
