import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipodisponibilidadDetailComponent } from './equipodisponibilidad-detail.component';

describe('EquipodisponibilidadDetailComponent', () => {
  let component: EquipodisponibilidadDetailComponent;
  let fixture: ComponentFixture<EquipodisponibilidadDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipodisponibilidadDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipodisponibilidadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
