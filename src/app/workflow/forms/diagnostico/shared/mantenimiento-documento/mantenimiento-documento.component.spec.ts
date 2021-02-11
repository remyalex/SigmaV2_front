import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MantenimientoDocumentoComponent } from './mantenimiento-documento.component';


describe('MantenimientoDocumentoComponent', () => {
  let component: MantenimientoDocumentoComponent;
  let fixture: ComponentFixture<MantenimientoDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
