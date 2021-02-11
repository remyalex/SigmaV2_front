import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFichaCierreIntervencionComponent } from './detalle-ficha-cierre-intervencion.component';

describe('DetalleFichaCierreIntervencionComponent', () => {
  let component: DetalleFichaCierreIntervencionComponent;
  let fixture: ComponentFixture<DetalleFichaCierreIntervencionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleFichaCierreIntervencionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleFichaCierreIntervencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
