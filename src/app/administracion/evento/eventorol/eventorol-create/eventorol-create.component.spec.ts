import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventorolCreateComponent } from './eventorol-create.component';

describe('EventorolCreateComponent', () => {
  let component: EventorolCreateComponent;
  let fixture: ComponentFixture<EventorolCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventorolCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventorolCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
