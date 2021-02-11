import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoDeleteComponent } from './equipo-delete.component';

describe('EquipoDeleteComponent', () => {
  let component: EquipoDeleteComponent;
  let fixture: ComponentFixture<EquipoDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
