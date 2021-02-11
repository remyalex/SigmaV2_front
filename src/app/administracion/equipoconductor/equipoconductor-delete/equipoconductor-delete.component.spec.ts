import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoconductorDeleteComponent } from './Equipoconductor-delete.component';

describe('EquipoconductorDeleteComponent', () => {
  let component: EquipoconductorDeleteComponent;
  let fixture: ComponentFixture<EquipoconductorDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoconductorDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoconductorDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
