import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoExistenciaEditComponent } from './insumo-existencia-edit.component';

describe('InsumoExistenciaEditComponent', () => {
  let component: InsumoExistenciaEditComponent;
  let fixture: ComponentFixture<InsumoExistenciaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoExistenciaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoExistenciaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
