import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipocalendarioListComponent } from './equipocalendario-list.component';

describe('EquipocalendarioListComponent', () => {
  let component: EquipocalendarioListComponent;
  let fixture: ComponentFixture<EquipocalendarioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipocalendarioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipocalendarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
