import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorizarSolicitudesApiquesComponent } from './priorizar-solicitudes-apiques.component';


describe('PriorizarSolicitudesApiquesComponent', () => {
  let component: PriorizarSolicitudesApiquesComponent;
  let fixture: ComponentFixture<PriorizarSolicitudesApiquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorizarSolicitudesApiquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorizarSolicitudesApiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
