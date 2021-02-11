import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaFormSelectComponent } from './sigma-form-select.component';

describe('SigmaFormSelectComponent', () => {
  let component: SigmaFormSelectComponent;
  let fixture: ComponentFixture<SigmaFormSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaFormSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaFormSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
