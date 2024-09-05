  import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
  import { ActivatedRoute, Router, RouterModule } from '@angular/router';
  import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { FormulaireService } from '../../services/formulaire.service';
  import { VilleService } from '../../services/ville.service';
  import { CommonModule } from '@angular/common';
  import { StructureJuridiquesService } from '../../services/structureJuridique.service';
  import { DemandeService } from '../../services/demande.service';
  import { jwtDecode } from 'jwt-decode';

  @Component({
    selector: 'app-client-seDeclarer',
    templateUrl: './client-seDeclarer.component.html',
    standalone: true,
    imports: [CommonModule,RouterModule,ReactiveFormsModule],
  })
  export class ClientSeDeclarerComponent implements OnInit {
    formulaires: any[] = [];
    villes: any[] = [];
    structuresJuridique: any[] = [];
    registrationForm: FormGroup;
    imgSrc: string = '';
    isCollapsed: boolean[] = [];
    isCollapsedStatic: boolean = false;
    userId: number | null = null;
    filesMap: { [key: string]: File } = {};
    showAdditionalResponses: { [categoryId: number]: boolean[] } = {};
    successMessage: string | null = null;
    errorMessage: string | null = null;

    constructor(private fb: FormBuilder, private villeService: VilleService,private structureJuridiquesService: StructureJuridiquesService,private demandeService: DemandeService, private router: Router, private route: ActivatedRoute, private formulaireService: FormulaireService,private cdr: ChangeDetectorRef,private zone: NgZone) {
      this.registrationForm = this.fb.group({
        nomoperateur: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        adresseoperateur: ['', Validators.required],
        idville: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
        idstructurejuridique: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
        telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
        telecopie: ['']
      });
      this.isCollapsed = this.getCategories(this.formulaires).map(() => true);

    }

    toggleCollapseStatic() {
      this.isCollapsedStatic = !this.isCollapsedStatic;
    }
    toggleCollapse(index: number) {
      this.isCollapsed[index] = !this.isCollapsed[index];
    }

    getCategories(formulaires: any[]): any[] {
      const categories = formulaires.map(question => question.categoriequestion);
      const uniqueCategories = [...new Set(categories)];

      return uniqueCategories.map(categoryName => {
        const firstMatchingQuestion = formulaires.find(q => q.categoriequestion === categoryName);
        return {
          name: categoryName,
          id: firstMatchingQuestion?.idcategoriequestion,
          questions: this.getQuestionsByCategory(formulaires, categoryName),
          nombreReponses: firstMatchingQuestion?.nombrereponses || 0,
          responses: [{}] // Initialise avec un objet pour la première réponse
        };
      });
    }







    getQuestionsByCategory(formulaires: any[], category: string): any[] {
      const questions = formulaires.filter(question => question.categoriequestion === category);
      // console.log(`Questions pour la catégorie "${category}":`, questions);
      return questions;
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

    loadStructuresJuridique(): void {
      this.structureJuridiquesService.getStructuresJuridiques().subscribe({
        next: (response: any) => {
          this.structuresJuridique = response;
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement des Structures Juridique', error);
        }
      });
    }

    ngOnInit(): void {
      this.loadVilles();
      this.loadStructuresJuridique();
      this.userId = this.getUserIdFromToken();
      console.log('ID utilisateur:', this.userId);
      const id = Number(this.route.snapshot.paramMap.get('idtypeformulaire'));
      if (id) {
        this.formulaireService.getFormulaireByType(id).subscribe({
          next: (data: any[]) => {
            console.log('Données récupérées:', data);
            this.formulaires = data;
            this.imgSrc = `http://127.0.0.1:8000/${this.formulaires[0].image}`;
            this.initializeFormControls();
            this.initializeShowAdditionalResponses();
            console.log(this.imgSrc);
          },
          error: (error: any) => {
            console.error('Erreur lors de la récupération des formulaires', error);
          }
        });
      }
    }

    initializeShowAdditionalResponses(): void {
      this.getCategories(this.formulaires).forEach(category => {
        this.showAdditionalResponses[category.id] = Array(category.nombreReponses).fill(false);
      });
    }

    showMoreResponses(categoryId: number): void {
      if (this.showAdditionalResponses[categoryId]) {
        const nextIndex = this.showAdditionalResponses[categoryId].findIndex(shown => !shown);
        if (nextIndex > -1) {
          this.showAdditionalResponses[categoryId][nextIndex] = true;
        }
      }
    }

    // Méthode pour cacher les réponses supplémentaires
    hideMoreResponses(categoryId: number): void {
      if (this.showAdditionalResponses[categoryId]) {
        // Réinitialise tous les indicateurs à false sauf le premier
        this.showAdditionalResponses[categoryId] = this.showAdditionalResponses[categoryId].map((_, index) => index === 0);
        // Met à jour la validation des contrôles
        this.updateFormValidation();
      }
    }


    // Fonction pour récupérer l'ID utilisateur depuis le token
    getUserIdFromToken(): number | null {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          console.log('Token décodé:', decodedToken); // Affichez le contenu décodé
          return decodedToken.sub || null; // Ajustez la clé si nécessaire
        } catch (e) {
          console.error('Erreur lors du décodage du token', e);
          return null;
        }
      }
      return null;
    }

    initializeFormControls(): void {
      this.getCategories(this.formulaires).forEach(category => {
        category.questions.forEach((question: { questionobligatoire: any; idquestion: string; typequestion: string; }) => {
          for (let i = 0; i < category.nombreReponses; i++) {
            const controlName = this.generateControlName(question.idquestion, i, category.id);

            console.log('Ajout du contrôle:', controlName);

            let control = null;

            if (question.typequestion === 'file') {
              control = new FormControl(null, question.questionobligatoire ? Validators.required : null);
            } else if (question.typequestion === 'text' || question.typequestion === 'number') {
              control = new FormControl('', question.questionobligatoire ? Validators.required : null);
            }

            if (control) {
              this.registrationForm.addControl(controlName, control);
            }
          }
        });
      });
    }


    onFileSelected(event: any, questionId: string, responseIndex: number, categoryId: number): void {
      const file: File = event.target.files[0];
      const controlName = this.generateControlName(questionId, responseIndex, categoryId);
      if (file) {
        this.filesMap[controlName] = file;
        this.registrationForm.get(controlName)?.setValue(file); // Ajoutez cette ligne
        console.log(`Fichier sélectionné pour ${controlName}:`, file);
      } else {
        delete this.filesMap[controlName];
        this.registrationForm.get(controlName)?.setValue(null); // Ajoutez cette ligne
        console.log(`Fichier supprimé pour ${controlName}`);
      }
    }




    trackByCategory(index: number, category: any): number {
      return category.id; // ou toute autre propriété unique
    }

    updateFormValidation(): void {
      this.getCategories(this.formulaires).forEach((category, categoryIndex) => {
        category.questions.forEach((question: { idquestion: string; questionobligatoire: boolean; }, questionIndex: number) => {
          for (let i = 0; i < category.nombreReponses; i++) {
            const controlName = this.generateControlName(question.idquestion, i, category.id);
            const control = this.registrationForm.get(controlName);

            if (control) {
              if (this.showAdditionalResponses[category.id][i] || i === 0) {
                control.setValidators(question.questionobligatoire ? Validators.required : null);
              } else {
                control.clearValidators();
              }
              control.updateValueAndValidity(); // Met à jour la validité du contrôle
            }
          }
        });
      });
    }

    submitForm(): void {
      // Mettre à jour la validité des champs en fonction de leur visibilité
      this.updateFormValidation();

      if (this.registrationForm.invalid) {
        this.closeModal();

        // Initialiser une liste pour stocker les noms des questions invalides
        const invalidFields: string[] = [];

        // Parcourir les contrôles du formulaire pour identifier les champs invalides
        this.getCategories(this.formulaires).forEach((category, categoryIndex) => {
            category.questions.forEach((question: { idquestion: any; textquestion: string }, questionIndex: number) => {
                for (let i = 0; i < category.nombreReponses; i++) {
                    const controlName = this.generateControlName(question.idquestion, i, category.id);
                    const controlErrors = this.registrationForm.get(controlName)?.errors;
                    if (controlErrors) {
                        invalidFields.push(question.textquestion); // Ajouter le nom de la question invalide à la liste
                    }
                }
            });
        });

        // Générer un message d'erreur détaillé
        if (invalidFields.length > 0) {
            this.errorMessage = 'Veuillez remplir correctement les champs suivants : ' + invalidFields.join(', ') + '.';
        } else {
            this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement.';
        }

        this.successMessage = null; // Effacer tout message de succès précédent
        console.log('Formulaire invalide', this.registrationForm.errors);
        return;
    }

      const formData = new FormData();

      formData.append('id', String(this.userId));
      formData.append('nomoperateur', this.registrationForm.get('nomoperateur')?.value);
      formData.append('email', this.registrationForm.get('email')?.value);
      formData.append('adresseoperateur', this.registrationForm.get('adresseoperateur')?.value);
      formData.append('idville', this.registrationForm.get('idville')?.value);
      let telephone = String(this.registrationForm.get('telephone')?.value);
      if (!telephone.startsWith('0')) {
          telephone = '0' + telephone;
      }
      formData.append('telephone', telephone);
      formData.append('telecopie', this.registrationForm.get('telecopie')?.value);
      formData.append('idstructurejuridique', this.registrationForm.get('idstructurejuridique')?.value);
      formData.append('idformulaire', this.formulaires[0].idformulaire.toString());
      formData.append('datedeclaration', new Date().toISOString().split('T')[0]);

      // Créez une variable pour stocker les réponses
      const responses: any[] = [];

      this.getCategories(this.formulaires).forEach((category, categoryIndex) => {
        category.questions.forEach((question: { idquestion: any; typequestion: string; }, questionIndex: number) => {
            for (let i = 0; i < category.nombreReponses; i++) {
                const controlName = this.generateControlName(question.idquestion, i, category.id);
                const value = this.registrationForm.get(controlName)?.value;
                const file = this.filesMap[controlName];

                if (file || (value !== null && value !== undefined && value !== '')) {
                    const response: any = {
                        idquestion: question.idquestion,
                        textereponse: '',
                        nombrereponse: ''
                    };

                    if (question.typequestion === 'file' && file) {
                        formData.append(`reponses[${responses.length}][filereponse]`, file, file.name);
                    } else if (question.typequestion === 'text') {
                        response.textereponse = value;
                    } else if (question.typequestion === 'number') {
                        response.nombrereponse = String(value);
                    }

                    responses.push(response);
                }
            }
        });
    });


      // Ajoutez les réponses à formData
      responses.forEach((response, index) => {
          formData.append(`reponses[${index}][idquestion]`, response.idquestion);
          formData.append(`reponses[${index}][textereponse]`, response.textereponse);
          formData.append(`reponses[${index}][nombrereponse]`, response.nombrereponse);
      });

      console.log('Contenu de formData :');
      formData.forEach((value, key) => {
          console.log(`${key}:`, value);
      });

      this.demandeService.addDemande(formData).subscribe({
        next: (response) => {
            this.successMessage = response.message || 'Demande créée avec succès';
            this.errorMessage = null; // Effacer les messages d'erreur si la demande est réussie
            this.closeModal();
            console.log('Réponse du serveur', response);
            // Rediriger ou effectuer d'autres actions après succès
        },
        error: (error) => {
            // Afficher les détails de l'erreur, si disponibles
            this.successMessage = null; // Effacer les messages de succès en cas d'erreur
            this.errorMessage = error.error?.error || 'Erreur lors de la création de la demande.';
            this.closeModal();
            console.error('Erreur lors de la création de la demande', error);
        }

    });
  }




    generateControlName(questionId: string, responseIndex: number, categoryId: number): string {
      return `${questionId}-${responseIndex}-${categoryId}`;
    }

    closeModal(): void {
      const modalElement = document.getElementById('confirmationModal');
      if (modalElement) {
          modalElement.setAttribute('aria-hidden', 'true');
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';
      }

      // Remove modal-specific classes and styles from the body
      document.body.classList.remove('modal-open');
      document.body.style.overflow = ''; // Réinitialise le style overflow du body
      document.body.style.paddingRight = ''; // Réinitialise le padding du body s'il a été ajusté

      // Remove the backdrop element
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
          backdrop.remove();
      }

      // Scroll to the page-header element
      const headerElement = document.querySelector('.message');
      if (headerElement) {
          headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  }

  }
