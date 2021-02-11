import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaFormNumberComponent } from './sigma-form-number.component';

describe('SigmaFormNumberComponent', () => {
  let component: SigmaFormNumberComponent;
  let fixture: ComponentFixture<SigmaFormNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaFormNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaFormNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
