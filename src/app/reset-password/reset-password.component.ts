import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token!: string;
  errorMessage: string | null = null; // Propriété pour les messages d'erreur

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
  }

  onResetPasswordSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const { password, confirmPassword } = this.resetPasswordForm.value;
        this.authService.resetPassword(this.token, password).subscribe(
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
