import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonacalendarioListComponent } from './personacalendario-list.component';

describe('PersonacalendarioListComponent', () => {
  let component: PersonacalendarioListComponent;
  let fixture: ComponentFixture<PersonacalendarioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonacalendarioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonacalendarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
