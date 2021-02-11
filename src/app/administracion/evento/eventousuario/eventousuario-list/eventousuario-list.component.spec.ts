import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventousuarioListComponent } from './eventousuario-list.component';

describe('EventousuarioListComponent', () => {
  let component: EventousuarioListComponent;
  let fixture: ComponentFixture<EventousuarioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventousuarioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventousuarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
