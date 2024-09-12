import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormulaireService } from '../../services/formulaire.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.css'
})
export class ClientHeaderComponent implements OnInit {
  regimes: any[] = [];
  constructor(private sidebarService: SidebarService,private authService: AuthService, private router: Router,private formulaireService: FormulaireService) {}
  ngOnInit(): void {
    this.loadRegimes();
  }

  loadRegimes(): void {
    this.formulaireService.getTypeFormulaireDetails().subscribe({
      next: (response: any) => {
        // Transform the response to group the formulaires by regime
        this.regimes = this.transformResponse(response);
        console.log(this.regimes);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des régimes', error);
      }
    });
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
    console.log(groupedData);
    return Object.values(groupedData);
  }


  navigateToFormulaire(idTypeFormulaire: number): void {
    this.router.navigate([`/client/seDeclarer/${idTypeFormulaire}`], { queryParamsHandling: 'merge' });
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
