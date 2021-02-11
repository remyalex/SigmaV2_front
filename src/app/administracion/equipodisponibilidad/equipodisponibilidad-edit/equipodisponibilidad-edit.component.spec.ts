import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipodisponibilidadEditComponent } from './equipodisponibilidad-edit.component';

describe('EquipodisponibilidadEditComponent', () => {
  let component: EquipodisponibilidadEditComponent;
  let fixture: ComponentFixture<EquipodisponibilidadEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipodisponibilidadEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipodisponibilidadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
