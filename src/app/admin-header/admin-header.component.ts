import { Component } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [],
  templateUrl: './admin-header.component.html'
})
export class AdminHeaderComponent {
  constructor(private sidebarService: SidebarService,private authService: AuthService, private router: Router) {}

  toggleNav() {
    this.sidebarService.toggleNav();
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
