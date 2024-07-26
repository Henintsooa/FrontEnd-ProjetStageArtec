import { Component, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-aside',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-aside.component.html',
  styleUrl: './header-aside.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HeaderAsideComponent {
  isExpanded = false;
  isNavExpanded: boolean = false;
  toggleNav() {
    this.isNavExpanded = !this.isNavExpanded;
    this.isExpanded = !this.isExpanded;
    document.body.className = this.isExpanded
      ? 'g-sidenav-show bg-gray-100 g-sidenav-pinned'
      : 'g-sidenav-show bg-gray-100';
  }
}
