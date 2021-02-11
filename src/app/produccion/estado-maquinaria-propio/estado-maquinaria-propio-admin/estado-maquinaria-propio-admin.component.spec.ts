import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoMaquinariaPropioAdminComponent } from './estado-maquinaria-propio-admin.component';

describe('EstadoMaquinariaPropioAdminComponent', () => {
  let component: EstadoMaquinariaPropioAdminComponent;
  let fixture: ComponentFixture<EstadoMaquinariaPropioAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoMaquinariaPropioAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoMaquinariaPropioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
