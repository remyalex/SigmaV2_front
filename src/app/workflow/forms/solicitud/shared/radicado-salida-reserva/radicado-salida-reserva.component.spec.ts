import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadicadoSalidaReservaComponent } from './radicado-salida-reserva.component';

describe('RadicadoSalidaReservaComponent', () => {
  let component: RadicadoSalidaReservaComponent;
  let fixture: ComponentFixture<RadicadoSalidaReservaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadicadoSalidaReservaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadicadoSalidaReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
