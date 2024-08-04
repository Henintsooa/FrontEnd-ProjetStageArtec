import { Component } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [],
  templateUrl: './admin-header.component.html'
})
export class AdminHeaderComponent {
  constructor(private sidebarService: SidebarService) {}

  toggleNav() {
    this.sidebarService.toggleNav();
  }
}
