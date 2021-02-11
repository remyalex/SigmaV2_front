import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaFormAutocompleteComponent } from './sigma-form-autocomplete.component';

describe('SigmaFormAutocompleteComponent', () => {
  let component: SigmaFormAutocompleteComponent;
  let fixture: ComponentFixture<SigmaFormAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaFormAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaFormAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
