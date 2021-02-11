import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonanovedadAdminComponent } from './personanovedad-admin.component';

describe('PersonanovedadAdminComponent', () => {
  let component: PersonanovedadAdminComponent;
  let fixture: ComponentFixture<PersonanovedadAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonanovedadAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonanovedadAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
