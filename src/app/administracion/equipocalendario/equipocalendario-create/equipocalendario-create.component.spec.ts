import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipocalendarioCreateComponent } from './equipocalendario-create.component';

describe('EquipocalendarioCreateComponent', () => {
  let component: EquipocalendarioCreateComponent;
  let fixture: ComponentFixture<EquipocalendarioCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipocalendarioCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipocalendarioCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
