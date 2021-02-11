import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudEnsayosCreateComponent } from './registro-mezcla-insumos-create.component';

describe('SolicitudEnsayosCreateComponent', () => {
  let component: SolicitudEnsayosCreateComponent;
  let fixture: ComponentFixture<SolicitudEnsayosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudEnsayosCreateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudEnsayosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});