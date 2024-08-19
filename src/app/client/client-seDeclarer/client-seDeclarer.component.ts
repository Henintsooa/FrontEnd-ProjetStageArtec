  import { Component, OnInit } from '@angular/core';
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
    filesMap: any;

    constructor(private fb: FormBuilder, private villeService: VilleService,private structureJuridiquesService: StructureJuridiquesService,private demandeService: DemandeService, private router: Router, private route: ActivatedRoute, private formulaireService: FormulaireService) {
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

      // console.log('Catégories uniques:', uniqueCategories);

      const result = uniqueCategories.map(categoryName => {
        const firstMatchingQuestion = formulaires.find(q => q.categoriequestion === categoryName);

        // console.log(`Category: ${categoryName}, ID: ${firstMatchingQuestion?.idcategoriequestion}`);

        return {
          name: categoryName,
          id: firstMatchingQuestion?.idcategoriequestion,
          questions: this.getQuestionsByCategory(formulaires, categoryName),
          nombreReponses: firstMatchingQuestion?.nombrereponses || 0
        };
      });

      // console.log('Résultat des catégories:', result);
      return result;
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
            console.log(this.imgSrc);
          },
          error: (error: any) => {
            console.error('Erreur lors de la récupération des formulaires', error);
          }
        });
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
        category.questions.forEach((question: {
          questionobligatoire: any; idquestion: string; typequestion: string;
        }) => {
          for (let i = 0; i < category.nombreReponses; i++) {
            const controlName = this.generateControlName(question.idquestion, i, category.id);

            // Vérifiez que le nom du contrôle est valide
            console.log('Ajout du contrôle:', controlName);

            let control = null;

            if (question.typequestion === 'file') {
              control = new FormControl(null, question.questionobligatoire ? Validators.required : null);
              console.log('Type de la question:', question.typequestion);
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

      // Assurez-vous que le fichier est bien sélectionné
      if (file) {
        console.log(`Fichier sélectionné pour ${controlName}:`, file);
        // Utilisez FormData pour gérer les fichiers lors de l'envoi
        this.filesMap[controlName] = file; // `filesMap` est un objet pour stocker les fichiers
      } else {
        console.log(`Aucun fichier sélectionné pour ${controlName}`);
        this.filesMap[controlName] = null;
      }
    }




    submitForm(): void {
      if (this.registrationForm.invalid) {
        console.log('Formulaire invalide', this.registrationForm.errors);
        return;
      }

      const formData = new FormData();

      formData.append('id', String(this.userId));
      formData.append('nomoperateur', this.registrationForm.get('nomoperateur')?.value);
      formData.append('email', this.registrationForm.get('email')?.value);
      formData.append('adresseoperateur', this.registrationForm.get('adresseoperateur')?.value);
      formData.append('idville', this.registrationForm.get('idville')?.value);
      formData.append('telephone', this.registrationForm.get('telephone')?.value);
      formData.append('telecopie', this.registrationForm.get('telecopie')?.value);
      formData.append('idstructurejuridique', this.registrationForm.get('idstructurejuridique')?.value);
      formData.append('idformulaire', this.formulaires[0].idformulaire.toString());
      formData.append('datedeclaration', new Date().toISOString().split('T')[0]);

      const reponses: any[] = [];

      this.getCategories(this.formulaires).forEach(category => {
        category.questions.forEach((question: { idquestion: string; typequestion: string; }) => {
          for (let i = 0; i < category.nombreReponses; i++) {
            const controlName = this.generateControlName(question.idquestion, i, category.id);
            const control = this.registrationForm.get(controlName);

            if (control) {
              const value = control.value;
              if (question.typequestion === 'file' && value instanceof File) {
                formData.append(`file_${question.idquestion}_${i}`, value, value.name);
                reponses.push({
                  idquestion: question.idquestion,
                  textereponse: null,
                  nombrereponse: null,
                  filereponse: `file_${question.idquestion}_${i}`  // Le nom du fichier pour le backend
                });
              } else {
                reponses.push({
                  idquestion: question.idquestion,
                  textereponse: question.typequestion === 'text' ? value : null,
                  nombrereponse: question.typequestion === 'number' ? value : null,
                  filereponse: null
                });
              }
            }
          }
        });
      });

      formData.append('reponses', JSON.stringify(reponses));

      // Debug: Afficher le contenu de formData
      console.log('Contenu de formData :');
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      this.demandeService.addDemande(formData).subscribe({
        next: (response) => {
          console.log('Réponse du serveur', response);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la demande', error);
        }
      });
    }





    generateControlName(questionId: string, responseIndex: number, categoryId: number): string {
      return `${questionId}-${responseIndex}-${categoryId}`;
    }





  }
