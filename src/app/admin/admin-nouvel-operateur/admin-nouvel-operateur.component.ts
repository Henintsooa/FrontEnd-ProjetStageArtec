import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SensibilisationService } from '../../services/sensibilisation.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VilleService } from '../../services/ville.service';
import { RegimeService } from '../../services/regime.service';

@Component({
  selector: 'app-admin-operateur-cibles',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-nouvel-operateur.component.html'
})
export class AdminNouvelOperateurComponent {
  operateurForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  villes: any[] = [];
  regimes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private sensibilisationService: SensibilisationService,
    private villeService: VilleService,
    private regimeService: RegimeService

  ) {
    this.operateurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      adresse: ['', [Validators.required, Validators.maxLength(200)]],
      idregime: ['', [Validators.required]],
      idville: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
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

  loadRegimes(): void {
    this.regimeService.getRegimes().subscribe({
      next: (response: any) => {
        this.regimes = response;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des villes', error);
      }
    });
  }

  ngOnInit(): void {
    this.loadVilles();
    this.loadRegimes();
  }

  onSubmit(): void {
    if (this.operateurForm.valid) {
      console.log('Form values:', this.operateurForm.value);
      this.sensibilisationService.addOperateurCible(this.operateurForm.value)
        .subscribe(
          response => {
            this.successMessage = response.message;
            this.operateurForm.reset();
          },
          error => {
            if (error.status === 422) {
              // Validation errors
              this.errorMessage = error.error.message;
            } else if (error.status === 500) {
              // General server error
              this.errorMessage = error.error.message;
            }
          }
        );
    }
  }

}
