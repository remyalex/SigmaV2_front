import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaOperacionDeleteComponent } from './planilla-operacion-delete.component';

describe('PlanillaOperacionDeleteComponent', () => {
  let component: PlanillaOperacionDeleteComponent;
  let fixture: ComponentFixture<PlanillaOperacionDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaOperacionDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaOperacionDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
