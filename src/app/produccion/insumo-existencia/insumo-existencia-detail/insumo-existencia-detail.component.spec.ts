import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InsumoExistenciaDetailComponent } from './insumo-existencia-detail.component';

describe('InsumoExistenciaDetailComponent', () => {
  let component: InsumoExistenciaDetailComponent;
  let fixture: ComponentFixture<InsumoExistenciaDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoExistenciaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoExistenciaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
