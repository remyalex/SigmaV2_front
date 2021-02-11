import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaoperacionesListComponent } from './planillaoperaciones-list.component';

describe('PlanillaoperacionesListComponent', () => {
  let component: PlanillaoperacionesListComponent;
  let fixture: ComponentFixture<PlanillaoperacionesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaoperacionesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaoperacionesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
