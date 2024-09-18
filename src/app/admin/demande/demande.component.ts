// demande.component.ts
import { Component, OnInit } from '@angular/core';
import { DemandeService } from '../../services/demande.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { VilleService } from '../../services/ville.service';

@Component({
  selector: 'app-demande',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.css']
})
export class DemandeComponent implements OnInit {
  demandes: any[] = [];
  public iddemande!: number;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  infoRequestMessage: string = '';
  selectedStatus: string = '1';
  filteredDemandes: any[] = [];
  searchKeyword: string = '';

  startDate: string = ''; // Ou une autre valeur par défaut
  endDate: string = ''; // Ou une autre valeur par défaut
  selectedFormType: string = ''; // Initialisation du type sélectionné
  selectedCity: string = '';

  regions: any[] = [];

  paginatedDemandes: any[] = [];
  itemsPerPage: number = 10; // Nombre d'éléments par page
  itemsPerPageOptions: number[] = [10, 25, 50, 100];

  currentPage: number = 1;

  constructor(private demandeService: DemandeService, private route: ActivatedRoute,private villeService: VilleService) {}

  ngOnInit(): void {
    this.loadDemandes();
    this.loadVilles();
    this.route.paramMap.subscribe(params => {
      this.iddemande = +params.get('iddemande')!;
    });
  }

  loadVilles(): void {
    this.villeService.getVilles().subscribe(
      (data: any) => {
        this.regions = Array.isArray(data) ? data : [];
      },
      (error) => {
        console.error('Erreur lors de la récupération des villes:', error);
      }
    );
  }

  loadDemandes(
    keyword: string = '',
    statusFilter: string = '',
    startDate: string = '',
    endDate: string = '',
    formType: string = '',
    city: string = ''
  ): void {
    console.log('Params:', { keyword, statusFilter, startDate, endDate, formType, city });

    this.demandeService.getDemandes(keyword, this.selectedStatus, this.startDate, this.endDate, this.selectedFormType, this.selectedCity).subscribe(
      (data: any) => {
        console.log('Données reçues de l\'API:', data);
        if (Array.isArray(data)) {
          this.demandes = data;
        } else {
          console.error('Format des données inattendu:', data);
        }
        this.applyFilters();
      },
      (error) => {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    );
  }


  applyTris(): void {
    console.log('Valeurs des filtres avant l\'appel:', {
      searchKeyword: this.searchKeyword,
      selectedStatus: this.selectedStatus,
      startDate: this.startDate,
      endDate: this.endDate,
      selectedFormType: this.selectedFormType,
      selectedCity: this.selectedCity
    });

    this.closeModalFiltre();

    // Ajoutez une petite temporisation pour vous assurer que le modal est bien fermé
    setTimeout(() => {
      console.log('Valeurs des filtres après l\'appel:', {
        searchKeyword: this.searchKeyword,
        selectedStatus: this.selectedStatus,
        startDate: this.startDate,
        endDate: this.endDate,
        selectedFormType: this.selectedFormType,
        selectedCity: this.selectedCity
      });

      this.loadDemandes(
        this.searchKeyword,
        this.selectedStatus,
        this.startDate,
        this.endDate,
        this.selectedFormType,
        this.selectedCity
      );
    }, 300);
  }





  onStatusChange(): void {
    this.loadDemandes(
      this.searchKeyword,
      this.selectedStatus,
      this.startDate,
      this.endDate,
      this.selectedFormType,
      this.selectedCity
    );
  }



  onSearch(): void {
    console.log('Mot-clé de recherche:', this.searchKeyword);
    this.loadDemandes(this.searchKeyword, this.selectedStatus);
  }

  // onStatusChange(): void {
  //   this.loadDemandes();
  // }

  applyFilters(): void {
    if (this.selectedStatus === 'all') {
      this.filteredDemandes = this.demandes;
    } else {
      this.filteredDemandes = this.demandes.filter(demande =>
        this.selectedStatus === '' ? demande.status === null : demande.status == this.selectedStatus
      );
    }
    this.paginateDemandes();
  }

  paginateDemandes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDemandes = this.filteredDemandes.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
      this.paginateDemandes();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; // Réinitialiser à la première page
    this.paginateDemandes();
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.filteredDemandes.length / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
  }


  openModal(iddemande: number): void {
    this.iddemande = iddemande;
  }



