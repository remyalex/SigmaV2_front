import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonanovedadCreateComponent } from './personanovedad-create.component';

describe('PersonanovedadCreateComponent', () => {
  let component: PersonanovedadCreateComponent;
  let fixture: ComponentFixture<PersonanovedadCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonanovedadCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonanovedadCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
