import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoAdminComponent } from './evento-admin.component';

describe('EventoAdminComponent', () => {
  let component: EventoAdminComponent;
  let fixture: ComponentFixture<EventoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
