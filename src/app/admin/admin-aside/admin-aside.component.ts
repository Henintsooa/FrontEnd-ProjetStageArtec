import { Component, ViewEncapsulation,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-admin-aside',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './admin-aside.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AdminAsideComponent {
  isExpanded = false;
  isNavExpanded: boolean = false;
  activeRoute: string;

  constructor(private router: Router, private sidebarService: SidebarService) {
    // Initialiser l'activeRoute avec la route courante
    this.activeRoute = this.router.url;
  }

  ngOnInit(): void {
    // Abonnez-vous aux changements de navigation pour mettre à jour activeRoute
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.activeRoute = this.router.url;
    });

    this.sidebarService.isNavExpanded$.subscribe(isNavExpanded => {
      this.isNavExpanded = isNavExpanded;
      this.isExpanded = isNavExpanded; // Assuming you want isExpanded to follow the same logic
    });
  }

  toggleNav() {
    this.sidebarService.toggleNav();
  }
  // Méthode pour vérifier si une route est active
  isActive(route: string): boolean {
    return this.activeRoute.includes(route);
  }
  // toggleNav() {
  //   this.isNavExpanded = !this.isNavExpanded;
  //   this.isExpanded = !this.isExpanded;
  //   document.body.className = this.isExpanded
  //     ? 'g-sidenav-show bg-gray-100 g-sidenav-pinned'
  //     : 'g-sidenav-show bg-gray-100';
  //   console.log('Nav expanded:', this.isNavExpanded); // Debugging
  //   console.log('Expanded:', this.isExpanded); // Debugging
  // }
}
