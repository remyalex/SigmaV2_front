import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventousuarioEditComponent } from './eventousuario-edit.component';

describe('EventousuarioEditComponent', () => {
  let component: EventousuarioEditComponent;
  let fixture: ComponentFixture<EventousuarioEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventousuarioEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventousuarioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
