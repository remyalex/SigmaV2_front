import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoconductorDetailComponent } from './Equipoconductor-detail.component';

describe('EquipoconductorDetailComponent', () => {
  let component: EquipoconductorDetailComponent;
  let fixture: ComponentFixture<EquipoconductorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoconductorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoconductorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
