import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoMaquinariaPropioListComponent } from './estado-maquinaria-propio-list.component';

describe('EstadoMaquinariaPropioListComponent', () => {
  let component: EstadoMaquinariaPropioListComponent;
  let fixture: ComponentFixture<EstadoMaquinariaPropioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoMaquinariaPropioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoMaquinariaPropioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
