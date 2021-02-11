import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoconductorListComponent } from './Equipoconductor-list.component';

describe('EquipoconductorListComponent', () => {
  let component: EquipoconductorListComponent;
  let fixture: ComponentFixture<EquipoconductorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoconductorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoconductorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
