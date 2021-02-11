import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaDatePickerComponent } from './sigma-date-picker.component';

describe('SigmaDatePickerComponent', () => {
  let component: SigmaDatePickerComponent;
  let fixture: ComponentFixture<SigmaDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
