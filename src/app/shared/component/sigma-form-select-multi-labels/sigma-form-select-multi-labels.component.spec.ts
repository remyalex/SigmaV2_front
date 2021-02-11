import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaFormSelectMultiLabelsComponent } from './sigma-form-select-multi-labels.component';

describe('SigmaFormSelectMultiLabelsComponent', () => {
  let component: SigmaFormSelectMultiLabelsComponent;
  let fixture: ComponentFixture<SigmaFormSelectMultiLabelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaFormSelectMultiLabelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaFormSelectMultiLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
