import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaOperacionEditComponent } from './planilla-operacion-edit.component';

describe('PlanillaOperacionEditComponent', () => {
  let component: PlanillaOperacionEditComponent;
  let fixture: ComponentFixture<PlanillaOperacionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaOperacionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaOperacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
