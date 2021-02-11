import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleErrorMatSnackbarComponent } from './multiple-error-mat-snackbar.component';

describe('MultipleErrorMatSnackbarComponent', () => {
  let component: MultipleErrorMatSnackbarComponent;
  let fixture: ComponentFixture<MultipleErrorMatSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleErrorMatSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleErrorMatSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
