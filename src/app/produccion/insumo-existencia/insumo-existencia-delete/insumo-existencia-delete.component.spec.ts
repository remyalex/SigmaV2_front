import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InsumoExistenciaDeleteComponent } from './insumo-existencia-delete.component';

describe('InsumoExistenciaDeleteComponent', () => {
  let component: InsumoExistenciaDeleteComponent;
  let fixture: ComponentFixture<InsumoExistenciaDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoExistenciaDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoExistenciaDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
