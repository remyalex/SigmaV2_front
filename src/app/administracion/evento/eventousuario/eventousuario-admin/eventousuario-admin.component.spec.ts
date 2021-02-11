import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventousuarioAdminComponent } from './eventousuario-admin.component';

describe('EventousuarioAdminComponent', () => {
  let component: EventousuarioAdminComponent;
  let fixture: ComponentFixture<EventousuarioAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventousuarioAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventousuarioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
