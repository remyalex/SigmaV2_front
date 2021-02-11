import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaActividadDocumentosDeleteComponent } from './sigma-actividad-documentos-delete.component';

describe('SigmaActividadDocumentosDeleteComponent', () => {
  let component: SigmaActividadDocumentosDeleteComponent;
  let fixture: ComponentFixture<SigmaActividadDocumentosDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaActividadDocumentosDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaActividadDocumentosDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
