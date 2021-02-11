import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonacalendarioEditComponent } from './personacalendario-edit.component';

describe('PersonacalendarioEditComponent', () => {
  let component: PersonacalendarioEditComponent;
  let fixture: ComponentFixture<PersonacalendarioEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonacalendarioEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonacalendarioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
