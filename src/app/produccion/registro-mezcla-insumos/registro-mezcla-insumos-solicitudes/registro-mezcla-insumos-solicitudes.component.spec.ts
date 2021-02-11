import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResgistroMezclaInsumosSolicitudesComponent } from './registro-mezcla-insumos-solicitudes.component';

describe('ResgistroMezclaInsumosSolicitudesComponent', () => {
  let component: ResgistroMezclaInsumosSolicitudesComponent;
  let fixture: ComponentFixture<ResgistroMezclaInsumosSolicitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResgistroMezclaInsumosSolicitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResgistroMezclaInsumosSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});