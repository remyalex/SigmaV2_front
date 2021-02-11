import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonacalendarioDetailComponent } from './personacalendario-detail.component';

describe('PersonacalendarioDetailComponent', () => {
  let component: PersonacalendarioDetailComponent;
  let fixture: ComponentFixture<PersonacalendarioDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonacalendarioDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonacalendarioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
