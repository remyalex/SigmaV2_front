import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaSelectComponent } from './sigma-select.component';

describe('SigmaSelectComponent', () => {
  let component: SigmaSelectComponent;
  let fixture: ComponentFixture<SigmaSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
