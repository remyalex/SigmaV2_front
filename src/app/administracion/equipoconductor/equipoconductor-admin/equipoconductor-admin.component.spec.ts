import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoconductorAdminComponent } from './Equipoconductor-admin.component';

describe('EquipoconductorAdminComponent', () => {
  let component: EquipoconductorAdminComponent;
  let fixture: ComponentFixture<EquipoconductorAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoconductorAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoconductorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
