import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaOperacionListComponent } from './planilla-operacion-list.component';

describe('PlanillaOperacionListComponent', () => {
  let component: PlanillaOperacionListComponent;
  let fixture: ComponentFixture<PlanillaOperacionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaOperacionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaOperacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
