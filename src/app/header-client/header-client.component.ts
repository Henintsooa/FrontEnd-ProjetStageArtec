import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-client.component.html',
  styleUrl: './header-client.component.css',
  encapsulation: ViewEncapsulation.None

})
export class HeaderClientComponent {
  isExpanded: boolean = false;

  toggleNav() {
    this.isExpanded = !this.isExpanded;
  }
}
