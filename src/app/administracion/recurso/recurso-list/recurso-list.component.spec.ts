import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipodisponibilidadListComponent } from './equipodisponibilidad-list.component';

describe('EquipodisponibilidadListComponent', () => {
  let component: EquipodisponibilidadListComponent;
  let fixture: ComponentFixture<EquipodisponibilidadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipodisponibilidadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipodisponibilidadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
