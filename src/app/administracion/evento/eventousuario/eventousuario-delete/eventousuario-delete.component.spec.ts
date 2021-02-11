import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventousuarioDeleteComponent } from './eventousuario-delete.component';

describe('EventousuarioDeleteComponent', () => {
  let component: EventousuarioDeleteComponent;
  let fixture: ComponentFixture<EventousuarioDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventousuarioDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventousuarioDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
