import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inscription-client',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './inscription-client.component.html',
  styleUrl: './inscription-client.component.css',
  encapsulation: ViewEncapsulation.None

})
export class InscriptionClientComponent {
  registrationForm: FormGroup;
  currentStep = 1;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      password_confirmation: [''],
      nom: [''],
      emailOperateur: [''],
      adresse: [''],
      idville: [''],
      telephone: [''],
      telecopie: ['']
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): any {
    return group.get('password')!.value === group.get('password_confirmation')!.value
      ? null : { 'mismatch': true };
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.registrationForm.controls['name'].valid && this.registrationForm.controls['email'].valid && this.registrationForm.controls['password'].valid && this.registrationForm.controls['password_confirmation'].valid) {
      this.currentStep = 2;
    }
  }

  prevStep(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      // Pour l'instant, on se contente d'afficher les données du formulaire dans la console
      console.log(this.registrationForm.value);
    }
  }

}
