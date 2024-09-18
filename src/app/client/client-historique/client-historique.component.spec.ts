import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHistoriqueComponent } from './client-historique.component';

describe('ClientHistoriqueComponent', () => {
  let component: ClientHistoriqueComponent;
  let fixture: ComponentFixture<ClientHistoriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientHistoriqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
