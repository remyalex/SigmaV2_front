import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventousuarioCreateComponent } from './eventousuario-create.component';

describe('EventousuarioCreateComponent', () => {
  let component: EventousuarioCreateComponent;
  let fixture: ComponentFixture<EventousuarioCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventousuarioCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventousuarioCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
