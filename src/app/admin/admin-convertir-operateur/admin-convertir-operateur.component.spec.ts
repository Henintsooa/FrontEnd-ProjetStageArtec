import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConvertirOperateurComponent } from './admin-convertir-operateur.component';

describe('AdminConvertirOperateurComponent', () => {
  let component: AdminConvertirOperateurComponent;
  let fixture: ComponentFixture<AdminConvertirOperateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminConvertirOperateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminConvertirOperateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
