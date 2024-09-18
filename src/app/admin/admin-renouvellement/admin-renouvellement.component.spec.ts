import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRenouvellementComponent } from './admin-renouvellement.component';

describe('AdminRenouvellementComponent', () => {
  let component: AdminRenouvellementComponent;
  let fixture: ComponentFixture<AdminRenouvellementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRenouvellementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRenouvellementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
