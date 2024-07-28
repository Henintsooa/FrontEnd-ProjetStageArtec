import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token!: string;
  email!: string;
  errorMessage: string | null = null;
  showPassword = false;

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

  togglePassword(): void {
    this.showPassword = !this.showPassword; // Bascule la visibilité du mot de passe
  }
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];
  }

  onResetPasswordSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const { password, confirmPassword } = this.resetPasswordForm.value;
      this.authService.resetPassword(this.email, this.token, password, confirmPassword).subscribe(
        response => {
          if (response.status === 200) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/connexion']);
          } else {
            this.errorMessage = response.message;
          }
        },
        error => {
          this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer plus tard.';
        }
      );
    }
  }
}
