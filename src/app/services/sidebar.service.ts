// sidebar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isNavExpandedSubject = new BehaviorSubject<boolean>(false);
  isNavExpanded$ = this.isNavExpandedSubject.asObservable();

  private isExpandedSubject = new BehaviorSubject<boolean>(false);
  isExpanded$ = this.isExpandedSubject.asObservable();

  toggleNav() {
    const newIsNavExpanded = !this.isNavExpandedSubject.value;
    const newIsExpanded = !this.isExpandedSubject.value;

    this.isNavExpandedSubject.next(newIsNavExpanded);
    this.isExpandedSubject.next(newIsExpanded);

    document.body.className = newIsExpanded
      ? 'g-sidenav-show bg-gray-100 g-sidenav-pinned'
      : 'g-sidenav-show bg-gray-100';

    console.log('Nav expanded:', newIsNavExpanded); // Debugging
    console.log('Expanded:', newIsExpanded); // Debugging
  }
}
