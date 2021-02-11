import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadicadoSalidaComponent } from './radicado-salida.component';

describe('RadicadoSalidaComponent', () => {
  let component: RadicadoSalidaComponent;
  let fixture: ComponentFixture<RadicadoSalidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadicadoSalidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadicadoSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
