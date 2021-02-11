import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipocalendarioAdminComponent } from './equipocalendario-admin.component';

describe('EquipocalendarioAdminComponent', () => {
  let component: EquipocalendarioAdminComponent;
  let fixture: ComponentFixture<EquipocalendarioAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipocalendarioAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipocalendarioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
