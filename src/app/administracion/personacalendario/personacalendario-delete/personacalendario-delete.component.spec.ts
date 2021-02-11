import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonacalendarioDeleteComponent } from './personacalendario-delete.component';

describe('PersonacalendarioDeleteComponent', () => {
  let component: PersonacalendarioDeleteComponent;
  let fixture: ComponentFixture<PersonacalendarioDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonacalendarioDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonacalendarioDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
