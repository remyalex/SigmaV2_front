import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoAdminComponent } from './equipo-admin.component';

describe('EquipoAdminComponent', () => {
  let component: EquipoAdminComponent;
  let fixture: ComponentFixture<EquipoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
