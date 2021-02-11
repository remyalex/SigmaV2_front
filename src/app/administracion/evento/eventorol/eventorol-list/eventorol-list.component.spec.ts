import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventorolListComponent } from './eventorol-list.component';

describe('EventorolListComponent', () => {
  let component: EventorolListComponent;
  let fixture: ComponentFixture<EventorolListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventorolListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventorolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
