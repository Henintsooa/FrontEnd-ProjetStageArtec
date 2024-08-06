import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormulaireService } from '../services/formulaire.service';
import { CommonModule } from '@angular/common';

interface Question {
  textquestion: string;
  idtypequestion: number;
  questionobligatoire: boolean;
  categoriequestion: string;
  categorie_id?: number;
}


interface CategoryQuestions {
  categorie: string;
  questions: Question[];
}

@Component({
  selector: 'app-modifier-formulaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule, RouterModule],
  templateUrl: './admin-modifier-formulaire.component.html'
})
export class ModifierFormulaireComponent implements OnInit {
  editForm: FormGroup;
  typeQuestions: any[] = [];
  categoriesQuestions: any[] = [];
  formulaireId: number = 0;
  questionsByCategory: { categorie: string, questions: any[] }[] = [];
  error = '';
  success = '';

  newCategoryName = '';
  newCategoryResponses = 1;
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private formulaireService: FormulaireService
  ) {
    this.editForm = this.fb.group({
      type: [null, Validators.required],
      nom: ['', Validators.required],
      description: ['', Validators.required],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.formulaireId = this.route.snapshot.params['id'];
    this.loadFormulaireData();
    this.loadTypeQuestions();
    this.loadCategoriesQuestions();
  }

  loadFormulaireData() {
    this.formulaireService.getFormulaireById(this.formulaireId).subscribe(data => {
      console.log(this.formulaireId);
      this.editForm.patchValue({
        type: data.nomtypeformulaire,
        nom: data.nomformulaire,
        description: data.descriptiontypeformulaire
      });
      this.setQuestions(data.questions);
    });
  }

  loadTypeQuestions() {
    this.formulaireService.getTypeQuestions().subscribe(data => {
      this.typeQuestions = data;
    });
  }

  compareByType(o1: any, o2: any): boolean {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  }

  loadCategoriesQuestions() {
    this.formulaireService.getCategoriesQuestions().subscribe(data => {
      console.log("Chargement des catégories", data); // Ajoutez cette ligne pour vérifier les données chargées
      this.categoriesQuestions = data;
      this.loadFormulaireData(); // Chargez les données du formulaire après le chargement des catégories
    });
  }



  private mapCategorieNameToId(categorieName: string): number | null {
    const categorie = this.categoriesQuestions.find(cat => cat.nom === categorieName);
    if (categorie) {
      return categorie.idcategoriequestion; // Utilisez l'ID de la catégorie
    } else {

      return null;
    }
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

  closeModal(): void {
    this.showModal = false;
  }

  setQuestions(questions: Question[]) {
    // Créez une map pour contenir les questions par catégorie
    const questionsByCategory = this.categoriesQuestions.reduce((acc, category) => {
      acc[category.nom] = []; // Initialisez avec un tableau vide pour chaque catégorie
      return acc;
    }, {} as { [key: string]: Question[] });

    // Remplissez les questions dans les catégories
    questions.forEach(question => {
      const { categoriequestion } = question;
      if (questionsByCategory[categoriequestion]) {
        questionsByCategory[categoriequestion].push(question);
      }
    });

    // Convertissez la map en un tableau de catégories avec leurs questions
    this.questionsByCategory = Object.entries(questionsByCategory).map(([categorie, questions]) => ({
      categorie,
      questions: questions as any[] // Assertion de type pour indiquer que c'est un tableau de questions
    }));


    // Initialisez le FormArray
    const questionsArray = this.editForm.get('questions') as FormArray;
    questionsArray.clear();

    this.questionsByCategory.forEach(category => {
      const categoryGroup = this.fb.group({
        categorie: [category.categorie, Validators.required],
        questions: this.fb.array(category.questions.map(question => {
          const categoryId = this.mapCategorieNameToId(question.categoriequestion); // Obtenez l'ID de la catégorie
          return this.fb.group({
            text: [question.textquestion, Validators.required],
            type: [Number(question.idtypequestion), Validators.required],
            obligatoire: [question.questionobligatoire],
            categorie_id: [categoryId, Validators.required] // Initialisez avec l'ID de la catégorie
          });
        }))
      });
      questionsArray.push(categoryGroup);
    });

    console.log('Valeur du FormArray :', questionsArray.value);
  }




  get questions(): FormArray {
    return this.editForm.get('questions') as FormArray;
  }

  getQuestionsFormArray(category: AbstractControl): FormArray {
    return category.get('questions') as FormArray;
  }

  addQuestion(categoryIndex: number) {
    const categoryGroup = this.questions.at(categoryIndex) as FormGroup;
    const questionsArray = categoryGroup.get('questions') as FormArray;
    const categoryId = this.mapCategorieNameToId(categoryGroup.get('categorie')?.value); // Obtenez l'ID de la catégorie
    console.log(`Adding question to category ID: ${categoryId}`);
    questionsArray.push(this.fb.group({
      text: ['', Validators.required],
      type: ['', Validators.required],
      obligatoire: [false],
      categorie_id: [categoryId, Validators.required] // Initialisez avec l'ID de la catégorie
    }));
  }



  removeQuestion(categoryIndex: number, questionIndex: number) {
    const categoryGroup = this.questions.at(categoryIndex) as FormGroup;
    const questionsArray = categoryGroup.get('questions') as FormArray;
    questionsArray.removeAt(questionIndex);
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const questions = this.questions.controls.flatMap((categoryGroup: any) =>
        categoryGroup.get('questions').controls.map((question: any) => ({
          ...question.value,
          categorie_id: parseInt(question.get('categorie_id')?.value, 10) // Convertissez ici
        }))
      );

      const formData = {
        type_formulaire_nom: this.editForm.get('type')?.value,
        description: this.editForm.get('description')?.value,
        nom_formulaire: this.editForm.get('nom')?.value,
        questions: questions
      };
      console.log('Formulaire:', formData);
      this.formulaireService.modifierFormulaire(this.formulaireId, formData).subscribe({
        next: (response: any) => {
          // Assume response.status and response.message are available
          if (response.message) {
            console.log('Formulaire mis à jour avec succès', response);
            this.success = response.message || 'Formulaire mis à jour avec succès';

          } else {
            this.error = 'Erreur lors de la mise à jour du formulaire.';
            console.log('Erreur', response);
          }
        },
        error: (err: any) => {
          if (err.status === 422) {
            this.error = err.error?.error || 'Erreur de validation';
            console.error('Erreur de validation', err.error?.details);
          } else {
            this.error = err.error?.error || 'Erreur lors de la mise à jour du formulaire, veuillez réessayer plus tard.';
            console.error('Erreur lors de la mise à jour du formulaire', err);
          }
        }
      });
    } else {
      this.error = 'Veuillez remplir tous les champs correctement.';
    }
  }




}
