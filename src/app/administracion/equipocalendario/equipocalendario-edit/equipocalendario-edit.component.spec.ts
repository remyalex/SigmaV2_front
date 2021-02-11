import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipocalendarioEditComponent } from './equipocalendario-edit.component';

describe('EquipocalendarioEditComponent', () => {
  let component: EquipocalendarioEditComponent;
  let fixture: ComponentFixture<EquipocalendarioEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipocalendarioEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipocalendarioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
