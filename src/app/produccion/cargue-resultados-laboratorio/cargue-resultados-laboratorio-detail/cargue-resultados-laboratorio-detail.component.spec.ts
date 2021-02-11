import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueResultadosLaboratorioDetailComponent } from './cargue-resultados-laboratorio-detail.component';

describe('CargueResultadosLaboratorioDetailComponent', () => {
  let component: CargueResultadosLaboratorioDetailComponent;
  let fixture: ComponentFixture<CargueResultadosLaboratorioDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargueResultadosLaboratorioDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargueResultadosLaboratorioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
