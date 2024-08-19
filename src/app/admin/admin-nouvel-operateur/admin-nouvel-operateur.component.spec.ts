import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNouvelOperateurComponent } from './admin-nouvel-operateur.component';

describe('AdminNouvelOperateurComponent', () => {
  let component: AdminNouvelOperateurComponent;
  let fixture: ComponentFixture<AdminNouvelOperateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNouvelOperateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNouvelOperateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
