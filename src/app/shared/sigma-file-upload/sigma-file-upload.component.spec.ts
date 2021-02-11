import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaFileUploadComponent } from './sigma-file-upload.component';

describe('SigmaFileUploadComponent', () => {
  let component: SigmaFileUploadComponent;
  let fixture: ComponentFixture<SigmaFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
