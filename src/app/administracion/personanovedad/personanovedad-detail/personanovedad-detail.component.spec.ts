import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonanovedadDetailComponent } from './personanovedad-detail.component';

describe('PersonanovedadDetailComponent', () => {
  let component: PersonanovedadDetailComponent;
  let fixture: ComponentFixture<PersonanovedadDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonanovedadDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonanovedadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
