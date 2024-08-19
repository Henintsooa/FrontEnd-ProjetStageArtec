import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormulaireService } from '../../services/formulaire.service';
import { CommonModule } from '@angular/common';
import { VilleService } from '../../services/ville.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StructureJuridiquesService } from '../../services/structureJuridique.service';

@Component({
  selector: 'app-formulaire-details',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './formulaire-details.component.html'
})
export class FormulaireDetailsComponent implements OnInit {
  formulaires: any[] = [];  // Utilisez un tableau pour stocker plusieurs formulaires
  villes: any[] = [];
  structuresJuridique: any[] = [];
  registrationForm: FormGroup;
  imgSrc: string = '';

  constructor(private fb: FormBuilder,private villeService:VilleService,private structureJuridiquesService: StructureJuridiquesService, private router: Router,private route: ActivatedRoute, private formulaireService: FormulaireService) {
    this.registrationForm = this.fb.group({
      nom: ['', Validators.required],
      emailOperateur: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      idville: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      idstructurejuridique: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      telecopie: ['']
    });
  }

  getCategories(formulaires: any[]): any[] {
    const categories = formulaires.map(question => question.categoriequestion);
    const uniqueCategories = [...new Set(categories)];
    return uniqueCategories.map(categoryName => {
      return {
        name: categoryName,
        questions: this.getQuestionsByCategory(formulaires, categoryName),
        nombreReponses: formulaires.find(q => q.categoriequestion === categoryName)?.nombrereponses
      };
    });
  }

  // Retourne les questions pour une catégorie donnée
  getQuestionsByCategory(formulaires: any[], category: string): any[] {
    return formulaires.filter(question => question.categoriequestion === category);
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
    this.loadStructuresJuridique();
    this.loadVilles();
    const id = Number(this.route.snapshot.paramMap.get('idtypeformulaire'));
    if (id) {
      this.formulaireService.getFormulaireByType(id).subscribe({
        next: (data: any[]) => {
          console.log(data);
          this.formulaires = data;
          this.imgSrc = `http://127.0.0.1:8000/${this.formulaires[0].image}`;
          console.log(this.imgSrc);
        },
        error: (error: any) => {
          console.error('Erreur lors de la récupération des formulaires', error);
        }
      });
    }
  }

}
