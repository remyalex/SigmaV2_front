import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoCreateComponent } from './equipo-create.component';

describe('EquipoCreateComponent', () => {
  let component: EquipoCreateComponent;
  let fixture: ComponentFixture<EquipoCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
