import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaGraphicAllProcessComponent } fro./sigma-graphic-allprocess.componentponent';

describe('SigmaGraphicProcessComponent', () => {
  let component: SigmaGraphicAllProcessComponent;
  let fixture: ComponentFixture<SigmaGraphicAllProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaGraphicAllProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaGraphicAllProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
