import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaShowFileComponent } from './sigma-show-file.component';

describe('SigmaShowFileComponent', () => {
  let component: SigmaShowFileComponent;
  let fixture: ComponentFixture<SigmaShowFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaShowFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaShowFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
