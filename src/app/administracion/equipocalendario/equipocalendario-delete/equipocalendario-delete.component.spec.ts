import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipocalendarioDeleteComponent } from './equipocalendario-delete.component';

describe('EquipocalendarioDeleteComponent', () => {
  let component: EquipocalendarioDeleteComponent;
  let fixture: ComponentFixture<EquipocalendarioDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipocalendarioDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipocalendarioDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
