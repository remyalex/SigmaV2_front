import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventorolDeleteComponent } from './eventorol-delete.component';

describe('EventorolDeleteComponent', () => {
  let component: EventorolDeleteComponent;
  let fixture: ComponentFixture<EventorolDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventorolDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventorolDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
