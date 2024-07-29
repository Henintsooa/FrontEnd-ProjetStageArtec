import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { VilleService } from '../services/ville.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription-client',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './inscription-client.component.html',
  styleUrls: ['./inscription-client.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InscriptionClientComponent {
  registrationForm: FormGroup;
  currentStep = 1;
  showPassword = false;
  errors: any[] = [];
  error = '';
  success = '';
  villes: any[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService,private villeService:VilleService, private router: Router) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:])[A-Za-z\d@$!%*?&.,;:]{8,}$/)
        ]
      ],
      password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
      nom: ['', Validators.required],
      emailOperateur: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      idville: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      telecopie: ['']
    }, { validators: this.confirmPasswordValidator });
  }

  confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirmation = control.get('password_confirmation');

    if (password && passwordConfirmation && password.value !== passwordConfirmation.value) {
      return { passwordsDoNotMatch: true };
    }

    return null;
  }

  ngOnInit(): void {
    this.loadVilles();
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

  passwordMatchValidator(group: FormGroup): any {
    return group.get('password')!.value === group.get('password_confirmation')!.value
      ? null : { 'mismatch': true };
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (this.registrationForm.controls['name'].invalid || this.registrationForm.controls['email'].invalid || this.registrationForm.controls['password'].invalid || this.registrationForm.controls['password_confirmation'].invalid) {
        this.errors = [];
        if (this.registrationForm.controls['name'].invalid) {
          this.errors.push('Le champ nom est obligatoire.');
        }
        if (this.registrationForm.controls['email'].invalid) {
          this.errors.push('Veuillez entrer une adresse email valide.');
        }
        if (this.registrationForm.controls['password'].invalid) {
          this.errors.push('Le mot de passe doit comporter au moins 8 caractères et inclure une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.');
        }
        if (this.registrationForm.controls['password_confirmation'].invalid) {
          this.errors.push('Le champ de confirmation du mot de passe est obligatoire.');
        }
        return;
      }
      this.errors = [];
      this.currentStep = 2;
    }
  }

  prevStep(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword; // Bascule la visibilité du mot de passe
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Form Data:', this.registrationForm.value);
      this.authService.register(this.registrationForm.value).subscribe({
        next: (response: any) => {
          this.success = 'Inscription réussie!';
          this.error = ''; // Réinitialiser les erreurs
          this.errors = []; // Réinitialiser les erreurs du formulaire
          this.registrationForm.reset(); // Réinitialiser le formulaire si nécessaire
          this.router.navigate(['/inscription']);
        },
        error: (error: { error: { message: string; }; }) => {
          console.error('API Error:', error);
          this.error = error.error.message || 'Erreur lors de l\'inscription.';
        }
      });
    } else {
      console.log('Form is invalid:', this.registrationForm.errors);
      // Optionnel : afficher les erreurs de validation actuelles si nécessaire
      this.errors = [];
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control?.invalid) {
          this.errors.push(`${key} is invalid.`);
        }
      });
    }
  }



}
