import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoExistenciaCreateComponent } from './insumo-existencia-create.component';

describe('InsumoExistenciaCreateComponent', () => {
  let component: InsumoExistenciaCreateComponent;
  let fixture: ComponentFixture<InsumoExistenciaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoExistenciaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoExistenciaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
