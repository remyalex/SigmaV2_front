import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonanovedadListComponent } from './personanovedad-list.component';

describe('PersonanovedadListComponent', () => {
  let component: PersonanovedadListComponent;
  let fixture: ComponentFixture<PersonanovedadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonanovedadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonanovedadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
