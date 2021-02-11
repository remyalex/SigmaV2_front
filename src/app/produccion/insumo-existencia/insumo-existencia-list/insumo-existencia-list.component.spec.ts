import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoExistenciaListComponent } from './insumo-existencia-list.component';

describe('InsumoExistenciaListComponent', () => {
  let component: InsumoExistenciaListComponent;
  let fixture: ComponentFixture<InsumoExistenciaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoExistenciaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoExistenciaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
