import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipocalendarioDetailComponent } from './equipocalendario-detail.component';

describe('EquipocalendarioDetailComponent', () => {
  let component: EquipocalendarioDetailComponent;
  let fixture: ComponentFixture<EquipocalendarioDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipocalendarioDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipocalendarioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
