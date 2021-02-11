import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaoperacionesCreateComponent } from './planillaoperaciones-create.component';

describe('PlanillaoperacionesCreateComponent', () => {
  let component: PlanillaoperacionesCreateComponent;
  let fixture: ComponentFixture<PlanillaoperacionesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaoperacionesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaoperacionesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
