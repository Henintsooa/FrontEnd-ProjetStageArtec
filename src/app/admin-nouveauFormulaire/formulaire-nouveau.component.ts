import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { FormulaireService } from '../services/formulaire.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-formulaire-nouveau',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule],
  templateUrl: './formulaire-nouveau.component.html'
})
export class NouveauFormulaireComponent implements OnInit {
  typeQuestions: any[] = [];
  categoriesQuestions: any[] = [];
  registrationForm: FormGroup;
  errors: any[] = [];
  error = '';
  success = '';

  newCategoryName = '';
  newCategoryResponses = 1;
  showModal = false;

  constructor(private fb: FormBuilder, private formulaireService: FormulaireService) {
    this.registrationForm = this.fb.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      nom: ['', Validators.required],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.formulaireService.getTypeQuestions().subscribe(data => {
      this.typeQuestions = data;
    });

    this.formulaireService.getCategoriesQuestions().subscribe(data => {
      this.categoriesQuestions = data;
      this.categoriesQuestions.forEach(category => {
        this.addCategoryQuestions(category.idcategoriequestion);
      });
    });
  }

  get questions(): FormArray {
    return this.registrationForm.get('questions') as FormArray;
  }

  getQuestions(categoryGroup: AbstractControl): FormArray {
    return categoryGroup.get('questions') as FormArray;
  }

  getQuestionsArray(categoryGroup: AbstractControl): any[] {
    const formArray = categoryGroup.get('questions') as FormArray;
    return formArray ? formArray.controls : [];
  }

  addCategoryQuestions(categoryId: number): void {
    const categoryFormArray = this.fb.array([]);
    this.questions.push(this.fb.group({
      categoryId: [categoryId],
      questions: categoryFormArray
    }));
  }

  addQuestion(categoryId: number): void {
    const categoryFormGroup = this.questions.controls.find((ctrl: AbstractControl) => ctrl.get('categoryId')?.value === categoryId);
    if (categoryFormGroup) {
      const categoryQuestionsArray = categoryFormGroup.get('questions') as FormArray;
      categoryQuestionsArray.push(this.fb.group({
        text: ['', Validators.required],
        type: [0, Validators.required],
        obligatoire: [false]
      }));
    }
  }

  removeQuestion(categoryId: number, index: number): void {
    const categoryFormGroup = this.questions.controls.find((ctrl: AbstractControl) => ctrl.get('categoryId')?.value === categoryId);
    if (categoryFormGroup) {
      const categoryQuestionsArray = categoryFormGroup.get('questions') as FormArray;
      categoryQuestionsArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formValue = this.registrationForm.value;

      // Préparer les données du formulaire
      const questions = formValue.questions.flatMap((category: any) =>
        category.questions.map((question: any) => ({
          ...question,
          categorie_id: category.categoryId
        }))
      );

      const payload = {
        type_formulaire_nom: formValue.type,
        description: formValue.description,
        nom_formulaire: formValue.nom,
        date_creation: new Date().toISOString().split('T')[0],
        questions: questions
      };

      this.formulaireService.addFormulaire(payload).subscribe({
        next: (response: any) => {
          // Afficher le message de succès et réinitialiser le formulaire
          this.success = response.message;
          this.errors = [];
          this.registrationForm.reset();
        },
        error: (error: any) => {
          if (error.status === 422) {
            // Gestion des erreurs de validation
            if (error.error.details && typeof error.error.details === 'object') {
              this.errors = [];
              for (let key in error.error.details) {
                if (error.error.details.hasOwnProperty(key)) {
                  this.errors.push(error.error.details[key]);
                }
              }
            } else {
              this.error = 'Erreur de validation sans détails supplémentaires.';
            }
          } else if (error.status === 500) {
            // Gestion des erreurs du serveur
            this.error = error.error.message || 'Erreur lors de la création du formulaire.';
          } else {
            // Gestion des autres erreurs
            this.error = 'Une erreur inconnue s\'est produite.';
          }
        }
      });
    } else {
      // Gestion des erreurs de validation du formulaire
      this.errors = [];
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control?.invalid) {
          this.errors.push(`${key} est obligatoire .`);
        }
      });
    }
  }





  closeModal(): void {
    this.showModal = false;
  }

  addCategory(): void {
    if (this.newCategoryName.trim() && this.newCategoryResponses >= 0) {
      this.formulaireService.addCategory(this.newCategoryName, this.newCategoryResponses).subscribe(() => {
        this.categoriesQuestions.push({
          idcategoriequestion: this.categoriesQuestions.length + 1,
          nom: this.newCategoryName,
          nombreReponses: this.newCategoryResponses
        });
        this.newCategoryName = '';
        this.newCategoryResponses = 1;
        this.showModal = true;
      });
    }
  }
}
