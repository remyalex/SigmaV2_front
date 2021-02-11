import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonanovedadEditComponent } from './personanovedad-edit.component';

describe('PersonanovedadEditComponent', () => {
  let component: PersonanovedadEditComponent;
  let fixture: ComponentFixture<PersonanovedadEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonanovedadEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonanovedadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
