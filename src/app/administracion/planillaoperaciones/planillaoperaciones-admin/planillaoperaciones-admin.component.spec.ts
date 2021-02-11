import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaoperacionesAdminComponent } from './planillaoperaciones-admin.component';

describe('PlanillaoperacionesAdminComponent', () => {
  let component: PlanillaoperacionesAdminComponent;
  let fixture: ComponentFixture<PlanillaoperacionesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaoperacionesAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaoperacionesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
