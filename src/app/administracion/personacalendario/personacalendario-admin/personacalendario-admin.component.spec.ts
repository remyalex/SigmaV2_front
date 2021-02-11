import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonacalendarioAdminComponent } from './personacalendario-admin.component';

describe('PersonacalendarioAdminComponent', () => {
  let component: PersonacalendarioAdminComponent;
  let fixture: ComponentFixture<PersonacalendarioAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonacalendarioAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonacalendarioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
