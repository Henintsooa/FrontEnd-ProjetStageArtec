import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SensibilisationService } from '../../services/sensibilisation.service';
import { VilleService } from '../../services/ville.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-modifier-operateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-modifier-operateur.component.html',
  styleUrl: './admin-modifier-operateur.component.css'
})
export class AdminModifierOperateurComponent implements OnInit {

  operateurForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  villes: any[] = [];
  operateurId: number = 0;

  constructor(
    private fb: FormBuilder,
    private sensibilisationService: SensibilisationService,
    private villeService: VilleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.operateurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      idVille: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit(): void {
    this.operateurId = +this.route.snapshot.paramMap.get('id')!;
    this.loadVilles();
    this.loadOperateurData();
  }

  loadVilles(): void {
    this.villeService.getVilles().subscribe({
      next: (response: any) => {
        this.villes = response;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des villes', error);
      }
    });
  }

  loadOperateurData(): void {
    this.sensibilisationService.getOperateurCibleById(this.operateurId).subscribe({
      next: (response: any) => {
        const operateur = response[0]; // Accède au premier élément du tableau
        this.operateurForm.setValue({
          nom: operateur.nom,
          email: operateur.email,
          idVille: operateur.idville
        });
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des données de l\'opérateur', error);
      }
    });
  }


  onSubmit(): void {
    if (this.operateurForm.valid) {
        this.sensibilisationService.modifierOperateurCible(this.operateurId, this.operateurForm.value)
            .subscribe(
                response => {

                    this.successMessage = response.message;
                },
                error => {

                    this.errorMessage = error.error.message || 'Une erreur est survenue.';
                }
            );
          }
        }

}