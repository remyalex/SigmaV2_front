import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FotoDiagnosticoPkComponent } from './foto-diagnostico-pk.component';

describe('FotoDiagnosticoPkComponent', () => {
  let component: FotoDiagnosticoPkComponent;
  let fixture: ComponentFixture<FotoDiagnosticoPkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FotoDiagnosticoPkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FotoDiagnosticoPkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
