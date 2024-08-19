import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccueilComponent } from './client-accueil.component';

describe('ClientAccueilComponent', () => {
  let component: ClientAccueilComponent;
  let fixture: ComponentFixture<ClientAccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAccueilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
