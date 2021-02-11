import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaGraphicProcessComponent } from './sigma-graphic-process.component';

describe('SigmaGraphicProcessComponent', () => {
  let component: SigmaGraphicProcessComponent;
  let fixture: ComponentFixture<SigmaGraphicProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaGraphicProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaGraphicProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
