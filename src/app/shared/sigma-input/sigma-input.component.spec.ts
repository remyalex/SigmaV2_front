import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaInputComponent } from './sigma-input.component';

describe('SigmaInputComponent', () => {
  let component: SigmaInputComponent;
  let fixture: ComponentFixture<SigmaInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
