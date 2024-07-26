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
  errorMessage: string | null = null; // Propriété pour les messages d'erreur

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
      this.authService.login(email, password).subscribe(
        response => {
          if (response.status === 200) {
            // Stocker le token et rediriger l'utilisateur
            localStorage.setItem('token', response.token);
            console.log('Connexion réussie', response);
            this.router.navigate(['/inscription']);
          } else {
            // Utiliser le message d'erreur retourné par la réponse
            this.errorMessage = response.message || 'Erreur lors de la connexion, veuillez réessayer.';
            console.log('Erreur', response);
          }
        },
        error => {
          // Utiliser le message d'erreur retourné par le serveur
          this.errorMessage = error.error?.message || 'Erreur lors de la connexion, veuillez réessayer plus tard.';
          console.error('Erreur lors de la connexion', error);
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }

  ngOnInit(): void {}

  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.authService.sendPasswordResetLink(email).subscribe(
        response => {
          if (response.status === 200) {
            // Stocker le token et rediriger l'utilisateur
            localStorage.setItem('token', response.token);
            console.log( response);
            this.router.navigate(['/connexion']);
          } else {
            // Utiliser le message d'erreur retourné par la réponse
            this.errorMessage = response.message;
            console.log('Erreur', response);
          }
        }
      );
    }
  }
}
