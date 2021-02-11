import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SigmaFormCalendarComponent } from './sigma-form-calendar.component';

describe('SigmaFormCalendarComponent', () => {
  let component: SigmaFormCalendarComponent;
  let fixture: ComponentFixture<SigmaFormCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaFormCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaFormCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
