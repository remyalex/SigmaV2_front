import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaOperacionAdminComponent } from './planilla-operacion-admin.component';

describe('PlanillaOperacionAdminComponent', () => {
  let component: PlanillaOperacionAdminComponent;
  let fixture: ComponentFixture<PlanillaOperacionAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaOperacionAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaOperacionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
