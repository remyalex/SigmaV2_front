import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaOperacionActividadesComponent } from './planilla-operacion-actividades.component';

describe('PlanillaOperacionActividadesComponent', () => {
  let component: PlanillaOperacionActividadesComponent;
  let fixture: ComponentFixture<PlanillaOperacionActividadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaOperacionActividadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaOperacionActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
