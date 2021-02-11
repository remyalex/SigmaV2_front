import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventousuarioDetailComponent } from './eventousuario-detail.component';

describe('EventousuarioDetailComponent', () => {
  let component: EventousuarioDetailComponent;
  let fixture: ComponentFixture<EventousuarioDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventousuarioDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventousuarioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