  confirmValidation(): void {
    this.demandeService.accepterDemande(this.iddemande).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Succès',
          text: response.message || 'Demande validée avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'modal-content modal-dialog modal-dialog-centered', // Utiliser les classes Bootstrap 5 pour centrer le contenu
            title: 'modal-title h5', // Titre
            confirmButton: 'btn btn-primary'  // Bouton de confirmation
          },
          width: '90vw', // Largeur responsive
          padding: '1.25rem', // Padding pour le contenu
          buttonsStyling: false, // Désactiver le style par défaut pour utiliser Bootstrap
          // Ajoutez ici du CSS inline pour le max-width
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
              popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
            }
          }
        });
        this.closeModal();
        console.log('Demande validée:', response);
      },
      error: (error) => {
        Swal.fire({
          title: 'Erreur',
          text: error.error?.error || 'Une erreur est survenue lors de la validation de la demande.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'modal-content modal-dialog modal-dialog-centered',
            title: 'modal-title h5',
            confirmButton: 'btn btn-primary'
          },
          width: '90vw', // Largeur responsive
          padding: '1.25rem', // Padding pour le contenu
          buttonsStyling: false,
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
              popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
            }
          }
        });
        this.closeModal();
        console.error('Erreur lors de la validation:', error);
      }
    });
  }

  confirmSuppression(): void {
    this.demandeService.refuserDemande(this.iddemande).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Succès',
          text: response.message || 'Demande refusée avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'modal-content modal-dialog modal-dialog-centered',
            title: 'modal-title h5',
            confirmButton: 'btn btn-primary'
          },
          width: '90vw', // Largeur responsive
          padding: '1.25rem', // Padding pour le contenu
          buttonsStyling: false,
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
              popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
            }
          }
        });
        this.closeModalSuppression();
        console.log('Demande refusée:', response);
      },
      error: (error) => {
        Swal.fire({
          title: 'Erreur',
          text: error.error?.error || 'Une erreur est survenue lors de la suppression de la demande.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'modal-content modal-dialog modal-dialog-centered',
            title: 'modal-title h5',
            confirmButton: 'btn btn-primary'
          },
          width: '90vw', // Largeur responsive
          padding: '1.25rem', // Padding pour le contenu
          buttonsStyling: false,
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
              popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
            }
          }
        });
        this.closeModalSuppression();
        console.error('Erreur lors de la suppression:', error);
      }
    });
  }

  sendInfoRequest(): void {
    if (this.infoRequestMessage.trim()) {
      this.demandeService.sendInfoRequest(this.iddemande, this.infoRequestMessage).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Succès',
            text: 'Demande d\'information envoyée avec succès.',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'modal-content modal-dialog modal-dialog-centered',
              title: 'modal-title h5',
              confirmButton: 'btn btn-primary'
            },
            width: '90vw', // Largeur responsive
            padding: '1.25rem', // Padding pour le contenu
            buttonsStyling: false,
            didOpen: () => {
              const popup = Swal.getPopup();
              if (popup) {
                popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
                popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
              }
            }
          });
          this.infoRequestMessage = ''; // Réinitialiser le message
          this.closeInfoRequestModal();
        },
        error: (error) => {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'envoi de la demande d\'information.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'modal-content modal-dialog modal-dialog-centered',
              title: 'modal-title h5',
              confirmButton: 'btn btn-danger'
            },
            width: '90vw', // Largeur responsive
            padding: '1.25rem', // Padding pour le contenu
            buttonsStyling: false,
            didOpen: () => {
              const popup = Swal.getPopup();
              if (popup) {
                popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
                popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
              }
            }
          });
          this.closeInfoRequestModal();
          console.error('Erreur lors de l\'envoi de la demande d\'information:', error);
        }
      });
    }
  }


  closeModalFiltre(): void {
    const modalElement = document.getElementById('filterModal');
    if (modalElement) {
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';

        // Supprimer l'overlay sombre (backdrop)
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.parentNode?.removeChild(backdrop);
        }

        // Réactiver le scroll du corps de la page
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';

        // Supprimer l'overlay sombre (backdrop)
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.parentNode?.removeChild(backdrop);
        }

        // Réactiver le scroll du corps de la page
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
    }
  }


  closeModalSuppression(): void {
    const modalElement = document.getElementById('refusModal');
    if (modalElement) {
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';

        // Supprimer l'overlay sombre (backdrop)
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.parentNode?.removeChild(backdrop);
        }

        // Réactiver le scroll du corps de la page
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
    }
  }


  closeInfoRequestModal(): void {
    const modalElement = document.getElementById('infoRequestModal');
    if (modalElement) {
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';

      // Supprimer l'overlay sombre (backdrop)
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
          backdrop.parentNode?.removeChild(backdrop);
      }

      // Réactiver le scroll du corps de la page
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
    }
  }

  getStatusLabel(status: number | null): string {
    switch (status) {
      case 2:
        return 'Validée';
      case 3:
        return 'Refusée';
      case null:
        return 'En attente d\'information supplémentaire';
      default:
        return 'Inconnu';
    }
  }

}
