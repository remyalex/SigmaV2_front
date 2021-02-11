import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaOperacionCreateComponent } from './planilla-operacion-create.component';

describe('PlanillaOperacionCreateComponent', () => {
  let component: PlanillaOperacionCreateComponent;
  let fixture: ComponentFixture<PlanillaOperacionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaOperacionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaOperacionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
