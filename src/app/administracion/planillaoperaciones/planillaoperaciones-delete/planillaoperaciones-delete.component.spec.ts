import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaoperacionesDeleteComponent } from './planillaoperaciones-delete.component';

describe('PlanillaoperacionesDeleteComponent', () => {
  let component: PlanillaoperacionesDeleteComponent;
  let fixture: ComponentFixture<PlanillaoperacionesDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaoperacionesDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaoperacionesDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
