import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormulaireService } from '../../services/formulaire.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { RenewalService } from '../../services/renewal.service';
import { DemandeService } from '../../services/demande.service';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.css'
})
export class ClientHeaderComponent implements OnInit {
  regimes: any[] = [];
  renewals: any[] = [];
  operateur: any | null = null;

  constructor(private sidebarService: SidebarService,private authService: AuthService, private router: Router,private formulaireService: FormulaireService,private renewalService: RenewalService,private demandeService: DemandeService) {}
  ngOnInit(): void {
    this.loadRegimes();
    const userId = this.getUserIdFromToken();
    // console.log('ID de l\'utilisateur:', userId);
    this.loadRenewals(userId);
    this.getOperateur(userId);
  }
  getOperateur(userId: number | null) {
    if (userId !== null) {
    this.demandeService.getOperateur(userId).subscribe({
      next: (response: any) => {
        this.operateur = response;
        // console.log(this.operateur);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement de l\'opérateur', error);
      }
      })
    }
  }

  loadRegimes(): void {
    this.formulaireService.getTypeFormulaireDetails().subscribe({
      next: (response: any) => {
        // Transform the response to group the formulaires by regime
        this.regimes = this.transformResponse(response);
        // console.log(this.regimes);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des régimes', error);
      }
    });
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

  transformResponse(data: any[]): any[] {
    // Transform the data to group formulaires by regime
    const groupedData = data.reduce((acc: any, item: any) => {
      const regimeId = item.idregime;
      if (!acc[regimeId]) {
        acc[regimeId] = {
          nomregime: item.nomregime,
          formulaires: []
        };
      }
      acc[regimeId].formulaires.push({
        idtypeformulaire: item.idtypeformulaire,
        nomFormulaire: item.nomformulaire
      });
      return acc;
    }, {});
    // console.log(groupedData);
    return Object.values(groupedData);
  }


  navigateToFormulaire(idTypeFormulaire: number, id?: number): void {
    this.router.navigate(['/operateur/declarations', idTypeFormulaire,'/0'], {
      queryParams: { id }
    });
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
