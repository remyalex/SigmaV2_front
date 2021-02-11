import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaDetailComponent } from './sigma-detail.component';

describe('SigmaDetailComponent', () => {
  let component: SigmaDetailComponent;
  let fixture: ComponentFixture<SigmaDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
