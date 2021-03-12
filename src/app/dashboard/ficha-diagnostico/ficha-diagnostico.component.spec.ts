import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaDiagnosticoComponent } from './ficha-diagnostico.component';

describe('FichaDiagnosticoComponent', () => {
  let component: FichaDiagnosticoComponent;
  let fixture: ComponentFixture<FichaDiagnosticoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaDiagnosticoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
