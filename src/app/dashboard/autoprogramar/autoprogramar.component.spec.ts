import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoprogramarComponent } from './autoprogramar.component';

describe('AutoprogramarComponent', () => {
  let component: AutoprogramarComponent;
  let fixture: ComponentFixture<AutoprogramarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoprogramarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoprogramarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
