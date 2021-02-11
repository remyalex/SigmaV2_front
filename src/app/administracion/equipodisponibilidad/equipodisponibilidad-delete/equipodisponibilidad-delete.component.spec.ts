import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipodisponibilidadDeleteComponent } from './equipodisponibilidad-delete.component';

describe('EquipodisponibilidadDeleteComponent', () => {
  let component: EquipodisponibilidadDeleteComponent;
  let fixture: ComponentFixture<EquipodisponibilidadDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipodisponibilidadDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipodisponibilidadDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
