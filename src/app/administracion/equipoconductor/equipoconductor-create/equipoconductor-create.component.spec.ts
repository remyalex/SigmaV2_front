import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoconductorCreateComponent } from './Equipoconductor-create.component';

describe('EquipoconductorCreateComponent', () => {
  let component: EquipoconductorCreateComponent;
  let fixture: ComponentFixture<EquipoconductorCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoconductorCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoconductorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
