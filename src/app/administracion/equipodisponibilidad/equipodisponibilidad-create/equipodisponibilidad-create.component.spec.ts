import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipodisponibilidadCreateComponent } from './equipodisponibilidad-create.component';

describe('EquipodisponibilidadCreateComponent', () => {
  let component: EquipodisponibilidadCreateComponent;
  let fixture: ComponentFixture<EquipodisponibilidadCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipodisponibilidadCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipodisponibilidadCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
