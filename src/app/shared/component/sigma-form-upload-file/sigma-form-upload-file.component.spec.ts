import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaFormUploadFileComponent } from './sigma-form-upload-file.component';

describe('SigmaFormUploadFileComponent', () => {
  let component: SigmaFormUploadFileComponent;
  let fixture: ComponentFixture<SigmaFormUploadFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaFormUploadFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaFormUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
