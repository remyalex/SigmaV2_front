import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventorolEditComponent } from './eventorol-edit.component';

describe('EventorolEditComponent', () => {
  let component: EventorolEditComponent;
  let fixture: ComponentFixture<EventorolEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventorolEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventorolEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
