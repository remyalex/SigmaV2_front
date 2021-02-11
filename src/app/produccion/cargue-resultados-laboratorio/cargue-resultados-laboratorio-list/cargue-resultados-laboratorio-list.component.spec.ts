import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueResultadosLaboratorioListComponent } from './cargue-resultados-laboratorio-list.component';

describe('CargueResultadosLaboratorioListComponent', () => {
  let component: CargueResultadosLaboratorioListComponent;
  let fixture: ComponentFixture<CargueResultadosLaboratorioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargueResultadosLaboratorioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargueResultadosLaboratorioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
