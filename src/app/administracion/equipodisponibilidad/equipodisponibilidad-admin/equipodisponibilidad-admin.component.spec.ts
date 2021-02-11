import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipodisponibilidadAdminComponent } from './equipodisponibilidad-admin.component';

describe('EquipodisponibilidadAdminComponent', () => {
  let component: EquipodisponibilidadAdminComponent;
  let fixture: ComponentFixture<EquipodisponibilidadAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipodisponibilidadAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipodisponibilidadAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
