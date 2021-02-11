import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonacalendarioCreateComponent } from './personacalendario-create.component';

describe('PersonacalendarioCreateComponent', () => {
  let component: PersonacalendarioCreateComponent;
  let fixture: ComponentFixture<PersonacalendarioCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonacalendarioCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonacalendarioCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
