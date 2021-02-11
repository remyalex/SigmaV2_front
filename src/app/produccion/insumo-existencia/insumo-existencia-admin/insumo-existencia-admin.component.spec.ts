import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoExistenciaAdminComponent } from './insumo-existencia-admin.component';

describe('InsumoExistenciaAdminComponent', () => {
  let component: InsumoExistenciaAdminComponent;
  let fixture: ComponentFixture<InsumoExistenciaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoExistenciaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoExistenciaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
