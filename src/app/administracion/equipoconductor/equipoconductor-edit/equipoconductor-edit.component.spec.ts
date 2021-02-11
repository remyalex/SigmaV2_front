import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoconductorEditComponent } from './Equipoconductor-edit.component';

describe('EquipoconductorEditComponent', () => {
  let component: EquipoconductorEditComponent;
  let fixture: ComponentFixture<EquipoconductorEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoconductorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoconductorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
