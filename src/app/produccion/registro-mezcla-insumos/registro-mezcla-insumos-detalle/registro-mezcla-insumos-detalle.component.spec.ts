import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMezclaInsumosDetalleComponent } from './registro-mezcla-insumos-detalle.component';

describe('RegistroMezclaInsumosDetalleComponent', () => {
  let component: RegistroMezclaInsumosDetalleComponent;
  let fixture: ComponentFixture<RegistroMezclaInsumosDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroMezclaInsumosDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroMezclaInsumosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
