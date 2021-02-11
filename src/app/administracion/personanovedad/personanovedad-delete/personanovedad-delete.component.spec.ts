import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonanovedadDeleteComponent } from './personanovedad-delete.component';

describe('PersonanovedadDeleteComponent', () => {
  let component: PersonanovedadDeleteComponent;
  let fixture: ComponentFixture<PersonanovedadDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonanovedadDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonanovedadDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
