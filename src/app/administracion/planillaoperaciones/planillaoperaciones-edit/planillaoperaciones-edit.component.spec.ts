import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaoperacionesEditComponent } from './planillaoperaciones-edit.component';

describe('PlanillaoperacionesEditComponent', () => {
  let component: PlanillaoperacionesEditComponent;
  let fixture: ComponentFixture<PlanillaoperacionesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaoperacionesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaoperacionesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
