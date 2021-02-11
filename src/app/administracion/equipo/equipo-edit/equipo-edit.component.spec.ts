import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoEditComponent } from './equipo-edit.component';

describe('EquipoEditComponent', () => {
  let component: EquipoEditComponent;
  let fixture: ComponentFixture<EquipoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
