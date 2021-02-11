import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventorolAdminComponent } from './eventorol-admin.component';

describe('EventorolAdminComponent', () => {
  let component: EventorolAdminComponent;
  let fixture: ComponentFixture<EventorolAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventorolAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventorolAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
