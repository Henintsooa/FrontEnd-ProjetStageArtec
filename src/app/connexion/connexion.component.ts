import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule,CommonModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  forgotPasswordForm: FormGroup;
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword; // Bascule la visibilité du mot de passe
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: response => {
          if (response.status === 200) {
            // Stocker le token et rediriger l'utilisateur
            localStorage.setItem('token', response.token);
            console.log('Connexion réussie', response);
            if (response.role === 'admin') {
              this.router.navigate(['/admin/dashboard']); // Redirection pour les administrateurs
            } else if (response.role === 'user') {
              this.router.navigate(['/inscription']); // Redirection pour les utilisateurs
            }
          } else {
            // Message d'erreur en cas de statut non 200
            this.errorMessage = response.message || 'Erreur lors de la connexion, veuillez réessayer.';
            console.log('Erreur', response);
          }
        },
        error: err => {
          // Message d'erreur en cas d'échec de la requête
          this.errorMessage = err.error?.message || 'Erreur lors de la connexion, veuillez réessayer plus tard.';
          console.error('Erreur lors de la connexion', err);
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }


  ngOnInit(): void {}

  onForgotPasswordSubmit(): void {
    this.success = '';
    this.error= '';

    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.authService.sendPasswordResetLink(email).subscribe(
        response => {
          console.log('Réponse reçue :', response);
          if (response.status === 200) {
            this.success = response.body?.message ||'Un lien de réinitialisation a été envoyé à votre adresse email. Veuillez consulter votre boîte de reception.';
          } else {
            this.error= response.body?.error;
          }
        },
        error => {
          // Utiliser le message d'erreur retourné par le serveur
          this.error= error.error?.error || 'Une erreur est survenue. Veuillez réessayer plus tard.';
        }
      );
    } else {
      this.error= 'Veuillez entrer une adresse email valide.';
    }
  }

}
