import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventorolDetailComponent } from './eventorol-detail.component';

describe('EventorolDetailComponent', () => {
  let component: EventorolDetailComponent;
  let fixture: ComponentFixture<EventorolDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventorolDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventorolDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
